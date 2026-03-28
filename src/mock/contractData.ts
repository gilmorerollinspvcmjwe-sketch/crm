import { Contract, ContractType, ContractStatus, Currency, PaymentMethod, PaymentPlan, ContractTerms, ContractStats } from '../types/contract';

// 生成 15+ 条合同示例数据
export const contractData: Contract[] = [
  {
    id: 'CONT20260312001',
    contractNumber: 'HT20260312001',
    name: '某某科技有限公司 CRM 系统采购合同',
    type: ContractType.SALES,
    customerId: 'CUST001',
    customerName: '某某科技有限公司',
    opportunityId: 'OPP20260312001',
    opportunityName: '某某科技有限公司 CRM 系统采购项目',
    amount: 500000,
    currency: Currency.CNY,
    signingDate: '2026-03-10',
    effectiveDate: '2026-03-15',
    expirationDate: '2027-03-14',
    contractPeriod: 12,
    terms: {
      paymentMethod: PaymentMethod.INSTALLMENT,
      paymentTerms: '首付 30%，验收 60%，质保 10%',
      deliveryTerms: '合同签订后 30 天内完成实施',
      warrantyPeriod: 12,
      liabilityForBreach: '违约方支付合同金额 20% 的违约金'
    },
    deliveryContent: 'CRM 系统软件、实施服务、培训',
    deliveryDate: '2026-04-15',
    status: ContractStatus.ACTIVE,
    owner: 'USER001',
    ownerName: '李四',
    signerOurSide: '王五（销售总监）',
    signerCustomerSide: '张三（采购总监）',
    paymentPlans: [
      { id: 'PP001', installmentNumber: 1, plannedAmount: 150000, plannedDate: '2026-03-20', status: 'COMPLETED', paymentCondition: '合同签订后 7 天内' },
      { id: 'PP002', installmentNumber: 2, plannedAmount: 300000, plannedDate: '2026-04-20', status: 'PENDING', paymentCondition: '验收合格后 30 天内' },
      { id: 'PP003', installmentNumber: 3, plannedAmount: 50000, plannedDate: '2027-03-20', status: 'PENDING', paymentCondition: '质保期满后 30 天内' }
    ],
    attachments: ['/contracts/HT20260312001.pdf'],
    remarks: '含 1 年免费运维服务',
    createdAt: '2026-03-05 14:00',
    updatedAt: '2026-03-10 16:00',
    archivedAt: '2026-03-10 16:00',
    archivedBy: 'USER008'
  },
  {
    id: 'CONT20260312002',
    contractNumber: 'HT20260312002',
    name: '北京某某集团销售管理系统合同',
    type: ContractType.SALES,
    customerId: 'CUST002',
    customerName: '北京某某集团',
    opportunityId: 'OPP20260312002',
    opportunityName: '北京某某集团销售管理系统',
    amount: 800000,
    currency: Currency.CNY,
    signingDate: '2026-03-08',
    effectiveDate: '2026-03-15',
    expirationDate: '2027-03-14',
    contractPeriod: 12,
    terms: {
      paymentMethod: PaymentMethod.MILESTONE,
      paymentTerms: '预付款 40%，上线 40%，验收 20%',
      deliveryTerms: '合同签订后 45 天内完成实施',
      warrantyPeriod: 24,
      liabilityForBreach: '违约方支付合同金额 15% 的违约金'
    },
    deliveryContent: '销售管理系统、5 个子公司部署、培训',
    deliveryDate: '2026-05-01',
    status: ContractStatus.PENDING_APPROVAL,
    owner: 'USER002',
    ownerName: '王五',
    signerOurSide: '王五（销售总监）',
    signerCustomerSide: '李总（信息化负责人）',
    paymentPlans: [
      { id: 'PP004', installmentNumber: 1, plannedAmount: 320000, plannedDate: '2026-03-20', status: 'PENDING', paymentCondition: '合同签订后 7 天内' },
      { id: 'PP005', installmentNumber: 2, plannedAmount: 320000, plannedDate: '2026-05-10', status: 'PENDING', paymentCondition: '系统上线后 7 天内' },
      { id: 'PP006', installmentNumber: 3, plannedAmount: 160000, plannedDate: '2026-05-20', status: 'PENDING', paymentCondition: '验收合格后 7 天内' }
    ],
    attachments: ['/contracts/HT20260312002.pdf'],
    remarks: '集团统一采购，覆盖 5 个子公司',
    createdAt: '2026-03-01 09:00',
    updatedAt: '2026-03-08 17:00'
  },
  {
    id: 'CONT20260312003',
    contractNumber: 'HT20260312003',
    name: '杭州某某网络科技销售云平台合同',
    type: ContractType.SALES,
    customerId: 'CUST005',
    customerName: '杭州某某网络科技有限公司',
    opportunityId: 'OPP20260312005',
    opportunityName: '杭州某某网络科技销售云平台',
    amount: 600000,
    currency: Currency.CNY,
    signingDate: '2026-03-10',
    effectiveDate: '2026-03-10',
    expirationDate: '2027-03-09',
    contractPeriod: 12,
    terms: {
      paymentMethod: PaymentMethod.INSTALLMENT,
      paymentTerms: '首付 50%，验收 50%',
      deliveryTerms: '合同签订后 30 天内完成实施',
      warrantyPeriod: 12,
      liabilityForBreach: '违约方支付合同金额 20% 的违约金'
    },
    deliveryContent: '销售云平台、移动端、培训',
    deliveryDate: '2026-04-10',
    status: ContractStatus.ARCHIVED,
    owner: 'USER002',
    ownerName: '王五',
    signerOurSide: '王五（销售总监）',
    signerCustomerSide: '周总（总经理）',
    paymentPlans: [
      { id: 'PP007', installmentNumber: 1, plannedAmount: 300000, plannedDate: '2026-03-17', status: 'COMPLETED', paymentCondition: '合同签订后 7 天内' },
      { id: 'PP008', installmentNumber: 2, plannedAmount: 300000, plannedDate: '2026-04-17', status: 'PENDING', paymentCondition: '验收合格后 7 天内' }
    ],
    attachments: ['/contracts/HT20260312003.pdf'],
    remarks: '已签约，等待实施',
    createdAt: '2026-03-05 10:00',
    updatedAt: '2026-03-10 16:00',
    archivedAt: '2026-03-10 16:00',
    archivedBy: 'USER008'
  },
  {
    id: 'CONT20260312004',
    contractNumber: 'HT20260312004',
    name: '深圳某某电子 CRM 项目合同',
    type: ContractType.SALES,
    customerId: 'CUST004',
    customerName: '深圳某某电子有限公司',
    opportunityId: 'OPP20260312004',
    opportunityName: '深圳某某电子 CRM 项目',
    amount: 350000,
    currency: Currency.CNY,
    signingDate: '2026-03-12',
    effectiveDate: '2026-03-15',
    expirationDate: '2027-03-14',
    contractPeriod: 12,
    terms: {
      paymentMethod: PaymentMethod.INSTALLMENT,
      paymentTerms: '首付 40%，交付 40%，质保 20%',
      deliveryTerms: '合同签订后 30 天内完成交付',
      warrantyPeriod: 12,
      liabilityForBreach: '违约方支付合同金额 15% 的违约金'
    },
    deliveryContent: 'CRM 系统、实施服务、培训',
    deliveryDate: '2026-04-15',
    status: ContractStatus.DRAFT,
    owner: 'USER003',
    ownerName: '赵六',
    signerOurSide: '王五（销售总监）',
    signerCustomerSide: '刘总监（采购）',
    paymentPlans: [
      { id: 'PP009', installmentNumber: 1, plannedAmount: 140000, plannedDate: '2026-03-22', status: 'PENDING', paymentCondition: '合同签订后 7 天内' },
      { id: 'PP010', installmentNumber: 2, plannedAmount: 140000, plannedDate: '2026-04-22', status: 'PENDING', paymentCondition: '交付后 7 天内' },
      { id: 'PP011', installmentNumber: 3, plannedAmount: 70000, plannedDate: '2027-03-22', status: 'PENDING', paymentCondition: '质保期满后 7 天内' }
    ],
    attachments: [],
    remarks: '待提交审批',
    createdAt: '2026-03-12 11:00',
    updatedAt: '2026-03-12 11:00'
  },
  {
    id: 'CONT20260312005',
    contractNumber: 'HT20260312005',
    name: '武汉某某零售连锁会员系统合同',
    type: ContractType.SALES,
    customerId: 'CUST008',
    customerName: '武汉某某零售连锁有限公司',
    opportunityId: 'OPP20260312008',
    opportunityName: '武汉某某零售连锁会员系统',
    amount: 380000,
    currency: Currency.CNY,
    signingDate: '2026-03-05',
    effectiveDate: '2026-03-05',
    expirationDate: '2027-03-04',
    contractPeriod: 12,
    terms: {
      paymentMethod: PaymentMethod.INSTALLMENT,
      paymentTerms: '首付 30%，上线 50%，验收 20%',
      deliveryTerms: '合同签订后 45 天内完成 20 家门店部署',
      warrantyPeriod: 12,
      liabilityForBreach: '违约方支付合同金额 20% 的违约金'
    },
    deliveryContent: '会员系统、20 家门店部署、培训',
    deliveryDate: '2026-04-20',
    status: ContractStatus.ACTIVE,
    owner: 'USER003',
    ownerName: '赵六',
    signerOurSide: '王五（销售总监）',
    signerCustomerSide: '冯总（运营总监）',
    paymentPlans: [
      { id: 'PP012', installmentNumber: 1, plannedAmount: 114000, plannedDate: '2026-03-12', status: 'COMPLETED', paymentCondition: '合同签订后 7 天内' },
      { id: 'PP013', installmentNumber: 2, plannedAmount: 190000, plannedDate: '2026-05-01', status: 'PENDING', paymentCondition: '系统上线后 7 天内' },
      { id: 'PP014', installmentNumber: 3, plannedAmount: 76000, plannedDate: '2026-05-10', status: 'PENDING', paymentCondition: '验收合格后 7 天内' }
    ],
    attachments: ['/contracts/HT20260312005.pdf'],
    remarks: '20 家门店，需要会员管理和销售管理',
    createdAt: '2026-02-28 10:00',
    updatedAt: '2026-03-05 16:00',
    archivedAt: '2026-03-05 16:00',
    archivedBy: 'USER008'
  },
  {
    id: 'CONT20260312006',
    contractNumber: 'HT20260312006',
    name: '西安某某能源企业客户管理平台合同',
    type: ContractType.SALES,
    customerId: 'CUST010',
    customerName: '西安某某能源有限公司',
    opportunityId: 'OPP20260312010',
    opportunityName: '西安某某能源企业客户管理平台',
    amount: 950000,
    currency: Currency.CNY,
    signingDate: '2026-03-11',
    effectiveDate: '2026-03-15',
    expirationDate: '2027-03-14',
    contractPeriod: 12,
    terms: {
      paymentMethod: PaymentMethod.MILESTONE,
      paymentTerms: '预付款 30%，上线 50%，验收 20%',
      deliveryTerms: '合同签订后 60 天内完成实施',
      warrantyPeriod: 24,
      liabilityForBreach: '违约方支付合同金额 10% 的违约金'
    },
    deliveryContent: '客户管理平台、定制开发、培训',
    deliveryDate: '2026-05-15',
    status: ContractStatus.PENDING_APPROVAL,
    owner: 'USER002',
    ownerName: '王五',
    signerOurSide: '王五（销售总监）',
    signerCustomerSide: '褚总监（采购）',
    paymentPlans: [
      { id: 'PP015', installmentNumber: 1, plannedAmount: 285000, plannedDate: '2026-03-22', status: 'PENDING', paymentCondition: '合同签订后 7 天内' },
      { id: 'PP016', installmentNumber: 2, plannedAmount: 475000, plannedDate: '2026-05-22', status: 'PENDING', paymentCondition: '系统上线后 7 天内' },
      { id: 'PP017', installmentNumber: 3, plannedAmount: 190000, plannedDate: '2026-06-01', status: 'PENDING', paymentCondition: '验收合格后 7 天内' }
    ],
    attachments: ['/contracts/HT20260312006.pdf'],
    remarks: '国企背景，流程复杂',
    createdAt: '2026-03-05 11:00',
    updatedAt: '2026-03-11 17:00'
  },
  {
    id: 'CONT20260312007',
    contractNumber: 'HT20260312007',
    name: '天津某某化工集团销售管理项目合同',
    type: ContractType.SALES,
    customerId: 'CUST012',
    customerName: '天津某某化工集团有限公司',
    opportunityId: 'OPP20260312012',
    opportunityName: '天津某某化工集团销售管理项目',
    amount: 720000,
    currency: Currency.CNY,
    signingDate: '2026-03-01',
    effectiveDate: '2026-03-01',
    expirationDate: '2027-02-28',
    contractPeriod: 12,
    terms: {
      paymentMethod: PaymentMethod.INSTALLMENT,
      paymentTerms: '首付 30%，交付 40%，验收 30%',
      deliveryTerms: '合同签订后 45 天内完成实施',
      warrantyPeriod: 12,
      liabilityForBreach: '违约方支付合同金额 15% 的违约金'
    },
    deliveryContent: '销售管理系统、化工行业定制、培训',
    deliveryDate: '2026-04-20',
    status: ContractStatus.ACTIVE,
    owner: 'USER003',
    ownerName: '赵六',
    signerOurSide: '王五（销售总监）',
    signerCustomerSide: '蒋总（销售总监）',
    paymentPlans: [
      { id: 'PP018', installmentNumber: 1, plannedAmount: 216000, plannedDate: '2026-03-08', status: 'COMPLETED', paymentCondition: '合同签订后 7 天内' },
      { id: 'PP019', installmentNumber: 2, plannedAmount: 288000, plannedDate: '2026-05-01', status: 'PENDING', paymentCondition: '交付后 7 天内' },
      { id: 'PP020', installmentNumber: 3, plannedAmount: 216000, plannedDate: '2026-05-10', status: 'PENDING', paymentCondition: '验收合格后 7 天内' }
    ],
    attachments: ['/contracts/HT20260312007.pdf'],
    remarks: '化工行业，需要特殊审批流程',
    createdAt: '2026-02-25 09:00',
    updatedAt: '2026-03-01 16:00',
    archivedAt: '2026-03-01 16:00',
    archivedBy: 'USER008'
  },
  {
    id: 'CONT20260312008',
    contractNumber: 'HT20260312008',
    name: '青岛某某啤酒厂经销商管理系统合同',
    type: ContractType.SALES,
    customerId: 'CUST014',
    customerName: '青岛某某啤酒厂',
    opportunityId: 'OPP20260312014',
    opportunityName: '青岛某某啤酒厂经销商管理系统',
    amount: 550000,
    currency: Currency.CNY,
    signingDate: '2026-03-12',
    effectiveDate: '2026-03-15',
    expirationDate: '2027-03-14',
    contractPeriod: 12,
    terms: {
      paymentMethod: PaymentMethod.INSTALLMENT,
      paymentTerms: '首付 40%，验收 60%',
      deliveryTerms: '合同签订后 45 天内完成实施',
      warrantyPeriod: 12,
      liabilityForBreach: '违约方支付合同金额 20% 的违约金'
    },
    deliveryContent: '经销商管理系统、培训',
    deliveryDate: '2026-05-01',
    status: ContractStatus.DRAFT,
    owner: 'USER002',
    ownerName: '王五',
    signerOurSide: '王五（销售总监）',
    signerCustomerSide: '杨总监（销售总监）',
    paymentPlans: [
      { id: 'PP021', installmentNumber: 1, plannedAmount: 220000, plannedDate: '2026-03-22', status: 'PENDING', paymentCondition: '合同签订后 7 天内' },
      { id: 'PP022', installmentNumber: 2, plannedAmount: 330000, plannedDate: '2026-05-10', status: 'PENDING', paymentCondition: '验收合格后 7 天内' }
    ],
    attachments: [],
    remarks: '传统企业数字化转型',
    createdAt: '2026-03-12 14:00',
    updatedAt: '2026-03-12 14:00'
  },
  {
    id: 'CONT20260312009',
    contractNumber: 'HT20260312009',
    name: '郑州某某食品集团渠道管理系统合同',
    type: ContractType.SALES,
    customerId: 'CUST016',
    customerName: '郑州某某食品集团有限公司',
    opportunityId: 'OPP20260312016',
    opportunityName: '郑州某某食品集团渠道管理系统',
    amount: 890000,
    currency: Currency.CNY,
    signingDate: '2026-03-08',
    effectiveDate: '2026-03-08',
    expirationDate: '2027-03-07',
    contractPeriod: 12,
    terms: {
      paymentMethod: PaymentMethod.MILESTONE,
      paymentTerms: '预付款 30%，上线 40%，验收 30%',
      deliveryTerms: '合同签订后 60 天内完成实施',
      warrantyPeriod: 12,
      liabilityForBreach: '违约方支付合同金额 15% 的违约金'
    },
    deliveryContent: '渠道管理系统、200+ 经销商部署、培训',
    deliveryDate: '2026-05-10',
    status: ContractStatus.ARCHIVED,
    owner: 'USER003',
    ownerName: '赵六',
    signerOurSide: '王五（销售总监）',
    signerCustomerSide: '秦总（营销总监）',
    paymentPlans: [
      { id: 'PP023', installmentNumber: 1, plannedAmount: 267000, plannedDate: '2026-03-15', status: 'COMPLETED', paymentCondition: '合同签订后 7 天内' },
      { id: 'PP024', installmentNumber: 2, plannedAmount: 356000, plannedDate: '2026-05-17', status: 'PENDING', paymentCondition: '系统上线后 7 天内' },
      { id: 'PP025', installmentNumber: 3, plannedAmount: 267000, plannedDate: '2026-05-27', status: 'PENDING', paymentCondition: '验收合格后 7 天内' }
    ],
    attachments: ['/contracts/HT20260312009.pdf'],
    remarks: '全国 200+ 经销商，需要渠道管理',
    createdAt: '2026-03-01 10:00',
    updatedAt: '2026-03-08 17:00',
    archivedAt: '2026-03-08 17:00',
    archivedBy: 'USER008'
  },
  {
    id: 'CONT20260312010',
    contractNumber: 'HT20260312010',
    name: '上海某某贸易公司客户管理系统合同',
    type: ContractType.SALES,
    customerId: 'CUST003',
    customerName: '上海某某贸易公司',
    opportunityId: 'OPP20260312003',
    opportunityName: '上海某某贸易公司客户管理系统',
    amount: 200000,
    currency: Currency.CNY,
    signingDate: '2026-02-28',
    effectiveDate: '2026-02-28',
    expirationDate: '2027-02-27',
    contractPeriod: 12,
    terms: {
      paymentMethod: PaymentMethod.ONE_TIME,
      paymentTerms: '一次性付款',
      deliveryTerms: '合同签订后 30 天内完成实施',
      warrantyPeriod: 12,
      liabilityForBreach: '违约方支付合同金额 20% 的违约金'
    },
    deliveryContent: '客户管理系统、培训',
    deliveryDate: '2026-04-01',
    status: ContractStatus.ACTIVE,
    owner: 'USER001',
    ownerName: '李四',
    signerOurSide: '王五（销售总监）',
    signerCustomerSide: '陈总（总经理）',
    paymentPlans: [
      { id: 'PP026', installmentNumber: 1, plannedAmount: 200000, plannedDate: '2026-03-07', status: 'COMPLETED', paymentCondition: '合同签订后 7 天内' }
    ],
    attachments: ['/contracts/HT20260312010.pdf'],
    remarks: '客户对价格敏感',
    createdAt: '2026-02-25 11:00',
    updatedAt: '2026-02-28 16:00',
    archivedAt: '2026-02-28 16:00',
    archivedBy: 'USER008'
  },
  {
    id: 'CONT20260312011',
    contractNumber: 'HT20260312011',
    name: '成都某某制造企业数字化项目合同',
    type: ContractType.SALES,
    customerId: 'CUST007',
    customerName: '成都某某制造有限公司',
    opportunityId: 'OPP20260312007',
    opportunityName: '成都某某制造企业数字化项目',
    amount: 1200000,
    currency: Currency.CNY,
    signingDate: '2026-03-10',
    effectiveDate: '2026-03-15',
    expirationDate: '2027-03-14',
    contractPeriod: 12,
    terms: {
      paymentMethod: PaymentMethod.MILESTONE,
      paymentTerms: '预付款 30%，蓝图确认 30%，上线 30%，验收 10%',
      deliveryTerms: '合同签订后 90 天内完成实施',
      warrantyPeriod: 24,
      liabilityForBreach: '违约方支付合同金额 10% 的违约金'
    },
    deliveryContent: 'CRM 系统、ERP 集成、定制开发、培训',
    deliveryDate: '2026-06-15',
    status: ContractStatus.PENDING_APPROVAL,
    owner: 'USER001',
    ownerName: '李四',
    signerOurSide: '王五（销售总监）',
    signerCustomerSide: '郑总（副总）',
    paymentPlans: [
      { id: 'PP027', installmentNumber: 1, plannedAmount: 360000, plannedDate: '2026-03-22', status: 'PENDING', paymentCondition: '合同签订后 7 天内' },
      { id: 'PP028', installmentNumber: 2, plannedAmount: 360000, plannedDate: '2026-04-30', status: 'PENDING', paymentCondition: '蓝图确认后 7 天内' },
      { id: 'PP029', installmentNumber: 3, plannedAmount: 360000, plannedDate: '2026-06-22', status: 'PENDING', paymentCondition: '系统上线后 7 天内' },
      { id: 'PP030', installmentNumber: 4, plannedAmount: 120000, plannedDate: '2026-07-01', status: 'PENDING', paymentCondition: '验收合格后 7 天内' }
    ],
    attachments: ['/contracts/HT20260312011.pdf'],
    remarks: '需要与现有 ERP 深度集成，需求复杂',
    createdAt: '2026-03-05 15:00',
    updatedAt: '2026-03-10 18:00'
  },
  {
    id: 'CONT20260312012',
    contractNumber: 'HT20260312012',
    name: '广州某某医药有限公司服务合同',
    type: ContractType.SERVICE,
    customerId: 'CUST006',
    customerName: '广州某某医药有限公司',
    opportunityId: 'OPP20260312006',
    opportunityName: '广州某某医药经销商管理系统',
    amount: 450000,
    currency: Currency.CNY,
    signingDate: '2026-03-12',
    effectiveDate: '2026-03-15',
    expirationDate: '2027-03-14',
    contractPeriod: 12,
    terms: {
      paymentMethod: PaymentMethod.INSTALLMENT,
      paymentTerms: '首付 30%，验收 70%',
      deliveryTerms: '合同签订后 45 天内完成实施',
      warrantyPeriod: 12,
      liabilityForBreach: '违约方支付合同金额 20% 的违约金'
    },
    deliveryContent: '医药经销商管理系统、GSP 合规、培训',
    deliveryDate: '2026-05-01',
    status: ContractStatus.DRAFT,
    owner: 'USER004',
    ownerName: '孙七',
    signerOurSide: '王五（销售总监）',
    signerCustomerSide: '吴经理（采购）',
    paymentPlans: [
      { id: 'PP031', installmentNumber: 1, plannedAmount: 135000, plannedDate: '2026-03-22', status: 'PENDING', paymentCondition: '合同签订后 7 天内' },
      { id: 'PP032', installmentNumber: 2, plannedAmount: 315000, plannedDate: '2026-05-10', status: 'PENDING', paymentCondition: '验收合格后 7 天内' }
    ],
    attachments: [],
    remarks: '刚建立联系，待确认需求',
    createdAt: '2026-03-12 12:00',
    updatedAt: '2026-03-12 12:00'
  },
  {
    id: 'CONT20260312013',
    contractNumber: 'HT20260312013',
    name: '南京某某教育培训学校招生系统合同',
    type: ContractType.SALES,
    customerId: 'CUST009',
    customerName: '南京某某教育培训学校',
    opportunityId: 'OPP20260312009',
    opportunityName: '南京某某教育培训机构招生系统',
    amount: 150000,
    currency: Currency.CNY,
    signingDate: '2026-03-06',
    effectiveDate: '2026-03-06',
    expirationDate: '2027-03-05',
    contractPeriod: 12,
    terms: {
      paymentMethod: PaymentMethod.ONE_TIME,
      paymentTerms: '一次性付款',
      deliveryTerms: '合同签订后 30 天内完成实施',
      warrantyPeriod: 12,
      liabilityForBreach: '违约方支付合同金额 20% 的违约金'
    },
    deliveryContent: '招生系统、培训',
    deliveryDate: '2026-04-10',
    status: ContractStatus.TERMINATED,
    owner: 'USER004',
    ownerName: '孙七',
    signerOurSide: '王五（销售总监）',
    signerCustomerSide: '陈校长',
    paymentPlans: [
      { id: 'PP033', installmentNumber: 1, plannedAmount: 150000, plannedDate: '2026-03-13', status: 'PENDING', paymentCondition: '合同签订后 7 天内' }
    ],
    attachments: ['/contracts/HT20260312013.pdf'],
    remarks: '客户预算不足，合同已终止',
    createdAt: '2026-03-06 13:00',
    updatedAt: '2026-03-10 15:00'
  },
  {
    id: 'CONT20260312014',
    contractNumber: 'HT20260312014',
    name: '重庆某某物流有限公司运输管理系统合同',
    type: ContractType.SALES,
    customerId: 'CUST011',
    customerName: '重庆某某物流有限公司',
    opportunityId: 'OPP20260312011',
    opportunityName: '重庆某某物流公司运输管理系统',
    amount: 280000,
    currency: Currency.CNY,
    signingDate: '2026-03-12',
    effectiveDate: '2026-03-15',
    expirationDate: '2027-03-14',
    contractPeriod: 12,
    terms: {
      paymentMethod: PaymentMethod.INSTALLMENT,
      paymentTerms: '首付 40%，验收 60%',
      deliveryTerms: '合同签订后 45 天内完成实施',
      warrantyPeriod: 12,
      liabilityForBreach: '违约方支付合同金额 20% 的违约金'
    },
    deliveryContent: '运输管理系统、培训',
    deliveryDate: '2026-05-01',
    status: ContractStatus.DRAFT,
    owner: 'USER001',
    ownerName: '李四',
    signerOurSide: '王五（销售总监）',
    signerCustomerSide: '卫经理（总经理）',
    paymentPlans: [
      { id: 'PP034', installmentNumber: 1, plannedAmount: 112000, plannedDate: '2026-03-22', status: 'PENDING', paymentCondition: '合同签订后 7 天内' },
      { id: 'PP035', installmentNumber: 2, plannedAmount: 168000, plannedDate: '2026-05-10', status: 'PENDING', paymentCondition: '验收合格后 7 天内' }
    ],
    attachments: [],
    remarks: '朋友介绍，初次接触',
    createdAt: '2026-03-12 11:00',
    updatedAt: '2026-03-12 11:00'
  },
  {
    id: 'CONT20260312015',
    contractNumber: 'HT20260312015',
    name: '长沙某某工程机械售后服务系统合同',
    type: ContractType.SALES,
    customerId: 'CUST015',
    customerName: '长沙某某工程机械有限公司',
    opportunityId: 'OPP20260312015',
    opportunityName: '长沙某某工程机械售后服务系统',
    amount: 680000,
    currency: Currency.CNY,
    signingDate: '2026-03-11',
    effectiveDate: '2026-03-15',
    expirationDate: '2027-03-14',
    contractPeriod: 12,
    terms: {
      paymentMethod: PaymentMethod.MILESTONE,
      paymentTerms: '预付款 30%，蓝图 30%，上线 30%，验收 10%',
      deliveryTerms: '合同签订后 60 天内完成实施',
      warrantyPeriod: 24,
      liabilityForBreach: '违约方支付合同金额 15% 的违约金'
    },
    deliveryContent: '售后服务系统、工单管理、备件管理、培训',
    deliveryDate: '2026-05-15',
    status: ContractStatus.PENDING_APPROVAL,
    owner: 'USER001',
    ownerName: '李四',
    signerOurSide: '王五（销售总监）',
    signerCustomerSide: '朱总（副总）',
    paymentPlans: [
      { id: 'PP036', installmentNumber: 1, plannedAmount: 204000, plannedDate: '2026-03-22', status: 'PENDING', paymentCondition: '合同签订后 7 天内' },
      { id: 'PP037', installmentNumber: 2, plannedAmount: 204000, plannedDate: '2026-04-15', status: 'PENDING', paymentCondition: '蓝图确认后 7 天内' },
      { id: 'PP038', installmentNumber: 3, plannedAmount: 204000, plannedDate: '2026-05-22', status: 'PENDING', paymentCondition: '系统上线后 7 天内' },
      { id: 'PP039', installmentNumber: 4, plannedAmount: 68000, plannedDate: '2026-06-01', status: 'PENDING', paymentCondition: '验收合格后 7 天内' }
    ],
    attachments: ['/contracts/HT20260312015.pdf'],
    remarks: '需要售后服务管理，包括工单、备件等',
    createdAt: '2026-03-08 11:00',
    updatedAt: '2026-03-11 16:00'
  }
];

// 生成合同统计数据
export const generateContractStats = (): ContractStats => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const totalAmount = contractData.reduce((sum, c) => sum + c.amount, 0);
  const monthlyAmount = contractData
    .filter(c => {
      const signingDate = new Date(c.signingDate);
      return signingDate.getMonth() === currentMonth && signingDate.getFullYear() === currentYear;
    })
    .reduce((sum, c) => sum + c.amount, 0);

  const byStatus: Record<ContractStatus, number> = {
    [ContractStatus.DRAFT]: 0,
    [ContractStatus.PENDING_APPROVAL]: 0,
    [ContractStatus.ACTIVE]: 0,
    [ContractStatus.ARCHIVED]: 0,
    [ContractStatus.TERMINATED]: 0
  };

  contractData.forEach(c => {
    byStatus[c.status]++;
  });

  return {
    totalCount: contractData.length,
    totalAmount,
    monthlyAmount,
    byStatus
  };
};

// 根据 ID 获取合同详情
export const getContractById = (id: string): Contract | undefined => {
  return contractData.find(c => c.id === id);
};

// 合同状态标签映射
export const contractStatusLabels = {
  draft: '草稿',
  pendingApproval: '审批中',
  active: '已生效',
  archived: '已归档',
  terminated: '已终止'
};

// 合同状态颜色映射
export const contractStatusColors: Record<ContractStatus, { bg: string; color: string }> = {
  [ContractStatus.DRAFT]: { bg: '#F3F4F6', color: '#6B7280' },
  [ContractStatus.PENDING_APPROVAL]: { bg: '#FEF3C7', color: '#D97706' },
  [ContractStatus.ACTIVE]: { bg: '#D1FAE5', color: '#059669' },
  [ContractStatus.ARCHIVED]: { bg: '#F3F4F6', color: '#6B7280' },
  [ContractStatus.TERMINATED]: { bg: '#FEE2E2', color: '#DC2626' }
};

// 根据筛选条件过滤合同
export const filterContracts = (
  contracts: Contract[],
  filter: { name?: string; contractNumber?: string; customerName?: string; status?: ContractStatus; owner?: string }
): Contract[] => {
  return contracts.filter(contract => {
    if (filter.name && !contract.name.toLowerCase().includes(filter.name.toLowerCase())) {
      return false;
    }
    if (filter.contractNumber && !contract.contractNumber.toLowerCase().includes(filter.contractNumber.toLowerCase())) {
      return false;
    }
    if (filter.customerName && !contract.customerName.toLowerCase().includes(filter.customerName.toLowerCase())) {
      return false;
    }
    if (filter.status && contract.status !== filter.status) {
      return false;
    }
    if (filter.owner && contract.ownerName !== filter.owner) {
      return false;
    }
    return true;
  });
};
