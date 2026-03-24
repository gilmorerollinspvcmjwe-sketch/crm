/**
 * 即将到期合同 Dashlet 组件
 */

import React from 'react';
import { Card, Table, Tag } from 'antd';
import { ContractItem } from '../../types/dashboard';

interface ContractDashletProps {
  data: ContractItem[];
}

export const ContractDashlet: React.FC<ContractDashletProps> = ({ data }) => {
  const getStatusTag = (status: string, days: number) => {
    if (days <= 7) {
      return <Tag color="red">即将到期</Tag>;
    }
    if (days <= 15) {
      return <Tag color="orange">注意</Tag>;
    }
    return <Tag color="blue">正常</Tag>;
  };

  const columns = [
    {
      title: '合同名称',
      dataIndex: 'contractName',
      key: 'contractName',
      ellipsis: true,
    },
    {
      title: '客户',
      dataIndex: 'customerName',
      key: 'customerName',
      ellipsis: true,
      width: 100,
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 90,
      render: (amount: number) => `¥${(amount / 10000).toFixed(0)}万`,
    },
    {
      title: '剩余天数',
      dataIndex: 'daysRemaining',
      key: 'daysRemaining',
      width: 70,
      render: (days: number, record: ContractItem) => (
        <div>
          <span style={{ color: days <= 7 ? '#f5222d' : '#666' }}>{days}天</span>
          {getStatusTag(record.status, days)}
        </div>
      ),
    },
  ];

  return (
    <Card
      title="即将到期合同"
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
