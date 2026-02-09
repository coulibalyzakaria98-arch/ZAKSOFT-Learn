import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Clock, Star } from 'lucide-react';

// Badge de difficulté
const DifficultyBadge = ({ level }) => {
  const styles = {
    Facile: 'bg-green-100 text-green-800',
    Intermédiaire: 'bg-yellow-100 text-yellow-800',
    Difficile: 'bg-red-100 text-red-800',
  };
  return (
    <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${styles[level] || styles.Facile}`}>
      {level}
    </span>
  );
};

const CourseCard = ({ course }) => {
  const { _id, title, description, level, price, imageUrl, duration, chapters = [] } = course;

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageUrl || '/placeholder-course.jpg'} 
          alt={`Image de la formation ${title}`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-violet-600 text-white font-bold text-lg py-1 px-4 rounded-lg">
          {price} €
        </div>
      </div>

      {/* Contenu */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <DifficultyBadge level={level} />
          {/* Note (exemple statique) */}
          <div className="flex items-center text-yellow-500">
            <Star size={16} fill="currentColor" className="mr-1"/>
            <span className="font-bold text-slate-700">4.8</span>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-slate-800 mb-2 h-14">{title}</h3>
        <p className="text-slate-600 text-sm flex-grow mb-4 h-20">{description.substring(0, 100)}...</p>

        {/* Métadonnées */}
        <div className="flex justify-between text-sm text-slate-500 border-t pt-4 mb-4">
          <span className="flex items-center"><Clock size={14} className="mr-1.5"/> {duration}</span>
          <span className="flex items-center"><BarChart size={14} className="mr-1.5"/> {chapters.length} Chapitres</span>
        </div>

        {/* Bouton d'action */}
        <Link to={`/formations/${_id}`} className="mt-auto">
          <button className="w-full bg-violet-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-violet-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
            Voir la formation
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
