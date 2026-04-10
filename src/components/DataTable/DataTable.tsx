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

      <div className={cn('rounded-lg border bg-card overflow-hidden shadow-sm', densityClassMap[density])}>
        <div className="overflow-x-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="border-b bg-muted/50">
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
                          backgroundColor: fixed ? 'hsl(var(--card))' : undefined,
                        }}
                        className={cn('h-11 px-4 text-left align-middle font-medium text-muted-foreground text-xs uppercase tracking-wider', fixed && 'border-r')}
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
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    onClick={() => onRowClick?.(row.original)}
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
                          className={cn('align-middle', fixed && 'border-r')}
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
