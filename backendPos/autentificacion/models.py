# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.IntegerField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.IntegerField()
    is_active = models.IntegerField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class CategoriasProductos(models.Model):
    nombre = models.CharField(unique=True, max_length=100)

    class Meta:
        managed = False
        db_table = 'categorias_productos'


class Clientes(models.Model):
    tipo_identificacion = models.CharField(max_length=8)
    identificacion = models.CharField(unique=True, max_length=20)
    nombre_completo = models.CharField(max_length=150)
    correo_electronico = models.CharField(max_length=100, blank=True, null=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    direccion = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'clientes'


class DetallesOrden(models.Model):
    id_orden = models.ForeignKey('Ordenes', models.DO_NOTHING, db_column='id_orden')
    id_producto = models.ForeignKey('Productos', models.DO_NOTHING, db_column='id_producto')
    cantidad = models.DecimalField(max_digits=10, decimal_places=2)
    precio_unitario_base = models.DecimalField(max_digits=10, decimal_places=2)
    porcentaje_iva_aplicado = models.DecimalField(max_digits=4, decimal_places=2)
    comentarios = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'detalles_orden'


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.PositiveSmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class Mesas(models.Model):
    nombre = models.CharField(max_length=50)
    id_salon = models.ForeignKey('Salones', models.DO_NOTHING, db_column='id_salon')
    posicion_x = models.IntegerField(blank=True, null=True)
    posicion_y = models.IntegerField(blank=True, null=True)
    rotacion = models.IntegerField(blank=True, null=True)
    estado = models.CharField(max_length=10, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mesas'


class MovimientosCaja(models.Model):
    id_sesion_caja = models.ForeignKey('SesionesCaja', models.DO_NOTHING, db_column='id_sesion_caja')
    id_usuario = models.ForeignKey('Usuarios', models.DO_NOTHING, db_column='id_usuario')
    tipo_movimiento = models.CharField(max_length=7)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    descripcion = models.TextField()
    fecha_movimiento = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'movimientos_caja'


class Ordenes(models.Model):
    id_mesa = models.ForeignKey(Mesas, models.DO_NOTHING, db_column='id_mesa', blank=True, null=True)
    id_usuario_creador = models.ForeignKey('Usuarios', models.DO_NOTHING, db_column='id_usuario_creador')
    id_cliente = models.ForeignKey(Clientes, models.DO_NOTHING, db_column='id_cliente', blank=True, null=True)
    tipo = models.CharField(max_length=6)
    estado = models.CharField(max_length=9)
    fecha_apertura = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ordenes'


class PagosVenta(models.Model):
    id_venta = models.ForeignKey('Ventas', models.DO_NOTHING, db_column='id_venta')
    metodo_pago = models.CharField(max_length=13)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    referencia = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pagos_venta'


class Productos(models.Model):
    nombre = models.CharField(max_length=150)
    codigo_cabys = models.CharField(max_length=13, blank=True, null=True)
    id_categoria = models.ForeignKey(CategoriasProductos, models.DO_NOTHING, db_column='id_categoria')
    costo = models.DecimalField(max_digits=10, decimal_places=2)
    precio_base = models.DecimalField(max_digits=10, decimal_places=2)
    porcentaje_iva = models.DecimalField(max_digits=4, decimal_places=2)
    stock_actual = models.DecimalField(max_digits=10, decimal_places=2)
    controla_stock = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'productos'


class RegistrosAnulacion(models.Model):
    id_venta = models.ForeignKey('Ventas', models.DO_NOTHING, db_column='id_venta')
    id_usuario_autoriza = models.ForeignKey('Usuarios', models.DO_NOTHING, db_column='id_usuario_autoriza')
    motivo = models.TextField()
    fecha_anulacion = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'registros_anulacion'


class Roles(models.Model):
    nombre_rol = models.CharField(unique=True, max_length=50)

    class Meta:
        managed = False
        db_table = 'roles'


class Salones(models.Model):
    nombre = models.CharField(unique=True, max_length=100)

    class Meta:
        managed = False
        db_table = 'salones'


class SesionesCaja(models.Model):
    id_usuario_apertura = models.ForeignKey('Usuarios', models.DO_NOTHING, db_column='id_usuario_apertura')
    id_usuario_cierre = models.ForeignKey('Usuarios', models.DO_NOTHING, db_column='id_usuario_cierre', related_name='sesionescaja_id_usuario_cierre_set', blank=True, null=True)
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
        managed = False
        db_table = 'sesiones_caja'


class Usuarios(models.Model):
    nombre_usuario = models.CharField(unique=True, max_length=50)
    hash_contrasena = models.CharField(max_length=255)
    nombre_completo = models.CharField(max_length=100)
    id_rol = models.ForeignKey(Roles, models.DO_NOTHING, db_column='id_rol')
    activo = models.IntegerField(blank=True, null=True)
    fecha_creacion = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'usuarios'


class Ventas(models.Model):
    id_orden = models.OneToOneField(Ordenes, models.DO_NOTHING, db_column='id_orden', blank=True, null=True)
    id_cliente = models.ForeignKey(Clientes, models.DO_NOTHING, db_column='id_cliente', blank=True, null=True)
    id_usuario_vendedor = models.ForeignKey(Usuarios, models.DO_NOTHING, db_column='id_usuario_vendedor')
    tipo_documento = models.CharField(max_length=19)
    consecutivo_hacienda = models.CharField(unique=True, max_length=50, blank=True, null=True)
    fecha_venta = models.DateTimeField(blank=True, null=True)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    monto_iva = models.DecimalField(max_digits=10, decimal_places=2)
    total_final = models.DecimalField(max_digits=10, decimal_places=2)
    estado = models.CharField(max_length=10, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ventas'
