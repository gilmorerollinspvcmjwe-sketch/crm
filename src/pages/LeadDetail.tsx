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
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { getLeadById, getFollowUpRecords } from '../mock/leadData';
import { Lead, LeadStatus, LeadLevel, LeadSource, FollowUpRecord } from '../types/lead';

/**
 * 线索详情页组件
 */
export const LeadDetail: React.FC = () => {
  const { t } = useTranslation();
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
        message.error(t('lead.detail.notFound'));
      }
    } catch (error) {
      message.error(t('lead.detail.loadFailed'));
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
    message.info(t('lead.detail.editInfo'));
  };

  /** 分配线索 */
  const handleAssign = () => {
    message.info(t('lead.detail.assignInfo'));
  };

  /** 转化线索 */
  const handleConvert = () => {
    if (!lead) return;
    
    Modal.confirm({
      title: t('lead.detail.confirmConvert'),
      content: (
        <div>
          <p>{t('lead.detail.convertContent')}</p>
          <p>{t('lead.detail.convertWillCreate')}</p>
          <ul>
            <li>{t('lead.detail.convertCustomerFile')}：{lead.companyName || lead.name}</li>
            <li>{t('lead.detail.convertContact')}：{lead.contactName}</li>
            <li>{t('lead.detail.convertOpportunity')}：{lead.name}</li>
          </ul>
        </div>
      ),
      onOk: () => {
        message.success(t('lead.list.convertSuccess'));
        navigate('/lead/list');
      },
    });
  };

  if (!lead) {
    return <div>{t('lead.detail.notFound')}</div>;
  }

  /** 跟进记录时间线 */
  const renderTimeline = () => {
    if (followUpRecords.length === 0) {
      return (
        <div style={{ padding: 20, textAlign: 'center', color: '#999' }}>
          {t('lead.detail.noFollowUpRecords')}
        </div>
      );
    }

    return (
      <Timeline
        items={followUpRecords.map((record) => ({
          color: record.type === t('activity.type.phone') ? 'blue' : record.type === t('activity.type.visit') ? 'green' : 'gray',
          children: (
            <div>
              <Space>
                <Tag>{record.type}</Tag>
                <strong>{record.subject}</strong>
              </Space>
              <p style={{ margin: '8px 0', fontSize: 13 }}>{record.content}</p>
              <div style={{ fontSize: 12, color: '#999' }}>
                <span>{record.followUpTime}</span>
                {record.duration && <span style={{ marginLeft: 16 }}>{t('lead.detail.duration')}：{record.duration}{t('lead.detail.minutes')}</span>}
                <span style={{ marginLeft: 16 }}> - {record.createdBy}</span>
              </div>
              {record.nextFollowUpTime && (
                <Tag color="orange" style={{ marginTop: 8 }}>
                  {t('lead.detail.nextFollowUp')}：{record.nextFollowUpTime}
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
            {t('lead.detail.back')}
          </Button>
          <Space style={{ marginLeft: 'auto' }}>
            <Button icon={<EditOutlined />} onClick={handleEdit} disabled={lead.status === '已转化' || lead.status === '已关闭'}>
              {t('lead.detail.edit')}
            </Button>
            <Button icon={<UserSwitchOutlined />} onClick={handleAssign} disabled={lead.status === '已转化' || lead.status === '已关闭'}>
              {t('lead.detail.assign')}
            </Button>
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={handleConvert}
              disabled={lead.status !== '跟进中'}
            >
              {t('lead.detail.convertToCustomer')}
            </Button>
          </Space>
        </Space>
      </Card>

      {/* 基本信息 */}
      <Card title={t('lead.detail.basicInfo')} style={{ marginBottom: 16 }} loading={loading}>
        <Descriptions column={3} bordered>
          <Descriptions.Item label={t('lead.detail.leadId')} span={1}>
            {lead.id}
          </Descriptions.Item>
          <Descriptions.Item label={t('lead.form.name')} span={2}>
            {lead.name}
          </Descriptions.Item>
          <Descriptions.Item label={t('lead.form.contactName')} span={1}>
            {lead.contactName}
          </Descriptions.Item>
          <Descriptions.Item label={t('lead.detail.position')} span={1}>
            {lead.position || '-'}
          </Descriptions.Item>
          <Descriptions.Item label={t('lead.form.mobile')} span={1}>
            {lead.mobile}
          </Descriptions.Item>
          <Descriptions.Item label={t('lead.form.email')} span={1}>
            {lead.email || '-'}
          </Descriptions.Item>
          <Descriptions.Item label={t('lead.form.companyName')} span={1}>
            {lead.companyName || '-'}
          </Descriptions.Item>
          <Descriptions.Item label={t('lead.detail.industry')} span={1}>
            {lead.industry || '-'}
          </Descriptions.Item>
          <Descriptions.Item label={t('lead.detail.companySize')} span={1}>
            {lead.companySize || '-'}
          </Descriptions.Item>
          <Descriptions.Item label={t('lead.form.source')} span={1}>
            <Tag color="blue">{lead.source}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label={t('lead.detail.sourceDetail')} span={1}>
            {lead.sourceDetail || '-'}
          </Descriptions.Item>
          <Descriptions.Item label={t('lead.form.status')} span={1}>
            <Tag color={
              lead.status === '待跟进' ? 'default' :
              lead.status === '跟进中' ? 'processing' :
              lead.status === '已转化' ? 'success' : 'error'
            }>
              {lead.status}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label={t('lead.detail.score')} span={1}>
            {lead.score !== undefined ? `${lead.score}${t('lead.detail.points')}` : '-'}
          </Descriptions.Item>
          <Descriptions.Item label={t('lead.form.level')} span={1}>
            {lead.level ? (
              <Tag color={lead.level === 'A' ? 'red' : lead.level === 'B' ? 'orange' : 'blue'}>
                {lead.level}
              </Tag>
            ) : (
              '-'
            )}
          </Descriptions.Item>
          <Descriptions.Item label={t('lead.detail.budget')} span={1}>
            {lead.budget || '-'}
          </Descriptions.Item>
          <Descriptions.Item label={t('lead.detail.purchaseTimeframe')} span={1}>
            {lead.purchaseTimeframe || '-'}
          </Descriptions.Item>
          <Descriptions.Item label={t('lead.detail.owner')} span={1}>
            {lead.ownerName || '-'}
          </Descriptions.Item>
          <Descriptions.Item label={t('lead.detail.createdAt')} span={1}>
            {lead.createdAt}
          </Descriptions.Item>
          <Descriptions.Item label={t('lead.detail.createdBy')} span={1}>
            {lead.createdBy}
          </Descriptions.Item>
          <Descriptions.Item label={t('lead.detail.firstContactTime')} span={1}>
            {lead.firstContactTime || '-'}
          </Descriptions.Item>
          <Descriptions.Item label={t('lead.detail.lastContactTime')} span={1}>
            {lead.lastContactTime || '-'}
          </Descriptions.Item>
          {lead.convertedAt && (
            <>
              <Descriptions.Item label={t('lead.detail.convertedAt')} span={1}>
                {lead.convertedAt}
              </Descriptions.Item>
              <Descriptions.Item label={t('lead.detail.convertedCustomer')} span={2}>
                {lead.convertedCustomerName || '-'}
              </Descriptions.Item>
            </>
          )}
          {lead.invalidReason && (
            <Descriptions.Item label={t('lead.detail.invalidReason')} span={3}>
              <Tag color="red">{lead.invalidReason}</Tag>
            </Descriptions.Item>
          )}
          <Descriptions.Item label={t('lead.detail.content')} span={3}>
            {lead.content || '-'}
          </Descriptions.Item>
          <Descriptions.Item label={t('lead.form.remark')} span={3}>
            {lead.remark || '-'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 跟进记录 */}
      <Card title={t('lead.detail.followUpRecords')}>
        {renderTimeline()}
      </Card>
    </div>
  );
};

export default LeadDetail;