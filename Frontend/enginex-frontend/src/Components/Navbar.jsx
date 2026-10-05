// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Do not render Navbar if the user is not logged in
  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="global-navbar">
      <div className="navbar-brand">
        <Link to="/portals">EngineX</Link>
      </div>

      <div className="navbar-user">
        <div className="user-badge">
          <span className="user-avatar">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </span>
          <span className="user-name">{user.name}</span>
        </div>

        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}