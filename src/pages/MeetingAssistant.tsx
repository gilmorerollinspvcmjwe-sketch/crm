/**
 * 会议助手页面
 * 录音转写、AI 会议纪要、待办事项提取
 */
import React, { useState } from 'react';
import {
  Card,
  Typography,
  Space,
  Tag,
  List,
  Modal,
  Button,
  Timeline,
  Badge,
  message,
  Divider,
  Row,
  Col,
} from 'antd';
import {
  RobotOutlined,
  FileTextOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { MeetingRecord } from '../types/ai';
import { meetingRecords } from '../mock/aiData';

const { Title, Text, Paragraph } = Typography;

const MeetingAssistant: React.FC = () => {
  const { t } = useTranslation();
  const [meetings, setMeetings] = useState<MeetingRecord[]>(meetingRecords);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentMeeting, setCurrentMeeting] = useState<MeetingRecord | null>(null);

  // 获取情感颜色
  const getSentimentColor = (sentiment: string): string => {
    switch (sentiment) {
      case 'positive':
        return '#52c41a';
      case 'negative':
        return '#ff4d4f';
      default:
        return '#faad14';
    }
  };

  // 获取情感文本
  const getSentimentText = (sentiment: string): string => {
    switch (sentiment) {
      case 'positive':
        return t('ai.meetingAssistant.sentimentPositive');
      case 'negative':
        return t('ai.meetingAssistant.sentimentNegative');
      default:
        return t('ai.meetingAssistant.sentimentNeutral');
    }
  };

  // 打开会议详情
  const handleViewDetail = (meeting: MeetingRecord) => {
    setCurrentMeeting(meeting);
    setIsModalVisible(true);
  };

  // 导出会议纪要
  const handleExport = () => {
    if (!currentMeeting) return;

    const content = `
# ${currentMeeting.title}

## ${t('ai.meetingAssistant.meetingInfo')}
- ${t('ai.meetingAssistant.date')}：${currentMeeting.date}
- ${t('ai.meetingAssistant.time')}：${currentMeeting.time}
- ${t('ai.meetingAssistant.duration')}：${currentMeeting.duration}${t('ai.meetingAssistant.minutes')}
- ${t('ai.meetingAssistant.participantsCount')}：${currentMeeting.participants.length}${t('ai.meetingAssistant.people')}

## ${t('ai.meetingAssistant.aiSummary')}
${currentMeeting.aiSummary}

## ${t('ai.meetingAssistant.actionItems')}
${currentMeeting.actionItems.map((item) => `- [${item.status === 'completed' ? 'x' : ' '}] ${item.content} (${t('ai.meetingAssistant.assignee')}：${item.assignee || t('ai.meetingAssistant.unassigned')}, ${t('ai.meetingAssistant.dueDate')}：${item.dueDate || t('ai.meetingAssistant.none')}, ${t('ai.meetingAssistant.priority')}：${item.priority})`).join('\n')}

## ${t('ai.meetingAssistant.keywords')}
${currentMeeting.keywords.join(', ')}
    `.trim();

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentMeeting.title}.md`;
    a.click();
    URL.revokeObjectURL(url);

    message.success(t('ai.meetingAssistant.exportSuccess'));
  };

  // 更新待办状态
  const handleToggleActionItem = (actionId: string) => {
    if (!currentMeeting) return;

    setMeetings((prev) =>
      prev.map((m) =>
        m.id === currentMeeting.id
          ? {
              ...m,
              actionItems: m.actionItems.map((a) =>
                a.id === actionId
                  ? { ...a, status: a.status === 'pending' ? 'completed' : 'pending' }
                  : a
              ),
            }
          : m
      )
    );

    setCurrentMeeting((prev) =>
      prev
        ? {
            ...prev,
            actionItems: prev.actionItems.map((a) =>
              a.id === actionId
                ? { ...a, status: a.status === 'pending' ? 'completed' : 'pending' }
                : a
            ),
          }
        : null
    );

    message.success(t('ai.meetingAssistant.todoStatusUpdated'));
  };

  // 获取优先级文本
  const getPriorityText = (priority: string): string => {
    switch (priority) {
      case 'high':
        return t('ai.meetingAssistant.priorityHigh');
      case 'medium':
        return t('ai.meetingAssistant.priorityMedium');
      default:
        return t('ai.meetingAssistant.priorityLow');
    }
  };

  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh' }}>
      {/* 页面头部 */}
      <div style={{ background: '#fff', padding: '16px 24px', marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0 }}>
          <RobotOutlined /> {t('ai.meetingAssistant.title')}
        </Title>
        <Text type="secondary">
          {t('ai.meetingAssistant.subtitle')}
        </Text>
      </div>

      {/* 会议列表 */}
      <Row gutter={16}>
        {meetings.map((meeting) => {
          const completedActions = meeting.actionItems.filter((a) => a.status === 'completed').length;
          const totalActions = meeting.actionItems.length;

          return (
            <Col span={8} key={meeting.id}>
              <Card
                hoverable
                onClick={() => handleViewDetail(meeting)}
                style={{ marginBottom: 16 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <Badge
                    count={getSentimentText(meeting.sentiment)}
                    style={{ backgroundColor: getSentimentColor(meeting.sentiment) }}
                  />
                  <Tag icon={<ClockCircleOutlined />}>{meeting.duration}{t('ai.meetingAssistant.minutes')}</Tag>
                </div>

                <Title level={5} style={{ margin: '0 0 8px 0' }}>{meeting.title}</Title>

                <Text type="secondary" style={{ fontSize: 12 }}>
                  {meeting.date} {meeting.time}
                </Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {t('ai.meetingAssistant.participants')}：{meeting.participants.length}{t('ai.meetingAssistant.people')}
                </Text>

                <Divider style={{ margin: '12px 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space>
                    <Tag color="blue" icon={<FileTextOutlined />}>
                      {t('ai.meetingAssistant.transcribed')}
                    </Tag>
                    <Tag color="green" icon={<ThunderboltOutlined />}>
                      {t('ai.meetingAssistant.aiSummarized')}
                    </Tag>
                  </Space>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {t('ai.meetingAssistant.todos')}：{completedActions}/{totalActions}
                  </Text>
                </div>

                <div style={{ marginTop: 12 }}>
                  <Space size={[0, 8]} wrap>
                    {meeting.keywords.slice(0, 3).map((keyword, idx) => (
                      <Tag key={idx} color="geekblue" style={{ fontSize: 11 }}>
                        {keyword}
                      </Tag>
                    ))}
                  </Space>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* 会议详情弹窗 */}
      <Modal
        title={
          <Space>
            <RobotOutlined />
            {t('ai.meetingAssistant.meetingDetails')}
          </Space>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={1000}
        footer={[
          <Button key="export" icon={<ExportOutlined />} onClick={handleExport}>
            {t('ai.meetingAssistant.exportNotes')}
          </Button>,
        ]}
      >
        {currentMeeting && (
          <div>
            {/* 会议基本信息 */}
            <Card size="small" style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={6}>
                  <Text type="secondary">{t('ai.meetingAssistant.meetingDate')}</Text>
                  <br />
                  <Text strong>{currentMeeting.date}</Text>
                </Col>
                <Col span={6}>
                  <Text type="secondary">{t('ai.meetingAssistant.meetingTime')}</Text>
                  <br />
                  <Text strong>{currentMeeting.time}</Text>
                </Col>
                <Col span={6}>
                  <Text type="secondary">{t('ai.meetingAssistant.duration')}</Text>
                  <br />
                  <Text strong>{currentMeeting.duration}{t('ai.meetingAssistant.minutes')}</Text>
                </Col>
                <Col span={6}>
                  <Text type="secondary">{t('ai.meetingAssistant.sentiment')}</Text>
                  <br />
                  <Badge
                    count={getSentimentText(currentMeeting.sentiment)}
                    style={{ backgroundColor: getSentimentColor(currentMeeting.sentiment) }}
                  />
                </Col>
              </Row>
            </Card>

            {/* 参会人员 */}
            <Title level={5}>{t('ai.meetingAssistant.participants')}</Title>
            <Card size="small" style={{ marginBottom: 16 }}>
              <Space wrap>
                {currentMeeting.participants.map((p) => (
                  <Tag
                    key={p.id}
                    color={p.role === 'host' ? 'red' : p.role === 'external' ? 'blue' : 'green'}
                  >
                    {p.name} {p.role === 'host' && `(${t('ai.meetingAssistant.host')})`}
                    {p.role === 'external' && `(${p.company})`}
                  </Tag>
                ))}
              </Space>
            </Card>

            {/* AI 会议纪要 */}
            <Title level={5}>
              <ThunderboltOutlined /> {t('ai.meetingAssistant.aiSummary')}
            </Title>
            <Card
              size="small"
              style={{
                marginBottom: 16,
                backgroundColor: '#f6ffed',
                borderColor: '#52c41a',
              }}
            >
              <Paragraph style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
                {currentMeeting.aiSummary}
              </Paragraph>
            </Card>

            {/* 待办事项 */}
            <Title level={5}>
              <CheckCircleOutlined /> {t('ai.meetingAssistant.actionItems')}
            </Title>
            <Card size="small" style={{ marginBottom: 16 }}>
              <Timeline>
                {currentMeeting.actionItems.map((item) => (
                  <Timeline.Item
                    key={item.id}
                    color={item.status === 'completed' ? 'green' : 'blue'}
                    dot={
                      item.status === 'completed' ? (
                        <CheckCircleOutlined style={{ fontSize: 16 }} />
                      ) : (
                        <ClockCircleOutlined style={{ fontSize: 16 }} />
                      )
                    }
                  >
                    <div
                      style={{
                        cursor: 'pointer',
                        textDecoration: item.status === 'completed' ? 'line-through' : 'none',
                        opacity: item.status === 'completed' ? 0.6 : 1,
                      }}
                      onClick={() => handleToggleActionItem(item.id)}
                    >
                      <Text strong>{item.content}</Text>
                      <br />
                      <Space size={16} style={{ fontSize: 12 }}>
                        <span>{t('ai.meetingAssistant.assignee')}：{item.assignee || t('ai.meetingAssistant.unassigned')}</span>
                        <span>{t('ai.meetingAssistant.dueDate')}：{item.dueDate || t('ai.meetingAssistant.none')}</span>
                        <Badge
                          count={getPriorityText(item.priority)}
                          style={{
                            backgroundColor:
                              item.priority === 'high' ? '#ff4d4f' : item.priority === 'medium' ? '#faad14' : '#1890ff',
                          }}
                        />
                        <span>{item.status === 'completed' ? t('ai.meetingAssistant.completed') : t('ai.meetingAssistant.pending')}</span>
                      </Space>
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Card>

            {/* 转写文本 */}
            <Title level={5}>
              <FileTextOutlined /> {t('ai.meetingAssistant.transcript')}
            </Title>
            <Card
              size="small"
              style={{
                backgroundColor: '#f5f5f5',
                maxHeight: 300,
                overflowY: 'auto',
              }}
            >
              <Paragraph style={{ whiteSpace: 'pre-wrap', margin: 0, fontFamily: 'monospace', fontSize: 12 }}>
                {currentMeeting.transcript}
              </Paragraph>
            </Card>

            {/* 关键词 */}
            <Title level={5} style={{ marginTop: 16 }}>{t('ai.meetingAssistant.keywords')}</Title>
            <Space wrap>
              {currentMeeting.keywords.map((keyword, idx) => (
                <Tag key={idx} color="geekblue">
                  {keyword}
                </Tag>
              ))}
            </Space>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MeetingAssistant;