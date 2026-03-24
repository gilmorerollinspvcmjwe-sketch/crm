import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Tag, Space, Button, Typography, Timeline, Divider, Modal, message, Table, Tabs, Progress, Steps } from 'antd';
import { ArrowLeftOutlined, EditOutlined, ThunderboltOutlined, DeleteOutlined, PlusOutlined, TrophyOutlined, BulbOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { Opportunity, OpportunityStage, Competitor } from '../types/opportunity';
import { opportunityData } from '../mock/opportunityData';
import { activityData } from '../mock/activityData';
import { ActivityType } from '../types/activity';

const { Title, Text, Paragraph } = Typography;
// Descriptions.Meta 在较新版本的 antd 中已移除，使用 Descriptions.Item 替代

/**
 * 商机详情页
 * 功能：
 * - 基本信息展示
 * - 竞争对手列表
 * - 跟进记录时间线
 * - 操作按钮：编辑、变更阶段、删除
 */
export const OpportunityDetail: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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
    [OpportunityStage.LEAD_CONFIRMATION]: t('opportunity.stage.leadConfirmation'),
    [OpportunityStage.INITIAL_CONTACT]: t('opportunity.stage.initialContact'),
    [OpportunityStage.REQUIREMENT_CONFIRMATION]: t('opportunity.stage.requirementConfirmation'),
    [OpportunityStage.PROPOSAL_QUOTATION]: t('opportunity.stage.proposalQuotation'),
    [OpportunityStage.NEGOTIATION_APPROVAL]: t('opportunity.stage.negotiationApproval'),
    [OpportunityStage.CLOSED_WON]: t('opportunity.stage.closedWon'),
    [OpportunityStage.CLOSED_LOST]: t('opportunity.stage.closedLost'),
  };

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
    return `¥${(amount / 10000).toFixed(1)}${t('opportunity.table.tenThousand')}`;
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
    message.info(`${t('opportunity.detail.editInfo')}：${id}`);
    // TODO: 打开编辑表单
  };

  // 处理变更阶段
  const handleChangeStage = () => {
    message.info(`${t('opportunity.detail.changeStageInfo')}：${id}`);
    // TODO: 打开阶段变更弹窗
  };

  // 处理删除
  const handleDelete = () => {
    Modal.confirm({
      title: t('opportunity.detail.confirmDelete'),
      content: t('opportunity.detail.confirmDeleteContent'),
      okText: t('commonBatch.confirm'),
      cancelText: t('commonBatch.cancel'),
      onOk: () => {
        message.success(t('opportunity.detail.deleteSuccess'));
        // TODO: 调用删除 API
      }
    });
  };

  // 如果没有找到商机
  if (!opportunity) {
    return (
      <div style={{ padding: 24 }}>
        <Card>
          <Title level={3}>{t('opportunity.detail.notFound')}</Title>
          <Button onClick={handleBack} icon={<ArrowLeftOutlined />}>
            {t('opportunity.detail.back')}
          </Button>
        </Card>
      </div>
    );
  }

  // 跟进记录表格列
  const activityColumns = [
    {
      title: t('activity.table.activityTime'),
      dataIndex: 'activityTime',
      key: 'activityTime',
      width: 160,
      render: (time: string) => new Date(time).toLocaleString('zh-CN')
    },
    {
      title: t('activity.table.type'),
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: ActivityType) => <Tag>{type}</Tag>
    },
    {
      title: t('activity.table.content'),
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      render: (content: string) => {
        const text = content.replace(/<[^>]*>/g, '');
        return text.length > 100 ? text.substring(0, 100) + '...' : text;
      }
    },
    {
      title: t('activity.table.createdBy'),
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
              {t('opportunity.detail.back')}
            </Button>
            <div>
              <Title level={3} style={{ margin: 0 }}>{opportunity.name}</Title>
              <Text type="secondary" style={{ marginLeft: 16 }}>💼 {opportunity.customerName}</Text>
            </div>
          </Space>
          <Space>
            <Button icon={<EditOutlined />} onClick={handleEdit}>
              {t('opportunity.detail.edit')}
            </Button>
            <Button icon={<ThunderboltOutlined />} onClick={handleChangeStage}>
              {t('opportunity.detail.changeStage')}
            </Button>
            <Button danger icon={<DeleteOutlined />} onClick={handleDelete}>
              {t('opportunity.detail.delete')}
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
              <span>{t('opportunity.detail.opportunityId')}：{opportunity.id}</span>
              <span style={{ margin: '0 16px' }}>|</span>
              <span>{t('opportunity.detail.amount')}：<Text strong style={{ color: '#faad14' }}>{formatAmount(opportunity.amount)}</Text></span>
              <span style={{ margin: '0 16px' }}>|</span>
              <span>{t('opportunity.detail.estimatedCloseDate')}：{formatDate(opportunity.estimatedCloseDate)}</span>
              <span style={{ margin: '0 16px' }}>|</span>
              <span>{t('opportunity.detail.owner')}：{opportunity.ownerName}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* 阶段进度条 + AI 预测分析 */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 16 }}>
        <Card title={`📊 ${t('opportunity.detail.stageProgress')}`}>
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
                onClick={() => index <= currentStageIndex && message.info(`${t('opportunity.detail.switchToStage')}：${STAGE_LABELS[stage]}`)}
                disabled={index > currentStageIndex}
              >
                {STAGE_LABELS[stage]}
              </Button>
            ))}
          </div>
        </Card>

        <Card title={`🤖 ${t('opportunity.detail.predictionAnalysis')}`}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>{t('opportunity.detail.winProbability')}</div>
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
            <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>{t('opportunity.detail.estimatedCloseDate')}</div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>{formatDate(opportunity.estimatedCloseDate)}</div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>
              <BulbOutlined style={{ marginRight: 4 }} />
              {t('opportunity.detail.recommendedAction')}
            </div>
            <div style={{ fontSize: 14, color: '#1890ff' }}>
              {opportunity.probability >= 80 ? t('opportunity.detail.recommendHigh') :
               opportunity.probability >= 50 ? t('opportunity.detail.recommendMedium') :
               t('opportunity.detail.recommendLow')}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>{t('opportunity.detail.trendAnalysis')}</div>
            <div style={{ fontSize: 14 }}>
              {t('opportunity.detail.weeklyFollowUps')} <Text strong>2</Text> {t('opportunity.detail.times')}，{t('opportunity.detail.customerIntention')} <Text strong type="success">{t('opportunity.detail.rising')}</Text>
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
              label: t('opportunity.detail.basicInfo'),
              children: (
                <Descriptions column={3} bordered>
                  <Descriptions.Item label={t('opportunity.form.name')}>{opportunity.name}</Descriptions.Item>
                  <Descriptions.Item label={t('opportunity.detail.customer')}>{opportunity.customerName}</Descriptions.Item>
                  <Descriptions.Item label={t('opportunity.form.amount')}>
                    <Text strong style={{ color: '#faad14' }}>{formatAmount(opportunity.amount)}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label={t('opportunity.detail.source')}>{opportunity.source}</Descriptions.Item>
                  <Descriptions.Item label={t('opportunity.detail.owner')}>{opportunity.ownerName}</Descriptions.Item>
                  <Descriptions.Item label={t('opportunity.detail.status')}>
                    <Tag>{opportunity.status}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label={t('opportunity.detail.budget')}>{opportunity.budget}</Descriptions.Item>
                  <Descriptions.Item label={t('opportunity.detail.createdAt')}>{formatDate(opportunity.createdAt)}</Descriptions.Item>
                  <Descriptions.Item label={t('opportunity.detail.updatedAt')}>{formatDate(opportunity.updatedAt)}</Descriptions.Item>
                  <Descriptions.Item label={t('opportunity.detail.nextFollowup')} span={3}>
                    {opportunity.nextFollowupTime ? formatDate(opportunity.nextFollowupTime) : '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('opportunity.detail.customerNeeds')} span={3}>
                    <Paragraph style={{ marginBottom: 0 }}>{opportunity.description}</Paragraph>
                  </Descriptions.Item>
                  <Descriptions.Item label={t('opportunity.detail.decisionProcess')} span={3}>
                    <Paragraph style={{ marginBottom: 0 }}>{opportunity.decisionProcess}</Paragraph>
                  </Descriptions.Item>
                </Descriptions>
              ),
            },
            {
              key: 'competitors',
              label: `${t('opportunity.detail.competitors')} (${opportunity.competitors.length})`,
              children: opportunity.competitors.length > 0 ? (
                <Table
                  dataSource={opportunity.competitors}
                  rowKey="id"
                  pagination={false}
                  size="small"
                  columns={[
                    {
                      title: t('opportunity.detail.competitorName'),
                      dataIndex: 'name',
                      key: 'name',
                      width: 200,
                      render: (name: string) => <Text strong>{name}</Text>
                    },
                    {
                      title: t('opportunity.detail.productOrSolution'),
                      dataIndex: 'product',
                      key: 'product',
                      width: 150,
                    },
                    {
                      title: t('opportunity.detail.competitiveAdvantage'),
                      dataIndex: 'advantage',
                      key: 'advantage',
                      render: (text: string) => <Text type="success">{text}</Text>
                    },
                    {
                      title: t('opportunity.detail.competitiveDisadvantage'),
                      dataIndex: 'disadvantage',
                      key: 'disadvantage',
                      render: (text: string) => <Text type="danger">{text}</Text>
                    },
                    {
                      title: t('opportunity.detail.ourStrategy'),
                      dataIndex: 'strategy',
                      key: 'strategy',
                      render: (text: string) => text || '-',
                    },
                  ]}
                />
              ) : (
                <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>
                  <Button type="primary" icon={<PlusOutlined />}>+ {t('opportunity.detail.addCompetitor')}</Button>
                </div>
              ),
            },
            {
              key: 'followups',
              label: `${t('opportunity.detail.followUpRecords')} (${relatedActivities.length})`,
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
                  <Button type="primary" icon={<PlusOutlined />}>+ {t('opportunity.detail.addFollowUp')}</Button>
                </div>
              ),
            },
            {
              key: 'quotes',
              label: t('opportunity.detail.quoteRecords'),
              children: <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>{t('opportunity.detail.noQuoteRecords')}</div>,
            },
            {
              key: 'contracts',
              label: t('opportunity.detail.relatedContracts'),
              children: <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>{t('opportunity.detail.noRelatedContracts')}</div>,
            },
            {
              key: 'logs',
              label: t('opportunity.detail.operationLog'),
              children: (
                <Timeline
                  items={[
                    {
                      color: 'blue',
                      children: (
                        <div>
                          <p>{t('opportunity.detail.logModifiedInfo')}</p>
                          <p style={{ fontSize: 12, color: '#999' }}>2026-03-15 10:30</p>
                        </div>
                      ),
                    },
                    {
                      color: 'green',
                      children: (
                        <div>
                          <p>{t('opportunity.detail.logAutoCreated')}</p>
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