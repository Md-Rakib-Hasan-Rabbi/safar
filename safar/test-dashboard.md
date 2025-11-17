# Dashboard Testing Guide

This guide shows how to test the role-based dashboard functionality using browser console commands.

## Test User Login (Rider)

Open browser console and run:

```javascript
// Test as a Rider
localStorage.setItem(
  "safarUser",
  JSON.stringify({
    user_id: 1,
    name: "Rakib Hasan",
    email: "mrabbi2230953@bscse.uiu.ac.bd",
    phone: "01631457128",
    userType: "Rider",
  })
);
location.reload();
```

Expected behavior:

- Should show user dashboard with rider-specific stats
- Sidebar shows: Book a Ride, Payment & Transactions, Loyalty & Offers, etc.
- Main content shows personal ride statistics
- Dashboard title: "Rakib Hasan's Dashboard"

## Test Driver Login

```javascript
// Test as a Driver
localStorage.setItem(
  "safarUser",
  JSON.stringify({
    user_id: 2,
    name: "Mominul",
    email: "mominul@gmail.com",
    phone: "01560056059",
    userType: "Driver",
  })
);
location.reload();
```

Expected behavior:

- Should show user dashboard with driver-specific stats
- Stats labels change to "Rides Completed Today", "Total Earned", etc.
- Shows higher earnings and ride count for drivers
- Dashboard title: "Mominul's Dashboard"

## Test Admin Login

```javascript
// Test as an Admin
localStorage.setItem(
  "safarUser",
  JSON.stringify({
    user_id: 6,
    name: "Sanjida",
    email: "sanjida@gmail.com",
    phone: "01657654988",
    userType: "Admin",
  })
);
location.reload();
```

Expected behavior:

- Should show admin dashboard with system-wide statistics
- Sidebar shows: User Management, Ride Analytics, Vehicle Management, etc.
- Main content shows total users, revenue, active drivers
- Dashboard title: "Admin Dashboard"
- Default section: User Management with real user data from database

## Test Logout

```javascript
// Test logout
localStorage.removeItem("safarUser");
location.reload();
```

Expected behavior:

- Should show authentication popup
- Cannot access dashboard without login
- Provides login/signup options

## Admin Sections Testing

Once logged in as admin, test different sections:

1. **User Management** - Shows all users from database with their roles
2. **Ride Analytics** - Shows ride statistics and revenue data
3. **Vehicle Management** - Shows registered vehicles and their drivers
4. **Payment Overview** - Shows payment method distribution and transaction stats
5. **System Settings** - Shows configurable system parameters

## Features Implemented

### Role-Based Dashboard:

- ✅ Rider Dashboard: Personal ride stats, recent activity
- ✅ Driver Dashboard: Earnings, completed rides, driver metrics
- ✅ Admin Dashboard: System overview, user management, analytics

### Authentication:

- ✅ Checks localStorage for 'safarUser'
- ✅ Shows popup if not authenticated
- ✅ Integrates with navbar.js for consistent auth handling

### Admin Management:

- ✅ User Management: View all users, edit/block functionality
- ✅ Vehicle Management: View registered vehicles and drivers
- ✅ System Analytics: Real-time statistics and revenue tracking
- ✅ Settings: System configuration options

### Database Integration:

- ✅ User data matches actual database schema
- ✅ Vehicle data reflects database entries
- ✅ Supports Admin, Rider, Driver user types from database

### Real-time Features:

- ✅ Dynamic stats updates every 30 seconds for admins
- ✅ Time-based ride count simulation
- ✅ Active navigation highlighting for admin sections

The dashboard now properly handles different user roles and provides appropriate functionality for each user type based on the database schema and business requirements.
