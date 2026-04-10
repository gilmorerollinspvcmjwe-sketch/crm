/**
 * 自定义对象 Mock 数据
 * Custom Object Mock Data
 *
 * 提供 5 个示例自定义对象的完整 Mock 数据：
 * - Project (项目管理)
 * - Asset (资产管理)
 * - Contract (合同管理)
 * - KnowledgeArticle (知识库)
 * - Member (会员管理)
 */
import type {
  CustomObject,
  CustomObjectDefinition,
  CustomField,
  CustomObjectRecord,
  CustomObjectStatus,
  FieldType,
} from "@/types/customObject";

// ============================================
// 枚举值引用（从 types 导入）
// ============================================

const CustomObjectStatusEnum = {
  DRAFT: 'draft' as CustomObjectStatus,
  ACTIVE: 'active' as CustomObjectStatus,
  ARCHIVED: 'archived' as CustomObjectStatus,
};

const FieldTypeEnum = {
  TEXT: 'text' as FieldType,
  NUMBER: 'number' as FieldType,
  DATE: 'date' as FieldType,
  DATETIME: 'datetime' as FieldType,
  BOOLEAN: 'boolean' as FieldType,
  PICKLIST: 'picklist' as FieldType,
  MULTIPICKLIST: 'multipicklist' as FieldType,
  LOOKUP: 'lookup' as FieldType,
  FILE: 'file' as FieldType,
};

// ============================================
// 字段定义辅助函数
// ============================================

function createField(
  id: string,
  name: string,
  label: string,
  type: FieldType,
  options?: {
    required?: boolean;
    unique?: boolean;
    defaultValue?: unknown;
    picklistOptions?: string[];
    listVisible?: boolean;
    detailVisible?: boolean;
    searchable?: boolean;
    sortable?: boolean;
    bulkEditable?: boolean;
    sortOrder?: number;
    enabled?: boolean;
  }
): CustomField {
  return {
    id,
    name,
    label,
    type,
    required: options?.required ?? false,
    unique: options?.unique ?? false,
    defaultValue: options?.defaultValue,
    picklistOptions: options?.picklistOptions,
    listVisible: options?.listVisible ?? true,
    detailVisible: options?.detailVisible ?? true,
    searchable: options?.searchable ?? true,
    sortable: options?.sortable ?? true,
    bulkEditable: options?.bulkEditable ?? true,
    sortOrder: options?.sortOrder ?? 0,
    enabled: options?.enabled ?? true,
  };
}

// ============================================
// 1. Project (项目管理对象)
// ============================================

export const projectObject: CustomObject = {
  id: 'obj-project',
  name: 'Project',
  label: '项目',
  pluralLabel: '项目',
  description: '项目管理与进度跟踪',
  icon: 'FolderKanban',
  iconColor: '#3b82f6',
  status: CustomObjectStatusEnum.ACTIVE,
  isSystem: false,
  sortOrder: 1,
  showInNavigation: true,
  createdBy: 'user_001',
  createdAt: '2024-01-15T08:00:00Z',
  updatedAt: '2024-06-01T10:00:00Z',
};

export const projectFields: CustomField[] = [
  createField('proj-f1', 'projectName', '项目名称', FieldTypeEnum.TEXT, { required: true, sortOrder: 1 }),
  createField('proj-f2', 'startDate', '开始日期', FieldTypeEnum.DATE, { required: true, sortOrder: 2 }),
  createField('proj-f3', 'endDate', '结束日期', FieldTypeEnum.DATE, { sortOrder: 3 }),
  createField('proj-f4', 'budget', '预算', FieldTypeEnum.NUMBER, { sortOrder: 4, defaultValue: 0 }),
  createField('proj-f5', 'status', '状态', FieldTypeEnum.PICKLIST, {
    required: true,
    picklistOptions: ['规划中', '进行中', '已完成', '已取消'],
    sortOrder: 5,
  }),
  createField('proj-f6', 'priority', '优先级', FieldTypeEnum.PICKLIST, {
    picklistOptions: ['高', '中', '低'],
    sortOrder: 6,
  }),
  createField('proj-f7', 'description', '描述', FieldTypeEnum.TEXT, { sortOrder: 7 }),
  createField('proj-f8', 'isBillable', '可计费', FieldTypeEnum.BOOLEAN, { defaultValue: false, sortOrder: 8 }),
  createField('proj-f9', 'progress', '进度', FieldTypeEnum.NUMBER, { defaultValue: 0, sortOrder: 9 }),
  createField('proj-f10', 'owner', '负责人', FieldTypeEnum.TEXT, { sortOrder: 10 }),
];

export const projectDefinition: CustomObjectDefinition = {
  ...projectObject,
  fields: projectFields,
};

// ============================================
// 2. Asset (资产管理对象)
// ============================================

export const assetObject: CustomObject = {
  id: 'obj-asset',
  name: 'Asset',
  label: '资产',
  pluralLabel: '资产',
  description: '企业资产登记与管理',
  icon: 'Laptop',
  iconColor: '#10b981',
  status: CustomObjectStatusEnum.ACTIVE,
  isSystem: false,
  sortOrder: 2,
  showInNavigation: true,
  createdBy: 'user_001',
  createdAt: '2024-01-20T09:00:00Z',
  updatedAt: '2024-05-15T14:30:00Z',
};

export const assetFields: CustomField[] = [
  createField('ast-f1', 'assetName', '资产名称', FieldTypeEnum.TEXT, { required: true, sortOrder: 1 }),
  createField('ast-f2', 'assetCode', '资产编号', FieldTypeEnum.TEXT, { required: true, unique: true, sortOrder: 2 }),
  createField('ast-f3', 'assetType', '资产类型', FieldTypeEnum.PICKLIST, {
    required: true,
    picklistOptions: ['设备', '软件', '车辆', '其他'],
    sortOrder: 3,
  }),
  createField('ast-f4', 'purchaseDate', '购买日期', FieldTypeEnum.DATE, { sortOrder: 4 }),
  createField('ast-f5', 'value', '价值', FieldTypeEnum.NUMBER, { sortOrder: 5, defaultValue: 0 }),
  createField('ast-f6', 'status', '状态', FieldTypeEnum.PICKLIST, {
    picklistOptions: ['正常使用', '维修中', '已报废', '已借出'],
    sortOrder: 6,
  }),
  createField('ast-f7', 'assignedTo', '使用人', FieldTypeEnum.TEXT, { sortOrder: 7 }),
  createField('ast-f8', 'department', '部门', FieldTypeEnum.TEXT, { sortOrder: 8 }),
  createField('ast-f9', 'location', '存放位置', FieldTypeEnum.TEXT, { sortOrder: 9 }),
  createField('ast-f10', 'serialNumber', '序列号', FieldTypeEnum.TEXT, { sortOrder: 10 }),
];

export const assetDefinition: CustomObjectDefinition = {
  ...assetObject,
  fields: assetFields,
};

// ============================================
// 3. Contract (合同管理对象)
// ============================================

export const contractObject: CustomObject = {
  id: 'obj-contract',
  name: 'Contract',
  label: '合同',
  pluralLabel: '合同',
  description: '合同文档与履行管理',
  icon: 'FileText',
  iconColor: '#8b5cf6',
  status: CustomObjectStatusEnum.ACTIVE,
  isSystem: false,
  sortOrder: 3,
  showInNavigation: true,
  createdBy: 'user_002',
  createdAt: '2024-02-01T10:00:00Z',
  updatedAt: '2024-06-10T09:00:00Z',
};

export const contractFields: CustomField[] = [
  createField('con-f1', 'contractName', '合同名称', FieldTypeEnum.TEXT, { required: true, sortOrder: 1 }),
  createField('con-f2', 'contractNumber', '合同编号', FieldTypeEnum.TEXT, { required: true, unique: true, sortOrder: 2 }),
  createField('con-f3', 'contractType', '合同类型', FieldTypeEnum.PICKLIST, {
    required: true,
    picklistOptions: ['销售', '采购', '租赁', '服务'],
    sortOrder: 3,
  }),
  createField('con-f4', 'signDate', '签约日期', FieldTypeEnum.DATE, { sortOrder: 4 }),
  createField('con-f5', 'startDate', '开始日期', FieldTypeEnum.DATE, { sortOrder: 5 }),
  createField('con-f6', 'endDate', '到期日期', FieldTypeEnum.DATE, { sortOrder: 6 }),
  createField('con-f7', 'amount', '金额', FieldTypeEnum.NUMBER, { required: true, defaultValue: 0, sortOrder: 7 }),
  createField('con-f8', 'status', '状态', FieldTypeEnum.PICKLIST, {
    picklistOptions: ['草稿', '审批中', '已生效', '已到期', '已终止'],
    sortOrder: 8,
  }),
  createField('con-f9', 'counterparty', '对手方', FieldTypeEnum.TEXT, { sortOrder: 9 }),
  createField('con-f10', 'description', '备注', FieldTypeEnum.TEXT, { sortOrder: 10 }),
];

export const contractDefinition: CustomObjectDefinition = {
  ...contractObject,
  fields: contractFields,
};

// ============================================
// 4. KnowledgeArticle (知识库文章对象)
// ============================================

export const knowledgeArticleObject: CustomObject = {
  id: 'obj-knowledge-article',
  name: 'KnowledgeArticle',
  label: '知识库文章',
  pluralLabel: '知识库文章',
  description: '企业内部知识库文章管理',
  icon: 'BookOpen',
  iconColor: '#f59e0b',
  status: CustomObjectStatusEnum.ACTIVE,
  isSystem: false,
  sortOrder: 4,
  showInNavigation: true,
  createdBy: 'user_001',
  createdAt: '2024-02-10T11:00:00Z',
  updatedAt: '2024-06-05T16:00:00Z',
};

export const knowledgeArticleFields: CustomField[] = [
  createField('ka-f1', 'title', '标题', FieldTypeEnum.TEXT, { required: true, sortOrder: 1 }),
  createField('ka-f2', 'category', '分类', FieldTypeEnum.PICKLIST, {
    required: true,
    picklistOptions: ['产品介绍', '操作指南', '常见问题', '技术文档', '企业文化'],
    sortOrder: 2,
  }),
  createField('ka-f3', 'content', '内容', FieldTypeEnum.TEXT, { sortOrder: 3 }),
  createField('ka-f4', 'author', '作者', FieldTypeEnum.TEXT, { sortOrder: 4 }),
  createField('ka-f5', 'createdDate', '创建日期', FieldTypeEnum.DATE, { sortOrder: 5 }),
  createField('ka-f6', 'status', '状态', FieldTypeEnum.PICKLIST, {
    required: true,
    picklistOptions: ['草稿', '已发布', '已归档'],
    defaultValue: '草稿',
    sortOrder: 6,
  }),
  createField('ka-f7', 'tags', '标签', FieldTypeEnum.TEXT, { sortOrder: 7 }),
  createField('ka-f8', 'viewCount', '浏览次数', FieldTypeEnum.NUMBER, { defaultValue: 0, sortOrder: 8 }),
  createField('ka-f9', 'updatedDate', '更新日期', FieldTypeEnum.DATE, { sortOrder: 9 }),
  createField('ka-f10', 'isPublic', '公开', FieldTypeEnum.BOOLEAN, { defaultValue: false, sortOrder: 10 }),
];

export const knowledgeArticleDefinition: CustomObjectDefinition = {
  ...knowledgeArticleObject,
  fields: knowledgeArticleFields,
};

// ============================================
// 5. Member (会员对象)
// ============================================

export const memberObject: CustomObject = {
  id: 'obj-member',
  name: 'Member',
  label: '会员',
  pluralLabel: '会员',
  description: '会员信息与等级管理',
  icon: 'Users',
  iconColor: '#ec4899',
  status: CustomObjectStatusEnum.ACTIVE,
  isSystem: false,
  sortOrder: 5,
  showInNavigation: true,
  createdBy: 'user_002',
  createdAt: '2024-02-15T08:30:00Z',
  updatedAt: '2024-06-08T11:00:00Z',
};

export const memberFields: CustomField[] = [
  createField('mem-f1', 'memberCode', '会员编号', FieldTypeEnum.TEXT, { required: true, unique: true, sortOrder: 1 }),
  createField('mem-f2', 'name', '姓名', FieldTypeEnum.TEXT, { required: true, sortOrder: 2 }),
  createField('mem-f3', 'phone', '手机', FieldTypeEnum.TEXT, { required: true, sortOrder: 3 }),
  createField('mem-f4', 'email', '邮箱', FieldTypeEnum.TEXT, { sortOrder: 4 }),
  createField('mem-f5', 'memberLevel', '会员等级', FieldTypeEnum.PICKLIST, {
    required: true,
    picklistOptions: ['普通会员', '银卡会员', '金卡会员', '钻石会员'],
    defaultValue: '普通会员',
    sortOrder: 5,
  }),
  createField('mem-f6', 'points', '积分', FieldTypeEnum.NUMBER, { defaultValue: 0, sortOrder: 6 }),
  createField('mem-f7', 'registerDate', '注册日期', FieldTypeEnum.DATE, { sortOrder: 7 }),
  createField('mem-f8', 'status', '状态', FieldTypeEnum.PICKLIST, {
    picklistOptions: ['正常', '冻结', '注销'],
    defaultValue: '正常',
    sortOrder: 8,
  }),
  createField('mem-f9', 'birthday', '生日', FieldTypeEnum.DATE, { sortOrder: 9 }),
  createField('mem-f10', 'address', '地址', FieldTypeEnum.TEXT, { sortOrder: 10 }),
];

export const memberDefinition: CustomObjectDefinition = {
  ...memberObject,
  fields: memberFields,
};

// ============================================
// 导出所有自定义对象定义
// ============================================

export const customObjectDefinitions: CustomObjectDefinition[] = [
  projectDefinition,
  assetDefinition,
  contractDefinition,
  knowledgeArticleDefinition,
  memberDefinition,
];

// ============================================
// Mock 记录数据 (每个对象 15 条记录)
// ============================================

// ============ Project 记录 ============

export const projectRecords: CustomObjectRecord[] = [
  {
    id: 'proj-rec-001',
    objectName: 'Project',
    data: { projectName: 'CRM系统升级项目', startDate: '2024-03-01', endDate: '2024-08-31', budget: 500000, status: '进行中', priority: '高', description: '全新CRM系统架构升级', isBillable: true, progress: 45, owner: '张明' },
    createdBy: 'user_001',
    createdAt: '2024-03-01T09:00:00Z',
  },
  {
    id: 'proj-rec-002',
    objectName: 'Project',
    data: { projectName: '移动端APP开发', startDate: '2024-06-01', endDate: '2024-12-31', budget: 300000, status: '规划中', priority: '中', description: 'iOS/Android双平台APP开发', isBillable: true, progress: 10, owner: '李华' },
    createdBy: 'user_001',
    createdAt: '2024-05-15T10:00:00Z',
  },
  {
    id: 'proj-rec-003',
    objectName: 'Project',
    data: { projectName: '数据中心迁移', startDate: '2024-01-15', endDate: '2024-06-30', budget: 800000, status: '暂停', priority: '高', description: '本地数据中心迁移至云端', isBillable: false, progress: 30, owner: '王芳' },
    createdBy: 'user_002',
    createdAt: '2024-01-10T08:00:00Z',
  },
  {
    id: 'proj-rec-004',
    objectName: 'Project',
    data: { projectName: '办公自动化系统', startDate: '2023-06-01', endDate: '2023-12-31', budget: 200000, status: '已完成', priority: '中', description: 'OA系统全新改版', isBillable: true, progress: 100, owner: '刘强' },
    createdBy: 'user_001',
    createdAt: '2023-06-01T09:00:00Z',
  },
  {
    id: 'proj-rec-005',
    objectName: 'Project',
    data: { projectName: '网络安全加固', startDate: '2024-04-01', endDate: '2024-09-30', budget: 150000, status: '进行中', priority: '高', description: '企业网络安全全面加固', isBillable: false, progress: 20, owner: '赵敏' },
    createdBy: 'user_003',
    createdAt: '2024-04-01T10:00:00Z',
  },
  {
    id: 'proj-rec-006',
    objectName: 'Project',
    data: { projectName: '供应链系统优化', startDate: '2024-07-01', endDate: '2025-03-31', budget: 400000, status: '规划中', priority: '中', description: 'SCM系统智能化升级', isBillable: true, progress: 5, owner: '陈伟' },
    createdBy: 'user_002',
    createdAt: '2024-06-20T11:00:00Z',
  },
  {
    id: 'proj-rec-007',
    objectName: 'Project',
    data: { projectName: '客户数据平台建设', startDate: '2024-02-01', endDate: '2024-12-31', budget: 600000, status: '进行中', priority: '高', description: 'CDP客户数据平台', isBillable: true, progress: 55, owner: '张明' },
    createdBy: 'user_001',
    createdAt: '2024-02-01T08:30:00Z',
  },
  {
    id: 'proj-rec-008',
    objectName: 'Project',
    data: { projectName: 'BI报表系统', startDate: '2023-09-01', endDate: '2024-02-28', budget: 180000, status: '已完成', priority: '低', description: '自助BI分析平台', isBillable: false, progress: 100, owner: '李娜' },
    createdBy: 'user_003',
    createdAt: '2023-09-01T09:00:00Z',
  },
  {
    id: 'proj-rec-009',
    objectName: 'Project',
    data: { projectName: '人力资源系统升级', startDate: '2024-03-15', endDate: '2024-10-31', budget: 250000, status: '进行中', priority: '中', description: 'HR系统功能扩展', isBillable: false, progress: 35, owner: '王丽' },
    createdBy: 'user_002',
    createdAt: '2024-03-15T10:00:00Z',
  },
  {
    id: 'proj-rec-010',
    objectName: 'Project',
    data: { projectName: '客服系统智能化', startDate: '2024-01-10', endDate: '2024-07-31', budget: 350000, status: '已取消', priority: '中', description: 'AI客服机器人项目', isBillable: true, progress: 0, owner: '周杰' },
    createdBy: 'user_001',
    createdAt: '2024-01-08T08:00:00Z',
  },
  {
    id: 'proj-rec-011',
    objectName: 'Project',
    data: { projectName: '营销自动化平台', startDate: '2024-05-01', endDate: '2025-02-28', budget: 420000, status: '进行中', priority: '高', description: 'MA营销自动化', isBillable: true, progress: 15, owner: '刘芳' },
    createdBy: 'user_003',
    createdAt: '2024-05-01T09:00:00Z',
  },
  {
    id: 'proj-rec-012',
    objectName: 'Project',
    data: { projectName: '财务共享中心', startDate: '2024-08-01', endDate: '2025-06-30', budget: 550000, status: '规划中', priority: '高', description: '财务共享服务平台', isBillable: false, progress: 0, owner: '吴涛' },
    createdBy: 'user_002',
    createdAt: '2024-07-20T10:00:00Z',
  },
  {
    id: 'proj-rec-013',
    objectName: 'Project',
    data: { projectName: '仓储管理系统', startDate: '2024-04-15', endDate: '2024-11-30', budget: 280000, status: '进行中', priority: '中', description: 'WMS仓库管理系统', isBillable: true, progress: 40, owner: '孙琳' },
    createdBy: 'user_001',
    createdAt: '2024-04-15T09:00:00Z',
  },
  {
    id: 'proj-rec-014',
    objectName: 'Project',
    data: { projectName: '视频会议系统', startDate: '2024-06-10', endDate: '2024-09-30', budget: 120000, status: '已完成', priority: '低', description: '企业视频会议平台', isBillable: false, progress: 100, owner: '马云' },
    createdBy: 'user_003',
    createdAt: '2024-06-10T08:00:00Z',
  },
  {
    id: 'proj-rec-015',
    objectName: 'Project',
    data: { projectName: '呼叫中心系统', startDate: '2024-03-20', endDate: '2024-12-20', budget: 380000, status: '进行中', priority: '高', description: '呼叫中心平台升级', isBillable: true, progress: 60, owner: '赵敏' },
    createdBy: 'user_002',
    createdAt: '2024-03-20T10:00:00Z',
  },
];

// ============ Asset 记录 ============

export const assetRecords: CustomObjectRecord[] = [
  {
    id: 'asset-rec-001',
    objectName: 'Asset',
    data: { assetName: 'MacBook Pro 16寸', assetCode: 'AST-HW-001', assetType: '设备', purchaseDate: '2023-06-15', value: 24999, status: '正常使用', assignedTo: '张明', department: '研发部', location: '001工位', serialNumber: 'C02X1234ABCD' },
    createdBy: 'user_001',
    createdAt: '2023-06-20T09:00:00Z',
  },
  {
    id: 'asset-rec-002',
    objectName: 'Asset',
    data: { assetName: 'Dell显示器 27寸', assetCode: 'AST-HW-002', assetType: '设备', purchaseDate: '2023-06-15', value: 4599, status: '正常使用', assignedTo: '张明', department: '研发部', location: '001工位', serialNumber: 'DELL2023MX789' },
    createdBy: 'user_001',
    createdAt: '2023-06-20T09:30:00Z',
  },
  {
    id: 'asset-rec-003',
    objectName: 'Asset',
    data: { assetName: 'Microsoft 365企业版', assetCode: 'AST-SW-001', assetType: '软件', purchaseDate: '2024-01-01', value: 2999, status: '正常使用', assignedTo: '全体员工', department: 'IT部', location: '云端', serialNumber: 'MS365-ENT-4567' },
    createdBy: 'user_002',
    createdAt: '2024-01-05T10:00:00Z',
  },
  {
    id: 'asset-rec-004',
    objectName: 'Asset',
    data: { assetName: 'ThinkPad X1 Carbon', assetCode: 'AST-HW-003', assetType: '设备', purchaseDate: '2022-11-10', value: 12999, status: '维修中', assignedTo: '李华', department: '销售部', location: 'IT维修间', serialNumber: 'LNV-2022-X1C890' },
    createdBy: 'user_001',
    createdAt: '2022-11-15T08:00:00Z',
  },
  {
    id: 'asset-rec-005',
    objectName: 'Asset',
    data: { assetName: 'Adobe Creative Cloud', assetCode: 'AST-SW-002', assetType: '软件', purchaseDate: '2024-02-01', value: 5999, status: '正常使用', assignedTo: '设计部', department: '设计部', location: '设计部共享', serialNumber: 'ADOBE-CC-2345' },
    createdBy: 'user_003',
    createdAt: '2024-02-05T09:00:00Z',
  },
  {
    id: 'asset-rec-006',
    objectName: 'Asset',
    data: { assetName: '会议室投影仪', assetCode: 'AST-HW-004', assetType: '设备', purchaseDate: '2021-03-20', value: 8999, status: '正常使用', assignedTo: '行政部', department: '行政部', location: '会议室A', serialNumber: 'EPSON-2021-567' },
    createdBy: 'user_002',
    createdAt: '2021-03-25T10:00:00Z',
  },
  {
    id: 'asset-rec-007',
    objectName: 'Asset',
    data: { assetName: '丰田凯美瑞', assetCode: 'AST-VH-001', assetType: '车辆', purchaseDate: '2023-01-15', value: 220000, status: '正常使用', assignedTo: '王总', department: '高管', location: '停车场B区', serialNumber: 'LJMG8A5C5PA123456' },
    createdBy: 'user_001',
    createdAt: '2023-01-20T09:00:00Z',
  },
  {
    id: 'asset-rec-008',
    objectName: 'Asset',
    data: { assetName: 'iPhone 15 Pro', assetCode: 'AST-HW-005', assetType: '设备', purchaseDate: '2023-10-01', value: 9999, status: '已报废', assignedTo: '已回收', department: '库存', location: '仓库', serialNumber: 'IP15P-2023-789' },
    createdBy: 'user_001',
    createdAt: '2023-10-05T09:00:00Z',
  },
  {
    id: 'asset-rec-009',
    objectName: 'Asset',
    data: { assetName: 'Slack企业版', assetCode: 'AST-SW-003', assetType: '软件', purchaseDate: '2024-01-01', value: 1999, status: '正常使用', assignedTo: '全体员工', department: 'IT部', location: '云端', serialNumber: 'SLACK-ENT-123' },
    createdBy: 'user_002',
    createdAt: '2024-01-05T10:00:00Z',
  },
  {
    id: 'asset-rec-010',
    objectName: 'Asset',
    data: { assetName: '机械键盘 Keychron K4', assetCode: 'AST-HW-006', assetType: '设备', purchaseDate: '2024-04-10', value: 899, status: '正常使用', assignedTo: '王芳', department: '研发部', location: '002工位', serialNumber: 'KC-K4-2024-45' },
    createdBy: 'user_001',
    createdAt: '2024-04-15T09:00:00Z',
  },
  {
    id: 'asset-rec-011',
    objectName: 'Asset',
    data: { assetName: '企业路由器 Cisco', assetCode: 'AST-HW-007', assetType: '设备', purchaseDate: '2023-08-01', value: 3999, status: '正常使用', assignedTo: 'IT部', department: 'IT部', location: '机房', serialNumber: 'CISCO-RT-8901' },
    createdBy: 'user_002',
    createdAt: '2023-08-10T08:00:00Z',
  },
  {
    id: 'asset-rec-012',
    objectName: 'Asset',
    data: { assetName: 'GitHub Enterprise', assetCode: 'AST-SW-004', assetType: '软件', purchaseDate: '2024-01-01', value: 3999, status: '正常使用', assignedTo: '研发部', department: '研发部', location: '云端', serialNumber: 'GH-ENT-5678' },
    createdBy: 'user_001',
    createdAt: '2024-01-05T10:00:00Z',
  },
  {
    id: 'asset-rec-013',
    objectName: 'Asset',
    data: { assetName: '保险柜', assetCode: 'AST-OT-001', assetType: '其他', purchaseDate: '2020-05-01', value: 2500, status: '正常使用', assignedTo: '财务部', department: '财务部', location: '财务室', serialNumber: 'SAFE-2020-001' },
    createdBy: 'user_002',
    createdAt: '2020-05-10T09:00:00Z',
  },
  {
    id: 'asset-rec-014',
    objectName: 'Asset',
    data: { assetName: 'NAS网络存储', assetCode: 'AST-HW-008', assetType: '设备', purchaseDate: '2023-11-01', value: 8500, status: '正常使用', assignedTo: 'IT部', department: 'IT部', location: '机房', serialNumber: 'Synology-DS920-2023' },
    createdBy: 'user_001',
    createdAt: '2023-11-05T10:00:00Z',
  },
  {
    id: 'asset-rec-015',
    objectName: 'Asset',
    data: { assetName: ' Jetson Nano开发板', assetCode: 'AST-HW-009', assetType: '设备', purchaseDate: '2024-05-15', value: 1299, status: '已借出', assignedTo: '刘博士', department: 'AI实验室', location: 'AI实验室', serialNumber: 'JN-Nano-2024-001' },
    createdBy: 'user_003',
    createdAt: '2024-05-20T08:00:00Z',
  },
];

// ============ Contract 记录 ============

export const contractRecords: CustomObjectRecord[] = [
  {
    id: 'contract-rec-001',
    objectName: 'Contract',
    data: { contractName: 'AWS云服务年度合同', contractNumber: 'CT-2024-001', contractType: '服务', signDate: '2024-01-15', startDate: '2024-02-01', endDate: '2025-01-31', amount: 580000, status: '已生效', counterparty: '亚马逊AWS', description: 'AWS云服务年度采购' },
    createdBy: 'user_001',
    createdAt: '2024-01-15T09:00:00Z',
  },
  {
    id: 'contract-rec-002',
    objectName: 'Contract',
    data: { contractName: '办公设备采购合同', contractNumber: 'CT-2024-002', contractType: '采购', signDate: '2024-03-10', startDate: '2024-03-15', endDate: '2024-06-15', amount: 125000, status: '已完成', counterparty: '京东企业购', description: '办公电脑及显示器采购' },
    createdBy: 'user_002',
    createdAt: '2024-03-10T10:00:00Z',
  },
  {
    id: 'contract-rec-003',
    objectName: 'Contract',
    data: { contractName: '软件外包开发合同', contractNumber: 'CT-2024-003', contractType: '服务', signDate: '2024-02-20', startDate: '2024-03-01', endDate: '2024-08-31', amount: 350000, status: '已生效', counterparty: '软通动力', description: 'CRM系统二次开发' },
    createdBy: 'user_001',
    createdAt: '2024-02-20T08:00:00Z',
  },
  {
    id: 'contract-rec-004',
    objectName: 'Contract',
    data: { contractName: '办公楼租赁合同', contractNumber: 'CT-2023-015', contractType: '租赁', signDate: '2023-12-01', startDate: '2024-01-01', endDate: '2026-12-31', amount: 960000, status: '已生效', counterparty: '恒隆广场物业', description: '总部办公室续租' },
    createdBy: 'user_003',
    createdAt: '2023-12-01T09:00:00Z',
  },
  {
    id: 'contract-rec-005',
    objectName: 'Contract',
    data: { contractName: '产品销售合同-深圳华强', contractNumber: 'CT-2024-004', contractType: '销售', signDate: '2024-04-05', startDate: '2024-04-10', endDate: '2024-10-10', amount: 2800000, status: '已生效', counterparty: '深圳华强电子', description: '电子元器件批量销售' },
    createdBy: 'user_002',
    createdAt: '2024-04-05T10:00:00Z',
  },
  {
    id: 'contract-rec-006',
    objectName: 'Contract',
    data: { contractName: '法律顾问服务合同', contractNumber: 'CT-2024-005', contractType: '服务', signDate: '2024-01-01', startDate: '2024-01-01', endDate: '2024-12-31', amount: 120000, status: '已生效', counterparty: '中伦律师事务所', description: '常年法律顾问服务' },
    createdBy: 'user_001',
    createdAt: '2024-01-01T08:00:00Z',
  },
  {
    id: 'contract-rec-007',
    objectName: 'Contract',
    data: { contractName: '员工团险合同', contractNumber: 'CT-2024-006', contractType: '服务', signDate: '2024-01-01', startDate: '2024-01-01', endDate: '2024-12-31', amount: 85000, status: '已生效', counterparty: '平安保险', description: '员工商业保险采购' },
    createdBy: 'user_003',
    createdAt: '2024-01-05T09:00:00Z',
  },
  {
    id: 'contract-rec-008',
    objectName: 'Contract',
    data: { contractName: '广告投放合同-抖音', contractNumber: 'CT-2024-007', contractType: '服务', signDate: '2024-05-01', startDate: '2024-05-01', endDate: '2024-10-31', amount: 500000, status: '已生效', counterparty: '字节跳动', description: '品牌推广广告投放' },
    createdBy: 'user_002',
    createdAt: '2024-05-01T10:00:00Z',
  },
  {
    id: 'contract-rec-009',
    objectName: 'Contract',
    data: { contractName: '服务器采购合同', contractNumber: 'CT-2024-008', contractType: '采购', signDate: '2024-02-15', startDate: '2024-03-01', endDate: '2024-05-31', amount: 450000, status: '已完成', counterparty: '联想企业购', description: '数据库服务器采购' },
    createdBy: 'user_001',
    createdAt: '2024-02-15T08:00:00Z',
  },
  {
    id: 'contract-rec-010',
    objectName: 'Contract',
    data: { contractName: '培训服务合同', contractNumber: 'CT-2024-009', contractType: '服务', signDate: '2024-03-20', startDate: '2024-04-01', endDate: '2024-09-30', amount: 68000, status: '已到期', counterparty: '麦肯锡培训', description: '管理层领导力培训' },
    createdBy: 'user_002',
    createdAt: '2024-03-20T09:00:00Z',
  },
  {
    id: 'contract-rec-011',
    objectName: 'Contract',
    data: { contractName: 'CRM实施项目合同', contractNumber: 'CT-2024-010', contractType: '服务', signDate: '2024-06-01', startDate: '2024-06-15', endDate: '2025-06-14', amount: 680000, status: '审批中', counterparty: 'Salesforce实施商', description: 'Salesforce实施与定制' },
    createdBy: 'user_001',
    createdAt: '2024-06-01T10:00:00Z',
  },
  {
    id: 'contract-rec-012',
    objectName: 'Contract',
    data: { contractName: '办公家具采购', contractNumber: 'CT-2024-011', contractType: '采购', signDate: '2024-04-15', startDate: '2024-05-01', endDate: '2024-07-31', amount: 180000, status: '已终止', counterparty: '宜家企业购', description: '新办公室家具采购' },
    createdBy: 'user_003',
    createdAt: '2024-04-15T08:00:00Z',
  },
  {
    id: 'contract-rec-013',
    objectName: 'Contract',
    data: { contractName: '微信朋友圈广告合同', contractNumber: 'CT-2024-012', contractType: '服务', signDate: '2024-06-10', startDate: '2024-06-15', endDate: '2024-12-15', amount: 300000, status: '已生效', counterparty: '腾讯广告', description: '产品推广广告投放' },
    createdBy: 'user_002',
    createdAt: '2024-06-10T09:00:00Z',
  },
  {
    id: 'contract-rec-014',
    objectName: 'Contract',
    data: { contractName: '人才招聘服务合同', contractNumber: 'CT-2024-013', contractType: '服务', signDate: '2024-05-20', startDate: '2024-06-01', endDate: '2024-11-30', amount: 150000, status: '已生效', counterparty: '猎聘网', description: '中高端人才猎头服务' },
    createdBy: 'user_001',
    createdAt: '2024-05-20T10:00:00Z',
  },
  {
    id: 'contract-rec-015',
    objectName: 'Contract',
    data: { contractName: '机房运维合同', contractNumber: 'CT-2024-014', contractType: '服务', signDate: '2024-03-01', startDate: '2024-03-15', endDate: '2025-03-14', amount: 200000, status: '已生效', counterparty: '浪潮信息', description: '数据中心运维服务' },
    createdBy: 'user_003',
    createdAt: '2024-03-01T08:00:00Z',
  },
];

// ============ KnowledgeArticle 记录 ============

export const knowledgeArticleRecords: CustomObjectRecord[] = [
  {
    id: 'ka-rec-001',
    objectName: 'KnowledgeArticle',
    data: { title: 'CRM系统快速入门指南', category: '操作指南', content: '本文介绍CRM系统的基本操作流程，包括客户创建、跟进记录、商机管理等功能。', author: '张明', createdDate: '2024-01-10', status: '已发布', tags: '入门,CRM,操作', viewCount: 1256, updatedDate: '2024-05-01', isPublic: true },
    createdBy: 'user_001',
    createdAt: '2024-01-10T09:00:00Z',
  },
  {
    id: 'ka-rec-002',
    objectName: 'KnowledgeArticle',
    data: { title: '产品A规格说明书', category: '产品介绍', content: '详细介绍产品A的技术规格、功能特性、应用场景及竞争优势。', author: '李华', createdDate: '2024-02-15', status: '已发布', tags: '产品A,规格,技术', viewCount: 892, updatedDate: '2024-06-01', isPublic: true },
    createdBy: 'user_002',
    createdAt: '2024-02-15T10:00:00Z',
  },
  {
    id: 'ka-rec-003',
    objectName: 'KnowledgeArticle',
    data: { title: '如何重置账户密码', category: '常见问题', content: '当您忘记密码时，可以通过以下步骤重置：1.点击登录页"忘记密码" 2.输入注册邮箱 3.查收重置邮件 4.设置新密码', author: '王芳', createdDate: '2024-03-01', status: '已发布', tags: '密码,账户,FAQ', viewCount: 2341, updatedDate: '2024-04-15', isPublic: true },
    createdBy: 'user_001',
    createdAt: '2024-03-01T08:00:00Z',
  },
  {
    id: 'ka-rec-004',
    objectName: 'KnowledgeArticle',
    data: { title: 'API接口开发文档', category: '技术文档', content: 'REST API接口规范、认证方式、请求响应示例、错误码说明。', author: '刘强', createdDate: '2024-03-20', status: '已发布', tags: 'API,开发,接口', viewCount: 567, updatedDate: '2024-06-10', isPublic: false },
    createdBy: 'user_003',
    createdAt: '2024-03-20T09:00:00Z',
  },
  {
    id: 'ka-rec-005',
    objectName: 'KnowledgeArticle',
    data: { title: '企业文化手册', category: '企业文化', content: '公司愿景、使命、价值观，行为准则，团队建设理念。', author: '赵敏', createdDate: '2024-01-05', status: '已发布', tags: '文化,愿景,价值观', viewCount: 3201, updatedDate: '2024-01-05', isPublic: true },
    createdBy: 'user_002',
    createdAt: '2024-01-05T10:00:00Z',
  },
  {
    id: 'ka-rec-006',
    objectName: 'KnowledgeArticle',
    data: { title: '数据导入失败怎么办', category: '常见问题', content: '数据导入常见问题及解决方案：1.格式错误请使用模板 2.必填字段缺失 3.数据重复检查 4.特殊字符转义', author: '陈伟', createdDate: '2024-04-10', status: '已发布', tags: '导入,数据,FAQ', viewCount: 1087, updatedDate: '2024-05-20', isPublic: true },
    createdBy: 'user_001',
    createdAt: '2024-04-10T08:00:00Z',
  },
  {
    id: 'ka-rec-007',
    objectName: 'KnowledgeArticle',
    data: { title: '产品B市场定位分析', category: '产品介绍', content: '产品B的目标市场、竞争对手分析、差异化优势、价格策略。', author: '李娜', createdDate: '2024-05-01', status: '草稿', tags: '产品B,市场,定位', viewCount: 0, updatedDate: '2024-05-01', isPublic: false },
    createdBy: 'user_003',
    createdAt: '2024-05-01T09:00:00Z',
  },
  {
    id: 'ka-rec-008',
    objectName: 'KnowledgeArticle',
    data: { title: '报表自定义配置教程', category: '操作指南', content: '如何创建自定义报表：1.进入报表模块 2.点击新建报表 3.选择数据源 4.配置字段和筛选条件 5.保存并发布', author: '周杰', createdDate: '2024-04-25', status: '已发布', tags: '报表,自定义,教程', viewCount: 654, updatedDate: '2024-05-15', isPublic: true },
    createdBy: 'user_002',
    createdAt: '2024-04-25T10:00:00Z',
  },
  {
    id: 'ka-rec-009',
    objectName: 'KnowledgeArticle',
    data: { title: '员工考勤管理制度', category: '企业文化', content: '考勤时间、请假流程、迟到处理办法、弹性工作制说明。', author: '吴涛', createdDate: '2024-02-01', status: '已归档', tags: '考勤,制度,HR', viewCount: 1890, updatedDate: '2024-03-01', isPublic: true },
    createdBy: 'user_001',
    createdAt: '2024-02-01T08:00:00Z',
  },
  {
    id: 'ka-rec-010',
    objectName: 'KnowledgeArticle',
    data: { title: '数据库备份恢复流程', category: '技术文档', content: '每日自动备份、手动备份操作步骤、恢复数据注意事项、灾难恢复预案。', author: '刘芳', createdDate: '2024-03-15', status: '已发布', tags: '备份,数据库,运维', viewCount: 423, updatedDate: '2024-06-05', isPublic: false },
    createdBy: 'user_003',
    createdAt: '2024-03-15T09:00:00Z',
  },
  {
    id: 'ka-rec-011',
    objectName: 'KnowledgeArticle',
    data: { title: '新品发布会策划方案', category: '产品介绍', content: 'Q3新品发布会整体策划：时间地点、邀请名单、流程安排、媒体宣传、预算分配。', author: '孙琳', createdDate: '2024-06-01', status: '草稿', tags: '发布会,策划,新品', viewCount: 0, updatedDate: '2024-06-01', isPublic: false },
    createdBy: 'user_002',
    createdAt: '2024-06-01T10:00:00Z',
  },
  {
    id: 'ka-rec-012',
    objectName: 'KnowledgeArticle',
    data: { title: '常见网络问题排查', category: '常见问题', content: '无法上网、网速慢、VPN连接失败等常见网络问题的排查步骤和解决方案。', author: '马云', createdDate: '2024-05-10', status: '已发布', tags: '网络,故障,排查', viewCount: 1567, updatedDate: '2024-05-25', isPublic: true },
    createdBy: 'user_001',
    createdAt: '2024-05-10T08:00:00Z',
  },
  {
    id: 'ka-rec-013',
    objectName: 'KnowledgeArticle',
    data: { title: '代码审查规范', category: '技术文档', content: '代码审查标准：命名规范、注释要求、测试覆盖率、安全性检查、合入流程。', author: '张明', createdDate: '2024-04-01', status: '已发布', tags: '代码,审查,规范', viewCount: 312, updatedDate: '2024-05-01', isPublic: false },
    createdBy: 'user_003',
    createdAt: '2024-04-01T09:00:00Z',
  },
  {
    id: 'ka-rec-014',
    objectName: 'KnowledgeArticle',
    data: { title: '客户拜访话术参考', category: '操作指南', content: '首次拜访、需求了解、方案展示、异议处理、促成签单等环节的标准话术。', author: '王丽', createdDate: '2024-03-25', status: '已发布', tags: '销售,话术,拜访', viewCount: 987, updatedDate: '2024-04-20', isPublic: true },
    createdBy: 'user_002',
    createdAt: '2024-03-25T10:00:00Z',
  },
  {
    id: 'ka-rec-015',
    objectName: 'KnowledgeArticle',
    data: { title: '年会活动精彩回顾', category: '企业文化', content: '2024年度年会盛况：颁奖典礼、节目表演、抽奖环节、团队合影。', author: '赵敏', createdDate: '2024-02-10', status: '已归档', tags: '年会,活动,回顾', viewCount: 4521, updatedDate: '2024-02-10', isPublic: true },
    createdBy: 'user_001',
    createdAt: '2024-02-10T08:00:00Z',
  },
];

// ============ Member 记录 ============

export const memberRecords: CustomObjectRecord[] = [
  {
    id: 'member-rec-001',
    objectName: 'Member',
    data: { memberCode: 'MB-2024-001', name: '张三', phone: '13800138001', email: 'zhangsan@email.com', memberLevel: '钻石会员', points: 125680, registerDate: '2022-01-15', status: '正常', birthday: '1990-05-20', address: '北京市朝阳区建国路88号' },
    createdBy: 'user_002',
    createdAt: '2022-01-15T09:00:00Z',
  },
  {
    id: 'member-rec-002',
    objectName: 'Member',
    data: { memberCode: 'MB-2024-002', name: '李四', phone: '13800138002', email: 'lisi@email.com', memberLevel: '金卡会员', points: 58920, registerDate: '2022-06-20', status: '正常', birthday: '1985-08-15', address: '上海市浦东新区世纪大道1000号' },
    createdBy: 'user_002',
    createdAt: '2022-06-20T10:00:00Z',
  },
  {
    id: 'member-rec-003',
    objectName: 'Member',
    data: { memberCode: 'MB-2024-003', name: '王五', phone: '13800138003', email: 'wangwu@email.com', memberLevel: '银卡会员', points: 23560, registerDate: '2023-03-10', status: '正常', birthday: '1992-11-30', address: '广州市天河区天河路123号' },
    createdBy: 'user_001',
    createdAt: '2023-03-10T08:00:00Z',
  },
  {
    id: 'member-rec-004',
    objectName: 'Member',
    data: { memberCode: 'MB-2024-004', name: '赵六', phone: '13800138004', email: 'zhaoliu@email.com', memberLevel: '普通会员', points: 3200, registerDate: '2023-09-25', status: '正常', birthday: '1988-03-08', address: '深圳市南山区科技园南路55号' },
    createdBy: 'user_002',
    createdAt: '2023-09-25T09:00:00Z',
  },
  {
    id: 'member-rec-005',
    objectName: 'Member',
    data: { memberCode: 'MB-2024-005', name: '孙七', phone: '13800138005', email: 'sunqi@email.com', memberLevel: '金卡会员', points: 78500, registerDate: '2022-04-18', status: '正常', birthday: '1991-12-25', address: '杭州市西湖区文一路88号' },
    createdBy: 'user_001',
    createdAt: '2022-04-18T10:00:00Z',
  },
  {
    id: 'member-rec-006',
    objectName: 'Member',
    data: { memberCode: 'MB-2024-006', name: '周八', phone: '13800138006', email: 'zhouba@email.com', memberLevel: '钻石会员', points: 198000, registerDate: '2021-11-05', status: '正常', birthday: '1987-07-14', address: '成都市高新区天府大道200号' },
    createdBy: 'user_003',
    createdAt: '2021-11-05T08:00:00Z',
  },
  {
    id: 'member-rec-007',
    objectName: 'Member',
    data: { memberCode: 'MB-2024-007', name: '吴九', phone: '13800138007', email: 'wujiu@email.com', memberLevel: '普通会员', points: 850, registerDate: '2024-01-20', status: '正常', birthday: '1995-09-03', address: '南京市鼓楼区中山路200号' },
    createdBy: 'user_002',
    createdAt: '2024-01-20T09:00:00Z',
  },
  {
    id: 'member-rec-008',
    objectName: 'Member',
    data: { memberCode: 'MB-2024-008', name: '郑十', phone: '13800138008', email: 'zhengshi@email.com', memberLevel: '银卡会员', points: 15800, registerDate: '2023-06-30', status: '冻结', birthday: '1993-04-18', address: '武汉市洪山区珞喻路100号' },
    createdBy: 'user_001',
    createdAt: '2023-06-30T10:00:00Z',
  },
  {
    id: 'member-rec-009',
    objectName: 'Member',
    data: { memberCode: 'MB-2024-009', name: '钱一', phone: '13800138009', email: 'qianyi@email.com', memberLevel: '金卡会员', points: 45600, registerDate: '2022-08-12', status: '正常', birthday: '1989-10-22', address: '西安市雁塔区雁塔路88号' },
    createdBy: 'user_003',
    createdAt: '2022-08-12T08:00:00Z',
  },
  {
    id: 'member-rec-010',
    objectName: 'Member',
    data: { memberCode: 'MB-2024-010', name: '沈二', phone: '13800138010', email: 'shener@email.com', memberLevel: '普通会员', points: 1250, registerDate: '2024-02-28', status: '正常', birthday: '1996-01-07', address: '重庆市渝北区新南路50号' },
    createdBy: 'user_002',
    createdAt: '2024-02-28T09:00:00Z',
  },
  {
    id: 'member-rec-011',
    objectName: 'Member',
    data: { memberCode: 'MB-2024-011', name: '马三', phone: '13800138011', email: 'masan@email.com', memberLevel: '银卡会员', points: 28900, registerDate: '2023-04-05', status: '正常', birthday: '1991-06-28', address: '天津市和平区南京路100号' },
    createdBy: 'user_001',
    createdAt: '2023-04-05T10:00:00Z',
  },
  {
    id: 'member-rec-012',
    objectName: 'Member',
    data: { memberCode: 'MB-2024-012', name: '朱四', phone: '13800138012', email: 'zhusi@email.com', memberLevel: '钻石会员', points: 256000, registerDate: '2020-12-01', status: '正常', birthday: '1984-02-14', address: '苏州市工业园区星海街200号' },
    createdBy: 'user_003',
    createdAt: '2020-12-01T08:00:00Z',
  },
  {
    id: 'member-rec-013',
    objectName: 'Member',
    data: { memberCode: 'MB-2024-013', name: '秦五', phone: '13800138013', email: 'qinwu@email.com', memberLevel: '普通会员', points: 450, registerDate: '2024-05-10', status: '注销', birthday: '1997-08-30', address: '长沙市岳麓区麓山南路88号' },
    createdBy: 'user_002',
    createdAt: '2024-05-10T09:00:00Z',
  },
  {
    id: 'member-rec-014',
    objectName: 'Member',
    data: { memberCode: 'MB-2024-014', name: '许六', phone: '13800138014', email: 'xuliu@email.com', memberLevel: '金卡会员', points: 67200, registerDate: '2022-10-25', status: '正常', birthday: '1990-11-16', address: '郑州市金水区花园路100号' },
    createdBy: 'user_001',
    createdAt: '2022-10-25T10:00:00Z',
  },
  {
    id: 'member-rec-015',
    objectName: 'Member',
    data: { memberCode: 'MB-2024-015', name: '何七', phone: '13800138015', email: 'heqi@email.com', memberLevel: '银卡会员', points: 18900, registerDate: '2023-08-15', status: '正常', birthday: '1994-05-05', address: '济南市历下区泉城路88号' },
    createdBy: 'user_003',
    createdAt: '2023-08-15T08:00:00Z',
  },
];

// ============================================
// 记录 Map（方便按对象名查找）
// ============================================

export const recordsMap: Record<string, CustomObjectRecord[]> = {
  Project: projectRecords,
  Asset: assetRecords,
  Contract: contractRecords,
  KnowledgeArticle: knowledgeArticleRecords,
  Member: memberRecords,
};

// ============================================
// 辅助函数
// ============================================

/**
 * 根据对象名称获取自定义对象定义
 */
export function getCustomObjectByName(name: string): CustomObjectDefinition | undefined {
  return customObjectDefinitions.find((obj) => obj.name === name);
}

/**
 * 根据对象ID获取自定义对象定义
 */
export function getCustomObjectById(id: string): CustomObjectDefinition | undefined {
  return customObjectDefinitions.find((obj) => obj.id === id);
}

/**
 * 获取所有自定义对象定义
 */
export function getCustomObjects(): CustomObjectDefinition[] {
  return customObjectDefinitions;
}

/**
 * 根据对象名称获取该对象的所有记录
 */
export function getRecordsByObjectName(objectName: string): CustomObjectRecord[] {
  return recordsMap[objectName] ?? [];
}

/**
 * 根据对象名称和记录ID获取单条记录
 */
export function getRecordById(objectName: string, recordId: string): CustomObjectRecord | undefined {
  const records = recordsMap[objectName] ?? [];
  return records.find((record) => record.id === recordId);
}

/**
 * 获取所有对象的统计信息
 */
export function getObjectStats(): { objectName: string; objectLabel: string; recordCount: number }[] {
  return customObjectDefinitions.map((obj) => ({
    objectName: obj.name,
    objectLabel: obj.label,
    recordCount: recordsMap[obj.name]?.length ?? 0,
  }));
}

// ============================================
// 导出枚举和类型（供外部使用）
// ============================================

export { CustomObjectStatusEnum as CustomObjectStatus, FieldTypeEnum as FieldType };

// ============================================
// 兼容旧代码的别名导出
// ============================================

/** @deprecated 使用 customObjectDefinitions 代替 */
export const mockCustomObjectDefinitions = customObjectDefinitions;

/** @deprecated 使用 customObjectDefinitions 代替 */
export const mockCustomObjects = customObjectDefinitions;

/**
 * 获取带记录的自定义对象
 * @deprecated 使用 getCustomObjectByName 和 getRecordsByObjectName 代替
 */
export function getMockObjectWithRecords(objectName: string): {
  definition: CustomObjectDefinition;
  records: CustomObjectRecord[];
} | undefined {
  const definition = getCustomObjectByName(objectName);
  if (!definition) return undefined;
  return {
    definition,
    records: getRecordsByObjectName(objectName),
  };
}

/**
 * 获取 Mock 记录
 * @deprecated 使用 getRecordsByObjectName 代替
 */
export function getMockRecords(objectName: string): CustomObjectRecord[] {
  return getRecordsByObjectName(objectName);
}

// ============================================
// 默认导出
// ============================================

export default {
  customObjectDefinitions,
  projectDefinition,
  assetDefinition,
  contractDefinition,
  knowledgeArticleDefinition,
  memberDefinition,
  projectRecords,
  assetRecords,
  contractRecords,
  knowledgeArticleRecords,
  memberRecords,
  getCustomObjectByName,
  getCustomObjectById,
  getCustomObjects,
  getRecordsByObjectName,
  getRecordById,
  getObjectStats,
};
