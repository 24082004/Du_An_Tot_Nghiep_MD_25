import React, { useState } from 'react';
import { Form, Input, Button, Typography, Card, message, Checkbox, Modal } from 'antd';
import { UserOutlined, LockOutlined, VideoCameraOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication - replace with real API call
      if (values.email === 'admin@gmail.com' && values.password === '123456') {
        message.success('Đăng nhập thành công!');
        localStorage.setItem('adminToken', 'mock-token');
        navigate('/');
      } else {
        // Hiển thị dialog thông báo lỗi
        let errorTitle = '';
        let errorContent = '';
        
        if (values.email !== 'admin@gmail.com') {
          errorTitle = 'Tài khoản không tồn tại';
          errorContent = 'Email bạn nhập không đúng. Vui lòng kiểm tra lại!';
        } else if (values.password !== '123456') {
          errorTitle = 'Mật khẩu không chính xác';
          errorContent = 'Mật khẩu bạn nhập không đúng. Vui lòng thử lại!';
        } else {
          errorTitle = 'Đăng nhập thất bại';
          errorContent = 'Tài khoản hoặc mật khẩu không chính xác. Vui lòng thử lại!';
        }

        Modal.error({
          title: (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
              {errorTitle}
            </div>
          ),
          content: (
            <div style={{ padding: '16px 0' }}>
              <p style={{ marginBottom: 16, fontSize: '14px' }}>{errorContent}</p>
              <div style={{ 
                background: '#f6f8fa', 
                padding: '12px', 
                borderRadius: '6px',
                border: '1px solid #e1e4e8'
              }}>
                <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                  <strong>Tài khoản demo:</strong> admin@gmail.com
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                  <strong>Mật khẩu:</strong> 123456
                </p>
              </div>
            </div>
          ),
          okText: 'Thử lại',
          okButtonProps: {
            style: {
              background: 'linear-gradient(90deg, #1890ff 0%, #722ed1 100%)',
              border: 'none',
              borderRadius: '6px'
            }
          },
          width: 450,
          centered: true,
          maskClosable: true
        });
      }
    } catch (error) {
      Modal.error({
        title: (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
            Lỗi hệ thống
          </div>
        ),
        content: 'Có lỗi xảy ra khi đăng nhập! Vui lòng thử lại sau.',
        okText: 'Đóng',
        centered: true
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="movie-poster poster-1"></div>
        <div className="movie-poster poster-2"></div>
        <div className="movie-poster poster-3"></div>
        <div className="movie-poster poster-4"></div>
        <div className="overlay"></div>
      </div>
      
      <div className="login-content">
        <Card className="login-card">
          <div className="login-header">
            <div className="logo-container">
              <VideoCameraOutlined className="logo-icon" />
              <Title level={2} className="brand-title">CinemaAdmin</Title>
            </div>
            <Text className="login-subtitle">Hệ thống quản lý rạp chiếu phim</Text>
          </div>

          <Form
            name="login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            size="large"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Email"
                className="login-input"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Mật khẩu"
                className="login-input"
              />
            </Form.Item>

            <Form.Item className="login-options">
              <div className="login-remember">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                </Form.Item>
              </div>
              <Button type="link" className="forgot-password">
                Quên mật khẩu?
              </Button>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-button"
                loading={loading}
                block
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
            </Form.Item>
          </Form>

          <div className="login-footer">
            <Text className="demo-info">
              Tài khoản demo: admin@gmail.com / 123456
            </Text>
            <Text className="security-note" style={{ 
              display: 'block', 
              marginTop: '8px', 
              fontSize: '12px', 
              color: '#8c8c8c' 
            }}>
              Chỉ tài khoản admin được phép truy cập hệ thống
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
