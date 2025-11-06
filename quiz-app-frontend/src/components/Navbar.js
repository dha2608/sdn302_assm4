import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../store/authSlice';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, username, isAdmin } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  const renderAdminLinks = () => (
    <>
      <li className="nav-item">
        <Link className="nav-link" to="/admin">Home</Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/admin/questions">Manage Questions</Link>
      </li>
    </>
  );

  const renderUserLinks = () => (
    <>
      <li className="nav-item">
        <Link className="nav-link" to="/dashboard">Home</Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/dashboard/quiz">Quiz</Link>
      </li>
    </>
  );

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4" style={{ padding: '1rem', boxShadow: '0 2px 4px rgba(0,0,0,.1)' }}>
      <div className="container">
        <Link className="navbar-brand" to={isAdmin ? "/admin" : "/"}>
          {isAdmin ? "Admin Dashboard" : "Quiz App"}
        </Link>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {isAuthenticated && (isAdmin ? renderAdminLinks() : renderUserLinks())}
          </ul>
          <ul className="navbar-nav ms-auto">
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <span className="navbar-text me-3">
                    Welcome, {username}
                  </span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-secondary" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;