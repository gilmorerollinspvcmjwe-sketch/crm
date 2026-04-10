# 🚀 Enterprise CRM Frontend Architecture Guide

本文档由前端架构师编写，旨在为本企业级 CRM（客户关系管理）系统的前端开发提供全局视角的架构指南。文档详细说明了当前选用的技术栈、组件规范、目录结构以及未来的演进规划，确保团队在后续的开发中保持代码的高质量、高可维护性和一致性。

---

## 🛠 1. 技术栈选型 (Tech Stack)

### 1.1 当前已应用 (Current)
*   **核心框架**: React 18+ (Functional Components & Hooks)
*   **开发语言**: TypeScript (严格模式，确保类型安全)
*   **构建工具**: Vite (极速的冷启动和 HMR)
*   **样式方案**: Tailwind CSS (Utility-first，高度定制化，配合 `cn` 工具函数实现动态类名合并)
*   **UI 组件库**: `shadcn/ui` (基于 Radix UI 的无头组件，提供极高的无障碍访问性和样式定制自由度)
*   **图标库**: Lucide React (轻量、一致的线性图标)
*   **状态管理 (轻量)**: React Context API (`CRMContext`, `ContactContext` 用于当前演示阶段的全局数据流)

### 1.2 未来完整实现需引入 (Future Requirements)
为了支撑完整的企业级 CRM 业务，我们需要在后续阶段引入以下技术：
*   **路由管理**: **React Router v6** 或 **TanStack Router** (替代目前的 `ViewState` 状态路由，支持嵌套路由、路由守卫、代码分割)。
*   **服务端状态管理**: **TanStack Query (React Query)** (处理 API 请求、缓存、同步、后台更新，极大简化异步状态管理)。
*   **客户端全局状态**: **Zustand** (替代复杂的 Context，用于管理跨组件的 UI 状态，如侧边栏折叠、全局主题、多语言状态等)。
*   **网络请求**: **Axios** (封装统一的请求拦截器、响应处理、Token 刷新机制)。
*   **表单处理**: **React Hook Form** + **Zod** (处理复杂的 CRM 表单验证和高性能渲染)。
*   **测试框架**: **Vitest** (单元测试) + **Testing Library** (组件测试) + **Playwright** (E2E 测试)。

---

## 📁 2. 代码文件结构 (Directory Structure)

随着业务复杂度的提升，扁平的结构将无法满足需求。未来我们将采用**按功能模块划分 (Feature-based)** 与 **按职责划分 (Type-based)** 相结合的目录结构：

```text
src/
├── assets/            # 静态资源 (图片、字体、全局 CSS)
├── components/        # 全局复用组件
│   ├── ui/            # 基础 UI 组件 (shadcn/ui 生成的组件)
│   ├── business/      # 业务复用组件 (如：UserAvatar, StatusBadge)
│   └── layout/        # 布局组件 (Sidebar, Header, PageContainer)
├── config/            # 全局配置 (环境变量映射、常量 constants.ts、主题配置)
├── context/           # React Context (仅保留极少数必须通过 Context 注入的配置)
├── hooks/             # 全局自定义 Hooks (如：useDebounce, useAuth, useMediaQuery)
├── lib/               # 第三方库的二次封装与工具函数 (如：utils.ts, axios.ts)
├── routes/            # 路由配置 (路由表、路由守卫、懒加载配置)
├── services/          # API 请求层 (按业务模块划分，如 api/contacts.ts, api/deals.ts)
├── store/             # 全局状态管理 (Zustand stores)
├── types/             # 全局 TypeScript 类型定义 (接口、枚举)
└── views/             # 页面级组件 (Pages)
    ├── Contacts/      # 联系人模块
    │   ├── components/# 该页面专属的局部组件
    │   ├── ContactList.tsx
    │   └── ContactDetail.tsx
    ├── Accounts/      # 客户模块
    ├── Leads/         # 线索模块
    └── Opportunities/ # 商机模块
```

---

## 🧩 3. UI 组件与设计规范 (UI & Design Guidelines)

### 3.1 工业级设计原则
*   **一致性**: 严格遵守 Tailwind 配置中的色彩系统 (Slate/Indigo/Emerald/Rose) 和间距规范。
*   **信息层级**: CRM 数据密集，必须通过排版 (Typography)、留白 (Whitespace) 和微弱的背景色/边框来区分信息区块（如详情页的三栏布局）。
*   **交互反馈**: 所有可点击元素必须有 `hover`、`active` 状态。重要操作需增加阻尼动画 (`transition-all duration-200 ease-[cubic-bezier(...)]`)。
*   **内联编辑 (Inline Editing)**: 详情页的核心字段应支持“悬浮显示编辑图标 -> 点击切换输入框 -> 回车/失焦保存”的无缝交互，减少页面跳转。

### 3.2 页面布局标准模式 (Page Layout Patterns)
为了保持整个 CRM 系统体验的一致性，后续新增页面应遵循以下标准布局模式：
*   **数据列表页 (List View)**: 
    *   顶部：核心指标统计卡片 (KPIs) + 页面级操作 (新建、导出)。
    *   工具栏：搜索框 + 高级筛选器 (Filter) + 批量操作栏。
    *   主体：数据表格 (Table) 或 列表 (List)，必须包含分页或无限滚动，关键字段支持点击直达详情。
*   **实体详情页 (Detail View)**: 统一采用**三栏式布局**。
    *   左栏 (320px固定)：实体概览 (头像/名称)、快捷操作栏、关键信息表单 (支持内联编辑)。
    *   中栏 (自适应)：核心业务流。通常包含标签页 (关于、活动时间线、收入分析、智能洞察)。
    *   右栏 (320px固定)：关联对象 (Related Lists)，如该客户下的联系人、商机、服务工单、附件等。
*   **业务看板页 (Kanban View)**: 适用于商机、任务等有明确生命周期的实体。横向滚动列 + 纵向拖拽卡片，卡片需展示核心摘要、金额和状态标识。

### 3.3 组件拆分与架构规范 (Component Architecture)
*   **容器与展示分离 (Container & Presentational)**: 
    *   `views/` 目录下的页面组件作为**容器组件**，负责发起 API 请求、管理状态、处理业务逻辑。
    *   `components/` 目录下的组件作为**展示组件**，只通过 `props` 接收数据，通过回调函数向上抛出事件，保持纯粹和高复用性。
*   **组合模式 (Composition over Configuration)**: 避免给组件传递几十个 props。对于复杂组件（如 Card, Modal, PageHeader），应使用 `children` 或插槽 (Slots) 模式进行组合。
*   **无头组件优先**: 复杂交互（如弹窗、下拉菜单、标签页）统一使用 `shadcn/ui` (Radix UI)，仅通过 Tailwind 覆盖样式，不重复造轮子。

### 3.4 交互细节与无障碍 (Interaction & Accessibility)
*   **加载与空状态 (Loading & Empty States)**: 
    *   数据加载时，优先使用**骨架屏 (Skeleton)** 替代全局的 Loading 菊花图，减少视觉跳跃感。
    *   列表或关联项为空时，必须提供明确的空状态提示，并附带引导操作 (Call to Action，如“立即新建”)。
*   **键盘导航 (Keyboard Navigation)**: 企业级应用必须对键盘友好。所有的表单、弹窗、下拉菜单必须支持 Tab 切换，Enter/Space 选中，Esc 关闭。
*   **防错与容错**: 破坏性操作（如删除客户、作废商机）必须有二次确认弹窗；表单提交必须有清晰的字段级错误提示（结合 Zod 校验）。

---

## 💻 4. 代码要求与最佳实践 (Coding Standards)

### 4.1 TypeScript 规范
*   **禁止使用 `any`**: 必须定义明确的 `interface` 或 `type`。
*   **API 数据类型化**: `services/` 层返回的数据必须有严格的类型定义，确保前后端字段对齐。

### 4.2 React Hooks 规范
*   **依赖数组**: 严格遵守 `eslint-plugin-react-hooks` 的警告，正确填写 `useEffect` 和 `useCallback` 的依赖项。
*   **避免过度渲染**: 
    *   向下传递的复杂对象或函数使用 `useMemo` 和 `useCallback` 缓存。
    *   列表渲染必须提供稳定的 `key`。

### 4.3 样式规范
*   **Tailwind 优先**: 严禁写行内样式 (`style={{...}}`)，除非是动态计算的属性（如进度条的 `width`）。
*   **类名合并**: 必须使用 `cn()` (clsx + tailwind-merge) 来处理条件类名，防止样式冲突。
    ```tsx
    // ✅ 正确
    className={cn("px-4 py-2 bg-blue-500", isActive && "bg-blue-700")}
    // ❌ 错误
    className={`px-4 py-2 bg-blue-500 ${isActive ? 'bg-blue-700' : ''}`}
    ```

---

## 🚀 5. 后续完整实现的技术要求 (Future Implementation Roadmap)

为了将当前的静态/Mock 演示升级为真正的生产级 CRM，后续开发需满足以下要求：

### 5.1 鉴权与安全 (Authentication & Security)
*   实现基于 JWT 或 OAuth2 的登录流程。
*   在 Axios 拦截器中统一处理 Token 注入和 401 无感刷新。
*   实现**路由守卫 (Route Guards)**，未登录用户重定向至登录页。
*   实现**基于角色的访问控制 (RBAC)**，前端根据用户权限动态渲染菜单和操作按钮。

### 5.2 数据层改造 (Data Layer Overhaul)
*   废弃目前的 `CRMContext` 假数据，全面接入后端 RESTful 或 GraphQL API。
*   引入 **TanStack Query**，实现列表的无限滚动 (Infinite Scroll) 或分页 (Pagination)、数据的后台预取 (Prefetching) 以及乐观更新 (Optimistic Updates，如点赞、修改状态时先更新 UI 再发请求)。

### 5.3 性能优化 (Performance Optimization)
*   **路由懒加载**: 使用 `React.lazy` 和 `Suspense` 按路由拆分代码包。
*   **虚拟列表 (Virtualization)**: 对于包含成千上万条记录的客户/线索列表，引入 `@tanstack/react-virtual` 防止 DOM 节点过多导致卡顿。
*   **防抖与节流**: 搜索框输入、窗口 Resize 等高频操作必须加防抖 (Debounce)。

### 5.4 复杂业务组件 (Complex Business Components)
*   **高级筛选器**: 实现类似 Jira/Salesforce 的多条件组合查询组件 (AND/OR 逻辑)。
*   **富文本编辑器**: 引入 TipTap 或 Quill，用于撰写邮件、备注和工单。
*   **拖拽看板**: 完善“商机”模块的看板，引入 `@hello-pangea/dnd` 实现丝滑的拖拽更改商机阶段。

---
*Document Version: 1.0.0 | Last Updated: 2026-04-02*
