/**
 * WorkflowBuilder - 工作流构建器
 * Workflow Builder Page
 */

import * as React from 'react'
import {
  Workflow,
  Plus,
  Trash2,
  GripVertical,
  ChevronRight,
  ChevronDown,
  Play,
  Pause,
  Copy,
  Save,
  ArrowLeft,
  Settings,
  Zap,
  Clock,
  Mail,
  User,
  Bell,
  Webhook,
  Database,
  FileText,
  CheckCircle,
  Circle,
  AlertCircle,
  Edit,
  Hand,
  Calendar,
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
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
import { cn } from '@/lib/utils'

// ============ Helper Components ============

// Placeholder for Tag icon
const Tag = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
    <path d="M7 7h.01" />
  </svg>
)

// ============ Types ============

type NodeType = 'trigger' | 'action' | 'condition' | 'delay'

interface WorkflowNode {
  id: string
  type: NodeType
  label: string
  description?: string
  icon: React.ElementType
  config: Record<string, unknown>
  status?: 'ready' | 'configured' | 'error'
}

interface WorkflowEdge {
  id: string
  source: string
  target: string
  label?: string
}

// ============ Constants ============

const TRIGGERS = [
  { id: 'lead_created', label: '新线索创建', icon: User, description: '当新线索被创建时触发' },
  { id: 'lead_updated', label: '线索状态变更', icon: User, description: '线索状态或字段变更时触发' },
  { id: 'opportunity_created', label: '新商机创建', icon: Zap, description: '当新商机被创建时触发' },
  { id: 'opportunity_stage', label: '商机阶段变更', icon: Zap, description: '商机进入新阶段时触发' },
  { id: 'contract_created', label: '新合同创建', icon: FileText, description: '当新合同被创建时触发' },
  { id: 'payment_received', label: '收款到账', icon: CheckCircle, description: '收到付款时触发' },
  { id: 'schedule_daily', label: '每日定时', icon: Clock, description: '每天指定时间触发' },
  { id: 'schedule_weekly', label: '每周定时', icon: Clock, description: '每周指定时间触发' },
  { id: 'webhook', label: 'Webhook', icon: Webhook, description: '接收外部系统调用触发' },
  // 新增的 4 种触发器类型
  { id: 'field_changed', label: '字段变更', icon: Edit, description: '当指定字段值发生变化时触发' },
  { id: 'no_activity', label: '无活动超时', icon: Clock, description: '超过指定天数无活动时触发' },
  { id: 'date_reached', label: '日期到达', icon: Calendar, description: '当到达指定日期时触发' },
  { id: 'manual', label: '手动触发', icon: Hand, description: '用户手动点击触发工作流' },
]

const ACTIONS = [
  { id: 'assign_lead', label: '分配线索', icon: User, description: '将线索分配给销售或团队' },
  { id: 'send_email', label: '发送邮件', icon: Mail, description: '发送邮件给指定联系人' },
  { id: 'create_task', label: '创建任务', icon: CheckCircle, description: '在系统中创建待办任务' },
  { id: 'send_notification', label: '发送通知', icon: Bell, description: '向用户或团队发送通知' },
  { id: 'update_field', label: '更新字段', icon: Database, description: '更新对象指定字段值' },
  { id: 'call_webhook', label: '调用Webhook', icon: Webhook, description: '向外部系统发送HTTP请求' },
  { id: 'add_tag', label: '添加标签', icon: Tag, description: '为记录添加标签' },
  { id: 'send_sms', label: '发送短信', icon: Bell, description: '发送短信给指定联系人' },
]

const CONDITIONS = [
  { id: 'if', label: '条件判断', icon: AlertCircle, description: '根据条件选择执行分支' },
  { id: 'switch', label: '多条件分支', icon: AlertCircle, description: '多条件分支选择' },
  { id: 'loop', label: '循环执行', icon: Circle, description: '对集合数据循环执行' },
]

const DELAYS = [
  { id: 'wait_seconds', label: '等待秒数', icon: Clock, description: '等待指定秒数后继续' },
  { id: 'wait_minutes', label: '等待分钟', icon: Clock, description: '等待指定分钟后继续' },
  { id: 'wait_hours', label: '等待小时', icon: Clock, description: '等待指定小时后再继续' },
  { id: 'wait_until', label: '等待到时间', icon: Clock, description: '等待到指定时间点继续' },
]

// ============ Node Item Component ============

function NodeItem({
  node,
  isSelected,
  onClick,
}: {
  node: { id: string; label: string; icon: React.ElementType; description?: string; status?: string }
  isSelected: boolean
  onClick: () => void
}) {
  const Icon = node.icon
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-colors',
        isSelected
          ? 'bg-primary/10 border-primary'
          : 'bg-card hover:bg-accent border-border'
      )}
    >
      <div className={cn(
        'flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center',
        node.status === 'configured' ? 'bg-green-100 text-green-600' :
        node.status === 'error' ? 'bg-red-100 text-red-600' :
        'bg-muted'
      )}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm">{node.label}</div>
        {node.description && (
          <div className="text-xs text-muted-foreground mt-0.5">{node.description}</div>
        )}
      </div>
    </button>
  )
}

// ============ Canvas Node Component ============

function CanvasNode({
  node,
  onSelect,
  onDelete,
  isSelected,
}: {
  node: WorkflowNode
  onSelect: () => void
  onDelete: () => void
  isSelected: boolean
}) {
  const Icon = node.icon
  return (
    <div
      className={cn(
        'absolute w-48 bg-card border-2 rounded-xl shadow-lg cursor-pointer transition-all',
        isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50',
        node.type === 'trigger' && 'border-l-4 border-l-blue-500',
        node.type === 'action' && 'border-l-4 border-l-green-500',
        node.type === 'condition' && 'border-l-4 border-l-yellow-500',
        node.type === 'delay' && 'border-l-4 border-l-purple-500',
      )}
      onClick={onSelect}
    >
      <div className="p-3">
        <div className="flex items-center gap-2 mb-1">
          <div className={cn(
            'w-6 h-6 rounded flex items-center justify-center',
            node.type === 'trigger' ? 'bg-blue-100 text-blue-600' :
            node.type === 'action' ? 'bg-green-100 text-green-600' :
            node.type === 'condition' ? 'bg-yellow-100 text-yellow-600' :
            'bg-purple-100 text-purple-600'
          )}>
            <Icon className="h-3 w-3" />
          </div>
          <span className="text-xs font-medium text-muted-foreground uppercase">{node.type}</span>
        </div>
        <div className="font-medium text-sm">{node.label}</div>
        {node.description && (
          <div className="text-xs text-muted-foreground mt-1 truncate">{node.description}</div>
        )}
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete() }}
        className="absolute top-2 right-2 w-5 h-5 rounded bg-muted hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="h-3 w-3" />
      </button>
    </div>
  )
}

// ============ Main Component ============

interface WorkflowBuilderProps {
  workflowId?: string
  onBack?: () => void
  onSave?: () => void
}

export function WorkflowBuilder({ workflowId, onBack, onSave }: WorkflowBuilderProps) {
  const [workflowName, setWorkflowName] = React.useState('新建工作流')
  const [workflowDesc, setWorkflowDesc] = React.useState('')
  const [nodes, setNodes] = React.useState<WorkflowNode[]>([])
  const [selectedNodeId, setSelectedNodeId] = React.useState<string | null>(null)
  const [activeTab, setActiveTab] = React.useState('triggers')
  const [isSaving, setIsSaving] = React.useState(false)
  const [showNodeDialog, setShowNodeDialog] = React.useState(false)
  const [dialogNode, setDialogNode] = React.useState<{ id: string; label: string; icon: React.ElementType; description?: string } | null>(null)

  const selectedNode = nodes.find(n => n.id === selectedNodeId)

  const handleAddNode = (item: { id: string; label: string; icon: React.ElementType; description?: string }, type: NodeType) => {
    const newNode: WorkflowNode = {
      id: `${type}_${Date.now()}`,
      type,
      label: item.label,
      description: item.description,
      icon: item.icon,
      config: {},
      status: 'ready',
    }
    setNodes(prev => [...prev, newNode])
    setSelectedNodeId(newNode.id)
    setShowNodeDialog(false)
    setDialogNode(null)
  }

  const handleDeleteNode = (nodeId: string) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId))
    if (selectedNodeId === nodeId) setSelectedNodeId(null)
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    onSave?.()
  }

  const nodeCategories = [
    { id: 'triggers', label: '触发器', nodes: TRIGGERS },
    { id: 'actions', label: '执行动作', nodes: ACTIONS },
    { id: 'conditions', label: '条件逻辑', nodes: CONDITIONS },
    { id: 'delays', label: '延时', nodes: DELAYS },
  ]

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-card">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <Workflow className="h-5 w-5 text-muted-foreground" />
            <Input
              value={workflowName}
              onChange={e => setWorkflowName(e.target.value)}
              className="font-semibold text-lg border-transparent bg-transparent hover:border-input focus:border-input w-auto min-w-[200px]"
              placeholder="工作流名称"
            />
          </div>
          <Badge variant="outline" className="text-yellow-600 border-yellow-300 bg-yellow-50">
            草稿
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            设置
          </Button>
          <Button variant="outline" size="sm">
            <Copy className="h-4 w-4 mr-2" />
            复制
          </Button>
          <Button size="sm" onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                保存中...
              </span>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                保存
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Node Palette */}
        <div className="w-72 border-r bg-card flex flex-col">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-sm">组件库</h3>
            <p className="text-xs text-muted-foreground mt-1">拖拽或点击添加节点</p>
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            {nodeCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={cn(
                  'flex-1 px-2 py-2 text-xs font-medium transition-colors',
                  activeTab === cat.id
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Node List */}
          <ScrollArea className="flex-1 p-3">
            <div className="space-y-2">
              {(activeTab === 'triggers' ? TRIGGERS :
                activeTab === 'actions' ? ACTIONS :
                activeTab === 'conditions' ? CONDITIONS :
                DELAYS).map((item: { id: string; label: string; icon: React.ElementType; description?: string }) => (
                <NodeItem
                  key={item.id}
                  node={item}
                  isSelected={false}
                  onClick={() => {
                    const type = activeTab === 'triggers' ? 'trigger' :
                      activeTab === 'actions' ? 'action' :
                      activeTab === 'conditions' ? 'condition' : 'delay'
                    const existingNode = nodes.find(n => n.label === item.label)
                    if (!existingNode || activeTab !== 'triggers') {
                      handleAddNode(item, type as NodeType)
                    }
                  }}
                />
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Center - Canvas */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 relative bg-muted/30 overflow-auto">
            {nodes.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">开始构建工作流</h3>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    从左侧组件库中选择触发器开始构建您的工作流程
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-8 space-y-4">
                {nodes.map((node, index) => (
                  <div key={node.id} className="relative">
                    <CanvasNode
                      node={node}
                      isSelected={selectedNodeId === node.id}
                      onSelect={() => setSelectedNodeId(node.id)}
                      onDelete={() => handleDeleteNode(node.id)}
                    />
                    {index < nodes.length - 1 && (
                      <div className="flex items-center justify-center py-2">
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ))}
                {selectedNode && selectedNode.type === 'action' && (
                  <div className="relative">
                    <div className="flex items-center justify-center py-2">
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <button
                      onClick={() => setActiveTab('actions')}
                      className="w-48 mx-auto flex items-center justify-center gap-2 py-3 border-2 border-dashed border-muted-foreground/30 rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-colors"
                    >
                      <Plus className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">添加动作</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        <div className="w-80 border-l bg-card flex flex-col">
          {selectedNode ? (
            <>
              <div className="p-4 border-b">
                <h3 className="font-semibold text-sm">节点配置</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedNode.type === 'trigger' ? '触发器' :
                   selectedNode.type === 'action' ? '执行动作' :
                   selectedNode.type === 'condition' ? '条件逻辑' : '延时'} · {selectedNode.label}
                </p>
              </div>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {/* Node Info */}
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center',
                      selectedNode.type === 'trigger' ? 'bg-blue-100 text-blue-600' :
                      selectedNode.type === 'action' ? 'bg-green-100 text-green-600' :
                      selectedNode.type === 'condition' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-purple-100 text-purple-600'
                    )}>
                      {React.createElement(selectedNode.icon, { className: 'h-5 w-5' })}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{selectedNode.label}</div>
                      <div className="text-xs text-muted-foreground">{selectedNode.description}</div>
                    </div>
                  </div>

                  <Separator />

                  {/* Config Fields */}
                  {selectedNode.type === 'trigger' && (
                    <>
                      <div className="space-y-2">
                        <Label>对象类型</Label>
                        <Select defaultValue="lead">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="lead">线索</SelectItem>
                            <SelectItem value="opportunity">商机</SelectItem>
                            <SelectItem value="contract">合同</SelectItem>
                            <SelectItem value="customer">客户</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* 字段变更触发器配置 */}
                      {selectedNode.label === '字段变更' && (
                        <>
                          <div className="space-y-2">
                            <Label>监控字段</Label>
                            <Select defaultValue="status">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="status">状态</SelectItem>
                                <SelectItem value="amount">金额</SelectItem>
                                <SelectItem value="owner">负责人</SelectItem>
                                <SelectItem value="priority">优先级</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>旧值条件</Label>
                            <Input placeholder="留空表示任意值" />
                          </div>
                          <div className="space-y-2">
                            <Label>新值条件</Label>
                            <Input placeholder="留空表示任意值" />
                          </div>
                        </>
                      )}
                      
                      {/* 无活动超时触发器配置 */}
                      {selectedNode.label === '无活动超时' && (
                        <>
                          <div className="space-y-2">
                            <Label>超时天数</Label>
                            <Select defaultValue="7">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="3">3 天</SelectItem>
                                <SelectItem value="7">7 天</SelectItem>
                                <SelectItem value="14">14 天</SelectItem>
                                <SelectItem value="30">30 天</SelectItem>
                                <SelectItem value="custom">自定义</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>活动类型</Label>
                            <Select defaultValue="any">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="any">任意活动</SelectItem>
                                <SelectItem value="followup">跟进记录</SelectItem>
                                <SelectItem value="call">电话联系</SelectItem>
                                <SelectItem value="meeting">会议</SelectItem>
                                <SelectItem value="email">邮件往来</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      )}
                      
                      {/* 日期到达触发器配置 */}
                      {selectedNode.label === '日期到达' && (
                        <>
                          <div className="space-y-2">
                            <Label>日期字段</Label>
                            <Select defaultValue="endDate">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="endDate">结束日期</SelectItem>
                                <SelectItem value="startDate">开始日期</SelectItem>
                                <SelectItem value="followupDate">跟进日期</SelectItem>
                                <SelectItem value="birthday">生日</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>偏移量</Label>
                            <Select defaultValue="0">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="-7">提前 7 天</SelectItem>
                                <SelectItem value="-3">提前 3 天</SelectItem>
                                <SelectItem value="-1">提前 1 天</SelectItem>
                                <SelectItem value="0">当天</SelectItem>
                                <SelectItem value="1">延后 1 天</SelectItem>
                                <SelectItem value="7">延后 7 天</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>执行时间</Label>
                            <Input type="time" defaultValue="09:00" />
                          </div>
                        </>
                      )}
                      
                      {/* 手动触发器配置 */}
                      {selectedNode.label === '手动触发' && (
                        <>
                          <div className="space-y-2">
                            <Label>确认提示</Label>
                            <Input placeholder="输入确认对话框提示语" />
                          </div>
                          <div className="space-y-2">
                            <Label>可用角色</Label>
                            <Select defaultValue="all">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">所有用户</SelectItem>
                                <SelectItem value="owner">仅负责人</SelectItem>
                                <SelectItem value="admin">仅管理员</SelectItem>
                                <SelectItem value="sales">销售角色</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      )}
                      
                      {/* 通用触发条件 */}
                      {selectedNode.label !== '字段变更' && 
                       selectedNode.label !== '无活动超时' && 
                       selectedNode.label !== '日期到达' && 
                       selectedNode.label !== '手动触发' && (
                        <div className="space-y-2">
                          <Label>触发条件</Label>
                          <Input placeholder="所有记录" />
                        </div>
                      )}
                    </>
                  )}

                  {selectedNode.type === 'action' && selectedNode.label === '发送邮件' && (
                    <>
                      <div className="space-y-2">
                        <Label>收件人</Label>
                        <Select defaultValue="record">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="record">当前记录</SelectItem>
                            <SelectItem value="owner">负责人</SelectItem>
                            <SelectItem value="custom">自定义</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>邮件模板</Label>
                        <Select defaultValue="template1">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="template1">新线索欢迎邮件</SelectItem>
                            <SelectItem value="template2">跟进提醒邮件</SelectItem>
                            <SelectItem value="template3">自定义模板</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>主题</Label>
                        <Input placeholder="输入邮件主题" />
                      </div>
                    </>
                  )}

                  {selectedNode.type === 'action' && selectedNode.label === '创建任务' && (
                    <>
                      <div className="space-y-2">
                        <Label>任务类型</Label>
                        <Select defaultValue="followup">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="followup">跟进任务</SelectItem>
                            <SelectItem value="call">电话联系</SelectItem>
                            <SelectItem value="meeting">会议</SelectItem>
                            <SelectItem value="custom">自定义</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>负责人</Label>
                        <Select defaultValue="owner">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="owner">记录负责人</SelectItem>
                            <SelectItem value="custom">指定人员</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>截止日期</Label>
                        <Select defaultValue="3d">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1d">1天后</SelectItem>
                            <SelectItem value="3d">3天后</SelectItem>
                            <SelectItem value="7d">7天后</SelectItem>
                            <SelectItem value="custom">自定义</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  {selectedNode.type === 'condition' && (
                    <>
                      <div className="space-y-2">
                        <Label>条件字段</Label>
                        <Select defaultValue="status">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="status">状态</SelectItem>
                            <SelectItem value="amount">金额</SelectItem>
                            <SelectItem value="created">创建时间</SelectItem>
                            <SelectItem value="owner">负责人</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>运算符</Label>
                        <Select defaultValue="equals">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="equals">等于</SelectItem>
                            <SelectItem value="not_equals">不等于</SelectItem>
                            <SelectItem value="contains">包含</SelectItem>
                            <SelectItem value="greater">大于</SelectItem>
                            <SelectItem value="less">小于</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>值</Label>
                        <Input placeholder="输入比较值" />
                      </div>
                    </>
                  )}

                  {selectedNode.type === 'delay' && (
                    <div className="space-y-2">
                      <Label>等待时间</Label>
                      <Input type="number" placeholder="1" defaultValue="1" />
                      <Select defaultValue="days">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minutes">分钟</SelectItem>
                          <SelectItem value="hours">小时</SelectItem>
                          <SelectItem value="days">天</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {selectedNode.type === 'action' && !['发送邮件', '创建任务'].includes(selectedNode.label) && (
                    <div className="space-y-2">
                      <Label>操作配置</Label>
                      <Input placeholder="输入配置值" />
                      <p className="text-xs text-muted-foreground">
                        根据所选操作类型配置相关参数
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
              <div className="p-4 border-t">
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full"
                  onClick={() => handleDeleteNode(selectedNode.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  删除节点
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center px-6">
                <Settings className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <h4 className="font-medium text-sm mb-1">节点属性</h4>
                <p className="text-xs text-muted-foreground">
                  选择画布上的节点以配置其属性
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WorkflowBuilder
