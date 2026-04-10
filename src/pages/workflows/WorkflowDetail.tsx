/**
 * WorkflowDetail - 工作流详情页
 * 使用 Mock 数据的工作流详情
 */

import * as React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Workflow,
  ArrowLeft,
  Play,
  Pause,
  Copy,
  Trash2,
  Settings,
  History,
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Zap,
  Edit,
  Save,
  Calendar,
  Activity,
  AlertCircle,
  ChevronRight,
  ExternalLink,
  RefreshCw,
  GitBranch,
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { 
  useWorkflow, 
  useWorkflowExecutions, 
  useToggleWorkflowStatus, 
  useDeleteWorkflow,
  useExecuteWorkflow,
  triggerTypeConfig 
} from '@/hooks/useWorkflows'
import type { MockWorkflow, WorkflowExecution } from '@/mock/workflows'
import { statusConfig } from '@/mock/workflows'

// 触发器图标映射
const triggerIcons: Record<string, string> = {
  time: '🕐',
  event: '⚡',
  condition: '🔀',
  manual: '👆',
  webhook: '🔗',
  api: '🔌',
  schedule: '📅',
  status: '📊',
}

export function WorkflowDetailPage() {
  const { workflowId } = useParams<{ workflowId: string }>()
  const navigate = useNavigate()
  
  // 使用 Mock 数据
  const { data: workflow, isLoading, refetch } = useWorkflow(workflowId || null)
  const { data: executions = [] } = useWorkflowExecutions(workflowId || undefined)
  
  const toggleStatus = useToggleWorkflowStatus()
  const deleteWorkflow = useDeleteWorkflow()
  const executeWorkflow = useExecuteWorkflow()

  const [isEditing, setIsEditing] = React.useState(false)
  const [editedName, setEditedName] = React.useState('')
  const [editedDescription, setEditedDescription] = React.useState('')

  React.useEffect(() => {
    if (workflow) {
      setEditedName(workflow.name)
      setEditedDescription(workflow.description)
    }
  }, [workflow])

  const handleToggleStatus = () => {
    if (workflow) {
      toggleStatus.mutate({ id: workflow.id, currentStatus: workflow.status as string })
    }
  }

  const handleExecute = () => {
    if (workflow) {
      executeWorkflow.mutate(workflow.id)
    }
  }

  const handleDelete = () => {
    if (workflow && window.confirm(`确定要删除工作流 "${workflow.name}" 吗？此操作不可撤销。`)) {
      deleteWorkflow.mutate(workflow.id, {
        onSuccess: () => navigate('/workflows'),
      })
    }
  }

  const handleSave = () => {
    // TODO: 实现保存逻辑
    setIsEditing(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    )
  }

  if (!workflow) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-4 text-destructive" />
          <p className="text-muted-foreground">工作流不存在</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate('/workflows')}>
            返回列表
          </Button>
        </div>
      </div>
    )
  }

  const statusInfo = statusConfig[workflow.status] || { label: workflow.status, className: 'bg-gray-400' }
  const triggerInfo = triggerTypeConfig[workflow.triggerType]

  // 计算成功率
  const successRate = workflow.stats.totalExecutions > 0
    ? Math.round((workflow.stats.successCount / workflow.stats.totalExecutions) * 100)
    : 0

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/workflows')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center',
              workflow.status === 'active' ? 'bg-green-100 text-green-600' :
              workflow.status === 'inactive' ? 'bg-gray-100 text-gray-600' :
              'bg-yellow-100 text-yellow-600'
            )}>
              <Workflow className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="font-bold text-xl max-w-[300px]"
                  />
                ) : (
                  <h1 className="text-xl font-bold">{workflow.name}</h1>
                )}
                <Badge className={statusInfo.className}>
                  {statusInfo.label}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                ID: {workflow.id} · 触发类型: {triggerInfo?.label} · 创建者: {workflow.createdBy}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                取消
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                保存
              </Button>
            </>
          ) : (
            <>
              {workflow.status === 'active' ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleToggleStatus}
                  disabled={toggleStatus.isPending}
                >
                  <Pause className="h-4 w-4 mr-2" />
                  暂停
                </Button>
              ) : workflow.status === 'inactive' ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleToggleStatus}
                  disabled={toggleStatus.isPending}
                >
                  <Play className="h-4 w-4 mr-2" />
                  启动
                </Button>
              ) : null}
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleExecute}
                disabled={executeWorkflow.isPending || workflow.status === 'draft'}
              >
                <Zap className="h-4 w-4 mr-2" />
                执行
              </Button>
              <Button variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                复制
              </Button>
              <Button variant="outline" size="sm">
                <History className="h-4 w-4 mr-2" />
                执行记录
              </Button>
              <Button size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                编辑
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">总执行数</span>
            </div>
            <div className="text-3xl font-bold">{workflow.stats.totalExecutions.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">成功</span>
            </div>
            <div className="text-3xl font-bold text-green-600">{workflow.stats.successCount.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium">失败</span>
            </div>
            <div className="text-3xl font-bold text-red-600">{workflow.stats.failedCount.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium">成功率</span>
            </div>
            <div className="text-3xl font-bold text-purple-600">{successRate}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium">平均耗时</span>
            </div>
            <div className="text-3xl font-bold text-orange-600">{workflow.stats.avgDuration}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Workflow Graph */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">工作流结构</CardTitle>
              <CardDescription>工作流的触发器和执行步骤</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Trigger */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">{triggerIcons[workflow.triggerType] || '⚡'}</span>
                  </div>
                  <div className="flex-1 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                    <div className="font-medium text-sm text-blue-900">
                      触发器: {triggerInfo?.label || workflow.triggerType}
                    </div>
                    <div className="text-xs text-blue-700">
                      对象: {workflow.objectType} · 类型: {workflow.category}
                    </div>
                  </div>
                </div>

                {/* Steps */}
                {workflow.nodes.map((node, index) => (
                  <React.Fragment key={node.id}>
                    <div className="flex items-center justify-center">
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                        node.type === 'action' ? 'bg-green-100 text-green-600' :
                        node.type === 'condition' ? 'bg-yellow-100 text-yellow-600' :
                        node.type === 'delay' ? 'bg-purple-100 text-purple-600' :
                        node.type === 'approval' ? 'bg-orange-100 text-orange-600' :
                        node.type === 'webhook' ? 'bg-cyan-100 text-cyan-600' :
                        'bg-gray-100 text-gray-600'
                      )}>
                        {node.type === 'action' ? <CheckCircle className="h-4 w-4" /> :
                         node.type === 'condition' ? <AlertCircle className="h-4 w-4" /> :
                         node.type === 'delay' ? <Clock className="h-4 w-4" /> :
                         node.type === 'approval' ? <User className="h-4 w-4" /> :
                         node.type === 'webhook' ? <ExternalLink className="h-4 w-4" /> :
                         <GitBranch className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 bg-card border rounded-lg px-4 py-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium text-sm">{node.name}</span>
                            {node.description && (
                              <span className="text-muted-foreground text-xs ml-2">{node.description}</span>
                            )}
                          </div>
                          <Badge variant="outline" className="text-xs ml-2">
                            {node.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Executions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">执行记录</CardTitle>
              <CardDescription>最近执行情况</CardDescription>
            </CardHeader>
            <CardContent>
              {executions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>暂无执行记录</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {executions.slice(0, 5).map((exec) => (
                    <div key={exec.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <div className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                        exec.status === 'success' ? 'bg-green-100 text-green-600' :
                        exec.status === 'failed' ? 'bg-red-100 text-red-600' :
                        exec.status === 'running' ? 'bg-blue-100 text-blue-600' :
                        'bg-gray-100 text-gray-600'
                      )}>
                        {exec.status === 'success' ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : exec.status === 'failed' ? (
                          <XCircle className="h-3 w-3" />
                        ) : (
                          <RefreshCw className="h-3 w-3" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            执行 #{exec.id.split('-').pop()}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(exec.startedAt).toLocaleString('zh-CN')}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          触发: {exec.trigger.type} · 耗时: {exec.duration ? `${exec.duration}ms` : '-'}
                        </div>
                        {exec.error && (
                          <div className="text-xs text-destructive mt-1">
                            错误: {exec.error}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right - Settings & Info */}
        <div className="space-y-6">
          {/* Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">基本信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-muted-foreground text-xs">描述</Label>
                {isEditing ? (
                  <Textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                ) : (
                  <p className="text-sm mt-1">{workflow.description}</p>
                )}
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-xs">创建时间</Label>
                  <p className="text-sm mt-1">{new Date(workflow.createdAt).toLocaleString('zh-CN')}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">更新时间</Label>
                  <p className="text-sm mt-1">{new Date(workflow.updatedAt).toLocaleString('zh-CN')}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">最近执行</div>
                  <div className="text-xs text-muted-foreground">{workflow.stats.lastRun}</div>
                </div>
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  刷新
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">执行设置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm">并发数</div>
                  <div className="text-xs text-muted-foreground">最大同时执行数</div>
                </div>
                <Select defaultValue="10">
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm">重试次数</div>
                  <div className="text-xs text-muted-foreground">失败后重试次数</div>
                </div>
                <Select defaultValue="3">
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm">超时时间</div>
                  <div className="text-xs text-muted-foreground">单次执行超时（秒）</div>
                </div>
                <Select defaultValue="30">
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10s</SelectItem>
                    <SelectItem value="30">30s</SelectItem>
                    <SelectItem value="60">60s</SelectItem>
                    <SelectItem value="120">120s</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm">执行通知</div>
                  <div className="text-xs text-muted-foreground">执行完成时通知</div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-base text-destructive">危险操作</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full text-destructive border-destructive/50 hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4 mr-2" />
                    删除工作流
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>确认删除工作流</DialogTitle>
                    <DialogDescription>
                      此操作不可撤销。工作流 "{workflow.name}" 将被永久删除。
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline">取消</Button>
                    <Button variant="destructive" onClick={handleDelete}>确认删除</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default WorkflowDetailPage
