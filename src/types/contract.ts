/**
 * 合同模块类型定义
 */

/** 合同状态枚举 */
export enum ContractStatus {
  DRAFT = '草稿',
  PENDING_APPROVAL = '审批中',
  ACTIVE = '已生效',
  ARCHIVED = '已归档',
  TERMINATED = '已终止'
}

/** 合同类型枚举 */
export enum ContractType {
  SALES = '销售合同',
  PURCHASE = '采购合同',
  SERVICE = '服务合同',
  OTHER = '其他'
}

/** 付款方式枚举 */
export enum PaymentMethod {
  ONE_TIME = '一次性',
  INSTALLMENT = '分期',
  MILESTONE = '按里程碑'
}

/** 币种枚举 */
export enum Currency {
  CNY = '人民币',
  USD = '美元',
  EUR = '欧元',
  OTHER = '其他'
}

/** 回款计划接口 */
export interface PaymentPlan {
  id: string;
  installmentNumber: number;
  plannedAmount: number;
  plannedDate: string;
  actualAmount?: number;
  actualDate?: string;
  status: 'PENDING' | 'PARTIAL' | 'COMPLETED' | 'OVERDUE';
  paymentCondition?: string;
}

/** 合同条款接口 */
export interface ContractTerms {
  paymentMethod: PaymentMethod;
  paymentTerms: string;
  deliveryTerms: string;
  warrantyPeriod: number;
  liabilityForBreach: string;
}

/** 合同接口 */
export interface Contract {
  id: string;
  contractNumber: string;
  name: string;
  type: ContractType;
  customerId: string;
  customerName: string;
  opportunityId?: string;
  opportunityName?: string;
  amount: number;
  currency: Currency;
  signingDate: string;
  effectiveDate: string;
  expirationDate?: string;
  contractPeriod?: number;
  terms: ContractTerms;
  deliveryContent: string;
  deliveryDate?: string;
  status: ContractStatus;
  owner: string;
  ownerName: string;
  signerOurSide: string;
  signerCustomerSide?: string;
  paymentPlans: PaymentPlan[];
  attachments: string[];
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
  archivedBy?: string;
}

/** 合同统计接口 */
export interface ContractStats {
  totalCount: number;
  totalAmount: number;
  monthlyAmount: number;
  byStatus: Record<ContractStatus, number>;
}

/** 合同筛选条件接口 */
export interface ContractFilter {
  name?: string;
  contractNumber?: string;
  customerName?: string;
  status?: ContractStatus;
  owner?: string;
  dateFrom?: string;
  dateTo?: string;
}
