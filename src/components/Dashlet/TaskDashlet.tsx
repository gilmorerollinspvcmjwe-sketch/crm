/**
 * 待跟进客户 Dashlet 组件
 */
import React from 'react';
import { Card, Table, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { TaskItem } from '../../types/dashboard';

interface TaskDashletProps {
  data: TaskItem[];
}

export const TaskDashlet: React.FC<TaskDashletProps> = ({ data }) => {
  const { t } = useTranslation();

  const getPriorityTag = (priority: string) => {
    switch (priority) {
      case 'high': return <Tag color="red">{t('dashboard.task.high')}</Tag>;
      case 'medium': return <Tag color="orange">{t('dashboard.task.medium')}</Tag>;
      default: return <Tag color="blue">{t('dashboard.task.low')}</Tag>;
    }
  };

  const columns = [
    { title: t('dashboard.task.customerName'), dataIndex: 'customerName', key: 'customerName', ellipsis: true },
    { title: t('dashboard.task.contactPerson'), dataIndex: 'contactPerson', key: 'contactPerson', width: 80 },
    { title: t('dashboard.task.type'), dataIndex: 'followUpType', key: 'followUpType', width: 60 },
    { title: t('dashboard.task.priority'), dataIndex: 'priority', key: 'priority', width: 60, render: (_: any, record: TaskItem) => getPriorityTag(record.priority) },
  ];

  return (
    <Card title={t('dashboard.task.title')} bordered={false} size="small" style={{ height: '100%' }} bodyStyle={{ padding: '12px' }}>
      <Table columns={columns} dataSource={data} rowKey="id" pagination={false} size="small" scroll={{ y: 280 }} />
    </Card>
  );
};

export default TaskDashlet;