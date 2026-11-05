import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Download,
  FileCode,
  Compass,
  ArrowRight,
  Trash2,
  Calendar,
  Clock,
  Briefcase,
  AlertTriangle,
  FileText,
  RotateCcw
} from 'lucide-react';
import MatchScoreGauge from '../components/MatchScoreGauge';
import SkillDistributionChart from '../components/SkillDistributionChart';
import CategoryChart from '../components/CategoryChart';
import SkillBreakdownCard from '../components/SkillBreakdownCard';
import ResumeInsightsCard from '../components/ResumeInsightsCard';
import Toast from '../components/Toast';
import { api } from '../services/api';

export default function DashboardPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [analysisData, setAnalysisData] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const toastId = Date.now();
    setToasts((prev) => [...prev, { id: toastId, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toastId));
    }, 5000);
  };

  const removeToast = (toastId) => {
    setToasts((prev) => prev.filter((t) => t.id !== toastId));
  };

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    api.getAnalysisById(id)
      .then((res) => {
        if (mounted) {
          setAnalysisData(res.data.analysis);
          setMilestones(res.data.milestones || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err.message || 'Failed to load analysis dashboard.');
          setLoading(false);
        }
      });

    return () => { mounted = false; };
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this analysis record and its roadmap?')) {
      return;
    }

    try {
      await api.deleteAnalysis(id);
      addToast('Analysis record deleted successfully.');
      setTimeout(() => navigate('/history'), 800);
    } catch (err) {
      addToast(err.message || 'Failed to delete record.', 'error');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '6rem 0', textAlign: 'center' }}>
        <div style={{ width: 44, height: 44, border: '4px solid #DBEAFE', borderTopColor: '#2563EB', borderRadius: '50%', margin: '0 auto 1.5rem', animation: 'spin 1s linear infinite' }} />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A' }}>Loading Analysis Dashboard...</h3>
        <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Retrieving stored skill evaluation and metrics</p>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !analysisData) {
    return (
      <div style={{ padding: '5rem 0', textAlign: 'center' }}>
        <div className="max-w-7xl">
          <div style={{ maxWidth: 500, margin: '0 auto', background: '#FFFFFF', padding: '2.5rem', borderRadius: 16, border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <AlertTriangle size={48} color="#DC2626" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>
              Analysis Record Not Found
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              {error || `The requested analysis ID "${id}" could not be retrieved from the local database.`}
            </p>
            <Link to="/analyze" className="btn btn-primary" style={{ width: '100%' }}>
              Start a New Analysis
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const matching = analysisData.matchingSkills || [];
  const partial = analysisData.partialSkills || [];
  const missing = analysisData.missingSkills || [];
  const additional = analysisData.additionalSkills || [];

  return (
    <div style={{ padding: '3rem 0 5rem' }}>
      <div className="max-w-7xl">
        {/* Top Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
              <span className="badge badge-blue">Target Assessment</span>
              <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                Conducted on {new Date(analysisData.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h1 style={{ fontSize: '2.3rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              {analysisData.targetRole}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.88rem', color: '#64748B', marginTop: '0.4rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Briefcase size={15} color="#2563EB" />
                Level: <strong>{analysisData.experienceLevel}</strong>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Clock size={15} color="#0891B2" />
                Available: <strong>{analysisData.dailyHours} hrs/day</strong>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calendar size={15} color="#16A34A" />
                Duration: <strong>{analysisData.durationWeeks} weeks</strong>
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to={`/roadmap/${id}`} className="btn btn-primary" style={{ padding: '0.7rem 1.3rem' }}>
              <Compass size={18} />
              Open Personalized Roadmap
              <ArrowRight size={16} />
            </Link>

            <a
              href={api.getPdfReportUrl(id)}
              download
              className="btn btn-secondary"
              title="Download formal PDF report"
            >
              <Download size={16} />
              Download PDF Report
            </a>

            <a
              href={api.getJsonExportUrl(id)}
              download
              className="btn btn-secondary"
              title="Export structured JSON"
            >
              <FileCode size={16} />
              Export JSON
            </a>

            <button
              onClick={handleDelete}
              className="btn btn-danger"
              title="Delete this analysis record"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Row 1: Overall Match Score Gauge + Skill Distribution Donut */}
        <div className="dashboard-grid-2">
          <MatchScoreGauge
            score={analysisData.matchScore}
            band={analysisData.scoreBand}
            explanation={analysisData.scoreExplanation}
          />

          <SkillDistributionChart
            matchingCount={matching.length}
            partialCount={partial.length}
            missingCount={missing.length}
            additionalCount={additional.length}
          />
        </div>

        {/* Row 2: Category Breakdown Bar Chart */}
        <div style={{ marginBottom: '2rem' }}>
          <CategoryChart categories={analysisData.categoryBreakdown || []} />
        </div>

        {/* Row 3: Comprehensive Skill Matrix Card */}
        <SkillBreakdownCard
          matching={matching}
          partial={partial}
          missing={missing}
          additional={additional}
          qualificationGaps={analysisData.qualificationGaps || []}
          experienceGaps={analysisData.experienceGaps || []}
        />

        {/* Row 4: Resume Insights & Optimization Tips */}
        <ResumeInsightsCard
          strengths={analysisData.strengths || []}
          improvements={analysisData.resumeImprovements || []}
        />

        {/* Bottom Banner Nav to Roadmap */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0F172A, #1E293B)',
            color: '#FFFFFF',
            borderRadius: 16,
            padding: '2rem 2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
            boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.3)'
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.4rem' }}>
              Ready to Bridge Your Skill Gaps?
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '0.92rem', maxWidth: 600 }}>
              We've created a custom {analysisData.durationWeeks}-week roadmap targeting the {missing.length + partial.length} specific requirements missing or partially evidenced in your resume.
            </p>
          </div>

          <Link
            to={`/roadmap/${id}`}
            className="btn"
            style={{
              background: 'linear-gradient(135deg, #2563EB, #06B6D4)',
              color: '#FFFFFF',
              fontWeight: 700,
              padding: '0.85rem 1.6rem',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)'
            }}
          >
            Launch Interactive Career Roadmap
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
