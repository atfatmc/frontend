import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import { Form, Input, Button, Card, Typography, Alert, Space } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Icon } from "@iconify/react";

const { Title } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const onFinish = (values) => {
    setMessage("");
    setLoading(true);

    AuthService.login(values.username, values.password).then(
      () => {
        navigate("/home");
        window.location.reload();
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setLoading(false);
        setMessage(resMessage);
      }
    );
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center",
      background: "linear-gradient(135deg, #1890ff 0%, #722ed1 100%)"
    }}>
      <Card 
        style={{ 
          width: 400,
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          borderRadius: "8px"
        }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div style={{ textAlign: "center" }}>
            <Icon icon="mdi:truck-delivery" width="48" height="48" color="#1890ff" />
            <Title level={2} style={{ marginTop: 16, marginBottom: 32 }}>
              Sevkiyat Yönetim Sistemi
            </Title>
          </div>

          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            size="large"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: "Lütfen kullanıcı adınızı girin!" }]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Kullanıcı Adı" 
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "Lütfen şifrenizi girin!" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Şifre"
              />
            </Form.Item>

            {message && (
              <Alert
                message="Hata"
                description={message}
                type="error"
                showIcon
                style={{ marginBottom: 24 }}
              />
            )}

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                block
                style={{ height: 40 }}
              >
                {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
              </Button>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </div>
  );
};

export default Login; 