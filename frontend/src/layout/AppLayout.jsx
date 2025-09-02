import '/src/static/Tailwind.css'
import { Link , Outlet } from 'react-router-dom';

export default function Navbar(props) {
    const { isAuthenticated, handleLogOut } = props;
    return (
        <>
            <header className="bg-white shadow p-4">
                <div className='container mx-auto flex justify-between items-center'>
                    <h1 className="text-2xl font-bold text-gray-800">Sistema POS</h1>
                    {isAuthenticated && (
                        <nav>
                            <ul className="flex space-x-4">
                                <li>
                                    <Link to="/category" className="text-gray-600 hover:text-gray-800">Categorias</Link>
                                </li>
                                <li>
                                    <Link to="/table-assign" className="text-gray-600 hover:text-gray-800">Mesas</Link>
                                </li>
                                <li>
                                    <Link to="/" className="text-gray-600 hover:text-gray-800">Productos</Link>
                                </li>
                                <li>
                                    <button onClick={handleLogOut} className="text-gray-600 hover:text-gray-800">Cerrar Sesión</button>
                                </li>
                            </ul>
                        </nav>
                    )}
                </div>
            </header>
            <main className="p-4">
                <Outlet />
            </main>
        </>
    )
}