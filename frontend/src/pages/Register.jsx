import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Button';
import { register } from '../services/authService';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Register the user
      const response = await register(formData);
      
      // ✅ AUTO LOGIN - Use the login function from useAuth
      login(response.user, response.token);
      
      // ✅ Redirect to employee dashboard
      navigate('/employee-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">📋</div>
        <h1>Create Account</h1>
        <p className="login-subtitle">Register as an employee</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </div>

          <Button type="submit" variant="primary" fullWidth disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>

        <div className="register-section">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="register-link">
              Login here
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #4c1d95 100%);
          padding: 20px;
        }

        .login-card {
          background: white;
          padding: 50px 40px;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          width: 100%;
          max-width: 420px;
        }

        .login-logo {
          font-size: 48px;
          text-align: center;
          margin-bottom: 10px;
        }

        .login-card h1 {
          margin: 0 0 8px 0;
          color: #1f2937;
          text-align: center;
          font-size: 26px;
          font-weight: 700;
        }

        .login-subtitle {
          text-align: center;
          color: #6b7280;
          margin-bottom: 30px;
          font-size: 14px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 6px;
          font-weight: 600;
          color: #374151;
          font-size: 14px;
        }

        .form-group input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 14px;
          transition: all 0.3s;
          box-sizing: border-box;
          background: #f9fafb;
        }

        .form-group input:focus {
          outline: none;
          border-color: #7c3aed;
          box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.1);
          background: white;
        }

        .error-message {
          background: #fef2f2;
          color: #dc2626;
          padding: 10px 14px;
          border-radius: 10px;
          margin-bottom: 20px;
          text-align: center;
          font-size: 14px;
          border: 1px solid #fecaca;
        }

        .register-section {
          text-align: center;
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid #e5e7eb;
        }

        .register-section p {
          font-size: 14px;
          color: #6b7280;
        }

        .register-link {
          color: #7c3aed;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
        }

        .register-link:hover {
          text-decoration: underline;
        }

        .btn-primary {
          background: linear-gradient(135deg, #7c3aed, #6d28d9) !important;
          padding: 14px !important;
          font-size: 16px !important;
          border-radius: 10px !important;
          font-weight: 700 !important;
          transition: all 0.3s !important;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(124, 58, 237, 0.4) !important;
        }

        .btn-primary:disabled {
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
};

export default Register;