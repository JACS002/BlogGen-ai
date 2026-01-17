from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .serializers import SignupSerializer
from .models import BlogPost
from rest_framework_simplejwt.views import TokenObtainPairView

# Librerías de extracción (Sin OpenAI por ahora)
import yt_dlp
import os
import glob

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
@permission_classes([IsAuthenticated]) # <--- REQUISITO: Token JWT válido en el Header
def generate_blog_topic(request):
    # DRF ya procesó el JSON por nosotros en request.data
    yt_url = request.data.get('youtube_url')
    
    if not yt_url:
        return Response({'error': 'Falta URL'}, status=status.HTTP_400_BAD_REQUEST)

    # Imprimimos en consola quién está haciendo la petición para verificar el Login
    print(f"🔄 Usuario {request.user.email} solicitó generar blog para: {yt_url}")

    # --- FASE 1: EXTRACCIÓN (yt-dlp) ---
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
                    # Limpieza de basura VTT
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
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # --- FASE 2: IA (PENDIENTE) ---
    # Aquí irá OpenAI cuando tú me digas.
    # Por ahora, pasamos directo a guardar la transcripción cruda.

    # --- FASE 3: GUARDAR ---
    new_post = BlogPost.objects.create(
        user=request.user,
        youtube_url=yt_url,
        title=video_title,
        content=transcript_text # Guardamos el texto extraído tal cual
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
            
            # CONFIGURACIÓN EXACTA PARA LOCALHOST / 127.0.0.1
            response.set_cookie(
                'access_token',     # Nombre exacto
                token,
                httponly=True,      # Seguridad
                samesite='Lax',     # 'Lax' es lo mejor para desarrollo local
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