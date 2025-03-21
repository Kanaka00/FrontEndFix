export interface Mail {
  id: string;
  subject: string;
  from: string;
  to: string;
  content: string;
  attachments?: string[];
  status: 'sent' | 'delivered' | 'read';
  category: 'inbox' | 'sent' | 'spam' | 'draft';
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface MailStats {
  total: number;
  sent: number;
  received: number;
  responseRate: number;
}

export interface AutoResponse {
  id: string;
  name: string;
  subject: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
}