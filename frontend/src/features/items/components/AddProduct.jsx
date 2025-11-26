import PopUp from "../../../components/PopUp";
import { useForm } from 'react-hook-form';
import { createProducts } from "../../../services/api/apiProduct";
import { featchCategory } from "../../../services/api/apiCategory";
import { useEffect, useState } from "react";

const AddProduct = (props) => {
    const { isModalOpen, closeModal, onSuccess } = props;
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [categories, setCategories] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isModalOpen) {
            const getCategories = async () => {
                try {
                    const response = await featchCategory();
                    setCategories(response);
                } catch (error) {
                    console.log("Error al cargar categorías:", error);
                }
            };
            getCategories();
        }
    }, [isModalOpen]);

    const onSubmit = async (data) => {
        setIsSubmitting(true); // Bloqueamos el botón
        try {
            await createProducts(data);
            onSuccess(); // Llamamos a la función para refrescar la lista de productos
            closeModal(); // Cerramos el modal
        } catch (err) {
            console.error("Error al crear el producto:", err);
        } finally {
            setIsSubmitting(false); // Desbloqueamos el botón
        }
    }

    return (
        <PopUp isModalOpen={isModalOpen} closeModal={closeModal}>
            <div className="mb-4 bg-white p-4 rounded-lg shadow-md">


                <h2 className="text-2xl font-bold text-gray-800 mb-4">Añadir Nuevo Producto</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 ">Nombre del Producto</label>
                        <input
                            type="text"
                            id="name"
                            {...register("name", { required: "El nombre es obligatorio" })}
                            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                        <select
                            id="category_id"
                            {...register("category_id", {
                                required: "La categoría es obligatoria",
                                valueAsNumber: true 
                            })}
                            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.category_id ? 'border-red-500' : 'border-gray-300'}`}
                        >
                            <option value="">-- Seleccione una categoría --</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {errors.category_id && <p className="text-red-600 text-xs mt-1">{errors.category_id.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Precio (sin IVA)</label>
                        <input
                            type="number"
                            id="price"
                            {...register("price", {
                                required: "El precio es obligatorio",
                                valueAsNumber: true,
                                min: { value: 0, message: "El precio no puede ser negativo" }
                            })}
                            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.price && <p className="text-red-600 text-xs mt-1">{errors.price.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Guardando...' : 'Crear Producto'}
                    </button>
                </form>
            </div>
        </PopUp>
    );
}

export default AddProduct;
