import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuizzes } from '../store/quizSlice';

function Quiz() {
  const dispatch = useDispatch();
  const { items: quizzes, status } = useSelector((state) => state.quizzes);
  
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchQuizzes());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (quizzes.length > 0 && !currentQuiz) {
      const quizWithQuestions = quizzes.find(q => q.questions && q.questions.length > 0);
      if (quizWithQuestions) {
        setCurrentQuiz(quizWithQuestions);
        setCurrentQuestionIndex(0);
        setScore(0);
        setQuizCompleted(false);
      }
    }
  }, [quizzes, currentQuiz]);

  const handleAnswerSubmit = () => {
    const currentQuestion = currentQuiz.questions[currentQuestionIndex];
    
    if (selectedAnswer === currentQuestion.correctAnswerIndex) {
      setScore(score + 1);
    }
    
    setSelectedAnswer(null); 

    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const restartQuiz = () => {
     setCurrentQuiz(null); //trigger useEffect để chọn lại quiz
  };

  // --- Render ---
  if (status === 'loading') return <div className="container">Loading...</div>;
  if (quizCompleted) {
    return (
      <div className="container text-center mt-5">
        <h2>Quiz Completed</h2>
        <h3>Your score: {score} / {currentQuiz.questions.length}</h3>
        <button className="btn btn-primary mt-3" onClick={restartQuiz}>
          Restart Quiz
        </button>
      </div>
    );
  }

  if (!currentQuiz) {
    return <div className="container">Không có quiz nào để làm.</div>;
  }

  const question = currentQuiz.questions[currentQuestionIndex];

  return (
    <div className="container d-flex justify-content-center mt-5">
      <div className="card" style={{ width: '600px' }}>
        <div className="card-body p-5">
          <h2 className="card-title text-center mb-4">Quiz</h2>
          <h5 className="mb-3">{question.text}</h5>
          
          <div className="list-group">
            {question.options.map((option, index) => (
              <label 
                key={index} 
                className={`list-group-item list-group-item-action ${selectedAnswer === index ? 'active' : ''}`}
                style={{ cursor: 'pointer' }}
              >
                <input
                  type="radio"
                  name="quiz-option"
                  className="form-check-input me-2"
                  checked={selectedAnswer === index}
                  onChange={() => setSelectedAnswer(index)}
                />
                {option}
              </label>
            ))}
          </div>
          
          <button 
            className="btn btn-primary w-100 mt-4" 
            onClick={handleAnswerSubmit}
            disabled={selectedAnswer === null}
          >
            Submit Answer
          </button>
        </div>
      </div>
    </div>
  );
}

export default Quiz;