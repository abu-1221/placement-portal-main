/**
 * JMC-TEST - Simplified Analytics Module
 * Strictly five chart types: Bar, Pie, Line, Scatter, Dot
 */

const AnalyticsEngine = {
  data: {
    tests: [],
    charts: {},
  },

  config: {
    colors: [
      "#667eea",
      "#764ba2",
      "#10b981",
      "#f59e0b",
      "#ef4444",
      "#06b6d4",
      "#ec4899",
      "#8b5cf6",
      "#f97316",
      "#3b82f6",
    ],
    chartOptions: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "rgba(255,255,255,0.7)",
            font: { family: "Inter", size: 12 },
          },
        },
        tooltip: {
          backgroundColor: "rgba(26, 26, 46, 0.95)",
          titleColor: "#fff",
          bodyColor: "rgba(255,255,255,0.8)",
          cornerRadius: 8,
        },
      },
      scales: {
        x: {
          ticks: { color: "rgba(255,255,255,0.5)" },
          grid: { color: "rgba(255,255,255,0.05)" },
        },
        y: {
          beginAtZero: true,
          max: 100,
          ticks: { color: "rgba(255,255,255,0.5)" },
          grid: { color: "rgba(255,255,255,0.05)" },
        },
      },
    },
  },

  init() {
    console.log("[Analytics] Initializing Simplified Engine");
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    this.data.tests = user.testsCompleted || [];

    this.renderAllCharts();

    // Listen for storage changes to update dynamically
    window.addEventListener("storage", () => {
      const updatedUser = JSON.parse(sessionStorage.getItem("user") || "{}");
      if (updatedUser.testsCompleted) {
        this.data.tests = updatedUser.testsCompleted;
        this.renderAllCharts();
      }
    });
  },

  renderAllCharts() {
    this.destroyExistingCharts();

    const hasData = this.data.tests && this.data.tests.length > 0;

    this.renderBarChart(hasData);
    this.renderPieChart(hasData);
    this.renderLineChart(hasData);
    this.renderScatterPlot(hasData);
    this.renderDotChart(hasData);

    // Add 0 overlay if no data
    document.querySelectorAll(".no-data-overlay").forEach((el) => el.remove());
    if (!hasData) {
      document.querySelectorAll(".chart-container").forEach((container) => {
        const overlay = document.createElement("div");
        overlay.className = "no-data-overlay";
        overlay.style.position = "absolute";
        overlay.style.top = "50%";
        overlay.style.left = "50%";
        overlay.style.transform = "translate(-50%, -50%)";
        overlay.style.fontSize = "8rem";
        overlay.style.fontWeight = "800";
        overlay.style.color = "rgba(255,255,255,0.05)";
        overlay.style.pointerEvents = "none";
        overlay.style.zIndex = "0";
        overlay.textContent = "0";
        container.style.position = "relative";
        container.appendChild(overlay);
      });
    }
  },

  destroyExistingCharts() {
    Object.values(this.data.charts).forEach((chart) => {
      if (chart) chart.destroy();
    });
    this.data.charts = {};
  },

  renderBarChart(hasData) {
    const ctx = document.getElementById("barChart").getContext("2d");
    const data = hasData
      ? this.data.tests.slice(-5).map((t) => t.score)
      : [0, 0, 0, 0, 0];
    const labels = hasData
      ? this.data.tests.slice(-5).map((t, i) => t.testName || `Test ${i + 1}`)
      : ["No Data", "No Data", "No Data", "No Data", "No Data"];

    this.data.charts.bar = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Test Scores",
            data: data,
            backgroundColor: this.config.colors[0],
            borderRadius: 8,
          },
        ],
      },
      options: this.config.chartOptions,
    });
  },

  renderPieChart(hasData) {
    const ctx = document.getElementById("pieChart").getContext("2d");
    let passed = 0,
      failed = 0;

    if (hasData) {
      passed = this.data.tests.filter((t) => t.status === "passed").length;
      failed = this.data.tests.length - passed;
    }

    this.data.charts.pie = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Passed", "Failed"],
        datasets: [
          {
            data: hasData ? [passed, failed] : [0, 0],
            backgroundColor: [this.config.colors[2], this.config.colors[4]],
            borderWidth: 0,
          },
        ],
      },
      options: {
        ...this.config.chartOptions,
        scales: { x: { display: false }, y: { display: false } },
      },
    });

    if (!hasData) {
      this.addNoDataOverlay("pieChart");
    }
  },

  renderLineChart(hasData) {
    const ctx = document.getElementById("lineChart").getContext("2d");
    const data = hasData
      ? this.data.tests.map((t) => t.score)
      : [0, 0, 0, 0, 0];
    const labels = hasData
      ? this.data.tests.map((t, i) => `T${i + 1}`)
      : ["0", "0", "0", "0", "0"];

    this.data.charts.line = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Progress",
            data: data,
            borderColor: this.config.colors[5],
            backgroundColor: "rgba(6, 182, 212, 0.1)",
            fill: true,
            tension: 0.4,
            pointRadius: 6,
            pointBackgroundColor: this.config.colors[5],
          },
        ],
      },
      options: this.config.chartOptions,
    });
  },

  renderScatterPlot(hasData) {
    const ctx = document.getElementById("scatterPlot").getContext("2d");
    const data = hasData
      ? this.data.tests.map((t, i) => ({ x: i + 1, y: t.score }))
      : [{ x: 0, y: 0 }];

    this.data.charts.scatter = new Chart(ctx, {
      type: "scatter",
      data: {
        datasets: [
          {
            label: "Score Distribution",
            data: data,
            backgroundColor: this.config.colors[6],
            pointRadius: 8,
          },
        ],
      },
      options: {
        ...this.config.chartOptions,
        scales: {
          x: {
            ...this.config.chartOptions.scales.x,
            title: {
              display: true,
              text: "Test Number",
              color: "rgba(255,255,255,0.5)",
            },
          },
          y: {
            ...this.config.chartOptions.scales.y,
            title: {
              display: true,
              text: "Score",
              color: "rgba(255,255,255,0.5)",
            },
          },
        },
      },
    });
  },

  renderDotChart(hasData) {
    const ctx = document.getElementById("dotChart").getContext("2d");
    const data = hasData
      ? this.data.tests.map((t, i) => ({ x: i + 1, y: t.score }))
      : [{ x: 0, y: 0 }];

    // A Dot Chart is essentially a scatter plot with no lines and distinct dots.
    // We'll use a bubble chart with a fixed radius to give it a "Dot" feel.
    this.data.charts.dot = new Chart(ctx, {
      type: "bubble",
      data: {
        datasets: [
          {
            label: "Test Dots",
            data: hasData
              ? data.map((d) => ({ ...d, r: 10 }))
              : [{ x: 0, y: 0, r: 0 }],
            backgroundColor: this.config.colors[7],
          },
        ],
      },
      options: this.config.chartOptions,
    });

    if (!hasData) {
      this.addNoDataOverlay("dotChart");
    }
  },

  addNoDataOverlay(canvasId) {
    // Optional: Add a "0" or "No Data" text over the canvas if needed
    // For now, the charts will just show [0,0] which is what was requested.
    console.log(`No data available for ${canvasId}`);
  },
};

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  AnalyticsEngine.init();
});
