require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const db = require('./config/db'); 


const authRoutes = require('./routes/authRoutes');
const storeRoutes = require('./routes/storeRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const storeOwnerRoutes = require('./routes/storeOwnerRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); 
app.use(express.json());

// API Routes setup
app.use('/api/auth', authRoutes);
app.use('/api/stores', storeRoutes); 
app.use('/api/ratings', ratingRoutes);
app.use('/api/admin', adminRoutes); 
app.use('/api/owner', storeOwnerRoutes);

app.get('/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ success: true, time: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Database connection failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});