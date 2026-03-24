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
import { LeadTable } from '../components/Customer/LeadTable';
import { SearchFilter, FilterField } from '../components/Customer/SearchFilter';
import { getLeadList } from '../mock/leadData';
import { Lead, LeadStatus, LeadSource } from '../types/lead';

/** 状态选项 */
const statusOptions = [
  { label: '待跟进', value: '待跟进' },
  { label: '跟进中', value: '跟进中' },
  { label: '已转化', value: '已转化' },
  { label: '已关闭', value: '已关闭' },
];

/** 来源选项 */
const sourceOptions = [
  { label: '市场活动', value: '市场活动' },
  { label: '官网', value: '官网' },
  { label: '转介绍', value: '转介绍' },
  { label: '陌拜', value: '陌拜' },
  { label: '广告', value: '广告' },
  { label: '其他', value: '其他' },
];

/**
 * 线索列表页组件
 */
export const LeadList: React.FC = () => {
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
      message.error('加载线索列表失败');
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
      title: '分配线索',
      content: '选择要分配给的销售人员',
      okText: '确定',
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
    message.success('线索转化成功');
    setConvertModalVisible(false);
    setConvertingLeadId(null);
    loadLeadList();
  };

  /** 删除线索 */
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该线索吗？删除后无法恢复。',
      okText: '确认删除',
      cancelText: '取消',
      okType: 'danger',
      onOk: () => {
        message.success('删除线索成功');
        loadLeadList();
      },
    });
  };

  /** 批量分配 */
  const handleBatchAssign = (ids: string[]) => {
    Modal.info({
      title: '批量分配线索',
      content: `将 ${ids.length} 个线索分配给：`,
      // TODO: 实现分配功能
    });
  };

  /** 批量转化 */
  const handleBatchConvert = (ids: string[]) => {
    Modal.confirm({
      title: '批量转化',
      content: `确定要将 ${ids.length} 个线索转化为客户吗？`,
      onOk: () => {
        message.success('批量转化成功');
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
    message.success('新建线索成功');
    setCreateModalVisible(false);
    loadLeadList();
  };

  /** 处理编辑线索提交 */
  const handleEditSubmit = (values: any) => {
    console.log('编辑线索:', values);
    message.success('编辑线索成功');
    setEditModalVisible(false);
    setEditingLeadId(null);
    loadLeadList();
  };

  /** 处理删除线索确认 */
  const handleDeleteConfirm = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该线索吗？删除后无法恢复。',
      okText: '确认删除',
      cancelText: '取消',
      okType: 'danger',
      onOk: () => {
        message.success('删除线索成功');
        loadLeadList();
      },
    });
  };

  /** 导入线索 */
  const handleImport = () => {
    message.info('导入线索功能待实现');
    // TODO: 实现导入功能
  };

  /** 筛选字段配置 */
  const filterFields: FilterField[] = [
    {
      name: 'name',
      label: '线索名称',
      type: 'text',
      placeholder: '请输入线索名称或联系人',
    },
    {
      name: 'source',
      label: '来源',
      type: 'select',
      placeholder: '请选择来源',
      options: sourceOptions,
    },
    {
      name: 'status',
      label: '状态',
      type: 'select',
      placeholder: '请选择状态',
      options: statusOptions,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card
        title="线索管理"
        extra={
          <Space>
            <Button icon={<ImportOutlined />} onClick={handleImport}>
              导入
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
              新建线索
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
        title="新建线索"
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
        >
          <Form.Item
            name="name"
            label="线索名称"
            rules={[{ required: true, message: '请输入线索名称' }]}
          >
            <Input placeholder="请输入线索名称" />
          </Form.Item>
          <Form.Item name="source" label="线索来源">
            <Select placeholder="请选择线索来源">
              <Select.Option value="市场活动">市场活动</Select.Option>
              <Select.Option value="官网">官网</Select.Option>
              <Select.Option value="转介绍">转介绍</Select.Option>
              <Select.Option value="陌拜">陌拜</Select.Option>
              <Select.Option value="广告">广告</Select.Option>
              <Select.Option value="其他">其他</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="level" label="线索级别">
            <Select placeholder="请选择线索级别">
              <Select.Option value="高">高</Select.Option>
              <Select.Option value="中">中</Select.Option>
              <Select.Option value="低">低</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="contactName" label="联系人姓名">
            <Input placeholder="请输入联系人姓名" />
          </Form.Item>
          <Form.Item name="mobile" label="手机号码">
            <Input placeholder="请输入手机号码" />
          </Form.Item>
          <Form.Item name="email" label="邮箱">
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item name="companyName" label="公司名称">
            <Input placeholder="请输入公司名称" />
          </Form.Item>
          <Form.Item name="intentionProduct" label="意向产品">
            <Input placeholder="请输入意向产品" />
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={3} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑线索弹窗 */}
      <Modal
        title="编辑线索"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setEditingLeadId(null);
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
            label="线索名称"
            rules={[{ required: true, message: '请输入线索名称' }]}
          >
            <Input placeholder="请输入线索名称" />
          </Form.Item>
          <Form.Item name="source" label="线索来源">
            <Select placeholder="请选择线索来源">
              <Select.Option value="市场活动">市场活动</Select.Option>
              <Select.Option value="官网">官网</Select.Option>
              <Select.Option value="转介绍">转介绍</Select.Option>
              <Select.Option value="陌拜">陌拜</Select.Option>
              <Select.Option value="广告">广告</Select.Option>
              <Select.Option value="其他">其他</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="level" label="线索级别">
            <Select placeholder="请选择线索级别">
              <Select.Option value="高">高</Select.Option>
              <Select.Option value="中">中</Select.Option>
              <Select.Option value="低">低</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="contactName" label="联系人姓名">
            <Input placeholder="请输入联系人姓名" />
          </Form.Item>
          <Form.Item name="mobile" label="手机号码">
            <Input placeholder="请输入手机号码" />
          </Form.Item>
          <Form.Item name="email" label="邮箱">
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item name="companyName" label="公司名称">
            <Input placeholder="请输入公司名称" />
          </Form.Item>
          <Form.Item name="intentionProduct" label="意向产品">
            <Input placeholder="请输入意向产品" />
          </Form.Item>
          <Form.Item name="status" label="线索状态">
            <Select placeholder="请选择线索状态">
              <Select.Option value="待跟进">待跟进</Select.Option>
              <Select.Option value="跟进中">跟进中</Select.Option>
              <Select.Option value="已转化">已转化</Select.Option>
              <Select.Option value="已关闭">已关闭</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={3} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 线索转化弹窗 */}
      <Modal
        title="线索转化"
        open={convertModalVisible}
        onCancel={() => {
          setConvertModalVisible(false);
          setConvertingLeadId(null);
        }}
        onOk={() => convertForm.submit()}
        okText="确定"
        cancelText="取消"
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
          <Form.Item label="转化类型">
            <Space direction="vertical">
              <Form.Item name="createCustomer" valuePropName="checked" noStyle>
                <Checkbox>创建客户</Checkbox>
              </Form.Item>
              <Form.Item name="createContact" valuePropName="checked" noStyle>
                <Checkbox>创建联系人</Checkbox>
              </Form.Item>
              <Form.Item name="createOpportunity" valuePropName="checked" noStyle>
                <Checkbox>创建商机</Checkbox>
              </Form.Item>
            </Space>
          </Form.Item>
          <Form.Item name="remark" label="转化说明">
            <Input.TextArea rows={3} placeholder="请输入转化说明" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LeadList;
