/**
 * FieldBuilder - 字段构建器组件
 * 用于配置自定义对象的字段属性
 */
import * as React from 'react'
import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Plus,
  Trash2,
  GripVertical,
  Settings2,
  Eye,
  ChevronDown,
  ChevronRight,
  Hash,
  Type,
  Calendar,
  ToggleLeft,
  List,
  ListOrdered,
  Link2,
  FileUp,
  X,
  Check,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { PropertyType, ObjectProperty, PropertyOption } from '@/types/customObject'
import { FieldRenderer } from './FieldRenderer'

/** 字段类型元数据 */
const FIELD_TYPE_META: Record<
  PropertyType,
  { label: string; icon: React.ElementType; color: string }
> = {
  text: { label: '文本', icon: Type, color: 'text-blue-600' },
  textarea: { label: '多行文本', icon: Type, color: 'text-blue-600' },
  number: { label: '数字', icon: Hash, color: 'text-green-600' },
  decimal: { label: '小数', icon: Hash, color: 'text-green-600' },
  date: { label: '日期', icon: Calendar, color: 'text-purple-600' },
  datetime: { label: '日期时间', icon: Calendar, color: 'text-purple-600' },
  time: { label: '时间', icon: Calendar, color: 'text-purple-600' },
  select: { label: '下拉选择', icon: List, color: 'text-orange-600' },
  multiselect: { label: '多选', icon: ListOrdered, color: 'text-orange-600' },
  radio: { label: '单选', icon: List, color: 'text-orange-600' },
  checkbox: { label: '复选框', icon: Check, color: 'text-orange-600' },
  switch: { label: '开关', icon: ToggleLeft, color: 'text-teal-600' },
  currency: { label: '货币', icon: Hash, color: 'text-green-600' },
  percent: { label: '百分比', icon: Hash, color: 'text-green-600' },
  phone: { label: '电话', icon: Type, color: 'text-blue-600' },
  email: { label: '邮箱', icon: Type, color: 'text-blue-600' },
  url: { label: '网址', icon: Type, color: 'text-blue-600' },
  user: { label: '用户', icon: Link2, color: 'text-indigo-600' },
  department: { label: '部门', icon: Link2, color: 'text-indigo-600' },
  file: { label: '文件', icon: FileUp, color: 'text-gray-600' },
  image: { label: '图片', icon: FileUp, color: 'text-gray-600' },
  video: { label: '视频', icon: FileUp, color: 'text-gray-600' },
  richtext: { label: '富文本', icon: Type, color: 'text-blue-600' },
  formula: { label: '公式', icon: Hash, color: 'text-yellow-600' },
  rollup: { label: '汇总', icon: Hash, color: 'text-yellow-600' },
  relation: { label: '关联', icon: Link2, color: 'text-indigo-600' },
  address: { label: '地址', icon: Type, color: 'text-blue-600' },
  rating: { label: '评分', icon: List, color: 'text-orange-600' },
  // Additional types
  boolean: { label: '布尔', icon: ToggleLeft, color: 'text-teal-600' },
  picklist: { label: '下拉选择', icon: List, color: 'text-orange-600' },
  multipicklist: { label: '多选', icon: ListOrdered, color: 'text-orange-600' },
  lookup: { label: '查找', icon: Link2, color: 'text-indigo-600' },
}

/** 支持选项列表的字段类型 */
const PICKLIST_TYPES: PropertyType[] = ['select', 'multiselect', 'radio', 'checkbox']

/** 支持关联目标的字段类型 */
const LOOKUP_TYPES: PropertyType[] = ['user', 'department', 'relation']

export interface FieldBuilderProps {
  /** 初始字段数据 */
  initialField?: Partial<ObjectProperty>
  /** 只读模式 */
  readOnly?: boolean
  /** 自定义样式类名 */
  className?: string
  /** 字段变更回调 */
  onChange?: (field: Partial<ObjectProperty>) => void
  /** 保存回调 */
  onSave?: (field: ObjectProperty) => void
  /** 取消回调 */
  onCancel?: () => void
  /** 可选的目标对象列表（用于 Lookup 类型） */
  targetObjects?: Array<{ id: string; name: string; label: string }>
}

/** 生成唯一 ID */
const generateId = () =>
  `prop_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`

export const FieldBuilder: React.FC<FieldBuilderProps> = ({
  initialField,
  readOnly = false,
  className,
  onChange,
  onSave,
  onCancel,
  targetObjects = [],
}) => {
  const { t } = useTranslation()

  /** 基础配置展开状态 */
  const [basicOpen, setBasicOpen] = useState(true)
  /** 选项配置展开状态 */
  const [optionsOpen, setOptionsOpen] = useState(false)
  /** 验证配置展开状态 */
  const [validationOpen, setValidationOpen] = useState(false)

  /** 字段类型 */
  const [fieldType, setFieldType] = useState<PropertyType>(
    (initialField?.internalType as PropertyType) ?? 'text'
  )

  /** 基础属性 */
  const [fieldName, setFieldName] = useState(initialField?.name ?? '')
  const [fieldLabel, setFieldLabel] = useState(initialField?.label ?? '')
  const [fieldDescription, setFieldDescription] = useState(
    initialField?.description ?? ''
  )
  const [fieldPlaceholder, setFieldPlaceholder] = useState(
    initialField?.placeholder ?? ''
  )
  const [fieldGroup, setFieldGroup] = useState(initialField?.group ?? '')
  const [defaultValue, setDefaultValue] = useState<string | undefined>(
    initialField?.defaultValue as string | undefined
  )

  /** 布尔属性 */
  const [required, setRequired] = useState(initialField?.required ?? false)
  const [listVisible, setListVisible] = useState(initialField?.listVisible ?? true)
  const [detailVisible, setDetailVisible] = useState(
    initialField?.detailVisible ?? true
  )
  const [searchable, setSearchable] = useState(initialField?.searchable ?? false)
  const [sortable, setSortable] = useState(initialField?.sortable ?? false)
  const [bulkEditable, setBulkEditable] = useState(
    initialField?.bulkEditable ?? false
  )
  const [enabled, setEnabled] = useState(initialField?.enabled ?? true)
  const [isPrimary, setIsPrimary] = useState(initialField?.isPrimary ?? false)
  const [isSecondary, setIsSecondary] = useState(initialField?.isSecondary ?? false)
  const [multiple, setMultiple] = useState(initialField?.multiple ?? false)

  /** 验证规则 */
  const [unique, setUnique] = useState(
    initialField?.validation?.unique ?? false
  )
  const [readOnlyValidation, setReadOnlyValidation] = useState(
    initialField?.validation?.readOnly ?? false
  )
  const [minLength, setMinLength] = useState<number | undefined>(
    initialField?.validation?.minLength
  )
  const [maxLength, setMaxLength] = useState<number | undefined>(
    initialField?.validation?.maxLength
  )
  const [min, setMin] = useState<number | undefined>(
    initialField?.validation?.min
  )
  const [max, setMax] = useState<number | undefined>(
    initialField?.validation?.max
  )
  const [precision, setPrecision] = useState<number | undefined>(
    initialField?.validation?.precision
  )
  const [pattern, setPattern] = useState(initialField?.validation?.pattern ?? '')
  const [patternMessage, setPatternMessage] = useState(
    initialField?.validation?.patternMessage ?? ''
  )

  /** 选项列表 */
  const [options, setOptions] = useState<PropertyOption[]>(
    initialField?.options ?? []
  )
  const [newOptionLabel, setNewOptionLabel] = useState('')

  /** Lookup 目标对象 */
  const [targetObjectId, setTargetObjectId] = useState(
    initialField?.targetObjectId ?? ''
  )

  /** 触发变更 */
  const triggerChange = useCallback(() => {
    if (!onChange) return
    const field: Partial<ObjectProperty> = {
      internalType: fieldType,
      name: fieldName,
      label: fieldLabel,
      description: fieldDescription,
      placeholder: fieldPlaceholder,
      group: fieldGroup || undefined,
      defaultValue,
      required,
      listVisible,
      detailVisible,
      searchable,
      sortable,
      bulkEditable,
      enabled,
      isPrimary,
      isSecondary,
      multiple,
      validation: {
        unique,
        readOnly: readOnlyValidation,
        minLength,
        maxLength,
        min,
        max,
        precision,
        pattern: pattern || undefined,
        patternMessage: patternMessage || undefined,
      },
      options: PICKLIST_TYPES.includes(fieldType) ? options : undefined,
      targetObjectId:
        LOOKUP_TYPES.includes(fieldType) && targetObjectId
          ? targetObjectId
          : undefined,
    }
    onChange(field)
  }, [
    fieldType,
    fieldName,
    fieldLabel,
    fieldDescription,
    fieldPlaceholder,
    fieldGroup,
    defaultValue,
    required,
    listVisible,
    detailVisible,
    searchable,
    sortable,
    bulkEditable,
    enabled,
    isPrimary,
    isSecondary,
    multiple,
    unique,
    readOnlyValidation,
    minLength,
    maxLength,
    min,
    max,
    precision,
    pattern,
    patternMessage,
    options,
    targetObjectId,
    onChange,
  ])

  /** 类型变更时触发更新 */
  React.useEffect(() => {
    triggerChange()
    // 展开/收起选项配置
    if (PICKLIST_TYPES.includes(fieldType)) {
      setOptionsOpen(true)
    }
    if (LOOKUP_TYPES.includes(fieldType)) {
      setValidationOpen(true)
    }
  }, [fieldType])

  /** 选项操作 */
  const addOption = () => {
    if (!newOptionLabel.trim()) return
    const newOption: PropertyOption = {
      value: newOptionLabel.trim().toLowerCase().replace(/\s+/g, '_'),
      label: newOptionLabel.trim(),
      sortOrder: options.length,
      enabled: true,
    }
    setOptions([...options, newOption])
    setNewOptionLabel('')
  }

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index))
  }

  const updateOption = (
    index: number,
    key: keyof PropertyOption,
    value: string | number | boolean
  ) => {
    const updated = [...options]
    updated[index] = { ...updated[index], [key]: value }
    setOptions(updated)
  }

  /** 构建完整字段对象 */
  const buildField = (): ObjectProperty => ({
    id: initialField?.id ?? generateId(),
    objectId: initialField?.objectId ?? '',
    name: fieldName,
    label: fieldLabel,
    type: fieldType,
    internalType: fieldType,
    isPrimary,
    isSecondary,
    group: fieldGroup || undefined,
    description: fieldDescription || undefined,
    placeholder: fieldPlaceholder || undefined,
    defaultValue,
    required,
    unique,
    listVisible,
    detailVisible,
    searchable,
    sortable,
    bulkEditable,
    validation: {
      unique,
      readOnly: readOnlyValidation,
      minLength,
      maxLength,
      min,
      max,
      precision,
      pattern: pattern || undefined,
      patternMessage: patternMessage || undefined,
    },
    options: PICKLIST_TYPES.includes(fieldType) ? options : undefined,
    targetObjectId:
      LOOKUP_TYPES.includes(fieldType) && targetObjectId
        ? targetObjectId
        : undefined,
    multiple:
      fieldType === 'multiselect' || fieldType === 'relation' ? multiple : false,
    sortOrder: initialField?.sortOrder ?? 0,
    enabled,
    createdBy: initialField?.createdBy ?? '',
    createdAt: initialField?.createdAt ?? new Date().toISOString(),
  })

  const handleSave = () => {
    const field = buildField()
    onSave?.(field)
  }

  /** 实时预览数据 */
  const previewValue = React.useMemo(() => {
    if (PICKLIST_TYPES.includes(fieldType) && options.length > 0) {
      return options[0].value
    }
    if (fieldType === 'switch') return true
    if (fieldType === 'number' || fieldType === 'decimal') return 0
    if (fieldType === 'date') return new Date().toISOString().split('T')[0]
    return ''
  }, [fieldType, options])

  const previewProperty = React.useMemo(
    (): ObjectProperty =>
      buildField(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      fieldType,
      fieldLabel,
      fieldName,
      required,
      defaultValue,
      options,
      targetObjectId,
      multiple,
    ]
  )

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* 基础配置 */}
      <Collapsible open={basicOpen} onOpenChange={setBasicOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between font-semibold"
          >
            <span className="flex items-center gap-2">
              <Settings2 className="h-4 w-4" />
              基础配置
            </span>
            {basicOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-2">
          {/* 字段类型 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">字段类型</label>
              <Select
                value={fieldType}
                onValueChange={(v) => setFieldType(v as PropertyType)}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(FIELD_TYPE_META).map(([type, meta]) => {
                    const Icon = meta.icon
                    return (
                      <SelectItem key={type} value={type}>
                        <span className="flex items-center gap-2">
                          <Icon className={cn('h-4 w-4', meta.color)} />
                          {meta.label}
                        </span>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">字段名称</label>
              <Input
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
                placeholder="api_field_name"
                disabled={readOnly}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">显示标签</label>
              <Input
                value={fieldLabel}
                onChange={(e) => setFieldLabel(e.target.value)}
                placeholder="字段标签"
                disabled={readOnly}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">分组</label>
              <Input
                value={fieldGroup}
                onChange={(e) => setFieldGroup(e.target.value)}
                placeholder="字段分组（可选）"
                disabled={readOnly}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">帮助文本</label>
            <Input
              value={fieldDescription}
              onChange={(e) => setFieldDescription(e.target.value)}
              placeholder="字段说明或帮助文本"
              disabled={readOnly}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">占位符</label>
            <Input
              value={fieldPlaceholder}
              onChange={(e) => setFieldPlaceholder(e.target.value)}
              placeholder="输入框占位符"
              disabled={readOnly}
            />
          </div>

          {/* 布尔属性开关 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">必填</label>
                <p className="text-xs text-muted-foreground">是否必填字段</p>
              </div>
              <Switch
                checked={required}
                onCheckedChange={setRequired}
                disabled={readOnly}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">唯一</label>
                <p className="text-xs text-muted-foreground">不允许重复值</p>
              </div>
              <Switch
                checked={unique}
                onCheckedChange={setUnique}
                disabled={readOnly}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">列表可见</label>
                <p className="text-xs text-muted-foreground">在列表中显示</p>
              </div>
              <Switch
                checked={listVisible}
                onCheckedChange={setListVisible}
                disabled={readOnly}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">详情可见</label>
                <p className="text-xs text-muted-foreground">在详情页显示</p>
              </div>
              <Switch
                checked={detailVisible}
                onCheckedChange={setDetailVisible}
                disabled={readOnly}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">可搜索</label>
                <p className="text-xs text-muted-foreground">支持全局搜索</p>
              </div>
              <Switch
                checked={searchable}
                onCheckedChange={setSearchable}
                disabled={readOnly}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">可排序</label>
                <p className="text-xs text-muted-foreground">支持列表排序</p>
              </div>
              <Switch
                checked={sortable}
                onCheckedChange={setSortable}
                disabled={readOnly}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">批量编辑</label>
                <p className="text-xs text-muted-foreground">支持批量修改</p>
              </div>
              <Switch
                checked={bulkEditable}
                onCheckedChange={setBulkEditable}
                disabled={readOnly}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">启用</label>
                <p className="text-xs text-muted-foreground">字段是否可用</p>
              </div>
              <Switch
                checked={enabled}
                onCheckedChange={setEnabled}
                disabled={readOnly}
              />
            </div>
          </div>

          {/* 主要/次要属性 */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="isPrimary"
                checked={isPrimary}
                onCheckedChange={(v) => setIsPrimary(!!v)}
                disabled={readOnly}
              />
              <label htmlFor="isPrimary" className="text-sm cursor-pointer">
                主要属性
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="isSecondary"
                checked={isSecondary}
                onCheckedChange={(v) => setIsSecondary(!!v)}
                disabled={readOnly}
              />
              <label htmlFor="isSecondary" className="text-sm cursor-pointer">
                次要属性
              </label>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* 选项列表编辑器（针对 Picklist 类型） */}
      {PICKLIST_TYPES.includes(fieldType) && (
        <Collapsible open={optionsOpen} onOpenChange={setOptionsOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between font-semibold"
            >
              <span className="flex items-center gap-2">
                <List className="h-4 w-4" />
                选项配置
                <Badge variant="secondary">{options.length} 个选项</Badge>
              </span>
              {optionsOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 pt-2">
            {/* 选项列表 */}
            <ScrollArea className="h-[200px] rounded-md border">
              <div className="p-2 space-y-1">
                {options.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    暂无选项，点击下方添加
                  </div>
                ) : (
                  options.map((opt, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 group"
                    >
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                      <Input
                        value={opt.label}
                        onChange={(e) =>
                          updateOption(index, 'label', e.target.value)
                        }
                        className="flex-1 h-8"
                        disabled={readOnly}
                        placeholder="选项标签"
                      />
                      <Input
                        value={opt.value}
                        onChange={(e) =>
                          updateOption(index, 'value', e.target.value)
                        }
                        className="w-32 h-8 font-mono text-xs"
                        disabled={readOnly}
                        placeholder="value"
                      />
                      <Input
                        value={opt.color ?? ''}
                        onChange={(e) =>
                          updateOption(index, 'color', e.target.value)
                        }
                        type="color"
                        className="w-10 h-8 p-1"
                        disabled={readOnly}
                      />
                      <div className="flex items-center gap-1">
                        <Checkbox
                          checked={opt.enabled}
                          onCheckedChange={(v) =>
                            updateOption(index, 'enabled', !!v)
                          }
                          disabled={readOnly}
                        />
                        <span className="text-xs text-muted-foreground">启用</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive opacity-0 group-hover:opacity-100"
                        onClick={() => removeOption(index)}
                        disabled={readOnly}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            {/* 添加新选项 */}
            {!readOnly && (
              <div className="flex items-center gap-2">
                <Input
                  value={newOptionLabel}
                  onChange={(e) => setNewOptionLabel(e.target.value)}
                  placeholder="输入新选项标签..."
                  onKeyDown={(e) => e.key === 'Enter' && addOption()}
                />
                <Button onClick={addOption} size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  添加
                </Button>
              </div>
            )}

            {/* 多选开关 */}
            {(fieldType === 'multiselect' || fieldType === 'relation') && (
              <div className="flex items-center gap-2">
                <Checkbox
                  id="multiple"
                  checked={multiple}
                  onCheckedChange={(v) => setMultiple(!!v)}
                  disabled={readOnly}
                />
                <label htmlFor="multiple" className="text-sm cursor-pointer">
                  支持多选
                </label>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Lookup 目标对象选择 */}
      {LOOKUP_TYPES.includes(fieldType) && (
        <Collapsible open={validationOpen} onOpenChange={setValidationOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between font-semibold"
            >
              <span className="flex items-center gap-2">
                <Link2 className="h-4 w-4" />
                关联配置
              </span>
              {validationOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 pt-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">目标对象</label>
              <Select
                value={targetObjectId}
                onValueChange={setTargetObjectId}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择关联的目标对象" />
                </SelectTrigger>
                <SelectContent>
                  {targetObjects.map((obj) => (
                    <SelectItem key={obj.id} value={obj.id}>
                      {obj.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {fieldType === 'relation' && (
              <div className="flex items-center gap-2">
                <Checkbox
                  id="multiple"
                  checked={multiple}
                  onCheckedChange={(v) => setMultiple(!!v)}
                  disabled={readOnly}
                />
                <label htmlFor="multiple" className="text-sm cursor-pointer">
                  支持多选
                </label>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* 验证规则配置 */}
      <Collapsible open={validationOpen} onOpenChange={setValidationOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between font-semibold"
          >
            <span className="flex items-center gap-2">
              <Settings2 className="h-4 w-4" />
              验证规则
            </span>
            {validationOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            {(fieldType === 'text' || fieldType === 'textarea') && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">最小长度</label>
                  <Input
                    type="number"
                    min={0}
                    value={minLength ?? ''}
                    onChange={(e) =>
                      setMinLength(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    disabled={readOnly}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">最大长度</label>
                  <Input
                    type="number"
                    min={0}
                    value={maxLength ?? ''}
                    onChange={(e) =>
                      setMaxLength(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    disabled={readOnly}
                    placeholder="255"
                  />
                </div>
              </>
            )}

            {(fieldType === 'number' ||
              fieldType === 'decimal' ||
              fieldType === 'currency' ||
              fieldType === 'percent') && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">最小值</label>
                  <Input
                    type="number"
                    value={min ?? ''}
                    onChange={(e) =>
                      setMin(e.target.value ? Number(e.target.value) : undefined)
                    }
                    disabled={readOnly}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">最大值</label>
                  <Input
                    type="number"
                    value={max ?? ''}
                    onChange={(e) =>
                      setMax(e.target.value ? Number(e.target.value) : undefined)
                    }
                    disabled={readOnly}
                  />
                </div>
                {(fieldType === 'decimal' || fieldType === 'currency') && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">小数位数</label>
                    <Input
                      type="number"
                      min={0}
                      max={10}
                      value={precision ?? ''}
                      onChange={(e) =>
                        setPrecision(
                          e.target.value
                            ? Number(e.target.value)
                            : undefined
                        )
                      }
                      disabled={readOnly}
                      placeholder="2"
                    />
                  </div>
                )}
              </>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">只读</label>
              <Switch
                checked={readOnlyValidation}
                onCheckedChange={setReadOnlyValidation}
                disabled={readOnly}
              />
            </div>
          </div>

          {/* 正则验证 */}
          {(fieldType === 'text' ||
            fieldType === 'textarea' ||
            fieldType === 'phone' ||
            fieldType === 'email' ||
            fieldType === 'url') && (
            <div className="space-y-2">
              <label className="text-sm font-medium">正则表达式</label>
              <Input
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="^[a-zA-Z]+$"
                disabled={readOnly}
              />
              {pattern && (
                <Input
                  value={patternMessage}
                  onChange={(e) => setPatternMessage(e.target.value)}
                  placeholder="格式错误提示信息"
                  disabled={readOnly}
                />
              )}
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* 实时预览 */}
      <Collapsible open={true}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between font-semibold">
            <span className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              实时预览
            </span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2">
          <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
            <div className="text-sm font-medium">
              {fieldLabel || '未设置标签'}
            </div>
            <div className="w-full max-w-sm">
              <FieldRenderer
                property={previewProperty}
                value={previewValue}
                onChange={() => {}}
                disabled
              />
            </div>
            {fieldDescription && (
              <p className="text-xs text-muted-foreground">{fieldDescription}</p>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* 操作按钮 */}
      {!readOnly && (
        <div className="flex items-center justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onCancel}>
            取消
          </Button>
          <Button
            onClick={handleSave}
            disabled={!fieldName || !fieldLabel}
          >
            <Check className="h-4 w-4 mr-1" />
            保存字段
          </Button>
        </div>
      )}
    </div>
  )
}

export default FieldBuilder
