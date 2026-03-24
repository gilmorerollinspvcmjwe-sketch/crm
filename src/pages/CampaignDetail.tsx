/**
 * 营销活动详情页
 * 功能：
 * - 展示活动基本信息
 * - 效果数据分析图表
 * - 关联的工作流、邮件模板等
 */
import React, { useState, useEffect } from 'react';
import {
  Card,
  Descriptions,
  Tag,
  Button,
  Space,
  Tabs,
  Row,
  Col,
  Statistic,
  Progress,
  Table,
  Typography,
  message,
  Spin,
} from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Campaign, CampaignStatus, CampaignParticipant } from '../types/marketing';
import { getCampaignsData } from '../mock/marketingData';
// TODO: 图表功能暂时禁用，等待 @ant-design/charts 安装完成
// import { Line, Pie, Bar } from '@ant-design/charts';

const { Title } = Typography;

/**
 * 营销活动详情页组件
 */
export const CampaignDetail: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [participants, setParticipants] = useState<CampaignParticipant[]>([]);

  /** 加载活动详情 */
  const loadCampaignDetail = () => {
    setLoading(true);
    try {
      const allCampaigns = getCampaignsData();
      const found = allCampaigns.find((c) => c.id === id);
      if (found) {
        setCampaign(found);
        // Mock 参与者数据
        setParticipants([
          {
            id: 'p001',
            customerId: 'c001',
            customerName: '北京科技创新有限公司',
            email: 'contact@bjtech.com',
            phone: '138****1234',
            status: 'converted',
            participatedAt: '2026-03-05T10:30:00Z',
          },
          {
            id: 'p002',
            customerId: 'c002',
            customerName: '上海智能制造集团',
            email: 'info@shsmart.com',
            phone: '139****5678',
            status: 'clicked',
            participatedAt: '2026-03-06T14:20:00Z',
          },
          {
            id: 'p003',
            customerId: 'c003',
            customerName: '广州数字科技公司',
            email: 'hello@gzdigital.com',
            status: 'opened',
            participatedAt: '2026-03-07T09:15:00Z',
          },
          {
            id: 'p004',
            customerId: 'c004',
            customerName: '深圳未来科技',
            email: 'contact@szfuture.com',
            status: 'delivered',
            participatedAt: '2026-03-08T16:45:00Z',
          },
          {
            id: 'p005',
            customerId: 'c005',
            customerName: '杭州云服务',
            email: 'info@hzcloud.com',
            status: 'bounced',
            participatedAt: '2026-03-09T11:00:00Z',
          },
        ]);
      } else {
        message.error(t('marketing.campaignDetail.notFound'));
      }
    } catch (error) {
      message.error(t('marketing.campaignDetail.loadFailed'));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /** 初始加载 */
  useEffect(() => {
    loadCampaignDetail();
  }, [id]);

  /** 状态颜色映射 */
  const statusColorMap: Record<CampaignStatus, string> = {
    [CampaignStatus.DRAFT]: 'default',
    [CampaignStatus.SCHEDULED]: 'blue',
    [CampaignStatus.RUNNING]: 'green',
    [CampaignStatus.PAUSED]: 'orange',
    [CampaignStatus.COMPLETED]: 'purple',
  };

  /** 参与者表格列 */
  const participantColumns = [
    {
      title: t('marketing.campaignDetail.customerName'),
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: t('marketing.campaignDetail.contactInfo'),
      key: 'contact',
      render: (_: unknown, record: CampaignParticipant) => (
        <Space direction="vertical" size={0}>
          {record.email && <Typography.Text>{record.email}</Typography.Text>}
          {record.phone && <Typography.Text type="secondary">{record.phone}</Typography.Text>}
        </Space>
      ),
    },
    {
      title: t('marketing.campaigns.columnStatus'),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap: Record<string, string> = {
          sent: 'default',
          delivered: 'blue',
          opened: 'cyan',
          clicked: 'green',
          converted: 'purple',
          bounced: 'red',
        };
        const statusLabels: Record<string, string> = {
          sent: t('marketing.campaignDetail.statusSent'),
          delivered: t('marketing.campaignDetail.statusDelivered'),
          opened: t('marketing.campaignDetail.statusOpened'),
          clicked: t('marketing.campaignDetail.statusClicked'),
          converted: t('marketing.campaignDetail.statusConverted'),
          bounced: t('marketing.campaignDetail.statusBounced'),
        };
        return <Tag color={statusMap[status]}>{statusLabels[status]}</Tag>;
      },
    },
    {
      title: t('marketing.campaignDetail.participatedAt'),
      dataIndex: 'participatedAt',
      key: 'participatedAt',
      render: (time: string) => new Date(time).toLocaleString('zh-CN'),
    },
  ];

  if (loading || !campaign) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      {/* 顶部操作栏 */}
      <Card style={{ marginBottom: 16 }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/marketing/campaigns')}>
            {t('marketing.campaignDetail.backToList')}
          </Button>
          <Space style={{ marginLeft: 'auto' }}>
            {campaign.status === CampaignStatus.RUNNING && (
              <Button icon={<PauseCircleOutlined />}>{t('marketing.campaignDetail.pauseCampaign')}</Button>
            )}
            {campaign.status === CampaignStatus.PAUSED && (
              <Button type="primary" icon={<PlayCircleOutlined />}>
                {t('marketing.campaignDetail.continueCampaign')}
              </Button>
            )}
            <Button icon={<EditOutlined />}>{t('marketing.campaignDetail.editCampaign')}</Button>
          </Space>
        </Space>
      </Card>

      {/* 基本信息 */}
      <Card title={t('marketing.campaignDetail.title')} style={{ marginBottom: 16 }}>
        <Descriptions column={2} bordered>
          <Descriptions.Item label={t('marketing.campaignDetail.campaignName')} span={2}>
            <Title level={4} style={{ margin: 0 }}>{campaign.name}</Title>
          </Descriptions.Item>
          <Descriptions.Item label={t('marketing.campaignDetail.campaignType')}>
            <Tag color={statusColorMap[campaign.status]}>{campaign.type}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label={t('marketing.campaignDetail.campaignStatus')}>
            <Tag color={statusColorMap[campaign.status]}>{campaign.status}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label={t('marketing.campaignDetail.owner')}>{campaign.ownerName}</Descriptions.Item>
          <Descriptions.Item label={t('marketing.campaignDetail.budget')}>¥{(campaign.budget / 10000).toFixed(1)}{t('marketing.campaigns.unitWan')}</Descriptions.Item>
          <Descriptions.Item label={t('marketing.campaignDetail.startTime')}>{campaign.startDate}</Descriptions.Item>
          <Descriptions.Item label={t('marketing.campaignDetail.endTime')}>{campaign.endDate}</Descriptions.Item>
          <Descriptions.Item label={t('marketing.campaignDetail.targetCustomerList')} span={2}>
            {campaign.targetListName || t('marketing.campaignDetail.notSpecified')}
          </Descriptions.Item>
          <Descriptions.Item label={t('marketing.campaignDetail.emailTemplate')} span={2}>
            {campaign.emailTemplateName || t('marketing.campaignDetail.notSpecified')}
          </Descriptions.Item>
          <Descriptions.Item label={t('marketing.campaignDetail.workflow')} span={2}>
            {campaign.workflowName || t('marketing.campaignDetail.notSpecified')}
          </Descriptions.Item>
          <Descriptions.Item label={t('marketing.campaignDetail.goal')} span={2}>
            {campaign.goal}
          </Descriptions.Item>
          <Descriptions.Item label={t('marketing.campaignDetail.description')} span={2}>
            {campaign.description || t('marketing.campaignDetail.none')}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 效果数据 */}
      <Card title={t('marketing.campaignDetail.effectAnalysis')} style={{ marginBottom: 16 }}>
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={4}>
            <Statistic
              title={t('marketing.campaignDetail.sentCount')}
              value={campaign.metrics.sent}
              suffix={t('marketing.campaigns.unit')}
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col span={4}>
            <Statistic
              title={t('marketing.campaignDetail.deliveredCount')}
              value={campaign.metrics.delivered}
              suffix={t('marketing.campaigns.unit')}
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
          <Col span={4}>
            <Statistic
              title={t('marketing.campaignDetail.openedCount')}
              value={campaign.metrics.opened}
              suffix={t('marketing.campaigns.unit')}
              valueStyle={{ color: '#13c2c2' }}
            />
          </Col>
          <Col span={4}>
            <Statistic
              title={t('marketing.campaignDetail.clickedCount')}
              value={campaign.metrics.clicked}
              suffix={t('marketing.campaigns.unit')}
              valueStyle={{ color: '#faad14' }}
            />
          </Col>
          <Col span={4}>
            <Statistic
              title={t('marketing.campaignDetail.convertedCount')}
              value={campaign.metrics.converted}
              suffix={t('marketing.campaigns.unit')}
              valueStyle={{ color: '#722ed1' }}
            />
          </Col>
          <Col span={4}>
            <Statistic
              title={t('marketing.campaignDetail.bouncedCount')}
              value={campaign.metrics.bounced}
              suffix={t('marketing.campaigns.unit')}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Col>
        </Row>

        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <Progress
                type="dashboard"
                percent={campaign.metrics.openRate}
                format={() => `${campaign.metrics.openRate.toFixed(1)}%`}
              />
              <div>{t('marketing.campaignDetail.openRate')}</div>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <Progress
                type="dashboard"
                percent={campaign.metrics.clickRate}
                format={() => `${campaign.metrics.clickRate.toFixed(1)}%`}
              />
              <div>{t('marketing.campaignDetail.clickRate')}</div>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <Progress
                type="dashboard"
                percent={campaign.metrics.conversionRate}
                format={() => `${campaign.metrics.conversionRate.toFixed(1)}%`}
              />
              <div>{t('marketing.campaignDetail.conversionRate')}</div>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <Progress
                type="dashboard"
                percent={((campaign.metrics.bounced / campaign.metrics.sent) * 100)}
                strokeColor="#ff4d4f"
                format={() => `${((campaign.metrics.bounced / campaign.metrics.sent) * 100).toFixed(1)}%`}
              />
              <div>{t('marketing.campaignDetail.bounceRate')}</div>
            </div>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={16}>
            <Title level={5}>{t('marketing.campaignDetail.effectTrend')}</Title>
            <div style={{ padding: 20, textAlign: 'center', color: '#999' }}>
              {t('marketing.campaignDetail.chartDisabled')}
            </div>
            {/* <Line {...trendConfig} height={300} /> */}
          </Col>
          <Col span={8}>
            <Title level={5}>{t('marketing.campaignDetail.conversionFunnel')}</Title>
            <div style={{ padding: 20, textAlign: 'center', color: '#999' }}>
              {t('marketing.campaignDetail.chartDisabled')}
            </div>
            {/* <Pie {...pieConfig} height={300} /> */}
          </Col>
        </Row>
      </Card>

      {/* 参与客户列表 */}
      <Card title={t('marketing.campaignDetail.participantList')}>
        <Table
          columns={participantColumns}
          dataSource={participants}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default CampaignDetail;