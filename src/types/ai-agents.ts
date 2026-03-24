/**
 * AI Agent 类型定义 - Phase 5
 */

// AI Agent 状态
export type AgentStatus = 'active' | 'inactive' | 'training' | 'error';

// AI Agent 类型
export type AgentType = 
  | 'predictive'      // 预测型
  | 'generative'      // 生成型
  | 'analytical'      // 分析型
  | 'conversational'  // 对话型
  | 'automation'      // 自动化型
  | 'recommendation'; // 推荐型

// AI Agent 执行日志
export interface AgentExecutionLog {
  id: string;
  agentId: string;
  timestamp: string;
  action: string;
  input: string;
  output: string;
  duration: number; // 毫秒
  status: 'success' | 'failed' | 'timeout';
  confidence?: number; // 置信度 0-1
  errorMessage?: string;
}

// AI Agent 效果统计
export interface AgentMetrics {
  totalExecutions: number; // 总执行次数
  successRate: number; // 成功率 %
  avgResponseTime: number; // 平均响应时间 (ms)
  accuracyRate: number; // 准确率 %
  userSatisfaction: number; // 用户满意度 1-5
  tasksCompleted: number; // 完成任务数
  errorsCount: number; // 错误次数
  last7Days: {
    date: string;
    executions: number;
    successRate: number;
  }[];
}

// AI Agent 配置
export interface AgentConfig {
  model: string; // 使用的模型
  temperature: number; // 温度参数
  maxTokens: number; // 最大 token 数
  topP: number; // Top-P 采样
  frequencyPenalty: number; // 频率惩罚
  presencePenalty: number; // 存在惩罚
  customInstructions?: string; // 自定义指令
}

// AI Agent 能力
export interface AgentCapability {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

// AI Agent 主接口
export interface AIAgent {
  id: string;
  name: string;
  type: AgentType;
  description: string;
  status: AgentStatus;
  avatar?: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  lastActiveAt?: string;
  
  // 配置
  config: AgentConfig;
  
  // 能力
  capabilities: AgentCapability[];
  
  // 指标
  metrics: AgentMetrics;
  
  // 关联数据
  relatedModels: string[]; // 关联的数据模型
  triggers: string[]; // 触发条件
  
  // 权限
  allowedUsers: string[]; // 允许使用的用户 ID
  isPublic: boolean; // 是否公开
}

// 预测趋势数据
export interface PredictiveTrend {
  period: string;
  predicted: number;
  actual?: number;
  confidence: number;
}

// 预测准确率统计
export interface PredictionAccuracy {
  metric: string;
  accuracy: number;
  totalPredictions: number;
  correctPredictions: number;
  meanAbsoluteError: number;
  rootMeanSquareError: number;
}

// Agent 详情统计
export interface AgentDetailStats {
  basicInfo: AIAgent;
  executionLogs: AgentExecutionLog[];
  metrics: AgentMetrics;
  trends: PredictiveTrend[];
  accuracy: PredictionAccuracy[];
}
