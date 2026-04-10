# Mock 数据补充报告

## 📋 任务概述

为 CRM UI Upgrade 项目补充了 6 个核心业务模块的 Mock 数据和 API Hooks，支持前端列表页和详情页的正常开发和测试。

## 📁 创建文件列表

### 1️⃣ 客户管理模块

| 文件 | 路径 | 说明 |
|------|------|------|
| `customers.ts` | `src/mocks/customers.ts` | 客户 Mock 数据（35 条） |
| `useCustomers.ts` | `src/hooks/useCustomers.ts` | 客户 API Hook |

**Mock 数据字段**：
- 基本信息：名称、类型、行业、规模
- 联系信息：电话、邮箱、地址、网站
- 企业信息：统一信用代码、法人
- 状态：潜在客户/正式客户/沉默客户/流失客户
- 来源：网站/电话/推荐/广告/展会/社交媒体/其他
- 扩展字段：评分、标签、评级

**Hook 方法**：
- `useCustomers()` - 列表查询（支持分页、筛选、排序、搜索）
- `useCustomer(id)` - 详情查询
- `useCreateCustomer()` - 创建
- `useUpdateCustomer()` - 更新
- `useDeleteCustomer()` - 删除
- `useBatchDeleteCustomers()` - 批量删除
- `useImportCustomers()` - 导入
- `useExportCustomers()` - 导出
- `useCustomerStats()` - 统计

---

### 2️⃣ 商机管理模块

| 文件 | 路径 | 说明 |
|------|------|------|
| `opportunities.ts` | `src/mocks/opportunities.ts` | 商机 Mock 数据（25 条） |
| `useOpportunities.ts` | `src/hooks/useOpportunities.ts` | 商机 API Hook |

**Mock 数据字段**：
- 商机名称、客户 ID、联系人 ID
- 金额、阶段、优先级、赢单率
- 负责人、预计成交日期、实际成交日期
- 来源、产品列表、竞争对手
- 下一步行动、标签

**阶段**：初步接触 → 需求确认 → 方案报价 → 合同谈判 → 成交/失败

**Hook 方法**：
- `useOpportunities()` - 列表查询
- `useOpportunity(id)` - 详情查询
- `useCreateOpportunity()` - 创建
- `useUpdateOpportunity()` - 更新
- `useDeleteOpportunity()` - 删除
- `useAdvanceOpportunityStage()` - 推进阶段
- `useSalesFunnel()` - 销售漏斗
- `useOpportunityStats()` - 统计

---

### 3️⃣ 报价管理模块

| 文件 | 路径 | 说明 |
|------|------|------|
| `quotes.ts` | `src/mocks/quotes.ts` | 报价 Mock 数据（40 条） |
| `useQuotes.ts` | `src/hooks/useQuotes.ts` | 报价 API Hook |

**Mock 数据字段**：
- 报价单号、客户 ID、商机 ID
- 产品列表（含数量、单价、折扣、小计）
-  subtotal、discount、tax、total
- 状态：草稿/已发送/已接受/已拒绝/已过期
- 有效期、条款、交付日期、付款条件

**Hook 方法**：
- `useQuotes()` - 列表查询
- `useQuote(id)` - 详情查询
- `useCreateQuote()` - 创建
- `useUpdateQuote()` - 更新
- `useDeleteQuote()` - 删除
- `useSendQuote()` - 发送报价
- `useAcceptQuote()` - 接受报价
- `useRejectQuote()` - 拒绝报价
- `useDuplicateQuote()` - 复制报价
- `useQuoteStats()` - 统计

---

### 4️⃣ 联系人模块

| 文件 | 路径 | 说明 |
|------|------|------|
| `contacts.ts` | `src/mocks/contacts.ts` | 联系人 Mock 数据（40 条） |
| `useContacts.ts` | `src/hooks/useContacts.ts` | 联系人 API Hook |

**Mock 数据字段**：
- 姓名、职位、客户 ID
- 电话、手机号、邮箱、微信
- 部门、地址、生日
- 是否主要联系人
- 偏好、标签、联系记录

**Hook 方法**：
- `useContacts()` - 列表查询
- `useContact(id)` - 详情查询
- `useCreateContact()` - 创建
- `useUpdateContact()` - 更新
- `useDeleteContact()` - 删除
- `useSetAsPrimary()` - 设为主要联系人
- `useLogContact()` - 记录联系记录
- `useImportContacts()` - 导入
- `useContactStats()` - 统计

---

### 5️⃣ 产品模块

| 文件 | 路径 | 说明 |
|------|------|------|
| `products.ts` | `src/mocks/products.ts` | 产品 Mock 数据（25 条） |
| `useProducts.ts` | `src/hooks/useProducts.ts` | 产品 API Hook |

**Mock 数据字段**：
- 产品名称、编码、分类
- 描述、单价、成本价
- 单位、库存、最小起订量
- 交货周期、供应商
- 状态：上架/下架
- 规格参数、标签

**分类**：软件、硬件、服务、解决方案、模块、增值服务

**Hook 方法**：
- `useProducts()` - 列表查询
- `useProduct(id)` - 详情查询
- `useCreateProduct()` - 创建
- `useUpdateProduct()` - 更新
- `useDeleteProduct()` - 删除
- `useActivateProduct()` - 上架
- `useDeactivateProduct()` - 下架
- `useAdjustStock()` - 调整库存
- `useProductStats()` - 统计
- `useCategoryStats()` - 分类统计

---

### 6️⃣ 用户管理模块

| 文件 | 路径 | 说明 |
|------|------|------|
| `users.ts` | `src/mocks/users.ts` | 用户 Mock 数据（15 条用户 + 8 个角色） |
| `useUsers.ts` | `src/hooks/useUsers.ts` | 用户 API Hook |

**Mock 数据字段**：
- 用户名、邮箱、手机号、姓名
- 性别、头像、部门、职位
- 角色列表、数据权限范围
- 状态：active/inactive/frozen
- 上级、入职日期、最后登录

**角色**：系统管理员、销售总监、销售经理、销售代表、产品经理、客服专员、财务专员、普通用户

**数据权限**：all（全部）、department（部门）、own（个人）

**Hook 方法**：
- `useUsers()` - 列表查询
- `useUser(id)` - 详情查询
- `useCreateUser()` - 创建
- `useUpdateUser()` - 更新
- `useDeleteUser()` - 删除
- `useActivateUser()` - 激活
- `useDeactivateUser()` - 停用
- `useFreezeUser()` - 冻结
- `useResetPassword()` - 重置密码
- `useAssignRoles()` - 分配角色
- `useUserStats()` - 统计
- `useRoles()` - 角色列表

---

## 📊 数据量汇总

| 模块 | Mock 数据量 | 文件数 |
|------|-----------|--------|
| 客户管理 | 35 条 | 2 |
| 商机管理 | 25 条 | 2 |
| 报价管理 | 40 条 | 2 |
| 联系人 | 40 条 | 2 |
| 产品 | 25 条 | 2 |
| 用户管理 | 15 条用户 + 8 个角色 | 2 |
| **合计** | **180 条** | **12** |

---

## 🎯 Mock API Hook 统一规范

每个 Hook 模块遵循以下统一规范：

```typescript
// 列表查询
function useModuleList(params?: ListParams) {
  return {
    data: [],
    loading: false,
    error: null,
    pagination: { page, pageSize, total },
  };
}

// 详情查询
function useModule(id: string) {
  return { data: null, loading: false, error: null };
}

// 创建
function useCreateModule() {
  const create = async (data: any) => { /* Mock 实现 */ };
  return { create };
}

// 更新
function useUpdateModule() {
  const update = async (id: string, data: any) => { /* Mock 实现 */ };
  return { update };
}

// 删除
function useDeleteModule() {
  const deleteFn = async (id: string) => { /* Mock 实现 */ };
  return { delete: deleteFn };
}
```

---

## ✅ 实现特点

### 1. 参考项目 B 的数据结构
- 采用与项目 B 一致的字段命名和数据结构
- 保持类型定义的完整性

### 2. 适配项目 A 的代码风格
- 使用 TypeScript 严格类型定义
- 遵循项目 A 的文件组织方式（`src/mocks/` 和 `src/hooks/`）
- 采用 React Query 进行状态管理
- 统一的延迟模拟（300-500ms）

### 3. Mock 数据真实可信
- 不同的名称、金额、日期等
- 覆盖各种业务场景和状态
- 包含边界情况（如离职用户、冻结账号、失败商机等）

### 4. TypeScript 类型定义完整
- 所有接口都有完整的类型定义
- 支持智能提示和类型检查
- 导出配置对象供 UI 使用

### 5. 支持列表页正常加载
- 实现完整的 CRUD 操作
- 支持分页、筛选、排序、搜索
- 提供统计和汇总数据

---

## 🔧 使用示例

### 客户列表页

```tsx
import { useCustomers, useDeleteCustomer } from '@/hooks/useCustomers'

function CustomerList() {
  const { data, isLoading, error } = useCustomers({
    page: 1,
    pageSize: 20,
    status: '活跃',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  })
  
  const { mutate: deleteCustomer } = useDeleteCustomer()
  
  // ...
}
```

### 商机详情页

```tsx
import { useOpportunity, useAdvanceOpportunityStage } from '@/hooks/useOpportunities'

function OpportunityDetail({ id }) {
  const { data: opportunity, isLoading } = useOpportunity(id)
  const { mutate: advanceStage } = useAdvanceOpportunityStage()
  
  // ...
}
```

---

## 📝 验证结果

所有 Mock 数据和 Hooks 已完成以下验证：

- ✅ TypeScript 编译通过
- ✅ 类型定义完整
- ✅ 数据结构一致
- ✅ CRUD 操作完整
- ✅ 支持分页、筛选、排序、搜索
- ✅ 提供统计和汇总功能

---

## 📂 文件路径汇总

```
C:\Users\13609\Projects\crm-ui-upgrade\
├── src/
│   ├── mocks/
│   │   ├── customers.ts      ✅ 35 条
│   │   ├── opportunities.ts  ✅ 25 条
│   │   ├── quotes.ts         ✅ 40 条
│   │   ├── contacts.ts       ✅ 40 条
│   │   ├── products.ts       ✅ 25 条
│   │   └── users.ts          ✅ 15 条用户 + 8 角色
│   └── hooks/
│       ├── useCustomers.ts    ✅
│       ├── useOpportunities.ts ✅
│       ├── useQuotes.ts       ✅
│       ├── useContacts.ts     ✅
│       ├── useProducts.ts     ✅
│       └── useUsers.ts        ✅
└── docs/
    └── Mock 数据补充报告.md   ✅ 本报告
```

---

## 🎉 完成

所有 6 个模块的 Mock 数据和 API Hooks 已补充完成，可以支持前端列表页和详情页的正常开发和测试。

**报告生成时间**: 2024-04-09
**执行人**: Subagent
