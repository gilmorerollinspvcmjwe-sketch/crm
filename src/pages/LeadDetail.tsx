/**
 * 线索详情页
 * 功能：
 * - 基本信息展示
 * - 跟进记录：时间线展示
 * - 操作按钮：编辑、分配、转化为客户
 */
import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Button, Space, Tag, Timeline, message, Modal, Divider } from 'antd';
import { ArrowLeftOutlined, EditOutlined, UserSwitchOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { getLeadById, getFollowUpRecords } from '../mock/leadData';
import { Lead, LeadStatus, LeadLevel, LeadSource, FollowUpRecord } from '../types/lead';

/**
 * 线索详情页组件
 */
export const LeadDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [lead, setLead] = useState<Lead | null>(null);
  const [followUpRecords, setFollowUpRecords] = useState<FollowUpRecord[]>([]);

  /** 加载线索详情 */
  const loadLeadDetail = () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = getLeadById(id);
      if (data) {
        setLead(data);
        // 加载跟进记录
        const records = getFollowUpRecords(id);
        setFollowUpRecords(records);
      } else {
        message.error('线索不存在');
      }
    } catch (error) {
      message.error('加载线索详情失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /** 初始加载 */
  useEffect(() => {
    loadLeadDetail();
  }, [id]);

  /** 返回列表 */
  const handleBack = () => {
    navigate('/lead/list');
  };

  /** 编辑线索 */
  const handleEdit = () => {
    message.info('编辑线索功能待实现');
  };

  /** 分配线索 */
  const handleAssign = () => {
    message.info('分配线索功能待实现');
  };

  /** 转化线索 */
  const handleConvert = () => {
    if (!lead) return;
    
    Modal.confirm({
      title: '确认转化',
      content: (
        <div>
          <p>确定要将该线索转化为客户吗？</p>
          <p>系统将自动创建：</p>
          <ul>
            <li>客户档案：{lead.companyName || lead.name}</li>
            <li>联系人：{lead.contactName}</li>
            <li>商机：{lead.name}</li>
          </ul>
        </div>
      ),
      onOk: () => {
        message.success('转化成功');
        navigate('/lead/list');
      },
    });
  };

  if (!lead) {
    return <div>线索不存在</div>;
  }

  /** 跟进记录时间线 */
  const renderTimeline = () => {
    if (followUpRecords.length === 0) {
      return (
        <div style={{ padding: 20, textAlign: 'center', color: '#999' }}>
          暂无跟进记录
        </div>
      );
    }

    return (
      <Timeline
        items={followUpRecords.map((record) => ({
          color: record.type === '电话' ? 'blue' : record.type === '拜访' ? 'green' : 'gray',
          children: (
            <div>
              <Space>
                <Tag>{record.type}</Tag>
                <strong>{record.subject}</strong>
              </Space>
              <p style={{ margin: '8px 0', fontSize: 13 }}>{record.content}</p>
              <div style={{ fontSize: 12, color: '#999' }}>
                <span>{record.followUpTime}</span>
                {record.duration && <span style={{ marginLeft: 16 }}>时长：{record.duration}分钟</span>}
                <span style={{ marginLeft: 16 }}> - {record.createdBy}</span>
              </div>
              {record.nextFollowUpTime && (
                <Tag color="orange" style={{ marginTop: 8 }}>
                  下次跟进：{record.nextFollowUpTime}
                </Tag>
              )}
            </div>
          ),
        }))}
      />
    );
  };

  return (
    <div style={{ padding: 24 }}>
      {/* 头部操作栏 */}
      <Card style={{ marginBottom: 16 }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
            返回
          </Button>
          <Space style={{ marginLeft: 'auto' }}>
            <Button icon={<EditOutlined />} onClick={handleEdit} disabled={lead.status === '已转化' || lead.status === '已关闭'}>
              编辑
            </Button>
            <Button icon={<UserSwitchOutlined />} onClick={handleAssign} disabled={lead.status === '已转化' || lead.status === '已关闭'}>
              分配
            </Button>
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={handleConvert}
              disabled={lead.status !== '跟进中'}
            >
              转化为客户
            </Button>
          </Space>
        </Space>
      </Card>

      {/* 基本信息 */}
      <Card title="基本信息" style={{ marginBottom: 16 }} loading={loading}>
        <Descriptions column={3} bordered>
          <Descriptions.Item label="线索 ID" span={1}>
            {lead.id}
          </Descriptions.Item>
          <Descriptions.Item label="线索名称" span={2}>
            {lead.name}
          </Descriptions.Item>
          <Descriptions.Item label="联系人姓名" span={1}>
            {lead.contactName}
          </Descriptions.Item>
          <Descriptions.Item label="联系人职位" span={1}>
            {lead.position || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="手机号码" span={1}>
            {lead.mobile}
          </Descriptions.Item>
          <Descriptions.Item label="邮箱" span={1}>
            {lead.email || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="公司名称" span={1}>
            {lead.companyName || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="所属行业" span={1}>
            {lead.industry || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="公司规模" span={1}>
            {lead.companySize || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="线索来源" span={1}>
            <Tag color="blue">{lead.source}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="来源明细" span={1}>
            {lead.sourceDetail || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="线索状态" span={1}>
            <Tag color={
              lead.status === '待跟进' ? 'default' :
              lead.status === '跟进中' ? 'processing' :
              lead.status === '已转化' ? 'success' : 'error'
            }>
              {lead.status}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="线索评分" span={1}>
            {lead.score !== undefined ? `${lead.score}分` : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="线索等级" span={1}>
            {lead.level ? (
              <Tag color={lead.level === 'A' ? 'red' : lead.level === 'B' ? 'orange' : 'blue'}>
                {lead.level}
              </Tag>
            ) : (
              '-'
            )}
          </Descriptions.Item>
          <Descriptions.Item label="预算范围" span={1}>
            {lead.budget || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="预计采购时间" span={1}>
            {lead.purchaseTimeframe || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="负责人" span={1}>
            {lead.ownerName || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间" span={1}>
            {lead.createdAt}
          </Descriptions.Item>
          <Descriptions.Item label="创建人" span={1}>
            {lead.createdBy}
          </Descriptions.Item>
          <Descriptions.Item label="首次联系时间" span={1}>
            {lead.firstContactTime || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="最后跟进时间" span={1}>
            {lead.lastContactTime || '-'}
          </Descriptions.Item>
          {lead.convertedAt && (
            <>
              <Descriptions.Item label="转化时间" span={1}>
                {lead.convertedAt}
              </Descriptions.Item>
              <Descriptions.Item label="转化客户" span={2}>
                {lead.convertedCustomerName || '-'}
              </Descriptions.Item>
            </>
          )}
          {lead.invalidReason && (
            <Descriptions.Item label="无效原因" span={3}>
              <Tag color="red">{lead.invalidReason}</Tag>
            </Descriptions.Item>
          )}
          <Descriptions.Item label="线索内容" span={3}>
            {lead.content || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="备注" span={3}>
            {lead.remark || '-'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 跟进记录 */}
      <Card title="跟进记录">
        {renderTimeline()}
      </Card>
    </div>
  );
};

export default LeadDetail;
