import React, { useState, useEffect } from 'react';
import { getFormations } from '../api'; // Assurez-vous que ce chemin est correct
import CourseCard from '../components/CourseCard';
import { Search, XCircle } from 'lucide-react';

const ShimmerCard = () => (
  <div className="bg-white rounded-xl shadow-lg animate-pulse">
    <div className="w-full h-40 bg-slate-200 rounded-t-xl"></div>
    <div className="p-6">
      <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-slate-200 rounded w-1/3"></div>
    </div>
  </div>
);

const FormationsPage = () => {
  const [allFormations, setAllFormations] = useState([]);
  const [filteredFormations, setFilteredFormations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchFormations = async () => {
      try {
        let formationsList = await getFormations();
        // Assurez-vous que chaque formation a un ID unique
        formationsList = formationsList.map(formation => ({ ...formation, id: formation._id || formation.id }));
        setAllFormations(formationsList);
        setFilteredFormations(formationsList);
      } catch (err) {
        setError('Oops! Une erreur est survenue lors du chargement des formations.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFormations();
  }, []);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const results = allFormations.filter(formation =>
      (formation.title && formation.title.toLowerCase().includes(lowercasedFilter)) ||
      (formation.description && formation.description.toLowerCase().includes(lowercasedFilter))
    );
    setFilteredFormations(results);
  }, [searchTerm, allFormations]);

  return (
    <div className="bg-slate-50 min-h-screen">
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">Explorez Nos Formations</h1>
            <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">Développez vos compétences avec des cours conçus par des experts pour vous aider à réussir dans le monde de la tech.</p>
        </div>

        <div className="mb-12 flex justify-center">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par titre ou description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 text-lg bg-white border-2 border-slate-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors duration-300"
            />
          </div>
        </div>

        {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {[...Array(8)].map((_, i) => <ShimmerCard key={i} />)}
            </div>
        ) : error ? (
            <div className="text-center py-12">
                <XCircle className="mx-auto text-red-500 h-16 w-16" />
                <h3 className="mt-4 text-2xl font-semibold text-slate-800">{error}</h3>
                <p className="text-slate-600 mt-2">Veuillez réessayer plus tard.</p>
            </div>
        ) : filteredFormations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredFormations.map(formation => (
                    <CourseCard key={formation.id} course={formation} />
                ))}
            </div>
        ) : (
            <div className="text-center py-12">
                <Search className="mx-auto text-slate-400 h-16 w-16" />
                <h3 className="mt-4 text-2xl font-semibold text-slate-800">Aucune formation trouvée</h3>
                <p className="text-slate-600 mt-2">Essayez d'ajuster vos termes de recherche ou explorez toutes nos formations.</p>
            </div>
        )}
      </main>
    </div>
  );
};

export default FormationsPage;
