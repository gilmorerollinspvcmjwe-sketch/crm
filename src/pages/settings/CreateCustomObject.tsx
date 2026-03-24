/**
 * 创建/编辑自定义对象页面
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Form,
  Input,
  Button,
  Space,
  Select,
  ColorPicker,
  message,
  Typography,
  Divider,
  Alert,
} from 'antd';
import {
  ArrowLeftOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';
import * as Icons from '@ant-design/icons';
import { useCustomObjectsStore } from '../../store/customObjects';
import { AVAILABLE_ICONS } from '../../mock/customObjectsData';
import styles from './CustomObjects.module.css';

const { Title, Text } = Typography;
const { TextArea } = Input;

// 动态获取图标组件
const getIconComponent = (iconName: string) => {
  const IconComponent = (Icons as any)[iconName];
  return IconComponent ? <IconComponent /> : <DatabaseOutlined />;
};

// 预设颜色
const PRESET_COLORS = [
  '#2359A2', '#2E7D32', '#ED6C02', '#7B1FA2', '#0288D1',
  '#C62828', '#00897B', '#5C6BC0', '#D32F2F', '#1565C0',
  '#00695C', '#4527A0', '#283593', '#0097A7', '#388E3C',
];

interface ObjectFormData {
  name: string;
  singularName: string;
  pluralName: string;
  description: string;
  icon: string;
  iconColor: string;
}

const CreateCustomObject: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { objectId } = useParams();
  const isEdit = !!objectId;
  
  const { createObject, updateObject, getObjectById } = useCustomObjectsStore();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState('DatabaseOutlined');
  const [selectedColor, setSelectedColor] = useState('#2359A2');
  
  // 加载现有对象数据（编辑模式）
  useEffect(() => {
    if (isEdit && objectId) {
      const obj = getObjectById(objectId);
      if (obj) {
        form.setFieldsValue({
          name: obj.name,
          singularName: obj.singularName,
          pluralName: obj.pluralName,
          description: obj.description || '',
        });
        setSelectedIcon(obj.icon || 'DatabaseOutlined');
        setSelectedColor(obj.iconColor || '#2359A2');
      }
    }
  }, [isEdit, objectId]);
  
  // 名称自动生成单数/复数
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_');
    form.setFieldsValue({ name });
    
    // 自动设置单数/复数名称
    const singular = name.charAt(0).toUpperCase() + name.slice(1);
    const plural = singular + 's';
    
    if (!form.getFieldValue('singularName')) {
      form.setFieldsValue({ singularName: singular });
    }
    if (!form.getFieldValue('pluralName')) {
      form.setFieldsValue({ pluralName: plural });
    }
  };
  
  // 提交表单
  const handleSubmit = async (values: ObjectFormData) => {
    setLoading(true);
    try {
      if (isEdit && objectId) {
        updateObject(objectId, {
          singularName: values.singularName,
          pluralName: values.pluralName,
          description: values.description,
          icon: selectedIcon,
          iconColor: selectedColor,
          updatedBy: 'current_user',
        });
        message.success(t('customObjects.updateSuccess', 'Object updated successfully'));
      } else {
        const newObj = createObject({
          name: values.name,
          singularName: values.singularName,
          pluralName: values.pluralName,
          description: values.description,
          icon: selectedIcon,
          iconColor: selectedColor,
          primaryProperty: '',
          secondaryProperties: [],
          enabled: true,
          isSystem: false,
          sortOrder: 100,
          showInNavigation: true,
          createdBy: 'current_user',
        });
        message.success(t('customObjects.createSuccess', 'Object created successfully'));
        navigate(`/settings/custom-objects/${newObj.id}/fields`);
        return;
      }
      navigate('/settings/custom-objects');
    } catch (error: any) {
      message.error(error.message || t('customObjects.saveError', 'Failed to save object'));
    } finally {
      setLoading(false);
    }
  };
  
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
            {isEdit
              ? t('customObjects.editObject', 'Edit Object')
              : t('customObjects.createObject', 'Create Custom Object')}
          </Title>
        </Space>
      </div>
      
      <Card className={styles.formCard}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark="optional"
        >
          {/* 基本信息 */}
          <Title level={4}>{t('customObjects.basicInfo', 'Basic Information')}</Title>
          <Divider />
          
          <Form.Item
            name="name"
            label={t('customObjects.objectName', 'Object Name (API)')}
            rules={[
              { required: true, message: t('customObjects.nameRequired', 'Please enter object name') },
              { pattern: /^[a-z][a-z0-9_]*$/, message: t('customObjects.namePattern', 'Must start with letter, only lowercase letters, numbers and underscores') },
            ]}
            extra={t('customObjects.nameHint', 'Used for API and database, cannot be changed after creation')}
          >
            <Input
              placeholder="e.g., product, order, ticket"
              onChange={handleNameChange}
              disabled={isEdit}
            />
          </Form.Item>
          
          <Form.Item
            name="singularName"
            label={t('customObjects.singularName', 'Singular Name')}
            rules={[{ required: true, message: t('customObjects.singularNameRequired', 'Please enter singular name') }]}
          >
            <Input placeholder="e.g., Product, Order, Ticket" />
          </Form.Item>
          
          <Form.Item
            name="pluralName"
            label={t('customObjects.pluralName', 'Plural Name')}
            rules={[{ required: true, message: t('customObjects.pluralNameRequired', 'Please enter plural name') }]}
          >
            <Input placeholder="e.g., Products, Orders, Tickets" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label={t('customObjects.description', 'Description')}
          >
            <TextArea
              placeholder={t('customObjects.descriptionPlaceholder', 'Briefly describe what this object is used for...')}
              rows={3}
            />
          </Form.Item>
          
          {/* 图标选择 */}
          <Title level={4} style={{ marginTop: 24 }}>
            {t('customObjects.iconAndColor', 'Icon & Color')}
          </Title>
          <Divider />
          
          <Form.Item label={t('customObjects.selectIcon', 'Select Icon')}>
            <div className={styles.iconGrid}>
              {AVAILABLE_ICONS.slice(0, 60).map((iconName) => (
                <div
                  key={iconName}
                  className={`${styles.iconItem} ${selectedIcon === iconName ? styles.iconItemSelected : ''}`}
                  onClick={() => setSelectedIcon(iconName)}
                >
                  {getIconComponent(iconName)}
                </div>
              ))}
            </div>
          </Form.Item>
          
          <Form.Item label={t('customObjects.selectColor', 'Select Color')}>
            <div className={styles.colorGrid}>
              {PRESET_COLORS.map((color) => (
                <div
                  key={color}
                  className={`${styles.colorItem} ${selectedColor === color ? styles.colorItemSelected : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
              <ColorPicker
                value={selectedColor}
                onChange={(color) => setSelectedColor(color.toHexString())}
                showText
              />
            </div>
          </Form.Item>
          
          {/* 预览 */}
          <Title level={4} style={{ marginTop: 24 }}>
            {t('customObjects.preview', 'Preview')}
          </Title>
          <Divider />
          
          <div className={styles.previewCard}>
            <div
              className={styles.previewIcon}
              style={{ backgroundColor: `${selectedColor}15`, color: selectedColor }}
            >
              {getIconComponent(selectedIcon)}
            </div>
            <div>
              <Title level={5} style={{ margin: 0 }}>
                {form.getFieldValue('pluralName') || 'Object Name'}
              </Title>
              <Text type="secondary">
                {form.getFieldValue('description') || t('customObjects.noDescription', 'No description')}
              </Text>
            </div>
          </div>
          
          {/* 提交按钮 */}
          <div className={styles.formActions}>
            <Space>
              <Button onClick={() => navigate('/settings/custom-objects')}>
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {isEdit
                  ? t('common.save', 'Save')
                  : t('customObjects.createAndAddFields', 'Create & Add Fields')}
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default CreateCustomObject;