import React, { useState } from 'react';
import { Card, Form, Input, Select, DatePicker, Button, Upload, message, Typography, Space, Divider } from 'antd';
import { ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { ActivityType, RelatedObjectType } from '../types/activity';
import dayjs from 'dayjs';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// 富文本编辑器占位组件（使用 TextArea 替代）
const RichTextEditor: React.FC<{ value?: string; onChange?: (value: string) => void; t: (key: string, options?: any) => string }> = ({ value, onChange, t }) => {
  return (
    <div>
      <div style={{ marginBottom: 8, padding: 8, background: '#f5f5f5', borderRadius: 4 }}>
        <Space size="small">
          <Button size="small">B</Button>
          <Button size="small">I</Button>
          <Button size="small">U</Button>
          <Button size="small">{t('activity.form.list')}</Button>
          <Button size="small">{t('activity.form.link')}</Button>
        </Space>
      </div>
      <TextArea
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        rows={8}
        placeholder={t('activity.form.contentRichPlaceholder')}
      />
      <div style={{ marginTop: 4, fontSize: 12, color: '#999' }}>
        {t('activity.form.richTextHint')}
      </div>
    </div>
  );
};

/**
 * 跟进表单页
 * 功能：
 * - 跟进对象：选择客户/联系人/商机/线索
 * - 跟进类型：电话/拜访/邮件/微信/会议
 * - 跟进内容：富文本编辑器
 * - 下次跟进时间：日期选择器
 * - 附件上传：支持图片、文件
 */
export const ActivityForm: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

  // 处理提交
  const handleSubmit = () => {
    form
      .validateFields()
      .then(values => {
        setLoading(true);
        // 模拟提交
        setTimeout(() => {
          setLoading(false);
          message.success(t('activity.list.createSuccess'));
          onBack?.();
        }, 1000);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  // 处理取消
  const handleCancel = () => {
    onBack?.();
  };

  // 跟进类型选项
  const activityTypeOptions = [
    { value: ActivityType.PHONE, label: t('activity.type.phone') },
    { value: ActivityType.VISIT, label: t('activity.type.visit') },
    { value: ActivityType.EMAIL, label: t('activity.type.email') },
    { value: ActivityType.WECHAT, label: t('activity.type.wechat') },
    { value: ActivityType.MEETING, label: t('activity.type.meeting') },
    { value: ActivityType.OTHER, label: t('activity.type.other') }
  ];

  // 对象类型选项
  const objectTypeOptions = [
    { value: RelatedObjectType.CUSTOMER, label: t('activity.relatedObjectType.customer') },
    { value: RelatedObjectType.CONTACT, label: t('activity.relatedObjectType.contact') },
    { value: RelatedObjectType.OPPORTUNITY, label: t('activity.relatedObjectType.opportunity') },
    { value: RelatedObjectType.LEAD, label: t('activity.relatedObjectType.lead') }
  ];

  // 跟进方式选项
  const methodOptions = [
    { value: '呼入', label: t('activity.method.inbound') },
    { value: '呼出', label: t('activity.method.outbound') },
    { value: '上门', label: t('activity.method.onSite') },
    { value: '在线', label: t('activity.method.online') }
  ];

  // 跟进结果选项
  const resultOptions = [
    { value: '有进展', label: t('activity.result.progress') },
    { value: '无进展', label: t('activity.result.noProgress') },
    { value: '需跟进', label: t('activity.result.needFollowUp') }
  ];

  // 意向度选项
  const interestOptions = [
    { value: '高', label: t('activity.interestLevel.high') },
    { value: '中', label: t('activity.interestLevel.medium') },
    { value: '低', label: t('activity.interestLevel.low') }
  ];

  // 附件上传配置
  const uploadProps = {
    name: 'file',
    action: '/api/upload',
    multiple: true,
    maxCount: 10,
    beforeUpload: (file: File) => {
      const isImage = file.type.startsWith('image/');
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isImage) {
        message.error(t('activity.form.uploadImageOnly'));
        return false;
      }
      if (!isLt5M) {
        message.error(t('activity.form.uploadSizeLimit'));
        return false;
      }
      return true;
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Card>
        {/* 头部 */}
        <Space style={{ marginBottom: 24 }}>
          <Button onClick={handleCancel} icon={<ArrowLeftOutlined />}>
            {t('activity.form.back')}
          </Button>
          <Title level={3} style={{ margin: 0 }}>{t('activity.form.createTitle')}</Title>
        </Space>

        <Form
          form={form}
          layout="vertical"
          style={{ maxWidth: 800 }}
        >
          {/* 基本信息 */}
          <Title level={5}>{t('activity.form.basicInfo')}</Title>
          <Divider style={{ margin: '12px 0' }} />

          <Form.Item
            name="relatedObjectType"
            label={t('activity.form.relatedObjectType')}
            rules={[{ required: true, message: t('activity.form.relatedObjectTypeRequired') }]}
          >
            <Select placeholder={t('activity.form.typePlaceholder')}>
              {objectTypeOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="relatedObjectId"
            label={t('activity.form.relatedObject')}
            rules={[{ required: true, message: t('activity.form.relatedObjectRequired') }]}
            extra={t('activity.form.relatedObjectExtra')}
          >
            <Select placeholder={t('activity.form.relatedObjectSelectPlaceholder')} showSearch>
              {/* 这里应该根据 selectedType 动态加载选项 */}
              <Option value="OPP20260312001">某某科技有限公司 CRM 系统采购项目</Option>
              <Option value="CUST001">某某科技有限公司</Option>
              <Option value="CONT001">张三</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="type"
            label={t('activity.form.type')}
            rules={[{ required: true, message: t('activity.form.typeRequired') }]}
          >
            <Select placeholder={t('activity.form.typePlaceholder')}>
              {activityTypeOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="subject"
            label={t('activity.form.subject')}
            rules={[{ required: true, message: t('activity.form.subjectRequired') }]}
          >
            <Input placeholder={t('activity.form.subjectPlaceholder')} maxLength={100} showCount />
          </Form.Item>

          {/* 跟进内容 */}
          <Title level={5}>{t('activity.form.activityContent')}</Title>
          <Divider style={{ margin: '12px 0' }} />

          <Form.Item
            name="content"
            label={t('activity.form.content')}
            rules={[{ required: true, message: t('activity.form.contentRequired') }]}
          >
            <RichTextEditor value={content} onChange={setContent} t={t} />
          </Form.Item>

          {/* 跟进详情 */}
          <Title level={5}>{t('activity.form.activityDetails')}</Title>
          <Divider style={{ margin: '12px 0' }} />

          <Form.Item
            name="activityTime"
            label={t('activity.form.activityTime')}
            rules={[{ required: true, message: t('activity.form.activityTimeRequired') }]}
            initialValue={dayjs()}
          >
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="method"
            label={t('activity.form.method')}
          >
            <Select placeholder={t('activity.form.methodPlaceholder')} allowClear>
              {methodOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="duration"
            label={t('activity.form.duration')}
          >
            <Input type="number" placeholder={t('activity.form.durationPlaceholder')} min={1} max={1440} />
          </Form.Item>

          <Form.Item
            name="nextFollowupTime"
            label={t('activity.form.nextFollowUpTime')}
          >
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="nextFollowupContent"
            label={t('activity.form.nextFollowupContent')}
          >
            <Input placeholder={t('activity.form.nextFollowupContentPlaceholder')} maxLength={200} />
          </Form.Item>

          <Form.Item
            name="result"
            label={t('activity.form.result')}
          >
            <Select placeholder={t('activity.form.resultPlaceholder')} allowClear>
              {resultOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="interestLevel"
            label={t('activity.form.interestLevel')}
          >
            <Select placeholder={t('activity.form.interestLevelPlaceholder')} allowClear>
              {interestOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* 附件上传 */}
          <Title level={5}>{t('activity.form.attachments')}</Title>
          <Divider style={{ margin: '12px 0' }} />

          <Form.Item label={t('activity.form.uploadImages')}>
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>{t('activity.form.uploadButton')}</Button>
            </Upload>
            <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
              {t('activity.form.uploadHint')}
            </div>
          </Form.Item>

          {/* 操作按钮 */}
          <Divider />
          <Form.Item>
            <Space>
              <Button type="primary" onClick={handleSubmit} loading={loading}>
                {t('activity.form.submit')}
              </Button>
              <Button onClick={handleCancel}>
                {t('activity.form.cancel')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ActivityForm;