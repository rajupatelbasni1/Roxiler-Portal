import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup({ darkMode }) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', address: '', role: 'NORMAL_USER' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.name.length < 20 || formData.name.length > 60) {
      setMessage('Name must be between 20 and 60 characters.');
      return;
    }
    if (formData.address.length > 400) {
      setMessage('Address cannot exceed 400 characters.');
      return;
    }
    const pwdRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;
    if (!pwdRegex.test(formData.password)) {
      setMessage('Password must be 8-16 chars, include 1 uppercase and 1 special character.');
      return;
    }

    try {
      const res = await axios.post('https://roxiler-portal.onrender.com/api/auth/signup', formData);
      setMessage(res.data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Signup failed');
    }
  };

  const bgCard = darkMode ? '#1e293b' : '#ffffff';
  const textMain = darkMode ? '#f8fafc' : '#0f172a';
  const textMuted = darkMode ? '#94a3b8' : '#64748b';
  const borderCol = darkMode ? '#334155' : '#e2e8f0';
  const inputBg = darkMode ? '#0f172a' : '#f8fafc';

  return (
    <div style={{ maxWidth: '440px', margin: '40px auto', padding: '32px', backgroundColor: bgCard, borderRadius: '12px', border: `1px solid ${borderCol}`, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', color: textMain }}>
      <h2 style={{ textAlign: 'center', marginBottom: '24px', fontSize: '24px', fontWeight: 'bold', color: textMain }}>Create Account</h2>
      {message && <p style={{ color: message.includes('success') ? '#16a34a' : '#dc2626', textAlign: 'center', marginBottom: '16px', fontWeight: '500', background: message.includes('success') ? '#dcfce7' : '#fee2e2', padding: '10px', borderRadius: '6px', fontSize: '13px' }}>{message}</p>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: textMuted }}>Full Name (20-60 chars)</label>
          <input type="text" placeholder="Enter full name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '11px', borderRadius: '8px', border: `1px solid ${borderCol}`, background: inputBg, color: textMain, outline: 'none' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: textMuted }}>Email Address</label>
          <input type="email" placeholder="Enter email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '11px', borderRadius: '8px', border: `1px solid ${borderCol}`, background: inputBg, color: textMain, outline: 'none' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: textMuted }}>Password (8-16 chars, 1 Upper, 1 Special)</label>
          <input type="password" placeholder="Enter password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} style={{ width: '100%', padding: '11px', borderRadius: '8px', border: `1px solid ${borderCol}`, background: inputBg, color: textMain, outline: 'none' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: textMuted }}>Address (Max 400 chars)</label>
          <input type="text" placeholder="Enter address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} style={{ width: '100%', padding: '11px', borderRadius: '8px', border: `1px solid ${borderCol}`, background: inputBg, color: textMain, outline: 'none' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: textMuted }}>Account Role</label>
          <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} style={{ width: '100%', padding: '11px', borderRadius: '8px', border: `1px solid ${borderCol}`, background: inputBg, color: textMain, outline: 'none' }}>
            <option value="NORMAL_USER">Normal User</option>
            <option value="STORE_OWNER">Store Owner</option>
            <option value="SYSTEM_ADMIN">System Admin</option>
          </select>
        </div>
        
        <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '15px', marginTop: '6px' }}>Register</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '20px', color: textMuted, fontSize: '14px' }}>Already have an account? <Link to="/login" style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none' }}>Login</Link></p>
    </div>
  );
}