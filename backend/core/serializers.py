# backend/core/serializers.py

from rest_framework import serializers
from . import models as m
from django.db import transaction

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
    category_id = serializers.PrimaryKeyRelatedField(queryset=m.Category.objects.all(), source='category', write_only=True)
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
    items = serializers.ListField(child=serializers.DictField(), write_only=True, required=False)
    # ... (El resto de los campos del serializer) ...
    worker = WorkerSerializer(read_only=True)
    items_read = OrderItemSerializer(source='items', many=True, read_only=True)
    table_id = serializers.PrimaryKeyRelatedField(
        queryset=m.Tables.objects.all(), source='table', write_only=True, required=False, allow_null=True
    )

    class Meta:
        model = m.Order
        fields = ['id', 'worker', 'invoice_number', 'items', 'items_read', 'total', 'created', 'table_id', 'sell_type', 'identificator', 'canceled']
        read_only_fields = ['total', 'invoice_number', 'worker', 'created']

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        table_instance = validated_data.pop('table', None)
        order = m.Order.objects.create(table=table_instance, **validated_data)
        product_ids = [item['product_id'] for item in items_data]
        products = m.Product.objects.filter(id__in=product_ids)
        products_map = {product.id : product for product in products}
        items_to_create = []
        for item_data in items_data:
            product = products_map.get(item_data['product_id'])
            if not product:
                continue
            
            quanttity = item_data['quantity']
            line_total = product.price * quanttity
            items_to_create.append(
                m.OrderItem(    
                    order=order, product=product, quantity=quanttity, total=line_total
                )
            )
            
        if items_to_create:
            m.OrderItem.objects.bulk_create(items_to_create)
        order.total = order.calculate_total()
        order.save()
        return order

    
    @transaction.atomic
    def update(self, instance, validated_data):
        # 1. Extraemos items y dejamos que super().update maneje los campos simples
        items_data = validated_data.pop('items', None)
        instance = super().update(instance, validated_data)

        if items_data is None:
            return instance

        # --- FASE 1: PREPARACIÓN Y SINCRONIZACIÓN ---

        # 1.1. Obtenemos IDs de ítems que DEBEN existir después de esta actualización
        incoming_order_item_ids = set()
        
        # Almacenes para las operaciones en lote (bulk)
        items_to_update = []
        items_to_create = []

        # Mapa de todos los productos necesarios (incluye IDs para ítems nuevos y sus precios)
        product_ids_needed = {item_data['product_id'] for item_data in items_data if 'product_id' in item_data}
        products_map = {p.id: p for p in m.Product.objects.filter(id__in=product_ids_needed)}
        
        # Mapa de items existentes en la orden (por su ID de OrderItem)
        existing_items_map = {item.id: item for item in instance.items.all()}

        for item_data in items_data:
            # A. ÍTEM EXISTENTE (El frontend envía 'id')
            if 'id' in item_data:
                order_item_id = item_data['id']
                if order_item_id in existing_items_map:
                    order_item = existing_items_map[order_item_id]
                    product = order_item.product # Usamos el producto ya cargado
                    
                    # 1. Actualizar cantidad y total
                    order_item.quantity = item_data['quantity']
                    order_item.total = product.price * order_item.quantity
                    items_to_update.append(order_item)
                    incoming_order_item_ids.add(order_item_id)
            
            # B. ÍTEM NUEVO (El frontend envía 'product_id')
            elif 'product_id' in item_data:
                product_id = item_data['product_id']
                product = products_map.get(product_id)

                if product:
                    # 1. Preparar para crear
                    items_to_create.append(m.OrderItem(
                        order=instance,
                        product=product,
                        quantity=item_data['quantity'],
                        total=product.price * item_data['quantity']
                    ))
            
            # C. Ignorar cualquier otro payload malformado

        # --- FASE 2: ESCRITURA EN BASE DE DATOS (OPERACIONES EN LOTE) ---

        if items_to_update:
            m.OrderItem.objects.bulk_update(items_to_update, ['quantity', 'total'])

        if items_to_create:
            m.OrderItem.objects.bulk_create(items_to_create)

        # --- FASE 3: LIMPIEZA (BORRADO) ---

        # Encontramos los IDs de los ítems que estaban en la orden pero no llegaron en el payload
        current_order_item_ids = set(existing_items_map.keys())
        items_to_delete_ids = current_order_item_ids - incoming_order_item_ids
        
        if items_to_delete_ids:
                # Borramos en lote: los ítems que NO deben existir y que NO son ítems nuevos
                m.OrderItem.objects.filter(id__in=items_to_delete_ids).delete()


        # --- FASE 4: FINALIZACIÓN ---
        instance.total = instance.calculate_total()
        instance.save()

        return instance

class EconomicActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = m.EconomicActivity
        fields = '__all__' 

class ClientSerializer(serializers.ModelSerializer):
    economic_activity = serializers.StringRelatedField(source='economicActivity')
    class Meta:
        model = m.Client
        fields = '__all__' 

class BusinessProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = m.BusinessProfile
        fields = '__all__' 

class BillItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    class Meta:
        model = m.BillItem
        fields= ['id', 'product', 'quantity', 'price_at_sale']
    

class BillSerializer(serializers.ModelSerializer):
    #Los datos Foreing son business_data,client,
    business_id = serializers.PrimaryKeyRelatedField(queryset=m.BusinessProfile.objects.all(), source='business_data')
    client_id = serializers.PrimaryKeyRelatedField(queryset=m.Client.objects.all(), source='client')
    items = BillItemSerializer(many=True, write_only=True)
    class Meta:
        model = m.Bill
        fields = ['business_id', 'document_type', 'bill_number', 'date_time', 'client_id', 'type_of_pay', 'client_pay', 'change', 'e_billing_key', 'qr']
        read_only_fields = ['date_time','bill_number', 'e_billing_key', 'qr']

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        bill = m.Bill.objects.create(**validated_data)
        product_ids = [item['product_id'] for item in items_data]
        products = m.Product.objects.filter(id__in=product_ids)
        products_map = {product.id: product for product in products}
        items_to_create = []
        for item_data in items_data:
            product = products_map.get(item_data['product_id'])
            
            # Si por alguna razón el producto no existe, lo ignoramos.
            if not product:
                continue
            
            quantity = item_data['quantity']
            price = product.price
            items_to_create.append(
                m.BillItem(
                    bill=bill,
                    product_name=product.name,  # Copiamos los datos
                    quantity=quantity,
                    price_at_sale=price,      # Copiamos los datos
                    line_total=price * quantity
                )
            )
        if items_to_create:
            m.BillItem.objects.bulk_create(items_to_create)
        return bill
