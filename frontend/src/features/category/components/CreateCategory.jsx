
const CreateCategory = (props) => {
    const { onSubmit, isCreating, createError, succes, register, errors, handleSubmit } = props;


    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
                    <label htmlFor="name" className="block text-gray-700 mb-2">Categoria</label>
                    <input
                        type="text"
                        id='name'
                        placeholder='Nombre de categoria'
                        {...register("name", { required: "El nombre de clase es obligatorio" })}
                        className={`w-full px-3 py-2 border rounded-lg ${errors.name ? 'border-red-500' : ''}`}
                    />
                    <button type="submit" className="w-full bg-green-500 text-white py-2 mt-3 rounded-lg hover:bg-green-600 hover:cursor-pointer" disabled={isCreating}>
                        Crear
                    </button>
                </div>
            </form>
            {createError && <p className="text-red-500 mt-4 text-center">{createError}</p>}
            {succes && <p className="text-green-500 mt-4 text-center">{succes}</p>}
        </>
    )
}

export default CreateCategory;