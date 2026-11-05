import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ShieldCheck, Cpu, Code2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="max-w-7xl">
        <div className="footer-inner">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#FFFFFF', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.85rem' }}>
              <div style={{ width: 28, height: 28, background: '#2563EB', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Compass size={18} color="#FFFFFF" />
              </div>
              CareerPath AI
            </div>
            <p style={{ lineHeight: 1.6, maxWidth: 420, fontSize: '0.88rem', color: '#94A3B8' }}>
              Final-Year B.Tech Computer Science Capstone Project. An intelligent full-stack system providing deterministic skill-gap analytics, Google Gemini LLM reasoning, and personalized roadmap engineering.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem' }}>Navigation</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem' }}>
              <li><Link to="/" style={{ color: '#94A3B8' }}>Home</Link></li>
              <li><Link to="/analyze" style={{ color: '#94A3B8' }}>New Skill Analysis</Link></li>
              <li><Link to="/history" style={{ color: '#94A3B8' }}>Analysis History</Link></li>
              <li><Link to="/docs" style={{ color: '#94A3B8' }}>Academic Viva & Docs</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem' }}>Architecture</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem', color: '#94A3B8' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Cpu size={14} color="#06B6D4" /> Google Gemini API
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Code2 size={14} color="#3B82F6" /> React + Express REST
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldCheck size={14} color="#10B981" /> SQLite Local Persistence
              </li>
            </ul>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', color: '#64748B' }}>
          <div>
            © {new Date().getFullYear()} B.Tech Computer Science Capstone Project. All rights reserved.
          </div>
          <div>
            Compatibility scores are algorithmic estimates and do not represent guarantees of employment.
          </div>
        </div>
      </div>
    </footer>
  );
}
