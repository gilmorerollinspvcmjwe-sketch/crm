import { PaymentPlan, PaymentRecord, AccountReceivable, PaymentStats, PaymentTrend, PaymentStatus, PaymentMethod, Invoice, InvoiceStatus } from '../types/payment';

// 生成 20 条回款计划示例数据
export const paymentPlanData: PaymentPlan[] = [
  {
    id: 'PP20260312001',
    contractId: 'CONT20260312001',
    contractNumber: 'HT20260312001',
    contractName: '某某科技有限公司 CRM 系统采购合同',
    customerId: 'CUST001',
    customerName: '某某科技有限公司',
    installmentNumber: 1,
    plannedAmount: 150000,
    plannedDate: '2026-03-20',
    actualAmount: 150000,
    actualDate: '2026-03-18',
    status: PaymentStatus.COMPLETED,
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    paymentCondition: '合同签订后 7 天内',
    remarks: '已按时回款',
    overdueDays: 0,
    createdAt: '2026-03-05 14:00',
    updatedAt: '2026-03-18 10:00'
  },
  {
    id: 'PP20260312002',
    contractId: 'CONT20260312001',
    contractNumber: 'HT20260312001',
    contractName: '某某科技有限公司 CRM 系统采购合同',
    customerId: 'CUST001',
    customerName: '某某科技有限公司',
    installmentNumber: 2,
    plannedAmount: 300000,
    plannedDate: '2026-04-20',
    status: PaymentStatus.PENDING,
    paymentCondition: '验收合格后 30 天内',
    remarks: '待验收',
    overdueDays: 0,
    createdAt: '2026-03-05 14:00',
    updatedAt: '2026-03-05 14:00'
  },
  {
    id: 'PP20260312003',
    contractId: 'CONT20260312001',
    contractNumber: 'HT20260312001',
    contractName: '某某科技有限公司 CRM 系统采购合同',
    customerId: 'CUST001',
    customerName: '某某科技有限公司',
    installmentNumber: 3,
    plannedAmount: 50000,
    plannedDate: '2027-03-20',
    status: PaymentStatus.PENDING,
    paymentCondition: '质保期满后 30 天内',
    remarks: '质保金',
    overdueDays: 0,
    createdAt: '2026-03-05 14:00',
    updatedAt: '2026-03-05 14:00'
  },
  {
    id: 'PP20260312004',
    contractId: 'CONT20260312003',
    contractNumber: 'HT20260312003',
    contractName: '杭州某某网络科技销售云平台合同',
    customerId: 'CUST005',
    customerName: '杭州某某网络科技有限公司',
    installmentNumber: 1,
    plannedAmount: 300000,
    plannedDate: '2026-03-17',
    actualAmount: 300000,
    actualDate: '2026-03-15',
    status: PaymentStatus.COMPLETED,
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    paymentCondition: '合同签订后 7 天内',
    remarks: '提前回款',
    overdueDays: 0,
    createdAt: '2026-03-05 10:00',
    updatedAt: '2026-03-15 11:00'
  },
  {
    id: 'PP20260312005',
    contractId: 'CONT20260312003',
    contractNumber: 'HT20260312003',
    contractName: '杭州某某网络科技销售云平台合同',
    customerId: 'CUST005',
    customerName: '杭州某某网络科技有限公司',
    installmentNumber: 2,
    plannedAmount: 300000,
    plannedDate: '2026-04-17',
    status: PaymentStatus.PENDING,
    paymentCondition: '验收合格后 7 天内',
    remarks: '待验收',
    overdueDays: 0,
    createdAt: '2026-03-05 10:00',
    updatedAt: '2026-03-05 10:00'
  },
  {
    id: 'PP20260312006',
    contractId: 'CONT20260312005',
    contractNumber: 'HT20260312005',
    contractName: '武汉某某零售连锁会员系统合同',
    customerId: 'CUST008',
    customerName: '武汉某某零售连锁有限公司',
    installmentNumber: 1,
    plannedAmount: 114000,
    plannedDate: '2026-03-12',
    actualAmount: 114000,
    actualDate: '2026-03-10',
    status: PaymentStatus.COMPLETED,
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    paymentCondition: '合同签订后 7 天内',
    remarks: '已回款',
    overdueDays: 0,
    createdAt: '2026-02-28 10:00',
    updatedAt: '2026-03-10 09:00'
  },
  {
    id: 'PP20260312007',
    contractId: 'CONT20260312005',
    contractNumber: 'HT20260312005',
    contractName: '武汉某某零售连锁会员系统合同',
    customerId: 'CUST008',
    customerName: '武汉某某零售连锁有限公司',
    installmentNumber: 2,
    plannedAmount: 190000,
    plannedDate: '2026-05-01',
    status: PaymentStatus.PENDING,
    paymentCondition: '系统上线后 7 天内',
    remarks: '待上线',
    overdueDays: 0,
    createdAt: '2026-02-28 10:00',
    updatedAt: '2026-02-28 10:00'
  },
  {
    id: 'PP20260312008',
    contractId: 'CONT20260312007',
    contractNumber: 'HT20260312007',
    contractName: '天津某某化工集团销售管理项目合同',
    customerId: 'CUST012',
    customerName: '天津某某化工集团有限公司',
    installmentNumber: 1,
    plannedAmount: 216000,
    plannedDate: '2026-03-08',
    actualAmount: 216000,
    actualDate: '2026-03-06',
    status: PaymentStatus.COMPLETED,
    paymentMethod: PaymentMethod.CHECK,
    paymentCondition: '合同签订后 7 天内',
    remarks: '支票支付',
    overdueDays: 0,
    createdAt: '2026-02-25 09:00',
    updatedAt: '2026-03-06 14:00'
  },
  {
    id: 'PP20260312009',
    contractId: 'CONT20260312007',
    contractNumber: 'HT20260312007',
    contractName: '天津某某化工集团销售管理项目合同',
    customerId: 'CUST012',
    customerName: '天津某某化工集团有限公司',
    installmentNumber: 2,
    plannedAmount: 288000,
    plannedDate: '2026-05-01',
    status: PaymentStatus.PENDING,
    paymentCondition: '交付后 7 天内',
    remarks: '待交付',
    overdueDays: 0,
    createdAt: '2026-02-25 09:00',
    updatedAt: '2026-02-25 09:00'
  },
  {
    id: 'PP20260312010',
    contractId: 'CONT20260312009',
    contractNumber: 'HT20260312009',
    contractName: '郑州某某食品集团渠道管理系统合同',
    customerId: 'CUST016',
    customerName: '郑州某某食品集团有限公司',
    installmentNumber: 1,
    plannedAmount: 267000,
    plannedDate: '2026-03-15',
    actualAmount: 267000,
    actualDate: '2026-03-12',
    status: PaymentStatus.COMPLETED,
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    paymentCondition: '合同签订后 7 天内',
    remarks: '已回款',
    overdueDays: 0,
    createdAt: '2026-03-01 10:00',
    updatedAt: '2026-03-12 15:00'
  },
  {
    id: 'PP20260312011',
    contractId: 'CONT20260312009',
    contractNumber: 'HT20260312009',
    contractName: '郑州某某食品集团渠道管理系统合同',
    customerId: 'CUST016',
    customerName: '郑州某某食品集团有限公司',
    installmentNumber: 2,
    plannedAmount: 356000,
    plannedDate: '2026-05-17',
    status: PaymentStatus.PENDING,
    paymentCondition: '系统上线后 7 天内',
    remarks: '待上线',
    overdueDays: 0,
    createdAt: '2026-03-01 10:00',
    updatedAt: '2026-03-01 10:00'
  },
  {
    id: 'PP20260312012',
    contractId: 'CONT20260312010',
    contractNumber: 'HT20260312010',
    contractName: '上海某某贸易公司客户管理系统合同',
    customerId: 'CUST003',
    customerName: '上海某某贸易公司',
    installmentNumber: 1,
    plannedAmount: 200000,
    plannedDate: '2026-03-07',
    actualAmount: 200000,
    actualDate: '2026-03-05',
    status: PaymentStatus.COMPLETED,
    paymentMethod: PaymentMethod.ALIPAY,
    paymentCondition: '合同签订后 7 天内',
    remarks: '支付宝支付',
    overdueDays: 0,
    createdAt: '2026-02-25 11:00',
    updatedAt: '2026-03-05 10:00'
  },
  {
    id: 'PP20260312013',
    contractId: 'CONT20260312004',
    contractNumber: 'HT20260312004',
    contractName: '深圳某某电子 CRM 项目合同',
    customerId: 'CUST004',
    customerName: '深圳某某电子有限公司',
    installmentNumber: 1,
    plannedAmount: 140000,
    plannedDate: '2026-03-22',
    status: PaymentStatus.PENDING,
    paymentCondition: '合同签订后 7 天内',
    remarks: '待签订',
    overdueDays: 0,
    createdAt: '2026-03-12 11:00',
    updatedAt: '2026-03-12 11:00'
  },
  {
    id: 'PP20260312014',
    contractId: 'CONT20260312002',
    contractNumber: 'HT20260312002',
    contractName: '北京某某集团销售管理系统合同',
    customerId: 'CUST002',
    customerName: '北京某某集团',
    installmentNumber: 1,
    plannedAmount: 320000,
    plannedDate: '2026-03-20',
    status: PaymentStatus.PENDING,
    paymentCondition: '合同签订后 7 天内',
    remarks: '待审批通过',
    overdueDays: 0,
    createdAt: '2026-03-01 09:00',
    updatedAt: '2026-03-01 09:00'
  },
  {
    id: 'PP20260312015',
    contractId: 'CONT20260312006',
    contractNumber: 'HT20260312006',
    contractName: '西安某某能源企业客户管理平台合同',
    customerId: 'CUST010',
    customerName: '西安某某能源有限公司',
    installmentNumber: 1,
    plannedAmount: 285000,
    plannedDate: '2026-03-22',
    status: PaymentStatus.PENDING,
    paymentCondition: '合同签订后 7 天内',
    remarks: '待审批通过',
    overdueDays: 0,
    createdAt: '2026-03-05 11:00',
    updatedAt: '2026-03-05 11:00'
  },
  {
    id: 'PP20260312016',
    contractId: 'CONT20260312011',
    contractNumber: 'HT20260312011',
    contractName: '成都某某制造企业数字化项目合同',
    customerId: 'CUST007',
    customerName: '成都某某制造有限公司',
    installmentNumber: 1,
    plannedAmount: 360000,
    plannedDate: '2026-03-22',
    status: PaymentStatus.PENDING,
    paymentCondition: '合同签订后 7 天内',
    remarks: '待审批通过',
    overdueDays: 0,
    createdAt: '2026-03-05 15:00',
    updatedAt: '2026-03-05 15:00'
  },
  {
    id: 'PP20260312017',
    contractId: 'CONT20260312008',
    contractNumber: 'HT20260312008',
    contractName: '青岛某某啤酒厂经销商管理系统合同',
    customerId: 'CUST014',
    customerName: '青岛某某啤酒厂',
    installmentNumber: 1,
    plannedAmount: 220000,
    plannedDate: '2026-03-22',
    status: PaymentStatus.PENDING,
    paymentCondition: '合同签订后 7 天内',
    remarks: '待签订',
    overdueDays: 0,
    createdAt: '2026-03-12 14:00',
    updatedAt: '2026-03-12 14:00'
  },
  {
    id: 'PP20260312018',
    contractId: 'CONT20260312012',
    contractNumber: 'HT20260312012',
    contractName: '广州某某医药有限公司服务合同',
    customerId: 'CUST006',
    customerName: '广州某某医药有限公司',
    installmentNumber: 1,
    plannedAmount: 135000,
    plannedDate: '2026-03-22',
    status: PaymentStatus.PENDING,
    paymentCondition: '合同签订后 7 天内',
    remarks: '待签订',
    overdueDays: 0,
    createdAt: '2026-03-12 12:00',
    updatedAt: '2026-03-12 12:00'
  },
  {
    id: 'PP20260312019',
    contractId: 'CONT20260312014',
    contractNumber: 'HT20260312014',
    contractName: '重庆某某物流有限公司运输管理系统合同',
    customerId: 'CUST011',
    customerName: '重庆某某物流有限公司',
    installmentNumber: 1,
    plannedAmount: 112000,
    plannedDate: '2026-03-22',
    status: PaymentStatus.PENDING,
    paymentCondition: '合同签订后 7 天内',
    remarks: '待签订',
    overdueDays: 0,
    createdAt: '2026-03-12 11:00',
    updatedAt: '2026-03-12 11:00'
  },
  {
    id: 'PP20260312020',
    contractId: 'CONT20260312015',
    contractNumber: 'HT20260312015',
    contractName: '长沙某某工程机械售后服务系统合同',
    customerId: 'CUST015',
    customerName: '长沙某某工程机械有限公司',
    installmentNumber: 1,
    plannedAmount: 204000,
    plannedDate: '2026-03-22',
    status: PaymentStatus.PENDING,
    paymentCondition: '合同签订后 7 天内',
    remarks: '待审批通过',
    overdueDays: 0,
    createdAt: '2026-03-08 11:00',
    updatedAt: '2026-03-08 11:00'
  }
];

// 生成 15 条回款记录示例数据
export const paymentRecordData: PaymentRecord[] = [
  {
    id: 'PR20260312001',
    contractId: 'CONT20260312001',
    contractNumber: 'HT20260312001',
    contractName: '某某科技有限公司 CRM 系统采购合同',
    customerId: 'CUST001',
    customerName: '某某科技有限公司',
    planId: 'PP20260312001',
    amount: 150000,
    paymentDate: '2026-03-18',
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    paymentAccount: '工商银行 6222 **** **** 1234',
    status: 'VERIFIED',
    verifiedBy: 'USER008',
    verifiedAt: '2026-03-18 15:00',
    remarks: '已核销',
    createdBy: 'USER001',
    createdByName: '李四',
    createdAt: '2026-03-18 10:00',
    updatedAt: '2026-03-18 15:00'
  },
  {
    id: 'PR20260312002',
    contractId: 'CONT20260312003',
    contractNumber: 'HT20260312003',
    contractName: '杭州某某网络科技销售云平台合同',
    customerId: 'CUST005',
    customerName: '杭州某某网络科技有限公司',
    planId: 'PP20260312004',
    amount: 300000,
    paymentDate: '2026-03-15',
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    paymentAccount: '建设银行 6227 **** **** 5678',
    status: 'VERIFIED',
    verifiedBy: 'USER008',
    verifiedAt: '2026-03-15 16:00',
    remarks: '已核销',
    createdBy: 'USER002',
    createdByName: '王五',
    createdAt: '2026-03-15 11:00',
    updatedAt: '2026-03-15 16:00'
  },
  {
    id: 'PR20260312003',
    contractId: 'CONT20260312005',
    contractNumber: 'HT20260312005',
    contractName: '武汉某某零售连锁会员系统合同',
    customerId: 'CUST008',
    customerName: '武汉某某零售连锁有限公司',
    planId: 'PP20260312006',
    amount: 114000,
    paymentDate: '2026-03-10',
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    paymentAccount: '农业银行 6228 **** **** 9012',
    status: 'VERIFIED',
    verifiedBy: 'USER008',
    verifiedAt: '2026-03-10 14:00',
    remarks: '已核销',
    createdBy: 'USER003',
    createdByName: '赵六',
    createdAt: '2026-03-10 09:00',
    updatedAt: '2026-03-10 14:00'
  },
  {
    id: 'PR20260312004',
    contractId: 'CONT20260312007',
    contractNumber: 'HT20260312007',
    contractName: '天津某某化工集团销售管理项目合同',
    customerId: 'CUST012',
    customerName: '天津某某化工集团有限公司',
    planId: 'PP20260312008',
    amount: 216000,
    paymentDate: '2026-03-06',
    paymentMethod: PaymentMethod.CHECK,
    paymentAccount: '支票号：12345678',
    status: 'VERIFIED',
    verifiedBy: 'USER008',
    verifiedAt: '2026-03-06 17:00',
    remarks: '支票已入账',
    createdBy: 'USER003',
    createdByName: '赵六',
    createdAt: '2026-03-06 14:00',
    updatedAt: '2026-03-06 17:00'
  },
  {
    id: 'PR20260312005',
    contractId: 'CONT20260312009',
    contractNumber: 'HT20260312009',
    contractName: '郑州某某食品集团渠道管理系统合同',
    customerId: 'CUST016',
    customerName: '郑州某某食品集团有限公司',
    planId: 'PP20260312010',
    amount: 267000,
    paymentDate: '2026-03-12',
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    paymentAccount: '工商银行 6222 **** **** 3456',
    status: 'VERIFIED',
    verifiedBy: 'USER008',
    verifiedAt: '2026-03-12 17:00',
    remarks: '已核销',
    createdBy: 'USER003',
    createdByName: '赵六',
    createdAt: '2026-03-12 15:00',
    updatedAt: '2026-03-12 17:00'
  },
  {
    id: 'PR20260312006',
    contractId: 'CONT20260312010',
    contractNumber: 'HT20260312010',
    contractName: '上海某某贸易公司客户管理系统合同',
    customerId: 'CUST003',
    customerName: '上海某某贸易公司',
    planId: 'PP20260312012',
    amount: 200000,
    paymentDate: '2026-03-05',
    paymentMethod: PaymentMethod.ALIPAY,
    paymentAccount: 'alipay@company.com',
    status: 'VERIFIED',
    verifiedBy: 'USER008',
    verifiedAt: '2026-03-05 15:00',
    remarks: '支付宝已确认',
    createdBy: 'USER001',
    createdByName: '李四',
    createdAt: '2026-03-05 10:00',
    updatedAt: '2026-03-05 15:00'
  },
  {
    id: 'PR20260312007',
    contractId: 'CONT20260312001',
    contractNumber: 'HT20260312001',
    contractName: '某某科技有限公司 CRM 系统采购合同',
    customerId: 'CUST001',
    customerName: '某某科技有限公司',
    amount: 50000,
    paymentDate: '2026-03-20',
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    paymentAccount: '工商银行 6222 **** **** 1234',
    status: 'PENDING_VERIFY',
    remarks: '待财务核销',
    createdBy: 'USER001',
    createdByName: '李四',
    createdAt: '2026-03-20 10:00',
    updatedAt: '2026-03-20 10:00'
  },
  {
    id: 'PR20260312008',
    contractId: 'CONT20260312002',
    contractNumber: 'HT20260312002',
    contractName: '北京某某集团销售管理系统合同',
    customerId: 'CUST002',
    customerName: '北京某某集团',
    amount: 100000,
    paymentDate: '2026-03-19',
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    paymentAccount: '建设银行 6227 **** **** 7890',
    status: 'PENDING_VERIFY',
    remarks: '部分回款，待核销',
    createdBy: 'USER002',
    createdByName: '王五',
    createdAt: '2026-03-19 14:00',
    updatedAt: '2026-03-19 14:00'
  },
  {
    id: 'PR20260312009',
    contractId: 'CONT20260312004',
    contractNumber: 'HT20260312004',
    contractName: '深圳某某电子 CRM 项目合同',
    customerId: 'CUST004',
    customerName: '深圳某某电子有限公司',
    amount: 50000,
    paymentDate: '2026-03-18',
    paymentMethod: PaymentMethod.WECHAT_PAY,
    paymentAccount: 'wx_pay@company.com',
    status: 'REJECTED',
    remarks: '付款账户信息不符，已驳回',
    verifiedBy: 'USER008',
    verifiedAt: '2026-03-19 09:00',
    createdBy: 'USER003',
    createdByName: '赵六',
    createdAt: '2026-03-18 16:00',
    updatedAt: '2026-03-19 09:00'
  },
  {
    id: 'PR20260312010',
    contractId: 'CONT20260312006',
    contractNumber: 'HT20260312006',
    contractName: '西安某某能源企业客户管理平台合同',
    customerId: 'CUST010',
    customerName: '西安某某能源有限公司',
    amount: 150000,
    paymentDate: '2026-03-17',
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    paymentAccount: '中国银行 6216 **** **** 2345',
    status: 'VERIFIED',
    verifiedBy: 'USER008',
    verifiedAt: '2026-03-17 16:00',
    remarks: '已核销',
    createdBy: 'USER002',
    createdByName: '王五',
    createdAt: '2026-03-17 11:00',
    updatedAt: '2026-03-17 16:00'
  },
  {
    id: 'PR20260312011',
    contractId: 'CONT20260312011',
    contractNumber: 'HT20260312011',
    contractName: '成都某某制造企业数字化项目合同',
    customerId: 'CUST007',
    customerName: '成都某某制造有限公司',
    amount: 200000,
    paymentDate: '2026-03-16',
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    paymentAccount: '工商银行 6222 **** **** 6789',
    status: 'VERIFIED',
    verifiedBy: 'USER008',
    verifiedAt: '2026-03-16 17:00',
    remarks: '预付款已核销',
    createdBy: 'USER001',
    createdByName: '李四',
    createdAt: '2026-03-16 10:00',
    updatedAt: '2026-03-16 17:00'
  },
  {
    id: 'PR20260312012',
    contractId: 'CONT20260312008',
    contractNumber: 'HT20260312008',
    contractName: '青岛某某啤酒厂经销商管理系统合同',
    customerId: 'CUST014',
    customerName: '青岛某某啤酒厂',
    amount: 100000,
    paymentDate: '2026-03-15',
    paymentMethod: PaymentMethod.CHECK,
    paymentAccount: '支票号：87654321',
    status: 'PENDING_VERIFY',
    remarks: '支票待入账',
    createdBy: 'USER002',
    createdByName: '王五',
    createdAt: '2026-03-15 14:00',
    updatedAt: '2026-03-15 14:00'
  },
  {
    id: 'PR20260312013',
    contractId: 'CONT20260312012',
    contractNumber: 'HT20260312012',
    contractName: '广州某某医药有限公司服务合同',
    customerId: 'CUST006',
    customerName: '广州某某医药有限公司',
    amount: 80000,
    paymentDate: '2026-03-14',
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    paymentAccount: '农业银行 6228 **** **** 4567',
    status: 'VERIFIED',
    verifiedBy: 'USER008',
    verifiedAt: '2026-03-14 16:00',
    remarks: '已核销',
    createdBy: 'USER004',
    createdByName: '孙七',
    createdAt: '2026-03-14 11:00',
    updatedAt: '2026-03-14 16:00'
  },
  {
    id: 'PR20260312014',
    contractId: 'CONT20260312014',
    contractNumber: 'HT20260312014',
    contractName: '重庆某某物流有限公司运输管理系统合同',
    customerId: 'CUST011',
    customerName: '重庆某某物流有限公司',
    amount: 60000,
    paymentDate: '2026-03-13',
    paymentMethod: PaymentMethod.ALIPAY,
    paymentAccount: 'alipay_logistics@company.com',
    status: 'VERIFIED',
    verifiedBy: 'USER008',
    verifiedAt: '2026-03-13 17:00',
    remarks: '已核销',
    createdBy: 'USER001',
    createdByName: '李四',
    createdAt: '2026-03-13 10:00',
    updatedAt: '2026-03-13 17:00'
  },
  {
    id: 'PR20260312015',
    contractId: 'CONT20260312015',
    contractNumber: 'HT20260312015',
    contractName: '长沙某某工程机械售后服务系统合同',
    customerId: 'CUST015',
    customerName: '长沙某某工程机械有限公司',
    amount: 150000,
    paymentDate: '2026-03-12',
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    paymentAccount: '建设银行 6227 **** **** 8901',
    status: 'VERIFIED',
    verifiedBy: 'USER008',
    verifiedAt: '2026-03-12 16:00',
    remarks: '预付款已核销',
    createdBy: 'USER001',
    createdByName: '李四',
    createdAt: '2026-03-12 11:00',
    updatedAt: '2026-03-12 16:00'
  }
];

// 生成 10 条应收账款示例数据
export const accountReceivableData: AccountReceivable[] = [
  {
    id: 'AR20260312001',
    contractId: 'CONT20260312001',
    contractNumber: 'HT20260312001',
    contractName: '某某科技有限公司 CRM 系统采购合同',
    customerId: 'CUST001',
    customerName: '某某科技有限公司',
    totalAmount: 500000,
    paidAmount: 150000,
    unpaidAmount: 350000,
    overdueAmount: 0,
    overdueDays: 0,
    agingBucket: '0-30',
    lastPaymentDate: '2026-03-18',
    nextDueDate: '2026-04-20'
  },
  {
    id: 'AR20260312002',
    contractId: 'CONT20260312003',
    contractNumber: 'HT20260312003',
    contractName: '杭州某某网络科技销售云平台合同',
    customerId: 'CUST005',
    customerName: '杭州某某网络科技有限公司',
    totalAmount: 600000,
    paidAmount: 300000,
    unpaidAmount: 300000,
    overdueAmount: 0,
    overdueDays: 0,
    agingBucket: '0-30',
    lastPaymentDate: '2026-03-15',
    nextDueDate: '2026-04-17'
  },
  {
    id: 'AR20260312003',
    contractId: 'CONT20260312005',
    contractNumber: 'HT20260312005',
    contractName: '武汉某某零售连锁会员系统合同',
    customerId: 'CUST008',
    customerName: '武汉某某零售连锁有限公司',
    totalAmount: 380000,
    paidAmount: 114000,
    unpaidAmount: 266000,
    overdueAmount: 0,
    overdueDays: 0,
    agingBucket: '0-30',
    lastPaymentDate: '2026-03-10',
    nextDueDate: '2026-05-01'
  },
  {
    id: 'AR20260312004',
    contractId: 'CONT20260312007',
    contractNumber: 'HT20260312007',
    contractName: '天津某某化工集团销售管理项目合同',
    customerId: 'CUST012',
    customerName: '天津某某化工集团有限公司',
    totalAmount: 720000,
    paidAmount: 216000,
    unpaidAmount: 504000,
    overdueAmount: 0,
    overdueDays: 0,
    agingBucket: '0-30',
    lastPaymentDate: '2026-03-06',
    nextDueDate: '2026-05-01'
  },
  {
    id: 'AR20260312005',
    contractId: 'CONT20260312009',
    contractNumber: 'HT20260312009',
    contractName: '郑州某某食品集团渠道管理系统合同',
    customerId: 'CUST016',
    customerName: '郑州某某食品集团有限公司',
    totalAmount: 890000,
    paidAmount: 267000,
    unpaidAmount: 623000,
    overdueAmount: 0,
    overdueDays: 0,
    agingBucket: '0-30',
    lastPaymentDate: '2026-03-12',
    nextDueDate: '2026-05-17'
  },
  {
    id: 'AR20260312006',
    contractId: 'CONT20260312010',
    contractNumber: 'HT20260312010',
    contractName: '上海某某贸易公司客户管理系统合同',
    customerId: 'CUST003',
    customerName: '上海某某贸易公司',
    totalAmount: 200000,
    paidAmount: 200000,
    unpaidAmount: 0,
    overdueAmount: 0,
    overdueDays: 0,
    agingBucket: '0-30',
    lastPaymentDate: '2026-03-05',
    nextDueDate: undefined
  },
  {
    id: 'AR20260312007',
    contractId: 'CONT20260312002',
    contractNumber: 'HT20260312002',
    contractName: '北京某某集团销售管理系统合同',
    customerId: 'CUST002',
    customerName: '北京某某集团',
    totalAmount: 800000,
    paidAmount: 100000,
    unpaidAmount: 700000,
    overdueAmount: 0,
    overdueDays: 0,
    agingBucket: '0-30',
    lastPaymentDate: '2026-03-19',
    nextDueDate: '2026-03-20'
  },
  {
    id: 'AR20260312008',
    contractId: 'CONT20260312006',
    contractNumber: 'HT20260312006',
    contractName: '西安某某能源企业客户管理平台合同',
    customerId: 'CUST010',
    customerName: '西安某某能源有限公司',
    totalAmount: 950000,
    paidAmount: 150000,
    unpaidAmount: 800000,
    overdueAmount: 0,
    overdueDays: 0,
    agingBucket: '0-30',
    lastPaymentDate: '2026-03-17',
    nextDueDate: '2026-03-22'
  },
  {
    id: 'AR20260312009',
    contractId: 'CONT20260312011',
    contractNumber: 'HT20260312011',
    contractName: '成都某某制造企业数字化项目合同',
    customerId: 'CUST007',
    customerName: '成都某某制造有限公司',
    totalAmount: 1200000,
    paidAmount: 200000,
    unpaidAmount: 1000000,
    overdueAmount: 0,
    overdueDays: 0,
    agingBucket: '0-30',
    lastPaymentDate: '2026-03-16',
    nextDueDate: '2026-03-22'
  },
  {
    id: 'AR20260312010',
    contractId: 'CONT20260312004',
    contractNumber: 'HT20260312004',
    contractName: '深圳某某电子 CRM 项目合同',
    customerId: 'CUST004',
    customerName: '深圳某某电子有限公司',
    totalAmount: 350000,
    paidAmount: 0,
    unpaidAmount: 350000,
    overdueAmount: 0,
    overdueDays: 0,
    agingBucket: '0-30',
    lastPaymentDate: undefined,
    nextDueDate: '2026-03-22'
  }
];

// 生成发票示例数据
export const invoiceData: Invoice[] = [
  {
    id: 'INV20260312001',
    invoiceNumber: '发票 2026001',
    type: 'SPECIAL',
    title: '某某科技有限公司',
    taxId: '91110000****123456',
    amount: 150000,
    status: InvoiceStatus.DELIVERED,
    requestDate: '2026-03-10',
    invoiceDate: '2026-03-15',
    deliveryMethod: '快递',
    remarks: '已送达'
  },
  {
    id: 'INV20260312002',
    invoiceNumber: '发票 2026002',
    type: 'SPECIAL',
    title: '杭州某某网络科技有限公司',
    taxId: '91330000****789012',
    amount: 300000,
    status: InvoiceStatus.DELIVERED,
    requestDate: '2026-03-08',
    invoiceDate: '2026-03-12',
    deliveryMethod: '电子发票',
    remarks: '已发送邮箱'
  },
  {
    id: 'INV20260312003',
    invoiceNumber: '发票 2026003',
    type: 'NORMAL',
    title: '武汉某某零售连锁有限公司',
    taxId: '91420000****345678',
    amount: 114000,
    status: InvoiceStatus.DELIVERED,
    requestDate: '2026-03-05',
    invoiceDate: '2026-03-08',
    deliveryMethod: '快递',
    remarks: '已签收'
  },
  {
    id: 'INV20260312004',
    invoiceNumber: '发票 2026004',
    type: 'SPECIAL',
    title: '天津某某化工集团有限公司',
    taxId: '91120000****901234',
    amount: 216000,
    status: InvoiceStatus.DELIVERED,
    requestDate: '2026-02-28',
    invoiceDate: '2026-03-04',
    deliveryMethod: '快递',
    remarks: '已签收'
  },
  {
    id: 'INV20260312005',
    invoiceNumber: '发票 2026005',
    type: 'SPECIAL',
    title: '郑州某某食品集团有限公司',
    taxId: '91410000****567890',
    amount: 267000,
    status: InvoiceStatus.INVOICED,
    requestDate: '2026-03-10',
    invoiceDate: '2026-03-14',
    remarks: '待送达'
  },
  {
    id: 'INV20260312006',
    invoiceNumber: undefined,
    type: 'SPECIAL',
    title: '北京某某集团',
    taxId: '91110000****234567',
    amount: 320000,
    status: InvoiceStatus.PENDING,
    requestDate: '2026-03-15',
    remarks: '待开票'
  },
  {
    id: 'INV20260312007',
    invoiceNumber: undefined,
    type: 'NORMAL',
    title: '上海某某贸易公司',
    taxId: '91310000****678901',
    amount: 200000,
    status: InvoiceStatus.NOT_REQUESTED,
    remarks: '未申请'
  }
];

// 生成回款统计数据
export const generatePaymentStats = (): PaymentStats => {
  const totalPlanned = paymentPlanData.reduce((sum, p) => sum + p.plannedAmount, 0);
  const totalActual = paymentPlanData.reduce((sum, p) => sum + (p.actualAmount || 0), 0);
  const completionRate = totalPlanned > 0 ? Math.round((totalActual / totalPlanned) * 100) : 0;
  
  const overduePlans = paymentPlanData.filter(p => p.status === PaymentStatus.OVERDUE);
  const overdueAmount = overduePlans.reduce((sum, p) => sum + p.plannedAmount, 0);
  
  const byStatus: Record<PaymentStatus, number> = {
    [PaymentStatus.PENDING]: 0,
    [PaymentStatus.PARTIAL]: 0,
    [PaymentStatus.COMPLETED]: 0,
    [PaymentStatus.OVERDUE]: 0
  };
  
  paymentPlanData.forEach(p => {
    byStatus[p.status]++;
  });
  
  const byPaymentMethod: Record<PaymentMethod, number> = {
    [PaymentMethod.BANK_TRANSFER]: 0,
    [PaymentMethod.ALIPAY]: 0,
    [PaymentMethod.WECHAT_PAY]: 0,
    [PaymentMethod.CASH]: 0,
    [PaymentMethod.CHECK]: 0,
    [PaymentMethod.OTHER]: 0
  };
  
  paymentPlanData.filter(p => p.actualAmount).forEach(p => {
    if (p.paymentMethod) {
      byPaymentMethod[p.paymentMethod] += p.actualAmount;
    }
  });
  
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  
  const thisMonthPlanned = paymentPlanData
    .filter(p => {
      const date = new Date(p.plannedDate);
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    })
    .reduce((sum, p) => sum + p.plannedAmount, 0);
  
  const thisMonthActual = paymentPlanData
    .filter(p => {
      if (!p.actualDate) return false;
      const date = new Date(p.actualDate);
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    })
    .reduce((sum, p) => sum + (p.actualAmount || 0), 0);
  
  return {
    totalPlanned,
    totalActual,
    completionRate,
    overdueAmount,
    overdueCount: overduePlans.length,
    thisMonthPlanned,
    thisMonthActual,
    byStatus,
    byPaymentMethod
  };
};

// 生成回款趋势数据
export const generatePaymentTrend = (): PaymentTrend[] => {
  const trend: PaymentTrend[] = [];
  const now = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    const planned = paymentPlanData
      .filter(p => p.plannedDate.startsWith(monthStr))
      .reduce((sum, p) => sum + p.plannedAmount, 0);
    
    const actual = paymentPlanData
      .filter(p => p.actualDate?.startsWith(monthStr))
      .reduce((sum, p) => sum + (p.actualAmount || 0), 0);
    
    const rate = planned > 0 ? Math.round((actual / planned) * 100) : 0;
    
    trend.push({
      date: monthStr,
      planned,
      actual,
      rate
    });
  }
  
  return trend;
};

// 根据筛选条件过滤回款计划
export const filterPaymentPlans = (
  plans: PaymentPlan[],
  filter: { contractNumber?: string; customerName?: string; status?: PaymentStatus }
): PaymentPlan[] => {
  return plans.filter(plan => {
    if (filter.contractNumber && !plan.contractNumber.toLowerCase().includes(filter.contractNumber.toLowerCase())) {
      return false;
    }
    if (filter.customerName && !plan.customerName.toLowerCase().includes(filter.customerName.toLowerCase())) {
      return false;
    }
    if (filter.status && plan.status !== filter.status) {
      return false;
    }
    return true;
  });
};

// 根据筛选条件过滤回款记录
export const filterPaymentRecords = (
  records: PaymentRecord[],
  filter: { contractNumber?: string; customerName?: string; status?: string }
): PaymentRecord[] => {
  return records.filter(record => {
    if (filter.contractNumber && !record.contractNumber.toLowerCase().includes(filter.contractNumber.toLowerCase())) {
      return false;
    }
    if (filter.customerName && !record.customerName.toLowerCase().includes(filter.customerName.toLowerCase())) {
      return false;
    }
    if (filter.status && record.status !== filter.status) {
      return false;
    }
    return true;
  });
};
