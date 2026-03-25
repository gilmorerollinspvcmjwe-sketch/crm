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
import { useTranslation } from 'react-i18next';
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

/** 获取阶段显示名称 */
const getStageDisplayNames = (t: (key: string) => string): Record<string, string> => ({
  [OpportunityStage.LEAD_CONFIRMATION]: t('opportunity.stage.leadConfirmation'),
  [OpportunityStage.INITIAL_CONTACT]: t('opportunity.stage.initialContact'),
  [OpportunityStage.REQUIREMENT_CONFIRMATION]: t('opportunity.stage.requirementConfirmation'),
  [OpportunityStage.PROPOSAL_QUOTATION]: t('opportunity.stage.proposalQuotation'),
  [OpportunityStage.NEGOTIATION_APPROVAL]: t('opportunity.stage.negotiationApproval'),
  [OpportunityStage.CLOSED_WON]: t('opportunity.stage.closedWon'),
  [OpportunityStage.CLOSED_LOST]: t('opportunity.stage.closedLost'),
});

/**
 * 商机列表页组件
 */
export const OpportunityList: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<OpportunityFilter>({});
  const [showFunnel, setShowFunnel] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);
  const [form] = Form.useForm();

  const stageDisplayNames = getStageDisplayNames(t);
  const stageOptions = Object.values(OpportunityStage).map(stage => ({
    value: stage,
    label: stageDisplayNames[stage],
  }));

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
      title: t('opportunity.list.confirmDelete'),
      content: t('opportunity.list.confirmDeleteContent'),
      okText: t('opportunity.form.confirm'),
      cancelText: t('opportunity.form.cancel'),
      okType: 'danger',
      onOk: () => {
        message.success(t('opportunity.list.deleteSuccess'));
      },
    });
  };

  // 处理卡片点击（看板）
  const handleCardClick = (card: KanbanCard, column: KanbanColumn) => {
    navigate(`/opportunity/${card.id}`);
  };

  // 处理卡片移动（看板）
  const handleCardMove = (cardId: string, fromColumn: string, toColumn: string) => {
    message.success(t('opportunity.list.moveSuccess', { from: stageDisplayNames[fromColumn], to: stageDisplayNames[toColumn] }));
  };

  // 处理新建商机
  const handleCreate = () => {
    form.resetFields();
    setCreateModalVisible(true);
  };

  // 处理新建提交
  const handleCreateSubmit = (values: any) => {
    console.log('新建商机:', values);
    message.success(t('opportunity.list.createSuccess'));
    setCreateModalVisible(false);
  };

  // 处理编辑提交
  const handleEditSubmit = (values: any) => {
    console.log('编辑商机:', values);
    message.success(t('opportunity.list.editSuccess'));
    setEditModalVisible(false);
    setEditingOpportunity(null);
  };

  // 处理阶段点击（从漏斗图）
  const handleStageClick = (stage: OpportunityStage) => {
    setFilter({ ...filter, stage });
    message.info(t('opportunity.list.filterStage', { stage: stageDisplayNames[stage] }));
  };

  // 筛选字段配置
  const filterFields: FilterItem[] = [
    {
      name: 'name',
      label: t('opportunity.filter.name'),
      type: 'text',
      placeholder: t('opportunity.filter.namePlaceholder'),
    },
    {
      name: 'customerName',
      label: t('opportunity.filter.customer'),
      type: 'text',
      placeholder: t('opportunity.filter.customerPlaceholder'),
    },
    {
      name: 'stage',
      label: t('opportunity.filter.stage'),
      type: 'select',
      placeholder: t('opportunity.filter.stagePlaceholder'),
      options: stageOptions,
    },
    {
      name: 'ownerName',
      label: t('opportunity.filter.owner'),
      type: 'select',
      placeholder: t('opportunity.filter.ownerPlaceholder'),
      options: Array.from(new Set(opportunityData.map(item => item.ownerName))).map(name => ({
        label: name,
        value: name,
      })),
    },
  ];

  // 表格列配置
  const columns: ColumnsType<Opportunity> = [
    {
      title: t('opportunity.table.name'),
      dataIndex: 'name',
      key: 'name',
      width: 180,
      fixed: 'left',
      render: (text, record) => (
        <a onClick={() => handleViewDetail(record.id)}>{text}</a>
      ),
    },
    {
      title: t('opportunity.table.customer'),
      dataIndex: 'customerName',
      key: 'customerName',
      width: 150,
    },
    {
      title: t('opportunity.table.amount'),
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
      render: (amount: number) => (
        <Text strong style={{ color: colors.primary }}>
          ¥{(amount / 10000).toFixed(0)}{t('opportunity.table.tenThousand')}
        </Text>
      ),
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: t('opportunity.table.stage'),
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
      title: t('opportunity.table.probability'),
      dataIndex: 'probability',
      key: 'probability',
      width: 70,
      render: (prob: number) => `${prob}%`,
    },
    {
      title: t('opportunity.table.closeDate'),
      dataIndex: 'closeDate',
      key: 'closeDate',
      width: 100,
    },
    {
      title: t('opportunity.table.owner'),
      dataIndex: 'ownerName',
      key: 'ownerName',
      width: 90,
    },
    {
      title: t('opportunity.table.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 140,
    },
    {
      title: t('opportunity.table.actions'),
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" onClick={() => handleViewDetail(record.id)}>
            {t('opportunity.table.viewDetail')}
          </Button>
          <Button type="link" size="small" onClick={() => handleEdit(record)}>
            {t('opportunity.table.edit')}
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
          <Title level={4} style={{ margin: 0 }}>{t('opportunity.list.title')}</Title>
          <Text type="secondary" style={{ marginLeft: 8 }}>
            {t('opportunity.list.totalOpportunities', { count: stats.total })} · {t('opportunity.list.totalAmount', { amount: (stats.totalAmount / 10000).toFixed(0) })}
          </Text>
        </div>
        <Space>
          <Button
            icon={<BarChartOutlined />}
            onClick={() => setShowFunnel(!showFunnel)}
          >
            {showFunnel ? t('opportunity.list.hideFunnel') : t('opportunity.list.showFunnel')}
          </Button>
          <Segmented
            value={viewMode}
            onChange={(value) => setViewMode(value as 'list' | 'kanban')}
            options={[
              { value: 'list', icon: <UnorderedListOutlined />, label: t('opportunity.list.createView') },
              { value: 'kanban', icon: <AppstoreOutlined />, label: t('opportunity.list.kanbanView') },
            ]}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            {t('opportunity.list.createOpportunity')}
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
        title={t('opportunity.form.createTitle')}
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onOk={() => form.submit()}
        okText={t('opportunity.form.confirm')}
        cancelText={t('opportunity.form.cancel')}
        width={600}
        destroyOnHidden
        forceRender
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
          <Form.Item name="name" label={t('opportunity.form.name')} rules={[{ required: true }]}>
            <Input placeholder={t('opportunity.form.namePlaceholder')} />
          </Form.Item>
          <Form.Item name="customerName" label={t('opportunity.form.customer')}>
            <Input placeholder={t('opportunity.form.customerPlaceholder')} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="amount" label={t('opportunity.form.amount')} rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} min={0} placeholder={t('opportunity.form.amountPlaceholder')} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="probability" label={t('opportunity.form.probability')}>
                <InputNumber style={{ width: '100%' }} min={0} max={100} placeholder={t('opportunity.form.probabilityPlaceholder')} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="stage" label={t('opportunity.form.stage')} rules={[{ required: true }]}>
            <Select placeholder={t('opportunity.form.stagePlaceholder')}>
              {Object.entries(stageDisplayNames).map(([key, name]) => (
                <Select.Option key={key} value={key}>{name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="remark" label={t('opportunity.form.remark')}>
            <Input.TextArea rows={3} placeholder={t('opportunity.form.remarkPlaceholder')} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑商机弹窗 */}
      <Modal
        title={t('opportunity.form.editTitle')}
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setEditingOpportunity(null);
        }}
        onOk={() => form.submit()}
        okText={t('opportunity.form.confirm')}
        cancelText={t('opportunity.form.cancel')}
        width={600}
        destroyOnHidden
        forceRender
      >
        <Form form={form} layout="vertical" onFinish={handleEditSubmit}>
          <Form.Item name="name" label={t('opportunity.form.name')} rules={[{ required: true }]}>
            <Input placeholder={t('opportunity.form.namePlaceholder')} />
          </Form.Item>
          <Form.Item name="customerName" label={t('opportunity.form.customer')}>
            <Input placeholder={t('opportunity.form.customerPlaceholder')} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="amount" label={t('opportunity.form.amount')}>
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="probability" label={t('opportunity.form.probability')}>
                <InputNumber style={{ width: '100%' }} min={0} max={100} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="stage" label={t('opportunity.form.stage')}>
            <Select placeholder={t('opportunity.form.stagePlaceholder')}>
              {Object.entries(stageDisplayNames).map(([key, name]) => (
                <Select.Option key={key} value={key}>{name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="remark" label={t('opportunity.form.remark')}>
            <Input.TextArea rows={3} placeholder={t('opportunity.form.remarkPlaceholder')} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OpportunityList;