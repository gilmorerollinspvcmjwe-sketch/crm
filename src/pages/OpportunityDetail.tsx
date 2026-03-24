import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Tag, Space, Button, Typography, Timeline, Divider, Modal, message, Table, Tabs, Progress, Steps } from 'antd';
import { ArrowLeftOutlined, EditOutlined, ThunderboltOutlined, DeleteOutlined, PlusOutlined, TrophyOutlined, BulbOutlined } from '@ant-design/icons';
import { Opportunity, OpportunityStage, Competitor } from '../types/opportunity';
import { opportunityData } from '../mock/opportunityData';
import { activityData } from '../mock/activityData';
import { ActivityType } from '../types/activity';

const { Title, Text, Paragraph } = Typography;
// Descriptions.Meta 在较新版本的 antd 中已移除，使用 Descriptions.Item 替代

// 阶段颜色配置
const STAGE_COLORS: Record<OpportunityStage, string> = {
  [OpportunityStage.LEAD_CONFIRMATION]: 'default',
  [OpportunityStage.INITIAL_CONTACT]: 'blue',
  [OpportunityStage.REQUIREMENT_CONFIRMATION]: 'cyan',
  [OpportunityStage.PROPOSAL_QUOTATION]: 'geekblue',
  [OpportunityStage.NEGOTIATION_APPROVAL]: 'orange',
  [OpportunityStage.CLOSED_WON]: 'green',
  [OpportunityStage.CLOSED_LOST]: 'red'
};

// 阶段顺序映射
const STAGE_ORDER: OpportunityStage[] = [
  OpportunityStage.LEAD_CONFIRMATION,
  OpportunityStage.INITIAL_CONTACT,
  OpportunityStage.REQUIREMENT_CONFIRMATION,
  OpportunityStage.PROPOSAL_QUOTATION,
  OpportunityStage.NEGOTIATION_APPROVAL,
  OpportunityStage.CLOSED_WON,
];

// 阶段中文名称
const STAGE_LABELS: Record<OpportunityStage, string> = {
  [OpportunityStage.LEAD_CONFIRMATION]: '线索确认',
  [OpportunityStage.INITIAL_CONTACT]: '初步接触',
  [OpportunityStage.REQUIREMENT_CONFIRMATION]: '需求确认',
  [OpportunityStage.PROPOSAL_QUOTATION]: '方案报价',
  [OpportunityStage.NEGOTIATION_APPROVAL]: '谈判审批',
  [OpportunityStage.CLOSED_WON]: '赢单',
  [OpportunityStage.CLOSED_LOST]: '输单',
};

/**
 * 商机详情页
 * 功能：
 * - 基本信息展示
 * - 竞争对手列表
 * - 跟进记录时间线
 * - 操作按钮：编辑、变更阶段、删除
 */
export const OpportunityDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // 查找商机数据
  const opportunity = useMemo(() => {
    return opportunityData.find(opp => opp.id === id);
  }, [id]);

  // 查找相关跟进记录
  const relatedActivities = useMemo(() => {
    if (!opportunity) return [];
    return activityData.filter(activity => activity.opportunityId === id);
  }, [id, opportunity]);

  // 格式化金额
  const formatAmount = (amount: number) => {
    return `¥${(amount / 10000).toFixed(1)}万`;
  };

  // 格式化日期
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN');
  };

  // 处理返回
  const handleBack = () => {
    navigate('/opportunity/list');
  };

  // 处理编辑
  const handleEdit = () => {
    message.info(`编辑商机：${id}`);
    // TODO: 打开编辑表单
  };

  // 处理变更阶段
  const handleChangeStage = () => {
    message.info(`变更阶段：${id}`);
    // TODO: 打开阶段变更弹窗
  };

  // 处理删除
  const handleDelete = () => {
    Modal.confirm({
      title: '确定要删除这个商机吗？',
      content: '删除后无法恢复',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        message.success('删除成功');
        // TODO: 调用删除 API
      }
    });
  };

  // 如果没有找到商机
  if (!opportunity) {
    return (
      <div style={{ padding: 24 }}>
        <Card>
          <Title level={3}>商机不存在</Title>
          <Button onClick={handleBack} icon={<ArrowLeftOutlined />}>
            返回
          </Button>
        </Card>
      </div>
    );
  }

  // 跟进记录表格列
  const activityColumns = [
    {
      title: '跟进时间',
      dataIndex: 'activityTime',
      key: 'activityTime',
      width: 160,
      render: (time: string) => new Date(time).toLocaleString('zh-CN')
    },
    {
      title: '跟进类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: ActivityType) => <Tag>{type}</Tag>
    },
    {
      title: '跟进内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      render: (content: string) => {
        const text = content.replace(/<[^>]*>/g, '');
        return text.length > 100 ? text.substring(0, 100) + '...' : text;
      }
    },
    {
      title: '跟进人',
      dataIndex: 'createdByName',
      key: 'createdByName',
      width: 100
    }
  ];

  // 计算当前阶段索引
  const currentStageIndex = STAGE_ORDER.indexOf(opportunity.stage);

  // 阶段步骤项
  const stageSteps = STAGE_ORDER.map((stage, index) => ({
    key: index,
    title: STAGE_LABELS[stage],
    icon: index <= currentStageIndex ? <TrophyOutlined /> : undefined,
    status: (index < currentStageIndex ? 'finish' : index === currentStageIndex ? 'process' : 'wait') as 'finish' | 'process' | 'wait',
  }));

  return (
    <div style={{ padding: 24 }}>
      {/* 头部操作区 */}
      <Card style={{ marginBottom: 16 }}>
        <Space style={{ justifyContent: 'space-between', width: '100%', display: 'flex' }}>
          <Space>
            <Button onClick={handleBack} icon={<ArrowLeftOutlined />}>
              返回
            </Button>
            <div>
              <Title level={3} style={{ margin: 0 }}>{opportunity.name}</Title>
              <Text type="secondary" style={{ marginLeft: 16 }}>💼 {opportunity.customerName}</Text>
            </div>
          </Space>
          <Space>
            <Button icon={<EditOutlined />} onClick={handleEdit}>
              编辑
            </Button>
            <Button icon={<ThunderboltOutlined />} onClick={handleChangeStage}>
              变更阶段
            </Button>
            <Button danger icon={<DeleteOutlined />} onClick={handleDelete}>
              删除
            </Button>
          </Space>
        </Space>
      </Card>

      {/* 商机头信息卡片 */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 16, marginBottom: 8 }}>
              <Tag color={STAGE_COLORS[opportunity.stage]} style={{ fontSize: 14 }}>
                🏆 {STAGE_LABELS[opportunity.stage]}
              </Tag>
            </div>
            <div style={{ color: '#666', fontSize: 14 }}>
              <span>商机编号：{opportunity.id}</span>
              <span style={{ margin: '0 16px' }}>|</span>
              <span>金额：<Text strong style={{ color: '#faad14' }}>{formatAmount(opportunity.amount)}</Text></span>
              <span style={{ margin: '0 16px' }}>|</span>
              <span>预计成交：{formatDate(opportunity.estimatedCloseDate)}</span>
              <span style={{ margin: '0 16px' }}>|</span>
              <span>负责人：{opportunity.ownerName}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* 阶段进度条 + AI 预测分析 */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 16 }}>
        <Card title="📊 阶段进度">
          <Steps
            current={currentStageIndex}
            items={stageSteps}
            size="small"
            style={{ marginBottom: 16 }}
          />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {STAGE_ORDER.map((stage, index) => (
              <Button
                key={stage}
                size="small"
                type={index <= currentStageIndex ? 'primary' : 'default'}
                onClick={() => index <= currentStageIndex && message.info(`切换到阶段：${STAGE_LABELS[stage]}`)}
                disabled={index > currentStageIndex}
              >
                {STAGE_LABELS[stage]}
              </Button>
            ))}
          </div>
        </Card>

        <Card title="🤖 预测分析">
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>赢单概率</div>
            <Progress
              percent={opportunity.probability}
              strokeColor={
                opportunity.probability >= 80 ? '#52c41a' :
                opportunity.probability >= 50 ? '#faad14' : '#ff4d4f'
              }
              format={(percent) => `${percent}%`}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>预计成交日期</div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>{formatDate(opportunity.estimatedCloseDate)}</div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>
              <BulbOutlined style={{ marginRight: 4 }} />
              推荐动作
            </div>
            <div style={{ fontSize: 14, color: '#1890ff' }}>
              {opportunity.probability >= 80 ? '安排商务谈判，准备合同' :
               opportunity.probability >= 50 ? '安排产品演示，解决客户疑虑' :
               '深入了解客户需求，建立信任'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>趋势分析</div>
            <div style={{ fontSize: 14 }}>
              本周跟进 <Text strong>2</Text> 次，客户意向度 <Text strong type="success">上升</Text>
            </div>
          </div>
        </Card>
      </div>

      {/* Tab 区域 */}
      <Card>
        <Tabs
          items={[
            {
              key: 'basic',
              label: '基本信息',
              children: (
                <Descriptions column={3} bordered>
                  <Descriptions.Item label="商机名称">{opportunity.name}</Descriptions.Item>
                  <Descriptions.Item label="所属客户">{opportunity.customerName}</Descriptions.Item>
                  <Descriptions.Item label="商机金额">
                    <Text strong style={{ color: '#faad14' }}>{formatAmount(opportunity.amount)}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="商机来源">{opportunity.source}</Descriptions.Item>
                  <Descriptions.Item label="负责人">{opportunity.ownerName}</Descriptions.Item>
                  <Descriptions.Item label="状态">
                    <Tag>{opportunity.status}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="预算情况">{opportunity.budget}</Descriptions.Item>
                  <Descriptions.Item label="创建时间">{formatDate(opportunity.createdAt)}</Descriptions.Item>
                  <Descriptions.Item label="最后更新">{formatDate(opportunity.updatedAt)}</Descriptions.Item>
                  <Descriptions.Item label="下次跟进" span={3}>
                    {opportunity.nextFollowupTime ? formatDate(opportunity.nextFollowupTime) : '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="客户需求" span={3}>
                    <Paragraph style={{ marginBottom: 0 }}>{opportunity.description}</Paragraph>
                  </Descriptions.Item>
                  <Descriptions.Item label="决策流程" span={3}>
                    <Paragraph style={{ marginBottom: 0 }}>{opportunity.decisionProcess}</Paragraph>
                  </Descriptions.Item>
                </Descriptions>
              ),
            },
            {
              key: 'competitors',
              label: `竞争对手 (${opportunity.competitors.length})`,
              children: opportunity.competitors.length > 0 ? (
                <Table
                  dataSource={opportunity.competitors}
                  rowKey="id"
                  pagination={false}
                  size="small"
                  columns={[
                    {
                      title: '竞争对手',
                      dataIndex: 'name',
                      key: 'name',
                      width: 200,
                      render: (name: string) => <Text strong>{name}</Text>
                    },
                    {
                      title: '产品/方案',
                      dataIndex: 'product',
                      key: 'product',
                      width: 150,
                    },
                    {
                      title: '竞争优势',
                      dataIndex: 'advantage',
                      key: 'advantage',
                      render: (text: string) => <Text type="success">{text}</Text>
                    },
                    {
                      title: '竞争劣势',
                      dataIndex: 'disadvantage',
                      key: 'disadvantage',
                      render: (text: string) => <Text type="danger">{text}</Text>
                    },
                    {
                      title: '我方对策',
                      dataIndex: 'strategy',
                      key: 'strategy',
                      render: (text: string) => text || '-',
                    },
                  ]}
                />
              ) : (
                <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>
                  <Button type="primary" icon={<PlusOutlined />}>+ 添加竞争对手</Button>
                </div>
              ),
            },
            {
              key: 'followups',
              label: `跟进记录 (${relatedActivities.length})`,
              children: relatedActivities.length > 0 ? (
                <Table
                  columns={activityColumns}
                  dataSource={relatedActivities}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                  size="middle"
                />
              ) : (
                <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>
                  <Button type="primary" icon={<PlusOutlined />}>+ 新建跟进</Button>
                </div>
              ),
            },
            {
              key: 'quotes',
              label: '报价记录',
              children: <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>暂无报价记录</div>,
            },
            {
              key: 'contracts',
              label: '关联合同',
              children: <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>暂无关联合同</div>,
            },
            {
              key: 'logs',
              label: '操作日志',
              children: (
                <Timeline
                  items={[
                    {
                      color: 'blue',
                      children: (
                        <div>
                          <p>李四 修改了商机信息</p>
                          <p style={{ fontSize: 12, color: '#999' }}>2026-03-15 10:30</p>
                        </div>
                      ),
                    },
                    {
                      color: 'green',
                      children: (
                        <div>
                          <p>系统 自动创建商机</p>
                          <p style={{ fontSize: 12, color: '#999' }}>2026-03-01 09:00</p>
                        </div>
                      ),
                    },
                  ]}
                />
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default OpportunityDetail;
