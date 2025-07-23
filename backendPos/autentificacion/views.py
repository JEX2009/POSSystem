from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password
from .serializer import (
    RolSerializer, UsuarioSerializer, CategoriaProductoSerializer,
    ProductoSerializer, SalonSerializer, MesaSerializer, ClienteSerializer,
    DetalleOrdenSerializer, OrdenSerializer, PagoVentaSerializer, VentaSerializer,
    RegistroAnulacionSerializer, MovimientoCajaSerializer, SesionCajaSerializer
)
from .models import (
    Rol, Usuario, CategoriaProducto, Producto, Salon, Mesa, Cliente,
    Orden, DetalleOrden, Venta, PagoVenta, RegistroAnulacion,
    SesionCaja, MovimientoCaja
)

# #####################################################################
# # VISTAS PARA LA API
# #####################################################################

class RolViewSet(viewsets.ModelViewSet):
    """ ViewSet para el modelo Rol. """
    # CAMBIO: Nombres de serializer y modelo actualizados
    serializer_class = RolSerializer
    queryset = Rol.objects.all()

class UsuarioViewSet(viewsets.ModelViewSet):
    """
    ViewSet para el modelo Usuario con manejo seguro de contraseñas.
    """
    serializer_class = UsuarioSerializer
    queryset = Usuario.objects.all()

    def create(self, request, *args, **kwargs):
        """
        Sobrescribe el método POST para hashear la contraseña al crear un usuario.
        """
        # Obtiene los datos de la petición
        data = request.data.copy() # Usamos .copy() para poder modificar los datos
        
        # Hashea la contraseña antes de guardarla
        data['hash_contrasena'] = make_password(data['hash_contrasena'])
        
        # Creamos un nuevo serializador con los datos modificados
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        """
        Sobrescribe los métodos PUT y PATCH para hashear la contraseña si se está actualizando.
        """
        # Obtiene el objeto de usuario que se va a actualizar
        instance = self.get_object()
        # Obtiene los datos de la petición
        data = request.data.copy()
        
        # Verifica si el campo 'hash_contrasena' viene en la petición
        if 'hash_contrasena' in data:
            # Si viene, la hashea
            data['hash_contrasena'] = make_password(data['hash_contrasena'])
        
        # Procede con la actualización normal
        serializer = self.get_serializer(instance, data=data, partial=kwargs.get('partial', False))
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

class CategoriaProductoViewSet(viewsets.ModelViewSet):
    """ ViewSet para el modelo CategoriaProducto. """
    # CAMBIO: Nombres de serializer y modelo actualizados
    serializer_class = CategoriaProductoSerializer
    queryset = CategoriaProducto.objects.all()

class ProductoViewSet(viewsets.ModelViewSet):
    """ ViewSet para el modelo Producto. """
    # CAMBIO: Nombre del modelo en queryset actualizado
    serializer_class = ProductoSerializer
    queryset = Producto.objects.all()

class SalonViewSet(viewsets.ModelViewSet):
    """ ViewSet para el modelo Salon. """
    # CAMBIO: Nombre del modelo en queryset actualizado
    serializer_class = SalonSerializer
    queryset = Salon.objects.all()

class MesaViewSet(viewsets.ModelViewSet):
    """ ViewSet para el modelo Mesa. """
    # CAMBIO: Nombres de serializer y modelo actualizados
    serializer_class = MesaSerializer
    queryset = Mesa.objects.all()

class ClienteViewSet(viewsets.ModelViewSet):
    """ ViewSet para el modelo Cliente. """
    # CAMBIO: Nombres de serializer y modelo actualizados
    serializer_class = ClienteSerializer
    queryset = Cliente.objects.all()

class OrdenViewSet(viewsets.ModelViewSet):
    """ ViewSet para el modelo Orden. """
    # CAMBIO: Nombres de serializer y modelo actualizados
    serializer_class = OrdenSerializer
    queryset = Orden.objects.all()

class DetalleOrdenViewSet(viewsets.ModelViewSet):
    """ ViewSet para el modelo DetalleOrden. """
    # CAMBIO: Descomentado y actualizado para permitir gestionar los detalles de la orden
    serializer_class = DetalleOrdenSerializer
    queryset = DetalleOrden.objects.all()

class VentaViewSet(viewsets.ModelViewSet):
    """ ViewSet para el modelo Venta. """
    # CAMBIO: Nombre del modelo en queryset actualizado
    serializer_class = VentaSerializer
    queryset = Venta.objects.all()

class PagoVentaViewSet(viewsets.ModelViewSet):
    """ ViewSet para el modelo PagoVenta. """
    # CAMBIO: Nombres de serializer y modelo actualizados
    serializer_class = PagoVentaSerializer
    queryset = PagoVenta.objects.all()

class RegistroAnulacionViewSet(viewsets.ModelViewSet):
    """ ViewSet para el modelo RegistroAnulacion. """
    # CAMBIO: Nombre del modelo en queryset actualizado
    serializer_class = RegistroAnulacionSerializer
    queryset = RegistroAnulacion.objects.all()

class SesionCajaViewSet(viewsets.ModelViewSet):
    """ ViewSet para el modelo SesionCaja. """
    # CAMBIO: Nombre del modelo en queryset actualizado
    serializer_class = SesionCajaSerializer
    queryset = SesionCaja.objects.all()

class MovimientoCajaViewSet(viewsets.ModelViewSet):
    """ ViewSet para el modelo MovimientoCaja. """
    # CAMBIO: Nombres de serializer y modelo actualizados
    serializer_class = MovimientoCajaSerializer
    queryset = MovimientoCaja.objects.all()
