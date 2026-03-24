/**
 * Skeleton 骨架屏组件
 * 用于加载状态展示
 */
import React from 'react';
import { Skeleton as AntSkeleton, Card, Row, Col } from 'antd';

export interface TableSkeletonProps {
  /** 行数 */
  rows?: number;
  /** 列数 */
  columns?: number;
}

export interface CardSkeletonProps {
  /** 卡片数量 */
  count?: number;
  /** 是否显示操作按钮 */
  showActions?: boolean;
}

export interface PageSkeletonProps {
  /** 是否显示头部 */
  showHeader?: boolean;
  /** 是否显示筛选器 */
  showFilter?: boolean;
}

/**
 * 表格骨架屏
 */
export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 6,
}) => {
  return (
    <div>
      {/* 表头 */}
      <div style={{ display: 'flex', gap: 16, padding: '12px 8px', background: '#f5f5f5', marginBottom: 8 }}>
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} style={{ flex: 1 }}>
            <AntSkeleton.Button active style={{ width: '100%', height: 16 }} />
          </div>
        ))}
      </div>
      {/* 表格行 */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} style={{ display: 'flex', gap: 16, padding: '12px 8px', borderBottom: '1px solid #f0f0f0' }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} style={{ flex: 1 }}>
              <AntSkeleton.Button
                active
                style={{
                  width: '100%',
                  height: colIndex === 0 ? 18 : 14,
                }}
                size="small"
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

/**
 * 卡片骨架屏
 */
export const CardSkeleton: React.FC<CardSkeletonProps> = ({
  count = 4,
  showActions = true,
}) => {
  return (
    <Row gutter={16}>
      {Array.from({ length: count }).map((_, i) => (
        <Col key={i} xs={24} sm={12} lg={6}>
          <Card styles={{ body: { padding: 16 } }}>
            <AntSkeleton active paragraph={{ rows: 2 }} />
            {showActions && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
                <AntSkeleton.Button active size="small" />
                <AntSkeleton.Button active size="small" />
              </div>
            )}
          </Card>
        </Col>
      ))}
    </Row>
  );
};

/**
 * 页面骨架屏
 */
export const PageSkeleton: React.FC<PageSkeletonProps> = ({
  showHeader = true,
  showFilter = true,
}) => {
  return (
    <div>
      {showHeader && (
        <div style={{ marginBottom: 16 }}>
          <AntSkeleton.Input active style={{ width: 200, height: 24, marginBottom: 8 }} />
          <AntSkeleton.Input active style={{ width: 300, height: 16 }} />
        </div>
      )}
      {showFilter && (
        <Card style={{ marginBottom: 16 }} styles={{ body: { padding: 16 } }}>
          <div style={{ display: 'flex', gap: 16 }}>
            <AntSkeleton.Input active style={{ width: 200 }} />
            <AntSkeleton.Input active style={{ width: 150 }} />
            <AntSkeleton.Input active style={{ width: 150 }} />
            <AntSkeleton.Button active />
            <AntSkeleton.Button active />
          </div>
        </Card>
      )}
      <Card styles={{ body: { padding: 16 } }}>
        <TableSkeleton />
      </Card>
    </div>
  );
};

/**
 * 详情页骨架屏
 */
export const DetailSkeleton: React.FC = () => {
  return (
    <div>
      {/* 头部卡片 */}
      <Card style={{ marginBottom: 16 }} styles={{ body: { padding: 16 } }}>
        <div style={{ display: 'flex', gap: 16 }}>
          <AntSkeleton.Avatar active size={56} />
          <div style={{ flex: 1 }}>
            <AntSkeleton.Input active style={{ width: 200, height: 24, marginBottom: 8 }} />
            <AntSkeleton.Input active style={{ width: 400, height: 16 }} />
          </div>
        </div>
      </Card>

      {/* Tab 内容 */}
      <Card styles={{ body: { padding: 16 } }}>
        <AntSkeleton active paragraph={{ rows: 8 }} />
      </Card>
    </div>
  );
};

/**
 * 仪表盘骨架屏
 */
export const DashboardSkeleton: React.FC = () => {
  return (
    <div>
      {/* 指标卡 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Col key={i} xs={24} sm={12} lg={6}>
            <Card styles={{ body: { padding: 16 } }}>
              <AntSkeleton active paragraph={{ rows: 1 }} />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 图表区域 */}
      <Row gutter={16}>
        <Col span={16}>
          <Card styles={{ body: { padding: 16, height: 300 } }}>
            <AntSkeleton active paragraph={{ rows: 6 }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card styles={{ body: { padding: 16, height: 300 } }}>
            <AntSkeleton active paragraph={{ rows: 6 }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PageSkeleton;