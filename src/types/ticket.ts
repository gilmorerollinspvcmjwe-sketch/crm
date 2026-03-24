/**
 * 工单系统对接类型定义
 */

/** 工单状态枚举 */
export enum TicketStatus {
  OPEN = '待处理',
  IN_PROGRESS = '处理中',
  PENDING = '待反馈',
  RESOLVED = '已解决',
  CLOSED = '已关闭',
}

/** 工单优先级枚举 */
export enum TicketPriority {
  LOW = '低',
  MEDIUM = '中',
  HIGH = '高',
  URGENT = '紧急',
}

/** 工单 */
export interface Ticket {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  customerId?: string;
  customerName?: string;
  contactId?: string;
  contactName?: string;
  assigneeId?: string;
  assigneeName?: string;
  categoryId?: string;
  categoryName: string;
  source: 'phone' | 'email' | 'web' | 'wechat' | 'api';
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  closedAt?: string;
  dueDate?: string;
  tags: string[];
}

/** 工单处理记录 */
export interface TicketActivity {
  id: string;
  ticketId: string;
  type: 'comment' | 'status_change' | 'assign' | 'note';
  content: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  attachmentUrls?: string[];
}

/** 工单筛选条件 */
export interface TicketFilter {
  ticketNumber?: string;
  title?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  assigneeId?: string;
  customerId?: string;
  dateFrom?: string;
  dateTo?: string;
}

/** 工单统计 */
export interface TicketStats {
  total: number;
  byStatus: Record<TicketStatus, number>;
  byPriority: Record<TicketPriority, number>;
  avgResolveTime: number; // 平均解决时间（小时）
}
