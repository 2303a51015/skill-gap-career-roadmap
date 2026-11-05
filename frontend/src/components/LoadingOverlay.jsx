import React, { useState, useEffect } from 'react';
import { Cpu, Loader2, CheckCircle2 } from 'lucide-react';

const steps = [
  'Extracting machine-readable text from uploaded documents...',
  'Parsing explicit requirements from target job description...',
  'Invoking Google Gemini AI for semantic skill classification...',
  'Computing deterministic weighted match compatibility score...',
  'Synthesizing personalized time-based learning roadmap...',
  'Persisting analysis records to local SQLite database...'
];

export default function LoadingOverlay({ isVisible }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setCurrentStepIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1800);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="modal-backdrop" style={{ zIndex: 999 }}>
      <div
        className="modal-card"
        style={{
          maxWidth: 480,
          padding: '2.5rem 2rem',
          textAlign: 'center',
          alignItems: 'center'
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #2563EB, #06B6D4)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
            boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)'
          }}
        >
          <Loader2 size={32} className="spin" style={{ animation: 'spin 1.2s linear infinite' }} />
        </div>

        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
          Performing Skill Gap Intelligence
        </h3>
        <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '1.75rem' }}>
          Analyzing actual resume evidence against target job criteria
        </p>

        {/* Dynamic Step Sequence */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left', background: '#F8FAFC', padding: '1.25rem', borderRadius: 10, border: '1px solid #E2E8F0' }}>
          {steps.map((text, idx) => {
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  fontSize: '0.82rem',
                  fontWeight: isCurrent ? 700 : 500,
                  color: isDone ? '#16A34A' : isCurrent ? '#2563EB' : '#94A3B8'
                }}
              >
                {isDone ? (
                  <CheckCircle2 size={16} color="#16A34A" />
                ) : isCurrent ? (
                  <Loader2 size={16} color="#2563EB" style={{ animation: 'spin 1s linear infinite' }} />
                ) : (
                  <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid #CBD5E1', marginLeft: 1 }} />
                )}
                <span>{text}</span>
              </div>
            );
          })}
        </div>

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}
