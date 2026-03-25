/**
 * 测试页面
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Button, Table } from 'antd';

const TestPage: React.FC = () => {
  const { t } = useTranslation();

  const columns = [
    { title: t('components.testPage.name'), dataIndex: 'name', key: 'name' },
    { title: t('components.testPage.age'), dataIndex: 'age', key: 'age' },
    { title: t('components.testPage.address'), dataIndex: 'address', key: 'address' },
  ];

  const data = [
    { key: '1', name: '张三', age: 28, address: '北京市朝阳区' },
    { key: '2', name: '李四', age: 32, address: '上海市浦东新区' },
    { key: '3', name: '王五', age: 25, address: '广州市天河区' },
  ];

  return (
    <Card title={t('components.testPage.title')} variant="borderless">
      <p>{t('components.testPage.renderOk')}</p>
      <Button type="primary" style={{ marginBottom: 16 }}>{t('components.testPage.testButton')}</Button>
      <Table columns={columns} dataSource={data} />
    </Card>
  );
};

export default TestPage;
