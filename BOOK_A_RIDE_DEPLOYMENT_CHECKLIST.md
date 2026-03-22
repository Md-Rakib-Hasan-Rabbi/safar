# Book a Ride Feature - Deployment Checklist

## Pre-Deployment Steps

### 1. Database Migration
- [ ] Run the migration script: `add_ride_coordinates.sql`
  ```bash
  mysql -u root -p safar < apps/backend/database/add_ride_coordinates.sql
  ```
- [ ] Verify columns added to `ride` table:
  - pickup_lat, pickup_lng
  - dropoff_lat, dropoff_lng
  - vehicle_id
  - status
- [ ] Verify columns added to `women_only_ride` table (same as above)

### 2. Backend Setup
- [ ] Update `rideController.js` with new functions:
  - ✅ requestRide (updated)
  - ✅ getAvailableRides (new)
  - ✅ getRideDetails (new)
  - ✅ cancelRide (new)
- [ ] Update `rideRoutes.js` with new endpoints:
  - ✅ POST /ride
  - ✅ GET /available-rides
  - ✅ GET /ride/:rideId
  - ✅ DELETE /ride/:rideId
- [ ] Update `server.js` to mount ride routes at `/api`:
  - ✅ Changed from `/api/rides` to `/api`
- [ ] Test each endpoint with Postman/curl

### 3. Frontend Setup
- [ ] Create new file: `book-ride.html` (400+ lines)
  - ✅ File created with complete implementation
- [ ] Update `rider-dashboard.html` button link:
  - ✅ Changed from `index.html#book-section` to `book-ride.html`
- [ ] Test page loads and renders correctly

### 4. Dependencies Check
- [ ] Verify external CDN libraries are accessible:
  - Leaflet.js: https://unpkg.com/leaflet
  - Leaflet Routing Machine: https://unpkg.com/leaflet-routing-machine
  - Leaflet Geocoder: https://unpkg.com/leaflet-control-geocoder
  - Nominatim API: https://nominatim.openstreetmap.org (free, no key needed)
- [ ] Test in offline mode to ensure graceful fallbacks

## Deployment Steps

### 1. Start Backend Server
```bash
cd apps/backend
npm install  # if new packages added
node server.js
```
Expected output: `Server running on http://localhost:5000`

### 2. Start Frontend Server
Serve `apps/frontend` folder (use local server)
```bash
cd apps/frontend
python -m http.server 8000  # Python 3
# or
npx http-server           # Node.js
```

### 3. Test Core Functionality
- [ ] Navigate to http://localhost:8000/rider-dashboard.html
- [ ] Login as rider
- [ ] Click "🚗 Book Your Ride Now" button
- [ ] Page redirects to book-ride.html
- [ ] Map loads and centers correctly
- [ ] Can add pickup/destination locations
- [ ] Route displays on map
- [ ] Available rides load
- [ ] Can request a ride
- [ ] Booking saved to database

### 4. Verify Database
```sql
SELECT * FROM ride WHERE status = 'Requested' ORDER BY start_time DESC LIMIT 1;
```
Expected result: New ride record with all coordinate fields populated

## Testing Scenarios

### Scenario 1: Basic Ride Request
1. Open book-ride.html
2. Click on map to set pickup location
3. Click on map again to set destination
4. Select "Car" ride type
5. Click on available driver
6. Click "Request Ride"
7. Verify booking in database

### Scenario 2: Search-Based Booking
1. Type "Gulshan 2" in pickup location field
2. Type "Dhaka Airport" in destination field
3. Select "Bike" ride type
4. Click "Request Ride"
5. Verify booking saved with location names

### Scenario 3: Current Location Booking
1. Click "📍 Use My Current Location"
2. Allow geolocation permission
3. Verify marker placed on map
4. Complete booking flow
5. Verify coordinates in database

### Scenario 4: Special Options
1. Check "👩 Women-Only Driver"
2. Check "👥 Share Ride"
3. Request ride
4. Verify options saved in booking data

### Scenario 5: Cancel Ride
1. Request a ride
2. Note the rideId from database
3. Call DELETE /api/ride/:rideId
4. Verify status changed to 'Cancelled'

## Performance Testing

### Load Testing
- [ ] Test with 100+ concurrent ride requests
- [ ] Monitor database query performance
- [ ] Check API response times (<500ms target)

### Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile: iOS Safari, Chrome Mobile

## Security Testing
- [ ] Try accessing without authentication → should fail
- [ ] Try with invalid coordinates (>90 latitude) → should be rejected
- [ ] Try SQL injection in search → should be sanitized
- [ ] Try unauthorized ride cancellation → should fail

## Rollback Plan

If issues arise during deployment:

1. **Frontend Issues**
   - Revert `rider-dashboard.html` changes
   - Keep old button link: `index.html#book-section`

2. **Backend Issues**
   - Revert `rideController.js` and `rideRoutes.js` changes
   - Keep old endpoints only
   - Old bookings continue working

3. **Database Issues**
   - Backup existing `ride` table before migration
   - Run reverse migration if needed
   - Restore from backup if corruption detected

```sql
-- Backup before migration
CREATE TABLE ride_backup AS SELECT * FROM ride;

-- Reverse migration (if needed)
ALTER TABLE ride DROP COLUMN pickup_lat, DROP COLUMN pickup_lng, 
                   DROP COLUMN dropoff_lat, DROP COLUMN dropoff_lng, 
                   DROP COLUMN vehicle_id, DROP COLUMN status;
```

## Post-Deployment Monitoring

### Day 1
- [ ] Monitor error logs for JavaScript errors
- [ ] Check database for booking records
- [ ] Verify map loads for all users
- [ ] Test from different geographic locations

### Week 1
- [ ] Track average response times
- [ ] Monitor API endpoint usage
- [ ] Review user feedback
- [ ] Check for edge cases

### Ongoing
- [ ] Weekly backup of new ride bookings
- [ ] Monthly performance report
- [ ] Quarterly feature updates review
- [ ] Annual security audit

## Success Criteria

- [ ] 95%+ of rides successfully booked
- [ ] API response time <500ms average
- [ ] <1% error rate on new bookings
- [ ] Zero database transaction failures
- [ ] All coordinates correctly stored
- [ ] Route calculation accurate within 5%
- [ ] Fare estimation within 10% of actual
- [ ] Mobile responsiveness working perfectly

## Support Documentation

### Riders
- User guide: How to book a ride
- FAQ: Common questions
- Troubleshooting: Known issues and fixes

### Developers
- Code documentation: See BOOK_A_RIDE_FEATURE.md
- API documentation: Endpoint details and examples
- Database schema: Column definitions and relationships

### Administrators
- Monitoring guide: How to check system health
- Logging guide: Where to find error logs
- Backup guide: How to backup ride data

---

**Deployment Date**: [Fill in date]
**Deployed By**: [Fill in name]
**Version**: 1.0
**Status**: ⬜ Pending / 🟨 In Progress / 🟩 Completed
