/**
 * 销售工作台 Mock 数据
 */

export interface UserInfo {
  id: string;
  name: string;
  avatar?: string;
  role: 'sales' | 'manager';
  team: string;
}

export interface TodoItem {
  id: string;
  type: 'followup' | 'approval' | 'payment' | 'meeting';
  title: string;
  customerName?: string;
  customerId?: string;
  time: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed';
  phone?: string;
}

export interface WinPrediction {
  opportunityId: string;
  customerName: string;
  amount: number;
  stage: 'lead' | 'qualify' | 'proposal' | 'negotiation' | 'closed';
  winProbability: number;
  recommendation: string;
}

export interface KeyCustomer {
  customerId: string;
  name: string;
  reason: string;
  suggestedAction: string;
}

export interface PerformanceData {
  today: {
    amount: number;
    target: number;
  };
  thisWeek: {
    amount: number;
    target: number;
  };
  thisMonth: {
    amount: number;
    target: number;
    rank: number;
    totalTeamMembers: number;
  };
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  route?: string;
  action?: () => void;
}

export const workbenchMockData = {
  // 用户信息
  user: {
    id: 'user-001',
    name: '张经理',
    avatar: '',
    role: 'manager' as const,
    team: '华东区',
  },

  // 今日待办（8 条）
  todos: [
    {
      id: 'todo-1',
      type: 'followup' as const,
      title: '方案演示',
      customerName: '北京科技创新',
      customerId: 'cust-001',
      time: '今天 14:00',
      priority: 'high' as const,
      status: 'pending' as const,
      phone: '13800138001',
    },
    {
      id: 'todo-2',
      type: 'followup' as const,
      title: '合同跟进',
      customerName: '上海智能制造',
      customerId: 'cust-002',
      time: '今天 16:00',
      priority: 'high' as const,
      status: 'pending' as const,
      phone: '13800138002',
    },
    {
      id: 'todo-3',
      type: 'payment' as const,
      title: '回款确认',
      customerName: '武汉商贸集团',
      customerId: 'cust-003',
      time: '明天 10:00',
      priority: 'medium' as const,
      status: 'pending' as const,
      phone: '13800138003',
    },
    {
      id: 'todo-4',
      type: 'followup' as const,
      title: '初次联系',
      customerName: '杭州云服务',
      customerId: 'cust-004',
      time: '待处理',
      priority: 'low' as const,
      status: 'pending' as const,
      phone: '13800138004',
    },
    {
      id: 'todo-5',
      type: 'meeting' as const,
      title: '商务谈判',
      customerName: '广州数字科技',
      customerId: 'cust-005',
      time: '今天 10:00',
      priority: 'high' as const,
      status: 'pending' as const,
      phone: '13800138005',
    },
    {
      id: 'todo-6',
      type: 'approval' as const,
      title: '报价审批',
      customerName: '深圳未来科技',
      customerId: 'cust-006',
      time: '今天 12:00',
      priority: 'medium' as const,
      status: 'pending' as const,
    },
    {
      id: 'todo-7',
      type: 'followup' as const,
      title: '需求调研',
      customerName: '南京信息技术',
      customerId: 'cust-007',
      time: '明天 14:00',
      priority: 'medium' as const,
      status: 'pending' as const,
      phone: '13800138007',
    },
    {
      id: 'todo-8',
      type: 'payment' as const,
      title: '合同签署',
      customerName: '成都软件开发',
      customerId: 'cust-008',
      time: '本周五',
      priority: 'high' as const,
      status: 'pending' as const,
      phone: '13800138008',
    },
  ],

  // AI 推荐
  aiRecommendations: {
    // 赢单预测（4 条）
    winPredictions: [
      {
        opportunityId: 'opp-001',
        customerName: '北京科技创新',
        amount: 800000,
        stage: 'negotiation' as const,
        winProbability: 0.78,
        recommendation: '建议跟进',
      },
      {
        opportunityId: 'opp-002',
        customerName: '上海智能制造',
        amount: 500000,
        stage: 'proposal' as const,
        winProbability: 0.65,
        recommendation: '推进报价',
      },
      {
        opportunityId: 'opp-003',
        customerName: '武汉商贸集团',
        amount: 350000,
        stage: 'qualify' as const,
        winProbability: 0.52,
        recommendation: '需要方案',
      },
      {
        opportunityId: 'opp-004',
        customerName: '杭州云服务',
        amount: 250000,
        stage: 'lead' as const,
        winProbability: 0.45,
        recommendation: '保持联系',
      },
    ],
    // 重点客户（1 条）
    keyCustomers: [
      {
        customerId: 'cust-001',
        name: '北京科技创新有限公司',
        reason: '商机金额大 (80 万) + 阶段靠后 (谈判审批)',
        suggestedAction: '安排商务谈判，准备合同',
      },
    ],
  },

  // 个人业绩
  performance: {
    today: {
      amount: 15000,
      target: 20000,
    },
    thisWeek: {
      amount: 85000,
      target: 100000,
    },
    thisMonth: {
      amount: 1250000,
      target: 1500000,
      rank: 3,
      totalTeamMembers: 12,
    },
  },

  // 快捷操作（6 个）
  quickActions: [
    { id: 'new-customer', label: '新建客户', icon: 'user', route: '/customer/new' },
    { id: 'new-opportunity', label: '新建商机', icon: 'opportunity', route: '/opportunity/new' },
    { id: 'new-followup', label: '新建跟进', icon: 'activity', route: '/activity/new' },
    { id: 'new-quote', label: '新建报价', icon: 'quote', route: '/quote/new' },
    { id: 'new-contract', label: '新建合同', icon: 'contract', route: '/contract/new' },
    { id: 'schedule', label: '日程', icon: 'calendar', route: '/calendar' },
  ],
};
