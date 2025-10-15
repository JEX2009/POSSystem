import { useLocation, useNavigate } from 'react-router-dom';
import useCreate from '../../../hooks/useCreate';
import { createOrder } from "../../../services/api/apiOrder";

export default function useTableActions(refetch) {
    // -------------------------
    // React Router: ubicación y navegación
    // -------------------------
    const location = useLocation();
    const navigate = useNavigate();

    // -------------------------
    // Hook para crear una nueva orden
    // -------------------------
    const { error: errorO, handleCreate: handleCreateO } = useCreate(createOrder);

    // -------------------------
    // Navegación: Enviar orden al flujo de facturación
    // -------------------------
    const openBillingModal = (order) => {
        navigate('/', { state: { orderToBill: order } });
    };

    // -------------------------
    // Obtener carrito enviado desde otra vista
    // -------------------------
    const cartToAssign = location.state?.sendingCart || [];

    // -------------------------
    // Acción: Guardar orden con mesa asignada
    // -------------------------

    const saveOrder = async (tableId) => {
        try {
            if (!cartToAssign || cartToAssign.items.length === 0) return;

            const formattedItems = cartToAssign.items.map(item => ({
                product_id: item.id,
                quantity: item.quantity,

            }));

            const orderPayload = {
                items: formattedItems,
                table_id: tableId
            };

            await handleCreateO(orderPayload);

            // Refrescar datos y limpiar estado de navegación
            refetch();
            navigate(location.pathname, { replace: true, state: {} });
        } catch {
            errorO;
        }
    };

    // -------------------------
    // Retorno del hook
    // -------------------------
    return {
        openBillingModal,
        saveOrder,
    };
}
