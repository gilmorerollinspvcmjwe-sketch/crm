/**
 * 用户角色分配组件
 * 用于为用户分配角色
 */
import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Modal, Transfer, Space, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import { User, Role } from '../../types/permission';

interface UserRoleAssignProps {
  users: User[];
  roles: Role[];
  onAssignRoles: (userId: string, roleIds: string[]) => Promise<void>;
}

/**
 * 用户角色分配组件
 */
export const UserRoleAssign: React.FC<UserRoleAssignProps> = ({
  users,
  roles,
  onAssignRoles,
}) => {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  /** 打开角色分配弹窗 */
  const handleOpenModal = (user: User) => {
    setSelectedUser(user);
    setTargetKeys(user.roleIds);
    setModalVisible(true);
  };

  /** 处理角色分配 */
  const handleAssign = async () => {
    if (!selectedUser) return;

    setLoading(true);
    try {
      await onAssignRoles(selectedUser.id, targetKeys);
      message.success(t('permission.userRoleAssign.assignSuccess'));
      setModalVisible(false);
    } catch (error) {
      message.error(t('permission.userRoleAssign.assignFailed'));
    } finally {
      setLoading(false);
    }
  };

  /** 转移数据 */
  const transferData = roles.map(role => ({
    key: role.id,
    title: role.name,
    description: role.description,
    disabled: role.isSystem,
  }));

  const columns: ColumnsType<User> = [
    {
      title: t('permission.users.columnUser'),
      dataIndex: 'username',
      key: 'username',
      width: 120,
    },
    {
      title: t('permission.users.realName', { defaultValue: '姓名' }),
      dataIndex: 'name',
      key: 'name',
      width: 100,
    },
    {
      title: t('permission.users.columnEmail'),
      dataIndex: 'email',
      key: 'email',
      width: 200,
    },
    {
      title: t('permission.users.columnDepartment'),
      dataIndex: 'department',
      key: 'department',
      width: 120,
    },
    {
      title: t('permission.users.position', { defaultValue: '职位' }),
      dataIndex: 'position',
      key: 'position',
      width: 120,
    },
    {
      title: t('permission.users.columnRoles'),
      key: 'roles',
      render: (_: any, record: User) => (
        <Space wrap>
          {record.roleIds.map(roleId => {
            const role = roles.find(r => r.id === roleId);
            return role ? (
              <Tag key={roleId} color="blue">
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
      width: 80,
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'default'}>
          {status === 'active' ? t('permission.users.statusActive') : t('permission.users.statusInactive')}
        </Tag>
      ),
    },
    {
      title: t('common.edit'),
      key: 'action',
      width: 120,
      render: (_: any, record: User) => (
        <Button type="link" onClick={() => handleOpenModal(record)}>
          {t('permission.userRoleAssign.assignRole')}
        </Button>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        pagination={{ pageSize: 10, showSizeChanger: true }}
      />

      <Modal
        title={`${t('permission.userRoleAssign.assignRole')} - ${selectedUser?.name}`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleAssign}
        confirmLoading={loading}
        width={700}
      >
        <div style={{ padding: '20px 0' }}>
          <Transfer
            dataSource={transferData}
            titles={[t('permission.userRoleAssign.availableRoles'), t('permission.userRoleAssign.selectedRoles')]}
            targetKeys={targetKeys}
            onChange={(newTargetKeys) => setTargetKeys(newTargetKeys as string[])}
            render={item => item.title}
            showSearch
            filterOption={(inputValue, option) =>
              option!.title.indexOf(inputValue) > -1 ||
              option!.description?.indexOf(inputValue) > -1
            }
            listStyle={{
              width: 250,
              height: 400,
            }}
          />
        </div>
      </Modal>
    </>
  );
};

export default UserRoleAssign;