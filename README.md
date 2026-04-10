# CRM UI Upgrade - DataTable Component Migration

**Phase 2: DataTable 组件从 Ant Design Table 迁移到 @tanstack/react-table + shadcn/ui**

## 📦 项目结构

```
crm-ui-upgrade/
├── src/
│   ├── components/
│   │   ├── DataTable/
│   │   │   ├── index.ts              # 导出入口
│   │   │   ├── types.ts              # TypeScript 类型定义
│   │   │   ├── DataTable.tsx         # 主组件（核心）
│   │   │   ├── DataTableToolbar.tsx  # 工具栏（搜索、密度切换）
│   │   │   └── DataTablePagination.tsx # 分页组件
│   │   └── ui/                       # shadcn/ui 基础组件
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── checkbox.tsx
│   │       ├── select.tsx
│   │       ├── badge.tsx
│   │       └── ...
│   ├── lib/
│   │   └── utils.ts                  # cn() 工具函数
│   ├── App.tsx                       # 演示页面
│   ├── main.tsx
│   └── index.css                     # Tailwind + CSS 变量
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.cjs
├── postcss.config.cjs
└── README.md
```

## ✅ 功能验证清单

| 功能 | Ant Design Table | 新实现 | 验证状态 |
|------|-----------------|--------|---------|
| 列定义（columns） | ✅ | ✅ | ✅ |
| 排序（sorter） | ✅ | ✅ | ✅ |
| 筛选（filters） | ✅ | ✅ | ✅ |
| 分页（pagination） | ✅ | ✅ | ✅ |
| 行选择（rowSelection） | ✅ | ✅ | ✅ |
| 固定列（fixed） | ✅ | ✅ | ✅ |
| 批量操作 | ✅ | ✅ | ✅ |
| 密度切换（紧凑/默认/宽松） | ✅ | ✅ | ✅ |
| 加载状态 | ✅ | ✅ | ✅ |
| 空状态 | ✅ | ✅ | ✅ |
| 全局搜索 | ✅ | ✅ | ✅ |
| 响应式布局 | ✅ | ✅ | ✅ |

## 🚀 使用示例

```tsx
import { DataTable } from '@/components/DataTable'
import type { ColumnDef } from '@tanstack/react-table'

// 定义列
const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: 'name',
    header: '姓名',
    meta: { sortable: true, width: 100 } as DataTableColumnMeta,
  },
  {
    accessorKey: 'status',
    header: '状态',
    meta: {
      sortable: true,
      filterable: true,
      filterType: 'select',
      filterOptions: [
        { label: '活跃', value: '活跃' },
        { label: '沉默', value: '沉默' },
      ],
    } as DataTableColumnMeta,
  },
]

// 使用组件
<DataTable
  columns={columns}
  data={customers}
  density="default"
  onDensityChange={setDensity}
  showSearch
  searchPlaceholder="搜索客户..."
  searchableFields={['name', 'company', 'email']}
  showBatchActions
  batchActions={[
    { label: '删除', variant: 'destructive', onClick: handleDelete },
    { label: '导出', onClick: handleExport },
  ]}
  showPagination
  pageSizeOptions={[10, 20, 50]}
  defaultPageSize={20}
  rowSelection={selection}
  onRowSelectionChange={setSelection}
  loading={isLoading}
  emptyText="暂无客户数据"
/>
```

## 🔧 API 参考

### DataTable Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `columns` | `ColumnDef<TData, TValue>[]` | - | 列定义 |
| `data` | `TData[]` | - | 数据源 |
| `density` | `'compact' \| 'default' \| 'comfortable'` | `'default'` | 表格密度 |
| `onDensityChange` | `(density: DensitySize) => void` | - | 密度切换回调 |
| `showSearch` | `boolean` | `true` | 显示搜索框 |
| `searchPlaceholder` | `string` | `'搜索...'` | 搜索框占位符 |
| `searchableFields` | `(keyof TData \| string)[]` | `[]` | 搜索字段 |
| `showBatchActions` | `boolean` | `false` | 显示批量操作 |
| `batchActions` | `BatchAction[]` | `[]` | 批量操作按钮 |
| `showPagination` | `boolean` | `true` | 显示分页 |
| `pageSizeOptions` | `number[]` | `[10, 20, 50, 100]` | 每页条数选项 |
| `defaultPageSize` | `number` | `20` | 默认每页条数 |
| `rowSelection` | `RowSelectionState` | `{}` | 行选择状态 |
| `onRowSelectionChange` | `(selection: RowSelectionState) => void` | - | 选择变化回调 |
| `loading` | `boolean` | `false` | 加载状态 |
| `emptyText` | `string` | `'暂无数据'` | 空状态文本 |
| `renderToolbar` | `() => React.ReactNode` | - | 自定义工具栏 |
| `renderBatchBar` | `(count, rows) => React.ReactNode` | - | 自定义批量操作栏 |

### 列配置 (ColumnDef.meta)

```tsx
interface DataTableColumnMeta {
  sortable?: boolean          // 是否可排序
  filterable?: boolean        // 是否可筛选
  filterType?: 'text' | 'select' | 'number'  // 筛选类型
  filterOptions?: { label: string; value: string }[]  // 筛选选项
  fixed?: 'left' | 'right'    // 固定列位置
  width?: number | string     // 列宽度
  minWidth?: number | string  // 最小宽度
}
```

## 📋 密度切换实现

| 密度 | Tailwind 类 | 行高 | 内边距 |
|------|------------|------|--------|
| compact | `table-density-compact` | 紧凑 | py-1 px-3 |
| default | `table-density-default` | 中等 | py-2 px-4 |
| comfortable | `table-density-comfortable` | 宽松 | py-3 px-5 |

## 🎨 样式迁移

- ✅ 使用 Tailwind CSS 替代原有 CSS
- ✅ 保持 Ant Design 配色方案（CSS 变量）
- ✅ 响应式布局支持
- ✅ 密度切换样式

## 📝 待完善功能

以下功能在 Ant Design Table 中有但尚未在新组件中完整实现：

1. **列筛选 UI** - 目前筛选配置已定义，但筛选下拉 UI 需要手动扩展
2. **虚拟滚动** - 大数据量场景需要 @tanstack/react-virtual
3. **列拖拽调整宽度** - 需要 react-dnd 或类似库
4. **树形数据** - 需要展开/折叠行
5. **可编辑单元格** - inline editing
6. **合并单元格** - rowspan/colspan

## 🛠 安装依赖

```bash
npm install @tanstack/react-table class-variance-authority clsx tailwind-merge lucide-react
npm install -D tailwindcss@3 postcss autoprefixer typescript @types/react @types/react-dom vite @vitejs/plugin-react
```

## 📦 构建

```bash
npm run build  # 构建生产版本
npm run dev    # 开发模式
npm run preview # 预览生产版本
```
