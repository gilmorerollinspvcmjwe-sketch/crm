/**
 * Pricebook Types - 价格手册相关类型定义
 * Pricebook Types - Pricebook-related type definitions
 */

import { z } from 'zod'

// ============================================================
// 折扣类型 / Discount Type
// ============================================================
export type PricebookDiscountType = 'percentage' | 'fixed'

// ============================================================
// 客户等级 / Customer Level
// ============================================================
export type CustomerLevel = 'A' | 'B' | 'C' | 'D'

// ============================================================
// 价格手册条目 / Pricebook Entry
// ============================================================
export interface PricebookEntry {
  id: string
  pricebookId: string
  productId: string
  productName?: string
  productCode?: string
  unitPrice: number
  costPrice?: number
  discount?: number
  minPrice?: number
  maxPrice?: number
  minQuantity?: number
  maxQuantity?: number
  startDate?: string
  endDate?: string
  isActive: boolean
  priority: number
  remark?: string
}

// ============================================================
// 价格手册实体 / Pricebook Entity
// ============================================================
export interface Pricebook {
  // 基本信息 / Basic Info
  id: string
  name: string
  code: string
  description?: string
  
  // 货币和折扣 / Currency & Discount
  currency: string
  discountType: PricebookDiscountType
  defaultDiscount?: number
  
  // 有效期 / Validity Period
  startDate?: string
  endDate?: string
  
  // 适用客户等级 / Applicable Customer Levels
  applicableLevels?: CustomerLevel[]
  
  // 状态 / Status
  isDefault: boolean
  isActive: boolean
  
  // 价格条目 / Price Entries
  entries: PricebookEntry[]
  
  // 元数据 / Metadata
  createdAt: string
  updatedAt: string
  
  // 备注 / Remark
  remark?: string
}

// ============================================================
// 价格手册查询参数 / Pricebook Query Params
// ============================================================
export interface PricebookListParams {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  isActive?: boolean
  isDefault?: boolean
  currency?: string
  name?: string
  code?: string
  [key: string]: unknown
}

// ============================================================
// 价格手册条目查询参数 / Pricebook Entry Query Params
// ============================================================
export interface PricebookEntryListParams {
  page?: number
  pageSize?: number
  pricebookId: string
  isActive?: boolean
  productId?: string
  [key: string]: unknown
}

// ============================================================
// 价格手册表单验证 Schema / Pricebook Form Validation Schema
// ============================================================
export const pricebookSchema = z.object({
  name: z
    .string()
    .min(1, '价格手册名称不能为空')
    .max(200, '名称不能超过 200 个字符'),

  code: z
    .string()
    .min(1, '价格手册编码不能为空')
    .max(50, '编码不能超过 50 个字符')
    .regex(/^[A-Za-z0-9_-]+$/, '编码只能包含字母、数字、下划线和连字符'),

  description: z
    .string()
    .max(500, '描述不能超过 500 个字符')
    .optional(),

  startDate: z
    .string()
    .optional()
    .refine(
      (val) => !val || !isNaN(Date.parse(val)),
      '请输入有效的日期'
    ),

  endDate: z
    .string()
    .optional()
    .refine(
      (val) => !val || !isNaN(Date.parse(val)),
      '请输入有效的日期'
    ),

  isDefault: z.boolean().default(false),

  isActive: z.boolean().default(true),

  currency: z
    .string()
    .max(10)
    .default('CNY'),

  discountType: z
    .enum(['percentage', 'fixed'])
    .default('percentage'),

  defaultDiscount: z
    .number()
    .min(0, '折扣不能小于 0')
    .max(1, '折扣不能大于 1')
    .optional(),

  applicableLevels: z
    .array(z.enum(['A', 'B', 'C', 'D']))
    .optional(),

  remark: z
    .string()
    .max(500, '备注不能超过 500 个字符')
    .optional(),
})

// ============================================================
// 价格手册条目表单验证 Schema / Pricebook Entry Form Validation Schema
// ============================================================
export const pricebookEntrySchema = z.object({
  pricebookId: z.string(),

  productId: z
    .string()
    .min(1, '请选择产品'),

  unitPrice: z
    .number()
    .min(0, '价格不能小于 0'),

  costPrice: z
    .number()
    .min(0, '成本价不能小于 0')
    .optional(),

  discount: z
    .number()
    .min(0, '折扣不能小于 0')
    .max(1, '折扣不能大于 1')
    .optional(),

  minPrice: z
    .number()
    .min(0, '最低价不能小于 0')
    .optional(),

  maxPrice: z
    .number()
    .min(0, '最高价不能小于 0')
    .optional(),

  minQuantity: z
    .number()
    .min(1, '最小数量不能小于 1')
    .optional(),

  maxQuantity: z
    .number()
    .min(1, '最大数量不能小于 1')
    .optional(),

  startDate: z
    .string()
    .optional()
    .refine(
      (val) => !val || !isNaN(Date.parse(val)),
      '请输入有效的日期'
    ),

  endDate: z
    .string()
    .optional()
    .refine(
      (val) => !val || !isNaN(Date.parse(val)),
      '请输入有效的日期'
    ),

  isActive: z
    .boolean()
    .default(true),

  priority: z
    .number()
    .min(0, '优先级不能小于 0')
    .default(1),

  remark: z
    .string()
    .max(500, '备注不能超过 500 个字符')
    .optional(),
})

export type PricebookFormValues = z.infer<typeof pricebookSchema>
export type PricebookEntryFormValues = z.infer<typeof pricebookEntrySchema>


