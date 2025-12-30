export type TicketStatus = 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high';
export type AiJobStatus = 'idle' | 'queued' | 'processing' | 'done' | 'failed';

export interface Ticket {
  id: number;
  title: string;
  description: string;
  ai_summary: string | null;
  ai_suggested_reply: string | null;
  priority: TicketPriority | null;
  status: TicketStatus;
  assigned_to: number | null;
  closed_at: string | null;
  ai_summary_status: AiJobStatus;
  ai_reply_status: AiJobStatus;
  ai_priority_status: AiJobStatus;
  ai_last_error: string | null;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  path: string;
  per_page: number;
  to: number | null;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

export interface SingleResponse<T> {
  data: T;
}

export interface AiJobResponse {
  data: Ticket;
  meta: {
    status: 'queued';
    job: 'summary' | 'reply' | 'priority';
  };
}

export interface TicketFilters {
  page?: number;
  per_page?: number;
  status?: TicketStatus | '';
  priority?: TicketPriority | '';
  q?: string;
  sort?: string;
}

export interface CreateTicketData {
  title: string;
  description: string;
  priority?: TicketPriority;
}

export interface UpdateTicketData {
  title?: string;
  description?: string;
  priority?: TicketPriority;
  status?: TicketStatus;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ValidationErrors {
  message: string;
  errors: Record<string, string[]>;
}
