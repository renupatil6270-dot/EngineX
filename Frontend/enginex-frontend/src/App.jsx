// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import Navbar from './Components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PortalSelection from './pages/PortalSelection';
import DreamerQuiz from './pages/DreamerQuiz';
import AchieverDashboard from './pages/AchieverDashboard';
import InnovatorHub from './pages/InnovatorHub';
import Roadmap from './pages/Roadmap';
import ProtectedRoute from './Components/ProtectedRoute';

function RootRedirect() {
  const { token } = useAuth();
  return <Navigate to={token ? '/portals' : '/login'} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/portals"
            element={
              <ProtectedRoute>
                <PortalSelection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dreamer-quiz"
            element={
              <ProtectedRoute>
                <DreamerQuiz />
              </ProtectedRoute>
            }
          />
          <Route path="/achiever-dashboard" element={<ProtectedRoute><AchieverDashboard /></ProtectedRoute>} />
          <Route path="/innovator-hub" element={<ProtectedRoute><InnovatorHub /></ProtectedRoute>} />
          <Route path="/roadmap" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />

          {/* Default Fallback */}
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
