import { Opportunity, OpportunityStage, OpportunityStatus, OpportunitySource, Competitor, SalesFunnelStats } from '../types/opportunity';

// 生成 15+ 条商机示例数据
export const opportunityData: Opportunity[] = [
  {
    id: 'OPP20260312001',
    name: '某某科技有限公司 CRM 系统采购项目',
    customerId: 'CUST001',
    customerName: '某某科技有限公司',
    amount: 500000,
    stage: OpportunityStage.REQUIREMENT_CONFIRMATION,
    estimatedCloseDate: '2026-06-30',
    probability: 40,
    source: OpportunitySource.MARKETING_EVENT,
    status: OpportunityStatus.IN_PROGRESS,
    owner: 'USER001',
    ownerName: '李四',
    contacts: ['CONT001'],
    contactNames: ['张三'],
    competitors: [
      { id: 'COMP001', name: '销售易', advantage: '品牌知名度高', disadvantage: '价格较高' },
      { id: 'COMP002', name: '纷享销客', advantage: '功能丰富', disadvantage: '实施周期长' }
    ],
    description: '客户需要与 ERP 集成，支持移动端，预计 100 用户',
    budget: '已获批',
    decisionProcess: '采购部初审→技术部评估→总经理审批',
    nextFollowupTime: '2026-03-15 09:00',
    createdAt: '2026-03-01 10:30',
    updatedAt: '2026-03-12 14:20'
  },
  {
    id: 'OPP20260312002',
    name: '北京某某集团销售管理系统',
    customerId: 'CUST002',
    customerName: '北京某某集团',
    amount: 800000,
    stage: OpportunityStage.PROPOSAL_QUOTATION,
    estimatedCloseDate: '2026-07-15',
    probability: 60,
    source: OpportunitySource.REFERRAL,
    status: OpportunityStatus.IN_PROGRESS,
    owner: 'USER002',
    ownerName: '王五',
    contacts: ['CONT002', 'CONT003'],
    contactNames: ['李总', '赵经理'],
    competitors: [
      { id: 'COMP003', name: 'Salesforce', advantage: '国际品牌', disadvantage: '本地化服务弱' }
    ],
    description: '集团统一采购，覆盖 5 个子公司，预计 300 用户',
    budget: '审批中',
    decisionProcess: '信息化委员会评审→CEO 审批',
    nextFollowupTime: '2026-03-14 14:00',
    createdAt: '2026-02-28 09:00',
    updatedAt: '2026-03-11 16:30'
  },
  {
    id: 'OPP20260312003',
    name: '上海某某贸易公司客户管理系统',
    customerId: 'CUST003',
    customerName: '上海某某贸易公司',
    amount: 200000,
    stage: OpportunityStage.INITIAL_CONTACT,
    estimatedCloseDate: '2026-05-30',
    probability: 20,
    source: OpportunitySource.WEBSITE,
    status: OpportunityStatus.IN_PROGRESS,
    owner: 'USER001',
    ownerName: '李四',
    contacts: ['CONT004'],
    contactNames: ['陈总'],
    competitors: [],
    description: '初次接触，客户对价格敏感',
    budget: '未申请',
    decisionProcess: '老板直接决策',
    nextFollowupTime: '2026-03-13 10:00',
    createdAt: '2026-03-05 11:00',
    updatedAt: '2026-03-10 09:30'
  },
  {
    id: 'OPP20260312004',
    name: '深圳某某电子 CRM 项目',
    customerId: 'CUST004',
    customerName: '深圳某某电子有限公司',
    amount: 350000,
    stage: OpportunityStage.NEGOTIATION_APPROVAL,
    estimatedCloseDate: '2026-04-30',
    probability: 80,
    source: OpportunitySource.COLD_CALL,
    status: OpportunityStatus.IN_PROGRESS,
    owner: 'USER003',
    ownerName: '赵六',
    contacts: ['CONT005'],
    contactNames: ['刘总监'],
    competitors: [
      { id: 'COMP004', name: '尘锋', advantage: '价格低', disadvantage: '功能简单' }
    ],
    description: '已进入商务谈判阶段，价格基本谈妥',
    budget: '已获批',
    decisionProcess: '采购总监→财务总监→总经理',
    nextFollowupTime: '2026-03-13 15:00',
    createdAt: '2026-02-15 14:00',
    updatedAt: '2026-03-12 10:00'
  },
  {
    id: 'OPP20260312005',
    name: '杭州某某网络科技销售云平台',
    customerId: 'CUST005',
    customerName: '杭州某某网络科技有限公司',
    amount: 600000,
    stage: OpportunityStage.CLOSED_WON,
    estimatedCloseDate: '2026-03-10',
    probability: 100,
    source: OpportunitySource.MARKETING_EVENT,
    status: OpportunityStatus.CLOSED_WON,
    owner: 'USER002',
    ownerName: '王五',
    contacts: ['CONT006'],
    contactNames: ['周总'],
    competitors: [
      { id: 'COMP001', name: '销售易', advantage: '品牌好', disadvantage: '贵' },
      { id: 'COMP002', name: '纷享销客', advantage: '功能多', disadvantage: '复杂' }
    ],
    description: '已签约，等待实施',
    budget: '已获批',
    decisionProcess: '已完成',
    createdAt: '2026-01-20 10:00',
    updatedAt: '2026-03-10 16:00'
  },
  {
    id: 'OPP20260312006',
    name: '广州某某医药经销商管理系统',
    customerId: 'CUST006',
    customerName: '广州某某医药有限公司',
    amount: 450000,
    stage: OpportunityStage.LEAD_CONFIRMATION,
    estimatedCloseDate: '2026-08-30',
    probability: 10,
    source: OpportunitySource.WEBSITE,
    status: OpportunityStatus.IN_PROGRESS,
    owner: 'USER004',
    ownerName: '孙七',
    contacts: ['CONT007'],
    contactNames: ['吴经理'],
    competitors: [],
    description: '刚建立联系，需进一步确认需求',
    budget: '未申请',
    decisionProcess: '待定',
    nextFollowupTime: '2026-03-16 11:00',
    createdAt: '2026-03-08 09:30',
    updatedAt: '2026-03-12 11:00'
  },
  {
    id: 'OPP20260312007',
    name: '成都某某制造企业数字化项目',
    customerId: 'CUST007',
    customerName: '成都某某制造有限公司',
    amount: 1200000,
    stage: OpportunityStage.REQUIREMENT_CONFIRMATION,
    estimatedCloseDate: '2026-09-30',
    probability: 40,
    source: OpportunitySource.REFERRAL,
    status: OpportunityStatus.IN_PROGRESS,
    owner: 'USER001',
    ownerName: '李四',
    contacts: ['CONT008', 'CONT009'],
    contactNames: ['郑总', '王经理'],
    competitors: [
      { id: 'COMP005', name: '用友', advantage: 'ERP 集成好', disadvantage: 'CRM 功能弱' },
      { id: 'COMP006', name: '金蝶', advantage: '财务集成好', disadvantage: '销售管理弱' }
    ],
    description: '需要与现有 ERP 深度集成，需求复杂',
    budget: '审批中',
    decisionProcess: '信息化部门→财务总监→总经理→董事会',
    nextFollowupTime: '2026-03-17 14:00',
    createdAt: '2026-03-02 15:00',
    updatedAt: '2026-03-11 17:00'
  },
  {
    id: 'OPP20260312008',
    name: '武汉某某零售连锁会员系统',
    customerId: 'CUST008',
    customerName: '武汉某某零售连锁有限公司',
    amount: 380000,
    stage: OpportunityStage.PROPOSAL_QUOTATION,
    estimatedCloseDate: '2026-06-15',
    probability: 60,
    source: OpportunitySource.MARKETING_EVENT,
    status: OpportunityStatus.IN_PROGRESS,
    owner: 'USER003',
    ownerName: '赵六',
    contacts: ['CONT010'],
    contactNames: ['冯总'],
    competitors: [
      { id: 'COMP007', name: '有赞', advantage: '零售行业经验', disadvantage: 'CRM 功能弱' }
    ],
    description: '20 家门店，需要会员管理和销售管理',
    budget: '已获批',
    decisionProcess: '运营总监→财务总监→CEO',
    nextFollowupTime: '2026-03-14 10:00',
    createdAt: '2026-02-25 10:30',
    updatedAt: '2026-03-12 09:00'
  },
  {
    id: 'OPP20260312009',
    name: '南京某某教育培训机构招生系统',
    customerId: 'CUST009',
    customerName: '南京某某教育培训学校',
    amount: 150000,
    stage: OpportunityStage.INITIAL_CONTACT,
    estimatedCloseDate: '2026-05-15',
    probability: 20,
    source: OpportunitySource.WEBSITE,
    status: OpportunityStatus.IN_PROGRESS,
    owner: 'USER004',
    ownerName: '孙七',
    contacts: ['CONT011'],
    contactNames: ['陈校长'],
    competitors: [],
    description: '民办培训机构，预算有限',
    budget: '未申请',
    decisionProcess: '校长直接决策',
    nextFollowupTime: '2026-03-15 15:00',
    createdAt: '2026-03-06 13:00',
    updatedAt: '2026-03-10 14:00'
  },
  {
    id: 'OPP20260312010',
    name: '西安某某能源企业客户管理平台',
    customerId: 'CUST010',
    customerName: '西安某某能源有限公司',
    amount: 950000,
    stage: OpportunityStage.NEGOTIATION_APPROVAL,
    estimatedCloseDate: '2026-05-30',
    probability: 80,
    source: OpportunitySource.COLD_CALL,
    status: OpportunityStatus.IN_PROGRESS,
    owner: 'USER002',
    ownerName: '王五',
    contacts: ['CONT012'],
    contactNames: ['褚总监'],
    competitors: [
      { id: 'COMP001', name: '销售易', advantage: '行业案例多', disadvantage: '价格高' }
    ],
    description: '国企背景，流程复杂，但预算充足',
    budget: '已获批',
    decisionProcess: '部门主任→分管副总→总经理→党委会',
    nextFollowupTime: '2026-03-13 09:00',
    createdAt: '2026-02-10 11:00',
    updatedAt: '2026-03-12 15:30'
  },
  {
    id: 'OPP20260312011',
    name: '重庆某某物流公司运输管理系统',
    customerId: 'CUST011',
    customerName: '重庆某某物流有限公司',
    amount: 280000,
    stage: OpportunityStage.LEAD_CONFIRMATION,
    estimatedCloseDate: '2026-07-30',
    probability: 10,
    source: OpportunitySource.OTHER,
    status: OpportunityStatus.IN_PROGRESS,
    owner: 'USER001',
    ownerName: '李四',
    contacts: ['CONT013'],
    contactNames: ['卫经理'],
    competitors: [],
    description: '朋友介绍，初次接触',
    budget: '未申请',
    decisionProcess: '待定',
    nextFollowupTime: '2026-03-18 10:00',
    createdAt: '2026-03-10 16:00',
    updatedAt: '2026-03-12 10:30'
  },
  {
    id: 'OPP20260312012',
    name: '天津某某化工集团销售管理项目',
    customerId: 'CUST012',
    customerName: '天津某某化工集团有限公司',
    amount: 720000,
    stage: OpportunityStage.PROPOSAL_QUOTATION,
    estimatedCloseDate: '2026-08-15',
    probability: 60,
    source: OpportunitySource.MARKETING_EVENT,
    status: OpportunityStatus.IN_PROGRESS,
    owner: 'USER003',
    ownerName: '赵六',
    contacts: ['CONT014', 'CONT015'],
    contactNames: ['蒋总', '沈经理'],
    competitors: [
      { id: 'COMP002', name: '纷享销客', advantage: '价格适中', disadvantage: '行业经验少' }
    ],
    description: '化工行业，需要特殊审批流程',
    budget: '审批中',
    decisionProcess: '安全部门→信息化部门→财务总监→总经理',
    nextFollowupTime: '2026-03-16 14:00',
    createdAt: '2026-03-01 09:00',
    updatedAt: '2026-03-11 11:00'
  },
  {
    id: 'OPP20260312013',
    name: '苏州某某生物科技公司 CRM 系统',
    customerId: 'CUST013',
    customerName: '苏州某某生物科技有限公司',
    amount: 420000,
    stage: OpportunityStage.CLOSED_LOST,
    estimatedCloseDate: '2026-04-30',
    probability: 0,
    source: OpportunitySource.WEBSITE,
    status: OpportunityStatus.CLOSED_LOST,
    owner: 'USER004',
    ownerName: '孙七',
    contacts: ['CONT016'],
    contactNames: ['韩总'],
    competitors: [
      { id: 'COMP001', name: '销售易', advantage: '中标', disadvantage: '-' }
    ],
    description: '输单，客户选择了销售易',
    budget: '已获批',
    decisionProcess: '已完成',
    createdAt: '2026-02-05 10:00',
    updatedAt: '2026-03-08 16:00'
  },
  {
    id: 'OPP20260312014',
    name: '青岛某某啤酒厂经销商管理系统',
    customerId: 'CUST014',
    customerName: '青岛某某啤酒厂',
    amount: 550000,
    stage: OpportunityStage.REQUIREMENT_CONFIRMATION,
    estimatedCloseDate: '2026-07-30',
    probability: 40,
    source: OpportunitySource.REFERRAL,
    status: OpportunityStatus.IN_PROGRESS,
    owner: 'USER002',
    ownerName: '王五',
    contacts: ['CONT017'],
    contactNames: ['杨总监'],
    competitors: [],
    description: '传统企业数字化转型，需求明确',
    budget: '已获批',
    decisionProcess: '销售总监→信息化总监→总经理',
    nextFollowupTime: '2026-03-15 11:00',
    createdAt: '2026-03-03 14:30',
    updatedAt: '2026-03-12 13:00'
  },
  {
    id: 'OPP20260312015',
    name: '长沙某某工程机械售后服务系统',
    customerId: 'CUST015',
    customerName: '长沙某某工程机械有限公司',
    amount: 680000,
    stage: OpportunityStage.INITIAL_CONTACT,
    estimatedCloseDate: '2026-09-30',
    probability: 20,
    source: OpportunitySource.COLD_CALL,
    status: OpportunityStatus.IN_PROGRESS,
    owner: 'USER001',
    ownerName: '李四',
    contacts: ['CONT018'],
    contactNames: ['朱总'],
    competitors: [
      { id: 'COMP008', name: '三一重工自研', advantage: '内部系统', disadvantage: '不对外' }
    ],
    description: '需要售后服务管理，包括工单、备件等',
    budget: '未申请',
    decisionProcess: '待定',
    nextFollowupTime: '2026-03-19 10:00',
    createdAt: '2026-03-07 11:00',
    updatedAt: '2026-03-11 15:00'
  },
  {
    id: 'OPP20260312016',
    name: '郑州某某食品集团渠道管理系统',
    customerId: 'CUST016',
    customerName: '郑州某某食品集团有限公司',
    amount: 890000,
    stage: OpportunityStage.PROPOSAL_QUOTATION,
    estimatedCloseDate: '2026-06-30',
    probability: 60,
    source: OpportunitySource.MARKETING_EVENT,
    status: OpportunityStatus.IN_PROGRESS,
    owner: 'USER003',
    ownerName: '赵六',
    contacts: ['CONT019', 'CONT020'],
    contactNames: ['秦总', '尤经理'],
    competitors: [
      { id: 'COMP002', name: '纷享销客', advantage: '渠道管理强', disadvantage: '价格高' }
    ],
    description: '全国 200+ 经销商，需要渠道管理',
    budget: '已获批',
    decisionProcess: '营销总监→财务总监→总经理',
    nextFollowupTime: '2026-03-14 15:00',
    createdAt: '2026-02-20 10:00',
    updatedAt: '2026-03-12 14:00'
  }
];

// 生成销售漏斗统计数据
export const generateSalesFunnelStats = (): SalesFunnelStats[] => {
  const stages = Object.values(OpportunityStage);
  const stats: SalesFunnelStats[] = stages.map(stage => {
    const stageOpportunities = opportunityData.filter(opp => opp.stage === stage);
    return {
      stage,
      count: stageOpportunities.length,
      totalAmount: stageOpportunities.reduce((sum, opp) => sum + opp.amount, 0),
      probability: getStageProbability(stage)
    };
  });
  return stats;
};

// 获取阶段默认成交概率
const getStageProbability = (stage: OpportunityStage): number => {
  const probabilityMap: Record<OpportunityStage, number> = {
    [OpportunityStage.LEAD_CONFIRMATION]: 10,
    [OpportunityStage.INITIAL_CONTACT]: 20,
    [OpportunityStage.REQUIREMENT_CONFIRMATION]: 40,
    [OpportunityStage.PROPOSAL_QUOTATION]: 60,
    [OpportunityStage.NEGOTIATION_APPROVAL]: 80,
    [OpportunityStage.CLOSED_WON]: 100,
    [OpportunityStage.CLOSED_LOST]: 0
  };
  return probabilityMap[stage] || 0;
};

// 根据筛选条件过滤商机
export const filterOpportunities = (
  opportunities: Opportunity[],
  filter: { name?: string; customerName?: string; stage?: OpportunityStage; owner?: string }
): Opportunity[] => {
  return opportunities.filter(opp => {
    if (filter.name && !opp.name.toLowerCase().includes(filter.name.toLowerCase())) {
      return false;
    }
    if (filter.customerName && !opp.customerName.toLowerCase().includes(filter.customerName.toLowerCase())) {
      return false;
    }
    if (filter.stage && opp.stage !== filter.stage) {
      return false;
    }
    if (filter.owner && opp.ownerName !== filter.owner) {
      return false;
    }
    return true;
  });
};
