# 🐛 Troubleshooting Guide - Book a Ride Feature

## Common Issues & Solutions

### 1. 🗺️ Map Not Loading

**Symptom**: Blank gray area where map should be, or "Map container error"

**Possible Causes & Solutions**:

#### Solution 1: Check Leaflet CDN
```html
<!-- Verify these are in book-ride.html -->
<link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
```

#### Solution 2: Check Map Container
```html
<!-- Ensure this div exists -->
<div id="rideMap" style="height: 500px;"></div>
```

#### Solution 3: Internet Connection
- Leaflet CDN requires internet
- Check browser network tab for 404 errors
- Try different CDN URL: `https://cdn.jsdelivr.net/npm/leaflet@1.9.4`

#### Solution 4: Browser Console Check
```javascript
// In browser console, verify Leaflet is loaded
console.log(L);  // Should print Leaflet object, not undefined
```

---

### 2. 📍 Geolocation Not Working

**Symptom**: "Use My Current Location" button doesn't work or shows error

**Possible Causes & Solutions**:

#### Solution 1: HTTPS Requirement
- Geolocation requires HTTPS in production
- Works on localhost in development
- Enable via: `location.href = 'https://...'`

#### Solution 2: Browser Permission
**Chrome/Edge**:
1. Click lock icon in address bar
2. Find "Location" permission
3. Set to "Allow"

**Firefox**:
1. Click shield icon
2. Find location permission
3. Unmute or Allow

**Safari**:
1. Preferences > Privacy
2. Enable location services
3. Reload page

#### Solution 3: Browser Compatibility
| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | ✅ Yes |
| Firefox | 88+ | ✅ Yes |
| Safari | 14+ | ✅ Yes |
| Edge | 90+ | ✅ Yes |
| IE 11 | - | ❌ No |

#### Solution 4: Test Geolocation
```javascript
// In browser console
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    pos => console.log("Location:", pos.coords),
    err => console.error("Error:", err)
  );
} else {
  console.log("Geolocation not supported");
}
```

---

### 3. 🔍 Location Search Not Working

**Symptom**: Typing in location field doesn't show results or place marker

**Possible Causes & Solutions**:

#### Solution 1: Check Nominatim API
```javascript
// Test in console
fetch('https://nominatim.openstreetmap.org/search?format=json&q=Gulshan+Dhaka')
  .then(r => r.json())
  .then(d => console.log(d));
```

#### Solution 2: CORS Issues
- Nominatim should work, but check console for CORS errors
- Browser console → Network tab → check failed requests
- Fallback: Switch to different geocoding service if needed

#### Solution 3: Query Format
- Use spaces in location name: "Gulshan 2, Dhaka"
- Specify country: "Gulshan 2, Dhaka, Bangladesh"
- Try shorter names: "Airport" not "Hazrat Shahjalal International"

#### Solution 4: Debouncing
- Search is triggered on input change
- Wait 500ms after typing stops
- Check Network tab → XHR to see request sent

---

### 4. 🛣️ Route Not Displaying

**Symptom**: Both locations selected but no route line appears on map

**Possible Causes & Solutions**:

#### Solution 1: Check Leaflet Routing Machine
```html
<!-- Verify in book-ride.html -->
<link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine/dist/leaflet-routing-machine.css" />
<script src="https://unpkg.com/leaflet-routing-machine/dist/leaflet-routing-machine.js"></script>
```

#### Solution 2: Both Locations Set
```javascript
// In console, verify both locations exist
console.log("Pickup:", pickupLocation);
console.log("Destination:", destinationLocation);
// Both should have lat/lng properties
```

#### Solution 3: Valid Coordinates
- Latitude: -90 to +90
- Longitude: -180 to +180
- Within Dhaka: lat ~23.8, lng ~90.4

#### Solution 4: Network Request
- Check browser Network tab
- Look for requests to routing engines
- May timeout if route calculation takes too long

---

### 5. 💰 Available Rides Not Showing

**Symptom**: Available rides section stays empty even after selecting ride type

**Possible Causes & Solutions**:

#### Solution 1: Select Ride Type First
- Must select Bike, Car, or SUV
- Button should highlight in indigo
- Check console: `console.log(selectedRideType);`

#### Solution 2: Check Database
```sql
-- Verify drivers exist for vehicle type
SELECT COUNT(*) FROM vehicle WHERE vehicle_type = 'Car';
-- Should return > 0

-- Verify users are drivers
SELECT * FROM users WHERE UserType = 'Driver' LIMIT 5;
```

#### Solution 3: API Endpoint
```javascript
// Test in console
fetch('/api/available-rides?vehicleType=Car')
  .then(r => r.json())
  .then(d => console.log(d));
```

Expected response:
```json
{
  "success": true,
  "rides": [...]
}
```

#### Solution 4: Check Console for Errors
- Press F12 to open Developer Tools
- Click "Console" tab
- Look for red error messages
- Check "Network" tab for failed API calls (404, 500)

---

### 6. 📤 Booking Not Saving to Database

**Symptom**: "Ride requested successfully" message shows but data not in database

**Possible Causes & Solutions**:

#### Solution 1: Verify Migration Script
```bash
# Check if migration was run
mysql -u root -p safar
> DESCRIBE ride;
# Should show pickup_lat, pickup_lng, pickup_lat, dropoff_lng columns
```

#### Solution 2: Database Connection
```javascript
// Check backend can connect
// In server.js console should show "SQLite ready!"
// Check database config in apps/backend/config/db.js
```

#### Solution 3: API Response
```javascript
// Check what API returns
fetch('/api/ride', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    start: {lat: 23.8, lng: 90.4, location: "Test"},
    destination: {lat: 23.7, lng: 90.3, location: "Test2"},
    vehicle: "Car"
  })
})
.then(r => r.json())
.then(d => console.log("Response:", d));
```

#### Solution 4: Check Ride Table
```sql
SELECT * FROM ride ORDER BY start_time DESC LIMIT 1;
-- Should show most recent booking
```

If nothing shows:
- Check if columns were added: `ALTER TABLE ride ADD COLUMN pickup_lat DECIMAL(10, 8);`
- Check user_id is being passed correctly
- Check vehicle type exists in database

---

### 7. ❌ "No drivers available" Error

**Symptom**: Even though drivers exist, system says no drivers available

**Possible Causes & Solutions**:

#### Solution 1: Vehicle Type Mismatch
- Button shows "Car" but check database
- Vehicle types are case-sensitive
- DB expects: 'Bike', 'Car', 'SUV' (exact case)

```javascript
// In console, verify case
console.log(selectedRideType); // Should match DB exactly
```

#### Solution 2: Driver-Vehicle Link
```sql
-- Verify drivers have vehicles
SELECT u.name, u.UserType, v.vehicle_type
FROM users u
JOIN vehicle v ON u.user_id = v.driver_id
WHERE u.UserType = 'Driver';
-- Should return at least one row for each type
```

#### Solution 3: Test API Directly
```bash
curl "http://localhost:5000/api/available-rides?vehicleType=Car"
```

Should return riders, not empty array.

---

### 8. 🚫 Authentication Error "You are not logged in"

**Symptom**: Cannot book ride, error says not logged in

**Possible Causes & Solutions**:

#### Solution 1: Check localStorage
```javascript
// In console
localStorage.getItem('safarUser');
// Should return user object, not null
```

#### Solution 2: Login First
- Go to `/src/login.html`
- Login with valid credentials
- Check role is 'Rider' or 'rider'

#### Solution 3: User ID in Request
```javascript
// Check booking data includes userId
const bookingData = {
  userId: 1, // Must be set from localStorage
  // ... other fields
};
```

#### Solution 4: Session Check
```javascript
// Verify localStorage format
{
  "user_id": 1,  // or "id"
  "name": "John",
  "email": "john@example.com",
  "UserType": "Rider"
}
```

---

### 9. 📱 Mobile Display Issues

**Symptom**: Layout broken on mobile, buttons not clickable, map too large/small

**Possible Causes & Solutions**:

#### Solution 1: Viewport Meta Tag
```html
<!-- Check if present in book-ride.html -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

#### Solution 2: CSS Media Queries
```css
/* Mobile view should work */
@media (max-width: 768px) {
  .booking-grid {
    grid-template-columns: 1fr;
  }
}
```

#### Solution 3: Map Height
```css
#rideMap {
  height: 500px; /* May be too tall on mobile */
  /* Set mobile height in media query */
}

@media (max-width: 768px) {
  #rideMap {
    height: 300px;
  }
}
```

#### Solution 4: Touch Events
- Map click-to-place should work on touch
- If not responsive to taps, check for pointer vs click events

---

### 10. 🔌 API Endpoint Not Found (404)

**Symptom**: Network error, 404 Not Found when calling `/api/ride`

**Possible Causes & Solutions**:

#### Solution 1: Server Mount Point
```javascript
// Check apps/backend/server.js
// Should have:
app.use('/api', require('./routes/rideRoutes'));

// NOT:
app.use('/api/rides', require('./routes/rideRoutes'));
```

#### Solution 2: Route Definitions
```javascript
// Check apps/backend/routes/rideRoutes.js
// Should be:
router.post('/ride', requestRide);

// NOT:
router.post('/api/ride', requestRide);
```

#### Solution 3: Server Running
```bash
# Verify backend is running
curl http://localhost:5000/
# Should return JSON response
```

#### Solution 4: Test Each Endpoint
```bash
# Test available-rides
curl "http://localhost:5000/api/available-rides?vehicleType=Car"

# Test ride creation
curl -X POST http://localhost:5000/api/ride \
  -H "Content-Type: application/json" \
  -d '{"start":{"lat":23.8,"lng":90.4},"destination":{"lat":23.7,"lng":90.3},"vehicle":"Car"}'
```

---

### 11. 💥 Browser Console Errors

**Symptom**: Red errors in console, page not working properly

**Common Error Messages**:

#### "Cannot read property 'setView' of undefined"
- Map is not initialized
- Check `initMap()` function call
- Verify `<div id="rideMap">` exists

#### "Leaflet is not defined" / "L is undefined"
- Leaflet script not loaded
- Check CDN links
- Wait for page to fully load before initializing

#### "Cannot find module 'db'"
- Backend config/db.js not found
- Check file path in require statement
- Verify database configuration is correct

#### "CORS error"
- Frontend and backend on different origins
- Check server has `cors()` middleware enabled
- For localhost, usually not an issue

---

## Quick Diagnostic Checklist

Use this to systematically identify issues:

- [ ] Browser console open (F12)
- [ ] No red errors showing
- [ ] Backend server running (http://localhost:5000 responds)
- [ ] Frontend server running (http://localhost:8000 loads page)
- [ ] User logged in (localStorage has user data)
- [ ] Map loads and displays correctly
- [ ] Can click map to place markers
- [ ] Nominatim API responds to search
- [ ] Route displays between two points
- [ ] Database migration script run
- [ ] Ride table has coordinate columns
- [ ] Available drivers exist in database

---

## Testing Commands

### Backend Endpoint Tests
```bash
# Test available rides
curl "http://localhost:5000/api/available-rides?vehicleType=Car" -v

# Test ride creation
curl -X POST http://localhost:5000/api/ride \
  -H "Content-Type: application/json" \
  -d '{
    "start": {"lat": 23.8103, "lng": 90.4125},
    "destination": {"lat": 23.7808, "lng": 90.3617},
    "vehicle": "Car"
  }' -v

# Test get ride details
curl "http://localhost:5000/api/ride/1" -v

# Test cancel ride
curl -X DELETE http://localhost:5000/api/ride/1 \
  -H "Content-Type: application/json" \
  -d '{"userId": 1}' -v
```

### Database Checks
```sql
-- Check migration applied
DESCRIBE ride;

-- Check drivers exist
SELECT * FROM users WHERE UserType = 'Driver';

-- Check vehicles exist
SELECT * FROM vehicle;

-- Check recent rides
SELECT * FROM ride ORDER BY start_time DESC LIMIT 5;

-- Check coordinates stored
SELECT ride_id, pickup_lat, pickup_lng, dropoff_lat, dropoff_lng 
FROM ride WHERE ride_id = 1;
```

---

## Getting Help

1. **Check documentation**: See BOOK_A_RIDE_FEATURE.md
2. **Check screenshots of working example**
3. **Test endpoints with curl/Postman**
4. **Review database schema**
5. **Check browser console for specific errors**
6. **Review network requests (Network tab)**

---

**Last Updated**: March 22, 2026
**Version**: 1.0
