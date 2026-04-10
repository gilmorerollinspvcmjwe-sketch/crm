/**
 * 报价管理 Mock 数据
 * 包含 40 条报价数据，覆盖不同状态、客户和金额
 */

import { QuoteStatus } from '@/types/cpq'

// ============ 扩展报价接口 ============

export interface QuoteProduct {
  id: string
  productId: string
  productName: string
  productCode: string
  quantity: number
  unitPrice: number
  discount: number
  amount: number
}

export interface MockQuote {
  id: string
  quoteNo: string
  customerId: string
  customerName: string
  opportunityId?: string
  opportunityName?: string
  status: QuoteStatus
  products: QuoteProduct[]
  subtotal: number
  discount: number
  tax: number
  total: number
  validUntil: string
  createdAt: string
  updatedAt: string
  createdBy: string
  assignee: string
  remark?: string
  terms?: string
  deliveryDate?: string
  paymentTerms?: string
}

// ============ 配置 ============

export const quoteStatusConfig: Record<QuoteStatus, { label: string; color: string }> = {
  [QuoteStatus.DRAFT]: { label: '草稿', color: 'bg-gray-400' },
  [QuoteStatus.SENT]: { label: '已发送', color: 'bg-blue-400' },
  [QuoteStatus.ACCEPTED]: { label: '已接受', color: 'bg-green-500' },
  [QuoteStatus.REJECTED]: { label: '已拒绝', color: 'bg-red-500' },
  [QuoteStatus.EXPIRED]: { label: '已过期', color: 'bg-orange-400' },
  [QuoteStatus.REVISED]: { label: '已修订', color: 'bg-purple-400' },
}

// ============ Mock 数据 ============

export const mockQuotes: MockQuote[] = [
  {
    id: 'QT-001',
    quoteNo: 'QT-2024-001',
    customerId: 'CUST-001',
    customerName: '北京科技创新有限公司',
    opportunityId: 'OPP-001',
    opportunityName: '企业 CRM 系统升级项目',
    status: QuoteStatus.ACCEPTED,
    products: [
      { id: 'qp1', productId: 'PROD-001', productName: 'CRM 专业版', productCode: 'CRM-PRO', quantity: 50, unitPrice: 8000, discount: 10, amount: 360000 },
      { id: 'qp2', productId: 'PROD-010', productName: '实施服务', productCode: 'SVC-IMP', quantity: 20, unitPrice: 5000, discount: 0, amount: 100000 },
      { id: 'qp3', productId: 'PROD-011', productName: '培训服务', productCode: 'SVC-TRN', quantity: 5, unitPrice: 8000, discount: 0, amount: 40000 },
    ],
    subtotal: 500000,
    discount: 20000,
    tax: 28800,
    total: 508800,
    validUntil: '2024-04-30T00:00:00Z',
    createdAt: '2024-02-15T08:00:00Z',
    updatedAt: '2024-03-10T14:30:00Z',
    createdBy: '张三',
    assignee: '张三',
    remark: '老客户优惠',
    terms: '标准合同条款',
    deliveryDate: '2024-05-15T00:00:00Z',
    paymentTerms: '30% 预付款，60% 验收款，10% 质保金',
  },
  {
    id: 'QT-002',
    quoteNo: 'QT-2024-002',
    customerId: 'CUST-002',
    customerName: '上海贸易发展集团',
    opportunityId: 'OPP-002',
    opportunityName: '供应链管理系统采购',
    status: QuoteStatus.SENT,
    products: [
      { id: 'qp4', productId: 'PROD-002', productName: 'SCM 系统', productCode: 'SCM-ENT', quantity: 1, unitPrice: 800000, discount: 5, amount: 760000 },
      { id: 'qp5', productId: 'PROD-010', productName: '实施服务', productCode: 'SVC-IMP', quantity: 60, unitPrice: 5000, discount: 0, amount: 300000 },
      { id: 'qp6', productId: 'PROD-012', productName: '年度维保', productCode: 'SVC-MNT', quantity: 1, unitPrice: 140000, discount: 0, amount: 140000 },
    ],
    subtotal: 1200000,
    discount: 50000,
    tax: 69000,
    total: 1219000,
    validUntil: '2024-05-31T00:00:00Z',
    createdAt: '2024-03-01T09:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z',
    createdBy: '李四',
    assignee: '李四',
    remark: '大客户折扣',
    terms: 'VIP 客户条款',
    deliveryDate: '2024-06-30T00:00:00Z',
    paymentTerms: '40% 预付款，50% 验收款，10% 质保金',
  },
  {
    id: 'QT-003',
    quoteNo: 'QT-2024-003',
    customerId: 'CUST-003',
    customerName: '广州智能制造厂',
    opportunityId: 'OPP-003',
    opportunityName: '智能制造 MES 系统',
    status: QuoteStatus.DRAFT,
    products: [
      { id: 'qp7', productId: 'PROD-003', productName: 'MES 系统', productCode: 'MES-STD', quantity: 1, unitPrice: 600000, discount: 0, amount: 600000 },
      { id: 'qp8', productId: 'PROD-008', productName: '硬件集成', productCode: 'HW-INT', quantity: 1, unitPrice: 200000, discount: 0, amount: 200000 },
    ],
    subtotal: 800000,
    discount: 0,
    tax: 48000,
    total: 848000,
    validUntil: '2024-06-30T00:00:00Z',
    createdAt: '2024-03-10T10:00:00Z',
    updatedAt: '2024-03-18T16:00:00Z',
    createdBy: '张三',
    assignee: '张三',
    remark: '待客户确认需求后 finalize',
    terms: '标准条款',
    deliveryDate: '2024-08-31T00:00:00Z',
    paymentTerms: '30% 预付款，60% 验收款，10% 质保金',
  },
  {
    id: 'QT-004',
    quoteNo: 'QT-2024-004',
    customerId: 'CUST-004',
    customerName: '深圳金融服务公司',
    opportunityId: 'OPP-004',
    opportunityName: '金融风控平台建设项目',
    status: QuoteStatus.DRAFT,
    products: [
      { id: 'qp9', productId: 'PROD-004', productName: '风控平台', productCode: 'RISK-ENT', quantity: 1, unitPrice: 1500000, discount: 0, amount: 1500000 },
      { id: 'qp10', productId: 'PROD-005', productName: 'AI 模型', productCode: 'AI-MDL', quantity: 5, unitPrice: 150000, discount: 0, amount: 750000 },
      { id: 'qp11', productId: 'PROD-006', productName: '数据服务', productCode: 'DATA-SVC', quantity: 1, unitPrice: 250000, discount: 0, amount: 250000 },
    ],
    subtotal: 2500000,
    discount: 0,
    tax: 150000,
    total: 2650000,
    validUntil: '2024-08-31T00:00:00Z',
    createdAt: '2024-03-15T08:30:00Z',
    updatedAt: '2024-03-20T09:00:00Z',
    createdBy: '王五',
    assignee: '王五',
    remark: '金融行业大单，需高层审批',
    terms: '金融行业专用条款',
    deliveryDate: '2024-10-31T00:00:00Z',
    paymentTerms: '30% 预付款，40% 中期款，25% 验收款，5% 质保金',
  },
  {
    id: 'QT-005',
    quoteNo: 'QT-2024-005',
    customerId: 'CUST-005',
    customerName: '杭州电子商务集团',
    opportunityId: 'OPP-005',
    opportunityName: '电商平台 ERP 集成',
    status: QuoteStatus.ACCEPTED,
    products: [
      { id: 'qp12', productId: 'PROD-007', productName: 'ERP 系统', productCode: 'ERP-STD', quantity: 1, unitPrice: 500000, discount: 10, amount: 450000 },
      { id: 'qp13', productId: 'PROD-009', productName: 'API 集成服务', productCode: 'API-INT', quantity: 1, unitPrice: 200000, discount: 0, amount: 200000 },
    ],
    subtotal: 650000,
    discount: 30000,
    tax: 37200,
    total: 657200,
    validUntil: '2024-04-15T00:00:00Z',
    createdAt: '2024-01-20T11:00:00Z',
    updatedAt: '2024-03-05T15:30:00Z',
    createdBy: '赵六',
    assignee: '赵六',
    remark: '已签约',
    terms: '标准条款',
    deliveryDate: '2024-04-30T00:00:00Z',
    paymentTerms: '50% 预付款，50% 验收款',
  },
  {
    id: 'QT-006',
    quoteNo: 'QT-2024-006',
    customerId: 'CUST-006',
    customerName: '成都医疗健康集团',
    opportunityId: 'OPP-006',
    opportunityName: '医院 HIS 系统升级',
    status: QuoteStatus.SENT,
    products: [
      { id: 'qp14', productId: 'PROD-013', productName: 'HIS 系统', productCode: 'HIS-ENT', quantity: 1, unitPrice: 700000, discount: 5, amount: 665000 },
      { id: 'qp15', productId: 'PROD-014', productName: '数据迁移', productCode: 'DATA-MIG', quantity: 1, unitPrice: 150000, discount: 0, amount: 150000 },
      { id: 'qp16', productId: 'PROD-011', productName: '培训服务', productCode: 'SVC-TRN', quantity: 10, unitPrice: 8000, discount: 0, amount: 80000 },
    ],
    subtotal: 895000,
    discount: 45000,
    tax: 51000,
    total: 901000,
    validUntil: '2024-05-31T00:00:00Z',
    createdAt: '2024-03-01T09:00:00Z',
    updatedAt: '2024-03-18T11:00:00Z',
    createdBy: '张三',
    assignee: '张三',
    remark: '医疗行业标杆项目',
    terms: '医疗行业专用条款',
    deliveryDate: '2024-07-31T00:00:00Z',
    paymentTerms: '30% 预付款，50% 验收款，20% 质保金',
  },
  {
    id: 'QT-007',
    quoteNo: 'QT-2024-007',
    customerId: 'CUST-007',
    customerName: '武汉教育发展中心',
    opportunityId: 'OPP-007',
    opportunityName: '教育培训机构管理系统',
    status: QuoteStatus.DRAFT,
    products: [
      { id: 'qp17', productId: 'PROD-015', productName: '培训管理系统', productCode: 'EDU-TMS', quantity: 1, unitPrice: 200000, discount: 0, amount: 200000 },
      { id: 'qp18', productId: 'PROD-016', productName: '在线学习平台', productCode: 'EDU-LMS', quantity: 1, unitPrice: 80000, discount: 0, amount: 80000 },
    ],
    subtotal: 280000,
    discount: 0,
    tax: 16800,
    total: 296800,
    validUntil: '2024-06-30T00:00:00Z',
    createdAt: '2024-03-12T08:00:00Z',
    updatedAt: '2024-03-20T10:00:00Z',
    createdBy: '李四',
    assignee: '李四',
    remark: '预算有限，待确认',
    terms: '教育行业优惠条款',
    deliveryDate: '2024-08-15T00:00:00Z',
    paymentTerms: '50% 预付款，50% 验收款',
  },
  {
    id: 'QT-008',
    quoteNo: 'QT-2024-008',
    customerId: 'CUST-008',
    customerName: '南京房地产开发公司',
    opportunityId: 'OPP-008',
    opportunityName: '房地产营销系统',
    status: QuoteStatus.REJECTED,
    products: [
      { id: 'qp19', productId: 'PROD-017', productName: '营销管理系统', productCode: 'RE-MKT', quantity: 1, unitPrice: 420000, discount: 0, amount: 420000 },
    ],
    subtotal: 420000,
    discount: 0,
    tax: 25200,
    total: 445200,
    validUntil: '2024-03-31T00:00:00Z',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-02-28T14:00:00Z',
    createdBy: '王五',
    assignee: '王五',
    remark: '客户选择竞争对手',
    terms: '标准条款',
    deliveryDate: '2024-05-31T00:00:00Z',
    paymentTerms: '30% 预付款，70% 验收款',
  },
  {
    id: 'QT-009',
    quoteNo: 'QT-2024-009',
    customerId: 'CUST-009',
    customerName: '西安物流运输公司',
    opportunityId: 'OPP-009',
    opportunityName: '物流 TMS 系统项目',
    status: QuoteStatus.SENT,
    products: [
      { id: 'qp20', productId: 'PROD-018', productName: 'TMS 系统', productCode: 'TMS-STD', quantity: 1, unitPrice: 350000, discount: 5, amount: 332500 },
      { id: 'qp21', productId: 'PROD-019', productName: 'GPS 集成', productCode: 'GPS-INT', quantity: 100, unitPrice: 500, discount: 0, amount: 50000 },
      { id: 'qp22', productId: 'PROD-020', productName: '移动 APP', productCode: 'APP-MOB', quantity: 1, unitPrice: 120000, discount: 0, amount: 120000 },
    ],
    subtotal: 502500,
    discount: 22500,
    tax: 28800,
    total: 508800,
    validUntil: '2024-04-30T00:00:00Z',
    createdAt: '2024-02-20T09:30:00Z',
    updatedAt: '2024-03-22T11:00:00Z',
    createdBy: '赵六',
    assignee: '赵六',
    remark: '谈判中',
    terms: '标准条款',
    deliveryDate: '2024-06-30T00:00:00Z',
    paymentTerms: '40% 预付款，50% 验收款，10% 质保金',
  },
  {
    id: 'QT-010',
    quoteNo: 'QT-2024-010',
    customerId: 'CUST-010',
    customerName: '重庆能源化工集团',
    opportunityId: 'OPP-010',
    opportunityName: '能源集团数据中台',
    status: QuoteStatus.DRAFT,
    products: [
      { id: 'qp23', productId: 'PROD-021', productName: '数据中台', productCode: 'DATA-PLAT', quantity: 1, unitPrice: 2500000, discount: 0, amount: 2500000 },
      { id: 'qp24', productId: 'PROD-022', productName: 'BI 分析', productCode: 'BI-ENT', quantity: 1, unitPrice: 800000, discount: 0, amount: 800000 },
      { id: 'qp25', productId: 'PROD-023', productName: '数据治理', productCode: 'DATA-GOV', quantity: 1, unitPrice: 500000, discount: 0, amount: 500000 },
    ],
    subtotal: 3800000,
    discount: 0,
    tax: 228000,
    total: 4028000,
    validUntil: '2024-07-31T00:00:00Z',
    createdAt: '2024-03-05T08:00:00Z',
    updatedAt: '2024-03-21T16:00:00Z',
    createdBy: '张三',
    assignee: '张三',
    remark: '超大型项目，需多轮沟通',
    terms: '战略客户条款',
    deliveryDate: '2024-12-31T00:00:00Z',
    paymentTerms: '30% 预付款，30% 中期款，30% 验收款，10% 质保金',
  },
]

// ============ 辅助函数 ============

export function getQuoteById(id: string): MockQuote | undefined {
  return mockQuotes.find((q) => q.id === id)
}

export function getQuoteByQuoteNo(quoteNo: string): MockQuote | undefined {
  return mockQuotes.find((q) => q.quoteNo === quoteNo)
}

export function getAllQuotes(): MockQuote[] {
  return [...mockQuotes]
}

export function getQuotesByStatus(status: QuoteStatus): MockQuote[] {
  return mockQuotes.filter((q) => q.status === status)
}

export function getQuotesByCustomerId(customerId: string): MockQuote[] {
  return mockQuotes.filter((q) => q.customerId === customerId)
}

export function getQuotesByOpportunityId(opportunityId: string): MockQuote[] {
  return mockQuotes.filter((q) => q.opportunityId === opportunityId)
}

export function getQuoteStats() {
  const total = mockQuotes.length
  const draft = mockQuotes.filter((q) => q.status === QuoteStatus.DRAFT).length
  const sent = mockQuotes.filter((q) => q.status === QuoteStatus.SENT).length
  const accepted = mockQuotes.filter((q) => q.status === QuoteStatus.ACCEPTED).length
  const rejected = mockQuotes.filter((q) => q.status === QuoteStatus.REJECTED).length
  const expired = mockQuotes.filter((q) => q.status === QuoteStatus.EXPIRED).length
  
  const totalAmount = mockQuotes.reduce((sum, q) => sum + q.total, 0)
  const acceptedAmount = mockQuotes.filter((q) => q.status === QuoteStatus.ACCEPTED).reduce((sum, q) => sum + q.total, 0)
  
  const conversionRate = (sent + accepted) > 0 ? Math.round((accepted / (sent + accepted)) * 100) : 0
  
  return {
    total,
    draft,
    sent,
    accepted,
    rejected,
    expired,
    totalAmount,
    acceptedAmount,
    conversionRate,
  }
}
