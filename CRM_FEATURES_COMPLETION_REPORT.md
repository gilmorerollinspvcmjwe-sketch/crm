# CRM 功能完善开发报告

**日期**: 2026-03-17  
**任务**: 产品/价格表表单 + 权限系统集成

---

## 一、完成内容

### 1. 产品/价格表的新建编辑表单

#### 1.1 产品表单（ProductForm.tsx）
**位置**: `src/components/Product/ProductForm.tsx`

**功能点**:
- ✅ 产品基本信息：产品名称、产品编码、分类、描述
- ✅ 规格参数：规格、型号、单位
- ✅ 价格信息：标准价格、成本价
- ✅ 库存信息：库存数量、库存预警阈值、库存状态
- ✅ 销售状态：上架/下架切换
- ✅ Modal 弹窗形式
- ✅ 支持新建和编辑两种模式
- ✅ 完整的表单验证（必填项、格式校验）

**表单验证规则**:
- 产品名称：必填
- 产品编码：必填，只能包含大写字母、数字和短横线
- 产品分类：必填
- 单位：必填
- 标准价格：必填，数字类型，最小值 0
- 上架状态：必填

---

#### 1.2 价格表表单（PricebookForm.tsx）
**位置**: `src/components/Pricebook/PricebookForm.tsx`

**功能点**:
- ✅ 基本信息：价格表名称、类型（标准/客户专属/合作伙伴/促销）
- ✅ 生效日期、失效日期（支持长期有效）
- ✅ 关联客户（仅当类型为客户专属价格表时显示）
- ✅ 价格表描述
- ✅ 币种设置（默认 CNY）
- ✅ 状态：草稿/启用/停用
- ✅ 系统价格表标识（不可删除）
- ✅ Modal 弹窗形式
- ✅ 支持新建和编辑两种模式
- ✅ 完整的表单验证

**表单验证规则**:
- 价格表名称：必填
- 价格表类型：必填
- 关联客户：必填（仅客户专属价格表）
- 生效日期：必填
- 币种：必填
- 状态：必填

---

#### 1.3 价格表现目表单（PricebookEntryForm.tsx）
**位置**: `src/components/Pricebook/PricebookEntryForm.tsx`

**功能点**:
- ✅ 选择产品（带搜索功能）
- ✅ 设置基准价格（自动从产品带出）
- ✅ 阶梯定价配置：
  - 支持添加多个价格阶梯
  - 每个阶梯包含：最小数量、最大数量（自动计算）、单价
  - 自动计算折扣率
  - 支持删除阶梯（至少保留一个）
- ✅ 生效日期、失效日期
- ✅ 币种设置
- ✅ Modal 弹窗形式
- ✅ 完整的表单验证

**阶梯定价特性**:
- 第一个阶梯的最小数量固定为 1
- 添加新阶梯时自动计算最小数量
- 修改最小数量时自动更新前一个阶梯的最大数量
- 实时显示每个阶梯的折扣率

---

### 2. 权限系统集成

#### 2.1 更新 Roles.tsx
**位置**: `src/pages/Roles.tsx`

**修改内容**:
- ✅ 添加"新建角色"按钮，点击打开 RoleForm Modal
- ✅ 添加"编辑"按钮，点击打开 RoleForm Modal（编辑模式）
- ✅ 添加"配置权限"按钮，点击打开 PermissionTree Modal
- ✅ 添加"复制角色"按钮，复制现有角色的权限配置
- ✅ 添加"删除"按钮（系统角色不可删除）
- ✅ 角色列表显示：角色名称、角色代码、描述、数据范围、操作
- ✅ 系统角色标识（紫色标签）
- ✅ 数据范围标签（全部数据/部门数据/团队数据/个人数据）

**权限配置 Modal**:
- 显示完整的权限树（菜单权限 + 按钮权限）
- 支持复选框选择权限
- 显示权限类型标签（菜单/按钮）
- 显示权限代码

---

#### 2.2 更新 Users.tsx
**位置**: `src/pages/Users.tsx`

**修改内容**:
- ✅ 添加"分配角色"按钮，点击打开 UserRoleAssign Modal
- ✅ 用户列表显示当前角色标签（支持多角色，不同颜色）
- ✅ 用户信息展示：头像、用户名、真实姓名、邮箱、手机、部门
- ✅ 状态标签（正常/停用）
- ✅ 支持新建用户、编辑用户、删除用户
- ✅ 角色分配使用 Transfer 组件，支持搜索和筛选

**角色标签**:
- 支持多角色显示
- 不同角色使用不同颜色标签（蓝、绿、青、紫、橙循环）
- 清晰展示用户当前拥有的所有角色

---

#### 2.3 权限配置页面（PermissionSettings.tsx）
**位置**: `src/pages/PermissionSettings.tsx`

**功能**:
- ✅ 左侧：角色列表
  - 显示所有角色
  - 高亮当前选中角色
  - 显示角色代码和数据范围
  - 系统角色标识
- ✅ 右侧：权限树
  - 菜单权限 + 按钮权限
  - 复选框选择
  - 显示权限类型和代码
  - 支持全选、仅菜单、清空快捷操作
  - 显示已选权限数量
- ✅ 数据权限设置（UI 展示）
  - 全部数据
  - 部门数据
  - 团队数据
  - 个人数据
- ✅ 保存配置按钮

**交互特性**:
- 点击角色切换选中状态
- 点击数据范围选项更新数据权限
- 权限树支持展开/折叠
- 实时显示已选权限数量

---

### 3. 页面集成

#### 3.1 更新 ProductList.tsx
**位置**: `src/pages/products/ProductList.tsx`

**修改内容**:
- ✅ 集成 ProductForm 组件
- ✅ 新建产品按钮打开表单 Modal
- ✅ 编辑按钮打开表单 Modal（编辑模式）
- ✅ 表格列更新：显示规格、型号、成本价、库存数量、状态
- ✅ 状态显示：上架/下架 + 有货/缺货

---

#### 3.2 更新 PricebookList.tsx
**位置**: `src/pages/pricebooks/PricebookList.tsx`

**修改内容**:
- ✅ 集成 PricebookForm 组件
- ✅ 集成 PricebookEntryForm 组件
- ✅ 新建价格表按钮打开表单 Modal
- ✅ 编辑按钮打开表单 Modal（编辑模式）
- ✅ 添加产品按钮打开条目表单 Modal
- ✅ 加载产品列表供条目表单使用

---

#### 3.3 更新路由配置
**位置**: `src/routes/index.tsx`

**修改内容**:
- ✅ 添加 PermissionSettings 页面懒加载导入
- ✅ 添加路由：`/settings/permissions`

---

### 4. 类型定义更新

#### 4.1 更新 cpq.ts
**位置**: `src/types/cpq.ts`

**新增字段**:
```typescript
export interface Product {
  // ... 原有字段
  specification?: string;  // 规格
  model?: string;          // 型号
  costPrice?: number;      // 成本价
  stockQuantity?: number;  // 库存数量
  stockWarning?: number;   // 库存预警阈值
  status: 'active' | 'inactive';  // 上架/下架状态
}
```

---

## 二、创建的文件列表

| 文件路径 | 类型 | 说明 |
|---------|------|------|
| `src/components/Product/ProductForm.tsx` | 新建 | 产品表单组件 |
| `src/components/Pricebook/PricebookForm.tsx` | 新建 | 价格表表单组件 |
| `src/components/Pricebook/PricebookEntryForm.tsx` | 新建 | 价格表条目表单组件 |
| `src/pages/PermissionSettings.tsx` | 新建 | 权限配置页面 |

---

## 三、修改的文件列表

| 文件路径 | 修改内容 |
|---------|---------|
| `src/types/cpq.ts` | 扩展 Product 接口，添加规格、成本价、库存等字段 |
| `src/pages/Roles.tsx` | 重写，添加完整的角色管理功能 |
| `src/pages/Users.tsx` | 重写，添加角色分配和角色标签显示 |
| `src/pages/products/ProductList.tsx` | 集成 ProductForm，更新表格列 |
| `src/pages/pricebooks/PricebookList.tsx` | 集成 PricebookForm 和 PricebookEntryForm |
| `src/routes/index.tsx` | 添加 PermissionSettings 路由 |

---

## 四、依赖的现有组件

以下组件在项目中已存在，被本任务复用：

| 组件 | 位置 | 用途 |
|------|------|------|
| `RoleForm` | `src/components/Permission/RoleForm.tsx` | 角色表单 |
| `PermissionTree` | `src/components/Permission/PermissionTree.tsx` | 权限树 |
| `UserRoleAssign` | `src/components/Permission/UserRoleAssign.tsx` | 用户角色分配 |

---

## 五、使用说明

### 产品管理
1. 访问 `/product/list` 进入产品列表页面
2. 点击"新建产品"按钮打开表单
3. 填写产品信息，点击"创建"保存
4. 点击"编辑"按钮修改产品信息
5. 点击"删除"按钮删除产品

### 价格表管理
1. 访问 `/pricebook/list` 进入价格表列表页面
2. 点击"新建价格表"按钮打开表单
3. 选择价格表类型（客户专属类型需选择客户）
4. 设置有效期和状态
5. 在价格表列表中点击"添加产品"添加价格表条目
6. 配置阶梯定价（可选）

### 角色管理
1. 访问 `/settings/roles` 进入角色管理页面
2. 点击"新建角色"创建新角色
3. 点击"配置权限"配置角色的菜单和按钮权限
4. 点击"复制角色"快速创建相似角色
5. 点击"编辑"修改角色信息
6. 点击"删除"删除角色（系统角色不可删除）

### 用户管理
1. 访问 `/settings/users` 进入用户管理页面
2. 点击"新建用户"创建新用户
3. 点击"分配角色"为用户分配角色
4. 用户列表显示当前角色标签

### 权限配置
1. 访问 `/settings/permissions` 进入权限配置中心
2. 左侧选择要配置的角色
3. 右侧勾选权限树中的权限
4. 下方选择数据权限范围
5. 点击"保存配置"保存

---

## 六、技术细节

### 表单验证
- 使用 Ant Design Form 的 `rules` 属性进行验证
- 必填项使用 `{ required: true, message: '...' }`
- 格式验证使用 `pattern` 正则表达式
- 数字验证使用 `InputNumber` 组件的 `min` 和 `precision` 属性

### 状态管理
- 使用 React `useState` 管理组件状态
- 表单数据使用 Ant Design `Form.useForm()` 管理
- Modal 显示状态独立管理

### 组件通信
- 表单组件通过 `onSubmit` 回调传递数据
- 父组件通过 `initialValues` 传递编辑数据
- 使用 `isEdit` 属性区分新建/编辑模式

### 样式规范
- 使用 Ant Design 默认样式
- 表单使用 `layout="vertical"` 垂直布局
- Modal 宽度根据内容调整（600-800px）
- 使用 `Divider` 分组表单字段

---

## 七、后续优化建议

1. **API 集成**: 当前使用 Mock 数据，建议对接真实后端 API
2. **权限持久化**: 角色权限配置需要保存到数据库
3. **表单优化**: 可添加更多字段（如产品图片、多币种支持）
4. **批量操作**: 支持批量导入/导出产品
5. **权限缓存**: 权限配置可添加本地缓存提升性能
6. **审计日志**: 记录角色和权限的变更历史

---

**开发完成时间**: 2026-03-17 17:38  
**开发者**: OpenClaw AI Assistant
