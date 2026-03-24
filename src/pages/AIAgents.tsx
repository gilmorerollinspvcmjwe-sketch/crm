/**
 * AI 智能体列表页面
 * 展示所有 AI Agent，支持筛选、查看详情
 */
import React, { useState } from 'react';
import {
  Card,
  Typography,
  Space,
  Tag,
  Row,
  Col,
  Badge,
  Progress,
  Button,
  Input,
  Select,
  Statistic,
  Divider,
  Avatar,
} from 'antd';
import {
  RobotOutlined,
  SearchOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  SettingOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AIAgent } from '../types/ai-agents';
import { aiAgents } from '../mock/aiAgentsData';

const { Title, Text } = Typography;
const { Option } = Select;

const AIAgents: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Agent 类型映射
  const typeMap: Record<string, { text: string; color: string }> = {
    predictive: { text: t('ai.agents.typePredictive'), color: 'blue' },
    generative: { text: t('ai.agents.typeGenerative'), color: 'purple' },
    analytical: { text: t('ai.agents.typeAnalytical'), color: 'cyan' },
    conversational: { text: t('ai.agents.typeConversational'), color: 'green' },
    automation: { text: t('ai.agents.typeAutomation'), color: 'orange' },
    recommendation: { text: t('ai.agents.typeRecommendation'), color: 'magenta' },
  };

  // Agent 状态映射
  const statusMap: Record<string, { text: string; icon: React.ReactNode; color: string }> = {
    active: { text: t('ai.agents.statusActive'), icon: <CheckCircleOutlined />, color: '#52c41a' },
    inactive: { text: t('ai.agents.statusInactive'), icon: <CloseCircleOutlined />, color: '#d9d9d9' },
    training: { text: t('ai.agents.statusTraining'), icon: <SyncOutlined spin />, color: '#1890ff' },
    error: { text: t('ai.agents.statusError'), icon: <CloseCircleOutlined />, color: '#ff4d4f' },
  };

  // 筛选 Agent
  const filteredAgents = aiAgents.filter((agent) => {
    const matchSearch = agent.name.toLowerCase().includes(searchText.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchText.toLowerCase());
    const matchType = typeFilter === 'all' || agent.type === typeFilter;
    const matchStatus = statusFilter === 'all' || agent.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  // 计算汇总统计
  const totalAgents = aiAgents.length;
  const activeAgents = aiAgents.filter(a => a.status === 'active').length;
  const avgSuccessRate = aiAgents.reduce((sum, a) => sum + a.metrics.successRate, 0) / totalAgents;
  const totalExecutions = aiAgents.reduce((sum, a) => sum + a.metrics.totalExecutions, 0);

  // 查看详情
  const handleViewDetail = (agentId: string) => {
    navigate(`/ai/agents/${agentId}`);
  };

  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh' }}>
      {/* 页面头部 */}
      <div style={{ background: '#fff', padding: '16px 24px', marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0 }}>
          <RobotOutlined /> {t('ai.agents.title')}
        </Title>
        <Text type="secondary">
          {t('ai.agents.subtitle')}
        </Text>
      </div>

      {/* 核心指标卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('ai.agents.totalAgents')}
              value={totalAgents}
              suffix={t('ai.agents.count')}
              prefix={<RobotOutlined />}
            />
            <Divider style={{ margin: '12px 0' }} />
            <Text type="secondary">{t('ai.agents.totalAgentsDesc')}</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('ai.agents.activeAgents')}
              value={activeAgents}
              suffix={`/${totalAgents}`}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
            <Divider style={{ margin: '12px 0' }} />
            <Text type="secondary">{t('ai.agents.activeAgentsDesc')}</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('ai.agents.avgSuccessRate')}
              value={avgSuccessRate.toFixed(1)}
              suffix={t('common.unit.percent')}
              prefix={<TrophyOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
            <Divider style={{ margin: '12px 0' }} />
            <Text type="secondary">{t('ai.agents.avgSuccessRateDesc')}</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('ai.agents.totalExecutions')}
              value={totalExecutions.toLocaleString()}
              prefix={<ThunderboltOutlined />}
            />
            <Divider style={{ margin: '12px 0' }} />
            <Text type="secondary">{t('ai.agents.totalExecutionsDesc')}</Text>
          </Card>
        </Col>
      </Row>

      {/* 筛选栏 */}
      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          <Input
            placeholder={t('ai.agents.searchPlaceholder')}
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
          <Select
            placeholder={t('ai.agents.filterType')}
            value={typeFilter}
            onChange={(value) => setTypeFilter(value)}
            style={{ width: 150 }}
            allowClear
          >
            <Option value="all">{t('ai.agents.allTypes')}</Option>
            <Option value="predictive">{t('ai.agents.typePredictive')}</Option>
            <Option value="generative">{t('ai.agents.typeGenerative')}</Option>
            <Option value="analytical">{t('ai.agents.typeAnalytical')}</Option>
            <Option value="conversational">{t('ai.agents.typeConversational')}</Option>
            <Option value="automation">{t('ai.agents.typeAutomation')}</Option>
            <Option value="recommendation">{t('ai.agents.typeRecommendation')}</Option>
          </Select>
          <Select
            placeholder={t('ai.agents.filterStatus')}
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
            style={{ width: 150 }}
            allowClear
          >
            <Option value="all">{t('ai.agents.allStatuses')}</Option>
            <Option value="active">{t('ai.agents.statusActive')}</Option>
            <Option value="inactive">{t('ai.agents.statusInactive')}</Option>
            <Option value="training">{t('ai.agents.statusTraining')}</Option>
            <Option value="error">{t('ai.agents.statusError')}</Option>
          </Select>
          <Text type="secondary">
            {t('ai.agents.totalMatching')} {filteredAgents.length} {t('ai.agents.agents')}
          </Text>
        </Space>
      </Card>

      {/* Agent 卡片列表 */}
      <Row gutter={16}>
        {filteredAgents.map((agent) => {
          const status = statusMap[agent.status];
          const type = typeMap[agent.type];
          const completedTasks = agent.metrics.tasksCompleted;
          const totalTasks = agent.metrics.totalExecutions;
          const successRate = agent.metrics.successRate;

          return (
            <Col span={8} key={agent.id}>
              <Card
                hoverable
                onClick={() => handleViewDetail(agent.id)}
                style={{ marginBottom: 16 }}
                actions={[
                  <Button
                    key="view"
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetail(agent.id);
                    }}
                  >
                    {t('ai.agents.details')}
                  </Button>,
                  <Button
                    key="settings"
                    type="link"
                    icon={<SettingOutlined />}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {t('ai.agents.config')}
                  </Button>,
                ]}
              >
                {/* 头部：头像 + 名称 + 状态 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Avatar
                      size={48}
                      style={{ 
                        backgroundColor: '#1890ff', 
                        fontSize: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {agent.avatar || <RobotOutlined />}
                    </Avatar>
                    <div>
                      <Title level={5} style={{ margin: 0 }}>{agent.name}</Title>
                      <Text type="secondary" style={{ fontSize: 12 }}>{agent.version}</Text>
                    </div>
                  </div>
                  <Badge
                    count={status.text}
                    style={{ backgroundColor: status.color }}
                  />
                </div>

                {/* 描述 */}
                <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 12 }}>
                  {agent.description}
                </Text>

                {/* 类型标签 */}
                <Tag color={type.color} style={{ marginBottom: 12 }}>
                  {type.text}
                </Tag>

                {/* 能力标签 */}
                <div style={{ marginBottom: 12 }}>
                  <Space wrap>
                    {agent.capabilities.slice(0, 3).map((cap) => (
                      <Tag key={cap.id} color="default" style={{ fontSize: 11 }}>
                        {cap.enabled ? '✓' : '○'} {cap.name}
                      </Tag>
                    ))}
                    {agent.capabilities.length > 3 && (
                      <Tag color="default">+{agent.capabilities.length - 3}</Tag>
                    )}
                  </Space>
                </div>

                <Divider style={{ margin: '12px 0' }} />

                {/* 核心指标 */}
                <Row gutter={8}>
                  <Col span={8}>
                    <div style={{ textAlign: 'center' }}>
                      <Text type="secondary" style={{ fontSize: 11 }}>{t('ai.agents.successRate')}</Text>
                      <br />
                      <Text strong style={{ color: successRate >= 95 ? '#52c41a' : successRate >= 90 ? '#1890ff' : '#faad14' }}>
                        {successRate}%
                      </Text>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{ textAlign: 'center' }}>
                      <Text type="secondary" style={{ fontSize: 11 }}>{t('ai.agents.responseTime')}</Text>
                      <br />
                      <Text strong>{(agent.metrics.avgResponseTime / 1000).toFixed(1)}s</Text>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{ textAlign: 'center' }}>
                      <Text type="secondary" style={{ fontSize: 11 }}>{t('ai.agents.satisfaction')}</Text>
                      <br />
                      <Text strong style={{ color: '#faad14' }}>
                        {'★'.repeat(Math.floor(agent.metrics.userSatisfaction))}
                        {'☆'.repeat(5 - Math.floor(agent.metrics.userSatisfaction))}
                      </Text>
                    </div>
                  </Col>
                </Row>

                {/* 任务进度 */}
                <div style={{ marginTop: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      <ClockCircleOutlined /> {t('ai.agents.taskCompleted')}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {completedTasks}/{totalTasks}
                    </Text>
                  </div>
                  <Progress
                    percent={(completedTasks / totalTasks) * 100}
                    size="small"
                    strokeColor={{
                      '0%': '#108ee9',
                      '100%': '#87d068',
                    }}
                    format={(percent: number) => `${percent.toFixed(0)}%`}
                  />
                </div>

                {/* 最后活跃时间 */}
                {agent.lastActiveAt && (
                  <div style={{ marginTop: 12, textAlign: 'right' }}>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      <ClockCircleOutlined /> {t('ai.agents.lastActive')}：{agent.lastActiveAt.split(' ')[1]}
                    </Text>
                  </div>
                )}
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* 空状态 */}
      {filteredAgents.length === 0 && (
        <Card style={{ textAlign: 'center', padding: '60px 0' }}>
          <RobotOutlined style={{ fontSize: 64, color: '#d9d9d9', marginBottom: 16 }} />
          <Title level={4}>{t('ai.agents.noMatching')}</Title>
          <Text type="secondary">{t('ai.agents.tryAdjust')}</Text>
        </Card>
      )}
    </div>
  );
};

export default AIAgents;