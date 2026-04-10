import * as React from 'react'
import {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  RowSelectionState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  OnChangeFn,
  flexRender,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTableToolbar } from './DataTableToolbar'
import type {
  DataTableProps,
  DensitySize,
  DataTableColumnMeta,
} from './types'

const densityClassMap: Record<DensitySize, string> = {
  compact: 'table-density-compact',
  default: 'table-density-default',
  comfortable: 'table-density-comfortable',
}

// Row height based on density
const densityRowHeight: Record<DensitySize, number> = {
  compact: 36,
  default: 44,
  comfortable: 52,
}

function SortIcon({ column }: { column: { getIsSorted: () => false | 'asc' | 'desc' } }) {
  const sorted = column.getIsSorted()
  if (!sorted) {
    return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
  }
  return sorted === 'asc' ? (
    <ArrowUp className="ml-2 h-4 w-4 text-primary" />
  ) : (
    <ArrowDown className="ml-2 h-4 w-4 text-primary" />
  )
}

interface VirtualDataTableProps<TData, TValue> extends Omit<DataTableProps<TData, TValue>, 'showPagination'> {
  /** Estimated row height for virtualization */
  estimatedRowHeight?: number
  /** Number of rows to render outside visible area (overscan) */
  overscan?: number
  /** Container height for virtual list */
  containerHeight?: number | string
  /** Whether to use pagination with virtualization (useful for smaller datasets) */
  showPagination?: boolean
}

export function VirtualDataTable<TData, TValue>(
  {
    columns,
    data,
    rowSelection,
    onRowSelectionChange,
    density = 'default',
    onDensityChange,
    showBatchActions = false,
    batchActions,
    showSearch = true,
    searchPlaceholder = '搜索...',
    searchableFields = [],
    showDensityToggle = true,
    pageSizeOptions = [10, 20, 50, 100],
    defaultPageSize = 20,
    className,
    loading = false,
    emptyText = '暂无数据',
    renderToolbar,
    renderBatchBar,
    onRowClick,
    estimatedRowHeight,
    overscan = 10,
    containerHeight = 600,
    showPagination = false,
  }: VirtualDataTableProps<TData, TValue>
) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelectionInternal, setRowSelectionInternal] = React.useState<RowSelectionState>(
    rowSelection || {}
  )

  const tableContainerRef = React.useRef<HTMLDivElement>(null)

  // Calculate row height based on density
  const rowHeight = estimatedRowHeight ?? densityRowHeight[density]

  const onRowSelectionChangeInternal: OnChangeFn<RowSelectionState> = (updater) => {
    const newSelection = typeof updater === 'function' ? updater(rowSelectionInternal) : updater
    setRowSelectionInternal(newSelection)
    onRowSelectionChange?.(newSelection)
  }

  // Add select column
  const selectColumn: ColumnDef<TData, unknown> = {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() ? true : table.getIsSomePageRowsSelected() ? 'indeterminate' : false}
        onCheckedChange={(checked) => table.toggleAllPageRowsSelected(checked === true)}
        aria-label="全选"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(checked) => row.toggleSelected(checked === true)}
        aria-label="选择该行"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
  }

  // Wrap columns with sortable header if needed
  const tableColumns = React.useMemo(() => {
    return columns.map((col) => {
      const colId = 'accessorKey' in col ? String(col.accessorKey) : 'id' in col ? String(col.id) : null
      const meta = col.meta as DataTableColumnMeta | undefined

      if (meta?.sortable && colId) {
        return {
          ...col,
          header: ({ table }: { table: { toggleSorting: (id: string, desc?: boolean) => void; getColumn: (id: string) => { getIsSorted: () => false | 'asc' | 'desc'; toggleSorting: (desc?: boolean) => void } | undefined } }) => {
            const column = table.getColumn(colId)
            return (
              <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 dataTables-sort"
                onClick={() => column?.toggleSorting()}
              >
                {typeof col.header === 'string' ? col.header : colId}
                {column && <SortIcon column={column} />}
              </Button>
            )
          },
        }
      }
      return col
    })
  }, [columns])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allColumns = React.useMemo(() => [selectColumn as any, ...tableColumns as any], [selectColumn, tableColumns])

  const table = useReactTable<TData>({
    data,
    columns: allColumns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection: rowSelection ?? rowSelectionInternal,
    },
    enableRowSelection: true,
    onRowSelectionChange: onRowSelectionChange ? onRowSelectionChangeInternal : undefined,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: showPagination ? getPaginationRowModel() : undefined,
    getSortedRowModel: getSortedRowModel(),
    initialState: showPagination ? {
      pagination: {
        pageSize: defaultPageSize,
      },
    } : undefined,
  })

  const { rows } = table.getRowModel()

  // Virtualizer for the table body
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => rowHeight,
    overscan,
  })

  const virtualRows = rowVirtualizer.getVirtualItems()
  const totalSize = rowVirtualizer.getTotalSize()

  const selectedRows = table.getFilteredSelectedRowModel().rows
  const hasSelection = selectedRows.length > 0

  // Padding to maintain scroll position
  const [paddingTop, paddingBottom] =
    virtualRows.length > 0
      ? [
          virtualRows[0].start,
          totalSize - (virtualRows[virtualRows.length - 1].end || 0),
        ]
      : [0, 0]

  return (
    <div className={cn('w-full', className)}>
      <DataTableToolbar
        table={table}
        showSearch={showSearch}
        searchPlaceholder={searchPlaceholder}
        searchableFields={searchableFields}
        showDensityToggle={showDensityToggle}
        density={density}
        onDensityChange={onDensityChange}
        showBatchActions={showBatchActions}
        batchActions={batchActions}
        renderToolbar={renderToolbar}
      />

      {showBatchActions && hasSelection && renderBatchBar?.(selectedRows.length, selectedRows.map(r => r.original))}

      <div className={cn('rounded-lg border bg-card overflow-hidden shadow-sm', densityClassMap[density])}>
        {/* Header - fixed */}
        <div className="overflow-x-auto border-b">
          <table className="w-full caption-bottom text-sm">
            <thead className="bg-muted/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="h-11">
                  {headerGroup.headers.map((header) => {
                    const meta = header.column.columnDef.meta as DataTableColumnMeta | undefined
                    const fixed = meta?.fixed
                    return (
                      <th
                        key={header.id}
                        style={{
                          width: meta?.width,
                          minWidth: meta?.minWidth,
                          position: fixed ? 'sticky' : undefined,
                          left: fixed === 'left' ? 0 : undefined,
                          right: fixed === 'right' ? 0 : undefined,
                          zIndex: fixed ? 2 : 0,
                          backgroundColor: fixed ? 'hsl(var(--muted) / 0.5)' : undefined,
                        }}
                        className={cn(
                          'px-4 text-left align-middle font-medium text-muted-foreground text-xs uppercase tracking-wider',
                          fixed && 'border-r'
                        )}
                      >
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    )
                  })}
                </tr>
              ))}
            </thead>
          </table>
        </div>

        {/* Virtualized body */}
        <div
          ref={tableContainerRef}
          className="overflow-x-auto overflow-y-auto"
          style={{ height: typeof containerHeight === 'number' ? `${containerHeight}px` : containerHeight }}
        >
          <table className="w-full caption-bottom text-sm">
            <tbody className="[&_tr:last-child]:border-0">
              {loading ? (
                <tr>
                  <td colSpan={allColumns.length} className="h-32 text-center align-middle">
                    <div className="flex items-center justify-center gap-3 text-muted-foreground">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      <span className="text-sm">加载中...</span>
                    </div>
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={allColumns.length} className="h-32 text-center align-middle">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <svg className="h-10 w-10 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-sm">{emptyText}</span>
                    </div>
                  </td>
                </tr>
              ) : (
                <>
                  {/* Top padding */}
                  {paddingTop > 0 && (
                    <tr>
                      <td style={{ height: `${paddingTop}px` }} colSpan={allColumns.length} />
                    </tr>
                  )}

                  {/* Virtual rows */}
                  {virtualRows.map((virtualRow) => {
                    const row = rows[virtualRow.index]
                    return (
                      <tr
                        key={row.id}
                        data-index={virtualRow.index}
                        data-state={row.getIsSelected() && 'selected'}
                        onClick={() => onRowClick?.(row.original)}
                        style={{ height: `${virtualRow.size}px` }}
                        className={cn(
                          'border-b transition-all duration-150',
                          'hover:bg-primary/5 hover:shadow-sm',
                          onRowClick && 'cursor-pointer',
                          row.getIsSelected() && 'bg-primary/5'
                        )}
                      >
                        {row.getVisibleCells().map((cell) => {
                          const meta = cell.column.columnDef.meta as DataTableColumnMeta | undefined
                          const fixed = meta?.fixed
                          return (
                            <td
                              key={cell.id}
                              style={{
                                width: meta?.width,
                                minWidth: meta?.minWidth,
                                position: fixed ? 'sticky' : undefined,
                                left: fixed === 'left' ? 0 : undefined,
                                right: fixed === 'right' ? 0 : undefined,
                                zIndex: fixed ? 1 : 0,
                                backgroundColor: fixed ? 'hsl(var(--card))' : undefined,
                              }}
                              className={cn('align-middle px-4', fixed && 'border-r')}
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}

                  {/* Bottom padding */}
                  {paddingBottom > 0 && (
                    <tr>
                      <td style={{ height: `${paddingBottom}px` }} colSpan={allColumns.length} />
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats footer for virtual list */}
      {!showPagination && !loading && rows.length > 0 && (
        <div className="flex items-center justify-between px-4 py-2 text-sm text-muted-foreground border-t">
          <span>共 {data.length} 条记录</span>
          <span>已显示 {virtualRows.length} 条</span>
        </div>
      )}
    </div>
  )
}

export default VirtualDataTable