/**
 * 商机管理页 - 重构版
 * 功能：
 * - 列表/看板双视图
 * - 拖拽排序（看板）
 * - 阶段分列显示
 */
import React, { useState, useMemo, useCallback } from 'react';
import { Card, Space, Button, message, Modal, Form, Input, Select, InputNumber, Segmented, Typography, Tag, Row, Col } from 'antd';
import {
  PlusOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Opportunity, OpportunityStage, OpportunityFilter } from '../types/opportunity';
import { opportunityData, generateSalesFunnelStats, filterOpportunities } from '../mock/opportunityData';
import { OpportunityTable } from '../components/Opportunity/OpportunityTable';
import { SalesFunnel } from '../components/Opportunity/SalesFunnel';
import { SearchFilter } from '../components/Opportunity/SearchFilter';
import { KanbanBoard, KanbanCard, KanbanColumn } from '../components/KanbanBoard';
import { FilterBar, FilterItem } from '../components/FilterBar';
import { DataTable } from '../components/DataTable';
import { colors } from '../styles/tokens';
import type { ColumnsType } from 'antd/es/table';

const { Text, Title } = Typography;

/** 阶段选项 */
const stageOptions = Object.values(OpportunityStage).map(stage => ({
  value: stage,
  label: stage,
}));

/** 阶段颜色 */
const stageColors: Record<string, string> = {
  [OpportunityStage.LEAD_CONFIRMATION]: '#1890ff',
  [OpportunityStage.INITIAL_CONTACT]: '#13c2c2',
  [OpportunityStage.REQUIREMENT_CONFIRMATION]: '#52c41a',
  [OpportunityStage.PROPOSAL_QUOTATION]: '#faad14',
  [OpportunityStage.NEGOTIATION_APPROVAL]: '#eb2f96',
  [OpportunityStage.CLOSED_WON]: '#52c41a',
  [OpportunityStage.CLOSED_LOST]: '#ff4d4f',
};

/** 阶段显示名称 */
const stageDisplayNames: Record<string, string> = {
  [OpportunityStage.LEAD_CONFIRMATION]: '线索确认',
  [OpportunityStage.INITIAL_CONTACT]: '初步接触',
  [OpportunityStage.REQUIREMENT_CONFIRMATION]: '需求确认',
  [OpportunityStage.PROPOSAL_QUOTATION]: '方案报价',
  [OpportunityStage.NEGOTIATION_APPROVAL]: '谈判审批',
  [OpportunityStage.CLOSED_WON]: '赢单',
  [OpportunityStage.CLOSED_LOST]: '输单',
};

/**
 * 商机列表页组件
 */
export const OpportunityList: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<OpportunityFilter>({});
  const [showFunnel, setShowFunnel] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);
  const [form] = Form.useForm();

  // 筛选后的商机数据
  const filteredData = useMemo(() => {
    return filterOpportunities(opportunityData, filter);
  }, [filter]);

  // 销售漏斗数据
  const funnelStats = useMemo(() => {
    return generateSalesFunnelStats();
  }, []);

  // 看板数据
  const kanbanColumns = useMemo((): KanbanColumn[] => {
    const activeStages = [
      OpportunityStage.LEAD_CONFIRMATION,
      OpportunityStage.INITIAL_CONTACT,
      OpportunityStage.REQUIREMENT_CONFIRMATION,
      OpportunityStage.PROPOSAL_QUOTATION,
      OpportunityStage.NEGOTIATION_APPROVAL,
    ];

    return activeStages.map(stage => ({
      key: stage,
      title: stageDisplayNames[stage],
      color: stageColors[stage],
      cards: filteredData
        .filter(opp => opp.stage === stage)
        .map(opp => ({
          id: opp.id,
          title: opp.name,
          amount: opp.amount,
          customer: opp.customerName,
          owner: opp.ownerName,
          dueDate: opp.estimatedCloseDate,
          priority: opp.amount > 500000 ? 'high' : opp.amount > 200000 ? 'medium' : 'low',
        })),
    }));
  }, [filteredData]);

  // 处理筛选变化
  const handleFilterChange = (values: Record<string, any>) => {
    setLoading(true);
    setFilter(values);
    setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  // 处理重置
  const handleReset = () => {
    setFilter({});
  };

  // 处理查看详情
  const handleViewDetail = (id: string) => {
    navigate(`/opportunity/${id}`);
  };

  // 处理编辑
  const handleEdit = (opportunity: Opportunity) => {
    setEditingOpportunity(opportunity);
    form.setFieldsValue(opportunity);
    setEditModalVisible(true);
  };

  // 处理删除
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该商机吗？删除后无法恢复。',
      okText: '确认删除',
      cancelText: '取消',
      okType: 'danger',
      onOk: () => {
        message.success('删除商机成功');
      },
    });
  };

  // 处理卡片点击（看板）
  const handleCardClick = (card: KanbanCard, column: KanbanColumn) => {
    navigate(`/opportunity/${card.id}`);
  };

  // 处理卡片移动（看板）
  const handleCardMove = (cardId: string, fromColumn: string, toColumn: string) => {
    message.success(`商机已从「${stageDisplayNames[fromColumn]}」移动到「${stageDisplayNames[toColumn]}」`);
  };

  // 处理新建商机
  const handleCreate = () => {
    form.resetFields();
    setCreateModalVisible(true);
  };

  // 处理新建提交
  const handleCreateSubmit = (values: any) => {
    console.log('新建商机:', values);
    message.success('新建商机成功');
    setCreateModalVisible(false);
  };

  // 处理编辑提交
  const handleEditSubmit = (values: any) => {
    console.log('编辑商机:', values);
    message.success('编辑商机成功');
    setEditModalVisible(false);
    setEditingOpportunity(null);
  };

  // 处理阶段点击（从漏斗图）
  const handleStageClick = (stage: OpportunityStage) => {
    setFilter({ ...filter, stage });
    message.info(`已筛选阶段：${stageDisplayNames[stage]}`);
  };

  // 筛选字段配置
  const filterFields: FilterItem[] = [
    {
      name: 'name',
      label: '商机名称',
      type: 'text',
      placeholder: '请输入商机名称',
    },
    {
      name: 'customerName',
      label: '客户',
      type: 'text',
      placeholder: '请输入客户名称',
    },
    {
      name: 'stage',
      label: '阶段',
      type: 'select',
      placeholder: '请选择阶段',
      options: stageOptions,
    },
    {
      name: 'ownerName',
      label: '负责人',
      type: 'select',
      placeholder: '请选择负责人',
      options: Array.from(new Set(opportunityData.map(item => item.ownerName))).map(name => ({
        label: name,
        value: name,
      })),
    },
  ];

  // 表格列配置
  const columns: ColumnsType<Opportunity> = [
    {
      title: '商机名称',
      dataIndex: 'name',
      key: 'name',
      width: 180,
      fixed: 'left',
      render: (text, record) => (
        <a onClick={() => handleViewDetail(record.id)}>{text}</a>
      ),
    },
    {
      title: '客户',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 150,
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
      render: (amount: number) => (
        <Text strong style={{ color: colors.primary }}>
          ¥{(amount / 10000).toFixed(0)}万
        </Text>
      ),
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: '阶段',
      dataIndex: 'stage',
      key: 'stage',
      width: 100,
      render: (stage: OpportunityStage) => (
        <Tag color={stageColors[stage]} style={{ margin: 0 }}>
          {stageDisplayNames[stage]}
        </Tag>
      ),
    },
    {
      title: '概率',
      dataIndex: 'probability',
      key: 'probability',
      width: 70,
      render: (prob: number) => `${prob}%`,
    },
    {
      title: '预计成交',
      dataIndex: 'closeDate',
      key: 'closeDate',
      width: 100,
    },
    {
      title: '负责人',
      dataIndex: 'ownerName',
      key: 'ownerName',
      width: 90,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 140,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" onClick={() => handleViewDetail(record.id)}>
            详情
          </Button>
          <Button type="link" size="small" onClick={() => handleEdit(record)}>
            编辑
          </Button>
        </Space>
      ),
    },
  ];

  // 计算统计数据
  const stats = useMemo(() => {
    const total = filteredData.length;
    const totalAmount = filteredData.reduce((sum, opp) => sum + opp.amount, 0);
    return { total, totalAmount };
  }, [filteredData]);

  return (
    <div style={{ padding: 0 }}>
      {/* 页面标题 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
      }}>
        <div>
          <Title level={4} style={{ margin: 0 }}>商机管理</Title>
          <Text type="secondary" style={{ marginLeft: 8 }}>
            共 {stats.total} 个商机 · 预计总金额 ¥{(stats.totalAmount / 10000).toFixed(0)}万
          </Text>
        </div>
        <Space>
          <Button
            icon={<BarChartOutlined />}
            onClick={() => setShowFunnel(!showFunnel)}
          >
            {showFunnel ? '隐藏漏斗' : '显示漏斗'}
          </Button>
          <Segmented
            value={viewMode}
            onChange={(value) => setViewMode(value as 'list' | 'kanban')}
            options={[
              { value: 'list', icon: <UnorderedListOutlined />, label: '列表' },
              { value: 'kanban', icon: <AppstoreOutlined />, label: '看板' },
            ]}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建商机
          </Button>
        </Space>
      </div>

      {/* 销售漏斗 */}
      {showFunnel && (
        <Card style={{ marginBottom: 16 }} styles={{ body: { padding: 16 } }}>
          <SalesFunnel data={funnelStats} onStageClick={handleStageClick} />
        </Card>
      )}

      {/* 筛选栏 */}
      <Card style={{ marginBottom: 16 }} styles={{ body: { padding: '12px 16px' } }}>
        <FilterBar
          filters={filterFields}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
          loading={loading}
          defaultShowCount={3}
        />
      </Card>

      {/* 列表视图 */}
      {viewMode === 'list' && (
        <Card styles={{ body: { padding: 16 } }}>
          <DataTable<Opportunity>
            tableKey="opportunity-list"
            columns={columns}
            dataSource={filteredData}
            loading={loading}
            rowKey="id"
            scroll={{ x: 1100 }}
            pagination={{
              defaultPageSize: 20,
            }}
          />
        </Card>
      )}

      {/* 看板视图 */}
      {viewMode === 'kanban' && (
        <Card styles={{ body: { padding: 16, overflow: 'auto' } }}>
          <KanbanBoard
            columns={kanbanColumns}
            onCardClick={handleCardClick}
            onCardMove={handleCardMove}
            onCardCreate={(columnKey) => {
              form.setFieldValue('stage', columnKey);
              setCreateModalVisible(true);
            }}
            draggable
            showAmountSummary
          />
        </Card>
      )}

      {/* 新建商机弹窗 */}
      <Modal
        title="新建商机"
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onOk={() => form.submit()}
        okText="确定"
        cancelText="取消"
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateSubmit}
          initialValues={{
            stage: OpportunityStage.INITIAL_CONTACT,
            probability: 50,
          }}
        >
          <Form.Item name="name" label="商机名称" rules={[{ required: true }]}>
            <Input placeholder="请输入商机名称" />
          </Form.Item>
          <Form.Item name="customerName" label="所属客户">
            <Input placeholder="请输入客户名称" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="amount" label="商机金额 (元)" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} min={0} placeholder="请输入金额" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="probability" label="成交概率 (%)">
                <InputNumber style={{ width: '100%' }} min={0} max={100} placeholder="请输入概率" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="stage" label="商机阶段" rules={[{ required: true }]}>
            <Select placeholder="请选择商机阶段">
              {Object.entries(stageDisplayNames).map(([key, name]) => (
                <Select.Option key={key} value={key}>{name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={3} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑商机弹窗 */}
      <Modal
        title="编辑商机"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setEditingOpportunity(null);
        }}
        onOk={() => form.submit()}
        okText="确定"
        cancelText="取消"
        width={600}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleEditSubmit}>
          <Form.Item name="name" label="商机名称" rules={[{ required: true }]}>
            <Input placeholder="请输入商机名称" />
          </Form.Item>
          <Form.Item name="customerName" label="所属客户">
            <Input placeholder="请输入客户名称" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="amount" label="商机金额 (元)">
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="probability" label="成交概率 (%)">
                <InputNumber style={{ width: '100%' }} min={0} max={100} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="stage" label="商机阶段">
            <Select placeholder="请选择商机阶段">
              {Object.entries(stageDisplayNames).map(([key, name]) => (
                <Select.Option key={key} value={key}>{name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={3} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OpportunityList;