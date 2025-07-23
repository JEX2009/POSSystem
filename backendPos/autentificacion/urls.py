from django.urls import path, include
from rest_framework import routers
from . import views as v # Usamos 'v' como alias para las vistas

# 1. Se crea una instancia del router.
# DefaultRouter también crea automáticamente la vista raíz de la API.
router = routers.DefaultRouter()

# 2. Se registra cada ViewSet con el router.
# El router se encarga de generar las URLs para cada acción (list, create, retrieve, etc.)

# SECCIÓN 1: Usuarios y Roles
router.register(r'roles', v.RolViewSet, 'rol')
router.register(r'usuarios', v.UsuarioViewSet, 'usuario')

# SECCIÓN 2: Inventario
router.register(r'categorias-productos', v.CategoriaProductoViewSet, 'categoriaproducto')
router.register(r'productos', v.ProductoViewSet, 'producto')
router.register(r'salones', v.SalonViewSet, 'salon')
router.register(r'mesas', v.MesaViewSet, 'mesa')

# SECCIÓN 3: Órdenes y Clientes
router.register(r'clientes', v.ClienteViewSet, 'cliente')
router.register(r'ordenes', v.OrdenViewSet, 'orden')
# CAMBIO: Se registra el ViewSet para DetalleOrden
router.register(r'detalles-orden', v.DetalleOrdenViewSet, 'detalleorden')

# SECCIÓN 4: Ventas y Pagos
router.register(r'ventas', v.VentaViewSet, 'venta')
router.register(r'pagos-venta', v.PagoVentaViewSet, 'pagoventa')
router.register(r'registros-anulacion', v.RegistroAnulacionViewSet, 'registroanulacion')

# SECCIÓN 5: Caja
router.register(r'sesiones-caja', v.SesionCajaViewSet, 'sesioncaja')
router.register(r'movimientos-caja', v.MovimientoCajaViewSet, 'movimientocaja')


# 3. Se definen los urlpatterns de la API.
# Solo necesitamos incluir las URLs del router.
# El prefijo 'api/' se puede añadir en el urls.py principal del proyecto.
urlpatterns = [
    path('', include(router.urls)),
]
