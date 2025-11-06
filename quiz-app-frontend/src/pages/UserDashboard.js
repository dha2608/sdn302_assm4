import React from 'react';
import { Link } from 'react-router-dom';

function UserDashboard() {
  return (
    <div className='container'>
      <h1>User Dashboard</h1>
      <p>Chào mừng bạn đến với trang Quiz. Hãy chọn một bài quiz để bắt đầu.</p>
      <Link to="/dashboard/quiz" className="btn btn-primary">
        Làm Quiz
      </Link>
    </div>
  );
}

export default UserDashboard;