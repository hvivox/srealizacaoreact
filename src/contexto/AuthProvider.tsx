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
  refreshToken: () => Promise<string | null>;
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
  refreshToken: async () => null,
});

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const isInitialized = useRef(false); // Use useRef para controlar o estado de inicialização

  const [cpfLogado, setcpfLogado] = useState<string | null>(() => sessionStorage.getItem(CPF_KEY));
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem(TOKEN_KEY));
  const [nomeLogado, setNomeLogado] = useState<string>("");
  const keycloak = KeycloakSingleton.getInstance();

  const handleLogOut = useCallback(() => {
    setToken(null);
    setcpfLogado(null); // Clear CPF on logout
    setNomeLogado("");
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(CPF_KEY);
    keycloak.logout({ redirectUri: window.location.origin });
  }, [keycloak]);

  useEffect(() => {
    // Migração: Remove dados antigos do localStorage se existirem
    const oldToken = localStorage.getItem(TOKEN_KEY);
    const oldCpf = localStorage.getItem(CPF_KEY);
    if (oldToken || oldCpf) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(CPF_KEY);
    }

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
    sessionStorage.setItem(TOKEN_KEY, tokenValue);

    const decodedToken: DecodedToken = jwtDecode<DecodedToken>(tokenValue);
    setcpfLogado(decodedToken.cpf);
    sessionStorage.setItem(CPF_KEY, decodedToken.cpf);
  };

  const handleRefreshToken = useCallback(async (): Promise<string | null> => {
    try {
      const refreshed = await keycloak.updateToken(30);
      if (refreshed && keycloak.token) {
        setToken(keycloak.token);
        sessionStorage.setItem(TOKEN_KEY, keycloak.token);
        return keycloak.token;
      }
      return token;
    } catch (error) {
      console.error("Erro ao renovar token:", error);
      handleLogOut();
      return null;
    }
  }, [keycloak, token, handleLogOut]);

  return (
    <AuthContext.Provider
      value={{
        token,
        cpfLogado,
        nomeLogado,
        setToken: handleSetToken,
        logOut: handleLogOut,
        refreshToken: handleRefreshToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
