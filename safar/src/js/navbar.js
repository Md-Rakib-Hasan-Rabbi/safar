// Common navbar functionality for Safar project

// Function to check if user is logged in
function isLoggedIn() {
  return localStorage.getItem("safarUser") !== null;
}

// Function to get current user data
function getCurrentUser() {
  const userData = localStorage.getItem("safarUser");
  return userData ? JSON.parse(userData) : null;
}

// Function to render navbar based on login status
function renderNavbarUser() {
  const authButtons = document.getElementById("authButtons");
  const profileSection = document.getElementById("profileSection");
  const userWelcome = document.getElementById("userWelcome");
  const userName = document.getElementById("userName");

  if (isLoggedIn()) {
    const user = getCurrentUser();

    // Hide auth buttons, show profile section
    if (authButtons) authButtons.classList.add("hidden");
    if (profileSection) profileSection.classList.remove("hidden");

    // Update user information
    if (user && user.name) {
      if (userWelcome) userWelcome.textContent = `Welcome, ${user.name}!`;
      if (userName) userName.textContent = "Profile"; // Always show "Profile" instead of username
    } else {
      if (userWelcome) userWelcome.textContent = "Welcome, User!";
      if (userName) userName.textContent = "Profile";
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
  localStorage.removeItem("safarUser");

  // Re-render navbar
  renderNavbarUser();

  // Redirect to home page - detect current page location
  const currentPath = window.location.pathname;
  if (currentPath.includes("/src/") || currentPath.includes("/safar/src/")) {
    // If we're in a src subdirectory, go up two levels
    window.location.href = "../index.html";
  } else if (currentPath.includes("/safar/")) {
    // If we're in the safar directory, go to index.html
    window.location.href = "./index.html";
  } else {
    // Default case
    window.location.href = "./index.html";
  }
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
