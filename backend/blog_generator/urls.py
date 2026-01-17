from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
from .views import CustomTokenObtainPairView


urlpatterns = [
    # Ruta protegida
    path('generate-blog', views.generate_blog_topic, name='generate-blog'),
    
    # Rutas de Autenticación
    path('signup', views.signup, name='signup'),
    
    # Login: Nos da el token de acceso
    path('login', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    path('logout', views.logout_view, name='logout'),
    # Refresh: Para cuando el token caduca (avanzado)
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),

    # Lista de blogs del usuario
    path('blog-posts', views.BlogListAPIView.as_view(), name='blog-list'),

    # Detalle, actualización y borrado de un blog específico
    path('blog-posts/<int:pk>/', views.BlogDetailAPIView.as_view(), name='blog-detail'),
]