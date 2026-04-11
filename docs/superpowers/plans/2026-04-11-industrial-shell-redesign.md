# Industrial Shell Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 重构 CRM 主框架，建立更成熟的工业级双层导航与页面上下文系统。

**Architecture:** 先统一全局 design token 与基础交互组件，再重做 `MainLayout` 的导航和顶部上下文条，最后适配与主框架强耦合的搜索、通知入口。保留现有路由和业务内容结构，只升级外壳与通用视觉语言。

**Tech Stack:** React 19、TypeScript、Vite、Tailwind CSS、shadcn/ui

---

### Task 1: 统一全局设计令牌

**Files:**
- Modify: `design-tokens.css`
- Modify: `src/index.css`

- [ ] 重新定义主色、中性色、边框、阴影和页面层级背景。
- [ ] 去掉偏 Ant Design 的默认蓝和系统字体导向，改为更克制的工业级配色基础。
- [ ] 统一标题、正文、辅助文字、面板边界和焦点反馈。

### Task 2: 收紧基础交互组件

**Files:**
- Modify: `src/components/ui/button.tsx`
- Modify: `src/components/ui/badge.tsx`

- [ ] 调整按钮层级，明确 primary、secondary、ghost、danger 的产品语义。
- [ ] 弱化彩色语义徽章的饱和度，改成更稳的产品标签风格。
- [ ] 确保主框架中的按钮和状态标签能直接复用新规则。

### Task 3: 重构主框架

**Files:**
- Modify: `src/components/Layout/MainLayout.tsx`

- [ ] 把左侧导航改成稳定主骨架，强化分组、层级和选中态。
- [ ] 把顶部栏改成页面上下文条，重排标题、说明、搜索、通知和主操作。
- [ ] 优化内容区容器节奏，让现有页面在新外壳中更有秩序。

### Task 4: 适配顶部入口

**Files:**
- Modify: `src/components/GlobalSearchDialog.tsx`
- Modify: `src/components/NotificationDropdown.tsx`

- [ ] 让搜索入口与通知入口匹配新的顶部栏尺寸、边界和交互语言。
- [ ] 避免它们继续保留旧的“浮动组件感”。

### Task 5: 校验与收尾

**Files:**
- Modify: `CONTEXT.md`

- [ ] 运行至少一轮构建或类型检查，确认新主框架没有引入新的明显错误。
- [ ] 更新上下文记录本次主框架改造进度。
- [ ] 汇总仍然存在的已知风险，尤其是仓库中原有的构建问题。
