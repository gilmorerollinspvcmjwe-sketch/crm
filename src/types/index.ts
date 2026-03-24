/**
 * 统一类型导出
 * CRM 系统所有类型定义的统一入口
 */

// 客户类型
export type {
  Customer,
  CustomerLevel,
  CustomerStatus,
  CustomerSource,
  Industry,
  CompanySize,
  CustomerQueryParams,
  CustomerListResponse,
} from './customer';

// 联系人类型
export type {
  Contact,
  Gender,
  JobLevel,
  DecisionRole,
  ContactQueryParams,
  ContactListResponse,
} from './contact';

// 线索类型
export type {
  Lead,
  LeadStatus,
  LeadSource,
  LeadLevel,
  BudgetRange,
  PurchaseTimeframe,
  FollowUpRecord,
  LeadQueryParams,
  LeadListResponse,
} from './lead';

// 商机类型
export type {
  Opportunity,
  OpportunityStage,
  OpportunitySource,
  OpportunityStatus,
  Competitor,
  SalesFunnelStats,
  OpportunityFilter,
} from './opportunity';

// 跟进记录类型
export type {
  Activity,
  ActivityType,
  ActivityMethod,
  ActivityResult,
  CustomerInterest,
  RelatedObjectType,
  Attachment,
  ActivityFilter,
  CalendarActivity,
} from './activity';

// 合同类型
export type {
  Contract,
  ContractStatus,
  ContractType,
  PaymentMethod,
  Currency,
  PaymentPlan,
  ContractTerms,
  ContractStats,
  ContractFilter,
} from './contract';

// 仪表盘类型
export type {
  DashletType,
  DashletConfig,
  FunnelData,
  PerformanceData,
  TaskItem,
  ContractItem,
  LeadTrendData,
  CustomerDistData,
  DashboardLayout,
} from './dashboard';

// 报表类型
export type {
  TimeRange,
  SalesFunnelReport,
  PersonalPerformance,
  TeamPerformance,
  MonthlyTrend,
  PerformanceReport,
  CustomerGrowth,
  CustomerLevelDist,
  CustomerReport,
} from './report';

// 设置类型
export type {
  BasicSettings,
  SalesStage,
  FollowUpType,
  SystemSettings,
} from './settings';

// 回款类型（Phase 2 新增）
export type {
  PaymentRecord,
  AccountReceivable,
  PaymentStats,
  PaymentTrend,
  PaymentStatus,
  InvoiceStatus,
  Invoice,
  PaymentFilter,
  PaymentRecordFilter,
} from './payment';

// AI 功能类型（Phase 4 新增）
export type {
  SalesPerson,
  LeadAssignmentRecommendation,
  LeadToAssign,
  LeadScoreDetail,
  ScoredLead,
  SalesForecastData,
  ForecastItem,
  ProductForecast,
  RegionForecast,
  SalesForecast,
  CustomerSegment,
  SegmentedCustomer,
  CustomerScatterPoint,
  ChurnWarning,
  RiskFactor,
  ChurnRiskLevel,
  MeetingRecord,
  MeetingParticipant,
  ActionItem,
} from './ai';
