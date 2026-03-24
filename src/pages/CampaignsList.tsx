/**
 * 营销活动列表页
 * 功能：
 * - 表格展示营销活动列表
 * - 搜索筛选：按名称、类型、状态筛选
 * - 分页：每页 20 条
 * - 快速查看活动效果
 */
import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Select,
  Tag,
  Progress,
  Typography,
  Row,
  Col,
  Statistic,
  message,
} from 'antd';
import { PlusOutlined, SearchOutlined, BarChartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Campaign, CampaignType, CampaignStatus } from '../types/marketing';
import { getCampaignsData } from '../mock/marketingData';

const { Title } = Typography;
const { Search } = Input;

/** 状态颜色映射 */
const statusColorMap: Record<CampaignStatus, string> = {
  [CampaignStatus.DRAFT]: 'default',
  [CampaignStatus.SCHEDULED]: 'blue',
  [CampaignStatus.RUNNING]: 'green',
  [CampaignStatus.PAUSED]: 'orange',
  [CampaignStatus.COMPLETED]: 'purple',
};

/** 类型颜色映射 */
const typeColorMap: Record<CampaignType, string> = {
  [CampaignType.EMAIL]: 'cyan',
  [CampaignType.SMS]: 'blue',
  [CampaignType.SOCIAL]: 'purple',
  [CampaignType.WEBINAR]: 'orange',
  [CampaignType.EVENT]: 'red',
  [CampaignType.CONTENT]: 'green',
  [CampaignType.ADS]: 'volcano',
};

/**
 * 营销活动列表页组件
 */
export const CampaignsList: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [campaignList, setCampaignList] = useState<Campaign[]>([]);
  const [filteredData, setFilteredData] = useState<Campaign[]>([]);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState<CampaignType | undefined>();
  const [filterStatus, setFilterStatus] = useState<CampaignStatus | undefined>();

  /** 加载数据 */
  const loadCampaigns = () => {
    setLoading(true);
    try {
      const data = getCampaignsData();
      setCampaignList(data);
      setFilteredData(data);
    } catch (error) {
      message.error(t('marketing.campaigns.loadFailed'));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /** 初始加载 */
  useEffect(() => {
    loadCampaigns();
  }, []);

  /** 筛选数据 */
  useEffect(() => {
    let filtered = [...campaignList];

    if (searchText) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (filterType) {
      filtered = filtered.filter((item) => item.type === filterType);
    }

    if (filterStatus) {
      filtered = filtered.filter((item) => item.status === filterStatus);
    }

    setFilteredData(filtered);
  }, [searchText, filterType, filterStatus, campaignList]);

  /** 处理搜索 */
  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  /** 重置筛选 */
  const handleReset = () => {
    setSearchText('');
    setFilterType(undefined);
    setFilterStatus(undefined);
  };

  /** 查看详情 */
  const handleViewDetail = (id: string) => {
    navigate(`/marketing/campaign/${id}`);
  };

  /** 新建活动 */
  const handleCreate = () => {
    message.info('新建活动功能开发中...');
  };

  /** 表格列定义 */
  const columns = [
    {
      title: t('marketing.campaigns.columnName'),
      dataIndex: 'name',
      key: 'name',
      width: 250,
      render: (text: string, record: Campaign) => (
        <Space direction="vertical" size={0}>
          <Typography.Text strong>{text}</Typography.Text>
          {record.description && (
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {record.description}
            </Typography.Text>
          )}
        </Space>
      ),
    },
    {
      title: t('marketing.campaigns.columnType'),
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: CampaignType) => (
        <Tag color={typeColorMap[type]}>{type}</Tag>
      ),
    },
    {
      title: t('marketing.campaigns.columnStatus'),
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: CampaignStatus) => (
        <Tag color={statusColorMap[status]}>{status}</Tag>
      ),
    },
    {
      title: t('marketing.campaigns.columnOwner'),
      dataIndex: 'ownerName',
      key: 'ownerName',
      width: 100,
    },
    {
      title: t('marketing.campaigns.columnBudget'),
      dataIndex: 'budget',
      key: 'budget',
      width: 100,
      render: (budget: number) => `¥${(budget / 10000).toFixed(1)}${t('marketing.campaigns.unitWan')}`,
    },
    {
      title: t('marketing.campaigns.columnDateRange'),
      key: 'dateRange',
      width: 180,
      render: (_: unknown, record: Campaign) => (
        <Space direction="vertical" size={0}>
          <Typography.Text style={{ fontSize: 12 }}>
            {record.startDate} {t('common.to')} {record.endDate}
          </Typography.Text>
        </Space>
      ),
    },
    {
      title: t('marketing.campaigns.columnConversionRate'),
      key: 'conversionRate',
      width: 150,
      render: (_: unknown, record: Campaign) => {
        const metrics = record.metrics || { conversionRate: 0, converted: 0, sent: 0 };
        return (
          <Space direction="vertical" size={4}>
            <Progress
              percent={(metrics.conversionRate || 0) * 10}
              size="small"
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
              format={() => `${(metrics.conversionRate || 0).toFixed(1)}%`}
            />
            <Typography.Text type="secondary" style={{ fontSize: 11 }}>
              {t('marketing.campaigns.conversionLabel')}：{metrics.converted || 0} / {t('marketing.campaigns.sentLabel')}：{metrics.sent || 0}
            </Typography.Text>
          </Space>
        );
      },
    },
    {
      title: t('common.detail'),
      key: 'action',
      width: 150,
      render: (_: unknown, record: Campaign) => (
        <Space>
          <Button
            type="link"
            size="small"
            onClick={() => handleViewDetail(record.id)}
          >
            {t('marketing.campaigns.viewDetail')}
          </Button>
          <Button
            type="link"
            size="small"
            icon={<BarChartOutlined />}
            onClick={() => message.info(t('common.comingSoon'))}
          >
            {t('marketing.campaigns.analyze')}
          </Button>
        </Space>
      ),
    },
  ];

  /** 统计卡片数据 */
  const totalBudget = campaignList.reduce((sum, item) => sum + (item.budget || 0), 0);
  const runningCount = campaignList.filter((item) => item.status === CampaignStatus.RUNNING).length;
  const totalSent = campaignList.reduce((sum, item) => sum + (item.metrics?.sent || 0), 0);
  const totalConverted = campaignList.reduce((sum, item) => sum + (item.metrics?.converted || 0), 0);

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Statistic
              title={t('marketing.campaigns.totalCampaigns')}
              value={campaignList.length}
              suffix={t('marketing.campaigns.unit')}
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title={t('marketing.campaigns.running')}
              value={runningCount}
              suffix={t('marketing.campaigns.unit')}
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title={t('marketing.campaigns.totalBudget')}
              value={(totalBudget / 10000).toFixed(1)}
              suffix={t('marketing.campaigns.unitWan')}
              valueStyle={{ color: '#faad14' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title={t('marketing.campaigns.totalConversion')}
              value={totalConverted}
              suffix={` / ${totalSent}`}
              valueStyle={{ color: '#722ed1' }}
            />
          </Col>
        </Row>
      </Card>

      <Card
        title={t('marketing.campaigns.title')}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            {t('marketing.campaigns.newCampaign')}
          </Button>
        }
      >
        <Space style={{ marginBottom: 16 }} wrap>
          <Search
            placeholder={t('marketing.campaigns.searchPlaceholder')}
            allowClear
            onSearch={handleSearch}
            style={{ width: 300 }}
            prefix={<SearchOutlined />}
          />
          <Select
            placeholder={t('marketing.campaigns.campaignType')}
            allowClear
            style={{ width: 150 }}
            onChange={(value) => setFilterType(value)}
            options={Object.values(CampaignType).map((type) => ({ label: type, value: type }))}
          />
          <Select
            placeholder={t('marketing.campaigns.campaignStatus')}
            allowClear
            style={{ width: 150 }}
            onChange={(value) => setFilterStatus(value)}
            options={Object.values(CampaignStatus).map((status) => ({ label: status, value: status }))}
          />
          <Button onClick={handleReset}>{t('common.reset')}</Button>
        </Space>

        <Table
          loading={loading}
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `${t('common.total')} ${total} ${t('marketing.campaigns.unit')}`,
          }}
        />
      </Card>
    </div>
  );
};

export default CampaignsList;
