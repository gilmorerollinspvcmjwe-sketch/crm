# CRM UI 升级项目 - 迁移计划 V4

> 基于 GAP_ANALYSIS_REPORT.md（2026-04-08）制定
> 项目路径：C:\Users\13609\Projects\crm-ui-upgrade
> 原项目路径：C:\Users\13609\.openclaw\workspace\crm2026-4-3new
> 制定时间：2026-04-08
> 版本：V4（聚焦 P0 核心缺失模块）

---

## 一、当前状态总结

### 1.1 Phase 1-8 完成情况

| Phase | 内容 | 完成度 | 说明 |
|-------|------|--------|------|
| Phase 1-3 | 菜单系统 + 核心组件 + 页面基础结构 | ✅ 100% | 42个子菜单可访问，23个页面 |
| Phase 4 | 业务功能完善 + UI 优化 | ✅ 100% | 客户/商机/线索/联系人全量功能 |
| Phase 5 | 架构升级（Zustand + 内联编辑） | ✅ 100% | 全局状态迁移完成 |
| Phase 6 | AI + 报表 + 其他模块 | ⚠️ 部分完成 | 页面结构存在，功能待完善 |
| Phase 7 | 高级功能（虚拟列表 + 看板拖拽） | ⚠️ 部分完成 | 基础存在，待优化 |
| Phase 8 | 测试和优化 | ⚠️ 待进行 | - |

### 1.2 剩余问题（基于 GAP 分析）

| 优先级 | 缺失项 | 数量 | 说明 |
|--------|--------|------|------|
| 🔴 P0 | 核心业务页面/组件缺失 | 21项 | CPQ、自定义对象、工作流编辑器 |
| 🟠 P1 | 重要功能缺失 | 15项 | AI页面、类型文件、Hooks |
| 🟡 P2 | 优化项缺失 | 9项 | Mock数据、文档、性能 |

### 1.3 与原项目的核心差距

```
GAP 总体评估：
- 页面/路由：~55% 完整度（差距 45%）
- 业务功能：~75% 完整度（CPQ/自定义对象/工作流编辑缺失）
- 组件：~60% 完整度（PermissionMatrix/WorkflowEditor/CPQ/Dashlet 缺失）
- Hooks/API：~70% 完整度（AuditLogs/LoginLogs/Types 缺失）
- Mock 数据：~0% 完整度（全部缺失）
```

**核心差距分析：**
1. **CPQ 报价模块完全空白** - 原项目有完整的 QuoteBuilder + ProductSelector + QuoteCalculator + QuotePreview
2. **自定义对象系统完全空白** - 原项目有完整的对象/字段/表单/页面/视图管理
3. **工作流编辑器完全空白** - 原项目有可视化 FlowCanvas + FlowNodes + PropertyPanel
4. **14个核心类型文件缺失** - ai-agents, ai, callcenter, cpq, customField, customObject, dashboard, knowledge, marketing, permission, pricebook, settings, ticket, workflow
5. **Mock 数据层完全缺失** - 原项目有 25 个 Mock 数据文件

---

## 二、P0 缺失模块（必须补齐）

### 2.1 P0.1: CPQ 报价模块

**优先级：🔴 最高**
**业务价值：** CPQ（Configure-Price-Quote）是 CRM 核心差异化功能，直接影响销售效率

#### 2.1.1 缺失文件清单

| 文件 | 原项目路径 | 说明 |
|------|-----------|------|
| `QuoteDetail.tsx` | `pages/QuoteDetail.tsx` | 报价单详情页 |
| `QuoteNew.tsx` | `pages/QuoteNew.tsx` | 新建报价单页 |
| `QuoteBuilder.tsx` | `pages/quotes/QuoteBuilder.tsx` | CPQ 报价构建器主文件 |
| `ProductSelector.tsx` | `components/CPQ/ProductSelector.tsx` | 产品选择器 |
| `QuoteCalculator.tsx` | `components/CPQ/QuoteCalculator.tsx` | 价格计算器 |
| `QuotePreview.tsx` | `components/CPQ/QuotePreview.tsx` | 报价预览 |
| `cpq.ts` | `types/cpq.ts` | CPQ 类型定义 |

#### 2.1.2 功能要求

**QuoteDetail.tsx**
- 报价单完整信息展示（客户、产品、价格、折扣）
- 状态管理（草稿/已发送/已接受/已拒绝）
- 操作按钮（编辑/复制/发送/作废）
- 审批历史时间线
- 关联对象展示（客户、商机、合同）

**QuoteBuilder.tsx**
- 多步骤报价构建流程
- 产品搜索和选择
- 数量/折扣/定价配置
- 实时价格计算
- 报价模板支持
- 保存为草稿/直接发送

**ProductSelector.tsx**
- 产品分类浏览
- 关键词搜索
- 价格表集成
- 批量选择
- 产品配置选项

**QuoteCalculator.tsx**
- 批量折扣计算
- 阶梯定价计算
- 税费计算
- 总价汇总
- 利润率显示

**QuotePreview.tsx**
- 报价单预览模板
- PDF 导出预览
- 邮件预览
- 打印样式

---

### 2.2 P0.2: 自定义对象系统

**优先级：🔴 最高**
**业务价值：** 自定义对象是 CRM 灵活性的核心体现，支持企业定制化需求

#### 2.2.1 缺失文件清单

| 文件 | 原项目路径 | 说明 |
|------|-----------|------|
| `CustomObjects.tsx` | `pages/settings/CustomObjects.tsx` | 自定义对象列表 |
| `CreateCustomObject.tsx` | `pages/settings/CreateCustomObject.tsx` | 创建向导 |
| `ObjectConfig.tsx` | `pages/settings/ObjectConfig.tsx` | 对象配置 |
| `ObjectFields.tsx` | `pages/settings/ObjectFields.tsx` | 字段管理 |
| `ObjectData.tsx` | `pages/settings/ObjectData.tsx` | 对象数据 |
| `ObjectRelationships.tsx` | `pages/settings/ObjectRelationships.tsx` | 关联管理 |
| `FormDesigner.tsx` | `pages/settings/FormDesigner.tsx` | 表单设计器 |
| `PageBuilder.tsx` | `pages/settings/PageBuilder.tsx` | 页面构建器 |
| `PipelineManager.tsx` | `pages/settings/PipelineManager.tsx` | 管道管理器 |
| `ViewManager.tsx` | `pages/settings/ViewManager.tsx` | 视图管理器 |
| `customObject.ts` | `types/customObject.ts` | 自定义对象类型 |
| `customField.ts` | `types/customField.ts` | 自定义字段类型 |

#### 2.2.2 功能要求

**CustomObjects.tsx**
- 对象列表展示
- 创建/编辑/删除对象
- 对象启用/禁用
- 对象图标和颜色配置

**ObjectFields.tsx**
- 字段类型：文本、数字、日期、布尔、选择、查找、多选
- 字段属性：必填、唯一、默认值、验证规则
- 字段顺序拖拽调整
- 字段分组

**FormDesigner.tsx**
- 拖拽式表单设计
- 字段组件拖放
- 布局容器（栅格、分栏）
- 表单样式定制
- 条件显示/隐藏

**PageBuilder.tsx**
- 页面布局设计
- 组件库（字段、图表、列表）
- 多视图支持
- 响应式布局

**ObjectRelationships.tsx**
-  Lookup（查找）关联
-  Master-Detail（主从）关联
-  自关联
-  层级结构

---

### 2.3 P0.3: 工作流编辑器

**优先级：🔴 最高**
**业务价值：** 可视化工作流编辑器是自动化业务的核心工具

#### 2.3.1 缺失文件清单

| 文件 | 原项目路径 | 说明 |
|------|-----------|------|
| `WorkflowEditor.tsx` | `pages/settings/WorkflowEditor.tsx` | 工作流编辑器主文件 |
| `FlowCanvas.tsx` | `components/WorkflowEditor/FlowCanvas.tsx` | 流程画布 |
| `FlowNodes.tsx` | `components/WorkflowEditor/FlowNodes.tsx` | 流程节点组件 |
| `NodePanel.tsx` | `components/WorkflowEditor/NodePanel.tsx` | 节点配置面板 |
| `PropertyPanel.tsx` | `components/WorkflowEditor/PropertyPanel.tsx` | 属性面板 |
| `TriggerPanel.tsx` | `components/WorkflowEditor/TriggerPanel.tsx` | 触发器面板 |
| `ActionPanel.tsx` | `components/WorkflowEditor/ActionPanel.tsx` | 操作面板 |
| `ConnectionLine.tsx` | `components/WorkflowEditor/ConnectionLine.tsx` | 连接线 |
| `workflow.ts` | `types/workflow.ts` | 工作流类型定义 |

#### 2.3.2 功能要求

**FlowCanvas.tsx**
- 无限画布，支持缩放和平移
- 节点拖拽放置
- 节点连接（拖拽创建连接线）
- 网格对齐
- 节点选中/多选

**FlowNodes.tsx**
- 触发器节点（时间、条件、手动）
- 操作节点（创建、更新、删除、通知）
- 逻辑节点（分支、循环、延时）
- 节点样式和图标

**NodePanel.tsx**
- 节点模板列表
- 节点搜索
- 节点分类
- 拖拽到画布

**PropertyPanel.tsx**
- 选中节点属性编辑
- 表单式配置
- 实时预览
- 表达式编辑器

**TriggerPanel.tsx**
- 触发器类型选择
- 触发条件配置
- 触发器预览

**ActionPanel.tsx**
- 操作类型选择
- 操作配置
- 错误处理配置

---

## 三、P1 缺失模块（重要）

### 3.1 缺失的类型文件（14个）

| 类型文件 | 说明 | 优先级 |
|----------|------|--------|
| `ai-agents.ts` | AI Agent 类型定义 | 🟠 P1 |
| `ai.ts` | AI 通用类型定义 | 🟠 P1 |
| `callcenter.ts` | 呼叫中心类型定义 | 🟠 P1 |
| `cpq.ts` | CPQ 报价类型定义 | 🔴 P0 |
| `customField.ts` | 自定义字段类型 | 🔴 P0 |
| `customObject.ts` | 自定义对象类型 | 🔴 P0 |
| `dashboard.ts` | 仪表盘类型定义 | 🟠 P1 |
| `knowledge.ts` | 知识库类型定义 | 🟠 P1 |
| `marketing.ts` | 营销类型定义 | 🟠 P1 |
| `permission.ts` | 权限类型定义 | 🟠 P1 |
| `pricebook.ts` | 价格表类型定义 | 🟠 P1 |
| `settings.ts` | 设置类型定义 | 🟠 P1 |
| `ticket.ts` | 工单类型定义 | 🟠 P1 |
| `workflow.ts` | 工作流类型定义 | 🔴 P0 |

### 3.2 缺失的 UI 组件

| 组件 | 说明 | 优先级 |
|------|------|--------|
| `PermissionMatrix.tsx` | 权限可视化配置矩阵 | 🟠 P1 |
| `DuplicateCheckModal.tsx` | 线索查重弹窗 | 🟠 P1 |
| `FunnelChart.tsx` | 漏斗图组件 | 🟠 P1 |
| `LeadTrendDashlet.tsx` | 线索趋势小部件 | 🟠 P1 |
| `SalesOverviewDashlet.tsx` | 销售概览小部件 | 🟠 P1 |
| `ContractDashlet.tsx` | 合同小部件 | 🟡 P2 |
| `CustomerDistDashlet.tsx` | 客户分布小部件 | 🟡 P2 |
| `FunnelDashlet.tsx` | 漏斗小部件 | 🟡 P2 |
| `PaymentWarningDashlet.tsx` | 回款预警小部件 | 🟡 P2 |
| `PerformanceDashlet.tsx` | 业绩小部件 | 🟡 P2 |
| `TaskDashlet.tsx` | 任务小部件 | 🟡 P2 |
| `TodoDashlet.tsx` | 待办小部件 | 🟡 P2 |

### 3.3 缺失的 AI 页面（8个）

| 页面 | 说明 | 优先级 |
|------|------|--------|
| `AIAnalytics.tsx` | AI 分析页面 | 🟠 P1 |
| `AIAssistant.tsx` | AI 助手页面 | 🟠 P1 |
| `AIConfig.tsx` | AI 配置页面 | 🟠 P1 |
| `AIDashboard.tsx` | AI 仪表盘 | 🟠 P1 |
| `AIHistory.tsx` | AI 历史记录 | 🟠 P1 |
| `AIModels.tsx` | AI 模型管理 | 🟠 P1 |
| `AIPromptTemplates.tsx` | AI 提示词模板 | 🟠 P1 |
| `AIUsage.tsx` | AI 使用统计 | 🟠 P1 |

### 3.4 缺失的日志/审计页面

| 页面 | 说明 | 优先级 |
|------|------|--------|
| `AuditLog.tsx` | 操作日志列表 | 🟠 P1 |
| `LoginLog.tsx` | 登录日志列表 | 🟠 P1 |
| `WorkflowLogs.tsx` | 工作流执行日志 | 🟠 P1 |

---

## 四、P2 缺失模块（一般）

### 4.1 Mock 数据完善

当前项目完全未实现 Mock 数据层，需要补充：

| Mock 文件 | 说明 |
|-----------|------|
| `activityData.ts` | 活动 Mock |
| `aiAgentsData.ts` | AI Agent Mock |
| `aiData.ts` | AI 数据 Mock |
| `contactData.ts` | 联系人 Mock |
| `contractData.ts` | 合同 Mock |
| `cpqData.ts` | CPQ 报价 Mock |
| `customerData.ts` | 客户 Mock |
| `customFieldData.ts` | 自定义字段 Mock |
| `customObjectsData.ts` | 自定义对象 Mock |
| `dashboardData.ts` | 仪表盘 Mock |
| `leadData.ts` | 线索 Mock |
| `marketingData.ts` | 营销 Mock |
| `opportunityData.ts` | 商机 Mock |
| `orderData.ts` | 订单 Mock |
| `paymentData.ts` | 回款 Mock |
| `permissionData.ts` | 权限 Mock |
| `pricebookData.ts` | 价格表 Mock |
| `reportData.ts` | 报表 Mock |
| `settingsData.ts` | 设置 Mock |
| `ticketData.ts` | 工单 Mock |
| `workflowData.ts` | 工作流 Mock |
| `workbench.ts` | 工作台 Mock |

### 4.2 文档完善

- API 文档
- 组件使用文档
- 业务逻辑文档
- 部署文档

### 4.3 性能优化

- 虚拟列表优化
- 图片懒加载
- 代码分割优化
- 缓存策略

---

## 五、Agent 执行计划

### 第1批：CPQ 报价模块（3-4 Agent 并行）

**预计时间：24-32 小时**

#### Agent 1.1: CPQ 类型和基础架构
```
任务：创建 cpq.ts 类型文件和 QuoteList 完善
文件：
  - types/cpq.ts
  - 补充 routes/quote.tsx 路由
依赖：无
时间：6-8小时
检查点：
  - [ ] cpq.ts 类型定义完整
  - [ ] 报价路由完整（/quote/new, /quote/:id, /quote/:id/edit）
```

#### Agent 1.2: CPQ 页面迁移
```
任务：从原项目迁移 QuoteDetail, QuoteNew, QuoteBuilder
文件：
  - pages/QuoteDetail.tsx
  - pages/QuoteNew.tsx
  - pages/quotes/QuoteBuilder.tsx
依赖：Agent 1.1
时间：10-12小时
检查点：
  - [ ] QuoteDetail 详情页完整
  - [ ] QuoteNew 新建页完整
  - [ ] QuoteBuilder 构建器完整
```

#### Agent 1.3: CPQ 组件组
```
任务：从原项目迁移 ProductSelector, QuoteCalculator, QuotePreview
文件：
  - components/CPQ/ProductSelector.tsx
  - components/CPQ/QuoteCalculator.tsx
  - components/CPQ/QuotePreview.tsx
依赖：Agent 1.1
时间：8-10小时
检查点：
  - [ ] ProductSelector 产品选择器完整
  - [ ] QuoteCalculator 价格计算完整
  - [ ] QuotePreview 预览完整
```

#### Agent 1.4: CPQ Mock 数据
```
任务：创建 cpqData.ts Mock 数据
文件：
  - mock/cpqData.ts
依赖：Agent 1.1
时间：2-4小时
检查点：
  - [ ] 产品数据 Mock 完整
  - [ ] 报价单数据 Mock 完整
```

---

### 第2批：自定义对象系统（4-5 Agent 并行）

**预计时间：40-50 小时**

#### Agent 2.1: 自定义对象类型和页面
```
任务：创建类型文件和 CustomObjects 页面
文件：
  - types/customObject.ts
  - types/customField.ts
  - pages/settings/CustomObjects.tsx
  - pages/settings/CreateCustomObject.tsx
依赖：无
时间：10-12小时
检查点：
  - [ ] 类型定义完整
  - [ ] CustomObjects 列表完整
  - [ ] 创建向导完整
```

#### Agent 2.2: 对象字段管理
```
任务：ObjectFields 页面和功能
文件：
  - pages/settings/ObjectFields.tsx
  - pages/settings/ObjectData.tsx
依赖：Agent 2.1
时间：10-12小时
检查点：
  - [ ] ObjectFields 字段管理完整
  - [ ] ObjectData 数据管理完整
  - [ ] 支持所有字段类型
```

#### Agent 2.3: 表单设计器
```
任务：FormDesigner 页面和组件
文件：
  - pages/settings/FormDesigner.tsx
依赖：Agent 2.1
时间：10-12小时
检查点：
  - [ ] 拖拽式表单设计
  - [ ] 字段组件可用
  - [ ] 布局容器可用
```

#### Agent 2.4: 页面构建器和视图管理
```
任务：PageBuilder 和 ViewManager 页面
文件：
  - pages/settings/PageBuilder.tsx
  - pages/settings/ViewManager.tsx
  - pages/settings/PipelineManager.tsx
依赖：Agent 2.1, 2.3
时间：8-10小时
检查点：
  - [ ] PageBuilder 页面构建完整
  - [ ] ViewManager 视图管理完整
  - [ ] PipelineManager 管道管理完整
```

#### Agent 2.5: 对象关联管理
```
任务：ObjectRelationships 页面
文件：
  - pages/settings/ObjectRelationships.tsx
  - pages/settings/ObjectConfig.tsx
依赖：Agent 2.1
时间：4-6小时
检查点：
  - [ ] 关联类型支持完整
  - [ ] 关联配置完整
```

---

### 第3批：工作流编辑器（4-5 Agent 并行）

**预计时间：32-40 小时**

#### Agent 3.1: 工作流类型和页面
```
任务：创建 workflow.ts 类型和 WorkflowList 完善
文件：
  - types/workflow.ts（补充）
  - pages/settings/WorkflowList.tsx（完善）
  - pages/settings/WorkflowEditor.tsx
依赖：无
时间：8-10小时
检查点：
  - [ ] 类型定义完整
  - [ ] WorkflowList 功能完整
  - [ ] WorkflowEditor 主框架
```

#### Agent 3.2: 流程画布
```
任务：FlowCanvas 组件
文件：
  - components/WorkflowEditor/FlowCanvas.tsx
  - components/WorkflowEditor/ConnectionLine.tsx
依赖：Agent 3.1
时间：10-12小时
检查点：
  - [ ] 画布渲染正常
  - [ ] 节点拖拽正常
  - [ ] 连接线创建正常
  - [ ] 缩放平移正常
```

#### Agent 3.3: 流程节点
```
任务：FlowNodes 和 NodePanel 组件
文件：
  - components/WorkflowEditor/FlowNodes.tsx
  - components/WorkflowEditor/NodePanel.tsx
  - components/WorkflowEditor/types.ts
依赖：Agent 3.1
时间：8-10小时
检查点：
  - [ ] 节点类型完整
  - [ ] 节点渲染正确
  - [ ] 节点面板可用
```

#### Agent 3.4: 属性和操作面板
```
任务：PropertyPanel, TriggerPanel, ActionPanel
文件：
  - components/WorkflowEditor/PropertyPanel.tsx
  - components/WorkflowEditor/TriggerPanel.tsx
  - components/WorkflowEditor/ActionPanel.tsx
依赖：Agent 3.2, 3.3
时间：6-8小时
检查点：
  - [ ] 属性面板完整
  - [ ] 触发器面板完整
  - [ ] 操作面板完整
```

#### Agent 3.5: 工作流日志
```
任务：WorkflowLogs 页面
文件：
  - pages/settings/WorkflowLogs.tsx
依赖：Agent 3.1
时间：2-4小时
检查点：
  - [ ] 日志列表完整
  - [ ] 日志详情可用
```

---

### 第4批：类型文件和 Hooks（3-4 Agent 并行）

**预计时间：24-32 小时**

#### Agent 4.1: 核心类型文件
```
任务：创建 8 个核心类型文件
文件：
  - types/ai-agents.ts
  - types/ai.ts
  - types/callcenter.ts
  - types/dashboard.ts
  - types/knowledge.ts
  - types/marketing.ts
  - types/permission.ts
  - types/settings.ts
依赖：无
时间：10-12小时
检查点：
  - [ ] 所有类型文件创建完成
  - [ ] 类型导出正确
```

#### Agent 4.2: 业务类型文件
```
任务：创建 6 个业务类型文件
文件：
  - types/pricebook.ts
  - types/ticket.ts
  - types/activity.ts
  - types/report.ts
  - types/services.ts
  - types/api.ts
依赖：无
时间：8-10小时
检查点：
  - [ ] 价格表类型完整
  - [ ] 工单类型完整
  - [ ] 活动类型完整
  - [ ] 报表类型完整
```

#### Agent 4.3: PermissionMatrix 组件
```
任务：从原项目迁移 PermissionMatrix
文件：
  - components/PermissionMatrix/PermissionMatrix.tsx
  - components/Permission/RoleForm.tsx
  - components/Permission/UserRoleAssign.tsx
依赖：Agent 4.1
时间：4-6小时
检查点：
  - [ ] PermissionMatrix 完整
  - [ ] RoleForm 完整
  - [ ] UserRoleAssign 完整
```

#### Agent 4.4: AI 页面完善
```
任务：完善 8 个 AI 页面
文件：
  - pages/ai/AIAnalytics.tsx
  - pages/ai/AIAssistant.tsx
  - pages/ai/AIConfig.tsx
  - pages/ai/AIDashboard.tsx
  - pages/ai/AIHistory.tsx
  - pages/ai/AIModels.tsx
  - pages/ai/AIPromptTemplates.tsx
  - pages/ai/AIUsage.tsx
依赖：Agent 4.1
时间：8-10小时
检查点：
  - [ ] 8 个 AI 页面功能完整
```

---

### 第5批：Mock 数据和 Dashlet（2-3 Agent 并行）

**预计时间：16-24 小时**

#### Agent 5.1: Mock 数据层
```
任务：创建核心 Mock 数据文件
文件：
  - mock/customerData.ts
  - mock/leadData.ts
  - mock/opportunityData.ts
  - mock/contactData.ts
  - mock/contractData.ts
  - mock/orderData.ts
  - mock/paymentData.ts
  - mock/activityData.ts
依赖：无
时间：8-10小时
检查点：
  - [ ] 核心业务 Mock 完整
  - [ ] 数据关联正确
```

#### Agent 5.2: Mock 数据补充
```
任务：创建补充 Mock 数据文件
文件：
  - mock/aiData.ts
  - mock/aiAgentsData.ts
  - mock/marketingData.ts
  - mock/pricebookData.ts
  - mock/permissionData.ts
  - mock/settingsData.ts
  - mock/ticketData.ts
  - mock/workflowData.ts
依赖：Agent 5.1
时间：6-8小时
检查点：
  - [ ] AI Mock 完整
  - [ ] 营销 Mock 完整
  - [ ] 设置 Mock 完整
```

#### Agent 5.3: Dashlet 组件
```
任务：创建 Dashlet 组件
文件：
  - components/Dashlet/SalesOverviewDashlet.tsx
  - components/Dashlet/LeadTrendDashlet.tsx
  - components/Dashlet/FunnelDashlet.tsx
  - components/Dashlet/ContractDashlet.tsx
  - components/Dashlet/PaymentWarningDashlet.tsx
  - components/Dashlet/PerformanceDashlet.tsx
  - components/Dashlet/TaskDashlet.tsx
  - components/Dashlet/TodoDashlet.tsx
依赖：无
时间：6-8小时
检查点：
  - [ ] 8 个 Dashlet 组件完成
  - [ ] 图表渲染正常
```

---

## 六、检查点汇总

### 批次检查点

| 批次 | 检查点 |
|------|--------|
| 第1批 | ✅ CPQ 类型完整 ✅ CPQ 页面完整 ✅ CPQ 组件完整 ✅ Mock 数据完整 |
| 第2批 | ✅ 类型定义完整 ✅ 自定义对象页面完整 ✅ 表单设计器完整 ✅ 页面构建器完整 |
| 第3批 | ✅ 流程画布正常 ✅ 节点组件正常 ✅ 属性面板正常 ✅ 工作流日志正常 |
| 第4批 | ✅ 所有类型文件完整 ✅ PermissionMatrix 完整 ✅ AI 页面完整 |
| 第5批 | ✅ Mock 数据层完整 ✅ Dashlet 组件完整 |

---

## 七、时间估算汇总

| 批次 | Agent 数量 | 预计时间 | 累计时间 |
|------|------------|----------|----------|
| 第1批 | 4 | 24-32h | 24-32h |
| 第2批 | 5 | 40-50h | 64-82h |
| 第3批 | 5 | 32-40h | 96-122h |
| 第4批 | 4 | 24-32h | 120-154h |
| 第5批 | 3 | 16-24h | 136-178h |

**总计：约 136-178 小时（约 6-9 周，4 Agent 并行）**

---

## 八、依赖关系图

```
[无依赖]
   │
   ├── Agent 1.1 (cpq.ts) ──────────┬──→ Agent 1.2 (CPQ页面)
   │                               └──→ Agent 1.3 (CPQ组件)
   │
   ├── Agent 2.1 (自定义对象类型) ──┬──→ Agent 2.2 (字段管理)
   │                               ├──→ Agent 2.3 (表单设计器)
   │                               ├──→ Agent 2.4 (页面构建器)
   │                               └──→ Agent 2.5 (关联管理)
   │
   ├── Agent 3.1 (workflow.ts) ────┬──→ Agent 3.2 (FlowCanvas)
   │                               ├──→ Agent 3.3 (FlowNodes)
   │                               └──→ Agent 3.5 (WorkflowLogs)
   │                                        │
   │                                        ↓
   │                               Agent 3.4 (属性面板)
   │                                   (依赖 3.2, 3.3)
   │
   ├── Agent 4.1 (核心类型) ────────┬──→ Agent 4.3 (PermissionMatrix)
   │                               └──→ Agent 4.4 (AI页面)
   │
   ├── Agent 4.2 (业务类型) ────────┐
   │
   └── Agent 5.1 (Mock核心) ────────┴──→ Agent 5.2 (Mock补充)
                                          └──→ Agent 5.3 (Dashlet)
```

---

## 九、风险和注意事项

### 9.1 风险识别

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| 原项目组件依赖复杂 | 迁移难度高 | 分批迁移，逐步验证 |
| 类型定义不完整 | 运行时错误 | 严格类型检查 |
| Mock 数据量大 | 工作量大 | 优先级排序 |
| Agent 协作冲突 | 代码冲突 | 按模块分工 |

### 9.2 注意事项

1. **严格遵循 shadcn/ui 规范** - 新组件使用 shadcn/ui + Tailwind CSS
2. **保持类型一致性** - 所有新文件必须完整类型定义
3. **Mock 数据分层** - 统一 mock 目录结构
4. **渐进式迁移** - 每批完成后进行验证
5. **代码审查** - 每批完成后进行 Review

---

## 十、后续计划（P3 优化）

批次完成后，进入 P3 优化阶段：

1. **文档完善** - API 文档、组件文档
2. **性能优化** - 虚拟列表、懒加载
3. **E2E 测试** - Playwright 测试用例
4. **Bug 修复** - 完整测试后修复问题

---

*文档版本：V4*
*制定时间：2026-04-08*
*下次更新：批次完成后*
