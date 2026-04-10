/**
 * CPQ 报价管理模块类型定义
 * Configure Price Quote Module Type Definitions
 */

// ============================================
// 枚举定义
// ============================================

/** 报价单状态枚举 */
export enum QuoteStatus {
  DRAFT = 'draft',        // 草稿
  SENT = 'sent',          // 已发送
  ACCEPTED = 'accepted',  // 已接受
  REJECTED = 'rejected',  // 已拒绝
  EXPIRED = 'expired',    // 已过期
  REVISED = 'revised',    // 已修订
}

/** 报价单状态标签映射 */
export const QuoteStatusLabels: Record<QuoteStatus, string> = {
  [QuoteStatus.DRAFT]: '草稿',
  [QuoteStatus.SENT]: '已发送',
  [QuoteStatus.ACCEPTED]: '已接受',
  [QuoteStatus.REJECTED]: '已拒绝',
  [QuoteStatus.EXPIRED]: '已过期',
  [QuoteStatus.REVISED]: '已修订',
}

/** 产品类别枚举 */
export enum ProductCategory {
  SOFTWARE = 'software',     // 软件
  HARDWARE = 'hardware',     // 硬件
  SERVICE = 'service',       // 服务
  TRAINING = 'training',     // 培训
  MAINTENANCE = 'maintenance', // 维护
}

/** 产品类别标签映射 */
export const ProductCategoryLabels: Record<ProductCategory, string> = {
  [ProductCategory.SOFTWARE]: '软件',
  [ProductCategory.HARDWARE]: '硬件',
  [ProductCategory.SERVICE]: '服务',
  [ProductCategory.TRAINING]: '培训',
  [ProductCategory.MAINTENANCE]: '维护',
}

/** 折扣类型枚举 */
export enum DiscountType {
  PERCENTAGE = 'percentage', // 百分比折扣
  FIXED = 'fixed',          // 固定金额折扣
}

// ============================================
// 基础接口定义
// ============================================

/** 产品接口 */
export interface Product {
  id: string
  name: string
  category: ProductCategory
  unitPrice: number
  unit: string
  description: string
  sku: string
  inStock: boolean
  // 规格参数
  specification?: string   // 规格
  model?: string           // 型号
  // 价格信息
  costPrice?: number       // 成本价
  basePrice?: number       // 基础价格（兼容旧代码）
  // 库存信息
  stockQuantity?: number   // 库存数量
  stockWarning?: number     // 库存预警阈值
  // 状态
  status?: 'active' | 'inactive' // 上架/下架，默认为 active
}

/** 产品选择类型 - 用于报价创建时选择产品 */
export interface ProductSelection {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  unit?: string
  discount?: number         // 折扣百分比 0-100
  discountType?: DiscountType
  notes?: string
}

/** 报价产品明细接口 (QuoteItem) */
export interface QuoteItem {
  id: string
  quoteId: string
  productId: string
  productName: string
  productSku?: string
  quantity: number
  unit: string
  unitPrice: number        // 单价
  discount: number          // 折扣百分比 0-100
  discountType: DiscountType
  discountAmount: number    // 折扣金额
  subtotal: number          // 小计（单价 * 数量 - 折扣）
  taxRate: number           // 税率百分比
  tax: number               // 税费
  total: number             // 总计
  amount?: number           // 金额（兼容旧代码，别名 subtotal）
  sortOrder: number         // 排序顺序
  notes?: string            // 行备注
  customFields?: Record<string, unknown>
}

/** 价格计算结果 */
export interface PricingResult {
  subtotal: number           // 小计
  totalDiscount: number      // 总折扣金额
  discountPercent: number    // 总折扣百分比
  totalTax: number          // 总税费
  grandTotal: number        // 总计
  items: QuoteItem[]        // 明细项
  appliedDiscounts: Array<{
    itemId: string
    type: DiscountType
    value: number
    amount: number
  }>
  currency: string          // 货币
  roundingRule?: 'up' | 'down' | 'nearest' | 'none'
  roundedGrandTotal?: number
}

/** 报价模板类型 */
export interface QuoteTemplate {
  id: string
  name: string
  description?: string
  isDefault: boolean
  isActive: boolean
  // 模板内容
  headerContent?: string     // 页眉内容
  footerContent?: string     // 页脚内容
  termsAndConditions?: string // 条款和条件
  paymentTerms?: string      // 付款条款
  // 样式配置
  theme?: {
    primaryColor?: string
    secondaryColor?: string
    fontFamily?: string
    fontSize?: string
  }
  layout?: {
    showLogo?: boolean
    showCompanyInfo?: boolean
    showCustomerInfo?: boolean
    showItemDetails?: boolean
    showPricingSummary?: boolean
    showTerms?: boolean
  }
  // 默认值
  defaultValidDays?: number  // 默认有效期天数
  defaultCurrency?: string
  defaultTaxRate?: number
  // 元数据
  createdBy: string
  createdAt: string
  updatedAt: string
}

/** 报价单接口 */
export interface Quote {
  id: string
  quoteNumber: string       // 报价单号
  customerId: string
  customerName: string
  contactId?: string
  contactName?: string
  opportunityId?: string
  opportunityName?: string
  status: QuoteStatus
  validUntil: string        // 有效期至
  validFrom?: string        // 有效期开始（兼容旧代码）
  items: QuoteItem[]        // 报价项列表
  // 价格汇总
  subtotal: number          // 小计总和
  totalDiscount: number     // 总折扣金额
  discountAmount?: number   // 折扣金额（兼容旧代码）
  totalTax: number          // 总税费
  taxAmount?: number        // 税费（兼容旧代码）
  taxRate?: number          // 税率（兼容旧代码）
  grandTotal: number        // 总计
  total?: number            // 总计（兼容旧代码）
  // 附加信息
  notes?: string            // 备注
  terms?: string            // 条款
  internalNotes?: string    // 内部备注
  // 模板
  templateId?: string
  template?: QuoteTemplate
  // 审批
  approvalStatus?: 'pending' | 'approved' | 'rejected'
  approvedBy?: string
  approvedAt?: string
  // 版本控制
  version: number
  parentQuoteId?: string    // 原报价单ID（用于修订）
  // 转换
  convertedToContractId?: string // 转合同后的合同 ID
  convertedAt?: string
  // 元数据
  createdBy: string
  createdByName: string
  createdAt: string
  updatedAt: string
  customFields?: Record<string, unknown>
}

/** 报价筛选条件接口 */
export interface QuoteFilter {
  quoteNumber?: string
  customerName?: string
  customerId?: string
  status?: QuoteStatus
  createdBy?: string
  opportunityId?: string
  dateFrom?: string
  dateTo?: string
  minAmount?: number
  maxAmount?: number
}

/** 报价统计接口 */
export interface QuoteStats {
  total: number
  byStatus: Record<QuoteStatus, number>
  totalAmount: number
  convertedCount: number
  avgDealSize: number
  winRate: number
}

/** 报价创建/更新请求 */
export interface QuoteRequest {
  customerId: string
  contactId?: string
  opportunityId?: string
  validUntil: string
  items: ProductSelection[]
  notes?: string
  terms?: string
  templateId?: string
  discount?: number         // 整单折扣
  discountType?: DiscountType
}

/** 报价版本历史 */
export interface QuoteVersion {
  id: string
  quoteId: string
  version: number
  status: QuoteStatus
  grandTotal: number
  createdAt: string
  createdBy: string
  createdByName: string
  changeNotes?: string
}