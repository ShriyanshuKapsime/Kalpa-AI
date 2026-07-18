/* ============================================
   KALPA AI — Layout Module
   Sidebar + Navbar injection, navigation, notifications
   ============================================ */

const KalpaLayout = {

    /* Lucide SVG icons used throughout the app */
    icons: {
        dashboard: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>',
        package: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16.5 9.4 7.55 4.24"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" x2="12" y1="22" y2="12"/></svg>',
        inventory: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',
        orders: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V6.5L15.5 2z"/><path d="M3 7.6v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8"/><path d="M15 2v5h5"/></svg>',
        customers: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
        analytics: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>',
        copilot: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>',
        settings: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',
        search: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
        bell: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
        chevronLeft: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
        chevronDown: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
        logout: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>',
        user: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
        plus: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
        menu: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>',
        x: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
        check: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
        edit: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>',
        trash: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',
        eye: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>',
        eyeOff: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>',
        upload: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>',
        store: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7"/></svg>',
        notification: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
    },

    /* ============================================
       INITIALIZE LAYOUT
       ============================================ */
    init() {
        if (!KalpaAuth.requireAuth()) return;

        /* Generate mock data on first load */
        if (typeof KalpaStore !== 'undefined' && !KalpaStore.isMockDataGenerated()) {
            KalpaStore.generateMockData();
        }

        this.renderSidebar();
        this.renderNavbar();
        this.renderOverlay();
        this.setActivePage();
        this.initSidebarToggle();
        this.initProfileDropdown();
        this.initMobileMenu();

        /* Restore sidebar state */
        if (localStorage.getItem('kalpa_sidebar_collapsed') === 'true') {
            document.body.classList.add('sidebar-collapsed');
        }
    },

    /* ============================================
       RENDER SIDEBAR
       ============================================ */
    renderSidebar() {
        const merchant = KalpaAuth.getCurrentMerchant();
        const unread = typeof KalpaStore !== 'undefined' ? KalpaStore.getUnreadCount() : 0;
        const initial = merchant ? merchant.name.charAt(0).toUpperCase() : 'K';

        const sidebar = document.createElement('aside');
        sidebar.className = 'sidebar';
        sidebar.id = 'app-sidebar';
        sidebar.innerHTML = `
            <div class="sidebar-logo">
                <div class="sidebar-logo-icon">K</div>
                <div class="sidebar-logo-text">
                    <div class="brand">Kalpa<span>AI</span></div>
                    <div class="tagline">Commerce OS</div>
                </div>
            </div>

            <nav class="sidebar-nav">
                <div class="sidebar-section">
                    <div class="sidebar-section-label">Main</div>
                    <a href="dashboard.html" class="sidebar-link" data-page="dashboard">
                        ${this.icons.dashboard}
                        <span>Dashboard</span>
                    </a>
                    <a href="products.html" class="sidebar-link" data-page="products">
                        ${this.icons.package}
                        <span>Products</span>
                    </a>
                    <a href="inventory.html" class="sidebar-link" data-page="inventory">
                        ${this.icons.inventory}
                        <span>Inventory</span>
                    </a>
                    <a href="orders.html" class="sidebar-link" data-page="orders">
                        ${this.icons.orders}
                        <span>Orders</span>
                    </a>
                    <a href="customers.html" class="sidebar-link" data-page="customers">
                        ${this.icons.customers}
                        <span>Customers</span>
                    </a>
                </div>

                <div class="sidebar-section">
                    <div class="sidebar-section-label">Intelligence</div>
                    <a href="analytics.html" class="sidebar-link" data-page="analytics">
                        ${this.icons.analytics}
                        <span>Analytics</span>
                    </a>
                    <a href="ai-copilot.html" class="sidebar-link" data-page="ai-copilot">
                        ${this.icons.copilot}
                        <span>AI Copilot</span>
                    </a>
                </div>

                <div class="sidebar-section">
                    <div class="sidebar-section-label">System</div>
                    <a href="notifications.html" class="sidebar-link" data-page="notifications">
                        ${this.icons.notification}
                        <span>Notifications</span>
                        ${unread > 0 ? `<span class="sidebar-badge">${unread}</span>` : ''}
                    </a>
                    <a href="settings.html" class="sidebar-link" data-page="settings">
                        ${this.icons.settings}
                        <span>Settings</span>
                    </a>
                </div>
            </nav>

            <div class="sidebar-footer">
                <div class="sidebar-user" id="sidebar-user-btn">
                    <div class="avatar avatar-sm">${initial}</div>
                    <div class="sidebar-user-info">
                        <div class="sidebar-user-name">${merchant ? merchant.name : 'Merchant'}</div>
                        <div class="sidebar-user-email">${merchant ? merchant.email : ''}</div>
                    </div>
                </div>
            </div>

            <button class="sidebar-toggle" id="sidebar-toggle-btn" title="Toggle sidebar">
                ${this.icons.chevronLeft}
            </button>
        `;

        document.body.insertBefore(sidebar, document.body.firstChild);
    },

    /* ============================================
       RENDER NAVBAR
       ============================================ */
    renderNavbar() {
        const merchant = KalpaAuth.getCurrentMerchant();
        const unread = typeof KalpaStore !== 'undefined' ? KalpaStore.getUnreadCount() : 0;
        const initial = merchant ? merchant.name.charAt(0).toUpperCase() : 'K';

        const navbar = document.createElement('header');
        navbar.className = 'navbar';
        navbar.id = 'app-navbar';
        navbar.innerHTML = `
            <div class="navbar-left">
                <button class="navbar-btn md-only" id="mobile-menu-btn">
                    ${this.icons.menu}
                </button>
                <div class="navbar-search">
                    ${this.icons.search}
                    <input type="text" placeholder="Search products, orders, customers..." id="navbar-search-input">
                </div>
            </div>

            <div class="navbar-right">
                <a href="notifications.html" class="navbar-btn" title="Notifications" id="navbar-notifications-btn">
                    ${this.icons.bell}
                    ${unread > 0 ? '<span class="notification-dot"></span>' : ''}
                </a>

                <div class="dropdown" id="navbar-profile-dropdown">
                    <div class="navbar-profile" id="navbar-profile-btn">
                        <div class="navbar-profile-info md-hidden">
                            <div class="navbar-profile-name">${merchant ? merchant.name : 'Merchant'}</div>
                            <div class="navbar-profile-role">${merchant ? merchant.businessName : 'Store'}</div>
                        </div>
                        <div class="avatar avatar-sm">${initial}</div>
                    </div>
                    <div class="dropdown-menu" id="profile-dropdown-menu">
                        <a href="settings.html" class="dropdown-item">
                            ${this.icons.user}
                            Profile & Settings
                        </a>
                        <a href="onboarding.html" class="dropdown-item">
                            ${this.icons.store}
                            Store Setup
                        </a>
                        <div class="dropdown-divider"></div>
                        <button class="dropdown-item danger" id="logout-btn">
                            ${this.icons.logout}
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        `;

        /* Insert navbar into .app-main if exists, otherwise after sidebar */
        const appMain = document.querySelector('.app-main');
        if (appMain) {
            appMain.insertBefore(navbar, appMain.firstChild);
        } else {
            document.body.appendChild(navbar);
        }

        /* Logout handler */
        document.getElementById('logout-btn').addEventListener('click', () => {
            KalpaAuth.logout();
        });
    },

    /* ============================================
       SIDEBAR OVERLAY (mobile)
       ============================================ */
    renderOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        overlay.id = 'sidebar-overlay';
        document.body.appendChild(overlay);

        overlay.addEventListener('click', () => {
            document.body.classList.remove('sidebar-open');
        });
    },

    /* ============================================
       ACTIVE PAGE HIGHLIGHT
       ============================================ */
    setActivePage() {
        const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'dashboard';
        const links = document.querySelectorAll('.sidebar-link');
        links.forEach(link => {
            if (link.dataset.page === currentPage) {
                link.classList.add('active');
            }
        });
    },

    /* ============================================
       SIDEBAR TOGGLE
       ============================================ */
    initSidebarToggle() {
        const btn = document.getElementById('sidebar-toggle-btn');
        if (!btn) return;

        btn.addEventListener('click', () => {
            document.body.classList.toggle('sidebar-collapsed');
            const isCollapsed = document.body.classList.contains('sidebar-collapsed');
            localStorage.setItem('kalpa_sidebar_collapsed', isCollapsed);
        });
    },

    /* ============================================
       MOBILE MENU
       ============================================ */
    initMobileMenu() {
        const btn = document.getElementById('mobile-menu-btn');
        if (!btn) return;

        btn.addEventListener('click', () => {
            document.body.classList.toggle('sidebar-open');
        });
    },

    /* ============================================
       PROFILE DROPDOWN
       ============================================ */
    initProfileDropdown() {
        const btn = document.getElementById('navbar-profile-btn');
        const menu = document.getElementById('profile-dropdown-menu');
        if (!btn || !menu) return;

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('#navbar-profile-dropdown')) {
                menu.classList.remove('open');
            }
        });
    },

    /* ============================================
       UTILITY: FORMAT CURRENCY
       ============================================ */
    formatCurrency(amount) {
        if (amount >= 100000) {
            return '₹' + (amount / 100000).toFixed(1) + 'L';
        }
        if (amount >= 1000) {
            return '₹' + amount.toLocaleString('en-IN');
        }
        return '₹' + amount;
    },

    /* ============================================
       UTILITY: FORMAT DATE
       ============================================ */
    formatDate(dateStr) {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    },

    formatDateTime(dateStr) {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    },

    formatRelativeTime(dateStr) {
        const now = new Date();
        const d = new Date(dateStr);
        const diffMs = now - d;
        const diffMin = Math.floor(diffMs / 60000);
        const diffHr = Math.floor(diffMs / 3600000);
        const diffDay = Math.floor(diffMs / 86400000);

        if (diffMin < 1) return 'Just now';
        if (diffMin < 60) return `${diffMin}m ago`;
        if (diffHr < 24) return `${diffHr}h ago`;
        if (diffDay < 7) return `${diffDay}d ago`;
        return this.formatDate(dateStr);
    },

    /* ============================================
       UTILITY: STATUS BADGE HTML
       ============================================ */
    statusBadge(status) {
        const map = {
            active: { cls: 'badge-success', label: 'Active' },
            draft: { cls: 'badge-gray', label: 'Draft' },
            pending: { cls: 'badge-warning', label: 'Pending' },
            processing: { cls: 'badge-info', label: 'Processing' },
            shipped: { cls: 'badge-purple', label: 'Shipped' },
            delivered: { cls: 'badge-success', label: 'Delivered' },
            cancelled: { cls: 'badge-danger', label: 'Cancelled' },
            'in-stock': { cls: 'badge-success', label: 'In Stock' },
            'low-stock': { cls: 'badge-warning', label: 'Low Stock' },
            'out-of-stock': { cls: 'badge-danger', label: 'Out of Stock' },
        };
        const info = map[status] || { cls: 'badge-gray', label: status };
        return `<span class="badge ${info.cls}"><span class="badge-dot"></span> ${info.label}</span>`;
    },

    /* ============================================
       UTILITY: CONFIDENCE BADGE
       ============================================ */
    confidenceBadge(score) {
        const pct = Math.round(score * 100);
        let cls = 'high';
        if (score < 0.6) cls = 'low';
        else if (score < 0.8) cls = 'medium';
        return `<span class="confidence-badge ${cls}"><span class="confidence-dot"></span> ${pct}%</span>`;
    },

    /* ============================================
       UTILITY: STOCK STATUS
       ============================================ */
    stockStatus(stock) {
        if (stock === 0) return 'out-of-stock';
        if (stock <= 10) return 'low-stock';
        return 'in-stock';
    },

    /* ============================================
       UTILITY: RENDER PAGINATION
       ============================================ */
    renderPagination(container, currentPage, totalPages, onPageChange) {
        if (totalPages <= 1) { container.innerHTML = ''; return; }

        let html = `<div class="pagination-info">Page ${currentPage} of ${totalPages}</div>`;
        html += '<div class="pagination-controls">';
        html += `<button class="pagination-btn" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''}>Prev</button>`;

        const start = Math.max(1, currentPage - 2);
        const end = Math.min(totalPages, currentPage + 2);

        for (let i = start; i <= end; i++) {
            html += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }

        html += `<button class="pagination-btn" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>`;
        html += '</div>';

        container.innerHTML = html;
        container.querySelectorAll('.pagination-btn:not(:disabled)').forEach(btn => {
            btn.addEventListener('click', () => {
                onPageChange(parseInt(btn.dataset.page));
            });
        });
    },
};
