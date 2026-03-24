/**
 * 报价单详情页
 * 功能：
 * - 展示报价单完整信息
 * - 展示报价产品明细
 * - 操作：编辑、转合同、打印
 */
import React, { useState, useEffect } from 'react';
import {
  Card,
  Descriptions,
  Button,
  Space,
  Tag,
  Typography,
  Divider,
  message,
  Modal,
  Row,
  Col,
} from 'antd';
import {
  EditOutlined,
  FileDoneOutlined,
  PrinterOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Quote, QuoteStatus } from '../types/cpq';
import { getQuoteById } from '../mock/cpqData';
import { QuoteCalculator } from '../components/CPQ/QuoteCalculator';

const { Title, Text } = Typography;

/** 状态标签颜色映射 */
const statusColorMap: Record<QuoteStatus, string> = {
  [QuoteStatus.DRAFT]: 'default',
  [QuoteStatus.SENT]: 'blue',
  [QuoteStatus.ACCEPTED]: 'green',
  [QuoteStatus.REJECTED]: 'red',
  [QuoteStatus.EXPIRED]: 'orange',
};

/**
 * 报价单详情页组件
 */
export const QuoteDetail: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState<Quote | null>(null);

  /** 加载报价单详情 */
  const loadQuoteDetail = () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const data = getQuoteById(id);
      if (data) {
        setQuote(data);
      } else {
        message.error(t('quote.detail.notFound'));
      }
    } catch (error) {
      message.error(t('common.messages.loadFailed'));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /** 初始加载 */
  useEffect(() => {
    loadQuoteDetail();
  }, [id]);

  /** 编辑报价单 */
  const handleEdit = () => {
    navigate(`/quote/${id}/edit`);
  };

  /** 转合同 */
  const handleConvertToContract = () => {
    Modal.confirm({
      title: t('quote.detail.convertConfirm'),
      content: t('quote.detail.convertContent'),
      okText: t('quote.detail.convertConfirm'),
      cancelText: t('common.actions.cancel'),
      onOk: () => {
        message.success(t('quote.detail.convertSuccess'));
        loadQuoteDetail();
      },
    });
  };

  /** 打印报价单 */
  const handlePrint = () => {
    window.print();
  };

  /** 返回列表 */
  const handleBack = () => {
    navigate('/quote/list');
  };

  // 获取状态文本
  const getStatusText = (status: QuoteStatus) => {
    const statusMap: Record<QuoteStatus, string> = {
      [QuoteStatus.DRAFT]: t('quote.status.draft'),
      [QuoteStatus.SENT]: t('quote.status.sent'),
      [QuoteStatus.ACCEPTED]: t('quote.status.accepted'),
      [QuoteStatus.REJECTED]: t('quote.status.rejected'),
      [QuoteStatus.EXPIRED]: t('quote.status.expired'),
    };
    return statusMap[status] || status;
  };

  if (!quote) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Text type="secondary">{t('quote.detail.notFound')}</Text>
          <div style={{ marginTop: 16 }}>
            <Button type="primary" onClick={handleBack}>
              {t('quote.detail.backToList')}
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div>
      {/* 顶部操作栏 */}
      <Card style={{ marginBottom: 16 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
                {t('quote.detail.back')}
              </Button>
              <Title level={4} style={{ margin: 0 }}>
                {quote.quoteNumber}
              </Title>
              <Tag color={statusColorMap[quote.status]} style={{ fontSize: 14 }}>
                {getStatusText(quote.status)}
              </Tag>
            </Space>
          </Col>
          <Col>
            <Space>
              {quote.status === QuoteStatus.DRAFT && (
                <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
                  {t('quote.detail.edit')}
                </Button>
              )}
              {quote.status === QuoteStatus.ACCEPTED && !quote.convertedToContractId && (
                <Button
                  type="primary"
                  icon={<FileDoneOutlined />}
                  onClick={handleConvertToContract}
                >
                  {t('quote.detail.convert')}
                </Button>
              )}
              <Button icon={<PrinterOutlined />} onClick={handlePrint}>
                {t('quote.detail.print')}
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 基本信息 */}
      <Card title={t('quote.detail.basicInfo')} style={{ marginBottom: 16 }}>
        <Descriptions column={3} bordered>
          <Descriptions.Item label={t('quote.detail.quoteNumber')} span={1}>
            <Text strong>{quote.quoteNumber}</Text>
          </Descriptions.Item>
          <Descriptions.Item label={t('quote.detail.customerName')} span={1}>
            {quote.customerName}
          </Descriptions.Item>
          <Descriptions.Item label={t('quote.detail.contactName')} span={1}>
            {quote.contactName || '-'}
          </Descriptions.Item>
          <Descriptions.Item label={t('quote.detail.opportunityName')} span={1}>
            {quote.opportunityName || '-'}
          </Descriptions.Item>
          <Descriptions.Item label={t('quote.detail.status')} span={1}>
            <Tag color={statusColorMap[quote.status]}>{getStatusText(quote.status)}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label={t('quote.detail.validUntil')} span={1}>
            {quote.validUntil}
          </Descriptions.Item>
          <Descriptions.Item label={t('quote.detail.createdBy')} span={1}>
            {quote.createdByName}
          </Descriptions.Item>
          <Descriptions.Item label={t('quote.detail.createdAt')} span={1}>
            {quote.createdAt}
          </Descriptions.Item>
          <Descriptions.Item label={t('quote.detail.updatedAt')} span={1}>
            {quote.updatedAt}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 报价明细 */}
      <QuoteCalculator
        products={quote.products}
        onChange={(products) => {
          // 详情页只读，不处理变更
        }}
        readonly={true}
      />

      {/* 备注和条款 */}
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title={t('quote.detail.notes')}>
            <Text type="secondary">{quote.notes || t('quote.detail.none')}</Text>
          </Card>
        </Col>
        <Col span={12}>
          <Card title={t('quote.detail.terms')}>
            <Text type="secondary">{quote.terms || t('quote.detail.none')}</Text>
          </Card>
        </Col>
      </Row>

      {/* 金额汇总 */}
      <Card title={t('quote.detail.amountSummary')} style={{ marginTop: 16 }}>
        <Descriptions column={4} bordered>
          <Descriptions.Item label={t('quote.detail.subtotal')}>
            <Text>¥{quote.subtotal.toLocaleString()}</Text>
          </Descriptions.Item>
          <Descriptions.Item label={t('quote.detail.discount')}>
            <Text type="danger">-¥{quote.totalDiscount.toLocaleString()}</Text>
          </Descriptions.Item>
          <Descriptions.Item label={t('quote.detail.tax')}>
            <Text>¥{quote.totalTax.toLocaleString()}</Text>
          </Descriptions.Item>
          <Descriptions.Item label={t('quote.detail.grandTotal')}>
            <Text strong style={{ color: '#52c41a', fontSize: 16 }}>
              ¥{quote.grandTotal.toLocaleString()}
            </Text>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 合同信息（如果已转合同） */}
      {quote.convertedToContractId && (
        <Card title={t('quote.detail.contractInfo')} style={{ marginTop: 16 }}>
          <Descriptions column={2} bordered>
            <Descriptions.Item label={t('quote.detail.contractId')}>
              {quote.convertedToContractId}
            </Descriptions.Item>
            <Descriptions.Item label={t('quote.detail.status')}>
              <Tag color="green">{t('quote.detail.convertedStatus')}</Tag>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}
    </div>
  );
};

export default QuoteDetail;