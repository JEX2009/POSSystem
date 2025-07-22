import "./css/Autenticacion.css"
import React, { useState } from 'react';

function Autenticacion() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = (event) => {
        event.preventDefault();
        
        try {
           
            fetch('http://localhost:8000/api/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "email": email,
                    "password": password
                }),
            })
            
        } catch (error) {
            console.error("Error en la autenticacion:", error)
        }


    };

    return (
        <div className="autentification">
            <form onSubmit={handleSubmit} method="post" className="forms">
                <h2>
                    Autenticación
                </h2>
                <label htmlFor="username">Añade el usuario</label>
                <input
                    type="email"
                    id="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label htmlFor="password">Añade la contraseña</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input type="submit" value="Log in" />
            </form>
        </div>
    )
}

export default Autenticacion