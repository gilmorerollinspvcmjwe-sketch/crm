/**
 * 系统设置 Mock 数据 - 扩展版
 * 包含：用户个人信息、通知偏好、显示偏好、操作日志、登录日志
 */

import { SystemSettings } from '../types/settings';

/** 系统设置默认数据 */
export const systemSettings: SystemSettings = {
  basic: {
    companyName: '某某科技有限公司',
    logoUrl: '/logo.png',
    workDays: [1, 2, 3, 4, 5],
    dataRetentionDays: 730,
  },
  salesStages: [
    { id: 'stage1', name: '初步接洽', order: 1, successRate: 100, color: '#1890ff' },
    { id: 'stage2', name: '需求分析', order: 2, successRate: 62.8, color: '#52c41a' },
    { id: 'stage3', name: '方案报价', order: 3, successRate: 68.4, color: '#faad14' },
    { id: 'stage4', name: '商务谈判', order: 4, successRate: 62.7, color: '#f5222d' },
    { id: 'stage5', name: '合同签订', order: 5, successRate: 66.7, color: '#722ed1' },
  ],
  followUpTypes: [
    { id: 'follow1', name: '电话', icon: 'phone', color: '#1890ff', enabled: true },
    { id: 'follow2', name: '拜访', icon: 'user', color: '#52c41a', enabled: true },
    { id: 'follow3', name: '邮件', icon: 'mail', color: '#faad14', enabled: true },
    { id: 'follow4', name: '微信', icon: 'wechat', color: '#07c160', enabled: true },
    { id: 'follow5', name: '会议', icon: 'team', color: '#722ed1', enabled: true },
  ],
};

/** 用户个人信息 */
export interface UserProfile {
  id: string;
  avatar?: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  timezone: string;
  language: 'en' | 'zh';
  createdAt: string;
  lastLoginAt: string;
}

export const mockUserProfile: UserProfile = {
  id: 'user-001',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  name: 'Admin User',
  email: 'admin@company.com',
  phone: '+86 138-0000-0000',
  position: 'Product Manager',
  department: 'Sales Department',
  timezone: 'Asia/Shanghai',
  language: 'zh',
  createdAt: '2025-01-15T08:00:00Z',
  lastLoginAt: '2026-03-24T07:30:00Z',
};

/** 通知偏好 */
export interface NotificationPreference {
  id: string;
  module: string;
  moduleName: string;
  channel: 'email' | 'in-app' | 'both' | 'off';
  enabled: boolean;
}

export const mockNotificationPreferences: NotificationPreference[] = [
  { id: 'notif-1', module: 'lead', moduleName: 'Lead Notifications', channel: 'both', enabled: true },
  { id: 'notif-2', module: 'deal', moduleName: 'Deal Notifications', channel: 'both', enabled: true },
  { id: 'notif-3', module: 'task', moduleName: 'Task Notifications', channel: 'in-app', enabled: true },
  { id: 'notif-4', module: 'email', moduleName: 'Email Notifications', channel: 'email', enabled: true },
  { id: 'notif-5', module: 'system', moduleName: 'System Notifications', channel: 'both', enabled: true },
];

/** 显示偏好 */
export interface DisplayPreferences {
  language: 'en' | 'zh';
  timezone: string;
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  numberFormat: '1,000.00' | '1.000,00';
  currency: 'USD' | 'CNY' | 'EUR' | 'GBP';
}

export const mockDisplayPreferences: DisplayPreferences = {
  language: 'zh',
  timezone: 'Asia/Shanghai',
  dateFormat: 'YYYY-MM-DD',
  numberFormat: '1,000.00',
  currency: 'CNY',
};

/** 时区选项 */
export const TIMEZONE_OPTIONS = [
  { value: 'Asia/Shanghai', label: 'China Standard Time (UTC+8)' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time (UTC+9)' },
  { value: 'Asia/Singapore', label: 'Singapore Time (UTC+8)' },
  { value: 'America/New_York', label: 'Eastern Time (UTC-5)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (UTC-8)' },
  { value: 'Europe/London', label: 'Greenwich Mean Time (UTC+0)' },
  { value: 'Europe/Paris', label: 'Central European Time (UTC+1)' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time (UTC+10)' },
];

/** 日期格式选项 */
export const DATE_FORMAT_OPTIONS = [
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (03/24/2026)' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (24/03/2026)' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (2026-03-24)' },
];

/** 数字格式选项 */
export const NUMBER_FORMAT_OPTIONS = [
  { value: '1,000.00', label: '1,000.00 (US/UK)' },
  { value: '1.000,00', label: '1.000,00 (EU)' },
];

/** 货币选项 */
export const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD - US Dollar ($)', symbol: '$' },
  { value: 'CNY', label: 'CNY - Chinese Yuan (¥)', symbol: '¥' },
  { value: 'EUR', label: 'EUR - Euro (€)', symbol: '€' },
  { value: 'GBP', label: 'GBP - British Pound (£)', symbol: '£' },
];

/** 操作日志 */
export interface AuditLogEntry {
  id: string;
  timestamp: string;
  operator: string;
  operatorId: string;
  action: 'create' | 'update' | 'delete' | 'login' | 'export' | 'import' | 'assign' | 'status_change';
  actionLabel: string;
  module: string;
  moduleLabel: string;
  target: string;
  targetId: string;
  ipAddress: string;
  changes?: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
}

export const mockAuditLogs: AuditLogEntry[] = [
  {
    id: 'log-001',
    timestamp: '2026-03-24T14:30:00Z',
    operator: 'Admin User',
    operatorId: 'user-001',
    action: 'update',
    actionLabel: 'Update',
    module: 'customer',
    moduleLabel: 'Customer',
    target: 'Shenzhen Tencent Technology',
    targetId: 'cust-001',
    ipAddress: '192.168.1.100',
    changes: [
      { field: 'Status', oldValue: 'Negotiating', newValue: 'Closed' },
      { field: 'Level', oldValue: 'B', newValue: 'A' },
    ],
  },
  {
    id: 'log-002',
    timestamp: '2026-03-24T14:15:00Z',
    operator: 'Zhang San',
    operatorId: 'user-002',
    action: 'create',
    actionLabel: 'Create',
    module: 'opportunity',
    moduleLabel: 'Opportunity',
    target: 'Enterprise ERP System',
    targetId: 'opp-015',
    ipAddress: '192.168.1.105',
  },
  {
    id: 'log-003',
    timestamp: '2026-03-24T13:45:00Z',
    operator: 'Admin User',
    operatorId: 'user-001',
    action: 'delete',
    actionLabel: 'Delete',
    module: 'lead',
    moduleLabel: 'Lead',
    target: 'Invalid Lead - Test Company',
    targetId: 'lead-099',
    ipAddress: '192.168.1.100',
  },
  {
    id: 'log-004',
    timestamp: '2026-03-24T13:30:00Z',
    operator: 'Li Si',
    operatorId: 'user-003',
    action: 'assign',
    actionLabel: 'Assign',
    module: 'customer',
    moduleLabel: 'Customer',
    target: 'Beijing ByteDance',
    targetId: 'cust-002',
    ipAddress: '192.168.1.110',
    changes: [
      { field: 'Owner', oldValue: 'Wang Wu', newValue: 'Li Si' },
    ],
  },
  {
    id: 'log-005',
    timestamp: '2026-03-24T12:00:00Z',
    operator: 'Admin User',
    operatorId: 'user-001',
    action: 'export',
    actionLabel: 'Export',
    module: 'customer',
    moduleLabel: 'Customer',
    target: 'Customer List Export',
    targetId: 'export-001',
    ipAddress: '192.168.1.100',
  },
  {
    id: 'log-006',
    timestamp: '2026-03-24T11:30:00Z',
    operator: 'Zhang San',
    operatorId: 'user-002',
    action: 'status_change',
    actionLabel: 'Status Change',
    module: 'opportunity',
    moduleLabel: 'Opportunity',
    target: 'Smart Office System',
    targetId: 'opp-012',
    ipAddress: '192.168.1.105',
    changes: [
      { field: 'Stage', oldValue: 'Proposal', newValue: 'Negotiation' },
    ],
  },
  {
    id: 'log-007',
    timestamp: '2026-03-24T10:45:00Z',
    operator: 'Wang Wu',
    operatorId: 'user-004',
    action: 'update',
    actionLabel: 'Update',
    module: 'contract',
    moduleLabel: 'Contract',
    target: 'Contract CONT-2026-008',
    targetId: 'cont-008',
    ipAddress: '192.168.1.115',
    changes: [
      { field: 'Amount', oldValue: '¥500,000', newValue: '¥550,000' },
      { field: 'EndDate', oldValue: '2026-06-30', newValue: '2026-07-31' },
    ],
  },
  {
    id: 'log-008',
    timestamp: '2026-03-24T10:00:00Z',
    operator: 'Admin User',
    operatorId: 'user-001',
    action: 'import',
    actionLabel: 'Import',
    module: 'lead',
    moduleLabel: 'Lead',
    target: 'Leads Import - 50 records',
    targetId: 'import-001',
    ipAddress: '192.168.1.100',
  },
  {
    id: 'log-009',
    timestamp: '2026-03-24T09:30:00Z',
    operator: 'Li Si',
    operatorId: 'user-003',
    action: 'create',
    actionLabel: 'Create',
    module: 'customer',
    moduleLabel: 'Customer',
    target: 'Shanghai Alibaba Group',
    targetId: 'cust-025',
    ipAddress: '192.168.1.110',
  },
  {
    id: 'log-010',
    timestamp: '2026-03-24T09:00:00Z',
    operator: 'Admin User',
    operatorId: 'user-001',
    action: 'login',
    actionLabel: 'Login',
    module: 'system',
    moduleLabel: 'System',
    target: 'User Login',
    targetId: 'session-001',
    ipAddress: '192.168.1.100',
  },
  {
    id: 'log-011',
    timestamp: '2026-03-23T18:30:00Z',
    operator: 'Zhang San',
    operatorId: 'user-002',
    action: 'update',
    actionLabel: 'Update',
    module: 'opportunity',
    moduleLabel: 'Opportunity',
    target: 'Cloud Services Deal',
    targetId: 'opp-010',
    ipAddress: '192.168.1.105',
    changes: [
      { field: 'Amount', oldValue: '¥800,000', newValue: '¥950,000' },
      { field: 'Probability', oldValue: '50%', newValue: '75%' },
    ],
  },
  {
    id: 'log-012',
    timestamp: '2026-03-23T17:00:00Z',
    operator: 'Wang Wu',
    operatorId: 'user-004',
    action: 'delete',
    actionLabel: 'Delete',
    module: 'contact',
    moduleLabel: 'Contact',
    target: 'Old Contact - Test Person',
    targetId: 'contact-099',
    ipAddress: '192.168.1.115',
  },
  {
    id: 'log-013',
    timestamp: '2026-03-23T16:15:00Z',
    operator: 'Admin User',
    operatorId: 'user-001',
    action: 'assign',
    actionLabel: 'Assign',
    module: 'lead',
    moduleLabel: 'Lead',
    target: 'Web Inquiry - New Company',
    targetId: 'lead-045',
    ipAddress: '192.168.1.100',
    changes: [
      { field: 'Owner', oldValue: 'Unassigned', newValue: 'Zhang San' },
    ],
  },
  {
    id: 'log-014',
    timestamp: '2026-03-23T15:30:00Z',
    operator: 'Li Si',
    operatorId: 'user-003',
    action: 'create',
    actionLabel: 'Create',
    module: 'contract',
    moduleLabel: 'Contract',
    target: 'Contract CONT-2026-009',
    targetId: 'cont-009',
    ipAddress: '192.168.1.110',
  },
  {
    id: 'log-015',
    timestamp: '2026-03-23T14:00:00Z',
    operator: 'Zhang San',
    operatorId: 'user-002',
    action: 'status_change',
    actionLabel: 'Status Change',
    module: 'opportunity',
    moduleLabel: 'Opportunity',
    target: 'Security Solution Deal',
    targetId: 'opp-011',
    ipAddress: '192.168.1.105',
    changes: [
      { field: 'Stage', oldValue: 'Negotiation', newValue: 'Closed Won' },
    ],
  },
  {
    id: 'log-016',
    timestamp: '2026-03-23T11:00:00Z',
    operator: 'Admin User',
    operatorId: 'user-001',
    action: 'update',
    actionLabel: 'Update',
    module: 'system',
    moduleLabel: 'System',
    target: 'System Settings',
    targetId: 'settings-001',
    ipAddress: '192.168.1.100',
    changes: [
      { field: 'DataRetention', oldValue: '365 days', newValue: '730 days' },
    ],
  },
  {
    id: 'log-017',
    timestamp: '2026-03-22T16:30:00Z',
    operator: 'Wang Wu',
    operatorId: 'user-004',
    action: 'export',
    actionLabel: 'Export',
    module: 'report',
    moduleLabel: 'Report',
    target: 'Sales Performance Report',
    targetId: 'report-001',
    ipAddress: '192.168.1.115',
  },
  {
    id: 'log-018',
    timestamp: '2026-03-22T14:00:00Z',
    operator: 'Li Si',
    operatorId: 'user-003',
    action: 'create',
    actionLabel: 'Create',
    module: 'payment',
    moduleLabel: 'Payment',
    target: 'Payment PAY-2026-012',
    targetId: 'pay-012',
    ipAddress: '192.168.1.110',
  },
  {
    id: 'log-019',
    timestamp: '2026-03-22T10:00:00Z',
    operator: 'Admin User',
    operatorId: 'user-001',
    action: 'import',
    actionLabel: 'Import',
    module: 'product',
    moduleLabel: 'Product',
    target: 'Products Import - 20 items',
    targetId: 'import-002',
    ipAddress: '192.168.1.100',
  },
  {
    id: 'log-020',
    timestamp: '2026-03-21T15:00:00Z',
    operator: 'Zhang San',
    operatorId: 'user-002',
    action: 'delete',
    actionLabel: 'Delete',
    module: 'quote',
    moduleLabel: 'Quote',
    target: 'Expired Quote QT-2026-005',
    targetId: 'quote-005',
    ipAddress: '192.168.1.105',
  },
  {
    id: 'log-021',
    timestamp: '2026-03-21T13:30:00Z',
    operator: 'Wang Wu',
    operatorId: 'user-004',
    action: 'update',
    actionLabel: 'Update',
    module: 'customer',
    moduleLabel: 'Customer',
    target: 'Hangzhou NetEase',
    targetId: 'cust-015',
    ipAddress: '192.168.1.115',
    changes: [
      { field: 'Industry', oldValue: 'Technology', newValue: 'Internet Services' },
    ],
  },
  {
    id: 'log-022',
    timestamp: '2026-03-21T11:00:00Z',
    operator: 'Admin User',
    operatorId: 'user-001',
    action: 'create',
    actionLabel: 'Create',
    module: 'user',
    moduleLabel: 'User',
    target: 'New User - test@company.com',
    targetId: 'user-010',
    ipAddress: '192.168.1.100',
  },
  {
    id: 'log-023',
    timestamp: '2026-03-20T16:00:00Z',
    operator: 'Li Si',
    operatorId: 'user-003',
    action: 'assign',
    actionLabel: 'Assign',
    module: 'opportunity',
    moduleLabel: 'Opportunity',
    target: 'Big Data Platform Deal',
    targetId: 'opp-008',
    ipAddress: '192.168.1.110',
    changes: [
      { field: 'Owner', oldValue: 'Zhang San', newValue: 'Li Si' },
    ],
  },
  {
    id: 'log-024',
    timestamp: '2026-03-20T14:30:00Z',
    operator: 'Zhang San',
    operatorId: 'user-002',
    action: 'status_change',
    actionLabel: 'Status Change',
    module: 'lead',
    moduleLabel: 'Lead',
    target: 'Marketing Inquiry',
    targetId: 'lead-040',
    ipAddress: '192.168.1.105',
    changes: [
      { field: 'Status', oldValue: 'New', newValue: 'Qualified' },
    ],
  },
  {
    id: 'log-025',
    timestamp: '2026-03-20T10:00:00Z',
    operator: 'Admin User',
    operatorId: 'user-001',
    action: 'export',
    actionLabel: 'Export',
    module: 'opportunity',
    moduleLabel: 'Opportunity',
    target: 'Opportunity Pipeline Export',
    targetId: 'export-002',
    ipAddress: '192.168.1.100',
  },
];

/** 登录日志 */
export interface LoginLogEntry {
  id: string;
  timestamp: string;
  user: string;
  userId: string;
  ipAddress: string;
  device: string;
  browser: string;
  status: 'success' | 'failed';
  failureReason?: string;
}

export const mockLoginLogs: LoginLogEntry[] = [
  {
    id: 'login-001',
    timestamp: '2026-03-24T07:30:00Z',
    user: 'Admin User',
    userId: 'user-001',
    ipAddress: '192.168.1.100',
    device: 'Windows Desktop',
    browser: 'Chrome 122.0',
    status: 'success',
  },
  {
    id: 'login-002',
    timestamp: '2026-03-24T08:00:00Z',
    user: 'Zhang San',
    userId: 'user-002',
    ipAddress: '192.168.1.105',
    device: 'MacBook Pro',
    browser: 'Safari 17.3',
    status: 'success',
  },
  {
    id: 'login-003',
    timestamp: '2026-03-24T08:15:00Z',
    user: 'Li Si',
    userId: 'user-003',
    ipAddress: '192.168.1.110',
    device: 'Windows Laptop',
    browser: 'Edge 122.0',
    status: 'success',
  },
  {
    id: 'login-004',
    timestamp: '2026-03-24T09:00:00Z',
    user: 'Unknown',
    userId: 'unknown',
    ipAddress: '103.45.67.89',
    device: 'Unknown Device',
    browser: 'Unknown Browser',
    status: 'failed',
    failureReason: 'Invalid credentials',
  },
  {
    id: 'login-005',
    timestamp: '2026-03-23T17:45:00Z',
    user: 'Admin User',
    userId: 'user-001',
    ipAddress: '192.168.1.100',
    device: 'Windows Desktop',
    browser: 'Chrome 122.0',
    status: 'success',
  },
  {
    id: 'login-006',
    timestamp: '2026-03-23T18:00:00Z',
    user: 'Wang Wu',
    userId: 'user-004',
    ipAddress: '192.168.1.115',
    device: 'iPhone 15 Pro',
    browser: 'Safari Mobile',
    status: 'success',
  },
  {
    id: 'login-007',
    timestamp: '2026-03-23T14:30:00Z',
    user: 'Zhang San',
    userId: 'user-002',
    ipAddress: '14.25.36.47',
    device: 'iPad Pro',
    browser: 'Safari Mobile',
    status: 'success',
  },
  {
    id: 'login-008',
    timestamp: '2026-03-23T10:00:00Z',
    user: 'Admin User',
    userId: 'user-001',
    ipAddress: '192.168.1.100',
    device: 'Windows Desktop',
    browser: 'Chrome 122.0',
    status: 'success',
  },
  {
    id: 'login-009',
    timestamp: '2026-03-22T16:00:00Z',
    user: 'Li Si',
    userId: 'user-003',
    ipAddress: '192.168.1.110',
    device: 'Android Phone',
    browser: 'Chrome Mobile',
    status: 'success',
  },
  {
    id: 'login-010',
    timestamp: '2026-03-22T11:00:00Z',
    user: 'Admin User',
    userId: 'user-001',
    ipAddress: '192.168.1.100',
    device: 'MacBook Air',
    browser: 'Firefox 124.0',
    status: 'success',
  },
  {
    id: 'login-011',
    timestamp: '2026-03-22T09:00:00Z',
    user: 'Unknown',
    userId: 'unknown',
    ipAddress: '45.67.89.101',
    device: 'Unknown Device',
    browser: 'Unknown Browser',
    status: 'failed',
    failureReason: 'Account locked',
  },
  {
    id: 'login-012',
    timestamp: '2026-03-21T15:30:00Z',
    user: 'Wang Wu',
    userId: 'user-004',
    ipAddress: '192.168.1.115',
    device: 'Windows Desktop',
    browser: 'Chrome 122.0',
    status: 'success',
  },
  {
    id: 'login-013',
    timestamp: '2026-03-21T12:00:00Z',
    user: 'Zhang San',
    userId: 'user-002',
    ipAddress: '192.168.1.105',
    device: 'MacBook Pro',
    browser: 'Safari 17.3',
    status: 'success',
  },
  {
    id: 'login-014',
    timestamp: '2026-03-21T08:30:00Z',
    user: 'Admin User',
    userId: 'user-001',
    ipAddress: '192.168.1.100',
    device: 'Windows Desktop',
    browser: 'Chrome 122.0',
    status: 'success',
  },
  {
    id: 'login-015',
    timestamp: '2026-03-20T17:00:00Z',
    user: 'Li Si',
    userId: 'user-003',
    ipAddress: '192.168.1.110',
    device: 'Windows Laptop',
    browser: 'Edge 122.0',
    status: 'success',
  },
];

/** 可用图标列表 */
export const AVAILABLE_ICONS = [
  'phone', 'user', 'mail', 'wechat', 'team', 'calendar', 'message', 'video-camera',
];

/** 可用颜色列表 */
export const AVAILABLE_COLORS = [
  '#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2', '#eb2f96', '#fa8c16',
];

/** 工作日选项 */
export const WORK_DAY_OPTIONS = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

/** 数据保留策略选项 */
export const RETENTION_OPTIONS = [
  { value: 90, label: '3 months' },
  { value: 180, label: '6 months' },
  { value: 365, label: '1 year' },
  { value: 730, label: '2 years' },
  { value: 1095, label: '3 years' },
];