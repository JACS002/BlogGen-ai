from django.urls import path
from . import views

urlpatterns = [
    # Esta ruta se llamará cuando el frontend pida generar
    path('generate-blog', views.generate_blog_topic, name='generate-blog'),
]