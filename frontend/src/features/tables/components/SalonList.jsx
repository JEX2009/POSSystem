import React from 'react';

// Se simplifican las props que recibe el componente
const SalonList = ({ salones, saveOrder, onTableSelect }) => {
    
    return (
        <div>
            {salones.map(salon => (
                <div key={salon.id} className="bg-white p-4 rounded-lg shadow m-4">
                    <h2 className="text-xl font-bold mb-4">{salon.name}</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 ">
                        {salon.tables.map(mesa => {
                            const isOccupied = mesa.active_order !== null;
                            const buttonColor = isOccupied 
                                ? 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer' 
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-800 cursor-pointer';

                            const handleTableClick = () => {
                                if (isOccupied) {
                                    // Si está ocupada, llamamos a la función del padre
                                    // y le pasamos TODOS los datos de la orden activa.
                                    onTableSelect(mesa.active_order);
                                } else {
                                    // Si está libre, creamos una nueva orden.
                                    saveOrder(mesa.id);
                                }
                            };

                            return (
                                <button
                                    key={mesa.id}
                                    className={`${buttonColor} p-4 rounded-lg shadow-md transition-transform transform hover:scale-105`}
                                    onClick={handleTableClick}
                                >
                                    
                                    <h2 className="text-lg font-bold">{mesa.name}</h2>
                                    {isOccupied && (
                                        <p className="text-sm font-semibold mt-1">
                                            Total: ₡{parseFloat(mesa.active_order.total).toLocaleString('es-CR')}
                                        </p>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default SalonList;
