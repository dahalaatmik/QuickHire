# QuickHire Dashboard — Quick Start Guide

## 🚀 5-Minute Setup

### Step 1: Download Files
Download the entire `quickhire-app/` folder to your computer.

### Step 2: Open in Browser
Double-click **`index.html`** to open the landing page.

### Step 3: Navigate to Dashboard
1. Click **"Sign In"** button
2. Enter any email and password (demo mode — no validation)
3. Click **"Sign In"** again
4. You're now in the dashboard!

---

## 📍 Navigation Map

```
Landing Page (index.html)
  ↓
Auth Page (auth.html) — Enter any credentials
  ↓
DASHBOARD (dashboard.html) ← You start here
  │
  ├─→ Jobs          (Manage job postings)
  ├─→ Candidates    (Browse all applicants)
  ├─→ Analytics     (View hiring metrics)
  └─→ Settings      (Configure workspace)
```

---

## 🎯 What to Try First

### On Dashboard Page:
1. **Upload a job description:**
   - Click the upload zone (or drag a PDF/DOCX)
   - Watch the AI processing animation
   - See 6 ranked candidates appear in table

2. **Click any candidate row:**
   - Drawer slides in from right
   - See match score ring + AI summary
   - Try: Reject / Shortlist / Schedule Interview

3. **Use the filters:**
   - Click "High Match" to show only 90%+ scores
   - Click "Shortlisted" to see shortlisted candidates

---

### On Jobs Page:
1. **Search for jobs:**
   - Type "Backend" in search box
   - See results filter live

2. **Create a new job:**
   - Click "+ New Job" button
   - Fill out the form
   - Click "Create Posting"
   - See it appear at top of table

---

### On Candidates Page:
1. **Search by name or skill:**
   - Type "React" to find React developers
   - Try "Sarah" to find Sarah Chen

2. **Filter by status:**
   - Select "Shortlisted" to see only shortlisted
   - Select "Hired" to see past hires

3. **Click any row:**
   - Full candidate profile in drawer
   - Reject or shortlist with toast feedback

---

### On Analytics Page:
1. **Explore charts:**
   - Bar chart shows weekly applications
   - Department breakdown shows Engineering leads (102)
   - Funnel shows 214 → 14 conversion

2. **Check Recent Hires table:**
   - 5 latest hires with match scores
   - Time-to-hire metrics (12-22 days)

---

### On Settings Page:
1. **Switch between tabs:**
   - General, Notifications, Team, Billing

2. **Toggle settings:**
   - Every toggle shows toast notification
   - Try "Auto-Screen New Candidates"

3. **View Team:**
   - See 4 team members
   - Admin User, Jane Doe, John Smith, Emily Martin

---

## 🎨 Key Features to Notice

### Visual Design:
- ✅ Dark mode (#0B0C10 background)
- ✅ Cyan (#66FCF1) primary accent
- ✅ Color-coded match scores:
  - Green: 90-100%
  - Amber: 70-89%
  - Red: <70%

### Interactions:
- ✅ Toast notifications (bottom-right)
- ✅ Slide-out drawers (candidates)
- ✅ Modals (schedule interview, create job)
- ✅ Animated progress bars
- ✅ Hover effects on tables
- ✅ Real-time search/filter

### Components:
- ✅ Stat cards with icons
- ✅ Donut ring charts (match scores)
- ✅ Pill tags (skills)
- ✅ Status badges (Open/Closed/Pending)
- ✅ Avatar circles (initials)

---

## 💡 Pro Tips

1. **Keyboard Shortcuts:**
   - Press `ESC` to close modals/drawers

2. **Mobile View:**
   - Resize browser to <768px width
   - Click hamburger menu to open sidebar

3. **Toast Notifications:**
   - Auto-dismiss after 2.8 seconds
   - Green = Success
   - Red = Error

4. **Mock Data:**
   - 6 candidates on Dashboard
   - 14 candidates on Candidates page
   - 12 jobs on Jobs page
   - 5 recent hires on Analytics

---

## 🔧 Troubleshooting

**Icons not showing?**
→ Check internet connection (Feather Icons loaded via CDN)

**Sidebar not appearing?**
→ Check browser console for errors
→ Ensure `sidebar.js` is in same folder

**Upload not working?**
→ This is a demo — upload triggers animation only
→ No file is actually processed

**Changes not saving?**
→ This is frontend-only (no database)
→ Refresh page = data resets

---

## 📦 Files You Need

**Required files:**
```
✅ index.html
✅ auth.html
✅ dashboard.html
✅ jobs.html
✅ candidates.html
✅ analytics.html
✅ settings.html
✅ styles.css
✅ sidebar.js
✅ toast.js
✅ dashboard.js
✅ jobs.js
✅ candidates.js
✅ analytics.js
✅ settings.js
✅ auth.js
✅ landing.js
```

**Optional files:**
```
register.html
register.js
design-documentation.html
dashboard-standalone.html
```

---

## 🎉 You're All Set!

Navigate between pages using the sidebar. Every page is fully interactive with mock data.

**Next Steps:**
1. Read `DASHBOARD-README.md` for full technical documentation
2. Explore all 5 dashboard pages
3. Test all interactive features
4. When ready for backend: Connect API endpoints (see README)

---

**Need Help?**
Check `DASHBOARD-README.md` for detailed documentation of every component.
