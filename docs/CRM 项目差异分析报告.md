# CRM 项目差异分析报告

**分析时间**: 2026-04-09 14:33 GMT+8  
**分析人**: AI 产品助理  

---

## 一、概述

### 项目基本信息

| 维度 | 项目 A (crm-ui-upgrade) | 项目 B (crm2026-4-3new) |
|------|------------------------|------------------------|
| **路径** | `C:\Users\13609\Projects\crm-ui-upgrade` | `C:\Users\13609\.openclaw\workspace\crm2026-4-3new` |
| **页面文件数量** | 135 个 | 104 个 |
| **Service 文件数量** | 10 个 | 6 个 |
| **Store 文件数量** | 5 个 | 2 个 |
| **Hooks 文件数量** | 26 个 | 11 个 |
| **UI 框架** | shadcn/ui + Tailwind CSS | Ant Design |
| **图标库** | lucide-react | @ant-design/icons |
| **布局组件** | 自定义 Sidebar + MainLayout | Ant Design Layout |

### 核心架构差异

| 方面 | 项目 A | 项目 B |
|------|--------|--------|
| **样式方案** | Tailwind CSS + shadcn/ui 组件 | Ant Design 组件库 + 自定义样式 |
| **状态管理** | 多 store 分离 (app/auth/form/ui) | 简化 store (customObjects/workflows) |
| **国际化** | 未明确使用 | 使用 react-i18next |
| **响应式** | 自定义折叠逻辑 | Ant Design 响应式 + 移动端抽屉 |

---

## 二、菜单结构对比

### 2.1 配置文件位置

| 项目 | 配置文件 | 配置方式 |
|------|---------|---------|
| 项目 A | `src/components/Layout/Sidebar.tsx` | `navigationConfig` 常量数组 |
| 项目 B | `src/components/Layout/MainLayout.tsx` | `getMenuItems()` 函数 (支持 i18n) |

### 2.2 菜单项对比

#### 一级菜单对比

| 序号 | 项目 A 菜单项 | 项目 B 菜单项 | 状态 |
|------|------------|------------|------|
| 1 | 工作台 | 工作台 | ✅ 一致 |
| 2 | 客户管理 | 客户管理 | ✅ 一致 |
| 3 | 销售管理 | 销售管理 | ✅ 一致 |
| 4 | 订单管理 | 订单管理 | ✅ 一致 |
| 5 | 产品与定价 | 产品与定价 | ✅ 一致 |
| 6 | 报表中心 | 报表中心 | ✅ 一致 |
| 7 | 智能 AI | 智能 AI | ✅ 一致 |
| 8 | 自动化 | 自动化 | ✅ 一致 |
| 9 | 营销自动化 | 营销自动化 | ✅ 一致 |
| 10 | 集成 | 集成 | ✅ 一致 |
| 11 | 系统设置 | 系统设置 | ⚠️ 部分差异 |

#### 二级菜单详细对比

##### 工作台

| 项目 A | 项目 B | 状态 |
|--------|--------|------|
| 销售工作台 | 销售工作台 | ✅ 一致 |
| 仪表盘 | 仪表盘 | ✅ 一致 |

##### 客户管理

| 项目 A | 项目 B | 状态 |
|--------|--------|------|
| 客户列表 | 客户列表 | ✅ 一致 |
| 联系人列表 | 联系人列表 | ✅ 一致 |

##### 销售管理

| 项目 A | 项目 B | 状态 |
|--------|--------|------|
| 线索管理 | 线索管理 | ✅ 一致 |
| 机会管理 | 机会管理 | ✅ 一致 |
| 活动记录 | 活动记录 | ✅ 一致 |

##### 订单管理

| 项目 A | 项目 B | 状态 |
|--------|--------|------|
| 订单列表 | 订单列表 | ✅ 一致 |
| 报价单 | 报价单 | ✅ 一致 |
| 合同管理 | 合同管理 | ✅ 一致 |
| 付款管理 | 付款管理 | ✅ 一致 |

##### 产品与定价

| 项目 A | 项目 B | 状态 |
|--------|--------|------|
| 产品库 | 产品库 | ✅ 一致 |
| 价格表 | 价格表 | ✅ 一致 |

##### 报表中心

| 项目 A | 项目 B | 状态 |
|--------|--------|------|
| 销售漏斗 | 销售漏斗 | ✅ 一致 |
| 业绩统计 | 业绩统计 | ✅ 一致 |
| 客户分析 | 客户分析 | ✅ 一致 |
| 活动报表 | 活动报表 | ✅ 一致 |
| 线索转化 | 线索转化 | ✅ 一致 |
| 付款报表 | 付款报表 | ✅ 一致 |

##### 智能 AI

| 项目 A | 项目 B | 状态 |
|--------|--------|------|
| 智能线索分配 | 智能线索分配 | ✅ 一致 |
| 线索评分 AI | 线索评分 AI | ✅ 一致 |
| 销售预测 AI | 销售预测 AI | ✅ 一致 |
| 客户细分 AI | 客户细分 AI | ✅ 一致 |
| 流失预警 | 流失预警 | ✅ 一致 |
| 会议助手 | 会议助手 | ✅ 一致 |
| 预测性 AI | 预测性 AI | ✅ 一致 |
| AI 代理 | AI 代理 | ✅ 一致 |

##### 自动化

| 项目 A | 项目 B | 状态 |
|--------|--------|------|
| 工作流 | 工作流 | ✅ 一致 |
| 执行日志 | 执行日志 | ✅ 一致 |

##### 营销自动化

| 项目 A | 项目 B | 状态 |
|--------|--------|------|
| 营销活动 | 营销活动 | ✅ 一致 |
| 邮件模板 | 邮件模板 | ✅ 一致 |
| 目标列表 | 目标列表 | ✅ 一致 |

##### 集成

| 项目 A | 项目 B | 状态 |
|--------|--------|------|
| 工单系统 | 工单系统 | ✅ 一致 |
| 知识库 | 知识库 | ✅ 一致 |
| 呼叫中心 | 呼叫中心 | ✅ 一致 |

##### 系统设置 (差异较大)

| 项目 A | 项目 B | 状态 |
|--------|--------|------|
| 个人资料 | 个人资料 | ✅ 一致 |
| 安全设置 | 安全设置 | ❌ 项目 B 缺失 |
| 偏好设置 | 偏好设置 | ❌ 项目 B 缺失 |
| 通知设置 | 通知设置 | ✅ 一致 |
| 邮件设置 | 邮件设置 | ❌ 项目 B 缺失 |
| 主题设置 | 主题设置 | ❌ 项目 B 缺失 |
| 字段设置 | 字段设置 | ❌ 项目 B 缺失 |
| 布局设置 | 布局设置 | ❌ 项目 B 缺失 |
| 角色管理 | 角色管理 | ✅ 一致 |
| 用户管理 | 用户管理 | ✅ 一致 |
| 权限管理 | 权限管理 | ✅ 一致 |
| - | 自定义字段 | 🔥 项目 B 新增 |
| - | 自定义对象 | 🔥 项目 B 新增 |
| - | 操作日志 | 🔥 项目 B 新增 |
| - | 登录日志 | 🔥 项目 B 新增 |

### 2.3 菜单实现差异

| 特性 | 项目 A | 项目 B |
|------|--------|--------|
| **图标库** | lucide-react (11 个图标) | @ant-design/icons (20+ 个图标) |
| **折叠交互** | 自定义 Collapsible 组件 | Ant Design Menu inlineCollapsed |
| **移动端支持** | 未明确实现 | Drawer 抽屉式侧边栏 |
| **国际化** | 硬编码中文 | 使用 t() 函数支持多语言 |
| **用户菜单** | DropdownMenu (个人中心/账户设置/退出) | Ant Design Dropdown (类似) |
| **搜索功能** | 未实现 | 全局搜索框 |
| **通知中心** | 未实现 | 通知徽章 + 下拉列表 |
| **面包屑** | 未实现 | 自动生成面包屑导航 |

---

## 三、路由配置对比

### 3.1 配置文件结构

| 项目 | 文件路径 | 导出方式 |
|------|---------|---------|
| 项目 A | `src/constants/routes.ts` | 模块化常量对象 |
| 项目 B | `src/constants/routes.ts` | 单一 ROUTES 对象 |

### 3.2 路由定义方式对比

#### 项目 A - 模块化导出

```typescript
// 示例：客户管理
export const CUSTOMER = {
  LIST: '/customer/list',
  DETAIL: '/customer/:id',
  NEW: '/customer/new',
  EDIT: '/customer/:id/edit',
} as const

// 示例：AI 功能
export const AI = {
  CONFIG: '/ai/config',
  HISTORY: '/ai/history',
  PROMPTS: '/ai/prompts',
  ASSISTANT: '/ai/assistant',
  // ... 更多
} as const
```

#### 项目 B - 扁平化对象

```typescript
export const ROUTES = {
  // 客户管理
  CUSTOMER_LIST: '/customer/list',
  CUSTOMER_DETAIL: '/customer/:id',
  
  // AI 功能
  AI_LEAD_ASSIGNMENT: '/ai/lead-assignment',
  AI_LEAD_SCORING: '/ai/lead-scoring',
  // ... 更多
};
```

### 3.3 路由覆盖对比

| 模块 | 项目 A 路由数 | 项目 B 路由数 | 差异说明 |
|------|------------|------------|---------|
| 基础路由 | 3 (ROOT/WORKBENCH/DASHBOARD) | 2 (WORKBENCH/DASHBOARD) | 项目 A 多 ROOT |
| 客户管理 | 8 (Customer 4 + Contact 4) | 4 (Customer 2 + Contact 2) | 项目 A 有 NEW/EDIT |
| 线索管理 | 4 | 2 | 项目 A 有 NEW/EDIT |
| 商机管理 | 4 | 2 | 项目 A 有 NEW/EDIT |
| 活动管理 | 4 | 3 | 项目 A 有 EDIT |
| 订单管理 | 4 | 2 | 项目 A 有 NEW/EDIT |
| 报价管理 | 5 | 3 | 项目 A 有 EDIT/BUILDER |
| 合同管理 | 4 | 2 | 项目 A 有 NEW/EDIT |
| 回款管理 | 4 | 2 | 项目 A 有 NEW/EDIT |
| 产品管理 | 4 | 3 | 项目 A 有 EDIT |
| 价格表 | 4 | 3 | 项目 A 有 EDIT |
| 报表统计 | 6 | 6 | ✅ 一致 |
| AI 功能 | 14 (含 legacy) | 9 | 项目 A 有 CONFIG/HISTORY/PROMPTS 等 |
| 营销自动化 | 4 | 4 | ✅ 一致 |
| 自动化 | 3 | 3 | ✅ 一致 |
| 系统集成 | 3 | 3 | ✅ 一致 |
| 系统设置 | 14 | 14 | ✅ 基本一致 |

### 3.4 特色功能对比

| 特性 | 项目 A | 项目 B |
|------|--------|--------|
| **向后兼容重定向** | ✅ LEGACY_REDIRECTS 映射表 | ❌ 无 |
| **路径参数类型** | ✅ RouteParams 类型定义 | ❌ 无 |
| **路由生成函数** | ✅ RouteGenerator 类型 | ✅ buildPath 函数 |
| **AI 扩展路由** | ✅ CONFIG/HISTORY/PROMPTS/ANALYTICS/MODELS/USAGE | ❌ 无 |

### 3.5 项目 A 独有路由

| 路由 | 用途 |
|------|------|
| `/ai/config` | AI 配置页面 |
| `/ai/history` | AI 历史记录 |
| `/ai/prompts` | 提示词模板 |
| `/ai/assistant` | AI 助手 |
| `/ai/dashboard` | AI 仪表盘 |
| `/ai/analytics` | AI 分析 |
| `/ai/models` | AI 模型管理 |
| `/ai/usage` | AI 使用统计 |
| `/customer/new`, `/customer/:id/edit` | 客户新建/编辑 |
| `/contact/new`, `/contact/:id/edit` | 联系人新建/编辑 |
| `/lead/new`, `/lead/:id/edit` | 线索新建/编辑 |
| `/opportunity/new`, `/opportunity/:id/edit` | 商机新建/编辑 |
| `/order/new`, `/order/:id/edit` | 订单新建/编辑 |
| `/contract/new`, `/contract/:id/edit` | 合同新建/编辑 |
| `/payment/new`, `/payment/:id/edit` | 回款新建/编辑 |

---

## 四、页面文件对比

### 4.1 总体统计

| 统计项 | 项目 A | 项目 B | 差异 |
|--------|--------|--------|------|
| **总文件数** | 135 | 104 | 项目 A 多 31 个 |
| **目录数** | 14 | 12 | - |
| **平均模块文件数** | 9.6 | 8.7 | - |

### 4.2 按模块对比

#### 根目录页面

| 文件 | 项目 A | 项目 B | 说明 |
|------|--------|--------|------|
| ActivityDetail.tsx | ✅ | ❌ | 项目 A 独有 |
| ActivityForm.tsx | ✅ | ✅ | 一致 |
| ActivityList.tsx | ✅ | ✅ | 一致 |
| ContactDetail.tsx | ✅ | ✅ | 一致 |
| ContactList.tsx | ✅ | ✅ | 一致 |
| ContractDetail.tsx | ✅ | ✅ | 一致 |
| ContractList.tsx | ✅ | ✅ | 一致 |
| CustomerDetail.tsx | ✅ | ✅ | 一致 |
| CustomerList.tsx | ✅ | ✅ | 一致 |
| Dashboard.tsx | ✅ | ✅ | 一致 |
| LeadDetail.tsx | ✅ | ✅ | 一致 |
| LeadList.tsx | ✅ | ✅ | 一致 |
| OpportunityDetail.tsx | ✅ | ✅ | 一致 |
| OpportunityList.tsx | ✅ | ✅ | 一致 |
| OrderDetail.tsx | ✅ | ✅ | 一致 |
| OrderList.tsx | ✅ | ✅ | 一致 |
| PaymentDetail.tsx | ✅ | ✅ | 一致 |
| PaymentList.tsx | ✅ | ✅ | 一致 |
| PricebookDetail.tsx | ✅ | ❌ | 项目 B 在 pricebooks/ |
| PricebookList.tsx | ✅ | ❌ | 项目 B 在 pricebooks/ |
| ProductDetail.tsx | ✅ | ❌ | 项目 B 在 products/ |
| ProductList.tsx | ✅ | ❌ | 项目 B 在 products/ |
| QuoteDetail.tsx | ✅ | ✅ | 一致 |
| QuoteList.tsx | ✅ | ❌ | 项目 B 为 QuotesList.tsx |
| QuoteNew.tsx | ✅ | ✅ | 一致 |
| Workbench.tsx | ✅ | ❌ | 项目 B 在 workbench/ |

#### admin 模块

| 文件 | 项目 A | 项目 B | 说明 |
|------|--------|--------|------|
| index.ts | ✅ | ✅ | 一致 |
| PermissionManagement.tsx | ✅ | ✅ | 一致 |
| RoleManagement.tsx | ✅ | ❌ | 项目 B 为 Roles.tsx |
| UserManagement.tsx | ✅ | ❌ | 项目 B 为 Users.tsx |

#### ai 模块

| 文件 | 项目 A | 项目 B | 说明 |
|------|--------|--------|------|
| AgentDetail.tsx | ✅ | ✅ | 一致 |
| AIAgents.tsx | ✅ | ✅ | 一致 |
| ChurnWarning.tsx | ✅ | ✅ | 一致 |
| CustomerSegmentation.tsx | ✅ | ✅ | 一致 |
| LeadAssignment.tsx | ✅ | ✅ | 一致 |
| LeadScoring.tsx | ✅ | ✅ | 一致 |
| MeetingAssistant.tsx | ✅ | ✅ | 一致 |
| PredictiveAI.tsx | ✅ | ✅ | 一致 |
| SalesForecast.tsx | ✅ | ✅ | 一致 |
| index.ts | ✅ | ❌ | 项目 A 独有 |
| AIAnalytics.tsx | ✅ | ❌ | 项目 A 独有 |
| AIAssistant.tsx | ✅ | ❌ | 项目 A 独有 |
| AIConfig.tsx | ✅ | ❌ | 项目 A 独有 |
| AIDashboard.tsx | ✅ | ❌ | 项目 A 独有 |
| AIHistory.tsx | ✅ | ❌ | 项目 A 独有 |
| AIModels.tsx | ✅ | ❌ | 项目 A 独有 |
| AIPromptTemplates.tsx | ✅ | ❌ | 项目 A 独有 |
| AIUsage.tsx | ✅ | ❌ | 项目 A 独有 |

**差异说明**: 项目 A 的 AI 模块更完善，包含配置、历史、模型管理等后台功能。

#### automation 模块

| 文件 | 项目 A | 项目 B | 说明 |
|------|--------|--------|------|
| index.ts | ✅ | ❌ | 项目 A 独有 |
| WorkflowList.tsx | ✅ | ✅ | 一致 |
| WorkflowLogs.tsx | ✅ | ✅ | 一致 |

#### custom-objects 模块 (项目 A 独有)

| 文件 | 项目 A | 项目 B | 说明 |
|------|--------|--------|------|
| CustomObjectBuilder.tsx | ✅ | ❌ | 项目 A 独有 |
| CustomObjectDetail.tsx | ✅ | ❌ | 项目 B 在 settings/ |
| CustomObjectList.tsx | ✅ | ❌ | 项目 B 在 settings/ |
| CustomObjectRecordForm.tsx | ✅ | ❌ | 项目 A 独有 |
| CustomObjectSettings.tsx | ✅ | ❌ | 项目 B 在 settings/ |
| index.ts | ✅ | ❌ | 项目 A 独有 |

#### Dashboard 模块

| 文件 | 项目 A | 项目 B | 说明 |
|------|--------|--------|------|
| DashboardEditor.tsx | ✅ | ❌ | 项目 A 独有 |
| DashboardPage.tsx | ✅ | ❌ | 项目 A 独有 |
| DashletPanel.tsx | ✅ | ❌ | 项目 A 独有 |
| index.ts | ✅ | ❌ | 项目 A 独有 |

#### integration 模块

| 文件 | 项目 A | 项目 B | 说明 |
|------|--------|--------|------|
| index.ts | ✅ | ❌ | 项目 A 独有 |
| KnowledgeSearch.tsx | ✅ | ✅ | 一致 |
| OutboundTasks.tsx | ✅ | ✅ | 一致 |
| TicketList.tsx | ✅ | ✅ | 一致 |

#### marketing 模块

| 文件 | 项目 A | 项目 B | 说明 |
|------|--------|--------|------|
| CampaignDetail.tsx | ✅ | ✅ | 一致 |
| CampaignDetailWrapper.tsx | ✅ | ❌ | 项目 A 独有 |
| CampaignList.tsx | ✅ | ❌ | 项目 B 为 CampaignsList.tsx (根目录) |
| EmailDetail.tsx | ✅ | ❌ | 项目 A 独有 |
| EmailDetailWrapper.tsx | ✅ | ❌ | 项目 A 独有 |
| EmailList.tsx | ✅ | ❌ | 项目 B 为 EmailTemplates.tsx |
| TargetLists.tsx | ✅ | ✅ | 一致 |

#### others 模块 (项目 A 独有)

| 文件 | 项目 A | 项目 B | 说明 |
|------|--------|--------|------|
| About.tsx | ✅ | ❌ | 项目 A 独有 |
| Changelog.tsx | ✅ | ❌ | 项目 A 独有 |
| Documentation.tsx | ✅ | ❌ | 项目 A 独有 |
| Feedback.tsx | ✅ | ❌ | 项目 A 独有 |
| HelpCenter.tsx | ✅ | ❌ | 项目 A 独有 |
| Privacy.tsx | ✅ | ❌ | 项目 A 独有 |
| RichTextDemo.tsx | ✅ | ❌ | 项目 A 独有 |
| Terms.tsx | ✅ | ❌ | 项目 A 独有 |
| index.ts | ✅ | ❌ | 项目 A 独有 |

#### quotes 模块

| 文件 | 项目 A | 项目 B | 说明 |
|------|--------|--------|------|
| index.ts | ✅ | ❌ | 项目 A 独有 |
| QuoteBuilder.tsx | ✅ | ✅ | 一致 |
| QuoteDetail.tsx | ✅ | ✅ | 一致 |
| QuoteNew.tsx | ✅ | ✅ | 一致 |

#### reports 模块

| 文件 | 项目 A | 项目 B | 说明 |
|------|--------|--------|------|
| ActivityReport.tsx | ✅ | ✅ | 一致 |
| CustomerReport.tsx | ✅ | ✅ | 一致 |
| index.ts | ✅ | ❌ | 项目 A 独有 |
| LeadConversionReport.tsx | ✅ | ✅ | 一致 |
| PaymentReport.tsx | ✅ | ✅ | 一致 |
| PerformanceReport.tsx | ✅ | ✅ | 一致 |
| ReportBuilder.tsx | ✅ | ❌ | 项目 A 独有 |
| ReportDashboard.tsx | ✅ | ❌ | 项目 A 独有 |
| ReportDetail.tsx | ✅ | ❌ | 项目 A 独有 |
| ReportExport.tsx | ✅ | ❌ | 项目 A 独有 |
| ReportList.tsx | ✅ | ❌ | 项目 A 独有 |
| ReportSchedule.tsx | ✅ | ❌ | 项目 A 独有 |
| SalesFunnelReport.tsx | ✅ | ✅ | 一致 |

#### settings 模块

| 文件 | 项目 A | 项目 B | 说明 |
|------|--------|--------|------|
| AdvancedSettings.tsx | ✅ | ❌ | 项目 A 独有 |
| APISettings.tsx | ✅ | ❌ | 项目 A 独有 |
| AuditLogSettings.tsx | ✅ | ✅ (AuditLog.tsx) | 命名差异 |
| CustomizationSettings.tsx | ✅ | ❌ | 项目 A 独有 |
| DataBackupSettings.tsx | ✅ | ❌ | 项目 A 独有 |
| EmailSettings.tsx | ✅ | ❌ | 项目 A 独有 |
| FieldSettings.tsx | ✅ | ✅ (CustomFields.tsx) | 命名差异 |
| FormDesigner.tsx | ✅ | ✅ | 一致 |
| ImportExportSettings.tsx | ✅ | ❌ | 项目 A 独有 |
| IntegrationSettings.tsx | ✅ | ❌ | 项目 A 独有 |
| LayoutSettings.tsx | ✅ | ❌ | 项目 A 独有 |
| LicenseSettings.tsx | ✅ | ❌ | 项目 A 独有 |
| LoginLogSettings.tsx | ✅ | ✅ (LoginLog.tsx) | 命名差异 |
| MobileSettings.tsx | ✅ | ❌ | 项目 A 独有 |
| NotificationSettings.tsx | ✅ | ✅ (NotificationPreferences.tsx) | 命名差异 |
| ObjectRelationships.tsx | ✅ | ✅ | 一致 |
| PageBuilder.tsx | ✅ | ✅ | 一致 |
| PermissionManagement.tsx | ✅ | ✅ | 一致 |
| PipelineManager.tsx | ✅ | ✅ | 一致 |
| PreferencesSettings.tsx | ✅ | ❌ | 项目 A 独有 |
| ProfileSettings.tsx | ✅ | ✅ (Profile.tsx) | 命名差异 |
| SecuritySettings.tsx | ✅ | ❌ | 项目 A 独有 |
| SystemInfo.tsx | ✅ | ❌ | 项目 A 独有 |
| ThemeSettings.tsx | ✅ | ❌ | 项目 A 独有 |
| ViewManager.tsx | ✅ | ✅ | 一致 |
| WebhookSettings.tsx | ✅ | ❌ | 项目 A 独有 |
| WorkflowSettings.tsx | ✅ | ❌ | 项目 B 在 settings/ |
| index.ts | ✅ | ✅ | 一致 |
| - | ❌ | ✅ (ChangePassword.tsx) | 项目 B 独有 |
| - | ❌ | ✅ (CreateCustomObject.tsx) | 项目 B 独有 |
| - | ❌ | ✅ (CustomObjects.tsx) | 项目 B 独有 |
| - | ❌ | ✅ (DisplayPreferences.tsx) | 项目 B 独有 |
| - | ❌ | ✅ (ObjectConfig.tsx) | 项目 B 独有 |
| - | ❌ | ✅ (ObjectData.tsx) | 项目 B 独有 |
| - | ❌ | ✅ (ObjectFields.tsx) | 项目 B 独有 |
| - | ❌ | ✅ (Roles.tsx) | 项目 B 独有 |
| - | ❌ | ✅ (Users.tsx) | 项目 B 独有 |
| - | ❌ | ✅ (WorkflowEditor.tsx) | 项目 B 独有 |
| - | ❌ | ✅ (WorkflowList.tsx) | 项目 B 独有 |
| - | ❌ | ✅ (WorkflowLogs.tsx) | 项目 B 独有 |

#### workflows 模块 (项目 A 独有)

| 文件 | 项目 A | 项目 B | 说明 |
|------|--------|--------|------|
| index.ts | ✅ | ❌ | 项目 A 独有 |
| WorkflowBuilder.tsx | ✅ | ❌ | 项目 B 在 settings/ |
| WorkflowDetail.tsx | ✅ | ❌ | 项目 A 独有 |
| WorkflowExecutions.tsx | ✅ | ❌ | 项目 A 独有 |
| WorkflowList.tsx | ✅ | ✅ (在 settings/) | 位置差异 |

#### 项目 B 独有目录

| 目录/文件 | 说明 |
|----------|------|
| callcenter/OutboundTasks.tsx | 呼叫中心外呼任务 |
| knowledge/KnowledgeSearch.tsx | 知识库搜索 |
| pricebooks/PricebookDetail.tsx | 价格表详情 |
| pricebooks/PricebookList.tsx | 价格表列表 |
| products/ProductDetail.tsx | 产品详情 |
| products/ProductList.tsx | 产品列表 |
| tickets/TicketList.tsx | 工单列表 |
| workbench/components/* (7 个文件) | 工作台组件 |
| TestPage.tsx | 测试页面 |
| AIAgents.tsx, AgentDetail.tsx | AI 代理 (重复在 ai/) |
| CampaignsList.tsx, CampaignDetail.tsx | 营销活动 (重复在 marketing/) |
| CustomerDetailNew.tsx | 客户详情新版本 |
| EmailTemplates.tsx, TargetLists.tsx | 邮件模板/目标列表 |
| PermissionSettings.tsx | 权限设置 |
| QuotesList.tsx | 报价列表 |
| Roles.tsx, Users.tsx | 角色/用户管理 |

### 4.3 页面文件差异总结

| 类别 | 项目 A 独有 | 项目 B 独有 | 说明 |
|------|-----------|-----------|------|
| **AI 管理页面** | 10 个 (Config/History/Models 等) | 0 个 | 项目 A AI 后台更完善 |
| **报表管理** | 6 个 (Builder/Dashboard/Export 等) | 0 个 | 项目 A 报表系统更完整 |
| **设置页面** | 15 个 (API/License/Mobile 等) | 9 个 (ObjectConfig/Data/Fields) | 项目 A 设置更多，项目 B 自定义对象更细 |
| **帮助文档** | 8 个 (About/Help/Terms 等) | 0 个 | 项目 A 有完整的帮助系统 |
| **自定义对象** | 5 个 (独立模块) | 4 个 (在 settings 内) | 组织方式不同 |
| **工作流** | 5 个 (独立模块) | 3 个 (在 settings 内) | 组织方式不同 |
| **工作台组件** | 0 个 | 7 个 | 项目 B 工作台组件化更好 |

---

## 五、业务功能对比

### 5.1 Services 层对比

| Service | 项目 A | 项目 B | 说明 |
|---------|--------|--------|------|
| base.ts | ✅ | ❌ | 项目 A 基础服务 |
| callcenterService.ts | ✅ | ✅ | 一致 |
| customFieldService.ts | ✅ | ✅ | 一致 |
| customObjectService.ts | ✅ | ❌ | 项目 A 独有 |
| dashletService.ts | ✅ | ❌ | 项目 A 仪表盘组件服务 |
| knowledgeService.ts | ✅ | ✅ | 一致 |
| pricebookService.ts | ✅ | ✅ | 一致 |
| productService.ts | ❌ | ✅ | 项目 B 独有 |
| ticketService.ts | ✅ | ✅ | 一致 |
| workflowService.ts | ✅ | ❌ | 项目 A 独有 |
| **总计** | **10 个** | **6 个** | - |

### 5.2 Store 层对比

| Store | 项目 A | 项目 B | 说明 |
|-------|--------|--------|------|
| appStore.ts | ✅ | ❌ | 项目 A 应用状态 |
| authStore.ts | ✅ | ❌ | 项目 A 认证状态 |
| formStores.ts | ✅ | ❌ | 项目 A 表单状态集合 |
| uiStore.ts | ✅ | ❌ | 项目 A UI 状态 |
| customObjects.ts | ❌ | ✅ | 项目 B 自定义对象状态 |
| workflows.ts | ❌ | ✅ | 项目 B 工作流状态 |
| index.ts | ✅ | ❌ | 项目 A 导出 |
| **总计** | **5 个** | **2 个** | 项目 A 状态管理更细分 |

### 5.3 Hooks 层对比

#### 根目录 hooks

| Hook | 项目 A | 项目 B | 说明 |
|------|--------|--------|------|
| use-toast.ts | ✅ | ❌ | 项目 A 提示组件 |
| useInfiniteQueries.ts | ✅ | ❌ | 项目 A 无限查询 |
| useReports.ts | ✅ | ❌ | 项目 A 报表钩子 |
| index.ts | ✅ | ✅ | 一致 |

#### hooks/api 目录

| Hook | 项目 A | 项目 B | 说明 |
|------|--------|--------|------|
| useActivities.ts | ✅ | ❌ | 项目 A 独有 |
| useAI.ts | ✅ | ✅ | 一致 |
| useAuditLogs.ts | ✅ | ✅ | 一致 |
| useCallcenter.ts | ✅ | ❌ | 项目 A 独有 |
| useContacts.ts | ✅ | ❌ | 项目 A 独有 |
| useContracts.ts | ✅ | ❌ | 项目 A 独有 |
| useCustomers.ts | ✅ | ❌ | 项目 A 独有 |
| useCustomFields.ts | ✅ | ✅ | 一致 |
| useCustomObjects.ts | ✅ | ✅ | 一致 |
| useKnowledge.ts | ✅ | ❌ | 项目 A 独有 |
| useLeads.ts | ✅ | ❌ | 项目 A 独有 |
| useLoginLogs.ts | ✅ | ✅ | 一致 |
| useMarketing.ts | ✅ | ❌ | 项目 A 独有 |
| useOpportunities.ts | ✅ | ❌ | 项目 A 独有 |
| useOrders.ts | ✅ | ❌ | 项目 A 独有 |
| usePayments.ts | ✅ | ❌ | 项目 A 独有 |
| usePermissions.ts | ✅ | ✅ | 一致 |
| usePricebooks.ts | ✅ | ❌ | 项目 A 独有 |
| useProducts.ts | ✅ | ❌ | 项目 A 独有 |
| useReports.ts | ✅ | ❌ | 项目 A 独有 |
| useRoles.ts | ✅ | ✅ | 一致 |
| useSettings.ts | ✅ | ❌ | 项目 A 独有 |
| useTickets.ts | ✅ | ❌ | 项目 A 独有 |
| useUsers.ts | ✅ | ✅ | 一致 |
| useWorkflows.ts | ✅ | ✅ | 一致 |
| index.ts | ✅ | ✅ | 一致 |
| **总计** | **26 个** | **11 个** | 项目 A hooks 更完善 |

### 5.4 业务功能覆盖对比

| 业务模块 | 项目 A | 项目 B | 差异说明 |
|---------|--------|--------|---------|
| **客户管理** | ✅ 完整 (useCustomers/useContacts) | ⚠️ 基础 | 项目 A 有专用 hooks |
| **销售管理** | ✅ 完整 (useLeads/useOpportunities/useActivities) | ⚠️ 基础 | 项目 A 有专用 hooks |
| **订单管理** | ✅ 完整 (useOrders/useContracts/usePayments) | ⚠️ 基础 | 项目 A 有专用 hooks |
| **产品定价** | ✅ 完整 (useProducts/usePricebooks) | ⚠️ 基础 | 项目 A 有专用 hooks + service |
| **AI 功能** | ✅ 完整 (useAI + 10 个管理页面) | ⚠️ 基础 | 项目 A 有后台管理 |
| **报表统计** | ✅ 完整 (useReports + 6 个管理页面) | ⚠️ 基础 | 项目 A 有报表构建器 |
| **营销自动化** | ✅ 完整 (useMarketing) | ⚠️ 基础 | 项目 A 有专用 hooks |
| **呼叫中心** | ✅ 完整 (useCallcenter + service) | ⚠️ 基础 | 项目 A 有专用 hooks + service |
| **工单系统** | ✅ 完整 (useTickets + service) | ⚠️ 基础 | 项目 A 有专用 hooks + service |
| **知识库** | ✅ 完整 (useKnowledge + service) | ⚠️ 基础 | 项目 A 有专用 hooks + service |
| **工作流** | ✅ 完整 (useWorkflows + service + 5 个页面) | ⚠️ 基础 | 项目 A 独立模块 |
| **自定义对象** | ✅ 完整 (useCustomObjects + service + 5 个页面) | ⚠️ 基础 | 组织方式不同 |
| **系统设置** | ✅ 完整 (20+ 设置页面) | ⚠️ 基础 (10+ 页面) | 项目 A 设置更全面 |
| **权限管理** | ✅ 完整 (usePermissions/useRoles/useUsers) | ✅ 完整 | 基本一致 |
| **审计日志** | ✅ 完整 (useAuditLogs + 页面) | ✅ 完整 | 基本一致 |
| **登录日志** | ✅ 完整 (useLoginLogs + 页面) | ✅ 完整 | 基本一致 |

### 5.5 架构差异总结

| 架构层面 | 项目 A | 项目 B | 优劣分析 |
|---------|--------|--------|---------|
| **代码组织** | 模块化清晰，独立目录 | 部分扁平化，部分在 settings | 项目 A 更易维护 |
| **状态管理** | 细分多 store | 简化 store | 项目 A 更清晰，项目 B 更简洁 |
| **API 抽象** | 完整 hooks 层 (26 个) | 基础 hooks (11 个) | 项目 A 复用性更好 |
| **服务层** | 10 个 services | 6 个 services | 项目 A 业务逻辑更分离 |
| **页面复用** | 有 Form/Detail/List 分离 | 部分混合 | 项目 A 组件化更好 |
| **扩展性** | 高 (模块化设计) | 中 (部分耦合) | 项目 A 更易扩展 |

---

## 六、总结与建议

### 6.1 核心差异总结

| 维度 | 项目 A 优势 | 项目 B 优势 |
|------|-----------|-----------|
| **功能完整性** | ✅ AI 管理/报表构建/设置页面更完善 | - |
| **代码组织** | ✅ 模块化清晰，目录结构合理 | ⚠️ 部分文件位置不统一 |
| **组件化程度** | ✅ Form/Detail/List 分离 | ✅ 工作台组件化好 |
| **Hooks 覆盖** | ✅ 26 个业务 hooks | - |
| **Services 覆盖** | ✅ 10 个业务服务 | - |
| **UI 框架** | ⚠️ shadcn/ui 需自定义 | ✅ Ant Design 开箱即用 |
| **响应式设计** | ⚠️ 未明确实现 | ✅ 移动端抽屉支持 |
| **国际化** | ⚠️ 硬编码中文 | ✅ i18n 支持 |
| **附加功能** | - | ✅ 全局搜索/通知中心/面包屑 |

### 6.2 项目 A 独有功能 (建议保留)

1. **AI 管理后台** (10 个页面)
   - AI 配置、历史记录、模型管理、使用统计
   - 建议：已经是项目 A 的一部分，保持

2. **报表构建器** (6 个页面)
   - ReportBuilder/Dashboard/Export/Schedule
   - 建议：已经是项目 A 的一部分，保持

3. **完整设置系统** (15+ 页面)
   - API/License/Mobile/Theme/Webhook 等
   - 建议：已经是项目 A 的一部分，保持

4. **帮助文档系统** (8 个页面)
   - About/Help/Changelog/Terms/Privacy
   - 建议：已经是项目 A 的一部分，保持

5. **业务 Hooks** (15+ 个)
   - useCustomers/useLeads/useOrders 等
   - 建议：已经是项目 A 的一部分，保持

6. **业务 Services** (4 个)
   - customObjectService/dashletService/workflowService/base
   - 建议：已经是项目 A 的一部分，保持

### 6.3 项目 B 独有功能 (建议吸收)

1. **响应式布局**
   - 移动端抽屉式侧边栏
   - 建议：吸收到项目 A，增强移动端体验

2. **国际化支持**
   - i18n 菜单和面包屑
   - 建议：吸收到项目 A，支持多语言

3. **全局搜索**
   - 顶部搜索框
   - 建议：吸收到项目 A，提升用户体验

4. **通知中心**
   - 通知徽章 + 下拉列表
   - 建议：吸收到项目 A，增强通知功能

5. **面包屑导航**
   - 自动生成面包屑
   - 建议：吸收到项目 A，改善导航体验

6. **工作台组件** (7 个)
   - AIAssistant/QuickActions/TodayTodo 等
   - 建议：吸收到项目 A，丰富工作台功能

### 6.4 合并建议

#### 优先级 1 (核心功能)

1. **吸收项目 B 的响应式布局** → 移动端支持
2. **吸收项目 B 的工作台组件** → 丰富工作台功能
3. **检查项目 A 的 hooks 是否完整** → 确保 26 个 hooks 正常工作
4. **检查项目 A 的 services 是否完整** → 确保 10 个 services 正常工作

#### 优先级 2 (重要功能)

1. **吸收项目 B 的国际化** → 多语言支持
2. **吸收项目 B 的全局搜索** → 用户体验提升
3. **吸收项目 B 的通知中心** → 用户体验提升
4. **吸收项目 B 的面包屑导航** → 用户体验提升

#### 优先级 3 (可选功能)

1. **统一目录结构** → 避免文件位置混乱
2. **统一命名规范** → 提高代码一致性

### 6.5 风险提示

1. **UI 框架差异**: 项目 A 用 shadcn/ui，项目 B 用 Ant Design，组件不兼容
   - 建议：保持项目 A 的 shadcn/ui，如需 Ant Design 组件需单独引入

2. **状态管理差异**: 项目 A 多 store，项目 B 简化 store
   - 建议：保持项目 A 的细分 store 方案，更清晰

3. **路由定义差异**: 项目 A 模块化，项目 B 扁平化
   - 建议：保持项目 A 的模块化方案，更易维护

4. **文件组织差异**: 部分页面位置不一致
   - 建议：以项目 A 的目录结构为准

### 6.6 推荐方案

**项目 A 作为主项目，选择性吸收项目 B 的优点:**

1. ✅ 保持项目 A 的模块化架构和完整业务层
2. ✅ 保持项目 A 的 shadcn/ui UI 框架
3. ✅ 保持项目 A 的细分状态管理方案
4. ✅ 保持项目 A 的模块化路由定义
5. 🔲 吸收项目 B 的响应式布局 (移动端抽屉)
6. 🔲 吸收项目 B 的国际化支持 (i18n)
7. 🔲 吸收项目 B 的全局搜索功能
8. 🔲 吸收项目 B 的通知中心
9. 🔲 吸收项目 B 的面包屑导航
10. 🔲 吸收项目 B 的工作台组件

---

**报告生成时间**: 2026-04-09 14:33 GMT+8  
**分析工具**: OpenClaw AI Assistant  
**报告路径**: `C:\Users\13609\Projects\crm-ui-upgrade\docs\CRM 项目差异分析报告.md`
