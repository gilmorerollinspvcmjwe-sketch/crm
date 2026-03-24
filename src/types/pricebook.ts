/**
 * 价格表管理类型定义
 */

/** 价格表类型枚举 */
export enum PricebookType {
  STANDARD = '标准价格表',
  CUSTOMER = '客户价格表',
  PARTNER = '合作伙伴价格表',
  PROMOTION = '促销价格表',
}

/** 价格表状态枚举 */
export enum PricebookStatus {
  ACTIVE = '启用',
  INACTIVE = '停用',
  DRAFT = '草稿',
}

/** 阶梯定价区间 */
export interface PriceTier {
  minQuantity: number;
  maxQuantity?: number;
  unitPrice: number;
  discount?: number; // 折扣百分比 0-100
}

/** 价格表产品项 */
export interface PricebookItem {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  basePrice: number;
  tiers: PriceTier[]; // 阶梯定价
  currency: string;
  effectiveDate: string;
  expirationDate?: string;
}

/** 价格表 */
export interface Pricebook {
  id: string;
  name: string;
  type: PricebookType;
  status: PricebookStatus;
  description?: string;
  customerId?: string;
  customerName?: string;
  currency: string;
  validFrom: string;
  validTo?: string;
  items: PricebookItem[];
  isSystem?: boolean; // 是否系统价格表，系统价格表不可删除
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}

/** 价格表筛选条件 */
export interface PricebookFilter {
  name?: string;
  type?: PricebookType;
  status?: PricebookStatus;
  customerId?: string;
}
