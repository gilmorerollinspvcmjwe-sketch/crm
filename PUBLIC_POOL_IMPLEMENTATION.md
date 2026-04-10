# 公海池功能实现文档

## 概述

本次实现完成了 CRM 系统的客户公海池功能和客户字段增强。

## 实现内容

### 1. 客户类型增强 (`src/types/customer.ts`)

新增了以下字段和类型：

#### 基础信息字段
- `shortName`: 客户简称
- `annualRevenue`: 年营业额（枚举类型）
- `region`: 所属区域（华北、华东、华南等）
- `companySize`: 公司规模（微型、小型、中型、大型、超大型）
- `industryDetail`: 行业细分（16 个行业分类）
- `nextContactTime`: 下次联系时间
- `isPublic`: 公海状态标识

#### 公海池相关字段
- `isPublic`: 是否在公海池
- `publicAt`: 进入公海池时间
- `assignedAt`: 领取时间
- `protectUntil`: 保护期截止时间
- `lastActivityAt`: 最后活动时间
- `publicReason`: 进入公海原因
- `claimCount`: 被领取次数
- `previousOwner`: 原负责人

#### 配置常量
- `CUSTOMER_TYPE_CONFIG`: 客户类型配置
- `REGION_CONFIG`: 区域配置
- `INDUSTRY_DETAIL_CONFIG`: 行业细分配置
- `COMPANY_SIZE_CONFIG`: 公司规模配置
- `ANNUAL_REVENUE_CONFIG`: 年营业额配置
- `PUBLIC_POOL_STATUS_CONFIG`: 公海池状态配置
- `DEFAULT_PUBLIC_POOL_CONFIG`: 默认公海池配置

### 2. 公海池页面 (`src/pages/customers/HighSeasPool.tsx`)

#### 功能特性

1. **公海客户列表**
   - 展示所有公海池中的客户
   - 显示客户基本信息（姓名、公司、简称、区域、行业、规模等）
   - 显示公海相关信息（进入时间、原因、状态等）
   - 支持表格排序和分页

2. **筛选功能**
   - 搜索框：支持客户姓名、公司、简称搜索
   - 区域筛选：华北、华东、华南等 9 个区域
   - 行业筛选：16 个行业分类
   - 状态筛选：可领取、保护期中

3. **领取操作**
   - 点击领取按钮打开确认对话框
   - 选择负责人
   - 显示客户基本信息和保护期说明
   - 领取后客户从公海池移除
   - 保护期：领取后 7 天内不可被其他销售领取

4. **查看详情**
   - 跳转到客户详情页
   - 查看客户完整信息

5. **统计卡片**
   - 公海客户总数
   - 可领取数量
   - 保护期中数量
   - 高评分客户数量（≥80 分）

6. **刷新功能**
   - 手动刷新公海池数据
   - 获取最新状态

#### UI 组件
- 使用 shadcn/ui 组件库
- DataTable 表格组件
- Dialog 对话框组件
- Badge 徽章组件
- Select 下拉选择组件
- Card 卡片组件

### 3. API Hooks (`src/hooks/api/usePublicPool.ts`)

提供以下 API hooks：

- `usePublicPoolCustomers`: 获取公海池客户列表
- `useClaimCustomer`: 领取公海客户
- `useReturnToPool`: 退回客户到公海
- `usePublicPoolConfig`: 获取公海池配置
- `useUpdatePublicPoolConfig`: 更新公海池配置

### 4. 路由配置 (`src/routes/index.tsx`)

新增路由：
- `/customers/public-pool`: 公海池页面

## 业务逻辑

### 公海池规则

1. **自动进入公海**
   - 超过 30 天无跟进记录的客户自动进入公海
   - 销售主动退回的客户进入公海

2. **领取规则**
   - 任何销售都可以领取公海池中的客户
   - 领取后客户归属该销售
   - 保护期 7 天，期间其他销售无法领取

3. **保护期**
   - 领取后 7 天内为保护期
   - 保护期内客户显示"保护期中"状态
   - 保护期结束后显示"可领取"状态

4. **退回规则**
   - 销售可以将自己名下的客户退回公海
   - 需要选择退回原因
   - 退回后客户重新进入公海池

## 类型导出

所有新增类型已通过 `src/types/index.ts` 导出：

```typescript
import type {
  CustomerExtended,
  CustomerRegion,
  CustomerIndustryDetail,
  CompanySize,
  AnnualRevenue,
  PublicPoolCustomer,
  PublicPoolStatus,
  PublicPoolQueryParams,
  ClaimCustomerRequest,
  ReturnToPoolRequest,
  PublicPoolConfig,
} from '@/types'
```

## 使用示例

### 获取公海池客户列表

```typescript
import { usePublicPoolCustomers } from '@/hooks/api/usePublicPool'

function MyComponent() {
  const { data, isLoading } = usePublicPoolCustomers({
    page: 1,
    pageSize: 20,
    region: '华东',
  })
  
  // 使用 data.data 访问客户列表
  // 使用 data.total 访问总数
}
```

### 领取客户

```typescript
import { useClaimCustomer } from '@/hooks/api/usePublicPool'

function MyComponent() {
  const claimMutation = useClaimCustomer()
  
  const handleClaim = () => {
    claimMutation.mutate({
      customerId: 'CUST-001',
      assignee: '李明',
    })
  }
}
```

### 退回客户

```typescript
import { useReturnToPool } from '@/hooks/api/usePublicPool'

function MyComponent() {
  const returnMutation = useReturnToPool()
  
  const handleReturn = () => {
    returnMutation.mutate({
      customerId: 'CUST-001',
      reason: '客户无需求',
    })
  }
}
```

## 后续优化建议

1. **后端 API 实现**
   - 实现公海池 CRUD API
   - 实现自动进入公海的定时任务
   - 实现保护期逻辑

2. **功能增强**
   - 添加批量领取功能
   - 添加公海池通知功能
   - 添加领取历史记录
   - 添加公海池数据统计图表

3. **权限控制**
   - 添加公海池访问权限控制
   - 添加领取权限控制（如限制每人每天领取数量）

4. **性能优化**
   - 添加虚拟滚动支持大数据量
   - 添加缓存策略
   - 添加增量更新

## 文件清单

```
src/
├── types/
│   ├── customer.ts (新增)
│   └── index.ts (更新)
├── pages/
│   └── customers/
│       ├── HighSeasPool.tsx (新增)
│       └── index.ts (新增)
├── hooks/
│   └── api/
│       ├── usePublicPool.ts (新增)
│       └── index.ts (更新)
└── routes/
    └── index.tsx (更新)
```

## 注意事项

1. 本实现使用了 Mock 数据，需要对接后端 API
2. 保护期逻辑在前端通过时间比较实现，后端需要实现真正的保护期验证
3. 自动进入公海的逻辑需要后端定时任务支持
4. 建议在生产环境添加完善的错误处理和加载状态
