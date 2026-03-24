/**
 * 测试页面
 */
import React from 'react';
import { Card, Button, Table } from 'antd';

const TestPage: React.FC = () => {
  const columns = [
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '年龄', dataIndex: 'age', key: 'age' },
    { title: '地址', dataIndex: 'address', key: 'address' },
  ];

  const data = [
    { key: '1', name: '张三', age: 28, address: '北京市朝阳区' },
    { key: '2', name: '李四', age: 32, address: '上海市浦东新区' },
    { key: '3', name: '王五', age: 25, address: '广州市天河区' },
  ];

  return (
    <Card title="🧪 测试页面" bordered={false}>
      <p>如果能看到这个页面，说明页面渲染正常！</p>
      <Button type="primary" style={{ marginBottom: 16 }}>测试按钮</Button>
      <Table columns={columns} dataSource={data} />
    </Card>
  );
};

export default TestPage;
