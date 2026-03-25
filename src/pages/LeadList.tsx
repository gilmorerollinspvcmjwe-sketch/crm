/**
 * 线索列表页
 * 功能：
 * - 表格展示线索列表
 * - 状态筛选：待跟进、跟进中、已转化、已关闭
 * - 批量操作：批量分配、批量转化
 * - 分页：每页 20 条
 */
import React, { useState, useEffect } from 'react';
import { Card, Button, Space, message, Modal, Form, Input, Select, Radio, Checkbox } from 'antd';
import { PlusOutlined, ImportOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LeadTable } from '../components/Customer/LeadTable';
import { SearchFilter, FilterField } from '../components/Customer/SearchFilter';
import { getLeadList } from '../mock/leadData';
import { Lead, LeadStatus, LeadSource } from '../types/lead';

/** 状态选项 */
const getStatusOptions = (t: (key: string) => string) => [
  { label: t('lead.status.pending'), value: '待跟进' },
  { label: t('lead.status.inProgress'), value: '跟进中' },
  { label: t('lead.status.converted'), value: '已转化' },
  { label: t('lead.status.closed'), value: '已关闭' },
];

/** 来源选项 */
const getSourceOptions = (t: (key: string) => string) => [
  { label: t('lead.source.marketingEvent'), value: '市场活动' },
  { label: t('lead.source.website'), value: '官网' },
  { label: t('lead.source.referral'), value: '转介绍' },
  { label: t('lead.source.coldCall'), value: '陌拜' },
  { label: t('lead.source.advertisement'), value: '广告' },
  { label: t('lead.source.other'), value: '其他' },
];

/**
 * 线索列表页组件
 */
export const LeadList: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [leadList, setLeadList] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [convertModalVisible, setConvertModalVisible] = useState(false);
  const [convertingLeadId, setConvertingLeadId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [convertForm] = Form.useForm();

  const statusOptions = getStatusOptions(t);
  const sourceOptions = getSourceOptions(t);

  /** 加载线索列表 */
  const loadLeadList = () => {
    setLoading(true);
    try {
      const { list, total } = getLeadList({
        ...filters,
        page,
        pageSize,
      });
      setLeadList(list);
      setTotal(total);
    } catch (error) {
      message.error(t('lead.list.loadFailed'));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /** 初始加载 */
  useEffect(() => {
    loadLeadList();
  }, [page, filters]);

  /** 处理搜索 */
  const handleSearch = (values: Record<string, string>) => {
    setFilters(values);
    setPage(1); // 重置到第一页
  };

  /** 处理重置 */
  const handleReset = () => {
    setFilters({});
    setPage(1);
  };

  /** 处理分页变化 */
  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
  };

  /** 查看详情 */
  const handleViewDetail = (id: string) => {
    navigate(`/lead/${id}`);
  };

  /** 编辑线索 */
  const handleEdit = (id: string) => {
    setEditingLeadId(id);
    form.setFieldsValue({ id });
    setEditModalVisible(true);
  };

  /** 分配线索 */
  const handleAssign = (id: string) => {
    Modal.info({
      title: t('lead.list.assignLead'),
      content: t('lead.list.assignContent'),
      okText: t('lead.form.confirm'),
    });
  };

  /** 转化线索 */
  const handleConvert = (id: string) => {
    setConvertingLeadId(id);
    convertForm.resetFields();
    setConvertModalVisible(true);
  };

  /** 处理线索转化提交 */
  const handleConvertSubmit = (values: any) => {
    console.log('线索转化:', values);
    message.success(t('lead.list.convertSuccess'));
    setConvertModalVisible(false);
    setConvertingLeadId(null);
    loadLeadList();
  };

  /** 删除线索 */
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: t('lead.list.confirmDelete'),
      content: t('lead.list.confirmDeleteContent'),
      okText: t('lead.list.confirmDeleteBtn'),
      cancelText: t('lead.form.cancel'),
      okType: 'danger',
      onOk: () => {
        message.success(t('lead.list.deleteSuccess'));
        loadLeadList();
      },
    });
  };

  /** 批量分配 */
  const handleBatchAssign = (ids: string[]) => {
    Modal.info({
      title: t('lead.list.batchAssign'),
      content: t('lead.list.batchAssignContent', { count: ids.length }),
      // TODO: 实现分配功能
    });
  };

  /** 批量转化 */
  const handleBatchConvert = (ids: string[]) => {
    Modal.confirm({
      title: t('lead.list.batchConvert'),
      content: t('lead.list.batchConvertContent', { count: ids.length }),
      onOk: () => {
        message.success(t('lead.list.convertSuccess'));
        loadLeadList();
      },
    });
  };

  /** 新建线索 */
  const handleCreate = () => {
    form.resetFields();
    setCreateModalVisible(true);
  };

  /** 处理新建线索提交 */
  const handleCreateSubmit = (values: any) => {
    console.log('新建线索:', values);
    message.success(t('lead.list.createSuccess'));
    setCreateModalVisible(false);
    loadLeadList();
  };

  /** 处理编辑线索提交 */
  const handleEditSubmit = (values: any) => {
    console.log('编辑线索:', values);
    message.success(t('lead.list.editSuccess'));
    setEditModalVisible(false);
    setEditingLeadId(null);
    loadLeadList();
  };

  /** 处理删除线索确认 */
  const handleDeleteConfirm = (id: string) => {
    Modal.confirm({
      title: t('lead.list.confirmDelete'),
      content: t('lead.list.confirmDeleteContent'),
      okText: t('lead.list.confirmDeleteBtn'),
      cancelText: t('lead.form.cancel'),
      okType: 'danger',
      onOk: () => {
        message.success(t('lead.list.deleteSuccess'));
        loadLeadList();
      },
    });
  };

  /** 导入线索 */
  const handleImport = () => {
    message.info(t('common.comingSoon'));
    // TODO: 实现导入功能
  };

  /** 筛选字段配置 */
  const filterFields: FilterField[] = [
    {
      name: 'name',
      label: t('lead.filter.name'),
      type: 'text',
      placeholder: t('lead.filter.namePlaceholder'),
    },
    {
      name: 'source',
      label: t('lead.filter.source'),
      type: 'select',
      placeholder: t('lead.filter.sourcePlaceholder'),
      options: sourceOptions,
    },
    {
      name: 'status',
      label: t('lead.filter.status'),
      type: 'select',
      placeholder: t('lead.filter.statusPlaceholder'),
      options: statusOptions,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card
        title={t('lead.list.title')}
        extra={
          <Space>
            <Button icon={<ImportOutlined />} onClick={handleImport}>
              {t('lead.list.import')}
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
              {t('lead.list.createLead')}
            </Button>
          </Space>
        }
      >
        {/* 搜索筛选 */}
        <SearchFilter
          fields={filterFields}
          onSearch={handleSearch}
          onReset={handleReset}
          loading={loading}
        />

        {/* 线索表格 */}
        <LeadTable
          dataSource={leadList}
          loading={loading}
          pagination={{
            current: page,
            pageSize,
            total,
            onChange: handlePageChange,
          }}
          onViewDetail={handleViewDetail}
          onEdit={handleEdit}
          onAssign={handleAssign}
          onConvert={handleConvert}
          onDelete={handleDelete}
          onBatchAssign={handleBatchAssign}
          onBatchConvert={handleBatchConvert}
        />
      </Card>

      {/* 新建线索弹窗 */}
      <Modal
        title={t('lead.form.createTitle')}
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onOk={() => form.submit()}
        okText={t('lead.form.confirm')}
        cancelText={t('lead.form.cancel')}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateSubmit}
        >
          <Form.Item
            name="name"
            label={t('lead.form.name')}
            rules={[{ required: true, message: t('lead.form.nameRequired') }]}
          >
            <Input placeholder={t('lead.form.namePlaceholder')} />
          </Form.Item>
          <Form.Item name="source" label={t('lead.form.source')}>
            <Select placeholder={t('lead.form.sourcePlaceholder')}>
              <Select.Option value="市场活动">{t('lead.source.marketingEvent')}</Select.Option>
              <Select.Option value="官网">{t('lead.source.website')}</Select.Option>
              <Select.Option value="转介绍">{t('lead.source.referral')}</Select.Option>
              <Select.Option value="陌拜">{t('lead.source.coldCall')}</Select.Option>
              <Select.Option value="广告">{t('lead.source.advertisement')}</Select.Option>
              <Select.Option value="其他">{t('lead.source.other')}</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="level" label={t('lead.form.level')}>
            <Select placeholder={t('lead.form.levelPlaceholder')}>
              <Select.Option value="高">{t('lead.level.high')}</Select.Option>
              <Select.Option value="中">{t('lead.level.medium')}</Select.Option>
              <Select.Option value="低">{t('lead.level.low')}</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="contactName" label={t('lead.form.contactName')}>
            <Input placeholder={t('lead.form.contactNamePlaceholder')} />
          </Form.Item>
          <Form.Item name="mobile" label={t('lead.form.mobile')}>
            <Input placeholder={t('lead.form.mobilePlaceholder')} />
          </Form.Item>
          <Form.Item name="email" label={t('lead.form.email')}>
            <Input placeholder={t('lead.form.emailPlaceholder')} />
          </Form.Item>
          <Form.Item name="companyName" label={t('lead.form.companyName')}>
            <Input placeholder={t('lead.form.companyNamePlaceholder')} />
          </Form.Item>
          <Form.Item name="intentionProduct" label={t('lead.form.intentionProduct')}>
            <Input placeholder={t('lead.form.intentionProductPlaceholder')} />
          </Form.Item>
          <Form.Item name="remark" label={t('lead.form.remark')}>
            <Input.TextArea rows={3} placeholder={t('lead.form.remarkPlaceholder')} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑线索弹窗 */}
      <Modal
        title={t('lead.form.editTitle')}
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setEditingLeadId(null);
        }}
        onOk={() => form.submit()}
        okText={t('lead.form.confirm')}
        cancelText={t('lead.form.cancel')}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditSubmit}
        >
          <Form.Item
            name="name"
            label={t('lead.form.name')}
            rules={[{ required: true, message: t('lead.form.nameRequired') }]}
          >
            <Input placeholder={t('lead.form.namePlaceholder')} />
          </Form.Item>
          <Form.Item name="source" label={t('lead.form.source')}>
            <Select placeholder={t('lead.form.sourcePlaceholder')}>
              <Select.Option value="市场活动">{t('lead.source.marketingEvent')}</Select.Option>
              <Select.Option value="官网">{t('lead.source.website')}</Select.Option>
              <Select.Option value="转介绍">{t('lead.source.referral')}</Select.Option>
              <Select.Option value="陌拜">{t('lead.source.coldCall')}</Select.Option>
              <Select.Option value="广告">{t('lead.source.advertisement')}</Select.Option>
              <Select.Option value="其他">{t('lead.source.other')}</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="level" label={t('lead.form.level')}>
            <Select placeholder={t('lead.form.levelPlaceholder')}>
              <Select.Option value="高">{t('lead.level.high')}</Select.Option>
              <Select.Option value="中">{t('lead.level.medium')}</Select.Option>
              <Select.Option value="低">{t('lead.level.low')}</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="contactName" label={t('lead.form.contactName')}>
            <Input placeholder={t('lead.form.contactNamePlaceholder')} />
          </Form.Item>
          <Form.Item name="mobile" label={t('lead.form.mobile')}>
            <Input placeholder={t('lead.form.mobilePlaceholder')} />
          </Form.Item>
          <Form.Item name="email" label={t('lead.form.email')}>
            <Input placeholder={t('lead.form.emailPlaceholder')} />
          </Form.Item>
          <Form.Item name="companyName" label={t('lead.form.companyName')}>
            <Input placeholder={t('lead.form.companyNamePlaceholder')} />
          </Form.Item>
          <Form.Item name="intentionProduct" label={t('lead.form.intentionProduct')}>
            <Input placeholder={t('lead.form.intentionProductPlaceholder')} />
          </Form.Item>
          <Form.Item name="status" label={t('lead.form.status')}>
            <Select placeholder={t('lead.form.statusPlaceholder')}>
              <Select.Option value="待跟进">{t('lead.status.pending')}</Select.Option>
              <Select.Option value="跟进中">{t('lead.status.inProgress')}</Select.Option>
              <Select.Option value="已转化">{t('lead.status.converted')}</Select.Option>
              <Select.Option value="已关闭">{t('lead.status.closed')}</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="remark" label={t('lead.form.remark')}>
            <Input.TextArea rows={3} placeholder={t('lead.form.remarkPlaceholder')} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 线索转化弹窗 */}
      <Modal
        title={t('lead.form.convertTitle')}
        open={convertModalVisible}
        onCancel={() => {
          setConvertModalVisible(false);
          setConvertingLeadId(null);
        }}
        onOk={() => convertForm.submit()}
        okText={t('lead.form.confirm')}
        cancelText={t('lead.form.cancel')}
        width={500}
      >
        <Form
          form={convertForm}
          layout="vertical"
          onFinish={handleConvertSubmit}
          initialValues={{
            createCustomer: true,
            createContact: true,
            createOpportunity: false,
          }}
        >
          <Form.Item label={t('lead.form.convertType')}>
            <Space direction="vertical">
              <Form.Item name="createCustomer" valuePropName="checked" noStyle>
                <Checkbox>{t('lead.form.createCustomer')}</Checkbox>
              </Form.Item>
              <Form.Item name="createContact" valuePropName="checked" noStyle>
                <Checkbox>{t('lead.form.createContact')}</Checkbox>
              </Form.Item>
              <Form.Item name="createOpportunity" valuePropName="checked" noStyle>
                <Checkbox>{t('lead.form.createOpportunity')}</Checkbox>
              </Form.Item>
            </Space>
          </Form.Item>
          <Form.Item name="remark" label={t('lead.form.convertRemark')}>
            <Input.TextArea rows={3} placeholder={t('lead.form.convertRemarkPlaceholder')} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LeadList;
