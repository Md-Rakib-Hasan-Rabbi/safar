const db = require('../config/db');

exports.requestRide = async (req, res) => {
  try {
    const userId = req.session.userId; // or from JWT or token
    if (!userId) {
      return res.status(401).json({ message: 'You are not logged in.' });
    }

    const { start, destination, vehicle } = req.body;
    if (!start || !destination || !vehicle) {
      return res.status(400).json({ message: 'Missing ride data.' });
    }

    // Find a driver with the matching vehicle type
    const [rows] = await db.execute(
      `SELECT vehicle_id FROM vehicle WHERE vehicle_type = ? LIMIT 1`,
      [vehicle]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No driver available for selected vehicle.' });
    }

    const vehicleId = rows[0].vehicle_id;

    await db.execute(
      `INSERT INTO rides (user_id, vehicle_id, start_lat, start_lng, dest_lat, dest_lng)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        userId,
        vehicleId,
        start.lat,
        start.lng,
        destination.lat,
        destination.lng
      ]
    );

    res.status(201).json({ message: 'Ride requested successfully!' });
  } catch (error) {
    console.error('Ride request error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};