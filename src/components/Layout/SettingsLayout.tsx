/**
 * 设置页面布局组件
 * Settings Layout Component
 * 
 * 使用 Outlet 渲染子路由
 * 注意：设置菜单已移至主布局左侧导航，此处仅保留内容区
 */

import { Outlet } from 'react-router-dom'

// 设置布局组件 - 仅内容区
export function SettingsLayout() {
  return (
    <div className="min-h-[calc(100vh-120px)]">
      {/* 内容区 */}
      <main className="">
        <Outlet />
      </main>
    </div>
  )
}

export default SettingsLayout