/**
 * Dashboard Page - HubSpot Style
 * Features:
 * - Metric cards with trends
 * - Role view switching
 * - Collapsible dashlets
 */
import React, { useState } from 'react';
import { Card, Row, Col, Select, Segmented, Typography, Space, Button, Dropdown, Tag } from 'antd';
import {
  TeamOutlined,
  BulbOutlined,
  FileTextOutlined,
  DollarOutlined,
  SettingOutlined,
  ReloadOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { DashboardGrid } from '../components/Dashboard/DashboardGrid';
import { FunnelDashlet } from '../components/Dashlet/FunnelDashlet';
import { PerformanceDashlet } from '../components/Dashlet/PerformanceDashlet';
import { TaskDashlet } from '../components/Dashlet/TaskDashlet';
import { ContractDashlet } from '../components/Dashlet/ContractDashlet';
import { LeadTrendDashlet } from '../components/Dashlet/LeadTrendDashlet';
import { CustomerDistDashlet } from '../components/Dashlet/CustomerDistDashlet';
import { SalesOverviewDashlet } from '../components/Dashlet/SalesOverviewDashlet';
import { TodoDashlet } from '../components/Dashlet/TodoDashlet';
import { PaymentWarningDashlet } from '../components/Dashlet/PaymentWarningDashlet';
import { MetricCard } from '../components/MetricCard';
import { CollapseSection } from '../components/CollapseSection';
import { DashletConfig } from '../types/dashboard';
import { colors } from '../styles/tokens';
import {
  funnelData,
  performanceData,
  taskData,
  contractData,
  leadTrendData,
  customerDistData,
  defaultDashlets,
} from '../mock/dashboardData';

const { Text, Title } = Typography;

// Mock data
const salesOverviewData = {
  todayLeads: 15,
  conversionRate: 32.0,
  pendingFollowUps: 8,
  closedAmount: 125000,
  leadsTrend: 12.5,
  conversionTrend: -2.3,
  followUpTrend: -5.0,
  amountTrend: 8.2,
};

const todoData = {
  followUps: [
    { id: '1', type: 'followup' as const, title: '电话回访', customer: '北京科技创新', time: '今天 14:00', priority: 'high' as const, status: 'pending' as const },
    { id: '2', type: 'followup' as const, title: '方案演示', customer: '上海智能制造', time: '今天 16:00', priority: 'high' as const, status: 'pending' as const },
    { id: '3', type: 'followup' as const, title: '需求确认', customer: '广州数字科技', time: '明天 10:00', priority: 'medium' as const, status: 'pending' as const },
  ],
  approvals: [
    { id: '4', type: 'approval' as const, title: '合同审批', customer: '深圳未来科技', time: '待处理', priority: 'high' as const, status: 'pending' as const },
    { id: '5', type: 'approval' as const, title: '报价审批', customer: '杭州云服务', time: '待处理', priority: 'medium' as const, status: 'pending' as const },
  ],
  payments: [
    { id: '6', type: 'payment' as const, title: '回款确认', customer: '南京信息技术', time: '今天截止', priority: 'high' as const, status: 'pending' as const },
  ],
};

const paymentWarningData = {
  upcoming: [
    { id: '1', customerName: '北京科技创新', amount: 580000, dueDate: '03-25', daysUntilDue: 12, status: 'upcoming' as const, contractNo: 'CONT2026001' },
    { id: '2', customerName: '上海智能制造', amount: 320000, dueDate: '03-30', daysUntilDue: 17, status: 'upcoming' as const, contractNo: 'CONT2026002' },
  ],
  overdue: [
    { id: '4', customerName: '武汉商贸集团', amount: 280000, dueDate: '03-05', daysUntilDue: -8, status: 'overdue' as const, contractNo: 'CONT2026004' },
  ],
};

/** View options */
const viewOptions = [
  { label: 'My Today', value: 'today' },
  { label: 'Manager View', value: 'manager' },
  { label: 'Executive View', value: 'executive' },
];

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const [dashlets, setDashlets] = useState<DashletConfig[]>(defaultDashlets);
  const [columns, setColumns] = useState<3 | 4>(3);
  const [view, setView] = useState<string>('today');

  const renderDashlet = (type: string) => {
    switch (type) {
      case 'funnel':
        return <FunnelDashlet data={funnelData} />;
      case 'performance':
        return <PerformanceDashlet data={performanceData} />;
      case 'task':
        return <TaskDashlet data={taskData} />;
      case 'contract':
        return <ContractDashlet data={contractData} />;
      case 'leadTrend':
        return <LeadTrendDashlet data={leadTrendData} />;
      case 'customerDist':
        return <CustomerDistDashlet data={customerDistData} />;
      case 'salesOverview':
        return <SalesOverviewDashlet data={salesOverviewData} />;
      case 'todo':
        return <TodoDashlet data={todoData} />;
      case 'paymentWarning':
        return <PaymentWarningDashlet data={paymentWarningData} />;
      default:
        return null;
    }
  };

  const handleDashletsChange = (newDashlets: DashletConfig[]) => {
    setDashlets(newDashlets);
  };

  const handleColumnsChange = (newColumns: 3 | 4) => {
    setColumns(newColumns);
  };

  return (
    <div style={{ padding: 0 }}>
      {/* Page title */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
      }}>
        <Title level={4} style={{ margin: 0 }}>{t('dashboard.title')}</Title>
        <Space>
          <Segmented
            options={viewOptions}
            value={view}
            onChange={(value) => setView(value as string)}
          />
          <Button icon={<ReloadOutlined />}>{t('common.refresh')}</Button>
          <Dropdown
            menu={{
              items: [
                { key: 'layout', label: 'Customize Layout' },
                { key: 'settings', label: t('nav.settings') },
              ],
            }}
          >
            <Button icon={<SettingOutlined />} />
          </Dropdown>
        </Space>
      </div>

      {/* Metric Cards */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} lg={6}>
          <MetricCard
            title={t('dashboard.metrics.todayLeads')}
            value={salesOverviewData.todayLeads}
            suffix=""
            trend="up"
            trendValue={`${salesOverviewData.leadsTrend}%`}
            icon={<TeamOutlined />}
            color="primary"
            tooltip="New leads added today"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <MetricCard
            title={t('dashboard.metrics.conversionRate')}
            value={salesOverviewData.conversionRate}
            suffix="%"
            trend="down"
            trendValue={`${Math.abs(salesOverviewData.conversionTrend)}%`}
            icon={<BulbOutlined />}
            color="warning"
            tooltip="Lead conversion rate this month"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <MetricCard
            title={t('dashboard.metrics.pendingFollowUps')}
            value={salesOverviewData.pendingFollowUps}
            suffix=""
            trend="down"
            trendValue={`${Math.abs(salesOverviewData.followUpTrend)}%`}
            icon={<FileTextOutlined />}
            color="primary"
            tooltip="Pending follow-ups"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <MetricCard
            title={t('dashboard.metrics.closedAmount')}
            value={salesOverviewData.closedAmount}
            prefix="$"
            trend="up"
            trendValue={`${salesOverviewData.amountTrend}%`}
            icon={<DollarOutlined />}
            color="primary"
            tooltip="Closed amount this month"
          />
        </Col>
      </Row>

      {/* To-Do Items */}
      <CollapseSection
        title={t('dashboard.sections.todos')}
        storageKey="dashboard-todos"
        defaultExpanded={true}
        extra={<Button type="link" size="small">{t('common.viewAll')}</Button>}
      >
        <TodoDashlet data={todoData} />
      </CollapseSection>

      {/* Dashlet 网格 */}
      <DashboardGrid
        dashlets={dashlets}
        columns={columns}
        onDashletsChange={handleDashletsChange}
        onColumnsChange={handleColumnsChange}
        renderDashlet={renderDashlet}
      />
    </div>
  );
};

export default Dashboard;