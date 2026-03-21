# Safar Professional Workflow

## Core Principle
Role-based dashboards are the primary navigation hubs. Feature pages should not rely on persistent sidebars for full app navigation.

## Unified User Journey
1. **Landing (`index.html`)**
   - User browses services.
   - User chooses Login/Signup.

2. **Role-aware Login (`src/login.html`)**
   - User selects Rider / Driver / Admin.
   - Backend validates role + credentials.

3. **Role Dashboard Entry**
   - Rider -> `rider-dashboard.html`
   - Driver -> `driver-dashboard.html`
   - Admin -> `admin-dashboard.html`

4. **Feature Access from Dashboard Cards/Actions**
   - Rider: Ride, Parcel, Payment, Schedule
   - Driver: Ride management, Earnings, Settings
   - Admin: Monitoring, Payments, Safety, Legacy tools

5. **Profile + Settings**
   - Accessed from profile menu on dashboards.
   - `settings.html` is a standalone page with no persistent sidebar.
   - Includes account, security, and preferences sections.

6. **Logout**
   - Available from header quick button + profile dropdown + settings header.
   - Clears local auth state and redirects to login.

## Navigation Rules
- Avoid exposing all system sections through a global sidebar on every page.
- Keep top-level navigation compact: Dashboard, Home, Profile, Logout.
- Use role guards on every role-specific page.
- Prefer focused page-level actions over full navigation menus.

## Implementation Status
- Professional Rider / Driver / Admin dashboards with profile systems: ✅
- Standalone professional Settings workflow (no sidebar dependency): ✅
- Role-based redirects and logout consistency: ✅
