

import { Navbar } from "../../pages/Navbar/Navbar.tsx";
import { useAuth } from "../../hooks/useAuth.ts";
import { Outlet } from "react-router";

const LayoutComponent: React.FC = () => {
  const { token } = useAuth();

  return (
    <div className="App">
      {token && (
        <>
          <Navbar />
          <div className="container">           
            <Outlet /> {/* Renderiza as rodas chama o MainRoute que agrupa as rodas dentro do layout */}
            <footer>Todos os direitos reservados</footer>
          </div>
        </>
      )}
    </div>
  );
};



export default LayoutComponent;
