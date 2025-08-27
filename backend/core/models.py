from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class Worker(AbstractUser):
    """" Este modelo extiende el modelo de Django para incluir campos adicionales específicos del trabajador.
        Si se usa hay que cambiar en settings.py el AUTH_USER_MODEL = 'core.worker'
    """
    pass

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    def __str__(self):
        return self.name