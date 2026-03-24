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
import { TargetList } from '../types/marketing';
import { getTargetListsData } from '../mock/marketingData';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

/**
 * 目标客户列表管理页组件
 */
export const TargetLists: React.FC = () => {
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
      message.error('加载目标列表失败');
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
      title: '新建目标列表',
      content: '新建目标列表功能开发中...',
      width: 600,
    });
  };

  /** 编辑列表 */
  const handleEdit = (list: TargetList) => {
    Modal.info({
      title: '编辑目标列表',
      content: '编辑目标列表功能开发中...',
      width: 600,
    });
  };

  /** 删除列表 */
  const handleDelete = (list: TargetList) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除目标列表"${list.name}"吗？此操作不可恢复。`,
      onOk: () => {
        setTargetLists(targetLists.filter((l) => l.id !== list.id));
        message.success('列表已删除');
      },
    });
  };

  /** 表格列定义 */
  const columns = [
    {
      title: '列表名称',
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
      title: '客户数量',
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
      title: '筛选条件',
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
      title: '创建人',
      dataIndex: 'createdByName',
      key: 'createdByName',
      width: 100,
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 180,
      render: (time: string) => new Date(time).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
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
            详情
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            删除
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
              title="目标列表数"
              value={targetLists.length}
              suffix="个"
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="覆盖客户总数"
              value={totalCustomers.toLocaleString()}
              suffix="人"
              valueStyle={{ color: '#722ed1' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="平均客户数"
              value={avgCustomers.toLocaleString()}
              suffix="人/列表"
              valueStyle={{ color: '#faad14' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="最大列表"
              value={maxCustomers.toLocaleString()}
              suffix="人"
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
        </Row>
      </Card>

      <Card
        title="目标客户列表管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建列表
          </Button>
        }
      >
        <Space style={{ marginBottom: 16 }} wrap>
          <Search
            placeholder="搜索列表名称、描述或筛选条件"
            allowClear
            onSearch={handleSearch}
            style={{ width: 350 }}
            prefix={<SearchOutlined />}
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
            showTotal: (total) => `共 ${total} 个列表`,
          }}
        />
      </Card>

      {/* 详情弹窗 */}
      <Modal
        title={
          <Space>
            <FilterOutlined />
            <span>目标列表详情</span>
          </Space>
        }
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            关闭
          </Button>,
          <Button key="edit" type="primary" onClick={() => handleEdit(detailList!)}>
            编辑列表
          </Button>,
        ]}
      >
        {detailList && (
          <div>
            <Title level={4}>{detailList.name}</Title>
            <Divider style={{ margin: '12px 0' }} />

            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="列表名称">{detailList.name}</Descriptions.Item>
              <Descriptions.Item label="客户数量">
                <Tag color="blue" style={{ fontSize: 14 }}>
                  <UsergroupAddOutlined style={{ marginRight: 4 }} />
                  {detailList.customerCount.toLocaleString()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="创建人">{detailList.createdByName}</Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {new Date(detailList.createdAt).toLocaleString('zh-CN')}
              </Descriptions.Item>
              <Descriptions.Item label="更新时间">
                {new Date(detailList.updatedAt).toLocaleString('zh-CN')}
              </Descriptions.Item>
              <Descriptions.Item label="描述" span={2}>
                {detailList.description || '无'}
              </Descriptions.Item>
              <Descriptions.Item label="筛选条件" span={2}>
                <Paragraph
                  copyable={{ text: detailList.criteria }}
                  code
                  style={{ background: '#f5f5f5', padding: 8 }}
                >
                  {detailList.criteria}
                </Paragraph>
              </Descriptions.Item>
            </Descriptions>

            <Divider>关联营销活动</Divider>
            <Text type="secondary">
              此目标列表当前未被任何营销活动使用
            </Text>

            <Divider />
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Progress
                type="dashboard"
                percent={Math.min(100, (detailList.customerCount / maxCustomers) * 100)}
                format={() => `${((detailList.customerCount / maxCustomers) * 100).toFixed(1)}%`}
              />
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">列表容量占比（相对于最大列表）</Text>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TargetLists;
