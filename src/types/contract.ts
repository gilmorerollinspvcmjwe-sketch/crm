/**
 * 合同管理模块类型定义
 * Contract Management Module Type Definitions
 */

// ============================================
// 合同状态枚举
// ============================================

/** 合同状态 */
export enum ContractStatus {
  DRAFT = 'draft',              // 草稿
  PENDING_APPROVAL = 'pending_approval',  // 待审批
  APPROVED = 'approved',        // 已审批
  REJECTED = 'rejected',        // 已拒绝
  EXECUTING = 'executing',      // 执行中
  COMPLETED = 'completed',      // 已完成
  TERMINATED = 'terminated',    // 已终止
}

/** 合同状态标签映射 */
export const ContractStatusLabels: Record<ContractStatus, string> = {
  [ContractStatus.DRAFT]: '草稿',
  [ContractStatus.PENDING_APPROVAL]: '待审批',
  [ContractStatus.APPROVED]: '已审批',
  [ContractStatus.REJECTED]: '已拒绝',
  [ContractStatus.EXECUTING]: '执行中',
  [ContractStatus.COMPLETED]: '已完成',
  [ContractStatus.TERMINATED]: '已终止',
}

/** 合同状态颜色配置 */
export const ContractStatusColors: Record<ContractStatus, string> = {
  [ContractStatus.DRAFT]: 'bg-gray-400',
  [ContractStatus.PENDING_APPROVAL]: 'bg-blue-400',
  [ContractStatus.APPROVED]: 'bg-green-500',
  [ContractStatus.REJECTED]: 'bg-red-500',
  [ContractStatus.EXECUTING]: 'bg-purple-500',
  [ContractStatus.COMPLETED]: 'bg-teal-500',
  [ContractStatus.TERMINATED]: 'bg-orange-500',
}

// ============================================
// 合同类型枚举
// ============================================

/** 合同类型 */
export enum ContractType {
  SALES = 'sales',              // 销售合同
  PURCHASE = 'purchase',        // 采购合同
  SERVICE = 'service',          // 服务合同
  OTHER = 'other',              // 其他合同
}

/** 合同类型标签映射 */
export const ContractTypeLabels: Record<ContractType, string> = {
  [ContractType.SALES]: '销售',
  [ContractType.PURCHASE]: '采购',
  [ContractType.SERVICE]: '服务',
  [ContractType.OTHER]: '其他',
}

/** 合同类型颜色配置 */
export const ContractTypeColors: Record<ContractType, string> = {
  [ContractType.SALES]: 'bg-blue-500',
  [ContractType.PURCHASE]: 'bg-green-500',
  [ContractType.SERVICE]: 'bg-purple-500',
  [ContractType.OTHER]: 'bg-gray-500',
}

// ============================================
// 付款方式枚举
// ============================================

/** 付款方式 */
export enum PaymentMethod {
  ONE_TIME = 'one_time',        // 一次性付款
  INSTALLMENT = 'installment',   // 分期付款
  MILESTONE = 'milestone',       // 里程碑付款
}

/** 付款方式标签映射 */
export const PaymentMethodLabels: Record<PaymentMethod, string> = {
  [PaymentMethod.ONE_TIME]: '一次性',
  [PaymentMethod.INSTALLMENT]: '分期',
  [PaymentMethod.MILESTONE]: '里程碑',
}

/** 付款方式颜色配置 */
export const PaymentMethodColors: Record<PaymentMethod, string> = {
  [PaymentMethod.ONE_TIME]: 'bg-green-500',
  [PaymentMethod.INSTALLMENT]: 'bg-blue-500',
  [PaymentMethod.MILESTONE]: 'bg-purple-500',
}

// ============================================
// 币种枚举
// ============================================

/** 币种 */
export enum Currency {
  CNY = 'CNY',                  // 人民币
  USD = 'USD',                  // 美元
  EUR = 'EUR',                  // 欧元
  OTHER = 'other',              // 其他
}

/** 币种符号 */
export const CurrencySymbols: Record<Currency, string> = {
  [Currency.CNY]: '¥',
  [Currency.USD]: '$',
  [Currency.EUR]: '€',
  [Currency.OTHER]: '',
}

/** 币种代码 */
export const CurrencyCodes: Record<Currency, string> = {
  [Currency.CNY]: '156',
  [Currency.USD]: '840',
  [Currency.EUR]: '978',
  [Currency.OTHER]: '',
}

/** 币种标签 */
export const CurrencyLabels: Record<Currency, string> = {
  [Currency.CNY]: '人民币',
  [Currency.USD]: '美元',
  [Currency.EUR]: '欧元',
  [Currency.OTHER]: '其他',
}

// ============================================
// 审批相关类型
// ============================================

/** 审批操作 */
export enum ApprovalAction {
  APPROVE = 'approve',    // 同意
  REJECT = 'reject',      // 拒绝
}

/** 审批状态 */
export enum ApprovalStatus {
  PENDING = 'pending',    // 待审批
  APPROVED = 'approved',  // 已同意
  REJECTED = 'rejected',  // 已拒绝
}

/** 审批人信息 */
export interface Approver {
  id: string
  name: string
  email?: string
  department?: string
  role?: string
}

/** 审批记录 */
export interface ContractApproval {
  id: string
  contractId: string
  approverId: string
  approverName: string
  approverRole?: string
  action: ApprovalAction
  status: ApprovalStatus
  comments?: string
  createdAt: string
  updatedAt?: string
  level?: number  // 审批层级（支持多级审批）
}

/** 审批流程配置 */
export interface ApprovalWorkflow {
  id: string
  name: string
  levels: ApprovalLevel[]
}

/** 审批层级 */
export interface ApprovalLevel {
  level: number
  approvers: Approver[]
  approvalType: 'any' | 'all'  // 任意一人审批 / 所有人审批
}

/** 提交审批请求 */
export interface SubmitApprovalRequest {
  contractId: string
  approverIds: string[]  // 审批人 ID 列表
  comments?: string
}

/** 审批操作请求 */
export interface ApprovalActionRequest {
  approvalId: string
  action: ApprovalAction
  comments?: string
}

// ============================================
// 附件相关类型
// ============================================

/** 附件类型 */
export enum AttachmentType {
  CONTRACT = 'contract',        // 合同文件
  APPENDIX = 'appendix',        // 附录
  CERTIFICATE = 'certificate',  // 资质证书
  OTHER = 'other',              // 其他
}

/** 附件类型标签映射 */
export const AttachmentTypeLabels: Record<AttachmentType, string> = {
  [AttachmentType.CONTRACT]: '合同文件',
  [AttachmentType.APPENDIX]: '附录',
  [AttachmentType.CERTIFICATE]: '资质证书',
  [AttachmentType.OTHER]: '其他',
}

/** 合同附件 */
export interface ContractAttachment {
  id: string
  contractId: string
  fileName: string
  originalName: string
  fileType: string  // MIME type
  fileSize: number  // 字节
  fileUrl: string
  downloadUrl?: string
  type: AttachmentType
  description?: string
  uploadedBy: string
  uploadedByName: string
  createdAt: string
  updatedAt?: string
}

/** 上传附件请求 */
export interface UploadAttachmentRequest {
  contractId: string
  file: File
  type?: AttachmentType
  description?: string
}

// ============================================
// 合同主类型
// ============================================

/** 合同基本信息 */
export interface Contract {
  id: string
  contractNo: string  // 合同编号
  name: string        // 合同名称
  type?: ContractType       // 合同类型
  contractType?: ContractType  // 合同类型（别名，兼容旧代码）
  status: ContractStatus
  amount: number      // 合同金额
  currency?: Currency // 币种
  customerId?: string
  customerName?: string
  opportunityId?: string
  opportunityName?: string
  startDate?: string  // 生效日期
  endDate?: string    // 到期日期
  description?: string
  terms?: string      // 条款
  paymentTerms?: string  // 付款条件
  paymentMethod?: PaymentMethod  // 支付方式
  deliveryDate?: string  // 交付日期
  createdBy: string
  createdAt: string
  updatedAt: string
  assignee?: string
  assigneeName?: string
  // 审批相关
  approvals?: ContractApproval[]
  currentApprovalLevel?: number
  // 附件
  attachments?: ContractAttachment[]
}

/** 合同创建请求 */
export interface CreateContractRequest {
  name: string
  type?: ContractType
  contractType?: ContractType
  amount: number
  currency?: Currency
  paymentMethod?: PaymentMethod
  customerId?: string
  opportunityId?: string
  startDate?: string
  endDate?: string
  description?: string
  terms?: string
  paymentTerms?: string
  deliveryDate?: string
}

/** 合同更新请求 */
export interface UpdateContractRequest {
  id: string
  name?: string
  type?: ContractType
  contractType?: ContractType
  amount?: number
  currency?: Currency
  paymentMethod?: PaymentMethod
  startDate?: string
  endDate?: string
  description?: string
  terms?: string
  paymentTerms?: string
  deliveryDate?: string
}

/** 合同查询参数 */
export interface ContractQueryParams {
  status?: ContractStatus
  customerId?: string
  opportunityId?: string
  search?: string
  createdBy?: string
  assignee?: string
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

/** 合同列表响应 */
export interface ContractListResponse {
  data: Contract[]
  total: number
  page: number
  pageSize: number
}

// ============================================
// 回款计划相关类型
// ============================================

/** 回款计划状态 */
export type PaymentPlanStatus = '待回款' | '部分回款' | '已完成' | '逾期'

/** 回款计划 */
export interface PaymentPlan {
  id: string
  contractId: string
  planCode: string        // 计划编号
  planAmount: number      // 计划金额
  planDate: string        // 计划日期
  actualAmount?: number   // 实际金额
  actualDate?: string     // 实际日期
  status: PaymentPlanStatus
  remark?: string
  createdAt: string
  updatedAt: string
}

/** 回款计划列表参数 */
export interface PaymentPlanListParams {
  contractId: string
  page?: number
  pageSize?: number
  status?: PaymentPlanStatus
}

/** 回款计划创建参数 */
export interface PaymentPlanCreateParams {
  contractId: string
  planCode: string
  planAmount: number
  planDate: string
  remark?: string
}

/** 回款计划更新参数 */
export interface PaymentPlanUpdateParams {
  id: string
  planAmount?: number
  planDate?: string
  actualAmount?: number
  actualDate?: string
  status?: PaymentPlanStatus
  remark?: string
}

// ============================================
// 增强后的合同类型（包含所有扩展字段）
// ============================================

/** 增强后的合同基本信息（包含所有基础字段） */
export interface ContractExtended extends Contract {
  /** 客户联系人 ID */
  contactPersonId?: string
  /** 客户联系人姓名 */
  contactPersonName?: string
  /** 客户联系人职位 */
  contactPersonTitle?: string
  /** 客户联系人电话 */
  contactPersonPhone?: string
  /** 客户联系人邮箱 */
  contactPersonEmail?: string
  /** 签约日期 */
  signingDate?: string
  /** 付款条件说明 */
  paymentCondition?: string
  /** 交付方式 */
  deliveryMethod?: string
  /** 验收标准 */
  acceptanceCriteria?: string
  /** 违约责任 */
  liabilityClause?: string
  /** 保密条款 */
  confidentialityClause?: string
  /** 合同附件数量 */
  attachmentCount?: number
  /** 回款计划数量 */
  paymentPlanCount?: number
  /** 已回款总额 */
  totalPaidAmount?: number
  /** 待回款总额 */
  totalUnpaidAmount?: number
  /** 回款完成率 */
  paymentCompletionRate?: number
  /** 关联的商机阶段 */
  opportunityStage?: string
  /** 合同来源 */
  source?: '手动创建' | '商机转化' | '报价单转化' | '导入'
  /** 优先级 */
  priority?: '高' | '中' | '低'
  /** 标签 */
  tags?: string[]
  /** 自定义字段 */
  customFields?: Record<string, any>
}

/** 合同类型扩展（用于表单和筛选） */
export interface ContractTypeExtended {
  /** 合同类型 */
  contractType: ContractType
  /** 支付方式 */
  paymentMethod: PaymentMethod
  /** 币种 */
  currency: Currency
  /** 合同金额 */
  amount: number
  /** 含税标志 */
  taxIncluded?: boolean
  /** 税率 */
  taxRate?: number
  /** 不含税金额 */
  amountExcludingTax?: number
  /** 税额 */
  taxAmount?: number
}

/** 合同创建请求（增强版） */
export interface CreateContractRequestExtended extends CreateContractRequest {
  /** 客户联系人 ID */
  contactPersonId?: string
  /** 签约日期 */
  signingDate?: string
  /** 付款条件说明 */
  paymentCondition?: string
  /** 交付方式 */
  deliveryMethod?: string
  /** 验收标准 */
  acceptanceCriteria?: string
  /** 优先级 */
  priority?: '高' | '中' | '低'
  /** 标签 */
  tags?: string[]
}

/** 合同更新请求（增强版） */
export interface UpdateContractRequestExtended extends UpdateContractRequest {
  /** 客户联系人 ID */
  contactPersonId?: string
  /** 签约日期 */
  signingDate?: string
  /** 付款条件说明 */
  paymentCondition?: string
  /** 交付方式 */
  deliveryMethod?: string
  /** 验收标准 */
  acceptanceCriteria?: string
  /** 优先级 */
  priority?: '高' | '中' | '低'
  /** 标签 */
  tags?: string[]
}

/** 合同查询参数（增强版） */
export interface ContractQueryParamsExtended extends ContractQueryParams {
  /** 合同类型筛选 */
  contractType?: ContractType
  /** 支付方式筛选 */
  paymentMethod?: PaymentMethod
  /** 币种筛选 */
  currency?: Currency
  /** 优先级筛选 */
  priority?: '高' | '中' | '低'
  /** 标签筛选 */
  tags?: string[]
  /** 签约日期范围 - 开始 */
  signingDateStart?: string
  /** 签约日期范围 - 结束 */
  signingDateEnd?: string
}
