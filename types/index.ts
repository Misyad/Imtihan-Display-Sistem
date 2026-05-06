export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
}

export interface Statistics {
  totalUsers: number;
  activeSessions: number;
  uptime: string;
  lastUpdated: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  status: 'success' | 'warning' | 'error';
}
