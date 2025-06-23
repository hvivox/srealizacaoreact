import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import "antd/dist/antd.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Modal from "react-modal";
import { BrowserRouter } from "react-router";
import { Provider } from "react-redux";
import { store } from "./redux/store.tsx";
import { MainRoutes } from "./routes/MainRoutes.tsx";
import AuthProvider from "./contexto/AuthProvider.tsx";
import useApiInterceptors from "./hooks/useApiInterceptors.ts";

function ApiInterceptorsProvider({ children }: { children: React.ReactNode }) {
  useApiInterceptors();
  return <>{children}</>;
}

Modal.setAppElement("#root");
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
          <ApiInterceptorsProvider>
            <AuthProvider>
              <MainRoutes />
            </AuthProvider>
          </ApiInterceptorsProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
