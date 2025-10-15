import React, { useState } from 'react';

export default function DocumentType(props) {
    const {tipoDocumento,setTipoDocumento} = props;
    return (
        <>
            <h3 className="font-semibold mb-2 text-white">Tipo de documento</h3>
            <select
                value={tipoDocumento}
                onChange={(e) => setTipoDocumento(e.target.value)}
                className="w-full bg-gray-800 text-white rounded p-2 mb-2"
            >
                <option value="TiqueteElectronico">Tiquete Electronico</option>
                <option value="FacturaElectronica">Factura Electronica</option>
            </select>
            {tipoDocumento === "FacturaElectronica" && (
                <input type="text" placeholder="Buscar Cliente por Cédula" className="w-full bg-gray-800 text-white rounded p-2" />
            )}
        </>
    )
}