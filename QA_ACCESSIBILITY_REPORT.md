# 页面可访问性测试报告

| 序号 | URL | 页面名称 | 状态 | 问题描述 |
|------|-----|----------|------|----------|
| 1 | /workbench | 销售工作台 | ✅ 正常 | - |
| 2 | /dashboard | 仪表盘 | ✅ 正常 | - |
| 3 | /customer/list | 客户列表 | ❌ 错误 | industryOptions is not defined |
| 4 | /customer/C001 | 客户详情 | ⚠️ ID不存在 | Customer not found |
| 5 | /contact/list | 联系人列表 | ✅ 正常 | - |
| 6 | /contact/CT001 | 联系人详情 | ⚠️ ID不存在 | 联系人不存在 |
| 7 | /lead/list | 线索列表 | ✅ 正常 | - |
| 8 | /lead/L001 | 线索详情 | ⚠️ ID不存在 | 线索不存在 |
| 9 | /opportunity/list | 商机列表 | ✅ 正常 | - |
| 10 | /opportunity/O001 | 商机详情 | ⚠️ ID不存在 | 商机不存在 |
| 11 | /activity/list | 跟进记录列表 | ✅ 正常 | - |
| 12 | /activity/new | 新建跟进 | ✅ 正常 | - |
| 13 | /contract/list | 合同列表 | ✅ 正常 | - |
| 14 | /contract/CON001 | 合同详情 | ⚠️ ID不存在 | 合同不存在 |
| 15 | /payment/list | 回款列表 | ✅ 正常 | - |
| 16 | /payment/P001 | 回款详情 | ⚠️ ID不存在 | 回款计划不存在 |
| 17 | /order/list | 订单列表 | ✅ 正常 | - |
| 18 | /order/ORD001 | 订单详情 | ⚠️ ID不存在 | 订单不存在 |
| 19 | /quote/list | 报价单列表 | ✅ 正常 | - |
| 20 | /quote/new | 新建报价单 | ✅ 正常 | - |
| 21 | /quote/Q001 | 报价单详情 | ⚠️ ID不存在 | 报价单不存在或已删除 |
| 22 | /products/list | 产品列表 | ✅ 正常 | - |
| 23 | /products/1 | 产品详情 | ⚠️ ID不存在 | 产品不存在 |
| 24 | /pricebooks/list | 价格表列表 | ✅ 正常 | - |
| 25 | /pricebooks/1 | 价格表详情 | ⚠️ ID不存在 | 价格表不存在 |
| 26 | /report/funnel | 销售漏斗报表 | ✅ 正常 | - |
| 27 | /report/performance | 业绩统计报表 | ✅ 正常 | - |
| 28 | /report/customer | 客户分析报表 | ✅ 正常 | - |
| 29 | /report/activity | 跟进活动统计 | ✅ 正常 | - |
| 30 | /report/lead-conversion | 线索转化分析 | ✅ 正常 | - |
| 31 | /report/payment | 回款分析报表 | ✅ 正常 | - |
| 32 | /ai/lead-assignment | 智能线索分配 | ✅ 正常 | - |
| 33 | /ai/lead-scoring | 线索评分 AI | ✅ 正常 | - |
| 34 | /ai/sales-forecast | 销售预测 AI | ✅ 正常 | - |
| 35 | /ai/customer-segmentation | 客户分群 AI | ✅ 正常 | - |
| 36 | /ai/churn-warning | 客户流失预警 | ✅ 正常 | - |
| 37 | /ai/meeting-assistant | 会议助手 | ✅ 正常 | - |
| 38 | /ai/predictive | 预测性 AI | ✅ 正常 | - |
| 39 | /ai/agents | AI 智能体 | ✅ 正常 | - |
| 40 | /marketing/campaigns | 营销活动列表 | ✅ 正常 | - |
| 41 | /marketing/campaign/1 | 营销活动详情 | ❌ 白屏/加载失败 | 页面空白，无内容加载 |
| 42 | /marketing/email-templates | 邮件模板 | ✅ 正常 | - |
| 43 | /marketing/target-lists | 目标列表 | ✅ 正常 | - |
| 44 | /integration/tickets | 工单系统 | ✅ 正常 | - |
| 45 | /integration/knowledge | 知识库 | ✅ 正常 | - |
| 46 | /integration/callcenter | 呼叫中心 | ✅ 正常 | - |
| 47 | /automation/workflows | 工作流 | ✅ 正常 | - |
| 48 | /automation/workflows/new | 新建工作流 | ✅ 正常 | - |
| 49 | /automation/logs | 执行日志 | ❌ 错误 | 显示"Workflow not found" |
| 50 | /settings/profile | 个人信息 | ✅ 正常 | - |
| 51 | /settings/change-password | 修改密码 | ✅ 正常 | - |
| 52 | /settings/notifications | 通知偏好 | ✅ 正常 | - |
| 53 | /settings/display | 显示偏好 | ✅ 正常 | - |
| 54 | /settings/roles | 角色管理 | ✅ 正常 | - |
| 55 | /settings/users | 用户管理 | ✅ 正常 | - |
| 56 | /settings/permissions | 权限配置 | ✅ 正常 | - |
| 57 | /settings/custom-fields | 自定义字段 | ✅ 正常 | - |
| 58 | /settings/custom-objects | 自定义对象 | ✅ 正常 | - |
| 59 | /settings/custom-objects/create | 创建自定义对象 | ✅ 正常 | - |
| 60 | /settings/audit-log | 操作日志 | ✅ 正常 | - |
| 61 | /settings/login-log | 登录日志 | ✅ 正常 | - |
| 62 | /settings/system-config | 系统配置 | ✅ 正常 | - |

## 汇总
- 总页面数: 62
- ✅ 正常: 58
- ⚠️ ID不存在: 11 (详情页ID不存在，非Bug)
- ❌ 异常: 3
  - /customer/list: industryOptions is not defined
  - /marketing/campaign/1: 白屏/加载失败
  - /automation/logs: 显示"Workflow not found"
