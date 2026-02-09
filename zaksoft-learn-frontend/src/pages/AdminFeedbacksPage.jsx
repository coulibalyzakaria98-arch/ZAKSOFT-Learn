
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AdminFeedbacksPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      setLoading(true);
      const feedbacksQuery = query(collection(db, 'feedbacks'), orderBy('createdAt', 'desc'));
      const feedbacksSnap = await getDocs(feedbacksQuery);

      const feedbacksData = await Promise.all(feedbacksSnap.docs.map(async (feedbackDoc) => {
        const feedback = { id: feedbackDoc.id, ...feedbackDoc.data() };

        // Enrichir avec les titres pour un affichage plus clair
        try {
          const formationSnap = await getDoc(doc(db, 'formations', feedback.formationId));
          if(formationSnap.exists()) feedback.formationTitle = formationSnap.data().title;

          const chapitreSnap = await getDoc(doc(db, 'formations', feedback.formationId, 'chapitres', feedback.chapitreId));
          if(chapitreSnap.exists()) feedback.chapitreTitle = chapitreSnap.data().title;
        } catch(e) {
            console.error("Couldn't enrich feedback", e)
        }

        return feedback;
      }));

      setFeedbacks(feedbacksData);
      setLoading(false);
    };

    fetchFeedbacks();
  }, []);

  if (loading) {
    return <div>Chargement des feedbacks...</div>;
  }

  return (
    <div>
      <Header />
      <main>
        <Link to="/admin">&larr; Retour au tableau de bord</Link>
        <h2>Avis des Utilisateurs</h2>
        <table style={{ width: '100%', marginTop: '2rem' }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Formation</th>
              <th>Chapitre</th>
              <th>Note</th>
              <th>Commentaire</th>
              <th>Utilisateur (ID)</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map(feedback => (
              <tr key={feedback.id}>
                <td>{feedback.createdAt?.toDate().toLocaleDateString()}</td>
                <td>{feedback.formationTitle || feedback.formationId}</td>
                <td>{feedback.chapitreTitle || feedback.chapitreId}</td>
                <td>{"⭐".repeat(feedback.rating)}</td>
                <td>{feedback.comment}</td>
                <td>{feedback.userId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
      <Footer />
    </div>
  );
};

export default AdminFeedbacksPage;
