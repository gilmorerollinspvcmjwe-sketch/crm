/**
 * 待跟进客户 Dashlet 组件
 */

import React from 'react';
import { Card, Table, Tag } from 'antd';
import { TaskItem } from '../../types/dashboard';

interface TaskDashletProps {
  data: TaskItem[];
}

export const TaskDashlet: React.FC<TaskDashletProps> = ({ data }) => {
  const getPriorityTag = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Tag color="red">高</Tag>;
      case 'medium':
        return <Tag color="orange">中</Tag>;
      default:
        return <Tag color="blue">低</Tag>;
    }
  };

  const columns = [
    {
      title: '客户名称',
      dataIndex: 'customerName',
      key: 'customerName',
      ellipsis: true,
    },
    {
      title: '联系人',
      dataIndex: 'contactPerson',
      key: 'contactPerson',
      width: 80,
    },
    {
      title: '类型',
      dataIndex: 'followUpType',
      key: 'followUpType',
      width: 60,
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 60,
      render: (_: any, record: TaskItem) => getPriorityTag(record.priority),
    },
  ];

  return (
    <Card
      title="待跟进客户"
      bordered={false}
      size="small"
      style={{ height: '100%' }}
      bodyStyle={{ padding: '12px' }}
    >
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={false}
        size="small"
        scroll={{ y: 280 }}
      />
    </Card>
  );
};
