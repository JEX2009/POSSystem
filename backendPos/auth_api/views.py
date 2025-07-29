from rest_framework.views import APIView
from autentificacion.models import Usuario
from django.contrib.auth.hashers import check_password
from rest_framework.response import Response
from rest_framework import status 
from autentificacion.token import AuthToken
# Create your views here.

class LoginView(APIView):
    """
    Vista para retornar el template de login.
    """
    def post(self, request, *args, **kwargs):
        usuario = request.data.get('nombre_usuario')
        password = request.data.get('password')
        
        try :
            usuarioConfirmado = Usuario.objects.get(nombre_usuario=usuario)
            #Aca termina solo se usa el try para evitar un error
        except Usuario.DoesNotExist:
            return Response({"error": "Credenciales inválidas"}, status=status.HTTP_401_UNAUTHORIZED)
        
        if not check_password(password, usuarioConfirmado.hash_contrasena):
            # 4. Devolvemos error genérico por seguridad
            return Response({"error": "Credenciales inválidas"}, status=status.HTTP_401_UNAUTHORIZED)

        token, created = AuthToken.objects.get_or_create(user_id=usuarioConfirmado.id)

        # 7. Devolvemos una respuesta JSON exitosa con el token
        return Response({
            'token': token.key,
            'usuario': {
                'id': usuarioConfirmado.id,
                'nombre_usuario': usuarioConfirmado.nombre_usuario,
            }
        }, status=status.HTTP_200_OK)
