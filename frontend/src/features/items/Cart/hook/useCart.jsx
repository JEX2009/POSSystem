import { useMemo } from 'react';

export default function useCart(cart) {
    const isEditingMode = Boolean(cart?.id);

    // Normalizar los datos al inicio.
    // Usamos useMemo para optimizar y evitar recalculos innecesarios.
    const items = useMemo(() => {
        const rawItems = cart?.items  || [];
        return rawItems.map(item => ({
            id: isEditingMode ? item.product.id : item.id,
            name: isEditingMode ? item.product.name : item.name,
            price: isEditingMode ? item.product.price : item.price,
            quantity: item.quantity,
            originalItem: item
        }));
    }, [cart, isEditingMode]);

    // Usamos useMemo nuevamente para optimizar.
    const isCartEmpty = useMemo(() => items.length === 0, [items]);
    const total = useMemo(() => items.reduce((sum, item) => sum + (item.price * item.quantity), 0), [items]);

    return { isEditingMode, items, isCartEmpty, total };
}