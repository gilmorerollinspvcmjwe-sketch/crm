/**
 * 销售工作台主页面
 */

import React, { useState } from 'react';
import { Layout, Row, Col, Space, Button, Typography, message, Drawer, List, Tag } from 'antd';
import {
  RobotOutlined,
  SettingOutlined,
  PhoneOutlined,
  CheckOutlined,
  RightOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { TodayTodo } from './components/TodayTodo';
import { QuickActions } from './components/QuickActions';
import { AIRecommendation } from './components/AIRecommendation';
import { Performance } from './components/Performance';
import { AIAssistant } from './components/AIAssistant';
import { CreateModal, type ModalType } from './components/CreateModal';
import { workbenchMockData, type QuickAction, type TodoItem } from '../../mock/workbench';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const Workbench: React.FC = () => {
  const { user, todos, aiRecommendations, performance, quickActions } =
    workbenchMockData;

  // AI 助手状态
  const [aiAssistantVisible, setAiAssistantVisible] = useState(false);
  
  // 创建弹窗状态
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createModalType, setCreateModalType] = useState<ModalType>('customer');

  // 日程抽屉状态
  const [scheduleDrawerVisible, setScheduleDrawerVisible] = useState(false);
  
  // 商机详情抽屉状态
  const [opportunityDrawerVisible, setOpportunityDrawerVisible] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null);

  // 待办完成状态
  const [completedTodoIds, setCompletedTodoIds] = useState<Set<string>>(new Set());

  const handleViewAllTodos = () => {
    console.log('查看全部待办');
    message.info('待办列表页面待实现');
    // TODO: 跳转到待办列表页
  };

  const handleAIAssistant = () => {
    setAiAssistantVisible(true);
  };

  const handleSettings = () => {
    console.log('打开设置');
    message.info('设置页面待实现');
    // TODO: 打开设置页面
  };

  // 处理赢单预测点击
  const handlePredictionClick = (prediction: any) => {
    console.log('点击赢单预测:', prediction);
    setSelectedOpportunity(prediction);
    setOpportunityDrawerVisible(true);
  };

  // 处理重点客户点击
  const handleCustomerClick = (customer: any) => {
    console.log('点击重点客户:', customer);
    message.info('客户详情页面待实现');
    // TODO: 打开客户详情
  };

  // 处理快捷操作点击
  const handleQuickActionClick = (action: QuickAction) => {
    console.log('点击快捷操作:', action);

    switch (action.id) {
      case 'new-customer':
        setCreateModalType('customer');
        setCreateModalVisible(true);
        break;
      case 'new-opportunity':
        setCreateModalType('opportunity');
        setCreateModalVisible(true);
        break;
      case 'new-followup':
        setCreateModalType('customer');
        setCreateModalVisible(true);
        break;
      case 'new-quote':
        // 跳转到报价页面
        console.log('跳转到报价页面：/quote/new');
        message.info('跳转到报价页面');
        // 在实际应用中这里会使用 navigate('/quote/new')
        break;
      case 'new-contract':
        setCreateModalType('contract');
        setCreateModalVisible(true);
        break;
      case 'schedule':
        // 显示日程抽屉
        setScheduleDrawerVisible(true);
        break;
      default:
        console.log('未知操作:', action);
    }
  };

  // 处理创建弹窗提交
  const handleCreateSubmit = (data: any) => {
    console.log('创建数据:', data);
    // TODO: 保存到 Mock store 或调用 API
  };

  // 处理 AI 助手的创建请求
  const handleAIAssistantCreateRequest = (type: ModalType) => {
    setCreateModalType(type);
    setCreateModalVisible(true);
  };

  // 处理 AI 助手的待办查看请求
  const handleAIAssistantViewTodo = () => {
    handleViewAllTodos();
  };

  // 处理 AI 助手的业绩查看请求
  const handleAIAssistantViewPerformance = () => {
    message.info('业绩详情页面待实现');
    // TODO: 跳转业绩报表页面
  };

  // 处理待办拨号
  const handleTodoPhoneCall = (todo: TodoItem) => {
    if (todo.phone) {
      message.info(`模拟拨打：${todo.phone}`);
      console.log('拨打电话:', todo.phone);
    }
  };

  // 处理待办完成标记
  const handleTodoComplete = (todoId: string) => {
    const newCompleted = new Set(completedTodoIds);
    if (newCompleted.has(todoId)) {
      newCompleted.delete(todoId);
    } else {
      newCompleted.add(todoId);
    }
    setCompletedTodoIds(newCompleted);
    message.success('标记完成');
  };

  // 处理待办点击
  const handleTodoClick = (todo: TodoItem) => {
    console.log('点击待办:', todo);
    message.info(`待办详情：${todo.title} - ${todo.customerName}`);
    // TODO: 展开详情或跳转
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return '夜深了';
    if (hour < 9) return '早上好';
    if (hour < 12) return '上午好';
    if (hour < 14) return '中午好';
    if (hour < 18) return '下午好';
    if (hour < 22) return '晚上好';
    return '夜深了';
  };

  // 获取今日日程（简化版）
  const todaySchedules = todos.filter(t => t.time.includes('今天')).slice(0, 5);

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      {/* 顶部栏 */}
      <Header
        style={{
          background: '#fff',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          height: 64,
        }}
      >
        <Space size="large">
          <Title level={3} style={{ margin: 0 }}>
            👋 {getGreeting()}，{user.name}
          </Title>
        </Space>
        <Space size="middle">
          <Button
            type="primary"
            icon={<RobotOutlined />}
            onClick={handleAIAssistant}
          >
            AI 助手
          </Button>
          <Button icon={<SettingOutlined />} onClick={handleSettings}>
            设置
          </Button>
        </Space>
      </Header>

      <Content style={{ padding: '12px 24px' }}>
        {/* 左右两栏布局：左 60% 右 40% */}
        <Row gutter={12} style={{ minHeight: 'calc(100vh - 88px)' }}>
          {/* 左侧：待办 + AI 推荐 */}
          <Col xs={24} lg={14} xl={15}>
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              {/* 今日待办 */}
              <TodayTodo 
                todos={todos} 
                onViewAll={handleViewAllTodos}
                onTodoClick={handleTodoClick}
                onPhoneCall={handleTodoPhoneCall}
                onComplete={handleTodoComplete}
                completedIds={completedTodoIds}
              />

              {/* AI 智能推荐 */}
              <AIRecommendation
                winPredictions={aiRecommendations.winPredictions}
                keyCustomers={aiRecommendations.keyCustomers}
                onPredictionClick={handlePredictionClick}
                onCustomerClick={handleCustomerClick}
              />
            </Space>
          </Col>

          {/* 右侧：快捷操作 + 业绩 */}
          <Col xs={24} lg={10} xl={9}>
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              {/* 快捷操作 */}
              <QuickActions 
                actions={quickActions} 
                onActionClick={handleQuickActionClick}
              />
              
              {/* 个人业绩 */}
              <Performance 
                performance={performance}
                onViewDetail={handleAIAssistantViewPerformance}
              />
            </Space>
          </Col>
        </Row>
      </Content>

      {/* AI 助手侧边栏 */}
      <AIAssistant
        visible={aiAssistantVisible}
        onClose={() => setAiAssistantVisible(false)}
        onCreateRequest={handleAIAssistantCreateRequest}
        onViewTodo={handleAIAssistantViewTodo}
        onViewPerformance={handleAIAssistantViewPerformance}
      />

      {/* 创建弹窗 */}
      <CreateModal
        visible={createModalVisible}
        type={createModalType}
        onCancel={() => setCreateModalVisible(false)}
        onSubmit={handleCreateSubmit}
      />

      {/* 日程抽屉 */}
      <Drawer
        title="📅 今日日程"
        placement="right"
        width={400}
        onClose={() => setScheduleDrawerVisible(false)}
        open={scheduleDrawerVisible}
      >
        <List
          dataSource={todaySchedules}
          renderItem={(todo) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <Space>
                    <Tag color={todo.priority === 'high' ? 'red' : 'blue'}>
                      {todo.time}
                    </Tag>
                    <Text strong>{todo.title}</Text>
                  </Space>
                }
                description={todo.customerName}
              />
            </List.Item>
          )}
        />
      </Drawer>

      {/* 商机详情抽屉 */}
      <Drawer
        title="商机详情"
        placement="right"
        width={500}
        onClose={() => setOpportunityDrawerVisible(false)}
        open={opportunityDrawerVisible}
      >
        {selectedOpportunity && (
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Text strong>客户名称：</Text>
              <Text>{selectedOpportunity.customerName}</Text>
            </div>
            <div>
              <Text strong>商机金额：</Text>
              <Text>¥{(selectedOpportunity.amount / 10000).toFixed(0)}万</Text>
            </div>
            <div>
              <Text strong>当前阶段：</Text>
              <Tag>{selectedOpportunity.stage}</Tag>
            </div>
            <div>
              <Text strong>赢单概率：</Text>
              <Tag color={selectedOpportunity.winProbability >= 0.7 ? 'green' : 'blue'}>
                {Math.round(selectedOpportunity.winProbability * 100)}%
              </Tag>
            </div>
            <div>
              <Text strong>AI 建议：</Text>
              <Tag color="orange">{selectedOpportunity.recommendation}</Tag>
            </div>
          </Space>
        )}
      </Drawer>
    </Layout>
  );
};

export default Workbench;
