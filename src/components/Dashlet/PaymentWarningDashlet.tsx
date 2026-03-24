/**
 * 回款预警 Dashlet 组件
 */

import React from 'react';
import { Card, Table, Tag, Progress, Alert } from 'antd';
import { WarningOutlined, ClockCircleOutlined } from '@ant-design/icons';

interface PaymentWarning {
  id: string;
  customerName: string;
  amount: number;
  dueDate: string;
  daysUntilDue: number;
  status: 'upcoming' | 'overdue';
  contractNo: string;
}

interface PaymentWarningDashletProps {
  data: {
    upcoming: PaymentWarning[];
    overdue: PaymentWarning[];
  };
}

const formatAmount = (amount: number): string => {
  if (amount >= 10000) {
    return `¥${(amount / 10000).toFixed(1)}万`;
  }
  return `¥${amount}`;
};

export const PaymentWarningDashlet: React.FC<PaymentWarningDashletProps> = ({ data }) => {
  const columns = [
    {
      title: '客户',
      dataIndex: 'customerName',
      key: 'customerName',
      ellipsis: true,
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <span style={{ fontWeight: 500, color: '#f5222d' }}>
          {formatAmount(amount)}
        </span>
      ),
    },
    {
      title: '到期日',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date: string, record: PaymentWarning) => (
        <span>
          {date}
          {record.daysUntilDue <= 3 && (
            <Tag color="red" style={{ marginLeft: 4 }}>即将到期</Tag>
          )}
        </span>
      ),
    },
  ];

  const overdueColumns = [
    ...columns,
    {
      title: '逾期天数',
      dataIndex: 'daysUntilDue',
      key: 'daysUntilDue',
      render: (days: number) => (
        <Tag color="red" style={{ fontWeight: 500 }}>
          逾期 {Math.abs(days)} 天
        </Tag>
      ),
    },
  ];

  const totalUpcoming = data.upcoming.reduce((sum, item) => sum + item.amount, 0);
  const totalOverdue = data.overdue.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Card
      title="⚠️ 回款预警"
      bordered={false}
      size="small"
      style={{ height: '100%' }}
    >
      {data.overdue.length > 0 && (
        <Alert
          message={`${data.overdue.length} 笔逾期回款，共计 ${formatAmount(totalOverdue)}`}
          type="error"
          showIcon
          icon={<WarningOutlined />}
          style={{ marginBottom: 16 }}
        />
      )}

      {data.upcoming.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h4 style={{ margin: 0, fontSize: 14 }}>
              <ClockCircleOutlined style={{ marginRight: 4, color: '#faad14' }} />
              即将到期（7 天内）
            </h4>
            <span style={{ fontSize: 12, color: '#999' }}>
              共 {data.upcoming.length} 笔，{formatAmount(totalUpcoming)}
            </span>
          </div>
          <Table
            dataSource={data.upcoming.slice(0, 5)}
            columns={columns}
            rowKey="id"
            pagination={false}
            size="small"
            scroll={{ y: 200 }}
          />
        </div>
      )}

      {data.overdue.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h4 style={{ margin: 0, fontSize: 14, color: '#f5222d' }}>
              <WarningOutlined style={{ marginRight: 4 }} />
              逾期回款
            </h4>
            <span style={{ fontSize: 12, color: '#999' }}>
              共 {data.overdue.length} 笔，{formatAmount(totalOverdue)}
            </span>
          </div>
          <Table
            dataSource={data.overdue.slice(0, 5)}
            columns={overdueColumns}
            rowKey="id"
            pagination={false}
            size="small"
            scroll={{ y: 200 }}
          />
        </div>
      )}

      {data.upcoming.length === 0 && data.overdue.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
          <div style={{ fontSize: 48, marginBottom: 16, color: '#52c41a' }}>✓</div>
          <div>暂无回款预警</div>
        </div>
      )}
    </Card>
  );
};
