/**
 * 自定义对象 Mock 数据
 */

import type {
  CustomObjectDefinition,
  CustomField,
  CustomObjectRecord,
} from '@/types/customObject'

// ============================================================
// 自定义对象定义
// ============================================================

export const mockCustomObjects: CustomObjectDefinition[] = [
  {
    id: 'co-project',
    name: 'project',
    label: '项目',
    pluralLabel: '项目列表',
    description: '企业内部项目管理系统',
    icon: '📁',
    iconColor: 'bg-blue-500',
    status: 'active',
    isSystem: false,
    sortOrder: 1,
    showInNavigation: true,
    createdBy: 'admin',
    createdAt: '2024-01-15T08:00:00Z',
    updatedBy: 'admin',
    updatedAt: '2024-03-20T10:00:00Z',
    enabled: true,
    fields: [
      {
        id: 'f-project-001',
        name: 'name',
        label: '项目名称',
        type: 'text',
        required: true,
        unique: true,
        listVisible: true,
        detailVisible: true,
        searchable: true,
        sortable: true,
        bulkEditable: false,
        sortOrder: 1,
        enabled: true,
      },
      {
        id: 'f-project-002',
        name: 'code',
        label: '项目编号',
        type: 'text',
        required: true,
        unique: true,
        listVisible: true,
        detailVisible: true,
        searchable: true,
        sortable: true,
        bulkEditable: false,
        sortOrder: 2,
        enabled: true,
      },
      {
        id: 'f-project-003',
        name: 'status',
        label: '项目状态',
        type: 'picklist',
        required: true,
        unique: false,
        picklistOptions: ['立项中', '执行中', '已暂停', '已完成', '已取消'],
        listVisible: true,
        detailVisible: true,
        searchable: false,
        sortable: true,
        bulkEditable: true,
        sortOrder: 3,
        enabled: true,
      },
    ] as CustomField[],
  },
]

// Mock 记录
export const mockCustomObjectRecords: CustomObjectRecord[] = [
  {
    id: 'rec-001',
    objectName: 'project',
    data: {
      name: 'CRM 系统升级项目',
      code: 'PRJ-2024-001',
      status: '执行中',
    },
    createdBy: 'admin',
    createdAt: '2024-01-15T08:00:00Z',
    updatedBy: 'admin',
    updatedAt: '2024-03-20T10:00:00Z',
  },
]
