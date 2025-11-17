const express = require('express');
const router = express.Router();
const { requestRide } = require('../controllers/rideController');

router.post('/api/ride', requestRide);

module.exports = router;