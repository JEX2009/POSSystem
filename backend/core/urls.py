from django.urls import path, include
from rest_framework import routers
from . import views 

router = routers.DefaultRouter()

router.register(r'worker', views.WorkerViewSet)
router.register(r'category', views.CategoryViewSet)
router.register(r'product', views.ProductViewSet)
router.register(r'order', views.OrderViewSet)
router.register(r'order-items', views.OrderItemViewSet)


urlpatterns = [
    path('', include(router.urls)),
]