import React, { useState, useMemo } from 'react';
import { Card, Space, Button, message, Switch, Typography, Modal, Form, Input, Select, Radio, DatePicker } from 'antd';
import { PlusOutlined, TableOutlined, CalendarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Activity, ActivityType, ActivityFilter, RelatedObjectType } from '../types/activity';
import { activityData, filterActivities } from '../mock/activityData';
import { ActivityTable } from '../components/Opportunity/ActivityTable';
import { SearchFilter } from '../components/Opportunity/SearchFilter';

const { Title } = Typography;

// 日历视图占位组件
const CalendarView: React.FC<{ data: Activity[] }> = ({ data }) => {
  return (
    <div style={{ padding: 40, textAlign: 'center', background: '#fafafa', borderRadius: 4 }}>
      <CalendarOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
      <Title level={4}>日历视图</Title>
      <p style={{ color: '#666' }}>
        当前共有 {data.length} 条跟进记录
      </p>
      <p style={{ color: '#999', fontSize: 14 }}>
        （日历视图功能开发中...）
      </p>
    </div>
  );
};

/**
 * 跟进记录列表页
 * 功能：
 * - 表格展示跟进记录
 * - 筛选：按对象类型、跟进类型、跟进人
 * - 视图切换：列表视图/日历视图
 */
export const ActivityList: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<ActivityFilter>({});
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);
  const [form] = Form.useForm();

  // 筛选后的跟进数据
  const filteredData = useMemo(() => {
    return filterActivities(activityData, filter);
  }, [filter]);

  // 处理搜索
  const handleSearch = (values: ActivityFilter) => {
    setLoading(true);
    setFilter(values);
    // 模拟异步加载
    setTimeout(() => {
      setLoading(false);
      message.success('搜索完成');
    }, 500);
  };

  // 处理重置
  const handleReset = () => {
    setFilter({});
  };

  // 处理新建跟进
  const handleNewActivity = () => {
    form.resetFields();
    setCreateModalVisible(true);
  };

  // 处理新建提交
  const handleCreateSubmit = (values: any) => {
    console.log('新建跟进:', values);
    message.success('新建跟进记录成功');
    setCreateModalVisible(false);
  };

  // 处理编辑跟进
  const handleEdit = (id: string) => {
    setEditingActivityId(id);
    setEditModalVisible(true);
  };

  // 处理编辑提交
  const handleEditSubmit = (values: any) => {
    console.log('编辑跟进:', values);
    message.success('编辑跟进记录成功');
    setEditModalVisible(false);
    setEditingActivityId(null);
  };

  // 处理删除跟进
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该跟进记录吗？删除后无法恢复。',
      okText: '确认删除',
      cancelText: '取消',
      okType: 'danger',
      onOk: () => {
        message.success('删除跟进记录成功');
      },
    });
  };

  // 跟进类型选项
  const typeOptions = Object.values(ActivityType).map(type => ({
    value: type,
    label: type
  }));

  // 对象类型选项
  const objectTypeOptions = Object.values(RelatedObjectType).map(type => ({
    value: type,
    label: type
  }));

  // 跟进人选项
  const ownerOptions = Array.from(new Set(activityData.map(item => item.createdByName))).map(name => ({
    value: name,
    label: name
  }));

  return (
    <div style={{ padding: 24 }}>
      {/* 头部操作区 */}
      <Card style={{ marginBottom: 16 }}>
        <Space style={{ justifyContent: 'space-between', width: '100%', display: 'flex' }}>
          <div>
            <Title level={3} style={{ margin: 0 }}>跟进记录</Title>
            <p style={{ margin: '8px 0 0', color: '#666' }}>
              当前共 {filteredData.length} 条跟进记录
            </p>
          </div>
          <Space>
            <Space style={{ marginRight: 16 }}>
              <TableOutlined />
              <Switch
                checked={viewMode === 'calendar'}
                onChange={(checked) => setViewMode(checked ? 'calendar' : 'list')}
                checkedChildren={<CalendarOutlined />}
                unCheckedChildren={<TableOutlined />}
              />
              <CalendarOutlined />
            </Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleNewActivity}>
              新建跟进
            </Button>
          </Space>
        </Space>
      </Card>

      {/* 搜索筛选区 */}
      <Card style={{ marginBottom: 16 }}>
        <SearchFilter
          filters={{ type: true, owner: true }}
          typeOptions={typeOptions}
          ownerOptions={ownerOptions}
          onSearch={handleSearch}
          onReset={handleReset}
          loading={loading}
        />
        {/* 额外的对象类型筛选 */}
        <Space style={{ marginTop: 8, flexWrap: 'wrap' }}>
          <span style={{ color: '#666' }}>对象类型：</span>
          {objectTypeOptions.map(option => (
            <Button
              key={option.value}
              type={filter.relatedObjectType === option.value ? 'primary' : 'default'}
              size="small"
              onClick={() => {
                const newFilter = {
                  ...filter,
                  relatedObjectType: filter.relatedObjectType === option.value ? undefined : option.value
                };
                setFilter(newFilter);
              }}
            >
              {option.label}
            </Button>
          ))}
        </Space>
      </Card>

      {/* 跟进记录展示区 */}
      <Card>
        {viewMode === 'list' ? (
          <ActivityTable 
            data={filteredData} 
            loading={loading}
            onViewDetail={(id: string) => navigate(`/activity/${id}`)}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <CalendarView data={filteredData} />
        )}
      </Card>

      {/* 新建跟进弹窗 */}
      <Modal
        title="新建跟进记录"
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onOk={() => form.submit()}
        okText="确定"
        cancelText="取消"
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateSubmit}
        >
          <Form.Item
            name="type"
            label="跟进类型"
            rules={[{ required: true, message: '请选择跟进类型' }]}
          >
            <Select placeholder="请选择跟进类型">
              <Select.Option value={ActivityType.PHONE}>电话</Select.Option>
              <Select.Option value={ActivityType.MEETING}>会议</Select.Option>
              <Select.Option value={ActivityType.VISIT}>拜访</Select.Option>
              <Select.Option value={ActivityType.EMAIL}>邮件</Select.Option>
              <Select.Option value={ActivityType.WECHAT}>微信</Select.Option>
              <Select.Option value={ActivityType.OTHER}>其他</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="relatedObjectType"
            label="关联对象类型"
            rules={[{ required: true, message: '请选择关联对象' }]}
          >
            <Select placeholder="请选择关联对象类型">
              <Select.Option value={RelatedObjectType.OPPORTUNITY}>商机</Select.Option>
              <Select.Option value={RelatedObjectType.CUSTOMER}>客户</Select.Option>
              <Select.Option value={RelatedObjectType.LEAD}>线索</Select.Option>
              <Select.Option value={RelatedObjectType.CONTACT}>联系人</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="relatedObjectId" label="关联对象">
            <Input placeholder="请输入关联对象名称" />
          </Form.Item>
          <Form.Item
            name="content"
            label="跟进内容"
            rules={[{ required: true, message: '请输入跟进内容' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入跟进内容" />
          </Form.Item>
          <Form.Item name="nextFollowUpTime" label="下次跟进时间">
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={2} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑跟进弹窗 */}
      <Modal
        title="编辑跟进记录"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setEditingActivityId(null);
        }}
        onOk={() => form.submit()}
        okText="确定"
        cancelText="取消"
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditSubmit}
        >
          <Form.Item
            name="type"
            label="跟进类型"
            rules={[{ required: true, message: '请选择跟进类型' }]}
          >
            <Select placeholder="请选择跟进类型">
              <Select.Option value={ActivityType.PHONE}>电话</Select.Option>
              <Select.Option value={ActivityType.MEETING}>会议</Select.Option>
              <Select.Option value={ActivityType.VISIT}>拜访</Select.Option>
              <Select.Option value={ActivityType.EMAIL}>邮件</Select.Option>
              <Select.Option value={ActivityType.WECHAT}>微信</Select.Option>
              <Select.Option value={ActivityType.OTHER}>其他</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="relatedObjectType"
            label="关联对象类型"
            rules={[{ required: true, message: '请选择关联对象' }]}
          >
            <Select placeholder="请选择关联对象类型">
              <Select.Option value={RelatedObjectType.OPPORTUNITY}>商机</Select.Option>
              <Select.Option value={RelatedObjectType.CUSTOMER}>客户</Select.Option>
              <Select.Option value={RelatedObjectType.LEAD}>线索</Select.Option>
              <Select.Option value={RelatedObjectType.CONTACT}>联系人</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="relatedObjectId" label="关联对象">
            <Input placeholder="请输入关联对象名称" />
          </Form.Item>
          <Form.Item
            name="content"
            label="跟进内容"
            rules={[{ required: true, message: '请输入跟进内容' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入跟进内容" />
          </Form.Item>
          <Form.Item name="nextFollowUpTime" label="下次跟进时间">
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={2} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ActivityList;
