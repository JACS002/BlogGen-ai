from django.db import models
from django.contrib.auth.models import User # <--- Importante

class BlogPost(models.Model):
    # Relación: Si se borra el usuario, se borran sus blogs (CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE) 
    
    youtube_url = models.URLField(max_length=200)
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title