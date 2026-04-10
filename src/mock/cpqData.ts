/**
 * CPQ 报价管理模块 Mock 数据
 * Configure Price Quote Module Mock Data
 */

import {
  Product,
  Quote,
  QuoteItem,
  QuoteTemplate,
  QuoteStatus,
  ProductCategory,
  DiscountType,
} from '../types/cpq'

// ============================================
// 产品数据（25个产品）
// ============================================

export const mockProducts: Product[] = [
  // 软件产品
  {
    id: 'prod-001',
    name: '企业 CRM 标准版',
    category: ProductCategory.SOFTWARE,
    unitPrice: 2999,
    unit: '套/年',
    description: '适合中小企业使用的 CRM 标准版，包含客户管理、商机跟踪、报表分析等核心功能',
    sku: 'CRM-STD-001',
    inStock: true,
    specification: '支持 50 用户以内',
    model: 'Standard',
    costPrice: 800,
    stockQuantity: 999,
    status: 'active',
  },
  {
    id: 'prod-002',
    name: '企业 CRM 专业版',
    category: ProductCategory.SOFTWARE,
    unitPrice: 5999,
    unit: '套/年',
    description: '适合中大型企业使用的 CRM 专业版，包含标准版所有功能，增加自动化工作流、AI 分析等高级功能',
    sku: 'CRM-PRO-001',
    inStock: true,
    specification: '支持 200 用户以内',
    model: 'Professional',
    costPrice: 1800,
    stockQuantity: 999,
    status: 'active',
  },
  {
    id: 'prod-003',
    name: '企业 CRM 旗舰版',
    category: ProductCategory.SOFTWARE,
    unitPrice: 12999,
    unit: '套/年',
    description: '适合大型企业使用的 CRM 旗舰版，包含专业版所有功能，增加自定义对象、API 开放平台等企业级功能',
    sku: 'CRM-ENT-001',
    inStock: true,
    specification: '不限用户数',
    model: 'Enterprise',
    costPrice: 3500,
    stockQuantity: 999,
    status: 'active',
  },
  {
    id: 'prod-004',
    name: '营销自动化模块',
    category: ProductCategory.SOFTWARE,
    unitPrice: 3999,
    unit: '套/年',
    description: '营销自动化模块，支持邮件营销、短信营销、营销活动管理、线索评分等功能',
    sku: 'MOD-MKT-001',
    inStock: true,
    specification: '需要 CRM 主系统',
    model: 'Marketing Module',
    costPrice: 1200,
    stockQuantity: 999,
    status: 'active',
  },
  {
    id: 'prod-005',
    name: '服务工单模块',
    category: ProductCategory.SOFTWARE,
    unitPrice: 2499,
    unit: '套/年',
    description: '客户服务工单管理模块，支持多渠道服务、SLA 管理、知识库等功能',
    sku: 'MOD-SVC-001',
    inStock: true,
    specification: '需要 CRM 主系统',
    model: 'Service Module',
    costPrice: 700,
    stockQuantity: 999,
    status: 'active',
  },
  {
    id: 'prod-006',
    name: 'AI 销售助手',
    category: ProductCategory.SOFTWARE,
    unitPrice: 1999,
    unit: '套/年',
    description: 'AI 驱动的销售助手，提供智能客户洞察、销售预测、邮件撰写辅助等功能',
    sku: 'MOD-AI-001',
    inStock: true,
    specification: '需要 CRM 主系统',
    model: 'AI Module',
    costPrice: 500,
    stockQuantity: 999,
    status: 'active',
  },
  {
    id: 'prod-007',
    name: '移动端应用授权',
    category: ProductCategory.SOFTWARE,
    unitPrice: 499,
    unit: '用户/年',
    description: '移动端应用授权，支持 iOS 和 Android 平台',
    sku: 'MOBILE-001',
    inStock: true,
    specification: '按用户数计费',
    model: 'Mobile App',
    costPrice: 100,
    stockQuantity: 999,
    status: 'active',
  },

  // 硬件产品
  {
    id: 'prod-008',
    name: '智能呼叫中心硬件套件',
    category: ProductCategory.HARDWARE,
    unitPrice: 25999,
    unit: '套',
    description: '智能呼叫中心硬件套件，包含话机、耳机、录音设备等',
    sku: 'HW-CALL-001',
    inStock: true,
    specification: '10 座席配置',
    model: 'Call Center Kit',
    costPrice: 15000,
    stockQuantity: 50,
    stockWarning: 10,
    status: 'active',
  },
  {
    id: 'prod-009',
    name: '智能 POS 终端',
    category: ProductCategory.HARDWARE,
    unitPrice: 3599,
    unit: '台',
    description: '智能 POS 终端设备，支持扫码支付、刷卡支付、NFC 支付',
    sku: 'HW-POS-001',
    inStock: true,
    specification: '内置打印机',
    model: 'Smart POS',
    costPrice: 2000,
    stockQuantity: 200,
    stockWarning: 30,
    status: 'active',
  },
  {
    id: 'prod-010',
    name: '条码扫描枪',
    category: ProductCategory.HARDWARE,
    unitPrice: 299,
    unit: '台',
    description: '高速条码扫描枪，支持一维码和二维码扫描',
    sku: 'HW-SCAN-001',
    inStock: true,
    specification: 'USB/蓝牙双模',
    model: 'Scanner Pro',
    costPrice: 150,
    stockQuantity: 500,
    stockWarning: 50,
    status: 'active',
  },
  {
    id: 'prod-011',
    name: '便携式打印机',
    category: ProductCategory.HARDWARE,
    unitPrice: 899,
    unit: '台',
    description: '便携式热敏打印机，支持蓝牙和 WiFi 连接',
    sku: 'HW-PRT-001',
    inStock: true,
    specification: '58mm 纸宽',
    model: 'Portable Printer',
    costPrice: 400,
    stockQuantity: 150,
    stockWarning: 20,
    status: 'active',
  },

  // 服务产品
  {
    id: 'prod-012',
    name: '系统实施服务',
    category: ProductCategory.SERVICE,
    unitPrice: 50000,
    unit: '项',
    description: 'CRM 系统实施服务，包含需求调研、系统配置、数据迁移、上线支持',
    sku: 'SVC-IMP-001',
    inStock: true,
    specification: '标准实施周期 30 天',
    model: 'Implementation',
    costPrice: 20000,
    stockQuantity: 999,
    status: 'active',
  },
  {
    id: 'prod-013',
    name: '数据迁移服务',
    category: ProductCategory.SERVICE,
    unitPrice: 15000,
    unit: '项',
    description: '从旧系统迁移数据到新系统的专业服务',
    sku: 'SVC-MIG-001',
    inStock: true,
    specification: '支持主流 CRM 系统数据迁移',
    model: 'Migration',
    costPrice: 5000,
    stockQuantity: 999,
    status: 'active',
  },
  {
    id: 'prod-014',
    name: '系统集成服务',
    category: ProductCategory.SERVICE,
    unitPrice: 30000,
    unit: '项',
    description: '与企业现有系统集成服务，支持 ERP、OA、财务系统等',
    sku: 'SVC-INT-001',
    inStock: true,
    specification: '标准接口对接',
    model: 'Integration',
    costPrice: 12000,
    stockQuantity: 999,
    status: 'active',
  },
  {
    id: 'prod-015',
    name: '定制开发服务',
    category: ProductCategory.SERVICE,
    unitPrice: 1500,
    unit: '人天',
    description: '根据客户需求进行定制开发服务',
    sku: 'SVC-DEV-001',
    inStock: true,
    specification: '按人天计费',
    model: 'Development',
    costPrice: 600,
    stockQuantity: 999,
    status: 'active',
  },

  // 培训产品
  {
    id: 'prod-016',
    name: '管理员培训',
    category: ProductCategory.TRAINING,
    unitPrice: 5000,
    unit: '场',
    description: '系统管理员培训课程，包含系统配置、权限管理、流程设置等内容',
    sku: 'TRN-ADM-001',
    inStock: true,
    specification: '每场 10 人以内',
    model: 'Admin Training',
    costPrice: 1500,
    stockQuantity: 999,
    status: 'active',
  },
  {
    id: 'prod-017',
    name: '销售团队培训',
    category: ProductCategory.TRAINING,
    unitPrice: 8000,
    unit: '场',
    description: '销售团队使用培训课程，包含日常操作、最佳实践等内容',
    sku: 'TRN-SAL-001',
    inStock: true,
    specification: '每场 20 人以内',
    model: 'Sales Training',
    costPrice: 2500,
    stockQuantity: 999,
    status: 'active',
  },
  {
    id: 'prod-018',
    name: '高级用户培训',
    category: ProductCategory.TRAINING,
    unitPrice: 6000,
    unit: '场',
    description: '高级功能培训课程，包含报表设计、工作流配置、数据导入导出等内容',
    sku: 'TRN-ADV-001',
    inStock: true,
    specification: '每场 15 人以内',
    model: 'Advanced Training',
    costPrice: 2000,
    stockQuantity: 999,
    status: 'active',
  },

  // 维护产品
  {
    id: 'prod-019',
    name: '标准维护服务',
    category: ProductCategory.MAINTENANCE,
    unitPrice: 2999,
    unit: '年',
    description: '标准维护服务，包含系统更新、安全补丁、Bug 修复等',
    sku: 'MNT-STD-001',
    inStock: true,
    specification: '软件产品年度维护',
    model: 'Standard Maintenance',
    costPrice: 500,
    stockQuantity: 999,
    status: 'active',
  },
  {
    id: 'prod-020',
    name: '高级维护服务',
    category: ProductCategory.MAINTENANCE,
    unitPrice: 8999,
    unit: '年',
    description: '高级维护服务，包含标准维护所有内容，增加专属技术支持、优先响应等服务',
    sku: 'MNT-ADV-001',
    inStock: true,
    specification: '软件产品年度维护 + 专属支持',
    model: 'Advanced Maintenance',
    costPrice: 2000,
    stockQuantity: 999,
    status: 'active',
  },
  {
    id: 'prod-021',
    name: '7x24 技术支持',
    category: ProductCategory.MAINTENANCE,
    unitPrice: 19999,
    unit: '年',
    description: '7x24 小时技术支持服务，专属技术团队随时响应',
    sku: 'MNT-247-001',
    inStock: true,
    specification: '全天候技术支持',
    model: '24/7 Support',
    costPrice: 6000,
    stockQuantity: 999,
    status: 'active',
  },

  // 更多软件产品
  {
    id: 'prod-022',
    name: '数据分析模块',
    category: ProductCategory.SOFTWARE,
    unitPrice: 4999,
    unit: '套/年',
    description: '高级数据分析模块，支持自定义报表、仪表盘、数据大屏等功能',
    sku: 'MOD-BI-001',
    inStock: true,
    specification: '需要 CRM 主系统',
    model: 'BI Module',
    costPrice: 1500,
    stockQuantity: 999,
    status: 'active',
  },
  {
    id: 'prod-023',
    name: '项目管理模块',
    category: ProductCategory.SOFTWARE,
    unitPrice: 3499,
    unit: '套/年',
    description: '项目管理模块，支持项目创建、任务分配、进度跟踪等功能',
    sku: 'MOD-PM-001',
    inStock: true,
    specification: '需要 CRM 主系统',
    model: 'PM Module',
    costPrice: 1000,
    stockQuantity: 999,
    status: 'active',
  },
  {
    id: 'prod-024',
    name: '合同管理模块',
    category: ProductCategory.SOFTWARE,
    unitPrice: 2999,
    unit: '套/年',
    description: '合同管理模块，支持合同创建、审批、归档、到期提醒等功能',
    sku: 'MOD-CTR-001',
    inStock: true,
    specification: '需要 CRM 主系统',
    model: 'Contract Module',
    costPrice: 800,
    stockQuantity: 999,
    status: 'active',
  },
  {
    id: 'prod-025',
    name: 'API 开放平台',
    category: ProductCategory.SOFTWARE,
    unitPrice: 9999,
    unit: '套/年',
    description: 'API 开放平台授权，支持标准 REST API 接口调用',
    sku: 'API-PLAT-001',
    inStock: true,
    specification: '100万次/月 API 调用',
    model: 'API Platform',
    costPrice: 2500,
    stockQuantity: 999,
    status: 'active',
  },
]

// ============================================
// 价格表数据
// ============================================

export interface PriceBook {
  id: string
  name: string
  description: string
  isActive: boolean
  isDefault: boolean
  currency: string
  validFrom: string
  validTo: string
  entries: PriceBookEntry[]
}

export interface PriceBookEntry {
  id: string
  productId: string
  productName: string
  listPrice: number
  unitPrice: number
  discount: number
  currency: string
}

/** 阶梯定价价格表条目 */
export interface TieredPricebookEntry {
  id: string
  productId: string
  basePrice: number
  tiers: Array<{
    minQuantity: number
    maxQuantity?: number
    unitPrice: number
  }>
}

/** 阶梯定价价格表数据 */
export const pricebookEntries: TieredPricebookEntry[] = [
  {
    id: 'tier-001',
    productId: 'prod-001',
    basePrice: 2999,
    tiers: [
      { minQuantity: 1, maxQuantity: 9, unitPrice: 2999 },
      { minQuantity: 10, maxQuantity: 49, unitPrice: 2699 },
      { minQuantity: 50, unitPrice: 2399 },
    ],
  },
  {
    id: 'tier-002',
    productId: 'prod-002',
    basePrice: 5999,
    tiers: [
      { minQuantity: 1, maxQuantity: 4, unitPrice: 5999 },
      { minQuantity: 5, maxQuantity: 19, unitPrice: 5399 },
      { minQuantity: 20, unitPrice: 4799 },
    ],
  },
  {
    id: 'tier-003',
    productId: 'prod-003',
    basePrice: 12999,
    tiers: [
      { minQuantity: 1, unitPrice: 12999 },
    ],
  },
  {
    id: 'tier-004',
    productId: 'prod-004',
    basePrice: 3999,
    tiers: [
      { minQuantity: 1, maxQuantity: 2, unitPrice: 3999 },
      { minQuantity: 3, maxQuantity: 9, unitPrice: 3599 },
      { minQuantity: 10, unitPrice: 3199 },
    ],
  },
  {
    id: 'tier-005',
    productId: 'prod-007',
    basePrice: 499,
    tiers: [
      { minQuantity: 1, maxQuantity: 19, unitPrice: 499 },
      { minQuantity: 20, maxQuantity: 99, unitPrice: 399 },
      { minQuantity: 100, unitPrice: 349 },
    ],
  },
  {
    id: 'tier-006',
    productId: 'prod-015',
    basePrice: 1500,
    tiers: [
      { minQuantity: 1, maxQuantity: 9, unitPrice: 1500 },
      { minQuantity: 10, maxQuantity: 29, unitPrice: 1350 },
      { minQuantity: 30, unitPrice: 1200 },
    ],
  },
]

/** 根据数量获取阶梯价格 */
export function getProductPriceByQuantity(productId: string, quantity: number): number {
  const entry = pricebookEntries.find((e) => e.productId === productId)
  
  if (!entry) {
    const product = getProductById(productId)
    return product?.unitPrice || 0
  }
  
  // 找到匹配的阶梯
  const matchedTier = entry.tiers.find(
    (t) => t.minQuantity <= quantity && (!t.maxQuantity || quantity <= t.maxQuantity)
  )
  
  // 如果没有匹配，使用最后一个阶梯
  return matchedTier?.unitPrice || (entry.tiers.length > 0 ? entry.tiers[entry.tiers.length - 1].unitPrice : entry.basePrice)
}

export const mockPriceBooks: PriceBook[] = [
  {
    id: 'pb-001',
    name: '标准价格表',
    description: '标准产品价格表，适用于大多数客户',
    isActive: true,
    isDefault: true,
    currency: 'CNY',
    validFrom: '2024-01-01',
    validTo: '2024-12-31',
    entries: [
      {
        id: 'pbe-001',
        productId: 'prod-001',
        productName: '企业 CRM 标准版',
        listPrice: 2999,
        unitPrice: 2999,
        discount: 0,
        currency: 'CNY',
      },
      {
        id: 'pbe-002',
        productId: 'prod-002',
        productName: '企业 CRM 专业版',
        listPrice: 5999,
        unitPrice: 5999,
        discount: 0,
        currency: 'CNY',
      },
      {
        id: 'pbe-003',
        productId: 'prod-003',
        productName: '企业 CRM 旗舰版',
        listPrice: 12999,
        unitPrice: 12999,
        discount: 0,
        currency: 'CNY',
      },
    ],
  },
  {
    id: 'pb-002',
    name: 'VIP 客户价格表',
    description: 'VIP 客户专享价格，享受 15% 折扣',
    isActive: true,
    isDefault: false,
    currency: 'CNY',
    validFrom: '2024-01-01',
    validTo: '2024-12-31',
    entries: [
      {
        id: 'pbe-004',
        productId: 'prod-001',
        productName: '企业 CRM 标准版',
        listPrice: 2999,
        unitPrice: 2549,
        discount: 15,
        currency: 'CNY',
      },
      {
        id: 'pbe-005',
        productId: 'prod-002',
        productName: '企业 CRM 专业版',
        listPrice: 5999,
        unitPrice: 5099,
        discount: 15,
        currency: 'CNY',
      },
      {
        id: 'pbe-006',
        productId: 'prod-003',
        productName: '企业 CRM 旗舰版',
        listPrice: 12999,
        unitPrice: 11049,
        discount: 15,
        currency: 'CNY',
      },
    ],
  },
  {
    id: 'pb-003',
    name: '合作伙伴价格表',
    description: '渠道合作伙伴专享价格，享受 25% 折扣',
    isActive: true,
    isDefault: false,
    currency: 'CNY',
    validFrom: '2024-01-01',
    validTo: '2024-12-31',
    entries: [
      {
        id: 'pbe-007',
        productId: 'prod-001',
        productName: '企业 CRM 标准版',
        listPrice: 2999,
        unitPrice: 2249,
        discount: 25,
        currency: 'CNY',
      },
      {
        id: 'pbe-008',
        productId: 'prod-002',
        productName: '企业 CRM 专业版',
        listPrice: 5999,
        unitPrice: 4499,
        discount: 25,
        currency: 'CNY',
      },
      {
        id: 'pbe-009',
        productId: 'prod-003',
        productName: '企业 CRM 旗舰版',
        listPrice: 12999,
        unitPrice: 9749,
        discount: 25,
        currency: 'CNY',
      },
    ],
  },
]

// ============================================
// 报价单数据
// ============================================

export const mockQuotes: Quote[] = [
  // 草稿状态
  {
    id: 'quote-001',
    quoteNumber: 'QT-2024-0001',
    customerId: 'cust-001',
    customerName: '北京科技有限公司',
    contactId: 'contact-001',
    contactName: '张三',
    opportunityId: 'opp-001',
    opportunityName: 'CRM 系统采购项目',
    status: QuoteStatus.DRAFT,
    validUntil: '2024-04-15',
    items: [
      {
        id: 'item-001',
        quoteId: 'quote-001',
        productId: 'prod-002',
        productName: '企业 CRM 专业版',
        productSku: 'CRM-PRO-001',
        quantity: 1,
        unit: '套/年',
        unitPrice: 5999,
        discount: 10,
        discountType: DiscountType.PERCENTAGE,
        discountAmount: 599.9,
        subtotal: 5399.1,
        taxRate: 6,
        tax: 323.95,
        total: 5723.05,
        sortOrder: 1,
      },
      {
        id: 'item-002',
        quoteId: 'quote-001',
        productId: 'prod-016',
        productName: '管理员培训',
        productSku: 'TRN-ADM-001',
        quantity: 1,
        unit: '场',
        unitPrice: 5000,
        discount: 0,
        discountType: DiscountType.PERCENTAGE,
        discountAmount: 0,
        subtotal: 5000,
        taxRate: 6,
        tax: 300,
        total: 5300,
        sortOrder: 2,
      },
    ],
    subtotal: 10399.1,
    totalDiscount: 599.9,
    totalTax: 623.95,
    grandTotal: 11023.05,
    notes: '客户希望尽快得到报价方案',
    terms: '本报价有效期为30天',
    templateId: 'tpl-001',
    version: 1,
    createdBy: 'user-001',
    createdByName: '李销售',
    createdAt: '2024-03-16T10:30:00Z',
    updatedAt: '2024-03-16T14:20:00Z',
  },

  // 已发送状态
  {
    id: 'quote-002',
    quoteNumber: 'QT-2024-0002',
    customerId: 'cust-002',
    customerName: '上海贸易集团',
    contactId: 'contact-002',
    contactName: '李经理',
    opportunityId: 'opp-002',
    opportunityName: 'CRM 升级改造项目',
    status: QuoteStatus.SENT,
    validUntil: '2024-04-20',
    items: [
      {
        id: 'item-003',
        quoteId: 'quote-002',
        productId: 'prod-003',
        productName: '企业 CRM 旗舰版',
        productSku: 'CRM-ENT-001',
        quantity: 1,
        unit: '套/年',
        unitPrice: 12999,
        discount: 5,
        discountType: DiscountType.PERCENTAGE,
        discountAmount: 649.95,
        subtotal: 12349.05,
        taxRate: 6,
        tax: 740.94,
        total: 13089.99,
        sortOrder: 1,
      },
      {
        id: 'item-004',
        quoteId: 'quote-002',
        productId: 'prod-004',
        productName: '营销自动化模块',
        productSku: 'MOD-MKT-001',
        quantity: 1,
        unit: '套/年',
        unitPrice: 3999,
        discount: 0,
        discountType: DiscountType.PERCENTAGE,
        discountAmount: 0,
        subtotal: 3999,
        taxRate: 6,
        tax: 239.94,
        total: 4238.94,
        sortOrder: 2,
      },
      {
        id: 'item-005',
        quoteId: 'quote-002',
        productId: 'prod-012',
        productName: '系统实施服务',
        productSku: 'SVC-IMP-001',
        quantity: 1,
        unit: '项',
        unitPrice: 50000,
        discount: 10,
        discountType: DiscountType.PERCENTAGE,
        discountAmount: 5000,
        subtotal: 45000,
        taxRate: 6,
        tax: 2700,
        total: 47700,
        sortOrder: 3,
      },
      {
        id: 'item-006',
        quoteId: 'quote-002',
        productId: 'prod-017',
        productName: '销售团队培训',
        productSku: 'TRN-SAL-001',
        quantity: 2,
        unit: '场',
        unitPrice: 8000,
        discount: 0,
        discountType: DiscountType.PERCENTAGE,
        discountAmount: 0,
        subtotal: 16000,
        taxRate: 6,
        tax: 960,
        total: 16960,
        sortOrder: 4,
      },
    ],
    subtotal: 77348.05,
    totalDiscount: 5649.95,
    totalTax: 4640.88,
    grandTotal: 81988.93,
    notes: '客户需要定制化实施服务',
    terms: '本报价有效期为30天，付款方式：30%预付款，70%验收后支付',
    templateId: 'tpl-001',
    version: 2,
    parentQuoteId: 'quote-001-old',
    createdBy: 'user-002',
    createdByName: '王顾问',
    createdAt: '2024-03-10T09:00:00Z',
    updatedAt: '2024-03-18T11:30:00Z',
  },

  // 已接受状态
  {
    id: 'quote-003',
    quoteNumber: 'QT-2024-0003',
    customerId: 'cust-003',
    customerName: '广州制造有限公司',
    contactId: 'contact-003',
    contactName: '王总',
    status: QuoteStatus.ACCEPTED,
    validUntil: '2024-03-25',
    items: [
      {
        id: 'item-007',
        quoteId: 'quote-003',
        productId: 'prod-001',
        productName: '企业 CRM 标准版',
        productSku: 'CRM-STD-001',
        quantity: 1,
        unit: '套/年',
        unitPrice: 2999,
        discount: 0,
        discountType: DiscountType.PERCENTAGE,
        discountAmount: 0,
        subtotal: 2999,
        taxRate: 6,
        tax: 179.94,
        total: 3178.94,
        sortOrder: 1,
      },
      {
        id: 'item-008',
        quoteId: 'quote-003',
        productId: 'prod-007',
        productName: '移动端应用授权',
        productSku: 'MOBILE-001',
        quantity: 20,
        unit: '用户/年',
        unitPrice: 499,
        discount: 20,
        discountType: DiscountType.PERCENTAGE,
        discountAmount: 1996,
        subtotal: 7984,
        taxRate: 6,
        tax: 479.04,
        total: 8463.04,
        sortOrder: 2,
      },
      {
        id: 'item-009',
        quoteId: 'quote-003',
        productId: 'prod-019',
        productName: '标准维护服务',
        productSku: 'MNT-STD-001',
        quantity: 1,
        unit: '年',
        unitPrice: 2999,
        discount: 0,
        discountType: DiscountType.PERCENTAGE,
        discountAmount: 0,
        subtotal: 2999,
        taxRate: 6,
        tax: 179.94,
        total: 3178.94,
        sortOrder: 3,
      },
    ],
    subtotal: 13982,
    totalDiscount: 1996,
    totalTax: 838.92,
    grandTotal: 14820.92,
    notes: '客户已确认接受报价，准备签约',
    terms: '本报价有效期为30天',
    templateId: 'tpl-001',
    approvalStatus: 'approved',
    approvedBy: 'user-003',
    approvedAt: '2024-03-12T15:00:00Z',
    version: 1,
    convertedToContractId: 'contract-001',
    convertedAt: '2024-03-15T10:00:00Z',
    createdBy: 'user-001',
    createdByName: '李销售',
    createdAt: '2024-03-05T08:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z',
  },

  // 已拒绝状态
  {
    id: 'quote-004',
    quoteNumber: 'QT-2024-0004',
    customerId: 'cust-004',
    customerName: '深圳互联网科技公司',
    contactId: 'contact-004',
    contactName: '赵主管',
    opportunityId: 'opp-003',
    opportunityName: 'CRM 选型评估',
    status: QuoteStatus.REJECTED,
    validUntil: '2024-03-10',
    items: [
      {
        id: 'item-010',
        quoteId: 'quote-004',
        productId: 'prod-002',
        productName: '企业 CRM 专业版',
        productSku: 'CRM-PRO-001',
        quantity: 1,
        unit: '套/年',
        unitPrice: 5999,
        discount: 0,
        discountType: DiscountType.PERCENTAGE,
        discountAmount: 0,
        subtotal: 5999,
        taxRate: 6,
        tax: 359.94,
        total: 6358.94,
        sortOrder: 1,
      },
    ],
    subtotal: 5999,
    totalDiscount: 0,
    totalTax: 359.94,
    grandTotal: 6358.94,
    notes: '客户选择了竞争对手产品，价格因素为主要原因',
    internalNotes: '该客户后续可继续跟进，预计下季度有新预算',
    templateId: 'tpl-001',
    version: 1,
    createdBy: 'user-004',
    createdByName: '张业务',
    createdAt: '2024-02-20T10:00:00Z',
    updatedAt: '2024-03-08T16:30:00Z',
  },

  // 已过期状态
  {
    id: 'quote-005',
    quoteNumber: 'QT-2024-0005',
    customerId: 'cust-005',
    customerName: '杭州电商公司',
    contactId: 'contact-005',
    contactName: '陈经理',
    opportunityId: 'opp-004',
    opportunityName: '电商 CRM 需求',
    status: QuoteStatus.EXPIRED,
    validUntil: '2024-02-28',
    items: [
      {
        id: 'item-011',
        quoteId: 'quote-005',
        productId: 'prod-003',
        productName: '企业 CRM 旗舰版',
        productSku: 'CRM-ENT-001',
        quantity: 1,
        unit: '套/年',
        unitPrice: 12999,
        discount: 8,
        discountType: DiscountType.PERCENTAGE,
        discountAmount: 1039.92,
        subtotal: 11959.08,
        taxRate: 6,
        tax: 717.54,
        total: 12676.62,
        sortOrder: 1,
      },
      {
        id: 'item-012',
        quoteId: 'quote-005',
        productId: 'prod-005',
        productName: '服务工单模块',
        productSku: 'MOD-SVC-001',
        quantity: 1,
        unit: '套/年',
        unitPrice: 2499,
        discount: 0,
        discountType: DiscountType.PERCENTAGE,
        discountAmount: 0,
        subtotal: 2499,
        taxRate: 6,
        tax: 149.94,
        total: 2648.94,
        sortOrder: 2,
      },
    ],
    subtotal: 14458.08,
    totalDiscount: 1039.92,
    totalTax: 867.48,
    grandTotal: 15325.56,
    notes: '客户暂停了项目，报价已过期',
    templateId: 'tpl-001',
    version: 1,
    createdBy: 'user-002',
    createdByName: '王顾问',
    createdAt: '2024-01-25T14:00:00Z',
    updatedAt: '2024-03-01T09:00:00Z',
  },

  // 已修订状态
  {
    id: 'quote-006',
    quoteNumber: 'QT-2024-0006',
    customerId: 'cust-006',
    customerName: '成都集团企业',
    contactId: 'contact-006',
    contactName: '刘总监',
    opportunityId: 'opp-005',
    opportunityName: '集团 CRM 数字化转型',
    status: QuoteStatus.REVISED,
    validUntil: '2024-04-30',
    items: [
      {
        id: 'item-013',
        quoteId: 'quote-006',
        productId: 'prod-003',
        productName: '企业 CRM 旗舰版',
        productSku: 'CRM-ENT-001',
        quantity: 3,
        unit: '套/年',
        unitPrice: 12999,
        discount: 15,
        discountType: DiscountType.PERCENTAGE,
        discountAmount: 5849.55,
        subtotal: 33147.45,
        taxRate: 6,
        tax: 1988.85,
        total: 35136.3,
        sortOrder: 1,
      },
      {
        id: 'item-014',
        quoteId: 'quote-006',
        productId: 'prod-004',
        productName: '营销自动化模块',
        productSku: 'MOD-MKT-001',
        quantity: 3,
        unit: '套/年',
        unitPrice: 3999,
        discount: 10,
        discountType: DiscountType.PERCENTAGE,
        discountAmount: 1199.7,
        subtotal: 10797.3,
        taxRate: 6,
        tax: 647.84,
        total: 11445.14,
        sortOrder: 2,
      },
      {
        id: 'item-015',
        quoteId: 'quote-006',
        productId: 'prod-006',
        productName: 'AI 销售助手',
        productSku: 'MOD-AI-001',
        quantity: 3,
        unit: '套/年',
        unitPrice: 1999,
        discount: 10,
        discountType: DiscountType.PERCENTAGE,
        discountAmount: 599.7,
        subtotal: 5397.3,
        taxRate: 6,
        tax: 323.84,
        total: 5721.14,
        sortOrder: 3,
      },
      {
        id: 'item-016',
        quoteId: 'quote-006',
        productId: 'prod-012',
        productName: '系统实施服务',
        productSku: 'SVC-IMP-001',
        quantity: 1,
        unit: '项',
        unitPrice: 50000,
        discount: 20,
        discountType: DiscountType.PERCENTAGE,
        discountAmount: 10000,
        subtotal: 40000,
        taxRate: 6,
        tax: 2400,
        total: 42400,
        sortOrder: 4,
      },
      {
        id: 'item-017',
        quoteId: 'quote-006',
        productId: 'prod-014',
        productName: '系统集成服务',
        productSku: 'SVC-INT-001',
        quantity: 1,
        unit: '项',
        unitPrice: 30000,
        discount: 10,
        discountType: DiscountType.PERCENTAGE,
        discountAmount: 3000,
        subtotal: 27000,
        taxRate: 6,
        tax: 1620,
        total: 28620,
        sortOrder: 5,
      },
      {
        id: 'item-018',
        quoteId: 'quote-006',
        productId: 'prod-021',
        productName: '7x24 技术支持',
        productSku: 'MNT-247-001',
        quantity: 1,
        unit: '年',
        unitPrice: 19999,
        discount: 0,
        discountType: DiscountType.PERCENTAGE,
        discountAmount: 0,
        subtotal: 19999,
        taxRate: 6,
        tax: 1199.94,
        total: 21198.94,
        sortOrder: 6,
      },
    ],
    subtotal: 136341.05,
    totalDiscount: 20648.95,
    totalTax: 8180.47,
    grandTotal: 144521.52,
    notes: '客户为集团型企业，需要多套系统部署',
    terms: '本报价有效期为45天，支持分期付款',
    templateId: 'tpl-002',
    version: 3,
    parentQuoteId: 'quote-006-v2',
    createdBy: 'user-001',
    createdByName: '李销售',
    createdAt: '2024-02-15T09:00:00Z',
    updatedAt: '2024-03-20T14:30:00Z',
  },

  // 更多草稿状态报价
  {
    id: 'quote-007',
    quoteNumber: 'QT-2024-0007',
    customerId: 'cust-007',
    customerName: '武汉教育科技公司',
    contactId: 'contact-007',
    contactName: '周主任',
    status: QuoteStatus.DRAFT,
    validUntil: '2024-04-25',
    items: [
      {
        id: 'item-019',
        quoteId: 'quote-007',
        productId: 'prod-001',
        productName: '企业 CRM 标准版',
        productSku: 'CRM-STD-001',
        quantity: 1,
        unit: '套/年',
        unitPrice: 2999,
        discount: 0,
        discountType: DiscountType.PERCENTAGE,
        discountAmount: 0,
        subtotal: 2999,
        taxRate: 6,
        tax: 179.94,
        total: 3178.94,
        sortOrder: 1,
      },
      {
        id: 'item-020',
        quoteId: 'quote-007',
        productId: 'prod-016',
        productName: '管理员培训',
        productSku: 'TRN-ADM-001',
        quantity: 2,
        unit: '场',
        unitPrice: 5000,
        discount: 0,
        discountType: DiscountType.PERCENTAGE,
        discountAmount: 0,
        subtotal: 10000,
        taxRate: 6,
        tax: 600,
        total: 10600,
        sortOrder: 2,
      },
    ],
    subtotal: 12999,
    totalDiscount: 0,
    totalTax: 779.94,
    grandTotal: 13778.94,
    notes: '教育行业客户，等待预算审批',
    templateId: 'tpl-001',
    version: 1,
    createdBy: 'user-003',
    createdByName: '赵销售',
    createdAt: '2024-03-25T11:00:00Z',
    updatedAt: '2024-03-25T11:00:00Z',
  },

  // 更多已发送状态
  {
    id: 'quote-008',
    quoteNumber: 'QT-2024-0008',
    customerId: 'cust-008',
    customerName: '南京金融科技公司',
    contactId: 'contact-008',
    contactName: '吴经理',
    opportunityId: 'opp-006',
    opportunityName: '金融 CRM 合规改造',
    status: QuoteStatus.SENT,
    validUntil: '2024-04-10',
    items: [
      {
        id: 'item-021',
        quoteId: 'quote-008',
        productId: 'prod-003',
        productName: '企业 CRM 旗舰版',
        productSku: 'CRM-ENT-001',
        quantity: 1,
        unit: '套/年',
        unitPrice: 12999,
        discount: 5,
        discountType: DiscountType.PERCENTAGE,
        discountAmount: 649.95,
        subtotal: 12349.05,
        taxRate: 6,
        tax: 740.94,
        total: 13089.99,
        sortOrder: 1,
      },
      {
        id: 'item-022',
        quoteId: 'quote-008',
        productId: 'prod-025',
        productName: 'API 开放平台',
        productSku: 'API-PLAT-001',
        quantity: 1,
        unit: '套/年',
        unitPrice: 9999,
        discount: 0,
        discountType: DiscountType.PERCENTAGE,
        discountAmount: 0,
        subtotal: 9999,
        taxRate: 6,
        tax: 599.94,
        total: 10598.94,
        sortOrder: 2,
      },
      {
        id: 'item-023',
        quoteId: 'quote-008',
        productId: 'prod-014',
        productName: '系统集成服务',
        productSku: 'SVC-INT-001',
        quantity: 1,
        unit: '项',
        unitPrice: 30000,
        discount: 15,
        discountType: DiscountType.PERCENTAGE,
        discountAmount: 4500,
        subtotal: 25500,
        taxRate: 6,
        tax: 1530,
        total: 27030,
        sortOrder: 3,
      },
    ],
    subtotal: 47848.05,
    totalDiscount: 5149.95,
    totalTax: 2870.88,
    grandTotal: 50718.93,
    notes: '金融行业客户，需要符合监管要求',
    internalNotes: '客户已有初步意向，预计下周给答复',
    templateId: 'tpl-002',
    version: 1,
    createdBy: 'user-002',
    createdByName: '王顾问',
    createdAt: '2024-03-22T10:00:00Z',
    updatedAt: '2024-03-22T10:00:00Z',
  },
]

// ============================================
// 报价模板数据
// ============================================

export const mockQuoteTemplates: QuoteTemplate[] = [
  {
    id: 'tpl-001',
    name: '标准报价模板',
    description: '适用于一般客户的标准报价单模板',
    isDefault: true,
    isActive: true,
    headerContent: '<h1>报价单</h1><p>感谢您选择我们的产品和服务</p>',
    footerContent: '<p>如有疑问，请联系您的销售代表</p>',
    termsAndConditions: '1. 本报价有效期为30天\n2. 付款方式：预付30%，验收后支付70%\n3. 产品价格不含税',
    paymentTerms: '预付30%，验收后支付70%',
    theme: {
      primaryColor: '#1890ff',
      secondaryColor: '#52c41a',
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
    },
    layout: {
      showLogo: true,
      showCompanyInfo: true,
      showCustomerInfo: true,
      showItemDetails: true,
      showPricingSummary: true,
      showTerms: true,
    },
    defaultValidDays: 30,
    defaultCurrency: 'CNY',
    defaultTaxRate: 6,
    createdBy: 'system',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'tpl-002',
    name: '企业级报价模板',
    description: '适用于大型企业客户的正式报价单模板',
    isDefault: false,
    isActive: true,
    headerContent: '<h1>企业报价方案</h1><p>专为您定制的企业级解决方案</p>',
    footerContent: '<p>期待与您的合作！</p>',
    termsAndConditions: '1. 本报价有效期为45天\n2. 支持分期付款方案\n3. 包含专属技术支持\n4. 可协商定制开发',
    paymentTerms: '可分期付款，具体协商',
    theme: {
      primaryColor: '#722ed1',
      secondaryColor: '#13c2c2',
      fontFamily: 'Georgia, serif',
      fontSize: '16px',
    },
    layout: {
      showLogo: true,
      showCompanyInfo: true,
      showCustomerInfo: true,
      showItemDetails: true,
      showPricingSummary: true,
      showTerms: true,
    },
    defaultValidDays: 45,
    defaultCurrency: 'CNY',
    defaultTaxRate: 6,
    createdBy: 'system',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'tpl-003',
    name: '简洁报价模板',
    description: '适用于快速报价的简洁模板',
    isDefault: false,
    isActive: true,
    headerContent: '<h2>报价单</h2>',
    footerContent: '<p>感谢您的信任</p>',
    termsAndConditions: '本报价有效期30天',
    paymentTerms: '全款预付',
    theme: {
      primaryColor: '#333333',
      secondaryColor: '#666666',
      fontFamily: 'Helvetica, sans-serif',
      fontSize: '12px',
    },
    layout: {
      showLogo: false,
      showCompanyInfo: true,
      showCustomerInfo: true,
      showItemDetails: true,
      showPricingSummary: true,
      showTerms: false,
    },
    defaultValidDays: 30,
    defaultCurrency: 'CNY',
    defaultTaxRate: 6,
    createdBy: 'system',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
]

// ============================================
// 辅助函数
// ============================================

/** 获取产品列表（返回所有产品） */
export function getProductList(): Product[] {
  return mockProducts.filter((p) => p.status === 'active')
}

/** 根据ID获取产品 */
export function getProductById(id: string): Product | undefined {
  return mockProducts.find((p) => p.id === id)
}

/** 价格信息接口 */
export interface ProductPriceInfo {
  productId: string
  unitPrice: number
  listPrice: number
  discount: number
  currency: string
  priceBookId?: string
  priceBookName?: string
}

/** 获取产品价格（根据客户ID和产品ID查询价格表） */
export function getProductPrice(
  customerId: string,
  productId: string,
  quantity: number
): ProductPriceInfo | null {
  // 模拟价格查询逻辑
  // VIP客户享受15%折扣，合作伙伴享受25%折扣
  const product = getProductById(productId)
  if (!product) return null

  // 模拟客户类型判断
  const vipCustomers = ['cust-002', 'cust-003', 'cust-006']
  const partnerCustomers = ['cust-010', 'cust-011']

  let discount = 0
  let priceBookName = '标准价格表'

  if (partnerCustomers.includes(customerId)) {
    discount = 25
    priceBookName = '合作伙伴价格表'
  } else if (vipCustomers.includes(customerId)) {
    discount = 15
    priceBookName = 'VIP客户价格表'
  }

  // 数量折扣逻辑
  if (quantity >= 10) {
    discount += 5 // 10件以上额外5%折扣
  }
  if (quantity >= 50) {
    discount += 10 // 50件以上额外10%折扣
  }

  const unitPrice = product.unitPrice * (1 - discount / 100)

  return {
    productId,
    unitPrice: Math.round(unitPrice * 100) / 100,
    listPrice: product.unitPrice,
    discount,
    currency: 'CNY',
    priceBookName,
  }
}

/** 根据类别筛选产品 */
export function getProductsByCategory(category: ProductCategory): Product[] {
  return mockProducts.filter((p) => p.category === category)
}

/** 根据ID获取报价单 */
export function getQuoteById(id: string): Quote | undefined {
  return mockQuotes.find((q) => q.id === id)
}

/** 根据状态筛选报价单 */
export function getQuotesByStatus(status: QuoteStatus): Quote[] {
  return mockQuotes.filter((q) => q.status === status)
}

/** 根据客户ID获取报价单 */
export function getQuotesByCustomerId(customerId: string): Quote[] {
  return mockQuotes.filter((q) => q.customerId === customerId)
}

/** 获取默认价格表 */
export function getDefaultPriceBook(): PriceBook | undefined {
  return mockPriceBooks.find((pb) => pb.isDefault && pb.isActive)
}

/** 根据ID获取价格表 */
export function getPriceBookById(id: string): PriceBook | undefined {
  return mockPriceBooks.find((pb) => pb.id === id)
}

/** 获取默认报价模板 */
export function getDefaultQuoteTemplate(): QuoteTemplate | undefined {
  return mockQuoteTemplates.find((t) => t.isDefault && t.isActive)
}

/** 计算报价金额 */
export function calculateQuoteAmounts(items: QuoteItem[]): {
  subtotal: number
  totalDiscount: number
  totalTax: number
  grandTotal: number
} {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0)
  const totalDiscount = items.reduce((sum, item) => sum + item.discountAmount, 0)
  const totalTax = items.reduce((sum, item) => sum + item.tax, 0)
  const grandTotal = items.reduce((sum, item) => sum + item.total, 0)
  return { subtotal, totalDiscount, totalTax, grandTotal }
}

/** 生成报价单号 */
export function generateQuoteNumber(): string {
  const year = new Date().getFullYear()
  const existingNumbers = mockQuotes
    .filter((q) => q.quoteNumber.startsWith(`QT-${year}`))
    .map((q) => parseInt(q.quoteNumber.split('-')[2], 10))
  const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1
  return `QT-${year}-${String(nextNumber).padStart(4, '0')}`
}

/** 获取报价统计数据 */
export function getQuoteStats(): {
  total: number
  byStatus: Record<QuoteStatus, number>
  totalAmount: number
  avgDealSize: number
  winRate: number
} {
  const total = mockQuotes.length
  const byStatus = {
    [QuoteStatus.DRAFT]: mockQuotes.filter((q) => q.status === QuoteStatus.DRAFT).length,
    [QuoteStatus.SENT]: mockQuotes.filter((q) => q.status === QuoteStatus.SENT).length,
    [QuoteStatus.ACCEPTED]: mockQuotes.filter((q) => q.status === QuoteStatus.ACCEPTED).length,
    [QuoteStatus.REJECTED]: mockQuotes.filter((q) => q.status === QuoteStatus.REJECTED).length,
    [QuoteStatus.EXPIRED]: mockQuotes.filter((q) => q.status === QuoteStatus.EXPIRED).length,
    [QuoteStatus.REVISED]: mockQuotes.filter((q) => q.status === QuoteStatus.REVISED).length,
  }
  const totalAmount = mockQuotes.reduce((sum, q) => sum + q.grandTotal, 0)
  const avgDealSize = total > 0 ? totalAmount / total : 0
  const acceptedCount = byStatus[QuoteStatus.ACCEPTED]
  const closedCount = acceptedCount + byStatus[QuoteStatus.REJECTED]
  const winRate = closedCount > 0 ? (acceptedCount / closedCount) * 100 : 0

  return { total, byStatus, totalAmount, avgDealSize, winRate }
}

/** 创建报价单 */
export function createQuote(data: Omit<Quote, 'id' | 'quoteNumber' | 'createdAt' | 'updatedAt' | 'version'>): Quote {
  const newQuote: Quote = {
    ...data,
    id: `quote-${Date.now()}`,
    quoteNumber: generateQuoteNumber(),
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  mockQuotes.push(newQuote)
  return newQuote
}

/** 更新报价单 */
export function updateQuote(id: string, data: Partial<Quote>): Quote | undefined {
  const index = mockQuotes.findIndex((q) => q.id === id)
  if (index === -1) return undefined

  mockQuotes[index] = {
    ...mockQuotes[index],
    ...data,
    updatedAt: new Date().toISOString(),
  }
  return mockQuotes[index]
}

// 默认导出所有数据
export default {
  products: mockProducts,
  quotes: mockQuotes,
  priceBooks: mockPriceBooks,
  quoteTemplates: mockQuoteTemplates,
}