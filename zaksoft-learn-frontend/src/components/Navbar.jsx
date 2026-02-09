import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Style pour les liens actifs, plus visible
  const activeLinkStyle = "text-violet-600 font-bold border-b-2 border-violet-600 pb-1";
  // Style par défaut, subtil mais clair
  const defaultLinkStyle = "text-slate-800 hover:text-violet-600 transition-colors duration-300 pb-1 border-b-2 border-transparent";

  const getLinkClass = ({ isActive }) => (isActive ? activeLinkStyle : defaultLinkStyle);

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img className="h-12 w-auto" src="/logo.png" alt="ZAKSOFT Learn Logo" />
          </Link>

          {/* Navigation principale pour Desktop */}
          <nav className="hidden md:flex items-center space-x-10 text-base font-medium">
            <NavLink to="/" className={getLinkClass} end>Accueil</NavLink>
            <NavLink to="/formations" className={getLinkClass}>Formations</NavLink>
            <NavLink to="/dashboard" className={getLinkClass}>Dashboard</NavLink>
          </nav>

          {/* Boutons d'action pour Desktop */}
          <div className="hidden md:flex items-center space-x-4">
              <Link to="/login" className="text-slate-700 hover:text-violet-700 font-semibold py-2 px-4 transition-colors duration-300">Se connecter</Link>
              <Link to="/register">
                <button className="bg-violet-600 text-white font-bold py-2 px-6 rounded-full hover:bg-violet-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                  Commencer
                </button>
              </Link>
          </div>

          {/* Bouton pour menu mobile */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-800 focus:outline-none">
              {isOpen ? <X size={30} /> : <Menu size={30} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile déroulant */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg pb-6 pt-2">
          <nav className="flex flex-col items-center space-y-6 text-xl">
            <NavLink to="/" className={getLinkClass} onClick={() => setIsOpen(false)} end>Accueil</NavLink>
            <NavLink to="/formations" className={getLinkClass} onClick={() => setIsOpen(false)}>Formations</NavLink>
            <NavLink to="/dashboard" className={getLinkClass} onClick={() => setIsOpen(false)}>Dashboard</NavLink>
            <div className="border-t border-slate-200 w-3/4 pt-6 mt-4 flex flex-col items-center space-y-6">
              <Link to="/login" className="text-slate-700 hover:text-violet-700 font-semibold" onClick={() => setIsOpen(false)}>Se connecter</Link>
              <Link to="/register" onClick={() => setIsOpen(false)} className="w-full text-center px-8">
                <button className="bg-violet-600 text-white font-bold py-3 px-8 rounded-full hover:bg-violet-700 w-full shadow-lg">
                  Commencer
                </button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
