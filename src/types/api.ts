// ============================================================
// CRM API Types - Shared type definitions for all entities
// ============================================================

import type { Competitor, ContactRoleMapping } from './competitor'

export interface ApiResponse<T> {
  data: T
  message?: string
  code?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ApiError {
  message: string
  code?: string | number
  status?: number
}

export interface QueryParams {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  [key: string]: unknown
}

// ============================================================
// Customer Types
// ============================================================
export type CustomerStatus = '潜在' | '活跃' | '沉默' | '流失'
export type CustomerLevel = 'A' | 'B' | 'C' | 'D'
export type CustomerSource = 'marketing' | 'referral' | 'partner' | 'other'
export type CustomerScale = 'small' | 'medium' | 'large' | 'enterprise'

export interface Customer {
  id: string
  name: string
  company: string
  email: string
  phone: string
  status: CustomerStatus
  score: number
  createdAt: string
  lastContact: string
  assignee: string
  
  // 补充字段
  industry?: string // 行业
  scale?: CustomerScale // 规模（人数）
  level?: CustomerLevel // 客户等级（A/B/C/D）
  source?: CustomerSource // 来源（网站/电话/推荐/广告等）
  website?: string // 官网
  address?: string // 详细地址
  description?: string // 客户描述
}

export interface CustomerListParams extends QueryParams {
  status?: CustomerStatus
  assignee?: string
  minScore?: number
  maxScore?: number
}

// ============================================================
// Contact Types
// ============================================================
export type ContactType = '电话' | '邮件' | '微信' | '短信' | '面谈' | '其他'

export interface Contact {
  id: string
  customerId: string
  customerName?: string
  type: ContactType
  content: string
  contactDate: string
  duration?: number // minutes
  assignee: string
  createdAt: string
}

export interface ContactListParams extends QueryParams {
  customerId?: string
  type?: ContactType
  startDate?: string
  endDate?: string
}

// ============================================================
// Lead Types
// ============================================================
export type LeadStatus = '新建' | '跟进中' | '已转化' | '已放弃'
export type LeadSource = '官网' | '展会' | '推荐' | '广告' | '其他'
export type LeadLevel = 'A' | 'B' | 'C' | 'D'

export interface Lead {
  id: string
  name: string
  company?: string
  email: string
  phone: string
  source: LeadSource
  status: LeadStatus
  score: number
  level?: LeadLevel
  assignee: string
  createdAt: string
  convertedAt?: string
  convertedToCustomerId?: string
  convertedCustomerName?: string
  remark?: string
  content?: string
  budget?: string
  purchaseTimeframe?: string
  lastContactTime?: string
}

export interface LeadListParams extends QueryParams {
  status?: LeadStatus
  source?: LeadSource
  assignee?: string
}

// ============================================================
// Opportunity Types
// ============================================================
export type OpportunityStage = '初步接触' | '需求确认' | '方案报价' | '合同谈判' | '成交' | '失败'
export type OpportunityPriority = '低' | '中' | '高'

export interface Opportunity {
  id: string
  name: string
  customerId: string
  customerName?: string
  contactId?: string
  contactName?: string
  stage: OpportunityStage
  priority: OpportunityPriority
  amount: number
  probability: number // 0-100
  expectedCloseDate: string
  actualCloseDate?: string
  assignee: string
  createdAt: string
  updatedAt: string
  notes?: string
  
  // 竞争对手管理
  competitors?: Competitor[]
  
  // 联系人角色映射
  contactRoles?: ContactRoleMapping[]
}

export interface OpportunityListParams extends QueryParams {
  customerId?: string
  stage?: OpportunityStage
  priority?: OpportunityPriority
  assignee?: string
  minAmount?: number
  maxAmount?: number
}

// ============================================================
// Product Types
// ============================================================
export type ProductCategory = '软件' | '硬件' | '服务' | '解决方案'

export interface Product {
  id: string
  name: string
  category: ProductCategory
  code: string
  description: string
  price: number
  cost: number
  unit: string
  stock: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ProductListParams extends QueryParams {
  category?: ProductCategory
  isActive?: boolean
  minPrice?: number
  maxPrice?: number
}

// ============================================================
// Contract Types
// ============================================================
export type ContractStatus = '草稿' | '待审批' | '已审批' | '执行中' | '已完成' | '已取消'
export type ContractType = '销售' | '采购' | '服务' | '其他'
export type ContractPaymentMethod = '一次性' | '分期' | '里程碑'
export type Currency = '人民币' | '美元' | '欧元' | '其他'

export interface Contract {
  id: string
  name: string
  code: string
  customerId: string
  customerName?: string
  opportunityId?: string
  opportunityName?: string
  status: ContractStatus
  contractType?: ContractType
  paymentMethod?: ContractPaymentMethod
  currency?: Currency
  amount: number
  signedAmount?: number
  startDate: string
  endDate: string
  signedDate?: string
  signatory?: string
  assignee: string
  createdAt: string
  updatedAt: string
  remark?: string
}

export interface ContractListParams extends QueryParams {
  status?: ContractStatus
  customerId?: string
  assignee?: string
  startDate?: string
  endDate?: string
  minAmount?: number
  maxAmount?: number
}

// ============================================================
// Payment Types
// ============================================================
export type PaymentStatus = '待支付' | '部分支付' | '已支付' | '已退款' | '已取消'
export type PaymentMethod = '银行转账' | '现金' | '支票' | '支付宝' | '微信' | '其他'

export interface Payment {
  id: string
  code: string
  contractId: string
  contractName?: string
  customerId: string
  customerName?: string
  amount: number
  paidAmount: number
  status: PaymentStatus
  method: PaymentMethod
  dueDate: string
  paidDate?: string
  bankAccount?: string
  receiptNo?: string
  assignee: string
  createdBy?: string
  createdAt: string
  updatedAt: string
  remark?: string
}

export interface PaymentListParams extends QueryParams {
  status?: PaymentStatus
  contractId?: string
  customerId?: string
  method?: PaymentMethod
  startDate?: string
  endDate?: string
}

// ============================================================
// Order Types
// ============================================================
export type OrderStatus = '待确认' | '已确认' | '生产中' | '已发货' | '已完成' | '已取消'

export interface Order {
  id: string
  code: string
  contractId?: string
  contractName?: string
  customerId: string
  customerName?: string
  status: OrderStatus
  totalAmount: number
  items: OrderItem[]
  shippingAddress?: string
  shippingDate?: string
  receivedDate?: string
  assignee: string
  createdAt: string
  updatedAt: string
  remark?: string
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  productName: string
  productCode?: string
  quantity: number
  unitPrice: number
  discount: number
  amount: number
}

export interface OrderListParams extends QueryParams {
  status?: OrderStatus
  customerId?: string
  contractId?: string
  startDate?: string
  endDate?: string
}

// ============================================================
// Pricebook Types
// ============================================================
export type PricebookDiscountType = 'percentage' | 'fixed'

export interface Pricebook {
  id: string
  name: string
  code: string
  description?: string
  isDefault: boolean
  isActive: boolean
  currency: string
  discountType: PricebookDiscountType
  defaultDiscount?: number
  startDate?: string
  endDate?: string
  applicableLevels?: string[]
  entries: PricebookEntry[]
  createdAt: string
  updatedAt: string
  remark?: string
}

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

export interface PricebookListParams extends QueryParams {
  isActive?: boolean
  isDefault?: boolean
  currency?: string
}
