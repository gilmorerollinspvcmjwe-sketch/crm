/**
 * 价格表列表页面
 */
import React, { useState, useEffect } from 'react';
import { Card, Table, Input, Select, Space, Button, Tag, Popconfirm, message, Modal } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import { Pricebook, PricebookType, PricebookStatus } from '../../types/pricebook';
import { getPricebookList, deletePricebook, createPricebook, updatePricebook } from '../../services/pricebookService';
import { PricebookForm } from '../../components/Pricebook/PricebookForm';
import { PricebookEntryForm } from '../../components/Pricebook/PricebookEntryForm';
import { getProducts } from '../../services/productService';
import { Product } from '../../types/cpq';

const { Option } = Select;

/**
 * 价格表列表页面组件
 */
export const PricebookList: React.FC = () => {
  const { t } = useTranslation();
  const [pricebooks, setPricebooks] = useState<Pricebook[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState<PricebookType | ''>('');
  const [statusFilter, setStatusFilter] = useState<PricebookStatus | ''>('');
  
  // 价格表表单状态
  const [pricebookModalVisible, setPricebookModalVisible] = useState(false);
  const [editingPricebook, setEditingPricebook] = useState<Pricebook | null>(null);
  const [pricebookFormLoading, setPricebookFormLoading] = useState(false);
  
  // 价格表条目表单状态
  const [entryModalVisible, setEntryModalVisible] = useState(false);
  const [selectedPricebook, setSelectedPricebook] = useState<Pricebook | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  /** 加载产品列表（用于条目表单） */
  const loadProducts = async () => {
    try {
      const result = await getProducts({ pageSize: 100 });
      setProducts(result.list);
    } catch (error) {
      console.error(t('pricebook.list.loadFailed') + ':', error);
    }
  };

  /** 加载价格表列表 */
  const loadPricebooks = async () => {
    setLoading(true);
    try {
      const result = await getPricebookList({
        name: searchText || undefined,
        type: typeFilter || undefined,
        status: statusFilter || undefined,
        page,
        pageSize,
      });
      setPricebooks(result.list);
      setTotal(result.total);
    } catch (error) {
      message.error(t('pricebook.list.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPricebooks();
    loadProducts();
  }, [page, pageSize, searchText, typeFilter, statusFilter]);

  /** 打开新建价格表弹窗 */
  const handleCreatePricebook = () => {
    setEditingPricebook(null);
    setPricebookModalVisible(true);
  };

  /** 打开编辑价格表弹窗 */
  const handleEditPricebook = (pricebook: Pricebook) => {
    setEditingPricebook(pricebook);
    setPricebookModalVisible(true);
  };

  /** 打开添加条目弹窗 */
  const handleAddEntry = (pricebook: Pricebook) => {
    setSelectedPricebook(pricebook);
    setEntryModalVisible(true);
  };

  /** 处理删除 */
  const handleDelete = async (id: string) => {
    try {
      await deletePricebook(id);
      message.success(t('pricebook.list.deleteSuccess'));
      loadPricebooks();
    } catch (error) {
      message.error(t('pricebook.list.deleteFailed'));
    }
  };

  /** 处理价格表表单提交 */
  const handlePricebookSubmit = async (values: any) => {
    setPricebookFormLoading(true);
    try {
      if (editingPricebook) {
        await updatePricebook(editingPricebook.id, values);
        message.success(t('pricebook.form.updateSuccess'));
      } else {
        await createPricebook({
          ...values,
          currency: 'CNY',
          items: [],
          createdBy: 'USER001',
          createdByName: '管理员',
        });
        message.success(t('pricebook.form.createSuccess'));
      }
      setPricebookModalVisible(false);
      loadPricebooks();
    } catch (error) {
      message.error(t('common.operationFailed'));
    } finally {
      setPricebookFormLoading(false);
    }
  };

  /** 处理条目表单提交 */
  const handleEntrySubmit = async (values: any) => {
    try {
      // Mock 添加条目
      message.success(t('pricebook.entryForm.productAdded'));
      setEntryModalVisible(false);
      loadPricebooks();
    } catch (error) {
      message.error(t('pricebook.entryForm.operationFailed'));
    }
  };

  /** 表格列定义 */
  const columns: ColumnsType<Pricebook> = [
    {
      title: t('pricebook.list.columnName'),
      dataIndex: 'name',
      key: 'name',
      width: 250,
    },
    {
      title: t('pricebook.list.columnType'),
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: PricebookType) => (
        <Tag color="blue">{type}</Tag>
      ),
    },
    {
      title: t('pricebook.list.columnStatus'),
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: PricebookStatus) => {
        const colorMap: Record<PricebookStatus, string> = {
          [PricebookStatus.ACTIVE]: 'green',
          [PricebookStatus.INACTIVE]: 'default',
          [PricebookStatus.DRAFT]: 'orange',
        };
        return <Tag color={colorMap[status]}>{status}</Tag>;
      },
    },
    {
      title: t('pricebook.list.columnCustomer'),
      dataIndex: 'customerName',
      key: 'customerName',
      width: 200,
      render: (name?: string) => name || '-',
    },
    {
      title: t('pricebook.list.columnValidPeriod'),
      key: 'validPeriod',
      width: 180,
      render: (_: any, record: Pricebook) => (
        <span>{record.validFrom} {t('pricebook.detail.validPeriod')} {record.validTo || t('pricebook.list.longTerm')}</span>
      ),
    },
    {
      title: t('pricebook.list.columnItemCount'),
      key: 'itemCount',
      width: 100,
      render: (_: any, record: Pricebook) => record.items?.length || 0,
    },
    {
      title: t('common.edit'),
      key: 'action',
      width: 220,
      render: (_: any, record: Pricebook) => (
        <Space>
          <Button 
            type="link" 
            size="small" 
            icon={<PlusOutlined />}
            onClick={() => handleAddEntry(record)}
          >
            {t('pricebook.list.addProduct')}
          </Button>
          <Button 
            type="link" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => handleEditPricebook(record)}
          >
            {t('pricebook.list.edit')}
          </Button>
          {!record.isSystem && (
            <Popconfirm
              title={t('pricebook.list.deleteConfirm')}
              onConfirm={() => handleDelete(record.id)}
            >
              <Button type="link" size="small" danger icon={<DeleteOutlined />}>
                {t('pricebook.list.delete')}
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card>
        {/* 顶部操作栏 */}
        <Space style={{ marginBottom: 16, width: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <Input
              placeholder={t('pricebook.list.searchPlaceholder')}
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
              allowClear
              onPressEnter={loadPricebooks}
            />
            <Select
              placeholder={t('pricebook.list.typeFilter')}
              value={typeFilter}
              onChange={setTypeFilter}
              style={{ width: 150 }}
              allowClear
            >
              <Option value={PricebookType.STANDARD}>{t('pricebook.list.standardPricebook')}</Option>
              <Option value={PricebookType.CUSTOMER}>{t('pricebook.list.customerPricebook')}</Option>
              <Option value={PricebookType.PARTNER}>{t('pricebook.list.partnerPricebook')}</Option>
              <Option value={PricebookType.PROMOTION}>{t('pricebook.list.promotionPricebook')}</Option>
            </Select>
            <Select
              placeholder={t('pricebook.list.statusFilter')}
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 120 }}
              allowClear
            >
              <Option value={PricebookStatus.ACTIVE}>{t('pricebook.list.statusActive')}</Option>
              <Option value={PricebookStatus.INACTIVE}>{t('pricebook.list.statusInactive')}</Option>
              <Option value={PricebookStatus.DRAFT}>{t('pricebook.list.statusDraft')}</Option>
            </Select>
            <Button onClick={loadPricebooks}>{t('common.query')}</Button>
          </Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreatePricebook}>
            {t('pricebook.list.newPricebook')}
          </Button>
        </Space>

        {/* 价格表表格 */}
        <Table
          columns={columns}
          dataSource={pricebooks}
          rowKey="id"
          loading={loading}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            showTotal: (total) => `${t('common.total')} ${total} ${t('marketing.campaigns.unit')}`,
            onChange: (page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
            },
          }}
        />
      </Card>

      {/* 新建/编辑价格表弹窗 */}
      <Modal
        title={editingPricebook ? t('pricebook.form.basicInfo') : t('pricebook.list.newPricebook')}
        open={pricebookModalVisible}
        onCancel={() => setPricebookModalVisible(false)}
        footer={null}
        width={700}
        destroyOnClose
      >
        <PricebookForm
          initialValues={editingPricebook || undefined}
          onSubmit={handlePricebookSubmit}
          onCancel={() => setPricebookModalVisible(false)}
          loading={pricebookFormLoading}
          isEdit={!!editingPricebook}
        />
      </Modal>

      {/* 添加价格表条目弹窗 */}
      <Modal
        title={`${t('pricebook.list.addProduct')} - ${selectedPricebook?.name}`}
        open={entryModalVisible}
        onCancel={() => setEntryModalVisible(false)}
        footer={null}
        width={800}
        destroyOnClose
      >
        <PricebookEntryForm
          products={products}
          onSubmit={handleEntrySubmit}
          onCancel={() => setEntryModalVisible(false)}
        />
      </Modal>
    </div>
  );
};

export default PricebookList;