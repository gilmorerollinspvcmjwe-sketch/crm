import { z } from "zod"

// ============ PaymentPlan Type Enums ============

export const paymentPlanStatusOptions = ["待回款", "部分回款", "已完成", "逾期"] as const

export type PaymentPlanStatus = typeof paymentPlanStatusOptions[number]

// ============ PaymentPlan Schema ============

export const paymentPlanSchema = z.object({
  /** 计划编号 */
  planCode: z
    .string()
    .min(1, "计划编号不能为空")
    .max(50, "计划编号不能超过 50 个字符"),

  /** 计划金额 */
  planAmount: z
    .number()
    .positive("计划金额必须大于 0"),

  /** 计划日期 */
  planDate: z
    .string()
    .min(1, "请选择计划日期")
    .refine(
      (val) => !isNaN(Date.parse(val)),
      "请输入有效的日期"
    ),

  /** 实际金额 */
  actualAmount: z
    .number()
    .nonnegative("实际金额不能为负数")
    .optional(),

  /** 实际日期 */
  actualDate: z
    .string()
    .optional()
    .refine(
      (val) => !val || !isNaN(Date.parse(val)),
      "请输入有效的日期"
    ),

  /** 状态 */
  status: z
    .enum(paymentPlanStatusOptions)
    .default("待回款"),

  /** 备注 */
  remark: z
    .string()
    .max(500, "备注不能超过 500 个字符")
    .optional(),
})

export type PaymentPlanFormValues = z.infer<typeof paymentPlanSchema>

// ============ PaymentPlan Create Schema ============

export const paymentPlanCreateSchema = paymentPlanSchema.extend({
  planCode: z.string().min(1, "计划编号不能为空"),
  planAmount: z.number().positive("计划金额必须大于 0"),
  planDate: z.string().min(1, "请选择计划日期"),
})

export type PaymentPlanCreateFormValues = z.infer<typeof paymentPlanCreateSchema>

// ============ PaymentPlan Update Schema ============

export const paymentPlanUpdateSchema = paymentPlanSchema.partial()

export type PaymentPlanUpdateFormValues = z.infer<typeof paymentPlanUpdateSchema>
