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
  Tooltip,
} from 'antd';
import {
  RobotOutlined,
  PlayCircleOutlined,
  FileTextOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import { MeetingRecord } from '../types/ai';
import { meetingRecords } from '../mock/aiData';

const { Title, Text, Paragraph } = Typography;

const MeetingAssistant: React.FC = () => {
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
        return '积极';
      case 'negative':
        return '消极';
      default:
        return '中性';
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

## 会议信息
- 日期：${currentMeeting.date}
- 时间：${currentMeeting.time}
- 时长：${currentMeeting.duration}分钟
- 参会人数：${currentMeeting.participants.length}人

## AI 会议纪要
${currentMeeting.aiSummary}

## 待办事项
${currentMeeting.actionItems.map((item) => `- [${item.status === 'completed' ? 'x' : ' '}] ${item.content} (负责人：${item.assignee || '未分配'}, 截止日期：${item.dueDate || '无'}, 优先级：${item.priority})`).join('\n')}

## 关键词
${currentMeeting.keywords.join(', ')}
    `.trim();

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentMeeting.title}.md`;
    a.click();
    URL.revokeObjectURL(url);

    message.success('会议纪要已导出');
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

    message.success('待办状态已更新');
  };

  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh' }}>
      {/* 页面头部 */}
      <div style={{ background: '#fff', padding: '16px 24px', marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0 }}>
          <RobotOutlined /> 会议助手
        </Title>
        <Text type="secondary">
          AI 自动转写会议录音，生成会议纪要，提取待办事项
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
                  <Tag icon={<ClockCircleOutlined />}>{meeting.duration}分钟</Tag>
                </div>

                <Title level={5} style={{ margin: '0 0 8px 0' }}>{meeting.title}</Title>

                <Text type="secondary" style={{ fontSize: 12 }}>
                  {meeting.date} {meeting.time}
                </Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  参会：{meeting.participants.length}人
                </Text>

                <Divider style={{ margin: '12px 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space>
                    <Tag color="blue" icon={<FileTextOutlined />}>
                      已转写
                    </Tag>
                    <Tag color="green" icon={<ThunderboltOutlined />}>
                      AI 已总结
                    </Tag>
                  </Space>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    待办：{completedActions}/{totalActions}
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
            会议详情
          </Space>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={1000}
        footer={[
          <Button key="export" icon={<ExportOutlined />} onClick={handleExport}>
            导出纪要
          </Button>,
        ]}
      >
        {currentMeeting && (
          <div>
            {/* 会议基本信息 */}
            <Card size="small" style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={6}>
                  <Text type="secondary">会议日期</Text>
                  <br />
                  <Text strong>{currentMeeting.date}</Text>
                </Col>
                <Col span={6}>
                  <Text type="secondary">会议时间</Text>
                  <br />
                  <Text strong>{currentMeeting.time}</Text>
                </Col>
                <Col span={6}>
                  <Text type="secondary">会议时长</Text>
                  <br />
                  <Text strong>{currentMeeting.duration}分钟</Text>
                </Col>
                <Col span={6}>
                  <Text type="secondary">会议情感</Text>
                  <br />
                  <Badge
                    count={getSentimentText(currentMeeting.sentiment)}
                    style={{ backgroundColor: getSentimentColor(currentMeeting.sentiment) }}
                  />
                </Col>
              </Row>
            </Card>

            {/* 参会人员 */}
            <Title level={5}>参会人员</Title>
            <Card size="small" style={{ marginBottom: 16 }}>
              <Space wrap>
                {currentMeeting.participants.map((p) => (
                  <Tag
                    key={p.id}
                    color={p.role === 'host' ? 'red' : p.role === 'external' ? 'blue' : 'green'}
                  >
                    {p.name} {p.role === 'host' && '(主持)'}
                    {p.role === 'external' && `(${p.company})`}
                  </Tag>
                ))}
              </Space>
            </Card>

            {/* AI 会议纪要 */}
            <Title level={5}>
              <ThunderboltOutlined /> AI 会议纪要
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
              <CheckCircleOutlined /> 待办事项
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
                        <span>负责人：{item.assignee || '未分配'}</span>
                        <span>截止：{item.dueDate || '无'}</span>
                        <Badge
                          count={item.priority === 'high' ? '高' : item.priority === 'medium' ? '中' : '低'}
                          style={{
                            backgroundColor:
                              item.priority === 'high' ? '#ff4d4f' : item.priority === 'medium' ? '#faad14' : '#1890ff',
                          }}
                        />
                        <span>{item.status === 'completed' ? '已完成' : '待完成'}</span>
                      </Space>
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Card>

            {/* 转写文本 */}
            <Title level={5}>
              <FileTextOutlined /> 录音转写
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
            <Title level={5} style={{ marginTop: 16 }}>关键词</Title>
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
