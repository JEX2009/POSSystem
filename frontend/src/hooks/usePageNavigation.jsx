import { useNavigate } from 'react-router-dom';

export default function usePageNavigation() {
    // ---------------------------------------------
    // Hook personalizado para navegación en React Router
    // ---------------------------------------------

    // Obtiene la función 'navigate' para redirigir entre rutas
    const navigate = useNavigate();

    /**
     * Navega a una ruta específica y opcionalmente envía estado
     * @param {string} path - Ruta de destino (por ejemplo: '/salones/nuevo')
     * @param {object} state - Objeto opcional con datos a enviar a la nueva ruta
     */
    const goToPage = (path, state = {}) => {
        navigate(path, { state });
    };

    /**
     * Regresa a la página anterior en el historial de navegación
     */
    const goBack = () => navigate(-1);

    // Retorna las funciones disponibles para navegar
    return { goToPage, goBack };
}
