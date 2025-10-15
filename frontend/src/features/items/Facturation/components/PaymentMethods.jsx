
export default function PaymentMethods(props) {
    const { paymentMethods, checkedState, paymentAmounts, handleAmountChange, setActivePaymentMethod, handleCheckboxChange } = props;
    return (
        <>
            <h3 className="font-semibold mb-2">Métodos de Pago</h3>
            {paymentMethods.map(method => (
                <div key={method} className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{method}</span>
                    {checkedState[method] && (
                        <input
                            type="number"
                            className='border border-gray-600 bg-gray-800 rounded w-full text-center mx-3'
                            value={paymentAmounts[method] || ''}
                            onChange={(e) => handleAmountChange(method, e.target.value)}
                            onFocus={() => setActivePaymentMethod(method)}
                        />
                    )}
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={checkedState[method] || ""} className="sr-only peer" onChange={() => handleCheckboxChange(method)} />
                        <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                </div>
            ))}

        </>
    )
}