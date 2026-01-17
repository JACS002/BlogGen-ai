from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import BlogPost
import yt_dlp
import os
import glob

@csrf_exempt
def generate_blog_topic(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            yt_url = data.get('youtube_url')
            
            if not yt_url:
                return JsonResponse({'error': 'Falta URL'}, status=400)

            print(f"🔄 1. Descargando subtítulos con yt-dlp para: {yt_url}")

            # Configuración para descargar SOLO el archivo de subtítulos
            ydl_opts = {
                'quiet': True,
                'no_warnings': True,
                'skip_download': True,      # No bajar el video (ahorra tiempo y espacio)
                'writesubtitles': True,     # Bajar subs manuales si existen
                'writeautomaticsub': True,  # Bajar subs automáticos (IMPORTANTE)
                'sublangs': ['es', 'en'],   # Preferencia: Español o Inglés
                'outtmpl': '%(id)s',        # El archivo se llamará como el ID del video
            }

            video_title = "Sin título"
            transcript_text = ""
            video_id = ""

            try:
                # 1. Ejecutamos la descarga de metadatos y subtítulos
                with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                    info = ydl.extract_info(yt_url, download=True)
                    video_id = info.get('id')
                    video_title = info.get('title')

                # 2. Buscamos el archivo .vtt que se acaba de crear
                # yt-dlp suele nombrarlos como "ID.es.vtt" o "ID.en.vtt"
                generated_files = glob.glob(f"{video_id}*.vtt")
                
                if generated_files:
                    subtitle_file = generated_files[0] # Tomamos el primero que encuentre
                    print(f"📄 Leyendo archivo físico: {subtitle_file}")
                    
                    # Leemos el archivo y limpiamos el formato WebVTT
                    with open(subtitle_file, 'r', encoding='utf-8') as f:
                        lines = f.readlines()
                        clean_lines = []
                        seen_lines = set() # Para evitar duplicados (común en subs automáticos)
                        
                        for line in lines:
                            # Filtros de limpieza:
                            if '-->' in line: continue        # Elimina tiempos (00:00:10 --> 00:00:15)
                            if line.strip() == '': continue   # Elimina líneas vacías
                            if line.strip() == 'WEBVTT': continue # Elimina cabecera
                            if '<' in line and '>' in line: continue # Intenta quitar etiquetas raras
                            
                            # Evitar repeticiones exactas consecutivas
                            text_line = line.strip()
                            if text_line in seen_lines: continue
                            
                            clean_lines.append(text_line)
                            seen_lines.add(text_line)
                        
                        transcript_text = " ".join(clean_lines)

                    # 3. Limpieza: Borramos el archivo del disco para no dejar basura
                    os.remove(subtitle_file)
                    print("🧹 Archivo temporal eliminado.")
                
                else:
                    print("⚠️ No se descargó archivo de subtítulos. Usando descripción como respaldo.")
                    # Si falla, usamos la descripción para no devolver vacío
                    transcript_text = info.get('description', 'No hay descripción disponible.')

            except Exception as e:
                print(f"❌ Error extracción: {e}")
                return JsonResponse({'error': f'Error al extraer datos: {str(e)}'}, status=500)
            
            # --- GUARDAR EN BD (SIN IA) ---
            # Guardamos la transcripción pura para verla en el Frontend
            new_post = BlogPost.objects.create(
                youtube_url=yt_url,
                title=f"TRANSCRIPCIÓN: {video_title}",
                content=transcript_text
            )

            print("✅ ¡Datos guardados y enviados!")

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