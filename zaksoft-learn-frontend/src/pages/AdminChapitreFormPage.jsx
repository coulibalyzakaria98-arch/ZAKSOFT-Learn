
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ReactQuill from 'react-quill'; // Import de ReactQuill
import 'react-quill/dist/quill.snow.css'; // Import du thème CSS

const AdminChapitreFormPage = () => {
  const { formationId, chapitreId } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(chapitreId);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState(''); // Le contenu sera maintenant du HTML
  const [loading, setLoading] = useState(false);

  const fetchChapitre = useCallback(async () => {
    if (isEditing) {
      setLoading(true);
      const docRef = doc(db, 'formations', formationId, 'chapitres', chapitreId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTitle(data.title);
        setContent(data.content);
      } else {
        alert("Chapitre non trouvé !");
        navigate(`/admin/formations/${formationId}/chapitres`);
      }
      setLoading(false);
    }
  }, [isEditing, formationId, chapitreId, navigate]);

  useEffect(() => {
    fetchChapitre();
  }, [fetchChapitre]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const chapitresCollectionRef = collection(db, 'formations', formationId, 'chapitres');

    try {
      if (isEditing) {
        const docRef = doc(chapitresCollectionRef, chapitreId);
        await setDoc(docRef, { title, content, updatedAt: serverTimestamp() }, { merge: true });
      } else {
        await addDoc(chapitresCollectionRef, { title, content, createdAt: serverTimestamp() });
      }
      navigate(`/admin/formations/${formationId}/chapitres`);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde: ", error);
      alert("La sauvegarde a échoué.");
    }
    setLoading(false);
  };

  return (
    <div>
      <Header />
      <main>
        <Link to={`/admin/formations/${formationId}/chapitres`}>&larr; Retour aux chapitres</Link>
        <h2>{isEditing ? 'Modifier le chapitre' : 'Nouveau chapitre'}</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Titre du Chapitre</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required style={{width: "100%"}}/>
          </div>
          <div style={{marginTop: "1rem"}}>
            <label>Contenu du Chapitre</label>
            {/* Remplacement du textarea par ReactQuill */}
            <ReactQuill theme="snow" value={content} onChange={setContent} />
          </div>
          <button type="submit" disabled={loading} style={{marginTop: "2rem", /* espace pour l'éditeur */}}>
            {loading ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default AdminChapitreFormPage;
