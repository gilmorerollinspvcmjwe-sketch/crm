import React, { useState, useRef, useCallback, useEffect } from 'react'
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Zap,
  GitBranch,
  Play,
  Clock,
  ChevronRight,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { WorkflowNode, WorkflowEdge, NodeType, NodePosition } from '@/types/workflow'

interface WorkflowVisualizerProps {
  nodes: WorkflowNode[]
  edges?: WorkflowEdge[]
  onNodeClick?: (node: WorkflowNode) => void
  selectedNodeId?: string
  zoom?: number
  onZoomChange?: (zoom: number) => void
  className?: string
}

const NODE_TYPE_CONFIG: Record<
  NodeType,
  { label: string; icon: React.ReactNode; color: string; borderColor: string; bgColor: string }
> = {
  trigger: {
    label: '触发器',
    icon: <Zap className="h-5 w-5" />,
    color: 'text-amber-600',
    borderColor: 'border-amber-400',
    bgColor: 'bg-amber-50',
  },
  condition: {
    label: '条件',
    icon: <GitBranch className="h-5 w-5" />,
    color: 'text-violet-600',
    borderColor: 'border-violet-400',
    bgColor: 'bg-violet-50',
  },
  action: {
    label: '动作',
    icon: <Play className="h-5 w-5" />,
    color: 'text-emerald-600',
    borderColor: 'border-emerald-400',
    bgColor: 'bg-emerald-50',
  },
  delay: {
    label: '延迟',
    icon: <Clock className="h-5 w-5" />,
    color: 'text-blue-600',
    borderColor: 'border-blue-400',
    bgColor: 'bg-blue-50',
  },
}

const NODE_WIDTH = 200
const NODE_HEIGHT = 80
const H_SPACING = 120
const V_SPACING = 100

function getAutoLayout(nodes: WorkflowNode[]): Map<string, NodePosition> {
  const positions = new Map<string, NodePosition>()

  // Simple auto-layout: horizontal flow
  // First pass: assign columns based on node type order
  const triggerNodes = nodes.filter((n) => n.type === 'trigger')
  const conditionNodes = nodes.filter((n) => n.type === 'condition')
  const actionNodes = nodes.filter((n) => n.type === 'action' || n.type === 'delay')

  let yOffset = 0

  triggerNodes.forEach((node, i) => {
    positions.set(node.id, { x: 0, y: yOffset + i * (NODE_HEIGHT + V_SPACING) })
  })

  yOffset = 0
  conditionNodes.forEach((node, i) => {
    positions.set(node.id, { x: NODE_WIDTH + H_SPACING, y: yOffset + i * (NODE_HEIGHT + V_SPACING) })
  })

  yOffset = 0
  actionNodes.forEach((node, i) => {
    positions.set(node.id, {
      x: 2 * (NODE_WIDTH + H_SPACING),
      y: yOffset + i * (NODE_HEIGHT + V_SPACING),
    })
  })

  return positions
}

function WorkflowNodeComponent({
  node,
  position,
  isSelected,
  onClick,
}: {
  node: WorkflowNode
  position: NodePosition
  isSelected: boolean
  onClick: (node: WorkflowNode) => void
}) {
  const config = NODE_TYPE_CONFIG[node.type]

  return (
    <div
      className={`
        absolute flex flex-col items-center justify-center rounded-lg border-2 cursor-pointer
        transition-all duration-200 select-none
        ${config.borderColor}
        ${config.bgColor}
        ${isSelected ? 'ring-2 ring-primary ring-offset-2 shadow-lg' : 'hover:shadow-md'}
      `}
      style={{
        left: position.x,
        top: position.y,
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
      }}
      onClick={() => onClick(node)}
    >
      {/* Header */}
      <div className={`flex items-center gap-2 ${config.color} mb-1`}>
        {config.icon}
        <span className="text-xs font-medium">{config.label}</span>
      </div>

      {/* Name */}
      <div className="text-sm font-medium text-foreground text-center px-2 truncate w-full">
        {node.name}
      </div>

      {/* Description */}
      {node.description && (
        <div className="text-xs text-muted-foreground text-center px-2 truncate w-full mt-0.5">
          {node.description}
        </div>
      )}

      {/* Connection points */}
      <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-background border-2 border-primary" />
      <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-background border-2 border-primary" />

      {/* Condition branches */}
      {node.type === 'condition' && node.branches && (
        <>
          <div className="absolute -right-1.5 top-1/4 -translate-y-1/2 w-3 h-3 rounded-full bg-emerald-400 border-2 border-background" />
          <div className="absolute -right-1.5 top-3/4 -translate-y-1/2 w-3 h-3 rounded-full bg-red-400 border-2 border-background" />
        </>
      )}
    </div>
  )
}

function EdgeLine({
  from,
  to,
  label,
  type = 'default',
}: {
  from: NodePosition
  to: NodePosition
  label?: string
  type?: 'default' | 'true' | 'false'
}) {
  const midX = (from.x + NODE_WIDTH + to.x) / 2
  const midY = (from.y + NODE_HEIGHT / 2 + to.y + NODE_HEIGHT / 2) / 2

  // SVG path
  const startX = from.x + NODE_WIDTH
  const startY = from.y + NODE_HEIGHT / 2
  const endX = to.x
  const endY = to.y + NODE_HEIGHT / 2

  const controlOffset = Math.min(Math.abs(endX - startX) / 2, 80)

  const pathD = `M ${startX} ${startY} C ${startX + controlOffset} ${startY}, ${endX - controlOffset} ${endY}, ${endX} ${endY}`

  const color =
    type === 'true'
      ? 'stroke-emerald-500'
      : type === 'false'
      ? 'stroke-red-500'
      : 'stroke-muted-foreground'

  return (
    <g>
      <path
        d={pathD}
        fill="none"
        className={`${color} stroke-2`}
        strokeDasharray={type === 'default' ? undefined : '5,5'}
      />
      {label && (
        <text
          x={midX}
          y={midY - 8}
          textAnchor="middle"
          className="fill-muted-foreground text-xs font-medium"
        >
          {label}
        </text>
      )}
      {/* Arrow */}
      <polygon
        points={`${endX - 6},${endY - 4} ${endX},${endY} ${endX - 6},${endY + 4}`}
        className={color}
        fill="currentColor"
      />
    </g>
  )
}

export function WorkflowVisualizer({
  nodes,
  edges = [],
  onNodeClick,
  selectedNodeId,
  zoom = 1,
  onZoomChange,
  className = '',
}: WorkflowVisualizerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pan, setPan] = useState({ x: 40, y: 40 })
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const [isDraggingNode, setIsDraggingNode] = useState<string | null>(null)
  const [draggedNodeOffset, setDraggedNodeOffset] = useState({ x: 0, y: 0 })
  const [localNodes, setLocalNodes] = useState<WorkflowNode[]>(nodes)

  useEffect(() => {
    setLocalNodes(nodes)
  }, [nodes])

  // Auto-layout positions
  const positions = getAutoLayout(localNodes)

  const handleZoomIn = () => {
    const newZoom = Math.min(zoom * 1.2, 3)
    onZoomChange?.(newZoom)
  }

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom / 1.2, 0.3)
    onZoomChange?.(newZoom)
  }

  const handleReset = () => {
    onZoomChange?.(1)
    setPan({ x: 40, y: 40 })
  }

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const delta = e.deltaY > 0 ? 0.9 : 1.1
        const newZoom = Math.min(Math.max(zoom * delta, 0.3), 3)
        onZoomChange?.(newZoom)
      } else {
        setPan((prev) => ({
          x: prev.x - e.deltaX,
          y: prev.y - e.deltaY,
        }))
      }
    },
    [zoom, onZoomChange]
  )

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === containerRef.current || (e.target as HTMLElement).tagName === 'svg') {
      setIsPanning(true)
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      })
    }
    if (isDraggingNode) {
      setLocalNodes((prev) =>
        prev.map((n) => {
          if (n.id === isDraggingNode) {
            return {
              ...n,
              position: {
                x: (e.clientX - draggedNodeOffset.x - pan.x) / zoom,
                y: (e.clientY - draggedNodeOffset.y - pan.y) / zoom,
              },
            }
          }
          return n
        })
      )
    }
  }

  const handleMouseUp = () => {
    setIsPanning(false)
    setIsDraggingNode(null)
  }

  const handleNodeDragStart = (e: React.MouseEvent, nodeId: string) => {
    const pos = positions.get(nodeId)
    if (!pos) return
    setIsDraggingNode(nodeId)
    setDraggedNodeOffset({
      x: e.clientX - pos.x * zoom - pan.x,
      y: e.clientY - pos.y * zoom - pan.y,
    })
  }

  // Calculate SVG bounds
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity
  localNodes.forEach((node) => {
    const pos = positions.get(node.id) || node.position
    minX = Math.min(minX, pos.x)
    minY = Math.min(minY, pos.y)
    maxX = Math.max(maxX, pos.x + NODE_WIDTH)
    maxY = Math.max(maxY, pos.y + NODE_HEIGHT)
  })

  const svgWidth = maxX - minX + 100
  const svgHeight = maxY - minY + 100

  return (
    <div className={`relative ${className}`}>
      {/* Controls */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-background/90 backdrop-blur-sm rounded-lg border shadow-sm p-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>缩小</TooltipContent>
        </Tooltip>

        <span className="text-xs font-medium w-12 text-center">{Math.round(zoom * 100)}%</span>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>放大</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>重置视图</TooltipContent>
        </Tooltip>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-10 bg-background/90 backdrop-blur-sm rounded-lg border shadow-sm p-3">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
          {Object.entries(NODE_TYPE_CONFIG).map(([type, cfg]) => (
            <div key={type} className="flex items-center gap-1.5 text-xs">
              <span className={cfg.color}>{cfg.icon}</span>
              <span className="text-muted-foreground">{cfg.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        className="overflow-hidden cursor-grab active:cursor-grabbing bg-muted/20 rounded-lg border"
        style={{ height: 500 }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
          }}
        >
          {/* SVG for edges */}
          <svg
            width={svgWidth}
            height={svgHeight}
            style={{ position: 'absolute', left: minX - 50, top: minY - 50, pointerEvents: 'none' }}
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
              </marker>
            </defs>
            {edges.map((edge) => {
              const fromPos = positions.get(edge.source) || { x: 0, y: 0 }
              const toPos = positions.get(edge.target) || { x: 0, y: 0 }
              return (
                <EdgeLine
                  key={edge.id}
                  from={fromPos}
                  to={toPos}
                  label={edge.label}
                  type={edge.type}
                />
              )
            })}
          </svg>

          {/* Nodes */}
          {localNodes.map((node) => {
            const pos = positions.get(node.id) || node.position
            return (
              <WorkflowNodeComponent
                key={node.id}
                node={node}
                position={pos}
                isSelected={node.id === selectedNodeId}
                onClick={onNodeClick || (() => {})}
              />
            )
          })}

          {localNodes.length === 0 && (
            <div className="flex items-center justify-center w-full h-full text-muted-foreground text-sm">
              暂无节点，请添加触发器、条件和动作
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
