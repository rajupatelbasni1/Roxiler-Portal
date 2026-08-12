import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login({ darkMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', { email, password });
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role);
      
      if (res.data.user.role === 'SYSTEM_ADMIN') navigate('/admin');
      else if (res.data.user.role === 'STORE_OWNER') navigate('/owner');
      else navigate('/user');

    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  const bgCard = darkMode ? '#1e293b' : '#ffffff';
  const textMain = darkMode ? '#f8fafc' : '#0f172a';
  const textMuted = darkMode ? '#94a3b8' : '#64748b';
  const borderCol = darkMode ? '#334155' : '#e2e8f0';
  const inputBg = darkMode ? '#0f172a' : '#f8fafc';

  return (
    <div style={{ maxWidth: '420px', margin: '60px auto', padding: '32px', backgroundColor: bgCard, borderRadius: '12px', border: `1px solid ${borderCol}`, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', color: textMain }}>
      <h2 style={{ textAlign: 'center', marginBottom: '24px', fontSize: '24px', fontWeight: 'bold', color: textMain }}>Welcome Back</h2>
      {error && <p style={{ color: '#dc2626', textAlign: 'center', marginBottom: '16px', fontWeight: '500', background: '#fee2e2', padding: '10px', borderRadius: '6px' }}>{error}</p>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: textMuted }}>Email Address</label>
          <input type="email" placeholder="Enter your email" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${borderCol}`, background: inputBg, color: textMain, outline: 'none' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: textMuted }}>Password</label>
          <input type="password" placeholder="Enter your password" required value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${borderCol}`, background: inputBg, color: textMain, outline: 'none' }} />
        </div>
        
        <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '15px', marginTop: '8px' }}>Login</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '20px', color: textMuted, fontSize: '14px' }}>New here? <Link to="/signup" style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none' }}>Sign Up</Link></p>
    </div>
  );
}