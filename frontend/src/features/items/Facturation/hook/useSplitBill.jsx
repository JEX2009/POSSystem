import { useState, useMemo } from "react";

/**
 * Función ayudante pura para manipular una lista de ítems de forma inmutable.
 * @param {Array} lista - El array de ítems a modificar.
 * @param {Object} producto - El producto sobre el que se actúa.
 * @param {'ADD' | 'REMOVE'} accion - La operación a realizar.
 * @param {boolean} esOrdenExistente - Flag para determinar la estructura de los ítems.
 * @returns {Array} Un nuevo array con los ítems actualizados.
 */
const gestionarItems = (lista, producto, accion, esOrdenExistente) => {
    // Determina el ID del producto de forma consistente.
    const productoId = esOrdenExistente ? producto.product.id : producto.id;

    // Busca el índice del producto en la lista que queremos modificar.
    const indiceItem = lista.findIndex(item =>
        (esOrdenExistente ? item.product.id : item.id) === productoId
    );

    if (accion === 'ADD') {
        if (indiceItem > -1) {
            // Si el ítem ya existe, incrementamos su cantidad.
            const itemExistente = lista[indiceItem];
            const nuevaLista = [...lista];
            nuevaLista[indiceItem] = { ...itemExistente, quantity: itemExistente.quantity + 1 };
            return nuevaLista;
        } else {
            // Si es nuevo, lo añadimos con cantidad 1 y la estructura correcta.
            const nuevoItem = esOrdenExistente
                ? { product: producto.product, quantity: 1 } // Si la lista destino es de orden existente
                : { ...producto, quantity: 1 }; // Si la lista es de orden nueva
            return [...lista, nuevoItem];
        }
    }

    if (accion === 'REMOVE') {
        if (indiceItem > -1) {
            const itemExistente = lista[indiceItem];
            if (itemExistente.quantity > 1) {
                // Si la cantidad es > 1, la decrementamos.
                const nuevaLista = [...lista];
                nuevaLista[indiceItem] = { ...itemExistente, quantity: itemExistente.quantity - 1 };
                return nuevaLista;
            } else {
                // Si la cantidad es 1, lo eliminamos del array.
                return lista.filter(item => (esOrdenExistente ? item.product.id : item.id) !== productoId);
            }
        }
    }

    // Si la acción no es reconocida o el ítem no se encuentra, devuelve la lista original.
    return lista;
};

/**
 * Hook personalizado para gestionar la lógica de dividir una cuenta.
 * @param {Array} productosIniciales - La lista de ítems de la orden original.
 */
export default function useDividirCuenta(productosIniciales = []) {
    const [productosRestantes, setProductosRestantes] = useState(productosIniciales);
    const [productosDivididos, setProductosDivididos] = useState([]);

    // Determina el tipo de orden una sola vez para simplificar la lógica.
    // Esto es una pequeña optimización para no recalcularlo en cada render.
    const esOrdenExistente = useMemo(() =>
        productosIniciales.length > 0 && !!productosIniciales[0].product,
        [productosIniciales]
    );

    /**
     * Mueve una unidad de un producto de la lista "restante" a la lista "dividida".
     */
    const dividirProducto = (productoADividir) => {
        // Primero, se añade/incrementa en la lista de divididos.
        const nuevosDivididos = gestionarItems(productosDivididos, productoADividir, 'ADD', esOrdenExistente);
        setProductosDivididos(nuevosDivididos);

        // Luego, se reduce/elimina de la lista de restantes.
        const nuevosRestantes = gestionarItems(productosRestantes, productoADividir, 'REMOVE', esOrdenExistente);
        setProductosRestantes(nuevosRestantes);
    };

    /**
     * Devuelve una unidad de un producto de la lista "dividida" a la lista "restante".
     */
    const devolverProducto = (productoADevolver) => {
        // Primero, se añade/incrementa en la lista de restantes.
        const nuevosRestantes = gestionarItems(productosRestantes, productoADevolver, 'ADD', esOrdenExistente);
        setProductosRestantes(nuevosRestantes);
        
        // Luego, se reduce/elimina de la lista de divididos.
        const nuevosDivididos = gestionarItems(productosDivididos, productoADevolver, 'REMOVE', esOrdenExistente);
        setProductosDivididos(nuevosDivididos);
    };

    

    return {
        productosRestantes,
        productosDivididos,
        dividirProducto,
        devolverProducto,
        setProductosDivididos
    };
}