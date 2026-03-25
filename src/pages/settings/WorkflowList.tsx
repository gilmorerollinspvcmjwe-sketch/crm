/**
 * 工作流列表组件
 * 全局工作流管理页面，支持跨对象自动化
 */
import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Button,
  Space,
  Tag,
  Typography,
  Empty,
  Dropdown,
  Modal,
  message,
  Tooltip,
  Statistic,
  Row,
  Col,
  Input,
  Select,
  Menu,
} from 'antd';
import {
  PlusOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  HistoryOutlined,
  ThunderboltOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  CalendarOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';
import { useWorkflowsStore } from '../../store/workflows';
import { useCustomObjectsStore } from '../../store/customObjects';
import { Workflow, WorkflowStatus, TriggerType } from '../../types/workflow';
import { triggerTypeOptions } from '../../mock/workflowData';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

const { Title, Text } = Typography;
const { Search } = Input;

// 触发器图标映射
const triggerIconMap: Record<TriggerType, React.ReactNode> = {
  record_created: <PlusOutlined />,
  record_updated: <EditOutlined />,
  field_changed: <ThunderboltOutlined />,
  stage_changed: <ThunderboltOutlined />,
  scheduled: <ClockCircleOutlined />,
  no_activity: <ClockCircleOutlined />,
  date_reached: <CalendarOutlined />,
  manual: <PlayCircleOutlined />,
};

// 工作流状态标签颜色
const statusColorMap: Record<WorkflowStatus, string> = {
  active: 'success',
  inactive: 'default',
  draft: 'warning',
};

const WorkflowList: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const { 
    workflows, 
    deleteWorkflow, 
    activateWorkflow, 
    deactivateWorkflow 
  } = useWorkflowsStore();
  
  const { objects, loadObjects } = useCustomObjectsStore();
  
  // 筛选状态
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterTrigger, setFilterTrigger] = useState<string>('all');
  const [filterObject, setFilterObject] = useState<string>('all');
  const [searchText, setSearchText] = useState('');
  
  // 加载对象列表
  useEffect(() => {
    loadObjects();
  }, [loadObjects]);
  
  // 获取对象名称
  const getObjectName = (objectId: string) => {
    const obj = objects.find(o => o.id === objectId || o.name === objectId);
    return obj?.pluralName || obj?.name || objectId;
  };
  
  // 筛选后的工作流
  const filteredWorkflows = useMemo(() => {
    return workflows.filter(wf => {
      // 状态筛选
      if (filterStatus !== 'all' && wf.status !== filterStatus) return false;
      // 触发器类型筛选
      if (filterTrigger !== 'all' && wf.trigger.type !== filterTrigger) return false;
      // 对象筛选
      if (filterObject !== 'all' && wf.objectId !== filterObject) return false;
      // 搜索
      if (searchText && !wf.name.toLowerCase().includes(searchText.toLowerCase())) return false;
      return true;
    });
  }, [workflows, filterStatus, filterTrigger, filterObject, searchText]);
  
  // 获取触发器标签
  const getTriggerLabel = (type: TriggerType) => {
    const option = triggerTypeOptions.find(opt => opt.value === type);
    return option?.label || type;
  };
  
  // 创建新工作流
  const handleCreateWorkflow = () => {
    navigate('/automation/workflows/new');
  };
  
  // 编辑工作流
  const handleEditWorkflow = (workflowId: string) => {
    navigate(`/automation/workflows/${workflowId}/edit`);
  };
  
  // 查看执行日志
  const handleViewLogs = (workflowId: string) => {
    navigate(`/automation/workflows/${workflowId}/logs`);
  };
  
  // 删除工作流
  const handleDeleteWorkflow = (workflowId: string) => {
    deleteWorkflow(workflowId);
    message.success(t('common.deleteSuccess', 'Deleted successfully'));
  };
  
  // 切换状态
  const handleToggleStatus = (workflow: Workflow) => {
    if (workflow.status === 'active') {
      deactivateWorkflow(workflow.id);
      message.success(t('workflow.messages.deactivated', 'Workflow deactivated'));
    } else {
      activateWorkflow(workflow.id);
      message.success(t('workflow.messages.activated', 'Workflow activated'));
    }
  };
  
  // 渲染操作菜单
  const renderActionMenu = (workflow: Workflow) => {
    const items = [
      {
        key: 'edit',
        icon: <EditOutlined />,
        label: t('common.edit', 'Edit'),
        onClick: () => handleEditWorkflow(workflow.id),
      },
      {
        key: 'logs',
        icon: <HistoryOutlined />,
        label: t('workflow.logs.title', 'Execution Logs'),
        onClick: () => handleViewLogs(workflow.id),
      },
      { type: 'divider' as const },
      {
        key: 'toggle',
        icon: workflow.status === 'active' ? <PauseCircleOutlined /> : <PlayCircleOutlined />,
        label: workflow.status === 'active' 
          ? t('workflow.actions.deactivate', 'Deactivate')
          : t('workflow.actions.activate', 'Activate'),
        onClick: () => handleToggleStatus(workflow),
        disabled: workflow.status === 'draft',
      },
      { type: 'divider' as const },
      {
        key: 'delete',
        icon: <DeleteOutlined />,
        label: t('common.delete', 'Delete'),
        danger: true,
        onClick: () => {
          Modal.confirm({
            title: t('workflow.deleteConfirm.title', 'Delete Workflow'),
            content: t('workflow.deleteConfirm.content', 'Are you sure you want to delete this workflow? This action cannot be undone.'),
            okText: t('common.delete', 'Delete'),
            okButtonProps: { danger: true },
            cancelText: t('common.cancel', 'Cancel'),
            onOk: () => handleDeleteWorkflow(workflow.id),
          });
        },
      },
    ];
    
    return items;
  };
  
  return (
    <div style={{ padding: 0 }}>
      <Title level={4} style={{ marginBottom: 16 }}>
        <ThunderboltOutlined style={{ marginRight: 8 }} />
        {t('workflow.title', 'Automation Rules')}
      </Title>
      
      {/* 统计概览 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title={t('workflow.stats.total', 'Total Workflows')}
              value={workflows.length}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title={t('workflow.stats.active', 'Active')}
              value={workflows.filter(w => w.status === 'active').length}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title={t('workflow.stats.inactive', 'Inactive')}
              value={workflows.filter(w => w.status === 'inactive').length}
              valueStyle={{ color: '#8c8c8c' }}
              prefix={<PauseCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title={t('workflow.stats.draft', 'Draft')}
              value={workflows.filter(w => w.status === 'draft').length}
              valueStyle={{ color: '#faad14' }}
              prefix={<EditOutlined />}
            />
          </Card>
        </Col>
      </Row>
      
      {/* 筛选工具栏 */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <Space size="middle" wrap>
          <Search
            placeholder={t('workflow.searchPlaceholder', 'Search workflows...')}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 250 }}
            allowClear
          />
          <Select
            value={filterObject}
            onChange={setFilterObject}
            style={{ width: 180 }}
            options={[
              { value: 'all', label: t('workflow.filters.allObjects', 'All Objects') },
              ...objects.map(obj => ({ value: obj.id, label: obj.pluralName || obj.name })),
            ]}
          />
          <Select
            value={filterStatus}
            onChange={setFilterStatus}
            style={{ width: 150 }}
            options={[
              { value: 'all', label: t('workflow.filters.allStatus', 'All Status') },
              { value: 'active', label: t('workflow.status.active', 'Active') },
              { value: 'inactive', label: t('workflow.status.inactive', 'Inactive') },
              { value: 'draft', label: t('workflow.status.draft', 'Draft') },
            ]}
          />
          <Select
            value={filterTrigger}
            onChange={setFilterTrigger}
            style={{ width: 180 }}
            options={[
              { value: 'all', label: t('workflow.filters.allTriggers', 'All Triggers') },
              ...triggerTypeOptions.map(opt => ({ value: opt.value, label: opt.label })),
            ]}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateWorkflow}>
            {t('workflow.create', 'Create Workflow')}
          </Button>
        </Space>
      </Card>
      
      {/* 工作流卡片列表 */}
      {workflows.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={t('workflow.empty', 'No workflows yet')}
          style={{ padding: '40px 0' }}
        >
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateWorkflow}>
            {t('workflow.create', 'Create Workflow')}
          </Button>
        </Empty>
      ) : (
        <Row gutter={[16, 16]}>
          {filteredWorkflows.map(workflow => (
            <Col key={workflow.id} xs={24} sm={24} md={12} lg={12} xl={8}>
              <Card
                hoverable
                size="small"
                styles={{
                  body: { padding: 16 },
                }}
                onClick={() => handleEditWorkflow(workflow.id)}
              >
                {/* 卡片头部 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <Text strong style={{ fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {workflow.name}
                      </Text>
                      <Tag color={statusColorMap[workflow.status]}>
                        {t(`workflow.status.${workflow.status}`, workflow.status)}
                      </Tag>
                    </div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {workflow.description || t('workflow.noDescription', 'No description')}
                    </Text>
                  </div>
                  <Dropdown
                    menu={{ items: renderActionMenu(workflow) }}
                    trigger={['click']}
                  >
                    <Button type="text" icon={<MoreOutlined />} size="small" onClick={(e) => e.stopPropagation()} />
                  </Dropdown>
                </div>
                
                {/* 触发对象和触发器信息 */}
                <div style={{ marginBottom: 12 }}>
                  <Space size={8}>
                    <Tag icon={<DatabaseOutlined />} color="purple">
                      {getObjectName(workflow.objectId)}
                    </Tag>
                    <Tag icon={triggerIconMap[workflow.trigger.type]} color="blue">
                      {getTriggerLabel(workflow.trigger.type)}
                    </Tag>
                  </Space>
                </div>
                
                {/* 统计数据 */}
                <Row gutter={16}>
                  <Col span={8}>
                    <Statistic
                      title={t('workflow.runCount', 'Runs')}
                      value={workflow.runCount}
                      valueStyle={{ fontSize: 16 }}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title={t('workflow.successRate', 'Success')}
                      value={workflow.runCount > 0 
                        ? Math.round((workflow.successCount / workflow.runCount) * 100) 
                        : 0}
                      suffix="%"
                      valueStyle={{ fontSize: 16, color: '#52c41a' }}
                    />
                  </Col>
                  <Col span={8}>
                    <Tooltip title={workflow.lastRunAt ? dayjs(workflow.lastRunAt).format('YYYY-MM-DD HH:mm:ss') : '-'}>
                      <Statistic
                        title={t('workflow.lastRun', 'Last Run')}
                        value={workflow.lastRunAt ? dayjs(workflow.lastRunAt).fromNow() : '-'}
                        valueStyle={{ fontSize: 14 }}
                      />
                    </Tooltip>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      
      {filteredWorkflows.length === 0 && workflows.length > 0 && (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={t('workflow.noResults', 'No workflows match your filters')}
          style={{ padding: '40px 0' }}
        />
      )}
    </div>
  );
};

export default WorkflowList;