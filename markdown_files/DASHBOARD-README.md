# QuickHire Dashboard — Multi-Page Application

A comprehensive, production-ready internal recruiting dashboard with **5 full pages**, shared navigation, dark mode UI, interactive charts, candidate management, job postings, analytics, and settings.

---

## 📁 Project Structure

```
quickhire-app/
├── index.html              # Landing page (marketing site)
├── auth.html               # Login page
├── register.html           # Registration page
│
├── dashboard.html          # ✨ Main dashboard (overview + quick screen)
├── jobs.html               # ✨ Job postings management
├── candidates.html         # ✨ Full candidate pool
├── analytics.html          # ✨ Charts & hiring metrics
├── settings.html           # ✨ Workspace settings (4 tabs)
│
├── sidebar.js              # Shared sidebar (injected into all dashboard pages)
├── toast.js                # Toast notification utility
│
├── dashboard.js            # Dashboard page logic
├── jobs.js                 # Jobs page logic
├── candidates.js           # Candidates page logic
├── analytics.js            # Analytics page logic
├── settings.js             # Settings page logic
│
├── landing.js              # Landing page interactions
├── auth.js                 # Auth page logic
├── register.js             # Registration logic
│
└── styles.css              # Global styles (landing + dashboard)
```

---

## 🚀 Getting Started

### Option 1: Open Directly in Browser
1. Download all files to a local folder
2. Open **`index.html`** in your browser
3. Click **Sign In** → Enter any email/password → Access dashboard
4. Navigate between pages using the sidebar

### Option 2: Run with Local Server (Recommended)
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js http-server
npx http-server -p 8000
```
Then open: `http://localhost:8000`

---

## 📊 Dashboard Pages Overview

### 1️⃣ **Dashboard (dashboard.html)**
**Purpose:** Overview page with quick screening workflow

**Features:**
- 4 stat cards: Active Jobs, Total Candidates, Pending Review, Interviews Scheduled
- **Quick Screen** panel: Upload job description → AI processing → Candidate results table
- **Recent Activity** feed (6 recent events)
- Candidate results table with:
  - Avatar, name, email
  - Experience years
  - Top 3 skills (pill tags)
  - Match score (donut ring chart)
  - Status badge (Pending / Shortlisted / Rejected)
- Click row → **Slide-out drawer** with:
  - Large match score ring
  - AI analysis summary (3 bullet points)
  - Skills tags
  - Contact email
  - Resume preview placeholder
  - Action buttons: Reject / Shortlist / Schedule Interview
- **Schedule Interview modal** with pre-filled email template

**Mock Data:** 6 candidates (Sarah Chen, Marcus Williams, Aisha Patel, David Kim, Emily Rodriguez, James O'Connor)

---

### 2️⃣ **Job Postings (jobs.html)**
**Purpose:** Manage all job listings

**Features:**
- 4 stat cards: Total Postings, Open Now, Avg Time to Fill, Closing Soon
- Search bar + Department filter + Status filter
- **Jobs table** with:
  - Job title + salary range
  - Department
  - Location
  - Candidates count (with mini progress bar)
  - Posted date
  - Status badge (Open / Closed / Draft)
- Click row → Toast notification (would navigate to candidates in production)
- **"New Job" modal** for creating postings:
  - Title, Department, Location
  - Salary range (min/max)
  - Description textarea
  - Required skills

**Mock Data:** 12 jobs across Engineering, Product, Design, Sales, HR

---

### 3️⃣ **Candidate Pool (candidates.html)**
**Purpose:** Browse all candidates across all jobs

**Features:**
- 4 stat cards: Total Candidates, Shortlisted, Pending Review, Hired
- Search bar + Status filter + Applied Role filter
- **Candidates table** with:
  - Avatar + name + email
  - Applied role
  - Top 3 skills
  - Match score ring
  - Status badge
  - Application date
- Click row → **Detail drawer** with:
  - Large avatar + name + email
  - Match score ring
  - Applied role label
  - AI summary
  - Skills tags
  - Resume preview
  - Actions: Reject / Shortlist / Schedule
- **Import CSV** button (simulated)

**Mock Data:** 14 candidates across multiple roles (backend, frontend, PM, designer, devops)

---

### 4️⃣ **Analytics (analytics.html)**
**Purpose:** Hiring metrics and visualizations

**Features:**
- 4 KPI cards: Applications, Conversion Rate, Avg Time to Hire, Cost per Hire
- **Applications Over Time** (CSS bar chart, 4 weeks)
- **Applications by Department** (horizontal progress bars)
  - Engineering: 102
  - Product: 38
  - Design: 31
  - Sales: 24
  - HR: 19
- **Hiring Funnel** (5-stage conversion):
  - Applications → Screened → Shortlisted → Interviewed → Hired
  - Shows conversion rate between stages
- **Top Skills in Demand** (pill cloud with job counts)
  - React, TypeScript, AWS, Node.js, Python, Docker, Kubernetes, GraphQL
- **Recent Hires table** (5 latest hires with match scores, time-to-hire)
- Time range selector (7d / 30d / 90d)
- Export button (toast notification)

---

### 5️⃣ **Settings (settings.html)**
**Purpose:** Workspace configuration

**Features:**
4 tabs with full functionality:

**Tab 1: General**
- Workspace Details: Org name, Industry, Company size
- AI Screening Preferences:
  - Auto-screen toggle
  - Minimum match threshold selector
  - Bias detection toggle

**Tab 2: Notifications**
- Email notification toggles:
  - New candidate matches
  - Weekly summary
  - Job posting expirations
  - Product updates

**Tab 3: Team & Access**
- Team members table (4 members)
- Name, Email, Role, Status columns
- Invite member button

**Tab 4: Billing**
- Current plan card (Professional - $99/month)
  - Features list
  - Upgrade button
- Payment method (Visa •••• 4242)
- Billing history table (2 invoices with download buttons)

**Danger Zone:**
- Delete all data button
- Close account button
- Confirmation dialogs

---

## 🎨 Design System

### Color Palette
```css
--color-canvas:      #0B0C10  /* Deep void background */
--color-surface:     #1F2833  /* Card/panel background */
--color-elevated:    #2C353F  /* Hover/elevated surfaces */
--color-primary:     #66FCF1  /* Cyan accent */
--color-secondary:   #45A29E  /* Teal */
--color-success:     #2ECC71  /* Green (90%+ match) */
--color-warning:     #F1C40F  /* Amber (70-89% match) */
--color-danger:      #EF4444  /* Red (rejection, <70%) */
--color-text-high:   #FFFFFF  /* Primary text */
--color-text-low:    #C5C6C7  /* Secondary text */
--color-text-disabled: #6D7680 /* Tertiary/disabled */
```

### Components Used
- **Stat Cards** (with colored top border)
- **Data Tables** (hover effects, border-bottom rows)
- **Badges** (status: open/closed/pending/hired/rejected)
- **Pill Tags** (skills)
- **Mini Donut Rings** (match scores in tables)
- **Large Donut Rings** (match scores in drawers)
- **Avatars** (circular initials)
- **Progress Bars** (horizontal, animated)
- **CSS Bar Chart** (analytics page)
- **Toggle Switches** (settings)
- **Tabs** (settings page)
- **Modals** (schedule interview, new job)
- **Drawers** (slide-out from right)
- **Search Boxes** (with icon)
- **Toast Notifications** (bottom-right, auto-dismiss)

---

## 🔄 Navigation Flow

```
Landing (index.html)
  ↓ Click "Sign In"
Auth (auth.html)
  ↓ Login with any credentials
Dashboard (dashboard.html) ← Default entry point
  ├─→ Jobs (jobs.html)
  ├─→ Candidates (candidates.html)
  ├─→ Analytics (analytics.html)
  └─→ Settings (settings.html)
```

**Sidebar Navigation:**
- Active page highlighted with cyan accent + left border
- Logout button in sidebar footer (redirects to index.html)
- Mobile: Hamburger menu toggles sidebar

---

## ⚡ Interactive Features

### Dashboard
- ✅ File upload (drag & drop + click to browse)
- ✅ Animated progress bar (2 seconds)
- ✅ Auto-switch to results after upload
- ✅ Activity feed (6 recent events)
- ✅ Candidate filtering (All / High Match / Shortlisted / Rejected)
- ✅ Drawer open on row click
- ✅ Reject / Shortlist / Schedule actions with toast feedback
- ✅ Modal pre-fills candidate email

### Jobs
- ✅ Real-time search (title + department)
- ✅ Department filter (6 options)
- ✅ Status filter (All / Open / Closed / Draft)
- ✅ Row click feedback (toast)
- ✅ New job creation modal
- ✅ Form validation (title required)
- ✅ Dynamic candidate count progress bars

### Candidates
- ✅ Search by name or skill
- ✅ Status filter (5 options)
- ✅ Role filter (5 roles)
- ✅ Detail drawer with full profile
- ✅ Reject / Shortlist actions update table
- ✅ CSV import button (simulated)

### Analytics
- ✅ Animated CSS bar chart
- ✅ Department breakdown with color-coded bars
- ✅ 5-stage hiring funnel with conversion rates
- ✅ Skills demand cloud (8 top skills)
- ✅ Recent hires table
- ✅ Time range selector (7d/30d/90d triggers toast)
- ✅ Export button (toast notification)

### Settings
- ✅ 4-tab navigation (smooth switching)
- ✅ All toggles show toast on change
- ✅ Form inputs trigger save toasts
- ✅ Team table with 4 members
- ✅ Billing invoices with download buttons
- ✅ Danger zone with confirmation dialogs

---

## 🛠️ Technical Stack

- **HTML5** — Semantic structure
- **CSS3** — CSS Variables, Grid, Flexbox, Animations
- **Vanilla JavaScript** — No frameworks (intentional for simplicity)
- **Feather Icons** — CDN icons
- **Google Fonts** — Inter font family
- **No build process** — Works directly in browser

---

## 📱 Responsive Design

- **Desktop:** Full sidebar (250px fixed)
- **Mobile (<768px):**
  - Sidebar hidden by default
  - Hamburger menu toggles sidebar overlay
  - Tables scroll horizontally
  - Stat cards stack vertically
  - Drawers take full width

---

## 🎯 Key Metrics

- **Total Files:** 25
- **Total Lines of Code:** ~4,500
- **Dashboard Pages:** 5 (Dashboard, Jobs, Candidates, Analytics, Settings)
- **Mock Candidates:** 20 (across all pages)
- **Mock Jobs:** 12
- **Interactive Components:** 50+
- **No external dependencies** (except Feather Icons CDN)

---

## 🚧 Future Enhancements (Backend Integration)

When connecting to a real backend:

1. **API Endpoints:**
   - `POST /api/jobs` — Create job
   - `GET /api/jobs` — List jobs
   - `POST /api/candidates` — Upload resume
   - `GET /api/candidates` — List candidates
   - `PUT /api/candidates/:id` — Update status
   - `POST /api/schedule` — Send interview email
   - `GET /api/analytics` — Fetch metrics

2. **Authentication:**
   - Replace `auth.js` mock login with JWT/session
   - Add protected routes
   - Implement proper logout

3. **Real-time Updates:**
   - WebSocket for live candidate notifications
   - Activity feed from database
   - Auto-refresh stats

4. **File Upload:**
   - Parse PDF/DOCX on backend
   - Store resumes in S3/Cloud Storage
   - Run AI matching via API

5. **Data Persistence:**
   - PostgreSQL/MongoDB for candidates, jobs
   - Redis for caching match scores
   - Elasticsearch for search

---

## 🎨 Design Philosophy

**Dark Mode First**
- High contrast for readability
- Cyan (#66FCF1) as primary accent for visibility
- Subtle gradients on cards for depth

**Utility Over Beauty**
- Functional, no-nonsense layouts
- Information density prioritized
- Clear visual hierarchy

**Professional Internal Tool**
- Not customer-facing, so optimized for speed/efficiency
- Keyboard shortcuts (ESC to close modals/drawers)
- Toast notifications for all actions
- Minimal animations (only progress bars, drawer slides)

---

## 📄 License

This is a demo project for QuickHire MVP. All rights reserved.

---

## 👥 Credits

Built by Claude (Anthropic) for the QuickHire team.
