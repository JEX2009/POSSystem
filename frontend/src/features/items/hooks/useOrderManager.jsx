import { useState } from "react";


const manageItems = (items, product, action, isExistingOrder) => {
    const itemIndex = items.findIndex(item =>
        isExistingOrder ? item.product.id === product.id : item.id === product.id
    );
    const newItems = [...items];

    if (action === 'ADD') {
        if (itemIndex > -1) {
            const existingItem = newItems[itemIndex];
            newItems[itemIndex] = { ...existingItem, quantity: existingItem.quantity + 1 };
        } else {
            const newItem = isExistingOrder
                ? { product: product, quantity: 1 }
                : { ...product, quantity: 1 };
            newItems.push(newItem);
        }
    }

    if (action === 'REMOVE') {
        if (itemIndex > -1) {
            const existingItem = newItems[itemIndex];
            if (existingItem.quantity > 1) {
                newItems[itemIndex] = { ...existingItem, quantity: existingItem.quantity - 1 };
            } else {
                newItems.splice(itemIndex, 1);
            }
        }
    }

    return newItems;
};

export default function useOrderManager(orderToBill) {
    const [order, setOrder] = useState(orderToBill || { items: [] });
    const addItem = (product) => {
        setOrder(currentOrder => {
            // 1. Acceso seguro a items. currentOrder?.items || [] asegura que nunca es undefined.
            const currentItems = currentOrder?.items || [];
            
            // 2. Cálculo seguro de isExisting (para manejar la lógica de anidamiento de productos)
            const isExisting = Boolean(currentOrder?.id);

            const newItems = manageItems(currentItems, product, 'ADD', isExisting);
            
            // 3. Retorno seguro: Asegura que siempre devolvemos un objeto
            return { 
                ...(currentOrder || {}), 
                items: newItems 
            };
        });
    };
    
    const removeItem = (product) => {
        setOrder(currentOrder => {
            const currentItems = currentOrder?.items || [];
            const isExisting = Boolean(currentOrder?.id);

            const newItems = manageItems(currentItems, product, 'REMOVE', isExisting);
            
            return { 
                ...(currentOrder || {}), 
                items: newItems 
            };
        });
    };
    
    return {
        order,
        addItem,
        removeItem,
        setOrder
    };
}