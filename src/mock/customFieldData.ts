/**
 * 自定义字段 Mock 数据
 */

import type { FieldType } from '@/types/customObject';

// ============ 自定义字段定义 ============

export interface CustomFieldDefinition {
  id: string;
  objectType: string;
  fieldName: string;
  fieldLabel: string;
  fieldType: FieldType;
  required: boolean;
  unique: boolean;
  defaultValue?: any;
  picklistOptions?: string[];
  validationRule?: string;
  helpText?: string;
  placeholder?: string;
  sortOrder: number;
}

// ============ 客户自定义字段 ============

export const customerCustomFields: CustomFieldDefinition[] = [
  {
    id: 'cust-cf-001',
    objectType: 'customer',
    fieldName: 'vipLevel',
    fieldLabel: 'VIP等级',
    fieldType: 'picklist',
    required: false,
    unique: false,
    picklistOptions: ['普通客户', '银卡客户', '金卡客户', '钻石客户', '黑金客户'],
    sortOrder: 1,
  },
  {
    id: 'cust-cf-002',
    objectType: 'customer',
    fieldName: 'industryCategory',
    fieldLabel: '行业细分',
    fieldType: 'picklist',
    required: true,
    unique: false,
    picklistOptions: ['互联网', '金融', '医疗', '教育', '制造业', '零售', '房地产', '其他'],
    sortOrder: 2,
  },
  {
    id: 'cust-cf-003',
    objectType: 'customer',
    fieldName: 'customerType',
    fieldLabel: '客户类型',
    fieldType: 'picklist',
    required: true,
    unique: false,
    picklistOptions: ['企业客户', '个人客户', '渠道客户'],
    sortOrder: 3,
  },
  {
    id: 'cust-cf-004',
    objectType: 'customer',
    fieldName: 'sourceChannel',
    fieldLabel: '来源渠道',
    fieldType: 'picklist',
    required: false,
    unique: false,
    picklistOptions: ['官网注册', '线下活动', '展会', '电话营销', '转介绍', '合作伙伴', '其他'],
    sortOrder: 4,
  },
  {
    id: 'cust-cf-005',
    objectType: 'customer',
    fieldName: 'annualRevenue',
    fieldLabel: '年营业额(万元)',
    fieldType: 'number',
    required: false,
    unique: false,
    placeholder: '请输入年营业额',
    sortOrder: 5,
  },
  {
    id: 'cust-cf-006',
    objectType: 'customer',
    fieldName: 'employeeScale',
    fieldLabel: '员工规模',
    fieldType: 'picklist',
    required: false,
    unique: false,
    picklistOptions: ['1-50人', '51-200人', '201-500人', '501-1000人', '1000人以上'],
    sortOrder: 6,
  },
  {
    id: 'cust-cf-007',
    objectType: 'customer',
    fieldName: 'creditRating',
    fieldLabel: '信用评级',
    fieldType: 'picklist',
    required: false,
    unique: false,
    picklistOptions: ['AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'CCC', '其他'],
    sortOrder: 7,
  },
  {
    id: 'cust-cf-008',
    objectType: 'customer',
    fieldName: 'contractExpiryDate',
    fieldLabel: '合同到期日',
    fieldType: 'date',
    required: false,
    unique: false,
    sortOrder: 8,
  },
];

// ============ 联系人自定义字段 ============

export const contactCustomFields: CustomFieldDefinition[] = [
  {
    id: 'cont-cf-001',
    objectType: 'contact',
    fieldName: 'department',
    fieldLabel: '部门',
    fieldType: 'text',
    required: false,
    unique: false,
    placeholder: '请输入部门名称',
    sortOrder: 1,
  },
  {
    id: 'cont-cf-002',
    objectType: 'contact',
    fieldName: 'jobLevel',
    fieldLabel: '职位级别',
    fieldType: 'picklist',
    required: false,
    unique: false,
    picklistOptions: ['高层管理', '中层管理', '基层管理', '普通员工'],
    sortOrder: 2,
  },
  {
    id: 'cont-cf-003',
    objectType: 'contact',
    fieldName: 'birthday',
    fieldLabel: '生日',
    fieldType: 'date',
    required: false,
    unique: false,
    sortOrder: 3,
  },
  {
    id: 'cont-cf-004',
    objectType: 'contact',
    fieldName: 'wechatId',
    fieldLabel: '微信号',
    fieldType: 'text',
    required: false,
    unique: false,
    placeholder: '请输入微信号',
    sortOrder: 4,
  },
  {
    id: 'cont-cf-005',
    objectType: 'contact',
    fieldName: 'preferredContactTime',
    fieldLabel: '偏好联系时间',
    fieldType: 'picklist',
    required: false,
    unique: false,
    picklistOptions: ['上午9-12点', '下午2-6点', '晚上6-9点', '时间不限'],
    sortOrder: 5,
  },
  {
    id: 'cont-cf-006',
    objectType: 'contact',
    fieldName: 'hobbies',
    fieldLabel: '兴趣爱好',
    fieldType: 'multipicklist',
    required: false,
    unique: false,
    picklistOptions: ['运动', '旅游', '音乐', '阅读', '美食', '电影', '摄影', '健身'],
    sortOrder: 6,
  },
];

// ============ 商机自定义字段 ============

export const opportunityCustomFields: CustomFieldDefinition[] = [
  {
    id: 'oppo-cf-001',
    objectType: 'opportunity',
    fieldName: 'competitionLevel',
    fieldLabel: '竞争激烈程度',
    fieldType: 'picklist',
    required: false,
    unique: false,
    picklistOptions: ['低', '中', '高', '极高'],
    sortOrder: 1,
  },
  {
    id: 'oppo-cf-002',
    objectType: 'opportunity',
    fieldName: 'decisionMaker',
    fieldLabel: '决策人确认',
    fieldType: 'picklist',
    required: false,
    unique: false,
    picklistOptions: ['已确认', '待确认', '未接触'],
    sortOrder: 2,
  },
  {
    id: 'oppo-cf-003',
    objectType: 'opportunity',
    fieldName: 'technicalRequirement',
    fieldLabel: '技术需求度',
    fieldType: 'picklist',
    required: false,
    unique: false,
    picklistOptions: ['无', '一般', '较高', '非常高'],
    sortOrder: 3,
  },
  {
    id: 'oppo-cf-004',
    objectType: 'opportunity',
    fieldName: 'budgetConfirmed',
    fieldLabel: '预算是否确认',
    fieldType: 'boolean',
    required: false,
    unique: false,
    defaultValue: false,
    sortOrder: 4,
  },
  {
    id: 'oppo-cf-005',
    objectType: 'opportunity',
    fieldName: 'expectedDeliveryDate',
    fieldLabel: '期望交付日期',
    fieldType: 'date',
    required: false,
    unique: false,
    sortOrder: 5,
  },
  {
    id: 'oppo-cf-006',
    objectType: 'opportunity',
    fieldName: 'keyRequirements',
    fieldLabel: '关键需求',
    fieldType: 'textarea',
    required: false,
    unique: false,
    placeholder: '请描述客户的关键需求',
    sortOrder: 6,
  },
];

// ============ 订单自定义字段 ============

export const orderCustomFields: CustomFieldDefinition[] = [
  {
    id: 'order-cf-001',
    objectType: 'order',
    fieldName: 'orderChannel',
    fieldLabel: '订单渠道',
    fieldType: 'picklist',
    required: true,
    unique: false,
    picklistOptions: ['线上直签', '线下签约', '渠道合作', '代理商'],
    sortOrder: 1,
  },
  {
    id: 'order-cf-002',
    objectType: 'order',
    fieldName: 'deliveryMethod',
    fieldLabel: '交付方式',
    fieldType: 'picklist',
    required: false,
    unique: false,
    picklistOptions: ['线上交付', '上门部署', '混合交付'],
    sortOrder: 2,
  },
  {
    id: 'order-cf-003',
    objectType: 'order',
    fieldName: 'signedBy',
    fieldLabel: '合同签署人',
    fieldType: 'text',
    required: false,
    unique: false,
    placeholder: '请输入签署人姓名',
    sortOrder: 3,
  },
  {
    id: 'order-cf-004',
    objectType: 'order',
    fieldName: 'invoiceType',
    fieldLabel: '发票类型',
    fieldType: 'picklist',
    required: false,
    unique: false,
    picklistOptions: ['增值税专用发票', '增值税普通发票', '电子发票', '不开发票'],
    sortOrder: 4,
  },
  {
    id: 'order-cf-005',
    objectType: 'order',
    fieldName: 'paymentTerms',
    fieldLabel: '付款条款',
    fieldType: 'picklist',
    required: false,
    unique: false,
    picklistOptions: ['一次性付款', '先付50%', '按项目进度付款', '按月结算'],
    sortOrder: 5,
  },
];

// ============ 辅助函数 ============

export function getCustomFieldsByObjectType(objectType: string): CustomFieldDefinition[] {
  switch (objectType) {
    case 'customer':
      return customerCustomFields;
    case 'contact':
      return contactCustomFields;
    case 'opportunity':
      return opportunityCustomFields;
    case 'order':
      return orderCustomFields;
    default:
      return [];
  }
}

export function getAllCustomFields(): CustomFieldDefinition[] {
  return [
    ...customerCustomFields,
    ...contactCustomFields,
    ...opportunityCustomFields,
    ...orderCustomFields,
  ];
}

export function getCustomFieldById(id: string): CustomFieldDefinition | undefined {
  return getAllCustomFields().find((f) => f.id === id);
}
