import React, { useEffect } from 'react';

const CategoryList= (props)=> {
    const {getCategorys, categorys, error} = props
    

    useEffect(() => {
        getCategorys();
    }, []);
    if (error) {
        return <div className="text-red-500">{error}</div>;
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