import { z } from "zod"

// ============ Order Item Schema ============

export const orderItemSchema = z.object({
  /** 产品ID */
  productId: z
    .string()
    .min(1, "请选择产品"),

  /** 产品名称 */
  productName: z
    .string()
    .min(1, "产品名称不能为空"),

  /** 产品编码 */
  productCode: z
    .string()
    .optional(),

  /** 数量 */
  quantity: z
    .number()
    .int("数量必须为整数")
    .positive("数量必须大于0"),

  /** 单价 */
  unitPrice: z
    .number()
    .positive("单价必须大于0"),

  /** 折扣 */
  discount: z
    .number()
    .min(0, "折扣不能小于0")
    .max(1, "折扣不能大于1")
    .default(0),

  /** 金额 */
  amount: z
    .number()
    .nonnegative("金额不能为负数"),
})

export type OrderItemFormValues = z.infer<typeof orderItemSchema>

// ============ Order Schema ============

export const orderSchema = z.object({
  /** 订单编码 */
  code: z
    .string()
    .min(1, "订单编码不能为空")
    .max(50, "订单编码不能超过50个字符")
    .regex(/^[A-Za-z0-9_-]+$/, "编码只能包含字母、数字、下划线和连字符"),

  /** 合同ID */
  contractId: z
    .string()
    .optional(),

  /** 客户ID */
  customerId: z
    .string()
    .min(1, "请选择客户"),

  /** 订单状态 */
  status: z
    .enum(["待确认", "已确认", "生产中", "已发货", "已完成", "已取消"])
    .default("待确认"),

  /** 订单总额 */
  totalAmount: z
    .number()
    .positive("订单总额必须大于0"),

  /** 订单明细 */
  items: z
    .array(orderItemSchema)
    .min(1, "至少添加一个产品"),

  /** 收货地址 */
  shippingAddress: z
    .string()
    .max(500, "收货地址不能超过500个字符")
    .optional(),

  /** 发货日期 */
  shippingDate: z
    .string()
    .optional()
    .refine(
      (val) => !val || !isNaN(Date.parse(val)),
      "请输入有效的日期"
    ),

  /** 收货日期 */
  receivedDate: z
    .string()
    .optional()
    .refine(
      (val) => !val || !isNaN(Date.parse(val)),
      "请输入有效的日期"
    ),

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

export type OrderFormValues = z.infer<typeof orderSchema>

// ============ Order Create Schema ============

export const orderCreateSchema = orderSchema.extend({
  code: z.string().min(1, "订单编码不能为空"),
  customerId: z.string().min(1, "请选择客户"),
  items: z.array(orderItemSchema).min(1, "至少添加一个产品"),
  assignee: z.string().min(1, "请选择负责人"),
})

export type OrderCreateFormValues = z.infer<typeof orderCreateSchema>

// ============ Order Update Schema ============

export const orderUpdateSchema = orderSchema.partial()

export type OrderUpdateFormValues = z.infer<typeof orderUpdateSchema>