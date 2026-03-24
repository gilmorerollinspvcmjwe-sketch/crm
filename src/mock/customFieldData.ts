/**
 * 自定义字段 Mock 数据
 * @description 预置常用自定义字段和各模块字段值示例
 */
import { CustomField, FieldType, ModuleType, OptionsSet } from '../types/customField';

/**
 * 客户管理模块预置字段
 */
export const customerCustomFields: CustomField[] = [
  {
    id: 'cf_cust_001',
    name: 'customerType',
    label: '客户类型',
    type: FieldType.SELECT,
    modules: [ModuleType.CUSTOMER],
    required: true,
    options: ['直客', '渠道商', '代理商', '合作伙伴'],
    sortOrder: 1,
    listVisible: true,
    detailVisible: true,
    enabled: true,
    createdBy: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cf_cust_002',
    name: 'cooperationStartDate',
    label: '合作开始日期',
    type: FieldType.DATE,
    modules: [ModuleType.CUSTOMER],
    required: false,
    sortOrder: 2,
    listVisible: false,
    detailVisible: true,
    enabled: true,
    createdBy: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cf_cust_003',
    name: 'creditLimit',
    label: '信用额度',
    type: FieldType.NUMBER,
    modules: [ModuleType.CUSTOMER],
    required: false,
    validation: { min: 0 },
    sortOrder: 3,
    listVisible: true,
    detailVisible: true,
    enabled: true,
    createdBy: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cf_cust_004',
    name: 'vipFlag',
    label: 'VIP 标识',
    type: FieldType.SWITCH,
    modules: [ModuleType.CUSTOMER],
    required: false,
    defaultValue: false,
    sortOrder: 4,
    listVisible: true,
    detailVisible: true,
    enabled: true,
    createdBy: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cf_cust_005',
    name: 'customerTags',
    label: '客户标签',
    type: FieldType.MULTISELECT,
    modules: [ModuleType.CUSTOMER],
    required: false,
    options: ['重点客户', '战略合作', '长期合作', '高风险', '新客户'],
    sortOrder: 5,
    listVisible: false,
    detailVisible: true,
    enabled: true,
    createdBy: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cf_cust_006',
    name: 'taxNumber',
    label: '税号',
    type: FieldType.TEXT,
    modules: [ModuleType.CUSTOMER],
    required: false,
    validation: { pattern: '^[0-9A-Z]{15,20}$', errorMessage: '请输入 15-20 位税号' },
    sortOrder: 6,
    listVisible: false,
    detailVisible: true,
    enabled: true,
    createdBy: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
  },
];

/**
 * 联系人模块预置字段
 */
export const contactCustomFields: CustomField[] = [
  {
    id: 'cf_cont_001',
    name: 'nickname',
    label: '昵称',
    type: FieldType.TEXT,
    modules: [ModuleType.CONTACT],
    required: false,
    sortOrder: 1,
    listVisible: false,
    detailVisible: true,
    enabled: true,
    createdBy: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cf_cont_002',
    name: 'socialMedia',
    label: '社交媒体',
    type: FieldType.TEXT,
    modules: [ModuleType.CONTACT],
    required: false,
    placeholder: '微博/抖音等账号',
    sortOrder: 2,
    listVisible: false,
    detailVisible: true,
    enabled: true,
    createdBy: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cf_cont_003',
    name: 'decisionInfluence',
    label: '决策影响力',
    type: FieldType.SELECT,
    modules: [ModuleType.CONTACT],
    required: false,
    options: ['1-很低', '2-较低', '3-中等', '4-较高', '5-很高'],
    sortOrder: 3,
    listVisible: true,
    detailVisible: true,
    enabled: true,
    createdBy: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cf_cont_004',
    name: 'hobbies',
    label: '兴趣爱好',
    type: FieldType.MULTISELECT,
    modules: [ModuleType.CONTACT],
    required: false,
    options: ['高尔夫', '网球', '阅读', '音乐', '旅行', '摄影', '美食', '健身'],
    sortOrder: 4,
    listVisible: false,
    detailVisible: true,
    enabled: true,
    createdBy: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
  },
];

/**
 * 线索管理模块预置字段
 */
export const leadCustomFields: CustomField[] = [
  {
    id: 'cf_lead_001',
    name: 'preliminaryRequirement',
    label: '初步需求',
    type: FieldType.TEXTAREA,
    modules: [ModuleType.LEAD],
    required: false,
    sortOrder: 1,
    listVisible: false,
    detailVisible: true,
    enabled: true,
    createdBy: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cf_lead_002',
    name: 'competitors',
    label: '竞品考虑',
    type: FieldType.MULTISELECT,
    modules: [ModuleType.LEAD],
    required: false,
    options: ['竞品 A', '竞品 B', '竞品 C', '其他'],
    sortOrder: 2,
    listVisible: false,
    detailVisible: true,
    enabled: true,
    createdBy: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cf_lead_003',
    name: 'budgetDetail',
    label: '预算详情',
    type: FieldType.NUMBER,
    modules: [ModuleType.LEAD],
    required: false,
    validation: { min: 0 },
    sortOrder: 3,
    listVisible: true,
    detailVisible: true,
    enabled: true,
    createdBy: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cf_lead_004',
    name: 'urgencyLevel',
    label: '需求紧急度',
    type: FieldType.SELECT,
    modules: [ModuleType.LEAD],
    required: true,
    options: ['高', '中', '低'],
    sortOrder: 4,
    listVisible: true,
    detailVisible: true,
    enabled: true,
    createdBy: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
  },
];

/**
 * 商机管理模块预置字段
 */
export const opportunityCustomFields: CustomField[] = [
  {
    id: 'cf_opp_001',
    name: 'projectName',
    label: '项目名称',
    type: FieldType.TEXT,
    modules: [ModuleType.OPPORTUNITY],
    required: false,
    sortOrder: 1,
    listVisible: true,
    detailVisible: true,
    enabled: true,
    createdBy: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cf_opp_002',
    name: 'productLines',
    label: '产品线',
    type: FieldType.MULTISELECT,
    modules: [ModuleType.OPPORTUNITY],
    required: false,
    options: ['产品线 A', '产品线 B', '产品线 C', '解决方案', '服务'],
    sortOrder: 2,
    listVisible: false,
    detailVisible: true,
    enabled: true,
    createdBy: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cf_opp_003',
    name: 'projectPriority',
    label: '项目优先级',
    type: FieldType.SELECT,
    modules: [ModuleType.OPPORTUNITY],
    required: false,
    options: ['P0-紧急', 'P1-高', 'P2-中', 'P3-低'],
    sortOrder: 3,
    listVisible: true,
    detailVisible: true,
    enabled: true,
    createdBy: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cf_opp_004',
    name: 'discountRequest',
    label: '折扣申请',
    type: FieldType.NUMBER,
    modules: [ModuleType.OPPORTUNITY],
    required: false,
    validation: { min: 0, max: 100 },
    sortOrder: 4,
    listVisible: false,
    detailVisible: true,
    enabled: true,
    createdBy: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
  },
];

/**
 * 所有自定义字段汇总
 */
export const allCustomFields: CustomField[] = [
  ...customerCustomFields,
  ...contactCustomFields,
  ...leadCustomFields,
  ...opportunityCustomFields,
];

/**
 * 客户模块字段值示例
 */
export const customerFieldValues: Record<string, any> = {
  cust_001: {
    customerType: '直客',
    cooperationStartDate: '2023-01-15',
    creditLimit: 500000,
    vipFlag: true,
    customerTags: ['重点客户', '战略合作'],
    taxNumber: '91110108MA01234567',
  },
  cust_002: {
    customerType: '渠道商',
    cooperationStartDate: '2023-06-01',
    creditLimit: 200000,
    vipFlag: false,
    customerTags: ['长期合作'],
  },
};

/**
 * 联系人模块字段值示例
 */
export const contactFieldValues: Record<string, any> = {
  cont_001: {
    nickname: '小王',
    socialMedia: '微信：wang123',
    decisionInfluence: '4-较高',
    hobbies: ['高尔夫', '美食'],
  },
  cont_002: {
    nickname: '李总',
    decisionInfluence: '5-很高',
    hobbies: ['阅读', '旅行'],
  },
};

/**
 * 线索模块字段值示例
 */
export const leadFieldValues: Record<string, any> = {
  lead_001: {
    preliminaryRequirement: '需要一套完整的 CRM 系统，支持客户管理、销售跟进等功能',
    competitors: ['竞品 A', '竞品 B'],
    budgetDetail: 300000,
    urgencyLevel: '高',
  },
  lead_002: {
    preliminaryRequirement: '主要需要工单管理功能',
    budgetDetail: 50000,
    urgencyLevel: '中',
  },
};

/**
 * 商机模块字段值示例
 */
export const opportunityFieldValues: Record<string, any> = {
  opp_001: {
    projectName: 'XX 集团 CRM 系统建设项目',
    productLines: ['产品线 A', '解决方案'],
    projectPriority: 'P0-紧急',
    discountRequest: 15,
  },
  opp_002: {
    projectName: 'YY 公司工单系统',
    productLines: ['服务'],
    projectPriority: 'P2-中',
  },
};

/**
 * 所有字段值汇总
 */
export const allFieldValues: Record<string, Record<string, any>> = {
  customer: customerFieldValues,
  contact: contactFieldValues,
  lead: leadFieldValues,
  opportunity: opportunityFieldValues,
};

/**
 * 选项集示例
 */
export const optionsSets: OptionsSet[] = [
  {
    id: 'os_001',
    name: '客户等级',
    options: [
      { value: 'A+', label: 'A+ 级', sortOrder: 1 },
      { value: 'A', label: 'A 级', sortOrder: 2 },
      { value: 'B', label: 'B 级', sortOrder: 3 },
      { value: 'C', label: 'C 级', sortOrder: 4 },
    ],
    createdBy: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'os_002',
    name: '行业分类',
    options: [
      { value: 'internet', label: '互联网/软件/IT 服务', sortOrder: 1 },
      { value: 'finance', label: '金融/银行/保险', sortOrder: 2 },
      { value: 'manufacturing', label: '制造业', sortOrder: 3 },
      { value: 'retail', label: '零售/电商', sortOrder: 4 },
      { value: 'healthcare', label: '医疗/健康', sortOrder: 5 },
    ],
    createdBy: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
  },
];
