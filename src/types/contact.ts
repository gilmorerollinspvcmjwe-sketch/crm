/**
 * 联系人模块类型定义
 * 基于 CRM_Product_Design_v2.2 字段设计
 */

/** 性别枚举 */
export type Gender = '男' | '女' | '未知';

/** 职级枚举 */
export type JobLevel = '高管' | '中层' | '基层' | '其他';

/** 决策角色枚举 */
export type DecisionRole = '决策者' | '影响者' | '使用者' | '把关者' | '其他';

/** 联系人基本信息 */
export interface Contact {
  /** 联系人 ID - 唯一标识 */
  id: string;
  /** 姓名 */
  name: string;
  /** 性别 */
  gender?: Gender;
  /** 职位 */
  position?: string;
  /** 职级 */
  jobLevel?: JobLevel;
  /** 决策角色 - 采购决策中的角色 */
  decisionRole?: DecisionRole;
  /** 所属客户 ID */
  customerId: string;
  /** 所属客户名称 */
  customerName?: string;
  /** 多客户关联 - 兼职/多公司任职 */
  multiCustomers?: string[];
  /** 手机号码 */
  mobile?: string;
  /** 办公电话 */
  officePhone?: string;
  /** 邮箱 */
  email?: string;
  /** 微信 */
  wechat?: string;
  /** QQ */
  qq?: string;
  /** 办公地址 */
  address?: string;
  /** 生日 */
  birthday?: string;
  /** 入职时间 */
  joinDate?: string;
  /** 毕业院校 */
  school?: string;
  /** 学历 */
  education?: string;
  /** 专业 */
  major?: string;
  /** 兴趣爱好 */
  hobbies?: string;
  /** 备注 */
  remark?: string;
  /** 联系人 Owner - 负责人 ID */
  ownerId: string;
  /** 联系人 Owner 姓名 */
  ownerName?: string;
  /** 创建人 */
  createdBy: string;
  /** 创建时间 */
  createdAt: string;
  /** 最后修改人 */
  updatedBy?: string;
  /** 最后修改时间 */
  updatedAt?: string;
}

/** 联系人列表查询参数 */
export interface ContactQueryParams {
  /** 姓名搜索 */
  name?: string;
  /** 所属客户筛选 */
  customerName?: string;
  /** 职位筛选 */
  position?: string;
  /** 页码 */
  page?: number;
  /** 每页条数 */
  pageSize?: number;
}

/** 联系人列表响应 */
export interface ContactListResponse {
  /** 联系人列表 */
  list: Contact[];
  /** 总条数 */
  total: number;
  /** 当前页码 */
  page: number;
  /** 每页条数 */
  pageSize: number;
}
