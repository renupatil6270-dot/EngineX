// src/pages/Signup.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setSubmitting(true);
      await signup(formData.name, formData.email, formData.password);
      navigate('/portals');
    } catch (err) {
      setError(err.message || 'Failed to create account');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass-card">
        <div className="mb-8 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-teal-300">EngineX</p>
          <h1 className="m-0 text-3xl font-bold tracking-tight text-slate-100">Build your next chapter.</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">Create an account and turn your engineering goals into a clear path forward.</p>
        </div>

        {error && <div className="mb-5 rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-left text-sm text-rose-200">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-slate-300">Full name</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Alex Morgan"
              value={formData.name}
              onChange={handleChange}
              className="auth-input"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="signup-email" className="text-sm font-medium text-slate-300">Email address</label>
            <input
              id="signup-email"
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
            <label htmlFor="signup-password" className="text-sm font-medium text-slate-300">Password</label>
            <input
              id="signup-password"
              type="password"
              name="password"
              placeholder="At least 8 characters"
              value={formData.password}
              onChange={handleChange}
              className="auth-input"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="confirm-password" className="text-sm font-medium text-slate-300">Confirm password</label>
            <input
              id="confirm-password"
              type="password"
              name="confirmPassword"
              placeholder="Repeat your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="auth-input"
              required
            />
          </div>

          <button type="submit" className="primary-button mt-3 w-full px-4 py-3" disabled={submitting}>
            {submitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-slate-400">
          Already have an account? <Link className="font-semibold text-teal-300 hover:text-teal-200" to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}