
import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

const Comments = ({ formationId, chapitreId, comments, onCommentPosted }) => {
  const { currentUser } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Veuillez vous connecter pour laisser un commentaire.");
      return;
    }
    if (newComment.trim() === '') return;

    setIsSubmitting(true);
    try {
      const commentsCollectionRef = collection(db, 'formations', formationId, 'chapitres', chapitreId, 'comments');
      await addDoc(commentsCollectionRef, {
        text: newComment,
        authorId: currentUser.uid,
        authorName: currentUser.displayName || currentUser.email,
        createdAt: serverTimestamp(),
      });
      setNewComment('');
      onCommentPosted(); // Déclenche le rafraîchissement des commentaires dans la page parente
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire:", error);
      alert("Impossible d'ajouter le commentaire.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (timestamp) => {
    if (timestamp && typeof timestamp.toDate === 'function') {
      return new Date(timestamp.toDate()).toLocaleString();
    }
    return 'à l\'instant';
  };

  return (
    <section>
      <h3>Commentaires</h3>
      {currentUser && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Laissez votre commentaire..."
            rows="4"
            required
            disabled={isSubmitting}
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
          />
          <button type="submit" disabled={isSubmitting} style={{ marginTop: '10px' }}>
            {isSubmitting ? 'Envoi...' : 'Envoyer'}
          </button>
        </form>
      )}
      {comments.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {comments.map(comment => (
            <li key={comment.id} style={{ borderBottom: '1px solid #eee', marginBottom: '1rem', paddingBottom: '1rem' }}>
              <p style={{ margin: '0.5rem 0' }}>{comment.text}</p>
              <strong>- {comment.authorName}</strong>
              <br />
              <small>{formatDate(comment.createdAt)}</small>
            </li>
          ))}
        </ul>
      ) : (
        <p>Soyez le premier à commenter !</p>
      )}
    </section>
  );
};

export default Comments;
