/**
 * 产品管理 Mock API Hooks
 * 提供产品列表、详情、创建、更新、删除的 React Query hooks
 * 
 * 基于 mocks/products.ts 中的 Mock 数据
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { MockProduct } from '@/mocks/products'
import { 
  mockProducts, 
  getProductById, 
  getProductByCode,
  getAllProducts,
  getProductsByCategory,
  getActiveProducts,
  getProductStats,
  getCategoryStats,
} from '@/mocks/products'

// ============ 延迟模拟 ============

const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms))

// ============ 模拟数据存储 (支持 CRUD 操作) ============

let productsStore: MockProduct[] = [...mockProducts]

function resetStore() {
  productsStore = [...mockProducts]
}

// 生成下一个产品编码
function getNextProductCode(category: string): string {
  const prefix = category.substring(0, 3).toUpperCase()
  const existingCodes = productsStore
    .filter(p => p.code.startsWith(prefix))
    .map(p => parseInt(p.code.split('-')[1] || '0'))
  const nextNum = existingCodes.length > 0 ? Math.max(...existingCodes) + 1 : 1
  return `${prefix}-${String(nextNum).padStart(3, '0')}`
}

// ============ CRUD 操作 ============

const productCrud = {
  /**
   * 获取产品列表
   */
  async list(params?: {
    category?: string
    search?: string
    isActive?: boolean
    minPrice?: number
    maxPrice?: number
    page?: number
    pageSize?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<{ data: MockProduct[]; total: number }> {
    await delay(300 + Math.random() * 200)
    
    let result = [...productsStore]
    
    if (params?.category) {
      result = result.filter(p => p.category === params.category)
    }
    
    if (params?.isActive !== undefined) {
      result = result.filter(p => p.isActive === params.isActive)
    }
    
    if (params?.minPrice !== undefined) {
      result = result.filter(p => p.price >= params.minPrice!)
    }
    
    if (params?.maxPrice !== undefined) {
      result = result.filter(p => p.price <= params.maxPrice!)
    }
    
    if (params?.search) {
      const searchLower = params.search.toLowerCase()
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.code.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      )
    }
    
    // 排序
    if (params?.sortBy) {
      const { sortBy, sortOrder = 'asc' } = params
      result.sort((a, b) => {
        const aVal = a[sortBy as keyof MockProduct]
        const bVal = b[sortBy as keyof MockProduct]
        if (aVal == null && bVal == null) return 0
        if (aVal == null) return sortOrder === 'asc' ? 1 : -1
        if (bVal == null) return sortOrder === 'asc' ? -1 : 1
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
        return 0
      })
    }
    
    const total = result.length
    
    // 分页
    if (params?.page && params?.pageSize) {
      const start = (params.page - 1) * params.pageSize
      const end = start + params.pageSize
      result = result.slice(start, end)
    }
    
    return { data: result, total }
  },

  /**
   * 获取单个产品
   */
  async getById(id: string): Promise<MockProduct | null> {
    await delay(200 + Math.random() * 100)
    return getProductById(id) ?? null
  },

  /**
   * 创建产品
   */
  async create(product: Omit<MockProduct, 'id' | 'code' | 'createdAt' | 'updatedAt'>): Promise<MockProduct> {
    await delay(400 + Math.random() * 200)
    
    const now = new Date().toISOString()
    const newProduct: MockProduct = {
      ...product,
      id: `PROD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      code: getNextProductCode(product.category),
      createdAt: now,
      updatedAt: now,
    }
    
    productsStore.push(newProduct)
    return newProduct
  },

  /**
   * 更新产品
   */
  async update(id: string, updates: Partial<MockProduct>): Promise<MockProduct | null> {
    await delay(300 + Math.random() * 200)
    
    const index = productsStore.findIndex(p => p.id === id)
    if (index === -1) return null
    
    productsStore[index] = {
      ...productsStore[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    
    return productsStore[index]
  },

  /**
   * 删除产品
   */
  async delete(id: string): Promise<boolean> {
    await delay(300 + Math.random() * 200)
    
    const index = productsStore.findIndex(p => p.id === id)
    if (index === -1) return false
    
    productsStore.splice(index, 1)
    return true
  },

  /**
   * 批量删除产品
   */
  async batchDelete(ids: string[]): Promise<number> {
    await delay(400 + Math.random() * 200)
    
    let count = 0
    for (const id of ids) {
      const index = productsStore.findIndex(p => p.id === id)
      if (index !== -1) {
        productsStore.splice(index, 1)
        count++
      }
    }
    
    return count
  },

  /**
   * 上架产品
   */
  async activate(id: string): Promise<MockProduct | null> {
    return this.update(id, { isActive: true })
  },

  /**
   * 下架产品
   */
  async deactivate(id: string): Promise<MockProduct | null> {
    return this.update(id, { isActive: false })
  },

  /**
   * 调整库存
   */
  async adjustStock(id: string, quantity: number, type: 'in' | 'out'): Promise<MockProduct | null> {
    await delay(200)
    
    const index = productsStore.findIndex(p => p.id === id)
    if (index === -1) return null
    
    const current = productsStore[index]
    const newStock = type === 'in' ? current.stock + quantity : current.stock - quantity
    
    if (newStock < 0) {
      throw new Error('库存不足')
    }
    
    productsStore[index] = {
      ...current,
      stock: newStock,
      updatedAt: new Date().toISOString(),
    }
    
    return productsStore[index]
  },

  /**
   * 获取产品统计
   */
  async getStats() {
    await delay(200)
    return getProductStats()
  },

  /**
   * 获取分类统计
   */
  async getCategoryStats() {
    await delay(200)
    return getCategoryStats()
  },

  /**
   * 导入产品
   */
  async import(products: Omit<MockProduct, 'id' | 'code' | 'createdAt' | 'updatedAt'>[]): Promise<MockProduct[]> {
    await delay(500 + Math.random() * 300)
    
    const now = new Date().toISOString()
    const newProducts: MockProduct[] = products.map(p => ({
      ...p,
      id: `PROD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      code: getNextProductCode(p.category),
      createdAt: now,
      updatedAt: now,
    }))
    
    productsStore.push(...newProducts)
    return newProducts
  },
}

// ============ React Query Keys ============

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params?: Record<string, unknown>) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  stats: () => [...productKeys.all, 'stats'] as const,
  categoryStats: () => [...productKeys.all, 'category-stats'] as const,
}

// ============ React Query Hooks ============

/**
 * 获取产品列表
 */
export function useProducts(params?: {
  category?: string
  search?: string
  isActive?: boolean
  minPrice?: number
  maxPrice?: number
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productCrud.list(params),
  })
}

/**
 * 获取单个产品
 */
export function useProduct(id: string | null) {
  return useQuery({
    queryKey: productKeys.detail(id || ''),
    queryFn: () => productCrud.getById(id!),
    enabled: !!id,
  })
}

/**
 * 获取上架产品
 */
export function useActiveProducts() {
  return useQuery({
    queryKey: [...productKeys.all, 'active'],
    queryFn: () => ({ data: getActiveProducts(), total: getActiveProducts().length }),
  })
}

/**
 * 获取产品统计
 */
export function useProductStats() {
  return useQuery({
    queryKey: productKeys.stats(),
    queryFn: () => productCrud.getStats(),
  })
}

/**
 * 获取分类统计
 */
export function useCategoryStats() {
  return useQuery({
    queryKey: productKeys.categoryStats(),
    queryFn: () => productCrud.getCategoryStats(),
  })
}

/**
 * 创建产品
 */
export function useCreateProduct() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (product: Parameters<typeof productCrud.create>[0]) => 
      productCrud.create(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      queryClient.invalidateQueries({ queryKey: productKeys.stats() })
      queryClient.invalidateQueries({ queryKey: productKeys.categoryStats() })
    },
  })
}

/**
 * 更新产品
 */
export function useUpdateProduct() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, ...updates }: { id: string } & Partial<MockProduct>) =>
      productCrud.update(id, updates),
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(productKeys.detail(data.id), data)
      }
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
    },
  })
}

/**
 * 删除产品
 */
export function useDeleteProduct() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => productCrud.delete(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: productKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      queryClient.invalidateQueries({ queryKey: productKeys.stats() })
    },
  })
}

/**
 * 批量删除产品
 */
export function useBatchDeleteProducts() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (ids: string[]) => productCrud.batchDelete(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      queryClient.invalidateQueries({ queryKey: productKeys.stats() })
    },
  })
}

/**
 * 上架产品
 */
export function useActivateProduct() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => productCrud.activate(id),
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(productKeys.detail(data.id), data)
      }
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
    },
  })
}

/**
 * 下架产品
 */
export function useDeactivateProduct() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => productCrud.deactivate(id),
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(productKeys.detail(data.id), data)
      }
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
    },
  })
}

/**
 * 调整库存
 */
export function useAdjustStock() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, quantity, type }: { id: string; quantity: number; type: 'in' | 'out' }) =>
      productCrud.adjustStock(id, quantity, type),
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(productKeys.detail(data.id), data)
      }
    },
  })
}

/**
 * 导入产品
 */
export function useImportProducts() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (products: Parameters<typeof productCrud.import>[0]) =>
      productCrud.import(products),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      queryClient.invalidateQueries({ queryKey: productKeys.stats() })
      queryClient.invalidateQueries({ queryKey: productKeys.categoryStats() })
    },
  })
}

// ============ 导出配置 ============

export { productCategoryConfig } from '@/mocks/products'
export type { MockProduct }
