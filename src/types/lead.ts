/**
 * 线索模块类型定义
 * 基于 CRM_Product_Design_v2.2 字段设计
 */

/** 线索状态枚举 */
export type LeadStatus = '待跟进' | '跟进中' | '已转化' | '已关闭';

/** 线索来源枚举 */
export type LeadSource = '市场活动' | '官网' | '转介绍' | '陌拜' | '广告' | '其他';

/** 线索等级枚举 */
export type LeadLevel = 'A' | 'B' | 'C' | 'D';

/** 预算范围枚举 */
export type BudgetRange = 
  | '10 万以下'
  | '10-50 万'
  | '50-100 万'
  | '100-500 万'
  | '500 万以上';

/** 预计采购时间枚举 */
export type PurchaseTimeframe = 
  | '1 个月内'
  | '1-3 个月'
  | '3-6 个月'
  | '6 个月以上';

/** 线索基本信息 */
export interface Lead {
  /** 线索 ID - 唯一标识 */
  id: string;
  /** 线索名称 - 线索标题/公司名称 */
  name: string;
  /** 联系人姓名 */
  contactName: string;
  /** 联系人职位 */
  position?: string;
  /** 手机号码 */
  mobile: string;
  /** 邮箱 */
  email?: string;
  /** 公司名称 */
  companyName?: string;
  /** 所属行业 */
  industry?: string;
  /** 公司规模 */
  companySize?: string;
  /** 线索来源 */
  source: LeadSource;
  /** 来源明细 - 具体来源 */
  sourceDetail?: string;
  /** 线索状态 */
  status: LeadStatus;
  /** 线索评分 - 0-100 */
  score?: number;
  /** 线索等级 */
  level?: LeadLevel;
  /** 线索内容 - 需求描述 */
  content?: string;
  /** 预算范围 */
  budget?: BudgetRange;
  /** 预计采购时间 */
  purchaseTimeframe?: PurchaseTimeframe;
  /** 线索 Owner - 负责人 ID */
  ownerId: string;
  /** 线索 Owner 姓名 */
  ownerName?: string;
  /** 创建人 */
  createdBy: string;
  /** 创建时间 */
  createdAt: string;
  /** 首次联系时间 */
  firstContactTime?: string;
  /** 最后跟进时间 */
  lastContactTime?: string;
  /** 转化时间 */
  convertedAt?: string;
  /** 转化客户 ID */
  convertedCustomerId?: string;
  /** 转化客户名称 */
  convertedCustomerName?: string;
  /** 无效原因 */
  invalidReason?: string;
  /** 备注 */
  remark?: string;
}

/** 跟进记录 */
export interface FollowUpRecord {
  /** 跟进 ID */
  id: string;
  /** 跟进类型 */
  type: '电话' | '拜访' | '邮件' | '微信' | '会议' | '其他';
  /** 跟进主题 */
  subject: string;
  /** 跟进内容 */
  content: string;
  /** 跟进时间 */
  followUpTime: string;
  /** 跟进时长（分钟） */
  duration?: number;
  /** 下次跟进时间 */
  nextFollowUpTime?: string;
  /** 创建人 */
  createdBy: string;
  /** 创建时间 */
  createdAt: string;
}

/** 线索列表查询参数 */
export interface LeadQueryParams {
  /** 线索名称搜索 */
  name?: string;
  /** 来源筛选 */
  source?: LeadSource;
  /** 状态筛选 */
  status?: LeadStatus;
  /** 负责人筛选 */
  ownerId?: string;
  /** 页码 */
  page?: number;
  /** 每页条数 */
  pageSize?: number;
}

/** 线索列表响应 */
export interface LeadListResponse {
  /** 线索列表 */
  list: Lead[];
  /** 总条数 */
  total: number;
  /** 当前页码 */
  page: number;
  /** 每页条数 */
  pageSize: number;
}
