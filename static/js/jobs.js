// jobs.js
document.addEventListener('DOMContentLoaded', () => {
    feather.replace();
    renderJobs();
    setupSearch();
    setupNewJobModal();
});

const jobsData = [
    { id:1,  title:'Senior Backend Developer',   dept:'eng',     location:'Remote',          candidates:24, posted:'Jan 20, 2026', status:'open',   salary:'$130k–$180k' },
    { id:2,  title:'Product Manager',           dept:'product', location:'Sydney, NSW',     candidates:18, posted:'Jan 18, 2026', status:'open',   salary:'$140k–$190k' },
    { id:3,  title:'UI/UX Designer',            dept:'design',  location:'Melbourne, VIC',  candidates:31, posted:'Jan 15, 2026', status:'open',   salary:'$100k–$140k' },
    { id:4,  title:'Frontend Lead',            dept:'eng',     location:'Remote',          candidates:42, posted:'Jan 10, 2026', status:'open',   salary:'$150k–$200k' },
    { id:5,  title:'DevOps Engineer',          dept:'eng',     location:'Sydney, NSW',     candidates:15, posted:'Jan 8, 2026',  status:'open',   salary:'$120k–$170k' },
    { id:6,  title:'Sales Development Rep',    dept:'sales',   location:'Brisbane, QLD',   candidates:9,  posted:'Jan 5, 2026',  status:'open',   salary:'$70k–$110k' },
    { id:7,  title:'Data Scientist',           dept:'eng',     location:'Remote',          candidates:28, posted:'Dec 28, 2025', status:'closed', salary:'$130k–$175k' },
    { id:8,  title:'HR Business Partner',      dept:'hr',      location:'Sydney, NSW',     candidates:7,  posted:'Dec 22, 2025', status:'closed', salary:'$95k–$130k' },
    { id:9,  title:'Marketing Analyst',        dept:'sales',   location:'Remote',          candidates:0,  posted:'Jan 29, 2026', status:'draft',  salary:'$85k–$115k' },
    { id:10, title:'Backend Intern',           dept:'eng',     location:'Sydney, NSW',     candidates:56, posted:'Dec 15, 2025', status:'closed', salary:'$50k–$70k' },
    { id:11, title:'Product Designer',         dept:'design',  location:'Melbourne, VIC',  candidates:0,  posted:'Jan 30, 2026', status:'draft',  salary:'$95k–$130k' },
    { id:12, title:'Cloud Architect',          dept:'eng',     location:'Remote',          candidates:11, posted:'Jan 22, 2026', status:'open',   salary:'$170k–$230k' }
];

function renderJobs(filter) {
    filter = filter || {};
    const tbody = document.getElementById('jobs-tbody');
    if (!tbody) return;

    let list = jobsData;
    if (filter.search) {
        const q = filter.search.toLowerCase();
        list = list.filter(j => j.title.toLowerCase().includes(q) || j.dept.toLowerCase().includes(q));
    }
    if (filter.dept && filter.dept !== 'all') list = list.filter(j => j.dept === filter.dept);
    if (filter.status && filter.status !== 'all') list = list.filter(j => j.status === filter.status);

    const deptLabel = { eng:'Engineering', product:'Product', design:'Design', sales:'Sales', hr:'HR' };

    tbody.innerHTML = list.map(j => {
        const statusBadge = j.status === 'open' ? 'badge-open Open' : j.status === 'closed' ? 'badge-closed Closed' : 'badge-pending Draft';
        const [bc, bt] = statusBadge.split(' ');
        return `<tr data-id="${j.id}">
            <td><div style="color:var(--color-text-high);font-weight:600;font-size:var(--font-size-sm);">${j.title}</div>
                 <div style="font-size:var(--font-size-xs);color:var(--color-text-disabled);margin-top:2px;">${j.salary}</div></td>
            <td>${deptLabel[j.dept] || j.dept}</td>
            <td>${j.location}</td>
            <td>
                <div style="display:flex;align-items:center;gap:8px;">
                    <span style="font-weight:600;color:var(--color-text-high);">${j.candidates}</span>
                    <div style="width:60px;height:4px;background:var(--color-elevated);border-radius:2px;overflow:hidden;">
                        <div style="height:100%;width:${Math.min(j.candidates*3, 100)}%;background:var(--color-primary);border-radius:2px;"></div>
                    </div>
                </div>
            </td>
            <td style="color:var(--color-text-disabled);font-size:var(--font-size-xs);">${j.posted}</td>
            <td><span class="badge ${bc}">${bt}</span></td>
        </tr>`;
    }).join('');

    // Row click → navigate to dashboard candidates view (simulated)
    tbody.querySelectorAll('tr').forEach(tr => {
        tr.addEventListener('click', () => {
            const job = jobsData.find(j => j.id === parseInt(tr.dataset.id));
            if (job && job.status === 'open') {
                toast('Viewing candidates for: ' + job.title);
            } else if (job && job.status === 'draft') {
                toast('This posting is still a draft', 'error');
            } else {
                toast('This posting is closed');
            }
        });
    });
}

function setupSearch() {
    const searchInput  = document.getElementById('jobs-search');
    const deptFilter   = document.getElementById('jobs-dept-filter');
    const statusFilter = document.getElementById('jobs-status-filter');

    function applyFilters() {
        renderJobs({
            search: searchInput.value,
            dept: deptFilter.value,
            status: statusFilter.value
        });
    }

    searchInput.addEventListener('input', applyFilters);
    deptFilter.addEventListener('change', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
}

function setupNewJobModal() {
    const modal    = document.getElementById('new-job-modal');
    const openBtn  = document.getElementById('new-job-btn');
    const backdrop = document.getElementById('njm-backdrop');
    const closeBtn = document.getElementById('njm-close');
    const cancel   = document.getElementById('njm-cancel');
    const submit   = document.getElementById('njm-submit');

    openBtn.addEventListener('click', () => { modal.classList.add('active'); feather.replace(); });
    backdrop.addEventListener('click', () => modal.classList.remove('active'));
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    cancel.addEventListener('click',  () => modal.classList.remove('active'));

    submit.addEventListener('click', () => {
        const title = document.getElementById('njm-title').value.trim();
        if (!title) { toast('Please enter a job title', 'error'); return; }
        // Add to mock data
        jobsData.unshift({
            id: jobsData.length + 1,
            title: title,
            dept: document.getElementById('njm-dept').value.toLowerCase(),
            location: document.getElementById('njm-location').value || 'Remote',
            candidates: 0,
            posted: new Date().toLocaleDateString('en-AU', { month:'short', day:'numeric', year:'numeric' }),
            status: 'draft',
            salary: '$' + (document.getElementById('njm-sal-min').value || '0') + 'k–$' + (document.getElementById('njm-sal-max').value || '0') + 'k'
        });
        modal.classList.remove('active');
        renderJobs();
        toast('Job posting created: ' + title);
        // Reset form
        document.getElementById('njm-title').value = '';
        document.getElementById('njm-location').value = '';
        document.getElementById('njm-sal-min').value = '';
        document.getElementById('njm-sal-max').value = '';
        document.getElementById('njm-desc').value = '';
        document.getElementById('njm-skills').value = '';
    });

    document.addEventListener('keydown', e => { if (e.key === 'Escape') modal.classList.remove('active'); });
}
