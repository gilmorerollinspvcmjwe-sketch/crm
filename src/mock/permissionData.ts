/**
 * 权限系统 Mock 数据
 */
import { Permission, PermissionType, Role, DataScope, User, UserRole } from '../types/permission';

/** 权限树 - 菜单权限 */
export const permissions: Permission[] = [
  {
    id: 'PERM001',
    name: '仪表盘',
    code: 'dashboard:view',
    type: PermissionType.MENU,
    path: '/dashboard',
    icon: 'DashboardOutlined',
    sort: 1,
  },
  {
    id: 'PERM002',
    name: '客户管理',
    code: 'customer',
    type: PermissionType.MENU,
    path: '/customer',
    icon: 'TeamOutlined',
    sort: 2,
    children: [
      {
        id: 'PERM003',
        name: '客户列表',
        code: 'customer:list',
        type: PermissionType.MENU,
        path: '/customer/list',
        sort: 1,
      },
      {
        id: 'PERM004',
        name: '客户详情',
        code: 'customer:detail',
        type: PermissionType.MENU,
        path: '/customer/:id',
        sort: 2,
      },
      {
        id: 'PERM005',
        name: '新建客户',
        code: 'customer:create',
        type: PermissionType.BUTTON,
        sort: 3,
      },
      {
        id: 'PERM006',
        name: '编辑客户',
        code: 'customer:edit',
        type: PermissionType.BUTTON,
        sort: 4,
      },
      {
        id: 'PERM007',
        name: '删除客户',
        code: 'customer:delete',
        type: PermissionType.BUTTON,
        sort: 5,
      },
    ],
  },
  {
    id: 'PERM008',
    name: '联系人管理',
    code: 'contact',
    type: PermissionType.MENU,
    path: '/contact',
    icon: 'UserOutlined',
    sort: 3,
    children: [
      {
        id: 'PERM009',
        name: '联系人列表',
        code: 'contact:list',
        type: PermissionType.MENU,
        path: '/contact/list',
        sort: 1,
      },
      {
        id: 'PERM010',
        name: '新建联系人',
        code: 'contact:create',
        type: PermissionType.BUTTON,
        sort: 2,
      },
      {
        id: 'PERM011',
        name: '编辑联系人',
        code: 'contact:edit',
        type: PermissionType.BUTTON,
        sort: 3,
      },
    ],
  },
  {
    id: 'PERM012',
    name: '线索管理',
    code: 'lead',
    type: PermissionType.MENU,
    path: '/lead',
    icon: 'BulbOutlined',
    sort: 4,
    children: [
      {
        id: 'PERM013',
        name: '线索列表',
        code: 'lead:list',
        type: PermissionType.MENU,
        path: '/lead/list',
        sort: 1,
      },
      {
        id: 'PERM014',
        name: '新建线索',
        code: 'lead:create',
        type: PermissionType.BUTTON,
        sort: 2,
      },
      {
        id: 'PERM015',
        name: '线索分配',
        code: 'lead:assign',
        type: PermissionType.BUTTON,
        sort: 3,
      },
      {
        id: 'PERM016',
        name: '线索转化',
        code: 'lead:convert',
        type: PermissionType.BUTTON,
        sort: 4,
      },
    ],
  },
  {
    id: 'PERM017',
    name: '商机管理',
    code: 'opportunity',
    type: PermissionType.MENU,
    path: '/opportunity',
    icon: 'DollarOutlined',
    sort: 5,
    children: [
      {
        id: 'PERM018',
        name: '商机列表',
        code: 'opportunity:list',
        type: PermissionType.MENU,
        path: '/opportunity/list',
        sort: 1,
      },
      {
        id: 'PERM019',
        name: '新建商机',
        code: 'opportunity:create',
        type: PermissionType.BUTTON,
        sort: 2,
      },
      {
        id: 'PERM020',
        name: '编辑商机',
        code: 'opportunity:edit',
        type: PermissionType.BUTTON,
        sort: 3,
      },
    ],
  },
  {
    id: 'PERM021',
    name: '合同管理',
    code: 'contract',
    type: PermissionType.MENU,
    path: '/contract',
    icon: 'FileTextOutlined',
    sort: 6,
    children: [
      {
        id: 'PERM022',
        name: '合同列表',
        code: 'contract:list',
        type: PermissionType.MENU,
        path: '/contract/list',
        sort: 1,
      },
      {
        id: 'PERM023',
        name: '新建合同',
        code: 'contract:create',
        type: PermissionType.BUTTON,
        sort: 2,
      },
    ],
  },
  {
    id: 'PERM024',
    name: '回款管理',
    code: 'payment',
    type: PermissionType.MENU,
    path: '/payment',
    icon: 'WalletOutlined',
    sort: 7,
    children: [
      {
        id: 'PERM025',
        name: '回款列表',
        code: 'payment:list',
        type: PermissionType.MENU,
        path: '/payment/list',
        sort: 1,
      },
      {
        id: 'PERM026',
        name: '登记回款',
        code: 'payment:create',
        type: PermissionType.BUTTON,
        sort: 2,
      },
    ],
  },
  {
    id: 'PERM027',
    name: 'CPQ 报价',
    code: 'quote',
    type: PermissionType.MENU,
    path: '/quote',
    icon: 'FilePdfOutlined',
    sort: 8,
    children: [
      {
        id: 'PERM028',
        name: '报价列表',
        code: 'quote:list',
        type: PermissionType.MENU,
        path: '/quote/list',
        sort: 1,
      },
      {
        id: 'PERM029',
        name: '新建报价',
        code: 'quote:create',
        type: PermissionType.BUTTON,
        sort: 2,
      },
      {
        id: 'PERM030',
        name: '产品库管理',
        code: 'product:list',
        type: PermissionType.MENU,
        path: '/product/list',
        sort: 3,
      },
      {
        id: 'PERM031',
        name: '价格表管理',
        code: 'pricebook:list',
        type: PermissionType.MENU,
        path: '/pricebook/list',
        sort: 4,
      },
    ],
  },
  {
    id: 'PERM032',
    name: '报表统计',
    code: 'report',
    type: PermissionType.MENU,
    path: '/report',
    icon: 'BarChartOutlined',
    sort: 9,
    children: [
      {
        id: 'PERM033',
        name: '销售漏斗',
        code: 'report:funnel',
        type: PermissionType.MENU,
        path: '/report/funnel',
        sort: 1,
      },
      {
        id: 'PERM034',
        name: '业绩报表',
        code: 'report:performance',
        type: PermissionType.MENU,
        path: '/report/performance',
        sort: 2,
      },
    ],
  },
  {
    id: 'PERM035',
    name: '系统管理',
    code: 'system',
    type: PermissionType.MENU,
    path: '/settings',
    icon: 'SettingOutlined',
    sort: 10,
    children: [
      {
        id: 'PERM036',
        name: '角色管理',
        code: 'role:list',
        type: PermissionType.MENU,
        path: '/settings/roles',
        sort: 1,
      },
      {
        id: 'PERM037',
        name: '用户管理',
        code: 'user:list',
        type: PermissionType.MENU,
        path: '/settings/users',
        sort: 2,
      },
      {
        id: 'PERM038',
        name: '新建角色',
        code: 'role:create',
        type: PermissionType.BUTTON,
        sort: 3,
      },
      {
        id: 'PERM039',
        name: '编辑角色',
        code: 'role:edit',
        type: PermissionType.BUTTON,
        sort: 4,
      },
      {
        id: 'PERM040',
        name: '删除角色',
        code: 'role:delete',
        type: PermissionType.BUTTON,
        sort: 5,
      },
    ],
  },
];

/** 角色列表 */
export const roles: Role[] = [
  {
    id: 'ROLE001',
    name: '超级管理员',
    code: 'admin',
    description: '系统超级管理员，拥有所有权限',
    permissions: permissions.flatMap(p => [p.id, ...(p.children?.map(c => c.id) || [])]),
    dataScope: DataScope.ALL,
    isSystem: true,
    createdAt: '2026-01-01 00:00:00',
    updatedAt: '2026-01-01 00:00:00',
  },
  {
    id: 'ROLE002',
    name: '销售总监',
    code: 'sales_director',
    description: '销售部门总监，管理全部销售数据',
    permissions: [
      'PERM001', 'PERM002', 'PERM003', 'PERM004', 'PERM005', 'PERM006',
      'PERM008', 'PERM009', 'PERM010', 'PERM011',
      'PERM012', 'PERM013', 'PERM014', 'PERM015', 'PERM016',
      'PERM017', 'PERM018', 'PERM019', 'PERM020',
      'PERM021', 'PERM022', 'PERM023',
      'PERM024', 'PERM025', 'PERM026',
      'PERM027', 'PERM028', 'PERM029', 'PERM030', 'PERM031',
      'PERM032', 'PERM033', 'PERM034',
    ],
    dataScope: DataScope.ALL,
    isSystem: true,
    createdAt: '2026-01-01 00:00:00',
    updatedAt: '2026-01-01 00:00:00',
  },
  {
    id: 'ROLE003',
    name: '销售经理',
    code: 'sales_manager',
    description: '销售经理，管理团队数据',
    permissions: [
      'PERM001', 'PERM002', 'PERM003', 'PERM004', 'PERM005', 'PERM006',
      'PERM008', 'PERM009', 'PERM010', 'PERM011',
      'PERM012', 'PERM013', 'PERM014', 'PERM015',
      'PERM017', 'PERM018', 'PERM019', 'PERM020',
      'PERM021', 'PERM022', 'PERM023',
      'PERM024', 'PERM025', 'PERM026',
      'PERM027', 'PERM028', 'PERM029',
    ],
    dataScope: DataScope.TEAM,
    isSystem: true,
    createdAt: '2026-01-01 00:00:00',
    updatedAt: '2026-01-01 00:00:00',
  },
  {
    id: 'ROLE004',
    name: '销售代表',
    code: 'sales_rep',
    description: '销售代表，仅管理个人数据',
    permissions: [
      'PERM001', 'PERM002', 'PERM003', 'PERM004', 'PERM005', 'PERM006',
      'PERM008', 'PERM009', 'PERM010', 'PERM011',
      'PERM012', 'PERM013', 'PERM014',
      'PERM017', 'PERM018', 'PERM019', 'PERM020',
      'PERM021', 'PERM022',
      'PERM024', 'PERM025',
      'PERM027', 'PERM028', 'PERM029',
    ],
    dataScope: DataScope.SELF,
    isSystem: true,
    createdAt: '2026-01-01 00:00:00',
    updatedAt: '2026-01-01 00:00:00',
  },
  {
    id: 'ROLE005',
    name: '客服专员',
    code: 'support',
    description: '客服专员，处理客户咨询',
    permissions: [
      'PERM001', 'PERM002', 'PERM003', 'PERM004',
      'PERM008', 'PERM009', 'PERM010', 'PERM011',
    ],
    dataScope: DataScope.ALL,
    isSystem: true,
    createdAt: '2026-01-01 00:00:00',
    updatedAt: '2026-01-01 00:00:00',
  },
  {
    id: 'ROLE006',
    name: '自定义角色 - 渠道经理',
    code: 'channel_manager',
    description: '管理渠道合作伙伴',
    permissions: [
      'PERM001', 'PERM002', 'PERM003', 'PERM004', 'PERM005',
      'PERM008', 'PERM009', 'PERM010',
      'PERM017', 'PERM018', 'PERM019',
      'PERM027', 'PERM028', 'PERM029', 'PERM030', 'PERM031',
    ],
    dataScope: DataScope.DEPARTMENT,
    isSystem: false,
    createdBy: 'USER001',
    createdByName: '管理员',
    createdAt: '2026-02-15 10:00:00',
    updatedAt: '2026-03-01 14:00:00',
  },
  {
    id: 'ROLE007',
    name: '自定义角色 - 产品专员',
    code: 'product_specialist',
    description: '负责产品管理和报价支持',
    permissions: [
      'PERM001',
      'PERM027', 'PERM028', 'PERM029', 'PERM030', 'PERM031',
      'PERM032', 'PERM033', 'PERM034',
    ],
    dataScope: DataScope.ALL,
    isSystem: false,
    createdBy: 'USER002',
    createdByName: '销售经理',
    createdAt: '2026-03-05 09:00:00',
    updatedAt: '2026-03-05 09:00:00',
  },
];

/** 用户列表 */
export const users: User[] = [
  {
    id: 'USER001',
    name: '管理员',
    email: 'admin@crm.com',
    username: 'admin',
    department: '技术部',
    position: '系统管理员',
    status: 'active',
    roleIds: ['ROLE001'],
    createdAt: '2026-01-01 00:00:00',
  },
  {
    id: 'USER002',
    name: '张三',
    email: 'zhangsan@crm.com',
    username: 'zhangsan',
    department: '销售部',
    position: '销售总监',
    status: 'active',
    roleIds: ['ROLE002'],
    createdAt: '2026-01-05 09:00:00',
  },
  {
    id: 'USER003',
    name: '李四',
    email: 'lisi@crm.com',
    username: 'lisi',
    department: '销售部',
    position: '销售经理',
    status: 'active',
    roleIds: ['ROLE003'],
    createdAt: '2026-01-05 09:00:00',
  },
  {
    id: 'USER004',
    name: '王五',
    email: 'wangwu@crm.com',
    username: 'wangwu',
    department: '销售部',
    position: '销售代表',
    status: 'active',
    roleIds: ['ROLE004'],
    createdAt: '2026-01-10 10:00:00',
  },
  {
    id: 'USER005',
    name: '赵六',
    email: 'zhaoliu@crm.com',
    username: 'zhaoliu',
    department: '销售部',
    position: '销售代表',
    status: 'active',
    roleIds: ['ROLE004'],
    createdAt: '2026-01-10 10:00:00',
  },
  {
    id: 'USER006',
    name: '钱七',
    email: 'qianqi@crm.com',
    username: 'qianqi',
    department: '客服部',
    position: '客服专员',
    status: 'active',
    roleIds: ['ROLE005'],
    createdAt: '2026-01-15 11:00:00',
  },
  {
    id: 'USER007',
    name: '孙八',
    email: 'sunba@crm.com',
    username: 'sunba',
    department: '渠道部',
    position: '渠道经理',
    status: 'active',
    roleIds: ['ROLE006'],
    createdAt: '2026-02-15 10:00:00',
  },
  {
    id: 'USER008',
    name: '周九',
    email: 'zhoujiu@crm.com',
    username: 'zhoujiu',
    department: '产品部',
    position: '产品专员',
    status: 'active',
    roleIds: ['ROLE007'],
    createdAt: '2026-03-05 09:00:00',
  },
  {
    id: 'USER009',
    name: '吴十',
    email: 'wushi@crm.com',
    username: 'wushi',
    department: '销售部',
    position: '销售代表',
    status: 'inactive',
    roleIds: ['ROLE004'],
    createdAt: '2026-01-20 14:00:00',
  },
];

/** 获取所有权限（扁平化） */
export const getAllPermissions = (): Permission[] => {
  const flat: Permission[] = [];
  const flatten = (perms: Permission[]) => {
    perms.forEach(p => {
      flat.push(p);
      if (p.children) flatten(p.children);
    });
  };
  flatten(permissions);
  return flat;
};

/** 获取角色列表 */
export const getRoleList = (filters?: { name?: string; isSystem?: boolean }) => {
  let filtered = [...roles];

  if (filters?.name) {
    filtered = filtered.filter(r => r.name.includes(filters.name!));
  }

  if (filters?.isSystem !== undefined) {
    filtered = filtered.filter(r => r.isSystem === filters.isSystem);
  }

  return filtered;
};

/** 获取角色详情 */
export const getRoleById = (id: string): Role | undefined => {
  return roles.find(r => r.id === id);
};

/** 创建角色 */
export const createRole = (data: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>): Role => {
  const newRole: Role = {
    ...data,
    id: `ROLE${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  roles.push(newRole);
  return newRole;
};

/** 更新角色 */
export const updateRole = (id: string, data: Partial<Role>): Role | undefined => {
  const index = roles.findIndex(r => r.id === id);
  if (index === -1) return undefined;

  roles[index] = {
    ...roles[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  return roles[index];
};

/** 删除角色 */
export const deleteRole = (id: string): boolean => {
  const index = roles.findIndex(r => r.id === id);
  if (index === -1) return false;
  if (roles[index].isSystem) return false; // 系统角色不可删除

  roles.splice(index, 1);
  return true;
};

/** 获取用户列表 */
export const getUserList = (filters?: { name?: string; department?: string; status?: 'active' | 'inactive' }) => {
  let filtered = [...users];

  if (filters?.name) {
    filtered = filtered.filter(u => u.name.includes(filters.name!));
  }

  if (filters?.department) {
    filtered = filtered.filter(u => u.department === filters.department);
  }

  if (filters?.status) {
    filtered = filtered.filter(u => u.status === filters.status);
  }

  return filtered;
};

/** 获取用户详情 */
export const getUserById = (id: string): User | undefined => {
  return users.find(u => u.id === id);
};

/** 更新用户角色 */
export const updateUserRoles = (userId: string, roleIds: string[]): User | undefined => {
  const index = users.findIndex(u => u.id === userId);
  if (index === -1) return undefined;

  users[index].roleIds = roleIds;
  return users[index];
};
