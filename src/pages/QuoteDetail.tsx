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
        message.error('报价单不存在');
      }
    } catch (error) {
      message.error('加载报价单详情失败');
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
      title: '转合同确认',
      content: '确定要将该报价单转为合同吗？',
      okText: '确认转换',
      cancelText: '取消',
      onOk: () => {
        message.success('报价单已转为合同');
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

  if (!quote) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Text type="secondary">报价单不存在或已删除</Text>
          <div style={{ marginTop: 16 }}>
            <Button type="primary" onClick={handleBack}>
              返回列表
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
                返回
              </Button>
              <Title level={4} style={{ margin: 0 }}>
                {quote.quoteNumber}
              </Title>
              <Tag color={statusColorMap[quote.status]} style={{ fontSize: 14 }}>
                {quote.status}
              </Tag>
            </Space>
          </Col>
          <Col>
            <Space>
              {quote.status === QuoteStatus.DRAFT && (
                <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
                  编辑
                </Button>
              )}
              {quote.status === QuoteStatus.ACCEPTED && !quote.convertedToContractId && (
                <Button
                  type="primary"
                  icon={<FileDoneOutlined />}
                  onClick={handleConvertToContract}
                >
                  转合同
                </Button>
              )}
              <Button icon={<PrinterOutlined />} onClick={handlePrint}>
                打印
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 基本信息 */}
      <Card title="基本信息" style={{ marginBottom: 16 }}>
        <Descriptions column={3} bordered>
          <Descriptions.Item label="报价单号" span={1}>
            <Text strong>{quote.quoteNumber}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="客户名称" span={1}>
            {quote.customerName}
          </Descriptions.Item>
          <Descriptions.Item label="联系人" span={1}>
            {quote.contactName || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="商机" span={1}>
            {quote.opportunityName || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="状态" span={1}>
            <Tag color={statusColorMap[quote.status]}>{quote.status}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="有效期至" span={1}>
            {quote.validUntil}
          </Descriptions.Item>
          <Descriptions.Item label="创建人" span={1}>
            {quote.createdByName}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间" span={1}>
            {quote.createdAt}
          </Descriptions.Item>
          <Descriptions.Item label="更新时间" span={1}>
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
          <Card title="备注">
            <Text type="secondary">{quote.notes || '无'}</Text>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="条款">
            <Text type="secondary">{quote.terms || '无'}</Text>
          </Card>
        </Col>
      </Row>

      {/* 金额汇总 */}
      <Card title="金额汇总" style={{ marginTop: 16 }}>
        <Descriptions column={4} bordered>
          <Descriptions.Item label="小计">
            <Text>¥{quote.subtotal.toLocaleString()}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="总折扣">
            <Text type="danger">-¥{quote.totalDiscount.toLocaleString()}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="税费 (13%)">
            <Text>¥{quote.totalTax.toLocaleString()}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="总计">
            <Text strong style={{ color: '#52c41a', fontSize: 16 }}>
              ¥{quote.grandTotal.toLocaleString()}
            </Text>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 合同信息（如果已转合同） */}
      {quote.convertedToContractId && (
        <Card title="合同信息" style={{ marginTop: 16 }}>
          <Descriptions column={2} bordered>
            <Descriptions.Item label="合同 ID">
              {quote.convertedToContractId}
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color="green">已转合同</Tag>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}
    </div>
  );
};

export default QuoteDetail;
