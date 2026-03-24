/**
 * AI 功能相关类型定义
 */

// ========== 智能线索分配 ==========
export interface SalesPerson {
  id: string;
  name: string;
  avatar?: string;
  currentLoad: number; // 当前负载线索数
  maxLoad: number; // 最大负载
  conversionRate: number; // 历史转化率 (%)
  region: string; // 负责区域
  industry: string[]; // 擅长行业
  status: 'available' | 'busy' | 'offline'; // 状态
}

export interface LeadAssignmentRecommendation {
  salesId: string;
  salesName: string;
  score: number; // 推荐分数 0-100
  reasons: string[]; // 推荐原因
  matchFactors: {
    workload: number; // 负载匹配度
    conversion: number; // 转化率匹配度
    region: number; // 区域匹配度
    industry: number; // 行业匹配度
  };
}

export interface LeadToAssign {
  id: string;
  name: string;
  contactName: string;
  companyName: string;
  industry: string;
  region: string;
  score: number;
  source: string;
  createdAt: string;
  recommendations: LeadAssignmentRecommendation[];
  assignedTo?: string; // 已分配的销售 ID
  assignedToName?: string;
}

// ========== 线索评分 AI ==========
export interface LeadScoreDetail {
  totalScore: number; // 总分 0-100
  attributeScore: number; // 属性分 0-60
  behaviorScore: number; // 行为分 0-40
  attributeDetails: {
    industryMatch: number; // 行业匹配
    companySize: number; // 公司规模
    positionLevel: number; // 职位级别
  };
  behaviorDetails: {
    websiteVisit: number; // 网站访问
    emailOpen: number; // 邮件打开
    activityParticipation: number; // 活动参与
  };
  level: 'A' | 'B' | 'C' | 'D'; // 等级
  isHighValue: boolean; // 是否高价值 (>=80)
}

export interface ScoredLead {
  id: string;
  name: string;
  contactName: string;
  companyName: string;
  industry: string;
  scoreDetail: LeadScoreDetail;
  lastActivity: string;
  ownerName: string;
}

// ========== 销售预测 AI ==========
export interface SalesForecastData {
  period: 'monthly' | 'quarterly' | 'yearly';
  predictions: ForecastItem[];
  actuals: ForecastItem[];
  accuracy: number; // 预测准确率 (%)
  trend: 'up' | 'down' | 'stable';
  breakdownByProduct: ProductForecast[];
  breakdownByRegion: RegionForecast[];
  breakdownBySales: SalesForecast[];
}

export interface ForecastItem {
  period: string; // 如 "2026-01" 或 "Q1 2026"
  predicted: number;
  actual?: number;
}

export interface ProductForecast {
  product: string;
  predicted: number;
  percentage: number;
}

export interface RegionForecast {
  region: string;
  predicted: number;
  percentage: number;
  growth: number; // 增长率 (%)
}

export interface SalesForecast {
  salesName: string;
  predicted: number;
  percentage: number;
  quota: number; // 销售配额
  attainment: number; // 达成率 (%)
}

// ========== 客户分群 AI ==========
export interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  color: string;
  count: number;
  percentage: number;
  characteristics: {
    recency: number; // 最近消费 (天)
    frequency: number; // 消费频率 (次/年)
    monetary: number; // 消费金额 (元)
  };
  features: {
    avgDealSize: number;
    avgCycle: number; // 平均成交周期 (天)
    retentionRate: number; // 留存率 (%)
    satisfaction: number; // 满意度 (1-5)
  };
}

export interface SegmentedCustomer {
  id: string;
  name: string;
  segmentId: string;
  segmentName: string;
  recency: number;
  frequency: number;
  monetary: number;
  totalValue: number;
  lastPurchase: string;
  ownerName: string;
}

export interface CustomerScatterPoint {
  customerId: string;
  customerName: string;
  x: number; // 频率
  y: number; // 金额
  size: number; // 最近消费 (倒数)
  segmentId: string;
  segmentName: string;
}

// ========== 客户流失预警 ==========
export type ChurnRiskLevel = 'high' | 'medium' | 'low';

export interface ChurnWarning {
  id: string;
  customerId: string;
  customerName: string;
  industry: string;
  ownerName: string;
  riskLevel: ChurnRiskLevel;
  riskScore: number; // 0-100
  riskFactors: RiskFactor[];
  aiSuggestions: string[]; // AI 挽回建议
  lastContactDays: number; // 距离上次联系天数
  contractExpiry?: string; // 合同到期日
  complaintCount: number; // 投诉次数
  isProcessed: boolean; // 是否已处理
  processedAt?: string;
  processedBy?: string;
}

export interface RiskFactor {
  type: 'no_followup' | 'contract_expiry' | 'complaint' | 'usage_drop' | 'payment_delay';
  label: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
}

// ========== 会议助手 ==========
export interface MeetingRecord {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: number; // 分钟
  participants: MeetingParticipant[];
  audioUrl?: string; // Mock 音频文件
  transcript: string; // 转写文本
  aiSummary: string; // AI 生成的会议纪要
  actionItems: ActionItem[];
  sentiment: 'positive' | 'neutral' | 'negative';
  keywords: string[];
}

export interface MeetingParticipant {
  id: string;
  name: string;
  role: 'host' | 'guest' | 'internal' | 'external';
  company?: string;
}

export interface ActionItem {
  id: string;
  content: string;
  assignee?: string;
  dueDate?: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed';
}
