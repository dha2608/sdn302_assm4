import React from 'react';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  return (
    <div className='container'>
      <h1>Admin Dashboard</h1>
      <p>Chào mừng Admin. Bạn có thể quản lý các câu hỏi tại đây.</p>
      <Link to="/admin/questions" className="btn btn-primary">
        Manage Questions
      </Link>
    </div>
  );
}

export default AdminDashboard;