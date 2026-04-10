'use client'

import * as React from 'react'
import { useState } from 'react'
import {
  X,
  Plus,
  Trash2,
  GripVertical,
  BarChart3,
  Table2,
  LayoutList,
  Calendar,
  Newspaper,
  Target,
  PieChart,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DashletConfig, DashletType } from '@/components/Dashlets'

// ============================================================
// Dashlet Templates
// ============================================================
interface DashletTemplate {
  type: DashletType
  label: string
  description: string
  icon: React.ReactNode
  defaultSize: { w: number; h: number }
}

const DASHLET_TEMPLATES: DashletTemplate[] = [
  {
    type: DashletType.KPI,
    label: 'KPI 指标',
    description: '展示关键绩效指标，如营收、客户数等',
    icon: <Target className="h-6 w-6" />,
    defaultSize: { w: 3, h: 1 },
  },
  {
    type: DashletType.CHART,
    label: '图表',
    description: '支持折线图、柱状图、饼图等',
    icon: <BarChart3 className="h-6 w-6" />,
    defaultSize: { w: 6, h: 2 },
  },
  {
    type: DashletType.TABLE,
    label: '数据表格',
    description: '展示结构化数据，支持排序分页',
    icon: <Table2 className="h-6 w-6" />,
    defaultSize: { w: 8, h: 2 },
  },
  {
    type: DashletType.LIST,
    label: '列表',
    description: '展示动态列表，如最新动态、最近活动',
    icon: <LayoutList className="h-6 w-6" />,
    defaultSize: { w: 4, h: 2 },
  },
  {
    type: DashletType.CALENDAR,
    label: '日历',
    description: '展示日程安排，支持月/周视图',
    icon: <Calendar className="h-6 w-6" />,
    defaultSize: { w: 6, h: 2 },
  },
  {
    type: DashletType.NEWS,
    label: '新闻/公告',
    description: '展示系统公告和通知',
    icon: <Newspaper className="h-6 w-6" />,
    defaultSize: { w: 6, h: 2 },
  },
]

// ============================================================
// Chart Type Options
// ============================================================
const CHART_TYPES = [
  { value: 'line', label: '折线图' },
  { value: 'bar', label: '柱状图' },
  { value: 'pie', label: '饼图' },
  { value: 'area', label: '面积图' },
  { value: 'column', label: '柱状图(垂直)' },
]

// ============================================================
// Size Presets
// ============================================================
const SIZE_PRESETS = [
  { label: '1x1', w: 1, h: 1 },
  { label: '2x1', w: 2, h: 1 },
  { label: '3x1', w: 3, h: 1 },
  { label: '4x1', w: 4, h: 1 },
  { label: '6x2', w: 6, h: 2 },
  { label: '8x2', w: 8, h: 2 },
  { label: '12x2', w: 12, h: 2 },
  { label: '6x3', w: 6, h: 3 },
  { label: '12x3', w: 12, h: 3 },
]

// ============================================================
// Dashboard Editor Component
// ============================================================
interface DashboardEditorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  dashlets: DashletConfig[]
  onSave: (dashlets: DashletConfig[]) => void
}

export function DashboardEditor({
  open,
  onOpenChange,
  dashlets,
  onSave,
}: DashboardEditorProps) {
  const [activeTab, setActiveTab] = useState<'add' | 'manage'>('add')
  const [localDashlets, setLocalDashlets] = useState<DashletConfig[]>(dashlets)
  const [selectedTemplate, setSelectedTemplate] = useState<DashletTemplate | null>(null)
  const [editingDashlet, setEditingDashlet] = useState<DashletConfig | null>(null)
  const [showConfigDialog, setShowConfigDialog] = useState(false)

  // Form state for new/edit dashlet
  const [formTitle, setFormTitle] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formWidth, setFormWidth] = useState(6)
  const [formHeight, setFormHeight] = useState(2)
  const [formChartType, setFormChartType] = useState('line')

  React.useEffect(() => {
    setLocalDashlets(dashlets)
  }, [dashlets])

  const handleSelectTemplate = (template: DashletTemplate) => {
    setSelectedTemplate(template)
    setFormTitle(template.label)
    setFormDescription(template.description)
    setFormWidth(template.defaultSize.w)
    setFormHeight(template.defaultSize.h)
    if (template.type === DashletType.CHART) {
      setFormChartType('line')
    }
    setShowConfigDialog(true)
  }

  const handleEditDashlet = (dashlet: DashletConfig) => {
    setEditingDashlet(dashlet)
    setFormTitle(dashlet.title)
    setFormDescription(dashlet.description || '')
    setFormWidth(dashlet.gridPosition.w)
    setFormHeight(dashlet.gridPosition.h)
    if (dashlet.type === DashletType.CHART) {
      setFormChartType(dashlet.config?.chartType || 'line')
    }
    setShowConfigDialog(true)
  }

  const handleSaveConfig = () => {
    const gridPosition = {
      x: 0,
      y: Math.max(...localDashlets.map(d => d.gridPosition.y + d.gridPosition.h), 0),
      w: formWidth,
      h: formHeight,
    }

    const config: Record<string, any> = {}
    if (selectedTemplate?.type === DashletType.CHART) {
      config.chartType = formChartType
    }

    if (editingDashlet) {
      // Update existing dashlet
      setLocalDashlets(prev =>
        prev.map(d =>
          d.id === editingDashlet.id
            ? {
                ...d,
                title: formTitle,
                description: formDescription,
                gridPosition,
                config,
              }
            : d
        )
      )
    } else {
      // Add new dashlet
      const newDashlet: DashletConfig = {
        id: `dashlet-${Date.now()}`,
        type: selectedTemplate!.type,
        title: formTitle,
        description: formDescription,
        gridPosition,
        config,
      }
      setLocalDashlets(prev => [...prev, newDashlet])
    }

    setShowConfigDialog(false)
    setSelectedTemplate(null)
    setEditingDashlet(null)
  }

  const handleRemoveDashlet = (id: string) => {
    setLocalDashlets(prev => prev.filter(d => d.id !== id))
  }

  const handleSave = () => {
    onSave(localDashlets)
    onOpenChange(false)
  }

  const getDashletIcon = (type: DashletType) => {
    const template = DASHLET_TEMPLATES.find(t => t.type === type)
    return template?.icon || <BarChart3 className="h-6 w-6" />
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>仪表板编辑器</DialogTitle>
            <DialogDescription>
              添加、移除或调整仪表板组件
            </DialogDescription>
          </DialogHeader>

          {/* Tabs */}
          <div className="flex items-center gap-4 border-b pb-3">
            <Button
              variant={activeTab === 'add' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('add')}
            >
              <Plus className="h-4 w-4 mr-1" />
              添加组件
            </Button>
            <Button
              variant={activeTab === 'manage' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('manage')}
            >
              <LayoutList className="h-4 w-4 mr-1" />
              管理组件 ({localDashlets.length})
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto py-4">
            {activeTab === 'add' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {DASHLET_TEMPLATES.map((template) => (
                  <Card
                    key={template.type}
                    className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
                    onClick={() => handleSelectTemplate(template)}
                  >
                    <CardHeader className="flex flex-row items-center gap-3 pb-2">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        {template.icon}
                      </div>
                      <div>
                        <CardTitle className="text-sm">{template.label}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-xs">
                        {template.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {localDashlets.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    暂无组件，点击「添加组件」开始
                  </div>
                ) : (
                  localDashlets.map((dashlet, index) => (
                    <Card key={dashlet.id}>
                      <CardContent className="flex items-center gap-4 py-3">
                        <div className="cursor-grab p-1 hover:bg-accent rounded">
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground w-6">
                              #{index + 1}
                            </span>
                            <span className="font-medium">{dashlet.title}</span>
                            <span className="text-xs text-muted-foreground">
                              {dashlet.gridPosition.w}×{dashlet.gridPosition.h}
                            </span>
                          </div>
                          {dashlet.description && (
                            <p className="text-xs text-muted-foreground truncate">
                              {dashlet.description}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditDashlet(dashlet)}
                        >
                          编辑
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleRemoveDashlet(dashlet.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button onClick={handleSave}>
              保存更改 ({localDashlets.length} 个组件)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Config Dialog */}
      <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingDashlet ? '编辑组件' : '配置组件'}
            </DialogTitle>
            <DialogDescription>
              设置组件的显示标题和尺寸
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">标题</Label>
              <Input
                id="title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="组件标题"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">描述（可选）</Label>
              <Input
                id="description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="简短描述"
              />
            </div>

            {selectedTemplate?.type === DashletType.CHART && (
              <div className="space-y-2">
                <Label htmlFor="chartType">图表类型</Label>
                <Select value={formChartType} onValueChange={setFormChartType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CHART_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label>尺寸</Label>
              <div className="flex flex-wrap gap-2">
                {SIZE_PRESETS.map((preset) => (
                  <Button
                    key={preset.label}
                    variant={
                      formWidth === preset.w && formHeight === preset.h
                        ? 'default'
                        : 'outline'
                    }
                    size="sm"
                    onClick={() => {
                      setFormWidth(preset.w)
                      setFormHeight(preset.h)
                    }}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>
                当前: {formWidth} × {formHeight} (宽 × 高)
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">宽度</Label>
                  <Slider
                    value={[formWidth]}
                    onValueChange={([v]) => setFormWidth(v)}
                    min={1}
                    max={12}
                    step={1}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">高度</Label>
                  <Slider
                    value={[formHeight]}
                    onValueChange={([v]) => setFormHeight(v)}
                    min={1}
                    max={4}
                    step={1}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfigDialog(false)}>
              取消
            </Button>
            <Button onClick={handleSaveConfig}>
              {editingDashlet ? '保存' : '添加'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default DashboardEditor
