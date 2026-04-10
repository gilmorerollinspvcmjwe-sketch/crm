/**
 * ObjectCard - 自定义对象卡片
 * 展示自定义对象的概览信息
 */
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import {
  Database,
  Edit2,
  Trash2,
  Eye,
  MoreHorizontal,
  ToggleLeft,
  ToggleRight,
  Settings,
  Copy,
  BarChart3,
  Table,
  FileText,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { CustomObject } from '@/types/customObject'

export interface ObjectCardProps {
  /** 对象数据 */
  object: CustomObject
  /** 字段数量 */
  fieldCount?: number
  /** 记录数量 */
  recordCount?: number
  /** 点击查看回调 */
  onView?: (object: CustomObject) => void
  /** 编辑回调 */
  onEdit?: (object: CustomObject) => void
  /** 删除回调 */
  onDelete?: (object: CustomObject) => void
  /** 更多操作回调 */
  onMore?: (action: string, object: CustomObject) => void
  /** 自定义样式类名 */
  className?: string
  /** 字段数量加载状态 */
  loadingFieldCount?: boolean
  /** 记录数量加载状态 */
  loadingRecordCount?: boolean
}

/** 默认图标映射 */
const DEFAULT_ICONS = ['Database', 'FileText', 'Box', 'Layers', 'Grid', 'List', 'Building', 'Users']

/** 获取对象图标 */
const getObjectIcon = (iconName?: string): React.ElementType => {
  switch (iconName) {
    case 'Database':
      return Database
    case 'FileText':
      return Database
    case 'Box':
      return Database
    case 'Layers':
      return Database
    case 'Grid':
      return Database
    case 'List':
      return Database
    case 'Building':
      return Database
    case 'Users':
      return Database
    default:
      return Database
  }
}

/** 解析颜色字符串 */
const parseColor = (colorStr?: string): { bg: string; text: string; border: string } => {
  const defaultColors = {
    bg: 'bg-blue-100',
    text: 'text-blue-600',
    border: 'border-blue-200',
  }

  if (!colorStr) return defaultColors

  // 检查是否是预设颜色名称
  const presetColors: Record<string, { bg: string; text: string; border: string }> = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
    green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
    red: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' },
    yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-200' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
    pink: { bg: 'bg-pink-100', text: 'text-pink-600', border: 'border-pink-200' },
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-200' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' },
    teal: { bg: 'bg-teal-100', text: 'text-teal-600', border: 'border-teal-200' },
    cyan: { bg: 'bg-cyan-100', text: 'text-cyan-600', border: 'border-cyan-200' },
    gray: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' },
  }

  // 检查是否是 # 开头的颜色
  if (colorStr.startsWith('#')) {
    // 生成一个基于颜色的简化版本
    const hex = colorStr.slice(1)
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return {
      bg: brightness > 128 ? 'bg-blue-50' : 'bg-blue-100',
      text: colorStr,
      border: colorStr + '40',
    }
  }

  return presetColors[colorStr.toLowerCase()] || defaultColors
}

/** 格式化数字显示 */
const formatCount = (count?: number): string => {
  if (count === undefined || count === null) return '-'
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return count.toString()
}

/** 统计卡片子组件 */
interface StatItemProps {
  icon: React.ElementType
  label: string
  value?: number | string
  loading?: boolean
}

const StatItem: React.FC<StatItemProps> = ({ icon: Icon, label, value, loading }) => (
  <div className="flex items-center gap-1.5">
    <Icon className="h-3.5 w-3.5 text-muted-foreground" />
    <span className="text-xs text-muted-foreground">{label}:</span>
    {loading ? (
      <span className="h-3.5 w-8 bg-muted-foreground/20 animate-pulse rounded" />
    ) : (
      <span className="text-xs font-medium">{value ?? '-'}</span>
    )}
  </div>
)

export const ObjectCard: React.FC<ObjectCardProps> = ({
  object,
  fieldCount,
  recordCount,
  onView,
  onEdit,
  onDelete,
  onMore,
  className,
  loadingFieldCount = false,
  loadingRecordCount = false,
}) => {
  const { t } = useTranslation()

  const Icon = getObjectIcon(object.icon)
  const colors = parseColor(object.iconColor)

  const handleView = () => onView?.(object)
  const handleEdit = () => onEdit?.(object)
  const handleDelete = () => onDelete?.(object)
  const handleMore = (action: string) => onMore?.(action, object)

  return (
    <Card
      className={cn(
        'group relative transition-all hover:shadow-md hover:border-primary/50',
        !object.enabled && 'opacity-60',
        className
      )}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-3">
          {/* 左侧：图标和信息 */}
          <div className="flex items-start gap-3 min-w-0">
            {/* 对象图标 */}
            <div
              className={cn(
                'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center border',
                colors.bg,
                colors.text,
                colors.border
              )}
            >
              <Icon className="h-5 w-5" />
            </div>

            {/* 对象名称和标签 */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-sm truncate">
                  {object.singularName}
                </h3>
                {!object.enabled && (
                  <Badge variant="secondary" className="text-xs">
                    已禁用
                  </Badge>
                )}
                {object.isSystem && (
                  <Badge variant="outline" className="text-xs">
                    系统
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {object.pluralName}
              </p>
            </div>
          </div>

          {/* 右侧：更多菜单 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleView}>
                <Eye className="h-4 w-4 mr-2" />
                查看详情
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleEdit}>
                <Edit2 className="h-4 w-4 mr-2" />
                编辑对象
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleMore('duplicate')}>
                <Copy className="h-4 w-4 mr-2" />
                复制对象
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleMore('analytics')}>
                <BarChart3 className="h-4 w-4 mr-2" />
                数据分析
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleMore('settings')}>
                <Settings className="h-4 w-4 mr-2" />
                对象设置
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                删除对象
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-2">
        {/* 描述 */}
        {object.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {object.description}
          </p>
        )}

        {/* 统计信息 */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <StatItem
            icon={Table}
            label="字段"
            value={formatCount(fieldCount)}
            loading={loadingFieldCount}
          />
          <StatItem
            icon={FileText}
            label="记录"
            value={formatCount(recordCount)}
            loading={loadingRecordCount}
          />
          <StatItem
            icon={object.enabled ? ToggleRight : ToggleLeft}
            label="状态"
            value={object.enabled ? '启用' : '禁用'}
          />
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={handleView}
        >
          <Eye className="h-4 w-4 mr-1" />
          查看
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={handleEdit}
        >
          <Edit2 className="h-4 w-4 mr-1" />
          编辑
        </Button>
      </CardFooter>
    </Card>
  )
}

/** 对象卡片网格组件 */
export interface ObjectCardGridProps {
  objects: CustomObject[]
  fieldCounts?: Record<string, number>
  recordCounts?: Record<string, number>
  loading?: boolean
  onView?: (object: CustomObject) => void
  onEdit?: (object: CustomObject) => void
  onDelete?: (object: CustomObject) => void
  onAdd?: () => void
  className?: string
}

export const ObjectCardGrid: React.FC<ObjectCardGridProps> = ({
  objects,
  fieldCounts = {},
  recordCounts = {},
  loading = false,
  onView,
  onEdit,
  onDelete,
  onAdd,
  className,
}) => {
  if (loading) {
    return (
      <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4', className)}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted-foreground/20" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-24 bg-muted-foreground/20 rounded" />
                  <div className="h-3 w-32 bg-muted-foreground/10 rounded" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="space-y-2">
                <div className="h-3 w-full bg-muted-foreground/10 rounded" />
                <div className="h-3 w-3/4 bg-muted-foreground/10 rounded" />
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 gap-2">
              <div className="h-8 flex-1 bg-muted-foreground/10 rounded" />
              <div className="h-8 flex-1 bg-muted-foreground/10 rounded" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (objects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <Database className="h-12 w-12 mb-4 opacity-50" />
        <p className="text-sm font-medium">暂无自定义对象</p>
        <p className="text-xs mt-1 mb-4">创建您的第一个自定义对象来管理业务数据</p>
        {onAdd && (
          <Button onClick={onAdd}>
            <Plus className="h-4 w-4 mr-1" />
            创建对象
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4', className)}>
      {objects.map((object) => (
        <ObjectCard
          key={object.id}
          object={object}
          fieldCount={fieldCounts[object.id]}
          recordCount={recordCounts[object.id]}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

/** Plus 图标用于添加按钮 */
const Plus = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

export default ObjectCard
