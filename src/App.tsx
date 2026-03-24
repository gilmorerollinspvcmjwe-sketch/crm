/**
 * App 根组件
 */
import React, { useMemo } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
import { useTranslation } from 'react-i18next';
import { antdTheme } from './styles/antdTheme';
import './styles/global.css';
import router from './routes';

const App: React.FC = () => {
  const { i18n } = useTranslation();
  
  // Determine Ant Design locale based on i18n language
  const antdLocale = useMemo(() => {
    return i18n.language === 'zh' ? zhCN : enUS;
  }, [i18n.language]);

  return (
    <ConfigProvider theme={antdTheme} locale={antdLocale}>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
};

export default App;
