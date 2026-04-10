# CRM 完整迁移 - Agent 执行计划

> 基于 MIGRATION_PLAN_COMPLETE.md 的分 Agent 执行方案
> 目标：完成剩余 44 个页面 + 路由/布局/国际化/状态管理迁移
> 预计总时间：20-30 天（并行优化后 7-10 天）

---

## 📊 任务总览

```
总任务数：约 15-18 个子 Agent
并行批次：6-8 批
预计总时间：7-10 天（并行优化后）
```

---

## 🚀 第 1 批：基础设施（立即启动，2 个 Agent 并行）

### Agent 1: 路由系统迁移
**任务 ID:** `route-migration`  
**模型:** GLM-5  
**预计时间:** 4-6 小时  
**依赖:** 无（可立即启动）

**任务内容:**
```bash
sessions_spawn:
  task: |
    路由系统迁移 - CRM UI 升级
    
    目标：将原项目路由系统迁移到新项目
    
    源项目：C:\Users\13609\.openclaw\workspace\crm2026-4-3new\src\routes\
    目标项目：C:\Users\13609\Projects\crm-ui-upgrade
    
    执行任务：
    1. 分析原项目路由结构（src/routes/）
    2. 创建新的路由配置文件 src/routes/index.tsx
    3. 配置 React Router v6：
       - 创建 BrowserRouter
       - 配置所有路由路径
       - 设置嵌套路由（Layout）
       - 配置懒加载（React.lazy + Suspense）
       - 配置路由守卫（AuthGuard）
    4. 创建路由常量文件 src/constants/routes.ts
    5. 创建路由工具函数 src/utils/routing.ts
    6. 更新 App.tsx 集成路由
    
    技术要求：
    - TypeScript 严格类型
    - 支持路由懒加载
    - 保留原路由路径兼容性
    - 404 页面处理
    
    输出：
    - src/routes/index.tsx
    - src/constants/routes.ts
    - src/utils/routing.ts
    - 更新后的 App.tsx
  runtime: subagent
  mode: run
  runTimeoutSeconds: 1800
  cwd: C:\Users\13609\Projects\crm-ui-upgrade
  label: route-migration
  model: glm5
```

---

### Agent 2: 布局组件创建
**任务 ID:** `layout-components`  
**模型:** GLM-5  
**预计时间:** 4-6 小时  
**依赖:** 无（可立即启动）

**任务内容:**
```bash
sessions_spawn:
  task: |
    布局组件创建 - CRM UI 升级
    
    目标：创建完整的布局组件系统
    
    参考：C:\Users\13609\.openclaw\workspace\crm2026-4-3new\src\components\layout\
    目标项目：C:\Users\13609\Projects\crm-ui-upgrade
    
    执行任务：
    1. 创建主布局组件 src/components/layout/MainLayout.tsx
       - 三栏布局结构（Sidebar + Main + RightPanel）
       - 响应式断点处理
       - 侧边栏折叠/展开
    
    2. 创建侧边栏组件 src/components/layout/Sidebar.tsx
       - Logo 区域
       - 导航菜单（Menu）
       - 用户菜单（UserMenu）
       - 折叠按钮
       - 使用 shadcn/ui Navigation Menu
    
    3. 创建顶部栏组件 src/components/layout/Header.tsx
       - 面包屑导航（Breadcrumb）
       - 全局搜索框
       - 通知图标
       - 用户头像下拉
    
    4. 创建页面容器组件 src/components/layout/PageContainer.tsx
       - 页面标题区域
       - 操作按钮区域
       - 内容区域
       - 返回按钮处理
    
    5. 创建设置布局 src/components/layout/SettingsLayout.tsx
       - 设置侧边栏
       - 设置内容区
    
    6. 创建语言切换组件 src/components/layout/LanguageSwitcher.tsx
    
    技术要求：
    - 使用 Tailwind CSS
    - 响应式设计（mobile-first）
    - 支持深色模式（预留）
    - TypeScript 严格类型
    
    输出：
    - src/components/layout/MainLayout.tsx
    - src/components/layout/Sidebar.tsx
    - src/components/layout/Header.tsx
    - src/components/layout/PageContainer.tsx
    - src/components/layout/SettingsLayout.tsx
    - src/components/layout/LanguageSwitcher.tsx
    - src/components/layout/index.ts
  runtime: subagent
  mode: run
  runTimeoutSeconds: 1800
  cwd: C:\Users\13609\Projects\crm-ui-upgrade
  label: layout-components
  model: glm5
```

---

## 🚀 第 2 批：核心模块页面（第 1 批完成后，3 个 Agent 并行）

### Agent 3: 报表模块页面迁移
**任务 ID:** `pages-report`  
**模型:** GLM-5  
**预计时间:** 6-8 小时  
**依赖:** route-migration, layout-components

**任务内容:**
```bash
sessions_spawn:
  task: |
    报表模块页面迁移 - CRM UI 升级
    
    目标：迁移报表相关 6 个页面
    
    源页面（从原项目复制并迁移）：
    - ReportDashboard.tsx（报表仪表盘）
    - ReportList.tsx（报表列表）
    - ReportDetail.tsx（报表详情）
    - ReportBuilder.tsx（报表构建器）
    - ReportSchedule.tsx（报表定时任务）
    - ReportExport.tsx（报表导出）
    
    执行任务：
    1. 从原项目复制页面文件
    2. 替换 Ant Design 组件 → shadcn/ui
    3. 替换图标 → lucide-react
    4. 替换样式 → Tailwind CSS
    5. 更新数据获取 → TanStack Query
    6. 添加布局包裹（MainLayout）
    
    技术要求：
    - 保持原有功能
    - 图表使用 Recharts（已安装）
    - 表单使用 React Hook Form
    
    输出：
    - src/pages/reports/*.tsx（6个文件）
  runtime: subagent
  mode: run
  runTimeoutSeconds: 1800
  cwd: C:\Users\13609\Projects\crm-ui-upgrade
  label: pages-report
  model: glm5
```

---

### Agent 4: AI 智能模块页面迁移
**任务 ID:** `pages-ai`  
**模型:** GLM-5  
**预计时间:** 6-8 小时  
**依赖:** route-migration, layout-components

**任务内容:**
```bash
sessions_spawn:
  task: |
    AI 智能模块页面迁移 - CRM UI 升级
    
    目标：迁移 AI 相关 8 个页面
    
    源页面：
    - AIAssistant.tsx（AI 助手）
    - AIDashboard.tsx（AI 仪表盘）
    - AIConfig.tsx（AI 配置）- 已存在，需检查更新
    - AIHistory.tsx（AI 历史）- 已存在，需检查更新
    - AIPromptTemplates.tsx（提示词模板）- 已存在，需检查更新
    - AIAnalytics.tsx（AI 分析）
    - AIModels.tsx（模型管理）
    - AIUsage.tsx（用量统计）
    
    执行任务：
    1. 检查已存在的 AI 页面是否需要更新
    2. 迁移缺失的 AI 页面
    3. 统一 AI 模块的 UI 风格
    4. 确保 AI 配置页面功能完整
    
    输出：
    - src/pages/ai/*.tsx（8个文件，含更新）
  runtime: subagent
  mode: run
  runTimeoutSeconds: 1800
  cwd: C:\Users\13609\Projects\crm-ui-upgrade
  label: pages-ai
  model: glm5
```

---

### Agent 5: 系统管理页面迁移
**任务 ID:** `pages-admin`  
**模型:** GLM-5  
**预计时间:** 4-6 小时  
**依赖:** route-migration, layout-components

**任务内容:**
```bash
sessions_spawn:
  task: |
    系统管理页面迁移 - CRM UI 升级
    
    目标：迁移系统管理 3 个页面
    
    源页面：
    - UserManagement.tsx（用户管理）
    - RoleManagement.tsx（角色管理）- 已存在 RoleForm，需扩展
    - PermissionManagement.tsx（权限管理）
    
    执行任务：
    1. 创建用户管理页面（列表 + 表单）
    2. 扩展角色管理页面（基于现有 RoleForm）
    3. 创建权限管理页面
    4. 实现 RBAC 相关功能
    
    输出：
    - src/pages/admin/*.tsx（3个文件）
  runtime: subagent
  mode: run
  runTimeoutSeconds: 1800
  cwd: C:\Users\13609\Projects\crm-ui-upgrade
  label: pages-admin
  model: glm5
```

---

## 🚀 第 3 批：设置模块（第 2 批完成后，2 个 Agent 并行）

### Agent 6: 设置模块页面迁移 - 上
**任务 ID:** `pages-settings-1`  
**模型:** GLM-5  
**预计时间:** 6-8 小时  
**依赖:** pages-admin, pages-ai, pages-report

**任务内容:**
```bash
sessions_spawn:
  task: |
    设置模块页面迁移（上）- CRM UI 升级
    
    目标：迁移设置模块前 10 个页面
    
    源页面：
    - ProfileSettings.tsx（个人资料）- 已存在，检查更新
    - SecuritySettings.tsx（安全设置）- 已存在，检查更新
    - PreferencesSettings.tsx（偏好设置）- 已存在，检查更新
    - NotificationSettings.tsx（通知设置）
    - EmailSettings.tsx（邮件设置）
    - IntegrationSettings.tsx（集成设置）
    - WorkflowSettings.tsx（工作流设置）
    - FieldSettings.tsx（字段设置）
    - LayoutSettings.tsx（布局设置）
    - ThemeSettings.tsx（主题设置）
    
    执行任务：
    1. 检查并更新已存在的设置页面
    2. 创建缺失的设置页面
    3. 统一设置页面的表单风格
    4. 创建设置路由配置
    
    输出：
    - src/pages/settings/*.tsx（10个文件）
  runtime: subagent
  mode: run
  runTimeoutSeconds: 1800
  cwd: C:\Users\13609\Projects\crm-ui-upgrade
  label: pages-settings-1
  model: glm5
```

---

### Agent 7: 设置模块页面迁移 - 下
**任务 ID:** `pages-settings-2`  
**模型:** GLM-5  
**预计时间:** 6-8 小时  
**依赖:** pages-admin, pages-ai, pages-report

**任务内容:**
```bash
sessions_spawn:
  task: |
    设置模块页面迁移（下）- CRM UI 升级
    
    目标：迁移设置模块后 10 个页面
    
    源页面：
    - DataBackupSettings.tsx（数据备份）
    - ImportExportSettings.tsx（导入导出）
    - APISettings.tsx（API 设置）
    - WebhookSettings.tsx（Webhook 设置）
    - AuditLogSettings.tsx（审计日志）
    - LicenseSettings.tsx（许可证）
    - SystemInfo.tsx（系统信息）
    - CustomizationSettings.tsx（自定义设置）
    - MobileSettings.tsx（移动端设置）
    - AdvancedSettings.tsx（高级设置）
    
    执行任务：
    1. 创建所有设置页面
    2. 创建设置侧边栏导航
    3. 实现设置表单验证
    4. 连接设置 API
    
    输出：
    - src/pages/settings/*.tsx（10个文件）
  runtime: subagent
  mode: run
  runTimeoutSeconds: 1800
  cwd: C:\Users\13609\Projects\crm-ui-upgrade
  label: pages-settings-2
  model: glm5
```

---

## 🚀 第 4 批：国际化与状态管理（第 3 批完成后，2 个 Agent 并行）

### Agent 8: 国际化迁移
**任务 ID:** `i18n-migration`  
**模型:** GLM-5  
**预计时间:** 4-6 小时  
**依赖:** pages-settings-1, pages-settings-2

**任务内容:**
```bash
sessions_spawn:
  task: |
    国际化迁移 - CRM UI 升级
    
    目标：将原项目国际化配置迁移到新项目
    
    源项目：C:\Users\13609\.openclaw\workspace\crm2026-4-3new\src\i18n\
    目标项目：C:\Users\13609\Projects\crm-ui-upgrade
    
    执行任务：
    1. 复制 i18n 配置文件
       - src/i18n/index.ts
       - src/i18n/config.ts
    2. 复制语言文件
       - src/locales/zh-CN.json
       - src/locales/en-US.json
    3. 创建语言切换逻辑
    4. 更新所有页面组件使用 i18n
    5. 创建 LanguageSwitcher 组件（如未创建）
    6. 在 main.tsx 中初始化 i18n
    
    技术要求：
    - 使用 react-i18next
    - 支持中英文切换
    - 保持原有翻译键值
    
    输出：
    - src/i18n/*
    - src/locales/*.json
    - 更新后的页面组件
  runtime: subagent
  mode: run
  runTimeoutSeconds: 1800
  cwd: C:\Users\13609\Projects\crm-ui-upgrade
  label: i18n-migration
  model: glm5
```

---

### Agent 9: 状态管理迁移
**任务 ID:** `store-migration`  
**模型:** GLM-5  
**预计时间:** 4-6 小时  
**依赖:** pages-settings-1, pages-settings-2

**任务内容:**
```bash
sessions_spawn:
  task: |
    状态管理迁移 - CRM UI 升级
    
    目标：迁移 Zustand store 并整合 TanStack Query
    
    源项目：C:\Users\13609\.openclaw\workspace\crm2026-4-3new\src\store\
    目标项目：C:\Users\13609\Projects\crm-ui-upgrade
    
    执行任务：
    1. 分析原项目 store 结构
    2. 迁移客户端状态 store
       - src/store/uiStore.ts（UI 状态：侧边栏、主题等）
       - src/store/authStore.ts（认证状态）
       - src/store/userStore.ts（用户信息）
    3. 将服务端状态迁移到 TanStack Query
       - 识别 store 中的 API 调用
       - 转换为 useQuery/useMutation
    4. 创建 store 统一导出
    5. 更新组件使用新的状态管理
    
    技术要求：
    - 保留 Zustand 用于客户端状态
    - 使用 TanStack Query 管理服务端状态
    - 避免状态重复
    
    输出：
    - src/store/*.ts
    - 更新后的组件
  runtime: subagent
  mode: run
  runTimeoutSeconds: 1800
  cwd: C:\Users\13609\Projects\crm-ui-upgrade
  label: store-migration
  model: glm5
```

---

## 🚀 第 5 批：服务层与工具函数（第 4 批完成后，1 个 Agent）

### Agent 10: 服务层迁移
**任务 ID:** `services-migration`  
**模型:** GLM-5  
**预计时间:** 4-6 小时  
**依赖:** i18n-migration, store-migration

**任务内容:**
```bash
sessions_spawn:
  task: |
    服务层迁移 - CRM UI 升级
    
    目标：迁移 API 服务层
    
    源项目：C:\Users\13609\.openclaw\workspace\crm2026-4-3new\src\services\
    目标项目：C:\Users\13609\Projects\crm-ui-upgrade
    
    执行任务：
    1. 分析原项目 services 结构
    2. 迁移 API 服务文件
       - src/services/api.ts（基础 API 配置）
       - src/services/authService.ts
       - src/services/userService.ts
       - src/services/customerService.ts
       - src/services/leadService.ts
       - src/services/opportunityService.ts
       - src/services/contractService.ts
       - src/services/productService.ts
       - src/services/reportService.ts
       - src/services/aiService.ts
       - src/services/settingsService.ts
    3. 整合到现有的 TanStack Query hooks
    4. 统一错误处理
    5. 创建服务层统一导出
    
    技术要求：
    - 使用现有的 Axios 配置
    - 保持 API 接口兼容性
    - TypeScript 严格类型
    
    输出：
    - src/services/*.ts
    - 更新后的 API hooks
  runtime: subagent
  mode: run
  runTimeoutSeconds: 1800
  cwd: C:\Users\13609\Projects\crm-ui-upgrade
  label: services-migration
  model: glm5
```

---

## 🚀 第 6 批：其他模块与工具（第 5 批完成后，2 个 Agent 并行）

### Agent 11: 其他模块页面迁移
**任务 ID:** `pages-others`  
**模型:** GLM-5  
**预计时间:** 4-6 小时  
**依赖:** services-migration

**任务内容:**
```bash
sessions_spawn:
  task: |
    其他模块页面迁移 - CRM UI 升级
    
    目标：迁移剩余的 7 个页面
    
    源页面：
    - HelpCenter.tsx（帮助中心）
    - Documentation.tsx（文档中心）
    - Feedback.tsx（反馈）
    - Changelog.tsx（更新日志）
    - About.tsx（关于）
    - Terms.tsx（服务条款）
    - Privacy.tsx（隐私政策）
    
    执行任务：
    1. 迁移所有其他页面
    2. 创建帮助中心搜索功能
    3. 创建文档导航
    
    输出：
    - src/pages/others/*.tsx（7个文件）
  runtime: subagent
  mode: run
  runTimeoutSeconds: 1800
  cwd: C:\Users\13609\Projects\crm-ui-upgrade
  label: pages-others
  model: glm5
```

---

### Agent 12: 工具函数迁移
**任务 ID:** `utils-migration`  
**模型:** GLM-5  
**预计时间:** 3-4 小时  
**依赖:** services-migration

**任务内容:**
```bash
sessions_spawn:
  task: |
    工具函数迁移 - CRM UI 升级
    
    目标：迁移工具函数和常量
    
    源项目：C:\Users\13609\.openclaw\workspace\crm2026-4-3new\src\utils\
    目标项目：C:\Users\13609\Projects\crm-ui-upgrade
    
    执行任务：
    1. 迁移工具函数
       - src/utils/format.ts（格式化函数）
       - src/utils/validate.ts（验证函数）
       - src/utils/storage.ts（本地存储）
       - src/utils/date.ts（日期处理）
       - src/utils/currency.ts（货币处理）
    2. 迁移常量
       - src/constants/index.ts
       - src/constants/status.ts（状态常量）
       - src/constants/permissions.ts（权限常量）
    3. 检查并合并现有的 utils
    
    输出：
    - src/utils/*.ts
    - src/constants/*.ts
  runtime: subagent
  mode: run
  runTimeoutSeconds: 1800
  cwd: C:\Users\13609\Projects\crm-ui-upgrade
  label: utils-migration
  model: glm5
```

---

## 🚀 第 7 批：入口文件与样式（第 6 批完成后，1 个 Agent）

### Agent 13: 入口文件整合
**任务 ID:** `entry-integration`  
**模型:** GLM-5  
**预计时间:** 3-4 小时  
**依赖:** pages-others, utils-migration

**任务内容:**
```bash
sessions_spawn:
  task: |
    入口文件整合 - CRM UI 升级
    
    目标：重写 App.tsx 和 main.tsx，整合所有模块
    
    执行任务：
    1. 重写 main.tsx
       - 初始化 React
       - 初始化 i18n
       - 初始化 QueryClient
       - 渲染 App
    
    2. 重写 App.tsx
       - 集成路由（Router）
       - 集成状态管理（Providers）
       - 集成国际化（I18nextProvider）
       - 集成 QueryClient（QueryClientProvider）
       - 全局错误边界（ErrorBoundary）
       - 全局加载状态
    
    3. 创建 Provider 层级结构
       - QueryClientProvider
       - I18nextProvider
       - RouterProvider
       - ThemeProvider（预留）
    
    4. 创建全局样式入口
       - src/styles/globals.css
    
    技术要求：
    - Provider 层级正确
    - 错误处理完善
    - TypeScript 严格类型
    
    输出：
    - src/main.tsx
    - src/App.tsx
    - src/providers/index.tsx
    - src/styles/globals.css
  runtime: subagent
  mode: run
  runTimeoutSeconds: 1800
  cwd: C:\Users\13609\Projects\crm-ui-upgrade
  label: entry-integration
  model: glm5
```

---

## 🚀 第 8 批：测试验证（第 7 批完成后，1 个 Agent）

### Agent 14: 最终测试验证
**任务 ID:** `final-testing`  
**模型:** GLM-5  
**预计时间:** 4-6 小时  
**依赖:** entry-integration

**任务内容:**
```bash
sessions_spawn:
  task: |
    最终测试验证 - CRM UI 升级
    
    目标：全面测试验证迁移质量
    
    执行任务：
    1. TypeScript 编译检查
       - npm run type-check
       - 修复所有类型错误
    
    2. 构建测试
       - npm run build
       - 检查构建产物
       - 分析包大小
    
    3. 核心业务流程 E2E 测试
       - 登录流程
       - 客户创建 → 商机创建 → 合同创建
       - 报表生成
       - AI 助手使用
       - 设置修改
    
    4. 页面功能验证
       - 所有页面正常渲染
       - 路由跳转正常
       - 表单提交正常
       - 数据展示正常
    
    5. 生成测试报告
       - 问题清单
       - 修复建议
       - 上线 readiness 评估
    
    输出：
    - TESTING_REPORT.md
    - 修复后的代码
  runtime: subagent
  mode: run
  runTimeoutSeconds: 1800
  cwd: C:\Users\13609\Projects\crm-ui-upgrade
  label: final-testing
  model: glm5
```

---

## 📋 执行顺序图

```
第 1 批（立即启动）
  ├─ route-migration ───────┐
  └─ layout-components ─────┤
                            ▼
第 2 批（第 1 批完成后）
  ├─ pages-report ──────────┐
  ├─ pages-ai ──────────────┤
  └─ pages-admin ───────────┤
                            ▼
第 3 批（第 2 批完成后）
  ├─ pages-settings-1 ──────┐
  └─ pages-settings-2 ──────┤
                            ▼
第 4 批（第 3 批完成后）
  ├─ i18n-migration ────────┐
  └─ store-migration ───────┤
                            ▼
第 5 批（第 4 批完成后）
  └─ services-migration ────┤
                            ▼
第 6 批（第 5 批完成后）
  ├─ pages-others ──────────┤
  └─ utils-migration ───────┤
                            ▼
第 7 批（第 6 批完成后）
  └─ entry-integration ─────┤
                            ▼
第 8 批（第 7 批完成后）
  └─ final-testing ─────────┘
```

---

## ⏱️ 时间估算

| 批次 | Agent 数 | 预计时间 | 累计时间 |
|------|---------|---------|---------|
| 第 1 批 | 2 | 6 小时 | 6 小时 |
| 第 2 批 | 3 | 8 小时 | 14 小时 |
| 第 3 批 | 2 | 8 小时 | 22 小时 |
| 第 4 批 | 2 | 6 小时 | 28 小时 |
| 第 5 批 | 1 | 6 小时 | 34 小时 |
| 第 6 批 | 2 | 6 小时 | 40 小时 |
| 第 7 批 | 1 | 4 小时 | 44 小时 |
| 第 8 批 | 1 | 6 小时 | 50 小时 |

**总计：约 50 小时（约 6-7 天，考虑并行和等待时间）**

---

## 🎯 启动命令汇总

### 第 1 批（立即执行）
```bash
# 路由系统迁移
sessions_spawn --task "..." --label route-migration --model glm5

# 布局组件创建
sessions_spawn --task "..." --label layout-components --model glm5
```

### 第 2 批（第 1 批完成后）
```bash
# 报表模块
sessions_spawn --task "..." --label pages-report --model glm5

# AI 模块
sessions_spawn --task "..." --label pages-ai --model glm5

# 系统管理
sessions_spawn --task "..." --label pages-admin --model glm5
```

### 第 3 批（第 2 批完成后）
```bash
# 设置模块上
sessions_spawn --task "..." --label pages-settings-1 --model glm5

# 设置模块下
sessions_spawn --task "..." --label pages-settings-2 --model glm5
```

### 第 4 批（第 3 批完成后）
```bash
# 国际化
sessions_spawn --task "..." --label i18n-migration --model glm5

# 状态管理
sessions_spawn --task "..." --label store-migration --model glm5
```

### 第 5 批（第 4 批完成后）
```bash
# 服务层
sessions_spawn --task "..." --label services-migration --model glm5
```

### 第 6 批（第 5 批完成后）
```bash
# 其他页面
sessions_spawn --task "..." --label pages-others --model glm5

# 工具函数
sessions_spawn --task "..." --label utils-migration --model glm5
```

### 第 7 批（第 6 批完成后）
```bash
# 入口整合
sessions_spawn --task "..." --label entry-integration --model glm5
```

### 第 8 批（第 7 批完成后）
```bash
# 最终测试
sessions_spawn --task "..." --label final-testing --model glm5
```

---

*计划创建时间：2026-04-03*  
*总 Agent 数：14 个*  
*预计总时间：6-7 天*
