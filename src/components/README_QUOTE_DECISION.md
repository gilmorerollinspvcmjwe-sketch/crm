# 商机报价单与决策流程组件使用指南

## 新增组件

### 1. QuoteGenerationDialog - 报价单生成对话框

**文件位置**: `src/components/QuoteGenerationDialog.tsx`

**功能**:
- 从商机数据自动生成报价单
- 选择产品/服务并配置价格
- 设置整单折扣和行级折扣
- 配置有效期、备注、条款
- 预览报价单并生成

**使用示例**:

```tsx
import { useState } from 'react'
import { QuoteGenerationDialog } from '@/components/QuoteGenerationDialog'
import { Opportunity } from '@/types/opportunity'

function OpportunityDetail({ opportunity }: { opportunity: Opportunity }) {
  const [showQuoteDialog, setShowQuoteDialog] = useState(false)

  return (
    <div>
      <Button onClick={() => setShowQuoteDialog(true)}>
        生成报价单
      </Button>

      <QuoteGenerationDialog
        open={showQuoteDialog}
        onOpenChange={setShowQuoteDialog}
        opportunity={opportunity}
        onSuccess={(quote) => {
          console.log('报价单已生成:', quote)
          // 可以跳转到报价单详情页或刷新列表
        }}
        onCancel={() => {
          console.log('已取消')
        }}
      />
    </div>
  )
}
```

**Props**:

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| open | boolean | 是 | 对话框是否打开 |
| onOpenChange | (open: boolean) => void | 是 | 打开状态变化回调 |
| opportunity | Opportunity | 是 | 商机对象 |
| onSuccess | (quote: Quote) => void | 否 | 生成成功回调 |
| onCancel | () => void | 否 | 取消回调 |

---

### 2. DecisionProcessRecord - 决策流程记录

**文件位置**: `src/components/DecisionProcessRecord.tsx`

**功能**:
- 决策流程可视化展示
- 决策步骤的创建、编辑、删除
- 步骤状态管理（未完成/已完成/已跳过）
- 关键决策人标记
- 决策时间线跟踪
- 流程统计（完成率、平均完成时间等）

**使用示例**:

```tsx
import { DecisionProcessRecord } from '@/components/DecisionProcessRecord'
import { Opportunity, DecisionProcess } from '@/types/opportunity'

function OpportunityDetail({ opportunity }: { opportunity: Opportunity }) {
  const [decisionProcess, setDecisionProcess] = useState<DecisionProcess | undefined>(
    opportunity.decisionProcess
  )

  const handleUpdate = (updatedProcess: DecisionProcess) => {
    setDecisionProcess(updatedProcess)
    // TODO: 调用 API 保存到后端
    // await updateDecisionProcess(opportunity.id, updatedProcess)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>客户决策流程</CardTitle>
      </CardHeader>
      <CardContent>
        <DecisionProcessRecord
          opportunity={opportunity}
          decisionProcess={decisionProcess}
          onUpdate={handleUpdate}
          readOnly={false}
        />
      </CardContent>
    </Card>
  )
}
```

**Props**:

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| opportunity | Opportunity | 是 | 商机对象 |
| decisionProcess | DecisionProcess | 否 | 决策流程数据 |
| onUpdate | (process: DecisionProcess) => void | 否 | 更新回调 |
| readOnly | boolean | 否 | 只读模式，默认 false |

---

## 类型定义

### 增强的 Opportunity 类型

**文件位置**: `src/types/opportunity.ts`

```typescript
import { Opportunity } from '@/types/opportunity'

// Opportunity 现在包含：
interface Opportunity {
  // ... 原有字段
  quoteIds?: string[]          // 关联的报价单 ID 列表
  decisionProcess?: DecisionProcess  // 决策流程
}
```

### DecisionProcess 类型

```typescript
interface DecisionProcess {
  id: string
  name: string
  description?: string
  steps: DecisionStep[]
  currentStepId?: string
  status: 'active' | 'completed' | 'paused' | 'cancelled'
  startedAt?: string
  completedAt?: string
  createdAt: string
  updatedAt: string
}

interface DecisionStep {
  id: string
  name: string
  description?: string
  ownerId: string
  ownerName: string
  status: 'pending' | 'completed' | 'skipped'
  plannedDate?: string
  completedAt?: string
  notes?: string
  createdAt: string
  updatedAt: string
  sortOrder: number
}
```

---

## 完整集成示例

### 商机详情页集成

```tsx
// src/pages/opportunities/OpportunityDetail.tsx
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QuoteGenerationDialog } from '@/components/QuoteGenerationDialog'
import { DecisionProcessRecord } from '@/components/DecisionProcessRecord'
import { Opportunity, DecisionProcess } from '@/types/opportunity'
import { Quote } from '@/types/cpq'
import { useOpportunity } from '@/hooks/api/useOpportunity'

export function OpportunityDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: opportunity, isLoading } = useOpportunity(id)
  const [showQuoteDialog, setShowQuoteDialog] = useState(false)
  const [decisionProcess, setDecisionProcess] = useState<DecisionProcess | undefined>(
    opportunity?.decisionProcess
  )

  if (isLoading || !opportunity) {
    return <div>加载中...</div>
  }

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{opportunity.name}</h1>
        <div className="flex gap-2">
          <Button onClick={() => setShowQuoteDialog(true)}>
            生成报价单
          </Button>
        </div>
      </div>

      {/* 商机基本信息 */}
      <Card>
        <CardHeader>
          <CardTitle>基本信息</CardTitle>
        </CardHeader>
        <CardContent>
          {/* ... 商机详情内容 */}
        </CardContent>
      </Card>

      {/* 决策流程 */}
      <Card>
        <CardHeader>
          <CardTitle>客户决策流程</CardTitle>
        </CardHeader>
        <CardContent>
          <DecisionProcessRecord
            opportunity={opportunity}
            decisionProcess={decisionProcess}
            onUpdate={(updated) => {
              setDecisionProcess(updated)
              // TODO: 保存到后端
            }}
          />
        </CardContent>
      </Card>

      {/* 关联的报价单 */}
      <Card>
        <CardHeader>
          <CardTitle>关联报价单</CardTitle>
        </CardHeader>
        <CardContent>
          {opportunity.quoteIds && opportunity.quoteIds.length > 0 ? (
            <div className="space-y-2">
              {opportunity.quoteIds.map((quoteId) => (
                <div key={quoteId} className="p-3 border rounded">
                  报价单：{quoteId}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">暂无关联报价单</p>
          )}
        </CardContent>
      </Card>

      {/* 报价单生成对话框 */}
      <QuoteGenerationDialog
        open={showQuoteDialog}
        onOpenChange={setShowQuoteDialog}
        opportunity={opportunity}
        onSuccess={(quote: Quote) => {
          // 更新商机的 quoteIds
          // TODO: 调用 API 更新商机
          setShowQuoteDialog(false)
        }}
      />
    </div>
  )
}
```

---

## API 集成建议

### 1. 报价单创建 API

```typescript
// src/services/quoteService.ts
import { QuoteRequest, Quote } from '@/types/cpq'

export async function createQuote(request: QuoteRequest): Promise<Quote> {
  const response = await fetch('/api/quotes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })
  
  if (!response.ok) {
    throw new Error('创建报价单失败')
  }
  
  return response.json()
}
```

### 2. 决策流程更新 API

```typescript
// src/services/opportunityService.ts
import { DecisionProcess } from '@/types/opportunity'

export async function updateDecisionProcess(
  opportunityId: string,
  process: DecisionProcess
): Promise<void> {
  await fetch(`/api/opportunities/${opportunityId}/decision-process`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(process),
  })
}
```

---

## 依赖组件

这两个组件依赖以下现有组件：

- `@/components/CPQ/ProductSelector` - 产品选择器
- `@/components/CPQ/QuoteCalculator` - 报价计算器
- `@/components/CPQ/QuotePreview` - 报价单预览
- `@/components/ui/*` - shadcn/ui 组件

确保这些组件已正确导入和配置。

---

## 注意事项

1. **报价单关联**: 生成的报价单会自动关联到商机的 `opportunityId` 字段
2. **决策流程模板**: 组件内置了默认的决策流程模板，可根据业务需求自定义
3. **状态同步**: 商机阶段变化时，可自动更新决策流程状态
4. **权限控制**: 建议根据用户权限控制 `readOnly` 属性
