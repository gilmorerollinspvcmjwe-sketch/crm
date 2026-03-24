import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Tag, 
  Input, 
  Select, 
  Modal, 
  message,
  Tooltip,
  Switch,
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  DragOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { CustomField, FieldType, ModuleType } from '../../types/customField';
import { customFieldService } from '../../services/customFieldService';
import CustomFieldForm from '../../components/CustomField/CustomFieldForm';

/**
 * 模块名称映射
 */
const MODULE_LABELS: Record<ModuleType, string> = {
  [ModuleType.CUSTOMER]: '客户管理',
  [ModuleType.CONTACT]: '联系人',
  [ModuleType.LEAD]: '线索管理',
  [ModuleType.OPPORTUNITY]: '商机管理',
  [ModuleType.CONTRACT]: '合同管理',
  [ModuleType.PRODUCT]: '产品库',
  [ModuleType.QUOTE]: '报价单',
  [ModuleType.TICKET]: '工单系统',
  [ModuleType.CAMPAIGN]: '活动管理',
};

/**
 * 字段类型映射
 */
const TYPE_LABELS: Record<FieldType, string> = {
  [FieldType.TEXT]: '文本',
  [FieldType.TEXTAREA]: '多行文本',
  [FieldType.NUMBER]: '数字',
  [FieldType.DATE]: '日期',
  [FieldType.DATETIME]: '日期时间',
  [FieldType.SELECT]: '单选',
  [FieldType.MULTISELECT]: '多选',
  [FieldType.SWITCH]: '开关',
  [FieldType.USER]: '人员',
  [FieldType.DEPARTMENT]: '部门',
  [FieldType.RELATION]: '关联',
  [FieldType.FILE]: '附件',
};

const CustomFields: React.FC = () => {
  const { t } = useTranslation();
  const [fields, setFields] = useState<CustomField[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedModule, setSelectedModule] = useState<ModuleType | 'all'>('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingField, setEditingField] = useState<CustomField | null>(null);

  // 加载字段列表
  const loadFields = async () => {
    setLoading(true);
    try {
      const data = await customFieldService.getCustomFields(
        selectedModule === 'all' ? undefined : selectedModule
      );
      setFields(data);
    } catch (error) {
      message.error(t('settings.customFields.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFields();
  }, [selectedModule]);

  // 删除字段
  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: t('common.confirm'),
      content: t('settings.customFields.deleteConfirm'),
      onOk: async () => {
        try {
          await customFieldService.deleteCustomField(id);
          message.success(t('settings.customFields.deleteSuccess'));
          loadFields();
        } catch (error) {
          message.error(t('settings.customFields.operationFailed'));
        }
      },
    });
  };

  // 编辑字段
  const handleEdit = (field: CustomField) => {
    setEditingField(field);
    setModalVisible(true);
  };

  // 新建字段
  const handleCreate = () => {
    setEditingField(null);
    setModalVisible(true);
  };

  // 保存字段
  const handleSave = async (values: any) => {
    try {
      if (editingField) {
        await customFieldService.updateCustomField(editingField.id, values);
        message.success(t('settings.customFields.updateSuccess'));
      } else {
        await customFieldService.createCustomField(values);
        message.success(t('settings.customFields.createSuccess'));
      }
      setModalVisible(false);
      loadFields();
    } catch (error) {
      message.error(editingField ? t('settings.customFields.operationFailed') : t('settings.customFields.operationFailed'));
    }
  };

  // 切换字段启用状态
  const handleToggleEnabled = async (field: CustomField) => {
    try {
      await customFieldService.updateCustomField(field.id, {
        enabled: !field.enabled,
      });
      message.success(field.enabled ? t('settings.customFields.disabled') : t('settings.customFields.enabled'));
      loadFields();
    } catch (error) {
      message.error(t('settings.customFields.operationFailed'));
    }
  };

  // 过滤字段
  const filteredFields = fields.filter(field => {
    if (!searchText) return true;
    return (
      field.name.toLowerCase().includes(searchText.toLowerCase()) ||
      field.label.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  // 表格列定义
  const columns = [
    {
      title: t('settings.customFields.columnModule'),
      dataIndex: 'modules',
      key: 'modules',
      width: 150,
      render: (modules: ModuleType[]) => (
        <Space wrap>
          {modules.map(module => (
            <Tag key={module} color="blue">
              {t(`customField.modules.${module}`)}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: t('settings.customFields.columnFieldName'),
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: t('settings.customFields.columnLabel'),
      dataIndex: 'label',
      key: 'label',
      width: 120,
    },
    {
      title: t('settings.customFields.columnFieldType'),
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: FieldType) => <Tag>{t(`customField.types.${type}`)}</Tag>,
    },
    {
      title: t('settings.customFields.columnRequired'),
      dataIndex: 'required',
      key: 'required',
      width: 60,
      render: (required: boolean) => required ? t('common.yes') : t('common.no'),
    },
    {
      title: t('settings.customFields.columnListVisible'),
      dataIndex: 'listVisible',
      key: 'listVisible',
      width: 80,
      render: (listVisible: boolean) => listVisible ? '✓' : '-',
    },
    {
      title: t('settings.customFields.columnDetailVisible'),
      dataIndex: 'detailVisible',
      key: 'detailVisible',
      width: 80,
      render: (detailVisible: boolean) => detailVisible ? '✓' : '-',
    },
    {
      title: t('settings.customFields.columnStatus'),
      dataIndex: 'enabled',
      key: 'enabled',
      width: 80,
      render: (enabled: boolean, record: CustomField) => (
        <Switch
          checked={enabled}
          onChange={() => handleToggleEnabled(record)}
          checkedChildren={t('settings.customFields.enabled')}
          unCheckedChildren={t('settings.customFields.disabled')}
          size="small"
        />
      ),
    },
    {
      title: t('common.edit'),
      key: 'action',
      width: 120,
      render: (_: any, record: CustomField) => (
        <Space>
          <Tooltip title={t('common.edit')}>
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title={t('common.delete')}>
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* 页面标题 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px',
      }}>
        <h1 style={{ margin: 0, fontSize: '24px' }}>{t('settings.customFields.title')}</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          {t('settings.customFields.newField')}
        </Button>
      </div>

      {/* 工具栏 */}
      <div style={{ 
        display: 'flex', 
        gap: '16px', 
        marginBottom: '16px',
        alignItems: 'center',
      }}>
        <Select
          style={{ width: 200 }}
          value={selectedModule}
          onChange={(value) => setSelectedModule(value)}
          options={[
            { label: t('settings.customFields.allModules'), value: 'all' },
            ...Object.keys(MODULE_LABELS).map((value) => ({
              label: t(`customField.modules.${value as ModuleType}`),
              value,
            })),
          ]}
        />
        <Input
          placeholder={t('settings.customFields.searchPlaceholder')}
          prefix={<SearchOutlined />}
          style={{ width: 300 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
        />
      </div>

      {/* 字段列表表格 */}
      <Table
        columns={columns}
        dataSource={filteredFields}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 20,
          showSizeChanger: true,
          showTotal: (total) => `${t('common.total')} ${total} ${t('marketing.campaigns.unit')}`,
        }}
        scroll={{ x: 1200 }}
      />

      {/* 新建/编辑弹窗 */}
      <Modal
        title={editingField ? t('settings.customFields.editField') : t('settings.customFields.newFieldTitle')}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <CustomFieldForm
          initialValues={editingField || undefined}
          onSave={handleSave}
          onCancel={() => setModalVisible(false)}
        />
      </Modal>
    </div>
  );
};

export default CustomFields;