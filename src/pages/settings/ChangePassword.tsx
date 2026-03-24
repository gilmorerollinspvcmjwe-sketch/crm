/**
 * 密码修改页面
 * 支持旧密码验证、新密码输入、密码强度提示
 */
import React, { useState } from 'react';
import { Card, Form, Input, Button, Progress, Space, Divider, message } from 'antd';
import { LockOutlined, EyeOutlined, EyeInvisibleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { colors } from '../../styles/tokens';

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  checks: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
}

const ChangePassword: React.FC = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    label: '',
    color: colors.text.tertiary,
    checks: { length: false, uppercase: false, lowercase: false, number: false, special: false },
  });

  // 计算密码强度
  const calculatePasswordStrength = (password: string): PasswordStrength => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const score = Object.values(checks).filter(Boolean).length * 20;

    let label = '';
    let color = colors.text.tertiary;

    if (score === 0) {
      label = '';
    } else if (score <= 40) {
      label = t('settings.password.strength.weak');
      color = colors.danger;
    } else if (score <= 60) {
      label = t('settings.password.strength.fair');
      color = colors.warning;
    } else if (score <= 80) {
      label = t('settings.password.strength.good');
      color = colors.info;
    } else {
      label = t('settings.password.strength.strong');
      color = colors.success;
    }

    return { score, label, color, checks };
  };

  // 表单提交
  const handleSubmit = async (values: { oldPassword: string; newPassword: string }) => {
    setLoading(true);
    try {
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟验证旧密码
      if (values.oldPassword !== 'admin123') {
        message.error(t('settings.password.oldPasswordIncorrect'));
        return;
      }
      
      message.success(t('settings.password.changeSuccess'));
      form.resetFields();
      setPasswordStrength({
        score: 0,
        label: '',
        color: colors.text.tertiary,
        checks: { length: false, uppercase: false, lowercase: false, number: false, special: false },
      });
    } catch {
      message.error(t('settings.password.changeError'));
    } finally {
      setLoading(false);
    }
  };

  // 密码变化时更新强度
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setPasswordStrength(calculatePasswordStrength(password));
  };

  return (
    <div style={{ padding: 24 }}>
      <Card
        bordered={false}
        style={{ maxWidth: 600, margin: '0 auto' }}
      >
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: colors.text.primary }}>
            {t('settings.password.title')}
          </h2>
          <p style={{ margin: '8px 0 0', color: colors.text.secondary, fontSize: 14 }}>
            {t('settings.password.subtitle')}
          </p>
        </div>

        <Divider style={{ margin: '0 0 24px' }} />

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="oldPassword"
            label={t('settings.password.oldPassword')}
            rules={[{ required: true, message: t('settings.password.oldPasswordRequired') }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: colors.text.tertiary }} />}
              placeholder={t('settings.password.oldPasswordPlaceholder')}
              iconRender={(visible) => visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label={t('settings.password.newPassword')}
            rules={[
              { required: true, message: t('settings.password.newPasswordRequired') },
              { min: 8, message: t('settings.password.minLength') },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: colors.text.tertiary }} />}
              placeholder={t('settings.password.newPasswordPlaceholder')}
              onChange={handlePasswordChange}
              iconRender={(visible) => visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            />
          </Form.Item>

          {/* 密码强度指示器 */}
          {passwordStrength.score > 0 && (
            <div style={{ marginTop: -8, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <Progress
                  percent={passwordStrength.score}
                  showInfo={false}
                  strokeColor={passwordStrength.color}
                  trailColor={colors.border.default}
                  size="small"
                />
                <span style={{ color: passwordStrength.color, fontSize: 13, fontWeight: 500, minWidth: 50 }}>
                  {passwordStrength.label}
                </span>
              </div>
              
              {/* 密码要求检查列表 */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {[
                  { key: 'length', label: t('settings.password.requirements.length') },
                  { key: 'uppercase', label: t('settings.password.requirements.uppercase') },
                  { key: 'lowercase', label: t('settings.password.requirements.lowercase') },
                  { key: 'number', label: t('settings.password.requirements.number') },
                  { key: 'special', label: t('settings.password.requirements.special') },
                ].map(item => (
                  <span
                    key={item.key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 12,
                      color: passwordStrength.checks[item.key as keyof typeof passwordStrength.checks]
                        ? colors.success
                        : colors.text.tertiary,
                    }}
                  >
                    <CheckCircleOutlined style={{ fontSize: 12 }} />
                    {item.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          <Form.Item
            name="confirmPassword"
            label={t('settings.password.confirmPassword')}
            dependencies={['newPassword']}
            rules={[
              { required: true, message: t('settings.password.confirmPasswordRequired') },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(t('settings.password.confirmPasswordMismatch')));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: colors.text.tertiary }} />}
              placeholder={t('settings.password.confirmPasswordPlaceholder')}
              iconRender={(visible) => visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            />
          </Form.Item>

          <Divider style={{ margin: '24px 0' }} />

          <Form.Item style={{ marginBottom: 0 }}>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {t('settings.password.changePassword')}
              </Button>
              <Button onClick={() => {
                form.resetFields();
                setPasswordStrength({
                  score: 0,
                  label: '',
                  color: colors.text.tertiary,
                  checks: { length: false, uppercase: false, lowercase: false, number: false, special: false },
                });
              }}>
                {t('common.cancel')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ChangePassword;