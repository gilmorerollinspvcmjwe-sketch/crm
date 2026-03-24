/**
 * 呼叫中心对接类型定义
 */

/** 外呼任务状态枚举 */
export enum OutboundTaskStatus {
  PENDING = '待执行',
  RUNNING = '执行中',
  PAUSED = '已暂停',
  COMPLETED = '已完成',
  CANCELLED = '已取消',
}

/** 呼叫结果枚举 */
export enum CallResult {
  NO_ANSWER = '无人接听',
  BUSY = '占线',
  CONNECTED = '已接通',
  WRONG_NUMBER = '空号',
  REJECTED = '拒接',
  CALLBACK = '要求回拨',
}

/** 外呼任务 */
export interface OutboundTask {
  id: string;
  taskName: string;
  status: OutboundTaskStatus;
  scriptId?: string;
  scriptName?: string;
  totalNumbers: number;
  completedNumbers: number;
  connectedCount: number;
  noAnswerCount: number;
  busyCount: number;
  rejectedCount: number;
  assignedTo?: string;
  assignedToName?: string;
  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  createdBy: string;
  createdByName: string;
}

/** 外呼号码记录 */
export interface CallRecord {
  id: string;
  taskId: string;
  phoneNumber: string;
  customerName?: string;
  customerId?: string;
  result: CallResult;
  duration: number; // 通话时长（秒）
  recordingUrl?: string;
  notes?: string;
  followUpRequired: boolean;
  followUpDate?: string;
  calledAt: string;
  calledBy?: string;
  calledByName?: string;
}

/** 呼叫脚本 */
export interface CallScript {
  id: string;
  name: string;
  content: string;
  category: string;
  tags: string[];
  isSystem: boolean;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}

/** 外呼任务筛选条件 */
export interface OutboundTaskFilter {
  taskName?: string;
  status?: OutboundTaskStatus;
  assignedTo?: string;
  dateFrom?: string;
  dateTo?: string;
}

/** 呼叫中心统计 */
export interface CallCenterStats {
  totalTasks: number;
  totalCalls: number;
  connectedRate: number; // 接通率
  avgDuration: number; // 平均通话时长
  todayCalls: number;
  todayConnected: number;
}
