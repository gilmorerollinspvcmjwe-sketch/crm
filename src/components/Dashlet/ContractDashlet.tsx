/**
 * 即将到期合同 Dashlet 组件
 */
import React from 'react';
import { Card, Table, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { ContractItem } from '../../types/dashboard';

interface ContractDashletProps {
  data: ContractItem[];
}

export const ContractDashlet: React.FC<ContractDashletProps> = ({ data }) => {
  const { t } = useTranslation();

  const getStatusTag = (status: string, days: number) => {
    if (days <= 7) {
      return <Tag color="red">{t('dashboard.contract.expiringSoon')}</Tag>;
    }
    if (days <= 15) {
      return <Tag color="orange">{t('dashboard.contract.attention')}</Tag>;
    }
    return <Tag color="blue">{t('dashboard.contract.normal')}</Tag>;
  };

  const columns = [
    { title: t('dashboard.contract.name'), dataIndex: 'contractName', key: 'contractName', ellipsis: true },
    { title: t('dashboard.contract.customer'), dataIndex: 'customerName', key: 'customerName', ellipsis: true, width: 100 },
    { title: t('dashboard.contract.amount'), dataIndex: 'amount', key: 'amount', width: 90, render: (amount: number) => `¥${(amount / 10000).toFixed(0)}${t('dashboard.contract.wan')}` },
    { title: t('dashboard.contract.daysRemaining'), dataIndex: 'daysRemaining', key: 'daysRemaining', width: 70, render: (days: number, record: ContractItem) => (
      <div>
        <span style={{ color: days <= 7 ? '#f5222d' : '#666' }}>{days}{t('dashboard.contract.days')}</span>
        {getStatusTag(record.status, days)}
      </div>
    )},
  ];

  return (
    <Card title={t('dashboard.contract.title')} bordered={false} size="small" style={{ height: '100%' }} bodyStyle={{ padding: '12px' }}>
      <Table columns={columns} dataSource={data} rowKey="id" pagination={false} size="small" scroll={{ y: 280 }} />
    </Card>
  );
};

export default ContractDashlet;