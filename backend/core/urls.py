from django.urls import path, include
from rest_framework import routers
from . import views 

router = routers.DefaultRouter()

router.register(r'worker', views.WorkerViewSet)
router.register(r'category', views.CategoryViewSet)
router.register(r'product', views.ProductViewSet)
router.register(r'order', views.OrderViewSet)
router.register(r'order-items', views.OrderItemViewSet)
router.register(r'tables', views.TablesItemViewSet)
router.register(r'salons', views.SalonsItemViewSet)
router.register(r'economy-activity',views.EconomicActivityViewSet)
router.register(r'client',views.ClientViewSet)
router.register(r'profile',views.BusinessProfileViewSet)
router.register(r'bill',views.BillViewSet)
router.register(r'bill-item',views.BillItemViewSet)

urlpatterns = [
    path('', include(router.urls)),
]