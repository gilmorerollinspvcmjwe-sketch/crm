/**
 * 决策流程记录组件
 * Decision Process Record - Visualize and manage customer decision process
 */

import * as React from 'react'
import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Users,
  CheckCircle2,
  Circle,
  Clock,
  User,
  Calendar,
  Plus,
  Edit2,
  Trash2,
  ChevronRight,
  TrendingUp,
  AlertCircle,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from '@/hooks/use-toast'

import {
  DecisionProcess,
  DecisionStep,
  DecisionStepStatus,
  DecisionProcessStats,
  Opportunity,
} from '@/types/opportunity'

interface DecisionProcessRecordProps {
  /** 商机对象 */
  opportunity: Opportunity
  /** 决策流程数据 */
  decisionProcess?: DecisionProcess
  /** 更新回调 */
  onUpdate?: (process: DecisionProcess) => void
  /** 只读模式 */
  readOnly?: boolean
}

/** 步骤编辑对话框状态 */
interface StepEditorState {
  open: boolean
  mode: 'create' | 'edit'
  step?: DecisionStep
}

/** 状态标签映射 */
const statusLabels: Record<DecisionStepStatus, string> = {
  pending: '未完成',
  completed: '已完成',
  skipped: '已跳过',
}

const statusColors: Record<DecisionStepStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  completed: 'bg-green-100 text-green-700 border-green-200',
  skipped: 'bg-gray-100 text-gray-700 border-gray-200',
}

const processStatusLabels: Record<DecisionProcess['status'], string> = {
  active: '进行中',
  completed: '已完成',
  paused: '已暂停',
  cancelled: '已取消',
}

const processStatusColors: Record<DecisionProcess['status'], string> = {
  active: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  paused: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
}

/** 默认决策流程模板 */
const DEFAULT_DECISION_STEPS = [
  { name: '需求确认', description: '确认客户具体需求和痛点', plannedDaysFromStart: 0 },
  { name: '方案演示', description: '向客户演示解决方案', plannedDaysFromStart: 3 },
  { name: '技术评估', description: '客户技术团队评估方案可行性', plannedDaysFromStart: 7 },
  { name: '商务谈判', description: '讨论价格、付款条件等商务条款', plannedDaysFromStart: 14 },
  { name: '合同审批', description: '客户内部合同审批流程', plannedDaysFromStart: 21 },
  { name: '签约', description: '正式签署合同', plannedDaysFromStart: 28 },
]

export const DecisionProcessRecord: React.FC<DecisionProcessRecordProps> = ({
  opportunity,
  decisionProcess: initialProcess,
  onUpdate,
  readOnly = false,
}) => {
  const { t } = useTranslation()
  const [process, setProcess] = useState<DecisionProcess | undefined>(initialProcess)
  const [stepEditor, setStepEditor] = useState<StepEditorState>({ open: false, mode: 'create' })
  const [editingStep, setEditingStep] = useState<Partial<DecisionStep>>({})

  // 初始化决策流程
  useEffect(() => {
    if (!process && opportunity) {
      // 如果没有决策流程，创建一个默认的
      const defaultProcess: DecisionProcess = {
        id: `process_${Date.now()}`,
        name: `${opportunity.name} - 决策流程`,
        description: `客户决策流程跟踪`,
        steps: DEFAULT_DECISION_STEPS.map((template, index) => ({
          id: `step_${index}`,
          name: template.name,
          description: template.description,
          ownerId: '',
          ownerName: '未指定',
          status: 'pending' as DecisionStepStatus,
          plannedDate: new Date(Date.now() + template.plannedDaysFromStart * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          sortOrder: index,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })),
        status: 'active',
        currentStepId: 'step_0',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setProcess(defaultProcess)
    } else if (initialProcess) {
      setProcess(initialProcess)
    }
  }, [opportunity, initialProcess, process])

  /** 计算流程统计 */
  const calculateStats = useCallback((): DecisionProcessStats => {
    if (!process) {
      return {
        totalSteps: 0,
        completedSteps: 0,
        pendingSteps: 0,
        completionRate: 0,
      }
    }

    const totalSteps = process.steps.length
    const completedSteps = process.steps.filter((s) => s.status === 'completed').length
    const pendingSteps = process.steps.filter((s) => s.status === 'pending').length
    const completionRate = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0

    // 计算平均完成时间
    let avgCompletionDays: number | undefined
    const completedWithDates = process.steps.filter(
      (s) => s.status === 'completed' && s.plannedDate && s.completedAt
    )
    if (completedWithDates.length > 0) {
      const totalDays = completedWithDates.reduce((sum, step) => {
        const planned = new Date(step.plannedDate!).getTime()
        const completed = new Date(step.completedAt!).getTime()
        return sum + (completed - planned) / (24 * 60 * 60 * 1000)
      }, 0)
      avgCompletionDays = totalDays / completedWithDates.length
    }

    // 计算预计剩余天数
    let estimatedRemainingDays: number | undefined
    const pendingStep = process.steps.find((s) => s.status === 'pending' && s.plannedDate)
    if (pendingStep && pendingStep.plannedDate) {
      const planned = new Date(pendingStep.plannedDate).getTime()
      const now = Date.now()
      estimatedRemainingDays = Math.max(0, (planned - now) / (24 * 60 * 60 * 1000))
    }

    return {
      totalSteps,
      completedSteps,
      pendingSteps,
      completionRate,
      avgCompletionDays,
      estimatedRemainingDays,
    }
  }, [process])

  /** 更新步骤状态 */
  const handleUpdateStepStatus = useCallback(
    (stepId: string, status: DecisionStepStatus) => {
      if (!process) return

      const updatedSteps = process.steps.map((step) => {
        if (step.id === stepId) {
          return {
            ...step,
            status,
            completedAt: status === 'completed' ? new Date().toISOString() : undefined,
            updatedAt: new Date().toISOString(),
          }
        }
        return step
      })

      // 更新当前步骤
      let currentStepId = process.currentStepId
      if (status === 'completed') {
        const currentIndex = updatedSteps.findIndex((s) => s.id === stepId)
        const nextPending = updatedSteps.find((s, i) => i > currentIndex && s.status === 'pending')
        if (nextPending) {
          currentStepId = nextPending.id
        }
      }

      const updatedProcess: DecisionProcess = {
        ...process,
        steps: updatedSteps,
        currentStepId,
        status:
          updatedSteps.every((s) => s.status === 'completed' || s.status === 'skipped')
            ? 'completed'
            : process.status,
        completedAt:
          updatedSteps.every((s) => s.status === 'completed' || s.status === 'skipped')
            ? new Date().toISOString()
            : process.completedAt,
        updatedAt: new Date().toISOString(),
      }

      setProcess(updatedProcess)
      onUpdate?.(updatedProcess)

      toast({
        title: '已更新',
        description: `步骤 "${updatedSteps.find((s) => s.id === stepId)?.name}" 状态已更新`,
      })
    },
    [process, onUpdate]
  )

  /** 打开步骤编辑器 */
  const handleOpenStepEditor = useCallback((mode: 'create' | 'edit', step?: DecisionStep) => {
    if (mode === 'edit' && step) {
      setEditingStep({ ...step })
    } else {
      setEditingStep({
        name: '',
        description: '',
        ownerId: '',
        ownerName: '',
        status: 'pending',
        plannedDate: new Date().toISOString().split('T')[0],
        notes: '',
      })
    }
    setStepEditor({ open: true, mode, step })
  }, [])

  /** 保存步骤 */
  const handleSaveStep = useCallback(() => {
    if (!process || !editingStep.name) {
      toast({
        title: '验证失败',
        description: '步骤名称不能为空',
        variant: 'destructive',
      })
      return
    }

    let updatedSteps: DecisionStep[]
    let updatedProcess: DecisionProcess

    if (stepEditor.mode === 'create') {
      const newStep: DecisionStep = {
        id: `step_${Date.now()}`,
        name: editingStep.name!,
        description: editingStep.description,
        ownerId: editingStep.ownerId || '',
        ownerName: editingStep.ownerName || '未指定',
        status: (editingStep.status as DecisionStepStatus) || 'pending',
        plannedDate: editingStep.plannedDate,
        notes: editingStep.notes,
        sortOrder: process.steps.length,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      updatedSteps = [...process.steps, newStep]
    } else {
      updatedSteps = process.steps.map((step) =>
        step.id === stepEditor.step?.id
          ? {
              ...step,
              name: editingStep.name!,
              description: editingStep.description,
              ownerId: editingStep.ownerId || '',
              ownerName: editingStep.ownerName || '未指定',
              status: (editingStep.status as DecisionStepStatus) || step.status,
              plannedDate: editingStep.plannedDate,
              notes: editingStep.notes,
              updatedAt: new Date().toISOString(),
            }
          : step
      )
    }

    updatedProcess = {
      ...process,
      steps: updatedSteps,
      updatedAt: new Date().toISOString(),
    }

    setProcess(updatedProcess)
    onUpdate?.(updatedProcess)
    setStepEditor({ open: false, mode: 'create' })

    toast({
      title: '已保存',
      description: `步骤 "${editingStep.name}" 已${stepEditor.mode === 'create' ? '创建' : '更新'}`,
    })
  }, [process, editingStep, stepEditor.mode, onUpdate])

  /** 删除步骤 */
  const handleDeleteStep = useCallback(
    (stepId: string) => {
      if (!process) return

      const updatedSteps = process.steps.filter((step) => step.id !== stepId)
      const updatedProcess: DecisionProcess = {
        ...process,
        steps: updatedSteps,
        currentStepId:
          process.currentStepId === stepId
            ? updatedSteps[0]?.id
            : process.currentStepId,
        updatedAt: new Date().toISOString(),
      }

      setProcess(updatedProcess)
      onUpdate?.(updatedProcess)

      toast({
        title: '已删除',
        description: '步骤已删除',
      })
    },
    [process, onUpdate]
  )

  if (!process) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">加载决策流程...</p>
        </div>
      </div>
    )
  }

  const stats = calculateStats()

  return (
    <div className="space-y-6">
      {/* 流程概览卡片 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {process.name}
              </CardTitle>
              <CardDescription>{process.description}</CardDescription>
            </div>
            <Badge className={cn(processStatusColors[process.status])}>
              {processStatusLabels[process.status]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* 统计信息 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold">{stats.totalSteps}</div>
              <div className="text-sm text-muted-foreground">总步骤</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.completedSteps}</div>
              <div className="text-sm text-muted-foreground">已完成</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingSteps}</div>
              <div className="text-sm text-muted-foreground">进行中</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {stats.completionRate.toFixed(0)}%
              </div>
              <div className="text-sm text-muted-foreground">完成率</div>
            </div>
          </div>

          {/* 进度条 */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">整体进度</span>
              <span className="font-medium">{stats.completionRate.toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
          </div>

          {/* 时间信息 */}
          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            {stats.avgCompletionDays !== undefined && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>平均完成时间：{stats.avgCompletionDays.toFixed(1)} 天</span>
              </div>
            )}
            {stats.estimatedRemainingDays !== undefined && (
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                <span>预计剩余：{stats.estimatedRemainingDays.toFixed(0)} 天</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 决策流程图 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">决策步骤</CardTitle>
            {!readOnly && (
              <Button size="sm" onClick={() => handleOpenStepEditor('create')}>
                <Plus className="h-4 w-4 mr-1" />
                添加步骤
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {process.steps.map((step, index) => {
              const isCurrent = process.currentStepId === step.id
              const isCompleted = step.status === 'completed'

              return (
                <div
                  key={step.id}
                  className={cn(
                    'relative flex items-start gap-4 p-4 border rounded-lg transition-colors',
                    isCurrent && 'border-blue-300 bg-blue-50',
                    isCompleted && 'bg-green-50 border-green-200'
                  )}
                >
                  {/* 步骤序号 */}
                  <div
                    className={cn(
                      'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isCurrent
                        ? 'bg-blue-500 text-white'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      index + 1
                    )}
                  </div>

                  {/* 步骤内容 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{step.name}</h4>
                      <Badge
                        variant="outline"
                        className={cn(statusColors[step.status], 'text-xs')}
                      >
                        {statusLabels[step.status]}
                      </Badge>
                      {isCurrent && (
                        <Badge variant="default" className="text-xs">
                          当前步骤
                        </Badge>
                      )}
                    </div>

                    {step.description && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {step.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{step.ownerName || '未指定负责人'}</span>
                      </div>
                      {step.plannedDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>计划：{step.plannedDate}</span>
                        </div>
                      )}
                      {step.completedAt && (
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>完成：{step.completedAt.split('T')[0]}</span>
                        </div>
                      )}
                    </div>

                    {step.notes && (
                      <div className="mt-2 p-2 bg-muted/50 rounded text-sm">
                        <span className="text-muted-foreground">备注：</span>
                        {step.notes}
                      </div>
                    )}
                  </div>

                  {/* 操作按钮 */}
                  {!readOnly && (
                    <div className="flex-shrink-0 flex flex-col gap-2">
                      {step.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleUpdateStepStatus(step.id, 'completed')}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenStepEditor('edit', step)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteStep(step.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  )}

                  {/* 连接线 */}
                  {index < process.steps.length - 1 && (
                    <div className="absolute left-8 top-16 bottom-0 w-px bg-muted -z-10" />
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* 步骤编辑对话框 */}
      <Dialog
        open={stepEditor.open}
        onOpenChange={(open) => setStepEditor({ open, mode: 'create' })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {stepEditor.mode === 'create' ? '添加决策步骤' : '编辑决策步骤'}
            </DialogTitle>
            <DialogDescription>
              {stepEditor.mode === 'create'
                ? '创建新的决策流程步骤'
                : '修改步骤信息'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>步骤名称 *</Label>
              <Input
                value={editingStep.name || ''}
                onChange={(e) =>
                  setEditingStep((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="例如：需求确认"
              />
            </div>

            <div>
              <Label>步骤描述</Label>
              <Textarea
                value={editingStep.description || ''}
                onChange={(e) =>
                  setEditingStep((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="描述此步骤的具体内容..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>负责人姓名</Label>
                <Input
                  value={editingStep.ownerName || ''}
                  onChange={(e) =>
                    setEditingStep((prev) => ({ ...prev, ownerName: e.target.value }))
                  }
                  placeholder="例如：张三"
                />
              </div>
              <div>
                <Label>计划完成日期</Label>
                <Input
                  type="date"
                  value={editingStep.plannedDate || ''}
                  onChange={(e) =>
                    setEditingStep((prev) => ({ ...prev, plannedDate: e.target.value }))
                  }
                />
              </div>
            </div>

            <div>
              <Label>状态</Label>
              <Select
                value={editingStep.status || 'pending'}
                onValueChange={(value) =>
                  setEditingStep((prev) => ({ ...prev, status: value as DecisionStepStatus }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">未完成</SelectItem>
                  <SelectItem value="completed">已完成</SelectItem>
                  <SelectItem value="skipped">已跳过</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>备注</Label>
              <Textarea
                value={editingStep.notes || ''}
                onChange={(e) =>
                  setEditingStep((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="添加备注信息..."
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setStepEditor({ open: false, mode: 'create' })}
            >
              取消
            </Button>
            <Button onClick={handleSaveStep}>
              {stepEditor.mode === 'create' ? '创建' : '保存'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DecisionProcessRecord
