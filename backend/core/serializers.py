# backend/core/serializers.py

from rest_framework import serializers
from . import models as m

# --- Serializers Base (Correctos) ---

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

# --- Serializers de Orden (Correctos) ---

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=m.Product.objects.all(), source='product', write_only=True
    )
    order_id = serializers.PrimaryKeyRelatedField(
        queryset =m.Order.objects.all(), source='order', write_only=True
    )
    class Meta:
        model = m.OrderItem
        fields= ['id', 'product', 'product_id', 'quantity', 'total', 'order_id']
        read_only_fields = ['total']

class OrderItemCreateSerializer(serializers.ModelSerializer):
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=m.Product.objects.all(), source='product'
    )
    class Meta:
        model = m.OrderItem
        fields= ['product_id', 'quantity']

# --- Serializers de Salón y Mesa (CORREGIDOS) ---

class TablesSerializer(serializers.ModelSerializer):
    # Para la ESCRITURA: Espera el ID del salón al que pertenece la mesa
    salon_id = serializers.PrimaryKeyRelatedField(
        queryset=m.Salons.objects.all(), source='salon', write_only=True
    )
    
    class Meta:
        model = m.Tables
        fields = ['id', 'name', 'salon_id']

class SalonsSerializer(serializers.ModelSerializer):
    # Para la LECTURA: Muestra la lista de mesas que pertenecen a este salón
    tables = TablesSerializer(many=True, read_only=True)

    class Meta:
        model = m.Salons
        fields = ['id', 'name', 'tables']

# --- Serializer de Orden Principal (CORREGIDO) ---

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemCreateSerializer(many=True)
    worker = WorkerSerializer(read_only=True)
    
    # Para la ESCRITURA: Espera el ID de la mesa a la que se asigna la orden
    table_id = serializers.PrimaryKeyRelatedField(
        queryset=m.Tables.objects.all(), source='tables', write_only=True, required=False, allow_null=True
    )

    class Meta:
        model = m.Order
        fields = ['id', 'worker', 'invoice_number', 'items', 'total', 'created', 'table_id', 'sell_type', 'identificator']
        read_only_fields = ['total', 'invoice_number', 'worker', 'created']
        
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        
        # Extraemos la mesa si viene en los datos
        table_data = validated_data.pop('tables', None)
        
        order = m.Order.objects.create(tables=table_data, **validated_data)
        
        total_order_price = 0
        
        for item_data in items_data:
            product = item_data['product']
            quantity = item_data['quantity']
            
            # Creamos el OrderItem
            item = m.OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                total= product.price # Guardamos el precio del momento
            )
            
            line_total = product.price * quantity
            total_order_price += line_total
            
        # Guardamos el total final en la orden
        order.total = total_order_price
        order.save()
        
        return order