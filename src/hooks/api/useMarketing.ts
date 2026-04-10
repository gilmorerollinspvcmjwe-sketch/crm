import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-client'
import type { ApiError } from '@/types/api'

// ============================================================
// Types
// ============================================================

export interface Campaign {
  id: string
  name: string
  type: 'email' | 'sms' | 'social' | 'event' | 'webinar' | 'other'
  status: 'draft' | 'scheduled' | 'running' | 'paused' | 'completed' | 'cancelled'
  objective?: string
  startDate?: string
  endDate?: string
  targetAudience?: string
  budget?: number
  expectedConversionRate?: number
  actualConversionRate?: number
  productId?: string
  tags: string[]
  notes?: string
  createdAt: string
  updatedAt: string
  // Stats
  stats?: {
    sentCount: number
    deliveredCount: number
    openedCount: number
    clickedCount: number
    repliedCount: number
    conversionCount: number
  }
}

export interface Email {
  id: string
  subject: string
  senderName?: string
  senderEmail: string
  replyTo?: string
  recipientType: 'all' | 'segment' | 'individual' | 'campaign'
  recipientCount: number
  templateId?: string
  content: string
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed'
  scheduledAt?: string
  sentAt?: string
  priority: 'low' | 'normal' | 'high'
  enableTracking: boolean
  trackOpens: boolean
  trackClicks: boolean
  trackReplies: boolean
  createdAt: string
  updatedAt: string
  // Stats
  stats?: {
    delivered: number
    opened: number
    clicked: number
    replied: number
    bounced: number
  }
}

export interface EmailTemplate {
  id: string
  name: string
  type: 'marketing' | 'transactional' | 'notification' | 'welcome' | 'followup'
  content: string
  description?: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface MarketingStats {
  totalCampaigns: number
  activeCampaigns: number
  totalEmails: number
  emailsSentThisMonth: number
  avgOpenRate: number
  avgClickRate: number
  avgConversionRate: number
}

// ============================================================
// API Functions (Mock)
// ============================================================

const marketingApi = {
  // Campaigns
  getCampaigns: async (params?: { status?: string; type?: string }): Promise<Campaign[]> => {
    return [
      {
        id: 'CAM001',
        name: '春季促销活动',
        type: 'email',
        status: 'running',
        objective: '提升产品销量，增加客户粘性',
        startDate: '2025-03-01',
        endDate: '2025-04-30',
        targetAudience: '活跃客户',
        budget: 50000,
        expectedConversionRate: 15,
        actualConversionRate: 12.5,
        tags: ['促销', '春季'],
        createdAt: '2025-02-15',
        updatedAt: '2025-03-01',
        stats: { sentCount: 1500, deliveredCount: 1450, openedCount: 850, clickedCount: 320, repliedCount: 45, conversionCount: 180 },
      },
      {
        id: 'CAM002',
        name: '新产品发布通知',
        type: 'email',
        status: 'scheduled',
        objective: '通知客户新产品上线',
        startDate: '2025-04-10',
        endDate: '2025-04-20',
        targetAudience: '所有客户',
        budget: 20000,
        expectedConversionRate: 10,
        tags: ['新品', '通知'],
        createdAt: '2025-03-20',
        updatedAt: '2025-03-25',
      },
      {
        id: 'CAM003',
        name: '客户回访计划',
        type: 'email',
        status: 'draft',
        objective: '激活沉默客户',
        targetAudience: '沉默客户',
        budget: 10000,
        expectedConversionRate: 5,
        tags: ['回访', '激活'],
        createdAt: '2025-04-01',
        updatedAt: '2025-04-01',
      },
    ]
  },
  getCampaign: async (id: string): Promise<Campaign> => {
    const campaigns = await marketingApi.getCampaigns()
    const campaign = campaigns.find(c => c.id === id)
    if (!campaign) throw new Error('Campaign not found')
    return campaign
  },
  createCampaign: async (data: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt' | 'stats'>): Promise<Campaign> => {
    const now = new Date().toISOString()
    return {
      ...data,
      id: `CAM${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      stats: { sentCount: 0, deliveredCount: 0, openedCount: 0, clickedCount: 0, repliedCount: 0, conversionCount: 0 },
    }
  },
  updateCampaign: async (id: string, data: Partial<Campaign>): Promise<Campaign> => {
    const campaign = await marketingApi.getCampaign(id)
    return { ...campaign, ...data, updatedAt: new Date().toISOString() }
  },
  deleteCampaign: async (id: string): Promise<void> => {
    console.log('Delete campaign:', id)
  },
  startCampaign: async (id: string): Promise<Campaign> => {
    return marketingApi.updateCampaign(id, { status: 'running' })
  },
  pauseCampaign: async (id: string): Promise<Campaign> => {
    return marketingApi.updateCampaign(id, { status: 'paused' })
  },

  // Emails
  getEmails: async (params?: { status?: string }): Promise<Email[]> => {
    return [
      {
        id: 'EML001',
        subject: '春季促销活动邀请',
        senderName: 'CRM 团队',
        senderEmail: 'marketing@crm.com',
        replyTo: 'support@crm.com',
        recipientType: 'segment',
        recipientCount: 1500,
        content: '尊敬的客户，我们诚挚邀请您参与...',
        status: 'sent',
        sentAt: '2025-03-01 10:00',
        priority: 'normal',
        enableTracking: true,
        trackOpens: true,
        trackClicks: true,
        trackReplies: false,
        createdAt: '2025-02-28',
        updatedAt: '2025-03-01',
        stats: { delivered: 1450, opened: 850, clicked: 320, replied: 45, bounced: 50 },
      },
      {
        id: 'EML002',
        subject: '产品更新通知',
        senderEmail: 'noreply@crm.com',
        recipientType: 'all',
        recipientCount: 3000,
        content: '我们很高兴通知您，CRM 系统已更新...',
        status: 'scheduled',
        scheduledAt: '2025-04-05 09:00',
        priority: 'high',
        enableTracking: true,
        trackOpens: true,
        trackClicks: true,
        trackReplies: false,
        createdAt: '2025-04-02',
        updatedAt: '2025-04-02',
      },
      {
        id: 'EML003',
        subject: '客户满意度调查',
        senderEmail: 'survey@crm.com',
        replyTo: 'feedback@crm.com',
        recipientType: 'campaign',
        recipientCount: 500,
        content: '感谢您使用我们的产品，请填写...',
        status: 'draft',
        priority: 'low',
        enableTracking: true,
        trackOpens: true,
        trackClicks: true,
        trackReplies: true,
        createdAt: '2025-04-03',
        updatedAt: '2025-04-03',
      },
    ]
  },
  getEmail: async (id: string): Promise<Email> => {
    const emails = await marketingApi.getEmails()
    const email = emails.find(e => e.id === id)
    if (!email) throw new Error('Email not found')
    return email
  },
  createEmail: async (data: Omit<Email, 'id' | 'createdAt' | 'updatedAt' | 'stats' | 'sentAt' | 'senderEmail' | 'recipientCount'>): Promise<Email> => {
    const now = new Date().toISOString()
    return {
      ...data,
      id: `EML${Date.now()}`,
      senderEmail: 'marketing@crm.com',
      recipientCount: 0,
      createdAt: now,
      updatedAt: now,
      status: 'draft',
    }
  },
  updateEmail: async (id: string, data: Partial<Email>): Promise<Email> => {
    const email = await marketingApi.getEmail(id)
    return { ...email, ...data, updatedAt: new Date().toISOString() }
  },
  deleteEmail: async (id: string): Promise<void> => {
    console.log('Delete email:', id)
  },
  sendEmail: async (id: string): Promise<Email> => {
    return marketingApi.updateEmail(id, { status: 'sent', sentAt: new Date().toISOString() })
  },
  scheduleEmail: async (id: string, scheduledAt: string): Promise<Email> => {
    return marketingApi.updateEmail(id, { status: 'scheduled', scheduledAt })
  },

  // Templates
  getTemplates: async (): Promise<EmailTemplate[]> => {
    return [
      {
        id: 'TPL001',
        name: '营销邮件模板',
        type: 'marketing',
        content: '<h1>尊敬的客户</h1><p>感谢您...</p>',
        description: '用于营销活动的通用模板',
        isDefault: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
      {
        id: 'TPL002',
        name: '交易通知模板',
        type: 'transactional',
        content: '<p>您的订单已确认...</p>',
        description: '用于交易确认通知',
        isDefault: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
      {
        id: 'TPL003',
        name: '欢迎邮件模板',
        type: 'welcome',
        content: '<h1>欢迎加入</h1><p>感谢您的注册...</p>',
        description: '新客户注册欢迎邮件',
        isDefault: false,
        createdAt: '2024-02-01',
        updatedAt: '2024-02-01',
      },
    ]
  },
  createTemplate: async (data: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<EmailTemplate> => {
    const now = new Date().toISOString()
    return { ...data, id: `TPL${Date.now()}`, createdAt: now, updatedAt: now }
  },
  updateTemplate: async (id: string, data: Partial<EmailTemplate>): Promise<EmailTemplate> => {
    const templates = await marketingApi.getTemplates()
    const template = templates.find(t => t.id === id)
    if (!template) throw new Error('Template not found')
    return { ...template, ...data, updatedAt: new Date().toISOString() }
  },
  deleteTemplate: async (id: string): Promise<void> => {
    console.log('Delete template:', id)
  },

  // Stats
  getStats: async (): Promise<MarketingStats> => {
    return {
      totalCampaigns: 25,
      activeCampaigns: 3,
      totalEmails: 150,
      emailsSentThisMonth: 45,
      avgOpenRate: 58.5,
      avgClickRate: 22.3,
      avgConversionRate: 12.1,
    }
  },
}

// ============================================================
// Query Keys
// ============================================================

export const marketingQueryKeys = {
  campaigns: (params?: { status?: string }) => ['marketing', 'campaigns', params] as const,
  campaign: (id: string) => ['marketing', 'campaign', id] as const,
  emails: (params?: { status?: string }) => ['marketing', 'emails', params] as const,
  email: (id: string) => ['marketing', 'email', id] as const,
  templates: ['marketing', 'templates'] as const,
  template: (id: string) => ['marketing', 'template', id] as const,
  stats: ['marketing', 'stats'] as const,
}

// ============================================================
// Hooks
// ============================================================

// Campaigns
export function useCampaigns(params?: { status?: string; type?: string }) {
  return useQuery({
    queryKey: marketingQueryKeys.campaigns(params),
    queryFn: () => marketingApi.getCampaigns(params),
  })
}

export function useCampaign(id: string | null) {
  return useQuery({
    queryKey: marketingQueryKeys.campaign(id || ''),
    queryFn: () => marketingApi.getCampaign(id!),
    enabled: !!id,
  })
}

export function useCreateCampaign() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: marketingApi.createCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: marketingQueryKeys.campaigns() })
    },
  })
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<Campaign>) =>
      marketingApi.updateCampaign(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: marketingQueryKeys.campaigns() })
      queryClient.invalidateQueries({ queryKey: marketingQueryKeys.campaign(variables.id) })
    },
  })
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: marketingApi.deleteCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: marketingQueryKeys.campaigns() })
    },
  })
}

export function useStartCampaign() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: marketingApi.startCampaign,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: marketingQueryKeys.campaigns() })
      queryClient.invalidateQueries({ queryKey: marketingQueryKeys.campaign(id) })
    },
  })
}

export function usePauseCampaign() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: marketingApi.pauseCampaign,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: marketingQueryKeys.campaigns() })
      queryClient.invalidateQueries({ queryKey: marketingQueryKeys.campaign(id) })
    },
  })
}

// Emails
export function useEmails(params?: { status?: string }) {
  return useQuery({
    queryKey: marketingQueryKeys.emails(params),
    queryFn: () => marketingApi.getEmails(params),
  })
}

export function useEmail(id: string | null) {
  return useQuery({
    queryKey: marketingQueryKeys.email(id || ''),
    queryFn: () => marketingApi.getEmail(id!),
    enabled: !!id,
  })
}

export function useCreateEmail() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: marketingApi.createEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: marketingQueryKeys.emails() })
    },
  })
}

export function useUpdateEmail() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<Email>) =>
      marketingApi.updateEmail(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: marketingQueryKeys.emails() })
      queryClient.invalidateQueries({ queryKey: marketingQueryKeys.email(variables.id) })
    },
  })
}

export function useDeleteEmail() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: marketingApi.deleteEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: marketingQueryKeys.emails() })
    },
  })
}

export function useSendEmail() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: marketingApi.sendEmail,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: marketingQueryKeys.emails() })
      queryClient.invalidateQueries({ queryKey: marketingQueryKeys.email(id) })
    },
  })
}

export function useScheduleEmail() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, scheduledAt }: { id: string; scheduledAt: string }) =>
      marketingApi.scheduleEmail(id, scheduledAt),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: marketingQueryKeys.emails() })
      queryClient.invalidateQueries({ queryKey: marketingQueryKeys.email(variables.id) })
    },
  })
}

// Templates
export function useEmailTemplates() {
  return useQuery({
    queryKey: marketingQueryKeys.templates,
    queryFn: marketingApi.getTemplates,
  })
}

export function useEmailTemplate(id: string | null) {
  return useQuery({
    queryKey: marketingQueryKeys.template(id || ''),
    queryFn: async () => {
      const templates = await marketingApi.getTemplates()
      return templates.find(t => t.id === id)
    },
    enabled: !!id,
  })
}

export function useCreateEmailTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: marketingApi.createTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: marketingQueryKeys.templates })
    },
  })
}

export function useUpdateEmailTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<EmailTemplate>) =>
      marketingApi.updateTemplate(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: marketingQueryKeys.templates })
      queryClient.invalidateQueries({ queryKey: marketingQueryKeys.template(variables.id) })
    },
  })
}

export function useDeleteEmailTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: marketingApi.deleteTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: marketingQueryKeys.templates })
    },
  })
}

// Stats
export function useMarketingStats() {
  return useQuery({
    queryKey: marketingQueryKeys.stats,
    queryFn: marketingApi.getStats,
  })
}

// ============================================================
// Export
// ============================================================

export { marketingApi }