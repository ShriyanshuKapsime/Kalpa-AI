/* ============================================
   KALPA AI — Charts Module
   Chart.js wrapper utilities
   ============================================ */

const KalpaCharts = {

    /* Default colors matching the design system */
    colors: {
        primary: '#2563EB',
        primaryLight: 'rgba(37, 99, 235, 0.1)',
        success: '#16A34A',
        successLight: 'rgba(22, 163, 74, 0.1)',
        warning: '#D97706',
        warningLight: 'rgba(217, 119, 6, 0.1)',
        danger: '#DC2626',
        info: '#0EA5E9',
        purple: '#7C3AED',
        gray: '#94A3B8',
        grayLight: '#F1F5F9',
    },

    /* Palette for multi-series */
    palette: [
        '#2563EB', '#16A34A', '#D97706', '#DC2626', '#7C3AED',
        '#0EA5E9', '#F59E0B', '#EC4899', '#10B981', '#6366F1',
    ],

    /* Base chart config */
    _baseConfig() {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                    labels: {
                        font: { family: "'Inter', sans-serif", size: 12 },
                        color: '#64748B',
                        padding: 16,
                        usePointStyle: true,
                        pointStyleWidth: 10,
                    },
                },
                tooltip: {
                    backgroundColor: '#1E293B',
                    titleFont: { family: "'Inter', sans-serif", size: 13, weight: '600' },
                    bodyFont: { family: "'Inter', sans-serif", size: 12 },
                    padding: { top: 10, bottom: 10, left: 14, right: 14 },
                    cornerRadius: 8,
                    displayColors: true,
                    boxPadding: 4,
                },
            },
        };
    },

    /* ============================================
       LINE CHART
       ============================================ */
    createLineChart(canvasId, labels, data, options = {}) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return null;

        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, options.gradientStart || 'rgba(37, 99, 235, 0.15)');
        gradient.addColorStop(1, options.gradientEnd || 'rgba(37, 99, 235, 0)');

        return new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: options.label || 'Value',
                    data,
                    borderColor: options.color || this.colors.primary,
                    backgroundColor: gradient,
                    borderWidth: 2.5,
                    pointBackgroundColor: options.color || this.colors.primary,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    tension: 0.4,
                    fill: true,
                }],
            },
            options: {
                ...this._baseConfig(),
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: {
                            font: { family: "'Inter', sans-serif", size: 11 },
                            color: '#94A3B8',
                            maxRotation: 0,
                        },
                        border: { display: false },
                    },
                    y: {
                        grid: { color: '#F1F5F9', drawBorder: false },
                        ticks: {
                            font: { family: "'Inter', sans-serif", size: 11 },
                            color: '#94A3B8',
                            callback: options.yCallback || null,
                        },
                        border: { display: false },
                        beginAtZero: true,
                    },
                },
                plugins: {
                    ...this._baseConfig().plugins,
                    tooltip: {
                        ...this._baseConfig().plugins.tooltip,
                        callbacks: {
                            label: options.tooltipCallback || null,
                        },
                    },
                },
            },
        });
    },

    /* ============================================
       BAR CHART
       ============================================ */
    createBarChart(canvasId, labels, data, options = {}) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return null;

        const ctx = canvas.getContext('2d');
        const colors = options.colors || labels.map((_, i) => this.palette[i % this.palette.length]);

        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: options.label || 'Value',
                    data,
                    backgroundColor: colors,
                    borderColor: 'transparent',
                    borderWidth: 0,
                    borderRadius: 6,
                    borderSkipped: false,
                    barPercentage: 0.6,
                    categoryPercentage: 0.7,
                }],
            },
            options: {
                ...this._baseConfig(),
                indexAxis: options.horizontal ? 'y' : 'x',
                scales: {
                    x: {
                        grid: { display: options.horizontal ? true : false, color: '#F1F5F9', drawBorder: false },
                        ticks: {
                            font: { family: "'Inter', sans-serif", size: 11 },
                            color: '#94A3B8',
                            callback: options.horizontal ? (options.xCallback || null) : null,
                        },
                        border: { display: false },
                        beginAtZero: options.horizontal,
                    },
                    y: {
                        grid: { display: options.horizontal ? false : true, color: '#F1F5F9', drawBorder: false },
                        ticks: {
                            font: { family: "'Inter', sans-serif", size: 11 },
                            color: '#94A3B8',
                            callback: options.horizontal ? null : (options.yCallback || null),
                        },
                        border: { display: false },
                        beginAtZero: !options.horizontal,
                    },
                },
            },
        });
    },

    /* ============================================
       DOUGHNUT CHART
       ============================================ */
    createDoughnutChart(canvasId, labels, data, options = {}) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return null;

        const ctx = canvas.getContext('2d');
        const colors = options.colors || labels.map((_, i) => this.palette[i % this.palette.length]);

        return new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels,
                datasets: [{
                    data,
                    backgroundColor: colors,
                    borderWidth: 2,
                    borderColor: '#fff',
                    hoverBorderWidth: 0,
                    hoverOffset: 6,
                }],
            },
            options: {
                ...this._baseConfig(),
                cutout: options.cutout || '70%',
                plugins: {
                    ...this._baseConfig().plugins,
                    legend: {
                        ...this._baseConfig().plugins.legend,
                        display: options.showLegend !== false,
                        position: options.legendPosition || 'bottom',
                    },
                    tooltip: {
                        ...this._baseConfig().plugins.tooltip,
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const pct = Math.round((context.raw / total) * 100);
                                const prefix = options.valuePrefix || '';
                                return ` ${context.label}: ${prefix}${context.raw.toLocaleString('en-IN')} (${pct}%)`;
                            },
                        },
                    },
                },
            },
        });
    },

    /* ============================================
       AREA CHART (filled line)
       ============================================ */
    createAreaChart(canvasId, labels, datasets, options = {}) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return null;

        const ctx = canvas.getContext('2d');
        const chartDatasets = datasets.map((ds, i) => {
            const color = ds.color || this.palette[i];
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, this._hexToRgba(color, 0.15));
            gradient.addColorStop(1, this._hexToRgba(color, 0));

            return {
                label: ds.label,
                data: ds.data,
                borderColor: color,
                backgroundColor: gradient,
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 5,
                pointBackgroundColor: color,
                tension: 0.4,
                fill: true,
            };
        });

        return new Chart(ctx, {
            type: 'line',
            data: { labels, datasets: chartDatasets },
            options: {
                ...this._baseConfig(),
                interaction: { mode: 'index', intersect: false },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { font: { family: "'Inter', sans-serif", size: 11 }, color: '#94A3B8' },
                        border: { display: false },
                    },
                    y: {
                        grid: { color: '#F1F5F9', drawBorder: false },
                        ticks: {
                            font: { family: "'Inter', sans-serif", size: 11 },
                            color: '#94A3B8',
                            callback: options.yCallback || null,
                        },
                        border: { display: false },
                        beginAtZero: true,
                    },
                },
                plugins: {
                    ...this._baseConfig().plugins,
                    legend: {
                        ...this._baseConfig().plugins.legend,
                        display: datasets.length > 1,
                    },
                },
            },
        });
    },

    /* ============================================
       UTILITY: Hex to RGBA
       ============================================ */
    _hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    },

    /* ============================================
       UTILITY: Destroy existing chart
       ============================================ */
    destroyChart(chartInstance) {
        if (chartInstance) {
            chartInstance.destroy();
        }
    },
};
