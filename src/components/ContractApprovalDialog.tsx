/**
 * 合同审批对话框组件
 * 支持提交审批、审批操作、审批历史查看
 */

import * as React from 'react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { useForm } from 'react-hook-form'
import { Check, X, Send, Clock } from 'lucide-react'

import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { useContractApproval } from '@/hooks/useContractApproval'
import type {
  Contract,
  ContractApproval,
  Approver,
} from '@/types/contract'
import { ApprovalAction, ApprovalStatus, ContractStatus } from '@/types/contract'

// ============================================
// 审批状态配置
// ============================================

const approvalStatusConfig: Record<ApprovalStatus, { label: string; color: string }> = {
  [ApprovalStatus.PENDING]: { label: '待审批', color: 'bg-blue-100 text-blue-700' },
  [ApprovalStatus.APPROVED]: { label: '已同意', color: 'bg-green-100 text-green-700' },
  [ApprovalStatus.REJECTED]: { label: '已拒绝', color: 'bg-red-100 text-red-700' },
}

// ============================================
// Mock 审批人列表
// ============================================

const mockApprovers: Approver[] = [
  { id: 'USR-001', name: '王经理', email: 'wang@example.com', department: '销售部', role: '部门经理' },
  { id: 'USR-002', name: '李总监', email: 'li@example.com', department: '销售部', role: '销售总监' },
  { id: 'USR-003', name: '张法务', email: 'zhang@example.com', department: '法务部', role: '法务专员' },
  { id: 'USR-004', name: '刘财务', email: 'liu@example.com', department: '财务部', role: '财务经理' },
  { id: 'USR-005', name: '陈总', email: 'chen@example.com', department: '管理层', role: '总经理' },
]

// ============================================
// 组件 Props
// ============================================

interface ContractApprovalDialogProps {
  contractId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  isApprover?: boolean
  myApprovalId?: string
}

// ============================================
// 主组件
// ============================================

export function ContractApprovalDialog({
  contractId,
  open,
  onOpenChange,
  isApprover = false,
  myApprovalId,
}: ContractApprovalDialogProps) {
  const { toast } = useToast()
  const { useContract, useSubmitApproval, useProcessApproval } = useContractApproval()

  const { data: contract, isLoading, refetch } = useContract(contractId, open)
  const submitApprovalMutation = useSubmitApproval()
  const processApprovalMutation = useProcessApproval()

  const approvalHistory = contract?.approvals || []

  // ============================================
  // 提交审批表单
  // ============================================

  const submitForm = useForm<{
    approverIds: string[]
    comments: string
  }>()

  const handleSubmitApproval = async (values: { approverIds: string[]; comments: string }) => {
    if (values.approverIds.length === 0) {
      toast({
        title: '请选择审批人',
        description: '至少需要选择一位审批人',
        variant: 'destructive',
      })
      return
    }

    try {
      await submitApprovalMutation.mutateAsync({
        contractId,
        approverIds: values.approverIds,
        comments: values.comments,
      })
      onOpenChange(false)
      refetch()
    } catch (error) {
      console.error('提交审批失败:', error)
    }
  }

  // ============================================
  // 审批操作表单
  // ============================================

  const approvalForm = useForm<{
    action: ApprovalAction
    comments: string
  }>({
    defaultValues: {
      action: ApprovalAction.APPROVE,
      comments: '',
    },
  })

  const handleProcessApproval = async (values: { action: ApprovalAction; comments: string }) => {
    if (!myApprovalId) {
      toast({
        title: '错误',
        description: '未找到审批记录',
        variant: 'destructive',
      })
      return
    }

    try {
      await processApprovalMutation.mutateAsync({
        approvalId: myApprovalId,
        action: values.action,
        comments: values.comments,
      })
      onOpenChange(false)
      refetch()
    } catch (error) {
      console.error('审批操作失败:', error)
    }
  }

  // ============================================
  // 渲染内容
  // ============================================

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">加载中...</div>
        </div>
      )
    }

    if (!contract) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">合同不存在</div>
        </div>
      )
    }

    if (isApprover && myApprovalId) {
      const myApproval = approvalHistory.find(a => a.id === myApprovalId)
      if (myApproval && myApproval.status === ApprovalStatus.PENDING) {
        return (
          <ApprovalForm
            form={approvalForm}
            onSubmit={handleProcessApproval}
            isSubmitting={processApprovalMutation.isPending}
            contract={contract}
          />
        )
      }
    }

    return (
      <div className="space-y-6">
        <ContractSummary contract={contract} />
        <Separator />
        <ApprovalHistory approvals={approvalHistory} />
        {contract.status === ContractStatus.DRAFT && (
          <>
            <Separator />
            <SubmitApprovalSection
              form={submitForm}
              onSubmit={handleSubmitApproval}
              isSubmitting={submitApprovalMutation.isPending}
              approvers={mockApprovers}
            />
          </>
        )}
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>合同审批</DialogTitle>
          <DialogDescription>
            {contract?.contractNo} - {contract?.name}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4 -mr-4">
          {renderContent()}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

// ============================================
// 子组件：合同摘要
// ============================================

interface ContractSummaryProps {
  contract: Contract
}

function ContractSummary({ contract }: ContractSummaryProps) {
  return (
    <div className="space-y-3">
      <h4 className="font-semibold text-sm text-muted-foreground">合同信息</h4>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-muted-foreground">合同编号：</span>
          <span className="font-medium">{contract.contractNo}</span>
        </div>
        <div>
          <span className="text-muted-foreground">合同名称：</span>
          <span className="font-medium">{contract.name}</span>
        </div>
        <div>
          <span className="text-muted-foreground">合同金额：</span>
          <span className="font-medium">¥{contract.amount.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-muted-foreground">客户：</span>
          <span className="font-medium">{contract.customerName || '-'}</span>
        </div>
        <div>
          <span className="text-muted-foreground">状态：</span>
          <Badge className={cn(
            'ml-2',
            contract.status === ContractStatus.DRAFT && 'bg-gray-100 text-gray-700',
            contract.status === ContractStatus.PENDING_APPROVAL && 'bg-blue-100 text-blue-700',
            contract.status === ContractStatus.APPROVED && 'bg-green-100 text-green-700',
            contract.status === ContractStatus.REJECTED && 'bg-red-100 text-red-700',
            contract.status === ContractStatus.EXECUTING && 'bg-purple-100 text-purple-700',
          )}>
            {contract.status}
          </Badge>
        </div>
        <div>
          <span className="text-muted-foreground">创建人：</span>
          <span className="font-medium">{contract.createdBy}</span>
        </div>
      </div>
    </div>
  )
}

// ============================================
// 子组件：审批历史
// ============================================

interface ApprovalHistoryProps {
  approvals: ContractApproval[]
}

function ApprovalHistory({ approvals }: ApprovalHistoryProps) {
  if (approvals.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        暂无审批记录
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h4 className="font-semibold text-sm text-muted-foreground">审批历史</h4>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>审批人</TableHead>
            <TableHead>角色</TableHead>
            <TableHead>操作</TableHead>
            <TableHead>意见</TableHead>
            <TableHead>时间</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {approvals.map((approval) => (
            <TableRow key={approval.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {approval.approverName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{approval.approverName}</span>
                </div>
              </TableCell>
              <TableCell>{approval.approverRole || '-'}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={cn(
                    approval.status === ApprovalStatus.APPROVED && 'bg-green-50 text-green-600 border-green-200',
                    approval.status === ApprovalStatus.REJECTED && 'bg-red-50 text-red-600 border-red-200',
                    approval.status === ApprovalStatus.PENDING && 'bg-blue-50 text-blue-600 border-blue-200',
                  )}
                >
                  {approvalStatusConfig[approval.status].label}
                </Badge>
              </TableCell>
              <TableCell className="max-w-[200px] truncate">
                {approval.comments || '-'}
              </TableCell>
              <TableCell className="text-muted-foreground text-xs">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {format(new Date(approval.createdAt), 'yyyy-MM-dd HH:mm', { locale: zhCN })}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

// ============================================
// 子组件：提交审批表单
// ============================================

interface SubmitApprovalSectionProps {
  form: any
  onSubmit: (values: any) => void
  isSubmitting: boolean
  approvers: Approver[]
}

function SubmitApprovalSection({ form, onSubmit, isSubmitting, approvers }: SubmitApprovalSectionProps) {
  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-sm text-muted-foreground">提交审批</h4>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="approverIds"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel required>选择审批人</FormLabel>
                <Select
                  onValueChange={(value: string) => {
                    const currentValues = field.value || []
                    if (!currentValues.includes(value)) {
                      field.onChange([...currentValues, value])
                    }
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="选择审批人" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {approvers.map((approver) => (
                      <SelectItem key={approver.id} value={approver.id}>
                        {approver.name} - {approver.role} ({approver.department})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  已选择：{form.watch('approverIds')?.length || 0} 位审批人
                </FormDescription>
                {form.watch('approverIds')?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.watch('approverIds').map((id: string) => {
                      const approver = approvers.find(a => a.id === id)
                      return (
                        <Badge
                          key={id}
                          variant="secondary"
                          className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => {
                            const currentValues = field.value || []
                            field.onChange(currentValues.filter((v: string) => v !== id))
                          }}
                        >
                          {approver?.name}
                          <X className="h-3 w-3 ml-1" />
                        </Badge>
                      )
                    })}
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="comments"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>备注说明</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="请输入提交审批的备注说明（可选）"
                    className="resize-none"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>提交中...</>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                提交审批
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}

// ============================================
// 子组件：审批操作表单
// ============================================

interface ApprovalFormProps {
  form: any
  onSubmit: (values: any) => void
  isSubmitting: boolean
  contract: Contract
}

function ApprovalForm({ form, onSubmit, isSubmitting, contract }: ApprovalFormProps) {
  return (
    <div className="space-y-4">
      <div className="bg-muted/50 rounded-lg p-4 space-y-2">
        <h4 className="font-semibold">待您审批</h4>
        <p className="text-sm text-muted-foreground">
          请审阅合同内容并进行审批操作
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="action"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>审批决定</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="选择审批操作" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={ApprovalAction.APPROVE}>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        同意
                      </div>
                    </SelectItem>
                    <SelectItem value={ApprovalAction.REJECT}>
                      <div className="flex items-center gap-2">
                        <X className="h-4 w-4 text-red-600" />
                        拒绝
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="comments"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>审批意见</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="请输入审批意见（必填）"
                    className="resize-none"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  请说明同意或拒绝的理由
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                form.watch('action') === ApprovalAction.APPROVE && 'bg-green-600 hover:bg-green-700',
                form.watch('action') === ApprovalAction.REJECT && 'bg-red-600 hover:bg-red-700',
              )}
            >
              {isSubmitting ? (
                <>提交中...</>
              ) : (
                <>
                  {form.watch('action') === ApprovalAction.APPROVE && <Check className="h-4 w-4 mr-2" />}
                  {form.watch('action') === ApprovalAction.REJECT && <X className="h-4 w-4 mr-2" />}
                  {form.watch('action') === ApprovalAction.APPROVE ? '同意' : '拒绝'}
                </>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              重置
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default ContractApprovalDialog
