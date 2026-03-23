const db = require('../config/db');

const VEHICLE_BASE_FARE = {
  Bike: 99,
  Car: 149,
  SUV: 199,
};

function calculateDistanceKm(lat1, lng1, lat2, lng2) {
  const toRadians = (value) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

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
    const fallbackRate = VEHICLE_BASE_FARE[vehicle] || 149;
    const requestDistanceKm = Number(req.body.distanceKm);
    const computedDistanceKm = calculateDistanceKm(start.lat, start.lng, destination.lat, destination.lng);
    const distanceKm = requestDistanceKm > 0 ? requestDistanceKm : computedDistanceKm;
    const billableDistanceKm = Math.max(distanceKm, 1);
    const fare = Math.round(fallbackRate * billableDistanceKm);

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
    const { vehicleType, distanceKm } = req.query;

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

    const parsedDistanceKm = Number(distanceKm);
    const billableDistanceKm = parsedDistanceKm > 0 ? Math.max(parsedDistanceKm, 1) : 1;
    const ratePerKm = VEHICLE_BASE_FARE[vehicleType] || 149;
    const calculatedFare = Math.round(ratePerKm * billableDistanceKm);

    res.status(200).json({
      success: true,
      rides: drivers.map((driver, index) => ({
        driverId: driver.user_id,
        driverName: driver.name,
        vehicle: `${driver.vehicle_type} - ${driver.model}`,
        gender: driver.gender,
        rating: 4.5 + Math.random() * 0.5, // Mock rating
        eta: Math.floor(Math.random() * 10) + 3,
        fare: calculatedFare
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
    const riderId = Number(req.body.riderId || req.session?.userId);
    const actor = String(req.body.actor || '').toLowerCase();
    const { status } = req.body;

    if (!['Accepted', 'In Transit', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Use Accepted, In Transit, Completed or Cancelled.' });
    }

    const isRiderAction = actor === 'rider' || (!driverId && riderId && status === 'Completed');

    if (isRiderAction) {
      if (!riderId) {
        return res.status(400).json({ message: 'riderId is required.' });
      }

      if (status !== 'Completed') {
        return res.status(400).json({ message: 'Rider can only mark ride as Completed.' });
      }

      const [rides] = await db.execute(
        `SELECT ride_id, status FROM ride WHERE ride_id = ? AND rider_id = ?`,
        [rideId, riderId]
      );

      if (rides.length === 0) {
        return res.status(404).json({ message: 'Ride not found for this rider.' });
      }

      const currentStatus = rides[0].status;
      if (!['Accepted', 'In Transit'].includes(currentStatus)) {
        return res.status(400).json({ message: `Cannot change ride from ${currentStatus} to ${status}.` });
      }

      await db.execute(
        `UPDATE ride
         SET status = 'Completed', end_time = CURRENT_TIMESTAMP
         WHERE ride_id = ? AND rider_id = ?`,
        [rideId, riderId]
      );

      return res.status(200).json({
        success: true,
        message: 'Ride completed successfully.',
        rideId: Number(rideId),
        status,
      });
    }

    if (!driverId) {
      return res.status(400).json({ message: 'driverId is required.' });
    }

    const [rides] = await db.execute(
      `SELECT ride_id, status FROM ride WHERE ride_id = ? AND driver_id = ?`,
      [rideId, driverId]
    );

    if (rides.length === 0) {
      return res.status(404).json({ message: 'Ride not found for this driver.' });
    }

    const currentStatus = rides[0].status;

    const transitions = {
      Requested: ['Accepted', 'Cancelled'],
      Accepted: ['In Transit', 'Completed', 'Cancelled'],
      'In Transit': ['Completed', 'Cancelled'],
      Completed: [],
      Cancelled: [],
    };

    if (!transitions[currentStatus] || !transitions[currentStatus].includes(status)) {
      return res.status(400).json({ message: `Cannot change ride from ${currentStatus} to ${status}.` });
    }

    if (status === 'Accepted') {
      await db.execute(
        `UPDATE ride
         SET status = 'Accepted', start_time = COALESCE(start_time, CURRENT_TIMESTAMP)
         WHERE ride_id = ? AND driver_id = ?`,
        [rideId, driverId]
      );
    } else if (status === 'In Transit') {
      await db.execute(
        `UPDATE ride
         SET status = 'In Transit', start_time = COALESCE(start_time, CURRENT_TIMESTAMP)
         WHERE ride_id = ? AND driver_id = ?`,
        [rideId, driverId]
      );
    } else if (status === 'Completed') {
      await db.execute(
        `UPDATE ride
         SET status = 'Completed', end_time = CURRENT_TIMESTAMP
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

exports.getRiderHistorySummary = async (req, res) => {
  try {
    const riderId = Number(req.query.userId || req.session?.userId);

    if (!riderId) {
      return res.status(400).json({ message: 'userId is required.' });
    }

    const [rows] = await db.execute(
      `SELECT
         COUNT(*) AS total,
         SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) AS completed,
         SUM(CASE WHEN status = 'Cancelled' THEN 1 ELSE 0 END) AS rejected
       FROM ride
       WHERE rider_id = ?`,
      [riderId]
    );

    const summary = rows[0] || { total: 0, completed: 0, rejected: 0 };

    const [recentRides] = await db.execute(
      `SELECT ride_id, pickup_location, dropoff_location, fare, status, requested_at, end_time
       FROM ride
       WHERE rider_id = ?
       ORDER BY COALESCE(end_time, requested_at) DESC
       LIMIT 5`,
      [riderId]
    );

    res.status(200).json({
      success: true,
      summary: {
        total: Number(summary.total || 0),
        completed: Number(summary.completed || 0),
        rejected: Number(summary.rejected || 0),
      },
      recentRides,
    });
  } catch (error) {
    console.error('Get rider history summary error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getDriverHistorySummary = async (req, res) => {
  try {
    const driverId = Number(req.query.driverId || req.session?.userId);

    if (!driverId) {
      return res.status(400).json({ message: 'driverId is required.' });
    }

    const [rows] = await db.execute(
      `SELECT
         COUNT(*) AS total,
         SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) AS completed,
         SUM(CASE WHEN status = 'Cancelled' THEN 1 ELSE 0 END) AS rejected,
         SUM(CASE WHEN status = 'Completed' AND DATE(COALESCE(end_time, requested_at)) = DATE('now', 'localtime') THEN 1 ELSE 0 END) AS todayCompleted,
         SUM(CASE WHEN status = 'Completed' AND DATE(COALESCE(end_time, requested_at)) = DATE('now', 'localtime') THEN COALESCE(fare, 0) ELSE 0 END) AS todayEarnings
       FROM ride
       WHERE driver_id = ?`,
      [driverId]
    );

    const summary = rows[0] || { total: 0, completed: 0, rejected: 0 };

    const [recentRides] = await db.execute(
      `SELECT ride_id, pickup_location, dropoff_location, fare, status, requested_at, end_time
       FROM ride
       WHERE driver_id = ?
       ORDER BY COALESCE(end_time, requested_at) DESC
       LIMIT 5`,
      [driverId]
    );

    res.status(200).json({
      success: true,
      summary: {
        total: Number(summary.total || 0),
        completed: Number(summary.completed || 0),
        rejected: Number(summary.rejected || 0),
        todayCompleted: Number(summary.todayCompleted || 0),
        todayEarnings: Number(summary.todayEarnings || 0),
      },
      recentRides,
    });
  } catch (error) {
    console.error('Get driver history summary error:', error);
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