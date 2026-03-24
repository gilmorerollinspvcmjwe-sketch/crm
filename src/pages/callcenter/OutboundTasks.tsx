/**
 * 外呼任务页面 - 呼叫中心对接 Demo
 */
import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Tag, Progress, Modal, Form, Input, Select, message, Descriptions } from 'antd';
import { PlusOutlined, PhoneOutlined, PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { OutboundTask, OutboundTaskStatus, CallScript } from '../../types/callcenter';
import { getOutboundTaskList, updateOutboundTask, getCallScripts } from '../../services/callcenterService';

const { Option } = Select;

/**
 * 外呼任务页面组件
 */
export const OutboundTasks: React.FC = () => {
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
      console.error('加载任务失败:', error);
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
      console.error('加载脚本失败:', error);
    }
  };

  useEffect(() => {
    loadTasks();
    loadScripts();
  }, [page, pageSize]);

  /** 处理创建任务 */
  const handleCreate = async (values: any) => {
    message.success('外呼任务创建成功（模拟）');
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
      title: '任务名称',
      dataIndex: 'taskName',
      key: 'taskName',
      width: 200,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: OutboundTaskStatus) => (
        <Tag color={statusColorMap[status]}>{status}</Tag>
      ),
    },
    {
      title: '呼叫脚本',
      dataIndex: 'scriptName',
      key: 'scriptName',
      width: 150,
      render: (name?: string) => name || '-',
    },
    {
      title: '进度',
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
      title: '接通数',
      key: 'connected',
      width: 100,
      render: (_: any, record: OutboundTask) => (
        <Space>
          <Tag color="green">{record.connectedCount}</Tag>
          <span style={{ fontSize: 12, color: '#999' }}>
            未接:{record.noAnswerCount} 忙:{record.busyCount}
          </span>
        </Space>
      ),
    },
    {
      title: '负责人',
      dataIndex: 'assignedToName',
      key: 'assignedToName',
      width: 100,
      render: (name?: string) => name || '未分配',
    },
    {
      title: '计划时间',
      dataIndex: 'scheduledAt',
      key: 'scheduledAt',
      width: 160,
      render: (time?: string) => time || '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_: any, record: OutboundTask) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={record.status === OutboundTaskStatus.RUNNING ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
          >
            {record.status === OutboundTaskStatus.RUNNING ? '暂停' : '开始'}
          </Button>
          <Button type="link" size="small" onClick={() => handleViewDetail(record)}>
            详情
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
            <span style={{ color: '#666' }}>呼叫中心外呼任务管理</span>
          </Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateModalVisible(true)}>
            新建外呼任务
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
            showTotal: (total) => `共 ${total} 个任务`,
            onChange: (page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
            },
          }}
        />
      </Card>

      {/* 创建任务弹窗 */}
      <Modal
        title="新建外呼任务"
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            name="taskName"
            label="任务名称"
            rules={[{ required: true, message: '请输入任务名称' }]}
          >
            <Input placeholder="例如：3 月客户回访任务" />
          </Form.Item>

          <Form.Item
            name="scriptId"
            label="呼叫脚本"
            rules={[{ required: true, message: '请选择呼叫脚本' }]}
          >
            <Select placeholder="请选择脚本">
              {scripts.map(script => (
                <Option key={script.id} value={script.id}>
                  {script.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="totalNumbers"
            label="号码数量"
            rules={[{ required: true, message: '请输入号码数量' }]}
          >
            <Input type="number" placeholder="100" />
          </Form.Item>

          <Form.Item name="assignedTo" label="负责人">
            <Select placeholder="请选择负责人" allowClear>
              <Option value="USER004">王五</Option>
              <Option value="USER005">赵六</Option>
              <Option value="USER006">钱七</Option>
            </Select>
          </Form.Item>

          <Form.Item name="scheduledAt" label="计划执行时间">
            <Input type="datetime-local" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 任务详情弹窗 */}
      <Modal
        title="任务详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedTask && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="任务名称">{selectedTask.taskName}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={statusColorMap[selectedTask.status]}>{selectedTask.status}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="呼叫脚本">{selectedTask.scriptName || '-'}</Descriptions.Item>
            <Descriptions.Item label="负责人">{selectedTask.assignedToName || '未分配'}</Descriptions.Item>
            <Descriptions.Item label="总号码数">{selectedTask.totalNumbers}</Descriptions.Item>
            <Descriptions.Item label="已完成">{selectedTask.completedNumbers}</Descriptions.Item>
            <Descriptions.Item label="接通数">{selectedTask.connectedCount}</Descriptions.Item>
            <Descriptions.Item label="未接听">{selectedTask.noAnswerCount}</Descriptions.Item>
            <Descriptions.Item label="占线">{selectedTask.busyCount}</Descriptions.Item>
            <Descriptions.Item label="拒接">{selectedTask.rejectedCount}</Descriptions.Item>
            <Descriptions.Item label="计划时间">{selectedTask.scheduledAt || '-'}</Descriptions.Item>
            <Descriptions.Item label="开始时间">{selectedTask.startedAt || '-'}</Descriptions.Item>
            <Descriptions.Item label="完成时间">{selectedTask.completedAt || '-'}</Descriptions.Item>
            <Descriptions.Item label="创建人">{selectedTask.createdByName}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{selectedTask.createdAt}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default OutboundTasks;
