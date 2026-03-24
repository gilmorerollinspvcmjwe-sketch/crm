/**
 * 权限树组件
 * 用于菜单权限和按钮权限的配置
 */
import React, { useState, useEffect } from 'react';
import { Tree, Checkbox, Card, Typography, Space, Tag } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { Permission, PermissionType } from '../../types/permission';

const { Title, Text } = Typography;

interface PermissionTreeProps {
  permissions: Permission[];
  checkedKeys: string[];
  onChange: (checkedKeys: string[]) => void;
  showType?: boolean;
}

/**
 * 权限树组件
 */
export const PermissionTree: React.FC<PermissionTreeProps> = ({
  permissions,
  checkedKeys,
  onChange,
  showType = true,
}) => {
  const [treeData, setTreeData] = useState<DataNode[]>([]);

  useEffect(() => {
    const convertToTreeData = (perms: Permission[]): DataNode[] => {
      return perms.map(perm => ({
        key: perm.id,
        title: (
          <Space>
            <Text>{perm.name}</Text>
            {showType && (
              <Tag color={perm.type === PermissionType.MENU ? 'blue' : 'green'}>
                {perm.type === PermissionType.MENU ? '菜单' : '按钮'}
              </Tag>
            )}
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

    setTreeData(convertToTreeData(permissions));
  }, [permissions, showType]);

  return (
    <Card title="权限配置" bordered={false}>
      <Tree
        checkable
        checkedKeys={checkedKeys}
        onCheck={(checked) => {
          onChange(checked as string[]);
        }}
        treeData={treeData}
        defaultExpandAll
        style={{ maxHeight: 600, overflow: 'auto' }}
      />
    </Card>
  );
};

export default PermissionTree;
