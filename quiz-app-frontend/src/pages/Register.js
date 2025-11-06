import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../store/authSlice';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    
    // unwrap() sẽ trả về payload (nếu thành công) hoặc ném lỗi (nếu rejected)
    try {
       await dispatch(registerUser({ username, password })).unwrap();
       setSuccess(true);
       setTimeout(() => navigate('/login'), 2000); // Chuyển hướng sau 2s
    } catch (err) {
       // Lỗi đã được xử lý bởi rejectWithValue và state
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card shadow-lg" style={{ width: '400px' }}>
        <div className="card-body p-5">
          <h3 className="card-title text-center mb-4">Register</h3>
          <form onSubmit={handleSubmit}>
            {success && <div className="alert alert-success">Đăng ký thành công! Đang chuyển đến trang đăng nhập...</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={status === 'loading'}>
              {status === 'loading' ? 'Loading...' : 'Register'}
            </button>
          </form>
          <div className="text-center mt-3">
            <small>
              Already have an account? <Link to="/login">Login here</Link>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;