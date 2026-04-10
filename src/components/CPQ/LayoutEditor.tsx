/**
 * LayoutEditor - 布局编辑器
 * 拖拽排序 sections，配置表单布局
 */
import * as React from 'react'
import { useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronRight,
  Layout,
  Columns,
  Type,
  X,
  Check,
  Settings2,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { FormLayout, FormSection, ObjectProperty } from '@/types/customObject'
import { FieldRenderer } from './FieldRenderer'

/** 列数选项 */
const COLUMN_OPTIONS = [
  { value: '1', label: '1 列', icon: Layout },
  { value: '2', label: '2 列', icon: Columns },
  { value: '3', label: '3 列', icon: Columns },
]

/** Section 排序项 */
interface SortableSectionItem extends FormSection {
  propertyIds: string[]
}

interface SortableItemProps {
  id: string
  section: SortableSectionItem
  properties: ObjectProperty[]
  isSelected: boolean
  onSelect: () => void
  onUpdate: (updated: SortableSectionItem) => void
  onRemove: () => void
  onFieldToggle: (fieldId: string) => void
  isDragging?: boolean
  readOnly?: boolean
}

/** 可排序的 Section 项 */
const SortableSectionItem: React.FC<SortableItemProps> = ({
  id,
  section,
  properties,
  isSelected,
  onSelect,
  onUpdate,
  onRemove,
  onFieldToggle,
  isDragging,
  readOnly = false,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id, disabled: readOnly })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const [fieldsOpen, setFieldsOpen] = useState(false)

  const assignedProperties = section.propertyIds
    .map((pid) => properties.find((p) => p.id === pid))
    .filter(Boolean) as ObjectProperty[]

  const unassignedProperties = properties.filter(
    (p) => !section.propertyIds.includes(p.id) && p.enabled
  )

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'rounded-lg border bg-card transition-all',
        isSelected && 'ring-2 ring-primary',
        isDragging && 'opacity-50 shadow-lg'
      )}
    >
      {/* Section 头部 */}
      <div className="flex items-center gap-2 p-3 border-b">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
          disabled={readOnly}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </Button>

        <Input
          value={section.title ?? ''}
          onChange={(e) => onUpdate({ ...section, title: e.target.value })}
          placeholder="区块标题"
          className="flex-1 h-8"
          disabled={readOnly}
        />

        <Badge variant="secondary" className="h-6">
          {assignedProperties.length} 个字段
        </Badge>

        <div className="flex items-center gap-1">
          <Switch
            checked={section.collapsible ?? false}
            onCheckedChange={(v) =>
              onUpdate({ ...section, collapsible: v })
            }
            disabled={readOnly}
            className="scale-90"
          />
          <span className="text-xs text-muted-foreground">折叠</span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => setFieldsOpen(!fieldsOpen)}
        >
          {fieldsOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>

        {!readOnly && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            onClick={onRemove}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* 字段列表 */}
      {fieldsOpen && (
        <div className="p-3 space-y-3">
          {/* 已分配的字段 */}
          {assignedProperties.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground">
                已分配字段
              </div>
              <div className="flex flex-wrap gap-2">
                {assignedProperties.map((prop) => (
                  <Badge
                    key={prop.id}
                    variant="outline"
                    className="gap-1 cursor-pointer hover:bg-muted/50"
                    onClick={() => !readOnly && onFieldToggle(prop.id)}
                  >
                    {prop.label}
                    {!readOnly && (
                      <X className="h-3 w-3" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* 未分配的字段 */}
          {unassignedProperties.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground">
                可添加字段
              </div>
              <div className="flex flex-wrap gap-2">
                {unassignedProperties.map((prop) => (
                  <Badge
                    key={prop.id}
                    variant="secondary"
                    className="gap-1 cursor-pointer hover:bg-primary/20"
                    onClick={() => !readOnly && onFieldToggle(prop.id)}
                  >
                    <Plus className="h-3 w-3" />
                    {prop.label}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {assignedProperties.length === 0 && unassignedProperties.length === 0 && (
            <div className="text-sm text-muted-foreground text-center py-4">
              暂无可用字段
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/** 字段预览项 */
interface FieldPreviewItemProps {
  property: ObjectProperty
  readOnly?: boolean
}

const FieldPreviewItem: React.FC<FieldPreviewItemProps> = ({ property, readOnly }) => {
  const previewValue = React.useMemo(() => {
    if (property.options && property.options.length > 0) {
      return property.options[0].value
    }
    if (property.internalType === 'switch') return true
    if (property.internalType === 'number' || property.internalType === 'decimal') return 0
    if (property.internalType === 'date') return new Date().toISOString().split('T')[0]
    return ''
  }, [property])

  return (
    <div className="space-y-1.5">
      <div className="text-sm font-medium text-muted-foreground">
        {property.label}
        {property.required && <span className="text-destructive ml-0.5">*</span>}
      </div>
      <div className="w-full">
        <FieldRenderer
          property={property}
          value={previewValue}
          onChange={() => {}}
          disabled
        />
      </div>
    </div>
  )
}

export interface LayoutEditorProps {
  /** 初始布局数据 */
  initialLayout?: FormLayout
  /** 对象属性列表 */
  properties: ObjectProperty[]
  /** 只读模式 */
  readOnly?: boolean
  /** 自定义样式类名 */
  className?: string
  /** 布局变更回调 */
  onChange?: (layout: FormLayout) => void
  /** 保存回调 */
  onSave?: (layout: FormLayout) => void
  /** 取消回调 */
  onCancel?: () => void
}

/** 生成唯一 ID */
const generateId = () =>
  `section_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`

export const LayoutEditor: React.FC<LayoutEditorProps> = ({
  initialLayout,
  properties,
  readOnly = false,
  className,
  onChange,
  onSave,
  onCancel,
}) => {
  const { t } = useTranslation()

  /** 布局类型 */
  const [layoutType, setLayoutType] = useState<'single_column' | 'two_column' | 'tabs' | 'accordion'>(
    initialLayout?.type ?? 'single_column'
  )

  /** Sections */
  const [sections, setSections] = useState<SortableSectionItem[]>(() => {
    if (initialLayout?.sections) {
      return initialLayout.sections.map((s) => ({
        ...s,
        propertyIds: s.fields,
      }))
    }
    return []
  })

  /** 选中的 section */
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null)

  /** 拖拽状态 */
  const [activeId, setActiveId] = useState<string | null>(null)

  /** 添加 Section Dialog */
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [newSectionTitle, setNewSectionTitle] = useState('')

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  /** 触发变更 */
  const triggerChange = useCallback(() => {
    if (!onChange) return
    const layout: FormLayout = {
      type: layoutType,
      sections: sections.map((s, idx) => ({
        ...s,
        fields: s.propertyIds,
        sortOrder: idx,
      })),
    }
    onChange(layout)
  }, [layoutType, sections, onChange])

  /** 处理拖拽结束 */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (over && active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id)
        const newIndex = items.findIndex((i) => i.id === over.id)
        const newItems = arrayMove(items, oldIndex, newIndex)
        return newItems
      })
    }
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  /** 添加 Section */
  const addSection = () => {
    const newSection: SortableSectionItem = {
      id: generateId(),
      title: newSectionTitle || `区块 ${sections.length + 1}`,
      fields: [],
      propertyIds: [],
      collapsible: false,
      collapsed: false,
      sortOrder: sections.length,
    }
    setSections([...sections, newSection])
    setNewSectionTitle('')
    setAddDialogOpen(false)
  }

  /** 更新 Section */
  const updateSection = (index: number, updated: SortableSectionItem) => {
    const newSections = [...sections]
    newSections[index] = updated
    setSections(newSections)
  }

  /** 删除 Section */
  const removeSection = (id: string) => {
    setSections(sections.filter((s) => s.id !== id))
    if (selectedSectionId === id) {
      setSelectedSectionId(null)
    }
  }

  /** 切换字段归属 */
  const toggleFieldInSection = (sectionId: string, fieldId: string) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id !== sectionId) return section
        if (section.propertyIds.includes(fieldId)) {
          return {
            ...section,
            propertyIds: section.propertyIds.filter((id) => id !== fieldId),
          }
        } else {
          return {
            ...section,
            propertyIds: [...section.propertyIds, fieldId],
          }
        }
      })
    )
  }

  /** 构建完整布局 */
  const buildLayout = (): FormLayout => ({
    type: layoutType,
    sections: sections.map((s, idx) => ({
      ...s,
      fields: s.propertyIds,
      sortOrder: idx,
    })),
  })

  const handleSave = () => {
    const layout = buildLayout()
    onSave?.(layout)
  }

  /** 预览模式下的布局 */
  const selectedSection = sections.find((s) => s.id === selectedSectionId)
  const previewProperties = selectedSection
    ? selectedSection.propertyIds
        .map((pid) => properties.find((p) => p.id === pid))
        .filter(Boolean) as ObjectProperty[]
    : []

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* 工具栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">布局类型：</span>
          <Select
            value={layoutType}
            onValueChange={(v) => {
              setLayoutType(v as typeof layoutType)
            }}
            disabled={readOnly}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single_column">单列布局</SelectItem>
              <SelectItem value="two_column">双列布局</SelectItem>
              <SelectItem value="tabs">标签页布局</SelectItem>
              <SelectItem value="accordion">手风琴布局</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {sections.length} 个区块
          </span>
          {!readOnly && (
            <Button size="sm" onClick={() => setAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              添加区块
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* 左侧：Section 列表 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            <span className="text-sm font-medium">布局区块</span>
          </div>

          <ScrollArea className="h-[400px] pr-3">
            {sections.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Layout className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">暂无区块</p>
                <p className="text-xs mt-1">点击上方按钮添加区块</p>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={sections.map((s) => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {sections.map((section, index) => (
                      <SortableSectionItem
                        key={section.id}
                        id={section.id}
                        section={section}
                        properties={properties}
                        isSelected={selectedSectionId === section.id}
                        onSelect={() =>
                          setSelectedSectionId(
                            selectedSectionId === section.id ? null : section.id
                          )
                        }
                        onUpdate={(updated) => updateSection(index, updated)}
                        onRemove={() => removeSection(section.id)}
                        onFieldToggle={(fieldId) =>
                          toggleFieldInSection(section.id, fieldId)
                        }
                        isDragging={activeId === section.id}
                        readOnly={readOnly}
                      />
                    ))}
                  </div>
                </SortableContext>

                <DragOverlay>
                  {activeId ? (
                    <div className="rounded-lg border bg-card p-3 shadow-lg opacity-80">
                      <span className="text-sm font-medium">
                        {sections.find((s) => s.id === activeId)?.title}
                      </span>
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            )}
          </ScrollArea>
        </div>

        {/* 右侧：预览 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            <span className="text-sm font-medium">
              {selectedSection ? `${selectedSection.title || '未命名'} - 预览` : '选择区块预览'}
            </span>
          </div>

          <div className="rounded-lg border bg-muted/30 p-4 min-h-[400px]">
            {selectedSection && previewProperties.length > 0 ? (
              <div
                className={cn(
                  'space-y-4',
                  layoutType === 'two_column' && 'grid grid-cols-2 gap-4'
                )}
              >
                {previewProperties.map((prop) => (
                  <FieldPreviewItem
                    key={prop.id}
                    property={{
                      ...prop,
                      placeholder: prop.placeholder || `请输入${prop.label}`,
                    }}
                    readOnly
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Settings2 className="h-8 w-8 mb-2 opacity-50" />
                <p className="text-sm">
                  {sections.length === 0
                    ? '添加区块后可在右侧预览'
                    : '点击左侧选择一个区块查看预览'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      {!readOnly && (
        <div className="flex items-center justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onCancel}>
            取消
          </Button>
          <Button onClick={handleSave}>
            <Check className="h-4 w-4 mr-1" />
            保存布局
          </Button>
        </div>
      )}

      {/* 添加区块 Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>添加布局区块</DialogTitle>
            <DialogDescription>
              为表单添加一个新的区块，用于分组展示字段
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">区块标题</label>
              <Input
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
                placeholder={`区块 ${sections.length + 1}`}
                onKeyDown={(e) => e.key === 'Enter' && addSection()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={addSection}>
              <Plus className="h-4 w-4 mr-1" />
              添加
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default LayoutEditor
