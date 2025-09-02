
import { featchSalons } from "../services/api"
import { useState, useEffect } from 'react'
import SalonList from '../components/SalonList';
import { useLocation } from 'react-router-dom';

export default function TablesPage() {
    const [salones, setSalon] = useState([])
    const location = useLocation();
    const [sendingCart, setSendingCart] = useState([])

    
    const fidingSalons = async () => {
        try {
            const response = await featchSalons();
            setSalon(response)
            console.log(location.state?.carrito);
            setSendingCart( location.state?.carrito);
            console.log(sendingCart);
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(
        () => {
            fidingSalons();
        }, []);

    return (
        <div className="">
            <div className='text-center'>
                <SalonList
                    salones={salones}
                />
            </div>
        </div>
    )
}