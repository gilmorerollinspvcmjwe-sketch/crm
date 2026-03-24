/**
 * 呼叫中心服务
 */
import {
  OutboundTask,
  OutboundTaskStatus,
  CallRecord,
  CallScript,
  CallCenterStats,
} from '../types/callcenter';
import {
  outboundTasks,
  getOutboundTaskList as mockGetTaskList,
  getOutboundTaskById as mockGetTaskById,
  getCallRecordsByTask as mockGetCallRecords,
  getCallScripts as mockGetScripts,
  getCallScriptById as mockGetScriptById,
  createOutboundTask as mockCreateTask,
  updateOutboundTask as mockUpdateTask,
  getCallCenterStats as mockGetStats,
} from '../mock/callcenterData';

/** 获取外呼任务列表 */
export const getOutboundTaskList = (filters?: {
  status?: OutboundTaskStatus;
  assignedTo?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ list: OutboundTask[]; total: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const result = mockGetTaskList(filters);
      resolve(result);
    }, 300);
  });
};

/** 获取外呼任务详情 */
export const getOutboundTaskById = (id: string): Promise<OutboundTask | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const task = mockGetTaskById(id);
      resolve(task);
    }, 200);
  });
};

/** 获取呼叫记录 */
export const getCallRecordsByTask = (taskId: string): Promise<CallRecord[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const records = mockGetCallRecords(taskId);
      resolve(records);
    }, 200);
  });
};

/** 获取呼叫脚本列表 */
export const getCallScripts = (): Promise<CallScript[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const scripts = mockGetScripts();
      resolve(scripts);
    }, 200);
  });
};

/** 获取呼叫脚本详情 */
export const getCallScriptById = (id: string): Promise<CallScript | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const script = mockGetScriptById(id);
      resolve(script);
    }, 200);
  });
};

/** 创建外呼任务 */
export const createOutboundTask = (
  data: Omit<OutboundTask, 'id' | 'createdAt' | 'createdBy' | 'createdByName'>
): Promise<OutboundTask> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const task = mockCreateTask(data);
      resolve(task);
    }, 300);
  });
};

/** 更新外呼任务 */
export const updateOutboundTask = (id: string, data: Partial<OutboundTask>): Promise<OutboundTask | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const task = mockUpdateTask(id, data);
      resolve(task);
    }, 300);
  });
};

/** 获取呼叫中心统计 */
export const getCallCenterStats = (): Promise<CallCenterStats> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const stats = mockGetStats();
      resolve(stats);
    }, 200);
  });
};

/** 获取外呼任务状态选项 */
export const getOutboundTaskStatuses = (): Promise<{ value: OutboundTaskStatus; label: string }[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        Object.values(OutboundTaskStatus).map(status => ({
          value: status,
          label: status,
        }))
      );
    }, 100);
  });
};
