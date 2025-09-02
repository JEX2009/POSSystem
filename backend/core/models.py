from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class Worker(AbstractUser):
    """" Este modelo extiende el modelo de Django para incluir campos adicionales específicos del trabajador.
        Si se usa hay que cambiar en settings.py el AUTH_USER_MODEL = 'core.worker'
    """
    pass

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    tax = models.DecimalField(max_digits=4, decimal_places=2, default=0.13) 
    cabys = models.CharField(max_length=20, default=6331000000000) # Código CABYS por defecto
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    def __str__(self):
        return self.name

class Salons(models.Model):
    name= models.CharField(max_length=100, unique=True)

class Tables(models.Model):
    salon = models.ForeignKey(Salons,on_delete=models.CASCADE, related_name='tables' )
    name= models.CharField(max_length=100, unique=True)

class Order(models.Model):
    ORDER_TYPE_TABLE = 'MESA'
    ORDER_TYPE_TOGO = 'LLEVAR'
    ORDER_TYPE = 'FACTURAR'

    # 2. Crear la lista de tuplas para las choices
    ORDER_TYPE_CHOICES = [
        (ORDER_TYPE_TABLE, 'Para Mesa'),
        (ORDER_TYPE_TOGO, 'Para Llevar'),
        (ORDER_TYPE, 'Directa'),
    ]
    worker = models.ForeignKey(Worker, on_delete=models.CASCADE, related_name='orders')
    created = models.DateTimeField(auto_now_add=True )
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    invoice_number  = models.CharField(max_length=50, unique=True, blank=True, null=True)
    sell_type = models.CharField(max_length=50, choices=ORDER_TYPE_CHOICES,default=ORDER_TYPE_TABLE)
    identificator = models.CharField(max_length=50, blank=True, null=True)
    tables = models.ForeignKey(Tables,on_delete=models.CASCADE, related_name='orders',null=True, blank=True )
    def __str__(self):
        return f"Order {self.id} por {self.worker.username}"
    

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    total = models.DecimalField(max_digits=10, decimal_places=2)
    def __str__(self):
        return f"{self.quantity} x {self.product.name}"
    
