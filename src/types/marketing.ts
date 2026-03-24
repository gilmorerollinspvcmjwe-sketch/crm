/**
 * 营销自动化模块类型定义
 */

/** 营销活动类型枚举 */
export enum CampaignType {
  EMAIL = '邮件营销',
  SMS = '短信营销',
  SOCIAL = '社交媒体',
  WEBINAR = '网络研讨会',
  EVENT = '线下活动',
  CONTENT = '内容营销',
  ADS = '广告投放'
}

/** 营销活动状态枚举 */
export enum CampaignStatus {
  DRAFT = '草稿',
  SCHEDULED = '已计划',
  RUNNING = '进行中',
  PAUSED = '已暂停',
  COMPLETED = '已完成'
}

/** 邮件模板接口 */
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  category: string;
  variables: string[]; // 可用变量列表
  previewText?: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}

/** 目标客户列表接口 */
export interface TargetList {
  id: string;
  name: string;
  description?: string;
  customerCount: number;
  criteria: string; // 筛选条件描述
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}

/** 活动效果指标接口 */
export interface CampaignMetrics {
  sent: number; // 发送数量
  delivered: number; // 送达数量
  opened: number; // 打开数量
  clicked: number; // 点击数量
  converted: number; // 转化数量
  bounced: number; // 退回数量
  unsubscribed: number; // 退订数量
  openRate: number; // 打开率
  clickRate: number; // 点击率
  conversionRate: number; // 转化率
}

/** 触发条件类型 */
export enum TriggerType {
  TIME_BASED = '时间触发',
  BEHAVIOR_BASED = '行为触发',
  ATTRIBUTE_BASED = '属性触发',
  EVENT_BASED = '事件触发'
}

/** 执行动作类型 */
export enum ActionType {
  SEND_EMAIL = '发送邮件',
  SEND_SMS = '发送短信',
  CREATE_TASK = '创建任务',
  UPDATE_FIELD = '更新字段',
  ADD_TO_LIST = '加入列表',
  REMOVE_FROM_LIST = '移出列表',
  NOTIFY_USER = '通知用户'
}

/** 工作流节点接口 */
export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'end';
  name: string;
  triggerType?: TriggerType;
  actionType?: ActionType;
  config: Record<string, any>;
  position: { x: number; y: number };
}

/** 工作流连接接口 */
export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

/** 自动化工作流接口 */
export interface Workflow {
  id: string;
  name: string;
  description?: string;
  campaignId?: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  isActive: boolean;
  triggeredCount: number;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}

/** 营销活动接口 */
export interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  goal: string; // 活动目标
  budget: number;
  startDate: string;
  endDate: string;
  targetListId?: string;
  targetListName?: string;
  emailTemplateId?: string;
  emailTemplateName?: string;
  workflowId?: string;
  workflowName?: string;
  metrics?: CampaignMetrics; // 活动效果指标，进行中/已完成的活动才有
  description?: string;
  owner: string;
  ownerName: string;
  createdAt: string;
  updatedAt: string;
}

/** 营销活动筛选条件接口 */
export interface CampaignFilter {
  name?: string;
  type?: CampaignType;
  status?: CampaignStatus;
  owner?: string;
}

/** 参与活动的客户接口 */
export interface CampaignParticipant {
  id: string;
  customerId: string;
  customerName: string;
  email?: string;
  phone?: string;
  status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'converted' | 'bounced';
  participatedAt: string;
}
