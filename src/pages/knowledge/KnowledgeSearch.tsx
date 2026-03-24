/**
 * 知识库搜索页面 - RAG 对接 Demo
 */
import React, { useState } from 'react';
import { Card, Input, Button, Space, Spin, Typography, Divider, Empty, Tag, Alert } from 'antd';
import { SearchOutlined, BookOutlined } from '@ant-design/icons';
import { SearchResponse } from '../../types/knowledge';
import { searchKnowledge } from '../../services/knowledgeService';
import { KnowledgeCard } from '../../components/Integration/KnowledgeCard';

const { Title, Text, Paragraph } = Typography;

/**
 * 知识库搜索页面组件
 */
export const KnowledgeSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResponse | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  /** 执行搜索 */
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const result = await searchKnowledge({
        query: searchQuery,
        topK: 5,
      });
      setSearchResult(result);
    } catch (error) {
      console.error('搜索失败:', error);
    } finally {
      setLoading(false);
    }
  };

  /** 热门问题示例 */
  const hotQuestions = [
    '如何管理客户信息？',
    '线索转化流程是什么？',
    'CPQ 报价功能怎么用？',
    'API 接口文档在哪里？',
    '新员工培训资料',
  ];

  return (
    <div>
      <Card>
        {/* 搜索区域 */}
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 0' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
            <BookOutlined style={{ marginRight: 12 }} />
            知识库搜索
          </Title>

          <Space.Compact style={{ width: '100%' }}>
            <Input
              size="large"
              placeholder="输入问题，AI 将为您查找相关知识..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onPressEnter={handleSearch}
              prefix={<SearchOutlined />}
            />
            <Button
              type="primary"
              size="large"
              onClick={handleSearch}
              loading={loading}
            >
              搜索
            </Button>
          </Space.Compact>

          {!hasSearched && (
            <div style={{ marginTop: 32 }}>
              <Text type="secondary">热门问题：</Text>
              <Space wrap style={{ marginTop: 8 }}>
                {hotQuestions.map(q => (
                  <Tag
                    key={q}
                    color="blue"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setSearchQuery(q);
                      setTimeout(handleSearch, 100);
                    }}
                  >
                    {q}
                  </Tag>
                ))}
              </Space>
            </div>
          )}
        </div>

        <Divider />

        {/* 搜索结果 */}
        {loading && (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <Spin size="large" tip="AI 正在搜索知识库..." />
          </div>
        )}

        {!loading && searchResult && (
          <div>
            {/* AI 答案 */}
            <Alert
              message="AI 智能回答"
              description={searchResult.answer}
              type="info"
              showIcon
              style={{ marginBottom: 24 }}
            />

            {/* 置信度和处理时间 */}
            <Space style={{ marginBottom: 16 }}>
              <Text type="secondary">
                置信度：{Math.round(searchResult.confidence * 100)}%
              </Text>
              <Text type="secondary">|</Text>
              <Text type="secondary">
                处理时间：{searchResult.processingTime}ms
              </Text>
              <Text type="secondary">|</Text>
              <Text type="secondary">
                相关文档：{searchResult.documents.length} 篇
              </Text>
            </Space>

            <Divider orientation="left">相关文档</Divider>

            {/* 文档列表 */}
            {searchResult.documents.length > 0 ? (
              searchResult.documents.map(doc => (
                <KnowledgeCard
                  key={doc.id}
                  document={doc}
                  showRelevance
                />
              ))
            ) : (
              <Empty description="未找到相关文档" />
            )}

            {/* 来源 */}
            {searchResult.sources.length > 0 && (
              <>
                <Divider orientation="left">参考来源</Divider>
                <Space direction="vertical" style={{ width: '100%' }}>
                  {searchResult.sources.map((source, idx) => (
                    <div key={idx}>
                      <Text strong>{source.title}</Text>
                      <Paragraph type="secondary" ellipsis={{ rows: 1 }}>
                        {source.excerpt}
                      </Paragraph>
                    </div>
                  ))}
                </Space>
              </>
            )}
          </div>
        )}

        {!loading && !searchResult && hasSearched && (
          <Empty description="请输入搜索关键词" />
        )}
      </Card>
    </div>
  );
};

export default KnowledgeSearch;
