
import React, { useState } from 'react';

const Quiz = ({ questions, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (optionIndex) => {
    setUserAnswers({ ...userAnswers, [currentQuestionIndex]: optionIndex });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
    const score = calculateScore();
    // On considère le quiz réussi si le score est >= 50%
    if (score >= 50) {
      onComplete(); // Appelle la fonction pour marquer le chapitre comme terminé
    }
  };

  const calculateScore = () => {
    let correctCount = 0;
    questions.forEach((q, index) => {
      if (userAnswers[index] === q.correctAnswer) {
        correctCount++;
      }
    });
    return (correctCount / questions.length) * 100;
  };

  if (showResults) {
    const score = calculateScore();
    return (
      <div>
        <h3>Résultats du Quiz</h3>
        <p>Votre score : {score.toFixed(2)}%</p>
        {score < 50 && <p>Vous devez obtenir au moins 50% pour valider ce chapitre.</p>}
        <ul>
          {questions.map((q, index) => (
            <li key={index} style={{ color: userAnswers[index] === q.correctAnswer ? 'green' : 'red' }}>
              {q.question} - Votre réponse : {q.options[userAnswers[index]]} (Correcte : {q.options[q.correctAnswer]})
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div>
      <h3>Quiz : {currentQuestion.question}</h3>
      <ul>
        {currentQuestion.options.map((option, index) => (
          <li key={index} onClick={() => handleAnswerSelect(index)} style={{ cursor: 'pointer', backgroundColor: userAnswers[currentQuestionIndex] === index ? 'lightblue' : 'transparent' }}>
            {option}
          </li>
        ))}
      </ul>
      {currentQuestionIndex < questions.length - 1 ? (
        <button onClick={handleNextQuestion} disabled={userAnswers[currentQuestionIndex] === undefined}>
          Question suivante
        </button>
      ) : (
        <button onClick={handleSubmit} disabled={userAnswers[currentQuestionIndex] === undefined}>
          Terminer le Quiz
        </button>
      )}
    </div>
  );
};

export default Quiz;
