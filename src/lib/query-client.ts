import { QueryClient, type QueryClientConfig } from '@tanstack/react-query'

// ============================================================
// Query Client Configuration
// ============================================================
const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      // Stale time - how long data is considered fresh (in ms)
      // Default: 5 minutes for most queries
      staleTime: 1000 * 60 * 5,

      // Cache time - how long unused data stays in cache (in ms)
      // After this time, data is garbage collected
      // Default: 10 minutes
      gcTime: 1000 * 60 * 10,

      // Retry configuration
      retry: (failureCount, error) => {
        // Don't retry on 4xx client errors (except 401 which is handled by interceptor)
        if (error && typeof error === 'object' && 'status' in error) {
          const status = (error as { status?: number }).status
          if (status && status >= 400 && status < 500 && status !== 401) {
            return false
          }
        }
        // Retry up to 3 times for server errors or network issues
        return failureCount < 3
      },

      // Retry delay - exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Refetch on window focus (useful for multi-tab scenarios)
      refetchOnWindowFocus: true,

      // Refetch when the browser comes back online
      refetchOnReconnect: true,

      // Throw errors instead of catching them
      throwOnError: false,
    },

    mutations: {
      // Retry failed mutations once
      retry: 1,
      retryDelay: 1000,
    },
  },
}

// ============================================================
// Create and Export Query Client
// ============================================================
export const queryClient = new QueryClient(queryClientConfig)

// ============================================================
// Query Keys Factory
// Centralized query key management for type-safe cache invalidation
// ============================================================
export const queryKeys = {
  // Base keys
  all: ['crm'] as const,

  // Customer keys
  customers: {
    all: ['crm', 'customers'] as const,
    lists: () => [...queryKeys.customers.all, 'list'] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.customers.lists(), filters] as const,
    details: () => [...queryKeys.customers.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.customers.details(), id] as const,
  },

  // Contact keys
  contacts: {
    all: ['crm', 'contacts'] as const,
    lists: () => [...queryKeys.contacts.all, 'list'] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.contacts.lists(), filters] as const,
    details: () => [...queryKeys.contacts.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.contacts.details(), id] as const,
  },

  // Lead keys
  leads: {
    all: ['crm', 'leads'] as const,
    lists: () => [...queryKeys.leads.all, 'list'] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.leads.lists(), filters] as const,
    details: () => [...queryKeys.leads.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.leads.details(), id] as const,
  },

  // Opportunity keys
  opportunities: {
    all: ['crm', 'opportunities'] as const,
    lists: () => [...queryKeys.opportunities.all, 'list'] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.opportunities.lists(), filters] as const,
    details: () => [...queryKeys.opportunities.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.opportunities.details(), id] as const,
  },

  // Product keys
  products: {
    all: ['crm', 'products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
  },

  // Contract keys
  contracts: {
    all: ['crm', 'contracts'] as const,
    lists: () => [...queryKeys.contracts.all, 'list'] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.contracts.lists(), filters] as const,
    details: () => [...queryKeys.contracts.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.contracts.details(), id] as const,
  },

  // Payment keys
  payments: {
    all: ['crm', 'payments'] as const,
    lists: () => [...queryKeys.payments.all, 'list'] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.payments.lists(), filters] as const,
    details: () => [...queryKeys.payments.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.payments.details(), id] as const,
    // Payment Plans
    plans: (paymentId: string) =>
      [...queryKeys.payments.detail(paymentId), 'plans'] as const,
    // Invoice
    invoice: (paymentId: string) =>
      [...queryKeys.payments.detail(paymentId), 'invoice'] as const,
  },

  // Payment Plan keys
  paymentPlans: {
    all: ['crm', 'paymentPlans'] as const,
    lists: () => [...queryKeys.paymentPlans.all, 'list'] as const,
    list: (paymentId: string) =>
      [...queryKeys.paymentPlans.lists(), paymentId] as const,
    details: () => [...queryKeys.paymentPlans.all, 'detail'] as const,
    detail: (planId: string) => [...queryKeys.paymentPlans.details(), planId] as const,
  },

  // Reconciliation keys
  reconciliations: {
    all: ['crm', 'reconciliations'] as const,
    lists: () => [...queryKeys.reconciliations.all, 'list'] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.reconciliations.lists(), filters] as const,
    details: () => [...queryKeys.reconciliations.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.reconciliations.details(), id] as const,
  },

  // Invoice keys
  invoices: {
    all: ['crm', 'invoices'] as const,
    lists: () => [...queryKeys.invoices.all, 'list'] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.invoices.lists(), filters] as const,
    details: () => [...queryKeys.invoices.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.invoices.details(), id] as const,
    byPayment: (paymentId: string) =>
      [...queryKeys.invoices.all, 'payment', paymentId] as const,
  },

  // Order keys
  orders: {
    all: ['crm', 'orders'] as const,
    lists: () => [...queryKeys.orders.all, 'list'] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.orders.lists(), filters] as const,
    details: () => [...queryKeys.orders.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.orders.details(), id] as const,
  },

  // Pricebook keys
  pricebooks: {
    all: ['crm', 'pricebooks'] as const,
    lists: () => [...queryKeys.pricebooks.all, 'list'] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.pricebooks.lists(), filters] as const,
    details: () => [...queryKeys.pricebooks.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.pricebooks.details(), id] as const,
    entries: (pricebookId: string) =>
      [...queryKeys.pricebooks.detail(pricebookId), 'entries'] as const,
  },

  // Custom Objects keys
  customObjects: {
    all: ['crm', 'customObjects'] as const,
    lists: () => [...queryKeys.customObjects.all, 'list'] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.customObjects.lists(), filters] as const,
    details: () => [...queryKeys.customObjects.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.customObjects.details(), id] as const,
    byname: (name: string) => [...queryKeys.customObjects.all, 'name', name] as const,
    // Properties
    properties: (objectId: string) =>
      [...queryKeys.customObjects.detail(objectId), 'properties'] as const,
    // Records
    records: (objectId: string) =>
      [...queryKeys.customObjects.detail(objectId), 'records'] as const,
    recordList: (objectId: string, filters: Record<string, unknown>) =>
      [...queryKeys.customObjects.records(objectId), 'list', filters] as const,
    recordDetail: (objectId: string, recordId: string) =>
      [...queryKeys.customObjects.records(objectId), 'detail', recordId] as const,
  },

  // Workflows keys
  workflows: {
    all: ['crm', 'workflows'] as const,
    lists: () => [...queryKeys.workflows.all, 'list'] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.workflows.lists(), filters] as const,
    details: () => [...queryKeys.workflows.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.workflows.details(), id] as const,
    // Execution logs
    logs: () => [...queryKeys.workflows.all, 'logs'] as const,
    logList: (filters: Record<string, unknown>) =>
      [...queryKeys.workflows.logs(), 'list', filters] as const,
    // Templates
    templates: () => [...queryKeys.workflows.all, 'templates'] as const,
  },

  // Tickets keys
  tickets: {
    all: ['crm', 'tickets'] as const,
    lists: () => [...queryKeys.tickets.all, 'list'] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.tickets.lists(), filters] as const,
    details: () => [...queryKeys.tickets.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.tickets.details(), id] as const,
    // Activities
    activities: (ticketId: string) =>
      [...queryKeys.tickets.detail(ticketId), 'activities'] as const,
    // Stats
    stats: () => [...queryKeys.tickets.all, 'stats'] as const,
  },

  // Call Center keys
  callcenter: {
    all: ['crm', 'callcenter'] as const,
    // Tasks
    tasks: {
      all: () => [...queryKeys.callcenter.all, 'tasks'] as const,
      lists: () => [...queryKeys.callcenter.tasks.all(), 'list'] as const,
      list: (filters: Record<string, unknown>) =>
        [...queryKeys.callcenter.tasks.lists(), filters] as const,
      details: () => [...queryKeys.callcenter.tasks.all(), 'detail'] as const,
      detail: (id: string) => [...queryKeys.callcenter.tasks.details(), id] as const,
    },
    // Scripts
    scripts: {
      all: () => [...queryKeys.callcenter.all, 'scripts'] as const,
      lists: () => [...queryKeys.callcenter.scripts.all(), 'list'] as const,
      details: () => [...queryKeys.callcenter.scripts.all(), 'detail'] as const,
      detail: (id: string) => [...queryKeys.callcenter.scripts.details(), id] as const,
    },
    // Records
    records: (taskId: string) =>
      [...queryKeys.callcenter.tasks.detail(taskId), 'records'] as const,
    // Stats
    stats: () => [...queryKeys.callcenter.all, 'stats'] as const,
  },

  // Knowledge keys
  knowledge: {
    all: ['crm', 'knowledge'] as const,
    // Documents
    documents: {
      all: () => [...queryKeys.knowledge.all, 'documents'] as const,
      lists: () => [...queryKeys.knowledge.documents.all(), 'list'] as const,
      list: (filters: Record<string, unknown>) =>
        [...queryKeys.knowledge.documents.lists(), filters] as const,
      details: () => [...queryKeys.knowledge.documents.all(), 'detail'] as const,
      detail: (id: string) => [...queryKeys.knowledge.documents.details(), id] as const,
      popular: () => [...queryKeys.knowledge.documents.all(), 'popular'] as const,
    },
    // Categories
    categories: () => [...queryKeys.knowledge.all, 'categories'] as const,
    // Search
    search: (query: string) => [...queryKeys.knowledge.all, 'search', query] as const,
  },

  // Custom Fields keys
  customFields: {
    all: ['crm', 'customFields'] as const,
    lists: () => [...queryKeys.customFields.all, 'list'] as const,
    list: (module?: string) =>
      [...queryKeys.customFields.lists(), module || 'all'] as const,
    details: () => [...queryKeys.customFields.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.customFields.details(), id] as const,
    // Options Sets
    optionsSets: {
      all: () => [...queryKeys.customFields.all, 'optionsSets'] as const,
      lists: () => [...queryKeys.customFields.optionsSets.all(), 'list'] as const,
      details: () => [...queryKeys.customFields.optionsSets.all(), 'detail'] as const,
      detail: (id: string) => [...queryKeys.customFields.optionsSets.details(), id] as const,
    },
    // Values
    values: (module: string, recordId: string) =>
      [...queryKeys.customFields.all, 'values', module, recordId] as const,
  },
}

export default queryClient