import { z } from "zod"

// ============ Pricebook Entry Schema ============

export const pricebookEntrySchema = z.object({
  /** 价格手册ID */
  pricebookId: z
    .string()
    .min(1, "请选择价格手册"),

  /** 产品ID */
  productId: z
    .string()
    .min(1, "请选择产品"),

  /** 产品编码 */
  productCode: z
    .string()
    .max(50)
    .optional(),

  /** 产品名称 */
  productName: z
    .string()
    .max(200)
    .optional(),

  /** 销售价格 */
  unitPrice: z
    .number()
    .positive("销售价格必须大于0"),

  /** 成本价 */
  costPrice: z
    .number()
    .nonnegative()
    .optional(),

  /** 折扣率 */
  discount: z
    .number()
    .min(0, "折扣不能小于0")
    .max(1, "折扣不能大于1")
    .optional(),

  /** 最低价格 */
  minPrice: z
    .number()
    .nonnegative()
    .optional(),

  /** 最高价格 */
  maxPrice: z
    .number()
    .nonnegative()
    .optional(),

  /** 生效日期 */
  startDate: z
    .string()
    .optional()
    .refine(
      (val) => !val || !isNaN(Date.parse(val)),
      "请输入有效的日期"
    ),

  /** 失效日期 */
  endDate: z
    .string()
    .optional()
    .refine(
      (val) => !val || !isNaN(Date.parse(val)),
      "请输入有效的日期"
    ),

  /** 最小数量 */
  minQuantity: z
    .number()
    .int()
    .nonnegative()
    .optional(),

  /** 最大数量 */
  maxQuantity: z
    .number()
    .int()
    .nonnegative()
    .optional(),

  /** 是否启用 */
  isActive: z.boolean().default(true),

  /** 优先级 */
  priority: z
    .number()
    .int()
    .nonnegative()
    .default(0),

  /** 备注 */
  remark: z
    .string()
    .max(500)
    .optional(),
})

export type PricebookEntryFormValues = z.infer<typeof pricebookEntrySchema>

// ============ Pricebook Schema ============

export const pricebookSchema = z.object({
  /** 价格手册名称 */
  name: z
    .string()
    .min(1, "价格手册名称不能为空")
    .max(200, "名称不能超过200个字符"),

  /** 价格手册编码 */
  code: z
    .string()
    .min(1, "价格手册编码不能为空")
    .max(50, "编码不能超过50个字符")
    .regex(/^[A-Za-z0-9_-]+$/, "编码只能包含字母、数字、下划线和连字符"),

  /** 描述 */
  description: z
    .string()
    .max(500, "描述不能超过500个字符")
    .optional(),

  /** 是否默认 */
  isDefault: z.boolean().default(false),

  /** 是否启用 */
  isActive: z.boolean().default(true),

  /** 货币 */
  currency: z
    .string()
    .max(10)
    .default("CNY"),

  /** 折扣类型 */
  discountType: z
    .enum(["percentage", "fixed"])
    .default("percentage"),

  /** 默认折扣 */
  defaultDiscount: z
    .number()
    .min(0, "折扣不能小于0")
    .max(1, "折扣不能大于1")
    .optional(),

  /** 生效日期 */
  startDate: z
    .string()
    .optional()
    .refine(
      (val) => !val || !isNaN(Date.parse(val)),
      "请输入有效的日期"
    ),

  /** 失效日期 */
  endDate: z
    .string()
    .optional()
    .refine(
      (val) => !val || !isNaN(Date.parse(val)),
      "请输入有效的日期"
    ),

  /** 适用客户等级 */
  applicableLevels: z
    .array(z.enum(["A", "B", "C", "D"]))
    .optional(),

  /** 备注 */
  remark: z
    .string()
    .max(500, "备注不能超过500个字符")
    .optional(),
})

export type PricebookFormValues = z.infer<typeof pricebookSchema>

// ============ Pricebook Create Schema ============

export const pricebookCreateSchema = pricebookSchema.extend({
  name: z.string().min(1, "价格手册名称不能为空"),
  code: z.string().min(1, "价格手册编码不能为空"),
})

export type PricebookCreateFormValues = z.infer<typeof pricebookCreateSchema>

// ============ Pricebook Update Schema ============

export const pricebookUpdateSchema = pricebookSchema.partial()

export type PricebookUpdateFormValues = z.infer<typeof pricebookUpdateSchema>