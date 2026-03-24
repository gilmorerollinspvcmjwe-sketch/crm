/**
 * 添加缺失的 i18n 翻译 key
 * 根据审计报告添加 520 个缺失的 key
 */

const fs = require('fs');
const path = require('path');

// 读取现有翻译文件
const enPath = path.join(__dirname, '../src/i18n/locales/en.json');
const zhPath = path.join(__dirname, '../src/i18n/locales/zh.json');

const enJson = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
const zhJson = JSON.parse(fs.readFileSync(zhPath, 'utf-8'));

// 需要添加的翻译 key（来自审计报告）
const missingKeys = {
  // ========== common ==========
  "common.unit.record": { en: "record", zh: "条" },
  "common.comingSoon": { en: "Coming Soon", zh: "即将推出" },
  "common.copy": { en: "Copy", zh: "复制" },
  "common.createSuccess": { en: "Created Successfully", zh: "创建成功" },
  "common.deleteSuccess": { en: "Deleted Successfully", zh: "删除成功" },
  "common.updateSuccess": { en: "Updated Successfully", zh: "更新成功" },
  "common.description": { en: "Description", zh: "描述" },
  "common.none": { en: "None", zh: "无" },
  "common.select": { en: "Select", zh: "选择" },
  "common.to": { en: "To", zh: "至" },
  
  // ========== common.actions ==========
  "common.actions.cancel": { en: "Cancel", zh: "取消" },
  "common.actions.confirm": { en: "Confirm", zh: "确认" },
  "common.actions.confirmDelete": { en: "Confirm Delete", zh: "确认删除" },
  "common.actions.edit": { en: "Edit", zh: "编辑" },
  "common.actions.reset": { en: "Reset", zh: "重置" },
  "common.actions.search": { en: "Search", zh: "搜索" },

  // ========== product.selector ==========
  "product.selector.title": { en: "Select Product", zh: "选择产品" },
  "product.selector.allCategories": { en: "All Categories", zh: "全部分类" },
  "product.selector.category": { en: "Category", zh: "分类" },
  "product.selector.categoryFilter": { en: "Category Filter", zh: "分类筛选" },
  "product.selector.confirm": { en: "Confirm", zh: "确认" },
  "product.selector.description": { en: "Description", zh: "描述" },
  "product.selector.inStock": { en: "In Stock", zh: "有库存" },
  "product.selector.outOfStock": { en: "Out of Stock", zh: "缺货" },
  "product.selector.productName": { en: "Product Name", zh: "产品名称" },
  "product.selector.searchPlaceholder": { en: "Search product name, SKU...", zh: "搜索产品名称、编码..." },
  "product.selector.sku": { en: "SKU", zh: "产品编码" },
  "product.selector.stock": { en: "Stock", zh: "库存" },
  "product.selector.unit": { en: "Unit", zh: "单位" },
  "product.selector.unitPrice": { en: "Unit Price", zh: "单价" },

  // ========== product.list ==========
  "product.list.categoryFilter": { en: "Category Filter", zh: "分类筛选" },
  "product.list.columnCategory": { en: "Category", zh: "分类" },
  "product.list.columnCostPrice": { en: "Cost Price", zh: "成本价" },
  "product.list.columnModel": { en: "Model", zh: "型号" },
  "product.list.columnName": { en: "Product Name", zh: "产品名称" },
  "product.list.columnSku": { en: "SKU", zh: "产品编码" },
  "product.list.columnSpec": { en: "Spec", zh: "规格" },
  "product.list.columnStatus": { en: "Status", zh: "状态" },
  "product.list.columnStock": { en: "Stock", zh: "库存" },
  "product.list.columnUnitPrice": { en: "Unit Price", zh: "单价" },
  "product.list.delete": { en: "Delete", zh: "删除" },
  "product.list.deleteConfirm": { en: "Are you sure to delete this product?", zh: "确定要删除该产品吗？" },
  "product.list.deleteFailed": { en: "Delete failed", zh: "删除失败" },
  "product.list.deleteSuccess": { en: "Deleted successfully", zh: "删除成功" },
  "product.list.edit": { en: "Edit", zh: "编辑" },
  "product.list.import": { en: "Import", zh: "导入" },
  "product.list.inStock": { en: "In Stock", zh: "有库存" },
  "product.list.loadFailed": { en: "Failed to load", zh: "加载失败" },
  "product.list.newProduct": { en: "New Product", zh: "新建产品" },
  "product.list.outOfStock": { en: "Out of Stock", zh: "缺货" },
  "product.list.searchPlaceholder": { en: "Search product name, SKU...", zh: "搜索产品名称、编码..." },
  "product.list.statusActive": { en: "Active", zh: "上架" },
  "product.list.statusInactive": { en: "Inactive", zh: "下架" },

  // ========== product.detail ==========
  "product.detail.back": { en: "Back", zh: "返回" },
  "product.detail.basicInfo": { en: "Basic Info", zh: "基本信息" },
  "product.detail.createdAt": { en: "Created At", zh: "创建时间" },
  "product.detail.description": { en: "Description", zh: "描述" },
  "product.detail.edit": { en: "Edit", zh: "编辑" },
  "product.detail.loadFailed": { en: "Failed to load", zh: "加载失败" },
  "product.detail.notExist": { en: "Product not found", zh: "产品不存在" },
  "product.detail.productCategory": { en: "Category", zh: "产品分类" },
  "product.detail.productName": { en: "Product Name", zh: "产品名称" },
  "product.detail.productNumber": { en: "Product Number", zh: "产品编号" },
  "product.detail.specs": { en: "Specs", zh: "规格参数" },
  "product.detail.stockStatus": { en: "Stock Status", zh: "库存状态" },
  "product.detail.unit": { en: "Unit", zh: "单位" },
  "product.detail.unitPrice": { en: "Unit Price", zh: "单价" },
  "product.detail.updatedAt": { en: "Updated At", zh: "更新时间" },

  // ========== quote.calculator ==========
  "quote.calculator.actions": { en: "Actions", zh: "操作" },
  "quote.calculator.discount": { en: "Discount", zh: "折扣" },
  "quote.calculator.grandTotal": { en: "Grand Total", zh: "总计" },
  "quote.calculator.productName": { en: "Product Name", zh: "产品名称" },
  "quote.calculator.quantity": { en: "Quantity", zh: "数量" },
  "quote.calculator.subtotal": { en: "Subtotal", zh: "小计" },
  "quote.calculator.tax": { en: "Tax", zh: "税费" },
  "quote.calculator.total": { en: "Total", zh: "合计" },
  "quote.calculator.unitPrice": { en: "Unit Price", zh: "单价" },

  // ========== quote.preview ==========
  "quote.preview.discount": { en: "Discount", zh: "折扣" },
  "quote.preview.productName": { en: "Product Name", zh: "产品名称" },
  "quote.preview.quantity": { en: "Quantity", zh: "数量" },
  "quote.preview.subtotal": { en: "Subtotal", zh: "小计" },
  "quote.preview.tax": { en: "Tax", zh: "税费" },
  "quote.preview.toBeGenerated": { en: "To be generated", zh: "待生成" },
  "quote.preview.total": { en: "Total", zh: "总计" },
  "quote.preview.unitPrice": { en: "Unit Price", zh: "单价" },

  // ========== quote.builder ==========
  "quote.builder.customerInfo": { en: "Customer Info", zh: "客户信息" },
  "quote.builder.edit": { en: "Edit", zh: "编辑" },
  "quote.builder.mockDataNote": { en: "Note: Using mock data for demo", zh: "注意：演示使用模拟数据" },
  "quote.builder.new": { en: "New Quote", zh: "新建报价单" },
  "quote.builder.noContact": { en: "No contact selected", zh: "未选择联系人" },
  "quote.builder.noCustomer": { en: "No customer selected", zh: "未选择客户" },
  "quote.builder.notSet": { en: "Not set", zh: "未设置" },
  "quote.builder.pdfExporting": { en: "Exporting PDF...", zh: "正在导出 PDF..." },
  "quote.builder.selectProduct": { en: "Select Product", zh: "选择产品" },
  "quote.builder.step1Title": { en: "Customer Info", zh: "客户信息" },
  "quote.builder.step1Desc": { en: "Fill in quote basic info", zh: "填写报价单基本信息" },
  "quote.builder.step2Title": { en: "Select Products", zh: "选择产品" },
  "quote.builder.step2Desc": { en: "Add quote product details", zh: "添加报价产品明细" },
  "quote.builder.step3Title": { en: "Preview Confirm", zh: "预览确认" },
  "quote.builder.step3Desc": { en: "Preview quote and confirm", zh: "预览报价单并确认" },

  // ========== contact ==========
  "contact.jobLevel.executive": { en: "Executive", zh: "高管" },
  "contact.jobLevel.junior": { en: "Junior", zh: "基层" },
  "contact.jobLevel.middle": { en: "Middle", zh: "中层" },
  "contact.jobLevel.other": { en: "Other", zh: "其他" },
  "contact.table.actions": { en: "Actions", zh: "操作" },
  "contact.table.confirmDelete": { en: "Are you sure to delete this contact?", zh: "确定要删除该联系人吗？" },
  "contact.table.createdAt": { en: "Created At", zh: "创建时间" },
  "contact.table.customerName": { en: "Customer", zh: "所属客户" },
  "contact.table.decisionRole": { en: "Decision Role", zh: "决策角色" },
  "contact.table.delete": { en: "Delete", zh: "删除" },
  "contact.table.edit": { en: "Edit", zh: "编辑" },
  "contact.table.email": { en: "Email", zh: "邮箱" },
  "contact.table.jobLevel": { en: "Job Level", zh: "职级" },
  "contact.table.mobile": { en: "Mobile", zh: "手机" },
  "contact.table.name": { en: "Name", zh: "姓名" },
  "contact.table.owner": { en: "Owner", zh: "负责人" },
  "contact.table.position": { en: "Position", zh: "职位" },
  "contact.table.viewDetail": { en: "View Detail", zh: "查看详情" },
  "contact.table.wechat": { en: "WeChat", zh: "微信" },
  "contact.filter.customerName": { en: "Customer Name", zh: "客户名称" },
  "contact.filter.customerNamePlaceholder": { en: "Enter customer name", zh: "请输入客户名称" },
  "contact.filter.name": { en: "Name", zh: "姓名" },
  "contact.filter.namePlaceholder": { en: "Enter name", zh: "请输入姓名" },
  "contact.filter.position": { en: "Position", zh: "职位" },
  "contact.filter.positionPlaceholder": { en: "Enter position", zh: "请输入职位" },
  "contact.form.cancel": { en: "Cancel", zh: "取消" },
  "contact.form.confirm": { en: "Confirm", zh: "确认" },
  "contact.form.createTitle": { en: "New Contact", zh: "新建联系人" },
  "contact.form.customer": { en: "Customer", zh: "所属客户" },
  "contact.form.customerPlaceholder": { en: "Select customer", zh: "请选择所属客户" },
  "contact.form.editTitle": { en: "Edit Contact", zh: "编辑联系人" },
  "contact.form.email": { en: "Email", zh: "邮箱" },
  "contact.form.emailPlaceholder": { en: "Enter email", zh: "请输入邮箱" },
  "contact.form.female": { en: "Female", zh: "女" },
  "contact.form.gender": { en: "Gender", zh: "性别" },
  "contact.form.male": { en: "Male", zh: "男" },
  "contact.form.mobile": { en: "Mobile", zh: "手机号" },
  "contact.form.mobilePlaceholder": { en: "Enter mobile", zh: "请输入手机号" },
  "contact.form.name": { en: "Name", zh: "姓名" },
  "contact.form.namePlaceholder": { en: "Enter name", zh: "请输入姓名" },
  "contact.form.nameRequired": { en: "Name is required", zh: "请输入姓名" },
  "contact.form.position": { en: "Position", zh: "职位" },
  "contact.form.positionPlaceholder": { en: "Enter position", zh: "请输入职位" },
  "contact.form.remark": { en: "Remark", zh: "备注" },
  "contact.form.remarkPlaceholder": { en: "Enter remark", zh: "请输入备注信息" },
  "contact.form.wechat": { en: "WeChat", zh: "微信" },
  "contact.form.wechatPlaceholder": { en: "Enter WeChat ID", zh: "请输入微信号" },
  "contact.list.confirmDelete": { en: "Confirm Delete", zh: "确认删除" },
  "contact.list.confirmDeleteBtn": { en: "Confirm Delete", zh: "确认删除" },
  "contact.list.confirmDeleteContent": { en: "Are you sure to delete this contact? This action cannot be undone.", zh: "确定要删除该联系人吗？删除后无法恢复。" },
  "contact.list.createContact": { en: "New Contact", zh: "新建联系人" },
  "contact.list.createSuccess": { en: "Created successfully", zh: "创建成功" },
  "contact.list.deleteSuccess": { en: "Deleted successfully", zh: "删除成功" },
  "contact.list.editSuccess": { en: "Updated successfully", zh: "编辑成功" },
  "contact.list.loadFailed": { en: "Failed to load", zh: "加载失败" },
  "contact.list.title": { en: "Contact List", zh: "联系人列表" },

  // ========== payment.detail ==========
  "payment.detail.paidAmount": { en: "Paid Amount", zh: "已回款" },
  "payment.detail.paymentPeriods": { en: "Payment Periods", zh: "回款期数" },
  "payment.detail.totalAmount": { en: "Total Amount", zh: "合同总额" },

  // ========== ai.agents ==========
  "ai.agents.activeAgents": { en: "Active Agents", zh: "运行中 Agent" },
  "ai.agents.activeAgentsDesc": { en: "Currently running agents", zh: "当前活跃运行的 Agent" },
  "ai.agents.agents": { en: "Agents", zh: "智能体" },
  "ai.agents.allStatuses": { en: "All Status", zh: "全部状态" },
  "ai.agents.avgSuccessRateDesc": { en: "Average success rate of all agents", zh: "所有 Agent 的平均成功率" },
  "ai.agents.count": { en: "Count", zh: "数量" },
  "ai.agents.details": { en: "Details", zh: "详情" },
  "ai.agents.filterStatus": { en: "Filter by Status", zh: "按状态筛选" },
  "ai.agents.filterType": { en: "Filter by Type", zh: "按类型筛选" },
  "ai.agents.noMatching": { en: "No matching agents found", zh: "未找到匹配的 AI Agent" },
  "ai.agents.responseTime": { en: "Response Time", zh: "响应时间" },
  "ai.agents.satisfaction": { en: "Satisfaction", zh: "满意度" },
  "ai.agents.statusActive": { en: "Active", zh: "运行中" },
  "ai.agents.statusError": { en: "Error", zh: "异常" },
  "ai.agents.statusInactive": { en: "Inactive", zh: "已停用" },
  "ai.agents.statusTraining": { en: "Training", zh: "训练中" },
  "ai.agents.successRate": { en: "Success Rate", zh: "成功率" },
  "ai.agents.totalAgentsDesc": { en: "Total number of created agents", zh: "已创建的 AI Agent 数量" },
  "ai.agents.totalExecutionsDesc": { en: "Total task executions", zh: "累计执行任务次数" },
  "ai.agents.totalMatching": { en: "{{count}} agents found", zh: "共 {{count}} 个 Agent" },
  "ai.agents.typeAnalytical": { en: "Analytical", zh: "分析型" },
  "ai.agents.typeAutomation": { en: "Automation", zh: "自动化" },
  "ai.agents.typeConversational": { en: "Conversational", zh: "对话型" },
  "ai.agents.typeGenerative": { en: "Generative", zh: "生成型" },
  "ai.agents.typePredictive": { en: "Predictive", zh: "预测型" },
  "ai.agents.typeRecommendation": { en: "Recommendation", zh: "推荐型" },

  // ========== ai.agentDetail ==========
  "ai.agentDetail.accuracyCompare": { en: "Accuracy Comparison", zh: "准确率对比" },
  "ai.agentDetail.accuracyRate": { en: "Accuracy Rate", zh: "准确率" },
  "ai.agentDetail.action": { en: "Action", zh: "操作" },
  "ai.agentDetail.avgResponse": { en: "Avg Response", zh: "平均响应" },
  "ai.agentDetail.back": { en: "Back", zh: "返回" },
  "ai.agentDetail.capabilityList": { en: "Capabilities", zh: "能力列表" },
  "ai.agentDetail.confidence": { en: "Confidence", zh: "置信度" },
  "ai.agentDetail.detailMetrics": { en: "Detailed Metrics", zh: "详细指标" },
  "ai.agentDetail.duration": { en: "Duration", zh: "耗时" },
  "ai.agentDetail.effectStats": { en: "Performance Stats", zh: "效果统计" },
  "ai.agentDetail.errorCount": { en: "Error Count", zh: "错误次数" },
  "ai.agentDetail.executionLogs": { en: "Execution Logs", zh: "执行日志" },
  "ai.agentDetail.executions": { en: "Executions", zh: "执行次数" },
  "ai.agentDetail.failed": { en: "Failed", zh: "失败" },
  "ai.agentDetail.input": { en: "Input", zh: "输入" },
  "ai.agentDetail.last7DaysTrend": { en: "Last 7 Days Trend", zh: "近 7 天执行趋势" },
  "ai.agentDetail.output": { en: "Output", zh: "输出" },
  "ai.agentDetail.overview": { en: "Overview", zh: "概览" },
  "ai.agentDetail.publicScope": { en: "Public Scope", zh: "公开范围" },
  "ai.agentDetail.satisfaction": { en: "Satisfaction", zh: "满意度" },
  "ai.agentDetail.seconds": { en: "seconds", zh: "秒" },
  "ai.agentDetail.specifiedUsers": { en: "Specified Users", zh: "指定用户" },
  "ai.agentDetail.status": { en: "Status", zh: "状态" },
  "ai.agentDetail.success": { en: "Success", zh: "成功" },
  "ai.agentDetail.successRate": { en: "Success Rate", zh: "成功率" },
  "ai.agentDetail.timeout": { en: "Timeout", zh: "超时" },
  "ai.agentDetail.times": { en: "times", zh: "次" },
  "ai.agentDetail.timestamp": { en: "Timestamp", zh: "时间" },
  "ai.agentDetail.totalExecutions": { en: "Total Executions", zh: "总执行次数" },
  "ai.agentDetail.visibleToAll": { en: "Visible to All", zh: "所有人可见" },

  // ========== ai.churnWarning ==========
  "ai.churnWarning.actions": { en: "Actions", zh: "操作" },
  "ai.churnWarning.admin": { en: "Admin", zh: "管理员" },
  "ai.churnWarning.aiSuggestions": { en: "AI Suggestions", zh: "AI 挽回建议" },
  "ai.churnWarning.basicInfo": { en: "Basic Info", zh: "基本信息" },
  "ai.churnWarning.complaintCount": { en: "Complaint Count", zh: "投诉次数" },
  "ai.churnWarning.contractExpiry": { en: "Contract Expiry", zh: "合同到期" },
  "ai.churnWarning.customerName": { en: "Customer Name", zh: "客户名称" },
  "ai.churnWarning.daysUnit": { en: "days", zh: "天" },
  "ai.churnWarning.details": { en: "Details", zh: "详情" },
  "ai.churnWarning.highRiskCustomers": { en: "High Risk Customers", zh: "高风险客户" },
  "ai.churnWarning.lastContactDays": { en: "Days Since Last Contact", zh: "距离上次联系" },
  "ai.churnWarning.markAsProcessed": { en: "Mark as Processed", zh: "标记已处理" },
  "ai.churnWarning.mediumRiskCustomers": { en: "Medium Risk Customers", zh: "中风险客户" },
  "ai.churnWarning.needImmediateAction": { en: "Need Immediate Action", zh: "需立即处理" },
  "ai.churnWarning.none": { en: "None", zh: "无" },
  "ai.churnWarning.owner": { en: "Owner", zh: "负责人" },
  "ai.churnWarning.riskAnalysis": { en: "Risk Analysis", zh: "风险因素分析" },
  "ai.churnWarning.riskFactors": { en: "Risk Factors", zh: "风险因素" },
  "ai.churnWarning.riskHigh": { en: "High Risk", zh: "高风险" },
  "ai.churnWarning.riskLevel": { en: "Risk Level", zh: "风险等级" },
  "ai.churnWarning.riskLow": { en: "Low Risk", zh: "低风险" },
  "ai.churnWarning.riskMedium": { en: "Medium Risk", zh: "中风险" },
  "ai.churnWarning.riskScore": { en: "Risk Score", zh: "风险分" },
  "ai.churnWarning.status": { en: "Status", zh: "状态" },
  "ai.churnWarning.timesUnit": { en: "times", zh: "次" },

  // ========== ai.customerSegmentation ==========
  "ai.customerSegmentation.customer": { en: "Customer", zh: "客户" },
  "ai.customerSegmentation.customerList": { en: "Customer List", zh: "客户列表" },
  "ai.customerSegmentation.customerName": { en: "Customer Name", zh: "客户名称" },
  "ai.customerSegmentation.customers": { en: "Customers", zh: "客户" },
  "ai.customerSegmentation.daysUnit": { en: "days", zh: "天" },
  "ai.customerSegmentation.frequencyChart": { en: "Frequency Chart", zh: "消费频率图表" },
  "ai.customerSegmentation.frequencyUnit": { en: "times/year", zh: "次/年" },
  "ai.customerSegmentation.lastPurchase": { en: "Last Purchase", zh: "最后购买" },
  "ai.customerSegmentation.monetaryChart": { en: "Monetary Chart", zh: "消费金额图表" },
  "ai.customerSegmentation.monetaryUnit": { en: "thousand", zh: "千元" },
  "ai.customerSegmentation.owner": { en: "Owner", zh: "负责人" },
  "ai.customerSegmentation.quantity": { en: "Quantity", zh: "数量" },
  "ai.customerSegmentation.recencyDays": { en: "Recency (days)", zh: "最近消费 (天)" },
  "ai.customerSegmentation.rfmRadar": { en: "RFM Radar", zh: "RFM 特征雷达图" },
  "ai.customerSegmentation.rfmRadarDesc": { en: "RFM features comparison", zh: "各群体的 RFM 特征对比" },
  "ai.customerSegmentation.scatterChartDesc": { en: "Customer Distribution", zh: "客户分布散点图" },
  "ai.customerSegmentation.segmentFeatures": { en: "Segment Features", zh: "各群体特征详情" },
  "ai.customerSegmentation.segmentPieChart": { en: "Segment Pie Chart", zh: "客户群体占比" },
  "ai.customerSegmentation.totalCustomers": { en: "Total Customers", zh: "客户总数" },
  "ai.customerSegmentation.totalValue": { en: "Total Value", zh: "总价值" },

  // ========== ai.leadScoring ==========
  "ai.leadScoring.actions": { en: "Actions", zh: "操作" },
  "ai.leadScoring.activityParticipation": { en: "Activity Participation", zh: "活动参与" },
  "ai.leadScoring.aiScore": { en: "AI Score", zh: "AI 评分" },
  "ai.leadScoring.attributeScore": { en: "Attribute Score", zh: "属性分" },
  "ai.leadScoring.attributeScoreTitle": { en: "Attribute Score (60 pts)", zh: "属性分 (60 分)" },
  "ai.leadScoring.attributeTotal": { en: "Attribute Total", zh: "属性分总计" },
  "ai.leadScoring.behaviorScore": { en: "Behavior Score", zh: "行为分" },
  "ai.leadScoring.behaviorScoreTitle": { en: "Behavior Score (40 pts)", zh: "行为分 (40 分)" },
  "ai.leadScoring.behaviorTotal": { en: "Behavior Total", zh: "行为分总计" },
  "ai.leadScoring.companySize": { en: "Company Size", zh: "公司规模" },
  "ai.leadScoring.emailOpen": { en: "Email Open", zh: "邮件打开" },
  "ai.leadScoring.highValue": { en: "High Value", zh: "高价值" },
  "ai.leadScoring.industry": { en: "Industry", zh: "行业" },
  "ai.leadScoring.industryMatch": { en: "Industry Match", zh: "行业匹配" },
  "ai.leadScoring.lastActivity": { en: "Last Activity", zh: "最后活动" },
  "ai.leadScoring.leadName": { en: "Lead Name", zh: "线索名称" },
  "ai.leadScoring.level": { en: "Level", zh: "等级" },
  "ai.leadScoring.levelSuffix": { en: " Level", zh: " 级" },
  "ai.leadScoring.manualAdjustment": { en: "Manual Adjustment", zh: "手动调整评分" },
  "ai.leadScoring.owner": { en: "Owner", zh: "负责人" },
  "ai.leadScoring.points": { en: "points", zh: "分" },
  "ai.leadScoring.positionLevel": { en: "Position Level", zh: "职位级别" },
  "ai.leadScoring.saveAdjustment": { en: "Save Adjustment", zh: "保存调整" },
  "ai.leadScoring.scoreDetails": { en: "Score Details", zh: "评分详情" },
  "ai.leadScoring.scoreDimensions": { en: "Score Dimensions", zh: "评分维度详情" },
  "ai.leadScoring.totalScore": { en: "Total Score", zh: "总分" },
  "ai.leadScoring.websiteVisit": { en: "Website Visit", zh: "网站访问" },

  // ========== ai.meetingAssistant ==========
  "ai.meetingAssistant.actionItems": { en: "Action Items", zh: "待办事项" },
  "ai.meetingAssistant.aiSummary": { en: "AI Summary", zh: "AI 会议纪要" },
  "ai.meetingAssistant.assignee": { en: "Assignee", zh: "负责人" },
  "ai.meetingAssistant.completed": { en: "Completed", zh: "已完成" },
  "ai.meetingAssistant.date": { en: "Date", zh: "日期" },
  "ai.meetingAssistant.dueDate": { en: "Due Date", zh: "截止日期" },
  "ai.meetingAssistant.duration": { en: "Duration", zh: "时长" },
  "ai.meetingAssistant.exportNotes": { en: "Export Notes", zh: "导出纪要" },
  "ai.meetingAssistant.host": { en: "Host", zh: "主持" },
  "ai.meetingAssistant.keywords": { en: "Keywords", zh: "关键词" },
  "ai.meetingAssistant.meetingDate": { en: "Meeting Date", zh: "会议日期" },
  "ai.meetingAssistant.meetingDetails": { en: "Meeting Details", zh: "会议详情" },
  "ai.meetingAssistant.meetingInfo": { en: "Meeting Info", zh: "会议信息" },
  "ai.meetingAssistant.meetingTime": { en: "Meeting Time", zh: "会议时间" },
  "ai.meetingAssistant.none": { en: "None", zh: "无" },
  "ai.meetingAssistant.participants": { en: "Participants", zh: "参会人员" },
  "ai.meetingAssistant.participantsCount": { en: "{{count}} participants", zh: "{{count}} 人参会" },
  "ai.meetingAssistant.pending": { en: "Pending", zh: "待完成" },
  "ai.meetingAssistant.people": { en: "people", zh: "人" },
  "ai.meetingAssistant.priority": { en: "Priority", zh: "优先级" },
  "ai.meetingAssistant.priorityHigh": { en: "High", zh: "高" },
  "ai.meetingAssistant.priorityLow": { en: "Low", zh: "低" },
  "ai.meetingAssistant.priorityMedium": { en: "Medium", zh: "中" },
  "ai.meetingAssistant.sentiment": { en: "Sentiment", zh: "会议情感" },
  "ai.meetingAssistant.sentimentNegative": { en: "Negative", zh: "消极" },
  "ai.meetingAssistant.sentimentNeutral": { en: "Neutral", zh: "中性" },
  "ai.meetingAssistant.sentimentPositive": { en: "Positive", zh: "积极" },
  "ai.meetingAssistant.time": { en: "Time", zh: "时间" },
  "ai.meetingAssistant.todos": { en: "Todos", zh: "待办" },
  "ai.meetingAssistant.transcript": { en: "Transcript", zh: "录音转写" },
  "ai.meetingAssistant.unassigned": { en: "Unassigned", zh: "未分配" },

  // ========== ai.predictiveAI ==========
  "ai.predictiveAI.accuracy": { en: "Accuracy", zh: "准确率" },
  "ai.predictiveAI.actual": { en: "Actual", zh: "实际" },
  "ai.predictiveAI.avgAccuracyDesc": { en: "Average accuracy of all prediction models", zh: "所有预测模型的平均准确率" },
  "ai.predictiveAI.confidence": { en: "Confidence", zh: "置信度" },
  "ai.predictiveAI.correctPredictionsDesc": { en: "Number of correct predictions", zh: "预测准确的次数" },
  "ai.predictiveAI.last12Months": { en: "Last 12 Months", zh: "近 12 个月" },
  "ai.predictiveAI.last6Months": { en: "Last 6 Months", zh: "近 6 个月" },
  "ai.predictiveAI.meanAbsoluteError": { en: "Mean Absolute Error (MAE)", zh: "平均绝对误差 (MAE)" },
  "ai.predictiveAI.modelCount": { en: "Model Count", zh: "预测模型数" },
  "ai.predictiveAI.modelCountDesc": { en: "Active prediction models", zh: "正在运行的预测模型" },
  "ai.predictiveAI.models": { en: "Models", zh: "模型" },
  "ai.predictiveAI.predicted": { en: "Predicted", zh: "预测" },
  "ai.predictiveAI.predictionMetric": { en: "Prediction Metric", zh: "预测指标" },
  "ai.predictiveAI.rootMeanSquareError": { en: "Root Mean Square Error (RMSE)", zh: "均方根误差 (RMSE)" },
  "ai.predictiveAI.salesTrend": { en: "Sales Trend", zh: "销售预测趋势" },
  "ai.predictiveAI.totalPredictionsDesc": { en: "Total prediction analysis runs", zh: "累计执行预测分析次数" },

  // ========== ai.salesForecast ==========
  "ai.salesForecast.exceeded": { en: "Exceeded", zh: "超额" },
  "ai.salesForecast.monthly": { en: "Monthly", zh: "按月" },
  "ai.salesForecast.predicted": { en: "Predicted", zh: "预测" },
  "ai.salesForecast.predictedAmount": { en: "Predicted Amount", zh: "预测金额" },
  "ai.salesForecast.predictionAccuracy": { en: "Prediction Accuracy", zh: "预测准确率" },
  "ai.salesForecast.product": { en: "Product", zh: "产品" },
  "ai.salesForecast.quarterly": { en: "Quarterly", zh: "按季" },
  "ai.salesForecast.thisMonthPrediction": { en: "This Month Prediction", zh: "本月预测" },
  "ai.salesForecast.trend": { en: "Trend", zh: "趋势" },
  "ai.salesForecast.trendDown": { en: "Down", zh: "下降" },
  "ai.salesForecast.trendStable": { en: "Stable", zh: "平稳" },
  "ai.salesForecast.trendUp": { en: "Up", zh: "上升" },
  "ai.salesForecast.vsLastPeriod": { en: "vs Last Period", zh: "相比上期" },
  "ai.salesForecast.yearly": { en: "Yearly", zh: "按年" },

  // ========== report.timeRange ==========
  "report.timeRange.week": { en: "This Week", zh: "本周" },
  "report.timeRange.month": { en: "This Month", zh: "本月" },
  "report.timeRange.quarter": { en: "This Quarter", zh: "本季度" },
  "report.timeRange.year": { en: "This Year", zh: "本年" },

  // ========== report.activity ==========
  "report.activity.completionRate": { en: "Completion Rate", zh: "完成率" },
  "report.activity.count": { en: "Count", zh: "数量" },
  "report.activity.followUpCount": { en: "Follow-up Count", zh: "跟进数量" },
  "report.activity.followUpType": { en: "Follow-up Type", zh: "跟进类型" },
  "report.activity.percentage": { en: "Percentage", zh: "占比" },
  "report.activity.rank": { en: "Rank", zh: "排名" },
  "report.activity.sales": { en: "Sales", zh: "销售" },

  // ========== report.customer ==========
  "report.customer.customerCount": { en: "Customer Count", zh: "客户数" },
  "report.customer.industry": { en: "Industry", zh: "行业" },
  "report.customer.level": { en: "Level", zh: "等级" },
  "report.customer.levelSuffix": { en: " Level", zh: " 级" },
  "report.customer.newCustomers": { en: "New Customers", zh: "新增客户" },
  "report.customer.newIn12Months": { en: "New in December", zh: "12 月新增" },
  "report.customer.percentage": { en: "Percentage", zh: "占比" },
  "report.customer.totalCustomersChart": { en: "Total Customers Chart", zh: "客户总数图表" },

  // ========== report.leadConversion ==========
  "report.leadConversion.channel": { en: "Channel", zh: "渠道" },
  "report.leadConversion.channelAnalysis": { en: "Channel Analysis", zh: "渠道效果分析" },
  "report.leadConversion.conversionCycle": { en: "Conversion Cycle", zh: "转化周期" },
  "report.leadConversion.convertedChart": { en: "Converted Chart", zh: "转化图表" },
  "report.leadConversion.convertedCount": { en: "Converted Count", zh: "转化数" },
  "report.leadConversion.cycleDetails": { en: "Cycle Details", zh: "转化周期详情" },
  "report.leadConversion.leadCount": { en: "Lead Count", zh: "线索数" },
  "report.leadConversion.leadsChart": { en: "Leads Chart", zh: "线索图表" },

  // ========== report.payment ==========
  "report.payment.actualCollection": { en: "Actual Collection", zh: "实际回款" },
  "report.payment.aging": { en: "Aging", zh: "账龄" },
  "report.payment.amount": { en: "Amount", zh: "金额" },
  "report.payment.attentionDays": { en: "31-60 Days", zh: "31-60 天" },
  "report.payment.customer": { en: "Customer", zh: "客户" },
  "report.payment.normalDays": { en: "0-30 Days", zh: "0-30 天" },
  "report.payment.plannedCollection": { en: "Planned Collection", zh: "计划回款" },
  "report.payment.receivableAmount": { en: "Receivable Amount", zh: "应收金额" },
  "report.payment.riskCritical": { en: "Critical", zh: "严重" },
  "report.payment.riskDays": { en: "Risk Days", zh: "风险天数" },
  "report.payment.riskHigh": { en: "High Risk", zh: "高风险" },
  "report.payment.riskLevel": { en: "Risk Level", zh: "风险等级" },
  "report.payment.riskLow": { en: "Low Risk", zh: "低风险" },
  "report.payment.riskMedium": { en: "Medium Risk", zh: "中风险" },
  "report.payment.status": { en: "Status", zh: "状态" },
  "report.payment.statusNormal": { en: "Normal", zh: "正常" },
  "report.payment.statusOverdue": { en: "Overdue", zh: "逾期" },
  "report.payment.statusWarning": { en: "Warning", zh: "预警" },

  // ========== report.performance ==========
  "report.performance.actual": { en: "Actual", zh: "实际完成" },
  "report.performance.actualChart": { en: "Actual Chart", zh: "实际完成图表" },
  "report.performance.completionRate": { en: "Completion Rate", zh: "完成率" },
  "report.performance.rank": { en: "Rank", zh: "排名" },
  "report.performance.sales": { en: "Sales", zh: "销售" },
  "report.performance.target": { en: "Target", zh: "目标" },
  "report.performance.targetChart": { en: "Target Chart", zh: "目标图表" },
  "report.performance.team": { en: "Team", zh: "团队" },

  // ========== opportunity.detail ==========
  "opportunity.detail.contacts": { en: "Contacts", zh: "联系人" },
  "opportunity.detail.contracts": { en: "Contracts", zh: "合同" },
  "opportunity.detail.createQuote": { en: "Create Quote", zh: "新建报价" },
  "opportunity.detail.detailInfo": { en: "Detail Info", zh: "详细信息" },
  "opportunity.detail.markLost": { en: "Mark as Lost", zh: "标记输单" },
  "opportunity.detail.markLostContent": { en: "Are you sure to mark this opportunity as lost?", zh: "确定要将此商机标记为输单吗？" },
  "opportunity.detail.markWon": { en: "Mark as Won", zh: "标记赢单" },
  "opportunity.detail.markWonContent": { en: "Are you sure to mark this opportunity as won?", zh: "确定要将此商机标记为赢单吗？" },
  "opportunity.detail.noFollowUpRecords": { en: "No follow-up records", zh: "暂无跟进记录" },
  "opportunity.detail.products": { en: "Products", zh: "产品" },
  "opportunity.detail.quickChange": { en: "Quick Change", zh: "快速变更" },
  "opportunity.detail.quotes": { en: "Quotes", zh: "报价" },
  "opportunity.detail.relatedCustomer": { en: "Related Customer", zh: "关联客户" },
  "opportunity.detail.selectStage": { en: "Select Stage", zh: "选择阶段" },
  "opportunity.detail.stageChanged": { en: "Stage Changed", zh: "阶段已变更" },

  // ========== activity.form ==========
  "activity.form.editTitle": { en: "Edit Activity", zh: "编辑跟进记录" },

  // ========== order ==========
  "order.changeStatus": { en: "Change Status", zh: "变更状态" },
  "order.createdAt": { en: "Created At", zh: "创建时间" },
  "order.deleteContent": { en: "Are you sure to delete this order?", zh: "确定要删除该订单吗？" },

  // ========== permission.roles ==========
  "permission.roles.administrator": { en: "Administrator", zh: "管理员" },

  // ========== pricebook ==========
  "pricebook.detail.allCustomers": { en: "All Customers", zh: "所有客户" },
  "pricebook.detail.back": { en: "Back", zh: "返回" },
  "pricebook.detail.basicInfo": { en: "Basic Info", zh: "基本信息" },
  "pricebook.detail.columnBasePrice": { en: "Base Price", zh: "基准价格" },
  "pricebook.detail.columnEffectiveDate": { en: "Effective Date", zh: "生效日期" },
  "pricebook.detail.columnProductName": { en: "Product Name", zh: "产品名称" },
  "pricebook.detail.columnProductSku": { en: "Product SKU", zh: "产品编码" },
  "pricebook.detail.columnTiers": { en: "Price Tiers", zh: "价格阶梯" },
  "pricebook.detail.currency": { en: "Currency", zh: "币种" },
  "pricebook.detail.customer": { en: "Customer", zh: "客户" },
  "pricebook.detail.description": { en: "Description", zh: "描述" },
  "pricebook.detail.edit": { en: "Edit", zh: "编辑" },
  "pricebook.detail.loadFailed": { en: "Failed to load", zh: "加载失败" },
  "pricebook.detail.none": { en: "None", zh: "无" },
  "pricebook.detail.notExist": { en: "Pricebook not found", zh: "价格表不存在" },
  "pricebook.detail.priceItems": { en: "Price Items", zh: "价格项" },
  "pricebook.detail.pricebookName": { en: "Pricebook Name", zh: "价格表名称" },
  "pricebook.detail.status": { en: "Status", zh: "状态" },
  "pricebook.detail.type": { en: "Type", zh: "类型" },
  "pricebook.detail.validPeriod": { en: "Valid Period", zh: "有效期" },
  "pricebook.entryForm.operationFailed": { en: "Operation failed", zh: "操作失败" },
  "pricebook.entryForm.productAdded": { en: "Product added", zh: "产品已添加" },
  "pricebook.list.addProduct": { en: "Add Product", zh: "添加产品" },
  "pricebook.list.columnCustomer": { en: "Customer", zh: "客户" },
  "pricebook.list.columnItemCount": { en: "Item Count", zh: "产品数量" },
  "pricebook.list.columnName": { en: "Name", zh: "名称" },
  "pricebook.list.columnStatus": { en: "Status", zh: "状态" },
  "pricebook.list.columnType": { en: "Type", zh: "类型" },
  "pricebook.list.columnValidPeriod": { en: "Valid Period", zh: "有效期" },
  "pricebook.list.customerPricebook": { en: "Customer Pricebook", zh: "客户专属价格表" },
  "pricebook.list.delete": { en: "Delete", zh: "删除" },
  "pricebook.list.deleteConfirm": { en: "Are you sure to delete this pricebook?", zh: "确定要删除该价格表吗？" },
  "pricebook.list.deleteFailed": { en: "Delete failed", zh: "删除失败" },
  "pricebook.list.deleteSuccess": { en: "Deleted successfully", zh: "删除成功" },
  "pricebook.list.edit": { en: "Edit", zh: "编辑" },
  "pricebook.list.loadFailed": { en: "Failed to load", zh: "加载失败" },
  "pricebook.list.longTerm": { en: "Long Term", zh: "长期有效" },
  "pricebook.list.newPricebook": { en: "New Pricebook", zh: "新建价格表" },
  "pricebook.list.partnerPricebook": { en: "Partner Pricebook", zh: "合作伙伴价格表" },
  "pricebook.list.promotionPricebook": { en: "Promotion Pricebook", zh: "促销价格表" },
  "pricebook.list.searchPlaceholder": { en: "Search pricebook name...", zh: "搜索价格表名称..." },
  "pricebook.list.standardPricebook": { en: "Standard Pricebook", zh: "标准价格表" },
  "pricebook.list.statusActive": { en: "Active", zh: "启用" },
  "pricebook.list.statusDraft": { en: "Draft", zh: "草稿" },
  "pricebook.list.statusFilter": { en: "Status Filter", zh: "状态筛选" },
  "pricebook.list.statusInactive": { en: "Inactive", zh: "停用" },
  "pricebook.list.typeFilter": { en: "Type Filter", zh: "类型筛选" },

  // ========== viewManager ==========
  "viewManager.managerRole": { en: "Manager Role", zh: "经理角色" },
  "viewManager.salesRole": { en: "Sales Role", zh: "销售角色" },
  "viewManager.supportRole": { en: "Support Role", zh: "支持角色" },

  // ========== workbench.ai ==========
  "workbench.ai.createContract": { en: "Create Contract", zh: "创建合同" },
  "workbench.ai.createContractResponse": { en: "OK, I'll help you create a contract. Please fill in the contract information.", zh: "好的，我来帮您创建合同，请填写合同信息～" },
  "workbench.ai.createCustomer": { en: "Create Customer", zh: "创建客户" },
  "workbench.ai.createCustomerResponse": { en: "OK, I'll help you create a customer. Please fill in the customer information.", zh: "好的，我来帮您创建客户，请填写客户信息～" },
  "workbench.ai.createOpportunity": { en: "Create Opportunity", zh: "创建商机" },
  "workbench.ai.createOpportunityResponse": { en: "Sure, I'll help you create an opportunity. Please fill in the relevant information.", zh: "没问题，我来帮您创建商机，请填写相关信息～" },
  "workbench.ai.inputPlaceholder": { en: "Enter command...", zh: "输入指令..." },
  "workbench.ai.monthlyPerformance": { en: "Monthly Performance", zh: "本月业绩" },
  "workbench.ai.monthlyPerformanceResponse": { en: "Here is your performance for this month, keep it up!", zh: "这是您本月的业绩情况，继续加油哦～" },
  "workbench.ai.notUnderstood": { en: "I don't quite understand your request. Try the quick commands below or rephrase your question.", zh: "我暂时还不太理解您的需求，您可以试试点击下方的快捷指令，或者换个说法告诉我～" },
  "workbench.ai.performanceShown": { en: "Performance Displayed", zh: "业绩已展示" },
  "workbench.ai.quickCommands": { en: "Quick Commands:", zh: "快捷指令：" },
  "workbench.ai.send": { en: "Send", zh: "发送" },
  "workbench.ai.title": { en: "AI Assistant", zh: "AI 助手" },
  "workbench.ai.todoShown": { en: "Todo Displayed", zh: "待办已展示" },
  "workbench.ai.typing": { en: "Typing", zh: "正在输入" },
  "workbench.ai.viewTodo": { en: "View Todo", zh: "查看待办" },
  "workbench.ai.viewTodoResponse": { en: "Here are your todo items for today.", zh: "这是您今天的待办事项，请查看～" },
  "workbench.ai.welcome": { en: "Hello! I'm your AI Sales Assistant. How can I help you? Click the quick commands below or type your request.", zh: "您好！我是您的 AI 销售助手，有什么可以帮您的吗？您可以点击下方的快捷指令，或者直接输入您的需求～" },

  // ========== workbench.create ==========
  "workbench.create.contract": { en: "Contract", zh: "合同" },
  "workbench.create.contractAmount": { en: "Contract Amount", zh: "合同金额" },
  "workbench.create.contractName": { en: "Contract Name", zh: "合同名称" },
  "workbench.create.customer": { en: "Customer", zh: "客户" },
  "workbench.create.customerName": { en: "Customer Name", zh: "客户名称" },
  "workbench.create.customerType": { en: "Customer Type", zh: "客户类型" },
  "workbench.create.enterAmount": { en: "Enter amount", zh: "请输入金额" },
  "workbench.create.enterPhone": { en: "Enter phone number", zh: "请输入电话号码" },
  "workbench.create.enterpriseCustomer": { en: "Enterprise Customer", zh: "企业客户" },
  "workbench.create.expectedAmount": { en: "Expected Amount", zh: "预计金额" },
  "workbench.create.governmentCustomer": { en: "Government Customer", zh: "政府客户" },
  "workbench.create.individualCustomer": { en: "Individual Customer", zh: "个人客户" },
  "workbench.create.invalidPhone": { en: "Invalid phone number", zh: "电话号码格式不正确" },
  "workbench.create.opportunity": { en: "Opportunity", zh: "商机" },
  "workbench.create.opportunityName": { en: "Opportunity Name", zh: "商机名称" },
  "workbench.create.opportunityStage": { en: "Opportunity Stage", zh: "商机阶段" },
  "workbench.create.phone": { en: "Phone", zh: "电话" },
  "workbench.create.selectCustomer": { en: "Select Customer", zh: "选择客户" },
  "workbench.create.selectCustomerType": { en: "Select Customer Type", zh: "选择客户类型" },
  "workbench.create.selectSignDate": { en: "Select Sign Date", zh: "选择签订日期" },
  "workbench.create.selectStage": { en: "Select Stage", zh: "选择阶段" },
  "workbench.create.signDate": { en: "Sign Date", zh: "签订日期" },
  "workbench.create.stageClosed": { en: "Closed", zh: "成交" },
  "workbench.create.stageLead": { en: "Lead", zh: "线索" },
  "workbench.create.stageNegotiation": { en: "Negotiation", zh: "谈判" },
  "workbench.create.stageProposal": { en: "Proposal", zh: "方案" },
  "workbench.create.stageQualify": { en: "Qualify", zh: "资格确认" },
  "workbench.create.validationFailed": { en: "Validation Failed", zh: "表单验证失败" },

  // ========== workbench.todo ==========
  "workbench.todo.call": { en: "Call", zh: "拨打电话" },

  // ========== tab ==========
  "tab": { en: "Tab", zh: "标签页" }
};

// 设置嵌套属性
function setNestedKey(obj, key, value) {
  const keys = key.split('.');
  let current = obj;
  
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) {
      current[keys[i]] = {};
    }
    current = current[keys[i]];
  }
  
  current[keys[keys.length - 1]] = value;
}

// 添加缺失的 key
let addedCount = 0;
for (const [key, translations] of Object.entries(missingKeys)) {
  // 添加到 en.json
  const enKeys = key.split('.');
  let enCurrent = enJson;
  let enExists = true;
  
  for (let i = 0; i < enKeys.length - 1; i++) {
    if (!enCurrent[enKeys[i]]) {
      enExists = false;
      break;
    }
    enCurrent = enCurrent[enKeys[i]];
  }
  
  if (!enExists || !enCurrent[enKeys[enKeys.length - 1]]) {
    setNestedKey(enJson, key, translations.en);
    addedCount++;
  }
  
  // 添加到 zh.json
  const zhKeys = key.split('.');
  let zhCurrent = zhJson;
  let zhExists = true;
  
  for (let i = 0; i < zhKeys.length - 1; i++) {
    if (!zhCurrent[zhKeys[i]]) {
      zhExists = false;
      break;
    }
    zhCurrent = zhCurrent[zhKeys[i]];
  }
  
  if (!zhExists || !zhCurrent[zhKeys[zhKeys.length - 1]]) {
    setNestedKey(zhJson, key, translations.zh);
  }
}

// 写回文件
fs.writeFileSync(enPath, JSON.stringify(enJson, null, 2), 'utf-8');
fs.writeFileSync(zhPath, JSON.stringify(zhJson, null, 2), 'utf-8');

console.log(`✅ Added ${addedCount} missing translation keys to both en.json and zh.json`);