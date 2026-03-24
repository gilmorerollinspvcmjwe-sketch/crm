/**
 * 操作日志页面
 * 支持筛选、表格展示、详情弹窗、导出功能
 */
import React, { useState, useMemo } from 'react';
import { Card, Table, Button, Input, Select, DatePicker, Space, Tag, Modal, Descriptions, Typography, message, Tooltip } from 'antd';
import { SearchOutlined, ExportOutlined, EyeOutlined, FilterOutlined } from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { colors } from '../../styles/tokens';
import { mockAuditLogs, AuditLogEntry } from '../../mock/settingsData';

const { RangePicker } = DatePicker;
const { Text } = Typography;

const actionColors: Record<string, string> = {
  create: colors.success,
  update: colors.info,
  delete: colors.danger,
  login: colors.primary,
  export: colors.warning,
  import: '#9C27B0',
  assign: '#00BCD4',
  status_change: colors.warning,
};

const AuditLog: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [actionFilter, setActionFilter] = useState<string | null>(null);
  const [moduleFilter, setModuleFilter] = useState<string | null>(null);
  const [operatorFilter, setOperatorFilter] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  // 操作类型选项
  const actionOptions = [
    { value: 'create', label: t('settings.auditLog.actions.create') },
    { value: 'update', label: t('settings.auditLog.actions.update') },
    { value: 'delete', label: t('settings.auditLog.actions.delete') },
    { value: 'login', label: t('settings.auditLog.actions.login') },
    { value: 'export', label: t('settings.auditLog.actions.export') },
    { value: 'import', label: t('settings.auditLog.actions.import') },
    { value: 'assign', label: t('settings.auditLog.actions.assign') },
    { value: 'status_change', label: t('settings.auditLog.actions.statusChange') },
  ];

  // 模块选项
  const moduleOptions = [
    { value: 'customer', label: t('settings.auditLog.modules.customer') },
    { value: 'opportunity', label: t('settings.auditLog.modules.opportunity') },
    { value: 'lead', label: t('settings.auditLog.modules.lead') },
    { value: 'contact', label: t('settings.auditLog.modules.contact') },
    { value: 'contract', label: t('settings.auditLog.modules.contract') },
    { value: 'payment', label: t('settings.auditLog.modules.payment') },
    { value: 'quote', label: t('settings.auditLog.modules.quote') },
    { value: 'product', label: t('settings.auditLog.modules.product') },
    { value: 'user', label: t('settings.auditLog.modules.user') },
    { value: 'system', label: t('settings.auditLog.modules.system') },
    { value: 'report', label: t('settings.auditLog.modules.report') },
  ];

  // 操作人选项（从日志中提取）
  const operatorOptions = useMemo(() => {
    const operators = new Set(mockAuditLogs.map(log => log.operator));
    return Array.from(operators).map(op => ({ value: op, label: op }));
  }, []);

  // 筛选后的数据
  const filteredData = useMemo(() => {
    let data = [...mockAuditLogs];

    if (searchText) {
      const lower = searchText.toLowerCase();
      data = data.filter(log =>
        log.target.toLowerCase().includes(lower) ||
        log.operator.toLowerCase().includes(lower) ||
        log.ipAddress.includes(searchText)
      );
    }

    if (actionFilter) {
      data = data.filter(log => log.action === actionFilter);
    }

    if (moduleFilter) {
      data = data.filter(log => log.module === moduleFilter);
    }

    if (operatorFilter) {
      data = data.filter(log => log.operator === operatorFilter);
    }

    if (dateRange && dateRange[0] && dateRange[1]) {
      data = data.filter(log => {
        const logDate = dayjs(log.timestamp);
        return logDate.isAfter(dateRange[0]) && logDate.isBefore(dateRange[1].add(1, 'day'));
      });
    }

    return data;
  }, [searchText, actionFilter, moduleFilter, operatorFilter, dateRange]);

  // 表格列定义
  const columns: ColumnsType<AuditLogEntry> = [
    {
      title: t('settings.auditLog.columns.timestamp'),
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 160,
      render: (timestamp: string) => (
        <Text style={{ fontSize: 13 }}>
          {dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')}
        </Text>
      ),
    },
    {
      title: t('settings.auditLog.columns.operator'),
      dataIndex: 'operator',
      key: 'operator',
      width: 120,
      render: (operator: string) => (
        <Text strong style={{ fontSize: 13 }}>{operator}</Text>
      ),
    },
    {
      title: t('settings.auditLog.columns.action'),
      dataIndex: 'actionLabel',
      key: 'action',
      width: 100,
      render: (label: string, record) => (
        <Tag
          color={actionColors[record.action]}
          style={{ borderRadius: 4 }}
        >
          {label}
        </Tag>
      ),
    },
    {
      title: t('settings.auditLog.columns.module'),
      dataIndex: 'moduleLabel',
      key: 'module',
      width: 100,
    },
    {
      title: t('settings.auditLog.columns.target'),
      dataIndex: 'target',
      key: 'target',
      ellipsis: true,
      render: (target: string) => (
        <Tooltip title={target}>
          <Text style={{ fontSize: 13 }}>{target}</Text>
        </Tooltip>
      ),
    },
    {
      title: t('settings.auditLog.columns.ipAddress'),
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      width: 130,
      render: (ip: string) => (
        <Text type="secondary" style={{ fontSize: 13 }}>{ip}</Text>
      ),
    },
    {
      title: t('settings.auditLog.columns.actions'),
      key: 'actions',
      width: 80,
      fixed: 'right',
      render: (_, record) => (
        <Button
          type="text"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedLog(record);
            setDetailModalVisible(true);
          }}
        >
          {t('common.details')}
        </Button>
      ),
    },
  ];

  // 导出数据
  const handleExport = () => {
    message.loading({ content: t('settings.auditLog.exporting'), key: 'export' });
    setTimeout(() => {
      message.success({ content: t('settings.auditLog.exportSuccess'), key: 'export' });
    }, 1000);
  };

  // 处理表格变化
  const handleTableChange = (paginationConfig: TablePaginationConfig) => {
    setPagination({
      current: paginationConfig.current || 1,
      pageSize: paginationConfig.pageSize || 10,
    });
  };

  return (
    <div style={{ padding: 24 }}>
      <Card bordered={false}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: colors.text.primary }}>
            {t('settings.auditLog.title')}
          </h2>
          <p style={{ margin: '8px 0 0', color: colors.text.secondary, fontSize: 14 }}>
            {t('settings.auditLog.subtitle')}
          </p>
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
            placeholder={t('settings.auditLog.searchPlaceholder')}
            prefix={<SearchOutlined style={{ color: colors.text.tertiary }} />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 240 }}
            allowClear
          />
          <Select
            placeholder={t('settings.auditLog.filterAction')}
            value={actionFilter}
            onChange={setActionFilter}
            options={actionOptions}
            style={{ width: 140 }}
            allowClear
          />
          <Select
            placeholder={t('settings.auditLog.filterModule')}
            value={moduleFilter}
            onChange={setModuleFilter}
            options={moduleOptions}
            style={{ width: 140 }}
            allowClear
          />
          <Select
            placeholder={t('settings.auditLog.filterOperator')}
            value={operatorFilter}
            onChange={setOperatorFilter}
            options={operatorOptions}
            style={{ width: 140 }}
            allowClear
          />
          <RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates)}
            style={{ width: 260 }}
          />
          <Button
            icon={<FilterOutlined />}
            onClick={() => {
              setSearchText('');
              setActionFilter(null);
              setModuleFilter(null);
              setOperatorFilter(null);
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

        {/* 数据统计 */}
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary">
            {t('settings.auditLog.totalRecords', { count: filteredData.length })}
          </Text>
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
            showTotal: (total) => t('settings.auditLog.paginationTotal', { count: total }),
          }}
          onChange={handleTableChange}
          scroll={{ x: 1000 }}
          size="middle"
        />
      </Card>

      {/* 详情弹窗 */}
      <Modal
        title={t('settings.auditLog.detailTitle')}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            {t('common.cancel')}
          </Button>,
        ]}
        width={600}
      >
        {selectedLog && (
          <div>
            <Descriptions column={2} size="small" bordered>
              <Descriptions.Item label={t('settings.auditLog.detail.timestamp')} span={2}>
                {dayjs(selectedLog.timestamp).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
              <Descriptions.Item label={t('settings.auditLog.detail.operator')}>
                {selectedLog.operator}
              </Descriptions.Item>
              <Descriptions.Item label={t('settings.auditLog.detail.ipAddress')}>
                {selectedLog.ipAddress}
              </Descriptions.Item>
              <Descriptions.Item label={t('settings.auditLog.detail.action')}>
                <Tag color={actionColors[selectedLog.action]}>{selectedLog.actionLabel}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label={t('settings.auditLog.detail.module')}>
                {selectedLog.moduleLabel}
              </Descriptions.Item>
              <Descriptions.Item label={t('settings.auditLog.detail.target')} span={2}>
                {selectedLog.target}
              </Descriptions.Item>
            </Descriptions>

            {/* 变更详情 */}
            {selectedLog.changes && selectedLog.changes.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <Text strong style={{ display: 'block', marginBottom: 12 }}>
                  {t('settings.auditLog.detail.changes')}
                </Text>
                <div
                  style={{
                    border: `1px solid ${colors.border.default}`,
                    borderRadius: 6,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      backgroundColor: colors.background.default,
                      padding: '8px 12px',
                      borderBottom: `1px solid ${colors.border.default}`,
                    }}
                  >
                    <div style={{ flex: 1, fontWeight: 500, fontSize: 13 }}>
                      {t('settings.auditLog.detail.field')}
                    </div>
                    <div style={{ flex: 1, fontWeight: 500, fontSize: 13 }}>
                      {t('settings.auditLog.detail.oldValue')}
                    </div>
                    <div style={{ flex: 1, fontWeight: 500, fontSize: 13 }}>
                      {t('settings.auditLog.detail.newValue')}
                    </div>
                  </div>
                  {selectedLog.changes.map((change, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        padding: '8px 12px',
                        borderBottom: index < selectedLog.changes!.length - 1
                          ? `1px solid ${colors.border.light}`
                          : 'none',
                      }}
                    >
                      <div style={{ flex: 1, fontSize: 13 }}>{change.field}</div>
                      <div style={{ flex: 1, fontSize: 13, color: colors.text.secondary }}>
                        <Text delete type="secondary">{change.oldValue}</Text>
                      </div>
                      <div style={{ flex: 1, fontSize: 13, color: colors.success }}>
                        <Text type="success">{change.newValue}</Text>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AuditLog;