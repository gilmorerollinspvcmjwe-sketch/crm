/**
 * 价格表详情页面
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Button, Space, Tag, Spin, message, Table, Divider } from 'antd';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Pricebook, PricebookItem } from '../../types/pricebook';
import { getPricebookById } from '../../services/pricebookService';

/**
 * 价格表详情页面组件
 */
export const PricebookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pricebook, setPricebook] = useState<Pricebook | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPricebook = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await getPricebookById(id);
        setPricebook(data || null);
      } catch (error) {
        message.error('加载价格表详情失败');
      } finally {
        setLoading(false);
      }
    };
    loadPricebook();
  }, [id]);

  if (loading) {
    return <Spin tip="加载中..." style={{ display: 'block', margin: '100px auto' }} />;
  }

  if (!pricebook) {
    return <Card>价格表不存在</Card>;
  }

  /** 价格项表格列 */
  const itemColumns: ColumnsType<PricebookItem> = [
    {
      title: '产品编号',
      dataIndex: 'productSku',
      key: 'productSku',
      width: 120,
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      key: 'productName',
      width: 250,
    },
    {
      title: '基础价格',
      dataIndex: 'basePrice',
      key: 'basePrice',
      width: 120,
      render: (price: number) => `¥${price.toLocaleString()}`,
    },
    {
      title: '阶梯定价',
      key: 'tiers',
      render: (_: any, record: PricebookItem) => (
        <Space direction="vertical" size="small">
          {record.tiers.map((tier, idx) => (
            <Tag key={idx} color="blue">
              {tier.minQuantity}-{tier.maxQuantity || '∞'}: ¥{tier.unitPrice.toLocaleString()}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '有效期',
      key: 'effectiveDate',
      width: 180,
      render: (_: any, record: PricebookItem) => (
        <span>{record.effectiveDate} 至 {record.expirationDate || '长期'}</span>
      ),
    },
  ];

  return (
    <div>
      <Card>
        {/* 顶部操作栏 */}
        <Space style={{ marginBottom: 24 }}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/pricebook/list')}>
            返回
          </Button>
          <Button type="primary" icon={<EditOutlined />}>
            编辑
          </Button>
        </Space>

        {/* 价格表基本信息 */}
        <Descriptions title="基本信息" bordered column={2}>
          <Descriptions.Item label="价格表名称">{pricebook.name}</Descriptions.Item>
          <Descriptions.Item label="类型">
            <Tag color="blue">{pricebook.type}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={pricebook.status === '启用' ? 'green' : 'default'}>
              {pricebook.status}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="客户">
            {pricebook.customerName || '全部客户'}
          </Descriptions.Item>
          <Descriptions.Item label="币种">{pricebook.currency}</Descriptions.Item>
          <Descriptions.Item label="有效期">
            {pricebook.validFrom} 至 {pricebook.validTo || '长期'}
          </Descriptions.Item>
          <Descriptions.Item label="描述" span={2}>
            {pricebook.description || '无'}
          </Descriptions.Item>
        </Descriptions>

        <Divider orientation="left">价格项明细 ({pricebook.items.length})</Divider>

        {/* 价格项表格 */}
        <Table
          columns={itemColumns}
          dataSource={pricebook.items}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          size="small"
        />
      </Card>
    </div>
  );
};

export default PricebookDetail;
