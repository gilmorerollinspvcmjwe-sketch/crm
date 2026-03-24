import React, { useState, useMemo } from 'react';
import { Card, Space, Button, message, Switch, Typography, Modal, Form, Input, Select, Radio, DatePicker } from 'antd';
import { PlusOutlined, TableOutlined, CalendarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Activity, ActivityType, ActivityFilter, RelatedObjectType } from '../types/activity';
import { activityData, filterActivities } from '../mock/activityData';
import { ActivityTable } from '../components/Opportunity/ActivityTable';
import { SearchFilter } from '../components/Opportunity/SearchFilter';

const { Title } = Typography;

// 日历视图占位组件
const CalendarView: React.FC<{ data: Activity[] }> = ({ data }) => {
  const { t } = useTranslation();
  return (
    <div style={{ padding: 40, textAlign: 'center', background: '#fafafa', borderRadius: 4 }}>
      <CalendarOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
      <Title level={4}>{t('activity.list.calendarView')}</Title>
      <p style={{ color: '#666' }}>
        {t('activity.list.totalRecords', { count: data.length })}
      </p>
      <p style={{ color: '#999', fontSize: 14 }}>
        {t('activity.list.calendarViewDeveloping')}
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
  const { t } = useTranslation();
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
      message.success(t('activity.list.searchComplete'));
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
    message.success(t('activity.list.createSuccess'));
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
    message.success(t('activity.list.editSuccess'));
    setEditModalVisible(false);
    setEditingActivityId(null);
  };

  // 处理删除跟进
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: t('activity.list.confirmDelete'),
      content: t('activity.list.confirmDeleteContent'),
      okText: t('activity.form.confirm'),
      cancelText: t('activity.form.cancel'),
      okType: 'danger',
      onOk: () => {
        message.success(t('activity.list.deleteSuccess'));
      },
    });
  };

  // 跟进类型选项
  const typeOptions = Object.values(ActivityType).map(type => ({
    value: type,
    label: t(`activity.type.${type.toLowerCase()}`)
  }));

  // 对象类型选项
  const objectTypeOptions = Object.values(RelatedObjectType).map(type => ({
    value: type,
    label: t(`activity.relatedObjectType.${type.toLowerCase()}`)
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
            <Title level={3} style={{ margin: 0 }}>{t('activity.list.title')}</Title>
            <p style={{ margin: '8px 0 0', color: '#666' }}>
              {t('activity.list.totalRecords', { count: filteredData.length })}
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
              {t('activity.list.createActivity')}
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
          <span style={{ color: '#666' }}>{t('activity.list.objectType')}：</span>
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
        title={t('activity.form.createTitle')}
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onOk={() => form.submit()}
        okText={t('activity.form.confirm')}
        cancelText={t('activity.form.cancel')}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateSubmit}
        >
          <Form.Item
            name="type"
            label={t('activity.form.type')}
            rules={[{ required: true, message: t('activity.form.typeRequired') }]}
          >
            <Select placeholder={t('activity.form.typePlaceholder')}>
              <Select.Option value={ActivityType.PHONE}>{t('activity.type.phone')}</Select.Option>
              <Select.Option value={ActivityType.MEETING}>{t('activity.type.meeting')}</Select.Option>
              <Select.Option value={ActivityType.VISIT}>{t('activity.type.visit')}</Select.Option>
              <Select.Option value={ActivityType.EMAIL}>{t('activity.type.email')}</Select.Option>
              <Select.Option value={ActivityType.WECHAT}>{t('activity.type.wechat')}</Select.Option>
              <Select.Option value={ActivityType.OTHER}>{t('activity.type.other')}</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="relatedObjectType"
            label={t('activity.form.relatedObjectType')}
            rules={[{ required: true, message: t('activity.form.relatedObjectTypeRequired') }]}
          >
            <Select placeholder={t('activity.form.relatedObjectTypePlaceholder')}>
              <Select.Option value={RelatedObjectType.OPPORTUNITY}>{t('activity.relatedObjectType.opportunity')}</Select.Option>
              <Select.Option value={RelatedObjectType.CUSTOMER}>{t('activity.relatedObjectType.customer')}</Select.Option>
              <Select.Option value={RelatedObjectType.LEAD}>{t('activity.relatedObjectType.lead')}</Select.Option>
              <Select.Option value={RelatedObjectType.CONTACT}>{t('activity.relatedObjectType.contact')}</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="relatedObjectId" label={t('activity.form.relatedObject')}>
            <Input placeholder={t('activity.form.relatedObjectPlaceholder')} />
          </Form.Item>
          <Form.Item
            name="content"
            label={t('activity.form.content')}
            rules={[{ required: true, message: t('activity.form.contentRequired') }]}
          >
            <Input.TextArea rows={4} placeholder={t('activity.form.contentPlaceholder')} />
          </Form.Item>
          <Form.Item name="nextFollowUpTime" label={t('activity.form.nextFollowUpTime')}>
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="remark" label={t('activity.form.remark')}>
            <Input.TextArea rows={2} placeholder={t('activity.form.remarkPlaceholder')} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑跟进弹窗 */}
      <Modal
        title={t('activity.form.editTitle')}
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setEditingActivityId(null);
        }}
        onOk={() => form.submit()}
        okText={t('activity.form.confirm')}
        cancelText={t('activity.form.cancel')}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditSubmit}
        >
          <Form.Item
            name="type"
            label={t('activity.form.type')}
            rules={[{ required: true, message: t('activity.form.typeRequired') }]}
          >
            <Select placeholder={t('activity.form.typePlaceholder')}>
              <Select.Option value={ActivityType.PHONE}>{t('activity.type.phone')}</Select.Option>
              <Select.Option value={ActivityType.MEETING}>{t('activity.type.meeting')}</Select.Option>
              <Select.Option value={ActivityType.VISIT}>{t('activity.type.visit')}</Select.Option>
              <Select.Option value={ActivityType.EMAIL}>{t('activity.type.email')}</Select.Option>
              <Select.Option value={ActivityType.WECHAT}>{t('activity.type.wechat')}</Select.Option>
              <Select.Option value={ActivityType.OTHER}>{t('activity.type.other')}</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="relatedObjectType"
            label={t('activity.form.relatedObjectType')}
            rules={[{ required: true, message: t('activity.form.relatedObjectTypeRequired') }]}
          >
            <Select placeholder={t('activity.form.relatedObjectTypePlaceholder')}>
              <Select.Option value={RelatedObjectType.OPPORTUNITY}>{t('activity.relatedObjectType.opportunity')}</Select.Option>
              <Select.Option value={RelatedObjectType.CUSTOMER}>{t('activity.relatedObjectType.customer')}</Select.Option>
              <Select.Option value={RelatedObjectType.LEAD}>{t('activity.relatedObjectType.lead')}</Select.Option>
              <Select.Option value={RelatedObjectType.CONTACT}>{t('activity.relatedObjectType.contact')}</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="relatedObjectId" label={t('activity.form.relatedObject')}>
            <Input placeholder={t('activity.form.relatedObjectPlaceholder')} />
          </Form.Item>
          <Form.Item
            name="content"
            label={t('activity.form.content')}
            rules={[{ required: true, message: t('activity.form.contentRequired') }]}
          >
            <Input.TextArea rows={4} placeholder={t('activity.form.contentPlaceholder')} />
          </Form.Item>
          <Form.Item name="nextFollowUpTime" label={t('activity.form.nextFollowUpTime')}>
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="remark" label={t('activity.form.remark')}>
            <Input.TextArea rows={2} placeholder={t('activity.form.remarkPlaceholder')} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ActivityList;
