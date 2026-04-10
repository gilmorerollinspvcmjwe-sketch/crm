# CRM UI 升级项目 - 迁移计划 V6（全模块补全）

> 基于 4 个 PM 子 Agent 深度对比分析报告制定
> 项目路径：C:\Users\13609\Projects\crm-ui-upgrade
> 原项目路径：C:\Users\13609\.openclaw\workspace\crm2026-4-3new
> 制定时间：2026-04-10
> 版本：V6（全模块功能补全）

---

## 一、整体评估

### 1.1 各模块完成度

| 模块 | 完成度 | 状态 | 优先级 |
|------|-------|------|--------|
| 客户/联系人/线索 | 75% | 🟡 需补全 | P0 |
| 商机 | 70% | 🟡 需补全 | P0 |
| 合同 | 65% | 🟡 需补全 | P0 |
| 订单 | 60% | 🟡 需补全 | P1 |
| **回款** | **40%** | 🔴 **严重缺失** | **P0** |
| 营销 | 85% | 🟢 完整 | P2 |
| 自动化/工作流 | 90% | 🟢 完整 | P2 |
| 报表 | 85% | 🟢 完整 | P2 |
| AI | 90% | 🟢 完整 | P2 |
| 系统设置 | 95% | 🟢 完整 | P2 |
| 产品/价格表 | 50% | 🟡 需重构 | P1 |

### 1.2 核心风险

| 风险项 | 等级 | 说明 |
|-------|------|------|
| 财务数据缺失（回款/核销） | 🔴 高 | 影响财务对账，无法上线 |
| 业务流程断裂（商机→报价→合同） | 🔴 高 | 核心销售流程不完整 |
| 合同审批缺失 | 🔴 高 | 合规风险 |
| 产品/价格表目录混乱 | 🟡 中 | 影响扩展性 |

---

## 二、P0 功能补全计划（必须完成）

### 2.1 回款模块补全（优先级：最高）

**问题**: 新项目只有回款计划，缺失回款记录实体、核销流程、发票管理

#### 2.1.1 需要实现的功能

| 功能 | 说明 | 工作量 |
|------|------|--------|
| 回款记录实体 | 独立 PaymentRecord 实体，记录实际回款流水 | 2 天 |
| 回款记录列表/详情 | 列表页 + 详情页，支持筛选 | 1 天 |
| 核销流程 | 回款记录与回款计划核销/驳回 | 2 天 |
| 逾期计算 | 自动计算逾期天数，逾期标识 | 1 天 |
| 发票管理 | 发票信息（专票/普票）、开票状态 | 1 天 |
| 回款统计卡片 | 计划总额/实际总额/完成率/逾期金额 | 0.5 天 |
| 回款趋势图表 | 回款趋势可视化 | 1 天 |
| 应收账款账龄 | 0-30/31-60/61-90/91-180/180+ 天 | 1 天 |

#### 2.1.2 需要创建的文件

```
src/types/paymentRecord.ts          # 回款记录类型定义
src/pages/payments/PaymentRecordList.tsx
src/pages/payments/PaymentRecordDetail.tsx
src/components/ReconciliationDialog.tsx   # 核销对话框
src/components/InvoiceForm.tsx            # 发票表单
src/hooks/useReconciliation.ts            # 核销 hook
src/mock/paymentRecordData.ts             # Mock 数据
```

#### 2.1.3 类型定义

```typescript
// src/types/paymentRecord.ts
export interface PaymentRecord {
  id: string;
  customerId: string;
  contractId?: string;
  planId?: string;  // 关联的回款计划
  amount: number;
  paymentDate: string;
  paymentMethod: '银行转账' | '现金' | '支票' | '支付宝' | '微信';
  status: '待核销' | '已核销' | '已驳回';
  invoiceType?: '专票' | '普票' | '无';
  invoiceStatus?: '未开票' | '已开票' | '已寄送';
  invoiceNumber?: string;
  remarks?: string;
  createdAt: string;
  createdBy: string;
}

export interface Reconciliation {
  id: string;
  recordId: string;
  planId: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
}
```

---

### 2.2 合同模块补全

#### 2.2.1 需要实现的功能

| 功能 | 说明 | 工作量 |
|------|------|--------|
| 回款计划关联 | 合同内嵌回款计划列表，支持创建/编辑 | 1.5 天 |
| 审批流程 | 提交审批、选择审批人、审批状态追踪 | 2 天 |
| 附件管理 | 合同附件上传、预览、下载 | 1 天 |
| 归档管理 | 合同归档操作，记录归档时间和操作人 | 0.5 天 |
| 合同类型 | 销售/采购/服务/其他分类 | 0.5 天 |
| 付款方式 | 一次性/分期/按里程碑 | 0.5 天 |
| 币种支持 | 人民币/美元/欧元/其他 | 0.5 天 |

#### 2.2.2 需要创建的文件

```
src/types/contract.ts               # 增强合同类型
src/components/ContractApprovalDialog.tsx
src/components/ContractAttachmentList.tsx
src/components/PaymentPlanList.tsx  # 回款计划列表
src/hooks/useContractApproval.ts
```

---

### 2.3 商机模块补全

#### 2.3.1 需要实现的功能

| 功能 | 说明 | 工作量 |
|------|------|--------|
| 竞争对手管理 | 记录竞争对手信息及优劣势分析 | 1 天 |
| 报价单关联 | 商机→报价单生成，关联 Quote 实体 | 1.5 天 |
| 联系人角色标记 | 标记联系人为决策者/影响者/使用者等 | 0.5 天 |
| 决策流程记录 | 记录客户决策流程和关键决策人 | 0.5 天 |

#### 2.3.2 需要创建的文件

```
src/types/competitor.ts
src/pages/opportunities/CompetitorManagement.tsx
src/components/QuoteGenerationDialog.tsx
src/components/ContactRoleSelector.tsx
```

---

### 2.4 客户模块补全

#### 2.4.1 需要实现的功能

| 功能 | 说明 | 工作量 |
|------|------|--------|
| 客户导入 | Excel/CSV 批量导入客户 | 2 天 |
| 线索查重 | 创建/编辑线索时自动查重 | 1 天 |
| 线索转化配置 | 转化时可选创建客户/联系人/商机 | 1 天 |
| 公海池功能 | 客户公海池列表、领取、退回 | 2 天 |
| 缺失字段 | 简称/年营业额/所属区域/公司规模/行业细分/下次联系时间 | 0.5 天 |

#### 2.4.2 需要创建的文件

```
src/components/CustomerImportDialog.tsx
src/components/LeadDuplicateCheckModal.tsx
src/components/LeadConversionDialog.tsx
src/pages/customers/HighSeasPool.tsx
src/hooks/useCustomerImport.ts
src/hooks/useLeadDuplicateCheck.ts
```

---

### 2.5 订单模块补全

#### 2.5.1 需要实现的功能

| 功能 | 说明 | 工作量 |
|------|------|--------|
| 商品明细 | 订单包含多个商品项（OrderItem[]） | 1.5 天 |
| 状态流转操作 | 确认订单/发货/完成订单/取消订单 | 1 天 |
| 统计卡片 | 订单总数/总金额/待处理/已完成 | 0.5 天 |

#### 2.5.2 需要创建的文件

```
src/types/orderItem.ts
src/components/OrderItemList.tsx
src/components/OrderStatusActions.tsx
```

---

### 2.6 产品/价格表重构

#### 2.6.1 需要完成的工作

| 工作 | 说明 | 工作量 |
|------|------|--------|
| 目录重构 | 迁移到 pages/products/ 和 pages/pricebooks/ | 0.5 天 |
| 新建/编辑路由 | 添加独立的新建和编辑路由 | 0.5 天 |
| Form 组件 | 完善产品/价格表表单组件 | 1 天 |

---

## 三、P1 功能补全计划（建议完成）

### 3.1 客户模块 P1

| 功能 | 工作量 |
|------|--------|
| 线索级别（高/中/低） | 0.5 天 |
| 意向产品字段 | 0.5 天 |

### 3.2 回款模块 P1

| 功能 | 工作量 |
|------|--------|
| 多维度统计（按状态/支付方式） | 0.5 天 |

### 3.3 系统模块 P1

| 功能 | 工作量 |
|------|--------|
| AI V2 功能评估合并 | 1 天 |
| 路由重定向规则 | 0.5 天 |

---

## 四、P2 功能补全计划（可选）

### 4.1 AI 功能

| 功能 | 工作量 |
|------|--------|
| 商机赢单预测 | 2 天 |
| 智能行动建议 | 2 天 |

### 4.2 国际化

| 功能 | 工作量 |
|------|--------|
| i18n 多语言支持 | 3 天 |

### 4.3 缺失模块评估

| 模块 | 评估 | 工作量 |
|------|------|--------|
| 工作台（/workbench） | 需评估是否必要 | 待定 |
| 呼叫中心（/callcenter） | 需评估是否必要 | 待定 |
| 工单系统（/tickets） | 需评估是否必要 | 待定 |
| 知识库（/knowledge） | 需评估是否必要 | 待定 |

---

## 五、Agent 执行计划

### 第 1 批：回款模块补全（P0-最高优先级）

**预计时间**: 3 Agent 并行，3-4 天

#### Agent 1.1: 回款记录实体 + 列表/详情
```
任务：实现回款记录实体和基础 CRUD
文件：
  - src/types/paymentRecord.ts
  - src/pages/payments/PaymentRecordList.tsx
  - src/pages/payments/PaymentRecordDetail.tsx
  - src/mock/paymentRecordData.ts
时间：2 天
```

#### Agent 1.2: 核销流程 + 发票管理
```
任务：实现核销/驳回流程和发票管理
文件：
  - src/components/ReconciliationDialog.tsx
  - src/components/InvoiceForm.tsx
  - src/hooks/useReconciliation.ts
时间：2 天
```

#### Agent 1.3: 回款统计 + 趋势 + 账龄
```
任务：实现统计卡片、趋势图表、账龄分析
文件：
  - src/components/PaymentStatistics.tsx
  - src/components/PaymentTrendChart.tsx
  - src/components/ReceivablesAging.tsx
时间：1.5 天
```

---

### 第 2 批：合同模块补全（P0）

**预计时间**: 2 Agent 并行，2-3 天

#### Agent 2.1: 合同审批流程 + 附件管理
```
任务：实现合同审批和附件功能
文件：
  - src/components/ContractApprovalDialog.tsx
  - src/components/ContractAttachmentList.tsx
  - src/hooks/useContractApproval.ts
时间：2 天
```

#### Agent 2.2: 回款计划关联 + 合同类型/币种
```
任务：实现合同回款计划关联和基础字段
文件：
  - src/components/PaymentPlanList.tsx
  - src/types/contract.ts（增强）
时间：1.5 天
```

---

### 第 3 批：商机模块补全（P0）

**预计时间**: 2 Agent 并行，2 天

#### Agent 3.1: 竞争对手管理 + 联系人角色
```
任务：实现竞争对手和联系人角色功能
文件：
  - src/types/competitor.ts
  - src/pages/opportunities/CompetitorManagement.tsx
  - src/components/ContactRoleSelector.tsx
时间：1.5 天
```

#### Agent 3.2: 报价单关联 + 决策流程
```
任务：实现商机生成报价单和决策流程记录
文件：
  - src/components/QuoteGenerationDialog.tsx
  - src/components/DecisionProcessRecord.tsx
时间：1.5 天
```

---

### 第 4 批：客户模块补全（P0）

**预计时间**: 3 Agent 并行，2-3 天

#### Agent 4.1: 客户导入功能
```
任务：实现 Excel/CSV 导入
文件：
  - src/components/CustomerImportDialog.tsx
  - src/hooks/useCustomerImport.ts
时间：2 天
```

#### Agent 4.2: 线索查重 + 转化配置
```
任务：实现线索查重和转化功能
文件：
  - src/components/LeadDuplicateCheckModal.tsx
  - src/components/LeadConversionDialog.tsx
  - src/hooks/useLeadDuplicateCheck.ts
时间：1.5 天
```

#### Agent 4.3: 公海池功能 + 缺失字段
```
任务：实现公海池和补充客户字段
文件：
  - src/pages/customers/HighSeasPool.tsx
  - src/types/customer.ts（增强）
时间：2 天
```

---

### 第 5 批：订单模块 + 产品重构（P1）

**预计时间**: 2 Agent 并行，2 天

#### Agent 5.1: 订单商品明细 + 状态流转
```
任务：实现订单商品和状态操作
文件：
  - src/types/orderItem.ts
  - src/components/OrderItemList.tsx
  - src/components/OrderStatusActions.tsx
时间：2 天
```

#### Agent 5.2: 产品/价格表重构
```
任务：重构目录和添加路由
文件：
  - src/pages/products/*（迁移）
  - src/pages/pricebooks/*（迁移）
  - src/routes/index.tsx（更新）
时间：1.5 天
```

---

### 第 6 批：P1/P2功能（可选）

**评估后决定**

---

## 六、依赖关系

```
[第 1 批 - 回款]
    ├── Agent 1.1 (回款记录)
    ├── Agent 1.2 (核销/发票) ← 依赖 1.1
    └── Agent 1.3 (统计/趋势) ← 依赖 1.1

[第 2 批 - 合同] ← 可与第 1 批并行
    ├── Agent 2.1 (审批/附件)
    └── Agent 2.2 (回款计划关联) ← 依赖第 1 批

[第 3 批 - 商机] ← 可与第 1-2 批并行
    ├── Agent 3.1 (竞争对手/角色)
    └── Agent 3.2 (报价单关联)

[第 4 批 - 客户] ← 可与第 1-3 批并行
    ├── Agent 4.1 (导入)
    ├── Agent 4.2 (查重/转化)
    └── Agent 4.3 (公海池)

[第 5 批 - 订单/产品] ← 第 1-4 批完成后
    ├── Agent 5.1 (订单明细)
    └── Agent 5.2 (产品重构)
```

---

## 七、时间估算

| 批次 | 内容 | Agent 数 | 预计时间 |
|------|------|---------|----------|
| 第 1 批 | 回款模块补全 | 3 | 3-4 天 |
| 第 2 批 | 合同模块补全 | 2 | 2-3 天 |
| 第 3 批 | 商机模块补全 | 2 | 2 天 |
| 第 4 批 | 客户模块补全 | 3 | 2-3 天 |
| 第 5 批 | 订单 + 产品重构 | 2 | 2 天 |
| **总计（P0）** | | **12 Agent** | **11-14 天** |

---

## 八、检查点

### 第 1 批检查点（回款）
- [ ] 回款记录列表可访问
- [ ] 回款记录创建/编辑/删除正常
- [ ] 核销流程正常（核销/驳回）
- [ ] 发票信息管理正常
- [ ] 逾期计算准确
- [ ] 统计卡片显示正确
- [ ] 回款趋势图表正常
- [ ] 应收账款账龄分析正常

### 第 2 批检查点（合同）
- [ ] 合同审批流程正常
- [ ] 附件上传/预览/下载正常
- [ ] 回款计划关联正常
- [ ] 合同类型/币种选择正常
- [ ] 归档功能正常

### 第 3 批检查点（商机）
- [ ] 竞争对手管理正常
- [ ] 商机生成报价单正常
- [ ] 联系人角色标记正常
- [ ] 决策流程记录正常

### 第 4 批检查点（客户）
- [ ] 客户导入功能正常（Excel/CSV）
- [ ] 线索查重功能正常
- [ ] 线索转化配置正常
- [ ] 公海池功能正常（领取/退回）
- [ ] 缺失字段正常显示

### 第 5 批检查点（订单/产品）
- [ ] 订单商品明细正常
- [ ] 订单状态流转正常
- [ ] 产品目录重构完成
- [ ] 产品/价格表新建编辑路由正常

---

## 九、风险和注意事项

### 9.1 风险识别

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| 回款核销逻辑复杂 | 实现难度高 | 参考原项目设计，编写详细文档 |
| 多 Agent 协作 | 代码风格不一致 | 制定统一规范，Code Review |
| 数据迁移 | 旧数据兼容问题 | 编写数据迁移脚本 |
| 工作量评估偏差 | 延期风险 | 预留 20% 缓冲时间 |

### 9.2 注意事项

1. **回款核销是核心** - 必须保证逻辑正确，影响财务数据
2. **保持类型安全** - 所有新增类型都要完整定义
3. **使用 shadcn/ui** - 保持 UI 一致性
4. **Mock 数据同步** - 每个新功能都要有 Mock 数据
5. **路由兼容** - 考虑旧路由重定向

---

## 十、后续计划

完成 V6 后，项目核心功能将达到：

| 模块 | 目标完成度 |
|------|-----------|
| 客户/联系人/线索 | 95% |
| 商机 | 95% |
| 合同 | 95% |
| 订单 | 90% |
| 回款 | 95% |
| 营销 | 85% |
| 自动化/工作流 | 90% |
| 报表 | 85% |
| AI | 90% |
| 系统设置 | 95% |
| 产品/价格表 | 90% |

**整体完成度**: 90%+，达到上线标准

---

*文档版本：V6*
*制定时间：2026-04-10*
*基于：4 个 PM 子 Agent 功能对比分析报告*
*预计工期：11-14 天（P0 功能）*
