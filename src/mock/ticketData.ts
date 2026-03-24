/**
 * 工单系统 Mock 数据
 */
import { Ticket, TicketStatus, TicketPriority, TicketActivity } from '../types/ticket';

/** 工单列表 */
export const tickets: Ticket[] = [
  {
    id: 'TKT001',
    ticketNumber: 'TKT-2026-001',
    title: 'CRM 系统登录问题',
    description: '用户反馈无法登录系统，提示密码错误',
    status: TicketStatus.RESOLVED,
    priority: TicketPriority.HIGH,
    customerId: 'CUST001',
    customerName: '北京科技创新有限公司',
    contactId: 'CONT001',
    contactName: '张经理',
    assigneeId: 'USER006',
    assigneeName: '钱七',
    categoryId: 'CAT001',
    categoryName: '技术支持',
    source: 'phone',
    createdAt: '2026-03-10 09:00:00',
    updatedAt: '2026-03-10 14:00:00',
    resolvedAt: '2026-03-10 14:00:00',
    dueDate: '2026-03-11 09:00:00',
    tags: ['登录', '密码'],
  },
  {
    id: 'TKT002',
    ticketNumber: 'TKT-2026-002',
    title: '数据导出功能异常',
    description: '客户报表导出时出现乱码',
    status: TicketStatus.IN_PROGRESS,
    priority: TicketPriority.MEDIUM,
    customerId: 'CUST002',
    customerName: '上海智能制造有限公司',
    contactId: 'CONT002',
    contactName: '王总监',
    assigneeId: 'USER001',
    assigneeName: '管理员',
    categoryId: 'CAT002',
    categoryName: '功能问题',
    source: 'email',
    createdAt: '2026-03-11 10:30:00',
    updatedAt: '2026-03-12 09:00:00',
    dueDate: '2026-03-13 10:30:00',
    tags: ['报表', '导出'],
  },
  {
    id: 'TKT003',
    ticketNumber: 'TKT-2026-003',
    title: '新增功能需求 - 客户画像',
    description: '希望增加客户画像分析功能',
    status: TicketStatus.OPEN,
    priority: TicketPriority.LOW,
    customerId: 'CUST003',
    customerName: '广州金融服务有限公司',
    contactId: 'CONT003',
    contactName: '李总',
    categoryId: 'CAT003',
    categoryName: '需求建议',
    source: 'web',
    createdAt: '2026-03-12 14:00:00',
    updatedAt: '2026-03-12 14:00:00',
    dueDate: '2026-03-15 14:00:00',
    tags: ['需求', '客户画像'],
  },
  {
    id: 'TKT004',
    ticketNumber: 'TKT-2026-004',
    title: '系统性能优化咨询',
    description: '大数据量查询时响应较慢',
    status: TicketStatus.IN_PROGRESS,
    priority: TicketPriority.HIGH,
    customerId: 'CUST004',
    customerName: '深圳电子商务有限公司',
    contactId: 'CONT004',
    contactName: '陈经理',
    assigneeId: 'USER001',
    assigneeName: '管理员',
    categoryId: 'CAT001',
    categoryName: '技术支持',
    source: 'wechat',
    createdAt: '2026-03-13 08:30:00',
    updatedAt: '2026-03-13 10:00:00',
    dueDate: '2026-03-14 08:30:00',
    tags: ['性能', '优化'],
  },
  {
    id: 'TKT005',
    ticketNumber: 'TKT-2026-005',
    title: '移动端 APP 崩溃问题',
    description: 'iOS 端在查看客户详情时偶发崩溃',
    status: TicketStatus.OPEN,
    priority: TicketPriority.URGENT,
    customerId: 'CUST005',
    customerName: '杭州网络技术有限公司',
    contactId: 'CONT005',
    contactName: '刘经理',
    assigneeId: 'USER001',
    assigneeName: '管理员',
    categoryId: 'CAT002',
    categoryName: '功能问题',
    source: 'api',
    createdAt: '2026-03-13 11:00:00',
    updatedAt: '2026-03-13 11:00:00',
    dueDate: '2026-03-13 17:00:00',
    tags: ['移动端', '崩溃', 'iOS'],
  },
  {
    id: 'TKT006',
    ticketNumber: 'TKT-2026-006',
    title: '培训需求 - 新员工入职',
    description: '需要为新员工安排系统使用培训',
    status: TicketStatus.PENDING,
    priority: TicketPriority.MEDIUM,
    customerId: 'CUST006',
    customerName: '成都科技有限公司',
    contactId: 'CONT006',
    contactName: '赵总',
    assigneeId: 'USER006',
    assigneeName: '钱七',
    categoryId: 'CAT004',
    categoryName: '培训服务',
    source: 'phone',
    createdAt: '2026-03-11 15:00:00',
    updatedAt: '2026-03-12 10:00:00',
    dueDate: '2026-03-18 15:00:00',
    tags: ['培训', '新员工'],
  },
  {
    id: 'TKT007',
    ticketNumber: 'TKT-2026-007',
    title: 'API 接口对接咨询',
    description: '需要与 ERP 系统进行数据对接',
    status: TicketStatus.OPEN,
    priority: TicketPriority.MEDIUM,
    customerId: 'CUST007',
    customerName: '武汉智能设备有限公司',
    contactId: 'CONT007',
    contactName: '孙经理',
    categoryId: 'CAT005',
    categoryName: '集成对接',
    source: 'email',
    createdAt: '2026-03-12 09:30:00',
    updatedAt: '2026-03-12 09:30:00',
    dueDate: '2026-03-16 09:30:00',
    tags: ['API', 'ERP', '集成'],
  },
  {
    id: 'TKT008',
    ticketNumber: 'TKT-2026-008',
    title: '合同模板定制',
    description: '需要定制符合公司规范合同模板',
    status: TicketStatus.RESOLVED,
    priority: TicketPriority.LOW,
    customerId: 'CUST008',
    customerName: '西安软件有限公司',
    contactId: 'CONT008',
    contactName: '周总监',
    assigneeId: 'USER003',
    assigneeName: '李四',
    categoryId: 'CAT003',
    categoryName: '需求建议',
    source: 'web',
    createdAt: '2026-03-08 10:00:00',
    updatedAt: '2026-03-10 16:00:00',
    resolvedAt: '2026-03-10 16:00:00',
    closedAt: '2026-03-11 09:00:00',
    dueDate: '2026-03-12 10:00:00',
    tags: ['合同', '模板'],
  },
  {
    id: 'TKT009',
    ticketNumber: 'TKT-2026-009',
    title: '数据备份恢复测试',
    description: '需要进行数据备份恢复演练',
    status: TicketStatus.CLOSED,
    priority: TicketPriority.MEDIUM,
    customerId: 'CUST009',
    customerName: '南京电子科技公司',
    contactId: 'CONT009',
    contactName: '吴经理',
    assigneeId: 'USER001',
    assigneeName: '管理员',
    categoryId: 'CAT001',
    categoryName: '技术支持',
    source: 'phone',
    createdAt: '2026-03-05 14:00:00',
    updatedAt: '2026-03-08 10:00:00',
    resolvedAt: '2026-03-07 16:00:00',
    closedAt: '2026-03-08 10:00:00',
    dueDate: '2026-03-08 14:00:00',
    tags: ['数据备份', '演练'],
  },
  {
    id: 'TKT010',
    ticketNumber: 'TKT-2026-010',
    title: '权限配置问题',
    description: '新用户无法查看客户列表',
    status: TicketStatus.RESOLVED,
    priority: TicketPriority.HIGH,
    customerId: 'CUST010',
    customerName: '重庆制造有限公司',
    contactId: 'CONT010',
    contactName: '郑总',
    assigneeId: 'USER001',
    assigneeName: '管理员',
    categoryId: 'CAT001',
    categoryName: '技术支持',
    source: 'wechat',
    createdAt: '2026-03-13 09:00:00',
    updatedAt: '2026-03-13 11:30:00',
    resolvedAt: '2026-03-13 11:30:00',
    dueDate: '2026-03-13 17:00:00',
    tags: ['权限', '配置'],
  },
];

/** 工单处理记录 */
export const ticketActivities: Record<string, TicketActivity[]> = {
  TKT001: [
    {
      id: 'ACT001',
      ticketId: 'TKT001',
      type: 'comment',
      content: '已收到问题，正在排查',
      createdBy: 'USER006',
      createdByName: '钱七',
      createdAt: '2026-03-10 09:30:00',
    },
    {
      id: 'ACT002',
      ticketId: 'TKT001',
      type: 'status_change',
      content: '状态更新为：处理中',
      createdBy: 'USER006',
      createdByName: '钱七',
      createdAt: '2026-03-10 09:30:00',
    },
    {
      id: 'ACT003',
      ticketId: 'TKT001',
      type: 'comment',
      content: '经检查是密码过期导致，已帮助用户重置密码',
      createdBy: 'USER006',
      createdByName: '钱七',
      createdAt: '2026-03-10 14:00:00',
    },
    {
      id: 'ACT004',
      ticketId: 'TKT001',
      type: 'status_change',
      content: '状态更新为：已解决',
      createdBy: 'USER006',
      createdByName: '钱七',
      createdAt: '2026-03-10 14:00:00',
    },
  ],
  TKT002: [
    {
      id: 'ACT005',
      ticketId: 'TKT002',
      type: 'comment',
      content: '已复现问题，正在修复',
      createdBy: 'USER001',
      createdByName: '管理员',
      createdAt: '2026-03-12 09:00:00',
    },
  ],
  TKT004: [
    {
      id: 'ACT006',
      ticketId: 'TKT004',
      type: 'comment',
      content: '已安排技术人员分析性能瓶颈',
      createdBy: 'USER001',
      createdByName: '管理员',
      createdAt: '2026-03-13 10:00:00',
    },
  ],
};

/** 获取工单列表 */
export const getTicketList = (filters?: {
  status?: TicketStatus;
  priority?: TicketPriority;
  assigneeId?: string;
  page?: number;
  pageSize?: number;
}) => {
  let filtered = [...tickets];

  if (filters?.status) {
    filtered = filtered.filter(t => t.status === filters.status);
  }

  if (filters?.priority) {
    filtered = filtered.filter(t => t.priority === filters.priority);
  }

  if (filters?.assigneeId) {
    filtered = filtered.filter(t => t.assigneeId === filters.assigneeId);
  }

  const total = filtered.length;
  const page = filters?.page || 1;
  const pageSize = filters?.pageSize || 20;
  const start = (page - 1) * pageSize;
  const list = filtered.slice(start, start + pageSize);

  return { list, total };
};

/** 获取工单详情 */
export const getTicketById = (id: string): Ticket | undefined => {
  return tickets.find(t => t.id === id);
};

/** 获取工单活动记录 */
export const getTicketActivities = (ticketId: string): TicketActivity[] => {
  return ticketActivities[ticketId] || [];
};

/** 添加工单活动记录 */
export const addTicketActivity = (activity: Omit<TicketActivity, 'id' | 'createdAt'>): TicketActivity => {
  const newActivity: TicketActivity = {
    ...activity,
    id: `ACT${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  if (!ticketActivities[activity.ticketId]) {
    ticketActivities[activity.ticketId] = [];
  }
  ticketActivities[activity.ticketId].push(newActivity);
  return newActivity;
};

/** 创建工单 */
export const createTicket = (data: Omit<Ticket, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt'>): Ticket => {
  const newTicket: Ticket = {
    ...data,
    id: `TKT${Date.now()}`,
    ticketNumber: `TKT-${new Date().getFullYear()}-${String(tickets.length + 1).padStart(3, '0')}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  tickets.push(newTicket);
  return newTicket;
};

/** 更新工单 */
export const updateTicket = (id: string, data: Partial<Ticket>): Ticket | undefined => {
  const index = tickets.findIndex(t => t.id === id);
  if (index === -1) return undefined;

  tickets[index] = {
    ...tickets[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  return tickets[index];
};

/** 获取工单统计 */
export const getTicketStats = () => {
  const stats = {
    total: tickets.length,
    byStatus: {
      [TicketStatus.OPEN]: 0,
      [TicketStatus.IN_PROGRESS]: 0,
      [TicketStatus.PENDING]: 0,
      [TicketStatus.RESOLVED]: 0,
      [TicketStatus.CLOSED]: 0,
    },
    byPriority: {
      [TicketPriority.LOW]: 0,
      [TicketPriority.MEDIUM]: 0,
      [TicketPriority.HIGH]: 0,
      [TicketPriority.URGENT]: 0,
    },
    avgResolveTime: 0,
  };

  let totalResolveTime = 0;
  let resolvedCount = 0;

  tickets.forEach(ticket => {
    stats.byStatus[ticket.status]++;
    stats.byPriority[ticket.priority]++;

    if (ticket.resolvedAt && ticket.createdAt) {
      const created = new Date(ticket.createdAt).getTime();
      const resolved = new Date(ticket.resolvedAt).getTime();
      totalResolveTime += (resolved - created) / (1000 * 60 * 60); // 小时
      resolvedCount++;
    }
  });

  stats.avgResolveTime = resolvedCount > 0 ? Math.round(totalResolveTime / resolvedCount) : 0;

  return stats;
};
