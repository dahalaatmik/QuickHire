// Animation / UI only — candidate list, search, and actions handled by Python
document.addEventListener('DOMContentLoaded', () => {
    if (window.feather) feather.replace();
    setupDrawer();
});

function setupDrawer() {
    const backdrop = document.getElementById('cand-drawer-backdrop');
    const closeBtn = document.getElementById('cd-close');
    if (backdrop) backdrop.addEventListener('click', closeDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
}

function closeDrawer() {
    const drawer = document.getElementById('cand-drawer');
    if (drawer) drawer.classList.remove('active');
}
