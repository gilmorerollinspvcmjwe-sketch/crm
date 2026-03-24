/**
 * 对象属性管理页面
 */
import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
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
  Switch,
  message,
  Typography,
  Tooltip,
  Tabs,
  Checkbox,
  ColorPicker,
  Empty,
  Divider,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  HolderOutlined,
  StarOutlined,
  StarFilled,
} from '@ant-design/icons';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useCustomObjectsStore } from '../../store/customObjects';
import { ObjectProperty, PropertyType } from '../../types/customObject';
import { PROPERTY_TYPE_LABELS } from '../../mock/customObjectsData';
import styles from './CustomObjects.module.css';

const { Title, Text } = Typography;
const { TextArea } = Input;

// 可拖拽行组件
interface SortableRowProps {
  property: ObjectProperty;
  onEdit: (property: ObjectProperty) => void;
  onDelete: (id: string) => void;
  onTogglePrimary: (property: ObjectProperty) => void;
  onToggleSecondary: (property: ObjectProperty) => void;
}

const SortableRow: React.FC<SortableRowProps & { children: React.ReactNode }> = ({
  property,
  onEdit,
  onDelete,
  onTogglePrimary,
  onToggleSecondary,
  children,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: property.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr ref={setNodeRef} style={style}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            ...attributes,
            ...listeners,
          });
        }
        return child;
      })}
    </tr>
  );
};

// 属性类型分组
const PROPERTY_TYPE_GROUPS = [
  {
    label: 'Text',
    types: [PropertyType.TEXT, PropertyType.TEXTAREA, PropertyType.RICHTEXT],
  },
  {
    label: 'Number',
    types: [PropertyType.NUMBER, PropertyType.DECIMAL, PropertyType.CURRENCY, PropertyType.PERCENT],
  },
  {
    label: 'Date & Time',
    types: [PropertyType.DATE, PropertyType.DATETIME, PropertyType.TIME],
  },
  {
    label: 'Selection',
    types: [PropertyType.SELECT, PropertyType.MULTISELECT, PropertyType.RADIO, PropertyType.CHECKBOX, PropertyType.SWITCH],
  },
  {
    label: 'Contact',
    types: [PropertyType.PHONE, PropertyType.EMAIL, PropertyType.URL],
  },
  {
    label: 'Reference',
    types: [PropertyType.USER, PropertyType.DEPARTMENT, PropertyType.RELATION],
  },
  {
    label: 'Media',
    types: [PropertyType.FILE, PropertyType.IMAGE, PropertyType.VIDEO],
  },
  {
    label: 'Other',
    types: [PropertyType.ADDRESS, PropertyType.RATING, PropertyType.FORMULA],
  },
];

const ObjectFields: React.FC = () => {
  const { t } = useTranslation();
  const { objectId } = useParams();
  
  const {
    getObjectById,
    getProperties,
    createProperty,
    updateProperty,
    deleteProperty,
    reorderProperties,
  } = useCustomObjectsStore();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProperty, setEditingProperty] = useState<ObjectProperty | null>(null);
  const [form] = Form.useForm();
  const [selectedType, setSelectedType] = useState<PropertyType>(PropertyType.TEXT);
  const [options, setOptions] = useState<{ value: string; label: string; color?: string }[]>([]);
  
  // 获取对象定义
  const objectDef = objectId ? getObjectById(objectId) : undefined;
  const properties = objectId ? getProperties(objectId) : [];
  
  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  // 拖拽排序结束
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = properties.findIndex((p) => p.id === active.id);
      const newIndex = properties.findIndex((p) => p.id === over.id);
      const newOrder = arrayMove(properties, oldIndex, newIndex);
      reorderProperties(
        objectId!,
        newOrder.map((p) => p.id)
      );
    }
  };
  
  // 打开新建/编辑弹窗
  const handleOpenModal = (property?: ObjectProperty) => {
    if (property) {
      setEditingProperty(property);
      setSelectedType(property.internalType);
      form.setFieldsValue({
        name: property.name,
        label: property.label,
        description: property.description,
        placeholder: property.placeholder,
        required: property.required,
        listVisible: property.listVisible,
        detailVisible: property.detailVisible,
        searchable: property.searchable,
        sortable: property.sortable,
        bulkEditable: property.bulkEditable,
      });
      if (property.options) {
        setOptions(property.options.map((o) => ({ value: o.value, label: o.label, color: o.color })));
      } else {
        setOptions([]);
      }
    } else {
      setEditingProperty(null);
      setSelectedType(PropertyType.TEXT);
      form.resetFields();
      form.setFieldsValue({
        required: false,
        listVisible: true,
        detailVisible: true,
        searchable: true,
        sortable: true,
        bulkEditable: true,
      });
      setOptions([]);
    }
    setModalVisible(true);
  };
  
  // 保存属性
  const handleSaveProperty = async (values: any) => {
    try {
      const propertyData = {
        name: values.name.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
        label: values.label,
        internalType: selectedType,
        isPrimary: false,
        isSecondary: false,
        description: values.description,
        placeholder: values.placeholder,
        required: values.required || false,
        listVisible: values.listVisible ?? true,
        detailVisible: values.detailVisible ?? true,
        searchable: values.searchable ?? true,
        sortable: values.sortable ?? true,
        bulkEditable: values.bulkEditable ?? true,
        options: [PropertyType.SELECT, PropertyType.MULTISELECT, PropertyType.RADIO].includes(selectedType)
          ? options.map((o, i) => ({ ...o, sortOrder: i, enabled: true }))
          : undefined,
        targetObjectId: selectedType === PropertyType.RELATION ? values.targetObjectId : undefined,
        multiple: selectedType === PropertyType.RELATION ? values.multiple : undefined,
        sortOrder: editingProperty ? editingProperty.sortOrder : properties.length,
        enabled: true,
        createdBy: 'current_user',
      };
      
      if (editingProperty) {
        updateProperty(objectId!, editingProperty.id, propertyData);
        message.success(t('customObjects.propertyUpdateSuccess', 'Property updated'));
      } else {
        createProperty(objectId!, propertyData);
        message.success(t('customObjects.propertyCreateSuccess', 'Property created'));
      }
      
      setModalVisible(false);
      form.resetFields();
    } catch (error: any) {
      message.error(error.message || t('customObjects.propertySaveError', 'Failed to save property'));
    }
  };
  
  // 删除属性
  const handleDeleteProperty = (propertyId: string) => {
    Modal.confirm({
      title: t('customObjects.deletePropertyTitle', 'Delete Property'),
      content: t('customObjects.deletePropertyContent', 'Are you sure you want to delete this property? This action cannot be undone.'),
      okText: t('common.delete', 'Delete'),
      okButtonProps: { danger: true },
      onOk: () => {
        deleteProperty(objectId!, propertyId);
        message.success(t('customObjects.propertyDeleteSuccess', 'Property deleted'));
      },
    });
  };
  
  // 切换主属性
  const handleTogglePrimary = (property: ObjectProperty) => {
    // 先取消其他属性的主属性
    properties.forEach((p) => {
      if (p.isPrimary && p.id !== property.id) {
        updateProperty(objectId!, p.id, { isPrimary: false });
      }
    });
    updateProperty(objectId!, property.id, { isPrimary: !property.isPrimary });
    message.success(t('customObjects.primaryUpdated', 'Primary property updated'));
  };
  
  // 切换次要属性
  const handleToggleSecondary = (property: ObjectProperty) => {
    updateProperty(objectId!, property.id, { isSecondary: !property.isSecondary });
    message.success(t('customObjects.secondaryUpdated', 'Secondary property updated'));
  };
  
  // 添加选项
  const handleAddOption = () => {
    setOptions([...options, { value: `option_${options.length + 1}`, label: `Option ${options.length + 1}`, color: '#2359A2' }]);
  };
  
  // 更新选项
  const handleUpdateOption = (index: number, field: string, value: any) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setOptions(newOptions);
  };
  
  // 删除选项
  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };
  
  // 表格列定义
  const columns = [
    {
      key: 'drag',
      width: 40,
      render: () => <HolderOutlined style={{ cursor: 'grab', color: '#919EAB' }} />,
    },
    {
      title: t('customObjects.propertyName', 'Property Name'),
      dataIndex: 'name',
      key: 'name',
      width: 180,
      render: (name: string, record: ObjectProperty) => (
        <Space>
          <Text strong>{name}</Text>
          {record.isPrimary && (
            <Tooltip title={t('customObjects.primaryProperty', 'Primary Property')}>
              <StarFilled style={{ color: '#ED6C02' }} />
            </Tooltip>
          )}
          {record.isSecondary && !record.isPrimary && (
            <Tooltip title={t('customObjects.secondaryProperty', 'Secondary Property')}>
              <StarOutlined style={{ color: '#637381' }} />
            </Tooltip>
          )}
        </Space>
      ),
    },
    {
      title: t('customObjects.label', 'Label'),
      dataIndex: 'label',
      key: 'label',
      width: 150,
    },
    {
      title: t('customObjects.type', 'Type'),
      dataIndex: 'internalType',
      key: 'internalType',
      width: 140,
      render: (type: PropertyType) => (
        <Tag color="blue">{PROPERTY_TYPE_LABELS[type]}</Tag>
      ),
    },
    {
      title: t('customObjects.required', 'Required'),
      dataIndex: 'required',
      key: 'required',
      width: 80,
      render: (required: boolean) => (
        <Tag color={required ? 'red' : 'default'}>{required ? 'Yes' : 'No'}</Tag>
      ),
    },
    {
      title: t('customObjects.visibility', 'Visibility'),
      key: 'visibility',
      width: 150,
      render: (_: any, record: ObjectProperty) => (
        <Space size="small">
          {record.listVisible && <Tag>List</Tag>}
          {record.detailVisible && <Tag>Detail</Tag>}
        </Space>
      ),
    },
    {
      title: t('common.actions', 'Actions'),
      key: 'actions',
      width: 120,
      render: (_: any, record: ObjectProperty) => (
        <Space>
          <Tooltip title={t('customObjects.setPrimary', 'Set as Primary')}>
            <Button
              type="text"
              size="small"
              icon={record.isPrimary ? <StarFilled style={{ color: '#ED6C02' }} /> : <StarOutlined />}
              onClick={() => handleTogglePrimary(record)}
            />
          </Tooltip>
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
              onClick={() => handleDeleteProperty(record.id)}
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
      {/* 对象信息 */}
      <Card className={styles.infoCard} style={{ marginBottom: 16 }}>
        <Space split={<Divider type="vertical" />}>
          <Space>
            <Text type="secondary">{t('customObjects.objectName', 'Object Name')}:</Text>
            <Text strong>{objectDef.name}</Text>
          </Space>
          <Space>
            <Text type="secondary">{t('customObjects.totalFields', 'Total Fields')}:</Text>
            <Text strong>{properties.length}</Text>
          </Space>
          <Space>
            <Text type="secondary">{t('customObjects.primaryProperty', 'Primary Property')}:</Text>
            <Text strong>
              {properties.find((p) => p.isPrimary)?.label || t('customObjects.notSet', 'Not set')}
            </Text>
          </Space>
        </Space>
      </Card>
      
      {/* 字段列表 */}
      <Card
        className={styles.listCard}
        title={t('customObjects.properties', 'Properties')}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
            {t('customObjects.addProperty', 'Add Property')}
          </Button>
        }
      >
        {properties.length === 0 ? (
          <Empty
            description={t('customObjects.noProperties', 'No properties yet. Add your first property to get started.')}
            className={styles.empty}
          >
            <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
              {t('customObjects.addProperty', 'Add Property')}
            </Button>
          </Empty>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={properties.map((p) => p.id)}
              strategy={verticalListSortingStrategy}
            >
              <Table
                dataSource={properties}
                columns={columns}
                rowKey="id"
                pagination={false}
                components={{
                  body: {
                    row: ({ children, ...props }: any) => {
                      const property = properties.find((p) => p.id === props['data-row-key']);
                      if (!property) return <tr {...props}>{children}</tr>;
                      return (
                        <SortableRow
                          property={property}
                          onEdit={handleOpenModal}
                          onDelete={handleDeleteProperty}
                          onTogglePrimary={handleTogglePrimary}
                          onToggleSecondary={handleToggleSecondary}
                        >
                          {children}
                        </SortableRow>
                      );
                    },
                  },
                }}
              />
            </SortableContext>
          </DndContext>
        )}
      </Card>
      
      {/* 属性编辑弹窗 */}
      <Modal
        title={editingProperty ? t('customObjects.editProperty', 'Edit Property') : t('customObjects.addProperty', 'Add Property')}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={720}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSaveProperty}>
          <Tabs defaultActiveKey="basic">
            <Tabs.TabPane tab={t('customObjects.basicTab', 'Basic')} key="basic">
              <Form.Item
                name="name"
                label={t('customObjects.propertyName', 'Property Name (API)')}
                rules={[
                  { required: true, message: t('customObjects.nameRequired', 'Please enter property name') },
                  { pattern: /^[a-z][a-z0-9_]*$/, message: t('customObjects.namePattern', 'Must start with letter, lowercase letters, numbers and underscores only') },
                ]}
                extra={t('customObjects.propertyNameHint', 'Used for API, cannot be changed after creation')}
              >
                <Input placeholder="e.g., product_name, order_date" disabled={!!editingProperty} />
              </Form.Item>
              
              <Form.Item
                name="label"
                label={t('customObjects.label', 'Display Label')}
                rules={[{ required: true, message: t('customObjects.labelRequired', 'Please enter display label') }]}
              >
                <Input placeholder="e.g., Product Name, Order Date" />
              </Form.Item>
              
              <Form.Item
                label={t('customObjects.fieldType', 'Field Type')}
                rules={[{ required: true }]}
              >
                <Select
                  value={selectedType}
                  onChange={(value) => setSelectedType(value)}
                  disabled={!!editingProperty}
                >
                  {PROPERTY_TYPE_GROUPS.map((group) => (
                    <Select.OptGroup key={group.label} label={group.label}>
                      {group.types.map((type) => (
                        <Select.Option key={type} value={type}>
                          {PROPERTY_TYPE_LABELS[type]}
                        </Select.Option>
                      ))}
                    </Select.OptGroup>
                  ))}
                </Select>
              </Form.Item>
              
              <Form.Item name="description" label={t('customObjects.description', 'Description')}>
                <TextArea rows={2} placeholder={t('customObjects.descriptionPlaceholder', 'Help text for this field...')} />
              </Form.Item>
              
              <Form.Item name="placeholder" label={t('customObjects.placeholder', 'Placeholder')}>
                <Input placeholder={t('customObjects.placeholderExample', 'Enter placeholder text...')} />
              </Form.Item>
            </Tabs.TabPane>
            
            <Tabs.TabPane tab={t('customObjects.validationTab', 'Validation')} key="validation">
              <Form.Item name="required" valuePropName="checked" label={t('customObjects.required', 'Required')}>
                <Switch checkedChildren="Yes" unCheckedChildren="No" />
              </Form.Item>
            </Tabs.TabPane>
            
            <Tabs.TabPane tab={t('customObjects.displayTab', 'Display')} key="display">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Form.Item name="listVisible" valuePropName="checked">
                  <Checkbox>{t('customObjects.showInList', 'Show in list view')}</Checkbox>
                </Form.Item>
                <Form.Item name="detailVisible" valuePropName="checked">
                  <Checkbox>{t('customObjects.showInDetail', 'Show in detail view')}</Checkbox>
                </Form.Item>
                <Form.Item name="searchable" valuePropName="checked">
                  <Checkbox>{t('customObjects.searchable', 'Searchable')}</Checkbox>
                </Form.Item>
                <Form.Item name="sortable" valuePropName="checked">
                  <Checkbox>{t('customObjects.sortable', 'Sortable')}</Checkbox>
                </Form.Item>
                <Form.Item name="bulkEditable" valuePropName="checked">
                  <Checkbox>{t('customObjects.bulkEditable', 'Bulk editable')}</Checkbox>
                </Form.Item>
              </Space>
            </Tabs.TabPane>
          </Tabs>
          
          {/* 选项配置（下拉/多选） */}
          {[PropertyType.SELECT, PropertyType.MULTISELECT, PropertyType.RADIO].includes(selectedType) && (
            <div style={{ marginTop: 16 }}>
              <Divider>{t('customObjects.options', 'Options')}</Divider>
              <div style={{ marginBottom: 8 }}>
                {options.map((option, index) => (
                  <div key={index} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                    <ColorPicker
                      value={option.color}
                      onChange={(color) => handleUpdateOption(index, 'color', color.toHexString())}
                      size="small"
                    />
                    <Input
                      value={option.value}
                      onChange={(e) => handleUpdateOption(index, 'value', e.target.value)}
                      placeholder="Value"
                      style={{ width: 120 }}
                    />
                    <Input
                      value={option.label}
                      onChange={(e) => handleUpdateOption(index, 'label', e.target.value)}
                      placeholder="Label"
                      style={{ flex: 1 }}
                    />
                    <Button
                      type="text"
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemoveOption(index)}
                    />
                  </div>
                ))}
              </div>
              <Button type="dashed" icon={<PlusOutlined />} onClick={handleAddOption} block>
                {t('customObjects.addOption', 'Add Option')}
              </Button>
            </div>
          )}
          
          {/* 关联字段配置 */}
          {selectedType === PropertyType.RELATION && (
            <div style={{ marginTop: 16 }}>
              <Divider>{t('customObjects.relationConfig', 'Relation Configuration')}</Divider>
              <Form.Item
                name="targetObjectId"
                label={t('customObjects.targetObject', 'Target Object')}
                rules={[{ required: true, message: t('customObjects.targetObjectRequired', 'Please select target object') }]}
              >
                <Select placeholder={t('customObjects.selectTargetObject', 'Select target object')}>
                  {useCustomObjectsStore.getState().objects.map((obj) => (
                    <Select.Option key={obj.id} value={obj.id}>
                      {obj.pluralName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="multiple" valuePropName="checked" label={t('customObjects.multipleValues', 'Allow Multiple Values')}>
                <Switch checkedChildren="Yes" unCheckedChildren="No" />
              </Form.Item>
            </div>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default ObjectFields;