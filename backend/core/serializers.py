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

    # ... (Tu método 'create' no necesita cambios) ...
    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        table_instance = validated_data.pop('table', None)
        order = m.Order.objects.create(table=table_instance, **validated_data)
        for item_data in items_data:
            product = m.Product.objects.get(id=item_data['product_id'])
            quantity = item_data['quantity']
            line_total = product.price * quantity
            m.OrderItem.objects.create(
                order=order, product=product, quantity=quantity, total=line_total
            )
        order.total = order.calculate_total()
        order.save()
        return order
        
    def update(self, instance, validated_data):
        """
        Este método sincroniza los items de una orden. Recibe una lista de items
        del frontend y ajusta la base de datos para que coincida, manejando
        la creación, actualización y eliminación de items.
        """
        # Obtenemos la lista de items del frontend. Si no viene, es una lista vacía.
        items_data = validated_data.pop('items', [])

        # --- FASE 1: PREPARACIÓN ---
        # Creamos un mapa de los items que ya existen en la BD para un acceso rápido.
        # { 25: <OrderItem object (id=25)>, 26: <OrderItem object (id=26)> }
        existing_items_map = {item.id: item for item in instance.items.all()}

        # Usaremos un 'set' para guardar los IDs de los items que nos llegan del frontend.
        incoming_item_ids = set()

        # --- FASE 2: PROCESAMIENTO (ACTUALIZAR Y CREAR) ---
        # Recorremos la lista de items que nos envió el frontend.
        for item_data in items_data:
            item_id = item_data.get('id', None)

            if item_id:
                # CASO A: El item ya existía (tiene ID).
                incoming_item_ids.add(item_id)
                if item_id in existing_items_map:
                    # Lo encontramos en nuestro mapa, actualizamos su cantidad y guardamos.
                    item_instance = existing_items_map[item_id]
                    item_instance.quantity = item_data['quantity']
                    item_instance.save()
            else:
                # CASO B: El item es nuevo (no tiene ID).
                product_id = item_data.get('product_id')
                if product_id:
                    product_instance = m.Product.objects.get(id=product_id) 
                    quantity = item_data.get('quantity', 1)
                    # Usamos el ingrediente que ya trajimos (el precio).
                    line_total = product_instance.price * quantity 
                    # Creamos un nuevo OrderItem en la base de datos.
                    m.OrderItem.objects.create(
                        order=instance,
                        product_id=product_id,
                        quantity=item_data['quantity'],
                        total=line_total
                    )

        # --- FASE 3: LIMPIEZA (ELIMINAR) ---
        # Comparamos los IDs originales con los que llegaron. Los que falten, se borran.
        ids_to_delete = set(existing_items_map.keys()) - incoming_item_ids
        if ids_to_delete:
            m.OrderItem.objects.filter(id__in=ids_to_delete).delete()

        # --- FASE 4: FINALIZACIÓN ---
        # Recalculamos el total de la orden con los datos actualizados y guardamos.
        instance.total = instance.calculate_total()
        instance.save()
        
        # Devolvemos la instancia de la orden actualizada.
        return instance