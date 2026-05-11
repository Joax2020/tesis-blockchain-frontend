import React from 'react';
import { Navigate } from 'react-router-dom';
import { isTokenValid } from '../utils/authUtils'; // Función para validar el token    

const ProtectedRoute = ({ children }) => {
  // Verificamos si existe el token o el usuario en localStorage
  const hayUsuario = localStorage.getItem('usuario');
  const tokenValido = isTokenValid();

  if (!hayUsuario || !tokenValido) {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }
  // Si tiene la pulsera, lo dejamos pasar al componente hijo (Dashboard)
  return children;
};

export default ProtectedRoute;