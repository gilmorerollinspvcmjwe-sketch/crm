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
    <div className="flex flex-col gap-3 mb-4">
      {showBatchActions && hasSelection && (
        <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-md">
          <span className="text-sm font-medium text-primary">
            已选择 {selectedRows.length} 项
          </span>
          <div className="flex items-center gap-2 ml-auto">
            {batchActions?.map((action, idx) => (
              <Button
                key={idx}
                size="sm"
                variant={action.variant || 'default'}
                onClick={() => action.onClick(selectedRows.map(r => r.original))}
                className="h-7 text-xs"
              >
                {action.icon && <span className="mr-1">{action.icon}</span>}
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9 h-9 w-[240px] bg-background"
              />
            </div>
          )}
          {renderToolbar?.()}
        </div>

        {showDensityToggle && (
          <div className="flex items-center border rounded-md overflow-hidden">
            {densities.map((d) => (
              <Button
                key={d}
                variant="ghost"
                size="sm"
                className={cn(
                  'rounded-none px-3 h-8 text-xs font-normal',
                  density === d && 'bg-secondary text-foreground font-medium'
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
