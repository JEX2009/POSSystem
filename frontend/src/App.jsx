import '/src/static/Tailwind.css'
import Login from './components/Login';
import { useState } from 'react';
import { Route, Routes, Navigate, Link } from 'react-router-dom';
import AppLayout  from './layout/AppLayout';
import BillPage  from './pages/BillPage';
import TablesAssign  from './pages/TablesAssign';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  }

  const handleLogOut = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  return (
    <Routes>
      <Route element={<AppLayout handleLogOut={handleLogOut} isAuthenticated={isAuthenticated} />}>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path='/' element={isAuthenticated ? <BillPage /> : <Navigate to="/login" />} />
        <Route path='/table-assign' element={isAuthenticated ? <TablesAssign /> : <Navigate to="/login" />} />
      </Route>
    </Routes >
  );
}