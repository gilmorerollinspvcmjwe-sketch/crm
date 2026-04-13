/**
 * 路由常量定义
 * Route Constants Definition
 * 
 * 集中管理所有路由路径，便于维护和引用
 */

// ============================================
// 基础路由
// ============================================
export const ROOT = '/'
export const WORKBENCH = '/workbench'
export const DASHBOARD = '/dashboard'

// ============================================
// 客户管理
// ============================================
export const CUSTOMER = {
  LIST: '/customer/list',
  DETAIL: '/customer/:id',
  NEW: '/customer/new',
  EDIT: '/customer/:id/edit',
} as const

export const CONTACT = {
  LIST: '/contact/list',
  DETAIL: '/contact/:id',
  NEW: '/contact/new',
  EDIT: '/contact/:id/edit',
} as const

// ============================================
// 线索管理
// ============================================
export const LEAD = {
  LIST: '/lead/list',
  DETAIL: '/lead/:id',
  NEW: '/lead/new',
  EDIT: '/lead/:id/edit',
} as const

// ============================================
// 商机管理
// ============================================
export const OPPORTUNITY = {
  LIST: '/opportunity/list',
  DETAIL: '/opportunity/:id',
  NEW: '/opportunity/new',
  EDIT: '/opportunity/:id/edit',
} as const

// ============================================
// 跟进记录
// ============================================
export const ACTIVITY = {
  LIST: '/activity/list',
  NEW: '/activity/new',
  EDIT: '/activity/:id',
  DETAIL: '/activity/:id',
} as const

// ============================================
// 合同管理
// ============================================
export const CONTRACT = {
  LIST: '/contract/list',
  DETAIL: '/contract/:id',
  NEW: '/contract/new',
  EDIT: '/contract/:id/edit',
} as const

// ============================================
// 回款管理
// ============================================
export const PAYMENT = {
  LIST: '/payment/list',
  DETAIL: '/payment/:id',
  NEW: '/payment/new',
  EDIT: '/payment/:id/edit',
} as const

// ============================================
// 订单管理
// ============================================
export const ORDER = {
  LIST: '/order/list',
  DETAIL: '/order/:id',
  NEW: '/order/new',
  EDIT: '/order/:id/edit',
} as const

// ============================================
// CPQ 报价管理
// ============================================
export const QUOTE = {
  LIST: '/quote/list',
  DETAIL: '/quote/:id',
  NEW: '/quote/new',
  EDIT: '/quote/:id/edit',
  BUILDER: '/quote/:id/edit',
} as const

// ============================================
// 产品库管理
// ============================================
export const PRODUCT = {
  LIST: '/products/list',
  DETAIL: '/products/:id',
  NEW: '/products/new',
  EDIT: '/products/:id/edit',
} as const

// ============================================
// 价格表管理
// ============================================
export const PRICEBOOK = {
  LIST: '/pricebooks/list',
  DETAIL: '/pricebooks/:id',
  NEW: '/pricebooks/new',
  EDIT: '/pricebooks/:id/edit',
} as const

// ============================================
// 报表统计
// ============================================
export const REPORT = {
  FUNNEL: '/report/funnel',
  PERFORMANCE: '/report/performance',
  CUSTOMER: '/report/customer',
  ACTIVITY: '/report/activity',
  LEAD_CONVERSION: '/report/lead-conversion',
  PAYMENT: '/report/payment',
} as const

// ============================================
// AI 功能
// ============================================
export const AI = {
  CONFIG: '/ai/config',
  HISTORY: '/ai/history',
  PROMPTS: '/ai/prompts',
  ASSISTANT: '/ai/assistant',
  DASHBOARD: '/ai/dashboard',
  ANALYTICS: '/ai/analytics',
  MODELS: '/ai/models',
  USAGE: '/ai/usage',
  // Legacy routes (redirected)
  LEAD_ASSIGNMENT: '/ai/lead-assignment',
  LEAD_SCORING: '/ai/lead-scoring',
  SALES_FORECAST: '/ai/sales-forecast',
  CUSTOMER_SEGMENTATION: '/ai/customer-segmentation',
  CHURN_WARNING: '/ai/churn-warning',
  MEETING_ASSISTANT: '/ai/meeting-assistant',
  PREDICTIVE: '/ai/predictive',
  AGENTS: '/ai/agents',
  AGENT_DETAIL: '/ai/agents/:agentId',
} as const

// ============================================
// 营销自动化
// ============================================
export const MARKETING = {
  CAMPAIGNS: '/marketing/campaigns',
  CAMPAIGN_DETAIL: '/marketing/campaign/:id',
  EMAIL_TEMPLATES: '/marketing/email-templates',
  TARGET_LISTS: '/marketing/target-lists',
} as const

// ============================================
// 自动化模块
// ============================================
export const AUTOMATION = {
  WORKFLOWS: '/automation/workflows',
  WORKFLOW_NEW: '/automation/workflows/new',
  WORKFLOW_EDIT: '/automation/workflows/:workflowId/edit',
  LOGS: '/automation/logs',
} as const

// ============================================
// 工作流引擎
// ============================================
export const WORKFLOW_ENGINE = {
  LIST: '/workflows',
  BUILDER: '/workflows/builder',
  DETAIL: '/workflows/:id',
  EDIT: '/workflows/:id/edit',
  EXECUTIONS: '/workflows/executions',
} as const

// ============================================
// 自定义对象
// ============================================
export const CUSTOM_OBJECTS = {
  LIST: '/custom-objects',
  BUILDER: '/custom-objects/builder/:objectId',
  SETTINGS: '/custom-objects/settings/:objectId',
  DETAIL: '/custom-objects/:objectId',
  RECORD_NEW: '/custom-objects/:objectId/new',
  RECORD_DETAIL: '/custom-objects/:objectId/:id',
  RECORD_EDIT: '/custom-objects/:objectId/:id/edit',
} as const

// ============================================
// 系统集成
// ============================================
export const INTEGRATION = {
  TICKETS: '/integration/tickets',
  KNOWLEDGE: '/integration/knowledge',
  CALLCENTER: '/integration/callcenter',
} as const

// ============================================
// 系统设置
// ============================================
export const SETTINGS = {
  ROOT: '/settings',
  PROFILE: '/settings/profile',
  CHANGE_PASSWORD: '/settings/change-password',
  NOTIFICATIONS: '/settings/notifications',
  DISPLAY: '/settings/display',
  ROLES: '/settings/roles',
  USERS: '/settings/users',
  PERMISSIONS: '/settings/permissions',
  CUSTOM_FIELDS: '/settings/custom-fields',
  CUSTOM_OBJECTS: '/settings/custom-objects',
  CUSTOM_OBJECT_CREATE: '/settings/custom-objects/create',
  CUSTOM_OBJECT_CONFIG: '/settings/custom-objects/:objectId',
  CUSTOM_OBJECT_EDIT: '/settings/custom-objects/:objectId/edit',
  WORKFLOW_NEW: '/settings/workflow/new',
  WORKFLOW_EDIT: '/settings/workflow/:workflowId/edit',
  WORKFLOW_LOGS: '/settings/workflow/:workflowId/logs',
  AUDIT_LOG: '/settings/audit-log',
  LOGIN_LOG: '/settings/login-log',
  FIELDS: '/settings/fields',
  LAYOUT: '/settings/layout',
  THEME: '/settings/theme',
  FORM_DESIGNER: '/settings/form-designer',
  PAGE_BUILDER: '/settings/page-builder',
  VIEW_MANAGER: '/settings/view-manager',
  PIPELINE_MANAGER: '/settings/pipeline-manager',
  OBJECT_RELATIONSHIPS: '/settings/object-relationships',
  EMAIL: '/settings/email',
  INTEGRATIONS: '/settings/integrations',
  WORKFLOWS: '/settings/workflows',
  SECURITY: '/settings/security',
  PREFERENCES: '/settings/preferences',
} as const

// ============================================
// 测试页面
// ============================================
export const TEST = '/test'

// ============================================
// 错误页面
// ============================================
export const NOT_FOUND = '/404'

// ============================================
// 向后兼容重定向映射
// ============================================
export const LEGACY_REDIRECTS: Record<string, string> = {
  '/customer': CUSTOMER.LIST,
  '/lead': LEAD.LIST,
  '/opportunity': OPPORTUNITY.LIST,
  '/activity': ACTIVITY.LIST,
  '/contract': CONTRACT.LIST,
  '/payment': PAYMENT.LIST,
  '/quote': QUOTE.LIST,
  '/products': PRODUCT.LIST,
  '/pricebooks': PRICEBOOK.LIST,
  '/report': REPORT.FUNNEL,
  '/settings': SETTINGS.PROFILE,
  '/ai': AI.LEAD_ASSIGNMENT,
  '/marketing': MARKETING.CAMPAIGNS,
  '/integration': INTEGRATION.TICKETS,
  '/settings/custom-fields': SETTINGS.FIELDS,
}

// ============================================
// 路径参数类型
// ============================================
export type RouteParams = {
  id?: string
  objectId?: string
  workflowId?: string
  agentId?: string
}

// ============================================
// 路由生成函数类型
// ============================================
export type RouteGenerator<T extends RouteParams = RouteParams> = (params: T) => string
