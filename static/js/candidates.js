document.addEventListener('DOMContentLoaded', () => {
    if (window.feather) feather.replace();
    renderCandidates();
    setupSearch();
    setupDrawer();
    const importBtn = document.getElementById('import-btn');
    if (importBtn) importBtn.addEventListener('click', () => toast('CSV import — select a file to begin', 'success'));
});

const roleLabels = { backend:'Senior Backend Dev', frontend:'Frontend Lead', pm:'Product Manager', designer:'UI/UX Designer', devops:'DevOps Engineer' };

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

const candidates = [
    { id:1,  name:'Sarah Chen',       email:'sarah.chen@email.com',       skills:['React','TypeScript','Node.js','AWS'],          match:95, role:'backend', status:'shortlisted', applied:'Jan 22, 2026', summary:['7+ yrs full-stack with React & TypeScript','Led serverless migration for 50+ clients','Strong AWS architecture background'] },
    { id:2,  name:'Marcus Williams', email:'marcus.w@email.com',         skills:['JavaScript','Vue.js','Docker','GraphQL'],      match:88, role:'backend', status:'pending',     applied:'Jan 21, 2026', summary:['Solid full-stack JS expertise','Built high-traffic SaaS platforms','CI/CD & containerization proficiency'] },
    { id:3,  name:'Aisha Patel',     email:'aisha.patel@email.com',     skills:['Java','Spring Boot','Kubernetes','PostgreSQL'],match:82, role:'backend', status:'pending',     applied:'Jan 20, 2026', summary:['Deep enterprise Java & Spring knowledge','K8s orchestration for critical systems','Mentored 15+ junior engineers'] },
    { id:4,  name:'David Kim',       email:'david.kim@email.com',       skills:['Python','Django','Redis','MongoDB'],           match:76, role:'backend', status:'rejected',    applied:'Jan 19, 2026', summary:['Growing Python backend skills','60% load-time reduction via caching','Strong NoSQL optimization'] },
    { id:5,  name:'Emily Rodriguez', email:'emily.r@email.com',         skills:['Go','Terraform','AWS','Prometheus'],           match:91, role:'devops',   status:'shortlisted', applied:'Jan 25, 2026', summary:['Go & IaC expert','Designed 1M+ req/day systems','Observability champion'] },
    { id:6,  name:"James O'Connor", email:'james.oconnor@email.com',   skills:['C#','.NET Core','Azure','SQL Server'],         match:85, role:'backend', status:'pending',     applied:'Jan 18, 2026', summary:['Microsoft stack & Azure migration','20+ enterprise apps delivered','Clean architecture & SOLID'] },
    { id:7,  name:'Lisa Zhang',      email:'lisa.zhang@email.com',      skills:['Figma','Sketch','React','CSS'],                match:93, role:'designer', status:'shortlisted', applied:'Jan 24, 2026', summary:['8 yrs UI/UX with design systems','Led redesign — 40% engagement uplift','Expert in accessibility'] },
    { id:8,  name:'Kevin Park',      email:'kevin.park@email.com',      skills:['Product','Agile','SQL','Analytics'],           match:79, role:'pm',      status:'pending',     applied:'Jan 23, 2026', summary:['5 yrs PM in SaaS space','Shipped 12+ features at scale','Strong data-driven approach'] },
    { id:9,  name:'Priya Sharma',    email:'priya.sharma@email.com',    skills:['React','Next.js','TypeScript','GraphQL'],      match:87, role:'frontend', status:'pending',     applied:'Jan 26, 2026', summary:['Modern frontend architecture','Performance optimisation focus','Open source contributor'] },
    { id:10, name:'Tom Bradley',     email:'tom.bradley@email.com',     skills:['AWS','Terraform','Docker','Linux'],            match:90, role:'devops',   status:'hired',       applied:'Dec 30, 2025', summary:['Cloud infrastructure specialist','Zero-downtime deployment expertise','Team lead for 6 engineers'] },
    { id:11, name:'Maya Chen',       email:'maya.chen@email.com',       skills:['Sales','CRM','Negotiation','SaaS'],            match:72, role:'pm',      status:'rejected',    applied:'Jan 10, 2026', summary:['B2B sales background','Strong pipeline management','Needs more product exposure'] },
    { id:12, name:'Alex Turner',     email:'alex.turner@email.com',     skills:['Vue.js','JavaScript','CSS','HTML'],            match:68, role:'frontend', status:'rejected',    applied:'Jan 8, 2026',  summary:['Junior frontend skills','Built 3 client projects','Needs senior mentorship'] },
    { id:13, name:'Olivia Park',     email:'olivia.park@email.com',     skills:['Figma','CSS','Prototyping','Research'],        match:84, role:'designer', status:'pending',     applied:'Jan 27, 2026', summary:['Strong research & wireframing','Built component libraries','4 yrs at agencies'] },
    { id:14, name:'Ryan Moore',      email:'ryan.moore@email.com',      skills:['Node.js','MongoDB','AWS','TypeScript'],        match:81, role:'backend', status:'pending',     applied:'Jan 28, 2026', summary:['Full-stack Node.js background','Microservices & API design','Active GitHub contributor'] }
];

function renderCandidates(filter) {
    filter = filter || {};
    const tbody = document.getElementById('cand-tbody');
    if (!tbody) return;
    let list = candidates;
    if (filter.search) { const q = filter.search.toLowerCase(); list = list.filter(c => c.name.toLowerCase().includes(q) || c.skills.some(s => s.toLowerCase().includes(q))); }
    if (filter.status && filter.status !== 'all') list = list.filter(c => c.status === filter.status);
    if (filter.role   && filter.role !== 'all')   list = list.filter(c => c.role === filter.role);

    tbody.innerHTML = list.map(c => {
        const color = c.match >= 90 ? '#00D466' : c.match >= 70 ? '#FFD700' : '#FF4444';
        const circ  = 2 * Math.PI * 16;
        const off   = circ * (1 - c.match / 100);
        const bt    = c.status.charAt(0).toUpperCase() + c.status.slice(1);
        const bc    = c.status === 'shortlisted' ? 'badge-hired' : c.status === 'rejected' ? 'badge-closed' : c.status === 'hired' ? 'badge-active' : 'badge-pending';
        const initials = c.name.split(' ').map(n => n[0]).join('');
        return `<tr data-id="${c.id}">
            <td style="display:flex;align-items:center;gap:10px;">
                <div class="avatar-sm">${escapeHtml(initials)}</div>
                <div><div style="color:var(--color-text-high);font-weight:600;font-size:var(--font-size-sm);">${escapeHtml(c.name)}</div>
                     <div style="font-size:var(--font-size-xs);color:var(--color-text-disabled);">${escapeHtml(c.email)}</div></div>
            </td>
            <td style="font-size:var(--font-size-xs);color:var(--color-primary);">${escapeHtml(roleLabels[c.role]||c.role)}</td>
            <td>${c.skills.slice(0,3).map(s=>`<span class="pill-tag">${escapeHtml(s)}</span>`).join('')}</td>
            <td><div class="mini-ring">
                <svg width="44" height="44" viewBox="0 0 44 44" style="transform:rotate(-90deg);">
                    <circle cx="22" cy="22" r="16" fill="none" stroke="#2A2A2A" stroke-width="4"/>
                    <circle cx="22" cy="22" r="16" fill="none" stroke="${color}" stroke-width="4" stroke-dasharray="${circ}" stroke-dashoffset="${off}" stroke-linecap="round"/>
                </svg><div class="ring-label" style="color:${color}">${c.match}%</div></div></td>
            <td><span class="badge ${bc}">${bt}</span></td>
            <td style="font-size:var(--font-size-xs);color:var(--color-text-disabled);">${c.applied}</td>
        </tr>`;
    }).join('');

    tbody.querySelectorAll('tr').forEach(tr => {
        tr.addEventListener('click', () => {
            const c = candidates.find(x => x.id === parseInt(tr.dataset.id));
            if (c) openDrawer(c);
        });
    });
}

function setupSearch() {
    const searchInput = document.getElementById('cand-search');
    const statusFilter = document.getElementById('cand-status-filter');
    const roleFilter = document.getElementById('cand-role-filter');
    function apply() {
        renderCandidates({
            search: searchInput ? searchInput.value : '',
            status: statusFilter ? statusFilter.value : 'all',
            role: roleFilter ? roleFilter.value : 'all'
        });
    }
    if (searchInput) searchInput.addEventListener('input', apply);
    if (statusFilter) statusFilter.addEventListener('change', apply);
    if (roleFilter) roleFilter.addEventListener('change', apply);
}

let selectedCandidate = null;

function setupDrawer() {
    const backdrop = document.getElementById('cand-drawer-backdrop');
    const closeBtn = document.getElementById('cd-close');
    if (backdrop) backdrop.addEventListener('click', closeDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    const rejectBtn = document.getElementById('cd-reject');
    const shortlistBtn = document.getElementById('cd-shortlist');
    const scheduleBtn = document.getElementById('cd-schedule');
    if (rejectBtn) rejectBtn.addEventListener('click', handleReject);
    if (shortlistBtn) shortlistBtn.addEventListener('click', handleShortlist);
    if (scheduleBtn) scheduleBtn.addEventListener('click', () => toast('Interview scheduling — coming soon!'));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
}

function openDrawer(c) {
    selectedCandidate = c;
    const drawer = document.getElementById('cand-drawer');
    if (!drawer) return;
    drawer.classList.add('active');
    const initials = c.name.split(' ').map(n => n[0]).join('');
    const setText = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
    setText('cd-avatar', initials);
    setText('cd-name', c.name);
    setText('cd-name2', c.name);
    setText('cd-email', c.email);
    setText('cd-applied-for', 'Applied for: ' + (roleLabels[c.role] || c.role));
    const color = c.match >= 90 ? '#00D466' : c.match >= 70 ? '#FFD700' : '#FF4444';
    const circ = 2 * Math.PI * 54;
    const off = circ * (1 - c.match / 100);
    const scoreCircle = document.getElementById('cd-score-circle');
    const scoreText = document.getElementById('cd-score-text');
    if (scoreCircle) { scoreCircle.setAttribute('stroke', color); scoreCircle.setAttribute('stroke-dashoffset', off); }
    if (scoreText) { scoreText.textContent = c.match + '%'; scoreText.style.color = color; }
    const summaryEl = document.getElementById('cd-summary');
    const skillsEl = document.getElementById('cd-skills');
    if (summaryEl) summaryEl.innerHTML = c.summary.map(s => `<li>${escapeHtml(s)}</li>`).join('');
    if (skillsEl) skillsEl.innerHTML = c.skills.map(s => `<span class="pill-tag">${escapeHtml(s)}</span>`).join('');
    if (window.feather) feather.replace();
}

function closeDrawer() {
    const drawer = document.getElementById('cand-drawer');
    if (drawer) drawer.classList.remove('active');
}

function handleReject() {
    if (!selectedCandidate) return;
    const c = candidates.find(x => x.id === selectedCandidate.id);
    if (c) c.status = 'rejected';
    closeDrawer(); renderCandidates();
    toast(selectedCandidate.name + ' has been rejected', 'error');
}

function handleShortlist() {
    if (!selectedCandidate) return;
    const c = candidates.find(x => x.id === selectedCandidate.id);
    if (c) c.status = 'shortlisted';
    closeDrawer(); renderCandidates();
    toast(selectedCandidate.name + ' has been shortlisted');
}

