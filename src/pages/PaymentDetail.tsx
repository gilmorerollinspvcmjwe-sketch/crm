import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card, Descriptions, Tag, Space, Button, Typography, Divider, message, Modal,
  Table, Timeline, Progress
} from 'antd';
import { ArrowLeftOutlined, EditOutlined, CheckCircleOutlined, CloseOutlined } from '@ant-design/icons';
import { PaymentPlan, PaymentStatus, PaymentMethod } from '../types/payment';
import { paymentPlanData, paymentRecordData } from '../mock/paymentData';
import { PaymentProgress } from '../components/Payment/PaymentProgress';

const { Title, Text } = Typography;

// 状态颜色配置
const STATUS_COLORS: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: 'default',
  [PaymentStatus.PARTIAL]: 'orange',
  [PaymentStatus.COMPLETED]: 'green',
  [PaymentStatus.OVERDUE]: 'red'
};

// 付款方式颜色
const PAYMENT_METHOD_COLORS: Record<PaymentMethod, string> = {
  [PaymentMethod.BANK_TRANSFER]: 'blue',
  [PaymentMethod.ALIPAY]: 'cyan',
  [PaymentMethod.WECHAT_PAY]: 'green',
  [PaymentMethod.CASH]: 'orange',
  [PaymentMethod.CHECK]: 'purple',
  [PaymentMethod.OTHER]: 'default'
};

/**
 * 回款详情页
 * 功能：
 * - 回款计划详情
 * - 回款记录
 * - 回款进度
 * - 操作按钮
 */
export const PaymentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // 查找回款计划数据
  const paymentPlan = useMemo(() => {
    return paymentPlanData.find(p => p.id === id);
  }, [id]);

  // 查找相关回款记录
  const relatedRecords = useMemo(() => {
    if (!paymentPlan) return [];
    return paymentRecordData.filter(record =>
      record.contractId === paymentPlan.contractId
    );
  }, [id, paymentPlan]);

  // 格式化金额
  const formatAmount = (amount: number) => {
    return `¥${(amount / 10000).toFixed(1)}万`;
  };

  // 格式化日期
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN');
  };

  // 处理返回
  const handleBack = () => {
    navigate('/payment/list');
  };

  // 处理编辑
  const handleEdit = () => {
    message.info(`编辑回款计划：${id}`);
    // TODO: 打开编辑表单
  };

  // 处理核销
  const handleVerify = () => {
    Modal.confirm({
      title: '确定要核销这笔回款吗？',
      content: '核销后回款状态将变更为已回款',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        message.success('回款已核销');
        // TODO: 调用核销 API
      }
    });
  };

  // 处理驳回
  const handleReject = () => {
    Modal.confirm({
      title: '确定要驳回这笔回款吗？',
      content: '请说明驳回原因',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        message.info('回款已驳回');
        // TODO: 调用驳回 API
      }
    });
  };

  // 如果没有找到回款计划
  if (!paymentPlan) {
    return (
      <div style={{ padding: 24 }}>
        <Card>
          <Title level={3}>回款计划不存在</Title>
          <Button onClick={handleBack} icon={<ArrowLeftOutlined />}>
            返回
          </Button>
        </Card>
      </div>
    );
  }

  // 回款记录表格列
  const recordColumns = [
    {
      title: '回款时间',
      dataIndex: 'paymentDate',
      key: 'paymentDate',
      width: 120,
      render: (date: string) => formatDate(date)
    },
    {
      title: '回款金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (amount: number) => (
        <Text strong style={{ color: '#52c41a' }}>{formatAmount(amount)}</Text>
      )
    },
    {
      title: '付款方式',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 100,
      render: (method: PaymentMethod) => (
        <Tag color={PAYMENT_METHOD_COLORS[method]}>{method}</Tag>
      )
    },
    {
      title: '付款账户',
      dataIndex: 'paymentAccount',
      key: 'paymentAccount',
      ellipsis: true
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusMap: Record<string, { text: string; color: string }> = {
          VERIFIED: { text: '已核销', color: 'green' },
          PENDING_VERIFY: { text: '待核销', color: 'orange' },
          REJECTED: { text: '已驳回', color: 'red' }
        };
        const config = statusMap[status] || { text: status, color: 'default' };
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '核销人',
      dataIndex: 'verifiedByName',
      key: 'verifiedByName',
      width: 100,
      render: (name?: string) => name || '-'
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks',
      ellipsis: true
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* 头部操作区 */}
      <Card style={{ marginBottom: 16 }}>
        <Space style={{ justifyContent: 'space-between', width: '100%', display: 'flex' }}>
          <Space>
            <Button onClick={handleBack} icon={<ArrowLeftOutlined />}>
              返回
            </Button>
            <Title level={3} style={{ margin: 0 }}>
              回款计划：{paymentPlan.contractNumber} - 第{paymentPlan.installmentNumber}期
            </Title>
          </Space>
          <Space>
            <Button icon={<EditOutlined />} onClick={handleEdit}>
              编辑
            </Button>
            {paymentPlan.actualAmount && paymentPlan.status !== PaymentStatus.COMPLETED && (
              <>
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={handleVerify}
                  style={{ color: '#52c41a' }}
                >
                  核销
                </Button>
                <Button
                  danger
                  icon={<CloseOutlined />}
                  onClick={handleReject}
                >
                  驳回
                </Button>
              </>
            )}
          </Space>
        </Space>
      </Card>

      {/* 基本信息 */}
      <Card title="📋 回款计划信息" style={{ marginBottom: 16 }}>
        <Descriptions column={3} bordered>
          <Descriptions.Item label="合同编号">
            <Text code>{paymentPlan.contractNumber}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="合同名称">{paymentPlan.contractName}</Descriptions.Item>
          <Descriptions.Item label="客户名称">{paymentPlan.customerName}</Descriptions.Item>
          <Descriptions.Item label="期数">第{paymentPlan.installmentNumber}期</Descriptions.Item>
          <Descriptions.Item label="计划金额">
            <Text strong>{formatAmount(paymentPlan.plannedAmount)}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="实际金额">
            {paymentPlan.actualAmount ? (
              <Text strong style={{ color: '#52c41a' }}>{formatAmount(paymentPlan.actualAmount)}</Text>
            ) : (
              '-'
            )}
          </Descriptions.Item>
          <Descriptions.Item label="计划日期">{formatDate(paymentPlan.plannedDate)}</Descriptions.Item>
          <Descriptions.Item label="实际日期">
            {paymentPlan.actualDate ? formatDate(paymentPlan.actualDate) : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="付款方式">
            {paymentPlan.paymentMethod ? (
              <Tag color={PAYMENT_METHOD_COLORS[paymentPlan.paymentMethod]}>
                {paymentPlan.paymentMethod}
              </Tag>
            ) : (
              '-'
            )}
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={STATUS_COLORS[paymentPlan.status]}>{paymentPlan.status}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="逾期天数">
            {paymentPlan.overdueDays && paymentPlan.overdueDays > 0 ? (
              <Text type="danger">{paymentPlan.overdueDays}天</Text>
            ) : (
              '-'
            )}
          </Descriptions.Item>
          <Descriptions.Item label="付款条件" span={2}>
            {paymentPlan.paymentCondition || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="备注" span={3}>
            {paymentPlan.remarks || '-'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 回款进度 */}
      <Card title="💰 回款进度" style={{ marginBottom: 16 }}>
        <PaymentProgress
          paymentPlans={[paymentPlan]}
          totalAmount={paymentPlan.plannedAmount}
          showDetail={false}
        />
      </Card>

      {/* 关联回款记录 */}
      <Card title="回款记录" style={{ marginBottom: 16 }}>
        {relatedRecords.length > 0 ? (
          <Table
            columns={recordColumns}
            dataSource={relatedRecords}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            size="middle"
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
            暂无回款记录
          </div>
        )}
      </Card>

      {/* 时间线 */}
      <Card title="📅 回款时间线">
        <Timeline
          items={[
            {
              color: 'green',
              children: (
                <div>
                  <div>回款计划创建</div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {new Date(paymentPlan.createdAt).toLocaleString('zh-CN')}
                  </Text>
                </div>
              )
            },
            paymentPlan.actualDate && {
              color: 'blue',
              children: (
                <div>
                  <div>回款到账</div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {new Date(paymentPlan.actualDate).toLocaleString('zh-CN')}
                  </Text>
                  <div>金额：{formatAmount(paymentPlan.actualAmount!)}</div>
                </div>
              )
            },
            paymentPlan.status === PaymentStatus.COMPLETED && {
              color: 'green',
              children: (
                <div>
                  <div>回款核销</div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {new Date(paymentPlan.updatedAt).toLocaleString('zh-CN')}
                  </Text>
                </div>
              )
            },
            paymentPlan.overdueDays && paymentPlan.overdueDays > 0 && {
              color: 'red',
              children: (
                <div>
                  <div style={{ color: '#ff4d4f' }}>回款逾期</div>
                  <Text type="danger" style={{ fontSize: 12 }}>
                    已逾期 {paymentPlan.overdueDays} 天
                  </Text>
                </div>
              )
            }
          ].filter(Boolean)}
        />
      </Card>
    </div>
  );
};

export default PaymentDetail;
