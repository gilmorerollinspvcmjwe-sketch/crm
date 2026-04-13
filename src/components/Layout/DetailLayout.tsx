/**
 * DetailLayout - HubSpot Style Three-Column Layout
 * 
 * Layout Structure:
 * - Left Sidebar (280px): Customer info + Action buttons
 * - Middle Content (flex: 1): Tabs with Overview/Activity/AI Insights
 * - Right Sidebar (360px): Related information cards
 * 
 * Responsive:
 * - Desktop: Full three-column layout
 * - Tablet (< lg): Hide right sidebar
 * - Mobile (< md): Single column, left sidebar collapses
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

interface DetailLayoutProps {
  /** Left sidebar content (info card + actions) */
  leftSidebar?: React.ReactNode
  /** Main content area (tabs + content) */
  children?: React.ReactNode
  /** Right sidebar content (related cards) */
  rightSidebar?: React.ReactNode
  /** Header content (back button, breadcrumb) */
  header?: React.ReactNode
  /** Custom className for the root container */
  className?: string
  /** Custom className for left sidebar */
  leftSidebarClassName?: string
  /** Custom className for middle content */
  contentClassName?: string
  /** Custom className for right sidebar */
  rightSidebarClassName?: string
}

/**
 * DetailLayout Component
 * 
 * Provides a HubSpot-style three-column layout for detail pages.
 * Used for Customer, Contact, Opportunity, and other entity detail views.
 */
export function DetailLayout({
  leftSidebar,
  children,
  rightSidebar,
  header,
  className,
  leftSidebarClassName,
  contentClassName,
  rightSidebarClassName,
}: DetailLayoutProps) {
  return (
    <div className={cn('flex h-full flex-col rounded-[1.5rem] border border-border/70 bg-card shadow-[var(--shadow-sm)]', className)}>
      {header && (
        <div className="sticky top-0 z-10 border-b border-border/70 bg-[oklch(var(--shell-panel-elevated)/0.92)] px-5 py-4 backdrop-blur-xl md:px-6">
          {header}
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden xl:flex-row">
        {leftSidebar && (
          <aside
            className={cn(
              'border-b border-border/70 bg-muted/25 xl:w-[300px] xl:flex-shrink-0 xl:border-b-0 xl:border-r',
              leftSidebarClassName
            )}
          >
            <div className="space-y-4 p-4 md:p-5">
              {leftSidebar}
            </div>
          </aside>
        )}

        <main
          className={cn(
            'min-w-0 flex-1 overflow-y-auto bg-background',
            contentClassName
          )}
        >
          <div className="p-4 md:p-5 xl:p-6">
            {children}
          </div>
        </main>

        {rightSidebar && (
          <aside
            className={cn(
              'border-t border-border/70 bg-muted/25 xl:w-[340px] xl:flex-shrink-0 xl:border-l xl:border-t-0',
              rightSidebarClassName
            )}
          >
            <div className="space-y-4 p-4 md:p-5">
              {rightSidebar}
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}

/**
 * DetailLayoutHeader - Header component with back button and breadcrumb
 */
export function DetailLayoutHeader({
  onBack,
  backLabel,
  breadcrumb,
  actions,
  className,
}: {
  onBack?: () => void
  backLabel?: string
  breadcrumb?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex w-full flex-col gap-3 xl:flex-row xl:items-center xl:justify-between', className)}>
      <div className="min-w-0">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            {backLabel}
          </button>
        )}
        {breadcrumb && (
          <div className="mt-2 flex min-w-0 items-center gap-2">
            <span className="text-muted-foreground">/</span>
            <div className="min-w-0 truncate">{breadcrumb}</div>
          </div>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2 xl:justify-end">{actions}</div>}
    </div>
  )
}

export default DetailLayout
