import React from 'react';
import {
  Calendar,
  Clock,
  Target,
  ExternalLink,
  FolderGit2,
  CheckCircle,
  Circle,
  Clock3,
  BookOpen
} from 'lucide-react';

export default function MilestoneCard({ milestone, onStatusChange }) {
  const isCompleted = milestone.status === 'completed';
  const isInProgress = milestone.status === 'in_progress';

  let statusClass = 'status-not_started';
  if (isCompleted) statusClass = 'status-completed';
  else if (isInProgress) statusClass = 'status-in_progress';

  let priorityClass = 'badge-slate';
  if (milestone.priority === 'High') priorityClass = 'badge-red';
  else if (milestone.priority === 'Medium') priorityClass = 'badge-amber';
  else if (milestone.priority === 'Low') priorityClass = 'badge-blue';

  return (
    <div className={`milestone-card ${statusClass}`}>
      <div className="milestone-top">
        <div className="milestone-title-group">
          <span className="milestone-week">
            <Calendar size={13} style={{ display: 'inline', marginRight: 4 }} />
            {milestone.weekRange}
          </span>
          <h4 className="milestone-skill-name">{milestone.skill}</h4>
          <span className={`badge ${priorityClass}`}>
            {milestone.priority} Priority
          </span>
          <span className="badge badge-slate" style={{ fontSize: '0.72rem' }}>
            <Clock size={12} style={{ display: 'inline', marginRight: 3 }} />
            ~{milestone.estimatedHours} hrs
          </span>
        </div>

        {/* Status Dropdown Picker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748B' }}>
            Status:
          </label>
          <select
            value={milestone.status}
            onChange={(e) => onStatusChange && onStatusChange(milestone.id, e.target.value)}
            style={{
              fontSize: '0.82rem',
              fontWeight: 600,
              padding: '0.35rem 0.75rem',
              borderRadius: 6,
              border: '1px solid #CBD5E1',
              background: isCompleted ? '#F0FDF4' : isInProgress ? '#EFF6FF' : '#FFFFFF',
              color: isCompleted ? '#166534' : isInProgress ? '#1E40AF' : '#334155',
              cursor: 'pointer'
            }}
          >
            <option value="not_started">⚪ Not Started</option>
            <option value="in_progress">🔵 In Progress</option>
            <option value="completed">🟢 Completed</option>
          </select>
        </div>
      </div>

      <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5, marginBottom: '0.75rem' }}>
        <strong>Why this matters: </strong>
        {milestone.whyItMatters}
      </p>

      {/* Grid of Objectives, Resources, Project */}
      <div className="milestone-detail-grid">
        {/* Objectives */}
        <div className="milestone-box-inner">
          <div className="milestone-box-title">
            <Target size={14} color="#2563EB" />
            Learning Objectives
          </div>
          <ul style={{ paddingLeft: '1.1rem', fontSize: '0.82rem', color: '#334155', lineHeight: 1.5 }}>
            {(milestone.learningObjectives || []).map((obj, i) => (
              <li key={i} style={{ marginBottom: '0.2rem' }}>{obj}</li>
            ))}
          </ul>
        </div>

        {/* Recommended Resources */}
        <div className="milestone-box-inner">
          <div className="milestone-box-title">
            <BookOpen size={14} color="#0891B2" />
            Verified Learning Resources
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            {(milestone.resources || []).length === 0 ? (
              <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Official documentation recommended</span>
            ) : (
              (milestone.resources || []).map((res, i) => (
                <a
                  key={i}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.82rem',
                    color: '#2563EB',
                    textDecoration: 'none',
                    background: '#FFFFFF',
                    padding: '0.35rem 0.6rem',
                    borderRadius: 4,
                    border: '1px solid #E2E8F0'
                  }}
                >
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '85%' }}>
                    {res.title}
                  </span>
                  <ExternalLink size={12} style={{ flexShrink: 0 }} />
                </a>
              ))
            )}
          </div>
        </div>

        {/* Practical Project Deliverable */}
        <div className="milestone-box-inner">
          <div className="milestone-box-title">
            <FolderGit2 size={14} color="#16A34A" />
            Hands-on Capstone Deliverable
          </div>
          <div style={{ fontSize: '0.82rem', color: '#1E293B', fontWeight: 600, marginBottom: '0.25rem' }}>
            {milestone.practicalProject?.title || 'Mini-Project Exercise'}
          </div>
          <p style={{ fontSize: '0.78rem', color: '#64748B', lineHeight: 1.4, marginBottom: '0.4rem' }}>
            {milestone.practicalProject?.description}
          </p>
          {(milestone.practicalProject?.deliverables || []).length > 0 && (
            <div style={{ fontSize: '0.75rem', color: '#475569' }}>
              <strong>Proof: </strong>
              {milestone.practicalProject.deliverables.join(' • ')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
