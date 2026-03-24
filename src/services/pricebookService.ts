/**
 * 价格表服务
 */
import { Pricebook, PricebookType, PricebookStatus, PricebookFilter, PriceTier } from '../types/pricebook';
import {
  pricebooks,
  getPricebookList as mockGetList,
  getPricebookById as mockGetById,
  createPricebook as mockCreate,
  updatePricebook as mockUpdate,
  deletePricebook as mockDelete,
} from '../mock/pricebookData';

/** 获取价格表列表 */
export const getPricebookList = (filters?: {
  name?: string;
  type?: PricebookType;
  status?: PricebookStatus;
  page?: number;
  pageSize?: number;
}): Promise<{ list: Pricebook[]; total: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const result = mockGetList(filters);
      resolve(result);
    }, 300);
  });
};

/** 获取价格表详情 */
export const getPricebookById = (id: string): Promise<Pricebook | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const pricebook = mockGetById(id);
      resolve(pricebook);
    }, 200);
  });
};

/** 创建价格表 */
export const createPricebook = (data: Omit<Pricebook, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'createdByName'>): Promise<Pricebook> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const pricebook = mockCreate(data);
      resolve(pricebook);
    }, 300);
  });
};

/** 更新价格表 */
export const updatePricebook = (id: string, data: Partial<Pricebook>): Promise<Pricebook | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const pricebook = mockUpdate(id, data);
      resolve(pricebook);
    }, 300);
  });
};

/** 删除价格表 */
export const deletePricebook = (id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const success = mockDelete(id);
      resolve(success);
    }, 200);
  });
};

/** 获取价格表类型选项 */
export const getPricebookTypes = (): Promise<{ value: PricebookType; label: string }[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        Object.values(PricebookType).map(type => ({
          value: type,
          label: type,
        }))
      );
    }, 100);
  });
};

/** 获取价格表状态选项 */
export const getPricebookStatuses = (): Promise<{ value: PricebookStatus; label: string }[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        Object.values(PricebookStatus).map(status => ({
          value: status,
          label: status,
        }))
      );
    }, 100);
  });
};

/**
 * 根据客户 ID 和产品 ID 获取价格（支持阶梯定价）
 * @param customerId 客户 ID
 * @param productId 产品 ID
 * @param quantity 数量（用于匹配阶梯价格）
 * @returns 单价和价格表信息
 */
export const getProductPrice = (
  customerId: string | undefined,
  productId: string,
  quantity: number = 1
): Promise<{ unitPrice: number; pricebookId?: string; pricebookName?: string; tier?: PriceTier } | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 1. 首先查找客户专属价格表
      let customerPricebook = pricebooks.find(
        pb => pb.type === '客户价格表' && pb.customerId === customerId && pb.status === '启用'
      );
      
      // 2. 如果没有客户价格表，使用标准价格表
      let pricebook = customerPricebook || pricebooks.find(
        pb => pb.type === '标准价格表' && pb.status === '启用'
      );
      
      if (!pricebook) {
        resolve(undefined);
        return;
      }
      
      // 3. 在价格表中查找产品
      const item = pricebook.items.find(i => i.productId === productId);
      if (!item) {
        resolve(undefined);
        return;
      }
      
      // 4. 根据数量匹配阶梯价格
      let matchedTier = item.tiers.find(
        tier => tier.minQuantity <= quantity && (!tier.maxQuantity || quantity <= tier.maxQuantity)
      );
      
      // 如果没有匹配的阶梯，使用最后一个阶梯（最大数量区间）
      if (!matchedTier && item.tiers.length > 0) {
        matchedTier = item.tiers[item.tiers.length - 1];
      }
      
      resolve({
        unitPrice: matchedTier ? matchedTier.unitPrice : item.basePrice,
        pricebookId: pricebook.id,
        pricebookName: pricebook.name,
        tier: matchedTier,
      });
    }, 200);
  });
};

/**
 * 获取标准价格表
 */
export const getStandardPricebook = (): Promise<Pricebook | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const standard = pricebooks.find(
        pb => pb.type === '标准价格表' && pb.status === '启用'
      );
      resolve(standard);
    }, 200);
  });
};
