/**
 * Ticket TanStack Query Hooks
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ticketApi } from '@/services/ticketService'
import { queryKeys } from '@/lib/query-client'
import type {
  TicketListParams,
  CreateTicketData,
  UpdateTicketData,
  AddActivityData,
} from '@/services/ticketService'

// ============================================================
// Hooks
// ============================================================

/**
 * Fetch paginated ticket list
 */
export function useTickets(params?: TicketListParams) {
  return useQuery({
    queryKey: queryKeys.tickets.list(params || {}),
    queryFn: () => ticketApi.list(params),
    placeholderData: (previousData) => previousData,
  })
}

/**
 * Fetch a single ticket by ID
 */
export function useTicket(id: string | null) {
  return useQuery({
    queryKey: queryKeys.tickets.detail(id || ''),
    queryFn: () => ticketApi.getById(id!),
    enabled: !!id,
  })
}

/**
 * Fetch ticket activities
 */
export function useTicketActivities(ticketId: string | null) {
  return useQuery({
    queryKey: queryKeys.tickets.activities(ticketId || ''),
    queryFn: () => ticketApi.getActivities(ticketId!),
    enabled: !!ticketId,
  })
}

/**
 * Fetch ticket statistics
 */
export function useTicketStats() {
  return useQuery({
    queryKey: queryKeys.tickets.stats(),
    queryFn: () => ticketApi.getStats(),
  })
}

/**
 * Create a new ticket
 */
export function useCreateTicket() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTicketData) => ticketApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets.stats() })
    },
  })
}

/**
 * Update an existing ticket
 */
export function useUpdateTicket() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & UpdateTicketData) =>
      ticketApi.update(id, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(
        queryKeys.tickets.detail(updated.id),
        updated
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets.stats() })
    },
  })
}

/**
 * Delete a ticket
 */
export function useDeleteTicket() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => ticketApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets.stats() })
    },
  })
}

/**
 * Add ticket activity
 */
export function useAddTicketActivity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: AddActivityData) => ticketApi.addActivity(data),
    onSuccess: (_, { ticketId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets.activities(ticketId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets.detail(ticketId) })
    },
  })
}

/**
 * Get status options
 */
export function useTicketStatusOptions() {
  return useQuery({
    queryKey: [...queryKeys.tickets.all, 'statusOptions'],
    queryFn: () => ticketApi.getStatusOptions(),
    staleTime: Infinity, // Static data
  })
}

/**
 * Get priority options
 */
export function useTicketPriorityOptions() {
  return useQuery({
    queryKey: [...queryKeys.tickets.all, 'priorityOptions'],
    queryFn: () => ticketApi.getPriorityOptions(),
    staleTime: Infinity, // Static data
  })
}

// Export API for direct usage
export { ticketApi }