from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import BlogPost
import yt_dlp

@csrf_exempt
def generate_blog_topic(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            yt_url = data.get('youtube_url')
            
            if not yt_url:
                return JsonResponse({'error': 'Falta URL'}, status=400)

            print(f"🔄 Procesando con yt-dlp (Metadatos): {yt_url}")

            # Configuración para ser sigilosos y rápidos
            ydl_opts = {
                'quiet': True,
                'no_warnings': True,
                'skip_download': True, # Solo queremos info, no el video
                'extract_flat': True,  # Extracción rápida
            }

            video_title = "Sin título"
            description = "Sin descripción"
            video_id = "unknown"

            try:
                with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                    info = ydl.extract_info(yt_url, download=False)
                    
                    video_id = info.get('id', 'unknown')
                    video_title = info.get('title', 'Sin título')
                    description = info.get('description', '')

            except Exception as e:
                print(f"❌ Error yt-dlp: {e}")
                return JsonResponse({'error': f'No se pudo procesar el video. ¿Es privado?'}, status=400)
            
            # -------------------------------------------
            # PREPARACIÓN PARA LA IA
            # Como YouTube nos bloqueó los subtítulos, usaremos la Descripción
            # para alimentar a la IA.
            
            content_source = f"""
            TÍTULO DEL VIDEO: {video_title}
            
            DESCRIPCIÓN/RESUMEN:
            {description}
            
            (Nota: Subtítulos no disponibles por bloqueo de IP, usando metadatos para generación).
            """

            # Guardamos en la Base de Datos
            new_post = BlogPost.objects.create(
                youtube_url=yt_url,
                title=video_title,
                content=content_source
            )

            print("✅ ¡Datos extraídos con éxito!")

            return JsonResponse({
                'id': new_post.id,
                'title': new_post.title,
                'content': new_post.content,
                'youtube_url': new_post.youtube_url,
                'created_at': new_post.created_at
            })

        except Exception as e:
            print(f"🔥 ERROR GENERAL: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Método no permitido'}, status=405)