/**
 * RAG 知识库 Mock 数据
 */
import { KnowledgeDocument, SearchResponse, KnowledgeCategory } from '../types/knowledge';

/** 知识分类 */
export const knowledgeCategories: KnowledgeCategory[] = [
  {
    id: 'CAT001',
    name: '产品文档',
    documentCount: 45,
    children: [
      { id: 'CAT001-01', name: '功能说明', parentId: 'CAT001', documentCount: 20 },
      { id: 'CAT001-02', name: '操作手册', parentId: 'CAT001', documentCount: 15 },
      { id: 'CAT001-03', name: 'FAQ', parentId: 'CAT001', documentCount: 10 },
    ],
  },
  {
    id: 'CAT002',
    name: '技术文档',
    documentCount: 30,
    children: [
      { id: 'CAT002-01', name: 'API 文档', parentId: 'CAT002', documentCount: 15 },
      { id: 'CAT002-02', name: '部署指南', parentId: 'CAT002', documentCount: 10 },
      { id: 'CAT002-03', name: '故障排查', parentId: 'CAT002', documentCount: 5 },
    ],
  },
  {
    id: 'CAT003',
    name: '销售资料',
    documentCount: 25,
    children: [
      { id: 'CAT003-01', name: '产品介绍', parentId: 'CAT003', documentCount: 10 },
      { id: 'CAT003-02', name: '竞争分析', parentId: 'CAT003', documentCount: 8 },
      { id: 'CAT003-03', name: '成功案例', parentId: 'CAT003', documentCount: 7 },
    ],
  },
  {
    id: 'CAT004',
    name: '培训资料',
    documentCount: 20,
    children: [
      { id: 'CAT004-01', name: '新员工培训', parentId: 'CAT004', documentCount: 10 },
      { id: 'CAT004-02', name: '进阶培训', parentId: 'CAT004', documentCount: 10 },
    ],
  },
];

/** 知识库文档列表 */
export const knowledgeDocuments: KnowledgeDocument[] = [
  {
    id: 'DOC001',
    title: 'CRM 系统快速入门指南',
    content: '本指南帮助您快速了解 CRM 系统的基本功能和使用方法。CRM 系统包含客户管理、线索管理、商机管理、合同管理、回款管理等核心模块...',
    summary: 'CRM 系统入门指南，涵盖核心模块介绍和基本操作流程',
    category: '产品文档',
    tags: ['入门', '指南', '基础'],
    sourceUrl: 'https://docs.crm.com/quickstart',
    createdAt: '2026-01-15 10:00:00',
    updatedAt: '2026-03-01 14:00:00',
  },
  {
    id: 'DOC002',
    title: '如何管理客户信息',
    content: '客户信息管理是 CRM 系统的核心功能之一。您可以创建、编辑、查看和删除客户信息。每个客户可以关联多个联系人、商机、合同和回款记录...',
    summary: '详细介绍客户信息的创建、编辑、查询和关联操作',
    category: '产品文档',
    tags: ['客户管理', '操作手册'],
    sourceUrl: 'https://docs.crm.com/customer',
    createdAt: '2026-01-20 09:00:00',
    updatedAt: '2026-02-15 11:00:00',
  },
  {
    id: 'DOC003',
    title: '线索转化流程说明',
    content: '线索转化是将潜在客户转化为客户的关键流程。当线索满足一定条件时，可以将其转化为客户、联系人和商机。转化后，原线索的所有跟进记录会自动关联到新创建的客户...',
    summary: '说明线索转化的条件、步骤和注意事项',
    category: '产品文档',
    tags: ['线索', '转化', '流程'],
    sourceUrl: 'https://docs.crm.com/lead-conversion',
    createdAt: '2026-02-01 14:00:00',
    updatedAt: '2026-02-20 16:00:00',
  },
  {
    id: 'DOC004',
    title: 'CPQ 报价功能使用手册',
    content: 'CPQ（Configure, Price, Quote）报价功能支持产品配置、价格计算和报价单生成。用户可以创建产品库、管理价格表、使用可视化配置器生成报价单，并导出 PDF 格式...',
    summary: 'CPQ 报价功能的完整使用指南',
    category: '产品文档',
    tags: ['CPQ', '报价', '产品'],
    sourceUrl: 'https://docs.crm.com/cpq',
    createdAt: '2026-03-01 10:00:00',
    updatedAt: '2026-03-10 15:00:00',
  },
  {
    id: 'DOC005',
    title: 'API 接口文档 v2.0',
    content: '本文档描述 CRM 系统 RESTful API 的使用规范。所有接口采用 JSON 格式，使用 Bearer Token 认证。基础 URL：https://api.crm.com/v2。包含客户、联系人、线索、商机等资源的 CRUD 接口...',
    summary: 'RESTful API 完整接口文档',
    category: '技术文档',
    tags: ['API', '接口', '开发'],
    sourceUrl: 'https://docs.crm.com/api',
    createdAt: '2026-01-10 09:00:00',
    updatedAt: '2026-03-05 10:00:00',
  },
  {
    id: 'DOC006',
    title: '系统部署指南 - 私有化部署',
    content: '本指南适用于需要在本地服务器部署 CRM 系统的场景。系统要求：Linux Ubuntu 20.04+，8GB 内存，50GB 存储。部署步骤：1. 安装 Docker 2. 拉取镜像 3. 配置环境变量 4. 启动容器...',
    summary: '私有化部署的完整步骤和注意事项',
    category: '技术文档',
    tags: ['部署', 'Docker', '运维'],
    sourceUrl: 'https://docs.crm.com/deployment',
    createdAt: '2026-01-05 11:00:00',
    updatedAt: '2026-02-28 09:00:00',
  },
  {
    id: 'DOC007',
    title: '常见问题 FAQ',
    content: 'Q: 忘记密码怎么办？A: 在登录页面点击"忘记密码"，通过注册邮箱重置。Q: 如何导出数据？A: 在列表页面点击"导出"按钮，选择导出格式。Q: 支持移动端吗？A: 支持，提供 iOS 和 Android 应用...',
    summary: '常见问题解答汇总',
    category: '产品文档',
    tags: ['FAQ', '常见问题'],
    sourceUrl: 'https://docs.crm.com/faq',
    createdAt: '2026-01-25 15:00:00',
    updatedAt: '2026-03-12 11:00:00',
  },
  {
    id: 'DOC008',
    title: 'CRM 系统产品介绍 2026',
    content: 'CRM 系统是一款面向中小企业的客户关系管理软件。核心功能包括：客户 360°视图、销售流程管理、营销自动化、AI 智能助手、数据分析报表等。支持 SaaS 和私有化部署...',
    summary: '2026 版产品功能和优势介绍',
    category: '销售资料',
    tags: ['产品介绍', '销售'],
    sourceUrl: 'https://sales.crm.com/product',
    createdAt: '2026-02-10 10:00:00',
    updatedAt: '2026-03-01 14:00:00',
  },
  {
    id: 'DOC009',
    title: '某大型制造企业 CRM 实施案例',
    content: '客户背景：某大型制造企业，员工 5000+，年营收 50 亿。挑战：客户分散、销售流程不透明、数据孤岛。解决方案：部署 CRM 系统，整合客户数据，规范销售流程。成果：销售周期缩短 30%，客户满意度提升 25%...',
    summary: '大型制造企业 CRM 成功案例',
    category: '销售资料',
    tags: ['案例', '制造业', '成功故事'],
    sourceUrl: 'https://sales.crm.com/case-manufacturing',
    createdAt: '2026-02-20 14:00:00',
    updatedAt: '2026-02-25 16:00:00',
  },
  {
    id: 'DOC010',
    title: '新员工培训手册',
    content: '欢迎加入公司！本手册将帮助您快速了解 CRM 系统。第 1 天：账号激活、系统概览。第 2 天：客户管理基础。第 3 天：线索和商机管理。第 4 天：合同和回款。第 5 天：报表查看...',
    summary: '新员工 5 天培训计划',
    category: '培训资料',
    tags: ['培训', '新员工', '入门'],
    sourceUrl: 'https://training.crm.com/new-hire',
    createdAt: '2026-01-08 09:00:00',
    updatedAt: '2026-03-01 10:00:00',
  },
  {
    id: 'DOC011',
    title: '销售技巧进阶培训',
    content: '本课程面向有经验的销售人员。内容包括：客户需求挖掘、价值销售、谈判技巧、大客户管理、销售预测等。通过案例分析和角色扮演提升实战能力...',
    summary: '销售人员进阶技能培训课程',
    category: '培训资料',
    tags: ['培训', '销售技巧', '进阶'],
    sourceUrl: 'https://training.crm.com/advanced-sales',
    createdAt: '2026-02-05 11:00:00',
    updatedAt: '2026-02-28 15:00:00',
  },
  {
    id: 'DOC012',
    title: '系统故障排查手册',
    content: '常见问题排查：1. 无法登录：检查网络、清除缓存、重置密码。2. 页面加载慢：检查网络、清理浏览器缓存。3. 数据不显示：检查权限、刷新页面。4. 导出失败：检查数据量、尝试分批导出...',
    summary: '系统常见问题排查方法',
    category: '技术文档',
    tags: ['故障排查', '运维', '支持'],
    sourceUrl: 'https://docs.crm.com/troubleshooting',
    createdAt: '2026-01-12 10:00:00',
    updatedAt: '2026-03-08 14:00:00',
  },
];

/** 模拟搜索响应生成器 */
const generateSearchResponse = (query: string, topK: number = 5): SearchResponse => {
  const startTime = Date.now();
  
  // 简单的关键词匹配
  const queryLower = query.toLowerCase();
  const scoredDocs = knowledgeDocuments.map(doc => {
    let score = 0;
    const titleLower = doc.title.toLowerCase();
    const contentLower = doc.content.toLowerCase();
    const tagsLower = doc.tags.join(' ').toLowerCase();
    
    if (titleLower.includes(queryLower)) score += 0.5;
    if (contentLower.includes(queryLower)) score += 0.3;
    if (tagsLower.includes(queryLower)) score += 0.2;
    
    // 部分匹配
    const queryWords = queryLower.split(/\s+/);
    queryWords.forEach(word => {
      if (word.length > 2) {
        if (titleLower.includes(word)) score += 0.1;
        if (contentLower.includes(word)) score += 0.05;
      }
    });
    
    return { ...doc, relevanceScore: Math.min(score, 1) };
  });
  
  // 按相关度排序
  scoredDocs.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
  
  // 取前 K 个
  const topDocs = scoredDocs.slice(0, topK).map(({ relevanceScore, ...rest }) => rest);
  
  // 生成答案摘要
  const answer = topDocs.length > 0
    ? `根据知识库内容，${topDocs[0].summary}。相关文档包括：${topDocs.slice(0, 3).map(d => d.title).join('、')}。`
    : '未找到相关文档，请尝试其他关键词。';
  
  const processingTime = Date.now() - startTime;
  
  return {
    query,
    answer,
    documents: topDocs,
    sources: topDocs.map(d => ({
      title: d.title,
      url: d.sourceUrl,
      excerpt: d.content.substring(0, 100) + '...',
    })),
    confidence: topDocs.length > 0 ? Math.max(...scoredDocs.slice(0, topK).map(d => d.relevanceScore || 0)) : 0,
    processingTime,
  };
};

/** 执行搜索 */
export const searchKnowledge = (query: string, topK: number = 5): SearchResponse => {
  return generateSearchResponse(query, topK);
};

/** 获取文档详情 */
export const getDocumentById = (id: string): KnowledgeDocument | undefined => {
  return knowledgeDocuments.find(d => d.id === id);
};

/** 获取分类文档列表 */
export const getDocumentsByCategory = (category: string): KnowledgeDocument[] => {
  return knowledgeDocuments.filter(d => d.category === category);
};

/** 获取所有分类 */
export const getCategories = (): KnowledgeCategory[] => {
  return knowledgeCategories;
};
