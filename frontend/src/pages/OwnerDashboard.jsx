import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function OwnerDashboard({ darkMode }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchOwnerDashboard();
  }, [token, navigate]);

  const fetchOwnerDashboard = async () => {
    try {
      const res = await axios.get('https://roxiler-portal.onrender.com/api/owner/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDashboardData(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch owner dashboard');
    }
  };

  const bgCard = darkMode ? '#1e293b' : '#ffffff';
  const textMain = darkMode ? '#f8fafc' : '#0f172a';
  const textMuted = darkMode ? '#94a3b8' : '#64748b';
  const borderCol = darkMode ? '#334155' : '#e2e8f0';
  const tableHeaderBg = darkMode ? '#0f172a' : '#f8fafc';

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '40px', color: textMain }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '26px', fontWeight: 'bold' }}>Store Owner Dashboard</h2>
        <p style={{ color: textMuted, fontSize: '14px' }}>Monitor your store's average rating and review feedback from customers.</p>
      </div>

      {error && (
        <div style={{ color: '#dc2626', background: '#fee2e2', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontWeight: '500' }}>
          {error}
        </div>
      )}
      
      {!dashboardData ? (
        <p style={{ color: textMuted, textAlign: 'center', padding: '30px' }}>Loading dashboard...</p>
      ) : (
        <div>
          {/* Store Info & Average Rating */}
          <div style={{ padding: '24px', backgroundColor: bgCard, borderRadius: '12px', border: `1px solid ${borderCol}`, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: textMuted, textTransform: 'uppercase', marginBottom: '6px' }}>Store Name</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: textMain, marginBottom: '16px' }}>{dashboardData.store_info.name}</p>
            
            <div style={{ display: 'inline-block', padding: '10px 18px', background: darkMode ? '#0f172a' : '#f0fdf4', borderRadius: '8px', border: `1px solid ${darkMode ? '#334155' : '#bbf7d0'}` }}>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#16a34a' }}>
                Average Rating: ⭐ {dashboardData.store_info.average_rating} / 5
              </span>
            </div>
          </div>

          {/* Raters List Table */}
          <div style={{ backgroundColor: bgCard, borderRadius: '12px', border: `1px solid ${borderCol}`, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden', marginBottom: '35px' }}>
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${borderCol}` }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Users Who Rated Your Store</h3>
            </div>
            {dashboardData.raters.length === 0 ? (
              <p style={{ color: textMuted, textAlign: 'center', padding: '30px' }}>No ratings received yet.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ backgroundColor: tableHeaderBg, color: textMuted }}>
                      <th style={{ padding: '14px 24px', borderBottom: `1px solid ${borderCol}` }}>User Name</th>
                      <th style={{ padding: '14px 24px', borderBottom: `1px solid ${borderCol}` }}>Email</th>
                      <th style={{ padding: '14px 24px', borderBottom: `1px solid ${borderCol}` }}>Rating</th>
                      <th style={{ padding: '14px 24px', borderBottom: `1px solid ${borderCol}` }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.raters.map((rater, index) => (
                      <tr key={index} style={{ borderTop: `1px solid ${borderCol}` }}>
                        <td style={{ padding: '14px 24px', fontWeight: '500' }}>{rater.name}</td>
                        <td style={{ padding: '14px 24px', color: textMuted }}>{rater.email}</td>
                        <td style={{ padding: '14px 24px', fontWeight: 'bold', color: '#eab308' }}>⭐ {rater.rating}</td>
                        <td style={{ padding: '14px 24px', color: textMuted }}>{new Date(rater.rated_on).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Password Update Section */}
      <PasswordUpdateSection darkMode={darkMode} />
    </div>
  );
}

function PasswordUpdateSection({ darkMode }) {
  const [passData, setPassData] = useState({ oldPassword: '', newPassword: '' });
  const [msg, setMsg] = useState('');
  const token = localStorage.getItem('token');

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put('https://roxiler-portal.onrender.com/api/auth/update-password', passData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMsg(res.data.message);
      setPassData({ oldPassword: '', newPassword: '' });
    } catch (err) {
      setMsg(err.response?.data?.error || 'Failed to update password');
    }
  };

  const bgCard = darkMode ? '#1e293b' : '#ffffff';
  const textMain = darkMode ? '#f8fafc' : '#0f172a';
  const borderCol = darkMode ? '#334155' : '#e2e8f0';
  const inputBg = darkMode ? '#0f172a' : '#f8fafc';

  return (
    <div style={{ padding: '24px', background: bgCard, borderRadius: '12px', border: `1px solid ${borderCol}`, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '14px', color: textMain }}>Update Password</h4>
      {msg && <p style={{ color: msg.includes('success') ? '#16a34a' : '#dc2626', marginBottom: '12px', fontWeight: '500' }}>{msg}</p>}
      <form onSubmit={handlePasswordUpdate} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <input 
          type="password" 
          placeholder="Old Password" 
          required 
          value={passData.oldPassword} 
          onChange={(e) => setPassData({...passData, oldPassword: e.target.value})}
          style={{ padding: '12px', borderRadius: '8px', border: `1px solid ${borderCol}`, background: inputBg, color: textMain, flex: '1', minWidth: '220px', outline: 'none' }}
        />
        <input 
          type="password" 
          placeholder="New Password (8-16 chars, 1 Upper, 1 Special)" 
          required 
          value={passData.newPassword} 
          onChange={(e) => setPassData({...passData, newPassword: e.target.value})}
          style={{ padding: '12px', borderRadius: '8px', border: `1px solid ${borderCol}`, background: inputBg, color: textMain, flex: '1', minWidth: '280px', outline: 'none' }}
        />
        <button type="submit" style={{ padding: '12px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Update Password</button>
      </form>
    </div>
  );
}