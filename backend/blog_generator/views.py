from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import BlogPost

@csrf_exempt  # Importante: Permite que React (que está en otro puerto) envíe datos sin bloqueo de seguridad por ahora.
def generate_blog_topic(request):
    if request.method == 'POST':
        try:
            # 1. Decodificar los datos que vienen del Frontend (React)
            data = json.loads(request.body)
            yt_url = data.get('youtube_url')

            if not yt_url:
                return JsonResponse({'error': 'Falta la URL de YouTube'}, status=400)

            # 2. Lógica Simulada (Aquí irá la IA en el futuro)
            # Por ahora, solo simulamos que "procesamos" el video
            blog_title = f"Resumen del video: {yt_url}"
            blog_content = "Aquí irá el contenido generado por IA increiblemente detallado..."

            # 3. Guardar en la Base de Datos
            new_post = BlogPost.objects.create(
                youtube_url=yt_url,
                title=blog_title,
                content=blog_content
            )

            # 4. Devolver la respuesta JSON al Frontend
            return JsonResponse({
                'id': new_post.id,
                'title': new_post.title,
                'content': new_post.content,
                'youtube_url': new_post.youtube_url,
                'created_at': new_post.created_at
            })

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Método no permitido'}, status=405)