/**
 * 线索重复检测提示弹窗
 */

import React from 'react';
import { Modal, Table, Tag, Space, Button } from 'antd';
import { WarningOutlined, EyeOutlined } from '@ant-design/icons';
import { Lead } from '../../types/lead';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const columns = [
    {
      title: '线索名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '联系人',
      dataIndex: 'contactName',
      key: 'contactName',
    },
    {
      title: '手机',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '公司',
      dataIndex: 'company',
      key: 'company',
    },
    {
      title: '状态',
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
      title: '操作',
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
          查看
        </Button>
      ),
    },
  ];

  const typeText = {
    phone: '手机号',
    email: '邮箱',
    company: '公司名称',
    multiple: '多个信息',
  }[matchType];

  return (
    <Modal
      title={
        <Space>
          <WarningOutlined style={{ color: '#faad14', fontSize: 20 }} />
          <span>发现重复线索</span>
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button key="continue" onClick={onContinue} danger>
          继续创建
        </Button>,
      ]}
      width={900}
    >
      <div style={{ marginBottom: 16, padding: '12px 16px', background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 4 }}>
        <p style={{ margin: 0, color: '#fa8c16' }}>
          <strong>提示：</strong>检测到 {duplicates.length} 条重复线索（{typeText}重复）。
          请确认是否继续创建，或查看已有线索避免重复录入。
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
