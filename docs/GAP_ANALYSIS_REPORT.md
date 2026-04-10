# CRM 项目业务功能差距分析报告

**分析日期**: 2026-04-08  
**原项目**: `crm2026-4-3new`  
**当前项目**: `crm-ui-upgrade`  
**分析维度**: 页面/路由、业务功能、组件、Hooks/API、UI交互

---

## 📌 执行摘要

当前项目 (`crm-ui-upgrade`) 是原项目 (`crm2026-4-3new`) 的 UI 升级版本，主要升级了前端组件库（迁移至 shadcn/ui + Tailwind CSS）和项目架构（Vite + React Router v6 懒加载路由）。但本次升级**大幅裁剪了业务功能**，存在大量页面、组件、Hooks、类型定义和 Mock 数据的缺失，核心 CPQ 报价模块、完整设置系统、自定义对象系统几乎为空白。

**GAP 总体评估**：
- 🔴 **P0 严重缺失**: 21 项
- 🟠 **P1 重要缺失**: 15 项
- 🟡 **P2 一般缺失**: 9 项

---

## 一、页面/路由对比

### 1.1 原项目有，当前项目缺失的页面

#### 🔴 P0 — 核心业务页面缺失

| 页面 | 原项目路径 | 缺失说明 |
|------|-----------|---------|
| **QuoteDetail** | `pages/QuoteDetail.tsx` | 报价单详情页，完全缺失 |
| **QuoteNew** | `pages/QuoteNew.tsx` | 新建报价单页，完全缺失 |
| **QuoteBuilder** | `pages/quotes/QuoteBuilder.tsx` | CPQ 报价构建器，缺失 |
| **ProductForm** | `components/Product/ProductForm.tsx` | 产品表单（独立页），旧项目有独立页 |
| **PricebookForm** | `components/Pricebook/PricebookForm.tsx` | 价格表表单，旧项目有独立页 |
| **WorkflowList** | `pages/settings/WorkflowList.tsx` | 工作流列表（设置菜单下），缺失 |
| **WorkflowEditor** | `pages/settings/WorkflowEditor.tsx` | 工作流编辑器，缺失 |
| **WorkflowLogs** | `pages/settings/WorkflowLogs.tsx` | 工作流日志，缺失 |
| **CustomObjects** | `pages/settings/CustomObjects.tsx` | 自定义对象管理，缺失 |
| **CreateCustomObject** | `pages/settings/CreateCustomObject.tsx` | 创建自定义对象，缺失 |
| **ObjectConfig** | `pages/settings/ObjectConfig.tsx` | 对象配置，缺失 |
| **ObjectFields** | `pages/settings/ObjectFields.tsx` | 对象字段管理，缺失 |
| **ObjectData** | `pages/settings/ObjectData.tsx` | 对象数据管理，缺失 |
| **ObjectRelationships** | `pages/settings/ObjectRelationships.tsx` | 对象关联管理，缺失 |
| **FormDesigner** | `pages/settings/FormDesigner.tsx` | 表单设计器，缺失 |
| **PageBuilder** | `pages/settings/PageBuilder.tsx` | 页面构建器，缺失 |
| **PipelineManager** | `pages/settings/PipelineManager.tsx` | 管道管理器，缺失 |
| **ViewManager** | `pages/settings/ViewManager.tsx` | 视图管理器，缺失 |

#### 🟠 P1 — AI 功能与营销模块页面缺失

| 页面 | 原项目路径 | 当前项目状态 |
|------|-----------|------------|
| **AIAnalytics** | `pages/ai/AIAnalytics.tsx` | ❌ 缺失 |
| **AIAssistant** | `pages/ai/AIAssistant.tsx` | ❌ 缺失 |
| **AIConfig** | `pages/ai/AIConfig.tsx` | ❌ 缺失（当前项目仅有路由注册，无页面文件） |
| **AIDashboard** | `pages/ai/AIDashboard.tsx` | ❌ 缺失（当前项目仅有路由注册，无页面文件） |
| **AIHistory** | `pages/ai/AIHistory.tsx` | ❌ 缺失（当前项目仅有路由注册，无页面文件） |
| **AIModels** | `pages/ai/AIModels.tsx` | ❌ 缺失（当前项目仅有路由注册，无页面文件） |
| **AIPromptTemplates** | `pages/ai/AIPromptTemplates.tsx` | ❌ 缺失（当前项目仅有路由注册，无页面文件） |
| **AIUsage** | `pages/ai/AIUsage.tsx` | ❌ 缺失（当前项目仅有路由注册，无页面文件） |
| **EmailTemplates** | `pages/EmailTemplates.tsx` | ⚠️ 当前为 `EmailList`，功能不同 |
| **CampaignsList** | `pages/CampaignsList.tsx` | ⚠️ 当前为 `CampaignList`，命名不同 |

#### 🟡 P2 — 系统管理页面缺失

| 页面 | 原项目路径 | 当前项目状态 |
|------|-----------|------------|
| **AuditLog** | `pages/settings/AuditLog.tsx` | ❌ 缺失（当前仅有路由占位 `/settings/audit-log` → redirect） |
| **LoginLog** | `pages/settings/LoginLog.tsx` | ❌ 缺失（当前仅有路由占位 `/settings/login-log` → redirect） |
| **Users** | `pages/settings/Users.tsx` | ❌ 缺失（当前仅有路由占位） |
| **CustomFields** | `pages/settings/CustomFields.tsx` | ❌ 缺失（当前仅有路由占位 `/settings/fields`） |
| **Profile** | `pages/settings/Profile.tsx` | ⚠️ 当前为 `ProfileSettings` |
| **ChangePassword** | `pages/settings/ChangePassword.tsx` | ⚠️ 当前为 `SecuritySettings` 子路由 |
| **DisplayPreferences** | `pages/settings/DisplayPreferences.tsx` | ⚠️ 当前为 `PreferencesSettings` |
| **NotificationPreferences** | `pages/settings/NotificationPreferences.tsx` | ⚠️ 当前为 `NotificationSettings` |
| **Roles** | `pages/settings/Roles.tsx` | ⚠️ 当前为 `RoleManagement`（功能可能不同） |

### 1.2 路由结构对比

| 维度 | 原项目 | 当前项目 |
|------|--------|---------|
| 路由框架 | React Router v6（集中式） | React Router v6（集中式，懒加载） |
| 报价路由 | `/quote/list`, `/quote/new`, `/quote/:id`, `/quote/:id/edit` | 仅 `/quote/list` |
| 工作流路由 | `/automation/workflows`, `/automation/workflows/new`, `/settings/workflow/*` | 仅 `/automation/workflows` |
| 自定义对象 | `/settings/custom-objects/*` | 仅占位 redirect |
| AI 路由 | `/ai/*` (14个子路由) | `/ai/*` (18个子路由，但页面文件大量缺失) |
| 设置路由 | `/settings/profile`, `/settings/users`, `/settings/roles`, `/settings/custom-objects`, `/settings/audit-log`, `/settings/login-log`, `/settings/workflow/*` 等 | `/settings/profile`, `/settings/users`, `/settings/roles`, `/settings/permissions`，其余均 redirect 至 `/settings` |

---

## 二、业务功能对比

### 2.1 CRUD 功能完整性

| 模块 | 原项目 | 当前项目 | 差距 |
|------|--------|---------|------|
| **客户** | ✅ 完整 CRUD + 高级筛选 | ✅ 完整 CRUD | 功能对等 |
| **联系人** | ✅ 完整 CRUD | ✅ 完整 CRUD | 功能对等 |
| **线索** | ✅ 完整 CRUD + 分配 + 评分 | ✅ 完整 CRUD + 分配 + 评分 | 功能对等 |
| **商机** | ✅ 完整 CRUD + 看板 | ✅ 完整 CRUD + 看板 | 功能对等 |
| **活动** | ✅ 完整 CRUD | ✅ 完整 CRUD | 功能对等 |
| **合同** | ✅ 完整 CRUD + 付款计划 | ✅ 完整 CRUD + 付款计划 | 功能对等 |
| **回款** | ✅ 完整 CRUD + 付款进度 | ✅ 完整 CRUD + 付款进度 | 功能对等 |
| **订单** | ✅ 完整 CRUD | ✅ 完整 CRUD | 功能对等 |
| **产品** | ✅ 完整 CRUD + 表单 | ✅ 完整 CRUD，无独立表单页 | ⚠️ 独立表单页缺失 |
| **价格表** | ✅ 完整 CRUD + PricebookEntry | ✅ 完整 CRUD，无独立表单页 | ⚠️ 独立表单页缺失 |
| **报价单** | ✅ 完整 CRUD + CPQ 构建器 + 计算器 + 预览 | ❌ **仅列表页**，无详情/新建/编辑 | 🔴 严重缺失 |
| **自定义对象** | ✅ 完整 CRUD + 字段管理 + 关联管理 + 表单设计器 + 页面构建器 + 视图管理 | ❌ **无独立页面**，设置菜单占位 redirect | 🔴 严重缺失 |
| **工作流** | ✅ 可视化编辑器 + 日志查看 | ❌ 仅列表页，无编辑器和日志 | 🔴 严重缺失 |

### 2.2 业务逻辑差异

| 差异点 | 原项目 | 当前项目 |
|--------|--------|---------|
| **CPQ 报价逻辑** | 有完整 ProductSelector、QuoteCalculator、QuotePreview 组件 | ❌ 完全缺失 |
| **自定义对象逻辑** | 有完整的对象创建、字段设计、表单设计、页面布局、视图、数据管理流程 | ❌ 仅有路由占位 |
| **工作流引擎** | 有 FlowCanvas、FlowNodes、NodePanel、PropertyPanel 完整可视化编辑器 | ❌ 仅有 WorkflowList |
| **权限矩阵** | 有 PermissionMatrix 组件，可视化权限配置 | ❌ 缺失 PermissionMatrix |
| **线索查重** | 有 DuplicateCheckModal 组件 | ❌ 缺失 |
| **AI 分析** | 有完整的 AI Analytics、Assistant、Dashboard、History、Models、Usage 等页面 | ❌ 仅有路由注册，无页面文件 |

### 2.3 数据模型差异

#### 🔴 当前项目缺失的核心类型文件 (`src/types/`)

```
❌ ai-agents.ts    — AI Agent 类型定义
❌ ai.ts            — AI 通用类型定义
❌ callcenter.ts    — 呼叫中心类型定义
❌ cpq.ts           — CPQ 报价类型定义
❌ customField.ts   — 自定义字段类型定义
❌ customObject.ts — 自定义对象类型定义
❌ dashboard.ts    — 仪表盘类型定义
❌ knowledge.ts    — 知识库类型定义
❌ marketing.ts    — 营销类型定义
❌ permission.ts   — 权限类型定义
❌ pricebook.ts    — 价格表类型定义
❌ settings.ts     — 设置类型定义
❌ ticket.ts       — 工单类型定义
❌ workflow.ts      — 工作流类型定义
```

**当前项目有但原项目无的类型**: `activity.ts`, `api.ts`, `contact.ts`, `contract.ts`, `customer.ts`, `index.ts`, `lead.ts`, `opportunity.ts`, `order.ts`, `payment.ts`, `report.ts`, `services.ts`

---

## 三、组件对比

### 3.1 原项目有，当前项目缺失的功能组件

| 组件目录 | 组件名 | 当前项目状态 |
|---------|--------|------------|
| **PermissionMatrix** | `PermissionMatrix.tsx` | ❌ 缺失（权限可视化配置矩阵） |
| **WorkflowEditor** | `ConnectionLine.tsx` | ❌ 缺失 |
| **WorkflowEditor** | `FlowCanvas.tsx` | ❌ 缺失 |
| **WorkflowEditor** | `FlowNodes.tsx` | ❌ 缺失 |
| **WorkflowEditor** | `NodePanel.tsx` | ❌ 缺失 |
| **WorkflowEditor** | `PropertyPanel.tsx` | ❌ 缺失 |
| **WorkflowEditor** | `types.ts` | ❌ 缺失 |
| **CPQ** | `ProductSelector.tsx` | ❌ 缺失（目录存在但为空） |
| **CPQ** | `QuoteCalculator.tsx` | ❌ 缺失（目录存在但为空） |
| **CPQ** | `QuotePreview.tsx` | ❌ 缺失（目录存在但为空） |
| **Dashlet** | `ContractDashlet.tsx` | ❌ 缺失 |
| **Dashlet** | `CustomerDistDashlet.tsx` | ❌ 缺失 |
| **Dashlet** | `FunnelDashlet.tsx` | ❌ 缺失 |
| **Dashlet** | `LeadTrendDashlet.tsx` | ❌ 缺失 |
| **Dashlet** | `PaymentWarningDashlet.tsx` | ❌ 缺失 |
| **Dashlet** | `PerformanceDashlet.tsx` | ❌ 缺失 |
| **Dashlet** | `SalesOverviewDashlet.tsx` | ❌ 缺失 |
| **Dashlet** | `TaskDashlet.tsx` | ❌ 缺失 |
| **Dashlet** | `TodoDashlet.tsx` | ❌ 缺失 |
| **Permission** | `RoleForm.tsx` | ❌ 缺失 |
| **Permission** | `UserRoleAssign.tsx` | ❌ 缺失 |
| **Permission** | `PermissionTree.tsx` | ⚠️ 当前在 `components/PermissionTree/` |
| **Lead** | `DuplicateCheckModal.tsx` | ❌ 缺失 |
| **Marketing** | `WorkflowBuilder.tsx` | ❌ 缺失 |
| **Charts** | `FunnelChart.tsx` | ❌ 缺失 |
| **KanbanBoard** | `index.tsx` | ⚠️ 目录存在但为空 |

### 3.2 当前项目有，原项目无的组件

| 组件 | 说明 |
|------|------|
| `components/ui/*` (shadcn/ui) | 完整的 shadcn/ui 组件库（Button, Dialog, Select, Table, Tabs, etc.） |
| `components/FilterBar/*` | FilterBuilder, FilterTags, LoadFilterDialog, SaveFilterDialog |
| `components/bulk/*` | BulkAssignDialog, BulkDeleteDialog, BulkStatusDialog |
| `components/drawer/Sheet.tsx` | 抽屉组件 |
| `components/form/*` | FormProvider, FormField, FormLabel, FormError |
| `components/timeline/Timeline.tsx` | 时间线组件 |
| `components/steps/Steps.tsx` | 步骤组件 |
| `components/collapse/Accordion.tsx` | 手风琴组件 |
| `components/providers/QueryProvider.tsx` | React Query 提供者 |
| `hooks/api/*` | 完整的 API Hooks 集合 |

---

## 四、Hooks/API 对比

### 4.1 缺失的 Hooks（API 层）

| Hook | 原项目 | 当前项目 |
|------|--------|---------|
| `useAuditLogs` | ✅ `api/useAuditLogs.ts` | ❌ 缺失 |
| `useLoginLogs` | ✅ `api/useLoginLogs.ts` | ❌ 缺失 |
| `usePermissions` | ✅ `api/usePermissions.ts` | ⚠️ 路由存在，无独立 Hook |
| `useRoles` | ✅ `api/useRoles.ts` | ⚠️ 路由存在，无独立 Hook |
| `useUsers` | ✅ `api/useUsers.ts` | ⚠️ 路由存在，无独立 Hook |
| `useCustomFields` | ✅ `api/useCustomFields.ts` | ✅ 存在 |
| `useCustomObjects` | ✅ `api/useCustomObjects.ts` | ✅ 存在 |
| `useWorkflows` | ✅ `api/useWorkflows.ts` | ✅ 存在 |

**当前项目有而原项目无的 Hooks**：useActivities, useAI, useCallcenter, useContacts, useContracts, useCustomers, useLeads, useMarketing, useOpportunities, useOrders, usePayments, usePricebooks, useProducts, useReports, useSettings, useTickets

### 4.2 Services 层对比

| Service | 原项目 | 当前项目 |
|---------|--------|---------|
| `base.ts` | ✅ | ❌ 缺失 |
| `callcenterService.ts` | ✅ | ✅ 存在 |
| `customFieldService.ts` | ✅ | ✅ 存在 |
| `knowledgeService.ts` | ✅ | ✅ 存在 |
| `ticketService.ts` | ✅ | ✅ 存在 |
| `pricebookService.ts` | ✅ | ❌ 缺失 |
| `productService.ts` | ✅ | ❌ 缺失 |

---

## 五、UI/交互对比

### 5.1 原项目特色 UI 组件

| 组件 | 功能描述 | 当前项目 |
|------|---------|---------|
| **PermissionMatrix** | 可视化权限配置矩阵，支持角色 × 权限交叉视图 | ❌ 完全缺失 |
| **WorkflowEditor** (FlowCanvas + FlowNodes) | 可视化工作流编辑器，支持拖拽节点、连接线、属性配置 | ❌ 完全缺失 |
| **KanbanBoard** | 看板视图（商机等） | ⚠️ 目录存在但为空实现 |
| **CPQ 组件组** (ProductSelector + QuoteCalculator + QuotePreview) | 报价构建器：产品选择 → 价格计算 → 报价预览 | ❌ 完全缺失 |
| **Dashlet 组件组** | 仪表盘小部件（8种Dashlet） | ❌ 完全缺失 |
| **DuplicateCheckModal** | 线索查重弹窗 | ❌ 缺失 |
| **Lead Duplicate Check** | 线索重复检查交互 | ❌ 缺失 |
| **FunnelChart** | 漏斗图（销售管道可视化） | ❌ 缺失 |

### 5.2 当前项目的 UI 优势

| 特性 | 说明 |
|------|------|
| **shadcn/ui 组件库** | 完整的 Radix UI + Tailwind CSS 组件库，UI 质量大幅提升 |
| **FilterBar 组件** | 高级筛选构建器，支持保存/加载筛选条件 |
| **Bulk Operations** | 批量分配/删除/状态更新对话框 |
| **DataTable 虚拟化** | VirtualDataTable 支持大数据量 |
| **Sheet/Drawer** | 侧边抽屉交互 |
| **Timeline** | 时间线组件 |
| **QueryProvider** | 统一的 React Query 数据获取层 |

---

## 六、Mock 数据对比

### 🔴 当前项目缺失的 Mock 数据文件

```
❌ activityData.ts
❌ aiAgentsData.ts
❌ aiData.ts
❌ callcenterData.ts
❌ contactData.ts
❌ contractData.ts
❌ cpqData.ts          — CPQ 报价 Mock
❌ customerData.ts
❌ customFieldData.ts
❌ customObjectsData.ts — 自定义对象 Mock
❌ dashboardData.ts
❌ knowledgeData.ts
❌ leadData.ts
❌ marketingData.ts
❌ opportunityData.ts
❌ orderData.ts
❌ paymentData.ts
❌ permissionData.ts
❌ pricebookData.ts
❌ reportData.ts
❌ settingsData.ts
❌ ticketData.ts
❌ workbench.ts
❌ workflowData.ts
```

> 当前项目完全未实现任何 Mock 数据层。原项目的 mock 目录包含 25 个 Mock 数据文件，涵盖所有业务模块。

---

## 七、补齐建议（按优先级）

### 🔴 P0 — 必须立即补齐（核心业务闭环）

| # | 缺失项 | 补齐建议 | 工作量 |
|---|--------|---------|--------|
| 1 | **QuoteDetail / QuoteNew / QuoteBuilder** | 从原项目迁移 `pages/quotes/QuoteBuilder.tsx` 和 `pages/QuoteDetail.tsx`，补充路由 | 高 |
| 2 | **CPQ 组件组** | 从原项目迁移 `ProductSelector`、`QuoteCalculator`、`QuotePreview` 到 `components/CPQ/` | 中 |
| 3 | **自定义对象系统** | 从原项目迁移 `pages/settings/CustomObjects.*`、`ObjectConfig`、`ObjectFields`、`ObjectRelationships` | 高 |
| 4 | **工作流编辑器** | 从原项目迁移 `components/WorkflowEditor/*` 全部 6 个文件 | 中 |
| 5 | **PermissionMatrix** | 从原项目迁移 `components/PermissionMatrix/PermissionMatrix.tsx` | 低 |
| 6 | **Settings 占位页面** | 实现 AuditLog、LoginLog、Users、CustomFields 或给出明确的产品决策（保留/移除） | 中 |

### 🟠 P1 — 重要功能（增强用户体验）

| # | 缺失项 | 补齐建议 | 工作量 |
|---|--------|---------|--------|
| 7 | **AI 页面文件** | 从原项目迁移 `AIAnalytics`、`AIAssistant`、`AIDashboard`、`AIHistory`、`AIModels`、`AIPromptTemplates`、`AIUsage`、`AIConfig` 到 `pages/ai/` | 高 |
| 8 | **Dashlet 组件组** | 从原项目迁移 8 个 Dashlet 组件到 `components/Dashlet/` | 中 |
| 9 | **FunnelChart** | 从原项目迁移 `components/Charts/FunnelChart.tsx` | 低 |
| 10 | **Lead DuplicateCheckModal** | 从原项目迁移 `components/Lead/DuplicateCheckModal.tsx` | 低 |
| 11 | **AuditLog / LoginLog Hooks** | 补充 `useAuditLogs`、`useLoginLogs` API Hooks | 低 |
| 12 | **Missing Types** | 补充 `types/` 下缺失的 14 个类型文件（ai-agents, callcenter, cpq, customField, customObject, dashboard, knowledge, marketing, permission, pricebook, settings, ticket, workflow） | 中 |

### 🟡 P2 — 优化项（体验完善）

| # | 缺失项 | 补齐建议 | 工作量 |
|---|--------|---------|--------|
| 13 | **Mock 数据层** | 为当前项目补充 `src/mock/` 目录，至少覆盖主要业务模块的 Mock 数据 | 中 |
| 14 | **WorkflowList/Logs 页面** | 从原项目迁移 `pages/settings/WorkflowList.tsx` 和 `WorkflowLogs.tsx` | 低 |
| 15 | **ProductForm/PricebookForm 独立页** | 补充 `products/:id/edit` 和 `pricebooks/:id/edit` 路由的独立表单页 | 低 |
| 16 | **营销 EmailTemplates** | 确认 `pages/marketing/EmailList` 与原项目 `pages/EmailTemplates` 功能是否等价 | 低 |
| 17 | **KanbanBoard 实现** | 补充 `components/KanbanBoard/index.tsx` 实现或移除空目录 | 低 |
| 18 | **pricebookService / productService** | 补充 `services/` 下缺失的服务层文件 | 低 |

---

## 八、总结矩阵

| 维度 | 原项目完整度 | 当前项目完整度 | GAP |
|------|------------|------------|-----|
| 页面/路由 | 100% | ~55% | 45% 功能缺失 |
| 业务功能（CRUD） | 100% | ~75% | 核心 CPQ/自定义对象/工作流编辑缺失 |
| 组件 | 100% | ~60% | PermissionMatrix/WorkflowEditor/CPQ/Dashlet 缺失 |
| Hooks/API | 100% | ~70% | AuditLogs/LoginLogs/Types 缺失 |
| Mock 数据 | 100% | ~0% | 全部缺失 |
| UI 组件库 | 旧版 | shadcn/ui ✅ | UI 质量提升，但功能未跟上 |

**核心结论**：当前项目在 UI 升级上成果显著（shadcn/ui + Tailwind），但在功能迁移上存在重大缺口。**最优先补齐的是 CPQ 报价模块和自定义对象系统**，这两个是 CRM 的核心差异化功能，对业务闭环至关重要。

---

*报告生成时间: 2026-04-08 10:52 GMT+8*
