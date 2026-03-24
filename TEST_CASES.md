# CRM 项目测试用例总览

**项目名称**: Self-Research CRM Demo  
**测试版本**: Phase 1-3 (Phase 4 AI 功能待开发)  
**文档版本**: v1.0  
**创建日期**: 2026-03-13  
**最后更新**: 2026-03-13

---

## 📊 测试用例统计

| 模块 | 用例编号范围 | P0 用例数 | P1 用例数 | P2 用例数 | 总计 |
|------|-------------|----------|----------|----------|------|
| 客户管理 | TC-CUSTOMER-001 ~ 020 | 8 | 8 | 4 | 20 |
| 联系人管理 | TC-CONTACT-001 ~ 015 | 6 | 6 | 3 | 15 |
| 线索管理 | TC-LEAD-001 ~ 018 | 7 | 7 | 4 | 18 |
| 跟进记录 | TC-ACTIVITY-001 ~ 015 | 6 | 6 | 3 | 15 |
| 商机管理 | TC-OPPORTUNITY-001 ~ 018 | 7 | 7 | 4 | 18 |
| 合同管理 | TC-CONTRACT-001 ~ 018 | 7 | 7 | 4 | 18 |
| 回款管理 | TC-PAYMENT-001 ~ 015 | 6 | 6 | 3 | 15 |
| 报表中心 | TC-REPORT-001 ~ 024 | 10 | 10 | 4 | 24 |
| 仪表盘 | TC-DASHBOARD-001 ~ 012 | 5 | 5 | 2 | 12 |
| 权限管理 | TC-PERMISSION-001 ~ 015 | 6 | 6 | 3 | 15 |
| AI 功能 | TC-AI-001 ~ 030 | 12 | 12 | 6 | 30 |
| **总计** | - | **80** | **80** | **40** | **200** |

### 优先级分布

- **P0 (核心功能)**: 80 个用例 (40%) - 必须测试，影响主流程
- **P1 (重要功能)**: 80 个用例 (40%) - 应该测试，影响用户体验
- **P2 (辅助功能)**: 40 个用例 (20%) - 可以测试，锦上添花

---

## 📁 分模块测试用例文件

| 模块 | 文件名 | 用例数 | 状态 |
|------|--------|--------|------|
| 客户管理 | [TEST_CASES_CUSTOMER.md](./TEST_CASES_CUSTOMER.md) | 20 | ✅ 已完成 |
| 联系人管理 | [TEST_CASES_CONTACT.md](./TEST_CASES_CONTACT.md) | 15 | ✅ 已完成 |
| 线索管理 | [TEST_CASES_LEAD.md](./TEST_CASES_LEAD.md) | 18 | ✅ 已完成 |
| 跟进记录 | [TEST_CASES_ACTIVITY.md](./TEST_CASES_ACTIVITY.md) | 15 | ✅ 已完成 |
| 商机管理 | [TEST_CASES_OPPORTUNITY.md](./TEST_CASES_OPPORTUNITY.md) | 18 | ✅ 已完成 |
| 合同管理 | [TEST_CASES_CONTRACT.md](./TEST_CASES_CONTRACT.md) | 18 | ✅ 已完成 |
| 回款管理 | [TEST_CASES_PAYMENT.md](./TEST_CASES_PAYMENT.md) | 15 | ✅ 已完成 |
| 报表中心 | [TEST_CASES_REPORT.md](./TEST_CASES_REPORT.md) | 24 | ✅ 已完成 |
| 仪表盘 | [TEST_CASES_DASHBOARD.md](./TEST_CASES_DASHBOARD.md) | 12 | ✅ 已完成 |
| 权限管理 | [TEST_CASES_PERMISSION.md](./TEST_CASES_PERMISSION.md) | 15 | ✅ 已完成 |
| AI 功能 | [TEST_CASES_AI.md](./TEST_CASES_AI.md) | 30 | ⏳ Phase 4 完成后补充 |

---

## 📋 相关文档

| 文档 | 说明 |
|------|------|
| [TEST_PLAN.md](./TEST_PLAN.md) | 测试执行计划（环境、数据、顺序、时间） |
| [TEST_REPORT_TEMPLATE.md](./TEST_REPORT_TEMPLATE.md) | 测试报告模板 |

---

## 🎯 测试执行策略

### 第一轮：Phase 1-3 功能测试
- 执行所有 P0 级别测试用例（80 个）
- 记录发现的 Bug
- 生成第一轮测试报告

### 第二轮：Phase 4 AI 功能测试
- 等待 Phase 4 开发完成后
- 执行 AI 功能相关测试用例（30 个）
- 补充遗漏的测试场景

### 第三轮：回归测试
- 执行全量测试用例（200 个）
- 验证 Bug 修复
- 生成最终测试报告

---

## 📝 测试用例格式说明

每个测试用例包含以下字段：

| 字段 | 说明 |
|------|------|
| 用例编号 | 唯一标识符，如 TC-CUSTOMER-001 |
| 测试模块 | 所属功能模块 |
| 测试场景 | 具体测试的场景描述 |
| 前置条件 | 执行测试前需要满足的条件 |
| 测试步骤 | 详细的操作步骤（支持多步骤） |
| 预期结果 | 期望的系统响应和行为 |
| 优先级 | P0/P1/P2 |
| 测试状态 | 待执行/通过/失败 |

---

## 🔗 快速导航

- [客户管理测试用例](./TEST_CASES_CUSTOMER.md)
- [联系人管理测试用例](./TEST_CASES_CONTACT.md)
- [线索管理测试用例](./TEST_CASES_LEAD.md)
- [跟进记录测试用例](./TEST_CASES_ACTIVITY.md)
- [商机管理测试用例](./TEST_CASES_OPPORTUNITY.md)
- [合同管理测试用例](./TEST_CASES_CONTRACT.md)
- [回款管理测试用例](./TEST_CASES_PAYMENT.md)
- [报表中心测试用例](./TEST_CASES_REPORT.md)
- [仪表盘测试用例](./TEST_CASES_DASHBOARD.md)
- [权限管理测试用例](./TEST_CASES_PERMISSION.md)
- [AI 功能测试用例](./TEST_CASES_AI.md)
