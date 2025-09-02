from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions
from . import models as m
from . import serializers as s

class WorkerViewSet(viewsets.ModelViewSet):
    queryset = m.Worker.objects.all().order_by('id')
    permission_classes = [permissions.IsAdminUser]
    serializer_class = s.WorkerSerializer
    
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = m.Category.objects.all().order_by('name')
    # permission_classes = [permissions.IsAuthenticated]
    permission_classes = [permissions.AllowAny]
    serializer_class = s.CategorySerializer
    
class ProductViewSet(viewsets.ModelViewSet):
    queryset = m.Product.objects.all().order_by('name')
    permission_classes = [permissions.AllowAny]
    serializer_class = s.ProductSerializer
    
class OrderViewSet(viewsets.ModelViewSet):
    queryset = m.Order.objects.all().order_by('id')
    permission_classes = [permissions.AllowAny]
    serializer_class = s.OrderSerializer
    
    def perform_create(self, serializer):
        serializer.save(worker=self.request.user)

class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = m.OrderItem.objects.all().order_by('id')
    permission_classes = [permissions.AllowAny]
    serializer_class = s.OrderItemSerializer

class TablesItemViewSet(viewsets.ModelViewSet):
    queryset = m.Tables.objects.all().order_by('id')
    permission_classes = [permissions.AllowAny]
    serializer_class = s.TablesSerializer
    
class SalonsItemViewSet(viewsets.ModelViewSet):
    queryset = m.Salons.objects.all().order_by('id')
    permission_classes = [permissions.AllowAny]
    serializer_class = s.SalonsSerializer
    