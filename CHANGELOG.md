# 集成改动记录

## v1.0.0 - 2026-03-12

### 新增

- 整合 3 个独立模块为统一的 CRM 系统
- 创建统一的路由系统（React Router 6）
- 创建主布局组件（侧边栏导航 + 顶栏）
- 统一类型定义（17 个类型文件）
- 统一 Mock 数据（9 个数据文件）

### 修复

- 修复 `settingsData.ts` 缺少 `WORK_DAY_OPTIONS` 和 `RETENTION_OPTIONS` 导出
- 修复 `Dashboard.tsx` 组件导入路径
- 修复所有 TypeScript 类型错误
- 移除未使用的导入和变量

### 改动

- 统一依赖版本到 React 18.2.0 + TypeScript 5.3.3 + Ant Design 5.14.0
- 统一目录结构
- 统一命名规范

### 技术栈

- React 18.2.0
- TypeScript 5.3.3
- Ant Design 5.14.0
- React Router 6.22.0
- Recharts 2.12.0
- Vite 5.1.0

### 页面数量

- 总计 17 个页面
- 仪表盘 1 个
- 客户管理 4 个（客户列表/详情、联系人列表/详情）
- 线索管理 2 个（线索列表/详情）
- 商机管理 2 个（商机列表/详情）
- 跟进记录 2 个（跟进列表/表单）
- 合同管理 2 个（合同列表/详情）
- 报表统计 3 个（销售漏斗/业绩/客户）
- 系统设置 1 个

### 模块整合

| 原模块 | 整合后位置 |
|--------|-----------|
| module1-customer-lead | src/pages + src/components/Customer |
| module2-opportunity-contract | src/pages + src/components/Opportunity |
| module3-dashboard-report | src/pages + src/components/Dashboard |
