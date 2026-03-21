require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());// <-- This is required for reading JSON from frontend
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Safar backend is running' });
});

app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
  res.status(204).end();
});

// Database Connection
(async () => {
  try {
    const connection = await db.getConnection();
    console.log('SQLite ready!');
    connection.release();
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
})();

// ✅ Import your route
const authRoutes = require('./routes/authroutes');

// ✅ Register the route
app.use('/api', authRoutes); // <-- This makes /api/signup available

// Your other routes
app.use('/api/rides', require('./routes/rideRoutes'));

// Start Server
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
