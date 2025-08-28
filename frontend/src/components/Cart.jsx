import '/src/static/Tailwind.css'

export default function Cart(props) {
    const { cart } = props;

    const total = cart.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
    }, 0);

    return (
        <div className="bg-white p-4 rounded-lg shadow mt-4">
            <h2 className="text-xl font-bold mb-4">Carrito de Compras</h2>
            {cart.length === 0 ? (
                <p className="text-gray-600">El carrito está vacío.</p>
            ) : (
                <ul>
                    {cart.map((item, index) => (
                        <li key={index} className="border-b py-2">
                            <span className="font-semibold">{item.name}</span> - ₡{item.price} - {item.quantity} - Total: ₡{item.price * item.quantity}
                        </li>
                    ))}
                </ul>
            )}
            <p className="mt-3 mb-3 text-state-700">Total: {total}</p>

            <button className="p-2 cursor-pointer bg-green-600 rounded-xl w-full text-center">Facturar</button>
        </div>
    )
}