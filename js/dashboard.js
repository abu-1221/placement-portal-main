// Dashboard JavaScript
// Shared logic for both Student and Staff dashboards

document.addEventListener("DOMContentLoaded", () => {
  checkAuth();
  initSidebar();
  initNavigation();
  initLogout();
  initUserInfo();

  // Feature-specific initializations
  // We strictly check user type to prevent errors on the wrong dashboard
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  if (user.type === "student") {
    initAvailabilityToggle();
    initSalaryRange();
    initCharts();
    loadAvailableTests();
    loadCompletedTests();

    // Initialize enhanced analytics (from analytics.js)
    if (typeof initEnhancedAnalytics === "function") {
      setTimeout(initEnhancedAnalytics, 100);
    }
  }
  // Staff logic is handled in staff-dashboard.js,
  // but dashboard.js provides the shared shell (sidebar, auth, etc)
});

// Check if user is authenticated
function checkAuth() {
  const user = sessionStorage.getItem("user");
  const isStudentPage = window.location.pathname.includes("student-dashboard");
  const isStaffPage = window.location.pathname.includes("staff-dashboard");

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const userData = JSON.parse(user);

  // Redirect if wrong dashboard
  if (isStudentPage && userData.type !== "student") {
    window.location.href = "staff-dashboard.html";
  } else if (isStaffPage && userData.type !== "staff") {
    window.location.href = "student-dashboard.html";
  }
}

// Initialize sidebar toggle for mobile and desktop collapse
function initSidebar() {
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  const sidebarToggleBtn = document.getElementById("sidebarToggleBtn");

  // Mobile Toggle
  if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", () => {
      sidebar.classList.toggle("active");
      if (overlay) overlay.classList.toggle("active");
    });

    if (overlay) {
      overlay.addEventListener("click", () => {
        sidebar.classList.remove("active");
        overlay.classList.remove("active");
      });
    }
  }

  // Desktop Collapse Toggle
  if (sidebarToggleBtn && sidebar) {
    sidebarToggleBtn.addEventListener("click", () => {
      const isCollapsed = sidebar.classList.toggle("collapsed");
      document.body.classList.toggle("sidebar-minimized");

      // Rotate chevron icon
      const iconSvg = sidebarToggleBtn.querySelector("svg");
      if (iconSvg) {
        iconSvg.style.transform = isCollapsed
          ? "rotate(180deg)"
          : "rotate(0deg)";
      }

      // Save preference
      localStorage.setItem("sidebarCollapsed", isCollapsed);
    });

    // Restore state from localStorage
    if (localStorage.getItem("sidebarCollapsed") === "true") {
      sidebar.classList.add("collapsed");
      document.body.classList.add("sidebar-minimized");
      const iconSvg = sidebarToggleBtn.querySelector("svg");
      if (iconSvg) iconSvg.style.transform = "rotate(180deg)";
    }
  }
}

// Initialize navigation between sections
function initNavigation() {
  const navItems = document.querySelectorAll(".nav-item");
  const sectionTitle = document.getElementById("sectionTitle");

  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();

      // Update active nav item
      navItems.forEach((nav) => nav.classList.remove("active"));
      item.classList.add("active");

      // Show corresponding section
      const sectionId = item.dataset.section + "-section";
      document.querySelectorAll(".content-section").forEach((section) => {
        section.classList.remove("active");
      });
      document.getElementById(sectionId)?.classList.add("active");

      // Update title
      if (sectionTitle) {
        sectionTitle.textContent = item.querySelector("span").textContent;
      }

      // Close mobile sidebar
      document.getElementById("sidebar")?.classList.remove("active");
      document.getElementById("sidebarOverlay")?.classList.remove("active");

      // Reinitialize charts for analytics section (Student only)
      if (item.dataset.section === "analytics") {
        setTimeout(() => {
          if (window.AnalyticsEngine) {
            window.AnalyticsEngine.renderAllCharts();
          }
        }, 100);
      }
    });
  });
}

// Initialize logout
function initLogout() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      sessionStorage.removeItem("user");
      window.location.href = "login.html";
    });
  }
}

// Display user info
function initUserInfo() {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const userAvatar = document.getElementById("userAvatar");
  const userName = document.getElementById("userName");

  if (user.name) {
    const initials = user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
    if (userAvatar) userAvatar.textContent = initials;
    if (userName) userName.textContent = user.name;
  }
}

// Availability toggle (Student Only)
function initAvailabilityToggle() {
  const toggle = document.getElementById("availabilityToggle");
  const statusText = document.getElementById("statusText");
  const statusIndicator = document.querySelector(".status-indicator");

  if (toggle && statusText) {
    toggle.addEventListener("change", () => {
      if (toggle.checked) {
        statusText.textContent = "Available for Placement";
        statusIndicator?.classList.add("available");
        statusIndicator?.classList.remove("unavailable");
      } else {
        statusText.textContent = "Not Available";
        statusIndicator?.classList.remove("available");
        statusIndicator?.classList.add("unavailable");
      }
    });
  }
}

// Salary range slider (Student Only)
function initSalaryRange() {
  const range = document.getElementById("salaryRange");
  const value = document.getElementById("salaryValue");

  if (range && value) {
    range.addEventListener("input", () => {
      value.textContent = range.value;
    });
  }
}

// Initialize charts with student's actual scores (Student Only)
// Analytics is now handled by js/analytics.js

// ==========================================
// UPDATED TEST TAKING LOGIC (SPA Integration)
// ==========================================

// Load available tests for students
function loadAvailableTests() {
  const container = document.getElementById("availableTestsList");
  if (!container) return; // Silent return if not on student dashboard

  const tests = JSON.parse(localStorage.getItem("jmctest_tests") || "[]");
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  // Get already completed test IDs
  const completedTestIds = (user.testsCompleted || []).map((t) => t.testId);

  // Filter active tests that haven't been completed
  const availableTests = tests.filter(
    (t) => t.status === "active" && !completedTestIds.includes(t.id),
  );

  if (availableTests.length === 0) {
    container.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--gray-500);">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width: 48px; height: 48px; margin-bottom: 1rem; opacity: 0.5;">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                <p style="font-size: 1.1rem; font-weight: 500;">No Active Tests</p>
                <p style="font-size: 0.9rem; opacity: 0.8;">There are no tests scheduled for you at this time.</p>
            </div>
        `;
    return;
  }

  container.innerHTML = availableTests
    .map((test) => {
      const formattedDate = test.date
        ? new Date(test.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "No date";
      const logo = test.company ? test.company.charAt(0).toUpperCase() : "T";

      return `
            <div class="drive-item">
                <div class="drive-logo">${logo}</div>
                <div class="drive-info">
                    <h4>${test.name}</h4>
                    <p>${test.company} • ${formattedDate} • ${test.duration} mins • ${test.questions.length} questions</p>
                </div>
                <button class="btn btn-primary btn-sm" onclick="window.confirmStartTest(${test.id})">
                    Take Test
                </button>
            </div>
        `;
    })
    .join("");
}

// 1. Confirmation Dialog
function confirmStartTest(testId) {
  if (
    confirm(
      "Are you sure you want to start this test? Once started, the timer will begin.",
    )
  ) {
    startInternalTest(testId);
  }
}

// 2. Start Test Logic (Internal)
let activeTestInterval = null;
let activeTestAnswers = {};

function startInternalTest(testId) {
  // 1. Hide all other sections
  document
    .querySelectorAll(".content-section")
    .forEach((s) => s.classList.remove("active"));

  // 2. Show ID 'take-test-section'
  const testSection = document.getElementById("take-test-section");
  testSection.classList.add("active");

  // 3. Smooth scroll
  testSection.scrollIntoView({ behavior: "smooth" });

  // 4. Load Test UI
  const tests = JSON.parse(localStorage.getItem("jmctest_tests") || "[]");
  const test = tests.find((t) => t.id == testId);

  if (!test) {
    alert("Error loading test.");
    return;
  }

  const container = document.getElementById("test-interface-container");

  // Render the take-test.html structure internally
  container.innerHTML = `
        <div class="test-container" style="max-width: 900px; margin: 0 auto; padding: 0;">
             <!-- Test Header -->
            <div class="test-header" id="testHeader">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <h1 style="margin:0; font-size:1.8rem;">${test.name}</h1>
                    <button class="btn btn-ghost btn-sm" onclick="cancelTest()" style="color: #ef4444;">Cancel Test</button>
                </div>
                <p style="color: var(--gray-400); margin-top: 0.5rem;">${test.description || ""}</p>
                
                <div class="test-info">
                    <div class="info-item"><span>⏱ ${test.duration} mins</span></div>
                    <div class="info-item"><span>📝 ${test.questions.length} questions</span></div>
                    <div class="info-item"><span>🏢 ${test.company}</span></div>
                </div>

                <div class="timer-bar" style="width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden; margin-top: 1rem;">
                    <div class="timer-fill" id="internalTimerFill" style="height: 100%; width: 100%; background: linear-gradient(90deg, #10b981, #f59e0b, #ef4444); transition: width 1s linear;"></div>
                </div>
                <div style="text-align: right; margin-top: 0.5rem; color: var(--gray-400); font-size: 0.875rem;">
                    <span id="internalTimeRemaining">Time Remaining: --:--</span>
                </div>
            </div>

            <!-- Questions -->
            <div id="internalQuestionsContainer"></div>
        </div>
    `;

  // Start Logic
  activeTestAnswers = {};
  let startTime = Date.now();
  let durationSecs = test.duration * 60;

  // Timer
  if (activeTestInterval) clearInterval(activeTestInterval);
  activeTestInterval = setInterval(() => {
    const now = Date.now();
    const endTime = startTime + durationSecs * 1000;
    const remaining = Math.max(0, endTime - now);

    if (remaining <= 0) {
      clearInterval(activeTestInterval);
      finishInternalTest(test);
      return;
    }

    // Update UI
    const secs = Math.floor(remaining / 1000);
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    document.getElementById("internalTimeRemaining").textContent =
      `Time Remaining: ${m}:${s.toString().padStart(2, "0")}`;

    const pct = (remaining / (durationSecs * 1000)) * 100;
    document.getElementById("internalTimerFill").style.width = pct + "%";
  }, 1000);

  renderInternalQuestion(0, test);
}

function renderInternalQuestion(index, test) {
  const q = test.questions[index];
  const container = document.getElementById("internalQuestionsContainer");

  container.innerHTML = `
        <div class="question-card" style="background: rgba(255,255,255,0.05); padding: 2rem; border-radius: 1rem; border: 1px solid rgba(255,255,255,0.1);">
            <div style="color: #667eea; font-weight: 600; margin-bottom: 0.5rem;">Question ${index + 1} of ${test.questions.length}</div>
            <div style="font-size: 1.2rem; margin-bottom: 1.5rem;">${q.question}</div>
            
            <div class="options-list" style="display:flex; flex-direction:column; gap:1rem;">
                ${q.options
                  .map((opt, i) => {
                    const letter = String.fromCharCode(65 + i);
                    const isChecked =
                      activeTestAnswers[index] === letter ? "checked" : "";
                    const isSelectedClass =
                      activeTestAnswers[index] === letter
                        ? "background: rgba(102,126,234,0.2); border-color: #667eea;"
                        : "";

                    return `
                    <label class="option-label" style="display:flex; align-items:center; padding:1rem; border:2px solid rgba(255,255,255,0.1); border-radius:10px; cursor:pointer; ${isSelectedClass}" onclick="selectInternalAnswer(${index}, '${letter}', ${test.id})">
                        <span style="width:30px; height:30px; background:rgba(255,255,255,0.1); border-radius:50%; display:flex; align-items:center; justify-content:center; margin-right:1rem; font-weight:bold;">${letter}</span>
                        ${opt}
                    </label>
                    `;
                  })
                  .join("")}
            </div>
            
            <div class="navigation" style="display:flex; justify-content:space-between; margin-top:2rem;">
                 <button class="btn btn-ghost" ${index === 0 ? 'disabled style="opacity:0.5"' : `onclick="renderInternalQuestion(${index - 1}, JSON.parse(decodeURIComponent('${encodeURIComponent(JSON.stringify(test))}')))"`}>Previous</button>
                 
                 ${
                   index < test.questions.length - 1
                     ? `<button class="btn btn-primary" onclick="renderInternalQuestion(${index + 1}, JSON.parse(decodeURIComponent('${encodeURIComponent(JSON.stringify(test))}')))">Next</button>`
                     : `<button class="btn btn-primary" style="background: #10b981;" onclick="finishInternalTest(JSON.parse(decodeURIComponent('${encodeURIComponent(JSON.stringify(test))}')))">Submit Test</button>`
                 }
            </div>
        </div>
    `;
}

function selectInternalAnswer(index, answer, testId) {
  activeTestAnswers[index] = answer;
  const tests = JSON.parse(localStorage.getItem("jmctest_tests") || "[]");
  const test = tests.find((t) => t.id == testId);
  renderInternalQuestion(index, test);
}

function cancelTest() {
  if (confirm("Are you sure? All progress will be lost.")) {
    clearInterval(activeTestInterval);
    document.querySelector('[data-section="availability"]').click();
  }
}

function finishInternalTest(test) {
  clearInterval(activeTestInterval);

  // Calculate Score
  let correct = 0;
  test.questions.forEach((q, i) => {
    if (activeTestAnswers[i] === q.answer) correct++;
  });

  const percentage = Math.round((correct / test.questions.length) * 100);
  const status = percentage >= 60 ? "passed" : "failed";

  // Save Result
  const user = JSON.parse(sessionStorage.getItem("user"));
  const result = {
    testId: test.id,
    testName: test.name,
    company: test.company,
    date: new Date().toISOString(),
    score: percentage,
    correct: correct,
    total: test.questions.length,
    status: status,
    answers: activeTestAnswers, // Save answers for "View Details"
    questions: test.questions, // Save snapshot of questions too
  };

  // Update LocalStorage user (persistent)
  const storedUsers = JSON.parse(localStorage.getItem("jmctest_users"));
  const sIdx = storedUsers.students.findIndex(
    (s) => s.username === user.username,
  );
  if (sIdx !== -1) {
    if (!storedUsers.students[sIdx].testsCompleted)
      storedUsers.students[sIdx].testsCompleted = [];
    storedUsers.students[sIdx].testsCompleted.push(result);
    localStorage.setItem("jmctest_users", JSON.stringify(storedUsers));
  }

  // Update Session
  if (!user.testsCompleted) user.testsCompleted = [];
  user.testsCompleted.push(result);
  sessionStorage.setItem("user", JSON.stringify(user));

  alert(`Test Submitted! You scored ${percentage}%.`);

  // Reload tests list and go there
  loadAvailableTests();
  loadCompletedTests();
  document.querySelector('[data-section="tests"]').click();

  // Refresh charts and analytics
  initCharts();
  if (typeof initEnhancedAnalytics === "function") {
    initEnhancedAnalytics();
  }
}

// Load completed tests for students
function loadCompletedTests() {
  const tbody = document.querySelector("#tests-section tbody");
  if (!tbody) return;

  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const completedTests = user.testsCompleted || [];

  if (completedTests.length === 0) {
    tbody.innerHTML = `
            <tr>
                <td colspan="6">
                    <div style="text-align: center; padding: 3rem; color: var(--gray-500);">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width: 48px; height: 48px; margin-bottom: 1rem; opacity: 0.5;">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                            <polyline points="14,2 14,8 20,8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                        </svg>
                        <p style="font-size: 1.1rem; font-weight: 500;">No Tests Taken</p>
                        <p style="font-size: 0.9rem; opacity: 0.8;">You haven't completed any tests yet.</p>
                    </div>
                </td>
            </tr>
        `;
    return;
  }

  // Update Stats cards
  const totalTests = completedTests.length;
  const passedTests = completedTests.filter(
    (t) => t.status === "passed",
  ).length;
  const avgScore =
    totalTests > 0
      ? Math.round(
          completedTests.reduce((sum, t) => sum + t.score, 0) / totalTests,
        )
      : 0;

  const statValues = document.querySelectorAll("#tests-section .stat-value");
  if (statValues[0]) statValues[0].textContent = totalTests;
  if (statValues[1]) statValues[1].textContent = passedTests;
  // Pending could be calculated if we had pending logic, for now 0
  if (statValues[3]) statValues[3].textContent = avgScore + "%";

  tbody.innerHTML = completedTests
    .map((test, index) => {
      const formattedDate = new Date(test.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const statusClass = test.status || "pending";

      return `
            <tr>
                <td>${test.testName}</td>
                <td>${test.company}</td>
                <td>${formattedDate}</td>
                <td>${test.score}%</td>
                <td><span class="status-badge ${statusClass}">${statusClass.toUpperCase()}</span></td>
                <td>
                    <button class="btn btn-sm btn-ghost" onclick="viewTestDetails(${index})">View Details</button>
                </td>
            </tr>
        `;
    })
    .join("");
}

// 3. View Test Details Logic
function viewTestDetails(index) {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const result = user.testsCompleted[index];

  if (!result) return;

  const modal = document.getElementById("test-details-modal");
  const body = document.getElementById("test-details-body");

  // Generate HTML for details
  let html = `
        <div style="margin-bottom: 2rem; display: flex; justify-content: space-between; background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 0.5rem;">
            <div>
                <h3 style="margin:0;">${result.testName}</h3>
                <p style="color: var(--gray-400); margin:0;">${result.company}</p>
            </div>
            <div style="text-align: right;">
                <div style="font-size: 1.5rem; font-weight: bold; color: ${result.score >= 60 ? "#10b981" : "#ef4444"}">${result.score}%</div>
                <div style="font-size: 0.8rem; text-transform: uppercase;">${result.status}</div>
            </div>
        </div>
        <div class="questions-review">
    `;

  const questions = result.questions || [];
  const answers = result.answers || {};

  if (questions.length === 0) {
    html += "<p>Details not available for legacy tests.</p>";
  } else {
    questions.forEach((q, i) => {
      const userAns = answers[i];
      const correctAns = q.answer;
      const isCorrect = userAns === correctAns;

      // Build options view if existing
      let optionsHtml = "";
      if (q.options && Array.isArray(q.options)) {
        optionsHtml = `<div style="margin-top:0.75rem; display:flex; flex-direction:column; gap:0.25rem;">`;
        q.options.forEach((opt, optIdx) => {
          const char = String.fromCharCode(65 + optIdx);
          let itemStyle =
            "padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.85rem;";

          if (char === correctAns && char === userAns) {
            // Correct user choice
            itemStyle +=
              "background: rgba(16, 185, 129, 0.2); color: #10b981; border: 1px solid #10b981;";
          } else if (char === correctAns) {
            // User missed this correct one
            itemStyle +=
              "background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px dashed #10b981;";
          } else if (char === userAns) {
            // User selected wrong one
            itemStyle +=
              "background: rgba(239, 68, 68, 0.2); color: #ef4444; border: 1px solid #ef4444;";
          } else {
            // Neutral
            itemStyle +=
              "color: var(--gray-400); border: 1px solid transparent;";
          }

          optionsHtml += `<div style="${itemStyle}"><strong style="margin-right:0.5rem; opacity:0.7">${char}.</strong> ${opt}</div>`;
        });
        optionsHtml += `</div>`;
      }

      html += `
                <div class="detail-item ${isCorrect ? "correct" : "wrong"}">
                    <div style="display:flex; justify-content:space-between;">
                        <div class="detail-q">Q${i + 1}: ${q.question}</div>
                        <div class="detail-status">${isCorrect ? "CORRECT" : "INCORRECT"}</div>
                    </div>
                    ${optionsHtml}
                    <div style="margin-top: 1rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; border-top:1px solid rgba(255,255,255,0.05); padding-top:0.5rem;">
                        <div class="detail-ans">
                            <span style="color: var(--gray-400); font-size:0.75rem">Your Answer:</span> <br>
                            <span style="font-weight: 500; color: ${isCorrect ? "white" : "#ef4444"}">${userAns || "-"}</span>
                        </div>
                        <div class="detail-ans">
                            <span style="color: var(--gray-400); font-size:0.75rem">Correct Answer:</span> <br>
                            <span style="font-weight: 500; color: #10b981">${correctAns}</span>
                        </div>
                    </div>
                </div>
            `;
    });
  }

  html += `</div>`;

  body.innerHTML = html;
  modal.style.display = "flex";
}

function closeTestDetails() {
  document.getElementById("test-details-modal").style.display = "none";
}

// Make global for inline events
window.confirmStartTest = confirmStartTest;
window.renderInternalQuestion = renderInternalQuestion;
window.selectInternalAnswer = selectInternalAnswer;
window.cancelTest = cancelTest;
window.finishInternalTest = finishInternalTest;
window.viewTestDetails = viewTestDetails;
window.closeTestDetails = closeTestDetails;
window.initCharts = initCharts; // re-export
