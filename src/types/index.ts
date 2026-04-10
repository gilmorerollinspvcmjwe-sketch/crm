/**
 * Types barrel export
 *
 * Usage:
 * import { Customer, Contract, Permission, Role } from '@/types'
 */

// Core types (api.ts)
export * from "./api"
export * from "./auditLog"
export * from "./loginLog"
export * from "./activity"

// Contract types from contract.ts
export {
  ContractStatus,
  ContractStatusLabels,
  ContractStatusColors,
  ContractType,
  ContractTypeLabels,
  ContractTypeColors,
  PaymentMethod,
  PaymentMethodLabels,
  PaymentMethodColors,
  Currency,
  CurrencySymbols,
  CurrencyCodes,
  CurrencyLabels,
  ApprovalAction,
  ApprovalStatus,
  AttachmentType,
  AttachmentTypeLabels,
} from "./contract"

export type {
  Approver,
  ContractApproval,
  ApprovalWorkflow,
  ApprovalLevel,
  SubmitApprovalRequest,
  ApprovalActionRequest,
  ContractAttachment,
  UploadAttachmentRequest,
  Contract,
  CreateContractRequest,
  UpdateContractRequest,
  ContractQueryParams,
  ContractListResponse,
  // Extended types
  ContractExtended,
  ContractTypeExtended,
  CreateContractRequestExtended,
  UpdateContractRequestExtended,
  ContractQueryParamsExtended,
} from "./contract"

// PaymentPlan types from contract.ts
export type {
  PaymentPlan,
  PaymentPlanStatus,
  PaymentPlanListParams,
  PaymentPlanCreateParams,
  PaymentPlanUpdateParams,
} from "./contract"

// Payment Record types (Reconciliation & Invoice)
export * from "./paymentRecord"

// Report types - explicit export to avoid conflicts
export type { ChartConfig as ReportChartConfig, TableConfig as ReportTableConfig } from "./report"

// Permission types - explicit export
export {
  PermissionType as PermissionActionType,
  PERMISSION_MODULES,
  PERMISSION_ACTIONS,
  DATA_SCOPE_OPTIONS,
} from "./permission"

export type {
  PermissionModuleId,
  PermissionConfig,
  PermissionMatrix,
  DataScope,
  FieldPermission,
  ModuleFieldPermission,
  PermissionSettings,
  RoleBasic,
  PermissionChange,
  SavePermissionRequest,
} from "./permission"

// Role types - explicit export (PermissionElementType is different from PermissionActionType)
export type {
  Permission as RolePermission,
  PermissionElementType as RolePermissionType,
  PermissionModuleId as RolePermissionModuleId,
  User,
  UserStatus,
  RoleMember,
  Role,
  CreateRoleRequest,
  UpdateRoleRequest,
} from "./role"
export { RoleStatus, PERMISSION_MODULES as ROLE_PERMISSION_MODULES, PermissionElementType } from "./role"

export * from "./customObject"

// Workflow types - explicit export to avoid conflicts
export type {
  TriggerType,
  TriggerConfig,
  ConditionOperator,
  WorkflowCondition,
  ConditionGroup,
  ConditionConfig,
  ActionType,
  WorkflowNode,
  WorkflowEdge,
  WorkflowStatus,
  WorkflowVersion,
  WorkflowExecutionLog,
  NodeExecutionLog,
  Workflow,
  WorkflowTemplate,
  WorkflowListParams,
  ExecutionLogListParams,
  // Action configs
  UpdateFieldConfig,
  SendNotificationConfig,
  SendEmailConfig,
  CreateRecordConfig,
  AssignOwnerConfig,
  AdvanceStageConfig,
  CreateTaskConfig,
  CallWebhookConfig,
  DelayConfig,
  AIGenerateConfig,
  ActionConfig,
  NodeType,
  NodePosition,
} from "./workflow"

export * from "./workflow-engine"

// Dashlet types - explicit export
export type {
  DashletType,
  ChartType,
  GridPosition,
  DashletConfig,
  Dashboard,
  KPIData,
  ChartDataPoint,
  ChartConfig as DashletChartConfig,
  TableColumn,
  TableConfig as DashletTableConfig,
  ListItem,
  ListConfig,
  CalendarEvent,
  CalendarConfig,
  NewsItem,
  NewsConfig,
} from "./dashlet"

export * from "./dashboard"

// CPQ types - use explicit re-exports to avoid name conflicts with api.ts
// Note: api.ts Product/ProductCategory are general catalog types
//       cpq.ts Product/ProductCategory are CPQ-specific with pricing context
export {
  // Enums
  QuoteStatus,
  QuoteStatusLabels,
  ProductCategory as CPQProductCategory,
  ProductCategoryLabels,
  DiscountType,
} from "./cpq"

export type {
  // CPQ-specific types
  Product as CPQProduct,
  ProductSelection,
  QuoteItem,
  PricingResult,
  QuoteTemplate,
  Quote,
  QuoteFilter,
  QuoteStats,
  QuoteRequest,
  QuoteVersion,
} from "./cpq"

// Opportunity types (enhanced with Quote and Decision Process)
export type {
  Opportunity,
  OpportunityListParams,
  OpportunityStage,
  OpportunityPriority,
  // Decision Process types
  DecisionProcess,
  DecisionStep,
  DecisionStepStatus,
  DecisionProcessStats,
  DecisionStepTemplate,
  DecisionProcessTemplate,
  CreateDecisionStepRequest,
  UpdateDecisionStepRequest,
  CreateDecisionProcessRequest,
} from "./opportunity"

// Customer extended types (public pool & enhanced fields)
export type {
  CustomerExtended,
  CustomerRegion,
  CustomerIndustryDetail,
  CompanySize,
  AnnualRevenue,
  PublicPoolCustomer,
  PublicPoolStatus,
  PublicPoolQueryParams,
  ClaimCustomerRequest,
  ReturnToPoolRequest,
  PublicPoolConfig,
} from "./customer"

// Customer config constants
export {
  CUSTOMER_TYPE_CONFIG,
  REGION_CONFIG,
  INDUSTRY_DETAIL_CONFIG,
  COMPANY_SIZE_CONFIG,
  ANNUAL_REVENUE_CONFIG,
  PUBLIC_POOL_STATUS_CONFIG,
  DEFAULT_PUBLIC_POOL_CONFIG,
} from "./customer"

// Lead types (enhanced with duplicate check and conversion)
export type {
  LeadStatus,
  LeadSource,
  LeadLevel,
  ApiLeadLevel as LeadLevelBasic,
  DuplicateCheckMethod,
  DuplicateHandlingAction,
  ConversionTargetType,
  Lead,
  LeadBasic,
  // Intention product
  IntentionProduct,
  // Duplicate check
  DuplicateCheckItem,
  DuplicateCheckResult,
  LeadDuplicateCheckParams,
  LeadDuplicateCheckResponse,
  // Conversion
  ConversionResult,
  FieldMapping,
  ConversionConfig,
  LeadConversionRequest,
  LeadConversionResponse,
  // Query params
  LeadListParams,
  LeadListResponse,
  LeadResponse,
} from "./lead"

// Order types (enhanced with order items and status transitions)
export type {
  Order,
  CreateOrderRequest,
  UpdateOrderRequest,
  OrderStatusTransitionRequest,
  OrderListParams,
  OrderListResponse,
  OrderDetailResponse,
  OrderStats,
  OrderStatusHistory,
} from "./order"

// Order item types
export type {
  OrderItem,
  OrderItemEditable,
  AddOrderItemRequest,
  UpdateOrderItemRequest,
  OrderItemStats,
  OrderStatusTransition,
} from "./orderItem"

// Order item constants and utilities
export {
  ORDER_STATUS_TRANSITIONS,
  OrderStatusLabels,
  OrderStatusColors,
  calculateItemAmount,
  calculateOrderItemStats,
} from "./orderItem"

// Re-export OrderStatus from api.ts
export type { OrderStatus } from "./api"
