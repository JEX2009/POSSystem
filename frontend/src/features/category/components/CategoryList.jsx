import ErrorMessage from "../../../components/ErrorMessage";
import LoadingSpiner from "../../../components/LoadingSpinner";

const CategoryList = (props) => {
    const { categorys, error, isLoading } = props


    if (isLoading) {
        return <LoadingSpiner />;
    }

    if (error) {
        return <ErrorMessage
            message={error}
        />;
    }


    return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5">
            {categorys.map(categorys => (
                <div key={categorys.id} className="bg-sky-10 p-4 rounded-lg shadow">
                    <h2 className="text-lg font-bold">{categorys.name}</h2>
                </div>
            ))}
        </div>
    )
}

export default CategoryList;