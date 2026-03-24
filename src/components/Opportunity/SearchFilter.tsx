import React from 'react';
import { Form, Input, Select, Row, Col, Button, Space } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

// 通用搜索筛选组件属性
interface SearchFilterProps {
  // 筛选字段配置
  filters?: {
    name?: boolean; // 名称搜索
    customerName?: boolean; // 客户名称搜索
    stage?: boolean; // 阶段筛选
    status?: boolean; // 状态筛选
    owner?: boolean; // 负责人筛选
    contractNumber?: boolean; // 合同编号
    type?: boolean; // 类型筛选
  };
  // 阶段选项（商机用）
  stageOptions?: { value: string; label: string }[];
  // 状态选项
  statusOptions?: { value: string; label: string }[];
  // 类型选项
  typeOptions?: { value: string; label: string }[];
  // 负责人选项
  ownerOptions?: { value: string; label: string }[];
  // 表单提交回调
  onSearch: (values: any) => void;
  // 重置回调
  onReset?: () => void;
  // 加载状态
  loading?: boolean;
}

/**
 * 通用搜索筛选组件
 * 支持动态配置筛选字段
 */
export const SearchFilter: React.FC<SearchFilterProps> = ({
  filters = { name: true, customerName: true, stage: false, status: false, owner: false },
  stageOptions = [],
  statusOptions = [],
  typeOptions = [],
  ownerOptions = [],
  onSearch,
  onReset,
  loading = false
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  // 处理表单提交
  const handleSubmit = () => {
    form
      .validateFields()
      .then(values => {
        onSearch(values);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  // 处理重置
  const handleReset = () => {
    form.resetFields();
    onReset?.();
    // 重置后自动搜索
    const values = form.getFieldsValue();
    onSearch(values);
  };

  return (
    <Form form={form} layout="inline" onFinish={onSearch} style={{ marginBottom: 16 }}>
      <Row gutter={16} wrap={false}>
        {/* 名称搜索 */}
        {filters.name && (
          <Col flex="200px">
            <Form.Item name="name" label={t('searchFilter.name')}>
              <Input placeholder={t('searchFilter.namePlaceholder')} allowClear />
            </Form.Item>
          </Col>
        )}

        {/* 客户名称搜索 */}
        {filters.customerName && (
          <Col flex="200px">
            <Form.Item name="customerName" label={t('searchFilter.customerName')}>
              <Input placeholder={t('searchFilter.customerNamePlaceholder')} allowClear />
            </Form.Item>
          </Col>
        )}

        {/* 合同编号搜索 */}
        {filters.contractNumber && (
          <Col flex="200px">
            <Form.Item name="contractNumber" label={t('searchFilter.contractNumber')}>
              <Input placeholder={t('searchFilter.contractNumberPlaceholder')} allowClear />
            </Form.Item>
          </Col>
        )}

        {/* 阶段筛选 */}
        {filters.stage && stageOptions.length > 0 && (
          <Col flex="200px">
            <Form.Item name="stage" label={t('searchFilter.stage')}>
              <Select placeholder={t('searchFilter.stagePlaceholder')} allowClear>
                {stageOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        )}

        {/* 状态筛选 */}
        {filters.status && statusOptions.length > 0 && (
          <Col flex="200px">
            <Form.Item name="status" label={t('searchFilter.status')}>
              <Select placeholder={t('searchFilter.statusPlaceholder')} allowClear>
                {statusOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        )}

        {/* 类型筛选 */}
        {filters.type && typeOptions.length > 0 && (
          <Col flex="200px">
            <Form.Item name="type" label={t('searchFilter.type')}>
              <Select placeholder={t('searchFilter.typePlaceholder')} allowClear>
                {typeOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        )}

        {/* 负责人筛选 */}
        {filters.owner && ownerOptions.length > 0 && (
          <Col flex="200px">
            <Form.Item name="owner" label={t('searchFilter.owner')}>
              <Select placeholder={t('searchFilter.ownerPlaceholder')} allowClear>
                {ownerOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        )}

        {/* 操作按钮 */}
        <Col flex="auto">
          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SearchOutlined />}
                loading={loading}
              >
                {t('searchFilter.search')}
              </Button>
              <Button
                htmlType="button"
                icon={<ReloadOutlined />}
                onClick={handleReset}
              >
                {t('searchFilter.reset')}
              </Button>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default SearchFilter;