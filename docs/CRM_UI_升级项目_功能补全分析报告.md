# CRM UI 升级项目 — 功能补全分析报告

**报告日期**：2026-04-11  
**分析视角**：产品经理  
**项目路径**：`C:\Users\13609\Projects\crm-ui-upgrade`  
**功能说明文档**：`C:\Users\13609\Desktop\CRM 客户功能说明.docx`（含 57 张 UI 截图）  
**参考报告**：`GAP_ANALYSIS_REPORT.md`（2026-04-08）、`gap-analysis.md`（2026-04-10）

---

## 一、功能说明文档解析

### 1.1 文档结构总览

功能说明文档以 UI 截图（57 张）为主、文字说明为辅，定义了 8 个功能模块：

| # | 模块名称 | 文字说明摘要 | UI 截图数量 |
|---|---------|------------|------------|
| 1 | **客户管理** | 360 全景视图，右侧 AI 分析客户，关联活动信息 | ~5 张 |
| 2 | **联系人详情** | 左中右结构，同客户管理布局 | 少量 |
| 3 | **交易详情/商机** | 商机管理，左中右结构 | 少量 |
| 4 | **订单管理** | ⚠️ **目前缺失**，需增加二级菜单管理实际客户订单 | 少量 |
| 5 | **自定义页面** | 全部对象详情页支持自定义卡片布局，多视图保存 | 较多 |
| 6 | **对象管理补充** | 自定义属性、表单、关联、阶段 | 较多 |
| 7 | **自动化工作流** | 低代码规则引擎：事件触发→条件判断→自动执行动作 | 较多 |
| 8 | **设置** | 个人中心、日志、自定义对象 | 少量 |

> **注**：文档以图为主（共 57 张截图），文字说明为关键要点的提炼。完整的 UI 细节需对照截图确认，以下分析基于文字说明 + 项目代码实际实现状态。

---

## 二、当前项目实现状态总览

### 2.1 功能模块实现矩阵

| 功能模块 | 功能点 | 规格说明 | 当前状态 | 差距 |
|---------|--------|---------|---------|------|
| **客户管理** | 列表页（排序/筛选/筛选器保存） | 全部支持 | ✅ 已实现 | 无 |
| | 360 全景视图（左侧操作区） | 左中右结构 | ✅ 已实现（DetailLayout） | 无 |
| | 360 全景视图（AI 分析区） | 概览/交互/关系变化 | ⚠️ 组件框架存在，AI 集成缺失 | 部分缺失 |
| | 360 全景视图（右侧其他信息） | 公司/交易/工单 | ✅ 已实现（RelatedListCard） | 无 |
| | 活动信息面板 | 与客户的关联活动 | ✅ 已实现（ActivityList） | 无 |
| | 高级海洋池（HighSeasPool） | 公海池 | ✅ 已实现 | 无 |
| **联系人管理** | 联系人列表 | CRUD + 筛选 | ✅ 已实现 | 无 |
| | 联系人详情 | 左中右结构 | ✅ 已实现 | 无 |
| **商机管理** | 商机列表 | CRUD + 看板 | ✅ 已实现 | 无 |
| | 商机看板 | 拖拽改阶段 | ✅ 已实现 | 无 |
| | 商机详情 | 左中右结构 | ✅ 已实现 | 无 |
| | **竞品管理** | 商机关联竞品 | ❌ 缺失 | 严重 |
| | **决策流程记录** | 商机关联决策记录 | ❌ 缺失 | 严重 |
| **订单管理** | 订单列表/详情 | CRUD | ✅ 已实现 | 无 |
| | **订单商品明细（OrderItem）** | 商品列表编辑 | ✅ 已实现（OrderItemList） | 无 |
| | **订单状态流转** | 待确认→生产中→已发货→已完成 | ✅ 已实现（OrderStatusActions） | 无 |
| | 订单进度可视化 | 进度图/甘特图 | ❌ 缺失 | 严重 |
| | 物流跟踪 | 物流单号/物流公司 | ❌ 缺失 | 中等 |
| **线索管理** | 线索列表/详情 | CRUD | ✅ 已实现 | 无 |
| | **线索查重** | 电话/邮箱/名称模糊匹配 | ✅ 已实现 | 无 |
| | **线索转化** | 转化为客户/联系人/商机 | ✅ 已实现 | 无 |
| | **线索评分** | AI 评分展示 | ❌ 缺失（仅有路由） | 严重 |
| | **线索分配** | 批量分配 | ✅ 已实现（BulkAssignDialog） | 无 |
| **合同管理** | 合同列表/详情 | CRUD + 付款计划 | ✅ 已实现 | 无 |
| | **合同审批流程** | 审批状态可视化 | ✅ 已实现（ContractApprovalDialog） | 无 |
| | **合同附件管理** | 上传/下载附件 | ✅ 已实现（ContractAttachmentList） | 无 |
| | 付款计划甘特图 | 时间可视化 | ❌ 缺失 | 中等 |
| **回款管理** | 回款列表/详情 | CRUD + 付款进度 | ✅ 已实现 | 无 |
| | 回款趋势图 | 图表展示 | ❌ 缺失（仅有 PaymentTrendChart 组件） | 轻微 |
| | 回款预警 Dashlet | 预警通知 | ❌ 缺失 | 中等 |
| **报价管理（CPQ）** | 报价单列表 | 列表页 | ✅ 已实现（QuoteList） | 无 |
| | **报价单详情页** | 报价单完整信息 | ❌ **严重缺失** | **P0** |
| | **新建报价单页** | 报价单表单 | ❌ **严重缺失** | **P0** |
| | **报价计算器（QuoteCalculator）** | 产品选配→价格计算 | ❌ **严重缺失** | **P0** |
| | **产品选择器（ProductSelector）** | CPQ 产品选择 | ❌ **严重缺失** | **P0** |
| | **报价预览（QuotePreview）** | 报价单预览 | ❌ **严重缺失** | **P0** |
| **自定义对象** | 自定义对象列表 | 列表页 | ❌ 缺失（仅路由占位） | **P0** |
| | **自定义对象构建器** | 新建对象定义 | ❌ **严重缺失** | **P0** |
| | **对象字段管理** | 自定义属性 | ❌ 缺失（仅路由占位） | **P0** |
| | **对象关联管理** | 对象间关系 | ❌ 缺失（仅路由占位） | **P0** |
| | **表单设计器** | 表单展示自定义 | ❌ 缺失（仅路由占位） | **P0** |
| | **页面构建器** | 详情页布局自定义 | ❌ 缺失（仅路由占位） | **P0** |
| | **视图管理器** | 多视图保存 | ❌ 缺失（仅路由占位） | **P1** |
| | **阶段管理** | 对象阶段自定义 | ❌ 缺失 | **P1** |
| **自动化工作流** | 工作流列表 | 列表页 | ✅ 已实现（WorkflowList） | 无 |
| | **工作流编辑器** | 可视化拖拽编排 | ❌ **严重缺失** | **P0** |
| | **工作流日志** | 执行记录查看 | ❌ 缺失（仅路由占位） | **P1** |
| | **触发器配置** | 事件触发条件 | ⚠️ 框架存在 | 部分 |
| | **条件构建器** | AND/OR 条件 | ⚠️ 框架存在 | 部分 |
| | **执行动作配置** | 自动执行动作 | ⚠️ 框架存在 | 部分 |
| **AI 功能** | AI 客户摘要 | 概览 AI 分析 | ✅ 已实现（CustomerSummaryAI） | 无 |
| | AI 风险预警 | 风险识别 | ✅ 已实现（RiskAlertAI） | 无 |
| | AI 智能建议 | 建议推荐 | ⚠️ 框架存在 | 部分 |
| | AI 交互分析 | 关系变化 | ⚠️ 框架存在 | 部分 |
| | **AI 控制台/Analytics** | AI 配置/使用分析 | ❌ **严重缺失**（13 个页面仅路由） | **P0** |
| | **AI Assistant** | 助手对话 | ❌ **严重缺失** | **P1** |
| | **AI Dashboard** | AI 仪表盘 | ❌ **严重缺失** | **P1** |
| | **线索评分 AI** | 线索 AI 评分 | ❌ **严重缺失** | **P1** |
| | **销售预测 AI** | 预测分析 | ❌ **严重缺失** | **P1** |
| | **客户分群 AI** | 分群分析 | ❌ **严重缺失** | **P1** |
| | **流失预警 AI** | 流失预警 | ❌ **严重缺失** | **P1** |
| | **会议助手 AI** | 会议记录 | ❌ **严重缺失** | **P1** |
| | **预测性 AI** | 预测模型 | ❌ **严重缺失** | **P1** |
| **Dashlet 仪表盘** | KPI Dashlet | 指标卡片 | ✅ 已实现 | 无 |
| | 图表 Dashlet | 图表展示 | ⚠️ 框架存在 | 部分 |
| | 列表 Dashlet | 列表展示 | ⚠️ 框架存在 | 部分 |
| | 表格 Dashlet | 表格展示 | ⚠️ 框架存在 | 部分 |
| | **合同 Dashlet** | 合同概览 | ❌ 缺失 | P2 |
| | **客户分布 Dashlet** | 分布图 | ❌ 缺失 | P2 |
| | **漏斗 Dashlet** | 销售漏斗 | ❌ 缺失 | P2 |
| | **线索趋势 Dashlet** | 趋势图 | ❌ 缺失 | P2 |
| | **回款预警 Dashlet** | 预警 | ❌ 缺失 | P2 |
| | **销售概览 Dashlet** | 概览 | ❌ 缺失 | P2 |
| | **任务/待办 Dashlet** | 待办事项 | ❌ 缺失 | P2 |
| | **日历 Dashlet** | 日历视图 | ❌ 缺失 | P2 |
| | **新闻 Dashlet** | 资讯 | ❌ 缺失 | P2 |
| **系统设置** | 个人中心 | 个人信息 | ✅ 已实现 | 无 |
| | 安全设置 | 密码/两步验证 | ✅ 已实现 | 无 |
| | 偏好设置 | 显示偏好 | ✅ 已实现 | 无 |
| | 通知设置 | 通知渠道 | ✅ 已实现 | 无 |
| | 角色管理 | 角色 CRUD | ✅ 已实现 | 无 |
| | 用户管理 | 用户 CRUD | ✅ 已实现 | 无 |
| | **权限矩阵（PermissionMatrix）** | 可视化权限配置 | ❌ **严重缺失** | **P0** |
| | **审计日志（AuditLog）** | 操作审计 | ❌ 缺失（仅路由） | **P1** |
| | **登录日志（LoginLog）** | 登录记录 | ❌ 缺失（仅路由） | **P1** |
| | **自定义字段管理** | 字段配置 | ❌ 缺失（仅路由） | **P1** |
| | **布局设置** | 页面布局 | ❌ 缺失（仅路由） | **P2** |
| | **主题设置** | 主题配置 | ❌ 缺失（仅路由） | **P2** |
| | **Webhook 设置** | Webhook 管理 | ❌ 缺失 | **P2** |
| | **API 设置** | API 密钥 | ❌ 缺失 | **P2** |
| | **数据备份设置** | 备份管理 | ❌ 缺失 | **P2** |
| | **高级设置** | 高级配置 | ❌ 缺失 | **P3** |
| **营销模块** | 营销活动列表 | Campaign CRUD | ✅ 已实现 | 无 |
| | 营销活动详情 | 效果分析 | ⚠️ 部分实现 | 部分 |
| | 邮件列表 | Email CRUD | ✅ 已实现 | 无 |
| | 邮件详情 | 发送统计 | ⚠️ 部分实现 | 部分 |
| | 目标列表 | TargetLists | ✅ 已实现 | 无 |
| **报表中心** | 报表列表 | 报表 CRUD | ✅ 已实现 | 无 |
| | 报表仪表盘 | Dashlet 组合 | ⚠️ Dashlet 不完整 | 中等 |
| | 报表构建器 | 自定义报表 | ⚠️ 功能不完整 | 中等 |
| | 活动报表 | 活动分析 | ✅ 已实现 | 无 |
| | 客户报表 | 客户分析 | ✅ 已实现 | 无 |
| | 漏斗报表 | 销售漏斗 | ✅ 已实现 | 无 |
| | 线索转化报表 | 转化分析 | ✅ 已实现 | 无 |
| | 回款报表 | 回款分析 | ✅ 已实现 | 无 |
| | 销售业绩报表 | 业绩分析 | ✅ 已实现 | 无 |
| **外呼中心** | 工单列表 | Ticket CRUD | ✅ 路由/类型存在 | 无 |
| | 工单详情 | 工单处理 | ✅ 路由存在 | 无 |
| | 知识库搜索 | Knowledge 搜索 | ✅ 路由存在 | 无 |
| **导入功能** | 客户导入 | Excel 批量导入 | ✅ 已实现（CustomerImportDialog） | 无 |
| | **字段映射配置** | 映射编辑器 | ✅ 已实现 | 无 |
| | **导入预览** | 预览确认 | ✅ 已实现 | 无 |
| | **导入查重** | 重复检测 | ✅ 已实现 | 无 |

### 2.2 已完成的核心功能（标志性里程碑）

| 功能 | 组件/页面 | 完成质量 |
|------|---------|---------|
| 线索查重 + 转化 | `LeadDuplicateCheckModal.tsx` + `LeadConversionDialog.tsx` + `useLeadDuplicateCheck.ts` | ✅ 完整实现，含 Levenshtein 相似度算法 |
| 订单商品明细管理 | `OrderItemList.tsx` + `useOrderItems.ts` | ✅ 完整实现，含编辑/添加/删除 |
| 订单状态流转 | `OrderStatusActions.tsx` + `ORDER_STATUS_TRANSITIONS` | ✅ 完整实现，配置化流转图 |
| 合同审批流程 | `ContractApprovalDialog.tsx` | ✅ 已实现 |
| 合同附件管理 | `ContractAttachmentList.tsx` | ✅ 已实现 |
| 批量操作（分配/删除/状态） | `BulkAssignDialog` / `BulkDeleteDialog` / `BulkStatusDialog` | ✅ 已实现 |
| 高级筛选器（保存/加载） | `FilterBar` 系列组件 | ✅ 已实现 |
| 虚拟列表（万级数据） | `VirtualDataTable.tsx` | ✅ 已实现（Phase 7） |
| 富文本编辑器（3种模式） | `RichTextEditor.tsx` (TipTap) | ✅ 已实现（Phase 7） |
| E2E 测试框架 | Playwright + 4 个 spec 文件 | ✅ 已配置（Phase 7） |

---

## 三、功能补全清单（按优先级）

### 🔴 P0 — 核心业务闭环缺失（立即处理）

#### P0-1：报价管理模块（CPQ）— 最高优先级

**缺口分析**：
- 文档明确要求 CPQ（Configure-Price-Quote）作为 CRM 的核心竞争力之一
- 当前仅 `QuoteList` 可用，`QuoteDetail` / `QuoteNew` / `QuoteBuilder` 全部缺失
- CPQ 组件组（ProductSelector、QuoteCalculator、QuotePreview）完全空白

**补全清单**：

| 功能点 | 组件/页面 | 来源参考 | 工作量 |
|--------|---------|---------|-------|
| 报价单详情页 | `pages/QuoteDetail.tsx` | 需从原项目迁移或新开发 | 高 |
| 新建报价单页 | `pages/QuoteNew.tsx` + `pages/quotes/QuoteBuilder.tsx` | 需从原项目迁移或新开发 | 高 |
| 产品选择器 | `components/CPQ/ProductSelector.tsx` | 需从原项目迁移 | 中 |
| 报价计算器 | `components/CPQ/QuoteCalculator.tsx` | 需从原项目迁移 | 高 |
| 报价预览组件 | `components/CPQ/QuotePreview.tsx` | 需从原项目迁移 | 中 |
| 报价单类型定义 | `types/cpq.ts` | 需新建 | 中 |
| CPQ Mock 数据 | `mock/cpqData.ts` | 需新建 | 低 |

**实现建议**：
- **Phase 1**：先迁移/实现 ProductSelector（产品搜索+选择），因为它是 CPQ 链路的最上游
- **Phase 2**：QuoteCalculator 核心逻辑（价格=数量×单价×折扣+税费）
- **Phase 3**：QuotePreview（PDF 导出或打印预览）
- **重要**：需确认原项目 `crm2026-4-3new` 中这些组件的具体实现，优先迁移而非重写

---

#### P0-2：自定义对象系统 — 产品差异化核心

**缺口分析**：
- 文档强调这是 CRM 可扩展性的关键一步，"对后端工作量天差地别"
- 当前 4 个路由全部为 redirect 占位，完全不可用
- 自定义对象是 CRM 与通用管理系统拉开差距的核心能力

**补全清单**：

| 功能点 | 组件/页面 | 来源参考 | 工作量 |
|--------|---------|---------|-------|
| 自定义对象列表页 | `pages/custom-objects/CustomObjectList.tsx` | 需新建/迁移 | 中 |
| 自定义对象构建器 | `pages/custom-objects/CustomObjectBuilder.tsx` | 需从原项目迁移 | 高 |
| 对象字段管理 | `pages/custom-objects/CustomObjectSettings.tsx` | 需从原项目迁移 | 中 |
| 对象数据管理 | `pages/custom-objects/CustomObjectDetail.tsx` | 需从原项目迁移 | 中 |
| 表单设计器 | `pages/settings/FormDesigner.tsx` | 需从原项目迁移 | 高 |
| 页面构建器 | `pages/settings/PageBuilder.tsx` | 需从原项目迁移 | 高 |
| 视图管理器 | `pages/settings/ViewManager.tsx` | 需从原项目迁移 | 中 |
| 自定义对象类型 | `types/customObject.ts` | 需新建 | 中 |
| 自定义对象类型 | `types/customField.ts` | 需新建 | 中 |
| 自定义对象 API Hook | `hooks/api/useCustomObjects.ts`（已有，需完善） | 需扩展 | 低 |
| 自定义对象 Mock | `mock/customObjectsData.ts` | 需新建 | 低 |

**实现建议**：
- 自定义对象系统复杂，建议从 **对象定义（字段）→ 表单设计 → 页面布局** 链路逐步实现
- 表单设计器可复用富文本编辑器 Phase 7 的成果（TipTap）
- 页面构建器是最高工作量点，建议放在最后

---

#### P0-3：自动化工作流编辑器 — CRM 核心竞争力

**缺口分析**：
- 文档明确："对 CRM 产品而言，工作流是核心竞争力，是拉开和低端 CRM、Excel 差距的核心抓手"
- 当前仅有列表页，编辑器完全缺失
- 核心逻辑：事件触发→条件判断→自动执行动作

**补全清单**：

| 功能点 | 组件/页面 | 来源参考 | 工作量 |
|--------|---------|---------|-------|
| 工作流可视化编辑器 | `components/WorkflowEditor/WorkflowVisualizer.tsx` | 需从原项目迁移（FlowCanvas） | 高 |
| 节点面板 | `components/WorkflowEditor/NodePanel.tsx` | 需从原项目迁移 | 中 |
| 属性面板 | `components/WorkflowEditor/PropertyPanel.tsx` | 需从原项目迁移 | 中 |
| 连接线组件 | `components/WorkflowEditor/ConnectionLine.tsx` | 需从原项目迁移 | 中 |
| 工作流类型定义 | `types/workflow.ts` + `types/workflow-engine.ts` | 需从原项目迁移 | 中 |
| 工作流执行时间线 | `components/Workflow/ExecutionTimeline.tsx` | 需从原项目迁移 | 中 |
| 工作流日志页 | `pages/workflows/WorkflowExecutions.tsx` | 需从原项目迁移 | 中 |
| 工作流 Mock 数据 | `mock/workflowData.ts` | 需新建 | 低 |

**实现建议**：
- 工作流编辑器的 FlowCanvas 组件（拖拽+连线）是核心难点，建议从原项目直接迁移
- 当前 `hooks/api/useWorkflows.ts` 已存在，可基于此扩展
- 基础工作流（触发器+条件+单个动作）优先于复杂多分支工作流

---

#### P0-4：权限矩阵（PermissionMatrix）— 企业级必备

**缺口分析**：
- 文档中"对象管理补充"要求对全部对象支持自定义权限
- 角色管理当前仅有 CRUD，缺少可视化权限配置矩阵
- 企业级 CRM 必备功能，影响客户验收

**补全清单**：

| 功能点 | 组件/页面 | 来源参考 | 工作量 |
|--------|---------|---------|-------|
| 权限矩阵组件 | `components/PermissionMatrix.tsx` | 需从原项目迁移 | 中 |
| 权限树组件 | `components/PermissionTree/` | 需从原项目迁移/扩展 | 低 |
| 权限类型定义 | `types/permission.ts` | 需从原项目迁移/新建 | 中 |
| 权限 API Hook | `hooks/api/usePermissions.ts`（已有，需完善） | 需扩展 | 低 |
| 权限 Mock 数据 | `mock/permissionData.ts` | 需新建 | 低 |

---

### 🟠 P1 — 重要功能缺失（近期处理）

#### P1-1：AI 功能系列页面

**缺口分析**：13 个 AI 页面仅有路由注册，无页面文件，AI 模块完全不可用

**补全清单**：

| 功能点 | 页面 | 优先级 | 工作量 |
|--------|-----|--------|-------|
| AI 控制台/配置 | `pages/ai/AIConfig.tsx` | P0 | 中 |
| AI 使用统计 | `pages/ai/AIUsage.tsx` | P1 | 中 |
| AI 提示词模板 | `pages/ai/AIPromptTemplates.tsx` | P1 | 中 |
| AI 模型管理 | `pages/ai/AIModels.tsx` | P1 | 中 |
| AI 助手对话 | `pages/ai/AIAssistant.tsx` | P1 | 高 |
| AI 仪表盘 | `pages/ai/AIDashboard.tsx` | P1 | 中 |
| AI 分析报告 | `pages/ai/AIAnalytics.tsx` | P1 | 中 |
| AI 历史记录 | `pages/ai/AIHistory.tsx` | P2 | 低 |
| 线索评分 | `pages/ai/LeadScoring.tsx` | P1 | 中 |
| 销售预测 | `pages/ai/SalesForecast.tsx` | P1 | 中 |
| 客户分群 | `pages/ai/CustomerSegmentation.tsx` | P1 | 中 |
| 流失预警 | `pages/ai/ChurnWarning.tsx` | P1 | 中 |
| 会议助手 | `pages/ai/MeetingAssistant.tsx` | P2 | 高 |
| 预测性 AI | `pages/ai/PredictiveAI.tsx` | P2 | 高 |
| AI Agent 管理 | `pages/ai/AIAgents.tsx` + `AgentDetail.tsx` | P2 | 高 |

**实现建议**：
- AIConfig 和 AIUsage 优先（配置和使用分析，后端依赖低）
- AI 页面可共用 `AISmartSuggestions`、`AIInteractionAnalysis` 等已实现的组件框架

---

#### P1-2：订单详情增强

| 功能点 | 组件/页面 | 工作量 |
|--------|---------|-------|
| 订单进度可视化 | `OrderProgressChart.tsx`（需新建） | 中 |
| 物流跟踪面板 | `LogisticsTracker.tsx`（需新建） | 中 |

---

#### P1-3：系统设置补全

| 功能点 | 页面 | 工作量 |
|--------|-----|-------|
| 审计日志 | `pages/settings/AuditLogSettings.tsx` | 中 |
| 登录日志 | `pages/settings/LoginLogSettings.tsx` | 中 |
| 自定义字段管理 | `pages/settings/FieldSettings.tsx` | 中 |

---

### 🟡 P2 — 体验完善（中期处理）

| 功能点 | 组件/页面 | 工作量 |
|--------|---------|-------|
| Dashlet 补全（8 个缺失） | `components/Dashlets/` | 中 |
| 商机竞品管理 | `pages/opportunities/CompetitorManagement.tsx` | 中 |
| 商机决策流程记录 | `components/DecisionProcessRecord.tsx`（已存在，需集成） | 低 |
| 工作流日志页 | `pages/workflows/WorkflowLogs.tsx` | 低 |
| VirtualDataTable 集成到列表页 | 各 ListPage | 中 |
| 暗黑模式适配（CSS 变量系统） | 全局 | 高 |

---

### 🟢 P3 — 优化项（远期规划）

| 功能点 | 工作量 |
|--------|-------|
| 键盘快捷键系统（Cmd+K 全局搜索、J/K 列表导航） | 中 |
| 全量 ARIA 无障碍标签补充 | 高 |
| 响应式移动端适配 | 高 |
| 单元测试覆盖率提升至 80% | 高 |
| Storybook 组件文档 | 中 |

---

## 四、TypeScript 类型缺口（技术债务）

基于 GAP_ANALYSIS_REPORT，以下类型文件缺失或需要补充：

| 类型文件 | 优先级 | 说明 |
|---------|--------|------|
| `types/ai.ts` | P0 | AI 通用类型 |
| `types/ai-agents.ts` | P1 | AI Agent 类型 |
| `types/cpq.ts` | P0 | CPQ 报价类型 |
| `types/customObject.ts` | P0 | 自定义对象类型 |
| `types/customField.ts` | P0 | 自定义字段类型 |
| `types/workflow.ts` | P0 | 工作流类型 |
| `types/permission.ts` | P0 | 权限类型 |
| `types/dashboard.ts` | P1 | 仪表盘类型 |
| `types/marketing.ts` | P1 | 营销类型 |
| `types/callcenter.ts` | P2 | 呼叫中心类型 |
| `types/ticket.ts` | P2 | 工单类型 |
| `types/knowledge.ts` | P2 | 知识库类型 |
| `types/settings.ts` | P2 | 设置类型 |
| `types/pricebook.ts` | P1 | 价格表类型 |

---

## 五、设计系统合规性问题（来自 gap-analysis.md）

| 问题类别 | 合规率 | 关键问题 |
|---------|--------|---------|
| 基础组件 | 78% | 暗黑模式 CSS 变量缺失、无障碍 aria-* 属性 |
| 业务组件 | 65% | FilterBar API 不统一、VirtualDataTable 未完成集成 |
| 页面模板 | 52% | 大量页面未用标准布局容器、面包屑缺失 |
| 交互模式 | 45% | 全局键盘快捷键完全缺失、J/K 导航缺失 |
| 无障碍设计 | 38% | ARIA 标签覆盖率低、焦点管理不完善 |
| 性能优化 | 30% | 虚拟滚动未集成到列表页、组件懒加载不足 |
| 暗黑模式 | 15% | CSS 变量系统未建立 |

**建议**：建立代码准入标准，新增代码必须符合设计系统规范，逐步修复现有不合规代码。

---

## 六、优先级排序总结

### 第一梯队（核心闭环，立即处理）

```
1. [P0] CPQ 报价管理模块
   理由：文档强调为核心差异化功能，当前完全不可用
   预计工时：120h（3 人天）
   
2. [P0] 自定义对象系统
   理由：文档强调为可扩展性关键，产品护城河
   预计工时：200h（5 人天）
   
3. [P0] 自动化工作流编辑器
   理由：文档强调为核心竞争力，CRM vs Excel 的分水岭
   预计工时：160h（4 人天）
   
4. [P0] 权限矩阵
   理由：企业级必备，影响客户验收
   预计工时：48h（1.2 人天）
```

### 第二梯队（重要功能，近期处理）

```
5. [P1] AI 功能系列页面（13 个）
   预计工时：160h（4 人天）

6. [P1] 系统设置补全（审计日志/登录日志/字段管理）
   预计工时：72h（1.8 人天）

7. [P1] VirtualDataTable 集成到主列表页
   预计工时：48h（1.2 人天）
```

### 第三梯队（体验完善，中期处理）

```
8. [P2] Dashlet 补全（8 个缺失 Dashlet）
   预计工时：80h（2 人天）

9. [P2] 商机增强（竞品管理/决策流程）
   预计工时：48h（1.2 人天）

10. [P2] 暗黑模式 CSS 变量系统建立
    预计工时：80h（2 人天）
```

---

## 七、实施路线图建议

### 当前状态（2026-04-11）
- UI 组件库升级完成（shadcn/ui + Tailwind）
- 核心 CRUD 功能基本完善
- 多个 P0 功能严重缺失（CPQ、自定义对象、工作流编辑器、权限矩阵）

### 建议路线图

```
Phase 1（1-2 周）：CPQ 报价 + 权限矩阵
  → 让客户能完成"产品选配→报价→合同"的完整销售链路

Phase 2（2-3 周）：自定义对象系统（基础版）
  → 让客户能自定义字段和表单，实现基础对象扩展

Phase 3（3-4 周）：工作流编辑器 + AI 页面
  → 让客户实现自动化，提高运营效率

Phase 4（5-6 周）：体验完善
  → 暗黑模式、Dashlet、VirtualDataTable 集成

Phase 5（持续）：P3 优化项
  → 无障碍、键盘快捷键、测试覆盖
```

---

*报告生成时间：2026-04-11 10:45 GMT+8*
*分析师：AI Assistant（产品经理视角）*
