/**
 * 显示偏好设置页面
 * 支持语言、时区、日期格式、数字格式、货币设置
 */
import React, { useState } from 'react';
import { Card, Form, Select, Divider, message, Space, Button, Typography, Row, Col, Input } from 'antd';
import { GlobalOutlined, ClockCircleOutlined, CalendarOutlined, NumberOutlined, DollarOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { colors } from '../../styles/tokens';
import { 
  mockDisplayPreferences, 
  type DisplayPreferences as DisplayPreferencesType, 
  TIMEZONE_OPTIONS, 
  DATE_FORMAT_OPTIONS, 
  NUMBER_FORMAT_OPTIONS, 
  CURRENCY_OPTIONS 
} from '../../mock/settingsData';

const { Text } = Typography;

const DisplayPreferences: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState<DisplayPreferencesType>(mockDisplayPreferences);

  // 保存设置
  const handleSave = async (values: DisplayPreferencesType) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 切换语言
      if (values.language !== i18n.language) {
        i18n.changeLanguage(values.language);
      }
      
      setPreferences(values);
      message.success(t('settings.display.saveSuccess'));
    } catch {
      message.error(t('settings.display.saveError'));
    } finally {
      setLoading(false);
    }
  };

  // 语言选项
  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'zh', label: '中文' },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card
        bordered={false}
        style={{ maxWidth: 800, margin: '0 auto' }}
      >
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: colors.text.primary }}>
            {t('settings.display.title')}
          </h2>
          <p style={{ margin: '8px 0 0', color: colors.text.secondary, fontSize: 14 }}>
            {t('settings.display.subtitle')}
          </p>
        </div>

        <Divider style={{ margin: '0 0 24px' }} />

        <Form
          form={form}
          layout="vertical"
          initialValues={preferences}
          onFinish={handleSave}
        >
          {/* 语言设置 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              padding: '16px 0',
              borderBottom: `1px solid ${colors.border.default}`,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                backgroundColor: colors.primarySubtle,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 16,
              }}
            >
              <GlobalOutlined style={{ color: colors.primary, fontSize: 18 }} />
            </div>
            <div style={{ flex: 1 }}>
              <Text strong style={{ display: 'block', marginBottom: 4 }}>
                {t('settings.display.language')}
              </Text>
              <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 12 }}>
                {t('settings.display.languageDesc')}
              </Text>
              <Form.Item name="language" noStyle>
                <Select
                  options={languageOptions}
                  style={{ width: 200 }}
                />
              </Form.Item>
            </div>
          </div>

          {/* 时区设置 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              padding: '16px 0',
              borderBottom: `1px solid ${colors.border.default}`,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                backgroundColor: '#FFF3E0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 16,
              }}
            >
              <ClockCircleOutlined style={{ color: colors.warning, fontSize: 18 }} />
            </div>
            <div style={{ flex: 1 }}>
              <Text strong style={{ display: 'block', marginBottom: 4 }}>
                {t('settings.display.timezone')}
              </Text>
              <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 12 }}>
                {t('settings.display.timezoneDesc')}
              </Text>
              <Form.Item name="timezone" noStyle>
                <Select
                  showSearch
                  optionFilterProp="label"
                  options={TIMEZONE_OPTIONS}
                  style={{ width: 300 }}
                />
              </Form.Item>
            </div>
          </div>

          {/* 日期格式设置 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              padding: '16px 0',
              borderBottom: `1px solid ${colors.border.default}`,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                backgroundColor: '#E1F5FE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 16,
              }}
            >
              <CalendarOutlined style={{ color: colors.info, fontSize: 18 }} />
            </div>
            <div style={{ flex: 1 }}>
              <Text strong style={{ display: 'block', marginBottom: 4 }}>
                {t('settings.display.dateFormat')}
              </Text>
              <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 12 }}>
                {t('settings.display.dateFormatDesc')}
              </Text>
              <Form.Item name="dateFormat" noStyle>
                <Select
                  options={DATE_FORMAT_OPTIONS}
                  style={{ width: 200 }}
                />
              </Form.Item>
            </div>
          </div>

          {/* 数字格式设置 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              padding: '16px 0',
              borderBottom: `1px solid ${colors.border.default}`,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                backgroundColor: '#F3E5F5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 16,
              }}
            >
              <NumberOutlined style={{ color: '#7B1FA2', fontSize: 18 }} />
            </div>
            <div style={{ flex: 1 }}>
              <Text strong style={{ display: 'block', marginBottom: 4 }}>
                {t('settings.display.numberFormat')}
              </Text>
              <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 12 }}>
                {t('settings.display.numberFormatDesc')}
              </Text>
              <Form.Item name="numberFormat" noStyle>
                <Select
                  options={NUMBER_FORMAT_OPTIONS}
                  style={{ width: 200 }}
                />
              </Form.Item>
            </div>
          </div>

          {/* 货币设置 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              padding: '16px 0',
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                backgroundColor: '#E8F5E9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 16,
              }}
            >
              <DollarOutlined style={{ color: colors.success, fontSize: 18 }} />
            </div>
            <div style={{ flex: 1 }}>
              <Text strong style={{ display: 'block', marginBottom: 4 }}>
                {t('settings.display.currency')}
              </Text>
              <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 12 }}>
                {t('settings.display.currencyDesc')}
              </Text>
              <Form.Item name="currency" noStyle>
                <Select
                  options={CURRENCY_OPTIONS}
                  style={{ width: 250 }}
                />
              </Form.Item>
            </div>
          </div>

          <Divider style={{ margin: '24px 0' }} />

          {/* 预览区域 */}
          <div
            style={{
              padding: 16,
              backgroundColor: colors.background.default,
              borderRadius: 6,
              marginBottom: 24,
            }}
          >
            <Text strong style={{ display: 'block', marginBottom: 12 }}>
              {t('settings.display.preview')}
            </Text>
            <Row gutter={[16, 8]}>
              <Col span={12}>
                <Text type="secondary">{t('settings.display.previewDate')}: </Text>
                <Text>
                  {preferences.dateFormat === 'MM/DD/YYYY' && '03/24/2026'}
                  {preferences.dateFormat === 'DD/MM/YYYY' && '24/03/2026'}
                  {preferences.dateFormat === 'YYYY-MM-DD' && '2026-03-24'}
                </Text>
              </Col>
              <Col span={12}>
                <Text type="secondary">{t('settings.display.previewNumber')}: </Text>
                <Text>
                  {preferences.numberFormat === '1,000.00' && '1,234,567.89'}
                  {preferences.numberFormat === '1.000,00' && '1.234.567,89'}
                </Text>
              </Col>
              <Col span={12}>
                <Text type="secondary">{t('settings.display.previewCurrency')}: </Text>
                <Text>
                  {CURRENCY_OPTIONS.find(c => c.value === preferences.currency)?.symbol}
                  {preferences.numberFormat === '1,000.00' ? '99,999.00' : '99.999,00'}
                </Text>
              </Col>
              <Col span={12}>
                <Text type="secondary">{t('settings.display.previewTimezone')}: </Text>
                <Text>
                  {TIMEZONE_OPTIONS.find(t => t.value === preferences.timezone)?.label?.split(' (')[0]}
                </Text>
              </Col>
            </Row>
          </div>

          <Form.Item style={{ marginBottom: 0 }}>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {t('common.save')}
              </Button>
              <Button onClick={() => form.resetFields()}>
                {t('common.reset')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default DisplayPreferences;