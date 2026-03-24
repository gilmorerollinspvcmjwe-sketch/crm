# i18n 翻译审计报告

> 生成时间: 2026-03-24 20:00:24

## 1. 统计概览

| 项目 | 数量 |
|------|------|
| 代码中使用的有效 key 总数 | 2762 |
| en.json 中的 key 总数 | 3029 |
| zh.json 中的 key 总数 | 3029 |
| **代码中使用但 en.json 缺失** | **520** |
| **代码中使用但 zh.json 缺失** | **520** |

## 2. 缺失的翻译 key（按文件分组）

以下是代码中使用了 `t('key')` 但翻译文件中不存在的 key，这就是页面上显示 raw key 的原因。

### `components\CPQ\ProductSelector.tsx`

**英文缺失 (en.json):**
```
common.actions.cancel
product.selector.allCategories
product.selector.category
product.selector.categoryFilter
product.selector.confirm
product.selector.description
product.selector.inStock
product.selector.outOfStock
product.selector.productName
product.selector.searchPlaceholder
product.selector.sku
product.selector.stock
product.selector.title
product.selector.unit
product.selector.unitPrice
```

**中文缺失 (zh.json):**
```
common.actions.cancel
product.selector.allCategories
product.selector.category
product.selector.categoryFilter
product.selector.confirm
product.selector.description
product.selector.inStock
product.selector.outOfStock
product.selector.productName
product.selector.searchPlaceholder
product.selector.sku
product.selector.stock
product.selector.title
product.selector.unit
product.selector.unitPrice
```

### `components\CPQ\QuoteCalculator.tsx`

**英文缺失 (en.json):**
```
common.actions.cancel
common.actions.confirm
quote.calculator.actions
quote.calculator.discount
quote.calculator.grandTotal
quote.calculator.productName
quote.calculator.quantity
quote.calculator.subtotal
quote.calculator.tax
quote.calculator.total
quote.calculator.unitPrice
```

**中文缺失 (zh.json):**
```
common.actions.cancel
common.actions.confirm
quote.calculator.actions
quote.calculator.discount
quote.calculator.grandTotal
quote.calculator.productName
quote.calculator.quantity
quote.calculator.subtotal
quote.calculator.tax
quote.calculator.total
quote.calculator.unitPrice
```

### `components\CPQ\QuotePreview.tsx`

**英文缺失 (en.json):**
```
quote.preview.discount
quote.preview.productName
quote.preview.quantity
quote.preview.subtotal
quote.preview.tax
quote.preview.toBeGenerated
quote.preview.total
quote.preview.unitPrice
```

**中文缺失 (zh.json):**
```
quote.preview.discount
quote.preview.productName
quote.preview.quantity
quote.preview.subtotal
quote.preview.tax
quote.preview.toBeGenerated
quote.preview.total
quote.preview.unitPrice
```

### `components\CustomField\DynamicCustomFields.tsx`

**英文缺失 (en.json):**
```
common.select
```

**中文缺失 (zh.json):**
```
common.select
```

### `components\Customer\ContactTable.tsx`

**英文缺失 (en.json):**
```
contact.jobLevel.executive
contact.jobLevel.junior
contact.jobLevel.middle
contact.jobLevel.other
contact.table.actions
contact.table.confirmDelete
contact.table.createdAt
contact.table.customerName
contact.table.decisionRole
contact.table.delete
contact.table.edit
contact.table.email
contact.table.jobLevel
contact.table.mobile
contact.table.name
contact.table.owner
contact.table.position
contact.table.viewDetail
contact.table.wechat
```

**中文缺失 (zh.json):**
```
contact.jobLevel.executive
contact.jobLevel.junior
contact.jobLevel.middle
contact.jobLevel.other
contact.table.actions
contact.table.confirmDelete
contact.table.createdAt
contact.table.customerName
contact.table.decisionRole
contact.table.delete
contact.table.edit
contact.table.email
contact.table.jobLevel
contact.table.mobile
contact.table.name
contact.table.owner
contact.table.position
contact.table.viewDetail
contact.table.wechat
```

### `components\Payment\PaymentProgress.tsx`

**英文缺失 (en.json):**
```
payment.detail.paidAmount
payment.detail.paymentPeriods
payment.detail.totalAmount
```

**中文缺失 (zh.json):**
```
payment.detail.paidAmount
payment.detail.paymentPeriods
payment.detail.totalAmount
```

### `pages\AIAgents.tsx`

**英文缺失 (en.json):**
```
ai.agents.activeAgents
ai.agents.activeAgentsDesc
ai.agents.agents
ai.agents.allStatuses
ai.agents.avgSuccessRateDesc
ai.agents.count
ai.agents.details
ai.agents.filterStatus
ai.agents.filterType
ai.agents.noMatching
ai.agents.responseTime
ai.agents.satisfaction
ai.agents.statusActive
ai.agents.statusError
ai.agents.statusInactive
ai.agents.statusTraining
ai.agents.successRate
ai.agents.totalAgentsDesc
ai.agents.totalExecutionsDesc
ai.agents.totalMatching
ai.agents.typeAnalytical
ai.agents.typeAutomation
ai.agents.typeConversational
ai.agents.typeGenerative
ai.agents.typePredictive
ai.agents.typeRecommendation
```

**中文缺失 (zh.json):**
```
ai.agents.activeAgents
ai.agents.activeAgentsDesc
ai.agents.agents
ai.agents.allStatuses
ai.agents.avgSuccessRateDesc
ai.agents.count
ai.agents.details
ai.agents.filterStatus
ai.agents.filterType
ai.agents.noMatching
ai.agents.responseTime
ai.agents.satisfaction
ai.agents.statusActive
ai.agents.statusError
ai.agents.statusInactive
ai.agents.statusTraining
ai.agents.successRate
ai.agents.totalAgentsDesc
ai.agents.totalExecutionsDesc
ai.agents.totalMatching
ai.agents.typeAnalytical
ai.agents.typeAutomation
ai.agents.typeConversational
ai.agents.typeGenerative
ai.agents.typePredictive
ai.agents.typeRecommendation
```

### `pages\ActivityList.tsx`

**英文缺失 (en.json):**
```
activity.form.editTitle
```

**中文缺失 (zh.json):**
```
activity.form.editTitle
```

### `pages\ActivityReport.tsx`

**英文缺失 (en.json):**
```
report.activity.completionRate
report.activity.count
report.activity.followUpCount
report.activity.followUpType
report.activity.percentage
report.activity.rank
report.activity.sales
report.timeRange.month
report.timeRange.quarter
report.timeRange.week
report.timeRange.year
```

**中文缺失 (zh.json):**
```
report.activity.completionRate
report.activity.count
report.activity.followUpCount
report.activity.followUpType
report.activity.percentage
report.activity.rank
report.activity.sales
report.timeRange.month
report.timeRange.quarter
report.timeRange.week
report.timeRange.year
```

### `pages\AgentDetail.tsx`

**英文缺失 (en.json):**
```
ai.agentDetail.accuracyCompare
ai.agentDetail.accuracyRate
ai.agentDetail.action
ai.agentDetail.avgResponse
ai.agentDetail.back
ai.agentDetail.capabilityList
ai.agentDetail.confidence
ai.agentDetail.detailMetrics
ai.agentDetail.duration
ai.agentDetail.effectStats
ai.agentDetail.errorCount
ai.agentDetail.executionLogs
ai.agentDetail.executions
ai.agentDetail.failed
ai.agentDetail.input
ai.agentDetail.last7DaysTrend
ai.agentDetail.output
ai.agentDetail.overview
ai.agentDetail.publicScope
ai.agentDetail.satisfaction
ai.agentDetail.seconds
ai.agentDetail.specifiedUsers
ai.agentDetail.status
ai.agentDetail.success
ai.agentDetail.successRate
ai.agentDetail.timeout
ai.agentDetail.times
ai.agentDetail.timestamp
ai.agentDetail.totalExecutions
ai.agentDetail.visibleToAll
ai.agents.statusActive
ai.agents.statusError
ai.agents.statusInactive
ai.agents.statusTraining
ai.agents.typeAnalytical
ai.agents.typeAutomation
ai.agents.typeConversational
ai.agents.typeGenerative
ai.agents.typePredictive
ai.agents.typeRecommendation
```

**中文缺失 (zh.json):**
```
ai.agentDetail.accuracyCompare
ai.agentDetail.accuracyRate
ai.agentDetail.action
ai.agentDetail.avgResponse
ai.agentDetail.back
ai.agentDetail.capabilityList
ai.agentDetail.confidence
ai.agentDetail.detailMetrics
ai.agentDetail.duration
ai.agentDetail.effectStats
ai.agentDetail.errorCount
ai.agentDetail.executionLogs
ai.agentDetail.executions
ai.agentDetail.failed
ai.agentDetail.input
ai.agentDetail.last7DaysTrend
ai.agentDetail.output
ai.agentDetail.overview
ai.agentDetail.publicScope
ai.agentDetail.satisfaction
ai.agentDetail.seconds
ai.agentDetail.specifiedUsers
ai.agentDetail.status
ai.agentDetail.success
ai.agentDetail.successRate
ai.agentDetail.timeout
ai.agentDetail.times
ai.agentDetail.timestamp
ai.agentDetail.totalExecutions
ai.agentDetail.visibleToAll
ai.agents.statusActive
ai.agents.statusError
ai.agents.statusInactive
ai.agents.statusTraining
ai.agents.typeAnalytical
ai.agents.typeAutomation
ai.agents.typeConversational
ai.agents.typeGenerative
ai.agents.typePredictive
ai.agents.typeRecommendation
```

### `pages\CampaignsList.tsx`

**英文缺失 (en.json):**
```
common.comingSoon
common.to
```

**中文缺失 (zh.json):**
```
common.comingSoon
common.to
```

### `pages\ChurnWarning.tsx`

**英文缺失 (en.json):**
```
ai.churnWarning.actions
ai.churnWarning.admin
ai.churnWarning.aiSuggestions
ai.churnWarning.basicInfo
ai.churnWarning.complaintCount
ai.churnWarning.contractExpiry
ai.churnWarning.customerName
ai.churnWarning.daysUnit
ai.churnWarning.details
ai.churnWarning.highRiskCustomers
ai.churnWarning.lastContactDays
ai.churnWarning.markAsProcessed
ai.churnWarning.mediumRiskCustomers
ai.churnWarning.needImmediateAction
ai.churnWarning.none
ai.churnWarning.owner
ai.churnWarning.riskAnalysis
ai.churnWarning.riskFactors
ai.churnWarning.riskHigh
ai.churnWarning.riskLevel
ai.churnWarning.riskLow
ai.churnWarning.riskMedium
ai.churnWarning.riskScore
ai.churnWarning.status
ai.churnWarning.timesUnit
```

**中文缺失 (zh.json):**
```
ai.churnWarning.actions
ai.churnWarning.admin
ai.churnWarning.aiSuggestions
ai.churnWarning.basicInfo
ai.churnWarning.complaintCount
ai.churnWarning.contractExpiry
ai.churnWarning.customerName
ai.churnWarning.daysUnit
ai.churnWarning.details
ai.churnWarning.highRiskCustomers
ai.churnWarning.lastContactDays
ai.churnWarning.markAsProcessed
ai.churnWarning.mediumRiskCustomers
ai.churnWarning.needImmediateAction
ai.churnWarning.none
ai.churnWarning.owner
ai.churnWarning.riskAnalysis
ai.churnWarning.riskFactors
ai.churnWarning.riskHigh
ai.churnWarning.riskLevel
ai.churnWarning.riskLow
ai.churnWarning.riskMedium
ai.churnWarning.riskScore
ai.churnWarning.status
ai.churnWarning.timesUnit
```

### `pages\ContactDetail.tsx`

**英文缺失 (en.json):**
```
common.deleteSuccess
```

**中文缺失 (zh.json):**
```
common.deleteSuccess
```

### `pages\ContactList.tsx`

**英文缺失 (en.json):**
```
contact.filter.customerName
contact.filter.customerNamePlaceholder
contact.filter.name
contact.filter.namePlaceholder
contact.filter.position
contact.filter.positionPlaceholder
contact.form.cancel
contact.form.confirm
contact.form.createTitle
contact.form.customer
contact.form.customerPlaceholder
contact.form.editTitle
contact.form.email
contact.form.emailPlaceholder
contact.form.female
contact.form.gender
contact.form.male
contact.form.mobile
contact.form.mobilePlaceholder
contact.form.name
contact.form.namePlaceholder
contact.form.nameRequired
contact.form.position
contact.form.positionPlaceholder
contact.form.remark
contact.form.remarkPlaceholder
contact.form.wechat
contact.form.wechatPlaceholder
contact.list.confirmDelete
contact.list.confirmDeleteBtn
contact.list.confirmDeleteContent
contact.list.createContact
contact.list.createSuccess
contact.list.deleteSuccess
contact.list.editSuccess
contact.list.loadFailed
contact.list.title
```

**中文缺失 (zh.json):**
```
contact.filter.customerName
contact.filter.customerNamePlaceholder
contact.filter.name
contact.filter.namePlaceholder
contact.filter.position
contact.filter.positionPlaceholder
contact.form.cancel
contact.form.confirm
contact.form.createTitle
contact.form.customer
contact.form.customerPlaceholder
contact.form.editTitle
contact.form.email
contact.form.emailPlaceholder
contact.form.female
contact.form.gender
contact.form.male
contact.form.mobile
contact.form.mobilePlaceholder
contact.form.name
contact.form.namePlaceholder
contact.form.nameRequired
contact.form.position
contact.form.positionPlaceholder
contact.form.remark
contact.form.remarkPlaceholder
contact.form.wechat
contact.form.wechatPlaceholder
contact.list.confirmDelete
contact.list.confirmDeleteBtn
contact.list.confirmDeleteContent
contact.list.createContact
contact.list.createSuccess
contact.list.deleteSuccess
contact.list.editSuccess
contact.list.loadFailed
contact.list.title
```

### `pages\ContractDetail.tsx`

**英文缺失 (en.json):**
```
common.actions.cancel
common.actions.confirm
common.actions.edit
```

**中文缺失 (zh.json):**
```
common.actions.cancel
common.actions.confirm
common.actions.edit
```

### `pages\ContractList.tsx`

**英文缺失 (en.json):**
```
common.actions.cancel
common.actions.confirm
```

**中文缺失 (zh.json):**
```
common.actions.cancel
common.actions.confirm
```

### `pages\CustomerReport.tsx`

**英文缺失 (en.json):**
```
report.customer.customerCount
report.customer.industry
report.customer.level
report.customer.levelSuffix
report.customer.newCustomers
report.customer.newIn12Months
report.customer.percentage
report.customer.totalCustomersChart
```

**中文缺失 (zh.json):**
```
report.customer.customerCount
report.customer.industry
report.customer.level
report.customer.levelSuffix
report.customer.newCustomers
report.customer.newIn12Months
report.customer.percentage
report.customer.totalCustomersChart
```

### `pages\CustomerSegmentation.tsx`

**英文缺失 (en.json):**
```
ai.customerSegmentation.customer
ai.customerSegmentation.customerList
ai.customerSegmentation.customerName
ai.customerSegmentation.customers
ai.customerSegmentation.daysUnit
ai.customerSegmentation.frequencyChart
ai.customerSegmentation.frequencyUnit
ai.customerSegmentation.lastPurchase
ai.customerSegmentation.monetaryChart
ai.customerSegmentation.monetaryUnit
ai.customerSegmentation.owner
ai.customerSegmentation.quantity
ai.customerSegmentation.recencyDays
ai.customerSegmentation.rfmRadar
ai.customerSegmentation.rfmRadarDesc
ai.customerSegmentation.scatterChartDesc
ai.customerSegmentation.segmentFeatures
ai.customerSegmentation.segmentPieChart
ai.customerSegmentation.totalCustomers
ai.customerSegmentation.totalValue
```

**中文缺失 (zh.json):**
```
ai.customerSegmentation.customer
ai.customerSegmentation.customerList
ai.customerSegmentation.customerName
ai.customerSegmentation.customers
ai.customerSegmentation.daysUnit
ai.customerSegmentation.frequencyChart
ai.customerSegmentation.frequencyUnit
ai.customerSegmentation.lastPurchase
ai.customerSegmentation.monetaryChart
ai.customerSegmentation.monetaryUnit
ai.customerSegmentation.owner
ai.customerSegmentation.quantity
ai.customerSegmentation.recencyDays
ai.customerSegmentation.rfmRadar
ai.customerSegmentation.rfmRadarDesc
ai.customerSegmentation.scatterChartDesc
ai.customerSegmentation.segmentFeatures
ai.customerSegmentation.segmentPieChart
ai.customerSegmentation.totalCustomers
ai.customerSegmentation.totalValue
```

### `pages\LeadConversionReport.tsx`

**英文缺失 (en.json):**
```
common.unit.record
report.activity.count
report.activity.percentage
report.leadConversion.channel
report.leadConversion.channelAnalysis
report.leadConversion.conversionCycle
report.leadConversion.convertedChart
report.leadConversion.convertedCount
report.leadConversion.cycleDetails
report.leadConversion.leadCount
report.leadConversion.leadsChart
report.timeRange.month
report.timeRange.quarter
report.timeRange.week
report.timeRange.year
```

**中文缺失 (zh.json):**
```
common.unit.record
report.activity.count
report.activity.percentage
report.leadConversion.channel
report.leadConversion.channelAnalysis
report.leadConversion.conversionCycle
report.leadConversion.convertedChart
report.leadConversion.convertedCount
report.leadConversion.cycleDetails
report.leadConversion.leadCount
report.leadConversion.leadsChart
report.timeRange.month
report.timeRange.quarter
report.timeRange.week
report.timeRange.year
```

### `pages\LeadScoring.tsx`

**英文缺失 (en.json):**
```
ai.leadScoring.actions
ai.leadScoring.activityParticipation
ai.leadScoring.aiScore
ai.leadScoring.attributeScore
ai.leadScoring.attributeScoreTitle
ai.leadScoring.attributeTotal
ai.leadScoring.behaviorScore
ai.leadScoring.behaviorScoreTitle
ai.leadScoring.behaviorTotal
ai.leadScoring.companySize
ai.leadScoring.emailOpen
ai.leadScoring.highValue
ai.leadScoring.industry
ai.leadScoring.industryMatch
ai.leadScoring.lastActivity
ai.leadScoring.leadName
ai.leadScoring.level
ai.leadScoring.levelSuffix
ai.leadScoring.manualAdjustment
ai.leadScoring.owner
ai.leadScoring.points
ai.leadScoring.positionLevel
ai.leadScoring.saveAdjustment
ai.leadScoring.scoreDetails
ai.leadScoring.scoreDimensions
ai.leadScoring.totalScore
ai.leadScoring.websiteVisit
common.actions.cancel
```

**中文缺失 (zh.json):**
```
ai.leadScoring.actions
ai.leadScoring.activityParticipation
ai.leadScoring.aiScore
ai.leadScoring.attributeScore
ai.leadScoring.attributeScoreTitle
ai.leadScoring.attributeTotal
ai.leadScoring.behaviorScore
ai.leadScoring.behaviorScoreTitle
ai.leadScoring.behaviorTotal
ai.leadScoring.companySize
ai.leadScoring.emailOpen
ai.leadScoring.highValue
ai.leadScoring.industry
ai.leadScoring.industryMatch
ai.leadScoring.lastActivity
ai.leadScoring.leadName
ai.leadScoring.level
ai.leadScoring.levelSuffix
ai.leadScoring.manualAdjustment
ai.leadScoring.owner
ai.leadScoring.points
ai.leadScoring.positionLevel
ai.leadScoring.saveAdjustment
ai.leadScoring.scoreDetails
ai.leadScoring.scoreDimensions
ai.leadScoring.totalScore
ai.leadScoring.websiteVisit
common.actions.cancel
```

### `pages\MeetingAssistant.tsx`

**英文缺失 (en.json):**
```
ai.meetingAssistant.actionItems
ai.meetingAssistant.aiSummary
ai.meetingAssistant.assignee
ai.meetingAssistant.completed
ai.meetingAssistant.date
ai.meetingAssistant.dueDate
ai.meetingAssistant.duration
ai.meetingAssistant.exportNotes
ai.meetingAssistant.host
ai.meetingAssistant.keywords
ai.meetingAssistant.meetingDate
ai.meetingAssistant.meetingDetails
ai.meetingAssistant.meetingInfo
ai.meetingAssistant.meetingTime
ai.meetingAssistant.none
ai.meetingAssistant.participants
ai.meetingAssistant.participantsCount
ai.meetingAssistant.pending
ai.meetingAssistant.people
ai.meetingAssistant.priority
ai.meetingAssistant.priorityHigh
ai.meetingAssistant.priorityLow
ai.meetingAssistant.priorityMedium
ai.meetingAssistant.sentiment
ai.meetingAssistant.sentimentNegative
ai.meetingAssistant.sentimentNeutral
ai.meetingAssistant.sentimentPositive
ai.meetingAssistant.time
ai.meetingAssistant.todos
ai.meetingAssistant.transcript
ai.meetingAssistant.unassigned
```

**中文缺失 (zh.json):**
```
ai.meetingAssistant.actionItems
ai.meetingAssistant.aiSummary
ai.meetingAssistant.assignee
ai.meetingAssistant.completed
ai.meetingAssistant.date
ai.meetingAssistant.dueDate
ai.meetingAssistant.duration
ai.meetingAssistant.exportNotes
ai.meetingAssistant.host
ai.meetingAssistant.keywords
ai.meetingAssistant.meetingDate
ai.meetingAssistant.meetingDetails
ai.meetingAssistant.meetingInfo
ai.meetingAssistant.meetingTime
ai.meetingAssistant.none
ai.meetingAssistant.participants
ai.meetingAssistant.participantsCount
ai.meetingAssistant.pending
ai.meetingAssistant.people
ai.meetingAssistant.priority
ai.meetingAssistant.priorityHigh
ai.meetingAssistant.priorityLow
ai.meetingAssistant.priorityMedium
ai.meetingAssistant.sentiment
ai.meetingAssistant.sentimentNegative
ai.meetingAssistant.sentimentNeutral
ai.meetingAssistant.sentimentPositive
ai.meetingAssistant.time
ai.meetingAssistant.todos
ai.meetingAssistant.transcript
ai.meetingAssistant.unassigned
```

### `pages\OpportunityDetail.tsx`

**英文缺失 (en.json):**
```
common.deleteSuccess
opportunity.detail.contacts
opportunity.detail.contracts
opportunity.detail.createQuote
opportunity.detail.detailInfo
opportunity.detail.markLost
opportunity.detail.markLostContent
opportunity.detail.markWon
opportunity.detail.markWonContent
opportunity.detail.noFollowUpRecords
opportunity.detail.products
opportunity.detail.quickChange
opportunity.detail.quotes
opportunity.detail.relatedCustomer
opportunity.detail.selectStage
opportunity.detail.stageChanged
```

**中文缺失 (zh.json):**
```
common.deleteSuccess
opportunity.detail.contacts
opportunity.detail.contracts
opportunity.detail.createQuote
opportunity.detail.detailInfo
opportunity.detail.markLost
opportunity.detail.markLostContent
opportunity.detail.markWon
opportunity.detail.markWonContent
opportunity.detail.noFollowUpRecords
opportunity.detail.products
opportunity.detail.quickChange
opportunity.detail.quotes
opportunity.detail.relatedCustomer
opportunity.detail.selectStage
opportunity.detail.stageChanged
```

### `pages\OrderDetail.tsx`

**英文缺失 (en.json):**
```
common.deleteSuccess
order.changeStatus
order.createdAt
order.deleteContent
```

**中文缺失 (zh.json):**
```
common.deleteSuccess
order.changeStatus
order.createdAt
order.deleteContent
```

### `pages\OrderList.tsx`

**英文缺失 (en.json):**
```
common.deleteSuccess
```

**中文缺失 (zh.json):**
```
common.deleteSuccess
```

### `pages\PaymentDetail.tsx`

**英文缺失 (en.json):**
```
common.actions.cancel
common.actions.confirm
common.actions.edit
```

**中文缺失 (zh.json):**
```
common.actions.cancel
common.actions.confirm
common.actions.edit
```

### `pages\PaymentList.tsx`

**英文缺失 (en.json):**
```
common.actions.cancel
common.actions.confirm
```

**中文缺失 (zh.json):**
```
common.actions.cancel
common.actions.confirm
```

### `pages\PaymentReport.tsx`

**英文缺失 (en.json):**
```
report.activity.percentage
report.payment.actualCollection
report.payment.aging
report.payment.amount
report.payment.attentionDays
report.payment.customer
report.payment.normalDays
report.payment.plannedCollection
report.payment.receivableAmount
report.payment.riskCritical
report.payment.riskDays
report.payment.riskHigh
report.payment.riskLevel
report.payment.riskLow
report.payment.riskMedium
report.payment.status
report.payment.statusNormal
report.payment.statusOverdue
report.payment.statusWarning
report.performance.rank
report.timeRange.month
report.timeRange.quarter
report.timeRange.week
report.timeRange.year
```

**中文缺失 (zh.json):**
```
report.activity.percentage
report.payment.actualCollection
report.payment.aging
report.payment.amount
report.payment.attentionDays
report.payment.customer
report.payment.normalDays
report.payment.plannedCollection
report.payment.receivableAmount
report.payment.riskCritical
report.payment.riskDays
report.payment.riskHigh
report.payment.riskLevel
report.payment.riskLow
report.payment.riskMedium
report.payment.status
report.payment.statusNormal
report.payment.statusOverdue
report.payment.statusWarning
report.performance.rank
report.timeRange.month
report.timeRange.quarter
report.timeRange.week
report.timeRange.year
```

### `pages\PerformanceReport.tsx`

**英文缺失 (en.json):**
```
report.performance.actual
report.performance.actualChart
report.performance.completionRate
report.performance.rank
report.performance.sales
report.performance.target
report.performance.targetChart
report.performance.team
report.timeRange.month
report.timeRange.quarter
report.timeRange.year
```

**中文缺失 (zh.json):**
```
report.performance.actual
report.performance.actualChart
report.performance.completionRate
report.performance.rank
report.performance.sales
report.performance.target
report.performance.targetChart
report.performance.team
report.timeRange.month
report.timeRange.quarter
report.timeRange.year
```

### `pages\PredictiveAI.tsx`

**英文缺失 (en.json):**
```
ai.predictiveAI.accuracy
ai.predictiveAI.actual
ai.predictiveAI.avgAccuracyDesc
ai.predictiveAI.confidence
ai.predictiveAI.correctPredictionsDesc
ai.predictiveAI.last12Months
ai.predictiveAI.last6Months
ai.predictiveAI.meanAbsoluteError
ai.predictiveAI.modelCount
ai.predictiveAI.modelCountDesc
ai.predictiveAI.models
ai.predictiveAI.predicted
ai.predictiveAI.predictionMetric
ai.predictiveAI.rootMeanSquareError
ai.predictiveAI.salesTrend
ai.predictiveAI.totalPredictionsDesc
```

**中文缺失 (zh.json):**
```
ai.predictiveAI.accuracy
ai.predictiveAI.actual
ai.predictiveAI.avgAccuracyDesc
ai.predictiveAI.confidence
ai.predictiveAI.correctPredictionsDesc
ai.predictiveAI.last12Months
ai.predictiveAI.last6Months
ai.predictiveAI.meanAbsoluteError
ai.predictiveAI.modelCount
ai.predictiveAI.modelCountDesc
ai.predictiveAI.models
ai.predictiveAI.predicted
ai.predictiveAI.predictionMetric
ai.predictiveAI.rootMeanSquareError
ai.predictiveAI.salesTrend
ai.predictiveAI.totalPredictionsDesc
```

### `pages\QuoteDetail.tsx`

**英文缺失 (en.json):**
```
common.actions.cancel
```

**中文缺失 (zh.json):**
```
common.actions.cancel
```

### `pages\QuotesList.tsx`

**英文缺失 (en.json):**
```
common.actions.cancel
common.actions.confirm
common.actions.confirmDelete
common.actions.reset
common.actions.search
```

**中文缺失 (zh.json):**
```
common.actions.cancel
common.actions.confirm
common.actions.confirmDelete
common.actions.reset
common.actions.search
```

### `pages\SalesForecast.tsx`

**英文缺失 (en.json):**
```
ai.salesForecast.exceeded
ai.salesForecast.monthly
ai.salesForecast.predicted
ai.salesForecast.predictedAmount
ai.salesForecast.predictionAccuracy
ai.salesForecast.product
ai.salesForecast.quarterly
ai.salesForecast.thisMonthPrediction
ai.salesForecast.trend
ai.salesForecast.trendDown
ai.salesForecast.trendStable
ai.salesForecast.trendUp
ai.salesForecast.vsLastPeriod
ai.salesForecast.yearly
```

**中文缺失 (zh.json):**
```
ai.salesForecast.exceeded
ai.salesForecast.monthly
ai.salesForecast.predicted
ai.salesForecast.predictedAmount
ai.salesForecast.predictionAccuracy
ai.salesForecast.product
ai.salesForecast.quarterly
ai.salesForecast.thisMonthPrediction
ai.salesForecast.trend
ai.salesForecast.trendDown
ai.salesForecast.trendStable
ai.salesForecast.trendUp
ai.salesForecast.vsLastPeriod
ai.salesForecast.yearly
```

### `pages\pricebooks\PricebookDetail.tsx`

**英文缺失 (en.json):**
```
pricebook.detail.allCustomers
pricebook.detail.back
pricebook.detail.basicInfo
pricebook.detail.columnBasePrice
pricebook.detail.columnEffectiveDate
pricebook.detail.columnProductName
pricebook.detail.columnProductSku
pricebook.detail.columnTiers
pricebook.detail.currency
pricebook.detail.customer
pricebook.detail.description
pricebook.detail.edit
pricebook.detail.loadFailed
pricebook.detail.none
pricebook.detail.notExist
pricebook.detail.priceItems
pricebook.detail.pricebookName
pricebook.detail.status
pricebook.detail.type
pricebook.detail.validPeriod
pricebook.list.longTerm
```

**中文缺失 (zh.json):**
```
pricebook.detail.allCustomers
pricebook.detail.back
pricebook.detail.basicInfo
pricebook.detail.columnBasePrice
pricebook.detail.columnEffectiveDate
pricebook.detail.columnProductName
pricebook.detail.columnProductSku
pricebook.detail.columnTiers
pricebook.detail.currency
pricebook.detail.customer
pricebook.detail.description
pricebook.detail.edit
pricebook.detail.loadFailed
pricebook.detail.none
pricebook.detail.notExist
pricebook.detail.priceItems
pricebook.detail.pricebookName
pricebook.detail.status
pricebook.detail.type
pricebook.detail.validPeriod
pricebook.list.longTerm
```

### `pages\pricebooks\PricebookList.tsx`

**英文缺失 (en.json):**
```
pricebook.detail.validPeriod
pricebook.entryForm.operationFailed
pricebook.entryForm.productAdded
pricebook.list.addProduct
pricebook.list.columnCustomer
pricebook.list.columnItemCount
pricebook.list.columnName
pricebook.list.columnStatus
pricebook.list.columnType
pricebook.list.columnValidPeriod
pricebook.list.customerPricebook
pricebook.list.delete
pricebook.list.deleteConfirm
pricebook.list.deleteFailed
pricebook.list.deleteSuccess
pricebook.list.edit
pricebook.list.loadFailed
pricebook.list.longTerm
pricebook.list.newPricebook
pricebook.list.partnerPricebook
pricebook.list.promotionPricebook
pricebook.list.searchPlaceholder
pricebook.list.standardPricebook
pricebook.list.statusActive
pricebook.list.statusDraft
pricebook.list.statusFilter
pricebook.list.statusInactive
pricebook.list.typeFilter
```

**中文缺失 (zh.json):**
```
pricebook.detail.validPeriod
pricebook.entryForm.operationFailed
pricebook.entryForm.productAdded
pricebook.list.addProduct
pricebook.list.columnCustomer
pricebook.list.columnItemCount
pricebook.list.columnName
pricebook.list.columnStatus
pricebook.list.columnType
pricebook.list.columnValidPeriod
pricebook.list.customerPricebook
pricebook.list.delete
pricebook.list.deleteConfirm
pricebook.list.deleteFailed
pricebook.list.deleteSuccess
pricebook.list.edit
pricebook.list.loadFailed
pricebook.list.longTerm
pricebook.list.newPricebook
pricebook.list.partnerPricebook
pricebook.list.promotionPricebook
pricebook.list.searchPlaceholder
pricebook.list.standardPricebook
pricebook.list.statusActive
pricebook.list.statusDraft
pricebook.list.statusFilter
pricebook.list.statusInactive
pricebook.list.typeFilter
```

### `pages\products\ProductDetail.tsx`

**英文缺失 (en.json):**
```
product.detail.back
product.detail.basicInfo
product.detail.createdAt
product.detail.description
product.detail.edit
product.detail.loadFailed
product.detail.notExist
product.detail.productCategory
product.detail.productName
product.detail.productNumber
product.detail.specs
product.detail.stockStatus
product.detail.unit
product.detail.unitPrice
product.detail.updatedAt
product.list.inStock
product.list.outOfStock
```

**中文缺失 (zh.json):**
```
product.detail.back
product.detail.basicInfo
product.detail.createdAt
product.detail.description
product.detail.edit
product.detail.loadFailed
product.detail.notExist
product.detail.productCategory
product.detail.productName
product.detail.productNumber
product.detail.specs
product.detail.stockStatus
product.detail.unit
product.detail.unitPrice
product.detail.updatedAt
product.list.inStock
product.list.outOfStock
```

### `pages\products\ProductList.tsx`

**英文缺失 (en.json):**
```
product.list.categoryFilter
product.list.columnCategory
product.list.columnCostPrice
product.list.columnModel
product.list.columnName
product.list.columnSku
product.list.columnSpec
product.list.columnStatus
product.list.columnStock
product.list.columnUnitPrice
product.list.delete
product.list.deleteConfirm
product.list.deleteFailed
product.list.deleteSuccess
product.list.edit
product.list.import
product.list.inStock
product.list.loadFailed
product.list.newProduct
product.list.outOfStock
product.list.searchPlaceholder
product.list.statusActive
product.list.statusInactive
```

**中文缺失 (zh.json):**
```
product.list.categoryFilter
product.list.columnCategory
product.list.columnCostPrice
product.list.columnModel
product.list.columnName
product.list.columnSku
product.list.columnSpec
product.list.columnStatus
product.list.columnStock
product.list.columnUnitPrice
product.list.delete
product.list.deleteConfirm
product.list.deleteFailed
product.list.deleteSuccess
product.list.edit
product.list.import
product.list.inStock
product.list.loadFailed
product.list.newProduct
product.list.outOfStock
product.list.searchPlaceholder
product.list.statusActive
product.list.statusInactive
```

### `pages\quotes\QuoteBuilder.tsx`

**英文缺失 (en.json):**
```
quote.builder.customerInfo
quote.builder.edit
quote.builder.mockDataNote
quote.builder.new
quote.builder.noContact
quote.builder.noCustomer
quote.builder.notSet
quote.builder.pdfExporting
quote.builder.selectProduct
quote.builder.step1Desc
quote.builder.step1Title
quote.builder.step2Desc
quote.builder.step2Title
quote.builder.step3Desc
quote.builder.step3Title
```

**中文缺失 (zh.json):**
```
quote.builder.customerInfo
quote.builder.edit
quote.builder.mockDataNote
quote.builder.new
quote.builder.noContact
quote.builder.noCustomer
quote.builder.notSet
quote.builder.pdfExporting
quote.builder.selectProduct
quote.builder.step1Desc
quote.builder.step1Title
quote.builder.step2Desc
quote.builder.step2Title
quote.builder.step3Desc
quote.builder.step3Title
```

### `pages\settings\ObjectConfig.tsx`

**英文缺失 (en.json):**
```
tab
```

**中文缺失 (zh.json):**
```
tab
```

### `pages\settings\PipelineManager.tsx`

**英文缺失 (en.json):**
```
common.copy
common.createSuccess
common.deleteSuccess
common.updateSuccess
```

**中文缺失 (zh.json):**
```
common.copy
common.createSuccess
common.deleteSuccess
common.updateSuccess
```

### `pages\settings\ViewManager.tsx`

**英文缺失 (en.json):**
```
common.deleteSuccess
permission.roles.administrator
viewManager.managerRole
viewManager.salesRole
viewManager.supportRole
```

**中文缺失 (zh.json):**
```
common.deleteSuccess
permission.roles.administrator
viewManager.managerRole
viewManager.salesRole
viewManager.supportRole
```

### `pages\tickets\TicketList.tsx`

**英文缺失 (en.json):**
```
common.description
common.none
```

**中文缺失 (zh.json):**
```
common.description
common.none
```

### `pages\workbench\components\AIAssistant.tsx`

**英文缺失 (en.json):**
```
workbench.ai.createContract
workbench.ai.createContractResponse
workbench.ai.createCustomer
workbench.ai.createCustomerResponse
workbench.ai.createOpportunity
workbench.ai.createOpportunityResponse
workbench.ai.inputPlaceholder
workbench.ai.monthlyPerformance
workbench.ai.monthlyPerformanceResponse
workbench.ai.notUnderstood
workbench.ai.performanceShown
workbench.ai.quickCommands
workbench.ai.send
workbench.ai.title
workbench.ai.todoShown
workbench.ai.typing
workbench.ai.viewTodo
workbench.ai.viewTodoResponse
workbench.ai.welcome
```

**中文缺失 (zh.json):**
```
workbench.ai.createContract
workbench.ai.createContractResponse
workbench.ai.createCustomer
workbench.ai.createCustomerResponse
workbench.ai.createOpportunity
workbench.ai.createOpportunityResponse
workbench.ai.inputPlaceholder
workbench.ai.monthlyPerformance
workbench.ai.monthlyPerformanceResponse
workbench.ai.notUnderstood
workbench.ai.performanceShown
workbench.ai.quickCommands
workbench.ai.send
workbench.ai.title
workbench.ai.todoShown
workbench.ai.typing
workbench.ai.viewTodo
workbench.ai.viewTodoResponse
workbench.ai.welcome
```

### `pages\workbench\components\CreateModal.tsx`

**英文缺失 (en.json):**
```
workbench.create.contract
workbench.create.contractAmount
workbench.create.contractName
workbench.create.customer
workbench.create.customerName
workbench.create.customerType
workbench.create.enterAmount
workbench.create.enterPhone
workbench.create.enterpriseCustomer
workbench.create.expectedAmount
workbench.create.governmentCustomer
workbench.create.individualCustomer
workbench.create.invalidPhone
workbench.create.opportunity
workbench.create.opportunityName
workbench.create.opportunityStage
workbench.create.phone
workbench.create.selectCustomer
workbench.create.selectCustomerType
workbench.create.selectSignDate
workbench.create.selectStage
workbench.create.signDate
workbench.create.stageClosed
workbench.create.stageLead
workbench.create.stageNegotiation
workbench.create.stageProposal
workbench.create.stageQualify
workbench.create.validationFailed
```

**中文缺失 (zh.json):**
```
workbench.create.contract
workbench.create.contractAmount
workbench.create.contractName
workbench.create.customer
workbench.create.customerName
workbench.create.customerType
workbench.create.enterAmount
workbench.create.enterPhone
workbench.create.enterpriseCustomer
workbench.create.expectedAmount
workbench.create.governmentCustomer
workbench.create.individualCustomer
workbench.create.invalidPhone
workbench.create.opportunity
workbench.create.opportunityName
workbench.create.opportunityStage
workbench.create.phone
workbench.create.selectCustomer
workbench.create.selectCustomerType
workbench.create.selectSignDate
workbench.create.selectStage
workbench.create.signDate
workbench.create.stageClosed
workbench.create.stageLead
workbench.create.stageNegotiation
workbench.create.stageProposal
workbench.create.stageQualify
workbench.create.validationFailed
```

### `pages\workbench\components\TodayTodo.tsx`

**英文缺失 (en.json):**
```
workbench.todo.call
```

**中文缺失 (zh.json):**
```
workbench.todo.call
```

## 3. 中英文不一致的 key

✅ 中英文翻译 key 完全一致

## 4. 仍有硬编码中文的文件

（包含中文字符但未使用 useTranslation 的 .tsx 文件）

| 文件 | 中文字符串数量 |
|------|----------------|
| `routes\index.tsx` | 29 |
| `components\Skeleton\index.tsx` | 19 |
| `components\MetricCard\index.tsx` | 13 |
| `components\CollapseSection\index.tsx` | 12 |
| `components\Settings\SettingsLayout.tsx` | 6 |
| `main.tsx` | 1 |

## 5. 待添加的翻译 key 列表（可直接复制到 JSON 文件）

### 需要添加到 en.json

```json
  "activity.form.editTitle": "Edittitle",
  "ai.agentDetail.accuracyCompare": "Accuracycompare",
  "ai.agentDetail.accuracyRate": "Accuracyrate",
  "ai.agentDetail.action": "Action",
  "ai.agentDetail.avgResponse": "Avgresponse",
  "ai.agentDetail.back": "Back",
  "ai.agentDetail.capabilityList": "Capabilitylist",
  "ai.agentDetail.confidence": "Confidence",
  "ai.agentDetail.detailMetrics": "Detailmetrics",
  "ai.agentDetail.duration": "Duration",
  "ai.agentDetail.effectStats": "Effectstats",
  "ai.agentDetail.errorCount": "Errorcount",
  "ai.agentDetail.executionLogs": "Executionlogs",
  "ai.agentDetail.executions": "Executions",
  "ai.agentDetail.failed": "Failed",
  "ai.agentDetail.input": "Input",
  "ai.agentDetail.last7DaysTrend": "Last7Daystrend",
  "ai.agentDetail.output": "Output",
  "ai.agentDetail.overview": "Overview",
  "ai.agentDetail.publicScope": "Publicscope",
  "ai.agentDetail.satisfaction": "Satisfaction",
  "ai.agentDetail.seconds": "Seconds",
  "ai.agentDetail.specifiedUsers": "Specifiedusers",
  "ai.agentDetail.status": "Status",
  "ai.agentDetail.success": "Success",
  "ai.agentDetail.successRate": "Successrate",
  "ai.agentDetail.timeout": "Timeout",
  "ai.agentDetail.times": "Times",
  "ai.agentDetail.timestamp": "Timestamp",
  "ai.agentDetail.totalExecutions": "Totalexecutions",
  "ai.agentDetail.visibleToAll": "Visibletoall",
  "ai.agents.activeAgents": "Activeagents",
  "ai.agents.activeAgentsDesc": "Activeagentsdesc",
  "ai.agents.agents": "Agents",
  "ai.agents.allStatuses": "Allstatuses",
  "ai.agents.avgSuccessRateDesc": "Avgsuccessratedesc",
  "ai.agents.count": "Count",
  "ai.agents.details": "Details",
  "ai.agents.filterStatus": "Filterstatus",
  "ai.agents.filterType": "Filtertype",
  "ai.agents.noMatching": "Nomatching",
  "ai.agents.responseTime": "Responsetime",
  "ai.agents.satisfaction": "Satisfaction",
  "ai.agents.statusActive": "Statusactive",
  "ai.agents.statusError": "Statuserror",
  "ai.agents.statusInactive": "Statusinactive",
  "ai.agents.statusTraining": "Statustraining",
  "ai.agents.successRate": "Successrate",
  "ai.agents.totalAgentsDesc": "Totalagentsdesc",
  "ai.agents.totalExecutionsDesc": "Totalexecutionsdesc",
  "ai.agents.totalMatching": "Totalmatching",
  "ai.agents.typeAnalytical": "Typeanalytical",
  "ai.agents.typeAutomation": "Typeautomation",
  "ai.agents.typeConversational": "Typeconversational",
  "ai.agents.typeGenerative": "Typegenerative",
  "ai.agents.typePredictive": "Typepredictive",
  "ai.agents.typeRecommendation": "Typerecommendation",
  "ai.churnWarning.actions": "Actions",
  "ai.churnWarning.admin": "Admin",
  "ai.churnWarning.aiSuggestions": "Aisuggestions",
  "ai.churnWarning.basicInfo": "Basicinfo",
  "ai.churnWarning.complaintCount": "Complaintcount",
  "ai.churnWarning.contractExpiry": "Contractexpiry",
  "ai.churnWarning.customerName": "Customername",
  "ai.churnWarning.daysUnit": "Daysunit",
  "ai.churnWarning.details": "Details",
  "ai.churnWarning.highRiskCustomers": "Highriskcustomers",
  "ai.churnWarning.lastContactDays": "Lastcontactdays",
  "ai.churnWarning.markAsProcessed": "Markasprocessed",
  "ai.churnWarning.mediumRiskCustomers": "Mediumriskcustomers",
  "ai.churnWarning.needImmediateAction": "Needimmediateaction",
  "ai.churnWarning.none": "None",
  "ai.churnWarning.owner": "Owner",
  "ai.churnWarning.riskAnalysis": "Riskanalysis",
  "ai.churnWarning.riskFactors": "Riskfactors",
  "ai.churnWarning.riskHigh": "Riskhigh",
  "ai.churnWarning.riskLevel": "Risklevel",
  "ai.churnWarning.riskLow": "Risklow",
  "ai.churnWarning.riskMedium": "Riskmedium",
  "ai.churnWarning.riskScore": "Riskscore",
  "ai.churnWarning.status": "Status",
  "ai.churnWarning.timesUnit": "Timesunit",
  "ai.customerSegmentation.customer": "Customer",
  "ai.customerSegmentation.customerList": "Customerlist",
  "ai.customerSegmentation.customerName": "Customername",
  "ai.customerSegmentation.customers": "Customers",
  "ai.customerSegmentation.daysUnit": "Daysunit",
  "ai.customerSegmentation.frequencyChart": "Frequencychart",
  "ai.customerSegmentation.frequencyUnit": "Frequencyunit",
  "ai.customerSegmentation.lastPurchase": "Lastpurchase",
  "ai.customerSegmentation.monetaryChart": "Monetarychart",
  "ai.customerSegmentation.monetaryUnit": "Monetaryunit",
  "ai.customerSegmentation.owner": "Owner",
  "ai.customerSegmentation.quantity": "Quantity",
  "ai.customerSegmentation.recencyDays": "Recencydays",
  "ai.customerSegmentation.rfmRadar": "Rfmradar",
  "ai.customerSegmentation.rfmRadarDesc": "Rfmradardesc",
  "ai.customerSegmentation.scatterChartDesc": "Scatterchartdesc",
  "ai.customerSegmentation.segmentFeatures": "Segmentfeatures",
  "ai.customerSegmentation.segmentPieChart": "Segmentpiechart",
  "ai.customerSegmentation.totalCustomers": "Totalcustomers",
  "ai.customerSegmentation.totalValue": "Totalvalue",
  "ai.leadScoring.actions": "Actions",
  "ai.leadScoring.activityParticipation": "Activityparticipation",
  "ai.leadScoring.aiScore": "Aiscore",
  "ai.leadScoring.attributeScore": "Attributescore",
  "ai.leadScoring.attributeScoreTitle": "Attributescoretitle",
  "ai.leadScoring.attributeTotal": "Attributetotal",
  "ai.leadScoring.behaviorScore": "Behaviorscore",
  "ai.leadScoring.behaviorScoreTitle": "Behaviorscoretitle",
  "ai.leadScoring.behaviorTotal": "Behaviortotal",
  "ai.leadScoring.companySize": "Companysize",
  "ai.leadScoring.emailOpen": "Emailopen",
  "ai.leadScoring.highValue": "Highvalue",
  "ai.leadScoring.industry": "Industry",
  "ai.leadScoring.industryMatch": "Industrymatch",
  "ai.leadScoring.lastActivity": "Lastactivity",
  "ai.leadScoring.leadName": "Leadname",
  "ai.leadScoring.level": "Level",
  "ai.leadScoring.levelSuffix": "Levelsuffix",
  "ai.leadScoring.manualAdjustment": "Manualadjustment",
  "ai.leadScoring.owner": "Owner",
  "ai.leadScoring.points": "Points",
  "ai.leadScoring.positionLevel": "Positionlevel",
  "ai.leadScoring.saveAdjustment": "Saveadjustment",
  "ai.leadScoring.scoreDetails": "Scoredetails",
  "ai.leadScoring.scoreDimensions": "Scoredimensions",
  "ai.leadScoring.totalScore": "Totalscore",
  "ai.leadScoring.websiteVisit": "Websitevisit",
  "ai.meetingAssistant.actionItems": "Actionitems",
  "ai.meetingAssistant.aiSummary": "Aisummary",
  "ai.meetingAssistant.assignee": "Assignee",
  "ai.meetingAssistant.completed": "Completed",
  "ai.meetingAssistant.date": "Date",
  "ai.meetingAssistant.dueDate": "Duedate",
  "ai.meetingAssistant.duration": "Duration",
  "ai.meetingAssistant.exportNotes": "Exportnotes",
  "ai.meetingAssistant.host": "Host",
  "ai.meetingAssistant.keywords": "Keywords",
  "ai.meetingAssistant.meetingDate": "Meetingdate",
  "ai.meetingAssistant.meetingDetails": "Meetingdetails",
  "ai.meetingAssistant.meetingInfo": "Meetinginfo",
  "ai.meetingAssistant.meetingTime": "Meetingtime",
  "ai.meetingAssistant.none": "None",
  "ai.meetingAssistant.participants": "Participants",
  "ai.meetingAssistant.participantsCount": "Participantscount",
  "ai.meetingAssistant.pending": "Pending",
  "ai.meetingAssistant.people": "People",
  "ai.meetingAssistant.priority": "Priority",
  "ai.meetingAssistant.priorityHigh": "Priorityhigh",
  "ai.meetingAssistant.priorityLow": "Prioritylow",
  "ai.meetingAssistant.priorityMedium": "Prioritymedium",
  "ai.meetingAssistant.sentiment": "Sentiment",
  "ai.meetingAssistant.sentimentNegative": "Sentimentnegative",
  "ai.meetingAssistant.sentimentNeutral": "Sentimentneutral",
  "ai.meetingAssistant.sentimentPositive": "Sentimentpositive",
  "ai.meetingAssistant.time": "Time",
  "ai.meetingAssistant.todos": "Todos",
  "ai.meetingAssistant.transcript": "Transcript",
  "ai.meetingAssistant.unassigned": "Unassigned",
  "ai.predictiveAI.accuracy": "Accuracy",
  "ai.predictiveAI.actual": "Actual",
  "ai.predictiveAI.avgAccuracyDesc": "Avgaccuracydesc",
  "ai.predictiveAI.confidence": "Confidence",
  "ai.predictiveAI.correctPredictionsDesc": "Correctpredictionsdesc",
  "ai.predictiveAI.last12Months": "Last12Months",
  "ai.predictiveAI.last6Months": "Last6Months",
  "ai.predictiveAI.meanAbsoluteError": "Meanabsoluteerror",
  "ai.predictiveAI.modelCount": "Modelcount",
  "ai.predictiveAI.modelCountDesc": "Modelcountdesc",
  "ai.predictiveAI.models": "Models",
  "ai.predictiveAI.predicted": "Predicted",
  "ai.predictiveAI.predictionMetric": "Predictionmetric",
  "ai.predictiveAI.rootMeanSquareError": "Rootmeansquareerror",
  "ai.predictiveAI.salesTrend": "Salestrend",
  "ai.predictiveAI.totalPredictionsDesc": "Totalpredictionsdesc",
  "ai.salesForecast.exceeded": "Exceeded",
  "ai.salesForecast.monthly": "Monthly",
  "ai.salesForecast.predicted": "Predicted",
  "ai.salesForecast.predictedAmount": "Predictedamount",
  "ai.salesForecast.predictionAccuracy": "Predictionaccuracy",
  "ai.salesForecast.product": "Product",
  "ai.salesForecast.quarterly": "Quarterly",
  "ai.salesForecast.thisMonthPrediction": "Thismonthprediction",
  "ai.salesForecast.trend": "Trend",
  "ai.salesForecast.trendDown": "Trenddown",
  "ai.salesForecast.trendStable": "Trendstable",
  "ai.salesForecast.trendUp": "Trendup",
  "ai.salesForecast.vsLastPeriod": "Vslastperiod",
  "ai.salesForecast.yearly": "Yearly",
  "common.actions.cancel": "Cancel",
  "common.actions.confirm": "Confirm",
  "common.actions.confirmDelete": "Confirmdelete",
  "common.actions.edit": "Edit",
  "common.actions.reset": "Reset",
  "common.actions.search": "Search",
  "common.comingSoon": "Comingsoon",
  "common.copy": "Copy",
  "common.createSuccess": "Createsuccess",
  "common.deleteSuccess": "Deletesuccess",
  "common.description": "Description",
  "common.none": "None",
  "common.select": "Select",
  "common.to": "To",
  "common.unit.record": "Record",
  "common.updateSuccess": "Updatesuccess",
  "contact.filter.customerName": "Customername",
  "contact.filter.customerNamePlaceholder": "Customernameplaceholder",
  "contact.filter.name": "Name",
  "contact.filter.namePlaceholder": "Nameplaceholder",
  "contact.filter.position": "Position",
  "contact.filter.positionPlaceholder": "Positionplaceholder",
  "contact.form.cancel": "Cancel",
  "contact.form.confirm": "Confirm",
  "contact.form.createTitle": "Createtitle",
  "contact.form.customer": "Customer",
  "contact.form.customerPlaceholder": "Customerplaceholder",
  "contact.form.editTitle": "Edittitle",
  "contact.form.email": "Email",
  "contact.form.emailPlaceholder": "Emailplaceholder",
  "contact.form.female": "Female",
  "contact.form.gender": "Gender",
  "contact.form.male": "Male",
  "contact.form.mobile": "Mobile",
  "contact.form.mobilePlaceholder": "Mobileplaceholder",
  "contact.form.name": "Name",
  "contact.form.namePlaceholder": "Nameplaceholder",
  "contact.form.nameRequired": "Namerequired",
  "contact.form.position": "Position",
  "contact.form.positionPlaceholder": "Positionplaceholder",
  "contact.form.remark": "Remark",
  "contact.form.remarkPlaceholder": "Remarkplaceholder",
  "contact.form.wechat": "Wechat",
  "contact.form.wechatPlaceholder": "Wechatplaceholder",
  "contact.jobLevel.executive": "Executive",
  "contact.jobLevel.junior": "Junior",
  "contact.jobLevel.middle": "Middle",
  "contact.jobLevel.other": "Other",
  "contact.list.confirmDelete": "Confirmdelete",
  "contact.list.confirmDeleteBtn": "Confirmdeletebtn",
  "contact.list.confirmDeleteContent": "Confirmdeletecontent",
  "contact.list.createContact": "Createcontact",
  "contact.list.createSuccess": "Createsuccess",
  "contact.list.deleteSuccess": "Deletesuccess",
  "contact.list.editSuccess": "Editsuccess",
  "contact.list.loadFailed": "Loadfailed",
  "contact.list.title": "Title",
  "contact.table.actions": "Actions",
  "contact.table.confirmDelete": "Confirmdelete",
  "contact.table.createdAt": "Createdat",
  "contact.table.customerName": "Customername",
  "contact.table.decisionRole": "Decisionrole",
  "contact.table.delete": "Delete",
  "contact.table.edit": "Edit",
  "contact.table.email": "Email",
  "contact.table.jobLevel": "Joblevel",
  "contact.table.mobile": "Mobile",
  "contact.table.name": "Name",
  "contact.table.owner": "Owner",
  "contact.table.position": "Position",
  "contact.table.viewDetail": "Viewdetail",
  "contact.table.wechat": "Wechat",
  "opportunity.detail.contacts": "Contacts",
  "opportunity.detail.contracts": "Contracts",
  "opportunity.detail.createQuote": "Createquote",
  "opportunity.detail.detailInfo": "Detailinfo",
  "opportunity.detail.markLost": "Marklost",
  "opportunity.detail.markLostContent": "Marklostcontent",
  "opportunity.detail.markWon": "Markwon",
  "opportunity.detail.markWonContent": "Markwoncontent",
  "opportunity.detail.noFollowUpRecords": "Nofollowuprecords",
  "opportunity.detail.products": "Products",
  "opportunity.detail.quickChange": "Quickchange",
  "opportunity.detail.quotes": "Quotes",
  "opportunity.detail.relatedCustomer": "Relatedcustomer",
  "opportunity.detail.selectStage": "Selectstage",
  "opportunity.detail.stageChanged": "Stagechanged",
  "order.changeStatus": "Changestatus",
  "order.createdAt": "Createdat",
  "order.deleteContent": "Deletecontent",
  "payment.detail.paidAmount": "Paidamount",
  "payment.detail.paymentPeriods": "Paymentperiods",
  "payment.detail.totalAmount": "Totalamount",
  "permission.roles.administrator": "Administrator",
  "pricebook.detail.allCustomers": "Allcustomers",
  "pricebook.detail.back": "Back",
  "pricebook.detail.basicInfo": "Basicinfo",
  "pricebook.detail.columnBasePrice": "Columnbaseprice",
  "pricebook.detail.columnEffectiveDate": "Columneffectivedate",
  "pricebook.detail.columnProductName": "Columnproductname",
  "pricebook.detail.columnProductSku": "Columnproductsku",
  "pricebook.detail.columnTiers": "Columntiers",
  "pricebook.detail.currency": "Currency",
  "pricebook.detail.customer": "Customer",
  "pricebook.detail.description": "Description",
  "pricebook.detail.edit": "Edit",
  "pricebook.detail.loadFailed": "Loadfailed",
  "pricebook.detail.none": "None",
  "pricebook.detail.notExist": "Notexist",
  "pricebook.detail.priceItems": "Priceitems",
  "pricebook.detail.pricebookName": "Pricebookname",
  "pricebook.detail.status": "Status",
  "pricebook.detail.type": "Type",
  "pricebook.detail.validPeriod": "Validperiod",
  "pricebook.entryForm.operationFailed": "Operationfailed",
  "pricebook.entryForm.productAdded": "Productadded",
  "pricebook.list.addProduct": "Addproduct",
  "pricebook.list.columnCustomer": "Columncustomer",
  "pricebook.list.columnItemCount": "Columnitemcount",
  "pricebook.list.columnName": "Columnname",
  "pricebook.list.columnStatus": "Columnstatus",
  "pricebook.list.columnType": "Columntype",
  "pricebook.list.columnValidPeriod": "Columnvalidperiod",
  "pricebook.list.customerPricebook": "Customerpricebook",
  "pricebook.list.delete": "Delete",
  "pricebook.list.deleteConfirm": "Deleteconfirm",
  "pricebook.list.deleteFailed": "Deletefailed",
  "pricebook.list.deleteSuccess": "Deletesuccess",
  "pricebook.list.edit": "Edit",
  "pricebook.list.loadFailed": "Loadfailed",
  "pricebook.list.longTerm": "Longterm",
  "pricebook.list.newPricebook": "Newpricebook",
  "pricebook.list.partnerPricebook": "Partnerpricebook",
  "pricebook.list.promotionPricebook": "Promotionpricebook",
  "pricebook.list.searchPlaceholder": "Searchplaceholder",
  "pricebook.list.standardPricebook": "Standardpricebook",
  "pricebook.list.statusActive": "Statusactive",
  "pricebook.list.statusDraft": "Statusdraft",
  "pricebook.list.statusFilter": "Statusfilter",
  "pricebook.list.statusInactive": "Statusinactive",
  "pricebook.list.typeFilter": "Typefilter",
  "product.detail.back": "Back",
  "product.detail.basicInfo": "Basicinfo",
  "product.detail.createdAt": "Createdat",
  "product.detail.description": "Description",
  "product.detail.edit": "Edit",
  "product.detail.loadFailed": "Loadfailed",
  "product.detail.notExist": "Notexist",
  "product.detail.productCategory": "Productcategory",
  "product.detail.productName": "Productname",
  "product.detail.productNumber": "Productnumber",
  "product.detail.specs": "Specs",
  "product.detail.stockStatus": "Stockstatus",
  "product.detail.unit": "Unit",
  "product.detail.unitPrice": "Unitprice",
  "product.detail.updatedAt": "Updatedat",
  "product.list.categoryFilter": "Categoryfilter",
  "product.list.columnCategory": "Columncategory",
  "product.list.columnCostPrice": "Columncostprice",
  "product.list.columnModel": "Columnmodel",
  "product.list.columnName": "Columnname",
  "product.list.columnSku": "Columnsku",
  "product.list.columnSpec": "Columnspec",
  "product.list.columnStatus": "Columnstatus",
  "product.list.columnStock": "Columnstock",
  "product.list.columnUnitPrice": "Columnunitprice",
  "product.list.delete": "Delete",
  "product.list.deleteConfirm": "Deleteconfirm",
  "product.list.deleteFailed": "Deletefailed",
  "product.list.deleteSuccess": "Deletesuccess",
  "product.list.edit": "Edit",
  "product.list.import": "Import",
  "product.list.inStock": "Instock",
  "product.list.loadFailed": "Loadfailed",
  "product.list.newProduct": "Newproduct",
  "product.list.outOfStock": "Outofstock",
  "product.list.searchPlaceholder": "Searchplaceholder",
  "product.list.statusActive": "Statusactive",
  "product.list.statusInactive": "Statusinactive",
  "product.selector.allCategories": "Allcategories",
  "product.selector.category": "Category",
  "product.selector.categoryFilter": "Categoryfilter",
  "product.selector.confirm": "Confirm",
  "product.selector.description": "Description",
  "product.selector.inStock": "Instock",
  "product.selector.outOfStock": "Outofstock",
  "product.selector.productName": "Productname",
  "product.selector.searchPlaceholder": "Searchplaceholder",
  "product.selector.sku": "Sku",
  "product.selector.stock": "Stock",
  "product.selector.title": "Title",
  "product.selector.unit": "Unit",
  "product.selector.unitPrice": "Unitprice",
  "quote.builder.customerInfo": "Customerinfo",
  "quote.builder.edit": "Edit",
  "quote.builder.mockDataNote": "Mockdatanote",
  "quote.builder.new": "New",
  "quote.builder.noContact": "Nocontact",
  "quote.builder.noCustomer": "Nocustomer",
  "quote.builder.notSet": "Notset",
  "quote.builder.pdfExporting": "Pdfexporting",
  "quote.builder.selectProduct": "Selectproduct",
  "quote.builder.step1Desc": "Step1Desc",
  "quote.builder.step1Title": "Step1Title",
  "quote.builder.step2Desc": "Step2Desc",
  "quote.builder.step2Title": "Step2Title",
  "quote.builder.step3Desc": "Step3Desc",
  "quote.builder.step3Title": "Step3Title",
  "quote.calculator.actions": "Actions",
  "quote.calculator.discount": "Discount",
  "quote.calculator.grandTotal": "Grandtotal",
  "quote.calculator.productName": "Productname",
  "quote.calculator.quantity": "Quantity",
  "quote.calculator.subtotal": "Subtotal",
  "quote.calculator.tax": "Tax",
  "quote.calculator.total": "Total",
  "quote.calculator.unitPrice": "Unitprice",
  "quote.preview.discount": "Discount",
  "quote.preview.productName": "Productname",
  "quote.preview.quantity": "Quantity",
  "quote.preview.subtotal": "Subtotal",
  "quote.preview.tax": "Tax",
  "quote.preview.toBeGenerated": "Tobegenerated",
  "quote.preview.total": "Total",
  "quote.preview.unitPrice": "Unitprice",
  "report.activity.completionRate": "Completionrate",
  "report.activity.count": "Count",
  "report.activity.followUpCount": "Followupcount",
  "report.activity.followUpType": "Followuptype",
  "report.activity.percentage": "Percentage",
  "report.activity.rank": "Rank",
  "report.activity.sales": "Sales",
  "report.customer.customerCount": "Customercount",
  "report.customer.industry": "Industry",
  "report.customer.level": "Level",
  "report.customer.levelSuffix": "Levelsuffix",
  "report.customer.newCustomers": "Newcustomers",
  "report.customer.newIn12Months": "Newin12Months",
  "report.customer.percentage": "Percentage",
  "report.customer.totalCustomersChart": "Totalcustomerschart",
  "report.leadConversion.channel": "Channel",
  "report.leadConversion.channelAnalysis": "Channelanalysis",
  "report.leadConversion.conversionCycle": "Conversioncycle",
  "report.leadConversion.convertedChart": "Convertedchart",
  "report.leadConversion.convertedCount": "Convertedcount",
  "report.leadConversion.cycleDetails": "Cycledetails",
  "report.leadConversion.leadCount": "Leadcount",
  "report.leadConversion.leadsChart": "Leadschart",
  "report.payment.actualCollection": "Actualcollection",
  "report.payment.aging": "Aging",
  "report.payment.amount": "Amount",
  "report.payment.attentionDays": "Attentiondays",
  "report.payment.customer": "Customer",
  "report.payment.normalDays": "Normaldays",
  "report.payment.plannedCollection": "Plannedcollection",
  "report.payment.receivableAmount": "Receivableamount",
  "report.payment.riskCritical": "Riskcritical",
  "report.payment.riskDays": "Riskdays",
  "report.payment.riskHigh": "Riskhigh",
  "report.payment.riskLevel": "Risklevel",
  "report.payment.riskLow": "Risklow",
  "report.payment.riskMedium": "Riskmedium",
  "report.payment.status": "Status",
  "report.payment.statusNormal": "Statusnormal",
  "report.payment.statusOverdue": "Statusoverdue",
  "report.payment.statusWarning": "Statuswarning",
  "report.performance.actual": "Actual",
  "report.performance.actualChart": "Actualchart",
  "report.performance.completionRate": "Completionrate",
  "report.performance.rank": "Rank",
  "report.performance.sales": "Sales",
  "report.performance.target": "Target",
  "report.performance.targetChart": "Targetchart",
  "report.performance.team": "Team",
  "report.timeRange.month": "Month",
  "report.timeRange.quarter": "Quarter",
  "report.timeRange.week": "Week",
  "report.timeRange.year": "Year",
  "tab": "Tab",
  "viewManager.managerRole": "Managerrole",
  "viewManager.salesRole": "Salesrole",
  "viewManager.supportRole": "Supportrole",
  "workbench.ai.createContract": "Createcontract",
  "workbench.ai.createContractResponse": "Createcontractresponse",
  "workbench.ai.createCustomer": "Createcustomer",
  "workbench.ai.createCustomerResponse": "Createcustomerresponse",
  "workbench.ai.createOpportunity": "Createopportunity",
  "workbench.ai.createOpportunityResponse": "Createopportunityresponse",
  "workbench.ai.inputPlaceholder": "Inputplaceholder",
  "workbench.ai.monthlyPerformance": "Monthlyperformance",
  "workbench.ai.monthlyPerformanceResponse": "Monthlyperformanceresponse",
  "workbench.ai.notUnderstood": "Notunderstood",
  "workbench.ai.performanceShown": "Performanceshown",
  "workbench.ai.quickCommands": "Quickcommands",
  "workbench.ai.send": "Send",
  "workbench.ai.title": "Title",
  "workbench.ai.todoShown": "Todoshown",
  "workbench.ai.typing": "Typing",
  "workbench.ai.viewTodo": "Viewtodo",
  "workbench.ai.viewTodoResponse": "Viewtodoresponse",
  "workbench.ai.welcome": "Welcome",
  "workbench.create.contract": "Contract",
  "workbench.create.contractAmount": "Contractamount",
  "workbench.create.contractName": "Contractname",
  "workbench.create.customer": "Customer",
  "workbench.create.customerName": "Customername",
  "workbench.create.customerType": "Customertype",
  "workbench.create.enterAmount": "Enteramount",
  "workbench.create.enterPhone": "Enterphone",
  "workbench.create.enterpriseCustomer": "Enterprisecustomer",
  "workbench.create.expectedAmount": "Expectedamount",
  "workbench.create.governmentCustomer": "Governmentcustomer",
  "workbench.create.individualCustomer": "Individualcustomer",
  "workbench.create.invalidPhone": "Invalidphone",
  "workbench.create.opportunity": "Opportunity",
  "workbench.create.opportunityName": "Opportunityname",
  "workbench.create.opportunityStage": "Opportunitystage",
  "workbench.create.phone": "Phone",
  "workbench.create.selectCustomer": "Selectcustomer",
  "workbench.create.selectCustomerType": "Selectcustomertype",
  "workbench.create.selectSignDate": "Selectsigndate",
  "workbench.create.selectStage": "Selectstage",
  "workbench.create.signDate": "Signdate",
  "workbench.create.stageClosed": "Stageclosed",
  "workbench.create.stageLead": "Stagelead",
  "workbench.create.stageNegotiation": "Stagenegotiation",
  "workbench.create.stageProposal": "Stageproposal",
  "workbench.create.stageQualify": "Stagequalify",
  "workbench.create.validationFailed": "Validationfailed",
  "workbench.todo.call": "Call",
```

### 需要添加到 zh.json

```json
  "activity.form.editTitle": "",  // TODO: 添加中文翻译
  "ai.agentDetail.accuracyCompare": "",  // TODO: 添加中文翻译
  "ai.agentDetail.accuracyRate": "",  // TODO: 添加中文翻译
  "ai.agentDetail.action": "",  // TODO: 添加中文翻译
  "ai.agentDetail.avgResponse": "",  // TODO: 添加中文翻译
  "ai.agentDetail.back": "",  // TODO: 添加中文翻译
  "ai.agentDetail.capabilityList": "",  // TODO: 添加中文翻译
  "ai.agentDetail.confidence": "",  // TODO: 添加中文翻译
  "ai.agentDetail.detailMetrics": "",  // TODO: 添加中文翻译
  "ai.agentDetail.duration": "",  // TODO: 添加中文翻译
  "ai.agentDetail.effectStats": "",  // TODO: 添加中文翻译
  "ai.agentDetail.errorCount": "",  // TODO: 添加中文翻译
  "ai.agentDetail.executionLogs": "",  // TODO: 添加中文翻译
  "ai.agentDetail.executions": "",  // TODO: 添加中文翻译
  "ai.agentDetail.failed": "",  // TODO: 添加中文翻译
  "ai.agentDetail.input": "",  // TODO: 添加中文翻译
  "ai.agentDetail.last7DaysTrend": "",  // TODO: 添加中文翻译
  "ai.agentDetail.output": "",  // TODO: 添加中文翻译
  "ai.agentDetail.overview": "",  // TODO: 添加中文翻译
  "ai.agentDetail.publicScope": "",  // TODO: 添加中文翻译
  "ai.agentDetail.satisfaction": "",  // TODO: 添加中文翻译
  "ai.agentDetail.seconds": "",  // TODO: 添加中文翻译
  "ai.agentDetail.specifiedUsers": "",  // TODO: 添加中文翻译
  "ai.agentDetail.status": "",  // TODO: 添加中文翻译
  "ai.agentDetail.success": "",  // TODO: 添加中文翻译
  "ai.agentDetail.successRate": "",  // TODO: 添加中文翻译
  "ai.agentDetail.timeout": "",  // TODO: 添加中文翻译
  "ai.agentDetail.times": "",  // TODO: 添加中文翻译
  "ai.agentDetail.timestamp": "",  // TODO: 添加中文翻译
  "ai.agentDetail.totalExecutions": "",  // TODO: 添加中文翻译
  "ai.agentDetail.visibleToAll": "",  // TODO: 添加中文翻译
  "ai.agents.activeAgents": "",  // TODO: 添加中文翻译
  "ai.agents.activeAgentsDesc": "",  // TODO: 添加中文翻译
  "ai.agents.agents": "",  // TODO: 添加中文翻译
  "ai.agents.allStatuses": "",  // TODO: 添加中文翻译
  "ai.agents.avgSuccessRateDesc": "",  // TODO: 添加中文翻译
  "ai.agents.count": "",  // TODO: 添加中文翻译
  "ai.agents.details": "",  // TODO: 添加中文翻译
  "ai.agents.filterStatus": "",  // TODO: 添加中文翻译
  "ai.agents.filterType": "",  // TODO: 添加中文翻译
  "ai.agents.noMatching": "",  // TODO: 添加中文翻译
  "ai.agents.responseTime": "",  // TODO: 添加中文翻译
  "ai.agents.satisfaction": "",  // TODO: 添加中文翻译
  "ai.agents.statusActive": "",  // TODO: 添加中文翻译
  "ai.agents.statusError": "",  // TODO: 添加中文翻译
  "ai.agents.statusInactive": "",  // TODO: 添加中文翻译
  "ai.agents.statusTraining": "",  // TODO: 添加中文翻译
  "ai.agents.successRate": "",  // TODO: 添加中文翻译
  "ai.agents.totalAgentsDesc": "",  // TODO: 添加中文翻译
  "ai.agents.totalExecutionsDesc": "",  // TODO: 添加中文翻译
  "ai.agents.totalMatching": "",  // TODO: 添加中文翻译
  "ai.agents.typeAnalytical": "",  // TODO: 添加中文翻译
  "ai.agents.typeAutomation": "",  // TODO: 添加中文翻译
  "ai.agents.typeConversational": "",  // TODO: 添加中文翻译
  "ai.agents.typeGenerative": "",  // TODO: 添加中文翻译
  "ai.agents.typePredictive": "",  // TODO: 添加中文翻译
  "ai.agents.typeRecommendation": "",  // TODO: 添加中文翻译
  "ai.churnWarning.actions": "",  // TODO: 添加中文翻译
  "ai.churnWarning.admin": "",  // TODO: 添加中文翻译
  "ai.churnWarning.aiSuggestions": "",  // TODO: 添加中文翻译
  "ai.churnWarning.basicInfo": "",  // TODO: 添加中文翻译
  "ai.churnWarning.complaintCount": "",  // TODO: 添加中文翻译
  "ai.churnWarning.contractExpiry": "",  // TODO: 添加中文翻译
  "ai.churnWarning.customerName": "",  // TODO: 添加中文翻译
  "ai.churnWarning.daysUnit": "",  // TODO: 添加中文翻译
  "ai.churnWarning.details": "",  // TODO: 添加中文翻译
  "ai.churnWarning.highRiskCustomers": "",  // TODO: 添加中文翻译
  "ai.churnWarning.lastContactDays": "",  // TODO: 添加中文翻译
  "ai.churnWarning.markAsProcessed": "",  // TODO: 添加中文翻译
  "ai.churnWarning.mediumRiskCustomers": "",  // TODO: 添加中文翻译
  "ai.churnWarning.needImmediateAction": "",  // TODO: 添加中文翻译
  "ai.churnWarning.none": "",  // TODO: 添加中文翻译
  "ai.churnWarning.owner": "",  // TODO: 添加中文翻译
  "ai.churnWarning.riskAnalysis": "",  // TODO: 添加中文翻译
  "ai.churnWarning.riskFactors": "",  // TODO: 添加中文翻译
  "ai.churnWarning.riskHigh": "",  // TODO: 添加中文翻译
  "ai.churnWarning.riskLevel": "",  // TODO: 添加中文翻译
  "ai.churnWarning.riskLow": "",  // TODO: 添加中文翻译
  "ai.churnWarning.riskMedium": "",  // TODO: 添加中文翻译
  "ai.churnWarning.riskScore": "",  // TODO: 添加中文翻译
  "ai.churnWarning.status": "",  // TODO: 添加中文翻译
  "ai.churnWarning.timesUnit": "",  // TODO: 添加中文翻译
  "ai.customerSegmentation.customer": "",  // TODO: 添加中文翻译
  "ai.customerSegmentation.customerList": "",  // TODO: 添加中文翻译
  "ai.customerSegmentation.customerName": "",  // TODO: 添加中文翻译
  "ai.customerSegmentation.customers": "",  // TODO: 添加中文翻译
  "ai.customerSegmentation.daysUnit": "",  // TODO: 添加中文翻译
  "ai.customerSegmentation.frequencyChart": "",  // TODO: 添加中文翻译
  "ai.customerSegmentation.frequencyUnit": "",  // TODO: 添加中文翻译
  "ai.customerSegmentation.lastPurchase": "",  // TODO: 添加中文翻译
  "ai.customerSegmentation.monetaryChart": "",  // TODO: 添加中文翻译
  "ai.customerSegmentation.monetaryUnit": "",  // TODO: 添加中文翻译
  "ai.customerSegmentation.owner": "",  // TODO: 添加中文翻译
  "ai.customerSegmentation.quantity": "",  // TODO: 添加中文翻译
  "ai.customerSegmentation.recencyDays": "",  // TODO: 添加中文翻译
  "ai.customerSegmentation.rfmRadar": "",  // TODO: 添加中文翻译
  "ai.customerSegmentation.rfmRadarDesc": "",  // TODO: 添加中文翻译
  "ai.customerSegmentation.scatterChartDesc": "",  // TODO: 添加中文翻译
  "ai.customerSegmentation.segmentFeatures": "",  // TODO: 添加中文翻译
  "ai.customerSegmentation.segmentPieChart": "",  // TODO: 添加中文翻译
  "ai.customerSegmentation.totalCustomers": "",  // TODO: 添加中文翻译
  "ai.customerSegmentation.totalValue": "",  // TODO: 添加中文翻译
  "ai.leadScoring.actions": "",  // TODO: 添加中文翻译
  "ai.leadScoring.activityParticipation": "",  // TODO: 添加中文翻译
  "ai.leadScoring.aiScore": "",  // TODO: 添加中文翻译
  "ai.leadScoring.attributeScore": "",  // TODO: 添加中文翻译
  "ai.leadScoring.attributeScoreTitle": "",  // TODO: 添加中文翻译
  "ai.leadScoring.attributeTotal": "",  // TODO: 添加中文翻译
  "ai.leadScoring.behaviorScore": "",  // TODO: 添加中文翻译
  "ai.leadScoring.behaviorScoreTitle": "",  // TODO: 添加中文翻译
  "ai.leadScoring.behaviorTotal": "",  // TODO: 添加中文翻译
  "ai.leadScoring.companySize": "",  // TODO: 添加中文翻译
  "ai.leadScoring.emailOpen": "",  // TODO: 添加中文翻译
  "ai.leadScoring.highValue": "",  // TODO: 添加中文翻译
  "ai.leadScoring.industry": "",  // TODO: 添加中文翻译
  "ai.leadScoring.industryMatch": "",  // TODO: 添加中文翻译
  "ai.leadScoring.lastActivity": "",  // TODO: 添加中文翻译
  "ai.leadScoring.leadName": "",  // TODO: 添加中文翻译
  "ai.leadScoring.level": "",  // TODO: 添加中文翻译
  "ai.leadScoring.levelSuffix": "",  // TODO: 添加中文翻译
  "ai.leadScoring.manualAdjustment": "",  // TODO: 添加中文翻译
  "ai.leadScoring.owner": "",  // TODO: 添加中文翻译
  "ai.leadScoring.points": "",  // TODO: 添加中文翻译
  "ai.leadScoring.positionLevel": "",  // TODO: 添加中文翻译
  "ai.leadScoring.saveAdjustment": "",  // TODO: 添加中文翻译
  "ai.leadScoring.scoreDetails": "",  // TODO: 添加中文翻译
  "ai.leadScoring.scoreDimensions": "",  // TODO: 添加中文翻译
  "ai.leadScoring.totalScore": "",  // TODO: 添加中文翻译
  "ai.leadScoring.websiteVisit": "",  // TODO: 添加中文翻译
  "ai.meetingAssistant.actionItems": "",  // TODO: 添加中文翻译
  "ai.meetingAssistant.aiSummary": "",  // TODO: 添加中文翻译
  "ai.meetingAssistant.assignee": "",  // TODO: 添加中文翻译
  "ai.meetingAssistant.completed": "",  // TODO: 添加中文翻译
  "ai.meetingAssistant.date": "",  // TODO: 添加中文翻译
  "ai.meetingAssistant.dueDate": "",  // TODO: 添加中文翻译
  "ai.meetingAssistant.duration": "",  // TODO: 添加中文翻译
  "ai.meetingAssistant.exportNotes": "",  // TODO: 添加中文翻译
  "ai.meetingAssistant.host": "",  // TODO: 添加中文翻译
  "ai.meetingAssistant.keywords": "",  // TODO: 添加中文翻译
  "ai.meetingAssistant.meetingDate": "",  // TODO: 添加中文翻译
  "ai.meetingAssistant.meetingDetails": "",  // TODO: 添加中文翻译
  "ai.meetingAssistant.meetingInfo": "",  // TODO: 添加中文翻译
  "ai.meetingAssistant.meetingTime": "",  // TODO: 添加中文翻译
  "ai.meetingAssistant.none": "",  // TODO: 添加中文翻译
  "ai.meetingAssistant.participants": "",  // TODO: 添加中文翻译
  "ai.meetingAssistant.participantsCount": "",  // TODO: 添加中文翻译
  "ai.meetingAssistant.pending": "",  // TODO: 添加中文翻译
  "ai.meetingAssistant.people": "",  // TODO: 添加中文翻译
  "ai.meetingAssistant.priority": "",  // TODO: 添加中文翻译
  "ai.meetingAssistant.priorityHigh": "",  // TODO: 添加中文翻译
  "ai.meetingAssistant.priorityLow": "",  // TODO: 添加中文翻译
  "ai.meetingAssistant.priorityMedium": "",  // TODO: 添加中文翻译
  "ai.meetingAssistant.sentiment": "",  // TODO: 添加中文翻译
  "ai.meetingAssistant.sentimentNegative": "",  // TODO: 添加中文翻译
  "ai.meetingAssistant.sentimentNeutral": "",  // TODO: 添加中文翻译
  "ai.meetingAssistant.sentimentPositive": "",  // TODO: 添加中文翻译
  "ai.meetingAssistant.time": "",  // TODO: 添加中文翻译
  "ai.meetingAssistant.todos": "",  // TODO: 添加中文翻译
  "ai.meetingAssistant.transcript": "",  // TODO: 添加中文翻译
  "ai.meetingAssistant.unassigned": "",  // TODO: 添加中文翻译
  "ai.predictiveAI.accuracy": "",  // TODO: 添加中文翻译
  "ai.predictiveAI.actual": "",  // TODO: 添加中文翻译
  "ai.predictiveAI.avgAccuracyDesc": "",  // TODO: 添加中文翻译
  "ai.predictiveAI.confidence": "",  // TODO: 添加中文翻译
  "ai.predictiveAI.correctPredictionsDesc": "",  // TODO: 添加中文翻译
  "ai.predictiveAI.last12Months": "",  // TODO: 添加中文翻译
  "ai.predictiveAI.last6Months": "",  // TODO: 添加中文翻译
  "ai.predictiveAI.meanAbsoluteError": "",  // TODO: 添加中文翻译
  "ai.predictiveAI.modelCount": "",  // TODO: 添加中文翻译
  "ai.predictiveAI.modelCountDesc": "",  // TODO: 添加中文翻译
  "ai.predictiveAI.models": "",  // TODO: 添加中文翻译
  "ai.predictiveAI.predicted": "",  // TODO: 添加中文翻译
  "ai.predictiveAI.predictionMetric": "",  // TODO: 添加中文翻译
  "ai.predictiveAI.rootMeanSquareError": "",  // TODO: 添加中文翻译
  "ai.predictiveAI.salesTrend": "",  // TODO: 添加中文翻译
  "ai.predictiveAI.totalPredictionsDesc": "",  // TODO: 添加中文翻译
  "ai.salesForecast.exceeded": "",  // TODO: 添加中文翻译
  "ai.salesForecast.monthly": "",  // TODO: 添加中文翻译
  "ai.salesForecast.predicted": "",  // TODO: 添加中文翻译
  "ai.salesForecast.predictedAmount": "",  // TODO: 添加中文翻译
  "ai.salesForecast.predictionAccuracy": "",  // TODO: 添加中文翻译
  "ai.salesForecast.product": "",  // TODO: 添加中文翻译
  "ai.salesForecast.quarterly": "",  // TODO: 添加中文翻译
  "ai.salesForecast.thisMonthPrediction": "",  // TODO: 添加中文翻译
  "ai.salesForecast.trend": "",  // TODO: 添加中文翻译
  "ai.salesForecast.trendDown": "",  // TODO: 添加中文翻译
  "ai.salesForecast.trendStable": "",  // TODO: 添加中文翻译
  "ai.salesForecast.trendUp": "",  // TODO: 添加中文翻译
  "ai.salesForecast.vsLastPeriod": "",  // TODO: 添加中文翻译
  "ai.salesForecast.yearly": "",  // TODO: 添加中文翻译
  "common.actions.cancel": "",  // TODO: 添加中文翻译
  "common.actions.confirm": "",  // TODO: 添加中文翻译
  "common.actions.confirmDelete": "",  // TODO: 添加中文翻译
  "common.actions.edit": "",  // TODO: 添加中文翻译
  "common.actions.reset": "",  // TODO: 添加中文翻译
  "common.actions.search": "",  // TODO: 添加中文翻译
  "common.comingSoon": "",  // TODO: 添加中文翻译
  "common.copy": "",  // TODO: 添加中文翻译
  "common.createSuccess": "",  // TODO: 添加中文翻译
  "common.deleteSuccess": "",  // TODO: 添加中文翻译
  "common.description": "",  // TODO: 添加中文翻译
  "common.none": "",  // TODO: 添加中文翻译
  "common.select": "",  // TODO: 添加中文翻译
  "common.to": "",  // TODO: 添加中文翻译
  "common.unit.record": "",  // TODO: 添加中文翻译
  "common.updateSuccess": "",  // TODO: 添加中文翻译
  "contact.filter.customerName": "",  // TODO: 添加中文翻译
  "contact.filter.customerNamePlaceholder": "",  // TODO: 添加中文翻译
  "contact.filter.name": "",  // TODO: 添加中文翻译
  "contact.filter.namePlaceholder": "",  // TODO: 添加中文翻译
  "contact.filter.position": "",  // TODO: 添加中文翻译
  "contact.filter.positionPlaceholder": "",  // TODO: 添加中文翻译
  "contact.form.cancel": "",  // TODO: 添加中文翻译
  "contact.form.confirm": "",  // TODO: 添加中文翻译
  "contact.form.createTitle": "",  // TODO: 添加中文翻译
  "contact.form.customer": "",  // TODO: 添加中文翻译
  "contact.form.customerPlaceholder": "",  // TODO: 添加中文翻译
  "contact.form.editTitle": "",  // TODO: 添加中文翻译
  "contact.form.email": "",  // TODO: 添加中文翻译
  "contact.form.emailPlaceholder": "",  // TODO: 添加中文翻译
  "contact.form.female": "",  // TODO: 添加中文翻译
  "contact.form.gender": "",  // TODO: 添加中文翻译
  "contact.form.male": "",  // TODO: 添加中文翻译
  "contact.form.mobile": "",  // TODO: 添加中文翻译
  "contact.form.mobilePlaceholder": "",  // TODO: 添加中文翻译
  "contact.form.name": "",  // TODO: 添加中文翻译
  "contact.form.namePlaceholder": "",  // TODO: 添加中文翻译
  "contact.form.nameRequired": "",  // TODO: 添加中文翻译
  "contact.form.position": "",  // TODO: 添加中文翻译
  "contact.form.positionPlaceholder": "",  // TODO: 添加中文翻译
  "contact.form.remark": "",  // TODO: 添加中文翻译
  "contact.form.remarkPlaceholder": "",  // TODO: 添加中文翻译
  "contact.form.wechat": "",  // TODO: 添加中文翻译
  "contact.form.wechatPlaceholder": "",  // TODO: 添加中文翻译
  "contact.jobLevel.executive": "",  // TODO: 添加中文翻译
  "contact.jobLevel.junior": "",  // TODO: 添加中文翻译
  "contact.jobLevel.middle": "",  // TODO: 添加中文翻译
  "contact.jobLevel.other": "",  // TODO: 添加中文翻译
  "contact.list.confirmDelete": "",  // TODO: 添加中文翻译
  "contact.list.confirmDeleteBtn": "",  // TODO: 添加中文翻译
  "contact.list.confirmDeleteContent": "",  // TODO: 添加中文翻译
  "contact.list.createContact": "",  // TODO: 添加中文翻译
  "contact.list.createSuccess": "",  // TODO: 添加中文翻译
  "contact.list.deleteSuccess": "",  // TODO: 添加中文翻译
  "contact.list.editSuccess": "",  // TODO: 添加中文翻译
  "contact.list.loadFailed": "",  // TODO: 添加中文翻译
  "contact.list.title": "",  // TODO: 添加中文翻译
  "contact.table.actions": "",  // TODO: 添加中文翻译
  "contact.table.confirmDelete": "",  // TODO: 添加中文翻译
  "contact.table.createdAt": "",  // TODO: 添加中文翻译
  "contact.table.customerName": "",  // TODO: 添加中文翻译
  "contact.table.decisionRole": "",  // TODO: 添加中文翻译
  "contact.table.delete": "",  // TODO: 添加中文翻译
  "contact.table.edit": "",  // TODO: 添加中文翻译
  "contact.table.email": "",  // TODO: 添加中文翻译
  "contact.table.jobLevel": "",  // TODO: 添加中文翻译
  "contact.table.mobile": "",  // TODO: 添加中文翻译
  "contact.table.name": "",  // TODO: 添加中文翻译
  "contact.table.owner": "",  // TODO: 添加中文翻译
  "contact.table.position": "",  // TODO: 添加中文翻译
  "contact.table.viewDetail": "",  // TODO: 添加中文翻译
  "contact.table.wechat": "",  // TODO: 添加中文翻译
  "opportunity.detail.contacts": "",  // TODO: 添加中文翻译
  "opportunity.detail.contracts": "",  // TODO: 添加中文翻译
  "opportunity.detail.createQuote": "",  // TODO: 添加中文翻译
  "opportunity.detail.detailInfo": "",  // TODO: 添加中文翻译
  "opportunity.detail.markLost": "",  // TODO: 添加中文翻译
  "opportunity.detail.markLostContent": "",  // TODO: 添加中文翻译
  "opportunity.detail.markWon": "",  // TODO: 添加中文翻译
  "opportunity.detail.markWonContent": "",  // TODO: 添加中文翻译
  "opportunity.detail.noFollowUpRecords": "",  // TODO: 添加中文翻译
  "opportunity.detail.products": "",  // TODO: 添加中文翻译
  "opportunity.detail.quickChange": "",  // TODO: 添加中文翻译
  "opportunity.detail.quotes": "",  // TODO: 添加中文翻译
  "opportunity.detail.relatedCustomer": "",  // TODO: 添加中文翻译
  "opportunity.detail.selectStage": "",  // TODO: 添加中文翻译
  "opportunity.detail.stageChanged": "",  // TODO: 添加中文翻译
  "order.changeStatus": "",  // TODO: 添加中文翻译
  "order.createdAt": "",  // TODO: 添加中文翻译
  "order.deleteContent": "",  // TODO: 添加中文翻译
  "payment.detail.paidAmount": "",  // TODO: 添加中文翻译
  "payment.detail.paymentPeriods": "",  // TODO: 添加中文翻译
  "payment.detail.totalAmount": "",  // TODO: 添加中文翻译
  "permission.roles.administrator": "",  // TODO: 添加中文翻译
  "pricebook.detail.allCustomers": "",  // TODO: 添加中文翻译
  "pricebook.detail.back": "",  // TODO: 添加中文翻译
  "pricebook.detail.basicInfo": "",  // TODO: 添加中文翻译
  "pricebook.detail.columnBasePrice": "",  // TODO: 添加中文翻译
  "pricebook.detail.columnEffectiveDate": "",  // TODO: 添加中文翻译
  "pricebook.detail.columnProductName": "",  // TODO: 添加中文翻译
  "pricebook.detail.columnProductSku": "",  // TODO: 添加中文翻译
  "pricebook.detail.columnTiers": "",  // TODO: 添加中文翻译
  "pricebook.detail.currency": "",  // TODO: 添加中文翻译
  "pricebook.detail.customer": "",  // TODO: 添加中文翻译
  "pricebook.detail.description": "",  // TODO: 添加中文翻译
  "pricebook.detail.edit": "",  // TODO: 添加中文翻译
  "pricebook.detail.loadFailed": "",  // TODO: 添加中文翻译
  "pricebook.detail.none": "",  // TODO: 添加中文翻译
  "pricebook.detail.notExist": "",  // TODO: 添加中文翻译
  "pricebook.detail.priceItems": "",  // TODO: 添加中文翻译
  "pricebook.detail.pricebookName": "",  // TODO: 添加中文翻译
  "pricebook.detail.status": "",  // TODO: 添加中文翻译
  "pricebook.detail.type": "",  // TODO: 添加中文翻译
  "pricebook.detail.validPeriod": "",  // TODO: 添加中文翻译
  "pricebook.entryForm.operationFailed": "",  // TODO: 添加中文翻译
  "pricebook.entryForm.productAdded": "",  // TODO: 添加中文翻译
  "pricebook.list.addProduct": "",  // TODO: 添加中文翻译
  "pricebook.list.columnCustomer": "",  // TODO: 添加中文翻译
  "pricebook.list.columnItemCount": "",  // TODO: 添加中文翻译
  "pricebook.list.columnName": "",  // TODO: 添加中文翻译
  "pricebook.list.columnStatus": "",  // TODO: 添加中文翻译
  "pricebook.list.columnType": "",  // TODO: 添加中文翻译
  "pricebook.list.columnValidPeriod": "",  // TODO: 添加中文翻译
  "pricebook.list.customerPricebook": "",  // TODO: 添加中文翻译
  "pricebook.list.delete": "",  // TODO: 添加中文翻译
  "pricebook.list.deleteConfirm": "",  // TODO: 添加中文翻译
  "pricebook.list.deleteFailed": "",  // TODO: 添加中文翻译
  "pricebook.list.deleteSuccess": "",  // TODO: 添加中文翻译
  "pricebook.list.edit": "",  // TODO: 添加中文翻译
  "pricebook.list.loadFailed": "",  // TODO: 添加中文翻译
  "pricebook.list.longTerm": "",  // TODO: 添加中文翻译
  "pricebook.list.newPricebook": "",  // TODO: 添加中文翻译
  "pricebook.list.partnerPricebook": "",  // TODO: 添加中文翻译
  "pricebook.list.promotionPricebook": "",  // TODO: 添加中文翻译
  "pricebook.list.searchPlaceholder": "",  // TODO: 添加中文翻译
  "pricebook.list.standardPricebook": "",  // TODO: 添加中文翻译
  "pricebook.list.statusActive": "",  // TODO: 添加中文翻译
  "pricebook.list.statusDraft": "",  // TODO: 添加中文翻译
  "pricebook.list.statusFilter": "",  // TODO: 添加中文翻译
  "pricebook.list.statusInactive": "",  // TODO: 添加中文翻译
  "pricebook.list.typeFilter": "",  // TODO: 添加中文翻译
  "product.detail.back": "",  // TODO: 添加中文翻译
  "product.detail.basicInfo": "",  // TODO: 添加中文翻译
  "product.detail.createdAt": "",  // TODO: 添加中文翻译
  "product.detail.description": "",  // TODO: 添加中文翻译
  "product.detail.edit": "",  // TODO: 添加中文翻译
  "product.detail.loadFailed": "",  // TODO: 添加中文翻译
  "product.detail.notExist": "",  // TODO: 添加中文翻译
  "product.detail.productCategory": "",  // TODO: 添加中文翻译
  "product.detail.productName": "",  // TODO: 添加中文翻译
  "product.detail.productNumber": "",  // TODO: 添加中文翻译
  "product.detail.specs": "",  // TODO: 添加中文翻译
  "product.detail.stockStatus": "",  // TODO: 添加中文翻译
  "product.detail.unit": "",  // TODO: 添加中文翻译
  "product.detail.unitPrice": "",  // TODO: 添加中文翻译
  "product.detail.updatedAt": "",  // TODO: 添加中文翻译
  "product.list.categoryFilter": "",  // TODO: 添加中文翻译
  "product.list.columnCategory": "",  // TODO: 添加中文翻译
  "product.list.columnCostPrice": "",  // TODO: 添加中文翻译
  "product.list.columnModel": "",  // TODO: 添加中文翻译
  "product.list.columnName": "",  // TODO: 添加中文翻译
  "product.list.columnSku": "",  // TODO: 添加中文翻译
  "product.list.columnSpec": "",  // TODO: 添加中文翻译
  "product.list.columnStatus": "",  // TODO: 添加中文翻译
  "product.list.columnStock": "",  // TODO: 添加中文翻译
  "product.list.columnUnitPrice": "",  // TODO: 添加中文翻译
  "product.list.delete": "",  // TODO: 添加中文翻译
  "product.list.deleteConfirm": "",  // TODO: 添加中文翻译
  "product.list.deleteFailed": "",  // TODO: 添加中文翻译
  "product.list.deleteSuccess": "",  // TODO: 添加中文翻译
  "product.list.edit": "",  // TODO: 添加中文翻译
  "product.list.import": "",  // TODO: 添加中文翻译
  "product.list.inStock": "",  // TODO: 添加中文翻译
  "product.list.loadFailed": "",  // TODO: 添加中文翻译
  "product.list.newProduct": "",  // TODO: 添加中文翻译
  "product.list.outOfStock": "",  // TODO: 添加中文翻译
  "product.list.searchPlaceholder": "",  // TODO: 添加中文翻译
  "product.list.statusActive": "",  // TODO: 添加中文翻译
  "product.list.statusInactive": "",  // TODO: 添加中文翻译
  "product.selector.allCategories": "",  // TODO: 添加中文翻译
  "product.selector.category": "",  // TODO: 添加中文翻译
  "product.selector.categoryFilter": "",  // TODO: 添加中文翻译
  "product.selector.confirm": "",  // TODO: 添加中文翻译
  "product.selector.description": "",  // TODO: 添加中文翻译
  "product.selector.inStock": "",  // TODO: 添加中文翻译
  "product.selector.outOfStock": "",  // TODO: 添加中文翻译
  "product.selector.productName": "",  // TODO: 添加中文翻译
  "product.selector.searchPlaceholder": "",  // TODO: 添加中文翻译
  "product.selector.sku": "",  // TODO: 添加中文翻译
  "product.selector.stock": "",  // TODO: 添加中文翻译
  "product.selector.title": "",  // TODO: 添加中文翻译
  "product.selector.unit": "",  // TODO: 添加中文翻译
  "product.selector.unitPrice": "",  // TODO: 添加中文翻译
  "quote.builder.customerInfo": "",  // TODO: 添加中文翻译
  "quote.builder.edit": "",  // TODO: 添加中文翻译
  "quote.builder.mockDataNote": "",  // TODO: 添加中文翻译
  "quote.builder.new": "",  // TODO: 添加中文翻译
  "quote.builder.noContact": "",  // TODO: 添加中文翻译
  "quote.builder.noCustomer": "",  // TODO: 添加中文翻译
  "quote.builder.notSet": "",  // TODO: 添加中文翻译
  "quote.builder.pdfExporting": "",  // TODO: 添加中文翻译
  "quote.builder.selectProduct": "",  // TODO: 添加中文翻译
  "quote.builder.step1Desc": "",  // TODO: 添加中文翻译
  "quote.builder.step1Title": "",  // TODO: 添加中文翻译
  "quote.builder.step2Desc": "",  // TODO: 添加中文翻译
  "quote.builder.step2Title": "",  // TODO: 添加中文翻译
  "quote.builder.step3Desc": "",  // TODO: 添加中文翻译
  "quote.builder.step3Title": "",  // TODO: 添加中文翻译
  "quote.calculator.actions": "",  // TODO: 添加中文翻译
  "quote.calculator.discount": "",  // TODO: 添加中文翻译
  "quote.calculator.grandTotal": "",  // TODO: 添加中文翻译
  "quote.calculator.productName": "",  // TODO: 添加中文翻译
  "quote.calculator.quantity": "",  // TODO: 添加中文翻译
  "quote.calculator.subtotal": "",  // TODO: 添加中文翻译
  "quote.calculator.tax": "",  // TODO: 添加中文翻译
  "quote.calculator.total": "",  // TODO: 添加中文翻译
  "quote.calculator.unitPrice": "",  // TODO: 添加中文翻译
  "quote.preview.discount": "",  // TODO: 添加中文翻译
  "quote.preview.productName": "",  // TODO: 添加中文翻译
  "quote.preview.quantity": "",  // TODO: 添加中文翻译
  "quote.preview.subtotal": "",  // TODO: 添加中文翻译
  "quote.preview.tax": "",  // TODO: 添加中文翻译
  "quote.preview.toBeGenerated": "",  // TODO: 添加中文翻译
  "quote.preview.total": "",  // TODO: 添加中文翻译
  "quote.preview.unitPrice": "",  // TODO: 添加中文翻译
  "report.activity.completionRate": "",  // TODO: 添加中文翻译
  "report.activity.count": "",  // TODO: 添加中文翻译
  "report.activity.followUpCount": "",  // TODO: 添加中文翻译
  "report.activity.followUpType": "",  // TODO: 添加中文翻译
  "report.activity.percentage": "",  // TODO: 添加中文翻译
  "report.activity.rank": "",  // TODO: 添加中文翻译
  "report.activity.sales": "",  // TODO: 添加中文翻译
  "report.customer.customerCount": "",  // TODO: 添加中文翻译
  "report.customer.industry": "",  // TODO: 添加中文翻译
  "report.customer.level": "",  // TODO: 添加中文翻译
  "report.customer.levelSuffix": "",  // TODO: 添加中文翻译
  "report.customer.newCustomers": "",  // TODO: 添加中文翻译
  "report.customer.newIn12Months": "",  // TODO: 添加中文翻译
  "report.customer.percentage": "",  // TODO: 添加中文翻译
  "report.customer.totalCustomersChart": "",  // TODO: 添加中文翻译
  "report.leadConversion.channel": "",  // TODO: 添加中文翻译
  "report.leadConversion.channelAnalysis": "",  // TODO: 添加中文翻译
  "report.leadConversion.conversionCycle": "",  // TODO: 添加中文翻译
  "report.leadConversion.convertedChart": "",  // TODO: 添加中文翻译
  "report.leadConversion.convertedCount": "",  // TODO: 添加中文翻译
  "report.leadConversion.cycleDetails": "",  // TODO: 添加中文翻译
  "report.leadConversion.leadCount": "",  // TODO: 添加中文翻译
  "report.leadConversion.leadsChart": "",  // TODO: 添加中文翻译
  "report.payment.actualCollection": "",  // TODO: 添加中文翻译
  "report.payment.aging": "",  // TODO: 添加中文翻译
  "report.payment.amount": "",  // TODO: 添加中文翻译
  "report.payment.attentionDays": "",  // TODO: 添加中文翻译
  "report.payment.customer": "",  // TODO: 添加中文翻译
  "report.payment.normalDays": "",  // TODO: 添加中文翻译
  "report.payment.plannedCollection": "",  // TODO: 添加中文翻译
  "report.payment.receivableAmount": "",  // TODO: 添加中文翻译
  "report.payment.riskCritical": "",  // TODO: 添加中文翻译
  "report.payment.riskDays": "",  // TODO: 添加中文翻译
  "report.payment.riskHigh": "",  // TODO: 添加中文翻译
  "report.payment.riskLevel": "",  // TODO: 添加中文翻译
  "report.payment.riskLow": "",  // TODO: 添加中文翻译
  "report.payment.riskMedium": "",  // TODO: 添加中文翻译
  "report.payment.status": "",  // TODO: 添加中文翻译
  "report.payment.statusNormal": "",  // TODO: 添加中文翻译
  "report.payment.statusOverdue": "",  // TODO: 添加中文翻译
  "report.payment.statusWarning": "",  // TODO: 添加中文翻译
  "report.performance.actual": "",  // TODO: 添加中文翻译
  "report.performance.actualChart": "",  // TODO: 添加中文翻译
  "report.performance.completionRate": "",  // TODO: 添加中文翻译
  "report.performance.rank": "",  // TODO: 添加中文翻译
  "report.performance.sales": "",  // TODO: 添加中文翻译
  "report.performance.target": "",  // TODO: 添加中文翻译
  "report.performance.targetChart": "",  // TODO: 添加中文翻译
  "report.performance.team": "",  // TODO: 添加中文翻译
  "report.timeRange.month": "",  // TODO: 添加中文翻译
  "report.timeRange.quarter": "",  // TODO: 添加中文翻译
  "report.timeRange.week": "",  // TODO: 添加中文翻译
  "report.timeRange.year": "",  // TODO: 添加中文翻译
  "tab": "",  // TODO: 添加中文翻译
  "viewManager.managerRole": "",  // TODO: 添加中文翻译
  "viewManager.salesRole": "",  // TODO: 添加中文翻译
  "viewManager.supportRole": "",  // TODO: 添加中文翻译
  "workbench.ai.createContract": "",  // TODO: 添加中文翻译
  "workbench.ai.createContractResponse": "",  // TODO: 添加中文翻译
  "workbench.ai.createCustomer": "",  // TODO: 添加中文翻译
  "workbench.ai.createCustomerResponse": "",  // TODO: 添加中文翻译
  "workbench.ai.createOpportunity": "",  // TODO: 添加中文翻译
  "workbench.ai.createOpportunityResponse": "",  // TODO: 添加中文翻译
  "workbench.ai.inputPlaceholder": "",  // TODO: 添加中文翻译
  "workbench.ai.monthlyPerformance": "",  // TODO: 添加中文翻译
  "workbench.ai.monthlyPerformanceResponse": "",  // TODO: 添加中文翻译
  "workbench.ai.notUnderstood": "",  // TODO: 添加中文翻译
  "workbench.ai.performanceShown": "",  // TODO: 添加中文翻译
  "workbench.ai.quickCommands": "",  // TODO: 添加中文翻译
  "workbench.ai.send": "",  // TODO: 添加中文翻译
  "workbench.ai.title": "",  // TODO: 添加中文翻译
  "workbench.ai.todoShown": "",  // TODO: 添加中文翻译
  "workbench.ai.typing": "",  // TODO: 添加中文翻译
  "workbench.ai.viewTodo": "",  // TODO: 添加中文翻译
  "workbench.ai.viewTodoResponse": "",  // TODO: 添加中文翻译
  "workbench.ai.welcome": "",  // TODO: 添加中文翻译
  "workbench.create.contract": "",  // TODO: 添加中文翻译
  "workbench.create.contractAmount": "",  // TODO: 添加中文翻译
  "workbench.create.contractName": "",  // TODO: 添加中文翻译
  "workbench.create.customer": "",  // TODO: 添加中文翻译
  "workbench.create.customerName": "",  // TODO: 添加中文翻译
  "workbench.create.customerType": "",  // TODO: 添加中文翻译
  "workbench.create.enterAmount": "",  // TODO: 添加中文翻译
  "workbench.create.enterPhone": "",  // TODO: 添加中文翻译
  "workbench.create.enterpriseCustomer": "",  // TODO: 添加中文翻译
  "workbench.create.expectedAmount": "",  // TODO: 添加中文翻译
  "workbench.create.governmentCustomer": "",  // TODO: 添加中文翻译
  "workbench.create.individualCustomer": "",  // TODO: 添加中文翻译
  "workbench.create.invalidPhone": "",  // TODO: 添加中文翻译
  "workbench.create.opportunity": "",  // TODO: 添加中文翻译
  "workbench.create.opportunityName": "",  // TODO: 添加中文翻译
  "workbench.create.opportunityStage": "",  // TODO: 添加中文翻译
  "workbench.create.phone": "",  // TODO: 添加中文翻译
  "workbench.create.selectCustomer": "",  // TODO: 添加中文翻译
  "workbench.create.selectCustomerType": "",  // TODO: 添加中文翻译
  "workbench.create.selectSignDate": "",  // TODO: 添加中文翻译
  "workbench.create.selectStage": "",  // TODO: 添加中文翻译
  "workbench.create.signDate": "",  // TODO: 添加中文翻译
  "workbench.create.stageClosed": "",  // TODO: 添加中文翻译
  "workbench.create.stageLead": "",  // TODO: 添加中文翻译
  "workbench.create.stageNegotiation": "",  // TODO: 添加中文翻译
  "workbench.create.stageProposal": "",  // TODO: 添加中文翻译
  "workbench.create.stageQualify": "",  // TODO: 添加中文翻译
  "workbench.create.validationFailed": "",  // TODO: 添加中文翻译
  "workbench.todo.call": "",  // TODO: 添加中文翻译
```
