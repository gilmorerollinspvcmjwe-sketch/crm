/**
 * 个人信息编辑页
 * 支持头像上传、基本信息编辑、表单校验
 */
import React, { useState } from 'react';
import { Card, Form, Input, Button, Avatar, Upload, message, Space, Row, Col, Divider } from 'antd';
import { UserOutlined, CameraOutlined, MailOutlined, PhoneOutlined, TeamOutlined, SolutionOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { useTranslation } from 'react-i18next';
import { colors } from '../../styles/tokens';
import { mockUserProfile, UserProfile } from '../../mock/settingsData';

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(mockUserProfile);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(mockUserProfile.avatar);

  // 头像上传配置
  const uploadProps: UploadProps = {
    name: 'avatar',
    showUploadList: false,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must be smaller than 2MB!');
        return false;
      }
      // 模拟上传，生成预览 URL
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      return false;
    },
  };

  // 表单提交
  const handleSubmit = async (values: Partial<UserProfile>) => {
    setLoading(true);
    try {
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProfile(prev => ({ ...prev, ...values, avatar: avatarUrl }));
      message.success(t('settings.profile.saveSuccess'));
    } catch {
      message.error(t('settings.profile.saveError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Card
        bordered={false}
        style={{ maxWidth: 800, margin: '0 auto' }}
      >
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: colors.text.primary }}>
            {t('settings.profile.title')}
          </h2>
          <p style={{ margin: '8px 0 0', color: colors.text.secondary, fontSize: 14 }}>
            {t('settings.profile.subtitle')}
          </p>
        </div>

        <Divider style={{ margin: '0 0 24px' }} />

        {/* 头像区域 */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32 }}>
          <Upload {...uploadProps}>
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <Avatar
                size={96}
                src={avatarUrl}
                icon={<UserOutlined />}
                style={{ backgroundColor: colors.primary }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  backgroundColor: colors.primary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid white',
                }}
              >
                <CameraOutlined style={{ color: 'white', fontSize: 12 }} />
              </div>
            </div>
          </Upload>
          <div style={{ marginLeft: 16 }}>
            <div style={{ fontWeight: 500, color: colors.text.primary }}>
              {t('settings.profile.avatar')}
            </div>
            <div style={{ fontSize: 13, color: colors.text.secondary, marginTop: 4 }}>
              {t('settings.profile.avatarHint')}
            </div>
          </div>
        </div>

        {/* 表单区域 */}
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
            position: profile.position,
            department: profile.department,
          }}
          onFinish={handleSubmit}
        >
          <Row gutter={24}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="name"
                label={t('settings.profile.name')}
                rules={[{ required: true, message: t('settings.profile.nameRequired') }]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: colors.text.tertiary }} />}
                  placeholder={t('settings.profile.namePlaceholder')}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="email"
                label={t('settings.profile.email')}
                rules={[
                  { required: true, message: t('settings.profile.emailRequired') },
                  { type: 'email', message: t('settings.profile.emailInvalid') },
                ]}
              >
                <Input
                  prefix={<MailOutlined style={{ color: colors.text.tertiary }} />}
                  placeholder={t('settings.profile.emailPlaceholder')}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="phone"
                label={t('settings.profile.phone')}
                rules={[{ required: true, message: t('settings.profile.phoneRequired') }]}
              >
                <Input
                  prefix={<PhoneOutlined style={{ color: colors.text.tertiary }} />}
                  placeholder={t('settings.profile.phonePlaceholder')}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="position"
                label={t('settings.profile.position')}
              >
                <Input
                  prefix={<SolutionOutlined style={{ color: colors.text.tertiary }} />}
                  placeholder={t('settings.profile.positionPlaceholder')}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="department"
                label={t('settings.profile.department')}
              >
                <Input
                  prefix={<TeamOutlined style={{ color: colors.text.tertiary }} />}
                  placeholder={t('settings.profile.departmentPlaceholder')}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider style={{ margin: '24px 0' }} />

          <Form.Item style={{ marginBottom: 0 }}>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {t('common.save')}
              </Button>
              <Button onClick={() => form.resetFields()}>
                {t('common.cancel')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Profile;