/**
 * Product Types - 产品相关类型定义
 * Product Types - Product-related type definitions
 */

import { z } from 'zod'

// ============================================================
// 产品分类 / Product Category
// ============================================================
export type ProductCategory = '软件' | '硬件' | '服务' | '解决方案'

// ============================================================
// 产品实体 / Product Entity
// ============================================================
export interface Product {
  // 基本信息 / Basic Info
  id: string
  name: string
  code: string
  category: ProductCategory
  categoryId?: string
  description?: string
  unit: string
  
  // 价格信息 / Pricing
  price: number
  standardPrice?: number
  cost: number
  costPrice?: number
  minDiscount?: number
  
  // 库存信息 / Inventory
  stock: number
  safetyStock?: number
  weight?: number
  shelfLife?: number
  origin?: string
  size?: string
  
  // 产品属性 / Product Attributes
  brand?: string
  model?: string
  spec?: string
  color?: string
  
  // 状态 / Status
  isActive: boolean
  isSellable?: boolean
  
  // 元数据 / Metadata
  createdAt: string
  updatedAt: string
  
  // 备注 / Remark
  remark?: string
}

// ============================================================
// 产品查询参数 / Product Query Params
// ============================================================
export interface ProductListParams {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  category?: ProductCategory
  isActive?: boolean
  minPrice?: number
  maxPrice?: number
  name?: string
  code?: string
  [key: string]: unknown
}

// ============================================================
// 产品表单验证 Schema / Product Form Validation Schema
// ============================================================
export const productSchema = z.object({
  name: z
    .string()
    .min(1, '产品名称不能为空')
    .max(200, '名称不能超过 200 个字符'),

  code: z
    .string()
    .min(1, '产品编码不能为空')
    .max(50, '编码不能超过 50 个字符')
    .regex(/^[A-Za-z0-9_-]+$/, '编码只能包含字母、数字、下划线和连字符'),

  category: z
    .enum(['软件', '硬件', '服务', '解决方案'])
    .optional(),

  categoryId: z
    .string()
    .optional(),

  description: z
    .string()
    .max(1000, '描述不能超过 1000 个字符')
    .optional(),

  unit: z
    .string()
    .max(20, '单位不能超过 20 个字符')
    .default('个'),

  brand: z
    .string()
    .max(100, '品牌不能超过 100 个字符')
    .optional(),

  model: z
    .string()
    .max(100, '型号不能超过 100 个字符')
    .optional(),

  spec: z
    .string()
    .max(200, '规格不能超过 200 个字符')
    .optional(),

  color: z
    .string()
    .max(50, '颜色不能超过 50 个字符')
    .optional(),

  standardPrice: z
    .number()
    .min(0, '价格不能小于 0')
    .optional(),

  costPrice: z
    .number()
    .min(0, '成本价不能小于 0')
    .optional(),

  minDiscount: z
    .number()
    .min(0, '折扣不能小于 0')
    .max(1, '折扣不能大于 1')
    .optional(),

  stock: z
    .number()
    .min(0, '库存不能小于 0')
    .default(0),

  safetyStock: z
    .number()
    .min(0, '安全库存不能小于 0')
    .optional(),

  weight: z
    .number()
    .min(0, '重量不能小于 0')
    .optional(),

  shelfLife: z
    .number()
    .min(0, '保质期不能小于 0')
    .optional(),

  origin: z
    .string()
    .max(100, '产地不能超过 100 个字符')
    .optional(),

  size: z
    .string()
    .max(100, '尺寸不能超过 100 个字符')
    .optional(),

  isActive: z
    .boolean()
    .default(true),

  isSellable: z
    .boolean()
    .default(true),

  remark: z
    .string()
    .max(500, '备注不能超过 500 个字符')
    .optional(),
})

export type ProductFormValues = z.infer<typeof productSchema>
