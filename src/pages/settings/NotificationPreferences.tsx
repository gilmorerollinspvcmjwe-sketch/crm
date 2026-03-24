/**
 * 通知偏好设置页面
 * 按模块配置通知方式：Email / In-App / Both / Off
 */
import React, { useState } from 'react';
import { Card, Switch, Select, Divider, message, Space, Button, Typography, Row, Col } from 'antd';
import { BellOutlined, UserOutlined, BulbOutlined, FileTextOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { colors } from '../../styles/tokens';
import { mockNotificationPreferences, NotificationPreference } from '../../mock/settingsData';

const { Text } = Typography;

const moduleIcons: Record<string, React.ReactNode> = {
  lead: <UserOutlined style={{ color: colors.primary }} />,
  deal: <BulbOutlined style={{ color: colors.warning }} />,
  task: <FileTextOutlined style={{ color: colors.info }} />,
  email: <MailOutlined style={{ color: colors.danger }} />,
  system: <SettingOutlined style={{ color: colors.secondary }} />,
};

const NotificationPreferences: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreference[]>(mockNotificationPreferences);

  // 更新通知偏好
  const updatePreference = (id: string, field: 'channel' | 'enabled', value: string | boolean) => {
    setPreferences(prev =>
      prev.map(p =>
        p.id === id ? { ...p, [field]: value } : p
      )
    );
  };

  // 保存设置
  const handleSave = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      message.success(t('settings.notifications.saveSuccess'));
    } catch {
      message.error(t('settings.notifications.saveError'));
    } finally {
      setLoading(false);
    }
  };

  // 渠道选项
  const channelOptions = [
    { value: 'email', label: t('settings.notifications.channels.email') },
    { value: 'in-app', label: t('settings.notifications.channels.inApp') },
    { value: 'both', label: t('settings.notifications.channels.both') },
    { value: 'off', label: t('settings.notifications.channels.off') },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card
        bordered={false}
        style={{ maxWidth: 800, margin: '0 auto' }}
      >
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: colors.text.primary }}>
            <BellOutlined style={{ marginRight: 8 }} />
            {t('settings.notifications.title')}
          </h2>
          <p style={{ margin: '8px 0 0', color: colors.text.secondary, fontSize: 14 }}>
            {t('settings.notifications.subtitle')}
          </p>
        </div>

        <Divider style={{ margin: '0 0 24px' }} />

        {/* 表头 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            backgroundColor: colors.background.default,
            borderRadius: 6,
            marginBottom: 8,
          }}
        >
          <div style={{ flex: 1 }}>
            <Text strong style={{ fontSize: 13, color: colors.text.secondary }}>
              {t('settings.notifications.module')}
            </Text>
          </div>
          <div style={{ width: 120, textAlign: 'center' }}>
            <Text strong style={{ fontSize: 13, color: colors.text.secondary }}>
              {t('settings.notifications.enable')}
            </Text>
          </div>
          <div style={{ width: 140, textAlign: 'center' }}>
            <Text strong style={{ fontSize: 13, color: colors.text.secondary }}>
              {t('settings.notifications.channel')}
            </Text>
          </div>
        </div>

        {/* 通知模块列表 */}
        {preferences.map((pref, index) => (
          <div
            key={pref.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '16px',
              borderBottom: index < preferences.length - 1 ? `1px solid ${colors.border.default}` : 'none',
            }}
          >
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  backgroundColor: colors.background.default,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {moduleIcons[pref.module]}
              </div>
              <div>
                <Text strong style={{ display: 'block' }}>
                  {t(`settings.notifications.modules.${pref.module}`)}
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {t(`settings.notifications.modules.${pref.module}Desc`)}
                </Text>
              </div>
            </div>
            <div style={{ width: 120, textAlign: 'center' }}>
              <Switch
                checked={pref.enabled}
                onChange={(checked) => updatePreference(pref.id, 'enabled', checked)}
              />
            </div>
            <div style={{ width: 140, textAlign: 'center' }}>
              <Select
                value={pref.channel}
                onChange={(value) => updatePreference(pref.id, 'channel', value)}
                options={channelOptions}
                disabled={!pref.enabled}
                style={{ width: 120 }}
                size="small"
              />
            </div>
          </div>
        ))}

        <Divider style={{ margin: '24px 0' }} />

        {/* 提示信息 */}
        <div
          style={{
            padding: 16,
            backgroundColor: colors.primarySubtle,
            borderRadius: 6,
            marginBottom: 24,
          }}
        >
          <Text style={{ fontSize: 13, color: colors.text.secondary }}>
            {t('settings.notifications.hint')}
          </Text>
        </div>

        <Row gutter={16}>
          <Col>
            <Button type="primary" onClick={handleSave} loading={loading}>
              {t('common.save')}
            </Button>
          </Col>
          <Col>
            <Button onClick={() => setPreferences(mockNotificationPreferences)}>
              {t('common.reset')}
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default NotificationPreferences;