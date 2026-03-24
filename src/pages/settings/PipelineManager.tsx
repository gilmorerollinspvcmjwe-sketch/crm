/**
 * Pipeline Manager - Manage Pipelines and Stages
 * 
 * Features:
 * - Pipeline list (can have multiple pipelines)
 * - Stage configuration for each pipeline
 * - Drag to sort stages
 * - Stage properties: name/color/probability/required fields
 */
import React, { useState, useMemo } from 'react';
import {
  Card,
  Button,
  Space,
  Typography,
  Avatar,
  Divider,
  Tooltip,
  Tag,
  Table,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Switch,
  ColorPicker,
  message,
  Empty,
  Row,
  Col,
  Dropdown,
  Menu,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SettingOutlined,
  HolderOutlined,
  CopyOutlined,
  CheckOutlined,
  DownOutlined,
  MoreOutlined,
  BranchesOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { colors } from '../../styles/tokens';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const { Text, Title } = Typography;

/** Stage type */
export type StageType = 'normal' | 'won' | 'lost';

/** Stage configuration */
export interface StageConfig {
  id: string;
  name: string;
  color: string;
  probability: number;
  type: StageType;
  requiredFields: string[];
  hint?: string;
  order: number;
}

/** Pipeline configuration */
export interface PipelineConfig {
  id: string;
  name: string;
  objectType: string;
  isDefault: boolean;
  stages: StageConfig[];
  createdAt: string;
  updatedAt: string;
}

/** Mock pipelines data */
const MOCK_PIPELINES: PipelineConfig[] = [
  {
    id: 'pipeline-1',
    name: 'Standard Sales Pipeline',
    objectType: 'opportunity',
    isDefault: true,
    stages: [
      { id: 'stage-1', name: 'Lead Confirmation', color: '#1565C0', probability: 10, type: 'normal', requiredFields: [], order: 0 },
      { id: 'stage-2', name: 'Initial Contact', color: '#0277BD', probability: 20, type: 'normal', requiredFields: [], order: 1 },
      { id: 'stage-3', name: 'Requirement Confirmation', color: '#00838F', probability: 40, type: 'normal', requiredFields: ['budget'], order: 2 },
      { id: 'stage-4', name: 'Proposal/Quotation', color: '#2E7D32', probability: 60, type: 'normal', requiredFields: ['proposal'], order: 3 },
      { id: 'stage-5', name: 'Negotiation/Approval', color: '#EF6C00', probability: 80, type: 'normal', requiredFields: [], order: 4 },
      { id: 'stage-6', name: 'Closed Won', color: '#1B5E20', probability: 100, type: 'won', requiredFields: [], order: 5 },
      { id: 'stage-7', name: 'Closed Lost', color: '#C62828', probability: 0, type: 'lost', requiredFields: ['lostReason'], order: 6 },
    ],
    createdAt: '2026-01-01',
    updatedAt: '2026-03-15',
  },
  {
    id: 'pipeline-2',
    name: 'Enterprise Sales Pipeline',
    objectType: 'opportunity',
    isDefault: false,
    stages: [
      { id: 'stage-8', name: 'Lead Qualification', color: '#1565C0', probability: 5, type: 'normal', requiredFields: [], order: 0 },
      { id: 'stage-9', name: 'Discovery', color: '#0277BD', probability: 15, type: 'normal', requiredFields: [], order: 1 },
      { id: 'stage-10', name: 'Solution Design', color: '#00838F', probability: 30, type: 'normal', requiredFields: [], order: 2 },
      { id: 'stage-11', name: 'Proof of Concept', color: '#2E7D32', probability: 50, type: 'normal', requiredFields: ['pocResult'], order: 3 },
      { id: 'stage-12', name: 'Contract Negotiation', color: '#EF6C00', probability: 75, type: 'normal', requiredFields: [], order: 4 },
      { id: 'stage-13', name: 'Final Approval', color: '#9C27B0', probability: 90, type: 'normal', requiredFields: [], order: 5 },
      { id: 'stage-14', name: 'Closed Won', color: '#1B5E20', probability: 100, type: 'won', requiredFields: [], order: 6 },
      { id: 'stage-15', name: 'Closed Lost', color: '#C62828', probability: 0, type: 'lost', requiredFields: ['lostReason'], order: 7 },
    ],
    createdAt: '2026-02-15',
    updatedAt: '2026-03-10',
  },
];

/** Sortable Stage Item */
const SortableStageItem: React.FC<{
  stage: StageConfig;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ stage, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: stage.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card
        size="small"
        style={{
          marginBottom: 8,
          cursor: 'grab',
          borderLeft: `4px solid ${stage.color}`,
        }}
        styles={{ body: { padding: '12px 16px' } }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span {...listeners} style={{ cursor: 'grab' }}>
            <HolderOutlined style={{ color: colors.text.disabled }} />
          </span>
          <div style={{ flex: 1 }}>
            <Space>
              <Text strong>{stage.name}</Text>
              <Tag style={{ background: stage.color, color: '#fff', border: 'none' }}>
                {stage.probability}%
              </Tag>
              {stage.type !== 'normal' && (
                <Tag color={stage.type === 'won' ? 'green' : 'red'}>
                  {stage.type === 'won' ? 'Won' : 'Lost'}
                </Tag>
              )}
            </Space>
            {stage.requiredFields.length > 0 && (
              <div style={{ marginTop: 4 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Required: {stage.requiredFields.join(', ')}
                </Text>
              </div>
            )}
          </div>
          <Space size={4}>
            <Button type="text" size="small" icon={<EditOutlined />} onClick={onEdit} />
            {stage.type === 'normal' && (
              <Button type="text" size="small" icon={<DeleteOutlined />} danger onClick={onDelete} />
            )}
          </Space>
        </div>
      </Card>
    </div>
  );
};

/**
 * Pipeline Manager Component
 */
export const PipelineManager: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { objectId } = useParams<{ objectId: string }>();

  const [pipelines, setPipelines] = useState<PipelineConfig[]>(MOCK_PIPELINES);
  const [selectedPipelineId, setSelectedPipelineId] = useState<string>(MOCK_PIPELINES[0].id);
  const [stageModalVisible, setStageModalVisible] = useState(false);
  const [pipelineModalVisible, setPipelineModalVisible] = useState(false);
  const [editingStage, setEditingStage] = useState<StageConfig | null>(null);
  const [editingPipeline, setEditingPipeline] = useState<PipelineConfig | null>(null);
  const [form] = Form.useForm();
  const [pipelineForm] = Form.useForm();

  // Selected pipeline
  const selectedPipeline = useMemo(() => {
    return pipelines.find(p => p.id === selectedPipelineId) || pipelines[0];
  }, [pipelines, selectedPipelineId]);

  // Drag end handler
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setPipelines(prevPipelines => {
      return prevPipelines.map(pipeline => {
        if (pipeline.id !== selectedPipelineId) return pipeline;

        const oldIndex = pipeline.stages.findIndex(s => s.id === active.id);
        const newIndex = pipeline.stages.findIndex(s => s.id === over.id);

        const newStages = arrayMove(pipeline.stages, oldIndex, newIndex).map((stage, index) => ({
          ...stage,
          order: index,
        }));

        return { ...pipeline, stages: newStages };
      });
    });
  };

  // Add/Edit stage
  const handleSaveStage = (values: any) => {
    if (editingStage) {
      // Edit
      setPipelines(prevPipelines => {
        return prevPipelines.map(pipeline => {
          if (pipeline.id !== selectedPipelineId) return pipeline;
          return {
            ...pipeline,
            stages: pipeline.stages.map(s => s.id === editingStage.id ? {
              ...s,
              ...values,
              color: values.color?.hex || values.color || s.color,
            } : s),
          };
        });
      });
      message.success(t('common.updateSuccess'));
    } else {
      // Add
      const newStage: StageConfig = {
        id: `stage-${Date.now()}`,
        name: values.name,
        color: values.color?.hex || values.color || '#1565C0',
        probability: values.probability || 0,
        type: values.type || 'normal',
        requiredFields: values.requiredFields || [],
        hint: values.hint,
        order: selectedPipeline.stages.length - 2, // Before won/lost
      };
      setPipelines(prevPipelines => {
        return prevPipelines.map(pipeline => {
          if (pipeline.id !== selectedPipelineId) return pipeline;
          // Insert before won/lost stages
          const wonLostStages = pipeline.stages.filter(s => s.type !== 'normal');
          const normalStages = [...pipeline.stages.filter(s => s.type === 'normal'), newStage];
          return {
            ...pipeline,
            stages: [...normalStages, ...wonLostStages].map((s, i) => ({ ...s, order: i })),
          };
        });
      });
      message.success(t('common.createSuccess'));
    }
    setStageModalVisible(false);
    setEditingStage(null);
    form.resetFields();
  };

  // Delete stage
  const handleDeleteStage = (stageId: string) => {
    Modal.confirm({
      title: t('common.deleteConfirm'),
      content: t('pipelineManager.deleteStageContent'),
      okType: 'danger',
      onOk: () => {
        setPipelines(prevPipelines => {
          return prevPipelines.map(pipeline => {
            if (pipeline.id !== selectedPipelineId) return pipeline;
            return {
              ...pipeline,
              stages: pipeline.stages.filter(s => s.id !== stageId),
            };
          });
        });
        message.success(t('common.deleteSuccess'));
      },
    });
  };

  // Add/Edit pipeline
  const handleSavePipeline = (values: any) => {
    if (editingPipeline) {
      // Edit
      setPipelines(prevPipelines => {
        return prevPipelines.map(pipeline => {
          if (pipeline.id !== editingPipeline.id) return pipeline;
          return { ...pipeline, ...values, updatedAt: new Date().toISOString() };
        });
      });
      message.success(t('common.updateSuccess'));
    } else {
      // Add
      const newPipeline: PipelineConfig = {
        id: `pipeline-${Date.now()}`,
        name: values.name,
        objectType: objectId || 'opportunity',
        isDefault: false,
        stages: [
          { id: `stage-${Date.now()}-1`, name: 'New Lead', color: '#1565C0', probability: 10, type: 'normal', requiredFields: [], order: 0 },
          { id: `stage-${Date.now()}-2`, name: 'Closed Won', color: '#1B5E20', probability: 100, type: 'won', requiredFields: [], order: 1 },
          { id: `stage-${Date.now()}-3`, name: 'Closed Lost', color: '#C62828', probability: 0, type: 'lost', requiredFields: ['lostReason'], order: 2 },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setPipelines([...pipelines, newPipeline]);
      setSelectedPipelineId(newPipeline.id);
      message.success(t('common.createSuccess'));
    }
    setPipelineModalVisible(false);
    setEditingPipeline(null);
    pipelineForm.resetFields();
  };

  // Delete pipeline
  const handleDeletePipeline = () => {
    if (selectedPipeline.isDefault) {
      message.warning(t('pipelineManager.cannotDeleteDefault'));
      return;
    }
    Modal.confirm({
      title: t('common.deleteConfirm'),
      content: t('pipelineManager.deletePipelineContent'),
      okType: 'danger',
      onOk: () => {
        setPipelines(pipelines.filter(p => p.id !== selectedPipelineId));
        setSelectedPipelineId(pipelines.find(p => p.id !== selectedPipelineId)?.id || pipelines[0].id);
        message.success(t('common.deleteSuccess'));
      },
    });
  };

  // Set as default
  const handleSetDefault = () => {
    setPipelines(prevPipelines => {
      return prevPipelines.map(pipeline => ({
        ...pipeline,
        isDefault: pipeline.id === selectedPipelineId,
      }));
    });
    message.success(t('pipelineManager.setDefaultSuccess'));
  };

  return (
    <div style={{ padding: 0, background: colors.background.default, minHeight: '100%' }}>

      {/* Pipeline Selector & Content */}
      <Row gutter={16}>
        {/* Pipeline List */}
        <Col span={6}>
          <Card
            size="small"
            title={t('pipelineManager.pipelineList')}
            styles={{ body: { padding: 8 } }}
          >
            {pipelines.map(pipeline => (
              <div
                key={pipeline.id}
                onClick={() => setSelectedPipelineId(pipeline.id)}
                style={{
                  padding: '12px 16px',
                  marginBottom: 8,
                  background: pipeline.id === selectedPipelineId ? colors.primarySubtle : colors.background.default,
                  borderRadius: 8,
                  cursor: 'pointer',
                  border: `1px solid ${pipeline.id === selectedPipelineId ? colors.primary : colors.border.light}`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text strong={pipeline.id === selectedPipelineId}>{pipeline.name}</Text>
                  {pipeline.isDefault && (
                    <Tag color="green" style={{ margin: 0 }}>{t('pipelineManager.default')}</Tag>
                  )}
                </div>
                <div style={{ marginTop: 4 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {pipeline.stages.length} {t('pipelineManager.stages')}
                  </Text>
                </div>
              </div>
            ))}
          </Card>
        </Col>

        {/* Stages Configuration */}
        <Col span={18}>
          <Card
            size="small"
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Space>
                  <Text strong>{selectedPipeline?.name}</Text>
                  <Tag>{selectedPipeline?.stages.length} stages</Tag>
                </Space>
                <Space>
                  {!selectedPipeline?.isDefault && (
                    <Button size="small" onClick={handleSetDefault}>
                      {t('pipelineManager.setDefault')}
                    </Button>
                  )}
                  <Button
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => {
                      setEditingPipeline(selectedPipeline);
                      pipelineForm.setFieldsValue(selectedPipeline);
                      setPipelineModalVisible(true);
                    }}
                  >
                    {t('common.edit')}
                  </Button>
                  <Button
                    size="small"
                    icon={<CopyOutlined />}
                    onClick={() => {
                      const copiedPipeline: PipelineConfig = {
                        ...selectedPipeline,
                        id: `pipeline-${Date.now()}`,
                        name: `${selectedPipeline.name} (Copy)`,
                        isDefault: false,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                      };
                      setPipelines([...pipelines, copiedPipeline]);
                      message.success(t('pipelineManager.copySuccess'));
                    }}
                  >
                    {t('common.copy')}
                  </Button>
                  {!selectedPipeline?.isDefault && (
                    <Button size="small" danger icon={<DeleteOutlined />} onClick={handleDeletePipeline}>
                      {t('common.delete')}
                    </Button>
                  )}
                </Space>
              </div>
            }
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingStage(null);
                  form.resetFields();
                  setStageModalVisible(true);
                }}
              >
                {t('pipelineManager.addStage')}
              </Button>
            }
          >
            <DndContext onDragEnd={handleDragEnd}>
              <SortableContext
                items={selectedPipeline?.stages.map(s => s.id) || []}
                strategy={verticalListSortingStrategy}
              >
                {selectedPipeline?.stages.map(stage => (
                  <SortableStageItem
                    key={stage.id}
                    stage={stage}
                    onEdit={() => {
                      setEditingStage(stage);
                      form.setFieldsValue({
                        ...stage,
                        color: stage.color,
                      });
                      setStageModalVisible(true);
                    }}
                    onDelete={() => handleDeleteStage(stage.id)}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </Card>
        </Col>
      </Row>

      {/* Stage Modal */}
      <Modal
        title={editingStage ? t('pipelineManager.editStage') : t('pipelineManager.addStage')}
        open={stageModalVisible}
        onCancel={() => {
          setStageModalVisible(false);
          setEditingStage(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText={t('common.save')}
        cancelText={t('common.cancel')}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveStage}>
          <Form.Item name="name" label={t('pipelineManager.stageName')} rules={[{ required: true }]}>
            <Input placeholder={t('pipelineManager.stageNamePlaceholder')} />
          </Form.Item>
          <Form.Item name="color" label={t('pipelineManager.stageColor')}>
            <ColorPicker format="hex" />
          </Form.Item>
          <Form.Item name="probability" label={t('pipelineManager.stageProbability')}>
            <InputNumber min={0} max={100} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="type" label={t('pipelineManager.stageType')}>
            <Select
              options={[
                { label: t('pipelineManager.normalStage'), value: 'normal' },
                { label: t('pipelineManager.wonStage'), value: 'won' },
                { label: t('pipelineManager.lostStage'), value: 'lost' },
              ]}
            />
          </Form.Item>
          <Form.Item name="requiredFields" label={t('pipelineManager.requiredFields')}>
            <Select
              mode="multiple"
              placeholder={t('pipelineManager.requiredFieldsPlaceholder')}
              options={[
                { label: 'Budget', value: 'budget' },
                { label: 'Proposal', value: 'proposal' },
                { label: 'POC Result', value: 'pocResult' },
                { label: 'Lost Reason', value: 'lostReason' },
                { label: 'Decision Maker', value: 'decisionMaker' },
              ]}
            />
          </Form.Item>
          <Form.Item name="hint" label={t('pipelineManager.stageHint')}>
            <Input placeholder={t('pipelineManager.stageHintPlaceholder')} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Pipeline Modal */}
      <Modal
        title={editingPipeline ? t('pipelineManager.editPipeline') : t('pipelineManager.newPipeline')}
        open={pipelineModalVisible}
        onCancel={() => {
          setPipelineModalVisible(false);
          setEditingPipeline(null);
          pipelineForm.resetFields();
        }}
        onOk={() => pipelineForm.submit()}
        okText={t('common.save')}
        cancelText={t('common.cancel')}
      >
        <Form form={pipelineForm} layout="vertical" onFinish={handleSavePipeline}>
          <Form.Item name="name" label={t('pipelineManager.pipelineName')} rules={[{ required: true }]}>
            <Input placeholder={t('pipelineManager.pipelineNamePlaceholder')} />
          </Form.Item>
          <Form.Item name="objectType" label={t('pipelineManager.objectType')}>
            <Select
              options={[
                { label: t('nav.opportunities'), value: 'opportunity' },
                { label: t('nav.orderManagement'), value: 'order' },
                { label: t('integration.tickets.title'), value: 'ticket' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PipelineManager;