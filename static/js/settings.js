// settings.js
document.addEventListener('DOMContentLoaded', () => {
    feather.replace();
    setupTabs();
    setupToggles();
    setupDangerZone();
});

function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const panels  = document.querySelectorAll('.tab-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;
            
            // Update active states
            tabBtns.forEach(b => b.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            
            btn.classList.add('active');
            const panel = document.querySelector(`[data-panel="${target}"]`);
            if (panel) panel.classList.add('active');
        });
    });
}

function setupToggles() {
    // All toggles show toast when changed
    document.querySelectorAll('.toggle input').forEach(inp => {
        inp.addEventListener('change', e => {
            const label = e.target.closest('.settings-row').querySelector('h4').textContent;
            const state = e.target.checked ? 'enabled' : 'disabled';
            toast(`${label} ${state}`);
        });
    });

    // Input changes
    document.getElementById('org-name').addEventListener('change', e => {
        toast('Organization name updated');
    });
    document.getElementById('industry').addEventListener('change', e => {
        toast('Industry updated to: ' + e.target.value);
    });
    document.getElementById('company-size').addEventListener('change', e => {
        toast('Company size updated');
    });
    document.getElementById('match-threshold').addEventListener('change', e => {
        toast('Match threshold set to: ' + e.target.value);
    });
}

function setupDangerZone() {
    document.querySelectorAll('.btn-danger-solid').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.textContent.trim();
            if (confirm(`Are you absolutely sure you want to: ${action}? This action CANNOT be undone.`)) {
                toast('Action cancelled — demo mode', 'error');
            }
        });
    });
}
