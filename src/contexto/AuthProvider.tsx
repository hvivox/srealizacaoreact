import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

// Definindo a interface para o contexto de autenticação
interface AuthContextType {
  token: string | null;
  cpfLogado: string | null;
  nomeLogado: string;
  setToken: (newToken: { access_token: string }) => void;
  logOut: () => void;
}

// Definindo a interface para as props do AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

// Criando o contexto de autenticação com valores padrão
const AuthContext = createContext<AuthContextType>({
  token: null,
  cpfLogado: null,
  nomeLogado: "",
  setToken: () => {},
  logOut: () => {},
});

interface DecodedToken {
  cpf: string;
  given_name: string;
  exp: number;
}

// Hook para usar o contexto de autenticação
export const useAuth = () => useContext(AuthContext);

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const token_key = "__token";
  const cpf_key = "__cpf";
  const navigate = useNavigate();

  const [cpfLogado, setcpfLogado] = useState<string | null>(() => {
    const storedCpf = localStorage.getItem(cpf_key);
    return storedCpf ? storedCpf : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    const storedToken = localStorage.getItem(token_key);
    return storedToken ? storedToken : null;
  });

  const [nomeLogado, setNomeLogado] = useState<string>("");

  useEffect(() => {
    if (token) {
      try {
        const decodedToken: DecodedToken = jwtDecode(token);
        setcpfLogado(decodedToken.cpf);
        setNomeLogado(decodedToken.given_name);
        // Agendar logout para quando o token expirar
        scheduleTokenExpiry(decodedToken.exp);
      } catch (error) {
        console.error("Error decoding token:", error);
        handleLogOut();
      }
    }
  }, [token]);

  const handleSetToken = (newToken: { access_token: string }) => {
    const tokenValue = newToken.access_token;
    setToken(tokenValue);
    if (newToken) {
      localStorage.setItem(token_key, tokenValue);
    } else {
      localStorage.removeItem(token_key);
    }

    const decodedToken: DecodedToken = jwtDecode<DecodedToken>(tokenValue);
    setcpfLogado(decodedToken.cpf);
    if (decodedToken.cpf) {
      localStorage.setItem(cpf_key, decodedToken.cpf);
    } else {
      localStorage.removeItem(cpf_key);
    }
  };

  // Função para realizar o logout automaticamente quando o token expirar
  const scheduleTokenExpiry = (expiresAt: number) => {
    const currentTime = Date.now();
    const timeUntilExpiry = expiresAt * 1000 - currentTime;

    if (timeUntilExpiry > 0) {
      setTimeout(() => {
        handleLogOut();
      }, timeUntilExpiry);
    } else {
      handleLogOut();
    }
  };

  const handleLogOut = () => {
    setToken(null);
    setcpfLogado(null); // Clear CPF on logout
    setNomeLogado("");
    localStorage.removeItem(token_key);
    localStorage.removeItem(cpf_key);
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{ token, cpfLogado, nomeLogado, setToken: handleSetToken, logOut: handleLogOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
