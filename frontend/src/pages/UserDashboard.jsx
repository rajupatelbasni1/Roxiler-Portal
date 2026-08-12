import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function UserDashboard({ darkMode }) {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [ratings, setRatings] = useState({}); // store_id -> rating value
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchStores();
  }, [search, token, navigate]);

  const fetchStores = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/stores?search=${search}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStores(res.data.data);
    } catch (err) {
      console.error("Error fetching stores", err);
    }
  };

  const handleRatingSubmit = async (store_id) => {
    const ratingValue = ratings[store_id];
    if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
      alert("Please select a rating between 1 and 5.");
      return;
    }

    try {
      const res = await axios.post('http://localhost:3000/api/ratings', {
        store_id,
        rating: parseInt(ratingValue)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMessage(res.data.message);
      fetchStores(); // List refresh hogi taaki overall aur user rating update ho jaye
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit rating');
    }
  };

  // Theme Styling
  const bgCard = darkMode ? '#1e293b' : '#ffffff';
  const textMain = darkMode ? '#f8fafc' : '#0f172a';
  const textMuted = darkMode ? '#94a3b8' : '#64748b';
  const borderCol = darkMode ? '#334155' : '#e2e8f0';
  const inputBg = darkMode ? '#0f172a' : '#f8fafc';

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '40px', color: textMain }}>
      
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '26px', fontWeight: 'bold' }}>Normal User Dashboard</h2>
        <p style={{ color: textMuted, fontSize: '14px' }}>Explore registered stores, submit new ratings, or modify your existing ratings.</p>
      </div>

      {message && (
        <div style={{ padding: '12px 16px', background: '#dcfce7', color: '#166534', borderRadius: '8px', marginBottom: '20px', fontWeight: '600' }}>
          {message}
        </div>
      )}

      {/* Search Bar */}
      <div style={{ marginBottom: '24px' }}>
        <input 
          type="text" 
          placeholder="Search stores by name or address..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          style={{ width: '100%', padding: '14px', borderRadius: '8px', border: `1px solid ${borderCol}`, background: inputBg, color: textMain, outline: 'none', fontSize: '15px' }} 
        />
      </div>

      {/* Stores List */}
      <div style={{ display: 'grid', gap: '20px' }}>
        {stores.length === 0 ? (
          <p style={{ color: textMuted, textAlign: 'center', padding: '20px' }}>No stores found.</p>
        ) : (
          stores.map((store) => (
            <div key={store.store_id} style={{ padding: '20px 24px', backgroundColor: bgCard, borderRadius: '12px', border: `1px solid ${borderCol}`, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '6px' }}>{store.name}</h3>
                <p style={{ color: textMuted, fontSize: '14px', marginBottom: '4px' }}><strong>Address:</strong> {store.address}</p>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#eab308', marginBottom: '4px' }}>Overall Rating: ⭐ {store.overall_rating} / 5</p>
                {store.user_submitted_rating ? (
                  <p style={{ color: '#16a34a', fontSize: '13px', fontWeight: '500' }}>Your Submitted Rating: ⭐ {store.user_submitted_rating}</p>
                ) : (
                  <p style={{ color: textMuted, fontSize: '13px' }}>You haven't rated this store yet.</p>
                )}
              </div>

              {/* Rating Action */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <select 
                  value={ratings[store.store_id] || ''} 
                  onChange={(e) => setRatings({...ratings, [store.store_id]: e.target.value})}
                  style={{ padding: '10px', borderRadius: '6px', border: `1px solid ${borderCol}`, background: inputBg, color: textMain, outline: 'none' }}
                >
                  <option value="">Select Rate</option>
                  <option value="1">1 - Poor</option>
                  <option value="2">2 - Fair</option>
                  <option value="3">3 - Good</option>
                  <option value="4">4 - Very Good</option>
                  <option value="5">5 - Excellent</option>
                </select>
                <button 
                  onClick={() => handleRatingSubmit(store.store_id)}
                  style={{ padding: '10px 18px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
                >
                  {store.user_submitted_rating ? 'Modify' : 'Submit'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Password Update Component Included */}
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
      const res = await axios.put('http://localhost:3000/api/auth/update-password', passData, {
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
    <div style={{ marginTop: '35px', padding: '24px', background: bgCard, borderRadius: '12px', border: `1px solid ${borderCol}`, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
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