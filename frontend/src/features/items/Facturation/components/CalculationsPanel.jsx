
export default function CalculationsPanel(props) {
    const { total, money, handleAdd, totalPagado, onProcessPayment,} = props;
    return(
        <>
        <h3 className="font-semibold text-lg">Total: ₡{parseFloat(total).toLocaleString('es-CR')}</h3>
        <h3 className="font-semibold mt-2">Pagos Rápidos:</h3>
        <div className="grid grid-cols-3 gap-2 mt-2">
            {money.map(bill => (
                <button key={bill} className="cursor-pointer border border-gray-600 rounded hover:bg-gray-600 " onClick={() => handleAdd(bill)}>₡{bill}
                </button>
            ))}
            <button className="cursor-pointer bg-red-500 hover:bg-red-600 rounded px-2 py-1" onClick={() => handleAdd(0)}>C</button>
        </div>
        <div className="mt-auto pt-4">
            <h3 className="font-semibold">Pagado: ₡{totalPagado.toLocaleString('es-CR')}</h3>
            <h3 className="font-semibold">Cambio: ₡{(totalPagado - total).toLocaleString('es-CR')}</h3>
            <button className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg p-3 mt-2 font-bold cursor-pointer" onClick={onProcessPayment}>
                Facturar
            </button>
        </div>
    </>
    )
}