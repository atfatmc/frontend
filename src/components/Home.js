import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import { Layout, Menu, Button, Typography, Space, Avatar, Drawer, Switch } from "antd";
import { 
  LogoutOutlined, 
  UserOutlined, 
  DashboardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  BulbOutlined,
  BulbFilled
} from "@ant-design/icons";
import { Icon } from "@iconify/react";
import { useTheme } from "../context/ThemeContext";

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

const Home = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const [currentUser, setCurrentUser] = useState(undefined);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (!user) {
      navigate("/login");
    } else {
      setCurrentUser(user);
    }
  }, [navigate]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 992);
      if (window.innerWidth >= 992) {
        setCollapsed(false);
        setDrawerVisible(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const logOut = () => {
    AuthService.logout();
    navigate("/login");
  };

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  const menuItems = [
    {
      key: '1',
      icon: <HomeOutlined />,
      label: 'Ana Sayfa',
    },
  ];

  const renderMenu = () => (
    <>
      <div style={{ 
        height: 64, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '16px'
      }}>
        <Icon 
          icon="mdi:truck-delivery" 
          width={collapsed ? "24" : "32"} 
          height={collapsed ? "24" : "32"} 
          color="#1890ff" 
        />
        {!collapsed && (
          <Title level={4} style={{ margin: 0, marginLeft: 8, color: '#fff' }}>
            Sevkiyat
          </Title>
        )}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={['1']}
        items={menuItems}
      />
    </>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {!isMobile && (
        <Sider 
          trigger={null} 
          collapsible 
          collapsed={collapsed}
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 1000,
          }}
        >
          {renderMenu()}
        </Sider>
      )}

      <Drawer
        placement="left"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        bodyStyle={{ padding: 0 }}
        width={256}
      >
        {renderMenu()}
      </Drawer>

      <Layout style={{ 
        marginLeft: isMobile ? 0 : (collapsed ? 80 : 200),
        transition: 'all 0.2s',
        minHeight: '100vh'
      }}>
        <Header style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between",
          background: isDarkMode ? "#1f1f1f" : "#fff",
          padding: "0 24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          position: 'sticky',
          top: 0,
          zIndex: 999,
          width: '100%'
        }}>
          <Space>
            {isMobile ? (
              <Button
                type="text"
                icon={<MenuUnfoldOutlined />}
                onClick={toggleDrawer}
                style={{ fontSize: '16px', width: 64, height: 64 }}
              />
            ) : (
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{ fontSize: '16px', width: 64, height: 64 }}
              />
            )}
            {!isMobile && (
              <Title level={4} style={{ margin: 0 }}>
                Sevkiyat Yönetim Sistemi
              </Title>
            )}
          </Space>
          <Space>
            <Switch
              checked={isDarkMode}
              onChange={toggleTheme}
              checkedChildren={<BulbFilled />}
              unCheckedChildren={<BulbOutlined />}
            />
            <Avatar icon={<UserOutlined />} />
            <Text strong>{currentUser?.username}</Text>
            <Button 
              type="text" 
              icon={<LogoutOutlined />} 
              onClick={logOut}
            >
              {!isMobile && "Çıkış Yap"}
            </Button>
          </Space>
        </Header>
        <Content style={{ 
          margin: "24px 16px", 
          padding: 24, 
          background: isDarkMode ? "#1f1f1f" : "#fff", 
          borderRadius: "8px",
          minHeight: 280,
          overflow: 'initial'
        }}>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Title level={2}>
              <DashboardOutlined /> Hoş Geldiniz, {currentUser?.username}!
            </Title>
            <Text>
              Bu sayfada sevkiyat işlemlerinizi yönetebilirsiniz.
            </Text>
          </Space>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Home; 