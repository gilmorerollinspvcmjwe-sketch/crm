/**
 * 联系人模块类型定义
 * 联系人指客户公司的具体联系人（如张三、李四）
 * 区别于 Contact（沟通记录）
 */

// ============================================================
// 枚举类型
// ============================================================

/** 性别枚举 */
export type ContactPersonGender = '男' | '女' | '未知'

/** 职级枚举 */
export type ContactPersonJobLevel = '高管' | '中层' | '基层' | '其他'

/** 决策角色枚举 - 采购决策中的角色 */
export type ContactPersonDecisionRole = '决策者' | '影响者' | '使用者' | '把关者' | '其他'

/** 联系人来源枚举 */
export type ContactPersonSource = '客户导入' | '手动创建' | '名片扫描' | '活动收集' | '其他'

/** 学历枚举 */
export type ContactPersonEducation = '高中及以下' | '大专' | '本科' | '硕士' | '博士' | '其他'

// ============================================================
// 联系人基本信息
// ============================================================

export interface ContactPerson {
  /** 联系人 ID - 唯一标识 */
  id: string
  
  /** 姓名 */
  name: string
  
  /** 性别 */
  gender?: ContactPersonGender
  
  /** 职位 */
  position?: string
  
  /** 职级 */
  jobLevel?: ContactPersonJobLevel
  
  /** 决策角色 - 采购决策中的角色 */
  decisionRole?: ContactPersonDecisionRole
  
  /** 所属客户 ID */
  customerId: string
  
  /** 所属客户名称 */
  customerName?: string
  
  /** 多客户关联 - 兼职/多公司任职 */
  multiCustomers?: string[]
  
  /** 手机号码 */
  mobile?: string
  
  /** 办公电话 */
  officePhone?: string
  
  /** 邮箱 */
  email?: string
  
  /** 微信 */
  wechat?: string
  
  /** QQ */
  qq?: string
  
  /** 办公地址 */
  address?: string
  
  /** 生日 */
  birthday?: string
  
  /** 入职时间 */
  joinDate?: string
  
  /** 毕业院校 */
  school?: string
  
  /** 学历 */
  education?: ContactPersonEducation
  
  /** 专业 */
  major?: string
  
  /** 兴趣爱好 */
  hobbies?: string
  
  /** 备注 */
  remark?: string
  
  /** 联系人 Owner - 负责人 ID */
  ownerId: string
  
  /** 联系人 Owner 姓名 */
  ownerName?: string
  
  /** 创建人 */
  createdBy: string
  
  /** 创建时间 */
  createdAt: string
  
  /** 最后修改人 */
  updatedBy?: string
  
  /** 最后修改时间 */
  updatedAt?: string
  
  /** 是否主要联系人 */
  isPrimary?: boolean
  
  /** 联系人状态 */
  status?: '正常' | '离职' | '无效'
}

// ============================================================
// 查询参数
// ============================================================

export interface ContactPersonListParams {
  /** 姓名搜索 */
  name?: string
  
  /** 所属客户筛选 */
  customerId?: string
  
  /** 客户名称筛选 */
  customerName?: string
  
  /** 职位筛选 */
  position?: string
  
  /** 决策角色筛选 */
  decisionRole?: ContactPersonDecisionRole
  
  /** 来源筛选 */
  source?: ContactPersonSource
  
  /** 页码 */
  page?: number
  
  /** 每页条数 */
  pageSize?: number
  
  /** 排序字段 */
  sortBy?: string
  
  /** 排序方式 */
  sortOrder?: 'asc' | 'desc'
}

// ============================================================
// API 响应
// ============================================================

export interface ContactPersonListResponse {
  /** 联系人列表 */
  data: ContactPerson[]
  
  /** 总条数 */
  total: number
  
  /** 当前页码 */
  page: number
  
  /** 每页条数 */
  pageSize: number
  
  /** 总页数 */
  totalPages: number
}

export interface ContactPersonResponse {
  /** 联系人详情 */
  data: ContactPerson
  
  /** 消息 */
  message?: string
  
  /** 状态码 */
  code?: number
}
