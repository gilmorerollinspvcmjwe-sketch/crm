/**
 * 客户模块类型定义
 * 基于 CRM_Product_Design_v2.2 字段设计
 */

/** 客户等级枚举 */
export type CustomerLevel = 'A' | 'B' | 'C' | 'D';

/** 客户状态枚举 */
export type CustomerStatus = '潜在' | '意向' | '成交' | '流失' | '冻结';

/** 客户来源枚举 */
export type CustomerSource = '市场活动' | '官网' | '转介绍' | '陌拜' | '广告' | '其他';

/** 所属行业枚举 */
export type Industry = 
  | '互联网/软件/IT 服务'
  | '制造业'
  | '金融业'
  | '零售业'
  | '医疗健康'
  | '教育培训'
  | '房地产'
  | '能源/化工'
  | '物流/运输'
  | '其他';

/** 企业规模枚举 */
export type CompanySize = 
  | '1-49 人'
  | '50-99 人'
  | '100-499 人'
  | '500-999 人'
  | '1000-4999 人'
  | '5000 人以上';

/** 客户基本信息 */
export interface Customer {
  /** 客户 ID - 唯一标识 */
  id: string;
  /** 客户名称 - 企业全称 */
  name: string;
  /** 客户简称 */
  shortName?: string;
  /** 所属行业 */
  industry: Industry;
  /** 行业细分 */
  industryDetail?: string;
  /** 企业规模 */
  companySize?: CompanySize;
  /** 年营业额 */
  annualRevenue?: string;
  /** 客户来源 */
  source: CustomerSource;
  /** 客户等级 */
  level: CustomerLevel;
  /** 客户状态 */
  status: CustomerStatus;
  /** 所属区域 - 省/市/区 */
  region?: string;
  /** 详细地址 */
  address?: string;
  /** 公司电话 */
  phone?: string;
  /** 公司官网 */
  website?: string;
  /** 客户 Owner - 负责人 ID */
  ownerId: string;
  /** 客户 Owner 姓名 */
  ownerName?: string;
  /** 创建人 */
  createdBy: string;
  /** 创建时间 */
  createdAt: string;
  /** 最后修改人 */
  updatedBy?: string;
  /** 最后修改时间 */
  updatedAt?: string;
  /** 下次联系时间 */
  nextContactTime?: string;
  /** 公海状态 */
  isPublic?: boolean;
  /** 备注 */
  remark?: string;
}

/** 客户列表查询参数 */
export interface CustomerQueryParams {
  /** 客户名称搜索 */
  name?: string;
  /** 行业筛选 */
  industry?: Industry;
  /** 等级筛选 */
  level?: CustomerLevel;
  /** 状态筛选 */
  status?: CustomerStatus;
  /** 页码 */
  page?: number;
  /** 每页条数 */
  pageSize?: number;
}

/** 客户列表响应 */
export interface CustomerListResponse {
  /** 客户列表 */
  list: Customer[];
  /** 总条数 */
  total: number;
  /** 当前页码 */
  page: number;
  /** 每页条数 */
  pageSize: number;
}
