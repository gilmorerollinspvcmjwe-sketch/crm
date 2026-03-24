/**
 * 自定义对象列表页
 */
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Button,
  Space,
  Input,
  Tag,
  Empty,
  Spin,
  Dropdown,
  Modal,
  message,
  Typography,
  Row,
  Col,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  SettingOutlined,
  DatabaseOutlined,
  ApartmentOutlined,
  FormOutlined,
  LockOutlined,
  UnlockOutlined,
} from '@ant-design/icons';
import * as Icons from '@ant-design/icons';
import { useCustomObjectsStore } from '../../store/customObjects';
import { CustomObject } from '../../types/customObject';
import styles from './CustomObjects.module.css';

const { Title, Text } = Typography;

// 动态获取图标组件
const getIconComponent = (iconName: string | undefined) => {
  if (!iconName) return <DatabaseOutlined />;
  const IconComponent = (Icons as any)[iconName];
  return IconComponent ? <IconComponent /> : <DatabaseOutlined />;
};

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const CustomObjects: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { objects, properties, deleteObject, loading } = useCustomObjectsStore();
  const [searchText, setSearchText] = React.useState('');
  const [filterType, setFilterType] = React.useState<'all' | 'system' | 'custom'>('all');

  // 过滤对象
  const filteredObjects = useMemo(() => {
    return objects.filter(obj => {
      // 类型过滤
      if (filterType === 'system' && !obj.isSystem) return false;
      if (filterType === 'custom' && obj.isSystem) return false;
      
      // 搜索过滤
      if (searchText) {
        const search = searchText.toLowerCase();
        return (
          obj.name.toLowerCase().includes(search) ||
          obj.singularName.toLowerCase().includes(search) ||
          obj.pluralName.toLowerCase().includes(search) ||
          obj.description?.toLowerCase().includes(search)
        );
      }
      return true;
    });
  }, [objects, filterType, searchText]);

  // 系统对象 vs 自定义对象分组
  const groupedObjects = useMemo(() => {
    const system = filteredObjects.filter(o => o.isSystem);
    const custom = filteredObjects.filter(o => !o.isSystem);
    return { system, custom };
  }, [filteredObjects]);

  // 删除对象
  const handleDelete = (obj: CustomObject) => {
    if (obj.isSystem) {
      message.error('Cannot delete system object');
      return;
    }
    
    Modal.confirm({
      title: t('customObjects.deleteConfirmTitle', 'Delete Custom Object'),
      content: t(
        'customObjects.deleteConfirmContent',
        'Are you sure you want to delete "{{name}}"? This action cannot be undone.',
        { name: obj.pluralName }
      ),
      okText: t('common.delete', 'Delete'),
      okButtonProps: { danger: true },
      cancelText: t('common.cancel', 'Cancel'),
      onOk: () => {
        try {
          deleteObject(obj.id);
          message.success(t('customObjects.deleteSuccess', 'Object deleted successfully'));
        } catch (error: any) {
          message.error(error.message || t('customObjects.deleteError', 'Failed to delete object'));
        }
      },
    });
  };

  // 渲染对象卡片
  const renderObjectCard = (obj: CustomObject) => {
    const propertyCount = properties[obj.id]?.length || 0;
    const menuItems: any[] = [
      {
        key: 'fields',
        icon: <SettingOutlined />,
        label: t('customObjects.manageFields', 'Manage Fields'),
        onClick: () => navigate(`/settings/custom-objects/${obj.id}/fields`),
      },
      {
        key: 'form',
        icon: <FormOutlined />,
        label: t('customObjects.formDesigner', 'Form Designer'),
        onClick: () => navigate(`/settings/custom-objects/${obj.id}/form`),
      },
      {
        key: 'relationships',
        icon: <ApartmentOutlined />,
        label: t('customObjects.relationships', 'Relationships'),
        onClick: () => navigate(`/settings/custom-objects/${obj.id}/relationships`),
      },
      {
        key: 'data',
        icon: <DatabaseOutlined />,
        label: t('customObjects.manageData', 'Manage Data'),
        onClick: () => navigate(`/settings/custom-objects/${obj.id}/data`),
      },
    ];

    if (!obj.isSystem) {
      menuItems.push({ type: 'divider' });
      menuItems.push({
        key: 'edit',
        icon: <EditOutlined />,
        label: t('common.edit', 'Edit'),
        onClick: () => navigate(`/settings/custom-objects/${obj.id}/edit`),
      });
      menuItems.push({
        key: 'delete',
        icon: <DeleteOutlined />,
        label: t('common.delete', 'Delete'),
        danger: true,
        onClick: () => handleDelete(obj),
      });
    }

    return (
      <Col key={obj.id} xs={24} sm={12} lg={8} xl={6}>
        <Card
          className={styles.objectCard}
          hoverable
          onClick={() => navigate(`/settings/custom-objects/${obj.id}/fields`)}
        >
          <div className={styles.cardHeader}>
            <div
              className={styles.iconWrapper}
              style={{ backgroundColor: `${obj.iconColor}15`, color: obj.iconColor }}
            >
              {getIconComponent(obj.icon)}
            </div>
            <Dropdown menu={{ items: menuItems }} trigger={['click']}>
              <Button
                type="text"
                icon={<MoreOutlined />}
                onClick={(e) => e.stopPropagation()}
              />
            </Dropdown>
          </div>
          
          <div className={styles.cardContent}>
            <Title level={5} className={styles.objectName}>
              {obj.pluralName}
              {obj.isSystem && (
                <Tooltip title={t('customObjects.systemObject', 'System Object')}>
                  <LockOutlined className={styles.systemIcon} />
                </Tooltip>
              )}
            </Title>
            <Text type="secondary" className={styles.objectDescription}>
              {obj.description || t('customObjects.noDescription', 'No description')}
            </Text>
          </div>
          
          <div className={styles.cardFooter}>
            <Space>
              <Tag color="blue">{propertyCount} {t('customObjects.fields', 'fields')}</Tag>
            </Space>
            <Text type="secondary" className={styles.date}>
              {formatDate(obj.createdAt)}
            </Text>
          </div>
        </Card>
      </Col>
    );
  };

  return (
    <div className={styles.container}>
      {/* 页面标题 */}
      <div className={styles.header}>
        <Title level={3} className={styles.title}>
          {t('customObjects.title', 'Custom Objects')}
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/settings/custom-objects/create')}
        >
          {t('customObjects.create', 'Create Custom Object')}
        </Button>
      </div>

      {/* 工具栏 */}
      <div className={styles.toolbar}>
        <Space>
          <Input
            placeholder={t('customObjects.searchPlaceholder', 'Search objects...')}
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{ width: 280 }}
          />
          <Space.Compact>
            <Button
              type={filterType === 'all' ? 'primary' : 'default'}
              onClick={() => setFilterType('all')}
            >
              {t('customObjects.allObjects', 'All')}
            </Button>
            <Button
              type={filterType === 'system' ? 'primary' : 'default'}
              onClick={() => setFilterType('system')}
            >
              <LockOutlined /> {t('customObjects.systemObjects', 'System')}
            </Button>
            <Button
              type={filterType === 'custom' ? 'primary' : 'default'}
              onClick={() => setFilterType('custom')}
            >
              <UnlockOutlined /> {t('customObjects.customObjects', 'Custom')}
            </Button>
          </Space.Compact>
        </Space>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <Spin size="large" />
        </div>
      ) : filteredObjects.length === 0 ? (
        <Empty
          description={t('customObjects.noObjects', 'No custom objects found')}
          className={styles.empty}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/settings/custom-objects/create')}
          >
            {t('customObjects.create', 'Create Custom Object')}
          </Button>
        </Empty>
      ) : (
        <div className={styles.content}>
          {/* 系统对象 */}
          {(filterType === 'all' || filterType === 'system') && groupedObjects.system.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <LockOutlined className={styles.sectionIcon} />
                <Title level={4} className={styles.sectionTitle}>
                  {t('customObjects.systemObjects', 'System Objects')}
                </Title>
                <Text type="secondary">
                  {t('customObjects.systemObjectsDesc', 'Built-in objects that can be extended with custom fields')}
                </Text>
              </div>
              <Row gutter={[16, 16]}>
                {groupedObjects.system.map(renderObjectCard)}
              </Row>
            </div>
          )}

          {/* 自定义对象 */}
          {(filterType === 'all' || filterType === 'custom') && groupedObjects.custom.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <UnlockOutlined className={styles.sectionIcon} />
                <Title level={4} className={styles.sectionTitle}>
                  {t('customObjects.customObjects', 'Custom Objects')}
                </Title>
                <Text type="secondary">
                  {t('customObjects.customObjectsDesc', 'User-defined objects for specific business needs')}
                </Text>
              </div>
              <Row gutter={[16, 16]}>
                {groupedObjects.custom.map(renderObjectCard)}
              </Row>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomObjects;