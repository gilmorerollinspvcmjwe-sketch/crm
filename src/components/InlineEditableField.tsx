/**
 * InlineEditableField - Inline editing component for detail pages
 *
 * Features:
 * - Hover to show edit icon
 * - Click to switch to input/select mode
 * - Enter to save, Escape to cancel
 * - Loading state during save
 * - Success/error feedback
 * - Debounced save option
 * - Support for multiple field types: text, email, phone, select, number
 */

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Edit2, CheckCircle2, X, Loader2 } from 'lucide-react'

// ============================================================
// Types
// ============================================================

export interface InlineEditableFieldProps {
  /** Current field value */
  value: string | number | null | undefined
  /** Save callback - called when user confirms edit */
  onSave: (value: string) => void | Promise<void>
  /** Field type */
  type?: 'text' | 'email' | 'phone' | 'select' | 'number'
  /** Options for select type */
  options?: Array<{ label: string; value: string }>
  /** Placeholder text when value is empty */
  placeholder?: string
  /** Whether the field is disabled */
  disabled?: boolean
  /** Custom class name */
  className?: string
  /** Custom class for the display wrapper */
  displayClassName?: string
  /** Format function for display value */
  format?: (value: string | number | null | undefined) => React.ReactNode
  /** Debounce delay in ms (0 = no debounce) */
  debounceMs?: number
  /** Show success indicator after save */
  showSuccess?: boolean
  /** Success indicator duration in ms */
  successDuration?: number
  /** Custom empty text */
  emptyText?: string
  /** Minimum value for number type */
  min?: number
  /** Maximum value for number type */
  max?: number
  /** Width of the input when editing */
  inputWidth?: string | number
}

// ============================================================
// Component
// ============================================================

export function InlineEditableField({
  value,
  onSave,
  type = 'text',
  options,
  placeholder = '点击编辑',
  disabled = false,
  className,
  displayClassName,
  format,
  debounceMs = 0,
  showSuccess = true,
  successDuration = 1500,
  emptyText = '-',
  min,
  max,
  inputWidth,
}: InlineEditableFieldProps) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [editValue, setEditValue] = React.useState(String(value ?? ''))
  const [isSaving, setIsSaving] = React.useState(false)
  const [showSuccessState, setShowSuccessState] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const debounceTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  // Focus input when editing starts
  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  // Sync edit value when external value changes
  React.useEffect(() => {
    if (!isEditing) {
      setEditValue(String(value ?? ''))
    }
  }, [value, isEditing])

  // Clear debounce timer on unmount
  React.useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  // Start editing
  const handleStartEdit = () => {
    if (disabled) return
    setEditValue(String(value ?? ''))
    setError(null)
    setIsEditing(true)
  }

  // Validate value
  const validateValue = (val: string): boolean => {
    if (type === 'email' && val) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(val)) {
        setError('请输入有效的邮箱地址')
        return false
      }
    }
    if (type === 'phone' && val) {
      const phoneRegex = /^[\d\-+\s()]+$/
      if (!phoneRegex.test(val)) {
        setError('请输入有效的电话号码')
        return false
      }
    }
    if (type === 'number') {
      const num = Number(val)
      if (isNaN(num)) {
        setError('请输入有效的数字')
        return false
      }
      if (min !== undefined && num < min) {
        setError(`最小值为 ${min}`)
        return false
      }
      if (max !== undefined && num > max) {
        setError(`最大值为 ${max}`)
        return false
      }
    }
    setError(null)
    return true
  }

  // Save handler
  const handleSave = async () => {
    if (!validateValue(editValue)) return

    // Debounced save
    if (debounceMs > 0) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
      debounceTimerRef.current = setTimeout(() => {
        executeSave()
      }, debounceMs)
      return
    }

    await executeSave()
  }

  // Execute the actual save
  const executeSave = async () => {
    setIsSaving(true)
    setError(null)
    try {
      await onSave(editValue)
      setIsEditing(false)
      if (showSuccess) {
        setShowSuccessState(true)
        setTimeout(() => setShowSuccessState(false), successDuration)
      }
    } catch (err) {
      console.error('Inline edit save failed:', err)
      setError(err instanceof Error ? err.message : '保存失败')
    } finally {
      setIsSaving(false)
    }
  }

  // Cancel edit
  const handleCancel = () => {
    setEditValue(String(value ?? ''))
    setError(null)
    setIsEditing(false)
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
  }

  // Key handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleCancel()
    }
  }

  // Select change handler - immediate save for select
  const handleSelectChange = async (val: string) => {
    setEditValue(val)
    setIsSaving(true)
    setError(null)
    try {
      await onSave(val)
      setIsEditing(false)
      if (showSuccess) {
        setShowSuccessState(true)
        setTimeout(() => setShowSuccessState(false), successDuration)
      }
    } catch (err) {
      console.error('Inline edit save failed:', err)
      setError(err instanceof Error ? err.message : '保存失败')
    } finally {
      setIsSaving(false)
    }
  }

  // Display value
  const displayValue = format ? format(value) : (value ? String(value) : emptyText)

  // Input width style
  const inputWidthStyle = inputWidth
    ? typeof inputWidth === 'number'
      ? `${inputWidth}px`
      : inputWidth
    : '100%'

  // ============================================================
  // Render
  // ============================================================

  // Editing mode with select
  if (isEditing && type === 'select' && options) {
    return (
      <div className={cn('flex items-center gap-1 animate-in fade-in duration-200', className)}>
        <Select
          value={editValue}
          onValueChange={handleSelectChange}
          disabled={isSaving}
        >
          <SelectTrigger
            className="h-7"
            style={{ width: inputWidthStyle }}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-1"
          onClick={handleCancel}
          disabled={isSaving}
        >
          <X className="h-3 w-3" />
        </Button>
        {error && (
          <span className="text-xs text-destructive ml-1">{error}</span>
        )}
      </div>
    )
  }

  // Editing mode with input
  if (isEditing) {
    return (
      <div className={cn('flex items-center gap-1 animate-in fade-in duration-200', className)}>
        <Input
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          type={type === 'email' ? 'email' : type === 'phone' ? 'tel' : type === 'number' ? 'number' : 'text'}
          placeholder={placeholder}
          className={cn('h-7', error && 'border-destructive')}
          style={{ width: inputWidthStyle }}
          disabled={isSaving}
          min={min}
          max={max}
        />
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-1"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving
            ? <Loader2 className="h-3 w-3 animate-spin" />
            : <CheckCircle2 className="h-3 w-3 text-green-500" />}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-1"
          onClick={handleCancel}
          disabled={isSaving}
        >
          <X className="h-3 w-3" />
        </Button>
        {error && (
          <span className="text-xs text-destructive ml-1 truncate">{error}</span>
        )}
      </div>
    )
  }

  // Display mode
  return (
    <div
      className={cn(
        'group flex items-center gap-1 cursor-pointer hover:bg-muted/30 rounded px-1 py-0.5 transition-colors',
        disabled && 'cursor-default hover:bg-transparent opacity-60',
        showSuccessState && 'bg-green-50',
        displayClassName
      )}
      onClick={handleStartEdit}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleStartEdit()
        }
      }}
    >
      <span className={cn(
        'flex-1 truncate',
        !value && 'text-muted-foreground italic',
        showSuccessState && 'text-green-600'
      )}>
        {showSuccessState ? (
          <span className="flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            {displayValue}
          </span>
        ) : (
          displayValue || <span className="text-muted-foreground italic">{placeholder}</span>
        )}
      </span>
      {!disabled && !showSuccessState && (
        <Edit2
          className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
        />
      )}
    </div>
  )
}

// ============================================================
// Specialized Variants
// ============================================================

/** Inline editable text field */
export function InlineTextField(
  props: Omit<InlineEditableFieldProps, 'type'>
) {
  return <InlineEditableField {...props} type="text" />
}

/** Inline editable email field with validation */
export function InlineEmailField(
  props: Omit<InlineEditableFieldProps, 'type'>
) {
  return <InlineEditableField {...props} type="email" placeholder="请输入邮箱" />
}

/** Inline editable phone field with validation */
export function InlinePhoneField(
  props: Omit<InlineEditableFieldProps, 'type'>
) {
  return <InlineEditableField {...props} type="phone" placeholder="请输入电话" />
}

/** Inline editable select field */
export function InlineSelectField(
  props: Omit<InlineEditableFieldProps, 'type'> & {
    options: Array<{ label: string; value: string }>
  }
) {
  return <InlineEditableField {...props} type="select" />
}

/** Inline editable number field */
export function InlineNumberField(
  props: Omit<InlineEditableFieldProps, 'type'>
) {
  return (
    <InlineEditableField
      {...props}
      type="number"
      placeholder="请输入数字"
    />
  )
}

export default InlineEditableField