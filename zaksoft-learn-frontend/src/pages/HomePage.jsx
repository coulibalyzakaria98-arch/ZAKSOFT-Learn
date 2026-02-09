import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import CourseCard from '../components/CourseCard';

// Données factices pour les formations populaires
const popularCourses = [
  {
    id: 1,
    title: 'React de A à Z : La Formation Complète',
    description: 'Maîtrisez React et construisez des applications web modernes et performantes.',
    level: 'Débutant',
    price: 99.99,
    imageUrl: '/react-course.jpg',
  },
  {
    id: 2,
    title: 'Node.js : Le Guide Ultime pour le Backend',
    description: 'Apprenez à construire des API RESTful rapides et évolutives avec Node.js et Express.',
    level: 'Intermédiaire',
    price: 129.99,
    imageUrl: '/node-course.jpg',
  },
  {
    id: 3,
    title: 'Tailwind CSS : Le Design sans CSS',
    description: 'Créez des designs modernes et responsives directement dans votre HTML avec Tailwind.',
    level: 'Débutant',
    price: 49.99,
    imageUrl: '/tailwind-course.jpg',
  },
];

const HomePage = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      <main>
        <Hero />
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold text-slate-900">Nos formations les plus populaires</h2>
              <p className="mt-4 text-lg text-slate-600">
                Rejoignez des milliers d'apprenants et commencez à maîtriser les technologies les plus demandées.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {popularCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>

            <div className="text-center mt-16">
                <Link to="/formations">
                    <button className="bg-transparent text-violet-600 font-bold py-3 px-8 rounded-full border-2 border-violet-600 hover:bg-violet-600 hover:text-white transition-all duration-300 transform hover:scale-105">
                        Toutes les formations
                    </button>
                </Link>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-4xl font-extrabold text-slate-900">Ce que disent nos apprenants</h2>
                <p className="mt-4 text-lg text-slate-600">
                    Découvrez les histoires de réussite de ceux qui nous ont fait confiance.
                </p>
                <div className="mt-12 text-slate-500">
                    <p>(Les témoignages seront bientôt affichés ici)</p>
                </div>
            </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
