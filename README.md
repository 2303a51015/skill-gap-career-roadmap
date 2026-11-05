# CareerPath AI: Skill Gap Analysis & Personalized Career Roadmap System

> **Final-Year B.Tech Computer Science & Engineering Capstone Project (10 Credits)**  
> An intelligent full-stack career intelligence platform that analyzes real candidate resumes against target job descriptions, computes deterministic compatibility scores, and synthesizes time-bounded, personalized career learning roadmaps.

---

## Table of Contents
1. [Project Overview & Objectives](#project-overview--objectives)
2. [Key Capabilities & Features](#key-capabilities--features)
3. [Technology Stack](#technology-stack)
4. [System Architecture](#system-architecture)
5. [Prerequisites](#prerequisites)
6. [Installation & Setup](#installation--setup)
7. [Environment Configuration & Gemini API Key](#environment-configuration--gemini-api-key)
8. [Running the Application](#running-the-application)
9. [Running Automated Tests](#running-automated-tests)
10. [Building for Production](#building-for-production)
11. [REST API Endpoints](#rest-api-endpoints)
12. [Database Design & Data Governance](#database-design--data-governance)
13. [Troubleshooting Guide](#troubleshooting-guide)
14. [Academic Capstone Documentation](#academic-capstone-documentation)
15. [License](#license)

---

## Project Overview & Objectives

In the modern technology landscape, academic curricula often lag behind rapidly evolving industry tech stacks. Students frequently apply for engineering roles without clear awareness of their specific competency gaps or an actionable strategy to bridge them.

**CareerPath AI** addresses this challenge by providing:
- **Real Document Extraction:** Ingests actual resumes in **PDF**, **DOCX**, and **TXT** formats.
- **Semantic Skill Categorization:** Cross-references candidate evidence against job specifications to isolate **Matching**, **Partially Evidenced**, and **Missing** skills.
- **Deterministic 3-Factor Scoring:** Combines 70% technical coverage, 15% educational qualifications, and 15% experience tenure into an auditable $[0, 100]$ compatibility score.
- **Personalized Time-Based Roadmaps:** Generates sequential learning milestones adapted to declared daily study hours (e.g., 2 hrs/day) and preparation duration (e.g., 8 weeks).
- **Interactive Tracking & Reports:** Persists milestone progress directly to SQLite and generates downloadable, multi-page vector PDF reports.

---

## Key Capabilities & Features

| Capability | Technical Implementation |
| :--- | :--- |
| **Multi-Format Resume Ingestion** | Extracts machine-readable text from `.pdf` (`pdf-parse`), `.docx` (`mammoth`), and `.txt` up to 5MB. |
| **Text Extraction Preview** | Allows candidate to inspect what the parser reads from their resume before submission. |
| **Google Gemini AI Reasoning** | Official `@google/generative-ai` SDK utilizing `gemini-2.5-flash` with structured JSON mode. |
| **Deterministic Scoring Math** | Closed-form weighted formula bounded in $[0, 100]$; no hallucinated scores. |
| **Interactive Visual Dashboards** | Recharts dynamic SVG visualizations (Doughnut distribution, Domain Bar charts, Radial progress). |
| **Role-Tailored ATS Optimization** | Actionable bullet-point improvements following Google's X-Y-Z achievement formula. |
| **Interactive Roadmap Tracking** | Milestones with status dropdowns (`not_started`, `in_progress`, `completed`) saved in SQLite. |
| **Official Learning Resources** | Real, verified documentation links (MDN, React.dev, Python.org, Roadmap.sh). |
| **Publication-Ready PDF Reports** | Server-side multi-page vector PDF generation using `pdfkit`. |
| **Zero-PII Ephemeral Ingestion** | Uploaded documents are deleted from disk immediately after text extraction in `finally` blocks. |
| **Offline Demonstration Mode** | Built-in high-fidelity mock provider (`AI_PROVIDER=mock`) for offline viva presentations. |

---

## Technology Stack

### Frontend
- **Framework:** React 18 with Vite
- **Routing:** React Router v6
- **Data Visualization:** Recharts (SVG Pie, Donut, Bar Charts)
- **Icons:** Lucide React
- **Styling:** Custom responsive CSS3 design system (Navy, Royal Blue, Slate, Cyan)

### Backend
- **Runtime & Server:** Node.js (v18+; tested on v26 LTS) with Express.js REST API
- **File Parsing:** Multer, `pdf-parse`, `mammoth`
- **Schema Validation:** Zod runtime validation
- **PDF Generation:** PDFKit
- **Database:** SQLite (`node:sqlite` / `DatabaseSync`)
- **AI Integration:** Google Gemini API (`@google/generative-ai`)

---

## System Architecture

```
skill-gap-career-roadmap/
├── frontend/                     # React 18 + Vite Single Page Application
│   ├── src/
│   │   ├── components/           # UI components (Gauges, Charts, Cards, Modals)
│   │   ├── pages/                # 6 Pages (Landing, Input, Dashboard, Roadmap, History, Docs)
│   │   ├── services/api.js       # Centralized REST client
│   │   ├── utils/sampleData.js   # 1-click viva test fixtures
│   │   └── styles/index.css      # Executive design system
│   ├── index.html
│   └── vite.config.js
├── backend/                      # Node.js + Express REST API
│   ├── src/
│   │   ├── config/env.js         # Environment & path management
│   │   ├── database/             # SQLite connection & schema repositories
│   │   ├── services/             # Scoring, text extraction, PDF generation, AI
│   │   ├── services/ai/          # Gemini SDK & Mock providers
│   │   ├── validators/           # Zod schemas for input and AI output
│   │   ├── controllers/          # API endpoint logic
│   │   └── routes/               # Express route declarations
│   ├── tests/                    # Automated unit & integration test suites
│   ├── server.js                 # Server entry point
│   └── package.json
├── docs/                         # Capstone academic reports & specifications
│   ├── system-architecture.md
│   ├── database-design.md
│   ├── api-documentation.md
│   ├── test-plan.md
│   ├── test-cases.md
│   ├── test-summary-template.md
│   ├── user-manual.md
│   ├── privacy-and-limitations.md
│   └── academic-capstone-report.md
├── .env.example
├── .gitignore
├── package.json                  # Root runner script
└── README.md
```

---

## Prerequisites

- **Node.js:** Version 18.0.0 or higher (v20+ recommended).
  Check your version:
  ```powershell
  node -v
  npm -v
  ```
- **Operating System:** Windows 10/11, macOS, or Linux.
- **Code Editor:** Visual Studio Code (optional, but recommended).

---

## Installation & Setup

1. **Clone or Open the Project Folder:**
   ```powershell
   cd C:\Users\srika\OneDrive\Documents\skill-gap-career-roadmap
   ```

2. **Install All Dependencies:**
   Run the root installer to install backend, frontend, and runner tools:
   ```powershell
   npm run install:all
   ```
   *(Or individually: `cd backend && npm install`, then `cd ../frontend && npm install`)*

---

## Environment Configuration & Gemini API Key

The application is pre-configured with default values in `backend/.env`.

### Obtaining a Free Gemini API Key:
1. Visit **[Google AI Studio](https://aistudio.google.com/app/apikey)**.
2. Sign in with your Google account.
3. Click **"Create API Key"** and copy your generated key.
4. Open `backend/.env` in VS Code and set:
   ```env
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173

   # Paste your key below:
   GEMINI_API_KEY=AIzaSyYourRealKeyHere
   GEMINI_MODEL=gemini-2.5-flash
   AI_PROVIDER=gemini

   DATABASE_PATH=./data/career_roadmap.sqlite
   MAX_FILE_SIZE_MB=5
   ```

> **Offline Demo Mode (No Key Required):**  
> If you do not have an internet connection or want to run an offline viva presentation, set:
> ```env
> AI_PROVIDER=mock
> ```
> The system will run its deterministic semantic keyword matcher offline without paid API charges!

---

## Running the Application

### Option A: Run Both Servers Concurrently (Recommended)
From the root directory, run:
```powershell
npm run dev
```

### Option B: Run in Separate Terminals
**Terminal 1 (Backend API):**
```powershell
cd backend
npm run dev
```
*Backend starts on [http://localhost:5000](http://localhost:5000)*

**Terminal 2 (Frontend Client):**
```powershell
cd frontend
npm run dev
```
*Frontend starts on [http://localhost:5173](http://localhost:5173)*

Open your browser to: **[http://localhost:5173](http://localhost:5173)**

---

## Running Automated Tests

The project includes an automated test suite verifying scoring math, Zod schemas, file extraction, temp-file deletion, and API routes.

Run the test suite from the root folder:
```powershell
npm test
```
*(Or inside backend: `cd backend && npm test`)*

### Test Suite Execution Output:
```
▶ Backend REST API Endpoints (8 tests passed)
▶ SQLite Database Repositories (1 test passed)
▶ Deterministic Scoring Engine (4 tests passed)
▶ Text Extractor Service (4 tests passed)
▶ Input and Output Validators (4 tests passed)
✔ 21 tests passed across 5 suites (100% success rate in <1s)
```

---

## Building for Production

To create a minified, production-ready frontend bundle:
```powershell
npm run build
```
This compiles assets to `frontend/dist/` in ~4 seconds.

---

## REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Server health diagnostics and DB status. |
| `POST` | `/api/analyses/preview` | Upload resume to preview extracted text. |
| `POST` | `/api/analyses` | Submit resume + job description for full evaluation. |
| `GET` | `/api/analyses` | Retrieve historical analysis records. |
| `GET` | `/api/analyses/:id` | Fetch single analysis details and roadmap. |
| `PATCH`| `/api/analyses/:id/roadmap/:milestoneId` | Update milestone completion status. |
| `GET` | `/api/analyses/:id/report` | Stream downloadable multi-page vector PDF report. |
| `GET` | `/api/analyses/:id/export-json` | Download structured analysis JSON. |
| `DELETE`| `/api/analyses/:id` | Permanently delete analysis and cascade milestones. |

---

## Database Design & Data Governance

- **Database Engine:** Embedded SQLite (`backend/data/career_roadmap.sqlite`).
- **Tables:** `analyses` (primary evaluation sessions) and `milestones` (learning goals).
- **Referential Integrity:** `FOREIGN KEY (analysis_id) REFERENCES analyses(id) ON DELETE CASCADE`.
- **Ephemeral Uploads:** Uploaded resumes in `backend/temp_uploads` are deleted immediately using `safeUnlink()` inside guaranteed `finally` blocks.
- **Privacy:** Candidate contact details (phone, email) are scrubbed from application logs.

---

## Troubleshooting Guide

1. **"API Offline" badge in Navbar:**  
   Ensure the backend is running on port 5000 (`cd backend && npm run dev`).
2. **"Gemini API Key is not configured" error:**  
   Add your API key to `backend/.env` or switch to `AI_PROVIDER=mock`.
3. **Execution Policy Error on Windows PowerShell:**  
   If PowerShell blocks npm scripts, run:
   ```powershell
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
   ```
4. **"Port 5000 already in use":**  
   Change `PORT=5001` in `backend/.env` and update the proxy port in `frontend/vite.config.js`.

---

## Academic Capstone Documentation

Comprehensive academic documentation is located in the `docs/` folder:
- **System Architecture:** [`docs/system-architecture.md`](docs/system-architecture.md)
- **Database Schema:** [`docs/database-design.md`](docs/database-design.md)
- **REST API Specification:** [`docs/api-documentation.md`](docs/api-documentation.md)
- **Quality Assurance & Test Plan:** [`docs/test-plan.md`](docs/test-plan.md)
- **Test Cases Matrix:** [`docs/test-cases.md`](docs/test-cases.md)
- **Test Summary Template:** [`docs/test-summary-template.md`](docs/test-summary-template.md)
- **User Operator Manual:** [`docs/user-manual.md`](docs/user-manual.md)
- **Privacy Policy & Limitations:** [`docs/privacy-and-limitations.md`](docs/privacy-and-limitations.md)
- **Formal Capstone Project Report:** [`docs/academic-capstone-report.md`](docs/academic-capstone-report.md)

---

## License

This project is developed as an academic capstone for Computer Science & Engineering education under the MIT License.
