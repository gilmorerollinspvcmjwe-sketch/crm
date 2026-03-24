/**
 * 系统配置页面
 * 包含销售阶段设置、跟进类型设置
 */
import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Space,
  Table,
  Modal,
  message,
  Switch,
  Tabs,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UpOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { systemSettings, AVAILABLE_ICONS, AVAILABLE_COLORS } from '../../mock/settingsData';
import { SalesStage, FollowUpType } from '../../types/settings';

const { Option } = Select;

const SystemConfig: React.FC = () => {
  const { t } = useTranslation();
  const [settings] = useState(systemSettings);
  const [salesStages, setSalesStages] = useState<SalesStage[]>(settings.salesStages);
  const [followUpTypes, setFollowUpTypes] = useState<FollowUpType[]>(settings.followUpTypes);
  const [isStageModalVisible, setIsStageModalVisible] = useState(false);
  const [isFollowUpModalVisible, setIsFollowUpModalVisible] = useState(false);
  const [editingStage, setEditingStage] = useState<SalesStage | null>(null);
  const [editingFollowUp, setEditingFollowUp] = useState<FollowUpType | null>(null);
  const [stageForm] = Form.useForm();
  const [followUpForm] = Form.useForm();

  // 销售阶段管理
  const handleAddStage = () => {
    setEditingStage(null);
    stageForm.resetFields();
    setIsStageModalVisible(true);
  };

  const handleEditStage = (stage: SalesStage) => {
    setEditingStage(stage);
    stageForm.setFieldsValue(stage);
    setIsStageModalVisible(true);
  };

  const handleDeleteStage = (id: string) => {
    Modal.confirm({
      title: t('common.confirm'),
      content: t('settings.systemConfig.deleteConfirm', { type: t('settings.systemConfig.salesStagesTitle') }),
      onOk: () => {
        setSalesStages(salesStages.filter((s) => s.id !== id));
        message.success(t('settings.systemConfig.deleteSuccess'));
      },
    });
  };

  const handleSaveStage = (values: any) => {
    if (editingStage) {
      setSalesStages(salesStages.map((s) => (s.id === editingStage.id ? { ...s, ...values } : s)));
      message.success(t('settings.systemConfig.updateSuccess'));
    } else {
      const newStage: SalesStage = {
        ...values,
        id: `stage${Date.now()}`,
        order: salesStages.length + 1,
      };
      setSalesStages([...salesStages, newStage]);
      message.success(t('settings.systemConfig.addSuccess'));
    }
    setIsStageModalVisible(false);
  };

  const handleMoveStage = (index: number, direction: 'up' | 'down') => {
    const newStages = [...salesStages];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newStages.length) return;

    [newStages[index], newStages[targetIndex]] = [newStages[targetIndex], newStages[index]];
    newStages.forEach((stage, i) => {
      stage.order = i + 1;
    });
    setSalesStages(newStages);
  };

  // 跟进类型管理
  const handleAddFollowUp = () => {
    setEditingFollowUp(null);
    followUpForm.resetFields();
    followUpForm.setFieldsValue({ enabled: true });
    setIsFollowUpModalVisible(true);
  };

  const handleEditFollowUp = (followUp: FollowUpType) => {
    setEditingFollowUp(followUp);
    followUpForm.setFieldsValue(followUp);
    setIsFollowUpModalVisible(true);
  };

  const handleDeleteFollowUp = (id: string) => {
    Modal.confirm({
      title: t('common.confirm'),
      content: t('settings.systemConfig.deleteConfirm', { type: t('settings.systemConfig.followUpTypesTitle') }),
      onOk: () => {
        setFollowUpTypes(followUpTypes.filter((f) => f.id !== id));
        message.success(t('settings.systemConfig.deleteSuccess'));
      },
    });
  };

  const handleToggleFollowUp = (id: string) => {
    setFollowUpTypes(followUpTypes.map((f) =>
      f.id === id ? { ...f, enabled: !f.enabled } : f
    ));
  };

  const handleSaveFollowUp = (values: any) => {
    if (editingFollowUp) {
      setFollowUpTypes(followUpTypes.map((f) =>
        f.id === editingFollowUp.id ? { ...f, ...values } : f
      ));
      message.success(t('settings.systemConfig.updateSuccess'));
    } else {
      const newFollowUp: FollowUpType = {
        ...values,
        id: `follow${Date.now()}`,
      };
      setFollowUpTypes([...followUpTypes, newFollowUp]);
      message.success(t('settings.systemConfig.addSuccess'));
    }
    setIsFollowUpModalVisible(false);
  };

  const stageColumns = [
    {
      title: t('settings.systemConfig.columnOrder'),
      dataIndex: 'order',
      key: 'order',
      width: 80,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: t('settings.systemConfig.columnStageName'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('settings.systemConfig.columnColor'),
      dataIndex: 'color',
      key: 'color',
      width: 80,
      render: (color: string) => (
        <div style={{ width: 24, height: 24, backgroundColor: color, borderRadius: 4 }} />
      ),
    },
    {
      title: t('settings.systemConfig.columnSuccessRate'),
      dataIndex: 'successRate',
      key: 'successRate',
      width: 100,
      render: (rate: number) => `${rate}%`,
    },
    {
      title: t('common.edit'),
      key: 'action',
      width: 180,
      render: (_: any, record: SalesStage, index: number) => (
        <Space>
          <Button
            type="link"
            size="small"
            onClick={() => handleMoveStage(index, 'up')}
            disabled={index === 0}
          >
            <UpOutlined />
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => handleMoveStage(index, 'down')}
            disabled={index === salesStages.length - 1}
          >
            <DownOutlined />
          </Button>
          <Button type="link" size="small" onClick={() => handleEditStage(record)}>
            <EditOutlined />
          </Button>
          <Button
            type="link"
            size="small"
            danger
            onClick={() => handleDeleteStage(record.id)}
          >
            <DeleteOutlined />
          </Button>
        </Space>
      ),
    },
  ];

  const followUpColumns = [
    {
      title: t('settings.systemConfig.columnTypeName'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('settings.systemConfig.columnIcon'),
      dataIndex: 'icon',
      key: 'icon',
      width: 80,
    },
    {
      title: t('settings.systemConfig.columnColor'),
      dataIndex: 'color',
      key: 'color',
      width: 80,
      render: (color: string) => (
        <div style={{ width: 24, height: 24, backgroundColor: color, borderRadius: 4 }} />
      ),
    },
    {
      title: t('settings.systemConfig.columnEnabled'),
      dataIndex: 'enabled',
      key: 'enabled',
      width: 80,
      render: (enabled: boolean, record: FollowUpType) => (
        <Switch checked={enabled} onChange={() => handleToggleFollowUp(record.id)} />
      ),
    },
    {
      title: t('common.edit'),
      key: 'action',
      width: 120,
      render: (_: any, record: FollowUpType) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleEditFollowUp(record)}>
            <EditOutlined />
          </Button>
          <Button
            type="link"
            size="small"
            danger
            onClick={() => handleDeleteFollowUp(record.id)}
          >
            <DeleteOutlined />
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card
        bordered={false}
        style={{ maxWidth: 900 }}
      >
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
            {t('settings.systemConfig.title')}
          </h2>
          <p style={{ margin: '8px 0 0', color: '#999', fontSize: 14 }}>
            {t('settings.systemConfig.subtitle')}
          </p>
        </div>

        <Tabs defaultActiveKey="salesStages">
          <Tabs.TabPane tab={t('settings.systemConfig.salesStagesTab')} key="salesStages">
            <Card
              title={t('settings.systemConfig.salesStagesTitle')}
              extra={
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddStage}>
                  {t('settings.systemConfig.addStage')}
                </Button>
              }
              bordered={false}
            >
              <Table
                columns={stageColumns}
                dataSource={salesStages}
                rowKey="id"
                pagination={false}
                size="small"
              />
            </Card>
          </Tabs.TabPane>

          <Tabs.TabPane tab={t('settings.systemConfig.followUpTypesTab')} key="followUpTypes">
            <Card
              title={t('settings.systemConfig.followUpTypesTitle')}
              extra={
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddFollowUp}>
                  {t('settings.systemConfig.addType')}
                </Button>
              }
              bordered={false}
            >
              <Table
                columns={followUpColumns}
                dataSource={followUpTypes}
                rowKey="id"
                pagination={false}
                size="small"
              />
            </Card>
          </Tabs.TabPane>
        </Tabs>
      </Card>

      {/* 销售阶段编辑弹窗 */}
      <Modal
        title={editingStage ? t('settings.systemConfig.editSalesStage') : t('settings.systemConfig.addSalesStage')}
        open={isStageModalVisible}
        onOk={() => stageForm.submit()}
        onCancel={() => setIsStageModalVisible(false)}
      >
        <Form form={stageForm} layout="vertical" onFinish={handleSaveStage}>
          <Form.Item
            label={t('settings.systemConfig.stageName')}
            name="name"
            rules={[{ required: true, message: t('settings.systemConfig.enterStageName') }]}
          >
            <Input placeholder={t('settings.systemConfig.enterStageName')} />
          </Form.Item>

          <Form.Item
            label={t('settings.systemConfig.columnColor')}
            name="color"
            rules={[{ required: true, message: t('settings.systemConfig.selectColor') }]}
          >
            <Select>
              {AVAILABLE_COLORS.map((color) => (
                <Option key={color} value={color}>
                  <span
                    style={{
                      display: 'inline-block',
                      width: 16,
                      height: 16,
                      backgroundColor: color,
                      marginRight: 8,
                      borderRadius: 2,
                    }}
                  />
                  {color}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label={t('settings.systemConfig.columnSuccessRate')}
            name="successRate"
            rules={[{ required: true, message: t('settings.systemConfig.enterSuccessRate') }]}
          >
            <InputNumber min={0} max={100} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 跟进类型编辑弹窗 */}
      <Modal
        title={editingFollowUp ? t('settings.systemConfig.editFollowUpType') : t('settings.systemConfig.addFollowUpType')}
        open={isFollowUpModalVisible}
        onOk={() => followUpForm.submit()}
        onCancel={() => setIsFollowUpModalVisible(false)}
      >
        <Form form={followUpForm} layout="vertical" onFinish={handleSaveFollowUp}>
          <Form.Item
            label={t('settings.systemConfig.typeName')}
            name="name"
            rules={[{ required: true, message: t('settings.systemConfig.enterTypeName') }]}
          >
            <Input placeholder={t('settings.systemConfig.enterTypeName')} />
          </Form.Item>

          <Form.Item
            label={t('settings.systemConfig.columnIcon')}
            name="icon"
            rules={[{ required: true, message: t('settings.systemConfig.selectIcon') }]}
          >
            <Select>
              {AVAILABLE_ICONS.map((icon) => (
                <Option key={icon} value={icon}>
                  {icon}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label={t('settings.systemConfig.columnColor')}
            name="color"
            rules={[{ required: true, message: t('settings.systemConfig.selectColor') }]}
          >
            <Select>
              {AVAILABLE_COLORS.map((color) => (
                <Option key={color} value={color}>
                  <span
                    style={{
                      display: 'inline-block',
                      width: 16,
                      height: 16,
                      backgroundColor: color,
                      marginRight: 8,
                      borderRadius: 2,
                    }}
                  />
                  {color}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label={t('settings.systemConfig.columnEnabled')} name="enabled" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SystemConfig;