import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Award, BookOpen, Search } from 'lucide-react';

// Placeholder pour le chargement
const ShimmerCard = () => (
  <div className="bg-white rounded-xl shadow-lg animate-pulse">
    <div className="p-6">
      <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-slate-200 rounded w-1/2 mb-6"></div>
      <div className="h-3 bg-slate-200 rounded w-full mb-2"></div>
      <div className="h-10 bg-violet-200 rounded-full mt-6"></div>
    </div>
  </div>
);

// Carte de formation
const DashboardCourseCard = ({ course, isCompleted }) => {
  const progress = isCompleted ? 100 : (course.progress || 0);

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1">
      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-900 truncate">{course.title}</h3>
        <p className="text-slate-600 text-sm mt-1">Niveau: {course.level}</p>
        
        <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-slate-700">Progression</span>
                <span className="text-sm font-bold text-violet-600">{progress}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5">
                <div className="bg-violet-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
        </div>

        <Link to={`/formations/${course.id}`}>
          <button className="w-full mt-6 bg-violet-600 text-white font-bold py-3 px-6 rounded-full hover:bg-violet-700 transition-colors shadow-md">
            {isCompleted ? 'Revoir le cours' : 'Reprendre le cours'}
          </button>
        </Link>
      </div>
    </div>
  );
};


const DashboardPage = () => {
  const { currentUser } = useAuth();
  const [completedFormations, setCompletedFormations] = useState([]);
  const [inProgressFormations, setInProgressFormations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const formationsSnapshot = await getDocs(collection(db, 'formations'));
      const allFormations = formationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const userDocSnap = await getDoc(doc(db, 'users', currentUser.uid));
      const userProgress = userDocSnap.exists() && userDocSnap.data().progress ? userDocSnap.data().progress : {};

      const categorized = await Promise.all(allFormations.map(async (formation) => {
        const chaptersSnapshot = await getDocs(collection(db, 'formations', formation.id, 'chapitres'));
        const totalChapters = chaptersSnapshot.size;

        const progressData = userProgress[formation.id];
        if (progressData && totalChapters > 0) {
          const completedChapters = Object.values(progressData).filter(c => c.completed).length;
          const progressPercentage = Math.round((completedChapters / totalChapters) * 100);

          if (completedChapters >= totalChapters) {
            return { ...formation, status: 'completed', progress: 100 };
          } else {
            return { ...formation, status: 'inProgress', progress: progressPercentage };
          }
        }
        return null; // On ne veut que les cours commencés ou finis
      }));

      const validFormations = categorized.filter(Boolean); // Filtrer les valeurs null

      setCompletedFormations(validFormations.filter(f => f.status === 'completed'));
      setInProgressFormations(validFormations.filter(f => f.status === 'inProgress'));

    } catch (err) {
      setError("Impossible de charger les données.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (!currentUser && !loading) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center text-center px-4">
            <h1 className="text-4xl font-extrabold text-slate-900">Accès non autorisé</h1>
            <p className="mt-4 text-lg text-slate-600">Vous devez être connecté pour accéder à votre tableau de bord.</p>
            <Link to="/login">
                <button className="mt-8 bg-violet-600 text-white font-bold py-3 px-8 rounded-full hover:bg-violet-700 transition-colors shadow-md">
                    Se connecter
                </button>
            </Link>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
        <header className="bg-white shadow-sm sticky top-20 z-40">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-extrabold text-slate-900">Mon Tableau de Bord</h1>
                <p className="mt-1 text-slate-600">Bienvenue, {currentUser?.displayName || currentUser?.email} ! Prêt à apprendre quelque chose de nouveau ?</p>
            </div>
        </header>

        <main className="container mx-auto p-4 md:p-8">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <ShimmerCard /><ShimmerCard /><ShimmerCard />
              </div>
            ) : error ? (
                <div className="text-center bg-red-100 p-8 rounded-lg">
                    <p className="text-red-700 font-semibold">{error}</p>
                </div>
            ) : (
                <>
                    {/* Formations en cours */}
                    <section className="mb-16">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center"><BookOpen className="mr-3 text-violet-600"/>Formations en cours</h2>
                        {inProgressFormations.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {inProgressFormations.map(course => <DashboardCourseCard key={course.id} course={course} isCompleted={false} />)}
                            </div>
                        ) : (
                            <div className="text-center bg-white p-12 rounded-lg shadow-md">
                                <h3 className="text-xl font-medium text-slate-800">Vous n'avez pas de formation en cours.</h3>
                                <p className="text-slate-600 mt-2">Il est temps de commencer une nouvelle aventure d'apprentissage !</p>
                                <Link to="/formations">
                                    <button className="mt-6 bg-transparent text-violet-600 font-bold py-3 px-8 rounded-full border-2 border-violet-600 hover:bg-violet-600 hover:text-white transition-all duration-300">
                                        Explorer les formations
                                    </button>
                                </Link>
                            </div>
                        )}
                    </section>

                    {/* Formations terminées */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center"><Award className="mr-3 text-violet-600"/>Formations terminées</h2>
                        {completedFormations.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {completedFormations.map(course => <DashboardCourseCard key={course.id} course={course} isCompleted={true} />)}
                            </div>
                        ) : (
                            <div className="text-center p-8">
                                <p className="text-slate-500">Aucune formation terminée pour le moment. Continuez comme ça !</p>
                            </div>
                        )}
                    </section>
                </>
            )}
        </main>
    </div>
  );
};

export default DashboardPage;
