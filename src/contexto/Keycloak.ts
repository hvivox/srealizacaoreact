import Keycloak from "keycloak-js";

const keycloakParams = {
  url: 'http://localhost:8082/auth',
  realm: 'SREALIZACAO_REALM',
  clientId: 'SREALIZACAO_CLIENT'
};

class KeycloakSingleton {
  private static instance: Keycloak | null = null;

  private constructor() {}

  public static getInstance(): Keycloak {
    if (!KeycloakSingleton.instance) {
      if (typeof window !== 'undefined') {
        KeycloakSingleton.instance = new Keycloak(keycloakParams);
      } else {
        throw new Error("Keycloak can only be initialized in a browser environment");
      }
    }
    return KeycloakSingleton.instance;
  }
}

export default KeycloakSingleton;