import React from 'react';
import { Layout, Menu } from 'antd';
import { DashboardOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

const { Header, Content, Sider } = Layout;

const MainLayout = ({ children }) => {
  const location = useLocation();

  const getSelectedKey = (pathname) => {
    if (pathname === '/') return '1';
    if (pathname.startsWith('/users')) return '2';
    if (pathname.startsWith('/employees')) return '3';
    if (pathname.startsWith('/movie/list')) return '4';
    if (pathname.startsWith('/addmovie')) return '5';
    return '';
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[getSelectedKey(location.pathname)]}
        >
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            <Link to="/">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />}>
            <Link to="/users">Users</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<UserOutlined />}>
            <Link to="/employees">Quản lý nhân viên</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<VideoCameraOutlined />}>
            <Link to="/movie/list">Phim</Link>
          </Menu.Item>
          <Menu.Item key="5" icon={<VideoCameraOutlined />}>
            <Link to="/addmovie">Thêm phim</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', textAlign: 'center' }}>
          <h2>Quản trị viên</h2>
        </Header>
        <Content style={{ margin: '16px' }}>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
