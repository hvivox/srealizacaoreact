import React from "react";
import { Link } from "react-router";
import { Menu, Typography, Layout } from "antd";
import { useAppSelector } from "../../redux/hooks/useAppSelector";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import "./Navbar.css";
import { useAuth } from "../../hooks/useAuth"; // Importa o hook useAuth do contexto

const { Header } = Layout;
const { Title } = Typography;

export const Navbar: React.FC = () => {
  const user = useAppSelector((state) => state.user);
  const { logOut } = useAuth();

  const items = [
    {
      key: "home",
      label: <Link to="/">Home</Link>,
    },
    {
      key: "sheet-list",
      label: <Link to="/sheet-list">Lista Folha</Link>,
    },
    {
      key: "about",
      label: <Link to="/about">Sobre</Link>,
    },
    {
      key: "user",
      label: user.name,
      icon: <UserOutlined />,
      style: { marginLeft: "auto" }, // Move este item para a direita
      children: [
        {
          key: "profile",
          label: <Link to="/profile">Perfil</Link>,
        },
        {
          key: "logout",
          icon: <LogoutOutlined />,
          label: "Sair",
          onClick: logOut,
        },
      ],
    },
  ];

  return (
    <Header className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <Title level={3} style={{ color: "white", margin: 8 }}>
            Realização
          </Title>
        </div>
        <Menu theme="dark" mode="horizontal" className="navbar-menu" items={items} />
      </div>
    </Header>
  );
};
