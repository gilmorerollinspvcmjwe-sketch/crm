/**
 * 跟进记录模块类型定义
 */

/** 跟进类型枚举 */
export enum ActivityType {
  PHONE = '电话',
  VISIT = '拜访',
  EMAIL = '邮件',
  WECHAT = '微信',
  MEETING = '会议',
  OTHER = '其他'
}

/** 跟进方式枚举 */
export enum ActivityMethod {
  INBOUND = '呼入',
  OUTBOUND = '呼出',
  ONSITE = '上门',
  ONLINE = '在线'
}

/** 跟进结果枚举 */
export enum ActivityResult {
  PROGRESS = '有进展',
  NO_PROGRESS = '无进展',
  NEED_FOLLOWUP = '需跟进'
}

/** 客户意向度枚举 */
export enum CustomerInterest {
  HIGH = '高',
  MEDIUM = '中',
  LOW = '低'
}

/** 关联对象类型枚举 */
export enum RelatedObjectType {
  CUSTOMER = '客户',
  CONTACT = '联系人',
  OPPORTUNITY = '商机',
  LEAD = '线索'
}

/** 附件接口 */
export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
}

/** 跟进记录接口 */
export interface Activity {
  id: string;
  type: ActivityType;
  subject: string;
  content: string;
  relatedObjectType: RelatedObjectType;
  relatedObjectId: string;
  relatedObjectName: string;
  contactIds: string[];
  contactNames: string[];
  opportunityId?: string;
  opportunityName?: string;
  activityTime: string;
  duration?: number;
  method?: ActivityMethod;
  nextFollowupTime?: string;
  nextFollowupContent?: string;
  attachments?: Attachment[];
  recordings?: string[];
  photos?: string[];
  checkInLocation?: string;
  checkInTime?: string;
  participants?: string[];
  customerParticipants?: string;
  result?: ActivityResult;
  interestLevel?: CustomerInterest;
  createdBy: string;
  createdByName: string;
  createdAt: string;
}

/** 跟进记录筛选条件接口 */
export interface ActivityFilter {
  relatedObjectType?: RelatedObjectType;
  type?: ActivityType;
  createdBy?: string;
  dateFrom?: string;
  dateTo?: string;
}

/** 日历视图数据接口 */
export interface CalendarActivity {
  id: string;
  title: string;
  start: string;
  end: string;
  type: ActivityType;
  allDay?: boolean;
}
