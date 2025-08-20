# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#  *
#  * Make sure each model has one field with primary_key=True
#  * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#  * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from django.contrib.auth.models import User

# #####################################################################
# # SECCIÓN 1: GESTIÓN DE USUARIOS Y ROLES
# #####################################################################

class Rol(models.Model):
    nombre_rol = models.CharField(unique=True, max_length=50)

    class Meta:
        db_table = 'roles'

    def __str__(self):
        return self.nombre_rol


class Usuario(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='perfil_usuario')
    nombre_usuario = models.CharField(unique=True, max_length=50)
    nombre_completo = models.CharField(max_length=100)
    rol = models.ForeignKey(Rol, models.PROTECT, db_column='id_rol')
    activo = models.BooleanField(default=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'usuarios'

    def __str__(self):
        return self.nombre_usuario

# #####################################################################
# # SECCIÓN 2: INVENTARIO, PRODUCTOS, MESAS Y SALONES
# #####################################################################

class CategoriaProducto(models.Model):
    nombre = models.CharField(unique=True, max_length=100)

    class Meta:
        db_table = 'categorias_productos'

    def __str__(self):
        return self.nombre


class Producto(models.Model):
    nombre = models.CharField(max_length=150)
    codigo_cabys = models.CharField(max_length=13, blank=True, null=True)
    categoria = models.ForeignKey(CategoriaProducto, models.PROTECT, db_column='id_categoria')
    costo = models.DecimalField(max_digits=10, decimal_places=2)
    precio_base = models.DecimalField(max_digits=10, decimal_places=2)
    porcentaje_iva = models.DecimalField(max_digits=4, decimal_places=2)
    stock_actual = models.DecimalField(max_digits=10, decimal_places=2)
    controla_stock = models.BooleanField(default=True)

    class Meta:
        db_table = 'productos'

    def __str__(self):
        return self.nombre


class Salon(models.Model):
    nombre = models.CharField(unique=True, max_length=100)

    class Meta:
        db_table = 'salones'

    def __str__(self):
        return self.nombre


class Mesa(models.Model):
    nombre = models.CharField(max_length=50)
    salon = models.ForeignKey(Salon, models.CASCADE, db_column='id_salon')
    posicion_x = models.IntegerField(blank=True, null=True)
    posicion_y = models.IntegerField(blank=True, null=True)
    rotacion = models.IntegerField(blank=True, null=True)
    estado = models.CharField(max_length=10, blank=True, null=True)

    class Meta:
        db_table = 'mesas'

    def __str__(self):
        return f"{self.nombre} ({self.salon.nombre})"

# #####################################################################
# # SECCIÓN 3: FACTURACIÓN, ÓRDENES Y CLIENTES
# #####################################################################

class Cliente(models.Model):
    tipo_identificacion = models.CharField(max_length=8)
    identificacion = models.CharField(unique=True, max_length=20)
    nombre_completo = models.CharField(max_length=150)
    correo_electronico = models.CharField(max_length=100, blank=True, null=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    direccion = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'clientes'

    def __str__(self):
        return self.nombre_completo


class Orden(models.Model):
    mesa = models.ForeignKey(Mesa, models.SET_NULL, db_column='id_mesa', blank=True, null=True)
    usuario_creador = models.ForeignKey(Usuario, models.PROTECT, db_column='id_usuario_creador')
    cliente = models.ForeignKey(Cliente, models.SET_NULL, db_column='id_cliente', blank=True, null=True)
    tipo = models.CharField(max_length=6)
    estado = models.CharField(max_length=9)
    fecha_apertura = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'ordenes'

    def __str__(self):
        return f"Orden #{self.id} - {self.fecha_apertura}"


class DetalleOrden(models.Model):
    orden = models.ForeignKey(Orden, models.CASCADE, db_column='id_orden')
    producto = models.ForeignKey(Producto, models.PROTECT, db_column='id_producto')
    cantidad = models.DecimalField(max_digits=10, decimal_places=2)
    precio_unitario_base = models.DecimalField(max_digits=10, decimal_places=2)
    porcentaje_iva_aplicado = models.DecimalField(max_digits=4, decimal_places=2)
    comentarios = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'detalles_orden'

# #####################################################################
# # SECCIÓN 4: VENTAS Y PAGOS
# #####################################################################

class Venta(models.Model):
    orden = models.OneToOneField(Orden, models.PROTECT, db_column='id_orden', blank=True, null=True)
    cliente = models.ForeignKey(Cliente, models.SET_NULL, db_column='id_cliente', blank=True, null=True)
    usuario_vendedor = models.ForeignKey(Usuario, models.PROTECT, db_column='id_usuario_vendedor')
    tipo_documento = models.CharField(max_length=19)
    consecutivo_hacienda = models.CharField(unique=True, max_length=50, blank=True, null=True)
    fecha_venta = models.DateTimeField(blank=True, null=True)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    monto_iva = models.DecimalField(max_digits=10, decimal_places=2)
    total_final = models.DecimalField(max_digits=10, decimal_places=2)
    estado = models.CharField(max_length=10, blank=True, null=True)

    class Meta:
        db_table = 'ventas'


class PagoVenta(models.Model):
    venta = models.ForeignKey(Venta, models.CASCADE, db_column='id_venta')
    metodo_pago = models.CharField(max_length=13)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    referencia = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        db_table = 'pagos_venta'


class RegistroAnulacion(models.Model):
    venta = models.ForeignKey(Venta, models.CASCADE, db_column='id_venta')
    usuario_autoriza = models.ForeignKey(Usuario, models.PROTECT, db_column='id_usuario_autoriza')
    motivo = models.TextField()
    fecha_anulacion = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'registros_anulacion'

# #####################################################################
# # SECCIÓN 5: GESTIÓN DE CAJA
# #####################################################################

class SesionCaja(models.Model):
    usuario_apertura = models.ForeignKey(Usuario, models.PROTECT, db_column='id_usuario_apertura')
    usuario_cierre = models.ForeignKey(
        Usuario, models.PROTECT, db_column='id_usuario_cierre',
        related_name='sesioncaja_usuario_cierre_set', blank=True, null=True
    )
    fecha_apertura = models.DateTimeField(blank=True, null=True)
    fecha_cierre = models.DateTimeField(blank=True, null=True)
    monto_apertura = models.DecimalField(max_digits=10, decimal_places=2)
    monto_cierre_efectivo_contado = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    monto_cierre_dejado_en_caja = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    total_calculado_efectivo = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    total_calculado_tarjeta = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    total_calculado_sinpe = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    diferencia = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    observaciones_cierre = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'sesiones_caja'


class MovimientoCaja(models.Model):
    sesion_caja = models.ForeignKey(SesionCaja, models.CASCADE, db_column='id_sesion_caja')
    usuario = models.ForeignKey(Usuario, models.PROTECT, db_column='id_usuario')
    tipo_movimiento = models.CharField(max_length=7)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    descripcion = models.TextField()
    fecha_movimiento = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'movimientos_caja'