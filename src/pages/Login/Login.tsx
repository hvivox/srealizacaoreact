import React, { useState } from "react";
import { useAuth } from "../../contexto/AuthProvider";
import { Form, Input, Button, Alert, Row, Col } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone, UserOutlined, LockOutlined } from "@ant-design/icons";

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showPassword] = useState<boolean>(false);
  const { logOut, setToken, nomeLogado } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setErrorMessage("Verifique os dados de login e senha e tente novamente.");
      return;
    }

    try {
      const token = await authenticateUser(username, password);
      setToken(token);
      window.location.href = "/";
    } catch (error) {
      setErrorMessage("Login falhou. Por favor, tente novamente.");
    }
  };

  const authenticateUser = async (username: string, password: string) => {
    const response = await fetch(
      "http://localhost:8082/auth/realms/SREALIZACAO_REALM/protocol/openid-connect/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: "SREALIZACAO_CLIENT",
          grant_type: "password",
          username: username,
          password: password,
          client_secret: "OQDxgKAczv5oFE2AvGyJ9XZCkTuNRkTG",
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to authenticate");
    }

    const data = await response.json();
    return data;
  };

  const handleCloseError = () => {
    setErrorMessage("");
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
      <Col xs={24} sm={10} md={10} lg={10} xl={10}>
        <Form onSubmitCapture={handleLogin}>
          {errorMessage && (
            <Alert
              message="Erro"
              description={errorMessage}
              type="error"
              showIcon
              closable
              onClose={handleCloseError}
              className="mb-4"
            />
          )}
          <Row justify="center" className="mb-4">
            <Col>
              <h1>Sistema de Realização</h1>
            </Col>
          </Row>
          {!nomeLogado && (
            <>
              <Form.Item
                name="username"
                rules={[{ required: true, message: "Por favor, insira seu login!" }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Digite o login de acesso"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: "Por favor, insira sua senha!" }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>
            </>
          )}
          <Form.Item>
            {!nomeLogado ? (
              <Button type="primary" htmlType="submit" block>
                Entrar
              </Button>
            ) : (
              <>
                <div style={{ textAlign: "center", fontSize: "1.2rem" }}>
                  Clique no botão abaixo para encerrar a sessão
                </div>
                <Button type="primary" block style={{ marginTop: "12px" }} onClick={logOut}>
                  Sair
                </Button>
              </>
            )}
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default Login;
