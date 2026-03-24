/**
 * 统一路由配置
 */
import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import MainLayout from '../components/Layout/MainLayout';
import SettingsLayout from '../components/Settings/SettingsLayout';

const LoadingFallback = () => <div style={{ padding: 24 }}>加载中...</div>;

// 带布局的路由包装器
const LayoutWrapper: React.FC = () => (
  <MainLayout>
    <Suspense fallback={<LoadingFallback />}>
      <Outlet />
    </Suspense>
  </MainLayout>
);

// 懒加载页面组件
const Workbench = React.lazy(() => import('../pages/workbench/Workbench'));
const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const CustomerList = React.lazy(() => import('../pages/CustomerList'));
const CustomerDetail = React.lazy(() => import('../pages/CustomerDetail'));
const ContactList = React.lazy(() => import('../pages/ContactList'));
const ContactDetail = React.lazy(() => import('../pages/ContactDetail'));
const LeadList = React.lazy(() => import('../pages/LeadList'));
const LeadDetail = React.lazy(() => import('../pages/LeadDetail'));
const OpportunityList = React.lazy(() => import('../pages/OpportunityList'));
const OpportunityDetail = React.lazy(() => import('../pages/OpportunityDetail'));
const ActivityList = React.lazy(() => import('../pages/ActivityList'));
const ActivityForm = React.lazy(() => import('../pages/ActivityForm'));
const ContractList = React.lazy(() => import('../pages/ContractList'));
const ContractDetail = React.lazy(() => import('../pages/ContractDetail'));
const PaymentList = React.lazy(() => import('../pages/PaymentList'));
const PaymentDetail = React.lazy(() => import('../pages/PaymentDetail'));
const SalesFunnelReport = React.lazy(() => import('../pages/SalesFunnelReport'));
const PerformanceReport = React.lazy(() => import('../pages/PerformanceReport'));
const CustomerReport = React.lazy(() => import('../pages/CustomerReport'));
const ActivityReport = React.lazy(() => import('../pages/ActivityReport'));
const LeadConversionReport = React.lazy(() => import('../pages/LeadConversionReport'));
const PaymentReport = React.lazy(() => import('../pages/PaymentReport'));
const Roles = React.lazy(() => import('../pages/Roles'));
const Users = React.lazy(() => import('../pages/Users'));
const PermissionSettings = React.lazy(() => import('../pages/PermissionSettings'));
const SystemConfig = React.lazy(() => import('../pages/settings/SystemConfig'));
const CustomFields = React.lazy(() => import('../pages/settings/CustomFields'));
const Profile = React.lazy(() => import('../pages/settings/Profile'));
const ChangePassword = React.lazy(() => import('../pages/settings/ChangePassword'));
const NotificationPreferences = React.lazy(() => import('../pages/settings/NotificationPreferences'));
const DisplayPreferences = React.lazy(() => import('../pages/settings/DisplayPreferences'));
const AuditLog = React.lazy(() => import('../pages/settings/AuditLog'));
const LoginLog = React.lazy(() => import('../pages/settings/LoginLog'));
const TestPage = React.lazy(() => import('../pages/TestPage'));
const LeadAssignment = React.lazy(() => import('../pages/LeadAssignment'));
const LeadScoring = React.lazy(() => import('../pages/LeadScoring'));
const SalesForecast = React.lazy(() => import('../pages/SalesForecast'));
const CustomerSegmentation = React.lazy(() => import('../pages/CustomerSegmentation'));
const ChurnWarning = React.lazy(() => import('../pages/ChurnWarning'));
const MeetingAssistant = React.lazy(() => import('../pages/MeetingAssistant'));
// 营销自动化模块
const CampaignsList = React.lazy(() => import('../pages/CampaignsList'));
const CampaignDetail = React.lazy(() => import('../pages/CampaignDetail'));
const EmailTemplates = React.lazy(() => import('../pages/EmailTemplates'));
const TargetLists = React.lazy(() => import('../pages/TargetLists'));
// Phase 5 AI 功能
const PredictiveAI = React.lazy(() => import('../pages/PredictiveAI'));
const AIAgents = React.lazy(() => import('../pages/AIAgents'));
const AgentDetail = React.lazy(() => import('../pages/AgentDetail'));
// CPQ 报价管理
const QuotesList = React.lazy(() => import('../pages/QuotesList'));
const QuoteDetail = React.lazy(() => import('../pages/QuoteDetail'));
const QuoteBuilder = React.lazy(() => import('../pages/quotes/QuoteBuilder'));
// Phase 7: 产品库和价格表
const ProductList = React.lazy(() => import('../pages/products/ProductList'));
const ProductDetail = React.lazy(() => import('../pages/products/ProductDetail'));
const ProductForm = React.lazy(() => import('../components/Product/ProductForm'));
const PricebookList = React.lazy(() => import('../pages/pricebooks/PricebookList'));
const PricebookDetail = React.lazy(() => import('../pages/pricebooks/PricebookDetail'));
const PricebookForm = React.lazy(() => import('../components/Pricebook/PricebookForm'));
// Phase 8: 权限系统
// 使用现有的 Roles 和 Users 页面
// Custom Objects
const CustomObjects = React.lazy(() => import('../pages/settings/CustomObjects'));
const CreateCustomObject = React.lazy(() => import('../pages/settings/CreateCustomObject'));
const ObjectFields = React.lazy(() => import('../pages/settings/ObjectFields'));
const FormDesigner = React.lazy(() => import('../pages/settings/FormDesigner'));
const ObjectData = React.lazy(() => import('../pages/settings/ObjectData'));
const ObjectRelationships = React.lazy(() => import('../pages/settings/ObjectRelationships'));
// 对接 Demo
const TicketList = React.lazy(() => import('../pages/tickets/TicketList'));
const KnowledgeSearch = React.lazy(() => import('../pages/knowledge/KnowledgeSearch'));
const OutboundTasks = React.lazy(() => import('../pages/callcenter/OutboundTasks'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <LayoutWrapper />,
    children: [
      {
        index: true,
        element: <Navigate to="/workbench" replace />,
      },
      {
        path: 'workbench',
        element: <Suspense fallback={<LoadingFallback />}><Workbench /></Suspense>,
      },
      {
        path: 'dashboard',
        element: <Suspense fallback={<LoadingFallback />}><Dashboard /></Suspense>,
      },
      // 向后兼容：旧路由重定向
      {
        path: 'customer',
        element: <Navigate to="/customer/list" replace />,
      },
      {
        path: 'lead',
        element: <Navigate to="/lead/list" replace />,
      },
      {
        path: 'opportunity',
        element: <Navigate to="/opportunity/list" replace />,
      },
      {
        path: 'activity',
        element: <Navigate to="/activity/list" replace />,
      },
      {
        path: 'contract',
        element: <Navigate to="/contract/list" replace />,
      },
      {
        path: 'payment',
        element: <Navigate to="/payment/list" replace />,
      },
      {
        path: 'quote',
        element: <Navigate to="/quote/list" replace />,
      },
      {
        path: 'products',
        element: <Navigate to="/products/list" replace />,
      },
      {
        path: 'pricebooks',
        element: <Navigate to="/pricebooks/list" replace />,
      },
      {
        path: 'report',
        element: <Navigate to="/report/funnel" replace />,
      },
      {
        path: 'settings',
        element: <Navigate to="/settings" replace />,
      },
      {
        path: 'ai',
        element: <Navigate to="/ai/lead-assignment" replace />,
      },
      {
        path: 'marketing',
        element: <Navigate to="/marketing/campaigns" replace />,
      },
      {
        path: 'integration',
        element: <Navigate to="/integration/tickets" replace />,
      },
      // 客户管理
      {
        path: 'customer/list',
        element: <Suspense fallback={<LoadingFallback />}><CustomerList /></Suspense>,
      },
      {
        path: 'customer/:id',
        element: <Suspense fallback={<LoadingFallback />}><CustomerDetail /></Suspense>,
      },
      {
        path: 'contact/list',
        element: <Suspense fallback={<LoadingFallback />}><ContactList /></Suspense>,
      },
      {
        path: 'contact/:id',
        element: <Suspense fallback={<LoadingFallback />}><ContactDetail /></Suspense>,
      },
      // 线索管理
      {
        path: 'lead/list',
        element: <Suspense fallback={<LoadingFallback />}><LeadList /></Suspense>,
      },
      {
        path: 'lead/:id',
        element: <Suspense fallback={<LoadingFallback />}><LeadDetail /></Suspense>,
      },
      // 商机管理
      {
        path: 'opportunity/list',
        element: <Suspense fallback={<LoadingFallback />}><OpportunityList /></Suspense>,
      },
      {
        path: 'opportunity/:id',
        element: <Suspense fallback={<LoadingFallback />}><OpportunityDetail /></Suspense>,
      },
      // 跟进记录
      {
        path: 'activity/list',
        element: <Suspense fallback={<LoadingFallback />}><ActivityList /></Suspense>,
      },
      {
        path: 'activity/new',
        element: <Suspense fallback={<LoadingFallback />}><ActivityForm /></Suspense>,
      },
      {
        path: 'activity/:id',
        element: <Suspense fallback={<LoadingFallback />}><ActivityForm /></Suspense>,
      },
      // 合同管理
      {
        path: 'contract/list',
        element: <Suspense fallback={<LoadingFallback />}><ContractList /></Suspense>,
      },
      {
        path: 'contract/:id',
        element: <Suspense fallback={<LoadingFallback />}><ContractDetail /></Suspense>,
      },
      // 回款管理
      {
        path: 'payment/list',
        element: <Suspense fallback={<LoadingFallback />}><PaymentList /></Suspense>,
      },
      {
        path: 'payment/:id',
        element: <Suspense fallback={<LoadingFallback />}><PaymentDetail /></Suspense>,
      },
      // CPQ 报价管理
      {
        path: 'quote/list',
        element: <Suspense fallback={<LoadingFallback />}><QuotesList /></Suspense>,
      },
      {
        path: 'quote/new',
        element: <Suspense fallback={<LoadingFallback />}><QuoteBuilder /></Suspense>,
      },
      {
        path: 'quote/:id',
        element: <Suspense fallback={<LoadingFallback />}><QuoteDetail /></Suspense>,
      },
      {
        path: 'quote/:id/edit',
        element: <Suspense fallback={<LoadingFallback />}><QuoteBuilder /></Suspense>,
      },
      // Phase 7: 产品库管理
      {
        path: 'products/list',
        element: <Suspense fallback={<LoadingFallback />}><ProductList /></Suspense>,
      },
      {
        path: 'products/new',
        element: <Suspense fallback={<LoadingFallback />}><ProductForm standalone isEdit={false} /></Suspense>,
      },
      {
        path: 'products/:id',
        element: <Suspense fallback={<LoadingFallback />}><ProductDetail /></Suspense>,
      },
      {
        path: 'products/:id/edit',
        element: <Suspense fallback={<LoadingFallback />}><ProductForm standalone isEdit /></Suspense>,
      },
      // Phase 7: 价格表管理
      {
        path: 'pricebooks/list',
        element: <Suspense fallback={<LoadingFallback />}><PricebookList /></Suspense>,
      },
      {
        path: 'pricebooks/new',
        element: <Suspense fallback={<LoadingFallback />}><PricebookForm standalone isEdit={false} /></Suspense>,
      },
      {
        path: 'pricebooks/:id',
        element: <Suspense fallback={<LoadingFallback />}><PricebookDetail /></Suspense>,
      },
      {
        path: 'pricebooks/:id/edit',
        element: <Suspense fallback={<LoadingFallback />}><PricebookForm standalone isEdit /></Suspense>,
      },
      // 报表统计
      {
        path: 'report/funnel',
        element: <Suspense fallback={<LoadingFallback />}><SalesFunnelReport /></Suspense>,
      },
      {
        path: 'report/performance',
        element: <Suspense fallback={<LoadingFallback />}><PerformanceReport /></Suspense>,
      },
      {
        path: 'report/customer',
        element: <Suspense fallback={<LoadingFallback />}><CustomerReport /></Suspense>,
      },
      {
        path: 'report/activity',
        element: <Suspense fallback={<LoadingFallback />}><ActivityReport /></Suspense>,
      },
      {
        path: 'report/lead-conversion',
        element: <Suspense fallback={<LoadingFallback />}><LeadConversionReport /></Suspense>,
      },
      {
        path: 'report/payment',
        element: <Suspense fallback={<LoadingFallback />}><PaymentReport /></Suspense>,
      },
      // 系统设置 - 使用嵌套路由
      {
        path: 'settings',
        element: <SettingsLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/settings/profile" replace />,
          },
          {
            path: 'profile',
            element: <Suspense fallback={<LoadingFallback />}><Profile /></Suspense>,
          },
          {
            path: 'change-password',
            element: <Suspense fallback={<LoadingFallback />}><ChangePassword /></Suspense>,
          },
          {
            path: 'notifications',
            element: <Suspense fallback={<LoadingFallback />}><NotificationPreferences /></Suspense>,
          },
          {
            path: 'display',
            element: <Suspense fallback={<LoadingFallback />}><DisplayPreferences /></Suspense>,
          },
          {
            path: 'roles',
            element: <Suspense fallback={<LoadingFallback />}><Roles /></Suspense>,
          },
          {
            path: 'users',
            element: <Suspense fallback={<LoadingFallback />}><Users /></Suspense>,
          },
          {
            path: 'permissions',
            element: <Suspense fallback={<LoadingFallback />}><PermissionSettings /></Suspense>,
          },
          {
            path: 'custom-fields',
            element: <Suspense fallback={<LoadingFallback />}><CustomFields /></Suspense>,
          },
          {
            path: 'custom-objects',
            element: <Suspense fallback={<LoadingFallback />}><CustomObjects /></Suspense>,
          },
          {
            path: 'custom-objects/create',
            element: <Suspense fallback={<LoadingFallback />}><CreateCustomObject /></Suspense>,
          },
          {
            path: 'custom-objects/:objectId/edit',
            element: <Suspense fallback={<LoadingFallback />}><CreateCustomObject /></Suspense>,
          },
          {
            path: 'custom-objects/:objectId/fields',
            element: <Suspense fallback={<LoadingFallback />}><ObjectFields /></Suspense>,
          },
          {
            path: 'custom-objects/:objectId/form',
            element: <Suspense fallback={<LoadingFallback />}><FormDesigner /></Suspense>,
          },
          {
            path: 'custom-objects/:objectId/data',
            element: <Suspense fallback={<LoadingFallback />}><ObjectData /></Suspense>,
          },
          {
            path: 'custom-objects/:objectId/relationships',
            element: <Suspense fallback={<LoadingFallback />}><ObjectRelationships /></Suspense>,
          },
          {
            path: 'audit-log',
            element: <Suspense fallback={<LoadingFallback />}><AuditLog /></Suspense>,
          },
          {
            path: 'login-log',
            element: <Suspense fallback={<LoadingFallback />}><LoginLog /></Suspense>,
          },
          {
            path: 'system-config',
            element: <Suspense fallback={<LoadingFallback />}><SystemConfig /></Suspense>,
          },
        ],
      },
      // 测试页面
      {
        path: 'test',
        element: <Suspense fallback={<LoadingFallback />}><TestPage /></Suspense>,
      },
      // AI 功能 (Phase 4)
      {
        path: 'ai/lead-assignment',
        element: <Suspense fallback={<LoadingFallback />}><LeadAssignment /></Suspense>,
      },
      {
        path: 'ai/lead-scoring',
        element: <Suspense fallback={<LoadingFallback />}><LeadScoring /></Suspense>,
      },
      {
        path: 'ai/sales-forecast',
        element: <Suspense fallback={<LoadingFallback />}><SalesForecast /></Suspense>,
      },
      {
        path: 'ai/customer-segmentation',
        element: <Suspense fallback={<LoadingFallback />}><CustomerSegmentation /></Suspense>,
      },
      {
        path: 'ai/churn-warning',
        element: <Suspense fallback={<LoadingFallback />}><ChurnWarning /></Suspense>,
      },
      {
        path: 'ai/meeting-assistant',
        element: <Suspense fallback={<LoadingFallback />}><MeetingAssistant /></Suspense>,
      },
      // AI 功能 (Phase 5)
      {
        path: 'ai/predictive',
        element: <Suspense fallback={<LoadingFallback />}><PredictiveAI /></Suspense>,
      },
      {
        path: 'ai/agents',
        element: <Suspense fallback={<LoadingFallback />}><AIAgents /></Suspense>,
      },
      {
        path: 'ai/agents/:agentId',
        element: <Suspense fallback={<LoadingFallback />}><AgentDetail /></Suspense>,
      },
      // 营销自动化模块 (Phase 5)
      {
        path: 'marketing/campaigns',
        element: <Suspense fallback={<LoadingFallback />}><CampaignsList /></Suspense>,
      },
      {
        path: 'marketing/campaign/:id',
        element: <Suspense fallback={<LoadingFallback />}><CampaignDetail /></Suspense>,
      },
      {
        path: 'marketing/email-templates',
        element: <Suspense fallback={<LoadingFallback />}><EmailTemplates /></Suspense>,
      },
      {
        path: 'marketing/target-lists',
        element: <Suspense fallback={<LoadingFallback />}><TargetLists /></Suspense>,
      },
      // 对接 Demo
      {
        path: 'integration/tickets',
        element: <Suspense fallback={<LoadingFallback />}><TicketList /></Suspense>,
      },
      {
        path: 'integration/knowledge',
        element: <Suspense fallback={<LoadingFallback />}><KnowledgeSearch /></Suspense>,
      },
      {
        path: 'integration/callcenter',
        element: <Suspense fallback={<LoadingFallback />}><OutboundTasks /></Suspense>,
      },
    ],
  },
]);

export default router;
