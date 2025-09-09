import Cart from '/src/components/Cart';
import ProductList from '/src/components/ProductList';
// import { createOrder, addItemToOrder, updateItemQuantity } from '../services/api'
import '/src/static/Tailwind.css'
import { useState } from 'react';

export default function ItemsPage() {
    const [sendingCart, setSendingCart] = useState([]);
    // const [activeOrder, updateActiveOrder] = useState(null)


    const addToCart = async (product) => {
        let newCart;
        const existingProduct = sendingCart.find(item => item.id === product.id);

        if (existingProduct) {
            newCart = sendingCart.map(item =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
        } else {
            newCart = [...sendingCart, { ...product, quantity: 1 }];
        }

        setSendingCart(newCart);
    };

    
    const handleDelete = (id) => {
        const newCart = sendingCart.filter(product => product.id !== id);
        setSendingCart(newCart);
    }

    return (
        <div className="flex flex-col md:flex-row gap-4">
            <div className="md:w-2/3">
                <ProductList addToCar={addToCart} />
            </div>
            <div className="md:w-1/3">
                <Cart sendingCart={sendingCart} handleDelete={handleDelete} />
            </div>
        </div>
    )
}