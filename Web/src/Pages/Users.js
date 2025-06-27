import React, { useState } from 'react';
import { 
  Table, 
  Button, 
  Input, 
  Space, 
  Tag, 
  Avatar, 
  Typography, 
  Card,
  Row,
  Col,
  Statistic,
  Dropdown,
  Modal,
  Form,
  Select,
  message
} from 'antd';
import { 
  SearchOutlined, 
  UserAddOutlined, 
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined
} from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const Users = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  // Mock data - replace with API calls
  const userData = [
    {
      key: '1',
      id: 'USR001',
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@email.com',
      phone: '0123456789',
      status: 'active',
      registeredDate: '2024-01-15',
      lastLogin: '2024-01-20',
      totalOrders: 15,
      totalSpent: 2340000
    },
    {
      key: '2',
      id: 'USR002',
      name: 'Trần Thị B',
      email: 'tranthib@email.com',
      phone: '0987654321',
      status: 'active',
      registeredDate: '2024-01-10',
      lastLogin: '2024-01-19',
      totalOrders: 8,
      totalSpent: 1560000
    },
    {
      key: '3',
      id: 'USR003',
      name: 'Lê Văn C',
      email: 'levanc@email.com',
      phone: '0369852147',
      status: 'inactive',
      registeredDate: '2023-12-20',
      lastLogin: '2024-01-10',
      totalOrders: 3,
      totalSpent: 450000
    },
  ];

  const userStats = [
    { title: 'Tổng người dùng', value: 1234, color: '#1890ff' },
    { title: 'Người dùng mới (tháng)', value: 89, color: '#52c41a' },
    { title: 'Người dùng hoạt động', value: 987, color: '#fa8c16' },
    { title: 'Người dùng VIP', value: 156, color: '#eb2f96' },
  ];

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalVisible(true);
  };

  const handleDeleteUser = (userId) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa người dùng này?',
      onOk() {
        message.success('Đã xóa người dùng thành công');
      },
    });
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingUser) {
        message.success('Cập nhật thông tin thành công');
      } else {
        message.success('Thêm người dùng thành công');
      }
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const getActionMenu = (record) => ({
    items: [
      {
        key: 'edit',
        icon: <EditOutlined />,
        label: 'Chỉnh sửa',
        onClick: () => handleEditUser(record),
      },
      {
        key: 'delete',
        icon: <DeleteOutlined />,
        label: 'Xóa',
        danger: true,
        onClick: () => handleDeleteUser(record.id),
      },
    ],
  });

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'name',
      key: 'avatar',
      width: 80,
      render: (name) => (
        <Avatar size="large" style={{ backgroundColor: '#1890ff' }}>
          {name.charAt(0)}
        </Avatar>
      ),
    },
    {
      title: 'Thông tin',
      key: 'info',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.name}</div>
          <div style={{ fontSize: 12, color: '#666' }}>ID: {record.id}</div>
        </div>
      ),
    },
    {
      title: 'Liên hệ',
      key: 'contact',
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: 4 }}>
            <MailOutlined style={{ marginRight: 4, color: '#1890ff' }} />
            {record.email}
          </div>
          <div>
            <PhoneOutlined style={{ marginRight: 4, color: '#52c41a' }} />
            {record.phone}
          </div>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
        </Tag>
      ),
    },
    {
      title: 'Thống kê',
      key: 'stats',
      render: (_, record) => (
        <div>
          <div style={{ fontSize: 12, color: '#666' }}>
            Đơn hàng: <span style={{ fontWeight: 500 }}>{record.totalOrders}</span>
          </div>
          <div style={{ fontSize: 12, color: '#666' }}>
            Chi tiêu: <span style={{ fontWeight: 500, color: '#52c41a' }}>
              ₫{record.totalSpent.toLocaleString()}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: 'Ngày đăng ký',
      dataIndex: 'registeredDate',
      key: 'registeredDate',
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 50,
      render: (_, record) => (
        <Dropdown menu={getActionMenu(record)} trigger={['click']}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  const filteredData = userData.filter(user =>
    user.name.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>Quản lý người dùng</Title>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {userStats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                valueStyle={{ color: stat.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Controls */}
      <Card style={{ marginBottom: 16 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Input.Search
              placeholder="Tìm kiếm theo tên hoặc email..."
              allowClear
              style={{ width: 300 }}
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </Col>
          <Col>
            <Space>
              <Button 
                type="primary" 
                icon={<UserAddOutlined />}
                onClick={handleAddUser}
              >
                Thêm người dùng
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Table */}
      <Card>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredData}
          pagination={{
            total: filteredData.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} người dùng`,
          }}
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        title={editingUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Họ và tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' }
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
              >
                <Select>
                  <Option value="active">Hoạt động</Option>
                  <Option value="inactive">Không hoạt động</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;
