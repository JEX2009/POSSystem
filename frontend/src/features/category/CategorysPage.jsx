import { createCategory, featchCategory } from '../../services/api/apiCategory';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import CategoryList from './components/CategoryList';
import CreateCategory from './components/CreateCategory';
import useFetch from '../../hooks/useFeatch';
import useCreate from '../../hooks/useCreate';
import ConfirmDialog from '../../components/ConfirmDialog';
import PopUp from '../../components/PopUp';

export default function CategorysPage() {
    const { data: categorys, isLoading, error, refetch } = useFetch(featchCategory, "las categorias");
    const { handleCreate, isLoading: isCreating, error: createError, succes } = useCreate(createCategory, refetch);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [Creating, setCreating] = useState(false);
    const [formData, setFormData] = useState();

    const onSubmit = (data) => {
        setFormData(data);
        setCreating(true);
    }

    const saveCategory = () => {
        handleCreate(formData);
        reset();
        setCreating(false);
    };

    const errorCategory = () => {
        setFormData();
        reset();
        setCreating(false);
    }
    return (
        <div className="">
            <CreateCategory
                register={register}
                errors={errors}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                isCreating={isCreating}
                createError={createError}
                succes={succes}
            />
            <div className='text-center'>
                <CategoryList
                    getCategorys={refetch}
                    categorys={categorys}
                    error={error}
                    isLoading={isLoading}
                />
            </div>
            <PopUp closeModal={() => setCreating(false)} isModalOpen={Creating}>
                <ConfirmDialog
                    message="¿Estás seguro de que deseas agregar esta categoría?"
                    yesOption={saveCategory}
                    noOption={errorCategory}
                />
            </PopUp>
        </div>


    )
}
