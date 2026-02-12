document.addEventListener('DOMContentLoaded', () => {
    if (window.feather) feather.replace();
    renderBarChart();
    renderDeptBreakdown();
    renderFunnel();
    renderSkillsDemand();
    renderRecentHires();
    setupExport();
});

function renderBarChart() {
    const el = document.getElementById('app-chart');
    if (!el) return;
    const weeks = [
        { label:'Week 1', val:42 },
        { label:'Week 2', val:58 },
        { label:'Week 3', val:51 },
        { label:'Week 4', val:63 }
    ];
    const max = Math.max(...weeks.map(w => w.val));
    el.innerHTML = weeks.map(w => {
        const pct = (w.val / max) * 100;
        return `<div class="bar-col">
            <div class="bar-val">${w.val}</div>
            <div class="bar" style="height:${pct}%;"></div>
            <div class="bar-label">${w.label}</div>
        </div>`;
    }).join('');
}

function renderDeptBreakdown() {
    const el = document.getElementById('dept-breakdown');
    if (!el) return;
    const depts = [
        { name:'Engineering',  count:102, color:'var(--color-primary)' },
        { name:'Product',      count:38,  color:'var(--color-secondary)' },
        { name:'Design',       count:31,  color:'var(--color-warning)' },
        { name:'Sales',        count:24,  color:'var(--color-success)' },
        { name:'HR',           count:19,  color:'var(--color-danger)' }
    ];
    const max = Math.max(...depts.map(d => d.count));
    el.innerHTML = depts.map(d => {
        const pct = Math.round((d.count / max) * 100);
        return `<div class="progress-row">
            <div class="progress-row-header">
                <span>${d.name}</span>
                <span class="pct">${d.count}</span>
            </div>
            <div class="progress-track">
                <div class="progress-fill-bar" style="width:${pct}%;background:${d.color};"></div>
            </div>
        </div>`;
    }).join('');
}

function renderFunnel() {
    const el = document.getElementById('funnel-chart');
    if (!el) return;
    const stages = [
        { label:'Applications',   count:214, color:'var(--color-primary)' },
        { label:'Screened',       count:168, color:'var(--color-text-high)' },
        { label:'Shortlisted',    count:52,  color:'var(--color-warning)' },
        { label:'Interviewed',    count:26,  color:'var(--color-warning)' },
        { label:'Hired',          count:14,  color:'var(--color-success)' }
    ];
    const max = stages[0].count;
    el.innerHTML = stages.map((s, i) => {
        const pct = Math.round((s.count / max) * 100);
        const convRate = i > 0 ? ' (' + Math.round((s.count / stages[i-1].count)*100) + '% from prev)' : '';
        return `<div style="margin-bottom:var(--spacing-sm);">
            <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                <span style="font-size:var(--font-size-xs);color:var(--color-text-low);">${s.label}<span style="color:var(--color-text-disabled);">${convRate}</span></span>
                <span style="font-size:var(--font-size-xs);font-weight:700;color:var(--color-text-high);">${s.count}</span>
            </div>
            <div style="height:20px;background:var(--color-elevated);border-radius:4px;overflow:hidden;">
                <div style="height:100%;width:${pct}%;background:${s.color};border-radius:4px;transition:width 0.6s ease;"></div>
            </div>
        </div>`;
    }).join('');
}

// ─── Top Skills in Demand ───────────────────────────────────
function renderSkillsDemand() {
    const el = document.getElementById('skills-demand');
    if (!el) return;
    const skills = [
        { name:'React',        postings:8 },
        { name:'TypeScript',   postings:7 },
        { name:'AWS',          postings:6 },
        { name:'Node.js',      postings:6 },
        { name:'Python',       postings:5 },
        { name:'Docker',       postings:5 },
        { name:'Kubernetes',   postings:4 },
        { name:'GraphQL',      postings:3 }
    ];
    el.innerHTML = `<div style="display:flex;flex-wrap:wrap;gap:var(--spacing-sm);">` +
        skills.map(s => `
            <div style="display:flex;align-items:center;gap:8px;background:var(--color-elevated);border-radius:20px;padding:6px 12px;">
                <span class="pill-tag" style="margin:0;">${s.name}</span>
                <span style="font-size:var(--font-size-xs);color:var(--color-text-disabled);">${s.postings} jobs</span>
            </div>
        `).join('') + '</div>';
}

function renderRecentHires() {
    const tbody = document.getElementById('hires-tbody');
    if (!tbody) return;
    const hires = [
        { name:'Tom Bradley',    role:'DevOps Engineer',    dept:'Engineering', match:90, days:14, date:'Jan 15, 2026' },
        { name:'Lisa Zhang',     role:'UI/UX Designer',     dept:'Design',      match:93, days:19, date:'Jan 10, 2026' },
        { name:'Sarah Chen',     role:'Senior Backend Dev', dept:'Engineering', match:95, days:12, date:'Jan 5, 2026'  },
        { name:'Kevin Park',     role:'Product Manager',    dept:'Product',     match:79, days:22, date:'Dec 28, 2025' },
        { name:'Emily Rodriguez',role:'DevOps Engineer',    dept:'Engineering', match:91, days:16, date:'Dec 20, 2025' }
    ];
    tbody.innerHTML = hires.map(h => {
        const color = h.match >= 90 ? '#00D466' : h.match >= 70 ? '#FFD700' : '#FF4444';
        const circ  = 2 * Math.PI * 16;
        const off   = circ * (1 - h.match / 100);
        const initials = h.name.split(' ').map(n => n[0]).join('');
        return `<tr>
            <td style="display:flex;align-items:center;gap:10px;">
                <div class="avatar-sm">${initials}</div>
                <span style="color:var(--color-text-high);font-weight:600;font-size:var(--font-size-sm);">${h.name}</span>
            </td>
            <td style="font-size:var(--font-size-sm);color:var(--color-primary);">${h.role}</td>
            <td>${h.dept}</td>
            <td><div class="mini-ring">
                <svg width="44" height="44" viewBox="0 0 44 44" style="transform:rotate(-90deg);">
                    <circle cx="22" cy="22" r="16" fill="none" stroke="#2A2A2A" stroke-width="4"/>
                    <circle cx="22" cy="22" r="16" fill="none" stroke="${color}" stroke-width="4" stroke-dasharray="${circ}" stroke-dashoffset="${off}" stroke-linecap="round"/>
                </svg><div class="ring-label" style="color:${color}">${h.match}%</div></div></td>
            <td style="color:var(--color-text-low);font-size:var(--font-size-sm);">${h.days} days</td>
            <td style="font-size:var(--font-size-xs);color:var(--color-text-disabled);">${h.date}</td>
        </tr>`;
    }).join('');
}

function setupExport() {
    const exportBtn = document.getElementById('export-btn');
    const timeRange = document.getElementById('time-range');
    if (exportBtn) exportBtn.addEventListener('click', () => toast('Analytics report exported as CSV'));
    if (timeRange) timeRange.addEventListener('change', () => toast('Refreshing data for selected range…'));
}
