/**
 * EmptyState 空状态组件
 * 用于空数据展示
 */
import React from 'react';
import { Empty, Button, Typography } from 'antd';
import {
  InboxOutlined,
  SearchOutlined,
  FileTextOutlined,
  TeamOutlined,
  BulbOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { colors } from '../../styles/tokens';

const { Text, Title } = Typography;

export interface EmptyStateProps {
  /** 类型 */
  type?: 'default' | 'search' | 'table' | 'list' | 'data' | 'error';
  /** 标题 */
  title?: string;
  /** 描述 */
  description?: string;
  /** 操作按钮文字 */
  actionText?: string;
  /** 操作按钮回调 */
  onAction?: () => void;
  /** 图标 */
  icon?: React.ReactNode;
  /** 自定义图片 */
  image?: string;
}

const typeConfig = {
  default: {
    icon: <InboxOutlined style={{ fontSize: 48, color: colors.text.tertiary }} />,
    title: '暂无数据',
    description: '这里还没有任何内容',
  },
  search: {
    icon: <SearchOutlined style={{ fontSize: 48, color: colors.text.tertiary }} />,
    title: '未找到相关结果',
    description: '尝试使用其他关键词搜索',
  },
  table: {
    icon: <FileTextOutlined style={{ fontSize: 48, color: colors.text.tertiary }} />,
    title: '暂无数据',
    description: '点击新建按钮添加第一条数据',
  },
  list: {
    icon: <TeamOutlined style={{ fontSize: 48, color: colors.text.tertiary }} />,
    title: '列表为空',
    description: '暂无列表数据',
  },
  data: {
    icon: <BulbOutlined style={{ fontSize: 48, color: colors.text.tertiary }} />,
    title: '暂无数据',
    description: '开始添加数据吧',
  },
  error: {
    icon: <WarningOutlined style={{ fontSize: 48, color: colors.danger }} />,
    title: '加载失败',
    description: '数据加载出错，请重试',
  },
};

/**
 * EmptyState 空状态组件
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'default',
  title,
  description,
  actionText,
  onAction,
  icon,
  image,
}) => {
  const config = typeConfig[type];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 48,
      textAlign: 'center',
    }}>
      {image ? (
        <img src={image} alt={title || config.title} style={{ width: 120, marginBottom: 16 }} />
      ) : (
        <div style={{ marginBottom: 16 }}>
          {icon || config.icon}
        </div>
      )}
      <Title level={5} style={{ margin: '0 0 8px 0', color: colors.text.primary }}>
        {title || config.title}
      </Title>
      <Text type="secondary" style={{ marginBottom: actionText ? 16 : 0 }}>
        {description || config.description}
      </Text>
      {actionText && onAction && (
        <Button type="primary" onClick={onAction} style={{ marginTop: 16 }}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

/**
 * 表格空状态
 */
export const TableEmptyState: React.FC<{
  onCreate?: () => void;
  searchText?: string;
}> = ({ onCreate, searchText }) => {
  if (searchText) {
    return (
      <EmptyState
        type="search"
        title="未找到匹配的数据"
        description={`没有找到包含「${searchText}」的结果`}
        actionText="清除筛选"
        onAction={onCreate}
      />
    );
  }

  return (
    <EmptyState
      type="table"
      actionText={onCreate ? '新建' : undefined}
      onAction={onCreate}
    />
  );
};

/**
 * 错误状态
 */
export const ErrorState: React.FC<{
  message?: string;
  onRetry?: () => void;
}> = ({ message, onRetry }) => {
  return (
    <EmptyState
      type="error"
      title="加载失败"
      description={message || '数据加载出错，请重试'}
      actionText={onRetry ? '重试' : undefined}
      onAction={onRetry}
    />
  );
};

export default EmptyState;