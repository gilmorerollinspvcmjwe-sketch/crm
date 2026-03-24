/**
 * 联系人列表页
 * 功能：
 * - 表格展示联系人列表
 * - 搜索筛选：按姓名、客户、职位筛选
 * - 分页：每页 20 条
 */
import React, { useState, useEffect } from 'react';
import { Card, Button, Space, message, Modal, Form, Input, Select, Radio } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ContactTable } from '../components/Customer/ContactTable';
import { SearchFilter, FilterField } from '../components/Customer/SearchFilter';
import { getContactList } from '../mock/contactData';
import { Contact } from '../types/contact';

/**
 * 联系人列表页组件
 */
export const ContactList: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [contactList, setContactList] = useState<Contact[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  const [form] = Form.useForm();

  /** 加载联系人列表 */
  const loadContactList = () => {
    setLoading(true);
    try {
      const { list, total } = getContactList({
        ...filters,
        page,
        pageSize,
      });
      setContactList(list);
      setTotal(total);
    } catch (error) {
      message.error(t('contact.list.loadFailed'));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /** 初始加载 */
  useEffect(() => {
    loadContactList();
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
    navigate(`/contact/${id}`);
  };

  /** 编辑联系人 */
  const handleEdit = (id: string) => {
    setEditingContactId(id);
    form.setFieldsValue({ id });
    setEditModalVisible(true);
  };

  /** 删除联系人 */
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: t('contact.list.confirmDelete'),
      content: t('contact.list.confirmDeleteContent'),
      okText: t('contact.list.confirmDeleteBtn'),
      cancelText: t('contact.form.cancel'),
      okType: 'danger',
      onOk: () => {
        message.success(t('contact.list.deleteSuccess'));
        loadContactList();
      },
    });
  };

  /** 新建联系人 */
  const handleCreate = () => {
    form.resetFields();
    setCreateModalVisible(true);
  };

  /** 处理新建联系人提交 */
  const handleCreateSubmit = (values: any) => {
    console.log('新建联系人:', values);
    message.success(t('contact.list.createSuccess'));
    setCreateModalVisible(false);
    loadContactList();
  };

  /** 处理编辑联系人提交 */
  const handleEditSubmit = (values: any) => {
    console.log('编辑联系人:', values);
    message.success(t('contact.list.editSuccess'));
    setEditModalVisible(false);
    setEditingContactId(null);
    loadContactList();
  };

  /** 处理删除联系人确认 */
  const handleDeleteConfirm = (id: string) => {
    Modal.confirm({
      title: t('contact.list.confirmDelete'),
      content: t('contact.list.confirmDeleteContent'),
      okText: t('contact.list.confirmDeleteBtn'),
      cancelText: t('contact.form.cancel'),
      okType: 'danger',
      onOk: () => {
        message.success(t('contact.list.deleteSuccess'));
        loadContactList();
      },
    });
  };

  /** 筛选字段配置 */
  const filterFields: FilterField[] = [
    {
      name: 'name',
      label: t('contact.filter.name'),
      type: 'text',
      placeholder: t('contact.filter.namePlaceholder'),
    },
    {
      name: 'customerName',
      label: t('contact.filter.customerName'),
      type: 'text',
      placeholder: t('contact.filter.customerNamePlaceholder'),
    },
    {
      name: 'position',
      label: t('contact.filter.position'),
      type: 'text',
      placeholder: t('contact.filter.positionPlaceholder'),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card
        title={t('contact.list.title')}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            {t('contact.list.createContact')}
          </Button>
        }
      >
        {/* 搜索筛选 */}
        <SearchFilter
          fields={filterFields}
          onSearch={handleSearch}
          onReset={handleReset}
          loading={loading}
        />

        {/* 联系人表格 */}
        <ContactTable
          dataSource={contactList}
          loading={loading}
          pagination={{
            current: page,
            pageSize,
            total,
            onChange: handlePageChange,
          }}
          onViewDetail={handleViewDetail}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card>

      {/* 新建联系人弹窗 */}
      <Modal
        title={t('contact.form.createTitle')}
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onOk={() => form.submit()}
        okText={t('contact.form.confirm')}
        cancelText={t('contact.form.cancel')}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateSubmit}
          initialValues={{
            gender: '男',
          }}
        >
          <Form.Item
            name="name"
            label={t('contact.form.name')}
            rules={[{ required: true, message: t('contact.form.nameRequired') }]}
          >
            <Input placeholder={t('contact.form.namePlaceholder')} />
          </Form.Item>
          <Form.Item name="gender" label={t('contact.form.gender')}>
            <Radio.Group>
              <Radio value="男">{t('contact.form.male')}</Radio>
              <Radio value="女">{t('contact.form.female')}</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="mobile" label={t('contact.form.mobile')}>
            <Input placeholder={t('contact.form.mobilePlaceholder')} />
          </Form.Item>
          <Form.Item name="email" label={t('contact.form.email')}>
            <Input placeholder={t('contact.form.emailPlaceholder')} />
          </Form.Item>
          <Form.Item name="position" label={t('contact.form.position')}>
            <Input placeholder={t('contact.form.positionPlaceholder')} />
          </Form.Item>
          <Form.Item name="customerId" label={t('contact.form.customer')}>
            <Select placeholder={t('contact.form.customerPlaceholder')}>
              <Select.Option value="1">示例客户 1</Select.Option>
              <Select.Option value="2">示例客户 2</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="wechat" label={t('contact.form.wechat')}>
            <Input placeholder={t('contact.form.wechatPlaceholder')} />
          </Form.Item>
          <Form.Item name="remark" label={t('contact.form.remark')}>
            <Input.TextArea rows={3} placeholder={t('contact.form.remarkPlaceholder')} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑联系人弹窗 */}
      <Modal
        title={t('contact.form.editTitle')}
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setEditingContactId(null);
        }}
        onOk={() => form.submit()}
        okText={t('contact.form.confirm')}
        cancelText={t('contact.form.cancel')}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditSubmit}
        >
          <Form.Item
            name="name"
            label={t('contact.form.name')}
            rules={[{ required: true, message: t('contact.form.nameRequired') }]}
          >
            <Input placeholder={t('contact.form.namePlaceholder')} />
          </Form.Item>
          <Form.Item name="gender" label={t('contact.form.gender')}>
            <Radio.Group>
              <Radio value="男">{t('contact.form.male')}</Radio>
              <Radio value="女">{t('contact.form.female')}</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="mobile" label={t('contact.form.mobile')}>
            <Input placeholder={t('contact.form.mobilePlaceholder')} />
          </Form.Item>
          <Form.Item name="email" label={t('contact.form.email')}>
            <Input placeholder={t('contact.form.emailPlaceholder')} />
          </Form.Item>
          <Form.Item name="position" label={t('contact.form.position')}>
            <Input placeholder={t('contact.form.positionPlaceholder')} />
          </Form.Item>
          <Form.Item name="customerId" label={t('contact.form.customer')}>
            <Select placeholder={t('contact.form.customerPlaceholder')}>
              <Select.Option value="1">示例客户 1</Select.Option>
              <Select.Option value="2">示例客户 2</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="wechat" label={t('contact.form.wechat')}>
            <Input placeholder={t('contact.form.wechatPlaceholder')} />
          </Form.Item>
          <Form.Item name="remark" label={t('contact.form.remark')}>
            <Input.TextArea rows={3} placeholder={t('contact.form.remarkPlaceholder')} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ContactList;
