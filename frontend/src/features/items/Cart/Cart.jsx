import { useNavigate } from 'react-router-dom';
import '/src/static/Tailwind.css';
import useCart from './hook/useCart';
import CartItem from './CartItem';
import usePageNavigate from "../../../hooks/usePageNavigation"

export default function Cart(props) {
    const { cart, handleDelete, handleAdd, onBillOrder, handleSaveChanges, closeOrderForBilling } = props;
    const navigate = useNavigate();
    const { isEditingMode, items, isCartEmpty, total } = useCart(cart);
    // const {}= usePageNavigate();

    const handlePrimaryAction = () => {
        if (isEditingMode) {
            // Si estamos en modo edición, llamamos a la función para abrir el pop-up
            handleSaveChanges()
            closeOrderForBilling()
        } else {
            // Si estamos creando una orden, mantenemos la navegación a la página de mesas.
            const statePayload = { sendingCart: cart };
            const path = '/table-assign';
            navigate(path, { state: statePayload });
        }
    };
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
                {isEditingMode ? `Orden #${cart.id}` : 'Carrito de Compras'}
                {isEditingMode && (
                    <button
                        onClick={closeOrderForBilling}
                        className="text-gray-500 hover:text-gray-800 cursor-pointer"
                    >
                        &times;
                    </button>)}
            </h2>


            {isCartEmpty ? (
                <p className="text-gray-500 text-center py-4">El carrito está vacío.</p>
            ) : (
                <ul className="divide-y divide-gray-200">
                    {items.map(item => 
                    <CartItem
                        key={item.id}
                        item={item}
                        handleDelete={handleDelete}
                        handleAdd={handleAdd}
                    />
                    )}
                </ul>
            )}

            {/* 4. SECCIÓN DE TOTAL Y BOTÓN ÚNICA */}
            <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span>₡{total.toLocaleString('es-CR')}</span>
                </div>
                {!isCartEmpty &&(
                <button
                    className={`p-3 mt-4 w-full font-bold text-white rounded-lg transition-colors  ${isCartEmpty ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 cursor-pointer'}`}
                    onClick={onBillOrder}
                    disabled={isCartEmpty}
                >
                    Facturar
                </button>)}
                <button
                    className={`p-3 mt-4 w-full font-bold text-white rounded-lg transition-colors  ${isCartEmpty ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 cursor-pointer'}`}
                    onClick={handlePrimaryAction}
                    disabled={isCartEmpty}
                >
                    {isEditingMode ? "Guardar" : (isCartEmpty ? 'Agrega un producto' : 'Agregar a mesa')}
                </button>
                
            </div>
        </div>
    );

}