import PopUp from "../../../components/PopUp";
import useFacturation from './hook/useFacturation';
import DocumentType from "./components/DocumentType";
import PaymentMethods from "./components/PaymentMethods";
import CalculationsPanel from "./components/CalculationsPanel";
import SplitBill from "./components/SplitBill";
import useSplitBill from "./hook/useSplitBill";
import useInvoice from "./hook/useInvoice";
import ConfirmDialog from '../../../components/ConfirmDialog';
import {useState } from "react";


const FacturacionModal = ({ isModalOpen, closeModal, cart, onSuccess, closeOrderForBilling }) => {
    const { paymentMethods, paymentAmounts, facturarError, checkedState, isSplitViewOpen, setSplitViewOpen, money, handleCheckboxChange, handleAdd, handleFacturar, tipoDocumento, setTipoDocumento, handleAmountChange, setActivePaymentMethod, totalPagado } = useFacturation(isModalOpen, cart, onSuccess, closeOrderForBilling);
    const items = cart.items ? cart.items : cart.items_read;
    const { invoiceModalOpen, closeInvoiceModal } = useInvoice(onSuccess);
    const { productosRestantes, productosDivididos, dividirProducto, devolverProducto, setProductosDivididos } = useSplitBill(items);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [formData, setFormData] = useState();

    const totalAPagar = !isSplitViewOpen ? cart.total : productosDivididos.reduce((suma, object) => suma + object.product.price * object.quantity, 0);
    const onProcessPayment = () => {
        

        if (isSplitViewOpen) {
            if (productosRestantes.length < 1) {
                onSuccess();
            } else {
                setProductosDivididos([]);
            }
        } else {
            onSuccess();
        }

    };

    const onSubmit = (data) => {
        const esPagoValido = handleFacturar(totalAPagar);

        if (!esPagoValido) {
            return;
        }
        setFormData(data);
        setIsConfirmOpen(true);
    }

    const errorData = () => {
        setFormData();
        reset();
        setIsConfirmOpen(false);
        closeModal();
    }


    return (
        <PopUp isModalOpen={isModalOpen} closeModal={closeModal}>
            <div className={`transition-all duration-500 ease-in-out ${isSplitViewOpen ? 'w-[1220px]' : 'w-[700px]'}`}>
                <h2 className="text-xl font-bold mb-2">Facturar Orden #{cart.id}</h2>
                {facturarError.state && (<span className='text-lg font-sans mb-4 text-red-600'>{facturarError.error}</span>)}
                <div className="flex overflow-hidden">
                    <div className="w-[700px] flex-shrink-0">
                        <div className="grid grid-cols-[30px_1fr_1fr_1fr] gap-2">
                            {/* Columna 1: DIVIDIR CUENTA */}
                            <div>
                                <button className="w-full h-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center rounded-lg shadow-lg font-bold tracking-widest cursor-pointer " onClick={() => setSplitViewOpen(!isSplitViewOpen)}>
                                    <span className="transform rotate-180" style={{ writingMode: 'vertical-lr' }}>
                                        DIVIDIR
                                    </span>
                                </button>
                            </div>
                            {/* Columna 2: Tipo de Documento */}
                            <div className="col-span-1 bg-gray-700 p-4 rounded-lg">
                                <DocumentType
                                    tipoDocumento={tipoDocumento}
                                    setTipoDocumento={setTipoDocumento}
                                />
                            </div>

                            {/* Columna 3: Métodos de Pago */}
                            <div className="col-span-1 bg-gray-700 p-4 rounded-lg text-white">
                                <PaymentMethods
                                    paymentMethods={paymentMethods}
                                    checkedState={checkedState}
                                    paymentAmounts={paymentAmounts}
                                    handleAmountChange={handleAmountChange}
                                    setActivePaymentMethod={setActivePaymentMethod}
                                    handleCheckboxChange={handleCheckboxChange}
                                />
                            </div>

                            {/* Columna 4: Total y Facturación */}
                            <div className="col-span-1 bg-gray-700 p-4 rounded-lg h-130 flex flex-col text-white">
                                <CalculationsPanel
                                    total={totalAPagar}
                                    money={money}
                                    handleAdd={handleAdd}
                                    totalPagado={totalPagado}
                                    onProcessPayment={onSubmit}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isSplitViewOpen ? 'w-[900px] p-4' : 'w-0'} grid grid-cols-2`}>
                        <SplitBill
                            productosRestantes={productosRestantes}
                            productosDivididos={productosDivididos}
                            dividirProducto={dividirProducto}
                            devolverProducto={devolverProducto}
                        />
                    </div>
                </div>
            </div>
            <PopUp closeModal={() => setIsConfirmOpen(false)} isModalOpen={isConfirmOpen}>
                <ConfirmDialog
                    message="¿Estás seguro que deseas facturar?"
                    yesOption={onProcessPayment}
                    noOption={errorData}
                />
                {/* {hasError && (<ErrorMessage message=" Se ha encontrado un error creando el producto." />)} */}
            </PopUp>
        </PopUp>


    );
};

export default FacturacionModal;
