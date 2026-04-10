import React from 'react'
import {
  GripVertical,
  Play,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
  Settings2,
  Copy,
  Trash2,
  MoreHorizontal,
  AlertCircle,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { NodeType, WorkflowNode } from '@/types/workflow'

interface StepCardProps {
  node: WorkflowNode
  index: number
  isActive?: boolean
  isCompleted?: boolean
  isFailed?: boolean
  isRunning?: boolean
  onSelect?: (nodeId: string) => void
  onDuplicate?: (nodeId: string) => void
  onDelete?: (nodeId: string) => void
  onConfigure?: (nodeId: string) => void
}

const NODE_TYPE_CONFIG: Record<
  NodeType,
  {
    label: string
    icon: React.ReactNode
    defaultColor: string
    activeColor: string
    description?: string
  }
> = {
  trigger: {
    label: '触发器',
    icon: <Zap className="h-4 w-4" />,
    defaultColor: 'bg-amber-50 border-amber-200 text-amber-700',
    activeColor: 'bg-amber-100 border-amber-400',
  },
  condition: {
    label: '条件',
    icon: <ChevronRight className="h-4 w-4" />,
    defaultColor: 'bg-blue-50 border-blue-200 text-blue-700',
    activeColor: 'bg-blue-100 border-blue-400',
  },
  action: {
    label: '动作',
    icon: <Play className="h-4 w-4" />,
    defaultColor: 'bg-green-50 border-green-200 text-green-700',
    activeColor: 'bg-green-100 border-green-400',
  },
  delay: {
    label: '延迟',
    icon: <Clock className="h-4 w-4" />,
    defaultColor: 'bg-purple-50 border-purple-200 text-purple-700',
    activeColor: 'bg-purple-100 border-purple-400',
  },
}

function StepStatusIcon({
  status,
}: {
  status?: 'completed' | 'failed' | 'running' | 'pending'
}) {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="h-4 w-4 text-green-500" />
    case 'failed':
      return <XCircle className="h-4 w-4 text-red-500" />
    case 'running':
      return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />
    default:
      return null
  }
}

function StepNodeIcon({ type }: { type: NodeType }) {
  const config = NODE_TYPE_CONFIG[type]
  return (
    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-background border shadow-sm">
      {config.icon}
    </div>
  )
}

export function StepCard({
  node,
  index,
  isActive = false,
  isCompleted = false,
  isFailed = false,
  isRunning = false,
  onSelect,
  onDuplicate,
  onDelete,
  onConfigure,
}: StepCardProps) {
  const config = NODE_TYPE_CONFIG[node.type]

  const status = isCompleted ? 'completed' : isFailed ? 'failed' : isRunning ? 'running' : undefined

  const borderClass = isActive
    ? config.activeColor
    : isCompleted
    ? 'border-green-400 bg-green-50/50'
    : isFailed
    ? 'border-red-400 bg-red-50/50'
    : config.defaultColor

  return (
    <div className="relative">
      {/* Connector line */}
      {index > 0 && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-px h-6 bg-border" />
      )}

      <Card
        className={`
          cursor-pointer transition-all duration-200
          ${borderClass}
          ${isActive ? 'shadow-md ring-2 ring-primary/20' : 'shadow-sm hover:shadow-md'}
        `}
        onClick={() => onSelect?.(node.id)}
      >
        <CardContent className="p-3">
          <div className="flex items-start gap-3">
            {/* Drag handle */}
            <div className="flex flex-col items-center gap-1 pt-0.5">
              <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
              <span className="text-xs font-mono text-muted-foreground">
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>

            {/* Node icon */}
            <StepNodeIcon type={node.type} />

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h4 className="font-medium text-sm truncate">{node.name}</h4>
                <StepStatusIcon status={status} />
              </div>
              {node.description && (
                <p className="text-xs text-muted-foreground truncate">
                  {node.description}
                </p>
              )}
              <div className="flex items-center gap-2 mt-1.5">
                <Badge variant="outline" className="text-xs px-1.5 py-0">
                  {config.label}
                </Badge>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {isFailed && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-amber-600"
                  onClick={(e) => {
                    e.stopPropagation()
                    onConfigure?.(node.id)
                  }}
                  title="重新配置"
                >
                  <AlertCircle className="h-4 w-4" />
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      onConfigure?.(node.id)
                    }}
                  >
                    <Settings2 className="h-4 w-4 mr-2" />
                    配置
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      onDuplicate?.(node.id)
                    }}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    复制
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete?.(node.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    删除
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface StepListProps {
  nodes: WorkflowNode[]
  activeNodeId?: string
  completedNodeIds?: string[]
  failedNodeIds?: string[]
  runningNodeId?: string
  onSelect?: (nodeId: string) => void
  onDuplicate?: (nodeId: string) => void
  onDelete?: (nodeId: string) => void
  onConfigure?: (nodeId: string) => void
}

export function StepList({
  nodes,
  activeNodeId,
  completedNodeIds = [],
  failedNodeIds = [],
  runningNodeId,
  onSelect,
  onDuplicate,
  onDelete,
  onConfigure,
}: StepListProps) {
  return (
    <div className="space-y-3">
      {nodes.map((node, index) => (
        <StepCard
          key={node.id}
          node={node}
          index={index}
          isActive={node.id === activeNodeId}
          isCompleted={completedNodeIds.includes(node.id)}
          isFailed={failedNodeIds.includes(node.id)}
          isRunning={node.id === runningNodeId}
          onSelect={onSelect}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
          onConfigure={onConfigure}
        />
      ))}
    </div>
  )
}
