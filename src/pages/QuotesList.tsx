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

/** 状态选项 */
const statusOptions = [
  { label: '全部', value: '' },
  { label: QuoteStatus.DRAFT, value: QuoteStatus.DRAFT },
  { label: QuoteStatus.SENT, value: QuoteStatus.SENT },
  { label: QuoteStatus.ACCEPTED, value: QuoteStatus.ACCEPTED },
  { label: QuoteStatus.REJECTED, value: QuoteStatus.REJECTED },
  { label: QuoteStatus.EXPIRED, value: QuoteStatus.EXPIRED },
];

/**
 * 报价单列表页组件
 */
export const QuotesList: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [quoteList, setQuoteList] = useState<Quote[]>([]);
  const [total, setTotal] = useState(0);
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
      message.error('加载报价单列表失败');
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
      title: '确认删除',
      content: '确定要删除该报价单吗？删除后无法恢复。',
      okText: '确认删除',
      cancelText: '取消',
      okType: 'danger',
      onOk: () => {
        message.success('删除报价单成功');
        loadQuoteList();
      },
    });
  };

  /** 转合同 */
  const handleConvertToContract = (id: string) => {
    Modal.confirm({
      title: '转合同确认',
      content: '确定要将该报价单转为合同吗？',
      okText: '确认转换',
      cancelText: '取消',
      onOk: () => {
        message.success('报价单已转为合同');
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
      title: '报价单号',
      dataIndex: 'quoteNumber',
      key: 'quoteNumber',
      width: 130,
      fixed: 'left',
      sorter: (a, b) => a.quoteNumber.localeCompare(b.quoteNumber),
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: '客户名称',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 200,
      ellipsis: true,
    },
    {
      title: '联系人',
      dataIndex: 'contactName',
      key: 'contactName',
      width: 100,
      ellipsis: true,
    },
    {
      title: '商机',
      dataIndex: 'opportunityName',
      key: 'opportunityName',
      width: 150,
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      render: (status: QuoteStatus) => (
        <Tag color={statusColorMap[status]}>{status}</Tag>
      ),
    },
    {
      title: '有效期',
      dataIndex: 'validUntil',
      key: 'validUntil',
      width: 110,
      sorter: (a, b) => a.validUntil.localeCompare(b.validUntil),
    },
    {
      title: '产品数量',
      dataIndex: 'products',
      key: 'products',
      width: 90,
      render: (products: any[]) => `${products.length} 个`,
    },
    {
      title: '总金额',
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
      title: '创建人',
      dataIndex: 'createdByName',
      key: 'createdByName',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
    },
    {
      title: '操作',
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
            查看
          </Button>
          {record.status === QuoteStatus.DRAFT && (
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record.id)}
            >
              编辑
            </Button>
          )}
          {record.status === QuoteStatus.ACCEPTED && !record.convertedToContractId && (
            <Button
              type="link"
              size="small"
              icon={<FileDoneOutlined />}
              onClick={() => handleConvertToContract(record.id)}
            >
              转合同
            </Button>
          )}
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
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
          <Form.Item name="quoteNumber" label="报价单号">
            <Input placeholder="请输入报价单号" style={{ width: 200 }} allowClear />
          </Form.Item>
          <Form.Item name="customerName" label="客户名称">
            <Input placeholder="请输入客户名称" style={{ width: 200 }} allowClear />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select placeholder="请选择状态" style={{ width: 150 }} allowClear>
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
                搜索
              </Button>
              <Button onClick={handleReset}>重置</Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                新建报价单
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
          showTotal: (total) => `共 ${total} 条`,
        }}
        scroll={{ x: 1400 }}
        size="middle"
      />
    </Card>
  );
};

export default QuotesList;
