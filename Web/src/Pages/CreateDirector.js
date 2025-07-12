import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const CreateDirector = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log('Form values:', values);

    message.success('Tạo đạo diễn thành công!');
    navigate('/directors');
  };

  return (
    <Card title="Thêm đạo diễn mới" style={{ maxWidth: 600, margin: '0 auto' }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          status: 'Đang hoạt động',
        }}
      >
        <Form.Item
          label="Tên đạo diễn"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên đạo diễn!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập email!' },
            { type: 'email', message: 'Email không hợp lệ!' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Trạng thái"
          name="status"
        >
          <Input disabled /> {/* Nếu muốn chỉnh thì dùng Select */}
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Tạo đạo diễn
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreateDirector;
