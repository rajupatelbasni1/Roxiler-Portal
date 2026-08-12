import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import OwnerDashboard from './pages/OwnerDashboard';

function Navbar({ darkMode, setDarkMode }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav style={{ 
      backgroundColor: darkMode ? '#1f2937' : '#2563eb', 
      padding: '16px 24px', 
      color: 'white', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      transition: 'background-color 0.3s ease'
    }}>
      <span style={{ fontSize: '22px', fontWeight: 'bold', letterSpacing: '0.5px' }}>Roxiler Portal</span>
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        <button 
          onClick={() => setDarkMode(!darkMode)} 
          style={{ background: 'transparent', border: '1px solid white', color: 'white', padding: '6px 12px', borderRadius: '5px', cursor: 'pointer' }}
        >
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>

        {token ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '14px', background: 'rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: '4px' }}>{role}</span>
            <button 
              onClick={handleLogout} 
              style={{ backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Logout
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none', padding: '8px 12px', fontWeight: '500' }}>Login</Link>
            <Link to="/signup" style={{ color: 'white', textDecoration: 'none', padding: '8px 12px', background: 'rgba(255,255,255,0.2)', borderRadius: '5px', fontWeight: '500' }}>Signup</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Router>
      <div style={{ 
        fontFamily: 'Inter, system-ui, sans-serif', 
        backgroundColor: darkMode ? '#111827' : '#f3f4f6', 
        color: darkMode ? '#f9fafb' : '#1f2937', 
        minHeight: '100vh',
        transition: 'background-color 0.3s ease, color 0.3s ease'
      }}>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/signup" element={<Signup darkMode={darkMode} />} />
            <Route path="/login" element={<Login darkMode={darkMode} />} />
            <Route path="/admin" element={<AdminDashboard darkMode={darkMode} />} />
            <Route path="/owner" element={<OwnerDashboard darkMode={darkMode} />} />
            <Route path="/user" element={<UserDashboard darkMode={darkMode} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}