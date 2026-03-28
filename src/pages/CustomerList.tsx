/**
 * Customer List Page - HubSpot Style
 * Features:
 * - External filter bar
 * - Compact table
 * - Batch operations bar
 * - Filter tags display
 * - Save filter functionality
 * - Column settings
 * 
 * Refactored with new UI design system
 */
import React, { useState, useEffect, useMemo } from 'react';
import { Card, message, Modal, Form, Radio, Tag, Dropdown, Typography, Tooltip } from 'antd';
import {
  PlusOutlined,
  ExportOutlined,
  EditOutlined,
  DeleteOutlined,
  UserSwitchOutlined,
  EyeOutlined,
  MoreOutlined,
  SaveOutlined,
  SettingOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { Input as AntInput } from 'antd';
import { DataTable, TableDensity } from '../components/DataTable';
import { FilterBar, FilterItem } from '../components/FilterBar';
import { getCustomerList } from '../mock/customerData';
import { Customer, CustomerLevel, Industry, CustomerStatus } from '../types/customer';
import type { MenuProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import './CustomerList.css';

const { Text } = Typography;

/** 行业选项 */
const industryOptions = [
  { value: '互联网/软件/IT 服务', label: '互联网/软件/IT 服务' },
  { value: '制造业', label: '制造业' },
  { value: '金融业', label: '金融业' },
  { value: '零售业', label: '零售业' },
  { value: '医疗健康', label: '医疗健康' },
  { value: '教育培训', label: '教育培训' },
  { value: '房地产', label: '房地产' },
  { value: '能源/化工', label: '能源/化工' },
  { value: '物流/运输', label: '物流/运输' },
  { value: '其他', label: '其他' },
];

/** 等级选项 */
const levelOptions = [
  { value: 'A', label: 'A - 重点客户' },
  { value: 'B', label: 'B - 普通客户' },
  { value: 'C', label: 'C - 一般客户' },
  { value: 'D', label: 'D - 潜在客户' },
];

/** 状态选项 */
const statusOptions = [
  { value: '意向', label: '意向' },
  { value: '谈判', label: '谈判' },
  { value: '成交', label: '成交' },
  { value: '流失', label: '流失' },
];

/** 客户等级徽章颜色 */
const getLevelBadgeColor = (level: CustomerLevel): 'danger' | 'warning' | 'info' | 'neutral' => {
  const colorMap: Record<CustomerLevel, 'danger' | 'warning' | 'info' | 'neutral'> = {
    'A': 'danger',
    'B': 'warning',
    'C': 'info',
    'D': 'neutral',
  };
  return colorMap[level];
};

/** 客户状态徽章颜色 */
const getStatusBadgeColor = (status: CustomerStatus): 'brand' | 'success' | 'warning' | 'danger' | 'neutral' => {
  const colorMap: Record<CustomerStatus, 'brand' | 'success' | 'warning' | 'danger' | 'neutral'> = {
    '潜在': 'neutral',
    '意向': 'brand',
    '成交': 'success',
    '流失': 'danger',
    '冻结': 'warning',
  };
  return colorMap[status];
};

/**
 * Customer List Page Component
 */
export const CustomerList: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [customerList, setCustomerList] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [form] = Form.useForm();
  const [savedFilters, setSavedFilters] = useState<{ name: string; filters: Record<string, any> }[]>([]);
  const [columnSettingsVisible, setColumnSettingsVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  /** 加载客户列表 */
  const loadCustomerList = () => {
    setLoading(true);
    try {
      const { list, total } = getCustomerList({
        ...filters,
        page,
        pageSize,
      });
      setCustomerList(list);
      setTotal(total);
    } catch (error) {
      message.error('加载客户列表失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /** 初始加载 */
  useEffect(() => {
    loadCustomerList();
  }, [page, pageSize, filters]);

  /** 处理筛选变化 */
  const handleFilterChange = (values: Record<string, any>) => {
    setFilters(values);
    setPage(1);
  };

  /** 处理重置 */
  const handleReset = () => {
    setFilters({});
    setSearchValue('');
    setPage(1);
  };

  /** 处理分页变化 */
  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  /** 查看详情 */
  const handleViewDetail = (id: string) => {
    navigate(`/customer/${id}`);
  };

  /** 编辑客户 */
  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    form.setFieldsValue(customer);
    setEditModalVisible(true);
  };

  /** Delete customer */
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: t('common.confirm') + ' ' + t('common.delete'),
      content: 'Are you sure you want to delete this customer? This action cannot be undone.',
      okText: t('common.delete'),
      cancelText: t('common.cancel'),
      okType: 'danger',
      onOk: () => {
        message.success('Customer deleted successfully');
        loadCustomerList();
      },
    });
  };

  /** Batch assign */
  const handleBatchAssign = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Please select customers to assign');
      return;
    }
    Modal.info({
      title: t('customer.list.batchAssign'),
      content: `Assign ${selectedRowKeys.length} customers to:`,
      okText: t('common.confirm'),
    });
  };

  /** Batch delete */
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Please select customers to delete');
      return;
    }
    Modal.confirm({
      title: t('common.confirm') + ' ' + t('common.delete'),
      content: `Are you sure you want to delete ${selectedRowKeys.length} customers? This action cannot be undone.`,
      okText: t('common.delete'),
      cancelText: t('common.cancel'),
      okType: 'danger',
      onOk: () => {
        message.success(`${selectedRowKeys.length} customers deleted successfully`);
        setSelectedRowKeys([]);
        loadCustomerList();
      },
    });
  };

  /** Create customer */
  const handleCreate = () => {
    form.resetFields();
    setCreateModalVisible(true);
  };

  /** Handle create submit */
  const handleCreateSubmit = (values: any) => {
    console.log('Create customer:', values);
    message.success('Customer created successfully');
    setCreateModalVisible(false);
    loadCustomerList();
  };

  /** Handle edit submit */
  const handleEditSubmit = (values: any) => {
    console.log('Edit customer:', values);
    message.success('Customer updated successfully');
    setEditModalVisible(false);
    setEditingCustomer(null);
    loadCustomerList();
  };

  /** Export customers */
  const handleExport = () => {
    message.info('Export functionality coming soon');
  };

  /** Save current filter */
  const handleSaveFilter = () => {
    if (Object.keys(filters).length === 0) {
      message.warning('No filters to save');
      return;
    }
    const name = `Filter ${savedFilters.length + 1}`;
    setSavedFilters([...savedFilters, { name, filters }]);
    message.success('Filter saved successfully');
  };

  /** Remove a filter tag */
  const handleRemoveFilterTag = (filterKey: string) => {
    const newFilters = { ...filters };
    delete newFilters[filterKey];
    setFilters(newFilters);
  };

  /** Handle search */
  const handleSearch = (value: string) => {
    setSearchValue(value);
    if (value) {
      setFilters({ ...filters, name: value });
    } else {
      const newFilters = { ...filters };
      delete newFilters.name;
      setFilters(newFilters);
    }
  };

  /** Active filter tags */
  const activeFilterTags = useMemo(() => {
    return Object.entries(filters)
      .filter(([_, value]) => value !== undefined && value !== '' && value !== null)
      .map(([key, value]) => (
        <Tag
          key={key}
          closable
          onClose={() => handleRemoveFilterTag(key)}
          className="filter-tag"
        >
          {key}: {String(value)}
        </Tag>
      ));
  }, [filters]);

  /** Filter field configuration */
  const filterFields: FilterItem[] = [
    {
      name: 'name',
      label: t('customer.list.filters.name'),
      type: 'text',
      placeholder: 'Enter customer name',
    },
    {
      name: 'industry',
      label: t('customer.list.filters.industry'),
      type: 'select',
      placeholder: 'Select industry',
      options: [
        { label: 'Technology/Software/IT', value: '互联网/软件/IT 服务' },
        { label: 'Manufacturing', value: '制造业' },
        { label: 'Finance', value: '金融业' },
        { label: 'Retail', value: '零售业' },
        { label: 'Healthcare', value: '医疗健康' },
        { label: 'Other', value: '其他' },
      ],
    },
    {
      name: 'level',
      label: t('customer.list.filters.level'),
      type: 'select',
      placeholder: 'Select level',
      options: [
        { label: 'A - Key Account', value: 'A' },
        { label: 'B - Standard', value: 'B' },
        { label: 'C - General', value: 'C' },
        { label: 'D - Potential', value: 'D' },
      ],
    },
    {
      name: 'status',
      label: t('customer.list.filters.status'),
      type: 'select',
      placeholder: 'Select status',
      options: [
        { label: 'Interested', value: '意向' },
        { label: 'Negotiating', value: '谈判' },
        { label: 'Closed', value: '成交' },
        { label: 'Churned', value: '流失' },
      ],
    },
    {
      name: 'source',
      label: t('customer.list.filters.source'),
      type: 'select',
      placeholder: 'Select source',
      options: [
        { label: 'Marketing Event', value: '市场活动' },
        { label: 'Website', value: '官网' },
        { label: 'Referral', value: '转介绍' },
        { label: 'Cold Call', value: '陌拜' },
        { label: 'Advertisement', value: '广告' },
        { label: 'Other', value: '其他' },
      ],
    },
  ];

  /** Table column configuration */
  const columns: ColumnsType<Customer> = [
    {
      title: t('customer.list.columns.name'),
      dataIndex: 'name',
      key: 'name',
      width: 180,
      fixed: 'left',
      render: (text, record) => (
        <a onClick={() => handleViewDetail(record.id)} className="customer-name-link">{text}</a>
      ),
    },
    {
      title: t('customer.list.columns.industry'),
      dataIndex: 'industry',
      key: 'industry',
      width: 130,
      ellipsis: true,
    },
    {
      title: t('customer.list.columns.companySize'),
      dataIndex: 'companySize',
      key: 'companySize',
      width: 100,
    },
    {
      title: t('customer.list.columns.source'),
      dataIndex: 'source',
      key: 'source',
      width: 90,
    },
    {
      title: t('customer.list.columns.level'),
      dataIndex: 'level',
      key: 'level',
      width: 70,
      render: (level: CustomerLevel) => (
        <Badge color={getLevelBadgeColor(level)} variant="soft" size="sm">{level}</Badge>
      ),
    },
    {
      title: t('customer.list.columns.status'),
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: CustomerStatus) => (
        <Badge color={getStatusBadgeColor(status)} variant="soft" size="sm">{status}</Badge>
      ),
    },
    {
      title: t('customer.list.columns.owner'),
      dataIndex: 'ownerName',
      key: 'ownerName',
      width: 90,
    },
    {
      title: t('customer.list.columns.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 140,
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: t('common.actions'),
      key: 'action',
      width: 50,
      fixed: 'right',
      render: (_, record) => {
        const menuItems: MenuProps['items'] = [
          {
            key: 'view',
            icon: <EyeOutlined />,
            label: t('customer.list.actions.viewDetail'),
            onClick: () => handleViewDetail(record.id),
          },
          {
            key: 'edit',
            icon: <EditOutlined />,
            label: t('customer.list.actions.edit'),
            onClick: () => handleEdit(record),
          },
          {
            key: 'assign',
            icon: <UserSwitchOutlined />,
            label: t('customer.list.actions.assign'),
          },
          { type: 'divider' },
          {
            key: 'delete',
            icon: <DeleteOutlined />,
            label: t('customer.list.actions.delete'),
            danger: true,
            onClick: () => handleDelete(record.id),
          },
        ];

        return (
          <Dropdown menu={{ items: menuItems }} trigger={['click']}>
            <Button type="icon" icon={<MoreOutlined />} size="sm" />
          </Dropdown>
        );
      },
    },
  ];

  /** Batch action buttons */
  const batchActions = (
    <div className="batch-actions">
      <Button type="secondary" size="sm" icon={<UserSwitchOutlined />} onClick={handleBatchAssign}>
        {t('customer.list.batchAssign')}
      </Button>
      <Button type="danger" size="sm" icon={<DeleteOutlined />} onClick={handleBatchDelete}>
        {t('customer.list.batchDelete')}
      </Button>
    </div>
  );

  return (
    <div className="crm-page customer-list-page">
      {/* 1. 标题区 */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">{t('customer.list.title')}</h1>
          <span className="page-total">{t('customer.list.totalRecords', { count: total })}</span>
        </div>
        <div className="page-header-right">
          <Button type="secondary" icon={<SaveOutlined />} onClick={handleSaveFilter}>
            Save Filter
          </Button>
          <Button type="secondary" icon={<SettingOutlined />} onClick={() => setColumnSettingsVisible(true)}>
            Columns
          </Button>
          <Button type="secondary" icon={<ExportOutlined />} onClick={handleExport}>
            {t('common.export')}
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            {t('customer.list.createCustomer')}
          </Button>
        </div>
      </div>

      {/* 2. 操作栏 */}
      <div className="action-bar">
        <div className="action-bar-left">
          <Input
            type="search"
            placeholder="搜索客户..."
            value={searchValue}
            onChange={handleSearch}
            onSearch={handleSearch}
            allowClear
            suffix={<kbd className="search-kbd">⌘K</kbd>}
          />
        </div>
      </div>

      {/* 3. 筛选标签 */}
      {activeFilterTags.length > 0 && (
        <div className="filter-tags-container">
          <span className="filter-label">Active Filters:</span>
          {activeFilterTags}
          <Button type="text" size="sm" onClick={handleReset}>
            Clear All
          </Button>
        </div>
      )}

      {/* 4. 筛选器 */}
      <Card className="filter-card" styles={{ body: { padding: '12px 16px' } }}>
        <FilterBar
          filters={filterFields}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
          loading={loading}
          defaultShowCount={4}
        />
      </Card>

      {/* 5. 表格 */}
      <Card className="table-card" styles={{ body: { padding: 16 } }}>
        <DataTable<Customer>
          tableKey="customer-list"
          columns={columns}
          dataSource={customerList}
          loading={loading}
          rowKey="id"
          batchActions={batchActions}
          onSelectionChange={setSelectedRowKeys}
          pagination={{
            current: page,
            pageSize,
            total,
            onChange: handlePageChange,
          }}
          scroll={{ x: 1000 }}
          onRefresh={loadCustomerList}
        />
      </Card>

      {/* Create customer modal */}
      <Modal
        title={t('customer.list.createCustomer')}
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onOk={() => form.submit()}
        okText={t('common.save')}
        cancelText={t('common.cancel')}
        width={600}
        destroyOnClose
        className="customer-modal"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateSubmit}
          initialValues={{ level: 'B', status: '意向', source: '官网' }}
        >
          <Form.Item name="name" label="Customer Name" rules={[{ required: true, message: 'Please enter customer name' }]}>
            <Input placeholder="Enter customer name" />
          </Form.Item>
          <Form.Item name="industry" label="Industry" rules={[{ required: true, message: 'Please select industry' }]}>
            <Select placeholder="Select industry" options={industryOptions} />
          </Form.Item>
          <Form.Item name="companySize" label="Company Size">
            <Select 
              placeholder="Select company size" 
              options={[
                { value: 'Micro', label: 'Micro (1-20)' },
                { value: 'Small', label: 'Small (21-100)' },
                { value: 'Medium', label: 'Medium (101-500)' },
                { value: 'Large', label: 'Large (501-2000)' },
                { value: 'Enterprise', label: 'Enterprise (2000+)' },
              ]}
            />
          </Form.Item>
          <Form.Item name="level" label="Customer Level">
            <Radio.Group>
              <Radio value="A">A - Key</Radio>
              <Radio value="B">B - Standard</Radio>
              <Radio value="C">C - General</Radio>
              <Radio value="D">D - Potential</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="source" label="Customer Source">
            <Select 
              placeholder="Select source" 
              options={[
                { value: '市场活动', label: 'Marketing Event' },
                { value: '官网', label: 'Website' },
                { value: '转介绍', label: 'Referral' },
                { value: '陌拜', label: 'Cold Call' },
                { value: '广告', label: 'Advertisement' },
                { value: '其他', label: 'Other' },
              ]}
            />
          </Form.Item>
          <Form.Item name="phone" label="Phone">
            <Input placeholder="Enter phone number" />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input placeholder="Enter email address" />
          </Form.Item>
          <Form.Item name="address" label="Address">
            <AntInput.TextArea rows={2} placeholder="Enter address" />
          </Form.Item>
          <Form.Item name="remark" label="Remarks">
            <AntInput.TextArea rows={3} placeholder="Enter remarks" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit customer modal */}
      <Modal
        title={t('common.edit') + ' ' + t('customer.title')}
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setEditingCustomer(null);
        }}
        onOk={() => form.submit()}
        okText={t('common.save')}
        cancelText={t('common.cancel')}
        width={600}
        destroyOnClose
        className="customer-modal"
      >
        <Form form={form} layout="vertical" onFinish={handleEditSubmit}>
          <Form.Item name="name" label="Customer Name" rules={[{ required: true, message: 'Please enter customer name' }]}>
            <Input placeholder="Enter customer name" />
          </Form.Item>
          <Form.Item name="industry" label="Industry" rules={[{ required: true, message: 'Please select industry' }]}>
            <Select placeholder="Select industry" options={industryOptions} />
          </Form.Item>
          <Form.Item name="companySize" label="Company Size">
            <Select 
              placeholder="Select company size" 
              options={[
                { value: 'Micro', label: 'Micro (1-20)' },
                { value: 'Small', label: 'Small (21-100)' },
                { value: 'Medium', label: 'Medium (101-500)' },
                { value: 'Large', label: 'Large (501-2000)' },
                { value: 'Enterprise', label: 'Enterprise (2000+)' },
              ]}
            />
          </Form.Item>
          <Form.Item name="level" label="Customer Level">
            <Radio.Group>
              <Radio value="A">A - Key</Radio>
              <Radio value="B">B - Standard</Radio>
              <Radio value="C">C - General</Radio>
              <Radio value="D">D - Potential</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="status" label="Customer Status">
            <Select 
              placeholder="Select status" 
              options={[
                { value: '意向', label: 'Interested' },
                { value: '谈判', label: 'Negotiating' },
                { value: '成交', label: 'Closed' },
                { value: '流失', label: 'Churned' },
              ]}
            />
          </Form.Item>
          <Form.Item name="phone" label="Phone">
            <Input placeholder="Enter phone number" />
          </Form.Item>
          <Form.Item name="address" label="Address">
            <AntInput.TextArea rows={2} placeholder="Enter address" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CustomerList;