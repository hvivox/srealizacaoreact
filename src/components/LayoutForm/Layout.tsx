

import { Navbar } from "../../pages/Navbar/Navbar.tsx";
import { useAuth } from "../../hooks/useAuth.ts";
import { Outlet } from "react-router";
import { Footer } from "./Footer/Footer.tsx";

const LayoutComponent: React.FC = () => {
  const { token } = useAuth();

  return (
    <div className="App">
      {token && (
        <>
          <Navbar />
          <div className="container">
            <Outlet /> {/* Chama o MainRoute que agrupa as telas dentro do layout */}

          </div>
          <Footer />
        </>
      )}
    </div>
  );
};



export default LayoutComponent;
