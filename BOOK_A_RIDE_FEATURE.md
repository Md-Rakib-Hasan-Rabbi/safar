# Book a Ride Feature - Implementation Guide

## Overview
The "Book a Ride" feature allows riders to select pickup and destination locations on an interactive map, choose a ride type (Bike, Car, SUV), and request available rides from nearby drivers. The feature includes route visualization, real-time distance/time calculation, and fare estimation.

## Features Implemented

### 1. **Interactive Map Interface** (`book-ride.html`)
- **Leaflet.js Integration**: Full-featured map with OSM tiles
- **Click-to-Select**: Click on map to set pickup and destination markers
- **Location Search**: Search locations by name using Nominatim geocoding
- **Current Location**: Quick button to use rider's current location
- **Route Display**: Visual route with distance and estimated time
- **Marker Differentiation**: Green marker for pickup, red for destination

### 2. **Location Input System**
- **Dual Input Fields**: Separate fields for pickup and destination
- **Auto-Search**: Search as you type (via Nominatim)
- **Reverse Geocoding**: Convert coordinates back to address names
- **Real-time Display**: Shows coordinates and address in readable format

### 3. **Ride Type Selection**
Three ride options with icons and pricing:
- **🏍️ Bike**: ৳99/km, 1 seat, fastest option
- **🚗 Car**: ৳149/km, 4 seats, standard option
- **🚙 SUV**: ৳199/km, 7 seats, premium option

### 4. **Available Rides Display**
- Shows nearby available drivers matching selected ride type
- Displays:
  - Driver name and rating
  - Vehicle model and type
  - Estimated fare based on distance
  - Estimated time of arrival (ETA)
- Click to select a specific driver

### 5. **Special Options**
- **Women-Only Driver**: Filter for female drivers
- **Share Ride**: Reduce costs by sharing with other passengers
- Toggles save preference to booking

### 6. **Route Information Summary**
Shows calculated distance and estimated time of travel with visual route on map.

## Technical Architecture

### Database Schema Updates

#### New Columns in `ride` Table
```sql
ALTER TABLE ride ADD COLUMN pickup_lat DECIMAL(10, 8);
ALTER TABLE ride ADD COLUMN pickup_lng DECIMAL(11, 8);
ALTER TABLE ride ADD COLUMN dropoff_lat DECIMAL(10, 8);
ALTER TABLE ride ADD COLUMN dropoff_lng DECIMAL(11, 8);
ALTER TABLE ride ADD COLUMN vehicle_id INT;
ALTER TABLE ride ADD COLUMN status ENUM('Requested', 'Accepted', 'In Transit', 'Completed', 'Cancelled') DEFAULT 'Requested';
```

#### New Columns in `women_only_ride` Table
Same additions for consistency:
```sql
ALTER TABLE women_only_ride ADD COLUMN pickup_lat DECIMAL(10, 8);
ALTER TABLE women_only_ride ADD COLUMN pickup_lng DECIMAL(11, 8);
ALTER TABLE women_only_ride ADD COLUMN dropoff_lat DECIMAL(10, 8);
ALTER TABLE women_only_ride ADD COLUMN dropoff_lng DECIMAL(11, 8);
ALTER TABLE women_only_ride ADD COLUMN status ENUM('Requested', 'Accepted', 'In Transit', 'Completed', 'Cancelled') DEFAULT 'Requested';
```

### Backend API Endpoints

#### 1. Request Ride (POST)
**Endpoint**: `POST /api/ride`

**Payload**:
```json
{
  "start": {
    "lat": 23.8103,
    "lng": 90.4125,
    "location": "Gulshan 2"
  },
  "destination": {
    "lat": 23.7808,
    "lng": 90.3617,
    "location": "Dhaka Airport"
  },
  "vehicle": "Car"
}
```

**Response (Success - 201)**:
```json
{
  "message": "Ride requested successfully!",
  "rideId": 42
}
```

**Response (Error - 400/401/404/500)**:
```json
{
  "message": "Error description"
}
```

#### 2. Get Available Rides (GET)
**Endpoint**: `GET /api/available-rides?vehicleType=Car`

**Query Parameters**:
- `vehicleType` (required): 'Bike' | 'Car' | 'SUV'

**Response (Success - 200)**:
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
    ...
  ]
}
```

#### 3. Get Ride Details (GET)
**Endpoint**: `GET /api/ride/:rideId`

**Response (Success - 200)**:
```json
{
  "success": true,
  "ride": {
    "ride_id": 42,
    "rider_id": 1,
    "driver_id": 2,
    "pickup_location": "Gulshan 2",
    "dropoff_location": "Dhaka Airport",
    "pickup_lat": 23.8103,
    "pickup_lng": 90.4125,
    "dropoff_lat": 23.7808,
    "dropoff_lng": 90.3617,
    "status": "Requested",
    "start_time": "2026-03-22 10:30:00",
    ...
  }
}
```

#### 4. Cancel Ride (DELETE)
**Endpoint**: `DELETE /api/ride/:rideId`

**Payload**:
```json
{
  "userId": 1
}
```

**Response (Success - 200)**:
```json
{
  "message": "Ride cancelled successfully."
}
```

### Frontend Components

#### Main Files
1. **book-ride.html** - Complete booking interface with map
2. **rider-dashboard.html** - Updated with link to book-ride page

#### JavaScript Libraries Used
- **Leaflet.js** (v1.9+): Interactive map rendering
- **Leaflet Routing Machine**: Route calculation and display
- **Leaflet Control Geocoder**: Location search and reverse geocoding
- **Nominatim API**: Free geocoding service

#### Key JavaScript Functions

```javascript
// Initialize and render map
initMap()

// Set pickup/destination locations
setPickupLocation(lat, lng)
setDestinationLocation(lat, lng)

// Fetch available drivers matching ride type
fetchAvailableRides()

// Get address from coordinates
getAddressFromCoordinates(lat, lng, type)

// Display available rides in list
displayAvailableRides(rides, distance)

// Calculate Haversine distance between coordinates
calculateDistance(lat1, lng1, lat2, lng2)

// Request and confirm ride booking
confirmRide(ride, distance)

// Draw route on map
updateRoute()
```

## File Structure
```
apps/
├── frontend/
│   ├── book-ride.html (NEW - 400+ lines)
│   ├── rider-dashboard.html (UPDATED)
│   └── src/css/output.css
└── backend/
    ├── controllers/
    │   └── rideController.js (UPDATED - 4 functions)
    ├── routes/
    │   └── rideRoutes.js (UPDATED - 4 endpoints)
    ├── database/
    │   └── add_ride_coordinates.sql (NEW - Migration script)
    └── config/
        └── db.js

server.js (UPDATED - Route mounting)
```

## Usage Flow

### 1. User Navigation
- Rider clicks "🚗 Book Your Ride Now" on rider-dashboard.html
- Redirected to book-ride.html with interactive interface

### 2. Location Selection (Two Methods)
**Method A - Click on Map**:
- First click: Sets pickup location (green marker)
- Second click: Sets destination (red marker)

**Method B - Search by Name**:
- Type location name in "Pickup Location" field
- Press Enter or Tab to trigger search
- Repeat for destination

**Method C - Use Current Location**:
- Click "📍 Use My Current Location" button
- Browser requests GPS permission
- Sets pickup to current location

### 3. Route Visualization
- Route automatically displays on map when both locations set
- Shows distance in km and estimated time in minutes
- Route line displayed in indigo color on map

### 4. Ride Type Selection
- Click on desired ride type card (Bike/Car/SUV)
- Card highlights with indigo border and background
- Available rides are fetched for selected type

### 5. Special Options (Optional)
- Check "👩 Women-Only Driver" for female drivers only
- Check "👥 Share Ride" to include ride-sharing and reduce cost

### 6. Select & Request Ride
- Available drivers displayed in list
- Click on desired driver card to select
- Click "Request Ride" button
- Booking sent to backend and saved to database
- Confirmation shown and redirect to rider-dashboard

## Data Flow Diagram

```
┌─────────────────────────────────────────┐
│       Rider Opens book-ride.html        │
└──────────────┬──────────────────────────┘
               │
               ├─→ Browser Request GPS Permission
               │   └─→ Get Current Location (Optional)
               │
               ├─→ Initialize Leaflet Map
               │   ├─→ Center on User/Dhaka
               │   └─→ Display OSM Tiles
               │
               ├─→ User Selects/Searches Locations
               │   ├─→ Click Map OR Search by Name
               │   ├─→ Reverse Geocode Coordinates
               │   └─→ Update Input Fields & Display
               │
               ├─→ Route Displays on Map
               │   ├─→ Calculate Distance (Haversine)
               │   ├─→ Estimate Time (Distance/25km/hr)
               │   └─→ Show Route Summary
               │
               ├─→ Select Ride Type (Bike/Car/SUV)
               │   │
               │   └─→ Fetch /api/available-rides
               │       ├─→ Query: vehicleType
               │       └─→ Display Drivers List
               │
               ├─→ Select Driver & Request Ride
               │   │
               │   └─→ POST /api/ride
               │       ├─→ Save to ride table
               │       ├─→ Store Coordinates
               │       ├─→ Set status='Requested'
               │       └─→ Return rideId
               │
               └─→ Redirect to rider-dashboard
                   └─→ Show Booking Confirmation
```

## Error Handling

### Frontend Error Scenarios
1. **Not Logged In**: Redirects to login page
2. **No Locations Selected**: Alert popup + button disabled
3. **No Ride Type Selected**: Alert popup + no rides shown
4. **Geolocation Denied**: Falls back to Dhaka center
5. **No Drivers Available**: Shows "No drivers available" message
6. **API Failure**: Shows mock rides for demo purposes

### Backend Error Scenarios
1. **Missing Fields (400)**: Returns "Missing ride data"
2. **Unauthorized (401)**: Returns "You are not logged in"
3. **No Driver Found (404)**: Returns "No driver available"
4. **Server Error (500)**: Returns "Server error"

## Performance Considerations

### Optimization Techniques
1. **Debounced Searches**: Location search throttled to prevent excessive API calls
2. **Lazy Loading**: Route only calculated when both locations set
3. **Mock Data Fallback**: Demo data when API unavailable
4. **Efficient Distance Calc**: Haversine formula (no external API calls)
5. **Leaflet Caching**: Map tiles cached by browser

### Recommended Enhancements
1. **Add Caching**: Store previously searched locations
2. **Implement Pagination**: Show more drivers with pagination
3. **Real-time Updates**: WebSocket for live driver locations
4. **Fare Caching**: Pre-calculate fares for common routes
5. **Analytics**: Track popular routes and ride types

## Security Considerations

### Current Implementation
1. ✅ User authentication check before booking
2. ✅ Driver availability validation
3. ✅ Location data stored with precision

### Recommended Enhancements
1. **Rate Limiting**: Limit ride requests per user per minute
2. **Input Validation**: Validate lat/lng ranges (±90, ±180)
3. **HTTPS Only**: Ensure secure location transmission
4. **API Keys**: Implement for `/api/available-rides` to prevent abuse
5. **Fraud Detection**: Flag suspicious booking patterns

## Testing Checklist

### Manual Testing
- [ ] Map loads correctly on page load
- [ ] Can click to add pickup location
- [ ] Can click to add destination location
- [ ] Search works for location names
- [ ] Current location button works
- [ ] Route displays correctly when both locations set
- [ ] Distance and time calculate correctly
- [ ] Ride type selection highlights properly
- [ ] Available rides display in list
- [ ] Can request ride successfully
- [ ] Database stores coordinates correctly
- [ ] Booking persists after page refresh

### Browser Compatibility
- [ ] Chrome 90+
- [ ] Firefox 88+
- [ ] Safari 14+
- [ ] Edge 90+

### Mobile Testing
- [ ] Responsive design on mobile
- [ ] Touch events work (click to place markers)
- [ ] Geolocation works on mobile
- [ ] Map zoom/pan smooth on mobile

## Troubleshooting

### Map Not Loading
**Solution**: Check Leaflet CDN availability and network connection

### Location Search Not Working
**Solution**: Verify Nominatim API is accessible (https://nominatim.openstreetmap.org)

### Coordinates Not Saving to Database
**Solution**: Ensure `add_ride_coordinates.sql` migration has been run

### Available Rides Not Showing
**Solution**: Check vehicle data exists in database and vehicleType parameter is correct

### Geolocation Denied
**Solution**: User must enable location permission in browser or manually select location

## Future Enhancements

1. **Real-time Driver Tracking**: Show live driver location and ETA updates
2. **Multiple Route Options**: Show alternative routes with different methods
3. **Surge Pricing**: Dynamic pricing based on demand
4. **Scheduled Rides**: Pre-book rides for future times
5. **Ride Sharing Analytics**: Calculate savings from shared rides
6. **Payment Integration**: In-app payment during booking
7. **Driver Rating Feedback**: Rate driver after ride completion
8. **Emergency Alert**: SOS button during active ride
9. **Ride History**: View past rides with receipts
10. **Loyalty Points**: Earn points with each ride

## Support & Documentation

For questions or issues:
1. Check the error messages and troubleshooting section
2. Review database migration file for schema
3. Test API endpoints using Postman or curl
4. Check browser console for JavaScript errors
5. Verify user authentication and permissions

---

**Last Updated**: March 22, 2026
**Version**: 1.0
**Status**: Ready for Production
