/**
 * API Service Configuration
 * Switches between mock API (development) and real API (production)
 *
 * In development (no VITE_API_BASE_URL set), uses mock data.
 * In production, uses real HTTP calls via axios.
 */

import { mockCustomerApi, mockCustomObjectApi, mockWorkflowApi, mockContactApi } from './mock-api'
import type {
  Customer,
  CustomerListParams,
  Contact,
  ContactListParams,
  PaginatedResponse,
  ApiResponse,
} from '@/types/api'
import type {
  CustomObject,
  CustomObjectDefinition,
  ObjectProperty,
  ObjectRecord,
  CustomObjectListParams,
  ObjectRecordListParams,
} from '@/types/customObject'
import type {
  Workflow,
  WorkflowExecutionLog,
  WorkflowTemplate,
  WorkflowListParams,
  ExecutionLogListParams,
} from '@/types/workflow'

// Check if we should use mock API
const USE_MOCK_API = !import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL === '/api/v1'

// ============================================================
// API Service Factory
// Returns mock or real API based on environment
// ============================================================
export const apiService = {
  customers: USE_MOCK_API
    ? {
        list: (params?: CustomerListParams) =>
          mockCustomerApi.list(params) as Promise<PaginatedResponse<Customer>>,
        getById: (id: string) =>
          mockCustomerApi.getById(id) as Promise<Customer>,
        create: (customer: Omit<Customer, 'id' | 'createdAt'>) =>
          mockCustomerApi.create(customer) as Promise<Customer>,
        update: (id: string, customer: Partial<Customer>) =>
          mockCustomerApi.update(id, customer) as Promise<Customer>,
        delete: (id: string) =>
          mockCustomerApi.delete(id) as Promise<void>,
        bulkDelete: (ids: string[]) =>
          mockCustomerApi.bulkDelete(ids) as Promise<void>,
      }
    : {
        // Real API implementation would go here
        list: async (params?: CustomerListParams): Promise<PaginatedResponse<Customer>> => {
          const { http } = await import('./axios')
          const { data } = await http.get<PaginatedResponse<Customer>>('/customers', { params })
          return data
        },
        getById: async (id: string): Promise<Customer> => {
          const { http } = await import('./axios')
          const { data } = await http.get<ApiResponse<Customer>>(`/customers/${id}`)
          return data.data
        },
        create: async (customer: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer> => {
          const { http } = await import('./axios')
          const { data } = await http.post<ApiResponse<Customer>>('/customers', customer)
          return data.data
        },
        update: async (id: string, customer: Partial<Customer>): Promise<Customer> => {
          const { http } = await import('./axios')
          const { data } = await http.patch<ApiResponse<Customer>>(`/customers/${id}`, customer)
          return data.data
        },
        delete: async (id: string): Promise<void> => {
          const { http } = await import('./axios')
          await http.delete(`/customers/${id}`)
        },
        bulkDelete: async (ids: string[]): Promise<void> => {
          const { http } = await import('./axios')
          await http.post('/customers/bulk-delete', { ids })
        },
      },

  // Custom Objects API
  customObjects: USE_MOCK_API
    ? {
        list: (params?: CustomObjectListParams) =>
          mockCustomObjectApi.list(params) as Promise<CustomObject[]>,
        getById: (id: string) =>
          mockCustomObjectApi.getById(id) as Promise<CustomObjectDefinition>,
        getByname: (name: string) =>
          mockCustomObjectApi.getByname(name) as Promise<CustomObjectDefinition>,
        create: (object: Omit<CustomObject, 'id' | 'createdAt' | 'updatedAt'>) =>
          mockCustomObjectApi.create(object) as Promise<CustomObject>,
        update: (id: string, updates: Partial<CustomObject>) =>
          mockCustomObjectApi.update(id, updates) as Promise<CustomObject>,
        delete: (id: string) =>
          mockCustomObjectApi.delete(id) as Promise<void>,
        // Properties
        getProperties: (objectId: string) =>
          mockCustomObjectApi.getProperties(objectId) as Promise<ObjectProperty[]>,
        createProperty: (objectId: string, property: Omit<ObjectProperty, 'id' | 'objectId' | 'createdAt'>) =>
          mockCustomObjectApi.createProperty(objectId, property) as Promise<ObjectProperty>,
        updateProperty: (objectId: string, propertyId: string, updates: Partial<ObjectProperty>) =>
          mockCustomObjectApi.updateProperty(objectId, propertyId, updates) as Promise<ObjectProperty>,
        deleteProperty: (objectId: string, propertyId: string) =>
          mockCustomObjectApi.deleteProperty(objectId, propertyId) as Promise<void>,
        // Records
        getRecords: (params: ObjectRecordListParams) =>
          mockCustomObjectApi.getRecords(params) as Promise<PaginatedResponse<ObjectRecord>>,
        getRecordById: (objectId: string, recordId: string) =>
          mockCustomObjectApi.getRecordById(objectId, recordId) as Promise<ObjectRecord>,
        createRecord: (objectId: string, data: Record<string, unknown>) =>
          mockCustomObjectApi.createRecord(objectId, data) as Promise<ObjectRecord>,
        updateRecord: (objectId: string, recordId: string, data: Record<string, unknown>) =>
          mockCustomObjectApi.updateRecord(objectId, recordId, data) as Promise<ObjectRecord>,
        deleteRecord: (objectId: string, recordId: string) =>
          mockCustomObjectApi.deleteRecord(objectId, recordId) as Promise<void>,
      }
    : {
        // Real API implementation placeholder
        list: async (params?: CustomObjectListParams): Promise<CustomObject[]> => {
          const { http } = await import('./axios')
          const { data } = await http.get<ApiResponse<CustomObject[]>>('/custom-objects', { params })
          return data.data
        },
        getById: async (id: string): Promise<CustomObjectDefinition> => {
          const { http } = await import('./axios')
          const { data } = await http.get<ApiResponse<CustomObjectDefinition>>(`/custom-objects/${id}`)
          return data.data
        },
        getByname: async (name: string): Promise<CustomObjectDefinition> => {
          const { http } = await import('./axios')
          const { data } = await http.get<ApiResponse<CustomObjectDefinition>>(`/custom-objects/name/${name}`)
          return data.data
        },
        create: async (object: Omit<CustomObject, 'id' | 'createdAt' | 'updatedAt'>): Promise<CustomObject> => {
          const { http } = await import('./axios')
          const { data } = await http.post<ApiResponse<CustomObject>>('/custom-objects', object)
          return data.data
        },
        update: async (id: string, updates: Partial<CustomObject>): Promise<CustomObject> => {
          const { http } = await import('./axios')
          const { data } = await http.patch<ApiResponse<CustomObject>>(`/custom-objects/${id}`, updates)
          return data.data
        },
        delete: async (id: string): Promise<void> => {
          const { http } = await import('./axios')
          await http.delete(`/custom-objects/${id}`)
        },
        getProperties: async (objectId: string): Promise<ObjectProperty[]> => {
          const { http } = await import('./axios')
          const { data } = await http.get<ApiResponse<ObjectProperty[]>>(`/custom-objects/${objectId}/properties`)
          return data.data
        },
        createProperty: async (objectId: string, property: Omit<ObjectProperty, 'id' | 'objectId' | 'createdAt'>): Promise<ObjectProperty> => {
          const { http } = await import('./axios')
          const { data } = await http.post<ApiResponse<ObjectProperty>>(`/custom-objects/${objectId}/properties`, property)
          return data.data
        },
        updateProperty: async (objectId: string, propertyId: string, updates: Partial<ObjectProperty>): Promise<ObjectProperty> => {
          const { http } = await import('./axios')
          const { data } = await http.patch<ApiResponse<ObjectProperty>>(`/custom-objects/${objectId}/properties/${propertyId}`, updates)
          return data.data
        },
        deleteProperty: async (objectId: string, propertyId: string): Promise<void> => {
          const { http } = await import('./axios')
          await http.delete(`/custom-objects/${objectId}/properties/${propertyId}`)
        },
        getRecords: async (params: ObjectRecordListParams): Promise<PaginatedResponse<ObjectRecord>> => {
          const { http } = await import('./axios')
          const { data } = await http.get<PaginatedResponse<ObjectRecord>>(`/custom-objects/${params.objectId}/records`, { params })
          return data
        },
        getRecordById: async (objectId: string, recordId: string): Promise<ObjectRecord> => {
          const { http } = await import('./axios')
          const { data } = await http.get<ApiResponse<ObjectRecord>>(`/custom-objects/${objectId}/records/${recordId}`)
          return data.data
        },
        createRecord: async (objectId: string, data: Record<string, unknown>): Promise<ObjectRecord> => {
          const { http } = await import('./axios')
          const response = await http.post<ApiResponse<ObjectRecord>>(`/custom-objects/${objectId}/records`, data)
          return response.data.data
        },
        updateRecord: async (objectId: string, recordId: string, data: Record<string, unknown>): Promise<ObjectRecord> => {
          const { http } = await import('./axios')
          const response = await http.patch<ApiResponse<ObjectRecord>>(`/custom-objects/${objectId}/records/${recordId}`, data)
          return response.data.data
        },
        deleteRecord: async (objectId: string, recordId: string): Promise<void> => {
          const { http } = await import('./axios')
          await http.delete(`/custom-objects/${objectId}/records/${recordId}`)
        },
      },

  // Workflows API
  workflows: USE_MOCK_API
    ? {
        list: (params?: WorkflowListParams) =>
          mockWorkflowApi.list(params) as Promise<Workflow[]>,
        getById: (id: string) =>
          mockWorkflowApi.getById(id) as Promise<Workflow>,
        create: (workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt' | 'runCount' | 'successCount' | 'failedCount'>) =>
          mockWorkflowApi.create(workflow) as Promise<Workflow>,
        update: (id: string, updates: Partial<Workflow>) =>
          mockWorkflowApi.update(id, updates) as Promise<Workflow>,
        delete: (id: string) =>
          mockWorkflowApi.delete(id) as Promise<void>,
        activate: (id: string) =>
          mockWorkflowApi.activate(id) as Promise<Workflow>,
        deactivate: (id: string) =>
          mockWorkflowApi.deactivate(id) as Promise<Workflow>,
        getExecutionLogs: (params?: ExecutionLogListParams) =>
          mockWorkflowApi.getExecutionLogs(params) as Promise<PaginatedResponse<WorkflowExecutionLog>>,
        getTemplates: () =>
          mockWorkflowApi.getTemplates() as Promise<WorkflowTemplate[]>,
      }
    : {
        // Real API implementation placeholder
        list: async (params?: WorkflowListParams): Promise<Workflow[]> => {
          const { http } = await import('./axios')
          const { data } = await http.get<ApiResponse<Workflow[]>>('/workflows', { params })
          return data.data
        },
        getById: async (id: string): Promise<Workflow> => {
          const { http } = await import('./axios')
          const { data } = await http.get<ApiResponse<Workflow>>(`/workflows/${id}`)
          return data.data
        },
        create: async (workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt' | 'runCount' | 'successCount' | 'failedCount'>): Promise<Workflow> => {
          const { http } = await import('./axios')
          const { data } = await http.post<ApiResponse<Workflow>>('/workflows', workflow)
          return data.data
        },
        update: async (id: string, updates: Partial<Workflow>): Promise<Workflow> => {
          const { http } = await import('./axios')
          const { data } = await http.patch<ApiResponse<Workflow>>(`/workflows/${id}`, updates)
          return data.data
        },
        delete: async (id: string): Promise<void> => {
          const { http } = await import('./axios')
          await http.delete(`/workflows/${id}`)
        },
        activate: async (id: string): Promise<Workflow> => {
          const { http } = await import('./axios')
          const { data } = await http.post<ApiResponse<Workflow>>(`/workflows/${id}/activate`)
          return data.data
        },
        deactivate: async (id: string): Promise<Workflow> => {
          const { http } = await import('./axios')
          const { data } = await http.post<ApiResponse<Workflow>>(`/workflows/${id}/deactivate`)
          return data.data
        },
        getExecutionLogs: async (params?: ExecutionLogListParams): Promise<PaginatedResponse<WorkflowExecutionLog>> => {
          const { http } = await import('./axios')
          const { data } = await http.get<PaginatedResponse<WorkflowExecutionLog>>('/workflows/logs', { params })
          return data
        },
        getTemplates: async (): Promise<WorkflowTemplate[]> => {
          const { http } = await import('./axios')
          const { data } = await http.get<ApiResponse<WorkflowTemplate[]>>('/workflows/templates')
          return data.data
        },
      },

  // Contacts API
  contacts: USE_MOCK_API
    ? {
        list: (params?: ContactListParams) =>
          mockContactApi.list(params) as Promise<PaginatedResponse<Contact>>,
        getById: (id: string) =>
          mockContactApi.getById(id) as Promise<Contact>,
        create: (contact: Omit<Contact, 'id' | 'createdAt'>) =>
          mockContactApi.create(contact) as Promise<Contact>,
        update: (id: string, contact: Partial<Contact>) =>
          mockContactApi.update(id, contact) as Promise<Contact>,
        delete: (id: string) =>
          mockContactApi.delete(id) as Promise<void>,
        getByCustomer: (customerId: string, params?: ContactListParams) =>
          mockContactApi.getByCustomer(customerId, params) as Promise<PaginatedResponse<Contact>>,
      }
    : {
        // Real API implementation placeholder
        list: async (params?: ContactListParams): Promise<PaginatedResponse<Contact>> => {
          const { http } = await import('./axios')
          const { data } = await http.get<PaginatedResponse<Contact>>('/contacts', { params })
          return data
        },
        getById: async (id: string): Promise<Contact> => {
          const { http } = await import('./axios')
          const { data } = await http.get<ApiResponse<Contact>>(`/contacts/${id}`)
          return data.data
        },
        create: async (contact: Omit<Contact, 'id' | 'createdAt'>): Promise<Contact> => {
          const { http } = await import('./axios')
          const { data } = await http.post<ApiResponse<Contact>>('/contacts', contact)
          return data.data
        },
        update: async (id: string, contact: Partial<Contact>): Promise<Contact> => {
          const { http } = await import('./axios')
          const { data } = await http.patch<ApiResponse<Contact>>(`/contacts/${id}`, contact)
          return data.data
        },
        delete: async (id: string): Promise<void> => {
          const { http } = await import('./axios')
          await http.delete(`/contacts/${id}`)
        },
        getByCustomer: async (customerId: string, params?: ContactListParams): Promise<PaginatedResponse<Contact>> => {
          const { http } = await import('./axios')
          const { data } = await http.get<PaginatedResponse<Contact>>(`/contacts/customer/${customerId}`, { params })
          return data
        },
      },

  // Generic HTTP methods for other APIs
  get: async <T>(url: string, params?: Record<string, unknown>): Promise<T> => {
    const { http } = await import('./axios')
    const { data } = await http.get<T>(url, { params })
    return data
  },
  post: async <T>(url: string, body?: unknown): Promise<T> => {
    const { http } = await import('./axios')
    const { data } = await http.post<T>(url, body)
    return data
  },
  put: async <T>(url: string, body?: unknown): Promise<T> => {
    const { http } = await import('./axios')
    const { data } = await http.put<T>(url, body)
    return data
  },
  patch: async <T>(url: string, body?: unknown): Promise<T> => {
    const { http } = await import('./axios')
    const { data } = await http.patch<T>(url, body)
    return data
  },
  delete: async <T>(url: string): Promise<T> => {
    const { http } = await import('./axios')
    const { data } = await http.delete<T>(url)
    return data
  },
}

export default apiService