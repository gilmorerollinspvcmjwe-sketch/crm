/**
 * 联系人详情页
 * 功能：
 * - 基本信息展示
 * - 关联客户：显示所属客户信息
 * - 操作按钮：编辑、删除
 */
import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Button, Space, Tag, message } from 'antd';
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { getContactById } from '../mock/contactData';
import { getCustomerById } from '../mock/customerData';
import { Contact, Gender, JobLevel, DecisionRole } from '../types/contact';
import { Customer } from '../types/customer';

/**
 * 联系人详情页组件
 */
export const ContactDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [contact, setContact] = useState<Contact | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);

  /** 加载联系人详情 */
  const loadContactDetail = () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = getContactById(id);
      if (data) {
        setContact(data);
        // 加载关联客户
        if (data.customerId) {
          const customerData = getCustomerById(data.customerId);
          setCustomer(customerData || null);
        }
      } else {
        message.error('联系人不存在');
      }
    } catch (error) {
      message.error('加载联系人详情失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /** 初始加载 */
  useEffect(() => {
    loadContactDetail();
  }, [id]);

  /** 返回列表 */
  const handleBack = () => {
    // 从客户详情跳转过来的，返回客户详情；否则返回联系人列表
    if (location.state?.from === 'customer') {
      navigate(-1);
    } else {
      navigate('/contact/list');
    }
  };

  /** 编辑联系人 */
  const handleEdit = () => {
    message.info('编辑联系人功能待实现');
  };

  /** 删除联系人 */
  const handleDelete = () => {
    message.success('删除联系人功能待实现');
  };

  /** 查看客户详情 */
  const handleViewCustomer = () => {
    if (contact?.customerId) {
      navigate(`/customer/${contact.customerId}`);
    }
  };

  if (!contact) {
    return <div>联系人不存在</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      {/* 头部操作栏 */}
      <Card style={{ marginBottom: 16 }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
            返回
          </Button>
          <Space style={{ marginLeft: 'auto' }}>
            <Button icon={<EditOutlined />} onClick={handleEdit}>
              编辑
            </Button>
            <Button danger icon={<DeleteOutlined />} onClick={handleDelete}>
              删除
            </Button>
          </Space>
        </Space>
      </Card>

      {/* 基本信息 */}
      <Card title="基本信息" style={{ marginBottom: 16 }} loading={loading}>
        <Descriptions column={3} bordered>
          <Descriptions.Item label="联系人 ID" span={1}>
            {contact.id}
          </Descriptions.Item>
          <Descriptions.Item label="姓名" span={2}>
            {contact.name}
            <Tag color={contact.gender === '男' ? 'blue' : 'pink'} style={{ marginLeft: 8 }}>
              {contact.gender}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="职位" span={1}>
            {contact.position || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="职级" span={1}>
            {contact.jobLevel ? <Tag>{contact.jobLevel}</Tag> : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="决策角色" span={1}>
            {contact.decisionRole ? (
              <Tag color={
                contact.decisionRole === '决策者' ? 'red' :
                contact.decisionRole === '影响者' ? 'orange' :
                contact.decisionRole === '使用者' ? 'green' : 'purple'
              }>
                {contact.decisionRole}
              </Tag>
            ) : (
              '-'
            )}
          </Descriptions.Item>
          <Descriptions.Item label="所属客户" span={3}>
            {customer ? (
              <Button type="link" onClick={handleViewCustomer}>
                {customer.name}
              </Button>
            ) : (
              contact.customerName || '-'
            )}
          </Descriptions.Item>
          <Descriptions.Item label="手机号码" span={1}>
            {contact.mobile || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="办公电话" span={1}>
            {contact.officePhone || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="邮箱" span={1}>
            {contact.email || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="微信" span={1}>
            {contact.wechat || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="QQ" span={1}>
            {contact.qq || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="办公地址" span={3}>
            {contact.address || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="生日" span={1}>
            {contact.birthday || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="入职时间" span={1}>
            {contact.joinDate || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="学历" span={1}>
            {contact.education ? (
              <span>
                {contact.education}
                {contact.school && ` - ${contact.school}`}
                {contact.major && ` - ${contact.major}`}
              </span>
            ) : (
              '-'
            )}
          </Descriptions.Item>
          <Descriptions.Item label="兴趣爱好" span={3}>
            {contact.hobbies || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="负责人" span={1}>
            {contact.ownerName || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间" span={1}>
            {contact.createdAt}
          </Descriptions.Item>
          <Descriptions.Item label="创建人" span={1}>
            {contact.createdBy}
          </Descriptions.Item>
          <Descriptions.Item label="备注" span={3}>
            {contact.remark || '-'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 关联客户信息 */}
      {customer && (
        <Card title="关联客户" style={{ marginBottom: 16 }}>
          <Descriptions column={3} bordered size="small">
            <Descriptions.Item label="客户名称" span={1}>
              <Button type="link" onClick={handleViewCustomer}>
                {customer.name}
              </Button>
            </Descriptions.Item>
            <Descriptions.Item label="所属行业" span={1}>
              <Tag>{customer.industry}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="企业规模" span={1}>
              {customer.companySize || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="客户等级" span={1}>
              <Tag color={customer.level === 'A' ? 'red' : customer.level === 'B' ? 'orange' : 'blue'}>
                {customer.level}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="客户状态" span={1}>
              <Tag color={customer.status === '成交' ? 'success' : 'default'}>
                {customer.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="负责人" span={1}>
              {customer.ownerName || '-'}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}
    </div>
  );
};

export default ContactDetail;
