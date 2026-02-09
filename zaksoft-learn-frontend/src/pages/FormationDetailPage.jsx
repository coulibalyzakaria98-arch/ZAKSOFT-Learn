
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getFormation, getUserProgress } from '../api'; // Import the new API functions

const FormationDetailPage = () => {
  const { formationId } = useParams();
  const { currentUser } = useAuth();
  const [formation, setFormation] = useState(null);
  const [chapitres, setChapitres] = useState([]);
  const [completedChapters, setCompletedChapters] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch formation and its chapters using the new API function
        const formationData = await getFormation(formationId);
        // The backend returns chapters nested within the formation
        setFormation({ ...formationData, id: formationData._id });
        setChapitres(formationData.chapters || []);

        // Fetch user progress if logged in
        if (currentUser) {
          const userProgress = await getUserProgress(currentUser.uid);
          // Find progress for the current formation
          const currentFormationProgress = userProgress.find(p => p.formationId === formationId);
          if (currentFormationProgress) {
            setCompletedChapters(new Set(currentFormationProgress.completedChapters));
          }
        }

      } catch (err) {
        setError('Impossible de charger les données.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [formationId, currentUser]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;
  if (!formation) return <div>Formation non trouvée.</div>;

  return (
    <div>
      <Header />
      <main>
        <h2>{formation.title}</h2>
        <p>{formation.description}</p>
        
        <h3>Chapitres</h3>
        {chapitres.length > 0 ? (
          <ul>
            {chapitres.map(chapitre => (
              <li key={chapitre._id}> 
                <Link to={`/formations/${formationId}/chapitres/${chapitre._id}`}>
                  {completedChapters.has(chapitre._id) ? '✅ ' : ''}{chapitre.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun chapitre disponible pour cette formation.</p>
        )}

      </main>
      <Footer />
    </div>
  );
};

export default FormationDetailPage;
