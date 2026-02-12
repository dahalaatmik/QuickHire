// Animation / UI only — job data, search, and create handled by Python
document.addEventListener('DOMContentLoaded', () => {
    if (window.feather) feather.replace();
    setupNewJobModal();
});

function setupNewJobModal() {
    const modal = document.getElementById('new-job-modal');
    const openBtn = document.getElementById('new-job-btn');
    const backdrop = document.getElementById('njm-backdrop');
    const closeBtn = document.getElementById('njm-close');
    const cancel = document.getElementById('njm-cancel');
    if (!modal || !openBtn) return;
    openBtn.addEventListener('click', () => {
        modal.classList.add('active');
        if (window.feather) feather.replace();
    });
    if (backdrop) backdrop.addEventListener('click', () => modal.classList.remove('active'));
    if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    if (cancel) cancel.addEventListener('click', () => modal.classList.remove('active'));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') modal.classList.remove('active'); });
}
