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
