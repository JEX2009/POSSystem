// frontend/src/components/ProductList.jsx

import React, { useState, useEffect } from 'react';
import { featchProducts } from '/src/services/api';

const ProductList = (props) => {
  const { addToCar } = props;
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await featchProducts();
        setProducts(data);
      } catch (err) {
        setError('No se pudieron cargar los productos.');
        console.error(err);
      }
    };

    getProducts();
  }, []);
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map(product => (
        <button key={product.id} className="bg-white p-4 rounded-lg shadow" onClick={() => addToCar(product)}>
          <h2 className="text-lg font-bold">{product.name}</h2>
          <p className="text-gray-600">₡{product.price}</p>
        </button>
      ))}
    </div>
  );
};

export default ProductList;