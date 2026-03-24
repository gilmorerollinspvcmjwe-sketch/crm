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
import type { ColumnsType } from 'antd/es/table';
import { ScoredLead } from '../types/ai';
import { scoredLeads } from '../mock/aiData';

const { Title, Text } = Typography;

const LeadScoring: React.FC = () => {
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
    message.success('评分已更新');
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

  const columns: ColumnsType<ScoredLead> = [
    {
      title: '线索名称',
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
      title: '行业',
      dataIndex: 'industry',
      key: 'industry',
      width: 150,
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'AI 评分',
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
                <Text type="secondary" style={{ fontSize: 10 }}>分</Text>
              </div>
            )}
          />
          <div>
            <Badge
              count={`等级：${record.scoreDetail.level}`}
              style={{ backgroundColor: getLevelColor(record.scoreDetail.level) }}
            />
            <br />
            {record.scoreDetail.isHighValue && (
              <Tag color="gold" icon={<StarOutlined />}>高价值</Tag>
            )}
          </div>
        </div>
      ),
    },
    {
      title: '属性分',
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
      title: '行为分',
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
      title: '最后活动',
      dataIndex: 'lastActivity',
      key: 'lastActivity',
      width: 160,
    },
    {
      title: '负责人',
      dataIndex: 'ownerName',
      key: 'ownerName',
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => handleViewDetail(record)}
        >
          评分详情
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
          <RobotOutlined /> 线索评分 AI
        </Title>
        <Text type="secondary">
          AI 基于属性分（行业匹配、公司规模、职位级别）和行为分（网站访问、邮件打开、活动参与）自动评分
        </Text>
      </div>

      {/* 统计卡片 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }}>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <Title level={3} style={{ margin: 0 }}>{totalLeads}</Title>
            <Text type="secondary">总线索数</Text>
          </div>
        </Card>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <Title level={3} style={{ margin: 0, color: '#52c41a' }}>{highValueLeads}</Title>
            <Text type="secondary">高价值线索 (≥80)</Text>
          </div>
        </Card>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <Title level={3} style={{ margin: 0, color: '#1890ff' }}>{aLevelLeads}</Title>
            <Text type="secondary">A 级线索</Text>
          </div>
        </Card>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <Title level={3} style={{ margin: 0, color: '#faad14' }}>{avgScore}</Title>
            <Text type="secondary">平均评分</Text>
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
            评分详情
          </Space>
        }
        open={isModalVisible}
        onOk={handleSaveScore}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            取消
          </Button>,
          <Button key="save" type="primary" onClick={handleSaveScore}>
            保存调整
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
              <Card title="总分" size="small">
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
                        <Text type="secondary">分</Text>
                      </div>
                    )}
                  />
                  <div style={{ marginTop: 16 }}>
                    <Badge
                      count={`等级：${currentLead.scoreDetail.level}`}
                      style={{ backgroundColor: getLevelColor(currentLead.scoreDetail.level) }}
                    />
                    {currentLead.scoreDetail.isHighValue && (
                      <Tag color="gold" icon={<StarOutlined />} style={{ marginLeft: 8 }}>
                        高价值
                      </Tag>
                    )}
                  </div>
                </div>
              </Card>

              {/* 手动调整 */}
              <Card title="手动调整评分" size="small">
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
                  <Title level={3} style={{ margin: '16px 0 0 0' }}>{adjustedScore} 分</Title>
                  <Text type="secondary">
                    等级：{adjustedScore >= 80 ? 'A' : adjustedScore >= 60 ? 'B' : adjustedScore >= 40 ? 'C' : 'D'}
                  </Text>
                </div>
              </Card>
            </div>

            {/* 评分维度 */}
            <Title level={5} style={{ marginTop: 16 }}>评分维度详情</Title>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {/* 属性分 */}
              <Card title="属性分 (60 分)" size="small">
                <Space direction="vertical" size={12} style={{ width: '100%' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text>行业匹配</Text>
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
                      <Text>公司规模</Text>
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
                      <Text>职位级别</Text>
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
                    <Text strong>属性分总计：{currentLead.scoreDetail.attributeScore}/60</Text>
                  </div>
                </Space>
              </Card>

              {/* 行为分 */}
              <Card title="行为分 (40 分)" size="small">
                <Space direction="vertical" size={12} style={{ width: '100%' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text>网站访问</Text>
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
                      <Text>邮件打开</Text>
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
                      <Text>活动参与</Text>
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
                    <Text strong>行为分总计：{currentLead.scoreDetail.behaviorScore}/40</Text>
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
