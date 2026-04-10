import { z } from "zod"

// ============ Product Schema ============

export const productSchema = z.object({
  /** 产品名称 */
  name: z
    .string()
    .min(1, "产品名称不能为空")
    .max(200, "产品名称不能超过200个字符"),

  /** 产品编码 */
  code: z
    .string()
    .min(1, "产品编码不能为空")
    .max(50, "产品编码不能超过50个字符")
    .regex(/^[A-Za-z0-9_-]+$/, "编码只能包含字母、数字、下划线和连字符"),

  /** 产品分类 */
  categoryId: z
    .string()
    .min(1, "请选择产品分类")
    .optional(),

  /** 单位 */
  unit: z
    .string()
    .max(20, "单位不能超过20个字符")
    .default("个"),

  /** 标准价格 */
  standardPrice: z
    .number()
    .positive("标准价格必须大于0")
    .optional()
    .or(z.string()),

  /** 成本价 */
  costPrice: z
    .number()
    .nonnegative("成本价不能为负数")
    .optional()
    .or(z.string()),

  /** 折扣下限 */
  minDiscount: z
    .number()
    .min(0, "折扣不能小于0")
    .max(1, "折扣不能大于1")
    .optional(),

  /** 产品描述 */
  description: z
    .string()
    .max(2000, "描述不能超过2000个字符")
    .optional(),

  /** 产品规格 */
  spec: z
    .string()
    .max(500, "规格不能超过500个字符")
    .optional(),

  /** 型号 */
  model: z
    .string()
    .max(100, "型号不能超过100个字符")
    .optional(),

  /** 品牌 */
  brand: z
    .string()
    .max(100, "品牌不能超过100个字符")
    .optional(),

  /** 产地 */
  origin: z
    .string()
    .max(100, "产地不能超过100个字符")
    .optional(),

  /** 重量（kg） */
  weight: z
    .number()
    .positive()
    .optional()
    .or(z.string()),

  /** 颜色 */
  color: z
    .string()
    .max(50, "颜色不能超过50个字符")
    .optional(),

  /** 尺寸 */
  size: z
    .string()
    .max(100, "尺寸不能超过100个字符")
    .optional(),

  /** 库存数量 */
  stock: z
    .number()
    .int("库存数量必须为整数")
    .nonnegative("库存数量不能为负数")
    .optional()
    .or(z.string()),

  /** 安全库存 */
  safetyStock: z
    .number()
    .int("安全库存必须为整数")
    .nonnegative("安全库存不能为负数")
    .optional()
    .or(z.string()),

  /** 是否上架 */
  isActive: z
    .boolean()
    .default(true),

  /** 是否可销售 */
  isSellable: z
    .boolean()
    .default(true),

  /** 备注 */
  remark: z
    .string()
    .max(500, "备注不能超过500个字符")
    .optional(),

  /** 保质期（天） */
  shelfLife: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .or(z.string()),
})

export type ProductFormValues = z.infer<typeof productSchema>

// ============ Product Create Schema ============

export const productCreateSchema = productSchema.extend({
  name: z.string().min(1, "产品名称不能为空"),
  code: z.string().min(1, "产品编码不能为空"),
})

export type ProductCreateFormValues = z.infer<typeof productCreateSchema>

// ============ Product Update Schema ============

export const productUpdateSchema = productSchema.partial()

export type ProductUpdateFormValues = z.infer<typeof productUpdateSchema>
