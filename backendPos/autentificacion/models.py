# autentificacion/models.py

from django.db import models

class Rol(models.Model):
    id = models.IntegerField(primary_key=True)
    nombre_rol = models.CharField(unique=True, max_length=50)
    class Meta:
        managed = False
        db_table = 'roles'
    def __str__(self): return self.nombre_rol

class Usuario(models.Model):
    id = models.IntegerField(primary_key=True)
    nombre_usuario = models.CharField(unique=True, max_length=50)
    hash_contrasena = models.CharField(max_length=255)
    nombre_completo = models.CharField(max_length=100)
    rol = models.ForeignKey(Rol, models.PROTECT, db_column='id_rol')
    activo = models.BooleanField(default=True)
    fecha_creacion = models.DateTimeField(blank=True, null=True)
    class Meta:
        managed = False
        db_table = 'usuarios'
    def __str__(self): return self.nombre_usuario

class CategoriaProducto(models.Model):
    id = models.IntegerField(primary_key=True)
    nombre = models.CharField(unique=True, max_length=100)
    class Meta:
        managed = False
        db_table = 'categorias_productos'
    def __str__(self): return self.nombre

class Producto(models.Model):
    id = models.IntegerField(primary_key=True)
    nombre = models.CharField(max_length=150)
    codigo_cabys = models.CharField(max_length=13, blank=True, null=True)
    categoria = models.ForeignKey(CategoriaProducto, models.PROTECT, db_column='id_categoria')
    costo = models.DecimalField(max_digits=10, decimal_places=2)
    precio_base = models.DecimalField(max_digits=10, decimal_places=2)
    porcentaje_iva = models.DecimalField(max_digits=4, decimal_places=2)
    stock_actual = models.DecimalField(max_digits=10, decimal_places=2)
    controla_stock = models.BooleanField(default=True)
    class Meta:
        managed = False
        db_table = 'productos'
    def __str__(self): return self.nombre

class Salon(models.Model):
    id = models.IntegerField(primary_key=True)
    nombre = models.CharField(unique=True, max_length=100)
    class Meta:
        managed = False
        db_table = 'salones'
    def __str__(self): return self.nombre

class Mesa(models.Model):
    id = models.IntegerField(primary_key=True)
    nombre = models.CharField(max_length=50)
    salon = models.ForeignKey(Salon, models.CASCADE, db_column='id_salon')
    posicion_x = models.IntegerField(blank=True, null=True)
    posicion_y = models.IntegerField(blank=True, null=True)
    rotacion = models.IntegerField(blank=True, null=True)
    estado = models.CharField(max_length=10, blank=True, null=True)
    class Meta:
        managed = False
        db_table = 'mesas'
    def __str__(self): return f"{self.nombre} ({self.salon.nombre})"

class Cliente(models.Model):
    id = models.IntegerField(primary_key=True)
    tipo_identificacion = models.CharField(max_length=8)
    identificacion = models.CharField(unique=True, max_length=20)
    nombre_completo = models.CharField(max_length=150)
    correo_electronico = models.CharField(max_length=100, blank=True, null=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    direccion = models.TextField(blank=True, null=True)
    class Meta:
        managed = False
        db_table = 'clientes'
    def __str__(self): return self.nombre_completo

class Orden(models.Model):
    id = models.IntegerField(primary_key=True)
    mesa = models.ForeignKey(Mesa, models.SET_NULL, db_column='id_mesa', blank=True, null=True)
    usuario_creador = models.ForeignKey(Usuario, models.PROTECT, db_column='id_usuario_creador')
    cliente = models.ForeignKey(Cliente, models.SET_NULL, db_column='id_cliente', blank=True, null=True)
    tipo = models.CharField(max_length=6)
    estado = models.CharField(max_length=9)
    fecha_apertura = models.DateTimeField(blank=True, null=True)
    class Meta:
        managed = False
        db_table = 'ordenes'
    def __str__(self): return f"Orden #{self.id} - {self.fecha_apertura}"

class DetalleOrden(models.Model):
    id = models.IntegerField(primary_key=True)
    orden = models.ForeignKey(Orden, models.CASCADE, db_column='id_orden')
    producto = models.ForeignKey(Producto, models.PROTECT, db_column='id_producto')
    cantidad = models.DecimalField(max_digits=10, decimal_places=2)
    precio_unitario_base = models.DecimalField(max_digits=10, decimal_places=2)
    porcentaje_iva_aplicado = models.DecimalField(max_digits=4, decimal_places=2)
    comentarios = models.TextField(blank=True, null=True)
    class Meta:
        managed = False
        db_table = 'detalles_orden'

class Venta(models.Model):
    id = models.IntegerField(primary_key=True)
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
        managed = False
        db_table = 'ventas'

class PagoVenta(models.Model):
    id = models.IntegerField(primary_key=True)
    venta = models.ForeignKey(Venta, models.CASCADE, db_column='id_venta')
    metodo_pago = models.CharField(max_length=13)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    referencia = models.CharField(max_length=100, blank=True, null=True)
    class Meta:
        managed = False
        db_table = 'pagos_venta'

class RegistroAnulacion(models.Model):
    id = models.IntegerField(primary_key=True)
    venta = models.ForeignKey(Venta, models.CASCADE, db_column='id_venta')
    usuario_autoriza = models.ForeignKey(Usuario, models.PROTECT, db_column='id_usuario_autoriza')
    motivo = models.TextField()
    fecha_anulacion = models.DateTimeField(blank=True, null=True)
    class Meta:
        managed = False
        db_table = 'registros_anulacion'

class SesionCaja(models.Model):
    id = models.IntegerField(primary_key=True)
    usuario_apertura = models.ForeignKey(Usuario, models.PROTECT, db_column='id_usuario_apertura')
    usuario_cierre = models.ForeignKey(Usuario, models.PROTECT, db_column='id_usuario_cierre', related_name='sesioncaja_usuario_cierre_set', blank=True, null=True)
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

class MovimientoCaja(models.Model):
    id = models.IntegerField(primary_key=True)
    sesion_caja = models.ForeignKey(SesionCaja, models.CASCADE, db_column='id_sesion_caja')
    usuario = models.ForeignKey(Usuario, models.PROTECT, db_column='id_usuario')
    tipo_movimiento = models.CharField(max_length=7)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    descripcion = models.TextField()
    fecha_movimiento = models.DateTimeField(blank=True, null=True)
    class Meta:
        managed = False
        db_table = 'movimientos_caja'
