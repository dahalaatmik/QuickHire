// Animation / UI only — activity, candidates, upload, and actions handled by Python
document.addEventListener('DOMContentLoaded', () => {
    if (window.feather) feather.replace();
    setupDrawer();
    setupModal();
});

function setupDrawer() {
    const backdrop = document.getElementById('drawer-backdrop');
    const closeBtn = document.getElementById('drawer-close');
    if (backdrop) backdrop.addEventListener('click', closeDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeDrawer(); closeScheduleModal(); } });
}

function closeDrawer() {
    const drawer = document.getElementById('candidate-drawer');
    if (drawer) drawer.classList.remove('active');
}

function setupModal() {
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalClose = document.getElementById('modal-close');
    const modalCancel = document.getElementById('modal-cancel');
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeScheduleModal);
    if (modalClose) modalClose.addEventListener('click', closeScheduleModal);
    if (modalCancel) modalCancel.addEventListener('click', closeScheduleModal);
}

function closeScheduleModal() {
    const modal = document.getElementById('schedule-modal');
    if (modal) modal.classList.remove('active');
}
