
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLowDataMode } from '../context/LowDataModeContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Feedback from '../components/Feedback';
import SmartNotes from '../components/SmartNotes';
import { getFormation, updateUserProgress } from '../api';

const ChapitrePage = () => {
  const { formationId, chapitreId } = useParams();
  const { currentUser } = useAuth();
  const { isLowDataMode } = useLowDataMode();
  const navigate = useNavigate();

  const [formation, setFormation] = useState(null);
  const [chapitre, setChapitre] = useState(null);
  const [chapitresList, setChapitresList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFormationData = async () => {
      setLoading(true);
      try {
        const formationData = await getFormation(formationId);
        setFormation(formationData);
        setChapitresList(formationData.chapters || []);

        const currentChapitre = (formationData.chapters || []).find(c => c._id === chapitreId);
        if (currentChapitre) {
          setChapitre(currentChapitre);
        } else {
          setError('Chapitre non trouvé.');
        }

      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFormationData();
  }, [formationId, chapitreId]);

  const handleCompleteChapter = async () => {
    if (!currentUser) {
      alert('Veuillez vous connecter pour marquer ce chapitre comme terminé.');
      return;
    }
    try {
      await updateUserProgress(currentUser.uid, formationId, chapitreId);

      alert('Chapitre marqué comme terminé !');

      // Optional: navigate to the next chapter
      const currentIndex = chapitresList.findIndex(c => c._id === chapitreId);
      if (currentIndex !== -1 && currentIndex < chapitresList.length - 1) {
        const nextChapitre = chapitresList[currentIndex + 1];
        navigate(`/formations/${formationId}/chapitres/${nextChapitre._id}`);
      }

    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;
  if (!chapitre) return <div>Chapitre non trouvé.</div>;

  return (
    <div>
      <Header />
      <main style={{ padding: '2rem' }}>
        <h1>{chapitre.title}</h1>

        {isLowDataMode ? (
          <div className="low-data-content" style={{ padding: '2rem', border: '1px dashed #ccc', textAlign: 'center' }}>
            <h3>Mode Low-Data Activé</h3>
            <p>L'affichage du contenu riche est désactivé.</p>
          </div>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: chapitre.content }} />
        )}

        <button onClick={handleCompleteChapter} style={{ marginTop: '1.5rem', padding: '0.5rem 1rem' }}>
          Marquer comme terminé
        </button>

        {currentUser && (
          <div style={{ marginTop: '3rem' }}>
            <SmartNotes chapterId={chapitreId} />
          </div>
        )}

        {currentUser ? (
          <Feedback formationId={formationId} chapitreId={chapitreId} user={currentUser} />
        ) : (
          <p style={{marginTop: '2rem'}}><i><Link to="/login">Connectez-vous</Link> pour laisser un avis ou prendre des notes.</i></p>
        )}

        <nav style={{ marginTop: '3rem' }}>
          <h3>Autres chapitres :</h3>
          <ul>
            {chapitresList.map(chap => (
              <li key={chap._id}>
                <Link to={`/formations/${formationId}/chapitres/${chap._id}`}>
                  {chap.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </main>
      <Footer />
    </div>
  );
};

export default ChapitrePage;
