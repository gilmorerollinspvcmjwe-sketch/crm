import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-client'
import type { ApiError } from '@/types/api'

// ============================================================
// Types
// ============================================================

export interface AIConfig {
  model: string
  apiKey?: string
  customEndpoint?: string
  maxTokens: number
  temperature: number
  enableAISuggestions: boolean
  enableAutoSummary: boolean
  enableSmartReply: boolean
  enableCustomerAnalysis: boolean
  enableOpportunityPrediction: boolean
  dailyRequestLimit: number
  enableRequestLog: boolean
}

export interface AIPromptTemplate {
  id: string
  name: string
  type: string
  content: string
  description?: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface AIHistoryItem {
  id: string
  type: 'customer_analysis' | 'opportunity_prediction' | 'email_draft' | 'summary' | 'custom'
  prompt: string
  response: string
  tokensUsed: number
  model: string
  createdAt: string
  relatedEntity?: {
    type: 'customer' | 'opportunity' | 'contact'
    id: string
    name: string
  }
}

export interface AIUsageStats {
  totalRequests: number
  totalTokensUsed: number
  avgTokensPerRequest: number
  requestsByType: Record<string, number>
  dailyRequests: Array<{ date: string; count: number; tokens: number }>
  remainingRequests: number
}

// ============================================================
// API Functions (Mock)
// ============================================================

const aiApi = {
  // Config
  getConfig: async (): Promise<AIConfig> => {
    return {
      model: 'gpt-4-turbo',
      apiKey: '',
      customEndpoint: '',
      maxTokens: 2000,
      temperature: 0.7,
      enableAISuggestions: true,
      enableAutoSummary: true,
      enableSmartReply: false,
      enableCustomerAnalysis: true,
      enableOpportunityPrediction: false,
      dailyRequestLimit: 1000,
      enableRequestLog: true,
    }
  },
  updateConfig: async (data: Partial<AIConfig>): Promise<AIConfig> => {
    console.log('Update AI config:', data)
    return { ...await aiApi.getConfig(), ...data }
  },

  // Templates
  getTemplates: async (): Promise<AIPromptTemplate[]> => {
    return [
      {
        id: 'T001',
        name: '客户分析模板',
        type: 'customer_analysis',
        content: '请分析以下客户信息，并给出客户画像建议...',
        description: '用于分析客户基本信息和行为特征',
        isDefault: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
      {
        id: 'T002',
        name: '商机预测模板',
        type: 'opportunity_prediction',
        content: '基于以下商机信息，预测成交概率...',
        description: '用于预测商机的成交可能性',
        isDefault: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
      {
        id: 'T003',
        name: '邮件草稿模板',
        type: 'email_draft',
        content: '请根据以下信息撰写一封专业的商务邮件...',
        description: '用于生成商务邮件草稿',
        isDefault: false,
        createdAt: '2024-02-01',
        updatedAt: '2024-02-01',
      },
    ]
  },
  createTemplate: async (data: Omit<AIPromptTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<AIPromptTemplate> => {
    const now = new Date().toISOString()
    return {
      ...data,
      id: `T${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    }
  },
  updateTemplate: async (id: string, data: Partial<AIPromptTemplate>): Promise<AIPromptTemplate> => {
    const templates = await aiApi.getTemplates()
    const template = templates.find(t => t.id === id)
    if (!template) throw new Error('Template not found')
    return { ...template, ...data, updatedAt: new Date().toISOString() }
  },
  deleteTemplate: async (id: string): Promise<void> => {
    console.log('Delete template:', id)
  },

  // History
  getHistory: async (params?: { type?: string; limit?: number }): Promise<AIHistoryItem[]> => {
    return [
      {
        id: 'H001',
        type: 'customer_analysis',
        prompt: '分析客户"张伟"的购买倾向',
        response: '该客户属于高价值客户，建议重点跟进...',
        tokensUsed: 850,
        model: 'gpt-4-turbo',
        createdAt: '2025-04-03 14:30',
        relatedEntity: { type: 'customer', id: 'C001', name: '张伟' },
      },
      {
        id: 'H002',
        type: 'email_draft',
        prompt: '给客户"李娜"写一封产品介绍邮件',
        response: '尊敬的李娜女士，感谢您对我们产品的关注...',
        tokensUsed: 420,
        model: 'gpt-4-turbo',
        createdAt: '2025-04-03 12:15',
        relatedEntity: { type: 'customer', id: 'C002', name: '李娜' },
      },
      {
        id: 'H003',
        type: 'summary',
        prompt: '总结本周客户跟进情况',
        response: '本周共跟进15个客户，其中3个客户有明确购买意向...',
        tokensUsed: 650,
        model: 'gpt-4-turbo',
        createdAt: '2025-04-02 18:00',
      },
    ]
  },
  clearHistory: async (): Promise<void> => {
    console.log('Clear AI history')
  },

  // Usage Stats
  getUsageStats: async (): Promise<AIUsageStats> => {
    return {
      totalRequests: 156,
      totalTokensUsed: 125000,
      avgTokensPerRequest: 801,
      requestsByType: {
        customer_analysis: 45,
        opportunity_prediction: 30,
        email_draft: 50,
        summary: 31,
      },
      dailyRequests: [
        { date: '2025-03-28', count: 12, tokens: 9600 },
        { date: '2025-03-29', count: 18, tokens: 14400 },
        { date: '2025-03-30', count: 15, tokens: 12000 },
        { date: '2025-03-31', count: 22, tokens: 17600 },
        { date: '2025-04-01', count: 25, tokens: 20000 },
        { date: '2025-04-02', count: 28, tokens: 22400 },
        { date: '2025-04-03', count: 36, tokens: 29000 },
      ],
      remainingRequests: 844,
    }
  },
}

// ============================================================
// Query Keys
// ============================================================

export const aiQueryKeys = {
  config: ['ai', 'config'] as const,
  templates: ['ai', 'templates'] as const,
  template: (id: string) => ['ai', 'templates', id] as const,
  history: (params?: { type?: string }) => ['ai', 'history', params] as const,
  usageStats: ['ai', 'usageStats'] as const,
}

// ============================================================
// Hooks
// ============================================================

// Config
export function useAIConfig() {
  return useQuery({
    queryKey: aiQueryKeys.config,
    queryFn: aiApi.getConfig,
  })
}

export function useUpdateAIConfig() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: aiApi.updateConfig,
    onSuccess: (data) => {
      queryClient.setQueryData(aiQueryKeys.config, data)
    },
  })
}

// Templates
export function useAITemplates() {
  return useQuery({
    queryKey: aiQueryKeys.templates,
    queryFn: aiApi.getTemplates,
  })
}

export function useAITemplate(id: string | null) {
  return useQuery({
    queryKey: aiQueryKeys.template(id || ''),
    queryFn: async () => {
      const templates = await aiApi.getTemplates()
      return templates.find(t => t.id === id)
    },
    enabled: !!id,
  })
}

export function useCreateAITemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: aiApi.createTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aiQueryKeys.templates })
    },
  })
}

export function useUpdateAITemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<AIPromptTemplate>) =>
      aiApi.updateTemplate(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: aiQueryKeys.templates })
      queryClient.invalidateQueries({ queryKey: aiQueryKeys.template(variables.id) })
    },
  })
}

export function useDeleteAITemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: aiApi.deleteTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aiQueryKeys.templates })
    },
  })
}

// History
export function useAIHistory(params?: { type?: string }) {
  return useQuery({
    queryKey: aiQueryKeys.history(params),
    queryFn: () => aiApi.getHistory(params),
  })
}

export function useClearAIHistory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: aiApi.clearHistory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aiQueryKeys.history() })
      queryClient.invalidateQueries({ queryKey: aiQueryKeys.usageStats })
    },
  })
}

// Usage Stats
export function useAIUsageStats() {
  return useQuery({
    queryKey: aiQueryKeys.usageStats,
    queryFn: aiApi.getUsageStats,
  })
}

// ============================================================
// Export
// ============================================================

export { aiApi }