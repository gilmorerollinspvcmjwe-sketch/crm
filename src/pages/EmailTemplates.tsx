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
import { useTranslation } from 'react-i18next';
import { EmailTemplate } from '../types/marketing';
import { getEmailTemplatesData } from '../mock/marketingData';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { TextArea } = Input;

/**
 * 邮件模板管理页组件
 */
export const EmailTemplates: React.FC = () => {
  const { t } = useTranslation();
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
      message.error(t('marketing.emailTemplates.loadFailed'));
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
      title: t('marketing.emailTemplates.newTemplate'),
      content: t('common.loading'),
      width: 600,
    });
  };

  /** 编辑模板 */
  const handleEdit = (template: EmailTemplate) => {
    Modal.info({
      title: t('marketing.emailTemplates.edit'),
      content: t('common.loading'),
      width: 600,
    });
  };

  /** 复制模板 */
  const handleCopy = (template: EmailTemplate) => {
    message.success(t('marketing.emailTemplates.copiedSuccess', { name: template.name }));
  };

  /** 删除模板 */
  const handleDelete = (template: EmailTemplate) => {
    Modal.confirm({
      title: t('common.confirm'),
      content: t('marketing.emailTemplates.deleteConfirm', { name: template.name }),
      onOk: () => {
        setTemplateList(templateList.filter((t) => t.id !== template.id));
        message.success(t('marketing.emailTemplates.deletedSuccess'));
      },
    });
  };

  /** 获取所有分类 */
  const categories = Array.from(new Set(templateList.map((t) => t.category)));

  /** 表格列定义 */
  const columns = [
    {
      title: t('marketing.emailTemplates.columnName'),
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
      title: t('marketing.emailTemplates.columnCategory'),
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category: string) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: t('marketing.emailTemplates.columnVariables'),
      key: 'variables',
      width: 100,
      render: (_: unknown, record: EmailTemplate) => (
        <Tag color="green">{t('marketing.emailTemplates.variableCount', { count: record.variables.length })}</Tag>
      ),
    },
    {
      title: t('marketing.emailTemplates.columnCreator'),
      dataIndex: 'createdByName',
      key: 'createdByName',
      width: 100,
    },
    {
      title: t('marketing.emailTemplates.columnUpdateTime'),
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 180,
      render: (time: string) => new Date(time).toLocaleString('zh-CN'),
    },
    {
      title: t('common.edit'),
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
            {t('marketing.emailTemplates.preview')}
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            {t('marketing.emailTemplates.edit')}
          </Button>
          <Button
            type="link"
            size="small"
            icon={<CopyOutlined />}
            onClick={() => handleCopy(record)}
          >
            {t('marketing.emailTemplates.copy')}
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            {t('marketing.emailTemplates.delete')}
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
              title={t('marketing.emailTemplates.totalTemplates')}
              value={templateList.length}
              suffix={t('marketing.campaigns.unit')}
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title={t('marketing.emailTemplates.categoryCount')}
              value={categories.length}
              suffix={t('marketing.campaigns.unit')}
              valueStyle={{ color: '#722ed1' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title={t('marketing.emailTemplates.totalVariables')}
              value={templateList.reduce((sum, t) => sum + t.variables.length, 0)}
              suffix={t('marketing.campaigns.unit')}
              valueStyle={{ color: '#faad14' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title={t('marketing.emailTemplates.lastUpdate')}
              value={new Date(Math.max(...templateList.map((t) => new Date(t.updatedAt).getTime()))).toLocaleDateString('zh-CN')}
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
        </Row>
      </Card>

      <Card
        title={t('marketing.emailTemplates.title')}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            {t('marketing.emailTemplates.newTemplate')}
          </Button>
        }
      >
        <Space style={{ marginBottom: 16 }} wrap>
          <Search
            placeholder={t('marketing.emailTemplates.searchPlaceholder')}
            allowClear
            onSearch={handleSearch}
            style={{ width: 300 }}
            prefix={<SearchOutlined />}
          />
          <Select
            placeholder={t('marketing.emailTemplates.templateCategory')}
            allowClear
            style={{ width: 150 }}
            onChange={(value) => setFilterCategory(value)}
            options={categories.map((cat) => ({ label: cat, value: cat }))}
          />
          <Button onClick={handleReset}>{t('common.reset')}</Button>
        </Space>

        <Table
          loading={loading}
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `${t('common.total')} ${total} ${t('marketing.campaigns.unit')}`,
          }}
        />
      </Card>

      {/* 预览弹窗 */}
      <Modal
        title={
          <Space>
            <EyeOutlined />
            <span>{t('marketing.emailTemplates.templatePreview')}</span>
          </Space>
        }
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setPreviewVisible(false)}>
            {t('marketing.emailTemplates.close')}
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
                <Text strong>{t('marketing.emailTemplates.category')}：</Text>
                <Tag color="blue">{previewTemplate.category}</Tag>
              </Col>
              <Col span={12}>
                <Text strong>{t('marketing.emailTemplates.creator')}：</Text>
                <Text>{previewTemplate.createdByName}</Text>
              </Col>
            </Row>

            <div style={{ marginBottom: 16 }}>
              <Text strong>{t('marketing.emailTemplates.emailSubject')}：</Text>
              <Paragraph
                copyable={{ text: previewTemplate.subject }}
                style={{ background: '#f5f5f5', padding: 8, borderRadius: 4, marginTop: 8 }}
              >
                {previewTemplate.subject}
              </Paragraph>
            </div>

            {previewTemplate.previewText && (
              <div style={{ marginBottom: 16 }}>
                <Text strong>{t('marketing.emailTemplates.previewText')}：</Text>
                <Paragraph type="secondary" style={{ marginTop: 8 }}>
                  {previewTemplate.previewText}
                </Paragraph>
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <Text strong>{t('marketing.emailTemplates.availableVariables')}：</Text>
              <div style={{ marginTop: 8 }}>
                {previewTemplate.variables.map((variable, index) => (
                  <Tag key={index} color="green">
                    {`{{${variable}}}`}
                  </Tag>
                ))}
              </div>
            </div>

            <div>
              <Text strong>{t('marketing.emailTemplates.templateContent')}：</Text>
              <TextArea
                value={previewTemplate.content}
                readOnly
                rows={12}
                style={{ marginTop: 8, fontFamily: 'monospace' }}
              />
            </div>

            <Divider />
            <Text type="secondary">
              {t('marketing.emailTemplates.createdAt')}：{new Date(previewTemplate.createdAt).toLocaleString('zh-CN')}
              {' | '}
              {t('marketing.emailTemplates.updatedAt')}：{new Date(previewTemplate.updatedAt).toLocaleString('zh-CN')}
            </Text>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EmailTemplates;