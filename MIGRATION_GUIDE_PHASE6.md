# Phase 6: TanStack Query + Axios 迁移指南

## 📁 新增文件结构

```
src/
├── components/
│   └── providers/
│       └── QueryProvider.tsx    # React Query Provider
├── hooks/
│   ├── api/
│   │   ├── index.ts             # Barrel export
│   │   ├── useCustomers.ts      # 客户数据 hooks
│   │   ├── useContacts.ts       # 联系人数据 hooks
│   │   ├── useLeads.ts          # 线索数据 hooks
│   │   ├── useOpportunities.ts  # 商机数据 hooks
│   │   └── useProducts.ts       # 产品数据 hooks
│   └── useInfiniteQueries.ts    # 无限滚动 hooks
├── lib/
│   ├── axios.ts                 # Axios 实例配置
│   ├── query-client.ts          # QueryClient 配置
│   ├── api-service.ts           # API 服务层 (mock/real 切换)
│   └── mock-api.ts              # 开发环境 Mock 数据
├── types/
│   └── api.ts                   # API 类型定义
└── App.tsx                      # 已集成 QueryProvider
```

## 🔧 已安装依赖

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools axios
```

## 📋 使用示例

### 1. 在 App.tsx 中包裹 QueryProvider

```tsx
// main.tsx
import { QueryProvider } from '@/components/providers/QueryProvider'

createRoot(document.getElementById('root')!).render(
  <QueryProvider>
    <App />
  </QueryProvider>
)
```

### 2. 使用数据获取 Hook

```tsx
import { useCustomers, useCreateCustomer, useUpdateCustomer } from '@/hooks/api'

// 获取客户列表
function CustomerList() {
  const { data, isLoading, error } = useCustomers({ page: 1, pageSize: 10 })

  if (isLoading) return <div>加载中...</div>
  if (error) return <div>错误: {(error as ApiError).message}</div>

  return (
    <div>
      {data?.data.map(customer => (
        <div key={customer.id}>{customer.name}</div>
      ))}
      <div>总计: {data?.total} 条</div>
    </div>
  )
}

// 创建客户 (useMutation)
function CreateCustomerForm() {
  const createCustomer = useCreateCustomer()

  const handleSubmit = async (formData) => {
    try {
      await createCustomer.mutateAsync(formData)
      // 自动 invalidates queries, 列表会自动刷新
    } catch (error) {
      console.error('创建失败:', error)
    }
  }

  return <Form onSubmit={handleSubmit} />
}
```

### 3. 乐观更新示例

```tsx
// useBulkDeleteCustomers 已经内置乐观更新
const bulkDelete = useBulkDeleteCustomers()

// 调用时自动乐观更新，失败时回滚
await bulkDelete.mutateAsync(['C001', 'C002'])
```

### 4. 无限滚动/分页

```tsx
import { useInfiniteQuery } from '@tanstack/react-query'

function InfiniteCustomerList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['customers', 'infinite'],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await http.get('/customers', { params: { page: pageParam } })
      return data
    },
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  })

  return (
    <div>
      {data?.pages.flatMap(page => page.data).map(customer => (
        <div key={customer.id}>{customer.name}</div>
      ))}
      <button onClick={() => fetchNextPage()} disabled={!hasNextPage}>
        {isFetchingNextPage ? '加载中...' : '加载更多'}
      </button>
    </div>
  )
}
```

## 🔄 从 Zustand 迁移指南

### 旧模式 (Zustand)

```tsx
// ❌ 旧方式 - 在 store 中管理服务端状态
import { create } from 'zustand'

const useCustomerStore = create((set) => ({
  customers: [],
  loading: false,
  fetchCustomers: async () => {
    set({ loading: true })
    const data = await api.getCustomers()
    set({ customers: data, loading: false })
  },
}))
```

### 新模式 (TanStack Query)

```tsx
// ✅ 新方式 - 用 TanStack Query 管理服务端状态
import { useCustomers } from '@/hooks/api'

function CustomerList() {
  // 加载状态、错误处理、缓存都自动管理
  const { data, isLoading, error } = useCustomers()

  // 状态在组件内部，不需要 prop drilling
  if (isLoading) return <Skeleton />
  if (error) return <ErrorMessage error={error} />
  return <List customers={data?.data} />
}
```

### Zustand 保留场景

仅保留纯客户端状态（如 UI 状态）：

```tsx
import { create } from 'zustand'

// ✅ 保留 - UI 状态
const useUIStore = create((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  selectedIds: [],
  setSelectedIds: (ids) => set({ selectedIds: ids }),
}))

// ❌ 移除 - 服务端状态不应放在 Zustand
// const useCustomerStore = create(...) // 已迁移到 useCustomers
```

## 🎯 核心优势

| 特性 | Zustand | TanStack Query |
|------|---------|----------------|
| 数据缓存 | ❌ 需手动实现 | ✅ 自动缓存 |
| 后台刷新 | ❌ 需手动实现 | ✅ 自动后台刷新 |
| 加载状态 | ❌ 需手动管理 | ✅ isLoading/isFetching |
| 乐观更新 | ❌ 需手动实现 | ✅ 内置支持 |
| 错误重试 | ❌ 需手动实现 | ✅ 自动重试 |
| 依赖查询 | ❌ 需手动协调 | ✅ 自动依赖管理 |
| DevTools | ❌ 无 | ✅ 内置 DevTools |

## 📝 环境变量

```env
# .env
VITE_API_BASE_URL=/api/v1      # API 基础路径（不设置则使用 Mock 数据）
VITE_API_TIMEOUT=30000         # 请求超时（毫秒）
```

## 🔑 Query Key 缓存失效

```tsx
import { queryClient } from '@/lib/query-client'
import { queryKeys } from '@/lib/query-client'

// 失效所有客户相关缓存
queryClient.invalidateQueries({ queryKey: queryKeys.customers.all })

// 失效特定客户
queryClient.invalidateQueries({ queryKey: queryKeys.customers.detail('C001') })

// 手动设置缓存
queryClient.setQueryData(queryKeys.customers.detail('C001'), newData)
```

## 🛠 调试

在浏览器中打开 React Query DevTools (开发模式自动开启):

- **DevTools 面板**: 右键 → 检查 → React Query 选项卡
- **缓存查看**: 查看所有查询的缓存状态
- **手动刷新**: 点击 Query → Refetch 按钮
- **历史记录**: 查看每次请求的详情
