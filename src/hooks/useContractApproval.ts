/**
 * 合同审批 Hook
 * 提供合同审批相关的 API 调用和状态管理
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import type {
  Contract,
  ContractApproval,
  ContractAttachment,
  SubmitApprovalRequest,
  ApprovalActionRequest,
  UploadAttachmentRequest,
  ContractQueryParams,
  ContractListResponse,
} from '@/types/contract'
import { ApprovalAction, ApprovalStatus, AttachmentType, ContractStatus, ContractType, Currency } from '@/types/contract'

// ============ 延迟模拟 ============
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms))

// ============ 模拟数据存储 ============
let contractsStore: (Contract & { approvals?: ContractApproval[]; attachments?: ContractAttachment[] })[] = []

// 初始化一些测试数据
function initializeMockData() {
  if (contractsStore.length === 0) {
    contractsStore = [
      {
        id: 'CNT-001',
        contractNo: 'CNT-2024-001',
        name: '企业 CRM 系统实施合同',
        type: ContractType.SERVICE,
        status: ContractStatus.DRAFT,
        amount: 500000,
        currency: Currency.CNY,
        customerId: 'CUST-001',
        customerName: '北京科技创新有限公司',
        opportunityId: 'OPP-001',
        opportunityName: '企业 CRM 系统升级项目',
        startDate: '2024-05-01',
        endDate: '2024-12-31',
        description: 'CRM 系统实施与定制开发',
        createdBy: '张三',
        createdAt: '2024-04-01T08:00:00Z',
        updatedAt: '2024-04-01T08:00:00Z',
        assignee: 'USR-001',
        assigneeName: '张三',
        approvals: [],
        attachments: [],
      },
      {
        id: 'CNT-002',
        contractNo: 'CNT-2024-002',
        name: '软件许可协议',
        type: ContractType.SALES,
        status: ContractStatus.PENDING_APPROVAL,
        amount: 200000,
        currency: Currency.CNY,
        customerId: 'CUST-002',
        customerName: '上海贸易有限公司',
        startDate: '2024-06-01',
        endDate: '2025-06-01',
        createdBy: '李四',
        createdAt: '2024-04-05T10:00:00Z',
        updatedAt: '2024-04-06T14:30:00Z',
        assignee: 'USR-002',
        assigneeName: '李四',
        approvals: [
          {
            id: 'APR-001',
            contractId: 'CNT-002',
            approverId: 'USR-003',
            approverName: '王经理',
            approverRole: '部门经理',
            action: ApprovalAction.APPROVE,
            status: ApprovalStatus.APPROVED,
            comments: '同意，项目预算充足',
            createdAt: '2024-04-06T14:30:00Z',
            level: 1,
          },
        ],
        attachments: [
          {
            id: 'ATT-001',
            contractId: 'CNT-002',
            fileName: 'contract_v1.pdf',
            originalName: '软件许可协议草案.pdf',
            fileType: 'application/pdf',
            fileSize: 1024567,
            fileUrl: '/mock/files/contract_v1.pdf',
            downloadUrl: '/mock/download/ATT-001',
            type: AttachmentType.CONTRACT,
            description: '合同草案',
            uploadedBy: '李四',
            uploadedByName: '李四',
            createdAt: '2024-04-05T10:30:00Z',
          },
        ],
      },
    ]
  }
}

// ============ API 函数 ============

const contractApi = {
  /**
   * 获取合同列表
   */
  async listContracts(params?: ContractQueryParams): Promise<ContractListResponse> {
    initializeMockData()
    await delay(300 + Math.random() * 200)

    let result = [...contractsStore]

    // 过滤
    if (params?.status) {
      result = result.filter(c => c.status === params.status)
    }

    if (params?.customerId) {
      result = result.filter(c => c.customerId === params.customerId)
    }

    if (params?.opportunityId) {
      result = result.filter(c => c.opportunityId === params.opportunityId)
    }

    if (params?.createdBy) {
      result = result.filter(c => c.createdBy === params.createdBy)
    }

    if (params?.assignee) {
      result = result.filter(c => c.assignee === params.assignee)
    }

    if (params?.search) {
      const searchLower = params.search.toLowerCase()
      result = result.filter(c =>
        c.contractNo.toLowerCase().includes(searchLower) ||
        c.name.toLowerCase().includes(searchLower) ||
        (c.customerName && c.customerName.toLowerCase().includes(searchLower))
      )
    }

    // 排序
    const sortBy = params?.sortBy
    const sortOrder = params?.sortOrder || 'asc'
    if (sortBy) {
      result.sort((a, b) => {
        const aVal = a[sortBy as keyof typeof a]
        const bVal = b[sortBy as keyof typeof b]
        if (aVal !== undefined && bVal !== undefined && typeof aVal === 'string' && typeof bVal === 'string') {
          return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
        }
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
        }
        return 0
      })
    }

    // 分页
    const page = params?.page || 1
    const pageSize = params?.pageSize || 10
    const total = result.length
    const data = result.slice((page - 1) * pageSize, page * pageSize) as Contract[]

    return { data, total, page, pageSize }
  },

  /**
   * 获取合同详情
   */
  async getContract(id: string): Promise<Contract & { approvals: ContractApproval[]; attachments: ContractAttachment[] }> {
    initializeMockData()
    await delay(200)

    const contract = contractsStore.find(c => c.id === id)
    if (!contract) {
      throw new Error('合同不存在')
    }

    return {
      ...contract,
      approvals: contract.approvals || [],
      attachments: contract.attachments || [],
    }
  },

  /**
   * 提交审批
   */
  async submitApproval(request: SubmitApprovalRequest): Promise<ContractApproval[]> {
    initializeMockData()
    await delay(400)

    const contractIndex = contractsStore.findIndex(c => c.id === request.contractId)
    if (contractIndex === -1) {
      throw new Error('合同不存在')
    }

    const contract = contractsStore[contractIndex]

    // 更新合同状态
    contract.status = ContractStatus.PENDING_APPROVAL
    contract.updatedAt = new Date().toISOString()

    // 创建审批记录
    const newApprovals: ContractApproval[] = request.approverIds.map((approverId: string, index: number) => ({
      id: `APR-${Date.now()}-${index}`,
      contractId: request.contractId,
      approverId,
      approverName: `审批人${index + 1}`,
      approverRole: '部门经理',
      action: ApprovalAction.APPROVE,
      status: ApprovalStatus.PENDING,
      comments: request.comments,
      createdAt: new Date().toISOString(),
      level: 1,
    }))

    contract.approvals = [...(contract.approvals || []), ...newApprovals]

    return newApprovals
  },

  /**
   * 审批操作（同意/拒绝）
   */
  async processApproval(request: ApprovalActionRequest): Promise<ContractApproval> {
    initializeMockData()
    await delay(400)

    const contract = contractsStore.find(c => c.approvals?.some(a => a.id === request.approvalId))
    if (!contract) {
      throw new Error('审批记录不存在')
    }

    const approvalIndex = contract.approvals!.findIndex(a => a.id === request.approvalId)
    if (approvalIndex === -1) {
      throw new Error('审批记录不存在')
    }

    const approval = { ...contract.approvals![approvalIndex] }

    // 更新审批记录
    approval.action = request.action
    approval.status = request.action === ApprovalAction.APPROVE ? ApprovalStatus.APPROVED : ApprovalStatus.REJECTED
    approval.comments = request.comments
    approval.updatedAt = new Date().toISOString()
    contract.approvals![approvalIndex] = approval

    // 如果是拒绝，更新合同状态
    if (request.action === ApprovalAction.REJECT) {
      contract.status = ContractStatus.REJECTED
      contract.updatedAt = new Date().toISOString()
    } else {
      // 检查是否所有审批都通过了
      const allApproved = contract.approvals!.every(a => a.status === ApprovalStatus.APPROVED)

      if (allApproved) {
        contract.status = ContractStatus.APPROVED
        contract.updatedAt = new Date().toISOString()
      }
    }

    return approval
  },

  /**
   * 上传附件
   */
  async uploadAttachment(request: UploadAttachmentRequest): Promise<ContractAttachment> {
    initializeMockData()
    await delay(500)

    const contractIndex = contractsStore.findIndex(c => c.id === request.contractId)
    if (contractIndex === -1) {
      throw new Error('合同不存在')
    }

    const contract = contractsStore[contractIndex]

    // 模拟文件上传
    const newAttachment: ContractAttachment = {
      id: `ATT-${Date.now()}`,
      contractId: request.contractId,
      fileName: request.file.name,
      originalName: request.file.name,
      fileType: request.file.type || 'application/octet-stream',
      fileSize: request.file.size,
      fileUrl: `/mock/files/${request.file.name}`,
      downloadUrl: `/mock/download/ATT-${Date.now()}`,
      type: request.type || AttachmentType.OTHER,
      description: request.description,
      uploadedBy: 'current-user',
      uploadedByName: '当前用户',
      createdAt: new Date().toISOString(),
    }

    contract.attachments = [...(contract.attachments || []), newAttachment]
    contract.updatedAt = new Date().toISOString()

    return newAttachment
  },

  /**
   * 删除附件
   */
  async deleteAttachment(attachmentId: string): Promise<void> {
    initializeMockData()
    await delay(300)

    const contract = contractsStore.find(c => c.attachments?.some(a => a.id === attachmentId))
    if (!contract) {
      throw new Error('附件不存在')
    }

    contract.attachments = contract.attachments!.filter(a => a.id !== attachmentId)
    contract.updatedAt = new Date().toISOString()
  },

  /**
   * 获取附件下载 URL
   */
  async getDownloadUrl(attachmentId: string): Promise<string> {
    initializeMockData()
    await delay(200)

    const contract = contractsStore.find(c => c.attachments?.some(a => a.id === attachmentId))
    const attachment = contract?.attachments?.find(a => a.id === attachmentId)
    
    if (!attachment) {
      throw new Error('附件不存在')
    }

    return `${attachment.downloadUrl}?token=${Date.now()}`
  },

  /**
   * 更新合同状态
   */
  async updateContractStatus(contractId: string, status: ContractStatus): Promise<Contract> {
    initializeMockData()
    await delay(300)

    const contractIndex = contractsStore.findIndex(c => c.id === contractId)
    if (contractIndex === -1) {
      throw new Error('合同不存在')
    }

    contractsStore[contractIndex].status = status
    contractsStore[contractIndex].updatedAt = new Date().toISOString()

    return contractsStore[contractIndex]
  },
}

// ============ React Query Hooks ============

/**
 * 合同审批相关 Hook
 */
export function useContractApproval() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  /**
   * 获取合同列表
   */
  const useContracts = (params?: ContractQueryParams) => {
    return useQuery({
      queryKey: ['contracts', params],
      queryFn: () => contractApi.listContracts(params),
    })
  }

  /**
   * 获取合同详情
   */
  const useContract = (contractId: string, enabled: boolean = true) => {
    return useQuery({
      queryKey: ['contract', contractId],
      queryFn: () => contractApi.getContract(contractId),
      enabled: enabled && !!contractId,
    })
  }

  /**
   * 提交审批 Mutation
   */
  const useSubmitApproval = () => {
    return useMutation({
      mutationFn: (request: SubmitApprovalRequest) => contractApi.submitApproval(request),
      onSuccess: (_approvals, variables) => {
        queryClient.invalidateQueries({ queryKey: ['contract', variables.contractId] })
        queryClient.invalidateQueries({ queryKey: ['contracts'] })
        toast({
          title: '提交成功',
          description: '合同已提交审批',
          variant: 'success',
        })
      },
      onError: (error) => {
        toast({
          title: '提交失败',
          description: error instanceof Error ? error.message : '未知错误',
          variant: 'destructive',
        })
      },
    })
  }

  /**
   * 审批操作 Mutation
   */
  const useProcessApproval = () => {
    return useMutation({
      mutationFn: (request: ApprovalActionRequest) => contractApi.processApproval(request),
      onSuccess: (_approval, variables) => {
        queryClient.invalidateQueries({ queryKey: ['contract'] })
        queryClient.invalidateQueries({ queryKey: ['contracts'] })

        const actionText = variables.action === ApprovalAction.APPROVE ? '同意' : '拒绝'
        toast({
          title: `${actionText}成功`,
          description: `您已${actionText}该合同`,
          variant: variables.action === ApprovalAction.APPROVE ? 'success' : 'default',
        })
      },
      onError: (error) => {
        toast({
          title: '操作失败',
          description: error instanceof Error ? error.message : '未知错误',
          variant: 'destructive',
        })
      },
    })
  }

  /**
   * 上传附件 Mutation
   */
  const useUploadAttachment = () => {
    return useMutation({
      mutationFn: (request: UploadAttachmentRequest) => contractApi.uploadAttachment(request),
      onSuccess: (attachment, variables) => {
        queryClient.invalidateQueries({ queryKey: ['contract', variables.contractId] })
        toast({
          title: '上传成功',
          description: `附件 ${attachment.fileName} 已上传`,
          variant: 'success',
        })
      },
      onError: (error) => {
        toast({
          title: '上传失败',
          description: error instanceof Error ? error.message : '未知错误',
          variant: 'destructive',
        })
      },
    })
  }

  /**
   * 删除附件 Mutation
   */
  const useDeleteAttachment = () => {
    return useMutation({
      mutationFn: (attachmentId: string) => contractApi.deleteAttachment(attachmentId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['contract'] })
        toast({
          title: '删除成功',
          description: '附件已删除',
          variant: 'success',
        })
      },
      onError: (error) => {
        toast({
          title: '删除失败',
          description: error instanceof Error ? error.message : '未知错误',
          variant: 'destructive',
        })
      },
    })
  }

  /**
   * 获取下载链接
   */
  const useDownloadUrl = (attachmentId: string) => {
    return useQuery({
      queryKey: ['attachment-download', attachmentId],
      queryFn: () => contractApi.getDownloadUrl(attachmentId),
      enabled: !!attachmentId,
      staleTime: 5 * 60 * 1000,
    })
  }

  /**
   * 更新合同状态
   */
  const useUpdateContractStatus = () => {
    return useMutation({
      mutationFn: ({ contractId, status }: { contractId: string; status: ContractStatus }) =>
        contractApi.updateContractStatus(contractId, status),
      onSuccess: (contract) => {
        queryClient.invalidateQueries({ queryKey: ['contract', contract.id] })
        queryClient.invalidateQueries({ queryKey: ['contracts'] })
        toast({
          title: '更新成功',
          description: `合同状态已更新为 ${contract.status}`,
          variant: 'success',
        })
      },
      onError: (error) => {
        toast({
          title: '更新失败',
          description: error instanceof Error ? error.message : '未知错误',
          variant: 'destructive',
        })
      },
    })
  }

  return {
    useContracts,
    useContract,
    useSubmitApproval,
    useProcessApproval,
    useUploadAttachment,
    useDeleteAttachment,
    useDownloadUrl,
    useUpdateContractStatus,
  }
}

// ============ 导出 API 函数（供非组件代码使用） ============
export { contractApi }
export default useContractApproval
