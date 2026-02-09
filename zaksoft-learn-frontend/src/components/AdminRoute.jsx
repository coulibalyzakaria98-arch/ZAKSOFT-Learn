
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
  const { userData } = useAuth();

  // Si les données sont en cours de chargement, n'affichez rien ou un loader
  if (!userData) {
    return <div>Chargement...</div>; // Ou une redirection vers une page de connexion
  }

  // Si l'utilisateur a le rôle 'admin', affichez le contenu de la route.
  // Sinon, redirigez-le vers la page d'accueil.
  return userData.role === 'admin' ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute;
