/**
 * 知识库卡片组件
 * 用于展示搜索结果中的文档
 */
import React from 'react';
import { Card, Typography, Space, Tag, Button } from 'antd';
import { KnowledgeDocument } from '../../types/knowledge';

const { Title, Text, Paragraph } = Typography;

interface KnowledgeCardProps {
  document: KnowledgeDocument;
  onOpen?: (doc: KnowledgeDocument) => void;
  showRelevance?: boolean;
}

/**
 * 知识库卡片组件
 */
export const KnowledgeCard: React.FC<KnowledgeCardProps> = ({
  document,
  onOpen,
  showRelevance = false,
}) => {
  return (
    <Card
      hoverable
      onClick={() => onOpen?.(document)}
      style={{ marginBottom: 16 }}
      actions={onOpen ? [
        <Button type="link" key="view" onClick={(e) => {
          e.stopPropagation();
          onOpen(document);
        }}>
          查看详情
        </Button>,
      ] : undefined}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="small">
        <Space>
          <Title level={5} style={{ margin: 0, flex: 1 }}>{document.title}</Title>
          {showRelevance && document.relevanceScore && (
            <Tag color="green">
              相关度：{Math.round(document.relevanceScore * 100)}%
            </Tag>
          )}
        </Space>

        <Paragraph
          type="secondary"
          ellipsis={{ rows: 2 }}
          style={{ marginBottom: 8 }}
        >
          {document.summary}
        </Paragraph>

        <Space wrap size="small">
          <Tag color="blue">{document.category}</Tag>
          {document.tags.slice(0, 3).map(tag => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </Space>

        <Text type="secondary" style={{ fontSize: 12 }}>
          更新于：{document.updatedAt}
        </Text>
      </Space>
    </Card>
  );
};

export default KnowledgeCard;
