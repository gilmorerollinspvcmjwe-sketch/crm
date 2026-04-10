/**
 * RecordTable - 记录数据表格
 * 动态列生成、行选择、排序筛选、分页
 */
import * as React from 'react'
import { useState, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
  Edit2,
  Trash2,
  Eye,
  CheckSquare,
  Square,
  AlertCircle,
  Inbox,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ObjectProperty, ObjectRecord } from '@/types/customObject'
import { FieldRenderer } from './FieldRenderer'

/** 排序方向 */
type SortDirection = 'asc' | 'desc' | null

/** 列配置 */
interface ColumnConfig {
  property: ObjectProperty
  width?: number
  sortable?: boolean
  filterable?: boolean
}

/** 筛选条件 */
interface FilterCondition {
  propertyId: string
  operator: 'equals' | 'contains' | 'starts_with' | 'ends_with' | 'greater_than' | 'less_than' | 'between' | 'is_empty' | 'is_not_empty'
  value: unknown
  secondValue?: unknown // 用于 between
}

/** 分页配置 */
interface PaginationState {
  page: number
  pageSize: number
  total: number
}

export interface RecordTableProps {
  /** 对象属性定义（用于生成列） */
  properties: ObjectProperty[]
  /** 记录数据 */
  records: ObjectRecord[]
  /** 总记录数 */
  total?: number
  /** 加载状态 */
  loading?: boolean
  /** 选择模式 */
  selectionMode?: 'none' | 'single' | 'multiple'
  /** 初始选中的记录 ID */
  selectedIds?: string[]
  /** 行选择变更回调 */
  onSelectionChange?: (ids: string[]) => void
  /** 行点击回调 */
  onRowClick?: (record: ObjectRecord) => void
  /** 查看回调 */
  onView?: (record: ObjectRecord) => void
  /** 编辑回调 */
  onEdit?: (record: ObjectRecord) => void
  /** 删除回调 */
  onDelete?: (record: ObjectRecord) => void
  /** 内联编辑回调 */
  onInlineEdit?: (recordId: string, propertyId: string, value: unknown) => void
  /** 分页变更回调 */
  onPageChange?: (page: number, pageSize: number) => void
  /** 排序变更回调 */
  onSort?: (propertyId: string, direction: SortDirection) => void
  /** 筛选变更回调 */
  onFilter?: (filters: FilterCondition[]) => void
  /** 搜索回调 */
  onSearch?: (query: string) => void
  /** 自定义样式类名 */
  className?: string
  /** 空状态文案 */
  emptyText?: string
  /** 是否显示搜索框 */
  showSearch?: boolean
  /** 是否显示筛选器 */
  showFilters?: boolean
  /** 是否显示分页 */
  showPagination?: boolean
  /** 初始排序 */
  initialSort?: { propertyId: string; direction: SortDirection }
}

/** 空状态组件 */
const EmptyState: React.FC<{ text?: string; onAction?: () => void }> = ({
  text = '暂无数据',
  onAction,
}) => (
  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
    <Inbox className="h-12 w-12 mb-4 opacity-50" />
    <p className="text-sm font-medium">{text}</p>
    {onAction && (
      <Button variant="link" onClick={onAction} className="mt-2">
        刷新试试
      </Button>
    )}
  </div>
)

/** 加载骨架屏 */
const LoadingSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 4,
}) => (
  <>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <tr key={rowIndex} className="animate-pulse">
        <td className="w-10 px-3">
          <div className="h-4 w-4 bg-muted-foreground/20 rounded" />
        </td>
        {Array.from({ length: columns }).map((_, colIndex) => (
          <td key={colIndex} className="px-3">
            <div className="h-5 w-full bg-muted-foreground/20 rounded" />
          </td>
        ))}
        <td className="w-10 px-3">
          <div className="h-5 w-5 bg-muted-foreground/20 rounded" />
        </td>
      </tr>
    ))}
  </>
)

/** 单元格内容渲染 */
interface CellContentProps {
  property: ObjectProperty
  value: unknown
  onInlineEdit?: (value: unknown) => void
  disabled?: boolean
}

const CellContent: React.FC<CellContentProps> = ({
  property,
  value,
  onInlineEdit,
  disabled,
}) => {
  const [editing, setEditing] = useState(false)
  const [localValue, setLocalValue] = useState(value)

  React.useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleSave = () => {
    onInlineEdit?.(localValue)
    setEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      setLocalValue(value)
      setEditing(false)
    }
  }

  // 只读或禁用内联编辑时直接渲染预览
  if (!property.bulkEditable || disabled) {
    return (
      <FieldRenderer
        property={property}
        value={value}
        onChange={() => {}}
        disabled
      />
    )
  }

  if (editing) {
    return (
      <FieldRenderer
        property={property}
        value={localValue}
        onChange={(v) => setLocalValue(v)}
        className="min-w-[100px]"
      />
    )
  }

  return (
    <div
      className="group relative cursor-pointer hover:bg-muted/50 rounded px-1 -mx-1 py-0.5 transition-colors"
      onClick={() => setEditing(true)}
      title="点击编辑"
    >
      <FieldRenderer
        property={property}
        value={value}
        onChange={() => {}}
        disabled
      />
      <Edit2 className="absolute right-1 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100" />
    </div>
  )
}

/** 排序图标 */
const SortIcon: React.FC<{ direction: SortDirection }> = ({ direction }) => {
  if (!direction) {
    return <ChevronsUpDown className="h-4 w-4 text-muted-foreground/30" />
  }
  return direction === 'asc' ? (
    <ChevronUp className="h-4 w-4 text-primary" />
  ) : (
    <ChevronDown className="h-4 w-4 text-primary" />
  )
}

export const RecordTable: React.FC<RecordTableProps> = ({
  properties,
  records,
  total = 0,
  loading = false,
  selectionMode = 'multiple',
  selectedIds: initialSelectedIds = [],
  onSelectionChange,
  onRowClick,
  onView,
  onEdit,
  onDelete,
  onInlineEdit,
  onPageChange,
  onSort,
  onFilter,
  onSearch,
  className,
  emptyText = '暂无记录',
  showSearch = true,
  showFilters = true,
  showPagination = true,
  initialSort,
}) => {
  const { t } = useTranslation()

  /** 可见列（从属性中筛选 listVisible 的） */
  const visibleProperties = useMemo(
    () => properties.filter((p) => p.listVisible && p.enabled),
    [properties]
  )

  /** 列配置 */
  const columns = useMemo(
    (): ColumnConfig[] =>
      visibleProperties.map((p) => ({
        property: p,
        sortable: p.sortable,
        filterable: p.searchable,
      })),
    [visibleProperties]
  )

  /** 选中的记录 ID */
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(initialSelectedIds))

  /** 当前页和页大小 */
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 20,
    total,
  })

  /** 排序状态 */
  const [sort, setSort] = useState<{
    propertyId: string
    direction: SortDirection
  } | null>(initialSort ? { propertyId: initialSort.propertyId, direction: initialSort.direction } : null)

  /** 筛选条件 */
  const [filters, setFilters] = useState<FilterCondition[]>([])

  /** 搜索词 */
  const [searchQuery, setSearchQuery] = useState('')

  /** 处理全选 */
  const handleSelectAll = useCallback(() => {
    if (selectedIds.size === records.length) {
      setSelectedIds(new Set())
      onSelectionChange?.([])
    } else {
      const allIds = records.map((r) => r.id)
      setSelectedIds(new Set(allIds))
      onSelectionChange?.(allIds)
    }
  }, [selectedIds, records, onSelectionChange])

  /** 处理单行选择 */
  const handleSelectOne = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      onSelectionChange?.(Array.from(next))
      return next
    })
  }, [onSelectionChange])

  /** 处理排序 */
  const handleSort = useCallback((propertyId: string) => {
    setSort((prev) => {
      let newDirection: SortDirection = 'asc'
      if (prev?.propertyId === propertyId) {
        if (prev.direction === 'asc') newDirection = 'desc'
        else if (prev.direction === 'desc') newDirection = null
      }
      const newSort = newDirection ? { propertyId, direction: newDirection } : null
      onSort?.(propertyId, newDirection)
      return newSort
    })
  }, [onSort])

  /** 处理搜索 */
  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query)
      onSearch?.(query)
    },
    [onSearch]
  )

  /** 处理分页变更 */
  const handlePageChange = useCallback(
    (newPage: number, newPageSize?: number) => {
      const actualPageSize = newPageSize ?? pagination.pageSize
      setPagination((prev) => ({ ...prev, page: newPage, pageSize: actualPageSize }))
      onPageChange?.(newPage, actualPageSize)
    },
    [pagination.pageSize, onPageChange]
  )

  /** 总页数 */
  const totalPages = Math.ceil(pagination.total / pagination.pageSize) || 1

  /** 复选框状态 */
  const isAllSelected = records.length > 0 && selectedIds.size === records.length
  const isIndeterminate = selectedIds.size > 0 && selectedIds.size < records.length

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* 工具栏 */}
      {(showSearch || showFilters) && (
        <div className="flex items-center gap-3">
          {showSearch && (
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="搜索..."
                className="pl-9"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => handleSearch('')}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          )}

          {showFilters && filters.length > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <AlertCircle className="h-3 w-3" />
                {filters.length} 个筛选
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="h-6"
                onClick={() => {
                  setFilters([])
                  onFilter?.([])
                }}
              >
                清除
              </Button>
            </div>
          )}

          <div className="flex-1" />

          {/* 已选数量 */}
          {selectionMode !== 'none' && selectedIds.size > 0 && (
            <Badge variant="outline">
              已选择 {selectedIds.size} 项
            </Badge>
          )}
        </div>
      )}

      {/* 表格 */}
      <div className="rounded-lg border bg-card">
        <ScrollArea className="w-full">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                {/* 复选框列 */}
                {selectionMode !== 'none' && (
                  <th className="w-10 px-3 py-3">
                    <Checkbox
                      checked={isIndeterminate ? 'indeterminate' : isAllSelected}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                )}

                {/* 数据列 */}
                {columns.map((col) => (
                  <th
                    key={col.property.id}
                    className={cn(
                      'px-3 py-3 text-left text-sm font-medium text-muted-foreground',
                      col.sortable && 'cursor-pointer select-none hover:bg-muted/80'
                    )}
                    onClick={() => col.sortable && handleSort(col.property.id)}
                  >
                    <div className="flex items-center gap-1">
                      <span>{col.property.label}</span>
                      {col.sortable && (
                        <SortIcon
                          direction={
                            sort?.propertyId === col.property.id
                              ? sort.direction
                              : null
                          }
                        />
                      )}
                    </div>
                  </th>
                ))}

                {/* 操作列 */}
                {(onView || onEdit || onDelete) && (
                  <th className="w-10 px-3 py-3 text-right">
                    <span className="sr-only">操作</span>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <LoadingSkeleton rows={5} columns={Math.min(columns.length, 5)} />
              ) : records.length === 0 ? (
                <tr>
                  <td
                    colSpan={
                      columns.length +
                      (selectionMode !== 'none' ? 1 : 0) +
                      (onView || onEdit || onDelete ? 1 : 0)
                    }
                  >
                    <EmptyState text={emptyText} />
                  </td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr
                    key={record.id}
                    data-state={
                      selectedIds.has(record.id) ? 'selected' : undefined
                    }
                    className={cn(
                      'border-b transition-colors',
                      selectedIds.has(record.id) && 'bg-primary/5',
                      onRowClick && 'cursor-pointer hover:bg-muted/30'
                    )}
                    onClick={() => onRowClick?.(record)}
                  >
                    {/* 复选框 */}
                    {selectionMode !== 'none' && (
                      <td
                        className="w-10 px-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          checked={selectedIds.has(record.id)}
                          onCheckedChange={() => handleSelectOne(record.id)}
                        />
                      </td>
                    )}

                    {/* 数据单元格 */}
                    {columns.map((col) => (
                      <td key={col.property.id} className="px-3 py-2">
                        <CellContent
                          property={col.property}
                          value={record.data[col.property.name]}
                          onInlineEdit={
                            onInlineEdit
                              ? (value) =>
                                  onInlineEdit?.(
                                    record.id,
                                    col.property.id,
                                    value
                                  )
                              : undefined
                          }
                          disabled={loading}
                        />
                      </td>
                    ))}

                    {/* 操作菜单 */}
                    {(onView || onEdit || onDelete) && (
                      <td
                        className="w-10 px-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {onView && (
                              <DropdownMenuItem onClick={() => onView(record)}>
                                <Eye className="h-4 w-4 mr-2" />
                                查看
                              </DropdownMenuItem>
                            )}
                            {onEdit && (
                              <DropdownMenuItem onClick={() => onEdit(record)}>
                                <Edit2 className="h-4 w-4 mr-2" />
                                编辑
                              </DropdownMenuItem>
                            )}
                            {onDelete && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => onDelete(record)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  删除
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </ScrollArea>

        {/* 分页 */}
        {showPagination && !loading && records.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>共 {pagination.total} 条记录</span>
              <Select
                value={String(pagination.pageSize)}
                onValueChange={(v) =>
                  handlePageChange(1, Number(v))
                }
              >
                <SelectTrigger className="h-8 w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 条/页</SelectItem>
                  <SelectItem value="20">20 条/页</SelectItem>
                  <SelectItem value="50">50 条/页</SelectItem>
                  <SelectItem value="100">100 条/页</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handlePageChange(1)}
                disabled={pagination.page <= 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <span className="px-3 text-sm">
                第{' '}
                <Input
                  value={String(pagination.page)}
                  onChange={(e) => {
                    const page = parseInt(e.target.value, 10)
                    if (!isNaN(page) && page >= 1 && page <= totalPages) {
                      handlePageChange(page)
                    }
                  }}
                  className="inline-flex h-8 w-12 text-center"
                />
                / {totalPages} 页
              </span>

              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handlePageChange(totalPages)}
                disabled={pagination.page >= totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RecordTable
