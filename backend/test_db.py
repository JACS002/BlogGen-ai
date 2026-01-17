import psycopg2
import sys

print(f"Versión de Python: {sys.version}")
print("--- Intentando conectar a la base de datos ---")

try:
    # Estos datos son los mismos que pusimos en settings.py
    connection = psycopg2.connect(
        dbname="ai_blog_db",
        user="usuario_blog",
        password="password_secreto",
        host="localhost",
        port="5432"
    )
    print("✅ ¡ÉXITO! La conexión directa con psycopg2 funciona.")
    connection.close()
    
except Exception as e:
    print("❌ ERROR FATAL conectando directamente:")
    print(e)
    
    # Vamos a ver si el error es por tu usuario de Windows
    import os
    user = os.getenv('USERNAME')
    print(f"\n🕵️ Dato detective: Tu usuario de Windows es: '{user}'")
    if user and any(ord(c) > 127 for c in user):
        print("⚠️ ¡ALERTA! Tu usuario tiene caracteres especiales (tildes/ñ).")
        print("Esto suele romper psycopg2 en Windows.")