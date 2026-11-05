import React from 'react';
import { Sparkles, ThumbsUp, Lightbulb, CheckSquare } from 'lucide-react';

export default function ResumeInsightsCard({ strengths = [], improvements = [] }) {
  return (
    <div className="dashboard-card" style={{ marginBottom: '2rem' }}>
      <div className="card-title-bar">
        <h3 className="card-title">
          <Sparkles size={20} color="#F59E0B" />
          Strategic Resume & ATS Optimization Insights
        </h3>
        <span className="badge badge-amber">Actionable Feedback</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.75rem' }}>
        {/* Demonstrated Strengths */}
        <div>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '1rem', fontWeight: 700, color: '#166534', marginBottom: '0.85rem' }}>
            <ThumbsUp size={18} color="#16A34A" />
            Evidenced Strengths
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {strengths.length === 0 ? (
              <p style={{ fontSize: '0.88rem', color: '#64748B' }}>No specific strengths highlighted.</p>
            ) : (
              strengths.map((s, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.6rem',
                    background: '#F0FDF4',
                    border: '1px solid #DCFCE7',
                    padding: '0.75rem 0.9rem',
                    borderRadius: 8,
                    fontSize: '0.85rem',
                    color: '#15803D'
                  }}
                >
                  <CheckSquare size={16} color="#16A34A" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>{s}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Targeted Improvements */}
        <div>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '1rem', fontWeight: 700, color: '#1E40AF', marginBottom: '0.85rem' }}>
            <Lightbulb size={18} color="#2563EB" />
            High-Impact Resume Polish
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {improvements.length === 0 ? (
              <p style={{ fontSize: '0.88rem', color: '#64748B' }}>No resume modifications recommended.</p>
            ) : (
              improvements.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderLeft: '4px solid #2563EB',
                    borderRadius: 8,
                    padding: '0.85rem 1rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase' }}>
                      {item.section || 'General'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.87rem', fontWeight: 600, color: '#0F172A', marginBottom: '0.25rem' }}>
                    {item.suggestedImprovement}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: '#64748B' }}>
                    <strong>Why: </strong>{item.rationale}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
