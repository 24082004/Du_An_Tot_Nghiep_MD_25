import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, Typography, Avatar } from 'antd';
import { PlusOutlined, ReloadOutlined, UserOutlined } from '@ant-design/icons';

const { Link } = Typography;

const DirectorList = () => {
  const [directors, setDirectors] = useState([]);

  useEffect(() => {
    // Giả lập fetch API
    setDirectors([
      {
        id: 1,
        name: 'Victor Vũ',
        email: 'victorvu@gmail.com',
        phone: '0909123456',
        status: 'Đang hoạt động',
        createdAt: '28-06-2025',
      },
      {
        id: 2,
        name: 'Ngô Thanh Vân',
        email: 'ngothanhvan@gmail.com',
        phone: '0909988776',
        status: 'Đang hoạt động',
        createdAt: '28-06-2025',
      },
      {
        id: 3,
        name: 'Charlie Nguyễn',
        email: 'charlie@gmail.com',
        phone: '0911223344',
        status: 'Ngưng hoạt động',
        createdAt: '28-06-2025',
      },
    ]);
  }, []);

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'name',
      key: 'avatar',
      render: (name) => (
        <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />}>
          {name?.charAt(0).toUpperCase()}
        </Avatar>
      ),
    },
    {
      title: 'Tên đạo diễn',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Link>{text}</Link>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Đang hoạt động' ? 'green' : 'volcano'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
  ];

  return (
    <div style={{ padding: 24, background: '#fff', minHeight: '100vh' }}>
      <h2 style={{ marginBottom: 16 }}>Danh sách đạo diễn</h2>

      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />}>
          Thêm đạo diễn
        </Button>
        <Button icon={<ReloadOutlined />}>Refresh</Button>
      </Space>

      <Table
        columns={columns}
        dataSource={directors}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        bordered
      />
    </div>
  );
};

export default DirectorList;
