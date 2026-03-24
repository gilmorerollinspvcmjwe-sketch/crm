# 导入路径修复指南

## Customer 组件

### CustomerTable.tsx (第 9 行)
```diff
- import { Customer, CustomerLevel, CustomerStatus } from '../types/customer';
+ import { Customer, CustomerLevel, CustomerStatus } from '../../types/customer';
```

### ContactTable.tsx (第 9 行)
```diff
- import { Contact, Gender, DecisionRole } from '../types/contact';
+ import { Contact, Gender, DecisionRole } from '../../types/customer';
```

### LeadTable.tsx (第 9 行)
```diff
- import { Lead, LeadStatus, LeadSource } from '../types/lead';
+ import { Lead, LeadStatus, LeadSource } from '../../types/customer';
```

## Opportunity 组件

### OpportunityTable.tsx (第 4 行)
```diff
- import { Opportunity, OpportunityStage, OpportunityStatus } from '../types/opportunity';
+ import { Opportunity, OpportunityStage, OpportunityStatus } from '../../types/opportunity';
```

### ActivityTable.tsx (第 4 行)
```diff
- import { Activity, ActivityType } from '../types/activity';
+ import { Activity, ActivityType } from '../../types/opportunity';
```

### ContractTable.tsx (第 4 行)
```diff
- import { Contract, ContractStatus } from '../types/contract';
+ import { Contract, ContractStatus } from '../../types/opportunity';
```

## 页面文件

### CustomerList.tsx (第 13-14 行)
```diff
- import { CustomerTable } from '../components/CustomerTable';
- import { SearchFilter } from '../components/SearchFilter';
+ import { CustomerTable } from '../components/Customer/CustomerTable';
+ import { SearchFilter } from '../components/Customer/SearchFilter';
```

### ContactList.tsx (第 12-13 行)
```diff
- import { ContactTable } from '../components/ContactTable';
- import { SearchFilter } from '../components/SearchFilter';
+ import { ContactTable } from '../components/Customer/ContactTable';
+ import { SearchFilter } from '../components/Customer/SearchFilter';
```

### LeadList.tsx (第 13-14 行)
```diff
- import { LeadTable } from '../components/LeadTable';
- import { SearchFilter } from '../components/SearchFilter';
+ import { LeadTable } from '../components/Customer/LeadTable';
+ import { SearchFilter } from '../components/Customer/SearchFilter';
```

### OpportunityList.tsx (第 6-8 行)
```diff
- import { OpportunityTable } from '../components/OpportunityTable';
- import { SalesFunnel } from '../components/SalesFunnel';
- import { SearchFilter } from '../components/SearchFilter';
+ import { OpportunityTable } from '../components/Opportunity/OpportunityTable';
+ import { SalesFunnel } from '../components/Opportunity/SalesFunnel';
+ import { SearchFilter } from '../components/Opportunity/SearchFilter';
```

### ActivityList.tsx (第 6-7 行)
```diff
- import { ActivityTable } from '../components/ActivityTable';
- import { SearchFilter } from '../components/SearchFilter';
+ import { ActivityTable } from '../components/Opportunity/ActivityTable';
+ import { SearchFilter } from '../components/Opportunity/SearchFilter';
```

### ContractList.tsx (第 6-7 行)
```diff
- import { ContractTable } from '../components/ContractTable';
- import { SearchFilter } from '../components/SearchFilter';
+ import { ContractTable } from '../components/Opportunity/ContractTable';
+ import { SearchFilter } from '../components/Opportunity/SearchFilter';
```

## Dashboard 组件

### Dashboard.tsx (已在之前修复) ✅

## 验证

修复后运行：
```bash
npm run build
```

应该成功构建。
