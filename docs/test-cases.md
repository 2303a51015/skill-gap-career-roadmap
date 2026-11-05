# Detailed Test Cases & Execution Matrix

## Project Title
**AI-Based Skill Gap Analysis and Personalized Career Roadmap Generation System**

---

## 1. Automated Unit & Integration Test Cases

| Test Case ID | Test Category | Description / Steps | Expected Result | Actual Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC-UNIT-01** | Text Extraction | Call `normalizeText()` with control chars (`\x00`) and excessive CRLF line breaks. | Control characters removed, line breaks normalized to clean LF. | **PASSED** (1.3 ms) |
| **TC-UNIT-02** | Text Extraction | Invoke `extractTextFromFile()` with a text resume fixture and verify temp file cleanup. | Text extracted accurately; temporary file deleted from disk immediately. | **PASSED** (4.1 ms) |
| **TC-UNIT-03** | Text Extraction | Attempt extraction from a file with < 20 readable characters. | Throws descriptive error: *"insufficient readable text"*; cleans temp file. | **PASSED** (2.3 ms) |
| **TC-UNIT-04** | Text Extraction | Pass null and invalid file paths to `safeUnlink()`. | Gracefully handles null without throwing exceptions. | **PASSED** (0.4 ms) |
| **TC-UNIT-05** | Scoring Engine | Provide 100% matching technical skills, satisfied degree, and tenure. | Returns `100.0%`, classification band *"Strong Match"*, all components 100%. | **PASSED** (2.1 ms) |
| **TC-UNIT-06** | Scoring Engine | Provide 1 full match (1.0x) and 1 partial match (0.5x) out of 2 requirements. | Computes technical score 75.0%; final weighted score 81.8%. | **PASSED** (0.4 ms) |
| **TC-UNIT-07** | Scoring Engine | Provide 100% missing requirements and unsatisfied qualifications. | Returns score bounded in $[0, 100]$, band *"Foundational Preparation Needed"*. | **PASSED** (0.4 ms) |
| **TC-UNIT-08** | Scoring Engine | Aggregate skills across categories (Frontend, Database). | Accurately tabulates matching, partial, and missing counts per category. | **PASSED** (0.5 ms) |
| **TC-UNIT-09** | Validation | Pass complete valid form payload to `createAnalysisInputSchema`. | Validation succeeds; returns typed data object. | **PASSED** (3.1 ms) |
| **TC-UNIT-10** | Validation | Pass payload with `userConsent: false`. | Validation throws error: *"You must provide consent for AI skill-gap processing"*. | **PASSED** (3.8 ms) |
| **TC-UNIT-11** | Validation | Validate milestone status against enum (`not_started`, `in_progress`, `completed`). | Accepts valid enum strings; rejects unauthorized strings. | **PASSED** (1.1 ms) |
| **TC-UNIT-12** | Validation | Parse raw AI JSON response with default fallbacks. | Validates target schema and generates structured milestone arrays. | **PASSED** (1.4 ms) |
| **TC-INT-01** | Database | Create an analysis record in SQLite and retrieve by primary key UUID. | Successfully created and retrieved with identical fields. | **PASSED** (12.3 ms) |
| **TC-INT-02** | Database | Create linked milestones and update milestone status to `completed`. | Status updated; `completed_at` timestamp populated. | **PASSED** (3.2 ms) |
| **TC-INT-03** | Database | Delete parent analysis record with foreign key constraints. | Parent analysis and all associated child milestones deleted (cascade). | **PASSED** (2.5 ms) |
| **TC-INT-04** | REST API | Dispatch `GET /api/health`. | Returns HTTP 200 with `{ status: "ok", database: { status: "healthy" } }`. | **PASSED** (39.6 ms) |
| **TC-INT-05** | REST API | Dispatch `POST /api/analyses` with multipart resume attachment and valid fields. | Returns HTTP 201 with generated analysis ID, score, and milestones. | **PASSED** (35.4 ms) |
| **TC-INT-06** | REST API | Dispatch `GET /api/analyses`. | Returns HTTP 200 with array of stored historical analysis summaries. | **PASSED** (4.4 ms) |
| **TC-INT-07** | REST API | Dispatch `GET /api/analyses/:id`. | Returns HTTP 200 with complete analysis details and roadmap milestones. | **PASSED** (5.1 ms) |
| **TC-INT-08** | REST API | Dispatch `PATCH /api/analyses/:id/roadmap/:milestoneId` with `{ status: "in_progress" }`. | Returns HTTP 200 with updated status. | **PASSED** (15.0 ms) |
| **TC-INT-09** | REST API | Dispatch `GET /api/analyses/:id/report`. | Returns HTTP 200 with `Content-Type: application/pdf` and vector stream. | **PASSED** (64.6 ms) |
| **TC-INT-10** | REST API | Dispatch `GET /api/analyses/:id/export-json`. | Returns HTTP 200 with downloadable structured JSON payload. | **PASSED** (6.5 ms) |
| **TC-INT-11** | REST API | Dispatch `DELETE /api/analyses/:id`. | Returns HTTP 200; subsequent GET returns HTTP 404. | **PASSED** (9.3 ms) |

---

## 2. Manual End-to-End Test Verification Procedure

| Test ID | Scenario | Steps | Expected Result | Result |
| :--- | :--- | :--- | :--- | :--- |
| **TC-MAN-01** | Landing Page Navigation | Open `http://localhost:5173/`, click *"Analyze My Resume Now"*. | Navigates cleanly to `/analyze` route. | **Pending Manual Verification** |
| **TC-MAN-02** | Quick Demo Auto-Fill | On `/analyze`, click *"Quick Demo: Load Sample Data"*. | Fills resume fixture, JD text, role, hours, and duration in form. | **Pending Manual Verification** |
| **TC-MAN-03** | Resume Text Preview | Upload a PDF resume and click *"Preview Extracted Text"*. | Opens modal showing word count, char count, and readable text snippet. | **Pending Manual Verification** |
| **TC-MAN-04** | Interactive Status Update | On `/roadmap/:id`, change a milestone status dropdown to *"Completed"*. | Badge turns green, completion bar advances, persisted on page reload. | **Pending Manual Verification** |
| **TC-MAN-05** | Real PDF Download | On `/dashboard/:id`, click *"Download PDF Report"*. | Browser downloads `Career_Roadmap_<Role>_<id>.pdf` with formatted multi-page report. | **Pending Manual Verification** |
| **TC-MAN-06** | Missing Key Graceful Alert | Set `AI_PROVIDER=gemini` with blank `GEMINI_API_KEY`, click Analyze. | Shows toast explaining API key missing with link to Google AI Studio. | **Pending Manual Verification** |
