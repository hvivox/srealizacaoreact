import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Importe os scripts JavaScript do Bootstrap conforme necessário
import Modal from 'react-modal';

// Configurar o elemento raiz do aplicativo para acessibilidade
Modal.setAppElement('#root'); // Certifique-se de que "#root" corresponda ao ID do elemento raiz do seu aplicativo


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
