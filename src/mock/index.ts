/**
 * 统一 Mock 数据导出
 */

export { customerData, getCustomerList, getCustomerById } from './customerData';
export { contactData, getContactList, getContactById, getContactsByCustomerId } from './contactData';
export { leadData, followUpRecords, getLeadList, getLeadById, getFollowUpRecords } from './leadData';
export { opportunityData, generateSalesFunnelStats, filterOpportunities } from './opportunityData';
export { activityData, filterActivities } from './activityData';
export { contractData, generateContractStats, filterContracts } from './contractData';
export { 
  funnelData, 
  performanceData, 
  taskData, 
  contractData as dashboardContractData,
  leadTrendData, 
  customerDistData,
  defaultDashlets,
  formatAmount as formatDashboardAmount
} from './dashboardData';
export { 
  getSalesFunnelReport, 
  performanceReport, 
  customerReport, 
  formatAmount as formatReportAmount
} from './reportData';
export { 
  systemSettings, 
  AVAILABLE_ICONS, 
  AVAILABLE_COLORS,
  WORK_DAY_OPTIONS,
  RETENTION_OPTIONS
} from './settingsData';
export {
  salesTeam,
  leadsToAssign,
  scoredLeads,
  salesForecast,
  customerSegments,
  segmentedCustomers,
  customerScatterData,
  churnWarnings,
  meetingRecords,
} from './aiData';
// CPQ 报价管理
export { products, quotes, getProductList, getQuoteList, getQuoteById, getQuoteStats } from './cpqData';
