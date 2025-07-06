import React, { createContext, useEffect, useState, useRef, ReactNode, useCallback } from "react";
import { useNavigate } from "react-router";
import jwtDecode from "jwt-decode";
import KeycloakSingleton from "./Keycloak";
import { CPF_KEY, TOKEN_KEY } from "../types/Constantes";

interface AuthContextType {
  token: string | null;
  cpfLogado: string | null;
  nomeLogado: string;
  setToken: (newToken: { access_token: string }) => void;
  logOut: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface DecodedToken {
  cpf: string;
  given_name: string;
  exp: number;
}
// contexto pode ser compartilhado e acessado por qualquer componente filho
export const AuthContext = createContext<AuthContextType>({
  token: null,
  cpfLogado: null,
  nomeLogado: "",
  setToken: () => { },
  logOut: () => { },
});

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const isInitialized = useRef(false); // Use useRef para controlar o estado de inicialização

  const [cpfLogado, setcpfLogado] = useState<string | null>(() => localStorage.getItem(CPF_KEY));
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [nomeLogado, setNomeLogado] = useState<string>("");
  const keycloak = KeycloakSingleton.getInstance();

  const handleLogOut = useCallback(() => {
    setToken(null);
    setcpfLogado(null); // Clear CPF on logout
    setNomeLogado("");
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(CPF_KEY);
    keycloak.logout({ redirectUri: window.location.origin });
  }, [keycloak]);

  useEffect(() => {
    if (!isInitialized.current && keycloak) {
      isInitialized.current = true;

      keycloak
        .init({ onLoad: "login-required" })
        .then((authenticated) => {
          if (authenticated) {
            setToken(keycloak.token!);
            sessionStorage.setItem(TOKEN_KEY, keycloak.token!);

            const decodedToken: DecodedToken = keycloak.tokenParsed as DecodedToken;
            setcpfLogado(decodedToken.cpf);
            setNomeLogado(decodedToken.given_name);
            sessionStorage.setItem(CPF_KEY, decodedToken.cpf);
          }
        })
        .catch((error) => {
          console.error("Erro ao tentar logar", error);
          isInitialized.current = false;
          handleLogOut();
        });
    }

    const refreshTokenInterval = setInterval(() => {
      keycloak
        .updateToken(30)
        .then((refreshed) => {
          if (refreshed) {
            setToken(keycloak.token!);
            sessionStorage.setItem(TOKEN_KEY, keycloak.token!);
          } else {
            console.warn(
              "Token não atualizado. Válido por " +
              Math.round(
                (keycloak.tokenParsed?.exp ?? 0) +
                (keycloak.timeSkew ?? 0) -
                new Date().getTime() / 1000
              ) +
              " seconds"
            );
          }
        })
        .catch(() => {
          console.error("Failed to refresh token");
          handleLogOut();
        });
    }, 60000);

    return () => clearInterval(refreshTokenInterval);
  }, [keycloak, navigate, handleLogOut]);

  const handleSetToken = (newToken: { access_token: string }) => {
    const tokenValue = newToken.access_token;
    setToken(tokenValue);
    localStorage.setItem(TOKEN_KEY, tokenValue);

    const decodedToken: DecodedToken = jwtDecode<DecodedToken>(tokenValue);
    setcpfLogado(decodedToken.cpf);
    localStorage.setItem(CPF_KEY, decodedToken.cpf);
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
