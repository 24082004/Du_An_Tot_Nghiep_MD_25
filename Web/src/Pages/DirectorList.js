import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Typography, Avatar, message, Input, Modal } from 'antd';
import { PlusOutlined, ReloadOutlined, UserOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import ApiService from '../services/ApiService';

const { Link: AntLink } = Typography;

const DirectorList = () => {
  const [directors, setDirectors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredDirectors, setFilteredDirectors] = useState([]);

  // Fetch directors from API
  const fetchDirectors = async () => {
    setLoading(true);
    try {
      const response = await ApiService.getDirectors();
      
      if (response.success) {
        console.log('Directors data:', response.data);
        setDirectors(response.data);
        setFilteredDirectors(response.data);
        message.success(`Đã tải ${response.data.length} đạo diễn`);
      } else {
        message.error(response.message || 'Lỗi khi tải danh sách đạo diễn');
      }
    } catch (error) {
      console.error('Error fetching directors:', error);
      message.error('Lỗi kết nối API: ' + error.message);
      
      // Fallback data nếu API lỗi
      const fallbackData = [
        {
          _id: '1',
          name: 'Victor Vũ',
          image: null
        },
        {
          _id: '2',
          name: 'Ngô Thanh Vân',
          image: null
        },
        {
          _id: '3',
          name: 'Charlie Nguyễn',
          image: null
        },
      ];
      setDirectors(fallbackData);
      setFilteredDirectors(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  // Search functionality
  const handleSearch = (value) => {
    setSearchText(value);
    if (!value) {
      setFilteredDirectors(directors);
    } else {
      const filtered = directors.filter(director => {
        return director.name.toLowerCase().includes(value.toLowerCase());
      });
      setFilteredDirectors(filtered);
    }
  };

  // Handle director detail view
  const handleViewDetail = (director) => {
    Modal.info({
      title: 'Thông tin đạo diễn',
      width: 400,
      content: (
        <div style={{ padding: '16px 0' }}>
          <div style={{ marginBottom: 16, textAlign: 'center' }}>
            {director.image ? (
              <Avatar 
                size={80} 
                src={director.image}
              />
            ) : (
              <Avatar 
                size={80} 
                style={{ backgroundColor: '#87d068', fontSize: '32px' }} 
                icon={<UserOutlined />}
              >
                {director.name?.charAt(0).toUpperCase()}
              </Avatar>
            )}
          </div>
          <div style={{ lineHeight: '2' }}>
            <p><strong>Tên:</strong> {director.name}</p>
          </div>
        </div>
      ),
      onOk() {},
    });
  };

  // Load data on component mount
  useEffect(() => {
    fetchDirectors();
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
            style={{ backgroundColor: '#87d068' }} 
            icon={<UserOutlined />}
            size="large"
          >
            {record.name?.charAt(0).toUpperCase()}
          </Avatar>
        )
      ),
    },
    {
      title: 'Tên đạo diễn',
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
          <Link to={`/admin/director/edit/${record._id}`}>
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
        <h2 style={{ margin: 0 }}>Danh sách đạo diễn</h2>
        <Space>
          <Button 
            type="primary" 
            icon={<ReloadOutlined />}
            onClick={fetchDirectors}
            loading={loading}
          >
            Refresh
          </Button>
          <Link to="/admin/director/add">
            <Button type="primary" icon={<PlusOutlined />}>
              Thêm đạo diễn
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
          Hiển thị {filteredDirectors.length} / {directors.length} đạo diễn
        </span>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredDirectors}
        rowKey="_id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} của ${total} đạo diễn`,
        }}
        bordered
        scroll={{ x: 800 }}
      />
    </div>
  );
};

export default DirectorList;