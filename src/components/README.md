# 组件导入规范

## 目录结构

```
src/
├── components/
│   ├── Customer/
│   │   ├── CustomerTable.tsx
│   │   ├── ContactTable.tsx
│   │   ├── LeadTable.tsx
│   │   └── SearchFilter.tsx
│   ├── Opportunity/
│   │   ├── OpportunityTable.tsx
│   │   ├── ActivityTable.tsx
│   │   ├── ContractTable.tsx
│   │   ├── SalesFunnel.tsx
│   │   └── SearchFilter.tsx
│   └── Dashboard/
│       └── Dashlet/
├── types/
├── mock/
└── pages/
```

## 导入路径规则

### 1. 类型导入

从 `src/types/` 目录导入类型定义，使用**相对路径** `../../types/xxx`：

```typescript
// Customer 组件 (src/components/Customer/xxx.tsx)
import { Customer, CustomerLevel, CustomerStatus } from '../../types/customer';
import { Contact, Gender, DecisionRole } from '../../types/contact';
import { Lead, LeadStatus, LeadLevel, LeadSource } from '../../types/lead';

// Opportunity 组件 (src/components/Opportunity/xxx.tsx)
import { Opportunity, OpportunityStage, OpportunityStatus } from '../../types/opportunity';
import { Activity, ActivityType, ActivityMethod, ActivityResult } from '../../types/activity';
import { Contract, ContractStatus, ContractType, PaymentPlan } from '../../types/contract';
```

### 2. Mock 数据导入

从 `src/mock/` 目录导入 Mock 数据函数，使用**相对路径** `../../mock/xxxData`：

```typescript
// Customer 组件
import { getCustomerList } from '../../mock/customerData';
import { getContactList } from '../../mock/contactData';
import { getLeadList } from '../../mock/leadData';

// Opportunity 组件
import { opportunityData, filterOpportunities } from '../../mock/opportunityData';
import { activityData, filterActivities } from '../../mock/activityData';
import { contractData, filterContracts } from '../../mock/contractData';
```

### 3. Ant Design 和第三方库

```typescript
import React from 'react';
import { Table, Tag, Space, Button, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
```

## 文件编码

**重要**：所有文件必须使用 **UTF-8 无 BOM** 编码保存。

### 在 VS Code 中设置编码

1. 打开文件
2. 点击右下角编码显示（如 "UTF-8 with BOM"）
3. 选择 "Save with Encoding"
4. 选择 "UTF-8"

### 批量转换编码（PowerShell）

```powershell
$files = Get-ChildItem -Path "src/components" -Recurse -Filter "*.tsx"
foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.UTF8Encoding]::new($false))
}
```

## 组件模板

### 表格组件模板

```typescript
/**
 * [组件名称] 组件
 * [功能描述]
 */
import React from 'react';
import { Table, Tag, Space, Button, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { [Type] } from '../../types/[type]';

interface [ComponentName]Props {
  /** 数据源 */
  dataSource: [Type][];
  /** 加载状态 */
  loading?: boolean;
  /** 分页配置 */
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  /** 查看详情回调 */
  onViewDetail: (id: string) => void;
  /** 编辑回调 */
  onEdit?: (id: string) => void;
  /** 删除回调 */
  onDelete?: (id: string) => void;
}

/**
 * [组件名称] 组件
 */
export const [ComponentName]: React.FC<[ComponentName]Props> = ({
  dataSource,
  loading = false,
  pagination,
  onViewDetail,
  onEdit,
  onDelete,
}) => {
  const columns: ColumnsType<[Type]> = [
    // 列定义
  ];

  return (
    <Table<[Type]>
      rowKey="id"
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      pagination={pagination}
    />
  );
};

export default [ComponentName];
```

## 常见错误

### ❌ 错误的导入路径

```typescript
// 错误：使用绝对路径
import { Customer } from 'src/types/customer';

// 错误：路径层级不对
import { Customer } from '../types/customer';  // 应该是 ../../types/customer

// 错误：组件路径不对
import { CustomerTable } from '../components/CustomerTable';  // 应该是 ../components/Customer/CustomerTable
```

### ✅ 正确的导入路径

```typescript
// 正确：使用相对路径
import { Customer } from '../../types/customer';
import { CustomerTable } from '../components/Customer/CustomerTable';
```

## 检查清单

在提交组件文件前，请检查：

- [ ] 所有类型导入使用 `../../types/xxx`
- [ ] 所有 Mock 数据导入使用 `../../mock/xxxData`
- [ ] 文件编码为 UTF-8 无 BOM
- [ ] 没有使用绝对路径（`src/` 开头）
- [ ] 组件导出同时使用 `export const` 和 `export default`

---

**最后更新**：2026-03-12
