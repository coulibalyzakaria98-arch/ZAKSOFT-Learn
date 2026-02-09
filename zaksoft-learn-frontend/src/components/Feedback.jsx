
import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

const Feedback = ({ formationId, chapitreId }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Vous devez être connecté pour laisser un avis.');
      return;
    }
    if (rating === 0) {
      alert('Veuillez sélectionner une note.');
      return;
    }

    try {
      await addDoc(collection(db, 'feedbacks'), {
        formationId,
        chapitreId,
        userId: user.uid,
        rating,
        comment,
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du feedback: ', error);
      alert('Une erreur est survenue.');
    }
  };

  if (submitted) {
    return <p>Merci pour votre retour !</p>;
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
      <h4>Laissez votre avis</h4>
      <div>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => setRating(star)}
            style={{ cursor: 'pointer', color: star <= rating ? 'gold' : 'grey', fontSize: '1.5rem' }}
          >
            ★
          </span>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Votre commentaire (optionnel)"
        rows={4}
        style={{ width: '100%', marginTop: '1rem' }}
      />
      <button type="submit" style={{ marginTop: '1rem' }}>Envoyer</button>
    </form>
  );
};

export default Feedback;
