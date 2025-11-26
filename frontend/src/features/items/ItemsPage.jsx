import '/src/static/Tailwind.css'
import Cart from './Cart/Cart';
import ProductList from './components/ProductList';
import AddProduct from './components/AddProduct';
import FacturacionModal from "./Facturation/FacturacionModal";
import { useState } from 'react';
import { useLocation} from 'react-router-dom';
import useOrderManager from "./hooks/useOrderManager";
import useOrderFlow from './hooks/useOrderFlow';

export default function ItemsPage() {
    const location = useLocation();
    //Llamadas al hook
    const { order: order, addItem, removeItem,setOrder } = useOrderManager(location.state?.orderToBill || { items: [] });
    const { handleCloseEditingMode, isBillingModalOpen, closeBillingModal, handleBillingSuccess, handleSaveChanges, handleSaveAndProceedToBilling, updateState } = useOrderFlow(order);

    const [isAddProductModalOpen, setAddProductModalOpen] = useState(false);

    // Un contador que se usa como "gatillo" para refrescar la lista de productos.
    const [refreshProductListTrigger, setRefreshProductListTrigger] = useState(0);

    const handleProductAdded = () => {
        setRefreshProductListTrigger(currentValue => currentValue + 1);
    }

    // Funciones para controlar el modal de "Añadir Producto".
    const openAddProductModal = () => setAddProductModalOpen(true);
    const closeAddProductModal = () => setAddProductModalOpen(false);

    // --- RENDERIZADO DEL COMPONENTE ---
    return (
        <div className="flex flex-col md:flex-row gap-4 p-4">
            {/* Columna principal con la lista de productos */}
            <div className="md:w-2/3">
                <ProductList
                    addToCar={addItem}
                    openAddProductModal={openAddProductModal}
                    refreshTrigger={refreshProductListTrigger}
                />
            </div>

            {/* Columna lateral con el carrito/gestor de orden */}
            <div className="md:w-1/3">
                <Cart
                    cart={order}
                    handleDelete={removeItem}
                    handleAdd={addItem}
                    onBillOrder={()=>handleSaveAndProceedToBilling(setOrder)}
                    handleSaveChanges={handleSaveChanges}
                    closeOrderForBilling={()=> handleCloseEditingMode(setOrder)}
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
                    cart={order}
                    onSuccess={()=> handleBillingSuccess(setOrder)}
                />
            )}
        </div>
    )
}
