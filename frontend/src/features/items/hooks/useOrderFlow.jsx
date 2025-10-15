import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateOrder, createOrder } from "../../../services/api/apiOrder";
import useUpdate from "../../../hooks/useUpdate";
import useCreate from '../../../hooks/useCreate';

export default function useOrderActions(order) {
    // -------------------------
    // React Router: ubicación actual y navegación
    // -------------------------
    const location = useLocation();
    const navigate = useNavigate();

    // -------------------------
    // Hook personalizado para actualizar una orden vía API
    // -------------------------
    const {
        handleUpdate: apiUpdateOrder,
        isLoading: isSaving,
        error: saveError
    } = useUpdate(updateOrder);

    const { isLoading:savingCreate, error:createError,  handleCreate:handleCreate } = useCreate(createOrder);

    // -------------------------
    // Estado local: control del modal de facturación
    // -------------------------
    const [isBillingModalOpen, setBillingModalOpen] = useState(false);

    // -------------------------
    // UI: Cerrar modal de facturación
    // -------------------------
    const closeBillingModal = () => {
        setBillingModalOpen(false);
    };

    // -------------------------
    // UI: Cerrar modo de edición de la orden y limpiar estado
    // -------------------------
    const handleCloseEditingMode = (setOrder) => {
        setOrder({ items: [] });
        navigate(location.pathname, { replace: true, state: {} });
    };

    // -------------------------
    // Lógica: Construir payload para actualizar la orden
    // -------------------------
    const prepareItemsPayload = () => {
        if (!order || !order.items) return [];

        return order.items.map(item => {
            if (item.id) {
                return { id: item.id, quantity: item.quantity };
            } else {
                return { product_id: item.product.id, quantity: item.quantity };
            }
        });
    };

    // -------------------------
    // Acción: Finalizar facturación y marcar orden como cancelada
    // -------------------------
    const handleBillingSuccess = async (setOrder) => {
        if (!order) return;
        try {
            await apiUpdateOrder(order.id, { canceled: true });
            handleCloseEditingMode(setOrder);
            closeBillingModal();
        } catch {
            console.error("Error al completar la facturación:", saveError);
        }
    };

    // -------------------------
    // Acción: Guardar cambios en la orden (sin facturar)
    // -------------------------
    const handleSaveChanges = async () => {
        if (!order || !order.id) return;

        const finalPayload = { items: prepareItemsPayload() };

        try {
            await apiUpdateOrder(order.id, finalPayload);
        } catch {
            console.error("Error al guardar los cambios:", saveError);
        } finally {
            navigate(location.pathname, { replace: true, state: {} });
        }
    };

    // -------------------------
    // Acción: Guardar y proceder a facturación (abrir modal)
    // -------------------------
    const handleSaveAndProceedToBilling = async (setOrder) => {
        
        if (!order) return;
        if (!order.id) {
            const formattedItems = order.items.map(item => ({
                product_id: item.id,
                quantity: item.quantity,

            }));
            

            const data = await handleCreate({items:formattedItems});
            
            setOrder(data)
            setBillingModalOpen(true);
            
        } else {
            const finalPayload = { items: prepareItemsPayload() };

            try {
                const updatedOrderFromAPI = await apiUpdateOrder(order.id, finalPayload);
                setBillingModalOpen(true);
                return updatedOrderFromAPI;
            } catch {
                console.error("Error al guardar y facturar:", saveError);
            }
        }

    };

    // -------------------------
    // Retorno del hook
    // -------------------------
    return {
        isBillingModalOpen,
        handleCloseEditingMode,
        closeBillingModal,
        handleBillingSuccess,
        handleSaveChanges,
        handleSaveAndProceedToBilling,
        updateState: { isSaving, saveError }
    };
}
