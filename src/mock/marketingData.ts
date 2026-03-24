/**
 * 营销自动化模块 Mock 数据
 */
import { Campaign, CampaignType, CampaignStatus, EmailTemplate, TargetList, Workflow, TriggerType, ActionType } from '../types/marketing';

/** 营销活动数据 - 12 个 */
export const campaignsData: Campaign[] = [
  {
    id: 'camp001',
    name: '2026 春季产品推广活动',
    type: CampaignType.EMAIL,
    status: CampaignStatus.RUNNING,
    goal: '提升新产品知名度，获取 500+ 潜在客户',
    budget: 50000,
    startDate: '2026-03-01',
    endDate: '2026-04-30',
    targetListId: 'list001',
    targetListName: '高价值企业客户',
    emailTemplateId: 'tmpl001',
    emailTemplateName: '新产品发布通知',
    workflowId: 'wf001',
    workflowName: '新品推广自动化流程',
    metrics: {
      sent: 2500,
      delivered: 2450,
      opened: 1225,
      clicked: 490,
      converted: 98,
      bounced: 50,
      unsubscribed: 12,
      openRate: 50.0,
      clickRate: 20.0,
      conversionRate: 4.0,
    },
    description: '针对企业客户的春季新品推广，包含产品演示邀请和限时优惠',
    owner: 'user001',
    ownerName: '张三',
    createdAt: '2026-02-15T10:00:00Z',
    updatedAt: '2026-03-12T15:30:00Z',
  },
  {
    id: 'camp002',
    name: 'Q1 客户回馈计划',
    type: CampaignType.SMS,
    status: CampaignStatus.COMPLETED,
    goal: '提升老客户复购率，目标转化率 15%',
    budget: 30000,
    startDate: '2026-01-01',
    endDate: '2026-03-31',
    targetListId: 'list002',
    targetListName: '活跃老客户',
    metrics: {
      sent: 5000,
      delivered: 4950,
      opened: 3960,
      clicked: 1485,
      converted: 743,
      bounced: 50,
      unsubscribed: 25,
      openRate: 80.0,
      clickRate: 30.0,
      conversionRate: 15.0,
    },
    description: '针对老客户的专属优惠活动，提供续费折扣和升级优惠',
    owner: 'user002',
    ownerName: '李四',
    createdAt: '2025-12-20T09:00:00Z',
    updatedAt: '2026-03-10T18:00:00Z',
  },
  {
    id: 'camp003',
    name: 'LinkedIn 行业影响力建设',
    type: CampaignType.SOCIAL,
    status: CampaignStatus.RUNNING,
    goal: '提升品牌在 LinkedIn 平台的曝光度和专业形象',
    budget: 80000,
    startDate: '2026-02-01',
    endDate: '2026-06-30',
    targetListId: 'list003',
    targetListName: '行业决策者',
    metrics: {
      sent: 1200,
      delivered: 1200,
      opened: 720,
      clicked: 288,
      converted: 58,
      bounced: 0,
      unsubscribed: 8,
      openRate: 60.0,
      clickRate: 24.0,
      conversionRate: 4.8,
    },
    description: '通过 LinkedIn 发布行业洞察、案例研究，建立思想领导力',
    owner: 'user003',
    ownerName: '王五',
    createdAt: '2026-01-25T14:00:00Z',
    updatedAt: '2026-03-11T10:00:00Z',
  },
  {
    id: 'camp004',
    name: 'AI 技术应用网络研讨会',
    type: CampaignType.WEBINAR,
    status: CampaignStatus.SCHEDULED,
    goal: '吸引 300+ 参会者，转化 50+ 销售线索',
    budget: 40000,
    startDate: '2026-04-15',
    endDate: '2026-04-15',
    targetListId: 'list004',
    targetListName: '技术兴趣客户',
    emailTemplateId: 'tmpl002',
    emailTemplateName: '网络研讨会邀请',
    workflowId: 'wf002',
    workflowName: '研讨会报名跟进流程',
    metrics: {
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      converted: 0,
      bounced: 0,
      unsubscribed: 0,
      openRate: 0,
      clickRate: 0,
      conversionRate: 0,
    },
    description: '线上研讨会，分享 AI 技术在 CRM 中的最佳实践',
    owner: 'user001',
    ownerName: '张三',
    createdAt: '2026-03-01T11:00:00Z',
    updatedAt: '2026-03-12T09:00:00Z',
  },
  {
    id: 'camp005',
    name: '上海科技峰会参展',
    type: CampaignType.EVENT,
    status: CampaignStatus.SCHEDULED,
    goal: '收集 200+ 展会线索，现场签约 10+ 客户',
    budget: 150000,
    startDate: '2026-05-20',
    endDate: '2026-05-22',
    targetListId: 'list005',
    targetListName: '华东地区企业',
    metrics: {
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      converted: 0,
      bounced: 0,
      unsubscribed: 0,
      openRate: 0,
      clickRate: 0,
      conversionRate: 0,
    },
    description: '参加上海科技峰会，展示最新产品，进行面对面商务洽谈',
    owner: 'user004',
    ownerName: '赵六',
    createdAt: '2026-02-28T16:00:00Z',
    updatedAt: '2026-03-10T14:00:00Z',
  },
  {
    id: 'camp006',
    name: '行业白皮书内容营销',
    type: CampaignType.CONTENT,
    status: CampaignStatus.RUNNING,
    goal: '下载量 1000+，获取高质量销售线索 200+',
    budget: 60000,
    startDate: '2026-03-01',
    endDate: '2026-05-31',
    targetListId: 'list006',
    targetListName: '内容营销受众',
    emailTemplateId: 'tmpl003',
    emailTemplateName: '白皮书下载确认',
    metrics: {
      sent: 1800,
      delivered: 1780,
      opened: 1068,
      clicked: 534,
      converted: 178,
      bounced: 20,
      unsubscribed: 15,
      openRate: 60.0,
      clickRate: 30.0,
      conversionRate: 10.0,
    },
    description: '发布《2026 年 CRM 行业趋势报告》，通过下载表单获取线索',
    owner: 'user002',
    ownerName: '李四',
    createdAt: '2026-02-20T10:30:00Z',
    updatedAt: '2026-03-12T16:00:00Z',
  },
  {
    id: 'camp007',
    name: 'Google 搜索广告投放',
    type: CampaignType.ADS,
    status: CampaignStatus.RUNNING,
    goal: '获取 500+ 网站访问，CPC 控制在 50 元以内',
    budget: 100000,
    startDate: '2026-03-01',
    endDate: '2026-04-30',
    metrics: {
      sent: 50000,
      delivered: 50000,
      opened: 2500,
      clicked: 1000,
      converted: 150,
      bounced: 0,
      unsubscribed: 0,
      openRate: 5.0,
      clickRate: 2.0,
      conversionRate: 0.3,
    },
    description: '针对 CRM 相关关键词的 Google 搜索广告投放',
    owner: 'user003',
    ownerName: '王五',
    createdAt: '2026-02-25T09:00:00Z',
    updatedAt: '2026-03-12T11:00:00Z',
  },
  {
    id: 'camp008',
    name: '双十一促销活动预热',
    type: CampaignType.EMAIL,
    status: CampaignStatus.DRAFT,
    goal: '提前锁定客户，目标销售额 500 万',
    budget: 80000,
    startDate: '2026-10-20',
    endDate: '2026-11-11',
    targetListId: 'list001',
    targetListName: '高价值企业客户',
    description: '双十一大促预热活动，包含优惠券发放和限时折扣',
    owner: 'user001',
    ownerName: '张三',
    createdAt: '2026-03-10T15:00:00Z',
    updatedAt: '2026-03-12T10:00:00Z',
  },
  {
    id: 'camp009',
    name: '客户成功案例系列',
    type: CampaignType.CONTENT,
    status: CampaignStatus.PAUSED,
    goal: '发布 10 个成功案例，提升转化率 20%',
    budget: 45000,
    startDate: '2026-02-01',
    endDate: '2026-04-30',
    metrics: {
      sent: 800,
      delivered: 790,
      opened: 474,
      clicked: 158,
      converted: 32,
      bounced: 10,
      unsubscribed: 5,
      openRate: 60.0,
      clickRate: 20.0,
      conversionRate: 4.0,
    },
    description: '整理并发布客户成功案例，用于内容营销和销售支持',
    owner: 'user004',
    ownerName: '赵六',
    createdAt: '2026-01-28T13:00:00Z',
    updatedAt: '2026-03-08T17:00:00Z',
  },
  {
    id: 'camp010',
    name: '微信服务号推送活动',
    type: CampaignType.SOCIAL,
    status: CampaignStatus.RUNNING,
    goal: '公众号粉丝增长 20%，阅读量提升 50%',
    budget: 35000,
    startDate: '2026-03-01',
    endDate: '2026-05-31',
    metrics: {
      sent: 3000,
      delivered: 3000,
      opened: 1800,
      clicked: 720,
      converted: 144,
      bounced: 0,
      unsubscribed: 30,
      openRate: 60.0,
      clickRate: 24.0,
      conversionRate: 4.8,
    },
    description: '通过微信服务号定期推送优质内容和活动信息',
    owner: 'user002',
    ownerName: '李四',
    createdAt: '2026-02-22T11:00:00Z',
    updatedAt: '2026-03-12T14:00:00Z',
  },
  {
    id: 'camp011',
    name: '电话营销专项',
    type: CampaignType.SMS,
    status: CampaignStatus.DRAFT,
    goal: '触达 3000 客户，预约演示 100 场',
    budget: 50000,
    startDate: '2026-04-01',
    endDate: '2026-05-31',
    targetListId: 'list002',
    targetListName: '活跃老客户',
    description: '针对潜在客户的电话营销活动，配合短信提醒',
    owner: 'user003',
    ownerName: '王五',
    createdAt: '2026-03-05T10:00:00Z',
    updatedAt: '2026-03-11T16:00:00Z',
  },
  {
    id: 'camp012',
    name: '年度客户答谢会',
    type: CampaignType.EVENT,
    status: CampaignStatus.DRAFT,
    goal: '邀请 200 位 VIP 客户，现场签约 30+ 订单',
    budget: 300000,
    startDate: '2026-12-15',
    endDate: '2026-12-16',
    targetListId: 'list001',
    targetListName: '高价值企业客户',
    description: '年度 VIP 客户答谢活动，包含颁奖典礼和产品发布会',
    owner: 'user004',
    ownerName: '赵六',
    createdAt: '2026-03-01T09:00:00Z',
    updatedAt: '2026-03-10T11:00:00Z',
  },
];

/** 邮件模板数据 - 6 个 */
export const emailTemplatesData: EmailTemplate[] = [
  {
    id: 'tmpl001',
    name: '新产品发布通知',
    subject: '🎉 重磅新品发布！{{productName}} 正式上线',
    content: `尊敬的 {{customerName}}：

您好！

我们非常激动地宣布，{{productName}} 现已正式发布！

【产品亮点】
✨ {{feature1}}
✨ {{feature2}}
✨ {{feature3}}

【限时优惠】
前 100 名注册用户可享受 {{discount}} 优惠！

立即点击了解详情：{{productUrl}}

如有任何问题，欢迎随时联系我们。

祝商祺！
{{companyName}} 团队`,
    category: '产品推广',
    variables: ['customerName', 'productName', 'feature1', 'feature2', 'feature3', 'discount', 'productUrl', 'companyName'],
    previewText: '全新产品上线，限时优惠等您来拿',
    createdBy: 'user001',
    createdByName: '张三',
    createdAt: '2026-02-10T10:00:00Z',
    updatedAt: '2026-03-05T15:00:00Z',
  },
  {
    id: 'tmpl002',
    name: '网络研讨会邀请',
    subject: '📅 诚邀参加 | {{webinarTitle}}',
    content: `尊敬的 {{customerName}}：

您好！

诚挚邀请您参加我们举办的线上研讨会：

📌 主题：{{webinarTitle}}
📅 时间：{{webinarTime}}
👨‍🏫 主讲人：{{speakerName}}

【研讨会亮点】
✓ {{highlight1}}
✓ {{highlight2}}
✓ {{highlight3}}

立即报名：{{registrationUrl}}

名额有限，先到先得！

期待与您线上相见！

{{companyName}} 团队`,
    category: '活动邀请',
    variables: ['customerName', 'webinarTitle', 'webinarTime', 'speakerName', 'highlight1', 'highlight2', 'highlight3', 'registrationUrl', 'companyName'],
    previewText: '行业专家分享，不容错过的学习机会',
    createdBy: 'user001',
    createdByName: '张三',
    createdAt: '2026-02-15T14:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'tmpl003',
    name: '白皮书下载确认',
    subject: '📄 您下载的《{{whitepaperTitle}}》已准备就绪',
    content: `尊敬的 {{customerName}}：

感谢您对《{{whitepaperTitle}}》的关注！

【下载链接】
📥 点击下载：{{downloadUrl}}

【报告亮点】
• {{insight1}}
• {{insight2}}
• {{insight3}}

如果您有任何问题或需要进一步的咨询，欢迎随时联系我们。

祝您阅读愉快！

{{companyName}} 团队`,
    category: '内容营销',
    variables: ['customerName', 'whitepaperTitle', 'downloadUrl', 'insight1', 'insight2', 'insight3', 'companyName'],
    previewText: '行业深度洞察，助您把握市场趋势',
    createdBy: 'user002',
    createdByName: '李四',
    createdAt: '2026-02-20T11:00:00Z',
    updatedAt: '2026-02-28T16:00:00Z',
  },
  {
    id: 'tmpl004',
    name: '活动跟进邮件',
    subject: '感谢您的参与 | {{eventName}} 后续资料',
    content: `尊敬的 {{customerName}}：

您好！

感谢您在百忙之中参加 {{eventName}}。

【活动资料】
📎 PPT 下载：{{pptUrl}}
📎 回放视频：{{videoUrl}}
📎 相关资料：{{resourceUrl}}

【下一步】
如您对 {{productName}} 感兴趣，欢迎预约产品演示：{{demoUrl}}

如有任何问题，请随时回复此邮件。

祝商祺！

{{companyName}} 团队`,
    category: '活动跟进',
    variables: ['customerName', 'eventName', 'pptUrl', 'videoUrl', 'resourceUrl', 'productName', 'demoUrl', 'companyName'],
    previewText: '活动资料已整理完毕，点击下载',
    createdBy: 'user002',
    createdByName: '李四',
    createdAt: '2026-01-15T09:00:00Z',
    updatedAt: '2026-02-20T14:00:00Z',
  },
  {
    id: 'tmpl005',
    name: '节日祝福邮件',
    subject: '🎊 {{festivalName}} 快乐 | {{companyName}} 祝您节日快乐',
    content: `尊敬的 {{customerName}}：

{{festivalGreeting}}

感谢您一直以来对 {{companyName}} 的信任与支持！

【节日特惠】
🎁 {{offer1}}
🎁 {{offer2}}

活动时间：{{startDate}} - {{endDate}}

立即查看：{{promotionUrl}}

期待与您继续携手共进！

{{companyName}} 团队`,
    category: '节日祝福',
    variables: ['customerName', 'festivalName', 'companyName', 'festivalGreeting', 'offer1', 'offer2', 'startDate', 'endDate', 'promotionUrl'],
    previewText: '节日特别优惠，感恩有您',
    createdBy: 'user003',
    createdByName: '王五',
    createdAt: '2025-12-01T10:00:00Z',
    updatedAt: '2026-01-10T11:00:00Z',
  },
  {
    id: 'tmpl006',
    name: '客户回访调研',
    subject: '📋 诚邀参与 | {{productName}} 使用体验调研',
    content: `尊敬的 {{customerName}}：

您好！

为了给您提供更好的产品和服务，我们诚挚邀请您参与本次使用体验调研。

【调研说明】
⏱️ 预计耗时：3-5 分钟
🎁 完成奖励：{{reward}}

【开始调研】
👉 点击参与：{{surveyUrl}}

您的每一条反馈都是我们进步的动力！

感谢您的支持！

{{companyName}} 团队`,
    category: '客户调研',
    variables: ['customerName', 'productName', 'reward', 'surveyUrl', 'companyName'],
    previewText: '3 分钟完成调研，赢取精美礼品',
    createdBy: 'user003',
    createdByName: '王五',
    createdAt: '2026-01-20T15:00:00Z',
    updatedAt: '2026-02-15T10:00:00Z',
  },
];

/** 目标客户列表数据 - 6 个 */
export const targetListsData: TargetList[] = [
  {
    id: 'list001',
    name: '高价值企业客户',
    description: '年消费 50 万以上、合作 2 年以上的核心企业客户',
    customerCount: 256,
    criteria: '消费金额 >= 500000 AND 合作时长 >= 2 年 AND 客户等级 = A',
    createdBy: 'user001',
    createdByName: '张三',
    createdAt: '2026-01-10T09:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'list002',
    name: '活跃老客户',
    description: '近 3 个月有互动记录的老客户',
    customerCount: 1842,
    criteria: '最近互动时间 <= 90 天 AND 客户状态 = 活跃',
    createdBy: 'user002',
    createdByName: '李四',
    createdAt: '2026-01-15T14:00:00Z',
    updatedAt: '2026-03-10T15:00:00Z',
  },
  {
    id: 'list003',
    name: '行业决策者',
    description: '企业 CEO、CTO、CIO 等决策层联系人',
    customerCount: 523,
    criteria: '职位级别 IN (\'CEO\', \'CTO\', \'CIO\', \'总经理\') AND 行业 = \'互联网/软件/IT 服务\'',
    createdBy: 'user003',
    createdByName: '王五',
    createdAt: '2026-02-01T11:00:00Z',
    updatedAt: '2026-03-05T16:00:00Z',
  },
  {
    id: 'list004',
    name: '技术兴趣客户',
    description: '对 AI、大数据等技术话题感兴趣的客户',
    customerCount: 687,
    criteria: '标签 INCLUDES (\'AI\', \'大数据\', \'技术创新\') AND 近 30 天打开邮件 >= 2',
    createdBy: 'user001',
    createdByName: '张三',
    createdAt: '2026-02-10T10:00:00Z',
    updatedAt: '2026-03-08T14:00:00Z',
  },
  {
    id: 'list005',
    name: '华东地区企业',
    description: '注册地在华东三省一市的企业客户',
    customerCount: 1235,
    criteria: '省份 IN (\'上海\', \'江苏\', \'浙江\', \'安徽\') AND 客户类型 = \'企业\'',
    createdBy: 'user004',
    createdByName: '赵六',
    createdAt: '2026-02-20T09:00:00Z',
    updatedAt: '2026-03-12T11:00:00Z',
  },
  {
    id: 'list006',
    name: '内容营销受众',
    description: '经常下载白皮书、案例等内容的客户',
    customerCount: 943,
    criteria: '近 90 天内容下载次数 >= 2 OR 近 90 天博客阅读 >= 5',
    createdBy: 'user002',
    createdByName: '李四',
    createdAt: '2026-02-25T15:00:00Z',
    updatedAt: '2026-03-11T10:00:00Z',
  },
];

/** 自动化工作流数据 - 3 个 */
export const workflowsData: Workflow[] = [
  {
    id: 'wf001',
    name: '新品推广自动化流程',
    description: '新产品发布后的自动化推广流程，包含邮件发送、跟进提醒等',
    campaignId: 'camp001',
    nodes: [
      {
        id: 'node001',
        type: 'trigger',
        name: '活动开始',
        triggerType: TriggerType.TIME_BASED,
        config: { scheduledTime: '2026-03-01T09:00:00Z' },
        position: { x: 100, y: 100 },
      },
      {
        id: 'node002',
        type: 'action',
        name: '发送新品通知邮件',
        actionType: ActionType.SEND_EMAIL,
        config: { templateId: 'tmpl001', delay: 0 },
        position: { x: 100, y: 250 },
      },
      {
        id: 'node003',
        type: 'condition',
        name: '是否打开邮件',
        config: { condition: 'emailOpened', waitTime: 3 },
        position: { x: 100, y: 400 },
      },
      {
        id: 'node004',
        type: 'action',
        name: '发送跟进邮件',
        actionType: ActionType.SEND_EMAIL,
        config: { templateId: 'tmpl004', delay: 0 },
        position: { x: 300, y: 550 },
      },
      {
        id: 'node005',
        type: 'action',
        name: '创建销售任务',
        actionType: ActionType.CREATE_TASK,
        config: { taskType: '电话跟进', priority: 'high' },
        position: { x: 300, y: 700 },
      },
      {
        id: 'node006',
        type: 'end',
        name: '流程结束',
        config: {},
        position: { x: 100, y: 850 },
      },
    ],
    edges: [
      { id: 'edge001', source: 'node001', target: 'node002' },
      { id: 'edge002', source: 'node002', target: 'node003' },
      { id: 'edge003', source: 'node003', target: 'node004', label: '是' },
      { id: 'edge004', source: 'node003', target: 'node006', label: '否' },
      { id: 'edge005', source: 'node004', target: 'node005' },
      { id: 'edge006', source: 'node005', target: 'node006' },
    ],
    isActive: true,
    triggeredCount: 2500,
    createdBy: 'user001',
    createdByName: '张三',
    createdAt: '2026-02-15T10:00:00Z',
    updatedAt: '2026-03-12T15:30:00Z',
  },
  {
    id: 'wf002',
    name: '研讨会报名跟进流程',
    description: '网络研讨会报名后的自动化跟进流程',
    campaignId: 'camp004',
    nodes: [
      {
        id: 'node101',
        type: 'trigger',
        name: '客户报名研讨会',
        triggerType: TriggerType.EVENT_BASED,
        config: { eventType: 'webinar_registration' },
        position: { x: 100, y: 100 },
      },
      {
        id: 'node102',
        type: 'action',
        name: '发送确认邮件',
        actionType: ActionType.SEND_EMAIL,
        config: { templateId: 'tmpl002', delay: 0 },
        position: { x: 100, y: 250 },
      },
      {
        id: 'node103',
        type: 'action',
        name: '添加提醒任务',
        actionType: ActionType.CREATE_TASK,
        config: { taskType: '会前提醒', priority: 'medium', delay: 1 },
        position: { x: 100, y: 400 },
      },
      {
        id: 'node104',
        type: 'trigger',
        name: '研讨会结束',
        triggerType: TriggerType.TIME_BASED,
        config: { scheduledTime: '2026-04-15T18:00:00Z' },
        position: { x: 100, y: 550 },
      },
      {
        id: 'node105',
        type: 'action',
        name: '发送感谢邮件',
        actionType: ActionType.SEND_EMAIL,
        config: { templateId: 'tmpl004', delay: 0 },
        position: { x: 100, y: 700 },
      },
      {
        id: 'node106',
        type: 'condition',
        name: '是否参会',
        config: { condition: 'attendedWebinar' },
        position: { x: 100, y: 850 },
      },
      {
        id: 'node107',
        type: 'action',
        name: '创建销售线索',
        actionType: ActionType.CREATE_TASK,
        config: { taskType: '销售跟进', priority: 'high' },
        position: { x: 300, y: 1000 },
      },
      {
        id: 'node108',
        type: 'end',
        name: '流程结束',
        config: {},
        position: { x: 100, y: 1000 },
      },
    ],
    edges: [
      { id: 'edge101', source: 'node101', target: 'node102' },
      { id: 'edge102', source: 'node102', target: 'node103' },
      { id: 'edge103', source: 'node103', target: 'node104' },
      { id: 'edge104', source: 'node104', target: 'node105' },
      { id: 'edge105', source: 'node105', target: 'node106' },
      { id: 'edge106', source: 'node106', target: 'node107', label: '是' },
      { id: 'edge107', source: 'node106', target: 'node108', label: '否' },
      { id: 'edge108', source: 'node107', target: 'node108' },
    ],
    isActive: true,
    triggeredCount: 156,
    createdBy: 'user001',
    createdByName: '张三',
    createdAt: '2026-03-01T11:00:00Z',
    updatedAt: '2026-03-12T09:00:00Z',
  },
  {
    id: 'wf003',
    name: '客户生日祝福流程',
    description: '客户生日当天自动发送祝福邮件和优惠券',
    nodes: [
      {
        id: 'node201',
        type: 'trigger',
        name: '客户生日',
        triggerType: TriggerType.ATTRIBUTE_BASED,
        config: { attribute: 'birthday', matchType: 'equals_today' },
        position: { x: 100, y: 100 },
      },
      {
        id: 'node202',
        type: 'action',
        name: '发送生日祝福邮件',
        actionType: ActionType.SEND_EMAIL,
        config: { templateId: 'tmpl005', delay: 0 },
        position: { x: 100, y: 250 },
      },
      {
        id: 'node203',
        type: 'action',
        name: '发送生日优惠券',
        actionType: ActionType.SEND_SMS,
        config: { message: '生日快乐！您的专属优惠券已发放，请注意查收~', delay: 1 },
        position: { x: 100, y: 400 },
      },
      {
        id: 'node204',
        type: 'action',
        name: '通知客户经理',
        actionType: ActionType.NOTIFY_USER,
        config: { notifyType: 'email', message: '今日客户生日提醒' },
        position: { x: 100, y: 550 },
      },
      {
        id: 'node205',
        type: 'end',
        name: '流程结束',
        config: {},
        position: { x: 100, y: 700 },
      },
    ],
    edges: [
      { id: 'edge201', source: 'node201', target: 'node202' },
      { id: 'edge202', source: 'node202', target: 'node203' },
      { id: 'edge203', source: 'node203', target: 'node204' },
      { id: 'edge204', source: 'node204', target: 'node205' },
    ],
    isActive: true,
    triggeredCount: 89,
    createdBy: 'user002',
    createdByName: '李四',
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-03-10T14:00:00Z',
  },
];

// 导出获取数据的函数
export const getCampaignsData = () => campaignsData;
export const getEmailTemplatesData = () => emailTemplatesData;
export const getTargetListsData = () => targetListsData;
export const getWorkflowsData = () => workflowsData;
