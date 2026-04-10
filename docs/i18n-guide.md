# 国际化 (i18n) 使用指南

本项目使用 `react-i18next` 实现多语言支持。

## 文件结构

```
src/
├── i18n/
│   └── index.ts          # i18n 配置入口
├── locales/
│   ├── zh-CN.json        # 简体中文翻译
│   └── en-US.json        # 英文翻译
└── components/
    └── layout/
        └── LanguageSwitcher.tsx  # 语言切换组件
```

## 初始化

在 `main.tsx` 中导入 i18n 配置：

```tsx
import '@/i18n'
```

## 使用方式

### 1. 在组件中使用翻译

```tsx
import { useTranslation } from 'react-i18next'

function MyComponent() {
  const { t } = useTranslation()
  
  return (
    <div>
      <h1>{t('common.save')}</h1>
      <button>{t('common.cancel')}</button>
    </div>
  )
}
```

### 2. 带参数的翻译

```tsx
// zh-CN.json: "totalRecords": "共 {{count}} 条记录"
// en-US.json: "totalRecords": "Total {{count}} records"

<p>{t('customer.list.totalRecords', { count: 100 })}</p>
```

### 3. 嵌套翻译键

```tsx
// 使用嵌套的翻译键
<p>{t('common.unit.days')}</p>
<p>{t('nav.customerManagement')}</p>
```

### 4. 语言切换

```tsx
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'

// 在 Header 或导航中使用
<LanguageSwitcher />
```

### 5. 手动切换语言

```tsx
import { changeLanguage, getCurrentLanguage } from '@/i18n'

// 切换语言
await changeLanguage('en-US')
await changeLanguage('zh-CN')

// 获取当前语言
const lang = getCurrentLanguage()
```

## 翻译键命名规范

翻译键按模块组织：

- `common.*` - 通用词汇（保存、取消、删除等）
- `nav.*` - 导航菜单
- `auth.*` - 认证相关
- `customer.*` - 客户模块
- `opportunity.*` - 商机模块
- `dashboard.*` - 仪表盘
- `settings.*` - 设置模块

## 添加新翻译

1. 在 `src/locales/zh-CN.json` 中添加中文翻译
2. 在 `src/locales/en-US.json` 中添加对应的英文翻译

示例：
```json
// zh-CN.json
{
  "myModule": {
    "title": "我的模块",
    "create": "创建新项"
  }
}

// en-US.json
{
  "myModule": {
    "title": "My Module",
    "create": "Create New Item"
  }
}
```

## 支持的语言

- `zh-CN` - 简体中文 🇨🇳
- `en-US` - English 🇺🇸

语言选择会自动保存到 localStorage，下次访问时自动加载。

## 扩展翻译文件

如需添加更多翻译内容，请将原项目的翻译文件内容合并到 `zh-CN.json` 和 `en-US.json`。原项目的翻译文件位于：

- `crm2026-4-3new/src/i18n/locales/zh.json`
- `crm2026-4-3new/src/i18n/locales/en.json`