import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Tag, Space, Button, Typography, Divider, Table, message, Modal, Progress, Timeline } from 'antd';
import { ArrowLeftOutlined, EditOutlined, CheckCircleOutlined, CiOutlined as ArchiveOutlined, DeleteOutlined } from '@ant-design/icons';
import { Contract, ContractStatus, PaymentPlan } from '../types/contract';
import { contractData } from '../mock/contractData';

const { Title, Text, Paragraph } = Typography;

// 状态颜色配置
const STATUS_COLORS: Record<ContractStatus, string> = {
  [ContractStatus.DRAFT]: 'default',
  [ContractStatus.PENDING_APPROVAL]: 'processing',
  [ContractStatus.ACTIVE]: 'success',
  [ContractStatus.ARCHIVED]: 'blue',
  [ContractStatus.TERMINATED]: 'red'
};

// 回款计划状态颜色
const PAYMENT_STATUS_COLORS: Record<string, string> = {
  PENDING: 'default',
  PARTIAL: 'orange',
  COMPLETED: 'green',
  OVERDUE: 'red'
};

// 回款计划状态文本
const PAYMENT_STATUS_TEXT: Record<string, string> = {
  PENDING: '待回款',
  PARTIAL: '部分回款',
  COMPLETED: '已回款',
  OVERDUE: '已逾期'
};

/**
 * 合同详情页
 * 功能：
 * - 基本信息展示
 * - 合同条款展示
 * - 关联信息：关联商机、回款计划
 * - 操作按钮：编辑、提交审批、归档、删除
 */
export const ContractDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // 查找合同数据
  const contract = useMemo(() => {
    return contractData.find(c => c.id === id);
  }, [id]);

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
    navigate('/contract/list');
  };

  // 处理编辑
  const handleEdit = () => {
    message.info(`编辑合同：${id}`);
    // TODO: 打开编辑表单
  };

  // 处理提交审批
  const handleSubmitApproval = () => {
    Modal.confirm({
      title: '确定要提交审批吗？',
      content: '提交后将进入审批流程',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        message.success('已提交审批');
        // TODO: 调用审批 API
      }
    });
  };

  // 处理归档
  const handleArchive = () => {
    Modal.confirm({
      title: '确定要归档这个合同吗？',
      content: '归档后合同将不可修改',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        message.success('合同已归档');
        // TODO: 调用归档 API
      }
    });
  };

  // 处理删除
  const handleDelete = () => {
    Modal.confirm({
      title: '确定要删除这个合同吗？',
      content: '删除后无法恢复',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        message.success('删除成功');
        // TODO: 调用删除 API
      }
    });
  };

  // 如果没有找到合同
  if (!contract) {
    return (
      <div style={{ padding: 24 }}>
        <Card>
          <Title level={3}>合同不存在</Title>
          <Button onClick={handleBack} icon={<ArrowLeftOutlined />}>
            返回
          </Button>
        </Card>
      </div>
    );
  }

  // 回款计划表格列
  const paymentPlanColumns = [
    {
      title: '期数',
      dataIndex: 'installmentNumber',
      key: 'installmentNumber',
      width: 80,
      render: (num: number) => `第${num}期`
    },
    {
      title: '计划金额',
      dataIndex: 'plannedAmount',
      key: 'plannedAmount',
      width: 120,
      render: (amount: number) => formatAmount(amount)
    },
    {
      title: '计划回款日期',
      dataIndex: 'plannedDate',
      key: 'plannedDate',
      width: 120,
      render: (date: string) => formatDate(date)
    },
    {
      title: '实际金额',
      dataIndex: 'actualAmount',
      key: 'actualAmount',
      width: 120,
      render: (amount?: number) => amount ? formatAmount(amount) : '-'
    },
    {
      title: '实际回款日期',
      dataIndex: 'actualDate',
      key: 'actualDate',
      width: 120,
      render: (date?: string) => date ? formatDate(date) : '-'
    },
    {
      title: '付款条件',
      dataIndex: 'paymentCondition',
      key: 'paymentCondition',
      ellipsis: true
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={PAYMENT_STATUS_COLORS[status]}>
          {PAYMENT_STATUS_TEXT[status]}
        </Tag>
      )
    }
  ];

  // 计算回款进度
  const completedPayments = contract.paymentPlans.filter(p => p.status === 'COMPLETED').length;
  const totalPayments = contract.paymentPlans.length;
  const paymentProgress = totalPayments > 0 ? Math.round((completedPayments / totalPayments) * 100) : 0;
  const paidAmount = contract.paymentPlans
    .filter(p => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + (p.actualAmount || p.plannedAmount), 0);

  return (
    <div style={{ padding: 24 }}>
      {/* 头部操作区 */}
      <Card style={{ marginBottom: 16 }}>
        <Space style={{ justifyContent: 'space-between', width: '100%', display: 'flex' }}>
          <Space>
            <Button onClick={handleBack} icon={<ArrowLeftOutlined />}>
              返回
            </Button>
            <Title level={3} style={{ margin: 0 }}>{contract.name}</Title>
          </Space>
          <Space>
            {contract.status === ContractStatus.DRAFT && (
              <>
                <Button icon={<EditOutlined />} onClick={handleEdit}>
                  编辑
                </Button>
                <Button type="primary" icon={<CheckCircleOutlined />} onClick={handleSubmitApproval}>
                  提交审批
                </Button>
              </>
            )}
            {contract.status === ContractStatus.ACTIVE && (
              <Button icon={<ArchiveOutlined />} onClick={handleArchive}>
                归档
              </Button>
            )}
            <Button danger icon={<DeleteOutlined />} onClick={handleDelete}>
              删除
            </Button>
          </Space>
        </Space>
      </Card>

      {/* 基本信息 */}
      <Card title="📋 基本信息" style={{ marginBottom: 16 }}>
        <Descriptions column={3} bordered>
          <Descriptions.Item label="合同名称">{contract.name}</Descriptions.Item>
          <Descriptions.Item label="合同编号">
            <Text code>{contract.contractNumber}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="合同类型">
            <Tag>{contract.type}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="所属客户">{contract.customerName}</Descriptions.Item>
          <Descriptions.Item label="关联商机">
            {contract.opportunityName || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="合同金额">
            <Text strong style={{ color: '#faad14' }}>{formatAmount(contract.amount)}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="币种">{contract.currency}</Descriptions.Item>
          <Descriptions.Item label="签订日期">{formatDate(contract.signingDate)}</Descriptions.Item>
          <Descriptions.Item label="生效日期">{formatDate(contract.effectiveDate)}</Descriptions.Item>
          <Descriptions.Item label="到期日期">{contract.expirationDate ? formatDate(contract.expirationDate) : '-'}</Descriptions.Item>
          <Descriptions.Item label="合同期限">{contract.contractPeriod ? `${contract.contractPeriod}个月` : '-'}</Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={STATUS_COLORS[contract.status]}>{contract.status}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="负责人">{contract.ownerName}</Descriptions.Item>
          <Descriptions.Item label="我方签订人">{contract.signerOurSide}</Descriptions.Item>
          <Descriptions.Item label="客户签订人">{contract.signerCustomerSide || '-'}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{formatDate(contract.createdAt)}</Descriptions.Item>
          <Descriptions.Item label="最后更新">{formatDate(contract.updatedAt)}</Descriptions.Item>
          {contract.archivedAt && (
            <Descriptions.Item label="归档时间">{formatDate(contract.archivedAt)}</Descriptions.Item>
          )}
          {contract.archivedBy && (
            <Descriptions.Item label="归档人">{contract.archivedBy}</Descriptions.Item>
          )}
          <Descriptions.Item label="备注" span={3}>
            {contract.remarks || '-'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 回款进度 */}
      <Card title="💰 回款进度" style={{ marginBottom: 16 }}>
        <Space style={{ marginBottom: 16 }}>
          <Progress
            type="circle"
            percent={paymentProgress}
            strokeColor={paymentProgress === 100 ? '#52c41a' : '#1890ff'}
            format={() => `${paymentProgress}%`}
          />
          <div>
            <div style={{ fontSize: 16, marginBottom: 8 }}>
              已回款：<Text strong style={{ color: '#52c41a' }}>{formatAmount(paidAmount)}</Text>
              {' / '}
              合同总额：<Text strong>{formatAmount(contract.amount)}</Text>
            </div>
            <div style={{ color: '#666' }}>
              回款期数：{completedPayments} / {totalPayments} 期
            </div>
          </div>
        </Space>
      </Card>

      {/* 合同条款 */}
      <Card title="合同条款" style={{ marginBottom: 16 }}>
        <Descriptions column={2} bordered>
          <Descriptions.Item label="付款方式">{contract.terms.paymentMethod}</Descriptions.Item>
          <Descriptions.Item label="质保期限">{contract.terms.warrantyPeriod}个月</Descriptions.Item>
          <Descriptions.Item label="付款条款" span={2}>
            <Paragraph style={{ marginBottom: 0 }}>{contract.terms.paymentTerms}</Paragraph>
          </Descriptions.Item>
          <Descriptions.Item label="交付条款" span={2}>
            <Paragraph style={{ marginBottom: 0 }}>{contract.terms.deliveryTerms}</Paragraph>
          </Descriptions.Item>
          <Descriptions.Item label="交付内容" span={2}>
            <Paragraph style={{ marginBottom: 0 }}>{contract.deliveryContent}</Paragraph>
          </Descriptions.Item>
          <Descriptions.Item label="交付时间" span={2}>
            {contract.deliveryDate ? formatDate(contract.deliveryDate) : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="违约责任" span={3}>
            <Paragraph style={{ marginBottom: 0 }}>{contract.terms.liabilityForBreach}</Paragraph>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 回款计划 */}
      <Card title="📅 回款计划" style={{ marginBottom: 16 }}>
        <Table
          columns={paymentPlanColumns}
          dataSource={contract.paymentPlans}
          rowKey="id"
          pagination={false}
          size="middle"
          summary={(pageData) => {
            const totalPlanned = pageData.reduce((sum, p) => sum + p.plannedAmount, 0);
            const totalActual = pageData.reduce((sum, p) => sum + (p.actualAmount || 0), 0);
            return (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0}>合计</Table.Summary.Cell>
                  <Table.Summary.Cell index={1}>
                    <Text strong>{formatAmount(totalPlanned)}</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2}>-</Table.Summary.Cell>
                  <Table.Summary.Cell index={3}>
                    <Text strong>{formatAmount(totalActual)}</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={4}>-</Table.Summary.Cell>
                  <Table.Summary.Cell index={5}>-</Table.Summary.Cell>
                  <Table.Summary.Cell index={6}>-</Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            );
          }}
        />
      </Card>

      {/* 附件 */}
      {contract.attachments.length > 0 && (
        <Card title="📎 合同附件">
          <Space>
            {contract.attachments.map((url, index) => (
              <Tag key={index} color="blue" style={{ cursor: 'pointer' }}>
                📄 合同文件 {index + 1}
              </Tag>
            ))}
          </Space>
        </Card>
      )}
    </div>
  );
};

export default ContractDetail;
