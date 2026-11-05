# REST API Documentation

## Base URL
```
http://localhost:5000/api
```

---

## 1. System Health Check

### `GET /health`
Returns system diagnostics, database connection status, and AI provider configuration.

#### Response `200 OK`
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2026-10-31T13:45:00.000Z",
    "uptime": 128,
    "nodeVersion": "v26.13.0",
    "environment": "development",
    "database": {
      "type": "sqlite",
      "status": "healthy",
      "path": ".../career_roadmap.sqlite"
    },
    "ai": {
      "provider": "gemini",
      "geminiKeyConfigured": true,
      "model": "gemini-2.5-flash"
    }
  }
}
```

---

## 2. Resume Text Extraction Preview

### `POST /analyses/preview`
Allows pre-submission verification of text extracted from an uploaded resume file. Does not invoke the LLM or create a database record.

#### Request Headers
`Content-Type: multipart/form-data`

#### Form Fields
- `resume` (File, Required): PDF, DOCX, or TXT file (Max 5MB).

#### Response `200 OK`
```json
{
  "success": true,
  "data": {
    "textPreview": "Alex Morgan\nEducation: B.Tech in Computer Science...",
    "totalCharacters": 1845,
    "totalWords": 280,
    "pageCount": 1,
    "isTruncated": false
  }
}
```

---

## 3. Create Full Skill Gap Analysis

### `POST /analyses`
Uploads candidate resume and target job description, performs AI semantic skill matching, calculates deterministic compatibility score, synthesizes a time-based learning roadmap, and stores records in SQLite.

#### Request Headers
`Content-Type: multipart/form-data`

#### Form Fields
| Field Name | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `resume` | `File` | Required (PDF/DOCX/TXT) | Candidate resume document (Max 5MB). |
| `jobDescription` | `String` | Min 30 chars, Max 25,000 | Text of the target job posting. |
| `targetRole` | `String` | Min 2, Max 100 chars | Desired job title. |
| `experienceLevel`| `String` | Enum | `Student`, `Fresher`, `Entry Level`, `Experienced`. |
| `dailyHours` | `Number` | Min 0.5, Max 16.0 | Available study hours per day. |
| `durationWeeks` | `Integer`| Min 1, Max 52 | Target preparation duration in weeks. |
| `learningStyle` | `String` | Enum | `Reading`, `Video`, `Hands-on Projects`, `Mixed`. |
| `userConsent` | `Boolean`| Required (`true`) | Explicit consent for AI processing. |

#### Response `201 Created`
```json
{
  "success": true,
  "data": {
    "analysis": {
      "id": "c1f72740-4284-4869-b541-b851b43aa943",
      "targetRole": "Full Stack Software Engineer",
      "experienceLevel": "Fresher",
      "dailyHours": 2.5,
      "durationWeeks": 8,
      "learningStyle": "Hands-on Projects",
      "matchScore": 81.8,
      "scoreBand": "Moderate-High Match",
      "scoreExplanation": {
        "method": "Weighted skill coverage and qualification alignment",
        "weights": { "technicalSkills": 70, "qualifications": 15, "experience": 15 },
        "componentScores": { "technicalSkills": 75.0, "qualifications": 95.0, "experience": 100.0 }
      },
      "matchingSkills": [
        { "skill": "React", "category": "Frameworks", "evidenceInResume": "Built full stack e-commerce app..." }
      ],
      "partialSkills": [
        { "skill": "TypeScript", "category": "Languages", "missingAspect": "JS evidenced, TS typed systems needed..." }
      ],
      "missingSkills": [
        { "skill": "Docker", "category": "Cloud & DevOps", "importance": "High", "rationale": "Explicitly required..." }
      ],
      "resumeImprovements": [
        { "section": "Projects", "suggestedImprovement": "Quantify outcomes with latency and user metrics." }
      ]
    },
    "milestones": [
      {
        "id": "d825c9ab-48e0-4753-9118-a6d173d122e2",
        "milestoneIndex": 1,
        "weekRange": "Week 1 - 2",
        "skill": "Docker Containerization",
        "priority": "High",
        "estimatedHours": 35,
        "status": "not_started",
        "resources": [
          { "title": "Docker Official Documentation", "url": "https://docs.docker.com/" }
        ]
      }
    ]
  }
}
```

---

## 4. Retrieve Analysis History

### `GET /analyses`
Retrieves a summary list of all stored analyses ordered by creation date descending.

#### Response `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "c1f72740-4284-4869-b541-b851b43aa943",
      "targetRole": "Full Stack Software Engineer",
      "experienceLevel": "Fresher",
      "dailyHours": 2.5,
      "durationWeeks": 8,
      "matchScore": 81.8,
      "totalMilestones": 5,
      "completedMilestones": 1,
      "createdAt": "2026-10-31T13:45:00.000Z"
    }
  ]
}
```

---

## 5. Retrieve Single Analysis

### `GET /analyses/:id`
Retrieves the full analysis record and all associated roadmap milestones.

#### Response `200 OK`
```json
{
  "success": true,
  "data": {
    "analysis": { /* Full analysis fields */ },
    "milestones": [ /* Array of milestones */ ]
  }
}
```

---

## 6. Update Milestone Status

### `PATCH /analyses/:id/roadmap/:milestoneId`
Updates the completion status of a specific milestone in the SQLite database.

#### Request Body
```json
{
  "status": "completed"
}
```
*Allowed values:* `"not_started"`, `"in_progress"`, `"completed"`.

#### Response `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "d825c9ab-48e0-4753-9118-a6d173d122e2",
    "status": "completed",
    "completedAt": "2026-10-31T14:10:00.000Z"
  }
}
```

---

## 7. Download PDF Report

### `GET /analyses/:id/report`
Streams a dynamically generated multi-page vector PDF report generated via PDFKit.

#### Response Headers
- `Content-Type: application/pdf`
- `Content-Disposition: attachment; filename="Career_Roadmap_<role>_<id>.pdf"`

---

## 8. Export Structured JSON

### `GET /analyses/:id/export-json`
Streams a complete JSON export of the analysis metadata and roadmap records.

---

## 9. Delete Analysis

### `DELETE /analyses/:id`
Permanently deletes an analysis record and cascades deletion to all associated milestones.

#### Response `200 OK`
```json
{
  "success": true,
  "message": "Analysis record and associated roadmap milestones were permanently deleted."
}
```

---

## 10. Standard Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request payload validation failed.",
    "details": [
      { "field": "targetRole", "message": "Target job title must be at least 2 characters" }
    ]
  }
}
```
