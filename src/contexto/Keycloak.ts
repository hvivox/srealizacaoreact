import Keycloak from "keycloak-js";

const keycloakParams = {
  url: import.meta.env.VITE_KEYCLOAK_URL!,
  realm: import.meta.env.VITE_KEYCLOAK_REALM!,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID!,
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