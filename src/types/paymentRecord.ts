// ============================================================
// Payment Record Extended Types - Reconciliation & Invoice
// ============================================================

import type { Payment, PaymentMethod } from "./api"

// Re-export PaymentMethod for convenience
export type { PaymentMethod }

/** 回款记录状态 */
export type PaymentRecordStatus = "待支付" | "支付中" | "已支付" | "已核销" | "已驳回" | "已取消"

// ============================================================
// Reconciliation Types - 核销管理
// ============================================================

/** 核销状态 */
export type ReconciliationStatus = "待核销" | "已核销" | "已驳回" | "部分核销"

/** 回款计划（用于核销） */
export interface PaymentPlan {
  /** 计划 ID */
  id: string
  /** 关联的回款记录 ID */
  paymentId: string
  /** 计划编号 */
  planCode: string
  /** 计划金额 */
  plannedAmount: number
  /** 已核销金额 */
  reconciledAmount: number
  /** 待核销金额 */
  pendingAmount: number
  /** 核销状态 */
  status: ReconciliationStatus
  /** 应付日期 */
  dueDate: string
  /** 实付日期 */
  actualDate?: string
  /** 备注 */
  remark?: string
  /** 创建时间 */
  createdAt: string
  /** 更新时间 */
  updatedAt: string
}

/** 核销记录 */
export interface Reconciliation {
  /** 核销记录 ID */
  id: string
  /** 关联的回款记录 ID */
  paymentId: string
  /** 关联的回款计划 ID（可多个） */
  paymentPlanId: string
  /** 核销类型 */
  type: "核销" | "驳回"
  /** 核销金额 */
  amount: number
  /** 核销状态 */
  status: ReconciliationStatus
  /** 操作人 */
  operator: string
  /** 操作时间 */
  operatedAt: string
  /** 备注 */
  remark?: string
  /** 驳回原因（仅驳回时） */
  rejectReason?: string
  /** 创建时间 */
  createdAt: string
}

/** 核销申请参数 */
export interface ReconciliationRequest {
  /** 回款计划 ID 列表 */
  paymentPlanIds: string[]
  /** 核销金额 */
  amount: number
  /** 备注 */
  remark?: string
}

/** 驳回申请参数 */
export interface RejectRequest {
  /** 核销记录 ID */
  reconciliationId: string
  /** 驳回原因 */
  rejectReason: string
  /** 备注 */
  remark?: string
}

/** 核销列表查询参数 */
export interface ReconciliationListParams {
  page?: number
  pageSize?: number
  paymentId?: string
  paymentPlanId?: string
  status?: ReconciliationStatus
  type?: "核销" | "驳回"
  startDate?: string
  endDate?: string
  operator?: string
}

// ============================================================
// Invoice Types - 发票管理
// ============================================================

/** 发票类型 */
export type InvoiceType = "专票" | "普票" | "无"

/** 发票状态 */
export type InvoiceStatus = "未开票" | "已开票" | "已寄送" | "已签收" | "已退回"

/** 发票信息 */
export interface Invoice {
  /** 发票 ID */
  id: string
  /** 关联的回款记录 ID */
  paymentId: string
  /** 发票类型 */
  type: InvoiceType
  /** 发票状态 */
  status: InvoiceStatus
  /** 发票号码 */
  invoiceNo?: string
  /** 发票代码 */
  invoiceCode?: string
  /** 开票金额 */
  amount: number
  /** 开票日期 */
  invoiceDate?: string
  /** 寄送日期 */
  sentDate?: string
  /** 签收日期 */
  receivedDate?: string
  /** 收件人 */
  recipient?: string
  /** 收件地址 */
  address?: string
  /** 快递公司 */
  courier?: string
  /** 快递单号 */
  trackingNo?: string
  /** 备注 */
  remark?: string
  /** 创建时间 */
  createdAt: string
  /** 更新时间 */
  updatedAt: string
}

/** 发票创建/更新参数 */
export interface InvoiceRequest {
  /** 关联的回款记录 ID */
  paymentId?: string
  /** 发票类型 */
  type: InvoiceType
  /** 发票状态 */
  status?: InvoiceStatus
  /** 发票号码 */
  invoiceNo?: string
  /** 发票代码 */
  invoiceCode?: string
  /** 开票金额 */
  amount: number
  /** 开票日期 */
  invoiceDate?: string
  /** 寄送日期 */
  sentDate?: string
  /** 收件人 */
  recipient?: string
  /** 收件地址 */
  address?: string
  /** 快递公司 */
  courier?: string
  /** 快递单号 */
  trackingNo?: string
  /** 备注 */
  remark?: string
}

/** 发票列表查询参数 */
export interface InvoiceListParams {
  page?: number
  pageSize?: number
  paymentId?: string
  type?: InvoiceType
  status?: InvoiceStatus
  startDate?: string
  endDate?: string
}

// ============================================================
// Extended Payment Type - 增强回款记录类型
// ============================================================

/** 增强后的回款记录（包含核销和发票信息） */
export interface PaymentRecord extends Payment {
  /** 关联的回款计划列表 */
  paymentPlans?: PaymentPlan[]
  /** 关联的核销记录列表 */
  reconciliations?: Reconciliation[]
  /** 关联的发票信息 */
  invoice?: Invoice
  /** 核销状态（汇总） */
  reconciliationStatus?: ReconciliationStatus
  /** 已核销总额 */
  totalReconciledAmount?: number
}

// ============================================================
// API Response Types
// ============================================================

import type { ApiResponse, PaginatedResponse } from "./api"

export type ReconciliationResponse = ApiResponse<Reconciliation>
export type ReconciliationListResponse = PaginatedResponse<Reconciliation>
export type InvoiceResponse = ApiResponse<Invoice>
export type InvoiceListResponse = PaginatedResponse<Invoice>
export type PaymentPlanResponse = ApiResponse<PaymentPlan>
export type PaymentPlanListResponse = PaginatedResponse<PaymentPlan>
