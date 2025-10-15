export default function CartItem(props) {
    const { item, handleDelete, handleAdd } = props;
    return (
        <li  className="py-3">
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
    )
}