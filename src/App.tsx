import "./App.css";
import { MainRoutes } from "./routes/MainRoutes";
import "antd/dist/antd.css";
import { Navbar } from "./pages/Navbar/Navbar";
import useApiInterceptors from "./hooks/useApiInterceptors";
import AuthProvider, { useAuth } from "./contexto/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const AppContent: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  return (
    <div className="App">
      {token && <Navbar />}
      <div className="container">
        <div>
          <MainRoutes />
        </div>
        {token && <footer>Todos os direitos reservados</footer>}
      </div>
    </div>
  );
};

function App() {
  useApiInterceptors();
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
