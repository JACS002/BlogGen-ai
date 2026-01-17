from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .serializers import ChangePasswordSerializer, SignupSerializer, BlogPostSerializer, UserSerializer
from rest_framework import generics
from .models import BlogPost
from rest_framework_simplejwt.views import TokenObtainPairView
from groq import Groq
# Librerías de extracción (Sin OpenAI por ahora)
import yt_dlp
import os
import glob
import dotenv

dotenv.load_dotenv()  # Cargar variables de entorno desde el archivo .env
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = Groq(api_key=GROQ_API_KEY)

# --- VISTA DE REGISTRO (Pública) ---
@api_view(['POST'])
@permission_classes([AllowAny]) # Cualquiera puede registrarse sin token
def signup(request):
    serializer = SignupSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Usuario creado exitosamente"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def logout_view(request):
    response = Response({"message": "Logout exitoso"}, status=status.HTTP_200_OK)
    
    # Esta es la orden para destruir la cookie en el navegador
    response.delete_cookie('access_token')
    
    return response

# --- VISTA DE GENERACIÓN ---
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_blog_topic(request):
    yt_url = request.data.get('youtube_url')
    
    if not yt_url:
        return Response({'error': 'Falta URL'}, status=status.HTTP_400_BAD_REQUEST)

    print(f"🔄 Usuario {request.user.email} procesando: {yt_url}")

    # --- FASE 1: EXTRACCIÓN (Igual que antes) ---
    ydl_opts = {
        'quiet': True, 'no_warnings': True, 'skip_download': True,
        'writesubtitles': True, 'writeautomaticsub': True,
        'sublangs': ['es', 'en'], 'outtmpl': '%(id)s',
    }
    
    transcript_text = ""
    video_title = "Sin título"
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(yt_url, download=True)
            video_id = info.get('id')
            video_title = info.get('title')

        generated_files = glob.glob(f"{video_id}*.vtt")
        if generated_files:
            subtitle_file = generated_files[0]
            with open(subtitle_file, 'r', encoding='utf-8') as f:
                lines = f.readlines()
                clean_lines = []
                seen_lines = set()
                for line in lines:
                    if '-->' in line or line.strip() == '' or 'WEBVTT' in line or '<' in line: continue
                    text_line = line.strip()
                    if text_line not in seen_lines:
                        clean_lines.append(text_line)
                        seen_lines.add(text_line)
                transcript_text = " ".join(clean_lines)
            os.remove(subtitle_file)
        else:
            transcript_text = info.get('description', '')

    except Exception as e:
        return Response({'error': f"Error extrayendo video: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    MAX_CHARS = 100000
    if len(transcript_text) > MAX_CHARS:
        return Response(
            {'error': 'The video is too long to process (Limit exceeded). Please try a video shorter than 30 minutes.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # --- FASE 2: INTELIGENCIA ARTIFICIAL (GROQ) ---
    try:
        print(" Enviando a Groq (LPU Inference)...")
        
        # MODELO: Usaremos 'llama-3.3-70b-versatile'
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

    # --- FASE 3: GUARDAR ---
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

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            token = response.data['access']
            
            response.set_cookie(
                'access_token',     # Nombre exacto
                token,
                httponly=True,      # Seguridad
                samesite='Lax',     # 'Lax'
                secure=False,       # False porque no tiene HTTPS
                path='/',           # Disponible en toda la web
                max_age=3600 * 24   
            )
            
            # Borramos el token del cuerpo de la respuesta para forzar el uso de la cookie
            if 'access' in response.data:
                del response.data['access']
            if 'refresh' in response.data:
                del response.data['refresh']
            
        return response
    
class BlogListAPIView(generics.ListAPIView):
    serializer_class = BlogPostSerializer
    permission_classes = [IsAuthenticated] # Solo usuarios logueados

    def get_queryset(self):
        # Esto filtra para que solo veas TUS propios blogs
        return BlogPost.objects.filter(user=self.request.user).order_by('-created_at')
    
class BlogDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BlogPostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filtramos para asegurar que solo puedes borrar/editar TUS propios blogs
        return BlogPost.objects.filter(user=self.request.user)
    

    # Modificamos la herencia para permitir DESTROY (Borrar)
class ManageUserView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    serializer = ChangePasswordSerializer(data=request.data)
    
    if serializer.is_valid():
        user = request.user
        
        # 1. Verificar que la contraseña antigua sea correcta
        if not user.check_password(serializer.data.get('old_password')):
            return Response(
                {"old_password": ["Wrong password."]}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # 2. Asignar la nueva contraseña (hasheada automáticamente)
        user.set_password(serializer.data.get('new_password'))
        user.save()
        
        # 3. Al cambiar contraseña, Django cierra sesión por seguridad.
        # Debemos mantener al usuario logueado o pedirle que loguee de nuevo.
        # En este caso, como usamos JWT/Cookies, el token sigue siendo válido hasta que expire,
        # así que no necesitamos hacer nada extra aquí.
        
        return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)