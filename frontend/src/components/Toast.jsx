import React from 'react';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

export default function Toast({ toasts = [], onDismiss }) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}
        >
          {toast.type === 'error' ? (
            <AlertTriangle size={18} color="#DC2626" style={{ flexShrink: 0 }} />
          ) : (
            <CheckCircle2 size={18} color="#16A34A" style={{ flexShrink: 0 }} />
          )}
          <span style={{ flex: 1, fontSize: '0.88rem' }}>{toast.message}</span>
          {onDismiss && (
            <button
              onClick={() => onDismiss(toast.id)}
              style={{ color: '#94A3B8', padding: 2, cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
