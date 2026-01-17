# Create your models here.
from django.db import models

class BlogPost(models.Model):
    # El ID se crea automáticamente, no hace falta ponerlo.
    
    youtube_url = models.URLField(max_length=200)
    title = models.CharField(max_length=255)
    content = models.TextField()  # TextField es ideal para textos largos como artículos
    created_at = models.DateTimeField(auto_now_add=True) # Se guarda la fecha sola al crear

    def __str__(self):
        return str(self.title)