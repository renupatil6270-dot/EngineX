import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import  Signup  from './pages/Signup';
import DreamerQuiz from './pages/DreamerQuiz';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/quiz"
          element={
            <ProtectedRoute>
              <DreamerQuiz />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
