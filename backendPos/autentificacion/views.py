from django.shortcuts import render
from rest_framework import viewsets
from .serializer import (RolesSerializer, UsuarioSerializer, CategoriasProductosSerializer,
    ProductoSerializer, SalonSerializer, MesasSerializer,ClientesSerializer, 
    OrdenesSerializer, PagosVentaSerializer,RegistroAnulacionSerializer,VentaSerializer,
    MovimientosCajaSerializer, SesionCajaSerializer)

from .models import (
    Roles, Usuarios, CategoriasProductos, Productos, Salones, Mesas, Clientes,
    Ordenes, Ventas, PagosVenta, RegistrosAnulacion,
    SesionesCaja, MovimientosCaja
)

# Create your views here.

class RolViewSet(viewsets.ModelViewSet):
    """ ViewSet para el modelo Rol. """
    serializer_class = RolesSerializer    
    queryset = Roles.objects.all()

class UsuarioViewSet(viewsets.ModelViewSet):
    """ ViewSet para el modelo Usuario. """
    serializer_class = UsuarioSerializer
    queryset = Usuarios.objects.all()


# --- SECCIÓN 2: INVENTARIO, PRODUCTOS, MESAS Y SALONES ---

class CategoriaProductoViewSet(viewsets.ModelViewSet):
    """ ViewSet para el modelo CategoriaProducto. """
    serializer_class = CategoriasProductosSerializer
    queryset = CategoriasProductos.objects.all()

class ProductoViewSet(viewsets.ModelViewSet):
    """ ViewSet para el modelo Producto. """
    serializer_class = ProductoSerializer
    queryset = Productos.objects.all()

class SalonViewSet(viewsets.ModelViewSet):
    """ ViewSet para el modelo Salon. """
    serializer_class = SalonSerializer
    queryset = Salones.objects.all()

class MesaViewSet(viewsets.ModelViewSet):
    """ ViewSet para el modelo Mesa. """
    serializer_class = MesasSerializer
    queryset = Mesas.objects.all()


# --- SECCIÓN 3: FACTURACIÓN, ÓRDENES Y CLIENTES ---

class ClienteViewSet(viewsets.ModelViewSet):
    """ ViewSet para el modelo Cliente. """
    serializer_class = ClientesSerializer
    queryset = Clientes.objects.all()

class OrdenViewSet(viewsets.ModelViewSet):
    """ ViewSet para el modelo Orden. """
    serializer_class = OrdenesSerializer
    queryset = Ordenes.objects.all()

# class DetalleOrdenViewSet(viewsets.ModelViewSet):
#     """ ViewSet para el modelo DetalleOrden. """
#     serializer_class = DetalleOrdenSerializer
#     queryset = DetalleOrden.objects.all()


# --- SECCIÓN 4: VENTAS Y PAGOS ---

class VentaViewSet(viewsets.ModelViewSet):
    """ ViewSet para el modelo Venta. """
    serializer_class = VentaSerializer
    queryset = Ventas.objects.all()

class PagoVentaViewSet(viewsets.ModelViewSet):
    """ ViewSet para el modelo PagoVenta. """
    serializer_class = PagosVentaSerializer
    queryset = PagosVenta.objects.all()

class RegistroAnulacionViewSet(viewsets.ModelViewSet):
    """ ViewSet para el modelo RegistroAnulacion. """
    serializer_class = RegistroAnulacionSerializer
    queryset = RegistrosAnulacion.objects.all()


# --- SECCIÓN 5: GESTIÓN DE CAJA ---

class SesionCajaViewSet(viewsets.ModelViewSet):
    """ ViewSet para el modelo SesionCaja. """
    serializer_class = SesionCajaSerializer
    queryset = SesionesCaja.objects.all()

class MovimientoCajaViewSet(viewsets.ModelViewSet):
    """ ViewSet para el modelo MovimientoCaja. """
    serializer_class = MovimientosCajaSerializer
    queryset = MovimientosCaja.objects.all()
