import Cart from '/src/components/Cart';
import ProductList from '/src/components/ProductList';
import '/src/static/Tailwind.css'
import { useState } from 'react';

export default function BillPage() {
    const [cart, setCart] = useState([]);
    const addToCart = (product) => {
        const existingProduct = cart.find(item => item.id === product.id);

        if (existingProduct === undefined) {
            setCart([...cart, { ...product, quantity: 1 }]);
        } else {
            setCart(
                cart.map(
                    item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item

                ));
        }
    }


    return (
        <div className="flex flex-col md:flex-row gap-4">
            <div className="md:w-2/3">
                <ProductList addToCar={addToCart} />
            </div>
            <div className="md:w-1/3">
                <Cart cart={cart} setCartItems={setCart} />
            </div>
        </div>
    )
}