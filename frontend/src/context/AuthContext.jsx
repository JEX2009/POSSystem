import React, { createContext, useState, useContext } from 'react';
// CAMBIO: Corregí la ruta de importación para que coincida con tu estructura de carpetas
import apiClient from "./../api/Autentification.api";
import { useNavigate } from 'react-router-dom'; // Necesitarás esto para redirigir

// 1. La "frecuencia" se define fuera
const AuthContext = createContext(null);

// 2. La "torre de transmisión"
export const AuthProvider = ({ children }) => {
    const navigate = useNavigate(); // Hook para poder redirigir

    // CAMBIO: Renombré 'authToken' a 'token' por simplicidad y consistencia.
    // CAMBIO: Añadí el estado para guardar los datos del usuario.
    const [token, setToken] = useState(localStorage.getItem('authToken') || null);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('authUser')) || null);

    const login = async (credentials) => {
        try {
            const response = await apiClient.post('/auth/login/', credentials);
            
            // Obtenemos tanto el token como el objeto 'usuario' de la respuesta
            const { token, usuario } = response.data;

            // Guardamos ambos en localStorage
            localStorage.setItem('authToken', token);
            localStorage.setItem('authUser', JSON.stringify(usuario));

            // Actualizamos ambos estados
            setToken(token);
            setUser(usuario);

            // Redirigimos al usuario al dashboard
            navigate('/dashboard');

        } catch (error) {
            console.error("Login failed:", error);
            throw error; // Lanzamos el error para que LoginPage lo pueda atrapar
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        setToken(null);
        setUser(null);
        navigate('/login'); // Llevamos al usuario al login al cerrar sesión
    };

    // CAMBIO: El objeto 'value' ahora usa las variables de estado correctas ('token' y 'user')
    const value = {
        token,
        user,
        login,
        logout,
        isAuthenticated: !!token
    };

    return (
        // CAMBIO: Se corrigió value={{value}} a value={value}
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// 3. El "walkie-talkie" para que otros componentes escuchen
export const useAuth = () => {
    return useContext(AuthContext);
};