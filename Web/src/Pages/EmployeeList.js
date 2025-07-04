import React, { useState, useEffect } from 'react';
import { Table, Button, Switch, Input, Avatar, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom'; // thêm useNavigate

const { Search } = Input;

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const navigate = useNavigate(); // hook điều hướng

  useEffect(() => {
    const mockData = [
      {
        key: '1',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        name: 'Duy Khánh Staff',
        email: 'khanhdev289@gmail.com',
        phone: '0378332809',
        status: true,
      },
      {
        key: '2',
        avatar: '',
        name: 'Nguyễn Hải Huy',
        email: 'ng.haihuy267@gmail.com',
        phone: '0965020600',
        status: true,
      },
      {
        key: '3',
        avatar: '',
        name: 'Nguyễn Văn Long',
        email: 'haihuy262@gmail.com',
        phone: '0965020600',
        status: true,
      },
      {
        key: '4',
        avatar: '',
        name: 'hoangnhat',
        email: 'ngocc@gmail.com',
        phone: '0987654321',
        status: true,
      },
      {
        key: '5',
        avatar: '',
        name: 'Nguyễn Văn Thùy',
        email: 'abc@gmail.com',
        phone: '0324234234',
        status: true,
      },
    ];
    setEmployees(mockData);
    setFilteredEmployees(mockData);
  }, []);

  const handleSearch = (value) => {
    const filtered = employees.filter(emp =>
      emp.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredEmployees(filtered);
  };

  const toggleStatus = (key) => {
    const updated = employees.map(emp =>
      emp.key === key ? { ...emp, status: !emp.status } : emp
    );
    setEmployees(updated);
    setFilteredEmployees(updated);
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'key',
      key: 'key',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      render: (avatar) => <Avatar src={avatar || undefined} />,
    },
    {
      title: 'Họ tên',
      dataIndex: 'name',
      render: (text, record) => (
        <Link to={`/employees/${record.key}`} style={{ color: '#1890ff' }}>
          {text}
        </Link>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
    },
    {
      title: 'Hành động',
      dataIndex: 'status',
      render: (status, record) => (
        <Switch checked={status} onChange={() => toggleStatus(record.key)} />
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status) => (
        <Tag color={status ? 'green' : 'red'}>
          {status ? 'Kích hoạt' : 'Tạm khóa'}
        </Tag>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>Danh sách nhân viên</h2>
        <div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ marginRight: 8 }}
            onClick={() => navigate('/employees/create')}
          >
            Tạo nhân viên
          </Button>
          <Search placeholder="Tìm kiếm..." onSearch={handleSearch} style={{ width: 200 }} />
        </div>
      </div>
      <Table columns={columns} dataSource={filteredEmployees} pagination={{ pageSize: 5 }} />
    </div>
  );
};

export default EmployeeList;
