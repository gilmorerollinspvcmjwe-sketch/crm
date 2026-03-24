/**
 * 商机模块类型定义
 */

/** 商机阶段枚举 */
export enum OpportunityStage {
  LEAD_CONFIRMATION = '线索确认',
  INITIAL_CONTACT = '初步接触',
  REQUIREMENT_CONFIRMATION = '需求确认',
  PROPOSAL_QUOTATION = '方案报价',
  NEGOTIATION_APPROVAL = '谈判审批',
  CLOSED_WON = '已成交',
  CLOSED_LOST = '已输单'
}

/** 商机来源枚举 */
export enum OpportunitySource {
  MARKETING_EVENT = '市场活动',
  REFERRAL = '转介绍',
  WEBSITE = '官网',
  COLD_CALL = '陌拜',
  OTHER = '其他'
}

/** 商机状态枚举 */
export enum OpportunityStatus {
  IN_PROGRESS = '跟进中',
  CLOSED_WON = '已成交',
  CLOSED_LOST = '已输单',
  CLOSED = '已关闭'
}

/** 竞争对手接口 */
export interface Competitor {
  id: string;
  name: string;
  advantage: string;
  disadvantage: string;
}

/** 商机接口 */
export interface Opportunity {
  id: string;
  name: string;
  customerId: string;
  customerName: string;
  amount: number;
  stage: OpportunityStage;
  estimatedCloseDate: string;
  probability: number;
  source: OpportunitySource;
  status: OpportunityStatus;
  owner: string;
  ownerName: string;
  contacts: string[];
  contactNames: string[];
  competitors: Competitor[];
  description: string;
  budget: string;
  decisionProcess: string;
  nextFollowupTime?: string;
  createdAt: string;
  updatedAt: string;
}

/** 销售漏斗统计接口 */
export interface SalesFunnelStats {
  stage: OpportunityStage;
  count: number;
  totalAmount: number;
  probability: number;
}

/** 商机筛选条件接口 */
export interface OpportunityFilter {
  name?: string;
  customerName?: string;
  stage?: OpportunityStage;
  owner?: string;
  status?: OpportunityStatus;
}
