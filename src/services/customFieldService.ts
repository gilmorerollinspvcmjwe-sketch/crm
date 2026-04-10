/**
 * Custom Field/自定义字段 Service
 * Handles custom fields CRUD, field values, and options sets
 */
import { http } from '@/lib/axios'
import { handleApiError } from './base'
import type { ApiResponse } from '@/types/api'

// ============================================================
// Types
// ============================================================

export type ModuleType = 'customer' | 'lead' | 'opportunity' | 'contract' | 'product' | 'order'
export type FieldType = 'text' | 'number' | 'date' | 'datetime' | 'select' | 'multiselect' | 'checkbox' | 'radio' | 'textarea' | 'url' | 'email' | 'phone'

export interface CustomField {
  id: string
  name: string
  label: string
  type: FieldType
  modules: ModuleType[]
  required: boolean
  enabled: boolean
  sortOrder: number
  defaultValue?: string
  placeholder?: string
  validation?: {
    pattern?: string
    min?: number
    max?: number
    minLength?: number
    maxLength?: number
  }
  optionsSetId?: string
  createdAt: string
  createdBy: string
  updatedAt?: string
  updatedBy?: string
}

export interface OptionsSet {
  id: string
  name: string
  description?: string
  options: { value: string; label: string; color?: string; order: number }[]
  createdAt: string
  createdBy: string
}

export interface CustomFieldValue {
  fieldId: string
  value: unknown
}

export interface CreateCustomFieldData {
  name: string
  label: string
  type: FieldType
  modules: ModuleType[]
  required?: boolean
  enabled?: boolean
  sortOrder?: number
  defaultValue?: string
  placeholder?: string
  validation?: CustomField['validation']
  optionsSetId?: string
}

export interface UpdateCustomFieldData {
  name?: string
  label?: string
  type?: FieldType
  modules?: ModuleType[]
  required?: boolean
  enabled?: boolean
  sortOrder?: number
  defaultValue?: string
  placeholder?: string
  validation?: CustomField['validation']
  optionsSetId?: string
}

export interface CreateOptionsSetData {
  name: string
  description?: string
  options: OptionsSet['options']
}

export interface UpdateOptionsSetData {
  name?: string
  description?: string
  options?: OptionsSet['options']
}

// ============================================================
// API Functions
// ============================================================

const customFieldApi = {
  // ================== Custom Fields ==================

  /**
   * Get all custom fields
   * Optionally filter by module
   */
  getFields: async (module?: ModuleType): Promise<CustomField[]> => {
    try {
      const { data } = await http.get<ApiResponse<CustomField[]>>('/custom-fields', {
        params: module ? { module } : undefined
      })
      return data.data.filter(f => f.enabled)
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * Get field by ID
   */
  getFieldById: async (id: string): Promise<CustomField> => {
    try {
      const { data } = await http.get<ApiResponse<CustomField>>(`/custom-fields/${id}`)
      return data.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * Create custom field
   */
  createField: async (fieldData: CreateCustomFieldData): Promise<CustomField> => {
    try {
      const { data } = await http.post<ApiResponse<CustomField>>('/custom-fields', fieldData)
      return data.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * Update custom field
   */
  updateField: async (id: string, fieldData: UpdateCustomFieldData): Promise<CustomField> => {
    try {
      const { data } = await http.patch<ApiResponse<CustomField>>(`/custom-fields/${id}`, fieldData)
      return data.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * Delete custom field
   */
  deleteField: async (id: string): Promise<void> => {
    try {
      await http.delete(`/custom-fields/${id}`)
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * Batch update field order
   */
  batchUpdateOrder: async (fieldOrders: { id: string; sortOrder: number }[]): Promise<void> => {
    try {
      await http.patch('/custom-fields/order', { orders: fieldOrders })
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // ================== Field Values ==================

  /**
   * Get field values for a record
   */
  getFieldValues: async (module: ModuleType, recordId: string): Promise<Record<string, unknown>> => {
    try {
      const { data } = await http.get<ApiResponse<Record<string, unknown>>>(
        `/custom-fields/values/${module}/${recordId}`
      )
      return data.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * Save field values for a record
   */
  saveFieldValues: async (
    module: ModuleType,
    recordId: string,
    values: Record<string, unknown>
  ): Promise<void> => {
    try {
      await http.post(`/custom-fields/values/${module}/${recordId}`, { values })
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // ================== Options Sets ==================

  /**
   * Get all options sets
   */
  getOptionsSets: async (): Promise<OptionsSet[]> => {
    try {
      const { data } = await http.get<ApiResponse<OptionsSet[]>>('/custom-fields/options-sets')
      return data.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * Get options set by ID
   */
  getOptionsSetById: async (id: string): Promise<OptionsSet> => {
    try {
      const { data } = await http.get<ApiResponse<OptionsSet>>(`/custom-fields/options-sets/${id}`)
      return data.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * Create options set
   */
  createOptionsSet: async (setData: CreateOptionsSetData): Promise<OptionsSet> => {
    try {
      const { data } = await http.post<ApiResponse<OptionsSet>>('/custom-fields/options-sets', setData)
      return data.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * Update options set
   */
  updateOptionsSet: async (id: string, setData: UpdateOptionsSetData): Promise<OptionsSet> => {
    try {
      const { data } = await http.patch<ApiResponse<OptionsSet>>(`/custom-fields/options-sets/${id}`, setData)
      return data.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * Delete options set
   */
  deleteOptionsSet: async (id: string): Promise<void> => {
    try {
      await http.delete(`/custom-fields/options-sets/${id}`)
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // ================== Type Options ==================

  /**
   * Get field type options
   */
  getTypeOptions: async (): Promise<{ value: FieldType; label: string }[]> => {
    return [
      { value: 'text', label: '文本' },
      { value: 'number', label: '数字' },
      { value: 'date', label: '日期' },
      { value: 'datetime', label: '日期时间' },
      { value: 'select', label: '下拉选择' },
      { value: 'multiselect', label: '多选' },
      { value: 'checkbox', label: '复选框' },
      { value: 'radio', label: '单选' },
      { value: 'textarea', label: '多行文本' },
      { value: 'url', label: '网址' },
      { value: 'email', label: '邮箱' },
      { value: 'phone', label: '电话' },
    ]
  },

  /**
   * Get module options
   */
  getModuleOptions: async (): Promise<{ value: ModuleType; label: string }[]> => {
    return [
      { value: 'customer', label: '客户' },
      { value: 'lead', label: '线索' },
      { value: 'opportunity', label: '商机' },
      { value: 'contract', label: '合同' },
      { value: 'product', label: '产品' },
      { value: 'order', label: '订单' },
    ]
  },
}

// ============================================================
// Export
// ============================================================

export { customFieldApi }
export default customFieldApi