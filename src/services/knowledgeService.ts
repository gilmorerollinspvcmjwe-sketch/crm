/**
 * RAG 知识库服务
 */
import { KnowledgeDocument, SearchResponse, SearchRequest, KnowledgeCategory } from '../types/knowledge';
import {
  knowledgeDocuments,
  searchKnowledge as mockSearch,
  getDocumentById as mockGetById,
  getCategories as mockGetCategories,
} from '../mock/knowledgeData';

/** 执行知识搜索 */
export const searchKnowledge = (request: SearchRequest): Promise<SearchResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const response = mockSearch(request.query, request.topK || 5);
      resolve(response);
    }, 500);
  });
};

/** 获取文档详情 */
export const getDocumentById = (id: string): Promise<KnowledgeDocument | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const doc = mockGetById(id);
      resolve(doc);
    }, 200);
  });
};

/** 获取知识分类 */
export const getKnowledgeCategories = (): Promise<KnowledgeCategory[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const categories = mockGetCategories();
      resolve(categories);
    }, 200);
  });
};

/** 获取热门文档 */
export const getPopularDocuments = (limit: number = 10): Promise<KnowledgeDocument[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 简单按更新时间排序
      const sorted = [...knowledgeDocuments].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      resolve(sorted.slice(0, limit));
    }, 200);
  });
};
