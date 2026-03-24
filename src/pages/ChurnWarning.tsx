/**
 * 客户流失预警页面
 * AI 识别高流失风险客户，提供挽回建议
 */
import React, { useState } from 'react';
import {
  Table,
  Card,
  Tag,
  Typography,
  Space,
  Badge,
  Button,
  Modal,
  Alert,
  Progress,
  message,
  Statistic,
  Row,
  Col,
} from 'antd';
import {
  RobotOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ThunderboltOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { ColumnsType } from 'antd/es/table';
import { ChurnWarning as ChurnWarningType } from '../types/ai';
import { churnWarnings } from '../mock/aiData';

const { Title, Text, Paragraph } = Typography;

const ChurnWarning: React.FC = () => {
  const { t } = useTranslation();
  const [warnings, setWarnings] = useState<ChurnWarningType[]>(churnWarnings);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentWarning, setCurrentWarning] = useState<ChurnWarningType | null>(null);

  // 获取风险等级颜色
  const getRiskColor = (level: string): string => {
    switch (level) {
      case 'high':
        return '#ff4d4f';
      case 'medium':
        return '#faad14';
      default:
        return '#1890ff';
    }
  };

  // 获取风险等级文本
  const getRiskText = (level: string): string => {
    switch (level) {
      case 'high':
        return t('ai.churnWarning.riskHigh');
      case 'medium':
        return t('ai.churnWarning.riskMedium');
      default:
        return t('ai.churnWarning.riskLow');
    }
  };

  // 标记为已处理
  const handleMarkProcessed = (id: string) => {
    setWarnings((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              isProcessed: true,
              processedAt: new Date().toISOString(),
              processedBy: t('ai.churnWarning.admin'),
            }
          : w
      )
    );
    message.success(t('ai.churnWarning.markedProcessed'));
  };

  // 打开详情弹窗
  const handleViewDetail = (warning: ChurnWarningType) => {
    setCurrentWarning(warning);
    setIsModalVisible(true);
  };

  const columns: ColumnsType<ChurnWarningType> = [
    {
      title: t('ai.churnWarning.customerName'),
      dataIndex: 'customerName',
      key: 'customerName',
      width: 200,
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.industry} | {record.customerId}
          </Text>
        </div>
      ),
    },
    {
      title: t('ai.churnWarning.riskLevel'),
      dataIndex: 'riskLevel',
      key: 'riskLevel',
      width: 120,
      render: (level: string, record) => (
        <div>
          <Badge
            count={getRiskText(level)}
            style={{ backgroundColor: getRiskColor(level) }}
          />
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {t('ai.churnWarning.riskScore')}：{record.riskScore}
          </Text>
        </div>
      ),
    },
    {
      title: t('ai.churnWarning.riskFactors'),
      key: 'riskFactors',
      width: 250,
      render: (_, record) => (
        <Space direction="vertical" size={4}>
          {record.riskFactors.slice(0, 3).map((factor, idx) => (
            <Tag
              key={idx}
              color={factor.severity === 'high' ? 'red' : factor.severity === 'medium' ? 'orange' : 'blue'}
            >
              {factor.label}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: t('ai.churnWarning.lastContactDays'),
      dataIndex: 'lastContactDays',
      key: 'lastContactDays',
      width: 120,
      render: (days: number) => (
        <Text type={days > 90 ? 'danger' : days > 60 ? 'warning' : 'secondary'}>
          {days}{t('ai.churnWarning.daysUnit')}
        </Text>
      ),
    },
    {
      title: t('ai.churnWarning.contractExpiry'),
      dataIndex: 'contractExpiry',
      key: 'contractExpiry',
      width: 120,
      render: (date?: string) =>
        date ? (
          <Tag color="orange">{date}</Tag>
        ) : (
          <Text type="secondary">-</Text>
        ),
    },
    {
      title: t('ai.churnWarning.complaintCount'),
      dataIndex: 'complaintCount',
      key: 'complaintCount',
      width: 100,
      render: (count: number) => (
        <Text type={count > 0 ? 'danger' : 'success'}>
          {count > 0 ? `${count}${t('ai.churnWarning.timesUnit')}` : t('ai.churnWarning.none')}
        </Text>
      ),
    },
    {
      title: t('ai.churnWarning.owner'),
      dataIndex: 'ownerName',
      key: 'ownerName',
      width: 100,
    },
    {
      title: t('ai.churnWarning.status'),
      key: 'status',
      width: 100,
      render: (_, record) =>
        record.isProcessed ? (
          <Tag color="success" icon={<CheckCircleOutlined />}>
            {t('ai.churnWarning.processed')}
          </Tag>
        ) : (
          <Tag color="warning">{t('ai.churnWarning.pending')}</Tag>
        ),
    },
    {
      title: t('ai.churnWarning.actions'),
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            onClick={() => handleViewDetail(record)}
          >
            {t('ai.churnWarning.details')}
          </Button>
          {!record.isProcessed && (
            <Button
              type="primary"
              size="small"
              icon={<CheckCircleOutlined />}
              onClick={() => handleMarkProcessed(record.id)}
            >
              {t('ai.churnWarning.processed')}
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // 统计信息
  const totalWarnings = warnings.length;
  const highRisk = warnings.filter((w) => w.riskLevel === 'high').length;
  const mediumRisk = warnings.filter((w) => w.riskLevel === 'medium').length;
  const processed = warnings.filter((w) => w.isProcessed).length;
  const pending = totalWarnings - processed;

  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh' }}>
      {/* 页面头部 */}
      <div style={{ background: '#fff', padding: '16px 24px', marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0 }}>
          <RobotOutlined /> {t('ai.churnWarning.title')}
        </Title>
        <Text type="secondary">
          {t('ai.churnWarning.subtitle')}
        </Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('ai.churnWarning.totalWarnings')}
              value={totalWarnings}
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('ai.churnWarning.highRiskCustomers')}
              value={highRisk}
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<ExclamationCircleOutlined />}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {t('ai.churnWarning.needImmediateAction')}
            </Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('ai.churnWarning.mediumRiskCustomers')}
              value={mediumRisk}
              valueStyle={{ color: '#faad14' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {t('ai.churnWarning.needAttention')}
            </Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('ai.churnWarning.pending')}
              value={pending}
              valueStyle={{ color: pending > 0 ? '#ff4d4f' : '#52c41a' }}
            />
            <Progress
              percent={Math.round((processed / totalWarnings) * 100)}
              strokeColor={processed === totalWarnings ? '#52c41a' : '#faad14'}
              size="small"
              style={{ marginTop: 8 }}
              format={() => `${processed}/${totalWarnings}`}
            />
          </Card>
        </Col>
      </Row>

      {/* 高风险预警 */}
      {highRisk > 0 && (
        <Alert
          message={t('ai.churnWarning.highRiskAlert', { count: highRisk })}
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {/* 预警列表 */}
      <Card>
        <Table
          columns={columns}
          dataSource={warnings}
          rowKey="id"
          pagination={{ pageSize: 20 }}
          scroll={{ x: 1400 }}
        />
      </Card>

      {/* 详情弹窗 */}
      <Modal
        title={
          <Space>
            <ThunderboltOutlined />
            {t('ai.churnWarning.details')}
          </Space>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        footer={[
          <Button
            key="process"
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={() => {
              if (currentWarning) {
                handleMarkProcessed(currentWarning.id);
                setIsModalVisible(false);
              }
            }}
            disabled={currentWarning?.isProcessed}
          >
            {t('ai.churnWarning.markAsProcessed')}
          </Button>,
        ]}
      >
        {currentWarning && (
          <div>
            <Card size="small" style={{ marginBottom: 16 }}>
              <Title level={4} style={{ margin: '0 0 8px 0' }}>
                {currentWarning.customerName}
              </Title>
              <Space>
                <Badge
                  count={getRiskText(currentWarning.riskLevel)}
                  style={{ backgroundColor: getRiskColor(currentWarning.riskLevel) }}
                />
                <Tag>{currentWarning.industry}</Tag>
                <Tag>{currentWarning.ownerName}</Tag>
                <Progress
                  type="circle"
                  percent={currentWarning.riskScore}
                  strokeColor={getRiskColor(currentWarning.riskLevel)}
                  size={40}
                  format={() => (
                    <Text strong style={{ fontSize: 12 }}>
                      {currentWarning.riskScore}
                    </Text>
                  )}
                />
              </Space>
            </Card>

            <Title level={5}>{t('ai.churnWarning.riskAnalysis')}</Title>
            <Space direction="vertical" size={12} style={{ width: '100%', marginBottom: 16 }}>
              {currentWarning.riskFactors.map((factor, idx) => (
                <Alert
                  key={idx}
                  type={factor.severity === 'high' ? 'error' : factor.severity === 'medium' ? 'warning' : 'info'}
                  message={factor.label}
                  description={factor.description}
                  showIcon
                />
              ))}
            </Space>

            <Title level={5}>{t('ai.churnWarning.basicInfo')}</Title>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={8}>
                <Card size="small">
                  <Text type="secondary">{t('ai.churnWarning.lastContactDays')}</Text>
                  <br />
                  <Title level={4} style={{ margin: '8px 0 0 0' }}>
                    {currentWarning.lastContactDays}{t('ai.churnWarning.daysUnit')}
                  </Title>
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small">
                  <Text type="secondary">{t('ai.churnWarning.contractExpiry')}</Text>
                  <br />
                  <Title level={4} style={{ margin: '8px 0 0 0' }}>
                    {currentWarning.contractExpiry || t('ai.churnWarning.none')}
                  </Title>
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small">
                  <Text type="secondary">{t('ai.churnWarning.complaintCount')}</Text>
                  <br />
                  <Title level={4} style={{ margin: '8px 0 0 0' }}>
                    {currentWarning.complaintCount}{t('ai.churnWarning.timesUnit')}
                  </Title>
                </Card>
              </Col>
            </Row>

            <Title level={5}>{t('ai.churnWarning.aiSuggestions')}</Title>
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              {currentWarning.aiSuggestions.map((suggestion, idx) => (
                <Alert
                  key={idx}
                  type="success"
                  message={
                    <Space>
                      <ThunderboltOutlined />
                      {suggestion}
                    </Space>
                  }
                  showIcon
                />
              ))}
            </Space>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ChurnWarning;