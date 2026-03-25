/**
 * 工作流编辑器
 * 支持跨对象自动化的工作流编辑器
 */
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Button,
  Space,
  Typography,
  Input,
  Select,
  Divider,
  Drawer,
  Form,
  InputNumber,
  Tag,
  Tooltip,
  message,
  Modal,
  Spin,
} from 'antd';
import {
  ArrowLeftOutlined,
  SaveOutlined,
  PlayCircleOutlined,
  HistoryOutlined,
  PlusOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  ThunderboltOutlined,
  EditOutlined,
  BranchesOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';
import { useWorkflowsStore } from '../../store/workflows';
import { useCustomObjectsStore } from '../../store/customObjects';
import {
  Workflow,
  WorkflowNode,
  NodeType,
  TriggerType,
  ActionType,
  TriggerConfig,
  ConditionConfig,
  ActionConfig,
  DelayConfig,
  ConditionOperator,
} from '../../types/workflow';
import { triggerTypeOptions, actionTypeOptions, conditionOperatorOptions } from '../../mock/workflowData';

const { Title, Text } = Typography;

// 节点类型配置
const nodeTypeConfig: Record<NodeType, { color: string; bgColor: string; icon: React.ReactNode }> = {
  trigger: { color: '#52c41a', bgColor: '#f6ffed', icon: <PlayCircleOutlined /> },
  condition: { color: '#faad14', bgColor: '#fffbe6', icon: <BranchesOutlined /> },
  action: { color: '#1890ff', bgColor: '#e6f7ff', icon: <ThunderboltOutlined /> },
  delay: { color: '#8c8c8c', bgColor: '#fafafa', icon: <ClockCircleOutlined /> },
};

// 节点组件
const WorkflowNodeComponent: React.FC<{
  node: WorkflowNode;
  isSelected: boolean;
  onClick: () => void;
  onAddAfter?: () => void;
  hasOutgoing: boolean;
}> = ({ node, isSelected, onClick, onAddAfter, hasOutgoing }) => {
  const config = nodeTypeConfig[node.type];
  const isTrigger = node.type === 'trigger';
  
  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* 节点主体 */}
      <div
        onClick={onClick}
        style={{
          width: 220,
          padding: '12px 16px',
          borderRadius: 8,
          border: `2px solid ${isSelected ? '#1890ff' : config.color}`,
          background: config.bgColor,
          cursor: 'pointer',
          transition: 'all 0.2s',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: config.color, fontSize: 16 }}>{config.icon}</span>
          <Text strong style={{ fontSize: 13 }}>{node.name}</Text>
        </div>
        {node.description && (
          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 4 }}>
            {node.description}
          </Text>
        )}
        
        {/* 选中指示器 */}
        {isSelected && (
          <div style={{
            position: 'absolute',
            top: -4,
            right: -4,
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: '#1890ff',
            border: '2px solid #fff',
          }} />
        )}
      </div>
      
      {/* 下方添加按钮 */}
      {!hasOutgoing && node.type !== 'action' && onAddAfter && (
        <Button
          type="dashed"
          shape="circle"
          size="small"
          icon={<PlusOutlined />}
          onClick={(e) => { e.stopPropagation(); onAddAfter(); }}
          style={{ marginTop: 8 }}
        />
      )}
    </div>
  );
};

// 连线组件
const WorkflowEdgeComponent: React.FC<{
  edge: { id: string; source: string; target: string; label?: string };
  type?: 'default' | 'true' | 'false';
}> = ({ edge, type = 'default' }) => {
  const color = type === 'true' ? '#52c41a' : type === 'false' ? '#ff4d4f' : '#d9d9d9';
  
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      padding: '8px 0',
    }}>
      {edge.label && (
        <Tag color={color} style={{ marginBottom: 4, fontSize: 11 }}>
          {edge.label}
        </Tag>
      )}
      <div style={{
        width: 2,
        height: 40,
        background: `linear-gradient(to bottom, ${color}, ${color}80)`,
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          bottom: -6,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderTop: `8px solid ${color}`,
        }} />
      </div>
    </div>
  );
};

// 状态颜色映射
const statusColorMap: Record<string, string> = {
  active: 'success',
  inactive: 'default',
  draft: 'warning',
};

// 主编辑器组件
const WorkflowEditor: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { workflowId } = useParams<{ workflowId?: string }>();
  const actualWorkflowId = workflowId || 'new';
  
  const {
    getWorkflowById,
    createWorkflow,
    updateWorkflow,
    publishWorkflow,
  } = useWorkflowsStore();
  
  const { objects, loadObjects, getProperties } = useCustomObjectsStore();
  
  // 当前工作流状态
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // 加载对象列表
  useEffect(() => {
    loadObjects();
  }, [loadObjects]);
  
  // 加载工作流
  useEffect(() => {
    if (actualWorkflowId === 'new') {
      // 新建工作流 - 默认选择第一个对象
      const defaultObjectId = objects[0]?.id || '';
      const newWorkflow: Workflow = {
        id: 'new',
        objectId: defaultObjectId,
        name: t('workflow.untitled', 'Untitled Workflow'),
        description: '',
        status: 'draft',
        trigger: { type: 'record_created', objectId: defaultObjectId },
        nodes: [
          {
            id: 'trigger_default',
            type: 'trigger',
            name: t('workflow.triggerNode', 'Trigger'),
            position: { x: 200, y: 0 },
            config: { type: 'record_created', objectId: defaultObjectId },
          },
        ],
        edges: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'current_user',
        runCount: 0,
        successCount: 0,
        failedCount: 0,
      };
      setWorkflow(newWorkflow);
      setName(newWorkflow.name);
      setDescription(newWorkflow.description);
    } else {
      const wf = getWorkflowById(actualWorkflowId);
      if (wf) {
        setWorkflow(wf);
        setName(wf.name);
        setDescription(wf.description);
      }
    }
  }, [actualWorkflowId, getWorkflowById, t, objects]);
  
  // 获取对象名称
  const getObjectName = (objectId: string) => {
    const obj = objects.find(o => o.id === objectId || o.name === objectId);
    return obj?.pluralName || obj?.name || objectId;
  };
  
  // 获取对象的字段列表
  const getObjectFields = (objectId: string) => {
    return getProperties(objectId) || [];
  };
  
  // 选中的节点
  const selectedNode = useMemo(() => {
    return workflow?.nodes.find(n => n.id === selectedNodeId) || null;
  }, [workflow, selectedNodeId]);
  
  // 处理节点点击
  const handleNodeClick = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
    setDrawerOpen(true);
  }, []);
  
  // 保存工作流
  const handleSave = useCallback(async () => {
    if (!workflow || !name.trim()) {
      message.error(t('workflow.nameRequired', 'Workflow name is required'));
      return;
    }
    
    setSaving(true);
    try {
      if (workflow.id === 'new') {
        const newWf = createWorkflow({
          ...workflow,
          name: name.trim(),
          description,
        });
        message.success(t('common.saveSuccess', 'Saved successfully'));
        navigate(`/automation/workflows/${newWf.id}/edit`);
      } else {
        updateWorkflow(workflow.id, {
          name: name.trim(),
          description,
          nodes: workflow.nodes,
          edges: workflow.edges,
        });
        message.success(t('common.saveSuccess', 'Saved successfully'));
      }
    } finally {
      setSaving(false);
    }
  }, [workflow, name, description, createWorkflow, updateWorkflow, navigate, t]);
  
  // 发布工作流
  const handlePublish = useCallback(() => {
    if (!workflow || workflow.id === 'new') {
      message.warning(t('workflow.saveFirst', 'Please save the workflow first'));
      return;
    }
    
    Modal.confirm({
      title: t('workflow.publishConfirm.title', 'Publish Workflow'),
      content: t('workflow.publishConfirm.content', 'Are you sure you want to publish this workflow?'),
      okText: t('workflow.publish', 'Publish'),
      onOk: () => {
        publishWorkflow(workflow.id);
        message.success(t('workflow.messages.published', 'Workflow published successfully'));
        navigate('/automation/workflows');
      },
    });
  }, [workflow, publishWorkflow, navigate, t]);
  
  // 更新节点配置
  const handleUpdateNodeConfig = useCallback((nodeId: string, config: any) => {
    if (!workflow) return;
    
    const updatedNodes = workflow.nodes.map(n =>
      n.id === nodeId ? { ...n, config } : n
    );
    setWorkflow({ ...workflow, nodes: updatedNodes });
  }, [workflow]);
  
  // 更新触发对象
  const handleUpdateTriggerObject = useCallback((objectId: string) => {
    if (!workflow) return;
    
    setWorkflow({
      ...workflow,
      objectId,
      trigger: { ...workflow.trigger, objectId },
      nodes: workflow.nodes.map(n =>
        n.type === 'trigger' 
          ? { ...n, config: { ...n.config, objectId } }
          : n
      ),
    });
  }, [workflow]);
  
  // 添加新节点
  const handleAddNode = useCallback((type: NodeType, afterNodeId?: string) => {
    if (!workflow) return;
    
    const newNode: WorkflowNode = {
      id: `node_${Date.now()}`,
      type,
      name: type === 'action' ? t('workflow.newAction', 'New Action') :
            type === 'condition' ? t('workflow.newCondition', 'New Condition') :
            t('workflow.newDelay', 'Wait'),
      position: { x: 200, y: workflow.nodes.length * 120 + 120 },
      config: type === 'action' 
        ? { type: 'update_field' as const, fieldId: '', updateType: 'set' as const, value: '', targetObjectId: workflow.objectId }
        : type === 'condition'
        ? { type: 'simple' as const, condition: { id: 'cond_1', field: '', operator: 'equals' as ConditionOperator, value: '' } }
        : { type: 'delay' as const, delayType: 'days' as const, value: 1 },
    };
    
    const newNodes = [...workflow.nodes, newNode];
    let newEdges = [...workflow.edges];
    
    if (afterNodeId) {
      const existingEdgeIndex = newEdges.findIndex(e => e.source === afterNodeId);
      if (existingEdgeIndex >= 0) {
        const oldTarget = newEdges[existingEdgeIndex].target;
        newEdges[existingEdgeIndex] = {
          ...newEdges[existingEdgeIndex],
          target: newNode.id,
        };
        newEdges.push({
          id: `edge_${Date.now()}`,
          source: newNode.id,
          target: oldTarget,
        });
      } else {
        newEdges.push({
          id: `edge_${Date.now()}`,
          source: afterNodeId,
          target: newNode.id,
        });
      }
    }
    
    setWorkflow({
      ...workflow,
      nodes: newNodes,
      edges: newEdges,
    });
  }, [workflow, t]);
  
  // 删除节点
  const handleDeleteNode = useCallback((nodeId: string) => {
    if (!workflow) return;
    
    const node = workflow.nodes.find(n => n.id === nodeId);
    if (node?.type === 'trigger') {
      message.warning(t('workflow.cannotDeleteTrigger', 'Cannot delete trigger node'));
      return;
    }
    
    setWorkflow({
      ...workflow,
      nodes: workflow.nodes.filter(n => n.id !== nodeId),
      edges: workflow.edges.filter(e => e.source !== nodeId && e.target !== nodeId),
    });
    setSelectedNodeId(null);
    setDrawerOpen(false);
  }, [workflow, t]);
  
  // 渲染节点配置面板
  const renderNodeConfigPanel = () => {
    if (!selectedNode || !workflow) return null;
    
    return (
      <div style={{ padding: 16 }}>
        <Title level={5}>{selectedNode.name}</Title>
        <Text type="secondary">{t(`workflow.nodeTypes.${selectedNode.type}`, selectedNode.type)}</Text>
        
        <Divider />
        
        {/* 名称输入 */}
        <Form.Item label={t('workflow.nodeName', 'Node Name')}>
          <Input
            value={selectedNode.name}
            onChange={(e) => {
              const updatedNodes = workflow.nodes.map(n =>
                n.id === selectedNode.id ? { ...n, name: e.target.value } : n
              );
              setWorkflow({ ...workflow, nodes: updatedNodes });
            }}
          />
        </Form.Item>
        
        <Form.Item label={t('workflow.nodeDescription', 'Description')}>
          <Input.TextArea
            value={selectedNode.description || ''}
            onChange={(e) => {
              const updatedNodes = workflow.nodes.map(n =>
                n.id === selectedNode.id ? { ...n, description: e.target.value } : n
              );
              setWorkflow({ ...workflow, nodes: updatedNodes });
            }}
            rows={2}
          />
        </Form.Item>
        
        {/* 触发器配置 */}
        {selectedNode.type === 'trigger' && (
          <>
            <Form.Item label={t('workflow.triggerObject', 'Trigger Object')}>
              <Select
                value={workflow.objectId}
                onChange={handleUpdateTriggerObject}
                options={objects.map(obj => ({
                  value: obj.id,
                  label: (
                    <Space>
                      <DatabaseOutlined />
                      {obj.pluralName || obj.name}
                    </Space>
                  ),
                }))}
              />
            </Form.Item>
            <TriggerConfigForm
              config={selectedNode.config as TriggerConfig}
              onChange={(config) => handleUpdateNodeConfig(selectedNode.id, config)}
              objectId={workflow.objectId}
              objectFields={getObjectFields(workflow.objectId)}
            />
          </>
        )}
        
        {/* 条件配置 */}
        {selectedNode.type === 'condition' && (
          <ConditionConfigForm
            config={selectedNode.config as ConditionConfig}
            onChange={(config) => handleUpdateNodeConfig(selectedNode.id, config)}
            objectId={workflow.objectId}
            objectFields={getObjectFields(workflow.objectId)}
          />
        )}
        
        {/* 动作配置 */}
        {selectedNode.type === 'action' && (
          <ActionConfigForm
            config={selectedNode.config as ActionConfig}
            onChange={(config) => handleUpdateNodeConfig(selectedNode.id, config)}
            objects={objects}
            defaultObjectId={workflow.objectId}
          />
        )}
        
        {/* 延迟配置 */}
        {selectedNode.type === 'delay' && (
          <DelayConfigForm
            config={selectedNode.config as DelayConfig}
            onChange={(config) => handleUpdateNodeConfig(selectedNode.id, config)}
          />
        )}
        
        <Divider />
        
        {/* 删除按钮 */}
        {selectedNode.type !== 'trigger' && (
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteNode(selectedNode.id)}
            block
          >
            {t('workflow.deleteNode', 'Delete Node')}
          </Button>
        )}
      </div>
    );
  };
  
  // 构建节点树（移到 early return 之前）
  const nodeMap = useMemo(() => {
    if (!workflow) return {};
    const map: Record<string, { node: WorkflowNode; next: string | null }> = {};
    workflow.nodes.forEach(n => {
      map[n.id] = { node: n, next: null };
    });
    workflow.edges.forEach(e => {
      if (map[e.source]) {
        map[e.source].next = e.target;
      }
    });
    return map;
  }, [workflow]);
  
  // 获取节点顺序（移到 early return 之前）
  const orderedNodes = useMemo(() => {
    if (!workflow) return [];
    const result: WorkflowNode[] = [];
    const visited = new Set<string>();
    
    const trigger = workflow.nodes.find(n => n.type === 'trigger');
    if (!trigger) return workflow.nodes;
    
    const traverse = (nodeId: string) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);
      
      const item = nodeMap[nodeId];
      if (item) {
        result.push(item.node);
        if (item.next) {
          traverse(item.next);
        }
      }
    };
    
    traverse(trigger.id);
    
    workflow.nodes.forEach(n => {
      if (!visited.has(n.id)) {
        result.push(n);
      }
    });
    
    return result;
  }, [workflow, nodeMap]);
  
  if (!workflow) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Spin size="large" />
      </div>
    );
  }
  
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 工具栏 */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/automation/workflows')}>
              {t('common.back', 'Back')}
            </Button>
            <Divider type="vertical" />
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: 250 }}
              placeholder={t('workflow.namePlaceholder', 'Workflow name')}
            />
            <Tag color={statusColorMap[workflow.status]}>
              {t(`workflow.status.${workflow.status}`, workflow.status)}
            </Tag>
            {workflow.objectId && (
              <Tag icon={<DatabaseOutlined />} color="purple">
                {getObjectName(workflow.objectId)}
              </Tag>
            )}
          </Space>
          
          <Space>
            <Button icon={<SaveOutlined />} onClick={handleSave} loading={saving}>
              {t('common.save', 'Save')}
            </Button>
            <Button 
              type="primary" 
              icon={<PlayCircleOutlined />} 
              onClick={handlePublish}
              disabled={workflow.id === 'new'}
            >
              {t('workflow.publish', 'Publish')}
            </Button>
            {workflow.id !== 'new' && (
              <Button icon={<HistoryOutlined />} onClick={() => navigate(`/automation/workflows/${workflow.id}/logs`)}>
                {t('workflow.logs.title', 'Logs')}
              </Button>
            )}
          </Space>
        </div>
      </Card>
      
      {/* 编辑区域 */}
      <div style={{ flex: 1, display: 'flex', gap: 16, overflow: 'hidden' }}>
        {/* 画布区域 */}
        <Card 
          style={{ flex: 1, overflow: 'auto' }} 
          styles={{ body: { padding: 24, minHeight: '100%' } }}
        >
          {/* 节点工具栏 */}
          <div style={{ marginBottom: 24, padding: 12, background: '#fafafa', borderRadius: 8 }}>
            <Text strong>{t('workflow.addNode', 'Add Node')}:</Text>
            <Space style={{ marginLeft: 16 }}>
              <Button 
                size="small" 
                icon={<ThunderboltOutlined />}
                onClick={() => handleAddNode('action')}
              >
                {t('workflow.nodeTypes.action', 'Action')}
              </Button>
              <Button 
                size="small" 
                icon={<BranchesOutlined />}
                onClick={() => handleAddNode('condition')}
              >
                {t('workflow.nodeTypes.condition', 'Condition')}
              </Button>
              <Button 
                size="small" 
                icon={<ClockCircleOutlined />}
                onClick={() => handleAddNode('delay')}
              >
                {t('workflow.nodeTypes.delay', 'Delay')}
              </Button>
            </Space>
          </div>
          
          {/* 流程图 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
            {orderedNodes.map((node) => {
              const edge = workflow.edges.find(e => e.source === node.id);
              const hasOutgoing = !!edge;
              
              return (
                <React.Fragment key={node.id}>
                  <WorkflowNodeComponent
                    node={node}
                    isSelected={selectedNodeId === node.id}
                    onClick={() => handleNodeClick(node.id)}
                    onAddAfter={() => handleAddNode('action', node.id)}
                    hasOutgoing={hasOutgoing}
                  />
                  {edge && (
                    <WorkflowEdgeComponent
                      edge={edge}
                      type={edge.type as any}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </Card>
      </div>
      
      {/* 节点配置抽屉 */}
      <Drawer
        title={t('workflow.nodeConfig', 'Node Configuration')}
        placement="right"
        width={400}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedNodeId(null);
        }}
      >
        {renderNodeConfigPanel()}
      </Drawer>
    </div>
  );
};

// 触发器配置表单
const TriggerConfigForm: React.FC<{
  config: TriggerConfig;
  onChange: (config: TriggerConfig) => void;
  objectId?: string;
  objectFields: any[];
}> = ({ config, onChange, objectId, objectFields }) => {
  const { t } = useTranslation();
  
  return (
    <>
      <Form.Item label={t('workflow.triggerType', 'Trigger Type')}>
        <Select
          value={config.type}
          onChange={(value) => onChange({ ...config, type: value as TriggerType })}
          options={triggerTypeOptions.map(opt => ({
            value: opt.value,
            label: (
              <Space>
                {opt.icon && <span>{opt.icon}</span>}
                {opt.label}
              </Space>
            ),
          }))}
        />
      </Form.Item>
      
      {config.type === 'no_activity' && (
        <Form.Item label={t('workflow.inactivityDays', 'Inactivity Days')}>
          <InputNumber
            value={config.inactivityDays || 30}
            onChange={(value) => onChange({ ...config, inactivityDays: value || 30 })}
            min={1}
            max={365}
          />
        </Form.Item>
      )}
      
      {config.type === 'scheduled' && (
        <Form.Item label={t('workflow.cronExpression', 'Schedule')}>
          <Select
            value={config.cronExpression || '0 9 * * *'}
            onChange={(value) => onChange({ ...config, cronExpression: value })}
            options={[
              { value: '0 9 * * *', label: t('workflow.schedule.daily9', 'Daily at 9:00 AM') },
              { value: '0 9 * * 1', label: t('workflow.schedule.weekly', 'Weekly on Monday') },
              { value: '0 9 1 * *', label: t('workflow.schedule.monthly', 'Monthly on 1st') },
            ]}
          />
        </Form.Item>
      )}
      
      {config.type === 'date_reached' && (
        <>
          <Form.Item label={t('workflow.dateField', 'Date Field')}>
            <Select
              value={config.dateField}
              onChange={(value) => onChange({ ...config, dateField: value })}
              options={[
                { value: 'endDate', label: t('workflow.dateFields.endDate', 'End Date') },
                { value: 'birthday', label: t('workflow.dateFields.birthday', 'Birthday') },
                { value: 'createdAt', label: t('workflow.dateFields.createdAt', 'Created Date') },
              ]}
            />
          </Form.Item>
          <Form.Item label={t('workflow.offsetDays', 'Days Before/After')}>
            <InputNumber
              value={config.offsetDays || 0}
              onChange={(value) => onChange({ ...config, offsetDays: value || 0 })}
            />
          </Form.Item>
        </>
      )}
    </>
  );
};

// 条件配置表单
const ConditionConfigForm: React.FC<{
  config: ConditionConfig;
  onChange: (config: ConditionConfig) => void;
  objectId?: string;
  objectFields: any[];
}> = ({ config, onChange, objectId, objectFields }) => {
  const { t } = useTranslation();
  
  const condition = config.condition;
  
  return (
    <>
      <Form.Item label={t('workflow.condition.field', 'Field')}>
        <Select
          value={condition?.field}
          onChange={(value) => onChange({
            ...config,
            condition: { ...condition!, field: value },
          })}
          options={[
            { value: 'status', label: t('workflow.fields.status', 'Status') },
            { value: 'level', label: t('workflow.fields.level', 'Level') },
            { value: 'amount', label: t('workflow.fields.amount', 'Amount') },
            { value: 'stage', label: t('workflow.fields.stage', 'Stage') },
          ]}
        />
      </Form.Item>
      
      <Form.Item label={t('workflow.condition.operator', 'Operator')}>
        <Select
          value={condition?.operator}
          onChange={(value) => onChange({
            ...config,
            condition: { ...condition!, operator: value as ConditionOperator },
          })}
          options={conditionOperatorOptions}
        />
      </Form.Item>
      
      {condition?.operator !== 'is_empty' && condition?.operator !== 'is_not_empty' && (
        <Form.Item label={t('workflow.condition.value', 'Value')}>
          <Input
            value={condition?.value || ''}
            onChange={(e) => onChange({
              ...config,
              condition: { ...condition!, value: e.target.value },
            })}
          />
        </Form.Item>
      )}
    </>
  );
};

// 动作配置表单 - 支持跨对象操作
const ActionConfigForm: React.FC<{
  config: ActionConfig;
  onChange: (config: ActionConfig) => void;
  objects: any[];
  defaultObjectId: string;
}> = ({ config, onChange, objects, defaultObjectId }) => {
  const { t } = useTranslation();
  
  const targetObjectId = (config as any).targetObjectId || defaultObjectId;
  
  return (
    <>
      <Form.Item label={t('workflow.actionType', 'Action Type')}>
        <Select
          value={config.type}
          onChange={(value) => onChange({ type: value as ActionType, targetObjectId } as ActionConfig)}
          options={actionTypeOptions.map(opt => ({
            value: opt.value,
            label: (
              <Space>
                {opt.icon}
                {opt.label}
              </Space>
            ),
          }))}
          optionFilterProp="label"
        />
      </Form.Item>
      
      {/* 目标对象选择 - 支持跨对象操作 */}
      <Form.Item label={t('workflow.targetObject', 'Target Object')}>
        <Select
          value={targetObjectId}
          onChange={(value) => onChange({ ...config, targetObjectId: value } as ActionConfig)}
          options={objects.map(obj => ({
            value: obj.id,
            label: (
              <Space>
                <DatabaseOutlined />
                {obj.pluralName || obj.name}
              </Space>
            ),
          }))}
        />
      </Form.Item>
      
      {config.type === 'update_field' && (
        <>
          <Form.Item label={t('workflow.updateField.field', 'Field')}>
            <Select
              value={(config as any).fieldId}
              onChange={(value) => onChange({ ...config, fieldId: value } as ActionConfig)}
              options={[
                { value: 'status', label: t('workflow.fields.status', 'Status') },
                { value: 'level', label: t('workflow.fields.level', 'Level') },
                { value: 'tags', label: t('workflow.fields.tags', 'Tags') },
              ]}
            />
          </Form.Item>
          <Form.Item label={t('workflow.updateField.value', 'Value')}>
            <Input
              value={(config as any).value || ''}
              onChange={(e) => onChange({ ...config, value: e.target.value } as ActionConfig)}
            />
          </Form.Item>
        </>
      )}
      
      {config.type === 'send_notification' && (
        <>
          <Form.Item label={t('workflow.notification.title', 'Title')}>
            <Input
              value={(config as any).title || ''}
              onChange={(e) => onChange({ ...config, title: e.target.value } as ActionConfig)}
            />
          </Form.Item>
          <Form.Item label={t('workflow.notification.content', 'Content')}>
            <Input.TextArea
              value={(config as any).content || ''}
              onChange={(e) => onChange({ ...config, content: e.target.value } as ActionConfig)}
              rows={3}
            />
          </Form.Item>
          <Form.Item label={t('workflow.notification.priority', 'Priority')}>
            <Select
              value={(config as any).priority || 'normal'}
              onChange={(value) => onChange({ ...config, priority: value } as ActionConfig)}
              options={[
                { value: 'normal', label: t('workflow.priority.normal', 'Normal') },
                { value: 'high', label: t('workflow.priority.high', 'High') },
                { value: 'urgent', label: t('workflow.priority.urgent', 'Urgent') },
              ]}
            />
          </Form.Item>
        </>
      )}
      
      {config.type === 'send_email' && (
        <>
          <Form.Item label={t('workflow.email.subject', 'Subject')}>
            <Input
              value={(config as any).subject || ''}
              onChange={(e) => onChange({ ...config, subject: e.target.value } as ActionConfig)}
            />
          </Form.Item>
          <Form.Item label={t('workflow.email.body', 'Body')}>
            <Input.TextArea
              value={(config as any).body || ''}
              onChange={(e) => onChange({ ...config, body: e.target.value } as ActionConfig)}
              rows={5}
            />
          </Form.Item>
        </>
      )}
      
      {config.type === 'create_task' && (
        <>
          <Form.Item label={t('workflow.task.title', 'Task Title')}>
            <Input
              value={(config as any).title || ''}
              onChange={(e) => onChange({ ...config, title: e.target.value } as ActionConfig)}
            />
          </Form.Item>
          <Form.Item label={t('workflow.task.priority', 'Priority')}>
            <Select
              value={(config as any).priority || 'medium'}
              onChange={(value) => onChange({ ...config, priority: value } as ActionConfig)}
              options={[
                { value: 'low', label: t('workflow.priority.low', 'Low') },
                { value: 'medium', label: t('workflow.priority.medium', 'Medium') },
                { value: 'high', label: t('workflow.priority.high', 'High') },
                { value: 'urgent', label: t('workflow.priority.urgent', 'Urgent') },
              ]}
            />
          </Form.Item>
        </>
      )}
      
      {config.type === 'delay' && (
        <>
          <Form.Item label={t('workflow.delay.type', 'Delay Type')}>
            <Select
              value={(config as any).delayType || 'days'}
              onChange={(value) => onChange({ ...config, delayType: value } as ActionConfig)}
              options={[
                { value: 'minutes', label: t('workflow.delay.minutes', 'Minutes') },
                { value: 'hours', label: t('workflow.delay.hours', 'Hours') },
                { value: 'days', label: t('workflow.delay.days', 'Days') },
              ]}
            />
          </Form.Item>
          <Form.Item label={t('workflow.delay.value', 'Value')}>
            <InputNumber
              value={(config as any).value || 1}
              onChange={(value) => onChange({ ...config, value: value || 1 } as ActionConfig)}
              min={1}
            />
          </Form.Item>
        </>
      )}
    </>
  );
};

// 延迟配置表单
const DelayConfigForm: React.FC<{
  config: DelayConfig;
  onChange: (config: DelayConfig) => void;
}> = ({ config, onChange }) => {
  const { t } = useTranslation();
  
  return (
    <>
      <Form.Item label={t('workflow.delay.type', 'Delay Type')}>
        <Select
          value={config.delayType || 'days'}
          onChange={(value) => onChange({ ...config, delayType: value as any })}
          options={[
            { value: 'minutes', label: t('workflow.delay.minutes', 'Minutes') },
            { value: 'hours', label: t('workflow.delay.hours', 'Hours') },
            { value: 'days', label: t('workflow.delay.days', 'Days') },
          ]}
        />
      </Form.Item>
      <Form.Item label={t('workflow.delay.value', 'Value')}>
        <InputNumber
          value={config.value || 1}
          onChange={(value) => onChange({ ...config, value: value || 1 })}
          min={1}
        />
      </Form.Item>
    </>
  );
};

export default WorkflowEditor;