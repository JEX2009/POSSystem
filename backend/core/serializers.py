# backend/core/serializers.py

from rest_framework import serializers
from . import models as m

# --- Serializers Base (Sin cambios) ---

class WorkerSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = m.Worker
        fields = ['id', 'username', 'first_name', 'last_name', 'email' , 'password']
        
    def create(self, validated_data):
        worker = m.Worker.objects.create_user(**validated_data)
        return worker

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = m.Category
        fields = ['id', 'name', 'description']

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=m.Category.objects.all(), source='category', write_only=True
    )
    class Meta:
        model = m.Product
        fields = ['id', 'name', 'description', 'price',  'category', 'category_id']

# --- Serializers de Orden (Con una pequeña corrección) ---

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    class Meta:
        model = m.OrderItem
        fields= ['id', 'product', 'quantity', 'total']

class OrderItemCreateSerializer(serializers.ModelSerializer):
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=m.Product.objects.all(), source='product'
    )
    class Meta:
        model = m.OrderItem
        fields= ['product_id', 'quantity']

# --- MODIFICACIÓN #1: Serializers de Salón y Mesa DESACOPLADOS ---

# Este serializer es SOLO para mostrar los datos de la orden en la lista de mesas
class SimpleOrderSerializer(serializers.ModelSerializer):
    #-- MODIFICACIÓN: Añadido para que puedas ver los items en el modal
    items = OrderItemSerializer(many=True, read_only=True)
    class Meta:
        model = m.Order
        fields = ['id', 'total', 'created', 'canceled', 'items'] 

# Este serializer es SOLO para LEER las mesas dentro de un salón
class TablesReadOnlySerializer(serializers.ModelSerializer):
    active_order = serializers.SerializerMethodField()

    class Meta:
        model = m.Tables
        fields = ['id', 'name', 'active_order']

    def get_active_order(self, obj):
        active_order = obj.orders.filter(canceled=False).first()
        if active_order:
            return SimpleOrderSerializer(active_order).data
        return None

# Este serializer es para LEER la lista de salones
class SalonsSerializer(serializers.ModelSerializer):
    # Usa el serializer de solo lectura para evitar el bucle
    tables = TablesReadOnlySerializer(many=True, read_only=True)

    class Meta:
        model = m.Salons
        fields = ['id', 'name', 'tables']

# --- MODIFICACIÓN #2: Un serializer específico para CREAR/ACTUALIZAR mesas ---
class TablesWriteSerializer(serializers.ModelSerializer):
    # Para la escritura, solo necesitamos el ID del salón
    salon_id = serializers.PrimaryKeyRelatedField(
        queryset=m.Salons.objects.all(), source='salon'
    )
    class Meta:
        model = m.Tables
        fields = ['id', 'name', 'salon_id']


# --- Serializer de Orden Principal (Con correcciones) ---

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemCreateSerializer(many=True, write_only=True)
    worker = WorkerSerializer(read_only=True)
    
    # Para LEER la orden, mostramos los items completos
    items_read = OrderItemSerializer(source='items', many=True, read_only=True)
    
    table_id = serializers.PrimaryKeyRelatedField(
        queryset=m.Tables.objects.all(), source='table', write_only=True, required=False, allow_null=True
    )

    class Meta:
        model = m.Order
        fields = ['id', 'worker', 'invoice_number', 'items', 'items_read', 'total', 'created', 'table_id', 'sell_type', 'identificator', 'canceled']
        read_only_fields = ['total', 'invoice_number', 'worker', 'created']
        
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        
        #-- MODIFICACIÓN #3: Corregido el nombre de la clave
        table_instance = validated_data.pop('table', None)
        
        #-- MODIFICACIÓN #4: Pasamos la instancia de la mesa, no los datos
        order = m.Order.objects.create(table=table_instance, **validated_data)
        
        total_order_price = 0
        
        for item_data in items_data:
            product = item_data['product']
            quantity = item_data['quantity']
            
            line_total = product.price * quantity
            
            m.OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                total=line_total # Guardamos el total de la línea
            )
            
            total_order_price += line_total
            
        order.total = total_order_price
        order.save()
        
        return order
