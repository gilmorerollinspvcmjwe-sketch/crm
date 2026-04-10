/**
 * i18n 国际化配置
 * Internationalization Configuration
 * 
 * 使用 react-i18next 实现多语言支持
 */

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enUS from '@/locales/en-US.json'
import zhCN from '@/locales/zh-CN.json'

// 语言资源
const resources = {
  'zh-CN': {
    translation: zhCN,
  },
  'en-US': {
    translation: enUS,
  },
}

// 获取存储的语言或浏览器语言
const getSavedLanguage = (): string => {
  // 从 localStorage 获取保存的语言
  const savedLang = localStorage.getItem('language')
  if (savedLang && (savedLang === 'zh-CN' || savedLang === 'en-US')) {
    return savedLang
  }
  
  // 检测浏览器语言
  const browserLang = navigator.language
  if (browserLang.startsWith('zh')) {
    return 'zh-CN'
  }
  
  return 'en-US'
}

// 初始化 i18n
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getSavedLanguage(),
    fallbackLng: 'zh-CN',
    interpolation: {
      escapeValue: false, // React 已经处理了 XSS
    },
    react: {
      useSuspense: false, // 禁用 Suspense，避免闪烁
    },
  })

// 监听语言变化，保存到 localStorage
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng)
  // 更新 HTML lang 属性
  document.documentElement.lang = lng
})

export default i18n

// 语言切换函数
export const changeLanguage = async (lng: 'zh-CN' | 'en-US'): Promise<void> => {
  await i18n.changeLanguage(lng)
}

// 获取当前语言
export const getCurrentLanguage = (): string => {
  return i18n.language
}

// 支持的语言列表
export const supportedLanguages = [
  { code: 'zh-CN', name: '简体中文', flag: '🇨🇳' },
  { code: 'en-US', name: 'English', flag: '🇺🇸' },
] as const