
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AdminDashboardPage = () => {
  const { user } = useAuth();

  return (
    <div>
      <Header />
      <main>
        <h2>Tableau de Bord Administrateur</h2>
        <p>Bienvenue, {user?.email} !</p>
        
        <nav>
          <ul>
            <li>
              <Link to="/admin/formations">Gérer les Formations</Link>
            </li>
            <li>
              <Link to="/admin/feedbacks">Consulter les Avis</Link>
            </li>
            {/* Ajoutez ici d'autres liens d'administration au besoin */}
          </ul>
        </nav>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboardPage;
