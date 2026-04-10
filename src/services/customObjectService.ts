/**
 * Custom Object Service
 * Service layer for custom object CRUD operations
 */
import {
  CustomObject,
  CustomObjectDefinition,
  CustomObjectRecord,
  CustomObjectFilter,
  CustomField,
  type FieldType,
  type CustomObjectStatus,
  type RecordScreenLayout,
} from '@/types/customObject'
import { handleApiError, ServiceError } from './base'

// ============================================================
// Additional Types
// ============================================================

export interface CreateCustomObjectRequest {
  name: string
  label: string
  pluralLabel: string
  description?: string
  icon?: string
  iconColor?: string
}

export interface UpdateCustomObjectRequest {
  label?: string
  pluralLabel?: string
  description?: string
  icon?: string
  iconColor?: string
  status?: CustomObjectStatus
  showInNavigation?: boolean
  sortOrder?: number
}

export interface RecordFilter {
  search?: string
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface BulkDeleteResult {
  success: string[]
  failed: Array<{ id: string; error: string }>
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
}

export interface ValidationError {
  field: string
  message: string
}

// ============================================================
// Mock Data Store
// ============================================================

let mockObjects: CustomObjectDefinition[] = [
  {
    id: 'obj_001',
    name: 'Project',
    label: '项目',
    pluralLabel: '项目',
    description: '项目管理对象',
    icon: 'folder',
    iconColor: '#3b82f6',
    status: 'active' as CustomObjectStatus,
    isSystem: false,
    sortOrder: 1,
    showInNavigation: true,
    createdBy: 'admin',
    createdAt: '2024-01-15T08:00:00Z',
    updatedBy: 'admin',
    updatedAt: '2024-01-15T08:00:00Z',
    fields: [
      {
        id: 'fld_001',
        name: 'project_name',
        label: '项目名称',
        type: 'text' as FieldType,
        required: true,
        unique: false,
        defaultValue: '',
        description: '项目名称',
        placeholder: '请输入项目名称',
        listVisible: true,
        detailVisible: true,
        searchable: true,
        sortable: true,
        bulkEditable: true,
        sortOrder: 1,
        enabled: true,
      },
      {
        id: 'fld_002',
        name: 'start_date',
        label: '开始日期',
        type: 'date' as FieldType,
        required: false,
        unique: false,
        defaultValue: '',
        description: '项目开始日期',
        listVisible: true,
        detailVisible: true,
        searchable: true,
        sortable: true,
        bulkEditable: true,
        sortOrder: 2,
        enabled: true,
      },
      {
        id: 'fld_003',
        name: 'status',
        label: '状态',
        type: 'picklist' as FieldType,
        required: true,
        unique: false,
        picklistOptions: ['计划中', '进行中', '已完成', '已取消'],
        defaultValue: '计划中',
        listVisible: true,
        detailVisible: true,
        searchable: true,
        sortable: true,
        bulkEditable: true,
        sortOrder: 3,
        enabled: true,
      },
    ],
  },
  {
    id: 'obj_002',
    name: 'Task',
    label: '任务',
    pluralLabel: '任务',
    description: '任务管理对象',
    icon: 'check-square',
    iconColor: '#10b981',
    status: 'active' as CustomObjectStatus,
    isSystem: false,
    sortOrder: 2,
    showInNavigation: true,
    createdBy: 'admin',
    createdAt: '2024-01-16T08:00:00Z',
    updatedBy: 'admin',
    updatedAt: '2024-01-16T08:00:00Z',
    fields: [
      {
        id: 'fld_004',
        name: 'task_name',
        label: '任务名称',
        type: 'text' as FieldType,
        required: true,
        unique: false,
        defaultValue: '',
        listVisible: true,
        detailVisible: true,
        searchable: true,
        sortable: true,
        bulkEditable: true,
        sortOrder: 1,
        enabled: true,
      },
      {
        id: 'fld_005',
        name: 'priority',
        label: '优先级',
        type: 'picklist' as FieldType,
        required: true,
        unique: false,
        picklistOptions: ['低', '中', '高', '紧急'],
        defaultValue: '中',
        listVisible: true,
        detailVisible: true,
        searchable: true,
        sortable: true,
        bulkEditable: true,
        sortOrder: 2,
        enabled: true,
      },
    ],
  },
]

const mockRecords: Map<string, CustomObjectRecord[]> = new Map([
  [
    'Project',
    [
      {
        id: 'rec_001',
        objectName: 'Project',
        data: { project_name: 'CRM升级项目', start_date: '2024-03-01', status: '进行中' },
        createdBy: 'admin',
        createdAt: '2024-03-01T08:00:00Z',
        updatedBy: 'admin',
        updatedAt: '2024-03-01T08:00:00Z',
      },
      {
        id: 'rec_002',
        objectName: 'Project',
        data: { project_name: '移动端开发', start_date: '2024-04-01', status: '计划中' },
        createdBy: 'admin',
        createdAt: '2024-04-01T08:00:00Z',
        updatedBy: 'admin',
        updatedAt: '2024-04-01T08:00:00Z',
      },
    ],
  ],
  [
    'Task',
    [
      {
        id: 'rec_003',
        objectName: 'Task',
        data: { task_name: '设计数据库架构', priority: '高' },
        createdBy: 'admin',
        createdAt: '2024-03-05T08:00:00Z',
        updatedBy: 'admin',
        updatedAt: '2024-03-05T08:00:00Z',
      },
    ],
  ],
])

// ============================================================
// Utility Functions
// ============================================================

function delay(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

// ============================================================
// Custom Object CRUD
// ============================================================

/**
 * Get all custom objects with optional filter
 */
export async function getCustomObjects(
  filter?: CustomObjectFilter
): Promise<CustomObject[]> {
  await delay(200)

  let result = [...mockObjects]

  if (filter) {
    if (filter.objectName) {
      result = result.filter((obj) =>
        obj.name.toLowerCase().includes(filter.objectName!.toLowerCase())
      )
    }
    if (filter.status) {
      result = result.filter((obj) => obj.status === filter.status)
    }
    if (filter.search) {
      const searchLower = filter.search.toLowerCase()
      result = result.filter(
        (obj) =>
          obj.name.toLowerCase().includes(searchLower) ||
          obj.label.toLowerCase().includes(searchLower) ||
          obj.description?.toLowerCase().includes(searchLower)
      )
    }
  }

  return result
}

/**
 * Get custom object by name
 */
export async function getCustomObjectByName(name: string): Promise<CustomObject | null> {
  await delay(200)
  return mockObjects.find((obj) => obj.name === name) ?? null
}

/**
 * Get custom object by ID
 */
export async function getCustomObjectById(id: string): Promise<CustomObject | null> {
  await delay(200)
  return mockObjects.find((obj) => obj.id === id) ?? null
}

/**
 * Create a new custom object
 */
export async function createCustomObject(
  data: CreateCustomObjectRequest
): Promise<CustomObject> {
  await delay(400)

  // Check for duplicate name
  if (mockObjects.some((obj) => obj.name === data.name)) {
    throw new ServiceError(`Custom object with name "${data.name}" already exists`, 'DUPLICATE_NAME', 409)
  }

  const now = new Date().toISOString()
  const newObject: CustomObjectDefinition = {
    id: generateId('obj'),
    name: data.name,
    label: data.label,
    pluralLabel: data.pluralLabel,
    description: data.description,
    icon: data.icon || 'cube',
    iconColor: data.iconColor || '#6366f1',
    status: 'draft' as CustomObjectStatus,
    isSystem: false,
    sortOrder: mockObjects.length + 1,
    showInNavigation: true,
    createdBy: 'admin',
    createdAt: now,
    fields: [],
  }

  mockObjects.push(newObject)
  return newObject
}

/**
 * Update a custom object
 */
export async function updateCustomObject(
  id: string,
  data: UpdateCustomObjectRequest
): Promise<CustomObject> {
  await delay(400)

  const index = mockObjects.findIndex((obj) => obj.id === id)
  if (index === -1) {
    throw new ServiceError(`Custom object with id "${id}" not found`, 'NOT_FOUND', 404)
  }

  const obj = mockObjects[index]
  const updated: CustomObjectDefinition = {
    ...obj,
    ...data,
    updatedBy: 'admin',
    updatedAt: new Date().toISOString(),
  }

  mockObjects[index] = updated
  return updated
}

/**
 * Delete a custom object
 */
export async function deleteCustomObject(id: string): Promise<void> {
  await delay(400)

  const index = mockObjects.findIndex((obj) => obj.id === id)
  if (index === -1) {
    throw new ServiceError(`Custom object with id "${id}" not found`, 'NOT_FOUND', 404)
  }

  mockObjects.splice(index, 1)
  mockRecords.delete(mockObjects[index]?.name ?? '')
}

// ============================================================
// Field Management
// ============================================================

/**
 * Add a field to a custom object
 */
export async function addField(objectId: string, field: CustomField): Promise<CustomObject> {
  await delay(300)

  const index = mockObjects.findIndex((obj) => obj.id === objectId)
  if (index === -1) {
    throw new ServiceError(`Custom object with id "${objectId}" not found`, 'NOT_FOUND', 404)
  }

  // Check for duplicate field name
  if (mockObjects[index].fields.some((f) => f.name === field.name)) {
    throw new ServiceError(`Field with name "${field.name}" already exists`, 'DUPLICATE_FIELD', 409)
  }

  const newField: CustomField = {
    ...field,
    id: generateId('fld'),
  }

  mockObjects[index] = {
    ...mockObjects[index],
    updatedBy: 'admin',
    updatedAt: new Date().toISOString(),
    fields: [...mockObjects[index].fields, newField],
  }

  return mockObjects[index]
}

/**
 * Update a field in a custom object
 */
export async function updateField(
  objectId: string,
  fieldId: string,
  field: CustomField
): Promise<CustomObject> {
  await delay(300)

  const objIndex = mockObjects.findIndex((obj) => obj.id === objectId)
  if (objIndex === -1) {
    throw new ServiceError(`Custom object with id "${objectId}" not found`, 'NOT_FOUND', 404)
  }

  const fieldIndex = mockObjects[objIndex].fields.findIndex((f) => f.id === fieldId)
  if (fieldIndex === -1) {
    throw new ServiceError(`Field with id "${fieldId}" not found`, 'FIELD_NOT_FOUND', 404)
  }

  // Check for duplicate field name (excluding current field)
  if (
    mockObjects[objIndex].fields.some(
      (f) => f.name === field.name && f.id !== fieldId
    )
  ) {
    throw new ServiceError(`Field with name "${field.name}" already exists`, 'DUPLICATE_FIELD', 409)
  }

  const updatedFields = [...mockObjects[objIndex].fields]
  updatedFields[fieldIndex] = {
    ...field,
    id: fieldId,
  }

  mockObjects[objIndex] = {
    ...mockObjects[objIndex],
    updatedBy: 'admin',
    updatedAt: new Date().toISOString(),
    fields: updatedFields,
  }

  return mockObjects[objIndex]
}

/**
 * Delete a field from a custom object
 */
export async function deleteField(objectId: string, fieldId: string): Promise<CustomObject> {
  await delay(300)

  const objIndex = mockObjects.findIndex((obj) => obj.id === objectId)
  if (objIndex === -1) {
    throw new ServiceError(`Custom object with id "${objectId}" not found`, 'NOT_FOUND', 404)
  }

  const fieldIndex = mockObjects[objIndex].fields.findIndex((f) => f.id === fieldId)
  if (fieldIndex === -1) {
    throw new ServiceError(`Field with id "${fieldId}" not found`, 'FIELD_NOT_FOUND', 404)
  }

  const updatedFields = mockObjects[objIndex].fields.filter((f) => f.id !== fieldId)

  mockObjects[objIndex] = {
    ...mockObjects[objIndex],
    updatedBy: 'admin',
    updatedAt: new Date().toISOString(),
    fields: updatedFields,
  }

  return mockObjects[objIndex]
}

// ============================================================
// Record Management
// ============================================================

/**
 * Get records for an object
 */
export async function getRecords(
  objectName: string,
  filter?: RecordFilter
): Promise<CustomObjectRecord[]> {
  await delay(300)

  const records = mockRecords.get(objectName) || []

  let result = [...records]

  if (filter?.search) {
    const searchLower = filter.search.toLowerCase()
    result = result.filter((rec) =>
      Object.values(rec.data).some(
        (val) => String(val).toLowerCase().includes(searchLower)
      )
    )
  }

  if (filter?.sortBy) {
    result.sort((a, b) => {
      const aVal = a.data[filter.sortBy!]
      const bVal = b.data[filter.sortBy!]
      const comparison = String(aVal).localeCompare(String(bVal))
      return filter.sortOrder === 'desc' ? -comparison : comparison
    })
  }

  // Pagination
  if (filter?.page && filter?.pageSize) {
    const start = (filter.page - 1) * filter.pageSize
    result = result.slice(start, start + filter.pageSize)
  }

  return result
}

/**
 * Get a single record by ID
 */
export async function getRecordById(
  objectName: string,
  recordId: string
): Promise<CustomObjectRecord | null> {
  await delay(200)

  const records = mockRecords.get(objectName) || []
  return records.find((rec) => rec.id === recordId) ?? null
}

/**
 * Create a new record
 */
export async function createRecord(
  objectName: string,
  data: Record<string, unknown>
): Promise<CustomObjectRecord> {
  await delay(400)

  const obj = mockObjects.find((o) => o.name === objectName)
  if (!obj) {
    throw new ServiceError(`Custom object "${objectName}" not found`, 'NOT_FOUND', 404)
  }

  // Validate required fields
  for (const field of obj.fields) {
    if (field.required && (data[field.name] === undefined || data[field.name] === '')) {
      throw new ServiceError(
        `Field "${field.label}" is required`,
        'REQUIRED_FIELD',
        400
      )
    }
  }

  const now = new Date().toISOString()
  const newRecord: CustomObjectRecord = {
    id: generateId('rec'),
    objectName,
    data,
    createdBy: 'admin',
    createdAt: now,
    updatedBy: 'admin',
    updatedAt: now,
  }

  const records = mockRecords.get(objectName) || []
  records.push(newRecord)
  mockRecords.set(objectName, records)

  return newRecord
}

/**
 * Update an existing record
 */
export async function updateRecord(
  objectName: string,
  recordId: string,
  data: Record<string, unknown>
): Promise<CustomObjectRecord> {
  await delay(400)

  const records = mockRecords.get(objectName) || []
  const index = records.findIndex((rec) => rec.id === recordId)

  if (index === -1) {
    throw new ServiceError(`Record with id "${recordId}" not found`, 'RECORD_NOT_FOUND', 404)
  }

  const updatedRecord: CustomObjectRecord = {
    ...records[index],
    data: { ...records[index].data, ...data },
    updatedBy: 'admin',
    updatedAt: new Date().toISOString(),
  }

  records[index] = updatedRecord
  mockRecords.set(objectName, records)

  return updatedRecord
}

/**
 * Delete a single record
 */
export async function deleteRecord(objectName: string, recordId: string): Promise<void> {
  await delay(300)

  const records = mockRecords.get(objectName) || []
  const index = records.findIndex((rec) => rec.id === recordId)

  if (index === -1) {
    throw new ServiceError(`Record with id "${recordId}" not found`, 'RECORD_NOT_FOUND', 404)
  }

  records.splice(index, 1)
  mockRecords.set(objectName, records)
}

/**
 * Bulk delete records
 */
export async function bulkDeleteRecords(
  objectName: string,
  recordIds: string[]
): Promise<BulkDeleteResult> {
  await delay(500)

  const records = mockRecords.get(objectName) || []
  const success: string[] = []
  const failed: Array<{ id: string; error: string }> = []

  for (const id of recordIds) {
    const index = records.findIndex((rec) => rec.id === id)
    if (index !== -1) {
      records.splice(index, 1)
      success.push(id)
    } else {
      failed.push({ id, error: 'Record not found' })
    }
  }

  mockRecords.set(objectName, records)

  return { success, failed }
}

// ============================================================
// Validation & Utilities
// ============================================================

/**
 * Validate a field configuration
 */
export function validateField(field: CustomField): ValidationResult {
  const errors: ValidationError[] = []

  // Required fields
  if (!field.name || field.name.trim() === '') {
    errors.push({ field: 'name', message: 'Field name is required' })
  } else if (!/^[a-z_][a-z0-9_]*$/.test(field.name)) {
    errors.push({
      field: 'name',
      message: 'Field name must start with lowercase letter and contain only lowercase letters, numbers, and underscores',
    })
  }

  if (!field.label || field.label.trim() === '') {
    errors.push({ field: 'label', message: 'Field label is required' })
  }

  // Type-specific validation
  if (field.type === 'text') {
    if (field.defaultValue && typeof field.defaultValue !== 'string') {
      errors.push({ field: 'defaultValue', message: 'Default value must be a string for text fields' })
    }
  }

  if (field.type === 'number') {
    if (field.defaultValue && typeof field.defaultValue !== 'number') {
      errors.push({ field: 'defaultValue', message: 'Default value must be a number for number fields' })
    }
  }

  if (field.type === 'picklist' || field.type === 'multipicklist') {
    if (!field.picklistOptions || field.picklistOptions.length === 0) {
      errors.push({
        field: 'picklistOptions',
        message: 'Picklist fields must have at least one option',
      })
    }
  }

  if (field.type === 'lookup') {
    if (!field.lookupObject) {
      errors.push({ field: 'lookupObject', message: 'Lookup fields must specify a target object' })
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Generate a unique field name from a label
 */
export function generateFieldName(label: string, existingFields: CustomField[]): string {
  // Convert label to snake_case
  const baseName = label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/_+/g, '_')

  let fieldName = baseName
  let counter = 1

  while (existingFields.some((f) => f.name === fieldName)) {
    fieldName = `${baseName}_${counter}`
    counter++
  }

  return fieldName
}

// ============================================================
// Service Instance Export (for direct component use)
// ============================================================

export const customObjectService = {
  // Object CRUD
  getCustomObjects,
  getCustomObjectByName,
  getCustomObjectById,
  createCustomObject,
  updateCustomObject,
  deleteCustomObject,

  // Field management
  addField,
  updateField,
  deleteField,

  // Record management
  getRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
  bulkDeleteRecords,

  // Utilities
  validateField,
  generateFieldName,
}

export default customObjectService
