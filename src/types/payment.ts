/**
 * 回款模块类型定义
 */

/** 回款状态枚举 */
export enum PaymentStatus {
  PENDING = '待回款',
  PARTIAL = '部分回款',
  COMPLETED = '已回款',
  OVERDUE = '逾期'
}

/** 付款方式枚举 */
export enum PaymentMethod {
  BANK_TRANSFER = '银行转账',
  ALIPAY = '支付宝',
  WECHAT_PAY = '微信支付',
  CASH = '现金',
  CHECK = '支票',
  OTHER = '其他'
}

/** 发票状态枚举 */
export enum InvoiceStatus {
  NOT_REQUESTED = '未申请',
  PENDING = '待开票',
  INVOICED = '已开票',
  DELIVERED = '已送达'
}

/** 发票信息接口 */
export interface Invoice {
  id: string;
  invoiceNumber?: string;
  type: 'SPECIAL' | 'NORMAL'; // 专票/普票
  title: string;
  taxId: string;
  amount: number;
  status: InvoiceStatus;
  requestDate?: string;
  invoiceDate?: string;
  deliveryMethod?: string;
  remarks?: string;
}

/** 回款计划接口 */
export interface PaymentPlan {
  id: string;
  contractId: string;
  contractNumber: string;
  contractName: string;
  customerId: string;
  customerName: string;
  installmentNumber: number;
  plannedAmount: number;
  plannedDate: string;
  actualAmount?: number;
  actualDate?: string;
  status: PaymentStatus;
  paymentMethod?: PaymentMethod;
  paymentCondition?: string;
  remarks?: string;
  overdueDays?: number;
  createdAt: string;
  updatedAt: string;
}

/** 回款记录接口 */
export interface PaymentRecord {
  id: string;
  contractId: string;
  contractNumber: string;
  contractName: string;
  customerId: string;
  customerName: string;
  planId?: string;
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  paymentAccount?: string;
  invoiceId?: string;
  invoiceNumber?: string;
  status: 'VERIFIED' | 'PENDING_VERIFY' | 'REJECTED'; // 已核销/待核销/已驳回
  verifiedBy?: string;
  verifiedAt?: string;
  remarks?: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}

/** 应收账款接口 */
export interface AccountReceivable {
  id: string;
  contractId: string;
  contractNumber: string;
  contractName: string;
  customerId: string;
  customerName: string;
  totalAmount: number;
  paidAmount: number;
  unpaidAmount: number;
  overdueAmount: number;
  overdueDays: number;
  agingBucket: '0-30' | '31-60' | '61-90' | '91-180' | '180+';
  lastPaymentDate?: string;
  nextDueDate?: string;
}

/** 回款统计接口 */
export interface PaymentStats {
  totalPlanned: number;
  totalActual: number;
  completionRate: number;
  overdueAmount: number;
  overdueCount: number;
  thisMonthPlanned: number;
  thisMonthActual: number;
  byStatus: Record<PaymentStatus, number>;
  byPaymentMethod: Record<PaymentMethod, number>;
}

/** 回款趋势接口 */
export interface PaymentTrend {
  date: string;
  planned: number;
  actual: number;
  rate: number;
}

/** 回款筛选条件接口 */
export interface PaymentFilter {
  contractNumber?: string;
  contractName?: string;
  customerName?: string;
  status?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  dateFrom?: string;
  dateTo?: string;
  owner?: string;
}

/** 回款记录筛选条件接口 */
export interface PaymentRecordFilter {
  contractNumber?: string;
  customerName?: string;
  status?: 'VERIFIED' | 'PENDING_VERIFY' | 'REJECTED';
  paymentMethod?: PaymentMethod;
  dateFrom?: string;
  dateTo?: string;
}
