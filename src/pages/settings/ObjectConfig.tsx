/**
 * 对象配置中心页面
 * 整合所有对象配置项到一个页面，使用 Tab 切换
 */
import React, { useState, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Tabs,
  Typography,
  Space,
  Tag,
  Button,
  Spin,
  Empty,
  Tooltip,
} from 'antd';
import {
  ArrowLeftOutlined,
  SettingOutlined,
  FormOutlined,
  ApartmentOutlined,
  BranchesOutlined,
  LayoutOutlined,
  EyeOutlined,
  DatabaseOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import * as Icons from '@ant-design/icons';
import { useCustomObjectsStore } from '../../store/customObjects';

// 懒加载子组件
const ObjectFields = React.lazy(() => import('./ObjectFields'));
const FormDesigner = React.lazy(() => import('./FormDesigner'));
const ObjectRelationships = React.lazy(() => import('./ObjectRelationships'));
const PipelineManager = React.lazy(() => import('./PipelineManager'));
const PageBuilder = React.lazy(() => import('./PageBuilder'));
const ViewManager = React.lazy(() => import('./ViewManager'));
const ObjectData = React.lazy(() => import('./ObjectData'));

const { Title, Text } = Typography;

// 动态获取图标组件
const getIconComponent = (iconName: string | undefined) => {
  if (!iconName) return <DatabaseOutlined />;
  const IconComponent = (Icons as any)[iconName];
  return IconComponent ? <IconComponent /> : <DatabaseOutlined />;
};

// Tab 键值
type TabKey = 'properties' | 'forms' | 'relationships' | 'pipeline' | 'pageLayout' | 'views' | 'data';

const ObjectConfig: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { objectId } = useParams<{ objectId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const { getObjectById, loading } = useCustomObjectsStore();
  
  // 从 URL 获取当前 tab，默认为 properties
  const activeKey: TabKey = (searchParams.get('tab') as TabKey) || 'properties';
  
  // 获取对象定义
  const objectDef = objectId ? getObjectById(objectId) : undefined;
  
  // 切换 tab
  const handleTabChange = (key: string) => {
    setSearchParams({ tab: key });
  };
  
  // Tab 配置
  const tabItems = useMemo(() => [
    {
      key: 'properties',
      label: (
        <Space size={4}>
          <SettingOutlined />
          {t('objectConfig.tabs.properties', 'Properties')}
        </Space>
      ),
      children: (
        <React.Suspense fallback={<Spin />}>
          <ObjectFields />
        </React.Suspense>
      ),
    },
    {
      key: 'forms',
      label: (
        <Space size={4}>
          <FormOutlined />
          {t('objectConfig.tabs.forms', 'Forms')}
        </Space>
      ),
      children: (
        <React.Suspense fallback={<Spin />}>
          <FormDesigner />
        </React.Suspense>
      ),
    },
    {
      key: 'relationships',
      label: (
        <Space size={4}>
          <ApartmentOutlined />
          {t('objectConfig.tabs.relationships', 'Relationships')}
        </Space>
      ),
      children: (
        <React.Suspense fallback={<Spin />}>
          <ObjectRelationships />
        </React.Suspense>
      ),
    },
    {
      key: 'pipeline',
      label: (
        <Space size={4}>
          <BranchesOutlined />
          {t('objectConfig.tabs.pipeline', 'Pipeline')}
        </Space>
      ),
      children: (
        <React.Suspense fallback={<Spin />}>
          <PipelineManager />
        </React.Suspense>
      ),
    },
    {
      key: 'pageLayout',
      label: (
        <Space size={4}>
          <LayoutOutlined />
          {t('objectConfig.tabs.pageLayout', 'Page Layout')}
        </Space>
      ),
      children: (
        <React.Suspense fallback={<Spin />}>
          <PageBuilder />
        </React.Suspense>
      ),
    },
    {
      key: 'views',
      label: (
        <Space size={4}>
          <EyeOutlined />
          {t('objectConfig.tabs.views', 'Views')}
        </Space>
      ),
      children: (
        <React.Suspense fallback={<Spin />}>
          <ViewManager />
        </React.Suspense>
      ),
    },
    {
      key: 'data',
      label: (
        <Space size={4}>
          <DatabaseOutlined />
          {t('objectConfig.tabs.data', 'Data')}
        </Space>
      ),
      children: (
        <React.Suspense fallback={<Spin />}>
          <ObjectData />
        </React.Suspense>
      ),
    },
  ], [t]);
  
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Spin size="large" />
      </div>
    );
  }
  
  if (!objectDef) {
    return (
      <Empty
        description={t('customObjects.objectNotFound', 'Object not found')}
        style={{ marginTop: 100 }}
      >
        <Button onClick={() => navigate('/settings/custom-objects')}>
          {t('common.back', 'Back')}
        </Button>
      </Empty>
    );
  }
  
  return (
    <div style={{ minHeight: '100%', background: '#f5f5f5' }}>
      {/* 页面头部 */}
      <Card
        style={{ marginBottom: 16 }}
        styles={{ body: { padding: '16px 24px' } }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Space size={12}>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/settings/custom-objects')}
            />
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: `${objectDef.iconColor}15`,
                color: objectDef.iconColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
              }}
            >
              {getIconComponent(objectDef.icon)}
            </div>
            <div>
              <Title level={4} style={{ margin: 0 }}>
                {objectDef.pluralName}
                {objectDef.isSystem && (
                  <Tooltip title={t('customObjects.systemObject', 'System Object')}>
                    <Tag color="blue" style={{ marginLeft: 8 }}>
                      {t('customObjects.system', 'System')}
                    </Tag>
                  </Tooltip>
                )}
              </Title>
              <Text type="secondary" style={{ fontSize: 13 }}>
                {objectDef.description || objectDef.name}
              </Text>
            </div>
          </Space>
        </div>
      </Card>
      
      {/* Tab 内容 */}
      <Card styles={{ body: { padding: 0 } }}>
        <Tabs
          activeKey={activeKey}
          items={tabItems}
          onChange={handleTabChange}
          style={{ paddingLeft: 16, paddingRight: 16 }}
          tabBarStyle={{ marginBottom: 0, paddingLeft: 8 }}
          destroyInactiveTabPane={false}
        />
      </Card>
    </div>
  );
};

export default ObjectConfig;