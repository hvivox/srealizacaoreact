import jwtDecode from "jwt-decode";
import { TOKEN_KEY } from "../types/Constantes";

interface DecodedToken {
  exp: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

/**
 * Verifica se um token JWT está expirado
 * @param token - Token JWT a ser validado
 * @param bufferSeconds - Segundos de buffer antes da expiração (padrão: 30)
 * @returns true se o token está expirado ou próximo de expirar
 */
export const isTokenExpired = (token: string | null, bufferSeconds: number = 30): boolean => {
  if (!token) {
    return true;
  }

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    const expirationTime = decoded.exp;
    
    // Considera expirado se faltam menos que bufferSeconds segundos
    return expirationTime - currentTime < bufferSeconds;
  } catch (error) {
    console.error("Erro ao decodificar token:", error);
    return true;
  }
};

/**
 * Obtém o token do sessionStorage
 * @returns Token ou null se não existir
 */
export const getTokenFromStorage = (): string | null => {
  return sessionStorage.getItem(TOKEN_KEY);
};

/**
 * Obtém o tempo restante até a expiração do token em segundos
 * @param token - Token JWT
 * @returns Segundos restantes até expiração, ou 0 se inválido
 */
export const getTokenTimeRemaining = (token: string | null): number => {
  if (!token) {
    return 0;
  }

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    const expirationTime = decoded.exp;
    return Math.max(0, expirationTime - currentTime);
  } catch (error) {
    console.error("Erro ao decodificar token:", error);
    return 0;
  }
};
