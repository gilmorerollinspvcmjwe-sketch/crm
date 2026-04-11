# CRM UI 升级项目 — 并行实施计划书

**版本**：v1.0  
**制定日期**：2026-04-11  
**制定人**：AI Assistant（产品经理视角）  
**项目基础**：基于 `CRM_UI_升级项目_功能补全分析报告.md` + 代码现状审计

---

## 一、现状重新评估：真缺口 vs 假缺口

> **重要发现**：经过代码审计，发现分析报告中的部分"缺失"项实际上**已有实现但未集成/未完成**。以下按真实缺口分类：

### 🔴 真实 P0 缺口（必须新建）

| 缺口 | 当前状态 | 原因 |
|------|---------|------|
| `PermissionMatrix.tsx` | 完全缺失 | 无此组件文件 |
| `WorkflowBuilder.tsx` 页面 | 有路由，但页面文件无实质内容 | `pages/workflows/WorkflowBuilder.tsx` 为空占位 |
| `QuoteForm.tsx` 新建报价单 | 有路由，文件存在 | 内容不完整，需集成 CPQ 组件 |
| `QuoteDetail.tsx` 报价单详情 | 有路由，文件存在 | 内容不完整，需集成 CPQ 组件 |

### 🟡 已有组件但需集成的 P0 项

| 组件 | 当前状态 | 需完成工作 |
|------|---------|-----------|
| `ProductSelector.tsx` | ✅ 381行完整实现 | 集成到 QuoteForm |
| `QuoteCalculator.tsx` | ✅ 414行完整实现 | 集成到 QuoteForm |
| `QuotePreview.tsx` | ✅ 321行完整实现 | 集成到 QuoteDetail |
| `NodePanel.tsx` | ✅ 223行完整实现 | 集成到 WorkflowBuilder |
| `PropertyPanel.tsx` | ✅ 542行完整实现 | 集成到 WorkflowBuilder |
| `CustomObjectBuilder.tsx` | ✅ 906行完整实现 | 已有路由，需验证 |
| `CustomObjectList.tsx` | ✅ 579行完整实现 | 已有路由，需验证 |
| 所有 AI 页面（13个） | ✅ 完整实现（233-987行） | 需验证路由+功能 |

### 🟢 已完成的基础设施

| 类型文件 | 状态 |
|---------|------|
| `types/cpq.ts` | ✅ 已存在 |
| `types/customObject.ts` | ✅ 已存在 |
| `types/workflow.ts` | ✅ 已存在 |
| `types/permission.ts` | ✅ 已存在 |
| `hooks/api/useWorkflows.ts` | ✅ 已有 |
| `hooks/api/useCustomObjects.ts` | ✅ 已有 |

---

## 二、并行任务分解图

```
Week 1（基础设施准备，不阻塞任何功能开发）
├── [coder] 类型系统审计与补全
│   └── 审计所有 types/*.ts，确保 P0 模块类型完整无缺口
├── [frontend] Mock 数据层建设
│   ├── mock/cpqData.ts（QuoteCalculator 数据）
│   ├── mock/workflowBuilderData.ts（工作流编辑器数据）
│   └── mock/permissionData.ts（权限矩阵数据）
└── [qa] 测试策略制定 + Playwright 基础用例
    ├── 制定 P0 功能测试矩阵
    └── 搭建自动化测试框架（CI/CD 集成）

Week 2（三大核心功能并行开发）
├── [frontend-cpq] CPQ 报价管理
│   ├── QuoteForm.tsx 集成 ProductSelector + QuoteCalculator
│   ├── QuoteDetail.tsx 集成 QuotePreview
│   └── CPQ 路由验证与页面调试
├── [frontend-workflow] 自动化工作流编辑器
│   ├── WorkflowBuilder.tsx 集成 NodePanel + PropertyPanel
│   ├── WorkflowVisualizer（拖拽画布）检查完整性
│   └── 工作流保存/加载逻辑
└── [frontend-permission] 权限矩阵
    ├── PermissionMatrix.tsx 组件开发
    ├── PermissionTree 组件开发
    └── 权限设置页面集成

Week 3（集成 + P1 功能补全）
├── [frontend] AI 页面全面 QA
│   ├── 验证 13 个 AI 页面路由
│   ├── 验证各 AI 页面功能完整性
│   └── AIConfig / AIUsage 优先验收
├── [frontend] 自定义对象系统验证
│   ├── CustomObjectList 路由验证
│   ├── CustomObjectBuilder 表单+逻辑验证
│   └── 自定义字段渲染（FieldRenderer）验证
└── [frontend] P1 功能补全
    ├── OrderProgressChart 订单进度可视化
    ├── LogisticsTracker 物流跟踪
    └── AuditLogSettings / LoginLogSettings 验证

Week 4（体验完善 + 收尾）
├── [frontend] 暗黑模式 CSS 变量系统
│   └── 建立 dark-mode CSS 变量规范（从 15% → 50%）
├── [qa] 全量 E2E 测试执行
│   └── Playwright P0 功能全覆盖
└── [coder] 设计系统合规性修复
    ├── 无障碍 ARIA 属性补全
    └── 键盘导航（J/K）补全
```

---

## 三、各 Agent 工作分配详情

### Agent 1：`frontend-cpq` — CPQ 报价管理

**职责**：完成报价模块的端到端集成

**工作范围**：
```
目标文件：
- src/pages/QuoteForm.tsx（重写/完善）
- src/pages/QuoteDetail.tsx（重写/完善）
- src/pages/QuoteList.tsx（如需调整）
- src/components/CPQ/ProductSelector.tsx（验证完整）
- src/components/CPQ/QuoteCalculator.tsx（验证完整）
- src/components/CPQ/QuotePreview.tsx（验证完整）
- src/mock/cpqData.ts（新建）
- src/types/cpq.ts（审计补全）
```

**拆分任务**：
1. **Task CPQ-1**：审计 `types/cpq.ts`，补全 `QuoteLineItem`、`PricingRule` 类型
2. **Task CPQ-2**：编写 `mock/cpqData.ts`（模拟产品目录、价格表）
3. **Task CPQ-3**：重构 `QuoteForm.tsx`，集成 `ProductSelector`（选产品）+ `QuoteCalculator`（计算价格）
4. **Task CPQ-4**：重构 `QuoteDetail.tsx`，集成 `QuotePreview`（预览报价单）
5. **Task CPQ-5**：端到端测试（选产品 → 计算 → 生成报价单 → 预览 → PDF导出）

**依赖**：`coder` 完成的类型定义  
**输出**：可运行的报价完整链路

---

### Agent 2：`frontend-workflow` — 自动化工作流编辑器

**职责**：完成可视化工作流编辑器的页面集成

**工作范围**：
```
目标文件：
- src/pages/workflows/WorkflowBuilder.tsx（重写）
- src/pages/workflows/WorkflowList.tsx（验证）
- src/pages/workflows/WorkflowDetail.tsx（验证）
- src/components/WorkflowEditor/NodePanel.tsx（验证完整）
- src/components/WorkflowEditor/PropertyPanel.tsx（验证完整）
- src/hooks/api/useWorkflows.ts（扩展）
- src/mock/workflowBuilderData.ts（新建）
```

**拆分任务**：
1. **Task WF-1**：审计 `WorkflowBuilder.tsx` 现状，补充画布拖拽逻辑
2. **Task WF-2**：审计 `NodePanel.tsx` + `PropertyPanel.tsx` 接口，确认与 Builder 集成方式
3. **Task WF-3**：实现 WorkflowBuilder 页面——拖拽节点到画布、节点连线、保存工作流
4. **Task WF-4**：编写 `mock/workflowBuilderData.ts`（模拟触发器、条件、动作节点）
5. **Task WF-5**：工作流列表页 + 新建/编辑路由串联

**依赖**：`coder` 类型审计（workflow types）  
**输出**：可创建、保存、触发的完整工作流编辑器

---

### Agent 3：`frontend-permission` — 权限矩阵

**职责**：从零构建可视化权限配置矩阵

**工作范围**：
```
目标文件：
- src/components/PermissionMatrix.tsx（新建）
- src/components/PermissionTree/（新建整个目录）
- src/pages/settings/PermissionManagement.tsx（重写）
- src/hooks/api/usePermissions.ts（扩展）
- src/mock/permissionData.ts（新建）
```

**拆分任务**：
1. **Task PERM-1**：设计权限矩阵数据结构（角色 × 对象 × 操作）
2. **Task PERM-2**：开发 `PermissionMatrix.tsx` 组件（表格行=角色，列=对象，交点=权限）
3. **Task PERM-3**：开发 `PermissionTree.tsx`（树形结构展示对象层级）
4. **Task PERM-4**：重构 `PermissionManagement.tsx`，集成 PermissionMatrix
5. **Task PERM-5**：编写 `mock/permissionData.ts`

**依赖**：无（独立模块）  
**输出**：`/settings/permissions` 页面完整可用

---

### Agent 4：`coder` — 基础设施与类型审计

**职责**：类型系统完善 + Mock 数据架构 + 全局类型守卫

**工作范围**：
```
审计文件：
- src/types/cpq.ts
- src/types/workflow.ts
- src/types/permission.ts
- src/types/customObject.ts
- src/types/ai.ts
```

**拆分任务**：
1. **Task TYPE-1**：审计并补全 `types/cpq.ts`（`Quote`、`QuoteLineItem`、`PricingTier` 等）
2. **Task TYPE-2**：审计并补全 `types/workflow.ts`（`WorkflowNode`、`WorkflowEdge`、`TriggerConfig` 等）
3. **Task TYPE-3**：审计并补全 `types/permission.ts`（`PermissionMatrixRow`、`RolePermission` 等）
4. **Task TYPE-4**：审计并补全 `types/ai.ts`（`AIConfig`、`AIScore`、`AIPrediction` 等）
5. **Task TYPE-5**：建立 `src/types/index.ts` 统一导出，规范全局接口

**并行性**：可与所有 frontend agent 并行工作（types 不影响组件 UI 开发，反过来依赖 types 的组件在 types 完善前可先用 `any` 占位）

---

### Agent 5：`qa` — 测试策略与执行

**职责**：制定测试矩阵 + 搭建自动化测试框架 + 执行 P0 功能测试

**工作范围**：
```
测试文件：
- tests/e2e/cpq.spec.ts（新建）
- tests/e2e/workflow.spec.ts（新建）
- tests/e2e/permission.spec.ts（新建）
- tests/e2e/custom-objects.spec.ts（新建）
- playwright.config.ts（已有，验证配置）
```

**拆分任务**：
1. **Task QA-1**：制定 P0 功能测试矩阵（见本文档第五节）
2. **Task QA-2**：搭建测试框架（Page Object Pattern）
3. **Task QA-3**：编写 CPQ E2E 测试（选产品→计算→保存→预览）
4. **Task QA-4**：编写工作流编辑器 E2E 测试（拖拽→连线→保存）
5. **Task QA-5**：编写权限矩阵 E2E 测试（勾选权限→保存→验证生效）
6. **Task QA-6**：执行全量测试，输出测试报告

**并行性**：可在各功能模块"基本可用"后开始，不阻塞开发

---

## 四、时间估算与里程碑

### 总体工期：4 周（20 个工作日）

| 里程碑 | 日期 | 内容 | 验收标准 |
|--------|------|------|---------|
| **M0** | 2026-04-11 | 项目启动，任务分配完毕 | 所有 agent 理解各自职责 |
| **M1** | 2026-04-15（Day 3） | 类型系统 + Mock 数据完成 | 所有 P0 类型可 import，无 TS 报错 |
| **M2** | 2026-04-22（Week 2 结束） | CPQ 报价 / Workflow 编辑器 / PermissionMatrix 完成 | 三个模块均可完成 CRUD 操作 |
| **M3** | 2026-04-29（Week 3 结束） | AI 页面验证 + 自定义对象验证 + P1 功能完成 | 13 个 AI 页面可正常访问 |
| **M4** | 2026-05-06（Week 4 结束） | 暗黑模式 + 全量 E2E 测试通过 | Playwright P0 用例 100% 通过率 |
| **M5** | 2026-05-08 | 项目收尾 | 设计系统合规率 60%+, 无严重 Bug |

### 详细周计划

```
Week 1（04/13 - 04/17）
┌─────────────────────────────────────────────────────────┐
│ [coder]       TYPE-1 → TYPE-2 → TYPE-3 → TYPE-4 → TYPE-5  │
│ [frontend-cpq] CPQ-1 → CPQ-2 (并行)                        │
│ [frontend-workflow] WF-1 (并行)                            │
│ [qa]          QA-1 → QA-2                                  │
└─────────────────────────────────────────────────────────┘

Week 2（04/20 - 04/24）
┌─────────────────────────────────────────────────────────┐
│ [frontend-cpq] CPQ-3 → CPQ-4 → CPQ-5                         │
│ [frontend-workflow] WF-2 → WF-3 → WF-4 → WF-5              │
│ [frontend-permission] PERM-1 → PERM-2 → PERM-3 → PERM-4 → PERM-5 │
└─────────────────────────────────────────────────────────┘
Note: Week 2 三个 frontend agent 完全并行（无文件冲突）

Week 3（04/27 - 04/30）
┌─────────────────────────────────────────────────────────┐
│ [frontend] AI 页面全面 QA + 自定义对象验证                 │
│ [frontend] P1 功能：OrderProgressChart, LogisticsTracker   │
│ [qa]        配合功能验证，同步更新测试用例                   │
└─────────────────────────────────────────────────────────┘

Week 4（05/04 - 05/06）
┌─────────────────────────────────────────────────────────┐
│ [frontend] 暗黑模式 CSS 变量系统                           │
│ [qa]        全量 E2E 测试执行                              │
│ [coder]     设计系统合规性修复                            │
│ [all]       Bug 修复 + 收尾                               │
└─────────────────────────────────────────────────────────┘
```

---

## 五、每日站会检查点（Daily Standup）

### 检查点模板（每个工作日 09:30）

每日上午各 agent 汇报以下内容：

```
Agent [名称] — [日期]
✅ 昨日完成：
  - [任务 ID] [任务描述] [状态：完成/阻塞]

🔜 今日计划：
  - [任务 ID] [任务描述]

⚠️ 阻塞问题：
  - [问题描述] → 需要 [资源/决策/帮助]

📊 风险预警：
  - [风险]（提前上报，不要等到无法挽回才说）
```

### 每日站会检查清单

**M1 检查点（Day 3）**：
- [ ] `types/cpq.ts` 所有接口是否已定义？
- [ ] `mock/cpqData.ts` 是否包含至少 10 个产品样本？
- [ ] CPQ agent 是否理解了 ProductSelector 的接口？

**M2 检查点（Week 2 Day 5）**：
- [ ] CPQ：能否完成"新建报价单 → 选产品 → 计算 → 保存 → 预览"全链路？
- [ ] Workflow：能否完成"新建工作流 → 拖拽节点 → 连线 → 保存"全链路？
- [ ] Permission：权限矩阵表格是否渲染？勾选权限是否生效？

**M3 检查点（Week 3 Day 4）**：
- [ ] 13 个 AI 页面是否全部可访问（无 404）？
- [ ] 自定义对象列表是否显示数据？
- [ ] 订单进度图和物流跟踪是否集成？

**M4 检查点（Week 4 Day 3）**：
- [ ] Playwright 测试用例通过率是否 ≥ 95%？
- [ ] 暗黑模式 CSS 变量是否覆盖所有颜色场景？
- [ ] 无障碍 ARIA 标签是否补充？

---

## 六、P0 功能测试矩阵（QA 用例）

### CPQ 报价管理测试用例

| # | 测试用例 | 预期结果 | 优先级 |
|---|---------|---------|--------|
| CPQ-TC01 | 进入 /quotes，点击"新建报价单" | 打开 QuoteForm | P0 |
| CPQ-TC02 | 在 ProductSelector 中搜索产品 | 显示匹配产品列表 | P0 |
| CPQ-TC03 | 选择产品，设置数量和折扣 | QuoteCalculator 实时更新总价 | P0 |
| CPQ-TC04 | 保存报价单 | 数据持久化，路由跳转至详情页 | P0 |
| CPQ-TC05 | 进入报价单详情页 | QuotePreview 正确渲染报价单内容 | P0 |
| CPQ-TC06 | 点击"导出 PDF" | 生成并下载 PDF 文件 | P1 |
| CPQ-TC07 | 报价单列表筛选 | 筛选结果正确 | P1 |

### 自动化工作流编辑器测试用例

| # | 测试用例 | 预期结果 | 优先级 |
|---|---------|---------|--------|
| WF-TC01 | 进入 /workflows/builder | 空白画布加载，NodePanel 可见 | P0 |
| WF-TC02 | 从 NodePanel 拖拽"触发器"到画布 | 节点出现在画布上 | P0 |
| WF-TC03 | 拖拽"条件判断"节点并连接到触发器 | 连接线正确渲染 | P0 |
| WF-TC04 | 点击节点，打开 PropertyPanel | 属性面板显示节点可配置项 | P0 |
| WF-TC05 | 配置节点属性后点击"保存" | 工作流保存成功 | P0 |
| WF-TC06 | 进入 /workflows/:id | 工作流详情正确显示 | P1 |
| WF-TC07 | 触发工作流，查看执行日志 | WorkflowExecutions 显示执行记录 | P1 |

### 权限矩阵测试用例

| # | 测试用例 | 预期结果 | 优先级 |
|---|---------|---------|--------|
| PERM-TC01 | 进入 /settings/permissions | 权限矩阵表格正确渲染 | P0 |
| PERM-TC02 | 表格行=角色，列=对象，交点=权限勾选框 | 结构正确 | P0 |
| PERM-TC03 | 勾选某个交点的权限，保存 | 刷新后勾选保持 | P0 |
| PERM-TC04 | 切换角色筛选 | 表格正确过滤 | P1 |
| PERM-TC05 | 切换对象筛选 | 表格正确过滤 | P1 |

### 自定义对象测试用例

| # | 测试用例 | 预期结果 | 优先级 |
|---|---------|---------|--------|
| CO-TC01 | 进入 /custom-objects | 显示自定义对象列表 | P0 |
| CO-TC02 | 点击"新建对象"，填写名称 | 创建成功，出现在列表 | P0 |
| CO-TC03 | 进入对象 Builder，添加字段 | 字段正确保存 | P0 |
| CO-TC04 | 进入 CustomObjectDetail（某对象数据） | 数据显示正确 | P1 |

### AI 页面测试用例

| # | 测试用例 | 预期结果 | 优先级 |
|---|---------|---------|--------|
| AI-TC01 | 访问 /ai/config | AIConfig 页面正常加载 | P0 |
| AI-TC02 | 访问 /ai/assistant | AIAssistant 对话界面加载 | P0 |
| AI-TC03 | 访问 /ai/lead-scoring | LeadScoring 页面加载，显示线索评分 | P0 |
| AI-TC04 | 访问 /ai/sales-forecast | SalesForecast 预测数据展示 | P0 |

---

## 七、风险评估与应对措施

| 风险 | 可能性 | 影响 | 应对措施 |
|------|--------|------|---------|
| **CPQ 组件与其他模块冲突**（ProductSelector 被多处引用） | 中 | 高 | CPQ agent 提前锁定接口，变更需通报 |
| **WorkflowBuilder 画布性能问题**（节点多时卡顿） | 中 | 中 | 使用 React.memo 优化，虚拟化长列表 |
| **PermissionMatrix 权限粒度过细导致状态爆炸** | 高 | 中 | 设计时按"角色+对象"聚合，不做行级原子权限 |
| **Mock 数据与真实 API 接口不一致** | 高 | 高 | **预防**：Week 1 coder 和 frontend 一起 review API 契约 |
| **Playwright E2E 测试不稳定（flaky）** | 中 | 中 | 规范 Page Object Pattern，避免硬编码选择器 |
| **Week 2 三个 agent 并行导致 merge 冲突** | 低 | 高 | 提前约定代码规范，PR 小而频繁 |
| **暗黑模式 CSS 变量覆盖不全** | 高 | 低 | Week 4 专项任务，无需阻塞功能开发 |
| **组件文件已存在但逻辑为空（假实现）** | 已发现 | 高 | **立即行动**：各 agent 在开始前审计目标文件的实际行数，少于 50 行视为未实现 |

---

## 八、依赖关系图

```
类型层（coder，Week1）
├── types/cpq.ts ──────────────┐
├── types/workflow.ts ──────────┤
├── types/permission.ts ────────┤
└── types/ai.ts ────────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        ▼                        ▼                        ▼
  CPQ 前端 (frontend-cpq)  WorkflowEditor   PermissionMatrix
  Week2                     (frontend-wf)    (frontend-perm)
  CPQ-3,4,5                 WF-3,4,5        PERM-2,3,4,5
        │                        │                │
        └────────────────────────┴────────────────┘
                                 │
                                 ▼
                    QA E2E 测试（Week 3-4）
                    全模块集成验证
```

---

## 九、代码准入标准

在合入（merge/PR）前必须满足：

1. **TypeScript**：无 `any` 类型逃逸（除非显式注释 `// eslint-disable-next-line @typescript-eslint/no-explicit-any` 并注明原因）
2. **组件规范**：
   - 所有业务组件放在 `src/components/[ModuleName]/`
   - 页面组件放在 `src/pages/[ModuleName]/`
   - 组件必须有 `export default` 或命名导出
3. **命名规范**：
   - 页面组件：`PascalCase.tsx`（如 `QuoteDetail.tsx`）
   - 业务组件：`PascalCase.tsx`（如 `PermissionMatrix.tsx`）
   - Hooks：`camelCase.ts`（如 `usePermissions.ts`）
4. **测试覆盖**：P0 功能必须有 Playwright E2E 测试用例
5. **无障碍**：所有表单必须包含 `<label>` 标签，所有图标按钮必须有 `aria-label`
6. **暗黑模式**：所有新增颜色必须使用 CSS 变量（`var(--color-*)`）

---

## 十、总结：成功标准

项目验收以 M4（Week 4 结束）为节点，以下全部满足视为成功：

| 维度 | 指标 | 目标 |
|------|------|------|
| **功能** | CPQ 报价完整链路 | ✅ 可运行 |
| **功能** | 工作流编辑器完整链路 | ✅ 可运行 |
| **功能** | 权限矩阵 | ✅ 可配置 |
| **功能** | AI 页面（13个） | ✅ 可访问 |
| **功能** | 自定义对象 | ✅ 可创建对象+字段 |
| **质量** | E2E 测试通过率 | ≥ 95% |
| **体验** | 暗黑模式 CSS 变量 | ≥ 50% 覆盖 |
| **性能** | 主要页面加载 | ≤ 2s |
| **可维护性** | TypeScript strict | 无新增错误 |

---

*计划制定完成。请各 Agent 根据职责确认任务范围，按 M1（Day 3）里程碑推进。*
