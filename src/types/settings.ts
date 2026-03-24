/**
 * 系统设置类型定义
 */

/** 基础设置 */
export interface BasicSettings {
  companyName: string;
  logoUrl: string;
  workDays: number[];
  dataRetentionDays: number;
}

/** 销售阶段 */
export interface SalesStage {
  id: string;
  name: string;
  order: number;
  successRate: number;
  color: string;
}

/** 跟进类型 */
export interface FollowUpType {
  id: string;
  name: string;
  icon: string;
  color: string;
  enabled: boolean;
}

/** 系统设置完整数据 */
export interface SystemSettings {
  basic: BasicSettings;
  salesStages: SalesStage[];
  followUpTypes: FollowUpType[];
}

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
