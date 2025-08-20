from rest_framework import serializers
from .models import (
    Rol, Usuario, CategoriaProducto, Producto, Salon, Mesa, Cliente,
    Orden, DetalleOrden, Venta, PagoVenta, RegistroAnulacion,
    SesionCaja, MovimientoCaja
)

# #####################################################################
# # SECCIÓN 1: GESTIÓN DE USUARIOS Y ROLES
# #####################################################################

class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = '__all__'

class UsuarioSerializer(serializers.ModelSerializer):
    rol = RolSerializer(read_only=True)
    rol_id = serializers.IntegerField(write_only=True)
    user_id = serializers.IntegerField(write_only=True, required=True)

    class Meta:
        model = Usuario
        fields = [
            'id', 'user_id', 'nombre_usuario', 'nombre_completo', 'rol', 'rol_id',
            'activo', 'fecha_creacion'
        ]

    def create(self, validated_data):
        rol_id = validated_data.pop('rol_id')
        user_id = validated_data.pop('user_id')
        validated_data['rol'] = Rol.objects.get(id=rol_id)
        validated_data['user'] = User.objects.get(id=user_id)
        return Usuario.objects.create(**validated_data)

    def update(self, instance, validated_data):
        if 'rol_id' in validated_data:
            rol_id = validated_data.pop('rol_id')
            instance.rol = Rol.objects.get(id=rol_id)
        if 'user_id' in validated_data:
            user_id = validated_data.pop('user_id')
            instance.user = User.objects.get(id=user_id)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

# #####################################################################
# # SECCIÓN 2: INVENTARIO, PRODUCTOS, MESAS Y SALONES
# #####################################################################

class CategoriaProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriaProducto
        fields = '__all__'

class ProductoSerializer(serializers.ModelSerializer):
    categoria = CategoriaProductoSerializer(read_only=True)
    categoria_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Producto
        fields = [
            'id', 'nombre', 'codigo_cabys', 'categoria', 'categoria_id', 'costo',
            'precio_base', 'porcentaje_iva', 'stock_actual', 'controla_stock'
        ]

    def create(self, validated_data):
        categoria_id = validated_data.pop('categoria_id')
        validated_data['categoria'] = CategoriaProducto.objects.get(id=categoria_id)
        return Producto.objects.create(**validated_data)

    def update(self, instance, validated_data):
        if 'categoria_id' in validated_data:
            categoria_id = validated_data.pop('categoria_id')
            instance.categoria = CategoriaProducto.objects.get(id=categoria_id)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class SalonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Salon
        fields = '__all__'

class MesaSerializer(serializers.ModelSerializer):
    salon = SalonSerializer(read_only=True)
    salon_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Mesa
        fields = ['id', 'nombre', 'salon', 'salon_id', 'posicion_x', 'posicion_y', 'rotacion', 'estado']

    def create(self, validated_data):
        salon_id = validated_data.pop('salon_id')
        validated_data['salon'] = Salon.objects.get(id=salon_id)
        return Mesa.objects.create(**validated_data)

    def update(self, instance, validated_data):
        if 'salon_id' in validated_data:
            salon_id = validated_data.pop('salon_id')
            instance.salon = Salon.objects.get(id=salon_id)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

# #####################################################################
# # SECCIÓN 3: FACTURACIÓN, ÓRDENES Y CLIENTES
# #####################################################################

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'

class DetalleOrdenSerializer(serializers.ModelSerializer):
    producto = ProductoSerializer(read_only=True)
    producto_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = DetalleOrden
        fields = [
            'id', 'orden', 'producto', 'producto_id', 'cantidad',
            'precio_unitario_base', 'porcentaje_iva_aplicado', 'comentarios'
        ]

    def create(self, validated_data):
        producto_id = validated_data.pop('producto_id')
        validated_data['producto'] = Producto.objects.get(id=producto_id)
        return DetalleOrden.objects.create(**validated_data)

    def update(self, instance, validated_data):
        if 'producto_id' in validated_data:
            producto_id = validated_data.pop('producto_id')
            instance.producto = Producto.objects.get(id=producto_id)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class OrdenSerializer(serializers.ModelSerializer):
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

    def create(self, validated_data):
        mesa_id = validated_data.pop('mesa_id', None)
        usuario_creador_id = validated_data.pop('usuario_creador_id')
        cliente_id = validated_data.pop('cliente_id', None)
        if mesa_id is not None:
            validated_data['mesa'] = Mesa.objects.get(id=mesa_id)
        validated_data['usuario_creador'] = Usuario.objects.get(id=usuario_creador_id)
        if cliente_id is not None:
            validated_data['cliente'] = Cliente.objects.get(id=cliente_id)
        return Orden.objects.create(**validated_data)

    def update(self, instance, validated_data):
        if 'mesa_id' in validated_data:
            mesa_id = validated_data.pop('mesa_id')
            instance.mesa = Mesa.objects.get(id=mesa_id) if mesa_id is not None else None
        if 'usuario_creador_id' in validated_data:
            usuario_creador_id = validated_data.pop('usuario_creador_id')
            instance.usuario_creador = Usuario.objects.get(id=usuario_creador_id)
        if 'cliente_id' in validated_data:
            cliente_id = validated_data.pop('cliente_id')
            instance.cliente = Cliente.objects.get(id=cliente_id) if cliente_id is not None else None
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

# #####################################################################
# # SECCIÓN 4: VENTAS Y PAGOS
# #####################################################################

class PagoVentaSerializer(serializers.ModelSerializer):
    class Meta:
        model = PagoVenta
        fields = '__all__'

class VentaSerializer(serializers.ModelSerializer):
    pagos = PagoVentaSerializer(many=True, read_only=True)
    orden = OrdenSerializer(read_only=True)
    cliente = ClienteSerializer(read_only=True)
    usuario_vendedor = UsuarioSerializer(read_only=True)

    class Meta:
        model = Venta
        fields = '__all__'

class RegistroAnulacionSerializer(serializers.ModelSerializer):
    venta = VentaSerializer(read_only=True)
    usuario_autoriza = UsuarioSerializer(read_only=True)

    class Meta:
        model = RegistroAnulacion
        fields = '__all__'

# #####################################################################
# # SECCIÓN 5: GESTIÓN DE CAJA
# #####################################################################

class MovimientoCajaSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)

    class Meta:
        model = MovimientoCaja
        fields = '__all__'

class SesionCajaSerializer(serializers.ModelSerializer):
    movimientos = MovimientoCajaSerializer(many=True, read_only=True)
    usuario_apertura = UsuarioSerializer(read_only=True)
    usuario_cierre = UsuarioSerializer(read_only=True)

    class Meta:
        model = SesionCaja
        fields = '__all__'