import '/src/static/Tailwind.css'
import { useNavigate } from 'react-router-dom';

export default function Cart(props) {
    const { cart, handleDelete } = props;
    const isCartEmpty = cart.length === 0;


    const total = cart.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
    }, 0);
    const navigate = useNavigate();

    const handleNavigation = () => {
        navigate('/table-assign', {state: {carrito : cart}});

    };

    return (
        <div className="bg-white p-4 rounded-lg shadow mt-4">
            <h2 className="text-xl font-bold mb-4">Carrito de Compras</h2>
            {cart.length === 0 ? (
                <p className="text-gray-600">El carrito está vacío.</p>
            ) : (
                <ul>
                    {cart.map((item, index) => (
                        <li key={index} className="border-b py-2 flex flex-col gap-2 justify-between ">
                            <div className='flex gap-2 justify-between'>
                                <span className="font-semibold">{item.name}</span>
                                <div className='flex gap-2'>
                                    <button className='bg-green-600 px-2 rounded-xl cursor-pointer'>+</button>
                                    <button className='bg-red-600 px-2 rounded-xl cursor-pointer' onClick={() => handleDelete(item.id)}>x</button>
                                </div>
                            </div>
                            <div className='flex gap-2 justify-between'>
                                <span className="font-semibold">Precio Unitario: ₡{item.price}</span>
                                <span className="font-semibold">Cantidad: {item.quantity}</span>
                                <span className="font-semibold">Total: ₡{item.price * item.quantity}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            <p className="mt-3 mb-3 text-slate-700">Total: {total}</p>

            <button
                className={`p-2  bg-green-600 rounded-xl w-full text-center ${isCartEmpty ? 'cursor-not-allowed ':'cursor-pointer hover:bg-green-700'  }`}
                onClick={isCartEmpty ? null : handleNavigation}
                disabled={isCartEmpty}
            >
                {isCartEmpty ? 'Agrega un producto' : 'Agregar a mesa'}
            </button>
            
        </div>
    )
}