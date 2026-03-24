/**
 * 邮件模板管理页
 * 功能：
 * - 表格展示邮件模板列表
 * - 搜索筛选：按名称、分类筛选
 * - 预览模板内容
 * - 新建/编辑模板
 */
import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Select,
  Tag,
  Typography,
  Modal,
  Form,
  message,
  Divider,
  Row,
  Col,
  Statistic,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import { EmailTemplate } from '../types/marketing';
import { getEmailTemplatesData } from '../mock/marketingData';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { TextArea } = Input;

/**
 * 邮件模板管理页组件
 */
export const EmailTemplates: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [templateList, setTemplateList] = useState<EmailTemplate[]>([]);
  const [filteredData, setFilteredData] = useState<EmailTemplate[]>([]);
  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | undefined>();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);
  const [form] = Form.useForm();

  /** 加载数据 */
  const loadTemplates = () => {
    setLoading(true);
    try {
      const data = getEmailTemplatesData();
      setTemplateList(data);
      setFilteredData(data);
    } catch (error) {
      message.error('加载邮件模板列表失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /** 初始加载 */
  useEffect(() => {
    loadTemplates();
  }, []);

  /** 筛选数据 */
  useEffect(() => {
    let filtered = [...templateList];

    if (searchText) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.subject.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (filterCategory) {
      filtered = filtered.filter((item) => item.category === filterCategory);
    }

    setFilteredData(filtered);
  }, [searchText, filterCategory, templateList]);

  /** 处理搜索 */
  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  /** 重置筛选 */
  const handleReset = () => {
    setSearchText('');
    setFilterCategory(undefined);
  };

  /** 预览模板 */
  const handlePreview = (template: EmailTemplate) => {
    setPreviewTemplate(template);
    setPreviewVisible(true);
  };

  /** 新建模板 */
  const handleCreate = () => {
    Modal.info({
      title: '新建模板',
      content: '新建模板功能开发中...',
      width: 600,
    });
  };

  /** 编辑模板 */
  const handleEdit = (template: EmailTemplate) => {
    Modal.info({
      title: '编辑模板',
      content: '编辑模板功能开发中...',
      width: 600,
    });
  };

  /** 复制模板 */
  const handleCopy = (template: EmailTemplate) => {
    message.success(`已复制模板"${template.name}"`);
  };

  /** 删除模板 */
  const handleDelete = (template: EmailTemplate) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除模板"${template.name}"吗？此操作不可恢复。`,
      onOk: () => {
        setTemplateList(templateList.filter((t) => t.id !== template.id));
        message.success('模板已删除');
      },
    });
  };

  /** 获取所有分类 */
  const categories = Array.from(new Set(templateList.map((t) => t.category)));

  /** 表格列定义 */
  const columns = [
    {
      title: '模板名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text: string, record: EmailTemplate) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.subject}
          </Text>
        </Space>
      ),
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category: string) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: '变量数量',
      key: 'variables',
      width: 100,
      render: (_: unknown, record: EmailTemplate) => (
        <Tag color="green">{record.variables.length} 个变量</Tag>
      ),
    },
    {
      title: '创建人',
      dataIndex: 'createdByName',
      key: 'createdByName',
      width: 100,
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 180,
      render: (time: string) => new Date(time).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: unknown, record: EmailTemplate) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handlePreview(record)}
          >
            预览
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            icon={<CopyOutlined />}
            onClick={() => handleCopy(record)}
          >
            复制
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Statistic
              title="模板总数"
              value={templateList.length}
              suffix="个"
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="分类数量"
              value={categories.length}
              suffix="个"
              valueStyle={{ color: '#722ed1' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="总变量数"
              value={templateList.reduce((sum, t) => sum + t.variables.length, 0)}
              suffix="个"
              valueStyle={{ color: '#faad14' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="最近更新"
              value={new Date(Math.max(...templateList.map((t) => new Date(t.updatedAt).getTime()))).toLocaleDateString('zh-CN')}
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
        </Row>
      </Card>

      <Card
        title="邮件模板管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建模板
          </Button>
        }
      >
        <Space style={{ marginBottom: 16 }} wrap>
          <Search
            placeholder="搜索模板名称或主题"
            allowClear
            onSearch={handleSearch}
            style={{ width: 300 }}
            prefix={<SearchOutlined />}
          />
          <Select
            placeholder="模板分类"
            allowClear
            style={{ width: 150 }}
            onChange={(value) => setFilterCategory(value)}
            options={categories.map((cat) => ({ label: cat, value: cat }))}
          />
          <Button onClick={handleReset}>重置</Button>
        </Space>

        <Table
          loading={loading}
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 个模板`,
          }}
        />
      </Card>

      {/* 预览弹窗 */}
      <Modal
        title={
          <Space>
            <EyeOutlined />
            <span>模板预览</span>
          </Space>
        }
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setPreviewVisible(false)}>
            关闭
          </Button>,
        ]}
      >
        {previewTemplate && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Title level={4}>{previewTemplate.name}</Title>
              <Divider style={{ margin: '12px 0' }} />
            </div>

            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <Text strong>分类：</Text>
                <Tag color="blue">{previewTemplate.category}</Tag>
              </Col>
              <Col span={12}>
                <Text strong>创建人：</Text>
                <Text>{previewTemplate.createdByName}</Text>
              </Col>
            </Row>

            <div style={{ marginBottom: 16 }}>
              <Text strong>邮件主题：</Text>
              <Paragraph
                copyable={{ text: previewTemplate.subject }}
                style={{ background: '#f5f5f5', padding: 8, borderRadius: 4, marginTop: 8 }}
              >
                {previewTemplate.subject}
              </Paragraph>
            </div>

            {previewTemplate.previewText && (
              <div style={{ marginBottom: 16 }}>
                <Text strong>预览文本：</Text>
                <Paragraph type="secondary" style={{ marginTop: 8 }}>
                  {previewTemplate.previewText}
                </Paragraph>
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <Text strong>可用变量：</Text>
              <div style={{ marginTop: 8 }}>
                {previewTemplate.variables.map((variable, index) => (
                  <Tag key={index} color="green">
                    {`{{${variable}}}`}
                  </Tag>
                ))}
              </div>
            </div>

            <div>
              <Text strong>模板内容：</Text>
              <TextArea
                value={previewTemplate.content}
                readOnly
                rows={12}
                style={{ marginTop: 8, fontFamily: 'monospace' }}
              />
            </div>

            <Divider />
            <Text type="secondary">
              创建时间：{new Date(previewTemplate.createdAt).toLocaleString('zh-CN')}
              {' | '}
              更新时间：{new Date(previewTemplate.updatedAt).toLocaleString('zh-CN')}
            </Text>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EmailTemplates;
