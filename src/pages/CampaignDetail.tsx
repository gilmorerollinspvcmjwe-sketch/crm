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
import { Campaign, CampaignStatus, CampaignParticipant } from '../types/marketing';
import { getCampaignsData } from '../mock/marketingData';
// TODO: 图表功能暂时禁用，等待 @ant-design/charts 安装完成
// import { Line, Pie, Bar } from '@ant-design/charts';

const { Title } = Typography;

/**
 * 营销活动详情页组件
 */
export const CampaignDetail: React.FC = () => {
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
        message.error('未找到该营销活动');
      }
    } catch (error) {
      message.error('加载活动详情失败');
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

  /** 效果趋势图配置 */
  const trendConfig = {
    data: [
      { date: '03-01', sent: 120, opened: 60, clicked: 24, converted: 5 },
      { date: '03-02', sent: 150, opened: 75, clicked: 30, converted: 6 },
      { date: '03-03', sent: 180, opened: 90, clicked: 36, converted: 7 },
      { date: '03-04', sent: 200, opened: 100, clicked: 40, converted: 8 },
      { date: '03-05', sent: 250, opened: 125, clicked: 50, converted: 10 },
      { date: '03-06', sent: 280, opened: 140, clicked: 56, converted: 11 },
      { date: '03-07', sent: 320, opened: 160, clicked: 64, converted: 13 },
      { date: '03-08', sent: 380, opened: 190, clicked: 76, converted: 15 },
      { date: '03-09', sent: 450, opened: 225, clicked: 90, converted: 18 },
      { date: '03-10', sent: 520, opened: 260, clicked: 104, converted: 21 },
      { date: '03-11', sent: 600, opened: 300, clicked: 120, converted: 24 },
      { date: '03-12', sent: 680, opened: 340, clicked: 136, converted: 27 },
    ],
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    legend: {
      position: 'top' as const,
    },
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
  };

  /** 渠道分布图配置 */
  const pieConfig = {
    appendPadding: 10,
    data: [
      { type: '邮件打开', value: campaign?.metrics.opened || 0 },
      { type: '邮件点击', value: campaign?.metrics.clicked || 0 },
      { type: '转化', value: campaign?.metrics.converted || 0 },
      { type: '未打开', value: (campaign?.metrics.delivered || 0) - (campaign?.metrics.opened || 0) },
    ],
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };

  /** 参与者表格列 */
  const participantColumns = [
    {
      title: '客户名称',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: '联系方式',
      key: 'contact',
      render: (_: unknown, record: CampaignParticipant) => (
        <Space direction="vertical" size={0}>
          {record.email && <Typography.Text>{record.email}</Typography.Text>}
          {record.phone && <Typography.Text type="secondary">{record.phone}</Typography.Text>}
        </Space>
      ),
    },
    {
      title: '状态',
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
          sent: '已发送',
          delivered: '已送达',
          opened: '已打开',
          clicked: '已点击',
          converted: '已转化',
          bounced: '已退回',
        };
        return <Tag color={statusMap[status]}>{statusLabels[status]}</Tag>;
      },
    },
    {
      title: '参与时间',
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
            返回列表
          </Button>
          <Space style={{ marginLeft: 'auto' }}>
            {campaign.status === CampaignStatus.RUNNING && (
              <Button icon={<PauseCircleOutlined />}>暂停活动</Button>
            )}
            {campaign.status === CampaignStatus.PAUSED && (
              <Button type="primary" icon={<PlayCircleOutlined />}>
                继续活动
              </Button>
            )}
            <Button icon={<EditOutlined />}>编辑活动</Button>
          </Space>
        </Space>
      </Card>

      {/* 基本信息 */}
      <Card title="活动基本信息" style={{ marginBottom: 16 }}>
        <Descriptions column={2} bordered>
          <Descriptions.Item label="活动名称" span={2}>
            <Title level={4} style={{ margin: 0 }}>{campaign.name}</Title>
          </Descriptions.Item>
          <Descriptions.Item label="活动类型">
            <Tag color={statusColorMap[campaign.status]}>{campaign.type}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="活动状态">
            <Tag color={statusColorMap[campaign.status]}>{campaign.status}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="负责人">{campaign.ownerName}</Descriptions.Item>
          <Descriptions.Item label="预算">¥{(campaign.budget / 10000).toFixed(1)}万</Descriptions.Item>
          <Descriptions.Item label="开始时间">{campaign.startDate}</Descriptions.Item>
          <Descriptions.Item label="结束时间">{campaign.endDate}</Descriptions.Item>
          <Descriptions.Item label="目标客户列表" span={2}>
            {campaign.targetListName || '未指定'}
          </Descriptions.Item>
          <Descriptions.Item label="邮件模板" span={2}>
            {campaign.emailTemplateName || '未指定'}
          </Descriptions.Item>
          <Descriptions.Item label="工作流" span={2}>
            {campaign.workflowName || '未指定'}
          </Descriptions.Item>
          <Descriptions.Item label="活动目标" span={2}>
            {campaign.goal}
          </Descriptions.Item>
          <Descriptions.Item label="活动描述" span={2}>
            {campaign.description || '无'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 效果数据 */}
      <Card title="效果数据分析" style={{ marginBottom: 16 }}>
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={4}>
            <Statistic
              title="发送数量"
              value={campaign.metrics.sent}
              suffix="封"
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col span={4}>
            <Statistic
              title="送达数量"
              value={campaign.metrics.delivered}
              suffix="封"
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
          <Col span={4}>
            <Statistic
              title="打开数量"
              value={campaign.metrics.opened}
              suffix="封"
              valueStyle={{ color: '#13c2c2' }}
            />
          </Col>
          <Col span={4}>
            <Statistic
              title="点击数量"
              value={campaign.metrics.clicked}
              suffix="次"
              valueStyle={{ color: '#faad14' }}
            />
          </Col>
          <Col span={4}>
            <Statistic
              title="转化数量"
              value={campaign.metrics.converted}
              suffix="个"
              valueStyle={{ color: '#722ed1' }}
            />
          </Col>
          <Col span={4}>
            <Statistic
              title="退回数量"
              value={campaign.metrics.bounced}
              suffix="封"
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
              <div>打开率</div>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <Progress
                type="dashboard"
                percent={campaign.metrics.clickRate}
                format={() => `${campaign.metrics.clickRate.toFixed(1)}%`}
              />
              <div>点击率</div>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <Progress
                type="dashboard"
                percent={campaign.metrics.conversionRate}
                format={() => `${campaign.metrics.conversionRate.toFixed(1)}%`}
              />
              <div>转化率</div>
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
              <div>退回率</div>
            </div>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={16}>
            <Title level={5}>效果趋势</Title>
            <div style={{ padding: 20, textAlign: 'center', color: '#999' }}>
              图表功能暂时禁用（等待 @ant-design/charts 安装）
            </div>
            {/* <Line {...trendConfig} height={300} /> */}
          </Col>
          <Col span={8}>
            <Title level={5}>转化漏斗</Title>
            <div style={{ padding: 20, textAlign: 'center', color: '#999' }}>
              图表功能暂时禁用（等待 @ant-design/charts 安装）
            </div>
            {/* <Pie {...pieConfig} height={300} /> */}
          </Col>
        </Row>
      </Card>

      {/* 参与客户列表 */}
      <Card title="参与客户列表">
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
