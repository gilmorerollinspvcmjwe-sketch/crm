/**
 * 权限管理 Mock 数据
 */

import {
  DataScope,
  FieldPermission,
  ModuleFieldPermission,
  PermissionConfig,
  PermissionMatrix,
  PermissionSettings,
  PERMISSION_ACTIONS,
  PERMISSION_MODULES,
  PermissionType,
  RoleBasic,
} from '@/types/permission'

// ============ 角色数据 ============

export const mockRoles: RoleBasic[] = [
  { id: '1', name: '超级管理员', code: 'admin', description: '系统最高权限', isSystem: true },
  { id: '2', name: '销售总监', code: 'sales_director', description: '销售团队管理者', isSystem: false },
  { id: '3', name: '销售经理', code: 'sales_manager', description: '销售团队负责人', isSystem: false },
  { id: '4', name: '销售代表', code: 'sales_rep', description: '一线销售人员', isSystem: false },
  { id: '5', name: '市场经理', code: 'marketing_manager', description: '市场营销负责人', isSystem: false },
  { id: '6', name: '财务专员', code: 'finance', description: '财务管理人员', isSystem: false },
  { id: '7', name: '客服专员', code: 'support', description: '客户服务中心', isSystem: false },
]

// ============ 权限矩阵数据 ============

/** 根据角色ID生成权限矩阵 */
function generatePermissionMatrix(roleId: string, roleName: string): PermissionMatrix {
  const permissions: PermissionConfig[] = PERMISSION_MODULES.map(module => {
    // 根据角色设置不同的默认权限
    let defaultPermissions: Record<string, boolean> = {}

    // 超级管理员 - 全部权限
    if (roleId === '1') {
      PERMISSION_ACTIONS.forEach(action => {
        defaultPermissions[action.id] = true
      })
    }
    // 销售总监 - 销售相关全部权限，无系统设置
    else if (roleId === '2') {
      const salesModules = ['customer', 'contact', 'lead', 'opportunity', 'contract', 'order', 'payment', 'quote', 'report', 'dashboard']
      const hasModule = salesModules.includes(module.id)
      if (hasModule) {
        if (module.id === 'report') {
          // 报表只有查看和导出
          defaultPermissions[PermissionType.VIEW] = true
          defaultPermissions[PermissionType.EXPORT] = true
        } else if (module.id === 'dashboard') {
          // 仪表盘只有查看
          defaultPermissions[PermissionType.VIEW] = true
        } else {
          // 其他销售模块全部权限
          PERMISSION_ACTIONS.forEach(action => {
            defaultPermissions[action.id] = true
          })
        }
      }
    }
    // 销售经理 - 部分权限
    else if (roleId === '3') {
      const salesModules = ['customer', 'contact', 'lead', 'opportunity', 'contract', 'order', 'quote', 'dashboard']
      if (salesModules.includes(module.id)) {
        if (module.id === 'lead') {
          // 线索有查看、创建、编辑
          defaultPermissions[PermissionType.VIEW] = true
          defaultPermissions[PermissionType.CREATE] = true
          defaultPermissions[PermissionType.EDIT] = true
        } else if (module.id === 'dashboard') {
          defaultPermissions[PermissionType.VIEW] = true
        } else {
          PERMISSION_ACTIONS.forEach(action => {
            defaultPermissions[action.id] = true
          })
        }
      }
    }
    // 销售代表 - 有限的创建和编辑权限
    else if (roleId === '4') {
      const allowedModules = ['customer', 'contact', 'lead', 'opportunity']
      if (allowedModules.includes(module.id)) {
        // 只能查看和创建
        defaultPermissions[PermissionType.VIEW] = true
        defaultPermissions[PermissionType.CREATE] = true
        if (module.id === 'customer' || module.id === 'contact') {
          defaultPermissions[PermissionType.EDIT] = true
        }
      }
    }
    // 市场经理
    else if (roleId === '5') {
      const marketingModules = ['lead', 'report', 'dashboard', 'campaign']
      if (marketingModules.includes(module.id)) {
        if (module.id === 'report') {
          defaultPermissions[PermissionType.VIEW] = true
          defaultPermissions[PermissionType.EXPORT] = true
        } else if (module.id === 'dashboard') {
          defaultPermissions[PermissionType.VIEW] = true
        } else {
          PERMISSION_ACTIONS.forEach(action => {
            defaultPermissions[action.id] = true
          })
        }
      }
    }
    // 财务专员
    else if (roleId === '6') {
      const financeModules = ['contract', 'order', 'payment', 'report']
      if (financeModules.includes(module.id)) {
        if (module.id === 'report') {
          defaultPermissions[PermissionType.VIEW] = true
          defaultPermissions[PermissionType.EXPORT] = true
        } else {
          PERMISSION_ACTIONS.forEach(action => {
            defaultPermissions[action.id] = true
          })
        }
      }
    }
    // 客服专员
    else if (roleId === '7') {
      const supportModules = ['customer', 'contact']
      if (supportModules.includes(module.id)) {
        defaultPermissions[PermissionType.VIEW] = true
        defaultPermissions[PermissionType.EDIT] = true
        defaultPermissions[PermissionType.CREATE] = true
      }
    }

    return {
      module: module.id,
      permissions: PERMISSION_ACTIONS.map(action => ({
        action: action.id,
        allowed: defaultPermissions[action.id] || false,
      })),
    }
  })

  return { roleId, roleName, permissions }
}

/** 所有角色的权限矩阵 */
export const mockPermissionMatrix: PermissionMatrix[] = mockRoles.map(role =>
  generatePermissionMatrix(role.id, role.name)
)

// ============ 数据范围配置 ============

/** 各角色的数据范围配置 */
export const mockDataScopeConfig: Record<string, Record<string, DataScope>> = {
  '1': {
    // 超级管理员 - 全部数据
    customer: DataScope.ALL,
    contact: DataScope.ALL,
    lead: DataScope.ALL,
    opportunity: DataScope.ALL,
    contract: DataScope.ALL,
    order: DataScope.ALL,
    payment: DataScope.ALL,
  },
  '2': {
    // 销售总监 - 本部门数据
    customer: DataScope.DEPARTMENT,
    contact: DataScope.DEPARTMENT,
    lead: DataScope.DEPARTMENT,
    opportunity: DataScope.DEPARTMENT,
    contract: DataScope.DEPARTMENT,
    order: DataScope.DEPARTMENT,
    payment: DataScope.DEPARTMENT,
  },
  '3': {
    // 销售经理 - 本部门数据
    customer: DataScope.DEPARTMENT,
    contact: DataScope.DEPARTMENT,
    lead: DataScope.DEPARTMENT,
    opportunity: DataScope.DEPARTMENT,
    contract: DataScope.SELF,
    order: DataScope.SELF,
    payment: DataScope.SELF,
  },
  '4': {
    // 销售代表 - 仅自己的数据
    customer: DataScope.SELF,
    contact: DataScope.SELF,
    lead: DataScope.SELF,
    opportunity: DataScope.SELF,
    contract: DataScope.SELF,
    order: DataScope.SELF,
    payment: DataScope.SELF,
  },
  '5': {
    // 市场经理 - 本部门数据
    lead: DataScope.DEPARTMENT,
    report: DataScope.ALL,
    dashboard: DataScope.ALL,
  },
  '6': {
    // 财务专员 - 全部数据（财务需要看所有）
    contract: DataScope.ALL,
    order: DataScope.ALL,
    payment: DataScope.ALL,
    report: DataScope.ALL,
  },
  '7': {
    // 客服专员 - 仅自己的数据
    customer: DataScope.SELF,
    contact: DataScope.SELF,
  },
}

// ============ 字段级权限配置 ============

/** 各模块的字段配置 */
const customerFields: FieldPermission[] = [
  { field: 'name', label: '客户名称', visible: true, editable: true },
  { field: 'industry', label: '所属行业', visible: true, editable: true },
  { field: 'level', label: '客户级别', visible: true, editable: true },
  { field: 'phone', label: '联系电话', visible: true, editable: true },
  { field: 'email', label: '邮箱', visible: true, editable: true },
  { field: 'address', label: '地址', visible: true, editable: true },
  { field: 'website', label: '网站', visible: true, editable: false },
  { field: 'employeeCount', label: '员工人数', visible: false, editable: false },
  { field: 'annualRevenue', label: '年营业额', visible: false, editable: false },
  { field: 'creditCode', label: '信用代码', visible: false, editable: false },
]

const contactFields: FieldPermission[] = [
  { field: 'name', label: '姓名', visible: true, editable: true },
  { field: 'gender', label: '性别', visible: true, editable: true },
  { field: 'department', label: '部门', visible: true, editable: true },
  { field: 'position', label: '职位', visible: true, editable: true },
  { field: 'phone', label: '手机', visible: true, editable: true },
  { field: 'email', label: '邮箱', visible: true, editable: true },
  { field: 'wechat', label: '微信', visible: true, editable: false },
  { field: 'birthday', label: '生日', visible: false, editable: false },
  { field: 'hobby', label: '爱好', visible: false, editable: false },
]

const leadFields: FieldPermission[] = [
  { field: 'name', label: '姓名', visible: true, editable: true },
  { field: 'company', label: '公司', visible: true, editable: true },
  { field: 'position', label: '职位', visible: true, editable: true },
  { field: 'phone', label: '电话', visible: true, editable: true },
  { field: 'source', label: '来源', visible: true, editable: true },
  { field: 'status', label: '状态', visible: true, editable: true },
  { field: 'score', label: '评分', visible: true, editable: false },
  { field: 'budget', label: '预算', visible: false, editable: false },
]

const opportunityFields: FieldPermission[] = [
  { field: 'name', label: '商机名称', visible: true, editable: true },
  { field: 'customer', label: '客户', visible: true, editable: true },
  { field: 'amount', label: '金额', visible: true, editable: true },
  { field: 'stage', label: '阶段', visible: true, editable: true },
  { field: 'probability', label: '概率', visible: true, editable: true },
  { field: 'expectedCloseDate', label: '预计成交日期', visible: true, editable: true },
  { field: 'actualCloseDate', label: '实际成交日期', visible: false, editable: false },
  { field: 'loseReason', label: '失败原因', visible: false, editable: false },
  { field: 'competitor', label: '竞争对手', visible: false, editable: false },
]

/** 根据角色生成字段权限 */
function generateFieldPermissions(roleId: string): ModuleFieldPermission[] {
  // 超级管理员看所有字段
  if (roleId === '1') {
    return [
      { module: 'customer', moduleName: '客户管理', fields: customerFields },
      { module: 'contact', moduleName: '联系人', fields: contactFields },
      { module: 'lead', moduleName: '线索管理', fields: leadFields },
      { module: 'opportunity', moduleName: '商机管理', fields: opportunityFields },
    ].map(m => ({
      ...m,
      fields: m.fields.map(f => ({ ...f, visible: true, editable: true })),
    }))
  }

  // 销售代表看不到敏感字段
  if (roleId === '4' || roleId === '7') {
    return [
      { module: 'customer', moduleName: '客户管理', fields: customerFields },
      { module: 'contact', moduleName: '联系人', fields: contactFields },
    ].map(m => ({
      ...m,
      fields: m.fields.map(f => ({
        ...f,
        visible: f.visible,
        editable: f.field !== 'employeeCount' && f.field !== 'annualRevenue' ? f.editable : false,
      })),
    }))
  }

  // 默认配置
  return [
    { module: 'customer', moduleName: '客户管理', fields: customerFields },
    { module: 'contact', moduleName: '联系人', fields: contactFields },
    { module: 'lead', moduleName: '线索管理', fields: leadFields },
    { module: 'opportunity', moduleName: '商机管理', fields: opportunityFields },
  ]
}

/** 所有角色的字段权限 */
export const mockFieldPermissions: Record<string, ModuleFieldPermission[]> = {}
mockRoles.forEach(role => {
  mockFieldPermissions[role.id] = generateFieldPermissions(role.id)
})

// ============ 完整的权限设置 ============

export const mockPermissionSettings: Record<string, PermissionSettings> = {}
mockRoles.forEach(role => {
  mockPermissionSettings[role.id] = {
    roleId: role.id,
    dataScope: mockDataScopeConfig[role.id] || {},
    fieldPermissions: mockFieldPermissions[role.id] || [],
  }
})

// ============ 辅助函数 ============

/** 获取角色已修改的权限 */
export function getModifiedPermissions(
  original: PermissionMatrix,
  current: PermissionMatrix
): { module: string; action: PermissionType; oldValue: boolean; newValue: boolean }[] {
  const changes: { module: string; action: PermissionType; oldValue: boolean; newValue: boolean }[] = []

  current.permissions.forEach(currentPerm => {
    const originalPerm = original.permissions.find(p => p.module === currentPerm.module)
    if (!originalPerm) return

    currentPerm.permissions.forEach(currentAction => {
      const originalAction = originalPerm.permissions.find(p => p.action === currentAction.action)
      if (!originalAction) return

      if (originalAction.allowed !== currentAction.allowed) {
        changes.push({
          module: currentPerm.module,
          action: currentAction.action,
          oldValue: originalAction.allowed,
          newValue: currentAction.allowed,
        })
      }
    })
  })

  return changes
}
