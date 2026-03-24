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

// 菜单配置（移除 emoji）
const menuItems: MenuItem[] = [
  getItem('工作台', 'workplace', <HomeOutlined />, [
    getItem('销售工作台', '/workbench'),
    getItem('仪表盘', '/dashboard'),
  ]),
  getItem('客户管理', 'customer', <TeamOutlined />, [
    getItem('客户列表', '/customer/list'),
    getItem('联系人列表', '/contact/list'),
  ]),
  getItem('销售管理', 'sales', <BulbOutlined />, [
    getItem('线索管理', '/lead/list'),
    getItem('商机管理', '/opportunity/list'),
    getItem('跟进记录', '/activity/list'),
  ]),
  getItem('订单管理', 'order', <FileTextOutlined />, [
    getItem('报价单', '/quote/list'),
    getItem('合同管理', '/contract/list'),
    getItem('回款管理', '/payment/list'),
  ]),
  getItem('产品与定价', 'product', <ShopOutlined />, [
    getItem('产品库', '/products/list'),
    getItem('价格表', '/pricebooks/list'),
  ]),
  getItem('报表中心', 'report', <BarChartOutlined />, [
    getItem('销售漏斗', '/report/funnel'),
    getItem('业绩统计', '/report/performance'),
    getItem('客户分析', '/report/customer'),
    getItem('跟进活动', '/report/activity'),
    getItem('线索转化', '/report/lead-conversion'),
    getItem('回款分析', '/report/payment'),
  ]),
  getItem('智能 AI', 'ai', <RobotOutlined />, [
    getItem('智能线索分配', '/ai/lead-assignment'),
    getItem('线索评分 AI', '/ai/lead-scoring'),
    getItem('销售预测 AI', '/ai/sales-forecast'),
    getItem('客户分群 AI', '/ai/customer-segmentation'),
    getItem('客户流失预警', '/ai/churn-warning'),
    getItem('会议助手', '/ai/meeting-assistant'),
    getItem('预测性 AI', '/ai/predictive'),
    getItem('AI 智能体', '/ai/agents'),
  ]),
  getItem('营销自动化', 'marketing', <MailOutlined />, [
    getItem('营销活动', '/marketing/campaigns'),
    getItem('邮件模板', '/marketing/email-templates'),
    getItem('目标列表', '/marketing/target-lists'),
  ]),
  getItem('集成对接', 'integration', <CustomerServiceOutlined />, [
    getItem('工单系统', '/integration/tickets'),
    getItem('知识库', '/integration/knowledge'),
    getItem('呼叫中心', '/integration/callcenter'),
  ]),
  getItem('系统设置', 'settings', <SettingOutlined />, [
    getItem('角色管理', '/settings/roles'),
    getItem('用户管理', '/settings/users'),
    getItem('权限配置', '/settings/permissions'),
    getItem('系统配置', '/settings'),
  ]),
];

// 面包屑映射
const breadcrumbNameMap: Record<string, string> = {
  '/workbench': '销售工作台',
  '/dashboard': '仪表盘',
  '/customer': '客户管理',
  '/customer/list': '客户列表',
  '/contact': '联系人',
  '/contact/list': '联系人列表',
  '/lead': '线索管理',
  '/lead/list': '线索列表',
  '/opportunity': '商机管理',
  '/opportunity/list': '商机列表',
  '/activity': '跟进记录',
  '/activity/list': '跟进记录列表',
  '/quote': '报价单',
  '/quote/list': '报价单列表',
  '/contract': '合同管理',
  '/contract/list': '合同列表',
  '/payment': '回款管理',
  '/payment/list': '回款列表',
  '/products': '产品库',
  '/products/list': '产品列表',
  '/pricebooks': '价格表',
  '/pricebooks/list': '价格表列表',
  '/report': '报表中心',
  '/report/funnel': '销售漏斗',
  '/report/performance': '业绩统计',
  '/report/customer': '客户分析',
  '/report/activity': '跟进活动',
  '/report/lead-conversion': '线索转化',
  '/report/payment': '回款分析',
  '/ai': '智能 AI',
  '/ai/lead-assignment': '智能线索分配',
  '/ai/lead-scoring': '线索评分 AI',
  '/ai/sales-forecast': '销售预测 AI',
  '/ai/customer-segmentation': '客户分群 AI',
  '/ai/churn-warning': '客户流失预警',
  '/ai/meeting-assistant': '会议助手',
  '/ai/predictive': '预测性 AI',
  '/ai/agents': 'AI 智能体',
  '/marketing': '营销自动化',
  '/marketing/campaigns': '营销活动',
  '/marketing/email-templates': '邮件模板',
  '/marketing/target-lists': '目标列表',
  '/integration': '集成对接',
  '/integration/tickets': '工单系统',
  '/integration/knowledge': '知识库',
  '/integration/callcenter': '呼叫中心',
  '/settings': '系统设置',
  '/settings/roles': '角色管理',
  '/settings/users': '用户管理',
  '/settings/permissions': '权限配置',
};

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
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
      label: '个人中心',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '账户设置',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
    },
  ];

  // 通知菜单
  const notificationItems: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div style={{ maxWidth: 280 }}>
          <div style={{ fontWeight: 500 }}>合同审批待处理</div>
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
          <div style={{ fontWeight: 500 }}>商机即将过期</div>
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
      label: <a style={{ color: colors.primary }}>查看全部通知</a>,
    },
  ];

  // 渲染侧边栏内容
  const renderSiderContent = () => (
    <>
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? 0 : '0 24px',
          borderBottom: `1px solid ${colors.border.default}`,
          transition: 'padding 0.2s',
        }}
      >
        {collapsed ? (
          <Text strong style={{ fontSize: 18, color: colors.primary }}>C</Text>
        ) : (
          <Text strong style={{ fontSize: 18 }}>CRM 系统</Text>
        )}
      </div>
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
    </>
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
          <Tooltip title={collapsed ? '展开侧边栏' : '收起侧边栏'}>
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
          placeholder="搜索客户、商机、合同..."
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
              <Text style={{ fontSize: 13 }}>管理员</Text>
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