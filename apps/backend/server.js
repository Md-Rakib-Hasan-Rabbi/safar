require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());// <-- This is required for reading JSON from frontend
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
  res.status(204).end();
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

const frontendRoot = path.join(__dirname, '../frontend');
app.use(express.static(frontendRoot));

const frontendRoutes = {
  '/home': 'index.html',
  '/login': 'src/login.html',
  '/signup': 'src/signup.html',
  '/privacy': 'src/privacy.html',
  '/terms': 'src/termsNcondition.html',
  '/rider-dashboard': 'rider-dashboard.html',
  '/driver-dashboard': 'driver-dashboard.html',
  '/admin-dashboard': 'admin-dashboard.html',
};

Object.entries(frontendRoutes).forEach(([route, file]) => {
  app.get(route, (req, res) => {
    res.sendFile(path.join(frontendRoot, file));
  });
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
const rideRoutes = require('./routes/rideRoutes');

// ✅ Register the routes
app.use('/api', authRoutes); // <-- This makes /api/signup available
app.use('/api', rideRoutes); // <-- This makes /api/ride and /api/available-rides available

// Start Server
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
