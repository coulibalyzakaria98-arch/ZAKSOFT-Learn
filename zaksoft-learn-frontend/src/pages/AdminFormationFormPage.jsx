
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFormation, createFormation, updateFormation } from '../api';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AdminFormationFormPage = () => {
  const { formationId } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(formationId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      const fetchFormation = async () => {
        try {
          const data = await getFormation(formationId);
          setTitle(data.title);
          setDescription(data.description);
        } catch (error) {
          alert("Formation non trouvée !");
          navigate("/admin/formations");
        }
        setLoading(false);
      };
      fetchFormation();
    }
  }, [isEditing, formationId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formationData = { title, description };
      if (isEditing) {
        await updateFormation(formationId, formationData);
      } else {
        await createFormation(formationData);
      }
      navigate("/admin/formations");
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
        <h2>{isEditing ? 'Modifier la formation' : 'Nouvelle formation'}</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Titre</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required style={{width: "100%"}}/>
          </div>
          <div style={{marginTop: "1rem"}}>
            <label>Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={5} style={{width: "100%"}}/>
          </div>
          <button type="submit" disabled={loading} style={{marginTop: "1rem"}}>
            {loading ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default AdminFormationFormPage;
