import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { http } from '@/lib/axios'
import { queryKeys } from '@/lib/query-client'
import type {
  Product,
  ProductListParams,
  PaginatedResponse,
  ApiResponse,
} from '@/types/api'

// ============================================================
// API Functions
// ============================================================
const productApi = {
  list: async (params?: ProductListParams): Promise<PaginatedResponse<Product>> => {
    const { data } = await http.get<PaginatedResponse<Product>>('/products', { params })
    return data
  },

  getById: async (id: string): Promise<Product> => {
    const { data } = await http.get<ApiResponse<Product>>(`/products/${id}`)
    return data.data
  },

  create: async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    const { data } = await http.post<ApiResponse<Product>>('/products', product)
    return data.data
  },

  update: async (id: string, product: Partial<Product>): Promise<Product> => {
    const { data } = await http.patch<ApiResponse<Product>>(`/products/${id}`, product)
    return data.data
  },

  delete: async (id: string): Promise<void> => {
    await http.delete(`/products/${id}`)
  },

  toggleActive: async (id: string, isActive: boolean): Promise<Product> => {
    const { data } = await http.patch<ApiResponse<Product>>(`/products/${id}/toggle`, { isActive })
    return data.data
  },
}

// ============================================================
// Hooks
// ============================================================

/**
 * Fetch paginated product list with filters
 */
export function useProducts(params?: ProductListParams) {
  return useQuery({
    queryKey: queryKeys.products.list(params || {}),
    queryFn: () => productApi.list(params),
    placeholderData: (previousData) => previousData,
  })
}

/**
 * Fetch a single product by ID
 */
export function useProduct(id: string | null) {
  return useQuery({
    queryKey: queryKeys.products.detail(id || ''),
    queryFn: () => productApi.getById(id!),
    enabled: !!id,
  })
}

/**
 * Create a new product
 */
export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) =>
      productApi.create(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() })
    },
  })
}

/**
 * Update an existing product
 */
export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<Product>) =>
      productApi.update(id, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(
        queryKeys.products.detail(updated.id),
        oldData => oldData
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() })
    },
  })
}

/**
 * Delete a product
 */
export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => productApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() })
    },
  })
}

/**
 * Toggle product active status
 */
export function useToggleProductActive() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      productApi.toggleActive(id, isActive),
    onSuccess: (updated) => {
      queryClient.setQueryData(
        queryKeys.products.detail(updated.id),
        oldData => oldData
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() })
    },
  })
}

// Export API for direct usage
export { productApi }
