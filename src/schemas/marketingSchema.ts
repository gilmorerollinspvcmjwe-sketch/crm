import { z } from "zod"

// ============ Campaign Schema ============

export const campaignSchema = z.object({
  /** 活动名称 */
  name: z
    .string()
    .min(1, "活动名称不能为空")
    .max(200, "活动名称不能超过200个字符"),

  /** 活动类型 */
  type: z
    .enum(["email", "sms", "social", "event", "webinar", "other"])
    .default("email"),

  /** 活动状态 */
  status: z
    .enum(["draft", "scheduled", "running", "paused", "completed", "cancelled"])
    .default("draft"),

  /** 目标描述 */
  objective: z
    .string()
    .max(1000, "目标描述不能超过1000个字符")
    .optional(),

  /** 开始时间 */
  startDate: z
    .string()
    .optional()
    .or(z.date()),

  /** 结束时间 */
  endDate: z
    .string()
    .optional()
    .or(z.date()),

  /** 目标受众 */
  targetAudience: z
    .string()
    .max(500, "目标受众描述不能超过500个字符")
    .optional(),

  /** 预算 */
  budget: z
    .number()
    .min(0)
    .optional(),

  /** 预期转化率 */
  expectedConversionRate: z
    .number()
    .min(0)
    .max(100)
    .optional(),

  /** 关联产品 */
  productId: z
    .string()
    .optional(),

  /** 关联标签 */
  tags: z
    .array(z.string())
    .default([]),

  /** 备注 */
  notes: z
    .string()
    .max(2000, "备注不能超过2000个字符")
    .optional(),
})

export type CampaignFormValues = z.infer<typeof campaignSchema>

// ============ Email Schema ============

export const emailSchema = z.object({
  /** 邮件主题 */
  subject: z
    .string()
    .min(1, "邮件主题不能为空")
    .max(200, "邮件主题不能超过200个字符"),

  /** 发件人名称 */
  senderName: z
    .string()
    .max(100, "发件人名称不能超过100个字符")
    .optional(),

  /** 回复邮箱 */
  replyTo: z
    .string()
    .email("请输入有效的邮箱地址")
    .optional(),

  /** 收件人类型 */
  recipientType: z
    .enum(["all", "segment", "individual", "campaign"])
    .default("segment"),

  /** 收件人列表 */
  recipientIds: z
    .array(z.string())
    .default([]),

  /** 模板 ID */
  templateId: z
    .string()
    .optional(),

  /** 邮件内容 */
  content: z
    .string()
    .min(1, "邮件内容不能为空"),

  /** 发送时间 */
  scheduledAt: z
    .string()
    .optional()
    .or(z.date()),

  /** 优先级 */
  priority: z
    .enum(["low", "normal", "high"])
    .default("normal"),

  /** 启用追踪 */
  enableTracking: z
    .boolean()
    .default(true),

  /** 启用打开追踪 */
  trackOpens: z
    .boolean()
    .default(true),

  /** 启用点击追踪 */
  trackClicks: z
    .boolean()
    .default(true),

  /** 启用回复追踪 */
  trackReplies: z
    .boolean()
    .default(false),
})

export type EmailFormValues = z.infer<typeof emailSchema>

// ============ Email Template Schema ============

export const emailTemplateSchema = z.object({
  /** 模板名称 */
  name: z
    .string()
    .min(1, "模板名称不能为空")
    .max(100, "模板名称不能超过100个字符"),

  /** 模板类型 */
  type: z
    .enum(["marketing", "transactional", "notification", "welcome", "followup"])
    .default("marketing"),

  /** 模板内容 */
  content: z
    .string()
    .min(1, "模板内容不能为空"),

  /** 描述 */
  description: z
    .string()
    .max(500, "描述不能超过500个字符")
    .optional(),

  /** 是否默认模板 */
  isDefault: z
    .boolean()
    .default(false),
})

export type EmailTemplateFormValues = z.infer<typeof emailTemplateSchema>