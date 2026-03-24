# CRM 前端集成系统

一个完整的企业级 CRM（客户关系管理）系统前端应用。

## 功能模块

### 客户管理
- 客户列表/详情
- 联系人列表/详情
- 客户关联数据展示

### 线索管理
- 线索列表/详情
- 线索转化
- 跟进记录

### 商机管理
- 商机列表/详情
- 销售漏斗
- 竞争对手管理

### 跟进记录
- 跟进列表
- 新建跟进
- 多种跟进类型（电话/拜访/邮件/微信/会议）

### 合同管理
- 合同列表/详情
- 回款计划
- 合同状态管理
- 合同审批流程
- 合同归档

### 回款管理（Phase 2 新增）
- 回款计划列表/详情
- 回款记录管理
- 回款进度可视化
- 回款核销
- 应收账款管理
- 回款统计看板

### 报表统计
- 销售漏斗报表
- 业绩统计报表
- 客户分析报表

### 系统设置
- 基础设置
- 销售阶段配置
- 跟进类型配置

## 技术栈

- **React 18** - UI 框架
- **TypeScript 5** - 类型系统
- **Ant Design 5** - UI 组件库
- **React Router 6** - 路由管理
- **Recharts** - 图表库
- **Zustand** - 状态管理
- **Vite** - 构建工具

## 快速开始

### 方式一：一键启动（推荐）

```bash
# Windows
start.bat
```

### 方式二：手动启动

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

启动后访问 http://localhost:5174

## 项目结构

```
frontend-integrated/
├── src/
│   ├── pages/              # 页面组件
│   │   ├── Dashboard.tsx
│   │   ├── CustomerList.tsx
│   │   ├── CustomerDetail.tsx
│   │   ├── ContactList.tsx
│   │   ├── ContactDetail.tsx
│   │   ├── LeadList.tsx
│   │   ├── LeadDetail.tsx
│   │   ├── OpportunityList.tsx
│   │   ├── OpportunityDetail.tsx
│   │   ├── ActivityList.tsx
│   │   ├── ActivityForm.tsx
│   │   ├── ContractList.tsx
│   │   ├── ContractDetail.tsx
│   │   ├── PaymentList.tsx         # Phase 2 新增
│   │   ├── PaymentDetail.tsx       # Phase 2 新增
│   │   ├── SalesFunnelReport.tsx
│   │   ├── PerformanceReport.tsx
│   │   ├── CustomerReport.tsx
│   │   └── SystemSettings.tsx
│   ├── components/         # 通用组件
│   │   ├── Layout/
│   │   ├── Customer/
│   │   ├── Contact/
│   │   ├── Lead/
│   │   ├── Opportunity/
│   │   ├── Activity/
│   │   ├── Contract/
│   │   ├── Dashboard/
│   │   ├── Report/
│   │   └── Common/
│   ├── types/              # TypeScript 类型定义
│   ├── mock/               # Mock 数据
│   ├── routes/             # 路由配置
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── tsconfig.json
├── vite.config.ts
└── index.html
```

## 可用脚本

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 代码检查
npm run lint
```

## 页面路由

| 页面 | 路由 |
|------|------|
| 仪表盘 | `/dashboard` |
| 客户列表 | `/customer/list` |
| 客户详情 | `/customer/:id` |
| 联系人列表 | `/contact/list` |
| 联系人详情 | `/contact/:id` |
| 线索列表 | `/lead/list` |
| 线索详情 | `/lead/:id` |
| 商机列表 | `/opportunity/list` |
| 商机详情 | `/opportunity/:id` |
| 跟进列表 | `/activity/list` |
| 新建跟进 | `/activity/new` |
| 合同列表 | `/contract/list` |
| 合同详情 | `/contract/:id` |
| 回款列表 | `/payment/list` |
| 回款详情 | `/payment/:id` |
| 销售漏斗 | `/report/funnel` |
| 业绩统计 | `/report/performance` |
| 客户分析 | `/report/customer` |
| 系统设置 | `/settings` |

## 数据关联

- 客户详情 → 显示关联联系人、商机、合同
- 商机详情 → 显示所属客户、关联跟进记录、竞争对手
- 合同详情 → 显示所属客户、关联商机、回款计划、回款进度
- 回款详情 → 显示关联合同、回款记录、回款时间线
- 仪表盘 → 汇总所有模块数据

## Phase 2 新增功能

Phase 2 实现了完整的业务闭环，包括商机管理、合同管理和回款管理三大核心模块。

详见：[PHASE2_FEATURES.md](./PHASE2_FEATURES.md)

### 新增组件

- `PaymentTable` - 回款表格
- `PaymentProgress` - 回款进度条可视化
- `PaymentStats` - 回款统计卡片
- `ContractStatus` - 合同状态标签
- `PaymentPlanTable` - 回款计划表格
- `CompetitorTable` - 竞争对手表格

### 新增类型

- `payment.ts` - 回款模块完整类型定义

## 许可证

MIT
