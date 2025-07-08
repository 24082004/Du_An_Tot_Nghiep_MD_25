import React from 'react';
import { Input, Button, DatePicker, Select, Form, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const CreateEmployee = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    console.log('Dữ liệu tạo nhân viên:', values);
    message.success('Tạo nhân viên thành công!');
    navigate('/employees'); // Quay về danh sách nhân viên
  };

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center' }}>Tạo nhân viên</h2>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ marginTop: 24 }}
      >
        <Form.Item
          label="Họ Tên"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
        >
          <Input placeholder="Nhập họ tên" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item
          label="Ngày tháng năm sinh"
          name="birth"
          rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
        >
          <DatePicker placeholder="dd/MM/yyyy" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
        >
          <Input.Password placeholder="Nhập mật khẩu" />
        </Form.Item>

        <Form.Item
          label="Giới tính"
          name="gender"
          rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
        >
          <Select placeholder="Chọn giới tính">
            <Option value="Nam">Nam</Option>
            <Option value="Nữ">Nữ</Option>
            <Option value="Khác">Khác</Option>
          </Select>
        </Form.Item>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Button onClick={() => navigate('/employees')} style={{ marginRight: 8 }}>
            Quay lại
          </Button>
          <Button type="primary" htmlType="submit">
            Tạo nhân viên
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CreateEmployee;
