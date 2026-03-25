/**
 * 主布局组件
 * 包含侧边栏导航、顶部栏和内容区域
 * 支持：
 * - 侧边栏折叠/展开
 * - 响应式布局
 * - 面包屑导航
 * - 全局搜索
 * - 通知中心
 * - 用户菜单
 * - 多语言切换
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Layout, Menu, Drawer, Breadcrumb, Input, Badge, Avatar, Dropdown, Space, theme, Typography, Tooltip } from 'antd';
import {
  HomeOutlined,
  TeamOutlined,
  BulbOutlined,
  FileTextOutlined,
  BarChartOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  RobotOutlined,
  MailOutlined,
  ShopOutlined,
  CustomerServiceOutlined,
  BellOutlined,
  SearchOutlined,
  UserOutlined,
  LogoutOutlined,
  QuestionCircleOutlined,
  MenuOutlined,
  LockOutlined,
  SafetyOutlined,
  FormOutlined,
  AppstoreOutlined,
  LoginOutlined,
  ThunderboltOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import type { MenuProps, BreadcrumbProps } from 'antd';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { colors, spacing } from '../../styles/tokens';
import { sidebar, isMobile, breakpoints } from '../../styles/breakpoints';
import { LanguageSwitcher } from '../LanguageSwitcher';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

// 菜单配置 - 使用函数以支持 i18n
const getMenuItems = (t: (key: string) => string): MenuItem[] => [
  getItem(t('nav.workplace'), 'workplace', <HomeOutlined />, [
    getItem(t('nav.salesWorkbench'), '/workbench'),
    getItem(t('nav.dashboard'), '/dashboard'),
  ]),
  getItem(t('nav.customerManagement'), 'customer', <TeamOutlined />, [
    getItem(t('nav.customerList'), '/customer/list'),
    getItem(t('nav.contactList'), '/contact/list'),
  ]),
  getItem(t('nav.salesManagement'), 'sales', <BulbOutlined />, [
    getItem(t('nav.leadManagement'), '/lead/list'),
    getItem(t('nav.opportunityManagement'), '/opportunity/list'),
    getItem(t('nav.activityRecords'), '/activity/list'),
  ]),
  getItem(t('nav.orderManagement'), 'order', <FileTextOutlined />, [
    getItem(t('nav.orderList'), '/order/list'),
    getItem(t('nav.quotes'), '/quote/list'),
    getItem(t('nav.contractManagement'), '/contract/list'),
    getItem(t('nav.paymentManagement'), '/payment/list'),
  ]),
  getItem(t('nav.productAndPricing'), 'product', <ShopOutlined />, [
    getItem(t('nav.productLibrary'), '/products/list'),
    getItem(t('nav.priceList'), '/pricebooks/list'),
  ]),
  getItem(t('nav.reportCenter'), 'report', <BarChartOutlined />, [
    getItem(t('nav.salesFunnel'), '/report/funnel'),
    getItem(t('nav.performanceStats'), '/report/performance'),
    getItem(t('nav.customerAnalysis'), '/report/customer'),
    getItem(t('nav.activityReports'), '/report/activity'),
    getItem(t('nav.leadConversion'), '/report/lead-conversion'),
    getItem(t('nav.paymentAnalysis'), '/report/payment'),
  ]),
  getItem(t('nav.intelligentAI'), 'ai', <RobotOutlined />, [
    getItem(t('nav.intelligentLeadAssignment'), '/ai/lead-assignment'),
    getItem(t('nav.leadScoringAI'), '/ai/lead-scoring'),
    getItem(t('nav.salesForecastAI'), '/ai/sales-forecast'),
    getItem(t('nav.customerSegmentationAI'), '/ai/customer-segmentation'),
    getItem(t('nav.churnWarning'), '/ai/churn-warning'),
    getItem(t('nav.meetingAssistant'), '/ai/meeting-assistant'),
    getItem(t('nav.predictiveAI'), '/ai/predictive'),
    getItem(t('nav.aiAgents'), '/ai/agents'),
  ]),
  getItem(t('nav.automation'), 'automation', <ThunderboltOutlined />, [
    getItem(t('nav.workflows'), '/automation/workflows'),
    getItem(t('nav.executionLogs'), '/automation/logs'),
  ]),
  getItem(t('nav.marketingAutomation'), 'marketing', <MailOutlined />, [
    getItem(t('nav.marketingCampaigns'), '/marketing/campaigns'),
    getItem(t('nav.emailTemplates'), '/marketing/email-templates'),
    getItem(t('nav.targetLists'), '/marketing/target-lists'),
  ]),
  getItem(t('nav.integration'), 'integration', <CustomerServiceOutlined />, [
    getItem(t('nav.ticketSystem'), '/integration/tickets'),
    getItem(t('nav.knowledgeBase'), '/integration/knowledge'),
    getItem(t('nav.callCenter'), '/integration/callcenter'),
  ]),
  getItem(t('nav.systemSettings'), 'settings', <SettingOutlined />, [
    getItem(t('nav.profile'), '/settings/profile'),
    getItem(t('nav.changePassword'), '/settings/change-password'),
    getItem(t('nav.notificationPreferences'), '/settings/notifications'),
    getItem(t('nav.displayPreferences'), '/settings/display'),
    getItem(t('nav.roleManagement'), '/settings/roles'),
    getItem(t('nav.userManagement'), '/settings/users'),
    getItem(t('nav.permissionConfiguration'), '/settings/permissions'),
    getItem(t('nav.customFields'), '/settings/custom-fields'),
    getItem(t('nav.customObjects'), '/settings/custom-objects'),
    getItem(t('nav.operationLog'), '/settings/audit-log'),
    getItem(t('nav.loginLog'), '/settings/login-log'),
    getItem(t('nav.systemConfiguration'), '/settings/system-config'),
  ]),
];

// 面包屑映射 - 使用函数以支持 i18n
const getBreadcrumbNameMap = (t: (key: string) => string): Record<string, string> => ({
  '/workbench': t('breadcrumb.salesWorkbench'),
  '/dashboard': t('breadcrumb.dashboard'),
  '/customer': t('breadcrumb.customer'),
  '/customer/list': t('breadcrumb.customerList'),
  '/contact': t('breadcrumb.contact'),
  '/contact/list': t('breadcrumb.contactList'),
  '/lead': t('breadcrumb.lead'),
  '/lead/list': t('breadcrumb.leadList'),
  '/opportunity': t('breadcrumb.opportunity'),
  '/opportunity/list': t('breadcrumb.opportunityList'),
  '/activity': t('breadcrumb.activity'),
  '/activity/list': t('breadcrumb.activityList'),
  '/quote': t('breadcrumb.quote'),
  '/quote/list': t('breadcrumb.quoteList'),
  '/contract': t('breadcrumb.contract'),
  '/contract/list': t('breadcrumb.contractList'),
  '/payment': t('breadcrumb.payment'),
  '/payment/list': t('breadcrumb.paymentList'),
  '/products': t('breadcrumb.products'),
  '/products/list': t('breadcrumb.productsList'),
  '/pricebooks': t('breadcrumb.pricebooks'),
  '/pricebooks/list': t('breadcrumb.pricebooksList'),
  '/report': t('breadcrumb.report'),
  '/report/funnel': t('breadcrumb.reportFunnel'),
  '/report/performance': t('breadcrumb.reportPerformance'),
  '/report/customer': t('breadcrumb.reportCustomer'),
  '/report/activity': t('breadcrumb.reportActivity'),
  '/report/lead-conversion': t('breadcrumb.reportLeadConversion'),
  '/report/payment': t('breadcrumb.reportPayment'),
  '/ai': t('breadcrumb.ai'),
  '/ai/lead-assignment': t('breadcrumb.aiLeadAssignment'),
  '/ai/lead-scoring': t('breadcrumb.aiLeadScoring'),
  '/ai/sales-forecast': t('breadcrumb.aiSalesForecast'),
  '/ai/customer-segmentation': t('breadcrumb.aiCustomerSegmentation'),
  '/ai/churn-warning': t('breadcrumb.aiChurnWarning'),
  '/ai/meeting-assistant': t('breadcrumb.aiMeetingAssistant'),
  '/ai/predictive': t('breadcrumb.aiPredictive'),
  '/ai/agents': t('breadcrumb.aiAgents'),
  '/automation': t('breadcrumb.automation'),
  '/automation/workflows': t('breadcrumb.automationWorkflows'),
  '/automation/logs': t('breadcrumb.automationLogs'),
  '/marketing': t('breadcrumb.marketing'),
  '/marketing/campaigns': t('breadcrumb.marketingCampaigns'),
  '/marketing/email-templates': t('breadcrumb.marketingEmailTemplates'),
  '/marketing/target-lists': t('breadcrumb.marketingTargetLists'),
  '/integration': t('breadcrumb.integration'),
  '/integration/tickets': t('breadcrumb.integrationTickets'),
  '/integration/knowledge': t('breadcrumb.integrationKnowledge'),
  '/integration/callcenter': t('breadcrumb.integrationCallcenter'),
  '/settings': t('breadcrumb.settings'),
  '/settings/roles': t('breadcrumb.settingsRoles'),
  '/settings/users': t('breadcrumb.settingsUsers'),
  '/settings/permissions': t('breadcrumb.settingsPermissions'),
  '/settings/profile': t('breadcrumb.settingsProfile'),
  '/settings/change-password': t('breadcrumb.settingsChangePassword'),
  '/settings/notifications': t('breadcrumb.settingsNotifications'),
  '/settings/display': t('breadcrumb.settingsDisplay'),
  '/settings/custom-fields': t('breadcrumb.settingsCustomFields'),
  '/settings/custom-objects': t('breadcrumb.settingsCustomObjects'),
  '/settings/audit-log': t('breadcrumb.settingsAuditLog'),
  '/settings/login-log': t('breadcrumb.settingsLoginLog'),
  '/settings/system-config': t('breadcrumb.settingsSystemConfig'),
});

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { t } = useTranslation();
  
  // 从 localStorage 读取折叠状态
  const getStoredCollapsed = (): boolean => {
    try {
      const stored = localStorage.getItem('sidebar-collapsed');
      return stored === 'true';
    } catch {
      return false;
    }
  };

  const [collapsed, setCollapsed] = useState(getStoredCollapsed);
  const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [searchValue, setSearchValue] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // 获取国际化的菜单项
  const menuItems = getMenuItems(t);
  const breadcrumbNameMap = getBreadcrumbNameMap(t);

  // 判断是否是移动端
  const isMobileView = isMobile(windowWidth);

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);

      // 小屏幕自动折叠侧边栏
      if (width < sidebar.autoCollapseWidth && !isMobile(width)) {
        setCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 持久化折叠状态
  useEffect(() => {
    try {
      localStorage.setItem('sidebar-collapsed', String(collapsed));
    } catch {
      // ignore
    }
  }, [collapsed]);

  // 菜单点击处理
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    navigate(e.key);
    if (isMobileView) {
      setMobileDrawerVisible(false);
    }
  };

  // 菜单展开/收起处理
  const handleOpenChange: MenuProps['onOpenChange'] = (keys) => {
    setOpenKeys(keys as string[]);
  };

  // 获取当前选中的菜单项
  const getSelectedKey = () => {
    const path = location.pathname;
    for (const item of menuItems) {
      if (item && 'key' in item && item.key === path) {
        return [path];
      }
      if (item && 'children' in item && item.children) {
        for (const child of item.children) {
          if (child && 'key' in child && child.key === path) {
            return [path];
          }
        }
      }
    }
    return ['/dashboard'];
  };

  // 页面切换时自动展开对应的菜单
  useEffect(() => {
    const path = location.pathname;
    let newOpenKeys: string[] = [];
    if (path === '/workbench' || path === '/dashboard') newOpenKeys = ['workplace'];
    if (path.startsWith('/customer/') || path.startsWith('/contact/')) newOpenKeys = ['customer'];
    if (path.startsWith('/lead/') || path.startsWith('/opportunity/') || path.startsWith('/activity/')) newOpenKeys = ['sales'];
    if (path.startsWith('/quote/') || path.startsWith('/contract/') || path.startsWith('/payment/')) newOpenKeys = ['order'];
    if (path.startsWith('/products/') || path.startsWith('/pricebooks/')) newOpenKeys = ['product'];
    if (path.startsWith('/report/')) newOpenKeys = ['report'];
    if (path.startsWith('/ai/')) newOpenKeys = ['ai'];
    if (path.startsWith('/marketing/')) newOpenKeys = ['marketing'];
    if (path.startsWith('/integration/')) newOpenKeys = ['integration'];
    if (path.startsWith('/automation/')) newOpenKeys = ['automation'];
    if (path.startsWith('/settings/')) newOpenKeys = ['settings'];
    setOpenKeys(newOpenKeys);
  }, [location.pathname]);

  // 生成面包屑
  const generateBreadcrumb = () => {
    const pathSnippets = location.pathname.split('/').filter((i) => i);
    const breadcrumbItems = pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      const name = breadcrumbNameMap[url];
      if (!name) return null;

      return {
        key: url,
        title: index === pathSnippets.length - 1 ? name : <Link to={url}>{name}</Link>,
      };
    }).filter(Boolean);

    return [
      { key: 'home', title: <Link to="/dashboard"><HomeOutlined /></Link> },
      ...breadcrumbItems,
    ] as BreadcrumbProps['items'];
  };

  // 用户菜单
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: t('nav.userCenter'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: t('nav.accountSettings'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('nav.logout'),
      danger: true,
    },
  ];

  // 通知菜单
  const notificationItems: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div style={{ maxWidth: 280 }}>
          <div style={{ fontWeight: 500 }}>{t('nav.contractApprovalPending')}</div>
          <div style={{ fontSize: 12, color: colors.text.secondary, marginTop: 4 }}>
            深圳未来科技 - 合同编号 CONT2026001
          </div>
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <div style={{ maxWidth: 280 }}>
          <div style={{ fontWeight: 500 }}>{t('nav.opportunityExpiringSoon')}</div>
          <div style={{ fontSize: 12, color: colors.text.secondary, marginTop: 4 }}>
            北京科技创新 - 预计成交日期：03-31
          </div>
        </div>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: 'viewAll',
      label: <a style={{ color: colors.primary }}>{t('nav.viewAllNotifications')}</a>,
    },
  ];

  // 渲染侧边栏内容
  const renderSiderContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div
        style={{
          height: 64,
          minHeight: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? 0 : '0 24px',
          borderBottom: `1px solid ${colors.border.default}`,
          transition: 'padding 0.2s',
          flexShrink: 0,
        }}
      >
        {collapsed ? (
          <Text strong style={{ fontSize: 18, color: colors.primary }}>C</Text>
        ) : (
          <Text strong style={{ fontSize: 18 }}>{t('nav.crmSystem')}</Text>
        )}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        <Menu
          mode="inline"
          selectedKeys={getSelectedKey()}
          openKeys={collapsed ? [] : openKeys}
          onOpenChange={handleOpenChange}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ borderRight: 0 }}
          inlineCollapsed={collapsed}
        />
      </div>
    </div>
  );

  // 渲染顶部栏
  const renderHeader = () => (
    <Header
      style={{
        padding: '0 16px',
        background: colorBgContainer,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: `1px solid ${colors.border.default}`,
        height: 56,
      }}
    >
      {/* 左侧：折叠按钮 + 面包屑 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {isMobileView ? (
          <MenuOutlined
            style={{ fontSize: 18, cursor: 'pointer' }}
            onClick={() => setMobileDrawerVisible(true)}
          />
        ) : (
          <Tooltip title={collapsed ? t('nav.expandSidebar') : t('nav.collapseSidebar')}>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
              style: { fontSize: 18, cursor: 'pointer' }
            })}
          </Tooltip>
        )}
        {!isMobileView && (
          <Breadcrumb items={generateBreadcrumb()} />
        )}
      </div>

      {/* 中间：全局搜索 */}
      <div style={{ flex: 1, maxWidth: 400, margin: '0 24px' }}>
        <Input
          placeholder={t('nav.searchPlaceholder')}
          prefix={<SearchOutlined style={{ color: colors.text.tertiary }} />}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          style={{ borderRadius: 4 }}
          allowClear
        />
      </div>

      {/* 右侧：通知 + 语言切换 + 用户头像 */}
      <Space size={16}>
        <LanguageSwitcher />
        <Dropdown menu={{ items: notificationItems }} trigger={['click']} placement="bottomRight">
          <Badge count={3} size="small" style={{ cursor: 'pointer' }}>
            <BellOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
          </Badge>
        </Dropdown>
        <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <Avatar size={32} icon={<UserOutlined />} style={{ background: colors.primary }} />
            {!isMobileView && (
              <Text style={{ fontSize: 13 }}>{t('nav.administrator')}</Text>
            )}
          </div>
        </Dropdown>
      </Space>
    </Header>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 桌面端侧边栏 */}
      {!isMobileView && (
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          theme="light"
          width={sidebar.expandedWidth}
          collapsedWidth={sidebar.collapsedWidth}
          style={{
            borderRight: `1px solid ${colors.border.default}`,
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 100,
          }}
        >
          {renderSiderContent()}
        </Sider>
      )}

      {/* 移动端抽屉式侧边栏 */}
      {isMobileView && (
        <Drawer
          placement="left"
          onClose={() => setMobileDrawerVisible(false)}
          open={mobileDrawerVisible}
          width={sidebar.expandedWidth}
          styles={{
            body: { padding: 0 },
            header: { display: 'none' },
          }}
        >
          {renderSiderContent()}
        </Drawer>
      )}

      <Layout
        style={{
          marginLeft: isMobileView ? 0 : collapsed ? sidebar.collapsedWidth : sidebar.expandedWidth,
          transition: 'margin-left 0.2s',
        }}
      >
        {renderHeader()}
        <Content
          style={{
            margin: isMobileView ? '12px' : '16px',
            padding: isMobileView ? 12 : 16,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;