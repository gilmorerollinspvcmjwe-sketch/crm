# Phase 5 + AI 功能 Bug 清单

## Bug 汇总

| 编号 | 模块 | 页面 | 严重程度 | 状态 |
|------|------|------|----------|------|
| BUG-001 | CPQ | 新建报价单 | 🔴 高 | 待修复 |
| BUG-002 | 营销 | 营销活动列表 | 🔴 高 | 待修复 |
| BUG-003 | 营销 | 活动详情 | 🟡 中 | 阻塞（依赖 BUG-002） |
| BUG-004 | AI | 智能线索分配 | 🔴 高 | 待修复 |
| BUG-005 | AI | 线索评分 AI | 🔴 高 | 待修复 |
| BUG-006 | AI | 销售预测 AI | 🔴 高 | 待修复 |
| BUG-007 | AI | 客户分群 AI | 🔴 高 | 待修复 |
| BUG-008 | AI | 客户流失预警 | 🔴 高 | 待修复 |
| BUG-009 | AI | 会议助手 | 🔴 高 | 待修复 |

---

## Bug 详情

### BUG-001: 新建报价单页面崩溃

**模块**: CPQ 报价管理  
**页面**: `/quote/new`  
**严重程度**: 🔴 高  
**状态**: 待修复

**描述**:  
访问新建报价单页面时，应用崩溃，显示 "date4.isValid is not a function" 错误。

**复现步骤**:
1. 启动应用 `npm run dev:all`
2. 访问 http://localhost:3000/quote/new
3. 页面立即崩溃

**错误信息**:
```
TypeError: date4.isValid is not a function
at Object.isValidate (antd.js:35455:18)
at Object.current (antd.js:36103:24)
```

**原因分析**:  
dayjs 版本兼容性问题。Ant Design 的日期组件期望使用 dayjs 对象，但传入的可能是原生 Date 对象或其他格式。

**建议修复**:
1. 检查 `QuoteNew.tsx` 中的日期字段初始化
2. 确保所有日期字段使用 `dayjs()` 包装
3. 检查表单 initialValues 中的日期格式
4. 考虑升级或降级 dayjs 版本以匹配 Ant Design 要求

**影响**:  
用户无法创建新的报价单，影响 CPQ 核心功能。

---

### BUG-002: 营销活动列表页崩溃

**模块**: 营销自动化  
**页面**: `/marketing/campaigns`  
**严重程度**: 🔴 高  
**状态**: 待修复

**描述**:  
访问营销活动列表页时，应用崩溃，显示 "Cannot read properties of undefined (reading 'sent')" 错误。

**复现步骤**:
1. 启动应用 `npm run dev:all`
2. 访问 http://localhost:3000/marketing/campaigns
3. 页面立即崩溃

**错误信息**:
```
TypeError: Cannot read properties of undefined (reading 'sent')
at CampaignsList.tsx:280:75
at Array.reduce (<anonymous>)
at CampaignsList
```

**原因分析**:  
在计算营销活动统计数据时，尝试访问未定义的对象的 `sent` 属性。可能是 Mock 数据结构不匹配或数据为空。

**建议修复**:
1. 检查 `CampaignsList.tsx` 第 280 行附近的数据处理逻辑
2. 添加空值检查：`campaign?.stats?.sent || 0`
3. 验证 `campaignsData.ts` 中的 Mock 数据结构
4. 确保所有活动对象都有完整的 stats 属性

**影响**:  
用户无法查看营销活动列表，影响整个营销自动化模块。

---

### BUG-003: 活动详情页无法测试

**模块**: 营销自动化  
**页面**: `/marketing/campaign/:id`  
**严重程度**: 🟡 中  
**状态**: 阻塞（依赖 BUG-002）

**描述**:  
由于营销活动列表页无法使用，无法通过列表点击进入详情页，因此无法单独测试活动详情页。

**复现步骤**:
1. 需要先修复 BUG-002
2. 在列表页点击某个活动
3. 进入详情页

**建议修复**:
1. 优先修复 BUG-002
2. 直接访问 URL 测试：http://localhost:3000/marketing/campaign/CAMPAIGN001
3. 检查 `CampaignDetail.tsx` 的数据加载逻辑

**影响**:  
营销活动详情页功能无法验证。

---

### BUG-004 ~ BUG-009: Phase 4 AI 功能页面崩溃（共性问题）

**模块**: AI 功能（Phase 4）  
**页面**: 6 个页面  
**严重程度**: 🔴 高  
**状态**: 待修复

**受影响页面**:
| Bug 编号 | 页面 | 路由 | 缺失数据 |
|----------|------|------|----------|
| BUG-004 | 智能线索分配 | `/ai/lead-assignment` | leadsToAssign, salesTeam |
| BUG-005 | 线索评分 AI | `/ai/lead-scoring` | scoredLeads |
| BUG-006 | 销售预测 AI | `/ai/sales-forecast` | salesForecast |
| BUG-007 | 客户分群 AI | `/ai/customer-segmentation` | customerSegments, segmentedCustomers, customerScatterData |
| BUG-008 | 客户流失预警 | `/ai/churn-warning` | churnWarnings |
| BUG-009 | 会议助手 | `/ai/meeting-assistant` | meetingRecords |

**描述**:  
所有 Phase 4 AI 功能页面均因缺少 `mock/aiData.ts` 文件而无法加载。

**复现步骤**:
1. 启动应用 `npm run dev:all`
2. 访问任意 Phase 4 AI 页面（如 http://localhost:3000/ai/lead-assignment）
3. 页面显示 Vite 错误：无法解析导入

**错误信息**:
```
[plugin:vite:import-analysis] Failed to resolve import "../../mock/aiData" 
from "src/pages/LeadAssignment.tsx". Does the file exist?
```

**原因分析**:  
Phase 4 AI 功能页面引用了 `src/mock/aiData.ts` 文件，但该文件不存在。可能是开发过程中遗漏创建，或者文件被误删除。

**建议修复**:
1. 创建 `src/mock/aiData.ts` 文件
2. 导出以下 Mock 数据：
   - `leadsToAssign` - 待分配线索列表
   - `salesTeam` - 销售团队数据
   - `scoredLeads` - 已评分线索列表
   - `salesForecast` - 销售预测数据
   - `customerSegments` - 客户分群数据
   - `segmentedCustomers` - 分群客户列表
   - `customerScatterData` - 客户散点图数据
   - `churnWarnings` - 流失预警列表
   - `meetingRecords` - 会议记录列表

3. 参考现有 Mock 数据格式（如 `cpqData.ts`, `aiAgentsData.ts`）

**示例结构**:
```typescript
// src/mock/aiData.ts

export const leadsToAssign = [
  {
    id: 'LEAD001',
    name: '潜在客户 A',
    source: '官网',
    score: 85,
    // ...
  },
  // ...
];

export const salesTeam = [
  {
    id: 'USER001',
    name: '张三',
    role: '销售代表',
    // ...
  },
  // ...
];

// ... 其他数据
```

**影响**:  
Phase 4 所有 AI 功能无法使用，影响产品完整性。

---

## 修复优先级

### P0 - 立即修复（阻塞上线）
- BUG-001: 新建报价单页面崩溃
- BUG-002: 营销活动列表页崩溃
- BUG-004 ~ BUG-009: Phase 4 AI 功能缺失 Mock 数据

### P1 - 高优先级
- BUG-003: 活动详情页（依赖 BUG-002 修复）

### P2 - 中优先级
- 无

### P3 - 低优先级
- 无

---

## 修复建议

### 短期（1-2 天）
1. 创建 `src/mock/aiData.ts` 文件，修复 BUG-004 ~ BUG-009
2. 修复 `QuoteNew.tsx` 中的 dayjs 兼容性问题（BUG-001）
3. 修复 `CampaignsList.tsx` 中的空值检查（BUG-002）

### 中期（3-5 天）
1. 补充 Phase 4 AI 页面的单元测试
2. 添加错误边界处理
3. 完善 Mock 数据覆盖场景

### 长期
1. 建立 Mock 数据管理规范
2. 添加数据校验层
3. 完善错误处理和用户提示

---

## 测试验证

修复后需要重新测试以下页面：

### CPQ 模块
- [ ] `/quote/new` - 新建报价单

### 营销自动化模块
- [ ] `/marketing/campaigns` - 营销活动列表
- [ ] `/marketing/campaign/CAMPAIGN001` - 活动详情

### AI 功能模块（Phase 4）
- [ ] `/ai/lead-assignment` - 智能线索分配
- [ ] `/ai/lead-scoring` - 线索评分 AI
- [ ] `/ai/sales-forecast` - 销售预测 AI
- [ ] `/ai/customer-segmentation` - 客户分群 AI
- [ ] `/ai/churn-warning` - 客户流失预警
- [ ] `/ai/meeting-assistant` - 会议助手

---

*清单更新时间：2026-03-13 12:30*
