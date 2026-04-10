/**
 * 竞争对手管理模块类型定义
 * 用于商机中的竞争对手分析和跟踪
 */

// ============================================================
// 枚举类型
// ============================================================

/** 威胁程度枚举 */
export type ThreatLevel = '高' | '中' | '低'

/** 竞争状态枚举 */
export type CompetitorStatus = '活跃' | '潜在' | '已淘汰'

// ============================================================
// 竞争对手基本信息
// ============================================================

/**
 * 竞争对手接口
 * 描述在特定商机中与我方竞争的其他公司
 */
export interface Competitor {
  /** 竞争对手 ID - 唯一标识 */
  id: string
  
  /** 关联的商机 ID */
  opportunityId: string
  
  /** 竞争对手公司名称 */
  companyName: string
  
  /** 竞争对手联系人姓名 */
  contactName?: string
  
  /** 竞争对手联系人职位 */
  contactPosition?: string
  
  /** 竞争对手联系人电话 */
  contactPhone?: string
  
  /** 竞争对手联系人邮箱 */
  contactEmail?: string
  
  /** 优势分析 - 竞争对手的优势点 */
  strengths: string
  
  /** 劣势分析 - 竞争对手的劣势点 */
  weaknesses: string
  
  /** 威胁程度 - 高/中/低 */
  threatLevel: ThreatLevel
  
  /** 应对策略 - 针对该竞争对手的应对方案 */
  strategy: string
  
  /** 竞争状态 */
  status: CompetitorStatus
  
  /** 创建人 */
  createdBy: string
  
  /** 创建时间 */
  createdAt: string
  
  /** 最后修改人 */
  updatedBy?: string
  
  /** 最后修改时间 */
  updatedAt?: string
  
  /** 备注 */
  remark?: string
}

// ============================================================
// 竞争对手分析
// ============================================================

/**
 * 竞争对手分析接口
 * 用于综合评估所有竞争对手的整体竞争态势
 */
export interface CompetitorAnalysis {
  /** 关联的商机 ID */
  opportunityId: string
  
  /** 竞争对手列表 */
  competitors: Competitor[]
  
  /** 主要竞争对手 ID */
  primaryCompetitorId?: string
  
  /** 整体竞争态势分析 */
  overallAnalysis?: string
  
  /** 我方优势总结 */
  ourStrengths?: string
  
  /** 我方劣势总结 */
  ourWeaknesses?: string
  
  /** 建议的赢单策略 */
  winStrategy?: string
  
  /** 分析人 */
  analyzedBy?: string
  
  /** 分析时间 */
  analyzedAt?: string
  
  /** 最后更新时间 */
  updatedAt?: string
}

// ============================================================
// 查询参数
// ============================================================

export interface CompetitorListParams {
  /** 关联的商机 ID */
  opportunityId: string
  
  /** 威胁程度筛选 */
  threatLevel?: ThreatLevel
  
  /** 竞争状态筛选 */
  status?: CompetitorStatus
  
  /** 页码 */
  page?: number
  
  /** 每页条数 */
  pageSize?: number
  
  /** 排序字段 */
  sortBy?: string
  
  /** 排序方式 */
  sortOrder?: 'asc' | 'desc'
}

// ============================================================
// API 响应
// ============================================================

export interface CompetitorListResponse {
  /** 竞争对手列表 */
  data: Competitor[]
  
  /** 总条数 */
  total: number
  
  /** 当前页码 */
  page: number
  
  /** 每页条数 */
  pageSize: number
  
  /** 总页数 */
  totalPages: number
}

export interface CompetitorResponse {
  /** 竞争对手详情 */
  data: Competitor
  
  /** 消息 */
  message?: string
  
  /** 状态码 */
  code?: number
}

// ============================================================
// 联系人角色类型（从 contactPerson 复用）
// ============================================================

/** 联系人决策角色 - 采购决策中的角色 */
export type ContactRole = '决策者' | '影响者' | '使用者' | '把关者' | '其他'

/**
 * 联系人角色关联
 * 描述联系人在特定商机中的角色
 */
export interface ContactRoleMapping {
  /** 联系人 ID */
  contactId: string
  
  /** 联系人姓名 */
  contactName: string
  
  /** 联系人职位 */
  contactPosition?: string
  
  /** 联系人在商机中的角色 */
  role: ContactRole
  
  /** 影响力评分 (1-10) */
  influenceScore?: number
  
  /** 支持度 (支持/中立/反对) */
  supportLevel?: '支持' | '中立' | '反对'
  
  /** 备注 */
  remark?: string
  
  /** 创建时间 */
  createdAt?: string
  
  /** 最后更新时间 */
  updatedAt?: string
}
