/**
 * 登录日志页面
 * 展示用户登录历史记录
 */
import React, { useState, useMemo } from 'react';
import { Card, Table, Button, Input, Select, DatePicker, Space, Tag, Typography, message, Tooltip } from 'antd';
import { SearchOutlined, ExportOutlined, DesktopOutlined, MobileOutlined, TabletOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { colors } from '../../styles/tokens';
import { mockLoginLogs, LoginLogEntry } from '../../mock/settingsData';

const { RangePicker } = DatePicker;
const { Text } = Typography;

const deviceIcons: Record<string, React.ReactNode> = {
  desktop: <DesktopOutlined />,
  laptop: <DesktopOutlined />,
  mobile: <MobileOutlined />,
  tablet: <TabletOutlined />,
};

const LoginLog: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [userFilter, setUserFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  // 用户选项
  const userOptions = useMemo(() => {
    const users = new Set(mockLoginLogs.map(log => log.user).filter(u => u !== 'Unknown'));
    return Array.from(users).map(user => ({ value: user, label: user }));
  }, []);

  // 状态选项
  const statusOptions = [
    { value: 'success', label: t('settings.loginLog.status.success') },
    { value: 'failed', label: t('settings.loginLog.status.failed') },
  ];

  // 筛选后的数据
  const filteredData = useMemo(() => {
    let data = [...mockLoginLogs];

    if (searchText) {
      const lower = searchText.toLowerCase();
      data = data.filter(log =>
        log.user.toLowerCase().includes(lower) ||
        log.ipAddress.includes(searchText) ||
        log.device.toLowerCase().includes(lower) ||
        log.browser.toLowerCase().includes(lower)
      );
    }

    if (userFilter) {
      data = data.filter(log => log.user === userFilter);
    }

    if (statusFilter) {
      data = data.filter(log => log.status === statusFilter);
    }

    if (dateRange && dateRange[0] && dateRange[1]) {
      data = data.filter(log => {
        const logDate = dayjs(log.timestamp);
        return logDate.isAfter(dateRange[0]) && logDate.isBefore(dateRange[1].add(1, 'day'));
      });
    }

    return data;
  }, [searchText, userFilter, statusFilter, dateRange]);

  // 获取设备图标
  const getDeviceIcon = (device: string) => {
    const lower = device.toLowerCase();
    if (lower.includes('mobile') || lower.includes('iphone') || lower.includes('android')) {
      return deviceIcons.mobile;
    }
    if (lower.includes('tablet') || lower.includes('ipad')) {
      return deviceIcons.tablet;
    }
    if (lower.includes('laptop') || lower.includes('macbook')) {
      return deviceIcons.laptop;
    }
    return deviceIcons.desktop;
  };

  // 表格列定义
  const columns: ColumnsType<LoginLogEntry> = [
    {
      title: t('settings.loginLog.columns.timestamp'),
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 170,
      render: (timestamp: string) => (
        <Text style={{ fontSize: 13 }}>
          {dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')}
        </Text>
      ),
    },
    {
      title: t('settings.loginLog.columns.user'),
      dataIndex: 'user',
      key: 'user',
      width: 120,
      render: (user: string) => (
        <Text strong style={{ fontSize: 13, color: user === 'Unknown' ? colors.text.tertiary : undefined }}>
          {user}
        </Text>
      ),
    },
    {
      title: t('settings.loginLog.columns.ipAddress'),
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      width: 130,
      render: (ip: string) => (
        <Tooltip title={t('settings.loginLog.ipTooltip')}>
          <Text type="secondary" style={{ fontSize: 13 }}>{ip}</Text>
        </Tooltip>
      ),
    },
    {
      title: t('settings.loginLog.columns.device'),
      dataIndex: 'device',
      key: 'device',
      width: 150,
      render: (device: string) => (
        <Space size={8}>
          <span style={{ color: colors.text.secondary }}>{getDeviceIcon(device)}</span>
          <Text style={{ fontSize: 13 }}>{device}</Text>
        </Space>
      ),
    },
    {
      title: t('settings.loginLog.columns.browser'),
      dataIndex: 'browser',
      key: 'browser',
      width: 140,
      render: (browser: string) => (
        <Text type="secondary" style={{ fontSize: 13 }}>{browser}</Text>
      ),
    },
    {
      title: t('settings.loginLog.columns.status'),
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string, record) => (
        status === 'success' ? (
          <Tag
            icon={<CheckCircleOutlined />}
            color="success"
            style={{ borderRadius: 4 }}
          >
            {t('settings.loginLog.status.success')}
          </Tag>
        ) : (
          <Tooltip title={record.failureReason}>
            <Tag
              icon={<CloseCircleOutlined />}
              color="error"
              style={{ borderRadius: 4, cursor: 'pointer' }}
            >
              {t('settings.loginLog.status.failed')}
            </Tag>
          </Tooltip>
        )
      ),
    },
  ];

  // 导出数据
  const handleExport = () => {
    message.loading({ content: t('settings.loginLog.exporting'), key: 'export' });
    setTimeout(() => {
      message.success({ content: t('settings.loginLog.exportSuccess'), key: 'export' });
    }, 1000);
  };

  // 处理表格变化
  const handleTableChange = (paginationConfig: TablePaginationConfig) => {
    setPagination({
      current: paginationConfig.current || 1,
      pageSize: paginationConfig.pageSize || 10,
    });
  };

  // 统计数据
  const stats = useMemo(() => {
    const successCount = filteredData.filter(log => log.status === 'success').length;
    const failedCount = filteredData.filter(log => log.status === 'failed').length;
    return { successCount, failedCount, total: filteredData.length };
  }, [filteredData]);

  return (
    <div style={{ padding: 24 }}>
      <Card bordered={false}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: colors.text.primary }}>
            {t('settings.loginLog.title')}
          </h2>
          <p style={{ margin: '8px 0 0', color: colors.text.secondary, fontSize: 14 }}>
            {t('settings.loginLog.subtitle')}
          </p>
        </div>

        {/* 统计卡片 */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          <div
            style={{
              flex: 1,
              padding: 16,
              backgroundColor: colors.background.default,
              borderRadius: 6,
            }}
          >
            <Text type="secondary" style={{ fontSize: 13, display: 'block' }}>
              {t('settings.loginLog.stats.total')}
            </Text>
            <Text strong style={{ fontSize: 24, color: colors.text.primary }}>
              {stats.total}
            </Text>
          </div>
          <div
            style={{
              flex: 1,
              padding: 16,
              backgroundColor: '#E8F5E9',
              borderRadius: 6,
            }}
          >
            <Text type="secondary" style={{ fontSize: 13, display: 'block' }}>
              {t('settings.loginLog.stats.success')}
            </Text>
            <Text strong style={{ fontSize: 24, color: colors.success }}>
              {stats.successCount}
            </Text>
          </div>
          <div
            style={{
              flex: 1,
              padding: 16,
              backgroundColor: '#FFEBEE',
              borderRadius: 6,
            }}
          >
            <Text type="secondary" style={{ fontSize: 13, display: 'block' }}>
              {t('settings.loginLog.stats.failed')}
            </Text>
            <Text strong style={{ fontSize: 24, color: colors.danger }}>
              {stats.failedCount}
            </Text>
          </div>
        </div>

        {/* 筛选栏 */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            marginBottom: 16,
            padding: 16,
            backgroundColor: colors.background.default,
            borderRadius: 6,
          }}
        >
          <Input
            placeholder={t('settings.loginLog.searchPlaceholder')}
            prefix={<SearchOutlined style={{ color: colors.text.tertiary }} />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 240 }}
            allowClear
          />
          <Select
            placeholder={t('settings.loginLog.filterUser')}
            value={userFilter}
            onChange={setUserFilter}
            options={userOptions}
            style={{ width: 150 }}
            allowClear
          />
          <Select
            placeholder={t('settings.loginLog.filterStatus')}
            value={statusFilter}
            onChange={setStatusFilter}
            options={statusOptions}
            style={{ width: 120 }}
            allowClear
          />
          <RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates)}
            style={{ width: 260 }}
          />
          <Button
            onClick={() => {
              setSearchText('');
              setUserFilter(null);
              setStatusFilter(null);
              setDateRange(null);
            }}
          >
            {t('common.reset')}
          </Button>
          <div style={{ flex: 1 }} />
          <Button
            type="primary"
            icon={<ExportOutlined />}
            onClick={handleExport}
          >
            {t('common.export')}
          </Button>
        </div>

        {/* 表格 */}
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: filteredData.length,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => t('settings.loginLog.paginationTotal', { count: total }),
          }}
          onChange={handleTableChange}
          scroll={{ x: 900 }}
          size="middle"
        />

        {/* 安全提示 */}
        <div
          style={{
            marginTop: 16,
            padding: 12,
            backgroundColor: colors.primarySubtle,
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <Text style={{ fontSize: 13, color: colors.text.secondary }}>
            {t('settings.loginLog.securityHint')}
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default LoginLog;