/**
 * 客户类型增强定义
 * 包含公海池功能和客户详细信息字段
 */

import type { Customer, CustomerStatus, CustomerScale, CustomerLevel, CustomerSource } from './api'

/**
 * 客户所属区域
 */
export type CustomerRegion = 
  | '华北'
  | '华东'
  | '华南'
  | '华中'
  | '西南'
  | '西北'
  | '东北'
  | '港澳台'
  | '海外'

/**
 * 行业细分
 */
export type CustomerIndustryDetail =
  | '互联网/软件'
  | '制造业'
  | '金融/保险'
  | '零售/批发'
  | '医疗/健康'
  | '教育/培训'
  | '房地产/建筑'
  | '物流/运输'
  | '能源/化工'
  | '文化/传媒'
  | '咨询/服务'
  | '政府/公共事业'
  | '农业/林业'
  | '电信/通信'
  | '交通/运输'
  | '酒店/旅游'
  | '其他'

/**
 * 公司规模详细定义
 */
export type CompanySize =
  | '微型 (1-20 人)'
  | '小型 (21-100 人)'
  | '中型 (101-500 人)'
  | '大型 (501-2000 人)'
  | '超大型 (2000 人以上)'

/**
 * 年营业额范围
 */
export type AnnualRevenue =
  | '100 万以下'
  | '100-500 万'
  | '500-1000 万'
  | '1000-5000 万'
  | '5000 万 -1 亿'
  | '1-5 亿'
  | '5-10 亿'
  | '10 亿以上'

/**
 * 扩展客户接口
 * 在基础 Customer 上增加详细字段
 */
export interface CustomerExtended extends Customer {
  // 客户基本信息
  shortName?: string // 客户简称
  type?: '企业' | '个人' | '政府' | '非营利组织' // 客户类型
  claimCount?: number // 被领取次数
  
  // 公司详细信息
  annualRevenue?: AnnualRevenue // 年营业额
  region?: CustomerRegion // 所属区域
  companySize?: CompanySize // 公司规模
  industryDetail?: CustomerIndustryDetail // 行业细分
  
  // 联系信息补充
  creditCode?: string // 统一社会信用代码
  legalPerson?: string // 法人
  fax?: string // 传真
  tags?: string[] // 标签
  rating?: number // 客户评级 1-5
  
  // 公海池相关
  isPublic?: boolean // 是否在公海池
  publicAt?: string // 进入公海池时间
  assignedAt?: string // 领取时间
  protectUntil?: string // 保护期截止时间
  lastActivityAt?: string // 最后活动时间
  
  // 跟进计划
  nextContactTime?: string // 下次联系时间
  
  // 补充信息
  sourceDetail?: string // 来源详细信息
  businessScope?: string // 经营范围
  mainProducts?: string // 主要产品
  competitorInfo?: string // 竞争对手信息
  decisionMaker?: string // 决策人
  budget?: string // 预算范围
  purchaseTimeframe?: string // 采购时间框架
  
  // 公海池原因
  publicReason?: string // 退回公海池的原因
}

/**
 * 公海池客户状态
 */
export type PublicPoolStatus = '可领取' | '保护期中' | '已领取' | '已退回'

/**
 * 公海池客户
 */
export interface PublicPoolCustomer extends CustomerExtended {
  isPublic: true
  publicAt: string
  previousOwner?: string // 原负责人
  publicReason?: string // 进入公海原因
  claimCount?: number // 被领取次数
}

/**
 * 公海池查询参数
 */
export interface PublicPoolQueryParams {
  page?: number
  pageSize?: number
  search?: string
  region?: CustomerRegion
  industry?: CustomerIndustryDetail
  companySize?: CompanySize
  minScore?: number
  maxScore?: number
  publicSince?: string // 进入公海时间范围
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

/**
 * 领取公海客户请求
 */
export interface ClaimCustomerRequest {
  customerId: string
  assignee: string
}

/**
 * 退回公海请求
 */
export interface ReturnToPoolRequest {
  customerId: string
  reason?: string
}

/**
 * 公海池配置
 */
export interface PublicPoolConfig {
  protectionDays: number // 保护期天数
  autoPublicEnabled: boolean // 是否启用自动进入公海
  autoPublicDays: number // 多少天无跟进自动进入公海
  maxClaimCount?: number // 最大被领取次数限制
  notificationEnabled: boolean // 是否启用通知
}

/**
 * 默认公海池配置
 */
export const DEFAULT_PUBLIC_POOL_CONFIG: PublicPoolConfig = {
  protectionDays: 7,
  autoPublicEnabled: true,
  autoPublicDays: 30,
  maxClaimCount: 3,
  notificationEnabled: true,
}

/**
 * 客户类型配置
 */
export const CUSTOMER_TYPE_CONFIG: Record<NonNullable<CustomerExtended['type']>, { label: string; color: string }> = {
  '企业': { label: '企业', color: 'bg-blue-500' },
  '个人': { label: '个人', color: 'bg-green-500' },
  '政府': { label: '政府', color: 'bg-red-500' },
  '非营利组织': { label: '非营利组织', color: 'bg-purple-500' },
}

/**
 * 区域配置
 */
export const REGION_CONFIG: Record<CustomerRegion, { label: string }> = {
  '华北': { label: '华北' },
  '华东': { label: '华东' },
  '华南': { label: '华南' },
  '华中': { label: '华中' },
  '西南': { label: '西南' },
  '西北': { label: '西北' },
  '东北': { label: '东北' },
  '港澳台': { label: '港澳台' },
  '海外': { label: '海外' },
}

/**
 * 行业细分配置
 */
export const INDUSTRY_DETAIL_CONFIG: Record<CustomerIndustryDetail, { label: string }> = {
  '互联网/软件': { label: '互联网/软件' },
  '制造业': { label: '制造业' },
  '金融/保险': { label: '金融/保险' },
  '零售/批发': { label: '零售/批发' },
  '医疗/健康': { label: '医疗/健康' },
  '教育/培训': { label: '教育/培训' },
  '房地产/建筑': { label: '房地产/建筑' },
  '物流/运输': { label: '物流/运输' },
  '能源/化工': { label: '能源/化工' },
  '文化/传媒': { label: '文化/传媒' },
  '咨询/服务': { label: '咨询/服务' },
  '政府/公共事业': { label: '政府/公共事业' },
  '农业/林业': { label: '农业/林业' },
  '电信/通信': { label: '电信/通信' },
  '交通/运输': { label: '交通/运输' },
  '酒店/旅游': { label: '酒店/旅游' },
  '其他': { label: '其他' },
}

/**
 * 公司规模配置
 */
export const COMPANY_SIZE_CONFIG: Record<CompanySize, { label: string }> = {
  '微型 (1-20 人)': { label: '微型' },
  '小型 (21-100 人)': { label: '小型' },
  '中型 (101-500 人)': { label: '中型' },
  '大型 (501-2000 人)': { label: '大型' },
  '超大型 (2000 人以上)': { label: '超大型' },
}

/**
 * 年营业额配置
 */
export const ANNUAL_REVENUE_CONFIG: Record<AnnualRevenue, { label: string }> = {
  '100 万以下': { label: '100 万以下' },
  '100-500 万': { label: '100-500 万' },
  '500-1000 万': { label: '500-1000 万' },
  '1000-5000 万': { label: '1000-5000 万' },
  '5000 万 -1 亿': { label: '5000 万 -1 亿' },
  '1-5 亿': { label: '1-5 亿' },
  '5-10 亿': { label: '5-10 亿' },
  '10 亿以上': { label: '10 亿以上' },
}

/**
 * 公海池状态配置
 */
export const PUBLIC_POOL_STATUS_CONFIG: Record<PublicPoolStatus, { label: string; color: string }> = {
  '可领取': { label: '可领取', color: 'bg-green-100 text-green-800 border-green-200' },
  '保护期中': { label: '保护期中', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  '已领取': { label: '已领取', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  '已退回': { label: '已退回', color: 'bg-gray-100 text-gray-800 border-gray-200' },
}

// ============================================================
// Import Types - For Excel/CSV Import Functionality
// ============================================================

/**
 * Raw customer data from imported file (before validation)
 */
export interface RawCustomerRow {
  [key: string]: string | number | undefined
  name?: string
  company?: string
  email?: string
  phone?: string
  industry?: string
  scale?: string
  level?: string
  source?: string
  website?: string
  address?: string
  description?: string
  status?: string
  score?: string | number
  assignee?: string
}

/**
 * Validated customer ready for import
 */
export interface ValidatedCustomer {
  name: string
  company: string
  email: string
  phone: string
  industry?: string
  scale?: CustomerScale
  level?: CustomerLevel
  source?: CustomerSource
  website?: string
  address?: string
  description?: string
  status?: CustomerStatus
  score?: number
  assignee?: string
}

/**
 * Import error for a specific row
 */
export interface ImportError {
  row: number
  errors: string[]
  rawData: RawCustomerRow
}

/**
 * Import result summary
 */
export interface ImportResult {
  total: number
  success: number
  failed: number
  validCustomers: ValidatedCustomer[]
  errors: ImportError[]
  duplicates?: { row: number; existingCustomerId: string; data: RawCustomerRow }[]
}

/**
 * Field mapping configuration
 */
export interface FieldMapping {
  name: string
  company: string
  email: string
  phone: string
  industry?: string
  scale?: string
  level?: string
  source?: string
  website?: string
  address?: string
  description?: string
  status?: string
  score?: string
  assignee?: string
}

/**
 * Import progress state
 */
export interface ImportProgress {
  stage: 'parsing' | 'validating' | 'importing' | 'complete' | 'error'
  current: number
  total: number
  message: string
}

/**
 * File type supported for import
 */
export type ImportFileType = 'excel' | 'csv'
