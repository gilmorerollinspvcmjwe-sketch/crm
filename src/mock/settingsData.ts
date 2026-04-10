/**
 * 系统设置 Mock 数据
 */

// ============ 系统配置 ============

export interface SystemConfig {
  id: string;
  companyName: string;
  companyLogo?: string;
  industry: string;
  employeeCount: string;
  website?: string;
  address?: string;
  phone?: string;
  email?: string;
}

export const mockSystemConfig: SystemConfig = {
  id: 'sys-001',
  companyName: '示例科技有限公司',
  industry: '互联网',
  employeeCount: '100-500人',
  website: 'https://example.com',
  address: '北京市朝阳区建国路88号',
  phone: '010-12345678',
  email: 'contact@example.com',
};

// ============ 邮件配置 ============

export interface EmailConfig {
  id: string;
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword?: string;
  fromEmail: string;
  fromName: string;
  enableSSL: boolean;
  enableTLS: boolean;
}

export const mockEmailConfig: EmailConfig = {
  id: 'email-001',
  smtpHost: 'smtp.example.com',
  smtpPort: 465,
  smtpUsername: 'noreply@example.com',
  fromEmail: 'noreply@example.com',
  fromName: 'CRM系统',
  enableSSL: true,
  enableTLS: false,
};

// ============ 通知配置 ============

export interface NotificationConfig {
  id: string;
  emailEnabled: boolean;
  smsEnabled: boolean;
  inAppEnabled: boolean;
  notifyOnLeadAssigned: boolean;
  notifyOnOpportunityStageChange: boolean;
  notifyOnTaskDue: boolean;
  notifyOnDealWon: boolean;
  notifyOnCustomerBirthday: boolean;
  digestFrequency: 'realtime' | 'daily' | 'weekly';
}

export const mockNotificationConfig: NotificationConfig = {
  id: 'notif-001',
  emailEnabled: true,
  smsEnabled: false,
  inAppEnabled: true,
  notifyOnLeadAssigned: true,
  notifyOnOpportunityStageChange: true,
  notifyOnTaskDue: true,
  notifyOnDealWon: true,
  notifyOnCustomerBirthday: true,
  digestFrequency: 'daily',
};

// ============ 主题配置 ============

export interface ThemeConfig {
  id: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  darkModeEnabled: boolean;
  darkModeDefault: boolean;
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  compactMode: boolean;
}

export const mockThemeConfig: ThemeConfig = {
  id: 'theme-001',
  primaryColor: '#3b82f6',
  secondaryColor: '#6366f1',
  accentColor: '#8b5cf6',
  darkModeEnabled: true,
  darkModeDefault: false,
  borderRadius: 'md',
  compactMode: false,
};

// ============ 集成配置 ============

export interface IntegrationConfig {
  id: string;
  googleAnalyticsId?: string;
  facebookPixelId?: string;
  slackWebhookUrl?: string;
  dingtalkWebhookUrl?: string;
  wechatWorkWebhookUrl?: string;
  wechatAppId?: string;
  wechatAppSecret?: string;
  dingtalkAppId?: string;
  dingtalkAppSecret?: string;
  calendarSyncEnabled: boolean;
  calendarProvider: 'google' | 'microsoft' | 'apple' | 'none';
}

export const mockIntegrationConfig: IntegrationConfig = {
  id: 'int-001',
  googleAnalyticsId: 'UA-XXXXXXXXX-1',
  slackWebhookUrl: 'https://hooks.slack.com/services/XXX/YYY/ZZZ',
  calendarSyncEnabled: true,
  calendarProvider: 'google',
};

// ============ 安全配置 ============

export interface SecurityConfig {
  id: string;
  passwordMinLength: number;
  passwordRequireUppercase: boolean;
  passwordRequireLowercase: boolean;
  passwordRequireNumber: boolean;
  passwordRequireSpecial: boolean;
  sessionTimeout: number; // 分钟
  maxLoginAttempts: number;
  lockoutDuration: number; // 分钟
  twoFactorRequired: boolean;
  ipWhitelistEnabled: boolean;
  ipWhitelist?: string[];
}

export const mockSecurityConfig: SecurityConfig = {
  id: 'sec-001',
  passwordMinLength: 8,
  passwordRequireUppercase: true,
  passwordRequireLowercase: true,
  passwordRequireNumber: true,
  passwordRequireSpecial: false,
  sessionTimeout: 480,
  maxLoginAttempts: 5,
  lockoutDuration: 30,
  twoFactorRequired: false,
  ipWhitelistEnabled: false,
};

// ============ 业务规则配置 ============

export interface BusinessRuleConfig {
  id: string;
  autoLeadAssignment: boolean;
  autoLeadAssignmentRule?: string;
  requireReasonOnOpportunityLost: boolean;
  requireReasonOnOpportunityWon: boolean;
  defaultLeadSource: string;
  defaultOpportunityStage: string;
  autoFollowUpDays: number;
  dealDaysToClose: number;
  currency: string;
  timezone: string;
  dateFormat: string;
  fiscalYearStart: number; // 月份 1-12
}

export const mockBusinessRuleConfig: BusinessRuleConfig = {
  id: 'biz-001',
  autoLeadAssignment: true,
  requireReasonOnOpportunityLost: true,
  requireReasonOnOpportunityWon: false,
  defaultLeadSource: 'website',
  defaultOpportunityStage: 'prospecting',
  autoFollowUpDays: 3,
  dealDaysToClose: 90,
  currency: 'CNY',
  timezone: 'Asia/Shanghai',
  dateFormat: 'YYYY-MM-DD',
  fiscalYearStart: 1,
};

// ============ 辅助函数 ============

export function getSettingsByCategory(category: string): any {
  switch (category) {
    case 'system':
      return mockSystemConfig;
    case 'email':
      return mockEmailConfig;
    case 'notification':
      return mockNotificationConfig;
    case 'theme':
      return mockThemeConfig;
    case 'integration':
      return mockIntegrationConfig;
    case 'security':
      return mockSecurityConfig;
    case 'business':
      return mockBusinessRuleConfig;
    default:
      return null;
  }
}

export function getAllSettings(): Record<string, any> {
  return {
    system: mockSystemConfig,
    email: mockEmailConfig,
    notification: mockNotificationConfig,
    theme: mockThemeConfig,
    integration: mockIntegrationConfig,
    security: mockSecurityConfig,
    business: mockBusinessRuleConfig,
  };
}
