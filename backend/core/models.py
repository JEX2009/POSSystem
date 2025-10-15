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
    table = models.ForeignKey(Tables,on_delete=models.CASCADE, related_name='orders',null=True, blank=True )
    canceled = models.BooleanField(default=False)
    
    def calculate_total(self):
        """
        Calcula el total de la orden sumando los totales de cada OrderItem.
        """
        order_items = self.items.select_related('product').all()
        new_total = sum(item.product.price * item.quantity for item in order_items)
        return new_total

    def __str__(self):
        return f"Order {self.id} por {self.worker.username}"
    

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    total = models.DecimalField(max_digits=10, decimal_places=2)
    def __str__(self):
        return f"{self.quantity} x {self.product.name}"
    
class EconomicActivity(models.Model):
    activity_id = models.CharField(max_length=10)
    activity_name = models.CharField(max_length=100)

    def __str__(self):
        return self.activity_name

class Client(models.Model):
    client_name = models.CharField(max_length=100)
    economic_activity = models.ForeignKey(EconomicActivity, on_delete=models.SET_NULL, null=True, blank=True)
    client_email = models.EmailField(max_length=100) # EmailField valida el formato de email
    client_phone = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return self.client_name

class BusinessProfile(models.Model):
    business_name = models.CharField(max_length=50)
    address = models.CharField(max_length=200)
    phone_number = models.CharField(max_length=20)
    certificate = models.CharField(max_length=50)
    
    def __str__(self):
        return self.business_name

class Bill(models.Model):
    business_data = models.ForeignKey(BusinessProfile, on_delete=models.PROTECT)
    document_type = models.CharField(max_length=50)
    bill_number = models.CharField(max_length=50, unique=True) # Un número de factura debe ser único
    date_time = models.DateTimeField(auto_now_add=True)
    client = models.ForeignKey(Client, on_delete=models.PROTECT, related_name='bills')
    
    # Estos campos probablemente vendrán como un objeto JSON, CharField o TextField es mejor
    type_of_pay = models.CharField(max_length=255) 
    client_pay = models.DecimalField(max_digits=10, decimal_places=2)
    change = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Campos fiscales
    e_billing_key = models.CharField(max_length=50, unique=True, null=True, blank=True)
    qr = models.TextField(blank=True) # TextField es mejor para strings largos

    def __str__(self):
        return f"{self.document_type} - {self.bill_number}"

class BillItem(models.Model):
    bill = models.ForeignKey(Bill, on_delete=models.CASCADE, related_name='items')
    product_name = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField()
    price_at_sale = models.DecimalField(max_digits=10, decimal_places=2)
    line_total = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity}x {self.product_name} en Factura #{self.bill.id}"