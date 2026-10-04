export interface SourceReference {
  page?: number;
  text?: string;
  context?: string;
}

export interface Requirement {
  id: string;
  analysis_id: string;
  title: string;
  description: string;
  source_reference?: SourceReference;
}

export interface ActionItem {
  id: string;
  analysis_id: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  deadline?: string;
  completed: boolean;
  source_reference?: SourceReference;
}

export interface Risk {
  id: string;
  analysis_id: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  source_reference?: SourceReference;
}

export interface Question {
  id: string;
  analysis_id: string;
  question: string;
  source_reference?: SourceReference;
}

export interface Evidence {
  id: string;
  document_id: string;
  text: string;
  page_number?: number;
  location_info?: Record<string, any>;
}

export interface Analysis {
  id: string;
  document_id: string;
  summary: string;
  created_at: string;
  requirements: Requirement[];
  action_items: ActionItem[];
  risks: Risk[];
  questions: Question[];
}

export interface DocumentItem {
  id: string;
  filename: string;
  file_type: string;
  file_size_bytes?: number;
  created_at: string;
  processing_status: 'pending' | 'processing' | 'completed' | 'failed';
  error_message?: string;
  analysis?: Analysis;
}
