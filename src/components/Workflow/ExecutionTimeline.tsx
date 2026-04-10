import React from 'react'
import {
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Timer,
  SkipForward,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type {
  WorkflowExecutionLog,
  NodeExecutionLog,
} from '@/types/workflow'

interface ExecutionTimelineProps {
  logs?: WorkflowExecutionLog[]
  isLoading?: boolean
  onLogClick?: (log: WorkflowExecutionLog) => void
  className?: string
}

const STATUS_CONFIG = {
  success: {
    label: '成功',
    icon: <CheckCircle2 className="h-4 w-4" />,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50 border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  failed: {
    label: '失败',
    icon: <XCircle className="h-4 w-4" />,
    color: 'text-red-600',
    bgColor: 'bg-red-50 border-red-200',
    badge: 'bg-red-100 text-red-700',
  },
  running: {
    label: '运行中',
    icon: <Loader2 className="h-4 w-4 animate-spin" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 border-blue-200',
    badge: 'bg-blue-100 text-blue-700',
  },
  pending: {
    label: '等待中',
    icon: <Clock className="h-4 w-4" />,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50 border-amber-200',
    badge: 'bg-amber-100 text-amber-700',
  },
  skipped: {
    label: '已跳过',
    icon: <SkipForward className="h-4 w-4" />,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50 border-gray-200',
    badge: 'bg-gray-100 text-gray-700',
  },
}

function formatDuration(ms?: number): string {
  if (ms === undefined) return '-'
  if (ms < 1000) return `${ms}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  return `${(ms / 60000).toFixed(1)}m`
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

function formatTimeAgo(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diff = now.getTime() - date.getTime()

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes} 分钟前`
  if (hours < 24) return `${hours} 小时前`
  return `${days} 天前`
}

interface ExecutionCardProps {
  log: WorkflowExecutionLog
  onClick?: () => void
  defaultExpanded?: boolean
}

function ExecutionCard({ log, onClick, defaultExpanded = false }: ExecutionCardProps) {
  const status = STATUS_CONFIG[log.status]

  return (
    <Accordion type="single" collapsible defaultValue={defaultExpanded ? 'item-1' : undefined}>
      <AccordionItem value="item-1" className="border-0">
        <Card className={`${status.bgColor} overflow-hidden`}>
          <CardContent className="p-0">
            {/* Summary Row */}
            <div className="flex items-center gap-3 p-4">
              {/* Status Icon */}
              <div className={`${status.color} flex-shrink-0`}>{status.icon}</div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-medium text-sm truncate">
                    {log.recordName || log.recordId}
                  </span>
                  <Badge className={`${status.badge} text-xs`}>{status.label}</Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{formatDate(log.triggeredAt)}</span>
                  <span>·</span>
                  <span>{formatTimeAgo(log.triggeredAt)}</span>
                  {log.duration && (
                    <>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Timer className="h-3 w-3" />
                        {formatDuration(log.duration)}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Node count */}
              <div className="flex-shrink-0 text-right">
                <div className="text-sm font-medium">
                  {log.nodeExecutions?.length || 0}
                </div>
                <div className="text-xs text-muted-foreground">步骤</div>
              </div>

              {/* Expand */}
              <AccordionTrigger className="flex-shrink-0 p-0 hover:no-underline">
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </AccordionTrigger>
            </div>

            {/* Error message */}
            {log.status === 'failed' && log.error && (
              <div className="px-4 pb-4 pt-0">
                <div className="flex items-start gap-2 p-3 bg-red-100/50 rounded-lg border border-red-200">
                  <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 break-all">{log.error}</p>
                </div>
              </div>
            )}

            {/* Node details */}
            <AccordionContent>
              <div className="border-t bg-background/50">
                {log.nodeExecutions?.map((node, index) => (
                  <NodeExecutionRow
                    key={node.nodeId}
                    node={node}
                    index={index}
                    isLast={index === (log.nodeExecutions?.length ?? 0) - 1}
                  />
                ))}
              </div>
            </AccordionContent>
          </CardContent>
        </Card>
      </AccordionItem>
    </Accordion>
  )
}

function NodeExecutionRow({
  node,
  index,
  isLast,
}: {
  node: NodeExecutionLog
  index: number
  isLast: boolean
}) {
  const nodeStatus = STATUS_CONFIG[node.status]

  return (
    <div className={`flex items-start gap-3 p-3 ${!isLast ? 'border-b border-border' : ''}`}>
      {/* Step number */}
      <div className="flex-shrink-0">
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium">
          {index + 1}
        </div>
      </div>

      {/* Node info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium truncate">{node.nodeName}</span>
          <Badge variant="outline" className="text-xs">
            {node.nodeType}
          </Badge>
          <span className={`${nodeStatus.color} flex-shrink-0`}>{nodeStatus.icon}</span>
        </div>

        {/* Timing */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{formatDate(node.startedAt)}</span>
          {node.duration && (
            <span className="flex items-center gap-1">
              <Timer className="h-3 w-3" />
              {formatDuration(node.duration)}
            </span>
          )}
        </div>

        {/* Error */}
        {node.error && (
          <div className="mt-2 p-2 bg-red-50 rounded border border-red-200">
            <p className="text-xs text-red-700">{node.error}</p>
          </div>
        )}

        {/* Output preview */}
        {node.output && Object.keys(node.output).length > 0 && (
          <div className="mt-2 p-2 bg-muted/50 rounded border">
            <p className="text-xs text-muted-foreground">
              输出: {JSON.stringify(node.output).substring(0, 100)}
              {JSON.stringify(node.output).length > 100 ? '...' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function ExecutionTimelineSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-8 w-12" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function ExecutionTimeline({
  logs = [],
  isLoading = false,
  onLogClick,
  className = '',
}: ExecutionTimelineProps) {
  if (isLoading) {
    return (
      <div className={className}>
        <ExecutionTimelineSkeleton />
      </div>
    )
  }

  if (logs.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Clock className="h-12 w-12 text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground">暂无执行记录</p>
          <p className="text-sm text-muted-foreground mt-1">
            工作流执行后将在这里显示日志
          </p>
        </CardContent>
      </Card>
    )
  }

  // Group by date
  const groupedLogs = logs.reduce((acc, log) => {
    const date = new Date(log.triggeredAt).toLocaleDateString('zh-CN')
    if (!acc[date]) acc[date] = []
    acc[date].push(log)
    return acc
  }, {} as Record<string, WorkflowExecutionLog[]>)

  return (
    <div className={className}>
      <div className="space-y-6">
        {Object.entries(groupedLogs).map(([date, dateLogs]) => (
          <div key={date}>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">{date}</h3>
            <div className="space-y-3">
              {dateLogs.map((log, index) => (
                <ExecutionCard
                  key={log.id}
                  log={log}
                  defaultExpanded={index === 0 && log.status === 'failed'}
                  onClick={() => onLogClick?.(log)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
