# 代码对比报告 - AI 模块与报表模块

**分析时间**: 2026-04-09  
**项目 A（当前）**: `C:\Users\13609\Projects\crm-ui-upgrade`  
**项目 B（原始参考）**: `C:\Users\13609\.openclaw\workspace\crm2026-4-3new`

---

## 📊 概述

| 对比项 | 项目 A | 项目 B |
|--------|--------|--------|
| **AI 组件数量** | 2 个 | 6 个 |
| **AI 页面数量** | 15 个 | 9 个 |
| **报表页面数量** | 13 个 | 6 个 |
| **UI 框架** | shadcn/ui + Tailwind + Recharts | Ant Design + 自定义图表 |
| **状态管理** | TanStack Query (React Query) | React Hooks + Ant Design |

---

## 🤖 AI 模块对比

### 1. AI 组件对比

#### 项目 A AI 组件 (`src/components/AI/`)

| 组件名 | 功能 | 状态 |
|--------|------|------|
| `CustomerSummaryAI.tsx` | AI 客户洞察（打字机效果） | ✅ 已实现 |
| `RiskAlertAI.tsx` | AI 风险预警 | ✅ 已实现 |
| `index.ts` | 组件导出 | ✅ 仅导出 2 个组件 |

#### 项目 B AI 组件 (`src/components/AI/`)

| 组件名 | 功能 | 状态 |
|--------|------|------|
| `CustomerSummaryAI.tsx` | AI 客户洞察（打字机效果） | ✅ 已实现 |
| `RiskAlertAI.tsx` | AI 风险预警 | ✅ 已实现 |
| `ContentGeneratorAI.tsx` | AI 内容生成（邮件/会议请求等） | ❌ **项目 A 缺失** |
| `InteractionAnalysisAI.tsx` | AI 交互分析（情感分析/渠道统计） | ❌ **项目 A 缺失** |
| `RelationshipChangeAI.tsx` | AI 关系变化检测（健康度评分） | ❌ **项目 A 缺失** |
| `SmartSuggestionsAI.tsx` | AI 智能建议（优先级排序） | ❌ **项目 A 缺失** |
| `index.ts` | 组件导出 | ✅ 导出 6 个组件 |

#### 功能对比表

| 功能 | 项目 A | 项目 B | 差异说明 |
|------|--------|--------|----------|
| 客户摘要生成 | ✅ | ✅ | 功能相同，UI 框架不同 |
| 风险预警 | ✅ | ✅ | 功能相同，项目 A 增加 Badge 显示 |
| 内容生成（邮件/提案） | ❌ | ✅ | **项目 A 缺失** |
| 交互分析（情感/渠道） | ❌ | ✅ | **项目 A 缺失** |
| 关系健康度监测 | ❌ | ✅ | **项目 A 缺失** |
| 智能建议（P0/P1/P2） | ❌ | ✅ | **项目 A 缺失** |

---

### 2. AI API/服务对比

#### 项目 A (`src/hooks/api/useAI.ts` + `src/schemas/aiSchema.ts`)

| 功能模块 | API Hooks | Schema 验证 | Mock 数据 |
|----------|-----------|-------------|-----------|
| AI 配置管理 | `useAIConfig`, `useUpdateAIConfig` | ✅ `aiConfigSchema` | ✅ |
| 提示词模板 | `useAITemplates`, `useCreateAITemplate` 等 | ✅ `aiPromptTemplateSchema` | ✅ |
| AI 历史记录 | `useAIHistory`, `useClearAIHistory` | - | ✅ |
| 使用统计 | `useAIUsageStats` | - | ✅ |

**特点**:
- 使用 Zod 进行表单验证
- 完整的 TanStack Query 集成
- 支持配置管理、模板管理、历史记录

#### 项目 B (`src/hooks/api/useAI.ts` + `src/types/ai.ts`)

| 功能模块 | API Hooks | 类型定义 | Mock 数据 |
|----------|-----------|----------|-----------|
| 智能线索分配 | `useLeadAssignment`, `useAssignLead`, `useBatchAssign` | ✅ `LeadAssignmentData` | ✅ |
| 线索评分 | `useLeadScoring`, `useUpdateScoreWeight` | ✅ `LeadScoringData` | ✅ |
| 销售预测 | `useSalesForecast`, `useUpdateForecastPeriod` | ✅ `SalesForecastData` | ✅ |
| 客户分群 | `useCustomerSegments`, `useApplySegment` | ✅ `CustomerSegmentationData` | ✅ |
| 客户流失预警 | - | ✅ `ChurnWarning` | ✅ |
| 会议助手 | - | ✅ `MeetingRecord` | ✅ |

**特点**:
- 专注于 AI 业务功能（线索分配、评分、预测、分群）
- 类型定义更详细（包含 matchFactors 等）
- Mock 数据更丰富

#### API 差异总结

| API 功能 | 项目 A | 项目 B |
|----------|--------|--------|
| AI 配置管理 | ✅ | ❌ |
| 提示词模板 | ✅ | ❌ |
| AI 历史记录 | ✅ | ❌ |
| 智能线索分配 | ❌ | ✅ |
| 线索评分 | ❌ | ✅ |
| 销售预测 | ❌ | ✅ |
| 客户分群 | ❌ | ✅ |
| 流失预警类型 | ❌ | ✅ |
| 会议记录类型 | ❌ | ✅ |

---

### 3. AI 页面对比

#### 项目 A AI 页面 (`src/pages/ai/`)

| 页面 | 功能 | 状态 |
|------|------|------|
| `AIDashboard.tsx` | AI 功能总览仪表盘 | ✅ |
| `AIAgents.tsx` | AI 代理管理 | ✅ |
| `AgentDetail.tsx` | AI 代理详情 | ✅ |
| `AIAnalytics.tsx` | AI 分析统计 | ✅ |
| `AIAssistant.tsx` | AI 助手 | ✅ |
| `AIConfig.tsx` | AI 配置设置 | ✅ |
| `AIHistory.tsx` | AI 历史记录 | ✅ |
| `AIModels.tsx` | AI 模型管理 | ✅ |
| `AIPromptTemplates.tsx` | 提示词模板管理 | ✅ |
| `AIUsage.tsx` | AI 使用统计 | ✅ |
| `ChurnWarning.tsx` | 客户流失预警 | ✅ |
| `CustomerSegmentation.tsx` | 客户分群 | ✅ |
| `LeadAssignment.tsx` | 智能线索分配 | ✅ |
| `LeadScoring.tsx` | 线索评分 | ✅ |
| `MeetingAssistant.tsx` | 会议助手 | ✅ |
| `PredictiveAI.tsx` | 预测 AI | ✅ |
| `SalesForecast.tsx` | 销售预测 | ✅ |

#### 项目 B AI 页面 (`src/pages/ai/`)

| 页面 | 功能 | 状态 |
|------|------|------|
| `AIAgents.tsx` | AI 代理管理 | ✅ |
| `AgentDetail.tsx` | AI 代理详情 | ✅ |
| `ChurnWarning.tsx` | 客户流失预警 | ✅ |
| `CustomerSegmentation.tsx` | 客户分群 | ✅ |
| `LeadAssignment.tsx` | 智能线索分配 | ✅ |
| `LeadScoring.tsx` | 线索评分 | ✅ |
| `MeetingAssistant.tsx` | 会议助手 | ✅ |
| `PredictiveAI.tsx` | 预测 AI | ✅ |
| `SalesForecast.tsx` | 销售预测 | ✅ |

#### 页面差异

**项目 A 独有页面**（项目 B 缺失）:
- `AIDashboard.tsx` - AI 仪表盘
- `AIAnalytics.tsx` - AI 分析
- `AIAssistant.tsx` - AI 助手
- `AIConfig.tsx` - AI 配置
- `AIHistory.tsx` - AI 历史
- `AIModels.tsx` - AI 模型管理
- `AIPromptTemplates.tsx` - 提示词模板

---

### 4. UI 组件对比（CustomerSummaryAI）

#### 项目 A (shadcn/ui)
```tsx
// 使用 shadcn/ui 组件
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw, Lightbulb, AlertTriangle, Trophy, Zap } from 'lucide-react';
```

#### 项目 B (Ant Design)
```tsx
// 使用 Ant Design 组件
import { Card, Button, Space, Spin, Typography, Divider, Tag, Skeleton } from 'antd';
import { ReloadOutlined, BulbOutlined, WarningOutlined, TrophyOutlined } from '@ant-design/icons';
```

**差异**:
- 项目 A 使用 shadcn/ui + Tailwind CSS + lucide-react 图标
- 项目 B 使用 Ant Design + @ant-design/icons
- 功能相同，UI 风格和实现方式不同

---

## 📈 报表模块对比

### 1. 报表页面对比

#### 项目 A 报表页面 (`src/pages/reports/`)

| 页面 | 功能 | 状态 |
|------|------|------|
| `ReportDashboard.tsx` | 报表仪表盘总览 | ✅ |
| `ReportList.tsx` | 报表列表 | ✅ |
| `ReportDetail.tsx` | 报表详情 | ✅ |
| `ReportBuilder.tsx` | 报表构建器（可视化创建） | ✅ |
| `ReportSchedule.tsx` | 定时报表管理 | ✅ |
| `ReportExport.tsx` | 导出记录管理 | ✅ |
| `SalesFunnelReport.tsx` | 销售漏斗报表 | ✅ |
| `PerformanceReport.tsx` | 业绩统计报表 | ✅ |
| `CustomerReport.tsx` | 客户分析报表 | ✅ |
| `ActivityReport.tsx` | 活动统计报表 | ✅ |
| `LeadConversionReport.tsx` | 线索转化报表 | ✅ |
| `PaymentReport.tsx` | 回款报表 | ✅ |
| `index.ts` | 页面导出 | ✅ |

#### 项目 B 报表页面 (`src/pages/`)

| 页面 | 功能 | 状态 |
|------|------|------|
| `ActivityReport.tsx` | 活动统计报表 | ✅ |
| `CustomerReport.tsx` | 客户分析报表 | ✅ |
| `LeadConversionReport.tsx` | 线索转化报表 | ✅ |
| `PaymentReport.tsx` | 回款报表 | ✅ |
| `PerformanceReport.tsx` | 业绩统计报表 | ✅ |
| `SalesFunnelReport.tsx` | 销售漏斗报表 | ✅ |

#### 报表页面差异

**项目 A 独有页面**（项目 B 缺失）:
- `ReportDashboard.tsx` - 报表仪表盘
- `ReportList.tsx` - 报表列表管理
- `ReportDetail.tsx` - 报表详情查看
- `ReportBuilder.tsx` - 可视化报表构建器
- `ReportSchedule.tsx` - 定时任务管理
- `ReportExport.tsx` - 导出记录管理

---

### 2. 报表类型对比

| 报表类型 | 项目 A | 项目 B | 差异说明 |
|----------|--------|--------|----------|
| 销售漏斗报表 | ✅ | ✅ | 项目 A 使用 Recharts 漏斗图，项目 B 使用自定义图表 |
| 业绩统计报表 | ✅ | ✅ | 功能相同 |
| 客户分析报表 | ✅ | ✅ | 功能相同 |
| 活动统计报表 | ✅ | ✅ | 功能相同 |
| 线索转化报表 | ✅ | ✅ | 功能相同 |
| 回款报表 | ✅ | ✅ | 功能相同 |
| **报表仪表盘** | ✅ | ❌ | **项目 B 缺失** |
| **报表构建器** | ✅ | ❌ | **项目 B 缺失** |
| **定时管理** | ✅ | ❌ | **项目 B 缺失** |
| **导出管理** | ✅ | ❌ | **项目 B 缺失** |

---

### 3. 报表 API/Types 对比

#### 项目 A (`src/types/report.ts` + `src/hooks/api/useReports.ts`)

**类型定义**:
```typescript
export type ReportCategory = 'sales' | 'customer' | 'activity' | 'product' | 'finance'
export type ReportType = 'summary' | 'detail' | 'trend' | 'comparison'
export type ReportPeriod = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom'

export interface Report {
  id: string
  name: string
  description?: string
  category: ReportCategory
  type: ReportType
  period: ReportPeriod
  // ... 更多字段
}
```

**API Hooks**:
- `useReports()` - 获取报表列表
- `useReport(id)` - 获取报表详情
- `useReportData(id)` - 获取报表数据
- `useCreateReport()` - 创建报表
- `useDeleteReport()` - 删除报表

**Mock 数据**: 20 条报表定义 + 5 条报表数据 + 4 个报表模板

#### 项目 B (`src/types/report.ts` + `src/mock/reportData.ts`)

**类型定义**:
```typescript
export interface SalesFunnelReport {
  timeRange: TimeRange;
  funnelData: { stage: string; opportunityCount: number; ... }[];
  conversionRates: { fromStage: string; toStage: string; rate: number }[];
}

export interface PerformanceReport {
  personalPerformance: PersonalPerformance[];
  teamPerformance: TeamPerformance[];
  monthlyTrend: MonthlyTrend[];
}

export interface CustomerReport {
  growthData: CustomerGrowth[];
  industryDist: { industry: string; count: number; percentage: number }[];
  levelDist: CustomerLevelDist[];
}
```

**差异**:
- 项目 A 有完整的报表管理系统（CRUD + 构建器 + 定时）
- 项目 B 仅有报表数据展示，无管理功能
- 项目 A 使用 TanStack Query，项目 B 使用直接导入 Mock 数据

---

### 4. 图表组件对比

| 图表类型 | 项目 A | 项目 B |
|----------|--------|--------|
| 折线图 | Recharts `LineChart` | 自定义 `LineChart` 组件 |
| 柱状图 | Recharts `BarChart` | 自定义 `BarChart` 组件 |
| 饼图 | Recharts `PieChart` | 自定义 `PieChart` 组件 |
| 面积图 | Recharts `AreaChart` | - |
| 漏斗图 | Recharts `FunnelChart` | - |
| 仪表盘 | - | Ant Design `Progress` (type="dashboard") |

**差异**:
- 项目 A 使用 Recharts，功能更丰富，支持漏斗图等高级图表
- 项目 B 使用自定义图表组件（基于 Recharts 封装）
- 项目 A 图表配置更灵活（支持动态配置）

---

## 🔍 缺失功能清单（项目 A 缺少但项目 B 有）

### AI 模块缺失

| 缺失功能 | 文件位置 | 优先级 | 说明 |
|----------|----------|--------|------|
| AI 内容生成组件 | `src/components/AI/ContentGeneratorAI.tsx` | 🔴 高 | 支持邮件/会议请求/感谢信/提案生成 |
| AI 交互分析组件 | `src/components/AI/InteractionAnalysisAI.tsx` | 🟡 中 | 情感分析、渠道统计、沟通频率分析 |
| AI 关系变化检测 | `src/components/AI/RelationshipChangeAI.tsx` | 🟡 中 | 关系健康度评分、变化指标、预警时间线 |
| AI 智能建议 | `src/components/AI/SmartSuggestionsAI.tsx` | 🟡 中 | 优先级排序 (P0/P1/P2) 的智能建议 |
| 线索评分详细类型 | `src/types/ai.ts` 中的 `LeadScoreDetail` | 🟡 中 | 包含属性分、行为分详细维度 |
| 会议记录类型 | `src/types/ai.ts` 中的 `MeetingRecord` | 🟡 中 | 会议纪要、转写、行动项 |

### 报表模块缺失

| 缺失功能 | 文件位置 | 优先级 | 说明 |
|----------|----------|--------|------|
| 报表模板系统 | `src/mock/reportData.ts` 中的 `ReportTemplate` | 🟡 中 | 预设报表模板（驾驶舱、仪表盘等） |
| 报表辅助函数 | `src/mock/reportData.ts` 中的导出函数 | 🟢 低 | `getReportList`, `getReportByFilter` 等 |

---

## ✨ 新增功能清单（项目 A 有但项目 B 无）

### AI 模块新增

| 新增功能 | 文件位置 | 价值 | 说明 |
|----------|----------|------|------|
| AI 配置管理 | `src/hooks/api/useAI.ts` | 🔴 高 | 支持 AI 模型、API Key、限额配置 |
| 提示词模板管理 | `src/hooks/api/useAI.ts` + `src/schemas/aiSchema.ts` | 🔴 高 | 可创建/编辑/删除 AI 提示词模板 |
| AI 历史记录 | `src/hooks/api/useAI.ts` | 🟡 中 | 查看和清除 AI 使用历史 |
| AI 使用统计 | `src/hooks/api/useAI.ts` | 🟡 中 | Token 使用量、请求统计 |
| AI 仪表盘页面 | `src/pages/ai/AIDashboard.tsx` | 🟡 中 | AI 功能总览 |
| AI 模型管理 | `src/pages/ai/AIModels.tsx` | 🟡 中 | 管理可用 AI 模型 |
| Zod Schema 验证 | `src/schemas/aiSchema.ts` | 🟡 中 | 表单验证更严格 |

### 报表模块新增

| 新增功能 | 文件位置 | 价值 | 说明 |
|----------|----------|------|------|
| 报表仪表盘 | `src/pages/reports/ReportDashboard.tsx` | 🔴 高 | 报表系统总览、统计卡片、趋势图 |
| 报表构建器 | `src/pages/reports/ReportBuilder.tsx` | 🔴 高 | 可视化创建报表（4 步向导） |
| 报表列表管理 | `src/pages/reports/ReportList.tsx` | 🟡 中 | 报表列表、搜索、筛选、分页 |
| 报表详情 | `src/pages/reports/ReportDetail.tsx` | 🟡 中 | 单个报表详细视图 |
| 定时管理 | `src/pages/reports/ReportSchedule.tsx` | 🟡 中 | 定时任务配置和管理 |
| 导出管理 | `src/pages/reports/ReportExport.tsx` | 🟡 中 | 导出历史记录 |
| TanStack Query 集成 | `src/hooks/api/useReports.ts` | 🟡 中 | 更好的数据缓存和状态管理 |
| 20 条 Mock 报表 | `src/mock/reportData.ts` | 🟢 低 | 更丰富的示例数据 |
| 报表模板系统 | `src/mock/reportData.ts` | 🟡 中 | 4 个预设模板（驾驶舱、仪表盘等） |

---

## 💡 同步建议

### 高优先级（建议立即同步）

1. **从项目 B 同步到项目 A**:
   - [ ] `src/components/AI/ContentGeneratorAI.tsx` - AI 内容生成组件
   - [ ] `src/components/AI/InteractionAnalysisAI.tsx` - AI 交互分析组件
   - [ ] `src/components/AI/RelationshipChangeAI.tsx` - AI 关系变化检测组件
   - [ ] `src/components/AI/SmartSuggestionsAI.tsx` - AI 智能建议组件
   - [ ] `src/types/ai.ts` 中的详细类型定义（`LeadScoreDetail`, `MeetingRecord`, `ChurnWarning`）

2. **项目 A 保持**（项目 B 应学习）:
   - ✅ AI 配置管理系统
   - ✅ 提示词模板管理
   - ✅ AI 历史记录
   - ✅ 报表仪表盘
   - ✅ 报表构建器
   - ✅ 定时任务管理

### 中优先级（建议逐步同步）

1. **类型定义统一**:
   - 合并项目 A 和项目 B 的 `types/ai.ts`，保留双方优势
   - 项目 B 的类型更详细（matchFactors 等），项目 A 的结构更清晰

2. **Mock 数据同步**:
   - 项目 A 的 20 条报表 Mock 数据更丰富
   - 项目 B 的报表模板系统有价值
   - 建议合并双方 Mock 数据

3. **UI 组件适配**:
   - 项目 B 的 AI 组件需要从 Ant Design 迁移到 shadcn/ui
   - 注意保持功能一致，UI 风格统一

### 低优先级（可选优化）

1. **代码风格统一**:
   - 项目 A 使用 TypeScript 更严格
   - 项目 A 使用 ESLint 规则更完善

2. **文档完善**:
   - 为新增组件添加 JSDoc 注释
   - 更新 README 说明 AI 和报表功能

---

## 📋 总结

### 项目 A 优势
- ✅ 更完整的报表管理系统（构建器、定时、导出）
- ✅ AI 配置和模板管理功能
- ✅ 更现代化的 UI 框架（shadcn/ui + Tailwind）
- ✅ 更好的状态管理（TanStack Query）
- ✅ 更严格的类型验证（Zod Schema）

### 项目 B 优势
- ✅ 更丰富的 AI 业务组件（内容生成、交互分析、关系检测、智能建议）
- ✅ 更详细的 AI 类型定义
- ✅ 更聚焦业务场景（线索分配、评分、预测、分群）

### 建议行动
1. **立即**: 从项目 B 同步 4 个 AI 组件到项目 A
2. **本周**: 合并双方类型定义和 Mock 数据
3. **本月**: 完成 UI 适配和测试
4. **持续**: 保持双方功能同步，避免再次分化

---

**报告生成时间**: 2026-04-09 17:00 GMT+8  
**分析工具**: OpenClaw 代码对比分析  
**总文件对比数**: 45+ 个文件
