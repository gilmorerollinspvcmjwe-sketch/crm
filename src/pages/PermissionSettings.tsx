/**
 * 权限配置页面
 * 用于集中管理角色和权限配置
 */
import React, { useState } from 'react';
import { Card, Row, Col, List, Tag, Space, Button, Divider, Typography, Tree, Checkbox, Empty } from 'antd';
import { SettingOutlined, SaveOutlined } from '@ant-design/icons';
import type { DataNode } from 'antd/es/tree';
import { useTranslation } from 'react-i18next';
import { Permission, PermissionType, DataScope, Role as RoleType } from '../types/permission';

const { Title, Text } = Typography;

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

const PermissionSettings: React.FC = () => {
  const { t } = useTranslation();
  const [selectedRoleId, setSelectedRoleId] = useState<string>(mockRoles[0].id);
  const [checkedKeys, setCheckedKeys] = useState<string[]>(mockRoles[0].permissions);
  const [dataScope, setDataScope] = useState<DataScope>(mockRoles[0].dataScope);

  const selectedRole = mockRoles.find(r => r.id === selectedRoleId);

  const convertToTreeData = (perms: Permission[]): DataNode[] => {
    return perms.map(perm => ({
      key: perm.id,
      title: (
        <Space>
          <Text>{perm.name}</Text>
          <Tag color={perm.type === PermissionType.MENU ? 'blue' : 'green'}>
            {perm.type === PermissionType.MENU ? t('permission.permissionTree.menuType') : t('permission.permissionTree.buttonType')}
          </Tag>
          {perm.code && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              [{perm.code}]
            </Text>
          )}
        </Space>
      ),
      children: perm.children ? convertToTreeData(perm.children) : undefined,
      selectable: false,
    }));
  };

  const handleRoleSelect = (role: RoleType) => {
    setSelectedRoleId(role.id);
    setCheckedKeys(role.permissions);
    setDataScope(role.dataScope);
  };

  const handleSave = () => {
    // Mock 保存操作
    console.log('保存权限配置:', {
      roleId: selectedRoleId,
      permissions: checkedKeys,
      dataScope,
    });
  };

  const dataScopeOptions = [
    { label: t('permission.settings.allData'), value: DataScope.ALL, desc: t('permission.settings.allDataDesc') },
    { label: t('permission.settings.departmentData'), value: DataScope.DEPARTMENT, desc: t('permission.settings.departmentDataDesc') },
    { label: t('permission.settings.teamData'), value: DataScope.TEAM, desc: t('permission.settings.teamDataDesc') },
    { label: t('permission.settings.selfData'), value: DataScope.SELF, desc: t('permission.settings.selfDataDesc') },
  ];

  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh', padding: 16 }}>
      <Card title={`⚙️ ${t('permission.settings.title')}`}>
        <p style={{ color: '#999', marginBottom: 16 }}>
          {t('permission.settings.subtitle')}
        </p>

        <Row gutter={16}>
          {/* 左侧：角色列表 */}
          <Col span={6}>
            <Card title={t('permission.settings.roleList')} size="small">
              <List
                dataSource={mockRoles}
                renderItem={(role) => (
                  <List.Item
                    style={{
                      cursor: 'pointer',
                      background: selectedRoleId === role.id ? '#e6f7ff' : 'transparent',
                      padding: '8px 12px',
                      borderRadius: 4,
                      marginBottom: 4,
                    }}
                    onClick={() => handleRoleSelect(role)}
                  >
                    <List.Item.Meta
                      title={
                        <Space>
                          <span>{role.name}</span>
                          {role.isSystem && <Tag color="purple">{t('permission.roles.systemTag')}</Tag>}
                        </Space>
                      }
                      description={
                        <Space direction="vertical" size={0}>
                          <Text type="secondary" style={{ fontSize: 12 }}>{role.code}</Text>
                          <Tag color="blue">{role.dataScope}</Tag>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>

            <Divider orientation="left" orientationMargin="0">{t('permission.settings.dataPermission')}</Divider>

            <Card size="small">
              <Space direction="vertical" style={{ width: '100%' }}>
                {dataScopeOptions.map((option) => (
                  <div
                    key={option.value}
                    style={{
                      padding: '8px 12px',
                      background: dataScope === option.value ? '#e6f7ff' : 'transparent',
                      borderRadius: 4,
                      cursor: 'pointer',
                      border: dataScope === option.value ? '1px solid #1890ff' : '1px solid transparent',
                    }}
                    onClick={() => setDataScope(option.value)}
                  >
                    <div style={{ fontWeight: 500 }}>{option.label}</div>
                    <div style={{ fontSize: 12, color: '#999' }}>{option.desc}</div>
                  </div>
                ))}
              </Space>
            </Card>
          </Col>

          {/* 右侧：权限树 */}
          <Col span={18}>
            <Card
              title={
                <Space>
                  <span>{t('permission.settings.permissionConfig')}</span>
                  {selectedRole && (
                    <>
                      <Tag color="blue">{selectedRole.name}</Tag>
                      <Tag>{t('permission.settings.selectedPermissions', { count: checkedKeys.length })}</Tag>
                    </>
                  )}
                </Space>
              }
              extra={
                <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
                  {t('permission.settings.saveConfig')}
                </Button>
              }
            >
              {selectedRole ? (
                <>
                  <div style={{ marginBottom: 16 }}>
                    <Space>
                      <Button 
                        size="small" 
                        onClick={() => {
                          const allKeys = mockPermissions.flatMap(p => [p.id, ...(p.children?.map(c => c.id) || [])]);
                          setCheckedKeys(allKeys);
                        }}
                      >
                        {t('permission.settings.selectAll')}
                      </Button>
                      <Button 
                        size="small" 
                        onClick={() => {
                          const menuKeys = mockPermissions.map(p => p.id);
                          setCheckedKeys(menuKeys);
                        }}
                      >
                        {t('permission.settings.menuOnly')}
                      </Button>
                      <Button 
                        size="small" 
                        onClick={() => setCheckedKeys([])}
                      >
                        {t('permission.settings.clearAll')}
                      </Button>
                    </Space>
                  </div>
                  <Tree
                    checkable
                    checkedKeys={checkedKeys}
                    onCheck={(checked) => {
                      setCheckedKeys(checked as string[]);
                    }}
                    treeData={convertToTreeData(mockPermissions)}
                    defaultExpandAll
                    style={{ maxHeight: 600, overflow: 'auto' }}
                  />
                </>
              ) : (
                <Empty description={t('permission.settings.selectRoleHint')} />
              )}
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default PermissionSettings;