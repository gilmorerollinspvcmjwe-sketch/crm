/**
 * 外呼任务页面 - 呼叫中心对接 Demo
 */
import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Tag, Progress, Modal, Form, Input, Select, message, Descriptions } from 'antd';
import { PlusOutlined, PhoneOutlined, PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import { OutboundTask, OutboundTaskStatus, CallScript } from '../../types/callcenter';
import { getOutboundTaskList, updateOutboundTask, getCallScripts } from '../../services/callcenterService';

const { Option } = Select;

/**
 * 外呼任务页面组件
 */
export const OutboundTasks: React.FC = () => {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState<OutboundTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<OutboundTask | null>(null);
  const [scripts, setScripts] = useState<CallScript[]>([]);
  const [form] = Form.useForm();

  /** 加载外呼任务列表 */
  const loadTasks = async () => {
    setLoading(true);
    try {
      const result = await getOutboundTaskList({ page, pageSize });
      setTasks(result.list);
      setTotal(result.total);
    } catch (error) {
      console.error(t('integration.callcenter.loadFailed') + ':', error);
    } finally {
      setLoading(false);
    }
  };

  /** 加载呼叫脚本 */
  const loadScripts = async () => {
    try {
      const scripts = await getCallScripts();
      setScripts(scripts);
    } catch (error) {
      console.error(t('integration.callcenter.scriptLoadFailed') + ':', error);
    }
  };

  useEffect(() => {
    loadTasks();
    loadScripts();
  }, [page, pageSize]);

  /** 处理创建任务 */
  const handleCreate = async (values: any) => {
    message.success(t('integration.callcenter.taskCreated'));
    setCreateModalVisible(false);
    form.resetFields();
    loadTasks();
  };

  /** 查看任务详情 */
  const handleViewDetail = (task: OutboundTask) => {
    setSelectedTask(task);
    setDetailModalVisible(true);
  };

  /** 状态标签颜色 */
  const statusColorMap: Record<OutboundTaskStatus, string> = {
    [OutboundTaskStatus.PENDING]: 'default',
    [OutboundTaskStatus.RUNNING]: 'blue',
    [OutboundTaskStatus.PAUSED]: 'orange',
    [OutboundTaskStatus.COMPLETED]: 'green',
    [OutboundTaskStatus.CANCELLED]: 'red',
  };

  /** 表格列定义 */
  const columns: ColumnsType<OutboundTask> = [
    {
      title: t('integration.callcenter.columnName'),
      dataIndex: 'taskName',
      key: 'taskName',
      width: 200,
    },
    {
      title: t('marketing.campaigns.columnStatus'),
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: OutboundTaskStatus) => (
        <Tag color={statusColorMap[status]}>{status}</Tag>
      ),
    },
    {
      title: t('integration.callcenter.columnScript'),
      dataIndex: 'scriptName',
      key: 'scriptName',
      width: 150,
      render: (name?: string) => name || '-',
    },
    {
      title: t('integration.callcenter.columnProgress'),
      key: 'progress',
      width: 200,
      render: (_: any, record: OutboundTask) => (
        <div style={{ width: 180 }}>
          <Progress
            percent={Math.round((record.completedNumbers / record.totalNumbers) * 100)}
            format={() => `${record.completedNumbers}/${record.totalNumbers}`}
          />
        </div>
      ),
    },
    {
      title: t('integration.callcenter.columnConnected'),
      key: 'connected',
      width: 100,
      render: (_: any, record: OutboundTask) => (
        <Space>
          <Tag color="green">{record.connectedCount}</Tag>
          <span style={{ fontSize: 12, color: '#999' }}>
            {t('integration.callcenter.noAnswerCount')}:{record.noAnswerCount} {t('integration.callcenter.busyCount')}:{record.busyCount}
          </span>
        </Space>
      ),
    },
    {
      title: t('integration.callcenter.columnAssignee'),
      dataIndex: 'assignedToName',
      key: 'assignedToName',
      width: 100,
      render: (name?: string) => name || t('integration.callcenter.unassigned'),
    },
    {
      title: t('integration.callcenter.columnScheduledTime'),
      dataIndex: 'scheduledAt',
      key: 'scheduledAt',
      width: 160,
      render: (time?: string) => time || '-',
    },
    {
      title: t('common.edit'),
      key: 'action',
      width: 180,
      render: (_: any, record: OutboundTask) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={record.status === OutboundTaskStatus.RUNNING ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
          >
            {record.status === OutboundTaskStatus.RUNNING ? t('integration.callcenter.pause') : t('integration.callcenter.start')}
          </Button>
          <Button type="link" size="small" onClick={() => handleViewDetail(record)}>
            {t('integration.callcenter.viewDetail')}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card>
        {/* 顶部操作栏 */}
        <Space style={{ marginBottom: 16, width: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <span style={{ color: '#666' }}>{t('integration.callcenter.title')}</span>
          </Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateModalVisible(true)}>
            {t('integration.callcenter.newTask')}
          </Button>
        </Space>

        {/* 任务表格 */}
        <Table
          columns={columns}
          dataSource={tasks}
          rowKey="id"
          loading={loading}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            showTotal: (total) => `${t('common.total')} ${total} ${t('marketing.campaigns.unit')}`,
            onChange: (page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
            },
          }}
        />
      </Card>

      {/* 创建任务弹窗 */}
      <Modal
        title={t('integration.callcenter.newTask')}
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            name="taskName"
            label={t('integration.callcenter.taskName')}
            rules={[{ required: true, message: t('integration.callcenter.enterTaskName') }]}
          >
            <Input placeholder={t('integration.callcenter.enterTaskName')} />
          </Form.Item>

          <Form.Item
            name="scriptId"
            label={t('integration.callcenter.callScript')}
            rules={[{ required: true, message: t('integration.callcenter.selectScript') }]}
          >
            <Select placeholder={t('integration.callcenter.selectScript')}>
              {scripts.map(script => (
                <Option key={script.id} value={script.id}>
                  {script.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="totalNumbers"
            label={t('integration.callcenter.totalNumbers')}
            rules={[{ required: true, message: t('integration.callcenter.enterNumberCount') }]}
          >
            <Input type="number" placeholder="100" />
          </Form.Item>

          <Form.Item name="assignedTo" label={t('integration.callcenter.columnAssignee')}>
            <Select placeholder={t('integration.callcenter.selectAssignee')} allowClear>
              <Option value="USER004">王五</Option>
              <Option value="USER005">赵六</Option>
              <Option value="USER006">钱七</Option>
            </Select>
          </Form.Item>

          <Form.Item name="scheduledAt" label={t('integration.callcenter.scheduledAt')}>
            <Input type="datetime-local" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 任务详情弹窗 */}
      <Modal
        title={t('integration.callcenter.taskDetail')}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedTask && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label={t('integration.callcenter.taskName')}>{selectedTask.taskName}</Descriptions.Item>
            <Descriptions.Item label={t('marketing.campaigns.columnStatus')}>
              <Tag color={statusColorMap[selectedTask.status]}>{selectedTask.status}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label={t('integration.callcenter.callScript')}>{selectedTask.scriptName || '-'}</Descriptions.Item>
            <Descriptions.Item label={t('integration.callcenter.columnAssignee')}>{selectedTask.assignedToName || t('integration.callcenter.unassigned')}</Descriptions.Item>
            <Descriptions.Item label={t('integration.callcenter.totalNumbers')}>{selectedTask.totalNumbers}</Descriptions.Item>
            <Descriptions.Item label={t('integration.callcenter.completedNumbers')}>{selectedTask.completedNumbers}</Descriptions.Item>
            <Descriptions.Item label={t('integration.callcenter.connectedCount')}>{selectedTask.connectedCount}</Descriptions.Item>
            <Descriptions.Item label={t('integration.callcenter.noAnswerCount')}>{selectedTask.noAnswerCount}</Descriptions.Item>
            <Descriptions.Item label={t('integration.callcenter.busyCount')}>{selectedTask.busyCount}</Descriptions.Item>
            <Descriptions.Item label={t('integration.callcenter.rejectedCount')}>{selectedTask.rejectedCount}</Descriptions.Item>
            <Descriptions.Item label={t('integration.callcenter.scheduledAt')}>{selectedTask.scheduledAt || '-'}</Descriptions.Item>
            <Descriptions.Item label={t('integration.callcenter.startedAt')}>{selectedTask.startedAt || '-'}</Descriptions.Item>
            <Descriptions.Item label={t('integration.callcenter.completedAt')}>{selectedTask.completedAt || '-'}</Descriptions.Item>
            <Descriptions.Item label={t('integration.callcenter.creator')}>{selectedTask.createdByName}</Descriptions.Item>
            <Descriptions.Item label={t('integration.callcenter.createdTime')}>{selectedTask.createdAt}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default OutboundTasks;