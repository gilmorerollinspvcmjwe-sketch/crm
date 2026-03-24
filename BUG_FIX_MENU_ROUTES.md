# CRM 系统菜单和路由修复报告

**修复日期**: 2026-03-17  
**修复范围**: 菜单配置、路由配置、价格表集成

---

## 修复清单

### ✅ 1. 菜单缺失问题

**问题**: Phase 7（产品库/价格表）和 Phase 8（工单/知识库/外呼）未加入左侧导航菜单

**修复文件**: `src/components/Layout/MainLayout.tsx`

**修改内容**:
1. 添加新图标导入:
   - `ShopOutlined` - 产品库
   - `BookOutlined` - 价格表（实际使用 CalculatorOutlined）
   - `CustomerServiceOutlined` - 集成对接
   - `PhoneOutlined` - 呼叫中心

2. 在"CPQ 报价管理"菜单组中添加:
   - 产品库 (`/products/list`)
   - 价格表 (`/pricebooks/list`)

3. 新增"集成对接"菜单组:
   - 工单系统 (`/integration/tickets`)
   - 知识库 (`/integration/knowledge`)
   - 呼叫中心 (`/integration/callcenter`)

4. 更新菜单展开逻辑，支持新产品和价格表路由的自动展开

**菜单结构**:
```
CPQ 报价管理
  - 报价单列表
  - 新建报价单
  - 产品库 (新增)
  - 价格表 (新增)

集成对接 (新增分组)
  - 工单系统
  - 知识库
  - 呼叫中心
```

---

### ✅ 2. 路由重复问题

**问题**: `quote/:id/edit` 和 `quote/builder` 都指向 QuoteBuilder

**修复文件**: `src/routes/index.tsx`

**修改内容**:
1. 移除 `quote/builder` 路由（冗余）
2. 保留 `quote/new` 指向 `QuoteBuilder`（新建报价）
3. 保留 `quote/:id/edit` 指向 `QuoteBuilder`（编辑报价）
4. 移除未使用的 `QuoteNew` 组件导入

**路由定义**:
```typescript
// 新建报价
{ path: 'quote/new', element: <QuoteBuilder /> }

// 查看报价详情
{ path: 'quote/:id', element: <QuoteDetail /> }

// 编辑报价
{ path: 'quote/:id/edit', element: <QuoteBuilder /> }
```

---

### ✅ 3. QuoteBuilder 关联价格表

**问题**: 报价时未从价格表获取实际价格

**修复文件**:
- `src/services/pricebookService.ts` - 新增价格查询服务
- `src/components/CPQ/ProductSelector.tsx` - 支持价格表价格显示
- `src/pages/quotes/QuoteBuilder.tsx` - 传递客户 ID 到产品选择器

**修改内容**:

#### 3.1 价格表服务 (`pricebookService.ts`)
新增函数:
```typescript
// 根据客户 ID 和产品 ID 获取价格（支持阶梯定价）
export const getProductPrice(
  customerId: string | undefined,
  productId: string,
  quantity: number = 1
): Promise<{ unitPrice: number; pricebookId?: string; pricebookName?: string; tier?: PriceTier } | undefined>

// 获取标准价格表
export const getStandardPricebook = (): Promise<Pricebook | undefined>
```

**价格匹配逻辑**:
1. 优先查找客户专属价格表（`type: '客户价格表'` 且匹配 `customerId`）
2. 如果没有客户价格表，使用标准价格表
3. 根据数量匹配阶梯定价区间

#### 3.2 产品选择器 (`ProductSelector.tsx`)
修改内容:
1. 添加 `customerId` 属性支持
2. 加载产品时异步查询价格表获取实际价格
3. 在表格中显示价格表价格（如有折扣，显示原价划线）
4. 确认选择时返回价格表中的价格

**价格显示效果**:
```
¥8,330          (价格表价格，红色加粗)
¥9,800          (原价，灰色删除线)
```

#### 3.3 报价构建器 (`QuoteBuilder.tsx`)
修改内容:
1. 设置默认客户 ID（TODO: 后续从客户选择器获取）
2. 传递 `customerId` 到 `ProductSelector` 组件

---

### ✅ 4. 路由命名统一

**问题**: 产品/价格表详情缺少统一的路由命名规范

**修复文件**: `src/routes/index.tsx`

**修改内容**:
采用 RESTful 风格统一所有模块路由：

**产品库路由**:
```typescript
{ path: 'products/list', element: <ProductList /> }      // 列表
{ path: 'products/new', element: <ProductForm /> }       // 新建
{ path: 'products/:id', element: <ProductDetail /> }     // 详情
{ path: 'products/:id/edit', element: <ProductForm /> }  // 编辑
```

**价格表路由**:
```typescript
{ path: 'pricebooks/list', element: <PricebookList /> }      // 列表
{ path: 'pricebooks/new', element: <PricebookForm /> }       // 新建
{ path: 'pricebooks/:id', element: <PricebookDetail /> }     // 详情
{ path: 'pricebooks/:id/edit', element: <PricebookForm /> }  // 编辑
```

**新增导入**:
```typescript
const ProductForm = React.lazy(() => import('../components/Product/ProductForm'));
const PricebookForm = React.lazy(() => import('../components/Pricebook/PricebookForm'));
```

---

## 附加修复

### TypeScript 配置修复
**文件**: `tsconfig.json`

添加配置项:
```json
{
  "allowSyntheticDefaultImports": true,
  "esModuleInterop": true
}
```

### 类型定义修复
**文件**: `src/types/ai.ts`

修复字符编码问题，补全被截断的中文注释。

---

## 修改文件清单

| 文件路径 | 修改类型 | 说明 |
|---------|---------|------|
| `src/components/Layout/MainLayout.tsx` | 修改 | 添加产品库、价格表、集成对接菜单 |
| `src/routes/index.tsx` | 修改 | 统一路由命名，移除冗余路由 |
| `src/services/pricebookService.ts` | 修改 | 新增价格查询服务函数 |
| `src/components/CPQ/ProductSelector.tsx` | 修改 | 支持价格表价格显示 |
| `src/pages/quotes/QuoteBuilder.tsx` | 修改 | 传递客户 ID 到产品选择器 |
| `tsconfig.json` | 修改 | 添加 TypeScript 兼容配置 |
| `src/types/ai.ts` | 重写 | 修复字符编码问题 |

---

## 测试建议

### 菜单测试
1. [ ] 验证左侧菜单显示"产品库"和"价格表"
2. [ ] 验证左侧菜单显示"集成对接"分组
3. [ ] 点击菜单项正确跳转到对应页面
4. [ ] 菜单展开/收起功能正常

### 路由测试
1. [ ] 访问 `/products/list` 显示产品列表
2. [ ] 访问 `/pricebooks/list` 显示价格表列表
3. [ ] 访问 `/quote/new` 打开报价构建器（新建模式）
4. [ ] 访问 `/quote/:id/edit` 打开报价构建器（编辑模式）
5. [ ] 访问 `/integration/tickets` 显示工单列表
6. [ ] 访问 `/integration/knowledge` 显示知识库
7. [ ] 访问 `/integration/callcenter` 显示呼叫中心

### 价格表集成测试
1. [ ] 在报价构建器中点击"选择产品"
2. [ ] 验证产品列表中显示价格表价格
3. [ ] 验证客户专属价格优先于标准价格
4. [ ] 验证阶梯定价根据数量正确匹配
5. [ ] 添加产品到报价单，验证使用价格表价格

---

## 注意事项

1. **客户选择器待完善**: 当前 `QuoteBuilder.tsx` 中使用硬编码的客户 ID (`CUST001`)，后续需要实现客户选择功能

2. **价格表服务优化**: 当前实现为每个产品单独查询价格，产品数量多时可能影响性能，建议批量查询优化

3. **预先存在的问题**: 项目中存在一些预先存在的 TypeScript 类型错误和文件路径问题，不影响本次修复的功能

---

## 后续改进建议

1. 实现客户选择器组件，在报价创建时选择客户
2. 优化价格表查询性能，支持批量查询
3. 添加价格表缓存机制，减少重复查询
4. 支持价格表版本管理和历史记录
5. 添加价格审批流程
