import React, { useState } from 'react'
import {
  Mail,
  Bell,
  Edit3,
  Webhook,
  UserPlus,
  ArrowRight,
  Clock,
  Bot,
  Settings2,
  FileText,
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import type {
  ActionConfig,
  ActionType,
  CreateTaskConfig,
  SendEmailConfig,
  SendNotificationConfig,
  UpdateFieldConfig,
  CallWebhookConfig,
  CreateRecordConfig,
  AssignOwnerConfig,
  AdvanceStageConfig,
} from '@/types/workflow'

interface ActionConfigPanelProps {
  value?: ActionConfig
  onChange?: (config: ActionConfig) => void
  fields?: { id: string; name: string; type: string }[]
  users?: { id: string; name: string }[]
  roles?: { id: string; name: string }[]
}

const ACTION_TYPES: { value: ActionType; label: string; icon: React.ReactNode; description: string }[] = [
  {
    value: 'update_field',
    label: '更新字段',
    icon: <Edit3 className="h-4 w-4" />,
    description: '更新记录的指定字段值',
  },
  {
    value: 'send_notification',
    label: '发送通知',
    icon: <Bell className="h-4 w-4" />,
    description: '向指定用户发送站内通知',
  },
  {
    value: 'send_email',
    label: '发送邮件',
    icon: <Mail className="h-4 w-4" />,
    description: '发送邮件给相关人员',
  },
  {
    value: 'create_record',
    label: '创建记录',
    icon: <FileText className="h-4 w-4" />,
    description: '创建新的关联记录',
  },
  {
    value: 'create_task',
    label: '创建任务',
    icon: <Edit3 className="h-4 w-4" />,
    description: '创建待办任务',
  },
  {
    value: 'assign_owner',
    label: '分配负责人',
    icon: <UserPlus className="h-4 w-4" />,
    description: '变更记录负责人',
  },
  {
    value: 'advance_stage',
    label: '推进阶段',
    icon: <ArrowRight className="h-4 w-4" />,
    description: '推进业务流程阶段',
  },
  {
    value: 'call_webhook',
    label: '调用 Webhook',
    icon: <Webhook className="h-4 w-4" />,
    description: '向外部系统发送 HTTP 请求',
  },
  {
    value: 'delay',
    label: '延迟等待',
    icon: <Clock className="h-4 w-4" />,
    description: '等待指定时间后继续',
  },
  {
    value: 'ai_generate',
    label: 'AI 生成',
    icon: <Bot className="h-4 w-4" />,
    description: '使用 AI 生成内容',
  },
]

function ActionPreviewCard({ config }: { config: ActionConfig }) {
  const actionType = ACTION_TYPES.find((t) => t.value === config.type)
  if (!actionType) return null

  const getPreviewContent = () => {
    switch (config.type) {
      case 'update_field':
        return (
          <span className="text-sm">
            更新字段 <Badge variant="secondary">{config.fieldId}</Badge> 的值
          </span>
        )
      case 'send_notification':
        return (
          <span className="text-sm truncate">
            发送通知：{config.title}
          </span>
        )
      case 'send_email':
        return (
          <span className="text-sm truncate">
            发送邮件至 {config.recipients?.map((r) => r.value).join(', ')}
          </span>
        )
      case 'create_task':
        return (
          <span className="text-sm">
            创建任务：{config.title}
          </span>
        )
      case 'call_webhook':
        return (
          <span className="text-sm truncate">
            调用 {config.method} {config.url}
          </span>
        )
      default:
        return <span className="text-sm text-muted-foreground">已配置</span>
    }
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
        {actionType.icon}
      </div>
      <div className="flex-1 min-w-0">{getPreviewContent()}</div>
      <Badge variant="outline">{actionType.label}</Badge>
    </div>
  )
}

export function ActionConfigPanel({
  value,
  onChange,
  fields = [],
  users = [],
  roles = [],
}: ActionConfigPanelProps) {
  const [config, setConfig] = useState<ActionConfig>(
    value || { type: 'update_field', fieldId: '', updateType: 'set' }
  )

  const updateConfig = (updates: Partial<ActionConfig>) => {
    const newConfig = { ...config, ...updates } as ActionConfig
    setConfig(newConfig)
    onChange?.(newConfig)
  }

  const renderActionForm = () => {
    switch (config.type) {
      case 'update_field':
        return (
          <UpdateFieldPanel
            config={config as UpdateFieldConfig}
            onChange={updateConfig}
            fields={fields}
          />
        )
      case 'send_notification':
        return (
          <SendNotificationPanel
            config={config as SendNotificationConfig}
            onChange={updateConfig}
            users={users}
            roles={roles}
          />
        )
      case 'send_email':
        return (
          <SendEmailPanel
            config={config as SendEmailConfig}
            onChange={updateConfig}
            users={users}
          />
        )
      case 'create_task':
        return (
          <CreateTaskPanel
            config={config as CreateTaskConfig}
            onChange={updateConfig}
            users={users}
            fields={fields}
          />
        )
      case 'call_webhook':
        return (
          <WebhookPanel
            config={config as CallWebhookConfig}
            onChange={updateConfig}
          />
        )
      case 'create_record':
        return (
          <CreateRecordPanel
            config={config as CreateRecordConfig}
            onChange={updateConfig}
          />
        )
      case 'assign_owner':
        return (
          <AssignOwnerPanel
            config={config as AssignOwnerConfig}
            onChange={updateConfig}
            users={users}
          />
        )
      case 'advance_stage':
        return (
          <AdvanceStagePanel
            config={config as AdvanceStageConfig}
            onChange={updateConfig}
          />
        )
      default:
        return (
          <p className="text-sm text-muted-foreground">
            暂不支持配置此动作类型
          </p>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Action Type Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">动作类型</Label>
        <div className="grid grid-cols-2 gap-2">
          {ACTION_TYPES.map((type) => (
            <Button
              key={type.value}
              variant={config.type === type.value ? 'default' : 'outline'}
              size="sm"
              onClick={() =>
                setConfig((prev) => ({ type: type.value } as ActionConfig))
              }
              className="justify-start h-auto py-2 px-3"
            >
              <span className="mr-2">{type.icon}</span>
              <span>{type.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Action Config Form */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            动作配置
          </CardTitle>
        </CardHeader>
        <CardContent>{renderActionForm()}</CardContent>
      </Card>

      {/* Preview Card */}
      <div>
        <Label className="text-sm font-medium mb-2 block">动作预览</Label>
        <ActionPreviewCard config={config} />
      </div>
    </div>
  )
}

// ============ Sub-panels for each action type ============

function UpdateFieldPanel({
  config,
  onChange,
  fields,
}: {
  config: UpdateFieldConfig
  onChange: (c: Partial<UpdateFieldConfig>) => void
  fields: { id: string; name: string; type: string }[]
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm">目标字段</Label>
        <Select
          value={config.fieldId}
          onValueChange={(val) => onChange({ fieldId: val })}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="选择字段" />
          </SelectTrigger>
          <SelectContent>
            {fields.map((f) => (
              <SelectItem key={f.id} value={f.id}>
                {f.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm">更新方式</Label>
        <Select
          value={config.updateType}
          onValueChange={(val: UpdateFieldConfig['updateType']) =>
            onChange({ updateType: val })
          }
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="set">设为指定值</SelectItem>
            <SelectItem value="clear">清空</SelectItem>
            <SelectItem value="append">追加</SelectItem>
            <SelectItem value="increment">增加</SelectItem>
            <SelectItem value="decrement">减少</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {config.updateType !== 'clear' && (
        <div>
          <Label className="text-sm">值</Label>
          <Input
            className="mt-1"
            placeholder="输入值"
            value={String(config.value ?? '')}
            onChange={(e) => onChange({ value: e.target.value })}
          />
        </div>
      )}
    </div>
  )
}

function SendNotificationPanel({
  config,
  onChange,
  users,
  roles,
}: {
  config: SendNotificationConfig
  onChange: (c: Partial<SendNotificationConfig>) => void
  users: { id: string; name: string }[]
  roles: { id: string; name: string }[]
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm">通知标题</Label>
        <Input
          className="mt-1"
          placeholder="通知标题"
          value={config.title}
          onChange={(e) => onChange({ title: e.target.value })}
        />
      </div>

      <div>
        <Label className="text-sm">通知内容</Label>
        <Textarea
          className="mt-1"
          placeholder="通知内容"
          rows={3}
          value={config.content}
          onChange={(e) => onChange({ content: e.target.value })}
        />
      </div>

      <div>
        <Label className="text-sm">优先级</Label>
        <Select
          value={config.priority}
          onValueChange={(val: SendNotificationConfig['priority']) =>
            onChange({ priority: val })
          }
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">普通</SelectItem>
            <SelectItem value="high">高</SelectItem>
            <SelectItem value="urgent">紧急</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

function SendEmailPanel({
  config,
  onChange,
  users,
}: {
  config: SendEmailConfig
  onChange: (c: Partial<SendEmailConfig>) => void
  users: { id: string; name: string }[]
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm">邮件主题</Label>
        <Input
          className="mt-1"
          placeholder="邮件主题"
          value={config.subject}
          onChange={(e) => onChange({ subject: e.target.value })}
        />
      </div>

      <div>
        <Label className="text-sm">邮件正文</Label>
        <Textarea
          className="mt-1"
          placeholder="邮件内容，支持变量占位符"
          rows={5}
          value={config.body}
          onChange={(e) => onChange({ body: e.target.value })}
        />
        <p className="text-xs text-muted-foreground mt-1">
          可用变量：{'{{record.name}}'}, {'{{record.owner}}'}, {'{{user.name}}'}
        </p>
      </div>

      <div>
        <Label className="text-sm">发送时间</Label>
        <Select
          value={config.sendTime}
          onValueChange={(val: SendEmailConfig['sendTime']) =>
            onChange({ sendTime: val })
          }
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="immediate">立即发送</SelectItem>
            <SelectItem value="delayed">延迟发送</SelectItem>
            <SelectItem value="scheduled">定时发送</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

function CreateTaskPanel({
  config,
  onChange,
  users,
  fields,
}: {
  config: CreateTaskConfig
  onChange: (c: Partial<CreateTaskConfig>) => void
  users: { id: string; name: string }[]
  fields: { id: string; name: string; type: string }[]
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm">任务标题</Label>
        <Input
          className="mt-1"
          placeholder="任务标题"
          value={config.title}
          onChange={(e) => onChange({ title: e.target.value })}
        />
      </div>

      <div>
        <Label className="text-sm">任务描述</Label>
        <Textarea
          className="mt-1"
          placeholder="任务描述"
          rows={2}
          value={config.description || ''}
          onChange={(e) => onChange({ description: e.target.value })}
        />
      </div>

      <div>
        <Label className="text-sm">优先级</Label>
        <Select
          value={config.priority}
          onValueChange={(val: CreateTaskConfig['priority']) =>
            onChange({ priority: val })
          }
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">低</SelectItem>
            <SelectItem value="medium">中</SelectItem>
            <SelectItem value="high">高</SelectItem>
            <SelectItem value="urgent">紧急</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm">负责人</Label>
        <Select
          value={config.assignee?.type || 'owner'}
          onValueChange={(val: CreateTaskConfig['assignee']['type']) =>
            onChange({ assignee: { type: val, value: '' } })
          }
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="owner">记录负责人</SelectItem>
            <SelectItem value="user">指定用户</SelectItem>
            <SelectItem value="field">字段值</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

function WebhookPanel({
  config,
  onChange,
}: {
  config: CallWebhookConfig
  onChange: (c: Partial<CallWebhookConfig>) => void
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm">请求方法</Label>
        <Select
          value={config.method}
          onValueChange={(val: CallWebhookConfig['method']) =>
            onChange({ method: val })
          }
        >
          <SelectTrigger className="mt-1 w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GET">GET</SelectItem>
            <SelectItem value="POST">POST</SelectItem>
            <SelectItem value="PUT">PUT</SelectItem>
            <SelectItem value="PATCH">PATCH</SelectItem>
            <SelectItem value="DELETE">DELETE</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm">请求 URL</Label>
        <Input
          className="mt-1"
          placeholder="https://api.example.com/webhook"
          value={config.url}
          onChange={(e) => onChange({ url: e.target.value })}
        />
      </div>

      <div>
        <Label className="text-sm">请求体（可选）</Label>
        <Textarea
          className="mt-1"
          placeholder='{"key": "value"}'
          rows={4}
          value={config.body || ''}
          onChange={(e) => onChange({ body: e.target.value })}
        />
      </div>

      <div>
        <Label className="text-sm">重试次数</Label>
        <Input
          className="mt-1"
          type="number"
          min={0}
          max={5}
          placeholder="3"
          value={config.retryCount ?? 3}
          onChange={(e) =>
            onChange({ retryCount: parseInt(e.target.value) })
          }
        />
      </div>
    </div>
  )
}

function CreateRecordPanel({
  config,
  onChange,
}: {
  config: CreateRecordConfig
  onChange: (c: Partial<CreateRecordConfig>) => void
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm">目标对象</Label>
        <Input
          className="mt-1"
          placeholder="目标对象 API 名称"
          value={config.targetObject}
          onChange={(e) => onChange({ targetObject: e.target.value })}
        />
      </div>

      <div>
        <Label className="text-sm">字段映射</Label>
        <p className="text-xs text-muted-foreground mt-1">
          设置源字段到目标字段的映射关系
        </p>
        <Input
          className="mt-1"
          placeholder="源字段 → 目标字段"
          value={
            config.fieldMappings?.map((m) => `${m.sourceField} → ${m.targetField}`).join(', ') || ''
          }
          onChange={(e) => {
            const mappings = e.target.value.split(',').map((s) => {
              const [sourceField, targetField] = s.split('→').map((v) => v.trim())
              return { sourceField: sourceField || '', targetField: targetField || '' }
            })
            onChange({ fieldMappings: mappings })
          }}
        />
      </div>
    </div>
  )
}

function AssignOwnerPanel({
  config,
  onChange,
  users,
}: {
  config: AssignOwnerConfig
  onChange: (c: Partial<AssignOwnerConfig>) => void
  users: { id: string; name: string }[]
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm">分配方式</Label>
        <Select
          value={config.assignType}
          onValueChange={(val: AssignOwnerConfig['assignType']) =>
            onChange({ assignType: val })
          }
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="specific">指定用户</SelectItem>
            <SelectItem value="round_robin">轮询分配</SelectItem>
            <SelectItem value="load_balance">负载均衡</SelectItem>
            <SelectItem value="rule">规则分配</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {config.assignType === 'specific' && (
        <div>
          <Label className="text-sm">选择用户</Label>
          <Select
            value={config.userId}
            onValueChange={(val) => onChange({ userId: val })}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="选择用户" />
            </SelectTrigger>
            <SelectContent>
              {users.map((u) => (
                <SelectItem key={u.id} value={u.id}>
                  {u.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )
}

function AdvanceStagePanel({
  config,
  onChange,
}: {
  config: AdvanceStageConfig
  onChange: (c: Partial<AdvanceStageConfig>) => void
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm">方向</Label>
        <Select
          value={config.direction}
          onValueChange={(val: AdvanceStageConfig['direction']) =>
            onChange({ direction: val })
          }
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="next">下一阶段</SelectItem>
            <SelectItem value="previous">上一阶段</SelectItem>
            <SelectItem value="specific">指定阶段</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {config.direction === 'specific' && (
        <div>
          <Label className="text-sm">目标阶段</Label>
          <Input
            className="mt-1"
            placeholder="目标阶段名称"
            value={config.targetStage || ''}
            onChange={(e) => onChange({ targetStage: e.target.value })}
          />
        </div>
      )}

      <div>
        <Label className="text-sm">变更原因（可选）</Label>
        <Input
          className="mt-1"
          placeholder="变更原因"
          value={config.reason || ''}
          onChange={(e) => onChange({ reason: e.target.value })}
        />
      </div>
    </div>
  )
}
