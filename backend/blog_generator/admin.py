from django.contrib import admin
from .models import BlogPost

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    # 1. Columnas que se verán en la lista
    list_display = ('title', 'user', 'youtube_url', 'created_at')
    
    # 2. Barra de búsqueda
    search_fields = ('title', 'content')
    
    # 3. Filtros laterales
    list_filter = ('user', 'created_at')