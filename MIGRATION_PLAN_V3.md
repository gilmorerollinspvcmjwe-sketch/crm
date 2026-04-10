# CRM UI 升级项目 - 新迁移计划 V3（完整版）

> 基于实际项目状态 + README_new.md 架构要求制定
> 项目路径：C:\Users\13609\Projects\crm-ui-upgrade
> 制定时间：2026-04-07
> 版本：3.1（补充 UI 优化 + 全量功能 + README 差距）

---

## 📋 项目现状（2026-04-07 更新）

### ✅ 已完成（Phase 1-3）

| 模块 | 完成度 | 说明 |
|------|--------|------|
| **菜单系统** | 100% | 42个子菜单全部可访问，无重定向 |
| **核心组件** | 100% | FilterBar、DetailLayout 完成 |
| **页面基础结构** | 100% | 23个页面（AI、报表、自动化、营销、集成、报价） |
| **列表页升级** | 100% | 5个列表页（Customer/Lead/Opportunity/Contact/Order）FilterBar 集成 |
| **详情页升级** | 100% | 4个详情页（Customer/Lead/Opportunity/Contact）DetailLayout 集成 |
| **系统管理** | 100% | 角色、用户、权限管理完整 |

### ❌ 缺失（需要完善）

| 模块 | 缺失内容 | 优先级 | 说明 |
|------|---------|--------|------|
| **业务功能** | 增删改查完整功能 | 🔴 P0 | 现有页面只有基础结构，缺少完整 CRUD |
| **UI 优化** | 视觉美化 + 交互优化 | 🔴 P0 | 当前 UI 不如原项目好看 |
| **Zustand** | 全局状态管理 | 🔴 P1 | README 要求，替代 Context |
| **内联编辑** | Inline Editing | 🔴 P1 | README 要求，详情页字段快速编辑 |
| **AI 模块** | 8个业务功能页面 | 🟡 P2 | 已有基础结构，需完善功能 |
| **报表模块** | 6个专用业务报表 | 🟡 P2 | 已有基础结构，需完善图表 |
| **高级筛选** | AND/OR 逻辑 | 🟡 P2 | README 要求，FilterBar 增强 |
| **报价模块** | QuoteDetail + Builder | 🟡 P2 | 已有 QuoteList，需详情和构建器 |
| **虚拟列表** | 大数据量优化 | 🟢 P3 | README 要求，万级数据 |
| **看板拖拽** | 商机 Kanban | 🟢 P3 | README 要求，拖拽更改阶段 |

---

## 🎨 UI 优化需求（重要补充）

### 当前问题
- 现有 UI 不如原项目（crm2026-4-3new）好看
- 缺少视觉层次和精致感
- 交互细节不够流畅

### 优化方向

#### 1. 视觉设计优化
- **色彩系统**：统一品牌色，增强对比度
- **字体排版**：优化层级，增加可读性
- **间距留白**：遵循 8px 网格系统
- **圆角阴影**：统一圆角规范，增加卡片阴影

#### 2. 交互细节优化
- **过渡动画**：页面切换、元素出现/消失动画
- **悬停效果**：按钮、卡片、列表项悬停反馈
- **加载状态**：骨架屏、加载动画
- **空状态**：美观的空状态插图和引导

#### 3. 组件美化
- **DataTable**：美化表格样式，增加行悬停效果
- **FilterBar**：优化筛选栏视觉，更紧凑美观
- **DetailLayout**：优化三列布局比例和样式
- **表单组件**：统一表单样式，增加焦点状态

#### 4. 页面级优化
- **列表页**：优化 KPI 卡片、工具栏、表格整体视觉
- **详情页**：优化信息卡片、Tabs、相关列表视觉
- **仪表盘**：美化图表、指标卡片布局

---

## 🎯 新迁移阶段规划（重新排优先级）

### Phase 4: 业务功能完善 + UI 优化（第1-2周）🔴 P0

#### 任务 4.1: 客户管理全量功能
**Agent:** customer-full-feature
**模型:** GLM-5
**预计时间:** 12-16小时
**依赖:** 无

**任务内容:**
1. **CustomerList.tsx 完善**
   - 实现完整的 CRUD（增删改查）
   - 批量操作（批量删除、批量分配）
   - 数据导出（Excel/CSV）
   - 高级筛选（多条件组合）

2. **CustomerDetail.tsx 完善**
   - 内联编辑功能（字段悬浮编辑）
   - 完整的客户信息展示
   - 关联数据加载（联系人、商机、活动）
   - 操作按钮功能（编辑、删除、转移）

3. **CustomerForm.tsx 完善**
   - 完整的表单字段
   - 表单验证
   - 自动保存草稿

4. **API Hooks 完善**
   - useCustomers（列表、筛选、分页）
   - useCreateCustomer
   - useUpdateCustomer
   - useDeleteCustomer
   - useBulkDeleteCustomers
   - useExportCustomers

**检查点:**
- [ ] 客户列表完整 CRUD
- [ ] 客户详情内联编辑
- [ ] 批量操作正常
- [ ] 数据导出正常

---

#### 任务 4.2: 商机管理全量功能
**Agent:** opportunity-full-feature
**模型:** GLM-5
**预计时间:** 12-16小时
**依赖:** 任务 4.1

**任务内容:**
1. **OpportunityList.tsx 完善**
   - 完整 CRUD
   - 阶段推进功能
   - 金额统计
   - 漏斗视图切换

2. **OpportunityDetail.tsx 完善**
   - 内联编辑
   - 阶段历史记录
   - 赢单/输单处理
   - 关联客户、联系人

3. **OpportunityForm.tsx 完善**
   - 完整表单
   - 阶段选择
   - 金额计算

4. **看板视图（Kanban）**
   - 拖拽更改阶段
   - 卡片展示关键信息
   - 阶段统计

**检查点:**
- [ ] 商机列表完整功能
- [ ] 阶段推进正常
- [ ] 看板拖拽正常
- [ ] 内联编辑正常

---

#### 任务 4.3: 线索 + 联系人全量功能
**Agent:** lead-contact-full-feature
**模型:** GLM-5
**预计时间:** 10-12小时
**依赖:** 任务 4.1

**任务内容:**
1. **LeadList.tsx + LeadDetail.tsx 完善**
   - 完整 CRUD
   - 线索转客户功能
   - 线索评分展示

2. **ContactList.tsx + ContactDetail.tsx 完善**
   - 完整 CRUD
   - 关联客户管理
   - 联系人角色设置

**检查点:**
- [ ] 线索完整功能
- [ ] 联系人完整功能
- [ ] 线索转客户正常

---

#### 任务 4.4: UI 视觉优化（全局）
**Agent:** ui-visual-optimization
**模型:** GLM-5
**预计时间:** 16-20小时
**依赖:** 任务 4.1-4.3

**任务内容:**
1. **色彩系统优化**
   - 更新 Tailwind 配置
   - 统一品牌色（主色、辅助色、功能色）
   - 优化深色/浅色模式

2. **组件美化**
   - DataTable 样式优化（行悬停、选中状态）
   - FilterBar 视觉优化（更紧凑、美观）
   - DetailLayout 比例和样式优化
   - Button、Input、Card 等基础组件美化

3. **动画和过渡**
   - 页面切换动画
   - 元素出现/消失动画
   - 悬停反馈动画
   - 加载动画（骨架屏、Spinner）

4. **空状态和错误状态**
   - 美观的空状态插图
   - 错误状态页面
   - 无数据提示优化

5. **响应式优化**
   - 移动端适配完善
   - 平板端布局优化

**检查点:**
- [ ] 色彩系统统一
- [ ] 组件视觉美化
- [ ] 动画流畅自然
- [ ] 响应式完善

---

### Phase 5: 架构升级（第2-3周）🔴 P1

#### 任务 5.1: Zustand 全局状态迁移
**Agent:** zustand-migration
**模型:** GLM-5
**预计时间:** 10-12小时
**依赖:** Phase 4

**任务内容:**
1. 安装 Zustand
2. 创建 Store
   - authStore（用户认证）
   - uiStore（UI 状态：侧边栏、主题）
   - appStore（应用状态）
3. 迁移 Context 到 Zustand
4. 更新所有使用 Context 的组件

**检查点:**
- [ ] Zustand 安装配置
- [ ] Store 创建完成
- [ ] Context 迁移完成
- [ ] 无回归错误

---

#### 任务 5.2: 内联编辑功能
**Agent:** inline-editing
**模型:** GLM-5
**预计时间:** 8-10小时
**依赖:** 任务 5.1

**任务内容:**
1. 创建 InlineEdit 组件
   - 悬浮显示编辑图标
   - 点击切换输入框
   - 回车/失焦保存
   - 取消编辑

2. 在详情页集成
   - CustomerDetail 字段内联编辑
   - OpportunityDetail 字段内联编辑
   - LeadDetail 字段内联编辑

**检查点:**
- [ ] InlineEdit 组件完成
- [ ] 详情页内联编辑正常

---

#### 任务 5.3: 高级筛选器（AND/OR）
**Agent:** advanced-filter
**模型:** GLM-5
**预计时间:** 8-10小时
**依赖:** Phase 4

**任务内容:**
1. 升级 FilterBar
   - 支持 AND/OR 逻辑组合
   - 支持嵌套条件组
   - 可视化条件构建器

2. 在列表页集成
   - CustomerList 高级筛选
   - OpportunityList 高级筛选

**检查点:**
- [ ] AND/OR 逻辑支持
- [ ] 可视化条件构建器
- [ ] 筛选功能正常

---

### Phase 6: AI + 报表 + 其他模块（第3-4周）🟡 P2

#### 任务 6.1: AI 模块功能完善
**Agent:** ai-module-feature
**模型:** GLM-5
**预计时间:** 16-20小时
**依赖:** Phase 5

**任务内容:**
完善 9 个 AI 页面的功能：
1. LeadAssignment - 智能分配规则配置
2. LeadScoring - 评分模型配置
3. SalesForecast - 预测模型 + 图表
4. CustomerSegmentation - 分群模型 + 可视化
5. ChurnWarning - 流失预警 + 高风险列表
6. MeetingAssistant - 会议分析 + 纪要生成
7. PredictiveAI - 预测分析 + 多图表
8. AIAgents - 智能体管理
9. AgentDetail - 智能体配置 + 测试

**检查点:**
- [ ] 9个AI页面功能完整
- [ ] 配置面板正常
- [ ] 图表展示正常

---

#### 任务 6.2: 报表模块功能完善
**Agent:** reports-module-feature
**模型:** GLM-5
**预计时间:** 12-16小时
**依赖:** Phase 5

**任务内容:**
完善 6 个报表页面：
1. SalesFunnelReport - 销售漏斗分析
2. PerformanceReport - 业绩统计
3. CustomerReport - 客户分析
4. ActivityReport - 活动报表
5. LeadConversionReport - 线索转化
6. PaymentReport - 回款分析

每个报表包含：
- 筛选条件（时间范围、部门等）
- 图表展示（Recharts）
- 数据表格
- 导出功能

**检查点:**
- [ ] 6个报表完整
- [ ] 图表正常显示
- [ ] 数据导出正常

---

#### 任务 6.3: 报价模块 + 日志 + 自定义对象
**Agent:** other-modules-feature
**模型:** GLM-5
**预计时间:** 12-16小时
**依赖:** Phase 5

**任务内容:**
1. 报价模块
   - QuoteDetail.tsx
   - QuoteBuilder.tsx（CPQ）

2. 日志管理
   - AuditLog.tsx（操作日志列表）
   - LoginLog.tsx（登录日志列表）

3. 自定义对象
   - CustomObjects.tsx（完整功能）
   - ObjectConfig.tsx（配置中心）

**检查点:**
- [ ] 报价模块完整
- [ ] 日志管理完整
- [ ] 自定义对象完整

---

### Phase 7: 高级功能（第4-5周）🟢 P3

#### 任务 7.1: 虚拟列表 + 看板拖拽
**Agent:** advanced-features
**模型:** GLM-5
**预计时间:** 10-12小时
**依赖:** Phase 6

**任务内容:**
1. 虚拟列表（@tanstack/react-virtual）
   - 大数据量列表优化
   - CustomerList、LeadList 支持万级数据

2. 看板拖拽（@hello-pangea/dnd）
   - 商机看板拖拽更改阶段
   - 任务看板

**检查点:**
- [ ] 虚拟列表正常
- [ ] 看板拖拽正常

---

#### 任务 7.2: 富文本编辑器 + E2E 测试
**Agent:** editor-and-testing
**模型:** GLM-5
**预计时间:** 8-10小时
**依赖:** Phase 6

**任务内容:**
1. 富文本编辑器（TipTap）
   - 邮件编辑
   - 备注编辑
   - 工单回复

2. E2E 测试（Playwright）
   - 核心业务流程测试
   - 关键页面测试

**检查点:**
- [ ] 富文本编辑器正常
- [ ] E2E 测试覆盖核心流程

---

### Phase 8: 最终测试和优化（第5周）

#### 任务 8.1: 全面测试
**Agent:** final-testing
**模型:** GLM-5
**预计时间:** 8-10小时
**依赖:** 所有前置任务

**任务内容:**
1. TypeScript 编译检查
2. 构建测试
3. 功能测试
4. 性能测试
5. 无障碍测试

**检查点:**
- [ ] 无类型错误
- [ ] 构建成功
- [ ] 功能完整
- [ ] 性能达标

---

## 📊 新时间估算

| 阶段 | 任务数 | 预计时间 | 累计时间 |
|------|--------|----------|----------|
| Phase 4 | 4 | 50-64小时 | 50-64小时 |
| Phase 5 | 3 | 26-32小时 | 76-96小时 |
| Phase 6 | 3 | 40-52小时 | 116-148小时 |
| Phase 7 | 2 | 18-22小时 | 134-170小时 |
| Phase 8 | 1 | 8-10小时 | 142-180小时 |

**总计：约 142-180 小时（约 7-9 周）**

---

## 📋 Agent 并行计划（更新）

### 第 4 批（立即启动）
```
任务 4.1: customer-full-feature（客户全量功能）
任务 4.2: opportunity-full-feature（商机全量功能）
```

### 第 5 批（第4批完成后）
```
任务 4.3: lead-contact-full-feature（线索+联系人）
任务 4.4: ui-visual-optimization（UI视觉优化）
```

### 第 6 批（第5批完成后）
```
任务 5.1: zustand-migration（Zustand迁移）
任务 5.2: inline-editing（内联编辑）
```

### 第 7 批（第6批完成后）
```
任务 5.3: advanced-filter