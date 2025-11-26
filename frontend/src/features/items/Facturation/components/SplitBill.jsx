
export default function SplitBill(props) {
    const { productosRestantes, productosDivididos, dividirProducto, devolverProducto } = props;

    return (
        <>
            <div className="bg-gray-800 text-white rounded-lg max-h-[500px] w-60 overflow-y-auto p-4 mr-2">
                <h3 className="text-xl font-bold mb-4">Dividir la Cuenta</h3>
                {productosRestantes.map(item => (
                    <button key={item.id} className="w-full bg-gray-700 hover:bg-gray-600 rounded-lg p-3 mb-2 text-left font-medium cursor-pointer text-white" onClick={() => dividirProducto(item)}>
                        {item.quantity} x {item.product.name} - ₡{(item.product.price * item.quantity).toLocaleString('es-CR')}
                    </button>
                ))
                }
            </div>
            <div className="bg-gray-800 text-white rounded-lg max-h-[500px] overflow-y-auto p-4 ml-2 w-60">
                <h3 className="text-xl font-bold mb-4">Nueva Cuenta</h3>
                {productosDivididos && (productosDivididos.map(item => (
                        <div key={item.id}>
                            <button className="w-full bg-gray-700 hover:bg-gray-600 rounded-lg p-3 mb-2 text-left font-medium cursor-pointer text-white" onClick={() => devolverProducto(item)}>
                                {item.quantity} x {item.product.name} - ₡{(item.product.price * item.quantity).toLocaleString('es-CR')}
                            </button>
                        </div>
                    )))}
            </div>
        </>
    )
}