import '/src/static/Tailwind.css'
import Cart from './components/Cart';
import ProductList from './components/ProductList';
import AddProduct from './components/AddProduct';
import FacturacionModal from "./components/FacturacionModal";
import { updateOrder } from "../../services/api/apiOrder";
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ItemsPage() {
    // --- ESTADO DEL COMPONENTE ---

    // Almacena los productos de una NUEVA orden que se está creando.
    const [newOrderItems, setNewOrderItems] = useState([]);

    // Controla la visibilidad del modal para AÑADIR un nuevo producto al sistema.
    const [isAddProductModalOpen, setAddProductModalOpen] = useState(false);

    // Controla la visibilidad del modal de FACTURACIÓN para una orden existente.
    const [isBillingModalOpen, setBillingModalOpen] = useState(false);

    // Un contador que se usa como "gatillo" para refrescar la lista de productos.
    const [refreshProductListTrigger, setRefreshProductListTrigger] = useState(0);

    const [existingOrderForBilling, setExistingOrderForBilling] = useState(null)

    // Hooks de React Router para manejar la navegación y el estado entre rutas.
    const location = useLocation();
    const navigate = useNavigate();

    // Obtiene la orden existente pasada desde otra página (ej. la vista de mesas).
    // Si no se pasa ninguna orden, es un objeto vacío.
    useEffect(() => {
        const orderFromState = location.state?.orderToBill || null;
        setExistingOrderForBilling(orderFromState);
    }, [location,])
    // --- MANEJADORES DE EVENTOS Y FUNCIONES ---

    // Callback que se ejecuta cuando se crea un nuevo producto con éxito.
    // Incrementa el "gatillo" para forzar la recarga del componente ProductList.
    const handleProductAdded = () => {
        setRefreshProductListTrigger(currentValue => currentValue + 1);
    }

    // Funciones para controlar el modal de "Añadir Producto".
    const openAddProductModal = () => setAddProductModalOpen(true);
    const closeAddProductModal = () => setAddProductModalOpen(false);

    // Añade un producto al carrito de la NUEVA orden.
    // Si el producto ya existe, incrementa su cantidad.
    // --- MANEJADORES DE LÓGICA ---

    // Esta función ahora se encarga de AÑADIR un producto nuevo o INCREMENTAR
    // la cantidad de uno existente, tanto para el carrito de una nueva orden
    // como para la lista de items de una orden que se está editando.
    const handleAddOrUpdateItem = (product) => {

        // --- CASO 1: Estamos editando una orden existente ---
        if (existingOrderForBilling) {
            const items = existingOrderForBilling.items;
            // Buscamos el item existente dentro de la orden que se edita.
            // Nota: la estructura es item.product.id
            const existingItem = items.find(item => item.product.id === product.id);

            let updatedItems; // Variable para guardar el nuevo array de items.

            if (existingItem) {
                // Si el item ya existe, creamos un nuevo array incrementando su cantidad.
                updatedItems = items.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                // Si es un producto nuevo, lo "envolvemos" en la estructura de un OrderItem.
                const newOrderItem = {
                    product: product, // El producto completo va anidado.
                    quantity: 1
                };
                updatedItems = [...items, newOrderItem];
            }

            // CREACIÓN DEL NUEVO ESTADO:
            // Creamos un objeto de orden completamente nuevo usando el spread operator
            // y le asignamos el array de items actualizado.
            const updatedOrder = {
                ...existingOrderForBilling,
                items: updatedItems
            };

            // Actualizamos el estado con el objeto nuevo. React detectará el cambio.
            setExistingOrderForBilling(updatedOrder);

            // --- CASO 2: Estamos creando una nueva orden ---
        } else {
            // Buscamos el producto en el carrito de la nueva orden.
            const existingItemInNewCart = newOrderItems.find(item => item.id === product.id);

            let updatedItems;

            if (existingItemInNewCart) {
                // Si ya existe, incrementamos su cantidad.
                updatedItems = newOrderItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                // Si es nuevo, lo añadimos con cantidad 1.
                updatedItems = [...newOrderItems, { ...product, quantity: 1 }];
            }

            // Actualizamos el estado del carrito de la nueva orden.
            setNewOrderItems(updatedItems);
        }
    };
    // Quita un producto del carrito de la NUEVA orden.
    // Si la cantidad es mayor a 1, la decrementa. Si es 1, lo elimina del carrito.
    const removeFromNewOrder = (product) => {
        if (existingOrderForBilling) {
            const items = existingOrderForBilling.items;
            // El 'product' viene del Cart y tiene la estructura normalizada { id, name, ... }
            // Buscamos el item correspondiente en la lista original de la orden.
            const existingItem = items.find(item => item.product.id === product.id);

            let updatedItems;

            // Verificamos si el item existe y si su cantidad es mayor a 1.
            if (existingItem && existingItem.quantity > 1) {
                // Si es así, DECREMENTAMOS la cantidad.
                updatedItems = items.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                );
            } else {
                // Si la cantidad es 1 o no se encuentra (por seguridad), ELIMINAMOS el item.
                updatedItems = items.filter(item => item.product.id !== product.id);
            }

            // Actualizamos el estado con una copia inmutable de la orden.
            setExistingOrderForBilling({ ...existingOrderForBilling, items: updatedItems });

            // --- CASO 2: Estamos creando una nueva orden ---
        } else {
            const items = newOrderItems;
            const existingItem = items.find(item => item.id === product.id);
            let updatedItems;

            if (existingItem && existingItem.quantity > 1) {
                // Si la cantidad es mayor a 1, DECREMENTAMOS.
                updatedItems = items.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                );
            } else {
                // Si no, ELIMINAMOS.
                updatedItems = items.filter(item => item.id !== product.id);
            }
            // Actualizamos el estado del carrito de la nueva orden.
            setNewOrderItems(updatedItems);
        }
    }

    // Callback que se ejecuta cuando la facturación de una orden existente es exitosa.
    const handleBillingSuccess = async () => {
        if (!existingOrderForBilling) return;
        try {
            // Llama a la API para marcar la orden como completada ("canceled").
            await updateOrder(existingOrderForBilling.id, { canceled: true });
            // Limpia el estado de la navegación para no volver a cargar la misma ordend.
            navigate(location.pathname, { replace: true, state: {} });
            closeBillingModal(); // Cierra el modal de facturación.
        } catch (error) {
            error;
        }
    };

    const handleSaveChanges = async () => {
        if (!existingOrderForBilling) return;
        const itemsPayload = existingOrderForBilling.items.map(item => {
            if (item.id) {
                // Si el item tiene un 'id', es un OrderItem que ya existía.
                // El backend solo necesita su ID y la nueva cantidad.
                return {
                    id: item.id,
                    quantity: item.quantity
                };
            } else {
                // Si no tiene 'id', es un producto nuevo que acabamos de añadir.
                // El backend necesita el ID del producto para crear el OrderItem.
                return {
                    product_id: item.product.id,
                    quantity: item.quantity
                };
            }
        });
        const finalPayload = {
            items: itemsPayload
        };

        // 4. Envío a la API: Hacemos la petición PATCH para actualizar la orden.
        try {
            await updateOrder(existingOrderForBilling.id, finalPayload);
        } catch (error) {
            error;
        }finally{
            navigate(location.pathname, { replace: true, state: {} });
            setExistingOrderForBilling(null);
        }
    };

    const handleSaveAndProceedToBilling = async () => {
        if (!existingOrderForBilling) return;

        // 1. PREPARAMOS EL PAYLOAD PARA GUARDAR
        // (Esta es la misma lógica de transformación que ya teníamos)
        const itemsPayload = existingOrderForBilling.items.map(item => {
            if (item.id) {
                return { id: item.id, quantity: item.quantity };
            } else {
                return { product_id: item.product.id, quantity: item.quantity };
            }
        });
        const finalPayload = { items: itemsPayload };

        try {
            // 2. GUARDAMOS LOS CAMBIOS EN LA BASE DE DATOS
            // Usamos 'await' para esperar a que la API confirme que todo se guardó.
            const updatedOrderFromAPI = await updateOrder(existingOrderForBilling.id, finalPayload);
            
            // 3. ACTUALIZAMOS EL ESTADO LOCAL CON LA RESPUESTA
            // Esto asegura que el modal muestre los datos 100% reales de la BD.
            setExistingOrderForBilling(updatedOrderFromAPI);

            // 4. SOLO SI TODO FUE EXITOSO, ABRIMOS EL MODAL
            setBillingModalOpen(true);

        } catch (error) {
            error;
        }
    };

    // Cierra el modal de facturación.
    const closeBillingModal = () => {
        setBillingModalOpen(false);
    };

    const closeOrderForBilling = () => {
        navigate(location.pathname, { replace: true, state: {} });
        setExistingOrderForBilling(null);
    }

    // --- RENDERIZADO DEL COMPONENTE ---

    return (
        <div className="flex flex-col md:flex-row gap-4 p-4">
            {/* Columna principal con la lista de productos */}
            <div className="md:w-2/3">
                <ProductList
                    addToCar={handleAddOrUpdateItem}
                    openAddProductModal={openAddProductModal}
                    refreshTrigger={refreshProductListTrigger}
                />
            </div>

            {/* Columna lateral con el carrito/gestor de orden */}
            <div className="md:w-1/3">
                <Cart
                    sendingCart={newOrderItems}
                    handleDelete={removeFromNewOrder}
                    handleAdd={handleAddOrUpdateItem}
                    billToCanceled={existingOrderForBilling}
                    onBillOrder={handleSaveAndProceedToBilling}
                    handleSaveChanges={handleSaveChanges}
                    closeOrderForBilling={closeOrderForBilling}
                />
            </div>

            {/* Renderizado condicional de los modales (pop-ups) */}
            {isAddProductModalOpen && (
                <AddProduct
                    isModalOpen={isAddProductModalOpen}
                    closeModal={closeAddProductModal}
                    onSuccess={handleProductAdded}
                />
            )}

            {isBillingModalOpen && (
                <FacturacionModal
                    isModalOpen={isBillingModalOpen}
                    closeModal={closeBillingModal}
                    cart={existingOrderForBilling}
                    onSuccess={handleBillingSuccess}
                />
            )}
        </div>
    )
}
