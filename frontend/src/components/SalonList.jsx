


const SalonList = (props) => {
    const { salones, saveOrder} = props


    return (
        <div >
            {salones.map(salon => (
                <div key={salon.id} className="bg-sky-10 p-4 rounded-lg shadow">
                    <h2 className="text-lg font-bold">{salon.name}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5">
                        {salon.tables.map(mesa => (
                            <button key={mesa.id} className="bg-sky-10 p-4 rounded-lg shadow hover:cursor-pointer" onClick={saveOrder   }>
                                <h2 className="text-lg font-bold">{mesa.name}</h2>
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default SalonList