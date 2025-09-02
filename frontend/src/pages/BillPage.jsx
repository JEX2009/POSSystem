import Cart from '/src/components/Cart';
import ProductList from '/src/components/ProductList';
import { createOrder, addItemToOrder, updateItemQuantity } from '../services/api'
import '/src/static/Tailwind.css'
import { useState } from 'react';

export default function BillPage() {
    const [cart, setCart] = useState([]);
    const [activeOrder, updateActiveOrder] = useState(null)


    // const addToCart = async (product) => {
    //     let newCart;
    //     const existingProduct = cart.find(item => item.id === product.id);

    //     if (existingProduct) {
    //         newCart = cart.map(item =>
    //             item.id === product.id
    //                 ? { ...item, quantity: item.quantity + 1 }
    //                 : item
    //         );
    //     } else {
    //         newCart = [...cart, { ...product, quantity: 1 }];
    //     }

    //     setCart(newCart);

    //     try {
    //         if (activeOrder === null) {
    //             const formattedItems = newCart.map(item => ({
    //                 product_id: item.id,
    //                 quantity: item.quantity
    //             }));
    //             const orderPayload = { items: formattedItems };
    //             const newOrderFromApi = await createOrder(orderPayload);

    //             console.log("Crea orden")
    //             updateActiveOrder(newOrderFromApi);
    //             console.log(newOrderFromApi)

    //         } else {
    //             if (!existingProduct) {
    //                 const addProduct = await addItemToOrder({
    //                     order_id: activeOrder.id,
    //                     product_id: product.id,
    //                     quantity: 1
    //                 });
    //                 console.log("Añadir producto")
    //                 console.log(addProduct)
    //             } else { 
    //                 console.log("Aumentar producto")
    //                 console.log(activeOrder)
    //                 const order_id = activeOrder.items.map( id => console.log(id.id))
    //                 // const orderUpdate = updateItemQuantity(

    //                 //     {
    //                 //         order_id: activeOrder.id,
    //                 //         product_id: product.id,
    //                 //         quantity: 1
    //                 //     }
    //                 // )

    //                 // updateActiveOrder(orderUpdate);

    //             }
    //         }
    //     } catch (error) {
    //         console.error("Error al sincronizar el carrito con el backend:", error);
    //         // Aquí podrías añadir lógica para revertir el cambio en el carrito si falla la API
    //     }
    // };

    
    const handleDelete = (id) => {
        const newCart = cart.filter(product => product.id !== id);
        setCart(newCart);
    }

    const handleCheckout = async () => {
        setCart([])
        alert("Venta")
    }

    return (
        <div className="flex flex-col md:flex-row gap-4">
            <div className="md:w-2/3">
                <ProductList addToCar={addToCart} handleCheckout={handleCheckout} />
            </div>
            <div className="md:w-1/3">
                <Cart cart={cart} handleDelete={handleDelete} />
            </div>
        </div>
    )
}