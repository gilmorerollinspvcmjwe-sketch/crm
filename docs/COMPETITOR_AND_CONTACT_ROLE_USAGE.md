# 竞争对手管理和联系人角色标记使用指南

## 概述

本模块提供商机中的竞争对手管理功能和联系人角色标记功能，帮助销售团队更好地分析竞争态势和关键干系人。

## 新增文件

### 1. 类型定义

**`src/types/competitor.ts`** - 竞争对手和联系人角色类型定义

主要类型：
- `Competitor` - 竞争对手接口
- `CompetitorAnalysis` - 竞争对手分析接口
- `ContactRole` - 联系人角色类型（决策者/影响者/使用者/把关者/其他）
- `ContactRoleMapping` - 联系人角色映射接口
- `ThreatLevel` - 威胁程度（高/中/低）
- `CompetitorStatus` - 竞争状态（活跃/潜在/已淘汰）

### 2. 组件

**`src/components/ContactRoleSelector.tsx`** - 联系人角色选择器组件

功能：
- 为联系人分配决策角色
- 设置影响力评分（1-10）
- 标记支持度（支持/中立/反对）
- 可视化展示角色分布

**`src/pages/opportunities/CompetitorManagement.tsx`** - 竞争对手管理页面

功能：
- 竞争对手列表管理（增删改查）
- 威胁程度筛选和状态筛选
- 优劣势分析
- 应对策略记录
- 统计概览

### 3. 商机类型增强

**`src/types/api.ts`** - Opportunity 接口扩展

新增字段：
```typescript
export interface Opportunity {
  // ... 原有字段
  
  // 竞争对手管理
  competitors?: Competitor[]
  
  // 联系人角色映射
  contactRoles?: ContactRoleMapping[]
}
```

## 使用示例

### 在商机详情页中使用

```tsx
import React, { useState } from 'react'
import { CompetitorManagement } from '@/pages/opportunities/CompetitorManagement'
import { ContactRoleSelector } from '@/components/ContactRoleSelector'
import { Competitor, ContactRoleMapping } from '@/types/competitor'
import { ContactPerson } from '@/types/contactPerson'

interface OpportunityDetailProps {
  opportunityId: string
  contacts: ContactPerson[]
}

export const OpportunityDetail: React.FC<OpportunityDetailProps> = ({
  opportunityId,
  contacts,
}) => {
  const [competitors, setCompetitors] = useState<Competitor[]>([])
  const [contactRoles, setContactRoles] = useState<ContactRoleMapping[]>([])

  return (
    <div className="space-y-6">
      {/* 联系人角色管理 */}
      <ContactRoleSelector
        contacts={contacts}
        value={contactRoles}
        onChange={setContactRoles}
      />

      {/* 竞争对手管理 */}
      <CompetitorManagement
        opportunityId={opportunityId}
        competitors={competitors}
        onChange={setCompetitors}
      />
    </div>
  )
}
```

### 在商机表单中使用（只读模式）

```tsx
<CompetitorManagement
  opportunityId={opportunity.id}
  competitors={opportunity.competitors}
  readOnly={true}
/>

<ContactRoleSelector
  contacts={contacts}
  value={opportunity.contactRoles}
  readOnly={true}
/>
```

### 保存商机数据

```tsx
const handleSaveOpportunity = async () => {
  const updatedOpportunity = {
    ...opportunity,
    competitors,
    contactRoles,
  }

  await api.updateOpportunity(opportunity.id, updatedOpportunity)
}
```

## 竞争对手字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| companyName | string | ✓ | 竞争对手公司名称 |
| contactName | string | ✗ | 竞争对手联系人姓名 |
| contactPosition | string | ✗ | 联系人职位 |
| contactPhone | string | ✗ | 联系电话 |
| contactEmail | string | ✗ | 邮箱 |
| strengths | string | ✓ | 优势分析 |
| weaknesses | string | ✓ | 劣势分析 |
| threatLevel | ThreatLevel | ✓ | 威胁程度（高/中/低） |
| strategy | string | ✓ | 应对策略 |
| status | CompetitorStatus | ✓ | 竞争状态（活跃/潜在/已淘汰） |
| remark | string | ✗ | 备注 |

## 联系人角色说明

### 角色类型

| 角色 | 说明 | 图标 | 颜色 |
|------|------|------|------|
| 决策者 | 拥有最终决定权的人 | ⭐ | 红色 |
| 影响者 | 能够影响决策的人 | 📈 | 紫色 |
| 使用者 | 产品的实际使用者 | 👥 | 蓝色 |
| 把关者 | 控制信息流通的人 | 👤 | 橙色 |
| 其他 | 其他相关角色 | 👤 | 灰色 |

### 支持度

| 支持度 | 说明 | 颜色 |
|--------|------|------|
| 支持 | 支持我方方案 | 绿色 |
| 中立 | 态度中立 | 黄色 |
| 反对 | 支持竞争对手 | 红色 |

## 最佳实践

### 1. 竞争对手分析

- **及时更新**：每次与客户沟通后更新竞争对手信息
- **客观分析**：如实记录对手优劣势，避免主观臆断
- **制定策略**：针对每个高威胁对手制定具体应对策略
- **定期回顾**：在商机推进过程中定期回顾竞争态势

### 2. 联系人角色管理

- **识别决策者**：尽早识别并接触决策者
- **发展支持者**：将中立者发展为支持者
- **关注影响者**：不要忽视影响者的作用
- **了解把关者**：确保信息能够传递给关键人

### 3. 赢单策略

1. **分析竞争态势**：查看所有竞争对手的威胁程度
2. **识别关键干系人**：通过联系人角色了解决策链
3. **制定差异化策略**：基于对手劣势突出我方优势
4. **针对性攻关**：对不同角色的联系人采用不同策略

## API 集成示例

### 获取商机详情（包含竞争对手和联系人角色）

```typescript
// GET /api/opportunities/:id
const response = await fetch(`/api/opportunities/${id}`)
const opportunity: Opportunity = await response.json()

// opportunity.competitors 和 opportunity.contactRoles 已包含在内
```

### 更新商机

```typescript
// PUT /api/opportunities/:id
await fetch(`/api/opportunities/${id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    ...opportunity,
    competitors,
    contactRoles,
  }),
})
```

### 独立管理竞争对手

```typescript
// POST /api/competitors
await fetch('/api/competitors', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(competitorData),
})

// DELETE /api/competitors/:id
await fetch(`/api/competitors/${id}`, {
  method: 'DELETE',
})
```

## 注意事项

1. **权限控制**：确保只有商机负责人和团队成员可以编辑
2. **数据同步**：商机关闭后，竞争对手数据应归档
3. **隐私保护**：联系人信息注意隐私保护
4. **性能优化**：大量竞争对手时可考虑分页加载

## 未来扩展

- [ ] 竞争对手数据库（跨商机复用）
- [ ] 竞争情报收集
- [ ] 赢单/输单分析统计
- [ ] 联系人关系图谱
- [ ] AI 辅助竞争策略建议
