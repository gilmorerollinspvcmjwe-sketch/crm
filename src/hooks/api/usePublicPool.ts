/**
 * 公海池 API Hooks
 * 提供公海池客户的查询、领取、退回等操作
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type {
  CustomerExtended,
  PublicPoolQueryParams,
  ClaimCustomerRequest,
  ReturnToPoolRequest,
  PublicPoolConfig,
} from '@/types/customer'
import { apiService } from '@/lib/api-service'

// ============ API 服务 ============

const PUBLIC_POOL_BASE_URL = '/api/public-pool'

/**
 * 获取公海池客户列表
 */
export async function getPublicPoolCustomers(params: PublicPoolQueryParams): Promise<{ data: CustomerExtended[]; total: number }> {
  const response = await apiService.get(PUBLIC_POOL_BASE_URL, { params })
  return response.data
}

/**
 * 领取公海客户
 */
export async function claimCustomer(request: ClaimCustomerRequest): Promise<CustomerExtended> {
  const response = await apiService.post(`${PUBLIC_POOL_BASE_URL}/claim`, request)
  return response.data
}

/**
 * 退回客户到公海
 */
export async function returnToPool(request: ReturnToPoolRequest): Promise<CustomerExtended> {
  const response = await apiService.post(`${PUBLIC_POOL_BASE_URL}/return`, request)
  return response.data
}

/**
 * 获取公海池配置
 */
export async function getPublicPoolConfig(): Promise<PublicPoolConfig> {
  const response = await apiService.get(`${PUBLIC_POOL_BASE_URL}/config`)
  return response.data
}

/**
 * 更新公海池配置
 */
export async function updatePublicPoolConfig(config: Partial<PublicPoolConfig>): Promise<PublicPoolConfig> {
  const response = await apiService.put(`${PUBLIC_POOL_BASE_URL}/config`, config)
  return response.data
}

// ============ Query Keys ============

export const publicPoolKeys = {
  all: ['public-pool'] as const,
  lists: () => [...publicPoolKeys.all, 'list'] as const,
  list: (params: PublicPoolQueryParams) => [...publicPoolKeys.lists(), params] as const,
  config: () => [...publicPoolKeys.all, 'config'] as const,
}

// ============ Hooks ============

/**
 * 获取公海池客户列表
 */
export function usePublicPoolCustomers(params: PublicPoolQueryParams = {}) {
  return useQuery({
    queryKey: publicPoolKeys.list(params),
    queryFn: () => getPublicPoolCustomers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * 领取公海客户
 */
export function useClaimCustomer() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: claimCustomer,
    onSuccess: () => {
      // Invalidate public pool list
      queryClient.invalidateQueries({ queryKey: publicPoolKeys.lists() })
    },
  })
}

/**
 * 退回客户到公海
 */
export function useReturnToPool() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: returnToPool,
    onSuccess: () => {
      // Invalidate public pool list
      queryClient.invalidateQueries({ queryKey: publicPoolKeys.lists() })
    },
  })
}

/**
 * 获取公海池配置
 */
export function usePublicPoolConfig() {
  return useQuery({
    queryKey: publicPoolKeys.config(),
    queryFn: getPublicPoolConfig,
  })
}

/**
 * 更新公海池配置
 */
export function useUpdatePublicPoolConfig() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: updatePublicPoolConfig,
    onSuccess: () => {
      // Invalidate config
      queryClient.invalidateQueries({ queryKey: publicPoolKeys.config() })
      // Also invalidate public pool list as rules may have changed
      queryClient.invalidateQueries({ queryKey: publicPoolKeys.lists() })
    },
  })
}
