import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Briefcase,
  Sliders,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Calendar,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import FileUploader from '../components/FileUploader';
import TextPreviewModal from '../components/TextPreviewModal';
import LoadingOverlay from '../components/LoadingOverlay';
import Toast from '../components/Toast';
import { api } from '../services/api';
import {
  SAMPLE_RESUME_TEXT,
  SAMPLE_JOB_DESCRIPTION,
  TARGET_ROLE_OPTIONS
} from '../utils/sampleData';

export default function AnalysisInputPage() {
  const navigate = useNavigate();

  // Form State
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [targetRole, setTargetRole] = useState('Full Stack Software Engineer');
  const [experienceLevel, setExperienceLevel] = useState('Fresher');
  const [dailyHours, setDailyHours] = useState(2);
  const [durationWeeks, setDurationWeeks] = useState(8);
  const [learningStyle, setLearningStyle] = useState('Mixed');
  const [userConsent, setUserConsent] = useState(true);

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Preview Resume Text
  const handlePreviewResume = async (file) => {
    if (!file) return;
    setPreviewLoading(true);
    try {
      const res = await api.previewResume(file);
      setPreviewData(res.data);
      setIsPreviewOpen(true);
    } catch (err) {
      addToast(err.message || 'Failed to extract preview text.', 'error');
    } finally {
      setPreviewLoading(false);
    }
  };

  // 1-Click Load Sample Demo Data
  const handleLoadSampleData = () => {
    const sampleBlob = new Blob([SAMPLE_RESUME_TEXT], { type: 'text/plain' });
    const sampleFile = new File([sampleBlob], 'alex_morgan_resume.txt', { type: 'text/plain' });

    setResumeFile(sampleFile);
    setJobDescription(SAMPLE_JOB_DESCRIPTION);
    setTargetRole('Full Stack Software Engineer');
    setExperienceLevel('Fresher');
    setDailyHours(2.5);
    setDurationWeeks(8);
    setLearningStyle('Hands-on Projects');
    setUserConsent(true);
    setFormErrors({});

    addToast('Loaded demonstration resume and job description successfully!');
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!resumeFile) {
      errors.resume = 'Please upload a resume file in PDF, DOCX, or TXT format.';
    }
    if (!jobDescription || jobDescription.trim().length < 30) {
      errors.jobDescription = 'Please enter a target job description (at least 30 characters).';
    }
    if (!targetRole || targetRole.trim().length < 2) {
      errors.targetRole = 'Please specify a target job title.';
    }
    if (!userConsent) {
      errors.consent = 'You must acknowledge the AI analysis privacy consent to continue.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      addToast('Please complete the highlighted requirements before analyzing.', 'error');
      return;
    }

    setFormErrors({});
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('jobDescription', jobDescription);
      formData.append('targetRole', targetRole);
      formData.append('experienceLevel', experienceLevel);
      formData.append('dailyHours', dailyHours);
      formData.append('durationWeeks', durationWeeks);
      formData.append('learningStyle', learningStyle);
      formData.append('userConsent', userConsent);

      const res = await api.createAnalysis(formData);
      addToast('Analysis completed successfully! Loading results dashboard...');
      
      const analysisId = res.data?.analysis?.id;
      if (analysisId) {
        navigate(`/dashboard/${analysisId}`);
      } else {
        navigate('/history');
      }
    } catch (err) {
      setIsLoading(false);
      let errorMsg = err.message || 'An error occurred during analysis.';
      if (err.code === 'GEMINI_KEY_NOT_CONFIGURED') {
        errorMsg = 'Gemini API key is not configured. Add GEMINI_API_KEY to your .env file, or set AI_PROVIDER=mock for offline demo mode.';
      }
      addToast(errorMsg, 'error');
    }
  };

  return (
    <div style={{ padding: '3.5rem 0 5rem' }}>
      <div className="max-w-7xl">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
          <div>
            <div className="section-tag">Assessment Input</div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              Skill Gap & Career Roadmap Assessment
            </h1>
            <p style={{ color: '#64748B', fontSize: '1rem', marginTop: '0.4rem' }}>
              Upload your resume and paste your target job specification to evaluate eligibility and generate a tailored roadmap.
            </p>
          </div>

          {/* Quick Demo Button */}
          <button
            type="button"
            onClick={handleLoadSampleData}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.15rem',
              background: '#F1F5F9',
              border: '1px solid #CBD5E1',
              borderRadius: 8,
              fontSize: '0.88rem',
              fontWeight: 600,
              color: '#1E293B',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <Sparkles size={16} color="#2563EB" />
            Quick Demo: Load Sample Data
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Section 1: Resume Upload */}
          <div className="form-card">
            <h3 className="form-header-title">
              <FileText size={20} color="#2563EB" />
              1. Candidate Resume Document
            </h3>

            <FileUploader
              selectedFile={resumeFile}
              onFileSelect={(file) => {
                setResumeFile(file);
                setFormErrors((prev) => ({ ...prev, resume: null }));
              }}
              onFileRemove={() => setResumeFile(null)}
              onPreviewClick={handlePreviewResume}
              previewLoading={previewLoading}
              error={formErrors.resume}
            />
          </div>

          {/* Section 2: Target Job Description */}
          <div className="form-card">
            <h3 className="form-header-title">
              <Briefcase size={20} color="#0891B2" />
              2. Target Role & Job Specification
            </h3>

            <div className="form-group">
              <label className="form-label" htmlFor="targetRole">
                Target Job Title *
              </label>
              <input
                id="targetRole"
                type="text"
                className="form-input"
                placeholder="e.g. Full Stack Developer, Data Scientist, DevOps Engineer"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              />

              <div className="role-chips">
                <span style={{ fontSize: '0.78rem', color: '#64748B', alignSelf: 'center', marginRight: '0.25rem' }}>
                  Quick select:
                </span>
                {TARGET_ROLE_OPTIONS.slice(0, 5).map((role, i) => (
                  <button
                    key={i}
                    type="button"
                    className="role-chip"
                    onClick={() => setTargetRole(role)}
                  >
                    {role}
                  </button>
                ))}
              </div>
              {formErrors.targetRole && (
                <div style={{ color: '#DC2626', fontSize: '0.82rem', marginTop: '0.35rem' }}>
                  {formErrors.targetRole}
                </div>
              )}
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="form-label" htmlFor="jobDescription" style={{ margin: 0 }}>
                  Job Description Text *
                </label>
                <span style={{ fontSize: '0.78rem', color: jobDescription.length > 25000 ? '#DC2626' : '#64748B' }}>
                  {jobDescription.length} / 25,000 characters
                </span>
              </div>
              <textarea
                id="jobDescription"
                className="form-textarea"
                rows={8}
                placeholder="Paste the full job description here (including responsibilities, required technical skills, qualifications, and preferred tools)..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
              {formErrors.jobDescription && (
                <div style={{ color: '#DC2626', fontSize: '0.82rem', marginTop: '0.35rem' }}>
                  {formErrors.jobDescription}
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Learning Preferences */}
          <div className="form-card">
            <h3 className="form-header-title">
              <Sliders size={20} color="#16A34A" />
              3. Learning Preferences & Preparation Parameters
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">
                  Current Experience Stage
                </label>
                <select
                  className="form-select"
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                >
                  <option value="Student">Student (Enrolled in B.Tech / College)</option>
                  <option value="Fresher">Fresher (Recent Graduate, 0-1 yr)</option>
                  <option value="Entry Level">Entry Level (1-2 years experience)</option>
                  <option value="Experienced">Experienced Professional (2+ years)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Daily Available Learning Time
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <input
                    type="range"
                    min="0.5"
                    max="8"
                    step="0.5"
                    value={dailyHours}
                    onChange={(e) => setDailyHours(parseFloat(e.target.value))}
                    style={{ flex: 1 }}
                  />
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', minWidth: 70, color: '#2563EB' }}>
                    {dailyHours} hrs/day
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Target Duration in Weeks
                </label>
                <select
                  className="form-select"
                  value={durationWeeks}
                  onChange={(e) => setDurationWeeks(parseInt(e.target.value, 10))}
                >
                  <option value={4}>4 Weeks (Intensive Sprint)</option>
                  <option value={8}>8 Weeks (2 Months Balanced)</option>
                  <option value={12}>12 Weeks (3 Months Comprehensive)</option>
                  <option value={16}>16 Weeks (4 Months Deep Dive)</option>
                  <option value={24}>24 Weeks (Semester Preparation)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Preferred Learning Style
                </label>
                <select
                  className="form-select"
                  value={learningStyle}
                  onChange={(e) => setLearningStyle(e.target.value)}
                >
                  <option value="Hands-on Projects">Hands-on Projects & Code Repositories</option>
                  <option value="Reading">Official Docs & Technical Books</option>
                  <option value="Video">Video Lectures & Interactive Tutorials</option>
                  <option value="Mixed">Mixed (Theory + Practical Exercises)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Privacy Consent & Submit */}
          <div className="form-card" style={{ background: '#F8FAFC' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <input
                id="userConsent"
                type="checkbox"
                checked={userConsent}
                onChange={(e) => setUserConsent(e.target.checked)}
                style={{ width: 18, height: 18, marginTop: 3, cursor: 'pointer' }}
              />
              <label htmlFor="userConsent" style={{ fontSize: '0.88rem', color: '#334155', cursor: 'pointer', lineHeight: 1.5 }}>
                <strong>Privacy & AI Analysis Consent: </strong>
                I understand that my resume text and job description will be parsed and evaluated using the configured AI service (Google Gemini) for skill-gap calculation. Original files will be immediately purged from local temporary storage following extraction, and no personal contact details will be sold or transferred.
              </label>
            </div>
            {formErrors.consent && (
              <div style={{ color: '#DC2626', fontSize: '0.82rem', marginBottom: '1rem' }}>
                {formErrors.consent}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1.1rem',
                boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)'
              }}
            >
              <Sparkles size={20} />
              {isLoading ? 'Processing Analysis...' : 'Analyze My Skill Gap & Generate Career Roadmap'}
              <ArrowRight size={20} />
            </button>
          </div>
        </form>
      </div>

      {/* Modal for Text Preview */}
      <TextPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        data={previewData}
      />

      {/* Loading Overlay */}
      <LoadingOverlay isVisible={isLoading} />

      {/* Toasts */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
