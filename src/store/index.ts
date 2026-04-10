/**
 * Store 统一导出
 * Zustand 用于客户端状态，TanStack Query 用于服务端状态
 */

// UI Store - 客户端 UI 状态（侧边栏、主题、模态框等）
export * from './uiStore'

// Auth Store - 用户认证状态
export * from './authStore'

// App Store - 应用全局状态（语言、功能开关等）
export * from './appStore'

// Form Stores - 表单状态管理
export * from './formStores'

// 注意：服务端状态（CustomObjects、Workflows、Contacts、Leads 等）
// 使用 TanStack Query hooks，请使用 src/hooks/api/ 目录下的 hooks