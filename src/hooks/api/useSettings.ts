import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// ============================================================
// Types
// ============================================================

export interface ProfileSettings {
  username: string
  displayName?: string
  email: string
  phone?: string
  avatar?: string
  position?: string
  department?: string
  bio?: string
}

export interface SecuritySettings {
  lastPasswordChange?: string
  twoFactorEnabled: boolean
  sessions: Array<{
    id: string
    device: string
    lastActive: string
    location?: string
  }>
}

export interface PreferencesSettings {
  language: string
  theme: string
  timezone: string
  dateFormat: string
  emailNotifications: boolean
  pushNotifications: boolean
  smsNotifications: boolean
  weeklyReportEmail: boolean
  listDensity: string
  defaultPageSize: number
}

export interface NotificationSettings {
  notifyCustomerCreated: boolean
  notifyOpportunityStatusChanged: boolean
  notifyContractApproval: boolean
  notifyTaskReminder: boolean
  notifySystemAnnouncement: boolean
  notifyAIAnalysisReport: boolean
  channels?: {
    email: boolean
    push: boolean
    sms: boolean
  }
}

export interface DataBackupSettings {
  autoBackup: boolean
  backupFrequency: "daily" | "weekly" | "monthly"
  backupTime: string
  retentionDays: number
  storageLocation: "local" | "cloud" | "both"
  includeAttachments: boolean
  compressBackup: boolean
  encryptBackup: boolean
  lastBackup?: string
  backupSize?: string
  backupHistory?: Array<{ date: string; size: string; status: string }>
}

export interface ImportExportSettings {
  defaultExportFormat: "xlsx" | "csv" | "json"
  includeHeaders: boolean
  exportEncoding: "utf-8" | "gbk" | "gb2312"
  batchSize: number
  allowOverwrite: boolean
  validateImport: boolean
  notifyOnComplete: boolean
  recentExports?: Array<{ date: string; type: string; records: number; status: string }>
  recentImports?: Array<{ date: string; type: string; records: number; status: string }>
}

export interface ApiSettings {
  apiEnabled: boolean
  apiKey?: string
  rateLimit: number
  ipWhitelist: string[]
  timeoutSeconds: number
  logApiCalls: boolean
  corsEnabled: boolean
  totalCalls?: number
  callsToday?: number
  lastCall?: string
}

export interface WebhookSettings {
  id?: string
  name: string
  url: string
  secret?: string
  events: string[]
  enabled: boolean
  timeoutSeconds: number
  retryCount: number
  lastTriggered?: string
  status?: "active" | "failed" | "pending"
  successRate?: number
}

export interface AuditLogSettings {
  logLogin: boolean
  logOperations: boolean
  logDataChanges: boolean
  logExports: boolean
  retentionDays: number
  includeDetails: boolean
  autoArchive: boolean
  totalLogs?: number
  logsToday?: number
  storageUsed?: string
}

export interface LicenseSettings {
  licenseKey: string
  companyName?: string
  contactEmail?: string
  maxUsers?: number
  expiryDate?: string
  status?: "valid" | "expired" | "invalid"
  features?: string[]
  currentUsers?: number
}

export interface SystemInfoSettings {
  systemName: string
  systemDescription?: string
  adminEmail?: string
  timezone: string
  version?: string
  databaseSize?: string
  storageUsed?: string
  lastBackup?: string
  uptime?: string
  environment?: string
}

export interface CustomizationSettings {
  logoUrl?: string
  primaryColor: string
  companyName?: string
  welcomeMessage?: string
  customCss?: string
  customJs?: string
  footerText?: string
}

export interface MobileSettings {
  mobileEnabled: boolean
  pushNotifications: boolean
  offlineMode: boolean
  autoSync: boolean
  syncInterval: number
  mobileTheme: "light" | "dark" | "system"
  fontSize: "small" | "medium" | "large"
  activeDevices?: number
}

export interface AdvancedSettings {
  debugMode: boolean
  performanceMonitoring: boolean
  errorReporting: boolean
  cacheStrategy: "aggressive" | "normal" | "minimal"
  logLevel: "debug" | "info" | "warn" | "error"
  maxUploadSize: number
  sessionTimeout: number
  concurrentRequests: number
}

// ============================================================
// API Functions (Mock)
// ============================================================

const settingsApi = {
  // Profile
  getProfile: async (): Promise<ProfileSettings> => {
    return {
      username: 'admin',
      displayName: '管理员',
      email: 'admin@example.com',
      phone: '13800138000',
      avatar: '',
      position: '产品经理',
      department: '产品部',
      bio: '负责 CRM 系统的产品规划与设计',
    }
  },
  updateProfile: async (data: Partial<ProfileSettings>): Promise<ProfileSettings> => {
    console.log('Update profile:', data)
    return { ...await settingsApi.getProfile(), ...data }
  },

  // Security
  getSecurity: async (): Promise<SecuritySettings> => {
    return {
      lastPasswordChange: '2024-01-15',
      twoFactorEnabled: false,
      sessions: [
        { id: '1', device: 'Chrome / Windows', lastActive: '2025-04-03 18:00', location: '北京市' },
        { id: '2', device: 'Safari / macOS', lastActive: '2025-04-02 10:30', location: '上海市' },
      ],
    }
  },
  changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<void> => {
    console.log('Change password:', data)
  },
  enableTwoFactor: async (): Promise<{ qrCode: string; secret: string }> => {
    return { qrCode: 'mock-qr-code', secret: 'mock-secret' }
  },
  disableTwoFactor: async (): Promise<void> => {
    console.log('Disable two factor')
  },
  terminateSession: async (sessionId: string): Promise<void> => {
    console.log('Terminate session:', sessionId)
  },

  // Preferences
  getPreferences: async (): Promise<PreferencesSettings> => {
    return {
      language: 'zh-CN',
      theme: 'system',
      timezone: 'Asia/Shanghai',
      dateFormat: 'YYYY-MM-DD',
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      weeklyReportEmail: true,
      listDensity: 'default',
      defaultPageSize: 20,
    }
  },
  updatePreferences: async (data: Partial<PreferencesSettings>): Promise<PreferencesSettings> => {
    console.log('Update preferences:', data)
    return { ...await settingsApi.getPreferences(), ...data }
  },

  // Notifications
  getNotifications: async (): Promise<NotificationSettings> => {
    return {
      notifyCustomerCreated: true,
      notifyOpportunityStatusChanged: true,
      notifyContractApproval: true,
      notifyTaskReminder: true,
      notifySystemAnnouncement: true,
      notifyAIAnalysisReport: false,
    }
  },
  updateNotifications: async (data: Partial<NotificationSettings>): Promise<NotificationSettings> => {
    console.log('Update notifications:', data)
    return { ...await settingsApi.getNotifications(), ...data }
  },

  // Data Backup
  getDataBackup: async (): Promise<DataBackupSettings> => {
    return {
      autoBackup: true,
      backupFrequency: 'daily',
      backupTime: '02:00',
      retentionDays: 30,
      storageLocation: 'local',
      includeAttachments: true,
      compressBackup: true,
      encryptBackup: false,
      lastBackup: '2025-04-03 02:00:00',
      backupSize: '1.2 GB',
      backupHistory: [
        { date: '2025-04-03', size: '1.2 GB', status: 'success' },
        { date: '2025-04-02', size: '1.1 GB', status: 'success' },
        { date: '2025-04-01', size: '1.0 GB', status: 'success' },
      ],
    }
  },
  updateDataBackup: async (data: Partial<DataBackupSettings>): Promise<DataBackupSettings> => {
    console.log('Update data backup:', data)
    return { ...await settingsApi.getDataBackup(), ...data }
  },
  createBackup: async (): Promise<{ success: boolean; message: string; backupId: string }> => {
    console.log('Create backup')
    return { success: true, message: '备份创建成功', backupId: 'backup-001' }
  },
  restoreBackup: async (backupId: string): Promise<{ success: boolean; message: string }> => {
    console.log('Restore backup:', backupId)
    return { success: true, message: '恢复成功' }
  },

  // Import Export
  getImportExport: async (): Promise<ImportExportSettings> => {
    return {
      defaultExportFormat: 'xlsx',
      includeHeaders: true,
      exportEncoding: 'utf-8',
      batchSize: 1000,
      allowOverwrite: false,
      validateImport: true,
      notifyOnComplete: true,
      recentExports: [
        { date: '2025-04-03', type: '客户数据', records: 500, status: 'success' },
        { date: '2025-04-02', type: '商机数据', records: 200, status: 'success' },
      ],
      recentImports: [
        { date: '2025-04-02', type: '客户数据', records: 100, status: 'success' },
      ],
    }
  },
  updateImportExport: async (data: Partial<ImportExportSettings>): Promise<ImportExportSettings> => {
    console.log('Update import export:', data)
    return { ...await settingsApi.getImportExport(), ...data }
  },

  // API Settings
  getApiSettings: async (): Promise<ApiSettings> => {
    return {
      apiEnabled: true,
      apiKey: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      rateLimit: 1000,
      ipWhitelist: ['192.168.1.0/24', '10.0.0.0/8'],
      timeoutSeconds: 30,
      logApiCalls: true,
      corsEnabled: true,
      totalCalls: 15000,
      callsToday: 150,
      lastCall: '2025-04-03 18:30',
    }
  },
  updateApiSettings: async (data: Partial<ApiSettings>): Promise<ApiSettings> => {
    console.log('Update API settings:', data)
    return { ...await settingsApi.getApiSettings(), ...data }
  },
  regenerateApiKey: async (): Promise<{ apiKey: string }> => {
    console.log('Regenerate API key')
    return { apiKey: 'sk-newxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' }
  },
  testApiConnection: async (): Promise<{ success: boolean; message: string }> => {
    console.log('Test API connection')
    return { success: true, message: 'API 连接测试成功' }
  },

  // Webhooks
  getWebhooks: async (): Promise<WebhookSettings[]> => {
    return [
      {
        id: 'webhook-1',
        name: '客户创建通知',
        url: 'https://example.com/webhook/customer',
        events: ['customer.created', 'customer.updated'],
        enabled: true,
        timeoutSeconds: 10,
        retryCount: 3,
        lastTriggered: '2025-04-03 15:30',
        status: 'active',
        successRate: 98,
      },
      {
        id: 'webhook-2',
        name: '商机状态变更',
        url: 'https://example.com/webhook/opportunity',
        events: ['opportunity.status_changed'],
        enabled: true,
        timeoutSeconds: 10,
        retryCount: 3,
        lastTriggered: '2025-04-03 14:00',
        status: 'active',
        successRate: 95,
      },
    ]
  },
  createWebhook: async (data: WebhookSettings): Promise<WebhookSettings> => {
    console.log('Create webhook:', data)
    return { ...data, id: `webhook-${Date.now()}`, status: 'pending' }
  },
  updateWebhook: async (id: string, data: Partial<WebhookSettings>): Promise<WebhookSettings> => {
    console.log('Update webhook:', id, data)
    return { name: '', url: '', events: [], enabled: true, timeoutSeconds: 10, retryCount: 3, ...data, id }
  },
  deleteWebhook: async (id: string): Promise<void> => {
    console.log('Delete webhook:', id)
  },
  testWebhook: async (id: string): Promise<{ success: boolean; message: string; responseTime: number }> => {
    console.log('Test webhook:', id)
    return { success: true, message: 'Webhook 测试成功', responseTime: 150 }
  },

  // Audit Log
  getAuditLogSettings: async (): Promise<AuditLogSettings> => {
    return {
      logLogin: true,
      logOperations: true,
      logDataChanges: true,
      logExports: true,
      retentionDays: 90,
      includeDetails: true,
      autoArchive: false,
      totalLogs: 50000,
      logsToday: 150,
      storageUsed: '500 MB',
    }
  },
  updateAuditLogSettings: async (data: Partial<AuditLogSettings>): Promise<AuditLogSettings> => {
    console.log('Update audit log settings:', data)
    return { ...await settingsApi.getAuditLogSettings(), ...data }
  },
  exportAuditLogs: async (params: { startDate: string; endDate: string }): Promise<{ downloadUrl: string }> => {
    console.log('Export audit logs:', params)
    return { downloadUrl: '/downloads/audit-logs.zip' }
  },

  // License
  getLicense: async (): Promise<LicenseSettings> => {
    return {
      licenseKey: 'CRM-PRO-2025-XXXXX-XXXXX',
      companyName: '示例科技有限公司',
      contactEmail: 'admin@example.com',
      maxUsers: 100,
      expiryDate: '2026-12-31',
      status: 'valid',
      features: ['高级报表', 'AI 分析', '自定义字段', '多语言支持'],
      currentUsers: 25,
    }
  },
  updateLicense: async (data: Partial<LicenseSettings>): Promise<LicenseSettings> => {
    console.log('Update license:', data)
    return { ...await settingsApi.getLicense(), ...data }
  },
  validateLicense: async (licenseKey: string): Promise<{ valid: boolean; message: string }> => {
    console.log('Validate license:', licenseKey)
    return { valid: true, message: '许可证验证成功' }
  },

  // System Info
  getSystemInfo: async (): Promise<SystemInfoSettings> => {
    return {
      systemName: 'CRM Pro',
      systemDescription: '企业级客户关系管理系统',
      adminEmail: 'admin@example.com',
      timezone: 'Asia/Shanghai',
      version: '2.5.0',
      databaseSize: '5.2 GB',
      storageUsed: '12.8 GB',
      lastBackup: '2025-04-03 02:00',
      uptime: '30 天 12 小时',
      environment: 'production',
    }
  },
  updateSystemInfo: async (data: Partial<SystemInfoSettings>): Promise<SystemInfoSettings> => {
    console.log('Update system info:', data)
    return { ...await settingsApi.getSystemInfo(), ...data }
  },

  // Customization
  getCustomization: async (): Promise<CustomizationSettings> => {
    return {
      logoUrl: '/logo.png',
      primaryColor: '#3b82f6',
      companyName: 'CRM Pro',
      welcomeMessage: '欢迎使用 CRM Pro',
      customCss: '',
      customJs: '',
      footerText: '© 2025 CRM Pro. All rights reserved.',
    }
  },
  updateCustomization: async (data: Partial<CustomizationSettings>): Promise<CustomizationSettings> => {
    console.log('Update customization:', data)
    return { ...await settingsApi.getCustomization(), ...data }
  },

  // Mobile
  getMobileSettings: async (): Promise<MobileSettings> => {
    return {
      mobileEnabled: true,
      pushNotifications: true,
      offlineMode: false,
      autoSync: true,
      syncInterval: 15,
      mobileTheme: 'system',
      fontSize: 'medium',
      activeDevices: 12,
    }
  },
  updateMobileSettings: async (data: Partial<MobileSettings>): Promise<MobileSettings> => {
    console.log('Update mobile settings:', data)
    return { ...await settingsApi.getMobileSettings(), ...data }
  },

  // Advanced
  getAdvancedSettings: async (): Promise<AdvancedSettings> => {
    return {
      debugMode: false,
      performanceMonitoring: true,
      errorReporting: true,
      cacheStrategy: 'normal',
      logLevel: 'info',
      maxUploadSize: 10,
      sessionTimeout: 60,
      concurrentRequests: 20,
    }
  },
  updateAdvancedSettings: async (data: Partial<AdvancedSettings>): Promise<AdvancedSettings> => {
    console.log('Update advanced settings:', data)
    return { ...await settingsApi.getAdvancedSettings(), ...data }
  },
  clearCache: async (): Promise<{ success: boolean; message: string }> => {
    console.log('Clear cache')
    return { success: true, message: '缓存已清除' }
  },
}

// ============================================================
// Query Keys
// ============================================================

export const settingsQueryKeys = {
  profile: ['settings', 'profile'] as const,
  security: ['settings', 'security'] as const,
  preferences: ['settings', 'preferences'] as const,
  notifications: ['settings', 'notifications'] as const,
  dataBackup: ['settings', 'dataBackup'] as const,
  importExport: ['settings', 'importExport'] as const,
  apiSettings: ['settings', 'apiSettings'] as const,
  webhooks: ['settings', 'webhooks'] as const,
  auditLog: ['settings', 'auditLog'] as const,
  license: ['settings', 'license'] as const,
  systemInfo: ['settings', 'systemInfo'] as const,
  customization: ['settings', 'customization'] as const,
  mobile: ['settings', 'mobile'] as const,
  advanced: ['settings', 'advanced'] as const,
}

// ============================================================
// Hooks
// ============================================================

// Profile
export function useProfileSettings() {
  return useQuery({
    queryKey: settingsQueryKeys.profile,
    queryFn: settingsApi.getProfile,
  })
}

export function useUpdateProfileSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: settingsApi.updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(settingsQueryKeys.profile, data)
    },
  })
}

// Security
export function useSecuritySettings() {
  return useQuery({
    queryKey: settingsQueryKeys.security,
    queryFn: settingsApi.getSecurity,
  })
}

export function useChangePassword() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: settingsApi.changePassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsQueryKeys.security })
    },
  })
}

export function useEnableTwoFactor() {
  return useMutation({
    mutationFn: settingsApi.enableTwoFactor,
  })
}

export function useDisableTwoFactor() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: settingsApi.disableTwoFactor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsQueryKeys.security })
    },
  })
}

export function useTerminateSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: settingsApi.terminateSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsQueryKeys.security })
    },
  })
}

// Preferences
export function usePreferencesSettings() {
  return useQuery({
    queryKey: settingsQueryKeys.preferences,
    queryFn: settingsApi.getPreferences,
  })
}

export function useUpdatePreferencesSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: settingsApi.updatePreferences,
    onSuccess: (data) => {
      queryClient.setQueryData(settingsQueryKeys.preferences, data)
    },
  })
}

// Notifications
export function useNotificationSettings() {
  return useQuery({
    queryKey: settingsQueryKeys.notifications,
    queryFn: settingsApi.getNotifications,
  })
}

export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: settingsApi.updateNotifications,
    onSuccess: (data) => {
      queryClient.setQueryData(settingsQueryKeys.notifications, data)
    },
  })
}

// Data Backup
export function useDataBackupSettings() {
  return useQuery({
    queryKey: settingsQueryKeys.dataBackup,
    queryFn: settingsApi.getDataBackup,
  })
}

export function useUpdateDataBackupSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: settingsApi.updateDataBackup,
    onSuccess: (data) => {
      queryClient.setQueryData(settingsQueryKeys.dataBackup, data)
    },
  })
}

export function useCreateBackup() {
  return useMutation({
    mutationFn: settingsApi.createBackup,
  })
}

export function useRestoreBackup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: settingsApi.restoreBackup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsQueryKeys.dataBackup })
    },
  })
}

// Import Export
export function useImportExportSettings() {
  return useQuery({
    queryKey: settingsQueryKeys.importExport,
    queryFn: settingsApi.getImportExport,
  })
}

export function useUpdateImportExportSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: settingsApi.updateImportExport,
    onSuccess: (data) => {
      queryClient.setQueryData(settingsQueryKeys.importExport, data)
    },
  })
}

// API Settings
export function useApiSettings() {
  return useQuery({
    queryKey: settingsQueryKeys.apiSettings,
    queryFn: settingsApi.getApiSettings,
  })
}

export function useUpdateApiSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: settingsApi.updateApiSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(settingsQueryKeys.apiSettings, data)
    },
  })
}

export function useRegenerateApiKey() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: settingsApi.regenerateApiKey,
    onSuccess: (data) => {
      queryClient.setQueryData(settingsQueryKeys.apiSettings, (old: ApiSettings | undefined) => {
        return old ? { ...old, apiKey: data.apiKey } : old
      })
    },
  })
}

export function useTestApiConnection() {
  return useMutation({
    mutationFn: settingsApi.testApiConnection,
  })
}

// Webhooks
export function useWebhooks() {
  return useQuery({
    queryKey: settingsQueryKeys.webhooks,
    queryFn: settingsApi.getWebhooks,
  })
}

export function useCreateWebhook() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: settingsApi.createWebhook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsQueryKeys.webhooks })
    },
  })
}

export function useUpdateWebhook() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<WebhookSettings> }) => 
      settingsApi.updateWebhook(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsQueryKeys.webhooks })
    },
  })
}

export function useDeleteWebhook() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: settingsApi.deleteWebhook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsQueryKeys.webhooks })
    },
  })
}

export function useTestWebhook() {
  return useMutation({
    mutationFn: settingsApi.testWebhook,
  })
}

// Audit Log
export function useAuditLogSettings() {
  return useQuery({
    queryKey: settingsQueryKeys.auditLog,
    queryFn: settingsApi.getAuditLogSettings,
  })
}

export function useUpdateAuditLogSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: settingsApi.updateAuditLogSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(settingsQueryKeys.auditLog, data)
    },
  })
}

export function useExportAuditLogs() {
  return useMutation({
    mutationFn: settingsApi.exportAuditLogs,
  })
}

// License
export function useLicenseSettings() {
  return useQuery({
    queryKey: settingsQueryKeys.license,
    queryFn: settingsApi.getLicense,
  })
}

export function useUpdateLicenseSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: settingsApi.updateLicense,
    onSuccess: (data) => {
      queryClient.setQueryData(settingsQueryKeys.license, data)
    },
  })
}

export function useValidateLicense() {
  return useMutation({
    mutationFn: settingsApi.validateLicense,
  })
}

// System Info
export function useSystemInfoSettings() {
  return useQuery({
    queryKey: settingsQueryKeys.systemInfo,
    queryFn: settingsApi.getSystemInfo,
  })
}

export function useUpdateSystemInfoSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: settingsApi.updateSystemInfo,
    onSuccess: (data) => {
      queryClient.setQueryData(settingsQueryKeys.systemInfo, data)
    },
  })
}

// Customization
export function useCustomizationSettings() {
  return useQuery({
    queryKey: settingsQueryKeys.customization,
    queryFn: settingsApi.getCustomization,
  })
}

export function useUpdateCustomizationSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: settingsApi.updateCustomization,
    onSuccess: (data) => {
      queryClient.setQueryData(settingsQueryKeys.customization, data)
    },
  })
}

// Mobile
export function useMobileSettings() {
  return useQuery({
    queryKey: settingsQueryKeys.mobile,
    queryFn: settingsApi.getMobileSettings,
  })
}

export function useUpdateMobileSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: settingsApi.updateMobileSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(settingsQueryKeys.mobile, data)
    },
  })
}

// Advanced
export function useAdvancedSettings() {
  return useQuery({
    queryKey: settingsQueryKeys.advanced,
    queryFn: settingsApi.getAdvancedSettings,
  })
}

export function useUpdateAdvancedSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: settingsApi.updateAdvancedSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(settingsQueryKeys.advanced, data)
    },
  })
}

export function useClearCache() {
  return useMutation({
    mutationFn: settingsApi.clearCache,
  })
}

// ============================================================
// Export
// ============================================================

export { settingsApi }

// ============================================================
// Additional Types
// ============================================================

export interface EmailSettings {
  smtpServer: string
  smtpPort: number
  smtpUsername: string
  smtpPassword: string
  senderEmail: string
  senderName?: string
  enableSSL: boolean
  emailSignature?: string
}

export interface FieldSettings {
  id?: string
  name: string
  label: string
  type: string
  modules: string[]
  required: boolean
  listVisible: boolean
  detailVisible: boolean
  enabled: boolean
  defaultValue?: string
  options?: Array<{ value: string; label: string }>
  isSystem?: boolean
}

export interface LayoutSettings {
  sidebarPosition: 'left' | 'right'
  sidebarWidth: 'compact' | 'default' | 'wide'
  sidebarCollapsible: boolean
  headerHeight: 'compact' | 'default' | 'tall'
  showBreadcrumb: boolean
  showFooter: boolean
  contentWidth: 'fixed' | 'fluid'
  cardSpacing: 'compact' | 'default' | 'relaxed'
  tableDensity: 'compact' | 'default' | 'comfortable'
}

export interface ThemeSettings {
  primaryColor: string
  accentColor: string
  successColor: string
  warningColor: string
  dangerColor: string
  borderRadius: 'none' | 'small' | 'medium' | 'large'
  fontSizeBase: 'small' | 'medium' | 'large'
  fontFamily: 'system' | 'inter' | 'roboto' | 'noto-sans-sc'
  shadowLevel: 'none' | 'subtle' | 'medium' | 'strong'
  animationEnabled: boolean
}

export interface WorkflowSettings {
  id?: string
  name: string
  description?: string
  triggerType: string
  targetObject: string
  actions: Array<{ type: string; config?: Record<string, unknown> }>
  enabled: boolean
}

export interface IntegrationSettings {
  wechatEnabled: boolean
  wechatAppId?: string
  wechatAppSecret?: string
  dingtalkEnabled: boolean
  dingtalkAppKey?: string
  dingtalkAppSecret?: string
  slackEnabled: boolean
  slackWebhookUrl?: string
  zapierEnabled: boolean
  zapierApiKey?: string
}

// ============================================================
// Additional Query Keys
// ============================================================

export const additionalQueryKeys = {
  email: ['settings', 'email'] as const,
  field: ['settings', 'field'] as const,
  layout: ['settings', 'layout'] as const,
  theme: ['settings', 'theme'] as const,
  workflow: ['settings', 'workflow'] as const,
  integration: ['settings', 'integration'] as const,
}

// ============================================================
// Additional Hooks - Email Settings
// ============================================================

export function useEmailSettings() {
  return useQuery({
    queryKey: additionalQueryKeys.email,
    queryFn: async (): Promise<EmailSettings> => {
      return {
        smtpServer: 'smtp.example.com',
        smtpPort: 587,
        smtpUsername: 'admin@example.com',
        smtpPassword: '',
        senderEmail: 'admin@example.com',
        senderName: 'CRM System',
        enableSSL: true,
        emailSignature: '',
      }
    },
  })
}

export function useUpdateEmailSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<EmailSettings>) => {
      console.log('Update email settings:', data)
      return data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(additionalQueryKeys.email, data)
    },
  })
}

export function useTestEmailConnection() {
  return useMutation({
    mutationFn: async () => {
      return { success: true, message: 'Email connection test successful' }
    },
  })
}

// ============================================================
// Additional Hooks - Field Settings
// ============================================================

export function useFieldSettings() {
  return useQuery({
    queryKey: additionalQueryKeys.field,
    queryFn: async (): Promise<FieldSettings[]> => {
      return [
        {
          id: 'field-1',
          name: 'customerSource',
          label: '客户来源',
          type: 'select',
          modules: ['customer'],
          required: false,
          listVisible: true,
          detailVisible: true,
          enabled: true,
          options: [
            { value: 'marketing', label: '市场营销' },
            { value: 'referral', label: '客户推荐' },
            { value: 'partner', label: '合作伙伴' },
          ],
        },
      ]
    },
  })
}

export function useCreateField() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: FieldSettings) => {
      console.log('Create field:', data)
      return { ...data, id: `field-${Date.now()}` }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: additionalQueryKeys.field })
    },
  })
}

export function useUpdateField() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<FieldSettings> }) => {
      console.log('Update field:', id, data)
      return { ...data, id }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: additionalQueryKeys.field })
    },
  })
}

export function useDeleteField() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Delete field:', id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: additionalQueryKeys.field })
    },
  })
}

// ============================================================
// Additional Hooks - Layout Settings
// ============================================================

export function useLayoutSettings() {
  return useQuery({
    queryKey: additionalQueryKeys.layout,
    queryFn: async (): Promise<LayoutSettings> => {
      return {
        sidebarPosition: 'left',
        sidebarWidth: 'default',
        sidebarCollapsible: true,
        headerHeight: 'default',
        showBreadcrumb: true,
        showFooter: false,
        contentWidth: 'fluid',
        cardSpacing: 'default',
        tableDensity: 'default',
      }
    },
  })
}

export function useUpdateLayoutSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<LayoutSettings>) => {
      console.log('Update layout settings:', data)
      return data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(additionalQueryKeys.layout, (old: LayoutSettings | undefined) => {
        return old ? { ...old, ...data } : data
      })
    },
  })
}

// ============================================================
// Additional Hooks - Theme Settings
// ============================================================

export function useThemeSettings() {
  return useQuery({
    queryKey: additionalQueryKeys.theme,
    queryFn: async (): Promise<ThemeSettings> => {
      return {
        primaryColor: '#3b82f6',
        accentColor: '#8b5cf6',
        successColor: '#22c55e',
        warningColor: '#f59e0b',
        dangerColor: '#ef4444',
        borderRadius: 'medium',
        fontSizeBase: 'medium',
        fontFamily: 'system',
        shadowLevel: 'subtle',
        animationEnabled: true,
      }
    },
  })
}

export function useUpdateThemeSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<ThemeSettings>) => {
      console.log('Update theme settings:', data)
      return data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(additionalQueryKeys.theme, (old: ThemeSettings | undefined) => {
        return old ? { ...old, ...data } : data
      })
    },
  })
}

// ============================================================
// Additional Hooks - Workflow Settings
// ============================================================

export function useWorkflowSettingsList() {
  return useQuery({
    queryKey: additionalQueryKeys.workflow,
    queryFn: async (): Promise<WorkflowSettings[]> => {
      return [
        {
          id: 'workflow-1',
          name: '客户创建通知',
          description: '当新客户创建时发送通知',
          triggerType: 'record_created',
          targetObject: 'customer',
          actions: [{ type: 'send_notification', config: { template: 'customer_created' } }],
          enabled: true,
        },
      ]
    },
  })
}

export function useCreateWorkflowSettingsEntry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: WorkflowSettings) => {
      console.log('Create workflow:', data)
      return { ...data, id: `workflow-${Date.now()}` }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: additionalQueryKeys.workflow })
    },
  })
}

export function useUpdateWorkflowSettingsEntry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<WorkflowSettings> }) => {
      console.log('Update workflow:', id, data)
      return { ...data, id }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: additionalQueryKeys.workflow })
    },
  })
}

export function useDeleteWorkflowSettingsEntry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Delete workflow:', id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: additionalQueryKeys.workflow })
    },
  })
}

// ============================================================
// Additional Hooks - Integration Settings
// ============================================================

export function useIntegrationSettings() {
  return useQuery({
    queryKey: additionalQueryKeys.integration,
    queryFn: async (): Promise<IntegrationSettings> => {
      return {
        wechatEnabled: false,
        dingtalkEnabled: false,
        slackEnabled: false,
        zapierEnabled: false,
      }
    },
  })
}

export function useUpdateIntegrationSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<IntegrationSettings>) => {
      console.log('Update integration settings:', data)
      return data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(additionalQueryKeys.integration, (old: IntegrationSettings | undefined) => {
        return old ? { ...old, ...data } : data
      })
    },
  })
}

export function useTestIntegration() {
  return useMutation({
    mutationFn: async (type: string) => {
      console.log('Test integration:', type)
      return { success: true, message: `Integration ${type} test successful` }
    },
  })
}