const express = require('express');
const router = express.Router();
const {
	requestRide,
	getAvailableRides,
	getRideDetails,
	getDriverRequests,
	updateRideStatus,
	cancelRide,
} = require('../controllers/rideController');

// Book a ride
router.post('/ride', requestRide);

// Get available rides
router.get('/available-rides', getAvailableRides);

// Get ride details
router.get('/ride/:rideId', getRideDetails);

// Get pending requests for driver
router.get('/driver/requests', getDriverRequests);

// Driver accept/reject request
router.patch('/ride/:rideId/status', updateRideStatus);

// Cancel ride
router.delete('/ride/:rideId', cancelRide);

module.exports = router;