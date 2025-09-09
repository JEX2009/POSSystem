import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8000/api/v1/',
});

// Interceptor para agregar el token de acceso a cada solicitud
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});


apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response.status === 401 && error.response.data.code === "token_not_valid") {
            try {
                const response = await axios.post('http://localhost:8000/api/token/refresh/', {
                    refresh: localStorage.getItem('refresh_token')
                });

                localStorage.setItem('access_token', response.data.access);
                apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
                return apiClient(error.config); // Reintenta la solicitud original
            } catch {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    });

export const featchProducts = async () => {
    try {
        const response = await apiClient.get('/product/');
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

//Con los datos que se envian en el formulario de login se hace la peticion a la API
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


export const createOrder = async (data) => {
    try {
        const response = await apiClient.post('/order/', data);
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const updateOrder = async (order_id , data) => {
    try {
        const response = await apiClient.patch('/order/' + order_id + "/", data);
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const addItemToOrder = async (data) => {
    try {
        const response = await apiClient.post('/order-items/', data);
        return response.data;
    } catch (error) {
        console.error('Error adding item:', error);
        throw error;
    }
}

export const updateItemQuantity = async (product) => {
    try {
        const response = await apiClient.patch('/order-items/' + product['order_id'] + '/', product)
        return response.statusText
    } catch (error) {
        console.error('Error modifiying order:', error);
        throw error;
    }
}

export const createCategory = async (category) => {
    try {
        const response = await apiClient.post('/category/', category)
        return response.data;
    } catch (error) {
        return error
    }
}

export const featchCategory = async () => {
    try {
        const response = await apiClient.get('/category/')
        return response.data;
    } catch (error) {
        console.error('Error featching categorys:', error);
        throw error;
    }
}

export const featchSalons= async () => {
    try {
        const response = await apiClient.get('/salons/');
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}