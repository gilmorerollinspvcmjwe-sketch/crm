"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// ============ Skeleton Base ============

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular" | "rounded"
  width?: string | number
  height?: string | number
  animation?: "pulse" | "wave" | "none"
}

export function Skeleton({
  variant = "text",
  width,
  height,
  animation = "pulse",
  className,
  ...props
}: SkeletonProps) {
  const variantClasses = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-none",
    rounded: "rounded-lg",
  }

  const animationClasses = {
    pulse: "animate-pulse",
    wave: "animate-shimmer",
    none: "",
  }

  const defaultHeights = {
    text: "h-4",
    circular: "h-12",
    rectangular: "h-24",
    rounded: "h-16",
  }

  return (
    <div
      className={cn(
        "bg-muted/50",
        variantClasses[variant],
        animationClasses[animation],
        defaultHeights[variant],
        className
      )}
      style={{
        width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
        height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
      }}
      {...props}
    />
  )
}

// ============ Table Skeleton ============

interface TableSkeletonProps {
  rows?: number
  columns?: number
  showHeader?: boolean
  showSelection?: boolean
  density?: "compact" | "default" | "comfortable"
  className?: string
}

export function TableSkeleton({
  rows = 5,
  columns = 6,
  showHeader = true,
  showSelection = true,
  density = "default",
  className,
}: TableSkeletonProps) {
  const densityConfig = {
    compact: { cellHeight: "h-6", padding: "py-1.5 px-3" },
    default: { cellHeight: "h-8", padding: "py-2.5 px-4" },
    comfortable: { cellHeight: "h-10", padding: "py-3.5 px-5" },
  }

  const config = densityConfig[density]

  return (
    <div className={cn("w-full rounded-lg border bg-card overflow-hidden", className)}>
      {/* Header */}
      {showHeader && (
        <div className="border-b bg-muted/50">
          <div className={cn("flex items-center", config.padding)}>
            {showSelection && <Skeleton width={40} height={16} variant="rounded" className="mr-4" />}
            {Array.from({ length: columns }).map((_, i) => (
              <div key={i} className="flex-1 mr-2 last:mr-0">
                <Skeleton width={i === columns - 1 ? 80 : "100%"} height={14} variant="text" />
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className={cn("flex items-center border-b last:border-0", config.padding, "animate-fade-in")}
             style={{ animationDelay: `${rowIndex * 50}ms` }}>
          {showSelection && <Skeleton width={40} height={16} variant="rounded" className="mr-4" />}
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="flex-1 mr-2 last:mr-0">
              <Skeleton
                width={colIndex === columns - 1 ? 80 : "100%"}
                height={colIndex === 0 ? 20 : 16}
                variant={colIndex === 0 ? "rounded" : "text"}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

// ============ Card Skeleton ============

interface CardSkeletonProps {
  showHeader?: boolean
  showFooter?: boolean
  rows?: number
  className?: string
}

export function CardSkeleton({
  showHeader = true,
  showFooter = false,
  rows = 3,
  className,
}: CardSkeletonProps) {
  return (
    <div className={cn("card-elevated p-6 space-y-4 animate-fade-in", className)}>
      {showHeader && (
        <div className="flex items-center justify-between">
          <Skeleton width={200} height={20} variant="text" />
          <Skeleton width={80} height={32} variant="rounded" />
        </div>
      )}
      
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton width={120} height={14} variant="text" />
            <Skeleton width="100%" height={14} variant="text" className="flex-1" />
          </div>
        ))}
      </div>
      
      {showFooter && (
        <div className="flex items-center justify-end gap-2 pt-4">
          <Skeleton width={80} height={32} variant="rounded" />
          <Skeleton width={80} height={32} variant="rounded" />
        </div>
      )}
    </div>
  )
}

// ============ Detail Page Skeleton ============

interface DetailSkeletonProps {
  showSidebar?: boolean
  showTabs?: boolean
  className?: string
}

export function DetailSkeleton({
  showSidebar = true,
  showTabs = true,
  className,
}: DetailSkeletonProps) {
  return (
    <div className={cn("flex gap-6 p-6 animate-fade-in", className)}>
      {/* Left Sidebar */}
      {showSidebar && (
        <div className="w-80 space-y-4 animate-slide-in-left">
          {/* Header Card */}
          <div className="card-elevated p-6">
            <div className="flex items-center gap-3 mb-4">
              <Skeleton width={64} height={64} variant="circular" />
              <div className="space-y-2 flex-1">
                <Skeleton width={150} height={20} variant="text" />
                <Skeleton width={100} height={14} variant="text" />
              </div>
            </div>
            <div className="flex gap-2 mb-4">
              <Skeleton width={60} height={24} variant="rounded" />
              <Skeleton width={60} height={24} variant="rounded" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton width={16} height={16} variant="circular" />
                  <Skeleton width={80} height={14} variant="text" />
                  <Skeleton width="100%" height={14} variant="text" className="flex-1" />
                </div>
              ))}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="card-bordered p-4">
            <div className="flex gap-2">
              <Skeleton width={100} height={32} variant="rounded" />
              <Skeleton width={100} height={32} variant="rounded" />
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex-1 space-y-4 animate-slide-in-right">
        {showTabs && (
          <div className="card-elevated p-4">
            <div className="flex gap-4 mb-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} width={80} height={32} variant="rounded" />
              ))}
            </div>
            <CardSkeleton rows={5} showHeader={false} />
          </div>
        )}
      </div>
      
      {/* Right Sidebar */}
      {showSidebar && (
        <div className="w-60 space-y-4 animate-slide-in-right">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="card-bordered p-4">
              <Skeleton width={100} height={14} variant="text" className="mb-3" />
              {Array.from({ length: 3 }).map((_, j) => (
                <Skeleton key={j} width="100%" height={40} variant="rounded" className="mb-2" />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ============ List Page Skeleton ============

interface ListPageSkeletonProps {
  showKPI?: boolean
  showFilter?: boolean
  kpiCount?: number
  tableRows?: number
  className?: string
}

export function ListPageSkeleton({
  showKPI = true,
  showFilter = true,
  kpiCount = 4,
  tableRows = 5,
  className,
}: ListPageSkeletonProps) {
  return (
    <div className={cn("min-h-screen bg-background p-6 space-y-6 animate-fade-in", className)}>
      {/* Header */}
      <div className="flex items-center justify-between animate-slide-in-down">
        <div className="space-y-1">
          <Skeleton width={200} height={28} variant="text" />
          <Skeleton width={300} height={14} variant="text" />
        </div>
        <Skeleton width={120} height={36} variant="rounded" />
      </div>
      
      {/* KPI Cards */}
      {showKPI && (
        <div className="grid grid-cols-4 gap-4 animate-slide-in-up">
          {Array.from({ length: kpiCount }).map((_, i) => (
            <div key={i} className="card-elevated p-4" style={{ animationDelay: `${i * 50}ms` }}>
              <Skeleton width={80} height={14} variant="text" className="mb-2" />
              <Skeleton width={60} height={28} variant="text" />
            </div>
          ))}
        </div>
      )}
      
      {/* Filter Bar */}
      {showFilter && (
        <div className="card-bordered p-4 animate-slide-in-up" style={{ animationDelay: '200ms' }}>
          <div className="flex gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex-1">
                <Skeleton width={60} height={14} variant="text" className="mb-2" />
                <Skeleton width="100%" height={32} variant="rounded" />
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Table */}
      <TableSkeleton rows={tableRows} className="animate-slide-in-up" />
    </div>
  )
}

// ============ Form Skeleton ============

interface FormSkeletonProps {
  rows?: number
  showFooter?: boolean
  twoColumns?: boolean
  className?: string
}

export function FormSkeleton({
  rows = 6,
  showFooter = true,
  twoColumns = false,
  className,
}: FormSkeletonProps) {
  return (
    <div className={cn("space-y-4 animate-fade-in", className)}>
      {twoColumns ? (
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i}>
              <Skeleton width={80} height={14} variant="text" className="mb-2" />
              <Skeleton width="100%" height={36} variant="rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i}>
              <Skeleton width={80} height={14} variant="text" className="mb-2" />
              <Skeleton width="100%" height={36} variant="rounded" />
            </div>
          ))}
        </div>
      )}
      
      {showFooter && (
        <div className="flex justify-end gap-2 pt-4">
          <Skeleton width={80} height={36} variant="rounded" />
          <Skeleton width={100} height={36} variant="rounded" />
        </div>
      )}
    </div>
  )
}

export default Skeleton