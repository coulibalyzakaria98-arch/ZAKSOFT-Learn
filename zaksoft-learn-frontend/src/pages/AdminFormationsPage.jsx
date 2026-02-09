
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFormations, deleteFormation } from '../api'; // Import API functions
import Header from '../components/Header';
import Footer from '../components/Footer';

const AdminFormationsPage = () => {
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFormations = async () => {
    try {
      const formationsList = await getFormations();
      setFormations(formationsList.map(f => ({ ...f, id: f._id })));
    } catch (error) {
      console.error("Erreur lors du chargement des formations: ", error);
      alert("Le chargement des formations a échoué.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormations();
  }, []);

  const handleDelete = async (formationId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette formation ? Cette action est irréversible.")) {
      try {
        await deleteFormation(formationId);
        fetchFormations(); // Refresh the list after deletion
      } catch (error) {
        console.error("Erreur lors de la suppression de la formation: ", error);
        alert("La suppression a échoué.");
      }
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div>
      <Header />
      <main>
        <h2>Gérer les Formations</h2>
        <Link to="/admin/formations/new">+ Ajouter une nouvelle formation</Link>

        <table style={{ width: '100%', marginTop: '2rem' }}>
          <thead>
            <tr>
              <th>Titre</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {formations.map(formation => (
              <tr key={formation.id}>
                <td>{formation.title}</td>
                <td style={{display: "flex", gap: "1rem"}}>
                  <Link to={`/admin/formations/${formation.id}/chapitres`}>Gérer les chapitres</Link>
                  <Link to={`/admin/formations/${formation.id}/edit`}>Modifier</Link>
                  <button onClick={() => handleDelete(formation.id)}>Supprimer</button>
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

export default AdminFormationsPage;
