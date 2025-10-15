import { featchSalons } from "../../services/api/apiSalon";
import SalonList from './components/SalonList';
import useFetch from '../../hooks/useFeatch';
import useTableActions from "./hooks/useTableActions";
import useModal from "../../hooks/useModal";
import PopUp from "../../components/PopUp"
import { useState } from "react";
import SalonsForm from "./components/SalonsForm"

export default function TablesPage() {
    const { data: salons, isLoading, error, refetch } = useFetch(featchSalons, "los salones");
    const { openBillingModal, saveOrder } = useTableActions(refetch);
    const { isModalOpen, closeModal, openModal } = useModal();
    const [type, setType] = useState(null);

    const handleClick = (selection) => {
        setType(selection);
        openModal();
    }


    return (
        <div className="">
            <div className="grid grid-cols-3">
                <div className="col-start-1 ">
                    <button
                        className="border p-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white cursor-pointer"
                        onClick={() => handleClick("mesa")}
                    >
                        Agregar nueva mesa
                    </button>
                </div>
                <div className="col-start-3 flex justify-end ">
                    <button
                        className="border p-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white cursor-pointer"
                        onClick={() => handleClick("salon")}
                    >
                        Agregar nuevo salon
                    </button>
                </div>
            </div>
            <div className='text-center'>
                <SalonList
                    salones={salons}
                    saveOrder={saveOrder}
                    onTableSelect={openBillingModal}
                    isLoading={isLoading}
                    error={error}
                />

            </div>

            {isModalOpen && (
                <PopUp closeModal={closeModal} isModalOpen={isModalOpen}>
                    <SalonsForm
                        type={type}
                        salons = {salons}
                        refetch={refetch}
                        closeModal={closeModal}
                    />
                </PopUp>)
            }
        </div>
    )
}
