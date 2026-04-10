// API Hooks
export * from './useCustomers'
export * from './useContacts'
export * from './useLeads'
export * from './useOpportunities'
export * from './useProducts'
export * from './useContracts'
export * from './usePayments'
export * from './useOrders'
export * from './usePricebooks'
// Settings - selective export to avoid conflicts with useWorkflows
export {
  useProfileSettings,
  useUpdateProfileSettings,
  useSecuritySettings,
  useChangePassword,
  useEnableTwoFactor,
  useDisableTwoFactor,
  useTerminateSession,
  usePreferencesSettings,
  useUpdatePreferencesSettings,
  useNotificationSettings,
  useUpdateNotificationSettings,
  useDataBackupSettings,
  useUpdateDataBackupSettings,
  useCreateBackup,
  useRestoreBackup,
  useImportExportSettings,
  useUpdateImportExportSettings,
  useApiSettings,
  useUpdateApiSettings,
  useRegenerateApiKey,
  useTestApiConnection,
  useWebhooks,
  useCreateWebhook,
  useUpdateWebhook,
  useDeleteWebhook,
  useTestWebhook,
  useAuditLogSettings,
  useUpdateAuditLogSettings,
  useExportAuditLogs,
  useLicenseSettings,
  useUpdateLicenseSettings,
  useValidateLicense,
  useSystemInfoSettings,
  useUpdateSystemInfoSettings,
  useCustomizationSettings,
  useUpdateCustomizationSettings,
  useMobileSettings,
  useUpdateMobileSettings,
  useAdvancedSettings,
  useUpdateAdvancedSettings,
  useClearCache,
  settingsApi,
  // Additional hooks
  useEmailSettings,
  useUpdateEmailSettings,
  useTestEmailConnection,
  useFieldSettings,
  useCreateField,
  useUpdateField,
  useDeleteField,
  useLayoutSettings,
  useUpdateLayoutSettings,
  useThemeSettings,
  useUpdateThemeSettings,
  useIntegrationSettings,
  useUpdateIntegrationSettings,
  useTestIntegration,
  // Workflow settings (renamed to avoid conflict)
  useWorkflowSettingsList,
  useCreateWorkflowSettingsEntry,
  useUpdateWorkflowSettingsEntry,
  useDeleteWorkflowSettingsEntry,
  // Types
  type WorkflowSettings as WorkflowSettingsType,
} from './useSettings'
export * from './useAI'
export * from './useMarketing'
export * from './useReports'
export * from './useActivities'
// Custom Objects & Workflows
export * from './useCustomObjects'
export * from './useWorkflows'
// New Services
export * from './useTickets'
export * from './useCallcenter'
export * from './useKnowledge'
export * from './useCustomFields'
export * from './useQuoteToContract'
export * from './useReconciliation'

// User, Role, Permission & Audit
export * from './useUsers'
export * from './useRoles'
export * from './usePermissions'
export * from './useAuditLogs'
export * from './useLoginLogs'

// Public Pool
export * from './usePublicPool'