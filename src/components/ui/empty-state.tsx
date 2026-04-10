"use client"

import * as React from "react"
import { useNavigate } from "react-router-dom"
import { 
  FileQuestion, Inbox, Search, Database, UserX, 
  Plus, RefreshCw, ArrowLeft,
  Phone, Calendar
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// ============ Empty State Types ============

type EmptyStateVariant = "default" | "search" | "error" | "notFound" | "noData" | "noPermission"

interface EmptyStateProps {
  variant?: EmptyStateVariant
  title?: string
  description?: string
  icon?: React.ReactNode
  illustration?: React.ReactNode
  action?: {
    label: string
    onClick: () => void
    icon?: React.ReactNode
    variant?: "default" | "outline" | "ghost" | "link" | "destructive"
  }
  secondaryAction?: {
    label: string
    onClick: () => void
    icon?: React.ReactNode
  }
  className?: string
  size?: "sm" | "default" | "lg"
  animate?: boolean
}

// ============ Default Illustrations ============

const getDefaultIllustration = (variant: EmptyStateVariant): React.ReactNode => {
  const illustrations: Record<EmptyStateVariant, React.ReactNode> = {
    default: (
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 bg-muted/30 rounded-full animate-pulse-soft" />
        <Inbox className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 text-muted-foreground" />
      </div>
    ),
    search: (
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 bg-blue-50 rounded-full" />
        <Search className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 text-blue-400" />
        <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1">
          <FileQuestion className="h-6 w-6 text-muted-foreground" />
        </div>
      </div>
    ),
    error: (
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 bg-red-50 rounded-full" />
        <FileQuestion className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 text-red-400" />
      </div>
    ),
    notFound: (
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 bg-gray-50 rounded-full" />
        <FileQuestion className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 text-gray-400" />
      </div>
    ),
    noData: (
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 bg-muted/30 rounded-full" />
        <Database className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 text-muted-foreground opacity-50" />
      </div>
    ),
    noPermission: (
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 bg-yellow-50 rounded-full" />
        <UserX className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 text-yellow-400" />
      </div>
    ),
  }
  return illustrations[variant]
}

const defaultTitles: Record<EmptyStateVariant, string> = {
  default: "暂无数据",
  search: "未找到匹配结果",
  error: "加载失败",
  notFound: "页面不存在",
  noData: "数据为空",
  noPermission: "无访问权限",
}

const defaultDescriptions: Record<EmptyStateVariant, string> = {
  default: "当前没有任何数据，请稍后再试。",
  search: "没有找到符合筛选条件的数据，请尝试调整搜索条件。",
  error: "数据加载出现问题，请刷新页面重试。",
  notFound: "您访问的页面不存在或已被删除。",
  noData: "当前模块还没有任何数据。",
  noPermission: "您没有权限访问此内容，请联系管理员。",
}

// ============ Empty State Component ============

export function EmptyState({
  variant = "default",
  title,
  description,
  icon,
  illustration,
  action,
  secondaryAction,
  className,
  size = "default",
  animate = true,
}: EmptyStateProps) {
  const sizeConfig = {
    sm: { container: "py-8", icon: "w-16 h-16", title: "text-sm", desc: "text-xs" },
    default: { container: "py-12", icon: "w-24 h-24", title: "text-base", desc: "text-sm" },
    lg: { container: "py-16", icon: "w-32 h-32", title: "text-lg", desc: "text-base" },
  }

  const config = sizeConfig[size]

  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center",
      config.container,
      animate && "animate-fade-in",
      className
    )}>
      {/* Illustration */}
      <div className={cn("mb-4 relative", config.icon)}>
        {illustration || getDefaultIllustration(variant)}
        {icon && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {icon}
          </div>
        )}
      </div>
      
      {/* Title */}
      <h3 className={cn("font-medium text-foreground mb-2", config.title)}>
        {title || defaultTitles[variant]}
      </h3>
      
      {/* Description */}
      <p className={cn("text-muted-foreground max-w-md mb-4", config.desc)}>
        {description || defaultDescriptions[variant]}
      </p>
      
      {/* Actions */}
      <div className="flex items-center gap-2">
        {action && (
          <Button
            variant={action.variant || "default"}
            onClick={action.onClick}
            className="animate-scale-in"
          >
            {action.icon && <span className="mr-2">{action.icon}</span>}
            {action.label}
          </Button>
        )}
        {secondaryAction && (
          <Button
            variant="outline"
            onClick={secondaryAction.onClick}
            className="animate-scale-in"
          >
            {secondaryAction.icon && <span className="mr-2">{secondaryAction.icon}</span>}
            {secondaryAction.label}
          </Button>
        )}
      </div>
    </div>
  )
}

// ============ Specialized Empty States ============

export function NoLeadsState({ onAdd }: { onAdd?: () => void }) {
  const navigate = useNavigate()
  
  return (
    <EmptyState
      variant="default"
      illustration={
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 bg-blue-50 rounded-full" />
          <Inbox className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 text-blue-400" />
        </div>
      }
      title="暂无线索"
      description="还没有任何线索数据，您可以新增线索或将客户转化为线索。"
      action={onAdd ? {
        label: "新增线索",
        onClick: onAdd,
        icon: <Plus className="h-4 w-4" />,
      } : undefined}
      secondaryAction={{
        label: "返回",
        onClick: () => navigate(-1),
        icon: <ArrowLeft className="h-4 w-4" />,
      }}
    />
  )
}

export function NoContactsState({ onAdd }: { onAdd?: () => void }) {
  const navigate = useNavigate()
  
  return (
    <EmptyState
      variant="default"
      illustration={
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 bg-green-50 rounded-full" />
          <Phone className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 text-green-400" />
        </div>
      }
      title="暂无沟通记录"
      description="还没有任何沟通记录，您可以新增记录以跟踪客户互动。"
      action={onAdd ? {
        label: "新增记录",
        onClick: onAdd,
        icon: <Plus className="h-4 w-4" />,
      } : undefined}
      secondaryAction={{
        label: "返回",
        onClick: () => navigate(-1),
        icon: <ArrowLeft className="h-4 w-4" />,
      }}
    />
  )
}

export function NoCustomersState({ onAdd }: { onAdd?: () => void }) {
  const navigate = useNavigate()
  
  return (
    <EmptyState
      variant="default"
      illustration={
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 bg-purple-50 rounded-full" />
          <Database className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 text-purple-400" />
        </div>
      }
      title="暂无客户"
      description="还没有任何客户数据，您可以新增客户或将线索转化为客户。"
      action={onAdd ? {
        label: "新增客户",
        onClick: onAdd,
        icon: <Plus className="h-4 w-4" />,
      } : undefined}
      secondaryAction={{
        label: "返回",
        onClick: () => navigate(-1),
        icon: <ArrowLeft className="h-4 w-4" />,
      }}
    />
  )
}

export function NoOpportunitiesState({ onAdd }: { onAdd?: () => void }) {
  const navigate = useNavigate()
  
  return (
    <EmptyState
      variant="default"
      illustration={
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 bg-yellow-50 rounded-full" />
          <Calendar className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 text-yellow-400" />
        </div>
      }
      title="暂无商机"
      description="还没有任何商机数据，您可以新增商机来跟踪销售机会。"
      action={onAdd ? {
        label: "新增商机",
        onClick: onAdd,
        icon: <Plus className="h-4 w-4" />,
      } : undefined}
      secondaryAction={{
        label: "返回",
        onClick: () => navigate(-1),
        icon: <ArrowLeft className="h-4 w-4" />,
      }}
    />
  )
}

export function SearchEmptyState({ onReset }: { onReset?: () => void }) {
  return (
    <EmptyState
      variant="search"
      action={onReset ? {
        label: "重置筛选",
        onClick: onReset,
        icon: <RefreshCw className="h-4 w-4" />,
        variant: "outline",
      } : undefined}
    />
  )
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <EmptyState
      variant="error"
      action={onRetry ? {
        label: "重新加载",
        onClick: onRetry,
        icon: <RefreshCw className="h-4 w-4" />,
      } : undefined}
      secondaryAction={{
        label: "返回",
        onClick: () => window.history.back(),
        icon: <ArrowLeft className="h-4 w-4" />,
      }}
    />
  )
}

export function NotFoundState() {
  const navigate = useNavigate()
  
  return (
    <EmptyState
      variant="notFound"
      action={{
        label: "返回首页",
        onClick: () => navigate("/"),
        icon: <ArrowLeft className="h-4 w-4" />,
      }}
    />
  )
}

export function NoPermissionState() {
  const navigate = useNavigate()
  
  return (
    <EmptyState
      variant="noPermission"
      action={{
        label: "返回首页",
        onClick: () => navigate("/"),
        icon: <ArrowLeft className="h-4 w-4" />,
        variant: "outline",
      }}
    />
  )
}

// ============ Inline Empty States (For Tables/Cards) ============

interface InlineEmptyStateProps {
  message?: string
  icon?: React.ReactNode
  className?: string
}

export function InlineEmptyState({ 
  message = "暂无数据", 
  icon,
  className 
}: InlineEmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-8 text-center animate-fade-in",
      className
    )}>
      {icon || (
        <div className="mb-2 opacity-50">
          <Inbox className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}

export default EmptyState