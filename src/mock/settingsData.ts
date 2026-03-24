/**
 * 系统设置 Mock 数据
 */

import { SystemSettings } from '../types/settings';

/** 系统设置默认数据 */
export const systemSettings: SystemSettings = {
  basic: {
    companyName: '某某科技有限公司',
    logoUrl: '/logo.png',
    workDays: [1, 2, 3, 4, 5], // 周一至周五
    dataRetentionDays: 730, // 2 年
  },
  salesStages: [
    {
      id: 'stage1',
      name: '初步接洽',
      order: 1,
      successRate: 100,
      color: '#1890ff',
    },
    {
      id: 'stage2',
      name: '需求分析',
      order: 2,
      successRate: 62.8,
      color: '#52c41a',
    },
    {
      id: 'stage3',
      name: '方案报价',
      order: 3,
      successRate: 68.4,
      color: '#faad14',
    },
    {
      id: 'stage4',
      name: '商务谈判',
      order: 4,
      successRate: 62.7,
      color: '#f5222d',
    },
    {
      id: 'stage5',
      name: '合同签订',
      order: 5,
      successRate: 66.7,
      color: '#722ed1',
    },
  ],
  followUpTypes: [
    {
      id: 'follow1',
      name: '电话',
      icon: 'phone',
      color: '#1890ff',
      enabled: true,
    },
    {
      id: 'follow2',
      name: '拜访',
      icon: 'user',
      color: '#52c41a',
      enabled: true,
    },
    {
      id: 'follow3',
      name: '邮件',
      icon: 'mail',
      color: '#faad14',
      enabled: true,
    },
    {
      id: 'follow4',
      name: '微信',
      icon: 'wechat',
      color: '#07c160',
      enabled: true,
    },
    {
      id: 'follow5',
      name: '会议',
      icon: 'team',
      color: '#722ed1',
      enabled: true,
    },
  ],
};

/** 可用图标列表 */
export const AVAILABLE_ICONS = [
  'phone',
  'user',
  'mail',
  'wechat',
  'team',
  'calendar',
  'message',
  'video-camera',
];

/** 可用颜色列表 */
export const AVAILABLE_COLORS = [
  '#1890ff',
  '#52c41a',
  '#faad14',
  '#f5222d',
  '#722ed1',
  '#13c2c2',
  '#eb2f96',
  '#fa8c16',
];

/** 工作日选项 */
export const WORK_DAY_OPTIONS = [
  { value: 0, label: '周日' },
  { value: 1, label: '周一' },
  { value: 2, label: '周二' },
  { value: 3, label: '周三' },
  { value: 4, label: '周四' },
  { value: 5, label: '周五' },
  { value: 6, label: '周六' },
];

/** 数据保留策略选项 */
export const RETENTION_OPTIONS = [
  { value: 90, label: '3 个月' },
  { value: 180, label: '6 个月' },
  { value: 365, label: '1 年' },
  { value: 730, label: '2 年' },
  { value: 1095, label: '3 年' },
];
