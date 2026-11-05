const API_BASE = '/api';

/**
 * Handles JSON and multipart responses consistently.
 */
async function handleResponse(res) {
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const data = await res.json();
    if (!res.ok) {
      const errorMsg = data?.error?.message || `Request failed with status ${res.status}`;
      const err = new Error(errorMsg);
      err.code = data?.error?.code;
      err.details = data?.error?.details;
      throw err;
    }
    return data;
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Server error with HTTP ${res.status}`);
  }

  return res;
}

export const api = {
  checkHealth: async () => {
    const res = await fetch(`${API_BASE}/health`);
    return handleResponse(res);
  },

  previewResume: async (file) => {
    const formData = new FormData();
    formData.append('resume', file);

    const res = await fetch(`${API_BASE}/analyses/preview`, {
      method: 'POST',
      body: formData
    });
    return handleResponse(res);
  },

  createAnalysis: async (formData) => {
    const res = await fetch(`${API_BASE}/analyses`, {
      method: 'POST',
      body: formData
    });
    return handleResponse(res);
  },

  getAllAnalyses: async () => {
    const res = await fetch(`${API_BASE}/analyses`);
    return handleResponse(res);
  },

  getAnalysisById: async (id) => {
    const res = await fetch(`${API_BASE}/analyses/${id}`);
    return handleResponse(res);
  },

  deleteAnalysis: async (id) => {
    const res = await fetch(`${API_BASE}/analyses/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(res);
  },

  updateMilestoneStatus: async (analysisId, milestoneId, status) => {
    const res = await fetch(`${API_BASE}/analyses/${analysisId}/roadmap/${milestoneId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });
    return handleResponse(res);
  },

  getPdfReportUrl: (id) => `${API_BASE}/analyses/${id}/report`,
  getJsonExportUrl: (id) => `${API_BASE}/analyses/${id}/export-json`
};
