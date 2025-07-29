import { useAuth } from './../context/AuthContext';


function DashboardPage() {
    const { user, logout } = useAuth();
    return (
        <div>
            <h1>Dashboard (Ruta Protegida)</h1>
            {user && <h2>¡Bienvenido, {user.nombre_completo}!</h2>}
            <button onClick={logout}>Cerrar Sesión</button>
        </div>
    );
}

export default DashboardPage;