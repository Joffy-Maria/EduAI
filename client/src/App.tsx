import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import LessonPage from './pages/LessonPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/lesson/:id" element={
        <ProtectedRoute>
          <LessonPage />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="h-screen w-screen overflow-hidden aurora-gradient text-slate-100 font-sans flex items-center justify-center relative">
          <div className="w-full h-full max-w-7xl mx-auto px-4 py-6 relative z-10 flex flex-col">
            {/* Header is moved to Dashboard for authenticated views */}
            <AppRoutes />
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
