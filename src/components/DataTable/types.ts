import type { ColumnDef, RowSelectionState, Table } from '@tanstack/react-table'

export type DensitySize = 'compact' | 'default' | 'comfortable'

export interface DataTableColumnMeta {
  sortable?: boolean
  filterable?: boolean
  filterType?: 'text' | 'select' | 'number'
  filterOptions?: { label: string; value: string }[]
  fixed?: 'left' | 'right'
  width?: number | string
  minWidth?: number | string
}

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  rowSelection?: RowSelectionState
  onRowSelectionChange?: (selection: RowSelectionState) => void
  density?: DensitySize
  onDensityChange?: (density: DensitySize) => void
  showBatchActions?: boolean
  batchActions?: {
    label: string
    onClick: (selectedRows: TData[]) => void
    variant?: 'default' | 'destructive'
    icon?: React.ReactNode
  }[]
  showSearch?: boolean
  searchPlaceholder?: string
  searchableFields?: (keyof TData | string)[]
  showDensityToggle?: boolean
  showPagination?: boolean
  pageSizeOptions?: number[]
  defaultPageSize?: number
  className?: string
  loading?: boolean
  emptyText?: string
  renderToolbar?: () => React.ReactNode
  renderBatchBar?: (selectedCount: number, selectedRows: TData[]) => React.ReactNode
  /** 行点击回调 */
  onRowClick?: (row: TData) => void
}

export interface DataTableToolbarProps<TData> {
  table: Table<TData>
  showSearch?: boolean
  searchPlaceholder?: string
  searchableFields?: (keyof TData | string)[]
  showDensityToggle?: boolean
  density?: DensitySize
  onDensityChange?: (density: DensitySize) => void
  showBatchActions?: boolean
  batchActions?: DataTableProps<TData, unknown>['batchActions']
  renderToolbar?: () => React.ReactNode
}

export interface DataTablePaginationProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  table: Table<any>
  pageSizeOptions?: number[]
}
