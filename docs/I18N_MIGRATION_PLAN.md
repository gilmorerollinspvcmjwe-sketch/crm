# CRM 项目 i18n 全量迁移实施计划

> 扫描时间：2026-03-24  
> 项目路径：`frontend-integrated`

---

## 1. 现状统计

### 1.1 扫描结果概览

| 指标 | 数量 |
|------|------|
| 含中文字符串的文件总数 | 188 |
| 已接入 i18n (useTranslation) | 18 |
| 未接入 i18n | 170 |
| Mock 数据文件 | 26 |

### 1.2 已接入 i18n 的文件

以下文件已使用 `useTranslation`，但部分仍含中文需清理：

| 文件路径 | 中文字符数 | 备注 |
|---------|-----------|------|
| `components/Layout/MainLayout.tsx` | 172 | 核心布局，部分菜单已完成 |
| `pages/CustomerList.tsx` | 88 | 客户列表，部分已完成 |
| `pages/CustomerDetail.tsx` | 11 | 客户详情，基本完成 |
| `pages/Dashboard.tsx` | 22 | 仪表盘，部分已完成 |
| `pages/settings/ObjectFields.tsx` | 24 | 设置页，基本完成 |
| `pages/settings/FormDesigner.tsx` | 20 | 表单设计器，基本完成 |
| `pages/settings/ObjectData.tsx` | 20 | 对象数据，基本完成 |
| `pages/settings/AuditLog.tsx` | 18 | 审计日志，基本完成 |
| `pages/settings/CreateCustomObject.tsx` | 16 | 创建对象，基本完成 |
| `pages/settings/DisplayPreferences.tsx` | 16 | 显示偏好，基本完成 |
| `pages/settings/CustomObjects.tsx` | 14 | 自定义对象，基本完成 |
| `pages/settings/LoginLog.tsx` | 14 | 登录日志，基本完成 |
| `pages/settings/ObjectRelationships.tsx` | 14 | 对象关系，基本完成 |
| `pages/settings/ChangePassword.tsx` | 12 | 修改密码，基本完成 |
| `pages/settings/Profile.tsx` | 12 | 个人资料，基本完成 |
| `pages/settings/NotificationPreferences.tsx` | 8 | 通知偏好，基本完成 |
| `App.tsx` | 1 | 已完成 |
| `components/LanguageSwitcher/index.tsx` | 1 | 已完成 |

### 1.3 未接入 i18n 的文件（不含 Mock）

#### 核心业务页面

| 模块 | 文件路径 | 中文字符数 | 优先级 |
|------|---------|-----------|--------|
| **销售** | `pages/LeadList.tsx` | 202 | P0 |
| **销售** | `pages/OpportunityList.tsx` | 119 | P0 |
| **销售** | `pages/OpportunityDetail.tsx` | 114 | P0 |
| **销售** | `pages/ActivityForm.tsx` | 137 | P1 |
| **销售** | `pages/ActivityList.tsx` | 103 | P1 |
| **销售** | `pages/LeadDetail.tsx` | 80 | P1 |
| **订单** | `pages/ContractList.tsx` | 128 | P1 |
| **订单** | `pages/ContractDetail.tsx` | 113 | P1 |
| **订单** | `pages/QuoteNew.tsx` | 112 | P1 |
| **订单** | `pages/PaymentList.tsx` | 88 | P1 |
| **订单** | `pages/PaymentDetail.tsx` | 85 | P1 |
| **订单** | `pages/QuotesList.tsx` | 69 | P1 |
| **订单** | `pages/QuoteDetail.tsx` | 61 | P1 |
| **客户** | `pages/ContactList.tsx` | 105 | P1 |
| **客户** | `pages/ContactDetail.tsx` | 62 | P1 |
| **AI** | `pages/AgentDetail.tsx` | 78 | P2 |
| **AI** | `pages/AIAgents.tsx` | 76 | P2 |
| **AI** | `pages/MeetingAssistant.tsx` | 70 | P2 |
| **AI** | `pages/PredictiveAI.tsx` | 54 | P2 |
| **AI** | `pages/SalesForecast.tsx` | 52 | P2 |
| **报表** | `pages/PaymentReport.tsx` | 61 | P2 |
| **报表** | `pages/ActivityReport.tsx` | 44 | P2 |
| **报表** | `pages/LeadConversionReport.tsx` | 41 | P2 |
| **报表** | `pages/CustomerReport.tsx` | 22 | P2 |
| **报表** | `pages/SalesFunnelReport.tsx` | 22 | P2 |
| **报表** | `pages/PerformanceReport.tsx` | 25 | P2 |
| **营销** | `pages/CampaignDetail.tsx` | 90 | P2 |
| **营销** | `pages/CampaignsList.tsx` | 55 | P2 |
| **营销** | `pages/LeadScoring.tsx` | 67 | P2 |
| **营销** | `pages/TargetLists.tsx` | 70 | P2 |
| **营销** | `pages/EmailTemplates.tsx` | 69 | P2 |
| **营销** | `pages/CustomerSegmentation.tsx` | 80 | P2 |
| **营销** | `pages/LeadAssignment.tsx` | 57 | P2 |
| **营销** | `pages/ChurnWarning.tsx` | 58 | P2 |
| **呼叫中心** | `pages/callcenter/OutboundTasks.tsx` | 68 | P3 |
| **知识库** | `pages/knowledge/KnowledgeSearch.tsx` | 32 | P3 |
| **工单** | `pages/tickets/TicketList.tsx` | 52 | P3 |
| **价格手册** | `pages/pricebooks/PricebookList.tsx` | 60 | P3 |
| **价格手册** | `pages/pricebooks/PricebookDetail.tsx` | 32 | P3 |
| **产品** | `pages/products/ProductList.tsx` | 49 | P3 |
| **产品** | `pages/products/ProductDetail.tsx` | 22 | P3 |
| **设置** | `pages/Users.tsx` | 102 | P3 |
| **设置** | `pages/Roles.tsx` | 85 | P3 |
| **设置** | `pages/PermissionSettings.tsx` | 82 | P3 |
| **设置** | `pages/SystemConfig.tsx` | 56 | P3 |
| **工作台** | `pages/workbench/Workbench.tsx` | 85 | P2 |
| **工作台** | `pages/workbench/components/CreateModal.tsx` | 80 | P2 |
| **工作台** | `pages/workbench/components/AIAssistant.tsx` | 62 | P2 |
| **工作台** | `pages/workbench/components/AIRecommendation.tsx` | 18 | P2 |
| **工作台** | `pages/workbench/components/TodayTodo.tsx` | 17 | P2 |
| **工作台** | `pages/workbench/components/Performance.tsx` | 14 | P2 |
| **工作台** | `pages/workbench/components/WinPredictionCard.tsx` | 7 | P2 |
| **工作台** | `pages/workbench/components/QuickActions.tsx` | 2 | P2 |
| **报价** | `pages/quotes/QuoteBuilder.tsx` | 63 | P2 |

#### 组件文件

| 组件路径 | 中文字符数 |
|---------|-----------|
| `components/Customer/CustomerForm.tsx` | 108 |
| `components/CustomField/CustomFieldForm.tsx` | 94 |
| `components/Product/ProductForm.tsx` | 84 |
| `components/Customer/LeadTable.tsx` | 66 |
| `components/Contact/ContactForm.tsx` | 64 |
| `components/Marketing/WorkflowBuilder.tsx` | 63 |
| `components/DataTable/index.tsx` | 62 |
| `components/Pricebook/PricebookForm.tsx` | 60 |
| `components/FilterBar/index.tsx` | 39 |
| `components/KanbanBoard/index.tsx` | 38 |
| `components/Opportunity/ContractTable.tsx` | 38 |
| `components/CPQ/ProductSelector.tsx` | 39 |
| `components/CustomField/DynamicCustomFields.tsx` | 44 |
| `components/Charts/PieChart.tsx` | 33 |
| `components/Opportunity/OpportunityTable.tsx` | 33 |
| `components/Charts/LineChart.tsx` | 31 |
| `components/CPQ/QuoteCalculator.tsx` | 34 |
| `components/EmptyState/index.tsx` | 34 |
| `components/Permission/RoleForm.tsx` | 34 |
| `components/Pricebook/PricebookEntryForm.tsx` | 43 |
| `components/Payment/PaymentTable.tsx` | 32 |
| `components/Customer/CustomerTable.tsx` | 48 |
| `components/Customer/ContactTable.tsx` | 46 |
| `components/Opportunity/SearchFilter.tsx` | 46 |
| `components/Charts/FunnelChart.tsx` | 20 |
| `components/Charts/BarChart.tsx` | 17 |
| `components/Contract/ContractStatus.tsx` | 18 |
| `components/Contract/PaymentPlanTable.tsx` | 26 |
| `components/Lead/DuplicateCheckModal.tsx` | 26 |
| `components/Payment/PaymentStats.tsx` | 29 |
| `components/Payment/PaymentProgress.tsx` | 23 |
| `components/Opportunity/ActivityTable.tsx` | 28 |
| `components/Customer/SearchFilter.tsx` | 27 |
| `components/Opportunity/CompetitorTable.tsx` | 16 |
| `components/Permission/UserRoleAssign.tsx` | 22 |
| `components/CPQ/QuotePreview.tsx` | 31 |
| `components/Dashlet/*` | 各类 Dashlet 组件 |
| `components/Integration/*` | TicketCard, KnowledgeCard |
| `components/Settings/SettingsLayout.tsx` | 6 |
| `components/Permission/PermissionTree.tsx` | 6 |
| `components/Skeleton/index.tsx` | 19 |
| `components/CollapseSection/index.tsx` | 13 |
| `components/MetricCard/index.tsx` | 14 |
| `components/Dashboard/DashboardGrid.tsx` | 7 |

#### 类型文件

| 类型文件 | 中文字符数 | 说明 |
|---------|-----------|------|
| `types/lead.ts` | 92 | 线索类型定义 |
| `types/customer.ts` | 82 | 客户类型定义 |
| `types/customField.ts` | 82 | 自定义字段类型 |
| `types/customObject.ts` | 81 | 自定义对象类型 |
| `types/contact.ts` | 63 | 联系人类型定义 |
| `types/ai.ts` | 61 | AI 类型定义 |
| `types/ai-agents.ts` | 43 | AI Agents 类型 |
| `types/cpq.ts` | 43 | CPQ 类型定义 |
| `types/marketing.ts` | 53 | 营销类型定义 |
| `types/payment.ts` | 31 | 支付类型定义 |
| `types/activity.ts` | 30 | 活动类型定义 |
| `types/contract.ts` | 26 | 合同类型定义 |
| `types/opportunity.ts` | 24 | 商机类型定义 |
| `types/callcenter.ts` | 23 | 呼叫中心类型 |
| `types/permission.ts` | 20 | 权限类型定义 |
| `types/pricebook.ts` | 18 | 价格手册类型 |
| `types/ticket.ts` | 18 | 工单类型定义 |
| `types/settings.ts` | 19 | 设置类型定义 |
| `types/knowledge.ts` | 8 | 知识库类型定义 |
| `types/dashboard.ts` | 10 | 仪表盘类型 |
| `types/report.ts` | 10 | 报表类型定义 |
| `types/index.ts` | 15 | 类型索引文件 |

#### 服务文件

| 服务文件 | 中文字符数 |
|---------|-----------|
| `services/customFieldService.ts` | 35 |
| `services/pricebookService.ts` | 32 |
| `services/callcenterService.ts` | 10 |
| `services/ticketService.ts` | 10 |
| `services/knowledgeService.ts` | 6 |
| `services/productService.ts` | 8 |

#### 其他文件

| 文件路径 | 中文字符数 | 说明 |
|---------|-----------|------|
| `routes/index.tsx` | 32 | 路由配置 |
| `styles/antdTheme.ts` | 40 | 主题配置 |
| `styles/tokens.ts` | 20 | 设计令牌 |
| `styles/breakpoints.ts` | 11 | 断点配置 |
| `utils/leadDuplicateCheck.ts` | 31 | 线索查重工具 |
| `utils/format.ts` | 12 | 格式化工具 |
| `main.tsx` | 1 | 入口文件 |
| `pages/TestPage.tsx` | 14 | 测试页面 |
| `components/index.ts` | 4 | 组件导出索引 |

### 1.4 Mock 数据文件（不翻译）

Mock 文件保持中文，不需要国际化：

| Mock 文件 | 中文字符数 |
|----------|-----------|
| `mock/contractData.ts` | 379 |
| `mock/leadData.ts` | 338 |
| `mock/marketingData.ts` | 328 |
| `mock/aiAgentsData.ts` | 321 |
| `mock/customerData.ts` | 290 |
| `mock/callcenterData.ts` | 253 |
| `mock/activityData.ts` | 248 |
| `mock/knowledgeData.ts` | 239 |
| `mock/paymentData.ts` | 237 |
| `mock/cpqData.ts` | 230 |
| `mock/opportunityData.ts` | 209 |
| `mock/contactData.ts` | 173 |
| `mock/customFieldData.ts` | 122 |
| `mock/permissionData.ts` | 107 |
| `mock/ticketData.ts` | 111 |
| `mock/dashboardData.ts` | 66 |
| `mock/workbench.ts` | 60 |
| `mock/pricebookData.ts` | 51 |
| `mock/reportData.ts` | 51 |
| `mock/settingsData.ts` | 34 |
| `mock/customObjectsData.ts` | 15 |
| `mock/index.ts` | 3 |

**Mock 数据总计：~3500 中文字符**

---

## 2. 翻译 Key 命名规范

### 2.1 命名模式

```
{模块}.{子模块/页面}.{元素类型}.{具体名称}

模块: common, nav, customer, contact, lead, opportunity, activity, 
      contract, payment, quote, product, pricebook, report, ai, 
      marketing, ticket, knowledge, settings, workbench
      
元素类型: title, label, placeholder, button, message, error, 
         success, column, tab, form, option, tooltip
```

### 2.2 通用 Key（common）

```typescript
// 操作按钮
common.save = "保存"
common.cancel = "取消"
common.delete = "删除"
common.edit = "编辑"
common.create = "创建"
common.add = "添加"
common.search = "搜索"
common.filter = "筛选"
common.reset = "重置"
common.confirm = "确认"
common.back = "返回"
common.export = "导出"
common.import = "导入"
common.refresh = "刷新"
common.submit = "提交"
common.close = "关闭"
common.more = "更多"
common.loading = "加载中..."
common.noData = "暂无数据"

// 表单标签
common.form.required = "必填"
common.form.optional = "选填"
common.form.placeholder = "请输入"
common.form.selectPlaceholder = "请选择"
common.form.datePlaceholder = "请选择日期"

// 状态
common.status.active = "启用"
common.status.inactive = "停用"
common.status.enabled = "已启用"
common.status.disabled = "已禁用"

// 确认消息
common.confirm.delete = "确定要删除吗？"
common.confirm.save = "确定要保存吗？"
common.confirm.cancel = "确定要取消吗？"

// 成功/错误消息
common.success.save = "保存成功"
common.success.delete = "删除成功"
common.success.create = "创建成功"
common.error.save = "保存失败"
common.error.delete = "删除失败"
common.error.network = "网络错误，请稍后重试"
```

### 2.3 导航 Key（nav）

```typescript
nav.dashboard = "仪表盘"
nav.workbench = "工作台"
nav.customers = "客户管理"
nav.contacts = "联系人"
nav.leads = "线索"
nav.opportunities = "商机"
nav.activities = "活动"
nav.contracts = "合同"
nav.payments = "回款"
nav.quotes = "报价单"
nav.products = "产品"
nav.pricebooks = "价格手册"
nav.reports = "报表"
nav.ai = "AI 助手"
nav.marketing = "营销"
nav.tickets = "工单"
nav.knowledge = "知识库"
nav.callcenter = "呼叫中心"
nav.settings = "系统设置"
```

### 2.4 模块 Key 示例

```typescript
// 客户模块
customer.list.title = "客户列表"
customer.list.columns.name = "客户名称"
customer.list.columns.industry = "行业"
customer.list.columns.owner = "负责人"
customer.list.columns.status = "状态"
customer.list.columns.createTime = "创建时间"
customer.detail.title = "客户详情"
customer.detail.tabs.overview = "概览"
customer.detail.tabs.contacts = "联系人"
customer.detail.tabs.opportunities = "商机"
customer.detail.tabs.contracts = "合同"
customer.form.name = "客户名称"
customer.form.industry = "行业"
customer.form.source = "客户来源"
customer.form.website = "网站"
customer.form.address = "地址"

// 线索模块
lead.list.title = "线索列表"
lead.list.columns.name = "线索名称"
lead.list.columns.company = "公司"
lead.list.columns.status = "状态"
lead.list.columns.source = "来源"
lead.detail.title = "线索详情"
lead.form.name = "线索名称"
lead.form.company = "公司名称"
lead.form.source = "线索来源"
lead.form.status = "线索状态"
lead.status.new = "新线索"
lead.status.contacted = "已联系"
lead.status.qualified = "已合格"
lead.status.converted = "已转化"
lead.status.lost = "已丢失"

// 商机模块
opportunity.list.title = "商机列表"
opportunity.list.columns.name = "商机名称"
opportunity.list.columns.customer = "客户"
opportunity.list.columns.amount = "金额"
opportunity.list.columns.stage = "阶段"
opportunity.list.columns.probability = "概率"
opportunity.detail.title = "商机详情"
opportunity.stage.prospecting = "初步接触"
opportunity.stage.analysis = "需求分析"
opportunity.stage.proposal = "方案报价"
opportunity.stage.negotiation = "谈判协商"
opportunity.stage.closedWon = "赢单"
opportunity.stage.closedLost = "输单"

// 合同模块
contract.list.title = "合同列表"
contract.list.columns.name = "合同名称"
contract.list.columns.customer = "客户"
contract.list.columns.amount = "合同金额"
contract.list.columns.status = "状态"
contract.list.columns.startDate = "开始日期"
contract.list.columns.endDate = "结束日期"
contract.detail.title = "合同详情"
contract.status.draft = "草稿"
contract.status.pending = "审批中"
contract.status.active = "生效中"
contract.status.completed = "已完成"
contract.status.terminated = "已终止"

// 回款模块
payment.list.title = "回款列表"
payment.list.columns.contract = "合同"
payment.list.columns.amount = "回款金额"
payment.list.columns.date = "回款日期"
payment.list.columns.status = "状态"
payment.detail.title = "回款详情"
payment.status.pending = "待收款"
payment.status.received = "已收款"
payment.status.overdue = "逾期"

// 报价模块
quote.list.title = "报价单列表"
quote.list.columns.name = "报价单名称"
quote.list.columns.customer = "客户"
quote.list.columns.amount = "报价金额"
quote.list.columns.status = "状态"
quote.detail.title = "报价单详情"
quote.builder.title = "报价构建器"
quote.status.draft = "草稿"
quote.status.sent = "已发送"
quote.status.accepted = "已接受"
quote.status.rejected = "已拒绝"

// 活动模块
activity.list.title = "活动列表"
activity.list.columns.subject = "主题"
activity.list.columns.type = "类型"
activity.list.columns.status = "状态"
activity.list.columns.date = "日期"
activity.form.title = "新建活动"
activity.type.call = "电话"
activity.type.meeting = "会议"
activity.type.email = "邮件"
activity.type.task = "任务"
activity.status.planned = "计划中"
activity.status.completed = "已完成"
activity.status.cancelled = "已取消"

// 报表模块
report.customer = "客户报表"
report.sales = "销售报表"
report.activity = "活动报表"
report.payment = "回款报表"
report.funnel = "销售漏斗"
report.performance = "业绩报表"
report.leadConversion = "线索转化"

// AI 模块
ai.agents.title = "AI 助手"
ai.agents.create = "创建助手"
ai.meeting.title = "会议助手"
ai.prediction.title = "智能预测"
ai.forecast.title = "销售预测"

// 营销模块
marketing.campaigns = "营销活动"
marketing.segments = "客户细分"
marketing.scoring = "线索评分"
marketing.email = "邮件模板"
marketing.assignment = "线索分配"

// 设置模块
settings.profile = "个人资料"
settings.users = "用户管理"
settings.roles = "角色权限"
settings.permissions = "权限设置"
settings.customFields = "自定义字段"
settings.objects = "自定义对象"
settings.system = "系统配置"
settings.audit = "审计日志"
settings.loginLog = "登录日志"

// 工作台模块
workbench.title = "工作台"
workbench.todayTodo = "今日待办"
workbench.aiAssistant = "AI 助手"
workbench.performance = "我的业绩"
workbench.quickActions = "快捷操作"
```

---

## 3. 分批实施计划

### Batch 1: 核心布局（预计 3-4 小时）

**目标**：完成 MainLayout 剩余中文化和路由配置

| 文件 | 中文数 | 工作量 |
|-----|-------|-------|
| `components/Layout/MainLayout.tsx` | 172 | 2h |
| `routes/index.tsx` | 32 | 1h |

**任务清单**：
- [ ] MainLayout 菜单项国际化
- [ ] MainLayout 面包屑国际化
- [ ] MainLayout 用户下拉菜单国际化
- [ ] 路由名称国际化
- [ ] 验证：切换语言后菜单显示正确

**翻译 Key 数量**：约 60 个

---

### Batch 2: 客户模块（预计 6-8 小时）

**目标**：完成客户、联系人相关页面

| 文件 | 中文数 | 工作量 |
|-----|-------|-------|
| `pages/ContactList.tsx` | 105 | 2h |
| `pages/ContactDetail.tsx` | 62 | 1.5h |
| `components/Customer/CustomerForm.tsx` | 108 | 2h |
| `components/Contact/ContactForm.tsx` | 64 | 1.5h |
| `components/Customer/CustomerTable.tsx` | 48 | 1h |
| `components/Customer/ContactTable.tsx` | 46 | 1h |
| `types/customer.ts` | 82 | 0.5h |
| `types/contact.ts` | 63 | 0.5h |

**任务清单**：
- [ ] CustomerForm 表单标签国际化
- [ ] ContactForm 表单标签国际化
- [ ] CustomerTable 列名国际化
- [ ] ContactTable 列名国际化
- [ ] ContactList 页面国际化
- [ ] ContactDetail 页面国际化
- [ ] 类型文件枚举标签国际化
- [ ] 验证：客户模块无中文残留

**翻译 Key 数量**：约 150 个

---

### Batch 3: 销售模块（预计 8-10 小时）

**目标**：完成线索、商机、活动相关页面

| 文件 | 中文数 | 工作量 |
|-----|-------|-------|
| `pages/LeadList.tsx` | 202 | 3h |
| `pages/LeadDetail.tsx` | 80 | 2h |
| `pages/OpportunityList.tsx` | 119 | 2.5h |
| `pages/OpportunityDetail.tsx` | 114 | 2.5h |
| `pages/ActivityList.tsx` | 103 | 2h |
| `pages/ActivityForm.tsx` | 137 | 2h |
| `components/Customer/LeadTable.tsx` | 66 | 1h |
| `components/Opportunity/SearchFilter.tsx` | 46 | 1h |
| `components/Opportunity/SalesFunnel.tsx` | 43 | 1h |
| `components/Opportunity/OpportunityTable.tsx` | 33 | 0.5h |
| `components/Opportunity/ActivityTable.tsx` | 28 | 0.5h |
| `components/Opportunity/CompetitorTable.tsx` | 16 | 0.5h |
| `components/Lead/DuplicateCheckModal.tsx` | 26 | 0.5h |
| `types/lead.ts` | 92 | 0.5h |
| `types/opportunity.ts` | 24 | 0.5h |
| `types/activity.ts` | 30 | 0.5h |
| `utils/leadDuplicateCheck.ts` | 31 | 0.5h |

**任务清单**：
- [ ] LeadList 页面完整国际化
- [ ] LeadDetail 页面国际化
- [ ] OpportunityList 页面国际化
- [ ] OpportunityDetail 页面国际化
- [ ] ActivityList 页面国际化
- [ ] ActivityForm 表单国际化
- [ ] 相关组件国际化
- [ ] 类型文件枚举国际化
- [ ] 验证：销售模块无中文残留

**翻译 Key 数量**：约 250 个

---

### Batch 4: 订单模块（预计 6-8 小时）

**目标**：完成合同、回款、报价相关页面

| 文件 | 中文数 | 工作量 |
|-----|-------|-------|
| `pages/ContractList.tsx` | 128 | 2.5h |
| `pages/ContractDetail.tsx` | 113 | 2.5h |
| `pages/QuoteNew.tsx` | 112 | 2h |
| `pages/PaymentList.tsx` | 88 | 2h |
| `pages/PaymentDetail.tsx` | 85 | 2h |
| `pages/QuotesList.tsx` | 69 | 1.5h |
| `pages/QuoteDetail.tsx` | 61 | 1.5h |
| `pages/quotes/QuoteBuilder.tsx` | 63 | 1.5h |
| `components/Contract/ContractStatus.tsx` | 18 | 0.5h |
| `components/Contract/PaymentPlanTable.tsx` | 26 | 0.5h |
| `components/Payment/PaymentTable.tsx` | 32 | 0.5h |
| `components/Payment/PaymentStats.tsx` | 29 | 0.5h |
| `components/Payment/PaymentProgress.tsx` | 23 | 0.5h |
| `components/Opportunity/ContractTable.tsx` | 38 | 0.5h |
| `types/contract.ts` | 26 | 0.5h |
| `types/payment.ts` | 31 | 0.5h |

**任务清单**：
- [ ] ContractList 页面国际化
- [ ] ContractDetail 页面国际化
- [ ] PaymentList 页面国际化
- [ ] PaymentDetail 页面国际化
- [ ] QuoteNew 页面国际化
- [ ] QuotesList 页面国际化
- [ ] QuoteDetail 页面国际化
- [ ] QuoteBuilder 页面国际化
- [ ] 相关组件国际化
- [ ] 类型文件枚举国际化
- [ ] 验证：订单模块无中文残留

**翻译 Key 数量**：约 200 个

---

### Batch 5: AI + 工作台模块（预计 5-6 小时）

**目标**：完成 AI 助手和工作台相关页面

| 文件 | 中文数 | 工作量 |
|-----|-------|-------|
| `pages/AgentDetail.tsx` | 78 | 2h |
| `pages/AIAgents.tsx` | 76 | 2h |
| `pages/MeetingAssistant.tsx` | 70 | 1.5h |
| `pages/workbench/Workbench.tsx` | 85 | 2h |
| `pages/workbench/components/CreateModal.tsx` | 80 | 1.5h |
| `pages/workbench/components/AIAssistant.tsx` | 62 | 1.5h |
| `pages/workbench/components/AIRecommendation.tsx` | 18 | 0.5h |
| `pages/workbench/components/TodayTodo.tsx` | 17 | 0.5h |
| `pages/workbench/components/Performance.tsx` | 14 | 0.5h |
| `pages/workbench/components/WinPredictionCard.tsx` | 7 | 0.5h |
| `pages/workbench/components/QuickActions.tsx` | 2 | 0.5h |
| `pages/PredictiveAI.tsx` | 54 | 1.5h |
| `pages/SalesForecast.tsx` | 52 | 1.5h |
| `types/ai.ts` | 61 | 0.5h |
| `types/ai-agents.ts` | 43 | 0.5h |

**任务清单**：
- [ ] AIAgents 列表页国际化
- [ ] AgentDetail 详情页国际化
- [ ] MeetingAssistant 页面国际化
- [ ] PredictiveAI 页面国际化
- [ ] SalesForecast 页面国际化
- [ ] Workbench 主页面国际化
- [ ] Workbench 子组件国际化
- [ ] 类型文件枚举国际化
- [ ] 验证：AI 模块无中文残留

**翻译 Key 数量**：约 150 个

---

### Batch 6: 营销 + 报表模块（预计 5-6 小时）

**目标**：完成营销活动和报表相关页面

| 文件 | 中文数 | 工作量 |
|-----|-------|-------|
| `pages/CampaignDetail.tsx` | 90 | 2h |
| `pages/CustomerSegmentation.tsx` | 80 | 2h |
| `pages/LeadScoring.tsx` | 67 | 1.5h |
| `pages/TargetLists.tsx` | 70 | 1.5h |
| `pages/EmailTemplates.tsx` | 69 | 1.5h |
| `pages/CampaignsList.tsx` | 55 | 1.5h |
| `pages/ChurnWarning.tsx` | 58 | 1.5h |
| `pages/LeadAssignment.tsx` | 57 | 1.5h |
| `pages/PaymentReport.tsx` | 61 | 1.5h |
| `pages/ActivityReport.tsx` | 44 | 1h |
| `pages/LeadConversionReport.tsx` | 41 | 1h |
| `pages/PerformanceReport.tsx` | 25 | 1h |
| `pages/CustomerReport.tsx` | 22 | 1h |
| `pages/SalesFunnelReport.tsx` | 22 | 1h |
| `components/Marketing/WorkflowBuilder.tsx` | 63 | 1.5h |
| `types/marketing.ts` | 53 | 0.5h |
| `types/report.ts` | 10 | 0.5h |

**任务清单**：
- [ ] CampaignsList 页面国际化
- [ ] CampaignDetail 页面国际化
- [ ] CustomerSegmentation 页面国际化
- [ ] LeadScoring 页面国际化
- [ ] TargetLists 页面国际化
- [ ] EmailTemplates 页面国际化
- [ ] ChurnWarning 页面国际化
- [ ] LeadAssignment 页面国际化
- [ ] 各报表页面国际化
- [ ] WorkflowBuilder 组件国际化
- [ ] 类型文件枚举国际化
- [ ] 验证：营销+报表模块无中文残留

**翻译 Key 数量**：约 180 个

---

### Batch 7: 其他业务模块（预计 5-6 小时）

**目标**：完成产品、价格手册、知识库、工单、呼叫中心等

| 文件 | 中文数 | 工作量 |
|-----|-------|-------|
| `pages/products/ProductList.tsx` | 49 | 1.5h |
| `pages/products/ProductDetail.tsx` | 22 | 1h |
| `pages/pricebooks/PricebookList.tsx` | 60 | 1.5h |
| `pages/pricebooks/PricebookDetail.tsx` | 32 | 1h |
| `pages/tickets/TicketList.tsx` | 52 | 1.5h |
| `pages/knowledge/KnowledgeSearch.tsx` | 32 | 1h |
| `pages/callcenter/OutboundTasks.tsx` | 68 | 1.5h |
| `components/Product/ProductForm.tsx` | 84 | 2h |
| `components/Pricebook/PricebookForm.tsx` | 60 | 1.5h |
| `components/Pricebook/PricebookEntryForm.tsx` | 43 | 1h |
| `services/pricebookService.ts` | 32 | 0.5h |
| `services/productService.ts` | 8 | 0.5h |
| `types/pricebook.ts` | 18 | 0.5h |
| `types/ticket.ts` | 18 | 0.5h |
| `types/knowledge.ts` | 8 | 0.5h |
| `types/callcenter.ts` | 23 | 0.5h |

**任务清单**：
- [ ] ProductList 页面国际化
- [ ] ProductDetail 页面国际化
- [ ] ProductForm 组件国际化
- [ ] PricebookList 页面国际化
- [ ] PricebookDetail 页面国际化
- [ ] PricebookForm 组件国际化
- [ ] TicketList 页面国际化
- [ ] KnowledgeSearch 页面国际化
- [ ] OutboundTasks 页面国际化
- [ ] 相关类型文件国际化
- [ ] 验证：其他业务模块无中文残留

**翻译 Key 数量**：约 120 个

---

### Batch 8: 设置 + 通用组件（预计 6-8 小时）

**目标**：完成设置页面、通用组件和工具函数

| 文件 | 中文数 | 工作量 |
|-----|-------|-------|
| `pages/Users.tsx` | 102 | 2h |
| `pages/Roles.tsx` | 85 | 2h |
| `pages/PermissionSettings.tsx` | 82 | 2h |
| `pages/SystemConfig.tsx` | 56 | 1.5h |
| `pages/settings/CustomFields.tsx` | 73 | 1.5h |
| `components/Permission/RoleForm.tsx` | 34 | 1h |
| `components/Permission/UserRoleAssign.tsx` | 22 | 0.5h |
| `components/Permission/PermissionTree.tsx` | 6 | 0.5h |
| `components/CustomField/CustomFieldForm.tsx` | 94 | 2h |
| `components/CustomField/DynamicCustomFields.tsx` | 44 | 1h |
| `components/DataTable/index.tsx` | 62 | 1.5h |
| `components/FilterBar/index.tsx` | 39 | 1h |
| `components/EmptyState/index.tsx` | 34 | 0.5h |
| `components/KanbanBoard/index.tsx` | 38 | 1h |
| `components/Skeleton/index.tsx` | 19 | 0.5h |
| `components/MetricCard/index.tsx` | 14 | 0.5h |
| `components/CollapseSection/index.tsx` | 13 | 0.5h |
| `components/Settings/SettingsLayout.tsx` | 6 | 0.5h |
| `components/Dashlet/*` | ~100 | 2h |
| `components/Charts/*` | ~100 | 1.5h |
| `components/Integration/*` | ~15 | 0.5h |
| `services/customFieldService.ts` | 35 | 0.5h |
| `services/callcenterService.ts` | 10 | 0.5h |
| `services/ticketService.ts` | 10 | 0.5h |
| `types/customField.ts` | 82 | 0.5h |
| `types/customObject.ts` | 81 | 0.5h |
| `types/permission.ts` | 20 | 0.5h |
| `types/settings.ts` | 19 | 0.5h |
| `styles/antdTheme.ts` | 40 | 0.5h |
| `styles/tokens.ts` | 20 | 0.5h |
| `utils/format.ts` | 12 | 0.5h |

**任务清单**：
- [ ] Users 页面国际化
- [ ] Roles 页面国际化
- [ ] PermissionSettings 页面国际化
- [ ] SystemConfig 页面国际化
- [ ] CustomFields 页面国际化
- [ ] 权限相关组件国际化
- [ ] 自定义字段组件国际化
- [ ] DataTable 组件国际化
- [ ] FilterBar 组件国际化
- [ ] KanbanBoard 组件国际化
- [ ] 各类 Dashlet 组件国际化
- [ ] Chart 组件国际化
- [ ] 类型文件枚举国际化
- [ ] 服务文件错误消息国际化
- [ ] 样式文件中文注释处理
- [ ] 工具函数国际化
- [ ] 验证：设置+组件无中文残留

**翻译 Key 数量**：约 200 个

---

### Batch 9: CPQ + 高级组件（预计 3-4 小时）

**目标**：完成 CPQ 模块和剩余高级组件

| 文件 | 中文数 | 工作量 |
|-----|-------|-------|
| `components/CPQ/ProductSelector.tsx` | 39 | 1h |
| `components/CPQ/QuoteCalculator.tsx` | 34 | 1h |
| `components/CPQ/QuotePreview.tsx` | 31 | 1h |
| `types/cpq.ts` | 43 | 0.5h |
| `components/Dashboard/DashboardGrid.tsx` | 7 | 0.5h |
| `pages/TestPage.tsx` | 14 | 0.5h |

**任务清单**：
- [ ] ProductSelector 组件国际化
- [ ] QuoteCalculator 组件国际化
- [ ] QuotePreview 组件国际化
- [ ] CPQ 类型文件国际化
- [ ] DashboardGrid 组件国际化
- [ ] 测试页面处理

**翻译 Key 数量**：约 60 个

---

## 4. 注意事项

### 4.1 Mock 数据处理

**原则**：Mock 数据保持中文，不进行国际化翻译。

**原因**：
- Mock 数据是模拟的后端返回数据
- 真实场景下，数据来自后端 API，应由后端处理多语言
- 前端翻译 Mock 数据会造成与真实 API 行为不一致

**示例**：
```typescript
// mock/customerData.ts - 保持不变
export const mockCustomers = [
  {
    id: '1',
    name: '测试客户A',  // 保持中文
    industry: '科技行业',  // 保持中文
    // ...
  }
];
```

### 4.2 枚举值处理

**原则**：枚举 key 使用英文，显示文本使用 `t()` 翻译。

**错误示例**：
```typescript
// ❌ 不推荐：枚举值直接使用中文
const statusOptions = [
  { label: '新建', value: 'new' },
  { label: '进行中', value: 'in_progress' },
  { label: '已完成', value: 'completed' }
];
```

**正确示例**：
```typescript
// ✅ 推荐：使用 t() 翻译
const statusOptions = [
  { label: t('lead.status.new'), value: 'new' },
  { label: t('lead.status.inProgress'), value: 'in_progress' },
  { label: t('lead.status.completed'), value: 'completed' }
];

// 或者在组件外部定义，传入时翻译
const STATUS_OPTIONS = [
  { labelKey: 'lead.status.new', value: 'new' },
  { labelKey: 'lead.status.inProgress', value: 'in_progress' },
  { labelKey: 'lead.status.completed', value: 'completed' }
];

// 使用时翻译
const translatedOptions = STATUS_OPTIONS.map(opt => ({
  label: t(opt.labelKey),
  value: opt.value
}));
```

### 4.3 Ant Design 组件国际化

**配置方式**：使用 Ant Design 提供的 locale 配置。

```typescript
// App.tsx 或 i18n 配置文件
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';

const antdLocale = i18n.language === 'zh' ? zhCN : enUS;

<ConfigProvider locale={antdLocale}>
  <App />
</ConfigProvider>
```

**覆盖范围**：
- 日期选择器（DatePicker）
- 分页组件（Pagination）
- 表格筛选排序
- 模态框确认按钮
- 上传组件
- 空状态文案

**注意**：不需要手动翻译 Ant Design 组件内置文案，使用 locale 配置即可。

### 4.4 动态内容处理

**原则**：用户输入的数据不翻译，只翻译静态文案。

**不翻译的内容**：
- 用户输入的客户名称、描述等
- 从后端 API 返回的业务数据
- 用户上传的文件名、备注等
- 系统日志中记录的用户操作内容

**示例**：
```typescript
// ❌ 错误：翻译用户数据
<p>{t('customer.name')}: {t(customer.name)}</p>

// ✅ 正确：只翻译标签
<p>{t('customer.form.name')}: {customer.name}</p>

// ❌ 错误：翻译日志内容
<span>{t('activity.log', { action: t(activity.action) })}</span>

// ✅ 正确：保持日志内容原样
<span>{t('activity.log', { action: activity.action })}</span>
```

### 4.5 带插值的文案

**正确处理方式**：
```typescript
// 使用 i18next 的插值功能
// zh.json
{
  "common.confirm.delete": "确定要删除「{{name}}」吗？",
  "customer.detail.title": "客户详情 - {{name}}",
  "activity.count": "共 {{count}} 条记录"
}

// 使用
t('common.confirm.delete', { name: customer.name })
t('customer.detail.title', { name: customer.name })
t('activity.count', { count: total })
```

### 4.6 复数处理

```typescript
// zh.json
{
  "item.count_one": "{{count}} 个项目",
  "item.count_other": "{{count}} 个项目"
}

// en.json
{
  "item.count_one": "{{count}} item",
  "item.count_other": "{{count}} items"
}

// 使用 - i18next 自动处理复数
t('item.count', { count: items.length })
```

### 4.7 类型文件中的中文

**原则**：类型定义中的枚举/标签使用英文 key，在显示时翻译。

```typescript
// ❌ 错误
export const CUSTOMER_STATUS = {
  ACTIVE: { label: '活跃', value: 'active' },
  INACTIVE: { label: '停用', value: 'inactive' }
} as const;

// ✅ 正确
export const CUSTOMER_STATUS = {
  ACTIVE: { labelKey: 'customer.status.active', value: 'active' },
  INACTIVE: { labelKey: 'customer.status.inactive', value: 'inactive' }
} as const;

// 使用时翻译
const statusLabel = t(CUSTOMER_STATUS.ACTIVE.labelKey);
```

---

## 5. 验证方法

### 5.1 每批完成后的验证流程

#### 步骤 1：编译检查

```bash
npm run build
```

确保：
- TypeScript 编译无错误
- 没有缺失的翻译 key 警告
- 构建产物正常生成

#### 步骤 2：中文残留检查

```bash
# 在 src 目录下搜索中文（排除 mock 和 i18n 配置）
grep -r "[\u4e00-\u9fff]" src --include="*.tsx" --include="*.ts" --exclude-dir=mock --exclude-dir=i18n
```

或运行自定义检查脚本：
```bash
python check_chinese.py
```

#### 步骤 3：功能验证

**中文环境**：
1. 切换语言到中文
2. 检查该批次涉及的页面
3. 确认所有文案正确显示
4. 确认表单标签、按钮、提示信息正常
5. 确认表格列头、筛选选项正确

**英文环境**：
1. 切换语言到英文
2. 检查该批次涉及的页面
3. 确认无中文残留
4. 确认翻译准确、符合语境
5. 确认 UI 布局无错位（英文通常更长）

#### 步骤 4：回归测试

1. 检查之前已国际化的页面无回归
2. 确认语言切换功能正常
3. 确认刷新后语言设置保持

### 5.2 最终验收标准

| 验收项 | 标准 |
|-------|------|
| 编译 | `npm run build` 无错误 |
| 中文残留 | 非 mock 文件中无硬编码中文 |
| 功能完整性 | 所有页面中英文切换正常 |
| UI 布局 | 英文状态下无布局错位 |
| Ant Design 组件 | 日期选择器、分页等组件语言正确 |
| 类型文件 | 枚举值使用 labelKey 而非硬编码中文 |
| 代码规范 | 翻译 key 遵循命名规范 |

### 5.3 自动化检查脚本

创建 `scripts/check_i18n.py`：

```python
#!/usr/bin/env python3
"""检查未国际化的中文字符串"""

import os
import re

SRC_DIR = 'src'
MOCK_DIR = 'src/mock'
I18N_DIR = 'src/i18n'

# 排除目录
EXCLUDE_DIRS = {MOCK_DIR, I18N_DIR}

# 中文正则
CHINESE_PATTERN = re.compile(r'[\u4e00-\u9fff]+')

def check_file(filepath):
    """检查单个文件"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 排除注释中的中文
    lines = content.split('\n')
    issues = []
    
    for i, line in enumerate(lines, 1):
        # 跳过单行注释
        if line.strip().startswith('//') or line.strip().startswith('*'):
            continue
        
        # 检查中文
        matches = CHINESE_PATTERN.findall(line)
        if matches:
            issues.append({
                'line': i,
                'content': line.strip()[:80],
                'chinese': ''.join(matches)
            })
    
    return issues

def main():
    issues = []
    
    for root, dirs, files in os.walk(SRC_DIR):
        # 排除目录
        dirs[:] = [d for d in dirs if os.path.join(root, d) not in EXCLUDE_DIRS]
        
        for f in files:
            if f.endswith('.tsx') or f.endswith('.ts'):
                filepath = os.path.join(root, f)
                file_issues = check_file(filepath)
                if file_issues:
                    issues.append({
                        'file': filepath,
                        'issues': file_issues
                    })
    
    if issues:
        print(f'❌ 发现 {len(issues)} 个文件存在未国际化的中文：\n')
        for item in issues:
            print(f"📄 {item['file']}")
            for issue in item['issues']:
                print(f"   L{issue['line']}: {issue['chinese']}")
            print()
        exit(1)
    else:
        print('✅ 所有非 mock 文件均已国际化')
        exit(0)

if __name__ == '__main__':
    main()
```

---

## 6. 工作量总览

### 6.1 按批次统计

| 批次 | 模块 | 文件数 | 预计 Key 数 | 预计工时 |
|-----|------|-------|-----------|---------|
| Batch 1 | 核心布局 | 2 | 60 | 3-4h |
| Batch 2 | 客户模块 | 8 | 150 | 6-8h |
| Batch 3 | 销售模块 | 17 | 250 | 8-10h |
| Batch 4 | 订单模块 | 16 | 200 | 6-8h |
| Batch 5 | AI+工作台 | 15 | 150 | 5-6h |
| Batch 6 | 营销+报表 | 17 | 180 | 5-6h |
| Batch 7 | 其他业务 | 16 | 120 | 5-6h |
| Batch 8 | 设置+组件 | 30+ | 200 | 6-8h |
| Batch 9 | CPQ+高级 | 6 | 60 | 3-4h |
| **总计** | - | **~130** | **~1370** | **47-60h** |

### 6.2 按类型统计

| 类型 | 文件数 | 说明 |
|-----|-------|------|
| Pages | ~60 | 业务页面 |
| Components | ~50 | UI 组件 |
| Types | ~20 | 类型定义 |
| Services | ~6 | 服务层 |
| Styles | 3 | 样式文件 |
| Utils | 2 | 工具函数 |
| Routes | 1 | 路由配置 |
| Mock | 26 | 不翻译 |

### 6.3 翻译文件结构

```
src/i18n/
├── index.ts              # i18n 配置入口
├── locales/
│   ├── zh/
│   │   ├── common.json   # 通用翻译
│   │   ├── nav.json      # 导航翻译
│   │   ├── customer.json # 客户模块
│   │   ├── lead.json     # 线索模块
│   │   ├── opportunity.json # 商机模块
│   │   ├── activity.json # 活动模块
│   │   ├── contract.json # 合同模块
│   │   ├── payment.json  # 回款模块
│   │   ├── quote.json    # 报价模块
│   │   ├── product.json  # 产品模块
│   │   ├── pricebook.json # 价格手册
│   │   ├── report.json   # 报表模块
│   │   ├── ai.json       # AI 模块
│   │   ├── marketing.json # 营销模块
│   │   ├── ticket.json   # 工单模块
│   │   ├── knowledge.json # 知识库
│   │   ├── settings.json # 设置模块
│   │   └── workbench.json # 工作台
│   └── en/
│       └── (同上结构)
```

---

## 7. 执行建议

### 7.1 优先级排序原则

1. **高频使用**：用户最常访问的页面优先
2. **核心流程**：客户、商机、合同等核心业务流程优先
3. **依赖关系**：被其他组件依赖的组件优先
4. **风险控制**：复杂的组件提前处理，留足调试时间

### 7.2 每日工作量建议

- **建议每日 1-2 个 Batch**
- 每个 Batch 完成后立即验证
- 发现问题当天解决，避免累积

### 7.3 风险点

| 风险 | 影响 | 应对措施 |
|-----|------|---------|
| 翻译 Key 命名冲突 | 覆盖导致显示错误 | 使用模块前缀，建立命名规范 |
| Ant Design 组件遗漏 | 部分组件语言未切换 | 逐一检查 antd 组件，配置 locale |
| 英文文案过长 | UI 布局错位 | 翻译时控制长度，必要时调整样式 |
| Mock 数据误翻译 | 数据展示异常 | 明确标记 mock 目录为不翻译 |
| 动态内容误翻译 | 用户数据被错误处理 | 严格区分静态文案和动态数据 |

### 7.4 完成标准

- [ ] 所有非 mock 文件中文清除
- [ ] 翻译 key 遵循命名规范
- [ ] npm run build 无错误
- [ ] 中英文切换功能正常
- [ ] UI 布局无错位
- [ ] Ant Design 组件语言正确
- [ ] 检查脚本通过

---

## 附录：快速命令参考

```bash
# 扫描中文
python scan_i18n.py

# 检查未国际化
python scripts/check_i18n.py

# 构建项目
npm run build

# 启动开发服务器
npm run dev

# 提取翻译 key（如果使用 i18next-scanner）
npm run i18n:scan
```

---

*文档生成时间：2026-03-24*