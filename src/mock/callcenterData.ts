/**
 * 呼叫中心 Mock 数据
 */
import { OutboundTask, OutboundTaskStatus, CallRecord, CallResult, CallScript, CallCenterStats } from '../types/callcenter';

/** 外呼任务列表 */
export const outboundTasks: OutboundTask[] = [
  {
    id: 'TASK001',
    taskName: '3 月客户回访任务',
    status: OutboundTaskStatus.COMPLETED,
    scriptId: 'SCRIPT001',
    scriptName: '客户满意度回访',
    totalNumbers: 100,
    completedNumbers: 100,
    connectedCount: 65,
    noAnswerCount: 20,
    busyCount: 10,
    rejectedCount: 5,
    assignedTo: 'USER006',
    assignedToName: '钱七',
    scheduledAt: '2026-03-01 09:00:00',
    startedAt: '2026-03-01 09:00:00',
    completedAt: '2026-03-01 17:00:00',
    createdAt: '2026-02-28 15:00:00',
    createdBy: 'USER003',
    createdByName: '李四',
  },
  {
    id: 'TASK002',
    taskName: '新产品推广外呼',
    status: OutboundTaskStatus.RUNNING,
    scriptId: 'SCRIPT002',
    scriptName: 'AI 助手模块推广',
    totalNumbers: 200,
    completedNumbers: 85,
    connectedCount: 52,
    noAnswerCount: 20,
    busyCount: 8,
    rejectedCount: 5,
    assignedTo: 'USER004',
    assignedToName: '王五',
    scheduledAt: '2026-03-13 09:00:00',
    startedAt: '2026-03-13 09:00:00',
    createdAt: '2026-03-12 16:00:00',
    createdBy: 'USER002',
    createdByName: '张三',
  },
  {
    id: 'TASK003',
    taskName: '续费提醒外呼',
    status: OutboundTaskStatus.PENDING,
    scriptId: 'SCRIPT003',
    scriptName: '年度维护续费提醒',
    totalNumbers: 50,
    completedNumbers: 0,
    connectedCount: 0,
    noAnswerCount: 0,
    busyCount: 0,
    rejectedCount: 0,
    assignedTo: 'USER005',
    assignedToName: '赵六',
    scheduledAt: '2026-03-15 09:00:00',
    createdAt: '2026-03-13 10:00:00',
    createdBy: 'USER003',
    createdByName: '李四',
  },
  {
    id: 'TASK004',
    taskName: '活动邀约外呼',
    status: OutboundTaskStatus.COMPLETED,
    scriptId: 'SCRIPT004',
    scriptName: '春季产品发布会邀约',
    totalNumbers: 150,
    completedNumbers: 150,
    connectedCount: 98,
    noAnswerCount: 30,
    busyCount: 15,
    rejectedCount: 7,
    assignedTo: 'USER006',
    assignedToName: '钱七',
    scheduledAt: '2026-02-25 09:00:00',
    startedAt: '2026-02-25 09:00:00',
    completedAt: '2026-02-25 18:00:00',
    createdAt: '2026-02-24 14:00:00',
    createdBy: 'USER003',
    createdByName: '李四',
  },
  {
    id: 'TASK005',
    taskName: '流失客户挽回',
    status: OutboundTaskStatus.PAUSED,
    scriptId: 'SCRIPT005',
    scriptName: '客户挽回话术',
    totalNumbers: 80,
    completedNumbers: 30,
    connectedCount: 18,
    noAnswerCount: 8,
    busyCount: 3,
    rejectedCount: 1,
    assignedTo: 'USER004',
    assignedToName: '王五',
    scheduledAt: '2026-03-10 09:00:00',
    startedAt: '2026-03-10 09:00:00',
    createdAt: '2026-03-09 15:00:00',
    createdBy: 'USER002',
    createdByName: '张三',
  },
  {
    id: 'TASK006',
    taskName: '线索初步筛选',
    status: OutboundTaskStatus.RUNNING,
    scriptId: 'SCRIPT006',
    scriptName: '线索资格确认',
    totalNumbers: 300,
    completedNumbers: 120,
    connectedCount: 75,
    noAnswerCount: 30,
    busyCount: 10,
    rejectedCount: 5,
    assignedTo: 'USER005',
    assignedToName: '赵六',
    scheduledAt: '2026-03-13 09:00:00',
    startedAt: '2026-03-13 09:00:00',
    createdAt: '2026-03-12 17:00:00',
    createdBy: 'USER003',
    createdByName: '李四',
  },
  {
    id: 'TASK007',
    taskName: '培训通知外呼',
    status: OutboundTaskStatus.CANCELLED,
    scriptId: 'SCRIPT007',
    scriptName: '培训通知',
    totalNumbers: 60,
    completedNumbers: 0,
    connectedCount: 0,
    noAnswerCount: 0,
    busyCount: 0,
    rejectedCount: 0,
    assignedTo: 'USER006',
    assignedToName: '钱七',
    scheduledAt: '2026-03-08 09:00:00',
    createdAt: '2026-03-07 10:00:00',
    createdBy: 'USER003',
    createdByName: '李四',
  },
];

/** 呼叫记录 */
export const callRecords: CallRecord[] = [
  {
    id: 'CALL001',
    taskId: 'TASK001',
    phoneNumber: '13800138001',
    customerName: '张经理',
    customerId: 'CUST001',
    result: CallResult.CONNECTED,
    duration: 320,
    recordingUrl: '/recordings/CALL001.mp3',
    notes: '客户对产品满意，表示会继续使用',
    followUpRequired: false,
    calledAt: '2026-03-01 09:15:00',
    calledBy: 'USER006',
    calledByName: '钱七',
  },
  {
    id: 'CALL002',
    taskId: 'TASK001',
    phoneNumber: '13800138002',
    customerName: '王总监',
    customerId: 'CUST002',
    result: CallResult.NO_ANSWER,
    duration: 0,
    notes: '无人接听，稍后重拨',
    followUpRequired: true,
    followUpDate: '2026-03-01 14:00:00',
    calledAt: '2026-03-01 09:20:00',
    calledBy: 'USER006',
    calledByName: '钱七',
  },
  {
    id: 'CALL003',
    taskId: 'TASK001',
    phoneNumber: '13800138003',
    customerName: '李总',
    customerId: 'CUST003',
    result: CallResult.CONNECTED,
    duration: 450,
    recordingUrl: '/recordings/CALL003.mp3',
    notes: '提出了一些改进建议，已记录',
    followUpRequired: true,
    followUpDate: '2026-03-02 10:00:00',
    calledAt: '2026-03-01 09:30:00',
    calledBy: 'USER006',
    calledByName: '钱七',
  },
  {
    id: 'CALL004',
    taskId: 'TASK002',
    phoneNumber: '13900139001',
    customerName: '陈经理',
    customerId: 'CUST004',
    result: CallResult.CONNECTED,
    duration: 280,
    recordingUrl: '/recordings/CALL004.mp3',
    notes: '对 AI 助手感兴趣，要求发送详细资料',
    followUpRequired: true,
    followUpDate: '2026-03-13 15:00:00',
    calledAt: '2026-03-13 09:10:00',
    calledBy: 'USER004',
    calledByName: '王五',
  },
  {
    id: 'CALL005',
    taskId: 'TASK002',
    phoneNumber: '13900139002',
    result: CallResult.BUSY,
    duration: 0,
    notes: '占线',
    followUpRequired: true,
    followUpDate: '2026-03-13 11:00:00',
    calledAt: '2026-03-13 09:15:00',
    calledBy: 'USER004',
    calledByName: '王五',
  },
  {
    id: 'CALL006',
    taskId: 'TASK004',
    phoneNumber: '13700137001',
    customerName: '刘经理',
    customerId: 'CUST005',
    result: CallResult.CONNECTED,
    duration: 180,
    recordingUrl: '/recordings/CALL006.mp3',
    notes: '确认参加活动',
    followUpRequired: false,
    calledAt: '2026-02-25 09:20:00',
    calledBy: 'USER006',
    calledByName: '钱七',
  },
];

/** 呼叫脚本 */
export const callScripts: CallScript[] = [
  {
    id: 'SCRIPT001',
    name: '客户满意度回访',
    content: `【开场】您好，请问是{客户姓名}吗？我是 CRM 公司的客服代表。

【目的】感谢您使用我们的产品，今天致电是想了解一下您的使用体验。

【问题】
1. 您对系统的整体满意度如何？（1-5 分）
2. 哪些功能对您帮助最大？
3. 有没有遇到什么问题或困难？
4. 有什么建议或期望？

【结束】感谢您的反馈，我们会持续改进。如有问题随时联系我们。祝您工作顺利！`,
    category: '客户回访',
    tags: ['回访', '满意度'],
    isSystem: true,
    createdBy: 'SYSTEM',
    createdByName: '系统',
    createdAt: '2026-01-01 00:00:00',
    updatedAt: '2026-01-01 00:00:00',
  },
  {
    id: 'SCRIPT002',
    name: 'AI 助手模块推广',
    content: `【开场】您好，{客户姓名}，我是 CRM 公司的{销售姓名}。

【引入】注意到您是我们的老客户，今天有个好消息想分享给您。

【介绍】我们新推出了 AI 智能助手模块，可以帮您：
1. 自动跟进客户
2. 智能分析客户意向
3. 生成销售建议

【优惠】老客户升级享受 8 折优惠。

【结束】您看要不要安排个演示？`,
    category: '产品推广',
    tags: ['推广', 'AI', '销售'],
    isSystem: true,
    createdBy: 'SYSTEM',
    createdByName: '系统',
    createdAt: '2026-01-01 00:00:00',
    updatedAt: '2026-03-01 10:00:00',
  },
  {
    id: 'SCRIPT003',
    name: '年度维护续费提醒',
    content: `【开场】您好，{客户姓名}，我是 CRM 公司的{销售姓名}。

【提醒】您的年度维护服务即将于{到期日期}到期。

【价值】续费后可继续享受：
1. 技术支持
2. 系统升级
3. 数据备份

【优惠】提前续费享受 9 折优惠。

【结束】我稍后把续费方案发您邮箱？`,
    category: '续费提醒',
    tags: ['续费', '维护'],
    isSystem: true,
    createdBy: 'SYSTEM',
    createdByName: '系统',
    createdAt: '2026-01-01 00:00:00',
    updatedAt: '2026-01-01 00:00:00',
  },
  {
    id: 'SCRIPT004',
    name: '春季产品发布会邀约',
    content: `【开场】您好，{客户姓名}，我是 CRM 公司的{销售姓名}。

【邀请】我们将于{活动日期}举办春季产品发布会。

【亮点】
1. 新产品发布
2. 行业专家分享
3. 客户案例交流

【信息】地点：{地点}，时间：{时间}

【结束】给您预留个席位？`,
    category: '活动邀约',
    tags: ['活动', '邀约'],
    isSystem: true,
    createdBy: 'SYSTEM',
    createdByName: '系统',
    createdAt: '2026-01-01 00:00:00',
    updatedAt: '2026-02-01 10:00:00',
  },
  {
    id: 'SCRIPT005',
    name: '客户挽回话术',
    content: `【开场】您好，{客户姓名}，我是 CRM 公司的{销售姓名}。

【关心】注意到您最近没有使用系统，想了解一下情况。

【倾听】是遇到什么问题了吗？

【解决】如果是技术问题，我们可以安排专人支持。

【优惠】为表诚意，提供 3 个月免费延期。

【结束】希望能继续为您服务。`,
    category: '客户挽回',
    tags: ['挽回', '流失'],
    isSystem: true,
    createdBy: 'SYSTEM',
    createdByName: '系统',
    createdAt: '2026-01-01 00:00:00',
    updatedAt: '2026-01-01 00:00:00',
  },
  {
    id: 'SCRIPT006',
    name: '线索资格确认',
    content: `【开场】您好，请问是{客户姓名}吗？我是 CRM 公司的{销售姓名}。

【确认】看到您在我们官网留下了信息，想了解一下您的需求。

【问题】
1. 贵公司目前使用什么系统管理客户？
2. 团队规模多大？
3. 主要想解决什么问题？
4. 预算范围？

【结束】感谢您的时间，我整理一下需求后给您方案。`,
    category: '线索筛选',
    tags: ['线索', '筛选'],
    isSystem: true,
    createdBy: 'SYSTEM',
    createdByName: '系统',
    createdAt: '2026-01-01 00:00:00',
    updatedAt: '2026-01-01 00:00:00',
  },
  {
    id: 'SCRIPT007',
    name: '培训通知',
    content: `【开场】您好，{客户姓名}，我是 CRM 公司的{销售姓名}。

【通知】我们将于{培训日期}举办线上培训。

【内容】
1. 新功能介绍
2. 使用技巧
3. 答疑

【信息】时间：{时间}，链接：{链接}

【结束】准时参加哦！`,
    category: '培训通知',
    tags: ['培训', '通知'],
    isSystem: true,
    createdBy: 'SYSTEM',
    createdByName: '系统',
    createdAt: '2026-01-01 00:00:00',
    updatedAt: '2026-01-01 00:00:00',
  },
  {
    id: 'SCRIPT008',
    name: '自定义脚本模板',
    content: `【开场】{开场白}

【内容】{主要内容}

【结束】{结束语}`,
    category: '自定义',
    tags: ['模板'],
    isSystem: false,
    createdBy: 'USER003',
    createdByName: '李四',
    createdAt: '2026-03-01 10:00:00',
    updatedAt: '2026-03-01 10:00:00',
  },
];

/** 获取外呼任务列表 */
export const getOutboundTaskList = (filters?: {
  status?: OutboundTaskStatus;
  assignedTo?: string;
  page?: number;
  pageSize?: number;
}) => {
  let filtered = [...outboundTasks];

  if (filters?.status) {
    filtered = filtered.filter(t => t.status === filters.status);
  }

  if (filters?.assignedTo) {
    filtered = filtered.filter(t => t.assignedTo === filters.assignedTo);
  }

  const total = filtered.length;
  const page = filters?.page || 1;
  const pageSize = filters?.pageSize || 20;
  const start = (page - 1) * pageSize;
  const list = filtered.slice(start, start + pageSize);

  return { list, total };
};

/** 获取外呼任务详情 */
export const getOutboundTaskById = (id: string): OutboundTask | undefined => {
  return outboundTasks.find(t => t.id === id);
};

/** 获取任务的呼叫记录 */
export const getCallRecordsByTask = (taskId: string): CallRecord[] => {
  return callRecords.filter(r => r.taskId === taskId);
};

/** 获取呼叫脚本列表 */
export const getCallScripts = (): CallScript[] => {
  return callScripts;
};

/** 获取呼叫脚本详情 */
export const getCallScriptById = (id: string): CallScript | undefined => {
  return callScripts.find(s => s.id === id);
};

/** 创建外呼任务 */
export const createOutboundTask = (data: Omit<OutboundTask, 'id' | 'createdAt' | 'createdBy' | 'createdByName'>): OutboundTask => {
  const newTask: OutboundTask = {
    ...data,
    id: `TASK${Date.now()}`,
    createdAt: new Date().toISOString(),
    createdBy: 'USER001',
    createdByName: '当前用户',
  };
  outboundTasks.push(newTask);
  return newTask;
};

/** 更新外呼任务 */
export const updateOutboundTask = (id: string, data: Partial<OutboundTask>): OutboundTask | undefined => {
  const index = outboundTasks.findIndex(t => t.id === id);
  if (index === -1) return undefined;

  outboundTasks[index] = {
    ...outboundTasks[index],
    ...data,
  };
  return outboundTasks[index];
};

/** 获取呼叫中心统计 */
export const getCallCenterStats = (): CallCenterStats => {
  const totalTasks = outboundTasks.length;
  const totalCalls = callRecords.length;
  const connectedCount = callRecords.filter(r => r.result === CallResult.CONNECTED).length;
  const totalDuration = callRecords.reduce((sum, r) => sum + r.duration, 0);

  // 今日数据
  const today = new Date().toDateString();
  const todayCalls = callRecords.filter(r => new Date(r.calledAt).toDateString() === today).length;
  const todayConnected = callRecords.filter(
    r => r.result === CallResult.CONNECTED && new Date(r.calledAt).toDateString() === today
  ).length;

  return {
    totalTasks,
    totalCalls,
    connectedRate: totalCalls > 0 ? Math.round((connectedCount / totalCalls) * 100) : 0,
    avgDuration: totalCalls > 0 ? Math.round(totalDuration / totalCalls) : 0,
    todayCalls,
    todayConnected,
  };
};
