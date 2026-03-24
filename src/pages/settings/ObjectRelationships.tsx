/**
 * 对象关系管理页面
 */
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  message,
  Typography,
  Tooltip,
  Empty,
  Switch,
  Divider,
} from 'antd';
import {
  ArrowLeftOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DatabaseOutlined,
  SettingOutlined,
  ApartmentOutlined,
  FormOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { useCustomObjectsStore } from '../../store/customObjects';
import { ObjectRelation, RelationType, CascadeDeleteType, DisplayType } from '../../types/customObject';
import styles from './CustomObjects.module.css';

const { Title, Text } = Typography;

// 关系类型标签
const RELATION_TYPE_LABELS: Record<RelationType, string> = {
  one_to_many: 'One-to-Many',
  many_to_one: 'Many-to-One',
  many_to_many: 'Many-to-Many',
  self: 'Self-Reference',
};

// 级联删除类型标签
const CASCADE_DELETE_LABELS: Record<CascadeDeleteType, string> = {
  none: 'No Action',
  cascade: 'Cascade Delete',
  clear: 'Clear Relation',
  restricted: 'Restrict Delete',
};

// 显示类型标签
const DISPLAY_TYPE_LABELS: Record<DisplayType, string> = {
  card: 'Card List',
  list: 'Simple List',
  count: 'Count Only',
};

const ObjectRelationships: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { objectId } = useParams();
  
  const {
    getObjectById,
    getRelationships,
    createRelationship,
    updateRelationship,
    deleteRelationship,
    objects,
  } = useCustomObjectsStore();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRelation, setEditingRelation] = useState<ObjectRelation | null>(null);
  const [form] = Form.useForm();
  
  // 获取对象定义
  const objectDef = objectId ? getObjectById(objectId) : undefined;
  const relationships = objectId ? getRelationships(objectId) : [];
  
  // 打开新建/编辑弹窗
  const handleOpenModal = (relation?: ObjectRelation) => {
    if (relation) {
      setEditingRelation(relation);
      form.setFieldsValue(relation);
    } else {
      setEditingRelation(null);
      form.resetFields();
      form.setFieldsValue({
        type: 'one_to_many',
        sourceDisplay: true,
        targetDisplay: true,
        sourceDisplayType: 'card',
        targetDisplayType: 'card',
        deleteCascade: 'clear',
        enabled: true,
      });
    }
    setModalVisible(true);
  };
  
  // 保存关系
  const handleSaveRelation = async (values: any) => {
    try {
      const relationData = {
        name: values.name.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
        sourceObjectId: objectId!,
        targetObjectId: values.targetObjectId,
        type: values.type,
        sourceLabel: values.sourceLabel,
        targetLabel: values.targetLabel,
        sourceDisplay: values.sourceDisplay ?? true,
        targetDisplay: values.targetDisplay ?? true,
        sourceDisplayType: values.sourceDisplayType || 'card',
        targetDisplayType: values.targetDisplayType || 'card',
        deleteCascade: values.deleteCascade || 'none',
        enabled: values.enabled ?? true,
        createdBy: 'current_user',
      };
      
      if (editingRelation) {
        updateRelationship(objectId!, editingRelation.id, relationData);
        message.success(t('customObjects.relationUpdateSuccess', 'Relationship updated'));
      } else {
        createRelationship(objectId!, relationData);
        message.success(t('customObjects.relationCreateSuccess', 'Relationship created'));
      }
      
      setModalVisible(false);
      form.resetFields();
    } catch (error: any) {
      message.error(error.message || t('customObjects.relationSaveError', 'Failed to save relationship'));
    }
  };
  
  // 删除关系
  const handleDeleteRelation = (relationId: string) => {
    Modal.confirm({
      title: t('customObjects.deleteRelationTitle', 'Delete Relationship'),
      content: t('customObjects.deleteRelationContent', 'Are you sure you want to delete this relationship?'),
      okText: t('common.delete', 'Delete'),
      okButtonProps: { danger: true },
      onOk: () => {
        deleteRelationship(objectId!, relationId);
        message.success(t('customObjects.relationDeleteSuccess', 'Relationship deleted'));
      },
    });
  };
  
  // 表格列定义
  const columns = [
    {
      title: t('customObjects.relationName', 'Relation Name'),
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: t('customObjects.targetObject', 'Target Object'),
      dataIndex: 'targetObjectId',
      key: 'targetObjectId',
      width: 150,
      render: (targetId: string) => {
        const targetObj = objects.find((o) => o.id === targetId);
        return targetObj ? (
          <Tag color="purple">{targetObj.pluralName}</Tag>
        ) : (
          <Text type="secondary">Unknown</Text>
        );
      },
    },
    {
      title: t('customObjects.relationType', 'Type'),
      dataIndex: 'type',
      key: 'type',
      width: 130,
      render: (type: RelationType) => (
        <Tag color="blue">{RELATION_TYPE_LABELS[type]}</Tag>
      ),
    },
    {
      title: t('customObjects.sourceLabel', 'Source Label'),
      dataIndex: 'sourceLabel',
      key: 'sourceLabel',
      width: 150,
    },
    {
      title: t('customObjects.targetLabel', 'Target Label'),
      dataIndex: 'targetLabel',
      key: 'targetLabel',
      width: 150,
    },
    {
      title: t('customObjects.displayOnDetail', 'Display on Detail'),
      key: 'display',
      width: 150,
      render: (_: any, record: ObjectRelation) => (
        <Space>
          {record.sourceDisplay && <Tag>Source</Tag>}
          {record.targetDisplay && <Tag>Target</Tag>}
        </Space>
      ),
    },
    {
      title: t('customObjects.cascadeDelete', 'Cascade Delete'),
      dataIndex: 'deleteCascade',
      key: 'deleteCascade',
      width: 130,
      render: (cascade: CascadeDeleteType) => (
        <Tag color={cascade === 'cascade' ? 'red' : cascade === 'restricted' ? 'orange' : 'default'}>
          {CASCADE_DELETE_LABELS[cascade]}
        </Tag>
      ),
    },
    {
      title: t('common.actions', 'Actions'),
      key: 'actions',
      width: 120,
      fixed: 'right' as const,
      render: (_: any, record: ObjectRelation) => (
        <Space>
          <Tooltip title={t('common.edit', 'Edit')}>
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleOpenModal(record)}
            />
          </Tooltip>
          <Tooltip title={t('common.delete', 'Delete')}>
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteRelation(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];
  
  if (!objectDef) {
    return (
      <div className={styles.container}>
        <Empty description={t('customObjects.objectNotFound', 'Object not found')} />
      </div>
    );
  }
  
  return (
    <div className={styles.container} style={{ padding: 0 }}>
      {/* 说明 */}
      <Card className={styles.infoCard} style={{ marginBottom: 16 }}>
        <Space>
          <InfoCircleOutlined style={{ color: '#2359A2' }} />
          <Text>
            {t(
              'customObjects.relationshipsDesc',
              'Define how this object relates to other objects. Relationships enable you to link records and display related data.'
            )}
          </Text>
        </Space>
      </Card>
      
      {/* 关系列表 */}
      <Card
        className={styles.listCard}
        title={t('customObjects.relationships', 'Relationships')}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
            {t('customObjects.addRelation', 'Add Relationship')}
          </Button>
        }
      >
        {relationships.length === 0 ? (
          <Empty
            description={t('customObjects.noRelations', 'No relationships defined. Add relationships to link records.')}
            className={styles.empty}
          >
            <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
              {t('customObjects.addRelation', 'Add Relationship')}
            </Button>
          </Empty>
        ) : (
          <Table
            dataSource={relationships}
            columns={columns}
            rowKey="id"
            scroll={{ x: 1100 }}
            pagination={false}
          />
        )}
      </Card>
      
      {/* 关系编辑弹窗 */}
      <Modal
        title={editingRelation ? t('customObjects.editRelation', 'Edit Relationship') : t('customObjects.addRelation', 'Add Relationship')}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={700}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSaveRelation}>
          <Form.Item
            name="name"
            label={t('customObjects.relationName', 'Relation Name (API)')}
            rules={[{ required: true, message: t('customObjects.nameRequired', 'Please enter relation name') }]}
            extra={t('customObjects.relationNameHint', 'Used for API, lowercase letters, numbers and underscores')}
          >
            <Input placeholder="e.g., customer_orders, project_tasks" />
          </Form.Item>
          
          <Form.Item
            name="targetObjectId"
            label={t('customObjects.targetObject', 'Target Object')}
            rules={[{ required: true, message: t('customObjects.targetObjectRequired', 'Please select target object') }]}
          >
            <Select
              placeholder={t('customObjects.selectTargetObject', 'Select target object')}
              showSearch
              optionFilterProp="label"
              disabled={!!editingRelation}
            >
              {objects
                .filter((o) => o.id !== objectId)
                .map((obj) => (
                  <Select.Option key={obj.id} value={obj.id} label={obj.pluralName}>
                    {obj.pluralName}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="type"
            label={t('customObjects.relationType', 'Relation Type')}
            rules={[{ required: true }]}
          >
            <Select disabled={!!editingRelation}>
              {Object.entries(RELATION_TYPE_LABELS).map(([value, label]) => (
                <Select.Option key={value} value={value}>
                  {label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          
          <Divider>{t('customObjects.labels', 'Labels')}</Divider>
          
          <Form.Item
            name="sourceLabel"
            label={t('customObjects.sourceLabel', 'Label in Source Object')}
            rules={[{ required: true }]}
            extra={t('customObjects.sourceLabelHint', 'How this relation is displayed in the source object')}
          >
            <Input placeholder="e.g., Related Orders" />
          </Form.Item>
          
          <Form.Item
            name="targetLabel"
            label={t('customObjects.targetLabel', 'Label in Target Object')}
            rules={[{ required: true }]}
            extra={t('customObjects.targetLabelHint', 'How this relation is displayed in the target object')}
          >
            <Input placeholder="e.g., Related Customer" />
          </Form.Item>
          
          <Divider>{t('customObjects.displaySettings', 'Display Settings')}</Divider>
          
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="sourceDisplay" valuePropName="checked" label={t('customObjects.showInSource', 'Show in Source')}>
              <Switch />
            </Form.Item>
            <Form.Item name="sourceDisplayType" label={t('customObjects.displayType', 'Display Type')}>
              <Select style={{ width: 150 }}>
                {Object.entries(DISPLAY_TYPE_LABELS).map(([value, label]) => (
                  <Select.Option key={value} value={value}>
                    {label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Space>
          
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="targetDisplay" valuePropName="checked" label={t('customObjects.showInTarget', 'Show in Target')}>
              <Switch />
            </Form.Item>
            <Form.Item name="targetDisplayType" label={t('customObjects.displayType', 'Display Type')}>
              <Select style={{ width: 150 }}>
                {Object.entries(DISPLAY_TYPE_LABELS).map(([value, label]) => (
                  <Select.Option key={value} value={value}>
                    {label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Space>
          
          <Divider>{t('customObjects.advancedSettings', 'Advanced Settings')}</Divider>
          
          <Form.Item
            name="deleteCascade"
            label={t('customObjects.cascadeDelete', 'On Delete Behavior')}
            extra={t('customObjects.cascadeDeleteHint', 'What happens when a record is deleted')}
          >
            <Select>
              {Object.entries(CASCADE_DELETE_LABELS).map(([value, label]) => (
                <Select.Option key={value} value={value}>
                  {label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ObjectRelationships;