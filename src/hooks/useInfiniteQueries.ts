/**
 * Infinite Query Utilities for Pagination
 *
 * This module provides utilities for implementing infinite scroll/pagination
 * with TanStack Query. Due to TypeScript complexity with generic infinite queries,
 * see usage examples below.
 *
 * @example
 *
 * For infinite scroll, use useInfiniteQuery directly with explicit types:
 *
 * ```tsx
 * import { useInfiniteQuery } from '@tanstack/react-query'
 * import { http } from '@/lib/axios'
 * import type { PaginatedResponse, Customer, CustomerListParams } from '@/types/api'
 *
 * function InfiniteCustomerList() {
 *   const {
 *     data,
 *     fetchNextPage,
 *     hasNextPage,
 *     isFetchingNextPage,
 *   } = useInfiniteQuery<
 *     PaginatedResponse<Customer>,
 *     Error,
 *     PaginatedResponse<Customer>,
 *     [string, string, CustomerListParams | undefined],
 *     CustomerListParams | undefined
 *   >({
 *     queryKey: ['infinite-customers'],
 *     queryFn: async ({ pageParam }) => {
 *       const params = pageParam ?? { page: 1, pageSize: 10 }
 *       const { data } = await http.get<PaginatedResponse<Customer>>('/customers', { params })
 *       return data
 *     },
 *     initialPageParam: undefined,
 *     getNextPageParam: (lastPage) => {
 *       if (lastPage.page >= lastPage.totalPages) return undefined
 *       return { page: lastPage.page + 1, pageSize: 10 }
 *     },
 *   })
 *
 *   return (
 *     <div>
 *       {data?.pages.flatMap(page => page.data).map(customer => (
 *         <div key={customer.id}>{customer.name}</div>
 *       ))}
 *       <button onClick={() => fetchNextPage()} disabled={!hasNextPage}>
 *         {isFetchingNextPage ? '加载中...' : '加载更多'}
 *       </button>
 *     </div>
 *   )
 * }
 * ```
 */

import type { PaginatedResponse, QueryParams } from '@/types/api'

// Re-export types for convenience
export type { QueryParams, PaginatedResponse }
