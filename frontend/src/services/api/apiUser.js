import {apiClient} from "./../apiClient"
import axios from 'axios';


export const fetchLogin = async (username, password) => {
    try {
        const response = await axios.post('http://localhost:8000/api/token/', {
            username,
            password,
        });

        //Al ser exitoso el login se guardan los tokens en el localStorage
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);

        // Configuramos el token de acceso en los headers por defecto para futuras peticiones
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;

        return response.data;
    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        throw error; // Lanzamos el error para que el componente lo maneje
    }
};
