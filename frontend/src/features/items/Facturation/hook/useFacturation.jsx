import React, { useState, useEffect } from 'react';

export default function useFacturation(isModalOpen, cart) {
    // -------------------------
    // Constantes
    // -------------------------
    const money = [5, 10, 25, 50, 100, 500, 1000, 2000, 5000, 10000, 20000];
    const paymentMethods = ["Efectivo", "Tarjeta", "Sinpe Movil", "Transferencia Bancaria"];

    // -------------------------
    // Estado: Documento
    // -------------------------
    const [tipoDocumento, setTipoDocumento] = useState("TiqueteElectronico");

    // -------------------------
    // Estado: Métodos de pago
    // -------------------------
    const [paymentAmounts, setPaymentAmounts] = useState({});
    const [activePaymentMethod, setActivePaymentMethod] = useState();
    const [checkedState, setCheckedState] = useState({});

    // -------------------------
    // Estado: Vista y errores
    // -------------------------
    const [facturarError, setFacturarError] = useState({});
    const [isSplitViewOpen, setSplitViewOpen] = useState(false);

    // -------------------------
    // Efectos
    // -------------------------

    // Resetear cuando se abre el modal
    useEffect(() => {
        if (isModalOpen) {
            setPaymentAmounts({});
            setActivePaymentMethod(null);

            const initialState = paymentMethods.reduce((acc, method) => {
                acc[method] = false;
                return acc;
            }, {});
            setCheckedState(initialState);
        }
    }, [isModalOpen, cart]);

    // Temporizador para limpiar errores
    useEffect(() => {
        if (facturarError.state) {
            const timerId = setTimeout(() => {
                setFacturarError({ state: false, error: '' });
            }, 3000);
            return () => clearTimeout(timerId);
        }
    }, [facturarError]);

    // -------------------------
    // Derivados
    // -------------------------
    const totalPagado = Object.values(paymentAmounts).reduce((suma, monto) => suma + monto, 0);

    // -------------------------
    // Métodos: Checkbox (selección de métodos)
    // -------------------------
    const handleCheckboxChange = (methodName) => {
        setCheckedState(prevState => {
            const isSwitchingOn = !prevState[methodName];
            const newState = { ...prevState, [methodName]: isSwitchingOn };

            if (isSwitchingOn) {
                setActivePaymentMethod(methodName);
            } else {
                handleAmountChange(methodName, 0);
                if (activePaymentMethod === methodName) {
                    setActivePaymentMethod(null);
                }
            }

            return newState;
        });
    };

    // -------------------------
    // Métodos: Monto de pago
    // -------------------------
    const handleAmountChange = (methodName, amount) => {
        setPaymentAmounts(prevAmounts => ({
            ...prevAmounts,
            [methodName]: parseFloat(amount) || 0
        }));
    };

    const handleAdd = (bill) => {
        if (!activePaymentMethod) return;
        if (bill === 0) {
            handleAmountChange(activePaymentMethod, 0);
        } else {
            const currentAmount = paymentAmounts[activePaymentMethod] || 0;
            handleAmountChange(activePaymentMethod, currentAmount + bill);
        }
    };

    // -------------------------
    // Métodos: Facturar
    // -------------------------
    const handleFacturar = (total) => {
        //total puede ser cart.total o splide 
        const selectedMethods = Object.keys(checkedState).filter(method => checkedState[method]);

        if (selectedMethods.length === 0) {
            setFacturarError({ state: true, error: "Por favor, seleccione un método de pago." });
            return false;
        }

        for (const method of selectedMethods) {
            if (!paymentAmounts[method] || paymentAmounts[method] <= 0) {
                setFacturarError({
                    state: true,
                    error: `El método '${method}' está seleccionado pero no tiene un monto.`
                });
                return false;
            }
        }

        if (totalPagado < total) {
            setFacturarError({ state: true, error: "El monto pagado es insuficiente." });
            return false;
        }

        const hasNonCashMethod = selectedMethods.some(method => method !== 'Efectivo');
        if (hasNonCashMethod && parseInt(total) !== totalPagado) {
            setFacturarError({
                state: true,
                error: "Si se usa Tarjeta/SINPE, el pago total debe ser exacto."
            });
            return false;
        }
        return true 
    };

    // -------------------------
    // Retorno
    // -------------------------
    if (!cart) return null;

    return {
        paymentMethods,
        paymentAmounts,
        facturarError,
        checkedState,
        isSplitViewOpen,
        setSplitViewOpen,
        money,
        handleCheckboxChange,
        handleAdd,
        handleFacturar,
        tipoDocumento,
        setTipoDocumento,
        handleAmountChange,
        setActivePaymentMethod,
        totalPagado
    };
}
