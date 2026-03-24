/**
 * 工单系统服务
 */
import { Ticket, TicketStatus, TicketPriority, TicketActivity, TicketFilter } from '../types/ticket';
import {
  tickets,
  getTicketList as mockGetList,
  getTicketById as mockGetById,
  getTicketActivities as mockGetActivities,
  addTicketActivity as mockAddActivity,
  createTicket as mockCreate,
  updateTicket as mockUpdate,
  getTicketStats as mockGetStats,
} from '../mock/ticketData';

/** 获取工单列表 */
export const getTicketList = (filters?: {
  status?: TicketStatus;
  priority?: TicketPriority;
  assigneeId?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ list: Ticket[]; total: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const result = mockGetList(filters);
      resolve(result);
    }, 300);
  });
};

/** 获取工单详情 */
export const getTicketById = (id: string): Promise<Ticket | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const ticket = mockGetById(id);
      resolve(ticket);
    }, 200);
  });
};

/** 获取工单活动记录 */
export const getTicketActivities = (ticketId: string): Promise<TicketActivity[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const activities = mockGetActivities(ticketId);
      resolve(activities);
    }, 200);
  });
};

/** 添加工单活动记录 */
export const addTicketActivity = (activity: Omit<TicketActivity, 'id' | 'createdAt'>): Promise<TicketActivity> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newActivity = mockAddActivity(activity);
      resolve(newActivity);
    }, 200);
  });
};

/** 创建工单 */
export const createTicket = (data: Omit<Ticket, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt'>): Promise<Ticket> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const ticket = mockCreate(data);
      resolve(ticket);
    }, 300);
  });
};

/** 更新工单 */
export const updateTicket = (id: string, data: Partial<Ticket>): Promise<Ticket | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const ticket = mockUpdate(id, data);
      resolve(ticket);
    }, 300);
  });
};

/** 获取工单统计 */
export const getTicketStats = (): Promise<{
  total: number;
  byStatus: Record<TicketStatus, number>;
  byPriority: Record<TicketPriority, number>;
  avgResolveTime: number;
}> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const stats = mockGetStats();
      resolve(stats);
    }, 200);
  });
};

/** 获取工单状态选项 */
export const getTicketStatuses = (): Promise<{ value: TicketStatus; label: string }[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        Object.values(TicketStatus).map(status => ({
          value: status,
          label: status,
        }))
      );
    }, 100);
  });
};

/** 获取工单优先级选项 */
export const getTicketPriorities = (): Promise<{ value: TicketPriority; label: string }[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        Object.values(TicketPriority).map(priority => ({
          value: priority,
          label: priority,
        }))
      );
    }, 100);
  });
};
