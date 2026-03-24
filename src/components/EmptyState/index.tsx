/**
 * EmptyState 空状态组件
 * 用于空数据展示
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  const typeConfig = {
    default: {
      icon: <InboxOutlined style={{ fontSize: 48, color: colors.text.tertiary }} />,
      title: t('components.emptyState.noData'),
      description: t('components.emptyState.noContent'),
    },
    search: {
      icon: <SearchOutlined style={{ fontSize: 48, color: colors.text.tertiary }} />,
      title: t('components.emptyState.noSearchResult'),
      description: t('components.emptyState.tryOtherKeywords'),
    },
    table: {
      icon: <FileTextOutlined style={{ fontSize: 48, color: colors.text.tertiary }} />,
      title: t('components.emptyState.noData'),
      description: t('components.emptyState.clickToAdd'),
    },
    list: {
      icon: <TeamOutlined style={{ fontSize: 48, color: colors.text.tertiary }} />,
      title: t('components.emptyState.emptyList'),
      description: t('components.emptyState.noListData'),
    },
    data: {
      icon: <BulbOutlined style={{ fontSize: 48, color: colors.text.tertiary }} />,
      title: t('components.emptyState.noData'),
      description: t('components.emptyState.startAdding'),
    },
    error: {
      icon: <WarningOutlined style={{ fontSize: 48, color: colors.danger }} />,
      title: t('components.emptyState.loadFailed'),
      description: t('components.emptyState.loadFailedRetry'),
    },
  };

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
  const { t } = useTranslation();

  if (searchText) {
    return (
      <EmptyState
        type="search"
        title={t('components.emptyState.noMatchFound')}
        description={t('components.emptyState.noMatchFor', { text: searchText })}
        actionText={t('components.emptyState.clearFilter')}
        onAction={onCreate}
      />
    );
  }

  return (
    <EmptyState
      type="table"
      actionText={onCreate ? t('components.emptyState.newButton') : undefined}
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
  const { t } = useTranslation();

  return (
    <EmptyState
      type="error"
      title={t('components.emptyState.loadFailed')}
      description={message || t('components.emptyState.loadFailedRetry')}
      actionText={onRetry ? t('components.emptyState.retry') : undefined}
      onAction={onRetry}
    />
  );
};

export default EmptyState;