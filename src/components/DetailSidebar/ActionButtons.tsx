/**
 * ActionButtons - Quick Action Button Group Component
 * 
 * Provides configurable action buttons for:
 * - Edit, Assign, Delete
 * - Create related records (Deal, Contact, Follow-up)
 * - Export, Return to Pool
 */

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Edit,
  UserCog,
  Trash2,
  Plus,
  Lightbulb,
  Users,
  Clock,
  ArrowUpRight,
  Download,
  MoreHorizontal,
} from 'lucide-react'

/** Action button configuration */
export interface ActionButtonConfig {
  /** Unique key for the button */
  key: string
  /** Icon component */
  icon?: React.ReactNode
  /** Label (i18n key or direct text) */
  label: string
  /** Click handler */
  onClick?: () => void
  /** Button variant */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  /** Whether this is a danger action */
  danger?: boolean
  /** Whether this action is disabled */
  disabled?: boolean
  /** Loading state */
  loading?: boolean
  /** Custom class name */
  className?: string
}

export interface ActionButtonsProps {
  /** Button configurations */
  buttons?: ActionButtonConfig[]
  /** Show separator between groups */
  showSeparator?: boolean
  /** Button size */
  size?: 'default' | 'sm' | 'lg' | 'icon'
  /** Layout variant */
  layout?: 'vertical' | 'horizontal' | 'grid'
  /** Custom class name */
  className?: string
  /** Max visible buttons before overflow */
  maxVisible?: number
}

/** Default action icon mapping */
const defaultIconMap: Record<string, React.ReactNode> = {
  edit: <Edit className="w-4 h-4" />,
  assign: <UserCog className="w-4 h-4" />,
  delete: <Trash2 className="w-4 h-4" />,
  newDeal: <Lightbulb className="w-4 h-4" />,
  newContact: <Users className="w-4 h-4" />,
  followUp: <Clock className="w-4 h-4" />,
  returnToPool: <ArrowUpRight className="w-4 h-4" />,
  export: <Download className="w-4 h-4" />,
  more: <MoreHorizontal className="w-4 h-4" />,
  add: <Plus className="w-4 h-4" />,
}

/**
 * ActionButtons Component
 * 
 * Renders a configurable list of action buttons with:
 * - Icon + label format
 * - Danger styling for destructive actions
 * - Separator support for grouping
 */
export function ActionButtons({
  buttons,
  showSeparator = true,
  size = 'sm',
  layout = 'vertical',
  className,
  maxVisible,
}: ActionButtonsProps) {
  const { t } = useTranslation()

  if (!buttons || buttons.length === 0) return null

  // Separate primary and overflow buttons if maxVisible is set
  const visibleButtons = maxVisible 
    ? buttons.slice(0, maxVisible) 
    : buttons
  const overflowButtons = maxVisible 
    ? buttons.slice(maxVisible) 
    : []

  return (
    <div
      className={cn(
        'space-y-1',
        layout === 'horizontal' && 'flex items-center gap-2 flex-wrap',
        layout === 'grid' && 'grid grid-cols-2 gap-2',
        className
      )}
    >
      {visibleButtons.map((button, index) => {
        // Handle separator markers
        if (button.key === 'separator') {
          if (!showSeparator) return null
          return (
            <Separator
              key={`separator-${index}`}
              className={cn(
                'my-2',
                layout === 'horizontal' && 'h-6 w-px mx-0 my-auto'
              )}
            />
          )
        }

        return (
          <Button
            key={button.key}
            variant={button.danger ? 'destructive' : button.variant || 'ghost'}
            size={size}
            onClick={button.onClick}
            disabled={button.disabled}
            className={cn(
              'w-full justify-start',
              layout === 'horizontal' && 'w-auto',
              layout === 'grid' && 'justify-center',
              button.danger && 'text-destructive hover:text-destructive',
              button.className
            )}
          >
            {button.icon || defaultIconMap[button.key]}
            <span className="ml-2">{t(button.label, button.label)}</span>
          </Button>
        )
      })}

      {/* Overflow menu */}
      {overflowButtons.length > 0 && (
        <Button
          variant="ghost"
          size={size}
          className="w-full justify-start"
        >
          <MoreHorizontal className="w-4 h-4" />
          <span className="ml-2">{t('common.more', 'More')}</span>
        </Button>
      )}
    </div>
  )
}

/**
 * Preset action button configurations for common use cases
 */
export const customerActionButtons: ActionButtonConfig[] = [
  { key: 'edit', label: 'customer.detail.actions.edit' },
  { key: 'assign', label: 'customer.detail.actions.assign' },
  { key: 'separator', label: '' },
  { key: 'newDeal', label: 'customer.detail.actions.newDeal' },
  { key: 'newContact', label: 'customer.detail.actions.newContact' },
  { key: 'followUp', label: 'customer.detail.actions.followUp' },
  { key: 'separator', label: '' },
  { key: 'returnToPool', label: 'customer.detail.actions.returnToPool' },
  { key: 'export', label: 'customer.detail.actions.export' },
  { key: 'delete', label: 'common.delete', danger: true },
]

export const contactActionButtons: ActionButtonConfig[] = [
  { key: 'edit', label: 'common.edit' },
  { key: 'delete', label: 'common.delete', danger: true },
]

export const opportunityActionButtons: ActionButtonConfig[] = [
  { key: 'edit', label: 'common.edit' },
  { key: 'newActivity', label: 'opportunity.detail.actions.newActivity' },
  { key: 'separator', label: '' },
  { key: 'closeWon', label: 'opportunity.detail.actions.closeWon' },
  { key: 'closeLost', label: 'opportunity.detail.actions.closeLost' },
  { key: 'delete', label: 'common.delete', danger: true },
]

export default ActionButtons