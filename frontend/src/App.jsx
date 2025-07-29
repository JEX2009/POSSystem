import { Routes, Route, Link, Navigate } from 'react-router-dom'; // CAMBIO: Se importa Navigate
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';


function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      <nav>
        {/* Este enlace a "/" ahora redirigirá automáticamente */}
        <Link to="/">Inicio</Link> | 
        {isAuthenticated ? (
          <Link to="/dashboard"> Dashboard</Link>
        ) : (
          <Link to="/login"> Iniciar Sesión</Link>
        )}
      </nav>
      <hr />

      <Routes>
        {/* CAMBIO: La ruta raíz ahora redirige */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          } 
        />
        
        <Route path="/login" element={<LoginPage />} />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
