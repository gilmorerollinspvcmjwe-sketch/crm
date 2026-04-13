/**
 * PageBuilder - Custom Page Layout Designer
 * Build custom pages using drag-and-drop cards/components
 */
"use client"

import React, { useState } from "react"
import { useParams, Link } from "react-router-dom"
import {
  ArrowLeft,
  Save,
  Eye,
  Plus,
  Trash2,
  GripVertical,
  Settings,
  Copy,
  Loader2,
  LayoutDashboard,
  Table2,
  BarChart3,
  Clock,
  Bot,
  FileText,
  Hash,
  X,
  ChevronDown,
  CheckSquare,
  Users,
  LayoutTemplate,
} from "lucide-react"
import { useTranslation } from "react-i18next"

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

interface PageCard {
  id: string
  type: "stats" | "table" | "chart" | "timeline" | "ai" | "form" | "custom"
  title: string
  subtitle?: string
  span: 1 | 2 | 3 // column span
  config: Record<string, unknown>
}

// ============ Card Types Config ============

const CARD_TYPES = [
  {
    type: "stats" as const,
    label: "统计卡片",
    icon: <Hash className="h-4 w-4" />,
    color: "bg-blue-50 border-blue-200",
    defaultTitle: "统计数据",
    defaultConfig: { metric: "count", object: "deals" },
  },
  {
    type: "table" as const,
    label: "数据表格",
    icon: <Table2 className="h-4 w-4" />,
    color: "bg-green-50 border-green-200",
    defaultTitle: "数据列表",
    defaultConfig: { object: "deals", columns: ["name", "status", "amount"], pageSize: 10 },
  },
  {
    type: "chart" as const,
    label: "图表",
    icon: <BarChart3 className="h-4 w-4" />,
    color: "bg-purple-50 border-purple-200",
    defaultTitle: "图表",
    defaultConfig: { chartType: "bar", dataSource: "deals" },
  },
  {
    type: "timeline" as const,
    label: "时间线",
    icon: <Clock className="h-4 w-4" />,
    color: "bg-amber-50 border-amber-200",
    defaultTitle: "活动时间线",
    defaultConfig: { object: "activities", limit: 10 },
  },
  {
    type: "ai" as const,
    label: "AI 助手",
    icon: <Bot className="h-4 w-4" />,
    color: "bg-indigo-50 border-indigo-200",
    defaultTitle: "AI 助手",
    defaultConfig: { prompt: "总结今日工作" },
  },
  {
    type: "form" as const,
    label: "快捷表单",
    icon: <FileText className="h-4 w-4" />,
    color: "bg-pink-50 border-pink-200",
    defaultTitle: "快捷录入",
    defaultConfig: { fields: ["name", "status"] },
  },
  {
    type: "custom" as const,
    label: "自定义",
    icon: <LayoutDashboard className="h-4 w-4" />,
    color: "bg-gray-50 border-gray-200",
    defaultTitle: "自定义区块",
    defaultConfig: { html: "" },
  },
]

// ============ Main Component ============

export default function PageBuilderPage() {
  const { t } = useTranslation()
  const { objectId } = useParams<{ objectId: string }>()
  const { toast } = useToast()

  const [cards, setCards] = useState<PageCard[]>([
    { id: "card_1", type: "stats", title: "本月成交", subtitle: "总金额", span: 1, config: { metric: "sum", field: "amount" } },
    { id: "card_2", type: "stats", title: "待跟进线索", subtitle: "数量", span: 1, config: { metric: "count", filter: "status=follow_up" } },
    { id: "card_3", type: "table", title: "最近交易", subtitle: "最新 5 条", span: 2, config: { object: "deals", pageSize: 5 } },
  ])
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  const selectedCardData = cards.find((c) => c.id === selectedCard)

  const addCard = (type: (typeof CARD_TYPES)[number]["type"]) => {
    const cardType = CARD_TYPES.find((c) => c.type === type)!
    const newCard: PageCard = {
      id: `card_${Date.now()}`,
      type,
      title: cardType.defaultTitle,
      subtitle: undefined,
      span: 1,
      config: { ...cardType.defaultConfig },
    }
    setCards((prev) => [...prev, newCard])
    setSelectedCard(newCard.id)
  }

  const removeCard = (id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id))
    if (selectedCard === id) setSelectedCard(null)
  }

  const updateCard = (id: string, updates: Partial<PageCard>) => {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)))
  }

  const moveCard = (id: string, direction: "left" | "right") => {
    setCards((prev) => {
      const idx = prev.findIndex((c) => c.id === id)
      if (direction === "left" && idx > 0) {
        const next = [...prev]
        ;[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]
        return next
      }
      if (direction === "right" && idx < prev.length - 1) {
        const next = [...prev]
        ;[next[idx], next[idx + 1]] = [next[idx + 1], next[idx]]
        return next
      }
      return prev
    })
  }

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 600))
    setSaving(false)
    toast({ title: "已保存", description: "页面布局已保存" })
  }

  // Preview render
  const renderPreview = () => (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {cards.map((card) => (
          <Card
            key={card.id}
            className={cn("space-y-2", card.span === 2 && "col-span-2", card.span === 3 && "col-span-3")}
          >
            <CardHeader className="pb-1">
              <CardTitle className="text-sm">{card.title}</CardTitle>
              {card.subtitle && <p className="text-xs text-muted-foreground">{card.subtitle}</p>}
            </CardHeader>
            <CardContent>
              {card.type === "stats" && (
                <div className="text-3xl font-bold text-primary">
                  {card.config.metric === "count" ? "128" : "¥ 2.4M"}
                </div>
              )}
              {card.type === "table" && (
                <div className="space-y-1">
                  {["item 1", "item 2", "item 3"].map((s, i) => (
                    <div key={i} className="h-6 border rounded bg-muted/50" />
                  ))}
                </div>
              )}
              {card.type === "chart" && <div className="h-24 flex items-center justify-center text-muted-foreground text-sm">图表区域</div>}
              {card.type === "timeline" && <div className="space-y-1.5">{[1, 2, 3].map((i) => <div key={i} className="h-5 border-l-2 border-primary pl-2 text-xs" />)}</div>}
              {card.type === "ai" && <div className="h-16 border rounded-lg bg-indigo-50 flex items-center justify-center text-xs text-indigo-600">🤖 AI 助手</div>}
              {card.type === "form" && <div className="space-y-1.5">{[1, 2].map((i) => <div key={i} className="h-7 border rounded" />)}</div>}
              {card.type === "custom" && <div className="h-16 border rounded flex items-center justify-center text-muted-foreground text-xs">自定义内容</div>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

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
                <LayoutTemplate className="h-3.5 w-3.5" />
                Page builder workspace
              </div>
              <h1 className="mt-3 text-2xl font-bold tracking-tight">页面构建器</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                为对象详情页配置左中右区域的卡片和模块，逐步接近文档要求的自定义页面能力。
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={previewMode ? "default" : "outline"}
              size="sm"
              className="gap-1.5"
              onClick={() => setPreviewMode(!previewMode)}
            >
              <Eye className="h-3.5 w-3.5" />
              {previewMode ? "编辑" : "预览"}
            </Button>
            <Button size="sm" className="gap-1.5" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              保存
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Card Palette */}
        {!previewMode && (
          <div className="w-56 border-r bg-sidebar flex flex-col">
            <div className="px-4 py-3">
              <h3 className="text-sm font-semibold text-sidebar-foreground mb-3 flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                组件库
              </h3>
            </div>
            <Separator />
            <ScrollArea className="flex-1 px-3 py-3">
              <div className="space-y-1.5">
                {CARD_TYPES.map((cardType) => (
                  <div
                    key={cardType.type}
                    className={cn(
                      "flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all hover:shadow-sm",
                      cardType.color
                    )}
                    onClick={() => addCard(cardType.type)}
                  >
                    {cardType.icon}
                    <div className="flex-1">
                      <span className="text-sm font-medium">{cardType.label}</span>
                    </div>
                    <Plus className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Center: Canvas */}
        <div className="flex-1 overflow-auto bg-muted/10 p-6">
          {previewMode ? (
            renderPreview()
          ) : (
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-3 gap-4">
                {cards.map((card) => {
                  const cardType = CARD_TYPES.find((c) => c.type === card.type)
                  return (
                    <Card
                      key={card.id}
                      className={cn(
                        "transition-all cursor-pointer relative group",
                        card.span === 2 && "col-span-2",
                        card.span === 3 && "col-span-3",
                        selectedCard === card.id && "ring-2 ring-primary"
                      )}
                      onClick={() => setSelectedCard(card.id)}
                    >
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => { e.stopPropagation(); moveCard(card.id, "left") }}
                        >
                          ←
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => { e.stopPropagation(); moveCard(card.id, "right") }}
                        >
                          →
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-red-500"
                          onClick={(e) => { e.stopPropagation(); removeCard(card.id) }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <CardHeader className="pb-1">
                        <div className="flex items-center gap-2">
                          <span className={cn("p-1 rounded", cardType?.color)}>
                            {cardType?.icon}
                          </span>
                          <CardTitle className="text-sm">{card.title}</CardTitle>
                        </div>
                        {card.subtitle && <p className="text-xs text-muted-foreground ml-8">{card.subtitle}</p>}
                      </CardHeader>
                      <CardContent>
                        <Badge variant="secondary" className="text-xs">
                          {cardType?.label} · {card.span === 1 ? "1列" : card.span === 2 ? "2列" : "3列"}
                        </Badge>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
              {cards.length === 0 && (
                <div className="py-20 text-center text-muted-foreground text-sm">
                  从左侧组件库拖拽组件开始构建页面
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Card Settings */}
        {!previewMode && selectedCardData && (
          <div className="w-64 border-l bg-sidebar">
            <div className="px-4 py-3 border-b">
              <h3 className="text-sm font-semibold text-sidebar-foreground">组件设置</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">组件标题</Label>
                <Input
                  value={selectedCardData.title}
                  onChange={(e) => updateCard(selectedCard!, { title: e.target.value })}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">副标题</Label>
                <Input
                  value={selectedCardData.subtitle || ""}
                  onChange={(e) => updateCard(selectedCard!, { subtitle: e.target.value })}
                  className="h-8 text-xs"
                  placeholder="可选"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">列宽</Label>
                <Select
                  value={String(selectedCardData.span)}
                  onValueChange={(v) => updateCard(selectedCard!, { span: Number(v) as 1 | 2 | 3 })}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 列</SelectItem>
                    <SelectItem value="2">2 列</SelectItem>
                    <SelectItem value="3">3 列</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              {selectedCardData.type === "stats" && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground">统计配置</p>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">指标</Label>
                    <Select
                      value={(selectedCardData.config.metric as string) || "count"}
                      onValueChange={(v) => updateCard(selectedCard!, { config: { ...selectedCardData.config, metric: v } })}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="count">计数</SelectItem>
                        <SelectItem value="sum">求和</SelectItem>
                        <SelectItem value="avg">平均值</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              {selectedCardData.type === "table" && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground">表格配置</p>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">数据对象</Label>
                    <Input value={selectedCardData.config.object as string || ""} className="h-8 text-xs" readOnly />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">每页条数</Label>
                    <Input
                      type="number"
                      value={selectedCardData.config.pageSize as number || 10}
                      className="h-8 text-xs"
                      onChange={(e) =>
                        updateCard(selectedCard!, { config: { ...selectedCardData.config, pageSize: parseInt(e.target.value) } })
                      }
                    />
                  </div>
                </div>
              )}
              <Button
                variant="destructive"
                size="sm"
                className="w-full gap-1.5 mt-4"
                onClick={() => removeCard(selectedCard!)}
              >
                <Trash2 className="h-3.5 w-3.5" />
                删除组件
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
