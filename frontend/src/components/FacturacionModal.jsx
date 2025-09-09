import React, { useState, useEffect } from 'react';
import PopUp from "./PopUp";

const FacturacionModal = ({ isModalOpen, closeModal, cart, onSuccess }) => {
    const paymentMethods = ["Efectivo", "Tarjeta", "Sinpe Movil", "Transferencia Bancaria"];
    const money = [100, 500, 1000, 2000, 5000, 10000, 20000];

    // Estados internos del modal
    const [tipoDocumento, setTipoDocumento] = useState("TiqueteElectronico");
    const [paymentAmounts, setPaymentAmounts] = useState({});
    const [activePaymentMethod, setActivePaymentMethod] = useState(null);
    const [checkedState, setCheckedState] = useState({});
    const [facturarError, setFacturarError] = useState({})

    // --- Usamos useEffect para resetear el estado interno cuando cambia la orden ---
    useEffect(() => {
        if (isModalOpen) {
            // Resetea los montos y checkboxes cada vez que se abre el modal con una nueva orden
            setPaymentAmounts({});
            setActivePaymentMethod(null);
            const initialState = paymentMethods.reduce((acc, method) => {
                acc[method] = false;
                return acc;
            }, {});
            setCheckedState(initialState);
        }
    }, [isModalOpen, cart]); // Se ejecuta si el modal se abre o si la orden (cart) cambia

    useEffect(() => {
        if (facturarError.state) {
            const timerId = setTimeout(() => {
                setFacturarError({ state: false, error: '' });
            }, 3000);
            return () => clearTimeout(timerId);
        }
    }, [facturarError]);

    const totalPagado = Object.values(paymentAmounts).reduce((suma, monto) => suma + monto, 0);


    //handdle que hace que al encenderlo haga focus en el input
    const handleCheckboxChange = (methodName) => {
        setCheckedState(prevState => {
            const isSwitchingOn = !prevState[methodName];
            const newState = { ...prevState, [methodName]: isSwitchingOn };

            if (isSwitchingOn) {
                // Si se está ENCENDIENDO, lo hacemos el método activo
                setActivePaymentMethod(methodName);
            } else {
                // Limpiamos el monto de este método de pago.
                handleAmountChange(methodName, 0);

                // Y si ERA el método activo, lo limpiamos
                if (activePaymentMethod === methodName) {
                    setActivePaymentMethod(null);
                }
            }

            return newState;
        });
    };

    //Este handdle nos dice con cuanto esta pagando
    //  { methodName: amount, }
    const handleAmountChange = (methodName, amount) => {
        setPaymentAmounts(prevAmounts => ({
            ...prevAmounts,
            [methodName]: parseFloat(amount) || 0
        }));
    };

    const handleAdd = (bill) => {
        if (!activePaymentMethod) return; //¿Hay algún método de pago seleccionado con el interruptor?
        if (bill === 0) { // Si es C se pone en 0
            handleAmountChange(activePaymentMethod, 0);
        } else {
            const currentAmount = paymentAmounts[activePaymentMethod] || 0; //Toma lo anterior 
            handleAmountChange(activePaymentMethod, currentAmount + bill);
        }
    };

    const handleFacturar = () => {
        // 1. Obtenemos la lista de todos los métodos de pago que el usuario ha marcado.
        const selectedMethods = Object.keys(checkedState).filter(method => checkedState[method]);

        if (selectedMethods.length === 0) {
            setFacturarError({ state: true, error: "Por favor, seleccione un método de pago." });
            return;
        }

        // ¿Tienen todos los métodos seleccionados un monto válido?
        for (const method of selectedMethods) {
            // Si el monto para este método no existe o es cero...
            if (!paymentAmounts[method] || paymentAmounts[method] <= 0) {
                setFacturarError({
                    state: true,
                    error: `El método '${method}' está seleccionado pero no tiene un monto.`
                });
                return; 
            }
        }
        // ¿El monto total es suficiente?
        if (totalPagado < cart.total) {
            setFacturarError({ state: true, error: "El monto pagado es insuficiente." });
            return;
        }

        // Si ALGUNO de los métodos seleccionados no es efectivo, el pago total debe ser exacto.
        const hasNonCashMethod = selectedMethods.some(method => method !== 'Efectivo');
        if (hasNonCashMethod && parseInt(cart.total) !== totalPagado) {
            setFacturarError({
                state: true,
                error: "Si se usa Tarjeta/SINPE, el pago total debe ser exacto."
            });
            return;
        }

        onSuccess();
    }

    // Si no hay orden para facturar, no renderizamos nada (o un loader)
    if (!cart) {
        return null;
    }

    return (
        <PopUp isModalOpen={isModalOpen} closeModal={closeModal}>
            <h2 className="text-xl font-bold mb-2">Facturar Orden #{cart.id}</h2>
            {facturarError.state && (<span className='text-lg font-sans mb-4 text-red-600'>{facturarError.error}</span>)}
            <div className="grid grid-cols-[30px_1fr_1fr_1fr] gap-2">
                {/* Columna 1: DIVIDIR CUENTA */}
                <div>
                    <button className="w-full h-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center rounded-lg shadow-lg font-bold tracking-widest">
                        <span className="transform rotate-180" style={{ writingMode: 'vertical-lr' }}>
                            DIVIDIR
                        </span>
                    </button>
                </div>

                {/* Columna 2: Tipo de Documento */}
                <div className="col-span-1 bg-gray-700 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2 text-white">Tipo de documento</h3>
                    <select
                        value={tipoDocumento}
                        onChange={(e) => setTipoDocumento(e.target.value)}
                        className="w-full bg-gray-800 text-white rounded p-2 mb-2"
                    >
                        <option value="TiqueteElectronico">Tiquete Electronico</option>
                        <option value="FacturaElectronica">Factura Electronica</option>
                    </select>
                    {tipoDocumento === "FacturaElectronica" && (
                        <input type="text" placeholder="Buscar Cliente por Cédula" className="w-full bg-gray-800 text-white rounded p-2" />
                    )}
                </div>

                {/* Columna 3: Métodos de Pago */}
                <div className="col-span-1 bg-gray-700 p-4 rounded-lg text-white">
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
                                <input type="checkbox" checked={checkedState[method]} className="sr-only peer" onChange={() => handleCheckboxChange(method)} />
                                <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                            </label>
                        </div>
                    ))}
                </div>

                {/* Columna 4: Total y Facturación */}
                <div className="col-span-1 bg-gray-700 p-4 rounded-lg flex flex-col text-white">
                    <h3 className="font-semibold text-lg">Total: ₡{parseFloat(cart.total).toLocaleString('es-CR')}</h3>
                    <h3 className="font-semibold mt-2">Pagos Rápidos:</h3>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                        {money.map(bill => (
                            <button key={bill} className="cursor-pointer border border-gray-600 rounded px-2 py-1 hover:bg-gray-600" onClick={() => handleAdd(bill)}>
                                {bill / 1000}k
                            </button>
                        ))}
                        <button className="cursor-pointer bg-red-500 hover:bg-red-600 rounded px-2 py-1" onClick={() => handleAdd(0)}>C</button>
                    </div>
                    <div className="mt-auto pt-4">
                        <h3 className="font-semibold">Pagado: ₡{totalPagado.toLocaleString('es-CR')}</h3>
                        <h3 className="font-semibold">Cambio: ₡{(totalPagado - cart.total).toLocaleString('es-CR')}</h3>
                        <button className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg p-3 mt-2 font-bold cursor-pointer" onClick={handleFacturar}>
                            Facturar
                        </button>
                    </div>
                </div>
            </div>
        </PopUp>
    );
};

export default FacturacionModal;
