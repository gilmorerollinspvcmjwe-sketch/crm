/**
 * 设置页面布局组件
 * 纯内容区域，无侧边菜单
 * 
 * 注意：主菜单在 MainLayout.tsx 左侧边栏配置
 */
import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

const LoadingFallback = () => <div style={{ padding: 24 }}>Loading...</div>;

const SettingsLayout: React.FC = () => {
  return (
    <div style={{ padding: 24, minHeight: 'calc(100vh - 120px)' }}>
      <Suspense fallback={<LoadingFallback />}>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default SettingsLayout;
