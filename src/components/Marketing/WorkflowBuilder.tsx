/**
 * 工作流构建器组件
 * 用于可视化创建和编辑营销自动化工作流
 */
import React, { useState, useRef } from 'react';
import { Card, Button, Space, Typography, Tag, Divider, Drawer, Form, Input, Select, message } from 'antd';
import {
  PlusOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  NodeIndexOutlined,
  BranchesOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { Workflow, WorkflowNode, WorkflowEdge, TriggerType, ActionType } from '../../types/marketing';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface WorkflowBuilderProps {
  workflow?: Workflow;
  onSave?: (workflow: Workflow) => void;
  readOnly?: boolean;
}

/**
 * 工作流构建器组件
 */
export const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({
  workflow,
  onSave,
  readOnly = false,
}) => {
  const { t } = useTranslation();
  const [nodes, setNodes] = useState<WorkflowNode[]>(workflow?.nodes || []);
  const [edges, setEdges] = useState<WorkflowEdge[]>(workflow?.edges || []);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [editDrawerVisible, setEditDrawerVisible] = useState(false);
  const [form] = Form.useForm();
  const canvasRef = useRef<HTMLDivElement>(null);

  /** 节点类型配置 */
  const nodeTypeConfig = {
    trigger: { color: 'blue', icon: PlayCircleOutlined, label: t('marketing.workflowBuilder.trigger') },
    action: { color: 'green', icon: NodeIndexOutlined, label: t('marketing.workflowBuilder.action') },
    condition: { color: 'orange', icon: BranchesOutlined, label: t('marketing.workflowBuilder.condition') },
    end: { color: 'gray', icon: undefined, label: t('marketing.workflowBuilder.end') },
  };

  /** 触发类型选项 */
  const triggerTypeOptions = [
    { label: t('marketing.workflowBuilder.timeTrigger'), value: TriggerType.TIME_BASED },
    { label: t('marketing.workflowBuilder.behaviorTrigger'), value: TriggerType.BEHAVIOR_BASED },
    { label: t('marketing.workflowBuilder.attributeTrigger'), value: TriggerType.ATTRIBUTE_BASED },
    { label: t('marketing.workflowBuilder.eventTrigger'), value: TriggerType.EVENT_BASED },
  ];

  /** 动作类型选项 */
  const actionTypeOptions = [
    { label: t('marketing.workflowBuilder.sendEmail'), value: ActionType.SEND_EMAIL },
    { label: t('marketing.workflowBuilder.sendSMS'), value: ActionType.SEND_SMS },
    { label: t('marketing.workflowBuilder.createTask'), value: ActionType.CREATE_TASK },
    { label: t('marketing.workflowBuilder.updateField'), value: ActionType.UPDATE_FIELD },
    { label: t('marketing.workflowBuilder.addToList'), value: ActionType.ADD_TO_LIST },
    { label: t('marketing.workflowBuilder.removeFromList'), value: ActionType.REMOVE_FROM_LIST },
    { label: t('marketing.workflowBuilder.notifyUser'), value: ActionType.NOTIFY_USER },
  ];

  /** 添加新节点 */
  const handleAddNode = (type: 'trigger' | 'action' | 'condition') => {
    if (readOnly) {
      message.warning(t('marketing.workflowBuilder.readOnlyWarning', { action: t('common.edit') }));
      return;
    }

    const newNode: WorkflowNode = {
      id: `node_${Date.now()}`,
      type,
      name: type === 'trigger' ? t('marketing.workflowBuilder.newTrigger') : 
            type === 'action' ? t('marketing.workflowBuilder.newAction') : 
            t('marketing.workflowBuilder.newCondition'),
      triggerType: type === 'trigger' ? TriggerType.TIME_BASED : undefined,
      actionType: type === 'action' ? ActionType.SEND_EMAIL : undefined,
      config: {},
      position: {
        x: 100 + nodes.length * 50,
        y: 100 + nodes.length * 50,
      },
    };

    setNodes([...nodes, newNode]);
    setSelectedNode(newNode);
    setEditDrawerVisible(true);
    form.setFieldsValue({
      name: newNode.name,
      triggerType: newNode.triggerType,
      actionType: newNode.actionType,
    });
  };

  /** 选择节点进行编辑 */
  const handleNodeClick = (node: WorkflowNode) => {
    setSelectedNode(node);
    setEditDrawerVisible(true);
    form.setFieldsValue({
      name: node.name,
      triggerType: node.triggerType,
      actionType: node.actionType,
      description: node.config?.description,
    });
  };

  /** 保存节点编辑 */
  const handleSaveNode = () => {
    form.validateFields().then((values) => {
      if (selectedNode) {
        const updatedNodes = nodes.map((node) =>
          node.id === selectedNode.id
            ? {
                ...node,
                name: values.name,
                triggerType: values.triggerType,
                actionType: values.actionType,
                config: {
                  ...node.config,
                  description: values.description,
                },
              }
            : node
        );

        setNodes(updatedNodes);
        setEditDrawerVisible(false);
        setSelectedNode(null);
        message.success(t('marketing.workflowBuilder.nodeSaved'));
      }
    });
  };

  /** 删除节点 */
  const handleDeleteNode = (nodeId: string) => {
    if (readOnly) {
      message.warning(t('marketing.workflowBuilder.readOnlyWarning', { action: t('common.delete') }));
      return;
    }

    setNodes(nodes.filter((n) => n.id !== nodeId));
    setEdges(edges.filter((e) => e.source !== nodeId && e.target !== nodeId));
    message.success(t('marketing.workflowBuilder.nodeDeleted'));
  };

  /** 保存整个工作流 */
  const handleSaveWorkflow = () => {
    if (!workflow) return;

    const updatedWorkflow: Workflow = {
      ...workflow,
      nodes,
      edges,
    };

    onSave?.(updatedWorkflow);
    message.success(t('marketing.workflowBuilder.workflowSaved'));
  };

  /** 渲染节点 */
  const renderNode = (node: WorkflowNode) => {
    const config = nodeTypeConfig[node.type];
    const Icon = config.icon;
    const isSelected = selectedNode?.id === node.id;

    return (
      <div
        key={node.id}
        onClick={() => handleNodeClick(node)}
        style={{
          position: 'absolute',
          left: node.position.x,
          top: node.position.y,
          width: 200,
          padding: 12,
          background: '#fff',
          border: isSelected ? '2px solid #1890ff' : '1px solid #d9d9d9',
          borderRadius: 8,
          cursor: readOnly ? 'default' : 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          zIndex: isSelected ? 10 : 1,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          {Icon && <Icon style={{ fontSize: 16, color: `#${config.color}90`, marginRight: 8 }} />}
          <Text strong>{node.name}</Text>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Tag color={config.color}>{config.label}</Tag>
          {!readOnly && (
            <Button
              type="text"
              danger
              size="small"
              icon={<DeleteOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteNode(node.id);
              }}
            />
          )}
        </div>
        {node.type === 'trigger' && node.triggerType && (
          <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
            {triggerTypeOptions.find((t) => t.value === node.triggerType)?.label}
          </Text>
        )}
        {node.type === 'action' && node.actionType && (
          <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
            {actionTypeOptions.find((t) => t.value === node.actionType)?.label}
          </Text>
        )}
      </div>
    );
  };

  return (
    <div style={{ position: 'relative' }}>
      <Card
        title={t('marketing.workflowBuilder.title')}
        extra={
          !readOnly && (
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => handleAddNode('trigger')}
              >
                {t('marketing.workflowBuilder.addTrigger')}
              </Button>
              <Button
                icon={<PlusOutlined />}
                onClick={() => handleAddNode('action')}
              >
                {t('marketing.workflowBuilder.addAction')}
              </Button>
              <Button
                icon={<PlusOutlined />}
                onClick={() => handleAddNode('condition')}
              >
                {t('marketing.workflowBuilder.addCondition')}
              </Button>
              <Button type="primary" onClick={handleSaveWorkflow}>
                {t('marketing.workflowBuilder.saveWorkflow')}
              </Button>
            </Space>
          )
        }
        style={{ marginBottom: 16 }}
      >
        <div
          ref={canvasRef}
          style={{
            position: 'relative',
            height: 600,
            background: '#f5f5f5',
            borderRadius: 4,
            overflow: 'auto',
          }}
        >
          {/* 网格背景 */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `
                linear-gradient(#e8e8e8 1px, transparent 1px),
                linear-gradient(90deg, #e8e8e8 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
              opacity: 0.5,
            }}
          />

          {/* 节点 */}
          {nodes.map(renderNode)}

          {/* 空状态提示 */}
          {nodes.length === 0 && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                color: '#999',
              }}
            >
              <NodeIndexOutlined style={{ fontSize: 48, marginBottom: 16 }} />
              <div>{t('marketing.workflowBuilder.noNodes')}</div>
            </div>
          )}
        </div>
      </Card>

      {/* 节点编辑抽屉 */}
      <Drawer
        title={t('marketing.workflowBuilder.editNode')}
        placement="right"
        width={400}
        open={editDrawerVisible}
        onClose={() => {
          setEditDrawerVisible(false);
          setSelectedNode(null);
        }}
        extra={
          <Space>
            <Button onClick={() => setEditDrawerVisible(false)}>{t('common.cancel')}</Button>
            <Button type="primary" onClick={handleSaveNode}>
              {t('common.save')}
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label={t('marketing.workflowBuilder.nodeName')}
            name="name"
            rules={[{ required: true, message: t('marketing.workflowBuilder.enterNodeName') }]}
          >
            <Input placeholder={t('marketing.workflowBuilder.enterNodeName')} />
          </Form.Item>

          {selectedNode?.type === 'trigger' && (
            <Form.Item
              label={t('marketing.workflowBuilder.triggerType')}
              name="triggerType"
              rules={[{ required: true, message: t('marketing.workflowBuilder.selectTriggerType') }]}
            >
              <Select options={triggerTypeOptions} />
            </Form.Item>
          )}

          {selectedNode?.type === 'action' && (
            <Form.Item
              label={t('marketing.workflowBuilder.actionType')}
              name="actionType"
              rules={[{ required: true, message: t('marketing.workflowBuilder.selectActionType') }]}
            >
              <Select options={actionTypeOptions} />
            </Form.Item>
          )}

          <Form.Item label={t('marketing.workflowBuilder.nodeDescription')} name="description">
            <TextArea
              rows={4}
              placeholder={t('marketing.workflowBuilder.enterDescription')}
            />
          </Form.Item>

          <Divider />
          <Title level={5}>{t('marketing.workflowBuilder.nodeConfig')}</Title>
          <Text type="secondary">
            {selectedNode?.type === 'trigger' && t('marketing.workflowBuilder.triggerConfigHint')}
            {selectedNode?.type === 'action' && t('marketing.workflowBuilder.actionConfigHint')}
            {selectedNode?.type === 'condition' && t('marketing.workflowBuilder.conditionConfigHint')}
            {selectedNode?.type === 'end' && t('marketing.workflowBuilder.endConfigHint')}
          </Text>
        </Form>
      </Drawer>
    </div>
  );
};

export default WorkflowBuilder;