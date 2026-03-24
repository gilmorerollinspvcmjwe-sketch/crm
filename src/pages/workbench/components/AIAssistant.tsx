/**
 * AI 助手侧边栏组件
 * 支持对话交互和预设命令
 */

import React, { useState, useRef, useEffect } from 'react';
import { Drawer, Input, Button, Space, Typography, Divider, message } from 'antd';
import { SendOutlined, RobotOutlined } from '@ant-design/icons';
import type { ModalType } from './CreateModal';

const { Text } = Typography;

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  action?: ModalType | 'todo' | 'performance';
  timestamp: Date;
}

interface AIAssistantProps {
  visible: boolean;
  onClose: () => void;
  onCreateRequest?: (type: ModalType) => void;
  onViewTodo?: () => void;
  onViewPerformance?: () => void;
}

// 预设快捷指令
const quickCommands = [
  { label: '创建客户', command: '创建客户', type: 'customer' as ModalType },
  { label: '创建商机', command: '创建商机', type: 'opportunity' as ModalType },
  { label: '创建合同', command: '创建合同', type: 'contract' as ModalType },
  { label: '查看待办', command: '查看我的待办', type: 'todo' },
  { label: '本月业绩', command: '本月业绩', type: 'performance' },
];

// AI 回复模板
const assistantResponses: Record<string, { text: string; action?: ModalType | 'todo' | 'performance' }> = {
  '创建客户': { text: '好的，我来帮您创建客户，请填写客户信息～', action: 'customer' },
  '创建商机': { text: '没问题，我来帮您创建商机，请填写相关信息～', action: 'opportunity' },
  '创建合同': { text: '好的，我来帮您创建合同，请填写合同信息～', action: 'contract' },
  '查看我的待办': { text: '这是您今天的待办事项，请查看～', action: 'todo' },
  '本月业绩': { text: '这是您本月的业绩情况，继续加油哦～', action: 'performance' },
};

export const AIAssistant: React.FC<AIAssistantProps> = ({
  visible,
  onClose,
  onCreateRequest,
  onViewTodo,
  onViewPerformance,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      type: 'assistant',
      content: '您好！我是您的 AI 销售助手，有什么可以帮您的吗？您可以点击下方的快捷指令，或者直接输入您的需求～',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 处理发送消息
  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    // 添加用户消息
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // 模拟 AI 回复延迟
    setTimeout(() => {
      // 匹配预设命令
      const matchedCommand = Object.keys(assistantResponses).find((cmd) =>
        content.trim().includes(cmd)
      );

      if (matchedCommand) {
        const response = assistantResponses[matchedCommand];
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          type: 'assistant',
          content: response.text,
          action: response.action,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);

        // 触发对应动作
        if (response.action === 'customer' || response.action === 'opportunity' || response.action === 'contract') {
          onCreateRequest?.(response.action);
        } else if (response.action === 'todo') {
          onViewTodo?.();
          message.info('待办事项已显示');
        } else if (response.action === 'performance') {
          onViewPerformance?.();
          message.info('业绩数据已显示');
        }
      } else {
        // 默认回复
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          type: 'assistant',
          content: '我暂时还不太理解您的需求，您可以试试点击下方的快捷指令，或者换个说法告诉我～',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }

      setIsTyping(false);
    }, 600);
  };

  // 处理快捷指令点击
  const handleQuickCommand = (command: string) => {
    handleSendMessage(command);
  };

  // 处理按键事件
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  // 格式化时间
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Drawer
      title={
        <Space>
          <RobotOutlined style={{ fontSize: 20 }} />
          <span>AI 助手</span>
        </Space>
      }
      placement="right"
      width={400}
      open={visible}
      onClose={onClose}
      closeIcon={<span style={{ fontSize: 18 }}>✕</span>}
      styles={{
        body: { padding: 0, display: 'flex', flexDirection: 'column' },
      }}
    >
      {/* 快捷指令区 */}
      <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
        <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>
          快捷指令：
        </Text>
        <Space wrap size={[8, 8]}>
          {quickCommands.map((cmd) => (
            <Button
              key={cmd.label}
              size="small"
              onClick={() => handleQuickCommand(cmd.command)}
              style={{ borderRadius: 16 }}
            >
              {cmd.label}
            </Button>
          ))}
        </Space>
      </div>

      {/* 对话区 */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          background: '#fafafa',
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: 16,
            }}
          >
            {msg.type === 'assistant' && (
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: '#1890ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 8,
                  flexShrink: 0,
                }}
              >
                <RobotOutlined style={{ color: '#fff', fontSize: 16 }} />
              </div>
            )}
            <div
              style={{
                maxWidth: '75%',
                padding: '12px 16px',
                borderRadius: 16,
                background: msg.type === 'user' ? '#1890ff' : '#fff',
                color: msg.type === 'user' ? '#fff' : '#333',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              <div style={{ fontSize: 14, lineHeight: 1.5 }}>{msg.content}</div>
              <div
                style={{
                  fontSize: 11,
                  marginTop: 4,
                  opacity: 0.7,
                  textAlign: msg.type === 'user' ? 'right' : 'left',
                }}
              >
                {formatTime(msg.timestamp)}
              </div>
            </div>
            {msg.type === 'user' && (
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: '#87d068',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 8,
                  flexShrink: 0,
                }}
              >
                <span style={{ color: '#fff', fontSize: 14 }}>👤</span>
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div style={{ display: 'flex', marginBottom: 16 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: '#1890ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 8,
              }}
            >
              <RobotOutlined style={{ color: '#fff', fontSize: 16 }} />
            </div>
            <div
              style={{
                padding: '12px 16px',
                borderRadius: 16,
                background: '#fff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              <span style={{ fontSize: 14 }}>正在输入</span>
              <span className="typing-dots">...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区 */}
      <Divider style={{ margin: 0 }} />
      <div style={{ padding: '16px', background: '#fff' }}>
        <Input
          placeholder="输入指令..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          suffix={
            <Button
              type="primary"
              icon={<SendOutlined />}
              size="small"
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim()}
            >
              发送
            </Button>
          }
          size="large"
        />
      </div>

      <style>{`
        .typing-dots::after {
          content: '.';
          animation: dots 1.5s steps(5, end) infinite;
        }
        @keyframes dots {
          0%, 20% { content: '.'; }
          40% { content: '..'; }
          60% { content: '...'; }
          80%, 100% { content: ''; }
        }
      `}</style>
    </Drawer>
  );
};

export default AIAssistant;
