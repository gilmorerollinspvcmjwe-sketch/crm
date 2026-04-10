# CRM UI 升级项目 - 迁移计划 V5

> 基于 PM 设置功能对比分析报告制定
> 项目路径：C:\Users\13609\Projects\crm-ui-upgrade
> 原项目路径：C:\Users\13609\.openclaw\workspace\crm2026-4-3new
> 制定时间：2026-04-08
> 版本：V5（聚焦设置功能差异修复）

---

## 一、问题总结

### 1.1 P0 严重问题（必须修复）

| 问题 | 原项目 | 新项目 | 影响 |
|------|--------|--------|------|
| **审计日志** | ✅ 完整（236行） | ❌ 路由重定向，页面缺失 | 无法查看系统操作日志 |
| **登录日志** | ✅ 完整（288行） | ❌ 路由重定向，页面缺失 | 无法查看登录记录 |
| **角色管理** | ❌ 空壳 | ❌ 空壳 | 无法管理系统角色 |
| **权限管理** | ❌ 空壳 | ❌ 空壳 | 无法配置权限 |

### 1.2 P1 重要问题（需要完善）

| 问题 | 原项目 | 新项目 | 影响 |
|------|--------|--------|------|
| 表单设计器 | ✅ 独立页面 | ❌ 缺失 | 无法自定义表单布局 |
| 页面构建器 | ✅ 独立页面 | ❌ 缺失 | 无法自定义页面布局 |
| 视图管理器 | ✅ 独立页面 | ❌ 缺失 | 无法自定义列表视图 |
| 管道管理器 | ✅ 独立页面 | ❌ 缺失 | 无法配置销售管道 |
| 对象关系管理 | ✅ 独立页面 | ❌ 缺失 | 无法管理对象关联 |
| Mock 数据 | 23个文件 | 7个文件 | 影响前端开发和测试 |

---

## 二、P0 修复计划

### 2.1 审计日志功能修复

**原项目文件**: `crm2026-4-3new\src\pages\settings\AuditLog.tsx`
**新项目当前状态**: 路由重定向到 `/settings`，页面不存在

#### 2.1.1 迁移方案

**方案A - 直接迁移（推荐）**:
1. 从原项目复制 `AuditLog.tsx`
2. 适配 shadcn/ui 组件库
3. 更新 types/index.ts 导出

**方案B - 新建实现**:
1. 参考原项目功能
2. 使用新项目技术栈重新实现

#### 2.1.2 审计日志功能清单

| 功能 | 说明 | 优先级 |
|------|------|--------|
| 日志列表 | DataTable 展示所有审计日志 | P0 |
| 筛选功能 | 按操作类型、模块、操作人、时间筛选 | P0 |
| 时间范围 | 支持快捷筛选（今天/本周/本月/自定义） | P0 |
| 详情查看 | Modal 展示单条日志详情 | P0 |
| 导出功能 | 导出 CSV/Excel | P1 |
| 统计概览 | 顶部统计卡片（总数、操作类型分布） | P1 |

#### 2.1.3 Mock 数据

从原项目迁移 `auditLogData` 或新建 `mock/auditLogData.ts`

---

### 2.2 登录日志功能修复

**原项目文件**: `crm2026-4-3new\src\pages\settings\LoginLog.tsx`
**新项目当前状态**: 路由重定向到 `/settings`，页面不存在

#### 2.2.1 迁移方案

与审计日志类似，方案A或方案B

#### 2.2.2 登录日志功能清单

| 功能 | 说明 | 优先级 |
|------|------|--------|
| 日志列表 | DataTable 展示所有登录日志 | P0 |
| 统计概览 | 顶部统计（登录成功/失败统计） | P0 |
| 筛选功能 | 按用户、IP地址、状态、时间筛选 | P0 |
| 详情查看 | Modal 展示登录详情 | P0 |
| 导出功能 | 导出 CSV/Excel | P1 |

#### 2.2.3 Mock 数据

从原项目迁移 `loginLogData` 或新建 `mock/loginLogData.ts`

---

### 2.3 角色管理功能修复

**原项目文件**: `crm2026-4-3new\src\pages\settings\Roles.tsx`
**新项目当前状态**: 只有 Card 占位页面，无实际功能

#### 2.3.1 角色管理功能清单

| 功能 | 说明 | 优先级 |
|------|------|--------|
| 角色列表 | DataTable 展示所有角色 | P0 |
| 创建角色 | Dialog 表单创建新角色 | P0 |
| 编辑角色 | Dialog 表单编辑角色信息 | P0 |
| 删除角色 | 确认弹窗 + 删除 | P0 |
| 权限配置 | 角色权限矩阵配置 | P0 |
| 成员管理 | 查看/添加/移除角色成员 | P1 |

#### 2.3.2 角色类型定义

```typescript
// src/types/role.ts
export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
  memberCount: number;
  isSystem: boolean;  // 系统内置角色不可删除
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  module: string;      // 模块名称
  action: string;      // 操作类型 (view/create/edit/delete)
  resource: string;    // 资源名称
}
```

#### 2.3.3 Mock 数据

新建 `mock/roleData.ts`，包含：
- 预设角色（管理员、销售经理、客服代表、市场专员、普通用户）
- 每个角色的权限配置
- 角色成员列表

---

### 2.4 权限管理功能修复

**原项目文件**: `crm2026-4-3new\src\pages\settings\PermissionManagement.tsx`
**新项目当前状态**: 只有 Card 占位页面，无实际功能

#### 2.4.1 权限管理功能清单

| 功能 | 说明 | 优先级 |
|------|------|--------|
| 权限列表 | 按模块展示所有权限点 | P0 |
| 权限矩阵 | 角色 × 权限 矩阵视图 | P0 |
| 权限配置 | 可视化配置角色权限 | P0 |
| 数据范围 | 配置角色数据可见范围 | P1 |
| 字段级权限 | 细粒度字段访问控制 | P2 |

#### 2.4.2 权限模块定义

```typescript
// 权限模块
export const PERMISSION_MODULES = {
  customer: '客户管理',
  contact: '联系人管理',
  lead: '线索管理',
  opportunity: '商机管理',
  order: '订单管理',
  contract: '合同管理',
  product: '产品管理',
  pricebook: '价格表',
  quote: '报价单',
  payment: '回款管理',
  activity: '活动管理',
  report: '报表中心',
  dashboard: '仪表盘',
  ai: 'AI智能',
  workflow: '工作流',
  customObject: '自定义对象',
  settings: '系统设置',
} as const;

// 权限动作
export const PERMISSION_ACTIONS = {
  view: '查看',
  create: '创建',
  edit: '编辑',
  delete: '删除',
  export: '导出',
  import: '导入',
} as const;
```

#### 2.4.3 Mock 数据

新建 `mock/permissionData.ts`

---

## 三、P1 修复计划

### 3.1 表单设计器

**优先级**: P1
**原项目文件**: `crm2026-4-3new\src\pages\settings\FormDesigner.tsx`

#### 功能清单
- 拖拽式表单字段布局
- 字段组件库（文本、选择、日期、文件等）
- 布局容器（栅格、分栏）
- 表单验证配置
- 表单样式定制

#### 评估建议
表单设计器是高级功能，如果项目不需要高度定制化，可以暂不实现。CRM 现有的表单已能满足大部分需求。

---

### 3.2 页面构建器

**优先级**: P1
**原项目文件**: `crm2026-4-3new\src\pages\settings\PageBuilder.tsx`

#### 功能清单
- 页面布局设计
- 组件库（字段、图表、列表）
- 多视图支持
- 响应式布局

#### 评估建议
页面构建器是高度定制化功能，建议评估是否真正需要。

---

### 3.3 视图管理器

**优先级**: P1
**原项目文件**: `crm2026-4-3new\src\pages\settings\ViewManager.tsx`

#### 功能清单
- 自定义列表视图配置
- 字段显示/隐藏
- 字段排序
- 筛选条件保存
- 默认视图设置

#### 评估建议
视图管理器较为实用，建议实现。可以整合到现有的列表页设置中。

---

### 3.4 管道管理器

**优先级**: P1
**原项目文件**: `crm2026-4-3new\src\pages\settings\PipelineManager.tsx`

#### 功能清单
- 销售管道配置
- 阶段定义
- 阶段转换规则
- 阶段颜色/图标配置

#### 评估建议
商机模块已有 Kanban 视图，管道管理器可以增强配置能力。

---

### 3.5 对象关系管理

**优先级**: P1
**原项目文件**: `crm2026-4-3new\src\pages\settings\ObjectRelationships.tsx`

#### 功能清单
- Lookup 关联配置
- Master-Detail 关联
- 自关联配置
- 层级结构

#### 评估建议
如果自定义对象功能完整，这是必要的配置页面。

---

## 四、Mock 数据补充计划

### 4.1 当前状态对比

| 原项目 Mock | 新项目 Mock | 状态 |
|-------------|-------------|------|
| settingsData.ts (648行) | ❌ 缺失 | 需创建 |
| permissionData.ts | ❌ 缺失 | 需创建 |
| customFieldData.ts | ❌ 缺失 | 需创建 |
| aiAgentsData.ts | ❌ 缺失 | 需创建 |
| aiData.ts | ❌ 缺失 | 需创建 |
| callcenterData.ts | ❌ 缺失 | 需创建 |
| contactData.ts | ❌ 缺失 | 需创建 |
| customerData.ts | ❌ 缺失 | 需创建 |
| activityData.ts | ✅ 已有 | 完整 |
| cpqData.ts | ✅ 已有 | 完整 |
| customObjectData.ts | ✅ 已有 | 完整 |
| dashboardData.ts | ✅ 已有 | 完整 |
| documentData.ts | ✅ 已有 | 新增 |
| reportData.ts | ✅ 已有 | 完整 |
| workflowData.ts | ✅ 已有 | 完整 |

### 4.2 需要补充的 Mock 数据

| 文件 | 说明 | 优先级 |
|------|------|--------|
| settingsData.ts | 设置相关数据（648行） | P0 |
| auditLogData.ts | 审计日志数据 | P0 |
| loginLogData.ts | 登录日志数据 | P0 |
| roleData.ts | 角色数据 | P0 |
| permissionData.ts | 权限配置数据 | P0 |
| customFieldData.ts | 自定义字段数据 | P1 |

---

## 五、Agent 执行计划

### 第1批：审计日志 + 登录日志（P0）

**预计时间**: 2 Agent 并行，8-12 小时

#### Agent 1.1: 审计日志迁移
```
任务：从原项目迁移审计日志功能
文件：
  - pages/settings/AuditLogSettings.tsx（新建）
  - types/auditLog.ts（新建）
  - mock/auditLogData.ts（新建）
依赖：无
时间：4-6小时
```

#### Agent 1.2: 登录日志迁移
```
任务：从原项目迁移登录日志功能
文件：
  - pages/settings/LoginLogSettings.tsx（新建）
  - types/loginLog.ts（新建）
  - mock/loginLogData.ts（新建）
依赖：无
时间：4-6小时
```

---

### 第2批：角色管理 + 权限管理（P0）

**预计时间**: 2 Agent 并行，12-16 小时

#### Agent 2.1: 角色管理完整实现
```
任务：实现完整的角色管理功能
文件：
  - pages/settings/RoleManagement.tsx（重写）
  - types/role.ts（新建）
  - mock/roleData.ts（新建）
  - components/RoleForm.tsx（新建）
依赖：无
时间：6-8小时
```

#### Agent 2.2: 权限管理完整实现
```
任务：实现完整的权限管理功能
文件：
  - pages/settings/PermissionManagement.tsx（重写）
  - types/permission.ts（新建）
  - mock/permissionData.ts（新建）
  - components/PermissionMatrix.tsx（新建）
依赖：Agent 2.1
时间：6-8小时
```

---

### 第3批：设置 Mock 数据（P0）

**预计时间**: 1 Agent，4-6 小时

#### Agent 3.1: 设置相关 Mock 数据
```
任务：创建设置相关的 Mock 数据
文件：
  - mock/settingsData.ts（新建，648行）
  - mock/customFieldData.ts（新建）
  - mock/auditLogData.ts（补充）
  - mock/loginLogData.ts（补充）
依赖：无
时间：4-6小时
```

---

### 第4批：P1 功能（可选）

**评估后决定是否执行**

#### Agent 4.1: 视图管理器
#### Agent 4.2: 管道管理器
#### Agent 4.3: 对象关系管理

---

## 六、路由修复

### 6.1 当前问题路由

| 原路由 | 新项目路由 | 状态 | 修复 |
|--------|-----------|------|------|
| `/settings/audit-log` | 重定向 `/settings` | ❌ | 改为指向 AuditLogSettings |
| `/settings/login-log` | 重定向 `/settings` | ❌ | 改为指向 LoginLogSettings |

### 6.2 路由修复清单

```typescript
// src/routes/index.tsx 修改

// 审计日志
{
  path: 'settings/audit-log',
  element: lazy(() => import('@/pages/settings/AuditLogSettings')),
}

// 登录日志
{
  path: 'settings/login-log',
  element: lazy(() => import('@/pages/settings/LoginLogSettings')),
}
```

---

## 七、检查点

### 第1批检查点
- [ ] 审计日志页面可访问
- [ ] 审计日志筛选功能正常
- [ ] 审计日志详情查看正常
- [ ] 登录日志页面可访问
- [ ] 登录日志筛选功能正常
- [ ] 登录日志统计显示正常

### 第2批检查点
- [ ] 角色列表显示正常
- [ ] 创建角色功能正常
- [ ] 编辑角色功能正常
- [ ] 删除角色功能正常
- [ ] 权限矩阵显示正常
- [ ] 权限配置保存正常

### 第3批检查点
- [ ] settingsData.ts 包含完整的设置数据
- [ ] auditLogData.ts 包含足够的测试数据
- [ ] loginLogData.ts 包含足够的测试数据
- [ ] roleData.ts 包含预设角色
- [ ] permissionData.ts 包含权限配置

---

## 八、时间估算

| 批次 | 内容 | Agent数 | 预计时间 |
|------|------|---------|----------|
| 第1批 | 审计日志 + 登录日志 | 2 | 8-12h |
| 第2批 | 角色管理 + 权限管理 | 2 | 12-16h |
| 第3批 | 设置 Mock 数据 | 1 | 4-6h |
| 第4批 | P1 功能（可选） | 1-3 | 8-12h/个 |

**总计（P0修复）**: 24-34 小时（约 3-5 天）

---

## 九、依赖关系

```
[P0 - 第1批]
    │
    ├── Agent 1.1 (审计日志)
    └── Agent 1.2 (登录日志)

[P0 - 第2批]  ← 可与第1批并行
    │
    ├── Agent 2.1 (角色管理)
    └── Agent 2.2 (权限管理) ← 依赖 Agent 2.1

[P0 - 第3批]  ← 可与第1、2批并行
    └── Agent 3.1 (Mock数据)

[P1 - 第4批]  ← 第1-3批完成后评估
    ├── Agent 4.1 (视图管理器)
    ├── Agent 4.2 (管道管理器)
    └── Agent 4.3 (对象关系管理)
```

---

## 十、风险和注意事项

### 10.1 风险识别

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| 角色权限系统复杂 | 实现难度高 | 参考原项目设计，逐步实现 |
| Mock 数据量大 | 工作量大 | 优先实现核心数据，简化次要数据 |
| 权限配置影响系统安全 | 安全风险 | 实现后进行安全测试 |

### 10.2 注意事项

1. **权限系统设计要谨慎** - 角色和权限是系统安全的基础
2. **保持与原项目功能对等** - 不要过度简化也不要过度复杂
3. **使用 shadcn/ui 组件** - 保持 UI 一致性
4. **类型安全** - 所有新增类型都要完整定义

---

## 十一、后续计划

完成 V5 后，项目设置功能将达到：

| 功能 | 状态 |
|------|------|
| 审计日志 | ✅ 完整 |
| 登录日志 | ✅ 完整 |
| 角色管理 | ✅ 完整 |
| 权限管理 | ✅ 完整 |
| Mock 数据 | ✅ 完整 |
| 表单设计器 | ⏳ 可选 |
| 页面构建器 | ⏳ 可选 |
| 视图管理器 | ⏳ 可选 |
| 管道管理器 | ⏳ 可选 |

---

*文档版本：V5*
*制定时间：2026-04-08*
*基于：PM 设置功能对比分析报告*
