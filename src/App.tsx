import "./App.css";
import { MainRoutes } from "./routes/MainRoutes";
import "antd/dist/antd.css";
import { Navbar } from "./pages/Navbar/Navbar";
import useApiInterceptors from "./hooks/useApiInterceptors";
import AuthProvider from "./contexto/AuthProvider";
import { useAuth } from "./hooks/useAuth";

const AppContent: React.FC = () => {
  const { token } = useAuth();

  return (
    <div className="App">
      {token && (
        <>
          <Navbar />
          <div className="container">
            <div>
              <MainRoutes />
            </div>
            <footer>Todos os direitos reservados</footer>
          </div>
        </>
      )}
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
