import { featchSalons, createOrder, updateOrder } from "../services/api";
import { useState, useEffect } from 'react';
import SalonList from '../components/SalonList';
import { useLocation, useNavigate } from 'react-router-dom';
import FacturacionModal from "../components/FacturacionModal";

export default function TablesPage() {
    const [salones, setSalones] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    
    // --- ESTADO SIMPLIFICADO ---
    // El carrito que viene de la otra página
    const cartToAssign = location.state?.sendingCart || []; 
    
    // Estado para el modal de facturación
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Estado para saber QUÉ orden facturar
    const [orderToBill, setOrderToBill] = useState(null);

    // --- FUNCIÓN PARA OBTENER DATOS (Sin cambios) ---
    const fidingSalons = async () => {
        try {
            const response = await featchSalons();
            setSalones(response);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fidingSalons();
    }, []);

    // --- FUNCIÓN saveOrder CORREGIDA ---
    const saveOrder = async (tableId) => {
        // 1. Validamos que haya algo en el carrito para asignar
        if (!cartToAssign || cartToAssign.length === 0) {
            console.error("No hay carrito para asignar a la mesa.");
            // Opcional: Mostrar un mensaje al usuario
            return;
        }

        try {
            const formattedItems = cartToAssign.map(item => ({
                product_id: item.id,
                quantity: item.quantity,
            }));

            // 2. El payload AHORA es correcto. 'table_id' está al nivel principal.
            const orderPayload = { 
                items: formattedItems,
                table_id: tableId 
            };
            
            await createOrder(orderPayload);
            
            // 3. Refrescamos los datos para ver la mesa ocupada
            fidingSalons();
            
            // 4. Limpiamos el estado de la navegación para no re-asignar por error
            navigate(location.pathname, { replace: true, state: {} });

        } catch (error) {
            console.log("Error al crear la orden:", error);
        }
    }
    
    // --- NUEVAS FUNCIONES PARA MANEJAR EL MODAL ---
    const openBillingModal = (order) => {
        setOrderToBill(order); // Guardamos la orden específica que se va a facturar
        setIsModalOpen(true);
    };

    const closeBillingModal = () => {
        setIsModalOpen(false);
        setOrderToBill(null); // Limpiamos la orden al cerrar
    };
    
    // --- FUNCIÓN PARA PASAR AL MODAL Y ACTUALIZAR LA VISTA ---
    const handleBillingSuccess = async () => {
        if (!orderToBill) return;

        try {
            await updateOrder(orderToBill.id, { canceled: true });
            closeBillingModal(); // Cerramos el modal
            fidingSalons(); // ¡Refrescamos los datos para que la mesa se libere!
        } catch(error) {
            console.error("Error al facturar la orden:", error);
        }
    };

    return (
        <div className="">
            <div className='text-center'>
                <SalonList
                    salones={salones}
                    saveOrder={saveOrder}
                    // Le pasamos la función para abrir el modal con la orden correcta
                    onTableSelect={openBillingModal} 
                />
                
                {/* El modal ahora se renderiza aquí para tener acceso a todo el estado */}
                {isModalOpen && (
                    <FacturacionModal
                        isModalOpen={isModalOpen}
                        closeModal={closeBillingModal}
                        cart={orderToBill} // Le pasamos la orden específica
                        onSuccess={handleBillingSuccess} // Le pasamos la función de refresco
                    />
                )}
            </div>
        </div>
    )
}
