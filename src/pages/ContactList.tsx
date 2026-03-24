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
import { ContactTable } from '../components/Customer/ContactTable';
import { SearchFilter, FilterField } from '../components/Customer/SearchFilter';
import { getContactList } from '../mock/contactData';
import { Contact } from '../types/contact';

/**
 * 联系人列表页组件
 */
export const ContactList: React.FC = () => {
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
      message.error('加载联系人列表失败');
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
      title: '确认删除',
      content: '确定要删除该联系人吗？删除后无法恢复。',
      okText: '确认删除',
      cancelText: '取消',
      okType: 'danger',
      onOk: () => {
        message.success('删除联系人成功');
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
    message.success('新建联系人成功');
    setCreateModalVisible(false);
    loadContactList();
  };

  /** 处理编辑联系人提交 */
  const handleEditSubmit = (values: any) => {
    console.log('编辑联系人:', values);
    message.success('编辑联系人成功');
    setEditModalVisible(false);
    setEditingContactId(null);
    loadContactList();
  };

  /** 处理删除联系人确认 */
  const handleDeleteConfirm = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该联系人吗？删除后无法恢复。',
      okText: '确认删除',
      cancelText: '取消',
      okType: 'danger',
      onOk: () => {
        message.success('删除联系人成功');
        loadContactList();
      },
    });
  };

  /** 筛选字段配置 */
  const filterFields: FilterField[] = [
    {
      name: 'name',
      label: '姓名',
      type: 'text',
      placeholder: '请输入姓名',
    },
    {
      name: 'customerName',
      label: '所属客户',
      type: 'text',
      placeholder: '请输入客户名称',
    },
    {
      name: 'position',
      label: '职位',
      type: 'text',
      placeholder: '请输入职位',
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card
        title="联系人管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建联系人
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
        title="新建联系人"
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onOk={() => form.submit()}
        okText="确定"
        cancelText="取消"
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
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item name="gender" label="性别">
            <Radio.Group>
              <Radio value="男">男</Radio>
              <Radio value="女">女</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="mobile" label="手机号码">
            <Input placeholder="请输入手机号码" />
          </Form.Item>
          <Form.Item name="email" label="邮箱">
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item name="position" label="职位">
            <Input placeholder="请输入职位" />
          </Form.Item>
          <Form.Item name="customerId" label="所属客户">
            <Select placeholder="请选择所属客户">
              <Select.Option value="1">示例客户 1</Select.Option>
              <Select.Option value="2">示例客户 2</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="wechat" label="微信">
            <Input placeholder="请输入微信号" />
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={3} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑联系人弹窗 */}
      <Modal
        title="编辑联系人"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setEditingContactId(null);
        }}
        onOk={() => form.submit()}
        okText="确定"
        cancelText="取消"
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditSubmit}
        >
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item name="gender" label="性别">
            <Radio.Group>
              <Radio value="男">男</Radio>
              <Radio value="女">女</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="mobile" label="手机号码">
            <Input placeholder="请输入手机号码" />
          </Form.Item>
          <Form.Item name="email" label="邮箱">
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item name="position" label="职位">
            <Input placeholder="请输入职位" />
          </Form.Item>
          <Form.Item name="customerId" label="所属客户">
            <Select placeholder="请选择所属客户">
              <Select.Option value="1">示例客户 1</Select.Option>
              <Select.Option value="2">示例客户 2</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="wechat" label="微信">
            <Input placeholder="请输入微信号" />
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={3} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ContactList;
