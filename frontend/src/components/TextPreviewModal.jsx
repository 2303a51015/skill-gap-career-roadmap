import React, { useState } from 'react';
import { X, Copy, Check, FileText } from 'lucide-react';

export default function TextPreviewModal({ isOpen, onClose, data }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !data) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(data.textPreview || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FileText size={20} color="#2563EB" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>
              Extracted Resume Text Preview
            </h3>
          </div>
          <button onClick={onClose} style={{ color: '#64748B', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ background: '#F8FAFC', padding: '0.75rem 1.75rem', borderBottom: '1px solid #E2E8F0', display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: '#64748B' }}>
          <span><strong>Words:</strong> {data.totalWords || 'N/A'}</span>
          <span><strong>Characters:</strong> {data.totalCharacters || 'N/A'}</span>
          {data.pageCount && <span><strong>Pages:</strong> {data.pageCount}</span>}
          {data.isTruncated && <span style={{ color: '#D97706' }}>Preview showing first 1500 chars</span>}
        </div>

        <div className="modal-body" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              fontSize: '0.85rem',
              color: '#334155',
              lineHeight: 1.6,
              background: '#F1F5F9',
              padding: '1rem',
              borderRadius: 8
            }}
          >
            {data.textPreview || 'No readable text extracted.'}
          </pre>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCopy}
            style={{ fontSize: '0.85rem' }}
          >
            {copied ? <Check size={14} color="#16A34A" /> : <Copy size={14} />}
            {copied ? 'Copied to Clipboard' : 'Copy Text'}
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onClose}
            style={{ fontSize: '0.85rem' }}
          >
            Looks Good
          </button>
        </div>
      </div>
    </div>
  );
}
