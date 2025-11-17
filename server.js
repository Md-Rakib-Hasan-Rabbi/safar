require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());// <-- This is required for reading JSON from frontend
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Database Connection
(async () => {
  try {
    const connection = await db.getConnection();
    console.log('MySQL Connected!');
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
