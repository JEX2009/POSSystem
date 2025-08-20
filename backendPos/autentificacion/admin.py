from django.contrib import admin
from .models import (
    Rol, Usuario, CategoriaProducto, Producto, Salon, Mesa, Cliente,
    Orden, DetalleOrden, Venta, PagoVenta, RegistroAnulacion,
    SesionCaja, MovimientoCaja
)

admin.site.register(Rol)
admin.site.register(Usuario)
admin.site.register(CategoriaProducto)
admin.site.register(Producto)
admin.site.register(Salon)
admin.site.register(Mesa)
admin.site.register(Cliente)
admin.site.register(Orden)
admin.site.register(DetalleOrden)
admin.site.register(Venta)
admin.site.register(PagoVenta)
admin.site.register(RegistroAnulacion)
admin.site.register(SesionCaja)
admin.site.register(MovimientoCaja)
