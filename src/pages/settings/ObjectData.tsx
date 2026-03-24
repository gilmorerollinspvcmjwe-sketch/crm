/**
 * 对象数据管理页面
 */
import React, { useState, useMemo } from 'react';
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
  DatePicker,
  InputNumber,
  message,
  Typography,
  Dropdown,
  Tooltip,
  Drawer,
  Descriptions,
  Empty,
  Switch,
  Rate,
  Popconfirm,
} from 'antd';
import {
  ArrowLeftOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ExportOutlined,
  DatabaseOutlined,
  SettingOutlined,
  ApartmentOutlined,
  FormOutlined,
  MoreOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useCustomObjectsStore } from '../../store/customObjects';
import { ObjectProperty, ObjectRecord, PropertyType } from '../../types/customObject';
import { PROPERTY_TYPE_LABELS } from '../../mock/customObjectsData';
import styles from './CustomObjects.module.css';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// 动态渲染表单字段
interface DynamicFieldProps {
  property: ObjectProperty;
  value?: any;
  onChange?: (value: any) => void;
  mode?: 'edit' | 'view';
}

const DynamicField: React.FC<DynamicFieldProps> = ({ property, value, onChange, mode = 'edit' }) => {
  const { t } = useTranslation();
  const { objects } = useCustomObjectsStore();
  
  // 查看模式
  if (mode === 'view') {
    if (value === null || value === undefined || value === '') {
      return <Text type="secondary">-</Text>;
    }
    
    switch (property.internalType) {
      case PropertyType.SELECT:
      case PropertyType.RADIO:
        const option = property.options?.find((o) => o.value === value);
        return <Tag color={option?.color}>{option?.label || value}</Tag>;
      case PropertyType.MULTISELECT:
        const selectedOptions = property.options?.filter((o) => value?.includes(o.value));
        return (
          <Space size={[0, 4]} wrap>
            {selectedOptions?.map((o) => (
              <Tag key={o.value} color={o.color}>
                {o.label}
              </Tag>
            ))}
          </Space>
        );
      case PropertyType.SWITCH:
      case PropertyType.CHECKBOX:
        return <Tag color={value ? 'green' : 'default'}>{value ? 'Yes' : 'No'}</Tag>;
      case PropertyType.CURRENCY:
        return <Text>¥{Number(value).toLocaleString()}</Text>;
      case PropertyType.PERCENT:
        return <Text>{value}%</Text>;
      case PropertyType.RATING:
        return <Rate disabled value={value} />;
      case PropertyType.DATE:
        return <Text>{dayjs(value).format('YYYY-MM-DD')}</Text>;
      case PropertyType.DATETIME:
        return <Text>{dayjs(value).format('YYYY-MM-DD HH:mm')}</Text>;
      case PropertyType.RELATION:
        const targetObj = objects.find((o) => o.id === property.targetObjectId);
        return <Tag color="purple">{targetObj?.singularName}: {value}</Tag>;
      default:
        return <Text>{value}</Text>;
    }
  }
  
  // 编辑模式
  switch (property.internalType) {
    case PropertyType.TEXT:
    case PropertyType.PHONE:
    case PropertyType.EMAIL:
    case PropertyType.URL:
      return (
        <Input
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={property.placeholder}
        />
      );
    case PropertyType.TEXTAREA:
      return (
        <Input.TextArea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={property.placeholder}
          rows={3}
        />
      );
    case PropertyType.NUMBER:
    case PropertyType.DECIMAL:
      return (
        <InputNumber
          value={value}
          onChange={(v) => onChange?.(v)}
          placeholder={property.placeholder}
          style={{ width: '100%' }}
        />
      );
    case PropertyType.CURRENCY:
      return (
        <InputNumber
          value={value}
          onChange={(v) => onChange?.(v)}
          placeholder={property.placeholder}
          style={{ width: '100%' }}
          formatter={(v) => `¥${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(v) => v?.replace(/¥\s?|(,*)/g, '') as any}
        />
      );
    case PropertyType.PERCENT:
      return (
        <InputNumber
          value={value}
          onChange={(v) => onChange?.(v)}
          placeholder={property.placeholder}
          style={{ width: '100%' }}
          min={0}
          max={100}
          suffix="%"
        />
      );
    case PropertyType.DATE:
      return (
        <DatePicker
          value={value ? dayjs(value) : null}
          onChange={(v) => onChange?.(v?.format('YYYY-MM-DD'))}
          style={{ width: '100%' }}
        />
      );
    case PropertyType.DATETIME:
      return (
        <DatePicker
          showTime
          value={value ? dayjs(value) : null}
          onChange={(v) => onChange?.(v?.format('YYYY-MM-DD HH:mm:ss'))}
          style={{ width: '100%' }}
        />
      );
    case PropertyType.SELECT:
    case PropertyType.RADIO:
      return (
        <Select
          value={value}
          onChange={(v) => onChange?.(v)}
          placeholder={property.placeholder}
          style={{ width: '100%' }}
          options={property.options?.map((o) => ({
            label: o.label,
            value: o.value,
          }))}
          allowClear
        />
      );
    case PropertyType.MULTISELECT:
      return (
        <Select
          mode="multiple"
          value={value}
          onChange={(v) => onChange?.(v)}
          placeholder={property.placeholder}
          style={{ width: '100%' }}
          options={property.options?.map((o) => ({
            label: o.label,
            value: o.value,
          }))}
        />
      );
    case PropertyType.SWITCH:
    case PropertyType.CHECKBOX:
      return (
        <Switch
          checked={value}
          onChange={(v) => onChange?.(v)}
          checkedChildren="Yes"
          unCheckedChildren="No"
        />
      );
    case PropertyType.RATING:
      return <Rate value={value} onChange={(v) => onChange?.(v)} />;
    case PropertyType.USER:
      return (
        <Select
          value={value}
          onChange={(v) => onChange?.(v)}
          placeholder={t('customObjects.selectUser', 'Select user')}
          style={{ width: '100%' }}
          options={[
            { label: 'User 1', value: 'user_1' },
            { label: 'User 2', value: 'user_2' },
            { label: 'User 3', value: 'user_3' },
          ]}
        />
      );
    case PropertyType.RELATION:
      const targetObj = objects.find((o) => o.id === property.targetObjectId);
      return (
        <Select
          value={value}
          onChange={(v) => onChange?.(v)}
          placeholder={`${t('customObjects.select', 'Select')} ${targetObj?.singularName}`}
          style={{ width: '100%' }}
          options={useCustomObjectsStore.getState().records[property.targetObjectId || '']?.map((r) => ({
            label: r.data.name || r.id,
            value: r.id,
          })) || []}
          showSearch
          allowClear
        />
      );
    default:
      return (
        <Input
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={property.placeholder}
        />
      );
  }
};

const ObjectData: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { objectId } = useParams();
  
  const {
    getObjectById,
    getProperties,
    getRecords,
    createRecord,
    updateRecord,
    deleteRecord,
  } = useCustomObjectsStore();
  
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [viewDrawerVisible, setViewDrawerVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ObjectRecord | null>(null);
  const [viewingRecord, setViewingRecord] = useState<ObjectRecord | null>(null);
  const [form] = Form.useForm();
  const [filters, setFilters] = useState<Record<string, any>>({});
  
  // 获取对象定义
  const objectDef = objectId ? getObjectById(objectId) : undefined;
  const properties = objectId ? getProperties(objectId).filter((p) => p.listVisible && p.enabled) : [];
  const allProperties = objectId ? getProperties(objectId) : [];
  const records = objectId ? getRecords(objectId) : [];
  
  // 主属性
  const primaryProperty = allProperties.find((p) => p.isPrimary);
  
  // 过滤记录
  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      for (const [key, value] of Object.entries(filters)) {
        if (value === undefined || value === null || value === '') continue;
        const recordValue = record.data[key];
        if (Array.isArray(value)) {
          if (!value.includes(recordValue)) return false;
        } else if (recordValue !== value) {
          return false;
        }
      }
      return true;
    });
  }, [records, filters]);
  
  // 打开新建/编辑抽屉
  const handleOpenDrawer = (record?: ObjectRecord) => {
    if (record) {
      setEditingRecord(record);
      form.setFieldsValue(record.data);
    } else {
      setEditingRecord(null);
      form.resetFields();
      // 设置默认值
      allProperties.forEach((prop) => {
        if (prop.defaultValue !== undefined) {
          form.setFieldValue(prop.name, prop.defaultValue);
        }
      });
    }
    setDrawerVisible(true);
  };
  
  // 保存记录
  const handleSaveRecord = async (values: any) => {
    try {
      if (editingRecord) {
        updateRecord(objectId!, editingRecord.id, values);
        message.success(t('customObjects.recordUpdateSuccess', 'Record updated'));
      } else {
        createRecord(objectId!, values);
        message.success(t('customObjects.recordCreateSuccess', 'Record created'));
      }
      setDrawerVisible(false);
      form.resetFields();
    } catch (error: any) {
      message.error(error.message || t('customObjects.recordSaveError', 'Failed to save record'));
    }
  };
  
  // 删除记录
  const handleDeleteRecord = (recordId: string) => {
    deleteRecord(objectId!, recordId);
    message.success(t('customObjects.recordDeleteSuccess', 'Record deleted'));
  };
  
  // 查看记录
  const handleViewRecord = (record: ObjectRecord) => {
    setViewingRecord(record);
    setViewDrawerVisible(true);
  };
  
  // 表格列定义
  const columns = [
    {
      title: primaryProperty?.label || 'Name',
      dataIndex: ['data', primaryProperty?.name || 'name'],
      key: 'primary',
      width: 200,
      render: (value: any, record: ObjectRecord) => (
        <Button type="link" onClick={() => handleViewRecord(record)}>
          {value || record.id}
        </Button>
      ),
    },
    ...properties
      .filter((p) => !p.isPrimary)
      .slice(0, 6)
      .map((property) => ({
        title: property.label,
        dataIndex: ['data', property.name],
        key: property.name,
        width: 150,
        render: (value: any) => <DynamicField property={property} value={value} mode="view" />,
      })),
    {
      title: t('common.actions', 'Actions'),
      key: 'actions',
      width: 120,
      fixed: 'right' as const,
      render: (_: any, record: ObjectRecord) => (
        <Space>
          <Tooltip title={t('common.details', 'Details')}>
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewRecord(record)}
            />
          </Tooltip>
          <Tooltip title={t('common.edit', 'Edit')}>
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleOpenDrawer(record)}
            />
          </Tooltip>
          <Popconfirm
            title={t('customObjects.deleteRecordTitle', 'Delete Record')}
            description={t('customObjects.deleteRecordContent', 'Are you sure you want to delete this record?')}
            onConfirm={() => handleDeleteRecord(record.id)}
            okText={t('common.delete', 'Delete')}
            okButtonProps={{ danger: true }}
          >
            <Tooltip title={t('common.delete', 'Delete')}>
              <Button type="text" size="small" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
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
    <div className={styles.container}>
      {/* 页面标题 */}
      <div className={styles.header}>
        <Space>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/settings/custom-objects')}
          />
          <Title level={3} className={styles.title}>
            {objectDef.pluralName} - {t('customObjects.data', 'Data')}
          </Title>
        </Space>
        <Space>
          <Button icon={<SettingOutlined />} onClick={() => navigate(`/settings/custom-objects/${objectId}/fields`)}>
            {t('customObjects.fields', 'Fields')}
          </Button>
          <Button icon={<FormOutlined />} onClick={() => navigate(`/settings/custom-objects/${objectId}/form`)}>
            {t('customObjects.formDesigner', 'Form Designer')}
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenDrawer()}>
            {t('customObjects.newRecord', 'New Record')}
          </Button>
        </Space>
      </div>
      
      {/* 筛选器 */}
      <Card className={styles.filterCard}>
        <Space wrap>
          <FilterOutlined />
          {properties.slice(0, 4).map((property) => {
            if (property.internalType === PropertyType.SELECT || property.internalType === PropertyType.RADIO) {
              return (
                <Select
                  key={property.id}
                  placeholder={property.label}
                  allowClear
                  style={{ width: 150 }}
                  value={filters[property.name]}
                  onChange={(v) => setFilters({ ...filters, [property.name]: v })}
                  options={property.options?.map((o) => ({ label: o.label, value: o.value }))}
                />
              );
            }
            return null;
          })}
          <Button onClick={() => setFilters({})}>{t('common.reset', 'Reset')}</Button>
        </Space>
      </Card>
      
      {/* 数据表格 */}
      <Card className={styles.dataCard}>
        <Table
          dataSource={filteredRecords}
          columns={columns}
          rowKey="id"
          scroll={{ x: 1000 }}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => t('customObjects.totalRecords', '{{count}} records', { count: total }),
          }}
        />
      </Card>
      
      {/* 新建/编辑抽屉 */}
      <Drawer
        title={editingRecord ? t('customObjects.editRecord', 'Edit Record') : t('customObjects.newRecord', 'New Record')}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        width={600}
        footer={
          <Space style={{ float: 'right' }}>
            <Button onClick={() => setDrawerVisible(false)}>{t('common.cancel', 'Cancel')}</Button>
            <Button type="primary" onClick={() => form.submit()}>
              {t('common.save', 'Save')}
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical" onFinish={handleSaveRecord}>
          {allProperties
            .filter((p) => p.enabled)
            .map((property) => (
              <Form.Item
                key={property.id}
                name={property.name}
                label={property.label}
                rules={[{ required: property.required, message: t('customObjects.fieldRequired', 'This field is required') }]}
              >
                <DynamicField property={property} />
              </Form.Item>
            ))}
        </Form>
      </Drawer>
      
      {/* 查看抽屉 */}
      <Drawer
        title={t('customObjects.recordDetails', 'Record Details')}
        open={viewDrawerVisible}
        onClose={() => setViewDrawerVisible(false)}
        width={600}
      >
        {viewingRecord && (
          <Descriptions column={1} bordered size="small">
            {allProperties
              .filter((p) => p.enabled && p.detailVisible)
              .map((property) => (
                <Descriptions.Item key={property.id} label={property.label}>
                  <DynamicField
                    property={property}
                    value={viewingRecord.data[property.name]}
                    mode="view"
                  />
                </Descriptions.Item>
              ))}
          </Descriptions>
        )}
      </Drawer>
    </div>
  );
};

export default ObjectData;