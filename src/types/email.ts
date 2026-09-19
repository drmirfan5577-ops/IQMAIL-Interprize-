export interface Email {
  id: string;
  from: string;
  fromEmail: string;
  fromAvatar?: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  preview: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  isImportant: boolean;
  folder: EmailFolder;
  labels: string[];
  priority: 'high' | 'medium' | 'low';
  hasAttachments: boolean;
  attachments?: Attachment[];
  threadId?: string;
  aiSummary?: string;
}

export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: string;
}

export type EmailFolder = 'inbox' | 'sent' | 'drafts' | 'starred' | 'spam' | 'trash' | 'archive';

export interface ComposeEmail {
  to: string;
  cc: string;
  bcc: string;
  subject: string;
  body: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  plan: 'free' | 'pro' | 'enterprise';
  storageUsed: number;
  storageTotal: number;
  unreadCount: number;
}

export interface AnalyticsData {
  emailsReceived: number;
  emailsSent: number;
  emailsRead: number;
  responseRate: number;
  avgResponseTime: string;
  topSenders: TopSender[];
  dailyActivity: DailyActivity[];
  categoryBreakdown: CategoryItem[];
  weeklyTrend: WeeklyTrend[];
}

export interface TopSender {
  name: string;
  email: string;
  count: number;
  avatar: string;
}

export interface DailyActivity {
  hour: string;
  received: number;
  sent: number;
}

export interface CategoryItem {
  name: string;
  value: number;
  color: string;
}

export interface WeeklyTrend {
  day: string;
  received: number;
  sent: number;
  read: number;
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  isActive: boolean;
  runCount: number;
  lastRun: string;
}

export interface SavedPassword {
  id: string;
  site: string;
  username: string;
  password: string;
  lastUsed: string;
  strength: 'weak' | 'medium' | 'strong';
  icon: string;
}

export interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  events: string[];
  isActive: boolean;
  lastTriggered: string;
  successCount: number;
  failureCount: number;
}
