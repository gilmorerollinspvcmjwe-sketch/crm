import React, { useState } from 'react';
import { Card, Form, Input, Select, DatePicker, Button, Upload, message, Typography, Space, Divider } from 'antd';
import { ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons';
import { ActivityType, RelatedObjectType } from '../types/activity';
import dayjs from 'dayjs';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// 富文本编辑器占位组件（使用 TextArea 替代）
const RichTextEditor: React.FC<{ value?: string; onChange?: (value: string) => void }> = ({ value, onChange }) => {
  return (
    <div>
      <div style={{ marginBottom: 8, padding: 8, background: '#f5f5f5', borderRadius: 4 }}>
        <Space size="small">
          <Button size="small">B</Button>
          <Button size="small">I</Button>
          <Button size="small">U</Button>
          <Button size="small">列表</Button>
          <Button size="small">链接</Button>
        </Space>
      </div>
      <TextArea
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        rows={8}
        placeholder="请输入跟进内容（支持简单的 HTML 格式）..."
      />
      <div style={{ marginTop: 4, fontSize: 12, color: '#999' }}>
        提示：可以使用 &lt;b&gt;加粗&lt;/b&gt;、&lt;ul&gt;&lt;li&gt;列表&lt;/li&gt;&lt;/ul&gt; 等简单 HTML 标签
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
          message.success('跟进记录创建成功');
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
    { value: ActivityType.PHONE, label: '电话' },
    { value: ActivityType.VISIT, label: '拜访' },
    { value: ActivityType.EMAIL, label: '邮件' },
    { value: ActivityType.WECHAT, label: '微信' },
    { value: ActivityType.MEETING, label: '会议' },
    { value: ActivityType.OTHER, label: '其他' }
  ];

  // 对象类型选项
  const objectTypeOptions = [
    { value: RelatedObjectType.CUSTOMER, label: '客户' },
    { value: RelatedObjectType.CONTACT, label: '联系人' },
    { value: RelatedObjectType.OPPORTUNITY, label: '商机' },
    { value: RelatedObjectType.LEAD, label: '线索' }
  ];

  // 跟进方式选项
  const methodOptions = [
    { value: '呼入', label: '呼入' },
    { value: '呼出', label: '呼出' },
    { value: '上门', label: '上门' },
    { value: '在线', label: '在线' }
  ];

  // 跟进结果选项
  const resultOptions = [
    { value: '有进展', label: '有进展' },
    { value: '无进展', label: '无进展' },
    { value: '需跟进', label: '需跟进' }
  ];

  // 意向度选项
  const interestOptions = [
    { value: '高', label: '高' },
    { value: '中', label: '中' },
    { value: '低', label: '低' }
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
        message.error('只能上传图片文件！');
        return false;
      }
      if (!isLt5M) {
        message.error('图片大小不能超过 5MB！');
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
            返回
          </Button>
          <Title level={3} style={{ margin: 0 }}>新建跟进记录</Title>
        </Space>

        <Form
          form={form}
          layout="vertical"
          style={{ maxWidth: 800 }}
        >
          {/* 基本信息 */}
          <Title level={5}>基本信息</Title>
          <Divider style={{ margin: '12px 0' }} />

          <Form.Item
            name="relatedObjectType"
            label="跟进对象类型"
            rules={[{ required: true, message: '请选择跟进对象类型' }]}
          >
            <Select placeholder="请选择">
              {objectTypeOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="relatedObjectId"
            label="跟进对象"
            rules={[{ required: true, message: '请选择跟进对象' }]}
            extra="选择要关联的客户、联系人、商机或线索"
          >
            <Select placeholder="请先选择对象类型" showSearch>
              {/* 这里应该根据 selectedType 动态加载选项 */}
              <Option value="OPP20260312001">某某科技有限公司 CRM 系统采购项目</Option>
              <Option value="CUST001">某某科技有限公司</Option>
              <Option value="CONT001">张三</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="type"
            label="跟进类型"
            rules={[{ required: true, message: '请选择跟进类型' }]}
          >
            <Select placeholder="请选择">
              {activityTypeOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="subject"
            label="跟进主题"
            rules={[{ required: true, message: '请输入跟进主题' }]}
          >
            <Input placeholder="例如：沟通 CRM 需求细节" maxLength={100} showCount />
          </Form.Item>

          {/* 跟进内容 */}
          <Title level={5}>跟进内容</Title>
          <Divider style={{ margin: '12px 0' }} />

          <Form.Item
            name="content"
            label="跟进内容"
            rules={[{ required: true, message: '请输入跟进内容' }]}
          >
            <RichTextEditor value={content} onChange={setContent} />
          </Form.Item>

          {/* 跟进详情 */}
          <Title level={5}>跟进详情</Title>
          <Divider style={{ margin: '12px 0' }} />

          <Form.Item
            name="activityTime"
            label="跟进时间"
            rules={[{ required: true, message: '请选择跟进时间' }]}
            initialValue={dayjs()}
          >
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="method"
            label="跟进方式"
          >
            <Select placeholder="请选择" allowClear>
              {methodOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="duration"
            label="跟进时长（分钟）"
          >
            <Input type="number" placeholder="例如：30" min={1} max={1440} />
          </Form.Item>

          <Form.Item
            name="nextFollowupTime"
            label="下次跟进时间"
          >
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="nextFollowupContent"
            label="下次跟进内容"
          >
            <Input placeholder="例如：发送方案书" maxLength={200} />
          </Form.Item>

          <Form.Item
            name="result"
            label="跟进结果"
          >
            <Select placeholder="请选择" allowClear>
              {resultOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="interestLevel"
            label="客户意向度"
          >
            <Select placeholder="请选择" allowClear>
              {interestOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* 附件上传 */}
          <Title level={5}>附件</Title>
          <Divider style={{ margin: '12px 0' }} />

          <Form.Item label="上传图片/文件">
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>点击上传</Button>
            </Upload>
            <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
              支持图片格式，单个文件不超过 5MB，最多上传 10 个文件
            </div>
          </Form.Item>

          {/* 操作按钮 */}
          <Divider />
          <Form.Item>
            <Space>
              <Button type="primary" onClick={handleSubmit} loading={loading}>
                提交
              </Button>
              <Button onClick={handleCancel}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ActivityForm;
