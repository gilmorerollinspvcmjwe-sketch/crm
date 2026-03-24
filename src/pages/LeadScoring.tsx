/**
 * 线索评分 AI 页面
 * AI 评分线索，展示评分维度和详情
 */
import React, { useState } from 'react';
import {
  Table,
  Card,
  Tag,
  Modal,
  Typography,
  Space,
  Badge,
  Progress,
  Slider,
  message,
  Button,
} from 'antd';
import {
  RobotOutlined,
  StarOutlined,
  ThunderboltOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { ColumnsType } from 'antd/es/table';
import { ScoredLead } from '../types/ai';
import { scoredLeads } from '../mock/aiData';

const { Title, Text } = Typography;

const LeadScoring: React.FC = () => {
  const { t } = useTranslation();
  const [leads, setLeads] = useState<ScoredLead[]>(scoredLeads);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentLead, setCurrentLead] = useState<ScoredLead | null>(null);
  const [adjustedScore, setAdjustedScore] = useState<number>(0);

  // 打开评分详情弹窗
  const handleViewDetail = (lead: ScoredLead) => {
    setCurrentLead(lead);
    setAdjustedScore(lead.scoreDetail.totalScore);
    setIsModalVisible(true);
  };

  // 保存调整后的评分
  const handleSaveScore = () => {
    if (!currentLead) return;

    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === currentLead.id
          ? {
              ...lead,
              scoreDetail: {
                ...lead.scoreDetail,
                totalScore: adjustedScore,
                level: adjustedScore >= 80 ? 'A' : adjustedScore >= 60 ? 'B' : adjustedScore >= 40 ? 'C' : 'D',
                isHighValue: adjustedScore >= 80,
              },
            }
          : lead
      )
    );
    message.success(t('ai.leadScoring.scoreUpdated'));
    setIsModalVisible(false);
  };

  // 获取等级颜色
  const getLevelColor = (level: string): string => {
    switch (level) {
      case 'A':
        return '#52c41a';
      case 'B':
        return '#1890ff';
      case 'C':
        return '#faad14';
      default:
        return '#ff4d4f';
    }
  };

  // 获取等级文本
  const getLevelText = (level: string): string => {
    return `${level}${t('ai.leadScoring.levelSuffix')}`;
  };

  const columns: ColumnsType<ScoredLead> = [
    {
      title: t('ai.leadScoring.leadName'),
      dataIndex: 'name',
      key: 'name',
      width: 250,
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.companyName} | {record.contactName}
          </Text>
        </div>
      ),
    },
    {
      title: t('ai.leadScoring.industry'),
      dataIndex: 'industry',
      key: 'industry',
      width: 150,
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: t('ai.leadScoring.aiScore'),
      key: 'score',
      width: 150,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Progress
            type="circle"
            percent={record.scoreDetail.totalScore}
            strokeColor={
              record.scoreDetail.totalScore >= 80
                ? '#52c41a'
                : record.scoreDetail.totalScore >= 60
                ? '#faad14'
                : '#ff4d4f'
            }
            size={50}
            format={(percent) => (
              <div style={{ textAlign: 'center' }}>
                <Text strong style={{ fontSize: 14 }}>{percent}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 10 }}>{t('ai.leadScoring.points')}</Text>
              </div>
            )}
          />
          <div>
            <Badge
              count={`${t('ai.leadScoring.level')}：${getLevelText(record.scoreDetail.level)}`}
              style={{ backgroundColor: getLevelColor(record.scoreDetail.level) }}
            />
            <br />
            {record.scoreDetail.isHighValue && (
              <Tag color="gold" icon={<StarOutlined />}>{t('ai.leadScoring.highValue')}</Tag>
            )}
          </div>
        </div>
      ),
    },
    {
      title: t('ai.leadScoring.attributeScore'),
      key: 'attributeScore',
      width: 100,
      render: (_, record) => (
        <Progress
          percent={Math.round((record.scoreDetail.attributeScore / 60) * 100)}
          strokeColor="#1890ff"
          format={() => `${record.scoreDetail.attributeScore}/60`}
          size="small"
        />
      ),
    },
    {
      title: t('ai.leadScoring.behaviorScore'),
      key: 'behaviorScore',
      width: 100,
      render: (_, record) => (
        <Progress
          percent={Math.round((record.scoreDetail.behaviorScore / 40) * 100)}
          strokeColor="#52c41a"
          format={() => `${record.scoreDetail.behaviorScore}/40`}
          size="small"
        />
      ),
    },
    {
      title: t('ai.leadScoring.lastActivity'),
      dataIndex: 'lastActivity',
      key: 'lastActivity',
      width: 160,
    },
    {
      title: t('ai.leadScoring.owner'),
      dataIndex: 'ownerName',
      key: 'ownerName',
      width: 100,
    },
    {
      title: t('ai.leadScoring.actions'),
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => handleViewDetail(record)}
        >
          {t('ai.leadScoring.scoreDetails')}
        </Button>
      ),
    },
  ];

  // 统计信息
  const totalLeads = leads.length;
  const highValueLeads = leads.filter((l) => l.scoreDetail.isHighValue).length;
  const avgScore = Math.round(leads.reduce((sum, l) => sum + l.scoreDetail.totalScore, 0) / totalLeads);
  const aLevelLeads = leads.filter((l) => l.scoreDetail.level === 'A').length;

  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh' }}>
      {/* 页面头部 */}
      <div style={{ background: '#fff', padding: '16px 24px', marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0 }}>
          <RobotOutlined /> {t('ai.leadScoring.title')}
        </Title>
        <Text type="secondary">
          {t('ai.leadScoring.subtitle')}
        </Text>
      </div>

      {/* 统计卡片 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }}>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <Title level={3} style={{ margin: 0 }}>{totalLeads}</Title>
            <Text type="secondary">{t('ai.leadScoring.totalLeads')}</Text>
          </div>
        </Card>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <Title level={3} style={{ margin: 0, color: '#52c41a' }}>{highValueLeads}</Title>
            <Text type="secondary">{t('ai.leadScoring.highValueLeads')}</Text>
          </div>
        </Card>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <Title level={3} style={{ margin: 0, color: '#1890ff' }}>{aLevelLeads}</Title>
            <Text type="secondary">{t('ai.leadScoring.aLevelLeads')}</Text>
          </div>
        </Card>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <Title level={3} style={{ margin: 0, color: '#faad14' }}>{avgScore}</Title>
            <Text type="secondary">{t('ai.leadScoring.avgScore')}</Text>
          </div>
        </Card>
      </div>

      {/* 线索列表 */}
      <Card>
        <Table
          columns={columns}
          dataSource={leads}
          rowKey="id"
          pagination={{ pageSize: 20 }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* 评分详情弹窗 */}
      <Modal
        title={
          <Space>
            <ThunderboltOutlined />
            {t('ai.leadScoring.scoreDetails')}
          </Space>
        }
        open={isModalVisible}
        onOk={handleSaveScore}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            {t('common.actions.cancel')}
          </Button>,
          <Button key="save" type="primary" onClick={handleSaveScore}>
            {t('ai.leadScoring.saveAdjustment')}
          </Button>,
        ]}
      >
        {currentLead && (
          <div>
            <Card size="small" style={{ marginBottom: 16 }}>
              <Title level={5} style={{ margin: '0 0 8px 0' }}>{currentLead.name}</Title>
              <Space>
                <Tag>{currentLead.companyName}</Tag>
                <Tag>{currentLead.industry}</Tag>
                <Tag>{currentLead.ownerName}</Tag>
              </Space>
            </Card>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {/* 总分展示 */}
              <Card title={t('ai.leadScoring.totalScore')} size="small">
                <div style={{ textAlign: 'center' }}>
                  <Progress
                    type="dashboard"
                    percent={currentLead.scoreDetail.totalScore}
                    strokeColor={
                      currentLead.scoreDetail.totalScore >= 80
                        ? '#52c41a'
                        : currentLead.scoreDetail.totalScore >= 60
                        ? '#faad14'
                        : '#ff4d4f'
                    }
                    format={(percent) => (
                      <div>
                        <Text strong style={{ fontSize: 24 }}>{percent}</Text>
                        <br />
                        <Text type="secondary">{t('ai.leadScoring.points')}</Text>
                      </div>
                    )}
                  />
                  <div style={{ marginTop: 16 }}>
                    <Badge
                      count={`${t('ai.leadScoring.level')}：${getLevelText(currentLead.scoreDetail.level)}`}
                      style={{ backgroundColor: getLevelColor(currentLead.scoreDetail.level) }}
                    />
                    {currentLead.scoreDetail.isHighValue && (
                      <Tag color="gold" icon={<StarOutlined />} style={{ marginLeft: 8 }}>
                        {t('ai.leadScoring.highValue')}
                      </Tag>
                    )}
                  </div>
                </div>
              </Card>

              {/* 手动调整 */}
              <Card title={t('ai.leadScoring.manualAdjustment')} size="small">
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <Slider
                    value={adjustedScore}
                    onChange={setAdjustedScore}
                    min={0}
                    max={100}
                    marks={{
                      0: '0',
                      40: 'C',
                      60: 'B',
                      80: 'A',
                      100: '100',
                    }}
                  />
                  <Title level={3} style={{ margin: '16px 0 0 0' }}>{adjustedScore} {t('ai.leadScoring.points')}</Title>
                  <Text type="secondary">
                    {t('ai.leadScoring.level')}：{adjustedScore >= 80 ? 'A' : adjustedScore >= 60 ? 'B' : adjustedScore >= 40 ? 'C' : 'D'}
                  </Text>
                </div>
              </Card>
            </div>

            {/* 评分维度 */}
            <Title level={5} style={{ marginTop: 16 }}>{t('ai.leadScoring.scoreDimensions')}</Title>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {/* 属性分 */}
              <Card title={`${t('ai.leadScoring.attributeScoreTitle')} (60 ${t('ai.leadScoring.points')})`} size="small">
                <Space direction="vertical" size={12} style={{ width: '100%' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text>{t('ai.leadScoring.industryMatch')}</Text>
                      <Text strong>{currentLead.scoreDetail.attributeDetails.industryMatch}/20</Text>
                    </div>
                    <Progress
                      percent={Math.round((currentLead.scoreDetail.attributeDetails.industryMatch / 20) * 100)}
                      strokeColor="#1890ff"
                      size="small"
                      showInfo={false}
                    />
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text>{t('ai.leadScoring.companySize')}</Text>
                      <Text strong>{currentLead.scoreDetail.attributeDetails.companySize}/20</Text>
                    </div>
                    <Progress
                      percent={Math.round((currentLead.scoreDetail.attributeDetails.companySize / 20) * 100)}
                      strokeColor="#1890ff"
                      size="small"
                      showInfo={false}
                    />
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text>{t('ai.leadScoring.positionLevel')}</Text>
                      <Text strong>{currentLead.scoreDetail.attributeDetails.positionLevel}/20</Text>
                    </div>
                    <Progress
                      percent={Math.round((currentLead.scoreDetail.attributeDetails.positionLevel / 20) * 100)}
                      strokeColor="#1890ff"
                      size="small"
                      showInfo={false}
                    />
                  </div>
                  <div style={{ textAlign: 'right', marginTop: 8 }}>
                    <Text strong>{t('ai.leadScoring.attributeTotal')}：{currentLead.scoreDetail.attributeScore}/60</Text>
                  </div>
                </Space>
              </Card>

              {/* 行为分 */}
              <Card title={`${t('ai.leadScoring.behaviorScoreTitle')} (40 ${t('ai.leadScoring.points')})`} size="small">
                <Space direction="vertical" size={12} style={{ width: '100%' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text>{t('ai.leadScoring.websiteVisit')}</Text>
                      <Text strong>{currentLead.scoreDetail.behaviorDetails.websiteVisit}/15</Text>
                    </div>
                    <Progress
                      percent={Math.round((currentLead.scoreDetail.behaviorDetails.websiteVisit / 15) * 100)}
                      strokeColor="#52c41a"
                      size="small"
                      showInfo={false}
                    />
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text>{t('ai.leadScoring.emailOpen')}</Text>
                      <Text strong>{currentLead.scoreDetail.behaviorDetails.emailOpen}/15</Text>
                    </div>
                    <Progress
                      percent={Math.round((currentLead.scoreDetail.behaviorDetails.emailOpen / 15) * 100)}
                      strokeColor="#52c41a"
                      size="small"
                      showInfo={false}
                    />
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text>{t('ai.leadScoring.activityParticipation')}</Text>
                      <Text strong>{currentLead.scoreDetail.behaviorDetails.activityParticipation}/10</Text>
                    </div>
                    <Progress
                      percent={Math.round((currentLead.scoreDetail.behaviorDetails.activityParticipation / 10) * 100)}
                      strokeColor="#52c41a"
                      size="small"
                      showInfo={false}
                    />
                  </div>
                  <div style={{ textAlign: 'right', marginTop: 8 }}>
                    <Text strong>{t('ai.leadScoring.behaviorTotal')}：{currentLead.scoreDetail.behaviorScore}/40</Text>
                  </div>
                </Space>
              </Card>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default LeadScoring;