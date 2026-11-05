import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  History,
  Calendar,
  Clock,
  Compass,
  Download,
  Trash2,
  ExternalLink,
  PlusCircle,
  FileText,
  AlertCircle
} from 'lucide-react';
import Toast from '../components/Toast';
import { api } from '../services/api';

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const loadHistory = () => {
    setLoading(true);
    api.getAllAnalyses()
      .then((res) => {
        setAnalyses(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load past analyses.');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = async (id, roleName) => {
    if (!window.confirm(`Permanently delete the analysis record for "${roleName}"?`)) {
      return;
    }

    try {
      await api.deleteAnalysis(id);
      addToast(`Deleted analysis for ${roleName}.`);
      setAnalyses((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      addToast(err.message || 'Failed to delete analysis.', 'error');
    }
  };

  return (
    <div style={{ padding: '3.5rem 0 5rem' }}>
      <div className="max-w-7xl">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
          <div>
            <div className="section-tag">Stored Assessments</div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              Analysis History & Reports
            </h1>
            <p style={{ color: '#64748B', fontSize: '1rem', marginTop: '0.4rem' }}>
              Review past skill-gap assessments, track milestone completion, and export formal PDF reports.
            </p>
          </div>

          <Link to="/analyze" className="btn btn-primary">
            <PlusCircle size={18} />
            Start New Analysis
          </Link>
        </div>

        {loading ? (
          <div style={{ padding: '5rem 0', textAlign: 'center' }}>
            <div style={{ width: 40, height: 40, border: '4px solid #DBEAFE', borderTopColor: '#2563EB', borderRadius: '50%', margin: '0 auto 1.5rem', animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#64748B' }}>Loading stored assessment records...</p>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : error ? (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: '2rem', textAlign: 'center', color: '#DC2626' }}>
            <AlertCircle size={32} style={{ margin: '0 auto 0.75rem' }} />
            <p>{error}</p>
          </div>
        ) : analyses.length === 0 ? (
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: '4.5rem 2rem', textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <History size={32} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>
              No Saved Analyses Yet
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.95rem', marginBottom: '1.75rem', lineHeight: 1.5 }}>
              Upload your resume and a target job description to run your first skill-gap evaluation and generate a career roadmap.
            </p>
            <Link to="/analyze" className="btn btn-primary">
              <PlusCircle size={18} />
              Run Your First Assessment
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {analyses.map((item) => {
              const score = Math.round(item.matchScore);
              let scoreColor = '#2563EB';
              let badgeStyle = { background: '#DBEAFE', color: '#1E40AF' };
              if (score >= 85) {
                scoreColor = '#16A34A';
                badgeStyle = { background: '#DCFCE7', color: '#166534' };
              } else if (score >= 70) {
                scoreColor = '#2563EB';
                badgeStyle = { background: '#DBEAFE', color: '#1E40AF' };
              } else if (score >= 50) {
                scoreColor = '#D97706';
                badgeStyle = { background: '#FEF3C7', color: '#92400E' };
              } else {
                scoreColor = '#DC2626';
                badgeStyle = { background: '#FEE2E2', color: '#991B1B' };
              }

              return (
                <div
                  key={item.id}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: 12,
                    padding: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1.25rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    transition: 'border-color 0.2s, box-shadow 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    {/* Score Circle */}
                    <div
                      style={{
                        width: 62,
                        height: 62,
                        borderRadius: '50%',
                        border: `4px solid ${scoreColor}`,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>
                        {score}%
                      </span>
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>
                          {item.targetRole}
                        </h3>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: 9999, ...badgeStyle }}>
                          {score >= 70 ? 'Strong Match' : score >= 50 ? 'Moderate Gap' : 'Foundational'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.82rem', color: '#64748B' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Calendar size={13} />
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                        <span>Level: <strong>{item.experienceLevel}</strong></span>
                        <span>Daily: <strong>{item.dailyHours} hrs</strong></span>
                        <span>Duration: <strong>{item.durationWeeks} weeks</strong></span>
                        <span>
                          Milestones: <strong>{item.completedMilestones || 0} / {item.totalMilestones || 0}</strong> completed
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Link
                      to={`/dashboard/${item.id}`}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.85rem', padding: '0.5rem 0.9rem' }}
                    >
                      <Compass size={14} />
                      Dashboard
                    </Link>

                    <Link
                      to={`/roadmap/${item.id}`}
                      className="btn btn-primary"
                      style={{ fontSize: '0.85rem', padding: '0.5rem 0.9rem' }}
                    >
                      Roadmap
                    </Link>

                    <a
                      href={api.getPdfReportUrl(item.id)}
                      download
                      className="btn btn-secondary"
                      style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}
                      title="Download PDF"
                    >
                      <Download size={14} />
                    </a>

                    <button
                      onClick={() => handleDelete(item.id, item.targetRole)}
                      className="btn btn-danger"
                      style={{ padding: '0.5rem 0.75rem' }}
                      title="Delete record"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
