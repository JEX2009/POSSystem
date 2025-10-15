import { createCategory, featchCategory } from '../../services/api/apiCategory';
import { useForm } from 'react-hook-form';
import CategoryList from './components/CategoryList';
import CreateCategory from './components/CreateCategory';
import useFetch from '../../hooks/useFeatch';
import useCreate from '../../hooks/useCreate';

export default function CategorysPage() {
    const { data: categorys, isLoading, error, refetch } = useFetch(featchCategory, "las categorias");
    const { handleCreate, isLoading: isCreating, error: createError, succes } = useCreate(createCategory, refetch);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();


    const onSubmit = (formData) => {
        handleCreate(formData);
        reset();
    };

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
        </div>

    )
}
