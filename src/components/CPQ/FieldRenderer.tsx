/**
 * FieldRenderer - 动态字段渲染器
 * 根据字段类型渲染对应的表单组件
 */
import * as React from 'react'
import { useState, useCallback, useMemo, useRef } from 'react'
import { Search, Upload, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { PropertyType, ObjectProperty, PropertyOption } from '@/types/customObject'

export interface FieldRendererProps {
  /** 字段属性定义 */
  property: ObjectProperty
  /** 当前值 */
  value: unknown
  /** 值变更回调 */
  onChange: (value: unknown) => void
  /** 是否禁用 */
  disabled?: boolean
  /** 只读模式 */
  readOnly?: boolean
  /** 自定义样式类名 */
  className?: string
  /** 占位符（覆盖 property.placeholder） */
  placeholder?: string
}

/** 格式化日期显示 */
const formatDateDisplay = (value: string, internalType: PropertyType): string => {
  if (!value) return ''
  try {
    const date = new Date(value)
    if (internalType === 'date') {
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    }
    if (internalType === 'datetime') {
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    }
    if (internalType === 'time') {
      return date.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
      })
    }
    return value
  } catch {
    return value
  }
}

/** Text 类型渲染器 */
const TextRenderer: React.FC<{
  property: ObjectProperty
  value: unknown
  onChange: (v: unknown) => void
  disabled?: boolean
  readOnly?: boolean
  className?: string
}> = ({ property, value, onChange, disabled, readOnly, className }) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  // 自动聚焦第一个错误字段
  React.useEffect(() => {
    if (!readOnly && property.validation?.pattern && typeof value === 'string' && value) {
      try {
        const regex = new RegExp(property.validation.pattern)
        if (!regex.test(value) && inputRef.current) {
          inputRef.current.focus()
        }
      } catch {
        // 无效的正则表达式
      }
    }
  }, [readOnly, property.validation?.pattern, value])

  return (
    <Input
      ref={inputRef}
      value={(value as string) ?? ''}
      onChange={handleChange}
      placeholder={property.placeholder}
      disabled={disabled || readOnly || property.validation?.readOnly}
      maxLength={property.validation?.maxLength}
      minLength={property.validation?.minLength}
      className={cn(
        property.validation?.pattern && typeof value === 'string' && value
          ? (() => {
              try {
                return new RegExp(property.validation.pattern).test(value) ? '' : 'border-destructive focus:border-destructive'
              } catch {
                return ''
              }
            })()
          : '',
        className
      )}
    />
  )
}

/** Textarea 类型渲染器 */
const TextareaRenderer: React.FC<{
  property: ObjectProperty
  value: unknown
  onChange: (v: unknown) => void
  disabled?: boolean
  readOnly?: boolean
  className?: string
}> = ({ property, value, onChange, disabled, readOnly, className }) => (
  <Textarea
    value={(value as string) ?? ''}
    onChange={(e) => onChange(e.target.value)}
    placeholder={property.placeholder}
    disabled={disabled || readOnly || property.validation?.readOnly}
    maxLength={property.validation?.maxLength}
    className={cn('min-h-[80px]', className)}
  />
)

/** Number 类型渲染器 */
const NumberRenderer: React.FC<{
  property: ObjectProperty
  value: unknown
  onChange: (v: unknown) => void
  disabled?: boolean
  readOnly?: boolean
  className?: string
}> = ({ property, value, onChange, disabled, readOnly, className }) => (
  <Input
    type="number"
    value={value as number | undefined}
    onChange={(e) => {
      const v = e.target.value
      onChange(v === '' ? undefined : Number(v))
    }}
    placeholder={property.placeholder}
    disabled={disabled || readOnly || property.validation?.readOnly}
    min={property.validation?.min}
    max={property.validation?.max}
    step={property.internalType === 'decimal' || property.internalType === 'currency' || property.internalType === 'percent'
      ? (property.validation?.precision ? Math.pow(10, -property.validation.precision) : 0.01)
      : 1}
    className={className}
  />
)

/** Date 系列类型渲染器 */
const DateRenderer: React.FC<{
  property: ObjectProperty
  value: unknown
  onChange: (v: unknown) => void
  disabled?: boolean
  readOnly?: boolean
  className?: string
}> = ({ property, value, onChange, disabled, readOnly, className }) => {
  const [open, setOpen] = useState(false)
  const dateValue = useMemo(() => {
    if (!value) return undefined
    try {
      return new Date(value as string)
    } catch {
      return undefined
    }
  }, [value])

  const handleSelect = (date: Date | undefined) => {
    if (!date) {
      onChange(undefined)
      return
    }
    if (property.internalType === 'date') {
      onChange(date.toISOString().split('T')[0])
    } else if (property.internalType === 'datetime') {
      onChange(date.toISOString())
    } else if (property.internalType === 'time') {
      onChange(date.toTimeString().slice(0, 5))
    } else {
      onChange(date.toISOString())
    }
    setOpen(false)
  }

  const displayValue = useMemo(
    () => formatDateDisplay(value as string, (property.internalType as PropertyType) ?? 'date'),
    [value, property.internalType]
  )

  if (readOnly || property.validation?.readOnly) {
    return (
      <div className={cn('text-sm py-2', className)}>
        {displayValue || '-'}
      </div>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              'w-full justify-start text-left font-normal',
              !value && 'text-muted-foreground',
              className
            )}
            disabled={disabled}
          >
            {displayValue || property.placeholder || '选择日期'}
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={dateValue}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

/** Boolean 系列类型渲染器 */
const BooleanRenderer: React.FC<{
  property: ObjectProperty
  value: unknown
  onChange: (v: unknown) => void
  disabled?: boolean
  readOnly?: boolean
  className?: string
}> = ({ property, value, onChange, disabled, readOnly, className }) => {
  if (property.internalType === 'switch') {
    return (
      <Switch
        checked={!!value}
        onCheckedChange={onChange}
        disabled={disabled || readOnly || property.validation?.readOnly}
        className={className}
      />
    )
  }

  if (property.internalType === 'checkbox') {
    return (
      <Checkbox
        checked={!!value}
        onCheckedChange={(v) => onChange(!!v)}
        disabled={disabled || readOnly || property.validation?.readOnly}
        className={className}
      />
    )
  }

  return (
    <div className="flex items-center gap-4">
      <Checkbox
        checked={!!value}
        onCheckedChange={(v) => onChange(!!v)}
        disabled={disabled || readOnly || property.validation?.readOnly}
      />
      <span className="text-sm">
        {value ? '是' : '否'}
      </span>
    </div>
  )
}

/** Select 类型渲染器 */
const SelectRenderer: React.FC<{
  property: ObjectProperty
  value: unknown
  onChange: (v: unknown) => void
  disabled?: boolean
  readOnly?: boolean
  className?: string
}> = ({ property, value, onChange, disabled, readOnly, className }) => {
  const selectedOption = property.options?.find((opt) => opt.value === value)

  if (readOnly || property.validation?.readOnly) {
    return (
      <div className={cn('flex flex-wrap gap-1', className)}>
        {selectedOption ? (
          <Badge
            style={
              selectedOption.color
                ? { backgroundColor: selectedOption.color + '20', color: selectedOption.color, borderColor: selectedOption.color }
                : undefined
            }
          >
            {selectedOption.label}
          </Badge>
        ) : (
          <span className="text-sm text-muted-foreground">-</span>
        )}
      </div>
    )
  }

  return (
    <Select
      value={value as string}
      onValueChange={onChange}
      disabled={disabled || readOnly}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={property.placeholder || '请选择'} />
      </SelectTrigger>
      <SelectContent>
        {property.options?.map((opt) => (
          <SelectItem key={opt.value} value={opt.value} disabled={!opt.enabled}>
            <span className="flex items-center gap-2">
              {opt.color && (
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: opt.color }}
                />
              )}
              {opt.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

/** MultiSelect 类型渲染器 */
const MultiSelectRenderer: React.FC<{
  property: ObjectProperty
  value: unknown
  onChange: (v: unknown) => void
  disabled?: boolean
  readOnly?: boolean
  className?: string
}> = ({ property, value, onChange, disabled, readOnly, className }) => {
  const [open, setOpen] = useState(false)
  const selectedValues = (value as string[]) ?? []
  const selectedOptions = property.options?.filter((opt) =>
    selectedValues.includes(opt.value)
  ) ?? []

  const toggleOption = (optValue: string) => {
    if (selectedValues.includes(optValue)) {
      onChange(selectedValues.filter((v) => v !== optValue))
    } else {
      onChange([...selectedValues, optValue])
    }
  }

  const removeOption = (optValue: string) => {
    onChange(selectedValues.filter((v) => v !== optValue))
  }

  if (readOnly || property.validation?.readOnly) {
    return (
      <div className={cn('flex flex-wrap gap-1', className)}>
        {selectedOptions.length > 0 ? (
          selectedOptions.map((opt) => (
            <Badge
              key={opt.value}
              variant="secondary"
              style={
                opt.color
                  ? { backgroundColor: opt.color + '20', color: opt.color, borderColor: opt.color }
                  : undefined
              }
            >
              {opt.label}
            </Badge>
          ))
        ) : (
          <span className="text-sm text-muted-foreground">-</span>
        )}
      </div>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              'w-full justify-start min-h-[38px] h-auto flex-wrap gap-1',
              !selectedValues.length && 'text-muted-foreground',
              className
            )}
            disabled={disabled}
          >
          {selectedOptions.length > 0 ? (
            selectedOptions.map((opt) => (
              <Badge
                key={opt.value}
                variant="secondary"
                className="gap-1"
                style={
                  opt.color
                    ? { backgroundColor: opt.color + '20', color: opt.color, borderColor: opt.color }
                    : undefined
                }
              >
                {opt.label}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeOption(opt.value)
                  }}
                />
              </Badge>
            ))
          ) : (
            <span>{property.placeholder || '请选择多个选项'}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <ScrollArea className="max-h-[250px]">
          <div className="p-1">
            {property.options?.map((opt) => (
              <div
                key={opt.value}
                className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 cursor-pointer"
                onClick={() => !opt.enabled ? undefined : toggleOption(opt.value)}
              >
                <Checkbox
                  checked={selectedValues.includes(opt.value)}
                  disabled={!opt.enabled}
                />
                {opt.color && (
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: opt.color }}
                  />
                )}
                <span className={cn('flex-1', !opt.enabled && 'text-muted-foreground')}>
                  {opt.label}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}

/** Radio 类型渲染器 */
const RadioRenderer: React.FC<{
  property: ObjectProperty
  value: unknown
  onChange: (v: unknown) => void
  disabled?: boolean
  readOnly?: boolean
  className?: string
}> = ({ property, value, onChange, disabled, readOnly, className }) => (
  <div className={cn('flex flex-wrap gap-3', className)}>
    {property.options?.map((opt) => (
      <label
        key={opt.value}
        className={cn(
          'flex items-center gap-2 cursor-pointer',
          !opt.enabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <Checkbox
          type="radio"
          checked={value === opt.value}
          disabled={disabled || readOnly || !opt.enabled || property.validation?.readOnly}
          onCheckedChange={() => onChange(opt.value)}
        />
        {opt.color && (
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: opt.color }}
          />
        )}
        <span className="text-sm">{opt.label}</span>
      </label>
    ))}
  </div>
)

/** Lookup 类型渲染器（带搜索） */
const LookupRenderer: React.FC<{
  property: ObjectProperty
  value: unknown
  onChange: (v: unknown) => void
  disabled?: boolean
  readOnly?: boolean
  className?: string
  /** 搜索回调，用于异步加载候选项 */
  onSearch?: (query: string) => Promise<Array<{ id: string; label: string }>>
  /** 预设的候选项列表 */
  suggestions?: Array<{ id: string; label: string }>
}> = ({ property, value, onChange, disabled, readOnly, className, onSearch, suggestions = [] }) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Array<{ id: string; label: string }>>(suggestions)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setResults(suggestions)
        return
      }
      if (onSearch) {
        setLoading(true)
        try {
          const data = await onSearch(query)
          setResults(data)
        } finally {
          setLoading(false)
        }
      }
    },
    [onSearch, suggestions]
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearch(query)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => handleSearch(query), 300)
  }

  const handleSelect = (id: string, label: string) => {
    if (property.multiple) {
      const currentValues = (value as string[]) ?? []
      if (currentValues.includes(id)) {
        onChange(currentValues.filter((v) => v !== id))
      } else {
        onChange([...currentValues, id])
      }
    } else {
      onChange(id)
      setOpen(false)
    }
    setSearch('')
  }

  const selectedIds = property.multiple ? (value as string[]) ?? [] : value ? [value as string] : []
  const selectedItems = results.filter((r) => selectedIds.includes(r.id))

  if (readOnly || property.validation?.readOnly) {
    return (
      <div className={cn('flex flex-wrap gap-1', className)}>
        {selectedItems.length > 0 ? (
          selectedItems.map((item) => (
            <Badge key={item.id} variant="secondary">
              {item.label}
            </Badge>
          ))
        ) : (
          <span className="text-sm text-muted-foreground">-</span>
        )}
      </div>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              'w-full justify-start min-h-[38px] h-auto flex-wrap gap-1',
              !selectedItems.length && 'text-muted-foreground',
              className
            )}
            disabled={disabled}
          >
          {selectedItems.length > 0 ? (
            selectedItems.map((item) => (
              <Badge key={item.id} variant="secondary" className="gap-1">
                {item.label}
                {!property.multiple && (
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSelect(item.id, item.label)
                    }}
                  />
                )}
              </Badge>
            ))
          ) : (
            <span>{property.placeholder || '搜索并选择'}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0" align="start">
        <div className="p-2 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={handleSearchChange}
              placeholder="搜索..."
              className="pl-8"
              autoFocus
            />
          </div>
        </div>
        <ScrollArea className="max-h-[250px]">
          <div className="p-1">
            {loading ? (
              <div className="text-center py-4 text-sm text-muted-foreground">
                搜索中...
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-4 text-sm text-muted-foreground">
                暂无结果
              </div>
            ) : (
              results.map((result) => (
                <div
                  key={result.id}
                  className={cn(
                    'flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 cursor-pointer',
                    selectedIds.includes(result.id) && 'bg-muted/50'
                  )}
                  onClick={() => handleSelect(result.id, result.label)}
                >
                  <Checkbox checked={selectedIds.includes(result.id)} />
                  <span className="flex-1">{result.label}</span>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}

/** File 类型渲染器 */
const FileRenderer: React.FC<{
  property: ObjectProperty
  value: unknown
  onChange: (v: unknown) => void
  disabled?: boolean
  readOnly?: boolean
  className?: string
}> = ({ property, value, onChange, disabled, readOnly, className }) => {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return

    setUploading(true)
    // 模拟上传，实际项目中替换为真实上传逻辑
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (property.internalType === 'image') {
      const urls = Array.from(files).map((f) => URL.createObjectURL(f))
      onChange(property.multiple ? urls : urls[0])
    } else {
      const fileInfos = Array.from(files).map((f) => ({
        name: f.name,
        size: f.size,
        type: f.type,
        url: URL.createObjectURL(f),
      }))
      onChange(property.multiple ? fileInfos : fileInfos[0])
    }
    setUploading(false)
  }

  const fileInfo = value as { name: string; url: string; size?: number } | { name: string; url: string; size?: number }[] | string | string[] | undefined
  const files = Array.isArray(fileInfo) ? fileInfo : fileInfo ? [fileInfo] : []
  const fileUrls = files.map((f) => (typeof f === 'string' ? f : f.url))

  if (readOnly || property.validation?.readOnly) {
    return (
      <div className={cn('flex flex-wrap gap-2', className)}>
        {fileUrls.length > 0 ? (
          fileUrls.map((url, i) => (
            <div key={i} className="text-sm text-primary underline cursor-pointer">
              {typeof fileInfo === 'string' ? `文件 ${i + 1}` : (fileInfo as { name?: string })?.name || `文件 ${i + 1}`}
            </div>
          ))
        ) : (
          <span className="text-sm text-muted-foreground">-</span>
        )}
      </div>
    )
  }

  return (
    <div className={cn('space-y-2', className)}>
      <input
        ref={inputRef}
        type="file"
        accept={
          property.internalType === 'image'
            ? 'image/*'
            : property.validation?.allowedTypes?.join(',') || '*'
        }
        multiple={property.multiple}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || uploading}
      />
      <Button
        variant="outline"
        onClick={() => inputRef.current?.click()}
        disabled={disabled || uploading}
        className="w-full"
      >
        <Upload className="h-4 w-4 mr-2" />
        {uploading ? '上传中...' : property.multiple ? '上传文件' : '选择文件'}
      </Button>
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((file, i) => (
            <div
              key={i}
              className="flex items-center gap-2 p-2 rounded-md border bg-muted/30 text-sm"
            >
              {property.internalType === 'image' && typeof file === 'string' ? (
                <img
                  src={file}
                  alt={`preview-${i}`}
                  className="h-10 w-10 object-cover rounded"
                />
              ) : (
                <Upload className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="flex-1 truncate">
                {typeof file === 'string' ? `图片 ${i + 1}` : (file as { name?: string }).name}
              </span>
              <X
                className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-destructive"
                onClick={() => {
                  const newFiles = files.filter((_, idx) => idx !== i)
                  onChange(property.multiple ? newFiles : undefined)
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/** Rating 类型渲染器 */
const RatingRenderer: React.FC<{
  property: ObjectProperty
  value: unknown
  onChange: (v: unknown) => void
  disabled?: boolean
  readOnly?: boolean
  className?: string
}> = ({ property, value, onChange, disabled, readOnly, className }) => {
  const maxRating = property.validation?.max || 5
  const currentValue = (value as number) || 0

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {Array.from({ length: maxRating }, (_, i) => i + 1).map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readOnly && onChange(star)}
          disabled={disabled || readOnly}
          className={cn(
            'text-2xl transition-colors',
            star <= currentValue
              ? 'text-yellow-400'
              : 'text-muted-foreground/30',
            !readOnly && 'hover:text-yellow-400 cursor-pointer',
            readOnly && 'cursor-default'
          )}
        >
          ★
        </button>
      ))}
      <span className="ml-2 text-sm text-muted-foreground">{currentValue}/{maxRating}</span>
    </div>
  )
}

/** 主导出组件 */
export const FieldRenderer: React.FC<FieldRendererProps> = ({
  property,
  value,
  onChange,
  disabled = false,
  readOnly = false,
  className,
  placeholder,
}) => {
  const resolvedPlaceholder = placeholder || property.placeholder

  const renderField = () => {
    switch (property.internalType) {
      case 'text':
      case 'phone':
      case 'email':
      case 'url':
        return (
          <TextRenderer
            property={property}
            value={value}
            onChange={onChange}
            disabled={disabled}
            readOnly={readOnly}
            className={className}
          />
        )
      case 'textarea':
      case 'richtext':
        return (
          <TextareaRenderer
            property={property}
            value={value}
            onChange={onChange}
            disabled={disabled}
            readOnly={readOnly}
            className={className}
          />
        )
      case 'number':
      case 'decimal':
      case 'currency':
      case 'percent':
        return (
          <NumberRenderer
            property={property}
            value={value}
            onChange={onChange}
            disabled={disabled}
            readOnly={readOnly}
            className={className}
          />
        )
      case 'date':
      case 'datetime':
      case 'time':
        return (
          <DateRenderer
            property={property}
            value={value}
            onChange={onChange}
            disabled={disabled}
            readOnly={readOnly}
            className={className}
          />
        )
      case 'switch':
      case 'checkbox':
        return (
          <BooleanRenderer
            property={property}
            value={value}
            onChange={onChange}
            disabled={disabled}
            readOnly={readOnly}
            className={className}
          />
        )
      case 'select':
        return (
          <SelectRenderer
            property={property}
            value={value}
            onChange={onChange}
            disabled={disabled}
            readOnly={readOnly}
            className={className}
          />
        )
      case 'multiselect':
        return (
          <MultiSelectRenderer
            property={property}
            value={value}
            onChange={onChange}
            disabled={disabled}
            readOnly={readOnly}
            className={className}
          />
        )
      case 'radio':
        return (
          <RadioRenderer
            property={property}
            value={value}
            onChange={onChange}
            disabled={disabled}
            readOnly={readOnly}
            className={className}
          />
        )
      case 'user':
      case 'department':
      case 'relation':
        return (
          <LookupRenderer
            property={property}
            value={value}
            onChange={onChange}
            disabled={disabled}
            readOnly={readOnly}
            className={className}
          />
        )
      case 'file':
      case 'image':
      case 'video':
        return (
          <FileRenderer
            property={property}
            value={value}
            onChange={onChange}
            disabled={disabled}
            readOnly={readOnly}
            className={className}
          />
        )
      case 'rating':
        return (
          <RatingRenderer
            property={property}
            value={value}
            onChange={onChange}
            disabled={disabled}
            readOnly={readOnly}
            className={className}
          />
        )
      case 'formula':
      case 'rollup':
        return (
          <div className={cn('text-sm py-2 font-mono text-muted-foreground', className)}>
            {typeof value === 'number' ? value.toLocaleString() : (value as string) ?? '-'}
          </div>
        )
      case 'address':
        return (
          <TextareaRenderer
            property={property}
            value={value}
            onChange={onChange}
            disabled={disabled}
            readOnly={readOnly}
            className={className}
          />
        )
      default:
        return (
          <Input
            value={(value as string) ?? ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={resolvedPlaceholder}
            disabled={disabled || readOnly}
            className={className}
          />
        )
    }
  }

  return renderField()
}

export default FieldRenderer
