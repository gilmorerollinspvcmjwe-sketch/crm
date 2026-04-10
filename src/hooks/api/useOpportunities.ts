import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { http } from '@/lib/axios'
import { queryKeys } from '@/lib/query-client'
import type {
  Opportunity,
  OpportunityStage,
  OpportunityListParams,
  PaginatedResponse,
  ApiResponse,
} from '@/types/api'

// ============================================================
// Opportunity Stats Types
// ============================================================

export interface OpportunityStats {
  total: number
  byStage: Record<OpportunityStage, { count: number; amount: number }>
  totalAmount: number
  weightedAmount: number
  wonCount: number
  lostCount: number
  activeCount: number
  winRate: number
  avgDealSize: number
}

export interface StageStats {
  stage: OpportunityStage
  count: number
  amount: number
  weightedAmount: number
  color: string
}

// ============================================================
// API Functions
// ============================================================
const opportunityApi = {
  list: async (params?: OpportunityListParams): Promise<PaginatedResponse<Opportunity>> => {
    const { data } = await http.get<PaginatedResponse<Opportunity>>('/opportunities', { params })
    return data
  },

  getById: async (id: string): Promise<Opportunity> => {
    const { data } = await http.get<ApiResponse<Opportunity>>(`/opportunities/${id}`)
    return data.data
  },

  create: async (opportunity: Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'>): Promise<Opportunity> => {
    const { data } = await http.post<ApiResponse<Opportunity>>('/opportunities', opportunity)
    return data.data
  },

  update: async (id: string, opportunity: Partial<Opportunity>): Promise<Opportunity> => {
    const { data } = await http.patch<ApiResponse<Opportunity>>(`/opportunities/${id}`, opportunity)
    return data.data
  },

  delete: async (id: string): Promise<void> => {
    await http.delete(`/opportunities/${id}`)
  },

  updateStage: async (id: string, stage: Opportunity['stage']): Promise<Opportunity> => {
    const { data } = await http.patch<ApiResponse<Opportunity>>(`/opportunities/${id}/stage`, { stage })
    return data.data
  },

  getStats: async (): Promise<OpportunityStats> => {
    const { data } = await http.get<ApiResponse<OpportunityStats>>('/opportunities/stats')
    return data.data
  },

  advanceStage: async (id: string): Promise<Opportunity> => {
    const { data } = await http.patch<ApiResponse<Opportunity>>(`/opportunities/${id}/advance`)
    return data.data
  },

  closeWon: async (id: string, actualAmount?: number, actualCloseDate?: string): Promise<Opportunity> => {
    const { data } = await http.patch<ApiResponse<Opportunity>>(`/opportunities/${id}/close-won`, {
      actualAmount,
      actualCloseDate,
    })
    return data.data
  },

  closeLost: async (id: string, reason?: string): Promise<Opportunity> => {
    const { data } = await http.patch<ApiResponse<Opportunity>>(`/opportunities/${id}/close-lost`, {
      reason,
    })
    return data.data
  },
}

// ============================================================
// Hooks
// ============================================================

/**
 * Fetch paginated opportunity list with filters
 */
export function useOpportunities(params?: OpportunityListParams) {
  return useQuery({
    queryKey: queryKeys.opportunities.list(params || {}),
    queryFn: () => opportunityApi.list(params),
    placeholderData: (previousData) => previousData,
  })
}

/**
 * Fetch a single opportunity by ID
 */
export function useOpportunity(id: string | null) {
  return useQuery({
    queryKey: queryKeys.opportunities.detail(id || ''),
    queryFn: () => opportunityApi.getById(id!),
    enabled: !!id,
  })
}

/**
 * Create a new opportunity
 */
export function useCreateOpportunity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (opportunity: Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'>) =>
      opportunityApi.create(opportunity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.opportunities.lists() })
      queryClient.invalidateQueries({ queryKey: ['crm', 'opportunities', 'stats'] })
    },
  })
}

/**
 * Update an existing opportunity
 */
export function useUpdateOpportunity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<Opportunity>) =>
      opportunityApi.update(id, data),
    onSuccess: (updated) => {
      // Update cache with new data
      queryClient.setQueryData(
        queryKeys.opportunities.detail(updated.id),
        updated
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.opportunities.lists() })
      queryClient.invalidateQueries({ queryKey: ['crm', 'opportunities', 'stats'] })
    },
  })
}

/**
 * Delete an opportunity
 */
export function useDeleteOpportunity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => opportunityApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.opportunities.lists() })
      queryClient.invalidateQueries({ queryKey: ['crm', 'opportunities', 'stats'] })
    },
  })
}

/**
 * Update opportunity stage (useful for Kanban board)
 */
export function useUpdateOpportunityStage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: Opportunity['stage'] }) =>
      opportunityApi.updateStage(id, stage),
    onSuccess: (updated) => {
      queryClient.setQueryData(
        queryKeys.opportunities.detail(updated.id),
        updated
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.opportunities.lists() })
      queryClient.invalidateQueries({ queryKey: ['crm', 'opportunities', 'stats'] })
    },
  })
}

/**
 * Fetch opportunity statistics
 */
export function useOpportunityStats() {
  return useQuery({
    queryKey: ['crm', 'opportunities', 'stats'],
    queryFn: () => opportunityApi.getStats(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

/**
 * Advance opportunity to next stage
 */
export function useAdvanceOpportunityStage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => opportunityApi.advanceStage(id),
    onSuccess: (updated) => {
      queryClient.setQueryData(
        queryKeys.opportunities.detail(updated.id),
        updated
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.opportunities.lists() })
      queryClient.invalidateQueries({ queryKey: ['crm', 'opportunities', 'stats'] })
    },
  })
}

/**
 * Close opportunity as won
 */
export function useCloseOpportunityWon() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, actualAmount, actualCloseDate }: {
      id: string
      actualAmount?: number
      actualCloseDate?: string
    }) => opportunityApi.closeWon(id, actualAmount, actualCloseDate),
    onSuccess: (updated) => {
      queryClient.setQueryData(
        queryKeys.opportunities.detail(updated.id),
        updated
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.opportunities.lists() })
      queryClient.invalidateQueries({ queryKey: ['crm', 'opportunities', 'stats'] })
    },
  })
}

/**
 * Close opportunity as lost
 */
export function useCloseOpportunityLost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      opportunityApi.closeLost(id, reason),
    onSuccess: (updated) => {
      queryClient.setQueryData(
        queryKeys.opportunities.detail(updated.id),
        updated
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.opportunities.lists() })
      queryClient.invalidateQueries({ queryKey: ['crm', 'opportunities', 'stats'] })
    },
  })
}

/**
 * Calculate stage stats from opportunity list data
 */
export function useStageStats(opportunities: Opportunity[] | undefined): StageStats[] {
  const stages: OpportunityStage[] = ['初步接触', '需求确认', '方案报价', '合同谈判', '成交', '失败']
  
  const stageColors: Record<OpportunityStage, string> = {
    '初步接触': '#6B7280',
    '需求确认': '#3B82F6',
    '方案报价': '#F59E0B',
    '合同谈判': '#8B5CF6',
    '成交': '#10B981',
    '失败': '#EF4444',
  }

  const probabilityMap: Record<OpportunityStage, number> = {
    '初步接触': 10,
    '需求确认': 30,
    '方案报价': 50,
    '合同谈判': 75,
    '成交': 100,
    '失败': 0,
  }

  if (!opportunities) return []

  return stages.map(stage => {
    const stageOpps = opportunities.filter(o => o.stage === stage)
    const amount = stageOpps.reduce((sum, o) => sum + o.amount, 0)
    const weightedAmount = stageOpps.reduce(
      (sum, o) => sum + o.amount * (o.probability || probabilityMap[stage]) / 100,
      0
    )

    return {
      stage,
      count: stageOpps.length,
      amount,
      weightedAmount,
      color: stageColors[stage],
    }
  })
}

// Export API for direct usage
export { opportunityApi }
