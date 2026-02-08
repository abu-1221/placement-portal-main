/**
 * PlaceMe - Simplified Analytics Module
 * Focused on student test scores tracking
 */

const AnalyticsEngine = {
    data: {
        tests: [],
        charts: {}
    },
    
    config: {
        colors: {
            primary: '#667eea',
            secondary: '#764ba2',
            success: '#10b981',
            danger: '#ef4444', 
            warning: '#f59e0b',
            info: '#06b6d4'
        }
    },

    // Initialize the analytics engine
    init() {
        const user = JSON.parse(sessionStorage.getItem('user') || '{}');
        if (user.type !== 'student') return;
        
        this.data.tests = user.testsCompleted || [];
        
        // Initialize all charts regardless of data
        this.createBarChart();
        this.createPieChart();
        this.createLineChart();
        this.createScatterChart();
        this.createDotChart();
    },

    // Optional: Helper to generate empty/placeholder data if we wanted dummy visuals,
    // but user requested "normal analytics charts as no scores", so empty charts are appropriate.
    
    getCommonOptions(title) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#fff' }
                },
                title: {
                    display: !!title,
                    text: title,
                    color: '#fff'
                }
            },
            scales: {
                x: {
                    ticks: { color: 'rgba(255,255,255,0.7)' },
                    grid: { color: 'rgba(255,255,255,0.1)' }
                },
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { color: 'rgba(255,255,255,0.7)' },
                    grid: { color: 'rgba(255,255,255,0.1)' }
                }
            }
        };
    },

    createBarChart() {
        const ctx = document.getElementById('barChart');
        if (!ctx) return;
        
        const labels = this.data.tests.map((t, i) => t.testName || `Test ${i+1}`);
        const data = this.data.tests.map(t => t.score);
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Score',
                    data: data,
                    backgroundColor: 'rgba(102, 126, 234, 0.7)',
                    borderColor: '#667eea',
                    borderWidth: 1
                }]
            },
            options: this.getCommonOptions()
        });
    },

    createPieChart() {
        const ctx = document.getElementById('pieChart');
        if (!ctx) return;
        
        const passed = this.data.tests.filter(t => t.status === 'passed').length;
        const failed = this.data.tests.length - passed;
        
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Passed', 'Failed'],
                datasets: [{
                    data: [passed, failed],
                    backgroundColor: [this.config.colors.success, this.config.colors.danger],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#fff' }
                    }
                }
            }
        });
    },

    createLineChart() {
        const ctx = document.getElementById('lineChart');
        if (!ctx) return;
        
        const labels = this.data.tests.map((t, i) => `Test ${i+1}`);
        const data = this.data.tests.map(t => t.score);
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Score Trend',
                    data: data,
                    borderColor: this.config.colors.info,
                    backgroundColor: 'rgba(6, 182, 212, 0.2)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: this.getCommonOptions()
        });
    },

    createScatterChart() {
        const ctx = document.getElementById('scatterChart');
        if (!ctx) return;
        
        // Scatter: x = test index, y = score
        const data = this.data.tests.map((t, i) => ({
            x: i + 1,
            y: t.score
        }));
        
        new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Performance Scatter',
                    data: data,
                    backgroundColor: this.config.colors.warning
                }]
            },
            options: {
                ...this.getCommonOptions(),
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: { display: true, text: 'Test Number', color: '#fff' },
                        ticks: { color: '#fff', stepSize: 1 },
                        grid: { color: 'rgba(255,255,255,0.1)' }
                    },
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: { display: true, text: 'Score', color: '#fff' },
                        ticks: { color: '#fff' },
                        grid: { color: 'rgba(255,255,255,0.1)' }
                    }
                }
            }
        });
    },

    createDotChart() {
        const ctx = document.getElementById('dotChart');
        if (!ctx) return;
        
        // Dot chart - using Bubble chart with fixed radius to simulate dot plot
        const data = this.data.tests.map((t, i) => ({
            x: i + 1,
            y: t.score,
            r: 8 // fixed radius
        }));
        
        new Chart(ctx, {
            type: 'bubble',
            data: {
                datasets: [{
                    label: 'Test Points',
                    data: data,
                    backgroundColor: this.config.colors.secondary,
                    borderColor: '#fff',
                    borderWidth: 1
                }]
            },
            options: {
                ...this.getCommonOptions(),
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: { display: true, text: 'Test Sequence', color: '#fff' },
                        ticks: { color: '#fff', stepSize: 1 },
                        grid: { color: 'rgba(255,255,255,0.1)' }
                    },
                    y: {
                        beginAtZero: true,
                        max: 105, // slightly more to show top bubbles
                        title: { display: true, text: 'Score', color: '#fff' },
                        ticks: { color: '#fff' },
                        grid: { color: 'rgba(255,255,255,0.1)' }
                    }
                }
            }
        });
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    AnalyticsEngine.init();
});
