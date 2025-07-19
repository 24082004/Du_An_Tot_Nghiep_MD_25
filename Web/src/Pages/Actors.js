import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Space, 
  message, 
  Popconfirm, 
  Card, 
  Image,
  Spin
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined, 
  EyeOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { utilityAPI } from '../Services/apiService';
import './Actors.css';

const Actors = () => {
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingActor, setEditingActor] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0
  });

  // Load dữ liệu ban đầu
  useEffect(() => {
    loadActors();
  }, []);

  // Load danh sách diễn viên
  const loadActors = async (page = 1, pageSize = 20, searchQuery = '') => {
    try {
      setLoading(true);
      
      const params = {
        page,
        limit: pageSize
      };

      // Tạo timeout promise
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('API timeout')), 10000)
      );

      let apiPromise = utilityAPI.getActors(params);

      // Race between API call and timeout
      const response = await Promise.race([apiPromise, timeoutPromise]);

      if (response && response.success === true && Array.isArray(response.data)) {
        setActors(response.data);
        setPagination({
          current: page,
          pageSize,
          total: response.count || response.data.length
        });
        message.success(`Đã tải ${response.data.length} diễn viên từ API`);
      } else if (response && Array.isArray(response)) {
        // API trả về array trực tiếp
        setActors(response);
        setPagination({
          current: page,
          pageSize,
          total: response.length
        });
        message.success(`Đã tải ${response.length} diễn viên từ API`);
      } else {
        throw new Error('API response không hợp lệ');
      }
    } catch (error) {
      console.error('Lỗi tải diễn viên:', error);
      message.error(`Lỗi tải diễn viên: ${error.message}`);
      
      // Fallback với mock data
      const mockActors = getMockActors();
      setActors(mockActors);
      setPagination({ 
        current: page, 
        pageSize, 
        total: mockActors.length 
      });
      message.info(`Hiển thị ${mockActors.length} diễn viên mẫu`);
    } finally {
      setLoading(false);
    }
  };

  // Mock data để fallback
  const getMockActors = () => {
    return [
      {
        _id: '1',
        name: 'Robert Downey Jr.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300'
      },
      {
        _id: '2',
        name: 'Scarlett Johansson',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=300'
      },
      {
        _id: '3',
        name: 'Chris Evans',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300'
      }
    ];
  };

  // Xử lý tìm kiếm
  const handleSearch = (value) => {
    setSearchText(value);
    if (value.trim()) {
      // Filter local data for now (TODO: implement API search)
      const filtered = actors.filter(actor => 
        actor.name.toLowerCase().includes(value.toLowerCase())
      );
      setActors(filtered);
    } else {
      loadActors(1, pagination.pageSize);
    }
  };

  // Xử lý phân trang
  const handleTableChange = (paginationInfo) => {
    loadActors(paginationInfo.current, paginationInfo.pageSize, searchText);
  };

  // Refresh data
  const handleRefresh = () => {
    setSearchText('');
    loadActors();
  };

  // Xử lý xem chi tiết
  const handleView = (record) => {
    Modal.info({
      title: record.name,
      width: 600,
      content: (
        <div style={{ padding: '16px 0' }}>
          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            <Image
              src={record.image}
              width={150}
              height={200}
              style={{ objectFit: 'cover', borderRadius: 8 }}
              fallback="https://via.placeholder.com/150x200/f0f0f0/666?text=No+Image"
            />
            <div style={{ flex: 1 }}>
              <p><strong>Tên:</strong> {record.name}</p>
              <p><strong>ID:</strong> {record._id}</p>
              <p><strong>Số phim đã tham gia:</strong> Chưa có thông tin</p>
            </div>
          </div>
        </div>
      )
    });
  };

  // Xử lý chỉnh sửa
  const handleEdit = (record) => {
    setEditingActor(record);
    form.setFieldsValue({
      name: record.name,
      image: record.image
    });
    setModalVisible(true);
  };

  // Xử lý xóa
  const handleDelete = async (id) => {
    try {
      // TODO: Implement delete API call
      message.success('Xóa diễn viên thành công');
      loadActors(pagination.current, pagination.pageSize, searchText);
    } catch (error) {
      message.error('Không thể xóa diễn viên');
    }
  };

  // Xử lý submit form
  const handleSubmit = async (values) => {
    try {
      if (editingActor) {
        // TODO: Implement edit API call
        message.success('Cập nhật diễn viên thành công');
      } else {
        // TODO: Implement create API call
        message.success('Thêm diễn viên thành công');
      }
      setModalVisible(false);
      setEditingActor(null);
      form.resetFields();
      loadActors(pagination.current, pagination.pageSize, searchText);
    } catch (error) {
      message.error('Có lỗi xảy ra khi lưu diễn viên');
    }
  };

  // Định nghĩa columns cho table
  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'image',
      key: 'image',
      width: 80,
      render: (image, record) => (
        <Image
          src={image || 'https://via.placeholder.com/60x80/f0f0f0/666?text=No+Image'}
          alt={record.name}
          width={60}
          height={80}
          style={{ objectFit: 'cover', borderRadius: 4 }}
          fallback="https://via.placeholder.com/60x80/f0f0f0/666?text=No+Image"
        />
      )
    },
    {
      title: 'Tên diễn viên',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (name, record) => (
        <div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>
            {name || 'Không có tên'}
          </div>
          <div style={{ fontSize: 12, color: '#666' }}>
            ID: {record._id}
          </div>
        </div>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
            title="Xem chi tiết"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            title="Chỉnh sửa"
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa diễn viên này?"
            onConfirm={() => handleDelete(record._id)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              danger
              title="Xóa"
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="actors-container">
      <Card>
        <div className="actors-header">
          <h2>Quản lý diễn viên</h2>
          <div className="actors-actions">
            <Space wrap>
              <Input.Search
                placeholder="Tìm kiếm diễn viên..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onSearch={handleSearch}
                style={{ width: 250 }}
                enterButton={<SearchOutlined />}
              />

              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                title="Làm mới"
              />

              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingActor(null);
                  form.resetFields();
                  setModalVisible(true);
                }}
              >
                Thêm diễn viên mới
              </Button>
            </Space>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>Đang tải danh sách diễn viên...</div>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={actors}
            rowKey="_id"
            loading={loading}
            pagination={{
              ...pagination,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} diễn viên`,
              pageSizeOptions: ['10', '20', '50', '100']
            }}
            onChange={handleTableChange}
            scroll={{ x: 600 }}
          />
        )}
      </Card>

      {/* Modal thêm/sửa diễn viên */}
      <Modal
        title={editingActor ? 'Chỉnh sửa diễn viên' : 'Thêm diễn viên mới'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingActor(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Tên diễn viên"
            rules={[
              { required: true, message: 'Vui lòng nhập tên diễn viên' },
              { min: 2, message: 'Tên diễn viên phải có ít nhất 2 ký tự' }
            ]}
          >
            <Input placeholder="Nhập tên diễn viên" />
          </Form.Item>

          <Form.Item
            name="image"
            label="Ảnh diễn viên"
            rules={[
              { required: true, message: 'Vui lòng nhập URL ảnh diễn viên' },
              { type: 'url', message: 'Vui lòng nhập URL hợp lệ' }
            ]}
          >
            <Input placeholder="https://example.com/image.jpg" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Actors;
