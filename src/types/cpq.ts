/**
 * CPQ 报价管理模块类型定义
 */

/** 报价单状态枚举 */
export enum QuoteStatus {
  DRAFT = '草稿',
  SENT = '已发送',
  ACCEPTED = '已接受',
  REJECTED = '已拒绝',
  EXPIRED = '已过期'
}

/** 产品类别枚举 */
export enum ProductCategory {
  SOFTWARE = '软件',
  HARDWARE = '硬件',
  SERVICE = '服务',
  TRAINING = '培训',
  MAINTENANCE = '维护'
}

/** 产品接口 */
export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  unitPrice: number;
  unit: string;
  description: string;
  sku: string;
  inStock: boolean;
  // 规格参数
  specification?: string; // 规格
  model?: string; // 型号
  // 价格信息
  costPrice?: number; // 成本价
  // 库存信息
  stockQuantity?: number; // 库存数量
  stockWarning?: number; // 库存预警阈值
  // 状态
  status?: 'active' | 'inactive'; // 上架/下架，默认为 active
}

/** 报价产品明细接口 */
export interface QuoteProduct {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number; // 折扣百分比 0-100
  subtotal: number; // 小计
  tax: number; // 税费
  total: number; // 总计
}

/** 报价单接口 */
export interface Quote {
  id: string;
  quoteNumber: string; // 报价单号
  customerId: string;
  customerName: string;
  contactId?: string;
  contactName?: string;
  opportunityId?: string;
  opportunityName?: string;
  status: QuoteStatus;
  validUntil: string; // 有效期至
  products: QuoteProduct[];
  subtotal: number; // 小计总和
  totalDiscount: number; // 总折扣金额
  totalTax: number; // 总税费
  grandTotal: number; // 总计
  notes?: string; // 备注
  terms?: string; // 条款
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  convertedToContractId?: string; // 转合同后的合同 ID
}

/** 报价筛选条件接口 */
export interface QuoteFilter {
  quoteNumber?: string;
  customerName?: string;
  status?: QuoteStatus;
  createdBy?: string;
}

/** 报价统计接口 */
export interface QuoteStats {
  total: number;
  byStatus: Record<QuoteStatus, number>;
  totalAmount: number;
  convertedCount: number;
}
