/**
 * 价格表管理 Mock 数据
 */
import { Pricebook, PricebookType, PricebookStatus, PricebookItem, PriceTier } from '../types/pricebook';

/** 阶梯定价生成器 */
const generatePriceTiers = (basePrice: number): PriceTier[] => {
  return [
    { minQuantity: 1, maxQuantity: 9, unitPrice: basePrice },
    { minQuantity: 10, maxQuantity: 49, unitPrice: Math.round(basePrice * 0.95) },
    { minQuantity: 50, maxQuantity: 99, unitPrice: Math.round(basePrice * 0.9) },
    { minQuantity: 100, unitPrice: Math.round(basePrice * 0.85) },
  ];
};

/** 价格表产品项生成器 */
const generatePricebookItems = (count: number): PricebookItem[] => {
  const products = [
    { id: 'PROD001', name: 'CRM 企业版许可证', sku: 'CRM-ENT-001', price: 9800 },
    { id: 'PROD002', name: 'CRM 专业版许可证', sku: 'CRM-PRO-002', price: 5800 },
    { id: 'PROD003', name: 'AI 智能助手模块', sku: 'AI-AST-003', price: 12800 },
    { id: 'PROD004', name: '数据分析高级版', sku: 'DATA-ADV-004', price: 8800 },
    { id: 'PROD005', name: '移动端应用许可证', sku: 'MOB-APP-005', price: 3800 },
    { id: 'PROD006', name: '智能呼叫中心设备', sku: 'HW-CALL-006', price: 25800 },
    { id: 'PROD011', name: '系统实施服务', sku: 'SVC-IMP-011', price: 50000 },
    { id: 'PROD016', name: '管理员培训', sku: 'TRN-ADM-016', price: 8000 },
    { id: 'PROD021', name: '年度维护服务', sku: 'MNT-ANN-021', price: 15000 },
    { id: 'PROD022', name: '金牌支持服务', sku: 'MNT-GLD-022', price: 30000 },
  ];

  const items: PricebookItem[] = [];
  for (let i = 0; i < count && i < products.length; i++) {
    const product = products[i];
    items.push({
      id: `PBI${Date.now()}${i}`,
      productId: product.id,
      productName: product.name,
      productSku: product.sku,
      basePrice: product.price,
      tiers: generatePriceTiers(product.price),
      currency: 'CNY',
      effectiveDate: '2026-01-01',
      expirationDate: '2026-12-31',
    });
  }
  return items;
};

/** 价格表列表 */
export const pricebooks: Pricebook[] = [
  {
    id: 'PB001',
    name: '2026 标准价格表',
    type: PricebookType.STANDARD,
    status: PricebookStatus.ACTIVE,
    description: '公司标准产品价格表，适用于所有客户',
    currency: 'CNY',
    validFrom: '2026-01-01',
    validTo: '2026-12-31',
    items: generatePricebookItems(10),
    createdBy: 'USER001',
    createdByName: '管理员',
    createdAt: '2026-01-01 00:00:00',
    updatedAt: '2026-03-01 10:00:00',
  },
  {
    id: 'PB002',
    name: 'VIP 客户价格表 - 北京科技创新',
    type: PricebookType.CUSTOMER,
    status: PricebookStatus.ACTIVE,
    description: 'VIP 客户专属优惠价格',
    customerId: 'CUST001',
    customerName: '北京科技创新有限公司',
    currency: 'CNY',
    validFrom: '2026-01-01',
    validTo: '2026-12-31',
    items: generatePricebookItems(10).map(item => ({
      ...item,
      basePrice: Math.round(item.basePrice * 0.85),
      tiers: item.tiers.map(tier => ({
        ...tier,
        unitPrice: Math.round(tier.unitPrice * 0.85),
      })),
    })),
    createdBy: 'USER002',
    createdByName: '销售经理',
    createdAt: '2026-01-15 09:00:00',
    updatedAt: '2026-02-20 14:00:00',
  },
  {
    id: 'PB003',
    name: '合作伙伴价格表 - 金牌',
    type: PricebookType.PARTNER,
    status: PricebookStatus.ACTIVE,
    description: '金牌合作伙伴专属价格',
    currency: 'CNY',
    validFrom: '2026-01-01',
    validTo: '2026-12-31',
    items: generatePricebookItems(10).map(item => ({
      ...item,
      basePrice: Math.round(item.basePrice * 0.8),
      tiers: item.tiers.map(tier => ({
        ...tier,
        unitPrice: Math.round(tier.unitPrice * 0.8),
      })),
    })),
    createdBy: 'USER001',
    createdByName: '管理员',
    createdAt: '2026-01-10 11:00:00',
    updatedAt: '2026-03-05 16:00:00',
  },
  {
    id: 'PB004',
    name: '2026 春季促销价格表',
    type: PricebookType.PROMOTION,
    status: PricebookStatus.ACTIVE,
    description: '春季促销活动专属价格',
    currency: 'CNY',
    validFrom: '2026-03-01',
    validTo: '2026-05-31',
    items: generatePricebookItems(8).map(item => ({
      ...item,
      basePrice: Math.round(item.basePrice * 0.9),
      tiers: item.tiers.map(tier => ({
        ...tier,
        unitPrice: Math.round(tier.unitPrice * 0.9),
      })),
    })),
    createdBy: 'USER003',
    createdByName: '市场经理',
    createdAt: '2026-02-25 10:00:00',
    updatedAt: '2026-02-28 09:00:00',
  },
  {
    id: 'PB005',
    name: '2025 标准价格表',
    type: PricebookType.STANDARD,
    status: PricebookStatus.INACTIVE,
    description: '已停用的旧版价格表',
    currency: 'CNY',
    validFrom: '2025-01-01',
    validTo: '2025-12-31',
    items: generatePricebookItems(8),
    createdBy: 'USER001',
    createdByName: '管理员',
    createdAt: '2025-01-01 00:00:00',
    updatedAt: '2026-01-01 00:00:00',
  },
  {
    id: 'PB006',
    name: '战略客户价格表 - 上海智能制造',
    type: PricebookType.CUSTOMER,
    status: PricebookStatus.ACTIVE,
    description: '战略客户特别优惠',
    customerId: 'CUST002',
    customerName: '上海智能制造有限公司',
    currency: 'CNY',
    validFrom: '2026-02-01',
    validTo: '2027-01-31',
    items: generatePricebookItems(10).map(item => ({
      ...item,
      basePrice: Math.round(item.basePrice * 0.82),
      tiers: item.tiers.map(tier => ({
        ...tier,
        unitPrice: Math.round(tier.unitPrice * 0.82),
      })),
    })),
    createdBy: 'USER002',
    createdByName: '销售经理',
    createdAt: '2026-01-28 14:00:00',
    updatedAt: '2026-02-01 09:00:00',
  },
  {
    id: 'PB007',
    name: '新产品试销价格表',
    type: PricebookType.PROMOTION,
    status: PricebookStatus.DRAFT,
    description: '新产品试销期间特惠价格',
    currency: 'CNY',
    validFrom: '2026-04-01',
    validTo: '2026-06-30',
    items: generatePricebookItems(5),
    createdBy: 'USER003',
    createdByName: '市场经理',
    createdAt: '2026-03-10 11:00:00',
    updatedAt: '2026-03-12 15:00:00',
  },
  {
    id: 'PB008',
    name: '教育行业专属价格表',
    type: PricebookType.PARTNER,
    status: PricebookStatus.ACTIVE,
    description: '教育行业合作伙伴专属价格',
    currency: 'CNY',
    validFrom: '2026-01-01',
    validTo: '2026-12-31',
    items: generatePricebookItems(10).map(item => ({
      ...item,
      basePrice: Math.round(item.basePrice * 0.75),
      tiers: item.tiers.map(tier => ({
        ...tier,
        unitPrice: Math.round(tier.unitPrice * 0.75),
      })),
    })),
    createdBy: 'USER001',
    createdByName: '管理员',
    createdAt: '2026-01-05 10:00:00',
    updatedAt: '2026-01-20 16:00:00',
  },
];

/** 获取价格表列表 */
export const getPricebookList = (filters?: {
  name?: string;
  type?: PricebookType;
  status?: PricebookStatus;
  page?: number;
  pageSize?: number;
}) => {
  let filtered = [...pricebooks];

  if (filters?.name) {
    filtered = filtered.filter(pb => pb.name.includes(filters.name!));
  }

  if (filters?.type) {
    filtered = filtered.filter(pb => pb.type === filters.type);
  }

  if (filters?.status) {
    filtered = filtered.filter(pb => pb.status === filters.status);
  }

  const total = filtered.length;
  const page = filters?.page || 1;
  const pageSize = filters?.pageSize || 20;
  const start = (page - 1) * pageSize;
  const list = filtered.slice(start, start + pageSize);

  return { list, total };
};

/** 获取价格表详情 */
export const getPricebookById = (id: string): Pricebook | undefined => {
  return pricebooks.find(pb => pb.id === id);
};

/** 创建价格表 */
export const createPricebook = (data: Omit<Pricebook, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'createdByName'>): Pricebook => {
  const newPricebook: Pricebook = {
    ...data,
    id: `PB${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'USER001',
    createdByName: '当前用户',
  };
  pricebooks.push(newPricebook);
  return newPricebook;
};

/** 更新价格表 */
export const updatePricebook = (id: string, data: Partial<Pricebook>): Pricebook | undefined => {
  const index = pricebooks.findIndex(pb => pb.id === id);
  if (index === -1) return undefined;

  pricebooks[index] = {
    ...pricebooks[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  return pricebooks[index];
};

/** 删除价格表 */
export const deletePricebook = (id: string): boolean => {
  const index = pricebooks.findIndex(pb => pb.id === id);
  if (index === -1) return false;

  pricebooks.splice(index, 1);
  return true;
};
