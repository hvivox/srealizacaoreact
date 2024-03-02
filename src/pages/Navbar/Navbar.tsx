import { Link } from "react-router-dom";
import { Menu, Typography } from "antd";
import { useAppSelector } from "../../redux/hooks/useAppSelector";

export const Navbar = () => {
  const user = useAppSelector((state) => state.user);

  const { Title } = Typography;

  return (
    <div>
      <Menu mode="horizontal">
        <Menu.Item
          key="brand"
          disabled
          style={{
            marginRight: "20px",
            paddingLeft: "0",
            paddingRight: "0",
          }}
        >
          <Title style={{ fontSize: "18px" }}>Realização</Title>
        </Menu.Item>
        <Menu.Item key="exemple">
          <Link to="/exemple">Exemplos de Componentes</Link>
        </Menu.Item>
        <Menu.Item key="lista-folha">
          <Link to="/lista-folha">Lista Folha</Link>
        </Menu.Item>
        <Menu.Item key="about">
          <Link to="/about">Sobre..</Link>
        </Menu.Item>
        <Menu.Item key="useName">{user.name} </Menu.Item>
      </Menu>
    </div>
  );
};
