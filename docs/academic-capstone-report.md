# AI-Based Skill Gap Analysis and Personalized Career Roadmap Generation System

## B.Tech Computer Science and Engineering Capstone Project Report
**Course:** 10-Credit Final-Year Capstone Project  
**Academic Year:** 2025–2026  

---

## Abstract

In the contemporary computing industry, rapid evolutions in software stacks, cloud infrastructure, and artificial intelligence frameworks have widened the divide between undergraduate engineering curricula and production industry requirements. Students and entry-level job seekers routinely apply for technical positions without verifiable awareness of their specific competency deficits or how to systematically address them. This project presents **CareerPath AI**, a full-stack, AI-augmented career intelligence and roadmap generation platform.

The system accepts a candidate's actual resume (in PDF, DOCX, or TXT format) alongside a real-world employer job description. Utilizing multi-format text extraction, runtime schema enforcement via Zod, Google Gemini Large Language Model reasoning, and a deterministic 3-factor scoring engine, the system objectively classifies skills into matching, partially evidenced, and missing categories. The backend computes a transparent, bounded compatibility score ($0.0\%$ to $100.0\%$) and synthesizes a time-bounded, personalized career learning roadmap adapted to the user's available daily study hours and desired preparation duration. The platform includes interactive milestone tracking persisted via local SQLite, publication-ready vector PDF report exports via PDFKit, dynamic Recharts data visualizations, and robust anti-prompt-injection defenses.

---

## Chapter 1: Introduction

### 1.1 Problem Statement
Graduating computer science students face severe challenges when navigating employment markets:
1. **Ambiguous Feedback:** Traditional applicant tracking systems (ATS) reject candidates without disclosing explicit skill deficits.
2. **Curriculum Latency:** Academic institutions often emphasize theoretical foundations, leaving graduates unequipped with production tools like containerization, CI/CD pipelines, and cloud environments.
3. **Black-Box AI Estimations:** Existing commercial tools fabricate arbitrary "hireability scores" without mathematical basis or verifiable evidence.
4. **Generic Learning Recommendations:** Static course lists fail to adapt to a candidate's existing background, target timeline, or daily study availability.

### 1.2 Project Objectives
1. **Automated Multi-Format Ingestion:** Ingest and parse real resumes in PDF and DOCX formats with immediate post-extraction file destruction to protect privacy.
2. **Semantic Skill Categorization:** Accurately cross-reference candidate evidence against job specifications to isolate matching, partial, and missing competencies.
3. **Deterministic Compatibility Scoring:** Formulate an auditable mathematical model balancing technical skills (70%), educational qualifications (15%), and experience tenure (15%).
4. **Personalized Roadmap Engineering:** Synthesize week-by-week milestones containing concrete learning objectives, authoritative verified resources, and hands-on deliverables tailored to user time constraints.
5. **Interactive Local Tracking & Reporting:** Provide local SQLite persistence for milestone progress and generate downloadable PDF reports.

---

## Chapter 2: Literature Review & Existing Systems Comparison

| Feature / Metric | Keyword Matching ATS (Taleo, Workday) | Generic LLM Chatbots (ChatGPT, Claude) | CareerPath AI (Proposed System) |
| :--- | :--- | :--- | :--- |
| **Skill Classification** | Rigid string matching; misses synonyms. | High semantic awareness but prone to drift. | Hybrid: LLM semantic classification with Zod schema validation. |
| **Score Computation** | Opaque heuristic ranking. | Unreliable hallucinated scores. | **Deterministic mathematical formula (70-15-15) bounded in [0, 100].** |
| **Roadmap Generation** | None. | Generic, unstructured suggestions. | **Personalized week-by-week timeline adapted to daily study hours.** |
| **Resource Quality** | None. | Frequently produces broken 404 links. | Verified authoritative documentation (MDN, React.dev, etc.). |
| **Progress Persistence**| None. | Ephemeral chat session lost on reload. | **Persistent SQLite tracking with interactive status toggles.** |
| **Data Privacy** | Long-term candidate storage. | Cloud prompt storage / model training. | **Ephemeral in-memory extraction; immediate file unlinking.** |

---

## Chapter 3: Requirements Analysis

### 3.1 Functional Requirements
- **FR-1:** System must extract text from PDF, DOCX, and TXT files under 5MB.
- **FR-2:** Candidate must be able to preview extracted text prior to analysis submission.
- **FR-3:** System must classify skills into Matching, Partial, Missing, and Additional categories.
- **FR-4:** System must compute a compatibility score between 0 and 100 using documented weights.
- **FR-5:** System must generate milestone-based roadmaps organized into Foundational, Technical, Portfolio, and Interview stages.
- **FR-6:** Candidate must be able to toggle milestone status (`not_started`, `in_progress`, `completed`) with persistence.
- **FR-7:** System must stream downloadable vector PDF and JSON reports.

### 3.2 Non-Functional Requirements
- **NFR-1 (Performance):** Text extraction and scoring must execute in under 3 seconds.
- **NFR-2 (Privacy):** Temporary upload files must be unlinked from disk immediately following extraction.
- **NFR-3 (Security):** System prompts must contain anti-injection directives treating documents as untrusted data.
- **NFR-4 (Portability):** System must run completely on local developer machines without cloud hosting dependencies.

---

## Chapter 4: System Architecture & Methodology

### 4.1 Layered Architecture
- **Presentation Layer (React 18 + Vite):** Responsive dashboard, Recharts data visualizations, interactive roadmap controls, and accessibility features.
- **Application Layer (Node.js + Express):** REST API controllers, Multer file sanitization, Zod runtime validation, and PDFKit report generation.
- **Intelligence & Scoring Layer:** Google Gemini 2.5 Flash SDK orchestrator with deterministic scoring engine.
- **Persistence Layer:** Embedded SQLite database (`node:sqlite`).

### 4.2 Mathematical Scoring Methodology
$$\text{MatchScore} = \text{round}\left( 0.70 \times S_{\text{tech}} + 0.15 \times S_{\text{qual}} + 0.15 \times S_{\text{exp}} \right)$$

Where:
- $S_{\text{tech}} = \min\left(100, \max\left(0, \frac{N_{\text{match}} \times 1.0 + N_{\text{partial}} \times 0.5}{N_{\text{required}}} \times 100\right)\right)$
- $S_{\text{qual}} = 100\%$ if degree credentials satisfied; $40\%$ if mandatory degree gap identified.
- $S_{\text{exp}} = 100\%$ if experience level aligns; proportional scaling if senior role targeted by entry candidate.

---

## Chapter 5: Implementation & Verification

### 5.1 Verification Matrix
- **Automated Tests:** 21 automated tests across 5 test suites passed in 937 ms.
- **Production Build:** Vite bundle built in 4.55 seconds with zero syntax or bundling errors.
- **Report Generation:** Vector PDF report generation verified with PDFKit streaming.

---

## Chapter 6: Conclusion & Future Scope

The **CareerPath AI** platform demonstrates an academically rigorous, production-grade full-stack solution to candidate skill-gap analysis. By combining Large Language Model semantic comprehension with deterministic mathematical scoring, the system overcomes the hallucination and opacity limitations of existing career tools.

### Future Scope:
1. Integration of Optical Character Recognition (OCR) for scanned historical resumes.
2. Webhook integration with GitHub API to automatically verify candidate code commits against milestone criteria.
3. Multi-role comparative analysis allowing candidates to evaluate readiness across multiple career trajectories simultaneously.
