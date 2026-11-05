import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, Trash2, Eye, AlertCircle } from 'lucide-react';

export default function FileUploader({
  selectedFile,
  onFileSelect,
  onFileRemove,
  onPreviewClick,
  previewLoading = false,
  error = null
}) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/msword'
  ];

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const validateAndPass = (file) => {
    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();
    const isAllowedExt = ['pdf', 'docx', 'txt'].includes(ext);

    if (!isAllowedExt && !allowedTypes.includes(file.type)) {
      alert('Invalid file format. Please upload a PDF (.pdf), Word (.docx), or plain text (.txt) file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds the 5MB limit. Please upload a smaller document.');
      return;
    }

    onFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndPass(e.dataTransfer.files[0]);
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div>
      {!selectedFile ? (
        <div
          className={`dropzone-area ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current && inputRef.current.click()}
        >
          <input
            type="file"
            ref={inputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                validateAndPass(e.target.files[0]);
              }
            }}
            accept=".pdf,.docx,.txt"
            style={{ display: 'none' }}
          />

          <div className="dropzone-icon">
            <UploadCloud size={28} />
          </div>
          <div className="dropzone-text">
            Drag & drop your resume here, or <span style={{ color: '#2563EB', textDecoration: 'underline' }}>browse</span>
          </div>
          <div className="dropzone-hint">
            Supports PDF (.pdf), Microsoft Word (.docx), and plain text (.txt) up to 5MB
          </div>
        </div>
      ) : (
        <div className="file-badge-card">
          <div className="file-info">
            <div style={{ width: 38, height: 38, background: '#DBEAFE', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB' }}>
              <FileText size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#0F172A' }}>
                {selectedFile.name}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                {formatSize(selectedFile.size)} • Ready for parsing
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn-file-action btn-file-preview"
              onClick={() => onPreviewClick && onPreviewClick(selectedFile)}
              disabled={previewLoading}
            >
              <Eye size={14} style={{ display: 'inline', marginRight: 4 }} />
              {previewLoading ? 'Reading...' : 'Preview Extracted Text'}
            </button>

            <button
              type="button"
              className="btn-file-action btn-file-remove"
              onClick={onFileRemove}
              title="Remove file"
            >
              <Trash2 size={14} style={{ display: 'inline', marginRight: 4 }} />
              Remove
            </button>
          </div>
        </div>
      )}

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#DC2626', fontSize: '0.82rem', marginTop: '0.5rem' }}>
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
