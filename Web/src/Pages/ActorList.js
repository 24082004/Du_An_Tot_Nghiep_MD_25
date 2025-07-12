import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Typography, Avatar, message, Input, Modal } from 'antd';
import { PlusOutlined, ReloadOutlined, UserOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import ApiService from '../services/ApiService';

const { Link: AntLink } = Typography;

const ActorList = () => {
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredActors, setFilteredActors] = useState([]);

  // Fetch actors from API
  const fetchActors = async () => {
    setLoading(true);
    try {
      const response = await ApiService.getActors();
      
      if (response.success) {
        console.log('Actors data:', response.data);
        setActors(response.data);
        setFilteredActors(response.data);
        message.success(`Đã tải ${response.data.length} diễn viên`);
      } else {
        message.error(response.message || 'Lỗi khi tải danh sách diễn viên');
      }
    } catch (error) {
      console.error('Error fetching actors:', error);
      message.error('Lỗi kết nối API: ' + error.message);
      
      // Fallback data nếu API lỗi
      const fallbackData = [
        {
          _id: '1',
          name: 'Ngô Thanh Vân',
          image: null
        },
        {
          _id: '2',
          name: 'Trấn Thành',
          image: null
        },
        {
          _id: '3',
          name: 'Ninh Dương Lan Ngọc',
          image: null
        },
      ];
      setActors(fallbackData);
      setFilteredActors(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  // Search functionality
  const handleSearch = (value) => {
    setSearchText(value);
    if (!value) {
      setFilteredActors(actors);
    } else {
      const filtered = actors.filter(actor => {
        return actor.name.toLowerCase().includes(value.toLowerCase());
      });
      setFilteredActors(filtered);
    }
  };

  // Handle actor detail view
  const handleViewDetail = (actor) => {
    Modal.info({
      title: 'Thông tin diễn viên',
      width: 400,
      content: (
        <div style={{ padding: '16px 0' }}>
          <div style={{ marginBottom: 16, textAlign: 'center' }}>
            {actor.image ? (
              <Avatar 
                size={80} 
                src={actor.image}
              />
            ) : (
              <Avatar 
                size={80} 
                style={{ backgroundColor: '#1890ff', fontSize: '32px' }} 
                icon={<UserOutlined />}
              >
                {actor.name?.charAt(0).toUpperCase()}
              </Avatar>
            )}
          </div>
          <div style={{ lineHeight: '2' }}>
            <p><strong>Tên:</strong> {actor.name}</p>
          </div>
        </div>
      ),
      onOk() {},
    });
  };

  // Load data on component mount
  useEffect(() => {
    fetchActors();
  }, []);

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'image',
      key: 'avatar',
      width: 80,
      render: (image, record) => (
        image ? (
          <Avatar 
            src={image}
            size="large"
          />
        ) : (
          <Avatar 
            style={{ backgroundColor: '#1890ff' }} 
            icon={<UserOutlined />}
            size="large"
          >
            {record.name?.charAt(0).toUpperCase()}
          </Avatar>
        )
      ),
    },
    {
      title: 'Tên diễn viên',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <AntLink 
          onClick={() => handleViewDetail(record)}
          style={{ fontWeight: 'bold', fontSize: '14px' }}
        >
          {text}
        </AntLink>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            Xem
          </Button>
          <Link to={`/admin/actor/edit/${record._id}`}>
            <Button 
              type="default" 
              size="small"
              icon={<EditOutlined />}
            >
              Sửa
            </Button>
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: '#fff', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 24 
      }}>
        <h2 style={{ margin: 0 }}>Danh sách diễn viên</h2>
        <Space>
          <Button 
            type="primary" 
            icon={<ReloadOutlined />}
            onClick={fetchActors}
            loading={loading}
          >
            Refresh
          </Button>
          <Link to="/admin/actor/add">
            <Button type="primary" icon={<PlusOutlined />}>
              Thêm diễn viên
            </Button>
          </Link>
        </Space>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <Input.Search 
          placeholder="Tìm kiếm theo tên..." 
          allowClear 
          style={{ maxWidth: 400 }} 
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          onSearch={handleSearch}
        />
        <span style={{ marginLeft: 16, color: '#666' }}>
          Hiển thị {filteredActors.length} / {actors.length} diễn viên
        </span>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredActors}
        rowKey="_id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} của ${total} diễn viên`,
        }}
        bordered
        scroll={{ x: 800 }}
      />
    </div>
  );
};

export default ActorList;