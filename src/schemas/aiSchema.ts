import { z } from "zod"

// ============ AI Config Schema ============

export const aiConfigSchema = z.object({
  /** AI 模型选择 */
  model: z
    .enum(["gpt-4", "gpt-4-turbo", "gpt-3.5-turbo", "claude-3", "custom"])
    .default("gpt-4-turbo"),

  /** API Key */
  apiKey: z
    .string()
    .optional(),

  /** 自定义 API Endpoint */
  customEndpoint: z
    .string()
    .optional(),

  /** 最大 Tokens */
  maxTokens: z
    .number()
    .min(100)
    .max(4000)
    .default(2000),

  /** 温度参数 */
  temperature: z
    .number()
    .min(0)
    .max(2)
    .default(0.7),

  /** 启用 AI 建议 */
  enableAISuggestions: z
    .boolean()
    .default(true),

  /** 启用自动摘要 */
  enableAutoSummary: z
    .boolean()
    .default(true),

  /** 启用智能回复 */
  enableSmartReply: z
    .boolean()
    .default(false),

  /** 启用客户分析 */
  enableCustomerAnalysis: z
    .boolean()
    .default(true),

  /** 启用商机预测 */
  enableOpportunityPrediction: z
    .boolean()
    .default(false),

  /** 每日请求限额 */
  dailyRequestLimit: z
    .number()
    .min(10)
    .max(10000)
    .default(1000),

  /** 启用请求日志 */
  enableRequestLog: z
    .boolean()
    .default(true),
})

export type AIConfigFormValues = z.input<typeof aiConfigSchema>

// ============ AI Prompt Template Schema ============

export const aiPromptTemplateSchema = z.object({
  /** 模板名称 */
  name: z
    .string()
    .min(1, "模板名称不能为空")
    .max(100, "模板名称不能超过100个字符"),

  /** 模板类型 */
  type: z
    .enum(["customer_analysis", "opportunity_prediction", "email_draft", "summary", "custom"])
    .default("custom"),

  /** 模板内容 */
  content: z
    .string()
    .min(1, "模板内容不能为空")
    .max(5000, "模板内容不能超过5000个字符"),

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

export type AIPromptTemplateFormValues = z.infer<typeof aiPromptTemplateSchema>