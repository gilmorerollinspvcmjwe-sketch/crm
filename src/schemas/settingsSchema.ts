import { z } from "zod"

// ============ Profile Settings Schema ============

export const profileSettingsSchema = z.object({
  /** 用户名 */
  username: z
    .string()
    .min(2, "用户名至少2个字符")
    .max(50, "用户名不能超过50个字符"),

  /** 显示名称 */
  displayName: z
    .string()
    .max(100, "显示名称不能超过100个字符")
    .optional(),

  /** 邮箱 */
  email: z
    .string()
    .email("请输入有效的邮箱地址"),

  /** 手机号 */
  phone: z
    .string()
    .optional(),

  /** 头像 URL */
  avatar: z
    .string()
    .optional(),

  /** 职位 */
  position: z
    .string()
    .max(100, "职位不能超过100个字符")
    .optional(),

  /** 部门 */
  department: z
    .string()
    .max(100, "部门不能超过100个字符")
    .optional(),

  /** 个人简介 */
  bio: z
    .string()
    .max(500, "个人简介不能超过500个字符")
    .optional(),
})

export type ProfileSettingsFormValues = z.input<typeof profileSettingsSchema>

// ============ Security Settings Schema ============

export const securitySettingsSchema = z.object({
  /** 当前密码 */
  currentPassword: z
    .string()
    .min(6, "密码至少6个字符"),

  /** 新密码 */
  newPassword: z
    .string()
    .min(8, "新密码至少8个字符")
    .max(100, "密码不能超过100个字符")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "密码必须包含大小写字母和数字"
    ),

  /** 确认新密码 */
  confirmPassword: z
    .string()
    .min(8, "确认密码至少8个字符"),
}).refine(
  (data) => data.newPassword === data.confirmPassword,
  {
    message: "两次输入的密码不一致",
    path: ["confirmPassword"],
  }
)

export type SecuritySettingsFormValues = z.input<typeof securitySettingsSchema>

// ============ Preferences Settings Schema ============

export const preferencesSettingsSchema = z.object({
  /** 语言 */
  language: z
    .string()
    .default("zh-CN"),

  /** 主题 */
  theme: z
    .string()
    .default("system"),

  /** 时区 */
  timezone: z
    .string()
    .default("Asia/Shanghai"),

  /** 日期格式 */
  dateFormat: z
    .string()
    .default("YYYY-MM-DD"),

  /** 启用邮件通知 */
  emailNotifications: z
    .boolean()
    .default(true),

  /** 启用推送通知 */
  pushNotifications: z
    .boolean()
    .default(true),

  /** 启用短信通知 */
  smsNotifications: z
    .boolean()
    .default(false),

  /** 每周报告邮件 */
  weeklyReportEmail: z
    .boolean()
    .default(true),

  /** 默认列表密度 */
  listDensity: z
    .string()
    .default("default"),

  /** 默认每页条数 */
  defaultPageSize: z
    .number()
    .min(10)
    .max(100)
    .default(20),
})

export type PreferencesSettingsFormValues = z.input<typeof preferencesSettingsSchema>

// ============ Notification Settings Schema ============

export const notificationSettingsSchema = z.object({
  /** 客户创建通知 */
  notifyCustomerCreated: z.boolean().default(true),

  /** 商机状态变更通知 */
  notifyOpportunityStatusChanged: z.boolean().default(true),

  /** 合同审批通知 */
  notifyContractApproval: z.boolean().default(true),

  /** 任务提醒 */
  notifyTaskReminder: z.boolean().default(true),

  /** 系统公告 */
  notifySystemAnnouncement: z.boolean().default(true),

  /** AI 分析报告 */
  notifyAIAnalysisReport: z.boolean().default(false),
})

export type NotificationSettingsFormValues = z.input<typeof notificationSettingsSchema>

// ============ Data Backup Settings Schema ============

export const dataBackupSettingsSchema = z.object({
  /** 自动备份 */
  autoBackup: z.boolean().default(false),

  /** 备份频率 */
  backupFrequency: z.enum(["daily", "weekly", "monthly"]).default("daily"),

  /** 备份时间 */
  backupTime: z.string().default("02:00"),

  /** 保留天数 */
  retentionDays: z.number().min(7).max(365).default(30),

  /** 备份存储位置 */
  storageLocation: z.enum(["local", "cloud", "both"]).default("local"),

  /** 包含附件 */
  includeAttachments: z.boolean().default(true),

  /** 压缩备份 */
  compressBackup: z.boolean().default(true),

  /** 加密备份 */
  encryptBackup: z.boolean().default(false),
})

export type DataBackupSettingsFormValues = z.input<typeof dataBackupSettingsSchema>

// ============ Import Export Settings Schema ============

export const importExportSettingsSchema = z.object({
  /** 默认导出格式 */
  defaultExportFormat: z.enum(["xlsx", "csv", "json"]).default("xlsx"),

  /** 包含表头 */
  includeHeaders: z.boolean().default(true),

  /** 导出编码 */
  exportEncoding: z.enum(["utf-8", "gbk", "gb2312"]).default("utf-8"),

  /** 批量导入大小 */
  batchSize: z.number().min(100).max(10000).default(1000),

  /** 允许覆盖 */
  allowOverwrite: z.boolean().default(false),

  /** 验证导入数据 */
  validateImport: z.boolean().default(true),

  /** 发送通知 */
  notifyOnComplete: z.boolean().default(true),
})

export type ImportExportSettingsFormValues = z.input<typeof importExportSettingsSchema>

// ============ API Settings Schema ============

export const apiSettingsSchema = z.object({
  /** API 启用 */
  apiEnabled: z.boolean().default(true),

  /** API 密钥 */
  apiKey: z.string().optional(),

  /** 请求频率限制 */
  rateLimit: z.number().min(100).max(100000).default(1000),

  /** IP 白名单 */
  ipWhitelist: z.array(z.string()).default([]),

  /** 超时时间（秒） */
  timeoutSeconds: z.number().min(5).max(300).default(30),

  /** 记录 API 日志 */
  logApiCalls: z.boolean().default(true),

  /** 允许跨域 */
  corsEnabled: z.boolean().default(true),
})

export type ApiSettingsFormValues = z.input<typeof apiSettingsSchema>

// ============ Webhook Settings Schema ============

export const webhookSettingsSchema = z.object({
  /** Webhook URL */
  url: z.string().url("请输入有效的 URL"),

  /** 密钥 */
  secret: z.string().optional(),

  /** 触发事件 */
  events: z.array(z.string()).default([]),

  /** 启用状态 */
  enabled: z.boolean().default(true),

  /** 超时时间（秒） */
  timeoutSeconds: z.number().min(5).max(60).default(10),

  /** 重试次数 */
  retryCount: z.number().min(0).max(5).default(3),
})

export type WebhookSettingsFormValues = z.input<typeof webhookSettingsSchema>

// ============ Audit Log Settings Schema ============

export const auditLogSettingsSchema = z.object({
  /** 记录登录日志 */
  logLogin: z.boolean().default(true),

  /** 记录操作日志 */
  logOperations: z.boolean().default(true),

  /** 记录数据变更 */
  logDataChanges: z.boolean().default(true),

  /** 记录导出操作 */
  logExports: z.boolean().default(true),

  /** 保留天数 */
  retentionDays: z.number().min(30).max(365).default(90),

  /** 包含详情 */
  includeDetails: z.boolean().default(true),

  /** 自动归档 */
  autoArchive: z.boolean().default(false),
})

export type AuditLogSettingsFormValues = z.input<typeof auditLogSettingsSchema>

// ============ License Settings Schema ============

export const licenseSettingsSchema = z.object({
  /** 许可证密钥 */
  licenseKey: z.string().min(1, "请输入许可证密钥"),

  /** 公司名称 */
  companyName: z.string().optional(),

  /** 联系邮箱 */
  contactEmail: z.string().email().optional(),

  /** 用户数限制 */
  maxUsers: z.number().optional(),

  /** 过期日期 */
  expiryDate: z.string().optional(),
})

export type LicenseSettingsFormValues = z.input<typeof licenseSettingsSchema>

// ============ System Info Settings Schema ============

export const systemInfoSettingsSchema = z.object({
  /** 系统名称 */
  systemName: z.string().min(1, "系统名称不能为空").default("CRM System"),

  /** 系统描述 */
  systemDescription: z.string().optional(),

  /** 管理员邮箱 */
  adminEmail: z.string().email("请输入有效的邮箱地址").optional(),

  /** 时区 */
  timezone: z.string().default("Asia/Shanghai"),
})

export type SystemInfoSettingsFormValues = z.input<typeof systemInfoSettingsSchema>

// ============ Customization Settings Schema ============

export const customizationSettingsSchema = z.object({
  /** Logo URL */
  logoUrl: z.string().optional(),

  /** 主题色 */
  primaryColor: z.string().default("#1890ff"),

  /** 公司名称 */
  companyName: z.string().optional(),

  /** 欢迎语 */
  welcomeMessage: z.string().optional(),

  /** 自定义 CSS */
  customCss: z.string().optional(),

  /** 自定义 JavaScript */
  customJs: z.string().optional(),

  /** 页脚文字 */
  footerText: z.string().optional(),
})

export type CustomizationSettingsFormValues = z.input<typeof customizationSettingsSchema>

// ============ Mobile Settings Schema ============

export const mobileSettingsSchema = z.object({
  /** 启用移动端 */
  mobileEnabled: z.boolean().default(true),

  /** 推送通知 */
  pushNotifications: z.boolean().default(true),

  /** 离线模式 */
  offlineMode: z.boolean().default(false),

  /** 自动同步 */
  autoSync: z.boolean().default(true),

  /** 同步频率（分钟） */
  syncInterval: z.number().min(5).max(60).default(15),

  /** 移动端主题 */
  mobileTheme: z.enum(["light", "dark", "system"]).default("system"),

  /** 字体大小 */
  fontSize: z.enum(["small", "medium", "large"]).default("medium"),
})

export type MobileSettingsFormValues = z.input<typeof mobileSettingsSchema>

// ============ Advanced Settings Schema ============

export const advancedSettingsSchema = z.object({
  /** 调试模式 */
  debugMode: z.boolean().default(false),

  /** 性能监控 */
  performanceMonitoring: z.boolean().default(true),

  /** 错误报告 */
  errorReporting: z.boolean().default(true),

  /** 缓存策略 */
  cacheStrategy: z.enum(["aggressive", "normal", "minimal"]).default("normal"),

  /** 日志级别 */
  logLevel: z.enum(["debug", "info", "warn", "error"]).default("info"),

  /** 最大上传大小（MB） */
  maxUploadSize: z.number().min(1).max(100).default(10),

  /** 会话超时（分钟） */
  sessionTimeout: z.number().min(5).max(1440).default(60),

  /** 并发请求限制 */
  concurrentRequests: z.number().min(5).max(100).default(20),
})

export type AdvancedSettingsFormValues = z.input<typeof advancedSettingsSchema>

// ============ Email Settings Schema ============

export const emailSettingsSchema = z.object({
  /** SMTP 服务器 */
  smtpServer: z
    .string()
    .min(1, "SMTP服务器不能为空"),

  /** SMTP 端口 */
  smtpPort: z
    .number()
    .min(1)
    .max(65535)
    .default(587),

  /** SMTP 用户名 */
  smtpUsername: z
    .string()
    .min(1, "SMTP用户名不能为空"),

  /** SMTP 密码 */
  smtpPassword: z
    .string()
    .min(1, "SMTP密码不能为空"),

  /** 发件人邮箱 */
  senderEmail: z
    .string()
    .email("请输入有效的邮箱地址"),

  /** 发件人名称 */
  senderName: z
    .string()
    .optional(),

  /** 启用 SSL */
  enableSSL: z
    .boolean()
    .default(true),

  /** 邮件签名 */
  emailSignature: z
    .string()
    .max(1000, "邮件签名不能超过1000个字符")
    .optional(),
})

export type EmailSettingsFormValues = z.input<typeof emailSettingsSchema>

// ============ Integration Settings Schema ============

export const integrationSettingsSchema = z.object({
  /** 微信集成 */
  wechatEnabled: z.boolean().default(false),
  wechatAppId: z.string().optional(),
  wechatAppSecret: z.string().optional(),

  /** 钉钉集成 */
  dingtalkEnabled: z.boolean().default(false),
  dingtalkAppKey: z.string().optional(),
  dingtalkAppSecret: z.string().optional(),

  /** Slack 集成 */
  slackEnabled: z.boolean().default(false),
  slackWebhookUrl: z.string().optional(),

  /** Zapier 集成 */
  zapierEnabled: z.boolean().default(false),
  zapierApiKey: z.string().optional(),
})

export type IntegrationSettingsFormValues = z.input<typeof integrationSettingsSchema>

// ============ Workflow Settings Schema ============

export const workflowSettingsSchema = z.object({
  /** 工作流名称 */
  name: z.string().min(1, "工作流名称不能为空"),

  /** 工作流描述 */
  description: z.string().optional(),

  /** 触发类型 */
  triggerType: z.enum([
    "record_created",
    "record_updated",
    "field_changed",
    "scheduled",
    "manual"
  ]).default("record_created"),

  /** 目标对象 */
  targetObject: z.string().min(1, "目标对象不能为空"),

  /** 执行动作 */
  actions: z.array(z.object({
    type: z.string(),
    config: z.record(z.string(), z.any()).optional(),
  })).default([]),

  /** 是否启用 */
  enabled: z.boolean().default(false),
})

export type WorkflowSettingsFormValues = z.input<typeof workflowSettingsSchema>

// ============ Field Settings Schema ============

export const fieldSettingsSchema = z.object({
  /** 字段名称 */
  name: z
    .string()
    .min(1, "字段名称不能为空")
    .max(50, "字段名称不能超过50个字符"),

  /** 字段标签 */
  label: z
    .string()
    .min(1, "字段标签不能为空")
    .max(100, "字段标签不能超过100个字符"),

  /** 字段类型 */
  type: z.enum([
    "text",
    "textarea",
    "number",
    "date",
    "datetime",
    "select",
    "multiselect",
    "switch",
    "user",
    "department",
    "relation",
    "file"
  ]).default("text"),

  /** 目标模块 */
  modules: z.array(z.string()).default([]),

  /** 是否必填 */
  required: z.boolean().default(false),

  /** 列表可见 */
  listVisible: z.boolean().default(true),

  /** 详情可见 */
  detailVisible: z.boolean().default(true),

  /** 是否启用 */
  enabled: z.boolean().default(true),

  /** 默认值 */
  defaultValue: z.string().optional(),

  /** 选项配置（用于select/multiselect） */
  options: z.array(z.object({
    value: z.string(),
    label: z.string(),
  })).optional(),
})

export type FieldSettingsFormValues = z.input<typeof fieldSettingsSchema>

// ============ Layout Settings Schema ============

export const layoutSettingsSchema = z.object({
  /** 侧边栏位置 */
  sidebarPosition: z.enum(["left", "right"]).default("left"),

  /** 侧边栏宽度 */
  sidebarWidth: z.enum(["compact", "default", "wide"]).default("default"),

  /** 侧边栏可折叠 */
  sidebarCollapsible: z.boolean().default(true),

  /** 头部高度 */
  headerHeight: z.enum(["compact", "default", "tall"]).default("default"),

  /** 显示面包屑 */
  showBreadcrumb: z.boolean().default(true),

  /** 显示页脚 */
  showFooter: z.boolean().default(false),

  /** 内容宽度 */
  contentWidth: z.enum(["fixed", "fluid"]).default("fluid"),

  /** 卡片间距 */
  cardSpacing: z.enum(["compact", "default", "relaxed"]).default("default"),

  /** 表格密度 */
  tableDensity: z.enum(["compact", "default", "comfortable"]).default("default"),
})

export type LayoutSettingsFormValues = z.input<typeof layoutSettingsSchema>

// ============ Theme Settings Schema ============

export const themeSettingsSchema = z.object({
  /** 主色调 */
  primaryColor: z.string().default("#3b82f6"),

  /** 强调色 */
  accentColor: z.string().default("#8b5cf6"),

  /** 成功色 */
  successColor: z.string().default("#22c55e"),

  /** 警告色 */
  warningColor: z.string().default("#f59e0b"),

  /** 错误色 */
  dangerColor: z.string().default("#ef4444"),

  /** 圆角大小 */
  borderRadius: z.enum(["none", "small", "medium", "large"]).default("medium"),

  /** 字体大小基准 */
  fontSizeBase: z.enum(["small", "medium", "large"]).default("medium"),

  /** 字体族 */
  fontFamily: z.enum(["system", "inter", "roboto", "noto-sans-sc"]).default("system"),

  /** 阴影级别 */
  shadowLevel: z.enum(["none", "subtle", "medium", "strong"]).default("subtle"),

  /** 动画效果 */
  animationEnabled: z.boolean().default(true),
})

export type ThemeSettingsFormValues = z.input<typeof themeSettingsSchema>