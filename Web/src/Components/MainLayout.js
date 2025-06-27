import React from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Space, Typography } from 'antd';
import { DashboardOutlined, UserOutlined, LogoutOutlined, VideoCameraOutlined, SettingOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const MainLayout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const getSelectedKey = (pathname) => {
        if (pathname === '/') return '1';
        if (pathname.startsWith('/users')) return '2';
        return '';
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/login');
    };

    const userMenuItems = [
        {
            key: 'profile',
            icon: <SettingOutlined />,
            label: 'Cài đặt tài khoản',
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Đăng xuất',
            onClick: handleLogout,
        },
    ];
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        theme="dark"
        style={{
          background: 'linear-gradient(180deg, #001529 0%, #002140 100%)',
        }}
      >
        <div style={{ 
          padding: '16px', 
          textAlign: 'center', 
          borderBottom: '1px solid #1f1f1f' 
        }}>
          <VideoCameraOutlined style={{ fontSize: '24px', color: '#ff6b35' }} />
          <Title level={4} style={{ color: '#fff', margin: '8px 0 0 0' }}>
            CinemaAdmin
          </Title>
        </div>
        
        <Menu 
          theme="dark" 
          mode="inline" 
          selectedKeys={[getSelectedKey(location.pathname)]}
          style={{ 
            background: 'transparent',
            border: 'none'
          }}
        >
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            <Link to="/">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />}>
            <Link to="/users">Quản lý người dùng</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      
      <Layout>
        <Header style={{ 
          background: '#fff', 
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <Title level={3} style={{ margin: 0, color: '#333' }}>
            Hệ thống quản lý rạp chiếu phim
          </Title>
          
          <Space>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Button type="text" style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar size="small" style={{ backgroundColor: '#ff6b35', marginRight: 8 }}>
                  A
                </Avatar>
                Admin
              </Button>
            </Dropdown>
          </Space>
        </Header>
        
        <Content style={{ 
          margin: '24px', 
          padding: '24px',
          background: '#fff',
          borderRadius: '8px',
          minHeight: 'calc(100vh - 112px)'
        }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
