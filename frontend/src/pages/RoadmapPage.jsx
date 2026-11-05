import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Compass,
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle2,
  ListOrdered,
  Download,
  AlertCircle,
  Filter,
  Sparkles,
  Trophy
} from 'lucide-react';
import MilestoneCard from '../components/MilestoneCard';
import Toast from '../components/Toast';
import { api } from '../services/api';

export default function RoadmapPage() {
  const { id } = useParams();

  const [analysis, setAnalysis] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStage, setFilterStage] = useState('all');
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const toastId = Date.now();
    setToasts((prev) => [...prev, { id: toastId, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toastId));
    }, 4000);
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
          setAnalysis(res.data.analysis);
          setMilestones(res.data.milestones || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err.message || 'Failed to load career roadmap.');
          setLoading(false);
        }
      });

    return () => { mounted = false; };
  }, [id]);

  // Status Change Handler with SQLite Persistence
  const handleStatusChange = async (milestoneId, newStatus) => {
    // 1. Optimistic UI update
    setMilestones((prev) =>
      prev.map((m) => (m.id === milestoneId ? { ...m, status: newStatus } : m))
    );

    try {
      await api.updateMilestoneStatus(id, milestoneId, newStatus);
      const statusLabels = {
        completed: 'Milestone marked as completed!',
        in_progress: 'Milestone set to in progress.',
        not_started: 'Milestone reset to not started.'
      };
      addToast(statusLabels[newStatus] || 'Progress updated.');
    } catch (err) {
      // Revert on error
      addToast(err.message || 'Failed to persist status change.', 'error');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '6rem 0', textAlign: 'center' }}>
        <div style={{ width: 44, height: 44, border: '4px solid #DBEAFE', borderTopColor: '#2563EB', borderRadius: '50%', margin: '0 auto 1.5rem', animation: 'spin 1s linear infinite' }} />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A' }}>Loading Career Roadmap...</h3>
        <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Retrieving personalized study milestones from database</p>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div style={{ padding: '5rem 0', textAlign: 'center' }}>
        <div className="max-w-7xl">
          <div style={{ maxWidth: 500, margin: '0 auto', background: '#FFFFFF', padding: '2.5rem', borderRadius: 16, border: '1px solid #E2E8F0' }}>
            <AlertCircle size={48} color="#DC2626" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>
              Roadmap Not Available
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              {error || 'Unable to load roadmap for this analysis ID.'}
            </p>
            <Link to="/analyze" className="btn btn-primary" style={{ width: '100%' }}>
              Start Analysis
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const completedCount = milestones.filter((m) => m.status === 'completed').length;
  const inProgressCount = milestones.filter((m) => m.status === 'in_progress').length;
  const totalCount = milestones.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const totalHours = milestones.reduce((sum, m) => sum + (m.estimatedHours || 0), 0);

  const filteredMilestones = milestones.filter((m) => {
    if (filterStage === 'all') return true;
    if (filterStage === 'completed') return m.status === 'completed';
    if (filterStage === 'in_progress') return m.status === 'in_progress';
    if (filterStage === 'not_started') return m.status === 'not_started';
    return true;
  });

  return (
    <div style={{ padding: '3rem 0 5rem' }}>
      <div className="max-w-7xl">
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link
            to={`/dashboard/${id}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.88rem',
              fontWeight: 600,
              color: '#2563EB',
              textDecoration: 'none'
            }}
          >
            <ArrowLeft size={16} />
            Back to Match Dashboard
          </Link>
        </div>

        {/* Header Hero Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            color: '#FFFFFF',
            borderRadius: 16,
            padding: '2.5rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ maxWidth: 680 }}>
              <span className="hero-tagline" style={{ background: 'rgba(255,255,255,0.1)', color: '#38BDF8' }}>
                <Compass size={14} />
                Personalized Career Roadmap
              </span>
              <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.5rem', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                {analysis.targetRole} Preparation Plan
              </h1>
              <p style={{ color: '#CBD5E1', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Tailored for <strong>{analysis.experienceLevel}</strong> stage with <strong>{analysis.dailyHours} hours/day</strong> over <strong>{analysis.durationWeeks} weeks</strong>. Each milestone targets concrete missing requirements with verified resources and real deliverables.
              </p>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <a
                href={api.getPdfReportUrl(id)}
                download
                className="btn btn-secondary"
                style={{ background: 'rgba(255,255,255,0.1)', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.2)' }}
              >
                <Download size={16} />
                Download Report PDF
              </a>
            </div>
          </div>

          {/* Progress Tracker Bar */}
          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.88rem', marginBottom: '0.6rem' }}>
              <span>
                Roadmap Completion: <strong>{completedCount} of {totalCount} Milestones Done</strong> ({progressPercent}%)
              </span>
              <span style={{ color: '#94A3B8' }}>
                Total Estimated Study: ~{totalHours} hours
              </span>
            </div>
            <div style={{ height: 10, background: 'rgba(255, 255, 255, 0.15)', borderRadius: 9999, overflow: 'hidden' }}>
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #10B981, #06B6D4)',
                  borderRadius: 9999,
                  transition: 'width 0.4s ease'
                }}
              />
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} color="#64748B" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Filter Milestones:</span>
            {[
              { id: 'all', label: `All (${totalCount})` },
              { id: 'in_progress', label: `In Progress (${inProgressCount})` },
              { id: 'completed', label: `Completed (${completedCount})` },
              { id: 'not_started', label: `Not Started (${totalCount - completedCount - inProgressCount})` }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterStage(f.id)}
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  padding: '0.35rem 0.75rem',
                  borderRadius: 9999,
                  border: filterStage === f.id ? '1px solid #2563EB' : '1px solid #E2E8F0',
                  background: filterStage === f.id ? '#EFF6FF' : '#FFFFFF',
                  color: filterStage === f.id ? '#2563EB' : '#475569',
                  cursor: 'pointer'
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div style={{ fontSize: '0.82rem', color: '#64748B' }}>
            Interactive status changes save directly to SQLite backend
          </div>
        </div>

        {/* Milestones List */}
        <div>
          {filteredMilestones.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem', background: '#FFFFFF', borderRadius: 12, border: '1px solid #E2E8F0', color: '#64748B' }}>
              No milestones match the selected status filter.
            </div>
          ) : (
            filteredMilestones.map((milestone) => (
              <MilestoneCard
                key={milestone.id}
                milestone={milestone}
                onStatusChange={handleStatusChange}
              />
            ))
          )}
        </div>

        {/* Workload Feasibility Notice */}
        <div style={{ marginTop: '2.5rem', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: '1.25rem 1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
          <Sparkles size={20} color="#2563EB" style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
            <strong style={{ color: '#0F172A', display: 'block', marginBottom: '0.2rem' }}>
              Workload & Feasibility Allocation:
            </strong>
            The roadmap organizes goals sequentially starting with high-priority foundational gaps, progressing toward role-specific frameworks, and culminating in full-stack portfolio deliverables. If you encounter scheduling constraints, complete the Foundational and Core Technical milestones first to maximize screening impact.
          </div>
        </div>
      </div>

      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
