/**
 * 工作流执行日志
 * Workflow Execution Logs
 */
import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Table,
  Tag,
  Typography,
  Button,
  Space,
  Tooltip,
  Drawer,
  Timeline,
  Empty,
  Badge,
  Descriptions,
  Divider,
  Statistic,
  Row,
  Col,
  Select,
  DatePicker,
} from 'antd';
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  EyeOutlined,
  CalendarOutlined,
  UserOutlined,
  FileTextOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useWorkflowsStore } from '../../store/workflows';
import { WorkflowExecutionLog, NodeExecutionLog, NodeType } from '../../types/workflow';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;

// 节点执行状态图标
const nodeStatusIcon: Record<string, React.ReactNode> = {
  success: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
  failed: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
  skipped: <ClockCircleOutlined style={{ color: '#8c8c8c' }} />,
};

// 节点类型颜色
const nodeTypeColor: Record<NodeType, string> = {
  trigger: 'green',
  condition: 'orange',
  action: 'blue',
  delay: 'default',
};

const WorkflowLogs: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { workflowId } = useParams<{ workflowId: string }>();
  
  const { getWorkflowById, getExecutionLogs } = useWorkflowsStore();
  
  // 筛选状态
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [selectedLog, setSelectedLog] = useState<WorkflowExecutionLog | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // 获取工作流信息
  const workflow = useMemo(() => {
    return workflowId ? getWorkflowById(workflowId) : null;
  }, [workflowId, getWorkflowById]);
  
  // 获取执行日志
  const logs = useMemo(() => {
    return workflowId ? getExecutionLogs(workflowId) : [];
  }, [workflowId, getExecutionLogs]);
  
  // 筛选后的日志
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      if (filterStatus !== 'all' && log.status !== filterStatus) return false;
      if (dateRange) {
        const logDate = dayjs(log.triggeredAt);
        if (logDate.isBefore(dateRange[0]) || logDate.isAfter(dateRange[1])) return false;
      }
      return true;
    });
  }, [logs, filterStatus, dateRange]);
  
  // 统计数据
  const stats = useMemo(() => {
    const success = filteredLogs.filter(l => l.status === 'success').length;
    const failed = filteredLogs.filter(l => l.status === 'failed').length;
    const avgDuration = filteredLogs.length > 0
      ? Math.round(filteredLogs.reduce((sum, l) => sum + (l.duration || 0), 0) / filteredLogs.length)
      : 0;
    return { success, failed, avgDuration, total: filteredLogs.length };
  }, [filteredLogs]);
  
  // 查看详情
  const handleViewDetail = (log: WorkflowExecutionLog) => {
    setSelectedLog(log);
    setDrawerOpen(true);
  };
  
  // 表格列定义
  const columns: ColumnsType<WorkflowExecutionLog> = [
    {
      title: t('workflow.logs.triggeredAt', 'Triggered At'),
      dataIndex: 'triggeredAt',
      key: 'triggeredAt',
      width: 180,
      render: (value: string) => (
        <Tooltip title={dayjs(value).format('YYYY-MM-DD HH:mm:ss')}>
          <Text>{dayjs(value).fromNow()}</Text>
        </Tooltip>
      ),
      sorter: (a, b) => new Date(a.triggeredAt).getTime() - new Date(b.triggeredAt).getTime(),
      defaultSortOrder: 'descend',
    },
    {
      title: t('workflow.logs.record', 'Triggered Record'),
      dataIndex: 'recordName',
      key: 'recordName',
      width: 200,
      render: (value: string, record) => (
        <Button type="link" style={{ padding: 0 }}>
          {value || record.recordId}
        </Button>
      ),
    },
    {
      title: t('workflow.logs.triggerType', 'Trigger Type'),
      dataIndex: 'triggerType',
      key: 'triggerType',
      width: 120,
      render: (value: string) => (
        <Tag>{value}</Tag>
      ),
    },
    {
      title: t('workflow.logs.status', 'Status'),
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const config: Record<string, { color: string; icon: React.ReactNode }> = {
          success: { color: 'success', icon: <CheckCircleOutlined /> },
          failed: { color: 'error', icon: <CloseCircleOutlined /> },
          running: { color: 'processing', icon: <SyncOutlined spin /> },
          pending: { color: 'default', icon: <ClockCircleOutlined /> },
        };
        const { color, icon } = config[status] || config.pending;
        return (
          <Tag icon={icon} color={color}>
            {t(`workflow.logs.status.${status}`, status)}
          </Tag>
        );
      },
      filters: [
        { text: t('workflow.logs.status.success', 'Success'), value: 'success' },
        { text: t('workflow.logs.status.failed', 'Failed'), value: 'failed' },
        { text: t('workflow.logs.status.running', 'Running'), value: 'running' },
        { text: t('workflow.logs.status.pending', 'Pending'), value: 'pending' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: t('workflow.logs.duration', 'Duration'),
      dataIndex: 'duration',
      key: 'duration',
      width: 100,
      render: (value: number) => {
        if (!value) return '-';
        if (value < 1000) return `${value}ms`;
        return `${(value / 1000).toFixed(1)}s`;
      },
      sorter: (a, b) => (a.duration || 0) - (b.duration || 0),
    },
    {
      title: t('workflow.logs.nodes', 'Nodes'),
      key: 'nodes',
      width: 120,
      render: (_, record) => {
        const success = record.nodeExecutions.filter(n => n.status === 'success').length;
        const failed = record.nodeExecutions.filter(n => n.status === 'failed').length;
        const skipped = record.nodeExecutions.filter(n => n.status === 'skipped').length;
        return (
          <Space size={4}>
            {success > 0 && <Tag color="success">{success}</Tag>}
            {failed > 0 && <Tag color="error">{failed}</Tag>}
            {skipped > 0 && <Tag>{skipped}</Tag>}
          </Space>
        );
      },
    },
    {
      title: t('common.actions', 'Actions'),
      key: 'actions',
      width: 80,
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
        >
          {t('common.details', 'Details')}
        </Button>
      ),
    },
  ];
  
  if (!workflow) {
    return (
      <Empty
        description={t('workflow.notFound', 'Workflow not found')}
        style={{ marginTop: 100 }}
      >
        <Button onClick={() => navigate(-1)}>
          {t('common.back', 'Back')}
        </Button>
      </Empty>
    );
  }
  
  return (
    <div style={{ padding: '0 0 24px 0' }}>
      {/* 页面头部 */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
              {t('common.back', 'Back')}
            </Button>
            <Divider type="vertical" />
            <Title level={4} style={{ margin: 0 }}>
              {workflow.name}
            </Title>
            <Tag color={workflow.status === 'active' ? 'success' : 'default'}>
              {t(`workflow.status.${workflow.status}`, workflow.status)}
            </Tag>
          </Space>
        </div>
      </Card>
      
      {/* 统计概览 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title={t('workflow.logs.totalRuns', 'Total Runs')}
              value={stats.total}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title={t('workflow.logs.successRate', 'Success Rate')}
              value={stats.total > 0 ? Math.round((stats.success / stats.total) * 100) : 0}
              suffix="%"
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title={t('workflow.logs.failedCount', 'Failed')}
              value={stats.failed}
              valueStyle={{ color: stats.failed > 0 ? '#ff4d4f' : '#52c41a' }}
              prefix={<CloseCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title={t('workflow.logs.avgDuration', 'Avg Duration')}
              value={stats.avgDuration < 1000 ? stats.avgDuration : (stats.avgDuration / 1000).toFixed(1)}
              suffix={stats.avgDuration < 1000 ? 'ms' : 's'}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>
      
      {/* 筛选工具栏 */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <Space size="middle">
          <Select
            value={filterStatus}
            onChange={setFilterStatus}
            style={{ width: 150 }}
            options={[
              { value: 'all', label: t('workflow.logs.allStatus', 'All Status') },
              { value: 'success', label: t('workflow.logs.status.success', 'Success') },
              { value: 'failed', label: t('workflow.logs.status.failed', 'Failed') },
              { value: 'running', label: t('workflow.logs.status.running', 'Running') },
            ]}
          />
          <RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs] | null)}
            placeholder={[t('workflow.logs.startDate', 'Start Date'), t('workflow.logs.endDate', 'End Date')]}
          />
        </Space>
      </Card>
      
      {/* 日志表格 */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredLogs}
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => t('workflow.logs.totalRecords', '{{total}} records', { total }),
          }}
        />
      </Card>
      
      {/* 详情抽屉 */}
      <Drawer
        title={t('workflow.logs.executionDetail', 'Execution Detail')}
        placement="right"
        width={600}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedLog(null);
        }}
      >
        {selectedLog && (
          <div>
            {/* 基本信息 */}
            <Descriptions column={2} size="small">
              <Descriptions.Item label={t('workflow.logs.status.label', 'Status')}>
                <Tag color={selectedLog.status === 'success' ? 'success' : 'error'}>
                  {selectedLog.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label={t('workflow.logs.duration.label', 'Duration')}>
                {selectedLog.duration ? `${selectedLog.duration}ms` : '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('workflow.logs.triggeredAt.label', 'Started')}>
                {dayjs(selectedLog.triggeredAt).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
              <Descriptions.Item label={t('workflow.logs.completedAt.label', 'Completed')}>
                {selectedLog.completedAt 
                  ? dayjs(selectedLog.completedAt).format('YYYY-MM-DD HH:mm:ss')
                  : '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('workflow.logs.record.label', 'Record')} span={2}>
                <Button type="link" style={{ padding: 0 }}>
                  {selectedLog.recordName || selectedLog.recordId}
                </Button>
              </Descriptions.Item>
            </Descriptions>
            
            {selectedLog.error && (
              <>
                <Divider />
                <Text type="danger">{selectedLog.error}</Text>
              </>
            )}
            
            <Divider>{t('workflow.logs.nodeTimeline', 'Node Execution Timeline')}</Divider>
            
            {/* 节点执行时间线 */}
            <Timeline
              items={selectedLog.nodeExecutions.map((node, index) => ({
                key: node.nodeId,
                color: node.status === 'success' ? 'green' : node.status === 'failed' ? 'red' : 'gray',
                dot: nodeStatusIcon[node.status],
                children: (
                  <div style={{ paddingBottom: 16 }}>
                    <div style={{ marginBottom: 4 }}>
                      <Tag color={nodeTypeColor[node.nodeType]}>
                        {t(`workflow.nodeTypes.${node.nodeType}`, node.nodeType)}
                      </Tag>
                      <Text strong style={{ marginLeft: 8 }}>{node.nodeName}</Text>
                    </div>
                    <Descriptions column={2} size="small">
                      <Descriptions.Item label={t('workflow.logs.node.status', 'Status')}>
                        <Tag color={node.status === 'success' ? 'success' : node.status === 'failed' ? 'error' : 'default'}>
                          {node.status}
                        </Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label={t('workflow.logs.node.duration', 'Duration')}>
                        {node.duration ? `${node.duration}ms` : '-'}
                      </Descriptions.Item>
                    </Descriptions>
                    {node.error && (
                      <Text type="danger" style={{ fontSize: 12 }}>
                        {node.error}
                      </Text>
                    )}
                    {node.output && Object.keys(node.output).length > 0 && (
                      <div style={{ marginTop: 8 }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>Output:</Text>
                        <pre style={{ 
                          fontSize: 11, 
                          background: '#f5f5f5', 
                          padding: 8, 
                          borderRadius: 4,
                          margin: '4px 0 0 0',
                          overflow: 'auto',
                        }}>
                          {JSON.stringify(node.output, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ),
              }))}
            />
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default WorkflowLogs;