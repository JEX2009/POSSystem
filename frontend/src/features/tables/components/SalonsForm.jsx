import { useForm } from 'react-hook-form';
import { capitalizeFirstLetter } from "../../../helpers/capitalize";
import { creatSalon, creatTable } from "../../../services/api/apiSalon";
import useCreate from '../../../hooks/useCreate';
import { useEffect } from 'react';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { useState } from "react";
import PopUp from "../../../components/PopUp"


export default function Create(props) {
    const { type, salons, refetch, closeModal } = props;
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const { handleCreate, isLoading: isCreating, error: createError, succes } = useCreate(type === "mesa" ? creatTable : creatSalon, refetch);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [formData, setFormData] = useState();

    useEffect(() => {
        if (succes) {
            reset();
            if (closeModal) {
                closeModal();
            }
        }
    }, [succes, closeModal, reset]);

    const onSubmit = (data) => {
        setFormData(data);
        setIsConfirmOpen(true);
    }

    const saveData = () => {
        handleCreate(formData);
        reset();
        setIsConfirmOpen(false);
    };

    const errorData = () => {
        setFormData();
        reset();
        setIsConfirmOpen(false);
        closeModal();
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
                    <label htmlFor="name" className="block text-gray-700 mb-2">{capitalizeFirstLetter(type)}</label>
                    <input
                        type="text"
                        id='name'
                        placeholder={`Nombre de ${type === "mesa" ? 'la mesa' : 'el salon'}`}
                        {...register("name", { required: "El nombre de clase es obligatorio" })}
                        className={`w-full px-3 py-2 border rounded-lg ${errors.name ? 'border-red-500' : ''}`}
                    />
                    {type === "mesa" && (
                        <>
                            <label htmlFor="salon_id" className="block text-gray-700 mb-2">Salon</label>
                            <select
                                id="salon_id"
                                {...register("salon_id", {
                                    required: "El salom es obligatorio",
                                    valueAsNumber: true 
                                })}
                                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.category_id ? 'border-red-500' : 'border-gray-300'}`}
                            >
                                <option value="">-- Seleccione un salon --</option>
                                {salons.map(salon => (
                                    <option key={salon.id} value={salon.id}>
                                        {salon.name}
                                    </option>
                                ))}
                            </select>
                        </>
                    )}
                    <button type="submit" className="w-full bg-green-500 text-white py-2 mt-3 rounded-lg hover:bg-green-600 hover:cursor-pointer" disabled={isCreating}
                    >
                        {isCreating ? 'Creando...' : 'Crear'}
                    </button>
                </div>
            </form>
            {createError && <p className="text-red-500 mt-4 text-center">{createError.response.data.name}</p>}
            {succes && <p className="text-green-500 mt-4 text-center">{succes}</p>}
            <PopUp closeModal={() => setIsConfirmOpen(false)} isModalOpen={isConfirmOpen}>
                <ConfirmDialog
                    message={`¿Estás seguro de que deseas agregar est@ ${type}?`}
                    yesOption={saveData}
                    noOption={errorData}
                />
            </PopUp>
        </>
    )
}