/**
 * UI 状态管理 - 使用 Zustand 管理客户端状态
 * 包含：侧边栏、主题、编辑状态等纯 UI 状态
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeMode = 'light' | 'dark' | 'system'
export type SidebarState = 'expanded' | 'collapsed'

interface UIState {
  // 侧边栏状态
  sidebarState: SidebarState
  setSidebarState: (state: SidebarState) => void
  toggleSidebar: () => void

  // 主题
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void

  // 当前编辑的工作流（客户端编辑状态，不属于服务端数据）
  editingWorkflowId: string | null
  setEditingWorkflowId: (id: string | null) => void

  // 当前编辑的自定义对象
  editingObjectId: string | null
  setEditingObjectId: (id: string | null) => void

  // 全局加载遮罩（用于关键操作）
  globalLoading: boolean
  globalLoadingText?: string
  setGlobalLoading: (loading: boolean, text?: string) => void

  // 模态框状态
  activeModal: string | null
  setActiveModal: (modal: string | null) => void

  // 通知抽屉
  notificationDrawerOpen: boolean
  setNotificationDrawerOpen: (open: boolean) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // 侧边栏
      sidebarState: 'expanded',
      setSidebarState: (state) => set({ sidebarState: state }),
      toggleSidebar: () =>
        set((state) => ({
          sidebarState: state.sidebarState === 'expanded' ? 'collapsed' : 'expanded',
        })),

      // 主题
      theme: 'system',
      setTheme: (theme) => set({ theme }),

      // 编辑状态
      editingWorkflowId: null,
      setEditingWorkflowId: (id) => set({ editingWorkflowId: id }),
      editingObjectId: null,
      setEditingObjectId: (id) => set({ editingObjectId: id }),

      // 全局加载
      globalLoading: false,
      globalLoadingText: undefined,
      setGlobalLoading: (loading, text) =>
        set({ globalLoading: loading, globalLoadingText: text }),

      // 模态框
      activeModal: null,
      setActiveModal: (modal) => set({ activeModal: modal }),

      // 通知抽屉
      notificationDrawerOpen: false,
      setNotificationDrawerOpen: (open) => set({ notificationDrawerOpen: open }),
    }),
    {
      name: 'ui-store',
      partialize: (state) => ({
        sidebarState: state.sidebarState,
        theme: state.theme,
      }),
    }
  )
)