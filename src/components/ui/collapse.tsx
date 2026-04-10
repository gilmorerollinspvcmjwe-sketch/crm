/**
 * Collapse/Collapsible Component
 * 用于侧边栏菜单展开/折叠
 */
import * as React from 'react'
import { cn } from '@/lib/utils'

interface CollapsibleContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const CollapsibleContext = React.createContext<CollapsibleContextValue | undefined>(undefined)

function useCollapsible() {
  const context = React.useContext(CollapsibleContext)
  if (!context) {
    throw new Error('useCollapsible must be used within a Collapsible')
  }
  return context
}

interface CollapsibleProps {
  children: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}

const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(
  ({ children, open, defaultOpen = false, onOpenChange, className, ...props }, ref) => {
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
    const isControlled = open !== undefined
    const isOpen = isControlled ? open : internalOpen

    const handleOpenChange = React.useCallback((newOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(newOpen)
      }
      onOpenChange?.(newOpen)
    }, [isControlled, onOpenChange])

    return (
      <CollapsibleContext.Provider value={{ open: isOpen, onOpenChange: handleOpenChange }}>
        <div
          ref={ref}
          data-state={isOpen ? 'open' : 'closed'}
          className={cn('group/collapsible', className)}
          {...props}
        >
          {children}
        </div>
      </CollapsibleContext.Provider>
    )
  }
)
Collapsible.displayName = 'Collapsible'

interface CollapsibleTriggerProps {
  children: React.ReactNode
  asChild?: boolean
  className?: string
}

const CollapsibleTrigger = React.forwardRef<HTMLButtonElement, CollapsibleTriggerProps>(
  ({ children, asChild, className, ...props }, ref) => {
    const { open, onOpenChange } = useCollapsible()

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        onClick: () => onOpenChange(!open),
        'data-state': open ? 'open' : 'closed',
        className: cn((children as React.ReactElement<any>).props?.className, className),
      })
    }

    return (
      <button
        ref={ref}
        type="button"
        onClick={() => onOpenChange(!open)}
        data-state={open ? 'open' : 'closed'}
        className={className}
        {...props}
      >
        {children}
      </button>
    )
  }
)
CollapsibleTrigger.displayName = 'CollapsibleTrigger'

interface CollapsibleContentProps {
  children: React.ReactNode
  className?: string
}

const CollapsibleContent = React.forwardRef<HTMLDivElement, CollapsibleContentProps>(
  ({ children, className, ...props }, ref) => {
    const { open } = useCollapsible()

    if (!open) {
      return null
    }

    return (
      <div
        ref={ref}
        data-state={open ? 'open' : 'closed'}
        className={cn(
          'overflow-hidden',
          open && 'animate-collapsible-down',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
CollapsibleContent.displayName = 'CollapsibleContent'

export { Collapsible, CollapsibleTrigger, CollapsibleContent, useCollapsible }