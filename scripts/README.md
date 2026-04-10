# Ant Design Icons → Lucide React 迁移指南

## 📋 概述

本目录包含 Ant Design Icons 到 Lucide React 的完整迁移工具集。

## 📁 文件说明

- **`icon-mapping.js`** - 完整图标映射表，包含 200+ 图标映射
- **`migrate-icons.js`** - 自动化迁移脚本
- **`README.md`** - 本文档

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install lucide-react
```

### 2. 预览迁移

```bash
node scripts/migrate-icons.cjs
```

### 3. 执行迁移

```bash
node scripts/migrate-icons.cjs --apply
```

## 📖 使用方法

### 基本用法

```bash
# 预览所有变更（默认）
node scripts/migrate-icons.cjs

# 执行迁移
node scripts/migrate-icons.cjs --apply

# 显示详细变更
node scripts/migrate-icons.cjs --verbose
```

### 处理特定文件/目录

```bash
# 处理单个文件
node scripts/migrate-icons.cjs --file ./src/components/Button.tsx

# 处理指定目录
node scripts/migrate-icons.cjs --dir ./src/components

# 处理并指定目录
node scripts/migrate-icons.cjs --dir ./src/components --apply
```

### Dry Run 模式

```bash
# 预览不执行
node scripts/migrate-icons.cjs --dry-run
```

## 📊 图标映射表

### 方向类图标

| Ant Design | Lucide React |
|------------|--------------|
| ArrowUpOutlined | ArrowUp |
| ArrowDownOutlined | ArrowDown |
| ArrowLeftOutlined | ArrowLeft |
| ArrowRightOutlined | ArrowRight |
| UpOutlined | ChevronUp |
| DownOutlined | ChevronDown |
| LeftOutlined | ChevronLeft |
| RightOutlined | ChevronRight |

### 操作类图标

| Ant Design | Lucide React |
|------------|--------------|
| PlusOutlined | Plus |
| EditOutlined | Edit |
| DeleteOutlined | Trash2 |
| SearchOutlined | Search |
| EyeOutlined | Eye |
| EyeInvisibleOutlined | EyeOff |
| CopyOutlined | Copy |
| DownloadOutlined | Download |
| UploadOutlined | Upload |
| SaveOutlined | Save |
| CloseOutlined | X |

### 导航类图标

| Ant Design | Lucide React |
|------------|--------------|
| HomeOutlined | Home |
| UserOutlined | User |
| SettingOutlined | Settings |
| BellOutlined | Bell |
| MenuOutlined | Menu |
| DashboardOutlined | LayoutDashboard |
| CalendarOutlined | Calendar |
| MailOutlined | Mail |
| MessageOutlined | MessageSquare |

### 状态类图标

| Ant Design | Lucide React |
|------------|--------------|
| CheckOutlined | Check |
| CheckCircleOutlined | CheckCircle |
| CloseOutlined | X |
| InfoCircleOutlined | Info |
| WarningOutlined | AlertTriangle |
| ExclamationCircleOutlined | AlertCircle |
| QuestionCircleOutlined | HelpCircle |

### 文件类图标

| Ant Design | Lucide React |
|------------|--------------|
| FileOutlined | File |
| FileTextOutlined | FileText |
| FolderOutlined | Folder |
| FolderOpenOutlined | FolderOpen |
| PictureOutlined | Image |
| PaperClipOutlined | Paperclip |

### 业务类图标

| Ant Design | Lucide React |
|------------|--------------|
| CustomerServiceOutlined | Headphones |
| PhoneOutlined | Phone |
| MobileOutlined | Smartphone |
| TeamOutlined | Users |
| BankOutlined | Building2 |
| CreditCardOutlined | CreditCard |
| ShoppingCartOutlined | ShoppingCart |
| GiftOutlined | Gift |

## 💻 代码示例

### 迁移前

```tsx
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  ArrowLeftOutlined 
} from '@ant-design/icons';
import { 
  Button, 
  Input 
} from 'antd';

function MyComponent() {
  return (
    <div>
      <Button type="primary">
        <PlusOutlined /> 添加
      </Button>
      <Input 
        prefix={<SearchOutlined />} 
        placeholder="搜索"
      />
      <ArrowLeftOutlined onClick={goBack} />
      <EditOutlined onClick={handleEdit} />
      <DeleteOutlined onClick={handleDelete} />
    </div>
  );
}
```

### 迁移后

```tsx
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  ArrowLeft 
} from 'lucide-react';
import { 
  Button, 
  Input 
} from 'antd';

function MyComponent() {
  return (
    <div>
      <Button type="primary">
        <Plus /> 添加
      </Button>
      <Input 
        prefix={<Search />} 
        placeholder="搜索"
      />
      <ArrowLeft onClick={goBack} />
      <Edit onClick={handleEdit} />
      <Trash2 onClick={handleDelete} />
    </div>
  );
}
```

## ⚠️ 特殊处理

### Spin 属性

Ant Design 的 `spin` 属性会自动转换为 CSS `animate-spin`：

```tsx
// 迁移前
<LoadingOutlined spin />

// 迁移后
<Loader className="animate-spin" />
```

### Rotate 属性

旋转角度会被转换为 CSS transform：

```tsx
// 迁移前
<ArrowLeftOutlined rotate={90} />

// 迁移后
<ArrowLeft style={{ transform: 'rotate(-90deg)' }} />
```

### 未映射的图标

脚本会标记所有未映射的图标为 `TODO`，需要手动处理：

```tsx
// 迁移后（未映射图标）
// TODO: import { SomeIcon } from '@ant-design/icons'
```

## 🔧 手动迁移

对于脚本无法自动处理的图标，请手动迁移：

1. 在 [Lucide React](https://lucide.dev/) 官网搜索替代图标
2. 更新 import 语句
3. 替换 JSX 中的组件名
4. 检查并调整组件属性

## 📝 迁移后检查清单

- [ ] 运行 `npm install lucide-react`
- [ ] 运行迁移脚本
- [ ] 检查所有 TODO 标记
- [ ] 运行项目验证功能正常
- [ ] 检查图标显示效果
- [ ] 运行 ESLint/Prettier 格式化代码
- [ ] 运行测试确保没有破坏功能

## 🐛 常见问题

### Q: 找不到完全对应的图标怎么办？

A: 选择语义最接近的图标。例如 `BankOutlined` 可以用 `Building2` 或 `landmark`。

### Q: 如何处理自定义图标？

A: 可以考虑：
1. 使用 `lucide-react` 的 `createIcons` 自定义
2. 使用 `img` 标签替换
3. 保留 `antd` 图标用于特定图标

### Q: 迁移后图标大小不一致？

A: Lucide 图标默认使用 24x24，可通过 `size` 属性调整：
```tsx
<Icon size={16} />  // 小
<Icon size={20} />  // 中（与 antd 默认接近）
<Icon size={24} />  // 大
```

## 📄 许可证

MIT License
