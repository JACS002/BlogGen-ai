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
    
    # Refresh: Para cuando el token caduca (avanzado)
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
]