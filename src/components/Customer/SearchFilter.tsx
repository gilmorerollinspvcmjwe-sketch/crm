/**
 * 通用搜索筛选组件
 * 支持多条件组合筛选
 */
import React from 'react';
import { Form, Input, Select, Space, Button } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

/** 筛选字段配置 */
export interface FilterField {
  /** 字段名 */
  name: string;
  /** 字段标签 */
  label: string;
  /** 字段类型 */
  type: 'text' | 'select';
  /** 占位符 */
  placeholder?: string;
  /** 选项（仅 select 类型） */
  options?: { label: string; value: string }[];
}

interface SearchFilterProps {
  /** 筛选字段配置 */
  fields: FilterField[];
  /** 搜索回调 */
  onSearch: (values: Record<string, string>) => void;
  /** 重置回调 */
  onReset?: () => void;
  /** 加载中 */
  loading?: boolean;
}

/**
 * 搜索筛选组件
 * 
 * @example
 * ```tsx
 * <SearchFilter
 *   fields={[
 *     { name: 'name', label: '客户名称', type: 'text', placeholder: '请输入客户名称' },
 *     { name: 'industry', label: '行业', type: 'select', options: [...] },
 *   ]}
 *   onSearch={(values) => handleSearch(values)}
 *   onReset={() => handleReset()}
 * />
 * ```
 */
export const SearchFilter: React.FC<SearchFilterProps> = ({
  fields,
  onSearch,
  onReset,
  loading = false,
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  /** 处理搜索 */
  const handleSearch = () => {
    form.validateFields().then((values) => {
      // 过滤空值
      const filteredValues = Object.fromEntries(
        Object.entries(values).filter(([_, value]) => value !== undefined && value !== '')
      ) as Record<string, string>;
      onSearch(filteredValues);
    });
  };

  /** 处理重置 */
  const handleReset = () => {
    form.resetFields();
    onReset?.();
    // 重置后立即搜索全部
    const filteredValues = Object.fromEntries(
      Object.entries(form.getFieldsValue()).filter(([_, value]) => value !== undefined && value !== '')
    ) as Record<string, string>;
    onSearch(filteredValues);
  };

  /** 渲染表单项 */
  const renderFormItem = (field: FilterField) => {
    const { name, label, type, placeholder, options } = field;

    if (type === 'select') {
      return (
        <Form.Item key={name} name={name} label={label}>
          <Select placeholder={placeholder || t('searchFilter.selectPlaceholder', { label })} allowClear>
            {options?.map((opt) => (
              <Option key={opt.value} value={opt.value}>
                {opt.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
      );
    }

    return (
      <Form.Item key={name} name={name} label={label}>
        <Input placeholder={placeholder || t('searchFilter.inputPlaceholder', { label })} allowClear />
      </Form.Item>
    );
  };

  return (
    <Form form={form} layout="inline" style={{ marginBottom: 16 }}>
      {fields.map(renderFormItem)}
      <Form.Item>
        <Space>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearch}
            loading={loading}
          >
            {t('searchFilter.search')}
          </Button>
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            {t('searchFilter.reset')}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};