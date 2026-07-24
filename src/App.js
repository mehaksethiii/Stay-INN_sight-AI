import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Profile from './pages/Profile';
import AIAnalyser from './pages/AIAnalyser';
import FloatingChatbot from './components/FloatingChatbot';

function App() {
  // load saved preference from localStorage, default to false (light)
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true'
  );

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
  };

  return (
    <ErrorBoundary>
      <div className={darkMode ? 'dark-mode' : 'light-mode'}>
        <CustomCursor />
        <AuthProvider>
          <BrowserRouter>
            <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ai-analyser"
                element={
                  <ProtectedRoute>
                    <AIAnalyser />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Footer />
            {/* Floating AI Chatbot — visible on all pages when authenticated */}
            <FloatingChatbot />
          </BrowserRouter>
        </AuthProvider>
      </div>
    </ErrorBoundary>
  );
}

export default App;
