/**
 * Language Switcher Component
 * Allows users to switch between supported languages
 */
import React from 'react';
import { Button, Dropdown, Space } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { MenuProps } from 'antd';

interface LanguageOption {
  code: string;
  label: string;
  flag: string;
}

const languages: LanguageOption[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
];

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('i18nextLng', langCode);
  };

  const menuItems: MenuProps['items'] = languages.map((lang) => ({
    key: lang.code,
    label: (
      <Space>
        <span>{lang.flag}</span>
        <span>{lang.label}</span>
      </Space>
    ),
    onClick: () => handleLanguageChange(lang.code),
  }));

  return (
    <Dropdown menu={{ items: menuItems, selectedKeys: [i18n.language] }} trigger={['click']}>
      <Button type="text" size="small">
        <Space size={4}>
          <GlobalOutlined />
          <span>{currentLanguage.label}</span>
        </Space>
      </Button>
    </Dropdown>
  );
};

export default LanguageSwitcher;