import axios from 'axios';

export const apiClient = axios.create({
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



//Con los datos que se envian en el formulario de login se hace la peticion a la API

