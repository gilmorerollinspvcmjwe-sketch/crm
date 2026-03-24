/**
 * View Manager - Manage Detail Page Views
 * 
 * Features:
 * - View list
 * - Create new view (redirect to Page Builder)
 * - Edit view
 * - Set default view
 * - Delete view
 */
import React, { useState, useMemo } from 'react';
import {
  Card,
  Button,
  Space,
  Typography,
  Tag,
  Table,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  message,
  Empty,
  Row,
  Col,
  Dropdown,
  Menu,
  Avatar,
  Tooltip,
  Divider,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SettingOutlined,
  StarOutlined,
  StarFilled,
  CopyOutlined,
  EyeOutlined,
  MoreOutlined,
  LayoutOutlined,
  UserOutlined,
  TeamOutlined,
  GlobalOutlined,
  LockOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { colors } from '../../styles/tokens';

const { Text, Title } = Typography;
const { TextArea } = Input;

/** View visibility type */
export type ViewVisibility = 'private' | 'team' | 'all';

/** View type */
export type ViewType = 'system' | 'personal' | 'team_custom';

/** View configuration */
export interface ViewConfig {
  id: string;
  name: string;
  description?: string;
  type: ViewType;
  objectType: string;
  isDefault: boolean;
  visibility: ViewVisibility;
  allowedRoles?: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

/** Mock views data */
const MOCK_VIEWS: ViewConfig[] = [
  {
    id: 'view-1',
    name: 'System Default View',
    description: 'Default view for all users',
    type: 'system',
    objectType: 'customer',
    isDefault: true,
    visibility: 'all',
    createdBy: 'System',
    createdAt: '2026-01-01',
    updatedAt: '2026-03-15',
  },
  {
    id: 'view-2',
    name: 'Sales View',
    description: 'Optimized for sales team with deal information highlighted',
    type: 'team_custom',
    objectType: 'customer',
    isDefault: false,
    visibility: 'team',
    allowedRoles: ['sales'],
    createdBy: '张三',
    createdAt: '2026-02-15',
    updatedAt: '2026-03-10',
  },
  {
    id: 'view-3',
    name: 'Customer Service View',
    description: 'Focused on support tickets and customer health',
    type: 'team_custom',
    objectType: 'customer',
    isDefault: false,
    visibility: 'team',
    allowedRoles: ['support'],
    createdBy: '李四',
    createdAt: '2026-02-20',
    updatedAt: '2026-03-05',
  },
  {
    id: 'view-4',
    name: 'My Personal View',
    description: 'My customized view for daily work',
    type: 'personal',
    objectType: 'customer',
    isDefault: false,
    visibility: 'private',
    createdBy: '王五',
    createdAt: '2026-03-01',
    updatedAt: '2026-03-20',
  },
];

/** Visibility icon mapping */
const visibilityIcons: Record<ViewVisibility, React.ReactNode> = {
  private: <LockOutlined />,
  team: <TeamOutlined />,
  all: <GlobalOutlined />,
};

/** Visibility color mapping */
const visibilityColors: Record<ViewVisibility, string> = {
  private: 'orange',
  team: 'blue',
  all: 'green',
};

/**
 * View Manager Component
 */
export const ViewManager: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { objectId } = useParams<{ objectId: string }>();

  const [views, setViews] = useState<ViewConfig[]>(MOCK_VIEWS);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Table columns
  const columns = [
    {
      title: t('viewManager.viewName'),
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (name: string, record: ViewConfig) => (
        <Space>
          <LayoutOutlined style={{ color: colors.primary }} />
          <Text strong>{name}</Text>
          {record.isDefault && (
            <StarFilled style={{ color: colors.warning }} />
          )}
          {record.type === 'system' && (
            <Tag color="blue" style={{ marginLeft: 4 }}>
              <LockOutlined /> {t('viewManager.system')}
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: t('viewManager.description'),
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (desc: string) => <Text type="secondary">{desc || '-'}</Text>,
    },
    {
      title: t('viewManager.type'),
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: ViewType) => {
        const typeColors: Record<ViewType, string> = {
          system: 'blue',
          personal: 'green',
          team_custom: 'purple',
        };
        const typeLabels: Record<ViewType, string> = {
          system: t('viewManager.systemView'),
          personal: t('viewManager.personalView'),
          team_custom: t('viewManager.teamView'),
        };
        return <Tag color={typeColors[type]}>{typeLabels[type]}</Tag>;
      },
    },
    {
      title: t('viewManager.visibility'),
      dataIndex: 'visibility',
      key: 'visibility',
      width: 120,
      render: (visibility: ViewVisibility) => {
        const labels: Record<ViewVisibility, string> = {
          private: t('viewManager.private'),
          team: t('viewManager.team'),
          all: t('viewManager.all'),
        };
        return (
          <Tag icon={visibilityIcons[visibility]} color={visibilityColors[visibility]}>
            {labels[visibility]}
          </Tag>
        );
      },
    },
    {
      title: t('viewManager.createdBy'),
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 100,
      render: (creator: string) => (
        <Space size={4}>
          <Avatar size="small" icon={<UserOutlined />} />
          <Text>{creator}</Text>
        </Space>
      ),
    },
    {
      title: t('viewManager.updatedAt'),
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 120,
    },
    {
      title: t('common.actions'),
      key: 'actions',
      width: 120,
      render: (_: any, record: ViewConfig) => (
        <Space>
          <Tooltip title={t('viewManager.editView')}>
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => navigate(`/settings/page-builder/${objectId}?viewId=${record.id}`)}
            />
          </Tooltip>
          <Tooltip title={t('viewManager.copyView')}>
            <Button
              type="text"
              size="small"
              icon={<CopyOutlined />}
              onClick={() => {
                const newView: ViewConfig = {
                  ...record,
                  id: `view-${Date.now()}`,
                  name: `${record.name} (Copy)`,
                  type: 'personal',
                  isDefault: false,
                  createdBy: 'Current User',
                  createdAt: new Date().toISOString().split('T')[0],
                  updatedAt: new Date().toISOString().split('T')[0],
                };
                setViews([...views, newView]);
                message.success(t('viewManager.copySuccess'));
              }}
            />
          </Tooltip>
          {record.type !== 'system' && (
            <Tooltip title={t('common.delete')}>
              <Button
                type="text"
                size="small"
                icon={<DeleteOutlined />}
                danger
                onClick={() => {
                  Modal.confirm({
                    title: t('common.deleteConfirm'),
                    content: t('viewManager.deleteViewContent', { name: record.name }),
                    okType: 'danger',
                    onOk: () => {
                      setViews(views.filter(v => v.id !== record.id));
                      message.success(t('common.deleteSuccess'));
                    },
                  });
                }}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  // Set default view
  const handleSetDefault = (viewId: string) => {
    setViews(views.map(v => ({
      ...v,
      isDefault: v.id === viewId,
    })));
    message.success(t('viewManager.setDefaultSuccess'));
  };

  // Create new view
  const handleCreateView = (values: any) => {
    const newView: ViewConfig = {
      id: `view-${Date.now()}`,
      name: values.name,
      description: values.description,
      type: values.visibility === 'private' ? 'personal' : 'team_custom',
      objectType: objectId || 'customer',
      isDefault: false,
      visibility: values.visibility,
      allowedRoles: values.allowedRoles,
      createdBy: 'Current User',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setViews([...views, newView]);
    setCreateModalVisible(false);
    form.resetFields();
    message.success(t('viewManager.createSuccess'));
    // Navigate to Page Builder
    navigate(`/settings/page-builder/${objectId}?viewId=${newView.id}`);
  };

  return (
    <div style={{ padding: 0, background: colors.background.default, minHeight: '100%' }}>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card size="small">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 8, background: colors.primarySubtle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LayoutOutlined style={{ fontSize: 24, color: colors.primary }} />
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>{t('viewManager.totalViews')}</Text>
                <Title level={3} style={{ margin: 0 }}>{views.length}</Title>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 8, background: '#E3F2FD', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LockOutlined style={{ fontSize: 24, color: '#1565C0' }} />
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>{t('viewManager.systemViews')}</Text>
                <Title level={3} style={{ margin: 0 }}>{views.filter(v => v.type === 'system').length}</Title>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 8, background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserOutlined style={{ fontSize: 24, color: '#2E7D32' }} />
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>{t('viewManager.personalViews')}</Text>
                <Title level={3} style={{ margin: 0 }}>{views.filter(v => v.type === 'personal').length}</Title>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 8, background: '#F3E5F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TeamOutlined style={{ fontSize: 24, color: '#7B1FA2' }} />
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>{t('viewManager.teamViews')}</Text>
                <Title level={3} style={{ margin: 0 }}>{views.filter(v => v.type === 'team_custom').length}</Title>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Views Table */}
      <Card size="small">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={views}
          pagination={false}
          onRow={(record) => ({
            onClick: () => navigate(`/settings/page-builder/${objectId}?viewId=${record.id}`),
            style: { cursor: 'pointer' },
          })}
        />
      </Card>

      {/* Create View Modal */}
      <Modal
        title={t('viewManager.newView')}
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText={t('common.create')}
        cancelText={t('common.cancel')}
        width={500}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateView}>
          <Form.Item
            name="name"
            label={t('viewManager.viewName')}
            rules={[{ required: true, message: t('viewManager.viewNameRequired') }]}
          >
            <Input placeholder={t('viewManager.viewNamePlaceholder')} />
          </Form.Item>
          <Form.Item name="description" label={t('viewManager.description')}>
            <TextArea rows={2} placeholder={t('viewManager.descriptionPlaceholder')} />
          </Form.Item>
          <Form.Item name="visibility" label={t('viewManager.visibility')} initialValue="private">
            <Select
              options={[
                { label: (
                  <Space>
                    <LockOutlined />
                    {t('viewManager.private')}
                    <Text type="secondary" style={{ fontSize: 12 }}>({t('viewManager.privateDesc')})</Text>
                  </Space>
                ), value: 'private' },
                { label: (
                  <Space>
                    <TeamOutlined />
                    {t('viewManager.team')}
                    <Text type="secondary" style={{ fontSize: 12 }}>({t('viewManager.teamDesc')})</Text>
                  </Space>
                ), value: 'team' },
                { label: (
                  <Space>
                    <GlobalOutlined />
                    {t('viewManager.all')}
                    <Text type="secondary" style={{ fontSize: 12 }}>({t('viewManager.allDesc')})</Text>
                  </Space>
                ), value: 'all' },
              ]}
            />
          </Form.Item>
          <Form.Item noStyle shouldUpdate>
            {({ getFieldValue }) => {
              const visibility = getFieldValue('visibility');
              if (visibility === 'team') {
                return (
                  <Form.Item name="allowedRoles" label={t('viewManager.allowedRoles')}>
                    <Select
                      mode="multiple"
                      placeholder={t('viewManager.allowedRolesPlaceholder')}
                      options={[
                        { label: t('permission.roles.administrator'), value: 'admin' },
                        { label: t('viewManager.salesRole'), value: 'sales' },
                        { label: t('viewManager.supportRole'), value: 'support' },
                        { label: t('viewManager.managerRole'), value: 'manager' },
                      ]}
                    />
                  </Form.Item>
                );
              }
              return null;
            }}
          </Form.Item>
          <Form.Item name="isDefault" valuePropName="checked" initialValue={false}>
            <Switch /> <Text>{t('viewManager.setAsDefault')}</Text>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ViewManager;