// ============================================================
// sidebar.js — Shared sidebar renderer for all dashboard pages
// Include BEFORE the page-specific script.
// Usage: <script src="./sidebar.js"></script>
// The page must set  window.ACTIVE_NAV = 'dashboard' (etc.)
//   before this script runs, OR this script reads it after DOM.
// ============================================================

(function () {
    const SIDEBAR_HTML = `
    <aside class="sidebar" id="sidebar">
        <div class="sidebar-header">
            <a href="dashboard.html" style="display:flex;align-items:center;gap:var(--spacing-md);text-decoration:none;">
                <span class="sidebar-logo">QH</span>
                <span class="sidebar-logo-text">QuickHire</span>
            </a>
        </div>
        <nav class="sidebar-nav">
            <a href="dashboard.html" class="nav-item" data-nav="dashboard">
                <i data-feather="home"></i>
                <span>Dashboard</span>
            </a>
            <a href="jobs.html" class="nav-item" data-nav="jobs">
                <i data-feather="briefcase"></i>
                <span>Job Postings</span>
            </a>
            <a href="candidates.html" class="nav-item" data-nav="candidates">
                <i data-feather="users"></i>
                <span>Candidate Pool</span>
            </a>
            <a href="analytics.html" class="nav-item" data-nav="analytics">
                <i data-feather="bar-chart-2"></i>
                <span>Analytics</span>
            </a>
            <a href="settings.html" class="nav-item" data-nav="settings">
                <i data-feather="settings"></i>
                <span>Settings</span>
            </a>
        </nav>
        <div class="sidebar-footer">
            <div class="user-profile">
                <div class="user-avatar">AU</div>
                <div class="user-info">
                    <span class="user-name">Admin User</span>
                    <span class="user-email">admin@quickhire.com</span>
                </div>
            </div>
            <a href="../landing%20page/index.html" class="logout-link" title="Logout">
                <i data-feather="log-out"></i>
            </a>
        </div>
    </aside>`;

    // Inject sidebar at the very start of <body>
    document.body.insertAdjacentHTML('afterbegin', SIDEBAR_HTML);

    // Highlight active nav link based on current page
    const page = window.location.pathname.split('/').pop() || 'index.html';
    const pageToNav = {
        'dashboard.html': 'dashboard',
        'jobs.html':       'jobs',
        'candidates.html': 'candidates',
        'analytics.html':  'analytics',
        'settings.html':   'settings'
    };
    const activeKey = pageToNav[page] || 'dashboard';
    const activeLink = document.querySelector(`.nav-item[data-nav="${activeKey}"]`);
    if (activeLink) activeLink.classList.add('active');

    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('mobile-open');
        });
    }
})();
