import React, { useState } from 'react'; // Importamos useState para el error de la API
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    // 1. Los hooks se llaman en el nivel superior del componente
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login } = useAuth();
    
    // Estado para manejar los errores que vienen del backend (ej: "credenciales inválidas")
    const [apiError, setApiError] = useState('');

    // 2. 'data' contendrá los valores del formulario validados
    const onSubmit = async (data) => {
        setApiError(''); // Limpiamos errores previos
        try {
            // 3. La función 'login' del contexto espera un solo objeto
            await login(data);
        } catch (error) {
            console.error("Login failed:", error);
            // Mostramos el error que viene del backend
            setApiError("Credenciales inválidas. Inténtalo de nuevo.");
        }
    };

    return (
        <div className='Forms'>
            {/* 4. El manejador de envío va en la etiqueta <form> */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <h2>Iniciar Sesión</h2>
                <input 
                    type="text" // 'username' no es un tipo válido, se usa 'text'
                    // 5. Los campos se "registran" con el spread operator
                    // 6. El nombre del campo coincide con la API: 'nombre_usuario'
                    {...register("nombre_usuario", { required: "El nombre de usuario es requerido" })}
                    placeholder="Nombre de Usuario"
                    className="inputUsername"
                />
                {/* Mostramos el error de validación si existe */}
                {errors.nombre_usuario && <span className="error">{errors.nombre_usuario.message}</span>}
                
                <input 
                    type="password"
                    {...register("password", { required: "La contraseña es requerida" })}
                    placeholder="Contraseña"
                    className="inputPassword" 
                />
                {errors.password && <span className="error">{errors.password.message}</span>}

                {/* Mostramos el error de la API si existe */}
                {apiError && <span className="error">{apiError}</span>}
                
                <button type="submit" className="btnLogin">
                    Ingresar
                </button>
            </form>
        </div>
    );
}
