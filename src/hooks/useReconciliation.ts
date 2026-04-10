/**
 * 核销管理 Hook
 * 提供回款核销/驳回和发票管理的 API 调用和状态管理
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import type {
  PaymentPlan,
  Reconciliation,
  Invoice,
  ReconciliationRequest,
  RejectRequest,
  InvoiceRequest,
  ReconciliationListParams,
  InvoiceListParams,
  PaymentPlanResponse,
  ReconciliationResponse,
  ReconciliationListResponse,
  InvoiceResponse,
  InvoiceListResponse,
  PaymentPlanListResponse,
  InvoiceStatus,
} from '@/types/paymentRecord'

// ============ 延迟模拟 ============
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms))

// ============ 模拟数据存储 ============
let paymentPlansStore: PaymentPlan[] = []
let reconciliationsStore: Reconciliation[] = []
let invoicesStore: Invoice[] = []

// 初始化测试数据
function initializeMockData() {
  if (paymentPlansStore.length === 0) {
    paymentPlansStore = [
      {
        id: 'PLAN-001',
        paymentId: 'PAY-001',
        planCode: 'PLAN-2024-001',
        plannedAmount: 100000,
        reconciledAmount: 0,
        pendingAmount: 100000,
        status: '待核销',
        dueDate: '2024-06-01',
        createdAt: '2024-04-01T08:00:00Z',
        updatedAt: '2024-04-01T08:00:00Z',
      },
      {
        id: 'PLAN-002',
        paymentId: 'PAY-001',
        planCode: 'PLAN-2024-002',
        plannedAmount: 150000,
        reconciledAmount: 50000,
        pendingAmount: 100000,
        status: '部分核销',
        dueDate: '2024-07-01',
        actualDate: '2024-06-15',
        createdAt: '2024-04-01T08:00:00Z',
        updatedAt: '2024-06-15T10:00:00Z',
      },
      {
        id: 'PLAN-003',
        paymentId: 'PAY-002',
        planCode: 'PLAN-2024-003',
        plannedAmount: 200000,
        reconciledAmount: 200000,
        pendingAmount: 0,
        status: '已核销',
        dueDate: '2024-05-01',
        actualDate: '2024-04-28',
        createdAt: '2024-04-01T08:00:00Z',
        updatedAt: '2024-04-28T14:00:00Z',
      },
    ]

    reconciliationsStore = [
      {
        id: 'REC-001',
        paymentId: 'PAY-001',
        paymentPlanId: 'PLAN-002',
        type: '核销',
        amount: 50000,
        status: '已核销',
        operator: '张三',
        operatedAt: '2024-06-15T10:00:00Z',
        remark: '第一期核销',
        createdAt: '2024-06-15T10:00:00Z',
      },
      {
        id: 'REC-002',
        paymentId: 'PAY-002',
        paymentPlanId: 'PLAN-003',
        type: '核销',
        amount: 200000,
        status: '已核销',
        operator: '李四',
        operatedAt: '2024-04-28T14:00:00Z',
        remark: '全额核销',
        createdAt: '2024-04-28T14:00:00Z',
      },
    ]

    invoicesStore = [
      {
        id: 'INV-001',
        paymentId: 'PAY-001',
        type: '专票',
        status: '已开票' as InvoiceStatus,
        invoiceNo: '12345678',
        invoiceCode: '110000000000',
        amount: 250000,
        invoiceDate: '2024-04-01',
        createdAt: '2024-04-01T08:00:00Z',
        updatedAt: '2024-04-01T08:00:00Z',
      },
    ]
  }
}

// ============ API 函数 ============

const reconciliationApi = {
  /**
   * 获取回款计划列表
   */
  async listPaymentPlans(params?: { paymentId?: string; status?: string }): Promise<PaymentPlanListResponse> {
    initializeMockData()
    await delay(300)

    let result = [...paymentPlansStore]

    if (params?.paymentId) {
      result = result.filter(p => p.paymentId === params.paymentId)
    }

    if (params?.status) {
      result = result.filter(p => p.status === params.status)
    }

    return {
      data: result,
      total: result.length,
      page: 1,
      pageSize: result.length,
      totalPages: 1,
    }
  },

  /**
   * 获取回款计划详情
   */
  async getPaymentPlan(id: string): Promise<PaymentPlan> {
    initializeMockData()
    await delay(200)

    const plan = paymentPlansStore.find(p => p.id === id)
    if (!plan) {
      throw new Error('回款计划不存在')
    }

    return plan
  },

  /**
   * 提交核销
   */
  async submitReconciliation(request: ReconciliationRequest & { paymentId: string }): Promise<Reconciliation[]> {
    initializeMockData()
    await delay(400)

    const { paymentId, paymentPlanIds, amount, remark } = request

    // 验证计划是否存在
    const plans = paymentPlanIds.map(id => paymentPlansStore.find(p => p.id === id)).filter(Boolean) as PaymentPlan[]
    if (plans.length === 0) {
      throw new Error('选择的回款计划不存在')
    }

    // 验证核销金额
    const totalPending = plans.reduce((sum, p) => sum + p.pendingAmount, 0)
    if (amount > totalPending) {
      throw new Error('核销金额不能超过待核销总额')
    }

    // 创建核销记录
    const newReconciliations: Reconciliation[] = paymentPlanIds.map(planId => {
      const plan = plans.find(p => p.id === planId)!
      const planAmount = Math.min(plan.pendingAmount, amount / paymentPlanIds.length)

      return {
        id: `REC-${Date.now()}-${planId}`,
        paymentId,
        paymentPlanId: planId,
        type: '核销',
        amount: planAmount,
        status: '已核销',
        operator: '当前用户',
        operatedAt: new Date().toISOString(),
        remark,
        createdAt: new Date().toISOString(),
      }
    })

    reconciliationsStore.push(...newReconciliations)

    // 更新回款计划状态
    newReconciliations.forEach(rec => {
      const plan = paymentPlansStore.find(p => p.id === rec.paymentPlanId)
      if (plan) {
        plan.reconciledAmount += rec.amount
        plan.pendingAmount -= rec.amount
        plan.status = plan.pendingAmount === 0 ? '已核销' : plan.reconciledAmount > 0 ? '部分核销' : '待核销'
        plan.actualDate = new Date().toISOString().split('T')[0]
        plan.updatedAt = new Date().toISOString()
      }
    })

    return newReconciliations
  },

  /**
   * 驳回核销
   */
  async rejectReconciliation(request: RejectRequest): Promise<Reconciliation> {
    initializeMockData()
    await delay(400)

    const { reconciliationId, rejectReason, remark } = request

    const recIndex = reconciliationsStore.findIndex(r => r.id === reconciliationId)
    if (recIndex === -1) {
      throw new Error('核销记录不存在')
    }

    const reconciliation = reconciliationsStore[recIndex]

    // 更新核销记录状态
    reconciliation.status = '已驳回'
    reconciliation.type = '驳回'
    reconciliation.rejectReason = rejectReason
    reconciliation.remark = remark
    reconciliation.operatedAt = new Date().toISOString()
    reconciliationsStore[recIndex] = reconciliation

    // 恢复回款计划的待核销金额
    const plan = paymentPlansStore.find(p => p.id === reconciliation.paymentPlanId)
    if (plan) {
      plan.reconciledAmount -= reconciliation.amount
      plan.pendingAmount += reconciliation.amount
      plan.status = '待核销'
      plan.actualDate = undefined
      plan.updatedAt = new Date().toISOString()
    }

    return reconciliation
  },

  /**
   * 获取核销记录列表
   */
  async listReconciliations(params?: ReconciliationListParams): Promise<ReconciliationListResponse> {
    initializeMockData()
    await delay(300)

    let result = [...reconciliationsStore]

    if (params?.paymentId) {
      result = result.filter(r => r.paymentId === params.paymentId)
    }

    if (params?.status) {
      result = result.filter(r => r.status === params.status)
    }

    if (params?.type) {
      result = result.filter(r => r.type === params.type)
    }

    return {
      data: result,
      total: result.length,
      page: 1,
      pageSize: result.length,
      totalPages: 1,
    }
  },

  /**
   * 创建发票
   */
  async createInvoice(request: InvoiceRequest): Promise<Invoice> {
    initializeMockData()
    await delay(400)

    const newInvoice: Invoice = {
      id: `INV-${Date.now()}`,
      paymentId: request.paymentId || '',
      type: request.type,
      status: '未开票' as InvoiceStatus,
      invoiceNo: '',
      invoiceCode: '',
      amount: request.amount,
      invoiceDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    invoicesStore.push(newInvoice)
    return newInvoice
  },

  /**
   * 更新发票
   */
  async updateInvoice(id: string, updates: Partial<Invoice>): Promise<Invoice> {
    initializeMockData()
    await delay(300)

    const index = invoicesStore.findIndex(i => i.id === id)
    if (index === -1) {
      throw new Error('发票不存在')
    }

    invoicesStore[index] = {
      ...invoicesStore[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    return invoicesStore[index]
  },

  /**
   * 获取发票列表
   */
  async listInvoices(params?: InvoiceListParams): Promise<InvoiceListResponse> {
    initializeMockData()
    await delay(300)

    let result = [...invoicesStore]

    if (params?.paymentId) {
      result = result.filter(i => i.paymentId === params.paymentId)
    }

    if (params?.status) {
      result = result.filter(i => i.status === params.status)
    }

    return {
      data: result,
      total: result.length,
      page: 1,
      pageSize: result.length,
      totalPages: 1,
    }
  },

  /**
   * 获取发票详情
   */
  async getInvoice(id: string): Promise<Invoice> {
    initializeMockData()
    await delay(200)

    const invoice = invoicesStore.find(i => i.id === id)
    if (!invoice) {
      throw new Error('发票不存在')
    }

    return invoice
  },
}

// ============ React Query Hooks ============

/**
 * 获取回款计划列表
 */
export function usePaymentPlanList(params?: { paymentId?: string; status?: string }) {
  return useQuery({
    queryKey: ['paymentPlans', params],
    queryFn: () => reconciliationApi.listPaymentPlans(params),
  })
}

/**
 * 获取回款计划详情
 */
export function usePaymentPlan(id: string) {
  return useQuery({
    queryKey: ['paymentPlan', id],
    queryFn: () => reconciliationApi.getPaymentPlan(id),
    enabled: !!id,
  })
}

/**
 * 提交核销
 */
export function useSubmitReconciliation() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (request: ReconciliationRequest & { paymentId: string }) =>
      reconciliationApi.submitReconciliation(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentPlans'] })
      queryClient.invalidateQueries({ queryKey: ['reconciliations'] })
      toast({
        title: '核销成功',
        description: '回款核销记录已创建',
      })
    },
    onError: (error) => {
      toast({
        title: '核销失败',
        description: error instanceof Error ? error.message : '未知错误',
        variant: 'destructive',
      })
    },
  })
}

/**
 * 驳回核销
 */
export function useRejectReconciliation() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (request: RejectRequest) => reconciliationApi.rejectReconciliation(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reconciliations'] })
      queryClient.invalidateQueries({ queryKey: ['paymentPlans'] })
      toast({
        title: '已驳回',
        description: '核销记录已驳回',
      })
    },
    onError: (error) => {
      toast({
        title: '驳回失败',
        description: error instanceof Error ? error.message : '未知错误',
        variant: 'destructive',
      })
    },
  })
}

/**
 * 获取核销记录列表
 */
export function useReconciliationList(params?: ReconciliationListParams) {
  return useQuery({
    queryKey: ['reconciliations', params],
    queryFn: () => reconciliationApi.listReconciliations(params),
  })
}

/**
 * 创建发票
 */
export function useCreateInvoice() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (request: InvoiceRequest) => reconciliationApi.createInvoice(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
      toast({
        title: '发票创建成功',
        description: '发票申请已提交',
      })
    },
    onError: (error) => {
      toast({
        title: '发票创建失败',
        description: error instanceof Error ? error.message : '未知错误',
        variant: 'destructive',
      })
    },
  })
}

/**
 * 更新发票
 */
export function useUpdateInvoice() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Invoice> }) =>
      reconciliationApi.updateInvoice(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
      toast({
        title: '发票更新成功',
      })
    },
    onError: (error) => {
      toast({
        title: '发票更新失败',
        description: error instanceof Error ? error.message : '未知错误',
        variant: 'destructive',
      })
    },
  })
}

/**
 * 获取发票列表
 */
export function useInvoiceList(params?: InvoiceListParams) {
  return useQuery({
    queryKey: ['invoices', params],
    queryFn: () => reconciliationApi.listInvoices(params),
  })
}

/**
 * 获取发票详情
 */
export function useInvoice(id: string) {
  return useQuery({
    queryKey: ['invoice', id],
    queryFn: () => reconciliationApi.getInvoice(id),
    enabled: !!id,
  })
}
