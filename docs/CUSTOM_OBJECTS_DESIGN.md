# 自定义对象 + 个人设置 + 日志功能 设计方案

> 版本：v1.0 | 日期：2026-03-24 | 参考：HubSpot CRM 自定义对象 + 个人设置 + 审计日志

---

## 一、HubSpot 功能分析

### 1.1 个人设置功能分析（截图 img_008~img_010）

#### 截图中看到的内容

根据 HubSpot 设置页面截图，个人设置模块包含以下配置项：

| 配置类别 | 具体内容 |
|---------|---------|
| **账户信息** | 头像、姓名、邮箱、电话、职位、部门 |
| **通知偏好** | 邮件通知、App 推送、站内通知（按模块细分） |
| **显示偏好** | 语言（40+语言）、时区、日期格式、数字格式、货币 |
| **隐私设置** | 活动可见性、在线状态 |
| **安全设置** | 修改密码、双因素认证（2FA）、活跃会话管理 |
| **API 密钥** | 个人 API Key 管理（用于集成） |
| **快捷键** | 键盘快捷键映射与自定义 |
| **主题** | 深色/浅色模式切换 |

#### HubSpot 个人设置设计亮点

1. **分类清晰**：左侧设置导航，右侧内容区，按类别组织
2. **即时生效**：大多数设置修改后无需保存按钮，自动应用
3. **预览反馈**：语言/主题切换时有实时预览
4. **权限分级**：部分安全设置（2FA）需要二次验证

#### 我们需要做哪些

| 优先级 | 功能 | 说明 |
|--------|------|------|
| P0 | 个人信息编辑 | 头像、姓名、职位、部门 |
| P0 | 密码修改 | 带旧密码验证 |
| P1 | 通知偏好 | 按模块开关通知（线索提醒、商机提醒等） |
| P1 | 显示偏好 | 语言、时区、日期格式 |
| P2 | 2FA 支持 | 双因素认证（可选） |
| P2 | API Key | 个人 API Key 管理 |
| P2 | 主题切换 | 深色/浅色模式 |

---

### 1.2 日志功能分析（截图 img_011~img_012）

#### 截图中看到的内容

HubSpot 的日志功能包含以下类型：

| 日志类型 | 说明 | 记录内容 |
|---------|------|---------|
| **操作日志（Audit Log）** | 记录用户在系统中的操作 | 操作用户、操作时间、操作类型、受影响记录 |
| **登录日志** | 记录账号登录事件 | 登录时间、IP 地址、设备、浏览器、位置 |
| **数据变更日志（Change Log）** | 记录字段级别的数据变更 | 变更字段、旧值、新值、变更时间 |
| **API 调用日志** | 记录 API 请求（企业版） | 请求时间、API Key、接口、状态码、耗时 |
| **权限变更日志** | 记录用户/角色权限变更 | 变更人、被变更人、权限类型、变更前后 |

#### 日志展示界面设计

- **时间线视图**：按时间倒序，每条记录显示时间戳 + 操作描述 + 操作人
- **筛选器**：按日期范围、操作类型、操作人、对象类型
- **详情展开**：点击展开查看变更详情（字段级）
- **导出功能**：支持导出为 CSV/Excel

#### 我们需要做哪些

| 优先级 | 功能 | 说明 |
|--------|------|------|
| P0 | 操作日志 | 谁在什么时间做了什么操作（登录、创建、编辑、删除、分配） |
| P0 | 登录日志 | 记录账号登录信息（时间、IP、设备） |
| P1 | 数据变更日志 | 记录字段级别变更（旧值 → 新值） |
| P2 | API 调用日志 | 记录 API 请求（可选，先做管理端） |
| P2 | 日志导出 | 支持 CSV/Excel 导出 |

---

### 1.3 自定义对象功能分析（截图 img_013~img_019）—— 核心重点

#### 1.3.1 HubSpot 自定义对象是什么

自定义对象（Custom Objects）是 HubSpot CRM 的**核心扩展机制**，允许用户创建和定义超出标准 CRM 对象范围的关系或流程的业务特定数据。

**关键理解**：
- 标准 CRM 对象：Contacts、Companies、Deals、Tickets、Products 等
- 自定义对象：Pet（宠物）、Cars（车辆）、Subscriptions（订阅）等业务特定实体
- 自定义对象创建后，可以像标准对象一样创建属性、设置 pipelines、与其他对象建立关联、在营销邮件/Workflow/报表中使用

#### 1.3.2 自定义对象核心概念

**对象名称（Object Name）**
- 需要定义**复数名**和**单数名**
- 例如：`Pets`（复数）/ `Pet`（单数）

**主要属性（Primary Display Property）**
- 用于命名对象记录的**主标识属性**
- 自动显示在对象列表页第一列
- 自动显示在记录详情页左上角
- 可用于搜索
- 例如：宠物的 "Pet name"、车辆的 "Model"

**次要属性（Secondary Properties）**
- 额外的标识属性
- 显示在记录的 profile card 中
- 可用于搜索和快速筛选

**标签（Label）vs 内部名（Internal Name）**
- Label：属性在 UI 中显示的名称，可更改
- Internal Name：API/集成使用的名称，**不可更改**

#### 1.3.3 创建自定义对象的流程

```
Step 1: 定义基本信息
├── 对象名称（复数）：Cars
├── 对象名称（单数）：Car
├── 描述：车辆库存和销售线索管理
└── 图标选择

Step 2: 设置主要属性
├── 主要属性：Model（车型）
└── 描述：用于标识每辆车的名称

Step 3: 添加次要属性
├── Brand（品牌）：文本
├── Year（年份）：数字
├── Mileage（里程）：数字
├── Color（颜色）：单选
├── Price（价格）：货币
└── Status（状态）：单选

Step 4: 关联其他对象
├── 关联到：Contacts（车主）
├── 关联到：Deals（销售交易）
└── 关联类型：一对多

Step 5: 设置权限
└── 谁可以创建/编辑/删除/查看

Step 6: 确认创建
└── 生成对象并跳转到对象详情配置页
```

#### 1.3.4 对象的属性管理

**支持的字段类型**：

| 字段类型 | Internal Type | 说明 | 验证规则 |
|---------|--------------|------|---------|
| 单行文本 | `text` | 短文本输入 | maxLength, pattern |
| 多行文本 | `textarea` | 长文本 | maxLength |
| 数字 | `number` | 整数或小数 | min, max, precision |
| 日期 | `date` | 日期选择 | - |
| 日期时间 | `datetime` | 日期+时间 | - |
| 单选 | `select` | 下拉单选 | options[] |
| 多选 | `multiselect` | 下拉多选 | options[] |
| 开关 | `switch` | 是/否 toggle | - |
| 货币 | `currency` | 带货币符号 | min, max |
| 人员 | `user` | 关联到系统用户 | - |
| 部门 | `department` | 关联到部门 | - |
| 关联 | `relation` | 关联到其他对象 | targetObject |
| 附件 | `file` | 文件上传 | maxSize, types[] |
| URL | `url` | 网址链接 | pattern |
| 邮箱 | `email` | 邮箱地址 | pattern |
| 电话 | `phone` | 电话号码 | pattern |
| 评分 | `rating` | 星级评分 | min, max |
| 富文本 | `richtext` | 富文本编辑器 | - |
| 计算字段 | `formula` | 基于其他字段计算 | expression |
| 地址 | `address` | 地址（省市区+详细） | - |

#### 1.3.5 对象的表单设计

**表单设计器功能**：
- **拖拽式布局**：字段可拖拽排序
- **字段分组**：将相关字段分组显示
- **条件显示**：根据其他字段值显示/隐藏字段
- **必填规则**：基于条件动态设置必填
- **多标签页**：大表单可拆分为多个标签页

**表单类型**：

| 表单类型 | 用途 |
|---------|------|
| 创建表单 | 新建记录时的表单 |
| 编辑表单 | 编辑记录时的表单 |
| 详情面板 | 记录详情页中的字段展示 |
| 筛选器表单 | 列表页筛选条件 |
| 批量编辑表单 | 批量编辑时的表单 |

#### 1.3.6 对象间的关系（Associations）

**关系类型**：

| 关系类型 | 说明 | 示例 |
|---------|------|------|
| **一对多（One-to-Many）** | 一个 A 关联多个 B | 一个 Contact 有多个 Deals |
| **多对一（Many-to-One）** | 多个 A 关联一个 B | 多个 Activities 属于一个 Contact |
| **多对多（Many-to-Many）** | 多个 A 关联多个 B | 一个 Contact 关联多个 Companies |
| **自身关联（Self-Reference）** | 对象自身关联自身 | 一个 Contact 的上级是另一个 Contact |

**关系配置项**：

| 配置项 | 说明 |
|--------|------|
| 关系名称 | 如 "ownedCars" |
| 源对象 / 目标对象 | 关系的两端 |
| 关系类型 | 一对多 / 多对一 / 多对多 / 自身关联 |
| 显示名称 | 在两端对象中的显示名称 |
| 详情页显示 | 是否在该对象的详情页显示关联列表 |
| 级联操作 | 删除时的行为（无操作/级联删除/清除关联/限制删除） |

#### 1.3.7 对象的 UI 自动生成

这是自定义对象最强大的特性——**基于定义自动生成完整 UI**：

**列表页自动生成**：
- 自动生成包含所有可显示字段的列表
- 支持列配置（显示/隐藏/排序/宽度）
- 支持筛选器（基于字段类型生成对应筛选器）
- 支持批量操作
- 支持导出

**详情页自动生成**：
- 自动生成三栏布局的详情页
- 左侧：快捷操作按钮
- 中间：字段值展示（基于表单定义）
- 右侧：关联对象列表

**新建/编辑页自动生成**：
- 基于表单定义自动生成表单
- 支持字段分组、标签页、条件显示
- 验证规则自动应用

**看板视图**（可选）：
- 如果对象有阶段（Stage）字段，自动生成看板视图
- 支持拖拽变更阶段

#### 1.3.8 对象的权限控制

| 权限类型 | 说明 |
|---------|------|
| 创建权限 | 谁可以创建该对象的记录 |
| 查看权限 | 谁可以查看该对象的记录 |
| 编辑权限 | 谁可以编辑该对象的记录 |
| 删除权限 | 谁可以删除该对象的记录 |
| 字段级权限 | 某些字段对某些角色不可见或只读 |
| 分配权限 | 谁可以将记录分配给其他人 |

#### 1.3.9 已有对象的扩展

| 扩展维度 | 说明 |
|---------|------|
| 添加属性 | 为已有对象添加新的自定义字段 |
| 添加表单 | 为已有对象创建新的表单（不同场景用不同表单） |
| 添加关系 | 为已有对象添加新的关联关系 |
| 添加 Pipeline | 为已有对象添加销售流程/阶段 |
| 自定义视图 | 为已有对象创建不同的列表视图 |

---

## 二、与现有系统的差距分析

### 2.1 功能对比表

| 功能 | HubSpot | 我们的现状 | 差距 |
|------|---------|-----------|------|
| **自定义对象** | | | |
| 创建自定义对象 | ✅ 完整支持 | ❌ 不支持 | 从零开始 |
| 对象定义（名称/图标/描述） | ✅ | ❌ | 需要新建对象定义表 |
| 主要属性设置 | ✅ | ❌ | 需要新增 `primaryProperty` 概念 |
| 次要属性设置 | ✅ | ❌ | 需要新增 `secondaryProperties` |
| 对象级属性管理 | ✅ | ⚠️ 仅有自定义字段 | 需要升级字段系统 |
| 对象表单设计器 | ✅ | ❌ | 需要全新开发 |
| 对象间关系定义 | ✅ | ⚠️ 仅有 `RELATION` 类型字段 | 需要关系管理系统 |
| 级联操作 | ✅ | ❌ | 需要全新开发 |
| UI 自动生成（列表/详情/表单） | ✅ | ❌ | 需要全新开发 |
| 已有对象扩展 | ✅ | ⚠️ 有限支持（自定义字段） | 需要扩展能力 |
| **个人设置** | | | |
| 个人信息编辑 | ✅ | ❌ | 需要新建个人设置页 |
| 密码修改 | ✅ | ❌ | 需要实现 |
| 通知偏好 | ✅ | ❌ | 需要新建通知系统 |
| 显示偏好（语言/时区/格式） | ✅ | ❌ | 需要 i18n + 格式化工具 |
| 2FA 双因素认证 | ✅ | ❌ | 需要全新开发 |
| API Key 管理 | ✅ | ❌ | 需要 API Key 系统 |
| 主题切换 | ✅ | ❌ | 需要主题系统 |
| **日志系统** | | | |
| 操作日志 | ✅ | ❌ | 需要新建审计日志表 |
| 登录日志 | ✅ | ❌ | 需要新建登录日志表 |
| 数据变更日志 | ✅ | ❌ | 需要字段级别变更追踪 |
| API 调用日志 | ✅ | ❌ | 可选，功能较复杂 |
| 日志查看与筛选 | ✅ | ❌ | 需要日志查看页面 |
| 日志导出 | ✅ | ❌ | 需要导出功能 |

### 2.2 技术架构差距

| 维度 | HubSpot | 我们的现状 | 差距说明 |
|------|---------|-----------|---------|
| 数据模型 | 动态对象模型，支持任意自定义对象 | 静态表结构，字段写死 | 后端需要改造为动态模型 |
| 字段系统 | 属性（Property）+ 选项集（Options Set） | CustomField 较简单 | 需要增强字段系统 |
| 表单系统 | 表单定义（Form Definition）独立存储 | 表单硬编码在组件中 | 需要表单设计器 |
| 权限系统 | 对象级 + 字段级 + 记录级 | 仅记录级 | 需要扩展权限维度 |
| UI 生成 | 后端驱动，前端接收配置动态渲染 | 前端硬编码 | 需要新的 UI 渲染引擎 |

---

## 三、自定义对象产品设计方案（核心）

### 3.1 整体架构

```
前端（React）
├── ObjectBuilder        表单设计器        UI 渲染引擎
├── DynamicForm          DynamicTable      DynamicDetail
└── useCustomObject      useObjectForm     useObjectRelation

Object Metadata API
├── GET /api/objects           获取对象列表
├── POST /api/objects          创建对象
├── GET /api/objects/:id       获取对象详情
├── PUT /api/objects/:id       更新对象
├── POST /api/objects/:id/properties  添加属性
├── POST /api/objects/:id/relations   添加关系
└── POST /api/objects/:id/forms       添加表单

后端（Node.js）
├── ObjectService       FormService       RelationService
├── Metadata Store (PostgreSQL)
│   └── objects | properties | forms | relations
└── Dynamic Data Store (PostgreSQL)
    └── object_{objectId} 表 或 JSONB 列
```

---

### 3.2 对象定义（Object Definition）

#### 3.2.1 核心数据模型

```typescript
// src/types/customObject.ts

/**
 * 自定义对象定义
 */
export interface CustomObject {
  id: string;
  /** 对象标识名（用于 API，字母数字下划线） */
  name: string;
  /** 单数名称（用于 UI 展示） */
  singularName: string;
  /** 复数名称（用于 UI 展示） */
  pluralName: string;
  /** 对象描述 */
  description?: string;
  /** 对象图标（Lucide 图标名） */
  icon?: string;
  /** 对象图标颜色 */
  iconColor?: string;
  /** 主要属性名称（指向 properties 中的一个属性） */
  primaryProperty: string;
  /** 次要属性名称列表 */
  secondaryProperties: string[];
  /** 是否启用 */
  enabled: boolean;
  /** 是否为系统对象（不可删除） */
  system: boolean;
  /** 排序权重（用于导航顺序） */
  sortOrder: number;
  /** 是否在导航中显示 */
  showInNavigation: boolean;
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
}

/**
 * 对象属性定义
 */
export interface ObjectProperty {
  id: string;
  objectId: string;
  /** 属性名称（API 用） */
  name: string;
  /** 显示标签 */
  label: string;
  /** 内部类型 */
  internalType: PropertyType;
  /** 是否为主要属性 */
  isPrimary: boolean;
  /** 是否为次要属性 */
  isSecondary: boolean;
  /** 字段分组 */
  group?: string;
  /** 帮助文本 */
  description?: string;
  /** 占位符 */
  placeholder?: string;
  /** 默认值 */
  defaultValue?: any;
  required: boolean;
  /** 是否在列表中显示 */
  listVisible: boolean;
  /** 是否在详情中显示 */
  detailVisible: boolean;
  searchable: boolean;
  sortable: boolean;
  bulkEditable: boolean;
  validation?: PropertyValidation;
  options?: PropertyOption[];
  optionsSetId?: string;
  targetObjectId?: string;
  multiple?: boolean;
  sortOrder: number;
  enabled: boolean;
  createdBy: string;
  createdAt: string;
}

/**
 * 属性类型枚举
 */
export enum PropertyType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  NUMBER = 'number',
  DECIMAL = 'decimal',
  DATE = 'date',
  DATETIME = 'datetime',
  TIME = 'time',
  SELECT = 'select',
  MULTISELECT = 'multiselect',
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  SWITCH = 'switch',
  CURRENCY = 'currency',
  PERCENT = 'percent',
  PHONE = 'phone',
  EMAIL = 'email',
  URL = 'url',
  USER = 'user',
  DEPARTMENT = 'department',
  FILE = 'file',
  IMAGE = 'image',
  VIDEO = 'video',
  RICHTEXT = 'richtext',
  FORMULA = 'formula',
  ROLLUP = 'rollup',
  RELATION = 'relation',
  ADDRESS = 'address',
  RATING = 'rating',
}

/**
 * 属性验证规则
 */
export interface PropertyValidation {
  unique?: boolean;
  hidden?: boolean;
  readOnly?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  precision?: number;
  pattern?: string;
  patternMessage?: string;
  maxSize?: number;
  allowedTypes?: string[];
  errorMessage?: string;
}

/**
 * 属性选项
 */
export interface PropertyOption {
  value: string;
  label: string;
  color?: string;
  sortOrder: number;
  enabled: boolean;
}

/**
 * 对象关系定义
 */
export interface ObjectRelation {
  id: string;
  name: string;
  sourceObjectId: string;
  targetObjectId: string;
  type: 'one_to_many' | 'many_to_one' | 'many_to_many' | 'self';
  sourceLabel: string;
  targetLabel: string;
  sourceDisplay: boolean;
  targetDisplay: boolean;
  sourceDisplayType: 'card' | 'list' | 'count';
  targetDisplayType: 'card' | 'list' | 'count';
  deleteCascade: 'none' | 'cascade' | 'clear' | 'restricted';
  enabled: boolean;
  createdBy: string;
  createdAt: string;
}

/**
 * 表单定义
 */
export interface ObjectForm {
  id: string;
  objectId: string;
  name: string;
  label: string;
  type: 'create' | 'edit' | 'detail' | 'filter' | 'bulk_edit';
  layout: FormLayout;
  isDefault: boolean;
  enabled: boolean;
  createdBy: string;
  createdAt: string;
}

/**
 * 表单布局
 */
export interface FormLayout {
  type: 'single_column' | 'two_column' | 'tabs' | 'accordion';
  sections: FormSection[];
}

/**
 * 表单区块
 */
export interface FormSection {
  id: string;
  title?: string;
  fields: string[];
  conditions?: FormCondition[];
  collapsible?: boolean;
  collapsed?: boolean;
  sortOrder: number;
}

/**
 * 表单条件
 */
export interface FormCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' |
            'greater_than' | 'less_than' | 'is_empty' | 'is_not_empty';
  value: any;
  combinator?: 'and' | 'or';
}
```

#### 3.2.2 对象定义编辑器 UI

**页面结构：**

```
+------------------------------------------------------------------------------+
|  自定义对象                                                        [保存][取消] |
+------------------------------------------------------------------------------+
|                                                                              |
|  ## 1. 基本信息                                                              |
|  ----------------------------------------------------------------------------|
|  对象标识名*         复数名称*            单数名称*                          |
|  [vehicles        ]  [车辆              ]  [车辆              ]            |
|  (用于 API 和数据库内部，字母数字下划线，不可更改)                             |
|                                                                              |
|  描述                                                                       |
|  [车辆库存和销售线索管理，记录车辆基本信息、销售状态、关联客户等。   ]          |
|                                                                              |
|  图标                              图标颜色                                  |
|  [Car Icon v]                       [#2359A2         ]                      |
+------------------------------------------------------------------------------+
|                                                                              |
|  ## 2. 主要属性与次要属性                                                     |
|  ----------------------------------------------------------------------------|
|  主要属性*（用于标识每条记录）                                                |
|  [● Model（车型）                                        已选择              ]|
|  (将成为记录的默认显示名称，用于列表页和详情页顶部)                            |
|                                                                              |
|  次要属性（可选，用于在记录卡片上显示额外信息）                                |
|  [○ Brand（品牌）   ○ Year（年份）   ○ Status（状态）   [+ 添加]      ]      |
|                                                                              |
|  预览：                                                                     |
|  [ Tesla Model 3（2024）  ● 已上架                                       ]   |
|  [ 品牌：Tesla  年份：2024  状态：已上架                                  ]   |
+------------------------------------------------------------------------------+
|                                                                              |
|  ## 3. 属性管理                                            [+ 添加属性]        |
|  ----------------------------------------------------------------------------|
|  拖拽排序 | 显示：全部 / 文本 / 数字 / 选择 / 关联               [搜索...]       |
|  ----------------------------------------------------------------------------|
|  | || Model   | 车型    | 单行文本 | 主[ ] 次[✓] | 列表[✓] | [编辑][删除]  |
|  | || Brand   | 品牌    | 单选     | 主[ ] 次[✓] | 列表[✓] |              |
|  | || Year    | 年份    | 数字     | 主[ ] 次[✓] | 列表[✓] |              |
|  | || Price   | 价格    | 货币     | 主[ ] 次[ ] | 列表[✓] |              |
|  | || Status  | 状态    | 单选     | 主[ ] 次[✓] | 列表[✓] |              |
|  | || Owner   | 车主    | 关联→Contact | 主[ ] 次[✓] | 列表[✓] |        |
|  ----------------------------------------------------------------------------|
+------------------------------------------------------------------------------+
|                                                                              |
|  ## 4. 关联对象                                          [+ 添加关联]           |
|  ----------------------------------------------------------------------------|
|  关联               | 显示名称      | 类型        | 详情页显示 | 级联删除         |
|  Contact（联系人）  | 车主          | 一对多 [v]  | [✓]        | 清除关联 [v]     |
|  Deal（商机）       | 销售交易      | 一对多 [v]  | [✓]        | 无操作    [v]    |
+------------------------------------------------------------------------------+
|                                                                              |
|  ## 5. 表单设计                                          [+ 创建表单]           |
|  ----------------------------------------------------------------------------|
|  表单列表：                                                                   |
|  [📝 创建车辆表单      类型：创建    默认：[✓]    [编辑][删除]          ]       |
|  [📝 编辑车辆表单      类型：编辑    默认：[ ]    [编辑][删除]          ]       |
|  [📝 车辆详情面板      类型：详情    默认：[✓]    [编辑][删除]          ]       |
+------------------------------------------------------------------------------+
|                                                                              |
|  ## 6. 权限设置                                                              |
|  ----------------------------------------------------------------------------|
|  ( ) 所有人均可访问（默认）                                                    |
|  (●) 仅指定角色可访问                                                         |
|      [✓] 管理员   [✓] 销售经理   [ ] 销售代表   [ ] 客服   [+ 添加角色]     |
+------------------------------------------------------------------------------+
```

#### 3.2.3 属性添加/编辑弹窗

```
+------------------------------------------------------------------------------+
|  添加属性                                                         [× 关闭]     |
+------------------------------------------------------------------------------+
|                                                                              |
|  字段类型*                                                                   |
|  [单行文本                         v]                                         |
|                                                                              |
|  属性名称*（用于 API，不可更改）                                                |
|  [model                                                               ]       |
|  (将作为数据库字段名，仅支持字母、数字、下划线)                                 |
|                                                                              |
|  显示标签*                                                                   |
|  [车型                                                               ]       |
|                                                                              |
|  帮助文本（可选）                                                              |
|  [输入车辆的具体车型，如 "Model 3"、"Civic"、"Camry"                    ]       |
|                                                                              |
|  验证规则                                                                     |
|  [✓] 必填    [✓] 唯一    [ ] 隐藏    [ ] 只读                               |
|  最小长度：[0  ]    最大长度：[100]                                           |
|                                                                              |
|  显示设置                                                                     |
|  [ ] 在列表中显示   [✓] 在详情中显示   [✓] 可搜索   [✓] 可排序   [ ] 批量编辑 |
|                                                                              |
|  ( ) 不作为主要或次要属性                                                       |
|  (●) 作为主要属性                                                              |
|  ( ) 作为次要属性                                                              |
|                                                                              |
|                                                           [取消]  [保存]       |
+------------------------------------------------------------------------------+
```

---

### 3.3 表单设计器（Form Designer）

#### 3.3.1 表单设计器 UI

```
+------------------------------------------------------------------------------+
|  表单设计器 — 车辆：创建表单                                        [保存][取消]|
+--------+---------------------------------------------------------------------+
|        |                                                                     |
| 字段面板 | 画布（拖拽区域）                                                    |
|        |                                                                     |
| --分组--| +----------------------------------------------------------------+ |
| [文本  ]| | 基本信息                                           [v 折叠]     | |
| [数字  ]| | -----------------------------------------------------------     | |
| [日期  ]| |                                                                | |
| [选择  ]| | 车型*                                  品牌                      | |
| [多选  ]| | +-------------------------------+  +------------------------+ | |
| [关联  ]| | | Model                        |  | | [Select v]            | | | |
| [人员  ]| | +-------------------------------+  +------------------------+ | |
| [文件  ]| |                                                                | |
| --已选--| | 年份                                  价格                      | |
| [Brand ]| | +-------------------------------+  +------------------------+ | |
| [Model ]| | | [Number]                     |  | [Currency              ]| | |
| [Year  ]| | +-------------------------------+  +------------------------+ | |
| [Price ]| +----------------------------------------------------------------+ |
|        |                                                                     |
|        | +----------------------------------------------------------------+ |
|        | | 车辆状况                                         [v 折叠]       | |
|        | | -----------------------------------------------------------     | |
|        | |                                                                | |
|        | | 里程                                  颜色                       | |
|        | | +-------------------------------+  +------------------------+ | |
|        | | | [Number]                     |  | | [MultiSelect v]       | | |
|        | | +-------------------------------+  +------------------------+ | |
|        | +----------------------------------------------------------------+ |
|        |                                                                     |
|        | +----------------------------------------------------------------+ |
|        | | 关联信息                                         [v 折叠]       | |
|        | | -----------------------------------------------------------     | |
|        | |                                                                | |
|        | | 车主（联系人）                          图片上传                 | |
|        | | +-------------------------------+  +------------------------+ | |
|        | | | [RelationSelector Contact]   |  | [ImageUpload]          | | |
|        | | +-------------------------------+  +------------------------+ | |
|        | +----------------------------------------------------------------+ |
|        |                                                                     |
|        | 拖拽字段到画布中，或点击字段添加                           [预览表单] |
+--------+---------------------------------------------------------------------+
```

#### 3.3.2 字段属性配置面板

当在画布中选中某个字段时，右侧显示该字段的配置项：

```
+------------------------------------------------------------------------------+
|  字段属性配置                                                                   |
|  ----------------------------------------------------------------------------|
|                                                                              |
|  字段：Model（车型）                                                           |
|                                                                              |
|  显示标签                                                                     |
|  [车型                                                               ]       |
|                                                                              |
|  字段类型：单行文本（不可更改）                                                 |
|                                                                              |
|  验证规则                                                                     |
|  [✓] 必填                                                                    |
|                                                                              |
|  宽度                                                                         |
|  (●) 整行    ( ) 半行    ( ) 三分之一                                         |
|                                                                              |
|  提示文字                                                                     |
|  [请输入车辆型号，如 "Model 3"                                     ]          |
|                                                                              |
|  条件显示                                                                     |
|  [添加条件...]                                                                |
|                                                                              |
|  -- 条件（暂无）--                                                            |
|                                                                              |
|                                              [应用到所有同类字段]  [移除字段]   |
+------------------------------------------------------------------------------+
```

---

### 3.4 关系管理（Relation Manager）

#### 3.4.1 关系定义 UI

```
+------------------------------------------------------------------------------+
|  添加关联                                                         [× 关闭]     |
+------------------------------------------------------------------------------+
|                                                                              |
|  目标对象*                                                                   |
|  [请选择对象                                    v]                             |
|                                                                              |
|  (选择了 "Contact（联系人）")                                                |
|                                                                              |
|  关系标识名*（用于 API）                                                      |
|  [car_owners                                                            ]    |
|  (用于 API 和数据库内部，字母数字下划线)                                       |
|                                                                              |
|  关系类型*                                                                   |
|  (●) 一对多    ( ) 多对一    ( ) 多对多    ( ) 自身关联                       |
|                                                                              |
|  说明：                                                                      |
|  (●) 一对多：一个车辆可以关联多个联系人（车主）                                  |
|  ( ) 多对一：多个车辆关联到一个联系人（用于车辆共享场景）                         |
|                                                                              |
|  在源对象（车辆）中的显示名称*                                                 |
|  [车主（联系人）                                                    ]          |
|                                                                              |
|  在目标对象（联系人）中的显示名称*                                              |
|  [拥有的车辆                                                    ]          |
|                                                                              |
|  详情页显示设置                                                               |
|  [✓] 在车辆详情页显示关联的联系人列表                                           |
|  [✓] 在联系人详情页显示关联的车辆列表                                           |
|                                                                              |
|  显示方式                                                                    |
|  车辆详情页：[●] 卡片列表    ( ) 简洁列表    ( ) 仅显示数量                      |
|  联系人详情页：[●] 卡片列表  ( ) 简洁列表    ( ) 仅显示数量                      |
|                                                                              |
|  删除时的行为                                                                  |
|  删除车辆时：[v 清除关联（保留联系人）                           ]              |
|  选项：                                                                      |
|  - 无操作：仅删除车辆，关联关系保持                                              |
|  - 清除关联：删除车辆时，清空关联的联系人记录中的车辆字段                          |
|  - 级联删除：删除车辆时，同时删除关联的联系人（需二次确认）                        |
|  - 限制删除：如果车辆有关联联系人，则不允许删除                                   |
|                                                                              |
|  初始筛选条件（可选）                                                          |
|  [添加筛选条件...]                                                            |
|  用于在详情页默认显示符合条件的关联记录                                           |
|                                                                              |
|                                                           [取消]  [保存]       |
+------------------------------------------------------------------------------+
```

---

### 3.5 UI 自动生成引擎

#### 3.5.1 渲染引擎架构

```typescript
// src/components/DynamicRenderer/

/**
 * 动态对象列表页
 */
export const DynamicObjectList: React.FC<DynamicObjectListProps> = ({
  objectId,
  objectDefinition,
  properties,
  formDefinition,
}) => {
  const [view, setView] = useState<'list' | 'kanban'>('list');

  // 基于对象定义生成列配置
  const columns = useMemo(() => {
    return properties
      .filter(p => p.listVisible && p.enabled)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(property => ({
        key: property.name,
        dataIndex: property.name,
        title: property.label,
        width: getColumnWidth(property.internalType),
        sortable: property.sortable,
        render: (value: any, record: any) => (
          <DynamicCell property={property} value={value} />
        ),
      }));
  }, [properties]);

  // ... 列表视图渲染
  // ... 看板视图渲染（如果对象有 stage 字段）
  // ... 筛选器生成
  // ... 批量操作
};
```

#### 3.5.2 动态字段渲染映射

```typescript
// src/components/DynamicRenderer/FieldRenderer.tsx

const FIELD_RENDERERS: Record<PropertyType, React.FC<FieldProps>> = {
  [PropertyType.TEXT]: TextField,
  [PropertyType.TEXTAREA]: TextAreaField,
  [PropertyType.NUMBER]: NumberField,
  [PropertyType.DECIMAL]: DecimalField,
  [PropertyType.DATE]: DateField,
  [PropertyType.DATETIME]: DateTimeField,
  [PropertyType.SELECT]: SelectField,
  [PropertyType.MULTISELECT]: MultiSelectField,
  [PropertyType.SWITCH]: SwitchField,
  [PropertyType.CURRENCY]: CurrencyField,
  [PropertyType.PERCENT]: PercentField,
  [PropertyType.PHONE]: PhoneField,
  [PropertyType.EMAIL]: EmailField,
  [PropertyType.URL]: UrlField,
  [PropertyType.USER]: UserField,
  [PropertyType.DEPARTMENT]: DepartmentField,
  [PropertyType.FILE]: FileField,
  [PropertyType.IMAGE]: ImageField,
  [PropertyType.VIDEO]: VideoField,
  [PropertyType.RICHTEXT]: RichTextField,
  [PropertyType.RATING]: RatingField,
  [PropertyType.ADDRESS]: AddressField,
  [PropertyType.RELATION]: RelationField,
  // 计算字段（只读）
  [PropertyType.FORMULA]: FormulaField,
  [PropertyType.ROLLUP]: RollupField,
};
```

#### 3.5.3 动态详情页布局

```typescript
// 基于表单定义生成详情页布局

interface DynamicDetailLayout {
  leftPanel: {
    actions: ActionButton[];    // 操作按钮
    width: number;
  };
  centerPanel: {
    sections: DetailSection[];  // 字段区块
  };
  rightPanel: {
    associations: AssociationCard[];
    width: number;
  };
}

// 根据 formDefinition.layout 解析生成布局
function buildDetailLayout(
  form: ObjectForm,
  properties: ObjectProperty[],
  relations: ObjectRelation[]
): DynamicDetailLayout {
  return {
    leftPanel: {
      actions: getDefaultActions(form.type),
      width: 240,
    },
    centerPanel: {
      sections: form.layout.sections.map(section => ({
        title: section.title,
        fields: section.fields.map(fieldName =>
          properties.find(p => p.name === fieldName)
        ).filter(Boolean),
        collapsible: section.collapsible,
        defaultCollapsed: section.collapsed,
      })),
    },
    rightPanel: {
      associations: relations
        .filter(r => r.targetDisplay && r.enabled)
        .map(relation => ({
          id: relation.id,
          title: relation.targetLabel,
          targetObjectId: relation.targetObjectId,
          displayType: relation.targetDisplayType,
        })),
      width: 320,
    },
  };
}
```

---

### 3.6 数据结构设计

#### 3.6.1 元数据存储（Metadata Store）
存储所有对象定义、属性定义、表单定义、关系定义，使用 PostgreSQL 关系型数据库，表结构如下：

| 表名 | 主键 | 核心字段 | 说明 |
|------|------|---------|------|
| `objects` | `id` | `name`, `singular_name`, `plural_name`, `icon`, `icon_color`, `primary_property`, `secondary_properties`, `system`, `enabled`, `sort_order`, `show_in_navigation` | 自定义对象基础定义 |
| `object_properties` | `id` | `object_id`, `name`, `label`, `internal_type`, `is_primary`, `is_secondary`, `group`, `required`, `list_visible`, `detail_visible`, `searchable`, `sortable`, `bulk_editable`, `validation`, `options`, `target_object_id`, `multiple`, `sort_order`, `enabled` | 对象属性定义 |
| `object_relations` | `id` | `name`, `source_object_id`, `target_object_id`, `type`, `source_label`, `target_label`, `source_display`, `target_display`, `source_display_type`, `target_display_type`, `delete_cascade`, `enabled` | 对象关系定义 |
| `object_forms` | `id` | `object_id`, `name`, `label`, `type`, `layout`, `is_default`, `enabled` | 表单定义 |
| `options_sets` | `id` | `name`, `options`, `enabled` | 选项集（全局复用的下拉选项） |

#### 3.6.2 对象数据存储（Dynamic Data Store）
对象数据存储有三种实现方案，各有优缺点：

**方案一：动态表方案**
- 每个自定义对象创建一个独立的物理表 `object_{objectId}`
- 每个属性对应一个列
- 优点：性能最高，支持索引、SQL 查询
- 缺点：修改属性/删除属性时需要变更表结构，可能导致锁表；表数量随自定义对象增多而线性增长

**方案二：EAV（Entity-Attribute-Value）模型**
- 使用统一的 `object_records` 表存储所有对象的记录 ID
- 使用 `object_record_values` 表存储字段值（record_id, property_id, value）
- 优点：结构灵活，无需变更表结构
- 缺点：关联查询复杂，性能较低，大数据量时查询较慢

**方案三：JSONB 方案（推荐）**
- 使用统一的 `object_records` 表：`id`, `object_id`, `data` (JSONB), `created_at`, `updated_at`, `created_by`, `updated_by`
- 所有属性值存储在 `data` JSONB 字段中
- 优点：结构灵活，无需变更表结构，支持 JSON 索引
- 缺点：数据冗余，查询复杂度略高，但 PostgreSQL JSONB 性能优异，适合大多数场景

**推荐选型：JSONB 方案**，兼顾灵活性和性能，适合中小规模 CRM 系统（单表百万级记录性能无压力）。

#### 3.6.3 性能优化考虑
1. **索引优化**：对常用的查询字段添加 GIN 索引（JSONB 字段）、B-tree 索引（object_id, created_at 等）
2. **缓存机制**：对象定义、属性定义等元数据很少变更，可缓存到 Redis 中，降低数据库访问压力
3. **懒加载**：详情页右侧关联列表默认懒加载，避免过多关联查询
4. **分页查询**：列表页强制分页，避免全表扫描
5. **搜索优化**：集成 Elasticsearch 或 PostgreSQL 全文搜索，支持跨字段模糊搜索

---

## 四、个人设置设计方案

### 4.1 页面结构
左侧导航分类，右侧内容区，统一使用两栏布局：

```
+---------------------------------+----------------------------------+
| 个人设置                         |                                  |
|------------------------------    |                                  |
| ● 账户信息                     | 【账户信息编辑区域】                |
| ○ 通知偏好                     |                                  |
| ○ 显示偏好                     |                                  |
| ○ 安全设置                     |                                  |
| ○ API 密钥                     |                                  |
| ○ 主题设置                     |                                  |
+---------------------------------+----------------------------------+
```

### 4.2 模块详细设计

#### 4.2.1 账户信息
| 字段 | 说明 | 可编辑 |
|------|------|-------|
| 头像 | 用户头像上传，支持 200x200 裁剪 | ✅ |
| 姓名 | 用户姓名 | ✅ |
| 邮箱 | 登录邮箱 | ❌（如需修改走邮箱验证流程） |
| 电话 | 联系电话 | ✅ |
| 职位 | 职位名称 | ✅ |
| 部门 | 所属部门 | ✅ |
| 加入时间 | 账号创建时间 | ❌ |
| 最后登录 | 最后登录时间 | ❌ |

#### 4.2.2 通知偏好
按模块细分通知开关：

| 模块 | 邮件通知 | 站内通知 | App 推送 |
|------|---------|---------|---------|
| 客户管理 | [ ] / [✓] | [ ] / [✓] | [ ] / [✓] |
| 商机管理 | [ ] / [✓] | [ ] / [✓] | [ ] / [✓] |
| 工单管理 | [ ] / [✓] | [ ] / [✓] | [ ] / [✓] |
| 系统通知 | [ ] / [✓] | [ ] / [✓] | [ ] / [✓] |

#### 4.2.3 显示偏好
| 配置项 | 选项 | 默认值 |
|--------|------|-------|
| 语言 | 中文 / English / 日文 | 中文 |
| 时区 | 全球时区列表 | 亚洲/上海 |
| 日期格式 | `YYYY-MM-DD` / `MM/DD/YYYY` / `DD/MM/YYYY` | `YYYY-MM-DD` |
| 时间格式 | 24小时制 / 12小时制 | 24小时制 |
| 数字格式 | `1,234,567` / `1.234.567` | `1,234,567` |
| 货币符号 | 人民币 / 美元 / 欧元 / 日元 | 人民币 |

#### 4.2.4 安全设置
| 功能 | 说明 |
|------|------|
| 修改密码 | 旧密码 + 新密码 + 确认密码，带强度校验 |
| 双因素认证（2FA） | 支持 Google Authenticator，开启时需要二次验证 |
| 活跃会话管理 | 查看当前登录的设备，可远程登出其他会话 |
| 登录IP白名单 | 可选，仅允许指定IP段登录 |

#### 4.2.5 API 密钥管理
| 功能 | 说明 |
|------|------|
| 生成 API Key | 生成带过期时间的 API Key，用于集成 |
| 密钥列表 | 显示已生成的密钥（隐藏中间部分）、创建时间、过期时间、最后使用时间 |
| 撤销密钥 | 可随时撤销密钥，使其失效 |

#### 4.2.6 主题设置
| 配置项 | 选项 | 默认值 |
|--------|------|-------|
| 主题模式 | 浅色 / 深色 / 跟随系统 | 浅色 |
| 主色调 | 蓝色 / 绿色 / 橙色 / 紫色 | 蓝色 |
| 导航模式 | 侧边栏 / 顶部导航 | 侧边栏 |

---

## 五、日志功能设计方案

### 5.1 日志类型与数据结构

#### 5.1.1 操作日志（`audit_logs`）
记录用户的所有操作：
| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | 主键 | - |
| `user_id` | 字符串 | 操作用户ID |
| `user_name` | 字符串 | 操作用户名 |
| `action` | 枚举 | `create` / `update` / `delete` / `login` / `logout` / `assign` / `export` 等 |
| `object_type` | 字符串 | 操作对象类型（如 `customer` / `contact` / `opportunity`） |
| `object_id` | 字符串 | 操作对象ID |
| `object_name` | 字符串 | 操作对象名称（用于展示） |
| `ip_address` | 字符串 | 操作IP地址 |
| `user_agent` | 字符串 | 浏览器/设备信息 |
| `details` | JSON | 操作详情（如变更字段、旧值/新值） |
| `created_at` | 时间 | 操作时间 |

#### 5.1.2 登录日志（`login_logs`）
独立记录登录事件：
| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | 主键 | - |
| `user_id` | 字符串 | 用户ID |
| `user_name` | 字符串 | 用户名 |
| `ip_address` | 字符串 | 登录IP |
| `location` | 字符串 | IP地理位置（可选） |
| `user_agent` | 字符串 | 浏览器/设备 |
| `status` | 枚举 | `success` / `failed` |
| `fail_reason` | 字符串 | 失败原因（密码错误/账号锁定等） |
| `session_id` | 字符串 | 会话ID |
| `created_at` | 时间 | 登录时间 |

#### 5.1.3 数据变更日志（`change_logs`）
字段级别变更追踪：
| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | 主键 | - |
| `audit_log_id` | 外键 | 关联操作日志ID |
| `object_type` | 字符串 | 对象类型 |
| `object_id` | 字符串 | 对象ID |
| `field_name` | 字符串 | 变更字段名 |
| `field_label` | 字符串 | 变更字段显示名 |
| `old_value` | JSON | 变更前值 |
| `new_value` | JSON | 变更后值 |
| `changed_by` | 字符串 | 变更人 |
| `created_at` | 时间 | 变更时间 |

### 5.2 日志查看页面设计
```
+------------------------------------------------------------------------------+
|  系统日志                                                       [导出] [刷新]   |
+------------------------------------------------------------------------------+
|                                                                              |
|  筛选栏：                                                                     |
|  时间范围：[最近7天 ▼]    操作类型：[全部 ▼]    操作人：[全部 ▼]    [搜索...]   |
|                                                                              |
+------------------------------------------------------------------------------+
|  时间                | 操作人  | 操作类型 | 操作对象       | IP地址        | 操作 |
+------------------------------------------------------------------------------+
| 2026-03-24 14:30:21 | 张三    | 编辑客户 | 深圳市腾讯科技 | 192.168.1.101 | [详情] |
| 2026-03-24 14:22:15 | 李四    | 新建商机 | ERP系统采购     | 192.168.1.102 | [详情] |
| 2026-03-24 14:15:03 | 王五    | 登录系统 | -              | 192.168.1.103 |        |
+------------------------------------------------------------------------------+
| 分页：< 1 2 3 >                                                                 |
+------------------------------------------------------------------------------+
```

**点击「详情」弹窗显示**：
```
+------------------------------------------------------------------------------+
| 操作详情                                                                       |
+------------------------------------------------------------------------------+
| 基本信息：                                                                     |
| 操作人：张三  | 操作时间：2026-03-24 14:30:21 | IP：192.168.1.101              |
| 操作类型：编辑客户 | 操作对象：深圳市腾讯科技（ID: CUST-20260001）              |
|                                                                              |
| 变更内容：                                                                     |
| +----------------+------------------------+------------------------+         |
| | 字段名称       | 变更前                  | 变更后                  |         |
| +----------------+------------------------+------------------------+         |
| | 客户等级       | B                      | A                      |         |
| | 跟进状态       | 跟进中                  | 已成交                 |         |
| +----------------+------------------------+------------------------+         |
+------------------------------------------------------------------------------+
```

### 5.3 日志权限与保留策略
- 权限：仅管理员和审计角色可以查看所有日志，普通用户仅能查看自己的操作日志
- 保留策略：默认保留180天，超过180天的日志自动归档到冷存储
- 不可篡改：日志记录一旦生成，不可修改或删除，保证审计可追溯性

---

## 六、实施计划

### Phase 1：个人设置 + 日志功能（1-2周）
| 任务 | 负责人 | 交付物 | 验收标准 |
|------|--------|-------|---------|
| 个人设置页面开发 | 前端 | `src/pages/settings/Profile.tsx` | 账户信息、密码修改功能完成 |
| 日志后端接口开发 | 后端 | 日志表设计 + CRUD接口 | 可记录和查询操作日志、登录日志 |
| 日志页面开发 | 前端 | `src/pages/settings/AuditLogs.tsx` | 日志列表、详情、筛选功能完成 |
| 日志记录埋点 | 后端 + 前端 | 关键操作埋点 | 创建/编辑/删除/登录等操作自动记录日志 |

### Phase 2：自定义对象基础（对象定义 + 属性管理）（3-4周）
| 任务 | 负责人 | 交付物 | 验收标准 |
|------|--------|-------|---------|
| 元数据表设计 | 后端 | objects / object_properties 表 | 可存储对象和属性定义 |
| 对象管理API开发 | 后端 | `/api/objects` 系列接口 | CRUD对象和属性 |
| 对象定义页面开发 | 前端 | `src/pages/settings/CustomObjects.tsx` | 可创建/编辑/删除自定义对象 |
| 属性管理页面开发 | 前端 | 新增属性弹窗 + 属性列表 | 可添加/编辑/删除对象属性 |
| 现有自定义字段迁移 | 后端 + 前端 | 数据迁移脚本 | 现有自定义字段迁移到新的对象属性系统 |

### Phase 3：表单设计器 + UI 自动生成（3-4周）
| 任务 | 负责人 | 交付物 | 验收标准 |
|------|--------|-------|---------|
| 表单定义API开发 | 后端 | `/api/objects/:id/forms` 接口 | 可保存和读取表单定义 |
| 表单设计器开发 | 前端 | FormDesigner组件 | 拖拽式表单编辑，支持字段分组、条件显示 |
| 动态渲染引擎开发 | 前端 | DynamicForm / DynamicTable / DynamicDetail组件 | 可根据对象定义自动渲染表单、列表、详情页 |
| 自定义对象路由自动生成 | 前端 | 路由配置生成逻辑 | 自定义对象创建后自动在侧边栏显示，可访问列表/详情页 |
| 测试自定义对象端到端流程 | 测试 | 测试用例 | 创建自定义对象 → 添加属性 → 设计表单 → 可正常添加/编辑/查看记录 |

### Phase 4：关系管理 + 高级功能（2-3周）
| 任务 | 负责人 | 交付物 | 验收标准 |
|------|--------|-------|---------|
| 对象关系API开发 | 后端 | `/api/objects/:id/relations` 接口 | 可定义和存储对象间关系 |
| 关联字段支持 | 前端 + 后端 | RelationField组件 | 可在表单中选择关联对象的记录 |
| 关联列表显示 | 前端 | 详情页右侧关联列表 | 可在详情页显示关联对象记录 |
| 级联操作实现 | 后端 | 删除/更新时的级联逻辑 | 级联删除/清除关联等逻辑生效 |
| 权限控制实现 | 后端 + 前端 | 对象级/字段级权限 | 按角色控制对象和字段的访问权限 |
| 性能优化和测试 | 全栈 | 性能测试报告 | 自定义对象列表/详情页加载时间 < 2s，支持10万级记录 |

---
*文档生成完成，核心内容覆盖自定义对象、个人设置、日志功能三大模块，重点突出自定义对象的完整设计方案。*