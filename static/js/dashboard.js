// dashboard.js
document.addEventListener('DOMContentLoaded', () => {
    feather.replace();
    renderActivity();
    renderCandidates();
    setupUpload();
    setupDrawer();
    setupModal();
    setupFilters();
});

// ─── Mock Data ───────────────────────────────────────────────
const candidatesData = [
    { id:1, name:'Sarah Chen',       email:'sarah.chen@email.com',       experience:7, skills:['React','TypeScript','Node.js','AWS'],          matchScore:95, summary:['7+ yrs full-stack with React & TypeScript','Led migration to serverless — 50+ enterprise clients','Strong AWS cloud architecture background'], status:'pending' },
    { id:2, name:'Marcus Williams', email:'marcus.w@email.com',         experience:5, skills:['JavaScript','Vue.js','Docker','GraphQL'],      matchScore:88, summary:['Solid full-stack JS with modern frameworks','Built & maintained high-traffic SaaS apps','Proficient in containerization & CI/CD'], status:'pending' },
    { id:3, name:'Aisha Patel',     email:'aisha.patel@email.com',     experience:9, skills:['Java','Spring Boot','Kubernetes','PostgreSQL'],matchScore:82, summary:['Deep enterprise Java & Spring expertise','Orchestrated K8s for mission-critical systems','Mentored 15+ junior devs'], status:'pending' },
    { id:4, name:'David Kim',       email:'david.kim@email.com',       experience:4, skills:['Python','Django','Redis','MongoDB'],           matchScore:76, summary:['Growing Python backend experience','Implemented caching — 60% load-time reduction','Strong NoSQL optimization skills'], status:'pending' },
    { id:5, name:'Emily Rodriguez', email:'emily.r@email.com',         experience:6, skills:['Go','Terraform','AWS','Prometheus'],           matchScore:91, summary:['Expert in Go & infrastructure-as-code','Designed systems handling 1M+ req/day','Championed observability practices'], status:'pending' },
    { id:6, name:"James O'Connor", email:'james.oconnor@email.com',   experience:8, skills:['C#','.NET Core','Azure','SQL Server'],         matchScore:85, summary:['Extensive Microsoft stack & Azure migration','Delivered 20+ enterprise apps','Focus on clean architecture & SOLID'], status:'pending' }
];

const activityFeed = [
    { icon:'user-check',  text:'Sarah Chen shortlisted for Senior Developer',   time:'2 min ago' },
    { icon:'upload',      text:'New JD uploaded — Product Manager role',        time:'18 min ago' },
    { icon:'mail',        text:'Interview invite sent to Marcus Williams',     time:'1 hr ago' },
    { icon:'x-circle',    text:'David Kim rejected for Frontend Lead',         time:'3 hrs ago' },
    { icon:'briefcase',   text:'New job posted — DevOps Engineer',             time:'5 hrs ago' },
    { icon:'users',       text:'12 new candidates matched for Backend Dev',    time:'Yesterday' }
];

let selectedCandidate = null;

// ─── Activity Feed ───────────────────────────────────────────
function renderActivity() {
    const el = document.getElementById('activity-list');
    if (!el) return;
    el.innerHTML = activityFeed.map(item => `
        <div style="display:flex;align-items:flex-start;gap:var(--spacing-md);padding:var(--spacing-md) var(--spacing-lg);border-bottom:1px solid rgba(255,255,255,0.04);">
            <div style="width:32px;height:32px;border-radius:6px;background:rgba(102,252,241,0.08);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--color-primary);margin-top:2px;">
                <i data-feather="${item.icon}" style="width:15px;height:15px;"></i>
            </div>
            <div style="min-width:0;">
                <p style="font-size:var(--font-size-sm);color:var(--color-text-low);line-height:1.5;">${item.text}</p>
                <p style="font-size:var(--font-size-xs);color:var(--color-text-disabled);margin-top:2px;">${item.time}</p>
            </div>
        </div>
    `).join('');
    feather.replace();
}

// ─── Upload Flow ─────────────────────────────────────────────
function setupUpload() {
    const dropZone  = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const browseBtn = document.getElementById('browse-btn');
    if (browseBtn)  browseBtn.addEventListener('click', () => fileInput && fileInput.click());
    if (dropZone) {
        dropZone.addEventListener('click', () => fileInput && fileInput.click());
        dropZone.addEventListener('dragover',  e => { e.preventDefault(); dropZone.style.borderColor='#45A29E'; dropZone.style.background='rgba(102,252,241,0.1)'; });
        dropZone.addEventListener('dragleave', e => { e.preventDefault(); dropZone.style.borderColor=''; dropZone.style.background=''; });
        dropZone.addEventListener('drop', e => { e.preventDefault(); dropZone.style.borderColor=''; dropZone.style.background=''; if (e.dataTransfer.files.length) startUpload(); });
    }
    if (fileInput) fileInput.addEventListener('change', () => { if (fileInput.files.length) startUpload(); });
}

function startUpload() {
    document.getElementById('drop-zone').style.display = 'none';
    document.getElementById('processing-state').style.display = 'block';
    let p = 0;
    const iv = setInterval(() => {
        p += 5;
        document.getElementById('progress-fill').style.width = p + '%';
        document.getElementById('progress-percent').textContent = p + '%';
        if (p >= 100) {
            clearInterval(iv);
            setTimeout(() => {
                document.getElementById('upload-view').style.display = 'none';
                document.getElementById('results-section').style.display = 'block';
                renderCandidates();
                toast('AI screening complete — 6 candidates ranked', 'success');
            }, 400);
        }
    }, 100);
}

// ─── Candidate Table ─────────────────────────────────────────
function renderCandidates(filter) {
    filter = filter || 'all';
    const tbody = document.getElementById('candidates-tbody');
    if (!tbody) return;
    let list = candidatesData;
    if (filter === 'high')        list = list.filter(c => c.matchScore >= 90);
    if (filter === 'shortlisted') list = list.filter(c => c.status === 'shortlisted');
    if (filter === 'rejected')    list = list.filter(c => c.status === 'rejected');

    tbody.innerHTML = list.map(c => {
        const color = c.matchScore >= 90 ? '#2ECC71' : c.matchScore >= 70 ? '#F1C40F' : '#EF4444';
        const circ  = 2 * Math.PI * 16;
        const off   = circ * (1 - c.matchScore / 100);
        const bt    = c.status === 'shortlisted' ? 'Shortlisted' : c.status === 'rejected' ? 'Rejected' : 'Pending';
        const bc    = c.status === 'shortlisted' ? 'badge-hired' : c.status === 'rejected' ? 'badge-closed' : 'badge-pending';
        const initials = c.name.split(' ').map(n => n[0]).join('');
        return `<tr data-id="${c.id}">
            <td style="display:flex;align-items:center;gap:10px;">
                <div class="avatar-sm">${initials}</div>
                <div><div style="color:var(--color-text-high);font-weight:600;font-size:var(--font-size-sm);">${c.name}</div>
                     <div style="font-size:var(--font-size-xs);color:var(--color-text-disabled);">${c.email}</div></div>
            </td>
            <td>${c.experience} yrs</td>
            <td>${c.skills.slice(0,3).map(s=>`<span class="pill-tag">${s}</span>`).join('')}</td>
            <td><div class="mini-ring">
                <svg width="44" height="44" viewBox="0 0 44 44" style="transform:rotate(-90deg);">
                    <circle cx="22" cy="22" r="16" fill="none" stroke="#1F2833" stroke-width="4"/>
                    <circle cx="22" cy="22" r="16" fill="none" stroke="${color}" stroke-width="4" stroke-dasharray="${circ}" stroke-dashoffset="${off}" stroke-linecap="round"/>
                </svg><div class="ring-label" style="color:${color}">${c.matchScore}%</div></div></td>
            <td><span class="badge ${bc}">${bt}</span></td>
        </tr>`;
    }).join('');
    tbody.querySelectorAll('tr').forEach(tr => {
        tr.addEventListener('click', () => {
            const c = candidatesData.find(x => x.id === parseInt(tr.dataset.id));
            if (c) openDrawer(c);
        });
    });
}

function setupFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderCandidates(btn.dataset.filter);
        });
    });
}

// ─── Drawer ──────────────────────────────────────────────────
function setupDrawer() {
    document.getElementById('drawer-backdrop').addEventListener('click', closeDrawer);
    document.getElementById('drawer-close').addEventListener('click', closeDrawer);
    document.getElementById('reject-btn').addEventListener('click', handleReject);
    document.getElementById('shortlist-btn').addEventListener('click', handleShortlist);
    document.getElementById('schedule-btn').addEventListener('click', openScheduleModal);
    document.addEventListener('keydown', e => { if (e.key==='Escape') { closeDrawer(); closeScheduleModal(); } });
}

function openDrawer(candidate) {
    selectedCandidate = candidate;
    document.getElementById('candidate-drawer').classList.add('active');
    document.getElementById('drawer-candidate-name').textContent = candidate.name;
    document.getElementById('drawer-email').textContent = candidate.email;
    const color = candidate.matchScore >= 90 ? '#2ECC71' : candidate.matchScore >= 70 ? '#F1C40F' : '#EF4444';
    const circ  = 2 * Math.PI * 54;
    const off   = circ * (1 - candidate.matchScore / 100);
    document.getElementById('drawer-score-circle').setAttribute('stroke', color);
    document.getElementById('drawer-score-circle').setAttribute('stroke-dashoffset', off);
    document.getElementById('drawer-score-text').textContent = candidate.matchScore + '%';
    document.getElementById('drawer-score-text').style.color = color;
    document.getElementById('drawer-ai-summary').innerHTML = candidate.summary.map(s => `<li>${s}</li>`).join('');
    document.getElementById('drawer-skills').innerHTML = candidate.skills.map(s => `<span class="pill-tag">${s}</span>`).join('');
    feather.replace();
}

function closeDrawer() { document.getElementById('candidate-drawer').classList.remove('active'); }

function handleReject() {
    if (!selectedCandidate) return;
    const c = candidatesData.find(x => x.id === selectedCandidate.id);
    if (c) c.status = 'rejected';
    closeDrawer(); renderCandidates();
    toast(selectedCandidate.name + ' has been rejected', 'error');
}

function handleShortlist() {
    if (!selectedCandidate) return;
    const c = candidatesData.find(x => x.id === selectedCandidate.id);
    if (c) c.status = 'shortlisted';
    closeDrawer(); renderCandidates();
    toast(selectedCandidate.name + ' has been shortlisted');
}

// ─── Schedule Modal ──────────────────────────────────────────
function setupModal() {
    document.getElementById('modal-backdrop').addEventListener('click', closeScheduleModal);
    document.getElementById('modal-close').addEventListener('click', closeScheduleModal);
    document.getElementById('modal-cancel').addEventListener('click', closeScheduleModal);
    document.getElementById('send-invitation').addEventListener('click', sendInvitation);
}

function openScheduleModal() {
    if (!selectedCandidate) return;
    document.getElementById('schedule-modal').classList.add('active');
    document.getElementById('candidate-email').value = selectedCandidate.email;
    document.getElementById('email-subject').value = 'Interview Invitation — ' + selectedCandidate.name;
    document.getElementById('email-message').value = 'Dear ' + selectedCandidate.name + ',\n\nWe were impressed by your application and would like to invite you for an interview.\n\nPlease let us know your availability for next week.\n\nBest regards,\nThe QuickHire Team';
    feather.replace();
}

function closeScheduleModal() { document.getElementById('schedule-modal').classList.remove('active'); }

function sendInvitation() {
    closeScheduleModal(); closeDrawer();
    if (selectedCandidate) {
        const c = candidatesData.find(x => x.id === selectedCandidate.id);
        if (c) c.status = 'shortlisted';
        toast('Interview invitation sent to ' + selectedCandidate.name);
        renderCandidates();
    }
}
