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
import { Workflow, WorkflowNode, WorkflowEdge, TriggerType, ActionType } from '../../types/marketing';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface WorkflowBuilderProps {
  workflow?: Workflow;
  onSave?: (workflow: Workflow) => void;
  readOnly?: boolean;
}

/** 节点类型配置 */
const nodeTypeConfig = {
  trigger: { color: 'blue', icon: PlayCircleOutlined, label: '触发器' },
  action: { color: 'green', icon: NodeIndexOutlined, label: '动作' },
  condition: { color: 'orange', icon: BranchesOutlined, label: '条件' },
  end: { color: 'gray', icon: undefined, label: '结束' },
};

/** 触发类型选项 */
const triggerTypeOptions = [
  { label: '时间触发', value: TriggerType.TIME_BASED },
  { label: '行为触发', value: TriggerType.BEHAVIOR_BASED },
  { label: '属性触发', value: TriggerType.ATTRIBUTE_BASED },
  { label: '事件触发', value: TriggerType.EVENT_BASED },
];

/** 动作类型选项 */
const actionTypeOptions = [
  { label: '发送邮件', value: ActionType.SEND_EMAIL },
  { label: '发送短信', value: ActionType.SEND_SMS },
  { label: '创建任务', value: ActionType.CREATE_TASK },
  { label: '更新字段', value: ActionType.UPDATE_FIELD },
  { label: '加入列表', value: ActionType.ADD_TO_LIST },
  { label: '移出列表', value: ActionType.REMOVE_FROM_LIST },
  { label: '通知用户', value: ActionType.NOTIFY_USER },
];

/**
 * 工作流构建器组件
 */
export const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({
  workflow,
  onSave,
  readOnly = false,
}) => {
  const [nodes, setNodes] = useState<WorkflowNode[]>(workflow?.nodes || []);
  const [edges, setEdges] = useState<WorkflowEdge[]>(workflow?.edges || []);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [editDrawerVisible, setEditDrawerVisible] = useState(false);
  const [form] = Form.useForm();
  const canvasRef = useRef<HTMLDivElement>(null);

  /** 添加新节点 */
  const handleAddNode = (type: 'trigger' | 'action' | 'condition') => {
    if (readOnly) {
      message.warning('只读模式下无法添加节点');
      return;
    }

    const newNode: WorkflowNode = {
      id: `node_${Date.now()}`,
      type,
      name: `新${nodeTypeConfig[type].label}`,
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
        message.success('节点已保存');
      }
    });
  };

  /** 删除节点 */
  const handleDeleteNode = (nodeId: string) => {
    if (readOnly) {
      message.warning('只读模式下无法删除节点');
      return;
    }

    setNodes(nodes.filter((n) => n.id !== nodeId));
    setEdges(edges.filter((e) => e.source !== nodeId && e.target !== nodeId));
    message.success('节点已删除');
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
    message.success('工作流已保存');
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
        title="工作流设计器"
        extra={
          !readOnly && (
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => handleAddNode('trigger')}
              >
                添加触发器
              </Button>
              <Button
                icon={<PlusOutlined />}
                onClick={() => handleAddNode('action')}
              >
                添加动作
              </Button>
              <Button
                icon={<PlusOutlined />}
                onClick={() => handleAddNode('condition')}
              >
                添加条件
              </Button>
              <Button type="primary" onClick={handleSaveWorkflow}>
                保存工作流
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
              <div>暂无节点，点击上方按钮添加</div>
            </div>
          )}
        </div>
      </Card>

      {/* 节点编辑抽屉 */}
      <Drawer
        title="编辑节点"
        placement="right"
        width={400}
        open={editDrawerVisible}
        onClose={() => {
          setEditDrawerVisible(false);
          setSelectedNode(null);
        }}
        extra={
          <Space>
            <Button onClick={() => setEditDrawerVisible(false)}>取消</Button>
            <Button type="primary" onClick={handleSaveNode}>
              保存
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="节点名称"
            name="name"
            rules={[{ required: true, message: '请输入节点名称' }]}
          >
            <Input placeholder="请输入节点名称" />
          </Form.Item>

          {selectedNode?.type === 'trigger' && (
            <Form.Item
              label="触发类型"
              name="triggerType"
              rules={[{ required: true, message: '请选择触发类型' }]}
            >
              <Select options={triggerTypeOptions} />
            </Form.Item>
          )}

          {selectedNode?.type === 'action' && (
            <Form.Item
              label="动作类型"
              name="actionType"
              rules={[{ required: true, message: '请选择动作类型' }]}
            >
              <Select options={actionTypeOptions} />
            </Form.Item>
          )}

          <Form.Item label="描述" name="description">
            <TextArea
              rows={4}
              placeholder="请输入节点描述（可选）"
            />
          </Form.Item>

          <Divider />
          <Title level={5}>节点配置</Title>
          <Text type="secondary">
            {selectedNode?.type === 'trigger' && '配置触发条件和时间设置'}
            {selectedNode?.type === 'action' && '配置动作执行参数和目标'}
            {selectedNode?.type === 'condition' && '配置判断条件和分支逻辑'}
            {selectedNode?.type === 'end' && '流程结束节点，无需配置'}
          </Text>
        </Form>
      </Drawer>
    </div>
  );
};

export default WorkflowBuilder;
