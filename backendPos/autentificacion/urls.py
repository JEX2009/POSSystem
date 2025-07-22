from django.urls import path, include
from rest_framework import routers
from . import views as v # Usamos 'v' como alias para las vistas

# 1. Se crea una instancia del router.
# DefaultRouter también crea automáticamente la vista raíz de la API.
router = routers.DefaultRouter()

# 2. Se registra cada ViewSet con el router.
# El router se encarga de generar las URLs para cada acción (list, create, retrieve, etc.)

# SECCIÓN 1: Usuarios y Roles
router.register(r'roles', v.RolViewSet, 'roles')
router.register(r'usuarios', v.UsuarioViewSet, 'usuarios')

# SECCIÓN 2: Inventario
router.register(r'categorias-productos', v.CategoriaProductoViewSet, 'categorias-productos')
router.register(r'productos', v.ProductoViewSet, 'productos')
router.register(r'salones', v.SalonViewSet, 'salones')
router.register(r'mesas', v.MesaViewSet, 'mesas')

# SECCIÓN 3: Órdenes y Clientes
router.register(r'clientes', v.ClienteViewSet, 'clientes')
router.register(r'ordenes', v.OrdenViewSet, 'ordenes')
# Nota: DetalleOrdenViewSet está comentado en tus vistas, así que no lo registro.

# SECCIÓN 4: Ventas y Pagos
router.register(r'ventas', v.VentaViewSet, 'ventas')
router.register(r'pagos-venta', v.PagoVentaViewSet, 'pagos-venta')
router.register(r'registros-anulacion', v.RegistroAnulacionViewSet, 'registros-anulacion')

# SECCIÓN 5: Caja
router.register(r'sesiones-caja', v.SesionCajaViewSet, 'sesiones-caja')
router.register(r'movimientos-caja', v.MovimientoCajaViewSet, 'movimientos-caja')


# 3. Se definen los urlpatterns de la API.
# Solo necesitamos incluir las URLs del router bajo un prefijo, como 'api/'.
# Django se encargará del resto.
urlpatterns = [
    path('api/', include(router.urls)),
]
