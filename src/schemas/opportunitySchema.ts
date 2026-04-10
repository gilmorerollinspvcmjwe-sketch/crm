import { z } from "zod"

// ============ Opportunity Schema ============

export const opportunitySchema = z.object({
  /** 商机名称 */
  name: z
    .string()
    .min(1, "商机名称不能为空")
    .max(200, "商机名称不能超过200个字符"),

  /** 关联客户ID */
  customerId: z
    .string()
    .min(1, "请选择关联客户"),

  /** 关联客户名称 */
  customerName: z
    .string()
    .optional(),

  /** 关联联系人ID */
  contactId: z
    .string()
    .optional(),

  /** 关联联系人名称 */
  contactName: z
    .string()
    .optional(),

  /** 商机阶段 */
  stage: z
    .enum(["初步接触", "需求确认", "方案报价", "合同谈判", "成交", "失败"])
    .default("初步接触"),

  /** 优先级 */
  priority: z
    .enum(["低", "中", "高"])
    .default("中"),

  /** 金额 */
  amount: z
    .number()
    .min(0, "金额不能小于0")
    .default(0),

  /** 折扣比例 */
  discount: z
    .number()
    .min(0, "折扣不能小于0")
    .max(100, "折扣不能大于100")
    .default(0),

  /** 实际金额（成交时） */
  actualAmount: z
    .number()
    .min(0, "实际金额不能小于0")
    .optional(),

  /** 成功概率 (0-100) */
  probability: z
    .number()
    .min(0, "概率不能小于0")
    .max(100, "概率不能大于100")
    .default(0),

  /** 预计成交日期 */
  expectedCloseDate: z
    .string()
    .optional()
    .refine(
      (val) => !val || !isNaN(Date.parse(val)),
      "请输入有效的日期"
    ),

  /** 实际成交日期 */
  actualCloseDate: z
    .string()
    .optional()
    .refine(
      (val) => !val || !isNaN(Date.parse(val)),
      "请输入有效的日期"
    ),

  /** 负责人 */
  assignee: z
    .string()
    .max(100, "负责人名称不能超过100个字符")
    .optional(),

  /** 失败原因 */
  lostReason: z
    .string()
    .optional(),

  /** 备注 */
  notes: z
    .string()
    .max(2000, "备注不能超过2000个字符")
    .optional(),
})

export type OpportunityFormValues = z.infer<typeof opportunitySchema>

// ============ Opportunity Create Schema ============

export const opportunityCreateSchema = opportunitySchema.extend({
  name: z.string().min(1, "商机名称不能为空"),
  customerId: z.string().min(1, "请选择关联客户"),
})

export type OpportunityCreateFormValues = z.infer<typeof opportunityCreateSchema>

// ============ Opportunity Update Schema ============

export const opportunityUpdateSchema = opportunitySchema.partial()

export type OpportunityUpdateFormValues = z.infer<typeof opportunityUpdateSchema>