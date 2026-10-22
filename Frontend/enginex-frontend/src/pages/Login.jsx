// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      await login(formData.email, formData.password);
      navigate('/portals');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass-card">
        <div className="mb-8 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-teal-300">EngineX</p>
          <h1 className="m-0 text-3xl font-bold tracking-tight text-slate-100">Welcome back.</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">Pick up where you left off and keep moving toward your goals.</p>
        </div>

        {error && <div className="mb-5 rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-left text-sm text-rose-200">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="login-email" className="text-sm font-medium text-slate-300">Email address</label>
            <input
              id="login-email"
              type="email"
              name="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              className="auth-input"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="login-password" className="text-sm font-medium text-slate-300">Password</label>
            <input
              id="login-password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="auth-input"
              required
            />
          </div>

          <button type="submit" className="primary-button mt-3 w-full px-4 py-3" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-slate-400">
          Don't have an account? <Link className="font-semibold text-teal-300 hover:text-teal-200" to="/signup">Create one</Link>
        </p>
      </div>
    </div>
  );
}