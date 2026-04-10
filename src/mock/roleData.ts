/**
 * 角色管理 Mock 数据
 * 5 个预设角色：管理员、销售经理、客服代表、市场专员、普通用户
 */

import { DataScope } from "@/types/permission"
import { PermissionElementType } from "@/types/role"
import type { Permission, Role, RoleMember } from "@/types/role"

// ============ 基础权限定义 ============

const makeMenu = (
  id: string,
  name: string,
  code: string,
  sort: number,
  children: { id: string; name: string; code: string; sort: number }[]
): Permission => ({
  id,
  name,
  code,
  type: PermissionElementType.MENU,
  sort,
  children: children.map((c) => ({
    ...c,
    type: PermissionElementType.BUTTON,
  })),
})

const ALL_PERMISSIONS: Permission[] = [
  makeMenu("customer", "客户管理", "customer", 1, [
    { id: "customer:view", name: "查看客户", code: "customer:view", sort: 1 },
    { id: "customer:create", name: "新建客户", code: "customer:create", sort: 2 },
    { id: "customer:edit", name: "编辑客户", code: "customer:edit", sort: 3 },
    { id: "customer:delete", name: "删除客户", code: "customer:delete", sort: 4 },
    { id: "customer:export", name: "导出客户", code: "customer:export", sort: 5 },
  ]),
  makeMenu("contact", "联系人", "contact", 2, [
    { id: "contact:view", name: "查看联系人", code: "contact:view", sort: 1 },
    { id: "contact:create", name: "新建联系人", code: "contact:create", sort: 2 },
    { id: "contact:edit", name: "编辑联系人", code: "contact:edit", sort: 3 },
    { id: "contact:delete", name: "删除联系人", code: "contact:delete", sort: 4 },
  ]),
  makeMenu("lead", "线索管理", "lead", 3, [
    { id: "lead:view", name: "查看线索", code: "lead:view", sort: 1 },
    { id: "lead:create", name: "新建线索", code: "lead:create", sort: 2 },
    { id: "lead:edit", name: "编辑线索", code: "lead:edit", sort: 3 },
    { id: "lead:delete", name: "删除线索", code: "lead:delete", sort: 4 },
    { id: "lead:convert", name: "转化线索", code: "lead:convert", sort: 5 },
  ]),
  makeMenu("opportunity", "商机管理", "opportunity", 4, [
    { id: "opportunity:view", name: "查看商机", code: "opportunity:view", sort: 1 },
    { id: "opportunity:create", name: "新建商机", code: "opportunity:create", sort: 2 },
    { id: "opportunity:edit", name: "编辑商机", code: "opportunity:edit", sort: 3 },
    { id: "opportunity:delete", name: "删除商机", code: "opportunity:delete", sort: 4 },
    { id: "opportunity:win", name: "赢单", code: "opportunity:win", sort: 5 },
    { id: "opportunity:lose", name: "输单", code: "opportunity:lose", sort: 6 },
  ]),
  makeMenu("contract", "合同管理", "contract", 5, [
    { id: "contract:view", name: "查看合同", code: "contract:view", sort: 1 },
    { id: "contract:create", name: "新建合同", code: "contract:create", sort: 2 },
    { id: "contract:edit", name: "编辑合同", code: "contract:edit", sort: 3 },
    { id: "contract:delete", name: "删除合同", code: "contract:delete", sort: 4 },
  ]),
  makeMenu("payment", "回款管理", "payment", 6, [
    { id: "payment:view", name: "查看回款", code: "payment:view", sort: 1 },
    { id: "payment:create", name: "新建回款", code: "payment:create", sort: 2 },
    { id: "payment:edit", name: "编辑回款", code: "payment:edit", sort: 3 },
  ]),
  makeMenu("product", "产品管理", "product", 7, [
    { id: "product:view", name: "查看产品", code: "product:view", sort: 1 },
    { id: "product:create", name: "新建产品", code: "product:create", sort: 2 },
    { id: "product:edit", name: "编辑产品", code: "product:edit", sort: 3 },
    { id: "product:delete", name: "删除产品", code: "product:delete", sort: 4 },
  ]),
  makeMenu("quote", "报价管理", "quote", 8, [
    { id: "quote:view", name: "查看报价", code: "quote:view", sort: 1 },
    { id: "quote:create", name: "新建报价", code: "quote:create", sort: 2 },
    { id: "quote:edit", name: "编辑报价", code: "quote:edit", sort: 3 },
    { id: "quote:delete", name: "删除报价", code: "quote:delete", sort: 4 },
    { id: "quote:approve", name: "审批报价", code: "quote:approve", sort: 5 },
  ]),
  makeMenu("report", "报表中心", "report", 9, [
    { id: "report:view", name: "查看报表", code: "report:view", sort: 1 },
    { id: "report:export", name: "导出报表", code: "report:export", sort: 2 },
  ]),
  makeMenu("system", "系统设置", "system", 10, [
    { id: "system:user", name: "用户管理", code: "system:user", sort: 1 },
    { id: "system:role", name: "角色管理", code: "system:role", sort: 2 },
    { id: "system:config", name: "系统配置", code: "system:config", sort: 3 },
  ]),
]

export { ALL_PERMISSIONS }

// ============ Helper: flatten permission IDs ============

const flatAllIds = (): string[] =>
  ALL_PERMISSIONS.flatMap((m) => [m.id, ...(m.children?.map((c) => c.id) ?? [])])

const flatMenuIds = (): string[] => ALL_PERMISSIONS.map((m) => m.id)

const flatIdsExcept = (exceptMenus: string[]): string[] =>
  ALL_PERMISSIONS.filter((m) => !exceptMenus.includes(m.id)).flatMap((m) => [
    m.id,
    ...(m.children?.map((c) => c.id) ?? []),
  ])

// ============ Mock Members ============

const makeMembers = (
  roleId: string,
  users: { id: string; name: string; avatar?: string; department: string }[]
): RoleMember[] =>
  users.map((u, i) => ({
    id: `rm-${roleId}-${i}`,
    userId: u.id,
    userName: u.name,
    userAvatar: u.avatar,
    department: u.department,
    roleId,
    assignedAt: "2026-01-15T08:00:00Z",
    assignedBy: "admin",
  }))

// ============ 预设角色 ============

export const mockRoles: Role[] = [
  // 1. 管理员
  {
    id: "role-1",
    name: "管理员",
    code: "ADMIN",
    description: "系统最高权限角色，拥有所有模块的完整访问权限",
    permissions: flatAllIds(),
    dataScope: DataScope.ALL,
    isSystem: true,
    isActive: true,
    sort: 0,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
    members: makeMembers("role-1", [
      { id: "u-001", name: "张明", department: "IT 部" },
      { id: "u-002", name: "李华", department: "IT 部" },
    ]),
  },

  // 2. 销售经理
  {
    id: "role-2",
    name: "销售经理",
    code: "SALES_MANAGER",
    description: "销售团队负责人，可管理团队成员的客户和商机",
    permissions: flatIdsExcept(["system"]),
    dataScope: DataScope.DEPARTMENT,
    isSystem: false,
    isActive: true,
    sort: 10,
    createdAt: "2026-01-05T10:00:00Z",
    updatedAt: "2026-01-20T14:30:00Z",
    members: makeMembers("role-2", [
      { id: "u-010", name: "王建国", department: "销售部" },
      { id: "u-011", name: "赵敏", department: "销售部" },
      { id: "u-012", name: "钱伟", department: "销售部" },
    ]),
  },

  // 3. 客服代表
  {
    id: "role-3",
    name: "客服代表",
    code: "CUSTOMER_SERVICE",
    description: "负责客户咨询和售后服务，仅可查看和编辑客户信息",
    permissions: [
      "customer:view", "customer:edit",
      "contact:view", "contact:create", "contact:edit",
      "lead:view", "lead:create",
      "report:view",
    ],
    dataScope: DataScope.SELF,
    isSystem: false,
    isActive: true,
    sort: 20,
    createdAt: "2026-01-10T09:00:00Z",
    updatedAt: "2026-02-01T11:00:00Z",
    members: makeMembers("role-3", [
      { id: "u-020", name: "孙丽", department: "客服部" },
      { id: "u-021", name: "周婷", department: "客服部" },
      { id: "u-022", name: "吴静", department: "客服部" },
      { id: "u-023", name: "郑雪", department: "客服部" },
    ]),
  },

  // 4. 市场专员
  {
    id: "role-4",
    name: "市场专员",
    code: "MARKETING_SPECIALIST",
    description: "负责市场活动和线索获取，可管理线索和查看报表",
    permissions: [
      "lead:view", "lead:create", "lead:edit",
      "report:view", "report:export",
      "customer:view",
    ],
    dataScope: DataScope.SELF,
    isSystem: false,
    isActive: true,
    sort: 30,
    createdAt: "2026-01-15T14:00:00Z",
    updatedAt: "2026-02-10T16:00:00Z",
    members: makeMembers("role-4", [
      { id: "u-030", name: "陈志强", department: "市场部" },
      { id: "u-031", name: "林晓", department: "市场部" },
    ]),
  },

  // 5. 普通用户
  {
    id: "role-5",
    name: "普通用户",
    code: "USER",
    description: "基础用户角色，仅可查看和创建客户和联系人",
    permissions: [
      "customer:view", "customer:create",
      "contact:view", "contact:create",
    ],
    dataScope: DataScope.SELF,
    isSystem: false,
    isActive: true,
    sort: 99,
    createdAt: "2026-01-20T08:00:00Z",
    updatedAt: "2026-01-20T08:00:00Z",
    members: makeMembers("role-5", [
      { id: "u-040", name: "黄文博", department: "财务部" },
      { id: "u-041", name: "许佳琪", department: "人事部" },
      { id: "u-042", name: "何蓝天", department: "行政部" },
      { id: "u-043", name: "罗浩宇", department: "行政部" },
      { id: "u-044", name: "高峰", department: "财务部" },
    ]),
  },
]

// ============ Mock Permission Tree ============

export const mockPermissionTree: Permission[] = ALL_PERMISSIONS
