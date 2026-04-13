/**
 * 统一路由配置
 * Unified Route Configuration
 * 
 * 使用 React Router v6 的 createBrowserRouter
 * 支持：
 * - 路由懒加载（React.lazy + Suspense）
 * - 嵌套路由（Layout）
 * - 路由守卫（AuthGuard）
 * - 向后兼容重定向
 * - 404 页面处理
 */

import * as React from 'react'
import { Suspense } from 'react'
import { 
  createBrowserRouter, 
  Navigate, 
  useParams,
  type RouteObject 
} from 'react-router-dom'
import { MainLayout } from '@/components/Layout/MainLayout'
import { SettingsLayout } from '@/components/Layout/SettingsLayout'
import { AuthGuard } from '@/components/guards/AuthGuard'
import { NotFound } from '@/pages/NotFound'
import { Spinner } from '@/components/ui/spinner'

// ============================================
// 加载指示器组件
// ============================================
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <Spinner className="h-6 w-6" />
  </div>
)

function LegacyCustomObjectRedirect({ target }: { target: 'detail' | 'builder' }) {
  const { objectId = '' } = useParams()
  const to = target === 'builder' ? `/custom-objects/${objectId}/builder` : `/custom-objects/${objectId}`
  return <Navigate to={to} replace />
}

// ============================================
// 懒加载页面组件
// ============================================

// 工作台
const Workbench = React.lazy(() => import('@/pages/Workbench'))
const Dashboard = React.lazy(() => import('@/pages/Dashboard/DashboardPage'))

// 客户管理
const CustomerList = React.lazy(() => import('@/pages/CustomerList'))
const CustomerDetail = React.lazy(() => import('@/pages/CustomerDetail'))
const HighSeasPool = React.lazy(() => import('@/pages/customers/HighSeasPool'))
const ContactList = React.lazy(() => import('@/pages/ContactList'))
const ContactDetail = React.lazy(() => import('@/pages/ContactDetail'))
const ContactPersonList = React.lazy(() => import('@/pages/contacts/ContactPersonList'))
const ContactPersonDetail = React.lazy(() => import('@/pages/contacts/ContactPersonDetail'))

// 销售管理
const LeadList = React.lazy(() => import('@/pages/LeadList'))
const LeadDetail = React.lazy(() => import('@/pages/LeadDetail'))
const OpportunityList = React.lazy(() => import('@/pages/OpportunityList'))
const OpportunityDetail = React.lazy(() => import('@/pages/OpportunityDetail'))
const OpportunityKanban = React.lazy(() => import('@/pages/OpportunityKanban'))
const ActivityList = React.lazy(() => import('@/pages/ActivityList'))
const ActivityForm = React.lazy(() => import('@/pages/ActivityForm'))
const ActivityDetail = React.lazy(() => import('@/pages/ActivityDetail'))

// 订单管理
const ContractList = React.lazy(() => import('@/pages/ContractList'))
const ContractDetail = React.lazy(() => import('@/pages/ContractDetail'))
const PaymentList = React.lazy(() => import('@/pages/PaymentList'))
const PaymentDetail = React.lazy(() => import('@/pages/PaymentDetail'))
const PaymentRecordList = React.lazy(() => import('@/pages/payments/PaymentRecordList'))
const PaymentRecordDetail = React.lazy(() => import('@/pages/payments/PaymentRecordDetail'))
const OrderList = React.lazy(() => import('@/pages/OrderList'))
const OrderDetail = React.lazy(() => import('@/pages/OrderDetail'))

// 产品与定价
const ProductList = React.lazy(() => import('@/pages/products/ProductList'))
const ProductDetail = React.lazy(() => import('@/pages/products/ProductDetail'))
const ProductFormPage = React.lazy(() => import('@/pages/products/ProductForm'))
const PricebookList = React.lazy(() => import('@/pages/pricebooks/PricebookList'))
const PricebookDetail = React.lazy(() => import('@/pages/pricebooks/PricebookDetail'))
const PricebookFormPage = React.lazy(() => import('@/pages/pricebooks/PricebookForm'))

// 报表
const ReportList = React.lazy(() => import('@/pages/reports/ReportList'))
const ReportDetail = React.lazy(() => import('@/pages/reports/ReportDetail'))
const ReportDashboard = React.lazy(() => import('@/pages/reports/ReportDashboard'))
const ReportBuilder = React.lazy(() => import('@/pages/reports/ReportBuilder'))
const ReportSchedule = React.lazy(() => import('@/pages/reports/ReportSchedule'))
const ReportExport = React.lazy(() => import('@/pages/reports/ReportExport'))

// AI 功能
const AIConfig = React.lazy(() => import('@/pages/ai/AIConfig'))
const AIHistory = React.lazy(() => import('@/pages/ai/AIHistory'))
const AIPromptTemplates = React.lazy(() => import('@/pages/ai/AIPromptTemplates'))
const AIAssistant = React.lazy(() => import('@/pages/ai/AIAssistant'))
const AIDashboard = React.lazy(() => import('@/pages/ai/AIDashboard'))
const AIAnalytics = React.lazy(() => import('@/pages/ai/AIAnalytics'))
const AIModels = React.lazy(() => import('@/pages/ai/AIModels'))
const AIUsage = React.lazy(() => import('@/pages/ai/AIUsage'))
// AI 功能扩展
const LeadAssignment = React.lazy(() => import('@/pages/ai/LeadAssignment'))
const LeadScoring = React.lazy(() => import('@/pages/ai/LeadScoring'))
const SalesForecast = React.lazy(() => import('@/pages/ai/SalesForecast'))
const CustomerSegmentation = React.lazy(() => import('@/pages/ai/CustomerSegmentation'))
const ChurnWarning = React.lazy(() => import('@/pages/ai/ChurnWarning'))
const MeetingAssistant = React.lazy(() => import('@/pages/ai/MeetingAssistant'))
const PredictiveAI = React.lazy(() => import('@/pages/ai/PredictiveAI'))
const AIAgents = React.lazy(() => import('@/pages/ai/AIAgents'))
const AgentDetail = React.lazy(() => import('@/pages/ai/AgentDetail'))

// 营销自动化
const CampaignList = React.lazy(() => import('@/pages/marketing/CampaignList'))
const CampaignDetail = React.lazy(() => import('@/pages/marketing/CampaignDetailWrapper'))
const EmailList = React.lazy(() => import('@/pages/marketing/EmailList'))
const EmailDetail = React.lazy(() => import('@/pages/marketing/EmailDetailWrapper'))
const TargetLists = React.lazy(() => import('@/pages/marketing/TargetLists'))

// 自动化
const WorkflowList = React.lazy(() => import('@/pages/automation/WorkflowList'))
const WorkflowLogs = React.lazy(() => import('@/pages/automation/WorkflowLogs'))

// 工作流引擎 (新)
const WorkflowEngineList = React.lazy(() => import('@/pages/workflows/WorkflowList'))
const WorkflowEngineBuilder = React.lazy(() => import('@/pages/workflows/WorkflowBuilder'))
const WorkflowEngineDetail = React.lazy(() => import('@/pages/workflows/WorkflowDetail'))
const WorkflowEngineExecutions = React.lazy(() => import('@/pages/workflows/WorkflowExecutions'))

// 集成
const TicketList = React.lazy(() => import('@/pages/integration/TicketList'))
const KnowledgeSearch = React.lazy(() => import('@/pages/integration/KnowledgeSearch'))
const OutboundTasks = React.lazy(() => import('@/pages/integration/OutboundTasks'))

// 报价
const QuoteList = React.lazy(() => import('@/pages/QuoteList'))
const QuoteDetail = React.lazy(() => import('@/pages/QuoteDetail'))
const QuoteForm = React.lazy(() => import('@/pages/QuoteForm'))

// 报表扩展
const SalesFunnelReport = React.lazy(() => import('@/pages/reports/SalesFunnelReport'))
const PerformanceReport = React.lazy(() => import('@/pages/reports/PerformanceReport'))
const CustomerReport = React.lazy(() => import('@/pages/reports/CustomerReport'))
const ActivityReport = React.lazy(() => import('@/pages/reports/ActivityReport'))
const LeadConversionReport = React.lazy(() => import('@/pages/reports/LeadConversionReport'))
const PaymentReport = React.lazy(() => import('@/pages/reports/PaymentReport'))

// 系统设置
const ProfileSettings = React.lazy(() => import('@/pages/settings/ProfileSettings'))
const LoginLogSettings = React.lazy(() => import('@/pages/settings/LoginLogSettings'))
const AuditLogSettings = React.lazy(() => import('@/pages/settings/AuditLogSettings'))
const SecuritySettings = React.lazy(() => import('@/pages/settings/SecuritySettings'))
const PreferencesSettings = React.lazy(() => import('@/pages/settings/PreferencesSettings'))
const NotificationSettings = React.lazy(() => import('@/pages/settings/NotificationSettings'))
const EmailSettings = React.lazy(() => import('@/pages/settings/EmailSettings'))
const IntegrationSettings = React.lazy(() => import('@/pages/settings/IntegrationSettings'))
const WorkflowSettings = React.lazy(() => import('@/pages/settings/WorkflowSettings'))
const FieldSettings = React.lazy(() => import('@/pages/settings/FieldSettings'))
const LayoutSettings = React.lazy(() => import('@/pages/settings/LayoutSettings'))
const ThemeSettings = React.lazy(() => import('@/pages/settings/ThemeSettings'))
// 新增设置页面
const DataBackupSettings = React.lazy(() => import('@/pages/settings/DataBackupSettings'))
const ImportExportSettings = React.lazy(() => import('@/pages/settings/ImportExportSettings'))
const APISettings = React.lazy(() => import('@/pages/settings/APISettings'))
const WebhookSettings = React.lazy(() => import('@/pages/settings/WebhookSettings'))
const LicenseSettings = React.lazy(() => import('@/pages/settings/LicenseSettings'))
const SystemInfo = React.lazy(() => import('@/pages/settings/SystemInfo'))
const CustomizationSettings = React.lazy(() => import('@/pages/settings/CustomizationSettings'))
const MobileSettings = React.lazy(() => import('@/pages/settings/MobileSettings'))
const AdvancedSettings = React.lazy(() => import('@/pages/settings/AdvancedSettings'))
const FormDesigner = React.lazy(() => import('@/pages/settings/FormDesigner'))
const PageBuilder = React.lazy(() => import('@/pages/settings/PageBuilder'))
const ViewManager = React.lazy(() => import('@/pages/settings/ViewManager'))
const PipelineManager = React.lazy(() => import('@/pages/settings/PipelineManager'))
const ObjectRelationships = React.lazy(() => import('@/pages/settings/ObjectRelationships'))

// 系统管理
const RoleManagement = React.lazy(() => import('@/pages/admin/RoleManagement'))
const UserManagement = React.lazy(() => import('@/pages/admin/UserManagement'))
const PermissionManagementPage = React.lazy(() => import('@/pages/settings/PermissionManagement'))

// 自定义对象
const CustomObjectList = React.lazy(() => import('@/pages/custom-objects/CustomObjectList'))
const CustomObjectDetail = React.lazy(() => import('@/pages/custom-objects/CustomObjectDetail'))
const CustomObjectBuilder = React.lazy(() => import('@/pages/custom-objects/CustomObjectBuilder'))
const CustomObjectSettings = React.lazy(() => import('@/pages/custom-objects/CustomObjectSettings'))
// 注意：CustomObjectRecordForm 是 Modal 组件，不作为独立路由

// ============================================
// 懒加载包装器
// ============================================
function LazyPage({ component: Component }: { component: React.LazyExoticComponent<React.ComponentType> }) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Component />
    </Suspense>
  )
}

// ============================================
// 路由配置
// ============================================

const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <AuthGuard>
        <MainLayout />
      </AuthGuard>
    ),
    children: [
      // 默认重定向
      {
        index: true,
        element: <Navigate to="/workbench" replace />,
      },
      
      // ----------------------------------------
      // 工作台
      // ----------------------------------------
      {
        path: 'workbench',
        element: <LazyPage component={Workbench} />,
      },
      {
        path: 'dashboard',
        element: <LazyPage component={Dashboard} />,
      },
      
      // ----------------------------------------
      // 新路径路由（优先匹配）
      // ----------------------------------------
      // 客户管理
      { path: 'customers', element: <LazyPage component={CustomerList} /> },
      { path: 'customers/:id', element: <LazyPage component={CustomerDetail} /> },
      { path: 'customers/public-pool', element: <LazyPage component={HighSeasPool} /> },
      // 线索管理
      { path: 'leads', element: <LazyPage component={LeadList} /> },
      { path: 'leads/:id', element: <LazyPage component={LeadDetail} /> },
      // 商机管理
      { path: 'opportunities', element: <LazyPage component={OpportunityList} /> },
      { path: 'opportunities/kanban', element: <LazyPage component={OpportunityKanban} /> },
      { path: 'opportunities/:id', element: <LazyPage component={OpportunityDetail} /> },
      // 跟进记录
      { path: 'activities', element: <LazyPage component={ActivityList} /> },
      { path: 'activities/:id', element: <LazyPage component={ActivityDetail} /> },
      { path: 'activities/new', element: <LazyPage component={ActivityForm} /> },
      // 订单管理
      { path: 'orders', element: <LazyPage component={OrderList} /> },
      { path: 'orders/:id', element: <LazyPage component={OrderDetail} /> },
      // 合同管理
      { path: 'contracts', element: <LazyPage component={ContractList} /> },
      { path: 'contracts/:id', element: <LazyPage component={ContractDetail} /> },
      // 回款管理
      { path: 'payments', element: <LazyPage component={PaymentList} /> },
      { path: 'payments/:id', element: <LazyPage component={PaymentDetail} /> },
      // 回款记录管理
      { path: 'payment-records', element: <LazyPage component={PaymentRecordList} /> },
      { path: 'payment-records/:id', element: <LazyPage component={PaymentRecordDetail} /> },
      // 产品与定价
      { path: 'products', element: <LazyPage component={ProductList} /> },
      { path: 'products/:id', element: <LazyPage component={ProductDetail} /> },
      { path: 'products/new', element: <LazyPage component={ProductFormPage} /> },
      { path: 'products/:id/edit', element: <LazyPage component={ProductFormPage} /> },
      { path: 'pricebooks', element: <LazyPage component={PricebookList} /> },
      { path: 'pricebooks/:id', element: <LazyPage component={PricebookDetail} /> },
      { path: 'pricebooks/new', element: <LazyPage component={PricebookFormPage} /> },
      { path: 'pricebooks/:id/edit', element: <LazyPage component={PricebookFormPage} /> },
      // 报表中心
      { path: 'reports', element: <LazyPage component={ReportList} /> },
      { path: 'reports/dashboard', element: <LazyPage component={ReportDashboard} /> },
      { path: 'reports/builder', element: <LazyPage component={ReportBuilder} /> },
      { path: 'reports/schedule', element: <LazyPage component={ReportSchedule} /> },
      { path: 'reports/export', element: <LazyPage component={ReportExport} /> },
      { path: 'reports/:id', element: <LazyPage component={ReportDetail} /> },
      
      // ----------------------------------------
      // 向后兼容重定向（旧路径 -> 新路径）
      // ----------------------------------------
      { path: 'customer', element: <Navigate to="/customers" replace /> },
      { path: 'customer/list', element: <Navigate to="/customers" replace /> },
      { path: 'customer/:id', element: <Navigate to="/customers/:id" replace /> },
      { path: 'lead', element: <Navigate to="/leads" replace /> },
      { path: 'lead/list', element: <Navigate to="/leads" replace /> },
      { path: 'lead/:id', element: <Navigate to="/leads/:id" replace /> },
      { path: 'opportunity', element: <Navigate to="/opportunities" replace /> },
      { path: 'opportunity/list', element: <Navigate to="/opportunities" replace /> },
      { path: 'opportunity/kanban', element: <Navigate to="/opportunities/kanban" replace /> },
      { path: 'opportunity/:id', element: <Navigate to="/opportunities/:id" replace /> },
      { path: 'activity', element: <Navigate to="/activities" replace /> },
      { path: 'activity/list', element: <Navigate to="/activities" replace /> },
      { path: 'activity/new', element: <Navigate to="/activities/new" replace /> },
      { path: 'activity/:id', element: <Navigate to="/activities/:id" replace /> },
      { path: 'contract', element: <Navigate to="/contracts" replace /> },
      { path: 'contract/list', element: <Navigate to="/contracts" replace /> },
      { path: 'payment', element: <Navigate to="/payments" replace /> },
      { path: 'payment/list', element: <Navigate to="/payments" replace /> },
      { path: 'order', element: <Navigate to="/orders" replace /> },
      { path: 'order/list', element: <Navigate to="/orders" replace /> },
      { path: 'products', element: <Navigate to="/products" replace /> },
      { path: 'products/list', element: <Navigate to="/products" replace /> },
      { path: 'pricebooks', element: <Navigate to="/pricebooks" replace /> },
      { path: 'pricebooks/list', element: <Navigate to="/pricebooks" replace /> },
      { path: 'report', element: <Navigate to="/reports" replace /> },
      { path: 'report/list', element: <Navigate to="/reports" replace /> },
      { path: 'report/funnel', element: <Navigate to="/reports/funnel" replace /> },
      { path: 'report/performance', element: <Navigate to="/reports/performance" replace /> },
      { path: 'report/customer', element: <Navigate to="/reports/customer" replace /> },
      { path: 'report/activity', element: <Navigate to="/reports" replace /> },
      { path: 'report/lead-conversion', element: <Navigate to="/reports" replace /> },
      { path: 'report/payment', element: <Navigate to="/reports" replace /> },
      { path: 'ai', element: <Navigate to="/ai/config" replace /> },
      { path: 'marketing', element: <Navigate to="/marketing/campaigns" replace /> },
      
      // ----------------------------------------
      // 客户管理
      // ----------------------------------------
      // 新路径
      {
        path: 'customers',
        element: <LazyPage component={CustomerList} />,
      },
      {
        path: 'customers/:id',
        element: <LazyPage component={CustomerDetail} />,
      },
      // 旧路径（保持兼容）
      { path: 'customer', element: <Navigate to="/customers" replace /> },
      { path: 'customer/list', element: <Navigate to="/customers" replace /> },
      {
        path: 'customer/:id',
        element: <LazyPage component={CustomerDetail} />,
      },
      // 注意：编辑客户通过 CustomerList 中的 Modal 处理
      // 联系人管理（旧路径，保持兼容）
      {
        path: 'contact/list',
        element: <LazyPage component={ContactList} />,
      },
      {
        path: 'contact/:id',
        element: <LazyPage component={ContactDetail} />,
      },
      // 联系人管理（新路径）
      {
        path: 'contacts',
        element: <LazyPage component={ContactPersonList} />,
      },
      {
        path: 'contacts/:id',
        element: <LazyPage component={ContactPersonDetail} />,
      },
      
      // ----------------------------------------
      // 销售管理
      // ----------------------------------------
      {
        path: 'lead/list',
        element: <LazyPage component={LeadList} />,
      },
      {
        path: 'lead/:id',
        element: <LazyPage component={LeadDetail} />,
      },
      // 商机管理 - 新路径
      {
        path: 'opportunities',
        element: <LazyPage component={OpportunityList} />,
      },
      {
        path: 'opportunities/kanban',
        element: <LazyPage component={OpportunityKanban} />,
      },
      {
        path: 'opportunities/:id',
        element: <LazyPage component={OpportunityDetail} />,
      },
      // 商机管理 - 旧路径（保持兼容）
      {
        path: 'opportunity/list',
        element: <LazyPage component={OpportunityList} />,
      },
      {
        path: 'opportunity/kanban',
        element: <LazyPage component={OpportunityKanban} />,
      },
      {
        path: 'opportunity/:id',
        element: <LazyPage component={OpportunityDetail} />,
      },
      {
        path: 'activity/list',
        element: <LazyPage component={ActivityList} />,
      },
      {
        path: 'activity/new',
        element: <LazyPage component={ActivityForm} />,
      },
      {
        path: 'activity/:id',
        element: <LazyPage component={ActivityDetail} />,
      },
      
      // ----------------------------------------
      // 订单管理
      // ----------------------------------------
      {
        path: 'contract/list',
        element: <LazyPage component={ContractList} />,
      },
      {
        path: 'contract/:id',
        element: <LazyPage component={ContractDetail} />,
      },
      {
        path: 'payment/list',
        element: <LazyPage component={PaymentList} />,
      },
      {
        path: 'payment/:id',
        element: <LazyPage component={PaymentDetail} />,
      },
      {
        path: 'order/list',
        element: <LazyPage component={OrderList} />,
      },
      {
        path: 'order/:id',
        element: <LazyPage component={OrderDetail} />,
      },
      
      // ----------------------------------------
      // 产品与定价
      // ----------------------------------------
      {
        path: 'products/list',
        element: <LazyPage component={ProductList} />,
      },
      {
        path: 'products/:id',
        element: <LazyPage component={ProductDetail} />,
      },
      {
        path: 'pricebooks/list',
        element: <LazyPage component={PricebookList} />,
      },
      {
        path: 'pricebooks/:id',
        element: <LazyPage component={PricebookDetail} />,
      },
      
      // ----------------------------------------
      // 报表统计
      // ----------------------------------------
      // 新路径
      {
        path: 'reports',
        element: <LazyPage component={ReportList} />,
      },
      {
        path: 'reports/dashboard',
        element: <LazyPage component={ReportDashboard} />,
      },
      {
        path: 'reports/builder',
        element: <LazyPage component={ReportBuilder} />,
      },
      {
        path: 'reports/schedule',
        element: <LazyPage component={ReportSchedule} />,
      },
      {
        path: 'reports/export',
        element: <LazyPage component={ReportExport} />,
      },
      {
        path: 'reports/:id',
        element: <LazyPage component={ReportDetail} />,
      },
      // 旧路径（保持兼容）
      {
        path: 'report/list',
        element: <LazyPage component={ReportList} />,
      },
      {
        path: 'report/dashboard',
        element: <LazyPage component={ReportDashboard} />,
      },
      {
        path: 'report/builder',
        element: <LazyPage component={ReportBuilder} />,
      },
      {
        path: 'report/schedule',
        element: <LazyPage component={ReportSchedule} />,
      },
      {
        path: 'report/export',
        element: <LazyPage component={ReportExport} />,
      },
      {
        path: 'report/:id',
        element: <LazyPage component={ReportDetail} />,
      },
      // 报表扩展
      {
        path: 'report/funnel',
        element: <LazyPage component={SalesFunnelReport} />,
      },
      {
        path: 'report/performance',
        element: <LazyPage component={PerformanceReport} />,
      },
      {
        path: 'report/customer',
        element: <LazyPage component={CustomerReport} />,
      },
      {
        path: 'report/activity',
        element: <LazyPage component={ActivityReport} />,
      },
      {
        path: 'report/lead-conversion',
        element: <LazyPage component={LeadConversionReport} />,
      },
      {
        path: 'report/payment',
        element: <LazyPage component={PaymentReport} />,
      },
      
      // ----------------------------------------
      // AI 功能
      // ----------------------------------------
      {
        path: 'ai/config',
        element: <LazyPage component={AIConfig} />,
      },
      {
        path: 'ai/history',
        element: <LazyPage component={AIHistory} />,
      },
      {
        path: 'ai/prompts',
        element: <LazyPage component={AIPromptTemplates} />,
      },
      {
        path: 'ai/assistant',
        element: <LazyPage component={AIAssistant} />,
      },
      {
        path: 'ai/dashboard',
        element: <LazyPage component={AIDashboard} />,
      },
      {
        path: 'ai/analytics',
        element: <LazyPage component={AIAnalytics} />,
      },
      {
        path: 'ai/models',
        element: <LazyPage component={AIModels} />,
      },
      {
        path: 'ai/usage',
        element: <LazyPage component={AIUsage} />,
      },
      // AI 功能扩展
      {
        path: 'ai/lead-assignment',
        element: <LazyPage component={LeadAssignment} />,
      },
      {
        path: 'ai/lead-scoring',
        element: <LazyPage component={LeadScoring} />,
      },
      {
        path: 'ai/sales-forecast',
        element: <LazyPage component={SalesForecast} />,
      },
      {
        path: 'ai/customer-segmentation',
        element: <LazyPage component={CustomerSegmentation} />,
      },
      {
        path: 'ai/churn-warning',
        element: <LazyPage component={ChurnWarning} />,
      },
      {
        path: 'ai/meeting-assistant',
        element: <LazyPage component={MeetingAssistant} />,
      },
      {
        path: 'ai/predictive',
        element: <LazyPage component={PredictiveAI} />,
      },
      {
        path: 'ai/agents',
        element: <LazyPage component={AIAgents} />,
      },
      {
        path: 'ai/agents/:id',
        element: <LazyPage component={AgentDetail} />,
      },
      
      // ----------------------------------------
      // 营销自动化
      // ----------------------------------------
      {
        path: 'marketing/campaigns',
        element: <LazyPage component={CampaignList} />,
      },
      {
        path: 'marketing/campaign/:id',
        element: <LazyPage component={CampaignDetail} />,
      },
      {
        path: 'marketing/email-templates',
        element: <LazyPage component={EmailList} />,
      },
      {
        path: 'marketing/email/:id',
        element: <LazyPage component={EmailDetail} />,
      },
      {
        path: 'marketing/target-lists',
        element: <LazyPage component={TargetLists} />,
      },
      
      // ----------------------------------------
      // 自动化
      // ----------------------------------------
      {
        path: 'automation/workflows',
        element: <LazyPage component={WorkflowList} />,
      },
      {
        path: 'automation/logs',
        element: <LazyPage component={WorkflowLogs} />,
      },
      
      // ----------------------------------------
      // 工作流引擎
      // ----------------------------------------
      {
        path: 'workflows',
        element: <LazyPage component={WorkflowEngineList} />,
      },
      {
        path: 'workflows/builder',
        element: <LazyPage component={WorkflowEngineBuilder} />,
      },
      {
        path: 'workflows/executions',
        element: <LazyPage component={WorkflowEngineExecutions} />,
      },
      {
        path: 'workflows/:id',
        element: <LazyPage component={WorkflowEngineDetail} />,
      },
      {
        path: 'workflows/:id/edit',
        element: <LazyPage component={WorkflowEngineBuilder} />,
      },
      
      // ----------------------------------------
      // 系统集成
      // ----------------------------------------
      {
        path: 'integration/tickets',
        element: <LazyPage component={TicketList} />,
      },
      {
        path: 'integration/knowledge',
        element: <LazyPage component={KnowledgeSearch} />,
      },
      {
        path: 'integration/callcenter',
        element: <LazyPage component={OutboundTasks} />,
      },

      // ----------------------------------------
      // 自定义对象
      // ----------------------------------------
      {
        path: 'custom-objects',
        element: <LazyPage component={CustomObjectList} />,
      },
      {
        path: 'custom-objects/builder/:objectId',
        element: <LazyPage component={CustomObjectBuilder} />,
      },
      {
        path: 'custom-objects/:objectId/builder',
        element: <LazyPage component={CustomObjectBuilder} />,
      },
      {
        path: 'custom-objects/settings/:objectId',
        element: <LazyPage component={CustomObjectSettings} />,
      },
      {
        path: 'custom-objects/:objectId/settings',
        element: <LazyPage component={CustomObjectSettings} />,
      },
      {
        path: 'custom-objects/:objectId',
        element: <LazyPage component={CustomObjectDetail} />,
      },
      // 注意：新建和编辑记录通过 CustomObjectDetail 中的 Modal 处理，不需要独立路由
      
      // ----------------------------------------
      // 报价管理
      // ----------------------------------------
      // 新路径
      {
        path: 'quotes',
        element: <LazyPage component={QuoteList} />,
      },
      // 旧路径（保持兼容）
      {
        path: 'quote/list',
        element: <LazyPage component={QuoteList} />,
      },
      {
        path: 'quote/new',
        element: <LazyPage component={QuoteForm} />,
      },
      {
        path: 'quote/:id',
        element: <LazyPage component={QuoteDetail} />,
      },
      {
        path: 'quote/:id/edit',
        element: <LazyPage component={QuoteForm} />,
      },
      {
        path: 'quote/:id/clone',
        element: <LazyPage component={QuoteForm} />,
      },
      
      // ----------------------------------------
      // 系统设置
      // ----------------------------------------
      {
        path: 'settings',
        element: <SettingsLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/settings/profile" replace />,
          },
          // 个人设置
          {
            path: 'profile',
            element: <LazyPage component={ProfileSettings} />,
          },
          {
            path: 'security',
            element: <LazyPage component={SecuritySettings} />,
          },
          {
            path: 'preferences',
            element: <LazyPage component={PreferencesSettings} />,
          },
          {
            path: 'notifications',
            element: <LazyPage component={NotificationSettings} />,
          },
          // 系统配置
          {
            path: 'email',
            element: <LazyPage component={EmailSettings} />,
          },
          {
            path: 'integrations',
            element: <LazyPage component={IntegrationSettings} />,
          },
          {
            path: 'workflows',
            element: <LazyPage component={WorkflowSettings} />,
          },
          {
            path: 'fields',
            element: <LazyPage component={FieldSettings} />,
          },
          {
            path: 'layout',
            element: <LazyPage component={LayoutSettings} />,
          },
          {
            path: 'theme',
            element: <LazyPage component={ThemeSettings} />,
          },
          {
            path: 'form-designer',
            element: <LazyPage component={FormDesigner} />,
          },
          {
            path: 'page-builder',
            element: <LazyPage component={PageBuilder} />,
          },
          {
            path: 'view-manager',
            element: <LazyPage component={ViewManager} />,
          },
          {
            path: 'pipeline-manager',
            element: <LazyPage component={PipelineManager} />,
          },
          {
            path: 'object-relationships',
            element: <LazyPage component={ObjectRelationships} />,
          },
          // 数据管理
          {
            path: 'data-backup',
            element: <LazyPage component={DataBackupSettings} />,
          },
          {
            path: 'import-export',
            element: <LazyPage component={ImportExportSettings} />,
          },
          // API & 集成
          {
            path: 'api',
            element: <LazyPage component={APISettings} />,
          },
          {
            path: 'webhook',
            element: <LazyPage component={WebhookSettings} />,
          },
          // 安全与审计
          {
            path: 'audit-log',
            element: <LazyPage component={AuditLogSettings} />,
          },
          {
            path: 'login-log',
            element: <LazyPage component={LoginLogSettings} />,
          },
          {
            path: 'license',
            element: <LazyPage component={LicenseSettings} />,
          },
          // 系统管理
          {
            path: 'roles',
            element: <LazyPage component={RoleManagement} />,
          },
          {
            path: 'users',
            element: <LazyPage component={UserManagement} />,
          },
          {
            path: 'permissions',
            element: <LazyPage component={PermissionManagementPage} />,
          },
          // 高级设置
          {
            path: 'system-info',
            element: <LazyPage component={SystemInfo} />,
          },
          {
            path: 'customization',
            element: <LazyPage component={CustomizationSettings} />,
          },
          {
            path: 'mobile',
            element: <LazyPage component={MobileSettings} />,
          },
          {
            path: 'advanced',
            element: <LazyPage component={AdvancedSettings} />,
          },
          {
            path: 'custom-objects',
            element: <Navigate to="/custom-objects" replace />,
          },
          {
            path: 'custom-fields',
            element: <Navigate to="/settings/fields" replace />,
          },
          {
            path: 'custom-objects/:objectId',
            element: <LegacyCustomObjectRedirect target="detail" />,
          },
          {
            path: 'custom-objects/:objectId/edit',
            element: <LegacyCustomObjectRedirect target="builder" />,
          },
          // 向后兼容重定向
          { path: 'change-password', element: <Navigate to="/settings/security" replace /> },
          { path: 'display', element: <Navigate to="/settings/preferences" replace /> },
          { path: 'workflow/new', element: <Navigate to="/workflows/builder" replace /> },
          { path: 'workflow/:workflowId/edit', element: <Navigate to="/workflows/:workflowId/edit" replace /> },
          { path: 'workflow/:workflowId/logs', element: <Navigate to="/automation/logs" replace /> },
        ],
      },
      
      // ----------------------------------------
      // 404 页面
      // ----------------------------------------
      {
        path: '404',
        element: <NotFound />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]

// ============================================
// 创建路由实例
// ============================================
export const router = createBrowserRouter(routes)

// ============================================
// 导出路由配置（用于测试或自定义使用）
// ============================================
export { routes }

// ============================================
// 默认导出
// ============================================
export default router
