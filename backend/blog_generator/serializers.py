from django.contrib.auth.models import User
from rest_framework import serializers
from .models import BlogPost  
class SignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['email'], 
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name']
        )
        return user

class BlogPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        # Definimos qué campos queremos enviarle al Frontend
        fields = ['id', 'title', 'youtube_url', 'content', 'created_at']