# 下一批次任务命令（Phase 3/4 完成后执行）

> 准备时间：2026-04-03  
> 执行条件：Phase 3 (form-migration) 和 Phase 4 (modal-navigation-migration) 都完成后

---

## 第 5 批次：独立任务（可并行启动）

### 任务 1: Phase 6 - 数据层迁移

```bash
# 启动命令
sessions_spawn:
  task: |
    Phase 6: 数据层迁移 - CRM UI 升级

    目标：完成 TanStack Query + Axios 集成，替代原有数据获取方案

    背景：
    CRM 系统使用自定义数据获取，需要迁移到 TanStack Query + Axios。
    项目路径：C:\Users\13609\Projects\crm-ui-upgrade

    前置依赖（已完成）：
    - ✅ Phase 0: 基础设施完成
    - ✅ Phase 1: 基础 UI 组件完成

    执行任务：

    1. 安装依赖
       - @tanstack/react-query
       - @tanstack/react-query-devtools
       - axios

    2. 创建 Axios 配置
       - src/lib/axios.ts
       - 配置 baseURL、timeout
       - 请求拦截器（添加 token）
       - 响应拦截器（错误处理、401 刷新）

    3. 创建 QueryClient 配置
       - src/lib/query-client.ts
       - 配置 staleTime、retry 策略
       - 配置缓存行为

    4. 创建 API Hooks（按业务模块）
       - src/hooks/api/useCustomers.ts
       - src/hooks/api/useContacts.ts
       - src/hooks/api/useLeads.ts
       - src/hooks/api/useOpportunities.ts
       - src/hooks/api/useProducts.ts
       - src/hooks/api/index.ts

    5. 迁移 Zustand 服务端状态
       - 识别 store 中的服务端状态
       - 迁移到 TanStack Query
       - 保留纯客户端状态在 Zustand

    6. 创建 Query Provider
       - 在应用根组件包裹 QueryClientProvider

    技术要求：
    - TypeScript 严格类型
    - 统一的错误处理
    - 支持乐观更新
    - 支持无限滚动/分页

    输出要求：
    - 完整的 API hooks 集合
    - Axios 配置
    - QueryClient 配置
    - 使用示例代码
    - 迁移指南
  runtime: subagent
  mode: run
  runTimeoutSeconds: 1800
  cwd: C:\Users\13609\Projects\crm-ui-upgrade
  label: data-layer-migration
```

---

### 任务 2: Phase 8 - 图标执行迁移

```bash
# 启动命令
sessions_spawn:
  task: |
    Phase 8: 图标执行迁移 - CRM UI 升级

    目标：执行图标迁移脚本，完成 @ant-design/icons 到 lucide-react 的批量替换

    背景：
    项目使用 @ant-design/icons，需要迁移到 lucide-react。
    Phase 7 已创建迁移脚本 scripts/migrate-icons.cjs。
    项目路径：C:\Users\13609\Projects\crm-ui-upgrade

    前置依赖（已完成）：
    - ✅ Phase 7: 图标迁移脚本已创建
    - ✅ scripts/icon-mapping.cjs 存在
    - ✅ scripts/migrate-icons.cjs 存在

    执行任务：

    1. 安装 lucide-react
       - npm install lucide-react

    2. 执行迁移脚本（预览模式）
       - node scripts/migrate-icons.cjs
       - 检查迁移报告
       - 确认映射准确性

    3. 执行迁移脚本（应用模式）
       - node scripts/migrate-icons.cjs --apply
       - 批量替换所有图标

    4. 处理 TODO 标记
       - 查找所有 // TODO: Icon not mapped 注释
       - 手动处理未映射的图标
       - 补充 icon-mapping.cjs 中的缺失映射

    5. 验证迁移结果
       - 检查关键页面的图标显示
       - 验证 spin 属性转换（animate-spin）
       - 验证 rotate 属性转换（style transform）

    6. 清理
       - 卸载 @ant-design/icons
       - npm uninstall @ant-design/icons

    7. 构建验证
       - npm run build
       - 确保无错误

    输出要求：
    - 迁移报告统计
    - 处理的文件数量
    - TODO 列表（如有）
    - 构建验证结果
  runtime: subagent
  mode: run
  runTimeoutSeconds: 1800
  cwd: C:\Users\13609\Projects\crm-ui-upgrade
  label: icon-execution
```

---

## 第 6 批次：页面组件迁移（分 4 批并行）

### 任务 3: Phase 5-1 - 核心页面迁移（客户/线索/联系人/商机）

```bash
# 启动命令
sessions_spawn:
  task: |
    Phase 5-1: 核心页面迁移 - CRM UI 升级

    目标：完成核心业务页面从 Ant Design 到 shadcn/ui 的迁移

    背景：
    CRM 系统有 70+ 页面，分批处理降低风险。
    本批次处理最核心的业务页面。
    项目路径：C:\Users\13609\Projects\crm-ui-upgrade

    前置依赖（已完成）：
    - ✅ Phase 0/1/2: 基础组件完成
    - ✅ Phase 3: 表单组件完成
    - ✅ Phase 4: 弹窗导航完成

    迁移页面列表：
    - CustomerList.tsx / CustomerDetail.tsx
    - LeadList.tsx / LeadDetail.tsx
    - ContactList.tsx / ContactDetail.tsx
    - OpportunityList.tsx / OpportunityDetail.tsx

    执行任务（每个页面）：

    1. 移除旧依赖
       - 删除 import './PageName.css'
       - 删除 Ant Design 组件 import

    2. 替换组件
       - Ant Design Button → shadcn/ui Button
       - Ant Design Input → shadcn/ui Input
       - Ant Design Select → shadcn/ui Select
       - Ant Design Table → DataTable（Phase 2 产出）
       - Ant Design Form → React Hook Form（Phase 3 产出）
       - Ant Design Modal → Dialog（Phase 4 产出）

    3. 替换样式
       - CSS 类名 → Tailwind 类名
       - 使用 cn() 工具函数

    4. 替换图标
       - @ant-design/icons → lucide-react

    5. 验证功能
       - 列表页：排序、筛选、分页、搜索
       - 详情页：内联编辑、表单提交

    技术要求：
    - 保持原有 API 兼容性
    - TypeScript 严格类型
    - 三栏式详情页布局（如适用）

    输出要求：
    - 迁移后的页面文件
    - 删除的 CSS 文件列表
    - 功能验证清单
  runtime: subagent
  mode: run
  runTimeoutSeconds: 1800
  cwd: C:\Users\13609\Projects\crm-ui-upgrade
  label: page-batch-core
```

---

### 任务 4: Phase 5-2 - 合同/支付/订单/产品页面迁移

```bash
# 启动命令
sessions_spawn:
  task: |
    Phase 5-2: 合同支付订单产品页面迁移 - CRM UI 升级

    目标：完成合同、支付、订单、产品相关页面迁移

    迁移页面列表：
    - ContractList.tsx / ContractDetail.tsx
    - PaymentList.tsx / PaymentDetail.tsx
    - OrderList.tsx / OrderDetail.tsx
    - ProductList.tsx / ProductDetail.tsx
    - PricebookList.tsx / PricebookDetail.tsx

    执行任务：
    - 同 Phase 5-1 的迁移步骤
    - 重点关注表单验证（Zod Schema）
    - 价格相关组件的特殊处理

    技术要求：
    - 保持原有 API 兼容性
    - 金额格式化显示
    - 价格计算逻辑保持不变

    输出要求：
    - 迁移后的页面文件
    - 删除的 CSS 文件列表
    - 功能验证清单
  runtime: subagent
  mode: run
  runTimeoutSeconds: 1800
  cwd: C:\Users\13609\Projects\crm-ui-upgrade
  label: page-batch-contract
```

---

### 任务 5: Phase 5-3 - 活动/仪表盘/报表页面迁移

```bash
# 启动命令
sessions_spawn:
  task: |
    Phase 5-3: 活动仪表盘报表页面迁移 - CRM UI 升级

    目标：完成活动、仪表盘、工作台、报表页面迁移

    迁移页面列表：
    - ActivityList.tsx / ActivityDetail.tsx / ActivityForm.tsx
    - Dashboard.tsx
    - Workbench.tsx
    - 报表页面组（ReportList, ReportDetail 等）

    执行任务：
    - 同 Phase 5-1 的迁移步骤
    - 图表组件（Recharts）保持使用
    - 仪表盘布局适配 Tailwind

    技术要求：
    - 保持原有 API 兼容性
    - 图表正常显示
    - 响应式布局

    输出要求：
    - 迁移后的页面文件
    - 删除的 CSS 文件列表
    - 功能验证清单
  runtime: subagent
  mode: run
  runTimeoutSeconds: 1800
  cwd: C:\Users\13609\Projects\crm-ui-upgrade
  label: page-batch-activity
```

---

### 任务 6: Phase 5-4 - 设置/AI/营销页面迁移

```bash
# 启动命令
sessions_spawn:
  task: |
    Phase 5-4: 设置AI营销页面迁移 - CRM UI 升级

    目标：完成设置、AI、营销及其他剩余页面迁移

    迁移页面列表：
    - Settings 页面组（Profile, Security, Preferences 等）
    - AI 页面组（AIConfig, AIHistory 等）
    - Marketing 页面组（Campaign, Email 等）
    - 其他剩余页面

    执行任务：
    - 同 Phase 5-1 的迁移步骤
    - 设置表单使用 React Hook Form
    - AI 页面保持原有交互

    技术要求：
    - 保持原有 API 兼容性
    - 设置保存功能正常

    输出要求：
    - 迁移后的页面文件
    - 删除的 CSS 文件列表
    - 功能验证清单
    - 剩余 TODO 列表（如有）
  runtime: subagent
  mode: run
  runTimeoutSeconds: 1800
  cwd: C:\Users\13609\Projects\crm-ui-upgrade
  label: page-batch-settings
```

---

## 第 7 批次：最终验证

### 任务 7: Phase 9 - 测试验证

```bash
# 启动命令
sessions_spawn:
  task: |
    Phase 9: 测试验证 - CRM UI 升级

    目标：完成全面测试验证，确保迁移质量

    背景：
    所有迁移完成后，进行全面验证。
    项目路径：C:\Users\13609\Projects\crm-ui-upgrade

    前置依赖（已完成）：
    - ✅ Phase 0-8 全部完成

    执行任务：

    1. TypeScript 编译检查
       - npm run type-check
       - 确保无类型错误

    2. 构建测试
       - npm run build
       - 确保构建成功
       - 检查构建产物大小

    3. 核心业务流程 E2E 测试
       - 创建客户 → 创建商机 → 创建合同
       - 搜索和筛选功能
       - 表单提交和验证
       - 弹窗和抽屉交互

    4. 视觉回归测试（可选）
       - 关键页面截图对比
       - 检查样式一致性

    5. 无障碍审计
       - 键盘导航测试
       - ARIA 标签检查
       - 颜色对比度检查

    6. 性能检查
       - 首屏加载时间
       - 组件渲染性能
       - 包大小分析

    7. 生成验证报告
       - 测试结果汇总
       - 问题列表（如有）
       - 修复建议

    输出要求：
    - 验证报告文档
    - 问题清单（按优先级）
    - 性能指标数据
    - 上线 readiness 评估
  runtime: subagent
  mode: run
  runTimeoutSeconds: 1800
  cwd: C:\Users\13609\Projects\crm-ui-upgrade
  label: testing-validation
```

---

## 执行顺序总结

```
当前进行中:
  ⏳ Phase 3: form-migration
  ⏳ Phase 4: modal-navigation-migration

下一批次（Phase 3/4 完成后并行启动）:
  📋 Phase 6: data-layer-migration
  📋 Phase 8: icon-execution

再下一批次（Phase 6/8 完成后并行启动）:
  📋 Phase 5-1: page-batch-core
  📋 Phase 5-2: page-batch-contract
  📋 Phase 5-3: page-batch-activity
  📋 Phase 5-4: page-batch-settings

最后批次:
  📋 Phase 9: testing