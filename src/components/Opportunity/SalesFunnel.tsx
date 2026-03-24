import React from 'react';
import { Card, Row, Col, Statistic, Progress, Table, Typography } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { OpportunityStage, SalesFunnelStats } from '../../types/opportunity';

const { Title } = Typography;

// 销售漏斗组件属性
interface SalesFunnelProps {
  // 漏斗数据
  data: SalesFunnelStats[];
  // 点击阶段回调
  onStageClick?: (stage: OpportunityStage) => void;
}

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
  [OpportunityStage.LEAD_CONFIRMATION]: '线索确认',
  [OpportunityStage.INITIAL_CONTACT]: '初步接触',
  [OpportunityStage.REQUIREMENT_CONFIRMATION]: '需求确认',
  [OpportunityStage.PROPOSAL_QUOTATION]: '方案报价',
  [OpportunityStage.NEGOTIATION_APPROVAL]: '谈判审批',
  [OpportunityStage.CLOSED_WON]: '已成交',
  [OpportunityStage.CLOSED_LOST]: '已输单'
};

/**
 * 销售漏斗可视化组件
 * 展示各阶段商机数量和金额统计
 */
export const SalesFunnel: React.FC<SalesFunnelProps> = ({ data, onStageClick }) => {
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
      title: '阶段',
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
      title: '商机数量',
      dataIndex: 'count',
      key: 'count',
      sorter: (a: any, b: any) => a.count - b.count,
      render: (count: number) => (
        <span style={{ fontWeight: 'bold' }}>{count}</span>
      )
    },
    {
      title: '预计金额 (万元)',
      dataIndex: 'amount',
      key: 'amount',
      sorter: (a: any, b: any) => a.amount - b.amount,
      render: (amount: number) => `¥${formatAmount(amount)}`
    },
    {
      title: '成交概率',
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
    <Card title="销售漏斗分析" style={{ marginBottom: 24 }}>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Statistic
            title="商机总数"
            value={totalCount}
            suffix="个"
            valueStyle={{ color: '#1890ff' }}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="预计总金额"
            value={formatAmount(totalAmount)}
            suffix="万元"
            valueStyle={{ color: '#52c41a' }}
            precision={0}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="平均成交概率"
            value={avgProbability}
            suffix="%"
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
            <YAxis yAxisId="left" orientation="left" stroke="#1890ff" label={{ value: '商机数量', angle: -90, position: 'insideLeft' }} />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#52c41a"
              tickFormatter={(value) => `${(value / 10000).toFixed(0)}万`}
              label={{ value: '预计金额', angle: 90, position: 'insideRight' }}
            />
            <Tooltip
              formatter={(value: any, name: any) => {
                if (name === '预计金额') {
                  return [`¥${formatAmount(value as number)}万`, '预计金额'];
                }
                return [value, name === 'count' ? '商机数量' : '成交概率'];
              }}
            />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="count"
              name="商机数量"
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
              name="预计金额"
              fill="#52c41a"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 数据表格 */}
      <Title level={5}>详细数据</Title>
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
