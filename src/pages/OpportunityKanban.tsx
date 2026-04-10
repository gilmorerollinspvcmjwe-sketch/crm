"use client"

import * as React from "react"
import { useNavigate } from "react-router-dom"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import { Plus, TrendingUp, Eye, Edit2, CheckCircle, XCircle, GripVertical } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Modal } from "@/components/modal/Dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { OpportunityForm } from "@/forms/OpportunityForm"
import {
  useOpportunities,
  useUpdateOpportunityStage,
  useCreateOpportunity,
  useStageStats,
} from "@/hooks/api/useOpportunities"
import type { Opportunity, OpportunityStage } from "@/types/api"
import type { OpportunityFormValues } from "@/schemas"
import { cn } from "@/lib/utils"

// ============ Stage Configuration ============

const STAGES: OpportunityStage[] = ["初步接触", "需求确认", "方案报价", "合同谈判", "成交", "失败"]

const stageConfig: Record<OpportunityStage, {
  label: string
  color: string
  bgClass: string
  borderClass: string
  progress: number
  icon?: React.ReactNode
}> = {
  "初步接触": {
    label: "初步接触",
    color: "#6B7280",
    bgClass: "bg-gray-50",
    borderClass: "border-gray-200",
    progress: 10,
  },
  "需求确认": {
    label: "需求确认",
    color: "#3B82F6",
    bgClass: "bg-blue-50",
    borderClass: "border-blue-200",
    progress: 30,
  },
  "方案报价": {
    label: "方案报价",
    color: "#F59E0B",
    bgClass: "bg-yellow-50",
    borderClass: "border-yellow-200",
    progress: 50,
  },
  "合同谈判": {
    label: "合同谈判",
    color: "#8B5CF6",
    bgClass: "bg-purple-50",
    borderClass: "border-purple-200",
    progress: 75,
  },
  "成交": {
    label: "成交",
    color: "#10B981",
    bgClass: "bg-green-50",
    borderClass: "border-green-200",
    progress: 100,
    icon: <CheckCircle className="w-4 h-4" />,
  },
  "失败": {
    label: "失败",
    color: "#EF4444",
    bgClass: "bg-red-50",
    borderClass: "border-red-200",
    progress: 0,
    icon: <XCircle className="w-4 h-4" />,
  },
}

// ============ KanbanCard Component ============

interface KanbanCardProps {
  opportunity: Opportunity
  index: number
  onEdit: (opportunity: Opportunity) => void
  onView: (id: string) => void
}

function KanbanCard({ opportunity, index, onEdit, onView }: KanbanCardProps) {
  const config = stageConfig[opportunity.stage]

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("zh-CN", {
      style: "currency",
      currency: "CNY",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const priorityColors: Record<string, string> = {
    "高": "bg-red-100 text-red-700",
    "中": "bg-blue-100 text-blue-700",
    "低": "bg-gray-100 text-gray-700",
  }

  return (
    <Draggable draggableId={opportunity.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={cn(
            "group relative bg-white rounded-lg border shadow-sm p-3 mb-2 transition-all duration-200",
            config.borderClass,
            snapshot.isDragging && "shadow-lg ring-2 ring-primary/50 scale-[1.02]",
            opportunity.stage === "成交" && "bg-green-5 border-green-200",
            opportunity.stage === "失败" && "bg-red-5 border-red-200 opacity-60"
          )}
        >
          {/* Drag Handle */}
          <div
            {...provided.dragHandleProps}
            className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </div>

          {/* Card Content */}
          <div className="pl-4">
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{opportunity.name}</h4>
                <p className="text-xs text-muted-foreground truncate">{opportunity.customerName}</p>
              </div>
              <Badge variant="outline" className={cn("ml-2 text-xs", priorityColors[opportunity.priority])}>
                {opportunity.priority}
              </Badge>
            </div>

            {/* Amount */}
            <div className="mb-2">
              <span className="text-sm font-semibold">{formatAmount(opportunity.amount)}</span>
              <span className="text-xs text-muted-foreground ml-1">
                ({opportunity.probability}%)
              </span>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-2 mb-2">
              <Progress
                value={opportunity.probability}
                className="h-1.5 flex-1"
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{opportunity.assignee}</span>
              <span>{opportunity.expectedCloseDate}</span>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-1"
                    onClick={() => onView(opportunity.id)}
                  >
                    <Eye className="w-3 h-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>查看详情</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-1"
                    onClick={() => onEdit(opportunity)}
                  >
                    <Edit2 className="w-3 h-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>编辑</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  )
}

// ============ KanbanColumn Component ============

interface KanbanColumnProps {
  stage: OpportunityStage
  opportunities: Opportunity[]
  stats: { count: number; amount: number; weightedAmount: number }
  onAdd: (stage: OpportunityStage) => void
  onEdit: (opportunity: Opportunity) => void
  onView: (id: string) => void
}

function KanbanColumn({ stage, opportunities, stats, onAdd, onEdit, onView }: KanbanColumnProps) {
  const config = stageConfig[stage]

  const formatAmount = (amount: number) => {
    if (amount >= 10000) {
      return `${(amount / 10000).toFixed(1)}万`
    }
    return new Intl.NumberFormat("zh-CN", {
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className={cn(
      "flex-shrink-0 w-[280px] flex flex-col rounded-lg border",
      config.bgClass,
      config.borderClass
    )}>
      {/* Column Header */}
      <div className="p-3 border-b border-inherit">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            {config.icon && <span style={{ color: config.color }}>{config.icon}</span>}
            <h3 className="font-semibold text-sm" style={{ color: config.color }}>
              {config.label}
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => onAdd(stage)}
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{stats.count} 个商机</span>
          <span className="font-medium text-foreground">{formatAmount(stats.amount)}</span>
        </div>
      </div>

      {/* Column Content */}
      <Droppable droppableId={stage}>
        {(provided, snapshot) => (
          <ScrollArea className="flex-1 min-h-[200px]">
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={cn(
                "p-2 min-h-[200px] transition-colors",
                snapshot.isDraggingOver && "bg-primary/5"
              )}
            >
              {opportunities.map((opp, index) => (
                <KanbanCard
                  key={opp.id}
                  opportunity={opp}
                  index={index}
                  onEdit={onEdit}
                  onView={onView}
                />
              ))}
              {provided.placeholder}
              
              {opportunities.length === 0 && !snapshot.isDraggingOver && (
                <div className="flex flex-col items-center justify-center h-[120px] text-muted-foreground">
                  <p className="text-xs">暂无商机</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 mt-2 text-xs"
                    onClick={() => onAdd(stage)}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    添加商机
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </Droppable>
    </div>
  )
}

// ============ OpportunityKanban Page ============

export function OpportunityKanban() {
  const navigate = useNavigate()
  const [createModalOpen, setCreateModalOpen] = React.useState(false)
  const [editModalOpen, setEditModalOpen] = React.useState(false)
  const [selectedOpportunity, setSelectedOpportunity] = React.useState<Opportunity | null>(null)
  const [initialStage, setInitialStage] = React.useState<OpportunityStage>("初步接触")

  // API Hooks
  const { data, isLoading } = useOpportunities()
  const stageMutation = useUpdateOpportunityStage()
  const createMutation = useCreateOpportunity()
  const stageStats = useStageStats(data?.data)

  // Group opportunities by stage
  const opportunitiesByStage = React.useMemo(() => {
    const grouped: Record<OpportunityStage, Opportunity[]> = {
      "初步接触": [],
      "需求确认": [],
      "方案报价": [],
      "合同谈判": [],
      "成交": [],
      "失败": [],
    }

    if (data?.data) {
      data.data.forEach(opp => {
        grouped[opp.stage].push(opp)
      })
    }

    return grouped
  }, [data?.data])

  // Handlers
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const { draggableId, source, destination } = result
    const newStage = destination.droppableId as OpportunityStage

    if (source.droppableId !== newStage) {
      stageMutation.mutate({ id: draggableId, stage: newStage })
    }
  }

  const handleAdd = (stage: OpportunityStage) => {
    setInitialStage(stage)
    setCreateModalOpen(true)
  }

  const handleEdit = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity)
    setEditModalOpen(true)
  }

  const handleView = (id: string) => {
    navigate(`/opportunities/${id}`)
  }

  const handleCreate = async (values: OpportunityFormValues) => {
    try {
      await createMutation.mutateAsync({
        ...values,
        customerId: values.customerId || "temp-customer",
        customerName: "待关联客户",
      } as Omit<Opportunity, "id" | "createdAt" | "updatedAt">)
      setCreateModalOpen(false)
    } catch (error) {
      console.error("创建失败:", error)
    }
  }

  const handleEditSubmit = async (values: OpportunityFormValues) => {
    if (!selectedOpportunity) return
    try {
      await stageMutation.mutateAsync({
        id: selectedOpportunity.id,
        stage: values.stage as OpportunityStage,
      })
      setEditModalOpen(false)
      setSelectedOpportunity(null)
    } catch (error) {
      console.error("更新失败:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    )
  }

  // Calculate totals
  const totalAmount = data?.data?.reduce((sum, o) => sum + o.amount, 0) || 0
  const activeOpps = data?.data?.filter(o => o.stage !== "成交" && o.stage !== "失败") || []
  const activeAmount = activeOpps.reduce((sum, o) => sum + o.amount, 0)

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-full mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight">商机看板</h1>
              <p className="text-muted-foreground">
                拖拽商机卡片调整阶段
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate("/opportunities")}>
                <TrendingUp className="mr-2 h-4 w-4" />
                列表视图
              </Button>
              <Button onClick={() => handleAdd("初步接触")}>
                <Plus className="mr-2 h-4 w-4" />
                新增商机
              </Button>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-muted/30 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">活跃商机</p>
              <p className="text-xl font-bold">{activeOpps.length}</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">活跃金额</p>
              <p className="text-xl font-bold">
                {new Intl.NumberFormat("zh-CN", {
                  style: "currency",
                  currency: "CNY",
                  minimumFractionDigits: 0,
                }).format(activeAmount)}
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">成交商机</p>
              <p className="text-xl font-bold text-green-600">
                {opportunitiesByStage["成交"].length}
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">失败商机</p>
              <p className="text-xl font-bold text-red-600">
                {opportunitiesByStage["失败"].length}
              </p>
            </div>
          </div>

          {/* Kanban Board */}
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {STAGES.map(stage => (
                <KanbanColumn
                  key={stage}
                  stage={stage}
                  opportunities={opportunitiesByStage[stage]}
                  stats={stageStats.find(s => s.stage === stage) || { count: 0, amount: 0, weightedAmount: 0 }}
                  onAdd={handleAdd}
                  onEdit={handleEdit}
                  onView={handleView}
                />
              ))}
            </div>
          </DragDropContext>

          {/* Create Modal */}
          <Modal
            open={createModalOpen}
            onOpenChange={setCreateModalOpen}
            title="新增商机"
            width={600}
          >
            <OpportunityForm
              mode="create"
              initialValues={{ stage: initialStage } as Partial<OpportunityFormValues>}
              onSubmit={handleCreate}
              onCancel={() => setCreateModalOpen(false)}
              loading={createMutation.isPending}
            />
          </Modal>

          {/* Edit Modal */}
          <Modal
            open={editModalOpen}
            onOpenChange={(open) => {
              setEditModalOpen(open)
              if (!open) setSelectedOpportunity(null)
            }}
            title="编辑商机"
            width={600}
          >
            {selectedOpportunity && (
              <OpportunityForm
                mode="edit"
                initialValues={selectedOpportunity as Partial<OpportunityFormValues>}
                onSubmit={handleEditSubmit}
                onCancel={() => {
                  setEditModalOpen(false)
                  setSelectedOpportunity(null)
                }}
                loading={stageMutation.isPending}
              />
            )}
          </Modal>
        </div>
      </div>
    </TooltipProvider>
  )
}

export default OpportunityKanban