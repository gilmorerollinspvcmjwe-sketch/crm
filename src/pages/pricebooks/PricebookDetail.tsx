/**
 * 价格表详情页面
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Button, Space, Tag, Spin, message, Table, Divider } from 'antd';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import { Pricebook, PricebookItem } from '../../types/pricebook';
import { getPricebookById } from '../../services/pricebookService';

/**
 * 价格表详情页面组件
 */
export const PricebookDetail: React.FC = () => {
  const { t } = useTranslation();
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
        message.error(t('pricebook.detail.loadFailed'));
      } finally {
        setLoading(false);
      }
    };
    loadPricebook();
  }, [id]);

  if (loading) {
    return <Spin tip={t('common.loading')} style={{ display: 'block', margin: '100px auto' }} />;
  }

  if (!pricebook) {
    return <Card>{t('pricebook.detail.notExist')}</Card>;
  }

  /** 价格项表格列 */
  const itemColumns: ColumnsType<PricebookItem> = [
    {
      title: t('pricebook.detail.columnProductSku'),
      dataIndex: 'productSku',
      key: 'productSku',
      width: 120,
    },
    {
      title: t('pricebook.detail.columnProductName'),
      dataIndex: 'productName',
      key: 'productName',
      width: 250,
    },
    {
      title: t('pricebook.detail.columnBasePrice'),
      dataIndex: 'basePrice',
      key: 'basePrice',
      width: 120,
      render: (price: number) => `¥${price.toLocaleString()}`,
    },
    {
      title: t('pricebook.detail.columnTiers'),
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
      title: t('pricebook.detail.columnEffectiveDate'),
      key: 'effectiveDate',
      width: 180,
      render: (_: any, record: PricebookItem) => (
        <span>{record.effectiveDate} {t('pricebook.detail.validPeriod')} {record.expirationDate || t('pricebook.list.longTerm')}</span>
      ),
    },
  ];

  return (
    <div>
      <Card>
        {/* 顶部操作栏 */}
        <Space style={{ marginBottom: 24 }}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/pricebook/list')}>
            {t('pricebook.detail.back')}
          </Button>
          <Button type="primary" icon={<EditOutlined />}>
            {t('pricebook.detail.edit')}
          </Button>
        </Space>

        {/* 价格表基本信息 */}
        <Descriptions title={t('pricebook.detail.basicInfo')} bordered column={2}>
          <Descriptions.Item label={t('pricebook.detail.pricebookName')}>{pricebook.name}</Descriptions.Item>
          <Descriptions.Item label={t('pricebook.detail.type')}>
            <Tag color="blue">{pricebook.type}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label={t('pricebook.detail.status')}>
            <Tag color={pricebook.status === '启用' ? 'green' : 'default'}>
              {pricebook.status}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label={t('pricebook.detail.customer')}>
            {pricebook.customerName || t('pricebook.detail.allCustomers')}
          </Descriptions.Item>
          <Descriptions.Item label={t('pricebook.detail.currency')}>{pricebook.currency}</Descriptions.Item>
          <Descriptions.Item label={t('pricebook.detail.validPeriod')}>
            {pricebook.validFrom} {t('pricebook.detail.validPeriod')} {pricebook.validTo || t('pricebook.list.longTerm')}
          </Descriptions.Item>
          <Descriptions.Item label={t('pricebook.detail.description')} span={2}>
            {pricebook.description || t('pricebook.detail.none')}
          </Descriptions.Item>
        </Descriptions>

        <Divider orientation="left">{t('pricebook.detail.priceItems')} ({pricebook.items.length})</Divider>

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