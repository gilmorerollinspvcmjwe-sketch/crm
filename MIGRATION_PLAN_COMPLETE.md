# CRM 前端迁移完整方案

> 文档版本：v1.0  
> 生成日期：2026-04-03  
> 原项目路径：`C:\Users\13609\.openclaw\workspace\crm2026-4-3new`  
> 新项目路径：`C:\Users\13609\Projects\crm-ui-upgrade`

---

## 目录

1. [项目概述](#1-项目概述)
2. [缺失页面清单](#2-缺失页面清单)
3. [路由系统迁移](#3-路由系统迁移)
4. [布局组件创建](#4-布局组件创建)
5. [国际化迁移](#5-国际化迁移)
6. [入口文件整合](#6-入口文件整合)
7. [样式系统迁移](#7-样式系统迁移)
8. [状态管理迁移](#8-状态管理迁移)
9. [服务层迁移](#9-服务层迁移)
10. [完整迁移计划](#10-完整迁移计划)
11. [风险识别](#11-风险识别)

---

## 1. 项目概述

### 1.1 原项目结构

```
crm2026-4-3new/src/
├── components/     # 48+ 业务组件目录
│   ├── AI/
│   ├── Charts/
│   ├── Contact/
│   ├── Contract/
│   ├── CPQ/
│   ├── Customer/
│   ├── CustomField/
│   ├── Dashboard/
│   ├── DataTable/
│   ├── Layout/
│   ├── Lead/
│   ├── Marketing/
│   ├── Opportunity/
│   ├── Payment/
│   ├── Pricebook/
│   ├── Product/
│   ├── Settings/
│   ├── ui/         # Ant Design 基础组件
│   └── ...
├── i18n/           # 国际化配置
│   ├── index.ts
│   └── locales/
│       ├── en.json + 分批文件
│       └── zh.json + 分批文件
├── mock/           # Mock 数据
├── pages/          # 79 个页面 (TSX)
├── routes/         # 路由配置
│   └── index.tsx
├── services/       # API 服务层
├── store/          # Zustand 状态管理
├── styles/         # 样式系统
│   ├── antdTheme.ts
│   ├── design-tokens.css
│   ├── tokens.ts
│   ├── global.css
│   └── ...
├── types/          # TypeScript 类型定义
├── utils/          # 工具函数
├── App.tsx
└── main.tsx
```

**技术栈：**
- React 18 + TypeScript
- Ant Design (antd) 组件库
- React Router v6
- Zustand 状态管理
- react-i18next 国际化
- CSS Modules + 全局样式

### 1.2 新项目结构

```
crm-ui-upgrade/src/
├── components/     # shadcn/ui 组件
│   ├── ui/         # 基础 UI 组件
│   ├── DataTable/  # 数据表格组件
│   ├── form/       # 表单组件
│   ├── modal-navigation/  # 弹窗导航
│   ├── providers/  # Context Provider
│   └── ...
├── forms/          # React Hook Form + Zod 表单
├── hooks/          # 自定义 Hooks
├── lib/            # Axios 配置
├── pages/          # 35 个已迁移页面
├── schemas/        # Zod 验证 Schema
├── types/          # TypeScript 类型
├── App.tsx         # 示例页面（需重写）
└── main.tsx        # 入口文件
```

**技术栈：**
- React 18 + TypeScript
- shadcn/ui + Tailwind CSS
- TanStack Table + React Hook Form + Zod
- TanStack Query (React Query)
- lucide-react 图标库

### 1.3 迁移目标

将原项目的完整功能迁移到新项目，实现：
- Ant Design → shadcn/ui + Tailwind CSS
- 79 个业务页面全部迁移
- 保持原有功能和交互逻辑
- 提升性能和开发体验

---

## 2. 缺失页面清单

### 2.1 页面对比统计

| 类别 | 原项目 | 新项目 | 缺失数量 |
|------|--------|--------|----------|
| 总页面数 | 79 | 35 | **44** |
| 根目录页面 | 47 | 9 | 38 |
| 子目录页面 | 32 | 26 | 6 |

### 2.2 缺失页面详细清单

#### A. 报表模块 (6 个)

| 原路径 | 功能描述 | 优先级 |
|--------|----------|--------|
| `ActivityReport.tsx` | 跟进活动报表 | P1 |
| `LeadConversionReport.tsx` | 线索转化分析 | P1 |
| `PaymentReport.tsx` | 回款统计报表 | P1 |
| `PerformanceReport.tsx` | 业绩绩效报表 | P1 |
| `SalesFunnelReport.tsx` | 销售漏斗分析 | P1 |
| `CustomerReport.tsx` | 客户分析报表 | P2 |

#### B. AI 智能模块 (8 个)

| 原路径 | 功能描述 | 优先级 |
|--------|----------|--------|
| `ChurnWarning.tsx` | 客户流失预警 | P1 |
| `CustomerSegmentation.tsx` | 客户智能分群 | P1 |
| `LeadAssignment.tsx` | 线索智能分配 | P1 |
| `LeadScoring.tsx` | 线索评分模型 | P1 |
| `MeetingAssistant.tsx` | 会议助手 | P2 |
| `PredictiveAI.tsx` | 预测分析 | P2 |
| `AIAgents.tsx` | AI 代理管理 | P2 |
| `AgentDetail.tsx` | AI 代理详情 | P2 |

#### C. 设置模块 (20 个)

| 原路径 | 功能描述 | 优先级 |
|--------|----------|--------|
| `settings/AuditLog.tsx` | 操作日志 | P1 |
| `settings/ChangePassword.tsx` | 修改密码 | P1 |
| `settings/CreateCustomObject.tsx` | 创建自定义对象 | P2 |
| `settings/CustomFields.tsx` | 自定义字段配置 | P2 |
| `settings/CustomObjects.tsx` | 自定义对象列表 | P2 |
| `settings/DisplayPreferences.tsx` | 显示偏好设置 | P1 |
| `settings/FormDesigner.tsx` | 表单设计器 | P3 |
| `settings/LoginLog.tsx` | 登录日志 | P1 |
| `settings/NotificationPreferences.tsx` | 通知偏好设置 | P1 |
| `settings/ObjectConfig.tsx` | 对象配置中心 | P2 |
| `settings/ObjectData.tsx` | 对象数据管理 | P2 |
| `settings/ObjectFields.tsx` | 对象字段配置 | P2 |
| `settings/ObjectRelationships.tsx` | 对象关系配置 | P2 |
| `settings/PageBuilder.tsx` | 页面构建器 | P3 |
| `settings/PipelineManager.tsx` | 流程管道管理 | P2 |
| `settings/Profile.tsx` | 个人资料 | P1 |
| `settings/ViewManager.tsx` | 视图管理器 | P2 |
| `settings/WorkflowEditor.tsx` | 工作流编辑器 | P2 |
| `settings/WorkflowList.tsx` | 工作流列表 | P2 |
| `settings/WorkflowLogs.tsx` | 工作流执行日志 | P2 |

#### D. 系统管理模块 (3 个)

| 原路径 | 功能描述 | 优先级 |
|--------|----------|--------|
| `Roles.tsx` | 角色管理 | P1 |
| `Users.tsx` | 用户管理 | P1 |
| `PermissionSettings.tsx` | 权限配置 | P1 |

#### E. 活动管理模块 (2 个)

| 原路径 | 功能描述 | 优先级 |
|--------|----------|--------|
| `ActivityForm.tsx` | 活动表单（新建/编辑） | P1 |
| `ActivityReport.tsx` | 活动报表 | P1 |

#### F. CPQ 报价模块 (3 个)

| 原路径 | 功能描述 | 优先级 |
|--------|----------|--------|
| `QuoteDetail.tsx` | 报价详情 | P1 |
| `QuoteNew.tsx` | 新建报价 | P1 |
| `quotes/QuoteBuilder.tsx` | 报价构建器 | P2 |

#### G. 营销自动化模块 (3 个)

| 原路径 | 功能描述 | 优先级 |
|--------|----------|--------|
| `EmailTemplates.tsx` | 邀约邮件模板 | P2 |
| `TargetLists.tsx` | 目标客户列表 | P2 |
| `CampaignDetail.tsx` | 营销活动详情（需对比） | P2 |

#### H. 集成对接模块 (2 个)

| 原路径 | 功能描述 | 优先级 |
|--------|----------|--------|
| `tickets/TicketList.tsx` | 工单列表 | P2 |
| `knowledge/KnowledgeSearch.tsx` | 知识库搜索 | P2 |

#### I. 呼叫中心模块 (1 个)

| 原路径 | 功能描述 | 优先级 |
|--------|----------|--------|
| `callcenter/OutboundTasks.tsx` | 外呼任务 | P3 |

#### J. 销售预测模块 (1 个)

| 原路径 | 功能描述 | 优先级 |
|--------|----------|--------|
| `SalesForecast.tsx` | 销售预测 | P2 |

#### K. 其他模块 (3 个)

| 原路径 | 功能描述 | 优先级 |
|--------|----------|--------|
| `CustomerSegmentation.tsx` | 客户分群 | P2 |
| `TestPage.tsx` | 测试页面 | P3 |
| `QuoteNew.tsx` | 新建报价（独立） | P1 |

#### L. 工作台子组件 (8 个)

| 原路径 | 功能描述 | 优先级 |
|--------|----------|--------|
| `workbench/components/AIAssistant.tsx` | AI 助手卡片 | P2 |
| `workbench/components/AIRecommendation.tsx` | AI 推荐卡片 | P2 |
| `workbench/components/CreateModal.tsx` | 快速创建弹窗 | P2 |
| `workbench/components/Performance.tsx` | 业绩卡片 | P1 |
| `workbench/components/QuickActions.tsx` | 快捷操作 | P1 |
| `workbench/components/TodayTodo.tsx` | 今日待办 | P1 |
| `workbench/components/WinPredictionCard.tsx` | 赢单预测卡片 | P2 |

### 2.3 新增页面建议

新项目中已创建但原项目没有的页面：

| 新路径 | 说明 |
|--------|------|
| `ai/AIConfig.tsx` | AI 配置页面（新增功能） |
| `ai/AIHistory.tsx` | AI 历史记录（新增功能） |
| `ai/AIPromptTemplates.tsx` | AI 提示词模板（新增功能） |
| `ReportDetail.tsx` | 报表详情（新增功能） |
| `ReportList.tsx` | 报表列表（新增功能） |

**建议：** 保留这些新增页面，它们提供了更好的功能扩展。

---

## 3. 路由系统迁移

### 3.1 原项目路由分析

原项目使用 `react-router-dom` v6 的 `createBrowserRouter`：

```tsx
// 原项目路由特点：
// 1. 懒加载所有页面 (React.lazy)
// 2. 统一的 MainLayout 布局包装
// 3. 嵌套路由（settings 使用 SettingsLayout）
// 4. 向后兼容的旧路由重定向
// 5. 路径命名规则：/{模块}/{操作}
```

**路由结构：**
```
/                           → 重定向到 /workbench
/workbench                  → 工作台
/dashboard                  → 仪表盘
/customer/list              → 客户列表
/customer/:id               → 客户详情
/lead/list                  → 线索列表
/opportunity/list           → 商机列表
/activity/list              → 跟进记录
/contract/list              → 合同列表
/payment/list               → 回款列表
/order/list                 → 订单列表
/quote/list                 → 报价列表
/products/list              → 产品列表
/pricebooks/list            → 价格表列表
/report/{type}              → 报表模块
/ai/{feature}               → AI 功能
/marketing/{feature}        → 营销模块
/integration/{feature}      → 集成模块
/automation/workflows       → 自动化工作流
/settings/{feature}         → 系统设置（嵌套路由）
```

### 3.2 新项目路由方案

#### 方案一：完全复制原路由结构

创建 `src/routes/index.tsx`：

```tsx
/**
 * 统一路由配置 - 新项目版本
 */
import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { SettingsLayout } from '@/components/layout/SettingsLayout';

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-full">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

// 布局包装器
const LayoutWrapper: React.FC = () => (
  <MainLayout>
    <Suspense fallback={<LoadingFallback />}>
      <Outlet />
    </Suspense>
  </MainLayout>
);

// 已迁移页面 - 懒加载
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Workbench = lazy(() => import('@/pages/Workbench'));
const CustomerList = lazy(() => import('@/pages/CustomerList'));
const CustomerDetail = lazy(() => import('@/pages/CustomerDetail'));
const ContactList = lazy(() => import('@/pages/ContactList'));
const ContactDetail = lazy(() => import('@/pages/ContactDetail'));
const LeadList = lazy(() => import('@/pages/LeadList'));
const LeadDetail = lazy(() => import('@/pages/LeadDetail'));
const OpportunityList = lazy(() => import('@/pages/OpportunityList'));
const OpportunityDetail = lazy(() => import('@/pages/OpportunityDetail'));
const ContractList = lazy(() => import('@/pages/ContractList'));
const ContractDetail = lazy(() => import('@/pages/ContractDetail'));
const PaymentList = lazy(() => import('@/pages/PaymentList'));
const PaymentDetail = lazy(() => import('@/pages/PaymentDetail'));
const OrderList = lazy(() => import('@/pages/OrderList'));
const OrderDetail = lazy(() => import('@/pages/OrderDetail'));

// 产品和价格表
const ProductList = lazy(() => import('@/pages/ProductList'));
const ProductDetail = lazy(() => import('@/pages/ProductDetail'));
const PricebookList = lazy(() => import('@/pages/PricebookList'));
const PricebookDetail = lazy(() => import('@/pages/PricebookDetail'));

// 营销模块
const CampaignList = lazy(() => import('@/pages/marketing/CampaignList'));
const CampaignDetail = lazy(() => import('@/pages/marketing/CampaignDetail'));
const EmailList = lazy(() => import('@/pages/marketing/EmailList'));
const EmailDetail = lazy(() => import('@/pages/marketing/EmailDetail'));

// 报表模块
const ReportList = lazy(() => import('@/pages/ReportList'));
const ReportDetail = lazy(() => import('@/pages/ReportDetail'));

// AI 模块
const AIConfig = lazy(() => import('@/pages/ai/AIConfig'));
const AIHistory = lazy(() => import('@/pages/ai/AIHistory'));
const AIPromptTemplates = lazy(() => import('@/pages/ai/AIPromptTemplates'));

// 设置模块
const ProfileSettings = lazy(() => import('@/pages/settings/ProfileSettings'));
const SecuritySettings = lazy(() => import('@/pages/settings/SecuritySettings'));
const PreferencesSettings = lazy(() => import('@/pages/settings/PreferencesSettings'));

// 待迁移页面占位符（迁移后替换）
const ActivityList = lazy(() => import('@/pages/ActivityList'));
const ActivityForm = lazy(() => import('@/pages/ActivityForm'));

// 路由配置
export const router = createBrowserRouter([
  {
    path: '/',
    element: <LayoutWrapper />,
    children: [
      // 默认重定向
      { index: true, element: <Navigate to="/workbench" replace /> },
      
      // 工作台
      { path: 'workbench', element: <Workbench /> },
      { path: 'dashboard', element: <Dashboard /> },
      
      // 向后兼容重定向
      { path: 'customer', element: <Navigate to="/customer/list" replace /> },
      { path: 'lead', element: <Navigate to="/lead/list" replace /> },
      { path: 'opportunity', element: <Navigate to="/opportunity/list" replace /> },
      { path: 'activity', element: <Navigate to="/activity/list" replace /> },
      { path: 'contract', element: <Navigate to="/contract/list" replace /> },
      { path: 'payment', element: <Navigate to="/payment/list" replace /> },
      { path: 'quote', element: <Navigate to="/quote/list" replace /> },
      { path: 'products', element: <Navigate to="/products/list" replace /> },
      { path: 'pricebooks', element: <Navigate to="/pricebooks/list" replace /> },
      { path: 'report', element: <Navigate to="/report/list" replace /> },
      { path: 'settings', element: <Navigate to="/settings/profile" replace /> },
      { path: 'ai', element: <Navigate to="/ai/config" replace /> },
      { path: 'marketing', element: <Navigate to="/marketing/campaigns" replace /> },
      
      // 客户管理
      { path: 'customer/list', element: <CustomerList /> },
      { path: 'customer/:id', element: <CustomerDetail /> },
      { path: 'contact/list', element: <ContactList /> },
      { path: 'contact/:id', element: <ContactDetail /> },
      
      // 线索管理
      { path: 'lead/list', element: <LeadList /> },
      { path: 'lead/:id', element: <LeadDetail /> },
      
      // 商机管理
      { path: 'opportunity/list', element: <OpportunityList /> },
      { path: 'opportunity/:id', element: <OpportunityDetail /> },
      
      // 跟进记录
      { path: 'activity/list', element: <ActivityList /> },
      { path: 'activity/new', element: <ActivityForm /> },
      { path: 'activity/:id', element: <ActivityForm /> },
      
      // 合同管理
      { path: 'contract/list', element: <ContractList /> },
      { path: 'contract/:id', element: <ContractDetail /> },
      
      // 回款管理
      { path: 'payment/list', element: <PaymentList /> },
      { path: 'payment/:id', element: <PaymentDetail /> },
      
      // 订单管理
      { path: 'order/list', element: <OrderList /> },
      { path: 'order/:id', element: <OrderDetail /> },
      
      // 产品库
      { path: 'products/list', element: <ProductList /> },
      { path: 'products/:id', element: <ProductDetail /> },
      
      // 价格表
      { path: 'pricebooks/list', element: <PricebookList /> },
      { path: 'pricebooks/:id', element: <PricebookDetail /> },
      
      // 营销模块
      { path: 'marketing/campaigns', element: <CampaignList /> },
      { path: 'marketing/campaign/:id', element: <CampaignDetail /> },
      { path: 'marketing/emails', element: <EmailList /> },
      { path: 'marketing/email/:id', element: <EmailDetail /> },
      
      // 报表模块
      { path: 'report/list', element: <ReportList /> },
      { path: 'report/:id', element: <ReportDetail /> },
      
      // AI 模块
      { path: 'ai/config', element: <AIConfig /> },
      { path: 'ai/history', element: <AIHistory /> },
      { path: 'ai/templates', element: <AIPromptTemplates /> },
      
      // 设置模块（嵌套路由）
      {
        path: 'settings',
        element: <SettingsLayout />,
        children: [
          { index: true, element: <Navigate to="/settings/profile" replace /> },
          { path: 'profile', element: <ProfileSettings /> },
          { path: 'security', element: <SecuritySettings /> },
          { path: 'preferences', element: <PreferencesSettings /> },
          // 待迁移的设置子路由将在迁移后添加
        ],
      },
    ],
  },
]);

export default router;
```

#### 方案二：路由配置模块化

将路由按模块拆分，便于维护：

```tsx
// src/routes/customerRoutes.ts
export const customerRoutes = [
  { path: 'customer/list', element: lazy(() => import('@/pages/CustomerList')) },
  { path: 'customer/:id', element: lazy(() => import('@/pages/CustomerDetail')) },
  // ...
];

// src/routes/index.tsx
import { customerRoutes } from './customerRoutes';
import { leadRoutes } from './leadRoutes';
// ...
```

### 3.3 迁移步骤

1. **创建 routes 目录**
   ```bash
   mkdir -p src/routes
   ```

2. **创建主路由文件**
   - 复制原路由结构
   - 适配新组件导入路径
   - 添加未迁移页面的占位符

3. **更新 App.tsx**
   ```tsx
   import { RouterProvider } from 'react-router-dom';
   import router from './routes';
   
   function App() {
     return <RouterProvider router={router} />;
   }
   ```

4. **逐步添加迁移页面**
   - 每迁移一个页面，更新路由配置
   - 保持路由路径一致性

---

## 4. 布局组件创建

### 4.1 布局组件架构

新项目需要创建以下布局组件：

```
src/components/layout/
├── MainLayout.tsx      # 主布局（侧边栏 + 头部 + 内容）
├── SettingsLayout.tsx  # 设置页面布局（左侧菜单 + 右侧内容）
├── Sidebar.tsx         # 侧边栏组件
├── Header.tsx          # 顶部栏组件
├── Breadcrumb.tsx      # 面包屑导航
├── UserMenu.tsx        # 用户菜单
├── NotificationMenu.tsx # 通知菜单
└── LanguageSwitcher.tsx # 语言切换器
```

### 4.2 MainLayout 组件实现

```tsx
// src/components/layout/MainLayout.tsx
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children?: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // 检测移动端
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 持久化侧边栏状态
  useEffect(() => {
    const stored = localStorage.getItem('sidebar-collapsed');
    if (stored) setSidebarCollapsed(stored === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  return (
    <div className="min-h-screen bg-background">
      {/* 侧边栏 */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onCollapse={setSidebarCollapsed}
        isMobile={isMobile}
      />

      {/* 主内容区域 */}
      <div
        className={cn(
          'transition-all duration-200',
          isMobile ? 'ml-0' : sidebarCollapsed ? 'ml-16' : 'ml-64'
        )}
      >
        {/* 顶部栏 */}
        <Header
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          isMobile={isMobile}
        />

        {/* 内容区域 */}
        <main className="p-4 md:p-6">
          <div className="bg-card rounded-lg border p-4 md:p-6">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
}
```

### 4.3 Sidebar 组件实现

```tsx
// src/components/layout/Sidebar.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Home,
  Users,
  Lightbulb,
  FileText,
  ShoppingCart,
  BarChart3,
  Robot,
  Mail,
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  Zap,
  Headphones,
  Building2,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
  isMobile: boolean;
}

interface MenuItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    key: 'workplace',
    label: '工作台',
    icon: <Home className="h-4 w-4" />,
    children: [
      { key: '/workbench', label: '销售工作台', icon: null, path: '/workbench' },
      { key: '/dashboard', label: '仪表盘', icon: null, path: '/dashboard' },
    ],
  },
  {
    key: 'customer',
    label: '客户管理',
    icon: <Users className="h-4 w-4" />,
    children: [
      { key: '/customer/list', label: '客户列表', icon: null, path: '/customer/list' },
      { key: '/contact/list', label: '联系人列表', icon: null, path: '/contact/list' },
    ],
  },
  {
    key: 'sales',
    label: '销售管理',
    icon: <Lightbulb className="h-4 w-4" />,
    children: [
      { key: '/lead/list', label: '线索管理', icon: null, path: '/lead/list' },
      { key: '/opportunity/list', label: '商机管理', icon: null, path: '/opportunity/list' },
      { key: '/activity/list', label: '跟进记录', icon: null, path: '/activity/list' },
    ],
  },
  {
    key: 'order',
    label: '订单管理',
    icon: <FileText className="h-4 w-4" />,
    children: [
      { key: '/order/list', label: '订单列表', icon: null, path: '/order/list' },
      { key: '/quote/list', label: '报价管理', icon: null, path: '/quote/list' },
      { key: '/contract/list', label: '合同管理', icon: null, path: '/contract/list' },
      { key: '/payment/list', label: '回款管理', icon: null, path: '/payment/list' },
    ],
  },
  {
    key: 'product',
    label: '产品与定价',
    icon: <ShoppingCart className="h-4 w-4" />,
    children: [
      { key: '/products/list', label: '产品库', icon: null, path: '/products/list' },
      { key: '/pricebooks/list', label: '价格表', icon: null, path: '/pricebooks/list' },
    ],
  },
  {
    key: 'report',
    label: '报表中心',
    icon: <BarChart3 className="h-4 w-4" />,
    children: [
      { key: '/report/list', label: '报表列表', icon: null, path: '/report/list' },
    ],
  },
  {
    key: 'ai',
    label: '智能 AI',
    icon: <Robot className="h-4 w-4" />,
    children: [
      { key: '/ai/config', label: 'AI 配置', icon: null, path: '/ai/config' },
      { key: '/ai/history', label: '历史记录', icon: null, path: '/ai/history' },
      { key: '/ai/templates', label: '提示词模板', icon: null, path: '/ai/templates' },
    ],
  },
  {
    key: 'automation',
    label: '自动化',
    icon: <Zap className="h-4 w-4" />,
    children: [
      { key: '/automation/workflows', label: '工作流', icon: null, path: '/automation/workflows' },
    ],
  },
  {
    key: 'marketing',
    label: '营销自动化',
    icon: <Mail className="h-4 w-4" />,
    children: [
      { key: '/marketing/campaigns', label: '营销活动', icon: null, path: '/marketing/campaigns' },
      { key: '/marketing/emails', label: '邮件管理', icon: null, path: '/marketing/emails' },
    ],
  },
  {
    key: 'integration',
    label: '集成对接',
    icon: <Headphones className="h-4 w-4" />,
    children: [
      { key: '/integration/tickets', label: '工单系统', icon: null, path: '/integration/tickets' },
      { key: '/integration/knowledge', label: '知识库', icon: null, path: '/integration/knowledge' },
    ],
  },
  {
    key: 'settings',
    label: '系统设置',
    icon: <Settings className="h-4 w-4" />,
    children: [
      { key: '/settings/profile', label: '个人资料', icon: null, path: '/settings/profile' },
      { key: '/settings/security', label: '安全设置', icon: null, path: '/settings/security' },
      { key: '/settings/preferences', label: '偏好设置', icon: null, path: '/settings/preferences' },
    ],
  },
];

export function Sidebar({ collapsed, onCollapse, isMobile }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState<string[]>(['workplace']);

  // 自动展开当前路径对应的菜单
  useEffect(() => {
    const path = location.pathname;
    const moduleMap: Record<string, string> = {
      '/workbench': 'workplace',
      '/dashboard': 'workplace',
      '/customer': 'customer',
      '/contact': 'customer',
      '/lead': 'sales',
      '/opportunity': 'sales',
      '/activity': 'sales',
      '/order': 'order',
      '/quote': 'order',
      '/contract': 'order',
      '/payment': 'order',
      '/products': 'product',
      '/pricebooks': 'product',
      '/report': 'report',
      '/ai': 'ai',
      '/automation': 'automation',
      '/marketing': 'marketing',
      '/integration': 'integration',
      '/settings': 'settings',
    };
    
    for (const [prefix, key] of Object.entries(moduleMap)) {
      if (path.startsWith(prefix)) {
        setOpenKeys([key]);
        break;
      }
    }
  }, [location.pathname]);

  const handleMenuClick = (path: string) => {
    navigate(path);
  };

  const handleOpenChange = (key: string) => {
    setOpenKeys(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const renderMenuItem = (item: MenuItem) => {
    const isOpen = openKeys.includes(item.key);
    const isActive = location.pathname === item.key;

    if (item.children) {
      return (
        <div key={item.key}>
          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start h-10',
              collapsed && 'justify-center px-2'
            )}
            onClick={() => handleOpenChange(item.key)}
          >
            {item.icon}
            {!collapsed && (
              <>
                <span className="ml-2 flex-1">{item.label}</span>
                {isOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </>
            )}
          </Button>
          {isOpen && !collapsed && (
            <div className="ml-4 space-y-1">
              {item.children.map(child => renderMenuItem(child))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Button
        key={item.key}
        variant={isActive ? 'secondary' : 'ghost'}
        className={cn(
          'w-full justify-start h-9',
          collapsed && 'justify-center px-2'
        )}
        onClick={() => item.path && handleMenuClick(item.path)}
      >
        {!collapsed && <span>{item.label}</span>}
      </Button>
    );
  };

  // 移动端使用 Sheet
  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="h-full flex flex-col">
            <div className="h-14 flex items-center px-4 border-b">
              <Building2 className="h-6 w-6 text-primary" />
              <span className="ml-2 font-semibold">CRM 系统</span>
            </div>
            <div className="flex-1 overflow-auto p-2">
              {menuItems.map(item => renderMenuItem(item))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // 桌面端侧边栏
  return (
    <aside
      className={cn(
        'fixed left-0 top-0 bottom-0 z-40 bg-card border-r transition-all duration-200',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="h-full flex flex-col">
        {/* Logo */}
        <div className="h-14 flex items-center justify-center border-b">
          {collapsed ? (
            <Building2 className="h-6 w-6 text-primary" />
          ) : (
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              <span className="font-semibold">CRM 系统</span>
            </div>
          )}
        </div>

        {/* 菜单 */}
        <nav className="flex-1 overflow-auto p-2">
          {menuItems.map(item => renderMenuItem(item))}
        </nav>
      </div>
    </aside>
  );
}
```

### 4.4 Header 组件实现

```tsx
// src/components/layout/Header.tsx
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  Search,
  Bell,
  User,
  Settings,
  Logout,
  Home,
  ChevronRight,
} from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  isMobile: boolean;
}

// 面包屑映射
const breadcrumbMap: Record<string, string> = {
  '/workbench': '销售工作台',
  '/dashboard': '仪表盘',
  '/customer/list': '客户列表',
  '/customer': '客户管理',
  '/contact/list': '联系人列表',
  '/contact': '联系人',
  '/lead/list': '线索列表',
  '/lead': '线索管理',
  '/opportunity/list': '商机列表',
  '/opportunity': '商机管理',
  '/activity/list': '跟进记录',
  '/activity': '跟进管理',
  '/contract/list': '合同列表',
  '/contract': '合同管理',
  '/payment/list': '回款列表',
  '/payment': '回款管理',
  '/order/list': '订单列表',
  '/order': '订单管理',
  '/quote/list': '报价列表',
  '/quote': '报价管理',
  '/products/list': '产品列表',
  '/products': '产品库',
  '/pricebooks/list': '价格表列表',
  '/pricebooks': '价格表',
  '/report/list': '报表列表',
  '/report': '报表中心',
  '/ai': '智能 AI',
  '/marketing': '营销自动化',
  '/integration': '集成对接',
  '/settings': '系统设置',
};

export function Header({ sidebarCollapsed, onToggleSidebar, isMobile }: HeaderProps) {
  const { t } = useTranslation();
  const location = useLocation();

  // 生成面包屑
  const generateBreadcrumb = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    const items = [{ path: '/', label: <Home className="h-4 w-4" /> }];
    
    let currentPath = '';
    for (const segment of paths) {
      currentPath += '/' + segment;
      const label = breadcrumbMap[currentPath] || segment;
      items.push({ path: currentPath, label });
    }
    
    return items;
  };

  const breadcrumbItems = generateBreadcrumb();

  return (
    <header className="h-14 bg-card border-b flex items-center justify-between px-4 sticky top-0 z-30">
      {/* 左侧：折叠按钮 + 面包屑 */}
      <div className="flex items-center gap-4">
        {!isMobile && (
          <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
            {sidebarCollapsed ? (
              <MenuUnfoldOutlined className="h-5 w-5" />
            ) : (
              <MenuFoldOutlined className="h-5 w-5" />
            )}
          </Button>
        )}
        
        {!isMobile && (
          <nav className="flex items-center gap-1 text-sm">
            {breadcrumbItems.map((item, index) => (
              <React.Fragment key={item.path}>
                {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                {index === breadcrumbItems.length - 1 ? (
                  <span className="text-foreground font-medium">{item.label}</span>
                ) : (
                  <Link
                    to={item.path}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
      </div>

      {/* 中间：搜索 */}
      <div className="flex-1 max-w-md mx-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索客户、商机..."
            className="pl-9"
          />
        </div>
      </div>

      {/* 右侧：通知 + 语言 + 用户 */}
      <div className="flex items-center gap-3">
        <LanguageSwitcher />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                3
              </Badge>
              <Bell className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-2 space-y-2">
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="font-medium">合同审批待处理</div>
                <div className="text-sm text-muted-foreground mt-1">
                  深圳未来科技 - 合同编号 CONT2026001
                </div>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="font-medium">商机即将过期</div>
                <div className="text-sm text-muted-foreground mt-1">
                  北京科技创新 - 预计成交日期：03-31
                </div>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-primary">
              查看全部通知
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>管</AvatarFallback>
              </Avatar>
              {!isMobile && <span className="text-sm">管理员</span>}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <User className="h-4 w-4 mr-2" />
              个人中心
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="h-4 w-4 mr-2" />
              账号设置
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Logout className="h-4 w-4 mr-2" />
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
```

### 4.5 SettingsLayout 组件实现

```tsx
// src/components/layout/SettingsLayout.tsx
import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  User,
  Shield,
  Settings2,
  Users,
  Lock,
  Bell,
  Palette,
  FileText,
  Database,
  Workflow,
  History,
} from 'lucide-react';

interface SettingsMenuItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const settingsMenu: SettingsMenuItem[] = [
  { key: 'profile', label: '个人资料', icon: <User className="h-4 w-4" />, path: '/settings/profile' },
  { key: 'security', label: '安全设置', icon: <Shield className="h-4 w-4" />, path: '/settings/security' },
  { key: 'notifications', label: '通知偏好', icon: <Bell className="h-4 w-4" />, path: '/settings/notifications' },
  { key: 'display', label: '显示偏好', icon: <Palette className="h-4 w-4" />, path: '/settings/display' },
  { key: 'roles', label: '角色管理', icon: <Lock className="h-4 w-4" />, path: '/settings/roles' },
  { key: 'users', label: '用户管理', icon: <Users className="h-4 w-4" />, path: '/settings/users' },
  { key: 'permissions', label: '权限配置', icon: <Shield className="h-4 w-4" />, path: '/settings/permissions' },
  { key: 'custom-fields', label: '自定义字段', icon: <FileText className="h-4 w-4" />, path: '/settings/custom-fields' },
  { key: 'custom-objects', label: '自定义对象', icon: <Database className="h-4 w-4" />, path: '/settings/custom-objects' },
  { key: 'workflows', label: '工作流管理', icon: <Workflow className="h-4 w-4" />, path: '/settings/workflows' },
  { key: 'audit-log', label: '操作日志', icon: <History className="h-4 w-4" />, path: '/settings/audit-log' },
  { key: 'login-log', label: '登录日志', icon: <History className="h-4 w-4" />, path: '/settings/login-log' },
];

export function SettingsLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex gap-6">
      {/* 左侧菜单 */}
      <aside className="w-56 shrink-0">
        <div className="bg-card rounded-lg border p-2">
          <nav className="space-y-1">
            {settingsMenu.map(item => (
              <Button
                key={item.key}
                variant={location.pathname === item.path ? 'secondary' : 'ghost'}
                className="w-full justify-start gap-2"
                onClick={() => navigate(item.path)}
              >
                {item.icon}
                {item.label}
              </Button>
            ))}
          </nav>
        </div>
      </aside>

      {/* 右侧内容 */}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
```

### 4.6 LanguageSwitcher 组件

```tsx
// src/components/layout/LanguageSwitcher.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Languages } from 'lucide-react';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Languages className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => changeLanguage('zh')}
          className={i18n.language === 'zh' ? 'bg-accent' : ''}
        >
          中文
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => changeLanguage('en')}
          className={i18n.language === 'en' ? 'bg-accent' : ''}
        >
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

---

## 5. 国际化迁移

### 5.1 原项目 i18n 结构

```
src/i18n/
├── index.ts              # 配置入口
└── locales/
    ├── en.json           # 英文主文件
    ├── en_batch1_3.json  # 英文分批文件 1-3
    ├── en_batch4_6.json  # 英文分批文件 4-6
    ├── en_batch7_9.json  # 英文分批文件 7-9
    ├── zh.json           # 中文主文件
    ├── zh_batch1_3.json  # 中文分批文件 1-3
    ├── zh_batch4_6.json  # 中文分批文件 4-6
    └── zh_batch7_9.json  # 中文分批文件 7-9
```

**配置方式：**
```tsx
// src/i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslations from './locales/en.json';
import zhTranslations from './locales/zh.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      zh: { translation: zhTranslations },
    },
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'cookie', 'navigator'],
      caches: ['localStorage', 'cookie'],
    },
    react: { useSuspense: false },
  });
```

### 5.2 新项目 i18n 方案

#### 方案一：直接复制迁移

```bash
# 创建目录
mkdir -p src/i18n/locales

# 复制文件
cp -r ../crm2026-4-3new/src/i18n/* src/i18n/
```

#### 方案二：合并分批文件

将分批 JSON 文件合并到主文件：

```tsx
// scripts/merge-i18n.ts
import fs from 'fs';
import path from 'path';

const localesDir = './src/i18n/locales';

// 合并英文
const enMain = JSON.parse(fs.readFileSync(path.join(localesDir, 'en.json'), 'utf-8'));
const enBatch1 = JSON.parse(fs.readFileSync(path.join(localesDir, 'en_batch1_3.json'), 'utf-8'));
const enBatch2 = JSON.parse(fs.readFileSync(path.join(localesDir, 'en_batch4_6.json'), 'utf-8'));
const enBatch3 = JSON.parse(fs.readFileSync(path.join(localesDir, 'en_batch7_9.json'), 'utf-8'));

const enMerged = { ...enMain, ...enBatch1, ...enBatch2, ...enBatch3 };
fs.writeFileSync(path.join(localesDir, 'en_merged.json'), JSON.stringify(enMerged, null, 2));

// 合并中文（同理）
```

### 5.3 迁移步骤

1. **安装依赖**
   ```bash
   npm install i18next react-i18next i18next-browser-languagedetector
   ```

2. **创建 i18n 目录**
   ```bash
   mkdir -p src/i18n/locales
   ```

3. **复制翻译文件**
   ```bash
   # 从原项目复制
   cp ../crm2026-4-3new/src/i18n/locales/*.json src/i18n/locales/
   ```

4. **创建配置文件**
   ```tsx
   // src/i18n/index.ts
   import i18n from 'i18next';
   import { initReactI18next } from 'react-i18next';
   import LanguageDetector from 'i18next-browser-languagedetector';

   // 导入翻译文件
   import en from './locales/en.json';
   import zh from './locales/zh.json';

   // 可选：导入分批文件
   import en_batch1 from './locales/en_batch1_3.json';
   import en_batch4 from './locales/en_batch4_6.json';
   import en_batch7 from './locales/en_batch7_9.json';
   import zh_batch1 from './locales/zh_batch1_3.json';
   import zh_batch4 from './locales/zh_batch4_6.json';
   import zh_batch7 from './locales/zh_batch7_9.json';

   // 合并翻译
   const enTranslations = { ...en, ...en_batch1, ...en_batch4, ...en_batch7 };
   const zhTranslations = { ...zh, ...zh_batch1, ...zh_batch4, ...zh_batch7 };

   i18n
     .use(LanguageDetector)
     .use(initReactI18next)
     .init({
       resources: {
         en: { translation: enTranslations },
         zh: { translation: zhTranslations },
       },
       fallbackLng: 'zh',
       interpolation: { escapeValue: false },
       detection: {
         order: ['localStorage', 'navigator'],
         caches: ['localStorage'],
       },
       react: { useSuspense: false },
     });

   export default i18n;
   ```

5. **更新 main.tsx**
   ```tsx
   // src/main.tsx
   import React from 'react';
   import ReactDOM from 'react-dom/client';
   import App from './App';
   import './i18n'; // 导入 i18n 配置
   import './index.css';

   ReactDOM.createRoot(document.getElementById('root')!).render(
     <React.StrictMode>
       <App />
     </React.StrictMode>,
   );
   ```

6. **使用翻译**
   ```tsx
   // 在组件中使用
   import { useTranslation } from 'react-i18next';

   function MyComponent() {
     const { t } = useTranslation();
     return <h1>{t('nav.dashboard')}</h1>;
   }
   ```

---

## 6. 入口文件整合

### 6.1 App.tsx 重写方案

原项目 App.tsx：
```tsx
// 原项目：包含 ConfigProvider (Ant Design) + RouterProvider + i18n
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
import { antdTheme } from './styles/antdTheme';
```

新项目 App.tsx（建议）：
```tsx
// src/App.tsx - 新版本
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import router from './routes';

// 创建 QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 分钟
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="crm-theme">
        <RouterProvider router={router} />
        <Toaster richColors position="top-right" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
```

### 6.2 main.tsx 更新

```tsx
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n'; // 国际化配置
import './index.css'; // 全局样式

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

### 6.3 Provider 层级结构

新项目的 Provider 嵌套顺序：

```
React.StrictMode (main.tsx)
└── QueryClientProvider (TanStack Query)
    └── ThemeProvider (shadcn/ui 主题)
        └── I18nextProvider (i18n，可选自动注入)
            └── RouterProvider
                └── MainLayout
                    └── Outlet (页面内容)
```

---

## 7. 样式系统迁移

### 7.1 原项目样式结构

```
src/styles/
├── antdTheme.ts         # Ant Design 主题配置
├── design-tokens.css    # 设计令牌（颜色、间距）
├── tokens.ts            # TypeScript 令牌常量
├── global.css           # 全局样式
├── animations.css       # 动画效果
├── effects.css          # 视觉效果
├── typography.css       # 字体排版
├── breakpoints.ts       # 响应式断点
├── customer-effects.css # 客户特定效果
```

**原项目特点：**
- Ant Design 主题定制
- CSS 变量定义设计令牌
- 全局样式覆盖
- 自定义动画和效果

### 7.2 新项目样式方案

新项目使用 Tailwind CSS + shadcn/ui：

#### 7.2.1 Tailwind 配置

```ts
// tailwind.config.ts
import type { Config } from 'tailwindwind';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // 从原项目设计令牌映射
        primary: {
          DEFAULT: '#1890ff',
          50: '#e6f7ff',
          100: '#bae7ff',
          500: '#1890ff',
          600: '#096dd9',
          700: '#0050b3',
        },
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
      },
      spacing: {
        // 从原项目 tokens.ts 映射
        'sidebar-expanded': '256px',
        'sidebar-collapsed': '64px',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
```

#### 7.2.2 全局 CSS

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}

/* 自定义动画（从原项目迁移） */
@layer utilities {
  .animate-fade-in {
    animation: fadeIn 0.2s ease-in-out;
  }
  
  .animate-slide-in {
    animation: slideIn 0.3s ease-out;
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}
```

### 7.3 迁移策略

| 原样式类型 | 迁移方案 |
|------------|----------|
| `antdTheme.ts` | 使用 Tailwind 配置替代，删除文件 |
| `tokens.ts` | 映射到 Tailwind theme.extend |
| `global.css` | 合并到 index.css，使用 @layer base |
| `animations.css` | 使用 tailwindcss-animate 插件 |
| `effects.css` | 用 Tailwind classes 替代（blur、shadow 等） |
| `typography.css` | Tailwind typography 配置 |
| `breakpoints.ts` | Tailwind screens 配置 |

### 7.4 迁移步骤

1. **保留有用的设计令牌**
   ```bash
   # 创建 tokens 目录
   mkdir -p src/lib
   
   # 创建设计令牌文件
   # 将原项目的颜色、间距映射到 Tailwind
   ```

2. **删除 Ant Design 特定样式**
   ```bash
   # 不需要迁移
   rm src/styles/antdTheme.ts
   ```

3. **整合动画效果**
   ```bash
   npm install tailwindcss-animate
   ```

4. **更新 Tailwind 配置**
   - 添加自定义颜色（从原项目映射）
   - 配置响应式断点
   - 添加自定义动画

---

## 8. 状态管理迁移

### 8.1 原项目 Store 结构

```
src/store/
├── customObjects.ts   # 自定义对象状态管理
└── workflows.ts       # 工作流状态管理
```

**特点：**
- 使用 Zustand + persist 中间件
- 支持本地持久化存储
- 复杂的 CRUD 操作
- 关联数据管理

### 8.2 新项目状态管理方案

新项目已有 TanStack Query 用于服务端状态，但本地状态管理仍需 Zustand。

#### 方案一：直接复制迁移

```bash
# 创建 store 目录
mkdir -p src/store

# 复制文件
cp ../crm2026-4-3new/src/store/*.ts src/store/
```

#### 方案二：整合 TanStack Query

将服务端数据迁移到 TanStack Query：

```tsx
// src/hooks/useCustomObjects.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customObjectService } from '@/services/customObjectService';

export function useCustomObjects() {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['customObjects'],
    queryFn: customObjectService.getAll,
  });
}

export function useCreateCustomObject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: customObjectService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customObjects'] });
    },
  });
}
```

### 8.3 迁移步骤

1. **安装 Zustand**
   ```bash
   npm install zustand
   ```

2. **复制 Store 文件**
   ```bash
   mkdir -p src/store
   cp ../crm2026-4-3new/src/store/*.ts src/store/
   ```

3. **更新导入路径**
   ```tsx
   // 将 Ant Design 相关导入替换为 shadcn/ui
   // 例如：
   // import { message } from 'antd'; → import { toast } from 'sonner';
   ```

4. **创建 Hooks 包装**
   ```tsx
   // src/hooks/useCustomObjectsStore.ts
   export { useCustomObjectsStore } from '@/store/customObjects';
   export { useWorkflowsStore } from '@/store/workflows';
   ```

---

## 9. 服务层迁移

### 9.1 原项目 Services 结构

```
src/services/
├── callcenterService.ts   # 呼叫中心服务
├── customFieldService.ts  # 自定义字段服务
├── knowledgeService.ts    # 知识库服务
├── pricebookService.ts    # 价格表服务
├── productService.ts      # 产品服务
└── ticketService.ts       # 工单服务
```

### 9.2 新项目服务层方案

新项目已有 `src/lib/` 目录用于 Axios 配置。

#### 9.2.1 创建 Services 目录

```bash
mkdir -p src/services
```

#### 9.2.2 基础 Axios 配置

```tsx
// src/lib/axios.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 处理未授权
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

#### 9.2.3 服务文件示例

```tsx
// src/services/productService.ts
import { apiClient } from '@/lib/axios';
import type { Product, ProductListResponse } from '@/types/product';

export const productService = {
  getAll: async (params?: { page?: number; pageSize?: number; search?: string }) => {
    const response = await apiClient.get<ProductListResponse>('/products', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },

  create: async (data: Omit<Product, 'id'>) => {
    const response = await apiClient.post<Product>('/products', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Product>) => {
    const response = await apiClient.put<Product>(`/products/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await apiClient.delete(`/products/${id}`);
  },
};
```

### 9.3 迁移步骤

1. **复制服务文件**
   ```bash
   cp ../crm2026-4-3new/src/services/*.ts src/services/
   ```

2. **更新 API 客户端引用**
   ```tsx
   // 将原项目的 axios 引用替换为新项目的 apiClient
   import { apiClient } from '@/lib/axios';
   ```

3. **创建 TanStack Query Hooks**
   ```tsx
   // src/hooks/useProducts.ts
   import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
   import { productService } from '@/services/productService';

   export function useProducts(params?: { page?: number; pageSize?: number }) {
     return useQuery({
       queryKey: ['products', params],
       queryFn: () => productService.getAll(params),
     });
   }

   export function useProduct(id: string) {
     return useQuery({
       queryKey: ['product', id],
       queryFn: () => productService.getById(id),
       enabled: !!id,
     });
   }

   export function useCreateProduct() {
     const queryClient = useQueryClient();
     return useMutation({
       mutationFn: productService.create,
       onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['products'] });
       },
     });
   }
   ```

---

## 10. 完整迁移计划

### 10.1 阶段划分

| 阶段 | 任务 | 时间估计 | 优先级 |
|------|------|----------|--------|
| Phase 1 | 基础架构迁移 | 2-3 天 | P0 |
| Phase 2 | 核心页面迁移 | 5-7 天 | P0 |
| Phase 3 | 设置模块迁移 | 3-4 天 | P1 |
| Phase 4 | AI 模块迁移 | 3-4 天 | P1 |
| Phase 5 | 报表模块迁移 | 2-3 天 | P1 |
| Phase 6 | 营销/集成模块 | 2-3 天 | P2 |
| Phase 7 | 组件优化 | 2-3 天 | P2 |
| Phase 8 | 测试与修复 | 3-5 天 | P1 |

### 10.2 Phase 1：基础架构迁移（2-3 天）

#### Day 1：布局和路由
- [ ] 创建 `src/components/layout/` 目录
- [ ] 实现 `MainLayout.tsx`
- [ ] 实现 `Sidebar.tsx`
- [ ] 实现 `Header.tsx`
- [ ] 实现 `SettingsLayout.tsx`
- [ ] 创建 `src/routes/index.tsx`
- [ ] 配置基础路由

#### Day 2：国际化和服务层
- [ ] 安装 i18next 相关依赖
- [ ] 创建 `src/i18n/` 目录
- [ ] 复制翻译文件
- [ ] 配置 i18n
- [ ] 创建 `src/services/` 目录
- [ ] 复制服务文件
- [ ] 配置 Axios 客户端

#### Day 3：状态管理和入口文件
- [ ] 安装 Zustand
- [ ] 复制 Store 文件
- [ ] 重写 `App.tsx`
- [ ] 更新 `main.tsx`
- [ ] 配置 Provider 层级
- [ ] 测试基础架构

### 10.3 Phase 2：核心页面迁移（5-7 天）

#### Day 1-2：客户管理
- [ ] ActivityList.tsx
- [ ] ActivityForm.tsx
- [ ] ActivityReport.tsx

#### Day 3：报价管理
- [ ] QuoteDetail.tsx
- [ ] QuoteNew.tsx
- [ ] quotes/QuoteBuilder.tsx

#### Day 4-5：系统管理
- [ ] Roles.tsx
- [ ] Users.tsx
- [ ] PermissionSettings.tsx

#### Day 6-7：销售预测
- [ ] SalesForecast.tsx
- [ ] CustomerSegmentation.tsx

### 10.4 Phase 3：设置模块迁移（3-4 天）

#### Day 1：基础设置
- [ ] settings/Profile.tsx
- [ ] settings/ChangePassword.tsx
- [ ] settings/NotificationPreferences.tsx
- [ ] settings/DisplayPreferences.tsx

#### Day 2：日志管理
- [ ] settings/AuditLog.tsx
- [ ] settings/LoginLog.tsx

#### Day 3：自定义对象
- [ ] settings/CustomFields.tsx
- [ ] settings/CustomObjects.tsx
- [ ] settings/CreateCustomObject.tsx
- [ ] settings/ObjectConfig.tsx

#### Day 4：高级设置
- [ ] settings/ObjectData.tsx
- [ ] settings/ObjectFields.tsx
- [ ] settings/ObjectRelationships.tsx
- [ ] settings/ViewManager.tsx
- [ ] settings/PipelineManager.tsx

### 10.5 Phase 4：AI 模块迁移（3-4 天）

#### Day 1：智能分析
- [ ] LeadAssignment.tsx
- [ ] LeadScoring.tsx
- [ ] CustomerSegmentation.tsx

#### Day 2：预测功能
- [ ] ChurnWarning.tsx
- [ ] PredictiveAI.tsx
- [ ] SalesForecast.tsx

#### Day 3：AI 代理
- [ ] AIAgents.tsx
- [ ] AgentDetail.tsx
- [ ] MeetingAssistant.tsx

### 10.6 Phase 5：报表模块迁移（2-3 天）

#### Day 1：销售报表
- [ ] SalesFunnelReport.tsx
- [ ] PerformanceReport.tsx
- [ ] LeadConversionReport.tsx

#### Day 2：其他报表
- [ ] CustomerReport.tsx
- [ ] ActivityReport.tsx
- [ ] PaymentReport.tsx

### 10.7 Phase 6：营销/集成模块（2-3 天）

#### Day 1：营销模块
- [ ] EmailTemplates.tsx
- [ ] TargetLists.tsx

#### Day 2：集成模块
- [ ] tickets/TicketList.tsx
- [ ] knowledge/KnowledgeSearch.tsx
- [ ] callcenter/OutboundTasks.tsx

#### Day 3：工作流模块
- [ ] settings/WorkflowEditor.tsx
- [ ] settings/WorkflowList.tsx
- [ ] settings/WorkflowLogs.tsx

### 10.8 Phase 7：工作台组件优化（2-3 天）

#### Day 1：核心组件
- [ ] workbench/components/TodayTodo.tsx
- [ ] workbench/components/QuickActions.tsx
- [ ] workbench/components/Performance.tsx

#### Day 2：AI 组件
- [ ] workbench/components/AIAssistant.tsx
- [ ] workbench/components/AIRecommendation.tsx
- [ ] workbench/components/WinPredictionCard.tsx

#### Day 3：辅助组件
- [ ] workbench/components/CreateModal.tsx
- [ ] settings/FormDesigner.tsx
- [ ] settings/PageBuilder.tsx

### 10.9 Phase 8：测试与修复（3-5 天）

#### Day 1-2：功能测试
- [ ] 测试所有页面路由
- [ ] 测试国际化切换
- [ ] 测试表单提交
- [ ] 测试数据操作

#### Day 3-4：样式调整
- [ ] 检查样式一致性
- [ ] 修复布局问题
- [ ] 优化响应式设计

#### Day 5：性能优化
- [ ] 检查懒加载效果
- [ ] 优化组件渲染
- [ ] 减少不必要的重渲染

---

## 11. 风险识别

### 11.1 技术风险

| 风险 | 影响 | 解决方案 |
|------|------|----------|
| **Ant Design → shadcn/ui 组件差异** | API 不兼容，需大量重构 | 创建兼容层组件，封装常用 API |
| **样式系统迁移** | CSS 变量和 Ant Design 主题不兼容 | 使用 Tailwind CSS 重新定义设计令牌 |
| **图表组件迁移** | Ant Design Charts → Recharts | 需要重新实现图表逻辑 |
| **Form 表单系统** | Ant Design Form → React Hook Form + Zod | 重新定义表单验证逻辑 |
| **Modal/Dialog 系统** | API 差异导致调用方式变化 | 统一使用 shadcn/ui Dialog + Sonner |

### 11.2 功能风险

| 风险 | 影响 | 解决方案 |
|------|------|----------|
| **DataTable 高级功能** | 复杂表格功能可能丢失 | 确保 TanStack Table 完整支持 |
| **自定义对象系统** | 动态表单生成复杂 | 分阶段迁移，先核心功能 |
| **工作流编辑器** | 流程图组件依赖特定库 | 评估是否保留 ReactFlow 或替换 |
| **国际化覆盖** | 翻译文本不完整 | 迁移后补充缺失翻译 |

### 11.3 迁移风险

| 风险 | 影响 | 解决方案 |
|------|------|----------|
| **页面数量多** | 44 个页面需迁移 | 分阶段执行，优先核心页面 |
| **组件依赖复杂** | 组件间引用关系复杂 | 先迁移基础组件，再迁移依赖组件 |
| **时间估算不准** | 实际时间可能超出预期 | 建立缓冲时间，并行迁移 |
| **测试覆盖不足** | 迁移后功能缺失 | 每阶段完成后进行功能测试 |

### 11.4 应对策略

#### 策略 1：创建兼容层

```tsx
// src/components/compat/AntdCompat.tsx
// 提供 Ant Design API 兼容的组件封装

export function compatTable(props: AntdTableProps) {
  // 将 Ant Design Table API 转换为 TanStack Table
  return <DataTable {...convertProps(props)} />;
}
```

#### 筂略 2：分阶段并行迁移

- 多人并行迁移不同模块
- 核心页面优先
- 设置页面可以延后

#### 策略 3：增量验证

- 每迁移一个页面，立即测试
- 发现问题立即修复
- 不积累问题

#### 策略 4：保留原项目引用

- 迁移期间保留原项目
- 随时可以对比参考
- 确保功能一致性

### 11.5 依赖检查清单

迁移前需要确认以下依赖已安装：

```bash
# 核心依赖
npm install react-router-dom
npm install @tanstack/react-query
npm install @tanstack/react-table
npm install react-hook-form @hookform/resolvers zod
npm install zustand
npm install i18next react-i18next i18next-browser-languagedetector
npm install axios

# UI 组件依赖
npm install lucide-react
npm install tailwindcss-animate
npm install class-variance-authority clsx tailwind-merge

# 图表依赖（可选）
npm install recharts

# Toast 通知
npm install sonner
```

---

## 附录

### A. 文件对照表

| 原文件 | 新位置 | 状态 |
|--------|--------|------|
| `src/routes/index.tsx` | `src/routes/index.tsx` | 待创建 |
| `src/components/Layout/MainLayout.tsx` | `src/components/layout/MainLayout.tsx` | 待创建 |
| `src/i18n/index.ts` | `src/i18n/index.ts` | 待创建 |
| `src/store/*.ts` | `src/store/*.ts` | 待复制 |
| `src/services/*.ts` | `src/services/*.ts` | 待复制 |

### B. 关键类型定义

```ts
// src/types/common.ts
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
```

### C. 参考资源

- [shadcn/ui 文档](https://ui.shadcn.com/)
- [TanStack Table 文档](https://tanstack.com/table)
- [TanStack Query 文档](https://tanstack.com/query)
- [React Hook Form 文档](https://react-hook-form.com/)
- [Zod 文档](https://zod.dev/)
- [Tailwind CSS 文档](https://tailwindcss.com/)
- [lucide-react 图标库](https://lucide.dev/)

---

**文档结束**

> 本文档为 CRM 系统前端迁移的完整方案，涵盖了从基础架构到具体页面迁移的所有细节。建议按照分阶段计划执行，确保每阶段完成后进行充分测试。