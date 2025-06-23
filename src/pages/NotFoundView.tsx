import { Button } from "antd";
import { useNavigate } from "react-router";

export const NotFoundView = () => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center", 
      height: "100vh", 
      textAlign: "center" 
    }}>
      <h1 style={{ fontSize: "48px", color: "#ff4d4f" }}>404</h1>
      <h2 style={{ fontSize: "24px", marginBottom: "16px" }}>Página não encontrada</h2>
      <p style={{ fontSize: "16px", color: "#595959", marginBottom: "24px" }}>
        Desculpe, a página que você está procurando não existe ou foi movida.
      </p>
      <Button type="primary" onClick={() => navigate(-1)}>
        Voltar para a página inicial
      </Button>
    </div>
  );
};
