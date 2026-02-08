/**
 * PlaceMeDB - Professional Data Access Layer
 * Handles robust interaction with LocalStorage to prevent crashes and data corruption.
 */
class JMCTestDB {
  constructor() {
    this.USER_KEY = "jmctest_users";
    this.TEST_KEY = "jmctest_tests";
  }

  /**
   * Safe LocalStorage getter
   */
  _get(key, defaultValue) {
    try {
      const val = localStorage.getItem(key);
      if (!val) return defaultValue;
      const parsed = JSON.parse(val);
      return parsed || defaultValue;
    } catch (e) {
      console.error(`[JMCTestDB] Read Error on ${key}:`, e);
      // Return default if corrupted
      return defaultValue;
    }
  }

  /**
   * Safe LocalStorage setter
   */
  _save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error(`[JMCTestDB] Write Error on ${key}:`, e);
      alert("System Storage Full! Unable to save data. Please clear space.");
      return false;
    }
  }

  /**
   * Get all users with schema validation
   */
  getUsers() {
    let data = this._get(this.USER_KEY, { students: [], staff: [] });

    // Auto-heal: If data is legacy array or malformed, reset/fix it
    if (Array.isArray(data)) {
      console.warn("[JMCTestDB] Migrating legacy user data...");
      // Try to salvage? No, safer to reset structure for stability as requested.
      return { students: [], staff: [] };
    }

    if (!Array.isArray(data.students)) data.students = [];
    if (!Array.isArray(data.staff)) data.staff = [];

    return data;
  }

  /**
   * Check if user exists
   */
  userExists(username) {
    const data = this.getUsers();
    // Check both collections to be safe (unique usernames across system is best practice)
    return (
      data.students.some((u) => u.username === username) ||
      data.staff.some((u) => u.username === username)
    );
  }

  /**
   * register a new user
   */
  addUser(user) {
    const data = this.getUsers();

    if (this.userExists(user.username)) {
      throw new Error("Username already taken.");
    }

    if (user.type === "student") {
      data.students.push(user);
    } else {
      data.staff.push(user);
    }

    return this._save(this.USER_KEY, data);
  }

  /**
   * Authenticate user
   */
  authenticate(username, password, type) {
    const data = this.getUsers();
    const list = type === "student" ? data.students : data.staff;
    return list.find((u) => u.username === username && u.password === password);
  }

  /**
   * Get all active tests
   */
  getTests() {
    return this._get(this.TEST_KEY, []);
  }

  /**
   * Clear all data (Factory Reset)
   */
  factoryReset() {
    localStorage.clear();
    sessionStorage.clear();
    console.log("[JMCTestDB] System Reset Complete.");
    return true;
  }
}

// === AUTOMATIC FRESH START ===
// Clear all previous data for a fresh experience (one-time reset based on version)
(function () {
  const CURRENT_VERSION = "v2.1.0-clean-dashboard-2026-02-05";
  const storedVersion = localStorage.getItem("jmctest_version");

  if (storedVersion !== CURRENT_VERSION) {
    // Clear all localStorage data
    localStorage.clear();
    sessionStorage.clear();

    // Set new version to prevent future resets
    localStorage.setItem("jmctest_version", CURRENT_VERSION);

    console.log("[JMCTestDB] 🔄 All previous data cleared - Fresh Start!");
    console.log(
      "[JMCTestDB] ✅ Portal is now brand new with no historical data.",
    );
  }
})();

// === INPUT CLEARING UTILITY ===
// Ensure no residual input data remains on page reload
(function () {
  window.addEventListener("load", () => {
    // Clear all text-based inputs and textareas on load to prevent "memories"
    const inputs = document.querySelectorAll(
      'input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]), textarea',
    );
    inputs.forEach((input) => {
      if (input.dataset.noClear !== "true") {
        input.value = "";
      }
    });
    console.log("[JMCTestDB] 🪄 Inputs cleared for privacy.");
  });
})();

// Export global instance
window.DB = new JMCTestDB();
