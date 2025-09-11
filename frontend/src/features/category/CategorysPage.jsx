import { useForm } from 'react-hook-form';
import { createCategory ,featchCategory} from '../../services/api/apiCategory';
import { useState } from 'react';
import CategoryList from './components/CategoryList';

export default function CategorysPage() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [apiError, setApiError] = useState(null)
    const [apiSucces, setApiSucces] = useState(null)
    const [categorys, setCategorys] = useState([]);
    const [error, setError] = useState(null);

    const handleCreate = async (data) => {
        setApiError(null);

        setApiSucces(null);
        try {
            const response = await createCategory({ "name": data.name });
            if (response.status === 400) {
                setApiError("Ya existe una categoria con ese nombre");
            }
            getCategorys();
            setApiSucces("Categoria creada con exito");
            reset({ name: '' });
        } catch (error) {
            console.log(error)
            setApiError(error);
        }
    }

    const getCategorys = async () => {
        try {
            const request = await featchCategory()
            setCategorys(request)
        } catch (error) {
            setError('No se pudieron cargar las categorias.');
            console.log(error)
        }
    };

    return (
        <div className="">
            <form onSubmit={handleSubmit(handleCreate)}>
                <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
                    <label htmlFor="name" className="block text-gray-700 mb-2">Categoria</label>
                    <input
                        type="text"
                        id='name'
                        placeholder='Nombre de categoria'
                        {...register("name", { required: "El nombre de clase es obligatorio" })}
                        className={`w-full px-3 py-2 border rounded-lg ${errors.name ? 'border-red-500' : ''}`}
                    />
                    <button type="submit" className="w-full bg-green-500 text-white py-2 mt-3 rounded-lg hover:bg-green-600 hover:cursor-pointer">
                        Crear
                    </button>
                </div>
            </form>
            {apiError && <p className="text-red-500 mt-4 text-center">{apiError}</p>}
            {apiSucces && <p className="text-green-500 mt-4 text-center">{apiSucces}</p>}
            <div className='text-center'>
                <CategoryList
                    getCategorys={getCategorys}
                    categorys = {categorys}
                    error= {error}
                />
            </div>
        </div>

    )
}
