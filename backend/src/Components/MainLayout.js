import React from 'react';
import { Layout, Menu } from 'antd';
import { DashboardOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';


const { Header, Content, Sider } = Layout;

const MainLayout = ({ children }) => {
    const location = useLocation();

    const getSelectedKey = (pathname) => {
        if (pathname === '/') return '1';
        if (pathname.startsWith('/users')) return '2';
        return '';
    };
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        <Menu theme="dark" mode="inline" selectedKeys={[getSelectedKey(location.pathname)]}>

          <Menu.Item key="1" icon={<DashboardOutlined />}>
            <Link to="/">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />}>
            <Link to="/users">Users</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', textAlign: 'center' }}>
          <h2>Quản trị viên</h2>
        </Header>
        <Content style={{ margin: '16px' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
