# myapi/serializers.py

from rest_framework import serializers
# Asumimos que tus modelos están en un archivo 'models.py' en la misma app
from .models import (
    Roles, Usuarios, CategoriasProductos, Productos, Salones, Mesas, Clientes,
    Ordenes, Ventas, PagosVenta, RegistrosAnulacion,
    SesionesCaja, MovimientosCaja
)

class RolesSerializer(serializers.ModelSerializer):
    """ Serializer para el modelo Roles. """
    class Meta:
        model = Roles
        fields = '__all__'

class UsuarioSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Usuario.
    Muestra el nombre del Roles en lugar de solo su ID para mayor claridad.
    """
    # Para mostrar el objeto completo del Roles en lugar de solo el ID.
    # Si solo quieres el ID, puedes quitar esta línea.
    Roles = RolesSerializer(read_only=True)
    # Campo extra para aceptar el ID del Roles al crear/actualizar un usuario.
    id_Roles = serializers.IntegerField(write_only=True)

    class Meta:
        model = Usuarios
        # Excluimos el hash de la contraseña por seguridad en las respuestas GET.
        fields = ['id', 'nombre_usuario', 'nombre_completo', 'Roles', 'id_Roles', 'activo', 'fecha_creacion']
        extra_kwargs = {
            'hash_contrasena': {'write_only': True} # Solo para escritura (crear/actualizar)
        }


class CategoriasProductosSerializer(serializers.ModelSerializer):
    """ Serializer para las categorías de productos. """
    class Meta:
        model = CategoriasProductos
        fields = '__all__'

class ProductoSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Productos.
    Muestra el nombre de la categoría.
    """
    categoria = CategoriasProductosSerializer(read_only=True)
    id_categoria = serializers.IntegerField(write_only=True)

    class Meta:
        model = Productos
        fields = [
            'id', 'nombre', 'codigo_cabys', 'categoria', 'id_categoria', 'costo',
            'precio_base', 'porcentaje_iva', 'stock_actual', 'contRolesa_stock'
        ]

class SalonSerializer(serializers.ModelSerializer):
    """ Serializer para los salones. """
    class Meta:
        model = Salones
        fields = '__all__'

class MesasSerializer(serializers.ModelSerializer):
    """
    Serializer para las Mesass.
    Muestra el nombre del salón al que pertenece.
    """
    salon = SalonSerializer(read_only=True)
    id_salon = serializers.IntegerField(write_only=True)

    class Meta:
        model = Mesas
        fields = ['id', 'nombre', 'salon', 'id_salon', 'posicion_x', 'posicion_y', 'rotacion', 'estado']

class ClientesSerializer(serializers.ModelSerializer):
    """ Serializer para los Clientess. """
    class Meta:
        model = Clientes
        fields = '__all__'

# class DetallesOrdenesSerializer(serializers.ModelSerializer):
#     """
#     Serializer para los detalles de una Ordenes.
#     Muestra la información completa del Productos.
#     """
#     Productos = ProductoSerializer(read_only=True)
#     id_producto = serializers.IntegerField(write_only=True)

#     class Meta:
#         model = DetallesOrdenes
#         fields = [
#             'id', 'id_Ordenes', 'Productos', 'id_producto', 'cantidad',
#             'precio_unitario_base', 'porcentaje_iva_aplicado', 'comentarios'
#         ]

class OrdenesSerializer(serializers.ModelSerializer):
    """
    Serializer para las órdenes.
    Incluye los detalles de la Ordenes (los productos) de forma anidada.
    """
    # Muestra todos los detalles asociados a esta Ordenes
    # detalles = DetallesOrdenesSerializer(many=True, read_only=True)
    # Muestra la información de la Mesas, usuario y Clientes
    Mesas = MesasSerializer(read_only=True)
    usuario_creador = UsuarioSerializer(read_only=True)
    Clientes = ClientesSerializer(read_only=True)

    # Campos de solo escritura para recibir los IDs al crear/actualizar
    id_Mesas = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    id_usuario_creador = serializers.IntegerField(write_only=True)
    id_Clientes = serializers.IntegerField(write_only=True, required=False, allow_null=True)


    class Meta:
        model = Ordenes
        fields = [
            'id', 'Mesas', 'usuario_creador', 'Clientes', 'tipo', 'estado',
            'fecha_apertura', 'detalles', 'id_Mesas', 'id_usuario_creador', 'id_Clientes'
        ]



class PagosVentaSerializer(serializers.ModelSerializer):
    """ Serializer para los pagos de una venta. """
    class Meta:
        model = PagosVenta
        fields = '__all__'

class VentaSerializer(serializers.ModelSerializer):
    """
    Serializer para las ventas.
    Incluye los pagos y la información de la Ordenes.
    """
    pagos = PagosVentaSerializer(many=True, read_only=True)
    Ordenes = OrdenesSerializer(read_only=True)
    Clientes = ClientesSerializer(read_only=True)
    usuario_vendedor = UsuarioSerializer(read_only=True)

    class Meta:
        model = Ventas
        fields = '__all__'

class RegistroAnulacionSerializer(serializers.ModelSerializer):
    """ Serializer para los registros de anulación de ventas. """
    venta = VentaSerializer(read_only=True)
    usuario_autoriza = UsuarioSerializer(read_only=True)

    class Meta:
        model = RegistrosAnulacion
        fields = '__all__'


class MovimientosCajaSerializer(serializers.ModelSerializer):
    """ Serializer para los movimientos de caja (entradas/salidas). """
    usuario = UsuarioSerializer(read_only=True)

    class Meta:
        model = MovimientosCaja
        fields = '__all__'

class SesionCajaSerializer(serializers.ModelSerializer):
    """
    Serializer para las sesiones de caja.
    Incluye todos los movimientos de caja asociados.
    """
    movimientos = MovimientosCajaSerializer(many=True, read_only=True)
    usuario_apertura = UsuarioSerializer(read_only=True)
    usuario_cierre = UsuarioSerializer(read_only=True)

    class Meta:
        model = SesionesCaja
        fields = '__all__'
