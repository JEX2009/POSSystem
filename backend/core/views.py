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
    permission_classes = [permissions.AllowAny]
    serializer_class = s.CategorySerializer
    
class ProductViewSet(viewsets.ModelViewSet):
    queryset = m.Product.objects.all().order_by('name')
    permission_classes = [permissions.AllowAny]
    serializer_class = s.ProductSerializer