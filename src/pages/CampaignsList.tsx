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
      message.error('加载营销活动列表失败');
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
      title: '活动名称',
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
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: CampaignType) => (
        <Tag color={typeColorMap[type]}>{type}</Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: CampaignStatus) => (
        <Tag color={statusColorMap[status]}>{status}</Tag>
      ),
    },
    {
      title: '负责人',
      dataIndex: 'ownerName',
      key: 'ownerName',
      width: 100,
    },
    {
      title: '预算',
      dataIndex: 'budget',
      key: 'budget',
      width: 100,
      render: (budget: number) => `¥${(budget / 10000).toFixed(1)}万`,
    },
    {
      title: '时间周期',
      key: 'dateRange',
      width: 180,
      render: (_: unknown, record: Campaign) => (
        <Space direction="vertical" size={0}>
          <Typography.Text style={{ fontSize: 12 }}>
            {record.startDate} 至 {record.endDate}
          </Typography.Text>
        </Space>
      ),
    },
    {
      title: '转化率',
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
              转化：{metrics.converted || 0} / 发送：{metrics.sent || 0}
            </Typography.Text>
          </Space>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: unknown, record: Campaign) => (
        <Space>
          <Button
            type="link"
            size="small"
            onClick={() => handleViewDetail(record.id)}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            icon={<BarChartOutlined />}
            onClick={() => message.info('效果分析功能开发中...')}
          >
            分析
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
              title="总活动数"
              value={campaignList.length}
              suffix="个"
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="进行中"
              value={runningCount}
              suffix="个"
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="总预算"
              value={(totalBudget / 10000).toFixed(1)}
              suffix="万元"
              valueStyle={{ color: '#faad14' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="总转化"
              value={totalConverted}
              suffix={` / ${totalSent}`}
              valueStyle={{ color: '#722ed1' }}
            />
          </Col>
        </Row>
      </Card>

      <Card
        title="营销活动列表"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建活动
          </Button>
        }
      >
        <Space style={{ marginBottom: 16 }} wrap>
          <Search
            placeholder="搜索活动名称或描述"
            allowClear
            onSearch={handleSearch}
            style={{ width: 300 }}
            prefix={<SearchOutlined />}
          />
          <Select
            placeholder="活动类型"
            allowClear
            style={{ width: 150 }}
            onChange={(value) => setFilterType(value)}
            options={Object.values(CampaignType).map((type) => ({ label: type, value: type }))}
          />
          <Select
            placeholder="活动状态"
            allowClear
            style={{ width: 150 }}
            onChange={(value) => setFilterStatus(value)}
            options={Object.values(CampaignStatus).map((status) => ({ label: status, value: status }))}
          />
          <Button onClick={handleReset}>重置</Button>
        </Space>

        <Table
          loading={loading}
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 个活动`,
          }}
        />
      </Card>
    </div>
  );
};

export default CampaignsList;
