import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to='/' className="flex-shrink-0">
            <img className="h-12 w-auto" src='/logo.svg' alt='Zaksoft Learn Logo' />
          </Link>
          <nav className="hidden md:flex items-center space-x-8 text-lg">
            <Link to='/formations' className="text-slate-700 hover:text-violet-600 transition-colors">Formations</Link>
            {user ? (
              <>
                <Link to='/dashboard' className="text-slate-700 hover:text-violet-600 transition-colors">Tableau de bord</Link>
                {user.isAdmin && (
                  <Link to='/admin' className="text-slate-700 hover:text-violet-600 transition-colors">Admin</Link>
                )}
                <button onClick={logout} className="text-slate-700 hover:text-violet-600 transition-colors">Déconnexion</button>
              </>
            ) : (
              <>
                <Link to='/login' className="text-slate-700 hover:text-violet-600 transition-colors">Connexion</Link>
                <Link to='/register' className="bg-violet-600 text-white font-bold py-2 px-6 rounded-full hover:bg-violet-700 transition-colors shadow-md">Inscription</Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
