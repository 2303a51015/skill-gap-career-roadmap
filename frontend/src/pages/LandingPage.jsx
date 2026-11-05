import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  UploadCloud,
  FileCheck2,
  Compass,
  CheckCircle2,
  BarChart2,
  Target,
  ShieldCheck,
  Cpu,
  BookOpen,
  Award
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="max-w-7xl">
          <div className="hero-tagline">
            <Sparkles size={14} />
            Final-Year B.Tech Computer Science Capstone Project
          </div>

          <h1 className="hero-title">
            AI-Based Skill Gap Analysis & <span>Personalized Career Roadmap</span>
          </h1>

          <p className="hero-subtitle">
            Bridge the critical divide between your academic resume and real-world employer job descriptions. Powered by Google Gemini AI and deterministic scoring analytics to generate verified skill matrices, resume feedback, and tailored week-by-week learning milestones.
          </p>

          <div className="hero-actions">
            <Link to="/analyze" className="btn-hero-primary">
              <Sparkles size={18} />
              Analyze My Resume Now
              <ArrowRight size={18} />
            </Link>

            <Link to="/docs" className="btn-hero-secondary">
              <BookOpen size={18} />
              View Academic Documentation
            </Link>
          </div>

          {/* Quick stats banner */}
          <div style={{ marginTop: '3.5rem', display: 'flex', gap: '2.5rem', flexWrap: 'wrap', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '2rem' }}>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38BDF8' }}>70% / 15% / 15%</div>
              <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>Deterministic Weighted Scoring</div>
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#4ADE80' }}>Zero PII Retention</div>
              <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>Instant Upload Disk Cleanup</div>
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FACC15' }}>100% Verified</div>
              <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>Authoritative Learning Resources</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Workflow Section */}
      <section className="section">
        <div className="max-w-7xl">
          <div className="section-header">
            <div className="section-tag">How The System Works</div>
            <h2 className="section-title">Three Intuitive Steps to Career Clarity</h2>
            <p className="section-desc">
              From raw resume document to an actionable, personalized roadmap in under sixty seconds.
            </p>
          </div>

          <div className="steps-grid">
            {/* Step 1 */}
            <div className="step-card">
              <div className="step-num">01</div>
              <div className="step-icon-wrap">
                <UploadCloud size={26} />
              </div>
              <h3 className="step-title">Upload Real Resume</h3>
              <p className="step-desc">
                Provide your candidate resume in PDF, Word (.docx), or plain text format. The system parses structured skills, coursework, and projects while immediately purging temporary files from disk.
              </p>
            </div>

            {/* Step 2 */}
            <div className="step-card">
              <div className="step-num">02</div>
              <div className="step-icon-wrap" style={{ background: '#CFFAFE', color: '#0891B2' }}>
                <FileCheck2 size={26} />
              </div>
              <h3 className="step-title">Input Target Job Description</h3>
              <p className="step-desc">
                Paste the exact job posting from LinkedIn, Indeed, or career portals. Specify your available daily study hours and desired preparation duration in weeks.
              </p>
            </div>

            {/* Step 3 */}
            <div className="step-card">
              <div className="step-num">03</div>
              <div className="step-icon-wrap" style={{ background: '#DCFCE7', color: '#16A34A' }}>
                <Compass size={26} />
              </div>
              <h3 className="step-title">Receive Roadmap & Score</h3>
              <p className="step-desc">
                Get an objective compatibility score, categorized skill comparison, resume bullet improvements, and an interactive week-by-week career learning roadmap with direct documentation links.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Architectural Capabilities */}
      <section className="section" style={{ background: '#F8FAFC', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="max-w-7xl">
          <div className="section-header">
            <div className="section-tag">Core Features</div>
            <h2 className="section-title">Built for Rigorous Academic & Industry Standards</h2>
            <p className="section-desc">
              Engineered with modern software design principles, security barriers, and deterministic auditing.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-box">
              <div className="feature-header">
                <div className="feature-icon">
                  <Award size={22} />
                </div>
                <h4 className="feature-title">Transparent Compatibility Scoring</h4>
              </div>
              <p className="feature-desc">
                Scores are not black-box guesses. We combine 70% technical skill coverage, 15% educational qualification alignment, and 15% experience seniority with documented mathematical formulas.
              </p>
            </div>

            <div className="feature-box">
              <div className="feature-header">
                <div className="feature-icon" style={{ background: '#EFF6FF', color: '#2563EB' }}>
                  <BarChart2 size={22} />
                </div>
                <h4 className="feature-title">Interactive Visual Dashboards</h4>
              </div>
              <p className="feature-desc">
                Rich data visualizations built with Recharts, including doughnut distribution charts, competency domain bars, and circular progress gauges.
              </p>
            </div>

            <div className="feature-box">
              <div className="feature-header">
                <div className="feature-icon" style={{ background: '#DCFCE7', color: '#16A34A' }}>
                  <Target size={22} />
                </div>
                <h4 className="feature-title">Milestone Progress Tracking</h4>
              </div>
              <p className="feature-desc">
                Mark learning milestones as in-progress or completed. State changes are persisted directly to the SQLite backend database for persistent career tracking.
              </p>
            </div>

            <div className="feature-box">
              <div className="feature-header">
                <div className="feature-icon" style={{ background: '#FEF3C7', color: '#D97706' }}>
                  <Sparkles size={22} />
                </div>
                <h4 className="feature-title">ATS Resume Optimization</h4>
              </div>
              <p className="feature-desc">
                Receive specific resume bullet point enhancements based on Google's X-Y-Z formula ("Accomplished [X] measured by [Y] doing [Z]") tailored specifically to the target role.
              </p>
            </div>

            <div className="feature-box">
              <div className="feature-header">
                <div className="feature-icon" style={{ background: '#FEE2E2', color: '#DC2626' }}>
                  <ShieldCheck size={22} />
                </div>
                <h4 className="feature-title">Security & Privacy Guardrails</h4>
              </div>
              <p className="feature-desc">
                Multi-layer sanitization, anti-prompt injection delimiters, randomized temporary filenames, and immediate file cleanup to safeguard candidate privacy.
              </p>
            </div>

            <div className="feature-box">
              <div className="feature-header">
                <div className="feature-icon" style={{ background: '#F1F5F9', color: '#475569' }}>
                  <Cpu size={22} />
                </div>
                <h4 className="feature-title">PDF & JSON Export Engine</h4>
              </div>
              <p className="feature-desc">
                Download publication-ready vector PDF career intelligence reports generated server-side with PDFKit, or export structured JSON data for interoperability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Disclaimer Callout */}
      <section className="section">
        <div className="max-w-7xl">
          <div className="disclaimer-box">
            <ShieldCheck size={24} color="#2563EB" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong style={{ color: '#0F172A', display: 'block', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                Academic Capstone Research Disclaimer:
              </strong>
              The career compatibility score is an algorithmic approximation of documented textual alignment between candidate resume credentials and explicitly stated job requirements. It is designed as an educational tool to guide upskilling and preparation, and does not constitute a legal or contractual guarantee of employment, hiring selection, or interview admission.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
