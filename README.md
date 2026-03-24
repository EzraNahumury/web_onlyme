# Coreflow AI — Project Progress Tracker

A modern, real-time project progress tracker built with **Next.js 16**, **Tailwind CSS 4**, **Three.js**, and **Google Sheets** as the database. Features a sleek dark theme with glassmorphism UI, animated 3D globe, and interactive background lines.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)
![Three.js](https://img.shields.io/badge/Three.js-3D_Globe-black?logo=three.js)
![Google Sheets](https://img.shields.io/badge/Database-Google_Sheets-34a853?logo=googlesheets)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Google Apps Script Setup](#google-apps-script-setup)
- [Environment Variables](#environment-variables)
- [Pages & Routes](#pages--routes)
- [API Endpoints](#api-endpoints)
- [Database Structure](#database-structure)
- [Status System](#status-system)
- [Deployment](#deployment)

---

## Features

### Public
- **Landing Page** — Hero section with animated 3D globe, animated background lines, live dashboard status, and recent projects list
- **Submit Project** — Clean form to submit new projects (Project Name, Client Name, Description)
- **Project Board** — Table view with search, status filter, progress bars, and detail modal popup

### Admin
- **Login System** — Email/password authentication with token-based session
- **Dashboard** — Expandable project cards with interactive checklist status system
- **Edit Projects** — Modal to update project name, client name, and description
- **Delete Projects** — Confirmation dialog before deleting from Google Sheets
- **Status Checklist** — Click-to-check sequential status progression (Waiting → In Progress → Revision → Done → Maintenance)
- **Dev Notes** — Add development notes per project

### UI/UX
- **Dark Theme** — Black/Red/White color palette
- **3D Globe** — Aceternity Three.js globe with red atmosphere
- **Background Lines** — Animated SVG lines across all pages
- **Glassmorphism** — Semi-transparent glass cards with backdrop blur
- **Animations** — Fade-in, slide-up, scale, staggered children, animated counters
- **Responsive** — Mobile-first design with adaptive table columns and mobile menu
- **Scroll-aware Navbar** — Transparent on top, blurred on scroll

---

## Tech Stack

| Category | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, TypeScript) |
| **Styling** | Tailwind CSS 4, shadcn/ui |
| **3D Graphics** | Three.js, @react-three/fiber, @react-three/drei |
| **Animations** | Motion (Framer Motion), tw-animate-css |
| **Icons** | Lucide React |
| **UI Components** | Aceternity UI (3D Globe, Background Lines) |
| **Database** | Google Sheets (via Google Apps Script REST API) |
| **Language** | TypeScript 5 |

---

## Project Structure

```
web_onlyme/
├── app/
│   ├── admin/
│   │   └── page.tsx              # Admin dashboard (login + project management)
│   ├── api/
│   │   ├── admin/login/
│   │   │   └── route.ts          # POST - Admin authentication
│   │   └── projects/
│   │       └── route.ts          # GET, POST, PUT, PATCH, DELETE - Project CRUD
│   ├── projects/
│   │   └── page.tsx              # Public project board (table + modal)
│   ├── submit/
│   │   └── page.tsx              # Project submission form
│   ├── globals.css               # Global styles, animations, glass effects
│   ├── layout.tsx                # Root layout with navbar + background lines
│   └── page.tsx                  # Landing page with 3D globe + dashboard
├── components/
│   ├── ui/
│   │   ├── 3d-globe.tsx          # Aceternity 3D Globe component
│   │   ├── background-lines.tsx  # Aceternity Background Lines component
│   │   └── button.tsx            # shadcn button
│   ├── LayoutBackground.tsx      # Background Lines wrapper (client component)
│   ├── Navbar.tsx                # Responsive navbar with logo + scroll detection
│   ├── ProjectCard.tsx           # Project display card
│   └── StatusBadge.tsx           # Color-coded status badge with pulse animation
├── lib/
│   ├── types.ts                  # TypeScript interfaces (Project, ProjectStatus)
│   └── utils.ts                  # Utility functions (cn)
├── public/
│   └── logo/
│       └── logo.png              # Coreflow AI logo
├── code.gs                       # Google Apps Script (full backend API)
├── .env.local                    # Environment variables
├── components.json               # shadcn configuration
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies
├── postcss.config.mjs            # PostCSS configuration
└── tsconfig.json                 # TypeScript configuration
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ installed
- **Google Account** for Google Sheets + Apps Script
- **npm** or **yarn**

### Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd web_onlyme

# 2. Install dependencies
npm install

# 3. Set up environment variables
# Create .env.local file (see Environment Variables section)

# 4. Set up Google Apps Script (see section below)

# 5. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## Google Apps Script Setup

The project uses Google Sheets as a database via a Google Apps Script Web App API.

### Step 1: Create Google Sheet

1. Go to [sheets.new](https://sheets.new) to create a new spreadsheet
2. Rename the first sheet tab to **`only me`**
3. Add headers in row 1:

| A1 | B1 | C1 | D1 | E1 | F1 | G1 |
|---|---|---|---|---|---|---|
| ID | Project Name | Client Name | Description | Date | Status | Dev Notes |

### Step 2: Deploy Apps Script

1. Open **Extensions > Apps Script** in your Google Sheet
2. Delete all default code
3. Copy and paste the entire contents of `code.gs` from this project
4. **(Optional)** Run the `setupSheet` function once — this will auto-create the sheet with headers, conditional formatting for status colors, and data validation
5. Click **Deploy > New deployment**
6. Configure:
   - **Type**: Web app
   - **Execute as**: Me
   - **Who has access**: **Anyone**
7. Click **Deploy** and authorize when prompted
8. Copy the deployment URL

### Step 3: Update Environment

Paste the deployment URL into `.env.local`:

```env
GOOGLE_SHEET_API_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

> **Important**: Every time you update `code.gs`, you must create a **New deployment** (not update existing) and update the URL in `.env.local`.

### Apps Script Functions

| Function | Action | Description |
|---|---|---|
| `getAllProjects()` | GET | Fetch all projects from the sheet |
| `addProject()` | POST | Add a new project row |
| `updateProject()` | POST | Update status and dev notes |
| `editProject()` | POST | Edit project name, client, description |
| `deleteProject()` | POST | Delete a project row |
| `setupSheet()` | Manual | Initialize sheet with headers and formatting |

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
# Google Apps Script Web App URL
GOOGLE_SHEET_API_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec

# Admin credentials
ADMIN_EMAIL=your-email@example.com
ADMIN_PASSWORD=your-password

# Admin API token (generate a random string)
ADMIN_TOKEN=your-secret-token
```

| Variable | Description |
|---|---|
| `GOOGLE_SHEET_API_URL` | Deployed Google Apps Script Web App URL |
| `ADMIN_EMAIL` | Admin login email address |
| `ADMIN_PASSWORD` | Admin login password |
| `ADMIN_TOKEN` | Bearer token for authenticating admin API requests |

---

## Pages & Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | Landing page — hero, 3D globe, dashboard status, recent projects |
| `/submit` | Public | Project submission form |
| `/projects` | Public | Project board — table view with search, filter, and detail modal |
| `/admin` | Protected | Admin login + dashboard — edit status, dev notes, edit/delete projects |

---

## API Endpoints

All API routes are in `app/api/`.

### `GET /api/projects`

Fetch all projects from Google Sheets.

**Response**: `Project[]`

### `POST /api/projects`

Add a new project.

**Body**:
```json
{
  "projectName": "string",
  "clientName": "string",
  "description": "string"
}
```

### `PUT /api/projects` (Auth Required)

Update project status and dev notes.

**Headers**: `Authorization: Bearer <ADMIN_TOKEN>`

**Body**:
```json
{
  "id": "string",
  "status": "Waiting | In Progress | Revision | Done | Maintenance",
  "devNotes": "string"
}
```

### `PATCH /api/projects` (Auth Required)

Edit project details.

**Headers**: `Authorization: Bearer <ADMIN_TOKEN>`

**Body**:
```json
{
  "id": "string",
  "projectName": "string",
  "clientName": "string",
  "description": "string"
}
```

### `DELETE /api/projects` (Auth Required)

Delete a project.

**Headers**: `Authorization: Bearer <ADMIN_TOKEN>`

**Body**:
```json
{
  "id": "string"
}
```

### `POST /api/admin/login`

Admin authentication.

**Body**:
```json
{
  "email": "string",
  "password": "string"
}
```

**Response**: `{ "token": "string" }`

---

## Database Structure

Google Sheets columns (sheet name: `only me`):

| Column | Field | Type | Description |
|---|---|---|---|
| A | ID | String | Auto-generated unique ID (e.g., `PRJ-MN3XLUFK`) |
| B | Project Name | String | Name of the project |
| C | Client Name | String | Client or requester name |
| D | Description | String | Project description/requirements |
| E | Date | String | Submission date (YYYY-MM-DD) |
| F | Status | String | Current project status |
| G | Dev Notes | String | Developer notes/updates |

---

## Status System

Projects progress through 5 sequential stages:

| # | Status | Color | Description |
|---|---|---|---|
| 1 | **Waiting** | Yellow | Project submitted, waiting to start |
| 2 | **In Progress** | Blue | Actively being developed |
| 3 | **Revision** | Orange | Under review or revision |
| 4 | **Done** | Green | Project completed |
| 5 | **Maintenance** | Red | Ongoing maintenance/support |

### Admin Checklist

In the admin dashboard, status is managed via an interactive checklist:
- Click any step to set the project to that status
- All previous steps are automatically marked as completed
- Current step shows a **"Tahap ini"** (Current Step) badge

### Progress Calculation

```
Progress % = (Step Index + 1) / Total Steps * 100
```

| Status | Progress |
|---|---|
| Waiting | 20% |
| In Progress | 40% |
| Revision | 60% |
| Done | 80% |
| Maintenance | 100% |

---

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Set environment variables in the Vercel dashboard under **Settings > Environment Variables**.

### Important Notes

- After deploying, update `GOOGLE_SHEET_API_URL` if using a new Apps Script deployment
- Ensure Google Apps Script is deployed with **"Anyone"** access for the API to work from your server
- For production, consider replacing the hardcoded admin credentials with a proper authentication system (e.g., NextAuth.js)

---

## Scripts

```bash
npm run dev      # Start development server (Turbopack)
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

---

## License

This project is private and proprietary.

---

Built with Next.js, Tailwind CSS, Three.js, and Google Sheets by **Coreflow AI**
