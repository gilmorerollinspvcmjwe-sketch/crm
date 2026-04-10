/**
 * Document 文件模块 Mock 数据
 * Document & File Management Mock Data
 */

// ============================================
// 文档类型定义
// ============================================
export type DocumentType = 'contract' | 'quote' | 'invoice' | 'report' | 'other'
export type DocumentFormat = 'pdf' | 'word' | 'excel' | 'ppt' | 'jpg' | 'png' | 'zip' | 'other'
export type DocumentStatus = 'draft' | 'active' | 'archived' | 'expired'

export interface Document {
  id: string
  name: string
  type: DocumentType
  format: DocumentFormat
  size: number // bytes
  url?: string
  description?: string
  status: DocumentStatus
  // 关联对象
  relatedType: 'customer' | 'lead' | 'contact' | 'opportunity' | 'contract' | 'order' | null
  relatedId: string | null
  relatedName?: string
  // 元数据
  tags?: string[]
  version?: number
  folderId?: string
  // 用户与时间
  createdBy: string
  createdAt: string
  updatedBy?: string
  updatedAt: string
  downloadedCount: number
}

export interface DocumentFolder {
  id: string
  name: string
  parentId?: string
  type: 'private' | 'shared' | 'system'
  createdBy: string
  createdAt: string
}

export interface DocumentListParams {
  page?: number
  pageSize?: number
  search?: string
  type?: DocumentType
  format?: DocumentFormat
  status?: DocumentStatus
  relatedType?: Document['relatedType']
  relatedId?: string
  folderId?: string
  tags?: string[]
  startDate?: string
  endDate?: string
}

// ============================================
// 类型标签映射
// ============================================
export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  contract: '合同',
  quote: '报价单',
  invoice: '发票',
  report: '报表',
  other: '其它',
}

export const DOCUMENT_FORMAT_LABELS: Record<DocumentFormat, string> = {
  pdf: 'PDF文档',
  word: 'Word文档',
  excel: 'Excel表格',
  ppt: 'PowerPoint',
  jpg: '图片(JPG)',
  png: '图片(PNG)',
  zip: '压缩包',
  other: '其它',
}

export const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
  draft: '草稿',
  active: '有效',
  archived: '已归档',
  expired: '已过期',
}

// ============================================
// Mock 文件夹数据
// ============================================
export const mockDocumentFolders: DocumentFolder[] = [
  { id: 'folder-001', name: '我的文档', type: 'private', createdBy: 'user_001', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'folder-002', name: '共享文档', type: 'shared', createdBy: 'user_001', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'folder-003', name: '合同文档', type: 'system', createdBy: 'system', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'folder-004', name: '报价文档', type: 'system', createdBy: 'system', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'folder-005', name: '销售报表', type: 'system', createdBy: 'system', createdAt: '2024-01-01T00:00:00Z' },
]

// ============================================
// Mock 文档数据（35条）
// ============================================
export const mockDocuments: Document[] = [
  // 合同文档
  {
    id: 'doc-001',
    name: '北京华联CRM采购合同',
    type: 'contract',
    format: 'pdf',
    size: 2457600,
    description: '北京华联集团CRM系统采购合同（三年期）',
    status: 'active',
    relatedType: 'customer',
    relatedId: 'cust-001',
    relatedName: '北京华联集团',
    tags: ['重要', '已签署'],
    version: 1,
    folderId: 'folder-003',
    createdBy: '张明',
    createdAt: '2024-06-14T10:00:00Z',
    updatedBy: '张明',
    updatedAt: '2024-06-14T10:00:00Z',
    downloadedCount: 12,
  },
  {
    id: 'doc-002',
    name: '上海商贸CRM实施合同',
    type: 'contract',
    format: 'pdf',
    size: 1843200,
    description: '上海商贸公司CRM实施服务合同',
    status: 'active',
    relatedType: 'customer',
    relatedId: 'cust-002',
    relatedName: '上海商贸公司',
    tags: ['重要'],
    version: 2,
    folderId: 'folder-003',
    createdBy: '李华',
    createdAt: '2024-05-20T14:00:00Z',
    updatedBy: '李华',
    updatedAt: '2024-05-25T09:00:00Z',
    downloadedCount: 8,
  },
  {
    id: 'doc-003',
    name: '广州贸易框架协议',
    type: 'contract',
    format: 'word',
    size: 1024000,
    description: '广州贸易进出口框架合作协议',
    status: 'active',
    relatedType: 'customer',
    relatedId: 'cust-003',
    relatedName: '广州贸易进出口',
    tags: ['框架协议'],
    version: 1,
    folderId: 'folder-003',
    createdBy: '王芳',
    createdAt: '2024-04-15T11:00:00Z',
    updatedAt: '2024-04-15T11:00:00Z',
    downloadedCount: 5,
  },
  {
    id: 'doc-004',
    name: '深圳科技采购合同-2024',
    type: 'contract',
    format: 'pdf',
    size: 2150400,
    description: '深圳科技集团年度软件采购合同',
    status: 'active',
    relatedType: 'customer',
    relatedId: 'cust-006',
    relatedName: '深圳科技集团',
    tags: ['重要', '年度合同'],
    version: 1,
    folderId: 'folder-003',
    createdBy: '赵敏',
    createdAt: '2024-03-01T09:00:00Z',
    updatedAt: '2024-03-01T09:00:00Z',
    downloadedCount: 15,
  },
  {
    id: 'doc-005',
    name: 'AWS云服务合同',
    type: 'contract',
    format: 'pdf',
    size: 1536000,
    description: 'AWS云服务年度采购合同',
    status: 'active',
    relatedType: 'contract',
    relatedId: 'con-001',
    relatedName: 'AWS云服务年度合同',
    tags: ['云服务', 'AWS'],
    version: 1,
    folderId: 'folder-003',
    createdBy: '张明',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z',
    downloadedCount: 20,
  },
  {
    id: 'doc-006',
    name: '办公楼租赁合同-2024',
    type: 'contract',
    format: 'pdf',
    size: 3072000,
    description: '恒隆广场办公楼租赁合同（三年期）',
    status: 'active',
    relatedType: 'contract',
    relatedId: 'con-004',
    relatedName: '办公楼租赁合同',
    tags: ['租赁', '办公'],
    version: 1,
    folderId: 'folder-003',
    createdBy: '刘芳',
    createdAt: '2023-12-01T09:00:00Z',
    updatedAt: '2023-12-01T09:00:00Z',
    downloadedCount: 6,
  },
  {
    id: 'doc-007',
    name: '软件外包开发合同',
    type: 'contract',
    format: 'pdf',
    size: 1843200,
    description: '软通动力软件开发外包合同',
    status: 'active',
    relatedType: 'contract',
    relatedId: 'con-003',
    relatedName: '软件外包开发合同',
    tags: ['外包'],
    version: 1,
    folderId: 'folder-003',
    createdBy: '王芳',
    createdAt: '2024-02-20T08:00:00Z',
    updatedAt: '2024-02-20T08:00:00Z',
    downloadedCount: 9,
  },

  // 报价单文档
  {
    id: 'doc-008',
    name: '北京华联CRM报价方案V1',
    type: 'quote',
    format: 'pdf',
    size: 1024000,
    description: '面向北京华联的CRM标准版报价方案（初版）',
    status: 'archived',
    relatedType: 'customer',
    relatedId: 'cust-001',
    relatedName: '北京华联集团',
    tags: ['已过期'],
    version: 1,
    folderId: 'folder-004',
    createdBy: '张明',
    createdAt: '2024-05-15T10:00:00Z',
    updatedAt: '2024-05-15T10:00:00Z',
    downloadedCount: 3,
  },
  {
    id: 'doc-009',
    name: '北京华联CRM报价方案V2',
    type: 'quote',
    format: 'pdf',
    size: 1126400,
    description: '面向北京华联的CRM专业版报价方案（三年期优惠）',
    status: 'archived',
    relatedType: 'customer',
    relatedId: 'cust-001',
    relatedName: '北京华联集团',
    tags: ['已成交'],
    version: 2,
    folderId: 'folder-004',
    createdBy: '张明',
    createdAt: '2024-06-01T14:00:00Z',
    updatedAt: '2024-06-07T11:00:00Z',
    downloadedCount: 7,
  },
  {
    id: 'doc-010',
    name: '上海商贸产品报价单',
    type: 'quote',
    format: 'excel',
    size: 204800,
    description: '上海商贸CRM产品详细报价清单',
    status: 'active',
    relatedType: 'customer',
    relatedId: 'cust-002',
    relatedName: '上海商贸公司',
    tags: ['报价中'],
    version: 1,
    folderId: 'folder-004',
    createdBy: '李华',
    createdAt: '2024-06-05T09:00:00Z',
    updatedAt: '2024-06-05T09:00:00Z',
    downloadedCount: 4,
  },
  {
    id: 'doc-011',
    name: '广州贸易定制方案报价',
    type: 'quote',
    format: 'pdf',
    size: 1228800,
    description: '面向广州贸易的定制化CRM解决方案报价',
    status: 'active',
    relatedType: 'customer',
    relatedId: 'cust-003',
    relatedName: '广州贸易进出口',
    tags: ['跟进中'],
    version: 1,
    folderId: 'folder-004',
    createdBy: '王芳',
    createdAt: '2024-06-07T11:00:00Z',
    updatedAt: '2024-06-07T11:00:00Z',
    downloadedCount: 6,
  },
  {
    id: 'doc-012',
    name: '杭州进出口产品手册',
    type: 'quote',
    format: 'pdf',
    size: 5120000,
    description: 'CRM产品功能详解手册（含国际版支持）',
    status: 'active',
    relatedType: 'customer',
    relatedId: 'cust-004',
    relatedName: '杭州进出口公司',
    tags: ['产品资料'],
    version: 3,
    folderId: 'folder-004',
    createdBy: '李娜',
    createdAt: '2024-04-10T10:00:00Z',
    updatedAt: '2024-06-01T15:00:00Z',
    downloadedCount: 11,
  },
  {
    id: 'doc-013',
    name: '深圳科技年度报价',
    type: 'quote',
    format: 'pdf',
    size: 921600,
    description: '深圳科技集团年度服务报价单',
    status: 'active',
    relatedType: 'customer',
    relatedId: 'cust-006',
    relatedName: '深圳科技集团',
    tags: ['VIP客户'],
    version: 1,
    folderId: 'folder-004',
    createdBy: '赵敏',
    createdAt: '2024-02-28T14:00:00Z',
    updatedAt: '2024-02-28T14:00:00Z',
    downloadedCount: 8,
  },

  // 发票文档
  {
    id: 'doc-014',
    name: '北京华联-发票#2024001',
    type: 'invoice',
    format: 'pdf',
    size: 153600,
    description: '北京华联CRM系统首期款发票（¥238,000）',
    status: 'active',
    relatedType: 'customer',
    relatedId: 'cust-001',
    relatedName: '北京华联集团',
    tags: ['已开票', '已付款'],
    version: 1,
    folderId: 'folder-003',
    createdBy: '财务部',
    createdAt: '2024-06-15T09:00:00Z',
    updatedAt: '2024-06-15T09:00:00Z',
    downloadedCount: 5,
  },
  {
    id: 'doc-015',
    name: 'AWS-发票#AWS2024001',
    type: 'invoice',
    format: 'pdf',
    size: 102400,
    description: 'AWS云服务第一季度账单发票（¥145,000）',
    status: 'active',
    relatedType: 'contract',
    relatedId: 'con-001',
    relatedName: 'AWS云服务年度合同',
    tags: ['云服务', '已付款'],
    version: 1,
    createdBy: '财务部',
    createdAt: '2024-04-05T10:00:00Z',
    updatedAt: '2024-04-05T10:00:00Z',
    downloadedCount: 10,
  },
  {
    id: 'doc-016',
    name: '深圳科技-发票#2024012',
    type: 'invoice',
    format: 'pdf',
    size: 143360,
    description: '深圳科技集团软件授权费发票（¥59,990）',
    status: 'active',
    relatedType: 'customer',
    relatedId: 'cust-006',
    relatedName: '深圳科技集团',
    tags: ['VIP客户', '已付款'],
    version: 1,
    folderId: 'folder-003',
    createdBy: '财务部',
    createdAt: '2024-03-15T14:00:00Z',
    updatedAt: '2024-03-15T14:00:00Z',
    downloadedCount: 7,
  },
  {
    id: 'doc-017',
    name: '上海商贸-发票#2024025',
    type: 'invoice',
    format: 'pdf',
    size: 133120,
    description: '上海商贸CRM实施服务费发票（第一期）',
    status: 'active',
    relatedType: 'customer',
    relatedId: 'cust-002',
    relatedName: '上海商贸公司',
    tags: ['实施服务'],
    version: 1,
    folderId: 'folder-003',
    createdBy: '财务部',
    createdAt: '2024-06-01T09:00:00Z',
    updatedAt: '2024-06-01T09:00:00Z',
    downloadedCount: 4,
  },

  // 报表文档
  {
    id: 'doc-018',
    name: 'Q1销售业绩报告',
    type: 'report',
    format: 'pdf',
    size: 1843200,
    description: '2024年第一季度销售业绩汇总报告',
    status: 'archived',
    relatedType: null,
    relatedId: null,
    tags: ['季度报告', '销售'],
    version: 1,
    folderId: 'folder-005',
    createdBy: '张明',
    createdAt: '2024-04-05T10:00:00Z',
    updatedAt: '2024-04-05T10:00:00Z',
    downloadedCount: 45,
  },
  {
    id: 'doc-019',
    name: '客户流失分析报告-2024H1',
    type: 'report',
    format: 'pdf',
    size: 2150400,
    description: '2024年上半年客户流失原因分析报告',
    status: 'active',
    relatedType: null,
    relatedId: null,
    tags: ['分析报告', '客户'],
    version: 1,
    folderId: 'folder-005',
    createdBy: '李华',
    createdAt: '2024-07-01T09:00:00Z',
    updatedAt: '2024-07-01T09:00:00Z',
    downloadedCount: 28,
  },
  {
    id: 'doc-020',
    name: '商机转化率分析',
    type: 'report',
    format: 'excel',
    size: 512000,
    description: '各阶段商机转化率详细数据表',
    status: 'active',
    relatedType: null,
    relatedId: null,
    tags: ['分析数据', '商机'],
    version: 2,
    folderId: 'folder-005',
    createdBy: '王芳',
    createdAt: '2024-06-20T14:00:00Z',
    updatedAt: '2024-06-25T10:00:00Z',
    downloadedCount: 33,
  },
  {
    id: 'doc-021',
    name: '销售漏斗分析图',
    type: 'report',
    format: 'ppt',
    size: 4096000,
    description: '销售漏斗各阶段数据可视化图表',
    status: 'active',
    relatedType: null,
    relatedId: null,
    tags: ['可视化', '销售'],
    version: 1,
    folderId: 'folder-005',
    createdBy: '刘强',
    createdAt: '2024-06-15T11:00:00Z',
    updatedAt: '2024-06-15T11:00:00Z',
    downloadedCount: 22,
  },
  {
    id: 'doc-022',
    name: '团队业绩排名表',
    type: 'report',
    format: 'excel',
    size: 256000,
    description: '销售团队个人业绩排名（按季度）',
    status: 'active',
    relatedType: null,
    relatedId: null,
    tags: ['排名', '团队'],
    version: 1,
    folderId: 'folder-005',
    createdBy: '赵敏',
    createdAt: '2024-06-28T16:00:00Z',
    updatedAt: '2024-06-28T16:00:00Z',
    downloadedCount: 56,
  },

  // 其它文档
  {
    id: 'doc-023',
    name: 'CRM产品白皮书',
    type: 'other',
    format: 'pdf',
    size: 6144000,
    description: '企业CRM选型与实施白皮书',
    status: 'active',
    relatedType: null,
    relatedId: null,
    tags: ['产品资料', '白皮书'],
    version: 2,
    folderId: 'folder-002',
    createdBy: '张明',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-05-01T14:00:00Z',
    downloadedCount: 89,
  },
  {
    id: 'doc-024',
    name: '实施方法论文档',
    type: 'other',
    format: 'pdf',
    size: 3584000,
    description: 'CRM项目实施方法论与最佳实践',
    status: 'active',
    relatedType: null,
    relatedId: null,
    tags: ['实施指南', '方法论'],
    version: 3,
    folderId: 'folder-002',
    createdBy: '李华',
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-06-10T11:00:00Z',
    downloadedCount: 67,
  },
  {
    id: 'doc-025',
    name: 'API接口文档v2.1',
    type: 'other',
    format: 'pdf',
    size: 2662400,
    description: 'CRM系统开放API接口文档',
    status: 'active',
    relatedType: null,
    relatedId: null,
    tags: ['技术文档', 'API'],
    version: 5,
    folderId: 'folder-002',
    createdBy: '王芳',
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-06-20T09:00:00Z',
    downloadedCount: 134,
  },
  {
    id: 'doc-026',
    name: '培训课件-基础操作',
    type: 'other',
    format: 'ppt',
    size: 8192000,
    description: 'CRM系统基础操作培训课件',
    status: 'active',
    relatedType: null,
    relatedId: null,
    tags: ['培训', '课件'],
    version: 4,
    folderId: 'folder-002',
    createdBy: '李娜',
    createdAt: '2024-01-20T14:00:00Z',
    updatedAt: '2024-06-01T10:00:00Z',
    downloadedCount: 156,
  },
  {
    id: 'doc-027',
    name: '培训课件-高级功能',
    type: 'other',
    format: 'ppt',
    size: 6656000,
    description: 'CRM系统高级功能与自定义培训课件',
    status: 'active',
    relatedType: null,
    relatedId: null,
    tags: ['培训', '课件'],
    version: 2,
    folderId: 'folder-002',
    createdBy: '李娜',
    createdAt: '2024-02-15T09:00:00Z',
    updatedAt: '2024-05-15T11:00:00Z',
    downloadedCount: 98,
  },
  {
    id: 'doc-028',
    name: '客户拜访记录模板',
    type: 'other',
    format: 'word',
    size: 102400,
    description: '标准化客户拜访记录文档模板',
    status: 'active',
    relatedType: null,
    relatedId: null,
    tags: ['模板', '拜访'],
    version: 1,
    folderId: 'folder-002',
    createdBy: '刘强',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z',
    downloadedCount: 78,
  },
  {
    id: 'doc-029',
    name: '合同审批流程图',
    type: 'other',
    format: 'jpg',
    size: 512000,
    description: '合同审批标准流程示意图',
    status: 'active',
    relatedType: null,
    relatedId: null,
    tags: ['流程图', '合同'],
    version: 1,
    folderId: 'folder-002',
    createdBy: '张明',
    createdAt: '2024-01-05T11:00:00Z',
    updatedAt: '2024-01-05T11:00:00Z',
    downloadedCount: 34,
  },
  {
    id: 'doc-030',
    name: '企业资质证书',
    type: 'other',
    format: 'pdf',
    size: 2048000,
    description: '公司营业执照、软件著作权等资质证书合集',
    status: 'active',
    relatedType: null,
    relatedId: null,
    tags: ['资质', '公司'],
    version: 1,
    folderId: 'folder-002',
    createdBy: '张明',
    createdAt: '2024-01-01T09:00:00Z',
    updatedAt: '2024-01-01T09:00:00Z',
    downloadedCount: 45,
  },
  {
    id: 'doc-031',
    name: '软件安装包-CRM_v3.2',
    type: 'other',
    format: 'zip',
    size: 209715200,
    description: 'CRM系统安装包v3.2（含升级说明）',
    status: 'active',
    relatedType: null,
    relatedId: null,
    tags: ['安装包', '软件'],
    version: 1,
    folderId: 'folder-002',
    createdBy: '技术部',
    createdAt: '2024-06-01T10:00:00Z',
    updatedAt: '2024-06-01T10:00:00Z',
    downloadedCount: 23,
  },
  {
    id: 'doc-032',
    name: '南京贸易产品需求文档',
    type: 'other',
    format: 'word',
    size: 768000,
    description: '南京贸易CRM定制需求说明书',
    status: 'active',
    relatedType: 'customer',
    relatedId: 'cust-005',
    relatedName: '南京贸易集团',
    tags: ['需求文档'],
    version: 1,
    createdBy: '周杰',
    createdAt: '2024-06-10T14:00:00Z',
    updatedAt: '2024-06-10T14:00:00Z',
    downloadedCount: 5,
  },
  {
    id: 'doc-033',
    name: '竞争对手分析报告',
    type: 'other',
    format: 'pdf',
    size: 3072000,
    description: 'CRM市场竞争格局与对手分析',
    status: 'active',
    relatedType: null,
    relatedId: null,
    tags: ['竞品分析', '市场'],
    version: 2,
    folderId: 'folder-005',
    createdBy: '张明',
    createdAt: '2024-03-20T10:00:00Z',
    updatedAt: '2024-06-15T09:00:00Z',
    downloadedCount: 67,
  },
  {
    id: 'doc-034',
    name: '客户满意度调查报告',
    type: 'report',
    format: 'pdf',
    size: 1536000,
    description: '2024年上半年客户满意度调研结果',
    status: 'active',
    relatedType: null,
    relatedId: null,
    tags: ['满意度', '客户'],
    version: 1,
    folderId: 'folder-005',
    createdBy: '李华',
    createdAt: '2024-07-05T14:00:00Z',
    updatedAt: '2024-07-05T14:00:00Z',
    downloadedCount: 19,
  },
  {
    id: 'doc-035',
    name: '系统集成方案',
    type: 'other',
    format: 'pdf',
    size: 2457600,
    description: 'CRM与ERP系统集成技术方案',
    status: 'active',
    relatedType: 'customer',
    relatedId: 'cust-003',
    relatedName: '广州贸易进出口',
    tags: ['集成方案', '技术'],
    version: 1,
    createdBy: '王芳',
    createdAt: '2024-06-08T15:00:00Z',
    updatedAt: '2024-06-08T15:00:00Z',
    downloadedCount: 8,
  },
]

// ============================================
// 辅助函数
// ============================================

/** 获取所有文档 */
export function getDocumentList(): Document[] {
  return [...mockDocuments].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )
}

/** 根据ID获取文档 */
export function getDocumentById(id: string): Document | undefined {
  return mockDocuments.find((d) => d.id === id)
}

/** 根据筛选条件获取文档 */
export function getDocumentByFilter(filter: DocumentListParams): Document[] {
  let result = [...mockDocuments]

  if (filter.search) {
    const search = filter.search.toLowerCase()
    result = result.filter(
      (d) =>
        d.name.toLowerCase().includes(search) ||
        d.description?.toLowerCase().includes(search) ||
        d.relatedName?.toLowerCase().includes(search) ||
        d.tags?.some((tag) => tag.toLowerCase().includes(search))
    )
  }

  if (filter.type) {
    result = result.filter((d) => d.type === filter.type)
  }

  if (filter.format) {
    result = result.filter((d) => d.format === filter.format)
  }

  if (filter.status) {
    result = result.filter((d) => d.status === filter.status)
  }

  if (filter.relatedType) {
    result = result.filter((d) => d.relatedType === filter.relatedType)
  }

  if (filter.relatedId) {
    result = result.filter((d) => d.relatedId === filter.relatedId)
  }

  if (filter.folderId) {
    result = result.filter((d) => d.folderId === filter.folderId)
  }

  if (filter.startDate) {
    result = result.filter((d) => new Date(d.createdAt) >= new Date(filter.startDate!))
  }

  if (filter.endDate) {
    result = result.filter((d) => new Date(d.createdAt) <= new Date(filter.endDate!))
  }

  // 分页
  const page = filter.page ?? 1
  const pageSize = filter.pageSize ?? 20
  const start = (page - 1) * pageSize

  return result.slice(start, start + pageSize)
}

/** 根据关联对象获取文档 */
export function getDocumentsByRelated(
  relatedType: Document['relatedType'],
  relatedId: string
): Document[] {
  return mockDocuments.filter((d) => d.relatedType === relatedType && d.relatedId === relatedId)
}

/** 根据类型获取文档统计 */
export function getDocumentStats(): Record<DocumentType, number> {
  const stats: Record<DocumentType, number> = {
    contract: 0,
    quote: 0,
    invoice: 0,
    report: 0,
    other: 0,
  }

  for (const doc of mockDocuments) {
    stats[doc.type]++
  }

  return stats
}

/** 获取文档格式图标 */
export function getDocumentFormatIcon(format: DocumentFormat): string {
  const iconMap: Record<DocumentFormat, string> = {
    pdf: 'FileText',
    word: 'FileText',
    excel: 'Table',
    ppt: 'Presentation',
    jpg: 'Image',
    png: 'Image',
    zip: 'Archive',
    other: 'File',
  }
  return iconMap[format]
}

/** 格式化文件大小 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)}GB`
}

/** 获取文件夹列表 */
export function getDocumentFolderList(): DocumentFolder[] {
  return mockDocumentFolders
}

/** 根据ID获取文件夹 */
export function getDocumentFolderById(id: string): DocumentFolder | undefined {
  return mockDocumentFolders.find((f) => f.id === id)
}
