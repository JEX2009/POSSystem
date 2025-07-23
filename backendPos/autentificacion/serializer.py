from rest_framework import serializers
# CAMBIO: Se importan los nombres de modelos en singular para que coincidan con models.py
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
        # CAMBIO: Modelo actualizado a singular
        model = Rol
        fields = '__all__'

class UsuarioSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Usuario.
    Muestra el nombre del rol en lugar de solo su ID para mayor claridad.
    """
    # CAMBIO: Nombre de campo y serializer actualizados a singular
    rol = RolSerializer(read_only=True)
    # CAMBIO: Campo de solo escritura para recibir el ID del rol
    rol_id = serializers.IntegerField(write_only=True)

    class Meta:
        # CAMBIO: Modelo actualizado a singular
        model = Usuario
        fields = [
            'id', 'nombre_usuario', 'nombre_completo', 'rol', 'rol_id',
            'activo', 'fecha_creacion', 'hash_contrasena'
        ]
        # Esta parte asegura que el campo solo sea para escribir, no para leer.
        extra_kwargs = {
            'hash_contrasena': {'write_only': True}
        }

# #####################################################################
# # SECCIÓN 2: INVENTARIO, PRODUCTOS, MESAS Y SALONES
# #####################################################################

class CategoriaProductoSerializer(serializers.ModelSerializer):
    """ Serializer para las categorías de productos. """
    class Meta:
        # CAMBIO: Modelo actualizado a singular
        model = CategoriaProducto
        fields = '__all__'

class ProductoSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Producto.
    Muestra el nombre de la categoría.
    """
    # CAMBIO: Serializer de categoría actualizado
    categoria = CategoriaProductoSerializer(read_only=True)
    # CAMBIO: Campo de solo escritura para el ID de la categoría
    categoria_id = serializers.IntegerField(write_only=True)

    class Meta:
        # CAMBIO: Modelo actualizado a singular
        model = Producto
        # CAMBIO: Nombres de campos actualizados y corregido el typo 'contRolesa_stock'
        fields = [
            'id', 'nombre', 'codigo_cabys', 'categoria', 'categoria_id', 'costo',
            'precio_base', 'porcentaje_iva', 'stock_actual', 'controla_stock'
        ]

class SalonSerializer(serializers.ModelSerializer):
    """ Serializer para los salones. """
    class Meta:
        # CAMBIO: Modelo actualizado a singular
        model = Salon
        fields = '__all__'

class MesaSerializer(serializers.ModelSerializer):
    """
    Serializer para las mesas.
    Muestra el nombre del salón al que pertenece.
    """
    salon = SalonSerializer(read_only=True)
    # CAMBIO: Campo de solo escritura para el ID del salón
    salon_id = serializers.IntegerField(write_only=True)

    class Meta:
        # CAMBIO: Modelo actualizado a singular
        model = Mesa
        fields = ['id', 'nombre', 'salon', 'salon_id', 'posicion_x', 'posicion_y', 'rotacion', 'estado']

# #####################################################################
# # SECCIÓN 3: FACTURACIÓN, ÓRDENES Y CLIENTES
# #####################################################################

class ClienteSerializer(serializers.ModelSerializer):
    """ Serializer para los clientes. """
    class Meta:
        # CAMBIO: Modelo actualizado a singular
        model = Cliente
        fields = '__all__'

class DetalleOrdenSerializer(serializers.ModelSerializer):
    """
    Serializer para los detalles de una orden.
    Muestra la información completa del producto.
    """
    # CAMBIO: Nombre de campo y serializer actualizados
    producto = ProductoSerializer(read_only=True)
    producto_id = serializers.IntegerField(write_only=True)

    class Meta:
        # CAMBIO: Modelo actualizado a singular
        model = DetalleOrden
        # CAMBIO: Nombres de campos actualizados
        fields = [
            'id', 'orden', 'producto', 'producto_id', 'cantidad',
            'precio_unitario_base', 'porcentaje_iva_aplicado', 'comentarios'
        ]

class OrdenSerializer(serializers.ModelSerializer):
    """
    Serializer para las órdenes.
    Incluye los detalles de la orden (los productos) de forma anidada.
    """
    # CAMBIO: Nombres de campos y serializers actualizados
    detalles = DetalleOrdenSerializer(many=True, read_only=True)
    mesa = MesaSerializer(read_only=True)
    usuario_creador = UsuarioSerializer(read_only=True)
    cliente = ClienteSerializer(read_only=True)

    # CAMBIO: Campos de solo escritura para recibir los IDs
    mesa_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    usuario_creador_id = serializers.IntegerField(write_only=True)
    cliente_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)

    class Meta:
        # CAMBIO: Modelo actualizado a singular
        model = Orden
        # CAMBIO: Nombres de campos actualizados
        fields = [
            'id', 'mesa', 'usuario_creador', 'cliente', 'tipo', 'estado',
            'fecha_apertura', 'detalles', 'mesa_id', 'usuario_creador_id', 'cliente_id'
        ]

# #####################################################################
# # SECCIÓN 4: VENTAS Y PAGOS
# #####################################################################

class PagoVentaSerializer(serializers.ModelSerializer):
    """ Serializer para los pagos de una venta. """
    class Meta:
        # CAMBIO: Modelo actualizado a singular
        model = PagoVenta
        fields = '__all__'

class VentaSerializer(serializers.ModelSerializer):
    """
    Serializer para las ventas.
    Incluye los pagos y la información de la orden.
    """
    pagos = PagoVentaSerializer(many=True, read_only=True)
    # CAMBIO: Nombres de campos y serializers actualizados
    orden = OrdenSerializer(read_only=True)
    cliente = ClienteSerializer(read_only=True)
    usuario_vendedor = UsuarioSerializer(read_only=True)

    class Meta:
        # CAMBIO: Modelo actualizado a singular
        model = Venta
        fields = '__all__'

class RegistroAnulacionSerializer(serializers.ModelSerializer):
    """ Serializer para los registros de anulación de ventas. """
    venta = VentaSerializer(read_only=True)
    usuario_autoriza = UsuarioSerializer(read_only=True)

    class Meta:
        # CAMBIO: Modelo actualizado a singular
        model = RegistroAnulacion
        fields = '__all__'

# #####################################################################
# # SECCIÓN 5: GESTIÓN DE CAJA
# #####################################################################

class MovimientoCajaSerializer(serializers.ModelSerializer):
    """ Serializer para los movimientos de caja (entradas/salidas). """
    usuario = UsuarioSerializer(read_only=True)

    class Meta:
        # CAMBIO: Modelo actualizado a singular
        model = MovimientoCaja
        fields = '__all__'

class SesionCajaSerializer(serializers.ModelSerializer):
    """
    Serializer para las sesiones de caja.
    Incluye todos los movimientos de caja asociados.
    """
    movimientos = MovimientoCajaSerializer(many=True, read_only=True)
    usuario_apertura = UsuarioSerializer(read_only=True)
    usuario_cierre = UsuarioSerializer(read_only=True)

    class Meta:
        # CAMBIO: Modelo actualizado a singular
        model = SesionCaja
        fields = '__all__'