// Common navbar functionality for Safar project

// Function to check if user is logged in
function isLoggedIn() {
  return (
    localStorage.getItem("safarUser") !== null ||
    localStorage.getItem("safarPersistentUser") !== null ||
    localStorage.getItem("safarDevUser") !== null
  );
}

// Function to get current user data
function getCurrentUser() {
  const candidates = ["safarUser", "safarPersistentUser", "safarDevUser"];

  for (const key of candidates) {
    const userData = localStorage.getItem(key);
    if (!userData) {
      continue;
    }

    try {
      const parsed = JSON.parse(userData);
      if (parsed && typeof parsed === "object") {
        localStorage.setItem("safarUser", JSON.stringify(parsed));
        localStorage.setItem("safarPersistentUser", JSON.stringify(parsed));
        return parsed;
      }
    } catch (_) {
    }
  }

  return null;
}

function clearStoredSession() {
  localStorage.removeItem("safarUser");
  localStorage.removeItem("safarPersistentUser");
  localStorage.removeItem("safarDevUser");
}

async function isServerReachable() {
  const endpoints = ["http://localhost:5000/api/health", "/api/health"];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, { cache: "no-store" });
      if (!response.ok) {
        continue;
      }

      const payload = await response.json();
      if (payload?.success === true) {
        return true;
      }
    } catch (_) {
    }
  }

  return false;
}

let serverHeartbeatFailures = 0;

async function enforceServerSession() {
  if (!isLoggedIn()) {
    serverHeartbeatFailures = 0;
    return;
  }

  const reachable = await isServerReachable();
  if (reachable) {
    serverHeartbeatFailures = 0;
    return;
  }

  serverHeartbeatFailures += 1;
  if (serverHeartbeatFailures < 2) {
    return;
  }

  clearStoredSession();
  renderNavbarUser();
}

function getRoleDashboardPath() {
  const user = getCurrentUser();
  const role = user?.userType || user?.UserType;

  if (role === "Admin") return "./admin-dashboard.html";
  if (role === "Driver") return "./driver-dashboard.html";
  return "./rider-dashboard.html";
}

function updateDashboardLinks() {
  const dashboardPath = getRoleDashboardPath();
  const dashboardLinks = document.querySelectorAll('a[href$="dashboard.html"]');

  dashboardLinks.forEach((link) => {
    link.setAttribute("href", dashboardPath);
  });
}

// Function to render navbar based on login status
function renderNavbarUser() {
  const authButtons = document.getElementById("authButtons");
  const profileSection = document.getElementById("profileSection");
  const userWelcome = document.getElementById("userWelcome");
  const userName = document.getElementById("userName");
  const userInitial = document.getElementById("userInitial");

  if (isLoggedIn()) {
    const user = getCurrentUser();

    // Hide auth buttons, show profile section
    if (authButtons) authButtons.classList.add("hidden");
    if (profileSection) profileSection.classList.remove("hidden");

    // Update user information
    if (user && user.name) {
      const displayName = user.name.trim();
      const firstName = displayName.split(" ")[0];
      if (userWelcome) userWelcome.textContent = "Signed in as";
      if (userName) userName.textContent = firstName;
      if (userInitial) userInitial.textContent = firstName.charAt(0).toUpperCase();
    } else {
      if (userWelcome) userWelcome.textContent = "Signed in as";
      if (userName) userName.textContent = "User";
      if (userInitial) userInitial.textContent = "U";
    }

    // Setup dropdown functionality after profile section is visible
    setTimeout(() => {
      setupProfileDropdown();
    }, 100);
  } else {
    // Show auth buttons, hide profile section
    if (authButtons) authButtons.classList.remove("hidden");
    if (profileSection) profileSection.classList.add("hidden");
  }
}

// Function to handle logout
function logout() {
  // Clear user data from localStorage
  clearStoredSession();

  // Re-render navbar
  renderNavbarUser();

  window.location.href = "/";
}

// Profile dropdown toggle functionality
function setupProfileDropdown() {
  const profileButton = document.getElementById("profileButton");
  const profileDropdown = document.getElementById("profileDropdown");
  const logoutButton = document.getElementById("logoutButton");

  if (profileButton && profileDropdown) {
    // Clear any existing event listeners
    profileButton.removeEventListener("click", toggleDropdown);

    // Add click event to toggle dropdown
    profileButton.addEventListener("click", toggleDropdown);

    // Close dropdown when clicking outside
    document.addEventListener("click", closeDropdownOutside);

    // Handle logout
    if (logoutButton) {
      logoutButton.addEventListener("click", logout);
    }
  }
}

// Toggle dropdown function
function toggleDropdown(e) {
  e.preventDefault();
  e.stopPropagation();
  const profileDropdown = document.getElementById("profileDropdown");
  if (profileDropdown) {
    profileDropdown.classList.toggle("hidden");
  }
}

// Close dropdown when clicking outside
function closeDropdownOutside(e) {
  const profileButton = document.getElementById("profileButton");
  const profileDropdown = document.getElementById("profileDropdown");

  if (
    profileButton &&
    profileDropdown &&
    !profileButton.contains(e.target) &&
    !profileDropdown.contains(e.target)
  ) {
    profileDropdown.classList.add("hidden");
  }
}

// Initialize navbar functionality
function initializeNavbar() {
  renderNavbarUser();
  updateDashboardLinks();
  enforceServerSession();
  setInterval(enforceServerSession, 10000);
  // setupProfileDropdown is now called from renderNavbarUser when logged in
}

// Auto-initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  initializeNavbar();
});

// Also initialize on window load as fallback
window.addEventListener("load", function () {
  initializeNavbar();
});
