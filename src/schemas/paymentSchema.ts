import { z } from "zod"

// ============ Payment Schema ============

export const paymentSchema = z.object({
  /** 支付编码 */
  code: z
    .string()
    .min(1, "支付编码不能为空")
    .max(50, "支付编码不能超过50个字符")
    .regex(/^[A-Za-z0-9_-]+$/, "编码只能包含字母、数字、下划线和连字符"),

  /** 合同ID */
  contractId: z
    .string()
    .min(1, "请选择合同"),

  /** 客户ID */
  customerId: z
    .string()
    .min(1, "请选择客户"),

  /** 支付金额 */
  amount: z
    .number()
    .positive("支付金额必须大于0"),

  /** 已支付金额 */
  paidAmount: z
    .number()
    .nonnegative("已支付金额不能为负数")
    .default(0),

  /** 支付状态 */
  status: z
    .enum(["待支付", "部分支付", "已支付", "已退款", "已取消"])
    .default("待支付"),

  /** 支付方式 */
  method: z
    .enum(["银行转账", "现金", "支票", "支付宝", "微信", "其他"])
    .default("银行转账"),

  /** 应付日期 */
  dueDate: z
    .string()
    .min(1, "请选择应付日期")
    .refine(
      (val) => !isNaN(Date.parse(val)),
      "请输入有效的日期"
    ),

  /** 实付日期 */
  paidDate: z
    .string()
    .optional()
    .refine(
      (val) => !val || !isNaN(Date.parse(val)),
      "请输入有效的日期"
    ),

  /** 银行账户 */
  bankAccount: z
    .string()
    .max(100)
    .optional(),

  /** 收据编号 */
  receiptNo: z
    .string()
    .max(50)
    .optional(),

  /** 负责人 */
  assignee: z
    .string()
    .min(1, "请选择负责人"),

  /** 备注 */
  remark: z
    .string()
    .max(500, "备注不能超过500个字符")
    .optional(),
})

export type PaymentFormValues = z.infer<typeof paymentSchema>

// ============ Payment Create Schema ============

export const paymentCreateSchema = paymentSchema.extend({
  code: z.string().min(1, "支付编码不能为空"),
  contractId: z.string().min(1, "请选择合同"),
  customerId: z.string().min(1, "请选择客户"),
  amount: z.number().positive("支付金额必须大于0"),
  dueDate: z.string().min(1, "请选择应付日期"),
  assignee: z.string().min(1, "请选择负责人"),
})

export type PaymentCreateFormValues = z.infer<typeof paymentCreateSchema>

// ============ Payment Update Schema ============

export const paymentUpdateSchema = paymentSchema.partial()

export type PaymentUpdateFormValues = z.infer<typeof paymentUpdateSchema>