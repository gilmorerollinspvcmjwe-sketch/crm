import * as React from 'react'
import { Search, Minus, Plus, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { DataTableToolbarProps, DensitySize } from './types'

const densityLabels: Record<DensitySize, string> = {
  compact: '紧凑',
  default: '默认',
  comfortable: '宽松',
}

export function DataTableToolbar<TData>({
  table,
  showSearch = true,
  searchPlaceholder = '搜索...',
  showDensityToggle = true,
  density = 'default',
  onDensityChange,
  showBatchActions = false,
  batchActions,
  renderToolbar,
}: DataTableToolbarProps<TData>) {
  const [searchValue, setSearchValue] = React.useState('')

  const handleSearch = (value: string) => {
    setSearchValue(value)
    table.setGlobalFilter(value)
  }

  const densities: DensitySize[] = ['compact', 'default', 'comfortable']
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const hasSelection = selectedRows.length > 0

  return (
    <div className="mb-4 space-y-3">
      {showBatchActions && hasSelection && (
        <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card px-4 py-3 shadow-[var(--shadow-sm)] lg:flex-row lg:items-center">
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">批量操作</p>
            <p className="mt-1 text-sm font-medium text-foreground">
              已选择 {selectedRows.length} 项
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 lg:ml-auto">
            {batchActions?.map((action, idx) => (
              <Button
                key={idx}
                size="sm"
                variant={action.variant || 'default'}
                onClick={() => action.onClick(selectedRows.map(r => r.original))}
                className="h-8 text-xs"
              >
                {action.icon && <span className="mr-1">{action.icon}</span>}
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card px-4 py-3 shadow-[var(--shadow-sm)] lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 lg:flex-row lg:items-center">
          {showSearch && (
            <div className="relative min-w-0 lg:w-[320px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
                className="h-10 w-full rounded-2xl border-border/70 bg-background pl-10 shadow-none"
              />
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2">
            {renderToolbar?.()}
          </div>
        </div>

        {showDensityToggle && (
          <div className="flex items-center overflow-hidden rounded-2xl border border-border/70 bg-muted/40">
            {densities.map((d) => (
              <Button
                key={d}
                variant="ghost"
                size="sm"
                className={cn(
                  'h-9 rounded-none px-3 text-xs font-normal',
                  density === d && 'bg-card text-foreground font-medium shadow-[var(--shadow-sm)]'
                )}
                onClick={() => onDensityChange?.(d)}
              >
                {d === 'compact' && <Minus className="h-3 w-3 mr-1" />}
                {d === 'comfortable' && <Plus className="h-3 w-3 mr-1" />}
                {density === d && <Check className="h-3 w-3 mr-1" />}
                {densityLabels[d]}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
