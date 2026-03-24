/**
 * 线索重复检测提示弹窗
 */

import React from 'react';
import { Modal, Table, Tag, Space, Button } from 'antd';
import { WarningOutlined, EyeOutlined } from '@ant-design/icons';
import { Lead } from '../../types/lead';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface DuplicateCheckModalProps {
  visible: boolean;
  duplicates: Lead[];
  matchType: 'phone' | 'email' | 'company' | 'multiple';
  onContinue: () => void;
  onCancel: () => void;
}

export const DuplicateCheckModal: React.FC<DuplicateCheckModalProps> = ({
  visible,
  duplicates,
  matchType,
  onContinue,
  onCancel,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const columns = [
    {
      title: t('lead.duplicate.view'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('lead.form.contactName'),
      dataIndex: 'contactName',
      key: 'contactName',
    },
    {
      title: t('lead.form.mobile'),
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: t('lead.form.email'),
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: t('lead.form.companyName'),
      dataIndex: 'company',
      key: 'company',
    },
    {
      title: t('lead.filter.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          '待跟进': 'blue',
          '跟进中': 'orange',
          '已转化': 'green',
          '已关闭': 'default',
        };
        return <Tag color={colorMap[status] || 'default'}>{status}</Tag>;
      },
    },
    {
      title: t('opportunity.table.actions'),
      key: 'action',
      render: (_: any, record: Lead) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => {
            navigate(`/lead/${record.id}`);
            onCancel();
          }}
        >
          {t('lead.duplicate.view')}
        </Button>
      ),
    },
  ];

  const typeText = {
    phone: t('lead.duplicate.phone'),
    email: t('lead.duplicate.email'),
    company: t('lead.duplicate.company'),
    multiple: t('lead.duplicate.multiple'),
  }[matchType];

  return (
    <Modal
      title={
        <Space>
          <WarningOutlined style={{ color: '#faad14', fontSize: 20 }} />
          <span>{t('lead.duplicate.title')}</span>
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          {t('lead.form.cancel')}
        </Button>,
        <Button key="continue" onClick={onContinue} danger>
          {t('lead.duplicate.continueCreate')}
        </Button>,
      ]}
      width={900}
    >
      <div style={{ marginBottom: 16, padding: '12px 16px', background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 4 }}>
        <p style={{ margin: 0, color: '#fa8c16' }}>
          <strong>{t('lead.duplicate.hint', { count: duplicates.length, type: typeText })}</strong>
        </p>
      </div>
      
      <Table
        columns={columns}
        dataSource={duplicates}
        rowKey="id"
        pagination={false}
        size="small"
        scroll={{ y: 400 }}
      />
    </Modal>
  );
};
