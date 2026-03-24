/**
 * 系统设置页面
 */

import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Checkbox,
  Button,
  Space,
  Table,
  Modal,
  message,
  Upload,
  Tabs,
  Switch,
  Divider,
} from 'antd';
import {
  UploadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UpOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { systemSettings, WORK_DAY_OPTIONS, RETENTION_OPTIONS, AVAILABLE_ICONS, AVAILABLE_COLORS } from '../mock/settingsData';
import { SalesStage, FollowUpType } from '../types/settings';

const { Option } = Select;
const { TabPane } = Tabs;

const SystemSettings: React.FC = () => {
  const [settings] = useState(systemSettings);
  const [salesStages, setSalesStages] = useState<SalesStage[]>(settings.salesStages);
  const [followUpTypes, setFollowUpTypes] = useState<FollowUpType[]>(settings.followUpTypes);
  const [isStageModalVisible, setIsStageModalVisible] = useState(false);
  const [isFollowUpModalVisible, setIsFollowUpModalVisible] = useState(false);
  const [editingStage, setEditingStage] = useState<SalesStage | null>(null);
  const [editingFollowUp, setEditingFollowUp] = useState<FollowUpType | null>(null);
  const [stageForm] = Form.useForm();
  const [followUpForm] = Form.useForm();

  // 基础设置保存
  const handleBasicSave = (values: any) => {
    message.success('基础设置保存成功！');
    console.log('基础设置:', values);
  };

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
      title: '确认删除',
      content: '确定要删除此销售阶段吗？',
      onOk: () => {
        setSalesStages(salesStages.filter((s) => s.id !== id));
        message.success('删除成功');
      },
    });
  };

  const handleSaveStage = (values: any) => {
    if (editingStage) {
      setSalesStages(salesStages.map((s) => (s.id === editingStage.id ? { ...s, ...values } : s)));
      message.success('更新成功');
    } else {
      const newStage: SalesStage = {
        ...values,
        id: `stage${Date.now()}`,
        order: salesStages.length + 1,
      };
      setSalesStages([...salesStages, newStage]);
      message.success('添加成功');
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
      title: '确认删除',
      content: '确定要删除此跟进类型吗？',
      onOk: () => {
        setFollowUpTypes(followUpTypes.filter((f) => f.id !== id));
        message.success('删除成功');
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
      message.success('更新成功');
    } else {
      const newFollowUp: FollowUpType = {
        ...values,
        id: `follow${Date.now()}`,
      };
      setFollowUpTypes([...followUpTypes, newFollowUp]);
      message.success('添加成功');
    }
    setIsFollowUpModalVisible(false);
  };

  const stageColumns = [
    {
      title: '顺序',
      dataIndex: 'order',
      key: 'order',
      width: 80,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: '阶段名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '颜色',
      dataIndex: 'color',
      key: 'color',
      width: 80,
      render: (color: string) => (
        <div style={{ width: 24, height: 24, backgroundColor: color, borderRadius: 4 }} />
      ),
    },
    {
      title: '成功率',
      dataIndex: 'successRate',
      key: 'successRate',
      width: 100,
      render: (rate: number) => `${rate}%`,
    },
    {
      title: '操作',
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
      title: '类型名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      width: 80,
    },
    {
      title: '颜色',
      dataIndex: 'color',
      key: 'color',
      width: 80,
      render: (color: string) => (
        <div style={{ width: 24, height: 24, backgroundColor: color, borderRadius: 4 }} />
      ),
    },
    {
      title: '启用',
      dataIndex: 'enabled',
      key: 'enabled',
      width: 80,
      render: (enabled: boolean, record: FollowUpType) => (
        <Switch checked={enabled} onChange={() => handleToggleFollowUp(record.id)} />
      ),
    },
    {
      title: '操作',
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
    <div style={{ background: '#f0f2f5', minHeight: '100vh', padding: 16 }}>
      <Card style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>⚙️ 系统设置</h2>
        <p style={{ margin: '8px 0 0 0', color: '#999' }}>
          配置系统基础参数、销售阶段和跟进类型
        </p>
      </Card>

      <Tabs defaultActiveKey="basic">
        <TabPane tab="基础设置" key="basic">
          <Card>
            <Form
              layout="vertical"
              initialValues={{
                companyName: settings.basic.companyName,
                workDays: settings.basic.workDays,
                dataRetentionDays: settings.basic.dataRetentionDays,
              }}
              onFinish={handleBasicSave}
            >
              <Form.Item
                label="公司名称"
                name="companyName"
                rules={[{ required: true, message: '请输入公司名称' }]}
              >
                <Input placeholder="请输入公司名称" />
              </Form.Item>

              <Form.Item label="公司 Logo">
                <Upload>
                  <Button icon={<UploadOutlined />}>点击上传</Button>
                </Upload>
              </Form.Item>

              <Form.Item
                label="工作日设置"
                name="workDays"
                rules={[{ required: true, message: '请至少选择一个工作日' }]}
              >
                <Checkbox.Group>
                  <Space>
                    {WORK_DAY_OPTIONS.map((day) => (
                      <Checkbox key={day.value} value={day.value}>
                        {day.label}
                      </Checkbox>
                    ))}
                  </Space>
                </Checkbox.Group>
              </Form.Item>

              <Form.Item
                label="数据保留策略"
                name="dataRetentionDays"
                rules={[{ required: true, message: '请选择数据保留时长' }]}
              >
                <Select>
                  {RETENTION_OPTIONS.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  保存设置
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>

        <TabPane tab="销售阶段设置" key="salesStages">
          <Card
            title="销售阶段管理"
            extra={
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddStage}>
                添加阶段
              </Button>
            }
          >
            <Table
              columns={stageColumns}
              dataSource={salesStages}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </TabPane>

        <TabPane tab="跟进类型设置" key="followUpTypes">
          <Card
            title="跟进类型管理"
            extra={
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddFollowUp}>
                添加类型
              </Button>
            }
          >
            <Table
              columns={followUpColumns}
              dataSource={followUpTypes}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* 销售阶段编辑弹窗 */}
      <Modal
        title={editingStage ? '编辑销售阶段' : '添加销售阶段'}
        open={isStageModalVisible}
        onOk={() => stageForm.submit()}
        onCancel={() => setIsStageModalVisible(false)}
      >
        <Form form={stageForm} layout="vertical" onFinish={handleSaveStage}>
          <Form.Item
            label="阶段名称"
            name="name"
            rules={[{ required: true, message: '请输入阶段名称' }]}
          >
            <Input placeholder="如：初步接洽" />
          </Form.Item>

          <Form.Item
            label="颜色"
            name="color"
            rules={[{ required: true, message: '请选择颜色' }]}
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
            label="成功率 (%)"
            name="successRate"
            rules={[{ required: true, message: '请输入成功率' }]}
          >
            <InputNumber min={0} max={100} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 跟进类型编辑弹窗 */}
      <Modal
        title={editingFollowUp ? '编辑跟进类型' : '添加跟进类型'}
        open={isFollowUpModalVisible}
        onOk={() => followUpForm.submit()}
        onCancel={() => setIsFollowUpModalVisible(false)}
      >
        <Form form={followUpForm} layout="vertical" onFinish={handleSaveFollowUp}>
          <Form.Item
            label="类型名称"
            name="name"
            rules={[{ required: true, message: '请输入类型名称' }]}
          >
            <Input placeholder="如：电话" />
          </Form.Item>

          <Form.Item
            label="图标"
            name="icon"
            rules={[{ required: true, message: '请选择图标' }]}
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
            label="颜色"
            name="color"
            rules={[{ required: true, message: '请选择颜色' }]}
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

          <Form.Item label="启用" name="enabled" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SystemSettings;
