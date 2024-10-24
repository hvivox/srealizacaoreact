import React, { createContext, useContext, useEffect, useState, useRef, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import KeycloakSingleton from "./Keycloak";

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

const AuthContext = createContext<AuthContextType>({
  token: null,
  cpfLogado: null,
  nomeLogado: "",
  setToken: () => {},
  logOut: () => {},
});

export const useAuth = () => useContext(AuthContext);

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const token_key = "__token";
  const cpf_key = "__cpf";
  const navigate = useNavigate();
  const isInitialized = useRef(false); // Use useRef para controlar o estado de inicialização

  const [cpfLogado, setcpfLogado] = useState<string | null>(() => localStorage.getItem(cpf_key));
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(token_key));
  const [nomeLogado, setNomeLogado] = useState<string>("");
  const keycloak = KeycloakSingleton.getInstance();

  useEffect(() => {
    if (!isInitialized.current && keycloak) {
      isInitialized.current = true;

      keycloak
        .init({ onLoad: "login-required" })
        .then((authenticated) => {
          if (authenticated) {
            setToken(keycloak.token!);
            sessionStorage.setItem(token_key, keycloak.token!);

            const decodedToken: DecodedToken = keycloak.tokenParsed as DecodedToken;
            setcpfLogado(decodedToken.cpf);
            setNomeLogado(decodedToken.given_name);
            sessionStorage.setItem(cpf_key, decodedToken.cpf);
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
            sessionStorage.setItem(token_key, keycloak.token!);
          } else {
            console.warn(
              "Token not refreshed. Valid for " +
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
  }, [keycloak, navigate]);

  const handleSetToken = (newToken: { access_token: string }) => {
    const tokenValue = newToken.access_token;
    setToken(tokenValue);
    localStorage.setItem(token_key, tokenValue);

    const decodedToken: DecodedToken = jwtDecode<DecodedToken>(tokenValue);
    setcpfLogado(decodedToken.cpf);
    localStorage.setItem(cpf_key, decodedToken.cpf);
  };

  const handleLogOut = () => {
    setToken(null);
    setcpfLogado(null);
    setNomeLogado("");
    localStorage.removeItem(token_key);
    localStorage.removeItem(cpf_key);
    keycloak.logout({ redirectUri: window.location.origin });
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
