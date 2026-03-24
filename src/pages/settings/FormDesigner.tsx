/**
 * 表单设计器页面
 */
import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Button,
  Space,
  Typography,
  message,
  Divider,
  Empty,
  Collapse,
  Form,
  Input,
  Select,
  Modal,
  Dropdown,
} from 'antd';
import {
  SaveOutlined,
  SettingOutlined,
  PlusOutlined,
  DeleteOutlined,
  HolderOutlined,
  EyeOutlined,
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
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useCustomObjectsStore } from '../../store/customObjects';
import { ObjectProperty, PropertyType, FormSection, FormLayout } from '../../types/customObject';
import { PROPERTY_TYPE_LABELS } from '../../mock/customObjectsData';
import styles from './CustomObjects.module.css';

const { Title, Text } = Typography;
const { Panel } = Collapse;

// 可拖拽字段项
interface SortableFieldProps {
  property: ObjectProperty;
  onRemove: () => void;
}

const SortableField: React.FC<SortableFieldProps> = ({ property, onRemove }) => {
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
    <div ref={setNodeRef} style={style} className={styles.designerField}>
      <div className={styles.fieldDragHandle} {...attributes} {...listeners}>
        <HolderOutlined />
      </div>
      <div className={styles.fieldInfo}>
        <Text strong>{property.label}</Text>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {PROPERTY_TYPE_LABELS[property.internalType]}
        </Text>
      </div>
      {property.required && <span className={styles.requiredMark}>*</span>}
      <Button
        type="text"
        size="small"
        danger
        icon={<DeleteOutlined />}
        onClick={onRemove}
      />
    </div>
  );
};

const FormDesigner: React.FC = () => {
  const { t } = useTranslation();
  const { objectId } = useParams();
  
  const {
    getObjectById,
    getProperties,
    getForms,
    updateForm,
    getDefaultForm,
  } = useCustomObjectsStore();
  
  const [saving, setSaving] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  
  // 获取对象定义
  const objectDef = objectId ? getObjectById(objectId) : undefined;
  const allProperties = objectId ? getProperties(objectId) : [];
  const forms = objectId ? getForms(objectId) : [];
  const defaultForm = objectId ? getDefaultForm(objectId, 'create') : undefined;
  
  // 表单布局状态
  const [layout, setLayout] = useState<FormLayout>(
    defaultForm?.layout || {
      type: 'two_column',
      sections: [
        {
          id: 'section_1',
          title: 'Basic Information',
          fields: [],
          sortOrder: 0,
        },
      ],
    }
  );
  
  // 获取已添加到表单的字段ID
  const addedFieldIds = useMemo(() => {
    return layout.sections.flatMap((s) => s.fields);
  }, [layout]);
  
  // 获取未添加的字段
  const availableFields = useMemo(() => {
    return allProperties.filter((p) => !addedFieldIds.includes(p.id) && p.enabled);
  }, [allProperties, addedFieldIds]);
  
  // 获取已添加的字段
  const getFieldsInSection = (sectionId: string) => {
    const section = layout.sections.find((s) => s.id === sectionId);
    if (!section) return [];
    return section.fields
      .map((fieldId) => allProperties.find((p) => p.id === fieldId))
      .filter(Boolean) as ObjectProperty[];
  };
  
  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  // 添加字段到区块
  const handleAddField = (propertyId: string, sectionId: string) => {
    setLayout((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? { ...section, fields: [...section.fields, propertyId] }
          : section
      ),
    }));
  };
  
  // 从区块移除字段
  const handleRemoveField = (propertyId: string, sectionId: string) => {
    setLayout((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? { ...section, fields: section.fields.filter((f) => f !== propertyId) }
          : section
      ),
    }));
  };
  
  // 添加区块
  const handleAddSection = () => {
    const newSection: FormSection = {
      id: `section_${Date.now()}`,
      title: `Section ${layout.sections.length + 1}`,
      fields: [],
      sortOrder: layout.sections.length,
    };
    setLayout((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
  };
  
  // 删除区块
  const handleRemoveSection = (sectionId: string) => {
    if (layout.sections.length <= 1) {
      message.warning(t('customObjects.cannotDeleteLastSection', 'Cannot delete the last section'));
      return;
    }
    setLayout((prev) => ({
      ...prev,
      sections: prev.sections.filter((s) => s.id !== sectionId),
    }));
  };
  
  // 更新区块标题
  const handleUpdateSectionTitle = (sectionId: string, title: string) => {
    setLayout((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId ? { ...section, title } : section
      ),
    }));
  };
  
  // 拖拽排序字段
  const handleDragEnd = (event: DragEndEvent, sectionId: string) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const section = layout.sections.find((s) => s.id === sectionId);
      if (!section) return;
      
      const fields = section.fields;
      const oldIndex = fields.indexOf(active.id as string);
      const newIndex = fields.indexOf(over.id as string);
      
      const newFields = arrayMove(fields, oldIndex, newIndex);
      
      setLayout((prev) => ({
        ...prev,
        sections: prev.sections.map((s) =>
          s.id === sectionId ? { ...s, fields: newFields } : s
        ),
      }));
    }
  };
  
  // 保存表单
  const handleSave = async () => {
    setSaving(true);
    try {
      if (defaultForm) {
        updateForm(objectId!, defaultForm.id, { layout });
      }
      message.success(t('customObjects.formSaved', 'Form saved successfully'));
    } catch (error: any) {
      message.error(error.message || t('customObjects.formSaveError', 'Failed to save form'));
    } finally {
      setSaving(false);
    }
  };
  
  if (!objectDef) {
    return (
      <div className={styles.container}>
        <Empty description={t('customObjects.objectNotFound', 'Object not found')} />
      </div>
    );
  }
  
  return (
    <div className={styles.container} style={{ padding: 0 }}>
      <div className={styles.designerLayout}>
        {/* 左侧：可用字段 */}
        <Card className={styles.designerSidebar} title={t('customObjects.availableFields', 'Available Fields')} extra={
          <Space>
            <Button icon={<EyeOutlined />} onClick={() => setPreviewVisible(true)}>
              {t('customObjects.preview', 'Preview')}
            </Button>
            <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={handleSave}>
              {t('common.save', 'Save')}
            </Button>
          </Space>
        }>
          {availableFields.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={t('customObjects.allFieldsAdded', 'All fields have been added')}
            />
          ) : (
            <div className={styles.availableFieldsList}>
              {availableFields.map((property) => (
                <div key={property.id} className={styles.availableFieldItem}>
                  <div className={styles.fieldInfo}>
                    <Text strong>{property.label}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {PROPERTY_TYPE_LABELS[property.internalType]}
                    </Text>
                  </div>
                  <Dropdown
                    menu={{
                      items: layout.sections.map((section) => ({
                        key: section.id,
                        label: section.title || `Section ${section.sortOrder + 1}`,
                        onClick: () => handleAddField(property.id, section.id),
                      })),
                    }}
                    trigger={['click']}
                  >
                    <Button type="text" size="small" icon={<PlusOutlined />} />
                  </Dropdown>
                </div>
              ))}
            </div>
          )}
        </Card>
        
        {/* 中间：画布 */}
        <Card className={styles.designerCanvas} title={t('customObjects.formLayout', 'Form Layout')}>
          <div className={styles.layoutTypeSelector}>
            <Text type="secondary">{t('customObjects.layoutType', 'Layout Type')}:</Text>
            <Select
              value={layout.type}
              onChange={(value) => setLayout((prev) => ({ ...prev, type: value }))}
              style={{ width: 150, marginLeft: 8 }}
              options={[
                { value: 'single_column', label: t('customObjects.singleColumn', 'Single Column') },
                { value: 'two_column', label: t('customObjects.twoColumn', 'Two Columns') },
                { value: 'tabs', label: t('customObjects.tabs', 'Tabs') },
                { value: 'accordion', label: t('customObjects.accordion', 'Accordion') },
              ]}
            />
          </div>
          
          <div className={styles.sectionsContainer}>
            {layout.sections.map((section) => (
              <div key={section.id} className={styles.sectionCard}>
                <div className={styles.sectionHeader}>
                  <Input
                    value={section.title}
                    onChange={(e) => handleUpdateSectionTitle(section.id, e.target.value)}
                    placeholder={t('customObjects.sectionTitle', 'Section Title')}
                    className={styles.sectionTitleInput}
                  />
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveSection(section.id)}
                  />
                </div>
                
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={(event) => handleDragEnd(event, section.id)}
                >
                  <SortableContext
                    items={section.fields}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className={styles.fieldsContainer}>
                      {getFieldsInSection(section.id).length === 0 ? (
                        <Empty
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                          description={t('customObjects.dragFieldsHere', 'Drag fields here')}
                          className={styles.emptySection}
                        />
                      ) : (
                        getFieldsInSection(section.id).map((property) => (
                          <SortableField
                            key={property.id}
                            property={property}
                            onRemove={() => handleRemoveField(property.id, section.id)}
                          />
                        ))
                      )}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            ))}
            
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={handleAddSection}
              block
              className={styles.addSectionBtn}
            >
              {t('customObjects.addSection', 'Add Section')}
            </Button>
          </div>
        </Card>
      </div>
      
      {/* 预览弹窗 */}
      <Modal
        title={t('customObjects.formPreview', 'Form Preview')}
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        width={800}
      >
        <div className={styles.previewContainer}>
          {layout.sections.map((section) => (
            <Card
              key={section.id}
              title={section.title}
              size="small"
              style={{ marginBottom: 16 }}
            >
              <div
                className={
                  layout.type === 'two_column'
                    ? styles.previewTwoColumn
                    : styles.previewSingleColumn
                }
              >
                {getFieldsInSection(section.id).map((property) => (
                  <Form.Item
                    key={property.id}
                    label={property.label}
                    required={property.required}
                  >
                    <Input placeholder={property.placeholder || property.label} disabled />
                  </Form.Item>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default FormDesigner;