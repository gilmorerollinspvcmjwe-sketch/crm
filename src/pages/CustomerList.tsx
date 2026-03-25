/**
 * Customer List Page - HubSpot Style
 * Features:
 * - External filter bar
 * - Compact table
 * - Batch operations bar
 * - Filter tags display
 * - Save filter functionality
 * - Column settings
 */
import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Space, message, Modal, Form, Input, Select, Radio, Tag, Dropdown, Typography, Tooltip, Popover } from 'antd';
import {
  PlusOutlined,
  ExportOutlined,
  EditOutlined,
  DeleteOutlined,
  UserSwitchOutlined,
  EyeOutlined,
  MoreOutlined,
  PhoneOutlined,
  MailOutlined,
  SaveOutlined,
  SettingOutlined,
  CloseOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DataTable, TableDensity } from '../components/DataTable';
import { FilterBar, FilterItem } from '../components/FilterBar';
import { getCustomerList } from '../mock/customerData';
import { Customer, CustomerLevel, Industry, CustomerStatus } from '../types/customer';
import { colors } from '../styles/tokens';
import type { MenuProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const { Text } = Typography;

/** Get industry options with translation */
const getIndustryOptions = (t: Function) => [
  { label: t('customerForm.industryOptions.internet'), value: '互联网/软件/IT 服务' },
  { label: t('customerForm.industryOptions.manufacturing'), value: '制造业' },
  { label: t('customerForm.industryOptions.finance'), value: '金融业' },
  { label: t('customerForm.industryOptions.retail'), value: '零售业' },
  { label: t('customerForm.industryOptions.healthcare'), value: '医疗健康' },
  { label: t('customerForm.industryOptions.education'), value: '教育培训' },
  { label: t('customerForm.industryOptions.realEstate'), value: '房地产' },
  { label: t('customerForm.industryOptions.energy'), value: '能源/化工' },
  { label: t('customerForm.industryOptions.logistics'), value: '物流/运输' },
  { label: t('customerForm.industryOptions.other'), value: '其他' },
];

/** Get level options with translation */
const getLevelOptions = (t: Function) => [
  { label: t('customer.list.levelOptions.A'), value: 'A' },
  { label: t('customer.list.levelOptions.B'), value: 'B' },
  { label: t('customer.list.levelOptions.C'), value: 'C' },
  { label: t('customer.list.levelOptions.D'), value: 'D' },
];

/** Get status options with translation */
const getStatusOptions = (t: Function) => [
  { label: t('customer.list.statusOptions.interested'), value: '意向' },
  { label: t('customer.list.statusOptions.negotiating'), value: '谈判' },
  { label: t('customer.list.statusOptions.closed'), value: '成交' },
  { label: t('customer.list.statusOptions.churned'), value: '流失' },
];

/** 客户等级标签颜色映射 */
const levelColorMap: Record<CustomerLevel, string> = {
  'A': colors.danger,
  'B': colors.warning,
  'C': colors.info,
  'D': colors.text.tertiary,
};

/** 客户状态标签颜色映射 */
const statusColorMap: Record<CustomerStatus, string> = {
  '潜在': 'default',
  '意向': 'processing',
  '成交': 'success',
  '流失': 'error',
  '冻结': 'warning',
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
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    name: true,
    industry: true,
    companySize: true,
    source: true,
    level: true,
    status: true,
    ownerName: true,
    createdAt: true,
  });

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
    Modal.prompt({
      title: 'Save Filter',
      content: 'Enter a name for this filter:',
      placeholder: 'e.g., High Priority Customers',
      onOk: (name) => {
        const filterName = name || `Filter ${savedFilters.length + 1}`;
        setSavedFilters([...savedFilters, { name: filterName, filters }]);
        message.success(`Filter "${filterName}" saved`);
      },
    });
  };

  /** Toggle column visibility */
  const handleToggleColumn = (columnKey: string) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey],
    }));
  };

  /** Reset columns to default */
  const handleResetColumns = () => {
    setVisibleColumns({
      name: true,
      industry: true,
      companySize: true,
      source: true,
      level: true,
      status: true,
      ownerName: true,
      createdAt: true,
    });
    message.success('Columns reset to default');
  };

  /** Remove a filter tag */
  const handleRemoveFilterTag = (filterKey: string) => {
    const newFilters = { ...filters };
    delete newFilters[filterKey];
    setFilters(newFilters);
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
          style={{ marginBottom: 4 }}
        >
          {key}: {String(value)}
        </Tag>
      ));
  }, [filters]);

  /** Filter field configuration */
  const filterFields: FilterItem[] = useMemo(() => [
    {
      name: 'name',
      label: t('customer.list.filters.name'),
      type: 'text',
      placeholder: t('searchFilter.inputPlaceholder', { label: t('customer.list.filters.name') }),
    },
    {
      name: 'industry',
      label: t('customer.list.filters.industry'),
      type: 'select',
      placeholder: t('searchFilter.selectPlaceholder', { label: t('customer.list.filters.industry') }),
      options: getIndustryOptions(t),
    },
    {
      name: 'level',
      label: t('customer.list.filters.level'),
      type: 'select',
      placeholder: t('searchFilter.selectPlaceholder', { label: t('customer.list.filters.level') }),
      options: getLevelOptions(t),
    },
    {
      name: 'status',
      label: t('customer.list.filters.status'),
      type: 'select',
      placeholder: t('searchFilter.selectPlaceholder', { label: t('customer.list.filters.status') }),
      options: getStatusOptions(t),
    },
    {
      name: 'source',
      label: t('customer.list.filters.source'),
      type: 'select',
      placeholder: t('searchFilter.selectPlaceholder', { label: t('customer.list.filters.source') }),
      options: [
        { label: t('lead.source.campaign'), value: '市场活动' },
        { label: t('lead.source.website'), value: '官网' },
        { label: t('lead.source.referral'), value: '转介绍' },
        { label: t('lead.source.coldCall'), value: '陌拜' },
        { label: t('lead.source.advertisement'), value: '广告' },
        { label: t('lead.source.other'), value: '其他' },
      ],
    },
  ], [t]);

  /** Table column configuration */
  const columns: ColumnsType<Customer> = [
    {
      title: t('customer.list.columns.name'),
      dataIndex: 'name',
      key: 'name',
      width: 180,
      fixed: 'left',
      hidden: !visibleColumns.name,
      render: (text, record) => (
        <a onClick={() => handleViewDetail(record.id)}>{text}</a>
      ),
    },
    {
      title: t('customer.list.columns.industry'),
      dataIndex: 'industry',
      key: 'industry',
      width: 130,
      ellipsis: true,
      hidden: !visibleColumns.industry,
    },
    {
      title: t('customer.list.columns.companySize'),
      dataIndex: 'companySize',
      key: 'companySize',
      width: 100,
      hidden: !visibleColumns.companySize,
    },
    {
      title: t('customer.list.columns.source'),
      dataIndex: 'source',
      key: 'source',
      width: 90,
      hidden: !visibleColumns.source,
    },
    {
      title: t('customer.list.columns.level'),
      dataIndex: 'level',
      key: 'level',
      width: 70,
      hidden: !visibleColumns.level,
      render: (level: CustomerLevel) => (
        <Tag color={levelColorMap[level]} style={{ margin: 0 }}>{level}</Tag>
      ),
    },
    {
      title: t('customer.list.columns.status'),
      dataIndex: 'status',
      key: 'status',
      width: 80,
      hidden: !visibleColumns.status,
      render: (status: CustomerStatus) => (
        <Tag color={statusColorMap[status]} style={{ margin: 0 }}>
          {t(`customer.list.statusOptions.${status}`, { defaultValue: status })}
        </Tag>
      ),
    },
    {
      title: t('customer.list.columns.owner'),
      dataIndex: 'ownerName',
      key: 'ownerName',
      width: 90,
      hidden: !visibleColumns.ownerName,
    },
    {
      title: t('customer.list.columns.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 140,
      hidden: !visibleColumns.createdAt,
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
            <Button type="text" icon={<MoreOutlined />} size="small" />
          </Dropdown>
        );
      },
    },
  ];

  /** Batch action buttons */
  const batchActions = (
    <>
      <Button size="small" icon={<UserSwitchOutlined />} onClick={handleBatchAssign}>
        {t('customer.list.batchAssign')}
      </Button>
      <Button size="small" danger icon={<DeleteOutlined />} onClick={handleBatchDelete}>
        {t('customer.list.batchDelete')}
      </Button>
    </>
  );

  return (
    <div style={{ padding: 0 }}>
      {/* Page title */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
      }}>
        <div>
          <Text strong style={{ fontSize: 16 }}>{t('customer.list.title')}</Text>
          <Text type="secondary" style={{ marginLeft: 8 }}>
            {t('customer.list.totalRecords', { count: total })}
          </Text>
        </div>
        <Space>
          <Button icon={<SaveOutlined />} onClick={handleSaveFilter}>
            {t('common.save')} {t('common.filter')}
          </Button>
          <Button icon={<SettingOutlined />} onClick={() => setColumnSettingsVisible(true)}>
            Columns
          </Button>
          <Button icon={<ExportOutlined />} onClick={handleExport}>
            {t('common.export')}
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            {t('customer.list.createCustomer')}
          </Button>
        </Space>
      </div>

      {/* Filter tags */}
      {activeFilterTags.length > 0 && (
        <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Text type="secondary">Active Filters:</Text>
          {activeFilterTags}
          <Button type="link" size="small" onClick={handleReset}>
            Clear All
          </Button>
        </div>
      )}

      {/* Filter bar */}
      <Card style={{ marginBottom: 16 }} styles={{ body: { padding: '12px 16px' } }}>
        <FilterBar
          filters={filterFields}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
          loading={loading}
          defaultShowCount={4}
        />
      </Card>

      {/* Data table */}
      <Card styles={{ body: { padding: 16 } }}>
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
        destroyOnHidden
        forceRender
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
            <Select placeholder="Select company size">
              <Select.Option value="Micro">Micro (1-20)</Select.Option>
              <Select.Option value="Small">Small (21-100)</Select.Option>
              <Select.Option value="Medium">Medium (101-500)</Select.Option>
              <Select.Option value="Large">Large (501-2000)</Select.Option>
              <Select.Option value="Enterprise">Enterprise (2000+)</Select.Option>
            </Select>
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
            <Select placeholder="Select source">
              <Select.Option value="市场活动">Marketing Event</Select.Option>
              <Select.Option value="官网">Website</Select.Option>
              <Select.Option value="转介绍">Referral</Select.Option>
              <Select.Option value="陌拜">Cold Call</Select.Option>
              <Select.Option value="广告">Advertisement</Select.Option>
              <Select.Option value="其他">Other</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="phone" label="Phone">
            <Input placeholder="Enter phone number" />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input placeholder="Enter email address" />
          </Form.Item>
          <Form.Item name="address" label="Address">
            <Input.TextArea rows={2} placeholder="Enter address" />
          </Form.Item>
          <Form.Item name="remark" label="Remarks">
            <Input.TextArea rows={3} placeholder="Enter remarks" />
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
        destroyOnHidden
        forceRender
      >
        <Form form={form} layout="vertical" onFinish={handleEditSubmit}>
          <Form.Item name="name" label="Customer Name" rules={[{ required: true, message: 'Please enter customer name' }]}>
            <Input placeholder="Enter customer name" />
          </Form.Item>
          <Form.Item name="industry" label="Industry" rules={[{ required: true, message: 'Please select industry' }]}>
            <Select placeholder="Select industry" options={industryOptions} />
          </Form.Item>
          <Form.Item name="companySize" label="Company Size">
            <Select placeholder="Select company size">
              <Select.Option value="Micro">Micro (1-20)</Select.Option>
              <Select.Option value="Small">Small (21-100)</Select.Option>
              <Select.Option value="Medium">Medium (101-500)</Select.Option>
              <Select.Option value="Large">Large (501-2000)</Select.Option>
              <Select.Option value="Enterprise">Enterprise (2000+)</Select.Option>
            </Select>
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
            <Select placeholder="Select status">
              <Select.Option value="意向">Interested</Select.Option>
              <Select.Option value="谈判">Negotiating</Select.Option>
              <Select.Option value="成交">Closed</Select.Option>
              <Select.Option value="流失">Churned</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="phone" label="Phone">
            <Input placeholder="Enter phone number" />
          </Form.Item>
          <Form.Item name="address" label="Address">
            <Input.TextArea rows={2} placeholder="Enter address" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Column settings modal */}
      <Modal
        title="Column Settings"
        open={columnSettingsVisible}
        onCancel={() => setColumnSettingsVisible(false)}
        footer={
          <Space>
            <Button onClick={handleResetColumns}>Reset to Default</Button>
            <Button onClick={() => setColumnSettingsVisible(false)}>Close</Button>
          </Space>
        }
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {Object.entries(visibleColumns).map(([key, visible]) => (
            <div
              key={key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 12px',
                background: visible ? colors.primary + '10' : 'transparent',
                borderRadius: 6,
                cursor: 'pointer',
              }}
              onClick={() => handleToggleColumn(key)}
            >
              <input
                type="checkbox"
                checked={visible}
                onChange={() => handleToggleColumn(key)}
                style={{ cursor: 'pointer' }}
              />
              <span>{key}</span>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default CustomerList;