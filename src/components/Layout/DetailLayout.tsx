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
    <div className={cn('flex flex-col h-full bg-background', className)}>
      {/* Header Section */}
      {header && (
        <div className="flex items-center px-6 py-4 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0 z-10 shadow-sm">
          {header}
        </div>
      )}

      {/* Main Content - Three Column Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Fixed 280px */}
        {leftSidebar && (
          <aside
            className={cn(
              'w-[280px] flex-shrink-0 border-r bg-muted/20 overflow-y-auto',
              'hidden md:block', // Hide on mobile
              leftSidebarClassName
            )}
          >
            <div className="p-5 space-y-5">
              {leftSidebar}
            </div>
          </aside>
        )}

        {/* Middle Content - Flex Grow */}
        <main
          className={cn(
            'flex-1 overflow-y-auto bg-background',
            'min-w-0', // Prevent flex item overflow
            contentClassName
          )}
        >
          {children}
        </main>

        {/* Right Sidebar - Fixed 360px */}
        {rightSidebar && (
          <aside
            className={cn(
              'w-[360px] flex-shrink-0 border-l bg-muted/20 overflow-y-auto',
              'hidden lg:block', // Hide on tablet and mobile
              rightSidebarClassName
            )}
          >
            <div className="p-5 space-y-5">
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
    <div className={cn('flex items-center justify-between w-full', className)}>
      <div className="flex items-center gap-2">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
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
        {breadcrumb && <span className="text-muted-foreground">/</span>}
        {breadcrumb}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

export default DetailLayout