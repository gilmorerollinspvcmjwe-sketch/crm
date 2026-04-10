# 客户管理 UI 风格同步计划

## 📋 客户管理页面 UI 风格特点

### CustomerList.tsx（列表页）特点

1. **顶部统计卡片**
   - 4 个统计卡片：总记录数、各状态数量
   - 使用 Card 组件 + 图标 + 数字展示

2. **筛选栏（FilterBar）**
   - 基础筛选：姓名、公司、状态、负责人、创建时间、评分
   - 高级筛选：支持 AND/OR 逻辑、多操作符
   - 筛选器保存功能

3. **数据表格（DataTable）**
   - 支持行操作（查看/编辑/删除）
   - 批量操作（分配/删除/导出）
   - 状态 Badge（颜色编码）
   - 评分 Badge（颜色分级）

4. **操作按钮**
   - 新建按钮（带图标）
   - 批量操作下拉菜单
   - 导出下拉菜单（Excel/CSV/JSON）

5. **状态和评分系统**
   - StatusBadge：潜在/活跃/沉默/流失（4 色）
   - ScoreBadge：0-100 分（5 色分级）

### CustomerDetail.tsx（详情页）特点

1. **DetailLayout 三栏布局**
   - 左侧：客户信息卡片
   - 中间：Tab 内容区
   - 右侧：相关列表（联系人/商机/任务）

2. **头部区域**
   - 返回按钮
   - 客户名称（大标题）
   - 状态 Badge
   - 操作按钮组（编辑/删除/更多）

3. **客户信息卡片**
   - Avatar 头像
   - 基本信息（电话/邮箱/地址/网站）
   - 可内联编辑字段
   - 评分进度条

4. **Tabs 标签页**
   - 概览（Overview）
   - 联系人
   - 商机
   - 活动记录
   - 任务

5. **时间线组件（Timeline）**
   - 活动记录可视化
   - 图标 + 颜色编码

6. **相关列表**
   - DataTable 展示
   - 可折叠面板
   - 快速操作按钮

---

## 📋 需要同步的页面清单

### 列表页同步（10 个页面）

| 序号 | 页面 | 当前状态 | 同步内容 | 优先级 |
|------|------|----------|----------|--------|
| 1 | **LeadList.tsx**（线索） | ⚠️ 需同步 | 统计卡片、筛选栏、状态 Badge | P0 |
| 2 | **ContactList.tsx**（联系人） | ⚠️ 需同步 | 统计卡片、筛选栏、决策角色 Badge | P0 |
| 3 | **OpportunityList.tsx**（商机） | ⚠️ 需同步 | 统计卡片、筛选栏、阶段 Badge、金额 | P0 |
| 4 | **ContractList.tsx**（合同） | ⚠️ 需同步 | 统计卡片、筛选栏、状态 Badge | P0 |
| 5 | **OrderList.tsx**（订单） | ⚠️ 需同步 | 统计卡片、筛选栏、状态 Badge | P0 |
| 6 | **PaymentList.tsx**（回款） | ⚠️ 需同步 | 统计卡片、筛选栏、支付方式 Badge | P0 |
| 7 | **QuoteList.tsx**（报价） | ⚠️ 需同步 | 统计卡片、筛选栏、状态 Badge | P1 |
| 8 | **ActivityList.tsx**（活动） | ⚠️ 需同步 | 统计卡片、筛选栏、类型 Badge | P1 |
| 9 | **ProductList.tsx**（产品） | ⚠️ 需同步 | 统计卡片、筛选栏、类别 Badge | P1 |
| 10 | **PricebookList.tsx**（价格表） | ⚠️ 需同步 | 统计卡片、筛选栏、状态 Badge | P1 |

### 详情页同步（9 个页面）

| 序号 | 页面 | 当前状态 | 同步内容 | 优先级 |
|------|------|----------|----------|--------|
| 1 | **LeadDetail.tsx**（线索） | ⚠️ 需同步 | DetailLayout、信息卡片、Tabs、时间线 | P0 |
| 2 | **ContactDetail.tsx**（联系人） | ⚠️ 需同步 | DetailLayout、信息卡片、Tabs | P0 |
| 3 | **OpportunityDetail.tsx**（商机） | ⚠️ 需同步 | DetailLayout、信息卡片、Tabs、时间线 | P0 |
| 4 | **ContractDetail.tsx**（合同） | ⚠️ 需同步 | DetailLayout、信息卡片、Tabs、回款计划 | P0 |
| 5 | **OrderDetail.tsx**（订单） | ⚠️ 需同步 | DetailLayout、信息卡片、商品明细 | P0 |
| 6 | **PaymentDetail.tsx**（回款） | ⚠️ 需同步 | DetailLayout、信息卡片、核销记录 | P1 |
| 7 | **QuoteDetail.tsx**（报价） | ⚠️ 需同步 | DetailLayout、信息卡片、报价明细 | P1 |
| 8 | **ActivityDetail.tsx**（活动） | ⚠️ 需同步 | DetailLayout、活动详情 | P2 |
| 9 | **ProductDetail.tsx**（产品） | ⚠️ 需同步 | DetailLayout、信息卡片、价格表 | P2 |

---

## 🎯 同步执行计划

### Phase 1 - 核心业务模块（P0）

**预计时间**: 3-4 天

#### Agent 1.1: 线索模块
- `LeadList.tsx` - 统计卡片、筛选栏、状态 Badge
- `LeadDetail.tsx` - DetailLayout、信息卡片、转化流程

#### Agent 1.2: 联系人模块
- `ContactList.tsx` - 统计卡片、筛选栏、决策角色 Badge
- `ContactDetail.tsx` - DetailLayout、信息卡片

#### Agent 1.3: 商机模块
- `OpportunityList.tsx` - 统计卡片、筛选栏、阶段 Badge、金额
- `OpportunityDetail.tsx` - DetailLayout、信息卡片、时间线

### Phase 2 - 交易模块（P0）

**预计时间**: 3-4 天

#### Agent 2.1: 合同模块
- `ContractList.tsx` - 统计卡片、筛选栏、状态 Badge
- `ContractDetail.tsx` - DetailLayout、信息卡片、回款计划

#### Agent 2.2: 订单模块
- `OrderList.tsx` - 统计卡片、筛选栏、状态 Badge
- `OrderDetail.tsx` - DetailLayout、信息卡片、商品明细

#### Agent 2.3: 回款模块
- `PaymentList.tsx` - 统计卡片、筛选栏、支付方式 Badge
- `PaymentDetail.tsx` - DetailLayout、信息卡片、核销记录

### Phase 3 - 辅助模块（P1）

**预计时间**: 2-3 天

#### Agent 3.1: 报价和活动
- `QuoteList.tsx` - 统计卡片、筛选栏
- `QuoteDetail.tsx` - DetailLayout、报价明细
- `ActivityList.tsx` - 统计卡片、筛选栏
- `ActivityDetail.tsx` - DetailLayout

### Phase 4 - 产品模块（P1）

**预计时间**: 1-2 天

#### Agent 4.1: 产品和价格表
- `ProductList.tsx` - 统计卡片、筛选栏
- `ProductDetail.tsx` - DetailLayout、价格表
- `PricebookList.tsx` - 统计卡片、筛选栏

---

## 📐 UI 风格标准

### 颜色规范

| 类型 | 状态 | 颜色类 |
|------|------|--------|
| **客户状态** | 潜在 | `bg-blue-100 text-blue-800 border-blue-200` |
| | 活跃 | `bg-green-100 text-green-800 border-green-200` |
| | 沉默 | `bg-yellow-100 text-yellow-800 border-yellow-200` |
| | 流失 | `bg-red-100 text-red-800 border-red-200` |
| **评分** | 80-100 | `bg-green-100 text-green-800` |
| | 60-79 | `bg-blue-100 text-blue-800` |
| | 40-59 | `bg-yellow-100 text-yellow-800` |
| | 0-39 | `bg-red-100 text-red-800` |

### 组件使用

- **统计卡片**: `Card` + `CardHeader` + 图标 + 数字
- **筛选栏**: `FilterBar` 组件（支持高级筛选）
- **数据表格**: `DataTable` 组件（TanStack Table）
- **状态 Badge**: `Badge` 或自定义 `span` + 颜色类
- **详情页布局**: `DetailLayout` 三栏布局
- **时间线**: `Timeline` 组件
- **折叠面板**: `Collapsible` 组件
- **Tabs**: `Tabs` 组件

### 交互规范

- **批量操作**: 多选 → 操作下拉菜单 → 确认对话框
- **内联编辑**: 点击字段 → 编辑模式 → 保存/取消
- **筛选器保存**: 保存筛选配置到 localStorage
- **导出功能**: 支持 Excel/CSV/JSON 三格式

---

## ✅ 验收标准

### 列表页验收
- [ ] 顶部有 4 个统计卡片
- [ ] FilterBar 筛选栏功能完整
- [ ] 高级筛选支持 AND/OR 逻辑
- [ ] 筛选器可保存
- [ ] DataTable 支持批量操作
- [ ] 状态 Badge 颜色统一
- [ ] 操作按钮组完整（新建/批量/导出）

### 详情页验收
- [ ] DetailLayout 三栏布局
- [ ] 头部有返回按钮、标题、状态、操作组
- [ ] 左侧信息卡片完整
- [ ] Tabs 标签页切换正常
- [ ] 右侧相关列表可折叠
- [ ] 支持内联编辑
- [ ] 时间线组件（如适用）

---

*文档版本：V1*
*创建时间：2026-04-10*
*基于：CustomerList.tsx 和 CustomerDetail.tsx*
