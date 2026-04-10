/**
 * VirtualDataTable 使用示例
 * 
 * 此文件展示如何使用 VirtualDataTable 组件
 * 实际使用时请根据需要复制相关代码
 */

import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { VirtualDataTable } from './VirtualDataTable'

// 示例数据类型
interface Customer {
  id: number
  name: string
  email: string
  phone: string
  status: '潜在' | '活跃' | '沉默' | '流失'
  createdAt: string
}

// 示例列定义
const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: 'name',
    header: '姓名',
    meta: {
      sortable: true,
      width: 150,
    },
  },
  {
    accessorKey: 'email',
    header: '邮箱',
    meta: {
      sortable: true,
      minWidth: 200,
    },
  },
  {
    accessorKey: 'phone',
    header: '电话',
  },
  {
    accessorKey: 'status',
    header: '状态',
    meta: {
      filterable: true,
      filterType: 'select',
      filterOptions: [
        { label: '潜在', value: '潜在' },
        { label: '活跃', value: '活跃' },
        { label: '沉默', value: '沉默' },
        { label: '流失', value: '流失' },
      ],
    },
  },
  {
    accessorKey: 'createdAt',
    header: '创建时间',
    meta: {
      sortable: true,
    },
  },
]

// 生成示例数据
const generateCustomers = (count: number): Customer[] => {
  const statuses: Customer['status'][] = ['潜在', '活跃', '沉默', '流失']
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    name: `客户 ${i}`,
    email: `customer${i}@example.com`,
    phone: `138${String(i).padStart(8, '0')}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
  }))
}

/**
 * 示例 1: 基础用法（自动切换）
 * 数据量 < 100 行使用 DataTable，>= 100 行使用 VirtualDataTable
 */
export function CustomerListAuto() {
  const [data] = React.useState(() => generateCustomers(1000))
  
  const TableComponent = data.length > 100 ? VirtualDataTable : undefined
  
  if (!TableComponent) {
    return <div>数据量小，使用普通 DataTable</div>
  }
  
  return (
    <VirtualDataTable
      columns={columns}
      data={data}
      showSearch
      searchableFields={['name', 'email', 'phone']}
      showDensityToggle
      showBatchActions
      batchActions={[
        {
          label: '导出选中',
          onClick: (selectedRows) => {
            console.log('导出:', selectedRows)
          },
        },
        {
          label: '删除选中',
          onClick: (selectedRows) => {
            console.log('删除:', selectedRows)
          },
          variant: 'destructive',
        },
      ]}
      onRowClick={(row) => {
        console.log('点击行:', row)
      }}
    />
  )
}

/**
 * 示例 2: 自定义行高和容器高度
 */
export function CustomerListCustom() {
  const [data] = React.useState(() => generateCustomers(5000))
  
  return (
    <VirtualDataTable
      columns={columns}
      data={data}
      estimatedRowHeight={52} // 自定义行高
      containerHeight="70vh"  // 自定义容器高度
      overscan={15}           // 增加预渲染行数
      density="comfortable"
    />
  )
}

/**
 * 示例 3: 受控模式（行选择状态）
 */
export function CustomerListControlled() {
  const [data] = React.useState(() => generateCustomers(1000))
  const [rowSelection, setRowSelection] = React.useState({})
  
  return (
    <VirtualDataTable
      columns={columns}
      data={data}
      rowSelection={rowSelection}
      onRowSelectionChange={setRowSelection}
      renderBatchBar={(selectedCount, selectedRows) => (
        <div className="bg-primary/10 px-4 py-2 text-sm">
          已选择 {selectedCount} 条记录
        </div>
      )}
    />
  )
}

/**
 * 示例 4: 加载状态
 */
export function CustomerListLoading() {
  const [loading, setLoading] = React.useState(true)
  const [data, setData] = React.useState<Customer[]>([])
  
  React.useEffect(() => {
    // 模拟异步加载
    setTimeout(() => {
      setData(generateCustomers(1000))
      setLoading(false)
    }, 2000)
  }, [])
  
  return (
    <VirtualDataTable
      columns={columns}
      data={data}
      loading={loading}
      emptyText="暂无客户数据"
    />
  )
}

/**
 * 示例 5: 性能监控
 */
export function CustomerListWithMetrics() {
  const [data] = React.useState(() => generateCustomers(10000))
  const [renderCount, setRenderCount] = React.useState(0)
  
  return (
    <div>
      <div className="mb-2 text-sm text-muted-foreground">
        总数据：{data.length} 条 | 渲染次数：{renderCount}
      </div>
      <VirtualDataTable
        columns={columns}
        data={data}
        containerHeight={500}
        overscan={5} // 减少预渲染以优化性能
      />
    </div>
  )
}

// 默认导出
export default CustomerListAuto
