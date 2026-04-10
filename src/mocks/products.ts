/**
 * 产品管理 Mock 数据
 * 包含 25 条产品数据，覆盖不同分类、价格区间和状态
 */

import type { ProductCategory } from '@/types/api'

// ============ 扩展产品接口 ============

export interface MockProduct {
  id: string
  name: string
  code: string // 产品编码
  category: ProductCategory | '硬件' | '服务' | '解决方案' | '模块' | '增值服务'
  description: string
  price: number // 单价
  cost: number // 成本价
  unit: string // 单位
  stock: number // 库存
  isActive: boolean // 是否上架
  minOrderQty?: number // 最小起订量
  leadTime?: number // 交货周期 (天)
  supplier?: string // 供应商
  tags?: string[]
  specs?: Record<string, string> // 规格参数
  images?: string[] // 产品图片
  createdAt: string
  updatedAt: string
  createdBy: string
}

// ============ 配置 ============

export const productCategoryConfig: Record<ProductCategory | string, { label: string; color: string }> = {
  '软件': { label: '软件', color: 'bg-blue-500' },
  '硬件': { label: '硬件', color: 'bg-green-500' },
  '服务': { label: '服务', color: 'bg-purple-500' },
  '解决方案': { label: '解决方案', color: 'bg-orange-500' },
  '模块': { label: '模块', color: 'bg-cyan-500' },
  '增值服务': { label: '增值服务', color: 'bg-pink-500' },
}

// ============ Mock 数据 ============

export const mockProducts: MockProduct[] = [
  {
    id: 'PROD-001',
    name: 'CRM 专业版',
    code: 'CRM-PRO',
    category: '软件',
    description: '企业级客户关系管理系统，包含销售、市场、服务全流程管理',
    price: 8000,
    cost: 2000,
    unit: '用户/年',
    stock: 9999,
    isActive: true,
    minOrderQty: 10,
    leadTime: 1,
    tags: ['CRM', 'SaaS', '热销'],
    specs: { 部署方式: '云部署/本地部署', 用户数: '不限', 存储: '100GB' },
    createdAt: '2023-01-01T08:00:00Z',
    updatedAt: '2024-03-01T10:00:00Z',
    createdBy: '产品部',
  },
  {
    id: 'PROD-002',
    name: 'SCM 系统',
    code: 'SCM-ENT',
    category: '软件',
    description: '供应链管理系统，支持采购、库存、物流全流程管理',
    price: 800000,
    cost: 300000,
    unit: '套',
    stock: 999,
    isActive: true,
    minOrderQty: 1,
    leadTime: 30,
    tags: ['SCM', '企业级', '定制'],
    specs: { 部署方式: '本地部署', 模块: '采购 + 库存 + 物流', 集成: '支持 ERP 集成' },
    createdAt: '2023-02-01T08:00:00Z',
    updatedAt: '2024-02-15T10:00:00Z',
    createdBy: '产品部',
  },
  {
    id: 'PROD-003',
    name: 'MES 系统',
    code: 'MES-STD',
    category: '软件',
    description: '制造执行系统，支持生产计划、工艺管理、质量控制',
    price: 600000,
    cost: 250000,
    unit: '套',
    stock: 999,
    isActive: true,
    minOrderQty: 1,
    leadTime: 45,
    tags: ['MES', '制造业', '生产管理'],
    specs: { 部署方式: '本地部署', 模块: '计划 + 工艺 + 质量', 接口: '支持设备联网' },
    createdAt: '2023-03-01T08:00:00Z',
    updatedAt: '2024-03-10T10:00:00Z',
    createdBy: '产品部',
  },
  {
    id: 'PROD-004',
    name: '风控平台',
    code: 'RISK-ENT',
    category: '软件',
    description: '金融风控平台，包含反欺诈、信用评估、风险预警',
    price: 1500000,
    cost: 600000,
    unit: '套',
    stock: 999,
    isActive: true,
    minOrderQty: 1,
    leadTime: 60,
    tags: ['风控', '金融', 'AI'],
    specs: { 部署方式: '本地部署', 模型: '内置 AI 模型', 合规: '符合金融监管' },
    createdAt: '2023-04-01T08:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z',
    createdBy: '产品部',
  },
  {
    id: 'PROD-005',
    name: 'AI 模型',
    code: 'AI-MDL',
    category: '模块',
    description: 'AI 智能模型，支持预测分析、智能推荐、自然语言处理',
    price: 150000,
    cost: 50000,
    unit: '个',
    stock: 999,
    isActive: true,
    minOrderQty: 1,
    leadTime: 15,
    tags: ['AI', '机器学习', '智能'],
    specs: { 类型: '预测/推荐/NLP', 精度: '95%+', 训练: '支持自定义训练' },
    createdAt: '2023-05-01T08:00:00Z',
    updatedAt: '2024-03-20T10:00:00Z',
    createdBy: '产品部',
  },
  {
    id: 'PROD-006',
    name: '数据服务',
    code: 'DATA-SVC',
    category: '服务',
    description: '数据采集、清洗、分析一站式服务',
    price: 250000,
    cost: 100000,
    unit: '项',
    stock: 999,
    isActive: true,
    minOrderQty: 1,
    leadTime: 30,
    tags: ['数据', '分析', '服务'],
    specs: { 数据源: '多源接入', 处理: 'ETL+ 分析', 输出: '报表+API' },
    createdAt: '2023-06-01T08:00:00Z',
    updatedAt: '2024-02-28T10:00:00Z',
    createdBy: '产品部',
  },
  {
    id: 'PROD-007',
    name: 'ERP 系统',
    code: 'ERP-STD',
    category: '软件',
    description: '企业资源计划系统，财务、采购、销售、库存一体化',
    price: 500000,
    cost: 200000,
    unit: '套',
    stock: 999,
    isActive: true,
    minOrderQty: 1,
    leadTime: 45,
    tags: ['ERP', '企业级', '一体化'],
    specs: { 模块: '财务 + 采购 + 销售 + 库存', 部署: '云/本地', 用户: '不限' },
    createdAt: '2023-07-01T08:00:00Z',
    updatedAt: '2024-03-05T10:00:00Z',
    createdBy: '产品部',
  },
  {
    id: 'PROD-008',
    name: '硬件集成',
    code: 'HW-INT',
    category: '服务',
    description: '硬件设备集成服务，包含设备安装、调试、联网',
    price: 200000,
    cost: 80000,
    unit: '项',
    stock: 999,
    isActive: true,
    minOrderQty: 1,
    leadTime: 20,
    tags: ['硬件', '集成', '服务'],
    specs: { 设备类型: '工控/传感/网络', 服务: '安装 + 调试', 保修: '1 年' },
    createdAt: '2023-08-01T08:00:00Z',
    updatedAt: '2024-03-12T10:00:00Z',
    createdBy: '产品部',
  },
  {
    id: 'PROD-009',
    name: 'API 集成服务',
    code: 'API-INT',
    category: '服务',
    description: '第三方系统 API 集成服务，支持主流 ERP、CRM、电商平台',
    price: 200000,
    cost: 60000,
    unit: '项',
    stock: 999,
    isActive: true,
    minOrderQty: 1,
    leadTime: 15,
    tags: ['API', '集成', '服务'],
    specs: { 接口数: '不限', 协议: 'REST/SOAP', 认证: 'OAuth/APIKey' },
    createdAt: '2023-09-01T08:00:00Z',
    updatedAt: '2024-03-08T10:00:00Z',
    createdBy: '产品部',
  },
  {
    id: 'PROD-010',
    name: '实施服务',
    code: 'SVC-IMP',
    category: '服务',
    description: '系统实施服务，包含需求调研、系统配置、数据迁移',
    price: 5000,
    cost: 2000,
    unit: '人天',
    stock: 999,
    isActive: true,
    minOrderQty: 5,
    leadTime: 1,
    tags: ['实施', '服务', '咨询'],
    specs: { 内容: '调研 + 配置 + 迁移', 人员: '资深顾问', 交付: '项目文档' },
    createdAt: '2023-01-01T08:00:00Z',
    updatedAt: '2024-03-01T10:00:00Z',
    createdBy: '产品部',
  },
  {
    id: 'PROD-011',
    name: '培训服务',
    code: 'SVC-TRN',
    category: '服务',
    description: '系统使用培训服务，包含操作培训、管理员培训',
    price: 8000,
    cost: 2000,
    unit: '天',
    stock: 999,
    isActive: true,
    minOrderQty: 1,
    leadTime: 7,
    tags: ['培训', '服务', '教育'],
    specs: { 形式: '现场/远程', 内容: '操作 + 管理', 材料: '培训手册' },
    createdAt: '2023-01-01T08:00:00Z',
    updatedAt: '2024-03-01T10:00:00Z',
    createdBy: '产品部',
  },
  {
    id: 'PROD-012',
    name: '年度维保',
    code: 'SVC-MNT',
    category: '服务',
    description: '系统年度维护保养服务，包含技术支持、系统升级、bug 修复',
    price: 140000,
    cost: 40000,
    unit: '年',
    stock: 999,
    isActive: true,
    minOrderQty: 1,
    leadTime: 1,
    tags: ['维保', '服务', '支持'],
    specs: { 响应: '7x24 小时', 升级: '免费升级', 支持: '远程 + 现场' },
    createdAt: '2023-01-01T08:00:00Z',
    updatedAt: '2024-03-01T10:00:00Z',
    createdBy: '产品部',
  },
  {
    id: 'PROD-013',
    name: 'HIS 系统',
    code: 'HIS-ENT',
    category: '软件',
    description: '医院信息系统，支持门诊、住院、药房、检验全流程',
    price: 700000,
    cost: 300000,
    unit: '套',
    stock: 999,
    isActive: true,
    minOrderQty: 1,
    leadTime: 60,
    tags: ['HIS', '医疗', '医院'],
    specs: { 模块: '门诊 + 住院 + 药房 + 检验', 合规: '符合医疗标准', 接口: '医保接口' },
    createdAt: '2023-10-01T08:00:00Z',
    updatedAt: '2024-03-18T10:00:00Z',
    createdBy: '产品部',
  },
  {
    id: 'PROD-014',
    name: '数据迁移',
    code: 'DATA-MIG',
    category: '服务',
    description: '历史数据迁移服务，包含数据清洗、转换、导入',
    price: 150000,
    cost: 50000,
    unit: '项',
    stock: 999,
    isActive: true,
    minOrderQty: 1,
    leadTime: 20,
    tags: ['数据', '迁移', '服务'],
    specs: { 数据量: '不限', 源系统: '主流系统', 验证: '数据校验' },
    createdAt: '2023-11-01T08:00:00Z',
    updatedAt: '2024-03-10T10:00:00Z',
    createdBy: '产品部',
  },
  {
    id: 'PROD-015',
    name: '培训管理系统',
    code: 'EDU-TMS',
    category: '软件',
    description: '教育培训机构管理系统，支持课程、学员、教师管理',
    price: 200000,
    cost: 80000,
    unit: '套',
    stock: 999,
    isActive: true,
    minOrderQty: 1,
    leadTime: 30,
    tags: ['教育', '培训', '管理'],
    specs: { 模块: '课程 + 学员 + 教师', 在线: '支持在线学习', 支付: '支持在线缴费' },
    createdAt: '2023-12-01T08:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z',
    createdBy: '产品部',
  },
  {
    id: 'PROD-016',
    name: '在线学习平台',
    code: 'EDU-LMS',
    category: '软件',
    description: '在线学习平台，支持视频课程、在线考试、学习跟踪',
    price: 80000,
    cost: 30000,
    unit: '套',
    stock: 999,
    isActive: true,
    minOrderQty: 1,
    leadTime: 20,
    tags: ['教育', '在线', '学习'],
    specs: { 形式: '视频 + 直播', 考试: '在线考试', 证书: '电子证书' },
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-03-20T10:00:00Z',
    createdBy: '产品部',
  },
  {
    id: 'PROD-017',
    name: '营销管理系统',
    code: 'RE-MKT',
    category: '软件',
    description: '房地产营销管理系统，支持客户、房源、销售管理',
    price: 420000,
    cost: 180000,
    unit: '套',
    stock: 999,
    isActive: true,
    minOrderQty: 1,
    leadTime: 35,
    tags: ['房地产', '营销', '管理'],
    specs: { 模块: '客户 + 房源 + 销售', 渠道: '多渠道管理', 分析: '营销分析' },
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-03-12T10:00:00Z',
    createdBy: '产品部',
  },
  {
    id: 'PROD-018',
    name: 'TMS 系统',
    code: 'TMS-STD',
    category: '软件',
    description: '运输管理系统，支持订单、调度、运输、结算管理',
    price: 350000,
    cost: 150000,
    unit: '套',
    stock: 999,
    isActive: true,
    minOrderQty: 1,
    leadTime: 30,
    tags: ['物流', 'TMS', '运输'],
    specs: { 模块: '订单 + 调度 + 运输', 跟踪: '实时跟踪', 结算: '自动结算' },
    createdAt: '2024-02-01T08:00:00Z',
    updatedAt: '2024-03-18T10:00:00Z',
    createdBy: '产品部',
  },
  {
    id: 'PROD-019',
    name: 'GPS 集成',
    code: 'GPS-INT',
    category: '硬件',
    description: 'GPS 定位设备集成，支持车辆实时定位、轨迹回放',
    price: 500,
    cost: 200,
    unit: '台',
    stock: 5000,
    isActive: true,
    minOrderQty: 10,
    leadTime: 7,
    tags: ['GPS', '硬件', '定位'],
    specs: { 精度: '5 米内', 电池: '待机 30 天', 防水: 'IP67' },
    createdAt: '2024-02-05T08:00:00Z',
    updatedAt: '2024-03-20T10:00:00Z',
    createdBy: '产品部',
  },
  {
    id: 'PROD-020',
    name: '移动 APP',
    code: 'APP-MOB',
    category: '软件',
    description: '移动端 APP，支持 iOS 和 Android，可定制功能',
    price: 120000,
    cost: 50000,
    unit: '套',
    stock: 999,
    isActive: true,
    minOrderQty: 1,
    leadTime: 30,
    tags: ['移动', 'APP', '定制'],
    specs: { 平台: 'iOS+Android', 功能: '可定制', 发布: '应用商店' },
    createdAt: '2024-02-10T08:00:00Z',
    updatedAt: '2024-03-22T10:00:00Z',
    createdBy: '产品部',
  },
  {
    id: 'PROD-021',
    name: '数据中台',
    code: 'DATA-PLAT',
    category: '解决方案',
    description: '企业级数据中台，包含数据采集、存储、计算、服务',
    price: 2500000,
    cost: 1000000,
    unit: '套',
    stock: 999,
    isActive: true,
    minOrderQty: 1,
    leadTime: 90,
    tags: ['数据', '中台', '企业级'],
    specs: { 架构: 'Lambda 架构', 计算: '批流一体', 服务: 'API 服务' },
    createdAt: '2024-02-15T08:00:00Z',
    updatedAt: '2024-03-21T10:00:00Z',
    createdBy: '产品部',
  },
  {
    id: 'PROD-022',
    name: 'BI 分析',
    code: 'BI-ENT',
    category: '软件',
    description: '商业智能分析系统，支持数据可视化、报表、自助分析',
    price: 800000,
    cost: 300000,
    unit: '套',
    stock: 999,
    isActive: true,
    minOrderQty: 1,
    leadTime: 30,
    tags: ['BI', '分析', '可视化'],
    specs: { 图表: '50+ 图表', 报表: '自助报表', 数据: '多源接入' },
    createdAt: '2024-02-20T08:00:00Z',
    updatedAt: '2024-03-19T10:00:00Z',
    createdBy: '产品部',
  },
  {
    id: 'PROD-023',
    name: '数据治理',
    code: 'DATA-GOV',
    category: '服务',
    description: '数据治理服务，包含数据标准、数据质量、元数据管理',
    price: 500000,
    cost: 200000,
    unit: '项',
    stock: 999,
    isActive: true,
    minOrderQty: 1,
    leadTime: 60,
    tags: ['数据', '治理', '咨询'],
    specs: { 内容: '标准 + 质量 + 元数据', 交付: '治理报告', 工具: '治理平台' },
    createdAt: '2024-02-25T08:00:00Z',
    updatedAt: '2024-03-21T10:00:00Z',
    createdBy: '产品部',
  },
  {
    id: 'PROD-024',
    name: '内容管理系统',
    code: 'CMS-STD',
    category: '软件',
    description: '内容管理系统，支持图文、视频、多平台发布',
    price: 180000,
    cost: 60000,
    unit: '套',
    stock: 999,
    isActive: true,
    minOrderQty: 1,
    leadTime: 20,
    tags: ['CMS', '内容', '媒体'],
    specs: { 内容: '图文 + 视频', 发布: '多平台', 权限: '多级权限' },
    createdAt: '2024-03-01T08:00:00Z',
    updatedAt: '2024-03-17T10:00:00Z',
    createdBy: '产品部',
  },
  {
    id: 'PROD-025',
    name: '项目管理系统',
    code: 'PM-STD',
    category: '软件',
    description: '项目管理系统，支持项目计划、任务、资源、成本管理',
    price: 250000,
    cost: 100000,
    unit: '套',
    stock: 999,
    isActive: true,
    minOrderQty: 1,
    leadTime: 25,
    tags: ['项目管理', '协作', '管理'],
    specs: { 模块: '计划 + 任务 + 资源', 协作: '团队协作', 报表: '项目报表' },
    createdAt: '2024-03-05T08:00:00Z',
    updatedAt: '2024-03-20T10:00:00Z',
    createdBy: '产品部',
  },
]

// ============ 辅助函数 ============

/**
 * 根据 ID 获取产品
 */
export function getProductById(id: string): MockProduct | undefined {
  return mockProducts.find((p) => p.id === id)
}

/**
 * 根据编码获取产品
 */
export function getProductByCode(code: string): MockProduct | undefined {
  return mockProducts.find((p) => p.code === code)
}

/**
 * 获取所有产品
 */
export function getAllProducts(): MockProduct[] {
  return [...mockProducts]
}

/**
 * 根据分类获取产品
 */
export function getProductsByCategory(category: string): MockProduct[] {
  return mockProducts.filter((p) => p.category === category)
}

/**
 * 获取上架产品
 */
export function getActiveProducts(): MockProduct[] {
  return mockProducts.filter((p) => p.isActive)
}

/**
 * 获取产品统计
 */
export function getProductStats() {
  const total = mockProducts.length
  const active = mockProducts.filter((p) => p.isActive).length
  const inactive = total - active
  
  const avgPrice = mockProducts.reduce((sum, p) => sum + p.price, 0) / total
  const totalValue = mockProducts.reduce((sum, p) => sum + p.price * p.stock, 0)
  
  return {
    total,
    active,
    inactive,
    avgPrice: Math.round(avgPrice),
    totalValue,
  }
}

/**
 * 获取分类统计
 */
export function getCategoryStats() {
  const categories: Record<string, { count: number; totalValue: number }> = {}
  
  mockProducts.forEach(p => {
    if (!categories[p.category]) {
      categories[p.category] = { count: 0, totalValue: 0 }
    }
    categories[p.category].count++
    categories[p.category].totalValue += p.price * p.stock
  })
  
  return categories
}
