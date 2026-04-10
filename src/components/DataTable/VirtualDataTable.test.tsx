import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { VirtualDataTable } from './VirtualDataTable'
import type { ColumnDef } from '@tanstack/react-table'

interface TestData {
  id: number
  name: string
  email: string
  status: string
}

const mockColumns: ColumnDef<TestData>[] = [
  {
    accessorKey: 'name',
    header: '姓名',
    meta: {
      sortable: true,
    },
  },
  {
    accessorKey: 'email',
    header: '邮箱',
  },
  {
    accessorKey: 'status',
    header: '状态',
  },
]

const generateTestData = (count: number): TestData[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    name: `客户 ${i}`,
    email: `customer${i}@example.com`,
    status: ['潜在', '活跃', '沉默', '流失'][Math.floor(Math.random() * 4)],
  }))
}

describe('VirtualDataTable', () => {
  it('renders empty state correctly', () => {
    render(<VirtualDataTable columns={mockColumns} data={[]} />)
    expect(screen.getByText('暂无数据')).toBeInTheDocument()
  })

  it('renders data correctly with small dataset', () => {
    const data = generateTestData(10)
    render(<VirtualDataTable columns={mockColumns} data={data} />)
    
    expect(screen.getByText('客户 0')).toBeInTheDocument()
    expect(screen.getByText('客户 9')).toBeInTheDocument()
  })

  it('renders with loading state', () => {
    render(
      <VirtualDataTable 
        columns={mockColumns} 
        data={[]} 
        loading={true} 
      />
    )
    expect(screen.getByText('加载中...')).toBeInTheDocument()
  })

  it('handles row selection', async () => {
    const data = generateTestData(5)
    const onRowSelectionChange = vi.fn()
    
    render(
      <VirtualDataTable 
        columns={mockColumns} 
        data={data}
        onRowSelectionChange={onRowSelectionChange}
      />
    )
    
    // Click the first row's checkbox
    const checkboxes = screen.getAllByRole('checkbox')
    // First checkbox is "select all", second is first row
    fireEvent.click(checkboxes[1])
    
    expect(onRowSelectionChange).toHaveBeenCalled()
  })

  it('handles density change', async () => {
    const data = generateTestData(20)
    const onDensityChange = vi.fn()
    
    render(
      <VirtualDataTable 
        columns={mockColumns} 
        data={data}
        density="compact"
        onDensityChange={onDensityChange}
      />
    )
    
    // Click density toggle button
    const densityButton = screen.getByRole('button', { name: /密度/i })
    fireEvent.click(densityButton)
    
    expect(onDensityChange).toHaveBeenCalled()
  })

  it('handles search filtering', async () => {
    const data = generateTestData(50)
    
    render(
      <VirtualDataTable 
        columns={mockColumns} 
        data={data}
        showSearch={true}
        searchableFields={['name', 'email']}
      />
    )
    
    // Type in search input
    const searchInput = screen.getByPlaceholderText('搜索...')
    fireEvent.change(searchInput, { target: { value: '客户 5' } })
    
    // Should filter results
    await vi.waitFor(() => {
      expect(screen.queryByText('客户 0')).not.toBeInTheDocument()
    })
  })

  it('handles sorting', async () => {
    const data = generateTestData(20)
    
    render(
      <VirtualDataTable 
        columns={mockColumns} 
        data={data}
      />
    )
    
    // Click sort button on name column
    const sortButton = screen.getByRole('button', { name: /姓名/i })
    fireEvent.click(sortButton)
    
    // Click again to toggle direction
    fireEvent.click(sortButton)
  })

  it('renders large dataset (1000+ rows) without performance issues', () => {
    const data = generateTestData(1000)
    
    const { container } = render(
      <VirtualDataTable 
        columns={mockColumns} 
        data={data}
        containerHeight={400}
        estimatedRowHeight={44}
      />
    )
    
    // Should render without crashing
    expect(container).toBeInTheDocument()
    
    // Only visible rows should be rendered (not all 1000)
    const rows = container.querySelectorAll('tbody tr[data-index]')
    expect(rows.length).toBeLessThan(100) // Should be much less than 1000
  })

  it('handles custom row height', () => {
    const data = generateTestData(200)
    
    const { container } = render(
      <VirtualDataTable 
        columns={mockColumns} 
        data={data}
        estimatedRowHeight={60}
        containerHeight={500}
      />
    )
    
    expect(container).toBeInTheDocument()
  })

  it('handles custom container height as string', () => {
    const data = generateTestData(100)
    
    const { container } = render(
      <VirtualDataTable 
        columns={mockColumns} 
        data={data}
        containerHeight="50vh"
      />
    )
    
    expect(container).toBeInTheDocument()
  })

  it('handles row click callback', async () => {
    const data = generateTestData(10)
    const onRowClick = vi.fn()
    
    render(
      <VirtualDataTable 
        columns={mockColumns} 
        data={data}
        onRowClick={onRowClick}
      />
    )
    
    // Click on a row
    const firstRow = screen.getByText('客户 0').closest('tr')
    if (firstRow) {
      fireEvent.click(firstRow)
    }
    
    expect(onRowClick).toHaveBeenCalledWith(data[0])
  })

  it('shows stats footer with virtual list', () => {
    const data = generateTestData(100)
    
    render(
      <VirtualDataTable 
        columns={mockColumns} 
        data={data}
        showPagination={false}
      />
    )
    
    expect(screen.getByText(/共 \d+ 条记录/i)).toBeInTheDocument()
    expect(screen.getByText(/已显示 \d+ 条/i)).toBeInTheDocument()
  })

  it('supports pagination when enabled', () => {
    const data = generateTestData(100)
    
    render(
      <VirtualDataTable 
        columns={mockColumns} 
        data={data}
        showPagination={true}
        defaultPageSize={20}
      />
    )
    
    // Should show pagination controls
    expect(screen.getByText(/1-20 of 100/i)).toBeInTheDocument()
  })
})
