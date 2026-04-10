import { z } from "zod"

// ============ Lead Schema ============

export const leadSchema = z.object({
  /** 线索名称 */
  name: z
    .string()
    .min(1, "线索名称不能为空")
    .max(200, "线索名称不能超过200个字符"),

  /** 公司名称 */
  company: z
    .string()
    .max(200, "公司名称不能超过200个字符")
    .optional(),

  /** 邮箱 */
  email: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      "请输入有效的邮箱地址"
    ),

  /** 手机号 */
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^1[3-9]\d{9}$/.test(val),
      "请输入有效的手机号码"
    ),

  /** 线索来源 */
  source: z
    .enum(["官网", "展会", "推荐", "广告", "其他"])
    .describe("请选择线索来源"),

  /** 线索状态 */
  status: z
    .enum(["新建", "跟进中", "已转化", "已放弃"])
    .default("新建"),

  /** 评分 (0-100) */
  score: z
    .number()
    .min(0, "评分不能小于0")
    .max(100, "评分不能大于100")
    .default(0),

  /** 负责人 */
  assignee: z
    .string()
    .max(100, "负责人名称不能超过100个字符")
    .optional(),

  /** 备注 */
  remark: z
    .string()
    .max(1000, "备注不能超过1000个字符")
    .optional(),
})

export type LeadFormValues = z.infer<typeof leadSchema>

// ============ Lead Create Schema ============

export const leadCreateSchema = leadSchema.extend({
  name: z.string().min(1, "线索名称不能为空"),
  source: z.enum(["官网", "展会", "推荐", "广告", "其他"]).describe("请选择线索来源"),
})

export type LeadCreateFormValues = z.infer<typeof leadCreateSchema>

// ============ Lead Update Schema ============

export const leadUpdateSchema = leadSchema.partial()

export type LeadUpdateFormValues = z.infer<typeof leadUpdateSchema>