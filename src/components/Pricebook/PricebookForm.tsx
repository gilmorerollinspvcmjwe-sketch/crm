/**
 * 价格表表单组件
 * 用于创建和编辑价格表
 */
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Select, DatePicker, Switch, Divider, Button, Space, message, InputNumber, Card, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { Pricebook, PricebookType, PricebookStatus } from '../../types/pricebook';
import { getPricebookById, createPricebook, updatePricebook } from '../../services/pricebookService';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

interface PricebookFormProps {
  initialValues?: Partial<Pricebook>;
  onSubmit?: (values: any) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  isEdit?: boolean;
  /** 是否作为独立页面使用 */
  standalone?: boolean;
}

/**
 * 价格表表单组件
 */
export const PricebookForm: React.FC<PricebookFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  loading = false,
  isEdit = false,
  standalone = false,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [pricebookType, setPricebookType] = useState<PricebookType | undefined>(
    initialValues?.type
  );
  const [isCustomerPricebook, setIsCustomerPricebook] = useState(false);
  const [internalLoading, setInternalLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  // 独立页面模式下，自动加载数据
  useEffect(() => {
    if (standalone && params.id && !initialValues) {
      const loadPricebook = async () => {
        setInitialLoading(true);
        try {
          const data = await getPricebookById(params.id);
          if (data) {
            form.setFieldsValue({
              ...data,
              validFrom: data.validFrom ? dayjs(data.validFrom) : undefined,
              validTo: data.validTo ? dayjs(data.validTo) : undefined,
              status: data.status ?? PricebookStatus.DRAFT,
            });
            setPricebookType(data.type);
            setIsCustomerPricebook(data.type === PricebookType.CUSTOMER);
          }
        } catch (error) {
          message.error(t('pricebook.form.loadFailed'));
        } finally {
          setInitialLoading(false);
        }
      };
      loadPricebook();
    } else if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        validFrom: initialValues.validFrom ? dayjs(initialValues.validFrom) : undefined,
        validTo: initialValues.validTo ? dayjs(initialValues.validTo) : undefined,
        status: initialValues.status ?? PricebookStatus.DRAFT,
      });
      setPricebookType(initialValues.type);
      setIsCustomerPricebook(initialValues.type === PricebookType.CUSTOMER);
    }
  }, [initialValues, form, standalone, params.id]);

  const handleTypeChange = (value: PricebookType) => {
    setPricebookType(value);
    setIsCustomerPricebook(value === PricebookType.CUSTOMER);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const submitValues = {
        ...values,
        validFrom: values.validFrom ? values.validFrom.format('YYYY-MM-DD') : undefined,
        validTo: values.validTo ? values.validTo.format('YYYY-MM-DD') : undefined,
      };
      
      if (onSubmit) {
        await onSubmit(submitValues);
      } else if (standalone) {
        // 独立页面模式下自己处理提交
        setInternalLoading(true);
        try {
          if (isEdit && params.id) {
            await updatePricebook(params.id, submitValues);
            message.success(t('pricebook.form.updateSuccess'));
          } else {
            await createPricebook(submitValues);
            message.success(t('pricebook.form.createSuccess'));
          }
          navigate('/pricebooks/list');
        } catch (error) {
          message.error(isEdit ? t('pricebook.form.updateFailed') : t('pricebook.form.createFailed'));
        } finally {
          setInternalLoading(false);
        }
      }
    } catch (error) {
      console.error(t('pricebook.form.validationFailed'), error);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else if (standalone) {
      navigate('/pricebooks/list');
    }
  };

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          status: PricebookStatus.DRAFT,
          currency: 'CNY',
          ...initialValues,
        }}
      >
        <Divider orientation="left" orientationMargin="0">{t('pricebook.form.basicInfo')}</Divider>

        <Form.Item
          name="name"
          label={t('pricebook.form.name')}
          rules={[{ required: true, message: t('pricebook.form.nameRequired') }]}
        >
          <Input placeholder={t('pricebook.form.namePlaceholder')} disabled={isEdit} />
        </Form.Item>

        <Form.Item
          name="type"
          label={t('pricebook.form.type')}
          rules={[{ required: true, message: t('pricebook.form.typeRequired') }]}
        >
          <Select 
            placeholder={t('pricebook.form.typePlaceholder')} 
            onChange={handleTypeChange}
            disabled={isEdit}
          >
            <Option value={PricebookType.STANDARD}>{t('pricebook.type.standard')}</Option>
            <Option value={PricebookType.CUSTOMER}>{t('pricebook.type.customer')}</Option>
            <Option value={PricebookType.PARTNER}>{t('pricebook.type.partner')}</Option>
            <Option value={PricebookType.PROMOTION}>{t('pricebook.type.promotion')}</Option>
          </Select>
        </Form.Item>

        {isCustomerPricebook && (
          <Form.Item
            name="customerId"
            label={t('pricebook.form.relatedCustomer')}
            rules={[{ required: true, message: t('pricebook.form.relatedCustomerRequired') }]}
          >
            <Select placeholder={t('pricebook.form.selectCustomer')} showSearch allowClear>
              <Option value="CUST001">{t('pricebook.form.mockCustomer1')}</Option>
              <Option value="CUST002">{t('pricebook.form.mockCustomer2')}</Option>
              <Option value="CUST003">{t('pricebook.form.mockCustomer3')}</Option>
            </Select>
          </Form.Item>
        )}

        <Form.Item name="description" label={t('pricebook.form.description')}>
          <TextArea rows={3} placeholder={t('pricebook.form.descriptionPlaceholder')} />
        </Form.Item>

        <Divider orientation="left" orientationMargin="0">{t('pricebook.form.validPeriod')}</Divider>

        <Form.Item
          name="validFrom"
          label={t('pricebook.form.validFrom')}
          rules={[{ required: true, message: t('pricebook.form.validFromRequired') }]}
        >
          <DatePicker style={{ width: '100%' }} placeholder={t('pricebook.form.validFromPlaceholder')} disabled={isEdit} />
        </Form.Item>

        <Form.Item name="validTo" label={t('pricebook.form.validTo')}>
          <DatePicker style={{ width: '100%' }} placeholder={t('pricebook.form.validToPlaceholder')} />
        </Form.Item>

        <Form.Item
          name="currency"
          label={t('pricebook.form.currency')}
          rules={[{ required: true, message: t('pricebook.form.currencyRequired') }]}
        >
          <Select placeholder={t('pricebook.form.currencyPlaceholder')} disabled>
            <Option value="CNY">{t('pricebook.form.currencyCNY')}</Option>
            <Option value="USD">{t('pricebook.form.currencyUSD')}</Option>
            <Option value="EUR">{t('pricebook.form.currencyEUR')}</Option>
          </Select>
        </Form.Item>

        <Divider orientation="left" orientationMargin="0">{t('pricebook.form.statusSettings')}</Divider>

        <Form.Item
          name="status"
          label={t('pricebook.form.status')}
          rules={[{ required: true, message: t('pricebook.form.statusRequired') }]}
        >
          <Select placeholder={t('pricebook.form.statusPlaceholder')}>
            <Option value={PricebookStatus.DRAFT}>{t('pricebook.status.draft')}</Option>
            <Option value={PricebookStatus.ACTIVE}>{t('pricebook.status.active')}</Option>
            <Option value={PricebookStatus.INACTIVE}>{t('pricebook.status.inactive')}</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="isSystem"
          label={t('pricebook.form.isSystem')}
          valuePropName="checked"
          tooltip={t('pricebook.form.isSystemTooltip')}
        >
          <Switch checkedChildren={t('common.yes')} unCheckedChildren={t('common.no')} disabled={isEdit} />
        </Form.Item>
      </Form>

      <Divider />

      <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={handleCancel}>{t('common.cancel')}</Button>
        <Button type="primary" onClick={handleSubmit} loading={loading || internalLoading}>
          {isEdit ? t('common.save') : t('common.create')}
        </Button>
      </Space>
    </>
  );
};

export default PricebookForm;