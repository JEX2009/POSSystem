import axios from 'axios';

// 1. Creamos la instancia de Axios como una constante.
const apiClient = axios.create({
    baseURL: "http://localhost:8000/api",
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. Añadimos el interceptor a NUESTRA instancia, no al axios global.
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            // 3. Usamos la palabra clave "Token" que Django espera.
            config.headers['Authorization'] = `Token ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 4. Exportamos la instancia para que otros archivos puedan usarla.
export default apiClient;