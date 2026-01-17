from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        # Imprimimos todas las cookies que llegan para ver si está la nuestra
        # print(f"🍪 Cookies recibidas: {request.COOKIES}") 
        
        raw_token = request.COOKIES.get('access_token')
        
        if raw_token is None:
            print("❌ AUTENTICACIÓN FALLIDA: No llegó ninguna cookie 'access_token'.")
            return None

        try:
            validated_token = self.get_validated_token(raw_token)
            print(f"✅ TOKEN VALIDADO: Usuario {validated_token.get('user_id')}")
            return self.get_user(validated_token), validated_token
        except AuthenticationFailed as e:
            print(f"⚠️ TOKEN INVÁLIDO: {e}")
            return None
        except Exception as e:
            print(f"🔥 ERROR EXTRAÑO: {e}")
            return None