'use client'

import * as React from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import { DashletContainer } from './DashletContainer'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

import { DashletConfig, TableColumn, TableConfig } from '@/types/dashlet'

interface TableDashletProps {
  config: DashletConfig
  tableConfig: TableConfig
  isEditing?: boolean
  onRemove?: (id: string) => void
  onEdit?: (id: string) => void
  onRefresh?: (id: string) => void
}

// Mock table data
const MOCK_TABLE_DATA = [
  { id: 1, name: '李明', company: '华腾科技有限公司', status: '跟进中', amount: 125000, date: '2026-04-05' },
  { id: 2, name: '王芳', company: '盛世集团', status: '已成交', amount: 380000, date: '2026-04-03' },
  { id: 3, name: '陈静', company: '创新科技', status: '已成交', amount: 220000, date: '2026-04-01' },
  { id: 4, name: '张伟', company: '明日科技', status: '意向客户', amount: 85000, date: '2026-03-28' },
  { id: 5, name: '赵敏', company: '智联科技', status: '跟进中', amount: 150000, date: '2026-03-25' },
]

export function TableDashlet({
  config,
  tableConfig,
  isEditing = false,
  onRemove,
  onEdit,
  onRefresh,
}: TableDashletProps) {
  const [sortKey, setSortKey] = React.useState<string | null>(null)
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = React.useState(1)

  const data = tableConfig.data?.length ? tableConfig.data : MOCK_TABLE_DATA
  const columns = tableConfig.columns?.length ? tableConfig.columns : getDefaultColumns()
  const pageSize = tableConfig.pageSize || 5
  const showPagination = tableConfig.showPagination !== false

  function getDefaultColumns(): TableColumn[] {
    return [
      { key: 'name', label: '姓名', sortable: true },
      { key: 'company', label: '公司', sortable: true },
      { key: 'status', label: '状态', sortable: true },
      { key: 'amount', label: '金额', sortable: true, align: 'right' },
      { key: 'date', label: '日期', sortable: true },
    ]
  }

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortOrder('desc')
    }
  }

  const sortedData = React.useMemo(() => {
    if (!sortKey) return data
    return [...data].sort((a, b) => {
      const aVal = (a as Record<string, any>)[sortKey]
      const bVal = (b as Record<string, any>)[sortKey]
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
  }, [data, sortKey, sortOrder])

  const paginatedData = React.useMemo(() => {
    if (!showPagination) return sortedData
    const start = (currentPage - 1) * pageSize
    return sortedData.slice(start, start + pageSize)
  }, [sortedData, currentPage, pageSize, showPagination])

  const totalPages = Math.ceil(sortedData.length / pageSize)

  const getAlignClass = (align?: 'left' | 'center' | 'right') => {
    switch (align) {
      case 'center': return 'text-center'
      case 'right': return 'text-right'
      default: return 'text-left'
    }
  }

  const renderCellValue = (row: Record<string, any>, col: TableColumn) => {
    const value = row[col.key]
    if (col.key === 'status') {
      const statusColors: Record<string, string> = {
        '已成交': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        '跟进中': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        '意向客户': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      }
      return (
        <Badge className={statusColors[value] || ''} variant="secondary">
          {value}
        </Badge>
      )
    }
    if (col.key === 'amount') {
      return `¥${Number(value).toLocaleString()}`
    }
    return value
  }

  const SortIcon = ({ column }: { column: TableColumn }) => {
    if (!column.sortable) return null
    if (sortKey !== column.key) {
      return <ChevronsUpDown className="h-4 w-4 ml-1 inline text-muted-foreground/50" />
    }
    return sortOrder === 'asc' ? (
      <ChevronUp className="h-4 w-4 ml-1 inline text-primary" />
    ) : (
      <ChevronDown className="h-4 w-4 ml-1 inline text-primary" />
    )
  }

  return (
    <DashletContainer
      config={config}
      isEditing={isEditing}
      onRemove={onRemove}
      onEdit={onEdit}
      onRefresh={onRefresh}
    >
      <div className="space-y-3">
        <div className="overflow-auto -mx-4 px-4">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead
                    key={col.key}
                    className={`${getAlignClass(col.align)} ${col.sortable ? 'cursor-pointer hover:bg-muted/50' : ''}`}
                    style={{ width: col.width }}
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    {col.label}
                    <SortIcon column={col} />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((row: Record<string, any>) => (
                <TableRow key={(row.id as string) || (row as any)[columns[0].key]} className={tableConfig.hoverable !== false ? 'hover:bg-muted/50' : ''}>
                  {columns.map((col) => (
                    <TableCell
                      key={col.key}
                      className={`${getAlignClass(col.align)} ${tableConfig.striped && (row.id as number) % 2 === 0 ? 'bg-muted/30' : ''}`}
                    >
                      {renderCellValue(row, col)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {showPagination && totalPages > 1 && (
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              上一页
            </Button>
            <span className="text-sm text-muted-foreground">
              第 {currentPage} 页，共 {totalPages} 页
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              下一页
            </Button>
          </div>
        )}
      </div>
    </DashletContainer>
  )
}

export default TableDashlet
