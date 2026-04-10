# CRM UI 升级项目 - 详细迁移计划 V2

> 目标：与原项目功能完全一致
> 创建时间：2026-04-07
> 预计周期：4-5 周
> 并行 Agent：最多 6 个

---

## 📋 项目目标

1. **菜单结构** - 与原项目完全一致
2. **业务功能** - 与原项目完全一致
3. **AI 模块** - 保留 8 个独立页面
4. **页面功能** - HubSpot 风格（高级筛选、保存筛选、左中右三列详情页）
5. **多语言** - 完成功能开发后补全翻译
6. **UI 风格** - 统一使用新 shadcn/ui 组件

---

## 🔍 原项目功能清单

### 1. 菜单结构（完整）

```
工作台
├── 销售工作台 (/workbench)
└── 仪表盘 (/dashboard)

客户管理
├── 客户列表 (/customer/list)
└── 联系人列表 (/contact/list)

销售管理
├── 线索管理 (/lead/list)
├── 商机管理 (/opportunity/list)
└── 跟进记录 (/activity/list)

订单管理
├── 订单列表 (/order/list)
├── 报价单 (/quote/list)
├── 合同管理 (/contract/list)
└── 回款管理 (/payment/list)

产品与定价
├── 产品库 (/products/list)
└── 价格表 (/pricebooks/list)

报表中心
├── 销售漏斗 (/report/funnel)
├── 业绩统计 (/report/performance)
├── 客户分析 (/report/customer)
├── 跟进活动 (/report/activity)
├── 线索转化 (/report/lead-conversion)
└── 回款分析 (/report/payment)

智能 AI
├── 智能线索分配 (/ai/lead-assignment)
├── 线索评分 AI (/ai/lead-scoring)
├── 销售预测 AI (/ai/sales-forecast)
├── 客户分群 AI (/ai/customer-segmentation)
├── 客户流失预警 (/ai/churn-warning)
├── 会议助手 (/ai/meeting-assistant)
├── 预测性 AI (/ai/predictive)
└── AI 智能体 (/ai/agents)

自动化
├── 工作流 (/automation/workflows)
└── 执行日志 (/automation/logs)

营销自动化
├── 营销活动 (/marketing/campaigns)
├── 邮件模板 (/marketing/email-templates)
└── 目标列表 (/marketing/target-lists)

集成对接
├── 工单系统 (/integration/tickets)
├── 知识库 (/integration/knowledge)
└── 呼叫中心 (/integration/callcenter)

系统设置
├── 个人信息 (/settings/profile)
├── 修改密码 (/settings/change-password)
├── 通知偏好 (/settings/notifications)
├── 显示偏好 (/settings/display)
├── 角色管理 (/settings/roles)
├── 用户管理 (/settings/users)
├── 权限配置 (/settings/permissions)
├── 自定义字段 (/settings/custom-fields)
├── 自定义对象 (/settings/custom-objects)
├── 操作日志 (/settings/audit-log)
└── 登录日志 (/settings/login-log)
```

### 2. HubSpot 风格功能清单

#### 列表页面功能
- [ ] 外部筛选栏（FilterBar）
- [ ] 筛选标签显示
- [ ] 保存筛选功能
- [ ] 列设置（显示/隐藏/排序）
- [ ] 表格密度切换（紧凑/默认/宽松）
- [ ] 批量操作栏
- [ ] 快速搜索
- [ ] 分页器
- [ ] 导出功能
- [ ] 视图切换（列表/看板）

#### 详情页面功能（左中右三列）
- [ ] 左侧边栏（240px）：客户信息 + 操作按钮
- [ ] 中间内容区（flex）：Tabs（概览/活动/AI洞察）
- [ ] 右侧边栏（320px）：相关信息卡片
- [ ] 面包屑导航
- [ ] 返回按钮
- [ ] 编辑/删除操作

### 3. 多语言翻译规模

- 主翻译文件：zh.json (153KB), en.json (158KB)
- 分批翻译文件：3个批次，每语言约 100KB
- 总计翻译键值：约 2000+ 个

---

## 🎯 迁移阶段规划

### Phase 1: 基础设施完善（第 1 周）

#### 任务 1.1: 完善左侧菜单（Menu Migration）
**Agent:** menu-migration  
**模型:** GLM-5  
**预计时间:** 4-6 小时  
**依赖:** 无

**任务内容:**
1. 更新 `src/components/Layout/Sidebar.tsx`
   - 确保菜单项与原项目完全一致（11个主菜单，42个子菜单）
   - 使用 i18n 翻译键
   - 添加所有缺失的菜单项

2. 更新 `src/constants/routes.ts`
   - 添加所有缺失的路由常量
   - 确保路径与原项目一致

3. 创建缺失的占位页面
   - 为所有菜单项创建基础页面组件（哪怕是空的）

**检查点:**
- [ ] 菜单项数量与原项目一致
- [ ] 所有菜单项可点击跳转
- [ ] 当前菜单高亮正确

---

#### 任务 1.2: 迁移多语言翻译（I18n Migration）
**Agent:** i18n-migration  
**模型:** GLM-5  
**预计时间:** 4-6 小时  
**依赖:** 无

**任务内容:**
1. 复制原项目翻译文件
   - 从 `crm2026-4-3new/src/i18n/locales/` 复制所有文件
   - 合并分批翻译文件到主文件

2. 更新 `src/i18n/index.ts`
   - 配置语言检测
   - 配置 localStorage 持久化

3. 创建 LanguageSwitcher 组件
   - 添加到 Header

**检查点:**
- [ ] 翻译文件完整复制
- [ ] 语言切换正常工作
- [ ] 翻译键值可正常显示

---

#### 任务 1.3: 创建 HubSpot 风格筛选栏（FilterBar）
**Agent:** filterbar-component  
**模型:** GLM-5  
**预计时间:** 6-8 小时  
**依赖:** 无

**任务内容:**
1. 创建 `src/components/FilterBar/index.tsx`
   - 支持字段类型：text, select, date, dateRange, number
   - 支持展开/收起
   - 支持筛选标签显示
   - 支持保存筛选

2. 创建 `src/components/FilterBar/FilterTags.tsx`
   - 显示当前激活的筛选条件
   - 支持移除单个筛选
   - 支持清除全部筛选

3. 创建 `src/components/FilterBar/SaveFilterDialog.tsx`
   - 保存当前筛选条件
   - 加载已保存的筛选

**检查点:**
- [ ] 筛选栏外观与原项目一致
- [ ] 所有筛选类型正常工作
- [ ] 筛选标签正确显示

---

#### 任务 1.4: 创建三列布局详情页组件（DetailLayout）
**Agent:** detail-layout-component  
**模型:** GLM-5  
**预计时间:** 6-8 小时  
**依赖:** 无

**任务内容:**
1. 创建 `src/components/Layout/DetailLayout.tsx`
   - 左侧边栏（240px）：信息卡片 + 操作按钮
   - 中间内容区（flex）：动态内容
   - 右侧边栏（320px）：相关信息卡片

2. 创建 `src/components/DetailSidebar/InfoCard.tsx`
   - 客户/线索/商机信息展示
   - 编辑按钮

3. 创建 `src/components/DetailSidebar/ActionButtons.tsx`
   - 常用操作按钮组

4. 创建 `src/components/DetailSidebar/RelatedCards.tsx`
   - 相关列表卡片

**检查点:**
- [ ] 三列布局正确显示
- [ ] 响应式适配
- [ ] 可复用到不同详情页

---

### Phase 2: 系统管理模块（第 1-2 周）

#### 任务 2.1: 角色管理页面（Roles）
**Agent:** page-roles  
**模型:** GLM-5  
**预计时间:** 8-10 小时  
**依赖:** 任务 1.1, 1.2

**任务内容:**
1. 创建 `src/pages/admin/Roles.tsx`
   - 角色列表（DataTable + FilterBar）
   - 角色表单（新建/编辑）
   - 权限配置

2. 创建 `src/forms/RoleForm.tsx`
   - 角色名称、描述
   - 权限选择（树形结构）

3. 创建 API hooks
   - useRoles, useCreateRole, useUpdateRole, useDeleteRole

**检查点:**
- [ ] 角色CRUD完整
- [ ] 权限树正确显示
- [ ] 表单验证正常

---

#### 任务 2.2: 用户管理页面（Users）
**Agent:** page-users  
**模型:** GLM-5  
**预计时间:** 8-10 小时  
**依赖:** 任务 1.1, 1.2, 2.1

**任务内容:**
1. 创建 `src/pages/admin/Users.tsx`
   - 用户列表（DataTable + FilterBar）
   - 用户表单（新建/编辑）
   - 分配角色

2. 创建 `src/forms/UserForm.tsx`
   - 用户信息字段
   - 角色选择

3. 创建 API hooks
   - useUsers, useCreateUser, useUpdateUser, useDeleteUser

**检查点:**
- [ ] 用户CRUD完整
- [ ] 角色分配正常
- [ ] 表单验证正常

---

#### 任务 2.3: 权限配置页面（PermissionSettings）
**Agent:** page-permissions  
**模型:** GLM-5  
**预计时间:** 8-10 小时  
**依赖:** 任务 2.1, 2.2

**任务内容:**
1. 创建 `src/pages/admin/PermissionManagement.tsx`
   - 权限矩阵展示
   - 角色-权限关联
   - 数据权限配置

2. 创建权限配置组件
   - PermissionMatrix.tsx
   - DataPermissionConfig.tsx

**检查点:**
- [ ] 权限矩阵正确显示
- [ ] 权限修改生效
- [ ] 数据权限配置完整

---

### Phase 3: 设置模块（第 2-3 周）

#### 任务 3.1: 日志管理页面（AuditLog/LoginLog）
**Agent:** page-logs  
**模型:** GLM-5  
**预计时间:** 6-8 小时  
**依赖:** 任务 1.1, 1.2

**任务内容:**
1. 创建 `src/pages/settings/AuditLog.tsx`
   - 操作日志列表
   - 筛选（时间、用户、操作类型）
   - 日志详情

2. 创建 `src/pages/settings/LoginLog.tsx`
   - 登录日志列表
   - 筛选（时间、用户、IP）

**检查点:**
- [ ] 日志列表正常显示
- [ ] 筛选功能正常
- [ ] 详情弹窗正常

---

#### 任务 3.2: 自定义字段页面（CustomFields）
**Agent:** page-custom-fields  
**模型:** GLM-5  
**预计时间:** 8-10 小时  
**依赖:** 任务 1.1, 1.2

**任务内容:**
1. 创建 `src/pages/settings/CustomFields.tsx`
   - 字段列表（按对象分组）
   - 字段表单（新建/编辑）
   - 字段类型选择

2. 创建 `src/forms/CustomFieldForm.tsx`
   - 字段名称、类型、验证规则
   - 选项配置（下拉类型）

**检查点:**
- [ ] 字段CRUD完整
- [ ] 字段类型支持完整
- [ ] 表单验证正常

---

#### 任务 3.3: 自定义对象页面（CustomObjects）
**Agent:** page-custom-objects  
**模型:** GLM-5  
**预计时间:** 10-12 小时  
**依赖:** 任务 3.2

**任务内容:**
1. 创建 `src/pages/settings/CustomObjects.tsx`
   - 对象列表
   - 对象表单（新建/编辑）

2. 创建 `src/pages/settings/CreateCustomObject.tsx`
   - 向导式创建流程

3. 创建 `src/pages/settings/ObjectConfig.tsx`
   - 对象配置中心
   - Tab: 属性、表单、数据、关系、流程、视图

**检查点:**
- [ ] 对象CRUD完整
- [ ] 配置中心各Tab正常
- [ ] 向导流程完整

---

#### 任务 3.4: 工作流管理页面（Workflows）
**Agent:** page-workflows  
**模型:** GLM-5  
**预计时间:** 10-12 小时  
**依赖:** 任务 1.1, 1.2

**任务内容:**
1. 创建 `src/pages/settings/WorkflowList.tsx`
   - 工作流列表
   - 启用/禁用

2. 创建 `src/pages/settings/WorkflowEditor.tsx`
   - 可视化工作流编辑器
   - 节点配置
   - 条件设置

3. 创建 `src/pages/settings/WorkflowLogs.tsx`
   - 执行日志
   - 日志详情

**检查点:**
- [ ] 工作流CRUD完整
- [ ] 编辑器正常显示
- [ ] 日志记录完整

---

### Phase 4: AI 模块（第 3 周）

#### 任务 4.1: AI 智能页面（4个）
**Agent:** pages-ai-batch1  
**模型:** GLM-5  
**预计时间:** 12-16 小时  
**依赖:** 任务 1.1, 1.2

**任务内容:**
1. 创建 `src/pages/ai/LeadAssignment.tsx` - 智能线索分配
2. 创建 `src/pages/ai/LeadScoring.tsx` - 线索评分 AI
3. 创建 `src/pages/ai/SalesForecast.tsx` - 销售预测 AI
4. 创建 `src/pages/ai/CustomerSegmentation.tsx` - 客户分群 AI

每个页面包含：
- AI 配置面板
- 数据展示
- 结果分析
- 操作按钮

**检查点:**
- [ ] 4个页面完整
- [ ] AI配置正常
- [ ] 数据展示正常

---

#### 任务 4.2: AI 智能页面（4个）
**Agent:** pages-ai-batch2  
**模型:** GLM-5  
**预计时间:** 12-16 小时  
**依赖:** 任务 4.1

**任务内容:**
1. 创建 `src/pages/ai/ChurnWarning.tsx` - 客户流失预警
2. 创建 `src/pages/ai/MeetingAssistant.tsx` - 会议助手
3. 创建 `src/pages/ai/PredictiveAI.tsx` - 预测性 AI
4. 创建 `src/pages/ai/AIAgents.tsx` - AI 智能体管理

**检查点:**
- [ ] 4个页面完整
- [ ] AI功能正常
- [ ] 与第一批风格一致

---

### Phase 5: 报表模块补齐（第 3-4 周）

#### 任务 5.1: 报表页面（3个）
**Agent:** pages-reports-batch1  
**模型:** GLM-5  
**预计时间:** 10-12 小时  
**依赖:** 任务 1.1, 1.2

**任务内容:**
1. 创建 `src/pages/LeadConversionReport.tsx` - 线索转化分析
2. 创建 `src/pages/PaymentReport.tsx` - 回款统计报表
3. 创建 `src/pages/SalesFunnelReport.tsx` - 销售漏斗分析（完善版）

每个报表包含：
- 筛选条件（时间范围、部门等）
- 图表展示（Recharts）
- 数据表格
- 导出功能

**检查点:**
- [ ] 3个报表完整
- [ ] 图表正常显示
- [ ] 数据准确

---

#### 任务 5.2: 报表页面（3个）
**Agent:** pages-reports-batch2  
**模型:** GLM-5  
**预计时间:** 10-12 小时  
**依赖:** 任务 5.1

**任务内容:**
1. 创建 `src/pages/PerformanceReport.tsx` - 业绩绩效报表（完善版）
2. 创建 `src/pages/CustomerReport.tsx` - 客户分析报表（完善版）
3. 创建 `src/pages/ActivityReport.tsx` - 跟进活动报表（完善版）

**检查点:**
- [ ] 3个报表完整
- [ ] 与原项目功能一致
- [ ] 数据导出正常

---

### Phase 6: CPQ 与营销模块（第 4 周）

#### 任务 6.1: CPQ 报价系统
**Agent:** page-cpq  
**模型:** GLM-5  
**预计时间:** 12-16 小时  
**依赖:** 任务 1.1, 1.2

**任务内容:**
1. 创建 `src/pages/quotes/QuoteBuilder.tsx` - 报价构建器（核心）
   - 产品选择
   - 价格计算
   - 折扣配置
   - 报价单生成

2. 完善 `src/pages/QuoteDetail.tsx`
   - 三列布局
   - 报价详情展示
   - 操作按钮

3. 完善 `src/pages/QuoteNew.tsx`
   - 新建报价流程

**检查点:**
- [ ] 报价构建器完整
- [ ] 价格计算准确
- [ ] 报价单可生成

---

#### 任务 6.2: 营销自动化页面
**Agent:** pages-marketing  
**模型:** GLM-5  
**预计时间:** 10-12 小时  
**依赖:** 任务 1.1, 1.2

**任务内容:**
1. 创建 `src/pages/CampaignDetail.tsx` - 营销活动详情（完整版）
   - 活动概览
   - 执行记录
   - 效果分析

2. 创建 `src/pages/EmailTemplates.tsx` - 邮件模板
   - 模板列表
   - 模板编辑器
   - 变量插入

3. 创建 `src/pages/TargetLists.tsx` - 目标列表
   - 列表管理
   - 客户筛选
   - 列表导入/导出

**检查点:**
- [ ] 营销页面完整
- [ ] 邮件编辑器正常
- [ ] 目标列表管理正常

---

### Phase 7: 集成模块（第 4 周）

#### 任务 7.1: 系统集成页面
**Agent:** pages-integration  
**模型:** GLM-5  
**预计时间:** 8-10 小时  
**依赖:** 任务 1.1, 1.2

**任务内容:**
1. 创建 `src/pages/tickets/TicketList.tsx` - 工单列表
   - 工单列表
   - 状态筛选
   - 工单详情

2. 创建 `src/pages/knowledge/KnowledgeSearch.tsx` - 知识库搜索
   - 搜索界面
   - 分类浏览
   - 文章详情

3. 创建 `src/pages/callcenter/OutboundTasks.tsx` - 外呼任务
   - 任务列表
   - 呼叫面板
   - 通话记录

**检查点:**
- [ ] 3个集成页面完整
- [ ] 与原项目功能一致
- [ ] 数据展示正常

---

### Phase 8: 列表页面 UI 升级（第 4-5 周）

#### 任务 8.1: 客户/线索/商机列表升级
**Agent:** upgrade-list-pages-batch1  
**模型:** GLM-5  
**预计时间:** 12-16 小时  
**依赖:** 任务 1.3, 1.4

**任务内容:**
升级以下列表页面为 HubSpot 风格：
1. `src/pages/CustomerList.tsx` - 添加 FilterBar、筛选标签、保存筛选
2. `src/pages/LeadList.tsx` - 同上
3. `src/pages/OpportunityList.tsx` - 同上

升级内容：
- 添加 FilterBar 组件
- 添加筛选标签显示
- 添加保存筛选功能
- 添加列设置功能
- 优化批量操作栏

**检查点:**
- [ ] 3个列表页面升级完成
- [ ] FilterBar 正常工作
- [ ] 与原项目外观一致

---

#### 任务 8.2: 其他列表页面升级
**Agent:** upgrade-list-pages-batch2  
**模型:** GLM-5  
**预计时间:** 10-12 小时  
**依赖:** 任务 8.1

**任务内容:**
升级以下列表页面：
1. `src/pages/ContactList.tsx`
2. `src/pages/ContractList.tsx`
3. `src/pages/OrderList.tsx`
4. `src/pages/PaymentList.tsx`

**检查点:**
- [ ] 4个列表页面升级完成
- [ ] 风格统一

---

### Phase 9: 详情页面 UI 升级（第 5 周）

#### 任务 9.1: 详情页面三列布局升级
**Agent:** upgrade-detail-pages  
**模型:** GLM-5  
**预计时间:** 12-16 小时  
**依赖:** 任务 1.4, 8.1, 8.2

**任务内容:**
升级以下详情页面为三列布局：
1. `src/pages/CustomerDetail.tsx`
2. `src/pages/LeadDetail.tsx`
3. `src/pages/OpportunityDetail.tsx`
4. `src/pages/ContactDetail.tsx`

升级内容：
- 使用 DetailLayout 组件
- 左侧：信息卡片 + 操作按钮
- 中间：Tabs（概览、活动、AI洞察）
- 右侧：相关列表卡片

**检查点:**
- [ ] 4个详情页面升级完成
- [ ] 三列布局正确
- [ ] 与原项目外观一致

---

### Phase 10: 最终测试与优化（第 5 周）

#### 任务 10.1: 功能对比测试
**Agent:** final-testing  
**模型:** GLM-5  
**预计时间:** 8-10 小时  
**依赖:** 所有前置任务

**任务内容:**
1. 与原项目功能逐项对比
2. 记录功能差异
3. 修复发现的问题

测试清单：
- [ ] 所有菜单项可正常访问
- [ ] 所有页面功能正常
- [ ] 所有表单可正常提交
- [ ] 所有列表有筛选功能
- [ ] 所有详情页有三列布局
- [ ] AI模块8个页面完整
- [ ] 报表模块6个页面完整
- [ ] 设置模块所有页面完整

---

#### 任务 10.2: 构建与部署测试
**Agent:** build-testing  
**模型:** GLM-5  
**预计时间:** 4-6 小时  
**依赖:** 任务 10.1

**任务内容:**
1. TypeScript 编译检查
2. 构建测试
3. 包大小分析
4. 性能测试

**检查点:**
- [ ] 构建成功
- [ ] 无类型错误
- [ ] 包大小合理

---

## 📊 Agent 并行计划

### 第 1 批（立即启动，4个Agent并行）
```
任务 1.1: menu-migration
任务 1.2: i18n-migration
任务 1.3: filterbar-component
任务 1.4: detail-layout-component
```

### 第 2 批（第1批完成后，3个Agent并行）
```
任务 2.1: page-roles
任务 2.2: page-users
任务 2.3: page-permissions
```

### 第 3 批（第2批完成后，4个Agent并行）
```
任务 3.1: page-logs
任务 3.2: page-custom-fields
任务 3.3: page-custom-objects
任务 3.4: page-workflows
```

### 第 4 批（第3批完成后，2个Agent并行）
```
任务 4.1: pages-ai-batch1
任务 4.2: pages-ai-batch2
```

### 第 5 批（第4批完成后，2个Agent并行）
```
任务 5.1: pages-reports-batch1
任务 5.2: pages-reports-batch2
```

### 第 6 批（第5批完成后，2个Agent并行）
```
任务 6.1: page-cpq
任务 6.2: pages-marketing
```

### 第 7 批（第6批完成后，1个Agent）
```
任务 7.1: pages-integration
```

### 第 8 批（第7批完成后，2个Agent并行）
```
任务 8.1: upgrade-list-pages-batch1
任务 8.2: upgrade-list-pages-batch2
```

### 第 9 批（第8批完成后，1个Agent）
```
任务 9.1: upgrade-detail-pages
```

### 第 10 批（第9批完成后，2个Agent并行）
```
任务 10.1: final-testing
任务 10.2: build-testing
```

---

## ⏱️ 时间估算

| 批次 | Agent数 | 预计时间 | 累计时间 |
|------|---------|----------|----------|
| 第1批 | 4 | 8小时 | 8小时 |
| 第2批 | 3 | 10小时 | 18小时 |
| 第3批 | 4 | 12小时 | 30小时 |
| 第4批 | 2 | 16小时 | 46小时 |
| 第5批 | 2 | 12小时 | 58小时 |
| 第6批 | 2 | 14小时 | 72小时 |
| 第7批 | 1 | 10小时 | 82小时 |
| 第8批 | 2 | 14小时 | 96小时 |
| 第9批 | 1 | 14小时 | 110小时 |
| 第10批 | 2 | 10小时 | 120小时 |

**总计：约 120 小时（约 15 天，考虑并行优化后约 4-5 周）**

---

## 🎯 启动命令

### 第 1 批（立即执行）

```bash
# 任务 1.1: 完善左侧菜单
sessions_spawn --task "完善左侧菜单..." --label menu-migration --model glm5

# 任务 1.2: 迁移多语言翻译
sessions_spawn --task "迁移多语言翻译..." --label i18n-migration --model glm5

# 任务 1.3: 创建 FilterBar 组件
sessions_spawn --task "创建 FilterBar 组件..." --label filterbar-component --model glm5

# 任务 1.4: 创建三列布局组件
sessions_spawn --task "创建三列布局组件..." --label detail-layout-component --model glm5
```

---

## ✅ 成功标准

1. **菜单结构** - 与原项目完全一致，所有42个子菜单可访问
2. **业务功能** - 所有页面功能与原项目一致
3. **AI 模块** - 8个独立页面完整，功能正常
4. **HubSpot 风格** - 所有列表页有高级筛选，所有详情页有三列布局
5. **多语言** - 翻译文件完整，语言切换正常
6. **构建成功** - TypeScript无错误，构建成功

---

*计划创建时间：2026-04-07*  
*预计完成时间：2026-05-12*  
*总 Agent 数：26 个*