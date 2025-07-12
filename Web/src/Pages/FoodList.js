import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Typography, Avatar, Tag, message, Input, Modal, Switch } from 'antd';
import { PlusOutlined, ReloadOutlined, EditOutlined, CoffeeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import ApiService from '../services/ApiService';

const { Link: AntLink } = Typography;
const { Search } = Input;

const formatCurrency = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

const FoodList = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState({});
  const [searchText, setSearchText] = useState('');
  const [filteredFoods, setFilteredFoods] = useState([]);

  // Fetch foods from API
  const fetchFoods = async () => {
    setLoading(true);
    try {
      const response = await ApiService.getFoods();
      
      if (response.success) {
        console.log('Foods data:', response.data);
        setFoods(response.data);
        setFilteredFoods(response.data);
        message.success(`Đã tải ${response.data.length} món ăn/đồ uống`);
      } else {
        message.error(response.message || 'Lỗi khi tải danh sách món ăn/đồ uống');
      }
    } catch (error) {
      console.error('Error fetching foods:', error);
      message.error('Lỗi kết nối API: ' + error.message);
      
      // Fallback data nếu API lỗi
      const fallbackData = [
        {
          _id: '1',
          name: 'Bắp rang bơ (Lớn)',
          price: 65000,
          image: null,
          status: 'available'
        },
        {
          _id: '2',
          name: 'Coca Cola (Lớn)',
          price: 35000,
          image: null,
          status: 'available'
        },
        {
          _id: '3',
          name: 'Combo 2 người',
          price: 125000,
          image: null,
          status: 'unavailable'
        },
      ];
      setFoods(fallbackData);
      setFilteredFoods(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  // Search functionality
  const handleSearch = (value) => {
    setSearchText(value);
    if (!value) {
      setFilteredFoods(foods);
    } else {
      const filtered = foods.filter(food => {
        return food.name.toLowerCase().includes(value.toLowerCase());
      });
      setFilteredFoods(filtered);
    }
  };

  // Handle food detail view
  const handleViewDetail = (food) => {
    Modal.info({
      title: 'Thông tin món ăn/đồ uống',
      width: 400,
      content: (
        <div style={{ padding: '16px 0' }}>
          <div style={{ marginBottom: 16, textAlign: 'center' }}>
            {food.image ? (
              <Avatar 
                size={80} 
                src={food.image}
                shape="square"
              />
            ) : (
              <Avatar 
                size={80} 
                style={{ backgroundColor: '#ffa940', fontSize: '32px' }} 
                icon={<CoffeeOutlined />}
                shape="square"
              />
            )}
          </div>
          <div style={{ lineHeight: '2' }}>
            <p><strong>Tên sản phẩm:</strong> {food.name}</p>
            <p><strong>Giá:</strong> {formatCurrency(food.price)}</p>
            <p><strong>Trạng thái:</strong> 
              <Tag 
                color={food.status === 'available' ? 'green' : 'red'} 
                style={{ marginLeft: 8 }}
              >
                {food.status === 'available' ? 'Đang bán' : 'Ngừng bán'}
              </Tag>
            </p>
          </div>
        </div>
      ),
      onOk() {},
    });
  };

  // Handle status change
  const handleStatusChange = async (id, checked) => {
    const newStatus = checked ? 'available' : 'unavailable';
    
    setStatusLoading(prev => ({ ...prev, [id]: true }));
    
    try {
      const response = await ApiService.updateFood(id, { status: newStatus });
      
      if (response.success) {
        message.success(`Đã ${checked ? 'kích hoạt' : 'vô hiệu hóa'} món ăn/đồ uống`);
        
        // Update local state
        const updatedFoods = foods.map(food => 
          food._id === id ? { ...food, status: newStatus } : food
        );
        setFoods(updatedFoods);
        
        // Update filtered foods
        const updatedFilteredFoods = filteredFoods.map(food => 
          food._id === id ? { ...food, status: newStatus } : food
        );
        setFilteredFoods(updatedFilteredFoods);
      } else {
        message.error(response.message || 'Lỗi khi cập nhật trạng thái');
      }
    } catch (error) {
      console.error('Error updating food status:', error);
      message.error('Lỗi kết nối API: ' + error.message);
    } finally {
      setStatusLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchFoods();
  }, []);

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      width: 80,
      render: (image, record) => (
        image ? (
          <Avatar 
            src={image}
            size="large"
            shape="square"
          />
        ) : (
          <Avatar 
            style={{ backgroundColor: '#ffa940' }} 
            icon={<CoffeeOutlined />}
            size="large"
            shape="square"
          />
        )
      ),
    },
    {
      title: 'Tên sản phẩm',
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
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => formatCurrency(price),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status, record) => (
        <Switch
          checked={status === 'available'}
          loading={statusLoading[record._id]}
          onChange={(checked) => handleStatusChange(record._id, checked)}
          checkedChildren="Đang bán"
          unCheckedChildren="Ngừng bán"
        />
      ),
      filters: [
        { text: 'Đang bán', value: 'available' },
        { text: 'Ngừng bán', value: 'unavailable' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Link to={`/admin/food/edit/${record._id}`}>
          <Button 
            type="primary" 
            size="middle"
            icon={<EditOutlined />}
            style={{ 
              backgroundColor: '#1890ff', 
              borderColor: '#1890ff',
              fontWeight: 'bold',
              boxShadow: '0 2px 5px rgba(24, 144, 255, 0.3)'
            }}
          >
            Sửa
          </Button>
        </Link>
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
        <h2 style={{ margin: 0 }}>Danh sách món ăn/đồ uống</h2>
        <Space>
          <Button 
            type="primary" 
            icon={<ReloadOutlined />}
            onClick={fetchFoods}
            loading={loading}
          >
            Refresh
          </Button>
          <Link to="/admin/food/add">
            <Button type="primary" icon={<PlusOutlined />}>
              Thêm món mới
            </Button>
          </Link>
        </Space>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <Search
          placeholder="Tìm kiếm theo tên..." 
          allowClear 
          style={{ maxWidth: 400 }} 
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          onSearch={handleSearch}
        />
        <span style={{ marginLeft: 16, color: '#666' }}>
          Hiển thị {filteredFoods.length} / {foods.length} món ăn/đồ uống
        </span>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredFoods}
        rowKey="_id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} của ${total} món ăn/đồ uống`,
        }}
        bordered
        scroll={{ x: 800 }}
      />
    </div>
  );
};

export default FoodList;