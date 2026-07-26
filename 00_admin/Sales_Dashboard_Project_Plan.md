# Sales Dashboard — Project Plan

**Prepared for:** CEO  
**Date:** 23 July 2026  
**Status:** Draft — Pending Review

---

## 1. Problem Statement

The CEO currently has no centralised view of the business's financial performance. With multiple income sources and different people managing each project, it is difficult to:

- Know which projects are profitable and which are not
- Track actual sales against targets
- Hold project managers accountable for their numbers
- Spot trends or issues early enough to act on them

---

## 2. Goals

- Give the CEO a single dashboard to monitor all income sources in real time
- Make it easy for project managers to enter their sales and expense data
- Generate instant profit/loss summaries per project and for the overall business
- Compare actuals against targets and surface gaps quickly
- Track team/person performance across projects

---

## 3. Users & Roles

| Role | What they do in the system |
|---|---|
| **CEO** | Views the full dashboard, generates reports, sets targets |
| **Project Manager** | Enters sales figures and expenses for their assigned project(s) |
| **Admin** (optional) | Manages users, projects, and system settings |

---

## 4. Core Features

### 4.1 Dashboard (CEO View)
- Overall business revenue, expenses, and net profit/loss (monthly, quarterly, yearly)
- Revenue breakdown by project/income source (chart)
- Target vs actual comparison per project (progress bars or chart)
- Top-performing and underperforming projects
- Recent activity feed (latest entries by project managers)

### 4.2 Project Management
- Create and name income sources / projects
- Assign a project manager to each project
- Set monthly or quarterly revenue targets per project

### 4.3 Sales & Expense Entry (Project Manager View)
- Input form: date, revenue amount, expense amount, notes
- History table of past entries for their project
- Running total: revenue, expenses, net profit for current period

### 4.4 Profit & Loss Analysis
- Automatic P&L calculation per project
- Business-wide P&L rolled up from all projects
- Visual charts: bar chart (monthly trend), pie chart (revenue share by project)

### 4.5 Reports
- Export summary report (PDF or Excel) for a selected date range
- Filter by project, date range, or person
- Month-over-month and year-over-year comparison

---

## 5. Data Structure (What We Need to Track)

### Projects / Income Sources
- Project name
- Project manager (person assigned)
- Revenue target (monthly/quarterly)
- Status (active / inactive)

### Sales Entries (per project, per period)
- Date of entry
- Revenue amount
- Expense amount
- Net profit (auto-calculated)
- Notes / description
- Entered by (who submitted it)

### Users
- Name
- Role (CEO / Project Manager / Admin)
- Projects assigned to them

---

## 6. Tech Approach

| Layer | Choice | Reason |
|---|---|---|
| Frontend | React (JSX) | Rich, interactive UI; charts and tables |
| Data storage | Local state + JSON file / localStorage | Simple to start; no backend needed |
| Charts | Recharts library | Built into the React environment |
| Export | SheetJS (Excel) | Easy export of reports |

> **Note:** If the team grows or data becomes large, this can be upgraded to a proper backend (Node.js + database) in a later phase.

---

## 7. Phased Roadmap

### Phase 1 — Core Dashboard (MVP)
*Goal: CEO can see the numbers. Project managers can enter data.*

- [ ] Project setup and data structure
- [ ] Sales & expense entry form (per project)
- [ ] CEO dashboard: revenue, expenses, P&L summary
- [ ] Charts: monthly trend, revenue by project
- [ ] Sample/demo data to validate the layout

### Phase 2 — Targets & Performance
*Goal: Compare actuals against plan.*

- [ ] Set revenue targets per project
- [ ] Target vs actual chart and progress indicators
- [ ] Project manager performance view

### Phase 3 — Reports & Export
*Goal: Generate and share reports.*

- [ ] Date range filter across all views
- [ ] Export to Excel / PDF
- [ ] Month-over-month comparison

### Phase 4 — Multi-user & Access Control (Optional)
*Goal: Each project manager only sees their own project.*

- [ ] Login / role-based access
- [ ] Project manager sees only their assigned projects
- [ ] CEO sees everything

---

## 8. Open Questions (To Confirm)

These need answers before development starts:

1. How many income sources / projects does the company currently have?
2. What is the reporting period — monthly, quarterly, or both?
3. Are expenses tracked at the project level, or is there a shared cost pool too?
4. Does each project have one manager, or can multiple people manage one project?
5. Should the system support multiple currencies?
6. Is there existing data (Excel sheets, etc.) that needs to be imported into the system?
7. Who will host or maintain this system — internal IT, or should it be fully self-contained?

---

## 9. Next Steps

1. CEO reviews this plan and answers the open questions above
2. Finalise the feature list and confirm the phased roadmap
3. Begin Phase 1 development (MVP dashboard)
4. CEO signs off on the MVP before Phase 2 begins

---

*This document is a living plan and will be updated as requirements are confirmed.*
