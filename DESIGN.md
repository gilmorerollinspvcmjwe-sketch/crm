# CRM Design System v2.0

> 企业级客户关系管理系统设计系统
> Enterprise CRM Design System
> 
> **版本**: 2.0.0  
> **最后更新**: 2026-04-10  
> **技术栈**: React 19 + TypeScript + Tailwind CSS + shadcn/ui + TanStack Table  
> **设计参考**: Linear + Vercel + HubSpot + Salesforce

---

## 📋 目录

1. [设计基础](#第一部分设计基础)
   - [设计原则](#11-设计原则)
   - [色彩系统](#12-色彩系统)
   - [字体排印](#13-字体排印)
   - [间距体系](#14-间距体系)
   - [布局网格](#15-布局网格)
   - [图标系统](#16-图标系统)

2. [基础组件规范](#第二部分基础组件规范)
   - [Button](#21-button-按钮)
   - [Input](#22-input-输入框)
   - [Textarea](#23-textarea-多行输入)
   - [Select](#24-select-选择器)
   - [Checkbox](#25-checkbox-复选框)
   - [Radio Group](#26-radio-group-单选组)
   - [Switch](#27-switch-开关)
   - [Slider](#28-slider-滑块)
   - [Dialog](#29-dialog-对话框)
   - [Sheet](#210-sheet-侧滑面板)
   - [Popover](#211-popover-弹出框)
   - [Tooltip](#212-tooltip-提示)
   - [Dropdown Menu](#213-dropdown-menu-下拉菜单)
   - [Command](#214-command-命令面板)
   - [Menu](#215-menu-菜单)
   - [Table](#216-table-表格)
   - [Card](#217-card-卡片)
   - [Badge](#218-badge-徽章)
   - [Avatar](#219-avatar-头像)
   - [Breadcrumb](#220-breadcrumb-面包屑)
   - [Tabs](#221-tabs-标签页)
   - [Accordion](#222-accordion-手风琴)
   - [Collapsible](#223-collapsible-折叠面板)
   - [Form](#224-form-表单)
   - [Label](#225-label-标签)
   - [Separator](#226-separator-分隔线)
   - [Scroll Area](#227-scroll-area-滚动区域)
   - [Progress](#228-progress-进度条)
   - [Skeleton](#229-skeleton-骨架屏)
   - [Spinner](#230-spinner-加载旋转器)
   - [Toast](#231-toast-提示框)
   - [Alert](#232-alert-警告框)
   - [Navigation Menu](#233-navigation-menu-导航菜单)

3. [业务组件规范](#第三部分业务组件规范)
   - [数据表格系列](#31-数据表格系列)
   - [详情页系列](#32-详情页系列)
   - [列表页系列](#33-列表页系列)
   - [看板系列](#34-看板系列)
   - [CPQ 组件系列](#35-cpq-组件系列)
   - [工作流组件系列](#36-工作流组件系列)
   - [Dashlet 组件系列](#37-dashlet-组件系列)
   - [AI 组件系列](#38-ai-组件系列)
   - [其他业务组件](#39-其他业务组件)

4. [页面模板规范](#第四部分页面模板规范)
   - [核心业务模块](#41-核心业务模块)
   - [扩展模块](#42-扩展模块)
   - [系统设置模块](#43-系统设置模块)

5. [交互模式](#第五部分交互模式)

6. [响应式设计](#第六部分响应式设计)

7. [无障碍设计](#第七部分无障碍设计)

8. [性能优化](#第八部分性能优化)

9. [暗黑模式](#第九部分暗黑模式)

10. [技术债务与改进计划](#第十部分技术债务与改进计划)

---

# 第一部分：设计基础

## 1.1 设计原则

### Professional 专业

体现企业级 CRM 的专业性和可信度。

| 维度 | 要求 | 实现方式 |
|------|------|----------|
| 视觉精致 | 像素级完美，细节打磨 | 统一的间距系统、精致的阴影、平滑的过渡动画 |
| 数据准确 | 数据展示规范，格式统一 | 数字格式化、日期标准化、状态颜色一致 |
| 性能稳定 | 响应快速，操作流畅 | 操作响应 <100ms，页面加载 <2s，大数据量虚拟滚动 |

**设计检查清单**：
- [ ] 所有组件间距是否符合 4px 基准
- [ ] 颜色使用是否符合语义化规范
- [ ] 动画时长是否在 150-300ms 范围
- [ ] 加载状态是否有明确的反馈

### Efficient 高效

帮助销售/客服团队快速完成工作任务。

| 策略 | 说明 | 示例 |
|------|------|------|
| 减少点击 | 常用功能一键可达 | 列表页直接内联编辑、快捷操作菜单 |
| 批量操作 | 支持多选、批量处理 | 批量分配、批量删除、批量导出 |
| 键盘导航 | 提供快捷键支持 | Cmd/Ctrl+K 搜索、J/K 上下移动、E 编辑 |
| 智能默认 | 基于场景预设默认值 | 新建客户默认状态为"潜在"、默认负责人 |

**效率指标**：
- 核心任务完成时间 < 30s
- 常用功能点击次数 ≤ 3 次
- 键盘快捷键覆盖率 ≥ 80%

### Clear 清晰

信息层次分明，功能易于发现。

**视觉层次**：
```
H1 (32px) - 页面标题
├── H2 (24px) - 模块标题
│   ├── H3 (18px) - 卡片标题
│   │   └── H4 (16px) - 子标题
│   └── Body (14px) - 正文内容
│       └── Small (13px) - 辅助文字
│           └── Caption (12px) - 说明/标签
```

**信息密度控制**：
- 列表页：舒适密度（行高 48px）
- 详情页：标准密度（行高 40px）
- 数据密集场景：紧凑密度（行高 36px）

### Consistent 一致

保持一致性降低学习成本。

| 一致性类型 | 规范 | 示例 |
|------------|------|------|
| 组件复用 | 相同功能使用相同组件 | 所有状态展示使用 Badge 组件 |
| 交互一致 | 相似操作有相似反馈 | 所有删除操作都有二次确认 |
| 术语统一 | 全系统使用统一业务术语 | "客户"、"联系人"、"商机"定义清晰 |
| 颜色语义 | 相同含义使用相同颜色 | 成功=绿色、警告=黄色、错误=红色 |

---

## 1.2 色彩系统

### 主色 Primary

参考 Linear 的紫色调，体现专业科技感。

```css
/* CSS Variables */
:root {
  --primary: 252 89% 60%;        /* hsl(252, 89%, 60%) = #5E6AD2 */
  --primary-hover: 252 89% 65%;  /* #6B77E8 */
  --primary-active: 252 89% 55%; /* #4E59C4 */
  --primary-light: 252 89% 95%;  /* #EEF0FF */
  --primary-dark: 252 89% 45%;   /* #3B42A8 */
}
```

**使用场景**：
| 场景 | 颜色 | 用法 |
|------|------|------|
| 主要按钮 | `--primary` | 页面主要操作（新建、保存） |
| 悬停状态 | `--primary-hover` | 按钮/链接悬停 |
| 激活状态 | `--primary-active` | 选中/激活状态 |
| 浅色背景 | `--primary-light` | 强调区域背景 |
| 深色强调 | `--primary-dark` | 文字强调 |

### 功能色 Functional

#### 成功 Success
```css
--success: 156 82% 46%;        /* #10B981 - 翡翠绿 */
--success-hover: 156 82% 55%;  /* #34D399 */
--success-light: 156 82% 95%;  /* #ECFDF5 */
```

#### 警告 Warning
```css
--warning: 38 92% 50%;         /* #F59E0B - 琥珀色 */
--warning-hover: 38 92% 60%;   /* #FBBF24 */
--warning-light: 38 92% 95%;   /* #FFFBEB */
```

#### 错误 Error
```css
--error: 0 84% 60%;            /* #EF4444 - 红色 */
--error-hover: 0 84% 70%;      /* #F87171 */
--error-light: 0 84% 95%;      /* #FEF2F2 */
```

#### 信息 Info
```css
--info: 217 91% 60%;           /* #3B82F6 - 蓝色 */
--info-hover: 217 91% 70%;     /* #60A5FA */
--info-light: 217 91% 95%;     /* #EFF6FF */
```

### 中性色 Neutral

参考 Vercel 的黑白极简风格。

```css
/* 文字颜色 */
--text-primary: 250 15% 4%;     /* #09090B - 95% 黑 */
--text-secondary: 250 10% 45%;  /* #71717A - 50% 灰 */
--text-tertiary: 250 10% 65%;   /* #A1A1AA - 30% 灰 */
--text-disabled: 250 10% 85%;   /* #D4D4D8 - 15% 灰 */
--text-inverse: 250 15% 98%;    /* #FAFAFA - 白色 */

/* 边框颜色 */
--border: 250 10% 90%;          /* #E4E4E7 */
--border-light: 250 10% 96%;    /* #F4F4F5 */
--border-dark: 250 10% 15%;     /* #27272A */

/* 背景颜色 */
--bg-base: 0 0% 100%;           /* #FFFFFF */
--bg-secondary: 250 15% 98%;    /* #FAFAFA */
--bg-tertiary: 250 10% 96%;     /* #F4F4F5 */
--bg-elevated: 0 0% 100%;       /* #FFFFFF */
--bg-overlay: 250 15% 0% / 50%; /* rgba(0, 0, 0, 0.5) */
```

### 状态色 Status

用于 CRM 业务状态标识。

| 状态 | Token | Hex | 使用场景 |
|------|-------|-----|----------|
| 潜在 | `--status-prospect` | `#3B82F6` | 潜在客户 |
| 活跃 | `--status-active` | `#10B981` | 活跃客户/进行中的商机 |
| 沉默 | `--status-silent` | `#F59E0B` | 沉默客户预警 |
| 流失 | `--status-lost` | `#EF4444` | 流失客户 |
| 草稿 | `--status-draft` | `#71717A` | 未提交的客户/线索/合同 |
| 已转化 | `--status-converted` | `#8B5CF6` | 已转化线索 |
| 已成交 | `--status-won` | `#10B981` | 已成交商机 |
| 已取消 | `--status-cancelled` | `#D4D4D8` | 已取消的订单/合同 |

**状态 Badge 组件示例**：
```tsx
const statusConfig: Record<CustomerStatus, { label: string; className: string }> = {
  "潜在": { label: "潜在", className: "bg-blue-100 text-blue-800 border-blue-200" },
  "活跃": { label: "活跃", className: "bg-green-100 text-green-800 border-green-200" },
  "沉默": { label: "沉默", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  "流失": { label: "流失", className: "bg-red-100 text-red-800 border-red-200" },
}

function StatusBadge({ status }: { status: CustomerStatus }) {
  const config = statusConfig[status]
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
      config.className
    )}>
      {config.label}
    </span>
  )
}
```

---

## 1.3 字体排印

### 字体家族

```css
/* 中文优先，无衬线字体 */
--font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
             'Helvetica Neue', Arial, 'Noto Sans SC', 'PingFang SC',
             'Microsoft YaHei', sans-serif;

/* 等宽字体（代码、数字、金额） */
--font-mono: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Mono',
             'Droid Sans Mono', 'Source Code Pro', monospace;
```

### 字号体系

基于 14px 基准，适合 B 端密集信息展示。

| 级别 | Token | 字号 | 行高 | 字重 | 使用场景 |
|------|-------|------|------|------|----------|
| H1 | `--text-h1` | 32px | 40px | 600 | 页面大标题 |
| H2 | `--text-h2` | 24px | 32px | 600 | 模块标题 |
| H3 | `--text-h3` | 18px | 28px | 600 | 卡片标题 |
| H4 | `--text-h4` | 16px | 24px | 600 | 子标题 |
| Body | `--text-body` | 14px | 22px | 400 | 正文内容 |
| Small | `--text-small` | 13px | 20px | 400 | 辅助文字 |
| Caption | `--text-caption` | 12px | 18px | 400 | 说明/标签 |
| Code | `--text-code` | 13px | 20px | 400 | 代码/数字 |

**Tailwind 配置**：
```js
// tailwind.config.js
module.exports = {
  theme: {
    fontSize: {
      'xs': ['12px', { lineHeight: '18px' }],
      'sm': ['13px', { lineHeight: '20px' }],
      'base': ['14px', { lineHeight: '22px' }],
      'lg': ['16px', { lineHeight: '24px' }],
      'xl': ['18px', { lineHeight: '28px' }],
      '2xl': ['24px', { lineHeight: '32px' }],
      '3xl': ['32px', { lineHeight: '40px' }],
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
}
```

### 字重规范

| 字重 | Token | 值 | 使用场景 |
|------|-------|-----|----------|
| Normal | `--font-normal` | 400 | 正文、描述文字 |
| Medium | `--font-medium` | 500 | 强调文字、按钮 |
| Semibold | `--font-semibold` | 600 | 标题、标签 |
| Bold | `--font-bold` | 700 | 重要数据、KPI |

---

## 1.4 间距体系

基于 4px 基准的间距系统，适合精密的 B 端界面。

```css
--spacing-1: 4px
--spacing-2: 8px
--spacing-3: 12px
--spacing-4: 16px
--spacing-5: 20px
--spacing-6: 24px
--spacing-8: 32px
--spacing-10: 40px
--spacing-12: 48px
--spacing-16: 64px
```

**使用规范**：

| 场景 | 间距 | 示例 |
|------|------|------|
| 组件内元素 | 2-3 (8-12px) | 图标与文字间距 |
| 卡片内边距 | 4-6 (16-24px) | Card 内容区 |
| 模块间距 | 6-8 (24-32px) | 页面模块之间 |
| 页面边距 | 4-6 (16-24px) | 页面内容与边缘 |

**Tailwind 间距类**：
```tsx
// 内边距
className="p-4"    // 16px 全方向
className="px-4"   // 16px 左右
className="py-4"   // 16px 上下
className="pt-4"   // 16px 上

// 外边距
className="m-4"    // 16px 全方向
className="mb-4"   // 16px 下
className="mt-4"   // 16px 上

// 间距
className="gap-4"  // 16px 间距
className="space-y-4"  // 垂直间距 16px
```

---

## 1.5 布局网格

### 页面布局

#### 经典 CRM 布局

```
┌────────────────────────────────────────┐
│           Header (56px)                │
├────────────┬───────────────────────────┤
│            │                           │
│  Sidebar   │    Main Content           │
│  (240px)   │                           │
│            │                           │
└────────────┴───────────────────────────┘
```

#### 三栏详情布局

参考 Linear 的详情页设计。

```
┌───────────────────────────────────────────────┐
│                  Header (56px)                │
├──────────┬──────────────────┬─────────────────┤
│          │                  │                 │
│  Left    │     Content      │     Right       │
│  (280px) │     (flex)       │     (360px)     │
│  信息卡  │     Tabs 内容    │     相关列表    │
│          │                  │                 │
└──────────┴──────────────────┴─────────────────┘
```

**DetailLayout 组件实现**：
```tsx
<DetailLayout
  header={<DetailLayoutHeader {...props} />}
  leftSidebar={
    <Card>
      {/* 核心信息卡片 */}
      <InfoCard {...customerInfo} />
      {/* 快速操作 */}
      <ActionButtons buttons={quickActions} />
    </Card>
  }
  rightSidebar={
    <>
      {/* 相关联系人 */}
      <RelatedListCard title="联系人" items={contacts} />
      {/* 相关商机 */}
      <RelatedListCard title="商机" items={opportunities} />
      {/* 待办任务 */}
      <RelatedListCard title="任务" items={tasks} />
    </>
  }
>
  {/* 主内容区 - Tabs */}
  <Tabs value={activeTab} onValueChange={setActiveTab}>
    <TabsList>
      <TabsTrigger value="overview">概览</TabsTrigger>
      <TabsTrigger value="activity">活动记录</TabsTrigger>
    </TabsList>
    <TabsContent value="overview">...</TabsContent>
    <TabsContent value="activity">...</TabsContent>
  </Tabs>
</DetailLayout>
```

### 容器宽度

```css
--container-sm: 640px    /* 小内容区 */
--container-md: 768px    /* 中等内容区 */
--container-lg: 1024px   /* 大内容区 */
--container-xl: 1280px   /* 超大内容区 */
--container-full: 100%   /* 全屏 */
```

---

## 1.6 图标系统

使用 **Lucide React** 作为统一图标库。

**安装**：
```bash
npm install lucide-react
```

**使用规范**：
```tsx
import { User, Mail, Phone, Building } from 'lucide-react'

// 标准尺寸 (16x16)
<User className="w-4 h-4" />

// 大尺寸 (20x20)
<User className="w-5 h-5" />

// 带颜色
<User className="w-4 h-4 text-primary" />

// 作为按钮图标
<Button>
  <User className="w-4 h-4 mr-2" />
  添加用户
</Button>
```

**常用图标映射**：

| 业务含义 | 图标 | 使用场景 |
|----------|------|----------|
| 用户/客户 | `User` | 客户、联系人 |
| 公司 | `Building2` | 公司信息 |
| 邮件 | `Mail` | 邮箱、发送邮件 |
| 电话 | `Phone` | 电话、拨打电话 |
| 地址 | `MapPin` | 地址、位置 |
| 时间 | `Clock` | 时间、最近联系 |
| 商机 | `Lightbulb` | 商机、创意 |
| 活动 | `Activity` | 活动记录 |
| 编辑 | `Edit` | 编辑操作 |
| 删除 | `Trash2` | 删除操作 |
| 搜索 | `Search` | 搜索框 |
| 筛选 | `Filter` | 筛选器 |
| 更多 | `MoreHorizontal` | 更多操作 |

---

# 第二部分：基础组件规范

基于 **shadcn/ui** + **Radix UI** 构建的 33 个基础组件。

## 2.1 Button 按钮

**文件路径**: `src/components/ui/button.tsx`

### 使用场景

- 触发动作（提交、保存、删除）
- 导航链接
- 切换状态

### 尺寸规格

```tsx
// XL - 重要操作
<Button size="xl">Extra Large</Button>  // h-11 px-8 text-base

// Large - 主要操作
<Button size="lg">Large</Button>  // h-10 px-6

// Default - 标准按钮
<Button size="default">Default</Button>  // h-9 px-4 py-2

// Small - 紧凑场景
<Button size="sm">Small</Button>  // h-8 px-3 text-xs

// Icon - 图标按钮
<Button size="icon" variant="ghost">
  <Edit className="w-4 h-4" />
</Button>  // h-9 w-9
```

### 变体

```tsx
// Primary - 主要操作（每页最多 1 个）
<Button variant="default">Primary</Button>

// Secondary - 次要操作
<Button variant="secondary">Secondary</Button>

// Outline - 边框按钮
<Button variant="outline">Outline</Button>

// Ghost - 幽灵按钮（悬停显示背景）
<Button variant="ghost">Ghost</Button>

// Destructive - 危险操作
<Button variant="destructive">Delete</Button>

// Link - 链接样式
<Button variant="link">Link</Button>

// Success - 成功状态
<Button variant="success">Success</Button>

// Warning - 警告状态
<Button variant="warning">Warning</Button>
```

### 状态

```tsx
// 禁用
<Button disabled>Disabled</Button>

// 加载中
<Button loading>Loading</Button>

// 激活（通过 className 实现）
<Button className="ring-2 ring-primary ring-offset-2">Active</Button>
```

### 代码示例

```tsx
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

// 主要操作按钮
<Button onClick={handleSave}>
  保存
</Button>

// 带图标的按钮
<Button variant="outline" onClick={handleExport}>
  <Download className="w-4 h-4 mr-2" />
  导出
</Button>

// 危险操作
<Button variant="destructive" onClick={handleDelete}>
  删除
</Button>

// 加载中状态
<Button loading onClick={handleSubmit}>
  提交中...
</Button>

// 图标按钮
<Button variant="ghost" size="icon" onClick={handleEdit}>
  <Edit className="w-4 h-4" />
</Button>
```

### 无障碍要求

- [ ] 按钮必须有可访问的标签（文本或 aria-label）
- [ ] 图标按钮必须添加 `aria-label`
- [ ] 禁用按钮添加 `aria-disabled="true"`
- [ ] 加载状态添加 `aria-busy="true"`

```tsx
// 图标按钮无障碍
<Button variant="ghost" size="icon" aria-label="编辑">
  <Edit className="w-4 h-4" />
</Button>

// 加载状态无障碍
<Button loading aria-busy="true">
  保存中...
</Button>
```

---

## 2.2 Input 输入框

**文件路径**: `src/components/ui/input.tsx`

### 使用场景

- 单行文本输入
- 数字输入
- 邮箱/电话输入
- 搜索框

### 尺寸规格

```tsx
<Input size="sm" />   // h-8 text-xs
<Input size="md" />   // h-9 (默认)
<Input size="lg" />   // h-10
```

### 变体

```tsx
// 默认
<Input />

// 带错误状态
<Input className="border-destructive" />

// 带成功状态
<Input className="border-success" />

// 禁用
<Input disabled />

// 只读
<Input readOnly />
```

### 代码示例

```tsx
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// 基础输入
<Input placeholder="请输入..." />

// 带标签
<div className="space-y-2">
  <Label htmlFor="email">邮箱</Label>
  <Input id="email" type="email" placeholder="name@example.com" />
</div>

// 带错误提示
<div className="space-y-2">
  <Label htmlFor="name">姓名</Label>
  <Input
    id="name"
    className="border-destructive"
    value={name}
    onChange={(e) => setName(e.target.value)}
  />
  <p className="text-xs text-destructive">姓名为必填项</p>
</div>

// 搜索框
<div className="relative">
  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
  <Input
    placeholder="搜索..."
    className="pl-9"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
</div>
```

### 无障碍要求

- [ ] 输入框必须有关联的 Label（通过 htmlFor/id）
- [ ] 错误状态使用 `aria-invalid="true"`
- [ ] 错误描述使用 `aria-describedby`
- [ ] 必填项添加 `required` 和 `aria-required="true"`

```tsx
<Input
  id="email"
  type="email"
  required
  aria-required="true"
  aria-invalid={!!error}
  aria-describedby={error ? "email-error" : undefined}
/>
{error && <p id="email-error" className="text-destructive">{error}</p>}
```

---

## 2.3 Textarea 多行输入

**文件路径**: `src/components/ui/textarea.tsx`

### 使用场景

- 多行文本输入
- 备注/描述
- 富文本替代

### 尺寸规格

```tsx
// 默认行数
<Textarea rows={4} />

// 自适应高度（需要 JS）
<Textarea className="min-h-[120px]" />
```

### 代码示例

```tsx
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

// 基础用法
<Textarea placeholder="请输入备注..." />

// 带标签
<div className="space-y-2">
  <Label htmlFor="description">描述</Label>
  <Textarea
    id="description"
    placeholder="请输入详细描述"
    rows={4}
  />
</div>

// 带字符计数
<div className="space-y-2">
  <Label htmlFor="note">备注</Label>
  <Textarea
    id="note"
    value={note}
    onChange={(e) => setNote(e.target.value)}
    maxLength={500}
    rows={4}
  />
  <p className="text-xs text-muted-foreground text-right">
    {note.length}/500
  </p>
</div>
```

### 无障碍要求

- [ ] 关联 Label
- [ ] 字符限制使用 `aria-describedby` 提示
- [ ] 必填项添加 `required`

---

## 2.4 Select 选择器

**文件路径**: `src/components/ui/select.tsx`

### 使用场景

- 单选下拉选择
- 状态选择
- 分类选择

### 尺寸规格

```tsx
<Select>
  <SelectTrigger className="h-9">Default</SelectTrigger>
  <SelectTrigger className="h-8">Small</SelectTrigger>
  <SelectTrigger className="h-10">Large</SelectTrigger>
</Select>
```

### 代码示例

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// 基础选择
<Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="选择状态" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="potential">潜在</SelectItem>
    <SelectItem value="active">活跃</SelectItem>
    <SelectItem value="silent">沉默</SelectItem>
    <SelectItem value="lost">流失</SelectItem>
  </SelectContent>
</Select>

// 带标签
<div className="space-y-2">
  <Label>负责人</Label>
  <Select value={assignee} onValueChange={setAssignee}>
    <SelectTrigger>
      <SelectValue placeholder="请选择负责人" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="li">李明</SelectItem>
      <SelectItem value="wang">王芳</SelectItem>
      <SelectItem value="chen">陈静</SelectItem>
    </SelectContent>
  </Select>
</div>

// 分组选项
<Select>
  <SelectTrigger>
    <SelectValue placeholder="选择行业" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>互联网</SelectLabel>
      <SelectItem value="saas">SaaS</SelectItem>
      <SelectItem value="ecommerce">电商</SelectItem>
    </SelectGroup>
    <SelectGroup>
      <SelectLabel>制造业</SelectLabel>
      <SelectItem value="auto">汽车</SelectItem>
      <SelectItem value="electronics">电子</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
```

### 无障碍要求

- [ ] 使用 `aria-label` 或关联 Label
- [ ] 选项组使用 `SelectGroup` + `SelectLabel`
- [ ] 占位符使用 `SelectValue`

---

## 2.5 Checkbox 复选框

**文件路径**: `src/components/ui/checkbox.tsx`

### 使用场景

- 多选
- 批量选择
- 选项开关

### 代码示例

```tsx
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

// 基础复选框
<Checkbox />

// 带标签
<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">同意条款</Label>
</div>

// 多选组
<div className="space-y-2">
  {options.map((option) => (
    <div key={option.value} className="flex items-center space-x-2">
      <Checkbox
        id={option.value}
        checked={selected.includes(option.value)}
        onCheckedChange={(checked) => {
          if (checked) {
            setSelected([...selected, option.value])
          } else {
            setSelected(selected.filter(v => v !== option.value))
          }
        }}
      />
      <Label htmlFor={option.value}>{option.label}</Label>
    </div>
  ))}
</div>

// 表格行选择
<Checkbox
  checked={row.getIsSelected()}
  onCheckedChange={(checked) => row.toggleSelected(checked === true)}
  aria-label="选择该行"
/>
```

### 无障碍要求

- [ ] 必须有关联的 Label
- [ ] 使用 `aria-checked` 状态
- [ ] 表单中的复选框组使用 `role="group"`

---

## 2.6 Radio Group 单选组

**文件路径**: `src/components/ui/radio-group.tsx`

### 使用场景

- 单选（互斥选项）
- 导出格式选择
- 视图切换

### 代码示例

```tsx
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

// 基础单选组
<RadioGroup value={format} onValueChange={setFormat}>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="excel" id="excel" />
    <Label htmlFor="excel">Excel</Label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="csv" id="csv" />
    <Label htmlFor="csv">CSV</Label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="json" id="json" />
    <Label htmlFor="json">JSON</Label>
  </div>
</RadioGroup>

// 卡片式单选
<RadioGroup value={view} onValueChange={setView} className="grid grid-cols-3 gap-4">
  {views.map((v) => (
    <Label
      key={v.value}
      className={cn(
        "flex flex-col items-center justify-between rounded-md border-2 border-muted p-4",
        view === v.value && "border-primary bg-primary/5"
      )}
    >
      <RadioGroupItem value={v.value} id={v.value} className="sr-only" />
      <v.icon className="mb-3 h-6 w-6" />
      <span className="text-sm font-medium">{v.label}</span>
    </Label>
  ))}
</RadioGroup>
```

### 无障碍要求

- [ ] 使用 `role="radiogroup"`
- [ ] 每个选项有关联的 Label
- [ ] 使用 `aria-describedby` 提供额外说明

---

## 2.7 Switch 开关

**文件路径**: `src/components/ui/switch.tsx`

### 使用场景

- 布尔值切换
- 功能开关
- 状态切换

### 代码示例

```tsx
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

// 基础开关
<Switch />

// 带标签
<div className="flex items-center space-x-2">
  <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
  <Label htmlFor="notifications">开启通知</Label>
</div>

// 设置项
<div className="flex items-center justify-between">
  <div className="space-y-0.5">
    <Label>邮件通知</Label>
    <p className="text-sm text-muted-foreground">接收系统邮件通知</p>
  </div>
  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
</div>
```

### 无障碍要求

- [ ] 使用 `role="switch"`
- [ ] 关联 Label
- [ ] 使用 `aria-checked` 状态

---

## 2.8 Slider 滑块

**文件路径**: `src/components/ui/slider.tsx`

### 使用场景

- 数值范围选择
- 评分调整
- 进度控制

### 代码示例

```tsx
import { Slider } from '@/components/ui/slider'

// 基础滑块
<Slider
  value={[score]}
  onValueChange={(v) => setScore(v[0])}
  max={100}
  step={1}
  className="w-[200px]"
/>

// 带数值显示
<div className="flex items-center gap-4">
  <Slider
    value={[probability]}
    onValueChange={(v) => setProbability(v[0])}
    max={100}
    step={5}
    className="flex-1"
  />
  <span className="w-12 text-right text-sm font-medium">{probability}%</span>
</div>

// 范围滑块
<Slider
  value={[min, max]}
  onValueChange={([min, max]) => {
    setMin(min)
    setMax(max)
  }}
  max={1000}
  step={10}
  className="w-[300px]"
/>
```

### 无障碍要求

- [ ] 使用 `aria-label` 或 `aria-labelledby`
- [ ] 使用 `aria-valuemin`, `aria-valuemax`, `aria-valuenow`
- [ ] 支持键盘操作（箭头键）

---

## 2.9 Dialog 对话框

**文件路径**: `src/components/ui/dialog.tsx`

### 使用场景

- 确认操作
- 表单弹窗
- 详情展示

### 代码示例

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

// 基础对话框
<Dialog>
  <DialogTrigger asChild>
    <Button>打开对话框</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>标题</DialogTitle>
      <DialogDescription>描述内容</DialogDescription>
    </DialogHeader>
    <div className="py-4">内容区域</div>
    <DialogFooter>
      <Button variant="outline">取消</Button>
      <Button>确认</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

// 确认删除对话框
<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>确认删除</DialogTitle>
      <DialogDescription>
        删除后数据将无法恢复，确定要删除该客户吗？
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
        取消
      </Button>
      <Button variant="destructive" onClick={handleDelete}>
        删除
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### 无障碍要求

- [ ] 使用 `DialogTrigger` 触发
- [ ] 必须有 `DialogTitle` 和 `DialogDescription`
- [ ] 按 Esc 关闭
- [ ] 焦点自动管理
- [ ] 背景添加 `aria-hidden="true"`

---

## 2.10 Sheet 侧滑面板

**文件路径**: `src/components/ui/sheet.tsx`

### 使用场景

- 侧边详情
- 筛选面板
- 设置面板

### 代码示例

```tsx
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

// 右侧滑出
<Sheet>
  <SheetTrigger asChild>
    <Button>打开侧边栏</Button>
  </SheetTrigger>
  <SheetContent side="right" className="w-[400px]">
    <SheetHeader>
      <SheetTitle>标题</SheetTitle>
      <SheetDescription>描述</SheetDescription>
    </SheetHeader>
    <div className="mt-4">内容</div>
  </SheetContent>
</Sheet>

// 筛选面板
<Sheet open={filterOpen} onOpenChange={setFilterOpen}>
  <SheetContent side="right" className="w-[320px]">
    <SheetHeader>
      <SheetTitle>高级筛选</SheetTitle>
    </SheetHeader>
    <div className="mt-6 space-y-4">
      {/* 筛选条件 */}
    </div>
  </SheetContent>
</Sheet>
```

### 无障碍要求

- [ ] 同 Dialog
- [ ] 指定 `side` 属性（top/bottom/left/right）

---

## 2.11 Popover 弹出框

**文件路径**: `src/components/ui/popover.tsx`

### 使用场景

- 悬浮提示
- 快捷操作
- 二次确认

### 代码示例

```tsx
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'

// 基础弹出
<Popover>
  <PopoverTrigger asChild>
    <Button variant="ghost" size="icon">
      <MoreHorizontal className="w-4 h-4" />
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-80">
    <div className="space-y-2">
      <h4 className="font-medium">操作菜单</h4>
      <Button variant="ghost" className="w-full justify-start">编辑</Button>
      <Button variant="ghost" className="w-full justify-start">复制</Button>
      <Button variant="destructive" className="w-full justify-start">删除</Button>
    </div>
  </PopoverContent>
</Popover>

// 删除确认
<Popover>
  <PopoverTrigger asChild>
    <Button variant="ghost" size="sm">
      <Trash2 className="w-4 h-4" />
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-auto p-4" align="end">
    <div className="flex flex-col gap-3">
      <p className="text-sm">确认删除该产品？</p>
      <div className="flex gap-2">
        <Button size="sm" variant="destructive" onClick={handleDelete}>
          确认删除
        </Button>
      </div>
    </div>
  </PopoverContent>
</Popover>
```

### 无障碍要求

- [ ] 使用 `PopoverTrigger` 触发
- [ ] 点击外部关闭
- [ ] 按 Esc 关闭

---

## 2.12 Tooltip 提示

**文件路径**: `src/components/ui/tooltip.tsx`

### 使用场景

- 图标说明
- 术语解释
- 操作提示

### 代码示例

```tsx
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

// 基础提示
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="ghost" size="icon">
        <Info className="w-4 h-4" />
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>这是提示信息</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>

// 表格列说明
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>
      <span className="border-b border-dotted border-muted-foreground cursor-help">
        客户评分
      </span>
    </TooltipTrigger>
    <TooltipContent>
      <p>根据客户活跃度、交易金额等综合计算</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

### 无障碍要求

- [ ] 使用 `TooltipProvider` 包裹
- [ ] 支持键盘聚焦触发
- [ ] 延迟显示（避免闪烁）

---

## 2.13 Dropdown Menu 下拉菜单

**文件路径**: `src/components/ui/dropdown-menu.tsx`

### 使用场景

- 行操作菜单
- 用户菜单
- 批量操作

### 代码示例

```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Edit, Trash2, Mail } from 'lucide-react'

// 行操作菜单
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
      <MoreHorizontal className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuLabel>操作</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem onClick={() => navigate(`/customers/${row.id}`)}>
      <Eye className="h-4 w-4 mr-2" />
      查看详情
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => setEditModalOpen(true)}>
      <Edit className="h-4 w-4 mr-2" />
      编辑
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => window.open(`mailto:${row.email}`)}>
      <Mail className="h-4 w-4 mr-2" />
      发送邮件
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem
      className="text-destructive"
      onClick={() => handleDelete(row.id)}
    >
      <Trash2 className="h-4 w-4 mr-2" />
      删除
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### 无障碍要求

- [ ] 使用 `DropdownMenuTrigger` 触发
- [ ] 键盘导航支持（上下箭头、Enter、Esc）
- [ ] 分组使用 `DropdownMenuLabel` + `DropdownMenuSeparator`

---

## 2.14 Command 命令面板

**文件路径**: `src/components/ui/command.tsx`

### 使用场景

- 全局搜索（Cmd+K）
- 快速选择
- 命令面板

### 代码示例

```tsx
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'

// 命令对话框
<CommandDialog open={open} onOpenChange={setOpen}>
  <CommandInput placeholder="搜索或输入命令..." />
  <CommandList>
    <CommandEmpty>未找到结果</CommandEmpty>
    <CommandGroup heading="客户">
      <CommandItem onSelect={() => navigate('/customers')}>
        <User className="w-4 h-4 mr-2" />
        客户列表
      </CommandItem>
      <CommandItem onSelect={() => setCreateModalOpen(true)}>
        <Plus className="w-4 h-4 mr-2" />
        新建客户
      </CommandItem>
    </CommandGroup>
    <CommandGroup heading="商机">
      <CommandItem onSelect={() => navigate('/opportunities')}>
        <Lightbulb className="w-4 h-4 mr-2" />
        商机列表
      </CommandItem>
    </CommandGroup>
  </CommandList>
</CommandDialog>
```

### 无障碍要求

- [ ] 支持键盘导航
- [ ] 搜索结果实时朗读
- [ ] 分组使用 `CommandGroup` + `CommandLabel`

---

## 2.15 Menu 菜单

**文件路径**: `src/components/ui/menu.tsx`

### 使用场景

- 上下文菜单
- 导航菜单

### 代码示例

```tsx
// 参考 Dropdown Menu 实现
```

---

## 2.16 Table 表格

**文件路径**: `src/components/ui/table.tsx`

### 使用场景

- 数据展示
- 简单列表

### 代码示例

```tsx
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

<Table>
  <TableCaption>客户列表</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>姓名</TableHead>
      <TableHead>公司</TableHead>
      <TableHead>邮箱</TableHead>
      <TableHead>状态</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {customers.map((customer) => (
      <TableRow key={customer.id}>
        <TableCell>{customer.name}</TableCell>
        <TableCell>{customer.company}</TableCell>
        <TableCell>{customer.email}</TableCell>
        <TableCell>
          <StatusBadge status={customer.status} />
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### 无障碍要求

- [ ] 使用语义化标签（thead/tbody/th/td）
- [ ] 添加 `scope="col"` 到表头
- [ ] 复杂表格添加 `role="grid"`

---

## 2.17 Card 卡片

**文件路径**: `src/components/ui/card.tsx`

### 使用场景

- 内容容器
- 信息卡片
- 统计卡片

### 代码示例

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

// 基础卡片
<Card>
  <CardHeader>
    <CardTitle>卡片标题</CardTitle>
    <CardDescription>卡片描述</CardDescription>
  </CardHeader>
  <CardContent>
    <p>卡片内容</p>
  </CardContent>
  <CardFooter>
    <Button>操作</Button>
  </CardFooter>
</Card>

// 统计卡片
<Card>
  <CardContent className="p-6">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-primary/10 rounded-lg">
        <Users className="w-6 h-6 text-primary" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">客户总数</p>
        <p className="text-2xl font-bold">1,234</p>
      </div>
    </div>
  </CardContent>
</Card>
```

### 无障碍要求

- [ ] 使用语义化标签
- [ ] 标题层级正确

---

## 2.18 Badge 徽章

**文件路径**: `src/components/ui/badge.tsx`

### 使用场景

- 状态展示
- 标签
- 计数

### 变体

```tsx
<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="info">Info</Badge>
```

### 代码示例

```tsx
import { Badge } from '@/components/ui/badge'

// 状态徽章
<Badge variant={status === 'active' ? 'success' : 'secondary'}>
  {status}
</Badge>

// 计数徽章
<Badge variant="secondary">
  {count}
</Badge>

// 带图标的徽章
<Badge>
  <Star className="w-3 h-3 mr-1" />
  VIP
</Badge>
```

---

## 2.19 Avatar 头像

**文件路径**: `src/components/ui/avatar.tsx`

### 使用场景

- 用户头像
- 公司 Logo
- 联系人头像

### 代码示例

```tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

// 带图片
<Avatar>
  <AvatarImage src="https://github.com/shadcn.png" alt="用户" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>

// 仅 fallback
<Avatar>
  <AvatarFallback className="bg-primary/10 text-primary">
    {name.charAt(0).toUpperCase()}
  </AvatarFallback>
</Avatar>

// 不同尺寸
<Avatar className="h-8 w-8">Small</Avatar>
<Avatar className="h-10 w-10">Default</Avatar>
<Avatar className="h-12 w-12">Large</Avatar>
<Avatar className="h-16 w-16">XL</Avatar>
```

---

## 2.20 Breadcrumb 面包屑

**文件路径**: `src/components/ui/breadcrumb.tsx`

### 使用场景

- 导航路径
- 层级展示

### 代码示例

```tsx
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">首页</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/customers">客户</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>客户详情</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

---

## 2.21 Tabs 标签页

**文件路径**: `src/components/ui/tabs.tsx`

### 使用场景

- 内容切换
- 详情 Tabs

### 代码示例

```tsx
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList>
    <TabsTrigger value="overview">概览</TabsTrigger>
    <TabsTrigger value="activity">活动</TabsTrigger>
    <TabsTrigger value="contacts">联系人</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">概览内容</TabsContent>
  <TabsContent value="activity">活动内容</TabsContent>
  <TabsContent value="contacts">联系人内容</TabsContent>
</Tabs>
```

---

## 2.22 Accordion 手风琴

**文件路径**: `src/components/ui/accordion.tsx`

### 使用场景

- 折叠内容
- FAQ

### 代码示例

```tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>标题 1</AccordionTrigger>
    <AccordionContent>内容 1</AccordionContent>
  </AccordionItem>
</Accordion>
```

---

## 2.23 Collapsible 折叠面板

**文件路径**: `src/components/ui/collapsible.tsx`

### 使用场景

- 可折叠区域
- 展开/收起

### 代码示例

```tsx
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { ChevronDown, ChevronUp } from 'lucide-react'

<Collapsible open={isOpen} onOpenChange={setIsOpen}>
  <CollapsibleTrigger asChild>
    <div className="flex items-center justify-between cursor-pointer">
      <span>标题</span>
      {isOpen ? <ChevronDown /> : <ChevronUp />}
    </div>
  </CollapsibleTrigger>
  <CollapsibleContent>
    折叠内容
  </CollapsibleContent>
</Collapsible>
```

---

## 2.24 Form 表单

**文件路径**: `src/components/ui/form.tsx`

### 使用场景

- 表单验证
- 表单布局

### 代码示例

```tsx
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'

const form = useForm({
  defaultValues: {
    name: '',
    email: '',
  },
})

<Form {...form}>
  <FormField
    control={form.control}
    name="name"
    render={({ field }) => (
      <FormItem>
        <FormLabel>姓名</FormLabel>
        <FormControl>
          <Input {...field} />
        </FormControl>
        <FormDescription>请输入真实姓名</FormDescription>
        <FormMessage />
      </FormItem>
    )}
  />
</Form>
```

---

## 2.25 Label 标签

**文件路径**: `src/components/ui/label.tsx`

### 代码示例

```tsx
import { Label } from '@/components/ui/label'

<Label htmlFor="email">邮箱</Label>
<Input id="email" type="email" />
```

---

## 2.26 Separator 分隔线

**文件路径**: `src/components/ui/separator.tsx`

### 代码示例

```tsx
import { Separator } from '@/components/ui/separator'

<Separator />  // 水平
<Separator orientation="vertical" />  // 垂直
```

---

## 2.27 Scroll Area 滚动区域

**文件路径**: `src/components/ui/scroll-area.tsx`

### 代码示例

```tsx
import { ScrollArea } from '@/components/ui/scroll-area'

<ScrollArea className="h-[400px]">
  <div>长内容</div>
</ScrollArea>
```

---

## 2.28 Progress 进度条

**文件路径**: `src/components/ui/progress.tsx`

### 代码示例

```tsx
import { Progress } from '@/components/ui/progress'

<Progress value={67} className="h-2" />
```

---

## 2.29 Skeleton 骨架屏

**文件路径**: `src/components/ui/skeleton.tsx`

### 代码示例

```tsx
import { Skeleton } from '@/components/ui/skeleton'

<Skeleton className="h-4 w-[200px]" />
<Skeleton className="h-4 w-[150px]" />
```

---

## 2.30 Spinner 加载旋转器

**文件路径**: `src/components/ui/spinner.tsx`

### 代码示例

```tsx
import { Spinner } from '@/components/ui/spinner'

<Spinner className="h-6 w-6" />
```

---

## 2.31 Toast 提示框

**文件路径**: `src/components/ui/toast.tsx`

### 代码示例

```tsx
import { toast } from '@/hooks/use-toast'

// 成功提示
toast({
  title: '保存成功',
  description: '客户信息已更新',
})

// 错误提示
toast({
  title: '保存失败',
  description: '请检查网络连接',
  variant: 'destructive',
})

// 成功提示（带图标）
toast({
  title: '操作成功',
  description: '数据已保存',
  className: 'bg-success/10 border-success text-success',
})
```

---

## 2.32 Alert 警告框

**文件路径**: `src/components/ui/alert.tsx`

### 代码示例

```tsx
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

<Alert>
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>警告</AlertTitle>
  <AlertDescription>这是一条警告信息</AlertDescription>
</Alert>
```

---

## 2.33 Navigation Menu 导航菜单

**文件路径**: `src/components/ui/navigation-menu.tsx`

### 代码示例

```tsx
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'

<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>客户</NavigationMenuTrigger>
      <NavigationMenuContent>
        <NavigationMenuLink href="/customers">客户列表</NavigationMenuLink>
        <NavigationMenuLink href="/customers/public-pool">公海池</NavigationMenuLink>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
```

---

# 第三部分：业务组件规范

## 3.1 数据表格系列

### DataTable

**文件路径**: `src/components/DataTable/DataTable.tsx`

**使用场景**: 列表页数据展示

**核心功能**:
- [x] 列排序
- [x] 列筛选
- [x] 列显示/隐藏
- [x] 行选择（单选/多选）
- [x] 批量操作
- [x] 分页（页码/页大小）
- [x] 数据刷新
- [x] 导出功能（Excel/CSV）
- [x] 密度切换
- [x] 全屏模式

**代码示例**:
```tsx
<DataTable
  columns={columns}
  data={filteredData}
  rowSelection={rowSelection}
  onRowSelectionChange={setRowSelection}
  density={density}
  onDensityChange={setDensity}
  showBatchActions
  batchActions={batchActions}
  showSearch={false}
  showDensityToggle={false}
  showPagination
  pageSizeOptions={[10, 20, 50]}
  defaultPageSize={10}
  emptyText="暂无客户数据"
  loading={isLoading}
  className="border rounded-lg"
/>
```

**密度规格**:
| 密度 | 行高 | 使用场景 |
|------|------|----------|
| Comfortable | 56px | 宽松展示、详情预览 |
| Default | 48px | 标准展示（默认） |
| Compact | 40px | 密集数据展示 |

### VirtualDataTable

**使用场景**: 大数据量（1000+ 行）

**特性**:
- 虚拟滚动
- 按需渲染
- 保持滚动位置

### DataTablePagination

**使用场景**: 表格分页组件

**功能**:
- 页码导航
- 页大小选择
- 总条数显示
- 跳转页码

### DataTableToolbar

**使用场景**: 表格工具栏

**功能**:
- 搜索框
- 密度切换
- 列显示控制
- 刷新按钮

### FilterBar

**文件路径**: `src/components/FilterBar/FilterBar.tsx`

**使用场景**: HubSpot 风格高级筛选

**核心功能**:
- 基础筛选（文本、下拉、日期、数字）
- 高级筛选（AND/OR 逻辑组）
- 筛选器保存/加载
- 筛选标签显示

**代码示例**:
```tsx
<FilterBar
  filters={customerFilters}
  onFilterChange={handleFilterChange}
  onAdvancedFilterChange={handleAdvancedFilterChange}
  onReset={handleFilterReset}
  loading={isFilterLoading}
  showCollapse={true}
  defaultShowCount={3}
  showFilterTags={true}
  enableSave={true}
  storageKey="crm_customer_filters"
  enableAdvancedFilter={true}
  advancedFilterFields={customerAdvancedFilterFields}
/>
```

**操作符**:
```typescript
type Operator = 
  | 'eq'        // 等于
  | 'neq'       // 不等于
  | 'contains'  // 包含
  | 'startsWith'
  | 'endsWith'
  | 'in'        // 在...中
  | 'notIn'     // 不在...中
  | 'gt'        // 大于
  | 'lt'        // 小于
  | 'gte'       // 大于等于
  | 'lte'       // 小于等于
  | 'between'   // 之间
```

### FilterBuilder

**使用场景**: 自定义筛选条件构建器

---

## 3.2 详情页系列

### DetailLayout

**文件路径**: `src/components/Layout/DetailLayout.tsx`

**使用场景**: 三栏详情布局（参考 Linear）

**结构**:
```tsx
<DetailLayout
  header={<DetailLayoutHeader {...props} />}
  leftSidebar={
    <Card>
      <InfoCard {...customerInfo} />
      <ActionButtons buttons={quickActions} />
    </Card>
  }
  rightSidebar={
    <>
      <RelatedListCard title="联系人" items={contacts} />
      <RelatedListCard title="商机" items={opportunities} />
    </>
  }
>
  <Tabs value={activeTab} onValueChange={setActiveTab}>
    <TabsList>...</TabsList>
    <TabsContent value="overview">...</TabsContent>
  </Tabs>
</DetailLayout>
```

### DetailTabs

**使用场景**: 详情页 Tabs 切换

### InfoCard

**文件路径**: `src/components/DetailSidebar/InfoCard.tsx`

**使用场景**: 实体信息卡片

**特性**:
- Avatar + 名称 + 状态 Badge
- 可配置字段列表
- 编辑按钮
- 图标映射

**代码示例**:
```tsx
<InfoCard
  avatarUrl={customer.avatarUrl}
  name={customer.name}
  subtitle={customer.company}
  headerBadges={[{ label: customer.status, variant: 'success' }]}
  fields={[
    { key: 'email', value: customer.email, icon: <Mail /> },
    { key: 'phone', value: customer.phone, icon: <Phone /> },
    { key: 'industry', value: customer.industry, icon: <Building /> },
  ]}
  onEdit={() => setEditModalOpen(true)}
  showEdit={true}
/>
```

### RelatedListCard

**使用场景**: 相关列表卡片

**特性**:
- 可折叠
- 最多显示 5 条预览
- "查看全部"链接

### ActionButtons

**文件路径**: `src/components/DetailSidebar/ActionButtons.tsx`

**使用场景**: 快速操作按钮组

**预设配置**:
```tsx
const customerActionButtons: ActionButtonConfig[] = [
  { key: 'edit', label: 'common.edit' },
  { key: 'assign', label: 'common.assign' },
  { key: 'separator', label: '' },
  { key: 'newDeal', label: 'customer.detail.actions.newDeal' },
  { key: 'newContact', label: 'customer.detail.actions.newContact' },
  { key: 'followUp', label: 'customer.detail.actions.followUp' },
  { key: 'separator', label: '' },
  { key: 'returnToPool', label: 'customer.detail.actions.returnToPool' },
  { key: 'export', label: 'customer.detail.actions.export' },
  { key: 'delete', label: 'common.delete', danger: true },
]
```

---

## 3.3 列表页系列

### ListPageContainer

**文件路径**: `src/components/ListPage/ListPageContainer.tsx`

**使用场景**: 统一列表页布局

**代码示例**:
```tsx
<ListPageContainer
  title="客户管理"
  subtitle="管理所有客户信息"
  actions={[
    { label: '新增客户', icon: Plus, onClick: () => setCreateModalOpen(true) },
    { label: '导出全部', icon: Download, variant: 'outline', onClick: handleExportAll },
  ]}
  stats={
    <>
      <span>共 <strong>{filteredData.length}</strong> 条记录</span>
      {selectedCount > 0 && <Badge>已选择 {selectedCount} 项</Badge>}
    </>
  }
  filters={<FilterBar {...filterProps} />}
>
  <DataTable {...tableProps} />
</ListPageContainer>
```

### PageContainer

**使用场景**: 通用页面容器

---

## 3.4 看板系列

### KanbanBoard

**文件路径**: `src/components/Kanban/KanbanBoard.tsx`

**使用场景**: 商机看板、任务看板

**特性**:
- 拖拽排序（@hello-pangea/dnd）
- 列筛选
- 搜索过滤
- 视图保存

**代码示例**:
```tsx
<KanbanBoard
  columns={kanbanColumns}
  onCardClick={handleCardClick}
  onCardMove={handleCardMove}
  onAddCard={handleAddCard}
  onSaveView={handleSaveView}
/>
```

### KanbanColumn

**使用场景**: 看板列

### KanbanCard

**使用场景**: 看板卡片

---

## 3.5 CPQ 组件系列

### QuoteCalculator

**文件路径**: `src/components/CPQ/QuoteCalculator.tsx`

**使用场景**: 报价计算器

**特性**:
- 产品列表
- 数量/折扣编辑
- 阶梯定价
- 税费计算
- 总计汇总

**代码示例**:
```tsx
<QuoteCalculator
  products={quoteItems}
  onChange={handleQuoteChange}
  readonly={false}
/>
```

### ProductSelector

**使用场景**: 产品选择器

### FieldBuilder

**使用场景**: 字段构建器

### FieldRenderer

**使用场景**: 字段渲染器

### LayoutEditor

**使用场景**: 布局编辑器

### RecordTable

**使用场景**: 记录表格

### ObjectCard

**使用场景**: 对象卡片

---

## 3.6 工作流组件系列

### WorkflowVisualizer

**使用场景**: 工作流可视化

### NodePanel

**使用场景**: 节点面板

### PropertyPanel

**使用场景**: 属性面板

### ConditionBuilder

**使用场景**: 条件构建器

### TriggerConfig

**使用场景**: 触发器配置

### ActionConfig

**使用场景**: 动作配置

### StepCard

**使用场景**: 步骤卡片

### ExecutionTimeline

**使用场景**: 执行时间线

---

## 3.7 Dashlet 组件系列

### KPIDashlet

**文件路径**: `src/components/Dashlets/KPIDashlet.tsx`

**使用场景**: KPI 指标卡片

**代码示例**:
```tsx
<KPIDashlet
  config={{ id: '1', title: '客户总数', description: 'Total Customers' }}
  data={{
    value: 1234,
    change: 12.5,
    trend: 'up',
    format: 'number',
  }}
  icon={<Users className="w-6 h-6" />}
/>
```

### ChartDashlet

**使用场景**: 图表卡片

### ListDashlet

**使用场景**: 列表卡片

### TableDashlet

**使用场景**: 表格卡片

### CalendarDashlet

**使用场景**: 日历卡片

### NewsDashlet

**使用场景**: 新闻卡片

### DashletContainer

**使用场景**: Dashlet 容器

---

## 3.8 AI 组件系列

### AIContentGenerator

**使用场景**: AI 内容生成

### AIInteractionAnalysis

**使用场景**: AI 交互分析

### AIRelationshipChange

**使用场景**: AI 关系变更

### AISmartSuggestions

**使用场景**: AI 智能建议

### CustomerSummaryAI

**使用场景**: AI 客户摘要

### RiskAlertAI

**使用场景**: AI 风险预警

---

## 3.9 其他业务组件

### Timeline

**使用场景**: 时间线

### Steps

**使用场景**: 步骤条

### RichTextEditor

**使用场景**: 富文本编辑器

### GlobalSearchDialog

**使用场景**: 全局搜索

### NotificationCenter

**使用场景**: 通知中心

### PermissionMatrix

**使用场景**: 权限矩阵

---

# 第四部分：页面模板规范

## 4.1 核心业务模块

### 客户管理（9 个页面）

| 路径 | 组件 | 用途 | 核心组件 |
|------|------|------|----------|
| `/customers` | CustomerList | 客户列表 | DataTable, FilterBar |
| `/customers/:id` | CustomerDetail | 客户详情 | DetailLayout, InfoCard, Tabs |
| `/customers/public-pool` | HighSeasPool | 公海池 | DataTable, FilterBar |
| `/contacts` | ContactPersonList | 联系人列表 | DataTable |
| `/contacts/:id` | ContactPersonDetail | 联系人详情 | DetailLayout |

### 线索管理（2 个页面）

| 路径 | 组件 | 用途 |
|------|------|------|
| `/leads` | LeadList | 线索列表 |
| `/leads/:id` | LeadDetail | 线索详情 |

### 商机管理（3 个页面）

| 路径 | 组件 | 用途 | 核心组件 |
|------|------|------|----------|
| `/opportunities` | OpportunityList | 商机列表 | DataTable |
| `/opportunities/kanban` | OpportunityKanban | 商机看板 | KanbanBoard |
| `/opportunities/:id` | OpportunityDetail | 商机详情 | DetailLayout |

### 跟进记录（3 个页面）

| 路径 | 组件 | 用途 |
|------|------|------|
| `/activities` | ActivityList | 活动列表 |
| `/activities/:id` | ActivityDetail | 活动详情 |
| `/activities/new` | ActivityForm | 新建活动 |

### 订单管理（2 个页面）

| 路径 | 组件 | 用途 |
|------|------|------|
| `/orders` | OrderList | 订单列表 |
| `/orders/:id` | OrderDetail | 订单详情 |

### 合同管理（2 个页面）

| 路径 | 组件 | 用途 |
|------|------|------|
| `/contracts` | ContractList | 合同列表 |
| `/contracts/:id` | ContractDetail | 合同详情 |

### 回款管理（4 个页面）

| 路径 | 组件 | 用途 |
|------|------|------|
| `/payments` | PaymentList | 回款列表 |
| `/payments/:id` | PaymentDetail | 回款详情 |
| `/payment-records` | PaymentRecordList | 回款记录列表 |
| `/payment-records/:id` | PaymentRecordDetail | 回款记录详情 |

### 产品与定价（6 个页面）

| 路径 | 组件 | 用途 |
|------|------|------|
| `/products` | ProductList | 产品列表 |
| `/products/:id` | ProductDetail | 产品详情 |
| `/products/new` | ProductFormPage | 新建产品 |
| `/products/:id/edit` | ProductFormPage | 编辑产品 |
| `/pricebooks` | PricebookList | 价格本列表 |
| `/pricebooks/:id` | PricebookDetail | 价格本详情 |

### 报价管理（3 个页面）

| 路径 | 组件 | 用途 | 核心组件 |
|------|------|------|----------|
| `/quotes` | QuoteList | 报价列表 | DataTable |
| `/quotes/:id` | QuoteDetail | 报价详情 | DetailLayout, QuoteCalculator |
| `/quotes/new` | QuoteForm | 新建报价 | QuoteCalculator |

### 报表中心（11 个页面）

| 路径 | 组件 | 用途 |
|------|------|------|
| `/reports` | ReportList | 报表列表 |
| `/reports/dashboard` | ReportDashboard | 报表仪表板 |
| `/reports/builder` | ReportBuilder | 报表构建器 |
| `/reports/schedule` | ReportSchedule | 报表调度 |
| `/reports/export` | ReportExport | 报表导出 |
| `/reports/:id` | ReportDetail | 报表详情 |
| `/reports/funnel` | SalesFunnelReport | 销售漏斗 |
| `/reports/performance` | PerformanceReport | 业绩报表 |
| `/reports/customer` | CustomerReport | 客户报表 |
| `/reports/activity` | ActivityReport | 活动报表 |
| `/reports/lead-conversion` | LeadConversionReport | 线索转化 |
| `/reports/payment` | PaymentReport | 回款报表 |

## 4.2 扩展模块

### AI 功能（13 个页面）

| 路径 | 组件 | 用途 |
|------|------|------|
| `/ai/config` | AIConfig | AI 配置 |
| `/ai/history` | AIHistory | AI 历史 |
| `/ai/prompts` | AIPromptTemplates | 提示词模板 |
| `/ai/assistant` | AIAssistant | AI 助手 |
| `/ai/dashboard` | AIDashboard | AI 仪表板 |
| `/ai/analytics` | AIAnalytics | AI 分析 |
| `/ai/models` | AIModels | AI 模型 |
| `/ai/usage` | AIUsage | AI 使用量 |
| `/ai/lead-assignment` | LeadAssignment | 线索分配 |
| `/ai/lead-scoring` | LeadScoring | 线索评分 |
| `/ai/sales-forecast` | SalesForecast | 销售预测 |
| `/ai/customer-segmentation` | CustomerSegmentation | 客户分群 |
| `/ai/churn-warning` | ChurnWarning | 流失预警 |
| `/ai/meeting-assistant` | MeetingAssistant | 会议助手 |
| `/ai/predictive` | PredictiveAI | 预测 AI |
| `/ai/agents` | AIAgents | AI 代理列表 |
| `/ai/agents/:id` | AgentDetail | AI 代理详情 |

### 营销自动化（5 个页面）

| 路径 | 组件 | 用途 |
|------|------|------|
| `/marketing/campaigns` | CampaignList | 活动列表 |
| `/marketing/campaign/:id` | CampaignDetail | 活动详情 |
| `/marketing/email-templates` | EmailList | 邮件模板 |
| `/marketing/email/:id` | EmailDetail | 邮件详情 |
| `/marketing/target-lists` | TargetLists | 目标列表 |

### 工作流引擎（5 个页面）

| 路径 | 组件 | 用途 | 核心组件 |
|------|------|------|----------|
| `/workflows` | WorkflowEngineList | 工作流列表 | DataTable |
| `/workflows/builder` | WorkflowEngineBuilder | 工作流构建器 | WorkflowVisualizer |
| `/workflows/:id` | WorkflowEngineDetail | 工作流详情 | DetailLayout |
| `/workflows/:id/edit` | WorkflowEngineBuilder | 编辑工作流 | WorkflowVisualizer |
| `/workflows/executions` | WorkflowEngineExecutions | 执行记录 | DataTable |

### 自定义对象（4 个页面）

| 路径 | 组件 | 用途 |
|------|------|------|
| `/custom-objects` | CustomObjectList | 自定义对象列表 |
| `/custom-objects/builder/:objectId` | CustomObjectBuilder | 对象构建器 |
| `/custom-objects/settings/:objectId` | CustomObjectSettings | 对象设置 |
| `/custom-objects/:objectId` | CustomObjectDetail | 对象记录详情 |

## 4.3 系统设置模块

### 个人设置（4 个页面）

| 路径 | 组件 | 用途 |
|------|------|------|
| `/settings/profile` | ProfileSettings | 个人资料 |
| `/settings/security` | SecuritySettings | 安全设置 |
| `/settings/preferences` | PreferencesSettings | 偏好设置 |
| `/settings/notifications` | NotificationSettings | 通知设置 |

### 系统配置（6 个页面）

| 路径 | 组件 | 用途 |
|------|------|------|
| `/settings/email` | EmailSettings | 邮件设置 |
| `/settings/integrations` | IntegrationSettings | 集成设置 |
| `/settings/workflows` | WorkflowSettings | 工作流设置 |
| `/settings/fields` | FieldSettings | 字段设置 |
| `/settings/layout` | LayoutSettings | 布局设置 |
| `/settings/theme` | ThemeSettings | 主题设置 |

### 数据管理（2 个页面）

| 路径 | 组件 | 用途 |
|------|------|------|
| `/settings/data-backup` | DataBackupSettings | 数据备份 |
| `/settings/import-export` | ImportExportSettings | 导入导出 |

### API & 集成（2 个页面）

| 路径 | 组件 | 用途 |
|------|------|------|
| `/settings/api` | APISettings | API 设置 |
| `/settings/webhook` | WebhookSettings | Webhook 设置 |

### 安全与审计（3 个页面）

| 路径 | 组件 | 用途 |
|------|------|------|
| `/settings/audit-log` | AuditLogSettings | 审计日志 |
| `/settings/login-log` | LoginLogSettings | 登录日志 |
| `/settings/license` | LicenseSettings | 许可证设置 |

### 系统管理（3 个页面）

| 路径 | 组件 | 用途 |
|------|------|------|
| `/settings/roles` | RoleManagement | 角色管理 |
| `/settings/users` | UserManagement | 用户管理 |
| `/settings/permissions` | PermissionManagementPage | 权限管理 |

### 高级设置（4 个页面）

| 路径 | 组件 | 用途 |
|------|------|------|
| `/settings/system-info` | SystemInfo | 系统信息 |
| `/settings/customization` | CustomizationSettings | 自定义设置 |
| `/settings/mobile` | MobileSettings | 移动端设置 |
| `/settings/advanced` | AdvancedSettings | 高级设置 |

---

# 第五部分：交互模式

## 5.1 加载状态

### 页面加载

- 使用 Skeleton 骨架屏
- 显示进度指示器（>3s）
- 超时提示（>5s）

```tsx
// 页面级加载
{isLoading ? (
  <div className="flex items-center justify-center h-64">
    <Spinner className="h-8 w-8" />
  </div>
) : (
  <Content />
)}

// 骨架屏
<Skeleton className="h-4 w-[200px]" />
<Skeleton className="h-4 w-[150px]" />
```

### 局部加载

- 按钮 Loading 状态
- 表格行 Loading
- 局部骨架屏

```tsx
// 按钮加载
<Button loading onClick={handleSubmit}>
  提交中...
</Button>

// 表格加载
<DataTable loading={isLoading} emptyText="加载中..." />
```

### 数据刷新

- 下拉刷新
- 刷新按钮
- 自动刷新（可配置）

## 5.2 操作反馈

### Toast 提示

```typescript
// 成功（2-3 秒自动消失）
toast({
  title: '保存成功',
  description: '客户信息已更新',
})

// 错误（需手动关闭）
toast({
  title: '保存失败',
  description: '请检查网络连接',
  variant: 'destructive',
})

// 自定义时长
toast({
  title: '操作成功',
  duration: 5000, // 5 秒
})
```

### 确认对话框

```tsx
// 普通确认
<AlertDialog>
  <AlertDialog.Title>确认删除？</AlertDialog.Title>
  <AlertDialog.Description>
    此操作无法撤销
  </AlertDialog.Description>
</AlertDialog>

// 危险确认（红色按钮）
<AlertDialog variant="destructive">
  <AlertDialog.Title>危险操作</AlertDialog.Title>
</AlertDialog>
```

## 5.3 批量操作

**选中显示操作栏**：
```tsx
{selectedCount > 0 && (
  <BatchActionsBar count={selectedCount}>
    <Button>批量分配</Button>
    <Button>批量导出</Button>
    <Button variant="destructive">批量删除</Button>
  </BatchActionsBar>
)}
```

## 5.4 内联编辑

**触发方式**：
- 点击编辑（最常见）
- 悬停显示编辑按钮
- 双击编辑

**保存方式**：
- 失焦自动保存
- Enter 键保存
- 按钮确认保存

```tsx
<InlineEditableField
  value={customer.name}
  onChange={handleUpdate}
  type="text"
  saveOnBlur
/>
```

## 5.5 键盘快捷键

**全局快捷键**：
```typescript
const shortcuts = {
  global: {
    'cmd+k': 'openSearch',
    'cmd+/': 'openHelp',
  },
  list: {
    'j': 'nextRow',
    'k': 'prevRow',
    'x': 'selectRow',
    'a': 'selectAll',
  },
  detail: {
    'e': 'edit',
    'd': 'delete',
    'esc': 'back',
  },
}
```

## 5.6 拖拽交互

- 看板卡片拖拽
- 列表项排序
- 列宽调整

---

# 第六部分：响应式设计

## 6.1 断点定义

```css
/* 手机 */
--breakpoint-xs: 480px

/* 平板 */
--breakpoint-sm: 768px

/* 小屏桌面 */
--breakpoint-md: 992px

/* 标准桌面 */
--breakpoint-lg: 1200px

/* 大屏桌面 */
--breakpoint-xl: 1600px
```

## 6.2 导航适配

### 桌面端（≥1200px）

- 固定侧边栏（240px）
- 完整菜单展示

### 平板端（768px-1199px）

- 可折叠侧边栏
- 图标 + 文字

### 手机端（<768px）

- 隐藏侧边栏
- 汉堡菜单
- 底部导航（可选）

## 6.3 表格适配

### 桌面端

- 完整列显示
- 固定列（可选）

### 平板端

- 隐藏次要列
- 支持横向滚动

### 手机端

- 卡片式展示
- 关键信息优先
- 详情抽屉

## 6.4 详情页适配

### 桌面端

- 三栏布局完整展示

### 平板端

- 双栏布局（隐藏右侧）
- 可切换查看

### 手机端

- 单栏布局
- Tabs 切换内容

---

# 第七部分：无障碍设计

## 7.1 键盘导航

- [ ] Tab 键完整支持
- [ ] 焦点管理
- [ ] 快捷键文档

## 7.2 屏幕阅读器

- [ ] ARIA 标签完善
- [ ] 语义化 HTML
- [ ] 替代文本

## 7.3 颜色对比度

- [ ] 对比度检测工具
- [ ] 调整不达标颜色
- [ ] 高对比度模式

## 7.4 ARIA 标签规范

```tsx
// 图标按钮
<Button aria-label="编辑">
  <Edit className="w-4 h-4" />
</Button>

// 加载状态
<Button aria-busy="true" loading>
  加载中...
</Button>

// 错误状态
<Input aria-invalid="true" aria-describedby="error-msg" />
<p id="error-msg" className="text-destructive">错误信息</p>
```

---

# 第八部分：性能优化

## 8.1 虚拟滚动

- 大数据量表格
- 长列表
- 无限滚动

## 8.2 组件懒加载

```tsx
const CustomerList = React.lazy(() => import('@/pages/CustomerList'))

<Suspense fallback={<LoadingFallback />}>
  <CustomerList />
</Suspense>
```

## 8.3 数据预取

- 列表页预取详情
- 关联数据预加载

## 8.4 缓存策略

- React Query 缓存
- 本地存储
- 服务 worker

---

# 第九部分：暗黑模式

## 9.1 色彩系统扩展

```css
/* 暗黑模式 */
.dark {
  --bg-base: #09090B
  --bg-secondary: #18181B
  --bg-tertiary: #27272A
  --text-primary: #FAFAFA
  --text-secondary: #A1A1AA
  --border: #27272A
}
```

## 9.2 组件适配

- 所有组件暗黑模式支持
- 图表暗黑模式
- 图片/图标适配

## 9.3 主题切换

```tsx
<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  <App />
</ThemeProvider>
```

---

# 第十部分：技术债务与改进计划

## 10.1 当前问题

| 问题 | 影响 | 优先级 |
|------|------|--------|
| TypeScript 错误 (~75 个) | 开发体验、类型安全 | P0 |
| FilterBar API 不统一 | 维护成本 | P1 |
| Mock 数据类型不匹配 | 运行时错误 | P1 |
| 组件复用不足 | 代码重复 | P2 |
| 测试覆盖低 | 质量风险 | P2 |

## 10.2 优先级排序

### P0 - 立即修复

- TypeScript 错误修复（1-2 天）

### P1 - 本周完成

- FilterBar API 统一
- Mock 数据类型修复

### P2 - 本月完成

- 组件重构
- 单元测试编写

## 10.3 Phase 1-5 改进路线图

### Phase 1: 设计系统完善（1-2 周）

- [x] 定义主色、功能色、中性色
- [ ] 创建 Tailwind 配置
- [ ] 更新所有组件颜色引用
- [ ] 创建 Storybook
- [ ] 编写组件使用文档
- [ ] 统一图标库（Lucide React）

### Phase 2: 核心组件优化（2-3 周）

- [ ] DataTable 虚拟滚动
- [ ] DataTable 列拖拽排序
- [ ] DataTable 列宽调整
- [ ] FilterBar 自定义筛选条件
- [ ] FilterBar 筛选条件模板
- [ ] DetailLayout 侧边栏宽度可调

### Phase 3: 交互体验提升（2-3 周）

- [ ] 全局快捷键（Cmd/Ctrl + K 搜索）
- [ ] 列表页快捷键（J/K 上下移动）
- [ ] 详情页快捷键（E 编辑，D 删除）
- [ ] 快捷键帮助面板
- [ ] 页面过渡动画
- [ ] 列表项动画
- [ ] 模态框动画

### Phase 4: 无障碍设计（1-2 周）

- [ ] Tab 键完整支持
- [ ] 焦点管理
- [ ] ARIA 标签完善
- [ ] 语义化 HTML
- [ ] 颜色对比度检测
- [ ] 高对比度模式

### Phase 5: 暗黑模式（2-3 周）

- [ ] 定义暗黑模式色板
- [ ] 创建 CSS 变量
- [ ] 主题切换组件
- [ ] 所有组件暗黑模式支持
- [ ] 图表暗黑模式
- [ ] 系统主题跟随

---

## 📚 设计资源

### 参考设计

- **Linear** - https://linear.app
  - 三栏详情布局
  - 紫色主题
  - 精密的交互细节

- **Vercel** - https://vercel.com
  - 黑白极简
  - 字体排印
  - 文档风格

- **HubSpot** - https://hubspot.com
  - 高级筛选
  - 列表页设计

- **Salesforce** - https://salesforce.com
  - 企业级布局
  - 业务组件

### 设计工具

- **Figma** - 界面设计
- **Storybook** - 组件文档
- **Chromatic** - 视觉回归测试

### 组件库

- **shadcn/ui** - 基础组件
- **Radix UI** - 无头组件
- **TanStack Table** - 数据表格
- **Recharts** - 图表
- **Lucide React** - 图标

---

## 🔄 版本历史

| 版本 | 日期 | 更新内容 |
|------|------|----------|
| 1.0.0 | 2026-04-10 | 初始版本 - 基于 Linear/Vercel/Claude 设计哲学 |
| 2.0.0 | 2026-04-10 | 完整版 - 覆盖 33 个基础组件 + 所有业务组件 + 98 个页面模板 |

---

*本设计系统持续更新中*  
*最后更新：2026-04-10*
