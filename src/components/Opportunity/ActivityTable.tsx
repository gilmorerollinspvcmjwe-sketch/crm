import React from 'react';
import { Table, Tag, Space, Typography, Tooltip } from 'antd';
import { PhoneOutlined, EnvironmentOutlined, MailOutlined, WechatOutlined, VideoCameraOutlined, FileTextOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { Activity, ActivityType, ActivityMethod, ActivityResult, CustomerInterest } from '../../types/activity';

const { Text, Paragraph } = Typography;

// 跟进表格属性
interface ActivityTableProps {
  // 跟进数据
  data: Activity[];
  // 加载状态
  loading?: boolean;
  // 查看详情回调
  onViewDetail?: (id: string) => void;
  // 编辑回调
  onEdit?: (id: string) => void;
  // 删除回调
  onDelete?: (id: string) => void;
}

/**
 * 跟进记录表格组件
 * 展示跟进记录列表
 */
export const ActivityTable: React.FC<ActivityTableProps> = ({ data, loading = false }) => {
  const { t } = useTranslation();

  // 跟进类型图标映射
  const ACTIVITY_TYPE_ICONS: Record<ActivityType, React.ReactNode> = {
    [ActivityType.PHONE]: <PhoneOutlined />,
    [ActivityType.VISIT]: <EnvironmentOutlined />,
    [ActivityType.EMAIL]: <MailOutlined />,
    [ActivityType.WECHAT]: <WechatOutlined />,
    [ActivityType.MEETING]: <VideoCameraOutlined />,
    [ActivityType.OTHER]: <FileTextOutlined />
  };

  // 跟进类型颜色配置
  const ACTIVITY_TYPE_COLORS: Record<ActivityType, string> = {
    [ActivityType.PHONE]: 'blue',
    [ActivityType.VISIT]: 'green',
    [ActivityType.EMAIL]: 'cyan',
    [ActivityType.WECHAT]: 'lime',
    [ActivityType.MEETING]: 'purple',
    [ActivityType.OTHER]: 'default'
  };

  // 跟进结果颜色配置
  const RESULT_COLORS: Record<ActivityResult, string> = {
    [ActivityResult.PROGRESS]: 'green',
    [ActivityResult.NO_PROGRESS]: 'red',
    [ActivityResult.NEED_FOLLOWUP]: 'orange'
  };

  // 意向度颜色配置
  const INTEREST_COLORS: Record<CustomerInterest, string> = {
    [CustomerInterest.HIGH]: 'red',
    [CustomerInterest.MEDIUM]: 'orange',
    [CustomerInterest.LOW]: 'default'
  };

  // 格式化日期时间
  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 去除 HTML 标签
  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '').substring(0, 100) + (html.length > 100 ? '...' : '');
  };

  // 表格列定义
  const columns = [
    {
      title: t('activity.column.object'),
      dataIndex: 'relatedObjectName',
      key: 'relatedObjectName',
      width: 200,
      render: (_: any, record: Activity) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.relatedObjectName}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.contactNames.join(', ')}
          </Text>
        </Space>
      )
    },
    {
      title: t('activity.column.type'),
      dataIndex: 'type',
      key: 'type',
      width: 100,
      filters: Object.values(ActivityType).map(type => ({
        text: type,
        value: type
      })),
      onFilter: (value: any, record: Activity) => record.type === value,
      render: (type: ActivityType) => (
        <Tag icon={ACTIVITY_TYPE_ICONS[type]} color={ACTIVITY_TYPE_COLORS[type]}>
          {type}
        </Tag>
      )
    },
    {
      title: t('activity.column.content'),
      dataIndex: 'content',
      key: 'content',
      width: 300,
      ellipsis: true,
      render: (content: string) => (
        <Tooltip title={<div dangerouslySetInnerHTML={{ __html: content }} />}>
          <Text type="secondary">{stripHtml(content)}</Text>
        </Tooltip>
      )
    },
    {
      title: t('activity.column.method'),
      dataIndex: 'method',
      key: 'method',
      width: 80,
      render: (method?: ActivityMethod) => method || '-'
    },
    {
      title: t('activity.column.owner'),
      dataIndex: 'createdByName',
      key: 'createdByName',
      width: 100,
      filters: Array.from(new Set(data.map(item => item.createdByName))).map(name => ({
        text: name,
        value: name
      })),
      onFilter: (value: any, record: Activity) => record.createdByName === value
    },
    {
      title: t('activity.column.time'),
      dataIndex: 'activityTime',
      key: 'activityTime',
      width: 160,
      sorter: (a: Activity, b: Activity) =>
        new Date(a.activityTime).getTime() - new Date(b.activityTime).getTime(),
      render: (time: string) => formatDateTime(time)
    },
    {
      title: t('activity.column.nextFollowup'),
      dataIndex: 'nextFollowupTime',
      key: 'nextFollowupTime',
      width: 160,
      sorter: (a: Activity, b: Activity) => {
        if (!a.nextFollowupTime) return 1;
        if (!b.nextFollowupTime) return -1;
        return new Date(a.nextFollowupTime!).getTime() - new Date(b.nextFollowupTime!).getTime();
      },
      render: (time?: string) => time ? formatDateTime(time) : '-'
    },
    {
      title: t('activity.column.result'),
      dataIndex: 'result',
      key: 'result',
      width: 90,
      render: (result?: ActivityResult) => (
        result ? <Tag color={RESULT_COLORS[result]}>{result}</Tag> : '-'
      )
    },
    {
      title: t('activity.column.interest'),
      dataIndex: 'interestLevel',
      key: 'interestLevel',
      width: 90,
      render: (level?: CustomerInterest) => (
        level ? <Tag color={INTEREST_COLORS[level]}>{level}</Tag> : '-'
      )
    },
    {
      title: t('activity.column.attachments'),
      key: 'attachments',
      width: 60,
      render: (_: any, record: Activity) => {
        const count = (record.attachments?.length || 0) + (record.photos?.length || 0) + (record.recordings?.length || 0);
        return count > 0 ? <Tag color="blue">{count}</Tag> : '-';
      }
    }
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={loading}
      scroll={{ x: 1400 }}
      pagination={{
        pageSize: 20,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => t('activity.pagination.total', { count: total }),
        pageSizeOptions: ['10', '20', '50', '100']
      }}
      size="middle"
    />
  );
};

export default ActivityTable;