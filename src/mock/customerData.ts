/**
 * 客户 Mock 数据
 */

export interface Customer {
  id: string
  name: string
  contactName?: string
  phone?: string
  email?: string
  industry?: string
  status: 'active' | 'inactive'
  owner?: string
  createdAt: string
  updatedAt: string
}

export const mockCustomers: Customer[] = [
  {
    id: 'cust-001',
    name: '北京科技有限公司',
    contactName: '张经理',
    phone: '010-88888888',
    email: 'contact@beijingtech.com',
    industry: '互联网',
    status: 'active',
    owner: 'user-001',
    createdAt: '2024-01-15',
    updatedAt: '2024-03-20',
  },
  {
    id: 'cust-002',
    name: '上海贸易集团有限公司',
    contactName: '李总监',
    phone: '021-66666666',
    email: 'info@shanghaitrading.com',
    industry: '贸易',
    status: 'active',
    owner: 'user-002',
    createdAt: '2024-02-01',
    updatedAt: '2024-03-18',
  },
  {
    id: 'cust-003',
    name: '广州制造有限公司',
    contactName: '王厂长',
    phone: '020-88881234',
    email: 'wang@guangzhou-mfg.cn',
    industry: '制造业',
    status: 'active',
    owner: 'user-001',
    createdAt: '2024-01-20',
    updatedAt: '2024-03-15',
  },
  {
    id: 'cust-004',
    name: '深圳互联网科技',
    contactName: '刘总',
    phone: '0755-88899999',
    email: 'li@szinternet.com',
    industry: '互联网',
    status: 'active',
    owner: 'user-003',
    createdAt: '2024-02-10',
    updatedAt: '2024-03-22',
  },
  {
    id: 'cust-005',
    name: '杭州电子商务公司',
    contactName: '陈经理',
    phone: '0571-88876543',
    email: 'chen@hz-ecommerce.com',
    industry: '电商',
    status: 'inactive',
    owner: 'user-002',
    createdAt: '2023-12-01',
    updatedAt: '2024-02-28',
  },
]

export function getCustomerById(id: string): Customer | undefined {
  return mockCustomers.find((c) => c.id === id)
}

export function getCustomerList(): Customer[] {
  return mockCustomers
}

export function getActiveCustomers(): Customer[] {
  return mockCustomers.filter((c) => c.status === 'active')
}
