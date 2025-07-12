import React from "react";
import { Layout, Menu, Button } from "antd";
import {
  UserOutlined,
  VideoCameraOutlined,
  BarChartOutlined,
  TeamOutlined,
  PlusOutlined,
  LogoutOutlined,
  CoffeeOutlined,
  BankOutlined,
  PercentageOutlined,
  BorderOuterOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthService from "../services/authService";

const { Header, Content, Sider } = Layout;

const MainLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Cập nhật để match với routes trong App.js
  const getSelectedKey = (pathname) => {
    if (pathname === "/admin/dashboard" || pathname === "/admin/statistics")
      return "1";
    if (pathname.startsWith("/admin/users")) return "2";
    if (pathname.startsWith("/admin/employees")) return "3";
    if (pathname.startsWith("/admin/movie/list")) return "4";
    if (pathname.startsWith("/admin/addmovie")) return "5";
    if (pathname.startsWith("/admin/directors")) return "6";
    if (pathname.startsWith("/admin/actors")) return "7";
    if (pathname.startsWith("/admin/foods")) return "8";
    if (pathname.startsWith("/admin/cinemas")) return "9";
    if (pathname.startsWith("/admin/discount")) return "10";
    if (pathname.startsWith("/admin/rooms")) return "11";
    if (pathname.startsWith("/admin/seats")) return "12";
    return "";
  };

  // Handle logout
  const handleLogout = () => {
    AuthService.logout();
    navigate("/admin/login");
  };

  // Get current user info
  const currentUser = AuthService.getUser();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={250}>
        <div
          style={{
            height: 64,
            margin: 16,
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Admin Panel
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[getSelectedKey(location.pathname)]}
        >
          <Menu.Item key="1" icon={<BarChartOutlined />}>
            <Link to="/admin/statistics">Thống kê doanh thu</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />}>
            <Link to="/admin/users">Users</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<TeamOutlined />}>
            <Link to="/admin/employees">Quản lý nhân viên</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<VideoCameraOutlined />}>
            <Link to="/admin/movie/list">Phim</Link>
          </Menu.Item>
          <Menu.Item key="5" icon={<PlusOutlined />}>
            <Link to="/admin/addmovie">Thêm phim</Link>
          </Menu.Item>
          <Menu.Item key="6" icon={<VideoCameraOutlined />}>
            <Link to="/admin/directors">Đạo diễn</Link>
          </Menu.Item>
          <Menu.Item key="7" icon={<TeamOutlined />}>
            <Link to="/admin/actors">Diễn viên</Link>
          </Menu.Item>
          <Menu.Item key="8" icon={<CoffeeOutlined />}>
            <Link to="/admin/foods">Món ăn & Đồ uống</Link>
          </Menu.Item>
          <Menu.Item key="9" icon={<BankOutlined />}>
            <Link to="/admin/cinemas">Rạp phim</Link>
          </Menu.Item>
          <Menu.Item key="10" icon={<PercentageOutlined />}>
            <Link to="/admin/discounts">Khuyến Mãi</Link>
          </Menu.Item>
          <Menu.Item key="11" icon={<BorderOuterOutlined />}>
            <Link to="/admin/rooms">Phòng Chiếu</Link>
          </Menu.Item>
          <Menu.Item key="12" icon={<AppstoreOutlined />}>
            <Link to="/admin/seats">Ghế</Link>
          </Menu.Item>
        </Menu>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            padding: "16px",
            borderTop: "1px solid #434343",
          }}
        >
          {currentUser && (
            <div
              style={{
                color: "rgba(255, 255, 255, 0.65)",
                marginBottom: "8px",
                fontSize: "12px",
              }}
            >
              <div>Xin chào, {currentUser.name}</div>
              <div>Role: {currentUser.role}</div>
            </div>
          )}
          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{ width: "100%" }}
          >
            Đăng xuất
          </Button>
        </div>
      </Sider>

      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 1px 4px rgba(0,21,41,.08)",
          }}
        >
          <h2 style={{ margin: 0, color: "#001529" }}>Quản trị viên</h2>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {currentUser && (
              <span style={{ color: "#666" }}>
                {currentUser.name} ({currentUser.role})
              </span>
            )}
            <Button
              type="text"
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              Đăng xuất
            </Button>
          </div>
        </Header>

        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: "#fff",
            borderRadius: 6,
            minHeight: 360,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
