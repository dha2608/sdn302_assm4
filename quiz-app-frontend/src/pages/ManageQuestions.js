import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuestions, addQuestion, deleteQuestion, updateQuestion } from '../store/questionSlice';

function ManageQuestions() {
  const dispatch = useDispatch();
  const { items: questions, status } = useSelector((state) => state.questions);

  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [text, setText] = useState('');
  const [options, setOptions] = useState('');
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchQuestions());
    }
  }, [status, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const questionData = {
      text,
      options: options.split(',').map(opt => opt.trim()),
      correctAnswerIndex: parseInt(correctAnswerIndex)
    };

    if (isEditing) {
      dispatch(updateQuestion({ id: currentId, data: questionData }));
    } else {
      dispatch(addQuestion(questionData));
    }
    
    resetForm();
  };
  
  const resetForm = () => {
    setIsEditing(false);
    setCurrentId(null);
    setText('');
    setOptions('');
    setCorrectAnswerIndex(0);
  };

  const handleEdit = (question) => {
    setIsEditing(true);
    setCurrentId(question._id);
    setText(question.text);
    setOptions(question.options.join(', ')); 
    setCorrectAnswerIndex(question.correctAnswerIndex);
    window.scrollTo(0, 0);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa câu hỏi này?')) {
      dispatch(deleteQuestion(id));
    }
  };

  return (
    <div className="container">
      <h2>Manage Questions</h2>
      
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h4 className="card-title">{isEditing ? 'Edit Question' : 'Add New Question'}</h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Question Text:</label>
              <input
                type="text"
                className="form-control"
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Options (comma-separated):</label>
              <input
                type="text"
                className="form-control"
                placeholder="Option 1, Option 2, Option 3"
                value={options}
                onChange={(e) => setOptions(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Correct Answer Index:</label>
              <input
                type="number"
                className="form-control"
                value={correctAnswerIndex}
                onChange={(e) => setCorrectAnswerIndex(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary me-2">
              {isEditing ? 'Update Question' : 'Add Question'}
            </button>
            {isEditing && (
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel Edit
              </button>
            )}
          </form>
        </div>
      </div>

      <h3>Questions List</h3>
      {status === 'loading' && <p>Loading questions...</p>}
      <div className="list-group">
        {questions.map((q) => (
          <div key={q._id} className="list-group-item">
            <div className="d-flex w-100 justify-content-between">
              <h5 className="mb-1">{q.text}</h5>
              <div>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(q)}>
                  Edit
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(q._id)}>
                  Delete
                </button>
              </div>
            </div>
            <ul className="list-unstyled mt-2">
              {q.options.map((opt, index) => (
                <li key={index} className={index === q.correctAnswerIndex ? 'fw-bold text-success' : ''}>
                  {opt} {index === q.correctAnswerIndex && '(Correct)'}
                </li>
              ))}
            </ul>
             <small className="text-muted">Author: {q.author ? q.author.username : 'N/A'}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageQuestions;