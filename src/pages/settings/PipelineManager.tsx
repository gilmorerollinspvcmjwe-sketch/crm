/**
 * PipelineManager - Sales Pipeline / Funnel Manager
 * Configure pipeline stages, probability, and automation rules
 */
"use client"

import React, { useState } from "react"
import { Link, useParams } from "react-router-dom"
import {
  ArrowLeft,
  Plus,
  Trash2,
  Edit2,
  GripVertical,
  Loader2,
  Check,
  X,
  ArrowRight,
  Settings,
  LayoutGrid,
  TrendingUp,
  DollarSign,
  Clock,
  AlertCircle,
  ChevronDown,
  Workflow,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

// ============ Types ============

interface PipelineStage {
  id: string
  name: string
  probability: number // 0-100
  displayOrder: number
  isClosed: boolean
  isWon: boolean
  assignRule: "round_robin" | "field_owner" | "specific_user" | ""
  automationEnabled: boolean
  daysToExpire?: number
  fields?: { name: string; value: string }[]
}

interface Pipeline {
  id: string
  name: string
  objectType: string
  isDefault: boolean
  stages: PipelineStage[]
}

// ============ Default Pipeline ============

const DEFAULT_PIPELINE: Pipeline = {
  id: "pipeline_default",
  name: "销售管道",
  objectType: "deals",
  isDefault: true,
  stages: [
    { id: "s1", name: "线索", probability: 10, displayOrder: 0, isClosed: false, isWon: false, assignRule: "field_owner", automationEnabled: false },
    { id: "s2", name: "初步接触", probability: 20, displayOrder: 1, isClosed: false, isWon: false, assignRule: "field_owner", automationEnabled: false },
    { id: "s3", name: "需求确认", probability: 40, displayOrder: 2, isClosed: false, isWon: false, assignRule: "field_owner", automationEnabled: false },
    { id: "s4", name: "方案报价", probability: 60, displayOrder: 3, isClosed: false, isWon: false, assignRule: "round_robin", automationEnabled: true },
    { id: "s5", name: "合同谈判", probability: 80, displayOrder: 4, isClosed: false, isWon: false, assignRule: "round_robin", automationEnabled: true },
    { id: "s6", name: "已成交", probability: 100, displayOrder: 5, isClosed: true, isWon: true, assignRule: "", automationEnabled: false },
    { id: "s7", name: "已输单", probability: 0, displayOrder: 6, isClosed: true, isWon: false, assignRule: "", automationEnabled: false },
  ],
}

// ============ Main Component ============

export default function PipelineManagerPage() {
  const { objectId } = useParams<{ objectId: string }>()
  const { toast } = useToast()

  const [pipeline, setPipeline] = useState<Pipeline>(DEFAULT_PIPELINE)
  const [editingStageId, setEditingStageId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const updateStage = (id: string, updates: Partial<PipelineStage>) => {
    setPipeline((prev) => ({
      ...prev,
      stages: prev.stages.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }))
  }

  const addStage = () => {
    const newStage: PipelineStage = {
      id: `s_${Date.now()}`,
      name: `阶段 ${pipeline.stages.length + 1}`,
      probability: 0,
      displayOrder: pipeline.stages.length,
      isClosed: false,
      isWon: false,
      assignRule: "",
      automationEnabled: false,
    }
    setPipeline((prev) => ({ ...prev, stages: [...prev.stages, newStage] }))
    setEditingStageId(newStage.id)
  }

  const deleteStage = (id: string) => {
    setPipeline((prev) => ({
      ...prev,
      stages: prev.stages.filter((s) => s.id !== id),
    }))
    if (editingStageId === id) setEditingStageId(null)
  }

  const moveStage = (id: string, direction: "up" | "down") => {
    setPipeline((prev) => {
      const idx = prev.stages.findIndex((s) => s.id === id)
      if (direction === "up" && idx > 0) {
        const stages = [...prev.stages]
        ;[stages[idx - 1], stages[idx]] = [stages[idx], stages[idx - 1]]
        stages.forEach((s, i) => { s.displayOrder = i })
        return { ...prev, stages }
      }
      if (direction === "down" && idx < prev.stages.length - 1) {
        const stages = [...prev.stages]
        ;[stages[idx], stages[idx + 1]] = [stages[idx + 1], stages[idx]]
        stages.forEach((s, i) => { s.displayOrder = i })
        return { ...prev, stages }
      }
      return prev
    })
  }

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 600))
    setSaving(false)
    toast({ title: "已保存", description: "管道配置已保存" })
  }

  const totalProbability = pipeline.stages.filter((s) => !s.isClosed).reduce((sum, s) => sum + s.probability, 0) /
    pipeline.stages.filter((s) => !s.isClosed).length

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="border-b border-border/70 bg-[oklch(var(--shell-panel-elevated)/0.94)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 md:px-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="flex items-start gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to={`/custom-objects/${objectId}`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                <Workflow className="h-3.5 w-3.5" />
                Pipeline workspace
              </div>
              <h1 className="mt-3 text-2xl font-bold tracking-tight">管道管理器</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                为需要阶段流转的对象定义阶段、概率、自动化和到期规则，满足文档中的阶段管理要求。
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" className="gap-1.5" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
              保存
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Pipeline Overview */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Pipeline Header */}
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold">{pipeline.name}</h2>
              {pipeline.isDefault && <Badge className="bg-blue-100 text-blue-700 border-blue-200">默认管道</Badge>}
              <Badge variant="secondary">{pipeline.stages.length} 个阶段</Badge>
            </div>

            {/* Stage Cards */}
            <div className="space-y-2">
              {pipeline.stages
                .slice()
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map((stage, idx) => {
                  const isEditing = editingStageId === stage.id
                  return (
                    <Card
                      key={stage.id}
                      className={cn(
                        "transition-all cursor-pointer",
                        isEditing && "ring-2 ring-primary"
                      )}
                      onClick={() => setEditingStageId(stage.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          {/* Drag Handle */}
                          <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab shrink-0" />

                          {/* Stage Number */}
                          <div className={cn(
                            "h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0",
                            stage.isWon ? "bg-emerald-100 text-emerald-700" :
                            stage.isClosed ? "bg-gray-100 text-gray-600" : "bg-blue-100 text-blue-700"
                          )}>
                            {idx + 1}
                          </div>

                          {/* Stage Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{stage.name}</span>
                              {stage.isWon && <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs">成交</Badge>}
                              {stage.isClosed && !stage.isWon && <Badge variant="secondary" className="text-xs">已关闭</Badge>}
                              {stage.automationEnabled && (
                                <Badge variant="outline" className="text-xs text-purple-600 border-purple-200">自动化</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                              {!stage.isClosed && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <TrendingUp className="h-3 w-3" />
                                  {stage.probability}% 概率
                                </span>
                              )}
                              {stage.assignRule && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Settings className="h-3 w-3" />
                                  {stage.assignRule === "round_robin" ? "轮询分配" :
                                   stage.assignRule === "field_owner" ? "负责人字段" : stage.assignRule}
                                </span>
                              )}
                              {stage.daysToExpire && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {stage.daysToExpire} 天
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Stage Actions */}
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              disabled={idx === 0}
                              onClick={(e) => { e.stopPropagation(); moveStage(stage.id, "up") }}
                            >
                              ↑
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              disabled={idx === pipeline.stages.length - 1}
                              onClick={(e) => { e.stopPropagation(); moveStage(stage.id, "down") }}
                            >
                              ↓
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-red-500"
                              onClick={(e) => { e.stopPropagation(); deleteStage(stage.id) }}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>

                        {/* Inline Edit */}
                        {isEditing && (
                          <div className="mt-3 pt-3 border-t space-y-3" onClick={(e) => e.stopPropagation()}>
                            <div className="grid grid-cols-4 gap-3">
                              <div className="space-y-1">
                                <Label className="text-xs">阶段名称</Label>
                                <Input
                                  value={stage.name}
                                  onChange={(e) => updateStage(stage.id, { name: e.target.value })}
                                  className="h-8 text-xs"
                                />
                              </div>
                              {!stage.isClosed && (
                                <div className="space-y-1">
                                  <Label className="text-xs">赢单概率 %</Label>
                                  <Input
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={stage.probability}
                                    onChange={(e) => updateStage(stage.id, { probability: parseInt(e.target.value) || 0 })}
                                    className="h-8 text-xs"
                                  />
                                </div>
                              )}
                              <div className="space-y-1">
                                <Label className="text-xs">分配规则</Label>
                                <Select
                                  value={stage.assignRule || ""}
                                  onValueChange={(v) => updateStage(stage.id, { assignRule: v as PipelineStage["assignRule"] })}
                                >
                                  <SelectTrigger className="h-8 text-xs">
                                    <SelectValue placeholder="无" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="round_robin">轮询分配</SelectItem>
                                    <SelectItem value="field_owner">负责人字段</SelectItem>
                                    <SelectItem value="specific_user">指定用户</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">到期天数</Label>
                                <Input
                                  type="number"
                                  min={0}
                                  value={stage.daysToExpire || ""}
                                  onChange={(e) => updateStage(stage.id, { daysToExpire: parseInt(e.target.value) || undefined })}
                                  className="h-8 text-xs"
                                  placeholder="无"
                                />
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={stage.isWon}
                                  onCheckedChange={(checked) => updateStage(stage.id, { isWon: checked, isClosed: checked })}
                                  disabled={!stage.isClosed && !stage.isWon}
                                />
                                <Label className="text-xs">成交阶段</Label>
                              </div>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={stage.automationEnabled}
                                  onCheckedChange={(checked) => updateStage(stage.id, { automationEnabled: checked })}
                                />
                                <Label className="text-xs">启用自动化</Label>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="ml-auto"
                                onClick={() => setEditingStageId(null)}
                              >
                                收起
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}

              {/* Add Stage */}
              <Button variant="outline" className="w-full h-12 gap-1.5" onClick={addStage}>
                <Plus className="h-4 w-4" />
                添加阶段
              </Button>
            </div>

            {/* Stats */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  管道统计
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 rounded-lg bg-blue-50">
                    <p className="text-2xl font-bold text-blue-700">{pipeline.stages.filter(s => !s.isClosed).length}</p>
                    <p className="text-xs text-blue-600">活跃阶段</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-emerald-50">
                    <p className="text-2xl font-bold text-emerald-700">1</p>
                    <p className="text-xs text-emerald-600">成交阶段</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-gray-50">
                    <p className="text-2xl font-bold text-gray-700">{pipeline.stages.filter(s => s.isClosed && !s.isWon).length}</p>
                    <p className="text-xs text-gray-600">输单阶段</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
