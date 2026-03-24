/**
 * 仪表盘网格布局组件
 * 支持拖拽排序和列数切换
 */

import React, { useState } from 'react';
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
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Row, Col, Card, Button, Space, Empty } from 'antd';
import { DragOutlined, SettingOutlined } from '@ant-design/icons';
import { DashletConfig } from '../../types/dashboard';

interface SortableDashletProps {
  dashlet: DashletConfig;
  children: React.ReactNode;
}

const SortableDashlet: React.FC<SortableDashletProps> = ({ dashlet, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: dashlet.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
    minHeight: '280px',
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        size="small"
        bordered={false}
        style={{ height: '100%' }}
        bodyStyle={{ padding: '8px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          <div
            {...attributes}
            {...listeners}
            style={{ cursor: 'grab', marginRight: 8, color: '#999' }}
          >
            <DragOutlined />
          </div>
          <div style={{ flex: 1, fontWeight: 500 }}>{dashlet.title}</div>
        </div>
        {children}
      </Card>
    </div>
  );
};

interface DashboardGridProps {
  dashlets: DashletConfig[];
  columns: 3 | 4;
  onDashletsChange: (dashlets: DashletConfig[]) => void;
  onColumnsChange: (columns: 3 | 4) => void;
  renderDashlet: (type: string) => React.ReactNode;
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({
  dashlets,
  columns,
  onDashletsChange,
  onColumnsChange,
  renderDashlet,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = dashlets.findIndex((d) => d.id === active.id);
      const newIndex = dashlets.findIndex((d) => d.id === over.id);

      const newDashlets = arrayMove(dashlets, oldIndex, newIndex).map((d, index) => ({
        ...d,
        position: index,
      }));

      onDashletsChange(newDashlets);
    }
  };

  const visibleDashlets = dashlets.filter((d) => d.visible);

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space>
          <Button
            type={columns === 3 ? 'primary' : 'default'}
            onClick={() => onColumnsChange(3)}
          >
            3 列布局
          </Button>
          <Button
            type={columns === 4 ? 'primary' : 'default'}
            onClick={() => onColumnsChange(4)}
          >
            4 列布局
          </Button>
        </Space>
        <Button icon={<SettingOutlined />}>
          管理卡片
        </Button>
      </div>

      {visibleDashlets.length === 0 ? (
        <Empty description="暂无显示的卡片，请点击右上角管理卡片添加" />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <Row gutter={[16, 16]}>
            <SortableContext
              items={visibleDashlets.map((d) => d.id)}
              strategy={horizontalListSortingStrategy}
            >
              {visibleDashlets.map((dashlet) => (
                <Col
                  key={dashlet.id}
                  xs={24}
                  sm={columns === 3 ? 12 : 12}
                  md={columns === 3 ? 8 : 6}
                  xl={columns === 3 ? 8 : 6}
                >
                  <SortableDashlet dashlet={dashlet}>
                    {renderDashlet(dashlet.type)}
                  </SortableDashlet>
                </Col>
              ))}
            </SortableContext>
          </Row>
        </DndContext>
      )}
    </div>
  );
};
