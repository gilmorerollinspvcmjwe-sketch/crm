import React, { useState } from 'react'
import {
  Zap,
  Clock,
  GitBranch,
  ListChecks,
  Settings2,
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
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { ConditionBuilder } from './ConditionBuilder'
import type {
  TriggerConfig,
  TriggerType,
  WorkflowCondition,
} from '@/types/workflow'

interface TriggerConfigPanelProps {
  value?: TriggerConfig
  onChange?: (config: TriggerConfig) => void
  objectId?: string
  availableFields?: { id: string; name: string; type: string }[]
}

const TRIGGER_TYPES: { value: TriggerType; label: string; icon: React.ReactNode }[] = [
  { value: 'manual', label: '手动触发', icon: <Zap className="h-4 w-4" /> },
  { value: 'record_created', label: '记录创建时', icon: <ListChecks className="h-4 w-4" /> },
  { value: 'record_updated', label: '记录更新时', icon: <Settings2 className="h-4 w-4" /> },
  { value: 'field_changed', label: '字段变更时', icon: <GitBranch className="h-4 w-4" /> },
  { value: 'stage_changed', label: '阶段变更时', icon: <GitBranch className="h-4 w-4" /> },
  { value: 'scheduled', label: '定时执行', icon: <Clock className="h-4 w-4" /> },
  { value: 'no_activity', label: '超过X天无活动', icon: <Clock className="h-4 w-4" /> },
  { value: 'date_reached', label: '到达指定日期', icon: <Clock className="h-4 w-4" /> },
]

export function TriggerConfigPanel({
  value = { type: 'manual' },
  onChange,
  objectId,
  availableFields = [],
}: TriggerConfigPanelProps) {
  const [config, setConfig] = useState<TriggerConfig>(value)

  const updateConfig = (updates: Partial<TriggerConfig>) => {
    const newConfig = { ...config, ...updates }
    setConfig(newConfig)
    onChange?.(newConfig)
  }

  const renderTypeConfig = () => {
    switch (config.type) {
      case 'scheduled':
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm">Cron 表达式</Label>
              <Input
                className="mt-1"
                placeholder="0 0 * * *"
                value={config.cronExpression || ''}
                onChange={(e) => updateConfig({ cronExpression: e.target.value })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                标准 Cron 格式：分 时 日 月 周
              </p>
            </div>

            <div>
              <Label className="text-sm">时区</Label>
              <Input
                className="mt-1"
                placeholder="Asia/Shanghai"
                value={config.timezone || ''}
                onChange={(e) => updateConfig({ timezone: e.target.value })}
              />
            </div>
          </div>
        )

      case 'field_changed':
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm">监听字段</Label>
              <Select
                value={config.fieldId}
                onValueChange={(val) => updateConfig({ fieldId: val })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="选择字段" />
                </SelectTrigger>
                <SelectContent>
                  {availableFields.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm">原值（可选）</Label>
                <Input
                  className="mt-1"
                  placeholder="变更前的值"
                  value={(config as any).oldValue || ''}
                  onChange={(e) => updateConfig({ oldValue: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-sm">新值（可选）</Label>
                <Input
                  className="mt-1"
                  placeholder="变更后的值"
                  value={(config as any).newValue || ''}
                  onChange={(e) => updateConfig({ newValue: e.target.value })}
                />
              </div>
            </div>
          </div>
        )

      case 'stage_changed':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm">原阶段（可选）</Label>
                <Input
                  className="mt-1"
                  placeholder="原阶段"
                  value={config.fromStage || ''}
                  onChange={(e) => updateConfig({ fromStage: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-sm">目标阶段（可选）</Label>
                <Input
                  className="mt-1"
                  placeholder="目标阶段"
                  value={config.toStage || ''}
                  onChange={(e) => updateConfig({ toStage: e.target.value })}
                />
              </div>
            </div>
          </div>
        )

      case 'no_activity':
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm">无活动天数</Label>
              <Input
                className="mt-1"
                type="number"
                min={1}
                placeholder="7"
                value={config.inactivityDays || ''}
                onChange={(e) =>
                  updateConfig({ inactivityDays: parseInt(e.target.value) })
                }
              />
            </div>
          </div>
        )

      case 'date_reached':
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm">日期字段</Label>
              <Select
                value={config.dateField}
                onValueChange={(val) => updateConfig({ dateField: val })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="选择日期字段" />
                </SelectTrigger>
                <SelectContent>
                  {availableFields
                    .filter((f) => f.type === 'date')
                    .map((f) => (
                      <SelectItem key={f.id} value={f.id}>
                        {f.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm">偏移天数</Label>
                <Input
                  className="mt-1"
                  type="number"
                  placeholder="0"
                  value={config.offsetDays || ''}
                  onChange={(e) =>
                    updateConfig({ offsetDays: parseInt(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label className="text-sm">偏移方向</Label>
                <Select
                  value={config.offsetDirection}
                  onValueChange={(val: 'before' | 'after' | 'on') =>
                    updateConfig({ offsetDirection: val })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="选择方向" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="before">之前</SelectItem>
                    <SelectItem value="after">之后</SelectItem>
                    <SelectItem value="on">当天</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Trigger Type Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" />
            触发器配置
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm">触发类型</Label>
            <Select
              value={config.type}
              onValueChange={(val: TriggerType) => updateConfig({ type: val })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TRIGGER_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    <span className="flex items-center gap-2">
                      {t.icon}
                      {t.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Type-specific config */}
          {renderTypeConfig()}

          {/* Filters / Conditions */}
          {(config.type === 'record_created' ||
            config.type === 'record_updated' ||
            config.type === 'manual') &&
            config.filters &&
            config.filters.length > 0 && (
              <div className="pt-4 border-t">
                <Label className="text-sm font-medium mb-2 block">触发条件</Label>
                <ConditionBuilder
                  value={config.filters}
                  onChange={(filters) => updateConfig({ filters })}
                  fields={availableFields}
                />
              </div>
            )}
        </CardContent>
      </Card>

      {/* Active Badge */}
      <div className="flex items-center gap-2">
        <Switch
          id="trigger-active"
          checked={true}
          onCheckedChange={() => {}}
        />
        <Label htmlFor="trigger-active" className="text-sm">
          启用此触发器
        </Label>
      </div>
    </div>
  )
}
