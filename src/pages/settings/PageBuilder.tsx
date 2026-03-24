/**
 * Page Builder - Custom Page Layout Designer
 * 
 * Features:
 * - Left panel: Available cards to drag
 * - Middle canvas: Three-column layout preview
 * - Right panel: Selected card properties configuration
 * - Toolbar: Save/Preview/View switcher
 */
import React, { useState, useCallback, useMemo } from 'react';
import {
  Card,
  Button,
  Space,
  Tabs,
  Tag,
  Typography,
  Avatar,
  Divider,
  Tooltip,
  Collapse,
  Input,
  Select,
  Switch,
  InputNumber,
  Modal,
  Form,
  message,
  Dropdown,
  Menu,
  Empty,
  Row,
  Col,
} from 'antd';
import {
  SaveOutlined,
  EyeOutlined,
  DeleteOutlined,
  SettingOutlined,
  DragOutlined,
  PlusOutlined,
  CopyOutlined,
  UndoOutlined,
  RedoOutlined,
  FileOutlined,
  DatabaseOutlined,
  ClockCircleOutlined,
  RobotOutlined,
  BarChartOutlined,
  CodeOutlined,
  HolderOutlined,
  DownOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { colors } from '../../styles/tokens';
import { DndContext, useSensor, useSensors, PointerSensor, DragEndEvent, DragStartEvent, DragOverlay, useDroppable, useDraggable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const { Text, Title } = Typography;
const { TextArea } = Input;

/** Card types */
export type CardType = 'property' | 'relation' | 'activity' | 'ai' | 'chart' | 'html';

/** Card configuration */
export interface CardConfig {
  id: string;
  type: CardType;
  title: string;
  column: 'left' | 'middle' | 'right';
  order: number;
  config: {
    // Property card
    properties?: string[];
    layout?: 'two-column' | 'three-column';
    collapsible?: boolean;
    // Relation card
    relationObject?: string;
    displayFields?: string[];
    displayCount?: number;
    displayType?: 'card' | 'list' | 'count';
    // Activity card
    activityFilter?: string;
    activityCount?: number;
    // AI card
    aiType?: 'summary' | 'relationship' | 'suggestion';
    showRefresh?: boolean;
    // Chart card
    chartType?: 'line' | 'bar' | 'pie' | 'funnel' | 'metric';
    dataSource?: string;
    // HTML card
    htmlContent?: string;
    cssStyles?: string;
  };
}

/** View configuration */
export interface ViewConfig {
  id: string;
  name: string;
  description?: string;
  objectType: string;
  isDefault: boolean;
  visibility: 'private' | 'team' | 'all';
  cards: CardConfig[];
  createdAt: string;
  updatedAt: string;
}

/** Card type definition */
interface CardTypeDefinition {
  type: CardType;
  icon: React.ReactNode;
  label: string;
  description: string;
  color: string;
}

/** Available card types */
const CARD_TYPES: CardTypeDefinition[] = [
  { type: 'property', icon: <DatabaseOutlined />, label: 'Property Card', description: 'Display object properties', color: colors.primary },
  { type: 'relation', icon: <FileOutlined />, label: 'Relation Card', description: 'Show related objects', color: colors.warning },
  { type: 'activity', icon: <ClockCircleOutlined />, label: 'Activity Card', description: 'Activity timeline', color: colors.success },
  { type: 'ai', icon: <RobotOutlined />, label: 'AI Card', description: 'AI analysis panel', color: colors.info },
  { type: 'chart', icon: <BarChartOutlined />, label: 'Chart Card', description: 'Data visualization', color: colors.danger },
  { type: 'html', icon: <CodeOutlined />, label: 'HTML Card', description: 'Custom HTML content', color: '#9C27B0' },
];

/** Default cards for each column */
const DEFAULT_CARDS: CardConfig[] = [
  { id: 'card-1', type: 'property', title: 'Basic Information', column: 'left', order: 0, config: { properties: ['name', 'email', 'phone'], layout: 'two-column', collapsible: true } },
  { id: 'card-2', type: 'relation', title: 'Related Contacts', column: 'right', order: 0, config: { relationObject: 'Contact', displayCount: 5, displayType: 'list' } },
  { id: 'card-3', type: 'activity', title: 'Recent Activities', column: 'middle', order: 0, config: { activityCount: 10 } },
];

/** Draggable Card Component */
const DraggableCard: React.FC<{
  card: CardConfig;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onEdit: () => void;
}> = ({ card, isSelected, onSelect, onDelete, onEdit }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const cardType = CARD_TYPES.find(t => t.type === card.type);

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card
        size="small"
        hoverable
        onClick={onSelect}
        style={{
          marginBottom: 8,
          border: isSelected ? `2px solid ${colors.primary}` : `1px solid ${colors.border.light}`,
          background: isDragging ? colors.background.default : '#fff',
          cursor: 'grab',
        }}
        styles={{ body: { padding: '8px 12px' } }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span {...listeners} style={{ cursor: 'grab' }}>
            <HolderOutlined style={{ color: colors.text.disabled }} />
          </span>
          <div style={{ color: cardType?.color }}>{cardType?.icon}</div>
          <div style={{ flex: 1 }}>
            <Text strong style={{ fontSize: 13 }}>{card.title}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 11 }}>{cardType?.label}</Text>
          </div>
          <Space size={4}>
            <Button type="text" size="small" icon={<SettingOutlined />} onClick={(e) => { e.stopPropagation(); onEdit(); }} />
            <Button type="text" size="small" icon={<DeleteOutlined />} danger onClick={(e) => { e.stopPropagation(); onDelete(); }} />
          </Space>
        </div>
      </Card>
    </div>
  );
};

/** Droppable Column Component */
const DroppableColumn: React.FC<{
  id: string;
  title: string;
  width: string;
  cards: CardConfig[];
  selectedCardId: string | null;
  onSelectCard: (cardId: string) => void;
  onDeleteCard: (cardId: string) => void;
  onEditCard: (cardId: string) => void;
}> = ({ id, title, width, cards, selectedCardId, onSelectCard, onDeleteCard, onEditCard }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        width,
        background: isOver ? colors.background.hover : colors.background.default,
        borderRadius: 8,
        padding: 12,
        border: `2px dashed ${isOver ? colors.primary : colors.border.light}`,
        minHeight: 400,
        transition: 'all 0.2s',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Text strong>{title}</Text>
        <Tag>{cards.length} cards</Tag>
      </div>
      <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
        {cards.length === 0 ? (
          <Empty description="Drag cards here" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          cards.map(card => (
            <DraggableCard
              key={card.id}
              card={card}
              isSelected={card.id === selectedCardId}
              onSelect={() => onSelectCard(card.id)}
              onDelete={() => onDeleteCard(card.id)}
              onEdit={() => onEditCard(card.id)}
            />
          ))
        )}
      </SortableContext>
    </div>
  );
};

/**
 * Page Builder Component
 */
export const PageBuilder: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { objectId } = useParams<{ objectId: string }>();

  // State
  const [cards, setCards] = useState<CardConfig[]>(DEFAULT_CARDS);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [viewName, setViewName] = useState('');
  const [viewDescription, setViewDescription] = useState('');
  const [form] = Form.useForm();

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Selected card
  const selectedCard = useMemo(() => {
    return cards.find(c => c.id === selectedCardId) || null;
  }, [cards, selectedCardId]);

  // Column cards
  const leftCards = useMemo(() => cards.filter(c => c.column === 'left').sort((a, b) => a.order - b.order), [cards]);
  const middleCards = useMemo(() => cards.filter(c => c.column === 'middle').sort((a, b) => a.order - b.order), [cards]);
  const rightCards = useMemo(() => cards.filter(c => c.column === 'right').sort((a, b) => a.order - b.order), [cards]);

  // Drag start
  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
  };

  // Drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Check if dragging from card type panel
    const isNewCard = activeId.startsWith('new-');
    const cardType = isNewCard ? activeId.replace('new-', '') as CardType : null;

    // Determine target column
    let targetColumn: 'left' | 'middle' | 'right' = 'middle';
    if (overId === 'left-column' || leftCards.some(c => c.id === overId)) {
      targetColumn = 'left';
    } else if (overId === 'right-column' || rightCards.some(c => c.id === overId)) {
      targetColumn = 'right';
    } else if (overId === 'middle-column' || middleCards.some(c => c.id === overId)) {
      targetColumn = 'middle';
    }

    if (isNewCard && cardType) {
      // Create new card
      const newCard: CardConfig = {
        id: `card-${Date.now()}`,
        type: cardType,
        title: CARD_TYPES.find(t => t.type === cardType)?.label || cardType,
        column: targetColumn,
        order: targetColumn === 'left' ? leftCards.length : targetColumn === 'middle' ? middleCards.length : rightCards.length,
        config: {},
      };
      setCards([...cards, newCard]);
      setSelectedCardId(newCard.id);
    } else {
      // Move existing card
      setCards(prevCards => {
        const updatedCards = [...prevCards];
        const cardIndex = updatedCards.findIndex(c => c.id === activeId);
        if (cardIndex === -1) return prevCards;

        const card = { ...updatedCards[cardIndex], column: targetColumn };

        // Update order within column
        const columnCards = updatedCards.filter(c => c.column === targetColumn && c.id !== activeId);
        const overIndex = columnCards.findIndex(c => c.id === overId);

        if (overIndex >= 0) {
          card.order = overIndex;
        } else {
          card.order = columnCards.length;
        }

        updatedCards[cardIndex] = card;
        return updatedCards;
      });
    }
  };

  // Add card
  const handleAddCard = (type: CardType, column: 'left' | 'middle' | 'right') => {
    const newCard: CardConfig = {
      id: `card-${Date.now()}`,
      type,
      title: CARD_TYPES.find(t => t.type === type)?.label || type,
      column,
      order: cards.filter(c => c.column === column).length,
      config: {},
    };
    setCards([...cards, newCard]);
    setSelectedCardId(newCard.id);
  };

  // Delete card
  const handleDeleteCard = (cardId: string) => {
    setCards(cards.filter(c => c.id !== cardId));
    if (selectedCardId === cardId) {
      setSelectedCardId(null);
    }
  };

  // Update card config
  const handleUpdateCard = (cardId: string, updates: Partial<CardConfig>) => {
    setCards(cards.map(c => c.id === cardId ? { ...c, ...updates } : c));
  };

  // Save view
  const handleSave = () => {
    if (!viewName.trim()) {
      message.warning(t('pageBuilder.viewNameRequired'));
      return;
    }

    const viewConfig: ViewConfig = {
      id: `view-${Date.now()}`,
      name: viewName,
      description: viewDescription,
      objectType: objectId || 'customer',
      isDefault: false,
      visibility: 'private',
      cards,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log('Saving view:', viewConfig);
    message.success(t('pageBuilder.saveSuccess'));
    setSaveModalVisible(false);
  };

  // Preview
  const handlePreview = () => {
    setPreviewMode(!previewMode);
  };

  // Undo/Redo
  const handleUndo = () => {
    message.info(t('pageBuilder.undo'));
  };

  const handleRedo = () => {
    message.info(t('pageBuilder.redo'));
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

        {/* Main Content */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Left Panel - Card Types */}
          <div
            style={{
              width: 240,
              borderRight: `1px solid ${colors.border.default}`,
              background: '#fff',
              overflow: 'auto',
              padding: 16,
            }}
          >
            <Text strong style={{ display: 'block', marginBottom: 12 }}>
              {t('pageBuilder.availableCards')}
            </Text>
            {CARD_TYPES.map(cardType => (
              <div
                key={cardType.type}
                style={{
                  padding: '12px',
                  marginBottom: 8,
                  background: colors.background.default,
                  borderRadius: 8,
                  cursor: 'grab',
                  border: `1px solid ${colors.border.light}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ color: cardType.color }}>{cardType.icon}</div>
                  <div>
                    <Text strong style={{ fontSize: 13 }}>{cardType.label}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 11 }}>{cardType.description}</Text>
                  </div>
                </div>
                <div style={{ marginTop: 8, display: 'flex', gap: 4 }}>
                  <Button size="small" onClick={() => handleAddCard(cardType.type, 'left')}>L</Button>
                  <Button size="small" onClick={() => handleAddCard(cardType.type, 'middle')}>M</Button>
                  <Button size="small" onClick={() => handleAddCard(cardType.type, 'right')}>R</Button>
                </div>
              </div>
            ))}
          </div>

          {/* Middle Canvas - Three Column Layout */}
          <div
            style={{
              flex: 1,
              padding: 16,
              background: colors.background.default,
              overflow: 'auto',
            }}
          >
            <div style={{ display: 'flex', gap: 16, height: '100%' }}>
              <DroppableColumn
                id="left-column"
                title={t('pageBuilder.leftColumn')}
                width="240px"
                cards={leftCards}
                selectedCardId={selectedCardId}
                onSelectCard={setSelectedCardId}
                onDeleteCard={handleDeleteCard}
                onEditCard={(id) => setSelectedCardId(id)}
              />
              <DroppableColumn
                id="middle-column"
                title={t('pageBuilder.middleColumn')}
                width="flex: 1"
                cards={middleCards}
                selectedCardId={selectedCardId}
                onSelectCard={setSelectedCardId}
                onDeleteCard={handleDeleteCard}
                onEditCard={(id) => setSelectedCardId(id)}
              />
              <DroppableColumn
                id="right-column"
                title={t('pageBuilder.rightColumn')}
                width="320px"
                cards={rightCards}
                selectedCardId={selectedCardId}
                onSelectCard={setSelectedCardId}
                onDeleteCard={handleDeleteCard}
                onEditCard={(id) => setSelectedCardId(id)}
              />
            </div>
          </div>

          {/* Right Panel - Card Configuration */}
          <div
            style={{
              width: 280,
              borderLeft: `1px solid ${colors.border.default}`,
              background: '#fff',
              overflow: 'auto',
              padding: 16,
            }}
          >
            <Text strong style={{ display: 'block', marginBottom: 16 }}>
              {t('pageBuilder.cardSettings')}
            </Text>
            {selectedCard ? (
              <Form layout="vertical" size="small">
                <Form.Item label={t('pageBuilder.cardTitle')}>
                  <Input
                    value={selectedCard.title}
                    onChange={(e) => handleUpdateCard(selectedCard.id, { title: e.target.value })}
                  />
                </Form.Item>
                <Form.Item label={t('pageBuilder.cardType')}>
                  <Select
                    value={selectedCard.type}
                    onChange={(value) => handleUpdateCard(selectedCard.id, { type: value })}
                    options={CARD_TYPES.map(t => ({ label: t.label, value: t.type }))}
                  />
                </Form.Item>
                <Form.Item label={t('pageBuilder.column')}>
                  <Select
                    value={selectedCard.column}
                    onChange={(value) => handleUpdateCard(selectedCard.id, { column: value })}
                    options={[
                      { label: t('pageBuilder.leftColumn'), value: 'left' },
                      { label: t('pageBuilder.middleColumn'), value: 'middle' },
                      { label: t('pageBuilder.rightColumn'), value: 'right' },
                    ]}
                  />
                </Form.Item>

                {/* Type-specific config */}
                {selectedCard.type === 'property' && (
                  <>
                    <Form.Item label={t('pageBuilder.layout')}>
                      <Select
                        value={selectedCard.config.layout || 'two-column'}
                        onChange={(value) => handleUpdateCard(selectedCard.id, {
                          config: { ...selectedCard.config, layout: value }
                        })}
                        options={[
                          { label: t('pageBuilder.twoColumn'), value: 'two-column' },
                          { label: t('pageBuilder.threeColumn'), value: 'three-column' },
                        ]}
                      />
                    </Form.Item>
                    <Form.Item label={t('pageBuilder.collapsible')}>
                      <Switch
                        checked={selectedCard.config.collapsible}
                        onChange={(checked) => handleUpdateCard(selectedCard.id, {
                          config: { ...selectedCard.config, collapsible: checked }
                        })}
                      />
                    </Form.Item>
                  </>
                )}

                {selectedCard.type === 'relation' && (
                  <>
                    <Form.Item label={t('pageBuilder.relationObject')}>
                      <Select
                        value={selectedCard.config.relationObject}
                        onChange={(value) => handleUpdateCard(selectedCard.id, {
                          config: { ...selectedCard.config, relationObject: value }
                        })}
                        options={[
                          { label: 'Contact', value: 'Contact' },
                          { label: 'Opportunity', value: 'Opportunity' },
                          { label: 'Contract', value: 'Contract' },
                          { label: 'Ticket', value: 'Ticket' },
                        ]}
                      />
                    </Form.Item>
                    <Form.Item label={t('pageBuilder.displayCount')}>
                      <InputNumber
                        value={selectedCard.config.displayCount || 5}
                        onChange={(value) => handleUpdateCard(selectedCard.id, {
                          config: { ...selectedCard.config, displayCount: value || 5 }
                        })}
                        min={1}
                        max={20}
                      />
                    </Form.Item>
                    <Form.Item label={t('pageBuilder.displayType')}>
                      <Select
                        value={selectedCard.config.displayType || 'list'}
                        onChange={(value) => handleUpdateCard(selectedCard.id, {
                          config: { ...selectedCard.config, displayType: value }
                        })}
                        options={[
                          { label: t('pageBuilder.cardList'), value: 'card' },
                          { label: t('pageBuilder.simpleList'), value: 'list' },
                          { label: t('pageBuilder.countOnly'), value: 'count' },
                        ]}
                      />
                    </Form.Item>
                  </>
                )}

                {selectedCard.type === 'activity' && (
                  <>
                    <Form.Item label={t('pageBuilder.activityCount')}>
                      <InputNumber
                        value={selectedCard.config.activityCount || 10}
                        onChange={(value) => handleUpdateCard(selectedCard.id, {
                          config: { ...selectedCard.config, activityCount: value || 10 }
                        })}
                        min={1}
                        max={50}
                      />
                    </Form.Item>
                  </>
                )}

                {selectedCard.type === 'ai' && (
                  <>
                    <Form.Item label={t('pageBuilder.aiType')}>
                      <Select
                        value={selectedCard.config.aiType || 'summary'}
                        onChange={(value) => handleUpdateCard(selectedCard.id, {
                          config: { ...selectedCard.config, aiType: value }
                        })}
                        options={[
                          { label: t('pageBuilder.aiSummary'), value: 'summary' },
                          { label: t('pageBuilder.aiRelationship'), value: 'relationship' },
                          { label: t('pageBuilder.aiSuggestion'), value: 'suggestion' },
                        ]}
                      />
                    </Form.Item>
                    <Form.Item label={t('pageBuilder.showRefresh')}>
                      <Switch
                        checked={selectedCard.config.showRefresh}
                        onChange={(checked) => handleUpdateCard(selectedCard.id, {
                          config: { ...selectedCard.config, showRefresh: checked }
                        })}
                      />
                    </Form.Item>
                  </>
                )}

                {selectedCard.type === 'chart' && (
                  <>
                    <Form.Item label={t('pageBuilder.chartType')}>
                      <Select
                        value={selectedCard.config.chartType || 'bar'}
                        onChange={(value) => handleUpdateCard(selectedCard.id, {
                          config: { ...selectedCard.config, chartType: value }
                        })}
                        options={[
                          { label: t('pageBuilder.lineChart'), value: 'line' },
                          { label: t('pageBuilder.barChart'), value: 'bar' },
                          { label: t('pageBuilder.pieChart'), value: 'pie' },
                          { label: t('pageBuilder.funnelChart'), value: 'funnel' },
                          { label: t('pageBuilder.metricCard'), value: 'metric' },
                        ]}
                      />
                    </Form.Item>
                  </>
                )}

                {selectedCard.type === 'html' && (
                  <>
                    <Form.Item label={t('pageBuilder.htmlContent')}>
                      <TextArea
                        rows={6}
                        value={selectedCard.config.htmlContent}
                        onChange={(e) => handleUpdateCard(selectedCard.id, {
                          config: { ...selectedCard.config, htmlContent: e.target.value }
                        })}
                        placeholder="<div>Custom HTML</div>"
                      />
                    </Form.Item>
                    <Form.Item label={t('pageBuilder.cssStyles')}>
                      <TextArea
                        rows={4}
                        value={selectedCard.config.cssStyles}
                        onChange={(e) => handleUpdateCard(selectedCard.id, {
                          config: { ...selectedCard.config, cssStyles: e.target.value }
                        })}
                        placeholder=".custom-class { color: red; }"
                      />
                    </Form.Item>
                  </>
                )}

                <Divider />
                <Button danger block icon={<DeleteOutlined />} onClick={() => handleDeleteCard(selectedCard.id)}>
                  {t('common.delete')}
                </Button>
              </Form>
            ) : (
              <Empty description={t('pageBuilder.selectCardHint')} image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </div>
        </div>

        {/* Save Modal */}
        <Modal
          title={t('pageBuilder.saveView')}
          open={saveModalVisible}
          onCancel={() => setSaveModalVisible(false)}
          onOk={handleSave}
          okText={t('common.save')}
          cancelText={t('common.cancel')}
        >
          <Form layout="vertical">
            <Form.Item label={t('pageBuilder.viewName')} required>
              <Input
                value={viewName}
                onChange={(e) => setViewName(e.target.value)}
                placeholder={t('pageBuilder.viewNamePlaceholder')}
              />
            </Form.Item>
            <Form.Item label={t('pageBuilder.viewDescription')}>
              <TextArea
                value={viewDescription}
                onChange={(e) => setViewDescription(e.target.value)}
                placeholder={t('pageBuilder.viewDescriptionPlaceholder')}
                rows={3}
              />
            </Form.Item>
            <Form.Item label={t('pageBuilder.visibility')}>
              <Select
                defaultValue="private"
                options={[
                  { label: t('pageBuilder.private'), value: 'private' },
                  { label: t('pageBuilder.team'), value: 'team' },
                  { label: t('pageBuilder.all'), value: 'all' },
                ]}
              />
            </Form.Item>
            <Form.Item label={t('pageBuilder.setAsDefault')}>
              <Switch />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </DndContext>
  );
};

export default PageBuilder;