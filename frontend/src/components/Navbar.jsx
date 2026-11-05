import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, Sparkles, History, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export default function Navbar() {
  const location = useLocation();
  const [healthStatus, setHealthStatus] = useState(null);

  useEffect(() => {
    let mounted = true;
    api.checkHealth()
      .then((res) => {
        if (mounted) setHealthStatus(res.data);
      })
      .catch(() => {
        if (mounted) setHealthStatus({ status: 'offline' });
      });
    return () => { mounted = false; };
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar">
      <div className="max-w-7xl navbar-inner">
        <Link to="/" className="brand-link">
          <div className="brand-icon">
            <Compass size={22} />
          </div>
          <div>
            <span>CareerPath AI</span>
            <span className="brand-badge">B.Tech Capstone</span>
          </div>
        </Link>

        <nav className="nav-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            Home
          </Link>
          <Link to="/analyze" className={`nav-link ${isActive('/analyze') ? 'active' : ''}`}>
            <Sparkles size={16} />
            Analyze Skills
          </Link>
          <Link to="/history" className={`nav-link ${isActive('/history') ? 'active' : ''}`}>
            <History size={16} />
            History
          </Link>
          <Link to="/docs" className={`nav-link ${isActive('/docs') ? 'active' : ''}`}>
            <FileText size={16} />
            Academic Docs
          </Link>

          {/* System Health Status Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#94A3B8', padding: '0 0.5rem' }} title={`Backend status: ${healthStatus?.status || 'checking'}`}>
            {healthStatus?.status === 'ok' ? (
              <>
                <CheckCircle2 size={14} color="#22C55E" />
                <span>API Ready</span>
              </>
            ) : healthStatus?.status === 'offline' ? (
              <>
                <AlertCircle size={14} color="#EF4444" />
                <span>API Offline</span>
              </>
            ) : (
              <span>Checking...</span>
            )}
          </div>

          <Link to="/analyze" className="nav-btn-primary">
            Start Analysis
          </Link>
        </nav>
      </div>
    </header>
  );
}
