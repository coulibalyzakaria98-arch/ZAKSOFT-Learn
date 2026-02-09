
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AdminChapitresPage = () => {
  const { formationId } = useParams();
  const [chapitres, setChapitres] = useState([]);
  const [formation, setFormation] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchChapitres = useCallback(async () => {
    setLoading(true);
    // Fetch formation details to display its name
    const formationDoc = await getDoc(doc(db, 'formations', formationId));
    if (formationDoc.exists()) {
      setFormation(formationDoc.data());
    } else {
      // Handle case where formation doesn't exist
    }

    // Fetch chapters
    const chapitresCollection = collection(db, 'formations', formationId, 'chapitres');
    const chapitresSnapshot = await getDocs(chapitresCollection);
    setChapitres(chapitresSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  }, [formationId]);

  useEffect(() => {
    fetchChapitres();
  }, [fetchChapitres]);

  const handleDelete = async (chapitreId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce chapitre ?")) {
      try {
        await deleteDoc(doc(db, 'formations', formationId, 'chapitres', chapitreId));
        fetchChapitres(); // Refresh list
      } catch (error) {
        console.error("Erreur lors de la suppression du chapitre: ", error);
        alert("La suppression a échoué.");
      }
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div>
      <Header />
      <main>
        <Link to="/admin/formations">&larr; Retour aux formations</Link>
        <h2>Gérer les Chapitres de "{formation?.title}"</h2>
        <Link to={`/admin/formations/${formationId}/chapitres/new`}>+ Ajouter un nouveau chapitre</Link>

        <table style={{ width: '100%', marginTop: '2rem' }}>
          <thead>
            <tr>
              <th>Titre du Chapitre</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {chapitres.map(chapitre => (
              <tr key={chapitre.id}>
                <td>{chapitre.title}</td>
                <td>
                  <Link to={`/admin/formations/${formationId}/chapitres/${chapitre.id}/edit`}>Modifier</Link>
                  <button onClick={() => handleDelete(chapitre.id)} style={{ marginLeft: '1rem' }}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
      <Footer />
    </div>
  );
};

export default AdminChapitresPage;
