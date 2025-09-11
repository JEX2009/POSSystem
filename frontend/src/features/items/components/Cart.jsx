import { useNavigate } from 'react-router-dom';
import '/src/static/Tailwind.css';

export default function Cart(props) {
    const { sendingCart, handleDelete, handleAdd, billToCanceled, onBillOrder, handleSaveChanges,closeOrderForBilling } = props;
    const navigate = useNavigate();

    // --- 1. PREPARACIÓN DE DATOS Y ESTADOS ---

    // Determinamos el modo del carrito y qué lista de items mostrar.
    // Esto evita tener lógica compleja y duplicada en el JSX.
    const isEditingMode = sendingCart.length === 0 && billToCanceled?.items?.length > 0;

    // "Normalizamos" los datos para que siempre tengan la misma estructura,
    // sin importar si vienen de una nueva orden o de una existente.
    const itemsToDisplay = (isEditingMode ? billToCanceled.items : sendingCart).map(item => ({
        id: isEditingMode ? item.product.id : item.id,
        name: isEditingMode ? item.product.name : item.name,
        price: isEditingMode ? item.product.price : item.price,
        quantity: item.quantity,
        // Guardamos una referencia al objeto original para las funciones handler
        originalItem: item
    }
    ));


    const isCartEmpty = itemsToDisplay.length === 0;

    // Calculamos el total usando la lista normalizada. Una sola vez.
    const total = itemsToDisplay.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
    }, 0);

    const handlePrimaryAction = () => {
        if (isEditingMode) {
            // Si estamos en modo edición, llamamos a la función para abrir el pop-up
            // y le pasamos la orden que se debe facturar.
            onBillOrder();
        } else {
            // Si estamos creando una orden, mantenemos la navegación a la página de mesas.
            const statePayload = { sendingCart: sendingCart };
            const path = '/table-assign';
            navigate(path, { state: statePayload });
        }
    };


    // --- 2. RENDERIZADO DEL COMPONENTE ---

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
                {isEditingMode ? `Orden #${billToCanceled.id}` : 'Carrito de Compras'}
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
                // 3. TENEMOS UN ÚNICO CÓDIGO PARA RENDERIZAR LA LISTA
                // Ya no hay duplicación. Se mapea sobre `itemsToDisplay`.
                <ul className="divide-y divide-gray-200">
                    {itemsToDisplay.map(item => (
                        <li key={item.id} className="py-3">
                            <div className='flex items-center justify-between'>
                                <span className="font-semibold text-gray-700">{item.name}</span>
                                <div className='flex items-center gap-2'>
                                    {/* Pasamos el objeto original a las funciones */}
                                    <button className='bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-green-600 transition cursor-pointer' onClick={() => handleAdd(item)}>+</button>
                                    <button className='bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-600 transition cursor-pointer' onClick={() => handleDelete(item)}>x</button>
                                </div>
                            </div>
                            <div className='flex justify-between text-sm text-gray-500 mt-1'>
                                <span>₡{item.price} x {item.quantity}</span>
                                <span className="font-semibold">₡{item.price * item.quantity}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {/* 4. SECCIÓN DE TOTAL Y BOTÓN ÚNICA */}
            <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span>₡{total.toLocaleString('es-CR')}</span>
                </div>

                <button
                    className={`p-3 mt-4 w-full font-bold text-white rounded-lg transition-colors  ${isCartEmpty ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 cursor-pointer'}`}
                    onClick={handlePrimaryAction}
                    disabled={isCartEmpty}
                >
                    {isEditingMode ? 'Facturar' : (isCartEmpty ? 'Agrega un producto' : 'Agregar a mesa')}
                </button>
                {isEditingMode && (<button
                    className={`p-3 mt-4 w-full font-bold text-white rounded-lg bg-green-600 hover:bg-green-700 cursor-pointer`}
                    onClick={handleSaveChanges}
                >
                    Guardar
                </button>)}
            </div>
        </div>
    );
}
