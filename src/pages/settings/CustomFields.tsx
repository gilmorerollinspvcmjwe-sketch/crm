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
      message.error('加载字段列表失败');
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
      title: '确认删除',
      content: '删除后无法恢复，确定要删除该字段吗？',
      onOk: async () => {
        try {
          await customFieldService.deleteCustomField(id);
          message.success('删除成功');
          loadFields();
        } catch (error) {
          message.error('删除失败');
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
        message.success('更新成功');
      } else {
        await customFieldService.createCustomField(values);
        message.success('创建成功');
      }
      setModalVisible(false);
      loadFields();
    } catch (error) {
      message.error(editingField ? '更新失败' : '创建失败');
    }
  };

  // 切换字段启用状态
  const handleToggleEnabled = async (field: CustomField) => {
    try {
      await customFieldService.updateCustomField(field.id, {
        enabled: !field.enabled,
      });
      message.success(field.enabled ? '已禁用' : '已启用');
      loadFields();
    } catch (error) {
      message.error('操作失败');
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
      title: '模块',
      dataIndex: 'modules',
      key: 'modules',
      width: 150,
      render: (modules: ModuleType[]) => (
        <Space wrap>
          {modules.map(module => (
            <Tag key={module} color="blue">
              {MODULE_LABELS[module]}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '字段名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '显示标签',
      dataIndex: 'label',
      key: 'label',
      width: 120,
    },
    {
      title: '字段类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: FieldType) => <Tag>{TYPE_LABELS[type]}</Tag>,
    },
    {
      title: '必填',
      dataIndex: 'required',
      key: 'required',
      width: 60,
      render: (required: boolean) => required ? '是' : '否',
    },
    {
      title: '列表显示',
      dataIndex: 'listVisible',
      key: 'listVisible',
      width: 80,
      render: (listVisible: boolean) => listVisible ? '✓' : '-',
    },
    {
      title: '详情显示',
      dataIndex: 'detailVisible',
      key: 'detailVisible',
      width: 80,
      render: (detailVisible: boolean) => detailVisible ? '✓' : '-',
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      width: 80,
      render: (enabled: boolean, record: CustomField) => (
        <Switch
          checked={enabled}
          onChange={() => handleToggleEnabled(record)}
          checkedChildren="启用"
          unCheckedChildren="禁用"
          size="small"
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: CustomField) => (
        <Space>
          <Tooltip title="编辑">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="删除">
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
        <h1 style={{ margin: 0, fontSize: '24px' }}>自定义字段管理</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          新建字段
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
            { label: '全部模块', value: 'all' },
            ...Object.entries(MODULE_LABELS).map(([value, label]) => ({
              label,
              value,
            })),
          ]}
        />
        <Input
          placeholder="搜索字段名称/标签"
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
          showTotal: (total) => `共 ${total} 个字段`,
        }}
        scroll={{ x: 1200 }}
      />

      {/* 新建/编辑弹窗 */}
      <Modal
        title={editingField ? '编辑自定义字段' : '新建自定义字段'}
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
