from rest_framework import serializers
from . import models as m

class WorkerSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = m.Worker
        fields = ['id', 'username', 'first_name', 'last_name', 'email' , 'password']
        
    def create(self, validated_data):
    # Usamos create_user para hashear la contraseña
        worker = m.Worker.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
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
        
    def create(self, validated_data):
        
        tem = m.OrderItem.objects.create(
                product=validated_data['product'],
                quantity=validated_data['quantity'],
                total= validated_data['quantity'] * validated_data['product'].price,
                order_id= validated_data['order'].id
            )
        tem.save()
        return tem
        
class OrderItemCreateSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=m.Product.objects.all(), source='product', write_only=True
    )
    class Meta:
        model = m.OrderItem
        fields= ['id', 'product', 'product_id', 'quantity']
        

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemCreateSerializer(many=True)
    worker = WorkerSerializer(read_only=True)
    
    class Meta:
        model = m.Order
        fields = ['id', 'worker','invoice_number', 'items', 'total', 'created']
        read_only_fields = ['total', 'invoice_number', 'worker','created']
        
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = m.Order.objects.create(**validated_data)
        
        total_order_price = 0
        
        for item in items_data:
            product =item['product']
            quantity = item['quantity']
            
            # Creamos el OrderItem, asociándolo a la orden
            item = m.OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                total= product.price # Guardamos el precio del momento
            )
            
            line_total = product.price * quantity
            total_order_price += line_total
            product.save()
            
        # 5. Guardamos el total final en la orden
        order.total = total_order_price
        order.save()
        
        return order

