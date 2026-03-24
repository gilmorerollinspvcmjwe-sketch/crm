/**
 * 报价单列表页
 * 功能：
 * - 表格展示报价单列表
 * - 搜索筛选：按报价单号、客户名称、状态筛选
 * - 分页：每页 20 条
 * - 操作：查看、编辑、删除、转合同
 */
import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Space,
  message,
  Modal,
  Form,
  Input,
  Select,
  Table,
  Tag,
  Typography,
} from 'antd';
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, FileDoneOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { ColumnsType } from 'antd/es/table';
import { Quote, QuoteStatus, QuoteFilter } from '../types/cpq';
import { getQuoteList } from '../mock/cpqData';

const { Text } = Typography;
const { Option } = Select;

/** 状态标签颜色映射 */
const statusColorMap: Record<QuoteStatus, string> = {
  [QuoteStatus.DRAFT]: 'default',
  [QuoteStatus.SENT]: 'blue',
  [QuoteStatus.ACCEPTED]: 'green',
  [QuoteStatus.REJECTED]: 'red',
  [QuoteStatus.EXPIRED]: 'orange',
};

/**
 * 报价单列表页组件
 */
export const QuotesList: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [quoteList, setQuoteList] = useState<Quote[]>([]);
  const [total, setTotal] = useState(0);

/** 状态选项 */
const statusOptions = [
  { label: t('quote.list.allStatus'), value: '' },
  { label: QuoteStatus.DRAFT, value: QuoteStatus.DRAFT },
  { label: QuoteStatus.SENT, value: QuoteStatus.SENT },
  { label: QuoteStatus.ACCEPTED, value: QuoteStatus.ACCEPTED },
  { label: QuoteStatus.REJECTED, value: QuoteStatus.REJECTED },
  { label: QuoteStatus.EXPIRED, value: QuoteStatus.EXPIRED },
];
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [filters, setFilters] = useState<QuoteFilter>({});
  const [form] = Form.useForm();

  /** 加载报价单列表 */
  const loadQuoteList = () => {
    setLoading(true);
    try {
      const { list, total } = getQuoteList({
        ...filters,
        page,
        pageSize,
      });
      setQuoteList(list);
      setTotal(total);
    } catch (error) {
      message.error(t('quote.list.loadError'));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /** 初始加载 */
  useEffect(() => {
    loadQuoteList();
  }, [page, filters]);

  /** 处理搜索 */
  const handleSearch = (values: QuoteFilter) => {
    setFilters(values);
    setPage(1);
  };

  /** 处理重置 */
  const handleReset = () => {
    form.resetFields();
    setFilters({});
    setPage(1);
  };

  /** 处理分页变化 */
  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
  };

  /** 查看详情 */
  const handleViewDetail = (id: string) => {
    navigate(`/quote/${id}`);
  };

  /** 编辑报价单 */
  const handleEdit = (id: string) => {
    navigate(`/quote/${id}/edit`);
  };

  /** 删除报价单 */
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: t('quote.list.deleteConfirm'),
      content: t('quote.list.deleteContent'),
      okText: t('common.actions.confirmDelete'),
      cancelText: t('common.actions.cancel'),
      okType: 'danger',
      onOk: () => {
        message.success(t('quote.list.deleteSuccess'));
        loadQuoteList();
      },
    });
  };

  /** 转合同 */
  const handleConvertToContract = (id: string) => {
    Modal.confirm({
      title: t('quote.list.convertConfirm'),
      content: t('quote.list.convertContent'),
      okText: t('common.actions.confirm'),
      cancelText: t('common.actions.cancel'),
      onOk: () => {
        message.success(t('quote.list.convertSuccess'));
        loadQuoteList();
      },
    });
  };

  /** 新建报价单 */
  const handleCreate = () => {
    navigate('/quote/new');
  };

  /** 表格列定义 */
  const columns: ColumnsType<Quote> = [
    {
      title: t('quote.list.columns.quoteNumber'),
      dataIndex: 'quoteNumber',
      key: 'quoteNumber',
      width: 130,
      fixed: 'left',
      sorter: (a, b) => a.quoteNumber.localeCompare(b.quoteNumber),
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: t('quote.list.columns.customerName'),
      dataIndex: 'customerName',
      key: 'customerName',
      width: 200,
      ellipsis: true,
    },
    {
      title: t('quote.list.columns.contactName'),
      dataIndex: 'contactName',
      key: 'contactName',
      width: 100,
      ellipsis: true,
    },
    {
      title: t('quote.list.columns.opportunityName'),
      dataIndex: 'opportunityName',
      key: 'opportunityName',
      width: 150,
      ellipsis: true,
    },
    {
      title: t('quote.list.columns.status'),
      dataIndex: 'status',
      key: 'status',
      width: 90,
      render: (status: QuoteStatus) => (
        <Tag color={statusColorMap[status]}>{status}</Tag>
      ),
    },
    {
      title: t('quote.list.columns.validUntil'),
      dataIndex: 'validUntil',
      key: 'validUntil',
      width: 110,
      sorter: (a, b) => a.validUntil.localeCompare(b.validUntil),
    },
    {
      title: t('quote.list.columns.productCount'),
      dataIndex: 'products',
      key: 'products',
      width: 90,
      render: (products: any[]) => `${products.length} ${t('quote.list.columns.productCountUnit')}`,
    },
    {
      title: t('quote.list.columns.totalAmount'),
      dataIndex: 'grandTotal',
      key: 'grandTotal',
      width: 130,
      sorter: (a, b) => a.grandTotal - b.grandTotal,
      render: (amount: number) => (
        <Text strong style={{ color: '#1890ff' }}>
          ¥{amount.toLocaleString()}
        </Text>
      ),
    },
    {
      title: t('quote.list.columns.createdBy'),
      dataIndex: 'createdByName',
      key: 'createdByName',
      width: 100,
    },
    {
      title: t('quote.list.columns.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
    },
    {
      title: t('quote.list.columns.actions'),
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_: any, record: Quote) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record.id)}
          >
            {t('quote.list.actions.view')}
          </Button>
          {record.status === QuoteStatus.DRAFT && (
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record.id)}
            >
              {t('quote.list.actions.edit')}
            </Button>
          )}
          {record.status === QuoteStatus.ACCEPTED && !record.convertedToContractId && (
            <Button
              type="link"
              size="small"
              icon={<FileDoneOutlined />}
              onClick={() => handleConvertToContract(record.id)}
            >
              {t('quote.list.actions.convert')}
            </Button>
          )}
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            {t('quote.list.actions.delete')}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <div style={{ marginBottom: 16 }}>
        <Form
          form={form}
          onFinish={handleSearch}
          layout="inline"
          initialValues={{ status: '' }}
        >
          <Form.Item name="quoteNumber" label={t('quote.detail.quoteNumber')}>
            <Input placeholder={t('quote.list.searchPlaceholder')} style={{ width: 200 }} allowClear />
          </Form.Item>
          <Form.Item name="customerName" label={t('quote.detail.customerName')}>
            <Input placeholder={t('quote.list.customerPlaceholder')} style={{ width: 200 }} allowClear />
          </Form.Item>
          <Form.Item name="status" label={t('quote.detail.status')}>
            <Select placeholder={t('quote.list.statusPlaceholder')} style={{ width: 150 }} allowClear>
              {statusOptions.map(opt => (
                <Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {t('common.actions.search')}
              </Button>
              <Button onClick={handleReset}>{t('common.actions.reset')}</Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                {t('quote.list.newQuote')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={quoteList}
        loading={loading}
        pagination={{
          current: page,
          pageSize,
          total,
          onChange: handlePageChange,
          showSizeChanger: true,
          showTotal: (total) => t('quote.list.pagination.total', { total }),
        }}
        scroll={{ x: 1400 }}
        size="middle"
      />
    </Card>
  );
};

export default QuotesList;
