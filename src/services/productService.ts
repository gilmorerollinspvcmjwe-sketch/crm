/**
 * 产品库服务
 */
import { Product, ProductCategory } from '../types/cpq';
import { products as mockProducts } from '../mock/cpqData';

/** 获取产品列表 */
export const getProducts = (filters?: {
  category?: ProductCategory;
  search?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ list: Product[]; total: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = [...mockProducts];

      if (filters?.category) {
        filtered = filtered.filter(p => p.category === filters.category);
      }

      if (filters?.search) {
        const search = filters.search.toLowerCase();
        filtered = filtered.filter(
          p =>
            p.name.toLowerCase().includes(search) ||
            p.sku.toLowerCase().includes(search) ||
            p.description.toLowerCase().includes(search)
        );
      }

      const total = filtered.length;
      const page = filters?.page || 1;
      const pageSize = filters?.pageSize || 20;
      const start = (page - 1) * pageSize;
      const list = filtered.slice(start, start + pageSize);

      resolve({ list, total });
    }, 300);
  });
};

/** 获取产品详情 */
export const getProductById = (id: string): Promise<Product | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const product = mockProducts.find(p => p.id === id);
      resolve(product);
    }, 200);
  });
};

/** 创建产品 */
export const createProduct = (product: Omit<Product, 'id'>): Promise<Product> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newProduct: Product = {
        ...product,
        id: `PROD${Date.now()}`,
      };
      resolve(newProduct);
    }, 300);
  });
};

/** 更新产品 */
export const updateProduct = (id: string, product: Partial<Product>): Promise<Product | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockProducts.findIndex(p => p.id === id);
      if (index === -1) {
        resolve(undefined);
        return;
      }
      resolve({ ...mockProducts[index], ...product });
    }, 300);
  });
};

/** 删除产品 */
export const deleteProduct = (id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockProducts.findIndex(p => p.id === id);
      resolve(index !== -1);
    }, 200);
  });
};

/** 获取产品分类列表 */
export const getProductCategories = (): Promise<{ value: ProductCategory; label: string; count: number }[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const categories = Object.values(ProductCategory).map(cat => ({
        value: cat,
        label: cat,
        count: mockProducts.filter(p => p.category === cat).length,
      }));
      resolve(categories);
    }, 200);
  });
};

/** 批量导入产品 */
export const importProducts = (data: Omit<Product, 'id'>[]): Promise<{ success: number; failed: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: data.length,
        failed: 0,
      });
    }, 500);
  });
};
