const db = require('../config/db');

const VEHICLE_BASE_FARE = {
  Bike: 99,
  Car: 149,
  SUV: 199,
};

// Request a ride
exports.requestRide = async (req, res) => {
  try {
    const userId = req.session?.userId || req.body.userId;
    if (!userId) {
      return res.status(401).json({ message: 'You are not logged in.' });
    }

    const { start, destination, vehicle, driverId } = req.body;
    if (!start || !destination || !vehicle) {
      return res.status(400).json({ message: 'Missing ride data.' });
    }

    let selectedDriverId = Number(driverId) || null;

    if (selectedDriverId) {
      const [driverRows] = await db.execute(
        `SELECT u.user_id
         FROM users u
         JOIN vehicle v ON v.driver_id = u.user_id
         WHERE u.user_id = ? AND u.UserType = 'Driver' AND v.vehicle_type = ?
         LIMIT 1`,
        [selectedDriverId, vehicle]
      );

      if (driverRows.length === 0) {
        return res.status(404).json({ message: 'Selected driver is not available for this vehicle type.' });
      }
    } else {
      const [vehicleRows] = await db.execute(
        `SELECT driver_id FROM vehicle WHERE vehicle_type = ? LIMIT 1`,
        [vehicle]
      );

      if (vehicleRows.length === 0) {
        return res.status(404).json({ message: 'No driver available for selected vehicle.' });
      }

      selectedDriverId = vehicleRows[0].driver_id;
    }

    const pickupName = start.location || `${start.lat.toFixed(6)}, ${start.lng.toFixed(6)}`;
    const destinationName = destination.location || `${destination.lat.toFixed(6)}, ${destination.lng.toFixed(6)}`;
    const fare = Number(req.body.fare) || VEHICLE_BASE_FARE[vehicle] || 149;

    // Insert ride with coordinates + status for driver approval workflow
    const [result] = await db.execute(
      `INSERT INTO ride (rider_id, driver_id, pickup_location, dropoff_location, 
       pickup_lat, pickup_lng, dropoff_lat, dropoff_lng, status, fare, requested_at, start_time)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Requested', ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [
        userId,
        selectedDriverId,
        pickupName,
        destinationName,
        start.lat,
        start.lng,
        destination.lat,
        destination.lng,
        fare,
      ]
    );

    res.status(201).json({ 
      message: 'Ride requested successfully!',
      rideId: result.insertId,
      status: 'Requested',
      driverId: selectedDriverId,
    });
  } catch (error) {
    console.error('Ride request error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get available rides
exports.getAvailableRides = async (req, res) => {
  try {
    const { vehicleType } = req.query;

    if (!vehicleType) {
      return res.status(400).json({ message: 'Vehicle type is required.' });
    }

    // Get available drivers with the specified vehicle type
    const [drivers] = await db.execute(
      `SELECT u.user_id, u.name, u.gender, v.model, v.vehicle_type
       FROM users u
       JOIN vehicle v ON u.user_id = v.driver_id
       WHERE v.vehicle_type = ? AND u.UserType = 'Driver'
       LIMIT 5`,
      [vehicleType]
    );

    res.status(200).json({
      success: true,
      rides: drivers.map((driver, index) => ({
        driverId: driver.user_id,
        driverName: driver.name,
        vehicle: `${driver.vehicle_type} - ${driver.model}`,
        gender: driver.gender,
        rating: 4.5 + Math.random() * 0.5, // Mock rating
        eta: Math.floor(Math.random() * 10) + 3,
        fare: driver.vehicle_type === 'Bike' ? 99 : driver.vehicle_type === 'SUV' ? 199 : 149
      }))
    });
  } catch (error) {
    console.error('Get available rides error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get ride details
exports.getRideDetails = async (req, res) => {
  try {
    const { rideId } = req.params;

    const [rides] = await db.execute(
      `SELECT * FROM ride WHERE ride_id = ?`,
      [rideId]
    );

    if (rides.length === 0) {
      return res.status(404).json({ message: 'Ride not found.' });
    }

    res.status(200).json({
      success: true,
      ride: rides[0]
    });
  } catch (error) {
    console.error('Get ride details error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get pending ride requests for a driver
exports.getDriverRequests = async (req, res) => {
  try {
    const driverId = Number(req.query.driverId || req.session?.userId);

    if (!driverId) {
      return res.status(400).json({ message: 'driverId is required.' });
    }

    const [requests] = await db.execute(
      `SELECT r.ride_id, r.pickup_location, r.dropoff_location, r.fare, r.status,
              r.requested_at, r.pickup_lat, r.pickup_lng, r.dropoff_lat, r.dropoff_lng,
              u.user_id AS rider_id, u.name AS rider_name
       FROM ride r
       JOIN users u ON u.user_id = r.rider_id
       WHERE r.driver_id = ? AND r.status = 'Requested'
       ORDER BY r.requested_at DESC`,
      [driverId]
    );

    res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error('Get driver requests error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Driver accept/reject ride request
exports.updateRideStatus = async (req, res) => {
  try {
    const { rideId } = req.params;
    const driverId = Number(req.body.driverId || req.session?.userId);
    const { status } = req.body;

    if (!driverId) {
      return res.status(400).json({ message: 'driverId is required.' });
    }

    if (!['Accepted', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Use Accepted or Cancelled.' });
    }

    const [rides] = await db.execute(
      `SELECT ride_id, status FROM ride WHERE ride_id = ? AND driver_id = ?`,
      [rideId, driverId]
    );

    if (rides.length === 0) {
      return res.status(404).json({ message: 'Ride not found for this driver.' });
    }

    if (rides[0].status !== 'Requested') {
      return res.status(400).json({ message: `Ride already ${rides[0].status}.` });
    }

    if (status === 'Accepted') {
      await db.execute(
        `UPDATE ride
         SET status = 'Accepted', start_time = CURRENT_TIMESTAMP
         WHERE ride_id = ? AND driver_id = ?`,
        [rideId, driverId]
      );
    } else {
      await db.execute(
        `UPDATE ride
         SET status = 'Cancelled', end_time = CURRENT_TIMESTAMP
         WHERE ride_id = ? AND driver_id = ?`,
        [rideId, driverId]
      );
    }

    res.status(200).json({
      success: true,
      message: `Ride ${status.toLowerCase()} successfully.`,
      rideId: Number(rideId),
      status,
    });
  } catch (error) {
    console.error('Update ride status error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Cancel ride
exports.cancelRide = async (req, res) => {
  try {
    const { rideId } = req.params;
    const userId = req.session?.userId || req.body.userId;

    // Check if ride exists and belongs to user
    const [rides] = await db.execute(
      `SELECT * FROM ride WHERE ride_id = ? AND rider_id = ?`,
      [rideId, userId]
    );

    if (rides.length === 0) {
      return res.status(404).json({ message: 'Ride not found or unauthorized.' });
    }

    await db.execute(
      `UPDATE ride SET status = 'Cancelled', end_time = CURRENT_TIMESTAMP WHERE ride_id = ?`,
      [rideId]
    );

    res.status(200).json({ message: 'Ride cancelled successfully.' });
  } catch (error) {
    console.error('Cancel ride error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};