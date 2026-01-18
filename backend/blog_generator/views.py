import os
import glob
import dotenv
import yt_dlp
from groq import Groq

from django.contrib.auth.models import User
from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import BlogPost
from .serializers import (
    ChangePasswordSerializer, 
    SignupSerializer, 
    BlogPostSerializer, 
    UserSerializer
)

# cargar variables de entorno
dotenv.load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = Groq(api_key=GROQ_API_KEY)


# ==============================================================================
# 1. AUTENTICACIÓN Y USUARIOS
# ==============================================================================

# vista de registro (pública)
@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    serializer = SignupSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# vista de logout (borra la cookie)
@api_view(['POST'])
def logout_view(request):
    response = Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
    response.delete_cookie('access_token')
    return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)

# login personalizado para usar cookies http-only
class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            token = response.data['access']
            response.set_cookie(
                'access_token',
                token,
                httponly=True,
                samesite='Lax',
                secure=False, # cambiar a True en producción con https
                path='/',
                max_age=3600 * 24
            )
            # borramos el token del body para forzar el uso de cookie
            if 'access' in response.data:
                del response.data['access']
            if 'refresh' in response.data:
                del response.data['refresh']
        
        return response

# vista para ver, editar y borrar el perfil propio
class ManageUserView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

# vista para cambiar contraseña
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    serializer = ChangePasswordSerializer(data=request.data)
    
    if serializer.is_valid():
        user = request.user
        
        # verificar contraseña antigua
        if not user.check_password(serializer.data.get('old_password')):
            return Response(
                {"old_password": ["Wrong password."]}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # asignar nueva contraseña
        user.set_password(serializer.data.get('new_password'))
        user.save()
        
        return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ==============================================================================
# 2. GESTIÓN DE BLOGS (CRUD)
# ==============================================================================

# listar blogs del usuario
class BlogListAPIView(generics.ListAPIView):
    serializer_class = BlogPostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # filtra solo los blogs del usuario actual
        return BlogPost.objects.filter(user=self.request.user).order_by('-created_at')

# detalle, actualizar y borrar un blog específico
class BlogDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BlogPostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return BlogPost.objects.filter(user=self.request.user)


# ==============================================================================
# 3. GENERACIÓN DE CONTENIDO (IA)
# ==============================================================================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_blog_topic(request):
    yt_url = request.data.get('youtube_url')
    
    if not yt_url:
        return Response({'error': 'URL is required'}, status=status.HTTP_400_BAD_REQUEST)

    print(f" Usuario {request.user.email} procesando: {yt_url}")

    # --- fase 1: extracción con yt-dlp ---
    ydl_opts = {
        'quiet': True, 'no_warnings': True, 'skip_download': True,
        'writesubtitles': True, 'writeautomaticsub': True,
        'sublangs': ['es', 'en'], 'outtmpl': '%(id)s',
    }
    
    transcript_text = ""
    video_title = "Untitled"
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(yt_url, download=True)
            video_id = info.get('id')
            video_title = info.get('title', 'Untitled')

        # buscar archivos de subtítulos generados
        generated_files = glob.glob(f"{video_id}*.vtt")
        if generated_files:
            subtitle_file = generated_files[0]
            with open(subtitle_file, 'r', encoding='utf-8') as f:
                lines = f.readlines()
                clean_lines = []
                seen_lines = set()
                for line in lines:
                    # limpieza básica de formato vtt
                    if '-->' in line or line.strip() == '' or 'WEBVTT' in line or '<' in line: continue
                    text_line = line.strip()
                    if text_line not in seen_lines:
                        clean_lines.append(text_line)
                        seen_lines.add(text_line)
                transcript_text = " ".join(clean_lines)
            os.remove(subtitle_file)
        else:
            # fallback a la descripción si no hay subtítulos
            transcript_text = info.get('description', '')

    except Exception as e:
        return Response({'error': f"Error extracting video: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # validación de longitud para proteger la ia
    MAX_CHARS = 100000
    if len(transcript_text) > MAX_CHARS:
        return Response(
            {'error': 'The video is too long to process (Limit exceeded). Please try a video shorter than 30 minutes.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # --- fase 2: inteligencia artificial (groq) ---
    try:
        print(" Enviando a Groq (LPU Inference)...")
        
        MODEL_NAME = "llama-3.3-70b-versatile"

        prompt_system = """
        You are an expert technical blog writer. 
        Your goal is to convert a raw YouTube video transcript into a polished, engaging, and SEO-optimized blog post in Markdown.
        
        Rules:
        1. Title: Create a catchy H1 title at the very top.
        2. Structure: Use H2 for main sections and H3 for subsections.
        3. Content: Synthesize the transcript. Remove filler words. Make it readable.
        4. Tone: Professional, informative, yet accessible.
        5. Formatting: STRICTLY use Markdown (bold, lists, code blocks).
        6. Language: If the transcript is in Spanish, write in Spanish. If English, write in English.
        """
        
        completion = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": prompt_system},
                {"role": "user", "content": f"Transcript:\n{transcript_text}"}
            ],
            temperature=0.7,
            max_tokens=4000,
        )
        
        ai_generated_content = completion.choices[0].message.content

    except Exception as e:
        print(f"Error Groq: {e}")
        return Response(
            {'error': 'Error generating content with AI. Please try again later.'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    # --- fase 3: guardar ---
    new_post = BlogPost.objects.create(
        user=request.user,
        youtube_url=yt_url,
        title=video_title, 
        content=ai_generated_content 
    )

    return Response({
        'id': new_post.id,
        'title': new_post.title,
        'content': new_post.content
    })