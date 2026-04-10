# Phase 5-2: 合同支付订单产品页面迁移报告

## 完成时间
2026-04-03

## 迁移页面列表

### ✅ 合同模块
- `src/pages/ContractList.tsx` - 合同列表页面
- `src/pages/ContractDetail.tsx` - 合同详情页面

### ✅ 支付模块
- `src/pages/PaymentList.tsx` - 支付列表页面
- `src/pages/PaymentDetail.tsx` - 支付详情页面

### ✅ 订单模块
- `src/pages/OrderList.tsx` - 订单列表页面
- `src/pages/OrderDetail.tsx` - 订单详情页面

### ✅ 产品模块
- `src/pages/ProductList.tsx` - 产品列表页面
- `src/pages/ProductDetail.tsx` - 产品详情页面

### ✅ 价格手册模块
- `src/pages/PricebookList.tsx` - 价格手册列表页面
- `src/pages/PricebookDetail.tsx` - 价格手册详情页面

## 新增文件

### API Hooks
- `src/hooks/api/useContracts.ts` - 合同数据 hooks
- `src/hooks/api/usePayments.ts` - 支付数据 hooks
- `src/hooks/api/useOrders.ts` - 订单数据 hooks
- `src/hooks/api/usePricebooks.ts` - 价格手册数据 hooks

### Zod Schemas
- `src/schemas/contractSchema.ts` - 合同表单验证
- `src/schemas/paymentSchema.ts` - 支付表单验证
- `src/schemas/orderSchema.ts` - 订单表单验证
- `src/schemas/pricebookSchema.ts` - 价格手册表单验证

### 表单组件
- `src/forms/ContractForm.tsx` - 合同表单
- `src/forms/PaymentForm.tsx` - 支付表单
- `src/forms/OrderForm.tsx` - 订单表单

### 类型定义
更新 `src/types/api.ts` 添加：
- Contract 类型及相关
- Payment 类型及相关
- Order 类型及相关
- Pricebook 类型及相关

### Query Keys
更新 `src/lib/query-client.ts` 添加：
- contracts query keys
- payments query keys
- orders query keys
- pricebooks query keys

### Barrel Exports
更新以下文件：
- `src/pages/index.ts`
- `src/forms/index.ts`
- `src/schemas/index.ts`
- `src/hooks/api/index.ts`

## 技术实现

### 1. 数据获取层
- 使用 TanStack Query 进行数据管理
- 支持列表查询、详情获取、创建、更新、删除操作
- 包含特殊操作：签署合同、记录支付、发货、设置默认价格手册等

### 2. 表单验证
- 使用 Zod Schema 进行表单验证
- 支持创建/更新两种模式的 schema
- 包含金额、日期、编码等字段的验证规则

### 3. 页面组件
- 使用 DataTable 组件展示列表数据
- 支持排序、筛选、分页、行选择
- 使用 Dialog 组件进行创建/编辑
- 使用 Card 组件展示详情

### 4. 金额格式化
- 使用 Intl.NumberFormat 格式化货币
- 支持人民币 (CNY) 格式显示
- 保留两位小数

## 功能验证清单

### 合同模块
- [ ] 合同列表展示
- [ ] 合同搜索筛选
- [ ] 创建新合同
- [ ] 编辑合同
- [ ] 合同状态变更
- [ ] 合同详情查看
- [ ] 导出 PDF

### 支付模块
- [ ] 支付列表展示
- [ ] 支付搜索筛选
- [ ] 创建新支付记录
- [ ] 编辑支付信息
- [ ] 记录支付
- [ ] 退款处理
- [ ] 支付详情查看

### 订单模块
- [ ] 订单列表展示
- [ ] 订单搜索筛选
- [ ] 创建新订单
- [ ] 添加订单明细
- [ ] 确认订单
- [ ] 发货处理
- [ ] 确认收货
- [ ] 订单详情查看

### 产品模块
- [ ] 产品列表展示
- [ ] 产品搜索筛选
- [ ] 创建新产品
- [ ] 编辑产品
- [ ] 上架/下架产品
- [ ] 产品详情查看
- [ ] 库存预警显示

### 价格手册模块
- [ ] 价格手册列表展示
- [ ] 创建新价格手册
- [ ] 编辑价格手册
- [ ] 添加价格条目
- [ ] 删除价格条目
- [ ] 设为默认价格手册
- [ ] 价格手册详情查看

## 依赖安装
- `react-router-dom` - 路由管理

## 注意事项
1. 页面中的 hooks import 已注释，待 API 接口就绪后取消注释
2. Mock 数据用于演示，实际使用时需替换为真实 API
3. 部分表单组件中的未使用变量警告不影响功能

## 后续工作
1. 连接真实 API 接口
2. 添加路由配置
3. 完善错误处理
4. 添加加载状态
5. 实现表单联动（如选择客户后自动填充相关信息）

## 删除的 CSS 文件
无（本批次迁移不涉及删除旧 CSS 文件，因为是从零创建新页面）