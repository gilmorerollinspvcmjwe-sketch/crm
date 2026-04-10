/**
 * 线索模块类型定义 - 增强版
 * Lead Module Type Definitions - Enhanced with duplicate check and conversion
 */

import { Lead as LeadBasicType, LeadStatus, LeadSource, LeadLevel as ApiLeadLevel } from './api'

// ============================================
// 基础类型继承
// ============================================

export type { LeadStatus, LeadSource }
export type { LeadLevel as ApiLeadLevel } from './api'
export type LeadBasic = LeadBasicType

/** 线索级别（增强版） */
export type LeadLevel = '高' | '中' | '低'

// ============================================
// 增强线索接口
// ============================================

/** 线索意向产品 */
export interface IntentionProduct {
  /** 产品名称 */
  name: string
  /** 产品类别 */
  category?: string
  /** 需求描述 */
  description?: string
  /** 预算范围 */
  budget?: string
  /** 预计采购时间 */
  estimatedPurchaseTime?: string
}

/** 查重结果项 */
export interface DuplicateCheckItem {
  /** 重复线索 ID */
  id: string
  /** 线索名称 */
  name: string
  /** 公司名称 */
  company?: string
  /** 电话 */
  phone: string
  /** 邮箱 */
  email: string
  /** 线索状态 */
  status: LeadStatus
  /** 负责人 */
  assignee: string
  /** 创建时间 */
  createdAt: string
  /** 匹配类型 */
  matchType: 'phone' | 'email' | 'name'
  /** 相似度 (0-100) */
  similarity: number
}

/** 查重结果 */
export interface DuplicateCheckResult {
  /** 是否有重复 */
  hasDuplicates: boolean
  /** 重复项列表 */
  duplicates: DuplicateCheckItem[]
  /** 最高相似度 */
  maxSimilarity: number
  /** 匹配统计 */
  matchStats: {
    /** 电话匹配数量 */
    phoneMatches: number
    /** 邮箱匹配数量 */
    emailMatches: number
    /** 名称匹配数量 */
    nameMatches: number
  }
}

/** 转化目标类型 */
export type ConversionTargetType = 'customer' | 'contact' | 'opportunity'

/** 转化结果 */
export interface ConversionResult {
  /** 是否成功 */
  success: boolean
  /** 转化后的客户 ID（如果创建） */
  customerId?: string
  /** 转化后的联系人 ID（如果创建） */
  contactId?: string
  /** 转化后的商机 ID（如果创建） */
  opportunityId?: string
  /** 线索 ID */
  leadId: string
  /** 转化时间 */
  convertedAt: string
  /** 消息 */
  message?: string
}

/** 增强线索接口 */
export interface Lead extends Omit<LeadBasic, 'level'> {
  /** 线索级别（高/中/低） */
  level?: LeadLevel
  
  /** 意向产品信息 */
  intentionProduct?: IntentionProduct
  
  /** 转化结果 */
  conversionResult?: ConversionResult
}

// ============================================
// 查重相关类型
// ============================================

/** 查重请求参数 */
export interface LeadDuplicateCheckParams {
  /** 线索 ID（可选，用于编辑时排除自身） */
  leadId?: string
  /** 电话 */
  phone?: string
  /** 邮箱 */
  email?: string
  /** 名称 */
  name?: string
  /** 公司名称 */
  company?: string
}

/** 查重方式 */
export type DuplicateCheckMethod = 'phone' | 'email' | 'name'

/** 重复线索处理方式 */
export type DuplicateHandlingAction = 
  | 'merge'        // 合并
  | 'skip'         // 跳过
  | 'override'     // 覆盖
  | 'create_new'   // 创建新线索

// ============================================
// 转化相关类型
// ============================================

/** 字段映射配置 */
export interface FieldMapping {
  /** 源字段名 */
  sourceField: string
  /** 目标字段名 */
  targetField: string
  /** 字段标签 */
  label: string
  /** 源字段值 */
  sourceValue?: string
  /** 目标字段值预览 */
  targetValue?: string
}

/** 转化配置 */
export interface ConversionConfig {
  /** 是否创建客户 */
  createCustomer: boolean
  /** 是否创建联系人 */
  createContact: boolean
  /** 是否创建商机 */
  createOpportunity: boolean
  /** 字段映射 */
  fieldMappings: FieldMapping[]
}

/** 转化请求参数 */
export interface LeadConversionRequest {
  /** 线索 ID */
  leadId: string
  /** 转化配置 */
  config: ConversionConfig
  /** 处理方式（发现重复时） */
  duplicateHandling?: DuplicateHandlingAction
}

// ============================================
// API 响应类型
// ============================================

/** 查重响应 */
export interface LeadDuplicateCheckResponse {
  /** 查重结果 */
  data: DuplicateCheckResult
  /** 消息 */
  message?: string
  /** 状态码 */
  code?: number
}

/** 转化响应 */
export interface LeadConversionResponse {
  /** 转化结果 */
  data: ConversionResult
  /** 消息 */
  message?: string
  /** 状态码 */
  code?: number
}

// ============================================
// 查询参数
// ============================================

export interface LeadListParams {
  /** 页码 */
  page?: number
  /** 每页条数 */
  pageSize?: number
  /** 搜索关键词 */
  search?: string
  /** 状态筛选 */
  status?: LeadStatus
  /** 来源筛选 */
  source?: LeadSource
  /** 级别筛选 */
  level?: '高' | '中' | '低'
  /** 负责人筛选 */
  assignee?: string
  /** 排序字段 */
  sortBy?: string
  /** 排序方式 */
  sortOrder?: 'asc' | 'desc'
  [key: string]: unknown
}

/** 线索列表响应 */
export interface LeadListResponse {
  /** 线索列表 */
  data: Lead[]
  /** 总条数 */
  total: number
  /** 当前页码 */
  page: number
  /** 每页条数 */
  pageSize: number
  /** 总页数 */
  totalPages: number
}

/** 线索详情响应 */
export interface LeadResponse {
  /** 线索详情 */
  data: Lead
  /** 消息 */
  message?: string
  /** 状态码 */
  code?: number
}
