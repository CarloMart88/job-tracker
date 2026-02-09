# Job Tracker

A full-stack application to track job applications with a modern dashboard, filterable table, and drag-and-drop Kanban board.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)

## Features

- **Dashboard** - Overview stats, pie chart by status, monthly trend bar chart, recent activity feed
- **Applications List** - Sortable/filterable table with pagination, status badges, salary range display
- **Application Detail** - Full details view with vertical status history timeline
- **Kanban Board** - Drag-and-drop cards between status columns (Sent, Interview, Offer, Rejected)
- **CRUD Operations** - Create, edit, and delete applications via modal forms with validation
- **Global Search** - Debounced search across company names, positions, and notes
- **Responsive Design** - Works on desktop, tablet, and mobile

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 19, TypeScript, Vite, SASS Modules, React Router, TanStack Query, Recharts, dnd-kit |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | MySQL |

## Prerequisites

- **Node.js** >= 18
- **MySQL** >= 8.0

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/CarloMart88/job-tracker.git
cd job-tracker
```

### 2. Database setup

```bash
# Login to MySQL and run the schema
mysql -u root -p < server/database/schema.sql

# (Optional) Load sample data
mysql -u root -p < server/database/seed.sql
```

### 3. Configure environment

```bash
cp server/.env.example server/.env
# Edit server/.env with your MySQL credentials
```

### 4. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 5. Start the application

In two separate terminals:

```bash
# Terminal 1 - Backend (port 3001)
cd server
npm run dev

# Terminal 2 - Frontend (port 5173)
cd client
npm run dev
```

Open http://localhost:5173 in your browser.

## API Endpoints

Base URL: `/api/v1`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/applications` | List applications (filters, pagination, sorting) |
| GET | `/applications/:id` | Get application detail with status history |
| POST | `/applications` | Create new application |
| PUT | `/applications/:id` | Update application |
| PATCH | `/applications/:id/status` | Update status only (Kanban) |
| DELETE | `/applications/:id` | Delete application |
| GET | `/stats/overview` | Dashboard stats (totals by status, week, month) |
| GET | `/stats/trends` | Monthly application trends |
| GET | `/stats/recent-activity` | Last 10 status changes |

## Project Structure

```
job-tracker/
├── client/                     # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/         # UI components organized by feature
│   │   ├── hooks/              # Custom React hooks (useApplications, useStats, useDebounce)
│   │   ├── pages/              # Route pages (Dashboard, Applications, Detail, Kanban)
│   │   ├── services/           # API layer (axios + service functions)
│   │   ├── styles/             # Global SASS variables, mixins, reset
│   │   ├── types/              # TypeScript interfaces
│   │   └── utils/              # Helpers (date formatting, status colors, constants)
│   └── package.json
├── server/                     # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── config/             # Database pool + environment config
│   │   ├── controllers/        # Route handlers
│   │   ├── middleware/          # Error handler + request validation
│   │   ├── models/             # Database queries
│   │   ├── routes/             # Express routers
│   │   ├── types/              # TypeScript interfaces
│   │   └── utils/              # Query builder + pagination helpers
│   ├── database/               # SQL schema + seed data
│   └── package.json
└── README.md
```

## License

MIT
