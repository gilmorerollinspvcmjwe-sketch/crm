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
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { DataTableToolbar } from './DataTableToolbar'
import { DataTablePagination } from './DataTablePagination'
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

function isInteractiveElement(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  return Boolean(
    target.closest('button, a, input, textarea, select, [role="checkbox"], [role="button"], [data-stop-row-click="true"]')
  )
}

export function DataTable<TData, TValue>(
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
    showPagination = true,
    pageSizeOptions = [10, 20, 50, 100],
    defaultPageSize = 20,
    className,
    loading = false,
    emptyText = '暂无数据',
    renderToolbar,
    renderBatchBar,
    onRowClick,
  }: DataTableProps<TData, TValue>
) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelectionInternal, setRowSelectionInternal] = React.useState<RowSelectionState>(
    rowSelection || {}
  )

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
          header: ({ table }: { table: { toggleSorting: () => void; getColumn: (id: string) => { getIsSorted: () => false | 'asc' | 'desc' } | undefined } }) => {
            const column = table.getColumn(colId)
            return (
              <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 dataTables-sort"
                onClick={() => table.toggleSorting()}
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
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: defaultPageSize,
      },
    },
  })

  const selectedRows = table.getFilteredSelectedRowModel().rows
  const hasSelection = selectedRows.length > 0

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

      <div className={cn('overflow-hidden rounded-[1.25rem] border border-border/70 bg-card shadow-[var(--shadow-sm)]', densityClassMap[density])}>
        <div className="border-b border-border/70 bg-muted/25 px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">Table workspace</p>
              <p className="mt-1 text-sm text-foreground/82">
                共 {table.getFilteredRowModel().rows.length} 条结果
                {hasSelection ? `，已选 ${selectedRows.length} 条` : ''}
              </p>
            </div>
            <span className="rounded-2xl border border-border/70 bg-card px-3 py-1.5 text-xs text-muted-foreground">
              {density === 'compact' ? '紧凑视图' : density === 'comfortable' ? '宽松视图' : '标准视图'}
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="border-b border-border/70 bg-muted/35">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
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
                          zIndex: fixed ? 1 : 0,
                          backgroundColor: fixed ? 'oklch(var(--card))' : undefined,
                        }}
                        className={cn('h-12 px-4 text-left align-middle text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground', fixed && 'border-r border-border/70')}
                      >
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    )
                  })}
                </tr>
              ))}
            </thead>
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
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={allColumns.length} className="align-middle">
                    <EmptyState
                      variant="noData"
                      size="sm"
                      title={emptyText}
                      description="当前视图还没有可展示的数据，可以先调整筛选条件或新增一条记录。"
                      className="py-10"
                    />
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    onClick={(event) => {
                      if (isInteractiveElement(event.target)) return
                      onRowClick?.(row.original)
                    }}
                    className={cn(
                      'border-b border-border/60 transition-colors duration-150',
                      'hover:bg-accent/40',
                      onRowClick && 'cursor-pointer',
                      row.getIsSelected() && 'bg-muted/45'
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
                            backgroundColor: fixed ? 'oklch(var(--card))' : undefined,
                          }}
                          className={cn('align-middle', fixed && 'border-r border-border/70')}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      )
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showPagination && <DataTablePagination table={table} pageSizeOptions={pageSizeOptions} />}
    </div>
  )
}

export { DataTableToolbar } from './DataTableToolbar'
export { DataTablePagination } from './DataTablePagination'
