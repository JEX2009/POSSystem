import { useForm } from 'react-hook-form';
import { capitalizeFirstLetter } from "../../../helpers/capitalize";
import { creatSalon, creatTable } from "../../../services/api/apiSalon";
import useCreate from '../../../hooks/useCreate';
import { useEffect } from 'react';

export default function Create(props) {
    const { type, salons, refetch, closeModal } = props;
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const { handleCreate, isLoading: isCreating, error: createError, succes } = useCreate(type === "mesa" ? creatTable : creatSalon, refetch);

    useEffect(() => {
        if (succes) {
            // 1. Limpia el formulario (opcional, pero buena práctica)
            reset();

            // 2. Cierra el modal (la parte que faltaba)
            if (closeModal) {
                closeModal();
            }
        }
    }, [succes, closeModal, reset]);


    return (
        <>
            <form onSubmit={handleSubmit(formData => handleCreate(formData))}>
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
                                    valueAsNumber: true // Asegura que el valor se envíe como número
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
        </>
    )
}