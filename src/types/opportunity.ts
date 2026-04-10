/**
 * 商机模块类型定义 - 增强版
 * Opportunity Module Type Definitions - Enhanced with Quote and Decision Process
 */

import { QuoteStatus } from './cpq'

// ============================================
// 基础枚举（从 api.ts 复用）
// ============================================

export type OpportunityStage = '初步接触' | '需求确认' | '方案报价' | '合同谈判' | '成交' | '失败'
export type OpportunityPriority = '低' | '中' | '高'

// ============================================
// 决策流程相关类型
// ============================================

/** 决策步骤状态 */
export type DecisionStepStatus = 'pending' | 'completed' | 'skipped'

/** 决策步骤接口 */
export interface DecisionStep {
  /** 步骤 ID */
  id: string
  /** 步骤名称 */
  name: string
  /** 步骤描述 */
  description?: string
  /** 负责人 ID */
  ownerId: string
  /** 负责人姓名 */
  ownerName: string
  /** 状态 */
  status: DecisionStepStatus
  /** 计划完成时间 */
  plannedDate?: string
  /** 实际完成时间 */
  completedAt?: string
  /** 备注 */
  notes?: string
  /** 创建时间 */
  createdAt: string
  /** 更新时间 */
  updatedAt: string
  /** 排序顺序 */
  sortOrder: number
}

/** 决策流程接口 */
export interface DecisionProcess {
  /** 流程 ID */
  id: string
  /** 流程名称 */
  name: string
  /** 流程描述 */
  description?: string
  /** 步骤列表 */
  steps: DecisionStep[]
  /** 当前步骤 ID */
  currentStepId?: string
  /** 流程状态 */
  status: 'active' | 'completed' | 'paused' | 'cancelled'
  /** 开始时间 */
  startedAt?: string
  /** 完成时间 */
  completedAt?: string
  /** 创建时间 */
  createdAt: string
  /** 更新时间 */
  updatedAt: string
}

// ============================================
// 商机接口（增强版）
// ============================================

/** 商机接口 - 包含报价单关联和决策流程 */
export interface Opportunity {
  /** 商机 ID */
  id: string
  /** 商机名称 */
  name: string
  /** 客户 ID */
  customerId: string
  /** 客户名称 */
  customerName?: string
  /** 联系人 ID */
  contactId?: string
  /** 联系人姓名 */
  contactName?: string
  /** 商机阶段 */
  stage: OpportunityStage
  /** 优先级 */
  priority: OpportunityPriority
  /** 预计金额 */
  amount: number
  /** 成功概率 (0-100) */
  probability: number
  /** 预计关闭日期 */
  expectedCloseDate: string
  /** 实际关闭日期 */
  actualCloseDate?: string
  /** 负责人 ID */
  assignee: string
  /** 创建时间 */
  createdAt: string
  /** 更新时间 */
  updatedAt: string
  /** 备注 */
  notes?: string
  
  // ========== 新增字段 ==========
  
  /** 关联的报价单 ID 列表 */
  quoteIds?: string[]
  
  /** 决策流程 */
  decisionProcess?: DecisionProcess
  
  /** 自定义字段 */
  customFields?: Record<string, unknown>
}

/** 商机列表查询参数 */
export interface OpportunityListParams {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  customerId?: string
  stage?: OpportunityStage
  priority?: OpportunityPriority
  assignee?: string
  minAmount?: number
  maxAmount?: number
  [key: string]: unknown
}

// ============================================
// 决策流程模板类型
// ============================================

/** 决策步骤模板 */
export interface DecisionStepTemplate {
  /** 模板 ID */
  id: string
  /** 步骤名称 */
  name: string
  /** 步骤描述 */
  description?: string
  /** 默认负责人角色 */
  defaultOwnerRole?: string
  /** 预计天数（相对于流程开始） */
  plannedDaysFromStart: number
  /** 是否必需步骤 */
  isRequired: boolean
  /** 排序顺序 */
  sortOrder: number
}

/** 决策流程模板 */
export interface DecisionProcessTemplate {
  /** 模板 ID */
  id: string
  /** 模板名称 */
  name: string
  /** 模板描述 */
  description?: string
  /** 适用阶段 */
  applicableStages: OpportunityStage[]
  /** 步骤模板列表 */
  steps: DecisionStepTemplate[]
  /** 是否激活 */
  isActive: boolean
  /** 创建时间 */
  createdAt: string
  /** 更新时间 */
  updatedAt: string
}

// ============================================
// 决策流程操作类型
// ============================================

/** 创建决策步骤请求 */
export interface CreateDecisionStepRequest {
  /** 步骤名称 */
  name: string
  /** 步骤描述 */
  description?: string
  /** 负责人 ID */
  ownerId: string
  /** 计划完成时间 */
  plannedDate?: string
  /** 备注 */
  notes?: string
  /** 排序顺序 */
  sortOrder: number
}

/** 更新决策步骤请求 */
export interface UpdateDecisionStepRequest {
  /** 步骤 ID */
  stepId: string
  /** 步骤名称 */
  name?: string
  /** 步骤描述 */
  description?: string
  /** 负责人 ID */
  ownerId?: string
  /** 状态 */
  status?: DecisionStepStatus
  /** 完成时间 */
  completedAt?: string
  /** 备注 */
  notes?: string
}

/** 创建决策流程请求 */
export interface CreateDecisionProcessRequest {
  /** 流程名称 */
  name: string
  /** 流程描述 */
  description?: string
  /** 步骤列表 */
  steps: CreateDecisionStepRequest[]
  /** 模板 ID（可选） */
  templateId?: string
}

/** 决策流程统计 */
export interface DecisionProcessStats {
  /** 总步骤数 */
  totalSteps: number
  /** 已完成步骤数 */
  completedSteps: number
  /** 进行中步骤数 */
  pendingSteps: number
  /** 完成率 */
  completionRate: number
  /** 平均完成时间（天） */
  avgCompletionDays?: number
  /** 预计剩余天数 */
  estimatedRemainingDays?: number
}
