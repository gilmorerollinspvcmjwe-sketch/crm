/**
 * 目标客户列表管理页
 * 功能：
 * - 表格展示目标客户列表
 * - 搜索筛选
 * - 查看列表详情和客户数量
 * - 新建/编辑列表
 */
import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Tag,
  Typography,
  Modal,
  Progress,
  Row,
  Col,
  Statistic,
  message,
  Descriptions,
  Divider,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  UsergroupAddOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { TargetList } from '../types/marketing';
import { getTargetListsData } from '../mock/marketingData';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

/**
 * 目标客户列表管理页组件
 */
export const TargetLists: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [targetLists, setTargetLists] = useState<TargetList[]>([]);
  const [filteredData, setFilteredData] = useState<TargetList[]>([]);
  const [searchText, setSearchText] = useState('');
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailList, setDetailList] = useState<TargetList | null>(null);

  /** 加载数据 */
  const loadTargetLists = () => {
    setLoading(true);
    try {
      const data = getTargetListsData();
      setTargetLists(data);
      setFilteredData(data);
    } catch (error) {
      message.error(t('marketing.targetLists.loadFailed'));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /** 初始加载 */
  useEffect(() => {
    loadTargetLists();
  }, []);

  /** 筛选数据 */
  useEffect(() => {
    let filtered = [...targetLists];

    if (searchText) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.criteria.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredData(filtered);
  }, [searchText, targetLists]);

  /** 处理搜索 */
  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  /** 重置筛选 */
  const handleReset = () => {
    setSearchText('');
  };

  /** 查看详情 */
  const handleViewDetail = (list: TargetList) => {
    setDetailList(list);
    setDetailVisible(true);
  };

  /** 新建列表 */
  const handleCreate = () => {
    Modal.info({
      title: t('marketing.targetLists.newList'),
      content: t('common.loading'),
      width: 600,
    });
  };

  /** 编辑列表 */
  const handleEdit = (list: TargetList) => {
    Modal.info({
      title: t('marketing.targetLists.edit'),
      content: t('common.loading'),
      width: 600,
    });
  };

  /** 删除列表 */
  const handleDelete = (list: TargetList) => {
    Modal.confirm({
      title: t('common.confirm'),
      content: t('marketing.targetLists.deleteConfirm', { name: list.name }),
      onOk: () => {
        setTargetLists(targetLists.filter((l) => l.id !== list.id));
        message.success(t('marketing.targetLists.deletedSuccess'));
      },
    });
  };

  /** 表格列定义 */
  const columns = [
    {
      title: t('marketing.targetLists.columnName'),
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text: string, record: TargetList) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          {record.description && (
            <Text type="secondary" style={{ fontSize: 12 }} ellipsis>
              {record.description}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: t('marketing.targetLists.columnCustomerCount'),
      dataIndex: 'customerCount',
      key: 'customerCount',
      width: 120,
      render: (count: number) => (
        <Tag color="blue" style={{ fontSize: 14 }}>
          <UsergroupAddOutlined style={{ marginRight: 4 }} />
          {count.toLocaleString()}
        </Tag>
      ),
    },
    {
      title: t('marketing.targetLists.columnCriteria'),
      dataIndex: 'criteria',
      key: 'criteria',
      width: 300,
      ellipsis: true,
      render: (criteria: string) => (
        <Text code style={{ fontSize: 12 }}>
          {criteria}
        </Text>
      ),
    },
    {
      title: t('marketing.targetLists.columnCreator'),
      dataIndex: 'createdByName',
      key: 'createdByName',
      width: 100,
    },
    {
      title: t('marketing.targetLists.columnUpdateTime'),
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 180,
      render: (time: string) => new Date(time).toLocaleString('zh-CN'),
    },
    {
      title: t('common.edit'),
      key: 'action',
      width: 200,
      render: (_: unknown, record: TargetList) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            {t('marketing.targetLists.viewDetail')}
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            {t('marketing.targetLists.edit')}
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            {t('marketing.targetLists.delete')}
          </Button>
        </Space>
      ),
    },
  ];

  /** 统计数据 */
  const totalCustomers = targetLists.reduce((sum, list) => sum + list.customerCount, 0);
  const avgCustomers = Math.round(totalCustomers / targetLists.length);
  const maxCustomers = Math.max(...targetLists.map((list) => list.customerCount));

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Statistic
              title={t('marketing.targetLists.totalLists')}
              value={targetLists.length}
              suffix={t('marketing.campaigns.unit')}
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title={t('marketing.targetLists.totalCustomers')}
              value={totalCustomers.toLocaleString()}
              suffix={t('common.items')}
              valueStyle={{ color: '#722ed1' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title={t('marketing.targetLists.avgCustomers')}
              value={avgCustomers.toLocaleString()}
              suffix={t('common.items')}
              valueStyle={{ color: '#faad14' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title={t('marketing.targetLists.maxList')}
              value={maxCustomers.toLocaleString()}
              suffix={t('common.items')}
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
        </Row>
      </Card>

      <Card
        title={t('marketing.targetLists.title')}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            {t('marketing.targetLists.newList')}
          </Button>
        }
      >
        <Space style={{ marginBottom: 16 }} wrap>
          <Search
            placeholder={t('marketing.targetLists.searchPlaceholder')}
            allowClear
            onSearch={handleSearch}
            style={{ width: 350 }}
            prefix={<SearchOutlined />}
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

      {/* 详情弹窗 */}
      <Modal
        title={
          <Space>
            <FilterOutlined />
            <span>{t('marketing.targetLists.listDetail')}</span>
          </Space>
        }
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            {t('common.cancel')}
          </Button>,
          <Button key="edit" type="primary" onClick={() => handleEdit(detailList!)}>
            {t('marketing.targetLists.edit')}
          </Button>,
        ]}
      >
        {detailList && (
          <div>
            <Title level={4}>{detailList.name}</Title>
            <Divider style={{ margin: '12px 0' }} />

            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label={t('marketing.targetLists.listName')}>{detailList.name}</Descriptions.Item>
              <Descriptions.Item label={t('marketing.targetLists.customerCount')}>
                <Tag color="blue" style={{ fontSize: 14 }}>
                  <UsergroupAddOutlined style={{ marginRight: 4 }} />
                  {detailList.customerCount.toLocaleString()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label={t('marketing.targetLists.columnCreator')}>{detailList.createdByName}</Descriptions.Item>
              <Descriptions.Item label={t('marketing.targetLists.createdAt')}>
                {new Date(detailList.createdAt).toLocaleString('zh-CN')}
              </Descriptions.Item>
              <Descriptions.Item label={t('marketing.targetLists.updatedAt')}>
                {new Date(detailList.updatedAt).toLocaleString('zh-CN')}
              </Descriptions.Item>
              <Descriptions.Item label={t('marketing.campaignDetail.description')} span={2}>
                {detailList.description || t('marketing.campaignDetail.none')}
              </Descriptions.Item>
              <Descriptions.Item label={t('marketing.targetLists.criteria')} span={2}>
                <Paragraph
                  copyable={{ text: detailList.criteria }}
                  code
                  style={{ background: '#f5f5f5', padding: 8 }}
                >
                  {detailList.criteria}
                </Paragraph>
              </Descriptions.Item>
            </Descriptions>

            <Divider>{t('marketing.targetLists.relatedCampaigns')}</Divider>
            <Text type="secondary">
              {t('marketing.targetLists.noRelatedCampaigns')}
            </Text>

            <Divider />
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Progress
                type="dashboard"
                percent={Math.min(100, (detailList.customerCount / maxCustomers) * 100)}
                format={() => `${((detailList.customerCount / maxCustomers) * 100).toFixed(1)}%`}
              />
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">{t('marketing.targetLists.capacityRatio')}</Text>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TargetLists;