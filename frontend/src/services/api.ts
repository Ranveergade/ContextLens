import type { DocumentItem, Analysis, ActionItem, SourceReference } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorDetail = 'An unexpected error occurred';
    try {
      const errorJson = await response.json();
      errorDetail = errorJson.detail || JSON.stringify(errorJson);
    } catch {
      errorDetail = await response.text();
    }
    throw new Error(errorDetail);
  }
  return response.json();
}

export const api = {
  // Document endpoints
  async uploadDocument(file: File): Promise<DocumentItem> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE}/documents`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse<DocumentItem>(response);
  },

  async getDocuments(): Promise<DocumentItem[]> {
    const response = await fetch(`${API_BASE}/documents`);
    return handleResponse<DocumentItem[]>(response);
  },

  async getDocument(id: string): Promise<DocumentItem> {
    const response = await fetch(`${API_BASE}/documents/${id}`);
    return handleResponse<DocumentItem>(response);
  },

  async getDocumentText(id: string): Promise<{
    document_id: string;
    filename: string;
    file_type: string;
    full_text: string;
    pages: Array<{ page: number; text: string }>;
  }> {
    const response = await fetch(`${API_BASE}/documents/${id}/text`);
    return handleResponse(response);
  },

  async analyzeDocument(id: string): Promise<Analysis> {
    const response = await fetch(`${API_BASE}/documents/${id}/analyze`, {
      method: 'POST',
    });
    return handleResponse<Analysis>(response);
  },

  async getAnalysis(documentId: string): Promise<Analysis> {
    const response = await fetch(`${API_BASE}/documents/${documentId}/analysis`);
    return handleResponse<Analysis>(response);
  },

  // Action endpoints
  async updateActionStatus(actionId: string, completed: boolean): Promise<ActionItem> {
    const response = await fetch(`${API_BASE}/actions/${actionId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed }),
    });
    return handleResponse<ActionItem>(response);
  },

  async getActionEvidence(actionId: string): Promise<SourceReference> {
    const response = await fetch(`${API_BASE}/actions/${actionId}/evidence`);
    return handleResponse<SourceReference>(response);
  },

  getDocumentFileUrl(documentId: string): string {
    return `${API_BASE}/documents/${documentId}/file`;
  }
};
