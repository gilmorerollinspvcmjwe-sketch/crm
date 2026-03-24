/**
 * 知识库搜索页面 - RAG 对接 Demo
 */
import React, { useState } from 'react';
import { Card, Input, Button, Space, Spin, Typography, Divider, Empty, Tag, Alert } from 'antd';
import { SearchOutlined, BookOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { SearchResponse } from '../../types/knowledge';
import { searchKnowledge } from '../../services/knowledgeService';
import { KnowledgeCard } from '../../components/Integration/KnowledgeCard';

const { Title, Text, Paragraph } = Typography;

/**
 * 知识库搜索页面组件
 */
export const KnowledgeSearch: React.FC = () => {
  const { t } = useTranslation();
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
      console.error(t('integration.knowledge.search') + ':', error);
    } finally {
      setLoading(false);
    }
  };

  /** 热门问题示例 */
  const hotQuestions = [
    t('integration.knowledge.hotQuestion1', { defaultValue: '如何管理客户信息？' }),
    t('integration.knowledge.hotQuestion2', { defaultValue: '线索转化流程是什么？' }),
    t('integration.knowledge.hotQuestion3', { defaultValue: 'CPQ 报价功能怎么用？' }),
    t('integration.knowledge.hotQuestion4', { defaultValue: 'API 接口文档在哪里？' }),
    t('integration.knowledge.hotQuestion5', { defaultValue: '新员工培训资料' }),
  ];

  return (
    <div>
      <Card>
        {/* 搜索区域 */}
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 0' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
            <BookOutlined style={{ marginRight: 12 }} />
            {t('integration.knowledge.title')}
          </Title>

          <Space.Compact style={{ width: '100%' }}>
            <Input
              size="large"
              placeholder={t('integration.knowledge.searchPlaceholder')}
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
              {t('integration.knowledge.search')}
            </Button>
          </Space.Compact>

          {!hasSearched && (
            <div style={{ marginTop: 32 }}>
              <Text type="secondary">{t('integration.knowledge.hotQuestions')}</Text>
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
            <Spin size="large" tip={t('integration.knowledge.searching')} />
          </div>
        )}

        {!loading && searchResult && (
          <div>
            {/* AI 答案 */}
            <Alert
              message={t('integration.knowledge.aiAnswer')}
              description={searchResult.answer}
              type="info"
              showIcon
              style={{ marginBottom: 24 }}
            />

            {/* 置信度和处理时间 */}
            <Space style={{ marginBottom: 16 }}>
              <Text type="secondary">
                {t('integration.knowledge.confidence')}：{Math.round(searchResult.confidence * 100)}%
              </Text>
              <Text type="secondary">|</Text>
              <Text type="secondary">
                {t('integration.knowledge.processingTime')}：{searchResult.processingTime}ms
              </Text>
              <Text type="secondary">|</Text>
              <Text type="secondary">
                {t('integration.knowledge.relatedDocs')}：{searchResult.documents.length} {t('common.items')}
              </Text>
            </Space>

            <Divider orientation="left">{t('integration.knowledge.relatedDocs')}</Divider>

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
              <Empty description={t('integration.knowledge.noResults')} />
            )}

            {/* 来源 */}
            {searchResult.sources.length > 0 && (
              <>
                <Divider orientation="left">{t('integration.knowledge.referenceSources')}</Divider>
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
          <Empty description={t('integration.knowledge.enterKeyword')} />
        )}
      </Card>
    </div>
  );
};

export default KnowledgeSearch;