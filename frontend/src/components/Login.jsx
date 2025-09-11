import React, { useState } from 'react';
import { useForm } from 'react-hook-form'; // 1. Importar useForm
import { fetchLogin } from '../services/api/apiUser';

const Login = (props) => {
    const { onLoginSuccess } = props;
    const { register, handleSubmit, formState: { errors } } = useForm();

    const [apiError, setApiError] = useState(null);

    // 3. La función de envío ahora recibe los datos del formulario
    const onSubmit = async (data) => {
        setApiError(null);

        try {
            await fetchLogin(data.username, data.password);
            onLoginSuccess();

        } catch (err) {
            setApiError('Usuario o contraseña incorrectos.');
            console.error(err);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
            {/* 4. Usar handleSubmit para envolver nuestro onSubmit */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="username">Usuario</label>
                    <input
                        type="text"
                        id="username"
                        // 5. Registrar el input en el formulario
                        {...register("username", { required: "El usuario es obligatorio" })}
                        className={`w-full px-3 py-2 border rounded-lg ${errors.username ? 'border-red-500' : ''}`}
                    />
                    {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 mb-2" htmlFor="password">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        {...register("password", { required: "La contraseña es obligatoria" })}
                        className={`w-full px-3 py-2 border rounded-lg ${errors.password ? 'border-red-500' : ''}`}
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 hover:cursor-pointer">
                    Entrar
                </button>
            </form>
            {apiError && <p className="text-red-500 mt-4 text-center">{apiError}</p>}
        </div>
    );
};

export default Login;