/**
 * 角色管理页面
 */
import React, { useState } from 'react';
import { Card, Table, Button, Space, Modal, Form, Input, Tag, message, Popconfirm, Tree, Checkbox, Divider } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SettingOutlined, CopyOutlined } from '@ant-design/icons';
import type { DataNode } from 'antd/es/tree';
import { useTranslation } from 'react-i18next';
import { RoleForm } from '../components/Permission/RoleForm';
import { PermissionTree } from '../components/Permission/PermissionTree';
import { Permission, PermissionType, DataScope, Role as RoleType } from '../types/permission';

// Mock 权限树数据
const mockPermissions: Permission[] = [
  {
    id: 'customer',
    name: '客户管理',
    code: 'customer',
    type: PermissionType.MENU,
    sort: 1,
    children: [
      { id: 'customer:view', name: '查看客户', code: 'customer:view', type: PermissionType.BUTTON, sort: 1 },
      { id: 'customer:create', name: '新建客户', code: 'customer:create', type: PermissionType.BUTTON, sort: 2 },
      { id: 'customer:edit', name: '编辑客户', code: 'customer:edit', type: PermissionType.BUTTON, sort: 3 },
      { id: 'customer:delete', name: '删除客户', code: 'customer:delete', type: PermissionType.BUTTON, sort: 4 },
      { id: 'customer:export', name: '导出客户', code: 'customer:export', type: PermissionType.BUTTON, sort: 5 },
    ],
  },
  {
    id: 'contact',
    name: '联系人管理',
    code: 'contact',
    type: PermissionType.MENU,
    sort: 2,
    children: [
      { id: 'contact:view', name: '查看联系人', code: 'contact:view', type: PermissionType.BUTTON, sort: 1 },
      { id: 'contact:create', name: '新建联系人', code: 'contact:create', type: PermissionType.BUTTON, sort: 2 },
      { id: 'contact:edit', name: '编辑联系人', code: 'contact:edit', type: PermissionType.BUTTON, sort: 3 },
      { id: 'contact:delete', name: '删除联系人', code: 'contact:delete', type: PermissionType.BUTTON, sort: 4 },
    ],
  },
  {
    id: 'lead',
    name: '线索管理',
    code: 'lead',
    type: PermissionType.MENU,
    sort: 3,
    children: [
      { id: 'lead:view', name: '查看线索', code: 'lead:view', type: PermissionType.BUTTON, sort: 1 },
      { id: 'lead:create', name: '新建线索', code: 'lead:create', type: PermissionType.BUTTON, sort: 2 },
      { id: 'lead:edit', name: '编辑线索', code: 'lead:edit', type: PermissionType.BUTTON, sort: 3 },
      { id: 'lead:delete', name: '删除线索', code: 'lead:delete', type: PermissionType.BUTTON, sort: 4 },
      { id: 'lead:convert', name: '转化线索', code: 'lead:convert', type: PermissionType.BUTTON, sort: 5 },
    ],
  },
  {
    id: 'opportunity',
    name: '商机管理',
    code: 'opportunity',
    type: PermissionType.MENU,
    sort: 4,
    children: [
      { id: 'opportunity:view', name: '查看商机', code: 'opportunity:view', type: PermissionType.BUTTON, sort: 1 },
      { id: 'opportunity:create', name: '新建商机', code: 'opportunity:create', type: PermissionType.BUTTON, sort: 2 },
      { id: 'opportunity:edit', name: '编辑商机', code: 'opportunity:edit', type: PermissionType.BUTTON, sort: 3 },
      { id: 'opportunity:delete', name: '删除商机', code: 'opportunity:delete', type: PermissionType.BUTTON, sort: 4 },
      { id: 'opportunity:win', name: '赢单', code: 'opportunity:win', type: PermissionType.BUTTON, sort: 5 },
      { id: 'opportunity:lose', name: '输单', code: 'opportunity:lose', type: PermissionType.BUTTON, sort: 6 },
    ],
  },
  {
    id: 'contract',
    name: '合同管理',
    code: 'contract',
    type: PermissionType.MENU,
    sort: 5,
    children: [
      { id: 'contract:view', name: '查看合同', code: 'contract:view', type: PermissionType.BUTTON, sort: 1 },
      { id: 'contract:create', name: '新建合同', code: 'contract:create', type: PermissionType.BUTTON, sort: 2 },
      { id: 'contract:edit', name: '编辑合同', code: 'contract:edit', type: PermissionType.BUTTON, sort: 3 },
      { id: 'contract:delete', name: '删除合同', code: 'contract:delete', type: PermissionType.BUTTON, sort: 4 },
    ],
  },
  {
    id: 'payment',
    name: '回款管理',
    code: 'payment',
    type: PermissionType.MENU,
    sort: 6,
    children: [
      { id: 'payment:view', name: '查看回款', code: 'payment:view', type: PermissionType.BUTTON, sort: 1 },
      { id: 'payment:create', name: '新建回款', code: 'payment:create', type: PermissionType.BUTTON, sort: 2 },
      { id: 'payment:edit', name: '编辑回款', code: 'payment:edit', type: PermissionType.BUTTON, sort: 3 },
    ],
  },
  {
    id: 'report',
    name: '报表中心',
    code: 'report',
    type: PermissionType.MENU,
    sort: 7,
    children: [
      { id: 'report:view', name: '查看报表', code: 'report:view', type: PermissionType.BUTTON, sort: 1 },
      { id: 'report:export', name: '导出报表', code: 'report:export', type: PermissionType.BUTTON, sort: 2 },
    ],
  },
  {
    id: 'system',
    name: '系统设置',
    code: 'system',
    type: PermissionType.MENU,
    sort: 8,
    children: [
      { id: 'system:user', name: '用户管理', code: 'system:user', type: PermissionType.BUTTON, sort: 1 },
      { id: 'system:role', name: '角色管理', code: 'system:role', type: PermissionType.BUTTON, sort: 2 },
      { id: 'system:config', name: '系统配置', code: 'system:config', type: PermissionType.BUTTON, sort: 3 },
    ],
  },
];

// Mock 角色数据
const mockRoles: RoleType[] = [
  {
    id: '1',
    name: '超级管理员',
    code: 'admin',
    description: '系统最高权限角色',
    permissions: mockPermissions.flatMap(p => [p.id, ...(p.children?.map(c => c.id) || [])]),
    dataScope: DataScope.ALL,
    isSystem: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: '2',
    name: '销售总监',
    code: 'sales_director',
    description: '销售团队管理者',
    permissions: ['customer', 'contact', 'lead', 'opportunity', 'contract', 'payment', 'report'],
    dataScope: DataScope.DEPARTMENT,
    isSystem: false,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: '3',
    name: '销售经理',
    code: 'sales_manager',
    description: '销售团队负责人',
    permissions: ['customer', 'contact', 'lead', 'opportunity', 'contract', 'payment'],
    dataScope: DataScope.TEAM,
    isSystem: false,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: '4',
    name: '销售代表',
    code: 'sales_rep',
    description: '一线销售人员',
    permissions: ['customer:view', 'customer:create', 'contact:view', 'contact:create', 'lead:view', 'lead:create', 'opportunity:view', 'opportunity:create'],
    dataScope: DataScope.SELF,
    isSystem: false,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
];

interface RoleFormValues {
  name: string;
  code: string;
  description?: string;
  dataScope: DataScope;
}

const Roles: React.FC = () => {
  const { t } = useTranslation();
  const [roles, setRoles] = useState<RoleType[]>(mockRoles);
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleType | null>(null);
  const [checkedPermissionKeys, setCheckedPermissionKeys] = useState<string[]>([]);

  const columns = [
    {
      title: t('permission.roles.columnName'),
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: RoleType) => (
        <Space>
          <span style={{ fontWeight: 500 }}>{name}</span>
          {record.isSystem && <Tag color="purple">{t('permission.roles.systemTag')}</Tag>}
        </Space>
      ),
    },
    {
      title: t('permission.roles.columnCode'),
      dataIndex: 'code',
      key: 'code',
      render: (code: string) => <code>{code}</code>,
    },
    {
      title: t('permission.roles.columnDescription'),
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: t('permission.roles.columnDataScope'),
      dataIndex: 'dataScope',
      key: 'dataScope',
      render: (scope: DataScope) => {
        const colorMap: Record<DataScope, string> = {
          [DataScope.ALL]: 'purple',
          [DataScope.DEPARTMENT]: 'blue',
          [DataScope.TEAM]: 'green',
          [DataScope.SELF]: 'default',
        };
        return <Tag color={colorMap[scope]}>{scope}</Tag>;
      },
    },
    {
      title: t('common.edit'),
      key: 'action',
      render: (_: any, record: RoleType) => (
        <Space>
          <Button
            type="link"
            icon={<SettingOutlined />}
            onClick={() => handleConfigPermissions(record)}
          >
            {t('permission.roles.configPermission')}
          </Button>
          {!record.isSystem && (
            <>
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
              >
                {t('permission.roles.edit')}
              </Button>
              <Button
                type="link"
                icon={<CopyOutlined />}
                onClick={() => handleCopy(record)}
              >
                {t('permission.roles.copy')}
              </Button>
              <Popconfirm
                title={t('permission.roles.deleteConfirm')}
                onConfirm={() => handleDelete(record.id)}
                okText={t('common.confirm')}
                cancelText={t('common.cancel')}
              >
                <Button type="link" danger icon={<DeleteOutlined />}>
                  {t('permission.roles.delete')}
                </Button>
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  const handleConfigPermissions = (role: RoleType) => {
    setEditingRole(role);
    setCheckedPermissionKeys(role.permissions);
    setPermissionModalVisible(true);
  };

  const handleEdit = (role: RoleType) => {
    setEditingRole(role);
    setRoleModalVisible(true);
  };

  const handleCopy = (role: RoleType) => {
    setEditingRole(null);
    setRoleModalVisible(true);
    message.info(t('permission.roles.copiedInfo', { name: role.name }));
  };

  const handleDelete = (id: string) => {
    setRoles(roles.filter((r) => r.id !== id));
    message.success(t('permission.roles.deleteSuccess'));
  };

  const handleRoleSubmit = async (values: RoleFormValues) => {
    if (editingRole) {
      // 编辑现有角色
      setRoles(
        roles.map((r) =>
          r.id === editingRole.id
            ? { ...r, ...values, updatedAt: new Date().toISOString() }
            : r
        )
      );
      message.success(t('permission.roles.updateSuccess'));
    } else {
      // 新建角色
      const newRole: RoleType = {
        id: `ROLE${Date.now()}`,
        ...values,
        permissions: editingRole ? [...editingRole.permissions] : [],
        isSystem: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setRoles([...roles, newRole]);
      message.success(t('permission.roles.createSuccess'));
    }
    setRoleModalVisible(false);
    setEditingRole(null);
  };

  const handlePermissionSubmit = async () => {
    if (editingRole) {
      setRoles(
        roles.map((r) =>
          r.id === editingRole.id
            ? { ...r, permissions: checkedPermissionKeys, updatedAt: new Date().toISOString() }
            : r
        )
      );
      message.success(t('permission.roles.permissionSaved'));
    }
    setPermissionModalVisible(false);
    setEditingRole(null);
  };

  const handleModalClose = () => {
    setRoleModalVisible(false);
    setPermissionModalVisible(false);
    setEditingRole(null);
    setCheckedPermissionKeys([]);
  };

  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh', padding: 16 }}>
      <Card
        title={`🔐 ${t('permission.roles.title')}`}
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => { 
              setEditingRole(null); 
              setRoleModalVisible(true); 
            }}
          >
            {t('permission.roles.newRole')}
          </Button>
        }
      >
        <p style={{ color: '#999', marginBottom: 16 }}>
          {t('permission.roles.subtitle')}
        </p>
        <Table
          columns={columns}
          dataSource={roles}
          rowKey="id"
          pagination={false}
        />
      </Card>

      {/* 角色表单 Modal */}
      <Modal
        title={editingRole ? t('permission.roles.editRoleTitle', { name: editingRole.name }) : t('permission.roles.newRoleTitle')}
        open={roleModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={600}
      >
        <RoleForm
          initialValues={editingRole || undefined}
          onSubmit={handleRoleSubmit}
          onCancel={handleModalClose}
          isEdit={!!editingRole}
        />
      </Modal>

      {/* 权限配置 Modal */}
      <Modal
        title={t('permission.roles.configPermissionTitle', { name: editingRole?.name })}
        open={permissionModalVisible}
        onCancel={handleModalClose}
        onOk={handlePermissionSubmit}
        width={800}
        okText={t('common.save')}
        cancelText={t('common.cancel')}
      >
        <div style={{ marginBottom: 16 }}>
          <Tag color="blue">{editingRole?.dataScope}</Tag>
          <span style={{ marginLeft: 8, color: '#666' }}>
            {t('permission.roles.currentDataScope')}
          </span>
        </div>
        <PermissionTree
          permissions={mockPermissions}
          checkedKeys={checkedPermissionKeys}
          onChange={setCheckedPermissionKeys}
        />
      </Modal>
    </div>
  );
};

export default Roles;