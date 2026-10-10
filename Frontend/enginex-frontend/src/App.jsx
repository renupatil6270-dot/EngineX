// src/App.jsx

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './Components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PortalSelection from './pages/PortalSelection';
import DreamerQuiz from './pages/DreamerQuiz';
import ProtectedRoute from './Components/ProtectedRoute';

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

          {/* Default Fallback */}
          <Route path="*" element={<Navigate to="/portals" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
