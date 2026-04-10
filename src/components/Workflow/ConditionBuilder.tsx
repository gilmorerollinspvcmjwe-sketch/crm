import React, { useState, useCallback } from 'react'
import { Plus, Trash2, GripVertical, Code2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type {
  WorkflowCondition,
  ConditionGroup,
  ConditionOperator,
} from '@/types/workflow'

interface ConditionBuilderProps {
  value?: WorkflowCondition[]
  onChange?: (conditions: WorkflowCondition[]) => void
  fields?: { id: string; name: string; type: string }[]
  maxDepth?: number
}

const OPERATORS: { value: ConditionOperator; label: string }[] = [
  { value: 'equals', label: '等于' },
  { value: 'not_equals', label: '不等于' },
  { value: 'contains', label: '包含' },
  { value: 'not_contains', label: '不包含' },
  { value: 'starts_with', label: '开头是' },
  { value: 'ends_with', label: '结尾是' },
  { value: 'greater_than', label: '大于' },
  { value: 'greater_than_or_equals', label: '大于等于' },
  { value: 'less_than', label: '小于' },
  { value: 'less_than_or_equals', label: '小于等于' },
  { value: 'is_empty', label: '为空' },
  { value: 'is_not_empty', label: '不为空' },
  { value: 'is_before', label: '早于' },
  { value: 'is_after', label: '晚于' },
  { value: 'is_within_last', label: '在过去' },
  { value: 'is_not_within_last', label: '不在过去' },
]

const NO_VALUE_OPERATORS: ConditionOperator[] = [
  'is_empty',
  'is_not_empty',
]

function generateId() {
  return `cond_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

interface ConditionRowProps {
  condition: WorkflowCondition
  onChange: (condition: WorkflowCondition) => void
  onRemove: () => void
  fields: { id: string; name: string; type: string }[]
  showLogic?: boolean
  onLogicChange?: (logic: 'AND' | 'OR') => void
}

function ConditionRow({
  condition,
  onChange,
  onRemove,
  fields,
  showLogic = false,
  onLogicChange,
}: ConditionRowProps) {
  const needsValue = !NO_VALUE_OPERATORS.includes(condition.operator)

  return (
    <div className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg">
      {showLogic && onLogicChange && (
        <Select
          value={condition.logic || 'AND'}
          onValueChange={(val: 'AND' | 'OR') => onLogicChange(val)}
        >
          <SelectTrigger className="w-20 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AND">且</SelectItem>
            <SelectItem value="OR">或</SelectItem>
          </SelectContent>
        </Select>
      )}

      <GripVertical className="h-4 w-4 text-muted-foreground mt-2.5 cursor-grab" />

      {/* Field selector */}
      <Select
        value={condition.field}
        onValueChange={(val) => onChange({ ...condition, field: val })}
      >
        <SelectTrigger className="flex-1">
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

      {/* Operator selector */}
      <Select
        value={condition.operator}
        onValueChange={(val: ConditionOperator) =>
          onChange({ ...condition, operator: val })
        }
      >
        <SelectTrigger className="w-36">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {OPERATORS.map((op) => (
            <SelectItem key={op.value} value={op.value}>
              {op.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Value input */}
      {needsValue && (
        <Input
          className="flex-1"
          placeholder="值"
          value={String(condition.value ?? '')}
          onChange={(e) =>
            onChange({ ...condition, value: e.target.value })
          }
        />
      )}

      <Button
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="text-destructive hover:text-destructive mt-0.5"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}

export function ConditionBuilder({
  value = [],
  onChange,
  fields = [],
  maxDepth = 3,
}: ConditionBuilderProps) {
  const [conditions, setConditions] = useState<WorkflowCondition[]>(
    value.length > 0
      ? value
      : [
          {
            id: generateId(),
            field: '',
            operator: 'equals',
            value: '',
            logic: 'AND',
          },
        ]
  )

  const updateCondition = useCallback(
    (index: number, updated: WorkflowCondition) => {
      const newConditions = [...conditions]
      newConditions[index] = updated
      setConditions(newConditions)
      onChange?.(newConditions)
    },
    [conditions, onChange]
  )

  const removeCondition = useCallback(
    (index: number) => {
      const newConditions = conditions.filter((_, i) => i !== index)
      setConditions(newConditions)
      onChange?.(newConditions)
    },
    [conditions, onChange]
  )

  const addCondition = useCallback(() => {
    const newCondition: WorkflowCondition = {
      id: generateId(),
      field: '',
      operator: 'equals',
      value: '',
      logic: 'AND',
    }
    const newConditions = [...conditions, newCondition]
    setConditions(newConditions)
    onChange?.(newConditions)
  }, [conditions, onChange])

  const updateLogic = useCallback(
    (index: number, logic: 'AND' | 'OR') => {
      updateCondition(index, { ...conditions[index], logic })
    },
    [conditions, updateCondition]
  )

  const renderConditionPreview = () => {
    if (conditions.length === 0) return null

    const parts = conditions.map((c, i) => {
      const field = fields.find((f) => f.id === c.field)?.name || c.field
      const op = OPERATORS.find((o) => o.value === c.operator)?.label || c.operator
      const val = c.value ?? ''
      const logic = i === 0 ? '' : ` ${c.logic || 'AND'} `
      return `${logic}${field} ${op} ${val}`
    })

    return (
      <div className="mt-3 p-3 bg-muted rounded-lg border">
        <div className="flex items-center gap-2 mb-2">
          <Code2 className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-medium">条件预览</span>
        </div>
        <code className="text-sm text-foreground break-all">{parts.join('')}</code>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {conditions.map((condition, index) => (
          <ConditionRow
            key={condition.id}
            condition={condition}
            onChange={(updated) => updateCondition(index, updated)}
            onRemove={() => removeCondition(index)}
            fields={fields}
            showLogic={index > 0}
            onLogicChange={(logic) => updateLogic(index, logic)}
          />
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={addCondition}
        className="gap-1.5"
      >
        <Plus className="h-3.5 w-3.5" />
        添加条件
      </Button>

      {renderConditionPreview()}
    </div>
  )
}
