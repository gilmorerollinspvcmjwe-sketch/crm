# 回款分析组件文档 📊

本目录包含四个回款分析相关的可视化组件，用于 CRM 系统的回款管理模块。

## 组件列表

### 1. PaymentStatistics - 统计卡片组件

**文件**: `PaymentStatistics.tsx`

展示四个关键回款指标：
- 计划总额
- 实际总额
- 完成率
- 逾期金额

**使用示例**:
```tsx
import PaymentStatistics from '@/components/PaymentStatistics';

const data = {
  plannedTotal: 12500000,    // 计划总额
  actualTotal: 9800000,      // 实际总额
  completionRate: 78.4,      // 完成率 (%)
  overdueAmount: 850000,     // 逾期金额
};

<PaymentStatistics 
  data={data} 
  onStatClick={(stat) => console.log('Clicked:', stat)}
/>
```

**特性**:
- ✅ 响应式网格布局 (1/2/4 列自适应)
- ✅ 彩色边框区分不同指标
- ✅ 图标和颜色编码
- ✅ 完成率智能文本提示
- ✅ 点击交互支持

---

### 2. PaymentTrendChart - 回款趋势图表

**文件**: `PaymentTrendChart.tsx`

展示月度回款趋势，支持计划 vs 实际对比。

**使用示例**:
```tsx
import PaymentTrendChart from '@/components/PaymentTrendChart';

const data = [
  { month: '2025-04', planned: 850000, actual: 820000, rate: 96.5 },
  { month: '2025-05', planned: 920000, actual: 895000, rate: 97.3 },
  // ...
];

<PaymentTrendChart
  data={data}
  timeRange="month"
  onTimeRangeChange={(range) => console.log('Range:', range)}
  showArea={false}
/>
```

**特性**:
- ✅ Recharts 图表库 (支持 Line/Area 切换)
- ✅ 时间范围选择器 (周/月/季/年)
- ✅ 自定义 Tooltip
- ✅ 数据表格展示
- ✅ 完成率进度条
- ✅ 差额计算和颜色编码

---

### 3. ReceivablesAging - 应收账款账龄分析

**文件**: `ReceivablesAging.tsx`

分析不同账龄区间的应收款项分布。

**使用示例**:
```tsx
import ReceivablesAging from '@/components/ReceivablesAging';

const data = [
  { range: '0-30 天', amount: 1850000, percentage: 68.5, risk: 'low', count: 45 },
  { range: '31-60 天', amount: 485000, percentage: 18.0, risk: 'medium', count: 12 },
  { range: '61-90 天', amount: 215000, percentage: 8.0, risk: 'high', count: 5 },
  { range: '91-180 天', amount: 100000, percentage: 3.7, risk: 'critical', count: 2 },
  { range: '180+ 天', amount: 50000, percentage: 1.8, risk: 'critical', count: 1 },
];

<ReceivablesAging
  data={data}
  showChart="both"  // 'bar' | 'pie' | 'both'
  showTable={true}
/>
```

**特性**:
- ✅ 风险等级标识 (低/中/高/严重)
- ✅ 柱状图和饼图双视图
- ✅ 交互式图例筛选
- ✅ 风险汇总卡片
- ✅ 详细数据表格
- ✅ 支持单据数量显示

---

### 4. PaymentAnalysis - 多维度统计分析

**文件**: `PaymentAnalysis.tsx`

按状态和支付方式多维度统计展示。

**使用示例**:
```tsx
import PaymentAnalysis from '@/components/PaymentAnalysis';

const statusData = [
  { status: 'paid', count: 156, amount: 9800000, color: '#52c41a' },
  { status: 'unpaid', count: 48, amount: 1850000, color: '#1890ff' },
  // ...
];

const methodData = [
  { method: 'bank_transfer', count: 145, amount: 7500000, color: '#1890ff' },
  { method: 'check', count: 35, amount: 2000000, color: '#52c41a' },
  // ...
];

<PaymentAnalysis
  statusData={statusData}
  methodData={methodData}
  defaultTab="status"
/>
```

**特性**:
- ✅ Tabs 切换 (按状态/按支付方式)
- ✅ 饼图 (状态) + 柱状图 (支付方式)
- ✅ 自定义颜色支持
- ✅ 数据表格和汇总卡片
- ✅ 占比进度条可视化

---

## Mock 数据

**文件**: `src/mock/paymentData.ts`

提供所有组件的示例数据：

```ts
import {
  paymentStatisticsData,
  paymentTrendData,
  receivablesAgingData,
  paymentStatusData,
  paymentMethodData,
  getTrendDataByRange,
} from '@/mock/paymentData';
```

---

## 示例页面

**文件**: `src/pages/PaymentAnalytics.tsx`

完整的使用示例，展示如何组合使用所有组件。

---

## 技术栈

- **图表库**: Recharts
- **UI 组件**: shadcn/ui (Card, Tabs, Select, Badge, Progress 等)
- **样式**: Tailwind CSS
- **图标**: lucide-react

---

## 依赖项

确保项目已安装以下依赖：

```bash
pnpm install recharts lucide-react
```

shadcn/ui 组件应已通过以下命令安装：

```bash
pnpm dlx shadcn-ui@latest add card tabs select badge progress
```

---

## 颜色规范

### 状态颜色
- 已回款 (paid): `#52c41a` 🟢
- 未回款 (unpaid): `#1890ff` 🔵
- 逾期 (overdue): `#f5222d` 🔴
- 部分回款 (partial): `#faad14` 🟠

### 风险等级颜色
- 低风险 (low): `#52c41a` 🟢
- 中风险 (medium): `#faad14` 🟡
- 高风险 (high): `#f5222d` 🔴
- 严重风险 (critical): `#722ed1` 🟣

---

## 响应式设计

所有组件均支持响应式布局：

- **移动端**: 单列布局
- **平板**: 2 列布局
- **桌面**: 4 列布局 (统计卡片)

---

## 数据格式说明

### PaymentStatisticsData
```ts
interface PaymentStatisticsData {
  plannedTotal: number;      // 计划总额 (元)
  actualTotal: number;       // 实际总额 (元)
  completionRate: number;    // 完成率 (%)
  overdueAmount: number;     // 逾期金额 (元)
}
```

### PaymentTrendData
```ts
interface PaymentTrendData {
  month: string;             // 月份 (YYYY-MM 或 MM)
  planned: number;           // 计划回款 (元)
  actual: number;            // 实际回款 (元)
  rate?: number;             // 完成率 (%)
}
```

### AgingRangeData
```ts
interface AgingRangeData {
  range: string;             // 账龄区间
  amount: number;            // 金额 (元)
  percentage: number;        // 占比 (%)
  risk?: 'low' | 'medium' | 'high' | 'critical';
  count?: number;            // 单据数量
}
```

### PaymentStatusData
```ts
interface PaymentStatusData {
  status: string;            // 状态
  count: number;             // 数量
  amount: number;            // 金额 (元)
  percentage?: number;       // 占比 (%)
  color?: string;            // 颜色
}
```

### PaymentMethodData
```ts
interface PaymentMethodData {
  method: string;            // 支付方式
  count: number;             // 数量
  amount: number;            // 金额 (元)
  percentage?: number;       // 占比 (%)
  color?: string;            // 颜色
}
```

---

## API 集成建议

在实际项目中，可以将 Mock 数据替换为 API 调用：

```tsx
import { useEffect, useState } from 'react';
import PaymentStatistics from '@/components/PaymentStatistics';
import { paymentService } from '@/services/payment';

const PaymentDashboard = () => {
  const [stats, setStats] = useState<PaymentStatisticsData | null>(null);

  useEffect(() => {
    paymentService.getStatistics().then(setStats);
  }, []);

  if (!stats) return <div>Loading...</div>;

  return <PaymentStatistics data={stats} />;
};
```

---

## 更新日志

- **2026-04-10**: 初始版本，包含四个核心组件
  - PaymentStatistics
  - PaymentTrendChart
  - ReceivablesAging
  - PaymentAnalysis

---

## 注意事项

1. **金额单位**: 所有金额数据以"元"为单位，组件内部会自动转换为"万元"显示
2. **百分比**: 完成率等百分比数据直接传入数值 (如 78.4 表示 78.4%)
3. **颜色自定义**: 所有组件都支持通过 `color` 属性自定义颜色
4. **空数据处理**: 组件会自动处理空数据情况，显示友好的提示信息

---

如有问题或需要改进，请联系开发团队。
