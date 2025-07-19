import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Avatar,message } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Link } from 'react-router-dom';



const DirectorList = () => {
  const [directors, setDirectors] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDirectors = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://my-backend-api-movie.onrender.com/api/directors');
      //console.log("check response >>", response);
      setDirectors(response.data.data);
      //console.log("check director >>", directors);
    } catch (error) {
      console.error(error);
      message.error('Không thể lấy danh sách đạo diễn');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDirectors();
  }, []);

  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'image',
      render: (image) => <Avatar size={64} src={image} />,
    },
    {
      title: 'Tên đạo diễn',
      dataIndex: 'name',
    },
    {
      title: 'Hành động',
      render: (text, record) => (
        <Space>
          <Button type="link">Sửa</Button>
          <Button type="link" danger>Xóa</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: '#fff', minHeight: '100vh' }}>
      <h2 style={{ marginBottom: 16 }}>Danh sách đạo diễn</h2>

      <Space style={{ marginBottom: 16 }}>
        <Link to="/directors/create">
          <Button type="primary" icon={<PlusOutlined />}>
            Thêm đạo diễn
          </Button>
        </Link>
        <Button icon={<ReloadOutlined />}>Refresh</Button>
    </Space>


      <Table
        columns={columns}
        dataSource={directors}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 5 }}
        bordered
      />
    </div>
  );
};

export default DirectorList;
