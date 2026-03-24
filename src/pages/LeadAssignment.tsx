/**
 * 智能线索分配页面
 * AI 推荐分配结果，支持手动调整和批量分配
 */
import React, { useState } from 'react';
import {
  Table,
  Card,
  Tag,
  Button,
  Modal,
  Select,
  message,
  Typography,
  Space,
  Badge,
  Tooltip,
  Progress,
} from 'antd';
import {
  RobotOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { LeadToAssign, SalesPerson } from '../types/ai';
import { leadsToAssign, salesTeam } from '../mock/aiData';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;
const { Option } = Select;

const LeadAssignment: React.FC = () => {
  const { t } = useTranslation();
  const [leads, setLeads] = useState<LeadToAssign[]>(leadsToAssign);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentLead, setCurrentLead] = useState<LeadToAssign | null>(null);
  const [selectedSales, setSelectedSales] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // 获取销售信息
  const getSalesPerson = (id: string): SalesPerson | undefined => {
    return salesTeam.find((s) => s.id === id);
  };

  // 获取负载颜色
  const getLoadColor = (load: number, max: number): string => {
    const ratio = load / max;
    if (ratio >= 0.9) return 'red';
    if (ratio >= 0.7) return 'orange';
    return 'green';
  };

  // 打开分配弹窗
  const handleAssign = (lead: LeadToAssign) => {
    setCurrentLead(lead);
    setSelectedSales(lead.assignedTo || lead.recommendations[0]?.salesId || '');
    setIsModalVisible(true);
  };

  // 确认分配
  const handleAssignConfirm = () => {
    if (!currentLead || !selectedSales) {
      message.error(t('common.validation.pleaseSelect'));
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const sales = getSalesPerson(selectedSales);
      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === currentLead.id
            ? { ...lead, assignedTo: selectedSales, assignedToName: sales?.name }
            : lead
        )
      );
      setLoading(false);
      setIsModalVisible(false);
      message.success(t('ai.leadAssignment.assignedSuccess', { name: sales?.name }));
    }, 500);
  };

  // 批量分配
  const handleBatchAssign = () => {
    setLoading(true);
    setTimeout(() => {
      const unassignedLeads = leads.filter((l) => !l.assignedTo);
      const updatedLeads = unassignedLeads.map((lead) => {
        const topRecommendation = lead.recommendations[0];
        const sales = getSalesPerson(topRecommendation?.salesId || '');
        return {
          ...lead,
          assignedTo: topRecommendation?.salesId,
          assignedToName: sales?.name,
        };
      });

      setLeads((prev) =>
        prev.map((lead) => {
          const updated = updatedLeads.find((ul) => ul.id === lead.id);
          return updated || lead;
        })
      );
      setLoading(false);
      message.success(t('ai.leadAssignment.batchAssigned', { count: updatedLeads.length }));
    }, 800);
  };

  const columns: ColumnsType<LeadToAssign> = [
    {
      title: '线索名称',
      dataIndex: 'name',
      key: 'name',
      width: 250,
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.companyName} | {record.contactName}
          </Text>
        </div>
      ),
    },
    {
      title: '行业/区域',
      key: 'industry',
      width: 150,
      render: (_, record) => (
        <div>
          <Tag color="blue">{record.industry}</Tag>
          <br />
          <Tag color="geekblue">{record.region}</Tag>
        </div>
      ),
    },
    {
      title: '线索评分',
      dataIndex: 'score',
      key: 'score',
      width: 100,
      render: (score: number) => (
        <Badge
          count={score}
          style={{
            backgroundColor: score >= 80 ? '#52c41a' : score >= 60 ? '#faad14' : '#ff4d4f',
          }}
        />
      ),
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
    },
    {
      title: 'AI 推荐',
      key: 'recommendations',
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size={4} style={{ width: '100%' }}>
          {record.recommendations.slice(0, 2).map((rec, idx) => (
            <Tooltip
              key={rec.salesId}
              title={rec.reasons.join('\n')}
              color={idx === 0 ? 'green' : 'blue'}
            >
              <Tag
                color={idx === 0 ? 'success' : 'processing'}
                icon={idx === 0 ? <ThunderboltOutlined /> : <UserOutlined />}
              >
                {rec.salesName} {rec.score}分
              </Tag>
            </Tooltip>
          ))}
        </Space>
      ),
    },
    {
      title: '分配状态',
      key: 'status',
      width: 120,
      render: (_, record) =>
        record.assignedTo ? (
          <Tag color="success" icon={<CheckCircleOutlined />}>
            {record.assignedToName}
          </Tag>
        ) : (
          <Tag color="warning">待分配</Tag>
        ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button
          type={record.assignedTo ? 'default' : 'primary'}
          size="small"
          onClick={() => handleAssign(record)}
          icon={<RobotOutlined />}
        >
          {record.assignedTo ? '调整' : '分配'}
        </Button>
      ),
    },
  ];

  // 统计信息
  const totalLeads = leads.length;
  const assignedLeads = leads.filter((l) => l.assignedTo).length;
  const unassignedLeads = totalLeads - assignedLeads;

  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh' }}>
      {/* 页面头部 */}
      <div style={{ background: '#fff', padding: '16px 24px', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={2} style={{ margin: 0 }}>
              <RobotOutlined /> 智能线索分配
            </Title>
            <Text type="secondary">
              AI 基于规则 + 负载均衡自动推荐最优销售人员，支持手动调整和批量分配
            </Text>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<ThunderboltOutlined />}
            onClick={handleBatchAssign}
            loading={loading}
            disabled={unassignedLeads === 0}
          >
            一键批量分配 ({unassignedLeads}条待分配)
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }}>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <Title level={3} style={{ margin: 0 }}>{totalLeads}</Title>
            <Text type="secondary">总线索数</Text>
          </div>
        </Card>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <Title level={3} style={{ margin: 0, color: '#52c41a' }}>{assignedLeads}</Title>
            <Text type="secondary">已分配</Text>
          </div>
        </Card>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <Title level={3} style={{ margin: 0, color: '#faad14' }}>{unassignedLeads}</Title>
            <Text type="secondary">待分配</Text>
          </div>
        </Card>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
              {Math.round((assignedLeads / totalLeads) * 100)}%
            </Title>
            <Text type="secondary">分配进度</Text>
          </div>
        </Card>
      </div>

      {/* 销售团队负载 */}
      <Card title="销售团队负载情况" style={{ marginBottom: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {salesTeam.map((sales) => (
            <div key={sales.id} style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: 8 }}>
                <Badge
                  count={sales.status === 'available' ? '空闲' : '忙碌'}
                  style={{
                    backgroundColor: sales.status === 'available' ? '#52c41a' : '#faad14',
                  }}
                />
              </div>
              <Text strong>{sales.name}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>
                {sales.region} | 转化率{sales.conversionRate}%
              </Text>
              <Progress
                percent={Math.round((sales.currentLoad / sales.maxLoad) * 100)}
                strokeColor={getLoadColor(sales.currentLoad, sales.maxLoad)}
                format={() => `${sales.currentLoad}/${sales.maxLoad}`}
                size="small"
                style={{ marginTop: 8 }}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* 线索列表 */}
      <Card>
        <Table
          columns={columns}
          dataSource={leads}
          rowKey="id"
          pagination={{ pageSize: 20 }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* 分配弹窗 */}
      <Modal
        title={
          <Space>
            <RobotOutlined />
            AI 推荐分配
          </Space>
        }
        open={isModalVisible}
        onOk={handleAssignConfirm}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={loading}
        width={700}
      >
        {currentLead && (
          <div>
            <Card size="small" style={{ marginBottom: 16 }}>
              <Title level={5} style={{ margin: '0 0 8px 0' }}>{currentLead.name}</Title>
              <Space>
                <Tag>{currentLead.companyName}</Tag>
                <Tag>{currentLead.industry}</Tag>
                <Tag>{currentLead.region}</Tag>
                <Badge
                  count={`评分：${currentLead.score}`}
                  style={{
                    backgroundColor: currentLead.score >= 80 ? '#52c41a' : '#faad14',
                  }}
                />
              </Space>
            </Card>

            <Title level={5}>AI 推荐销售人员</Title>
            <Space direction="vertical" size={12} style={{ width: '100%', marginBottom: 16 }}>
              {currentLead.recommendations.map((rec, idx) => {
                const sales = getSalesPerson(rec.salesId);
                return (
                  <Card
                    key={rec.salesId}
                    size="small"
                    style={{
                      borderColor: idx === 0 ? '#52c41a' : '#d9d9d9',
                      backgroundColor: idx === 0 ? '#f6ffed' : '#fff',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <Space>
                          <Text strong>{rec.salesName}</Text>
                          {idx === 0 && <Tag color="success">推荐</Tag>}
                          <Tag color="blue">{rec.score}分</Tag>
                        </Space>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {sales?.region} | 负载{sales?.currentLoad}/{sales?.maxLoad} | 转化率{sales?.conversionRate}%
                        </Text>
                      </div>
                      <Button
                        type={idx === 0 ? 'primary' : 'default'}
                        size="small"
                        onClick={() => setSelectedSales(rec.salesId)}
                      >
                        选择
                      </Button>
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        推荐原因：{rec.reasons.join('、')}
                      </Text>
                    </div>
                  </Card>
                );
              })}
            </Space>

            <Title level={5}>手动选择销售人员</Title>
            <Select
              value={selectedSales}
              onChange={setSelectedSales}
              style={{ width: '100%' }}
              placeholder="选择销售人员"
            >
              {salesTeam.map((sales) => (
                <Option key={sales.id} value={sales.id}>
                  {sales.name} - {sales.region} (负载:{sales.currentLoad}/{sales.maxLoad})
                </Option>
              ))}
            </Select>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default LeadAssignment;
