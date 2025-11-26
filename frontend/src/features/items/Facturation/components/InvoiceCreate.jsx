import PopUp from "../../../../components/PopUp";


export default function InvoiceCreate() {

    return (
        <PopUp isModalOpen={true} closeModal={()=>{}}>
            <div>
                <h2 className="text-xl font-bold mb-2">Confirmacion de pago</h2>
                <span className="text-lg font-sans mb-4 text-green-600">Dinero recibido: ₡700.00</span>
                <span className="text-lg font-sans mb-4 text-green-600">Su cambio es: ₡0.00</span>
                <button>Cancelar</button>
                <button>Aceptar</button>
            </div>
        </PopUp>
    );
}