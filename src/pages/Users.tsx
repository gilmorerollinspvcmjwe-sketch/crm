/**
 * 用户管理页面
 */
import React, { useState } from 'react';
import { Card, Table, Button, Space, Modal, Form, Input, Select, Tag, message, Popconfirm, Avatar } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { UserRoleAssign } from '../components/Permission/UserRoleAssign';
import { Role, User as UserType, DataScope } from '../types/permission';

interface User {
  id: string;
  username: string;
  realName: string;
  name: string; // 兼容 permission.User
  email: string;
  phone: string;
  department: string;
  position: string; // 兼容 permission.User
  roleIds: string[];
  roleNames: string[];
  status: 'active' | 'inactive';
  avatar?: string;
  createdAt: string; // 兼容 permission.User
}

// Mock 角色数据
const mockRoles: Role[] = [
  {
    id: '1',
    name: '超级管理员',
    code: 'admin',
    description: '系统最高权限角色',
    permissions: [],
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
    permissions: [],
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
    permissions: [],
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
    permissions: [],
    dataScope: DataScope.SELF,
    isSystem: false,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
];

// Mock 用户数据
const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    realName: '管理员',
    name: '管理员',
    email: 'admin@crm.com',
    phone: '13800138000',
    department: '总经办',
    position: '管理员',
    roleIds: ['1'],
    roleNames: ['超级管理员'],
    status: 'active',
    createdAt: '2026-01-01',
  },
  {
    id: '2',
    username: 'zhangsan',
    realName: '张三',
    name: '张三',
    email: 'zhangsan@crm.com',
    phone: '13800138001',
    department: '销售部',
    position: '销售总监',
    roleIds: ['2'],
    roleNames: ['销售总监'],
    status: 'active',
    createdAt: '2026-01-15',
  },
  {
    id: '3',
    username: 'lisi',
    realName: '李四',
    name: '李四',
    email: 'lisi@crm.com',
    phone: '13800138002',
    department: '销售部',
    position: '销售经理',
    roleIds: ['3'],
    roleNames: ['销售经理'],
    status: 'active',
    createdAt: '2026-02-01',
  },
  {
    id: '4',
    username: 'wangwu',
    realName: '王五',
    name: '王五',
    email: 'wangwu@crm.com',
    phone: '13800138003',
    department: '销售部',
    position: '销售代表',
    roleIds: ['4'],
    roleNames: ['销售代表'],
    status: 'active',
    createdAt: '2026-02-15',
  },
  {
    id: '5',
    username: 'zhaoliu',
    realName: '赵六',
    name: '赵六',
    email: 'zhaoliu@crm.com',
    phone: '13800138004',
    department: '销售部',
    position: '销售代表',
    roleIds: ['4'],
    roleNames: ['销售代表'],
    status: 'active',
    createdAt: '2026-03-01',
  },
  {
    id: '6',
    username: 'qianqi',
    realName: '钱七',
    name: '钱七',
    email: 'qianqi@crm.com',
    phone: '13800138005',
    department: '市场部',
    position: '销售代表',
    roleIds: ['4'],
    roleNames: ['销售代表'],
    status: 'inactive',
    createdAt: '2026-03-01',
  },
];

const departments = ['总经办', '销售部', '市场部', '客服部', '财务部', '技术部'];

const Users: React.FC = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedUserForAssign, setSelectedUserForAssign] = useState<User | null>(null);
  const [form] = Form.useForm();

  const columns = [
    {
      title: t('permission.users.columnUser'),
      dataIndex: 'realName',
      key: 'realName',
      render: (name: string, record: User) => (
        <Space>
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
          <div>
            <div style={{ fontWeight: 500 }}>{name}</div>
            <div style={{ fontSize: 12, color: '#999' }}>{record.username}</div>
          </div>
        </Space>
      ),
    },
    {
      title: t('permission.users.columnEmail'),
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: t('permission.users.columnPhone'),
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: t('permission.users.columnDepartment'),
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: t('permission.users.columnRoles'),
      key: 'roles',
      render: (_: any, record: User) => (
        <Space wrap>
          {record.roleIds.map((roleId, index) => {
            const role = mockRoles.find(r => r.id === roleId);
            const colors = ['blue', 'green', 'cyan', 'purple', 'orange'];
            return role ? (
              <Tag key={roleId} color={colors[index % colors.length]}>
                {role.name}
              </Tag>
            ) : null;
          })}
        </Space>
      ),
    },
    {
      title: t('permission.users.columnStatus'),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'default'}>
          {status === 'active' ? t('permission.users.statusActive') : t('permission.users.statusInactive')}
        </Tag>
      ),
    },
    {
      title: t('common.edit'),
      key: 'action',
      render: (_: any, record: User) => (
        <Space>
          <Button
            type="link"
            icon={<TeamOutlined />}
            onClick={() => handleAssignRole(record)}
          >
            {t('permission.users.assignRole')}
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            {t('permission.users.edit')}
          </Button>
          <Popconfirm
            title={t('permission.users.deleteConfirm')}
            onConfirm={() => handleDelete(record.id)}
            okText={t('common.confirm')}
            cancelText={t('common.cancel')}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              {t('permission.users.delete')}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleAssignRole = (user: User) => {
    setSelectedUserForAssign(user);
    setIsAssignModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue({
      username: user.username,
      realName: user.realName,
      email: user.email,
      phone: user.phone,
      department: user.department,
      status: user.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setUsers(users.filter((u) => u.id !== id));
    message.success(t('permission.users.deleteSuccess'));
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setIsAssignModalOpen(false);
    setEditingUser(null);
    setSelectedUserForAssign(null);
    form.resetFields();
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingUser) {
        // 编辑现有用户
        setUsers(
          users.map((u) =>
            u.id === editingUser.id
              ? {
                  ...u,
                  realName: values.realName,
                  email: values.email,
                  phone: values.phone,
                  department: values.department,
                  status: values.status,
                }
              : u
          )
        );
        message.success(t('permission.users.updateSuccess'));
      } else {
        // 新建用户
        const newUser: User = {
          id: Date.now().toString(),
          username: values.username,
          realName: values.realName,
          name: values.realName,
          email: values.email,
          phone: values.phone,
          department: values.department,
          position: values.position || '员工',
          roleIds: [],
          roleNames: [],
          status: values.status,
          createdAt: new Date().toISOString().split('T')[0],
        };
        setUsers([...users, newUser]);
        message.success(t('permission.users.createSuccess'));
      }
      handleModalClose();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleAssignRoles = async (userId: string, roleIds: string[]) => {
    // Mock 分配角色
    const selectedRoles = mockRoles.filter(r => roleIds.includes(r.id));
    setUsers(
      users.map((u) =>
        u.id === userId
          ? {
              ...u,
              roleIds,
              roleNames: selectedRoles.map(r => r.name),
            }
          : u
      )
    );
    return Promise.resolve();
  };

  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh', padding: 16 }}>
      <Card
        title={`👥 ${t('permission.users.title')}`}
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => { 
              setEditingUser(null); 
              setIsModalOpen(true); 
            }}
          >
            {t('permission.users.newUser')}
          </Button>
        }
      >
        <p style={{ color: '#999', marginBottom: 16 }}>
          {t('permission.users.subtitle')}
        </p>
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* 用户编辑 Modal */}
      <Modal
        title={editingUser ? t('permission.users.editUserTitle') : t('permission.users.newUserTitle')}
        open={isModalOpen}
        onCancel={handleModalClose}
        onOk={handleSave}
        width={600}
        okText={t('common.save')}
        cancelText={t('common.cancel')}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label={t('permission.users.columnUser')}
            rules={[{ required: true, message: t('permission.users.columnUser') }]}
          >
            <Input placeholder={t('permission.users.columnUser')} disabled={!!editingUser} />
          </Form.Item>
          <Form.Item
            name="realName"
            label={t('permission.users.realName', { defaultValue: '真实姓名' })}
            rules={[{ required: true, message: t('permission.users.realName', { defaultValue: '请输入真实姓名' }) }]}
          >
            <Input placeholder={t('permission.users.realName', { defaultValue: '请输入真实姓名' })} />
          </Form.Item>
          <Form.Item
            name="email"
            label={t('permission.users.columnEmail')}
            rules={[
              { required: true, message: t('permission.users.columnEmail') },
              { type: 'email', message: t('permission.users.validEmail', { defaultValue: '请输入有效的邮箱地址' }) },
            ]}
          >
            <Input placeholder={t('permission.users.columnEmail')} />
          </Form.Item>
          <Form.Item
            name="phone"
            label={t('permission.users.columnPhone')}
            rules={[{ required: true, message: t('permission.users.columnPhone') }]}
          >
            <Input placeholder={t('permission.users.columnPhone')} />
          </Form.Item>
          <Form.Item
            name="department"
            label={t('permission.users.columnDepartment')}
            rules={[{ required: true, message: t('permission.users.columnDepartment') }]}
          >
            <Select placeholder={t('permission.users.columnDepartment')}>
              {departments.map((dept) => (
                <Select.Option key={dept} value={dept}>
                  {dept}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label={t('permission.users.columnStatus')}
            initialValue="active"
          >
            <Select>
              <Select.Option value="active">{t('permission.users.statusActive')}</Select.Option>
              <Select.Option value="inactive">{t('permission.users.statusInactive')}</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 角色分配 Modal */}
      <Modal
        title={t('permission.users.assignRoleTitle', { name: selectedUserForAssign?.realName })}
        open={isAssignModalOpen}
        onCancel={handleModalClose}
        footer={null}
        width={700}
      >
        <UserRoleAssign
          users={selectedUserForAssign ? [selectedUserForAssign] : []}
          roles={mockRoles}
          onAssignRoles={handleAssignRoles}
        />
      </Modal>
    </div>
  );
};

export default Users;