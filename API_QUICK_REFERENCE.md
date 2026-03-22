# Book a Ride API - Quick Reference

## API Overview
All endpoints are prefixed with `http://localhost:5000/api` (or your production URL)

## Endpoints

### 1️⃣ Request a Ride
**POST** `/ride`

**When to use**: Rider clicks "Request Ride" button after selecting locations and ride type

**Request Body**:
```json
{
  "userId": 1,
  "start": {
    "lat": 23.8103,
    "lng": 90.4125,
    "location": "Gulshan 2, Dhaka"
  },
  "destination": {
    "lat": 23.7808,
    "lng": 90.3617,
    "location": "Hazrat Shahjalal International Airport"
  },
  "vehicle": "Car"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:5000/api/ride \
  -H "Content-Type: application/json" \
  -d '{
    "start": {"lat": 23.8103, "lng": 90.4125, "location": "Gulshan 2"},
    "destination": {"lat": 23.7808, "lng": 90.3617, "location": "Airport"},
    "vehicle": "Car"
  }'
```

**Success Response (201)**:
```json
{
  "message": "Ride requested successfully!",
  "rideId": 42
}
```

**Error Response (400)**:
```json
{
  "message": "Missing ride data."
}
```

**Error Response (401)**:
```json
{
  "message": "You are not logged in."
}
```

**Error Response (404)**:
```json
{
  "message": "No driver available for selected vehicle."
}
```

---

### 2️⃣ Get Available Rides
**GET** `/available-rides?vehicleType=Car`

**When to use**: After rider selects pickup and destination to show available drivers

**Query Parameters**:
| Parameter | Type | Required | Values |
|-----------|------|----------|--------|
| vehicleType | string | ✅ Yes | `Bike`, `Car`, `SUV` |

**cURL Example**:
```bash
curl -X GET "http://localhost:5000/api/available-rides?vehicleType=Car" \
  -H "Content-Type: application/json"
```

**JavaScript Fetch Example**:
```javascript
const vehicleType = 'Car';
fetch(`/api/available-rides?vehicleType=${vehicleType}`)
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      console.log('Available rides:', data.rides);
      // Display rides in UI
    }
  });
```

**Success Response (200)**:
```json
{
  "success": true,
  "rides": [
    {
      "driverId": 2,
      "driverName": "Ahmed Khan",
      "vehicle": "Car - Toyota Axio",
      "rating": 4.9,
      "eta": 5,
      "fare": 150
    },
    {
      "driverId": 4,
      "driverName": "Sajid Rahman",
      "vehicle": "Car - Honda Civic",
      "rating": 4.8,
      "eta": 7,
      "fare": 145
    }
  ]
}
```

**Error Response (400)**:
```json
{
  "message": "Vehicle type is required."
}
```

---

### 3️⃣ Get Ride Details
**GET** `/ride/:rideId`

**When to use**: Check status of a booked ride, or get ride information

**URL Parameters**:
| Parameter | Type | Required | Example |
|-----------|------|----------|---------|
| rideId | number | ✅ Yes | `42` |

**cURL Example**:
```bash
curl -X GET "http://localhost:5000/api/ride/42" \
  -H "Content-Type: application/json"
```

**Success Response (200)**:
```json
{
  "success": true,
  "ride": {
    "ride_id": 42,
    "rider_id": 1,
    "driver_id": 2,
    "pickup_location": "Gulshan 2, Dhaka",
    "dropoff_location": "Hazrat Shahjalal International Airport",
    "pickup_lat": 23.8103,
    "pickup_lng": 90.4125,
    "dropoff_lat": 23.7808,
    "dropoff_lng": 90.3617,
    "vehicle_id": 1,
    "status": "Requested",
    "start_time": "2026-03-22 10:30:00",
    "end_time": null,
    "fare": 150.00
  }
}
```

**Error Response (404)**:
```json
{
  "message": "Ride not found."
}
```

---

### 4️⃣ Cancel a Ride
**DELETE** `/ride/:rideId`

**When to use**: Rider wants to cancel their booked ride

**URL Parameters**:
| Parameter | Type | Required | Example |
|-----------|------|----------|---------|
| rideId | number | ✅ Yes | `42` |

**Request Body**:
```json
{
  "userId": 1
}
```

**cURL Example**:
```bash
curl -X DELETE http://localhost:5000/api/ride/42 \
  -H "Content-Type: application/json" \
  -d '{"userId": 1}'
```

**Success Response (200)**:
```json
{
  "message": "Ride cancelled successfully."
}
```

**Error Response (404)**:
```json
{
  "message": "Ride not found or unauthorized."
}
```

---

## Common Workflows

### Workflow 1: Complete Ride Booking
```
1. GET /available-rides?vehicleType=Car
   ├─ Get list of available drivers
   
2. POST /ride
   ├─ Request selected ride
   ├─ Returns rideId
   
3. GET /ride/:rideId
   ├─ Check ride status
   ├─ Monitor updates
```

### Workflow 2: Cancel Ride
```
1. GET /ride/:rideId
   ├─ Verify ride exists
   
2. DELETE /ride/:rideId
   ├─ Cancel the ride
   ├─ Update status to 'Cancelled'
```

## Status Values
- `Requested`: Waiting for driver acceptance
- `Accepted`: Driver has accepted the ride
- `In Transit`: Ride is in progress
- `Completed`: Ride finished successfully
- `Cancelled`: Ride was cancelled

## Vehicle Types
- `Bike`: Motorcycle/Scooter (1 seat, cheapest)
- `Car`: Standard sedan (4 seats, medium price)
- `SUV`: Large vehicle (7+ seats, premium price)

## Error Codes

| Code | Status | Meaning |
|------|--------|---------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | User not authenticated |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Internal server error |

## Response Format

All responses follow this format:

**Success**:
```json
{
  "success": true,
  "message": "...",
  "data": { ... }
}
```

**Error**:
```json
{
  "success": false,
  "message": "Error description"
}
```

## Rate Limiting (Recommended)
- 10 ride requests per user per hour
- 50 available-ride queries per user per minute
- 100 get-details requests per user per minute

## Testing the APIs

### Using Postman
1. Import collection or create requests manually
2. Set base URL: `http://localhost:5000/api`
3. Select method (POST, GET, DELETE)
4. Enter endpoint path
5. Add headers: `Content-Type: application/json`
6. Add request body (for POST/DELETE)
7. Click "Send"

### Using cURL
See examples above for each endpoint

### Using JavaScript (Fetch API)
```javascript
// Request a ride
const requestRide = async (pickupLat, pickupLng, destLat, destLng, vehicle) => {
  try {
    const response = await fetch('/api/ride', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        start: { lat: pickupLat, lng: pickupLng },
        destination: { lat: destLat, lng: destLng },
        vehicle: vehicle
      })
    });
    
    const data = await response.json();
    if (response.ok) {
      console.log('Ride requested:', data.rideId);
    } else {
      console.error('Error:', data.message);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
};

// Get available rides
const getAvailableRides = async (vehicleType) => {
  try {
    const response = await fetch(`/api/available-rides?vehicleType=${vehicleType}`);
    const data = await response.json();
    
    if (data.success) {
      return data.rides;
    } else {
      console.error('Error:', data.message);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
};

// Cancel ride
const cancelRide = async (rideId, userId) => {
  try {
    const response = await fetch(`/api/ride/${rideId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: userId })
    });
    
    const data = await response.json();
    console.log(data.message);
  } catch (error) {
    console.error('Request failed:', error);
  }
};
```

## Database Queries (Reference)

### Check ride booking
```sql
SELECT * FROM ride 
WHERE rider_id = 1 
ORDER BY start_time DESC 
LIMIT 1;
```

### Get available drivers for a vehicle type
```sql
SELECT u.user_id, u.name, v.vehicle_type, v.model
FROM users u
JOIN vehicle v ON u.user_id = v.driver_id
WHERE v.vehicle_type = 'Car'
AND u.UserType = 'Driver'
LIMIT 5;
```

### Calculate distance with coordinates
```sql
SELECT ride_id,
  SQRT(POW(pickup_lat - dropoff_lat, 2) + POW(pickup_lng - dropoff_lng, 2)) * 111 as distance_km
FROM ride
WHERE ride_id = 42;
```

---

**Last Updated**: March 22, 2026
**API Version**: 1.0
**Endpoint Base URL**: `/api`
