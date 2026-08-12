import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard({ darkMode }) {
  const [stats, setStats] = useState({ total_users: 0, total_stores: 0, total_ratings: 0 });
  const [stores, setStores] = useState([]);
  const [users, setUsers] = useState([]);
  
  const [storeData, setStoreData] = useState({ name: '', email: '', address: '' });
  const [userData, setUserData] = useState({ name: '', email: '', password: '', address: '', role: 'NORMAL_USER' });
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  
  // Sorting state for tables
  const [storeSort, setStoreSort] = useState({ field: 'name', order: 'ASC' });
  const [userSort, setUserSort] = useState({ field: 'name', order: 'ASC' });

  const [message, setMessage] = useState('');
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetchStats();
    fetchStores();
    fetchUsers();
  }, [token, navigate, filters, storeSort, userSort]);

  const fetchStats = async () => {
    try {
      const res = await axios.get('https://roxiler-portal.onrender.com/api/admin/dashboard/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data.data);
    } catch (err) { console.error(err); }
  };

  const fetchStores = async () => {
    try {
      const res = await axios.get(`https://roxiler-portal.onrender.com/api/stores?search=${filters.name}&sortBy=${storeSort.field}&order=${storeSort.order}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStores(res.data.data);
    } catch (err) { console.error(err); }
  };

  const fetchUsers = async () => {
    try {
      const queryParams = new URLSearchParams({ ...filters, sortBy: userSort.field, order: userSort.order }).toString();
      const res = await axios.get(`https://roxiler-portal.onrender.com/api/admin/users?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data.data);
    } catch (err) { console.error(err); }
  };

  const handleStoreSort = (field) => {
    const order = storeSort.field === field && storeSort.order === 'ASC' ? 'DESC' : 'ASC';
    setStoreSort({ field, order });
  };

  const handleUserSort = (field) => {
    const order = userSort.field === field && userSort.order === 'ASC' ? 'DESC' : 'ASC';
    setUserSort({ field, order });
  };

  const handleAddStore = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://roxiler-portal.onrender.com/api/stores', storeData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(res.data.message);
      setStoreData({ name: '', email: '', address: '' });
      fetchStats(); fetchStores();
    } catch (err) { setMessage(err.response?.data?.error || 'Failed to add store'); }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://roxiler-portal.onrender.com/api/admin/users', userData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(res.data.message);
      setUserData({ name: '', email: '', password: '', address: '', role: 'NORMAL_USER' });
      fetchStats(); fetchUsers();
    } catch (err) { setMessage(err.response?.data?.error || 'Failed to add user'); }
  };

  const bgCard = darkMode ? '#1e293b' : '#ffffff';
  const textMain = darkMode ? '#f8fafc' : '#0f172a';
  const textMuted = darkMode ? '#94a3b8' : '#64748b';
  const borderCol = darkMode ? '#334155' : '#e2e8f0';
  const inputBg = darkMode ? '#0f172a' : '#f8fafc';

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '40px', color: textMain }}>
      
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold' }}>System Administrator Dashboard</h2>
        <p style={{ color: textMuted, fontSize: '14px' }}>Manage platform analytics, users, stores, and sorting options.</p>
      </div>

      {message && (
        <div style={{ padding: '12px 16px', background: '#dcfce7', color: '#166534', borderRadius: '8px', marginBottom: '20px', fontWeight: '600' }}>
          {message}
        </div>
      )}

      {/* Analytics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        <div style={{ background: bgCard, padding: '20px', borderRadius: '12px', border: `1px solid ${borderCol}` }}>
          <p style={{ color: textMuted, fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' }}>Total Users</p>
          <h3 style={{ fontSize: '32px', fontWeight: '800', color: '#2563eb', marginTop: '6px' }}>{stats.total_users}</h3>
        </div>
        <div style={{ background: bgCard, padding: '20px', borderRadius: '12px', border: `1px solid ${borderCol}` }}>
          <p style={{ color: textMuted, fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' }}>Total Stores</p>
          <h3 style={{ fontSize: '32px', fontWeight: '800', color: '#2563eb', marginTop: '6px' }}>{stats.total_stores}</h3>
        </div>
        <div style={{ background: bgCard, padding: '20px', borderRadius: '12px', border: `1px solid ${borderCol}` }}>
          <p style={{ color: textMuted, fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' }}>Total Ratings</p>
          <h3 style={{ fontSize: '32px', fontWeight: '800', color: '#2563eb', marginTop: '6px' }}>{stats.total_ratings}</h3>
        </div>
      </div>

      {/* Forms Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px', marginBottom: '28px' }}>
        <div style={{ background: bgCard, padding: '24px', borderRadius: '12px', border: `1px solid ${borderCol}` }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', borderBottom: `1px solid ${borderCol}`, paddingBottom: '10px' }}>Add New Store</h3>
          <form onSubmit={handleAddStore} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input type="text" placeholder="Store Name" required value={storeData.name} onChange={(e) => setStoreData({...storeData, name: e.target.value})} style={{ padding: '12px', background: inputBg, border: `1px solid ${borderCol}`, color: textMain, borderRadius: '8px', outline: 'none' }} />
            <input type="email" placeholder="Store Email" required value={storeData.email} onChange={(e) => setStoreData({...storeData, email: e.target.value})} style={{ padding: '12px', background: inputBg, border: `1px solid ${borderCol}`, color: textMain, borderRadius: '8px', outline: 'none' }} />
            <input type="text" placeholder="Store Address" required value={storeData.address} onChange={(e) => setStoreData({...storeData, address: e.target.value})} style={{ padding: '12px', background: inputBg, border: `1px solid ${borderCol}`, color: textMain, borderRadius: '8px', outline: 'none' }} />
            <button type="submit" style={{ padding: '12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', marginTop: '4px' }}>Add Store</button>
          </form>
        </div>

        <div style={{ background: bgCard, padding: '24px', borderRadius: '12px', border: `1px solid ${borderCol}` }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', borderBottom: `1px solid ${borderCol}`, paddingBottom: '10px' }}>Add New User</h3>
          <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input type="text" placeholder="Name (20-60 chars)" required value={userData.name} onChange={(e) => setUserData({...userData, name: e.target.value})} style={{ padding: '12px', background: inputBg, border: `1px solid ${borderCol}`, color: textMain, borderRadius: '8px', outline: 'none' }} />
            <input type="email" placeholder="Email" required value={userData.email} onChange={(e) => setUserData({...userData, email: e.target.value})} style={{ padding: '12px', background: inputBg, border: `1px solid ${borderCol}`, color: textMain, borderRadius: '8px', outline: 'none' }} />
            <input type="password" placeholder="Password (8-16 chars, 1 Upper, 1 Special)" required value={userData.password} onChange={(e) => setUserData({...userData, password: e.target.value})} style={{ padding: '12px', background: inputBg, border: `1px solid ${borderCol}`, color: textMain, borderRadius: '8px', outline: 'none' }} />
            <input type="text" placeholder="Address" required value={userData.address} onChange={(e) => setUserData({...userData, address: e.target.value})} style={{ padding: '12px', background: inputBg, border: `1px solid ${borderCol}`, color: textMain, borderRadius: '8px', outline: 'none' }} />
            <select value={userData.role} onChange={(e) => setUserData({...userData, role: e.target.value})} style={{ padding: '12px', background: inputBg, border: `1px solid ${borderCol}`, color: textMain, borderRadius: '8px', outline: 'none' }}>
              <option value="NORMAL_USER">Normal User</option>
              <option value="STORE_OWNER">Store Owner</option>
              <option value="SYSTEM_ADMIN">System Admin</option>
            </select>
            <button type="submit" style={{ padding: '12px', background: '#16a34a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Add User</button>
          </form>
        </div>
      </div>

      {/* Filters Section */}
      <div style={{ background: bgCard, padding: '24px', borderRadius: '12px', border: `1px solid ${borderCol}`, marginBottom: '28px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Filter Listings</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          <input type="text" placeholder="Filter by Name" value={filters.name} onChange={(e) => setFilters({...filters, name: e.target.value})} style={{ padding: '10px', background: inputBg, border: `1px solid ${borderCol}`, color: textMain, borderRadius: '8px' }} />
          <input type="text" placeholder="Filter by Email" value={filters.email} onChange={(e) => setFilters({...filters, email: e.target.value})} style={{ padding: '10px', background: inputBg, border: `1px solid ${borderCol}`, color: textMain, borderRadius: '8px' }} />
          <input type="text" placeholder="Filter by Address" value={filters.address} onChange={(e) => setFilters({...filters, address: e.target.value})} style={{ padding: '10px', background: inputBg, border: `1px solid ${borderCol}`, color: textMain, borderRadius: '8px' }} />
          <select value={filters.role} onChange={(e) => setFilters({...filters, role: e.target.value})} style={{ padding: '10px', background: inputBg, border: `1px solid ${borderCol}`, color: textMain, borderRadius: '8px' }}>
            <option value="">All Roles</option>
            <option value="NORMAL_USER">Normal User</option>
            <option value="STORE_OWNER">Store Owner</option>
            <option value="SYSTEM_ADMIN">System Admin</option>
          </select>
        </div>
      </div>

      {/* Stores Directory Table (with Sorting) */}
      <div style={{ background: bgCard, borderRadius: '12px', border: `1px solid ${borderCol}`, marginBottom: '28px', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${borderCol}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Registered Stores Listing</h3>
          <span style={{ fontSize: '13px', color: textMuted }}>Click headers to sort ascending/descending</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: darkMode ? '#0f172a' : '#f8fafc', color: textMuted }}>
                <th onClick={() => handleStoreSort('name')} style={{ padding: '14px 24px', cursor: 'pointer', userSelect: 'none' }}>
                  Store Name {storeSort.field === 'name' ? (storeSort.order === 'ASC' ? '🔼' : '🔽') : ''}
                </th>
                <th onClick={() => handleStoreSort('email')} style={{ padding: '14px 24px', cursor: 'pointer', userSelect: 'none' }}>
                  Email {storeSort.field === 'email' ? (storeSort.order === 'ASC' ? '🔼' : '🔽') : ''}
                </th>
                <th onClick={() => handleStoreSort('address')} style={{ padding: '14px 24px', cursor: 'pointer', userSelect: 'none' }}>
                  Address {storeSort.field === 'address' ? (storeSort.order === 'ASC' ? '🔼' : '🔽') : ''}
                </th>
                <th onClick={() => handleStoreSort('overall_rating')} style={{ padding: '14px 24px', cursor: 'pointer', userSelect: 'none' }}>
                  Overall Rating {storeSort.field === 'overall_rating' ? (storeSort.order === 'ASC' ? '🔼' : '🔽') : ''}
                </th>
              </tr>
            </thead>
            <tbody>
              {stores.map(store => (
                <tr key={store.store_id} style={{ borderTop: `1px solid ${borderCol}` }}>
                  <td style={{ padding: '14px 24px', fontWeight: '500' }}>{store.name}</td>
                  <td style={{ padding: '14px 24px', color: textMuted }}>{store.email}</td>
                  <td style={{ padding: '14px 24px', color: textMuted }}>{store.address}</td>
                  <td style={{ padding: '14px 24px', fontWeight: 'bold', color: '#eab308' }}>⭐ {store.overall_rating} / 5</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Users Directory Table (with Sorting) */}
      <div style={{ background: bgCard, borderRadius: '12px', border: `1px solid ${borderCol}`, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${borderCol}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Users Directory</h3>
          <span style={{ fontSize: '13px', color: textMuted }}>Click headers to sort ascending/descending</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: darkMode ? '#0f172a' : '#f8fafc', color: textMuted }}>
                <th onClick={() => handleUserSort('name')} style={{ padding: '14px 24px', cursor: 'pointer', userSelect: 'none' }}>
                  Name {userSort.field === 'name' ? (userSort.order === 'ASC' ? '🔼' : '🔽') : ''}
                </th>
                <th onClick={() => handleUserSort('email')} style={{ padding: '14px 24px', cursor: 'pointer', userSelect: 'none' }}>
                  Email {userSort.field === 'email' ? (userSort.order === 'ASC' ? '🔼' : '🔽') : ''}
                </th>
                <th onClick={() => handleUserSort('address')} style={{ padding: '14px 24px', cursor: 'pointer', userSelect: 'none' }}>
                  Address {userSort.field === 'address' ? (userSort.order === 'ASC' ? '🔼' : '🔽') : ''}
                </th>
                <th onClick={() => handleUserSort('role')} style={{ padding: '14px 24px', cursor: 'pointer', userSelect: 'none' }}>
                  Role {userSort.field === 'role' ? (userSort.order === 'ASC' ? '🔼' : '🔽') : ''}
                </th>
                <th style={{ padding: '14px 24px' }}>Owner Rating</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderTop: `1px solid ${borderCol}` }}>
                  <td style={{ padding: '14px 24px', fontWeight: '500' }}>{u.name}</td>
                  <td style={{ padding: '14px 24px', color: textMuted }}>{u.email}</td>
                  <td style={{ padding: '14px 24px', color: textMuted }}>{u.address}</td>
                  <td style={{ padding: '14px 24px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', background: '#dbeafe', color: '#1e40af' }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '14px 24px', fontWeight: '600' }}>
                    {u.role === 'STORE_OWNER' ? `⭐ ${u.owner_rating} / 5` : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}