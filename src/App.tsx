import "./App.css";
import { MainRoutes } from "./routes/MainRoutes";
import "antd/dist/antd.css";
import { Navbar } from "./pages/Navbar/Navbar";
import useApiInterceptors from "./hooks/useApiInterceptors";
import AuthProvider, { useAuth } from "./contexto/AuthProvider";

const AppContent: React.FC = () => {
  const { token } = useAuth();

  return (
    <div className="App">
      <Navbar />
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
