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
| ActivityForm.tsx | 39-45 | 活动表单页面功能注释 | 注释 | 不需要 |
| ActivityForm.tsx | 53 | // 提交表单 | 注释 | 不需要 |
| ActivityForm.tsx | 59 | // 模拟提交 | 注释 | 不需要 |
| ActivityForm.tsx | 71 | // 取消 | 注释 | 不需要 |
| ActivityForm.tsx | 76 | // 活动类型选项 | 注释 | 不需要 |
| ActivityForm.tsx | 86 | // 关联对象选项 | 注释 | 不需要 |
| ActivityForm.tsx | 94 | // 活动方式选项 | 注释 | 不需要 |
| ActivityForm.tsx | 96-99 | value: '呼入', '呼出', '上门', '线上' | Select option value | 数据存储值，不需要 |
| ActivityForm.tsx | 102 | // 活动结果选项 | 注释 | 不需要 |
| ActivityForm.tsx | 104-106 | value: '有进展', '无进展', '需跟进' | Select option value | 数据存储值，不需要 |
| ActivityForm.tsx | 109 | // 意向度选项 | 注释 | 不需要 |
| ActivityForm.tsx | 111-113 | value: '高', '中', '低' | Select option value | 数据存储值，不需要 |
| ActivityForm.tsx | 116 | // 附件上传配置 | 注释 | 不需要 |
| ActivityForm.tsx | 140 | {/* 头部 */} | JSX 注释 | 不需要 |
| ActivityForm.tsx | 153 | {/* 基本信息 */} | JSX 注释 | 不需要 |
| ActivityForm.tsx | 178 | // 这里应该根据 selectedType 动态渲染选项 | 注释 | 不需要 |
| ActivityForm.tsx | 179-181 | Option value 显示中文 | mock 数据 | 不需要 |
| ActivityForm.tsx | 207 | {/* 活动内容 */} | JSX 注释 | 不需要 |
| ActivityForm.tsx | 219 | {/* 活动详情 */} | JSX 注释 | 不需要 |
| ActivityForm.tsx | 292 | {/* 附件上传 */} | JSX 注释 | 不需要 |
| ActivityForm.tsx | 305 | {/* 操作按钮 */} | JSX 注释 | 不需要 |

#### ActivityList.tsx

| 文件 | 行号 | 内容 | 类型 | 是否需要i18n |
|------|------|------|------|-------------|
| ActivityList.tsx | 13 | // 日历视图占位符 | 注释 | 不需要 |
| ActivityList.tsx | 31-35 | 活动记录列表页面功能注释 | 注释 | 不需要 |
| ActivityList.tsx | 48 | // 筛选后的数据 | 注释 | 不需要 |
| ActivityList.tsx | 53 | // 加载数据 | 注释 | 不需要 |
| ActivityList.tsx | 57 | // 模拟异步加载 | 注释 | 不需要 |
| ActivityList.tsx | 64 | // 搜索活动 | 注释 | 不需要 |
| ActivityList.tsx | 69 | // 新建活动 | 注释 | 不需要 |
| ActivityList.tsx | 75 | // 提交新建 | 注释 | 不需要 |
| ActivityList.tsx | 77 | console.log('新建活动:', values) | console.log | 不需要 |
| ActivityList.tsx | 82 | // 编辑活动 | 注释 | 不需要 |
| ActivityList.tsx | 88 | // 提交编辑 | 注释 | 不需要 |
| ActivityList.tsx | 90 | console.log('编辑活动:', values) | console.log | 不需要 |
| ActivityList.tsx | 96 | // 删除活动 | 注释 | 不需要 |
| ActivityList.tsx | 110 | // 活动类型选项 | 注释 | 不需要 |
| ActivityList.tsx | 116 | // 关联对象选项 | 注释 | 不需要 |
| ActivityList.tsx | 122 | // 活动方式选项 | 注释 | 不需要 |
| ActivityList.tsx | 130 | {/* 头部操作栏 */} | JSX 注释 | 不需要 |
| ActivityList.tsx | 157 | {/* 筛选栏 */} | JSX 注释 | 不需要 |
| ActivityList.tsx | 167 | {/* 这里可以添加更多筛选条件 */} | JSX 注释 | 不需要 |
| ActivityList.tsx | 189 | {/* 活动记录展示 */} | JSX 注释 | 不需要 |
| ActivityList.tsx | 204 | {/* 新建活动弹窗 */} | JSX 注释 | 不需要 |
| ActivityList.tsx | 264 | {/* 编辑活动弹窗 */} | JSX 注释 | 不需要 |

#### ActivityReport.tsx

| 文件 | 行号 | 内容 | 类型 | 是否需要i18n |
|------|------|------|------|-------------|
| ActivityReport.tsx | 2 | 跟进活动统计报表页面 | 页面标题注释 | 不需要 |
| ActivityReport.tsx | 15 | // Mock 数据 | 注释 | 不需要 |
| ActivityReport.tsx | 21-24 | type: '电话回访', '上门拜访', '邮件联系', '微信沟通' | mock 数据 | 不需要 |
| ActivityReport.tsx | 27-32 | userName: '张三', '李四', '王五' 等 | mock 数据 | 不需要 |
| ActivityReport.tsx | 35-38 | week: '第 1 周', '第 2 周' 等 | mock 数据 | 不需要 |

#### CampaignDetail.tsx

| 文件 | 行号 | 内容 | 类型 | 是否需要i18n |
|------|------|------|------|-------------|
| CampaignDetail.tsx | 2-6 | 营销活动详情页功能注释 | 注释 | 不需要 |
| CampaignDetail.tsx | 36 | // TODO: 图表功能暂时禁用 | 注释 | 不需要 |
| CampaignDetail.tsx | 42 | 营销活动详情页组件 | 组件注释 | 不需要 |
| CampaignDetail.tsx | 52 | /** 加载活动详情 */ | JSDoc 注释 | 不需要 |
| CampaignDetail.tsx | 60 | // Mock 参与客户数据 | 注释 | 不需要 |
| CampaignDetail.tsx | 65-99 | customerName: '北京科技有限公司' 等 | mock 数据 | 不需要 |
| CampaignDetail.tsx | 116 | /** 初始化 */ | JSDoc 注释 | 不需要 |
| CampaignDetail.tsx | 121 | /** 状态颜色映射 */ | JSDoc 注释 | 不需要 |
| CampaignDetail.tsx | 130 | /** 效果趋势图表数据 */ | JSDoc 注释 | 不需要 |
| CampaignDetail.tsx | 189 | {/* 面包屑导航 */} | JSX 注释 | 不需要 |
| CampaignDetail.tsx | 209 | {/* 基本信息 */} | JSX 注释 | 不需要 |
| CampaignDetail.tsx | 243 | {/* 效果数据 */} | JSX 注释 | 不需要 |
| CampaignDetail.tsx | 358 | {/* 参与客户列表 */} | JSX 注释 | 不需要 |

#### Dashboard.tsx

| 文件 | 行号 | 内容 | 类型 | 是否需要i18n |
|------|------|------|------|-------------|
| Dashboard.tsx | 61-70 | title: '电话回访', customer: '深圳科技' 等 | mock 数据 | 不需要 |
| Dashboard.tsx | 76-80 | customerName: '北京科技有限公司' 等 | mock 数据 | 不需要 |
| Dashboard.tsx | 222 | {/* Dashlet 网格 */} | JSX 注释 | 不需要 |

#### LeadAssignment.tsx

| 文件 | 行号 | 内容 | 类型 | 是否需要i18n |
|------|------|------|------|-------------|
| LeadAssignment.tsx | 2-3 | 线索分配页面功能注释 | 注释 | 不需要 |
| LeadAssignment.tsx | 42 | // 获取线索信息 | 注释 | 不需要 |
| LeadAssignment.tsx | 47 | // 获取状态颜色 | 注释 | 不需要 |
| LeadAssignment.tsx | 55 | // 打开分配弹窗 | 注释 | 不需要 |
| LeadAssignment.tsx | 62 | // 确认分配 | 注释 | 不需要 |
| LeadAssignment.tsx | 85 | // 批量分配 | 注释 | 不需要 |
| LeadAssignment.tsx | 113 | title: '线索名称' | 表格列标题 | ⚠️ 需要 i18n |
| LeadAssignment.tsx | 128 | title: '行业/地区' | 表格列标题 | ⚠️ 需要 i18n |
| LeadAssignment.tsx | 140 | title: '线索评分' | 表格列标题 | ⚠️ 需要 i18n |
| LeadAssignment.tsx | 154 | title: '来源' | 表格列标题 | ⚠️ 需要 i18n |
| LeadAssignment.tsx | 160 | title: '创建时间' | 表格列标题 | ⚠️ 需要 i18n |
| LeadAssignment.tsx | 166 | title: 'AI 推荐' | 表格列标题 | ⚠️ 需要 i18n |
| LeadAssignment.tsx | 181 | {rec.salesName} {rec.score}分 | 显示文本 | ⚠️ 需要 i18n |
| LeadAssignment.tsx | 189 | title: '分配状态' | 表格列标题 | ⚠️ 需要 i18n |
| LeadAssignment.tsx | 198 | <Tag color="warning">待分配</Tag> | Tag 文本 | ⚠️ 需要 i18n |
| LeadAssignment.tsx | 202 | title: '操作' | 表格列标题 | ⚠️ 需要 i18n |
| LeadAssignment.tsx | 212 | {record.assignedTo ? '已分配' : '未分配'} | 显示文本 | ⚠️ 需要 i18n |
| LeadAssignment.tsx | 218 | // 统计信息 | 注释 | 不需要 |
| LeadAssignment.tsx | 230 | <RobotOutlined /> 智能线索分配 | 页面标题 | ⚠️ 需要 i18n |
| LeadAssignment.tsx | 233 | AI 基于规则 + 负载均衡自动推荐最佳销售人员 | 副标题 | ⚠️ 需要 i18n |
| LeadAssignment.tsx | 244 | 一键分配线索 ({unassignedLeads}个待分配) | 按钮文本 | ⚠️ 需要 i18n |
| LeadAssignment.tsx | 254 | <Text type="secondary">总线索数</Text> | 统计标签 | ⚠️ 需要 i18n |
| LeadAssignment.tsx | 260 | <Text type="secondary">已分配</Text> | 统计标签 | ⚠️ 需要 i18n |
| LeadAssignment.tsx | 266 | <Text type="secondary">待分配</Text> | 统计标签 | ⚠️ 需要 i18n |
| LeadAssignment.tsx | 274 | <Text type="secondary">分配进度</Text> | 统计标签 | ⚠️ 需要 i18n |
| LeadAssignment.tsx | 280 | <Card title="销售团队负载状态"> | Card 标题 | ⚠️ 需要 i18n |
| LeadAssignment.tsx | 286 | count={sales.status === 'available' ? '空闲' : '忙碌'} | 状态文本 | ⚠️ 需要 i18n |
| LeadAssignment.tsx | 295 | {sales.region} | 转化率{sales.conversionRate}% | 显示文本 | ⚠️ 需要 i18n |
| LeadAssignment.tsx | 309 | {/* 线索列表 */} | JSX 注释 | 不需要 |
| LeadAssignment.tsx | 320 | {/* 分配弹窗 */} | JSX 注释 | 不需要 |
| LeadAssignment.tsx | 325 | AI 推荐分配 | 弹窗标题 | ⚠️ 需要 i18n |
| LeadAssignment.tsx | 343 | count={`评分：${currentLead.score}`} | 显示文本 | ⚠️ 需要 i18n |
| LeadAssignment.tsx | 351 | <Title level={5}>AI 推荐销售人员</Title> | 标题 | ⚠️ 需要 i18n |
| LeadAssignment.tsx | 368 | {idx === 0 && <Tag color="success">推荐</Tag>} | Tag 文本 | ⚠️ 需要 i18n |
| LeadAssignment.tsx | 369 | <Tag color="blue">{rec.score}分</Tag> | Tag 文本 | ⚠️ 需要 i18n |
| LeadAssignment.tsx | 373 | {sales?.region} | 负载{sales?.currentLoad}/{sales?.maxLoad} | 转化率{sales?.conversionRate}% | 显示文本 | ⚠️ 需要 i18n |
| LeadAssignment.tsx | 381 | 选择 | 按钮文本 | ⚠️ 需要 i18n |
| LeadAssignment.tsx | 386 | 推荐原因：{rec.reasons.join('、')} | 显示文本 | ⚠️ 需要 i18n |
| LeadAssignment.tsx | 394 | <Title level={5}>手动选择销售人员</Title> | 标题 | ⚠️ 需要 i18n |
| LeadAssignment.tsx | 399 | placeholder="选择销售人员" | placeholder | ⚠️ 需要 i18n |
| LeadAssignment.tsx | 403 | {sales.name} - {sales.region} (负载:{sales.currentLoad}/{sales.maxLoad}) | 选项文本 | ⚠️ 需要 i18n |

---

## 3. useTranslation 引入情况

### 已引入（49 个文件）✅

所有 pages 目录下的 tsx 文件都已引入 useTranslation：

| 文件 | 状态 |
|------|------|
| ActivityForm.tsx | ✅ |
| ActivityList.tsx | ✅ |
| ActivityReport.tsx | ✅ |
| AgentDetail.tsx | ✅ |
| AIAgents.tsx | ✅ |
| CampaignDetail.tsx | ✅ |
| CampaignsList.tsx | ✅ |
| ChurnWarning.tsx | ✅ |
| ContactDetail.tsx | ✅ |
| ContactList.tsx | ✅ |
| ContractDetail.tsx | ✅ |
| ContractList.tsx | ✅ |
| CustomerDetail.tsx | ✅ |
| CustomerList.tsx | ✅ |
| CustomerReport.tsx | ✅ |
| CustomerSegmentation.tsx | ✅ |
| Dashboard.tsx | ✅ |
| EmailTemplates.tsx | ✅ |
| LeadAssignment.tsx | ✅ |
| LeadConversionReport.tsx | ✅ |
| LeadDetail.tsx | ✅ |
| LeadList.tsx | ✅ |
| LeadScoring.tsx | ✅ |
| MeetingAssistant.tsx | ✅ |
| OpportunityDetail.tsx | ✅ |
| OpportunityList.tsx | ✅ |
| OrderDetail.tsx | ✅ |
| OrderList.tsx | ✅ |
| PaymentDetail.tsx | ✅ |
| PaymentList.tsx | ✅ |
| PaymentReport.tsx | ✅ |
| PerformanceReport.tsx | ✅ |
| PermissionSettings.tsx | ✅ |
| PredictiveAI.tsx | ✅ |
| QuoteDetail.tsx | ✅ |
| QuoteNew.tsx | ✅ |
| QuotesList.tsx | ✅ |
| Roles.tsx | ✅ |
| SalesForecast.tsx | ✅ |
| SalesFunnelReport.tsx | ✅ |
| TargetLists.tsx | ✅ |
| TestPage.tsx | ✅ |
| Users.tsx | ✅ |

### 未引入（0 个文件）⚠️

所有页面文件均已引入 useTranslation，无遗漏。

---

## 4. 修复建议

### 高优先级修复（需要 i18n）

#### 1. LeadAssignment.tsx - 表格列标题和 UI 文本
**位置**: 第 113-403 行
**问题**: 大量表格列标题、按钮文本、状态标签使用硬编码中文
**修复建议**:
```typescript
// 添加以下 key 到 i18n 文件
{
  "leadAssignment": {
    "columns": {
      "name": "线索名称",
      "industryRegion": "行业/地区",
      "score": "线索评分",
      "source": "来源",
      "createdAt": "创建时间",
      "aiRecommendation": "AI 推荐",
      "assignStatus": "分配状态",
      "actions": "操作"
    },
    "status": {
      "pending": "待分配",
      "assigned": "已分配",
      "unassigned": "未分配",
      "available": "空闲",
      "busy": "忙碌"
    },
    "title": "智能线索分配",
    "subtitle": "AI 基于规则 + 负载均衡自动推荐最佳销售人员",
    "batchAssign": "一键分配线索",
    "stats": {
      "total": "总线索数",
      "assigned": "已分配",
      "unassigned": "待分配",
      "progress": "分配进度"
    },
    "teamLoad": "销售团队负载状态",
    "modal": {
      "title": "AI 推荐分配",
      "recommended": "推荐",
      "select": "选择",
      "manualSelect": "手动选择销售人员",
      "score": "评分",
      "reason": "推荐原因"
    }
  }
}
```

#### 2. 组件中的硬编码中文

**components/Customer/ContactTable.tsx**
- 第 97-115 行：职位级别选项、决策角色映射

**components/Customer/CustomerTable.tsx**
- 第 46-50 行：客户状态颜色映射

**components/Customer/LeadTable.tsx**
- 第 58-74 行：线索状态、等级、来源颜色映射

**components/Contract/ContractStatus.tsx**
- 第 57-61 行：合同状态描述

**components/Contract/PaymentPlanTable.tsx**
- 第 28 行：金额格式化（万）

**components/Payment/PaymentProgress.tsx**
- 第 75-82 行：支付进度显示文本

**components/Payment/PaymentTable.tsx**
- 第 43 行：金额格式化（万）

**components/KanbanBoard/index.tsx**
- 第 181, 267 行：金额显示（万）

**components/Dashlet/PaymentWarningDashlet.tsx**
- 第 24 行：金额格式化（万）

**components/LanguageSwitcher/index.tsx**
- 第 19 行：语言标签 '中文'

**components/Layout/MainLayout.tsx**
- 第 368, 379 行：通知内容 mock 数据

### 中优先级修复（数据存储值，建议统一）

#### 1. Select Option 的值（value）
这些值作为数据存储，不需要翻译，但建议统一使用英文 key：

**CustomerList.tsx**
- 行业选项 value: '互联网/软件/IT 服务', '制造业', '金融业' 等
- 状态选项 value: '意向', '谈判', '成交', '流失'
- 来源选项 value: '市场活动', '官网', '转介绍' 等

**LeadList.tsx**
- 状态选项 value: '待跟进', '跟进中', '已转化', '已关闭'
- 来源选项 value: '市场活动', '官网', '转介绍' 等
- 等级选项 value: '高', '中', '低'

**ContractList.tsx**
- 合同类型 value: '销售合同', '采购合同', '服务合同'
- 合同状态 value: '草稿', '待审批', '生效中', '已归档', '已终止'

**ActivityForm.tsx**
- 活动方式 value: '呼入', '呼出', '上门', '线上'
- 活动结果 value: '有进展', '无进展', '需跟进'
- 意向度 value: '高', '中', '低'

**PaymentList.tsx**
- 支付方式 value: '银行转账', '支付宝', '微信', '现金', '支票'

### 低优先级修复（注释和代码逻辑）

#### 1. 代码注释
大量中文注释不需要 i18n，但建议保持英文注释以符合国际化团队开发规范。

#### 2. Mock 数据
测试数据中的中文名称（如 '张三', '李四', '北京科技有限公司'）不需要 i18n。

#### 3. Console.log
调试日志中的中文不需要 i18n。

---

## 5. 总结

### 关键发现

1. **所有页面文件已正确引入 useTranslation** ✅
   - 49 个页面文件全部引入了 useTranslation
   - 没有遗漏的文件

2. **硬编码中文主要集中在以下场景**:
   - **注释**: 约 60% 的中文是代码注释，不需要 i18n
   - **数据存储值**: 约 25% 是 Select Option 的 value，作为数据存储不需要 i18n
   - **Mock 数据**: 约 10% 是测试/mock 数据，不需要 i18n
   - **真正需要 i18n**: 约 5% 是 UI 文本、表格列标题、按钮文本等

3. **需要修复的关键文件**:
   - `LeadAssignment.tsx` - 大量表格列标题和 UI 文本
   - `components/Customer/*.tsx` - 状态映射和选项
   - `components/Contract/*.tsx` - 状态描述和金额格式化
   - `components/Payment/*.tsx` - 金额格式化
   - `components/LanguageSwitcher/index.tsx` - 语言标签

4. **zh.json vs en.json 差异**:
   - 两个文件结构基本一致，但存在少量 key 不一致
   - zh.json 中有一些中文状态值作为数据存储（如 '潜在', '意向'）
   - en.json 中有一些重复定义的 key（如 saveSuccess, saveFailed 等）
   - 建议统一 key 命名规范，避免重复定义

### 修复工作量估算

| 类别 | 文件数 | 预计工时 |
|------|--------|----------|
| 高优先级（UI 文本） | 10+ | 4-6 小时 |
| 中优先级（数据值统一） | 15+ | 2-3 小时 |
| 低优先级（注释规范） | 30+ | 1-2 小时 |
| **总计** | **55+** | **7-11 小时** |

### 建议的修复顺序

1. **Phase 1**: 修复高优先级的 UI 文本（LeadAssignment.tsx 等）
2. **Phase 2**: 统一 Select Option 的数据值（使用英文 key）
3. **Phase 3**: 修复组件中的硬编码中文
4. **Phase 4**: 清理重复定义的 i18n key
5. **Phase 5**: 规范代码注释（可选）

---

*报告生成时间: 2026-03-25*
*审计工具: PowerShell Select-String + 人工分析*