/**
 * Agent 详情页面
 * 展示单个 AI Agent 的详细信息、执行日志、效果统计
 */
import React, { useState, useMemo } from 'react';
import {
  Card,
  Typography,
  Space,
  Tag,
  Row,
  Col,
  Badge,
  Button,
  Table,
  Tabs,
  Statistic,
  Progress,
  Divider,
  Avatar,
  Timeline,
  Tooltip,
  Descriptions,
} from 'antd';
import {
  RobotOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SettingOutlined,
  FileTextOutlined,
  BarChartOutlined,
  InfoCircleOutlined,
  ArrowLeftOutlined,
  DownloadOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { AIAgent, AgentExecutionLog, AgentDetailStats } from '../types/ai-agents';
import { getAgentDetailStats, aiAgents } from '../mock/aiAgentsData';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const AgentDetail: React.FC = () => {
  const navigate = useNavigate();
  const { agentId } = useParams<{ agentId: string }>();
  
  // 获取 Agent 详情数据
  const stats: AgentDetailStats | undefined = useMemo(() => {
    return agentId ? getAgentDetailStats(agentId) : undefined;
  }, [agentId]);

  const [activeTab, setActiveTab] = useState('overview');

  // Agent 类型映射
  const typeMap: Record<string, { text: string; color: string }> = {
    predictive: { text: '预测型', color: 'blue' },
    generative: { text: '生成型', color: 'purple' },
    analytical: { text: '分析型', color: 'cyan' },
    conversational: { text: '对话型', color: 'green' },
    automation: { text: '自动化', color: 'orange' },
    recommendation: { text: '推荐型', color: 'magenta' },
  };

  // Agent 状态映射
  const statusMap: Record<string, { text: string; color: string }> = {
    active: { text: '运行中', color: '#52c41a' },
    inactive: { text: '已停用', color: '#d9d9d9' },
    training: { text: '训练中', color: '#1890ff' },
    error: { text: '异常', color: '#ff4d4f' },
  };

  // 执行日志表格列
  const logColumns = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 160,
      render: (text: string) => <Text type="secondary">{text}</Text>,
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 180,
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: '输入',
      dataIndex: 'input',
      key: 'input',
      ellipsis: { showTitle: false },
      render: (text: string) => (
        <Tooltip title={text}>
          <Text type="secondary" style={{ fontSize: 12 }}>{text}</Text>
        </Tooltip>
      ),
    },
    {
      title: '输出',
      dataIndex: 'output',
      key: 'output',
      ellipsis: { showTitle: false },
      render: (text: string) => (
        <Tooltip title={text}>
          <Text style={{ fontSize: 12 }}>{text}</Text>
        </Tooltip>
      ),
    },
    {
      title: '耗时',
      dataIndex: 'duration',
      key: 'duration',
      width: 100,
      render: (ms: number) => `${ms}ms`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string, record: AgentExecutionLog) => (
        <Badge
          count={status === 'success' ? '成功' : status === 'failed' ? '失败' : '超时'}
          style={{ 
            backgroundColor: status === 'success' ? '#52c41a' : status === 'failed' ? '#ff4d4f' : '#faad14' 
          }}
        />
      ),
    },
    {
      title: '置信度',
      dataIndex: 'confidence',
      key: 'confidence',
      width: 100,
      render: (confidence?: number) => confidence ? `${(confidence * 100).toFixed(0)}%` : '-',
    },
  ];

  if (!stats) {
    return (
      <div style={{ padding: 48, textAlign: 'center' }}>
        <RobotOutlined style={{ fontSize: 64, color: '#d9d9d9', marginBottom: 16 }} />
        <Title level={4}>未找到该 AI Agent</Title>
        <Button type="primary" onClick={() => navigate('/ai/agents')}>
          返回列表
        </Button>
      </div>
    );
  }

  const { basicInfo, executionLogs, metrics, trends, accuracy } = stats;
  const type = typeMap[basicInfo.type];
  const status = statusMap[basicInfo.status];

  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh' }}>
      {/* 页面头部 */}
      <div style={{ background: '#fff', padding: '16px 24px', marginBottom: 16 }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/ai/agents')}>
            返回
          </Button>
          <Title level={2} style={{ margin: 0 }}>
            {basicInfo.avatar || <RobotOutlined />} {basicInfo.name}
          </Title>
          <Badge count={status.text} style={{ backgroundColor: status.color }} />
          <Tag color={type.color}>{type.text}</Tag>
        </Space>
        <Text type="secondary">{basicInfo.description}</Text>
      </div>

      {/* 核心指标 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={4}>
          <Card>
            <Statistic
              title="总执行次数"
              value={metrics.totalExecutions}
              prefix={<ThunderboltOutlined />}
              suffix="次"
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="成功率"
              value={metrics.successRate}
              suffix="%"
              valueStyle={{ color: metrics.successRate >= 95 ? '#52c41a' : '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="平均响应"
              value={(metrics.avgResponseTime / 1000).toFixed(2)}
              suffix="秒"
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="准确率"
              value={metrics.accuracyRate}
              suffix="%"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="满意度"
              value={metrics.userSatisfaction}
              suffix="/5.0"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="错误次数"
              value={metrics.errorsCount}
              valueStyle={{ color: metrics.errorsCount < 100 ? '#52c41a' : '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 详情标签页 */}
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        {/* 概览 */}
        <TabPane
          tab={
            <span>
              <InfoCircleOutlined />
              概览
            </span>
          }
          key="overview"
        >
          <Row gutter={16}>
            <Col span={16}>
              <Card title="基本信息" style={{ marginBottom: 16 }}>
                <Descriptions column={2}>
                  <Descriptions.Item label="Agent ID">{basicInfo.id}</Descriptions.Item>
                  <Descriptions.Item label="版本">{basicInfo.version}</Descriptions.Item>
                  <Descriptions.Item label="使用模型">{basicInfo.config.model}</Descriptions.Item>
                  <Descriptions.Item label="创建时间">{basicInfo.createdAt}</Descriptions.Item>
                  <Descriptions.Item label="更新时间">{basicInfo.updatedAt}</Descriptions.Item>
                  <Descriptions.Item label="最后活跃">{basicInfo.lastActiveAt || '-'}</Descriptions.Item>
                  <Descriptions.Item label="公开范围">
                    {basicInfo.isPublic ? '所有人可见' : '仅指定用户'}
                  </Descriptions.Item>
                  <Descriptions.Item label="允许用户">
                    {basicInfo.allowedUsers.join(', ')}
                  </Descriptions.Item>
                </Descriptions>
              </Card>

              <Card title="配置参数" style={{ marginBottom: 16 }}>
                <Descriptions column={2}>
                  <Descriptions.Item label="Temperature">{basicInfo.config.temperature}</Descriptions.Item>
                  <Descriptions.Item label="Max Tokens">{basicInfo.config.maxTokens}</Descriptions.Item>
                  <Descriptions.Item label="Top P">{basicInfo.config.topP}</Descriptions.Item>
                  <Descriptions.Item label="Frequency Penalty">{basicInfo.config.frequencyPenalty}</Descriptions.Item>
                  <Descriptions.Item label="Presence Penalty">{basicInfo.config.presencePenalty}</Descriptions.Item>
                </Descriptions>
                {basicInfo.config.customInstructions && (
                  <>
                    <Divider>自定义指令</Divider>
                    <Paragraph style={{ background: '#f5f5f5', padding: 12, borderRadius: 4 }}>
                      {basicInfo.config.customInstructions}
                    </Paragraph>
                  </>
                )}
              </Card>

              <Card title="能力列表" style={{ marginBottom: 16 }}>
                <Space wrap>
                  {basicInfo.capabilities.map((cap) => (
                    <Tag
                      key={cap.id}
                      color={cap.enabled ? 'green' : 'default'}
                      icon={cap.enabled ? <CheckCircleOutlined /> : undefined}
                      style={{ fontSize: 13, padding: '4px 12px' }}
                    >
                      {cap.name}
                    </Tag>
                  ))}
                </Space>
                <Divider />
                {basicInfo.capabilities.map((cap) => (
                  <div key={cap.id} style={{ marginBottom: 8 }}>
                    <Text strong>{cap.name}</Text>
                    <br />
                    <Text type="secondary">{cap.description}</Text>
                  </div>
                ))}
              </Card>
            </Col>

            <Col span={8}>
              <Card title="触发条件" style={{ marginBottom: 16 }}>
                <Timeline
                  items={basicInfo.triggers.map((trigger, idx) => ({
                    key: idx,
                    children: trigger,
                    color: 'blue',
                  }))}
                />
              </Card>

              <Card title="关联数据模型">
                <Space wrap>
                  {basicInfo.relatedModels.map((model) => (
                    <Tag key={model} color="geekblue">
                      {model}
                    </Tag>
                  ))}
                </Space>
              </Card>
            </Col>
          </Row>
        </TabPane>

        {/* 执行日志 */}
        <TabPane
          tab={
            <span>
              <FileTextOutlined />
              执行日志
              <Badge count={executionLogs.length} style={{ marginLeft: 8 }} />
            </span>
          }
          key="logs"
        >
          <Card>
            <Table
              columns={logColumns}
              dataSource={executionLogs}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              size="middle"
            />
          </Card>
        </TabPane>

        {/* 效果统计 */}
        <TabPane
          tab={
            <span>
              <BarChartOutlined />
              效果统计
            </span>
          }
          key="metrics"
        >
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={12}>
              <Card title="近 7 天执行趋势">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={metrics.last7Days}>
                    <defs>
                      <linearGradient id="colorExec" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1890ff" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#1890ff" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="executions"
                      name="执行次数"
                      stroke="#1890ff"
                      fillOpacity={1}
                      fill="url(#colorExec)"
                    />
                    <Line
                      type="monotone"
                      dataKey="successRate"
                      name="成功率"
                      stroke="#52c41a"
                      yAxisId={1}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="预测准确率对比">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={accuracy}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="metric" tick={{ fontSize: 11 }} interval={0} />
                    <YAxis domain={[0, 100]} />
                    <RechartsTooltip formatter={(value: number) => [value + '%', '准确率']} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="accuracy"
                      name="准确率"
                      stroke="#1890ff"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>

          <Card title="详细指标">
            <Row gutter={16}>
              {accuracy.map((acc) => (
                <Col span={8} key={acc.metric}>
                  <Card size="small" style={{ marginBottom: 16 }}>
                    <Title level={5} style={{ marginBottom: 12 }}>{acc.metric}</Title>
                    <div style={{ marginBottom: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <Text type="secondary">准确率</Text>
                        <Text strong style={{ color: acc.accuracy >= 90 ? '#52c41a' : '#1890ff' }}>
                          {acc.accuracy}%
                        </Text>
                      </div>
                      <Progress percent={acc.accuracy} size="small" />
                    </div>
                    <Divider style={{ margin: '8px 0' }} />
                    <div style={{ fontSize: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <Text type="secondary">总预测</Text>
                        <Text>{acc.totalPredictions}次</Text>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <Text type="secondary">正确预测</Text>
                        <Text type="success">{acc.correctPredictions}次</Text>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <Text type="secondary">MAE</Text>
                        <Text>{acc.meanAbsoluteError}%</Text>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text type="secondary">RMSE</Text>
                        <Text>{acc.rootMeanSquareError}%</Text>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default AgentDetail;
