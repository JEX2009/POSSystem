from rest_framework import serializers
# Se importan los nombres de modelos en singular para que coincidan con models.py
from .models import (
    Rol, Usuario, CategoriaProducto, Producto, Salon, Mesa, Cliente,
    Orden, DetalleOrden, Venta, PagoVenta, RegistroAnulacion,
    SesionCaja, MovimientoCaja
)

# #####################################################################
# # SECCIÓN 1: GESTIÓN DE USUARIOS Y ROLES
# #####################################################################

class RolSerializer(serializers.ModelSerializer):
    """ Serializer para el modelo Rol. """
    class Meta:
        model = Rol
        fields = '__all__'
        # CAMBIO: Se añade 'id' como campo de solo lectura
        read_only_fields = ['id']

class UsuarioSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Usuario.
    """
    rol = RolSerializer(read_only=True)
    rol_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Usuario
        fields = [
            'id', 'nombre_usuario', 'nombre_completo', 'rol', 'rol_id',
            'activo', 'fecha_creacion', 'hash_contrasena'
        ]
        # CAMBIO: Se añade 'id' como campo de solo lectura
        read_only_fields = ['id']
        extra_kwargs = {
            'hash_contrasena': {'write_only': True}
        }

# #####################################################################
# # SECCIÓN 2: INVENTARIO, PRODUCTOS, MESAS Y SALONES
# #####################################################################

class CategoriaProductoSerializer(serializers.ModelSerializer):
    """ Serializer para las categorías de productos. """
    class Meta:
        model = CategoriaProducto
        fields = '__all__'
        # CAMBIO: Se añade 'id' como campo de solo lectura
        read_only_fields = ['id']

class ProductoSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Producto.
    """
    categoria = CategoriaProductoSerializer(read_only=True)
    categoria_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Producto
        fields = [
            'id', 'nombre', 'codigo_cabys', 'categoria', 'categoria_id', 'costo',
            'precio_base', 'porcentaje_iva', 'stock_actual', 'controla_stock'
        ]
        # CAMBIO: Se añade 'id' como campo de solo lectura
        read_only_fields = ['id']

class SalonSerializer(serializers.ModelSerializer):
    """ Serializer para los salones. """
    class Meta:
        model = Salon
        fields = '__all__'
        # CAMBIO: Se añade 'id' como campo de solo lectura
        read_only_fields = ['id']

class MesaSerializer(serializers.ModelSerializer):
    """
    Serializer para las mesas.
    """
    salon = SalonSerializer(read_only=True)
    salon_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Mesa
        fields = ['id', 'nombre', 'salon', 'salon_id', 'posicion_x', 'posicion_y', 'rotacion', 'estado']
        # CAMBIO: Se añade 'id' como campo de solo lectura
        read_only_fields = ['id']

# #####################################################################
# # SECCIÓN 3: FACTURACIÓN, ÓRDENES Y CLIENTES
# #####################################################################

class ClienteSerializer(serializers.ModelSerializer):
    """ Serializer para los clientes. """
    class Meta:
        model = Cliente
        fields = '__all__'
        # CAMBIO: Se añade 'id' como campo de solo lectura
        read_only_fields = ['id']

class DetalleOrdenSerializer(serializers.ModelSerializer):
    """
    Serializer para los detalles de una orden.
    """
    producto = ProductoSerializer(read_only=True)
    producto_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = DetalleOrden
        fields = [
            'id', 'orden', 'producto', 'producto_id', 'cantidad',
            'precio_unitario_base', 'porcentaje_iva_aplicado', 'comentarios'
        ]
        # CAMBIO: Se añade 'id' como campo de solo lectura
        read_only_fields = ['id']

class OrdenSerializer(serializers.ModelSerializer):
    """
    Serializer para las órdenes.
    """
    detalles = DetalleOrdenSerializer(many=True, read_only=True)
    mesa = MesaSerializer(read_only=True)
    usuario_creador = UsuarioSerializer(read_only=True)
    cliente = ClienteSerializer(read_only=True)

    mesa_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    usuario_creador_id = serializers.IntegerField(write_only=True)
    cliente_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = Orden
        fields = [
            'id', 'mesa', 'usuario_creador', 'cliente', 'tipo', 'estado',
            'fecha_apertura', 'detalles', 'mesa_id', 'usuario_creador_id', 'cliente_id'
        ]
        # CAMBIO: Se añade 'id' como campo de solo lectura
        read_only_fields = ['id']

# #####################################################################
# # SECCIÓN 4: VENTAS Y PAGOS
# #####################################################################

class PagoVentaSerializer(serializers.ModelSerializer):
    """ Serializer para los pagos de una venta. """
    class Meta:
        model = PagoVenta
        fields = '__all__'
        # CAMBIO: Se añade 'id' como campo de solo lectura
        read_only_fields = ['id']

class VentaSerializer(serializers.ModelSerializer):
    """
    Serializer para las ventas.
    """
    pagos = PagoVentaSerializer(many=True, read_only=True)
    orden = OrdenSerializer(read_only=True)
    cliente = ClienteSerializer(read_only=True)
    usuario_vendedor = UsuarioSerializer(read_only=True)

    class Meta:
        model = Venta
        fields = '__all__'
        # CAMBIO: Se añade 'id' como campo de solo lectura
        read_only_fields = ['id']

class RegistroAnulacionSerializer(serializers.ModelSerializer):
    """ Serializer para los registros de anulación de ventas. """
    venta = VentaSerializer(read_only=True)
    usuario_autoriza = UsuarioSerializer(read_only=True)

    class Meta:
        model = RegistroAnulacion
        fields = '__all__'
        # CAMBIO: Se añade 'id' como campo de solo lectura
        read_only_fields = ['id']

# #####################################################################
# # SECCIÓN 5: GESTIÓN DE CAJA
# #####################################################################

class MovimientoCajaSerializer(serializers.ModelSerializer):
    """ Serializer para los movimientos de caja (entradas/salidas). """
    usuario = UsuarioSerializer(read_only=True)

    class Meta:
        model = MovimientoCaja
        fields = '__all__'
        # CAMBIO: Se añade 'id' como campo de solo lectura
        read_only_fields = ['id']

class SesionCajaSerializer(serializers.ModelSerializer):
    """
    Serializer para las sesiones de caja.
    """
    movimientos = MovimientoCajaSerializer(many=True, read_only=True)
    usuario_apertura = UsuarioSerializer(read_only=True)
    usuario_cierre = UsuarioSerializer(read_only=True)

    class Meta:
        model = SesionCaja
        fields = '__all__'
        # CAMBIO: Se añade 'id' como campo de solo lectura
        read_only_fields = ['id']
