/**
 * 应用全局状态管理 - 使用 Zustand
 * 包含：全局配置、应用级别的状态
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type AppLanguage = 'zh-CN' | 'en-US'

interface AppState {
  // 语言设置
  language: AppLanguage
  setLanguage: (lang: AppLanguage) => void
  
  // 应用初始化状态
  isInitialized: boolean
  setInitialized: (initialized: boolean) => void
  
  // 全局错误信息
  globalError: string | null
  setGlobalError: (error: string | null) => void
  
  // 应用版本信息
  appVersion: string
  setAppVersion: (version: string) => void
  
  // 功能开关（用于控制特性的启用）
  features: Record<string, boolean>
  setFeature: (feature: string, enabled: boolean) => void
  isFeatureEnabled: (feature: string) => boolean
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // 语言
      language: 'zh-CN',
      setLanguage: (lang) => set({ language: lang }),
      
      // 初始化
      isInitialized: false,
      setInitialized: (initialized) => set({ isInitialized: initialized }),
      
      // 错误
      globalError: null,
      setGlobalError: (error) => set({ globalError: error }),
      
      // 版本
      appVersion: '0.1.0',
      setAppVersion: (version) => set({ appVersion: version }),
      
      // 功能开关
      features: {},
      setFeature: (feature, enabled) => set((state) => ({
        features: { ...state.features, [feature]: enabled },
      })),
      isFeatureEnabled: (feature) => get().features[feature] ?? false,
    }),
    {
      name: 'app-store',
      partialize: (state) => ({
        language: state.language,
        features: state.features,
      }),
    }
  )
)

export type { AppState }