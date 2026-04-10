/**
 * Mock API Handler for Development
 * Simulates API responses for local development without a backend.
 *
 * Usage: Replace actual API calls with these mock handlers in development.
 * In production, use real endpoints via VITE_API_BASE_URL.
 */

import type {
  Customer,
  Contact,
  ContactType,
  CustomerListParams,
  ContactListParams,
  PaginatedResponse,
} from '@/types/api'
import type {
  CustomObject,
  CustomObjectDefinition,
  ObjectProperty,
  ObjectRelation,
  ObjectForm,
  ObjectRecord,
  CustomObjectListParams,
  ObjectRecordListParams,
} from '@/types/customObject'
import { FormType } from '@/types/customObject'
import type {
  Workflow,
  WorkflowExecutionLog,
  WorkflowTemplate,
  WorkflowListParams,
  ExecutionLogListParams,
} from '@/types/workflow'

// ============================================================
// Mock Data - Customers
// ============================================================
const mockCustomers: Customer[] = [
  { id: 'C001', name: '张伟', company: '北京科技有限公司', email: 'zhangwei@bjtech.com', phone: '138-0000-0001', status: '活跃', score: 95, createdAt: '2024-01-15', lastContact: '2025-03-28', assignee: '李明' },
  { id: 'C002', name: '李娜', company: '上海贸易集团', email: 'lina@shtrading.cn', phone: '139-0000-0002', status: '潜在', score: 72, createdAt: '2024-02-20', lastContact: '2025-03-25', assignee: '王芳' },
  { id: 'C003', name: '王强', company: '深圳创新科技', email: 'wangqiang@szinno.com', phone: '137-0000-0003', status: '活跃', score: 88, createdAt: '2024-01-08', lastContact: '2025-03-29', assignee: '李明' },
  { id: 'C004', name: '赵敏', company: '广州制造业', email: 'zhaomin@gzmfg.com', phone: '136-0000-0004', status: '沉默', score: 45, createdAt: '2023-11-12', lastContact: '2025-02-15', assignee: '陈静' },
  { id: 'C005', name: '刘洋', company: '成都软件园', email: 'liuyang@cdsoft.cn', phone: '135-0000-0005', status: '流失', score: 20, createdAt: '2023-06-05', lastContact: '2024-12-01', assignee: '王芳' },
  { id: 'C006', name: '陈静', company: '杭州电商', email: 'chenjing@hzec.com', phone: '188-0000-0006', status: '活跃', score: 92, createdAt: '2024-03-18', lastContact: '2025-03-30', assignee: '李明' },
  { id: 'C007', name: '杨帆', company: '南京新能源', email: 'yangfan@njne.cn', phone: '187-0000-0007', status: '潜在', score: 65, createdAt: '2024-04-02', lastContact: '2025-03-20', assignee: '陈静' },
  { id: 'C008', name: '周涛', company: '武汉物流', email: 'zhoutao@whlog.cn', phone: '186-0000-0008', status: '活跃', score: 81, createdAt: '2024-01-28', lastContact: '2025-03-27', assignee: '王芳' },
  { id: 'C009', name: '吴霞', company: '西安旅游集团', email: 'wuxia@xatour.cn', phone: '185-0000-0009', status: '沉默', score: 38, createdAt: '2023-09-15', lastContact: '2025-01-20', assignee: '李明' },
  { id: 'C010', name: '郑鑫', company: '苏州工业园区', email: 'zhengxin@szind.cn', phone: '184-0000-0010', status: '活跃', score: 90, createdAt: '2024-02-10', lastContact: '2025-03-31', assignee: '陈静' },
  { id: 'C011', name: '孙悦', company: '天津港务', email: 'sunyue@tjport.cn', phone: '183-0000-0011', status: '潜在', score: 58, createdAt: '2024-05-05', lastContact: '2025-03-15', assignee: '王芳' },
  { id: 'C012', name: '马超', company: '青岛海洋科技', email: 'machao@qdmarine.cn', phone: '182-0000-0012', status: '活跃', score: 86, createdAt: '2024-01-22', lastContact: '2025-03-28', assignee: '李明' },
  { id: 'C013', name: '胡丽', company: '重庆火锅底料', email: 'huli@cqfood.cn', phone: '181-0000-0013', status: '流失', score: 15, createdAt: '2023-04-18', lastContact: '2024-10-30', assignee: '陈静' },
  { id: 'C014', name: '林峰', company: '福州茶业', email: 'linfeng@fztea.cn', phone: '180-0000-0014', status: '沉默', score: 42, createdAt: '2023-12-01', lastContact: '2025-02-28', assignee: '王芳' },
  { id: 'C015', name: '黄洁', company: '长沙文化传媒', email: 'huangjie@csmedia.cn', phone: '179-0000-0015', status: '活跃', score: 94, createdAt: '2024-02-28', lastContact: '2025-03-29', assignee: '李明' },
]

// ============================================================
// Mock Data - Custom Objects
// ============================================================
const mockCustomObjects: CustomObject[] = [
  {
    id: 'obj_customer',
    name: 'customer',
    label: '客户',
    pluralLabel: '客户',
    singularName: '客户',
    pluralName: '客户',
    description: '客户信息管理',
    icon: 'Users',
    iconColor: '#3B82F6',
    status: 'active',
    secondaryProperties: ['company', 'email'],
    enabled: true,
    isSystem: true,
    sortOrder: 1,
    showInNavigation: true,
    createdBy: 'system',
    createdAt: '2024-01-01',
  },
  {
    id: 'obj_lead',
    name: 'lead',
    label: '线索',
    pluralLabel: '线索',
    singularName: '线索',
    pluralName: '线索',
    description: '潜在客户线索管理',
    icon: 'Target',
    iconColor: '#10B981',
    status: 'active',
    secondaryProperties: ['company', 'source'],
    enabled: true,
    isSystem: true,
    sortOrder: 2,
    showInNavigation: true,
    createdBy: 'system',
    createdAt: '2024-01-01',
  },
  {
    id: 'obj_opportunity',
    name: 'opportunity',
    label: '商机',
    pluralLabel: '商机',
    singularName: '商机',
    pluralName: '商机',
    description: '销售商机管理',
    icon: 'DollarSign',
    iconColor: '#F59E0B',
    status: 'active',
    secondaryProperties: ['amount', 'stage'],
    enabled: true,
    isSystem: true,
    sortOrder: 3,
    showInNavigation: true,
    createdBy: 'system',
    createdAt: '2024-01-01',
  },
  {
    id: 'obj_project',
    name: 'project',
    label: '项目',
    pluralLabel: '项目',
    singularName: '项目',
    pluralName: '项目',
    description: '项目进度跟踪',
    icon: 'Folder',
    iconColor: '#8B5CF6',
    status: 'active',
    secondaryProperties: ['status', 'deadline'],
    enabled: true,
    isSystem: false,
    sortOrder: 4,
    showInNavigation: true,
    createdBy: 'admin',
    createdAt: '2024-03-15',
  },
]

const mockObjectProperties: Record<string, ObjectProperty[]> = {
  obj_customer: [
    { id: 'prop_name', objectId: 'obj_customer', name: 'name', label: '姓名', type: 'text', internalType: 'text', unique: false, isPrimary: true, isSecondary: false, required: true, listVisible: true, detailVisible: true, searchable: true, sortable: true, bulkEditable: false, sortOrder: 1, enabled: true, createdBy: 'system', createdAt: '2024-01-01' },
    { id: 'prop_company', objectId: 'obj_customer', name: 'company', label: '公司', type: 'text', internalType: 'text', unique: false, isPrimary: false, isSecondary: true, required: false, listVisible: true, detailVisible: true, searchable: true, sortable: true, bulkEditable: true, sortOrder: 2, enabled: true, createdBy: 'system', createdAt: '2024-01-01' },
    { id: 'prop_email', objectId: 'obj_customer', name: 'email', label: '邮箱', type: 'email', internalType: 'email', unique: false, isPrimary: false, isSecondary: true, required: false, listVisible: true, detailVisible: true, searchable: true, sortable: false, bulkEditable: false, sortOrder: 3, enabled: true, createdBy: 'system', createdAt: '2024-01-01' },
    { id: 'prop_phone', objectId: 'obj_customer', name: 'phone', label: '电话', type: 'phone', internalType: 'phone', unique: false, isPrimary: false, isSecondary: false, required: false, listVisible: true, detailVisible: true, searchable: true, sortable: false, bulkEditable: false, sortOrder: 4, enabled: true, createdBy: 'system', createdAt: '2024-01-01' },
    { id: 'prop_status', objectId: 'obj_customer', name: 'status', label: '状态', type: 'select', internalType: 'select', unique: false, isPrimary: false, isSecondary: false, required: true, listVisible: true, detailVisible: true, searchable: true, sortable: true, bulkEditable: true, options: [{ value: '潜在', label: '潜在', color: '#6B7280', sortOrder: 1, enabled: true }, { value: '活跃', label: '活跃', color: '#10B981', sortOrder: 2, enabled: true }, { value: '沉默', label: '沉默', color: '#F59E0B', sortOrder: 3, enabled: true }, { value: '流失', label: '流失', color: '#EF4444', sortOrder: 4, enabled: true }], sortOrder: 5, enabled: true, createdBy: 'system', createdAt: '2024-01-01' },
  ],
  obj_lead: [
    { id: 'prop_lead_name', objectId: 'obj_lead', name: 'name', label: '姓名', type: 'text', internalType: 'text', unique: false, isPrimary: true, isSecondary: false, required: true, listVisible: true, detailVisible: true, searchable: true, sortable: true, bulkEditable: false, sortOrder: 1, enabled: true, createdBy: 'system', createdAt: '2024-01-01' },
    { id: 'prop_lead_source', objectId: 'obj_lead', name: 'source', label: '来源', type: 'select', internalType: 'select', unique: false, isPrimary: false, isSecondary: true, required: false, listVisible: true, detailVisible: true, searchable: true, sortable: true, bulkEditable: true, options: [{ value: '官网', label: '官网', sortOrder: 1, enabled: true }, { value: '展会', label: '展会', sortOrder: 2, enabled: true }, { value: '推荐', label: '推荐', sortOrder: 3, enabled: true }], sortOrder: 2, enabled: true, createdBy: 'system', createdAt: '2024-01-01' },
  ],
}

const mockObjectForms: Record<string, ObjectForm[]> = {
  obj_customer: [
    { id: 'form_customer_create', objectId: 'obj_customer', name: 'create', label: '创建客户', type: FormType.CREATE, layout: { type: 'two_column', sections: [{ id: 'section_basic', title: '基本信息', fields: ['prop_name', 'prop_company', 'prop_email', 'prop_phone'], sortOrder: 0 }] }, isDefault: true, enabled: true, createdBy: 'system', createdAt: '2024-01-01' },
  ],
}

const mockObjectRecords: Record<string, ObjectRecord[]> = {
  obj_customer: mockCustomers.map(c => ({
    id: `rec_${c.id}`,
    objectName: 'customer',
    objectId: 'obj_customer',
    data: { name: c.name, company: c.company, email: c.email, phone: c.phone, status: c.status },
    createdBy: 'system',
    createdAt: c.createdAt,
  })),
}

// ============================================================
// Mock Data - Workflows
// ============================================================
const mockWorkflows: Workflow[] = [
  {
    id: 'wf_new_lead',
    objectId: 'obj_lead',
    name: '新线索自动跟进',
    description: '当新线索创建时自动分配负责人并发送通知',
    status: 'active',
    trigger: { type: 'record_created', objectId: 'obj_lead' },
    nodes: [
      { id: 'node_trigger', type: 'trigger', name: '触发器', position: { x: 100, y: 100 }, config: { type: 'record_created', objectId: 'obj_lead' } },
      { id: 'node_assign', type: 'action', name: '分配负责人', position: { x: 300, y: 100 }, config: { type: 'assign_owner', assignType: 'round_robin' } },
      { id: 'node_notify', type: 'action', name: '发送通知', position: { x: 500, y: 100 }, config: { type: 'send_notification', title: '新线索分配', content: '您有新的线索需要跟进', recipients: [{ type: 'owner', value: '' }], priority: 'high' } },
    ],
    edges: [
      { id: 'edge_1', source: 'node_trigger', target: 'node_assign' },
      { id: 'edge_2', source: 'node_assign', target: 'node_notify' },
    ],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
    createdBy: 'admin',
    runCount: 25,
    successCount: 23,
    failedCount: 2,
    currentVersion: 1,
  },
  {
    id: 'wf_stage_change',
    objectId: 'obj_opportunity',
    name: '商机阶段变更通知',
    description: '当商机阶段变更时通知相关人员',
    status: 'active',
    trigger: { type: 'stage_changed', objectId: 'obj_opportunity' },
    nodes: [
      { id: 'node_trigger', type: 'trigger', name: '阶段变更触发', position: { x: 100, y: 100 }, config: { type: 'stage_changed', objectId: 'obj_opportunity' } },
      { id: 'node_email', type: 'action', name: '发送邮件', position: { x: 300, y: 100 }, config: { type: 'send_email', subject: '商机阶段更新', body: '商机阶段已变更，请查看详情', recipients: [{ type: 'owner', value: '' }], sendTime: 'immediate' } },
    ],
    edges: [
      { id: 'edge_1', source: 'node_trigger', target: 'node_email' },
    ],
    createdAt: '2024-02-20',
    updatedAt: '2024-02-20',
    createdBy: 'admin',
    runCount: 45,
    successCount: 44,
    failedCount: 1,
  },
  {
    id: 'wf_no_activity',
    objectId: 'obj_customer',
    name: '客户沉默预警',
    description: '超过30天无活动的客户发送预警通知',
    status: 'draft',
    trigger: { type: 'no_activity', objectId: 'obj_customer', inactivityDays: 30 },
    nodes: [],
    edges: [],
    createdAt: '2024-03-10',
    updatedAt: '2024-03-10',
    createdBy: 'admin',
    runCount: 0,
    successCount: 0,
    failedCount: 0,
  },
]

const mockExecutionLogs: WorkflowExecutionLog[] = [
  { id: 'log_1', workflowId: 'wf_new_lead', status: 'success', triggeredAt: '2025-03-28T10:00:00', completedAt: '2025-03-28T10:00:05', triggeredBy: 'system', triggerType: 'record_created', recordId: 'rec_new', duration: 5000, nodeExecutions: [] },
  { id: 'log_2', workflowId: 'wf_new_lead', status: 'failed', triggeredAt: '2025-03-27T15:00:00', completedAt: '2025-03-27T15:00:02', triggeredBy: 'system', triggerType: 'record_created', recordId: 'rec_fail', error: '通知发送失败', duration: 2000, nodeExecutions: [] },
  { id: 'log_3', workflowId: 'wf_stage_change', status: 'success', triggeredAt: '2025-03-29T08:30:00', completedAt: '2025-03-29T08:30:03', triggeredBy: 'user1', triggerType: 'stage_changed', recordId: 'opp_1', duration: 3000, nodeExecutions: [] },
]

const workflowTemplates: WorkflowTemplate[] = [
  { id: 'template_new_record', name: '新记录自动化', description: '新记录创建时执行自动化操作', category: '自动化', objectId: '', objectName: '通用', icon: 'Zap', nodes: [], edges: [], trigger: { type: 'record_created' }, isBuiltIn: true },
  { id: 'template_reminder', name: '定时提醒', description: '定时发送提醒通知', category: '通知', objectId: '', objectName: '通用', icon: 'Bell', nodes: [], edges: [], trigger: { type: 'scheduled' }, isBuiltIn: true },
]

// ============================================================
// Helper Functions
// ============================================================
function delay(ms: number = 300): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function paginate<T>(items: T[], page: number = 1, pageSize: number = 10): PaginatedResponse<T> {
  const start = (page - 1) * pageSize
  const end = start + pageSize
  return {
    data: items.slice(start, end),
    total: items.length,
    page,
    pageSize,
    totalPages: Math.ceil(items.length / pageSize),
  }
}

function filterBySearch<T>(items: T[], search?: string, fields?: string[]): T[] {
  if (!search || !fields || fields.length === 0) return items
  const lower = search.toLowerCase()
  return items.filter(item =>
    fields.some(field => String((item as Record<string, unknown>)[field] ?? '').toLowerCase().includes(lower))
  )
}

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// ============================================================
// Customer Mock API
// ============================================================
export const mockCustomerApi = {
  list: async (params?: CustomerListParams): Promise<PaginatedResponse<Customer>> => {
    await delay()
    let data = [...mockCustomers]
    if (params?.search) {
      data = filterBySearch(data, params.search, ['name', 'company', 'email'])
    }
    if (params?.status) {
      data = data.filter(c => c.status === params.status)
    }
    if (params?.assignee) {
      data = data.filter(c => c.assignee === params.assignee)
    }
    return paginate(data, params?.page, params?.pageSize)
  },

  getById: async (id: string): Promise<Customer> => {
    await delay()
    const customer = mockCustomers.find(c => c.id === id)
    if (!customer) throw new Error(`Customer ${id} not found`)
    return customer
  },

  create: async (customer: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer> => {
    await delay()
    const newCustomer: Customer = {
      ...customer,
      id: `C${String(mockCustomers.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString().split('T')[0],
    }
    mockCustomers.push(newCustomer)
    return newCustomer
  },

  update: async (id: string, updates: Partial<Customer>): Promise<Customer> => {
    await delay()
    const index = mockCustomers.findIndex(c => c.id === id)
    if (index === -1) throw new Error(`Customer ${id} not found`)
    mockCustomers[index] = { ...mockCustomers[index], ...updates }
    return mockCustomers[index]
  },

  delete: async (id: string): Promise<void> => {
    await delay()
    const index = mockCustomers.findIndex(c => c.id === id)
    if (index !== -1) mockCustomers.splice(index, 1)
  },

  bulkDelete: async (ids: string[]): Promise<void> => {
    await delay()
    ids.forEach(id => {
      const index = mockCustomers.findIndex(c => c.id === id)
      if (index !== -1) mockCustomers.splice(index, 1)
    })
  },
}

// ============================================================
// Custom Objects Mock API
// ============================================================
export const mockCustomObjectApi = {
  list: async (params?: CustomObjectListParams): Promise<CustomObject[]> => {
    await delay()
    let data = [...mockCustomObjects]
    if (params?.search) {
      data = filterBySearch(data, params.search, ['name', 'singularName', 'pluralName', 'description'])
    }
    if (params?.enabled !== undefined) {
      data = data.filter(o => o.enabled === params.enabled)
    }
    if (params?.isSystem !== undefined) {
      data = data.filter(o => o.isSystem === params.isSystem)
    }
    return data
  },

  getById: async (id: string): Promise<CustomObjectDefinition> => {
    await delay()
    const obj = mockCustomObjects.find(o => o.id === id)
    if (!obj) throw new Error(`CustomObject ${id} not found`)
    return {
      ...obj,
      fields: mockObjectProperties[id] || [],
      properties: mockObjectProperties[id] || [],
      relationships: [],
      forms: mockObjectForms[id] || [],
    }
  },

  getByname: async (name: string): Promise<CustomObjectDefinition> => {
    await delay()
    const obj = mockCustomObjects.find(o => o.name === name)
    if (!obj) throw new Error(`CustomObject ${name} not found`)
    return {
      ...obj,
      fields: mockObjectProperties[obj.id] || [],
      properties: mockObjectProperties[obj.id] || [],
      relationships: [],
      forms: mockObjectForms[obj.id] || [],
    }
  },

  create: async (object: Omit<CustomObject, 'id' | 'createdAt' | 'updatedAt'>): Promise<CustomObject> => {
    await delay()
    const newObject: CustomObject = {
      ...object,
      id: generateId('obj'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockCustomObjects.push(newObject)
    mockObjectProperties[newObject.id] = []
    mockObjectForms[newObject.id] = []
    return newObject
  },

  update: async (id: string, updates: Partial<CustomObject>): Promise<CustomObject> => {
    await delay()
    const index = mockCustomObjects.findIndex(o => o.id === id)
    if (index === -1) throw new Error(`CustomObject ${id} not found`)
    mockCustomObjects[index] = { ...mockCustomObjects[index], ...updates, updatedAt: new Date().toISOString() }
    return mockCustomObjects[index]
  },

  delete: async (id: string): Promise<void> => {
    await delay()
    const obj = mockCustomObjects.find(o => o.id === id)
    if (obj?.isSystem) throw new Error('Cannot delete system object')
    const index = mockCustomObjects.findIndex(o => o.id === id)
    if (index !== -1) mockCustomObjects.splice(index, 1)
  },

  // Properties
  getProperties: async (objectId: string): Promise<ObjectProperty[]> => {
    await delay()
    return mockObjectProperties[objectId] || []
  },

  createProperty: async (objectId: string, property: Omit<ObjectProperty, 'id' | 'objectId' | 'createdAt'>): Promise<ObjectProperty> => {
    await delay()
    const newProperty: ObjectProperty = {
      ...property,
      id: generateId('prop'),
      objectId,
      createdAt: new Date().toISOString(),
    }
    if (!mockObjectProperties[objectId]) mockObjectProperties[objectId] = []
    mockObjectProperties[objectId].push(newProperty)
    return newProperty
  },

  updateProperty: async (objectId: string, propertyId: string, updates: Partial<ObjectProperty>): Promise<ObjectProperty> => {
    await delay()
    const props = mockObjectProperties[objectId]
    if (!props) throw new Error(`Properties not found for object ${objectId}`)
    const index = props.findIndex(p => p.id === propertyId)
    if (index === -1) throw new Error(`Property ${propertyId} not found`)
    props[index] = { ...props[index], ...updates }
    return props[index]
  },

  deleteProperty: async (objectId: string, propertyId: string): Promise<void> => {
    await delay()
    const props = mockObjectProperties[objectId]
    if (!props) return
    const index = props.findIndex(p => p.id === propertyId)
    if (index !== -1) props.splice(index, 1)
  },

  // Records
  getRecords: async (params: ObjectRecordListParams): Promise<PaginatedResponse<ObjectRecord>> => {
    await delay()
    let data = mockObjectRecords[params.objectId] || []
    if (params.search) {
      data = data.filter(r => JSON.stringify(r.data).toLowerCase().includes(params.search!.toLowerCase()))
    }
    return paginate(data, params.page, params.pageSize)
  },

  getRecordById: async (objectId: string, recordId: string): Promise<ObjectRecord> => {
    await delay()
    const records = mockObjectRecords[objectId]
    if (!records) throw new Error(`Records not found for object ${objectId}`)
    const record = records.find(r => r.id === recordId)
    if (!record) throw new Error(`Record ${recordId} not found`)
    return record
  },

  createRecord: async (objectId: string, data: Record<string, unknown>): Promise<ObjectRecord> => {
    await delay()
    const obj = mockCustomObjects.find(o => o.id === objectId)
    const newRecord: ObjectRecord = {
      id: generateId('rec'),
      objectName: obj?.name || 'unknown',
      objectId,
      data,
      createdBy: 'current_user',
      createdAt: new Date().toISOString(),
    }
    if (!mockObjectRecords[objectId]) mockObjectRecords[objectId] = []
    mockObjectRecords[objectId].push(newRecord)
    return newRecord
  },

  updateRecord: async (objectId: string, recordId: string, data: Record<string, unknown>): Promise<ObjectRecord> => {
    await delay()
    const records = mockObjectRecords[objectId]
    if (!records) throw new Error(`Records not found for object ${objectId}`)
    const index = records.findIndex(r => r.id === recordId)
    if (index === -1) throw new Error(`Record ${recordId} not found`)
    records[index] = { ...records[index], data: { ...records[index].data, ...data }, updatedAt: new Date().toISOString() }
    return records[index]
  },

  deleteRecord: async (objectId: string, recordId: string): Promise<void> => {
    await delay()
    const records = mockObjectRecords[objectId]
    if (!records) return
    const index = records.findIndex(r => r.id === recordId)
    if (index !== -1) records.splice(index, 1)
  },
}

// ============================================================
// Workflows Mock API
// ============================================================
export const mockWorkflowApi = {
  list: async (params?: WorkflowListParams): Promise<Workflow[]> => {
    await delay()
    let data = [...mockWorkflows]
    if (params?.objectId) {
      data = data.filter(w => w.objectId === params.objectId)
    }
    if (params?.status) {
      data = data.filter(w => w.status === params.status)
    }
    if (params?.search) {
      data = filterBySearch(data, params.search, ['name', 'description'])
    }
    return data
  },

  getById: async (id: string): Promise<Workflow> => {
    await delay()
    const workflow = mockWorkflows.find(w => w.id === id)
    if (!workflow) throw new Error(`Workflow ${id} not found`)
    return workflow
  },

  create: async (workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt' | 'runCount' | 'successCount' | 'failedCount'>): Promise<Workflow> => {
    await delay()
    const now = new Date().toISOString()
    const newWorkflow: Workflow = {
      ...workflow,
      id: generateId('wf'),
      createdAt: now,
      updatedAt: now,
      runCount: 0,
      successCount: 0,
      failedCount: 0,
    }
    mockWorkflows.push(newWorkflow)
    return newWorkflow
  },

  update: async (id: string, updates: Partial<Workflow>): Promise<Workflow> => {
    await delay()
    const index = mockWorkflows.findIndex(w => w.id === id)
    if (index === -1) throw new Error(`Workflow ${id} not found`)
    mockWorkflows[index] = { ...mockWorkflows[index], ...updates, updatedAt: new Date().toISOString() }
    return mockWorkflows[index]
  },

  delete: async (id: string): Promise<void> => {
    await delay()
    const index = mockWorkflows.findIndex(w => w.id === id)
    if (index !== -1) mockWorkflows.splice(index, 1)
  },

  activate: async (id: string): Promise<Workflow> => {
    await delay()
    const index = mockWorkflows.findIndex(w => w.id === id)
    if (index === -1) throw new Error(`Workflow ${id} not found`)
    mockWorkflows[index] = { ...mockWorkflows[index], status: 'active', updatedAt: new Date().toISOString() }
    return mockWorkflows[index]
  },

  deactivate: async (id: string): Promise<Workflow> => {
    await delay()
    const index = mockWorkflows.findIndex(w => w.id === id)
    if (index === -1) throw new Error(`Workflow ${id} not found`)
    mockWorkflows[index] = { ...mockWorkflows[index], status: 'inactive', updatedAt: new Date().toISOString() }
    return mockWorkflows[index]
  },

  getExecutionLogs: async (params?: ExecutionLogListParams): Promise<PaginatedResponse<WorkflowExecutionLog>> => {
    await delay()
    let data = [...mockExecutionLogs]
    if (params?.workflowId) {
      data = data.filter(l => l.workflowId === params.workflowId)
    }
    if (params?.status) {
      data = data.filter(l => l.status === params.status)
    }
    return paginate(data, params?.page, params?.pageSize)
  },

  getTemplates: async (): Promise<WorkflowTemplate[]> => {
    await delay()
    return workflowTemplates
  },
}

// ============================================================
// Mock Data - Contacts (沟通记录)
// ============================================================
const mockContacts: Contact[] = [
  { id: 'CONT-001', customerId: 'C001', customerName: '北京科技有限公司', type: '电话', content: '初步沟通合作意向，客户对产品感兴趣', contactDate: '2024-03-20', duration: 30, assignee: '李明', createdAt: '2024-03-20' },
  { id: 'CONT-002', customerId: 'C001', customerName: '北京科技有限公司', type: '邮件', content: '发送产品资料报价单', contactDate: '2024-03-21', duration: 0, assignee: '李明', createdAt: '2024-03-21' },
  { id: 'CONT-003', customerId: 'C002', customerName: '上海贸易集团', type: '面谈', content: '上门拜访，参观客户公司，了解需求', contactDate: '2024-03-18', duration: 90, assignee: '王芳', createdAt: '2024-03-18' },
  { id: 'CONT-004', customerId: 'C002', customerName: '上海贸易集团', type: '微信', content: '跟进合同细节', contactDate: '2024-03-22', duration: 15, assignee: '王芳', createdAt: '2024-03-22' },
  { id: 'CONT-005', customerId: 'C003', customerName: '深圳创新科技', type: '电话', content: '确认技术参数', contactDate: '2024-03-19', duration: 45, assignee: '李明', createdAt: '2024-03-19' },
  { id: 'CONT-006', customerId: 'C003', customerName: '深圳创新科技', type: '邮件', content: '发送技术文档', contactDate: '2024-03-20', duration: 0, assignee: '李明', createdAt: '2024-03-20' },
  { id: 'CONT-007', customerId: 'C004', customerName: '广州制造业', type: '短信', content: '会议提醒', contactDate: '2024-03-15', duration: 0, assignee: '陈静', createdAt: '2024-03-15' },
  { id: 'CONT-008', customerId: 'C005', customerName: '成都软件园', type: '电话', content: '回访了解使用情况', contactDate: '2024-02-28', duration: 20, assignee: '王芳', createdAt: '2024-02-28' },
  { id: 'CONT-009', customerId: 'C006', customerName: '杭州电商', type: '微信', content: '日常维护沟通', contactDate: '2024-03-25', duration: 10, assignee: '李明', createdAt: '2024-03-25' },
  { id: 'CONT-010', customerId: 'C006', customerName: '杭州电商', type: '电话', content: '讨论续费事宜', contactDate: '2024-03-26', duration: 35, assignee: '李明', createdAt: '2024-03-26' },
  { id: 'CONT-011', customerId: 'C007', customerName: '南京新能源', type: '面谈', content: '初次拜访，介绍产品', contactDate: '2024-03-10', duration: 60, assignee: '陈静', createdAt: '2024-03-10' },
  { id: 'CONT-012', customerId: 'C008', customerName: '武汉物流', type: '电话', content: '跟进项目进度', contactDate: '2024-03-22', duration: 25, assignee: '王芳', createdAt: '2024-03-22' },
  { id: 'CONT-013', customerId: 'C009', customerName: '西安旅游集团', type: '邮件', content: '发送合作方案', contactDate: '2024-03-12', duration: 0, assignee: '李明', createdAt: '2024-03-12' },
  { id: 'CONT-014', customerId: 'C010', customerName: '苏州工业园区', type: '微信', content: '节日问候', contactDate: '2024-03-08', duration: 5, assignee: '陈静', createdAt: '2024-03-08' },
  { id: 'CONT-015', customerId: 'C010', customerName: '苏州工业园区', type: '电话', content: '确认需求变更', contactDate: '2024-03-28', duration: 40, assignee: '陈静', createdAt: '2024-03-28' },
  { id: 'CONT-016', customerId: 'C001', customerName: '北京科技有限公司', type: '面谈', content: '商务谈判', contactDate: '2024-03-25', duration: 120, assignee: '李明', createdAt: '2024-03-25' },
  { id: 'CONT-017', customerId: 'C002', customerName: '上海贸易集团', type: '电话', content: '确认签约时间', contactDate: '2024-03-26', duration: 15, assignee: '王芳', createdAt: '2024-03-26' },
  { id: 'CONT-018', customerId: 'C003', customerName: '深圳创新科技', type: '微信', content: '发送实施计划', contactDate: '2024-03-27', duration: 0, assignee: '李明', createdAt: '2024-03-27' },
  { id: 'CONT-019', customerId: 'C004', customerName: '广州制造业', type: '电话', content: '了解沉默原因', contactDate: '2024-03-01', duration: 20, assignee: '陈静', createdAt: '2024-03-01' },
  { id: 'CONT-020', customerId: 'C005', customerName: '成都软件园', type: '邮件', content: '挽回客户方案', contactDate: '2024-03-05', duration: 0, assignee: '王芳', createdAt: '2024-03-05' },
  { id: 'CONT-021', customerId: 'C006', customerName: '杭州电商', type: '面谈', content: '季度回顾会议', contactDate: '2024-03-29', duration: 90, assignee: '李明', createdAt: '2024-03-29' },
  { id: 'CONT-022', customerId: 'C007', customerName: '南京新能源', type: '电话', content: '跟进预算审批', contactDate: '2024-03-20', duration: 30, assignee: '陈静', createdAt: '2024-03-20' },
  { id: 'CONT-023', customerId: 'C008', customerName: '武汉物流', type: '微信', content: '发送产品更新通知', contactDate: '2024-03-25', duration: 0, assignee: '王芳', createdAt: '2024-03-25' },
  { id: 'CONT-024', customerId: 'C009', customerName: '西安旅游集团', type: '电话', content: '了解行业困难', contactDate: '2024-02-20', duration: 25, assignee: '李明', createdAt: '2024-02-20' },
  { id: 'CONT-025', customerId: 'C010', customerName: '苏州工业园区', type: '邮件', content: '季度报告', contactDate: '2024-03-30', duration: 0, assignee: '陈静', createdAt: '2024-03-30' },
  { id: 'CONT-026', customerId: 'C001', customerName: '北京科技有限公司', type: '微信', content: '确认培训时间', contactDate: '2024-03-28', duration: 0, assignee: '李明', createdAt: '2024-03-28' },
  { id: 'CONT-027', customerId: 'C002', customerName: '上海贸易集团', type: '面谈', content: '合同签署', contactDate: '2024-03-28', duration: 60, assignee: '王芳', createdAt: '2024-03-28' },
  { id: 'CONT-028', customerId: 'C003', customerName: '深圳创新科技', type: '电话', content: '项目启动会安排', contactDate: '2024-03-29', duration: 20, assignee: '李明', createdAt: '2024-03-29' },
  { id: 'CONT-029', customerId: 'C004', customerName: '广州制造业', type: '邮件', content: '激活客户方案', contactDate: '2024-03-10', duration: 0, assignee: '陈静', createdAt: '2024-03-10' },
  { id: 'CONT-030', customerId: 'C005', customerName: '成都软件园', type: '电话', content: '最后挽回尝试', contactDate: '2024-03-15', duration: 30, assignee: '王芳', createdAt: '2024-03-15' },
  { id: 'CONT-031', customerId: 'C006', customerName: '杭州电商', type: '短信', content: '满意度调查邀请', contactDate: '2024-03-31', duration: 0, assignee: '李明', createdAt: '2024-03-31' },
  { id: 'CONT-032', customerId: 'C007', customerName: '南京新能源', type: '微信', content: '发送案例资料', contactDate: '2024-03-23', duration: 0, assignee: '陈静', createdAt: '2024-03-23' },
  { id: 'CONT-033', customerId: 'C008', customerName: '武汉物流', type: '面谈', content: '需求调研', contactDate: '2024-03-28', duration: 120, assignee: '王芳', createdAt: '2024-03-28' },
  { id: 'CONT-034', customerId: 'C009', customerName: '西安旅游集团', type: '电话', content: '行业复苏情况了解', contactDate: '2024-03-20', duration: 35, assignee: '李明', createdAt: '2024-03-20' },
  { id: 'CONT-035', customerId: 'C010', customerName: '苏州工业园区', type: '微信', content: '新功能演示邀请', contactDate: '2024-03-29', duration: 0, assignee: '陈静', createdAt: '2024-03-29' },
  { id: 'CONT-036', customerId: 'C001', customerName: '北京科技有限公司', type: '邮件', content: '培训材料', contactDate: '2024-03-29', duration: 0, assignee: '李明', createdAt: '2024-03-29' },
  { id: 'CONT-037', customerId: 'C002', customerName: '上海贸易集团', type: '电话', content: '实施进度确认', contactDate: '2024-03-29', duration: 25, assignee: '王芳', createdAt: '2024-03-29' },
  { id: 'CONT-038', customerId: 'C003', customerName: '深圳创新科技', type: '面谈', content: '项目里程碑评审', contactDate: '2024-03-30', duration: 90, assignee: '李明', createdAt: '2024-03-30' },
  { id: 'CONT-039', customerId: 'C004', customerName: '广州制造业', type: '微信', content: '行业资讯分享', contactDate: '2024-03-20', duration: 0, assignee: '陈静', createdAt: '2024-03-20' },
  { id: 'CONT-040', customerId: 'C005', customerName: '成都软件园', type: '邮件', content: '告别信', contactDate: '2024-03-20', duration: 0, assignee: '王芳', createdAt: '2024-03-20' },
]

// ============================================================
// Contacts Mock API
// ============================================================
export const mockContactApi = {
  list: async (params?: ContactListParams): Promise<PaginatedResponse<Contact>> => {
    await delay(300)
    let data = [...mockContacts]
    
    // Filter by customerId
    if (params?.customerId) {
      data = data.filter(c => c.customerId === params.customerId)
    }
    
    // Filter by type
    if (params?.type) {
      data = data.filter(c => c.type === params.type)
    }
    
    // Filter by date range
    if (params?.startDate) {
      const startDate = new Date(params.startDate)
      data = data.filter(c => new Date(c.contactDate) >= startDate)
    }
    if (params?.endDate) {
      const endDate = new Date(params.endDate)
      data = data.filter(c => new Date(c.contactDate) <= endDate)
    }
    
    // Search
    if (params?.search) {
      const search = params.search.toLowerCase()
      data = data.filter(c => 
        c.customerName?.toLowerCase().includes(search) ||
        c.content.toLowerCase().includes(search) ||
        c.assignee.toLowerCase().includes(search)
      )
    }
    
    // Pagination
    const page = params?.page || 1
    const pageSize = params?.pageSize || 10
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginatedData = data.slice(start, end)
    
    return {
      data: paginatedData,
      total: data.length,
      page,
      pageSize,
      totalPages: Math.ceil(data.length / pageSize),
    }
  },

  getById: async (id: string): Promise<Contact> => {
    await delay()
    const contact = mockContacts.find(c => c.id === id)
    if (!contact) throw new Error(`Contact ${id} not found`)
    return contact
  },

  create: async (contact: Omit<Contact, 'id' | 'createdAt'>): Promise<Contact> => {
    await delay()
    const newContact: Contact = {
      ...contact,
      id: `CONT-${String(mockContacts.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString().split('T')[0],
    }
    mockContacts.push(newContact)
    return newContact
  },

  update: async (id: string, updates: Partial<Contact>): Promise<Contact> => {
    await delay()
    const index = mockContacts.findIndex(c => c.id === id)
    if (index === -1) throw new Error(`Contact ${id} not found`)
    mockContacts[index] = { ...mockContacts[index], ...updates }
    return mockContacts[index]
  },

  delete: async (id: string): Promise<void> => {
    await delay()
    const index = mockContacts.findIndex(c => c.id === id)
    if (index !== -1) mockContacts.splice(index, 1)
  },

  getByCustomer: async (customerId: string, params?: ContactListParams): Promise<PaginatedResponse<Contact>> => {
    return mockContactApi.list({ ...params, customerId })
  },
}

// Re-export types for convenience
export type { CustomerListParams, CustomObjectListParams, ObjectRecordListParams, WorkflowListParams, ExecutionLogListParams, ContactListParams }