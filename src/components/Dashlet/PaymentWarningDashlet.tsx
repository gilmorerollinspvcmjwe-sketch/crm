/**
 * 回款预警 Dashlet 组件
 */
import React from 'react';
import { Card, Table, Tag, Alert } from 'antd';
import { WarningOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

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
  data: { upcoming: PaymentWarning[]; overdue: PaymentWarning[] };
}

const formatAmount = (amount: number): string => {
  if (amount >= 10000) return `¥${(amount / 10000).toFixed(1)}万`;
  return `¥${amount}`;
};

export const PaymentWarningDashlet: React.FC<PaymentWarningDashletProps> = ({ data }) => {
  const { t } = useTranslation();

  const columns = [
    { title: t('dashboard.payment.customer'), dataIndex: 'customerName', key: 'customerName', ellipsis: true },
    { title: t('dashboard.payment.amount'), dataIndex: 'amount', key: 'amount', render: (amount: number) => <span style={{ fontWeight: 500, color: '#f5222d' }}>{formatAmount(amount)}</span> },
    { title: t('dashboard.payment.dueDate'), dataIndex: 'dueDate', key: 'dueDate', render: (date: string, record: PaymentWarning) => (
      <span>
        {date}
        {record.daysUntilDue <= 3 && <Tag color="red" style={{ marginLeft: 4 }}>{t('dashboard.payment.expiringSoon')}</Tag>}
      </span>
    )},
  ];

  const overdueColumns = [...columns, { title: t('dashboard.payment.overdueDays'), dataIndex: 'daysUntilDue', key: 'daysUntilDue', render: (days: number) => <Tag color="red" style={{ fontWeight: 500 }}>{t('dashboard.payment.overdue')} {Math.abs(days)} {t('dashboard.payment.days')}</Tag> }];

  const totalUpcoming = data.upcoming.reduce((sum, item) => sum + item.amount, 0);
  const totalOverdue = data.overdue.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Card title={`⚠️ ${t('dashboard.payment.title')}`} bordered={false} size="small" style={{ height: '100%' }}>
      {data.overdue.length > 0 && (
        <Alert message={`${data.overdue.length} ${t('dashboard.payment.overduePayments')}, ${t('dashboard.payment.total')} ${formatAmount(totalOverdue)}`} type="error" showIcon icon={<WarningOutlined />} style={{ marginBottom: 16 }} />
      )}
      {data.upcoming.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h4 style={{ margin: 0, fontSize: 14 }}><ClockCircleOutlined style={{ marginRight: 4, color: '#faad14' }} />{t('dashboard.payment.comingDue')}</h4>
            <span style={{ fontSize: 12, color: '#999' }}>{t('dashboard.payment.total')} {data.upcoming.length} {t('dashboard.payment.payments')}, {formatAmount(totalUpcoming)}</span>
          </div>
          <Table dataSource={data.upcoming.slice(0, 5)} columns={columns} rowKey="id" pagination={false} size="small" scroll={{ y: 200 }} />
        </div>
      )}
      {data.overdue.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h4 style={{ margin: 0, fontSize: 14, color: '#f5222d' }}><WarningOutlined style={{ marginRight: 4 }} />{t('dashboard.payment.overduePayments')}</h4>
            <span style={{ fontSize: 12, color: '#999' }}>{t('dashboard.payment.total')} {data.overdue.length} {t('dashboard.payment.payments')}, {formatAmount(totalOverdue)}</span>
          </div>
          <Table dataSource={data.overdue.slice(0, 5)} columns={overdueColumns} rowKey="id" pagination={false} size="small" scroll={{ y: 200 }} />
        </div>
      )}
      {data.upcoming.length === 0 && data.overdue.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
          <div style={{ fontSize: 48, marginBottom: 16, color: '#52c41a' }}>✓</div>
          <div>{t('dashboard.payment.noWarnings')}</div>
        </div>
      )}
    </Card>
  );
};

export default PaymentWarningDashlet;