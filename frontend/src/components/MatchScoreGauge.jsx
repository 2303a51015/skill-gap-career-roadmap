import React from 'react';
import { Award, Info, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

export default function MatchScoreGauge({ score = 0, band = '', explanation = {} }) {
  const roundedScore = Math.round(score);

  // SVG circle calculations
  const radius = 70;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (roundedScore / 100) * circumference;

  let strokeColor = '#2563EB';
  let badgeClass = 'badge-blue';
  if (roundedScore >= 85) {
    strokeColor = '#16A34A';
    badgeClass = 'badge-green';
  } else if (roundedScore >= 70) {
    strokeColor = '#2563EB';
    badgeClass = 'badge-blue';
  } else if (roundedScore >= 50) {
    strokeColor = '#D97706';
    badgeClass = 'badge-amber';
  } else {
    strokeColor = '#DC2626';
    badgeClass = 'badge-red';
  }

  const weights = explanation?.weights || { technicalSkills: 70, qualifications: 15, experience: 15 };
  const components = explanation?.componentScores || {
    technicalSkills: roundedScore,
    qualifications: 100,
    experience: 100
  };

  return (
    <div className="dashboard-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="card-title-bar">
        <h3 className="card-title">
          <Award size={20} color="#2563EB" />
          Overall Match Compatibility Score
        </h3>
        <span className={`badge ${badgeClass}`}>
          {band || (roundedScore >= 70 ? 'Eligible' : 'Needs Upskilling')}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2.5rem', flexWrap: 'wrap', padding: '1rem 0' }}>
        {/* Circular SVG Gauge */}
        <div style={{ position: 'relative', width: 170, height: 170 }}>
          <svg width="170" height="170" className="gauge-svg">
            <circle
              className="gauge-bg"
              cx="85"
              cy="85"
              r={radius}
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            <circle
              className="gauge-bar"
              cx="85"
              cy="85"
              r={radius}
              strokeWidth={strokeWidth}
              stroke={strokeColor}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center'
            }}
          >
            <span style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>
              {roundedScore}%
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.2rem' }}>
              Fit Score
            </span>
          </div>
        </div>

        {/* Component Weight Breakdown */}
        <div style={{ flex: 1, minWidth: 240, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
              <span style={{ color: '#0F172A' }}>Technical Skill Coverage ({weights.technicalSkills}%)</span>
              <span style={{ color: '#2563EB' }}>{components.technicalSkills}%</span>
            </div>
            <div style={{ height: 6, background: '#E2E8F0', borderRadius: 9999, overflow: 'hidden' }}>
              <div style={{ width: `${components.technicalSkills}%`, height: '100%', background: '#2563EB', borderRadius: 9999 }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
              <span style={{ color: '#0F172A' }}>Qualifications & Degree ({weights.qualifications}%)</span>
              <span style={{ color: '#16A34A' }}>{components.qualifications}%</span>
            </div>
            <div style={{ height: 6, background: '#E2E8F0', borderRadius: 9999, overflow: 'hidden' }}>
              <div style={{ width: `${components.qualifications}%`, height: '100%', background: '#16A34A', borderRadius: 9999 }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
              <span style={{ color: '#0F172A' }}>Experience & Seniority ({weights.experience}%)</span>
              <span style={{ color: '#0891B2' }}>{components.experience}%</span>
            </div>
            <div style={{ height: 6, background: '#E2E8F0', borderRadius: 9999, overflow: 'hidden' }}>
              <div style={{ width: `${components.experience}%`, height: '100%', background: '#0891B2', borderRadius: 9999 }} />
            </div>
          </div>
        </div>
      </div>

      {/* Explanatory Callout */}
      <div style={{ marginTop: 'auto', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '0.85rem 1rem', fontSize: '0.82rem', color: '#475569', display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
        <Info size={16} color="#3B82F6" style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <strong>Deterministic Assessment: </strong>
          Calculated by evaluating matching skills (1.0x), partial evidence (0.5x), and unverified requirements (0.0x), augmented by formal qualification and experience criteria.
        </div>
      </div>
    </div>
  );
}
