import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, HelpCircle, PlusCircle, GraduationCap, Briefcase, Filter } from 'lucide-react';

export default function SkillBreakdownCard({
  matching = [],
  partial = [],
  missing = [],
  additional = [],
  qualificationGaps = [],
  experienceGaps = []
}) {
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All Items', count: matching.length + partial.length + missing.length + additional.length },
    { id: 'matching', label: 'Matching', count: matching.length, color: '#16A34A' },
    { id: 'partial', label: 'Partial', count: partial.length, color: '#D97706' },
    { id: 'missing', label: 'Missing Gaps', count: missing.length, color: '#DC2626' },
    { id: 'additional', label: 'Additional', count: additional.length, color: '#2563EB' }
  ];

  return (
    <div className="dashboard-card" style={{ marginBottom: '2rem' }}>
      <div className="card-title-bar">
        <h3 className="card-title">
          <Filter size={20} color="#2563EB" />
          Skill Evidence & Gap Analysis Matrix
        </h3>

        {/* Tab Pills */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                fontSize: '0.82rem',
                fontWeight: 600,
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                border: activeTab === t.id ? '1px solid #2563EB' : '1px solid #E2E8F0',
                background: activeTab === t.id ? '#EFF6FF' : '#FFFFFF',
                color: activeTab === t.id ? '#2563EB' : '#475569',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <span>{t.label}</span>
              <span
                style={{
                  fontSize: '0.72rem',
                  padding: '1px 6px',
                  borderRadius: 9999,
                  background: activeTab === t.id ? '#2563EB' : '#F1F5F9',
                  color: activeTab === t.id ? '#FFFFFF' : '#64748B'
                }}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Qualifications & Experience Gaps Bar */}
      {(qualificationGaps.length > 0 || experienceGaps.length > 0) && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {qualificationGaps.length > 0 && (
            <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 8, padding: '0.85rem 1rem', display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
              <GraduationCap size={18} color="#D97706" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong style={{ fontSize: '0.85rem', color: '#92400E', display: 'block' }}>Qualification Discrepancy:</strong>
                <ul style={{ fontSize: '0.82rem', color: '#B45309', paddingLeft: '1.1rem', marginTop: '0.25rem' }}>
                  {qualificationGaps.map((q, i) => <li key={i}>{q}</li>)}
                </ul>
              </div>
            </div>
          )}

          {experienceGaps.length > 0 && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '0.85rem 1rem', display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
              <Briefcase size={18} color="#DC2626" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong style={{ fontSize: '0.85rem', color: '#991B1B', display: 'block' }}>Experience Alignment Gap:</strong>
                <ul style={{ fontSize: '0.82rem', color: '#B91C1C', paddingLeft: '1.1rem', marginTop: '0.25rem' }}>
                  {experienceGaps.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Skills Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
        {/* Matching Skills */}
        {(activeTab === 'all' || activeTab === 'matching') &&
          matching.map((item, idx) => (
            <div
              key={`match-${idx}`}
              style={{
                border: '1px solid #BBF7D0',
                background: '#F0FDF4',
                borderRadius: 10,
                padding: '1.1rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <CheckCircle2 size={18} color="#16A34A" />
                  <span style={{ fontWeight: 700, fontSize: '1rem', color: '#166534' }}>{item.skill}</span>
                </div>
                <span className="badge badge-green">Match</span>
              </div>
              <p style={{ fontSize: '0.83rem', color: '#15803D', marginBottom: '0.35rem' }}>
                <strong>Evidence: </strong>{item.evidenceInResume}
              </p>
              <p style={{ fontSize: '0.78rem', color: '#4B5563' }}>
                <strong>Context: </strong>{item.jobRequirementContext}
              </p>
            </div>
          ))}

        {/* Partial Skills */}
        {(activeTab === 'all' || activeTab === 'partial') &&
          partial.map((item, idx) => (
            <div
              key={`partial-${idx}`}
              style={{
                border: '1px solid #FDE68A',
                background: '#FFFBEB',
                borderRadius: 10,
                padding: '1.1rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <AlertCircle size={18} color="#D97706" />
                  <span style={{ fontWeight: 700, fontSize: '1rem', color: '#92400E' }}>{item.skill}</span>
                </div>
                <span className="badge badge-amber">Partial Match</span>
              </div>
              <p style={{ fontSize: '0.83rem', color: '#B45309', marginBottom: '0.35rem' }}>
                <strong>Gap: </strong>{item.missingAspect}
              </p>
              <p style={{ fontSize: '0.78rem', color: '#4B5563' }}>
                <strong>Bridging Action: </strong>{item.bridgingAction}
              </p>
            </div>
          ))}

        {/* Missing Skills */}
        {(activeTab === 'all' || activeTab === 'missing') &&
          missing.map((item, idx) => (
            <div
              key={`missing-${idx}`}
              style={{
                border: '1px solid #FECACA',
                background: '#FEF2F2',
                borderRadius: 10,
                padding: '1.1rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <HelpCircle size={18} color="#DC2626" />
                  <span style={{ fontWeight: 700, fontSize: '1rem', color: '#991B1B' }}>{item.skill}</span>
                </div>
                <span className="badge badge-red">Missing Gap</span>
              </div>
              <p style={{ fontSize: '0.83rem', color: '#B91C1C', marginBottom: '0.35rem' }}>
                <strong>Priority: </strong>{item.importance || 'High'}
              </p>
              <p style={{ fontSize: '0.78rem', color: '#4B5563' }}>
                <strong>Rationale: </strong>{item.rationale}
              </p>
            </div>
          ))}

        {/* Additional Skills */}
        {(activeTab === 'all' || activeTab === 'additional') &&
          additional.map((item, idx) => (
            <div
              key={`add-${idx}`}
              style={{
                border: '1px solid #BFDBFE',
                background: '#EFF6FF',
                borderRadius: 10,
                padding: '1.1rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <PlusCircle size={18} color="#2563EB" />
                  <span style={{ fontWeight: 700, fontSize: '1rem', color: '#1E40AF' }}>{item.skill}</span>
                </div>
                <span className="badge badge-blue">Bonus in Resume</span>
              </div>
              <p style={{ fontSize: '0.83rem', color: '#1D4ED8', marginBottom: '0.35rem' }}>
                <strong>Category: </strong>{item.category || 'Other'}
              </p>
              <p style={{ fontSize: '0.78rem', color: '#4B5563' }}>
                {item.note || 'Complementary skill demonstrating breadth of technical profile.'}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}
