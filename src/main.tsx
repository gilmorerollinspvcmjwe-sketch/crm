/**
 * 应用入口
 * Application Entry Point
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// 初始化 i18n 国际化
import '@/i18n'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)