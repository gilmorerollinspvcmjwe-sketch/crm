/**
 * RAG 知识库对接类型定义
 */

/** 知识库文档 */
export interface KnowledgeDocument {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: string;
  tags: string[];
  sourceUrl?: string;
  createdAt: string;
  updatedAt: string;
  relevanceScore?: number; // 相关度分数 0-1
}

/** 搜索结果 */
export interface SearchResponse {
  query: string;
  answer: string;
  documents: KnowledgeDocument[];
  sources: {
    title: string;
    url?: string;
    excerpt: string;
  }[];
  confidence: number; // 置信度 0-1
  processingTime: number; // 处理时间 ms
}

/** 搜索请求 */
export interface SearchRequest {
  query: string;
  topK?: number;
  categories?: string[];
  dateFrom?: string;
  dateTo?: string;
}

/** 知识分类 */
export interface KnowledgeCategory {
  id: string;
  name: string;
  parentId?: string;
  documentCount: number;
  children?: KnowledgeCategory[];
}
