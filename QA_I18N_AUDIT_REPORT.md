# i18n 国际化审计报告

## 1. zh.json vs en.json Key 对比

- zh.json key 总数: 约 2500+
- en.json key 总数: 约 2500+
- 一致: 约 95%
- zh 独有: 约 100+
- en 独有: 约 50+

### zh.json 独有的 key（部分示例）

**customer.list.statusOptions 中的中文状态值（作为数据存储）:**
- `customer.list.statusOptions.潜在`
- `customer.list.statusOptions.意向`
- `customer.list.statusOptions.谈判`
- `customer.list.statusOptions.成交`
- `customer.list.statusOptions.流失`
- `customer.list.statusOptions.冻结`

**workbench.create 中的阶段选项（硬编码）:**
- `workbench.create.stageLead`
- `workbench.create.stageQualify`
- `workbench.create.stageProposal`
- `workbench.create.stageNegotiation`
- `workbench.create.stageClosed`

**product.form 中的单位选项:**
- `product.form.unitOptions.set`
- `product.form.unitOptions.device`
- `product.form.unitOptions.piece`
- `product.form.unitOptions.project`
- `product.form.unitOptions.manDay`
- `product.form.unitOptions.session`
- `product.form.unitOptions.account`
- `product.form.unitOptions.personTime`
- `product.form.unitOptions.year`
- `product.form.unitOptions.time`

**pricebook.form 中的 mock 客户数据:**
- `pricebook.form.mockCustomer1`
- `pricebook.form.mockCustomer2`
- `pricebook.form.mockCustomer3`

**contact.mock 中的 mock 数据:**
- `contact.mock.customer1`
- `contact.mock.customer2`

**customerForm.industryOptions 中的中文选项值:**
- `customerForm.industryOptions.internet` (值为 "互联网/软件/IT 服务")
- `customerForm.industryOptions.manufacturing` (值为 "制造业")
- `customerForm.industryOptions.finance` (值为 "金融业")
- `customerForm.industryOptions.retail` (值为 "零售业")
- `customerForm.industryOptions.healthcare` (值为 "医疗健康")
- `customerForm.industryOptions.education` (值为 "教育培训")
- `customerForm.industryOptions.realEstate` (值为 "房地产")
- `customerForm.industryOptions.energy` (值为 "能源/化工")
- `customerForm.industryOptions.logistics` (值为 "物流/运输")
- `customerForm.industryOptions.other` (值为 "其他")

**customerForm.companySizeOptions 中的中文选项值:**
- `customerForm.companySizeOptions.micro` (值为 "微型 (1-20人)")
- `customerForm.companySizeOptions.small` (值为 "小型 (21-100人)")
- `customerForm.companySizeOptions.medium` (值为 "中型 (101-500人)")
- `customerForm.companySizeOptions.large` (值为 "大型 (501-2000人)")
- `customerForm.companySizeOptions.xlarge` (值为 "超大型 (2000人+)")

### en.json 独有的 key（部分示例）

- `common.unit.record` - zh.json 中没有
- `common.messages.pleaseSelect` - zh.json 中没有
- `common.validation.pleaseSelect` - zh.json 中没有
- `common.detail` - zh.json 中没有
- `common.failed` - zh.json 中没有
- `common.operationSuccess` - zh.json 中没有（但有 operationFailed）
- `common.operationFailed` - zh.json 中没有（但有 operationSuccess）
- `common.deleteConfirm` - zh.json 中没有
- `common.saveSuccess` - zh.json 中没有（重复定义）
- `common.saveFailed` - zh.json 中没有（重复定义）
- `common.loadFailed` - zh.json 中没有（重复定义）
- `common.required` - zh.json 中没有（重复定义）
- `common.optional` - zh.json 中没有
- `common.enabled` - zh.json 中没有
- `common.disabled` - zh.json 中没有
- `common.comingSoon` - zh.json 中没有
- `common.copy` - zh.json 中没有
- `common.createSuccess` - zh.json 中没有（重复定义）
- `common.deleteSuccess` - zh.json 中没有（重复定义）
- `common.updateSuccess` - zh.json 中没有（重复定义）
- `common.description` - zh.json 中没有
- `common.none` - zh.json 中没有
- `common.select` - zh.json 中没有
- `common.to` - zh.json 中没有
- `common.filter` - zh.json 中没有

**nav 中缺失的 key:**
- `nav.searchPlaceholder` - zh.json 中没有
- `nav.notificationTitle` - zh.json 中没有
- `nav.viewAllNotifications` - zh.json 中没有
- `nav.userCenter` - zh.json 中没有
- `nav.accountSettings` - zh.json 中没有
- `nav.logout` - zh.json 中没有
- `nav.contractApprovalPending` - zh.json 中没有
- `nav.opportunityExpiringSoon` - zh.json 中没有
- `nav.crmSystem` - zh.json 中没有
- `nav.administrator` - zh.json 中没有

**customer.list.statusOptions 中的英文状态值:**
- `customer.list.statusOptions.prospect`
- `customer.list.statusOptions.interested`
- `customer.list.statusOptions.negotiating`
- `customer.list.statusOptions.closed`
- `customer.list.statusOptions.churned`

**customer.list.levelOptions:**
- `customer.list.levelOptions.A`
- `customer.list.levelOptions.B`
- `customer.list.levelOptions.C`
- `customer.list.levelOptions.D`

---

## 2. 硬编码中文扫描结果

### 汇总

| 文件 | 硬编码中文数量 | 需要i18n | 不需要i18n |
|------|---------------|----------|-----------|
| ActivityForm.tsx | 25+ | 5 | 20+ |
| ActivityList.tsx | 20+ | 3 | 17+ |
| ActivityReport.tsx | 15+ | 10 | 5 |
| CampaignDetail.tsx | 10+ | 8 | 2 |
| ContactDetail.tsx | 5+ | 3 | 2 |
| ContactList.tsx | 15+ | 5 | 10 |
| ContractDetail.tsx | 20+ | 5 | 15 |
| ContractList.tsx | 25+ | 8 | 17 |
| CustomerDetail.tsx | 10+ | 5 | 5 |
| CustomerList.tsx | 30+ | 10 | 20 |
| Dashboard.tsx | 20+ | 15 | 5 |
| LeadAssignment.tsx | 25+ | 15 | 10 |
| LeadDetail.tsx | 15+ | 8 | 7 |
| LeadList.tsx | 20+ | 10 | 10 |
| OpportunityDetail.tsx | 10+ | 5 | 5 |
| OpportunityList.tsx | 20+ | 8 | 12 |
| PaymentDetail.tsx | 15+ | 5 | 10 |
| PaymentList.tsx | 15+ | 5 | 10 |
| PaymentReport.tsx | 10+ | 8 | 2 |
| PermissionSettings.tsx | 30+ | 5 | 25 |
| PredictiveAI.tsx | 10+ | 5 | 5 |
| QuoteNew.tsx | 15+ | 10 | 5 |
| QuotesList.tsx | 10+ | 5 | 5 |
| Roles.tsx | 30+ | 5 | 25 |
| SalesForecast.tsx | 10+ | 5 | 5 |
| TargetLists.tsx | 10+ | 5 | 5 |
| TestPage.tsx | 5+ | 5 | 0 |
| Users.tsx | 25+ | 5 | 20 |
| **Components 文件** | 200+ | 50+ | 150+ |
| **总计** | **600+** | **~200** | **~400** |

### 详细列表（关键文件）

#### CustomerList.tsx

| 文件 | 行号 | 内容 | 类型 | 是否需要i18n |
|------|------|------|------|-------------|
| CustomerList.tsx | 42-51 | 行业选项 value: '互联网/软件/IT 服务' 等 | Select option value | 数据存储值，不需要 |
| CustomerList.tsx | 64-67 | 状态选项 value: '意向', '谈判', '成交', '流失' | Select option value | 数据存储值，不需要 |
| CustomerList.tsx | 70-84 | 客户等级/状态标签颜色映射 | 代码逻辑 | 不需要 |
| CustomerList.tsx | 117 | 加载客户列表失败提示 | message.error | ⚠️ 需要 i18n |
| CustomerList.tsx | 346-351 | 线索来源选项 value: '市场活动', '官网' 等 | Select option value | 数据存储值，不需要 |
| CustomerList.tsx | 573 | initialValues: { status: '意向', source: '官网' } | 默认值 | 数据存储值，不需要 |
| CustomerList.tsx | 600-605 | Select.Option value="市场活动" 等 | Select option | 数据存储值，不需要 |
| CustomerList.tsx | 664-667 | Select.Option value="意向" 等 | Select option | 数据存储值，不需要 |

#### LeadList.tsx

| 文件 | 行号 | 内容 | 类型 | 是否需要i18n |
|------|------|------|------|-------------|
| LeadList.tsx | 21-24 | 状态选项 value: '待跟进', '跟进中', '已转化', '已关闭' | Select option value | 数据存储值，不需要 |
| LeadList.tsx | 27-34 | 来源选项 value: '市场活动', '官网', '转介绍' 等 | Select option value | 数据存储值，不需要 |
| LeadList.tsx | 309-314 | Select.Option value="市场活动" 等 | Select option | 数据存储值，不需要 |
| LeadList.tsx | 319-321 | Select.Option value="高"/"中"/"低" | Select option | 数据存储值，不需要 |
| LeadList.tsx | 372-377 | Select.Option value="市场活动" 等 | Select option | 数据存储值，不需要 |
| LeadList.tsx | 382-384 | Select.Option value="高"/"中"/"低" | Select option | 数据存储值，不需要 |
| LeadList.tsx | 404-407 | Select.Option value="待跟进" 等 | Select option | 数据存储值，不需要 |

#### ContractList.tsx

| 文件 | 行号 | 内容 | 类型 | 是否需要i18n |
|------|------|------|------|-------------|
| ContractList.tsx | 28 | 筛选的合同状态 | 注释 | 不需要 |
| ContractList.tsx | 33 | 合同统计数据 | 注释 | 不需要 |
| ContractList.tsx | 38 | 加载数据 | 注释 | 不需要 |
| ContractList.tsx | 123 | 合同状态选项 value: '草稿', '待审批', '生效中', '已归档', '已终止' | Select option | 数据存储值，不需要 |
| ContractList.tsx | 129 | 合同类型选项 | 注释 | 不需要 |
| ContractList.tsx | 135 | 格式金额 | 注释 | 不需要 |
| ContractList.tsx | 231 | status === '生效中' ? '#52c41a' ... | 条件渲染 | 数据存储值，不需要 |
| ContractList.tsx | 269-271 | Select.Option value="销售合同"/"采购合同"/"服务合同" | Select option | 数据存储值，不需要 |
| ContractList.tsx | 310-314 | Select.Option value="草稿" 等 | Select option | 数据存储值，不需要 |
| ContractList.tsx | 340-341 | Select.Option value="1"/"2" 审批人 | mock 数据 | 不需要 |

#### ActivityForm.tsx

| 文件 | 行号 | 内容 | 类型 | 是否需要i18n |
|------|------|------|------|-------------|
| ActivityForm.tsx | 12 | // 富文本编辑器占位，使用 TextArea 替代 | 注释 | 不需要 |
| ActivityForm.tsx | 39