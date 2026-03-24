/**
 * AI 助手侧边栏组件
 * 支持对话交互和预设命令
 */
import React, { useState, useRef, useEffect } from 'react';
import { Drawer, Input, Button, Space, Typography, Divider, message } from 'antd';
import { SendOutlined, RobotOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
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

export const AIAssistant: React.FC<AIAssistantProps> = ({
  visible,
  onClose,
  onCreateRequest,
  onViewTodo,
  onViewPerformance,
}) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      type: 'assistant',
      content: t('workbench.ai.welcome'),
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const matchedCommand = Object.keys(commandResponses).find((cmd) =>
        content.trim().includes(cmd)
      );

      if (matchedCommand) {
        const response = commandResponses[matchedCommand];
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          type: 'assistant',
          content: response.text,
          action: response.action,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);

        if (response.action === 'customer' || response.action === 'opportunity' || response.action === 'contract') {
          onCreateRequest?.(response.action);
        } else if (response.action === 'todo') {
          onViewTodo?.();
          message.info(t('workbench.ai.todoShown'));
        } else if (response.action === 'performance') {
          onViewPerformance?.();
          message.info(t('workbench.ai.performanceShown'));
        }
      } else {
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          type: 'assistant',
          content: t('workbench.ai.notUnderstood'),
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }

      setIsTyping(false);
    }, 600);
  };

  const quickCommands = [
    { label: t('workbench.ai.createCustomer'), command: '创建客户', type: 'customer' as ModalType },
    { label: t('workbench.ai.createOpportunity'), command: '创建商机', type: 'opportunity' as ModalType },
    { label: t('workbench.ai.createContract'), command: '创建合同', type: 'contract' as ModalType },
    { label: t('workbench.ai.viewTodo'), command: '查看我的待办', type: 'todo' },
    { label: t('workbench.ai.monthlyPerformance'), command: '本月业绩', type: 'performance' },
  ];

  const commandResponses: Record<string, { text: string; action?: ModalType | 'todo' | 'performance' }> = {
    '创建客户': { text: t('workbench.ai.createCustomerResponse'), action: 'customer' },
    '创建商机': { text: t('workbench.ai.createOpportunityResponse'), action: 'opportunity' },
    '创建合同': { text: t('workbench.ai.createContractResponse'), action: 'contract' },
    '查看我的待办': { text: t('workbench.ai.viewTodoResponse'), action: 'todo' },
    '本月业绩': { text: t('workbench.ai.monthlyPerformanceResponse'), action: 'performance' },
  };

  const handleQuickCommand = (command: string) => {
    handleSendMessage(command);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Drawer
      title={
        <Space>
          <RobotOutlined style={{ fontSize: 20 }} />
          <span>{t('workbench.ai.title')}</span>
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
      <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
        <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>
          {t('workbench.ai.quickCommands')}：
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

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', background: '#fafafa' }}>
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
              <div style={{
                width: 32, height: 32, borderRadius: '50%', background: '#1890ff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginRight: 8, flexShrink: 0,
              }}>
                <RobotOutlined style={{ color: '#fff', fontSize: 16 }} />
              </div>
            )}
            <div style={{
              maxWidth: '75%', padding: '12px 16px', borderRadius: 16,
              background: msg.type === 'user' ? '#1890ff' : '#fff',
              color: msg.type === 'user' ? '#fff' : '#333',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}>
              <div style={{ fontSize: 14, lineHeight: 1.5 }}>{msg.content}</div>
              <div style={{ fontSize: 11, marginTop: 4, opacity: 0.7, textAlign: msg.type === 'user' ? 'right' : 'left' }}>
                {formatTime(msg.timestamp)}
              </div>
            </div>
            {msg.type === 'user' && (
              <div style={{
                width: 32, height: 32, borderRadius: '50%', background: '#87d068',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginLeft: 8, flexShrink: 0,
              }}>
                <span style={{ color: '#fff', fontSize: 14 }}>👤</span>
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div style={{ display: 'flex', marginBottom: 16 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', background: '#1890ff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 8,
            }}>
              <RobotOutlined style={{ color: '#fff', fontSize: 16 }} />
            </div>
            <div style={{ padding: '12px 16px', borderRadius: 16, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <span style={{ fontSize: 14 }}>{t('workbench.ai.typing')}</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <Divider style={{ margin: 0 }} />
      <div style={{ padding: '16px', background: '#fff' }}>
        <Input
          placeholder={t('workbench.ai.inputPlaceholder')}
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
              {t('workbench.ai.send')}
            </Button>
          }
          size="large"
        />
      </div>
    </Drawer>
  );
};

export default AIAssistant;