import React from "react";
import { Link } from "react-router-dom";
import { Menu, Typography, Layout } from "antd";
import { useAppSelector } from "../../redux/hooks/useAppSelector";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import "./Navbar.css";
import { useAuth } from "../../contexto/AuthProvider";

const { Header } = Layout;
const { Title } = Typography;

export const Navbar: React.FC = () => {
  const user = useAppSelector((state) => state.user);

  const { logOut } = useAuth();

  return (
    <Header className="navbar">
      <div className="navbar-brand">
        <Title level={3} style={{ color: "white", margin: 0 }}>
          Realização
        </Title>
      </div>
      <Menu theme="dark" mode="horizontal" className="navbar-menu">
        <Menu.Item key="home">
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="sheet-list">
          <Link to="/sheet-list">Lista Folha</Link>
        </Menu.Item>
        <Menu.Item key="about">
          <Link to="/about">Sobre</Link>
        </Menu.Item>
        <Menu.SubMenu key="user" title={user.name} icon={<UserOutlined />} className="navbar-user">
          <Menu.Item key="profile">
            <Link to="/profile">Perfil</Link>
          </Menu.Item>
          <Menu.Item key="logout" icon={<LogoutOutlined />}>
            <button onClick={logOut}>Sair</button>
          </Menu.Item>
        </Menu.SubMenu>
      </Menu>
    </Header>
  );
};
