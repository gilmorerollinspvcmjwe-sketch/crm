import React from 'react';
import { Card, Row, Col, Statistic, Progress, Table, Typography } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { useTranslation } from 'react-i18next';
import { OpportunityStage, SalesFunnelStats } from '../../types/opportunity';

const { Title } = Typography;

// 销售漏斗组件属性
interface SalesFunnelProps {
  // 漏斗数据
  data: SalesFunnelStats[];
  // 点击阶段回调
  onStageClick?: (stage: OpportunityStage) => void;
}

/**
 * 销售漏斗可视化组件
 * 展示各阶段商机数量和金额统计
 */
export const SalesFunnel: React.FC<SalesFunnelProps> = ({ data, onStageClick }) => {
  const { t } = useTranslation();

  // 阶段颜色配置
  const STAGE_COLORS: Record<OpportunityStage, string> = {
    [OpportunityStage.LEAD_CONFIRMATION]: '#1890ff',
    [OpportunityStage.INITIAL_CONTACT]: '#40a9ff',
    [OpportunityStage.REQUIREMENT_CONFIRMATION]: '#69c0ff',
    [OpportunityStage.PROPOSAL_QUOTATION]: '#91d5ff',
    [OpportunityStage.NEGOTIATION_APPROVAL]: '#bae7ff',
    [OpportunityStage.CLOSED_WON]: '#52c41a',
    [OpportunityStage.CLOSED_LOST]: '#ff4d4f'
  };

  // 阶段名称映射
  const STAGE_LABELS: Record<OpportunityStage, string> = {
    [OpportunityStage.LEAD_CONFIRMATION]: t('salesFunnel.stage.leadConfirmation'),
    [OpportunityStage.INITIAL_CONTACT]: t('salesFunnel.stage.initialContact'),
    [OpportunityStage.REQUIREMENT_CONFIRMATION]: t('salesFunnel.stage.requirementConfirmation'),
    [OpportunityStage.PROPOSAL_QUOTATION]: t('salesFunnel.stage.proposalQuotation'),
    [OpportunityStage.NEGOTIATION_APPROVAL]: t('salesFunnel.stage.negotiationApproval'),
    [OpportunityStage.CLOSED_WON]: t('salesFunnel.stage.closedWon'),
    [OpportunityStage.CLOSED_LOST]: t('salesFunnel.stage.closedLost')
  };

  // 格式化金额为万元
  const formatAmount = (amount: number) => {
    return (amount / 10000).toFixed(0);
  };

  // 准备图表数据
  const chartData = data.map(item => ({
    name: STAGE_LABELS[item.stage],
    stage: item.stage,
    count: item.count,
    amount: item.totalAmount,
    probability: item.probability
  }));

  // 计算总计
  const totalCount = data.reduce((sum, item) => sum + item.count, 0);
  const totalAmount = data.reduce((sum, item) => sum + item.totalAmount, 0);
  const avgProbability = data.length > 0
    ? Math.round(data.reduce((sum, item) => sum + item.probability, 0) / data.length)
    : 0;

  // 表格列定义
  const columns = [
    {
      title: t('salesFunnel.column.stage'),
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <a
          onClick={() => onStageClick?.(record.stage)}
          style={{ cursor: 'pointer', color: STAGE_COLORS[record.stage] }}
        >
          {text}
        </a>
      )
    },
    {
      title: t('salesFunnel.column.count'),
      dataIndex: 'count',
      key: 'count',
      sorter: (a: any, b: any) => a.count - b.count,
      render: (count: number) => (
        <span style={{ fontWeight: 'bold' }}>{count}</span>
      )
    },
    {
      title: t('salesFunnel.column.amount'),
      dataIndex: 'amount',
      key: 'amount',
      sorter: (a: any, b: any) => a.amount - b.amount,
      render: (amount: number) => `¥${formatAmount(amount)}${t('common.unit.tenThousand')}`
    },
    {
      title: t('salesFunnel.column.probability'),
      dataIndex: 'probability',
      key: 'probability',
      sorter: (a: any, b: any) => a.probability - b.probability,
      render: (probability: number) => (
        <Progress
          percent={probability}
          strokeColor={STAGE_COLORS[data.find(d => d.stage === (probability as any))?.stage as OpportunityStage] || '#1890ff'}
          format={() => `${probability}%`}
          size="small"
        />
      )
    }
  ];

  return (
    <Card title={t('salesFunnel.title')} style={{ marginBottom: 24 }}>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Statistic
            title={t('salesFunnel.stats.totalCount')}
            value={totalCount}
            suffix={t('salesFunnel.stats.countUnit')}
            valueStyle={{ color: '#1890ff' }}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title={t('salesFunnel.stats.totalAmount')}
            value={formatAmount(totalAmount)}
            suffix={t('common.unit.tenThousand')}
            valueStyle={{ color: '#52c41a' }}
            precision={0}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title={t('salesFunnel.stats.avgProbability')}
            value={avgProbability}
            suffix={t('common.unit.percent')}
            valueStyle={{ color: '#faad14' }}
          />
        </Col>
      </Row>

      {/* 漏斗图表 */}
      <div style={{ height: 300, marginBottom: 24 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              interval={0}
              height={80}
            />
            <YAxis yAxisId="left" orientation="left" stroke="#1890ff" label={{ value: t('salesFunnel.chart.countLabel'), angle: -90, position: 'insideLeft' }} />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#52c41a"
              tickFormatter={(value) => `${(value / 10000).toFixed(0)}${t('common.unit.tenThousand')}`}
              label={{ value: t('salesFunnel.chart.amountLabel'), angle: 90, position: 'insideRight' }}
            />
            <Tooltip
              formatter={(value: any, name: any) => {
                if (name === t('salesFunnel.chart.amount')) {
                  return [`¥${formatAmount(value as number)}${t('common.unit.tenThousand')}`, t('salesFunnel.chart.amount')];
                }
                return [value, name === 'count' ? t('salesFunnel.chart.count') : t('salesFunnel.chart.probability')];
              }}
            />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="count"
              name={t('salesFunnel.chart.count')}
              fill="#1890ff"
              radius={[4, 4, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-count-${index}`}
                  fill={STAGE_COLORS[entry.stage as OpportunityStage]}
                />
              ))}
            </Bar>
            <Bar
              yAxisId="right"
              dataKey="amount"
              name={t('salesFunnel.chart.amount')}
              fill="#52c41a"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 数据表格 */}
      <Title level={5}>{t('salesFunnel.detailData')}</Title>
      <Table
        columns={columns}
        dataSource={chartData}
        rowKey="stage"
        pagination={false}
        size="small"
        onRow={(record: any) => ({
          onClick: () => onStageClick?.(record.stage)
        })}
        style={{ cursor: 'pointer' }}
      />
    </Card>
  );
};

export default SalesFunnel;