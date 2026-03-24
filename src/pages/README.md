# 页面导入规范

## 目录结构

```
src/
├── pages/
│   ├── CustomerList.tsx
│   ├── ContactList.tsx
│   ├── LeadList.tsx
│   ├── OpportunityList.tsx
│   ├── ActivityList.tsx
│   ├── ContractList.tsx
│   ├── CustomerDetail.tsx
│   ├── ContactDetail.tsx
│   ├── LeadDetail.tsx
│   ├── OpportunityDetail.tsx
│   ├── ContractDetail.tsx
│   ├── Dashboard.tsx
│   └── ...
├── components/
├── types/
└── mock/
```

## 导入路径规则

### 1. 组件导入

从 `src/components/` 目录导入组件，使用**相对路径** `../components/xxx/xxx`：

```typescript
// Customer 相关页面 (src/pages/CustomerList.tsx 等)
import { CustomerTable } from '../components/Customer/CustomerTable';
import { SearchFilter } from '../components/Customer/SearchFilter';

// Contact 相关页面
import { ContactTable } from '../components/Customer/ContactTable';
import { SearchFilter } from '../components/Customer/SearchFilter';

// Lead 相关页面
import { LeadTable } from '../components/Customer/LeadTable';
import { SearchFilter } from '../components/Customer/SearchFilter';

// Opportunity 相关页面
import { OpportunityTable } from '../components/Opportunity/OpportunityTable';
import { SalesFunnel } from '../components/Opportunity/SalesFunnel';
import { SearchFilter } from '../components/Opportunity/SearchFilter';

// Activity 相关页面
import { ActivityTable } from '../components/Opportunity/ActivityTable';
import { SearchFilter } from '../components/Opportunity/SearchFilter';

// Contract 相关页面
import { ContractTable } from '../components/Opportunity/ContractTable';
import { SearchFilter } from '../components/Opportunity/SearchFilter';
```

### 2. 类型导入

从 `src/types/` 目录导入类型定义，使用**相对路径** `../types/xxx`：

```typescript
// Customer 相关页面
import { Customer, CustomerLevel, CustomerStatus } from '../types/customer';
import { Contact, Gender, DecisionRole } from '../types/contact';
import { Lead, LeadStatus, LeadLevel, LeadSource } from '../types/lead';

// Opportunity 相关页面
import { Opportunity, OpportunityStage, OpportunityStatus } from '../types/opportunity';
import { Activity, ActivityType, ActivityFilter } from '../types/activity';
import { Contract, ContractStatus, ContractFilter } from '../types/contract';
```

### 3. Mock 数据导入

从 `src/mock/` 目录导入 Mock 数据函数，使用**相对路径** `../mock/xxxData`：

```typescript
// Customer 相关页面
import { getCustomerList } from '../mock/customerData';
import { getContactList } from '../mock/contactData';
import { getLeadList } from '../mock/leadData';

// Opportunity 相关页面
import { opportunityData, generateSalesFunnelStats, filterOpportunities } from '../mock/opportunityData';
import { activityData, filterActivities } from '../mock/activityData';
import { contractData, generateContractStats, filterContracts } from '../mock/contractData';
```

### 4. React Router 和第三方库

```typescript
import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Space, message, Modal, Row, Col } from 'antd';
import { PlusOutlined, ExportOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
```

## 页面模板

### 列表页面模板

```typescript
/**
 * [模块] 列表页
 * 功能：
 * - 表格展示 [模块] 列表
 * - 搜索筛选
 * - 分页：每页 20 条
 */
import React, { useState, useEffect } from 'react';
import { Card, Button, Space, message, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { [ComponentName] } from '../components/[Module]/[ComponentName]';
import { SearchFilter, FilterField } from '../components/[Module]/SearchFilter';
import { get[ModuleName]List } from '../mock/[module]Data';
import { [Type] } from '../types/[type]';

/**
 * [模块] 列表页组件
 */
export const [ModuleName]List: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dataList, setDataList] = useState<[Type][]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [filters, setFilters] = useState<Record<string, string>>({});

  /** 加载列表数据 */
  const loadDataList = () => {
    setLoading(true);
    try {
      const { list, total } = get[ModuleName]List({
        ...filters,
        page,
        pageSize,
      });
      setDataList(list);
      setTotal(total);
    } catch (error) {
      message.error('加载列表失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /** 初始加载 */
  useEffect(() => {
    loadDataList();
  }, [page, filters]);

  /** 处理搜索 */
  const handleSearch = (values: Record<string, string>) => {
    setFilters(values);
    setPage(1);
  };

  /** 处理重置 */
  const handleReset = () => {
    setFilters({});
    setPage(1);
  };

  /** 处理分页变化 */
  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
  };

  /** 查看详情 */
  const handleViewDetail = (id: string) => {
    navigate(`/[module]/${id}`);
  };

  /** 编辑 */
  const handleEdit = (id: string) => {
    message.info(`编辑：${id}`);
  };

  /** 删除 */
  const handleDelete = (id: string) => {
    message.success(`删除：${id}`);
    loadDataList();
  };

  /** 新建 */
  const handleCreate = () => {
    message.info('新建功能待实现');
  };

  /** 筛选字段配置 */
  const filterFields: FilterField[] = [
    {
      name: 'name',
      label: '名称',
      type: 'text',
      placeholder: '请输入名称',
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card
        title="[模块] 管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建
          </Button>
        }
      >
        {/* 搜索筛选 */}
        <SearchFilter
          fields={filterFields}
          onSearch={handleSearch}
          onReset={handleReset}
          loading={loading}
        />

        {/* 数据表格 */}
        <[ComponentName]
          dataSource={dataList}
          loading={loading}
          pagination={{
            current: page,
            pageSize,
            total,
            onChange: handlePageChange,
          }}
          onViewDetail={handleViewDetail}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card>
    </div>
  );
};

export default [ModuleName]List;
```

### 详情页面模板

```typescript
/**
 * [模块] 详情页
 */
import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Button, Space, message, Tag } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { [Type] } from '../types/[type]';
import { get[ModuleName]Detail } from '../mock/[module]Data';

/**
 * [模块] 详情页组件
 */
export const [ModuleName]Detail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<[Type] | null>(null);

  /** 加载详情数据 */
  const loadDetail = () => {
    if (!id) return;
    setLoading(true);
    try {
      const detail = get[ModuleName]Detail(id);
      setData(detail);
    } catch (error) {
      message.error('加载详情失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetail();
  }, [id]);

  if (!data) {
    return <div>加载中...</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      <Card
        title="[模块] 详情"
        extra={
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
              返回
            </Button>
            <Button type="primary" icon={<EditOutlined />}>
              编辑
            </Button>
          </Space>
        }
      >
        <Descriptions column={2} bordered>
          <Descriptions.Item label="名称">{data.name}</Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag>{data.status}</Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default [ModuleName]Detail;
```

## 文件编码

**重要**：所有文件必须使用 **UTF-8 无 BOM** 编码保存。

### 在 VS Code 中检查编码

1. 打开文件
2. 查看右下角编码显示
3. 如果显示 "UTF-8 with BOM"，点击并选择 "Save with Encoding" → "UTF-8"

## 常见错误

### ❌ 错误的导入路径

```typescript
// 错误：使用绝对路径
import { CustomerTable } from 'src/components/Customer/CustomerTable';

// 错误：路径层级不对
import { CustomerTable } from './components/Customer/CustomerTable';  // 应该是 ../components/

// 错误：缺少模块目录
import { CustomerTable } from '../components/CustomerTable';  // 应该是 ../components/Customer/CustomerTable
```

### ✅ 正确的导入路径

```typescript
// 正确：使用相对路径
import { CustomerTable } from '../components/Customer/CustomerTable';
import { Customer } from '../types/customer';
import { getCustomerList } from '../mock/customerData';
```

## 检查清单

在提交页面文件前，请检查：

- [ ] 所有组件导入使用 `../components/Module/Component`
- [ ] 所有类型导入使用 `../types/xxx`
- [ ] 所有 Mock 数据导入使用 `../mock/xxxData`
- [ ] 文件编码为 UTF-8 无 BOM
- [ ] 没有使用绝对路径（`src/` 开头）
- [ ] 页面导出同时使用 `export const` 和 `export default`
- [ ] 使用 `useNavigate` 进行路由导航
- [ ] 使用 `useParams` 获取路由参数（详情页）

## 页面路由映射

| 页面文件 | 路由路径 | 说明 |
|---------|---------|------|
| CustomerList.tsx | `/customers` | 客户列表 |
| CustomerDetail.tsx | `/customers/:id` | 客户详情 |
| ContactList.tsx | `/contacts` | 联系人列表 |
| ContactDetail.tsx | `/contacts/:id` | 联系人详情 |
| LeadList.tsx | `/leads` | 线索列表 |
| LeadDetail.tsx | `/leads/:id` | 线索详情 |
| OpportunityList.tsx | `/opportunities` | 商机列表 |
| OpportunityDetail.tsx | `/opportunities/:id` | 商机详情 |
| ActivityList.tsx | `/activities` | 跟进记录列表 |
| ContractList.tsx | `/contracts` | 合同列表 |
| ContractDetail.tsx | `/contracts/:id` | 合同详情 |
| Dashboard.tsx | `/dashboard` | 仪表盘 |

---

**最后更新**：2026-03-12
