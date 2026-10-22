// src/components/Navbar.jsx
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Do not render Navbar if the user is not logged in
  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-20 border-b border-slate-800/80 bg-slate-950/75 px-4 py-3 backdrop-blur-xl sm:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <Link to="/portals" className="flex items-center gap-3 text-lg font-bold tracking-tight text-slate-100">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-300 to-blue-500 text-sm font-black text-slate-950 shadow-lg shadow-teal-500/20">EX</span>
          EngineX
        </Link>

        <div className="hidden items-center gap-1 sm:flex">
          <Link
            to="/portals"
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${location.pathname === '/portals' ? 'bg-slate-800 text-teal-300' : 'text-slate-400 hover:text-slate-100'}`}
          >
            Portals
          </Link>
          <Link
            to="/dreamer-quiz"
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${location.pathname === '/dreamer-quiz' ? 'bg-slate-800 text-teal-300' : 'text-slate-400 hover:text-slate-100'}`}
          >
            Dreamer quiz
          </Link>
        </div>

        <div className="navbar-user flex items-center gap-3">
          <div className="user-badge flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/70 py-1 pl-1 pr-3">
            <span className="user-avatar flex h-8 w-8 items-center justify-center rounded-full bg-teal-300 text-sm font-bold text-slate-950">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </span>
            <span className="user-name hidden text-sm font-medium text-slate-300 sm:inline">{user.name}</span>
          </div>

          <button onClick={handleLogout} className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-300 transition-colors hover:border-rose-400/50 hover:bg-rose-400/10 hover:text-rose-200">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}