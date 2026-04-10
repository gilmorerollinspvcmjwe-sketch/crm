import { z } from "zod"

// ============ Contract Type Enums ============

export const contractTypeOptions = ["销售", "采购", "服务", "其他"] as const
export const paymentMethodOptions = ["一次性", "分期", "里程碑"] as const
export const currencyOptions = ["人民币", "美元", "欧元", "其他"] as const

export type ContractType = typeof contractTypeOptions[number]
export type PaymentMethod = typeof paymentMethodOptions[number]
export type Currency = typeof currencyOptions[number]

// ============ Contract Schema ============

export const contractSchema = z.object({
  /** 合同名称 */
  name: z
    .string()
    .min(1, "合同名称不能为空")
    .max(200, "合同名称不能超过200个字符"),

  /** 合同编码 */
  code: z
    .string()
    .min(1, "合同编码不能为空")
    .max(50, "合同编码不能超过50个字符")
    .regex(/^[A-Za-z0-9_-]+$/, "编码只能包含字母、数字、下划线和连字符"),

  /** 客户ID */
  customerId: z
    .string()
    .min(1, "请选择客户"),

  /** 商机ID */
  opportunityId: z
    .string()
    .optional(),

  /** 合同状态 */
  status: z
    .enum(["草稿", "待审批", "已审批", "执行中", "已完成", "已取消"])
    .default("草稿"),

  /** 合同类型 */
  contractType: z
    .enum(contractTypeOptions)
    .optional(),

  /** 付款方式 */
  paymentMethod: z
    .enum(paymentMethodOptions)
    .optional(),

  /** 币种 */
  currency: z
    .enum(currencyOptions)
    .default("人民币"),

  /** 合同金额 */
  amount: z
    .number()
    .positive("合同金额必须大于0"),

  /** 已签署金额 */
  signedAmount: z
    .number()
    .nonnegative("已签署金额不能为负数")
    .optional(),

  /** 开始日期 */
  startDate: z
    .string()
    .min(1, "请选择开始日期")
    .refine(
      (val) => !isNaN(Date.parse(val)),
      "请输入有效的日期"
    ),

  /** 结束日期 */
  endDate: z
    .string()
    .min(1, "请选择结束日期")
    .refine(
      (val) => !isNaN(Date.parse(val)),
      "请输入有效的日期"
    ),

  /** 签署日期 */
  signedDate: z
    .string()
    .optional()
    .refine(
      (val) => !val || !isNaN(Date.parse(val)),
      "请输入有效的日期"
    ),

  /** 签署人 */
  signatory: z
    .string()
    .max(100)
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

export type ContractFormValues = z.infer<typeof contractSchema>

// ============ Contract Create Schema ============

export const contractCreateSchema = contractSchema.extend({
  name: z.string().min(1, "合同名称不能为空"),
  code: z.string().min(1, "合同编码不能为空"),
  customerId: z.string().min(1, "请选择客户"),
  amount: z.number().positive("合同金额必须大于0"),
  startDate: z.string().min(1, "请选择开始日期"),
  endDate: z.string().min(1, "请选择结束日期"),
  assignee: z.string().min(1, "请选择负责人"),
})

export type ContractCreateFormValues = z.infer<typeof contractCreateSchema>

// ============ Contract Update Schema ============

export const contractUpdateSchema = contractSchema.partial()

export type ContractUpdateFormValues = z.infer<typeof contractUpdateSchema>